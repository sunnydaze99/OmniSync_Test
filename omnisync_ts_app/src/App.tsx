import React, { useState } from 'react'
import { X } from "lucide-react";  // Lucide icon
import './styles/App.scss'

type CardData = {
  id: number;
  clickCount: number;
  firstClick: string | null;
};

// instantiate a card
const initCard: CardData[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  clickCount: 0,
  firstClick: null,
}));


function App() {
  const [cards, setCards] = useState<CardData[]>(initCard);
  const [sortOption, setSortOption] = useState("none");

  // click event handler
  const handleClick = (id: number) => {
    setCards(prev =>
      prev.map(card => {
        if (card.id !== id) return card;

        const now = new Date().toLocaleString();
        return {
          ...card, //copies card property to a new obj
          clickCount: card.clickCount + 1, //increment click count
          firstClick: card.firstClick ?? now, // only set first click once
        };
      })
    );
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

  // clear event handler
  const handleClear = () => {
    setCards(initCard); // reset all counts + timestamps
    setSortOption("none");  // reset sort order
  };

  return (
    <div className="app">
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
