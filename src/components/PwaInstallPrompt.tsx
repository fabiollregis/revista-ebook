
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
      // Se estiver no celular e não estiver em modo standalone, mostra o prompt
      if (isMobile && !isInStandaloneMode()) {
        setIsVisible(true);
      }
    };

    // Check if already installed as PWA
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    window.addEventListener("beforeinstallprompt", promptHandler);

    // On mobile, we'll handle the visibility based on installation status
    if (isMobile) {
      // Se não estiver em modo standalone, mostra o prompt
      if (!isInStandaloneMode()) {
        setIsVisible(true);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
    };
  }, [isMobile]);

  const handleInstall = async () => {
    if (installPrompt) {
      try {
        // Força o prompt a ser mostrado automaticamente
        await installPrompt.prompt();
        
        // Aguarda a escolha do usuário
        const choiceResult = await installPrompt.userChoice;
        
        console.log('Resultado da instalação:', choiceResult.outcome);
        
        if (choiceResult.outcome === "accepted") {
          console.log("Usuário aceitou a instalação");
          // Esconde o prompt após a instalação
          setIsVisible(false);
          // Limpa o evento de prompt
          setInstallPrompt(null);
        } else {
          console.log("Usuário recusou a instalação");
        }
      } catch (error) {
        console.error("Erro ao tentar instalar o PWA:", error);
      }
    } else {
      console.log("Nenhum evento de instalação disponível");
      
      // Se estamos em iOS, mostramos instruções específicas
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert("Para instalar este app no iOS: toque no ícone de compartilhamento e depois em 'Adicionar à Tela de Início'");
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store in localStorage that user dismissed the prompt
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
