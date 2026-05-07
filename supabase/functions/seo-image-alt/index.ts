// Generates AI alt text for an image given URL/filename/context
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { filename, context, image_url } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Generate concise SEO-friendly alt text (max 120 chars, no "image of" prefix) for this image.
Filename: ${filename || "(unknown)"}
Context: ${context || "(none)"}
URL: ${image_url || "(none)"}
Return ONLY the alt text, no quotes, no labels.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI ${res.status}: ${t}`);
    }
    const data = await res.json();
    const alt = (data?.choices?.[0]?.message?.content || "").trim().replace(/^["']|["']$/g, "").slice(0, 200);
    return new Response(JSON.stringify({ ok: true, alt_text: alt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});