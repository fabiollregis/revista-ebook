
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const [iframeUrl, setIframeUrl] = useState("");
  const [iframeTitle, setIframeTitle] = useState("");
  const [siteTitle, setSiteTitle] = useState("");
  const [footerText, setFooterText] = useState("");
  const [installPromptTitle, setInstallPromptTitle] = useState("");
  const [installPromptDescription, setInstallPromptDescription] = useState("");
  const [installButtonText, setInstallButtonText] = useState("");
  const [infoText, setInfoText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Carregar as configurações salvas do localStorage
    const savedUrl = localStorage.getItem("venice-iframe-url") || "https://heyzine.com/flip-book/dce36e099f.html";
    const savedTitle = localStorage.getItem("venice-iframe-title") || "Venice Guide - Interactive Flipbook";
    const savedSiteTitle = localStorage.getItem("venice-site-title") || "Venice Guide";
    const savedFooterText = localStorage.getItem("venice-footer-text") || "Conteúdo interativo";
    const savedInstallPromptTitle = localStorage.getItem("venice-install-prompt-title") || "Instale o Venice Guide";
    const savedInstallPromptDescription = localStorage.getItem("venice-install-prompt-description") || 
      "Instale este aplicativo para acessar o guia de Veneza offline e ter uma experiência melhor.";
    const savedInstallButtonText = localStorage.getItem("venice-install-button-text") || "Instalar Aplicativo";
    const savedInfoText = localStorage.getItem("venice-info-text") || 
      "Guia interativo de Veneza - Instale como aplicativo para acesso offline";
    
    setIframeUrl(savedUrl);
    setIframeTitle(savedTitle);
    setSiteTitle(savedSiteTitle);
    setFooterText(savedFooterText);
    setInstallPromptTitle(savedInstallPromptTitle);
    setInstallPromptDescription(savedInstallPromptDescription);
    setInstallButtonText(savedInstallButtonText);
    setInfoText(savedInfoText);
  }, []);

  const handleSave = () => {
    // Validar a URL
    try {
      new URL(iframeUrl);
    } catch (e) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida para o iframe",
        variant: "destructive",
      });
      return;
    }

    // Salvar as configurações no localStorage
    localStorage.setItem("venice-iframe-url", iframeUrl);
    localStorage.setItem("venice-iframe-title", iframeTitle);
    localStorage.setItem("venice-site-title", siteTitle);
    localStorage.setItem("venice-footer-text", footerText);
    localStorage.setItem("venice-install-prompt-title", installPromptTitle);
    localStorage.setItem("venice-install-prompt-description", installPromptDescription);
    localStorage.setItem("venice-install-button-text", installButtonText);
    localStorage.setItem("venice-info-text", infoText);

    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Administração - Venice Guide</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 mb-6">Configurações do Guia</h2>
          
          <div className="space-y-6">
            {/* Site Title */}
            <div>
              <label htmlFor="site-title" className="block text-sm font-medium text-gray-700 mb-1">
                Título do Site
              </label>
              <input
                id="site-title"
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Venice Guide"
              />
            </div>
            
            <div>
              <label htmlFor="iframe-url" className="block text-sm font-medium text-gray-700 mb-1">
                URL do Iframe (URL da revista embedada)
              </label>
              <input
                id="iframe-url"
                type="url"
                value={iframeUrl}
                onChange={(e) => setIframeUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://heyzine.com/flip-book/exemplo.html"
              />
              <p className="mt-1 text-sm text-gray-500">
                Insira a URL completa da revista que deseja exibir.
              </p>
            </div>
            
            <div>
              <label htmlFor="iframe-title" className="block text-sm font-medium text-gray-700 mb-1">
                Título do Iframe
              </label>
              <input
                id="iframe-title"
                type="text"
                value={iframeTitle}
                onChange={(e) => setIframeTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Venice Guide - Interactive Flipbook"
              />
            </div>

            <div>
              <label htmlFor="info-text" className="block text-sm font-medium text-gray-700 mb-1">
                Texto Informativo (abaixo do iframe)
              </label>
              <input
                id="info-text"
                type="text"
                value={infoText}
                onChange={(e) => setInfoText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Guia interativo de Veneza - Instale como aplicativo para acesso offline"
              />
            </div>
            
            <div>
              <label htmlFor="footer-text" className="block text-sm font-medium text-gray-700 mb-1">
                Texto do Rodapé
              </label>
              <input
                id="footer-text"
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Conteúdo interativo"
              />
            </div>

            <h3 className="text-lg font-medium text-gray-800 pt-2">Prompt de Instalação</h3>
            
            <div>
              <label htmlFor="install-prompt-title" className="block text-sm font-medium text-gray-700 mb-1">
                Título do Prompt de Instalação
              </label>
              <input
                id="install-prompt-title"
                type="text"
                value={installPromptTitle}
                onChange={(e) => setInstallPromptTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Instale o Venice Guide"
              />
            </div>

            <div>
              <label htmlFor="install-prompt-description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Prompt de Instalação
              </label>
              <textarea
                id="install-prompt-description"
                value={installPromptDescription}
                onChange={(e) => setInstallPromptDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Instale este aplicativo para acessar o guia de Veneza offline e ter uma experiência melhor."
              />
            </div>

            <div>
              <label htmlFor="install-button-text" className="block text-sm font-medium text-gray-700 mb-1">
                Texto do Botão de Instalação
              </label>
              <input
                id="install-button-text"
                type="text"
                value={installButtonText}
                onChange={(e) => setInstallButtonText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Instalar Aplicativo"
              />
            </div>
            
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
            >
              <Save size={18} />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Venice Guide - Painel Administrativo
        </div>
      </footer>
    </div>
  );
};

export default Admin;
