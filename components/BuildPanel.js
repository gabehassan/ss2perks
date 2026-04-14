"use client";

import { useMemo } from "react";
import { RARITY_ORDER } from "../lib/constants";
import BuildPerkCard from "./BuildPerkCard";

export default function BuildPanel({ build, perksMap, onRemove, onSetLevel, onClear }) {
  const buildList = useMemo(() => {
    const list = [];
    for (const [perkId, level] of build.entries()) {
      const perk = perksMap.get(perkId);
      if (perk) {
        list.push({ perk, level });
      }
    }
    // Sort by rarity then name
    list.sort((a, b) => {
      const ri = RARITY_ORDER.indexOf(a.perk.rarity) - RARITY_ORDER.indexOf(b.perk.rarity);
      if (ri !== 0) return ri;
      return a.perk.name.localeCompare(b.perk.name);
    });
    return list;
  }, [build, perksMap]);

  return (
    <div className="panel panel-center">
      <div className="panel-header">
        <div className="build-header-row">
          <span>Your Build</span>
          <span className="build-count">({buildList.length})</span>
        </div>
        {buildList.length > 0 && (
          <button className="clear-btn" onClick={onClear}>
            Clear All
          </button>
        )}
      </div>

      {buildList.length === 0 ? (
        <div className="build-empty">
          Click perks from the browser to add them to your build
        </div>
      ) : (
        <div className="panel-scroll">
          {buildList.map(({ perk, level }) => (
            <BuildPerkCard
              key={perk.id}
              perk={perk}
              level={level}
              onRemove={onRemove}
              onSetLevel={onSetLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
