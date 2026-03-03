import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Code, Zap, Shield, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

export default function Auth() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
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
      toast.success("Conta criada! Redirecionando...");
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

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  return (
    <div className="flex min-h-screen">
      {/* Left panel — desktop only */}
      {!isMobile && (
        <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
          {/* Subtle pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 max-w-md text-center space-y-8">
            <div className="flex items-center justify-center gap-3">
              <Bot className="h-10 w-10 text-primary-foreground" />
              <span className="text-2xl font-bold text-primary-foreground">
                Funcionário de IA
              </span>
            </div>
            <h2 className="text-3xl font-bold text-primary-foreground leading-tight">
              Seu agente de IA no WhatsApp em 15 minutos
            </h2>
            <div className="space-y-4 text-left">
              {[
                { icon: Code, text: "Sem programação" },
                { icon: Zap, text: "Resultado imediato" },
                { icon: Shield, text: "Garantia de 7 dias" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-primary-foreground/90 text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          {isMobile && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Bot className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Funcionário de IA</span>
            </div>
          )}

          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              <TabsTrigger value="signin">Entrar</TabsTrigger>
            </TabsList>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome completo</Label>
                  <Input
                    id="signup-name"
                    placeholder="Seu nome"
                    {...signUpForm.register("name")}
                  />
                  {signUpForm.formState.errors.name && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    {...signUpForm.register("email")}
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      {...signUpForm.register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loadingSignUp}>
                  {loadingSignUp ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Criar Conta Grátis <ArrowRight className="h-4 w-4 ml-1" />
                </Button>

                <div className="relative my-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-sm text-muted-foreground">
                    ou
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogle}
                  disabled={loadingGoogle}
                >
                  {loadingGoogle ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continuar com Google
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Ao criar conta, você concorda com os{" "}
                  <a href="#" className="text-primary hover:underline">Termos de Uso</a>
                </p>
              </form>
            </TabsContent>

            {/* Sign In Tab */}
            <TabsContent value="signin">
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">E-mail</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="seu@email.com"
                    {...signInForm.register("email")}
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password">Senha</Label>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={handleForgotPassword}
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPasswordLogin ? "text" : "password"}
                      placeholder="Sua senha"
                      {...signInForm.register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                      tabIndex={-1}
                    >
                      {showPasswordLogin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loadingSignIn}>
                  {loadingSignIn ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Entrar <ArrowRight className="h-4 w-4 ml-1" />
                </Button>

                <div className="relative my-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-sm text-muted-foreground">
                    ou
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogle}
                  disabled={loadingGoogle}
                >
                  {loadingGoogle ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continuar com Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
