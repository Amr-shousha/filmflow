/* global Deno */
declare const Deno: any;

// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://film-flow.fun',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-region',
}

serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const guardianKey = (Deno as any).env.get('VITE_THE_GUARDIAN_KEY');
    const gnewsKey = (Deno as any).env.get('VITE_GNEWS_KEY');

    const [res1, res2] = await Promise.all([
      fetch(`https://content.guardianapis.com/search?section=film&show-fields=thumbnail,trailText&api-key=${guardianKey}`),
      fetch(`https://gnews.io/api/v4/top-headlines?category=entertainment&lang=en&apikey=${gnewsKey}`)
    ])

    const data1 = await res1.json()
    const data2 = await res2.json()

    // Combined and mapped to match your NewsPage.jsx props
    const combinedNews = [
      ...(data2.articles || []).map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.image,
        source: a.source?.name || 'GNews',
        publishedAt: a.publishedAt
      })),
      ...(data1.response?.results || []).map((a: any) => ({
        title: a.webTitle,
        description: a.fields?.trailText,
        url: a.webUrl,
        image: a.fields?.thumbnail,
        source: 'The Guardian',
        publishedAt: a.webPublicationDate
      }))
    ]

    return new Response(
      JSON.stringify(combinedNews),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err: any) {
    console.error("Function Error:", err.message)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})