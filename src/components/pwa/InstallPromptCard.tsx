
import React from "react";
import { X, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstallPromptCardProps {
  promptTitle: string;
  promptDescription: string;
  buttonText: string;
  onInstall: () => void;
  onDismiss: () => void;
  installInProgress?: boolean;
}

/**
 * Card component that displays the PWA installation prompt
 */
const InstallPromptCard: React.FC<InstallPromptCardProps> = ({
  promptTitle,
  promptDescription,
  buttonText,
  onInstall,
  onDismiss,
  installInProgress = false
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{promptTitle}</h3>
        <button onClick={onDismiss} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {promptDescription}
      </p>
      <Button
        onClick={onInstall}
        className="w-full flex items-center justify-center gap-2"
        data-install-button
        disabled={installInProgress}
      >
        {installInProgress ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Download size={18} />
        )}
        <span>{installInProgress ? "Instalando..." : buttonText}</span>
      </Button>
    </div>
  );
};

export default InstallPromptCard;
