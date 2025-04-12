
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import PwaInstallPrompt from "../components/PwaInstallPrompt";
import { getPages } from "@/utils/local-storage";
import { PageData } from "@/types/page";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [iframeUrl, setIframeUrl] = useState("https://heyzine.com/flip-book/dce36e099f.html");
  const [iframeTitle, setIframeTitle] = useState("Venice Guide - Interactive Flipbook");
  const [siteTitle, setSiteTitle] = useState("Venice Guide");
  const [footerText, setFooterText] = useState("Conteúdo interativo");
  const [infoText, setInfoText] = useState("Guia interativo de Veneza - Instale como aplicativo para acesso offline");
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

          // Após 2 segundos, tenta iniciar uma instalação automática
          setTimeout(() => {
            if (registration.active) {
              registration.active.postMessage({ type: 'TRIGGER_INSTALL' });
            }
          }, 2000);
          
        } catch (error) {
          console.error('Falha ao registrar o Service Worker:', error);
          toast({
            variant: "destructive",
            title: "Erro no PWA",
            description: "Não foi possível registrar o aplicativo para uso offline",
          });
        }
      });
      
      // Configuração para receber mensagens do service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SHOW_INSTALL_PROMPT') {
          console.log('Recebida mensagem para mostrar prompt de instalação');
          // Simula um clique no botão de instalação
          const installButton = document.querySelector('[data-install-button]');
          if (installButton) {
            (installButton as HTMLButtonElement).click();
          }
        }
        
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          console.log('Service worker ativado, atualizando para conteúdo fresco');
          window.location.reload();
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

    // Carrega as páginas do localStorage
    setPages(getPages());

    // Carrega os valores do localStorage, se existirem
    const savedUrl = localStorage.getItem("venice-iframe-url");
    const savedTitle = localStorage.getItem("venice-iframe-title");
    const savedSiteTitle = localStorage.getItem("venice-site-title");
    const savedFooterText = localStorage.getItem("venice-footer-text");
    const savedInfoText = localStorage.getItem("venice-info-text");
    
    if (savedUrl) setIframeUrl(savedUrl);
    if (savedTitle) setIframeTitle(savedTitle);
    if (savedSiteTitle) setSiteTitle(savedSiteTitle);
    if (savedFooterText) setFooterText(savedFooterText);
    if (savedInfoText) setInfoText(savedInfoText);
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-center text-gray-800">{siteTitle}</h1>
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
            <Settings size={20} />
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center p-4">
        {pages.length > 0 ? (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl font-semibold mb-6">Páginas Disponíveis</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map(page => (
                <Link 
                  key={page.id} 
                  to={`/page/${page.slug}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 border-t">
                    <h3 className="font-medium text-lg mb-1">{page.title}</h3>
                    {page.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{page.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link to="/dashboard">
                <Button>
                  Gerenciar Páginas
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
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
              <p className="text-gray-600 text-sm mb-4">
                {infoText}
              </p>
              
              <Link to="/dashboard">
                <Button>
                  Criar Páginas com Iframes
                </Button>
              </Link>
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-white py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {siteTitle} - {footerText}
        </div>
      </footer>

      {/* Always render the installation prompt */}
      <PwaInstallPrompt />
    </div>
  );
};

export default Index;
