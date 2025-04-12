
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import PwaInstallPrompt from "../components/PwaInstallPrompt";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [iframeUrl, setIframeUrl] = useState("https://heyzine.com/flip-book/dce36e099f.html");
  const [iframeTitle, setIframeTitle] = useState("Venice Guide - Interactive Flipbook");
  const { toast } = useToast();

  useEffect(() => {
    // Registra o service worker para PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          console.log("Attempting to register service worker");
          const registration = await navigator.serviceWorker.register('/sw.js', { 
            scope: '/',
            updateViaCache: 'none' // Não use cache para atualizações do SW
          });
          
          console.log('Service Worker registrado com sucesso:', registration.scope);
          
          // Forçar atualização do service worker se necessário
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Service Worker update found!');
            
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Atualização disponível
                toast({
                  title: "Atualização disponível",
                  description: "Nova versão do aplicativo disponível",
                });
                
                // Força a atualização
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          });
        } catch (error) {
          console.error('Falha ao registrar o Service Worker:', error);
          toast({
            variant: "destructive",
            title: "Erro no PWA",
            description: "Não foi possível registrar o aplicativo para uso offline",
          });
        }
      });
      
      // Listen for controller change to reload the page
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated, reloading for fresh content');
        window.location.reload();
      });
    } else {
      console.log("Service workers not supported in this browser");
    }

    // Carrega os valores do localStorage, se existirem
    const savedUrl = localStorage.getItem("venice-iframe-url");
    const savedTitle = localStorage.getItem("venice-iframe-title");
    
    if (savedUrl) setIframeUrl(savedUrl);
    if (savedTitle) setIframeTitle(savedTitle);
  }, [toast]);

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

      {/* Always render the installation prompt */}
      <PwaInstallPrompt />
    </div>
  );
};

export default Index;
