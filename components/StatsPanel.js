"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { STAT_DISPLAY, BASE_STATS, STAT_LABEL_COLORS } from "../lib/constants";
import { formatStat, getStatDirection } from "../lib/engine";
import BossSection from "./BossSection";

function StatRow({ config, value, prevValue }) {
  const [pulseClass, setPulseClass] = useState("");
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (value !== prevValue) {
      const dir = getStatDirection(
        value,
        config.format,
        config.base !== undefined ? config.base : BASE_STATS[config.key],
        config.inverted
      );
      setPulseClass(dir === "positive" ? "pulse-positive" : dir === "negative" ? "pulse-negative" : "");
      const t = setTimeout(() => setPulseClass(""), 500);
      return () => clearTimeout(t);
    }
  }, [value, prevValue, config]);

  const base = config.base !== undefined ? config.base : BASE_STATS[config.key];
  const formatted = formatStat(value, config.format, base);
  const dir = getStatDirection(value, config.format, base, config.inverted);

  const labelColor = STAT_LABEL_COLORS[config.key];

  return (
    <div className={`stat-row ${pulseClass}`}>
      <div className="stat-label" style={labelColor ? { color: labelColor } : undefined}>
        <span className="stat-icon">{config.icon}</span>
        <span>{config.label}</span>
      </div>
      <span className={`stat-value${dir ? ` ${dir}` : ""}`}>{formatted}</span>
    </div>
  );
}

export default function StatsPanel({ stats }) {
  const prevStats = useRef(stats);

  useEffect(() => {
    prevStats.current = stats;
  }, [stats]);

  const sections = useMemo(() => {
    const groups = {};
    for (const config of STAT_DISPLAY) {
      const key = config.key;
      const value = stats[key] !== undefined ? stats[key] : (BASE_STATS[key] || 0);
      const base = config.base !== undefined ? config.base : BASE_STATS[key];

      // Hide if at base value unless alwaysShow
      const isAtBase = Math.abs(value - (base !== undefined ? base : 0)) < 0.0001;
      if (!config.alwaysShow && isAtBase) continue;

      if (!groups[config.section]) {
        groups[config.section] = [];
      }
      groups[config.section].push({ config, value });
    }
    return groups;
  }, [stats]);

  const sectionOrder = ["COMBAT", "SURVIVAL", "BULLET", "MOBILITY", "ELEMENTAL", "EXPLOSIONS", "MISC", "RARITY"];
  const prev = prevStats.current;

  return (
    <div className="panel panel-right">
      <div className="panel-header">Stats</div>
      <div className="stats-scroll">
        {sectionOrder.map((section) => {
          const rows = sections[section];
          if (!rows || rows.length === 0) return null;
          return (
            <div key={section} className="stat-section">
              <div className="stat-section-header">{section}</div>
              {rows.map(({ config, value }) => {
                const prevVal = prev[config.key] !== undefined
                  ? prev[config.key]
                  : (config.base !== undefined ? config.base : BASE_STATS[config.key] || 0);
                return (
                  <StatRow
                    key={config.key}
                    config={config}
                    value={value}
                    prevValue={prevVal}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <BossSection stats={stats} />
    </div>
  );
}
