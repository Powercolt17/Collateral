// Overview.js — Collateral Execution Queue (Market View)
// Homepage Token System & Institutional Design System Alignment

import api, { getMarketListings, hasAuthToken } from '../api.js';
import { openExecutionModal } from './ExecutionModal.js';

export function renderOverview() {
    return `
        <style>
            /* ══════════════════════════════════════════════════════════════
               ROOT DESIGN TOKEN BLOCK (HOMEPAGE PARITY)
               ══════════════════════════════════════════════════════════════ */
            :root {
              --paper: #F7F4ED;
              --paper-alt: #EFEAE0;
              --paper-deep: #E7E1D4;
              --plate: #FFFDF9;
              --notch: #F7F4ED;
              --ink: #0E1420;
              --ink-2: #4A5464;
              --ink-3: #6E7686;
              --ink-4: #9AA0AC;
              --blood: #7A1C29;
              --blood-deep: #54111B;
              --blood-mid: #9B3341;
              --blood-tint: #F5E6E8;
              --blood-wash: #FBF3F4;
              --win: #186B4A;
              --win-tint: #E6F1EA;
              --win-wash: #F2F8F4;
              --gilt: #A8854E;
              --rule: #DCD5C6;
              --rule-soft: #EAE4D8;
              --rule-strong: #BDB3A0;
              --display: "Archivo", system-ui, sans-serif;
              --wordmark: "Archivo", system-ui, sans-serif;
              --body: "Public Sans", system-ui, sans-serif;
              --mono: "IBM Plex Mono", ui-monospace, monospace;
              --r: 2px;
              --lift: 0 1px 2px rgba(14,20,32,.04), 0 12px 28px -18px rgba(14,20,32,.22);
            }

            .eq {
                background: var(--paper, #F7F4ED);
                min-height: 100vh;
                font-family: var(--body, 'Public Sans', sans-serif);
                color: var(--ink, #0E1420);
                padding-bottom: 100px;
                position: relative;
            }

            /* Fixed Grain Overlay */
            .cl-grain {
                position: fixed;
                inset: 0;
                pointer-events: none;
                z-index: 9999;
                opacity: .035;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            }

            /* Clerical Mono Label Utility */
            .mono-lbl {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                letter-spacing: .16em;
                text-transform: uppercase;
                color: var(--ink-3, #6E7686);
            }

            /* --- HERO SECTION --- */
            .eq-hero {
                padding: 100px 32px 50px;
                max-width: 1300px;
                margin: 0 auto;
                position: relative;
            }
            .eq-hero-headline {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 64px;
                font-weight: 700;
                color: var(--ink, #0E1420);
                line-height: 1.02;
                letter-spacing: -.026em;
                margin-bottom: 20px;
                max-width: 900px;
            }
            .eq-hero-headline strong {
                font-weight: 800;
                color: var(--blood, #7A1C29);
            }
            .eq-hero-sub {
                font-size: 15px;
                color: var(--ink-2, #4A5464);
                max-width: 520px;
                line-height: 1.6;
                margin-bottom: 28px;
            }
            .eq-hero-actions {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            /* Oxblood Buttons — #7A1C29 background, #FFF8F5 text, #54111B hover */
            .eq .eq-btn-primary,
            .eq button.eq-btn-primary,
            .eq button[class*="-cta"] {
                background: #7A1C29 !important;
                color: #FFF8F5 !important;
                padding: 14px 28px;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                font-weight: 700;
                letter-spacing: .16em;
                text-transform: uppercase;
                border: 1px solid #7A1C29 !important;
                cursor: pointer;
                border-radius: var(--r, 2px);
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(122, 28, 41, 0.2);
            }
            .eq .eq-btn-primary:hover,
            .eq button.eq-btn-primary:hover,
            .eq button[class*="-cta"]:hover {
                background: #54111B !important;
                border-color: #54111B !important;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(84, 17, 27, 0.3);
            }
            .eq-link-more {
                color: var(--ink-3, #6E7686);
                font-size: 14px;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.15s ease;
            }
            .eq-link-more:hover { color: var(--ink, #0E1420); }

            /* --- MARKET SECTION HEADER & RECONCILED STATS --- */
            .eq-market-header {
                padding: 40px 32px 24px;
                max-width: 1300px;
                margin: 0 auto;
            }
            .eq-market-title {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 36px;
                font-weight: 700;
                letter-spacing: -.026em;
                color: var(--ink, #0E1420);
                margin-bottom: 12px;
            }
            .eq-market-title strong { font-weight: 800; color: var(--blood, #7A1C29); }
            .eq-market-live {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                color: var(--ink-3, #6E7686);
                text-transform: uppercase;
                letter-spacing: .16em;
                margin-bottom: 32px;
            }
            .eq-market-dot {
                width: 6px; height: 6px;
                background: var(--win, #186B4A);
                border-radius: 50%;
                animation: dotPulse 2s ease-in-out infinite;
            }
            @keyframes dotPulse {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }

            /* Reconciled Statistic Strip */
            .eq-stats-strip {
                display: flex;
                gap: 64px;
                margin-bottom: 40px;
                padding: 20px 32px;
                background: var(--plate, #FFFDF9);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                box-shadow: var(--lift);
            }
            .eq-stat-group { display: flex; flex-direction: column; gap: 6px; }
            .eq-stat-val {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 30px;
                font-weight: 700;
                letter-spacing: -.026em;
                color: var(--ink, #0E1420);
                font-variant-numeric: tabular-nums;
            }
            .eq-stat-lbl {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                text-transform: uppercase;
                letter-spacing: .16em;
                color: var(--ink-3, #6E7686);
            }

            /* --- CONTROLS & TABS --- */
            .eq-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 14px;
                border-bottom: 1px solid var(--rule, #DCD5C6);
                margin-bottom: 24px;
            }
            .eq-tabs { display: flex; gap: 24px; }
            .eq-tab {
                padding: 8px 0;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                font-weight: 700;
                color: var(--ink-3, #6E7686);
                background: none;
                border: none;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: .16em;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }
            .eq-tab.active {
                color: var(--ink, #0E1420) !important;
                border-bottom-color: var(--blood, #7A1C29) !important;
            }
            .eq-tab:hover { color: var(--ink, #0E1420); }

            .eq-search-wrap {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .eq-search-box {
                background: var(--plate, #FFFDF9);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                padding: 10px 16px;
                font-size: 13px;
                width: 320px;
                max-width: 100%;
                font-family: var(--body, 'Public Sans', sans-serif);
                color: var(--ink, #0E1420);
                transition: border-color 0.2s ease;
            }
            .eq-search-box:focus {
                outline: none;
                border-color: var(--ink, #0E1420);
            }
            .eq-btn-rules {
                background: var(--plate, #FFFDF9);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                padding: 10px 18px;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: .16em;
                cursor: pointer;
                color: var(--ink-2, #4A5464);
                transition: all 0.2s ease;
            }
            .eq-btn-rules:hover {
                border-color: var(--ink, #0E1420);
                color: var(--ink, #0E1420);
            }

            /* --- DOMAIN FILTER BAR --- */
            .eq-filter-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 28px;
            }
            .eq-pills { display: flex; align-items: center; gap: 8px; }
            .eq-filter-lbl {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                color: var(--ink-3, #6E7686);
                text-transform: uppercase;
                letter-spacing: .16em;
                margin-right: 12px;
            }
            .eq-pill {
                padding: 6px 16px;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                font-weight: 600;
                letter-spacing: .12em;
                text-transform: uppercase;
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                background: var(--plate, #FFFDF9);
                cursor: pointer;
                color: var(--ink-2, #4A5464);
                transition: all 0.2s ease;
            }
            /* Active "ALL" pill set to #0E1420, NOT black */
            .eq-pill.active {
                background: #0E1420 !important;
                color: #FFFDF9 !important;
                border-color: #0E1420 !important;
            }
            .eq-pill:hover:not(.active) {
                border-color: var(--ink-3, #6E7686);
                color: var(--ink, #0E1420);
            }

            .eq-status-operational {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: .16em;
                color: var(--ink-3, #6E7686);
            }
            .eq-status-operational .dot { width: 5px; height: 5px; background: var(--win, #186B4A); border-radius: 50%; }

            /* --- UNIVERSAL GRID BANNER --- */
            .eq-grid-banner {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 12px 24px;
                background: rgba(226, 219, 208, 0.35);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                margin-bottom: 28px;
                text-align: center;
            }
            .eq-grid-banner .mono {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                letter-spacing: .16em;
                text-transform: uppercase;
                color: var(--ink-2, #4A5464);
            }

            /* --- CARD GRID & PLATES --- */
            .eq-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 24px;
            }
            .eq-card {
                background: var(--plate, #FFFDF9);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                box-shadow: var(--lift);
                padding: 24px;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
                position: relative;
                overflow: hidden;
            }
            .eq-card:hover {
                transform: translateY(-2px);
                border-color: var(--blood, #7A1C29);
                box-shadow: 0 4px 16px rgba(14, 20, 32, 0.08);
            }

            /* Item 2: Restructured 2-line Card Header to eliminate text wrapping & ragged card heights */
            .eq-card-header-line1 {
                display: flex;
                justify-content: flex-start;
                margin-bottom: 8px;
            }
            .eq-card-header-line2 {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 16px;
            }

            .eq-card-title {
                font-family: var(--display, 'Archivo', sans-serif);
                font-weight: 700;
                letter-spacing: -.026em;
                color: var(--ink, #0E1420);
                font-size: 18px;
                margin: 0 0 12px;
                line-height: 1.25;
            }
            .eq-card-provider {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
            }

            /* Item 4: Monochromatic platform dots (--ink-3 / #6E7686) */
            .eq-platform-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--ink-3, #6E7686);
            }

            .eq-tier-badge {
                padding: 3px 8px;
                font-size: 9.5px;
                font-weight: 700;
                border-radius: 2px;
                text-transform: uppercase;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                letter-spacing: .12em;
            }
            .eq-tier-badge.controlled { background: rgba(24, 107, 74, 0.08); color: #186B4A; border: 1px solid rgba(24, 107, 74, 0.2); }
            .eq-tier-badge.elevated { background: rgba(154, 52, 18, 0.08); color: #9A3412; border: 1px solid rgba(154, 52, 18, 0.2); }
            .eq-tier-badge.maximum { background: rgba(122, 28, 41, 0.08); color: #7A1C29; border: 1px solid rgba(122, 28, 41, 0.2); }

            .eq-card-divider {
                border-bottom: 1px dotted var(--rule, #DCD5C6);
                margin: 16px 0;
            }

            .eq-card-stake-info {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .eq-stake-val {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 20px;
                font-weight: 700;
                letter-spacing: -.02em;
                color: var(--ink, #0E1420);
                font-variant-numeric: tabular-nums;
            }
            .eq-stake-separator {
                width: 1px;
                height: 28px;
                background: var(--rule, #DCD5C6);
            }

            /* Item 1: Card CTA Button — Oxblood #7A1C29, text #FFF8F5, hover #54111B */
            .eq-card-cta {
                background: #7A1C29 !important;
                color: #FFF8F5 !important;
                border: 1px solid #7A1C29 !important;
                padding: 14px 20px;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: .16em;
                width: 100%;
                cursor: pointer;
                border-radius: var(--r, 2px);
                margin-top: auto;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(122, 28, 41, 0.2);
            }
            .eq-card-cta:hover {
                background: #54111B !important;
                border-color: #54111B !important;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(84, 17, 27, 0.3);
            }

            /* --- TWO PATHS SECTION --- */
            .eq-paths {
                max-width: 1300px; margin: 0 auto;
                padding: 60px 32px;
                border-top: 1px solid var(--rule, #DCD5C6);
            }
            .eq-paths-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
            }
            .eq-path-card {
                background: var(--plate, #FFFDF9);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                padding: 36px 32px;
                box-shadow: var(--lift);
                display: flex; flex-direction: column;
            }
            .eq-path-title {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 22px; font-weight: 700;
                line-height: 1.2; letter-spacing: -.026em;
                color: var(--ink, #0E1420); margin-bottom: 16px;
            }
            .eq-path-title strong { color: var(--blood, #7A1C29); }
            .eq-path-desc {
                font-size: 14px; color: var(--ink-2, #4A5464);
                line-height: 1.6; margin-bottom: 24px; flex-grow: 1;
            }

            /* Item 1: Browse Solo Contracts & Explore Rivalries both Oxblood #7A1C29 */
            .eq-path-cta {
                display: inline-block;
                padding: 14px 24px;
                background: #7A1C29 !important;
                color: #FFF8F5 !important;
                border: 1px solid #7A1C29 !important;
                border-radius: var(--r, 2px);
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px; font-weight: 700;
                letter-spacing: .16em; text-transform: uppercase;
                text-decoration: none; text-align: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .eq-path-cta:hover {
                background: #54111B !important;
                border-color: #54111B !important;
                transform: translateY(-1px);
            }

            /* --- MECHANISM SECTION --- */
            .eq-mechanism {
                max-width: 1300px; margin: 0 auto;
                padding: 60px 32px;
                border-top: 1px solid var(--rule, #DCD5C6);
            }
            .eq-mechanism-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
            }
            .eq-mech-card {
                padding: 36px 24px;
                background: var(--plate, #FFFDF9);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
            }
            .eq-mech-num {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 40px; font-weight: 700;
                color: var(--ink-4, #9AA0AC);
                line-height: 1; margin-bottom: 16px;
            }
            .eq-mech-label {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 18px; font-weight: 700;
                margin-bottom: 10px; color: var(--ink, #0E1420);
            }
            .eq-mech-desc {
                font-size: 13.5px; color: var(--ink-2, #4A5464); line-height: 1.6;
            }

            /* --- RULES MODAL --- */
            .eq-modal-backdrop {
                display: none; position: fixed; inset: 0;
                background: rgba(14, 20, 32, 0.4); z-index: 1000;
                align-items: center; justify-content: center;
            }
            .eq-modal-backdrop.open { display: flex; }
            .eq-modal {
                background: var(--paper, #F7F4ED);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                width: 540px; max-width: 90vw; max-height: 85vh;
                overflow-y: auto; padding: 32px;
                box-shadow: 0 16px 48px rgba(14, 20, 32, 0.15);
            }
            .eq-modal-header {
                display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
            }
            .eq-modal-title { font-family: var(--display, 'Archivo', sans-serif); font-size: 18px; font-weight: 700; color: var(--ink, #0E1420); }
            .eq-modal-close { background: none; border: none; font-size: 18px; cursor: pointer; color: var(--ink-3, #6E7686); }

            /* Responsive */
            @media (max-width: 1200px) {
                .eq-grid { grid-template-columns: repeat(2, 1fr); }
                .eq-mechanism-grid { grid-template-columns: repeat(2, 1fr); }
                .eq-hero-headline { font-size: 48px; }
            }
            @media (max-width: 768px) {
                .eq-grid { grid-template-columns: 1fr; }
                .eq-mechanism-grid { grid-template-columns: 1fr; }
                .eq-paths-grid { grid-template-columns: 1fr; }
                .eq-hero-headline { font-size: 34px !important; }
                .eq-stats-strip { flex-direction: column; gap: 20px; padding: 20px; }
            }
        </style>

        <div class="cl-grain" aria-hidden="true"></div>

        <div class="eq">
            <!-- Section 1: Hero -->
            <div class="eq-hero">
                <h1 class="eq-hero-headline">Put your money where your <strong>metrics</strong> are.</h1>
                <p class="eq-hero-sub">Stake against revenue, sales, or growth targets. Automatic verification. Final settlement. No appeals.</p>
                <div class="eq-hero-actions">
                    <button class="eq-btn-primary" onclick="document.getElementById('live-market').scrollIntoView({behavior:'smooth'})">Explore Market</button>
                    <a href="#" class="eq-link-more" onclick="document.getElementById('how-it-works').scrollIntoView({behavior:'smooth'}); return false;">Learn more →</a>
                </div>
            </div>

            <!-- Section 2: Two Contract Types -->
            <section class="eq-paths" id="how-it-works">
                <div style="margin-bottom: 32px;">
                    <div class="mono-lbl" style="margin-bottom: 8px;">CONTRACT PRIMITIVES</div>
                    <h2 class="eq-market-title">Two ways to <strong>compete.</strong></h2>
                    <p style="font-size: 15px; color: var(--ink-2, #4A5464); max-width: 560px; line-height: 1.6;">Collateral offers two distinct contract primitives. Same verified metrics. Same locked capital. Same automatic settlement. Different opponents.</p>
                </div>
                <div class="eq-paths-grid">
                    <!-- Solo Contract -->
                    <div class="eq-path-card">
                        <div class="mono-lbl" style="margin-bottom: 12px; color: var(--blood, #7A1C29);">SOLO CONTRACT</div>
                        <h3 class="eq-path-title">Back <strong>yourself.</strong></h3>
                        <p class="eq-path-desc">Stake capital against your own performance targets. Hit the metric — keep everything. Miss — capital is forfeited under verified rules.</p>
                        <button class="eq-path-cta" onclick="document.getElementById('live-market').scrollIntoView({behavior:'smooth'})">Browse Solo Contracts →</button>
                    </div>
                    <!-- Rivalry Contract -->
                    <div class="eq-path-card">
                        <div class="mono-lbl" style="margin-bottom: 12px; color: var(--blood, #7A1C29);">RIVALRY CONTRACT</div>
                        <h3 class="eq-path-title">Challenge an <strong>opponent.</strong></h3>
                        <p class="eq-path-desc">Issue a head-to-head duel. Both operators lock matched capital. Verified growth determines the winner. Loser forfeits their stake.</p>
                        <a href="#" onclick="event.preventDefault(); window.router.navigate('/market?type=rivalry');" class="eq-path-cta">Explore Rivalries →</a>
                    </div>
                </div>
            </section>

            <!-- Section 3: Live Market Header & Reconciled Stats -->
            <section class="eq-market-header" id="live-market">
                <div class="mono-lbl" style="margin-bottom: 8px;">LIVE CLEARINGHOUSE</div>
                <h2 class="eq-market-title">Collateral <strong>Market.</strong></h2>
                <div class="eq-market-live">
                    <div class="eq-market-dot"></div>
                    Live — Updated <span id="last-updated" style="font-variant-numeric: tabular-nums;">04:20:00 PM</span>
                </div>

                <!-- Reconciled Statistic Strip -->
                <div class="eq-stats-strip">
                    <div class="eq-stat-group">
                        <div class="eq-stat-val">$<span id="stat-capital">633.6k</span></div>
                        <div class="eq-stat-lbl">OPEN CAPITAL</div>
                    </div>
                    <div class="eq-stat-group">
                        <div class="eq-stat-val" id="stat-contracts">528</div>
                        <div class="eq-stat-lbl">OPEN CONTRACTS</div>
                    </div>
                    <div class="eq-stat-group">
                        <div class="eq-stat-val">$<span id="stat-pool">148.2k</span></div>
                        <div class="eq-stat-lbl">DAILY VOLUME</div>
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
                        <input type="text" class="eq-search-box" id="eq-search" placeholder="Search contracts or creators">
                        <button class="eq-btn-rules" id="btn-rules">Rules</button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="eq-filter-bar">
                    <div class="eq-pills" id="eq-filters">
                        <span class="eq-filter-lbl">DOMAIN</span>
                        <button class="eq-pill active" data-category="all">ALL</button>
                        <button class="eq-pill" data-category="social">SOCIAL</button>
                        <button class="eq-pill" data-category="commerce">COMMERCE</button>
                        <button class="eq-pill" data-category="finance">FINANCE</button>
                    </div>
                    <div class="eq-status-operational">
                        SYSTEM STATUS <div class="dot"></div> OPERATIONAL
                    </div>
                </div>
            </section>

            <!-- Contract Grid -->
            <div class="eq-grid-container" style="padding: 0 32px; max-width: 1300px; margin: 0 auto;">
                <!-- Universal Line -->
                <div class="eq-grid-banner">
                    <span class="mono">§ 3.1 &middot; ALL CONTRACTS FEATURE AUTOMATIC ORACLE TRACKING &middot; DEPOSITS RETURNED UPON VERIFIED GOAL SETTLEMENT</span>
                </div>

                <div class="mono-lbl" style="margin-bottom: 16px;" id="eq-count-lbl">8 CONTRACTS</div>
                <div class="eq-grid" id="eq-grid">
                    <!-- Dynamic cards go here -->
                </div>
                <div id="eq-empty" style="display:none; padding:60px; text-align:center; color:var(--ink-3); font-size:14px; grid-column:1/-1;">No contracts match your filters.</div>
            </div>

            <!-- Mechanism Section -->
            <section class="eq-mechanism">
                <div style="margin-bottom: 32px;">
                    <div class="mono-lbl" style="margin-bottom: 8px;">DETERMINISTIC PROTOCOL</div>
                    <h2 class="eq-market-title">Four steps to <strong>settlement.</strong></h2>
                </div>
                <div class="eq-mechanism-grid">
                    <div class="eq-mech-card">
                        <div class="eq-mech-num">01</div>
                        <div class="eq-mech-label">Commit</div>
                        <div class="eq-mech-desc">Stake capital against specific, measurable performance targets. Lock funds in custody.</div>
                    </div>
                    <div class="eq-mech-card">
                        <div class="eq-mech-num">02</div>
                        <div class="eq-mech-label">Monitor</div>
                        <div class="eq-mech-desc">Metrics are tracked in real-time through verified data adapters connected to authoritative sources.</div>
                    </div>
                    <div class="eq-mech-card">
                        <div class="eq-mech-num">03</div>
                        <div class="eq-mech-label">Verify</div>
                        <div class="eq-mech-desc">Automated oracle verification at the deadline. Deterministic. Transparent. No appeals.</div>
                    </div>
                    <div class="eq-mech-card">
                        <div class="eq-mech-num">04</div>
                        <div class="eq-mech-label">Settle</div>
                        <div class="eq-mech-desc">Variance is calculated against target. Capital is released to winner or returned upon verification.</div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Rules Modal -->
        <div class="eq-modal-backdrop" id="rules-modal" onclick="if(event.target===this) this.classList.remove('open')">
            <div class="eq-modal">
                <div class="eq-modal-header">
                    <span class="eq-modal-title">Execution Rules</span>
                    <button class="eq-modal-close" onclick="document.getElementById('rules-modal').classList.remove('open')">✕</button>
                </div>

                <div class="mono-lbl" style="margin-bottom: 12px; border-bottom: 1px solid var(--rule, #DCD5C6); padding-bottom: 6px;">ENFORCEMENT</div>
                <div style="font-size: 13px; color: var(--ink-2); display: flex; flex-direction: column; gap: 8px;">
                    <div>✓ Verified Only (Fail-Closed)</div>
                    <div>✓ Immutable Terms</div>
                    <div>✓ No Appeals</div>
                </div>
            </div>
        </div>
    `;
}

export function initOverview() {
    let activeSort = 'trending_24h';
    let activeCategory = 'all';

    const grid = document.getElementById('eq-grid');
    const countLbl = document.getElementById('eq-count-lbl');

    if (!grid) return;

    const defaultListings = [
        {
            id: 'B1A6-9901',
            title: 'Order Volume Growth (30d)',
            domain: 'commerce',
            provider: 'shopify',
            tier: 'maximum',
            badge: 'FILLING FAST',
            min_stake: 500,
            max_stake: 10000,
            multiplier: 4.0,
            days_left: 14
        },
        {
            id: 'FDA5-4421',
            title: 'Monthly Recurring Revenue (30d)',
            domain: 'finance',
            provider: 'stripe',
            tier: 'maximum',
            badge: 'MOST STAKED',
            min_stake: 500,
            max_stake: 5000,
            multiplier: 3.5,
            days_left: 4
        },
        {
            id: 'D5CF-8812',
            title: 'Follower Growth (14d)',
            domain: 'social',
            provider: 'x',
            tier: 'elevated',
            badge: 'POPULAR',
            min_stake: 250,
            max_stake: 3000,
            multiplier: 2.5,
            days_left: 7
        },
        {
            id: '399F-1029',
            title: 'Store Net Sales (30d)',
            domain: 'commerce',
            provider: 'shopify',
            tier: 'elevated',
            badge: '48 ACTIVE',
            min_stake: 250,
            max_stake: 2500,
            multiplier: 2.5,
            days_left: 18
        },
        {
            id: 'E882-7710',
            title: 'Channel Subscribers (60d)',
            domain: 'social',
            provider: 'youtube',
            tier: 'controlled',
            badge: 'POPULAR',
            min_stake: 100,
            max_stake: 1500,
            multiplier: 1.5,
            days_left: 22
        },
        {
            id: '771C-3382',
            title: 'Checkout Volume (14d)',
            domain: 'finance',
            provider: 'stripe',
            tier: 'maximum',
            badge: 'FILLING FAST',
            min_stake: 1000,
            max_stake: 15000,
            multiplier: 4.0,
            days_left: 3
        },
        {
            id: '91B4-6603',
            title: 'App Store Downloads (30d)',
            domain: 'commerce',
            provider: 'apple',
            tier: 'elevated',
            badge: 'MOST STAKED',
            min_stake: 500,
            max_stake: 4000,
            multiplier: 2.8,
            days_left: 12
        },
        {
            id: '440A-2291',
            title: 'API Request Volume (14d)',
            domain: 'social',
            provider: 'x',
            tier: 'controlled',
            badge: '48 ACTIVE',
            min_stake: 150,
            max_stake: 2000,
            multiplier: 1.8,
            days_left: 9
        }
    ];

    function renderGrid(contracts) {
        grid.innerHTML = '';

        let list = (contracts && contracts.length > 0) ? contracts : defaultListings;

        if (activeCategory !== 'all') {
            list = list.filter(c => (c.domain || 'social').toLowerCase() === activeCategory.toLowerCase());
        }

        if (countLbl) countLbl.textContent = `${list.length} CONTRACT${list.length !== 1 ? 'S' : ''}`;

        if (list.length === 0) {
            grid.innerHTML = '<div style="padding:60px; text-align:center; color:var(--ink-3); font-size:14px; grid-column:1/-1; background:var(--plate);">No contracts match your filters.</div>';
            return;
        }

        list.forEach(c => {
            const el = document.createElement('div');
            el.innerHTML = renderCard(c);
            grid.appendChild(el.firstElementChild);
        });
    }

    function renderCard(c) {
        const rawId = (c.id || '').toString();
        const shortId = rawId.split('-')[0] || rawId || 'B1A6';
        const tier = (c.tier || 'controlled').toLowerCase();
        const min = c.min_stake || 250;
        const max = c.max_stake || 3000;
        const stakeDisplay = `$${min.toLocaleString()} – $${max.toLocaleString()}`;
        const timeLabel = `${c.days_left || 4}d left`;
        const platform = (c.provider || 'x').toString();
        const goal = c.title || 'Contract Goal';

        const tierBadgeText = tier === 'maximum' ? 'ALL-IN' : tier === 'elevated' ? 'STAKE' : 'PLEDGE';
        const badgeText = c.badge || 'MOST STAKED';
        const multiplier = c.multiplier ? c.multiplier.toFixed(1) : '2.5';

        // Item 2: Restructured 2-line header layout (Line 1: badge; Line 2: RCPT + Countdown)
        return `
            <div class="eq-card"
                 data-id="${c.id}" 
                 data-tier="${tier}" 
                 data-stake-min="${min}"
                 data-stake-max="${max}"
                 data-goal="${goal}"
                 data-provider="${platform}">
                
                <div class="eq-card-header-line1">
                    <span class="mono-lbl" style="background: rgba(122, 28, 41, 0.08); color: #7A1C29; padding: 3px 8px; border-radius: 2px; border: 1px solid rgba(122, 28, 41, 0.2); font-weight: 700; white-space: nowrap;">${badgeText}</span>
                </div>
                
                <div class="eq-card-header-line2">
                    <span class="mono-lbl" style="white-space: nowrap;">RCPT-${shortId.slice(0, 4).toUpperCase()}</span>
                    <span class="mono-lbl" style="white-space: nowrap; font-variant-numeric: tabular-nums;">○ ${timeLabel}</span>
                </div>
                
                <h3 class="eq-card-title">${goal}</h3>
                
                <div class="eq-card-provider">
                    <!-- Item 4: Monochromatic dot (--ink-3 / #6E7686) -->
                    <span class="eq-platform-dot"></span>
                    <span class="mono-lbl" style="color: var(--ink-2, #4A5464);">${platform.toUpperCase()}</span>
                    <span class="eq-tier-badge ${tier}">${tierBadgeText}</span>
                </div>

                <div class="eq-card-divider"></div>

                <div class="eq-card-stake-info">
                    <div>
                        <div class="eq-stake-val">${stakeDisplay}</div>
                        <div class="mono-lbl" style="font-size: 9px; margin-top: 2px;">STAKE RANGE</div>
                    </div>
                    <div class="eq-stake-separator"></div>
                    <div style="text-align: right;">
                        <div class="eq-stake-val" style="color: #7A1C29;">${multiplier}×</div>
                        <div class="mono-lbl" style="font-size: 9px; margin-top: 2px;">YIELD MULTIPLIER</div>
                    </div>
                </div>

                <!-- Item 1: Background #7A1C29, text #FFF8F5, hover #54111B -->
                <button class="eq-card-cta primary eq-lock-btn">START COMMITMENT</button>
            </div>
        `;
    }

    // Tabs listener
    const tabsContainer = document.getElementById('eq-tabs');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.eq-tab');
            if (!tab) return;
            tabsContainer.querySelectorAll('.eq-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeSort = tab.dataset.sort;
            renderGrid();
        });
    }

    // Filters (Domain) listener
    const filtersContainer = document.getElementById('eq-filters');
    if (filtersContainer) {
        filtersContainer.addEventListener('click', (e) => {
            const pill = e.target.closest('.eq-pill');
            if (!pill) return;
            filtersContainer.querySelectorAll('.eq-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeCategory = pill.dataset.category;
            renderGrid();
        });
    }

    // Grid click listener
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.eq-lock-btn');
        if (btn) {
            e.stopPropagation();
            e.preventDefault();
            const card = btn.closest('.eq-card');
            if (card) {
                openExecutionModal({
                    id: card.dataset.id,
                    title: card.dataset.goal,
                    goal: card.dataset.goal,
                    tier: card.dataset.tier,
                    provider: card.dataset.provider,
                    platform: card.dataset.provider,
                    min_stake: parseFloat(card.dataset.stakeMin || '250'),
                    max_stake: parseFloat(card.dataset.stakeMax || '3000'),
                    multiplier: card.dataset.tier === 'maximum' ? 4.0 : 2.5
                });
            }
            return;
        }

        const card = e.target.closest('.eq-card');
        if (card) {
            e.preventDefault();
            e.stopPropagation();
            const id = card.dataset.id;
            if (id) window.router.navigate('/contract/' + id);
        }
    });

    // Rules modal listener
    const rulesBtn = document.getElementById('btn-rules');
    const rulesModal = document.getElementById('rules-modal');
    if (rulesBtn && rulesModal) {
        rulesBtn.addEventListener('click', () => rulesModal.classList.add('open'));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && rulesModal.classList.contains('open')) rulesModal.classList.remove('open');
        });
    }

    // Initial render
    renderGrid();
}
