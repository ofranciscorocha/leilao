'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Play, Pause, Gavel, SkipForward, Megaphone } from 'lucide-react'

interface AuctioneerPanelProps {
    auctionId: string
}

export function AuctioneerPanel({ auctionId }: AuctioneerPanelProps) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [message, setMessage] = useState('')
    const [currentBid, setCurrentBid] = useState(0)
    const [lastBidder, setLastBidder] = useState('Ninguém')

    useEffect(() => {
        const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001' : ''
        const newSocket = io(socketUrl, { transports: ['websocket'] })

        newSocket.on('connect', () => {
            setIsConnected(true)
            newSocket.emit('join_auction', auctionId)
        })

        newSocket.on('disconnect', () => setIsConnected(false))

        // Listen for bids on any lot in this auction (simplified)
        // In a real app, we'd listen to the specific active lot channel
        newSocket.onAny((event, data) => {
            if (event.includes(':bid')) {
                setCurrentBid(data.amount)
                setLastBidder(data.bidderName || 'Arrematante')
                toast.success(`Novo lance de ${data.bidderName}: ${data.amount}`)
            }
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [auctionId])

    const sendCommand = (type: string, payload: any = {}) => {
        if (!socket) return
        socket.emit('admin_command', {
            auctionId,
            type,
            ...payload
        })
        toast.success(`Comando ${type} enviado!`)
    }

    const handleHammer = () => {
        // In real app, prompt for confirmation or amount
        sendCommand('HAMMER', { amount: currentBid, winner: lastBidder })
        toast.error(`Lote VENDIDO por R$ ${currentBid} para ${lastBidder}!`)
    }

    const handleMessage = () => {
        if (!message) return
        sendCommand('MESSAGE', { text: message })
        setMessage('')
    }

    return (
        <Card className="p-6 space-y-6 bg-gray-50 border-2 border-gray-200">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Gavel className="h-6 w-6 text-gray-800" />
                    Painel do Leiloeiro
                </h2>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-white text-lg px-4 py-1">
                        R$ {currentBid.toLocaleString('pt-BR')}
                    </Badge>
                    <Badge variant={isConnected ? 'default' : 'destructive'}>
                        {isConnected ? 'Conectado' : 'Offline'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Controls */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">Controles de Pregão</h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                            onClick={() => sendCommand('RESUME')}
                        >
                            <Play className="mr-2 h-4 w-4" /> Abrir/Retomar Lote
                        </Button>
                        <Button
                            className="bg-yellow-500 hover:bg-yellow-600 text-black flex-1"
                            onClick={() => sendCommand('PAUSE')}
                        >
                            <Pause className="mr-2 h-4 w-4" /> Pausar
                        </Button>
                    </div>

                    <Button
                        size="lg"
                        variant="destructive"
                        className="w-full h-16 text-xl font-bold border-4 border-red-700"
                        onClick={handleHammer}
                    >
                        <Gavel className="mr-3 h-8 w-8" />
                        BATER O MARTELO (VENDIDO)
                    </Button>

                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => sendCommand('NEXT_LOT')}
                    >
                        <SkipForward className="mr-2 h-4 w-4" /> Próximo Lote (Sem vender atual)
                    </Button>
                </div>

                {/* Communication */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">Comunicados</h3>
                    <div className="flex gap-2">
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Mensagem para o auditório..."
                            onKeyDown={(e) => e.key === 'Enter' && handleMessage()}
                        />
                        <Button onClick={handleMessage}>
                            <Megaphone className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Atalhos Rápidos:</h4>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => sendCommand('MESSAGE', { text: 'Dou-lhe uma!' })}>Dou-lhe uma!</Button>
                            <Button variant="outline" size="sm" onClick={() => sendCommand('MESSAGE', { text: 'Dou-lhe duas!' })}>Dou-lhe duas!</Button>
                            <Button variant="outline" size="sm" onClick={() => sendCommand('MESSAGE', { text: 'Lote em Condicional!' })}>Condicional</Button>
                            <Button variant="outline" size="sm" onClick={() => sendCommand('MESSAGE', { text: 'Atenção: Lance Final!' })}>Atenção!</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
