import React, { useEffect, useState } from "react";
import iconSubmit from "../assets/imgs/icons/submit.png";
import { useSplitTextAnimation } from "../components/UseSplitTextAnimation";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { textRef } = useSplitTextAnimation();

  useEffect(() => {
    const fetchNews = async function () {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/.netlify/functions/newsG", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(`Failed to fetch news: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  function truncateWords(text, wordLimit = 15) {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  }

  return (
    <div className="main-container">
      {" "}
      {/* Removed d-flex flex-wrap from here */}
      {
        <h1 className="display-5" ref={textRef}>
          Latest Entertainment News
        </h1>
      }
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-accent"></div>
        </div>
      )}
      {error && (
        <p className="text-center" style={{ color: "red" }}>
          {error}
        </p>
      )}
      <div className="articles-container">
        {news &&
          news.map((article) => (
            <a
              className="article-link"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              key={article.url} // Use URL or ID
            >
              <div className="article-card hover-card raduis">
                <div className="article-image-container">
                  <img
                    className="article-img"
                    src={article.image ? article.image : iconSubmit}
                    alt=""
                  />
                </div>

                <div className="article-details">
                  <h4 className="title">{article.title}</h4>
                  <p className="trail">{truncateWords(article.description)}</p>

                  <div className="mt-auto d-flex justify-content-between small opacity-75">
                    <span>{article.source}</span>
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}

export default News;
