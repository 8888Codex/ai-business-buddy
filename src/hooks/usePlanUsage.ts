import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBillingUsage } from "@/services/api";

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
      const data = await getBillingUsage();
      setUsage(data as PlanUsage);
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
