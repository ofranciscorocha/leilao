'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getSystemSettings() {
    try {
        let settings = await prisma.systemSettings.findUnique({
            where: { id: 'SETTINGS' }
        })

        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    id: 'SETTINGS',
                    siteName: 'Pátio Rocha Leilões'
                }
            })
        }

        return { success: true, data: settings }
    } catch (error) {
        console.error('Failed to get settings:', error)
        return { success: false, error: 'Failed to load settings' }
    }
}

export async function updateSystemSettings(data: any) {
    try {
        const { id, ...updateData } = data

        await prisma.systemSettings.update({
            where: { id: 'SETTINGS' },
            data: updateData
        })

        revalidatePath('/')
        revalidatePath('/admin/settings')
        return { success: true, message: 'Configurações atualizadas com sucesso!' }
    } catch (error) {
        console.error('Failed to update settings:', error)
        return { success: false, message: 'Erro ao salvar configurações.' }
    }
}
