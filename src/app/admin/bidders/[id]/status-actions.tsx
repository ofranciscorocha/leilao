'use client'

import { useState } from 'react'
import { Check, Clock, XCircle, Ban } from 'lucide-react'
import { updateBidderStatus } from '@/app/actions/bidders'
import { useRouter } from 'next/navigation'

export function StatusActions({ userId, currentStatus }: { userId: string, currentStatus: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleStatusChange = async (newStatus: string) => {
        let reason = '';
        if (newStatus === 'REJECTED' || newStatus === 'PENDING') {
            const promptMsg = newStatus === 'REJECTED'
                ? 'Informe o motivo da reprovação (será enviado ao e-mail do cliente):'
                : 'Informe a observação para colocar em análise (opcional):';
            const input = window.prompt(promptMsg);
            if (input === null) return; // cancelled
            reason = input;
        }

        setIsLoading(true)
        const result = await updateBidderStatus(userId, newStatus, reason)
        setIsLoading(false)

        if (result.success) {
            alert(result.message)
            router.refresh()
        } else {
            alert(result.message)
        }
    }

    return (
        <div className="flex gap-1">
            <button
                disabled={isLoading || currentStatus === 'ACTIVE'}
                onClick={() => handleStatusChange('ACTIVE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-white text-[12px] font-bold transition-colors ${currentStatus === 'ACTIVE' ? 'bg-[#00a65a] opacity-80 cursor-default' : 'bg-[#00a65a] hover:bg-[#008d4c] border border-[#008d4c]'}`}>
                <Check className="w-3.5 h-3.5" /> Ativar
            </button>

            <button
                disabled={isLoading || currentStatus === 'PENDING'}
                onClick={() => handleStatusChange('PENDING')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-white text-[12px] font-bold transition-colors ${currentStatus === 'PENDING' ? 'bg-[#00c0ef] opacity-80 cursor-default' : 'bg-[#00c0ef] hover:bg-[#00acd6] border border-[#00acd6]'}`}>
                <Clock className="w-3.5 h-3.5" /> Em Análise
            </button>

            <button
                disabled={isLoading || currentStatus === 'REJECTED'}
                onClick={() => handleStatusChange('REJECTED')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-white text-[12px] font-bold transition-colors ${currentStatus === 'REJECTED' ? 'bg-[#f39c12] opacity-80 cursor-default' : 'bg-[#f39c12] hover:bg-[#e08e0b] border border-[#e08e0b]'}`}>
                <XCircle className="w-3.5 h-3.5" /> Reprovar
            </button>

            <button
                disabled={isLoading || currentStatus === 'BLOCKED'}
                onClick={() => handleStatusChange('BLOCKED')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-white text-[12px] font-bold transition-colors ${currentStatus === 'BLOCKED' ? 'bg-[#dd4b39] opacity-80 cursor-default' : 'bg-[#dd4b39] hover:bg-[#d73925] border border-[#d73925]'}`}>
                <Ban className="w-3.5 h-3.5" /> Bloquear
            </button>
        </div>
    )
}
