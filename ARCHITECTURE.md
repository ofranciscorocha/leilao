# 🏗️ Arquitetura - Pátio Rocha Leilões com Supabase

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 App Router                     │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Public    │  │    Admin    │  │  API Routes │         │
│  │   Pages     │  │   Dashboard │  │             │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                 │                 │                 │
│         └─────────────────┴─────────────────┘                │
│                           │                                   │
│         ┌─────────────────┴─────────────────┐                │
│         │                                     │                │
│    ┌────▼────┐                         ┌────▼────┐           │
│    │ Server  │                         │ Client  │           │
│    │ Actions │                         │  Hooks  │           │
│    └────┬────┘                         └────┬────┘           │
└─────────┼────────────────────────────────────┼───────────────┘
          │                                     │
          ▼                                     ▼
┌─────────────────────┐            ┌─────────────────────┐
│  Supabase Server    │            │  Supabase Client    │
│                     │            │                     │
│  • Auth             │            │  • Auth             │
│  • Database         │            │  • Realtime         │
│  • Storage          │            │  • Storage          │
│  • RLS Policies     │            │  • Subscriptions    │
└─────────┬───────────┘            └─────────┬───────────┘
          │                                   │
          └───────────────┬───────────────────┘
                          │
                          ▼
              ┌────────────────────┐
              │   PostgreSQL DB    │
              │                    │
              │  • User            │
              │  • Auction         │
              │  • Lot             │
              │  • Bid             │
              │  • Storage         │
              └────────────────────┘
```

## 📁 Estrutura de Arquivos

```
leilao-patio-rocha/
│
├── 📝 Configuração
│   ├── .env                          # Variáveis de ambiente (Prisma)
│   ├── .env.local                    # Variáveis de ambiente (Next.js)
│   ├── package.json                  # Dependências + scripts
│   └── prisma/
│       └── schema.prisma             # Schema PostgreSQL
│
├── 📚 Documentação
│   ├── README_QUICK_START.md         # Guia rápido (5 min)
│   ├── SUPABASE_SETUP.md             # Setup completo
│   ├── CHANGELOG_SUPABASE.md         # Log de mudanças
│   └── ARCHITECTURE.md               # Este arquivo
│
├── 🗄️ Supabase
│   ├── policies.sql                  # RLS e políticas
│   └── setup-storage.sql             # Setup do Storage
│
├── 🔧 Scripts
│   └── verify-supabase.js            # Verificar config
│
└── src/
    │
    ├── 🔐 Autenticação & Database
    │   ├── lib/
    │   │   ├── supabase.ts           # Cliente genérico
    │   │   ├── supabase-client.ts    # Cliente browser
    │   │   ├── supabase-server.ts    # Cliente server
    │   │   ├── auth.ts               # Helpers de auth
    │   │   ├── storage.ts            # Helpers de storage
    │   │   └── realtime.ts           # Helpers realtime
    │   │
    │   └── app/actions/
    │       └── auth.ts               # Server Actions
    │
    ├── 🎣 React Hooks
    │   └── hooks/
    │       └── use-realtime-bids.ts  # Hook de lances
    │
    ├── 🎨 Componentes
    │   └── components/
    │       └── ui/
    │           └── image-upload.tsx  # Upload de imagens
    │
    └── 🌐 API Routes
        └── app/api/
            └── upload/
                └── route.ts          # Endpoint de upload
```

## 🔄 Fluxo de Dados

### 1️⃣ Autenticação

```
┌──────────┐     signup      ┌─────────────┐     create     ┌──────┐
│  User    │ ───────────────> │  Supabase   │ ─────────────> │ Auth │
│ (Client) │                  │    Auth     │                │ User │
└────┬─────┘                  └──────┬──────┘                └───┬──┘
     │                               │                           │
     │        JWT Token              │         Trigger           │
     │ <─────────────────────────────┤                           │
     │                               │                           │
     │                               ▼                           │
     │                        ┌─────────────┐                    │
     │                        │   Prisma    │ <──────────────────┘
     │                        │create User  │
     │                        └─────────────┘
     │                               │
     │        User Profile           ▼
     │ <──────────────────────  ┌─────────┐
     │                          │  User   │
     └──────────────────────────│  Table  │
                                └─────────┘
```

### 2️⃣ Upload de Imagens

```
┌──────────┐   select files   ┌─────────────┐   FormData   ┌──────────┐
│  User    │ ───────────────> │   Image     │ ───────────> │   API    │
│ (Client) │                  │   Upload    │              │  /upload │
└──────────┘                  │  Component  │              └────┬─────┘
     │                        └─────────────┘                   │
     │                                                           │ uploadImage()
     │                                                           ▼
     │                                                    ┌──────────────┐
     │                                                    │   Storage    │
     │                                                    │   Helper     │
     │                                                    └──────┬───────┘
     │                                                           │
     │         URLs                                              │ upload()
     │ <─────────────────────────────────────────────────────────┤
     │                                                           ▼
     │                                                    ┌──────────────┐
     │                                                    │   Supabase   │
     │                                                    │   Storage    │
     │                                                    └──────────────┘
     │                                                           │
     │                                                           ▼
     │                                                    ┌──────────────┐
     │                                                    │    Bucket    │
     └────────────────────────────────────────────────────│auction-images│
                                                          └──────────────┘
```

### 3️⃣ Lances em Tempo Real

```
┌──────────┐  subscribe   ┌─────────────┐   Realtime   ┌──────────┐
│ Bidder 1 │ ──────────> │   Supabase  │ <─────────── │ Bidder 2 │
└──────────┘              │   Realtime  │              └──────────┘
     │                    └──────┬──────┘                    │
     │ placeBid()                │                           │
     │                           │                           │
     ▼                           ▼                           │
┌──────────┐              ┌──────────────┐                  │
│  Server  │ ───insert──> │     Bid      │                  │
│  Action  │              │    Table     │                  │
└──────────┘              └──────┬───────┘                  │
                                 │                           │
                                 │ trigger                   │
                                 ▼                           │
                          ┌──────────────┐                  │
                          │   Realtime   │                  │
                          │  Broadcast   │ ─────────────────┘
                          └──────────────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │  All Clients │
                          │   Updated    │
                          └──────────────┘
```

## 🔒 Segurança - Row Level Security (RLS)

### Políticas Implementadas

```
User Table
├── ✅ Users read own data
├── ✅ Admins read all users
├── ✅ Users update own data
└── ✅ Admins update any user

Auction Table
├── ✅ Public read non-restricted
├── ✅ Authenticated read all
├── ❌ Only admins create/update/delete

Lot Table
├── ✅ Public read from public auctions
├── ✅ Authenticated read all
└── ❌ Only admins create/update/delete

Bid Table
├── ✅ Users read own bids
├── ✅ Admins read all bids
├── ✅ Authenticated create bids
└── ❌ No updates/deletes (immutable)

Storage (auction-images)
├── ✅ Public read
├── 🔐 Authenticated upload
└── ❌ Only admins delete
```

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.99.1",  // Cliente Supabase
    "@prisma/client": "^5.10.2",         // ORM Database
    "next": "16.1.6",                     // Framework
    "react": "19.2.3"                     // UI Library
  }
}
```

## 🔑 Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database (Prisma)
DATABASE_URL=postgresql://postgres:...
DIRECT_URL=postgresql://postgres:...
```

## 🚀 Features Implementadas

### ✅ Autenticação
- [x] Registro de usuário
- [x] Login/Logout
- [x] Sessão persistente
- [x] Sincronização Auth ↔ Database

### ✅ Storage
- [x] Upload de imagens
- [x] Upload múltiplo
- [x] Delete de imagens
- [x] Componente React
- [x] Validação de tamanho/tipo

### ✅ Realtime
- [x] Lances ao vivo
- [x] Atualizações de lote
- [x] Presence (usuários online)
- [x] Broadcast (chat)
- [x] React Hooks

### ✅ Segurança
- [x] Row Level Security (RLS)
- [x] Políticas por tabela
- [x] Storage policies
- [x] JWT Authentication

### ✅ Database
- [x] PostgreSQL (Supabase)
- [x] Prisma ORM
- [x] Migrations aplicadas
- [x] Schema completo

## 🎯 Próximas Features

### 🔜 Em Desenvolvimento
- [ ] Sistema de notificações
- [ ] Email templates
- [ ] Reset de senha
- [ ] Confirmação de email
- [ ] OAuth providers (Google, Facebook)

### 📋 Planejado
- [ ] Sistema de pagamento
- [ ] PDF de arrematação
- [ ] Backup automático
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## 📞 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Rodar servidor
npm run verify:supabase        # Verificar config

# Database
npm run db:studio              # Abrir Prisma Studio
npm run db:migrate             # Criar migration
npm run db:push                # Push schema

# Build
npm run build                  # Build produção
npm start                      # Rodar produção
```

## 🌐 URLs Importantes

- **App Dev:** http://localhost:3000
- **Supabase Dashboard:** https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew
- **Prisma Studio:** http://localhost:5555 (ao rodar db:studio)
- **API Docs:** https://supabase.com/docs

---

**Última atualização:** 11 de Março de 2026
**Versão:** 1.0.0
**Stack:** Next.js 16 + Supabase + Prisma + TypeScript
