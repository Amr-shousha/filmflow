import { useState, useEffect } from "react";

export function useMovieSearchByID() {
  const [searchIDResult, setSearchIDResult] = useState(null);

  const searchMovieByID = async (e, ID) => {
    e.preventDefault();
    //   setLoading(true);
    //   setError("");
    try {
      const response = await fetch("/.netlify/functions/movieIDSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchInput: ID }),
      });
      const MovieIDResult = await response.json();
      setSearchIDResult(MovieIDResult);
    } catch (err) {
      // setError(err.message || "Something went wrong");
    } finally {
      // setLoading(false);
    }
  };
  return { searchIDResult, setSearchIDResult, searchMovieByID };
}
