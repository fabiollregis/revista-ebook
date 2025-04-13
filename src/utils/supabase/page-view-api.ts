
import { supabase } from "@/integrations/supabase/client";

/**
 * Increment the view count for a page
 */
export const incrementPageView = async (id: string): Promise<boolean> => {
  try {
    // Create a properly typed parameter object
    const params: { page_id: string } = {
      page_id: id
    };

    // Call the RPC function to increment the view count with the typed parameters
    const { error } = await supabase.rpc('increment_page_view_count', params);

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
