import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { signup, login } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const signUpSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(8, "Mínimo 8 caracteres").max(72),
});

const signInSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(1, "Senha é obrigatória").max(72),
});

type SignUpValues = z.infer<typeof signUpSchema>;
type SignInValues = z.infer<typeof signInSchema>;

function getInputClass(isDirty: boolean, hasError: boolean) {
  const base =
    "flex w-full rounded-xl border px-4 py-3.5 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors";
  if (hasError) return `${base} border-red-400 focus:ring-red-500/20 focus:border-red-500`;
  if (isDirty) return `${base} border-emerald-400 focus:ring-emerald-500/20 focus:border-emerald-500`;
  return `${base} border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500`;
}

const WhatsAppMockup = () => (
  <div className="rounded-2xl bg-[#ECE5DD] p-4 max-w-xs w-full space-y-2 text-sm shadow-lg opacity-20">
    <div className="flex justify-end">
      <div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%]">
        <p className="text-slate-800">Olá, vi o anúncio!</p>
      </div>
    </div>
    <div className="flex justify-start">
      <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 max-w-[80%]">
        <p className="text-slate-800">Olá! 😊 Posso ajudar?</p>
      </div>
    </div>
    <div className="flex justify-end">
      <div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%]">
        <p className="text-slate-800">Quero agendar uma visita</p>
      </div>
    </div>
  </div>
);

export default function Auth() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { signIn } = useAuth();
  const [activeTab, setActiveTab] = useState("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const handleSignUp = async (values: SignUpValues) => {
    setLoadingSignUp(true);
    try {
      const data = await signup(values.email, values.password);
      signIn(data.user);
      toast.success("Conta criada! Vamos configurar seu agente.");
      navigate("/wizard/step-1");
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar conta");
    } finally {
      setLoadingSignUp(false);
    }
  };

  const handleSignIn = async (values: SignInValues) => {
    setLoadingSignIn(true);
    try {
      const data = await login(values.email, values.password);
      signIn(data.user);
      toast.success("Login realizado!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Erro ao entrar");
    } finally {
      setLoadingSignIn(false);
    }
  };


  const features = [
    "Sem programação necessária",
    "Resultado imediato no WhatsApp",
    "7 dias grátis, sem cartão",
  ];

  const suF = signUpForm.formState;
  const siF = signInForm.formState;

  return (
    <div className="flex min-h-screen">
      {/* Left panel — desktop only */}
      {!isMobile && (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 flex-col items-center justify-center p-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 max-w-md text-center space-y-8">
            <span className="text-2xl font-bold text-white">✦ Funcionário de IA</span>
            <h2 className="text-3xl font-bold text-white leading-tight mt-8">
              Crie seu agente de IA em 15 minutos
            </h2>
            <div className="space-y-4 text-left mt-8">
              {features.map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                  <span className="text-indigo-100 text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <WhatsAppMockup />
          </div>
        </div>
      )}

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          {isMobile && (
            <div className="flex items-center justify-center gap-1 mb-4">
              <span className="text-xl font-bold text-slate-900">✦ Funcionário de IA</span>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Custom tab triggers */}
            <div className="flex border-b border-slate-200 mb-6">
              {[
                { value: "signup", label: "Criar Conta" },
                { value: "signin", label: "Entrar" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                    activeTab === tab.value
                      ? "text-indigo-600 border-b-2 border-indigo-600 font-semibold"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sign Up */}
            <TabsContent value="signup" className="mt-0">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Comece grátis</h1>
                <p className="text-slate-500 mt-1">Crie sua conta em 30 segundos</p>
              </div>

              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className={getInputClass(!!suF.dirtyFields.email, !!suF.errors.email)}
                    {...signUpForm.register("email")}
                  />
                  {suF.errors.email && (
                    <p className="text-sm text-red-500">{suF.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      className={getInputClass(!!suF.dirtyFields.password, !!suF.errors.password)}
                      {...signUpForm.register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {suF.errors.password && (
                    <p className="text-sm text-red-500">{suF.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  disabled={loadingSignUp}
                >
                  {loadingSignUp && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Criar Conta Grátis <ArrowRight className="h-4 w-4 ml-1" />
                </Button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  Ao criar conta, você concorda com os{" "}
                  <a href="#" className="text-indigo-500 hover:underline">Termos de Uso</a>
                </p>
              </form>
            </TabsContent>

            {/* Sign In */}
            <TabsContent value="signin" className="mt-0">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h1>
                <p className="text-slate-500 mt-1">Entre na sua conta</p>
              </div>

              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className={getInputClass(!!siF.dirtyFields.email, !!siF.errors.email)}
                    {...signInForm.register("email")}
                  />
                  {siF.errors.email && (
                    <p className="text-sm text-red-500">{siF.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordLogin ? "text" : "password"}
                      placeholder="Sua senha"
                      className={getInputClass(!!siF.dirtyFields.password, !!siF.errors.password)}
                      {...signInForm.register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                      tabIndex={-1}
                    >
                      {showPasswordLogin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {siF.errors.password && (
                    <p className="text-sm text-red-500">{siF.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  disabled={loadingSignIn}
                >
                  {loadingSignIn && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Entrar <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
