import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface PlanUsage {
  plan: string;
  plan_expires_at: string | null;
  trial_days_left: number | null;
  messages: {
    used: number;
    limit: number;
    reset_at: string;
  };
  agents: {
    used: number;
    limit: number;
  };
}

interface UsePlanUsageReturn {
  usage: PlanUsage | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePlanUsage(): UsePlanUsageReturn {
  const { user } = useAuth();
  const [usage, setUsage] = useState<PlanUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL ?? "";
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${apiUrl}/billing/usage`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar uso do plano");
      }

      const data = await res.json();
      setUsage(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [user]);

  return { usage, loading, error, refetch: fetchUsage };
}
