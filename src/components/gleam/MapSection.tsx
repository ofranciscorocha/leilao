"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Filter, Car, Home, Package } from "lucide-react";

export default function MapSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden border-t border-border">
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="font-heading text-3xl font-extrabold text-foreground mb-3">
              Encontre no Mapa
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore os bens disponíveis para leilão de acordo com a sua localização. Use nossos filtros avançados para refinar a busca.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-shrink-0 w-full md:w-auto"
          >
            {/* Quick Map Filters */}
            <div className="flex flex-wrap gap-2 p-2 bg-white dark:bg-card border border-border rounded-xl shadow-sm">
              <Button variant="default" size="sm" className="bg-[#0a1b3f] hover:bg-[#0a1b3f]/90 text-white rounded-lg">
                Todos
              </Button>
              <Button variant="ghost" size="sm" className="rounded-lg text-foreground hover:bg-muted">
                <Car className="h-4 w-4 mr-2" /> Veículos
              </Button>
              <Button variant="ghost" size="sm" className="rounded-lg text-foreground hover:bg-muted">
                <Home className="h-4 w-4 mr-2" /> Imóveis
              </Button>
            </div>
          </motion.div>
        </div>

        {/* The Map Interface */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-border group"
        >
          {/* Mock Map Background (Using a subtle grid/pattern or placeholder map image) */}
          <div className="absolute inset-0 bg-[#e5e9f0] dark:bg-[#1a2332] opacity-80" />
          <div 
             className="absolute inset-0 opacity-50 dark:opacity-20"
             style={{
                 backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 filter: 'grayscale(100%) blur(1px)'
             }}
          />

          {/* Advanced Search Overlay Inside Map */}
          <div className="absolute top-4 left-4 right-4 md:right-auto md:w-[350px] bg-white/95 dark:bg-[#080c17]/95 backdrop-blur-md rounded-2xl shadow-lg border border-border p-4 z-20">
             <h3 className="font-bold text-foreground mb-3 text-sm flex items-center gap-2">
                 <Filter className="h-4 w-4 text-[#D4AF37]" /> Filtros Avançados
             </h3>
             <div className="space-y-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="text" placeholder="Estado, Cidade ou CEP" className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-lg border-transparent focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-foreground transition-all" />
                 </div>
                 <div className="flex gap-2">
                     <select className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground border-transparent focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none">
                         <option>Qualquer Raio</option>
                         <option>+ 50 km</option>
                         <option>+ 100 km</option>
                     </select>
                     <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0a1b3f]">Buscar</Button>
                 </div>
             </div>
          </div>

          {/* Map Pins (Mock) */}
          <div className="absolute top-[30%] left-[40%] group-hover:scale-110 transition-transform">
             <div className="relative cursor-pointer">
                 <div className="absolute -inset-2 bg-[#D4AF37] rounded-full opacity-20 animate-ping" />
                 <div className="bg-[#0a1b3f] text-white p-2 rounded-full shadow-lg relative z-10 border-2 border-white">
                     <Car className="h-4 w-4 text-[#D4AF37]" />
                 </div>
             </div>
          </div>

          <div className="absolute top-[50%] left-[60%] group-hover:scale-110 transition-transform delay-75">
             <div className="relative cursor-pointer">
                 <div className="absolute -inset-2 bg-blue-500 rounded-full opacity-20 animate-ping" />
                 <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg relative z-10 border-2 border-white">
                     <Home className="h-4 w-4" />
                 </div>
             </div>
          </div>

          <div className="absolute top-[20%] left-[70%] group-hover:scale-110 transition-transform delay-150">
             <div className="relative cursor-pointer">
                 <div className="absolute -inset-2 bg-purple-500 rounded-full opacity-20 animate-ping" />
                 <div className="bg-purple-600 text-white p-2 rounded-full shadow-lg relative z-10 border-2 border-white">
                     <Package className="h-4 w-4" />
                 </div>
             </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
