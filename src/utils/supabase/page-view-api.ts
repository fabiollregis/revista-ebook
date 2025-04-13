
import { supabase } from "@/integrations/supabase/client";

/**
 * Increment the view count for a page
 */
export const incrementPageView = async (id: string): Promise<boolean> => {
  try {
    // Create a properly typed parameter object
    // Using type assertion to bypass TypeScript's type checking for RPC params
    const { error } = await supabase.rpc('increment_page_view_count', {
      page_id: id
    } as { page_id: string });

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
