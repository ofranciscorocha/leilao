import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Clock } from 'lucide-react'

// Simulando dados baseados na screenshot
export default async function AuditorioTelaoPage({ params }: { params: { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = prisma;
    const auction = await p.auction.findUnique({
        where: { id: params.id },
        include: {
            lots: { orderBy: { lotNumber: 'asc' } }
        }
    });

    if (!auction) notFound();

    const activeLot = auction.lots[0]; // TODO: Puxar dinâmico do activeLotId

    return (
        <div className="min-h-screen bg-white font-sans overflow-hidden flex flex-col">

            {/* Top Header */}
            <header className="border-b-2 border-gray-200 py-3 px-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {/* Fake Logo equivalent to Pátio Rocha */}
                    <div className="flex items-center gap-2 text-xl font-bold text-[#1a2b4c]">
                        <div className="flex space-x-1 items-center">
                            <div className="w-2 h-6 bg-[#1a2b4c]"></div>
                            <div className="w-2 h-8 bg-[#1a2b4c]"></div>
                            <div className="w-2 h-6 bg-[#f39c12]"></div>
                        </div>
                        <div className="leading-tight">
                            Pátio<br />Rocha
                        </div>
                    </div>

                    <div className="pl-6 border-l-2 border-gray-200">
                        <h1 className="text-3xl font-bold text-[#333] m-0">
                            LOTE {activeLot ? String(activeLot.lotNumber).padStart(3, '0') : '---'}
                        </h1>
                        <h2 className="text-lg text-gray-600 font-normal m-0" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
                            {activeLot?.title || 'Carregando...'}
                        </h2>
                        <h3 className="text-[12px] text-gray-400 font-normal m-0 uppercase tracking-wide">
                            LEILOEIRO OFICIAL: {auction.leiloeiroNome || 'Ivana Montenegro Castelo Branco Rocha'} - {auction.leiloeiroMatricula || 'JUCEB 18/902440-2'}
                        </h3>
                    </div>
                </div>

                <div className="text-4xl font-bold text-[#333] tracking-wider font-mono">
                    12:49:12
                </div>
            </header>

            {/* Main Content Split */}
            <div className="flex flex-1 overflow-hidden p-6 gap-6">

                {/* Left Side: BIG IMAGE */}
                <div className="w-2/3 flex flex-col">
                    <div className="flex-1 bg-gray-100 border border-gray-300 rounded-sm shadow-sm flex items-center justify-center overflow-hidden relative">
                        {activeLot?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={activeLot.imageUrl} alt={activeLot.title} className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-gray-400 text-2xl flex flex-col items-center">
                                Sem Imagem do Bem
                            </div>
                        )}
                    </div>

                    {/* Footer Infos below image */}
                    <div className="mt-4 text-[13px] font-bold text-gray-700 bg-gray-50 border border-gray-200 p-3 rounded-sm">
                        <div className="mb-1">LOTES RETIRADOS: Nenhum</div>
                        <div>LOTES EM REPASSE: Nenhum</div>
                    </div>
                </div>

                {/* Right Side: STATUS & BIDS */}
                <div className="w-1/3 flex flex-col border border-gray-200 rounded-sm shadow-sm overflow-hidden font-sans">

                    {/* Status Banner */}
                    <div className="bg-[#00a65a] text-white text-center py-4">
                        <h2 className="text-3xl font-bold m-0 uppercase tracking-widest">EM PREGÃO</h2>
                    </div>

                    {/* Lance Inicial Highlight */}
                    <div className="bg-white text-center py-6 border-b border-gray-200">
                        <h3 className="text-gray-800 text-lg font-bold mb-1 uppercase tracking-wide">LANCE INICIAL</h3>
                        <div className="text-4xl font-bold text-[#333]">
                            R$ {activeLot?.startingPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                        </div>
                    </div>

                    {/* Bids List Placeholder */}
                    <div className="flex-1 bg-white flex flex-col relative">
                        <h3 className="text-center font-bold text-gray-800 pt-6 pb-4 text-lg">ÚLTIMOS LANCES</h3>
                        {/* Simulation of empty bids */}
                        <div className="flex-1 flex items-center justify-center pointer-events-none opacity-10">
                            <Clock size={100} />
                        </div>
                    </div>

                    {/* Description Footer */}
                    <div className="bg-white border-t border-gray-200 p-4">
                        <div className="text-[11px] text-gray-800 leading-tight mb-4 max-h-[120px] overflow-hidden">
                            <strong>Descrição:</strong><br />
                            {activeLot?.description || 'Item não possui descrição detalhada no sistema. O leiloeiro pode fornecer mais informações.'}
                        </div>

                        <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                            <div>
                                <div className="text-[12px] text-gray-500 font-bold mb-1">Lance Inicial</div>
                                <div className="text-xl font-bold text-[#333]">
                                    R$ {activeLot?.startingPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[12px] text-gray-500 font-bold mb-1">Incremento</div>
                                <div className="text-lg font-bold text-[#333]">
                                    R$ {activeLot?.incrementAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
