
import { supabase } from "@/integrations/supabase/client";

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
