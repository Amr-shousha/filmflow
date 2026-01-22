import iconSubmit from "../assets/imgs/icons/submit.png";
import React, { useState } from "react";
import MovieIDSearch from "../components/MovieIDSearch";
import { useSplitTextAnimation } from "../components/UseSplitTextAnimation";

function MoodReccomendations() {
  const [mood, setMood] = useState("");
  const [era, setEra] = useState("");
  const [creator, setCreator] = useState("");

  const [result, setResult] = useState(null); // Changed to null for cleaner conditional rendering
  const [enrichedData, setEnrichedData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { textRef } = useSplitTextAnimation();

  const filters = {
    moods: [
      { id: "blockbuster", label: "🔥 Blockbuster" },
      { id: "feel-good", label: "🎈 Feel Good" },
      { id: "thriller", label: "🔪 Edge of Seat" },
      { id: "mind-bend", label: "🧠 Brain Bender" },
      { id: "adrenaline", label: "🏃‍♂️ High Octane" },
      { id: "cozy", label: "🧸 Cozy & Warm" },
      { id: "gritty", label: "⛓️ Gritty Noir" },
      { id: "tear-jerker", label: "😭 Emotional" },
      { id: "satirical", label: "🃏 Dark Comedy" },
      { id: "spooky", label: "👻 Spooky Vibes" },
      { id: "epic", label: "🗺️ Grand Adventure" },
      { id: "romantic", label: "💖 Romantic" },
      { id: "mysterious", label: "🔍 Mystery" },
    ],
    eras: [
      { id: "golden-age", label: "🎬 Hollywood Classics" },
      { id: "new-wave", label: "🎨 Artistic 60s-70s" },
      { id: "retro", label: "📺 Retro 80s" },
      { id: "vcr-era", label: "📼 Grungy 90s" },
      { id: "y2k", label: "💿 Y2K Era" },
      { id: "modern", label: "💎 Modern" },
      { id: "cutting-edge", label: "✨ Ultra Modern" },
    ],
    creators: [
      { id: "award-winning", label: "🏆 Award Winners" },
      { id: "indie", label: "🎨 Indie Gems" },
      { id: "visionary", label: "👁️ Auteur Driven" },
      { id: "hidden-treasures", label: "🕵️ Deep Cuts" },
      { id: "global", label: "🌍 Global Cinema" },
      { id: "crowd-pleaser", label: "🍿 Popcorn Hits" },
      { id: "experimental", label: "🧪 Avant-Garde" },
      { id: "under-radar", label: "💤 Sleeper Hits" },
      { id: "cult-classic", label: "🍄 Cult Classics" },
    ],
  };

  //   async function handleSubmit() {
  //     setLoading(true);
  //     setError("");
  //     setResult(null); // Clear previous results when searching again

  //     const payload = {
  //       mood: mood,
  //       era: era,
  //       creator: creator,
  //     };

  //     try {
  //       const response = await fetch("/.netlify/functions/moodRecommendation", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ prompt: payload }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Server error: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       setResult(data);
  //       console.log(data);
  //       /////////////////////////////////

  //       const movieSearchByID = data.map(async (movie) => {
  //         const response = await fetch("/.netlify/functions/movieIDSearch", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ searchInput: movie.omdb_id }),
  //         });

  //         const MovieIDResult = await response.json();
  //         //   setSearchIDResult(MovieIDResult);
  //         return { ...movie, details: MovieIDResult };
  //       });

  //       // ...but we WAIT for them here (Outside the .map, inside the Try)
  //       const finalResults = await Promise.all(movieSearchByID);

  //       setEnrichedData(finalResults); // This triggers the UI to show all 3 at once
  //       console.log("Success! All 3 movies enriched:", finalResults);
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to fetch recommendations. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  async function handleSubmit() {
    setEnrichedData("");

    setLoading(true);
    setError("");
    setResult(null);
    const payload = {
      mood: mood,
      era: era,
      creator: creator,
    };
    try {
      const response = await fetch("/.netlify/functions/moodRecommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: payload }),
      });

      if (!response.ok) throw new Error(`AI Error: ${response.status}`);

      const data = await response.json();
      setResult(data);

      // STEP 2: Create the list of Promises
      const movieSearchPromises = data.map(async (movie) => {
        try {
          const res = await fetch("/.netlify/functions/movieIDSearch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ searchInput: movie.omdb_id }),
          });

          const movieDetails = await res.json();

          // Merge AI summary + OMDb details into one object
          return { ...movie, details: movieDetails };
        } catch (innerErr) {
          console.error(
            `Failed to fetch details for ${movie.omdb_id}`,
            innerErr,
          );
          return movie;
        }
      });

      // STEP 3: Wait for all movies to finish (inside the main Try)
      const finalResults = await Promise.all(movieSearchPromises);

      setEnrichedData(finalResults);
      console.log("Success! All movies enriched:", finalResults);
    } catch (err) {
      console.error("Critical Error:", err);
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
      setMood("");
      setEra("");
      setCreator("");
    }
  }

  return (
    <div className="container ">
      <h1 className="display-5 mb-4" ref={textRef}>
        Mood Match{" "}
      </h1>

      {/* Mood Filter Row */}
      <div
        className="mood-container mb-3"
        style={{ display: "flex", gap: "10px", overflowX: "auto" }}
      >
        {filters.moods.map((m) => (
          <button
            key={m.id}
            onClick={() => setMood(m.id)}
            className={`mood-chip ${mood === m.id ? "active" : ""}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Creator Filter Row */}
      <div
        className="mood-container mb-3"
        style={{ display: "flex", gap: "10px", overflowX: "auto" }}
      >
        {filters.creators.map((m) => (
          <button
            key={m.id}
            onClick={() => setCreator(m.id)}
            className={`mood-chip ${creator === m.id ? "active" : ""}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Era Filter Row */}
      <div
        className="mood-container mb-4"
        style={{ display: "flex", gap: "10px", overflowX: "auto" }}
      >
        {filters.eras.map((m) => (
          <button
            key={m.id}
            onClick={() => setEra(m.id)}
            className={`mood-chip ${era === m.id ? "active" : ""}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => handleSubmit()}
        className="btn btn-primary mood-chip px-4 py-2"
        disabled={loading}
      >
        {loading ? "Finding films..." : "Recommend . . ."}
      </button>

      {error && (
        <p className="mt-3" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Results Section */}

      {enrichedData &&
        enrichedData.map((movie) => (
          <div
            key={movie.omdb_id}
            className="recommendation-card p-4"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
            }}
          >
            <h4 className="text-white mb-2">{movie.corrected_title}</h4>
            <p className="text-muted small mb-4">{movie.summary}</p>
            {/* This child component handles its own fetch using the ID provided here */}
            <MovieIDSearch IDResult={movie.details} amount={"min"} />
          </div>
        ))}
    </div>
  );
}

export default MoodReccomendations;
