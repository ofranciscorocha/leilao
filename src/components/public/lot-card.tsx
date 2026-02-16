import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Lot } from '@prisma/client'

interface LotCardProps {
    lot: Lot
}

export function LotCard({ lot }: LotCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 relative">
                {lot.imageUrl ? (
                    <img src={lot.imageUrl} alt={lot.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        No Image
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">{lot.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Starting Bid:</span>
                        <span className="font-semibold">{formatCurrency(lot.startingPrice)}</span>
                    </div>
                    {lot.currentBid && (
                        <div className="flex justify-between text-sm">
                            <span className="text-green-600 font-bold">Current Bid:</span>
                            <span className="font-bold text-green-700">{formatCurrency(lot.currentBid)}</span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 line-clamp-2 mt-2">
                        {lot.description}
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    Bid Now
                </Button>
            </CardFooter>
        </Card>
    )
}
