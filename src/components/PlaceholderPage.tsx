import { Badge } from "@/components/ui/badge";

interface PlaceholderPageProps {
  title: string;
  description: string;
  step?: string;
}

export function PlaceholderPage({ title, description, step }: PlaceholderPageProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {step && <Badge variant="secondary">{step}</Badge>}
      </div>
      <p className="text-muted-foreground">{description}</p>
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center text-muted-foreground">
        Conteúdo será implementado em breve.
      </div>
    </div>
  );
}
