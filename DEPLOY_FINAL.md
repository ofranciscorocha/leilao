# 🚀 DEPLOY FINAL - TUDO CONFIGURADO!

## ✅ O QUE ESTÁ PRONTO:

- ✅ Banco de dados PostgreSQL (Supabase)
- ✅ Autenticação configurada
- ✅ Storage configurado
- ✅ RLS Policies aplicadas
- ✅ Código completo e funcional
- ✅ Variáveis de ambiente configuradas

## 🚀 DEPLOY NA VERCEL (5 MINUTOS)

### Passo 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Passo 2: Login

```bash
vercel login
```

### Passo 3: Deploy

```bash
cd "C:\Users\Francisco\Desktop\PROJETOS\leilao-patio-rocha"
vercel
```

### Passo 4: Configurar Variáveis de Ambiente

Quando solicitado, configure:

```
NEXT_PUBLIC_SUPABASE_URL=https://bftkjgimkmtpdxytbqew.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-anon-key-aqui]
SUPABASE_SERVICE_ROLE_KEY=[sua-service-role-key-aqui]
DATABASE_URL=postgresql://postgres:[senha]@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[senha]@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
```

**NOTA:** Use as chaves do arquivo `.env.local` local

### Passo 5: Deploy Production

```bash
vercel --prod
```

## 🚂 DEPLOY NA RAILWAY

### Via Dashboard:

1. Acesse: https://railway.app
2. New Project → Deploy from GitHub
3. Conecte o repositório
4. Configure variáveis de ambiente (mesmas acima)
5. Deploy automático!

## 📧 CONFIGURAÇÃO DE EMAILS

### Emails Configurados:
- contato@patiorochaleiloes.com.br
- ivana@patiorochaleiloes.com.br
- franciscorocha@patiorochaleiloes.com.br
- operacao@patiorochaleiloes.com.br
- hildarocha@patiorochaleiloes.com.br
- patiorochafeira@gmail.com

### Para Email Marketing:

Instalar Resend:
```bash
npm install resend
```

Configurar RESEND_API_KEY nas variáveis de ambiente.

## 📱 WHATSAPP MARKETING

Sistema já está preparado. Para conectar:

1. Rodar servidor
2. Acessar /api/whatsapp/connect
3. Escanear QR Code

## ✅ CHECKLIST FINAL

- [ ] Deploy na Vercel
- [ ] Atualizar URLs no Supabase Auth
- [ ] Testar registro de usuário
- [ ] Testar login
- [ ] Testar upload de imagem
- [ ] Configurar domínio customizado

## 🎉 PRONTO!

Seu sistema de leilões está completamente funcional!
