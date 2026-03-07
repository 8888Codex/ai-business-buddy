import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { logout as apiLogout } from "@/services/api";

interface AuthUser {
  id: string;
  email: string;
  plan: string;
  plan_expires_at?: string;
  trial_days_left?: number;
  timezone?: string; // Timezone do usuário para cálculo de reset de contador
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "";
      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("access_token");
        setUser(null);
      }
    } catch {
      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();

    // Quando qualquer chamada de API retornar 402 (trial expirado),
    // recarrega os dados do usuário para o overlay de bloqueio aparecer
    const handleTrialExpired = () => fetchMe();
    window.addEventListener('trial-expired', handleTrialExpired);
    return () => window.removeEventListener('trial-expired', handleTrialExpired);
  }, []);

  const signIn = (userData: AuthUser) => {
    setUser(userData);
  };

  const signOut = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
