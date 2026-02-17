import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Lot } from '@prisma/client'
import { BidForm } from './bid-form'
import { Gavel, Clock } from 'lucide-react'

interface LotCardProps {
    lot: Lot
}

export function LotCard({ lot }: LotCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
            {/* Image Area */}
            <div className="aspect-video bg-gray-200 relative group">
                <div className="absolute top-2 left-2 z-10">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800 backdrop-blur-sm border shadow-sm">
                        Lote {lot.id.substring(lot.id.length - 3)}
                    </Badge>
                </div>
                {lot.imageUrl ? (
                    <img src={lot.imageUrl} alt={lot.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 p-4 text-center text-sm">
                        Sem Imagem
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Encerra em: 2 dias</span>
                </div>
            </div>

            <CardContent className="p-4">
                <h3 className="font-bold text-gray-800 line-clamp-2 h-10 leading-tight mb-2" title={lot.title}>
                    {lot.title}
                </h3>

                <div className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[2.5em]">
                    {lot.description || "Sem descrição."}
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <BidForm
                        lotId={lot.id}
                        currentPrice={lot.currentBid || lot.startingPrice}
                        increment={lot.incrementAmount}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
