'use client';
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import heroBg from "@/assets/hero-light.jpg"; // Replaced with static path

const stats = [
  { value: "789", label: "Lotes Ativos" },
  { value: "15.200+", label: "Usuários Cadastrados" },
  { value: "R$ 2,5 Bi", label: "Em Negócios Realizados" },
];

const HeroSection = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/lotes?busca=${encodeURIComponent(search)}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="/assets/banner-patio.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#1a2332]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/40 via-transparent to-[#1a2332]/60" />
      </div>

      <div className="container relative z-10 py-20 lg:py-28 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="mb-5 inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              Leilões acontecendo agora
            </div>

            <h1 className="mb-5 font-heading text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-[3.5rem] text-center">
              Arremate com segurança
              <br />
              <span className="text-[#D4AF37]">e transparência</span>
            </h1>

            <p className="mb-8 max-w-lg text-base text-white/70 lg:text-lg text-center">
              Imóveis, veículos e bens diversos com preços abaixo do mercado.
              Plataforma confiável, regulamentada e com suporte completo.
            </p>
          </motion.div>

          {/* Search */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10 flex w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-lg mx-auto"
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por tipo, cidade ou valor..."
              className="flex-1 border-0 bg-transparent px-5 py-6 focus-visible:ring-0"
            />
            <Button type="submit" className="m-1.5 rounded-lg px-6">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </motion.form>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 lg:gap-12"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl font-extrabold text-white lg:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
