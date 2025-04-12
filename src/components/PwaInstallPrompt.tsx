
import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const PwaInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    // Function to check if already installed as PWA
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    // Store the install prompt event for later use
    const promptHandler = (e: Event) => {
      e.preventDefault();
      console.log("beforeinstallprompt event captured");
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // If on mobile and not in standalone mode, show the prompt
      if (isMobile && !isInStandaloneMode()) {
        setIsVisible(true);
      }
    };

    // If the user has previously dismissed the prompt, don't show it again
    const hasDismissed = localStorage.getItem("pwa-prompt-dismissed") === "true";
    
    if (!hasDismissed && isMobile && !isInStandaloneMode()) {
      setIsVisible(true);
    }

    window.addEventListener("beforeinstallprompt", promptHandler);

    // Also listen for appinstalled event to hide the prompt if installation succeeds
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      setIsVisible(false);
      setInstallPrompt(null);
      toast({
        title: "Aplicativo instalado",
        description: "O Venice Guide foi instalado com sucesso!",
      });
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
      window.removeEventListener("appinstalled", () => {});
    };
  }, [isMobile, toast]);

  const handleInstall = async () => {
    if (installPrompt) {
      try {
        console.log("Attempting to show installation prompt");
        // Show the install prompt
        await installPrompt.prompt();
        
        // Wait for the user's choice
        const choiceResult = await installPrompt.userChoice;
        
        console.log('Installation result:', choiceResult.outcome);
        
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the installation");
          toast({
            title: "Instalando aplicativo",
            description: "O Venice Guide está sendo instalado",
          });
          
          // Hide the prompt after installation
          setIsVisible(false);
          // Clear the installation prompt
          setInstallPrompt(null);
        } else {
          console.log("User declined the installation");
          toast({
            title: "Instalação cancelada",
            description: "Você pode instalar o aplicativo mais tarde se desejar",
          });
        }
      } catch (error) {
        console.error("Error trying to install PWA:", error);
        toast({
          variant: "destructive",
          title: "Erro na instalação",
          description: "Não foi possível instalar o aplicativo",
        });
      }
    } else {
      console.log("No installation event available");
      
      // If we're on iOS, show specific instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        toast({
          title: "Instalação no iOS",
          description: "Toque no ícone de compartilhamento e depois em 'Adicionar à Tela de Início'",
        });
      } else {
        // Try to trigger the installation manually for other browsers
        toast({
          title: "Instalação não disponível",
          description: "Este navegador não suporta instalação automática de PWA",
        });
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
      <Button
        onClick={handleInstall}
        className="w-full flex items-center justify-center gap-2"
      >
        <Download size={18} />
        <span>Instalar Aplicativo</span>
      </Button>
    </div>
  );
};

export default PwaInstallPrompt;
