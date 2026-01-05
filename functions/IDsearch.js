import { useState } from "react";
const movieSearchByID = async (ID) => {
  const [searchIDResult, setSearchIDResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
  return {
    loading,
    error,
    searchIDResult,
  };
};
