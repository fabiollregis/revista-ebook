
import { PageData } from "@/types/page";

// Chave para armazenar no localStorage
const PAGES_STORAGE_KEY = "venice-guide-pages";

export function getPages(): PageData[] {
  const storedPages = localStorage.getItem(PAGES_STORAGE_KEY);
  if (!storedPages) return [];
  return JSON.parse(storedPages);
}

export function savePage(page: PageData): void {
  const pages = getPages();
  const existingIndex = pages.findIndex(p => p.id === page.id);
  
  if (existingIndex >= 0) {
    // Atualiza página existente
    pages[existingIndex] = page;
  } else {
    // Adiciona nova página
    pages.push(page);
  }
  
  localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
}

export function deletePage(id: string): void {
  const pages = getPages().filter(page => page.id !== id);
  localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
}

export function getPageBySlug(slug: string): PageData | undefined {
  return getPages().find(page => page.slug === slug);
}

export function getPageById(id: string): PageData | undefined {
  return getPages().find(page => page.id === id);
}
