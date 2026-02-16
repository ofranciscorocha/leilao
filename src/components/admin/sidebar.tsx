'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Gavel,
    Package,
    Users,
    Settings,
    LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Auctions',
        href: '/admin/auctions',
        icon: Gavel,
    },
    {
        title: 'Lots',
        href: '/admin/lots',
        icon: Package,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex bg-gray-900 text-white w-64 flex-col h-full border-r">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-gray-400">Auction Platform</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                            pathname === item.href
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-800">
                <form action={logout}>
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-800">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </form>
            </div>
        </div>
    )
}
