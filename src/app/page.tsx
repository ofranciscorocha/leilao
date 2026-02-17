import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { prisma } from '@/lib/prisma'
import { AuctionCard } from '@/components/public/auction-card'
import { LotCard } from '@/components/public/lot-card'
import { SearchBar } from '@/components/public/search-bar'
import { AppDownloadBanner } from '@/components/public/app-download-banner'
import { BannerCarousel } from '@/components/public/banner-carousel'
import { getBanners } from '@/app/actions/cms'
import { Button } from '@/components/ui/button'
import { Home as HomeIcon, Car, Truck, Bike, Monitor, Watch, Gavel, CalendarDays } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0 // Dynamic for now

export default async function Home() {
  let auctions = []
  let featuredLots = []
  let banners = []
  let dbError = false

  try {
    auctions = await prisma.auction.findMany({
      where: { status: { in: ['OPEN', 'UPCOMING', 'LIVE'] } },
      orderBy: { endDate: 'asc' },
      include: { _count: { select: { lots: true } } }
    })

    // Fetch Featured Lots (latest 6 created)
    featuredLots = await prisma.lot.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { auction: true }
    })

    // Fetch Banners
    banners = await getBanners('HOME_HERO')

  } catch (e) {
    console.error("Database Error (likely schema mismatch):", e)
    dbError = true
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1">
        {/* HERO CAROUSEL */}
        <BannerCarousel banners={banners} />

        {/* CATEGORY ICONS */}
        <section className="bg-white py-8 border-b shadow-sm sticky top-0 z-40 md:static">
          <div className="container overflow-x-auto pb-2 md:pb-0">
            <div className="flex gap-8 md:justify-center min-w-max px-4">
              <CategoryItem icon={Car} label="Veículos" count={112} active />
              <CategoryItem icon={HomeIcon} label="Imóveis" count={76} />
              <CategoryItem icon={Truck} label="Caminhões" count={45} />
              <CategoryItem icon={Bike} label="Motos" count={32} />
              <CategoryItem icon={Monitor} label="Informática" count={14} />
              <CategoryItem icon={Watch} label="Jóias" count={8} />
            </div>
          </div>
        </section>

        {/* DESTAQUES (Featured Lots) */}
        <section className="container py-12">
          <SectionHeader title="Lotes em Destaque" subtitle="Oportunidades selecionadas para você" />

          {featuredLots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLots.map((lot) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
            </div>
          ) : (
            <EmptyState message="Nenhum lote em destaque no momento." />
          )}

          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">Ver Todos os Lotes</Button>
          </div>
        </section>

        {/* APP DOWNLOAD BANNER */}
        <AppDownloadBanner />

        {/* AGENDA DE LEILÕES */}
        <section className="container py-16 bg-white">
          <SectionHeader title="Agenda de Leilões" subtitle="Próximos eventos confirmados" icon={CalendarDays} />

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
            <div className="flex space-x-8 min-w-max">
              <button className="py-4 px-1 border-b-2 border-blue-600 font-bold text-blue-600 text-sm uppercase tracking-wide">
                Leilões Abertos ({auctions.length})
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 text-sm uppercase tracking-wide">
                Próximos Leilões
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 text-sm uppercase tracking-wide">
                Encerrados
              </button>
            </div>
          </div>

          {dbError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <Gavel className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Atualização Necessária</h3>
              <p className="text-red-700 max-w-lg mx-auto mb-6">
                Ocorreu um erro ao carregar os leilões. Isso geralmente acontece quando o banco de dados foi atualizado mas o servidor ainda não foi reiniciado.
              </p>
              <div className="bg-black/5 rounded p-4 inline-block text-left text-sm font-mono text-gray-700">
                <p>1. Pare o servidor (Ctrl+C)</p>
                <p>2. Execute: npx prisma db push</p>
                <p>3. Execute: npm run dev</p>
              </div>
            </div>
          ) : auctions.length === 0 ? (
            <EmptyState message="Nenhum leilão agendado." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {auctions.map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
        </section>

        {/* SEO / FOOTER INFO */}
        <section className="bg-gray-100 py-12 border-t">
          <div className="container prose prose-sm max-w-none text-gray-600 columns-1 md:columns-2 gap-12">
            <h3>Sobre o Pátio Rocha Leilões</h3>
            <p>
              Somos referência em leilões de veículos recuperados de financiamento, frota e seguradoras.
              Com mais de 20 anos de tradição, oferecemos segurança jurídica e transparência em todas as negociações.
              Nossos pátios contam com estrutura completa para visitação e guarda dos bens.
            </p>
            <p>
              Participe dos nossos leilões online e presenciais. Cadastre-se agora e habilite-se para dar lances.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// Helpers

function CategoryItem({ icon: Icon, label, count, active }: { icon: any, label: string, count: number, active?: boolean }) {
  return (
    <div className={`group flex flex-col items-center gap-3 cursor-pointer transition-colors ${active ? 'text-blue-700' : 'text-gray-500 hover:text-blue-700'}`}>
      <div className={`p-4 rounded-full transition-all ${active ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-50'}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm uppercase tracking-wide">{label}</span>
        {/* <span className="text-[10px] bg-gray-200 px-1.5 rounded-full">{count}</span> */}
      </div>
    </div>
  )
}

function SectionHeader({ title, subtitle, icon: Icon }: { title: string, subtitle: string, icon?: any }) {
  return (
    <div className="mb-8 flex items-end justify-between border-b pb-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6 text-blue-600" />}
          {title}
        </h2>
        <p className="text-gray-500 mt-1">{subtitle}</p>
      </div>
      {/* Controls could go here */}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
      <Gavel className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  )
}
