//src/pages/CriticsWriter.jsx
import iconSubmit from "../assets/imgs/icons/submit.png";
import React, { useState } from "react";
import { useSplitTextAnimation } from "../components/UseSplitTextAnimation";
import SearchBar from "../components/SearchBar";
import MovieIDSearch from "../components/MovieIDSearch";
function CriticsWriter() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState(""); // Store HF response
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error handling
  const [searchIDResult, setSearchIDResult] = useState(null);
  const { textRef } = useSplitTextAnimation();

  const movieSearchByID = async (ID) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/.netlify/functions/movieIDSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchInput: ID }),
      });
      const MovieIDResult = await response.json();
      setSearchIDResult(MovieIDResult);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch("/.netlify/functions/criticWriter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setSummary(data);
      console.log(JSON.stringify(data));
      movieSearchByID(data.omdb_id);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch news. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="container">
      {!loading && (
        <h1 className="display-5" ref={textRef}>
          Professional AI critique
        </h1>
      )}
      <SearchBar
        setSearchInput={setInput}
        searchInput={input}
        autoSubmit={false}
        handleSubmit={handleSubmit}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <div className="summary-result">
          {/* Use the AI title if available, otherwise use the input */}
          <h3>{summary.corrected_title || input}:</h3>

          <div className="critique-body">
            {/* Added the whiteSpace style here to fix the paragraph issue */}
            <div className="Critique">{summary.summary}</div>

            {searchIDResult && (
              <div className="mt-4">
                <MovieIDSearch IDResult={searchIDResult} amount={"min"} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CriticsWriter;
