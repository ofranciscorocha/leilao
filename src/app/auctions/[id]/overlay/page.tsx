import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ObsOverlayPanel } from '@/components/public/obs-overlay-panel'

// This page is meant to be loaded as a Browser Source in OBS Studio / vMix
// It should have a transparent background and show critical auction data
export default async function ObsOverlayPage({ params }: { params: { id: string } }) {
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
        <div className="w-screen h-screen bg-transparent overflow-hidden">
            {/* Inline style to force body transparency if globals.css sets a background */}
            <style dangerouslySetInnerHTML={{
                __html: `
                body, html { background-color: transparent !important; }
            `}} />

            <ObsOverlayPanel auction={auction} lots={auction.lots} />
        </div>
    )
}
