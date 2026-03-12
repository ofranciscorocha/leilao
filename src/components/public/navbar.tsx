'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, Instagram, Facebook, Youtube, Linkedin } from "lucide-react"

export function Navbar() {
    return (
        <header className="w-full flex flex-col">
            {/* Top Bar - Subtle & Professional */}
            <div className="bg-[#080c17]/95 backdrop-blur-md text-white/60 py-2.5 border-b border-white/5">
                <div className="container flex justify-between items-center text-[11px] font-medium tracking-wide">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                            Próximo Leilão: <strong className="text-secondary">20 de Março, 14:00</strong>
                        </span>
                        <div className="hidden sm:flex items-center gap-4 border-l border-white/10 pl-6">
                            <Link href="#" className="hover:text-secondary transition-colors uppercase">Editais</Link>
                            <Link href="#" className="hover:text-secondary transition-colors uppercase">Resultados</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <Link href="#" className="hover:text-secondary transition-colors"><Linkedin className="h-3.5 w-3.5" /></Link>
                            <Link href="#" className="hover:text-secondary transition-colors"><Instagram className="h-3.5 w-3.5" /></Link>
                            <Link href="#" className="hover:text-secondary transition-colors"><Facebook className="h-3.5 w-3.5" /></Link>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <Link href="/admin/login" className="flex items-center gap-2 hover:text-white transition-colors group">
                            <User className="h-3.5 w-3.5 text-secondary group-hover:scale-110 transition-transform" />
                            ÁREA RESTRITA
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Branding & Navigation Area */}
            <div className="bg-[#080c17] text-white py-6 shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none" />
                
                <div className="container flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Logo Section */}
                    <Link href="/" className="group flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-[#c9a05b] rounded-xl rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center shadow-lg shadow-secondary/20">
                                <span className="text-2xl font-black text-[#080c17] -rotate-3 group-hover:-rotate-6 transition-transform">PR</span>
                            </div>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black tracking-tighter text-white">
                                PÁTIO <span className="text-secondary italic">ROCHA</span>
                            </span>
                            <span className="text-[9px] tracking-[0.4em] font-bold text-white/40 uppercase mt-1">
                                Excelência em Leilões
                            </span>
                        </div>
                    </Link>

                    {/* Navigation - Elegant Desktop Menu */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {[
                            { label: 'Leilões', href: '/' },
                            { label: 'Lotes', href: '/search' },
                            { label: 'Como Comprar', href: '/faq' },
                            { label: 'Comitentes', href: '/comitentes' },
                            { label: 'Contato', href: '/contact' },
                        ].map((item) => (
                            <Link 
                                key={item.label}
                                href={item.href} 
                                className="relative text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors group py-1"
                            >
                                {item.label}
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-secondary group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <div className="hidden xl:flex relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-secondary transition-colors" />
                            <Input 
                                placeholder="Buscar veículo ou edital..." 
                                className="h-11 w-64 pl-10 bg-white/5 border-white/10 text-xs focus:bg-white/10 focus:ring-secondary/50 rounded-full"
                            />
                        </div>
                        <Button className="bg-secondary hover:bg-secondary/90 text-[#080c17] font-bold rounded-full px-8 h-11 shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                            CADASTRAR-SE
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sub-nav / Utility Bar - Mobile Optimized */}
            <div className="lg:hidden bg-[#080c17]/90 border-t border-white/5 py-3">
                <div className="container flex justify-around overflow-x-auto no-scrollbar gap-6 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    <Link href="/" className="whitespace-nowrap hover:text-secondary">Leilões</Link>
                    <Link href="/search" className="whitespace-nowrap hover:text-secondary">Lotes</Link>
                    <Link href="/faq" className="whitespace-nowrap hover:text-secondary">Ajuda</Link>
                    <Link href="/contact" className="whitespace-nowrap hover:text-secondary">Contato</Link>
                </div>
            </div>
        </header>
    )
}
