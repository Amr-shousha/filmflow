import React, { useState } from "react";
import { jsPDF } from "jspdf";

const BEATS = [
  {
    id: "title", // <--- This must match scriptData.title
    label: "Movie Title",
    hint: "...",
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
  const [finalScript, setFinalScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInput = (id, value) => {
    setScriptData((prev) => ({ ...prev, [id]: value }));
  };

  const nextSlide = () =>
    setSlide((cur) => (cur < BEATS.length - 1 ? cur + 1 : cur));
  const prevSlide = () => setSlide((cur) => (cur > 0 ? cur - 1 : cur));

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
      setFinalScript(data.script);
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

    const lines = doc.splitTextToSize(text, 170);
    let y = 40;

    lines.forEach((line) => {
      if (
        line.startsWith("INT.") ||
        line.startsWith("EXT.") ||
        line.startsWith("#")
      ) {
        doc.setFont("courier", "bold");
      } else {
        doc.setFont("courier", "normal");
      }

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
    <div className="app-wrapper container">
      {loading ? (
        <div className="loader">
          <h2>Writing your masterpiece...</h2>
          <p>The AI is processing your 16 beats into Fountain syntax.</p>
        </div>
      ) : (
        <>
          <div className="wizard-container">
            <div className="progress-container">
              <span>
                Step {slide + 1} of {BEATS.length}
              </span>
              <div className="progress-bar">
                <div
                  className="fill"
                  style={{ width: `${((slide + 1) / BEATS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="beat-card">
              <h2>{currentBeat.label}</h2>
              <p className="hint">{currentBeat.hint}</p>
              <textarea
                value={scriptData[currentBeat.id] || ""}
                onChange={(e) => handleInput(currentBeat.id, e.target.value)}
                placeholder="Type your scene details here..."
              />
            </div>

            <div className="controls">
              <button onClick={prevSlide} disabled={slide === 0}>
                Back
              </button>
              {slide < BEATS.length - 1 ? (
                <button className="primary-btn" onClick={nextSlide}>
                  Next
                </button>
              ) : (
                <button className="finish-btn" onClick={generateFinalScript}>
                  Generate Script
                </button>
              )}
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          {finalScript && (
            <div className="result-section">
              <button
                className="download-btn"
                onClick={() => downloadPDF(finalScript.script)}
              >
                Download as PDF
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
