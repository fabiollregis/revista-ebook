
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const [iframeUrl, setIframeUrl] = useState("");
  const [iframeTitle, setIframeTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Carregar as configurações salvas do localStorage
    const savedUrl = localStorage.getItem("venice-iframe-url") || "https://heyzine.com/flip-book/dce36e099f.html";
    const savedTitle = localStorage.getItem("venice-iframe-title") || "Venice Guide - Interactive Flipbook";
    
    setIframeUrl(savedUrl);
    setIframeTitle(savedTitle);
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
