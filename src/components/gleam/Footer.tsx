'use client';
import { Gavel, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12" id="contato">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              Plataforma líder em leilões online. Segurança, transparência e as melhores oportunidades.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold text-foreground">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/lotes" className="hover:text-foreground transition-colors">Leilões Ativos</Link></li>
              <li><a href="#como-participar" className="hover:text-foreground transition-colors">Como Participar</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold text-foreground">Categorias</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/lotes?categoria=imoveis" className="hover:text-foreground transition-colors">Imóveis</Link></li>
              <li><Link href="/lotes?categoria=veiculos" className="hover:text-foreground transition-colors">Veículos</Link></li>
              <li><Link href="/lotes?categoria=judiciais" className="hover:text-foreground transition-colors">Judiciais</Link></li>
              <li><Link href="/lotes?categoria=diversos" className="hover:text-foreground transition-colors">Diversos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold text-foreground">Contato</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                contato@patiorochaleiloes.com.br
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                (11) 99999-0000
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                São Paulo, SP
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 Pátio Rocha Leilões. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
