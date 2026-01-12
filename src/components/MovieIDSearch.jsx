import { useState } from "react";
import imdbLogo from "../assets/imgs/icons/imdb.png";
import notFoundImg from "../assets/imgs/missing-image.jpg"; // Added missing import

export default function MovieIDResult({ IDResult, amount = "max" }) {
  const [size, setSize] = useState(amount);

  return (
    <div className="summary-result mt-4">
      <div className="row g-4">
        {/* Left/Top: Poster */}
        <div className="col-12 col-md-4 text-center">
          <div className="poster">
            <img
              src={IDResult.Poster !== "N/A" ? IDResult.Poster : notFoundImg}
              alt={IDResult.Title}
              className="img-fluid rounded shadow"
              style={{}}
              onError={(e) => (e.target.src = notFoundImg)}
            />
          </div>
        </div>

        {/* Right: Details */}
        <div className="col-12 col-md-8">
          <div className="details text-start">
            <h2 className="display-6 fw-bold mb-3">{IDResult.Title}</h2>

            <div className="info-box d-flex flex-wrap gap-3 mb-4">
              <span className="badge bg-primary px-3 py-2">
                🗓 {IDResult.Year}
              </span>
              <span className="badge bg-secondary px-3 py-2">
                {IDResult.Genre}
              </span>
              <span className="badge bg-dark border border-secondary px-3 py-2">
                <img
                  className="icon me-1"
                  src={imdbLogo}
                  style={{ width: "18px" }}
                  alt=""
                />
                {IDResult.imdbRating}
              </span>
            </div>

            <div className="row g-2 text-muted mb-4">
              <div className="col-6">
                <strong>Director:</strong> {IDResult.Director}
              </div>
              <div className="col-6">
                <strong>Type:</strong> {IDResult.Type}
              </div>
              <div className="col-12">
                <strong>Actors:</strong> {IDResult.Actors}
              </div>
            </div>

            {size === "max" ? (
              <div className="full-details animate__animated animate__fadeIn">
                <p className="lead border-bottom pb-3 mb-3 italic">
                  "{IDResult.Plot}"
                </p>
                <div className="row g-2">
                  <div className="col-12">
                    <strong>Writer:</strong> {IDResult.Writer}
                  </div>
                  <div className="col-6">
                    <strong>Runtime:</strong> {IDResult.Runtime}
                  </div>
                  <div className="col-6">
                    <strong>Metascore:</strong> {IDResult.Metascore}
                  </div>
                  <div className="col-6">
                    <strong>Votes:</strong> {IDResult.imdbVotes}
                  </div>
                  {IDResult.totalSeasons && (
                    <div className="col-6">
                      <strong>Seasons:</strong> {IDResult.totalSeasons}
                    </div>
                  )}
                </div>

                {IDResult.Ratings?.length > 0 && (
                  <div className="mt-4 p-3 bg-dark rounded border border-secondary">
                    <h6 className="fw-bold">Critique Scores:</h6>
                    <ul className="list-unstyled m-0">
                      {IDResult.Ratings.map((rating, index) => (
                        <li
                          key={index}
                          className="small d-flex justify-content-between"
                        >
                          <span>{rating.Source}</span>
                          <span className="text-accent">{rating.Value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  className="btn btn-sm btn-outline-secondary mt-3"
                  onClick={() => setSize("min")}
                >
                  Show Less
                </button>
              </div>
            ) : (
              <button
                className="btn btn-accent mt-2 px-4"
                onClick={() => setSize("max")}
              >
                View Full Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
