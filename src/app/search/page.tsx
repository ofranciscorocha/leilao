import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { prisma } from '@/lib/prisma'
import { LotCard } from '@/components/public/lot-card'
import { HorizontalLotCard } from '@/components/public/horizontal-lot-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function SearchPage(props: {
    searchParams: Promise<{ q: string }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams.q || ''

    const lots = await prisma.lot.findMany({
        where: {
            OR: [
                { title: { contains: query } },  // Case insensitive in SQLite usually, but depends on collation
                { description: { contains: query } }
            ]
        },
        include: {
            auction: true
        }
    })

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />

            <main className="flex-1 container py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 border-l-4 border-yellow-500 pl-3">
                        Resultados da Busca: "{query}"
                    </h1>
                    <Link href="/">
                        <Button variant="outline">Voltar para Home</Button>
                    </Link>
                </div>

                {lots.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {lots.map(lot => (
                            <HorizontalLotCard key={lot.id} lot={lot} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-dashed">
                        <div className="text-gray-400 mb-2">Nenhum lote encontrado para sua busca.</div>
                        <p className="text-sm text-gray-500">Tente termos diferentes.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
