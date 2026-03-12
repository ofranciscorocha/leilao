import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PrintButton } from "@/components/vistoria/printbutton"

export const dynamic = 'force-dynamic';

export default async function AtaDeLeilaoPage({ params }: { params: { auctionId: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = prisma;
    const auction = await p.auction.findUnique({
        where: { id: params.auctionId },
        include: {
            comitente: true,
            lots: {
                orderBy: { lotNumber: 'asc' },
                include: { winner: true }
            }
        }
    });

    if (!auction) notFound();

    const lots = auction.lots || [];
    const soldLots = lots.filter((l: any) => l.status === 'VENDIDO' || l.winnerId != null);
    const conditionalLots = lots.filter((l: any) => l.status === 'CONDICIONAL');
    const unsoldLots = lots.filter((l: any) => l.status === 'NAO_VENDIDO' || l.status === 'REPASSE');

    const totalSoldValue = soldLots.reduce((acc: number, l: any) => acc + (l.currentBid || l.startingPrice || 0), 0);
    const totalConditionalValue = conditionalLots.reduce((acc: number, l: any) => acc + (l.currentBid || l.startingPrice || 0), 0);

    const leiloeiroComissao = auction.comissaoLeiloeiro || 5;

    return (
        <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:py-0">
            <div className="max-w-4xl mx-auto bg-white p-10 shadow-lg border border-gray-200 rounded-sm print:shadow-none print:border-none print:p-0 font-serif text-[13px] text-justify leading-relaxed">

                {/* Header Off-screen actions */}
                <div className="mb-6 flex justify-end print:hidden">
                    <PrintButton />
                </div>

                {/* Document Header */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
                    <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">ATA DE REALIZAÇÃO DE LEILÃO</h1>
                    <h2 className="text-lg font-bold text-gray-700">LEILÃO OFICIAL Nº {auction.id.slice(0, 6).toUpperCase()} / {new Date().getFullYear()}</h2>
                    <p className="text-sm mt-2 text-gray-500 uppercase">
                        LEILOEIRO OFICIAL: {auction.leiloeiroNome || 'IVANA MONTENEGRO CASTELO BRANCO ROCHA'} - MATRÍCULA {auction.leiloeiroMatricula || 'JUCEB 18/902440-2'}
                    </p>
                </div>

                {/* Resumo do Evento */}
                <div className="mb-6">
                    <p>
                        Aos <strong>{auction.startDate?.getDate()}</strong> dias do mês de <strong>{auction.startDate?.toLocaleString('pt-BR', { month: 'long' })}</strong> do ano de <strong>{auction.startDate?.getFullYear()}</strong>,
                        na {auction.visitacaoLocal || 'Auditório Virtual da Plataforma Pátio Rocha Leilões'},
                        peticionou-se a abertura da sessão pública do leilão referenciado pela descrição: <strong>&quot;{auction.title}&quot;</strong>.
                        O evento, do tipo <strong>{auction.type}</strong> e modalidade <strong>{auction.modalidade || 'Pública'}</strong>,
                        contou com {auction.enableGuestBids ? 'habilitação aberta ao público' : 'restrições de auditoria via plataforma'},
                        sob o comitente primário: <strong>{auction.comitente?.razaoSocial || 'Múltiplos Comitentes'} {auction.comitente?.cnpjCpf ? `(CNPJ: ${auction.comitente.cnpjCpf})` : ''}</strong>.
                    </p>
                </div>

                {/* Totalizadores */}
                <div className="bg-gray-50 p-4 border border-gray-200 mb-6 print:bg-white print:border-black font-sans text-sm">
                    <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-2">RESUMO FINANCEIRO E DE LOTEAMENTO</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p><strong>Total de Lotes Apresentados:</strong> {lots.length}</p>
                            <p><strong>Lotes Arrematados (Vendidos):</strong> {soldLots.length}</p>
                            <p><strong>Lotes em Condicional:</strong> {conditionalLots.length}</p>
                            <p><strong>Lotes Não Vendidos / Repasse:</strong> {unsoldLots.length}</p>
                        </div>
                        <div className="text-right">
                            <p><strong>Soma Total Arrematada:</strong> R$ {totalSoldValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p><strong>Soma Total Condicional:</strong> R$ {totalConditionalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p><strong>Estimativa Comissões ({leiloeiroComissao}%):</strong> R$ {((totalSoldValue * leiloeiroComissao) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </div>

                {/* Lista de Vendidos */}
                <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3 uppercase border-b border-black pb-1">Relação de Lotes Arrematados</h3>
                    {soldLots.length === 0 ? (
                        <p className="italic text-gray-500">Nenhum lote foi consolidado como vendido nesta ata.</p>
                    ) : (
                        <table className="w-full text-left border-collapse font-sans text-[11px]">
                            <thead>
                                <tr className="bg-gray-100 border-y border-black">
                                    <th className="p-2 w-12 text-center">Nº</th>
                                    <th className="p-2">Bem / Descrição</th>
                                    <th className="p-2 w-32">Arrematante / Doc</th>
                                    <th className="p-2 w-28 text-right">Valor Final (R$)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {soldLots.map((l: any) => (
                                    <tr key={l.id} className="border-b border-gray-200">
                                        <td className="p-2 text-center font-bold">{String(l.lotNumber).padStart(3, '0')}</td>
                                        <td className="p-2">
                                            <div className="font-bold">{l.title}</div>
                                            <div className="text-[10px] text-gray-500 max-w-xs truncate">{l.description}</div>
                                            <div className="text-[10px] text-gray-500">Comitente: {l.comitente || auction.comitente?.razaoSocial || '--'}</div>
                                        </td>
                                        <td className="p-2 font-mono">
                                            <div className="font-bold">{l.winner?.name || l.currentBidder?.name || 'Venda Externa'}</div>
                                            <div className="text-[9px]">{l.winner?.cpf || l.winner?.cnpj || '--'}</div>
                                        </td>
                                        <td className="p-2 text-right font-bold">
                                            {(l.currentBid || l.startingPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Assinaturas */}
                <div className="mt-20 pt-10 border-t border-gray-300">
                    <p className="text-center mb-16">
                        Nada mais havendo a tratar, a presente sessão foi encerrada, sendo lavrada a presente ata,<br />
                        que lida e achada conforme, vai assinada pelo Leiloeiro Oficial.
                    </p>
                    <div className="flex justify-center mt-12">
                        <div className="w-64 border-t border-black text-center pt-2">
                            <p className="font-bold uppercase text-sm">{auction.leiloeiroNome || 'IVANA MONTENEGRO CASTELO BRANCO ROCHA'}</p>
                            <p className="text-xs text-gray-600">Leiloeiro Público Oficial da Bahia</p>
                            <p className="text-xs text-gray-600">Matrícula: {auction.leiloeiroMatricula || 'JUCEB 18/902440-2'}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
