
import { supabase } from "@/integrations/supabase/client";

// Function to create an admin user
export const createAdminUser = async () => {
  const email = "admin@venice-guide.com";
  const password = "15183020";

  try {
    // Check if user exists
    const { data: existingUsers } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", email);

    // If admin user already exists, don't create again
    if (existingUsers && existingUsers.length > 0) {
      console.log("Admin user already exists");
      return;
    }

    // Create user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error creating admin user:", error);
      return;
    }

    // Make user admin
    if (data.user) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", data.user.id);

      if (updateError) {
        console.error("Error making user admin:", updateError);
      } else {
        console.log("Admin user created successfully");
      }
    }
  } catch (error) {
    console.error("Error in createAdminUser:", error);
  }
};
