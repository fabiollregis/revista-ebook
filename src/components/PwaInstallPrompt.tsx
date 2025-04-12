
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { loadPwaPromptConfig } from "@/utils/pwa-config";
import InstallPromptCard from "./InstallPromptCard";

/**
 * Main component for handling PWA installation prompt display
 */
const PwaInstallPrompt = () => {
  const { isVisible, handleInstall, handleDismiss } = usePwaInstall();
  const isMobile = useIsMobile();
  const { promptTitle, promptDescription, buttonText } = loadPwaPromptConfig();

  // Debug info
  useEffect(() => {
    console.log("PwaInstallPrompt mounted");
  }, []);
  
  console.log("PwaInstallPrompt render state:", { isVisible, isMobile });

  if (!isVisible) {
    console.log("Prompt not visible, returning null");
    return null;
  }

  return (
    <InstallPromptCard
      promptTitle={promptTitle}
      promptDescription={promptDescription}
      buttonText={buttonText}
      onInstall={handleInstall}
      onDismiss={handleDismiss}
    />
  );
};

export default PwaInstallPrompt;
