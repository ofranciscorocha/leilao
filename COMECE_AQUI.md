# 🚀 COMECE AQUI - Deploy em 10 Minutos!

## ⚡ Script Automático de Configuração

Execute este comando e siga as instruções:

```bash
npm run setup:keys
```

O script vai:
1. ✅ Pedir as chaves do Supabase
2. ✅ Atualizar os arquivos `.env` e `.env.local` automaticamente
3. ✅ Mostrar os próximos passos

---

## 📋 Checklist Completo

### ✅ Etapa 1: Configurar Chaves (2 min)

```bash
npm run setup:keys
```

Quando executar, você precisará:
1. Abrir: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/settings/api
2. Copiar a chave **anon public**
3. Copiar a chave **service_role** (clique em "Reveal")
4. Colar no terminal quando solicitado

---

### ✅ Etapa 2: Verificar Configuração (30 seg)

```bash
npm run verify:supabase
```

**Resultado esperado:** Tudo com ✅

---

### ✅ Etapa 3: Criar Bucket de Storage (1 min)

1. Abra: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/storage/buckets
2. Clique em **"New bucket"**
3. Preencha:
   - **Name:** `auction-images`
   - **Public bucket:** ✅ **MARQUE ESTA OPÇÃO**
4. Clique em **"Create bucket"**

---

### ✅ Etapa 4: Executar Scripts SQL (2 min)

#### Script 1: Setup Storage
1. Abra: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/sql/new
2. Copie TODO o conteúdo de: `supabase/setup-storage.sql`
3. Cole no SQL Editor
4. Clique em **"Run"**

#### Script 2: Policies (RLS)
1. No mesmo SQL Editor, limpe o conteúdo
2. Copie TODO o conteúdo de: `supabase/policies.sql`
3. Cole no SQL Editor
4. Clique em **"Run"**

⚠️ Pode dar alguns warnings, mas se não der ERROR está OK!

---

### ✅ Etapa 5: Configurar Autenticação (1 min)

1. Abra: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/auth/providers
2. Procure **"Email"**, clique para expandir
3. Configure:
   - **Enable Email provider:** ✅ ON
   - **Confirm email:** ❌ OFF (para desenvolvimento)
4. Clique em **"Save"**

5. Depois vá em: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/auth/url-configuration
6. Configure:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** `http://localhost:3000/**`
7. Clique em **"Save"**

---

### ✅ Etapa 6: Testar Localmente (3 min)

```bash
# Gerar Prisma Client
npm run db:generate

# Rodar o projeto
npm run dev
```

Abra: http://localhost:3000

**Testes:**
1. ✅ Página inicial carrega
2. ✅ Acesse `/register` e crie uma conta
3. ✅ Acesse `/admin/login` e faça login
4. ✅ Dashboard deve carregar

---

### ✅ Etapa 7: Preparar para Deploy (1 min)

```bash
# Verificar se está tudo pronto
npm run prepare:deploy

# Testar build de produção
npm run build
```

Se o build passar sem erros, está pronto para deploy! 🎉

---

## 🚀 Deploy

### Opção A: Vercel (Recomendado)

1. Crie conta em: https://vercel.com
2. Instale o CLI:
   ```bash
   npm i -g vercel
   ```
3. Faça login:
   ```bash
   vercel login
   ```
4. Deploy:
   ```bash
   vercel
   ```
5. Configure as variáveis de ambiente quando solicitado:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   DATABASE_URL
   DIRECT_URL
   ```

### Opção B: Railway

1. Crie conta em: https://railway.app
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático!

---

## 📊 Comandos Úteis

```bash
# Configuração
npm run setup:keys          # Configurar chaves interativamente
npm run verify:supabase     # Verificar configuração
npm run prepare:deploy      # Checar se está pronto para deploy

# Desenvolvimento
npm run dev                 # Servidor de desenvolvimento
npm run build               # Build de produção
npm start                   # Rodar produção

# Database
npm run db:studio           # Abrir Prisma Studio
npm run db:generate         # Gerar Prisma Client
npm run db:migrate          # Criar migration
```

---

## 🆘 Problemas?

### Erro: "Missing environment variables"
```bash
npm run setup:keys
```

### Erro: "Invalid API key"
- Verifique se copiou as chaves corretas
- Certifique-se de clicar em "Reveal" para a service_role key
- Execute `npm run setup:keys` novamente

### Erro: "Bucket not found"
- Verifique se o nome é exatamente `auction-images`
- Certifique-se de marcar "Public bucket"

### Build falha
```bash
# Limpar e tentar novamente
rm -rf .next
npm run build
```

---

## 📚 Documentação

- **Quick Start:** `README_QUICK_START.md`
- **Guia Completo:** `IMPLEMENTACAO_COMPLETA.md`
- **Exemplos de Código:** `EXAMPLES.md`
- **Deploy Passo a Passo:** `DEPLOY_AGORA.md`
- **Índice Geral:** `INDEX.md`

---

## 🎯 Resumo

1. ✅ `npm run setup:keys` - Configurar chaves
2. ✅ Criar bucket no Supabase
3. ✅ Executar scripts SQL
4. ✅ Configurar auth
5. ✅ `npm run dev` - Testar
6. ✅ `npm run build` - Build
7. ✅ Deploy na Vercel/Railway

**Tempo total: ~10 minutos** ⏱️

---

**🎉 Comece agora executando:**

```bash
npm run setup:keys
```

**Boa sorte! 🚀**
