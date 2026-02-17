import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import Link from 'next/link'
import { User, FileText, Gavel, ShoppingBag, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MyAccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="flex-1 container py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-2">
                        <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    FR
                                </div>
                                <div>
                                    <h3 className="font-bold">Francisco</h3>
                                    <p className="text-xs text-gray-500">Arrematante</p>
                                </div>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <Link href="/my-account">
                                <Button variant="ghost" className="w-full justify-start gap-3">
                                    <User className="h-4 w-4" /> Visão Geral
                                </Button>
                            </Link>
                            <Link href="/my-account/bids">
                                <Button variant="ghost" className="w-full justify-start gap-3">
                                    <Gavel className="h-4 w-4" /> Meus Lances
                                </Button>
                            </Link>
                            <Link href="/my-account/purchases">
                                <Button variant="ghost" className="w-full justify-start gap-3">
                                    <ShoppingBag className="h-4 w-4" /> Compras & Arremates
                                </Button>
                            </Link>
                            <Link href="/my-account/documents">
                                <Button variant="ghost" className="w-full justify-start gap-3">
                                    <FileText className="h-4 w-4" /> Documentos
                                </Button>
                            </Link>
                            <div className="pt-4 border-t mt-4">
                                <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <LogOut className="h-4 w-4" /> Sair
                                </Button>
                            </div>
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    )
}
