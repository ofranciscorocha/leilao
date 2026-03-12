import { prisma } from "@/lib/prisma"
import { AuditoriumView } from "@/components/public/auditorium-view"
import { notFound } from "next/navigation"

// This page generates a static shell but content is dynamic
export const dynamic = 'force-dynamic'

export default async function AuditoriumPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const auctionId = params.id

    // Get the first OPEN lot or the first UPCOMING lot
    // In a real scenario, the "Current Active Lot" would be controlled by the backend state / redis
    // Here we just pick the first one for demo purposes for the specific auction
    const lot = await prisma.lot.findFirst({
        where: { auctionId },
        orderBy: { lotNumber: 'asc' },
        include: { logistics: true }
    })

    if (!lot) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-white">
                <h1 className="text-3xl">Nenhum lote disponível neste leilão.</h1>
            </div>
        )
    }

    return <AuditoriumView auctionId={auctionId} initialLot={lot} />
}
