'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Megaphone, MessageSquare, PlayCircle, ShieldCheck } from 'lucide-react'

export function PublicLiveAuctionPanel({ auction, lots }: { auction: any, lots: any[] }) {
    const auctionId = auction.id
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [activeLotId, setActiveLotId] = useState<string | null>(auction.activeLotId || (lots.length > 0 ? lots[0].id : null))
    const [currentBid, setCurrentBid] = useState(0)
    const [lastBidder, setLastBidder] = useState('Ninguém')
    const [events, setEvents] = useState<Array<{ id: string, text: string, type: 'system' | 'bid' | 'message', time: string }>>([])

    const activeLot = lots.find(l => l.id === activeLotId)

    const addEvent = (text: string, type: 'system' | 'bid' | 'message') => {
        setEvents(prev => [...prev, {
            id: Date.now().toString() + Math.random(),
            text,
            type,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }])
    }

    useEffect(() => {
        const newSocket = io({ transports: ['websocket'], path: '/api/socket' })

        newSocket.on('connect', () => {
            setIsConnected(true)
            newSocket.emit('join-auction', auctionId)
            addEvent('Conectado ao auditório virtual.', 'system')
        })

        newSocket.on('disconnect', () => {
            setIsConnected(false)
            addEvent('Desconectado. Tentando reconectar...', 'system')
        })

        newSocket.on('auction-update', (data) => {
            console.log('Update received:', data)

            switch (data.type) {
                case 'CHANGE_LOT':
                    setActiveLotId(data.payload.lotId)
                    setCurrentBid(0)
                    setLastBidder('Ninguém')
                    addEvent(`O Leiloeiro abriu o Lote ${lots.find(l => l.id === data.payload.lotId)?.lotNumber}.`, 'system')
                    break;
                case 'NEW_BID':
                    if (data.payload.lotId === activeLotId) {
                        setCurrentBid(data.payload.amount)
                        setLastBidder(data.payload.bidderName || 'Arrematante')
                        addEvent(`Lance no valor de R$ ${data.payload.amount.toLocaleString('pt-BR')} por ${data.payload.bidderName}`, 'bid')
                    }
                    break;
                case 'LOT_SOLD':
                    addEvent(`Lote VENDIDO por R$ ${data.payload.amount.toLocaleString('pt-BR')}!`, 'system')
                    break;
                case 'OPERATOR_MESSAGE':
                    addEvent(`Leiloeiro diz: ${data.payload.text}`, 'message')
                    break;
            }
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [auctionId, activeLotId, lots])

    const placeBid = () => {
        if (!socket || !activeLotId) return

        // Em um app real, o valor e o usuário viriam da interface e da sessão.
        const increment = activeLot?.incrementAmount || 50
        const bidAmount = currentBid === 0 ? (activeLot?.startingPrice || 100) : currentBid + increment

        socket.emit('auction-action', {
            auctionId,
            type: 'NEW_BID',
            payload: {
                lotId: activeLotId,
                amount: bidAmount,
                bidderName: 'Arrematante Demo'
            }
        })

        // Optimistic UI could be implemented here, but we'll wait for server broadcast
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Video and Lot Details */}
            <div className="lg:col-span-2 space-y-6">

                {/* Video Embed Area */}
                <div className="bg-black w-full rounded-md overflow-hidden shadow-lg aspect-[16/9] relative flex items-center justify-center">
                    {auction.videoEmbedUrl ? (
                        <iframe
                            src={auction.videoEmbedUrl}
                            title="Live Auction Video"
                            className="w-full h-full absolute inset-0 border-0"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center">
                            <PlayCircle className="w-16 h-16 mb-2 opacity-50" />
                            <p>Transmissão Indisponível</p>
                            <p className="text-xs mt-2">O áudio do leiloeiro e os eventos ainda estão sincronizados abaixo.</p>
                        </div>
                    )}
                </div>

                {/* Active Lot Details Card */}
                {activeLot ? (
                    <Card className="p-0 overflow-hidden shadow-md border-0 bg-white">
                        <div className="bg-[#3c8dbc] text-white p-3 flex justify-between items-center">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                Lote {activeLot.lotNumber} - {activeLot.title}
                            </h2>
                            <div className="bg-black/20 px-3 py-1 rounded text-sm font-bold">
                                Categoria: {activeLot.category}
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Informações Técnicas</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li><strong>Marca/Modelo:</strong> {activeLot.manufacturer || 'N/A'} {activeLot.model}</li>
                                    <li><strong>Ano:</strong> {activeLot.year || 'N/A'}</li>
                                    <li><strong>Cor:</strong> {activeLot.color || 'N/A'}</li>
                                    <li><strong>Localização:</strong> {activeLot.location || 'Patio Principal'}</li>
                                    <li><strong>Combustível:</strong> {activeLot.fuel || 'Flex'}</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 flex flex-col justify-center">
                                <p className="text-xs text-center text-gray-500 uppercase tracking-widest mb-1">Status de Lances</p>
                                <div className="text-center">
                                    <div className="text-sm text-gray-400 mb-1">Situação Inicial: R$ {activeLot.startingPrice?.toLocaleString('pt-BR') || '0,00'}</div>
                                    <div className="text-3xl font-black text-green-600 my-2">R$ {currentBid.toLocaleString('pt-BR')}</div>
                                    <div className="text-sm font-bold text-[#333]">Maior Lance atual: <span className="bg-yellow-200 px-2 py-0.5 rounded text-yellow-800">{lastBidder}</span></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="p-8 text-center text-gray-500 bg-white shadow-sm border-0">
                        Nenhum lote ativo no momento. Aguarde o leiloeiro ou prepare-se.
                    </Card>
                )}
            </div>

            {/* Right Column: Interaction & Bidding */}
            <div className="space-y-4 h-[calc(100vh-200px)] min-h-[500px] flex flex-col">
                {/* Connection Status Header */}
                <div className="bg-white p-3 flex justify-between items-center rounded-sm shadow-sm border border-gray-200">
                    <span className="font-bold text-[#333] text-sm flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#3c8dbc]" />
                        Auditório Virtual
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold font-mono">
                        <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {isConnected ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>

                {/* Event Log Window */}
                <Card className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fa] border shadow-inner">
                    {events.map(ev => (
                        <div key={ev.id} className="text-sm animate-in fade-in slide-in-from-bottom-2">
                            {ev.type === 'system' && (
                                <div className="text-center bg-gray-200/50 text-gray-600 py-1 px-2 rounded-sm text-xs font-medium">
                                    {ev.time} - {ev.text}
                                </div>
                            )}
                            {ev.type === 'message' && (
                                <div className="flex items-start gap-2 bg-blue-50/80 border border-blue-100 p-2 rounded-md font-medium text-blue-900 shadow-sm">
                                    <Megaphone className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>{ev.text}</span>
                                </div>
                            )}
                            {ev.type === 'bid' && (
                                <div className="flex items-center gap-2 bg-green-50 border border-green-100 p-2 rounded-md font-bold text-green-900 shadow-sm">
                                    <div className="w-1.5 h-full self-stretch bg-green-500 rounded-full"></div>
                                    <span>{ev.text}</span>
                                </div>
                            )}
                        </div>
                    ))}
                    {events.length === 0 && (
                        <div className="text-center text-gray-400 text-xs mt-10">
                            Aguardando o início do leilão...
                        </div>
                    )}
                </Card>

                {/* Bidding Action Component */}
                <div className="bg-white p-4 rounded-md shadow-lg border-t-4 border-[#00a65a]">
                    <div className="flex justify-between text-sm mb-2 text-gray-600">
                        <span>Próximo lance sugerido:</span>
                        <span className="font-bold text-[#333]">
                            R$ {(currentBid === 0 ? (activeLot?.startingPrice || 100) : currentBid + (activeLot?.incrementAmount || 50)).toLocaleString('pt-BR')}
                        </span>
                    </div>
                    <Button
                        size="lg"
                        className="w-full h-14 text-lg font-bold uppercase tracking-wider bg-[#00a65a] hover:bg-[#008d4c] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-50 disabled:transform-none"
                        onClick={placeBid}
                        disabled={!isConnected || !activeLotId}
                    >
                        Dar Lance
                    </Button>
                    <p className="text-[10px] text-center text-gray-400 mt-2 leading-tight">
                        Ao clicar em "Dar Lance" você aceita os termos e condições do leilão. Lances não podem ser desfeitos.
                    </p>
                </div>
            </div>
        </div>
    )
}
