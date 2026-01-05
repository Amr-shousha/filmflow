export async function handler(event) {
  try {
    const { prompt } = JSON.parse(event.body);

    const API_KEY = "sk-59986db0c68a442f8874042b724ae27c";

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const json = await res.json();

    let text = "";

    // Check if DeepSeek returned choices
    if (json.choices && json.choices.length > 0) {
      text = json.choices[0].message?.content || "";
    }
    // If DeepSeek returned an error
    else if (json.error) {
      text = `DeepSeek error: ${json.error.message || JSON.stringify(json.error)}`;
    }
    // Fallback if nothing is returned
    else {
      text = "No response from DeepSeek.";
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
