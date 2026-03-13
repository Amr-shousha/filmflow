import { useState, useEffect } from "react";
import {
  BrowserRouter,
  useNavigate,
  NavLink,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import "../App.css";
import "../Gsap.css";
import Options from "./Options";
import News from "../pages/NewsPage";
import Search from "../pages/serchPage";
import Plot from "../pages/PlotSummarizerPage";
import Interviews from "../pages/Interviews";
import Senario from "../pages/Senario";
import Critique from "../pages/Critique";
import MoodMatch from "../pages/MoodMatch";
import brandLogo from "../assets/imgs/icons/brand-1-1.png";
import AccountIcon from "../assets/imgs/icons/AccountIcon.svg";
import iconReviews from "../assets/imgs/icons/review.png";
import Authentication from "../pages/Authentication";
import { supabase } from "../lib/supabaseClient"; // تأكد من استيراد سوبابيز
export default function App() {
  const [user, setUser] = useState(null); // بنخزن اليوزر هنا بدل true/false
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);
  const handelWatchList = () => {
    if (user) {
      // navigate("/watchlist");
      alert("access granted");
    } else {
      navigate("/authentication", { state: { from: "/watchlist" } });
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark  mb-5 fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand " to="/">
            <img src={brandLogo} style={{ width: "130px" }} alt="" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse " id="navbarNav">
            <ul className="navbar-nav me-auto ">
              <li className="nav-item pt-2 ">
                <NavLink className="nav-link" to="/news">
                  News
                </NavLink>
              </li>
              <li className="nav-item pt-2 ">
                <NavLink className="nav-link" to="/search">
                  Search
                </NavLink>
              </li>
              <li className="nav-item pt-2">
                <NavLink className="nav-link" to="/plot">
                  Plot Summary
                </NavLink>
              </li>
              <li className="nav-item pt-2">
                <a
                  className="nav-link"
                  href="https://www.scriptslug.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Script Library
                </a>
              </li>
              <li className="nav-item pt-2">
                <NavLink className="nav-link" to="/screenplay">
                  Screenplay
                </NavLink>
              </li>
              <li className="nav-item pt-2">
                <NavLink className="nav-link" to="/critique">
                  Critique
                </NavLink>
              </li>
              <li className="nav-item pt-2">
                <NavLink className="nav-link" to="/interviews">
                  Interviews
                </NavLink>
              </li>{" "}
            </ul>
            <ul className="navbar-nav align-items-center">
              <li
                className="nav-item pt-2"
                style={{ cursor: "pointer" }}
                onClick={handelWatchList}
              >
                <span className="nav-link">My WatchList</span>
              </li>

              <li className="nav-item pt-2">
                {user ? (
                  <div className="d-flex align-items-center gap-3 ps-3">
                    {/* اظهر اسم المستخدم اللي جبناه من الميتا داتا */}
                    <span className="text-white small">
                      Hi, {user.user_metadata.full_name}
                    </span>

                    {/* زرار الخروج */}
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => supabase.auth.signOut()}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <NavLink className="nav-link" to="/authentication">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        {" "}
        <Routes>
          <Route path="/" element={<Options />} />
          <Route path="/news" element={<News />} />
          <Route path="/search" element={<Search />} />
          <Route path="/plot" element={<Plot />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/screenplay" element={<Senario />} />
          <Route path="/critique" element={<Critique />} />
          <Route path="/Mood-match" element={<MoodMatch />} />
          <Route path="/authentication" element={<Authentication />} />
        </Routes>
      </div>
    </div>
  );
}
