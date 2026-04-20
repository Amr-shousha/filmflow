declare const Deno: any;
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: any) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const payload = await req.json().catch(() => ({}));
    const { watchlist, movies, mood, era, creator } = payload;

    let movieContext = "";
    if (watchlist && Array.isArray(movies) && movies.length > 0) {
      movieContext = movies
        .map((m: any) => `${m.movie_title || m.title} (ID: ${m.movie_id || m.id})`)
        .join(", ");
    }

    const promptText = watchlist && movieContext
      ? `Recommend 3 movies ONLY from this list: [${movieContext}]. Match mood: ${mood}, era: ${era}. Return ONLY a JSON array: [{"summary":"why", "corrected_title":"title", "omdb_id":"imdb_id"}]`
      : `Recommend 3 movies: ${mood} mood, ${era} era, ${creator} style. Return ONLY a JSON array: [{"summary":"why", "corrected_title":"title", "omdb_id":"imdb_id"}]`;

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    
    // Using v1 (Stable) and the full model path
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    let aiText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Robust JSON cleaning
    const cleanJson = aiText.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    return new Response(JSON.stringify(parsedData), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (err: any) {
    console.error("Function Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})