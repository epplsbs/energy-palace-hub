// Dynamic sitemap.xml + robots.txt + Google ping. Public endpoint.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE_URL = Deno.env.get("SITE_URL") || "https://energypalace.com.np";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function xmlEscape(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

async function buildSitemap(supabase: any): Promise<string> {
  const today = new Date().toISOString().split("T")[0];
  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string; image?: string }> = [];

  const statics = [
    { p: "/", cf: "weekly", pr: "1.0" },
    { p: "/about", cf: "monthly", pr: "0.8" },
    { p: "/blog", cf: "weekly", pr: "0.9" },
    { p: "/contacts", cf: "monthly", pr: "0.7" },
    { p: "/media", cf: "monthly", pr: "0.5" },
  ];
  for (const s of statics) urls.push({ loc: `${SITE_URL}${s.p}`, lastmod: today, changefreq: s.cf, priority: s.pr });

  const { data: blogs } = await supabase
    .from("blog_posts").select("slug,updated_at,cover_image").eq("is_published", true);
  for (const b of blogs || []) {
    urls.push({
      loc: `${SITE_URL}/blog/${b.slug}`,
      lastmod: (b.updated_at || today).split("T")[0],
      changefreq: "weekly", priority: "0.7", image: b.cover_image,
    });
  }

  const { data: items } = await supabase
    .from("menu_items").select("id,image_url").eq("is_available", true);
  for (const m of items || []) {
    urls.push({
      loc: `${SITE_URL}/menu/${m.id}`,
      lastmod: today, changefreq: "monthly", priority: "0.6", image: m.image_url,
    });
  }

  const body = urls.map((u) => {
    const img = u.image ? `\n    <image:image><image:loc>${xmlEscape(u.image)}</image:loc></image:image>` : "";
    return `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>${img}\n  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>`;
}

function buildRobots(): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /pos
Disallow: /sales

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Ping mode: notify Google sitemap location
  if (url.searchParams.get("ping") === "1") {
    try {
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`;
      const r = await fetch(pingUrl);
      return new Response(JSON.stringify({ ok: true, status: r.status }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  // Robots
  if (url.pathname.endsWith("/robots") || url.searchParams.get("type") === "robots") {
    return new Response(buildRobots(), {
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
  }

  // Default: sitemap.xml
  try {
    const xml = await buildSitemap(supabase);
    return new Response(xml, {
      headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
  } catch (e) {
    return new Response(`<!-- error: ${String(e)} -->`, {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/xml" },
    });
  }
});