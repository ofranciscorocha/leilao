-- =====================================================
-- SCRIPT COMPLETO DE CONFIGURAÇÃO - PÁTIO ROCHA LEILÕES
-- Execute TUDO de uma vez no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- 1. HABILITAR RLS EM TODAS AS TABELAS
-- =====================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Auction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bid" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Banner" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. POLÍTICAS DE STORAGE (Bucket: auction-images)
-- =====================================================

-- Permitir leitura pública de todas as imagens
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'auction-images');

-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'auction-images');

-- Permitir delete apenas para usuários autenticados
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'auction-images');

-- =====================================================
-- 3. POLÍTICAS DA TABELA User
-- =====================================================

-- Todos podem ler usuários (para exibir nomes em lances, etc)
CREATE POLICY "Public can read user names"
ON "User" FOR SELECT
TO public
USING (true);

-- Usuários podem atualizar seus próprios dados
CREATE POLICY "Users can update own data"
ON "User" FOR UPDATE
TO authenticated
USING (auth.uid()::text = id);

-- =====================================================
-- 4. POLÍTICAS DA TABELA Auction
-- =====================================================

-- Todos podem ler leilões
CREATE POLICY "Public can read auctions"
ON "Auction" FOR SELECT
TO public
USING (true);

-- =====================================================
-- 5. POLÍTICAS DA TABELA Lot
-- =====================================================

-- Todos podem ler lotes
CREATE POLICY "Public can read lots"
ON "Lot" FOR SELECT
TO public
USING (true);

-- =====================================================
-- 6. POLÍTICAS DA TABELA Bid
-- =====================================================

-- Todos podem ler lances (para exibir lances em tempo real)
CREATE POLICY "Public can read bids"
ON "Bid" FOR SELECT
TO public
USING (true);

-- Usuários autenticados podem criar lances
CREATE POLICY "Authenticated users can create bids"
ON "Bid" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- =====================================================
-- 7. POLÍTICAS DA TABELA Banner
-- =====================================================

-- Todos podem ler banners
CREATE POLICY "Public can read banners"
ON "Banner" FOR SELECT
TO public
USING (true);

-- =====================================================
-- 8. POLÍTICAS DA TABELA SystemSettings
-- =====================================================

-- Todos podem ler configurações
CREATE POLICY "Public can read settings"
ON "SystemSettings" FOR SELECT
TO public
USING (true);

-- =====================================================
-- 9. POLÍTICAS DA TABELA UserDocument
-- =====================================================

-- Usuários podem ler seus próprios documentos
CREATE POLICY "Users can read own documents"
ON "UserDocument" FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Usuários podem criar seus próprios documentos
CREATE POLICY "Users can upload own documents"
ON "UserDocument" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- =====================================================
-- 10. HABILITAR REALTIME PARA LANCES
-- =====================================================

-- Habilitar Realtime para a tabela Bid (lances)
ALTER PUBLICATION supabase_realtime ADD TABLE "Bid";

-- Habilitar Realtime para a tabela Lot (lotes)
ALTER PUBLICATION supabase_realtime ADD TABLE "Lot";

-- =====================================================
-- FIM DA CONFIGURAÇÃO
-- =====================================================

-- Verificar se tudo foi criado
SELECT 'Configuração completa!' as status;
