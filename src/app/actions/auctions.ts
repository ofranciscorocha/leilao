'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createAuction(formData: FormData) {
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const type = formData.get('type') as string;
    const status = formData.get('status') as string;
    const modalidade = formData.get('modalidade') as string;

    // Dates
    const biddingStart = formData.get('biddingStart') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    // Fees & Admin
    const taxaAdministrativa = parseFloat(formData.get('taxaAdministrativa') as string) || null;
    const comissaoLeiloeiro = parseFloat(formData.get('comissaoLeiloeiro') as string) || null;
    const caucao = formData.get('caucao') === 'on';
    const caucaoValor = parseFloat(formData.get('caucaoValor') as string) || null;

    // Visitation
    const visitacaoLocal = formData.get('visitacaoLocal') as string;
    const visitacaoInicio = formData.get('visitacaoInicio') as string;
    const visitacaoFim = formData.get('visitacaoFim') as string;

    // Auctioneer & Rules
    const leiloeiroNome = formData.get('leiloeiroNome') as string;
    const leiloeiroMatricula = formData.get('leiloeiroMatricula') as string;
    const editalRegras = formData.get('editalRegras') as string;

    // Settings & Live
    const overtimeSeconds = parseInt(formData.get('overtimeSeconds') as string) || 120;
    const videoEmbedUrl = formData.get('videoEmbedUrl') as string;

    if (!title || !startDate || !endDate) {
        throw new Error('Title and dates are required');
    }

    await prisma.auction.create({
        data: {
            title,
            summary,
            type: type || 'ONLINE',
            status: status || 'UPCOMING',
            modalidade: modalidade || 'PUBLIC',
            biddingStart: biddingStart ? new Date(biddingStart) : null,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            overtimeSeconds,
            videoEmbedUrl: videoEmbedUrl || null,
            taxaAdministrativa,
            comissaoLeiloeiro,
            caucao,
            caucaoValor,
            visitacaoLocal,
            visitacaoInicio: visitacaoInicio ? new Date(visitacaoInicio) : null,
            visitacaoFim: visitacaoFim ? new Date(visitacaoFim) : null,
            leiloeiroNome,
            leiloeiroMatricula,
            editalRegras,
        }
    });

    redirect(`/admin/auctions`);
}
