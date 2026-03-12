import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Lot } from '@prisma/client'
import { BidForm } from "./bid-form"
import { Gavel, Clock } from "lucide-react"

interface LotCardProps {
    lot: any // Using any for flexibility with Prisma includes, but will handle properties safely
}

export function LotCard({ lot }: LotCardProps) {
    const currentPrice = lot.currentBid || lot.startingPrice
    const count = lot.bidsCount || lot._count?.bids || 0
    
    return (
        <Card className="group relative overflow-hidden bg-white border-2 border-transparent hover:border-secondary/20 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl flex flex-col">
            {/* Image Area with Premium Overlay */}
            <div className="aspect-[4/3] bg-primary/5 relative overflow-hidden">
                <div className="absolute top-4 left-4 z-20">
                    <div className="bg-primary/90 text-secondary backdrop-blur-md px-3 py-1.5 rounded-xl border border-secondary/30 shadow-2xl flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest">Lote</span>
                        <span className="text-sm font-black italic">{lot.lotNumber || lot.id.slice(-3)}</span>
                    </div>
                </div>
                
                {lot.imageUrl ? (
                    <img 
                        src={lot.imageUrl} 
                        alt={lot.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-primary/20 p-8 text-center">
                        <Gavel className="w-16 h-16 mb-2 opacity-10" />
                        <span className="text-[10px] font-bold uppercase tracking-widest italic">Aguardando Imagem</span>
                    </div>
                )}
                
                {/* Gradient Overlay for info protection */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white z-10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3 text-secondary" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Encerra em 2d 04h</span>
                    </div>
                    <Badge className="bg-secondary text-primary font-black text-[9px] uppercase tracking-widest border-none">
                        Destaque
                    </Badge>
                </div>
            </div>

            <CardContent className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="font-black text-primary text-base leading-tight group-hover:text-secondary transition-colors line-clamp-2 h-10 mb-1 uppercase italic tracking-tight">
                        {lot.title}
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground line-clamp-1 uppercase tracking-widest opacity-60">
                        {lot.description || "Descrição técnica pendente"}
                    </p>
                </div>

                <div className="mt-auto space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Lance Atual</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-secondary font-black text-xs">R$</span>
                                <span className="text-2xl font-black text-primary tracking-tighter">
                                    {formatCurrency(currentPrice).split('R$')[1]}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1 justify-end">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                {count} Lances
                            </span>
                        </div>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/5 group-hover:bg-secondary/5 transition-colors">
                        <BidForm
                            lotId={lot.id}
                            currentPrice={currentPrice}
                            increment={lot.incrementAmount}
                        />
                    </div>
                </div>
            </CardContent>
            
            <Link href={`/lots/${lot.id}`} className="absolute top-0 left-0 right-0 h-[60%] z-0" />
        </Card>
    )
}

