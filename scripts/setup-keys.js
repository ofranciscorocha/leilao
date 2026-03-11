/**
 * Script interativo para configurar chaves do Supabase
 * Execute: node scripts/setup-keys.js
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.clear()
console.log('\n🔑 CONFIGURAÇÃO DE CHAVES SUPABASE\n')
console.log('='  .repeat(60))

console.log('\n📋 PASSO 1: Abra este link no navegador:\n')
console.log('🔗 https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/settings/api\n')
console.log('='  .repeat(60))

console.log('\n📝 PASSO 2: Você verá duas chaves:\n')
console.log('   1. anon public (visível)')
console.log('   2. service_role (clique em "Reveal" para ver)\n')
console.log('='  .repeat(60))

console.log('\n⚠️  IMPORTANTE: As chaves são LONGAS (começam com eyJ...)\n')
console.log('='  .repeat(60))

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('\n\n')

  // Pedir ANON KEY
  const anonKey = await askQuestion('Cole a ANON KEY aqui e pressione ENTER:\n> ')

  if (!anonKey || !anonKey.startsWith('eyJ')) {
    console.log('\n❌ Chave inválida! Deve começar com "eyJ"')
    process.exit(1)
  }

  console.log('\n✅ ANON KEY recebida!')

  // Pedir SERVICE ROLE KEY
  console.log('\n')
  const serviceKey = await askQuestion('Cole a SERVICE_ROLE KEY aqui e pressione ENTER:\n> ')

  if (!serviceKey || !serviceKey.startsWith('eyJ')) {
    console.log('\n❌ Chave inválida! Deve começar com "eyJ"')
    process.exit(1)
  }

  console.log('\n✅ SERVICE_ROLE KEY recebida!')

  // Atualizar .env
  console.log('\n📝 Atualizando arquivos de ambiente...\n')

  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bftkjgimkmtpdxytbqew.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceKey}

# Database URL (for Prisma)
DATABASE_URL=postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:3ON374GwBnQ0RzGc@db.bftkjgimkmtpdxytbqew.supabase.co:5432/postgres

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
`

  // Salvar .env
  fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent)
  console.log('✅ .env atualizado')

  // Salvar .env.local
  fs.writeFileSync(path.join(__dirname, '..', '.env.local'), envContent)
  console.log('✅ .env.local atualizado')

  console.log('\n' + '='.repeat(60))
  console.log('\n🎉 CONFIGURAÇÃO COMPLETA!\n')
  console.log('='  .repeat(60))

  console.log('\n📝 Próximos passos:\n')
  console.log('1. Verificar configuração:')
  console.log('   npm run verify:supabase\n')
  console.log('2. Criar bucket de storage:')
  console.log('   https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/storage/buckets')
  console.log('   Nome: auction-images')
  console.log('   Público: ✅ SIM\n')
  console.log('3. Executar scripts SQL:')
  console.log('   https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/sql/new')
  console.log('   - Executar: supabase/setup-storage.sql')
  console.log('   - Executar: supabase/policies.sql\n')
  console.log('4. Testar localmente:')
  console.log('   npm run dev\n')

  rl.close()
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message)
  rl.close()
  process.exit(1)
})
