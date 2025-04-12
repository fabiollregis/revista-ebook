
import React from "react";
import { Save } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";

const SaveButton: React.FC = () => {
  const { handleSave } = useAdmin();

  return (
    <Button
      onClick={handleSave}
      className="flex items-center justify-center gap-2"
    >
      <Save size={18} />
      <span>Salvar Configurações</span>
    </Button>
  );
};

export default SaveButton;
