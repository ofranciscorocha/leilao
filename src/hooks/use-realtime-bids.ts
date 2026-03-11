'use client'

import { useEffect, useState } from 'react'
import { subscribeToBids, subscribeToLot, unsubscribe, BidUpdate, LotUpdate } from '@/lib/realtime'

interface Bid {
  id: string
  amount: number
  userId: string
  timestamp: string
}

interface LotData {
  currentBid?: number
  status?: string
  winnerId?: string
}

/**
 * Hook para assinar lances em tempo real de um lote
 */
export function useRealtimeBids(lotId: string | null) {
  const [bids, setBids] = useState<Bid[]>([])
  const [latestBid, setLatestBid] = useState<Bid | null>(null)

  useEffect(() => {
    if (!lotId) return

    const channel = subscribeToBids(lotId, (bidUpdate: BidUpdate) => {
      const bid = {
        id: bidUpdate.id,
        amount: bidUpdate.amount,
        userId: bidUpdate.userId,
        timestamp: bidUpdate.timestamp,
      }

      setLatestBid(bid)

      if (bidUpdate.type === 'INSERT') {
        setBids((prev) => [bid, ...prev])
      }
    })

    return () => {
      unsubscribe(channel)
    }
  }, [lotId])

  return { bids, latestBid }
}

/**
 * Hook para assinar atualizações de um lote
 */
export function useRealtimeLot(lotId: string | null) {
  const [lotData, setLotData] = useState<LotData | null>(null)

  useEffect(() => {
    if (!lotId) return

    const channel = subscribeToLot(lotId, (lotUpdate: LotUpdate) => {
      setLotData({
        currentBid: lotUpdate.currentBid,
        status: lotUpdate.status,
        winnerId: lotUpdate.winnerId,
      })
    })

    return () => {
      unsubscribe(channel)
    }
  }, [lotId])

  return lotData
}

/**
 * Hook combinado para lances e lote
 */
export function useRealtimeAuction(lotId: string | null) {
  const { bids, latestBid } = useRealtimeBids(lotId)
  const lotData = useRealtimeLot(lotId)

  return {
    bids,
    latestBid,
    currentBid: lotData?.currentBid,
    status: lotData?.status,
    winnerId: lotData?.winnerId,
  }
}
