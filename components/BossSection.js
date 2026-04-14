"use client";

import { useState, useMemo } from "react";
import { computeBossTTK, getBossArrival } from "../lib/engine";

const BOSS_HP = { Easy: 4000, Normal: 5000, Hard: 7000 };

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function BossSection({ stats }) {
  const [difficulty, setDifficulty] = useState("Normal");

  const bossHp = BOSS_HP[difficulty];
  const arrival = useMemo(() => getBossArrival(stats), [stats]);
  const dps = stats._DPS || 0;
  const ttk = useMemo(
    () => computeBossTTK(dps, difficulty),
    [dps, difficulty]
  );

  return (
    <div className="boss-section">
      <h3>Boss Fight</h3>
      <div className="boss-difficulty-btns">
        {["Easy", "Normal", "Hard"].map((d) => (
          <button
            key={d}
            className={`boss-diff-btn${difficulty === d ? " active" : ""}`}
            onClick={() => setDifficulty(d)}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="boss-stats">
        <div className="boss-stat">
          <div className="boss-stat-label">Boss HP</div>
          <div className="boss-stat-value">{bossHp.toLocaleString()}</div>
        </div>
        <div className="boss-stat">
          <div className="boss-stat-label">Arrival</div>
          <div className="boss-stat-value">{formatTime(arrival)}</div>
        </div>
        <div className="boss-stat">
          <div className="boss-stat-label">Est TTK</div>
          <div
            className="boss-stat-value"
            style={{ color: isFinite(ttk) && ttk < 30 ? "#4CAF50" : isFinite(ttk) && ttk < 60 ? "#FFD700" : "#f44336" }}
          >
            {isFinite(ttk) ? ttk.toFixed(1) + "s" : "--"}
          </div>
        </div>
      </div>
    </div>
  );
}
