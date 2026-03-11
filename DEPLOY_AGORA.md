# 🚀 DEPLOY AGORA - Passo a Passo Interativo

## ⚡ Vamos colocar tudo no ar em 15 minutos!

---

## PASSO 1: Obter Chaves do Supabase (2 min)

### 1.1 - Acesse o Dashboard

🔗 **CLIQUE AQUI:** https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/settings/api

### 1.2 - Copie as Chaves

Você verá uma página com essas informações:

```
Project API keys

┌─────────────────────────────────────────┐
│ Project URL                              │
│ https://bftkjgimkmtpdxytbqew.supabase.co│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ anon public                              │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │  ← COPIE ESTA
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ service_role                             │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │  ← COPIE ESTA
└─────────────────────────────────────────┘
```

**ATENÇÃO:** A `service_role` pode estar oculta. Clique em "Reveal" para ver.

### 1.3 - Cole nas Variáveis de Ambiente

Agora você precisa colar essas chaves nos arquivos `.env` e `.env.local`.

**❓ VOCÊ TEM AS CHAVES?**
- [ ] Sim, já copiei → Continue para 1.4
- [ ] Não consigo acessar → Me envie as chaves que colocar nos arquivos

### 1.4 - Eu vou atualizar os arquivos para você

**COLE AS CHAVES AQUI:**

```
ANON_KEY: [cole aqui]
SERVICE_ROLE_KEY: [cole aqui]
```

---

## PASSO 2: Criar Bucket de Storage (1 min)

### 2.1 - Acesse Storage

🔗 **CLIQUE AQUI:** https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/storage/buckets

### 2.2 - Criar Bucket

1. Clique no botão **"New bucket"**
2. Preencha:
   - **Name:** `auction-images`
   - **Public bucket:** ✅ MARCAR (importante!)
   - **Allowed MIME types:** `image/*`
   - **File size limit:** `5000000` (5MB em bytes)
3. Clique em **"Create bucket"**

**❓ CONSEGUIU CRIAR O BUCKET?**
- [ ] Sim, criei → Continue para Passo 3
- [ ] Não, tive erro → Qual erro?

---

## PASSO 3: Executar Scripts SQL (2 min)

### 3.1 - Acesse SQL Editor

🔗 **CLIQUE AQUI:** https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/sql/new

### 3.2 - Executar Script 1 (Storage)

1. Abra o arquivo: `supabase/setup-storage.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Clique em **"Run"**
5. Deve aparecer: "Success. No rows returned"

**❓ EXECUTOU COM SUCESSO?**
- [ ] Sim → Continue
- [ ] Erro → Qual erro apareceu?

### 3.3 - Executar Script 2 (Policies)

1. Abra o arquivo: `supabase/policies.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor (limpe o anterior)
4. Clique em **"Run"**
5. Deve aparecer várias linhas de sucesso

**⚠️ IMPORTANTE:** Este script pode dar alguns warnings, mas se não der ERROR está ok.

**❓ EXECUTOU?**
- [ ] Sim, sem erros
- [ ] Sim, com warnings (ok)
- [ ] Erro → Qual erro?

---

## PASSO 4: Configurar Autenticação (1 min)

### 4.1 - Acesse Auth Settings

🔗 **CLIQUE AQUI:** https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/auth/providers

### 4.2 - Configurar Email Provider

1. Procure por **"Email"**
2. Clique para expandir
3. Configure:
   - **Enable Email provider:** ✅ ON
   - **Confirm email:** ❌ OFF (para desenvolvimento)

4. Clique em **"Save"**

### 4.3 - Configurar URL Configuration

🔗 **CLIQUE AQUI:** https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/auth/url-configuration

Configure:
- **Site URL:** `http://localhost:3000`
- **Redirect URLs:**
  ```
  http://localhost:3000/**
  http://localhost:3000/auth/callback
  ```

Clique em **"Save"**

**❓ CONFIGUROU?**
- [ ] Sim → Continue para Passo 5

---

## PASSO 5: Testar Localmente (5 min)

### 5.1 - Verificar Configuração

```bash
npm run verify:supabase
```

**Resultado esperado:** TUDO ✅

Se ainda tiver ❌, me avise quais chaves estão faltando.

### 5.2 - Gerar Prisma Client

```bash
npx prisma generate
```

### 5.3 - Rodar o Projeto

```bash
npm run dev
```

**Deve abrir em:** http://localhost:3000

### 5.4 - Testar Funcionalidades

**Checklist de Testes:**

1. **[ ] Página inicial carrega**
   - Acesse: http://localhost:3000

2. **[ ] Registro funciona**
   - Acesse: http://localhost:3000/register
   - Preencha o formulário
   - Clique em "Criar Conta"

3. **[ ] Login funciona**
   - Acesse: http://localhost:3000/admin/login
   - Use o email/senha que cadastrou
   - Clique em "Sign In"

4. **[ ] Dashboard carrega**
   - Deve redirecionar para: http://localhost:3000/admin/dashboard

5. **[ ] Logout funciona**
   - Clique em sair

6. **[ ] Prisma Studio**
   ```bash
   npm run db:studio
   ```
   - Abre em: http://localhost:5555
   - Verifica se vê as tabelas

**❓ TODOS OS TESTES PASSARAM?**
- [ ] Sim, tudo funcionando → Vamos para o deploy!
- [ ] Não, erro em: _________ → Me conte o erro

---

## PASSO 6: Deploy na Vercel (5 min)

### 6.1 - Preparar para Deploy

Primeiro, vamos criar o arquivo de configuração da Vercel:

```bash
# Eu vou criar para você
```

### 6.2 - Fazer Push para GitHub (se ainda não fez)

```bash
# Verificar se tem git
git status

# Se não tiver, inicializar
git add .
git commit -m "feat: Implementação completa Supabase"
git branch -M main

# Criar repo no GitHub e push
# (me avise quando criar o repo)
```

### 6.3 - Deploy na Vercel

1. Acesse: https://vercel.com
2. Clique em "New Project"
3. Importe seu repositório
4. Configure as variáveis de ambiente:

```
NEXT_PUBLIC_SUPABASE_URL=https://bftkjgimkmtpdxytbqew.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua_anon_key]
SUPABASE_SERVICE_ROLE_KEY=[sua_service_role_key]
DATABASE_URL=postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
```

5. Clique em "Deploy"

### 6.4 - Atualizar URLs no Supabase

Após o deploy, você terá uma URL tipo: `https://seu-projeto.vercel.app`

Volte no Supabase Auth Settings e adicione:
- **Site URL:** `https://seu-projeto.vercel.app`
- **Redirect URLs:**
  ```
  https://seu-projeto.vercel.app/**
  https://seu-projeto.vercel.app/auth/callback
  ```

---

## OU PASSO 6 ALTERNATIVO: Deploy na Railway (5 min)

### 6.1 - Acesse Railway

🔗 https://railway.app

### 6.2 - Criar Novo Projeto

1. Clique em "New Project"
2. Escolha "Deploy from GitHub repo"
3. Selecione seu repositório
4. Railway vai detectar Next.js automaticamente

### 6.3 - Configurar Variáveis de Ambiente

No dashboard do Railway:
1. Clique em "Variables"
2. Adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://bftkjgimkmtpdxytbqew.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua_anon_key]
SUPABASE_SERVICE_ROLE_KEY=[sua_service_role_key]
DATABASE_URL=postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
```

### 6.4 - Deploy

Railway vai fazer o deploy automaticamente!

URL será algo como: `https://seu-projeto.up.railway.app`

Atualize as URLs no Supabase Auth como descrito acima.

---

## ✅ CHECKLIST FINAL

- [ ] Chaves do Supabase configuradas
- [ ] Bucket `auction-images` criado
- [ ] Scripts SQL executados
- [ ] Auth configurada
- [ ] Testes locais passando
- [ ] Deploy realizado
- [ ] URLs atualizadas no Supabase
- [ ] Testes em produção

---

## 🆘 PROBLEMAS COMUNS

### Erro: "Invalid API key"
→ Verifique se copiou as chaves corretas
→ Não esqueça de fazer "Reveal" na service_role key

### Erro: "Bucket not found"
→ Certifique-se que o nome é exatamente `auction-images`
→ Verifique se marcou como "Public"

### Erro: "SQL syntax error"
→ Copie o script completo, não só uma parte
→ Verifique se não tem caracteres estranhos

### Erro no deploy: "Build failed"
→ Verifique se as variáveis de ambiente estão corretas
→ Rode `npm run build` localmente para ver o erro

---

## 📞 ME AVISE EM CADA PASSO!

Para eu te ajudar melhor, me avise:

✅ **PASSO 1 CONCLUÍDO** - Chaves copiadas
✅ **PASSO 2 CONCLUÍDO** - Bucket criado
✅ **PASSO 3 CONCLUÍDO** - SQL executado
✅ **PASSO 4 CONCLUÍDO** - Auth configurada
✅ **PASSO 5 CONCLUÍDO** - Testes OK
✅ **PASSO 6 CONCLUÍDO** - Deploy feito

Ou me avise se tiver qualquer erro!

---

**Vamos nessa! 🚀**

**Comece pelo PASSO 1 e me avise quando tiver as chaves!**
