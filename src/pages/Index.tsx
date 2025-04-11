
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import PwaInstallPrompt from "../components/PwaInstallPrompt";

const Index = () => {
  const [iframeUrl, setIframeUrl] = useState("https://heyzine.com/flip-book/dce36e099f.html");
  const [iframeTitle, setIframeTitle] = useState("Venice Guide - Interactive Flipbook");

  useEffect(() => {
    // Registra o service worker para PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('Service Worker registrado com sucesso:', registration.scope);
        }).catch(error => {
          console.log('Falha ao registrar o Service Worker:', error);
        });
      });
    }

    // Carrega os valores do localStorage, se existirem
    const savedUrl = localStorage.getItem("venice-iframe-url");
    const savedTitle = localStorage.getItem("venice-iframe-title");
    
    if (savedUrl) setIframeUrl(savedUrl);
    if (savedTitle) setIframeTitle(savedTitle);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-center text-gray-800">Venice Guide</h1>
          <Link to="/admin" className="text-gray-600 hover:text-gray-800">
            <Settings size={20} />
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl h-[600px] md:h-[650px] lg:h-[700px] rounded-lg overflow-hidden shadow-lg">
          <iframe 
            allowFullScreen 
            scrolling="no" 
            className="w-full h-full" 
            src={iframeUrl}
            title={iframeTitle}
          ></iframe>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Guia interativo de Veneza - Instale como aplicativo para acesso offline
          </p>
        </div>
      </main>
      
      <footer className="bg-white py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Venice Guide - Conteúdo interativo
        </div>
      </footer>

      <PwaInstallPrompt />
    </div>
  );
};

export default Index;
