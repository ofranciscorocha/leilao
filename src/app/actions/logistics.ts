'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createVehicleEntry(formData: FormData) {
    const title = formData.get('title') as string
    const lotNumber = parseInt(formData.get('lotNumber') as string)
    const auctionId = formData.get('auctionId') as string
    const storageLocation = formData.get('storageLocation') as string
    const keyLocation = formData.get('keyLocation') as string

    // Basic validation
    if (!title || !auctionId || !lotNumber) {
        return { success: false, message: 'Campos obrigatórios faltando.' }
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Create Lot
            const lot = await tx.lot.create({
                data: {
                    title,
                    lotNumber,
                    auctionId,
                    startingPrice: parseFloat(formData.get('startingPrice') as string || '0'),
                    description: formData.get('description') as string,
                    status: 'PENDING'
                }
            })

            // 2. Create Logistics Entry
            await tx.lotLogistics.create({
                data: {
                    lotId: lot.id,
                    storageLocation,
                    keyLocation,
                    hasKeys: formData.get('hasKeys') === 'on',
                    hasManual: formData.get('hasManual') === 'on',
                    entryDate: new Date()
                }
            })

            // 3. Create Empty Inspection Record
            await tx.vehicleInspection.create({
                data: {
                    lotId: lot.id,
                    status: 'PENDING' // Custom field or just exist
                }
            })
        })

        revalidatePath('/admin/logistics')
        return { success: true, message: 'Veículo registrado no pátio com sucesso!' }
    } catch (error) {
        console.error('Failed to create entry:', error)
        return { success: false, message: 'Erro ao registrar entrada.' }
    }
}

export async function submitInspection(lotId: string, data: any) {
    try {
        await prisma.vehicleInspection.upsert({
            where: { lotId },
            create: {
                lotId,
                engineStatus: data.engineStatus,
                transmission: data.transmission,
                bodywork: data.bodywork,
                checklist: JSON.stringify(data.checklist),
                notes: data.notes
            },
            update: {
                engineStatus: data.engineStatus,
                transmission: data.transmission,
                bodywork: data.bodywork,
                checklist: JSON.stringify(data.checklist),
                notes: data.notes
            }
        })

        // Auto-update Lot condition based on bodywork/engine
        // e.g., if bodywork is TOTAL_LOSS, set condition to SUCATA
        let condition = 'RECUPERAVEL'
        if (data.bodywork === 'TOTAL_LOSS' || data.engineStatus === 'MISSING') {
            condition = 'SUCATA'
        }

        await prisma.lot.update({
            where: { id: lotId },
            data: { condition }
        })

        revalidatePath(`/admin/logistics/inspection/${lotId}`)
        return { success: true, message: 'Vistoria salva com sucesso!' }
    } catch (error) {
        console.error('Failed to submit inspection:', error)
        return { success: false, message: 'Erro ao salvar vistoria.' }
    }
}
