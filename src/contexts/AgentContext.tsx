import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { getAgents, getWhatsAppStatus } from "@/services/api";

interface CurrentAgent {
  id: string;
  name: string;
  type: string;
  status: string;
  system_prompt: string | null;
  whatsapp_connected: boolean;
  whatsapp_instance_id: string | null;
  whatsapp_phone: string | null;
}

interface AgentContextType {
  agent: CurrentAgent | null;
  loading: boolean;
  reload: () => void;
}

const AgentContext = createContext<AgentContextType>({
  agent: null,
  loading: true,
  reload: () => {},
});

export const useAgent = () => useContext(AgentContext);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<CurrentAgent | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const agents = await getAgents();
      if (agents.length === 0) {
        setAgent(null);
        return;
      }

      const a = agents[0] as any;
      let phone: string | null = null;

      if (a.whatsapp_instance_id) {
        try {
          const status = await getWhatsAppStatus(a.whatsapp_instance_id);
          phone = status.phone ?? null;
        } catch {
          // não bloqueia se falhar
        }
      }

      setAgent({
        id: a.id,
        name: a.name,
        type: a.type,
        status: a.status,
        system_prompt: a.system_prompt ?? null,
        whatsapp_connected: a.whatsapp_connected ?? false,
        whatsapp_instance_id: a.whatsapp_instance_id ?? null,
        whatsapp_phone: phone,
      });
    } catch {
      setAgent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AgentContext.Provider value={{ agent, loading, reload: load }}>
      {children}
    </AgentContext.Provider>
  );
}
