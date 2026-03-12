'use client';
import LotCard from "./LotCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Car, Home, Package, Search, Filter } from "lucide-react";
import Link from "next/link";

const featuredLots = [
  {
    id: 1,
    title: "Casa de Luxo com Piscina e Área Gourmet Completa",
    location: "Gramado, RS",
    startingBid: "R$ 1.680.000",
    currentBid: "R$ 1.850.000",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    status: "aberto" as const,
    endsIn: "2d 14h",
    category: "Imóvel",
  },
  {
    id: 2,
    title: "BMW X5 xDrive 2023 - Blindada Nível III-A",
    location: "São Paulo, SP",
    startingBid: "R$ 320.000",
    currentBid: "R$ 385.000",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
    status: "aberto" as const,
    endsIn: "1d 8h",
    category: "Veículo",
  },
  {
    id: 3,
    title: "Apartamento Frente Mar - 4 Suítes Decorado",
    location: "Salvador, BA",
    startingBid: "R$ 2.250.000",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    status: "em-breve" as const,
    category: "Imóvel",
  },
  {
    id: 4,
    title: "Fazenda 120 Hectares - Produtiva com Irrigação",
    location: "Rio Verde, GO",
    startingBid: "R$ 5.460.000",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    status: "em-breve" as const,
    category: "Imóvel Rural",
  },
  {
    id: 5,
    title: "Mercedes-Benz Sprinter 2024 - 0km",
    location: "Curitiba, PR",
    startingBid: "R$ 180.000",
    currentBid: "R$ 195.000",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
    status: "aberto" as const,
    endsIn: "5h 30m",
    category: "Veículo",
  },
  {
    id: 6,
    title: "Lote de Equipamentos Industriais CNC",
    location: "Manaus, AM",
    startingBid: "R$ 45.000",
    currentBid: "R$ 52.000",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
    status: "aberto" as const,
    endsIn: "3d 2h",
    category: "Diversos",
  },
];

const FeaturedLotsSection = ({ serverLots }: { serverLots?: any[] }) => {
  const displayLots = serverLots && serverLots.length > 0 ? serverLots : featuredLots;

  return (
    <section className="border-t border-border bg-muted/30 py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-end justify-between"
        >
          <div className="flex-1">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Lotes em Destaque
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Oportunidades selecionadas com os melhores preços
            </p>
          </div>
        </motion.div>

        {/* Filters Section */}
        <div className="mb-8 p-4 bg-white dark:bg-card border border-border rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button variant="default" className="bg-[#0a1b3f] text-white hover:bg-[#0a1b3f]/90 text-xs md:text-sm">
                Todos
              </Button>
              <Button variant="outline" className="text-xs md:text-sm gap-2">
                <Car className="h-4 w-4" /> Veículos
              </Button>
              <Button variant="outline" className="text-xs md:text-sm gap-2">
                <Home className="h-4 w-4" /> Imóveis
              </Button>
              <Button variant="outline" className="text-xs md:text-sm gap-2">
                <Package className="h-4 w-4" /> Diversos
              </Button>
            </div>

            {/* General Filters */}
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Pesquisar lotes..." 
                  className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 pl-9 focus:outline-none focus:ring-1 focus:ring-ring" 
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayLots.map((lot, i) => {
            const mappedLot = lot.startingPrice !== undefined ? {
              id: lot.id,
              title: lot.title,
              location: lot.location || 'Localização não informada',
              startingBid: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lot.startingPrice),
              currentBid: lot.currentBid ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lot.currentBid) : undefined,
              imageUrl: lot.imageUrl || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
              status: lot.status === 'OPEN' ? 'aberto' : lot.status === 'PENDING' ? 'em-breve' : 'encerrado',
              category: lot.category || 'Veículo',
            } : lot;

            return (
              <motion.div
                key={lot.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <LotCard {...mappedLot} />
              </motion.div>
            )
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/lotes">
            <Button size="lg" className="bg-[#0a1b3f] hover:bg-[#0a1b3f]/90 text-white font-semibold flex items-center gap-2 px-8">
              Mostrar Mais Lotes <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLotsSection;
