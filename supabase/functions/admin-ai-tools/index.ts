import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") || "";
const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || "";
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, imageUrl, description, productTitle } = body;

    if (action === "describe") {
      const response = await fetch(AI_GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a luxury furniture copywriter. Write elegant, concise product descriptions for an upscale furniture e-commerce store. Focus on materials, craftsmanship, dimensions hints, and lifestyle appeal. Keep it under 150 words. Use British English. Do not use markdown formatting.",
            },
            {
              role: "user",
              content: [
                { type: "text", text: `Write a product description for: "${productTitle}". Analyze the image and describe the product accurately.` },
                ...(imageUrl ? [{ type: "image_url", image_url: { url: imageUrl } }] : []),
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await response.text();
        console.error("AI error:", response.status, t);
        return new Response(JSON.stringify({ error: "AI request failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || "";
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "compare") {
      const response = await fetch(AI_GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a product quality auditor. Compare the product image against the description and flag any mismatches, inaccuracies, or missing details. Be specific and constructive. Use British English.",
            },
            {
              role: "user",
              content: [
                { type: "text", text: `Product: "${productTitle}"\nCurrent description: "${description || 'No description'}"\n\nCompare the image to the description and list any issues.` },
                ...(imageUrl ? [{ type: "image_url", image_url: { url: imageUrl } }] : []),
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        console.error("AI compare error:", response.status, t);
        return new Response(JSON.stringify({ error: "AI request failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || "";
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate-angles" || action === "generate-dimensions") {
      const prompt = action === "generate-angles"
        ? `Generate a photorealistic product image showing this furniture piece from a different angle. Keep the same style, lighting, and background as the original. Product: ${productTitle}`
        : `Generate a version of this furniture product image with dimension annotations overlaid. Show estimated width, height, and depth measurements in centimeters. Product: ${productTitle}`;

      const messages: any[] = [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...(imageUrl ? [{ type: "image_url", image_url: { url: imageUrl } }] : []),
          ],
        },
      ];

      const response = await fetch(AI_GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages,
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await response.text();
        console.error("AI image error:", response.status, t);
        return new Response(JSON.stringify({ error: "AI image generation failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const images = data.choices?.[0]?.message?.images || [];
      const textResult = data.choices?.[0]?.message?.content || "";
      
      return new Response(JSON.stringify({ 
        success: true, 
        images: images.map((img: any) => img.image_url?.url),
        text: textResult,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-ai-tools error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
