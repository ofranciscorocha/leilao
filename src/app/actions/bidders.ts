'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateBidderStatus(userId: string, status: string, reason?: string) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                status: status,
                internalNotes: reason ? `[${new Date().toLocaleDateString('pt-BR')}] Status alterado para ${status}. Motivo: ${reason}\n\n` : undefined
            }
        })

        // NOTE: Here we would send the email to the user
        console.log(`[EMAIL SIMULATION] To: ${user.email} | Subject: Atualização de Cadastro - Pátio Rocha Leilões`);
        console.log(`[EMAIL SIMULATION] Body: Seu cadastro foi atualizado para o status: ${status}. ${reason ? `Motivo: ${reason}` : ''}`);

        revalidatePath(`/admin/bidders/${userId}`)
        revalidatePath('/admin/dashboard')
        revalidatePath('/admin/bidders')

        return { success: true, message: `Status alterado para ${status}` }
    } catch (e) {
        console.error('Error updating bidder status:', e)
        return { success: false, message: 'Erro ao atualizar o status do arrematante.' }
    }
}
