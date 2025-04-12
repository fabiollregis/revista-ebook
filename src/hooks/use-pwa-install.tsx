
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

/**
 * Custom hook to handle PWA installation logic
 */
export const usePwaInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("usePwaInstall hook initialized");
    
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

    // Clear any previous state to ensure button appears
    localStorage.removeItem("pwa-prompt-dismissed");

    // Store the installation prompt event for later use
    const promptHandler = (e: Event) => {
      e.preventDefault();
      console.log("beforeinstallprompt event captured", e);
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
      
      // Auto-initiate installation after capturing event
      setTimeout(() => {
        if (installPrompt) {
          handleInstall();
        }
      }, 1500);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", promptHandler);
    
    // Listen for the appinstalled event
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      setIsVisible(false);
      setInstallPrompt(null);
      toast({
        title: "Aplicativo instalado",
        description: "O Venice Guide foi instalado com sucesso!",
      });
    });

    // Try auto-installation after page load
    const tryAutoInstall = () => {
      if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
        // Simulate install button click after 3 seconds
        setTimeout(() => {
          if (installPrompt) {
            console.log("Iniciando instalação automática");
            handleInstall();
          }
        }, 3000);
      }
    };

    window.addEventListener('load', tryAutoInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
      window.removeEventListener('load', tryAutoInstall);
    };
  }, [toast, installPrompt]);

  const handleInstall = async () => {
    console.log("Install button clicked, prompt:", installPrompt);
    
    if (installPrompt) {
      try {
        console.log("Attempting to show installation prompt");
        // Show installation prompt
        await installPrompt.prompt();
        
        // Wait for user's choice
        const choiceResult = await installPrompt.userChoice;
        
        console.log('Installation result:', choiceResult.outcome);
        
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the installation");
          toast({
            title: "Instalando aplicativo",
            description: "O Venice Guide está sendo instalado",
          });
          
          // Hide prompt after installation
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
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      // For iOS, force native installation banner display
      // Create an invisible element to force user interaction
      const dummyButton = document.createElement('button');
      dummyButton.style.position = 'fixed';
      dummyButton.style.opacity = '0';
      dummyButton.style.pointerEvents = 'none';
      document.body.appendChild(dummyButton);
      dummyButton.click();
      
      // Remove after a short delay
      setTimeout(() => {
        document.body.removeChild(dummyButton);
      }, 100);
      
      toast({
        title: "Instalação no iOS",
        description: "Toque no ícone de compartilhamento e depois em 'Adicionar à Tela de Início'",
      });
    } else if (isAndroid) {
      // For Android, try to force the installation banner
      const manifestLink = document.querySelector('link[rel="manifest"]');
      
      if (manifestLink) {
        // Force manifest analysis to trigger installation
        const manifestURL = manifestLink.getAttribute("href");
        if (manifestURL) {
          console.log("Attempting to trigger installation via manifest:", manifestURL);
          
          // Refresh manifest to force re-evaluation
          const currentHref = manifestLink.getAttribute("href");
          manifestLink.setAttribute("href", "about:blank");
          setTimeout(() => {
            manifestLink.setAttribute("href", currentHref || "/manifest.json");
          }, 10);
          
          toast({
            title: "Instalando automaticamente",
            description: "Aguarde enquanto instalamos o aplicativo...",
          });
        }
      } else {
        toast({
          title: "Instalação manual",
          description: "Use o menu do navegador para instalar o aplicativo",
        });
      }
    } else {
      // For other devices
      toast({
        title: "Instalação manual",
        description: "Use o menu do navegador (três pontos) e selecione 'Instalar aplicativo'",
      });
    }
  };

  const handleDismiss = () => {
    console.log("Dismissing prompt");
    setIsVisible(false);
    // Store in localStorage that the user dismissed the prompt
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  return {
    isVisible,
    installPrompt,
    handleInstall,
    handleDismiss
  };
};
