-- =====================================================
-- CONFIGURAÇÃO DE STORAGE - SUPABASE
-- Pátio Rocha Leilões
-- =====================================================

-- IMPORTANTE: Execute esses comandos no SQL Editor do Supabase
-- https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/sql

-- =====================================================
-- 1. CRIAR BUCKET (se não existir via UI)
-- =====================================================

-- Criar bucket auction-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'auction-images',
  'auction-images',
  true, -- público
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. ESTRUTURA DE PASTAS (criadas automaticamente no upload)
-- =====================================================

-- /auctions/{auctionId}/{filename}
-- /lots/{lotId}/{filename}
-- /users/{userId}/{filename}
-- /banners/{filename}
-- /documents/{userId}/{filename}

-- =====================================================
-- 3. VERIFICAR CONFIGURAÇÃO
-- =====================================================

-- Ver todos os buckets
SELECT * FROM storage.buckets;

-- Ver políticas do bucket
SELECT *
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';
