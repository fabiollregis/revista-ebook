
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPassword: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPassword,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      toast({
        title: "Sucesso!",
        description: "Senha correta!",
      });
      setError(false);
      onSuccess();
    } else {
      toast({
        title: "Erro",
        description: "Senha incorreta. Tente novamente.",
        variant: "destructive",
      });
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.75 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="mb-4 flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Acesso Protegido</h2>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Por favor, digite a senha para acessar a área restrita.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full ${error ? "border-red-500 animate-shake" : ""}`}
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PasswordModal;
