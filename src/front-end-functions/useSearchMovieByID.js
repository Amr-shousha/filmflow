//Remove
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useMovieSearchByID() {
  const [searchIDResult, setSearchIDResult] = useState(null);

  const searchMovieByID = async (e, ID) => {
    e.preventDefault();
    //   setLoading(true);
    //   setError("");
    try {
      // 1. The Invoke call
      const { data, error: functionError } = await supabase.functions.invoke(
        "movieIDSearch",
        {
          body: { searchInput: ID },
        },
      );
      if (functionError) {
        throw new Error(functionError.message || "Failed to fetch movie data");
      }

      // 3. Success!
      setSearchIDResult(data);
    } catch (err) {
      console.error("Frontend Error:", err.message);
      // setError(err.message || "Something went wrong");
    } finally {
      // setLoading(false);
    }
  };
  return { searchIDResult, setSearchIDResult, searchMovieByID };
}
