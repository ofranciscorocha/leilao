import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Image, FileText, Settings, LayoutTemplate } from "lucide-react"

export default function CMSLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            <aside className="w-full md:w-64 space-y-2">
                <div className="font-bold text-xl mb-4 px-4">CMS</div>
                <nav className="space-y-1">
                    <Link href="/admin/cms/banners">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Image className="h-4 w-4" /> Banners
                        </Button>
                    </Link>
                    <Link href="/admin/cms/pages">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <FileText className="h-4 w-4" /> Páginas Institucionais
                        </Button>
                    </Link>
                    <Link href="/admin/settings">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Settings className="h-4 w-4" /> Configurações Gerais
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
