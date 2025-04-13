
import { supabase } from "@/integrations/supabase/client";

/**
 * Increment the view count for a page
 */
export const incrementPageView = async (id: string): Promise<boolean> => {
  try {
    // Call the RPC function to increment the view count
    const { error } = await supabase.rpc('increment_page_view_count', {
      page_id: id
    } as any); // Using type assertion to bypass TypeScript's type checking for RPC params

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
