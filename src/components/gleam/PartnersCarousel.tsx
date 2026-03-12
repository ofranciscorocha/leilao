"use client"

import { motion } from "framer-motion"

// Mock partners data
const partners = [
  { name: "Banco do Brasil", type: "Banco", color: "bg-blue-600 text-yellow-400" },
  { name: "Caixa Econômica", type: "Banco", color: "bg-orange-600 text-white" },
  { name: "Porto Seguro", type: "Seguradora", color: "bg-blue-800 text-white" },
  { name: "Assurant", type: "Seguradora", color: "bg-black text-white" },
  { name: "Localiza Seminovos", type: "Empresa", color: "bg-green-600 text-white" },
  { name: "Detran SP", type: "Órgão Público", color: "bg-gray-800 text-white" },
  { name: "Bradesco", type: "Banco", color: "bg-red-600 text-white" },
  { name: "Itaú", type: "Banco", color: "bg-[#ec7000] text-blue-900" },
  { name: "Polícia Federal", type: "Órgão Público", color: "bg-yellow-500 text-black" },
]

export default function PartnersCarousel() {
  return (
    <section className="py-16 bg-card border-t border-border overflow-hidden">
      <div className="container mb-8 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl mb-2">
          Nossos Parceiros Oficiais
        </h2>
        <p className="text-muted-foreground">
          Trabalhamos com as maiores empresas, bancos, seguradoras e órgãos públicos do Brasil.
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        {/* Carousel Container */}
        <div className="flex w-full overflow-hidden">
          <motion.div 
            className="flex w-max shrink-0 gap-8 py-4 px-4 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* Render two sets of partners for seamless looping */}
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={index}
                className="group relative flex h-24 w-64 items-center justify-center rounded-xl border border-border bg-background shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-10 ${partner.color}`} />
                <div className="text-center p-2">
                  <h3 className="font-bold text-foreground text-lg group-hover:text-[#D4AF37] transition-colors">{partner.name}</h3>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">{partner.type}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient fades on left and right */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-card to-transparent" />
      </div>
    </section>
  )
}
