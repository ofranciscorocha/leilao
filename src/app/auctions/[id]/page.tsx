import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { prisma } from '@/lib/prisma'
import { LotCard } from '@/components/public/lot-card'
import { notFound } from 'next/navigation'
import { Calendar, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export default async function AuctionPage({ params }: { params: { id: string } }) {
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

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
            <Navbar />

            <main className="flex-1">
                <div className="bg-white border-b">
                    <div className="container py-8 space-y-4">
                        <h1 className="text-3xl font-bold">{auction.title}</h1>
                        <p className="text-gray-600 max-w-3xl">{auction.description}</p>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 pt-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Closes: <strong>{formatDate(auction.endDate)}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>Online Auction</span>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="container py-12">
                    <h2 className="text-2xl font-bold mb-8">Lots ({auction.lots.length})</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {auction.lots.map(lot => (
                            <LotCard key={lot.id} lot={lot} />
                        ))}
                        {auction.lots.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-500">
                                No lots in this auction yet.
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
