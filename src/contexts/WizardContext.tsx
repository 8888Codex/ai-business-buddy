import React, { createContext, useContext, useState, ReactNode } from "react";

export interface WizardData {
  // Step 1
  companyName: string;
  segment: string;
  openTime: string;
  closeTime: string;
  // Step 2
  products: string;
  priceRange: string;
  differentiator: string;
  // Step 3
  tone: string;
  agentName: string;
  // Step 4
  objectives: string[];
  hotLeadAction: string;
  // Step 5
  faqs: string;
  restrictions: string;
  extras: string;
  // Step 6
  generatedPrompt: string;
  isPromptCustomized: boolean;
}

const defaultData: WizardData = {
  companyName: "",
  segment: "",
  openTime: "08:00",
  closeTime: "18:00",
  products: "",
  priceRange: "",
  differentiator: "",
  tone: "",
  agentName: "",
  objectives: [],
  hotLeadAction: "",
  faqs: "",
  restrictions: "",
  extras: "",
  generatedPrompt: "",
  isPromptCustomized: false,
};

interface WizardContextType {
  data: WizardData;
  updateData: (partial: Partial<WizardData>) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WizardData>(defaultData);

  const updateData = (partial: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  return (
    <WizardContext.Provider value={{ data, updateData }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
