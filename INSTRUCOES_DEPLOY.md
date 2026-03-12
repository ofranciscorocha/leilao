# 🚀 INSTRUÇÕES FINAIS DE DEPLOY

## ✅ STATUS ATUAL

- ✅ Código no GitHub: https://github.com/ofranciscorocha/leilao
- ✅ Supabase configurado
- ✅ Banco de dados pronto
- ✅ Storage configurado
- ✅ Auth configurado
- ✅ Variáveis de ambiente configuradas localmente

## 🚀 DEPLOY NA VERCEL (AGORA!)

### Método 1: Via Dashboard (MAIS FÁCIL)

1. **Acesse:** https://vercel.com/new

2. **Import Git Repository:**
   - Selecione: `ofranciscorocha/leilao`

3. **Configure o Projeto:**
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build` (já configurado)
   - Output Directory: `.next` (padrão)

4. **Environment Variables** - Adicione estas variáveis:

```
NEXT_PUBLIC_SUPABASE_URL
Valor: https://bftkjgimkmtpdxytbqew.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: [copie de .env.local]

SUPABASE_SERVICE_ROLE_KEY
Valor: [copie de .env.local]

DATABASE_URL
Valor: [copie de .env.local]

DIRECT_URL
Valor: [copie de .env.local]
```

5. **Clique em "Deploy"**

6. **Aguarde ~2-3 minutos**

7. **Acesse a URL gerada** (algo como: `leilao-xxx.vercel.app`)

### Passo Final: Atualizar URLs no Supabase

Após o deploy, você terá uma URL tipo: `https://leilao-xxx.vercel.app`

1. Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/auth/url-configuration

2. Adicione:
   - **Site URL:** `https://sua-url.vercel.app`
   - **Redirect URLs:** `https://sua-url.vercel.app/**`

3. Clique em **"Save"**

## 🚂 DEPLOY NA RAILWAY

1. Acesse: https://railway.app/new

2. **Deploy from GitHub repo**

3. Selecione: `ofranciscorocha/leilao`

4. Adicione as mesmas variáveis de ambiente da Vercel

5. Deploy automático!

## 🧪 TESTAR APÓS DEPLOY

1. ✅ Acessar home page
2. ✅ Registrar novo usuário
3. ✅ Fazer login
4. ✅ Acessar dashboard admin
5. ✅ Criar leilão (teste)
6. ✅ Upload de imagem

## 📧 CONFIGURAR EMAILS (OPCIONAL)

Para enviar emails de notificação:

```bash
npm install resend
```

Adicionar variável de ambiente:
```
RESEND_API_KEY=[sua-key-da-resend]
```

## 📱 WHATSAPP (OPCIONAL)

Sistema preparado para WhatsApp via webhook.
Configurar após deploy estar funcionando.

## ✅ CHECKLIST FINAL

- [ ] Deploy na Vercel feito
- [ ] URLs atualizadas no Supabase
- [ ] Teste de registro funcionando
- [ ] Teste de login funcionando
- [ ] Dashboard acessível
- [ ] Domínio customizado (opcional)

## 🎉 PRONTO!

Seu sistema está no ar!

**URLs:**
- GitHub: https://github.com/ofranciscorocha/leilao
- Vercel: [será gerada após deploy]
- Supabase: https://bftkjgimkmtpdxytbqew.supabase.co

---

**Qualquer dúvida, consulte os outros arquivos de documentação!**
