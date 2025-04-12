
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordProtectionProps {
  correctPassword: string;
  onAuthenticated: () => void;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({
  correctPassword,
  onAuthenticated,
}) => {
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  // Verificar se já está autenticado no localStorage
  useEffect(() => {
    const isAuth = localStorage.getItem("venice-admin-auth");
    if (isAuth === "true") {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      // Salva o estado de autenticação
      localStorage.setItem("venice-admin-auth", "true");
      toast({
        title: "Acesso permitido",
        description: "Bem-vindo ao painel administrativo",
      });
      onAuthenticated();
    } else {
      setIsError(true);
      toast({
        title: "Senha incorreta",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
      
      // Reset error state after a delay
      setTimeout(() => {
        setIsError(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Área Restrita</h2>
          <p className="mt-2 text-sm text-gray-600">
            Digite a senha para acessar o painel administrativo
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input
              id="password"
              name="password"
              type="password"
              required
              className={`w-full ${isError ? "border-red-500 animate-shake" : ""}`}
              placeholder="Digite a senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Acessar Painel
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtection;
