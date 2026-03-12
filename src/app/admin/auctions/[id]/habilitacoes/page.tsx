import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserCheck, Check, X, ShieldAlert } from 'lucide-react'
import { updateHabilitacaoStatus } from '@/app/actions/habilitacoes'

export const dynamic = 'force-dynamic';

export default async function HabilitacoesPage({ params }: { params: { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = prisma;
    const auction = await p.auction.findUnique({
        where: { id: params.id },
        select: { id: true, title: true }
    });

    if (!auction) notFound();

    const habilitacoes = await p.auctionHabilitacao.findMany({
        where: { auctionId: params.id },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    // Filtros visuais
    const pending = habilitacoes.filter((h: any) => h.status === 'PENDING');
    const approved = habilitacoes.filter((h: any) => h.status === 'APPROVED');
    const rejected = habilitacoes.filter((h: any) => h.status === 'REJECTED');

    return (
        <div className="space-y-4 pb-12 text-[13px] text-[#333]">
            {/* Top Bar / Header */}
            <div className="bg-white border-t-[3px] border-t-[#3c8dbc] shadow-sm flex items-center justify-between p-3 rounded-sm">
                <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    <h1 className="m-0 text-[18px] font-normal" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
                        Habilitações - Leilão {auction.title}
                    </h1>
                </div>
                <Link href={`/admin/auctions/${auction.id}`} className="bg-white border border-[#d2d6de] hover:bg-[#f4f4f4] px-3 py-1.5 rounded-sm flex items-center gap-1 font-bold transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Leilão
                </Link>
            </div>

            {/* Dashboard / Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[#d2d6de] rounded-sm p-3 flex justify-between shadow-sm border-l-4 border-l-yellow-500">
                    <span className="font-bold text-gray-600">Pendentes de Análise</span>
                    <span className="text-xl font-bold">{pending.length}</span>
                </div>
                <div className="bg-white border border-[#d2d6de] rounded-sm p-3 flex justify-between shadow-sm border-l-4 border-l-green-500">
                    <span className="font-bold text-gray-600">Aprovados</span>
                    <span className="text-xl font-bold text-green-600">{approved.length}</span>
                </div>
                <div className="bg-white border border-[#d2d6de] rounded-sm p-3 flex justify-between shadow-sm border-l-4 border-l-red-500">
                    <span className="font-bold text-gray-600">Recusados (Bloqueados)</span>
                    <span className="text-xl font-bold text-red-600">{rejected.length}</span>
                </div>
            </div>

            {/* Main Content Table */}
            <div className="bg-white rounded-sm shadow-sm border border-[#d2d6de] overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-[#f4f4f4]">
                    <h3 className="font-bold text-[#333] m-0">Lista de Solicitações (Arrematantes)</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f4f4f4] border-b border-[#f4f4f4] text-gray-600">
                                <th className="p-3 font-bold text-xs uppercase text-center w-[120px]">Data Solicitação</th>
                                <th className="p-3 font-bold text-xs uppercase">Arrematante</th>
                                <th className="p-3 font-bold text-xs uppercase">Documento (CPF/CNPJ)</th>
                                <th className="p-3 font-bold text-xs uppercase">Termos do Edital?</th>
                                <th className="p-3 font-bold text-xs uppercase text-center w-[150px]">Status</th>
                                <th className="p-3 font-bold text-xs uppercase text-center w-[200px]">Auditoria / Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habilitacoes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-6 text-gray-500">
                                        Nenhuma solicitação de habilitação encontrada para este leilão.
                                    </td>
                                </tr>
                            ) : (
                                habilitacoes.map((hab: any) => (
                                    <tr key={hab.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                                        <td className="p-3 text-center text-xs text-gray-500">
                                            {hab.createdAt.toLocaleString('pt-BR')}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-[#3c8dbc]">{hab.user.name}</div>
                                            <div className="text-xs text-gray-500">{hab.user.email}</div>
                                        </td>
                                        <td className="p-3 font-mono text-xs">
                                            {hab.user.type === 'PF' ? hab.user.cpf : hab.user.cnpj}
                                        </td>
                                        <td className="p-3 text-xs">
                                            {hab.agreedToTerms ? (
                                                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">Aceitou Online</span>
                                            ) : (
                                                <span className="text-gray-500">Não confirmado</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center">
                                            {hab.status === 'PENDING' && <span className="text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200">Pendente</span>}
                                            {hab.status === 'APPROVED' && <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">Aprovado</span>}
                                            {hab.status === 'REJECTED' && <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">Recusado</span>}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-1">
                                                {hab.status !== 'APPROVED' && (
                                                    <form action={updateHabilitacaoStatus.bind(null, hab.id, 'APPROVED', '')}>
                                                        <button type="submit" title="Exaltar / Aprovar para Lances" className="bg-[#00a65a] hover:bg-[#008d4c] text-white p-1.5 rounded-sm transition-colors cursor-pointer group flex items-center">
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    </form>
                                                )}
                                                {hab.status !== 'REJECTED' && (
                                                    <form action={updateHabilitacaoStatus.bind(null, hab.id, 'REJECTED', 'Reprovado por Auditoria Manual')}>
                                                        <button type="submit" title="Recusar Participação" className="border border-[#dd4b39] text-[#dd4b39] hover:bg-[#dd4b39] hover:text-white p-1.5 rounded-sm transition-colors cursor-pointer flex items-center">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </form>
                                                )}
                                                {hab.status === 'REJECTED' && (
                                                    <button type="button" title={hab.reason || 'Sem justificativa gravada'} className="bg-gray-200 text-gray-600 p-1.5 rounded-sm cursor-help flex items-center">
                                                        <ShieldAlert className="w-4 h-4" />
                                                    </button>
                                                )}
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
