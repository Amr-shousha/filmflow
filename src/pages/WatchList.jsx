import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMyWatchlist();
  }, []);

  async function fetchMyWatchlist() {
    // 1. جيب بيانات المستخدم اللي مسجل حالياً
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // 2. اسأل الداتابيز عن أفلامه هو بس
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id); // دي أهم حتة (Filter)

      if (error) console.error("Error fetching:", error);
      else {
        setMovies(data);
        console.log(data);
      }
    }
  }

  return <div className="container"></div>;
}
