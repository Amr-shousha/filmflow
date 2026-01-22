import iconSubmit from "../assets/imgs/icons/submit.png";
import React, { useState } from "react";
import MovieIDSearch from "../components/MovieIDSearch";
import { useSplitTextAnimation } from "../components/UseSplitTextAnimation";
import SearchBar from "../components/SearchBar";
function PlotSummarizer() {
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
      const response = await fetch("/.netlify/functions/plotSummarizer", {
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
      <h1 className="display-5" ref={textRef}>
        plot summary
      </h1>
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
          <h3>summary about {input}: </h3>
          {summary && (
            <>
              {" "}
              <p> {summary.summary} </p>
              {searchIDResult && (
                <MovieIDSearch IDResult={searchIDResult} amount={"min"} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PlotSummarizer;
