'use client';
import { useState } from "react";
import { Search, Menu, X, User, Gavel, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/gleam/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShoppingCart } from "lucide-react";

const navLinks = [
  {
    label: "Leilões",
    href: "/lotes",
    children: [
      { label: "Todos os Lotes", href: "/lotes" },
      { label: "Imóveis", href: "/lotes?categoria=imoveis" },
      { label: "Veículos", href: "/lotes?categoria=veiculos" },
      { label: "Motos", href: "/lotes?categoria=motos" },
      { label: "Diversos", href: "/lotes?categoria=diversos" },
    ],
  },
  { label: "Agenda", href: "/lotes" },
  { label: "Como Participar", href: "#como-participar" },
  { label: "Quem Somos", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-[#0a1b3f]/95 dark:bg-background/95 backdrop-blur-xl transition-colors">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5 text-white/60" />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-white/10 bg-[#1a2332] py-1 shadow-lg"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-blue-400"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-blue-400"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="outline" size="sm" asChild className="text-foreground">
                <Link href="/my-account/purchases" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Minhas Compras
                </Link>
              </Button>
              <span className="text-sm text-white/60 dark:text-muted-foreground truncate max-w-[150px]">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-white hover:text-white/80 dark:text-foreground">
                <LogOut className="mr-1.5 h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" asChild className="bg-[#D4AF37] text-[#0a1b3f] hover:bg-[#D4AF37]/90">
                <Link href="/auth">Cadastre-se</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="text-white dark:text-foreground lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 bg-[#080c17] lg:hidden"
          >
            <div className="container flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10 hover:text-[#D4AF37]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="ml-4 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-[#D4AF37]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-3 flex gap-2 border-t border-white/10 dark:border-border pt-3">
                <ThemeToggle />
                {user ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 text-foreground" asChild>
                      <Link href="/my-account/purchases" onClick={() => setMobileOpen(false)}>
                        <ShoppingCart className="mr-1.5 h-4 w-4" />Minhas Compras
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-foreground" onClick={() => { signOut(); setMobileOpen(false); }}>
                      <LogOut className="mr-1.5 h-4 w-4" />Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" className="flex-1 bg-[#D4AF37] text-[#0a1b3f] hover:bg-[#D4AF37]/90" asChild>
                      <Link href="/auth" onClick={() => setMobileOpen(false)}>Cadastre-se</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
