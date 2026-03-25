import { useEffect, useState } from "react"; // 1. لازم نستورد useState
import { supabase } from "../lib/supabaseClient";

function AddToFavorite({ user, movie }) {
  // 2. التصحيح: بنستخدم useState عشان نخزن حالة الفيلم مش useEffect
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (user && movie) {
      checkIfAdded();
    }
  }, [user, movie]);

  const checkIfAdded = async () => {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movie.imdbID)
      .single();

    if (data) setIsAdded(true);
    // لو الفيلم مش موجود سوبابيز بيرجع خطأ PGRST116 وده طبيعي فمش لازم نطبعه
    if (error && error.code !== "PGRST116") console.log(error);
  };

  const handelWatchlist = async (e) => {
    // 3. مهم جداً عشان الأب ميفهمش إنك ضغطت على الكارت كله
    e.stopPropagation();

    if (!user) {
      alert("log in first !");
      return;
    }

    if (isAdded) {
      // حذف
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movie.imdbID);

      if (!error) {
        setIsAdded(false);
        alert("movie deleted ");
      }
    } else {
      // إضافة
      const { error } = await supabase.from("favorites").insert([
        {
          user_id: user.id,
          movie_id: movie.imdbID,
          movie_title: movie.Title,
          poster_path: movie.Poster,
        },
      ]);

      if (error) {
        console.log("Error:", error.message);
      } else {
        setIsAdded(true);
        alert(`${movie.Title} اتضاف للمفضلة! ✅`);
      }
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        className={"add-to-favorite"}
        onClick={handelWatchlist}
      >
        {isAdded ? "❤️ Remove from Watchlist" : "🤍 Add to Watchlist"}
      </button>
    </div>
  );
}

export default AddToFavorite;
