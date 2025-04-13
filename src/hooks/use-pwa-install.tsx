
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
  const [installInProgress, setInstallInProgress] = useState(false);
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
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", promptHandler);
    
    // Listen for the appinstalled event
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      setIsVisible(false);
      setInstallPrompt(null);
      setInstallInProgress(false);
      toast({
        title: "Aplicativo instalado",
        description: "O Venice Guide foi instalado com sucesso!",
      });
    });

    // Check for service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          console.log("Service worker is registered", registration);
        } else {
          console.log("No service worker registration found");
        }
      }).catch(err => {
        console.error("Error checking service worker registration:", err);
      });
    } else {
      console.log("Service workers not supported");
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
    };
  }, [toast]);

  const handleInstall = async () => {
    console.log("Install button clicked, prompt:", installPrompt);
    
    setInstallInProgress(true);
    
    // Different installation strategies based on platform
    if (installPrompt) {
      // Standard installation prompt method (Chrome, Edge, etc.)
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
        } else {
          console.log("User declined the installation");
          toast({
            title: "Instalação cancelada",
            description: "Você pode instalar o aplicativo mais tarde se desejar",
          });
          setInstallInProgress(false);
        }
      } catch (error) {
        console.error("Error trying to install PWA:", error);
        handlePlatformSpecificInstall();
      }
    } else {
      handlePlatformSpecificInstall();
    }
  };

  const handlePlatformSpecificInstall = () => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    const isChromeForIOS = /CriOS/.test(ua);
    const isWindowsPhone = /Windows Phone/.test(ua);
    const isOpera = /OPR/.test(ua) || /Opera/.test(ua);
    const isSamsung = /SamsungBrowser/.test(ua);
    
    // iOS Safari specific installation
    if (isIOS && (isSafari || isChromeForIOS)) {
      showIOSInstallInstructions();
    } 
    // Android specific
    else if (isAndroid) {
      if (isFirefox) {
        showFirefoxInstallInstructions();
      } else if (isOpera) {
        showOperaInstallInstructions();
      } else if (isSamsung) {
        showSamsungInstallInstructions();
      } else {
        triggerAndroidInstallation();
      }
    } 
    // Windows Phone
    else if (isWindowsPhone) {
      showGenericInstallInstructions();
    } 
    // Desktop browsers
    else if (isFirefox) {
      showFirefoxInstallInstructions();
    } else if (isOpera) {
      showOperaInstallInstructions();
    } else {
      // Generic browser instructions
      showGenericInstallInstructions();
    }
    
    setInstallInProgress(false);
  };
  
  // Platform specific instruction methods
  const showIOSInstallInstructions = () => {
    toast({
      title: "Instalar no iOS",
      description: "Toque no ícone de compartilhamento ⬆️ e depois em 'Adicionar à Tela de Início'",
      duration: 6000
    });
    
    // Show a visual cue
    const shareIconElement = document.createElement('div');
    shareIconElement.innerHTML = '⬆️';
    shareIconElement.style.position = 'fixed';
    shareIconElement.style.bottom = '20px';
    shareIconElement.style.left = '50%';
    shareIconElement.style.transform = 'translateX(-50%)';
    shareIconElement.style.fontSize = '24px';
    shareIconElement.style.padding = '10px';
    shareIconElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
    shareIconElement.style.color = 'white';
    shareIconElement.style.borderRadius = '50%';
    shareIconElement.style.zIndex = '9999';
    shareIconElement.style.animation = 'bounce 1s infinite';
    
    document.body.appendChild(shareIconElement);
    
    setTimeout(() => {
      document.body.removeChild(shareIconElement);
    }, 5000);
  };
  
  const showFirefoxInstallInstructions = () => {
    toast({
      title: "Instalar no Firefox",
      description: "Clique no menu ≡, depois em 'Instalar' ou 'Adicionar à Tela Inicial'",
      duration: 6000
    });
  };
  
  const showOperaInstallInstructions = () => {
    toast({
      title: "Instalar no Opera",
      description: "Clique no ícone + na barra de endereço e selecione 'Instalar'",
      duration: 6000
    });
  };
  
  const showSamsungInstallInstructions = () => {
    toast({
      title: "Instalar no Samsung Internet",
      description: "Toque no menu ⋮, depois em 'Adicionar à Tela Inicial'",
      duration: 6000
    });
  };
  
  const showGenericInstallInstructions = () => {
    toast({
      title: "Instalar aplicativo",
      description: "Use o menu do seu navegador (geralmente três pontos ⋮) e selecione 'Instalar aplicativo'",
      duration: 6000
    });
  };
  
  const triggerAndroidInstallation = () => {
    // Try to force the installation banner on Android
    const manifestLink = document.querySelector('link[rel="manifest"]');
    
    if (manifestLink) {
      toast({
        title: "Instalando automaticamente",
        description: "O aplicativo está tentando se instalar no seu dispositivo...",
      });
      
      // Refresh manifest and force re-evaluation
      const currentHref = manifestLink.getAttribute("href");
      manifestLink.setAttribute("href", "about:blank");
      setTimeout(() => {
        manifestLink.setAttribute("href", currentHref || "/manifest.json");
      }, 100);
      
      // Try accessing the service worker to trigger installation
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            // Send message to service worker to trigger installation
            registration.active?.postMessage({
              type: 'TRIGGER_INSTALL'
            });
          }
        });
      }
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
    handleDismiss,
    installInProgress
  };
};
