
import { supabase } from "@/integrations/supabase/client";
import { PageData } from "@/types/page";

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
