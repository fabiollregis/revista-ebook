
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { detectBrowser } from "@/utils/browser-detection";
import { 
  showIOSInstallInstructions,
  showFirefoxInstallInstructions,
  showOperaInstallInstructions,
  showSamsungInstallInstructions,
  showGenericInstallInstructions,
  triggerAndroidInstallation
} from "@/utils/pwa-install-instructions";
import { checkServiceWorkerRegistration } from "@/utils/service-worker";

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
  const browser = detectBrowser();

  useEffect(() => {
    console.log("usePwaInstall hook initialized");
    
    // If already in standalone mode, hide the prompt
    if (browser.isInStandaloneMode()) {
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
    checkServiceWorkerRegistration();

    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
    };
  }, [toast, browser]);

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
    // iOS Safari specific installation
    if (browser.isIOS && (browser.isSafari || browser.isChromeForIOS)) {
      showIOSInstallInstructions(toast);
    } 
    // Android specific
    else if (browser.isAndroid) {
      if (browser.isFirefox) {
        showFirefoxInstallInstructions(toast);
      } else if (browser.isOpera) {
        showOperaInstallInstructions(toast);
      } else if (browser.isSamsung) {
        showSamsungInstallInstructions(toast);
      } else {
        triggerAndroidInstallation(toast);
      }
    } 
    // Windows Phone
    else if (browser.isWindowsPhone) {
      showGenericInstallInstructions(toast);
    } 
    // Desktop browsers
    else if (browser.isFirefox) {
      showFirefoxInstallInstructions(toast);
    } else if (browser.isOpera) {
      showOperaInstallInstructions(toast);
    } else {
      // Generic browser instructions
      showGenericInstallInstructions(toast);
    }
    
    setInstallInProgress(false);
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
