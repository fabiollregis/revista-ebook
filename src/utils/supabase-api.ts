
import { supabase } from "@/integrations/supabase/client";
import { PageData, SiteSettings } from "@/types/page";
import { generateSlug } from "./string-utils";

// Pages API functions
export async function getPages(): Promise<PageData[]> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pages:", error);
    return [];
  }

  return data || [];
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    return null;
  }

  return data;
}

export async function getPageById(id: string): Promise<PageData | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching page with id ${id}:`, error);
    return null;
  }

  return data;
}

export async function savePage(page: Omit<PageData, "id" | "created_at" | "updated_at"> & { id?: string }): Promise<PageData | null> {
  if (page.id) {
    // Update existing page
    const { data, error } = await supabase
      .from("pages")
      .update({
        title: page.title,
        iframe_url: page.iframe_url,
        description: page.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", page.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating page:", error);
      return null;
    }

    return data;
  } else {
    // Create new page
    const slug = page.slug || generateSlug(page.title);
    
    const { data, error } = await supabase
      .from("pages")
      .insert({
        title: page.title,
        slug,
        iframe_url: page.iframe_url,
        description: page.description,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating page:", error);
      return null;
    }

    return data;
  }
}

export async function deletePage(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("pages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting page:", error);
    return false;
  }

  return true;
}

// Settings API functions
export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("id", "site_config")
    .single();

  if (error) {
    console.error("Error fetching site settings:", error);
    // Return defaults if error
    return {
      siteTitle: "Venice Guide",
      footerText: "Conteúdo interativo",
      infoText: "Guia interativo de Veneza - Instale como aplicativo para acesso offline",
      iframeUrl: "https://heyzine.com/flip-book/dce36e099f.html",
      iframeTitle: "Venice Guide - Interactive Flipbook",
      installPromptTitle: "Instale o Venice Guide",
      installPromptDescription: "Instale este aplicativo para acessar o guia de Veneza offline e ter uma experiência melhor.",
      installButtonText: "Instalar Aplicativo"
    };
  }

  return data.value as SiteSettings;
}

export async function updateSiteSettings(settings: SiteSettings): Promise<boolean> {
  const { error } = await supabase
    .from("settings")
    .update({
      value: settings,
      updated_at: new Date().toISOString()
    })
    .eq("id", "site_config");

  if (error) {
    console.error("Error updating site settings:", error);
    return false;
  }

  return true;
}
