'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const AuctionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    status: z.enum(['OPEN', 'CLOSED', 'UPCOMING']).default('OPEN'),
})

export async function createAuction(prevState: any, formData: FormData) {
    const result = AuctionSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        imageUrl: formData.get('imageUrl'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        status: formData.get('status'),
    })

    if (!result.success) {
        return {
            message: 'Invalid input',
            errors: result.error.flatten().fieldErrors,
        }
    }

    try {
        await prisma.auction.create({
            data: result.data,
        })

        revalidatePath('/admin/auctions')
        return { message: 'Auction created successfully', success: true }
    } catch (e) {
        console.error(e)
        return { message: 'Database Error: Failed to create auction' }
    }
}

export async function deleteAuction(id: string) {
    try {
        await prisma.auction.delete({
            where: { id }
        })
        revalidatePath('/admin/auctions')
        return { message: 'Auction deleted', success: true }
    } catch (e) {
        console.error(e)
        return { message: 'Failed to delete auction' }
    }
}
