'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { placeBid } from "@/app/actions/bid"
import { toast } from 'sonner'
import { Gavel } from "lucide-react"
import { socket } from "@/lib/socket-client"

interface BidFormProps {
    lotId: string
    currentPrice: number
    increment: number
}

export function BidForm({ lotId, currentPrice: initialPrice, increment }: BidFormProps) {
    const [currentPrice, setCurrentPrice] = useState(initialPrice)
    const [amount, setAmount] = useState(initialPrice + increment)
    const [name, setName] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [showNameInput, setShowNameInput] = useState(false)

    useEffect(() => {
        // Listen for bid updates
        socket.on(`lot:${lotId}:bid`, (data: any) => {
            console.log('Realtime bid received:', data)
            setCurrentPrice(data.amount)
            setAmount(data.amount + increment)
            toast.success(`Novo lance recebido: R$ ${data.amount.toLocaleString('pt-BR')}`)
        })

        return () => {
            socket.off(`lot:${lotId}:bid`)
        }
    }, [lotId, increment])

    async function handleBid() {
        if (!showNameInput) {
            setShowNameInput(true)
            toast.info("Por favor, digite seu nome para confirmar o lance.")
            return
        }

        if (!name) {
            toast.error("Digite seu nome para dar o lance.")
            return
        }

        setIsPending(true)
        const res = await placeBid(lotId, amount, name)
        setIsPending(false)

        if (res.success) {
            toast.success(res.message)
            setShowNameInput(false)
            // Optimistic update handled by socket, but safe to set here too
        } else {
            toast.error(res.message)
        }
    }

    return (
        <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Lance Atual:</span>
                <span className="font-bold text-green-700 text-lg">R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            {showNameInput && (
                <Input
                    placeholder="Seu Nome (para identificar o lance)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-2 text-xs"
                    autoFocus
                />
            )}

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="pl-8"
                    />
                </div>
                <Button
                    onClick={handleBid}
                    disabled={isPending}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                    <Gavel className="mr-2 h-4 w-4" />
                    {isPending ? '...' : 'DAR LANCE'}
                </Button>
            </div>
            <p className="text-[10px] text-center text-gray-400">
                Incremento mínimo: R$ {increment.toLocaleString('pt-BR')}
            </p>
        </div>
    )
}
