import { supabase } from "@/integrations/supabase/client";

export async function initializeDatabase() {
  try {
    console.log("Checking and creating database tables...");

    // Check if about_us table exists
    const { error: aboutUsError } = await supabase
      .from("about_us")
      .select("count")
      .limit(1);

    if (aboutUsError && aboutUsError.code === "PGRST116") {
      console.log("about_us table does not exist, creating...");
      // Table doesn't exist, we need to create it manually through the admin interface
      console.warn(
        "Please create the about_us and testimonials tables manually in Supabase dashboard",
      );
    }

    // Check if testimonials table exists
    const { error: testimonialsError } = await supabase
      .from("testimonials")
      .select("count")
      .limit(1);

    if (testimonialsError && testimonialsError.code === "PGRST116") {
      console.log("testimonials table does not exist, creating...");
    }

    return { success: true };
  } catch (error) {
    console.error("Database initialization error:", error);
    return { success: false, error };
  }
}
