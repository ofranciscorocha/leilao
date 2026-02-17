'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, User, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react'

export function Navbar() {
    return (
        <header className="w-full">
            {/* Top Bar (Socials & Login) */}
            <div className="bg-[#0f172a] text-white py-2 border-b border-gray-800">
                <div className="container flex justify-end items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <Link href="#" className="hover:text-blue-400"><Linkedin className="h-4 w-4" /></Link>
                        <Link href="#" className="hover:text-blue-400"><Instagram className="h-4 w-4" /></Link>
                        <Link href="#" className="hover:text-blue-400"><Facebook className="h-4 w-4" /></Link>
                        <Link href="#" className="hover:text-blue-400"><Youtube className="h-4 w-4" /></Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/login" className="hover:text-blue-400 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Login
                        </Link>
                        <span>|</span>
                        <Link href="#" className="hover:text-blue-400">Cadastre-se</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-[#0f172a] text-white py-6">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                        <div className="flex flex-col leading-none">
                            <span className="text-3xl text-yellow-500">Pátio</span>
                            <span className="text-3xl">Rocha</span>
                            <span className="text-[10px] tracking-widest text-gray-400 uppercase">Leilões</span>
                        </div>
                    </Link>

                    {/* Login Box Mockup */}
                    <div className="hidden md:flex items-center gap-2 bg-white/10 p-2 rounded text-xs">
                        <Button variant="secondary" size="sm" className="h-7 text-xs">Cadastre-se</Button>
                        <span className="text-gray-400">ou</span>
                        <div className="flex items-center bg-white text-gray-900 rounded px-2 py-1 gap-2">
                            <User className="h-3 w-3" />
                            <span className="font-semibold">admin</span>
                        </div>
                        <Input type="password" placeholder="Password" className="h-7 w-24 text-xs bg-white text-black border-0" />
                        <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700">Entrar</Button>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-[#1e293b] text-white py-3 border-t border-gray-700">
                <div className="container flex flex-wrap justify-center md:justify-start gap-8 text-sm font-medium uppercase tracking-wide">
                    <Link href="/" className="hover:text-yellow-500 transition-colors">Leilões</Link>
                    <Link href="/about" className="hover:text-yellow-500 transition-colors">Quem Somos</Link>
                    <Link href="/faq" className="hover:text-yellow-500 transition-colors">Como Participar</Link>
                    <Link href="/comitentes" className="hover:text-yellow-500 transition-colors">Área dos Comitentes</Link>
                    <Link href="/docs" className="hover:text-yellow-500 transition-colors">Consulta de Documentos</Link>
                    <Link href="/contact" className="hover:text-yellow-500 transition-colors">Contato</Link>
                </div>
            </div>
        </header>
    )
}
