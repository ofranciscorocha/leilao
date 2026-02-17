'use client'

import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion' // Need to check if framer-motion is installed, if not will use standard CSS
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface AuditoriumViewProps {
    auctionId: string
    initialLot: any // detailed lot object
}

export function AuditoriumView({ auctionId, initialLot }: AuditoriumViewProps) {
    const [currentLot, setCurrentLot] = useState(initialLot)
    const [currentBid, setCurrentBid] = useState(initialLot?.currentBid || initialLot?.startingPrice || 0)
    const [lastBidder, setLastBidder] = useState<string | null>(null)
    const [status, setStatus] = useState(initialLot?.status || 'PENDING')
    const [isConnected, setIsConnected] = useState(false)
    const [flash, setFlash] = useState(false)

    useEffect(() => {
        const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001' : ''
        const socket = io(socketUrl, { transports: ['websocket'] })

        socket.on('connect', () => {
            setIsConnected(true)
            socket.emit('join_auction', auctionId)
        })

        socket.on('disconnect', () => setIsConnected(false))

        socket.onAny((event, data) => {
            if (event.includes(':bid')) {
                setCurrentBid(data.amount)
                setLastBidder(data.bidderName)
                setFlash(true)
                setTimeout(() => setFlash(false), 500)
            }
            // In a real app we would listen for lot change events too
        })

        return () => {
            socket.disconnect()
        }
    }, [auctionId])

    if (!currentLot) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center text-white">
                <h1 className="text-4xl">Aguardando início do leilão...</h1>
            </div>
        )
    }

    return (
        <div className="h-screen w-screen bg-black text-white overflow-hidden flex flex-col relative font-sans">
            {/* Background Blur */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-xl scale-110"
                style={{ backgroundImage: `url(${currentLot.imageUrl || '/placeholder-car.jpg'})` }}
            />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-black text-3xl shadow-lg border-2 border-white">
                        {currentLot.lotNumber}
                    </div>
                    <div>
                        <h2 className="text-2xl font-light text-gray-300 uppercase tracking-widest">Em Leilão</h2>
                        <h1 className="text-4xl font-bold text-white drop-shadow-md">{currentLot.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant={isConnected ? 'default' : 'destructive'} className="text-lg px-4 py-1">
                        {isConnected ? 'LIVE' : 'OFFLINE'}
                    </Badge>
                    <img src="/logo-rocha-white.png" alt="Logo" className="h-12 opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 grid grid-cols-12 gap-8 p-8">
                {/* Left: Image (7 cols) */}
                <div className="col-span-8 flex items-center justify-center bg-black/50 rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm relative">
                    <img
                        src={currentLot.imageUrl || '/placeholder-car.jpg'}
                        className="max-w-full max-h-full object-contain"
                        alt="Lot"
                    />
                    {status === 'SOLD' && (
                        <div className="absolute inset-0 bg-red-600/60 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-9xl font-black text-white border-8 border-white p-8 -rotate-12 transform shadow-xl">VENDIDO</span>
                        </div>
                    )}
                </div>

                {/* Right: Bidding Info (4 cols) */}
                <div className="col-span-4 flex flex-col gap-6">
                    <Card className={`flex-1 flex flex-col items-center justify-center p-8 text-center transition-colors duration-300 ${flash ? 'bg-green-700 text-white' : 'bg-white/10 backdrop-blur-md border-white/20 text-white'}`}>
                        <span className="text-xl uppercase tracking-widest text-gray-400 mb-2">Lance Atual</span>
                        <div className="text-7xl lg:text-8xl font-black tracking-tighter tabular-nums drop-shadow-lg">
                            <span className="text-4xl align-top mr-2 text-gray-400">R$</span>
                            {currentBid.toLocaleString('pt-BR')}
                        </div>
                        {lastBidder && (
                            <div className="mt-6 bg-black/40 px-6 py-2 rounded-full border border-white/10">
                                <span className="text-yellow-400 font-bold mr-2">Arrematante:</span>
                                <span className="text-white text-xl">{lastBidder}</span>
                            </div>
                        )}
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <span className="block text-gray-400 text-sm uppercase">Ano/Modelo</span>
                            <span className="text-2xl font-bold">{currentLot.year || 'N/A'}</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <span className="block text-gray-400 text-sm uppercase">Local</span>
                            <span className="text-2xl font-bold truncate">{currentLot.logistics?.storageLocation || 'Pátio Rocha'}</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-lg mt-auto">
                        <p className="text-center font-bold text-lg mb-2">Dê seu lance agora!</p>
                        <div className="bg-white p-2 rounded flex justify-center">
                            {/* In real app, this would be a real QR Code to /lote/[id] */}
                            <div className="h-32 w-32 bg-gray-200 flex items-center justify-center text-black text-xs text-center p-2">
                                QR CODE <br /> DO LOTE
                            </div>
                        </div>
                        <p className="text-center text-sm mt-2 opacity-80">Acesse patiorochaleiloes.com.br</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
