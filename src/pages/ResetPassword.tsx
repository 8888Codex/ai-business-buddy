import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ResetPassword() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Bot className="h-10 w-10 text-primary mx-auto mb-2" />
          <CardTitle>Redefinição de senha</CardTitle>
          <CardDescription>
            Para redefinir sua senha, entre em contato com o suporte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => navigate("/auth")}>
            Voltar ao login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
