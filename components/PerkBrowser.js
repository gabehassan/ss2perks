"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { RARITY_COLORS, RARITY_ORDER } from "../lib/constants";
import PerkCard from "./PerkCard";

export default function PerkBrowser({ perks, perksMap, build, onAdd }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState(new Set());
  const [typeFilter, setTypeFilter] = useState("all"); // all | perk | curse
  const [showDisabled, setShowDisabled] = useState(false);
  const debounceRef = useRef(null);

  const onSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const toggleRarity = useCallback((rarity) => {
    setRarityFilter((prev) => {
      const next = new Set(prev);
      if (next.has(rarity)) {
        next.delete(rarity);
      } else {
        next.add(rarity);
      }
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return perks.filter((p) => {
      if (!showDisabled && p.disabled) return false;
      if (typeFilter === "perk" && p.type !== "perk") return false;
      if (typeFilter === "curse" && p.type !== "curse") return false;
      if (rarityFilter.size > 0 && !rarityFilter.has(p.rarity)) return false;
      if (q) {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = (p.descriptionValues?.["1"] || "").toLowerCase().includes(q);
        const idMatch = p.id.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !idMatch) return false;
      }
      return true;
    });
  }, [perks, debouncedSearch, rarityFilter, typeFilter, showDisabled]);

  return (
    <div className="panel panel-left">
      <div className="panel-header">
        <span>Perks</span>
        <span className="perk-count">{filtered.length} shown</span>
      </div>

      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search perks..."
          value={search}
          onChange={onSearchChange}
        />
      </div>

      <div className="filter-bar">
        {RARITY_ORDER.map((r) => (
          <span
            key={r}
            className={`filter-pill${rarityFilter.has(r) ? " active" : ""}`}
            style={{
              backgroundColor: rarityFilter.has(r)
                ? RARITY_COLORS[r] + "22"
                : "transparent",
              color: RARITY_COLORS[r],
              borderColor: rarityFilter.has(r) ? RARITY_COLORS[r] : "transparent",
            }}
            onClick={() => toggleRarity(r)}
          >
            {r}
          </span>
        ))}
      </div>

      <div className="type-filters">
        {["all", "perk", "curse"].map((t) => (
          <button
            key={t}
            className={`type-btn${typeFilter === t ? " active" : ""}`}
            onClick={() => setTypeFilter(t)}
          >
            {t === "all" ? "All" : t === "perk" ? "Perks" : "Curses"}
          </button>
        ))}
        <label className="show-disabled-toggle">
          <input
            type="checkbox"
            checked={showDisabled}
            onChange={(e) => setShowDisabled(e.target.checked)}
          />
          Disabled
        </label>
      </div>

      <div className="panel-scroll">
        <div className="perk-grid">
          {filtered.map((perk) => (
            <PerkCard
              key={perk.id}
              perk={perk}
              level={build.get(perk.id) || 0}
              onAdd={onAdd}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#555", padding: "20px" }}>
            No perks match filters
          </div>
        )}
      </div>
    </div>
  );
}
