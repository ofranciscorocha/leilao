import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileBarChart, Users, DollarSign } from 'lucide-react'

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            <aside className="w-full md:w-64 space-y-2">
                <div className="font-bold text-xl mb-4 px-4">Relatórios</div>
                <nav className="space-y-1">
                    <Link href="/admin/reports/auctions">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <DollarSign className="h-4 w-4" /> Resultados de Leilão
                        </Button>
                    </Link>
                    <Link href="/admin/reports/users">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Users className="h-4 w-4" /> Atividade de Usuários
                        </Button>
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 bg-white rounded-lg shadow-sm border p-6 min-h-[500px]">
                {children}
            </main>
        </div>
    )
}
