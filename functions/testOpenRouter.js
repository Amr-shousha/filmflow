import { OpenRouter } from "@openrouter/sdk";

export async function handler(event) {
  try {
    const { prompt } = JSON.parse(event.body);

    const openrouter = new OpenRouter({
      apiKey:
        "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", // use env variable!
    });

    const stream = await openrouter.chat.send({
      model: "tngtech/deepseek-r1t2-chimera:free",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    let text = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        text += content;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
