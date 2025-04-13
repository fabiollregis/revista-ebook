
import { supabase } from "@/integrations/supabase/client";

/**
 * Increment the view count for a page
 */
export const incrementPageView = async (id: string): Promise<boolean> => {
  try {
    // Using a type assertion with any to bypass TypeScript's strict type checking for RPC params
    const { error } = await supabase.rpc('increment_page_view_count', {
      page_id: id
    } as any);

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
