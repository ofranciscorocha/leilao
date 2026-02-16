import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Package } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Auction } from '@prisma/client'

interface AuctionCardProps {
    auction: Auction & { _count: { lots: number } }
}

export function AuctionCard({ auction }: AuctionCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
                {auction.imageUrl ? (
                    <img src={auction.imageUrl} alt={auction.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge variant={auction.status === 'OPEN' ? 'default' : 'secondary'}>
                        {auction.status}
                    </Badge>
                </div>
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-1">{auction.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {auction.description || 'No description available.'}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(auction.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>{auction._count.lots} lots</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" asChild>
                    <Link href={`/auctions/${auction.id}`}>
                        View Lots
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
