'use client';
import { Home, Car, Bike, Package, Scale, Truck, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const categories = [
  { id: "imoveis", label: "Imóveis", icon: Home, count: 67 },
  { id: "veiculos", label: "Veículos", icon: Car, count: 109 },
  { id: "motos", label: "Motos", icon: Bike, count: 45 },
  { id: "pesados", label: "Pesados", icon: Truck, count: 12 },
  { id: "judiciais", label: "Judiciais", icon: Scale, count: 34 },
  { id: "diversos", label: "Diversos", icon: Package, count: 21 },
];

const states = [
  "Todos", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const statusOptions = [
  { id: "aberto", label: "Aberto para Lances" },
  { id: "em-breve", label: "Em Breve" },
  { id: "encerrado", label: "Encerrado" },
];

interface LotFiltersProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  city: string;
  onCityChange: (city: string) => void;
  onClearAll: () => void;
  className?: string;
}

const formatPrice = (value: number) => {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}K`;
  return `R$ ${value}`;
};

const LotFilters = ({
  selectedCategories,
  onCategoryChange,
  selectedStatuses,
  onStatusChange,
  priceRange,
  onPriceRangeChange,
  selectedState,
  onStateChange,
  city,
  onCityChange,
  onClearAll,
  className = "",
}: LotFiltersProps) => {
  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      onCategoryChange(selectedCategories.filter((c) => c !== id));
    } else {
      onCategoryChange([...selectedCategories, id]);
    }
  };

  const toggleStatus = (id: string) => {
    if (selectedStatuses.includes(id)) {
      onStatusChange(selectedStatuses.filter((s) => s !== id));
    } else {
      onStatusChange([...selectedStatuses, id]);
    }
  };

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000000 ||
    selectedState !== "Todos" ||
    city !== "";

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-foreground">Filtros</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-destructive">
            <X className="mr-1 h-3 w-3" /> Limpar
          </Button>
        )}
      </div>

      <Separator />

      {/* Category */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">Categoria</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
            >
              <Checkbox
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              <cat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm text-foreground">{cat.label}</span>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Status */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">Status</h4>
        <div className="space-y-2">
          {statusOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
            >
              <Checkbox
                checked={selectedStatuses.includes(opt.id)}
                onCheckedChange={() => toggleStatus(opt.id)}
              />
              <span className="text-sm text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">Faixa de Preço</h4>
        <Slider
          min={0}
          max={10000000}
          step={50000}
          value={priceRange}
          onValueChange={(v) => onPriceRangeChange(v as [number, number])}
          className="mb-3"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">Localização</h4>
        <div className="space-y-2">
          <Select value={selectedState} onValueChange={onStateChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {states.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Cidade"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default LotFilters;
