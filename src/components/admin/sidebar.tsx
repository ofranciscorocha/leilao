'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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
} from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

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
        group: 'EMAILS MARKETING',
        items: [
            { href: '/admin/contacts', label: 'Contatos', icon: Users },
        ]
    },
    {
        group: 'CONTEÚDO DO SITE',
        items: [
            { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
            { href: '/admin/pages', label: 'Páginas', icon: FileText },
        ]
    },
    {
        group: '',
        items: [
            { href: '/admin/help', label: 'Ajuda ao Arrematante', icon: HelpCircle },
        ]
    }

]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col bg-white text-gray-700 border-r shadow-sm">
            <div className="flex h-16 items-center border-b px-6 bg-gray-50/50">
                <span className="text-xl font-bold tracking-tight text-gray-900">Pátio Rocha Leilões</span>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-6 px-4">
                    {sidebarItems.map((group, i) => (
                        <div key={i}>
                            {group.group && (
                                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
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
                                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            )}
                                        >
                                            <item.icon className={cn("h-4 w-4", isActive ? "text-blue-700" : "text-gray-500")} />
                                            {item.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4">
                <form action={logout}>
                    <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                        <LogOut className="h-4 w-4" />
                        Sair
                    </Button>
                </form>
            </div>
        </div>
    )
}
