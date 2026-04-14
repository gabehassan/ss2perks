"use client";

import { memo, useState, useCallback } from "react";
import { RARITY_COLORS, BASE_STATS } from "../lib/constants";
import { getStatShortLabel, formatModPreview } from "../lib/engine";

function BuildPerkIcon({ icon, name, rarity }) {
  const [failed, setFailed] = useState(false);
  const src = `/icons/${icon}.png`;

  if (failed) {
    return (
      <div
        className="build-perk-icon-fallback"
        style={{ backgroundColor: RARITY_COLORS[rarity] + "33" }}
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      className="build-perk-icon"
      src={src}
      alt={name}
      width={36}
      height={36}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function BuildPerkCard({ perk, level, onRemove, onSetLevel }) {
  const handleRemove = useCallback(() => onRemove(perk.id), [perk.id, onRemove]);
  const handleMinus = useCallback(
    () => onSetLevel(perk.id, level - 1),
    [perk.id, level, onSetLevel]
  );
  const handlePlus = useCallback(
    () => onSetLevel(perk.id, level + 1),
    [perk.id, level, onSetLevel]
  );

  // Description at current level
  const rawDesc = perk.descriptionValues?.[String(level)] || perk.descriptionValues?.["1"] || "";
  const descLines = rawDesc
    .replace(/\s*\|\s*/g, " · ")
    .replace(/__/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Stat effects at current level
  const modEffects = [];
  if (perk.modifiers) {
    for (const mod of perk.modifiers) {
      if (!mod.values) continue;
      const val = mod.values[String(level)];
      if (val === undefined) continue;
      if (!(mod.stat in BASE_STATS)) continue;
      const label = getStatShortLabel(mod.stat);
      const fmt = formatModPreview(mod.stat, mod.type, val);
      modEffects.push({ label, ...fmt });
    }
  }

  return (
    <div
      className="build-perk"
      style={{ borderLeftColor: RARITY_COLORS[perk.rarity] }}
    >
      <BuildPerkIcon icon={perk.icon} name={perk.name} rarity={perk.rarity} />

      <div className="build-perk-content">
        <div
          className="build-perk-name"
          style={{ color: RARITY_COLORS[perk.rarity] }}
        >
          {perk.name}
        </div>

        <div className="build-perk-desc">{descLines}</div>

        {modEffects.length > 0 && (
          <div className="build-perk-mods">
            {modEffects.map((m, i) => (
              <span key={i} className={`mod-tag ${m.color}`}>
                {m.label} {m.text}
              </span>
            ))}
          </div>
        )}

        <div className="build-perk-controls">
          <button
            className="level-btn"
            onClick={handleMinus}
            disabled={level <= 1}
          >
            -
          </button>
          <span className="level-display">
            Lv {level}/{perk.maxLevel}
          </span>
          <button
            className="level-btn"
            onClick={handlePlus}
            disabled={level >= perk.maxLevel}
          >
            +
          </button>
        </div>
      </div>

      <button className="remove-btn" onClick={handleRemove} title="Remove">
        &times;
      </button>
    </div>
  );
}

export default memo(BuildPerkCard);
