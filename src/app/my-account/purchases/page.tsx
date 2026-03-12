import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Download, ExternalLink } from "lucide-react"
import Link from 'next/link'

export default async function PurchasesPage() {
    // Mock user
    const userId = 'user_123'

    const purchases = await prisma.lot.findMany({
        where: { winnerId: userId }, // In real app use auth session id
        include: { auction: true },
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Minhas Compras e Arremates</h1>

            {purchases.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-gray-500 mb-4">Você ainda não arrematou nenhum lote.</p>
                    <Link href="/">
                        <Button>Ver Leilões Abertos</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {purchases.map(lot => (
                        <Card key={lot.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                {/* Image Info */}
                                <div className="w-full md:w-48 bg-gray-100 aspect-video md:aspect-auto relative">
                                    {/* <img src={lot.imageUrl} ... /> */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <Badge variant="outline" className="mb-1">Lote {lot.lotNumber}</Badge>
                                            <h3 className="font-bold text-lg">{lot.title}</h3>
                                            <p className="text-sm text-gray-500">{lot.auction.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Valor de Arremate</p>
                                            <p className="text-xl font-bold text-green-600">{formatCurrency(lot.currentBid || 0)}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                                        <Button size="sm" variant="outline" className="gap-2">
                                            <Download className="h-4 w-4" /> Nota de Venda
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-2">
                                            <ExternalLink className="h-4 w-4" /> Dados de Pagamento
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
