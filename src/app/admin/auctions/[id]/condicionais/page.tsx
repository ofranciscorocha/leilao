import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, X, Scale } from 'lucide-react'
import { approveConditional, rejectConditional } from '@/app/actions/condicionais'

export const dynamic = 'force-dynamic';

export default async function LotesCondicionaisPage({ params }: { params: { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = prisma;
    const auction = await p.auction.findUnique({
        where: { id: params.id },
        select: { id: true, title: true }
    });

    if (!auction) notFound();

    // Buscar lotes condicionais
    const conditionalLots = await p.lot.findMany({
        where: {
            auctionId: params.id,
            status: 'CONDICIONAL'
        },
        include: { currentBidder: true },
        orderBy: { lotNumber: 'asc' }
    });

    return (
        <div className="space-y-4 pb-12 text-[13px] text-[#333]">
            {/* Top Bar / Header */}
            <div className="bg-white border-t-[3px] border-t-[#f39c12] shadow-sm flex items-center justify-between p-3 rounded-sm">
                <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#f39c12]" />
                    <h1 className="m-0 text-[18px] font-normal" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
                        Lotes Condicionais - Leilão {auction.title}
                    </h1>
                </div>
                <Link href={`/admin/auctions/${auction.id}`} className="bg-white border border-[#d2d6de] hover:bg-[#f4f4f4] px-3 py-1.5 rounded-sm flex items-center gap-1 font-bold transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Leilão
                </Link>
            </div>

            {/* Main Content Table */}
            <div className="bg-white rounded-sm shadow-sm border border-[#d2d6de] overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-[#f4f4f4]">
                    <h3 className="font-bold text-[#333] m-0">Aguardando Avaliação do Comitente</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f4f4f4] border-b border-[#f4f4f4] text-gray-600">
                                <th className="p-3 font-bold text-xs uppercase text-center w-[80px]">Lote</th>
                                <th className="p-3 font-bold text-xs uppercase">Bem / Descrição</th>
                                <th className="p-3 font-bold text-xs uppercase">Licitante (Condicional)</th>
                                <th className="p-3 font-bold text-xs uppercase text-right">Avaliação FIPE/Mínima</th>
                                <th className="p-3 font-bold text-xs uppercase text-right">Lance Parado</th>
                                <th className="p-3 font-bold text-xs uppercase text-center w-[200px]">Auditoria / Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conditionalLots.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-6 text-gray-500 font-bold">
                                        Nenhum lote condicional pendente neste leilão.
                                    </td>
                                </tr>
                            ) : (
                                conditionalLots.map((lot: any) => (
                                    <tr key={lot.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                                        <td className="p-3 text-center text-xl font-bold text-gray-700">
                                            {String(lot.lotNumber).padStart(3, '0')}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-[#3c8dbc]">{lot.title}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-sm">{lot.description}</div>
                                            <div className="text-[10px] text-yellow-600 mt-1 uppercase font-bold tracking-wider">Status: Condicional</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold">{lot.currentBidder?.name || 'Venda Presencial / Externa'}</div>
                                            {lot.currentBidder && <div className="text-xs text-gray-500">{lot.currentBidder.cpf || lot.currentBidder.cnpj}</div>}
                                        </td>
                                        <td className="p-3 text-right text-gray-500">
                                            <div>Mín: R$ {(lot.reservePrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="font-bold text-lg text-[#f39c12]">R$ {(lot.currentBid || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">
                                                <form action={approveConditional.bind(null, lot.id, lot.status)}>
                                                    <button type="submit" title="Aprovar Condicional (Vendido)" className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-2 py-1.5 rounded-sm transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs">
                                                        <Check className="w-4 h-4" /> Aprovar
                                                    </button>
                                                </form>
                                                <form action={rejectConditional.bind(null, lot.id, lot.status)}>
                                                    <button type="submit" title="Recusar Condicional (Não Vendido)" className="border border-[#dd4b39] text-[#dd4b39] hover:bg-[#dd4b39] hover:text-white px-2 py-1.5 rounded-sm transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs">
                                                        <X className="w-4 h-4" /> Recusar
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
