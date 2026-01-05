import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import notFoundImg from "../assets/imgs/missing-image.jpg";
import imdbLogo from "../assets/imgs/icons/imdb.png";
import MovieIDSearch from "../components/MovieIDSearch.jsx";

function Search() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchIDResult, setSearchIDResult] = useState(null);
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
    <div className="main-container">
      <h2>the biggest movies database </h2>

      <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} />
      {loading ? (
        <h2> loading... </h2>
      ) : (
        <>
          {/* {searchResult?.imdbID ||
            (searchIDResult && <button onClick={cancelSearch}>X</button>)} */}

          {/* {loading && <p>Loading...</p>} */}
          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

          <div className="d-flex  flex-wrap gap-4 justify-content-center mt-5">
            {searchResult &&
              !searchIDResult &&
              searchResult.Search?.map((movie) => (
                <div
                  className="movie-card hover-card"
                  key={movie.imdbID}
                  onClick={(e) => movieSearchByID(e, movie.imdbID)}
                  onMouseEnter={() => setHoveredMovieId(movie.imdbID)}
                  onMouseLeave={() => setHoveredMovieId(null)}
                >
                  <img
                    src={movie.Poster !== "N/A" ? movie.Poster : notFoundImg}
                    alt=""
                    onError={(e) => (e.target.src = notFoundImg)}
                    className="movie-image"
                  />
                  {hoveredMovieId === movie.imdbID && (
                    <div className=" movie-overlay">
                      <h3>{movie.Title}</h3>
                      <p>{movie.Year}</p>
                      <p>{movie.Type}</p>{" "}
                    </div>
                  )}
                </div>
              ))}
          </div>
          {searchIDResult && (
            <>
              <button onClick={cancelSearch} className="btn btn-close ">
                <span> Back </span>{" "}
              </button>
              <MovieIDSearch IDResult={searchIDResult} />
            </>
          )}
        </>
      )}
      {/* {JSON.stringify(searchIDResult)} */}
    </div>
  );
}

export default Search;
