export async function handler(event) {
  const APIKey = "9009cb9a";
  try {
    const { searchInput } = JSON.parse(event.body);

    // fetch API and wait for JSON
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${APIKey}&s=${searchInput}`
    );
    const data = await response.json();

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
