'use client';
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LotCardProps {
  id: string | number;
  title: string;
  location: string;
  startingBid: string;
  currentBid?: string;
  imageUrl: string;
  status: "aberto" | "em-breve" | "encerrado";
  endsIn?: string;
  category: string;
  viewMode?: "grid" | "list";
}

const statusStyles = {
  aberto: "bg-success/10 text-success border-success/20",
  "em-breve": "bg-warning/10 text-warning border-warning/20",
  encerrado: "bg-muted text-muted-foreground border-border",
};

const statusLabels = {
  aberto: "Aberto para Lances",
  "em-breve": "Em Breve",
  encerrado: "Encerrado",
};

const LotCard = ({ id, title, location, startingBid, currentBid, imageUrl, status, endsIn, category, viewMode = "grid" }: LotCardProps) => {
  if (viewMode === "list") {
    return (
      <Link
        href={`/lote/${id}`}
        className="group flex gap-4 overflow-hidden rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-md"
      >
        <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          <Badge variant="outline" className={`absolute left-2 top-2 text-[10px] ${statusStyles[status]}`}>
            {statusLabels[status]}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{category}</span>
            <h3 className="line-clamp-1 font-heading text-sm font-semibold text-foreground">{title}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {location}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground">Lance Inicial</span>
              <p className="font-heading text-sm font-bold text-foreground">{startingBid}</p>
            </div>
            {currentBid && (
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground">Lance Atual</span>
                <p className="font-heading text-sm font-bold text-primary">{currentBid}</p>
              </div>
            )}
            {endsIn && status === "aberto" && (
              <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {endsIn}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/lote/${id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-2.5 top-2.5 flex gap-2">
          <Badge variant="outline" className={`text-[10px] ${statusStyles[status]}`}>
            {statusLabels[status]}
          </Badge>
        </div>
        {endsIn && status === "aberto" && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md bg-card/90 px-2 py-1 text-xs text-foreground backdrop-blur-sm">
            <Clock className="h-3 w-3 text-primary" /> {endsIn}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{category}</span>
        <h3 className="mb-1.5 line-clamp-2 font-heading text-sm font-semibold text-foreground">{title}</h3>
        <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {location}
        </div>
        <div className="mt-auto space-y-1.5 border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Lance Inicial</span>
            <span className="font-heading text-sm font-bold text-foreground">{startingBid}</span>
          </div>
          {currentBid && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Lance Atual</span>
              <span className="font-heading text-sm font-bold text-primary">{currentBid}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LotCard;
