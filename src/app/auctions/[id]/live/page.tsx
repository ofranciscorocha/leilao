import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Video, AlertCircle } from 'lucide-react'
import { PublicLiveAuctionPanel } from '@/components/public/public-live-auction-panel'

// This will be a public page to watch the live auction and place bids
export default async function PublicLiveAuctionPage({ params }: { params: { id: string } }) {
    const auction = await prisma.auction.findUnique({
        where: { id: params.id },
        include: {
            lots: {
                orderBy: { lotNumber: 'asc' }
            }
        }
    })

    if (!auction) notFound()

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Minimal Public Header */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1 group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Voltar
                        </Link>
                        <h1 className="text-xl font-bold uppercase tracking-tight text-[#333] hidden md:block">
                            {auction.title}
                        </h1>
                    </div>
                    {/* Simplified User Info for Demo (in real app, this would be from Auth) */}
                    <div className="text-sm border-l pl-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#3c8dbc] text-white flex items-center justify-center font-bold">A</span>
                        <div className="hidden sm:block">
                            <div className="leading-tight font-bold text-[#333]">Arrematante Demo</div>
                            <div className="text-xs text-green-600 font-medium">Habilitado</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto p-4 lg:p-6">
                {auction.status !== 'LIVE' && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold">Este leilão não está Ao Vivo no momento.</h3>
                            <p className="text-sm">A sala de lances pode não estar conectada ao leiloeiro oficial. Aguarde até o horário marcado.</p>
                        </div>
                    </div>
                )}

                <PublicLiveAuctionPanel auction={auction} lots={auction.lots} />
            </main>
        </div>
    )
}
