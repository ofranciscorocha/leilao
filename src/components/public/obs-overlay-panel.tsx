'use client'

import { useEffect, useState } from "react"
import { io, Socket } from 'socket.io-client'

export function ObsOverlayPanel({ auction, lots }: { auction: any, lots: any[] }) {
    const auctionId = auction.id
    const [socket, setSocket] = useState<Socket | null>(null)
    const [activeLotId, setActiveLotId] = useState<string | null>(auction.activeLotId || (lots.length > 0 ? lots[0].id : null))
    const [currentBid, setCurrentBid] = useState(0)
    const [lastBidder, setLastBidder] = useState('Ninguém')
    const [lotSold, setLotSold] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const activeLot = lots.find(l => l.id === activeLotId)

    useEffect(() => {
        const newSocket = io({ transports: ['websocket'], path: '/api/socket' })

        newSocket.on('connect', () => {
            newSocket.emit('join-auction', auctionId)
        })

        newSocket.on('auction-update', (data) => {
            switch (data.type) {
                case 'CHANGE_LOT':
                    setActiveLotId(data.payload.lotId)
                    setCurrentBid(0)
                    setLastBidder('Ninguém')
                    setLotSold(false)
                    setMessage(null)
                    break;
                case 'NEW_BID':
                    if (data.payload.lotId === activeLotId) {
                        setCurrentBid(data.payload.amount)
                        setLastBidder(data.payload.bidderName || 'Arrematante')
                    }
                    break;
                case 'LOT_SOLD':
                    setLotSold(true)
                    break;
                case 'OPERATOR_MESSAGE':
                    setMessage(data.payload.text)
                    setTimeout(() => setMessage(null), 8000) // Clear message after 8s
                    break;
            }
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [auctionId, activeLotId])

    if (!activeLot) return null

    return (
        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center pointer-events-none">

            {/* Operator Message Toast */}
            {message && !lotSold && (
                <div className="mb-4 bg-red-600 text-white px-6 py-2 rounded-full font-bold text-2xl shadow-2xl animate-bounce">
                    {message}
                </div>
            )}

            {/* Main Overlay Banner */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-4 border-[#3c8dbc] overflow-hidden flex w-full max-w-5xl transition-all duration-500">

                {/* Lot Details - Left Side */}
                <div className="flex-1 p-6 flex items-center border-r-2 border-gray-200">
                    <div>
                        <div className="bg-[#3c8dbc] text-white px-3 py-1 inline-block text-xl font-black rounded-sm mb-2 uppercase tracking-wide">
                            Lote {activeLot.lotNumber}
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 leading-tight uppercase">
                            {activeLot.title}
                        </h2>
                        <div className="text-gray-500 text-xl font-bold mt-1">
                            {activeLot.manufacturer} {activeLot.model} {activeLot.year ? `• ${activeLot.year}` : ''}
                        </div>
                    </div>
                </div>

                {/* Bid Details - Right Side */}
                <div className={`w-[450px] p-6 flex flex-col justify-center items-center transition-colors duration-500 ${lotSold ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-800'}`}>
                    {lotSold ? (
                        <>
                            <div className="text-5xl font-black uppercase tracking-widest mb-2 animate-pulse">Vendido!</div>
                            <div className="text-3xl font-bold">R$ {currentBid.toLocaleString('pt-BR')}</div>
                            <div className="text-xl mt-2 text-green-100 uppercase">para: {lastBidder}</div>
                        </>
                    ) : (
                        <>
                            <div className="text-lg font-bold uppercase tracking-widest text-gray-500 mb-1">Valor Atual</div>
                            {currentBid > 0 ? (
                                <>
                                    <div className="text-6xl font-black text-[#00a65a]">R$ {currentBid.toLocaleString('pt-BR')}</div>
                                    <div className="text-xl mt-2 font-bold text-gray-600 uppercase">Arrematante: <span className="text-[#3c8dbc]">{lastBidder}</span></div>
                                </>
                            ) : (
                                <>
                                    <div className="text-5xl font-black text-gray-400">R$ {activeLot.startingPrice?.toLocaleString('pt-BR') || '0,00'}</div>
                                    <div className="text-lg mt-2 font-bold text-gray-400 uppercase">Aguardando Lances...</div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
