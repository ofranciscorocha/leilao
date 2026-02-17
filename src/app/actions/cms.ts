'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getBanners(position: string = 'HOME_HERO') {
    try {
        return await prisma.banner.findMany({
            where: { position, active: true },
            orderBy: { order: 'asc' }
        })
    } catch (e) {
        return [] // Graceful fallback if table doesn't exist yet
    }
}

export async function createBanner(formData: FormData) {
    const title = formData.get('title') as string
    const imageUrl = formData.get('imageUrl') as string
    const linkUrl = formData.get('linkUrl') as string
    const position = formData.get('position') as string

    try {
        await prisma.banner.create({
            data: {
                title,
                imageUrl,
                linkUrl,
                position,
                active: true
            }
        })
        revalidatePath('/')
        revalidatePath('/admin/cms/banners')
        return { success: true, message: 'Banner criado com sucesso!' }
    } catch (error) {
        console.error('Failed to create banner:', error)
        return { success: false, message: 'Erro ao criar banner.' }
    }
}

export async function deleteBanner(id: string) {
    try {
        await prisma.banner.delete({ where: { id } })
        revalidatePath('/')
        revalidatePath('/admin/cms/banners')
        return { success: true, message: 'Banner removido.' }
    } catch (error) {
        return { success: false, message: 'Erro ao remover banner.' }
    }
}

export async function toggleBannerStatus(id: string, active: boolean) {
    try {
        await prisma.banner.update({
            where: { id },
            data: { active }
        })
        revalidatePath('/')
        revalidatePath('/admin/cms/banners')
        return { success: true, message: 'Status atualizado.' }
    } catch (error) {
        return { success: false, message: 'Erro ao atualizar status.' }
    }
}
