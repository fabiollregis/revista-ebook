
import React from "react";
import { User } from "lucide-react";

interface EmptyStateProps {
  loading: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ loading }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <User size={48} className="text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
      <p className="text-muted-foreground">
        {loading ? "Carregando usuários..." : "Não há usuários cadastrados no sistema."}
      </p>
    </div>
  );
};

export default EmptyState;
