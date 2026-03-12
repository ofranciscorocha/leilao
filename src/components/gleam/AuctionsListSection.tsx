'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gavel, Calendar, MapPin, Eye, LayoutGrid, List as ListIcon } from 'lucide-react';

export default function AuctionsListSection({ auctions }: { auctions: any[] }) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    if (!auctions || auctions.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="h-1 w-8 bg-[#D4AF37] rounded-full"></span>
                        <span className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest">Leilões Abertos</span>
                        <span className="h-1 w-8 bg-[#D4AF37] rounded-full"></span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a2332] tracking-tight">
                        Próximos Eventos
                    </h2>
                    <p className="mt-4 text-[#1a2332]/70 max-w-2xl mx-auto text-sm md:text-base font-medium">
                        Participe dos nossos próximos leilões e aproveite oportunidades exclusivas.
                    </p>
                </div>

                {/* View Mode Toggle Controls */}
                <div className="flex justify-end items-center mb-6">
                    <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                        <button
                            onClick={() => setViewMode('grid')}
                            aria-label="Visualização em Grade"
                            className={`p-2 rounded-md flex items-center gap-2 transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1a2332] font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="text-sm hidden sm:inline">Grade</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            aria-label="Visualização em Lista"
                            className={`p-2 rounded-md flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1a2332] font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <ListIcon className="w-4 h-4" />
                            <span className="text-sm hidden sm:inline">Lista</span>
                        </button>
                    </div>
                </div>

                {/* Auctions Display */}
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                    {auctions.map((auction) => (
                        <div
                            key={auction.id}
                            className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex 
                                ${viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'}
                            `}
                        >

                            {/* Image Placeholder */}
                            <div className={`bg-gray-100 flex items-center justify-center relative overflow-hidden
                                ${viewMode === 'list' ? 'sm:w-1/3 min-h-[200px] sm:min-h-full' : 'w-full aspect-video'}
                            `}>
                                {auction.coverImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={auction.coverImage} alt={auction.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <Gavel className="w-12 h-12 text-gray-300" />
                                )}
                                <div className="absolute top-3 left-3 bg-green-600 shadow-md text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-sm">
                                    {auction.type === 'LIVE' ? 'Ao Vivo' : 'Online'}
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`p-5 flex flex-col justify-between 
                                ${viewMode === 'list' ? 'sm:w-2/3' : 'w-full flex-grow'}
                            `}>
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-[11px] font-mono text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-200">Ref: {auction.id.slice(0, 8).toUpperCase()}</div>
                                        {viewMode === 'list' && (
                                            <div className="text-[12px] font-bold text-green-600 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Ativo
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1a2332] mb-2 leading-tight group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                                        {auction.title}
                                    </h3>
                                    <p className={`text-sm text-gray-600 mb-4 ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'}`}>
                                        {auction.summary || 'Leilão com veículos conservados e sucatas.'}
                                    </p>
                                </div>

                                <div className={`space-y-2 mb-4 text-xs font-bold text-gray-700 ${viewMode === 'list' ? 'flex items-center gap-6 space-y-0' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#fcf8e3] p-1.5 rounded"><Calendar className="w-4 h-4 text-[#D4AF37]" /></div>
                                        <span>{auction.startDate?.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#fcf8e3] p-1.5 rounded"><MapPin className="w-4 h-4 text-[#D4AF37]" /></div>
                                        <span className="truncate max-w-[200px]">{auction.visitacaoLocal || 'Auditório Virtual'}</span>
                                    </div>
                                </div>

                                <div className={`pt-4 border-t border-gray-100 ${viewMode === 'list' ? 'flex justify-between items-center' : ''}`}>
                                    {viewMode === 'list' && (
                                        <div className="text-sm text-gray-500 font-medium">
                                            Lotes Ativos: <strong className="text-[#1a2332]">{auction._count?.lots || 0}</strong>
                                        </div>
                                    )}
                                    <Link
                                        href={`/leiloes/${auction.id}`}
                                        className={`bg-[#1a2332] hover:bg-[#D4AF37] text-white py-2.5 px-6 rounded font-bold text-sm text-center transition-all flex items-center justify-center gap-2
                                            ${viewMode === 'grid' ? 'w-full' : ''}
                                        `}
                                    >
                                        <Eye className="w-4 h-4" /> Acessar Catálogo
                                    </Link>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
