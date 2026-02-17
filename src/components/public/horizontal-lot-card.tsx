import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Lot, Auction } from '@prisma/client'
import { MapPin, Calendar, Fuel, Car, Gauge } from 'lucide-react'

interface HorizontalLotCardProps {
    lot: Lot & { auction: Auction }
}

export function HorizontalLotCard({ lot }: HorizontalLotCardProps) {
    const mainImage = lot.images[0] || '/placeholder-car.jpg' // Assuming images is array or we fallback
    // In real app, we'd parse the description or have separate fields. 
    // For now, we mock the specific fields if they aren't in the Lot model yet, or display generic data.

    return (
        <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
            <div className="flex flex-col lg:flex-row">

                {/* Image Section (Col-lg-2 approx 16%) */}
                <div className="w-full lg:w-48 p-3 flex flex-col items-center justify-start border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50">
                    <div className="text-center mb-2">
                        <h4 className="font-bold text-gray-700">Lote {lot.lotNumber}</h4>
                    </div>
                    <Link
                        href={`/lote/${lot.id}`}
                        className="block w-full aspect-[4/3] bg-cover bg-center rounded"
                        style={{ backgroundImage: `url(${mainImage})` }}
                    />
                </div>

                {/* Details Section (Col-lg-7 approx 58%) */}
                <div className="flex-1 p-4 text-sm text-gray-600 space-y-2">
                    <Link href={`/lote/${lot.id}`} className="block">
                        <h5 className="text-lg font-bold text-blue-900 mb-2 hover:underline">{lot.title}</h5>
                    </Link>

                    {/* Comitente Logo Mockup */}
                    <div className="mb-3">
                        <img src="/placeholder-comitente.jpg" alt="Comitente" className="h-8 w-auto object-contain" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                        <div className="col-span-2 font-bold text-gray-800 bg-yellow-100 inline-block px-2 py-0.5 rounded w-fit mb-1">{lot.condition || 'Sucata'}</div>

                        <div><span className="font-bold">Marca/Modelo:</span> {lot.title}</div>
                        <div><span className="font-bold">Placa:</span> XXX-0000 / <span className="font-bold">UF:</span> SP</div>
                        <div><span className="font-bold">Ano/Modelo:</span> {lot.year || '2000'}/{lot.year || '2000'}</div>
                        <div><span className="font-bold">Cor:</span> BRANCA</div>
                        <div><span className="font-bold">Combustível:</span> FLEX</div>
                    </div>

                    <div className="mt-3 pt-2 text-justify border-t border-gray-100">
                        <p className="line-clamp-2">{lot.description}</p>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span className="font-bold">Local de Exposição:</span> Pátio Rocha - São Paulo - SP
                    </div>
                </div>

                {/* Action Section (Col-lg-3 approx 25%) */}
                <div className="w-full lg:w-72 p-4 flex flex-col justify-between bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200">

                    {/* Status Label */}
                    <div className="mb-4">
                        <div className={`text-center py-1.5 px-3 rounded font-bold text-white text-sm uppercase ${lot.status === 'OPEN' ? 'bg-green-600' :
                                lot.status === 'CLOSED' ? 'bg-red-600' : 'bg-blue-600'
                            }`}>
                            {lot.status === 'OPEN' ? 'Em Andamento' :
                                lot.status === 'CLOSED' ? 'Encerrado' : 'Aguarde Abertura'}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-4">
                        <Link href={`/lote/${lot.id}`}>
                            <h5 className="text-gray-500 font-medium text-sm">Lance Inicial</h5>
                            <h4 className="text-2xl font-bold text-gray-800">{formatCurrency(lot.initialBid)}</h4>
                        </Link>
                    </div>

                    {/* Button */}
                    <div className="mt-auto">
                        <Link href={`/lote/${lot.id}`}>
                            <Button className="w-full font-bold bg-gray-800 hover:bg-gray-900 text-white">
                                Detalhes do Lote
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </Card>
    )
}
