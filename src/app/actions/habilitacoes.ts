'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateHabilitacaoStatus(id: string, status: 'APPROVED' | 'REJECTED', reason?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = prisma;

    await p.auctionHabilitacao.update({
        where: { id },
        data: {
            status,
            reason: reason || null
        }
    });

    revalidatePath('/admin/auctions');
    revalidatePath(`/admin/auctions/[id]/habilitacoes`, 'page');
}
