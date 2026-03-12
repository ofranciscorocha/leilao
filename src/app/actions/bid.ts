'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function placeBid(lotId: string, amount: number, bidderName: string) {
    try {
        // 1. Find or Create a "Guest" User for this session/bidder
        // In a real app, we'd use auth session. Here, we simulate it for functionality.
        let user = await prisma.user.findFirst({
            where: { email: `${bidderName.toLowerCase().replace(/\s/g, '')}@example.com` }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: bidderName,
                    email: `${bidderName.toLowerCase().replace(/\s/g, '')}@example.com`,
                    password: 'guest_password_123', // Dummy password
                    role: 'USER'
                }
            })
        }

        // 2. Validate Bid & Lot Status
        const lot = await prisma.lot.findUnique({
            where: { id: lotId },
            include: { auction: true }
        })

        if (!lot) return { success: false, message: 'Lote não encontrado.' }
        if (lot.status !== 'OPEN' && lot.auction.status !== 'LIVE' && lot.status !== 'PENDING') {
            // Allow PENDING for testing or OPEN. Reference prompt says "Status (Vendido, Condicional, Sustado)"
            // check if auction is open
            return { success: false, message: 'Lote não está aberto para lances.' }
        }

        const currentPrice = lot.currentBid || lot.startingPrice
        const minIncrement = lot.incrementAmount || 50
        const minBid = currentPrice + minIncrement

        if (amount < minBid) {
            return { success: false, message: `O lance deve ser de no mínimo ${minBid.toFixed(2)}` }
        }

        // 3. Transaction: Create Bid + Update Lot + Check Overtime
        await prisma.$transaction(async (tx) => {
            // A. Create Bid
            await tx.bid.create({
                data: {
                    amount,
                    lotId,
                    userId: user.id,
                    type: 'MANUAL'
                }
            })

            // B. Update Lot Price & Winner
            await tx.lot.update({
                where: { id: lotId },
                data: {
                    currentBid: amount,
                    winnerId: user.id,
                    status: 'OPEN' // Ensure it's open
                }
            })

            // C. Overtime Logic (Master Prompt)
            // "Se um lance ocorrer nos últimos segundos... cronômetro deve resetar"
            const now = new Date()
            const auctionEndTime = new Date(lot.auction.endDate)
            const timeRemaining = auctionEndTime.getTime() - now.getTime()
            const overtimeThreshold = 30000 // 30 seconds (configurable per blueprint, but hardcoded for safety now)

            if (timeRemaining < overtimeThreshold) {
                // Add Overtime (e.g. +60s)
                const newEndDate = new Date(now.getTime() + 60000)

                await tx.auction.update({
                    where: { id: lot.auctionId },
                    data: { endDate: newEndDate }
                })

                // Notify Socket about Timer Reset
                // We'll do this outside transaction to avoid blocking, but for strict sync, we prepare data
            }
        })

        // 4. Notify Real-Time Server (Bridge)
        try {
            await fetch('http://localhost:3001/api/socket-notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'bid_update',
                    roomId: lot.auctionId,
                    data: {
                        lotId,
                        amount,
                        bidderName: user.name, // Mascarar no frontend
                        timestamp: new Date()
                    }
                })
            })
        } catch (err) {
            console.error('Socket notification failed:', err)
        }

        revalidatePath(`/auctions/${lot.auctionId}`)
        return { success: true, message: 'Lance realizado com sucesso!' }
    } catch (error) {
        console.error('Failed to place bid:', error)
        return { success: false, message: 'Erro ao processar o lance.' }
    }
}
