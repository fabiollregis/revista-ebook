
import { supabase } from "@/integrations/supabase/client";

/**
 * Increment the view count for a page
 */
export const incrementPageView = async (id: string): Promise<boolean> => {
  try {
    // Define a properly typed interface for the RPC function parameters
    interface IncrementPageViewParams {
      page_id: string;
    }
    
    // Use any as the return type to bypass TypeScript's constraint
    // We don't use the return value specifically, so this is acceptable
    const { error } = await supabase.rpc<any, IncrementPageViewParams>('increment_page_view_count', {
      page_id: id
    });

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
