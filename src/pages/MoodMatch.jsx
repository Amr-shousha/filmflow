import iconSubmit from "../assets/imgs/icons/submit.png";
import React, { useEffect, useState } from "react";
import MovieIDSearch from "../components/MovieIDSearch";
import { useSplitTextAnimation } from "../components/UseSplitTextAnimation";
import { supabase } from "../lib/supabaseClient";
import Watchlist from "./WatchList";
import { handleDragScroll } from "../front-end-functions/hasndleDragScroll";
function MoodReccomendations({ user }) {
  const [mood, setMood] = useState("");
  const [era, setEra] = useState("");
  const [creator, setCreator] = useState("");
  const [result, setResult] = useState(null);

  const [moviesFromSupabase, setMoviesFromSupabase] = useState(null);
  const [enrichedData, setEnrichedData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [watchlistData, setWatchlistData] = useState(null);
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

  async function handleSubmit(isWatchlist = false) {
    setEnrichedData("");
    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      watchlist: isWatchlist,
      movies: moviesFromSupabase || [],
      mood,
      era,
      creator,
    };

    try {
      // Only one call to Supabase
      const { data, error: invokeError } = await supabase.functions.invoke(
        "moodRecomendation", // Matches your folder with one 'm'
        { body: payload },
      );

      if (invokeError) throw new Error(invokeError.message);
      if (!data || !Array.isArray(data))
        throw new Error("AI returned invalid format");

      setResult(data);

      // Enriched data fetch
      const movieSearchPromises = data.map(async (movie) => {
        try {
          const { data: movieDetails } = await supabase.functions.invoke(
            "movieIDSearch",
            { body: { searchInput: movie.omdb_id } },
          );
          return { ...movie, details: movieDetails };
        } catch (e) {
          return movie;
        }
      });

      const finalResults = await Promise.all(movieSearchPromises);
      setEnrichedData(finalResults);
    } catch (err) {
      console.error("Critical Error:", err);
      // This will now show the REAL error from the backend (like "Empty Gemini response")
      setError(err.message || "Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  }
  // Update your buttons:
  // <button onClick={() => handleSubmit(false)}>Recommend randomly</button>
  // <button onClick={() => handleSubmit(true)}>Recommend from Watchlist</button>
  let moviesData;
  async function fetchMyWatchlist() {
    if (user) {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching:", error);
      } else {
        setMoviesFromSupabase(data);
        moviesData = data;
      }
      console.log("my watch list :", moviesData);
    }
  }

  useEffect(() => {
    if (user) fetchMyWatchlist();
  }, [user]);

  // async function handleSubmit2() {
  //   if (!moviesFromSupabase || moviesFromSupabase.length === 0) {
  //     return alert("Your watchlist is empty! Add some movies first.");
  //   }
  //   setEnrichedData("");
  //   setLoading(true);
  //   setError("");
  //   setResult(null);
  //   const currentPayload = {
  //     watchlist: true,
  //     movies: moviesFromSupabase,
  //     mood: mood,
  //     era: era,
  //     creator: creator,
  //   };

  //   // 3. Update state so the UI knows, but use the local variable for the fetch
  //   setWatchlistData(currentPayload);

  //   try {
  //     const response = await fetch("/.netlify/functions/moodRecommendation", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt: currentPayload }),
  //     });

  //     if (!response.ok) throw new Error(`AI Error: ${response.status}`);

  //     const moodData = await response.json();
  //     console.log(" row from mood function" + response);
  //     setResult(moodData);

  //     const movieSearchPromises = moodData.map(async (movie) => {
  //       try {
  //         const res = await fetch("/.netlify/functions/movieIDSearch", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ searchInput: movie.omdb_id }),
  //         });
  //         const movieDetails = await res.json();
  //         return { ...movie, details: movieDetails };
  //       } catch (innerErr) {
  //         console.error(
  //           `Failed to fetch details for ${movie.omdb_id}`,
  //           innerErr,
  //         );
  //         return movie;
  //       }
  //     });

  //     const finalResults = await Promise.all(movieSearchPromises);
  //     setEnrichedData(finalResults);
  //   } catch (err) {
  //     console.error("Critical Error:", err);
  //     setError("Failed to fetch recommendations. Please try again.");
  //   } finally {
  //     setLoading(false);
  //     setMood("");
  //     setEra("");
  //     setCreator("");
  //   }
  // }

  return (
    <div className=" container ">
      <div className="mood-main-container">
        <h1 className="display-5 mb-4" ref={textRef}>
          Mood Match{" "}
        </h1>
        <p className="text-start">Moods: </p>
        <div
          className="mood-container mb-3"
          onMouseEnter={(e) => handleDragScroll(e)}
          style={{ display: "flex", gap: "10px", overflowX: "auto" }}
        >
          {filters.moods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(mood === m.id ? "" : m.id)}
              className={`mood-chip ${mood === m.id ? "active" : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p>Creators: </p>
        <div
          className="mood-container mb-3"
          onMouseEnter={(e) => handleDragScroll(e)}
          style={{ display: "flex", gap: "10px", overflowX: "auto" }}
        >
          {filters.creators.map((m) => (
            <button
              key={m.id}
              onClick={() => setCreator(creator === m.id ? "" : m.id)}
              className={`mood-chip ${creator === m.id ? "active" : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p>Eras: </p>

        <div
          className="mood-container mb-4"
          onMouseEnter={(e) => handleDragScroll(e)}
          style={{ display: "flex", gap: "10px", overflowX: "auto" }}
        >
          {filters.eras.map((m) => (
            <button
              key={m.id}
              onClick={() => setEra(era === m.id ? "" : m.id)}
              className={`mood-chip ${era === m.id ? "active" : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-100 row gx-4 gap-2 justify-content-center">
        <button
          onClick={() => handleSubmit(false)}
          className="btn btn-primary mood-chip  col-md-4 px-4 py-2"
          disabled={loading}
        >
          {loading ? "Finding films..." : "Recommend randomly"}
        </button>

        {user && (
          <button
            onClick={() => handleSubmit(true)}
            className="btn btn-primary mood-chip col-md-4 px-4 py-2"
            disabled={loading}
          >
            {loading ? "Finding films..." : "Recommend from Watchlist"}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {enrichedData &&
        enrichedData.map((movie) => (
          <div
            key={movie.omdb_id}
            className="recommendation-card p-4 mt-4"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
            }}
          >
            <h4 className="text-white mb-2">{movie.corrected_title}</h4>
            <p className="text-muted small mb-4">{movie.summary}</p>
            <MovieIDSearch
              IDResult={movie.details}
              amount={"min"}
              user={user}
            />
          </div>
        ))}
    </div>
  );
}

export default MoodReccomendations;
