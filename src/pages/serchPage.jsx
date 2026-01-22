import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import notFoundImg from "../assets/imgs/missing-image.jpg";
import MovieIDSearch from "../components/MovieIDSearch.jsx";
import { useSplitTextAnimation } from "../components/UseSplitTextAnimation";

function Search() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchIDResult, setSearchIDResult] = useState(null);
  const { textRef } = useSplitTextAnimation();

  // We can keep this for logic, but the CSS .movie-card:hover will handle the visual show/hide
  const [hoveredMovieId, setHoveredMovieId] = useState(null);

  useEffect(() => {
    if (!searchInput) return;
    setLoading(true);
    async function handleSubmit() {
      setError("");
      setSearchIDResult(null);
      setSearchResult(null);
      try {
        const response = await fetch("/.netlify/functions/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchInput }),
        });
        const refinedData = await response.json();
        setSearchResult(refinedData);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    handleSubmit();
  }, [searchInput]);

  function cancelSearch() {
    setSearchIDResult(null);
  }

  const movieSearchByID = async (e, ID) => {
    e.preventDefault();
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

  return (
    <div className="container">
      <h1 className="text-center display-5 " ref={textRef}>
        The Biggest Movies Database
      </h1>

      <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} />

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-grow text-accent" role="status"></div>
          <h2 className="mt-3">Loading...</h2>
        </div>
      ) : (
        <>
          {error && (
            <p className="text-center mt-3" style={{ color: "red" }}>
              {error}
            </p>
          )}

          {/* Using Bootstrap Grid: 2 columns on mobile, 4 on desktop */}
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 mt-5">
            {searchResult &&
              !searchIDResult &&
              searchResult.Search?.map((movie) => (
                <div className="col" key={movie.imdbID}>
                  <div
                    className="movie-card hover-card h-100"
                    onClick={(e) => movieSearchByID(e, movie.imdbID)}
                    onMouseEnter={() => setHoveredMovieId(movie.imdbID)}
                    onMouseLeave={() => setHoveredMovieId(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="position-relative h-100">
                      <img
                        src={
                          movie.Poster !== "N/A" ? movie.Poster : notFoundImg
                        }
                        alt={movie.Title}
                        onError={(e) => (e.target.src = notFoundImg)}
                        className="img-fluid w-100 h-100 movie-image"
                        style={{ objectFit: "cover" }}
                      />

                      {/* The Overlay: Data is back and controlled by the movie-card hover */}
                      <div className="movie-overlay p-3">
                        <h6 className="fw-bold mb-1">{movie.Title}</h6>
                        <p className="small mb-1">{movie.Year}</p>
                        <span className="badge bg-light text-dark small">
                          {movie.Type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {searchIDResult && (
            <div className="mt-4 p-4 rounded bg-dark border border-secondary shadow-lg">
              <button
                onClick={cancelSearch}
                className="btn btn-outline-light mb-3"
              >
                <span> ← Back to Results </span>
              </button>
              <MovieIDSearch IDResult={searchIDResult} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Search;
