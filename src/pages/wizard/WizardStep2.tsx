import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import WizardLayout from "@/components/wizard/WizardLayout";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const priceRanges = [
  "Até R$ 100",
  "R$ 100 a R$ 500",
  "R$ 500 a R$ 2.000",
  "R$ 2.000 a R$ 10.000",
  "Acima de R$ 10.000",
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
    <WizardLayout step={2} title="O Que Você Vende" onContinue={handleContinue}>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Produtos ou serviços principais *</Label>
          <Textarea
            placeholder="Descreva seus principais produtos ou serviços. Ex: Apartamentos de 2 e 3 quartos na região sul, a partir de R$ 280 mil..."
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground text-right">
            {products.length} caracteres {products.length < 20 && "(mínimo 20)"}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Faixa de preço *</Label>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
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
          <Label>Diferencial <span className="text-muted-foreground font-normal">(opcional)</span></Label>
          <Textarea
            placeholder="O que te diferencia da concorrência?"
            value={differentiator}
            onChange={(e) => setDifferentiator(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </div>
    </WizardLayout>
  );
}
