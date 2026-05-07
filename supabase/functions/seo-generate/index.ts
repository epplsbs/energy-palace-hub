// SEO content generator - uses Lovable AI to generate meta/OG/Twitter/JSON-LD for a given page
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SITE_URL = Deno.env.get("SITE_URL") || "https://energypalace.com.np";

interface PageContext {
  page_path: string;
  title?: string;
  content?: string;
  image?: string;
  type?: "page" | "blog" | "product";
}

async function callAI(systemPrompt: string, userPrompt: string): Promise<any> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [{
        type: "function",
        function: {
          name: "set_seo",
          description: "Returns SEO metadata for a webpage",
          parameters: {
            type: "object",
            properties: {
              meta_title: { type: "string", description: "<= 60 chars, includes primary keyword" },
              meta_description: { type: "string", description: "<= 155 chars, compelling summary" },
              meta_keywords: { type: "string", description: "comma-separated keywords" },
              og_title: { type: "string" },
              og_description: { type: "string" },
              twitter_title: { type: "string" },
              twitter_description: { type: "string" },
              schema_markup: { type: "object", description: "JSON-LD schema object appropriate for the page type" },
            },
            required: ["meta_title", "meta_description", "meta_keywords", "og_title", "og_description", "twitter_title", "twitter_description", "schema_markup"],
            additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "set_seo" } },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("AI rate limit exceeded");
    if (res.status === 402) throw new Error("AI credits exhausted - top up workspace");
    throw new Error(`AI gateway error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("No tool call in AI response");
  return JSON.parse(args);
}

async function hashContent(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json() as { page?: PageContext; force?: boolean };
    const page = body.page;
    if (!page?.page_path) {
      return new Response(JSON.stringify({ error: "page.page_path required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const contentHash = await hashContent(`${page.title || ""}|${page.content || ""}|${page.type || ""}`);

    // Skip if content hasn't changed
    if (!body.force) {
      const { data: existing } = await supabase
        .from("seo_settings").select("content_hash").eq("page_path", page.page_path).maybeSingle();
      if (existing?.content_hash === contentHash) {
        return new Response(JSON.stringify({ ok: true, skipped: true, reason: "unchanged" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const systemPrompt = `You are an expert SEO copywriter for Energy Palace - an EV charging station and restaurant in Nepal. Generate SEO metadata that is concise, keyword-rich, and click-worthy. Always include "Energy Palace" in titles. For schema_markup, choose the most appropriate JSON-LD type (LocalBusiness, Article, Product, WebSite, BreadcrumbList, FAQPage). Output via the set_seo tool only.`;

    const userPrompt = `Page path: ${page.page_path}
Type: ${page.type || "page"}
Title: ${page.title || "(none)"}
Content excerpt: ${(page.content || "").slice(0, 2000)}
Site URL: ${SITE_URL}
Generate SEO metadata for this page.`;

    const seo = await callAI(systemPrompt, userPrompt);
    const canonical_url = `${SITE_URL}${page.page_path === "/" ? "" : page.page_path}`;

    const record = {
      page_path: page.page_path,
      meta_title: seo.meta_title,
      meta_description: seo.meta_description,
      meta_keywords: seo.meta_keywords,
      og_title: seo.og_title,
      og_description: seo.og_description,
      og_image: page.image || null,
      twitter_title: seo.twitter_title,
      twitter_description: seo.twitter_description,
      twitter_image: page.image || null,
      twitter_card: "summary_large_image",
      canonical_url,
      robots_directives: "index,follow",
      schema_markup: seo.schema_markup,
      is_active: true,
      auto_generated: true,
      last_auto_generated_at: new Date().toISOString(),
      content_hash: contentHash,
    };

    const { error } = await supabase
      .from("seo_settings")
      .upsert(record, { onConflict: "page_path" });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, seo: record }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("seo-generate error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});