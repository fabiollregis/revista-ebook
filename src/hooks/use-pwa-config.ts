
import { useState, useEffect } from "react";
import { loadPwaPromptConfig } from "@/utils/pwa-config";

/**
 * Custom hook to load PWA prompt configuration
 */
export const usePwaConfig = () => {
  const [config, setConfig] = useState({
    promptTitle: "Instale o Venice Guide",
    promptDescription: "Instale este aplicativo para acessar o guia de Veneza offline e ter uma experiência melhor.",
    buttonText: "Instalar Aplicativo"
  });
  const [loading, setLoading] = useState(true);

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

  return { config, loading };
};
