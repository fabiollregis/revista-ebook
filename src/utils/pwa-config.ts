
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

/**
 * Load site general configuration from localStorage
 */
export const loadSiteConfig = () => {
  return {
    siteTitle: localStorage.getItem("venice-site-title") || "Venice Guide",
    iframeUrl: localStorage.getItem("venice-iframe-url") || "https://heyzine.com/flip-book/dce36e099f.html",
    iframeTitle: localStorage.getItem("venice-iframe-title") || "Venice Guide - Interactive Flipbook",
    footerText: localStorage.getItem("venice-footer-text") || "Conteúdo interativo",
    infoText: localStorage.getItem("venice-info-text") || "Guia interativo de Veneza - Instale como aplicativo para acesso offline"
  };
};
