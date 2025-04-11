
import { useEffect } from "react";

const Index = () => {
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
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold text-center text-gray-800">Venice Guide</h1>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl h-[600px] md:h-[650px] lg:h-[700px] rounded-lg overflow-hidden shadow-lg">
          <iframe 
            allowFullScreen 
            scrolling="no" 
            className="w-full h-full" 
            src="https://heyzine.com/flip-book/dce36e099f.html"
            title="Venice Guide - Interactive Flipbook"
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
    </div>
  );
};

export default Index;
