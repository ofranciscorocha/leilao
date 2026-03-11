# 📚 Exemplos de Uso - Supabase Integration

## 🔐 Autenticação

### 1. Usar o AuthProvider no Layout Raiz

```tsx
// src/app/layout.tsx
import { AuthProvider } from '@/contexts/auth-context'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 2. Usar o Hook de Autenticação

```tsx
'use client'

import { useAuthContext } from '@/contexts/auth-context'

export function MyComponent() {
  const { user, profile, isAuthenticated, isAdmin, signOut } = useAuthContext()

  if (!isAuthenticated) {
    return <div>Por favor, faça login</div>
  }

  return (
    <div>
      <h1>Bem-vindo, {profile?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Tipo: {profile?.type}</p>
      {isAdmin && <p>Você é um administrador!</p>}
      <button onClick={signOut}>Sair</button>
    </div>
  )
}
```

### 3. Proteger Rotas (Redirect)

```tsx
'use client'

import { RequireAuth } from '@/components/auth/require-auth'

export default function ProtectedPage() {
  return (
    <RequireAuth>
      <div>Conteúdo protegido - apenas usuários autenticados</div>
    </RequireAuth>
  )
}

// Para admins
export default function AdminPage() {
  return (
    <RequireAuth requireAdmin>
      <div>Conteúdo apenas para administradores</div>
    </RequireAuth>
  )
}
```

### 4. Mostrar/Ocultar Conteúdo (Sem Redirect)

```tsx
'use client'

import { AuthOnly, GuestOnly, AdminOnly } from '@/components/auth/auth-guard'

export function MyComponent() {
  return (
    <div>
      {/* Mostrar apenas para usuários autenticados */}
      <AuthOnly>
        <button>Fazer Lance</button>
      </AuthOnly>

      {/* Mostrar apenas para visitantes */}
      <GuestOnly>
        <button>Cadastre-se</button>
      </GuestOnly>

      {/* Mostrar apenas para admins */}
      <AdminOnly>
        <button>Editar Leilão</button>
      </AdminOnly>
    </div>
  )
}
```

## 📤 Upload de Imagens

### 1. Usar o Componente ImageUpload

```tsx
'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/ui/image-upload'

export function CreateAuctionForm() {
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // imageUrls contém as URLs das imagens no Supabase Storage
    console.log('Imagens:', imageUrls)
  }

  return (
    <form onSubmit={handleSubmit}>
      <ImageUpload
        value={imageUrls}
        onChange={setImageUrls}
        maxFiles={5}
        maxSizeMB={5}
      />
      <button type="submit">Criar Leilão</button>
    </form>
  )
}
```

### 2. Upload Programático

```tsx
import { uploadImage, uploadMultipleImages } from '@/lib/storage'

// Upload único
async function handleSingleUpload(file: File) {
  const { url, error } = await uploadImage(file, 'auction-images', 'lots')

  if (error) {
    console.error('Erro:', error)
    return
  }

  console.log('Imagem enviada:', url)
}

// Upload múltiplo
async function handleMultipleUpload(files: File[]) {
  const { urls, errors } = await uploadMultipleImages(files, 'auction-images', 'auctions')

  console.log('Enviadas:', urls)
  console.log('Erros:', errors)
}
```

### 3. Deletar Imagem

```tsx
import { deleteImage, getFilePathFromUrl } from '@/lib/storage'

async function handleDelete(imageUrl: string) {
  // Extrair o path da URL
  const filePath = getFilePathFromUrl(imageUrl, 'auction-images')

  if (!filePath) {
    console.error('URL inválida')
    return
  }

  const { success, error } = await deleteImage(filePath, 'auction-images')

  if (error) {
    console.error('Erro ao deletar:', error)
    return
  }

  console.log('Imagem deletada com sucesso!')
}
```

## ⚡ Realtime - Lances ao Vivo

### 1. Usar o Hook de Realtime Bids

```tsx
'use client'

import { useRealtimeAuction } from '@/hooks/use-realtime-bids'

export function LotDetails({ lotId }: { lotId: string }) {
  const { bids, latestBid, currentBid, status } = useRealtimeAuction(lotId)

  return (
    <div>
      <h2>Lance Atual: R$ {currentBid}</h2>
      <p>Status: {status}</p>

      {latestBid && (
        <div className="alert">
          Novo lance! R$ {latestBid.amount}
        </div>
      )}

      <ul>
        {bids.map(bid => (
          <li key={bid.id}>R$ {bid.amount}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 2. Usar o Componente de Lista de Lances

```tsx
import { RealtimeBidList } from '@/components/auction/realtime-bid-list'

export function AuditoriumPage({ lotId }: { lotId: string }) {
  return (
    <div>
      <RealtimeBidList lotId={lotId} currentBid={1000} />
    </div>
  )
}
```

### 3. Presence - Rastrear Usuários Online

```tsx
import { RealtimePresence } from '@/components/auction/realtime-presence'

export function AuctionRoom({ auctionId, userId, userName }) {
  return (
    <div>
      <RealtimePresence
        auctionId={auctionId}
        userId={userId}
        userName={userName}
      />
    </div>
  )
}
```

### 4. Broadcast - Chat do Leiloeiro

```tsx
'use client'

import { useEffect, useState } from 'react'
import { joinAuctionBroadcast, sendBroadcastMessage, unsubscribe } from '@/lib/realtime'

export function AuctioneerChat({ auctionId }: { auctionId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [channel, setChannel] = useState<any>(null)

  useEffect(() => {
    const broadcastChannel = joinAuctionBroadcast(auctionId, (message) => {
      setMessages(prev => [...prev, message])
    })

    setChannel(broadcastChannel)

    return () => {
      if (broadcastChannel) {
        unsubscribe(broadcastChannel)
      }
    }
  }, [auctionId])

  const sendMessage = async (text: string) => {
    if (channel) {
      await sendBroadcastMessage(channel, {
        type: 'auctioneer',
        text,
        timestamp: new Date().toISOString(),
      })
    }
  }

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg.text}</div>
        ))}
      </div>
      <button onClick={() => sendMessage('Lote vendido!')}>
        Anunciar
      </button>
    </div>
  )
}
```

## 🗄️ Database com Prisma

### 1. Buscar Dados

```tsx
import { prisma } from '@/lib/prisma'

export async function getAuctions() {
  const auctions = await prisma.auction.findMany({
    where: {
      status: 'OPEN',
    },
    include: {
      lots: true,
    },
    orderBy: {
      startDate: 'desc',
    },
  })

  return auctions
}
```

### 2. Criar Registro

```tsx
export async function createLot(data: any) {
  const lot = await prisma.lot.create({
    data: {
      lotNumber: data.lotNumber,
      title: data.title,
      startingPrice: data.startingPrice,
      auctionId: data.auctionId,
      status: 'PENDING',
    },
  })

  return lot
}
```

### 3. Atualizar Registro

```tsx
export async function updateLotBid(lotId: string, newBid: number, userId: string) {
  const lot = await prisma.lot.update({
    where: { id: lotId },
    data: {
      currentBid: newBid,
      winnerId: userId,
    },
  })

  return lot
}
```

## 🔒 Row Level Security

### 1. Política Automática (Via RLS)

Quando você faz queries com Supabase Client, as políticas RLS são aplicadas automaticamente:

```tsx
'use client'

import { supabase } from '@/lib/supabase-client'

export async function MyComponent() {
  // Essa query automaticamente filtra para mostrar apenas
  // os dados que o usuário tem permissão de ver (RLS)
  const { data: bids } = await supabase
    .from('Bid')
    .select('*')
    .eq('userId', userId)

  // Apenas os lances do próprio usuário são retornados
  return <div>{bids?.length} lances</div>
}
```

### 2. Bypass RLS (Admin apenas)

```tsx
import { supabaseAdmin } from '@/lib/supabase'

// Apenas em Server Actions com validação de admin!
export async function getAllBids() {
  // Verifica se é admin primeiro!
  const user = await getCurrentUser()
  if (user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // supabaseAdmin bypassa RLS
  const { data } = await supabaseAdmin
    .from('Bid')
    .select('*')

  return data
}
```

## 📋 Server Actions Completas

### 1. Action de Criar Leilão

```tsx
'use server'

import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function createAuction(formData: FormData) {
  // Verificar autenticação
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  // Verificar se é admin
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  if (profile?.role !== 'ADMIN') {
    return { error: 'Sem permissão' }
  }

  // Criar leilão
  const auction = await prisma.auction.create({
    data: {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: new Date(formData.get('startDate') as string),
      status: 'UPCOMING',
    },
  })

  revalidatePath('/admin/auctions')
  return { success: true, auction }
}
```

### 2. Action de Dar Lance

```tsx
'use server'

import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase-server'

export async function placeBid(lotId: string, amount: number) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Faça login para dar lances' }
  }

  // Validar valor mínimo
  const lot = await prisma.lot.findUnique({
    where: { id: lotId },
  })

  if (!lot) {
    return { error: 'Lote não encontrado' }
  }

  const minBid = (lot.currentBid || lot.startingPrice) + lot.incrementAmount

  if (amount < minBid) {
    return { error: `Lance mínimo: R$ ${minBid}` }
  }

  // Criar lance
  const bid = await prisma.bid.create({
    data: {
      amount,
      lotId,
      userId: user.id,
      type: 'MANUAL',
    },
  })

  // Atualizar lote
  await prisma.lot.update({
    where: { id: lotId },
    data: {
      currentBid: amount,
      winnerId: user.id,
    },
  })

  // O Realtime vai notificar todos automaticamente!
  return { success: true, bid }
}
```

## 🎨 Integração Completa - Página de Auditório

```tsx
'use client'

import { useAuthContext } from '@/contexts/auth-context'
import { RequireAuth } from '@/components/auth/require-auth'
import { RealtimeBidList } from '@/components/auction/realtime-bid-list'
import { RealtimePresence } from '@/components/auction/realtime-presence'
import { placeBid } from '@/app/actions/bid'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AuditoriumPage({ params }: { params: { id: string } }) {
  const { user, profile } = useAuthContext()
  const [bidAmount, setBidAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePlaceBid = async () => {
    setLoading(true)
    const result = await placeBid(params.id, parseFloat(bidAmount))
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Lance enviado!')
      setBidAmount('')
    }
  }

  return (
    <RequireAuth>
      <div className="container mx-auto p-4">
        {/* Header com Presence */}
        <div className="mb-4">
          <h1>Auditório - Lote #{params.id}</h1>
          {user && profile && (
            <RealtimePresence
              auctionId={params.id}
              userId={user.id}
              userName={profile.name || 'Usuário'}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lista de Lances em Tempo Real */}
          <RealtimeBidList lotId={params.id} />

          {/* Formulário de Lance */}
          <div>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Digite seu lance"
            />
            <button onClick={handlePlaceBid} disabled={loading}>
              {loading ? 'Enviando...' : 'Dar Lance'}
            </button>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}
```

---

## 🔗 Links Úteis

- **Documentação Supabase Auth:** https://supabase.com/docs/guides/auth
- **Documentação Supabase Storage:** https://supabase.com/docs/guides/storage
- **Documentação Supabase Realtime:** https://supabase.com/docs/guides/realtime
- **Documentação Prisma:** https://www.prisma.io/docs

---

**Dica:** Todos esses exemplos estão prontos para uso! Basta copiar e adaptar para suas necessidades.
