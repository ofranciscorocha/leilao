'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function approveConditional(lotId: string, currentStatus: string) {
    if (currentStatus !== 'CONDICIONAL') throw new Error('O lote não está em condicional');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = prisma;

    // Na nossa máquina de estados (Fase 3), "VENDIDO" é o term correto finalizado
    await p.lot.update({
        where: { id: lotId },
        data: {
            status: 'VENDIDO',
            // Ao aprovar o condicional, também podemos setar o winnerId pro bidder atual (opcional)
        }
    });

    revalidatePath('/admin/auctions/[id]/condicionais', 'page');
    revalidatePath('/admin/auctions/[id]', 'page');
}

export async function rejectConditional(lotId: string, currentStatus: string) {
    if (currentStatus !== 'CONDICIONAL') throw new Error('O lote não está em condicional');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = prisma;

    await p.lot.update({
        where: { id: lotId },
        data: {
            status: 'NAO_VENDIDO',
            currentBid: null, // Wipe bid if we reject
            currentBidderId: null
        }
    });

    revalidatePath('/admin/auctions/[id]/condicionais', 'page');
    revalidatePath('/admin/auctions/[id]', 'page');
}
