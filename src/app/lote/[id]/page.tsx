import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { LotGallery } from '@/components/public/lot-gallery'
import { BidForm } from '@/components/public/bid-form'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Calendar, Truck, AlertTriangle, CheckCircle, Info, Gavel } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function LotDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const lot = await prisma.lot.findUnique({
        where: { id: params.id },
        include: {
            auction: true,
            images: true,
            inspection: true,
            logistics: true
        }
    })

    if (!lot) notFound()

    const images = lot.images.map(i => i.url)
    if (lot.imageUrl && !images.includes(lot.imageUrl)) {
        images.unshift(lot.imageUrl)
    }
    if (images.length === 0) images.push('/placeholder-car.jpg')

    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#f8f9fa] text-gray-900">
            <Navbar />

            <main className="flex-1 container py-12">
                {/* Premium Breadcrumbs */}
                <div className="mb-10 animate-in fade-in slide-in-from-left duration-500">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="text-secondary">/</span>
                        <Link href="/auctions" className="hover:text-primary transition-colors">Leilões</Link>
                        <span className="text-secondary">/</span>
                        <Link href={`/auctions/${lot.auctionId}`} className="hover:text-primary transition-colors truncate max-w-[200px]">{lot.auction.title}</Link>
                        <span className="text-secondary">/</span>
                        <span className="text-primary italic">Lote {lot.lotNumber || lot.id.slice(-3)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Gallery & Details (60%) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Title & Gallery Section */}
                        <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-2xl shadow-primary/5 border border-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl rounded-full" />
                            
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Badge className="bg-primary text-secondary font-black px-4 py-1.5 rounded-xl border-none shadow-lg shadow-primary/10 uppercase tracking-widest text-[10px] italic">
                                            Lote {lot.lotNumber || lot.id.slice(-3)}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            Disponível para Lances
                                        </div>
                                    </div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-primary leading-none tracking-tighter uppercase italic">
                                        {lot.title}
                                    </h1>
                                    <div className="flex items-center gap-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <span className="flex items-center gap-2">
                                            <Gavel className="w-4 h-4 text-secondary" />
                                            {lot.category}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-secondary" />
                                            Ano: {lot.year || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <StatusBadge status={lot.status} />
                            </div>

                            <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-50 shadow-inner bg-gray-50">
                                <LotGallery images={images} title={lot.title} />
                            </div>
                        </div>

                        {/* Technical Information Tabs */}
                        <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-2xl shadow-primary/5 border border-white">
                            <Tabs defaultValue="details" className="space-y-10">
                                <TabsList className="w-full justify-start gap-10 bg-transparent border-b border-gray-100 rounded-none h-auto p-0">
                                    {['details', 'inspection', 'logistics'].map((tab) => (
                                        <TabsTrigger 
                                            key={tab}
                                            value={tab} 
                                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-secondary rounded-none pb-4 px-0 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground data-[state=active]:text-primary transition-all"
                                        >
                                            {tab === 'details' ? 'Descrição Técnica' : tab === 'inspection' ? 'Laudo Certificado' : 'Logística & Pátio'}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                <TabsContent value="details" className="space-y-12 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                                        <DetailItem label="Marca / Modelo" value={lot.model || lot.title} />
                                        <DetailItem label="Ano / Modelo" value={lot.year || '-'} />
                                        <DetailItem label="Cor Predominante" value={lot.color || '-'} />
                                        <DetailItem label="Combustível" value={lot.fuel || '-'} />
                                        <DetailItem label="Placa Final" value={lot.plate || 'XXX-****'} />
                                        <DetailItem label="Identificação Chassi" value={lot.chassis ? '***' + lot.chassis.slice(-4) : '***'} />
                                    </div>
                                    <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 italic relative">
                                        <Info className="absolute top-6 right-6 w-10 h-10 text-primary opacity-5 pointer-events-none" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">Informações Complementares</h3>
                                        <div className="text-sm font-medium text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {lot.description || 'A descrição detalhada deste ativo está em processo de revisão técnica e será disponibilizada em breve.'}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="inspection" className="animate-in fade-in duration-500">
                                    {lot.inspection ? (
                                        <div className="space-y-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                                <InspectionItem label="Estado do Motor" value={lot.inspection.engineStatus} />
                                                <InspectionItem label="Sist. de Transmissão" value={lot.inspection.transmission} />
                                                <InspectionItem label="Condição da Lataria" value={lot.inspection.bodywork} />
                                                <InspectionItem label="Conservação Interna" value={lot.inspection.upholstery} />
                                            </div>
                                            {lot.inspection.notes && (
                                                <div className="bg-amber-50/50 border border-amber-100 p-8 rounded-[2rem] flex gap-6">
                                                    <AlertTriangle className="h-8 w-8 text-amber-600 shrink-0" />
                                                    <div className="space-y-2">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-800">Notas de Vistoria</h4>
                                                        <p className="text-sm font-medium text-amber-900 leading-relaxed italic">{lot.inspection.notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                                            <Gavel className="h-12 w-12 mx-auto mb-4 text-gray-200" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vistoria Certificada Indisponível</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="logistics" className="space-y-8 animate-in fade-in duration-500">
                                    {lot.logistics ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="bg-primary/[0.02] p-8 rounded-[2rem] border border-primary/5 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-white rounded-2xl shadow-xl shadow-primary/5 flex items-center justify-center border border-gray-50">
                                                        <MapPin className="h-6 w-6 text-secondary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Localização Operacional</p>
                                                        <p className="font-black text-primary uppercase italic">{lot.logistics.storageLocation || 'A definir'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-primary text-white p-8 rounded-[2rem] shadow-2xl shadow-primary/20 space-y-6 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Acessórios Coletados</h4>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between text-sm font-bold">
                                                        <span className="opacity-60">Chaves de Contato?</span>
                                                        {lot.logistics.hasKeys ? <CheckCircle className="h-5 w-5 text-secondary" /> : <span className="text-secondary italic">Pendente</span>}
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm font-bold">
                                                        <span className="opacity-60">Manuais Originais?</span>
                                                        {lot.logistics.hasManual ? <CheckCircle className="h-5 w-5 text-secondary" /> : <span className="text-secondary italic">Pendente</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic text-center py-10 bg-gray-50 rounded-[2rem]">Dados logísticos aguardando atualização do pátio.</p>
                                    )}
                                    <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20 flex gap-4 items-center">
                                        <Truck className="h-6 w-6 text-primary shrink-0" />
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-tight leading-normal">
                                            Informação: Retirada via cegonha ou individual requer agendamento prévio com 48h de antecedência via central de logística.
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Right Column: Bidding Interface (40%) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-8 animate-in fade-in slide-in-from-right duration-700">
                            <Card className="border-none bg-[#080c17] text-white shadow-[0_32px_64px_-16px_rgba(8,12,23,0.3)] rounded-[3rem] overflow-hidden">
                                <div className="bg-secondary text-primary px-8 py-3 text-center font-black uppercase italic tracking-[0.2em] text-[10px]">
                                    Auditório Virtual Oficial
                                </div>
                                <CardContent className="p-10 space-y-10 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full pointer-events-none" />
                                    
                                    <div className="text-center relative z-10">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 block">Lance Atualizado</span>
                                        <div className="flex items-baseline justify-center gap-2">
                                            <span className="text-secondary font-black text-xl italic uppercase tracking-tighter">R$</span>
                                            <div className="text-6xl font-black tracking-tighter italic text-white leading-none">
                                                {formatCurrency(lot.currentBid || lot.startingPrice).split('R$')[1]}
                                            </div>
                                        </div>
                                        <div className="mt-8 flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                                            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Leilão ao Vivo</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-8 border-y border-white/10 relative z-10">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Início</span>
                                            <span className="font-black text-white italic tracking-tighter text-sm">{formatCurrency(lot.startingPrice)}</span>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Incremento</span>
                                            <span className="font-black text-secondary italic tracking-tighter text-sm">+{formatCurrency(lot.incrementAmount)}</span>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        {lot.status === 'OPEN' || lot.status === 'PENDING' ? (
                                            <BidForm
                                                lotId={lot.id}
                                                currentPrice={lot.currentBid || lot.startingPrice}
                                                increment={lot.incrementAmount}
                                            />
                                        ) : (
                                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl text-center text-white/40 font-black uppercase italic tracking-widest text-xs">
                                                Lote Arrematado / Encerrado
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-[9px] text-center text-white/20 font-bold uppercase tracking-widest leading-relaxed relative z-10 italic">
                                        * Lances confirmados não podem ser cancelados conforme edital Art. 42
                                    </p>
                                </CardContent>
                            </Card>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-white space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-3">
                                    <Info className="w-4 h-4 text-secondary" />
                                    Cronograma do Leilão
                                </h4>
                                <div className="space-y-4 text-sm font-bold text-muted-foreground">
                                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-secondary" />
                                            <span className="text-[11px] uppercase tracking-tighter">Data Final</span>
                                        </div>
                                        <span className="text-primary italic tracking-tighter">{formatDate(lot.auction.endDate)}</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-4 w-4 text-secondary" />
                                            <span className="text-[11px] uppercase tracking-tighter">Cidade Base</span>
                                        </div>
                                        <span className="text-primary italic tracking-tighter">S. J. Rio Preto - SP</span>
                                    </div>
                                </div>
                                <Button variant="link" className="w-full text-[10px] font-black text-secondary uppercase tracking-widest">
                                    BAIXAR EDITAL COMPLETO (PDF)
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-2 group">
            <span className="block text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] group-hover:text-secondary transition-colors">{label}</span>
            <span className="block font-black text-primary uppercase italic tracking-tighter text-base">{value}</span>
        </div>
    )
}

function InspectionItem({ label, value }: { label: string, value?: string | null }) {
    const mapValue = (v?: string | null) => {
        if (!v) return 'Não Avaliado'
        const map: any = {
            'WORKING': 'Em Funcionamento', 'DAMAGED': 'Avariado', 'MISSING': 'Ausente', 'SEIZED': 'Bloqueado',
            'MANUAL': 'Mecânico', 'AUTOMATIC': 'Hidramático', 'BROKEN': 'Inoperante',
            'GOOD': 'Estado de Novo', 'SCRATCHED': 'Avarias Leves', 'DENTED': 'Estrutural Comp.', 'TOTAL_LOSS': 'Sinistro Total'
        }
        return map[v] || v
    }

    return (
        <div className="flex justify-between items-center py-4 border-b border-gray-100 group">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{label}</span>
            <span className="font-black text-primary uppercase italic tracking-tighter text-sm group-hover:text-secondary transition-colors">{mapValue(value)}</span>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'OPEN': 'bg-green-500 text-white shadow-lg shadow-green-500/20',
        'PENDING': 'bg-secondary text-primary shadow-lg shadow-secondary/20',
        'SOLD': 'bg-primary text-white',
        'CLOSED': 'bg-red-500 text-white shadow-lg shadow-red-500/20'
    }
    const labels: any = {
        'OPEN': 'Em Aberto',
        'PENDING': 'Aguardando',
        'SOLD': 'Arrematado',
        'CLOSED': 'Encerrado'
    }
    return (
        <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic ${styles[status] || 'bg-gray-100'}`}>
            {labels[status] || status}
        </span>
    )
}


