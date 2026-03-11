'use client'

import { supabase } from './supabase-client'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface BidUpdate {
  id: string
  amount: number
  userId: string
  lotId: string
  timestamp: string
  type: 'INSERT' | 'UPDATE' | 'DELETE'
}

export interface LotUpdate {
  id: string
  currentBid?: number
  status?: string
  winnerId?: string
  type: 'INSERT' | 'UPDATE' | 'DELETE'
}

/**
 * Assinar atualizações de lances em tempo real
 */
export function subscribeToBids(
  lotId: string,
  onBidUpdate: (bid: BidUpdate) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`bids:${lotId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Bid',
        filter: `lotId=eq.${lotId}`,
      },
      (payload) => {
        onBidUpdate({
          ...(payload.new as any),
          type: payload.eventType as any,
        })
      }
    )
    .subscribe()

  return channel
}

/**
 * Assinar atualizações de lote em tempo real
 */
export function subscribeToLot(
  lotId: string,
  onLotUpdate: (lot: LotUpdate) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`lot:${lotId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'Lot',
        filter: `id=eq.${lotId}`,
      },
      (payload) => {
        onLotUpdate({
          ...(payload.new as any),
          type: 'UPDATE',
        })
      }
    )
    .subscribe()

  return channel
}

/**
 * Assinar todos os lances de um leilão
 */
export function subscribeToAuctionBids(
  auctionId: string,
  onBidUpdate: (bid: BidUpdate) => void
): RealtimeChannel {
  // Primeiro, precisamos pegar todos os lotes do leilão
  // e depois criar um canal para cada um
  // Ou criar um canal único que escuta todos os lances

  const channel = supabase
    .channel(`auction:${auctionId}:bids`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Bid',
      },
      async (payload) => {
        // Verificar se o lance pertence ao leilão
        const { data: lot } = await supabase
          .from('Lot')
          .select('auctionId')
          .eq('id', (payload.new as any).lotId)
          .single()

        if (lot?.auctionId === auctionId) {
          onBidUpdate({
            ...(payload.new as any),
            type: payload.eventType as any,
          })
        }
      }
    )
    .subscribe()

  return channel
}

/**
 * Presence para rastrear usuários online no auditório
 */
export function joinAuctionPresence(
  auctionId: string,
  userId: string,
  userName: string
) {
  const channel = supabase.channel(`presence:auction:${auctionId}`, {
    config: {
      presence: {
        key: userId,
      },
    },
  })

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      console.log('Online users:', state)
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('User joined:', key, newPresences)
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('User left:', key, leftPresences)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          userId,
          userName,
          onlineAt: new Date().toISOString(),
        })
      }
    })

  return channel
}

/**
 * Broadcast para mensagens em tempo real (chat, avisos do leiloeiro)
 */
export function joinAuctionBroadcast(
  auctionId: string,
  onMessage: (message: any) => void
) {
  const channel = supabase.channel(`broadcast:auction:${auctionId}`)

  channel
    .on('broadcast', { event: 'message' }, (payload) => {
      onMessage(payload.payload)
    })
    .subscribe()

  return channel
}

/**
 * Enviar mensagem broadcast
 */
export async function sendBroadcastMessage(
  channel: RealtimeChannel,
  message: any
) {
  await channel.send({
    type: 'broadcast',
    event: 'message',
    payload: message,
  })
}

/**
 * Desinscrever de um canal
 */
export function unsubscribe(channel: RealtimeChannel) {
  supabase.removeChannel(channel)
}
