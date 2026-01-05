import { GoogleGenAI } from "@google/genai";

export async function handler(event) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const { prompt } = JSON.parse(event.body);
  try {
    // Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `can you summarize with spoiling(not the one from IMDB) the movie/show ${prompt} in max 100 words,
                and also provide two pieces of data in the response:
                1) corrected version of the movie title
                2) its ID on OMDB.
                Respond ONLY with JSON, no extra text.`,
    });

    // Gemini may return ```json ... ``` — remove these
    let cleanText = response.text.replace(/```json|```/g, "").trim();

    // Parse JSON safely
    let res = JSON.parse(cleanText);

    // Return clean JSON to frontend
    const final = {
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      title: "movie title",
      id: "tt2802850",
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(res),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
//the response currently from gemeni {"summary":"In the summer of 1983 in northern Italy, 17-year-old Elio Perlman meets Oliver, a charming American graduate student interning with Elio's professor father. Their initial polite tension evolves into a passionate, secret romance. They spend weeks bicycling, swimming, reading, and exploring their burgeoning feelings amidst the picturesque Italian landscape. Their intense bond deepens quickly, leading to a profound, bittersweet first love that profoundly impacts Elio. As Oliver's departure looms, they confront the beautiful impermanence of their summer affair and its lasting emotional imprint.","corrected_title":"Call Me by Your Name","omdb_id":"tt5726616"}
