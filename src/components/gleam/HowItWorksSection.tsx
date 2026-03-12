'use client';
import { Shield, Clock, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Transações protegidas e auditadas com total transparência jurídica.",
  },
  {
    icon: Clock,
    title: "Lances em Tempo Real",
    description: "Acompanhe e dê lances instantâneos com atualização ao vivo.",
  },
  {
    icon: Users,
    title: "Suporte Especializado",
    description: "Equipe de especialistas pronta para ajudar em cada etapa.",
  },
  {
    icon: TrendingUp,
    title: "Abaixo do Mercado",
    description: "Economize de verdade com oportunidades exclusivas de leilão.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16" id="como-participar">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Por que nos escolher?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Confiança e praticidade em cada lance
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <feat.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1.5 font-heading text-base font-semibold text-foreground">
                {feat.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
