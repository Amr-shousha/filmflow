import { useState } from "react";
import { BrowserRouter, NavLink, Routes, Route, Link } from "react-router-dom";

import "../App.css";
import Options from "./Options";
import News from "../pages/NewsPage";
import Search from "../pages/serchPage";
import Plot from "../pages/PlotSummarizerPage";
import Interviews from "../pages/Interviews";
import Senario from "../pages/Senario";
import Critique from "../pages/Critique";
import brandLogo from "../assets/imgs/icons/brand-1-1.png";

export default function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark  mb-5 fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
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
            <ul className="navbar-nav  ">
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
        </Routes>
      </div>
    </div>
  );
}
