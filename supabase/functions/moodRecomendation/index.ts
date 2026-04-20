// declare const Deno: any;
// // @ts-ignore
// import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// }

// serve(async (req: any) => {
//   if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

//   try {
//     const rawBody = await req.json().catch(() => ({}));
    
//     // Support both direct payload OR payload wrapped in "prompt" (like Netlify)
//     const payload = rawBody.prompt ? rawBody.prompt : rawBody;

//     let movieNamesAndID = "";
//     const movies = payload.movies || [];

//     if (payload.watchlist && movies.length > 0) {
//       // Netlify used m.movie_title + "," + m.movie_id
//       movieNamesAndID = movies
//         .map((m: any) => `${m.movie_title || m.title} (${m.movie_id || m.id})`)
//         .join(", ");
//     }

//     // Ensure we don't send "undefined" to Gemini
//     const mood = payload.mood || "any mood";
//     const era = payload.era || "any era";
//     const creator = payload.creator || "any creator";

//     const promptText = payload.watchlist
//       ? `Recommend 3 movies ONLY from this list: ${movieNamesAndID}. Match mood: ${mood}, era: ${era}. Return ONLY a JSON array: [{"summary":"", "corrected_title":"", "omdb_id":""}]`
//       : `Recommend 3 movies that are ${era}, ${creator}, and ${mood}. Return ONLY a JSON array: [{"summary":"", "corrected_title":"", "omdb_id":""}]`;

//     // ... rest of your fetch logic ...
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: promptText }] }]
//         })
//       }
//     );

//     // NEW: Check if the Google API itself returned an error (400, 401, 404, etc.)
//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Gemini API Error:", errorData);
//       return new Response(JSON.stringify({ error: "Gemini API Refused", details: errorData }), { 
//         status: response.status, 
//         headers: corsHeaders 
//       });
//     }

//     const data = await response.json();
//     const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!text) {
//       throw new Error("Gemini returned an empty response or hit a safety filter.");
//     }

//     const cleanJson = text.replace(/```json|```/g, "").trim();
//     const parsed = JSON.parse(cleanJson);
//     const finalArray = Array.isArray(parsed) ? parsed : [parsed];

//     return new Response(JSON.stringify(finalArray), { 
//       status: 200, 
//       headers: { ...corsHeaders, "Content-Type": "application/json" } 
//     });

//   } catch (err: any) {
//     // 2. ALWAYS return a response in the catch block
//     console.error("Function Error:", err.message);
//     return new Response(JSON.stringify({ error: err.message }), { 
//       status: 500, 
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//     });
//   }
// })
declare const Deno: any;
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: any) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    console.log("Function triggered! Testing connectivity...");
    
    // Attempt to parse body just to see if it reaches us
    const rawBody = await req.json().catch(() => ({}));
    console.log("Payload received:", JSON.stringify(rawBody));

    // Hardcoded Fake Response
    const fakeAIResponse = [
      {
        "summary": "A test movie about debugging code in the middle of the night.",
        "corrected_title": "The Infinite Loop",
        "omdb_id": "tt0111161"
      },
      {
        "summary": "A documentary about why 500 errors happen to good people.",
        "corrected_title": "The Missing Log",
        "omdb_id": "tt0068646"
      }
    ];

    return new Response(JSON.stringify(fakeAIResponse), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (err: any) {
    console.error("Internal Crash:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})