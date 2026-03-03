import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
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

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

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
  const [activeTab, setActiveTab] = useState("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
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
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.name },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
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
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      toast.success("Login realizado!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Erro ao entrar");
    } finally {
      setLoadingSignIn(false);
    }
  };

  const handleGoogle = async () => {
    setLoadingGoogle(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/dashboard",
      });
      if (result.error) throw result.error;
    } catch (err: any) {
      toast.error(err.message || "Erro com Google");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = signInForm.getValues("email");
    if (!email) {
      toast.error("Digite seu e-mail primeiro");
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("E-mail de recuperação enviado!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar e-mail");
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
                    Nome completo
                  </label>
                  <input
                    placeholder="Como podemos te chamar?"
                    className={getInputClass(!!suF.dirtyFields.name, !!suF.errors.name)}
                    {...signUpForm.register("name")}
                  />
                  {suF.errors.name && (
                    <p className="text-sm text-red-500">{suF.errors.name.message}</p>
                  )}
                </div>

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

                <div className="relative my-4">
                  <Separator className="bg-slate-200" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-slate-400">
                    ou
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loadingGoogle}
                  className="flex items-center justify-center w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {loadingGoogle ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continuar com Google
                </button>

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
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                      Senha
                    </label>
                    <button
                      type="button"
                      className="text-sm text-indigo-500 hover:text-indigo-600"
                      onClick={handleForgotPassword}
                    >
                      Esqueci minha senha
                    </button>
                  </div>
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

                <div className="relative my-4">
                  <Separator className="bg-slate-200" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-slate-400">
                    ou
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loadingGoogle}
                  className="flex items-center justify-center w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {loadingGoogle ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continuar com Google
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
