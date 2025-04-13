
import { supabase } from "@/integrations/supabase/client";
import { PageData, SiteSettings } from "@/types/page";
import { Json } from "@/integrations/supabase/types";

/**
 * Get all pages from Supabase
 */
export const getPages = async (): Promise<PageData[]> => {
  try {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    return [];
  }
};

/**
 * Get a page by its ID
 */
export const getPageById = async (id: string): Promise<PageData | null> => {
  try {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching page by ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch page by ID:", error);
    return null;
  }
};

/**
 * Get a page by its slug
 */
export const getPageBySlug = async (slug: string): Promise<PageData | null> => {
  try {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching page by slug:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch page by slug:", error);
    return null;
  }
};

/**
 * Save or update a page
 */
export const savePage = async (pageData: Partial<PageData>): Promise<PageData | null> => {
  try {
    if (pageData.id) {
      // Update existing page
      const { data, error } = await supabase
        .from("pages")
        .update({
          title: pageData.title,
          iframe_url: pageData.iframe_url,
          description: pageData.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pageData.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating page:", error);
        return null;
      }

      return data;
    } else {
      // Insert new page
      const { data, error } = await supabase
        .from("pages")
        .insert({
          title: pageData.title,
          slug: pageData.slug as string,
          iframe_url: pageData.iframe_url,
          description: pageData.description,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating page:", error);
        return null;
      }

      return data;
    }
  } catch (error) {
    console.error("Failed to save page:", error);
    return null;
  }
};

/**
 * Delete a page by ID
 */
export const deletePage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting page:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to delete page:", error);
    return false;
  }
};

/**
 * Increment the view count for a page
 */
export const incrementPageView = async (id: string): Promise<boolean> => {
  try {
    // Define the correct type for the RPC parameters
    type IncrementPageViewParams = {
      page_id: string;
    };

    const { error } = await supabase.rpc<null>(
      'increment_page_view_count', 
      { page_id: id } as IncrementPageViewParams
    );

    if (error) {
      console.error("Error incrementing page view:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to increment page view:", error);
    return false;
  }
};

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

/**
 * Get all user profiles
 */
export const getUserProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user profiles:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch user profiles:", error);
    return [];
  }
};

/**
 * Update user admin status
 */
export const updateUserAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ 
        is_admin: isAdmin,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user admin status:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to update user admin status:", error);
    return false;
  }
};
