//src/pages/Interviews.jsx
import React, { useState } from "react";
import iconSubmit from "../assets/imgs/icons/submit.png";
import { useSplitTextAnimation } from "../components/UseSplitTextAnimation";

function Interviews() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState(""); // Store HF response
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error handling
  const { textRef } = useSplitTextAnimation();

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
      <h1 className="display-5 mb-4" ref={textRef}>
        Interviews
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            className="form-control"
            value={input}
            placeholder="Search movie or show interviews..."
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </form>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}

      {results?.items && (
        <div className="row g-4">
          {results.items.map((video) => (
            <div className="col-12 col-md-6 col-lg-4" key={video.id.videoId}>
              <a
                className="text-decoration-none"
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noreferrer"
              >
                <div className="hover-card d-flex flex-column h-100">
                  <div className="video-img-container">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      className="video-img"
                      alt=""
                    />
                  </div>
                  <div className="p-3 d-flex flex-column flex-grow-1">
                    <h5 className="video-title text-white">
                      {video.snippet.title}
                    </h5>
                    <p className="small text-muted mb-3">
                      {video.snippet.description.substring(0, 80)}...
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="badge bg-secondary">
                        {video.snippet.channelTitle}
                      </span>
                      <small className="text-muted">
                        {new Date(
                          video.snippet.publishedAt,
                        ).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Interviews;
