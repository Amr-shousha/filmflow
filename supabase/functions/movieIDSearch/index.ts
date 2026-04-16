
declare const Deno: any;

// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface SearchRequest {
  searchInput:string
}
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
serve(async(req:Request)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
try{
const { searchInput }: SearchRequest = await req.json();
  const APIKey = "9009cb9a";
const response = await fetch(
      `http://www.omdbapi.com/?apikey=${APIKey}&i=${searchInput}`
    );
    
    const data = await response.json();
return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
}
catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }


})