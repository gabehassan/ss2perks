"use client";

import { memo, useState, useCallback } from "react";
import { RARITY_COLORS, BASE_STATS } from "../lib/constants";
import { getStatShortLabel, formatModPreview } from "../lib/engine";

function PerkIcon({ icon, name, rarity, size = 36 }) {
  const [failed, setFailed] = useState(false);
  const src = `/icons/${icon}.png`;

  if (failed) {
    return (
      <div
        className="perk-icon-fallback"
        style={{
          width: size,
          height: size,
          backgroundColor: RARITY_COLORS[rarity] + "33",
        }}
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      className="perk-icon"
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function PerkCard({ perk, level, onAdd }) {
  const isInBuild = level > 0;
  const isMaxed = level >= perk.maxLevel;
  const isCurse = perk.type === "curse";
  const isDisabled = perk.disabled;

  const handleClick = useCallback(() => {
    if (!isMaxed) {
      onAdd(perk.id);
    }
  }, [perk.id, isMaxed, onAdd]);

  // Description: first line of level 1 description
  const desc = perk.descriptionValues?.["1"] || "";
  const firstLine = desc.split("|")[0].trim();

  // Stat preview: show what this perk does at next applicable level
  const previewLevel = isInBuild ? Math.min(level + 1, perk.maxLevel) : 1;
  const modPreviews = [];
  if (perk.modifiers) {
    for (const mod of perk.modifiers) {
      if (!mod.values) continue;
      const val = mod.values[String(previewLevel)];
      if (val === undefined) continue;
      // Only show stats that are in BASE_STATS (trackable)
      if (!(mod.stat in BASE_STATS)) continue;
      const label = getStatShortLabel(mod.stat);
      const fmt = formatModPreview(mod.stat, mod.type, val);
      modPreviews.push({ label, ...fmt });
    }
  }

  let classNames = "perk-card";
  if (isInBuild) classNames += " in-build";
  if (isCurse) classNames += " is-curse";
  if (isDisabled) classNames += " is-disabled";
  if (isMaxed) classNames += " is-maxed";

  return (
    <div
      className={classNames}
      onClick={handleClick}
      style={{ borderLeftColor: RARITY_COLORS[perk.rarity] }}
    >
      <div className="perk-card-top">
        <PerkIcon icon={perk.icon} name={perk.name} rarity={perk.rarity} size={32} />
        <div className="perk-card-info">
          <div
            className="perk-card-name"
            style={{ color: RARITY_COLORS[perk.rarity] }}
          >
            {perk.name}
          </div>
          <div className="perk-card-desc">{firstLine}</div>
        </div>
      </div>

      {modPreviews.length > 0 && (
        <div className="perk-card-preview">
          {modPreviews.map((m, i) => (
            <span key={i} className={`mod-tag ${m.color}`}>
              {m.label} {m.text}
            </span>
          ))}
        </div>
      )}

      <div className="perk-card-footer">
        <div className="level-dots">
          {Array.from({ length: perk.maxLevel }, (_, i) => (
            <span
              key={i}
              className={`level-dot${i < level ? " filled" : ""}`}
            />
          ))}
        </div>
        <div className="perk-badges">
          {isDisabled && <span className="badge badge-disabled">Disabled</span>}
          {isMaxed && <span className="badge badge-maxed">Maxed</span>}
        </div>
      </div>
    </div>
  );
}

export default memo(PerkCard);
