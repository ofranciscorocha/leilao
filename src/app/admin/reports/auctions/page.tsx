import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"

export default async function AuctionReportsPage() {
    const closedAuctions = await prisma.auction.findMany({
        where: { status: { in: ['CLOSED', 'SOLD'] } },
        include: {
            _count: { select: { lots: true } },
            lots: {
                where: { status: 'SOLD' },
                select: { currentBid: true }
            }
        },
        orderBy: { endDate: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Relatório de Fechamento</h1>
                <p className="text-gray-500">Resultados consolidados de leilões encerrados.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Leilões</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Leilão</TableHead>
                                <TableHead>Lotes Totais</TableHead>
                                <TableHead>Lotes Vendidos</TableHead>
                                <TableHead className="text-right">Total Arrecadado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {closedAuctions.length > 0 ? closedAuctions.map((auction: any) => {
                                const totalSold = auction.lots.reduce((acc: number, lot: any) => acc + (lot.currentBid || 0), 0)
                                const soldCount = auction.lots.length

                                return (
                                    <TableRow key={auction.id}>
                                        <TableCell>{formatDate(auction.endDate)}</TableCell>
                                        <TableCell className="font-medium">{auction.title}</TableCell>
                                        <TableCell>{auction._count.lots}</TableCell>
                                        <TableCell>{soldCount}</TableCell>
                                        <TableCell className="text-right font-bold text-green-600">
                                            {formatCurrency(totalSold)}
                                        </TableCell>
                                    </TableRow>
                                )
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        Nenhum leilão encerrado encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
