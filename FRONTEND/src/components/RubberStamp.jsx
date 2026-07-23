import React, { useMemo } from "react";

/**
 * RubberStamp — distressed ink stamp. APPROVED / DENIED.
 * -------------------------------------------------------------------------
 * Shared GLYPH_SIZE = 35 across all stamp dies.
 * Width is matched via tracking (letterSpacing) so APPROVED (3) and DENIED (16)
 * fill the interior frame to ~213-214px inside a 228px frame.
 * Text x-position is offset by `tracking / 2` to compensate for SVG's trailing
 * letter-spacing and keep text perfectly centered.
 */

const TONES = {
  green: "#2F7A45",   // APPROVED
  maroon: "#7A1C2B",  // DENIED — Collateral brand
};

const GLYPH_SIZE = 35;

const TRACKING = {
  APPROVED: 3,
  DENIED: 16,
  SETTLED: 12,
  FORFEIT: 12,
  VERIFIED: 6,
  DEFAULT: 8,
};

const STAMP_FONT =
  '"Arial Narrow", "Helvetica Neue Condensed", "Oswald", "DejaVu Sans Condensed", Impact, system-ui, sans-serif';

let uid = 0;

export default function RubberStamp({
  label = "APPROVED",
  tone = "green",
  seed = 7,
  width = 170,
  coarseErosion = 0.26,
  fineErosion = 0.52,
  rotate = -12,
  opacity = 0.9,
  gradDir = { x1: 0, y1: 0, x2: 1, y2: 1 }
}) {
  const id = useMemo(() => `stamp${++uid}`, []);
  const color = TONES[tone] || TONES.green;
  const key = label.toUpperCase();
  const tracking = TRACKING[key] ?? TRACKING.DEFAULT;
  const textX = 150 + tracking / 2;
  const H = (width * 110) / 300;

  return (
    <svg width={width} height={H} viewBox="0 0 300 110" aria-hidden
      style={{ display: "block", overflow: "visible" }}>
      <defs>
        {/* MULTI-PASS DISTRESSED RUBBER STAMP FILTER */}
        <filter id={`${id}g`} x="-30%" y="-30%" width="160%" height="160%">
          {/* PASS 1: coarse blotches */}
          <feTurbulence type="fractalNoise" baseFrequency="0.13" numOctaves="3"
            seed={seed} result="coarse" />
          <feColorMatrix in="coarse" type="matrix"
            values={`0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 1 0 0 0 -${coarseErosion}`} result="blotch" />
          <feComposite in="SourceGraphic" in2="blotch" operator="out" result="pass1" />

          {/* PASS 2: fine speckle */}
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4"
            seed={seed + 11} result="fine" />
          <feColorMatrix in="fine" type="matrix"
            values={`0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 1 0 0 0 -${fineErosion}`} result="speck" />
          <feComposite in="pass1" in2="speck" operator="out" result="pass2" />

          {/* PASS 3: edge wobble */}
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2"
            seed={seed + 3} result="warp" />
          <feDisplacementMap in="pass2" in2="warp" scale="2.8"
            xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* INK BLEED BLUR FILTER */}
        <filter id={`${id}b`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.7" />
        </filter>

        {/* UNEVEN PRESSURE GRADIENT MASK */}
        <linearGradient id={`${id}p`} x1={gradDir.x1} y1={gradDir.y1} x2={gradDir.x2} y2={gradDir.y2}>
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.62" />
        </linearGradient>
        <mask id={`${id}pm`}>
          <rect x="0" y="0" width="300" height="110" fill={`url(#${id}p)`} />
        </mask>
      </defs>

      {/* BASE INK BLEED SHADOW */}
      <g filter={`url(#${id}b)`} opacity="0.28" transform={`translate(0.5, 0.5) rotate(${rotate} 150 55)`}>
        <rect x="10" y="13" width="280" height="84" rx="8" fill="none" stroke={color} strokeWidth="5" />
        <rect x="18" y="21" width="264" height="68" rx="5" fill="none" stroke={color} strokeWidth="1.6" />
        <text x={textX} y="55" textAnchor="middle" dominantBaseline="central"
          fontFamily={STAMP_FONT} fontSize={GLYPH_SIZE} fontWeight="700"
          letterSpacing={tracking} fill={color} style={{ fontStretch: "condensed" }}>
          {label}
        </text>
      </g>

      {/* MAIN DISTRESSED STAMP GROUP WITH PRESSURE MASK */}
      <g filter={`url(#${id}g)`} mask={`url(#${id}pm)`} opacity={opacity} transform={`rotate(${rotate} 150 55)`}>
        {/* outer border */}
        <rect x="10" y="13" width="280" height="84" rx="8"
          fill="none" stroke={color} strokeWidth="5" />
        {/* inner rule — the double line is what reads as official */}
        <rect x="18" y="21" width="264" height="68" rx="5"
          fill="none" stroke={color} strokeWidth="1.6" />
        {/* word — sized to fit, never compressed */}
        <text x={textX} y="55" textAnchor="middle" dominantBaseline="central"
          fontFamily={STAMP_FONT} fontSize={GLYPH_SIZE} fontWeight="700"
          letterSpacing={tracking} fill={color}
          style={{ fontStretch: "condensed" }}>
          {label}
        </text>
      </g>
    </svg>
  );
}

/* Drop-in for the receipt outcome panel */
export function SettlementStamp({ won, seed = 7, width = 170, rotate, opacity }) {
  return (
    <RubberStamp
      label={won ? "APPROVED" : "DENIED"}
      tone={won ? "green" : "maroon"}
      seed={seed}
      width={width}
      rotate={rotate !== undefined ? rotate : (won ? -9 : -11)}
      opacity={opacity !== undefined ? opacity : (won ? 0.86 : 0.88)}
    />
  );
}
