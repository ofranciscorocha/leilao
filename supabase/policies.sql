-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS) - SUPABASE
-- Pátio Rocha Leilões
-- =====================================================

-- IMPORTANTE: Execute esses comandos no SQL Editor do Supabase
-- https://supabase.com/dashboard/project/bftkjgimkmtpdxytbqew/sql

-- =====================================================
-- 1. STORAGE POLICIES (Bucket: auction-images)
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
WITH CHECK (
  bucket_id = 'auction-images'
  AND (storage.foldername(name))[1] IN ('auctions', 'lots', 'users', 'banners')
);

-- Permitir atualização apenas para admins
CREATE POLICY "Only admins can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'auction-images'
  AND auth.jwt() ->> 'role' = 'authenticated'
);

-- Permitir delete apenas para admins
CREATE POLICY "Only admins can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'auction-images'
  AND auth.jwt() ->> 'role' = 'authenticated'
);

-- =====================================================
-- 2. ROW LEVEL SECURITY (RLS) - TABELAS
-- =====================================================

-- HABILITAR RLS em todas as tabelas
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Auction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bid" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemSettings" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: User
-- =====================================================

-- Usuários podem ler seus próprios dados
CREATE POLICY "Users can read own data"
ON "User" FOR SELECT
TO authenticated
USING (auth.uid()::text = id);

-- Admins podem ler todos os usuários
CREATE POLICY "Admins can read all users"
ON "User" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- Usuários podem atualizar seus próprios dados
CREATE POLICY "Users can update own data"
ON "User" FOR UPDATE
TO authenticated
USING (auth.uid()::text = id);

-- Admins podem atualizar qualquer usuário
CREATE POLICY "Admins can update any user"
ON "User" FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- =====================================================
-- TABELA: Auction
-- =====================================================

-- Leilões públicos podem ser lidos por todos
CREATE POLICY "Public can read non-restricted auctions"
ON "Auction" FOR SELECT
TO public
USING ("requireLogin" = false);

-- Usuários autenticados podem ler leilões restritos
CREATE POLICY "Authenticated can read all auctions"
ON "Auction" FOR SELECT
TO authenticated
USING (true);

-- Apenas admins podem criar leilões
CREATE POLICY "Only admins can create auctions"
ON "Auction" FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- Apenas admins podem atualizar leilões
CREATE POLICY "Only admins can update auctions"
ON "Auction" FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- Apenas admins podem deletar leilões
CREATE POLICY "Only admins can delete auctions"
ON "Auction" FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- =====================================================
-- TABELA: Lot
-- =====================================================

-- Lotes públicos podem ser lidos por todos
CREATE POLICY "Public can read lots from public auctions"
ON "Lot" FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM "Auction"
    WHERE id = "Lot"."auctionId"
    AND "requireLogin" = false
  )
);

-- Usuários autenticados podem ler todos os lotes
CREATE POLICY "Authenticated can read all lots"
ON "Lot" FOR SELECT
TO authenticated
USING (true);

-- Apenas admins podem criar lotes
CREATE POLICY "Only admins can create lots"
ON "Lot" FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- Apenas admins podem atualizar lotes
CREATE POLICY "Only admins can update lots"
ON "Lot" FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- Apenas admins podem deletar lotes
CREATE POLICY "Only admins can delete lots"
ON "Lot" FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- =====================================================
-- TABELA: Bid
-- =====================================================

-- Usuários podem ler seus próprios lances
CREATE POLICY "Users can read own bids"
ON "Bid" FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Admins podem ler todos os lances
CREATE POLICY "Admins can read all bids"
ON "Bid" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- Usuários autenticados podem criar lances
CREATE POLICY "Authenticated users can create bids"
ON "Bid" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- Ninguém pode atualizar lances (imutável)
-- Ninguém pode deletar lances (apenas admins via aplicação)

-- =====================================================
-- TABELA: UserDocument
-- =====================================================

-- Usuários podem ler seus próprios documentos
CREATE POLICY "Users can read own documents"
ON "UserDocument" FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Admins podem ler todos os documentos
CREATE POLICY "Admins can read all documents"
ON "UserDocument" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- Usuários podem criar seus próprios documentos
CREATE POLICY "Users can upload own documents"
ON "UserDocument" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- Admins podem atualizar status de documentos
CREATE POLICY "Admins can update document status"
ON "UserDocument" FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- =====================================================
-- TABELA: SystemSettings
-- =====================================================

-- Todos podem ler configurações do sistema
CREATE POLICY "Public can read system settings"
ON "SystemSettings" FOR SELECT
TO public
USING (true);

-- Apenas admins podem atualizar configurações
CREATE POLICY "Only admins can update settings"
ON "SystemSettings" FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- =====================================================
-- 3. FUNCTIONS & TRIGGERS
-- =====================================================

-- Função para sincronizar usuário do Auth com tabela User
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, name, role, type, status, password)
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    'USER',
    COALESCE(NEW.raw_user_meta_data->>'type', 'PF'),
    'ACTIVE',
    ''
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário na tabela User quando criar no Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. REALTIME (para lances ao vivo)
-- =====================================================

-- Habilitar Realtime para lances
ALTER PUBLICATION supabase_realtime ADD TABLE "Bid";
ALTER PUBLICATION supabase_realtime ADD TABLE "Lot";

-- =====================================================
-- FIM DAS POLÍTICAS
-- =====================================================

-- Para verificar políticas criadas:
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
