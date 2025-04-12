
/**
 * Load PWA prompt text configuration from localStorage
 */
export const loadPwaPromptConfig = () => {
  return {
    promptTitle: localStorage.getItem("venice-install-prompt-title") || "Instale o Venice Guide",
    promptDescription: localStorage.getItem("venice-install-prompt-description") || 
      "Instale este aplicativo para acessar o guia de Veneza offline e ter uma experiência melhor.",
    buttonText: localStorage.getItem("venice-install-button-text") || "Instalar Aplicativo"
  };
};
