
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
    
    // The first type parameter should be the return type, not null
    // Since we don't use the return value specifically, we can use void or any
    const { error } = await supabase.rpc<void, IncrementPageViewParams>('increment_page_view_count', {
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
