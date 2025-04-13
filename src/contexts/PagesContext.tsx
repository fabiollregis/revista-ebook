
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { PageData } from "@/types/page";
import { getPages, savePage, deletePage, getPageById } from "@/utils/supabase/page-api";
import { getPageBySlug as getPageBySlugApi } from "@/utils/supabase/page-api";
import { useToast } from "@/hooks/use-toast";
import { generateSlug } from "@/utils/string-utils";

interface PagesContextType {
  pages: PageData[];
  loading: boolean;
  addPage: (data: Omit<PageData, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePage: (id: string, data: Partial<PageData>) => Promise<void>;
  removePage: (id: string) => Promise<void>;
  getPage: (id: string) => PageData | undefined;
  getPageBySlug: (slug: string) => PageData | undefined;
  refreshPages: () => Promise<void>;
}

const PagesContext = createContext<PagesContextType | undefined>(undefined);

export function PagesProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshPages = async () => {
    setLoading(true);
    try {
      const fetchedPages = await getPages();
      setPages(fetchedPages);
    } catch (error) {
      console.error("Failed to fetch pages:", error);
      toast({
        title: "Erro ao carregar páginas",
        description: "Não foi possível carregar as páginas. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPages();
  }, []);

  const addPage = async (data: Omit<PageData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const slug = generateSlug(data.title);
      const newPage = await savePage({
        title: data.title,
        slug,
        iframe_url: data.iframe_url,
        description: data.description,
        facebook_pixel_code: data.facebook_pixel_code,
      });
      
      if (newPage) {
        setPages(prev => [newPage, ...prev]);
        toast({
          title: "Página criada",
          description: `A página "${data.title}" foi criada com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error adding page:", error);
      toast({
        title: "Erro ao criar página",
        description: "Não foi possível criar a página. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const updatePage = async (id: string, data: Partial<PageData>) => {
    const page = getPage(id);
    if (!page) return;
    
    try {
      const updatedPage = await savePage({
        id,
        title: data.title || page.title,
        iframe_url: data.iframe_url || page.iframe_url,
        description: data.description !== undefined ? data.description : page.description,
        facebook_pixel_code: data.facebook_pixel_code !== undefined ? data.facebook_pixel_code : page.facebook_pixel_code,
        slug: page.slug,
      });
      
      if (updatedPage) {
        setPages(prev => prev.map(p => p.id === id ? updatedPage : p));
        toast({
          title: "Página atualizada",
          description: `A página "${updatedPage.title}" foi atualizada com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error updating page:", error);
      toast({
        title: "Erro ao atualizar página",
        description: "Não foi possível atualizar a página. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const removePage = async (id: string) => {
    const page = getPage(id);
    if (!page) return;
    
    try {
      const success = await deletePage(id);
      if (success) {
        setPages(prev => prev.filter(p => p.id !== id));
        toast({
          title: "Página removida",
          description: `A página "${page.title}" foi removida com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error removing page:", error);
      toast({
        title: "Erro ao remover página",
        description: "Não foi possível remover a página. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const getPage = (id: string): PageData | undefined => {
    return pages.find(page => page.id === id);
  };

  const getPageBySlugFromState = (slug: string): PageData | undefined => {
    return pages.find(page => page.slug === slug);
  };

  const value = {
    pages,
    loading,
    addPage,
    updatePage,
    removePage,
    getPage,
    getPageBySlug: getPageBySlugFromState,
    refreshPages,
  };

  return (
    <PagesContext.Provider value={value}>
      {children}
    </PagesContext.Provider>
  );
}

export function usePages() {
  const context = useContext(PagesContext);
  if (context === undefined) {
    throw new Error("usePages must be used within a PagesProvider");
  }
  return context;
}
