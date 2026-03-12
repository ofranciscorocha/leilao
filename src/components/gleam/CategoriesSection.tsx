'use client';
import { Home, Car, Bike, Package, Scale, Truck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  { icon: Home, label: "Imóveis", count: 67, slug: "imoveis", color: "bg-blue-50 text-blue-600" },
  { icon: Car, label: "Veículos", count: 109, slug: "veiculos", color: "bg-emerald-50 text-emerald-600" },
  { icon: Bike, label: "Motos", count: 45, slug: "motos", color: "bg-orange-50 text-orange-600" },
  { icon: Truck, label: "Pesados", count: 12, slug: "pesados", color: "bg-purple-50 text-purple-600" },
  { icon: Scale, label: "Judiciais", count: 34, slug: "judiciais", color: "bg-rose-50 text-rose-600" },
  { icon: Package, label: "Diversos", count: 21, slug: "diversos", color: "bg-amber-50 text-amber-600" },
];

const CategoriesSection = () => {
  return (
    <section className="py-8">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 flex items-end justify-between"
        >
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl uppercase tracking-tight">
              Categorias <span className="text-primary">Principais</span>
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Encontre o lote ideal por categoria
            </p>
          </div>
          <Link
            href="/lotes"
            className="hidden items-center gap-1 text-xs font-bold text-primary hover:underline sm:flex uppercase tracking-widest"
          >
            Ver catálogo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/lotes?categoria=${cat.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.color} transition-transform group-hover:scale-105`}>
                  <cat.icon className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <div className="text-[13px] font-bold text-foreground leading-none">{cat.label}</div>
                  <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase opacity-60">
                    {cat.count} Itens
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
