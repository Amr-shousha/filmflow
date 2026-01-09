import React, { useState } from "react";
import { jsPDF } from "jspdf";

const BEATS = [
  {
    id: "title",
    label: "Movie Title",
    hint: "What is the name of your masterpiece?",
  },
  {
    id: "opening",
    label: "Opening Image",
    hint: "The first visual. Sets the tone and shows the 'before' world.",
  },
  {
    id: "theme",
    label: "Theme Stated",
    hint: "A character hints at the 'moral' or lesson of the story.",
  },
  {
    id: "setup",
    label: "The Set-up",
    hint: "Show the hero’s normal life and their primary flaws.",
  },
  {
    id: "catalyst",
    label: "The Catalyst",
    hint: "The life-changing event that kicks off the story.",
  },
  {
    id: "debate",
    label: "The Debate",
    hint: "The hero doubts themselves. 'Can I really do this?'",
  },
  {
    id: "break2",
    label: "Break Into Two",
    hint: "The hero leaves home and enters the 'New World'.",
  },
  {
    id: "bstory",
    label: "B Story",
    hint: "A new character appears to help the hero learn the theme.",
  },
  {
    id: "fungames",
    label: "Fun and Games",
    hint: "The 'trailer' moments. The hero explores and uses new skills.",
  },
  {
    id: "midpoint",
    label: "Midpoint",
    hint: "A big event that raises the stakes—false victory or defeat.",
  },
  {
    id: "badguys",
    label: "Bad Guys Close In",
    hint: "Internal flaws and external threats make life harder.",
  },
  {
    id: "alllost",
    label: "All Is Lost",
    hint: "Rock bottom. Something 'dies' (literally or figuratively).",
  },
  {
    id: "darknight",
    label: "Dark Night of the Soul",
    hint: "The hero mourns and realizes how they must change.",
  },
  {
    id: "break3",
    label: "Break Into Three",
    hint: "The 'Aha!' moment. The hero finds the solution.",
  },
  {
    id: "finale",
    label: "The Finale",
    hint: "The final showdown. The hero proves they have changed.",
  },
  {
    id: "finalimg",
    label: "Final Image",
    hint: "The last shot. Mirrors the opening to show the change.",
  },
];

export default function ScriptWizard() {
  const [slide, setSlide] = useState(0);
  const [scriptData, setScriptData] = useState({});
  const [finalScript, setFinalScript] = useState(""); // This must stay a string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInput = (id, value) => {
    setScriptData((prev) => ({ ...prev, [id]: value }));
  };

  const nextSlide = () =>
    setSlide((cur) => (cur < BEATS.length - 1 ? cur + 1 : cur));
  const prevSlide = () => setSlide((cur) => (cur > 0 ? cur - 1 : 0));
  const generateFinalScript = async () => {
    setLoading(true);
    setError(null);
    setFinalScript("");

    try {
      const response = await fetch("/.netlify/functions/scriptWritier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: scriptData }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      /** * FIX: Ensure we save only the string.
       * If data is { script: "text" }, we take data.script.
       */
      const scriptText =
        data.script || (typeof data === "string" ? data : JSON.stringify(data));
      setFinalScript(scriptText);
    } catch (err) {
      console.error(err);
      setError("Failed to generate the script. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (text) => {
    const doc = new jsPDF();
    const title = scriptData?.title || "My Script";

    doc.setFont("courier", "bold");
    doc.setFontSize(18);
    doc.text("SCREENPLAY TREATMENT", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("courier", "normal");

    // Ensure text is a string before splitting
    const content = typeof text === "string" ? text : JSON.stringify(text);
    const lines = doc.splitTextToSize(content, 170);
    let y = 40;

    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 7;
    });

    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };

  const currentBeat = BEATS[slide];

  return (
    <div className="page-wrapper container pb-5">
      <div className="text-center mb-5">
        {/* <h1 className="display-5 fw-bold text-accent">Screenplay Architect</h1> */}
        <p className="">
          Fill out the 16 professional story beats to build your script.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {loading ? (
            <div className="summary-result text-center p-5">
              <div
                className="spinner-border text-accent mb-3"
                role="status"
              ></div>
              <h3>Drafting your masterpiece...</h3>
              <p className="">
                The AI is structuring your beats into professional Fountain
                syntax.
              </p>
            </div>
          ) : (
            <>
              {/* Progress Tracker */}
              <div className="mb-4">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Beat: {currentBeat.label}</span>
                  <span>
                    {Math.round(((slide + 1) / BEATS.length) * 100)}% Complete
                  </span>
                </div>
                <div
                  className="progress"
                  style={{ height: "10px", background: "#1e1e22" }}
                >
                  <div
                    className="progress-bar bg-accent"
                    role="progressbar"
                    style={{
                      width: `${((slide + 1) / BEATS.length) * 100}%`,
                      transition: "0.5s",
                    }}
                  ></div>
                </div>
              </div>

              {/* Beat Input Card */}
              <div className="hover-card p-4 p-md-5 mb-4">
                <h2 className="h4 text-accent mb-2">
                  {slide + 1}. {currentBeat.label}
                </h2>
                <p className=" small mb-4">{currentBeat.hint}</p>
                <textarea
                  className="script-textarea"
                  value={scriptData[currentBeat.id] || ""}
                  onChange={(e) => handleInput(currentBeat.id, e.target.value)}
                  placeholder="Enter details for this scene..."
                />
              </div>

              {/* Controls */}
              <div className="d-flex justify-content-between align-items-center">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={prevSlide}
                  disabled={slide === 0}
                >
                  Previous
                </button>
                {slide < BEATS.length - 1 ? (
                  <button
                    className="btn btn-accent px-5 py-2 fw-bold"
                    onClick={nextSlide}
                  >
                    Next Beat →
                  </button>
                ) : (
                  <button
                    className="btn btn-success px-5 py-2 fw-bold"
                    onClick={generateFinalScript}
                  >
                    Finalize & Generate
                  </button>
                )}
              </div>
            </>
          )}

          {error && <div className="alert alert-danger mt-4">{error}</div>}

          {/* Result Section - FIX: Safety check for string rendering */}
          {finalScript && (
            <div className="summary-result mt-5 animate__animated animate__fadeIn">
              <h3 className="mb-3 text-center">Your Generated Script</h3>
              <div
                className="script-preview mb-4"
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  fontFamily: "'Courier Prime', monospace",
                  background: "#000",
                  color: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                {/* Rendering the string safely */}
                {typeof finalScript === "string"
                  ? finalScript
                  : "Error: Script format is invalid."}
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary btn-lg px-5"
                  onClick={() => downloadPDF(finalScript)}
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
