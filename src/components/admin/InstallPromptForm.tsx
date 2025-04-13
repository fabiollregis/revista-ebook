
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InstallPromptFormProps {
  installPromptTitle: string;
  installPromptDescription: string;
  installButtonText: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onButtonTextChange: (value: string) => void;
}

const InstallPromptForm: React.FC<InstallPromptFormProps> = ({
  installPromptTitle,
  installPromptDescription,
  installButtonText,
  onTitleChange,
  onDescriptionChange,
  onButtonTextChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-800">Personalização do Prompt de Instalação</h3>
      
      <div>
        <label htmlFor="install-prompt-title" className="block text-sm font-medium text-gray-700 mb-1">
          Título do Prompt de Instalação
        </label>
        <Input
          id="install-prompt-title"
          type="text"
          value={installPromptTitle}
          onChange={(e) => onTitleChange(e.target.value)}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
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
          onChange={(e) => onButtonTextChange(e.target.value)}
          placeholder="Instalar Aplicativo"
        />
      </div>
    </div>
  );
};

export default InstallPromptForm;
