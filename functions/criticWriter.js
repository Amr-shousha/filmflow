export async function handler(event) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "prompt is required" }),
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a professional film-critic style review for "${prompt}". 
REQUIREMENTS:
1. Length: Maximum 300 words.
2. Structure: Use at least 3 distinct paragraphs each has a title.
3. Formatting: Separate paragraphs with double newlines (\\n\\n) inside the JSON string.
4. Selection: If multiple versions exist, choose the newest unless a date is specified.

Return ONLY valid JSON with this exact structure:
{
  "summary": "The review text with \\n\\n between paragraphs",
  "corrected_title": "The exact title",
  "omdb_id": "tt1234567"
}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty Gemini response");
    }

    // Remove ```json wrappers
    text = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(text);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    };
  } catch (error) {
    console.error("FUNCTION ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
}
