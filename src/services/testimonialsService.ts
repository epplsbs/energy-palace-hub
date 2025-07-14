import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_title?: string;
  customer_email?: string;
  content: string;
  rating: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Default testimonials to use when database is unavailable
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "default-1",
    customer_name: "Abhisek Deuja",
    customer_title: "EV Traveller",
    content:
      "Energy Palace has completely changed my road trip experience! The charging is fast, the food is excellent, and the staff is incredibly friendly.",
    rating: 5,
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-2",
    customer_name: "Pratik Regmi",
    customer_title: "Official Regular Traveller",
    content:
      "I stop here every week during my commute. The charging infrastructure is top-notch and the coffee is the best in town.",
    rating: 5,
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-3",
    customer_name: "Sunita Sharma",
    customer_title: "Local Business Owner",
    content:
      "Perfect spot for travelers and locals alike. Great food, reliable charging, and beautiful atmosphere. Highly recommend!",
    rating: 5,
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    console.log("Fetching testimonials...");

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (error) {
      console.warn("Database error fetching testimonials:", error.message);
      console.log("Using default testimonials due to database error");
      return DEFAULT_TESTIMONIALS;
    }

    if (!data || data.length === 0) {
      console.log("No testimonials found in database, using defaults");
      return DEFAULT_TESTIMONIALS;
    }

    console.log("Testimonials fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Network or connection error fetching testimonials:", error);
    console.log("Using default testimonials due to connection error");
    return DEFAULT_TESTIMONIALS;
  }
};

export const createTestimonial = async (
  testimonial: Omit<Testimonial, "id" | "created_at" | "updated_at">,
): Promise<Testimonial> => {
  const { data, error } = await supabase
    .from("testimonials")
    .insert(testimonial)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTestimonial = async (
  id: string,
  testimonial: Partial<Testimonial>,
): Promise<void> => {
  const { error } = await supabase
    .from("testimonials")
    .update({
      ...testimonial,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) throw error;
};
