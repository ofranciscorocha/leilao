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
import { MapPin, Calendar, Truck, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

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
        <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
            <Navbar />

            <main className="flex-1 container py-8">
                {/* Breadcrumbs / Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span>Home</span> / <span>Leilões</span> / <span>{lot.auction.title}</span> / <span className="text-gray-900 font-bold">Lote {lot.lotNumber}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Gallery & Details (66%) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title & Gallery */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Badge className="mb-2 text-sm px-3 py-1 bg-gray-900 border-0">Lote {lot.lotNumber}</Badge>
                                    <h1 className="text-3xl font-extrabold text-gray-900">{lot.title}</h1>
                                    <p className="text-gray-500">{lot.category} • {lot.year || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={lot.status} />
                                </div>
                            </div>

                            <LotGallery images={images} title={lot.title} />
                        </div>

                        {/* Detailed Tabs */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <Tabs defaultValue="details">
                                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                                    <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3 px-0 font-bold text-gray-500 data-[state=active]:text-blue-600">Detalhes do Bem</TabsTrigger>
                                    <TabsTrigger value="inspection" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3 px-0 font-bold text-gray-500 data-[state=active]:text-blue-600">Laudo de Vistoria</TabsTrigger>
                                    <TabsTrigger value="logistics" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3 px-0 font-bold text-gray-500 data-[state=active]:text-blue-600">Retirada & Pátio</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="pt-6 space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <DetailItem label="Marca/Modelo" value={lot.model || lot.title} />
                                        <DetailItem label="Ano/Modelo" value={lot.year || '-'} />
                                        <DetailItem label="Cor" value={lot.color || '-'} />
                                        <DetailItem label="Combustível" value={lot.fuel || '-'} />
                                        <DetailItem label="Placa" value={lot.plate || 'XXX-****'} />
                                        <DetailItem label="Chassi" value={lot.chassis ? '***' + lot.chassis.slice(-4) : '***'} />
                                    </div>
                                    <Separator />
                                    <div>
                                        <h3 className="font-bold mb-2">Descrição Completa</h3>
                                        <div className="prose prose-sm max-w-none text-gray-600">
                                            {lot.description || 'Sem descrição detalhada.'}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="inspection" className="pt-6">
                                    {lot.inspection ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <InspectionItem label="Motor" value={lot.inspection.engineStatus} />
                                                <InspectionItem label="Câmbio" value={lot.inspection.transmission} />
                                                <InspectionItem label="Lataria" value={lot.inspection.bodywork} />
                                                <InspectionItem label="Estofamento" value={lot.inspection.upholstery} />
                                            </div>
                                            {lot.inspection.notes && (
                                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                                    <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                                                        <AlertTriangle className="h-4 w-4" /> Observações do Vistoriador
                                                    </h4>
                                                    <p className="text-sm text-yellow-700">{lot.inspection.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p>Vistoria não disponível para este lote.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="logistics" className="pt-6">
                                    {lot.logistics ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card>
                                                <CardHeader><CardTitle className="text-base">Localização no Pátio</CardTitle></CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="h-5 w-5 text-blue-600" />
                                                        <div>
                                                            <p className="font-bold">{lot.logistics.storageLocation || 'Não informado'}</p>
                                                            <p className="text-xs text-gray-500">Setor de Armazenamento</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader><CardTitle className="text-base">Chaves & Manuais</CardTitle></CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Chave no local?</span>
                                                        {lot.logistics.hasKeys ? <CheckCircle className="h-4 w-4 text-green-600" /> : <span className="text-red-500 text-sm font-bold">Não</span>}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Manual presente?</span>
                                                        {lot.logistics.hasManual ? <CheckCircle className="h-4 w-4 text-green-600" /> : <span className="text-red-500 text-sm font-bold">Não</span>}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Informações logísticas não disponíveis.</p>
                                    )}
                                    <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-100 text-sm text-blue-800 flex gap-2">
                                        <Truck className="h-5 w-5 flex-shrink-0" />
                                        <p>A retirada do bem deve ser agendada após a confirmação do pagamento. O arrematante é responsável pelo transporte.</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Right Column: Bidding Interface (33%) */}
                    <div className="space-y-6">
                        <div className="sticky top-24">
                            <Card className="border-2 border-blue-600 shadow-lg overflow-hidden">
                                <div className="bg-blue-600 text-white p-3 text-center font-bold uppercase tracking-wider text-sm">
                                    Painel de Lances
                                </div>
                                <CardContent className="p-6 space-y-6">
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-full mb-3">Lance Atual</p>
                                        <div className="text-4xl font-black text-gray-900 tracking-tight">
                                            {formatCurrency(lot.currentBid || lot.startingPrice)}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {lot.auction.status === 'OPEN' ? 'Leilão em andamento' : 'Aguardando abertura'}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Lance Inicial:</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(lot.startingPrice)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Incremento Mínimo:</span>
                                            <span className="font-medium text-green-600">+{formatCurrency(lot.incrementAmount)}</span>
                                        </div>
                                    </div>

                                    {/* Bid Form Component */}
                                    {lot.status === 'OPEN' || lot.status === 'PENDING' ? (
                                        <div className="pt-2">
                                            <BidForm
                                                lotId={lot.id}
                                                currentPrice={lot.currentBid || lot.startingPrice}
                                                increment={lot.incrementAmount}
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 p-4 rounded text-center text-gray-500 font-bold">
                                            Lote Encerrado
                                        </div>
                                    )}

                                    <div className="text-xs text-center text-gray-400">
                                        Ao dar um lance, você concorda com os <a href="#" className="underline">Termos de Uso</a>.
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="mt-4">
                                <CardHeader className="pb-2"><CardTitle className="text-sm">Informações do Leilão</CardTitle></CardHeader>
                                <CardContent className="text-sm space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>Encerramento: <strong>{formatDate(lot.auction.endDate)}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span>Local: <strong>São Paulo - SP</strong></span>
                                    </div>
                                </CardContent>
                            </Card>
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
        <div>
            <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{label}</span>
            <span className="block font-medium text-gray-900">{value}</span>
        </div>
    )
}

function InspectionItem({ label, value }: { label: string, value?: string | null }) {
    // Map existing values to readable text
    const mapValue = (v?: string | null) => {
        if (!v) return '-'
        const map: any = {
            'WORKING': 'Funcionando', 'DAMAGED': 'Danificado', 'MISSING': 'Faltando', 'SEIZED': 'Travado',
            'MANUAL': 'Manual', 'AUTOMATIC': 'Automático', 'BROKEN': 'Quebrado',
            'GOOD': 'Bom', 'SCRATCHED': 'Riscos Leves', 'DENTED': 'Amassado', 'TOTAL_LOSS': 'Perda Total'
        }
        return map[v] || v
    }

    return (
        <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-600">{label}</span>
            <span className="font-bold text-gray-900">{mapValue(value)}</span>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'OPEN': 'bg-green-100 text-green-800',
        'PENDING': 'bg-blue-100 text-blue-800',
        'SOLD': 'bg-gray-100 text-gray-800',
        'CLOSED': 'bg-red-100 text-red-800'
    }
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[status] || 'bg-gray-100'}`}>
            {status === 'OPEN' ? 'Em disputa' : status}
        </span>
    )
}
