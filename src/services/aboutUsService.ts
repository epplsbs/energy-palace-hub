import { supabase } from "@/integrations/supabase/client";

export interface AboutUsContent {
  id: string;
  title: string;
  company_story: string | null;
  mission_statement: string | null;
  vision_statement: string | null;
  values: Array<{ title: string; description: string }>;
  team_description: string | null;
  hero_image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Default about us content to use when database is unavailable
const DEFAULT_ABOUT_CONTENT: AboutUsContent = {
  id: "default",
  title: "About Energy Palace",
  company_story:
    "Energy Palace is Nepal's premier destination for electric vehicle charging and fine dining, located in the beautiful region of Bhiman, Sindhuli. We combine cutting-edge EV charging technology with exceptional hospitality to create an unmatched travel experience.",
  mission_statement:
    "To provide electric vehicle travelers with a premium charging experience while supporting sustainable transportation across Nepal.",
  vision_statement:
    "To become the leading network of EV charging destinations, setting the standard for sustainable travel infrastructure in South Asia.",
  values: [
    {
      title: "Sustainability",
      description:
        "Committed to environmental responsibility and clean energy solutions.",
    },
    {
      title: "Innovation",
      description:
        "Continuously investing in the latest charging technology and customer experience.",
    },
    {
      title: "Excellence",
      description:
        "Striving to exceed expectations in every aspect of our service.",
    },
    {
      title: "Community",
      description:
        "Supporting local communities and promoting sustainable development.",
    },
  ],
  team_description:
    "Our dedicated team is passionate about sustainable transportation, exceptional customer service, and creating memorable experiences for every visitor.",
  hero_image_url:
    "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=1200&h=600&fit=crop",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  display_order: 1,
  is_active: true,
};

export const getAboutUsContent = async (): Promise<AboutUsContent | null> => {
  try {
    console.log("Fetching about us content...");

    const { data, error } = await supabase
      .from("about_us")
      .select("*")
      .eq("is_active", true)
      .order("display_order")
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116" || error.code === "42P01") {
        console.log("About us table does not exist, using default content");
        return DEFAULT_ABOUT_CONTENT;
      }
      console.warn("Database error fetching about us content:", error.message);
      console.log("Using default about us content due to database error");
      return DEFAULT_ABOUT_CONTENT;
    }

    if (!data) {
      console.log("No about us content found in database, using default");
      return DEFAULT_ABOUT_CONTENT;
    }

    console.log("About us content fetched successfully:", data);

    return {
      ...data,
      values: Array.isArray(data.values)
        ? (data.values as Array<{ title: string; description: string }>)
        : DEFAULT_ABOUT_CONTENT.values,
    };
  } catch (error) {
    console.error(
      "Network or connection error fetching about us content:",
      error,
    );
    console.log("Using default about us content due to connection error");
    return DEFAULT_ABOUT_CONTENT;
  }
};

export const updateAboutUsContent = async (
  id: string,
  content: Partial<AboutUsContent>,
): Promise<void> => {
  const { error } = await supabase
    .from("about_us")
    .update({
      ...content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
};

export const createAboutUsContent = async (
  content: Omit<AboutUsContent, "id" | "created_at" | "updated_at">,
): Promise<AboutUsContent> => {
  const { data, error } = await supabase
    .from("about_us")
    .insert(content)
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    values: Array.isArray(data.values)
      ? (data.values as Array<{ title: string; description: string }>)
      : [],
  };
};
