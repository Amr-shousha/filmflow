import { useNavigate } from "react-router-dom";
import { useState } from "react";
import iconNews from "../assets/imgs/icons/icons8-news-128.png";
import iconSearch from "../assets/imgs/icons/search-icon.png";
import iconPlot from "../assets/imgs/icons/plot-icon.png";
import iconinterview from "../assets/imgs/icons/interview-icon.png";
import iconScenario from "../assets/imgs/icons/scenario.png";
import iconScreenWriting from "../assets/imgs/icons/screenWriting.png";
import iconReviews from "../assets/imgs/icons/review.png";

export default function Options() {
  const navigate = useNavigate();
  // const [showCards, setShowCards] = useState(true);

  const cards = [
    {
      id: "news",
      title: "News",
      description: "Latest movie news",
      path: "/news",
      icon: iconNews,
    },
    {
      id: "search",
      title: "Search",
      description: "Find movie details",
      path: "/search",
      icon: iconSearch,
    },
    {
      id: "plot",
      title: "Plot",
      description: "Spoiler plot summary",
      path: "/plot",
      icon: iconPlot,
    },
    {
      id: "interviews",
      title: "Interviews",
      description: "Recent movie interviews",
      path: "/interviews",
      icon: iconinterview,
    },
    ,
    {
      id: "screenplay",
      title: "Screenplay ",
      description: "Plan your movie using professional story beats",
      path: "/screenplay",
      icon: iconScreenWriting,
    },
    {
      id: "Scripts",
      title: "Script Library",
      description: " read scripts from famous movies & shows",
      path: "https://www.scriptslug.com/",
      icon: iconScenario,
    },
    {
      id: "Scriptsd",
      title: "Reviews",
      description: "latest movie reviews ",
      path: "https://www.scriptslug.com/",
      icon: iconReviews,
    },
  ];

  const handleClick = (path) => {
    // setShowCards(false);
    navigate(path);
  };

  return (
    <div className="link-cards-container">
      {cards.map((card) => (
        <div
          className="link-card"
          key={card.id}
          onClick={() => handleClick(card.path)}
        >
          <img src={card.icon} alt="" />
          <h3>{card.title}</h3>
          <p>{card.description} </p>
        </div>
      ))}
    </div>
  );
}
