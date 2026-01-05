export async function handler(event) {
  const { query, resultsnum = 5 } = JSON.parse(event.body);
  const API_KEY = process.env.YOUTUBE_API_KEY;
  console.log("Query://////////////////////////////");

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=24&topicId=/m/02vxn&maxResults=${resultsnum}&key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Comments:", data.items);
    console.log("Query:", query);
    console.log("Count requested:", resultsnum);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
