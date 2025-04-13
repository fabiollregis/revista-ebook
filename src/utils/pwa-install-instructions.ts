
import { useToast } from "@/hooks/use-toast";

type ToastFunction = ReturnType<typeof useToast>["toast"];

/**
 * Show installation instructions for iOS devices
 */
export const showIOSInstallInstructions = (toast: ToastFunction) => {
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

/**
 * Show installation instructions for Firefox
 */
export const showFirefoxInstallInstructions = (toast: ToastFunction) => {
  toast({
    title: "Instalar no Firefox",
    description: "Clique no menu ≡, depois em 'Instalar' ou 'Adicionar à Tela Inicial'",
    duration: 6000
  });
};

/**
 * Show installation instructions for Opera
 */
export const showOperaInstallInstructions = (toast: ToastFunction) => {
  toast({
    title: "Instalar no Opera",
    description: "Clique no ícone + na barra de endereço e selecione 'Instalar'",
    duration: 6000
  });
};

/**
 * Show installation instructions for Samsung Internet browser
 */
export const showSamsungInstallInstructions = (toast: ToastFunction) => {
  toast({
    title: "Instalar no Samsung Internet",
    description: "Toque no menu ⋮, depois em 'Adicionar à Tela Inicial'",
    duration: 6000
  });
};

/**
 * Show generic browser installation instructions
 */
export const showGenericInstallInstructions = (toast: ToastFunction) => {
  toast({
    title: "Instalar aplicativo",
    description: "Use o menu do seu navegador (geralmente três pontos ⋮) e selecione 'Instalar aplicativo'",
    duration: 6000
  });
};

/**
 * Try to trigger Android installation
 */
export const triggerAndroidInstallation = (toast: ToastFunction) => {
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
