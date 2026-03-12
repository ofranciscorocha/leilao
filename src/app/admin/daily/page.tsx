import { Construction } from "lucide-react"

export default function PlaceholderPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
            <Construction className="h-16 w-16 mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold">Controle de Diárias</h1>
            <p>Em desenvolvimento.</p>
        </div>
    )
}
