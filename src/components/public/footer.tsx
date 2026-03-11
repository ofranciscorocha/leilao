export function Footer() {
    return (
        <footer className="bg-[#080c17] text-white pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-secondary/20 to-transparent" />
            
            <div className="container relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tighter text-white">
                                PÁTIO <span className="text-secondary italic">ROCHA</span>
                            </span>
                            <span className="text-[10px] tracking-[0.4em] font-bold text-white/40 uppercase mt-1">
                                Excelência em Leilões
                            </span>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed font-medium">
                            Líder regional em leilões de veículos de frotas e retomados de financiamento, com transparência e segurança jurídica total.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-secondary hover:text-primary transition-all duration-300">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-secondary hover:text-primary transition-all duration-300">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-secondary hover:text-primary transition-all duration-300">
                                <Facebook className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-8">Navegação</h4>
                        <ul className="space-y-4">
                            {['Próximos Leilões', 'Lotes Disponíveis', 'Como Comprar', 'Habilitações', 'Resultados'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-bold text-white/60 hover:text-white transition-colors flex items-center group">
                                        <div className="w-1.5 h-[2px] bg-secondary mr-0 group-hover:mr-3 w-0 group-hover:w-1.5 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-8">Atendimento</h4>
                        <ul className="space-y-6 text-sm font-bold text-white/60">
                            <li className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                                <span>Av. Gov. Adhemar de Barros, 1234<br /><span className="text-xs font-medium text-white/30 italic">São José do Rio Preto - SP</span></span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail className="h-5 w-5 text-secondary shrink-0" />
                                <span>contato@patiorocha.com.br</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="h-5 w-5 text-secondary shrink-0" />
                                <span className="text-lg font-black text-white">(17) 3212-9000</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4">Informativo</h4>
                        <p className="text-xs text-white/40 mb-6 font-medium leading-relaxed italic">
                            Receba alertas de novos editais e leilões exclusivos em primeira mão.
                        </p>
                        <div className="space-y-3">
                            <input 
                                className="w-full bg-[#0c1322] border-white/10 rounded-xl px-4 py-3 text-xs font-medium focus:ring-1 ring-secondary outline-none" 
                                placeholder="Seu melhor e-mail..."
                            />
                            <Button className="w-full bg-secondary text-primary font-black uppercase tracking-widest text-[10px] h-11 hover:bg-secondary/90 shadow-lg shadow-secondary/10">
                                INSCREVER-SE
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} Pátio Rocha Leilões • Gestão Avançada de Ativos
                    </div>
                    <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-white/30">
                        <Link href="#" className="hover:text-secondary transition-colors">Termos de Uso</Link>
                        <Link href="#" className="hover:text-secondary transition-colors">Privacidade</Link>
                        <div className="flex items-center gap-2">
                            Desenvolvido por <span className="text-white/60">Arremate Club</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

import Link from 'next/link'
import { Instagram, Facebook, Linkedin, MapPin, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
