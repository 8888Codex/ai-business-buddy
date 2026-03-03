import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "@/contexts/WizardContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { PartyPopper, MessageCircle, Pencil, ArrowLeft } from "lucide-react";

const toneLabels: Record<string, string> = {
  formal: "formal e respeitosa",
  friendly: "amigável e descontraída",
  technical: "técnica e precisa",
  persuasive: "persuasiva e orientada a vendas",
};

const objectiveLabels: Record<string, string> = {
  sell: "conduzir o cliente para a venda",
  support: "atender dúvidas e resolver problemas",
  schedule: "agendar reuniões, consultas ou visitas",
  qualify: "identificar e qualificar leads promissores",
};

function generatePrompt(data: ReturnType<typeof useWizard>["data"]): string {
  const lines: string[] = [];
  lines.push(`Você é ${data.agentName}, assistente virtual da empresa ${data.companyName} (segmento: ${data.segment}).`);
  lines.push(`Horário de atendimento: ${data.openTime} às ${data.closeTime}.`);
  lines.push("");
  lines.push(`Produtos/serviços: ${data.products}`);
  if (data.differentiator) lines.push(`Diferencial: ${data.differentiator}`);
  lines.push(`Faixa de preço: ${data.priceRange}`);
  lines.push("");
  lines.push(`Use uma linguagem ${toneLabels[data.tone] || data.tone}.`);
  lines.push("");
  if (data.objectives.length > 0) {
    lines.push("Seus objetivos principais são:");
    data.objectives.forEach((o) => {
      lines.push(`- ${objectiveLabels[o] || o}`);
    });
    lines.push("");
  }
  if (data.hotLeadAction) {
    lines.push(`Quando identificar um lead quente: ${data.hotLeadAction}.`);
    lines.push("");
  }
  if (data.faqs) {
    lines.push("Perguntas frequentes:");
    lines.push(data.faqs);
    lines.push("");
  }
  if (data.restrictions) {
    lines.push("NUNCA faça o seguinte:");
    lines.push(data.restrictions);
    lines.push("");
  }
  if (data.extras) {
    lines.push("Informações adicionais:");
    lines.push(data.extras);
  }
  return lines.join("\n").trim();
}

export default function WizardStep6() {
  const navigate = useNavigate();
  const { data, updateData } = useWizard();
  const defaultPrompt = useMemo(() => generatePrompt(data), [data]);
  const [prompt, setPrompt] = useState(data.generatedPrompt || defaultPrompt);
  const [editing, setEditing] = useState(false);
  const [customized, setCustomized] = useState(data.isPromptCustomized);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
    if (prompt !== defaultPrompt) {
      setCustomized(true);
    }
    updateData({ generatedPrompt: prompt, isPromptCustomized: prompt !== defaultPrompt });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      <div className="w-full max-w-2xl mx-auto px-4 pt-6 pb-2">
        <Progress value={100} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">Passo 6 de 6 — Seu Agente Está Pronto!</p>
      </div>

      <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <PartyPopper className="h-12 w-12 mx-auto text-indigo-500" />
          <h1 className="text-2xl font-bold">Seu Funcionário de IA está pronto!</h1>
          <p className="text-muted-foreground">Revise o prompt gerado e conecte seu WhatsApp</p>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">System Prompt</span>
              <div className="flex items-center gap-2">
                {customized && <Badge variant="secondary">Prompt personalizado</Badge>}
                {!editing ? (
                  <Button size="sm" variant="ghost" onClick={handleEdit} className="gap-1">
                    <Pencil className="h-3 w-3" /> Editar
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={handleSave}>
                    Salvar
                  </Button>
                )}
              </div>
            </div>
            {editing ? (
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[250px] text-sm font-mono"
              />
            ) : (
              <pre className="whitespace-pre-wrap text-sm bg-muted/50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                {prompt}
              </pre>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full gap-2 bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={() => {
              updateData({ generatedPrompt: prompt, isPromptCustomized: customized });
              navigate("/connect");
            }}
          >
            <MessageCircle className="h-5 w-5" /> Conectar WhatsApp →
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              updateData({ generatedPrompt: prompt, isPromptCustomized: customized });
              navigate("/dashboard");
            }}
          >
            Salvar e conectar depois
          </Button>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 pb-8">
        <Button variant="ghost" onClick={() => navigate("/wizard/step-5")} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
      </div>
    </div>
  );
}
