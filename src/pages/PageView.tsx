
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import { PageData } from "@/types/page";
import { getPageBySlug } from "@/utils/local-storage";
import { Button } from "@/components/ui/button";
import { loadSiteConfig } from "@/utils/pwa-config";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

const PageView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageData | null>(null);
  const [siteTitle, setSiteTitle] = useState("");
  const [footerText, setFooterText] = useState("");

  useEffect(() => {
    if (slug) {
      const foundPage = getPageBySlug(slug);
      setPage(foundPage || null);
      
      if (foundPage) {
        // Update the page title
        document.title = `${foundPage.title} | Venice Guide`;
      }
    }
    
    // Load site configuration
    const config = loadSiteConfig();
    setSiteTitle(config.siteTitle);
    setFooterText(config.footerText);
  }, [slug]);

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-gray-600 mb-6">
            A página que você está procurando não existe ou foi removida.
          </p>
          <Link to="/">
            <Button>Voltar para a página inicial</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-center text-gray-800">{page.title}</h1>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft size={20} />
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
              <Settings size={20} />
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center p-4">
        <div className="w-full max-w-6xl h-[600px] md:h-[650px] lg:h-[700px] rounded-lg overflow-hidden shadow-lg">
          <iframe 
            allowFullScreen 
            scrolling="no" 
            className="w-full h-full" 
            src={page.iframeUrl}
            title={page.title}
          ></iframe>
        </div>
        
        {page.description && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-4">
              {page.description}
            </p>
          </div>
        )}
      </main>
      
      <footer className="bg-white py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {siteTitle} - {footerText}
        </div>
      </footer>

      {/* PWA installation prompt */}
      <PwaInstallPrompt />
    </div>
  );
};

export default PageView;
