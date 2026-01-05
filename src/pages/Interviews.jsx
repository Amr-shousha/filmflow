import React, { useState } from "react";
import iconSubmit from "../assets/imgs/icons/submit.png";

function Interviews() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState(""); // Store HF response
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error handling

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults("");
    const FinalInput = `${input} interview -music -gaming -tutorial -vlog`;
    try {
      const response = await fetch("/.netlify/functions/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: FinalInput, resultsnum: 10 }),
      });
      // const response = await fetch(
      //   "/.netlify/functions/THIS_FUNCTION_DOES_NOT_EXIST",
      //   { method: "POST" }
      // );

      // 2. Handle HTTP errors (404, 500, etc)
      if (!response.ok) {
        // Try to get error message from server, fallback to status
        const errorMessage = data.error?.message || `Error: ${response.status}`;
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

  return (
    <div className="main-container">
      <h1>interviews</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={input}
            placeholder="Enter movie or show"
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="submit-btn" type="submit">
            <img src={iconSubmit} alt="Submit" />
          </button>
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Check if results exists and has the 'items' array from YouTube */}
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
                <div key={video.id.videoId} className="video-item  hover-card">
                  {/* 1. Thumbnail Image */}
                  <div className="video-img-container">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      className="video-img"
                    />
                  </div>
                  <div className="video-content-details  details-hover">
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

export default Interviews;
