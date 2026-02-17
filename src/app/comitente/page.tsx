import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Users, DollarSign, Package } from 'lucide-react'

export default async function ComitenteDashboard() {
    // Mock Comitente ID
    // const comitenteId = ...

    // Mock Data
    const totalLots = 15
    const soldLots = 12
    const totalSales = 450000

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Painel do Comitente</h1>
            <p className="text-gray-500">Acompanhe o desempenho de venda dos seus ativos.</p>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalSales)}</div>
                        <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lotes Vendidos</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{soldLots} / {totalLots}</div>
                        <p className="text-xs text-muted-foreground">80% de taxa de conversão</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lances Recebidos</CardTitle>
                        <BarChart className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">Média de 47 lances por lote</p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle>Desempenho de Vendas (Últimos 6 meses)</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center bg-gray-50">
                    <p className="text-gray-400">Gráfico de Vendas (Chart.js ou Recharts integration here)</p>
                </CardContent>
            </Card>

            {/* Recent Lots Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lotes Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center border-b pb-2 font-medium text-sm text-gray-500">
                            <div>Lote</div>
                            <div>Status</div>
                            <div className="text-right">Valor Final</div>
                        </div>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex justify-between items-center py-2">
                                <div>
                                    <p className="font-medium">Lote #{i}0 - Toyota Hilux 2021</p>
                                    <p className="text-xs text-gray-500">Leilão: Frota Executiva SP</p>
                                </div>
                                <div className="text-sm">
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">VENDIDO</span>
                                </div>
                                <div className="text-right font-bold">
                                    {formatCurrency(120000 + (i * 5000))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
