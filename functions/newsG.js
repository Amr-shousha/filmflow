export async function handler() {
  try {
    const randomPage = Math.floor(Math.random() * 3) + 1; //1-3
    const [res1, res2] = await Promise.all([
      fetch(
        `https://content.guardianapis.com/search?section=film&page=${randomPage}&order-by=newest&page-size=10&show-fields=thumbnail,trailText&api-key=2ec27675-9eac-4964-ac30-92aa500397d3`
      ),
      fetch(
        `https://gnews.io/api/v4/top-headlines?category=entertainment&lang=en&max=10&apikey=a9b96461faa1003ae173bea46e7bdf42`
      ),
    ]);

    if (!res1.ok) {
      throw new Error(`Guardian API error: ${res1.status}`);
    } else if (!res2.ok) {
      throw new Error(`GNews API error: ${res2.status}`);
    }
    const GNewsData = await res2.json();
    const GardianData = await res1.json();

    function normalizeGNews(article) {
      return {
        id: article.url, // GNews has no id
        title: article.title,
        description: article.description ?? null,
        image: article.image ?? null,
        url: article.url,
        source: article.source?.name ?? "GNews",
        publishedAt: article.publishedAt,
        by: "GNews",
      };
    }
    function normalizeGuardianNews(article) {
      return {
        id: article.id,
        title: article.webTitle,
        description: article.fields?.trailText ?? null,
        image: article.fields?.thumbnail ?? null,
        url: article.webUrl,
        source: "The Guardian",
        publishedAt: article.webPublicationDate,
        by: "The Guardian",
      };
    }
    const normalizedGNews = GNewsData.articles.map(normalizeGNews);
    const normalizedGuardianNews = GardianData.response.results.map(
      normalizeGuardianNews
    );
    const allArticles = [...normalizedGNews, ...normalizedGuardianNews].sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    function shuffleArray(array) {
      const newArr = [...array]; // copy to avoid mutating original
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; // swap
      }
      return newArr;
    }
    const finalArticles = shuffleArray(allArticles);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(finalArticles),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

//&country=us
