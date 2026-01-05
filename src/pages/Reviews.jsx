import React, { useEffect, useState } from "react";
import iconSubmit from "../assets/imgs/icons/submit.png";

function Reviews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async function () {
      setLoading(true);
      setError("");
      setNews([]);
      try {
        const response = await fetch("/.netlify/functions/newsG", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        setNews(data);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch news: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);
  function truncateWords(text, wordLimit = 20) {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  }

  return (
    <div className="main-container d-flex flex-wrap">
      {/* <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={input}
            placeholder="Enter movie or show"
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <img src={iconSubmit} alt="Submit" />
          </button>
        </div>
      </form> */}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && <h2>latest entertainment news </h2>}

      <div className="articles-container">
        {news &&
          news.map((article) => (
            <a
              className="article-link"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="article-card hover-card d-flex flex-column  "
                key={article.id}
              >
                <div className="article-image-container">
                  <img
                    className="article-img"
                    src={article.image ? article.image : iconSubmit}
                    alt=""
                  />
                </div>

                <div className="details-hover article-details d-flex flex-column  justify-content-between ">
                  <h4 className="title">{article.title}</h4>

                  <p className="trail">{truncateWords(article.description)}</p>
                  <div className="d-flex justify-content-between">
                    <p>{article.source}</p>{" "}
                    <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>{" "}
            </a>
          ))}
      </div>
    </div>
  );
}

export default Reviews;
