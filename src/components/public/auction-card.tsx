import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Gavel } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Auction } from '@prisma/client'

interface AuctionCardProps {
    auction: Auction & { _count: { lots: number } }
}

export function AuctionCard({ auction }: AuctionCardProps) {
    const isLive = auction.status === 'LIVE'
    const isUpcoming = auction.status === 'UPCOMING'
    
    return (
        <Card className="group relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-white flex flex-col h-full rounded-2xl">
            {/* Status Ribbon / Top Bar */}
            <div className={cn(
                "py-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] flex justify-between items-center text-white",
                isLive ? "bg-red-600 animate-pulse" : isUpcoming ? "bg-primary" : "bg-gray-800"
            )}>
                <span className="flex items-center gap-2">
                    {isLive && <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
                    {isLive ? 'Leilão ao Vivo' : isUpcoming ? 'Em Breve' : 'Aberto para Lances'}
                </span>
                {auction._count.lots > 0 && (
                    <span className="text-white/60">{auction._count.lots} Lotes</span>
                )}
            </div>

            {/* Visual Header / Cover Image Area */}
            <div className="relative h-44 overflow-hidden bg-primary/5">
                {auction.coverImage ? (
                    <img 
                        src={auction.coverImage} 
                        alt={auction.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                        <Gavel className="w-12 h-12 text-primary mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sem Imagem</span>
                    </div>
                )}
                
                {/* Decorative Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <Button className="w-full bg-secondary text-primary font-bold hover:bg-secondary/90 h-9 rounded-lg">
                        VER LEILÃO
                    </Button>
                </div>
            </div>

            <CardContent className="p-6 flex-1 flex flex-col">
                <div className="space-y-1 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest leading-none mb-1">
                        <MapPin className="h-3 w-3" />
                        {auction.type} • {auction.modalidade || 'Presencial/Online'}
                    </div>
                    <h3 className="font-extrabold text-lg text-primary leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                        {auction.title}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Encerramento</span>
                            <span className="text-sm font-black text-primary tracking-tight">
                                {formatDate(auction.endDate)}
                            </span>
                        </div>
                        <div className="h-8 w-8 bg-primary/5 rounded-full flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary opacity-30" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tighter">
                    <span className="flex items-center gap-1">
                        <Gavel className="w-3 h-3" /> {auction.type === 'ONLINE' ? 'Auditório Virtual' : 'Auditório Misto'}
                    </span>
                </div>
            </CardContent>

            {/* Bottom Progress Bar - Aesthetic Only */}
            <div className="h-1 bg-gray-100 relative w-full">
                <div 
                    className={cn(
                        "absolute top-0 left-0 h-full transition-all duration-1000",
                        isLive ? "bg-red-600 w-full" : "bg-secondary w-1/3"
                    )} 
                />
            </div>

            <Link href={`/auctions/${auction.id}`} className="absolute inset-0 z-10" />
        </Card>
    )
}

import { cn } from '@/lib/utils'
