'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getBotConfig() {
    try {
        let config = await (prisma as any).botConfig.findUnique({ where: { id: 'BOT_CONFIG' } })
        if (!config) {
            config = await (prisma as any).botConfig.create({ data: { id: 'BOT_CONFIG' } })
        }
        return { success: true, data: config }
    } catch (e) {
        return { success: false, data: null }
    }
}

export async function saveBotConfig(data: any) {
    try {
        const { id, updatedAt, ...rest } = data
        await (prisma as any).botConfig.upsert({
            where: { id: 'BOT_CONFIG' },
            update: rest,
            create: { id: 'BOT_CONFIG', ...rest }
        })
        revalidatePath('/admin/bot')
        revalidatePath('/admin/bot/config')
        revalidatePath('/admin/bot/instagram')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}
