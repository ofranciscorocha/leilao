'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const LotSchema = z.object({
    lotNumber: z.coerce.number().min(1, 'Lot number is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startingPrice: z.coerce.number().min(0, 'Price must be positive'),
    incrementAmount: z.coerce.number().min(0).default(50),
    imageUrl: z.string().optional(),
    auctionId: z.string().min(1, 'Auction is required'),
})

export async function createLot(prevState: any, formData: FormData) {
    const result = LotSchema.safeParse({
        lotNumber: formData.get('lotNumber'),
        title: formData.get('title'),
        description: formData.get('description'),
        startingPrice: formData.get('startingPrice'),
        incrementAmount: formData.get('incrementAmount'),
        imageUrl: formData.get('imageUrl'),
        auctionId: formData.get('auctionId'),
    })

    if (!result.success) {
        return {
            message: 'Invalid input',
            errors: result.error.flatten().fieldErrors,
        }
    }

    try {
        await prisma.lot.create({
            data: result.data,
        })

        revalidatePath('/admin/lots')
        revalidatePath(`/admin/auctions/${result.data.auctionId}`)
        return { message: 'Lot created successfully', success: true }
    } catch (e) {
        console.error(e)
        return { message: 'Database Error: Failed to create lot' }
    }
}

export async function deleteLot(id: string) {
    try {
        await prisma.lot.delete({
            where: { id }
        })
        revalidatePath('/admin/lots')
        return { message: 'Lot deleted', success: true }
    } catch (e) {
        console.error(e)
        return { message: 'Failed to delete lot' }
    }
}
