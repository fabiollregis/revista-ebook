
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

/**
 * Create a new user
 */
export const createUser = async (email: string, password: string, isAdmin: boolean = false): Promise<{ success: boolean; error?: string; userId?: string }> => {
  try {
    // Sign up the user using the regular sign-up endpoint
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error creating user:", error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Update the user's profile with admin status if needed
      if (isAdmin) {
        await supabase
          .from("profiles")
          .update({ is_admin: true })
          .eq("id", data.user.id);
      }

      return { success: true, userId: data.user.id };
    }

    return { success: false, error: "User created but no user data returned" };
  } catch (error: any) {
    console.error("Failed to create user:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Delete user via Supabase Admin API
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
};
