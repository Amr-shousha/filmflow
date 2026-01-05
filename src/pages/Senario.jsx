import React, { useEffect, useState } from "react";
import ScriptWizard from "../components/ScriptWizard";

function Senario() {
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error handling

  useEffect(() => {
    async function handleSubmit() {
      setLoading(true);
      setError(null);
      const query = "nterviews/Masterclasses script writing ";
      try {
        const response = await fetch("/.netlify/functions/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query, resultsnum: 6 }),
        });

        if (!response.ok) {
          // Try to get error message from server, fallback to status
          const errorMessage =
            data.error?.message || `Error: ${response.status}`;
          throw new Error(errorMessage);
        }
        const data = await response.json();
        console.log(JSON.stringify(data));
        setResults(data);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch news. Please try again. ${err}`);
      } finally {
        setLoading(false);
      }
    }
    handleSubmit();
  }, []);

  return (
    <div className="main-container">
      <h1>Screenplay</h1>

      <ScriptWizard />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3> youtube </h3>
      {results && results.items && (
        <div className="news-result ">
          <div className="d-flex  flex-wrap gap-2 justify-content-center">
            {results.items.map((video) => (
              <a
                className="article-link"
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <div
                  key={video.id.videoId}
                  className="video-item  hover-card raduis"
                >
                  {/* 1. Thumbnail Image */}
                  <div className="video-img-container">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      className="video-img"
                    />
                  </div>

                  <div className="video-content-details ">
                    <p className="video-title">{video.snippet.title}</p>

                    {/* 3. Link to YouTube using the Video ID */}

                    {/* 4. Description */}
                    <p>{video.snippet.description.substring(0, 100)}...</p>
                    <div className="d-flex justify-content-between">
                      <p>{video.snippet.channelTitle}</p>

                      <p>
                        {new Date(
                          video.snippet.publishedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {/* 2. Video Title */}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Senario;
