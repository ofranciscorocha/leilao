import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0 // Disable cache for this page

export default async function CondicionaisPage() {
    const conditionalLots = await prisma.lot.findMany({
        where: {
            status: 'CONDITIONAL'
        },
        include: {
            auction: true,
            bids: {
                orderBy: { amount: 'desc' },
                take: 1,
                include: { user: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary">Lotes em Condicional</h1>
                <p className="text-muted-foreground font-medium">Gerencie ofertas que aguardam aprovação do comitente.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary text-primary-foreground border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-primary-foreground/60 font-bold uppercase tracking-wider text-[10px]">Total Pendente</CardDescription>
                        <CardTitle className="text-4xl font-black">{conditionalLots.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs font-medium text-primary-foreground/40 italic">Aguardando decisão estratégica</div>
                    </CardContent>
                </Card>
                {/* Add more metric cards if needed */}
            </div>

            <Card className="border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-secondary" />
                        Fila de Decisão
                    </CardTitle>
                </CardHeader>
                <div className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[100px] font-bold text-[10px] uppercase tracking-widest">Lote</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-primary">Veículo/Item</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-primary">Leilão</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-primary">Último Lance</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-primary text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {conditionalLots.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <CheckCircle className="h-10 w-10 text-gray-200" />
                                            <span className="font-semibold italic">Tudo em dia! Nenhum lote em condicional no momento.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                conditionalLots.map((lot) => (
                                    <TableRow key={lot.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <TableCell>
                                            <Badge variant="outline" className="font-black border-primary/20 text-primary">
                                                #{lot.lotNumber}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-gray-900 leading-tight">{lot.title}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mt-1">ID: {lot.id.slice(-6)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-gray-600 italic">
                                            {lot.auction.title}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-black text-primary text-sm tracking-tight">
                                                    {lot.currentBid ? formatCurrency(lot.currentBid) : '---'}
                                                </span>
                                                {lot.bids[0] && (
                                                    <span className="text-[10px] text-secondary font-bold uppercase tracking-tighter">
                                                        Por: {lot.bids[0].user.name || 'Usuário'}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/lots/${lot.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="outline" size="sm" className="h-8 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 font-bold text-[10px]">
                                                    <CheckCircle className="h-3 w-3 mr-1" /> VENDER
                                                </Button>
                                                <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-bold text-[10px]">
                                                    <XCircle className="h-3 w-3 mr-1" /> NÃO VENDER
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
