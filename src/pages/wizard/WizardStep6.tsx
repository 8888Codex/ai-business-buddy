import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "@/contexts/WizardContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Pencil, Save, MessageCircle, ArrowLeft, Check } from "lucide-react";

const stepLabels = ["Negócio", "Produtos", "Personalidade", "Missão", "Regras", "Pronto!"];

function generatePrompt(data: any): string {
  const toneMap: Record<string, string> = {
    formal: "formal e respeitoso",
    friendly: "amigável e acolhedor",
    technical: "técnico e objetivo",
    persuasive: "persuasivo e orientado a resultados",
  };

  const objMap: Record<string, string> = {
    sell: "vender",
    support: "atender clientes",
    schedule: "agendar compromissos",
    qualify: "qualificar leads",
  };

  let prompt = `Você é ${data.agentName}, assistente virtual da ${data.companyName} (segmento: ${data.segment}).`;
  prompt += `\nHorário de atendimento: ${data.openTime} às ${data.closeTime}.`;
  prompt += `\n\nTom de voz: ${toneMap[data.tone] || data.tone}.`;
  prompt += `\n\nProdutos/Serviços: ${data.products}`;
  if (data.priceRange) prompt += `\nFaixa de preço: ${data.priceRange}.`;
  if (data.differentiator) prompt += `\nDiferencial: ${data.differentiator}`;
  prompt += `\n\nObjetivos: ${data.objectives.map((o: string) => objMap[o] || o).join(", ")}.`;
  prompt += `\nAção para lead quente: ${data.hotLeadAction}.`;
  if (data.faqs) prompt += `\n\nFAQ:\n${data.faqs}`;
  if (data.restrictions) prompt += `\n\nRestrições:\n${data.restrictions}`;
  if (data.extras) prompt += `\n\nInformações extras:\n${data.extras}`;
  return prompt;
}

export default function WizardStep6() {
  const navigate = useNavigate();
  const { data, updateData } = useWizard();
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState(data.generatedPrompt);

  useEffect(() => {
    if (!data.generatedPrompt) {
      const generated = generatePrompt(data);
      setPrompt(generated);
      updateData({ generatedPrompt: generated });
    }
  }, []);

  const handleSavePrompt = () => {
    updateData({ generatedPrompt: prompt, isPromptCustomized: true });
    setIsEditing(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col animate-fade-in">
      {/* Progress indicator */}
      <div className="w-full max-w-2xl mx-auto px-4 pt-8 pb-2">
        <div className="flex items-center justify-between relative">
          {stepLabels.map((_, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold bg-indigo-500 text-white shrink-0">
                {i < 5 ? <Check className="w-4 h-4" /> : 6}
              </div>
              {i < 5 && (
                <div className="flex-1 h-0.5 mx-1 bg-indigo-500" />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm font-medium text-slate-600 text-center mt-4">
          Passo 6 de 6 — Pronto!
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
          {/* Celebration */}
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-indigo-500 mx-auto animate-pulse mb-4" />
            <h1 className="text-2xl font-bold text-slate-900">
              Seu Funcionário de IA está pronto!
            </h1>
            <p className="text-slate-500 mt-1">
              Revise o prompt e conecte seu WhatsApp
            </p>
          </div>

          {/* Prompt preview */}
          <div className="relative bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                Prompt do Agente
              </span>
              <div className="flex items-center gap-2">
                {data.isPromptCustomized && (
                  <span className="bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 text-xs">
                    ✏️ Personalizado
                  </span>
                )}
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSavePrompt}
                    className="text-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] rounded-xl border-indigo-300 focus:border-indigo-500"
              />
            ) : (
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed max-h-[300px] overflow-y-auto">
                {prompt}
              </pre>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/connect")}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-8 py-6 rounded-xl shadow-md text-base font-semibold gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Conectar WhatsApp
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="w-full text-slate-500"
            >
              Salvar e conectar depois
            </Button>
          </div>

          {/* Back */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <Button
              variant="ghost"
              onClick={() => navigate("/wizard/step-5")}
              className="gap-1 text-slate-500"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
