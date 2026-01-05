import { useState } from "react";
import imdbLogo from "../assets/imgs/icons/imdb.png";

export default function MovieIDResult({ IDResult, amount = "max" }) {
  const [size, setSize] = useState(amount);
  return (
    <>
      {size == "max" && (
        <div className="raduis movie-details  d-flex flex-wrap justify-content-between align-items-start">
          {/* Left: Poster */}
          {/* Right: Details */}
          <div className="details">
            <h2>{IDResult.Title}</h2>

            <div className="info-box d-flex flex-wrap gap-3">
              <div className="d-flex flex-wrap gap-5 ">
                <p>
                  <strong>
                    {" "}
                    <span>🗓</span> Year:
                  </strong>{" "}
                  {IDResult.Year}
                </p>
                <p>
                  <strong>Type:</strong> {IDResult.Type}
                </p>
                <p>
                  <strong>Genre:</strong> {IDResult.Genre}
                </p>
              </div>

              <p>
                <strong>Runtime:</strong> {IDResult.Runtime}
              </p>
              <p>
                <strong>Genre:</strong> {IDResult.Genre}
              </p>
              <p>
                <strong>Director:</strong> {IDResult.Director}
              </p>
              <p>
                <strong>Writer:</strong> {IDResult.Writer}
              </p>
              <p>
                <strong>Actors:</strong> {IDResult.Actors}
              </p>
              <p>
                <strong>Plot:</strong> {IDResult.Plot}
              </p>
              <p>
                <strong>Metascore:</strong> {IDResult.Metascore}
              </p>
              <p>
                <strong>
                  {" "}
                  <span>
                    <img className="icon" src={imdbLogo} alt="" />
                  </span>
                  IMDB Rating:
                </strong>{" "}
                {IDResult.imdbRating}
              </p>
              <p>
                <strong>
                  {" "}
                  <span>⭐️</span> IMDB Votes:
                </strong>{" "}
                {IDResult.imdbVotes}
              </p>

              {IDResult.totalSeasons && (
                <p>
                  <strong>Total Seasons:</strong> {IDResult.totalSeasons}
                </p>
              )}
            </div>

            {/* Ratings Array */}
            {IDResult.Ratings?.length > 0 && (
              <div className="ratings">
                <strong>Ratings:</strong>
                <ul>
                  {IDResult.Ratings.map((rating, index) => (
                    <li key={index}>
                      {rating.Source}: {rating.Value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>{" "}
          <div className="poster">
            <img
              src={IDResult.Poster !== "N/A" ? IDResult.Poster : notFoundImg}
              alt={IDResult.Title}
              onError={(e) => (e.target.src = notFoundImg)}
            />
          </div>
        </div>
      )}
      {size == "min" && (
        <div className="movie-details d-flex flex-wrap">
          {/* Left: Poster */}
          <div className="poster">
            <img
              src={IDResult.Poster !== "N/A" ? IDResult.Poster : notFoundImg}
              alt={IDResult.Title}
              onError={(e) => (e.target.src = notFoundImg)}
            />
          </div>

          {/* Right: Details */}

          <div className="details  ">
            <h2>{IDResult.Title}</h2>

            <div className="info-box d-flex flex-wrap gap-3">
              <p>
                <strong>
                  {" "}
                  <span>🗓</span> Year:
                </strong>{" "}
                {IDResult.Year}
              </p>
              <p>
                <strong>Type:</strong> {IDResult.Type}
              </p>

              <p>
                <strong>Genre:</strong> {IDResult.Genre}
              </p>
              <p>
                <strong>Director:</strong> {IDResult.Director}
              </p>
              <p>
                <strong>Writer:</strong> {IDResult.Writer}
              </p>
              <p>
                <strong>Actors:</strong> {IDResult.Actors}
              </p>

              <p>
                <strong>
                  {" "}
                  <span>
                    {" "}
                    <img className="icon" src={imdbLogo} alt="" />
                  </span>
                  IMDB Rating:
                </strong>{" "}
                {IDResult.imdbRating}
              </p>

              {IDResult.totalSeasons && (
                <p>
                  <strong>Total Seasons:</strong> {IDResult.totalSeasons}
                </p>
              )}

              <button onClick={() => setSize("max")}>more</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
