
import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const PwaInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Store the install prompt event for later use
    const promptHandler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", promptHandler);

    // Check if already installed as PWA
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    // On mobile, show the prompt by default if not installed
    if (isMobile && !isInStandaloneMode()) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
    };
  }, [isMobile]);

  const handleInstall = async () => {
    if (installPrompt) {
      // Use the stored event to show the install prompt
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === "accepted") {
        console.log("Usuário aceitou a instalação");
      }
      
      setInstallPrompt(null);
    }
    
    // Hide the prompt after installation attempt
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store in localStorage that user dismissed the prompt
    // to avoid showing it too frequently
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">Instale o Venice Guide</h3>
        <button onClick={handleDismiss} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Instale este aplicativo para acessar o guia de Veneza offline e ter uma experiência melhor.
      </p>
      <button
        onClick={handleInstall}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        <Download size={18} />
        <span>Instalar Aplicativo</span>
      </button>
    </div>
  );
};

export default PwaInstallPrompt;
