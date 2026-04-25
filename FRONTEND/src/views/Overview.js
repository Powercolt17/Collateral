// Overview — Collateral Execution Queue
// ALL contracts are percentage growth from baseline
// Social (X) = Follower % growth, Sales/Commerce/Finance = Revenue % growth
// Tiers: PLEDGE (~30% win), STAKE (~20% win), ALL-IN (~10% win)
// HARD GATE: Minimum baseline required per tier — no starting from zero
// EVERY BUTTON IS LIVE — tabs, pills, CTAs, modal, search, sort

import { getMarketListings, hasAuthToken } from '../api.js';
import { openExecutionModal } from './ExecutionModal.js';

export function renderOverview() {
    return `
        <style>
            .eq {
                background: #fff;
                min-height: 100vh;
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
                padding-bottom: 100px;
            }

            /* --- TYPE SYSTEM --- */
            .eq-tag {
                display: flex;
                align-items: center;
                gap: 12px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #5C1414;
                margin-bottom: 24px;
            }
            .eq-tag::before {
                content: '';
                width: 32px;
                height: 1px;
                background: #5C1414;
            }

            /* --- HERO SECTION --- */
            .eq-hero {
                padding: 120px 32px 100px;
                max-width: 1300px;
                margin: 0 auto;
                position: relative;
            }
            .eq-hero-headline {
                font-size: 84px;
                font-weight: 500; /* Regular weight for main */
                color: #111;
                line-height: 0.95;
                letter-spacing: -3.5px;
                margin-bottom: 40px;
                max-width: 900px;
            }
            .eq-hero-headline strong {
                font-weight: 800;
                color: #5C1414;
            }
            .eq-hero-sub {
                font-size: 16px;
                color: #888;
                max-width: 480px;
                line-height: 1.6;
                margin-bottom: 40px;
                font-family: 'Sora', sans-serif;
            }
            .eq-hero-actions {
                display: flex;
                align-items: center;
                gap: 24px;
            }
            .eq-btn-primary {
                background: #5C1414;
                color: #fff;
                padding: 18px 32px;
                font-size: 14px;
                font-weight: 700;
                border: none;
                cursor: pointer;
                border-radius: 0;
                position: relative;
                overflow: hidden;
                transition: background 0.35s ease, transform 0.25s ease, box-shadow 0.3s ease, letter-spacing 0.35s ease;
            }
            .eq-btn-primary:hover {
                background: #6e1c1c;
                transform: translateY(-1px);
                box-shadow: 0 4px 16px rgba(59, 0, 1, 0.18);
                letter-spacing: 0.5px;
            }
            .eq-btn-primary:active {
                transform: translateY(0);
                box-shadow: none;
            }
            .eq-link-more {
                color: #888;
                font-size: 14px;
                text-decoration: none;
                font-weight: 500;
            }
            .eq-hero-scroll {
                position: absolute;
                right: 32px;
                bottom: 100px;
                writing-mode: vertical-rl;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #ccc;
                letter-spacing: 3px;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .eq-hero-scroll::after {
                content: '';
                width: 1px;
                height: 60px;
                background: #eee;
            }

            /* --- MECHANISM SECTION --- */
            .eq-mechanism {
                padding: 100px 0;
                border-top: 1px solid #f2f2f2;
                max-width: 1300px;
                margin: 0 auto;
            }
            .eq-mechanism-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-bottom: 80px;
                padding: 0 32px;
            }
            .eq-mechanism-title {
                font-size: 48px;
                font-weight: 500;
                letter-spacing: -2px;
                line-height: 1;
            }
            .eq-mechanism-title strong { font-weight: 800; }
            .eq-mechanism-side {
                max-width: 320px;
                font-size: 14px;
                color: #888;
                line-height: 1.6;
                text-align: right;
            }

            .eq-mechanism-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                border-top: 1px solid #f0f0f0;
                position: relative;
            }
            .eq-mech-card {
                padding: 60px 40px;
                border-right: 1px solid #f0f0f0;
                position: relative;
                overflow: hidden;
                transition: background 0.3s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
            }
            .eq-mech-card:hover {
                background: #fafafa;
                transform: translateY(-6px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
            }
            .eq-mech-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 3px;
                background: #5C1414;
                transition: width 0.4s ease;
            }
            .eq-mech-card:hover::before { width: 100%; }
            .eq-mech-card:last-child { border-right: none; }
            /* Step connector arrow */
            .eq-mech-card:not(:last-child)::after {
                content: '→';
                position: absolute;
                right: -8px; top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                color: #ccc;
                z-index: 2;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-mech-num {
                font-family: 'Sora', sans-serif;
                font-size: 80px;
                font-weight: 700;
                color: #e0e0e0;
                line-height: 0.8;
                margin-bottom: 40px;
                transition: color 0.3s;
            }
            .eq-mech-card:hover .eq-mech-num { color: rgba(59, 0, 1, 0.15); }
            .eq-mech-label {
                font-size: 22px;
                font-weight: 700;
                margin-bottom: 20px;
                color: #111;
            }
            .eq-mech-desc {
                font-size: 14px;
                color: #666;
                line-height: 1.7;
            }
            .eq-mechanism-sub {
                font-size: 15px; color: #888;
                line-height: 1.65; max-width: 520px;
                margin-top: 16px;
            }

            /* --- MARKET SECTION --- */
            .eq-market-header {
                padding: 100px 32px 40px;
                max-width: 1300px;
                margin: 0 auto;
            }
            .eq-market-title {
                font-size: 48px;
                font-weight: 500;
                letter-spacing: -2px;
                margin-bottom: 24px;
            }
            .eq-market-title strong { font-weight: 800; }
            .eq-market-live {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #aaa;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 48px;
            }
            .eq-market-dot {
                width: 6px; height: 6px;
                background: #10b981;
                border-radius: 50%;
                animation: dotPulse 2s ease-in-out infinite;
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
            }
            @keyframes dotPulse {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
                }
                50% {
                    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
                }
            }

            .eq-stats-strip {
                display: flex;
                gap: 80px;
                margin-bottom: 64px;
            }
            .eq-stat-group { display: flex; flex-direction: column; gap: 8px; }
            .eq-stat-val {
                font-size: 42px;
                font-weight: 500;
                letter-spacing: -1.5px;
                display: flex;
                transition: color 0.3s ease;
            }
            .eq-stat-group:hover .eq-stat-val {
                color: #5C1414;
            }
                align-items: baseline;
                gap: 4px;
            }
            .eq-stat-val small { font-size: 14px; color: #ccc; font-weight: 400; letter-spacing: 0; }
            .eq-stat-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #bbb;
            }

            /* --- CONTROLS --- */
            .eq-controls {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                padding-bottom: 2px;
                border-bottom: 1px solid #f2f2f2;
                margin-bottom: 24px;
            }
            .eq-tabs { display: flex; gap: 32px; }
            .eq-tab {
                padding: 12px 0;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                color: #bbb;
                background: none;
                border: none;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 1px;
                border-bottom: 2px solid transparent;
                transition: all 0.2s;
            }
            .eq-tab.active { color: #111; border-bottom-color: #111; }
            
            .eq-search-wrap {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
            }
            .eq-search-box {
                background: #fcfcfc;
                border: 1px solid #eee;
                padding: 10px 16px;
                font-size: 13px;
                width: 240px;
                font-family: 'Sora', sans-serif;
            }
            .eq-btn-rules {
                background: #fff;
                border: 1px solid #eee;
                padding: 10px 16px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                cursor: pointer;
                color: #666;
            }

            .eq-filter-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 48px;
            }
            .eq-pills { display: flex; align-items: center; gap: 8px; }
            .eq-filter-lbl { 
                font-family: 'JetBrains Mono', monospace; 
                font-size: 10px; 
                color: #ccc; 
                text-transform: uppercase; 
                margin-right: 12px; 
            }
            .eq-pill {
                padding: 6px 16px;
                font-size: 11px;
                font-weight: 500;
                border: 1px solid #eee;
                background: #fff;
                cursor: pointer;
                color: #888;
                transition: all 0.2s;
            }
            .eq-pill.active { background: #000; color: #fff; border-color: #000; }

            .eq-status-operational {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                text-transform: uppercase;
                color: #ccc;
            }
            .eq-status-operational .dot { width: 5px; height: 5px; background: #10b981; border-radius: 50%; }

            /* --- CARD GRID --- */
            .eq-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 24px;
            }
            .eq-card {
                background: #fff;
                padding: 36px 32px 32px;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                transition: background 0.2s, box-shadow 0.2s;
                position: relative;
                overflow: hidden;
                border: 1px solid #eee;
            }
            .eq-card:hover { background: #fafafa; }
            .eq-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 3px;
                background: #5C1414;
                transition: width 0.4s ease;
            }
            .eq-card:hover::before { width: 100%; }
            .eq-card-meta {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .eq-closing { color: #5C1414; font-weight: 700; }
            .eq-id { color: #ccc; }
            .eq-time { color: #ccc; display: flex; align-items: center; gap: 4px; }

            .eq-card-title {
                font-size: 18px;
                font-weight: 700;
                color: #111;
                margin: 12px 0 8px;
                letter-spacing: -0.5px;
            }
            .eq-card-provider {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
            }
            .eq-provider-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                color: #888;
            }
            .eq-tier-badge {
                padding: 3px 8px;
                font-size: 9px;
                font-weight: 700;
                border-radius: 2px;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.5px;
            }
            .eq-tier-badge.controlled { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
            .eq-tier-badge.elevated { background: #fff7ed; color: #9a3412; border: 1px solid #ffedd5; }
            .eq-tier-badge.maximum { background: #fff1f2; color: #9f1239; border: 1px solid #ffe4e6; }

            .eq-card-status {
                display: flex;
                align-items: center;
                gap: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #10b981;
                text-transform: uppercase;
                margin-bottom: 16px;
            }
            .eq-card-status .dot { width: 4px; height: 4px; border-radius: 50%; background: currentcolor; }

            .eq-card-stake-info {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
            }
            .eq-stake-val { font-size: 24px; font-weight: 500; letter-spacing: -1px; }
            .eq-stake-separator { width: 16px; height: 1px; background: #eee; }
            .eq-stake-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #ccc;
                text-transform: uppercase;
                margin-top: 4px;
            }

            .eq-card-cta {
                background: #0a0a0a;
                color: #fff;
                border: 1px solid transparent;
                padding: 16px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                width: 100%;
                cursor: pointer;
                margin-top: auto;
                position: relative;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                transform: translateY(0);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .eq-card-cta:hover {
                background: #5C1414;
                transform: translateY(-3px);
                box-shadow: 0 8px 30px rgba(92,20,20,0.35), 0 0 0 1px rgba(92,20,20,0.15);
                letter-spacing: 2.5px;
            }
            .eq-card-cta:active {
                transform: translateY(0px) scale(0.97);
                box-shadow: 0 2px 8px rgba(92,20,20,0.2);
                transition: all 0.08s ease;
            }
            .eq-card-cta::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -100%;
                width: 60%;
                height: 200%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                transform: skewX(-25deg);
                transition: left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .eq-card-cta:hover::after {
                left: 150%;
            }
            @keyframes executePulse {
                0%, 100% { box-shadow: 0 8px 30px rgba(92,20,20,0.35), 0 0 0 1px rgba(92,20,20,0.15); }
                50% { box-shadow: 0 8px 30px rgba(92,20,20,0.5), 0 0 0 2px rgba(92,20,20,0.25); }
            }
            .eq-card-cta:hover {
                animation: executePulse 2s ease-in-out infinite;
                animation-delay: 0.3s;
            }
            .eq-card-footer {
                font-size: 10px;
                color: #eee;
                text-align: center;
                margin-top: 12px;
                font-style: italic;
            }

            /* --- RULES MODAL --- */
            .eq-modal-backdrop {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.4);
                z-index: 1000;
                align-items: center;
                justify-content: center;
            }
            .eq-modal-backdrop.open { display: flex; }
            .eq-modal {
                background: #fff;
                width: 520px;
                max-width: 90vw;
                max-height: 85vh;
                overflow-y: auto;
                padding: 32px;
            }
            .eq-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }
            .eq-modal-title { font-size: 18px; font-weight: 700; color: #111; }
            .eq-modal-close { background: none; border: none; font-size: 18px; cursor: pointer; color: #888; padding: 4px 8px; }
            .eq-rule-divider {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #aaa;
                border-top: 1px solid #f2f2f2;
                padding-top: 16px;
                margin-top: 20px;
                margin-bottom: 12px;
                font-weight: 700;
            }
            .eq-rule-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 13px; color: #555; }
            .eq-rule-row input[type="checkbox"] { accent-color: #5C1414; }
            .eq-threshold-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
            .eq-threshold-table th { text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #aaa; padding: 8px 12px; border-bottom: 1px solid #f2f2f2; }
            .eq-threshold-table td { padding: 8px 12px; color: #555; border-bottom: 1px solid #f8f8f8; }
            .eq-threshold-table .tier-controlled { color: #166534; font-weight: 600; }
            .eq-threshold-table .tier-elevated { color: #9a3412; font-weight: 600; }
            .eq-threshold-table .tier-maximum { color: #9f1239; font-weight: 600; }
            .eq-threshold-table .tier-pledge { color: #166534; font-weight: 600; }
            .eq-threshold-table .tier-stake { color: #9a3412; font-weight: 600; }
            .eq-threshold-table .tier-all-in { color: #9f1239; font-weight: 600; }
            .eq-slider-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
            .eq-slider-label { font-size: 12px; color: #888; min-width: 80px; }
            .eq-slider { flex: 1; accent-color: #5C1414; }
            .eq-slider-value { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #111; font-weight: 600; min-width: 60px; text-align: right; }

            /* --- STAKE WARNING --- */
            .eq-stake-warning { max-width: 1300px; margin: 0 auto; padding: 24px 32px; border-top: 1px solid #f2f2f2; }
            .eq-stake-warning-text { font-size: 12px; color: #ccc; font-style: italic; }

            /* --- TWO PATHS (Solo vs Rivalry) --- */
            .eq-paths {
                max-width: 1300px; margin: 0 auto;
                padding: 80px 32px;
                border-top: 1px solid #f2f2f2;
            }
            .eq-paths-header {
                margin-bottom: 48px;
            }
            .eq-paths-sub {
                font-size: 15px; color: #888;
                line-height: 1.65; max-width: 560px;
                margin-top: 16px;
            }
            .eq-paths-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
            }
            .eq-path-card {
                border: 1px solid #e8e8e8;
                padding: 40px 36px;
                display: flex; flex-direction: column;
                transition: border-color 0.3s, box-shadow 0.3s;
            }
            .eq-path-card:hover { border-color: #ccc; box-shadow: 0 8px 32px rgba(0,0,0,0.04); }
            .eq-path-card.rivalry { border-color: rgba(59,0,1,0.15); }
            .eq-path-card.rivalry:hover { border-color: rgba(59,0,1,0.3); box-shadow: 0 8px 32px rgba(59,0,1,0.06); }
            .eq-path-icon { margin-bottom: 24px; }
            .eq-path-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700;
                letter-spacing: 0.12em; text-transform: uppercase;
                color: #111; margin-bottom: 12px;
            }
            .eq-path-tag.rivalry { color: #5C1414; }
            .eq-path-title {
                font-size: 28px; font-weight: 500;
                line-height: 1.1; letter-spacing: -1px;
                color: #111; margin-bottom: 16px;
            }
            .eq-path-title strong { font-weight: 800; }
            .eq-path-card.rivalry .eq-path-title strong { color: #5C1414; }
            .eq-path-desc {
                font-size: 14px; color: #888;
                line-height: 1.65; margin-bottom: 24px;
                flex-grow: 1;
            }
            .eq-path-details { margin-bottom: 28px; }
            .eq-path-detail {
                display: flex; align-items: center; gap: 10px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; color: #555;
                letter-spacing: 0.03em;
                padding: 6px 0;
            }
            .eq-path-check {
                font-size: 13px; font-weight: 700;
                color: #0F5132;
            }
            .eq-path-check.rivalry { color: #5C1414; }
            .eq-path-cta {
                display: inline-block;
                padding: 14px 24px;
                background: #111; color: #fff;
                border: none;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 700;
                letter-spacing: 0.08em; text-transform: uppercase;
                text-decoration: none; text-align: center;
                cursor: pointer;
                transition: background 0.2s, transform 0.2s;
                align-self: flex-start;
            }
            .eq-path-cta:hover { background: #333; transform: translateY(-2px); }
            .eq-path-cta.rivalry { background: #5C1414; }
            .eq-path-cta.rivalry:hover { background: #5a1718; transform: translateY(-2px); }

            /* ── Responsive: Tablet (≤1200px) ── */
            @media (max-width: 1200px) {
                .eq-grid { grid-template-columns: repeat(2, 1fr); }
                .eq-mechanism-grid { grid-template-columns: repeat(2, 1fr); }
                .eq-hero-headline { font-size: 64px; letter-spacing: -2.5px; }
                .eq-hero { padding: 80px 32px 60px; }
                .eq-mechanism { padding: 60px 0; }
                .eq-mechanism-header { flex-direction: column; align-items: flex-start; gap: 16px; }
                .eq-mechanism-side { text-align: left; max-width: 100%; }
                .eq-mech-card { padding: 40px 28px; }
                .eq-stats-strip { gap: 48px; }
                .eq-stat-val { font-size: 32px; }
                .eq-paths-grid { grid-template-columns: 1fr; gap: 20px; }
                .eq-paths { padding: 60px 32px; }
            }

            /* ── Responsive: Mobile (≤768px) ── */
            @media (max-width: 768px) {
                /* Hero */
                .eq-hero {
                    padding: 48px 20px 40px;
                    text-align: center;
                }
                .eq-hero-headline {
                    font-size: 48px !important;
                    letter-spacing: -1.5px !important;
                    margin-bottom: 24px;
                    max-width: 100%;
                }
                .eq-hero-sub {
                    font-size: 14px;
                    margin-bottom: 28px;
                    max-width: 100%;
                    margin-left: auto;
                    margin-right: auto;
                }
                .eq-hero-actions {
                    flex-direction: column;
                    gap: 16px;
                    align-items: center;
                }
                .eq-btn-primary {
                    padding: 16px 40px;
                    font-size: 13px;
                    text-align: center;
                    width: auto;
                }
                .eq-link-more {
                    text-align: center;
                }
                .eq-hero-scroll {
                    display: none;
                }
                .eq-tag {
                    display: none;
                }

                /* Mechanism */
                .eq-mechanism {
                    padding: 48px 0;
                }
                .eq-mechanism-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 40px;
                    padding: 0 20px;
                }
                .eq-mechanism-title {
                    font-size: 28px;
                    letter-spacing: -1px;
                }
                .eq-mechanism-side {
                    text-align: left;
                    max-width: 100%;
                    font-size: 13px;
                }
                .eq-mechanism-grid {
                    grid-template-columns: 1fr;
                }
                .eq-mech-card {
                    padding: 32px 20px;
                    border-right: none;
                    border-bottom: 1px solid #f0f0f0;
                }
                .eq-mech-card:last-child { border-bottom: none; }
                .eq-mech-num {
                    font-size: 48px;
                    margin-bottom: 20px;
                }
                .eq-mech-label {
                    font-size: 18px;
                    margin-bottom: 12px;
                }
                .eq-mech-desc {
                    font-size: 14px;
                }

                /* Market Header */
                .eq-market-header {
                    padding: 48px 20px 24px;
                }
                .eq-market-title {
                    font-size: 28px;
                    letter-spacing: -1px;
                    margin-bottom: 16px;
                }

                /* Stats — compact horizontal row on mobile */
                .eq-stats-strip {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0;
                    margin-bottom: 32px;
                    border: 1px solid #f0f0f0;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .eq-stat-group {
                    padding: 16px 12px;
                    text-align: center;
                    border-right: 1px solid #f0f0f0;
                }
                .eq-stat-group:last-child { border-right: none; }
                .eq-stat-val {
                    font-size: 20px;
                    letter-spacing: -0.5px;
                }
                .eq-stat-lbl {
                    font-size: 8px;
                    letter-spacing: 0.08em;
                }

                /* Controls — scrollable tabs */
                .eq-controls {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                }
                .eq-tabs {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    gap: 20px;
                    width: 100%;
                    padding-bottom: 2px;
                }
                .eq-tab {
                    white-space: nowrap;
                    font-size: 10px;
                }
                .eq-search-wrap {
                    width: 100%;
                }
                .eq-search-box {
                    flex: 1;
                    width: 100%;
                    min-width: 0;
                }

                /* Filters — scrollable pills */
                .eq-filter-bar {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .eq-pills {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    width: 100%;
                    padding-bottom: 4px;
                    flex-wrap: nowrap;
                }
                .eq-pill {
                    white-space: nowrap;
                    flex-shrink: 0;
                    font-size: 10px;
                    padding: 5px 12px;
                }

                /* Grid */
                .eq-grid {
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                .eq-grid-container {
                    padding: 0 20px !important;
                }
                .eq-card {
                    padding: 24px 20px 20px;
                }
                .eq-card-title {
                    font-size: 16px;
                }
                .eq-stake-val {
                    font-size: 20px;
                }
                .eq-card-cta {
                    padding: 14px;
                    font-size: 10px;
                }
                .eq-paths { padding: 48px 20px; }
                .eq-paths-grid { grid-template-columns: 1fr; gap: 16px; }
                .eq-path-card { padding: 28px 24px; }
                .eq-path-title { font-size: 24px; }
                .eq-path-desc { font-size: 13px; }

                /* Warning */
                .eq-stake-warning {
                    padding: 20px;
                }

                /* Modal */
                .eq-modal {
                    padding: 20px;
                    max-height: 90vh;
                }
                .eq-threshold-table th,
                .eq-threshold-table td {
                    padding: 6px 8px;
                    font-size: 11px;
                }
            }

            /* ── Responsive: Small phone (≤400px) ── */
            @media (max-width: 400px) {
                .eq-hero {
                    padding: 36px 16px 32px;
                }
                .eq-hero-headline {
                    font-size: 44px !important;
                    letter-spacing: -1.5px !important;
                }
                .eq-hero-sub {
                    font-size: 13px;
                }
                .eq-market-header {
                    padding: 36px 16px 20px;
                }
                .eq-market-title {
                    font-size: 24px;
                }
                .eq-mechanism-header {
                    padding: 0 16px;
                }
                .eq-mechanism-title {
                    font-size: 24px;
                }
                .eq-grid-container {
                    padding: 0 16px !important;
                }
                .eq-stat-val {
                    font-size: 24px;
                }
            }

            /* ── Hero Entrance Animations ── */
            @keyframes fadeSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes fadeSlideLeft {
                from {
                    opacity: 0;
                    transform: translateX(-24px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes headlineReveal {
                from {
                    opacity: 0;
                    transform: translateY(48px) scale(0.97);
                    filter: blur(4px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    filter: blur(0);
                }
            }
            @keyframes cardSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(36px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .anim-tag {
                opacity: 0;
                animation: fadeSlideLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
            }
            .anim-headline {
                opacity: 0;
                animation: headlineReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
            }
            .anim-sub {
                opacity: 0;
                animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards;
            }
            .anim-actions {
                opacity: 0;
                animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.75s forwards;
            }
            .anim-scroll-hint {
                opacity: 0;
                animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards;
            }

            /* ── Mechanism Section Animations ── */
            .anim-mech-tag {
                opacity: 0;
                animation: fadeSlideLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
                animation-play-state: paused;
            }
            .anim-mech-title {
                opacity: 0;
                animation: headlineReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
                animation-play-state: paused;
            }
            .anim-mech-card-1 {
                opacity: 0;
                animation: cardSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
                animation-play-state: paused;
            }
            .anim-mech-card-2 {
                opacity: 0;
                animation: cardSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.42s forwards;
                animation-play-state: paused;
            }
            .anim-mech-card-3 {
                opacity: 0;
                animation: cardSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.54s forwards;
                animation-play-state: paused;
            }
            .anim-mech-card-4 {
                opacity: 0;
                animation: cardSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.66s forwards;
                animation-play-state: paused;
            }

            /* When revealed by IntersectionObserver, play the animations */
            .revealed .anim-mech-tag,
            .revealed .anim-mech-title,
            .revealed .anim-mech-card-1,
            .revealed .anim-mech-card-2,
            .revealed .anim-mech-card-3,
            .revealed .anim-mech-card-4 {
                animation-play-state: running;
            }

            /* --- TIER SYSTEM SECTION --- */
            .eq-tiers {
                max-width: 1300px;
                margin: 0 auto;
                padding: 80px 32px;
                border-top: 1px solid #f2f2f2;
            }
            .eq-tiers-header {
                margin-bottom: 48px;
            }
            .eq-tiers-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            .eq-tier-card {
                border: 1px solid #e8e8e8;
                padding: 36px 32px;
                display: flex;
                flex-direction: column;
                transition: border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1);
                position: relative;
                overflow: hidden;
            }
            .eq-tier-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0;
                width: 0; height: 3px;
                transition: width 0.4s ease;
            }
            .eq-tier-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.05);
            }
            .eq-tier-card:hover::before { width: 100%; }
            .eq-tier-card.pledge::before { background: #166534; }
            .eq-tier-card.pledge:hover { border-color: #dcfce7; }
            .eq-tier-card.stake::before { background: #9a3412; }
            .eq-tier-card.stake:hover { border-color: #ffedd5; }
            .eq-tier-card.allin::before { background: #5C1414; }
            .eq-tier-card.allin:hover { border-color: #ffe4e6; }

            .eq-tier-card-badge {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                padding: 4px 10px;
                border-radius: 3px;
                display: inline-block;
                align-self: flex-start;
                margin-bottom: 24px;
            }
            .eq-tier-card-badge.pledge { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
            .eq-tier-card-badge.stake { background: #fff7ed; color: #9a3412; border: 1px solid #ffedd5; }
            .eq-tier-card-badge.allin { background: #fff1f2; color: #9f1239; border: 1px solid #ffe4e6; }

            .eq-tier-card-rate {
                font-size: 48px;
                font-weight: 500;
                letter-spacing: -2px;
                color: #111;
                line-height: 1;
            }
            .eq-tier-card-rate-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #bbb;
                margin-top: 6px;
            }
            .eq-tier-card-divider {
                width: 100%;
                height: 1px;
                background: #f0f0f0;
                margin: 24px 0;
            }
            .eq-tier-card-specs {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 20px;
            }
            .eq-tier-spec-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .eq-tier-spec-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #aaa;
            }
            .eq-tier-spec-value {
                font-size: 14px;
                font-weight: 600;
                color: #111;
                letter-spacing: -0.3px;
            }
            .eq-tier-card-note {
                font-size: 13px;
                color: #888;
                line-height: 1.5;
                margin-top: auto;
                font-style: italic;
            }
            .eq-tiers-footer {
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid #f0f0f0;
            }
            .eq-tiers-footer p {
                font-size: 13px;
                color: #999;
                line-height: 1.7;
                max-width: 720px;
            }
            .eq-tiers-footer strong { color: #555; }

            /* Tier section responsive: Tablet */
            @media (max-width: 1200px) {
                .eq-tiers-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
                .eq-tier-card { padding: 28px 24px; }
                .eq-tier-card-rate { font-size: 36px; }
            }
            /* Tier section responsive: Mobile */
            @media (max-width: 768px) {
                .eq-tiers { padding: 48px 20px; }
                .eq-tiers-grid { grid-template-columns: 1fr; gap: 16px; }
                .eq-tier-card { padding: 28px 24px; }
                .eq-tier-card-rate { font-size: 40px; }
            }
        </style>

        <div class="eq">
            <!-- Section 1: Hero -->
            <div class="eq-hero" data-reveal>
                <div class="eq-tag anim-tag">Performance Collateral Protocol</div>
                <h1 class="eq-hero-headline anim-headline">Put your money where your <strong>metrics</strong> are.</h1>
                <p class="eq-hero-sub anim-sub">Stake against revenue, sales, or growth targets. Automatic verification. Final settlement. No appeals.</p>
                <div class="eq-hero-actions anim-actions">
                    <button class="eq-btn-primary" onclick="document.getElementById('live-market').scrollIntoView({behavior:'smooth'})">Explore Market</button>
                    <a href="#" class="eq-link-more" onclick="document.getElementById('how-it-works').scrollIntoView({behavior:'smooth'}); return false;">Learn more →</a>
                </div>
                <div class="eq-hero-scroll anim-scroll-hint">Scroll</div>
            </div>

            <!-- Section 2: Two Contract Types -->
            <section class="eq-paths" id="how-it-works" data-reveal>
                <div class="eq-paths-header">
                    <div class="eq-tag anim-mech-tag">Contract Types</div>
                    <h2 class="eq-mechanism-title anim-mech-title">Two ways to <strong>compete.</strong></h2>
                    <p class="eq-paths-sub">Collateral offers two distinct contract primitives. Same verified metrics. Same locked capital. Same automatic settlement. Different opponents.</p>
                </div>
                <div class="eq-paths-grid">
                    <!-- Solo Contract -->
                    <div class="eq-path-card anim-mech-card-1">
                        <div class="eq-path-icon">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="16" r="14" stroke="#111" stroke-width="1.5" fill="none"/>
                                <path d="M16 10v12M12 14l4-4 4 4" stroke="#111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="eq-path-tag">Solo Contract</div>
                        <h3 class="eq-path-title">Back <strong>yourself.</strong></h3>
                        <p class="eq-path-desc">Stake capital against your own performance targets. Hit the metric — keep everything. Miss — the house takes a cut based on variance.</p>
                        <div class="eq-path-details">
                            <div class="eq-path-detail"><span class="eq-path-check">✓</span> Single operator</div>
                            <div class="eq-path-detail"><span class="eq-path-check">✓</span> Self-set threshold</div>
                            <div class="eq-path-detail"><span class="eq-path-check">✓</span> Pass / fail settlement</div>
                        </div>
                        <button class="eq-path-cta" onclick="document.getElementById('live-market').scrollIntoView({behavior:'smooth'})">Browse Solo Contracts →</button>
                    </div>
                    <!-- Rivalry Contract -->
                    <div class="eq-path-card rivalry anim-mech-card-2">
                        <div class="eq-path-icon">
                            <img src="/crossed-swords.png" alt="Crossed Swords" width="36" height="36" style="object-fit:contain;" />
                        </div>
                        <div class="eq-path-tag rivalry">Rivalry Contract</div>
                        <h3 class="eq-path-title">Challenge an <strong>opponent.</strong></h3>
                        <p class="eq-path-desc">Issue a head-to-head duel. Both operators lock matched capital. Verified growth determines the winner. Loser forfeits their stake.</p>
                        <div class="eq-path-details">
                            <div class="eq-path-detail"><span class="eq-path-check rivalry">✓</span> Two operators</div>
                            <div class="eq-path-detail"><span class="eq-path-check rivalry">✓</span> Matched capital</div>
                            <div class="eq-path-detail"><span class="eq-path-check rivalry">✓</span> Relative performance</div>
                        </div>
                        <a href="#/rivalry" class="eq-path-cta rivalry">Explore Rivalries →</a>
                    </div>
                </div>
            </section>

            <!-- Section 2.5: How It Works (shared mechanism) -->
            <section class="eq-mechanism" data-reveal>
                <div class="eq-mechanism-header">
                    <div class="eq-mechanism-side-left">
                        <div class="eq-tag anim-mech-tag">How it works</div>
                        <h2 class="eq-mechanism-title anim-mech-title">Four steps to <strong>settlement.</strong></h2>
                        <p class="eq-mechanism-sub">Every contract follows the same deterministic lifecycle. No human intervention. No exceptions.</p>
                    </div>
                </div>
                <div class="eq-mechanism-grid">
                    <div class="eq-mech-card anim-mech-card-1">
                        <div class="eq-mech-num">01</div>
                        <div class="eq-mech-label">Commit</div>
                        <div class="eq-mech-desc">Stake capital against specific, measurable performance targets. Define the metric, set the threshold, lock the funds.</div>
                    </div>
                    <div class="eq-mech-card anim-mech-card-2">
                        <div class="eq-mech-num">02</div>
                        <div class="eq-mech-label">Monitor</div>
                        <div class="eq-mech-desc">Metrics are tracked in real-time through verified data adapters connected to authoritative sources.</div>
                    </div>
                    <div class="eq-mech-card anim-mech-card-3">
                        <div class="eq-mech-num">03</div>
                        <div class="eq-mech-label">Verify</div>
                        <div class="eq-mech-desc">Automated oracle verification at the deadline. Deterministic. Transparent. No appeals process.</div>
                    </div>
                    <div class="eq-mech-card anim-mech-card-4">
                        <div class="eq-mech-num">04</div>
                        <div class="eq-mech-label">Settle</div>
                        <div class="eq-mech-desc">Variance is calculated against the target. Capital is released to The System or returned to the staker.</div>
                    </div>
                </div>
            </section>

            <!-- Section 2.75: Tier System -->
            <section class="eq-tiers" data-reveal>
                <div class="eq-tiers-header">
                    <div class="eq-tag anim-mech-tag">Risk Architecture</div>
                    <h2 class="eq-mechanism-title anim-mech-title">Three tiers. One <strong>protocol.</strong></h2>
                    <p class="eq-paths-sub">Every contract — Solo or Rivalry — is governed by the same tier system. Higher tiers demand harder targets, shorter windows, and bigger stakes. The difficulty is algorithmic, not arbitrary.</p>
                </div>

                <div class="eq-tiers-grid">
                    <!-- STANDARD -->
                    <div class="eq-tier-card pledge anim-mech-card-1">
                        <div class="eq-tier-card-badge pledge">PLEDGE</div>
                        <div class="eq-tier-card-rate">1.5x</div>
                        <div class="eq-tier-card-rate-label">peak multiplier</div>
                        <div class="eq-tier-card-divider"></div>
                        <div class="eq-tier-card-specs">
                            <div class="eq-tier-spec-row">
                                <span class="eq-tier-spec-label">Stake Range</span>
                                <span class="eq-tier-spec-value">$100 – $1,500</span>
                            </div>
                            <div class="eq-tier-spec-row">
                                <span class="eq-tier-spec-label">Duration</span>
                                <span class="eq-tier-spec-value">7 – 30 days</span>
                            </div>
                            <div class="eq-tier-spec-row">
                                <span class="eq-tier-spec-label">Growth Target</span>
                                <span class="eq-tier-spec-value">15% – 50%</span>
                            </div>
                        </div>
                        <div class="eq-tier-card-note">Achievable targets for proven operators. Start here.</div>
                    </div>

                    <!-- ADVANCED -->
                    <div class="eq-tier-card stake anim-mech-card-2">
                        <div class="eq-tier-card-badge stake">STAKE</div>
                        <div class="eq-tier-card-rate">2.5x</div>
                        <div class="eq-tier-card-rate-label">peak multiplier</div>
                        <div class="eq-tier-card-divider"></div>
                        <div class="eq-tier-card-specs">
                            <div class="eq-tier-spec-row">
                                <span class="eq-tier-spec-label">Stake Range</span>
                                <span class="eq-tier-spec-value">$250 – $3,000</span>
                            </div>
                            <div class="eq-tier-spec-row">
                                <span class="eq-tier-spec-label">Duration</span>
                                <span class="eq-tier-spec-value">7 – 21 days</span>
                            </div>
                            <div class="eq-tier-spec-row">
                                <span class="eq-tier-spec-label">Growth Target</span>
                                <span class="eq-tier-spec-value">35% – 100%</span>
                            </div>
                        </div>
                        <div class="eq-tier-card-note">Compressed timelines. Steeper scaling. Serious capital.</div>
                    </div>

                    <!-- ELITE -->
                    <div class="eq-tier-card allin anim-mech-card-3">
                        <div class="eq-tier-card-badge allin">ALL-IN</div>
                        <div class="eq-tier-card-rate">4x</div>
                        <div class="eq-tier-card-rate-label">peak multiplier</div>
                        <div class="eq-tier-card-divider"></div>
                        <div class="eq-tier-card-specs">
                            <div class="eq-tier-spec-row">
                                <span class="eq-tier-spec-label">Stake Range</span>
                                <span class="eq-tier-spec-value">$500 – $5,000</span>
                            </div>
                            <div class="eq-tier-spec-row">
                                <span class="eq-tier-spec-label">Duration</span>
                                <span class="eq-tier-spec-value">3 – 14 days</span>
                            </div>
                            <div class="eq-tier-spec-row">
                                <span class="eq-tier-spec-label">Growth Target</span>
                                <span class="eq-tier-spec-value">60% – 200%</span>
                            </div>
                        </div>
                        <div class="eq-tier-card-note">Maximum exposure. Exponential scaling. Built for conviction.</div>
                    </div>
                </div>

                <div class="eq-tiers-footer">
                    <p>Targets are calculated algorithmically based on your current baseline, metric type, and account size. Larger accounts face nonlinear scaling — no starting from zero. The same tier system governs both <strong>Solo</strong> and <strong>Rivalry</strong> contracts.</p>
                </div>
            </section>

            <!-- Section 3: Live Market Header -->
            <section class="eq-market-header" id="live-market" data-reveal>
                <div class="eq-tag">Live Contracts</div>
                <h2 class="eq-market-title">Active <strong>market.</strong></h2>
                <div class="eq-market-live">
                    <div class="eq-market-dot"></div>
                    Live — Updated <span id="last-updated">04:20:00 PM</span>
                </div>

                <div class="eq-stats-strip">
                    <div class="eq-stat-group">
                        <div class="eq-stat-val">$<span id="stat-capital">0</span></div>
                        <div class="eq-stat-lbl">Capital Locked</div>
                    </div>
                    <div class="eq-stat-group">
                        <div class="eq-stat-val" id="stat-contracts">0</div>
                        <div class="eq-stat-lbl">Active Contracts</div>
                    </div>
                    <div class="eq-stat-group">
                        <div class="eq-stat-val">$<span id="stat-pool">0</span></div>
                        <div class="eq-stat-lbl">Volume 24h</div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="eq-controls">
                    <div class="eq-tabs" id="eq-tabs">
                        <button class="eq-tab active" data-sort="trending_24h">TRENDING</button>
                        <button class="eq-tab" data-sort="new">NEW</button>
                        <button class="eq-tab" data-sort="closing_soon">CLOSING SOON</button>
                        <button class="eq-tab" data-sort="volume_24h">HIGH VOLUME</button>
                    </div>
                    <div class="eq-search-wrap">
                        <input type="text" class="eq-search-box" id="eq-search" placeholder="Search contracts...">
                        <button class="eq-btn-rules" id="btn-rules">Rules</button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="eq-filter-bar">
                    <div class="eq-pills" id="eq-filters">
                        <span class="eq-filter-lbl">Domain</span>
                        <button class="eq-pill active" data-category="all">All</button>
                        <button class="eq-pill" data-category="social">Social</button>
                        <button class="eq-pill" data-category="commerce">Commerce</button>
                        <button class="eq-pill" data-category="finance">Finance</button>
                    </div>
                    <div class="eq-status-operational">
                        System Status <div class="dot"></div> Operational
                    </div>
                </div>
            </section>

            <!-- Contract Grid -->
            <div class="eq-grid-container" style="padding: 0 32px; max-width: 1440px; margin: 0 auto;">
                <div style="font-family:'Inter'; font-size: 10px; color: #ccc; margin-bottom: 24px;" id="eq-count-lbl">12 contracts</div>
                <div class="eq-grid" id="eq-grid">
                    <!-- Dynamic cards go here -->
                </div>
                <div id="eq-empty" style="display:none; padding:60px; text-align:center; color:#ccc; font-size:14px; grid-column:1/-1;">No contracts match your filters.</div>
            </div>

            <!-- Stake Warning -->
            <div class="eq-stake-warning">
                <div class="eq-stake-warning-text">Capital is locked until settlement. Failed contracts forfeit capital.</div>
            </div>
        </div>
        </div>

        <!-- Rules Modal -->
        <div class="eq-modal-backdrop" id="rules-modal" onclick="if(event.target===this) this.classList.remove('open')">
            <div class="eq-modal">
                <div class="eq-modal-header">
                    <span class="eq-modal-title">Execution Rules</span>
                    <button class="eq-modal-close" onclick="document.getElementById('rules-modal').classList.remove('open')">✕</button>
                </div>

                <div class="eq-rule-divider">Enforcement</div>
                <div class="eq-rule-row"><input type="checkbox" checked disabled><span>Verified Only (Fail-Closed)</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked disabled><span>Immutable Terms</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked disabled><span>No Appeals</span></div>
                <div class="eq-rule-row"><input type="checkbox" id="rule-buyout"><span>Buyout Available</span></div>

                <div class="eq-rule-divider">Tier Filter</div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-controlled" data-tier="controlled"><span>PLEDGE — ~30% designed win rate</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-elevated" data-tier="elevated"><span>STAKE — ~20% designed win rate</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-maximum" data-tier="maximum"><span>ALL-IN — ~10% designed win rate</span></div>

                <div class="eq-rule-divider">Minimum Baseline Thresholds</div>
                <table class="eq-threshold-table">
                    <thead>
                        <tr>
                            <th>Tier</th>
                            <th>X Followers</th>
                            <th>Revenue</th>
                            <th>Win Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tier-controlled">PLEDGE</td>
                            <td>≥ 100</td>
                            <td>≥ $500/mo</td>
                            <td>~30%</td>
                        </tr>
                        <tr>
                            <td class="tier-elevated">STAKE</td>
                            <td>≥ 250</td>
                            <td>≥ $2,000/mo</td>
                            <td>~20%</td>
                        </tr>
                        <tr>
                            <td class="tier-maximum">ALL-IN</td>
                            <td>≥ 500</td>
                            <td>≥ $5,000/mo</td>
                            <td>~10%</td>
                        </tr>
                    </tbody>
                </table>

                <div class="eq-rule-divider">Stake Range</div>
                <div class="eq-slider-row">
                    <span class="eq-slider-label">Min Capital</span>
                    <input type="range" class="eq-slider" id="stake-slider" min="0" max="10000" value="0" step="100">
                    <span class="eq-slider-value" id="stake-slider-value">$0</span>
                </div>
            </div>
        </div>
    `;
}

export function initOverview() {
    // Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // State
    let activeSort = 'trending_24h';
    let activeCategory = 'all';
    let minStake = 0; // Controlled by rules modal
    let enabledTiers = { controlled: true, elevated: true, maximum: true };
    let pollInterval;
    let lastFeedData = null;
    let isFrozen = false; // When execution is open

    // DOM Elements
    const grid = document.getElementById('eq-grid');
    const emptyEl = document.getElementById('eq-empty');
    const updateChip = document.getElementById('update-chip');
    const updateCount = document.getElementById('update-count');
    const lastUpdatedEl = document.getElementById('last-updated');
    const statCapital = document.getElementById('stat-capital');
    const statContracts = document.getElementById('stat-contracts');
    const statPool = document.getElementById('stat-pool');
    const countLbl = document.getElementById('eq-count-lbl');

    // ===================================================================
    // FIRST-VISIT ONBOARDING OVERLAY
    // ===================================================================
    if (!localStorage.getItem('collateral_onboarded')) {
        const overlay = document.createElement('div');
        overlay.id = 'onboard-overlay';
        overlay.innerHTML = `
            <style>
                #onboard-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.7); z-index: 9999;
                    display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(4px); animation: obFadeIn 0.3s ease;
                }
                @keyframes obFadeIn { from { opacity: 0; } to { opacity: 1; } }
                .ob-card {
                    background: #fff; max-width: 520px; width: 90%; padding: 48px 40px;
                    position: relative;
                }
                .ob-close {
                    position: absolute; top: 16px; right: 16px; background: none; border: none;
                    font-size: 20px; color: #999; cursor: pointer; padding: 4px 8px;
                }
                .ob-close:hover { color: #111; }
                .ob-title {
                    font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 700;
                    color: #111; margin: 0 0 8px; letter-spacing: -0.3px;
                }
                .ob-subtitle {
                    font-size: 14px; color: #999; margin: 0 0 32px;
                }
                .ob-steps { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; }
                .ob-step {
                    display: flex; align-items: flex-start; gap: 16px;
                }
                .ob-step-num {
                    width: 32px; height: 32px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    background: #111; color: #fff; font-size: 13px; font-weight: 800;
                    font-family: 'Sora', sans-serif;
                }
                .ob-step-title { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 2px; }
                .ob-step-desc { font-size: 12px; color: #888; margin: 0; line-height: 1.5; }
                .ob-cta {
                    display: block; width: 100%; padding: 14px; background: #111; color: #fff;
                    font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
                    letter-spacing: 0.06em; text-transform: uppercase; text-align: center;
                    border: none; cursor: pointer; transition: background 150ms;
                }
                .ob-cta:hover { background: #000; }
                .ob-skip {
                    display: block; width: 100%; margin-top: 8px; padding: 10px;
                    background: none; border: none; color: #bbb; font-size: 11px;
                    cursor: pointer; text-align: center;
                }
                .ob-skip:hover { color: #666; }
            </style>
            <div class="ob-card">
                <button class="ob-close" id="ob-close">&times;</button>
                <div class="ob-title">Welcome to Collateral</div>
                <div class="ob-subtitle">Lock capital against measurable outcomes. Here's how it works:</div>
                <div class="ob-steps">
                    <div class="ob-step">
                        <div class="ob-step-num">1</div>
                        <div>
                            <div class="ob-step-title">Connect a Data Source</div>
                            <div class="ob-step-desc">Link your Stripe, Shopify, YouTube, or X account. We read metrics — never post or modify.</div>
                        </div>
                    </div>
                    <div class="ob-step">
                        <div class="ob-step-num">2</div>
                        <div>
                            <div class="ob-step-title">Pick a Contract</div>
                            <div class="ob-step-desc">Choose a growth target, stake amount, and duration. Higher risk = higher payout.</div>
                        </div>
                    </div>
                    <div class="ob-step">
                        <div class="ob-step-num">3</div>
                        <div>
                            <div class="ob-step-title">Lock Capital</div>
                            <div class="ob-step-desc">Your money is locked until the deadline. Hit the target and earn up to 4x. Miss it and the protocol keeps it.</div>
                        </div>
                    </div>
                </div>
                <button class="ob-cta" id="ob-start">Browse Contracts</button>
                <button class="ob-skip" id="ob-skip">I already know how this works</button>
            </div>
        `;
        document.body.appendChild(overlay);
        const dismiss = () => {
            localStorage.setItem('collateral_onboarded', '1');
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.2s ease';
            setTimeout(() => overlay.remove(), 200);
        };
        document.getElementById('ob-close')?.addEventListener('click', dismiss);
        document.getElementById('ob-start')?.addEventListener('click', dismiss);
        document.getElementById('ob-skip')?.addEventListener('click', dismiss);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) dismiss(); });
    }

    if (!grid) return;

    // Stats start at 0 until API data loads
    if (statCapital) statCapital.textContent = '0';
    if (statContracts) statContracts.textContent = '0';
    if (statPool) statPool.textContent = '0';

    // ===================================================================
    // DATA FETCHING & RENDERING
    // ===================================================================

    async function fetchFeed(isPoll = false) {
        if (isFrozen) return; // Don't update if user is executing

        try {
            const params = { sort: activeSort };
            if (activeCategory !== 'all') params.category = activeCategory;

            const data = await getMarketListings(params);

            if (isPoll) {
                // If data changed, auto-refresh the grid
                const contracts = Array.isArray(data?.listings) ? data.listings : [];
                const currentTopId = grid.querySelector('.eq-card')?.dataset.id;
                const newTopId = contracts[0]?.id;
                const hasChanges = currentTopId !== newTopId || contracts.length !== grid.querySelectorAll('.eq-card').length;

                if (hasChanges) {
                    lastFeedData = data;
                    renderGrid(contracts);
                    updateStats(data?.stats || {});
                    updateTime();
                }
            } else {
                const contracts = Array.isArray(data?.listings) ? data.listings : [];
                renderGrid(contracts);
                updateStats(data?.stats || {});
                lastFeedData = data;
                updateTime();
            }
        } catch (e) {
            console.error('[Market] Load failed:', e);
            if (!isPoll) grid.innerHTML = '<div class="eq-empty" style="display:block">Error loading market data</div>';
        }
    }

    function renderGrid(contracts) {
        // Clear grid
        grid.innerHTML = '';

        // Filter client-side for Rules (Tier/Stake)
        const visibleContracts = contracts.filter(c => {
            const tier = (c.tier || 'controlled').toLowerCase();
            const stake = c.min_stake || (c.costCents ? c.costCents / 100 : 0);
            if (!enabledTiers[tier]) return false;
            if (stake < minStake) return false;
            return true;
        });

        // Update count label
        if (countLbl) countLbl.textContent = `${visibleContracts.length} contract${visibleContracts.length !== 1 ? 's' : ''}`;

        if (visibleContracts.length === 0) {
            grid.innerHTML = '<div style="padding:60px; text-align:center; color:#ccc; font-size:14px; grid-column:1/-1; background:#fff;">No contracts match your filters.</div>';
            return;
        }

        visibleContracts.forEach(contract => {
            const el = document.createElement('div');
            el.innerHTML = renderCard(contract);
            const card = el.firstElementChild;
            grid.appendChild(card);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function renderCard(c) {
        // map API data to UI
        const rawId = (c.id || '').toString();
        const shortId = rawId.split('-')[0] || rawId || '????';

        const tier = (c.tier || 'controlled').toLowerCase();
        // Use min_stake/max_stake from new API
        const min = c.min_stake || 0;
        const max = c.max_stake || 0;
        const fee = c.fee_bps ? (c.fee_bps / 100) : 2; // default 2%

        const stakeDisplay = (min === max)
            ? `$${min.toLocaleString()}`
            : `$${min.toLocaleString()} – $${max.toLocaleString()}`;

        const deadline = new Date(c.open_until || Date.now() + 86400000);
        const now = new Date();
        const timeLeftMs = deadline - now;
        const daysLeft = Math.ceil(timeLeftMs / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.ceil(timeLeftMs / (1000 * 60 * 60));

        let timeLabel = `${daysLeft}d left`;
        if (daysLeft <= 1) timeLabel = `${hoursLeft}h left`;
        if (timeLeftMs < 0) timeLabel = 'Ended';

        const platform = (c.provider || 'X').toString();
        const goal = c.title || 'Contract Goal';

        // Integration Icon
        let dotClass = 'x';
        if (platform === 'stripe') dotClass = 'stripe';
        if (platform === 'shopify') dotClass = 'shopify';
        if (platform === 'amazon') dotClass = 'amazon';

        const tierUpper = tier.toUpperCase();
        const multiplier = c.multiplier || (tierUpper === 'MAXIMUM' ? 4.0 : tierUpper === 'ELEVATED' ? 2.5 : 1.7);

        // Scarcity or urgent closing
        let isClosingSoon = timeLeftMs < 1000 * 60 * 60 * 24;
        let closingAmtText = isClosingSoon ? "CLOSING SOON" : `OPEN MARKET`;

        return `
            <div class="eq-card"
                 data-id="${c.id}" 
                 data-status="active" 
                 data-domain="${c.domain || 'social'}"
                 data-tier="${tier}" 
                 data-stake-min="${min}"
                 data-stake-max="${max}"
                 data-fee="${fee}"
                 data-deadline="${c.fundingCloseAt}"
                 data-goal="${goal}"
                 data-provider="${platform}">
                <div class="eq-card-meta">
                    <span class="eq-closing">${closingAmtText}</span>
                    <span class="eq-id">RCPT-${shortId.slice(0, 4).toUpperCase()}</span>
                    <span class="eq-time">○ ${timeLabel}</span>
                </div>
                <div class="eq-card-title">${goal}</div>
                <div class="eq-card-provider">
                    <span class="dot ${dotClass}" style="width: 6px; height: 6px; border-radius: 50%; background: ${dotClass === 'stripe' ? '#635bff' : dotClass === 'shopify' ? '#96bf48' : dotClass === 'amazon' ? '#ff9900' : '#111'}"></span>
                    <span class="eq-provider-name">${platform.toUpperCase()}</span>
                    <span class="eq-tier-badge ${tier}">${{controlled:'PLEDGE',elevated:'STAKE',maximum:'ALL-IN'}[tier] || tier.toUpperCase()}</span>
                </div>
                <div class="eq-card-status"><span class="dot" style="width:4px; height:4px; border-radius:50%; background:#10b981; display:inline-block; margin-right:4px;"></span> TERMS VERIFIED</div>
                <div class="eq-card-stake-info">
                    <div>
                        <div class="eq-stake-val">${stakeDisplay}</div>
                        <div class="eq-stake-lbl">STAKE CAPACITY</div>
                    </div>
                    <div class="eq-stake-separator"></div>
                    <div>
                        <div class="eq-stake-val">${multiplier}x</div>
                        <div class="eq-stake-lbl">YIELD MULTIPLIER</div>
                    </div>
                </div>
                <button class="eq-card-cta primary eq-lock-btn">EXECUTE CONTRACT</button>
                <div class="eq-card-footer">Capital is locked until settlement.</div>
            </div>
        `;
    }

    function updateStats(stats) {
        if (!stats) return;

        // Capital locked
        if (statCapital) {
            const tvl = Number(stats.tvlUsd) || 0;
            if (tvl >= 1_000_000) {
                statCapital.textContent = (tvl / 1_000_000).toFixed(1) + 'M';
            } else if (tvl >= 1_000) {
                statCapital.textContent = (tvl / 1_000).toFixed(0) + 'k';
            } else if (tvl > 0) {
                statCapital.textContent = tvl.toLocaleString();
            }
        }

        // Active contracts
        if (statContracts) {
            statContracts.textContent = stats.activeCount || '0';
        }

        // Volume 24h
        if (statPool) {
            const vol = Number(stats.volume24hUsd) || 0;
            if (vol >= 1_000_000) {
                statPool.textContent = (vol / 1_000_000).toFixed(1) + 'M';
            } else if (vol >= 1_000) {
                statPool.textContent = (vol / 1_000).toFixed(0) + 'k';
            } else if (vol > 0) {
                statPool.textContent = vol.toLocaleString();
            }
        }

        // If TVL and Volume are both 0, supplement from public ledger
        const tvl = Number(stats.tvlUsd) || 0;
        const vol = Number(stats.volume24hUsd) || 0;
        if (tvl === 0 && vol === 0) {
            supplementFromLedger();
        }
    }

    async function supplementFromLedger() {
        try {
            const res = await fetch('/v1/ledger');
            if (!res.ok) return;
            const events = await res.json();
            if (!Array.isArray(events) || events.length === 0) return;

            let totalCents = 0;
            let vol24hCents = 0;
            const now24h = Date.now() - 86400000;

            events.forEach(e => {
                if (e.eventType === 'FUNDS_LOCKED' || e.eventType === 'EXECUTION_CONFIRMED' ||
                    e.eventType === 'RIVALRY_CREATED' || e.eventType === 'RIVALRY_ACCEPTED') {
                    const amt = Math.abs(e.amountUsdCents || e.lockAmountUsdCents || 0);
                    totalCents += amt;
                    if (new Date(e.timestampUtc).getTime() > now24h) {
                        vol24hCents += amt;
                    }
                }
            });

            if (statCapital && totalCents > 0) {
                const dollars = totalCents / 100;
                statCapital.textContent = dollars >= 1000
                    ? (dollars / 1000).toFixed(0) + 'k'
                    : dollars.toLocaleString();
            }
            if (statPool && vol24hCents > 0) {
                const dollars = vol24hCents / 100;
                statPool.textContent = dollars >= 1000
                    ? (dollars / 1000).toFixed(0) + 'k'
                    : dollars.toLocaleString();
            }
        } catch (_) { /* silent */ }
    }

    function updateTime() {
        const now = new Date();
        lastUpdatedEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    // ===================================================================
    // LISTENERS
    // ===================================================================

    // Tabs
    const tabsContainer = document.getElementById('eq-tabs');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.eq-tab');
            if (!tab) return;
            tabsContainer.querySelectorAll('.eq-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeSort = tab.dataset.sort;
            fetchFeed(false);
        });
    }

    // Filters (Domain)
    const filtersContainer = document.getElementById('eq-filters');
    if (filtersContainer) {
        filtersContainer.addEventListener('click', (e) => {
            const pill = e.target.closest('.eq-pill');
            if (!pill) return;
            filtersContainer.querySelectorAll('.eq-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeCategory = pill.dataset.category;
            fetchFeed(false);
        });
    }

    // Update Chip
    if (updateChip) {
        updateChip.addEventListener('click', () => {
            if (lastFeedData) {
                const contracts = Array.isArray(lastFeedData?.listings) ? lastFeedData.listings : [];
                renderGrid(contracts);
                updateStats(lastFeedData.stats);
                updateTime();
            }
            updateChip.classList.remove('visible');
        });
    }

    // Initial Load
    fetchFeed(false);

    // Polling
    pollInterval = setInterval(() => fetchFeed(true), 15000);

    // ===================================================================
    // UNIFIED EXECUTION — Card click + Lock button → same modal
    // ===================================================================

    function extractContractData(cardEl) {
        const id = cardEl.dataset.id;
        const tier = (cardEl.dataset.tier || 'controlled').toLowerCase();
        const minStake = parseFloat(cardEl.dataset.stakeMin || '0');
        const maxStake = parseFloat(cardEl.dataset.stakeMax || '0');
        const feeBps = parseFloat(cardEl.dataset.fee || '2') * 100;
        const goal = cardEl.dataset.goal || '';
        const deadline = cardEl.dataset.deadline || '';

        const provider = (cardEl.dataset.provider || 'x').toLowerCase();

        const tierUpper = tier.toUpperCase();
        const multiplier = tierUpper === 'MAXIMUM' ? 4.0 : tierUpper === 'ELEVATED' ? 2.5 : 1.7;

        return {
            id,
            title: goal,
            goal,
            tier,
            provider,
            platform: provider,
            min_stake: minStake > 0 ? minStake : 25,
            max_stake: maxStake,
            multiplier,
            fee_bps: feeBps,
            window_days: 30,
            target_hint: goal,
            deadline
        };
    }

    grid.addEventListener('click', (e) => {
        // 1. Lock button — stop propagation, open modal
        const btn = e.target.closest('.eq-lock-btn');
        if (btn) {
            e.stopPropagation();
            e.preventDefault();
            const card = btn.closest('.eq-card');
            if (card) openExecutionModal(extractContractData(card));
            return;
        }

        // 2. Card click — navigate to contract term sheet
        const card = e.target.closest('.eq-card');
        if (card) {
            if (e.target.closest('button') || e.target.closest('input')) return;
            e.preventDefault();
            e.stopPropagation();
            const id = card.dataset.id;
            if (id) window.router.navigate('/contract/' + id);
        }
    });

    // Wire up Rule Modal Logic (preserved)
    const rulesBtn = document.getElementById('btn-rules');
    const rulesModal = document.getElementById('rules-modal');
    if (rulesBtn && rulesModal) {
        rulesBtn.addEventListener('click', () => rulesModal.classList.add('open'));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && rulesModal.classList.contains('open')) rulesModal.classList.remove('open');
        });

        // Rules filters
        document.getElementById('tier-controlled')?.addEventListener('change', (e) => { enabledTiers.controlled = e.target.checked; fetchFeed(false); });
        document.getElementById('tier-elevated')?.addEventListener('change', (e) => { enabledTiers.elevated = e.target.checked; fetchFeed(false); });
        document.getElementById('tier-maximum')?.addEventListener('change', (e) => { enabledTiers.maximum = e.target.checked; fetchFeed(false); });

        const stakeSlider = document.getElementById('stake-slider');
        const stakeVal = document.getElementById('stake-slider-value');
        if (stakeSlider && stakeVal) {
            stakeSlider.addEventListener('input', (e) => {
                minStake = parseInt(e.target.value);
                stakeVal.textContent = `$${minStake.toLocaleString()}`;
                fetchFeed(false);
            });
        }
    }
}
