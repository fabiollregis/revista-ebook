
import React from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const InstallPromptForm: React.FC = () => {
  const { 
    installPromptTitle, setInstallPromptTitle,
    installPromptDescription, setInstallPromptDescription,
    installButtonText, setInstallButtonText
  } = useAdmin();

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-medium text-gray-800 pt-2">Prompt de Instalação</h3>
      
      <div>
        <label htmlFor="install-prompt-title" className="block text-sm font-medium text-gray-700 mb-1">
          Título do Prompt de Instalação
        </label>
        <Input
          id="install-prompt-title"
          type="text"
          value={installPromptTitle}
          onChange={(e) => setInstallPromptTitle(e.target.value)}
          placeholder="Instale o Venice Guide"
        />
      </div>

      <div>
        <label htmlFor="install-prompt-description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição do Prompt de Instalação
        </label>
        <Textarea
          id="install-prompt-description"
          value={installPromptDescription}
          onChange={(e) => setInstallPromptDescription(e.target.value)}
          className="w-full"
          rows={2}
          placeholder="Instale este aplicativo para acessar o guia de Veneza offline e ter uma experiência melhor."
        />
      </div>

      <div>
        <label htmlFor="install-button-text" className="block text-sm font-medium text-gray-700 mb-1">
          Texto do Botão de Instalação
        </label>
        <Input
          id="install-button-text"
          type="text"
          value={installButtonText}
          onChange={(e) => setInstallButtonText(e.target.value)}
          placeholder="Instalar Aplicativo"
        />
      </div>
    </div>
  );
};

export default InstallPromptForm;
