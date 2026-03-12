export const dynamic = "force-dynamic"
import { Sidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header could go here if needed, or inside pages */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
