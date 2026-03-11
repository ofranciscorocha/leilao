'use client'

import { useEffect, useState } from 'react'
import { joinAuctionPresence, unsubscribe } from '@/lib/realtime'
import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { RealtimeChannel } from '@supabase/supabase-js'

interface RealtimePresenceProps {
  auctionId: string
  userId: string
  userName: string
}

interface PresenceUser {
  userId: string
  userName: string
  onlineAt: string
}

export function RealtimePresence({ auctionId, userId, userName }: RealtimePresenceProps) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const presenceChannel = joinAuctionPresence(auctionId, userId, userName)

    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState()
      const users: PresenceUser[] = []

      Object.keys(state).forEach((key) => {
        const presences = state[key] as any[]
        presences.forEach((presence) => {
          users.push(presence as PresenceUser)
        })
      })

      setOnlineUsers(users)
    })

    setChannel(presenceChannel)

    return () => {
      if (presenceChannel) {
        unsubscribe(presenceChannel)
      }
    }
  }, [auctionId, userId, userName])

  return (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {onlineUsers.length} {onlineUsers.length === 1 ? 'pessoa' : 'pessoas'} online
      </span>
      <Badge variant="outline" className="animate-pulse">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 inline-block"></span>
        AO VIVO
      </Badge>
    </div>
  )
}
