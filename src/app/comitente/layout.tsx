import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import Link from 'next/link'
import { LayoutDashboard, Package, FileText, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ComitenteLayout({
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
                                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                    CO
                                </div>
                                <div>
                                    <h3 className="font-bold">Comitente A</h3>
                                    <p className="text-xs text-gray-500">Parceiro</p>
                                </div>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <Link href="/comitente">
                                <Button variant="ghost" className="w-full justify-start gap-3">
                                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                                </Button>
                            </Link>
                            <Link href="/comitente/lots">
                                <Button variant="ghost" className="w-full justify-start gap-3">
                                    <Package className="h-4 w-4" /> Meus Lotes
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
