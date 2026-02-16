import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Gavel } from 'lucide-react'

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Gavel className="h-6 w-6 text-blue-600" />
                    <Link href="/">Pátio Rocha Leilões</Link>
                </div>
                <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <Link href="/auctions" className="hover:text-blue-600 transition-colors">Auctions</Link>
                    <Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
                    <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/admin/login">
                        <Button variant="ghost" size="sm">Log In</Button>
                    </Link>
                    <Button size="sm">Register</Button>
                </div>
            </div>
        </header>
    )
}
