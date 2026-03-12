import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from 'next/link'
import { ArrowLeft, Play, AlertCircle } from "lucide-react"

// Simulando dados baseados na screenshot
export default async function OperatorPanelPage({ params }: { params: { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = prisma;
    const auction = await p.auction.findUnique({
        where: { id: params.id },
        include: {
            lots: { orderBy: { lotNumber: 'asc' } }
        }
    });

    if (!auction) notFound();

    const activeLot = auction.lots[0]; // TODO: Puxar do activeLotId

    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col font-sans">

            {/* Top Bar Compact */}
            <div className="bg-[#f8f9fa] border-b border-[#d2d6de] p-2 flex items-center justify-between text-[13px] text-[#333]">
                <div className="flex items-center gap-2">
                    <Link href={`/admin/auctions/${auction.id}`} className="text-[#3c8dbc] hover:underline flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" /> Voltar ao Leilão
                    </Link>
                    <span className="font-bold border-l pl-2 ml-2">{auction.startDate?.toLocaleString('pt-BR')} - {auction.title}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-bold border border-[#d2d6de] px-2 py-1 bg-white">Online: <span className="text-[#3c8dbc]">0</span></span>
                </div>
            </div>

            {/* Main Operator Grid */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT COLUMN: Lots Navigation & Info */}
                <div className="w-[380px] border-r border-[#d2d6de] bg-white flex flex-col overflow-y-auto">

                    {/* Top Lot Controls */}
                    <div className="p-2 border-b border-[#d2d6de] bg-gray-50 flex items-center justify-between">
                        <button className="text-[12px] bg-white border border-[#d2d6de] px-2 py-1 hover:bg-gray-100 flex items-center gap-1 font-bold">
                            &#9664; Anterior
                        </button>
                        <span className="text-2xl font-bold font-mono">
                            {activeLot ? String(activeLot.lotNumber).padStart(3, '0') : '---'}
                        </span>
                        <button className="text-[12px] bg-white border border-[#d2d6de] px-2 py-1 hover:bg-gray-100 flex items-center gap-1 font-bold">
                            Próximo &#9654;
                        </button>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Lots List (Mini Sidebar) */}
                        <div className="w-[60px] border-r border-[#d2d6de] bg-gray-50 overflow-y-auto pt-2">
                            {auction.lots.map((l: any, idx: number) => (
                                <div key={l.id} className={`text-center py-1 text-[12px] cursor-pointer ${idx === 0 ? 'bg-[#00a65a] text-white font-bold' : 'text-gray-600 hover:bg-gray-200'} border-b border-[#d2d6de]`}>
                                    {idx === 0 && <span className="bg-white text-[#00a65a] px-1 rounded-sm mr-1">P</span>}
                                    {String(l.lotNumber).padStart(3, '0')}
                                </div>
                            ))}
                            {auction.lots.length === 0 && <div className="text-[10px] text-center p-2">Sem lotes</div>}
                        </div>

                        {/* Active Lot Info */}
                        <div className="flex-1 p-2 flex flex-col overflow-y-auto">
                            <div className="flex justify-between items-start mb-2">
                                <div className="w-[120px] h-[80px] bg-gray-200 rounded-sm border border-gray-300">
                                    <div className="flex items-center justify-center h-full text-xs text-gray-500">Sem Imagem</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button className="text-[11px] bg-gray-500 text-white px-2 py-1 rounded-sm">Editar Lote</button>
                                    <button className="text-[11px] bg-gray-500 text-white px-2 py-1 rounded-sm">Notificações</button>
                                </div>
                            </div>

                            <div className="bg-white border top-0 z-10 font-bold p-1 text-sm bg-gray-100 border-[#d2d6de] mb-1">
                                Descrição
                            </div>
                            <div className="text-[11px] text-gray-700 font-mono leading-tight bg-[#f9f9f9] border border-[#d2d6de] p-2 h-[150px] overflow-y-auto">
                                <strong>Descrição:</strong><br />
                                {activeLot?.description || activeLot?.title || 'Nada descrito.'}
                            </div>

                            <div className="mt-4 text-[12px] space-y-1">
                                <div className="flex justify-between border-b border-dashed pb-1">
                                    <span className="text-gray-500">Avaliação:</span>
                                    <span className="font-bold">R$ {activeLot?.fipeValor || '0,00'}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed pb-1">
                                    <span className="text-gray-500">Lance Inicial:</span>
                                    <span className="font-bold">R$ {activeLot?.startingPrice || '0,00'}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed pb-1">
                                    <span className="text-gray-500">Mínimo Venda:</span>
                                    <span className="font-bold">R$ {activeLot?.reservePrice || '0,00'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Bidding and Controls */}
                <div className="flex-1 bg-[#f4f4f4] flex flex-col overflow-hidden">

                    {/* Status Ribbon */}
                    <div className="bg-white p-3 border-b border-[#d2d6de] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#00a65a] animate-pulse"></div>
                            <h2 className="text-[18px] font-bold m-0 uppercase tracking-widest text-[#333]">Em Pregão</h2>
                        </div>
                    </div>

                    {/* Bidding Area Container */}
                    <div className="flex flex-1 overflow-hidden">

                        {/* Central Bidding Controls */}
                        <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">

                            {/* Bids Tape */}
                            <div className="flex gap-2 mb-6 h-[80px] items-center">
                                {/* Simulando Lances na fita */}
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex-1 bg-white border border-[#d2d6de] rounded-sm p-2 flex flex-col items-center justify-center opacity-70">
                                        <span className="text-[11px] text-gray-500 uppercase">Presencial</span>
                                        <span className="font-bold text-[#333]">{(activeLot?.startingPrice || 1487) + (i * 100)},00</span>
                                    </div>
                                ))}
                            </div>

                            {/* Manual Bid Input */}
                            <div className="flex items-center gap-2 mb-6 bg-white p-3 border border-[#d2d6de] rounded-sm shadow-sm">
                                <span className="font-bold text-[13px] text-[#333]">Manualmente valor do lance:</span>
                                <input type="number" className="border border-[#3c8dbc] px-2 py-1 outline-none w-[150px] font-bold" />
                                <button className="border border-[#3c8dbc] text-[#3c8dbc] font-bold px-3 py-1 hover:bg-[#3c8dbc] hover:text-white transition-colors text-[12px]">ENVIAR</button>
                            </div>

                            {/* Big Operator Buttons */}
                            <div className="grid grid-cols-4 gap-2 mb-8">
                                <button className="bg-[#f39c12] hover:bg-[#e08e0b] text-white font-bold py-3 rounded-sm text-[13px] shadow">DOU-LHE UMA</button>
                                <button className="bg-[#f39c12] hover:bg-[#e08e0b] text-white font-bold py-3 rounded-sm text-[13px] shadow">DOU-LHE DUAS</button>
                                <button className="bg-[#f39c12] hover:bg-[#e08e0b] text-white font-bold py-3 rounded-sm text-[13px] shadow">HOMOLOGAR</button>
                                <button className="bg-[#f39c12] hover:bg-[#e08e0b] text-white font-bold py-3 rounded-sm text-[13px] shadow">RELÓGIO</button>
                            </div>

                            {/* Action Finish Buttons */}
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                <button className="border-2 border-gray-300 text-gray-400 font-bold py-3 rounded-sm text-[13px] bg-white cursor-not-allowed">VENDIDO</button>
                                <button className="border-2 border-gray-300 text-gray-400 font-bold py-3 rounded-sm text-[13px] bg-white cursor-not-allowed">CONDICIONAL</button>
                                <button className="border-2 border-[#00a65a] text-[#00a65a] font-bold py-3 rounded-sm text-[13px] bg-white hover:bg-green-50">REPASSE</button>
                                <button className="border-2 border-[#333] text-[#333] font-bold py-3 rounded-sm text-[13px] bg-white hover:bg-gray-100">NÃO VENDIDO</button>
                            </div>

                            {/* Table Lances */}
                            <div className="flex-1 bg-white border border-[#d2d6de] flex flex-col min-h-[150px]">
                                <div className="bg-gray-500 text-white text-[11px] font-bold text-center py-1">Ultimos Lances</div>
                                <table className="w-full text-left text-[11px]">
                                    <thead>
                                        <tr className="border-b border-[#d2d6de] bg-gray-50">
                                            <th className="p-1 font-normal text-gray-600">Usuário</th>
                                            <th className="p-1 font-normal text-gray-600">Cidade</th>
                                            <th className="p-1 font-normal text-gray-600 text-right">Valor Lance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Mock Data */}
                                        <tr className="border-b border-[#eee]">
                                            <td className="p-1">Presencial</td>
                                            <td className="p-1">Feira de Santana</td>
                                            <td className="p-1 text-right font-bold">R$ {(activeLot?.startingPrice || 1487) + 500},00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        {/* Right Sidebar Increments */}
                        <div className="w-[80px] bg-white border-l border-[#d2d6de] flex flex-col items-center pt-2 overflow-y-auto">
                            <span className="text-[10px] font-bold text-red-600 mb-2">Incrementos</span>
                            {[1, 10, 20, 50, 100, 200, 300, 400, 500, 1000, 2000].map(inc => (
                                <button key={inc} className={`w-[90%] py-1 text-[11px] mb-1 font-bold ${inc === 100 ? 'bg-[#dd4b39] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                                    {inc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </button>
                            ))}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
