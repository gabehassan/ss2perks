"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import perksData from "../data/perks.json";
import { computeStats } from "../lib/engine";
import { RARITY_ORDER } from "../lib/constants";
import PerkBrowser from "./PerkBrowser";
import BuildPanel from "./BuildPanel";
import StatsPanel from "./StatsPanel";

function buildPerksMap(perks) {
  const map = new Map();
  for (const p of perks) {
    map.set(p.id, p);
  }
  return map;
}

function sortPerks(perks) {
  return [...perks].sort((a, b) => {
    const ri = RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
    if (ri !== 0) return ri;
    return a.name.localeCompare(b.name);
  });
}

function encodeBuild(build) {
  if (build.size === 0) return "";
  const parts = [];
  for (const [id, level] of build.entries()) {
    parts.push(`${id}:${level}`);
  }
  return parts.join(",");
}

function decodeBuild(hash, perksMap) {
  const build = new Map();
  if (!hash) return build;
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return build;
  const parts = raw.split(",");
  for (const part of parts) {
    const sep = part.lastIndexOf(":");
    if (sep === -1) continue;
    const id = part.slice(0, sep);
    const level = parseInt(part.slice(sep + 1), 10);
    if (perksMap.has(id) && level > 0) {
      const maxLv = perksMap.get(id).maxLevel;
      build.set(id, Math.min(level, maxLv));
    }
  }
  return build;
}

export default function Calculator() {
  const perksMap = useMemo(() => buildPerksMap(perksData), []);
  const sortedPerks = useMemo(() => sortPerks(perksData), []);

  const [build, setBuild] = useState(() => new Map());
  const [copied, setCopied] = useState(false);
  const initialized = useRef(false);

  // Load from URL hash on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const hash = window.location.hash;
    if (hash) {
      const decoded = decodeBuild(hash, perksMap);
      if (decoded.size > 0) {
        setBuild(decoded);
      }
    }
  }, [perksMap]);

  // Sync build to URL hash
  useEffect(() => {
    const encoded = encodeBuild(build);
    const newHash = encoded ? `#${encoded}` : "";
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, "", newHash || window.location.pathname);
    }
  }, [build]);

  const stats = useMemo(() => computeStats(build, perksMap), [build, perksMap]);

  const addPerk = useCallback((perkId) => {
    setBuild((prev) => {
      const next = new Map(prev);
      const perk = perksMap.get(perkId);
      if (!perk) return prev;
      const current = next.get(perkId) || 0;
      if (current < perk.maxLevel) {
        next.set(perkId, current + 1);
      }
      return next;
    });
  }, [perksMap]);

  const removePerk = useCallback((perkId) => {
    setBuild((prev) => {
      const next = new Map(prev);
      next.delete(perkId);
      return next;
    });
  }, []);

  const setLevel = useCallback((perkId, level) => {
    setBuild((prev) => {
      const next = new Map(prev);
      const perk = perksMap.get(perkId);
      if (!perk) return prev;
      if (level <= 0) {
        next.delete(perkId);
      } else {
        next.set(perkId, Math.min(level, perk.maxLevel));
      }
      return next;
    });
  }, [perksMap]);

  const clearBuild = useCallback(() => {
    setBuild(new Map());
  }, []);

  const copyBuildLink = useCallback(() => {
    const encoded = encodeBuild(build);
    const url = `${window.location.origin}${window.location.pathname}${encoded ? "#" + encoded : ""}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [build]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header className="app-header">
        <h1>
          SS2 Perk Calculator
          <span>Sausage Survivors 2</span>
        </h1>
        <button
          className={`copy-btn${copied ? " copied" : ""}`}
          onClick={copyBuildLink}
        >
          {copied ? "Copied!" : "Copy Build Link"}
        </button>
      </header>
      <div className="main-layout">
        <PerkBrowser
          perks={sortedPerks}
          perksMap={perksMap}
          build={build}
          onAdd={addPerk}
        />
        <BuildPanel
          build={build}
          perksMap={perksMap}
          onRemove={removePerk}
          onSetLevel={setLevel}
          onClear={clearBuild}
        />
        <StatsPanel stats={stats} />
      </div>
    </div>
  );
}
