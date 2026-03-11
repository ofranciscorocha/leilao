# 🚀 Quick Start - Pátio Rocha Leilões

## ⚡ Setup Rápido (5 minutos)

### 1. Obter Chaves do Supabase

Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/settings/api

Copie as chaves:
- **anon/public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Atualizar Variáveis de Ambiente

Edite os arquivos `.env` e `.env.local` com as chaves copiadas.

### 3. Verificar Configuração

```bash
npm run verify:supabase
```

Deve mostrar ✅ em todas as variáveis.

### 4. Criar Bucket no Supabase

1. Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/storage/buckets
2. Clique "New bucket"
3. Nome: `auction-images`
4. Marque: ✅ Public bucket
5. Crie

### 5. Executar Scripts SQL

1. Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/sql/new
2. Copie e execute o conteúdo de `supabase/setup-storage.sql`
3. Copie e execute o conteúdo de `supabase/policies.sql`

### 6. Rodar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## ✅ Checklist de Configuração

- [ ] Chaves API configuradas (.env e .env.local)
- [ ] `npm run verify:supabase` mostra tudo ✅
- [ ] Bucket `auction-images` criado
- [ ] Scripts SQL executados
- [ ] Projeto rodando sem erros

## 📚 Documentação Completa

- **Setup Completo:** `SUPABASE_SETUP.md`
- **Changelog:** `CHANGELOG_SUPABASE.md`
- **Políticas SQL:** `supabase/policies.sql`

## 🆘 Problemas?

Execute:
```bash
npm run verify:supabase
```

Consulte o troubleshooting em `SUPABASE_SETUP.md`.

---

**Tempo estimado:** 5-10 minutos ⏱️
