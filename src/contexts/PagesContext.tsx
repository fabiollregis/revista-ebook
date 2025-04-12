
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { PageData } from "@/types/page";
import { getPages, savePage, deletePage } from "@/utils/local-storage";
import { useToast } from "@/hooks/use-toast";
import { generateSlug } from "@/utils/string-utils";

interface PagesContextType {
  pages: PageData[];
  addPage: (data: Omit<PageData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: string, data: Partial<PageData>) => void;
  removePage: (id: string) => void;
  getPage: (id: string) => PageData | undefined;
  getPageBySlug: (slug: string) => PageData | undefined;
}

const PagesContext = createContext<PagesContextType | undefined>(undefined);

export function PagesProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<PageData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar páginas do localStorage quando o componente montar
    setPages(getPages());
  }, []);

  const addPage = (data: Omit<PageData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newPage: PageData = {
      id: `page_${now}`,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    
    savePage(newPage);
    setPages(getPages());
    toast({
      title: "Página criada",
      description: `A página "${data.title}" foi criada com sucesso.`,
    });
  };

  const updatePage = (id: string, data: Partial<PageData>) => {
    const page = getPage(id);
    if (!page) return;
    
    const updatedPage = {
      ...page,
      ...data,
      updatedAt: Date.now(),
    };
    
    savePage(updatedPage);
    setPages(getPages());
    toast({
      title: "Página atualizada",
      description: `A página "${updatedPage.title}" foi atualizada com sucesso.`,
    });
  };

  const removePage = (id: string) => {
    const page = getPage(id);
    if (!page) return;
    
    deletePage(id);
    setPages(getPages());
    toast({
      title: "Página removida",
      description: `A página "${page.title}" foi removida com sucesso.`,
    });
  };

  const getPage = (id: string): PageData | undefined => {
    return pages.find(page => page.id === id);
  };

  const getPageBySlug = (slug: string): PageData | undefined => {
    return pages.find(page => page.slug === slug);
  };

  const value = {
    pages,
    addPage,
    updatePage,
    removePage,
    getPage,
    getPageBySlug,
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
