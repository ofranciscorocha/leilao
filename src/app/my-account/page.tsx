import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default async function MyAccountDashboard() {
    // Mock user ID for now
    const userId = 'user_123' // Replace with auth()

    // Fetch stats
    // const activeBidsCount = await prisma.bid.count({ where: { userId, lot: { status: 'OPEN' } } })
    // const wonLotsCount = await prisma.lot.count({ where: { winnerId: userId } })

    // Mock Data for Display
    const activeBidsCount = 3
    const wonLotsCount = 1
    const pendingDocs = true

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Visão Geral</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Lances Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{activeBidsCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Lotes Arrematados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{wonLotsCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Status da Conta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pendingDocs ? (
                            <div className="flex items-center gap-2 text-yellow-600 font-bold">
                                <span>Pendente</span>
                            </div>
                        ) : (
                            <div className="text-green-600 font-bold">Verificado</div>
                        )}
                        <Link href="/my-account/documents" className="text-xs text-blue-600 hover:underline">
                            Gerenciar Documentos
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Mock */}
            <Card>
                <CardHeader>
                    <CardTitle>Últimos Lances</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                                <div>
                                    <p className="font-bold">Chevrolet Onix 2020</p>
                                    <p className="text-sm text-gray-500">Leilão: Pátio Rocha #123</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-600">{formatCurrency(25000 + (i * 500))}</p>
                                    <Badge variant="outline" className="mt-1">Superado</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href="/my-account/bids">
                            <Button variant="link">Ver todos os lances</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
