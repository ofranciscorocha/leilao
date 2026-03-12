import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { prisma } from "@/lib/prisma"
import { LotCard } from "@/components/public/lot-card"
import { notFound } from "next/navigation"
import { Calendar, MapPin, Gavel } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { LiveAuditorium } from "@/components/auction/live-auditorium"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const revalidate = 60

export default async function AuctionPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const auction = await prisma.auction.findUnique({
        where: { id: params.id },
        include: {
            lots: {
                orderBy: { lotNumber: 'asc' }
            },
            _count: {
                select: { lots: true }
            }
        }
    })

    if (!auction) {
        notFound()
    }

    // --- Mock User Session ---
    const userId = 'user_123'
    const userName = 'Licitante Demo'

    if (auction.status === 'LIVE') {
        return (
            <div className="min-h-screen bg-[#080c17]">
                <Navbar />
                <LiveAuditorium
                    auctionId={auction.id}
                    initialData={{
                        currentLot: auction.lots.find(l => l.status === 'OPEN') || auction.lots[0],
                        lots: auction.lots
                    }}
                    userId={userId}
                    userName={userName}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f8f9fa]">
            <Navbar />

            <main className="flex-1">
                {/* Premium Auction Header */}
                <div className="bg-[#080c17] text-white overflow-hidden relative border-b border-secondary/20">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/10 to-transparent pointer-events-none" />
                    
                    <div className="container py-16 relative z-10">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                            <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
                                    <Badge className="bg-secondary text-primary font-black px-4 py-1.5 rounded-full border-none shadow-lg shadow-secondary/10 uppercase tracking-widest text-[10px]">
                                        {auction.status === 'OPEN' ? 'Inscrições Abertas' : auction.status}
                                    </Badge>
                                    <span className="h-px w-12 bg-white/20" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Leilão Judicial</span>
                                </div>
                                
                                <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none animate-in fade-in slide-in-from-bottom duration-700 delay-100">
                                    {auction.title}
                                </h1>
                                
                                <p className="text-white/60 max-w-2xl font-medium leading-relaxed italic animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                                    {auction.description || "Este leilão apresenta uma seleção exclusiva de ativos sob gestão do Pátio Rocha. Todos os bens possuem vistoria detalhada."}
                                </p>
                            </div>

                            <div className="w-full lg:w-auto flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-700">
                                <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 min-w-[300px]">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-secondary rounded-xl flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Encerramento</span>
                                            <span className="font-black text-lg text-secondary tracking-tight">
                                                {formatDate(auction.endDate)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-white/60" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Modalidade</span>
                                            <span className="font-black text-sm text-white/80 uppercase tracking-tighter">
                                                Leilão {auction.type === 'ONLINE' ? '100% Digital' : 'Auditório Misto'}
                                            </span>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-black uppercase tracking-widest h-12 shadow-xl shadow-secondary/10 transition-transform hover:-translate-y-1">
                                        HABILITE-SE AGORA
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lots Catalog Section */}
                <section className="container py-20">
                    <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-12 border-b border-gray-100 pb-8">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-primary tracking-tighter uppercase italic">
                                Catálogo de <span className="text-secondary text-4xl">Lotes</span>
                            </h2>
                            <p className="text-muted-foreground font-medium flex items-center gap-2 italic">
                                {auction.lots.length} oportunidades exclusivas encontradas
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-full px-6 font-bold text-xs uppercase border-primary/10">FILTRAR</Button>
                            <Button variant="outline" className="rounded-full px-6 font-bold text-xs uppercase border-primary/10">ORDENAR</Button>
                        </div>
                    </div>

                    {auction.lots.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {auction.lots.map(lot => (
                                <LotCard key={lot.id} lot={lot} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-24 text-center rounded-[3rem] shadow-2xl border border-dashed border-gray-200">
                            <Gavel className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-primary uppercase italic mb-2">Aguardando Lotes</h3>
                            <p className="text-muted-foreground font-medium italic">O catálogo para este leilão está sendo processado.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}

