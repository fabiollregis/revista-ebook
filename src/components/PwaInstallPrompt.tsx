
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
  const [isVisible, setIsVisible] = useState(true); // Always show initially
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    console.log("PwaInstallPrompt mounted");
    
    // Function to check if already installed as PWA
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    
    // If already in standalone mode, hide the prompt
    if (isInStandaloneMode()) {
      console.log("App is already installed as PWA, hiding prompt");
      setIsVisible(false);
      return;
    }

    // Clear any previous dismissed state to ensure button shows
    localStorage.removeItem("pwa-prompt-dismissed");

    // Store the install prompt event for later use
    const promptHandler = (e: Event) => {
      e.preventDefault();
      console.log("beforeinstallprompt event captured", e);
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", promptHandler);
    
    // Listen for appinstalled event
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
    };
  }, [toast]);

  const handleInstall = async () => {
    console.log("Install button clicked, prompt:", installPrompt);
    
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
        handleManualInstall();
      }
    } else {
      handleManualInstall();
    }
  };

  const handleManualInstall = () => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      toast({
        title: "Instalação no iOS",
        description: "Toque no ícone de compartilhamento e depois em 'Adicionar à Tela de Início'",
      });
    } else {
      // Try to simulate installation on Android
      // This is a workaround since some browsers might not trigger the beforeinstallprompt event
      const manifestLink = document.querySelector('link[rel="manifest"]');
      
      if (manifestLink) {
        // Force manifest parsing to trigger installation
        const manifestURL = manifestLink.getAttribute("href");
        if (manifestURL) {
          console.log("Attempting to trigger installation via manifest:", manifestURL);
          
          // Create an invisible frame to load the manifest
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = manifestURL;
          document.body.appendChild(iframe);
          
          // Remove after a short delay
          setTimeout(() => {
            document.body.removeChild(iframe);
            
            toast({
              title: "Instalação manual necessária",
              description: "Use o menu do navegador para instalar o aplicativo",
            });
          }, 500);
        }
      } else {
        toast({
          title: "Instalação manual",
          description: "Use o menu do navegador para instalar o aplicativo",
        });
      }
    }
  };

  const handleDismiss = () => {
    console.log("Dismissing prompt");
    setIsVisible(false);
    // Store in localStorage that user dismissed the prompt
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Debug info
  console.log("PwaInstallPrompt render state:", { isVisible, isMobile, hasInstallPrompt: !!installPrompt });

  if (!isVisible) {
    console.log("Prompt not visible, returning null");
    return null;
  }

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
