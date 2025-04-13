
import { supabase } from "@/integrations/supabase/client";

/**
 * Increment the view count for a page
 */
export const incrementPageView = async (id: string): Promise<boolean> => {
  try {
    // Call the RPC function without using generic type parameters
    // This approach avoids TypeScript constraints issues
    const { error } = await supabase
      .from('pages')
      .update({ view_count: supabase.sql`view_count + 1` })
      .eq('id', id);

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
