// Rivalry.js — Head-to-Head Performance Duels
// Institutional design matching existing Collateral aesthetic

import api from '../api.js';
import { showAlert } from '../modal.js';

export function renderRivalry() {
    return `
        <style>
            /* ============================================================
               RIVALRY MODE — COMPETITIVE ARENA
               Trading Terminal + Betting Exchange Aesthetic
               ============================================================ */
            :root {
                --rv-ease: cubic-bezier(0.4, 0, 0.2, 1);
                --rv-dur: 0.25s;
                --rv-brand: #3B0001;
                --rv-green: #10b981;
                --rv-red: #ef4444;
                --rv-amber: #f59e0b;
                --rv-muted: #666;
                --rv-bg: #0a0a0a;
                --rv-card-bg: #111113;
                --rv-border: #222;
            }

            .rv {
                background: var(--rv-bg);
                min-height: calc(100vh - 72px);
                font-family: 'Inter Tight', 'IBM Plex Sans', -apple-system, sans-serif;
                color: #e5e5e5;
                display: flex;
                flex-direction: column;
            }

            /* ── Animations ── */
            @media (prefers-reduced-motion: no-preference) {
                @keyframes rv-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.35} }
                @keyframes rv-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes rv-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
                @keyframes rv-pendingPulse { 0%,100%{opacity:1} 50%{opacity:.55} }
                @keyframes rv-aurora { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes rv-glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(239,68,68,0.3),0 0 40px rgba(239,68,68,0.1)} 50%{box-shadow:0 0 30px rgba(239,68,68,0.5),0 0 60px rgba(239,68,68,0.2)} }
                @keyframes rv-tug { 0%{transform:translateX(-1px)} 50%{transform:translateX(1px)} 100%{transform:translateX(-1px)} }
                @keyframes rv-ticker-scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
                @keyframes rv-count-up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                .rv-reveal { opacity:0; transform:translateY(16px); transition:opacity .5s var(--rv-ease), transform .5s var(--rv-ease); }
                .rv-reveal.visible { opacity:1; transform:translateY(0); }
            }

            /* ── Live Ticker ── */
            .rv-ticker {
                background: linear-gradient(90deg, #0f0f0f, #141414, #0f0f0f);
                border-bottom: 1px solid var(--rv-border);
                overflow: hidden; position: relative;
            }
            .rv-ticker-inner {
                display: flex; align-items: center; justify-content: center;
                gap: 20px; padding: 10px 24px;
                font-family: 'JetBrains Mono', monospace; font-size: 11px;
                color: #888; white-space: nowrap;
            }
            .rv-ticker-item { display: flex; align-items: center; gap: 6px; }
            .rv-ticker-item strong { color: #fff; }
            .rv-ticker-dot { width: 6px; height: 6px; border-radius: 50%; }
            .rv-ticker-dot.live { background: var(--rv-green); animation: rv-pulse 2s infinite; }
            .rv-ticker-sep { color: #333; }

            /* ── Hero ── */
            .rv-hero {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a0505 40%, #0a0a0a 100%);
                border-bottom: 1px solid var(--rv-border);
                position: relative; overflow: hidden;
            }
            .rv-hero::before {
                content: ''; position: absolute; top: -50%; left: 30%;
                width: 80%; height: 200%;
                background: radial-gradient(ellipse at center, rgba(239,68,68,0.06) 0%, transparent 70%);
                pointer-events: none;
            }
            .rv-hero-inner {
                max-width: 1440px; margin: 0 auto;
                padding: 52px 64px 48px; position: relative;
            }
            .rv-hero-row {
                display: flex; align-items: center;
                justify-content: space-between; gap: 48px;
            }
            .rv-hero-left { flex: 1; }
            .rv-hero-title {
                font-size: 52px; font-weight: 300; color: #fff;
                letter-spacing: -2px; margin: 0 0 16px; line-height: 1.08;
            }
            .rv-hero-title strong {
                font-weight: 700; color: var(--rv-red);
                background: linear-gradient(135deg, #ef4444, #dc2626);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .rv-hero-sub {
                font-size: 15px; color: #777; line-height: 1.6;
                max-width: 480px; margin: 0;
            }
            .rv-hero-right { display: flex; gap: 12px; flex-shrink: 0; flex-direction: column; }
            .rv-btn-challenge {
                height: 52px; padding: 0 44px;
                background: linear-gradient(135deg, #dc2626, #991b1b);
                color: #fff; border: none;
                font-size: 13px; font-weight: 800; letter-spacing: 0.12em;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase; cursor: pointer;
                transition: all var(--rv-dur) var(--rv-ease);
                display: flex; align-items: center; justify-content: center; gap: 8px;
                border-radius: 6px;
            }
            .rv-glow { animation: rv-glow-pulse 2s ease infinite; }
            .rv-btn-challenge:hover {
                transform: translateY(-2px) scale(1.02);
                box-shadow: 0 8px 30px rgba(239,68,68,0.4) !important;
            }
            .rv-btn-challenge:active { transform: translateY(0) scale(0.98); }
            .rv-btn-join {
                height: 44px; padding: 0 32px;
                background: transparent; color: #999;
                border: 1px solid #333; border-radius: 6px;
                font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase; cursor: pointer;
                transition: all var(--rv-dur) var(--rv-ease);
                display: flex; align-items: center; justify-content: center; gap: 6px;
            }
            .rv-btn-join:hover { border-color: #666; color: #fff; background: rgba(255,255,255,0.03); }

            /* ── Stats Strip ── */
            .rv-stats {
                display: flex; gap: 0; margin-top: 32px;
                border-top: 1px solid rgba(255,255,255,0.06);
            }
            .rv-stat-group {
                flex: 1; padding: 20px 0; text-align: center;
                border-right: 1px solid rgba(255,255,255,0.06);
            }
            .rv-stat-group:last-child { border-right: none; }
            .rv-stat-val {
                font-size: 36px; font-weight: 300; color: #fff; letter-spacing: -1px;
                line-height: 1; animation: rv-count-up 0.5s var(--rv-ease) both;
            }
            .rv-stat-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700; letter-spacing: 0.15em;
                color: #555; text-transform: uppercase; margin-top: 8px;
                display: flex; align-items: center; justify-content: center; gap: 6px;
            }
            @media (max-width: 768px) { .rv-stat-lbl { justify-content: flex-start; } }

            /* ── Controls ── */
            .rv-controls {
                max-width: 1440px; margin: 0 auto; padding: 24px 64px 0;
                display: flex; align-items: center; justify-content: space-between;
                gap: 24px; width: 100%; box-sizing: border-box;
            }
            .rv-tabs { display: flex; gap: 8px; }
            .rv-tab {
                background: rgba(255,255,255,0.03); border: 1px solid var(--rv-border);
                border-radius: 6px; padding: 8px 16px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
                text-transform: uppercase; color: #666; cursor: pointer;
                transition: all .15s var(--rv-ease);
            }
            .rv-tab:hover { color: #ccc; border-color: #444; background: rgba(255,255,255,0.05); }
            .rv-tab.active { color: #fff; background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); }
            .rv-search-box {
                height: 36px; padding: 0 14px; border: 1px solid var(--rv-border);
                border-radius: 6px; font-size: 12px; color: #ccc; background: #111;
                outline: none; width: 220px;
                font-family: 'JetBrains Mono', monospace;
                transition: border-color .15s, box-shadow .15s;
            }
            .rv-search-box:focus { border-color: var(--rv-red); box-shadow: 0 0 0 2px rgba(239,68,68,0.1); }
            .rv-search-box::placeholder { color: #444; }

            /* ── Rivalry Cards Grid ── */
            .rv-grid-container {
                max-width: 1440px; margin: 0 auto; padding: 24px 64px 60px;
                width: 100%; box-sizing: border-box;
            }
            .rv-count {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; color: #444; margin-bottom: 16px;
            }
            .rv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

            /* ── Skeleton Cards ── */
            .rv-skeleton {
                background: var(--rv-card-bg); border: 1px solid var(--rv-border); padding: 28px;
                border-radius: 8px;
            }
            .rv-skel-bar {
                background: linear-gradient(90deg, #1a1a1a 0%, #222 40%, #1a1a1a 80%);
                background-size: 800px 100%;
                border-radius: 3px;
            }
            @media(prefers-reduced-motion:no-preference){
                .rv-skel-bar { animation: rv-shimmer 1.5s infinite linear; }
            }

            /* ── Rivalry Card ── */
            .rv-card {
                background: var(--rv-card-bg); border: 1px solid var(--rv-border);
                padding: 24px; border-radius: 10px;
                transition: all 0.3s var(--rv-ease);
                cursor: pointer; position: relative; overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            }
            .rv-card:hover {
                border-color: #444;
                box-shadow: 0 12px 40px rgba(0,0,0,0.5);
                transform: translateY(-4px);
            }
            .rv-card:active { transform: scale(0.995); }
            /* Live card glow */
            @media(prefers-reduced-motion:no-preference){
                .rv-card[data-status="active"] {
                    border-color: rgba(16,185,129,0.2);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 20px rgba(16,185,129,0.05);
                }
                .rv-card[data-status="active"]:hover {
                    border-color: rgba(16,185,129,0.4);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.1);
                }
            }
            .rv-card[data-status="pending"] { border-color: rgba(245,158,11,0.15); }
            .rv-card[data-status="settled"] { opacity: 0.7; }
            .rv-card[data-status="settled"]:hover { opacity: 1; }
            .rv-card-header {
                display: flex; align-items: center; justify-content: space-between;
                margin-bottom: 12px;
            }
            .rv-card-status {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 800; letter-spacing: 0.12em;
                text-transform: uppercase; color: var(--rv-green);
                display: flex; align-items: center; gap: 6px;
            }
            .rv-card-status .dot {
                width: 7px; height: 7px; border-radius: 50%;
                background: var(--rv-green);
            }
            @media(prefers-reduced-motion:no-preference){
                .rv-card-status .dot { animation: rv-pulse 1.8s infinite; }
            }
            .rv-card-status.pending { color: var(--rv-amber); }
            .rv-card-status.pending .dot { background: var(--rv-amber); animation: rv-pulse 2s infinite; }
            .rv-card-status.ended { color: var(--rv-muted); }
            .rv-card-status.ended .dot { background: var(--rv-muted); animation: none; }
            .rv-card-metric {
                font-size: 15px; font-weight: 600; color: #fff;
                margin-bottom: 14px; letter-spacing: -0.2px; line-height: 1.3;
            }

            /* Versus Strip */
            .rv-versus {
                display: flex; align-items: stretch; gap: 0;
                background: rgba(255,255,255,0.02); border: 1px solid var(--rv-border);
                margin-bottom: 14px; overflow: hidden; border-radius: 8px;
            }
            .rv-player {
                flex: 1; padding: 16px 18px; display: flex;
                flex-direction: column; gap: 4px;
            }
            .rv-player.right { text-align: right; border-left: 1px solid var(--rv-border); }
            .rv-player-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 700; letter-spacing: 0.12em;
                color: #555; text-transform: uppercase;
            }
            .rv-player-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px; font-weight: 700; color: #fff; letter-spacing: 0.02em;
                display: flex; align-items: center; gap: 6px;
            }
            .rv-player.right .rv-player-name { justify-content: flex-end; }
            .rv-lead-dot {
                width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
            }
            .rv-player-growth {
                font-size: 28px; font-weight: 700; color: #fff;
                letter-spacing: -1px; margin-top: 4px; line-height: 1.1;
            }
            .rv-player-growth.leading { color: var(--rv-green); }
            .rv-player-growth.trailing { color: var(--rv-red); }
            @media(prefers-reduced-motion:no-preference){
                .rv-player-growth.awaiting { animation: rv-pendingPulse 2s ease infinite; color: #444; font-size: 13px; letter-spacing: 0.1em; font-family: 'JetBrains Mono', monospace; }
            }
            .rv-vs-divider {
                display: flex; align-items: center; justify-content: center;
                width: 52px; flex-shrink: 0;
                background: rgba(255,255,255,0.015);
                border-left: 1px solid var(--rv-border); border-right: 1px solid var(--rv-border);
                flex-direction: column; gap: 2px;
            }
            .rv-vs-divider svg { opacity: 0.4; }
            .rv-vs-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px; font-weight: 900; color: #ef4444; letter-spacing: 0.1em;
            }

            /* Tug-of-War Momentum Bar */
            .rv-momentum {
                height: 6px; display: flex; overflow: hidden;
                margin-bottom: 14px; background: #1a1a1a; border-radius: 3px;
                position: relative;
            }
            .rv-momentum-left {
                background: linear-gradient(90deg, var(--rv-green), #34d399);
                transition: width .6s var(--rv-ease); border-radius: 3px 0 0 3px;
                animation: rv-tug 3s ease infinite;
            }
            .rv-momentum-right {
                background: linear-gradient(90deg, #ef4444, #dc2626);
                transition: width .6s var(--rv-ease); border-radius: 0 3px 3px 0;
                animation: rv-tug 3s ease 0.3s infinite;
            }

            /* Winner/Loser Badge */
            .rv-winner-badge {
                display: inline-flex; align-items: center; gap: 4px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 800; letter-spacing: 0.1em;
                text-transform: uppercase; padding: 3px 10px; border-radius: 4px;
            }
            .rv-winner-badge.winner { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
            .rv-winner-badge.loser { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
            .rv-winner-badge.forfeited { background: rgba(255,255,255,0.05); color: #666; border: 1px solid #333; }

            /* Settled card glow for winner */
            .rv-card[data-status="settled"][data-result="won"] {
                border-color: rgba(16,185,129,0.3); opacity: 1;
            }
            .rv-card[data-status="settled"][data-result="lost"] {
                border-color: rgba(239,68,68,0.2); opacity: 0.6;
            }
            .rv-card[data-status="settled"][data-result="lost"]:hover { opacity: 0.9; }

            /* Card Action Buttons */
            .rv-card-actions {
                display: flex; gap: 0; margin: 0 -24px -24px; padding: 0;
                border-top: 1px solid var(--rv-border); background: rgba(255,255,255,0.02);
                border-radius: 0 0 10px 10px; overflow: hidden;
            }
            .rv-action-btn {
                flex: 1; padding: 14px; border: none;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 800; letter-spacing: 0.12em;
                cursor: pointer; transition: all .15s var(--rv-ease);
                text-transform: uppercase; display: flex; align-items: center;
                justify-content: center; gap: 8px;
            }
            .rv-action-accept {
                background: linear-gradient(135deg, #dc2626, #991b1b); color: #fff;
            }
            .rv-action-accept:hover { background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 20px rgba(239,68,68,0.3); }
            .rv-action-decline {
                background: transparent; color: #666;
                border-left: 1px solid var(--rv-border) !important;
            }
            .rv-action-decline:hover { background: rgba(239,68,68,0.1); color: var(--rv-red); }

            /* Card Bottom */
            .rv-card-bottom {
                display: flex; align-items: center; justify-content: space-between;
            }
            .rv-card-stake { display: flex; flex-direction: column; gap: 2px; }
            .rv-card-stake-val {
                font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px;
            }
            .rv-card-stake-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 700; color: #555;
                letter-spacing: 0.15em; text-transform: uppercase;
            }
            .rv-card-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; color: var(--rv-muted); letter-spacing: 0.04em;
            }
            .rv-card-time.urgent { color: var(--rv-red); font-weight: 700; }
            .rv-card-provider-pill {
                display: inline-flex; align-items: center; padding: 3px 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 700; letter-spacing: 0.08em;
                color: #fff; text-transform: uppercase; border-radius: 4px;
            }
            .rv-open-badge {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 800; letter-spacing: 0.1em;
                background: var(--rv-amber); color: #000; padding: 3px 10px;
                text-transform: uppercase; border-radius: 4px;
            }

            /* ── How It Works ── */
            .rv-mechanism {
                background: #0d0d0d;
                border-top: 1px solid var(--rv-border);
                border-bottom: 1px solid var(--rv-border);
                padding: 64px 0; position: relative;
            }
            .rv-mechanism-inner {
                max-width: 1440px; margin: 0 auto; padding: 0 64px;
            }
            .rv-mechanism-header {
                display: flex; align-items: flex-end; justify-content: space-between;
                margin-bottom: 48px;
            }
            .rv-mechanism-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
                color: #555; text-transform: uppercase; margin-bottom: 12px;
            }
            .rv-mechanism-title {
                font-size: 32px; font-weight: 300; color: #fff;
                letter-spacing: -1px; margin: 0;
            }
            .rv-mechanism-title strong { font-weight: 700; color: var(--rv-red); }
            .rv-mechanism-grid {
                display: grid; grid-template-columns: repeat(3, 1fr);
                position: relative;
            }
            .rv-mech-card {
                padding: 40px 32px;
                border-right: 1px solid var(--rv-border);
                transition: all .2s var(--rv-ease);
                cursor: default; position: relative; z-index: 1;
            }
            .rv-mech-card:hover {
                background: rgba(255,255,255,0.02); transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
            .rv-mech-card:last-child { border-right: none; }
            .rv-mech-num {
                font-size: 56px; font-weight: 200;
                color: rgba(239,68,68,0.4);
                margin-bottom: 16px; line-height: 1;
            }
            .rv-mech-label {
                font-size: 20px; font-weight: 600; color: #fff;
                margin-bottom: 12px; letter-spacing: -0.3px;
            }
            .rv-mech-desc {
                font-size: 14px; color: #666; line-height: 1.6;
            }

            /* ── Stake Warning ── */
            .rv-warning {
                max-width: 1440px; margin: 0 auto;
                padding: 40px 64px; text-align: center;
            }
            .rv-warning-inner {
                display: inline-flex; align-items: center; gap: 10px;
                background: rgba(239,68,68,0.05); padding: 14px 28px;
                border: 1px solid rgba(239,68,68,0.1); border-radius: 8px;
            }
            .rv-warning-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
                color: #888; text-transform: uppercase;
            }

            /* ── Challenge Modal ── */
            @media(prefers-reduced-motion:no-preference){
                @keyframes rv-modalIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
            }
            .rv-modal-backdrop {
                position: fixed; inset: 0;
                background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
                z-index: 80; display: none;
                align-items: center; justify-content: center;
            }
            .rv-modal-backdrop.open { display: flex; }
            .rv-modal-backdrop.open .rv-modal { animation: rv-modalIn .2s var(--rv-ease) both; }
            .rv-modal {
                background: #141414;
                width: 480px;
                max-width: 90vw;
                max-height: 85vh;
                overflow-y: auto;
                border: 1px solid var(--rv-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                padding: 36px;
            }
            .rv-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 28px;
            }
            .rv-modal-title {
                font-size: 20px;
                font-weight: 500;
                color: #fff;
                letter-spacing: -0.3px;
            }
            .rv-modal-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #666;
                font-size: 18px;
            }
            .rv-modal-close:hover { color: #fff; }
            .rv-form-group {
                margin-bottom: 20px;
            }
            .rv-form-label {
                font-size: 12px;
                font-weight: 500;
                color: #888;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                margin-bottom: 6px;
                display: block;
            }
            .rv-form-input {
                width: 100%;
                height: 44px;
                background: #1a1a1a;
                border: 1px solid var(--rv-border);
                border-radius: 8px;
                padding: 0 14px;
                font-size: 14px;
                color: #e5e5e5;
                outline: none;
                transition: border-color 0.15s, box-shadow 0.15s;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                box-sizing: border-box;
            }
            .rv-form-input:focus {
                border-color: var(--rv-red);
                box-shadow: 0 0 0 2px rgba(239,68,68,0.15);
            }
            .rv-form-select {
                width: 100%;
                height: 44px;
                background: #1a1a1a;
                border: 1px solid var(--rv-border);
                border-radius: 8px;
                padding: 0 14px;
                font-size: 14px;
                color: #e5e5e5;
                outline: none;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                box-sizing: border-box;
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 14px center;
            }
            .rv-form-select:focus {
                border-color: var(--rv-red);
                box-shadow: 0 0 0 2px rgba(239,68,68,0.15);
            }
            .rv-duration-pills {
                display: flex;
                gap: 8px;
            }
            .rv-dur-pill {
                flex: 1;
                height: 40px;
                border: 1px solid var(--rv-border);
                border-radius: 8px;
                background: #1a1a1a;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 600;
                color: #999;
                cursor: pointer;
                transition: all 0.15s;
                letter-spacing: 0.04em;
            }
            .rv-dur-pill:hover { border-color: #444; color: #ccc; }
            .rv-dur-pill.active {
                background: #111;
                color: #fff;
                border-color: #111;
            }
            .rv-stake-pills {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 6px;
            }
            .rv-stake-pill {
                padding: 10px 8px;
                background: #fff;
                border: 1px solid #e5e5e5;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 600;
                color: #666;
                cursor: pointer;
                transition: all 0.15s;
                letter-spacing: 0.02em;
                text-align: center;
            }
            .rv-stake-pill:hover { border-color: #444; color: #ccc; }
            .rv-stake-pill.active {
                background: #111;
                color: #fff;
                border-color: #111;
            }
            .rv-modal.high-stakes .rv-stake-pill.active {
                background: var(--rv-brand);
                border-color: var(--rv-red);
            }
            .rv-tier-pills {
                display: flex; gap: 8px;
            }
            .rv-tier-pill {
                flex: 1; display: flex; flex-direction: column;
                align-items: center; gap: 2px;
                padding: 12px 8px;
                background: #fff;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                transition: all 0.15s;
                text-align: center;
            }
            .rv-tier-pill:hover { border-color: #444; }
            .rv-tier-pill.active {
                background: #111; border-color: #111;
            }
            .rv-tier-pill.active .rv-tier-name { color: #fff; }
            .rv-tier-pill.active .rv-tier-target { color: rgba(255,255,255,0.7); }
            .rv-tier-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 800;
                letter-spacing: 0.1em; color: #ccc;
            }
            .rv-tier-target {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600;
                color: #666; letter-spacing: 0.02em;
            }
            .rv-form-hint {
                font-size: 11px;
                color: #bbb;
                margin-top: 6px;
                font-family: 'JetBrains Mono', monospace;
            }
            .rv-modal-preview {
                background: rgba(255,255,255,0.02);
                border: 1px solid var(--rv-border);
                padding: 20px; border-radius: 8px;
                margin-bottom: 24px;
            }
            .rv-preview-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 0;
            }
            .rv-preview-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 600;
                color: #555;
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }
            .rv-preview-value {
                font-size: 13px;
                font-weight: 500;
                color: #fff;
            }
            .rv-btn-submit {
                width: 100%;
                height: 46px;
                background: linear-gradient(135deg, #dc2626, #991b1b);
                color: #fff;
                border: none;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.06em;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                cursor: pointer;
                transition: background 0.15s;
            }
            .rv-btn-submit:hover { box-shadow: 0 4px 20px rgba(239,68,68,0.3); }
            .rv-modal-footer {
                text-align: center;
                margin-top: 16px;
            }
            .rv-modal-footer-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #555;
                letter-spacing: 0.06em;
            }

            /* ── Empty State ── */
            .rv-empty {
                text-align: center; padding: 80px 20px;
                border: 1px solid var(--rv-border); border-radius: 10px;
                background: var(--rv-card-bg);
                position: relative; overflow: hidden;
            }
            .rv-empty::before {
                content: ''; position: absolute; inset: 0;
                background: radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.03), transparent 70%);
                pointer-events: none;
            }
            .rv-empty-icon {
                width: 56px; height: 56px; margin: 0 auto 24px;
                opacity: 0.15;
            }
            .rv-empty-title {
                font-size: 18px; font-weight: 500; color: #ccc;
                margin-bottom: 8px; letter-spacing: -0.3px;
            }
            .rv-empty-sub {
                font-size: 13px; color: #666; margin-bottom: 28px; max-width: 360px; margin-left: auto; margin-right: auto; line-height: 1.6;
            }

            /* ── Hottest Rivalry Featured Card ── */
            .rv-featured {
                max-width: 1440px;
                margin: 0 auto;
                padding: 0 64px;
            }
            .rv-featured-card {
                background: var(--rv-card-bg);
                border: 1px solid var(--rv-border);
                padding: 32px 36px;
                position: relative;
                margin-bottom: 12px;
                overflow: hidden;
                border-radius: 10px;
            }
            .rv-featured-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 3px;
                background: linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #10b981 100%);
            }
            .rv-featured-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                color: #ef4444;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .rv-featured-tag .fire { font-size: 12px; }
            .rv-featured-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 32px;
            }
            .rv-featured-vs {
                display: flex;
                align-items: center;
                gap: 20px;
                flex: 1;
            }
            .rv-featured-player {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .rv-featured-player.right { text-align: right; }
            .rv-featured-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 14px;
                font-weight: 600;
                color: #fff;
                letter-spacing: 0.02em;
            }
            .rv-featured-growth {
                font-size: 28px;
                font-weight: 700;
                letter-spacing: -0.5px;
            }
            .rv-featured-meta {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 4px;
                flex-shrink: 0;
            }
            .rv-featured-pool {
                font-size: 22px;
                font-weight: 700;
                color: #fff;
            }
            .rv-featured-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #666;
            }

            /* ── Modal High Stakes Warning ── */
            .rv-modal.high-stakes {
                border-color: rgba(239, 68, 68, 0.3);
            }
            .rv-modal-warning {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.06em;
                color: #3B0001;
                text-align: center;
                padding: 12px 0 0;
            }

            /* ── Responsive ── */
            @media (max-width: 1200px) {
                .rv-grid { grid-template-columns: 1fr; }
                .rv-mechanism-grid { grid-template-columns: repeat(3, 1fr); }
                .rv-hero-inner { padding: 40px 32px; }
                .rv-controls { padding: 24px 32px 0; }
                .rv-grid-container { padding: 24px 32px 48px; }
                .rv-mechanism-inner { padding: 0 32px; }
                .rv-warning { padding: 32px; }
            }

            @media (max-width: 768px) {
                .rv-ticker-inner { font-size: 10px; gap: 12px; padding: 8px 16px; }
                .rv-hero-inner { padding: 32px 20px; }
                .rv-hero-row { flex-direction: column; align-items: flex-start; gap: 20px; }
                .rv-hero-title { font-size: 32px; letter-spacing: -1px; }
                .rv-hero-sub { font-size: 14px; }
                .rv-hero-right { width: 100%; }
                .rv-btn-challenge { width: 100%; }
                .rv-btn-join { width: 100%; }
                .rv-stats {
                    display: grid; grid-template-columns: repeat(3, 1fr);
                    gap: 0; border: 1px solid var(--rv-border);
                    border-radius: 8px; overflow: hidden; margin-top: 24px;
                }
                .rv-stat-group {
                    padding: 16px 12px; text-align: center;
                    border-right: 1px solid var(--rv-border);
                }
                .rv-stat-group:last-child { border-right: none; }
                .rv-stat-val { font-size: 20px; letter-spacing: -0.5px; }
                .rv-stat-lbl { font-size: 8px; }
                .rv-controls { padding: 20px 20px 0; flex-direction: column; align-items: flex-start; gap: 12px; }
                .rv-tabs { gap: 6px; overflow-x: auto; width: 100%; }
                .rv-tab { white-space: nowrap; font-size: 9px; padding: 6px 12px; }
                .rv-search-box { width: 100%; }
                .rv-grid-container { padding: 20px 20px 40px; }
                .rv-grid { grid-template-columns: 1fr; }
                .rv-card { padding: 20px; }
                .rv-versus { flex-direction: column; }
                .rv-player.right { text-align: left; border-left: none; border-top: 1px solid var(--rv-border); }
                .rv-vs-divider { width: 100%; height: 32px; border-left: none; border-right: none; border-top: 1px solid var(--rv-border); border-bottom: 1px solid var(--rv-border); }
                .rv-mechanism { padding: 40px 0; }
                .rv-mechanism-inner { padding: 0 20px; }
                .rv-mechanism-grid { grid-template-columns: 1fr; }
                .rv-mech-card { border-right: none; border-bottom: 1px solid var(--rv-border); padding: 28px 0; }
                .rv-mech-card:last-child { border-bottom: none; }
                .rv-mechanism-title { font-size: 24px; }
                .rv-warning { padding: 28px 20px; }
                .rv-card-actions { margin: 0 -20px -20px; }
            }
        </style>

        <div class="rv">
            <!-- Live Ticker -->
            <div class="rv-ticker" id="rv-ticker">
                <div class="rv-ticker-inner">
                    <span class="rv-ticker-item"><span class="rv-ticker-dot live"></span> <strong id="rv-tick-active">0</strong> duels live now</span>
                    <span class="rv-ticker-sep">·</span>
                    <span class="rv-ticker-item">💰 <strong>$<span id="rv-tick-locked">0</span></strong> locked in active duels</span>
                    <span class="rv-ticker-sep">·</span>
                    <span class="rv-ticker-item">🏆 Largest pool: <strong>$<span id="rv-tick-largest">0</span></strong></span>
                </div>
            </div>

            <!-- Hero -->
            <div class="rv-hero">
                <div class="rv-hero-inner">
                    <div class="rv-hero-row">
                        <div class="rv-hero-left">
                            <h1 class="rv-hero-title">Duels. Win or<br>Lose <strong>Capital.</strong></h1>
                            <p class="rv-hero-sub">Lock funds. Compete on verified metrics. Winner takes all. Loser forfeits everything.</p>
                        </div>
                        <div class="rv-hero-right">
                            <button class="rv-btn-challenge rv-glow" id="rv-btn-issue">⚔ START A DUEL</button>
                            <button class="rv-btn-join" onclick="document.querySelector('.rv-tab[data-filter=\\'pending\\']')?.click()">→ JOIN OPEN DUEL</button>
                        </div>
                    </div>

                    <div class="rv-stats">
                        <div class="rv-stat-group">
                            <div class="rv-stat-val" id="rv-stat-active">0</div>
                            <div class="rv-stat-lbl"><span class="dot" style="width:6px;height:6px;border-radius:50%;background:#10b981;animation:rv-pulse 2s infinite;"></span> LIVE DUELS</div>
                        </div>
                        <div class="rv-stat-group">
                            <div class="rv-stat-val">$<span id="rv-stat-capital">0</span></div>
                            <div class="rv-stat-lbl">CAPITAL LOCKED</div>
                        </div>
                        <div class="rv-stat-group">
                            <div class="rv-stat-val">$<span id="rv-stat-largest">0</span></div>
                            <div class="rv-stat-lbl">LARGEST POOL</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Controls -->
            <div class="rv-controls">
                <div class="rv-tabs" id="rv-tabs">
                    <button class="rv-tab active" data-filter="all">ALL DUELS</button>
                    <button class="rv-tab" data-filter="active">🔥 LIVE NOW</button>
                    <button class="rv-tab" data-filter="pending">⚔ OPEN DUELS</button>
                    <button class="rv-tab" data-filter="settled">🏆 COMPLETED</button>
                </div>
                <input type="text" class="rv-search-box" id="rv-search" placeholder="Search duels...">
            </div>

            <!-- Grid -->
            <div class="rv-grid-container">
                <div class="rv-count" id="rv-count">0 rivalries</div>
                <div class="rv-grid" id="rv-grid">
                    <!-- Dynamic rivalry cards -->
                </div>
            </div>

            <!-- How It Works -->
            <section class="rv-mechanism">
                <div class="rv-mechanism-inner">
                    <div class="rv-mechanism-header">
                        <div>
                            <div class="rv-mechanism-tag">How Rivalry Works</div>
                            <h2 class="rv-mechanism-title">Three steps to <strong>settlement.</strong></h2>
                        </div>
                    </div>
                    <div class="rv-mechanism-grid">
                        <div class="rv-mech-card">
                            <div class="rv-mech-num">01</div>
                            <div class="rv-mech-label">Challenge</div>
                            <div class="rv-mech-desc">Challenge any verified operator to a head-to-head duel. Choose the metric, set the stake, define the time window. Both sides lock capital.</div>
                        </div>
                        <div class="rv-mech-card">
                            <div class="rv-mech-num">02</div>
                            <div class="rv-mech-label">Compete</div>
                            <div class="rv-mech-desc">Performance is tracked in real-time via verified API integrations. Baseline snapshots are taken at lock-in. Growth percentage determines standing.</div>
                        </div>
                        <div class="rv-mech-card">
                            <div class="rv-mech-num">03</div>
                            <div class="rv-mech-label">Settle</div>
                            <div class="rv-mech-desc">At deadline, each operator's growth is verified against their target. Hit it and collect the rivalry multiplier. Miss and forfeit your capital.</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Warning -->
            <div class="rv-warning">
                <div class="rv-warning-inner">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <div class="rv-warning-text">⚠ Both operators lock capital. Losing operator forfeits stake. No appeals. No reversals.</div>
                </div>
            </div>

            <!-- Featured Slot -->
            <div class="rv-featured" id="rv-featured" style="max-width:1440px;margin:0 auto;padding:0 64px;"></div>
        </div>

        <!-- Challenge Modal -->
        <div class="rv-modal-backdrop" id="rv-challenge-modal" onclick="if(event.target===this) this.classList.remove('open')">
            <div class="rv-modal">
                <div class="rv-modal-header">
                    <span class="rv-modal-title">Issue Challenge</span>
                    <button class="rv-modal-close" onclick="document.getElementById('rv-challenge-modal').classList.remove('open')">✕</button>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Challenge Type</label>
                    <div class="rv-challenge-type-toggle" id="rv-challenge-type" style="display:flex;gap:0;border:1px solid #e5e5e5;overflow:hidden;margin-bottom:8px;">
                        <button class="rv-type-btn active" data-type="direct" style="flex:1;padding:10px 16px;background:#1a1a1a;color:#fff;border:none;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.08em;cursor:pointer;font-weight:700;text-transform:uppercase;transition:all 0.15s;">✉ Direct Challenge</button>
                        <button class="rv-type-btn" data-type="open" style="flex:1;padding:10px 16px;background:#fff;color:#666;border:none;border-left:1px solid #e5e5e5;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.08em;cursor:pointer;font-weight:700;text-transform:uppercase;transition:all 0.15s;">🌐 Open Challenge</button>
                    </div>
                    <div class="rv-form-hint" id="rv-type-hint">Send to a specific operator</div>
                </div>

                <div class="rv-form-group" id="rv-opponent-group">
                    <label class="rv-form-label">Opponent Username</label>
                    <input type="text" class="rv-form-input" id="rv-opponent" placeholder="@username">
                    <div class="rv-form-hint">Enter the username of the operator you want to challenge</div>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Competition Metric</label>
                    <select class="rv-form-select" id="rv-metric">
                        <option value="revenue_growth">Revenue Growth (Stripe)</option>
                        <option value="follower_growth">Follower Growth (X)</option>
                        <option value="subscriber_growth">Subscriber Growth (YouTube)</option>
                        <option value="views_growth">Views Growth (YouTube)</option>
                        <option value="sales_growth">Sales Growth (Shopify)</option>
                        <option value="order_growth">Order Growth (Amazon)</option>
                    </select>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Your Stake</label>
                    <div class="rv-stake-pills" id="rv-stake-pills">
                        <button class="rv-stake-pill active" data-amount="100">$100</button>
                        <button class="rv-stake-pill" data-amount="250">$250</button>
                        <button class="rv-stake-pill" data-amount="500">$500</button>
                        <button class="rv-stake-pill" data-amount="1000">$1K</button>
                        <button class="rv-stake-pill" data-amount="2500">$2.5K</button>
                        <button class="rv-stake-pill" data-amount="5000">$5K</button>
                        <button class="rv-stake-pill" data-amount="10000">$10K</button>
                        <button class="rv-stake-pill" data-amount="20000">$20K</button>
                    </div>
                    <div class="rv-form-hint">Minimum $100 · Opponent must match your stake</div>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Rivalry Tier</label>
                    <div class="rv-tier-pills" id="rv-tier-pills">
                        <button class="rv-tier-pill active" data-tier="DUEL" data-target="15"><span class="rv-tier-name">DUEL</span><span class="rv-tier-target">+15%</span></button>
                        <button class="rv-tier-pill" data-tier="WAR" data-target="25"><span class="rv-tier-name">WAR</span><span class="rv-tier-target">+25%</span></button>
                        <button class="rv-tier-pill" data-tier="BLOOD" data-target="40"><span class="rv-tier-name">BLOOD</span><span class="rv-tier-target">+40%</span></button>
                    </div>
                    <div class="rv-form-hint">Both operators must hit this target or lose capital</div>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Duration</label>
                    <div class="rv-duration-pills" id="rv-duration-pills">
                        <button class="rv-dur-pill" data-days="7">7D</button>
                        <button class="rv-dur-pill active" data-days="14">14D</button>
                        <button class="rv-dur-pill" data-days="30">30D</button>
                        <button class="rv-dur-pill" data-days="90">90D</button>
                    </div>
                </div>

                <div class="rv-modal-preview" id="rv-preview">
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Your Stake</span>
                        <span class="rv-preview-value" id="rv-preview-stake">$0</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Combined Pool</span>
                        <span class="rv-preview-value" id="rv-preview-pool">$0</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Duration</span>
                        <span class="rv-preview-value" id="rv-preview-duration">14 days</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Metric</span>
                        <span class="rv-preview-value" id="rv-preview-metric">Revenue Growth</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Growth Target</span>
                        <span class="rv-preview-value" id="rv-preview-target">+15%</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">If Both Miss</span>
                        <span class="rv-preview-value" style="color:#3B0001">Protocol Keeps Pool</span>
                    </div>
                </div>

                <button class="rv-btn-submit" id="rv-btn-submit">SEND CHALLENGE</button>

                <div class="rv-modal-footer">
                    <div class="rv-modal-footer-text">Challenge is binding once accepted. Capital locks immediately.</div>
                    <div class="rv-modal-warning">Both operators lock capital. Losing operator forfeits stake.</div>
                </div>
            </div>
        </div>
    `;
}


export async function initRivalry() {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const grid = document.getElementById('rv-grid');
    const countLbl = document.getElementById('rv-count');
    const statActive = document.getElementById('rv-stat-active');
    const statCapital = document.getElementById('rv-stat-capital');
    const statLargest = document.getElementById('rv-stat-largest');

    if (!grid) return;

    // ── State mapping: API state → card status ──
    const STATE_TO_STATUS = {
        CHALLENGE_ISSUED: 'pending', ACCEPTED: 'pending',
        BOTH_FUNDED: 'active', ACTIVE: 'active', VERIFYING: 'active',
        VERIFIED: 'active', SETTLING: 'active',
        SETTLED: 'settled', DRAW: 'settled',
        DECLINED: 'settled', EXPIRED: 'settled', CANCELLED: 'settled',
    };
    const METRIC_LABELS = { REVENUE: 'Revenue Growth', FOLLOWERS: 'Follower Growth', SUBSCRIBERS: 'Subscriber Growth', VIEWS: 'Views Growth', GROSS_SALES: 'Sales Growth', ORDER_COUNT: 'Order Growth' };
    const PLATFORM_MAP = { STRIPE: 'stripe', X: 'x', YOUTUBE: 'youtube', SHOPIFY: 'shopify', AMAZON: 'amazon' };

    // Transform API rivalry → card format
    function transformRivalry(r) {
        const challPart = r.participants?.find(p => p.role === 'challenger');
        const oppPart = r.participants?.find(p => p.role === 'opponent');
        const now = new Date();
        const start = new Date(r.activatedAt || r.createdAt);
        const end = new Date(start.getTime() + (r.durationDays || 30) * 86400000);
        const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));

        const metricName = METRIC_LABELS[r.metricType] || r.metricType || 'Revenue Growth';

        return {
            id: r.id,
            status: STATE_TO_STATUS[r.state] || 'active',
            state: r.state,
            metric: metricName,
            provider: PLATFORM_MAP[r.platform] || (r.platform || 'stripe').toLowerCase(),
            isOpen: !r.opponentUserId || r.opponentUsername === 'unknown' || !r.opponentUsername,
            challenger: {
                name: '@' + (r.challengerUsername || 'unknown'),
                growth: parseFloat(challPart?.growthPercent || challPart?.currentDelta || 0),
                baseline: parseFloat(challPart?.baselineValue || 0),
            },
            opponent: {
                name: r.opponentUserId ? ('@' + (r.opponentUsername || 'unknown')) : 'OPEN OPPONENT',
                growth: parseFloat(oppPart?.growthPercent || oppPart?.currentDelta || 0),
                baseline: parseFloat(oppPart?.baselineValue || 0),
            },
            stake: (r.stakePerSideCents || 0) / 100,
            daysLeft,
            totalDays: r.durationDays || 30,
        };
    }

    // ── Fetch live rivalries ── 
    let allRivalries = [];
    let isLive = false;

    // Show skeleton loading in grid
    grid.innerHTML = Array(4).fill(0).map(() => `<div class="rv-skeleton">
        <div class="rv-skel-bar" style="width:120px;height:10px;margin-bottom:20px;"></div>
        <div class="rv-skel-bar" style="width:180px;height:14px;margin-bottom:18px;"></div>
        <div style="display:flex;gap:0;background:#fafafa;border:1px solid #f0f0f0;margin-bottom:18px;">
            <div style="flex:1;padding:20px;"><div class="rv-skel-bar" style="width:60px;height:8px;margin-bottom:8px;"></div><div class="rv-skel-bar" style="width:80px;height:10px;margin-bottom:8px;"></div><div class="rv-skel-bar" style="width:50px;height:24px;"></div></div>
            <div style="width:56px;background:#f0f0f0;"></div>
            <div style="flex:1;padding:20px;text-align:right;"><div class="rv-skel-bar" style="width:60px;height:8px;margin-bottom:8px;margin-left:auto;"></div><div class="rv-skel-bar" style="width:80px;height:10px;margin-bottom:8px;margin-left:auto;"></div><div class="rv-skel-bar" style="width:50px;height:24px;margin-left:auto;"></div></div>
        </div>
        <div style="display:flex;justify-content:space-between;"><div class="rv-skel-bar" style="width:80px;height:16px;"></div><div class="rv-skel-bar" style="width:60px;height:14px;"></div><div class="rv-skel-bar" style="width:70px;height:10px;"></div></div>
    </div>`).join('');

    try {
        const res = await api.getRivalries({ limit: 50 });
        if (res.ok && res.rivalries && res.rivalries.length > 0) {
            allRivalries = res.rivalries.map(transformRivalry);
            isLive = true;
            console.log(`[Rivalry] Loaded ${allRivalries.length} live rivalries`);
        } else {
            console.log('[Rivalry] No rivalries found');
        }
    } catch (e) {
        console.log('[Rivalry] API unavailable:', e.message);
    }

    let activeFilter = 'all';
    let searchQuery = '';

    function getProviderColor(provider) {
        const colors = { stripe: '#635bff', x: '#111', youtube: '#ff0000', shopify: '#96bf48', amazon: '#ff9900' };
        return colors[provider] || '#111';
    }

    function renderSkeleton() {
        return `<div class="rv-skeleton">
            <div class="rv-skel-bar" style="width:120px;height:10px;margin-bottom:20px;"></div>
            <div class="rv-skel-bar" style="width:180px;height:14px;margin-bottom:18px;"></div>
            <div style="display:flex;gap:0;background:#fafafa;border:1px solid #f0f0f0;margin-bottom:18px;">
                <div style="flex:1;padding:20px;"><div class="rv-skel-bar" style="width:60px;height:8px;margin-bottom:8px;"></div><div class="rv-skel-bar" style="width:80px;height:10px;margin-bottom:8px;"></div><div class="rv-skel-bar" style="width:50px;height:24px;"></div></div>
                <div style="width:56px;background:#f0f0f0;"></div>
                <div style="flex:1;padding:20px;text-align:right;"><div class="rv-skel-bar" style="width:60px;height:8px;margin-bottom:8px;margin-left:auto;"></div><div class="rv-skel-bar" style="width:80px;height:10px;margin-bottom:8px;margin-left:auto;"></div><div class="rv-skel-bar" style="width:50px;height:24px;margin-left:auto;"></div></div>
            </div>
            <div style="display:flex;justify-content:space-between;"><div class="rv-skel-bar" style="width:80px;height:16px;"></div><div class="rv-skel-bar" style="width:60px;height:14px;"></div><div class="rv-skel-bar" style="width:70px;height:10px;"></div></div>
        </div>`;
    }

    function renderCard(r) {
        const isLeadingChallenger = r.challenger.growth >= r.opponent.growth;
        const statusClass = r.status === 'pending' ? 'pending' : r.status === 'settled' ? 'ended' : '';
        const statusLabel = r.status === 'pending' ? 'OPEN' : r.status === 'settled' ? 'COMPLETED' : '🔥 LIVE';
        const timeLabel = r.status === 'settled' ? 'SETTLED' : r.daysLeft <= 1 ? `⏱ ${r.daysLeft * 24}H LEFT` : `⏱ ${r.daysLeft}D LEFT`;
        const timeUrgent = r.status !== 'settled' && r.daysLeft <= 3;

        // Momentum bar percentages
        const totalGrowth = Math.abs(r.challenger.growth) + Math.abs(r.opponent.growth);
        let leftPct = 50;
        let rightPct = 50;
        
        if (r.status === 'pending') {
            // Leave at 50/50 but visual tension handled in CSS
        } else if (totalGrowth === 0) {
            // Visual tension for 0 vs 0 active state
            leftPct = 50; rightPct = 50;
        } else {
            // Exaggerate the leader slightly for visual dominance
            const rawLeft = (Math.abs(r.challenger.growth) / totalGrowth) * 100;
            leftPct = isLeadingChallenger ? Math.min(rawLeft + 10, 95) : Math.max(rawLeft - 10, 5);
            rightPct = 100 - leftPct;
        }

        // Growth display
        const challGrowth = r.status === 'pending'
            ? '<span class="rv-player-growth awaiting" style="font-family:\'JetBrains Mono\',monospace;letter-spacing:0.1em;text-transform:uppercase;">FORMING</span>'
            : `<span class="rv-player-growth ${isLeadingChallenger ? 'leading' : 'trailing'}">${r.challenger.growth > 0 ? '+' : ''}${r.challenger.growth}%</span>`;
        const oppGrowth = r.status === 'pending'
            ? '<span class="rv-player-growth awaiting" style="font-family:\'JetBrains Mono\',monospace;letter-spacing:0.1em;text-transform:uppercase;">FORMING</span>'
            : `<span class="rv-player-growth ${!isLeadingChallenger ? 'leading' : 'trailing'}">${r.opponent.growth > 0 ? '+' : ''}${r.opponent.growth}%</span>`;

        // Lead dots
        const challDot = r.status !== 'pending' ? `<span class="rv-lead-dot" style="background:${isLeadingChallenger ? 'var(--rv-green)' : 'var(--rv-red)'}"></span>` : '';
        const oppDot = r.status !== 'pending' ? `<span class="rv-lead-dot" style="background:${!isLeadingChallenger ? 'var(--rv-green)' : 'var(--rv-red)'}"></span>` : '';

        // Action buttons
        let actionsHtml = '';
        if (r.status === 'pending') {
            if (r.isOpen) {
                actionsHtml = `<div class="rv-card-actions"><button class="rv-action-btn rv-action-accept" data-rivalry-id="${r.id}" onclick="event.stopPropagation();window.app.acceptRivalry('${r.id}')" style="flex:1;">⚔ JOIN DUEL</button></div>`;
            } else {
                actionsHtml = `<div class="rv-card-actions"><button class="rv-action-btn rv-action-accept" data-rivalry-id="${r.id}" onclick="event.stopPropagation();window.app.acceptRivalry('${r.id}')">⚔ ACCEPT</button><button class="rv-action-btn rv-action-decline" data-rivalry-id="${r.id}" onclick="event.stopPropagation();window.app.declineRivalry('${r.id}')">DECLINE</button></div>`;
            }
        }

        // Winner/Loser badge for settled cards
        let resultAttr = '';
        let winnerBadge = '';
        if (r.status === 'settled') {
            const challWon = r.challenger.growth > r.opponent.growth;
            const isDraw = r.challenger.growth === r.opponent.growth;
            if (isDraw) {
                winnerBadge = '<span class="rv-winner-badge forfeited">DRAW</span>';
            } else {
                winnerBadge = challWon
                    ? '<span class="rv-winner-badge winner">CHALLENGER WON</span>'
                    : '<span class="rv-winner-badge loser">OPPONENT WON</span>';
                resultAttr = challWon ? 'data-result="won"' : 'data-result="lost"';
            }
        }

        return `
            <div class="rv-card" data-status="${r.status}" data-id="${r.id}" ${resultAttr}>
                <div class="rv-card-header">
                    <div class="rv-card-status ${statusClass}">
                        <span class="dot"></span>
                        ${statusLabel}
                    </div>
                    ${r.isOpen && r.status === 'pending' ? '<span class="rv-open-badge">🌐 OPEN</span>' : ''}
                    ${winnerBadge}
                </div>
                <div class="rv-card-metric">${r.metric}</div>
                <div class="rv-versus">
                    <div class="rv-player">
                        <span class="rv-player-label">Challenger</span>
                        <span class="rv-player-name">${challDot}${r.challenger.name}</span>
                        ${challGrowth}
                    </div>
                    <div class="rv-vs-divider">
                        <span style="font-size:16px">🔥</span>
                        <span class="rv-vs-text">VS</span>
                    </div>
                    <div class="rv-player right">
                        <span class="rv-player-label">Opponent</span>
                        <span class="rv-player-name">${r.opponent.name}${oppDot}</span>
                        ${oppGrowth}
                    </div>
                </div>
                ${r.status !== 'pending' ? `
                <div class="rv-momentum">
                    <div class="rv-momentum-left" style="width:${leftPct}%"></div>
                    <div class="rv-momentum-right" style="width:${rightPct}%"></div>
                </div>` : ''}
                <div class="rv-card-bottom">
                    <div class="rv-card-stake">
                        <span class="rv-card-stake-val">💰 $${(r.stake * 2).toLocaleString()}</span>
                        <span class="rv-card-stake-lbl">AT STAKE</span>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                        <span class="rv-card-provider-pill" style="background:${getProviderColor(r.provider)}">${r.provider.toUpperCase()}</span>
                        <span class="rv-card-time${timeUrgent ? ' urgent' : ''}">${timeLabel}</span>
                    </div>
                </div>
                ${actionsHtml}
            </div>
        `;
    }

    function renderGrid() {
        let filtered = allRivalries;

        if (activeFilter !== 'all') {
            filtered = filtered.filter(r => r.status === activeFilter);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.challenger.name.toLowerCase().includes(q) ||
                r.opponent.name.toLowerCase().includes(q) ||
                r.metric.toLowerCase().includes(q) ||
                r.id.toLowerCase().includes(q)
            );
        }

        if (countLbl) countLbl.textContent = `${filtered.length} rivalr${filtered.length !== 1 ? 'ies' : 'y'}`;

        if (filtered.length === 0) {
            const emptyMessages = {
                active: { title: 'No active duels', sub: 'The arena is quiet. Issue the first challenge and put your metrics on the line.' },
                pending: { title: 'No pending challenges', sub: 'All challenges have been accepted or expired. Time to issue a new one.' },
                settled: { title: 'No settled rivalries', sub: 'No duels have concluded yet. Check back when active rivalries reach their deadline.' },
                all: { title: 'No rivalries yet', sub: 'Be the first to challenge another operator. Lock capital, prove performance, take everything.' }
            };
            const msg = emptyMessages[activeFilter] || emptyMessages.all;
            grid.innerHTML = `
                <div class="rv-empty" style="grid-column:1/-1;">
                    <svg class="rv-empty-icon" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>
                    <div class="rv-empty-title">${msg.title}</div>
                    <div class="rv-empty-sub">${msg.sub}</div>
                    <button class="rv-btn-challenge" onclick="document.getElementById('rv-challenge-modal').classList.add('open')" style="margin:0 auto;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;margin-right:4px"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg> ISSUE CHALLENGE
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(renderCard).join('');

        // Empty state
        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
                <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:0.12em;color:#ccc;text-transform:uppercase;margin-bottom:12px;">No rivalries found</div>
                <div style="font-size:13px;color:#999;">${activeFilter === 'active' ? 'No active duels right now. Issue a challenge to start one.' : activeFilter === 'pending' ? 'No pending challenges.' : activeFilter === 'settled' ? 'No settled rivalries yet.' : 'No rivalries have been created yet.'}</div>
            </div>`;
        }

        // Card click → detail page
        grid.querySelectorAll('.rv-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                if (id) window.location.hash = '/rivalry/' + id;
            });
        });
    }

    // ── Hottest Rivalry ──
    function renderFeatured() {
        const featured = document.getElementById('rv-featured');
        if (!featured) return;

        // Find the hottest active rivalry (largest stake)
        const activeRivalries = allRivalries.filter(r => r.status === 'active');
        if (activeRivalries.length === 0) { featured.innerHTML = ''; return; }

        const hot = activeRivalries.reduce((a, b) => a.stake > b.stake ? a : b);
        const challWon = hot.challenger.growth > hot.opponent.growth;
        const challDot = hot.status === 'settled' ? '' : `<span class="rv-lead-dot" style="background:${challWon ? 'var(--rv-green)' : 'var(--rv-red)'}"></span>`;
        const oppDot = hot.status === 'settled' ? '' : `<span class="rv-lead-dot" style="background:${!challWon ? 'var(--rv-green)' : 'var(--rv-red)'}"></span>`;

        const challGrowth = hot.status === 'pending'
            ? '<span class="rv-featured-growth" style="color:#ccc;font-size:16px;font-family:\'JetBrains Mono\',monospace;letter-spacing:0.1em;text-transform:uppercase;">FORMING</span>'
            : `<span class="rv-featured-growth" style="color:${challWon ? 'var(--rv-green)' : 'var(--rv-brand)'}">${hot.challenger.growth > 0 ? '+' : ''}${hot.challenger.growth}%</span>`;
            
        const oppGrowth = hot.status === 'pending'
            ? '<span class="rv-featured-growth" style="color:#ccc;font-size:16px;font-family:\'JetBrains Mono\',monospace;letter-spacing:0.1em;text-transform:uppercase;">FORMING</span>'
            : `<span class="rv-featured-growth" style="color:${!challWon ? 'var(--rv-green)' : 'var(--rv-brand)'}">${hot.opponent.growth > 0 ? '+' : ''}${hot.opponent.growth}%</span>`;

        const timeLabel = hot.status === 'settled' ? 'SETTLED' : hot.daysLeft <= 1 ? `${hot.daysLeft * 24}H REMAINING` : `${hot.daysLeft}D REMAINING`;

        featured.innerHTML = `
            <div class="rv-featured-card">
                <div class="rv-featured-tag"><span class="fire">🔥</span> HOTTEST RIVALRY</div>
                <div class="rv-featured-row">
                    <div class="rv-featured-vs">
                        <div class="rv-featured-player">
                            <span class="rv-player-label">CHALLENGER</span>
                            <span class="rv-featured-name">${challDot}${hot.challenger.name}</span>
                            ${challGrowth}
                        </div>
                        <div class="rv-vs-divider" style="background:transparent;border:none;width:40px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>
                        </div>
                        <div class="rv-featured-player right">
                            <span class="rv-player-label">OPPONENT</span>
                            <span class="rv-featured-name">${hot.opponent.name}${oppDot}</span>
                            ${oppGrowth}
                        </div>
                    </div>
                    <div class="rv-featured-meta">
                        <span class="rv-card-stake-lbl" style="color:#555;margin-bottom:-4px;">AT STAKE</span>
                        <div class="rv-featured-pool">$${(hot.stake * 2).toLocaleString()}</div>
                        <div class="rv-featured-time">○ ${timeLabel}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // ── Stats (try live API first, fallback to local) ──
    const tickActive = document.getElementById('rv-tick-active');
    const tickLocked = document.getElementById('rv-tick-locked');
    const tickLargest = document.getElementById('rv-tick-largest');

    function fmtCurrency(v) {
        return v === 0 ? '0' : v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v.toLocaleString();
    }

    function syncTicker(activeCount, capital, largest) {
        if (tickActive) tickActive.textContent = activeCount;
        if (tickLocked) tickLocked.textContent = fmtCurrency(capital);
        if (tickLargest) tickLargest.textContent = fmtCurrency(largest);
    }

    async function updateStats() {
        try {
            if (api && api.getRivalryStats) {
                const res = await api.getRivalryStats();
                if (res.ok && res.stats) {
                    const s = res.stats;
                    const activeCount = s.activeRivalries !== undefined ? s.activeRivalries : 0;
                    const capital = (s.totalCapitalLockedCents || 0) / 100;
                    const largest = (s.largestPoolCents || 0) / 100;

                    if (statActive) statActive.textContent = activeCount;
                    if (statCapital) statCapital.textContent = fmtCurrency(capital);
                    if (statLargest) statLargest.textContent = fmtCurrency(largest);
                    syncTicker(activeCount, capital, largest);
                    return;
                }
            }
        } catch { /* fallback to sample */ }

        // Fallback: local data stats
        const active = allRivalries.filter(r => r.status === 'active');
        const totalCapital = allRivalries.reduce((sum, r) => sum + (r.stake * 2), 0);
        const stakes = allRivalries.map(r => r.stake * 2);
        const largest = stakes.length > 0 ? Math.max(...stakes) : 0;

        if (statActive) statActive.textContent = active.length;
        if (statCapital) statCapital.textContent = fmtCurrency(totalCapital);
        if (statLargest) statLargest.textContent = fmtCurrency(largest);
        syncTicker(active.length, totalCapital, largest);
    }

    // ── Tabs ──
    const tabsContainer = document.getElementById('rv-tabs');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.rv-tab');
            if (!tab) return;
            tabsContainer.querySelectorAll('.rv-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            renderGrid();
        });
    }

    // ── Search ──
    const searchInput = document.getElementById('rv-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderGrid();
        });
    }

    // ── Challenge Modal ──
    const stakePills = document.getElementById('rv-stake-pills');
    const tierPills = document.getElementById('rv-tier-pills');
    const metricSelect = document.getElementById('rv-metric');
    const durationPills = document.getElementById('rv-duration-pills');
    let selectedStake = 100;
    let selectedTier = 'DUEL';
    let selectedTarget = 15;
    let selectedDuration = 14;

    function updatePreview() {
        const stake = selectedStake;
        const metric = metricSelect?.selectedOptions[0]?.text || 'Revenue Growth';

        const previewStake = document.getElementById('rv-preview-stake');
        const previewPool = document.getElementById('rv-preview-pool');
        const previewDuration = document.getElementById('rv-preview-duration');
        const previewMetric = document.getElementById('rv-preview-metric');

        if (previewStake) previewStake.textContent = '$' + stake.toLocaleString();
        if (previewPool) previewPool.textContent = '$' + (stake * 2).toLocaleString();
        if (previewDuration) previewDuration.textContent = selectedDuration + ' days';
        if (previewMetric) previewMetric.textContent = metric;
        const previewTarget = document.getElementById('rv-preview-target');
        if (previewTarget) previewTarget.textContent = '+' + selectedTarget + '%';
    }

    if (stakePills) {
        stakePills.addEventListener('click', (e) => {
            const pill = e.target.closest('.rv-stake-pill');
            if (!pill) return;
            stakePills.querySelectorAll('.rv-stake-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedStake = parseInt(pill.dataset.amount);
            updatePreview();
            // Toggle high-stakes styling
            const modal = document.querySelector('.rv-modal');
            if (modal) {
                if (selectedStake >= 5000) modal.classList.add('high-stakes');
                else modal.classList.remove('high-stakes');
            }
        });
    }
    if (metricSelect) metricSelect.addEventListener('change', updatePreview);

    if (tierPills) {
        tierPills.addEventListener('click', (e) => {
            const pill = e.target.closest('.rv-tier-pill');
            if (!pill) return;
            tierPills.querySelectorAll('.rv-tier-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedTier = pill.dataset.tier;
            selectedTarget = parseInt(pill.dataset.target);
            updatePreview();
        });
    }

    if (durationPills) {
        durationPills.addEventListener('click', (e) => {
            const pill = e.target.closest('.rv-dur-pill');
            if (!pill) return;
            durationPills.querySelectorAll('.rv-dur-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedDuration = parseInt(pill.dataset.days);
            updatePreview();
        });
    }

    // Submit challenge — calls real API
    const METRIC_MAP = {
        revenue_growth: { platform: 'STRIPE', metricType: 'REVENUE', metricKey: 'net_settled_amount' },
        follower_growth: { platform: 'X', metricType: 'FOLLOWERS', metricKey: 'followers' },
        subscriber_growth: { platform: 'YOUTUBE', metricType: 'SUBSCRIBERS', metricKey: 'subscribers' },
        views_growth: { platform: 'YOUTUBE', metricType: 'VIEWS', metricKey: 'views_30d' },
        sales_growth: { platform: 'SHOPIFY', metricType: 'GROSS_SALES', metricKey: 'gross_sales' },
        order_growth: { platform: 'AMAZON', metricType: 'ORDER_COUNT', metricKey: 'order_count' },
    };

    const submitBtn = document.getElementById('rv-btn-submit');

    // ── Challenge Type Toggle ──
    let challengeType = 'direct';
    const typeToggle = document.getElementById('rv-challenge-type');
    const opponentGroup = document.getElementById('rv-opponent-group');
    const typeHint = document.getElementById('rv-type-hint');
    if (typeToggle) {
        typeToggle.addEventListener('click', (e) => {
            const btn = e.target.closest('.rv-type-btn');
            if (!btn) return;
            challengeType = btn.dataset.type;
            typeToggle.querySelectorAll('.rv-type-btn').forEach(b => {
                if (b.dataset.type === challengeType) {
                    b.style.background = '#1a1a1a'; b.style.color = '#fff';
                } else {
                    b.style.background = '#fff'; b.style.color = '#666';
                }
            });
            if (opponentGroup) opponentGroup.style.display = challengeType === 'direct' ? '' : 'none';
            if (typeHint) typeHint.textContent = challengeType === 'direct' ? 'Send to a specific operator' : 'Anyone can accept this challenge';
            if (submitBtn) submitBtn.textContent = challengeType === 'direct' ? 'SEND CHALLENGE' : 'POST OPEN CHALLENGE';
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const opponent = document.getElementById('rv-opponent')?.value?.trim();
            const stake = selectedStake;

            if (challengeType === 'direct' && !opponent) {
                showAlert('Enter an opponent username', { type: 'warning', title: 'Missing Field' });
                return;
            }
            if (stake < 1) {
                showAlert('Select a stake amount', { type: 'warning', title: 'Invalid Stake' });
                return;
            }

            if (!window.appState?.isLoggedIn) {
                document.getElementById('rv-challenge-modal').classList.remove('open');
                window.app.openAccessModal();
                return;
            }

            const metricValue = metricSelect?.value || 'revenue_growth';
            const mapping = METRIC_MAP[metricValue] || METRIC_MAP.revenue_growth;

            submitBtn.disabled = true;
            submitBtn.textContent = 'SENDING...';

            try {
                const payload = {
                    platform: mapping.platform,
                    metricType: mapping.metricType,
                    metricKey: mapping.metricKey,
                    stakePerSideCents: stake * 100,
                    durationDays: selectedDuration,
                    rivalryTier: selectedTier,
                };
                if (challengeType === 'direct') {
                    payload.opponentUsername = opponent.replace('@', '');
                }
                // For open challenge, don't send opponentUsername

                const result = await api.createRivalry(payload);

                if (result.ok) {
                    document.getElementById('rv-challenge-modal').classList.remove('open');
                    if (challengeType === 'direct') {
                        showAlert(`Challenge issued to @${opponent.replace('@', '')}! They have 72 hours to accept.`, { type: 'success', title: 'Challenge Sent' });
                    } else {
                        showAlert('Open challenge posted! Any operator can accept it.', { type: 'success', title: 'Challenge Posted' });
                    }
                    // Refresh: re-fetch live data
                    try {
                        const res = await api.getRivalries({ limit: 50 });
                        if (res.ok && res.rivalries && res.rivalries.length > 0) {
                            allRivalries = res.rivalries.map(transformRivalry);
                        }
                    } catch { }
                    updateStats();
                    renderFeatured();
                    renderGrid();
                } else {
                    showAlert(result.error || 'Failed to create challenge', { type: 'error' });
                }
            } catch (err) {
                showAlert('Failed to send challenge: ' + (err.message || 'Unknown error'), { type: 'error' });
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = challengeType === 'direct' ? 'SEND CHALLENGE' : 'POST OPEN CHALLENGE';
            }
        });
    }

    // ── Issue Challenge button — auth guard ──
    const issueBtn = document.getElementById('rv-btn-issue');
    if (issueBtn) {
        issueBtn.addEventListener('click', () => {
            if (!window.appState?.isLoggedIn) {
                window.app.openAccessModal();
                return;
            }
            document.getElementById('rv-challenge-modal').classList.add('open');
        });
    }

    // ── Initial render ──
    updateStats();
    renderFeatured();
    renderGrid();
    updatePreview();

    // ── How It Works scroll-reveal ──
    if ('IntersectionObserver' in window) {
        const mechCards = document.querySelectorAll('.rv-mech-card');
        mechCards.forEach((card, i) => {
            card.classList.add('rv-reveal');
            card.style.transitionDelay = `${i * 150}ms`;
        });
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        mechCards.forEach(card => observer.observe(card));
    }
}
