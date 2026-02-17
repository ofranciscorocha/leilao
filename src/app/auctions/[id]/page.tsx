import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { prisma } from '@/lib/prisma'
import { LotCard } from '@/components/public/lot-card'
import { notFound } from 'next/navigation'
import { Calendar, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { LiveAuditorium } from '@/components/auction/live-auditorium'

export const revalidate = 60

export default async function AuctionPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const auction = await prisma.auction.findUnique({
        where: { id: params.id },
        include: {
            lots: {
                orderBy: { createdAt: 'asc' }
            }
        }
    })

    if (!auction) {
        notFound()
    }

    // --- Mock User Session (In real app, get from auth() or headers) ---
    const userId = 'user_123'
    const userName = 'Licitante Demo'
    // ------------------------------------------------------------------

    if (auction.status === 'LIVE') {
        return (
            <div className="min-h-screen bg-black">
                <Navbar />
                <LiveAuditorium
                    auctionId={auction.id}
                    initialData={{
                        currentLot: auction.lots.find(l => l.status === 'OPEN') || auction.lots[0],
                        lots: auction.lots
                    }}
                    userId={userId}
                    userName={userName}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
            <Navbar />

            <main className="flex-1">
                {/* Auction Header */}
                <div className="bg-white border-b shadow-sm">
                    <div className="container py-8 space-y-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{auction.title}</h1>
                                <p className="text-gray-600 max-w-3xl mt-2">{auction.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${auction.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                                    auction.status === 'CLOSED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {auction.status}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 pt-4 border-t mt-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <span>Encerramento: <strong>{formatDate(auction.endDate)}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-red-600" />
                                <span>Leilão {auction.type}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lots Grid */}
                <section className="container py-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-yellow-500 pl-3">
                            Lotes Disponíveis ({auction.lots.length})
                        </h2>
                    </div>

                    {auction.lots.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {auction.lots.map(lot => (
                                <LotCard key={lot.id} lot={lot} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-dashed">
                            <div className="text-gray-400 mb-2">Nenhum lote cadastrado neste leilão.</div>
                            <p className="text-sm text-gray-500">Volte mais tarde ou confira outros leilões.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}
