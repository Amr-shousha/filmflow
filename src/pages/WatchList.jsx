import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AddToFavorite from "../components/AddToFavorite.jsx";
import { useMovieSearchByID } from "../front-end-functions/useSearchMovieByID.js";
import MovieIDSearch from "../components/MovieIDSearch.jsx";
import notFoundImg from "../assets/imgs/missing-image.jpg";
import { useSplitTextAnimation } from "../components/UseSplitTextAnimation";

export default function Watchlist({ user }) {
  const { textRef } = useSplitTextAnimation();
  const [movies, setMovies] = useState([]);
  const { searchIDResult, setSearchIDResult, searchMovieByID } =
    useMovieSearchByID();
  function cancelSearch() {
    setSearchIDResult(null);
  }
  useEffect(() => {
    if (user) fetchMyWatchlist();
  }, [user]);

  async function fetchMyWatchlist() {
    // 1. جيب بيانات المستخدم اللي مسجل حالياً

    if (user) {
      // 2. اسأل الداتابيز عن أفلامه هو بس
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id); // دي أهم حتة (Filter)

      if (error) {
        console.error("Error fetching:", error);
      } else {
        setMovies(data);
        console.log(data);
      }
    }
  }

  return (
    <div className="">
      <h1 className="text-center display-5  " ref={textRef}>
        My WatchList
      </h1>

      {!searchIDResult && (
        <div className="row  row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 mt-5    g-4 mt-5 justify-content-center">
          {" "}
          {movies.length !== 0 ? (
            // JSON.stringify(movies)
            movies.map((movie) => {
              const dbMovie = {
                imdbID: movie.movie_id, // حولنا movie_id لـ imdbID
                Title: movie.movie_title, // حولنا movie_title لـ Title
                Poster: movie.poster_path, // حولنا poster_path لـ Poster
              };
              return (
                <div className="col" key={movie.movie_id}>
                  <div
                    className="movie-card hover-card h-100"
                    onClick={(e) => searchMovieByID(e, movie.movie_id)}
                  >
                    <div className="position-relative h-100">
                      <img
                        src={
                          movie.poster_path !== "N/A"
                            ? movie.poster_path
                            : notFoundImg
                        }
                        alt={movie.movie_title}
                        onError={(e) => (e.target.src = notFoundImg)}
                        className="img-fluid w-100 h-100 movie-image"
                        style={{ objectFit: "cover" }}
                      />

                      {/* The Overlay: Data is back and controlled by the movie-card hover */}
                      <div className="movie-overlay p-3">
                        {/* <h6 className="fw-bold mb-1">{movie.Title}</h6>
                  <p className="small mb-1">{movie.Year}</p>
                  <span className="badge bg-light text-dark small">
                  {movie.Type}
                  </span> */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <AddToFavorite user={user} movie={dbMovie} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center w-100">
              start adding movies to your eatch list
            </p>
          )}
        </div>
      )}
      {searchIDResult && (
        <div className="mt-4 p-4 rounded bg-dark border border-secondary shadow-lg">
          <button onClick={cancelSearch} className="btn btn-outline-light mb-3">
            <span> ← Back to Results </span>
          </button>
          <MovieIDSearch IDResult={searchIDResult} />
        </div>
      )}
    </div>
  );
}
