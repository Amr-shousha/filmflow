import React, { useEffect, useState } from "react";
import ScriptWizard from "../components/ScriptWizard";
import { useSplitTextAnimation } from "../components/UseSplitTextAnimation";

function Senario() {
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { textRef } = useSplitTextAnimation();

  // Helper to fix titles (converts &#39; to ' etc.)
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    async function fetchMasterclasses() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/.netlify/functions/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: "interviews/Masterclasses script writing",
            resultsnum: 6,
          }),
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(`Failed to fetch resources: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchMasterclasses();
  }, []);

  return (
    <div className="container">
      <div className="text-center mb-5">
        <h1 className="display-5 " ref={textRef}>
          Screenplay Architect
        </h1>
        <p className="">Draft your story beats and learn from the masters.</p>
      </div>

      <section className="mb-5">
        <ScriptWizard />
      </section>

      <hr className="my-5 border-secondary opacity-25" />

      {!loading && <h2 className="mb-4">Writing Masterclasses</h2>}

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-accent"></div>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Using the same container class as the News page */}
      <div className="articles-container">
        {results &&
          results.items &&
          results.items.map((video) => (
            <a
              className="article-link"
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              key={video.id.videoId}
            >
              {/* Exactly the same structure as your News cards */}
              <div className="raduis article-card hover-card d-flex flex-column h-100">
                <div className="article-image-container">
                  <img
                    className="article-img"
                    src={
                      video.snippet.thumbnails.high
                        ? video.snippet.thumbnails.high.url
                        : video.snippet.thumbnails.medium.url
                    }
                    alt={video.snippet.title}
                  />
                </div>

                <div className="article-details d-flex flex-column justify-content-between flex-grow-1 p-3">
                  <h4 className="title">{decodeHtml(video.snippet.title)}</h4>

                  {/* Simplified description similar to News 'trail' */}
                  <p className="trail">
                    {video.snippet.description.substring(0, 100)}...
                  </p>

                  <div className="d-flex justify-content-between mt-auto">
                    <p className="mb-0 small fw-bold text-accent">
                      {video.snippet.channelTitle}
                    </p>
                    <p className="mb-0 small ">
                      {new Date(video.snippet.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}

export default Senario;
