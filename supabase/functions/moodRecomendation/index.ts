declare const Deno: any;
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: any) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const payload = await req.json().catch(() => ({}));
    const { watchlist, movies, mood, era, creator } = payload;

    console.log(`Processing request: Mood=${mood}, Era=${era}, Watchlist=${watchlist}`);

    // 2. Prepare the prompt
    let movieContext = "";
    if (watchlist && Array.isArray(movies) && movies.length > 0) {
      movieContext = movies
        .map((m: any) => `${m.movie_title || m.title} (ID: ${m.movie_id || m.id})`)
        .join(", ");
    }

    const promptText = watchlist && movieContext
      ? `Recommend 3 movies ONLY from this list: [${movieContext}]. The user is in a "${mood}" mood and wants "${era}" cinema. Return ONLY a JSON array: [{"summary":"brief why", "corrected_title":"exact title", "omdb_id":"imdb_id"}]`
      : `Recommend 3 movies for a "${mood}" mood, "${era}" era, by "${creator}" style creators. Return ONLY a JSON array: [{"summary":"brief why", "corrected_title":"exact title", "omdb_id":"imdb_id"}]`;

    // 3. Call Gemini 1.5 Flash (Stable)
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { response_mime_type: "application/json" } // Forces JSON output
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const aiText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) throw new Error("Gemini returned an empty response (Safety Filter?)");

    // 4. Parse and Return
    const parsedData = JSON.parse(aiText);
    return new Response(JSON.stringify(parsedData), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (err: any) {
    console.error("Function Crash:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})