import { useState, useEffect } from 'react'
import { X } from "lucide-react";  // Lucide icon
import './styles/App.scss'

type CardData = {
  id: number;
  clickCount: number;     // backend returns click_count, we’ll map it to clickCount
  firstClick: string | null; // backend returns first_click, we’ll map it to firstClick
};

// instantiate cards from backend instead of local init
function App() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [sortOption, setSortOption] = useState("none");
  const [darkMode, setDarkMode] = useState(false); 

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // load cards from backend on mount
  useEffect(() => {
    fetch("/api/cards")
      .then(res => res.json())
      .then(data =>
        // normalize keys from backend (snake_case → camelCase)
        data.map((card: any) => ({
          id: card.id,
          clickCount: card.click_count,
          firstClick: card.first_click,
        }))
      )
      .then(setCards)
      .catch(err => console.error("Error fetching cards:", err));
  }, []);

  // click event handler → update backend + state
  const handleClick = (id: number) => {
    fetch(`/api/cards/${id}/click`, { method: "POST" })
      .then(res => res.json())
      .then((updated: any) => {
        const updatedCard: CardData = {
          id: updated.id,
          clickCount: updated.click_count,
          firstClick: updated.first_click,
        };
        setCards(prev =>
          prev.map(card => (card.id === updatedCard.id ? updatedCard : card))
        );
      })
      .catch(err => console.error("Error updating card:", err));
  };

  // sort event handler
  const sortedCards = [...cards].sort((a, b) => {
    if (sortOption === "most_clicks") return b.clickCount - a.clickCount;
    if (sortOption === "fewest_clicks") return a.clickCount - b.clickCount;

    if (sortOption === "first_clicked") {
      if (!a.firstClick && !b.firstClick) return 0;
      if (!a.firstClick) return 1; // put unclicked at the end
      if (!b.firstClick) return -1;
      return new Date(a.firstClick).getTime() - new Date(b.firstClick).getTime();
    }

    if (sortOption === "last_clicked") {
      if (!a.firstClick && !b.firstClick) return 0;
      if (!a.firstClick) return 1;
      if (!b.firstClick) return -1;
      return new Date(b.firstClick).getTime() - new Date(a.firstClick).getTime();
    }

    return a.id - b.id; // default original order
  });

  // clear event handler → reset backend + state
  const handleClear = () => {
    fetch("/api/cards/reset", { method: "POST" })
      .then(res => res.json())
      .then(data =>
        data.map((card: any) => ({
          id: card.id,
          clickCount: card.click_count,
          firstClick: card.first_click,
        }))
      )
      .then(setCards)
      .then(() => setSortOption("none")) // reset sort order
      .catch(err => console.error("Error resetting cards:", err));
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <h1>OmniSync Assessment</h1>

      <div className="card-grid-wrapper">
        <div className="controls">
          <div className="sort-tab">
            <label>
              Sort by:{" "}
              <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
                <option value="none">Original (1 → 8)</option>
                <option value="most_clicks">Most → Fewest</option>
                <option value="fewest_clicks">Fewest → Most</option>
                <option value="first_clicked">First → Last </option>
                <option value="last_clicked">Last → First </option>
              </select>
            </label>
          </div>
          <button className="clear-btn" onClick={handleClear} title="Clear all">
            <X size={20} />
          </button>
          <button className="dark-btn" onClick={toggleDarkMode}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="card-grid">
          {sortedCards.map(card => (
            <button
              key={card.id}
              onClick={() => handleClick(card.id)}
              className="card"
            >
              <div className="card-number">{card.id}</div>
              <div className="card-clicks">Clicks: {card.clickCount}</div>
              <div className="card-time">
                First click: {card.firstClick ?? "—"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
