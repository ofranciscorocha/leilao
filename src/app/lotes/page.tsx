import { Suspense } from "react";
import Navbar from "@/components/gleam/navbar";
import Footer from "@/components/gleam/footer";
import { prisma } from "@/lib/prisma";
import { Search, Filter, MapPin, Tag, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const revalidate = 0;

export default async function LotesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const query = typeof searchParams.busca === 'string' ? searchParams.busca : '';
    const categoria = typeof searchParams.categoria === 'string' ? searchParams.categoria : '';

    // Fetch lots - basic logic
    let lots = [];
    try {
        lots = await (prisma as any).lot.findMany({
            where: {
                status: 'OPEN',
                ...(query ? { title: { contains: query, mode: 'insensitive' } } : {}),
                ...(categoria ? { category: { equals: categoria, mode: 'insensitive' } } : {})
            },
            take: 40,
            orderBy: { createdAt: 'desc' },
            include: { auction: true }
        });
    } catch (error) {
        console.error('Database connection error:', error);
    }

    // Filters for demonstration
    const categories = ['Todos os Lotes', 'Imóveis', 'Veículos Leves', 'Veículos Pesados', 'Motos', 'Bens Diversos', 'Sucatas'];
    const locations = ['São Paulo - SP', 'Campinas - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG'];

    return (
        <div className="min-h-screen bg-[#f4f6f9] flex flex-col font-body">
            <Navbar />
            <main className="flex-1 container py-8">

                {/* Header Section Compact */}
                <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white px-4 py-3 border-b border-[#e5e7eb] -mx-4 md:mx-0 md:rounded-lg md:border md:shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-[#3c8dbc] hover:text-[#367fa9] flex items-center gap-1 text-sm font-bold">
                            <ChevronRight className="w-4 h-4 rotate-180" />
                            Voltar
                        </Link>
                        <div>
                            <h1 className="text-xl font-extrabold text-[#000] m-0">Catálogo de Lotes</h1>
                            <p className="text-[11px] text-[#6b7280] uppercase tracking-wider font-semibold">{lots.length} lotes encontrados {query && `para "${query}"`}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase hidden md:inline">Ordenar por:</span>
                        <select className="border border-[#d1d5db] rounded-md px-3 py-1.5 text-xs font-bold text-[#4b5563] bg-white outline-none focus:ring-1 focus:ring-[#3c8dbc]">
                            <option>Relevância</option>
                            <option>Menor Valor</option>
                            <option>Maior Valor</option>
                            <option>Mais Recentes</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 space-y-6 flex-shrink-0">
                        {/* Sidebar */}
                        <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-5">
                            <div className="flex items-center gap-2 text-[#374151] font-semibold text-lg mb-4 border-b border-[#f3f4f6] pb-3">
                                <Filter size={18} />
                                Filtros
                            </div>

                            {/* Categoria */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-[#4b5563] mb-3 uppercase tracking-wider">Categorias</h3>
                                <ul className="space-y-2">
                                    {categories.map((cat, idx) => (
                                        <li key={idx}>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-gray-300 text-[#3c8dbc] focus:ring-[#3c8dbc]" defaultChecked={idx === 0 && !categoria} />
                                                <span className="text-sm text-[#6b7280] group-hover:text-[#3c8dbc] transition-colors">{cat}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Localização */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-[#4b5563] mb-3 uppercase tracking-wider">Localização</h3>
                                <ul className="space-y-2">
                                    {locations.map((loc, idx) => (
                                        <li key={idx}>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-gray-300 text-[#3c8dbc] focus:ring-[#3c8dbc]" />
                                                <span className="text-sm text-[#6b7280] group-hover:text-[#3c8dbc] transition-colors">{loc}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Filtros Específicos de Veículos */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-[#4b5563] mb-3 uppercase tracking-wider">Veículos</h3>

                                {/* Marca */}
                                <div className="mb-3 space-y-1">
                                    <label className="text-xs font-semibold text-[#6b7280]">Marca</label>
                                    <select className="w-full border border-[#d1d5db] rounded px-2 py-1.5 text-sm text-[#4b5563]">
                                        <option value="">Todas as Marcas</option>
                                        <option value="fiat">Fiat</option>
                                        <option value="volkswagen">Volkswagen</option>
                                        <option value="chevrolet">Chevrolet</option>
                                        <option value="ford">Ford</option>
                                        <option value="honda">Honda</option>
                                        <option value="toyota">Toyota</option>
                                    </select>
                                </div>

                                {/* Modelo */}
                                <div className="mb-3 space-y-1">
                                    <label className="text-xs font-semibold text-[#6b7280]">Modelo</label>
                                    <input type="text" placeholder="Ex: Gol, Civic..." className="w-full border border-[#d1d5db] rounded px-2 py-1.5 text-sm" />
                                </div>

                                {/* Ano */}
                                <div className="mb-3 space-y-1">
                                    <label className="text-xs font-semibold text-[#6b7280]">Ano Fab/Mod</label>
                                    <div className="flex items-center gap-2">
                                        <input type="text" placeholder="De" className="w-full border border-[#d1d5db] rounded px-2 py-1.5 text-sm" />
                                        <span className="text-[#9ca3af]">-</span>
                                        <input type="text" placeholder="Até" className="w-full border border-[#d1d5db] rounded px-2 py-1.5 text-sm" />
                                    </div>
                                </div>

                                {/* Condição */}
                                <div className="mb-3 space-y-1">
                                    <label className="text-xs font-semibold text-[#6b7280]">Condição do Veículo</label>
                                    <select className="w-full border border-[#d1d5db] rounded px-2 py-1.5 text-sm text-[#4b5563]">
                                        <option value="">Qualquer condição</option>
                                        <option value="financiamento">Recuperação de Financiamento</option>
                                        <option value="frota">Desmobilização de Frota</option>
                                        <option value="transito">Apreensão de Trânsito</option>
                                        <option value="sinistro">Sinistrado (Pequena/Média Monta)</option>
                                        <option value="sucata">Sucata</option>
                                    </select>
                                </div>

                                {/* Cor */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[#6b7280]">Cor Predominante</label>
                                    <select className="w-full border border-[#d1d5db] rounded px-2 py-1.5 text-sm text-[#4b5563]">
                                        <option value="">Todas as cores</option>
                                        <option value="branco">Branco</option>
                                        <option value="preto">Preto</option>
                                        <option value="prata">Prata</option>
                                        <option value="cinza">Cinza</option>
                                        <option value="vermelho">Vermelho</option>
                                        <option value="azul">Azul</option>
                                    </select>
                                </div>
                            </div>

                            {/* Valor */}
                            <div className="mb-2">
                                <h3 className="text-sm font-bold text-[#4b5563] mb-3 uppercase tracking-wider">Lance Atual</h3>
                                <div className="flex items-center gap-2">
                                    <input type="number" placeholder="Min" className="w-full border border-[#d1d5db] rounded px-2 py-1.5 text-sm" />
                                    <span className="text-[#9ca3af]">-</span>
                                    <input type="number" placeholder="Max" className="w-full border border-[#d1d5db] rounded px-2 py-1.5 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lotes Grid */}
                    <div className="flex-1">
                        {lots.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-12 flex flex-col items-center justify-center text-center">
                                <Search className="w-12 h-12 text-[#9ca3af] mb-4" />
                                <h2 className="text-xl font-bold text-[#374151]">Nenhum lote encontrado</h2>
                                <p className="text-[#6b7280] mt-2 max-w-md">Tente ajustar seus filtros de busca ou verificar outras categorias para encontrar o que procura.</p>
                                <button className="mt-6 px-4 py-2 bg-[#3c8dbc] text-white rounded-md text-sm font-medium hover:bg-[#367fa9] transition-colors">
                                    Limpar Filtros
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                {lots.map((lot: any) => (
                                    <Link key={lot.id} href={`/lote/${lot.id}`} className="group bg-white rounded-lg overflow-hidden border border-[#e5e7eb] hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                        <div className="relative aspect-[4/3] bg-[#f8fafc] overflow-hidden">
                                            {lot.images && lot.images[0] ? (
                                                <img src={lot.images[0]} alt={lot.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                    <Tag className="w-10 h-10 text-gray-300" />
                                                </div>
                                            )}

                                            <div className="absolute top-2 left-2 right-2 flex justify-between">
                                                <span className="bg-[#10b981] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
                                                    Aberto
                                                </span>
                                                <span className="bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                                                    Lote {lot.lotNumber || '00'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="text-[10px] text-[#6b7280] mb-0.5 font-bold uppercase tracking-tight truncate">{lot.auction?.title || 'Leilão Geral'}</div>
                                            <h3 className="font-bold text-[#1f2937] text-sm md:text-base leading-tight mb-2 line-clamp-2 group-hover:text-[#3c8dbc] transition-colors">
                                                {lot.title}
                                            </h3>

                                            <div className="mt-auto flex justify-between items-end">
                                                <div className="flex items-center gap-1.5 text-[11px] text-[#6b7280]">
                                                    <MapPin className="w-3 h-3 text-[#9ca3af]" />
                                                    <span className="truncate">{lot.location?.split('-')[0] || 'Localização'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 border-t border-[#f3f4f6] bg-[#f8fafc]">
                                            <div className="text-xs text-[#6b7280] uppercase font-semibold mb-0.5 tracking-wider">Lance Atual</div>
                                            <div className="text-xl font-bold text-[#1f2937]">
                                                {formatCurrency(lot.currentBid || lot.initialBid || 0)}
                                            </div>
                                            <div className="mt-3 w-full bg-[#3c8dbc] text-white text-center py-2 rounded text-sm font-semibold transition-colors group-hover:bg-[#367fa9]">
                                                Ver Detalhes
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
