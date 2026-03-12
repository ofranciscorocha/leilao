'use client'

import { useState } from "react"
import { ArrowLeft, Edit, RefreshCcw, Printer, Trash2, FileText } from "lucide-react"
import Link from 'next/link'
import { updateLotStatus } from "@/app/actions/logistics"
import { useRouter } from "next/navigation"

const LOGISTICS_STATUSES = [
    { id: 'EM_TRANSITO', label: 'Em Transito' },
    { id: 'PENDENTE_VISTORIA', label: 'Pendente de Vistoria' },
    { id: 'EM_ESTOQUE', label: 'Em Estoque' },
    { id: 'LIBERADO_LEILAO', label: 'Liberado para Leilão' },
    { id: 'EM_LEILAO', label: 'Em Leilão' },
    { id: 'PENDENTE_BAIXA', label: 'Pendente de Baixa' },
    { id: 'PENDENTE_RETIRADA', label: 'Pendente de Retirada' },
    { id: 'AGUARDANDO_REMOCAO', label: 'Aguardando Remoção' },
    { id: 'RETIRADOS', label: 'Retirados' },
    { id: 'PRENSADOS', label: 'Prensados' },
    { id: 'BLOQUEADOS', label: 'Bloqueados' },
]

export async function LotActionButtons({ lotId, currentStatus }: { lotId: string, currentStatus: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleStatusChange = async (newStatus: string) => {
        setIsMenuOpen(false)
        if (newStatus === currentStatus) return

        if (!confirm(`Confirmar alteração de status para: ${newStatus.replace(/_/g, ' ')}?`)) return

        setIsLoading(true)
        const res = await updateLotStatus(lotId, newStatus)
        setIsLoading(false)

        if (res.success) {
            router.refresh()
        } else {
            alert(res.message)
        }
    }

    return (
        <div className="flex gap-1.5 items-center">
            <Link href="/admin/logistics" className="bg-white border border-[#ccc] text-[#333] px-3 py-1.5 text-[12px] font-bold rounded-sm flex items-center gap-1 hover:bg-[#e6e6e6] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
            </Link>

            <button className="bg-[#00c0ef] border border-[#00acd6] text-white px-3 py-1.5 text-[12px] font-bold rounded-sm flex items-center gap-1 hover:bg-[#00acd6] transition-colors">
                <Edit className="w-3.5 h-3.5" /> Editar
            </button>

            <div className="relative">
                <button
                    disabled={isLoading}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-[#3c8dbc] border border-[#367fa9] text-white px-3 py-1.5 text-[12px] font-bold rounded-sm flex items-center gap-1 hover:bg-[#367fa9] transition-colors">
                    <RefreshCcw className="w-3.5 h-3.5" />
                    {isLoading ? 'Aguarde...' : 'Alterar Status'}
                </button>

                {isMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#ddd] shadow-lg rounded-sm py-1 z-20 max-h-64 overflow-y-auto">
                            {LOGISTICS_STATUSES.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => handleStatusChange(s.id)}
                                    className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#f4f4f4] ${currentStatus === s.id ? 'font-bold text-[#3c8dbc] bg-[#f9f9f9]' : 'text-[#333]'}`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
