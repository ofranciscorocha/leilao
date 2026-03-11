'use client'

import { useEffect, useState } from 'react'
import { useRealtimeBids } from '@/hooks/use-realtime-bids'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TrendingUp, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface RealtimeBidListProps {
  lotId: string
  currentBid?: number
}

export function RealtimeBidList({ lotId, currentBid }: RealtimeBidListProps) {
  const { bids, latestBid } = useRealtimeBids(lotId)
  const [highlightedBidId, setHighlightedBidId] = useState<string | null>(null)

  // Highlight new bids temporarily
  useEffect(() => {
    if (latestBid) {
      setHighlightedBidId(latestBid.id)

      // Play sound notification
      const audio = new Audio('/sounds/bid.mp3')
      audio.play().catch(() => {
        // Ignore autoplay errors
      })

      // Remove highlight after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedBidId(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [latestBid])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Lances em Tempo Real
        </CardTitle>
        {currentBid && (
          <div className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(currentBid)}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {bids.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum lance ainda. Seja o primeiro!
            </div>
          ) : (
            <div className="space-y-2">
              {bids.map((bid, index) => (
                <div
                  key={bid.id}
                  className={`p-3 rounded-lg border transition-all ${
                    bid.id === highlightedBidId
                      ? 'bg-green-50 border-green-500 animate-pulse'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Award className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="font-medium">
                        Lance #{bids.length - index}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(bid.amount)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(bid.timestamp), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
