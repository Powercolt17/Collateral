import React, { useMemo } from "react";

/**
 * RubberStamp — distressed ink stamp. APPROVED / DENIED.
 * -------------------------------------------------------------------------
 * SIZES:
 *   APPROVED: font 35
 *   DENIED: font 54
 *   SETTLED: font 42
 *   FORFEIT: font 42
 *   VERIFIED: font 38
 */

const TONES = {
  green: "#2F7A45",   // APPROVED
  maroon: "#7A1C2B",  // DENIED — Collateral brand
};

const SIZING = {
  APPROVED: 35,
  DENIED: 54,
  SETTLED: 42,
  FORFEIT: 42,
  VERIFIED: 38,
  DEFAULT: 40,
};

const STAMP_FONT =
  '"Arial Narrow", "Helvetica Neue Condensed", "Oswald", "DejaVu Sans Condensed", Impact, system-ui, sans-serif';

let uid = 0;

export default function RubberStamp({
  label = "APPROVED",
  tone = "green",
  seed = 7,
  width = 170,
  erosion = 0.45,
  rotate = -12,
  opacity = 0.9,
}) {
  const id = useMemo(() => `stamp${++uid}`, []);
  const color = TONES[tone] || TONES.green;
  const fontSize = SIZING[label.toUpperCase()] || SIZING.DEFAULT;
  const H = (width * 110) / 300;

  return (
    <svg width={width} height={H} viewBox="0 0 300 110" aria-hidden
      style={{ display: "block", overflow: "visible" }}>
      <defs>
        <filter id={`${id}g`} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4"
            seed={seed} result="noise" />
          <feColorMatrix in="noise" type="matrix"
            values={`0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 1 0 0 0 -${erosion}`}
            result="holes" />
          <feComposite in="SourceGraphic" in2="holes" operator="out" result="eroded" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2"
            seed={seed + 5} result="warp" />
          <feDisplacementMap in="eroded" in2="warp" scale="1.1"
            xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <g filter={`url(#${id}g)`} opacity={opacity} transform={`rotate(${rotate} 150 55)`}>
        {/* outer border */}
        <rect x="10" y="13" width="280" height="84" rx="8"
          fill="none" stroke={color} strokeWidth="5" />
        {/* inner rule — the double line is what reads as official */}
        <rect x="18" y="21" width="264" height="68" rx="5"
          fill="none" stroke={color} strokeWidth="1.6" />
        {/* word — sized to fit, never compressed */}
        <text x="150" y="55" textAnchor="middle" dominantBaseline="central"
          fontFamily={STAMP_FONT} fontSize={fontSize} fontWeight="700"
          letterSpacing="3" fill={color}
          style={{ fontStretch: "condensed" }}>
          {label}
        </text>
      </g>
    </svg>
  );
}

/* Drop-in for the receipt outcome panel — replaces <WaxSeal won={...} />. */
export function SettlementStamp({ won, seed = 7, width = 170 }) {
  return (
    <RubberStamp
      label={won ? "APPROVED" : "DENIED"}
      tone={won ? "green" : "maroon"}
      seed={seed}
      width={width}
    />
  );
}
