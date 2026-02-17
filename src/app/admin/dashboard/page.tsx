import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Gavel, Package, Users, Archive, CheckCircle2 } from 'lucide-react'
import { DashboardChart } from '@/components/admin/dashboard-chart'

// Placeholder for the chart since we don't have a charting lib installed yet (like reumobile/recharts)
// We will simply display a placeholder or basic CSS bar for now to match the layout.

async function getStats() {
    const activeAuctions = await prisma.auction.count({ where: { status: 'OPEN' } })
    const activeLots = await prisma.lot.count({ where: { auction: { status: 'OPEN' } } }) // Simple approximation
    const closedAuctions = await prisma.auction.count({ where: { status: 'CLOSED' } })
    const totalUsers = await prisma.user.count()

    return { activeAuctions, activeLots, closedAuctions, totalUsers }
}

export default async function DashboardPage() {
    const stats = await getStats()

    return (
        <div className="space-y-6">

            {/* Top Alerts Bar (Mockup) */}
            <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700 bg-white p-3 rounded-md border shadow-sm">
                <div className="flex items-center gap-2 text-red-600">
                    <span className="font-bold">⚠ Alertas</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Pendente Desbloqueio (0)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Habilitações Pendentes (0)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Mensagens Pendentes (0)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Leilões Ativos"
                    value={stats.activeAuctions}
                    icon={Gavel}
                    description="Leilões em andamento"
                />
                <StatsCard
                    title="Lotes Ativos"
                    value={stats.activeLots}
                    icon={Package}
                    description="Veículos disponíveis"
                />
                <StatsCard
                    title="Leilões Encerrados"
                    value={stats.closedAuctions}
                    icon={Archive}
                    description="Histórico"
                />
                <StatsCard
                    title="Total Arrematantes"
                    value={stats.totalUsers}
                    icon={Users}
                    description="Cadastrados no sistema"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <DashboardChart />
            </div>
        </div>
    )
}

function StatsCard({ title, value, icon: Icon, description }: any) {
    return (
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <div className="text-4xl font-bold text-gray-900">{value}</div>
                    <div className="text-sm font-medium text-gray-500 mt-1">{title}</div>
                </div>
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <Icon className="h-8 w-8" />
                </div>
            </CardContent>
        </Card>
    )
}

// Icons needed for the top bar
import { Lock, Mail } from 'lucide-react'
