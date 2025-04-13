
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageData, SiteSettings } from "@/types/page";
import { Button } from "@/components/ui/button";
import { getPageBySlug, incrementPageView } from "@/utils/supabase/page-api";
import { getSiteSettings } from "@/utils/supabase/settings-api";
import { useToast } from "@/hooks/use-toast";

const PageView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageData | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch site settings
        const siteSettings = await getSiteSettings();
        setSettings(siteSettings);
        
        // Fetch page data if slug exists
        if (slug) {
          const pageData = await getPageBySlug(slug);
          setPage(pageData);
          
          if (pageData) {
            // Update the page title
            document.title = `${pageData.title} | ${siteSettings.siteTitle}`;
            
            // Increment view count
            await incrementPageView(pageData.id);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados da página.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug, toast]);

  // Inserir o código do Pixel do Facebook quando a página carrega
  useEffect(() => {
    // Remover qualquer script anterior do Facebook Pixel
    const oldScripts = document.querySelectorAll('script[data-fb-pixel]');
    oldScripts.forEach(script => script.remove());
    
    if (page?.facebook_pixel_code) {
      // Criar um elemento de script para o Pixel do Facebook
      const pixelScript = document.createElement('script');
      pixelScript.innerHTML = page.facebook_pixel_code;
      pixelScript.setAttribute('data-fb-pixel', 'true');
      document.head.appendChild(pixelScript);
      
      // Função de limpeza para remover o script quando o componente for desmontado
      return () => {
        const scripts = document.querySelectorAll('script[data-fb-pixel]');
        scripts.forEach(script => script.remove());
      };
    }
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-6">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!page || !settings) {
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
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center p-4">
        <div className="w-full max-w-6xl h-[600px] md:h-[650px] lg:h-[700px] rounded-lg overflow-hidden shadow-lg">
          <iframe 
            allowFullScreen 
            scrolling="no" 
            className="w-full h-full" 
            src={page.iframe_url}
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
          &copy; {new Date().getFullYear()} {settings.siteTitle} - {settings.footerText}
        </div>
      </footer>
    </div>
  );
};

export default PageView;
