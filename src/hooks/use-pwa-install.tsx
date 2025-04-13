
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

// Armazenar o evento globalmente para garantir que não se perca durante a renderização
let deferredPrompt: BeforeInstallPromptEvent | null = null;

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
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>({});
  const { toast } = useToast();
  const browser = detectBrowser();

  useEffect(() => {
    console.log("usePwaInstall hook initialized");
    
    // Se o evento já foi capturado globalmente, use-o
    if (deferredPrompt) {
      console.log("Using previously captured beforeinstallprompt event");
      setInstallPrompt(deferredPrompt);
    }
    
    // Se já estiver no modo standalone, oculte o prompt
    const inStandaloneMode = browser.isInStandaloneMode();
    console.log("App standalone mode:", inStandaloneMode);
    if (inStandaloneMode) {
      console.log("App is already installed as PWA, hiding prompt");
      setIsVisible(false);
      return;
    }

    // Limpe qualquer estado anterior para garantir que o botão apareça
    localStorage.removeItem("pwa-prompt-dismissed");

    // Armazene o evento de instalação para uso posterior
    const promptHandler = (e: Event) => {
      e.preventDefault();
      console.log("beforeinstallprompt event captured", e);
      // Armazene globalmente e no estado
      deferredPrompt = e as BeforeInstallPromptEvent;
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
      
      // Colete informações de diagnóstico
      setDiagnosticInfo(prev => ({
        ...prev,
        beforeinstallpromptCaptured: true,
        timestamp: new Date().toISOString()
      }));
    };

    // Ouça o evento beforeinstallprompt
    window.addEventListener("beforeinstallprompt", promptHandler);
    
    // Ouça o evento appinstalled
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      setIsVisible(false);
      setInstallPrompt(null);
      deferredPrompt = null;
      setInstallInProgress(false);
      toast({
        title: "Aplicativo instalado",
        description: "O Venice Guide foi instalado com sucesso!",
      });
      
      setDiagnosticInfo(prev => ({
        ...prev,
        appInstalled: true,
        installTimestamp: new Date().toISOString()
      }));
    });

    // Verifique o registro do service worker
    checkServiceWorkerRegistration().then(registration => {
      setDiagnosticInfo(prev => ({
        ...prev,
        serviceWorkerRegistered: !!registration,
        serviceWorkerActive: registration?.active ? true : false,
        serviceWorkerScope: registration?.scope
      }));
    });
    
    // Verifique se o manifest está presente
    const manifestLink = document.querySelector('link[rel="manifest"]');
    setDiagnosticInfo(prev => ({
        ...prev,
        manifestPresent: !!manifestLink,
        manifestHref: manifestLink?.getAttribute('href')
    }));

    // Limpe os listeners quando desmontado
    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
    };
  }, [toast, browser]);

  const handleInstall = async () => {
    console.log("Install button clicked", {
      promptAvailable: !!installPrompt || !!deferredPrompt,
      browserInfo: browser,
      diagnosticInfo
    });
    
    setInstallInProgress(true);
    
    // Use o evento armazenado globalmente se o estado não o tiver
    const promptToUse = installPrompt || deferredPrompt;
    
    // Diferentes estratégias de instalação com base na plataforma
    if (promptToUse) {
      // Método padrão de solicitação de instalação (Chrome, Edge, etc.)
      try {
        console.log("Attempting to show installation prompt");
        // Mostrar solicitação de instalação
        await promptToUse.prompt();
        
        // Aguarde a escolha do usuário
        const choiceResult = await promptToUse.userChoice;
        
        console.log('Installation result:', choiceResult.outcome);
        
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the installation");
          toast({
            title: "Instalando aplicativo",
            description: "O Venice Guide está sendo instalado",
          });
          // Limpe o evento armazenado após uso bem-sucedido
          deferredPrompt = null;
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
      console.log("No installation prompt available, trying platform-specific install");
      handlePlatformSpecificInstall();
    }
  };

  const handlePlatformSpecificInstall = () => {
    // iOS Safari instalação específica
    if (browser.isIOS && (browser.isSafari || browser.isChromeForIOS)) {
      showIOSInstallInstructions(toast);
    } 
    // Android específico
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
    // Navegadores desktop
    else if (browser.isFirefox) {
      showFirefoxInstallInstructions(toast);
    } else if (browser.isOpera) {
      showOperaInstallInstructions(toast);
    } else {
      // Instruções genéricas de navegador
      showGenericInstallInstructions(toast);
    }
    
    setInstallInProgress(false);
  };

  const handleDismiss = () => {
    console.log("Dismissing prompt");
    setIsVisible(false);
    // Armazene no localStorage que o usuário descartou o prompt
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Inclua informações de diagnóstico no retorno para depuração
  return {
    isVisible,
    installPrompt: installPrompt || deferredPrompt,
    handleInstall,
    handleDismiss,
    installInProgress,
    diagnosticInfo
  };
};

// Capture o evento o mais cedo possível, fora do hook
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt capturado globalmente');
    e.preventDefault();
    deferredPrompt = e as any;
  });
}
