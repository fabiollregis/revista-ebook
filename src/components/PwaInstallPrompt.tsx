
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
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    console.log("PwaInstallPrompt mounted");
    
    // Função para verificar se já está instalado como PWA
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    
    // Se já estiver em modo standalone, oculta o prompt
    if (isInStandaloneMode()) {
      console.log("App is already installed as PWA, hiding prompt");
      setIsVisible(false);
      return;
    }

    // Limpa qualquer estado anterior para garantir que o botão apareça
    localStorage.removeItem("pwa-prompt-dismissed");

    // Tenta iniciar a instalação automaticamente após carregar a página
    const tryAutoInstall = () => {
      if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
        // Simula o clique no botão de instalação após 3 segundos
        setTimeout(() => {
          if (installPrompt) {
            console.log("Iniciando instalação automática");
            handleInstall();
          }
        }, 3000);
      }
    };

    // Armazena o evento de prompt de instalação para uso posterior
    const promptHandler = (e: Event) => {
      e.preventDefault();
      console.log("beforeinstallprompt event captured", e);
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
      
      // Tenta iniciar a instalação automaticamente após capturar o evento
      setTimeout(() => {
        handleInstall();
      }, 1500);
    };

    // Escuta pelo evento beforeinstallprompt
    window.addEventListener("beforeinstallprompt", promptHandler);
    
    // Escuta pelo evento appinstalled
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      setIsVisible(false);
      setInstallPrompt(null);
      toast({
        title: "Aplicativo instalado",
        description: "O Venice Guide foi instalado com sucesso!",
      });
    });

    // Tenta a instalação automática após o carregamento da página
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
        // Mostra o prompt de instalação
        await installPrompt.prompt();
        
        // Aguarda a escolha do usuário
        const choiceResult = await installPrompt.userChoice;
        
        console.log('Installation result:', choiceResult.outcome);
        
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the installation");
          toast({
            title: "Instalando aplicativo",
            description: "O Venice Guide está sendo instalado",
          });
          
          // Oculta o prompt após a instalação
          setIsVisible(false);
          // Limpa o prompt de instalação
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
    // Detecta iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      // No iOS, força a exibição do banner de instalação nativo
      // Cria um elemento invisível para forçar a interação do usuário
      const dummyButton = document.createElement('button');
      dummyButton.style.position = 'fixed';
      dummyButton.style.opacity = '0';
      dummyButton.style.pointerEvents = 'none';
      document.body.appendChild(dummyButton);
      dummyButton.click();
      
      // Remove após um pequeno atraso
      setTimeout(() => {
        document.body.removeChild(dummyButton);
      }, 100);
      
      toast({
        title: "Instalação no iOS",
        description: "Toque no ícone de compartilhamento e depois em 'Adicionar à Tela de Início'",
      });
    } else if (isAndroid) {
      // No Android, tenta forçar o banner de instalação
      const manifestLink = document.querySelector('link[rel="manifest"]');
      
      if (manifestLink) {
        // Força a análise do manifesto para acionar a instalação
        const manifestURL = manifestLink.getAttribute("href");
        if (manifestURL) {
          console.log("Attempting to trigger installation via manifest:", manifestURL);
          
          // Refresh no manifesto para forçar reavaliação
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
      // Para outros dispositivos
      toast({
        title: "Instalação manual",
        description: "Use o menu do navegador (três pontos) e selecione 'Instalar aplicativo'",
      });
    }
  };

  const handleDismiss = () => {
    console.log("Dismissing prompt");
    setIsVisible(false);
    // Armazena no localStorage que o usuário dispensou o prompt
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
