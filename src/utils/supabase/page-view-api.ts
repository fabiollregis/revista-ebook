
import { supabase } from "@/integrations/supabase/client";

/**
 * Increment the view count for a page
 */
export const incrementPageView = async (id: string): Promise<boolean> => {
  try {
    // First, get the current view count
    const { data: pageData, error: fetchError } = await supabase
      .from('pages')
      .select('view_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Error fetching page view count:", fetchError);
      return false;
    }

    // Increment the view count by 1
    const currentCount = pageData.view_count || 0;
    const newCount = currentCount + 1;

    // Update the page with the new view count
    const { error: updateError } = await supabase
      .from('pages')
      .update({ view_count: newCount })
      .eq('id', id);

    if (updateError) {
      console.error("Error incrementing page view:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to increment page view:", error);
    return false;
  }
};
