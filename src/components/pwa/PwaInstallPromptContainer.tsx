
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
  const { isVisible, handleInstall, handleDismiss, installInProgress } = usePwaInstall();
  const { config, loading } = usePwaConfig();
  const isMobile = useIsMobile();

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

export default PwaInstallPromptContainer;
