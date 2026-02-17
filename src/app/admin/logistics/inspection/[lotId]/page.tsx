import InspectionForm from '@/components/admin/logistics/inspection-form'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function InspectionPage(props: { params: Promise<{ lotId: string }> }) {
    const params = await props.params
    const lot = await prisma.lot.findUnique({
        where: { id: params.lotId },
        include: { inspection: true }
    })

    if (!lot) notFound()

    return (
        <div className="container py-8 max-w-5xl">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Lote {lot.lotNumber}</Badge>
                    <Badge>{lot.status}</Badge>
                </div>
                <h1 className="text-3xl font-bold">{lot.title}</h1>
                <p className="text-gray-500">{lot.description}</p>
            </div>

            <InspectionForm lotId={lot.id} initialData={lot.inspection || {}} />
        </div>
    )
}
