// Daily SEO cron: scans all known pages/blogs/products, fills in missing/stale SEO, and logs audits
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = Deno.env.get("SITE_URL") || "https://energypalace.com.np";
const STATIC_PAGES: Array<{ path: string; title: string; content: string }> = [
  { path: "/", title: "Energy Palace - EV Charging & Restaurant in Nepal", content: "Premium EV charging station with restaurant, lounge, and reservations in Nepal." },
  { path: "/about", title: "About Energy Palace", content: "Learn about Energy Palace's mission to power Nepal's EV revolution with sustainable energy and great food." },
  { path: "/blog", title: "Energy Palace Blog", content: "News, guides, and insights about EV charging, sustainability, and Energy Palace." },
  { path: "/contacts", title: "Contact Energy Palace", content: "Get in touch with Energy Palace - addresses, phone numbers, and email contacts." },
  { path: "/media", title: "Energy Palace Media Gallery", content: "Photos and media from Energy Palace - facilities, events, and stations." },
];

async function callGenerator(supabaseUrl: string, page: any) {
  const res = await fetch(`${supabaseUrl}/functions/v1/seo-generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
    },
    body: JSON.stringify({ page }),
  });
  return await res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const targets: any[] = [];

    // Static pages
    for (const p of STATIC_PAGES) {
      targets.push({ page_path: p.path, title: p.title, content: p.content, type: "page" });
    }

    // Blog posts
    const { data: blogs } = await supabase
      .from("blog_posts").select("slug,title,excerpt,content,cover_image").eq("is_published", true);
    for (const b of blogs || []) {
      targets.push({
        page_path: `/blog/${b.slug}`,
        title: b.title,
        content: (b.excerpt || "") + "\n" + (b.content || "").slice(0, 1500),
        image: b.cover_image, type: "blog",
      });
    }

    // Products (menu items)
    const { data: items } = await supabase
      .from("menu_items").select("id,name,description,image_url").eq("is_available", true);
    for (const m of items || []) {
      targets.push({
        page_path: `/menu/${m.id}`,
        title: m.name,
        content: m.description || m.name,
        image: m.image_url, type: "product",
      });
    }

    const results = { processed: 0, skipped: 0, failed: 0, audits: 0 };
    // Reset audit log
    await supabase.from("seo_audit_log").delete().eq("resolved", false);

    for (const t of targets) {
      try {
        const r = await callGenerator(supabaseUrl, t);
        if (r.skipped) results.skipped++;
        else if (r.ok) results.processed++;
        else results.failed++;
      } catch (e) {
        results.failed++;
        console.error("Generate failed for", t.page_path, e);
      }
      // Light pacing to respect rate limits
      await new Promise((r) => setTimeout(r, 400));
    }

    // Health audits: missing alt_text on images
    const checks = [
      { table: "gallery_items", select: "id,title" },
      { table: "menu_items", select: "id,name" },
      { table: "employees", select: "id,name" },
    ];
    for (const c of checks) {
      const { data } = await supabase.from(c.table).select(`${c.select},alt_text`).is("alt_text", null);
      for (const row of data || []) {
        await supabase.from("seo_audit_log").insert({
          page_path: `/${c.table}/${(row as any).id}`,
          issue_type: "missing_alt",
          severity: "warning",
          details: { table: c.table, name: (row as any).title || (row as any).name },
        });
        results.audits++;
      }
    }

    // Duplicate metadata
    const { data: dupes } = await supabase
      .from("seo_settings").select("page_path,meta_title,meta_description");
    const titleMap = new Map<string, string[]>();
    for (const r of dupes || []) {
      if (!r.meta_title) continue;
      const list = titleMap.get(r.meta_title) || [];
      list.push(r.page_path);
      titleMap.set(r.meta_title, list);
    }
    for (const [title, paths] of titleMap.entries()) {
      if (paths.length > 1) {
        for (const p of paths) {
          await supabase.from("seo_audit_log").insert({
            page_path: p, issue_type: "duplicate_meta", severity: "error",
            details: { duplicate_title: title, also_used_by: paths.filter(x => x !== p) },
          });
          results.audits++;
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("seo-cron error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});