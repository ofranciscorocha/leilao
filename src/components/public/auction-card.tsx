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
    return (
        <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full bg-white group">
            {/* Header Status */}
            <div className="bg-[#1e293b] text-white py-1 px-3 text-[10px] font-bold uppercase tracking-wider flex justify-between items-center">
                <span className="flex items-center gap-1">
                    <Gavel className="h-3 w-3" />
                    Aberto para lances
                </span>
            </div>

            {/* Image / Logo Section */}
            <div className="h-32 bg-gray-100 relative border-b p-4 flex items-center justify-center">
                {/* Placeholder for Seller Logo */}
                <div className="bg-white p-2 rounded shadow-sm">
                    <span className="font-bold text-xl text-gray-400">LOGO</span>
                </div>
            </div>

            <CardContent className="p-4 flex-1">
                <h3 className="font-bold text-sm text-gray-800 mb-4 line-clamp-2 h-10 leading-tight group-hover:text-blue-700 transition-colors">
                    {auction.title}
                </h3>

                <div className="space-y-3 text-xs text-gray-600">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900">1º Leilão:</span>
                        <span className="flex items-center gap-1">
                            {formatDate(auction.endDate)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900">2º Leilão:</span>
                        <span className="flex items-center gap-1">
                            {formatDate(new Date(auction.endDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
                        </span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t flex flex-col gap-1">
                    <div className="text-xs text-gray-500 font-semibold uppercase">
                        Apartamento DUPLEX em São Paulo/SP
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase">
                        <MapPin className="h-3 w-3" />
                        Online
                    </div>
                </div>
            </CardContent>

            {/* Footer Status Bar */}
            <div className="bg-green-600 text-white text-center py-2 text-xs font-bold uppercase tracking-wide">
                EM ANDAMENTO
            </div>

            <Link href={`/auctions/${auction.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View Auction</span>
            </Link>
        </Card>
    )
}
