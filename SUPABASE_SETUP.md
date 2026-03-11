# Configuração do Supabase - Pátio Rocha Leilões

## 📋 Pré-requisitos

- Conta no Supabase (https://supabase.com)
- Projeto criado no Supabase
- Credenciais do banco de dados

## 🔑 Credenciais Atuais

- **URL**: `https://bftkjgimkmtpdxytbqew.supabase.co`
- **Senha do Banco**: `3ON374GwBnQ0RzGc`
- **Connection String**: `postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres`

## 🚀 Passos de Configuração

### 1. Configurar Variáveis de Ambiente

Você precisa obter as seguintes chaves do seu projeto Supabase:

1. Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/settings/api
2. Copie as seguintes informações:
   - **Project URL** (já configurado)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY)

### 2. Atualizar `.env` e `.env.local`

Edite os arquivos `.env` e `.env.local` com as chaves corretas:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bftkjgimkmtpdxytbqew.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui

# Database URL
DATABASE_URL=postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
```

### 3. Executar Migrations (Já foi feito!)

```bash
npx prisma migrate dev --name init
```

✅ As migrations já foram aplicadas com sucesso!

### 4. Configurar Storage no Supabase

Para upload de imagens, você precisa criar um bucket no Supabase Storage:

1. Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/storage/buckets
2. Clique em "New bucket"
3. Configure:
   - **Name**: `auction-images`
   - **Public bucket**: ✅ Sim (para URLs públicas)
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/*`

### 5. Configurar Políticas de Storage (RLS)

Execute os seguintes comandos SQL no SQL Editor do Supabase:

```sql
-- Permitir leitura pública de imagens
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'auction-images');

-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'auction-images'
  AND auth.role() = 'authenticated'
);

-- Permitir delete apenas para o dono ou admin
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'auction-images'
  AND auth.uid() = owner
);
```

### 6. Configurar Autenticação

1. Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/auth/providers
2. Configure os provedores desejados (Email/Password já está habilitado por padrão)
3. Configure URLs de redirect:
   - **Site URL**: `http://localhost:3000` (desenvolvimento)
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

### 7. Desabilitar Email Confirmation (Opcional - Apenas Desenvolvimento)

Para facilitar testes em desenvolvimento:

1. Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/auth/settings
2. Em "Email Auth", desabilite "Enable email confirmations"

⚠️ **IMPORTANTE**: Reabilite isso em produção!

## 📚 Estrutura do Projeto

### Clientes Supabase Criados:

1. **`src/lib/supabase.ts`** - Cliente genérico
2. **`src/lib/supabase-client.ts`** - Cliente para componentes client-side
3. **`src/lib/supabase-server.ts`** - Cliente para Server Components e Server Actions
4. **`src/lib/auth.ts`** - Funções helper de autenticação
5. **`src/lib/storage.ts`** - Funções helper de storage

### Componentes Criados:

1. **`src/components/ui/image-upload.tsx`** - Componente de upload de imagens
2. **`src/app/api/upload/route.ts`** - API route para upload

### Actions Atualizadas:

1. **`src/app/actions/auth.ts`** - Autenticação com Supabase Auth

## 🧪 Testar a Integração

### 1. Testar Conexão com Banco

```bash
npx prisma studio
```

Isso abrirá uma interface para visualizar os dados do banco.

### 2. Testar Autenticação

Execute o projeto:

```bash
npm run dev
```

Acesse `/register` e tente criar uma conta.

### 3. Testar Upload de Imagens

Após criar o bucket, teste o upload em qualquer formulário que use o componente `ImageUpload`.

## 🔧 Comandos Úteis

```bash
# Gerar Prisma Client
npx prisma generate

# Visualizar banco de dados
npx prisma studio

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Reset do banco (⚠️ CUIDADO - apaga todos os dados)
npx prisma migrate reset
```

## 📝 Próximos Passos

1. [ ] Obter e configurar ANON_KEY e SERVICE_ROLE_KEY corretas
2. [ ] Criar bucket `auction-images` no Supabase Storage
3. [ ] Configurar políticas de RLS no Storage
4. [ ] Configurar URLs de callback de autenticação
5. [ ] Testar registro de usuário
6. [ ] Testar login
7. [ ] Testar upload de imagens
8. [ ] Implementar sistema de lances em tempo real (Supabase Realtime)

## 🆘 Troubleshooting

### Erro: "Missing environment variables"
- Verifique se `.env` e `.env.local` estão configurados
- Reinicie o servidor de desenvolvimento

### Erro: "Invalid API key"
- Confirme que as chaves estão corretas no dashboard do Supabase
- Certifique-se de não ter espaços extras nas variáveis

### Erro ao fazer upload
- Verifique se o bucket foi criado
- Confirme as políticas de RLS
- Verifique o console do navegador para mais detalhes

### Prisma não conecta ao banco
- Confirme a senha do banco
- Teste a conexão diretamente com psql ou outra ferramenta
- Verifique se há firewall bloqueando a porta 5432

## 📞 Suporte

Para mais informações, consulte a documentação oficial:
- Supabase: https://supabase.com/docs
- Prisma: https://www.prisma.io/docs
- Next.js: https://nextjs.org/docs
