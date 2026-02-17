import { AuctioneerPanel } from '@/components/admin/auctioneer-panel'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function AdminLiveAuctionPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const auction = await prisma.auction.findUnique({
        where: { id: params.id }
    })

    if (!auction) notFound()

    return (
        <div className="container py-8 max-w-5xl">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/auctions">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Controle de Auditório</h1>
                    <p className="text-gray-500">{auction.title} - {auction.status}</p>
                </div>
            </div>

            <AuctioneerPanel auctionId={auction.id} />
        </div>
    )
}
