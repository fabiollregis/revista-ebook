
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { loadPwaPromptConfig } from "@/utils/pwa-config";
import InstallPromptCard from "./InstallPromptCard";

/**
 * Main component for handling PWA installation prompt display
 */
const PwaInstallPrompt = () => {
  const { isVisible, handleInstall, handleDismiss, installInProgress } = usePwaInstall();
  const isMobile = useIsMobile();
  const [config, setConfig] = useState({
    promptTitle: "Instale o Venice Guide",
    promptDescription: "Instale este aplicativo para acessar o guia de Veneza offline e ter uma experiência melhor.",
    buttonText: "Instalar Aplicativo"
  });
  const [loading, setLoading] = useState(true);

  // Load config
  useEffect(() => {
    const getConfig = async () => {
      try {
        const promptConfig = await loadPwaPromptConfig();
        setConfig(promptConfig);
      } catch (error) {
        console.error("Error loading PWA prompt config:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getConfig();
  }, []);

  // Debug info
  useEffect(() => {
    console.log("PwaInstallPrompt mounted");
  }, []);
  
  console.log("PwaInstallPrompt render state:", { isVisible, isMobile, loading, installInProgress });

  if (loading || !isVisible) {
    console.log("Prompt not visible or loading, returning null");
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

export default PwaInstallPrompt;
