'use client'

import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { placeBid } from '@/app/actions/bid'

interface LiveAuditoriumProps {
    auctionId: string
    initialData: any // Replace with proper type
    userId?: string
    userName?: string
}

export function LiveAuditorium({ auctionId, initialData, userId, userName }: LiveAuditoriumProps) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [currentLot, setCurrentLot] = useState(initialData.currentLot || initialData.lots[0])
    const [bids, setBids] = useState<any[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const [timer, setTimer] = useState<string>('00:00')
    const [isOvertime, setIsOvertime] = useState(false)
    const [lastBidder, setLastBidder] = useState<string | null>(null)

    // Audio Refs
    const audioBid = useRef<HTMLAudioElement | null>(null)
    const audioHammer = useRef<HTMLAudioElement | null>(null)

    // Connect to Socket
    useEffect(() => {
        // Assume custom server is on same host:port, or port 3001 if dev
        // For production, usually same origin. For dev with separate server.ts:
        const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001' : ''
        const newSocket = io(socketUrl, {
            transports: ['websocket'],
            reconnectionAttempts: 5
        })

        newSocket.on('connect', () => {
            console.log('Connected to Auction Server')
            setIsConnected(true)
            newSocket.emit('join_auction', auctionId)
        })

        newSocket.on('disconnect', () => setIsConnected(false))

        newSocket.on('auction_update', (data) => {
            // Handle full state update
            if (data.currentLotId && data.currentLotId !== currentLot.id) {
                // Switch lot logic here
            }
        })

        newSocket.on('bid_update', (data) => {
            // data: { lotId, amount, bidderName, timestamp }
            if (data.data.lotId === currentLot.id) {
                setCurrentLot((prev: any) => ({ ...prev, currentBid: data.data.amount }))
                setBids((prev) => [data.data, ...prev])
                setLastBidder(data.data.bidderName)

                // Play Sound
                if (audioBid.current) audioBid.current.play().catch(() => { })
            }
        })

        newSocket.on('timer_update', (data) => {
            // data: { endTime, reason }
            if (data.reason === 'OVERTIME') {
                setIsOvertime(true)
                toast.warning('DOU-LHE UMA! Tempo estendido!')
            }
            // Update local timer logic... (simplified here, usually use a hook for countdown)
        })

        newSocket.on('admin_event', (data) => {
            if (data.type === 'HAMMER') {
                if (audioHammer.current) audioHammer.current.play().catch(() => { })
                toast.success(`Lote Arrematado por ${formatCurrency(data.amount)}!`)
            }
        })

        setSocket(newSocket)

        // Initialize Audio
        audioBid.current = new Audio('/sounds/bid.mp3')
        audioHammer.current = new Audio('/sounds/hammer.mp3')

        return () => {
            newSocket.disconnect()
        }
    }, [auctionId, currentLot.id])

    const handleQuickBid = async () => {
        if (!userId) {
            toast.error('Faça login para dar lances.')
            return
        }

        const nextBid = (currentLot.currentBid || currentLot.startingPrice) + (currentLot.incrementAmount || 50)

        // Optimistic Update? No, wait for server/socket for Absolute Sync.
        // But show loading state on button.
        const res = await placeBid(currentLot.id, nextBid, userName || 'Guest')

        if (!res.success) {
            toast.error(res.message)
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-gray-900 text-white">
            {/* Left: Video & Current Lot */}
            <div className="flex-1 flex flex-col p-4 gap-4">

                {/* Header / Timer */}
                <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
                    <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                        AO VIVO
                    </h2>
                    <div className={`text-2xl font-mono font-bold ${isOvertime ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {timer}
                    </div>
                </div>

                {/* Video Player Area */}
                <div className="aspect-video bg-black rounded border border-gray-700 relative flex items-center justify-center">
                    {/* Placeholder for YouTube/HLS */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <p>Aguardando transmissão...</p>
                        {/* <iframe ... /> */}
                    </div>

                    {/* Overlay: Current Image */}
                    {/* If no video, show lot image */}
                </div>

                {/* Current Lot Details */}
                <div className="bg-gray-800 p-4 rounded flex-1">
                    <div className="flex justify-between">
                        <div>
                            <Badge variant="outline" className="mb-2 text-yellow-500 border-yellow-500">Lote {currentLot.lotNumber || '001'}</Badge>
                            <h1 className="text-2xl font-bold">{currentLot.title}</h1>
                            <p className="text-gray-400">{currentLot.description?.substring(0, 100)}...</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Lance Atual</p>
                            <p className="text-4xl font-bold text-green-400">{formatCurrency(currentLot.currentBid || currentLot.startingPrice)}</p>
                        </div>
                    </div>

                    {/* Bid Button Area */}
                    <div className="mt-8 flex gap-4">
                        <Button
                            size="lg"
                            className="flex-1 h-16 text-xl font-bold bg-green-600 hover:bg-green-700 animate-pulse"
                            onClick={handleQuickBid}
                        >
                            DAR LANCE: {formatCurrency((currentLot.currentBid || currentLot.startingPrice) + (currentLot.incrementAmount || 50))}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right: Bid Log & Chat */}
            <div className="w-full lg:w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
                <div className="p-3 border-b border-gray-700 font-bold bg-gray-900">
                    Histórico de Lances
                </div>
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                        {bids.map((bid, i) => (
                            <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-700/50 rounded animate-in slide-in-from-right">
                                <div>
                                    <span className="font-bold text-blue-300">{bid.bidderName || 'Licitante'}</span>
                                    <span className="text-xs text-gray-400 block">{new Date(bid.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <span className="font-bold text-green-400">{formatCurrency(bid.amount)}</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Chat / Messages */}
                <div className="h-48 border-t border-gray-700 bg-gray-900 p-2 flex flex-col">
                    <div className="flex-1 text-xs text-gray-400 p-2">
                        <p><span className="text-yellow-500">[Sistema]:</span> Bem-vindo ao auditório!</p>
                    </div>
                    {/* Optional Chat Input */}
                </div>
            </div>
        </div>
    )
}
