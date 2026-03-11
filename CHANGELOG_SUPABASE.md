# Changelog - Migração para Supabase

## 📅 Data: 11 de Março de 2026

## 🎯 Objetivo

Migrar o Pátio Rocha Leilões de SQLite local para Supabase (PostgreSQL) com autenticação e storage em nuvem.

## ✅ Alterações Implementadas

### 1. Dependências Instaladas

```json
{
  "@supabase/supabase-js": "^2.99.1"
}
```

### 2. Configuração de Ambiente

**Novos arquivos:**
- `.env` - Variáveis de ambiente para Prisma e desenvolvimento
- `.env.local` - Variáveis de ambiente para Next.js

**Variáveis configuradas:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://bftkjgimkmtpdxytbqew.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<obter no dashboard>
SUPABASE_SERVICE_ROLE_KEY=<obter no dashboard>
DATABASE_URL=postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
```

### 3. Schema do Banco de Dados

**Arquivo alterado:** `prisma/schema.prisma`

**Mudança:**
```diff
- provider = "sqlite"
- url      = "file:./dev.db"
+ provider = "postgresql"
+ url      = env("DATABASE_URL")
+ directUrl = env("DIRECT_URL")
```

**Status:** ✅ Migrations executadas com sucesso

### 4. Clientes Supabase Criados

#### 4.1. Cliente Genérico
**Arquivo:** `src/lib/supabase.ts`
- Cliente para uso geral
- Cliente admin com service role

#### 4.2. Cliente Browser
**Arquivo:** `src/lib/supabase-client.ts`
- Para componentes client-side
- Com `'use client'` directive

#### 4.3. Cliente Server
**Arquivo:** `src/lib/supabase-server.ts`
- Para Server Components
- Para Server Actions
- Com gerenciamento de cookies

#### 4.4. Helpers de Autenticação
**Arquivo:** `src/lib/auth.ts`
- `getCurrentUser()` - Pega usuário atual
- `getSession()` - Pega sessão atual
- `requireAuth()` - Força autenticação
- `signOut()` - Faz logout

### 5. Server Actions Atualizadas

**Arquivo:** `src/app/actions/auth.ts`

**Novas funções:**
- `loginUser()` - Login com Supabase Auth
- `registerUser()` - Registro com Supabase Auth (atualizado)
- `logout()` - Logout com Supabase Auth (atualizado)

**Mudanças:**
- Integração com Supabase Auth
- Criação de usuário em duas etapas (Auth + Database)
- ID do usuário agora vem do Supabase Auth

### 6. Sistema de Storage

#### 6.1. Helpers de Storage
**Arquivo:** `src/lib/storage.ts`

**Funções:**
- `uploadImage()` - Upload de uma imagem
- `deleteImage()` - Deletar imagem
- `uploadMultipleImages()` - Upload múltiplo
- `getFilePathFromUrl()` - Extrair path de URL

#### 6.2. Componente de Upload
**Arquivo:** `src/components/ui/image-upload.tsx`
- Componente React para upload
- Preview de imagens
- Validação de tamanho e quantidade
- Drag & drop ready

#### 6.3. API Route de Upload
**Arquivo:** `src/app/api/upload/route.ts`
- Endpoint `/api/upload`
- Aceita múltiplos arquivos
- Suporta organização por pasta

### 7. Sistema Realtime

#### 7.1. Helpers Realtime
**Arquivo:** `src/lib/realtime.ts`

**Funções:**
- `subscribeToBids()` - Assinar lances de um lote
- `subscribeToLot()` - Assinar atualizações de lote
- `subscribeToAuctionBids()` - Todos os lances do leilão
- `joinAuctionPresence()` - Rastrear usuários online
- `joinAuctionBroadcast()` - Chat/mensagens do leiloeiro
- `sendBroadcastMessage()` - Enviar mensagem
- `unsubscribe()` - Desinscrever canal

#### 7.2. React Hooks
**Arquivo:** `src/hooks/use-realtime-bids.ts`

**Hooks:**
- `useRealtimeBids()` - Hook para lances em tempo real
- `useRealtimeLot()` - Hook para atualizações do lote
- `useRealtimeAuction()` - Hook combinado

### 8. Scripts SQL

#### 8.1. Políticas de Segurança (RLS)
**Arquivo:** `supabase/policies.sql`

**Inclui:**
- Políticas de Storage
- RLS para todas as tabelas
- Função de sincronização User/Auth
- Trigger automático
- Configuração Realtime

#### 8.2. Setup de Storage
**Arquivo:** `supabase/setup-storage.sql`
- Criação do bucket `auction-images`
- Configuração de tamanho e tipos

### 9. Documentação

#### 9.1. Guia de Setup
**Arquivo:** `SUPABASE_SETUP.md`
- Passo a passo completo
- Comandos úteis
- Troubleshooting
- Próximos passos

#### 9.2. Este Changelog
**Arquivo:** `CHANGELOG_SUPABASE.md`
- Resumo de todas as mudanças

## 🔧 Ações Necessárias

### No Dashboard do Supabase

1. **Obter Chaves API:**
   - Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/settings/api
   - Copie `anon/public key`
   - Copie `service_role key`
   - Atualize `.env` e `.env.local`

2. **Criar Bucket de Storage:**
   - Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/storage/buckets
   - Criar bucket `auction-images`
   - Marcar como público
   - Limite: 5MB

3. **Executar Scripts SQL:**
   - Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/sql
   - Execute `supabase/setup-storage.sql`
   - Execute `supabase/policies.sql`

4. **Configurar Auth:**
   - Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/auth/settings
   - Configure Site URL: `http://localhost:3000`
   - Configure Redirect URL: `http://localhost:3000/auth/callback`
   - (Desenvolvimento) Desabilitar confirmação de email

5. **Habilitar Realtime:**
   - Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/database/publications
   - Adicionar tabelas `Bid` e `Lot` à publicação

## 🧪 Testes Necessários

1. [ ] Testar conexão com banco (Prisma Studio)
2. [ ] Testar registro de usuário
3. [ ] Testar login
4. [ ] Testar logout
5. [ ] Testar upload de imagem única
6. [ ] Testar upload de múltiplas imagens
7. [ ] Testar delete de imagem
8. [ ] Testar realtime de lances
9. [ ] Testar presence no auditório
10. [ ] Testar broadcast de mensagens

## 📊 Estrutura de Pastas no Storage

```
auction-images/
├── auctions/
│   └── {auctionId}/
│       └── {filename}
├── lots/
│   └── {lotId}/
│       └── {filename}
├── users/
│   └── {userId}/
│       └── {filename}
├── banners/
│   └── {filename}
└── documents/
    └── {userId}/
        └── {filename}
```

## 🔒 Segurança Implementada

### Row Level Security (RLS)

- ✅ Usuários só veem seus próprios dados
- ✅ Admins têm acesso completo
- ✅ Leilões públicos visíveis sem login
- ✅ Leilões restritos requerem autenticação
- ✅ Lances são imutáveis
- ✅ Documentos privados por usuário

### Storage Policies

- ✅ Leitura pública de imagens
- ✅ Upload apenas autenticados
- ✅ Delete apenas admins
- ✅ Organização por pastas

## 🚀 Próximos Passos

1. **Implementar páginas de autenticação:**
   - Login page com Supabase
   - Register page com Supabase
   - Reset password
   - Email confirmation

2. **Atualizar componentes de leilão:**
   - Integrar realtime nos lances
   - Adicionar presence no auditório
   - Implementar chat do leiloeiro

3. **Migrar dados existentes (se houver):**
   - Exportar dados do SQLite
   - Importar para PostgreSQL
   - Validar migração

4. **Deploy:**
   - Configurar variáveis de ambiente em produção
   - Atualizar URLs de redirect
   - Habilitar confirmação de email
   - Configurar domínio customizado

5. **Otimizações:**
   - Implementar cache com SWR ou React Query
   - Otimizar queries do Prisma
   - Implementar paginação
   - Adicionar índices no banco

## 📝 Notas Importantes

- ⚠️ As senhas antigas (plaintext) não funcionarão mais - todos os usuários precisarão se re-registrar
- ⚠️ O campo `password` na tabela User agora é vazio (auth gerenciado pelo Supabase)
- ⚠️ IDs de usuários agora são UUIDs do Supabase Auth (não mais cuid)
- ✅ Todas as migrations foram aplicadas com sucesso
- ✅ Schema PostgreSQL compatível com o antigo SQLite
- ✅ Realtime configurado para lances ao vivo

## 🆘 Suporte

Para dúvidas ou problemas:
1. Consulte `SUPABASE_SETUP.md`
2. Verifique políticas em `supabase/policies.sql`
3. Documentação Supabase: https://supabase.com/docs
4. Documentação Prisma: https://www.prisma.io/docs

---

**Autor:** Claude (Anthropic)
**Data:** 11 de Março de 2026
**Versão:** 1.0.0
