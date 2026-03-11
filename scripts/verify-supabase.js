/**
 * Script para verificar configuração do Supabase
 * Execute: node scripts/verify-supabase.js
 */

require('dotenv').config({ path: '.env.local' })

const checks = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  'DATABASE_URL': process.env.DATABASE_URL,
  'DIRECT_URL': process.env.DIRECT_URL,
}

console.log('\n🔍 Verificando configuração do Supabase...\n')

let allConfigured = true

for (const [key, value] of Object.entries(checks)) {
  const status = value && value !== 'your-service-role-key-here' && !value.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdGtqZ2lta210cGR4eXRicWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTEzNzcsImV4cCI6MjA1MjkyNzM3N30.XcQZJZYmfVJXFvJJXDJXYmZJZJZmZJZmZJZmZJZmZJZJ')
    ? '✅'
    : '❌'

  if (status === '❌') {
    allConfigured = false
  }

  const displayValue = value
    ? (value.length > 50 ? value.substring(0, 47) + '...' : value)
    : 'NÃO CONFIGURADO'

  console.log(`${status} ${key}`)
  console.log(`   ${displayValue}\n`)
}

console.log('\n' + '='.repeat(60) + '\n')

if (allConfigured) {
  console.log('✅ Todas as variáveis de ambiente estão configuradas!\n')
  console.log('Próximos passos:')
  console.log('1. Criar bucket "auction-images" no Supabase Storage')
  console.log('2. Executar scripts SQL em supabase/policies.sql')
  console.log('3. Executar: npm run dev')
  console.log('4. Testar registro e login')
} else {
  console.log('❌ Algumas variáveis não estão configuradas!\n')
  console.log('Para obter as chaves:')
  console.log('1. Acesse: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/settings/api')
  console.log('2. Copie "anon/public" para NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.log('3. Copie "service_role" para SUPABASE_SERVICE_ROLE_KEY')
  console.log('4. Atualize os arquivos .env e .env.local')
}

console.log('\n' + '='.repeat(60) + '\n')
