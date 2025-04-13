
import { supabase } from "@/integrations/supabase/client";
import { SiteSettings } from "@/types/page";
import { Json } from "@/integrations/supabase/types";

/**
 * Get site settings from Supabase
 */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("id", "site_config")
      .single();

    if (error) {
      console.error("Error fetching site settings:", error);
      throw error;
    }

    // If we don't have settings yet, return defaults
    if (!data) {
      return getDefaultSettings();
    }

    // Cast the JSON data to SiteSettings
    return data?.value as unknown as SiteSettings;
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    // Return defaults if we can't fetch settings
    return getDefaultSettings();
  }
};

/**
 * Save site settings to Supabase
 */
export const saveSiteSettings = async (settings: SiteSettings): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("settings")
      .upsert({ 
        id: "site_config",
        value: settings as unknown as Json,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error("Error updating site settings:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to save site settings:", error);
    return false;
  }
};

/**
 * Get default settings in case none exist yet
 */
const getDefaultSettings = (): SiteSettings => {
  return {
    siteTitle: "Revista Digital",
    footerText: "Conteúdo interativo",
    infoText: "Guia interativo - Instale como aplicativo para acesso offline",
    iframeUrl: "https://heyzine.com/flip-book/dce36e099f.html",
    iframeTitle: "Revista Digital - Edição Interativa",
    installPromptTitle: "Instale a Revista Digital",
    installPromptDescription: "Instale este aplicativo para acessar a revista offline e ter uma experiência melhor.",
    installButtonText: "Instalar Aplicativo",
    faviconUrl: "/favicon.ico",
    infographUrl: ""
  };
};
