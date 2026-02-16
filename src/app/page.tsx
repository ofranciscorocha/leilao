import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { prisma } from '@/lib/prisma'
import { AuctionCard } from '@/components/public/auction-card'

export const revalidate = 60 // Revalidate every minute

export default async function Home() {
  const auctions = await prisma.auction.findMany({
    where: {
      status: { in: ['OPEN', 'UPCOMING'] }
    },
    orderBy: { endDate: 'asc' },
    include: {
      _count: { select: { lots: true } }
    }
  })

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* API Hero Section */}
        <section className="bg-blue-900 text-white py-20">
          <div className="container text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Pátio Rocha Leilões
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              The safest place to bid on vehicles. Official auctions, transparent process.
            </p>
          </div>
        </section>

        {/* Auctions Grid */}
        <section className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Active Auctions</h2>
          </div>

          {auctions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border shadow-sm">
              <p className="text-gray-500 text-lg">No active auctions at the moment.</p>
              <p className="text-sm text-gray-400">Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
