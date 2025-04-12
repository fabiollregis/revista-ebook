
import React from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";

const ContentSettingsForm: React.FC = () => {
  const { infoText, setInfoText, footerText, setFooterText } = useAdmin();

  return (
    <div className="space-y-4 mb-6">
      <div>
        <label htmlFor="info-text" className="block text-sm font-medium text-gray-700 mb-1">
          Texto Informativo (abaixo do iframe)
        </label>
        <Input
          id="info-text"
          type="text"
          value={infoText}
          onChange={(e) => setInfoText(e.target.value)}
          placeholder="Guia interativo de Veneza - Instale como aplicativo para acesso offline"
        />
      </div>
      
      <div>
        <label htmlFor="footer-text" className="block text-sm font-medium text-gray-700 mb-1">
          Texto do Rodapé
        </label>
        <Input
          id="footer-text"
          type="text"
          value={footerText}
          onChange={(e) => setFooterText(e.target.value)}
          placeholder="Conteúdo interativo"
        />
      </div>
    </div>
  );
};

export default ContentSettingsForm;
