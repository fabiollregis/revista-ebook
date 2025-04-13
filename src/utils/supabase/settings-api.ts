
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

    // Cast the JSON data to SiteSettings
    return data?.value as unknown as SiteSettings;
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    throw error;
  }
};

/**
 * Save site settings to Supabase
 */
export const saveSiteSettings = async (settings: SiteSettings): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("settings")
      .update({ 
        value: settings as unknown as Json,
        updated_at: new Date().toISOString()
      })
      .eq("id", "site_config");

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
