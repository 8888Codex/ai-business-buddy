import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import WizardLayout from "@/components/wizard/WizardLayout";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const priceRanges = [
  "Até R$ 100",
  "R$ 100 - 500",
  "R$ 500 - 2k",
  "R$ 2k - 10k",
  "R$ 10k+",
  "Variado",
];

export default function WizardStep2() {
  const { data, updateData } = useWizard();
  const [products, setProducts] = useState(data.products);
  const [priceRange, setPriceRange] = useState(data.priceRange);
  const [differentiator, setDifferentiator] = useState(data.differentiator);

  const handleContinue = () => {
    if (products.trim().length < 20) {
      toast.error("Descreva seus produtos com pelo menos 20 caracteres");
      return false;
    }
    if (!priceRange) {
      toast.error("Selecione a faixa de preço");
      return false;
    }
    updateData({ products: products.trim(), priceRange, differentiator: differentiator.trim() });
    return true;
  };

  return (
    <WizardLayout
      step={2}
      title="O Que Você Oferece"
      subtitle="Isso ajuda seu agente a falar com propriedade sobre seu negócio"
      onContinue={handleContinue}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            Produtos ou Serviços
          </Label>
          <Textarea
            placeholder={"Descreva seus principais produtos ou serviços.\n\nEx: Apartamentos de 2 e 3 quartos na região sul, a partir de R$ 280 mil. Condomínio com piscina, academia e playground."}
            value={products}
            onChange={(e) => setProducts(e.target.value.slice(0, 500))}
            className="min-h-[120px] rounded-xl"
          />
          <p className="text-xs text-slate-400 text-right">
            {products.length}/500
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            Faixa de Preço
          </Label>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Selecione a faixa de preço" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              Diferencial
            </Label>
            <span className="bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 text-xs">
              Opcional
            </span>
          </div>
          <Textarea
            placeholder="O que te diferencia? Ex: 15 anos de mercado, melhor pós-venda da região"
            value={differentiator}
            onChange={(e) => setDifferentiator(e.target.value)}
            className="min-h-[60px] rounded-xl"
          />
        </div>
      </div>
    </WizardLayout>
  );
}
