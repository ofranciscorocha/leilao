import { FileText, TrendingUp, DollarSign, Users, Package, Gavel } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function GeneralReportsPage() {
    // Queries
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = prisma;
    const totalAuctions = await p.auction.count();
    const activeAuctions = await p.auction.count({ where: { status: 'OPEN' } });

    const totalLots = await p.lot.count();
    const availableLots = await p.lot.count({ where: { status: 'AVAILABLE' } });
    const logisticsLots = await p.lot.count({ where: { status: 'EM_ESTOQUE' } });

    const totalUsers = await p.user.count();
    const activeUsers = await p.user.count({ where: { status: 'ACTIVE' } });

    // Aggregate values
    const valueAggregation = await p.lot.aggregate({
        _sum: {
            startingPrice: true,
            fipeValor: true,
        }
    });

    const totalBaseValue = valueAggregation._sum.startingPrice || 0;
    const totalFipeValue = valueAggregation._sum.fipeValor || 0;

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[#333]">
                    <TrendingUp className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0 flex items-center gap-2">
                        Relatórios Gerais <span className="text-[18px] text-gray-400">Desempenho Global</span>
                    </h1>
                </div>
            </div>

            {/* KPI Cards Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Patromonio Estimado */}
                <div className="bg-[#00a65a] rounded-sm shadow-sm text-white relative overflow-hidden flex flex-col justify-between h-[120px]">
                    <div className="p-4 z-10">
                        <h3 className="text-3xl font-bold m-0 z-10">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalBaseValue)}
                        </h3>
                        <p className="m-0 text-sm mt-1 z-10 text-green-100 uppercase font-bold">Patrimônio Base (Pátios)</p>
                    </div>
                    <div className="absolute right-[-10px] top-[10px] text-green-700 opacity-40 z-0">
                        <DollarSign size={80} />
                    </div>
                </div>

                {/* Arrematantes */}
                <div className="bg-[#00c0ef] rounded-sm shadow-sm text-white relative overflow-hidden flex flex-col justify-between h-[120px]">
                    <div className="p-4 z-10">
                        <h3 className="text-4xl font-bold m-0 z-10">{totalUsers}</h3>
                        <p className="m-0 text-sm mt-1 z-10 text-cyan-100 uppercase font-bold">Arrematantes ({activeUsers} Ativos)</p>
                    </div>
                    <div className="absolute right-[-10px] top-[10px] text-cyan-600 opacity-40 z-0">
                        <Users size={80} />
                    </div>
                </div>

                {/* Leilões */}
                <div className="bg-[#f39c12] rounded-sm shadow-sm text-white relative overflow-hidden flex flex-col justify-between h-[120px]">
                    <div className="p-4 z-10">
                        <h3 className="text-4xl font-bold m-0 z-10">{totalAuctions}</h3>
                        <p className="m-0 text-sm mt-1 z-10 text-yellow-100 uppercase font-bold">Leilões Cadastrados ({activeAuctions} Abertos)</p>
                    </div>
                    <div className="absolute right-[-10px] top-[10px] text-yellow-600 opacity-40 z-0">
                        <Gavel size={80} />
                    </div>
                </div>

                {/* Lotes */}
                <div className="bg-[#dd4b39] rounded-sm shadow-sm text-white relative overflow-hidden flex flex-col justify-between h-[120px]">
                    <div className="p-4 z-10">
                        <h3 className="text-4xl font-bold m-0 z-10">{totalLots}</h3>
                        <p className="m-0 text-sm mt-1 z-10 text-red-100 uppercase font-bold">Lotes no Pátio ({logisticsLots} Estoque, {availableLots} Prontos)</p>
                    </div>
                    <div className="absolute right-[-10px] top-[10px] text-red-600 opacity-40 z-0">
                        <Package size={80} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Bloco 1: Relatórios Financeiros */}
                <div className="bg-white rounded-sm shadow-sm border-t-[3px] border-t-[#00a65a]">
                    <div className="p-3 border-b border-[#f4f4f4]">
                        <h3 className="font-bold text-[#333] m-0 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#00a65a]" /> Financeiro e Faturamento
                        </h3>
                    </div>
                    <div className="p-4 flex flex-col text-[14px] text-[#333] space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-dashed border-[#eee]">
                            <span>Relatório de Comissões e Taxas (Últimos 30 dias)</span>
                            <button className="bg-[#f4f4f4] hover:bg-[#e4e4e4] border border-[#d2d6de] px-3 py-1 rounded-sm transition-colors text-[#333] flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Gerar PDF
                            </button>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-dashed border-[#eee]">
                            <span>Extrato de Pagamentos Pendentes de Arrematantes</span>
                            <button className="bg-[#f4f4f4] hover:bg-[#e4e4e4] border border-[#d2d6de] px-3 py-1 rounded-sm transition-colors text-[#333] flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Gerar PDF
                            </button>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-dashed border-[#eee]">
                            <span>Demonstrativo Geral de Leilões Encerrados (Consolidado)</span>
                            <button className="bg-[#f4f4f4] hover:bg-[#e4e4e4] border border-[#d2d6de] px-3 py-1 rounded-sm transition-colors text-[#333] flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Gerar PDF
                            </button>
                        </div>
                        <div className="mt-4 pt-2">
                            <p className="text-gray-500 text-xs text-center border p-2 bg-gray-50 rounded-sm">
                                Os relatórios financeiros baseiam-se nos leilões marcados como <strong>'ENCERRADO'</strong>. Certifique-se de atualizar o status na página de Leilões.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bloco 2: Relatórios Operacionais e Logística */}
                <div className="bg-white rounded-sm shadow-sm border-t-[3px] border-t-[#3c8dbc]">
                    <div className="p-3 border-b border-[#f4f4f4]">
                        <h3 className="font-bold text-[#333] m-0 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#3c8dbc]" /> Operacional e Logística
                        </h3>
                    </div>
                    <div className="p-4 flex flex-col text-[14px] text-[#333] space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-dashed border-[#eee]">
                            <span>Relatório de Loteamento (Bens em Estoque vs Disponíveis)</span>
                            <Link href="/admin/logistics" className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3 py-1 rounded-sm transition-colors flex items-center gap-1">
                                Ir p/ Dash Logística
                            </Link>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-dashed border-[#eee]">
                            <span>Ata de Entradas de Bens (Últimos 30 dias)</span>
                            <button className="bg-[#f4f4f4] hover:bg-[#e4e4e4] border border-[#d2d6de] px-3 py-1 rounded-sm transition-colors text-[#333] flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Baixar CSV
                            </button>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-dashed border-[#eee]">
                            <span>Avaliação Tabela FIPE Total em Pátio:</span>
                            <span className="font-bold text-[#00a65a]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFipeValue)}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
