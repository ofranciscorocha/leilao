/**
 * Script para preparar o projeto para deploy
 * Execute: node scripts/prepare-deploy.js
 */

const fs = require('fs')
const path = require('path')

console.log('\n🚀 Preparando projeto para deploy...\n')

// 1. Verificar se .env.example existe
const envExamplePath = path.join(__dirname, '..', '.env.example')
if (fs.existsSync(envExamplePath)) {
  console.log('✅ .env.example encontrado')
} else {
  console.log('❌ .env.example não encontrado')
}

// 2. Verificar se vercel.json existe
const vercelPath = path.join(__dirname, '..', 'vercel.json')
if (fs.existsSync(vercelPath)) {
  console.log('✅ vercel.json encontrado')
} else {
  console.log('❌ vercel.json não encontrado')
}

// 3. Verificar package.json
const packagePath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

console.log('\n📦 Scripts disponíveis:')
Object.keys(packageJson.scripts).forEach(script => {
  console.log(`   - ${script}`)
})

// 4. Verificar se tem build script
if (packageJson.scripts.build) {
  console.log('\n✅ Build script configurado')
} else {
  console.log('\n❌ Build script não encontrado')
}

// 5. Verificar dependências críticas
const criticalDeps = [
  '@supabase/supabase-js',
  '@supabase/ssr',
  '@prisma/client',
  'next',
  'react',
]

console.log('\n📚 Dependências críticas:')
criticalDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`   ✅ ${dep}`)
  } else {
    console.log(`   ❌ ${dep} (FALTANDO!)`)
  }
})

// 6. Verificar arquivos SQL
const sqlFiles = [
  'supabase/policies.sql',
  'supabase/setup-storage.sql',
]

console.log('\n📜 Scripts SQL:')
sqlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file)
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`)
  } else {
    console.log(`   ❌ ${file}`)
  }
})

// 7. Verificar migrations
const migrationsPath = path.join(__dirname, '..', 'prisma', 'migrations')
if (fs.existsSync(migrationsPath)) {
  const migrations = fs.readdirSync(migrationsPath)
  console.log(`\n✅ ${migrations.length} migration(s) encontrada(s)`)
} else {
  console.log('\n⚠️ Nenhuma migration encontrada')
}

console.log('\n' + '='.repeat(60))
console.log('\n✨ Checklist de Deploy:\n')

const checklist = [
  '[ ] Variáveis de ambiente configuradas no .env',
  '[ ] Chaves do Supabase obtidas',
  '[ ] Bucket de storage criado',
  '[ ] Scripts SQL executados',
  '[ ] Build local funciona: npm run build',
  '[ ] Testes locais passam: npm run dev',
  '[ ] Código commitado no Git',
  '[ ] Repositório no GitHub criado',
]

checklist.forEach(item => console.log(item))

console.log('\n' + '='.repeat(60))
console.log('\n📝 Próximos passos:\n')
console.log('1. Obter chaves: https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/settings/api')
console.log('2. Atualizar .env e .env.local')
console.log('3. Executar: npm run verify:supabase')
console.log('4. Executar: npm run build')
console.log('5. Fazer push para GitHub')
console.log('6. Deploy na Vercel ou Railway')
console.log('\n')
