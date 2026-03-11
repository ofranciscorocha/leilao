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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Welcome Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-primary uppercase italic">Painel de <span className="text-secondary">Controle</span></h1>
                    <p className="text-muted-foreground font-medium">Bem-vindo, Administrador. Aqui está o resumo das operações atuais.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-primary/10 hover:bg-primary/5">
                        <FileText className="mr-2 h-4 w-4 text-secondary" /> Relatórios
                    </Button>
                    <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold shadow-lg shadow-secondary/20 transition-transform hover:-translate-y-0.5">
                        <Gavel className="mr-2 h-4 w-4" /> Novo Leilão
                    </Button>
                </div>
            </div>

            {/* Critical Alerts Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-primary/5 shadow-inner">
                <AlertItem label="Aguardando Desbloqueio" value="12" icon={Users} color="text-blue-600" />
                <AlertItem label="Habilitações Pendentes" value="08" icon={Lock} color="text-amber-600" />
                <AlertItem label="Mensagens Novas" value="03" icon={Mail} color="text-green-600" />
                <AlertItem label="Lotes em Condicional" value="05" icon={Clock} color="text-secondary" glow />
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Leilões em Aberto"
                    value={stats.activeAuctions}
                    icon={Gavel}
                    trend="+2 este mês"
                />
                <StatsCard
                    title="Veículos Ativos"
                    value={stats.activeLots}
                    icon={Package}
                    trend="R$ 1.2M em lances"
                />
                <StatsCard
                    title="Histórico Total"
                    value={stats.closedAuctions}
                    icon={Archive}
                    trend="Último há 2 dias"
                />
                <StatsCard
                    title="Arrematantes"
                    value={stats.totalUsers}
                    icon={Users}
                    trend="+14 novos hoje"
                    highlight
                />
            </div>

            {/* Bottom Section: Charts & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-primary/5 shadow-2xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-primary">Performance de Vendas</h3>
                            <p className="text-sm text-muted-foreground font-medium italic">Volume de lances por hora (Mock)</p>
                        </div>
                        <Select defaultValue="7d">
                            <SelectTrigger className="w-32 rounded-full border-primary/10 font-bold text-xs uppercase tracking-wider">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24h">24 Horas</SelectItem>
                                <SelectItem value="7d">7 Dias</SelectItem>
                                <SelectItem value="30d">30 Dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="h-[300px] flex items-end justify-between gap-4 px-4 pb-2">
                        {/* CSS Bar Chart Mockup for visual wow without extra libs if they fail */}
                        {[40, 70, 45, 90, 65, 80, 55, 95, 75, 60, 85, 50].map((h, i) => (
                            <div key={i} className="group relative flex flex-col items-center flex-1">
                                <div 
                                    className="w-full bg-primary/10 group-hover:bg-secondary/40 transition-all duration-500 rounded-t-lg relative"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">
                                        {h * 10}k
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tighter opacity-50">{i + 1}h</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-primary px-2">Ações Rápidas</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <QuickActionButton icon={Package} label="Cadastrar Novo Lote" color="bg-secondary/10 text-secondary" />
                        <QuickActionButton icon={FileText} label="Gerar Fechamento" color="bg-primary/5 text-primary" />
                        <QuickActionButton icon={Globe} label="Ver Site Público" color="bg-primary/5 text-primary" />
                        <QuickActionButton icon={AlertCircle} label="Gerenciar Alertas" color="bg-red-50 text-red-600" />
                    </div>
                    
                    {/* Secondary info card */}
                    <div className="bg-gradient-to-br from-primary to-[#0c1322] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
                        <h4 className="font-bold text-secondary mb-2 uppercase tracking-[0.15em] text-xs">Suporte Técnico</h4>
                        <p className="text-xs text-white/60 leading-relaxed mb-4 font-medium italic">
                            O sistema está operando em alta performance. Recomendamos backup diário.
                        </p>
                        <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white text-[10px] font-black tracking-widest uppercase">
                            Consultar Logs
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, icon: Icon, trend, highlight }: any) {
    return (
        <Card className={cn(
            "relative overflow-hidden group border-none shadow-xl transition-all duration-300 hover:-translate-y-1",
            highlight ? "bg-white ring-2 ring-secondary/20" : "bg-white"
        )}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                        highlight ? "bg-secondary/10 text-secondary" : "bg-primary/5 text-primary/40 group-hover:text-secondary group-hover:bg-secondary/5"
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                </div>
                <div>
                    <div className="text-4xl font-black text-primary tracking-tighter">{value}</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60 italic">{title}</div>
                </div>
            </CardContent>
            {/* Subtle decorative stripe */}
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-secondary/30 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
    )
}

function AlertItem({ label, value, icon: Icon, color, glow }: any) {
    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white cursor-pointer group",
            glow && "ring-1 ring-secondary/20 bg-secondary/5 shadow-[0_0_15px_-5px_oklch(var(--ring)/0.2)]"
        )}>
            <div className={cn("h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center", color)}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-black text-primary leading-none">{value}</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">{label}</span>
            </div>
        </div>
    )
}

function QuickActionButton({ icon: Icon, label, color }: any) {
    return (
        <button className={cn(
            "flex items-center gap-3 w-full p-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm",
            color
        )}>
            <Icon className="h-4 w-4" />
            {label}
        </button>
    )
}

// Icons needed for the top bar
import { Lock, Mail, Clock, AlertCircle, Package, Archive, Globe, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

