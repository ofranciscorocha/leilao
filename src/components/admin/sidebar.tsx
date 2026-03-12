'use client'

import Link from 'next/link'
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    AlertCircle,
    Gavel,
    Search,
    Lock,
    Users,
    Building2,
    Globe,
    Box,
    Calendar,
    Handshake,
    BarChart,
    Mail,
    FileText,
    HelpCircle,
    Image as ImageIcon,
    LogOut
} from "lucide-react"
import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        group: '',
        items: [
            { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ]
    },
    {
        group: 'AVISOS',
        items: [
            { href: '/admin/alerts', label: 'Alertas', icon: AlertCircle },
        ]
    },
    {
        group: 'GERENCIAR',
        items: [
            { href: '/admin/auctions', label: 'Leilões', icon: Gavel },
            { href: '/admin/lots', label: 'Consulta de Lotes', icon: Search },
            { href: '/admin/condicionais', label: 'Lotes em Condicional', icon: FileText },
            { href: '/admin/qualifications', label: 'Consulta de Habilitações', icon: Lock },
            { href: '/admin/bidders', label: 'Arrematantes', icon: Users },
            { href: '/admin/comitentes', label: 'Comitentes', icon: Building2 },
        ]
    },
    {
        group: 'LOGÍSTICA',
        items: [
            { href: '/admin/goods', label: 'Bens', icon: Box },
            { href: '/admin/daily', label: 'Diárias', icon: Calendar },
            { href: '/admin/suppliers', label: 'Fornecedores', icon: Handshake },
            { href: '/admin/logistics-reports', label: 'Relatórios', icon: BarChart },
        ]
    },
    {
        group: '',
        items: [
            { href: '/admin/general-reports', label: 'Relatórios Gerais', icon: BarChart },
            { href: '/admin/messages', label: 'Mensagens', icon: Mail },
        ]
    },
    {
        group: 'SITE & MARKETING',
        items: [
            { href: '/admin/contacts', label: 'Contatos', icon: Users },
            { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
            { href: '/admin/pages', label: 'Páginas', icon: FileText },
        ]
    },
    {
        group: '',
        items: [
            { href: '/admin/help', label: 'Ajuda ao Arrematante', icon: HelpCircle },
            { href: '/admin/settings', label: 'Configurações', icon: Globe },
        ]
    }
]

export async function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl">
            <div className="flex h-20 items-center px-6 border-b border-sidebar-border bg-black/10">
                <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tighter text-sidebar-primary">Pátio Rocha</span>
                    <span className="text-[10px] tracking-[0.2em] font-medium text-sidebar-foreground/50 uppercase">Sistema de Gestão</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                <nav className="space-y-8 px-4">
                    {sidebarItems.map((group, i) => (
                        <div key={i} className="space-y-2">
                            {group.group && (
                                <h4 className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/30">
                                    {group.group}
                                </h4>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-black/20"
                                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "h-4 w-4 transition-transform duration-200 group-hover:scale-110", 
                                                isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/40"
                                            )} />
                                            {item.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-sidebar-border bg-black/10">
                <form action={logout}>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-semibold">Sair do Painel</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
