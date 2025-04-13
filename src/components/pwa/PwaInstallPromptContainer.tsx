
import { useEffect } from "react";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { usePwaConfig } from "@/hooks/use-pwa-config";
import { useIsMobile } from "@/hooks/use-mobile";
import InstallPromptCard from "./InstallPromptCard";

/**
 * Container component for PWA installation prompt
 * Handles loading configuration and installation logic
 */
const PwaInstallPromptContainer = () => {
  const { isVisible, handleInstall, handleDismiss, installInProgress, diagnosticInfo } = usePwaInstall();
  const { config, loading } = usePwaConfig();
  const isMobile = useIsMobile();

  // Debug info
  useEffect(() => {
    console.log("PwaInstallPrompt mounted");
    
    // Log diagnostic information
    console.log("PWA Diagnostic Info:", diagnosticInfo);
    
    // Adicione um listener para mensagens do service worker
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SHOW_INSTALL_PROMPT') {
          console.log('Received SHOW_INSTALL_PROMPT from service worker', event.data);
        }
      });
    }
  }, [diagnosticInfo]);
  
  console.log("PwaInstallPrompt render state:", { isVisible, isMobile, loading, installInProgress });

  if (loading) {
    console.log("PWA config is still loading, returning null");
    return null;
  }

  if (!isVisible) {
    console.log("PWA prompt is not visible, returning null");
    return null;
  }

  return (
    <InstallPromptCard
      promptTitle={config.promptTitle}
      promptDescription={config.promptDescription}
      buttonText={config.buttonText}
      onInstall={handleInstall}
      onDismiss={handleDismiss}
      installInProgress={installInProgress}
    />
  );
};

export default PwaInstallPromptContainer;
