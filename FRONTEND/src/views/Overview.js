// Overview — Collateral Execution Queue
// ALL contracts are percentage growth from baseline
// Social (X) = Follower % growth, Sales/Commerce/Finance = Revenue % growth
// Tiers: Controlled (~30% win), Elevated (~20% win), Maximum (~10% win)
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
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
                color: #752122;
                margin-bottom: 24px;
            }
            .eq-tag::before {
                content: '';
                width: 32px;
                height: 1px;
                background: #752122;
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
                font-weight: 800; /* Heavy weight for measurable */
            }
            .eq-hero-sub {
                font-size: 16px;
                color: #888;
                max-width: 480px;
                line-height: 1.6;
                margin-bottom: 40px;
                font-family: 'Neue Haas Grotesk Display', sans-serif;
            }
            .eq-hero-actions {
                display: flex;
                align-items: center;
                gap: 24px;
            }
            .eq-btn-primary {
                background: #0a0a0a;
                color: #fff;
                padding: 18px 32px;
                font-size: 14px;
                font-weight: 700;
                border: none;
                cursor: pointer;
                border-radius: 0;
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
            }
            .eq-mech-card {
                padding: 60px 40px;
                border-right: 1px solid #f0f0f0;
                position: relative;
                overflow: hidden;
                transition: background 0.3s;
            }
            .eq-mech-card:hover { background: #fafafa; }
            .eq-mech-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 3px;
                background: #752122;
                transition: width 0.4s ease;
            }
            .eq-mech-card:hover::before { width: 100%; }
            .eq-mech-card:last-child { border-right: none; }
            .eq-mech-num {
                font-family: 'Neue Haas Grotesk Display', sans-serif;
                font-size: 80px;
                font-weight: 700;
                color: #f5f5f5;
                line-height: 0.8;
                margin-bottom: 40px;
            }
            .eq-mech-label {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 24px;
                color: #111;
            }
            .eq-mech-desc {
                font-size: 14px;
                color: #888;
                line-height: 1.6;
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
                font-family: 'Neue Haas Grotesk Display', sans-serif;
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
                gap: 1px;
                background: #f2f2f2;
                border: 1px solid #f2f2f2;
            }
            .eq-card {
                background: #fff;
                padding: 32px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                cursor: pointer;
                transition: background 0.2s;
                position: relative;
                overflow: hidden;
            }
            .eq-card:hover { background: #fafafa; }
            .eq-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 3px;
                background: #752122;
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
            .eq-closing { color: #752122; font-weight: 700; }
            .eq-id { color: #ccc; }
            .eq-time { color: #ccc; display: flex; align-items: center; gap: 4px; }

            .eq-card-title {
                font-size: 18px;
                font-weight: 700;
                color: #111;
                margin-bottom: 8px;
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
                margin-bottom: 24px;
            }
            .eq-card-status .dot { width: 4px; height: 4px; border-radius: 50%; background: currentcolor; }

            .eq-card-stake-info {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 24px;
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
                background: #000;
                color: #fff;
                border: none;
                padding: 14px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                width: 100%;
                cursor: pointer;
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
            .eq-rule-row input[type="checkbox"] { accent-color: #752122; }
            .eq-threshold-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
            .eq-threshold-table th { text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #aaa; padding: 8px 12px; border-bottom: 1px solid #f2f2f2; }
            .eq-threshold-table td { padding: 8px 12px; color: #555; border-bottom: 1px solid #f8f8f8; }
            .eq-threshold-table .tier-controlled { color: #166534; font-weight: 600; }
            .eq-threshold-table .tier-elevated { color: #9a3412; font-weight: 600; }
            .eq-threshold-table .tier-maximum { color: #9f1239; font-weight: 600; }
            .eq-slider-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
            .eq-slider-label { font-size: 12px; color: #888; min-width: 80px; }
            .eq-slider { flex: 1; accent-color: #752122; }
            .eq-slider-value { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #111; font-weight: 600; min-width: 60px; text-align: right; }

            /* --- STAKE WARNING --- */
            .eq-stake-warning { max-width: 1300px; margin: 0 auto; padding: 24px 32px; border-top: 1px solid #f2f2f2; }
            .eq-stake-warning-text { font-size: 12px; color: #ccc; font-style: italic; }

            @media (max-width: 1200px) {
                .eq-grid { grid-template-columns: repeat(2, 1fr); }
                .eq-mechanism-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 768px) {
                .eq-hero-headline { font-size: 48px; letter-spacing: -2px; }
                .eq-grid { grid-template-columns: 1fr; }
                .eq-mechanism-grid { grid-template-columns: 1fr; }
                .eq-stats-strip { flex-direction: column; gap: 32px; }
            }
        </style>

        <div class="eq">
            <!-- Section 1: Hero -->
            <div class="eq-hero">
                <div class="eq-tag">Performance Collateral Protocol</div>
                <h1 class="eq-hero-headline">Capital committed to <strong>measurable</strong> outcomes.</h1>
                <p class="eq-hero-sub">Stake against revenue, sales, or growth targets. Automatic verification. Final settlement. No appeals.</p>
                <div class="eq-hero-actions">
                    <button class="eq-btn-primary" onclick="document.getElementById('live-market').scrollIntoView({behavior:'smooth'})">Explore Market</button>
                    <a href="#" class="eq-link-more">Learn more →</a>
                </div>
                <div class="eq-hero-scroll">Scroll</div>
            </div>

            <!-- Section 2: Mechanism -->
            <section class="eq-mechanism">
                <div class="eq-mechanism-header">
                    <div class="eq-mechanism-side-left">
                        <div class="eq-tag">How it works</div>
                        <h2 class="eq-mechanism-title">Four steps to <strong>settlement.</strong></h2>
                    </div>
                    <div class="eq-mechanism-side">
                        A protocol designed for finality. Every commitment resolves to a binary outcome — hit the target or forfeit the stake.
                    </div>
                </div>
                <div class="eq-mechanism-grid">
                    <div class="eq-mech-card">
                        <div class="eq-mech-num">01</div>
                        <div class="eq-mech-label">Commit</div>
                        <div class="eq-mech-desc">Stake capital against specific, measurable performance targets. Define the metric, set the threshold, lock the funds.</div>
                    </div>
                    <div class="eq-mech-card">
                        <div class="eq-mech-num">02</div>
                        <div class="eq-mech-label">Monitor</div>
                        <div class="eq-mech-desc">Metrics are tracked in real-time through verified data adapters connected to authoritative sources.</div>
                    </div>
                    <div class="eq-mech-card">
                        <div class="eq-mech-num">03</div>
                        <div class="eq-mech-label">Verify</div>
                        <div class="eq-mech-desc">Automated oracle verification at the deadline. Deterministic. Transparent. No appeals process.</div>
                    </div>
                    <div class="eq-mech-card">
                        <div class="eq-mech-num">04</div>
                        <div class="eq-mech-label">Settle</div>
                        <div class="eq-mech-desc">Variance is calculated against the target. Capital is released to the counterparty or returned to the staker.</div>
                    </div>
                </div>
            </section>

            <!-- Section 3: Live Market Header -->
            <section class="eq-market-header" id="live-market">
                <div class="eq-tag">Live Contracts</div>
                <h2 class="eq-market-title">Active <strong>market.</strong></h2>
                <div class="eq-market-live">
                    <div class="eq-market-dot"></div>
                    Live — Updated <span id="last-updated">04:20:00 PM</span>
                </div>

                <div class="eq-stats-strip">
                    <div class="eq-stat-group">
                        <div class="eq-stat-val">$<span id="stat-capital">0</span><small>(BETA)</small></div>
                        <div class="eq-stat-lbl">Capital Locked</div>
                    </div>
                    <div class="eq-stat-group">
                        <div class="eq-stat-val" id="stat-contracts">0</div>
                        <div class="eq-stat-lbl">Active Contracts</div>
                    </div>
                    <div class="eq-stat-group">
                        <div class="eq-stat-val">$<span id="stat-pool">0</span><small>(BETA)</small></div>
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
                        <button class="eq-pill" data-category="sales">Sales</button>
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
            <div class="eq-grid-container" style="padding: 0 32px; max-width: 1300px; margin: 0 auto;">
                <div style="font-family:'JetBrains Mono'; font-size: 10px; color: #ccc; margin-bottom: 24px;" id="eq-count-lbl">12 contracts</div>
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
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-controlled" data-tier="controlled"><span>Controlled — ~30% designed win rate</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-elevated" data-tier="elevated"><span>Elevated — ~20% designed win rate</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-maximum" data-tier="maximum"><span>Maximum — ~10% designed win rate</span></div>

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
                            <td class="tier-controlled">Controlled</td>
                            <td>≥ 100</td>
                            <td>≥ $500/mo</td>
                            <td>~30%</td>
                        </tr>
                        <tr>
                            <td class="tier-elevated">Elevated</td>
                            <td>≥ 250</td>
                            <td>≥ $2,000/mo</td>
                            <td>~20%</td>
                        </tr>
                        <tr>
                            <td class="tier-maximum">Maximum</td>
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

    if (!grid) return;

    // Show demo stats immediately while loading
    if (statCapital) statCapital.textContent = '2.1M';
    if (statContracts) statContracts.textContent = '142';
    if (statPool) statPool.textContent = '12.5M';

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
        const multiplier = tierUpper === 'MAXIMUM' ? 4.0 : tierUpper === 'ELEVATED' ? 2.5 : 1.5;

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
                 data-goal="${goal}">
                <div class="eq-card-meta">
                    <span class="eq-closing">${closingAmtText}</span>
                    <span class="eq-id">RCPT-${shortId.slice(0, 4).toUpperCase()}</span>
                    <span class="eq-time">○ ${timeLabel}</span>
                </div>
                <div class="eq-card-title">${goal}</div>
                <div class="eq-card-provider">
                    <span class="dot ${dotClass}" style="width: 6px; height: 6px; border-radius: 50%; background: ${dotClass === 'stripe' ? '#635bff' : dotClass === 'shopify' ? '#96bf48' : dotClass === 'amazon' ? '#ff9900' : '#111'}"></span>
                    <span class="eq-provider-name">${platform.toUpperCase()}</span>
                    <span class="eq-tier-badge ${tier}">${tier.toUpperCase()}</span>
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
        if (!stats || !stats.tvlUsd || stats.tvlUsd === '0' || Number(stats.tvlUsd) === 0) {
            if (statCapital) statCapital.textContent = '2.1M';
            if (statContracts) statContracts.textContent = '142';
            if (statPool) statPool.textContent = '12.5M';
            return;
        }
        if (statCapital) statCapital.textContent = (stats.tvlUsd / 1000000).toFixed(1) + 'M';
        if (statContracts) statContracts.textContent = stats.activeCount || '0';
        if (statPool) statPool.textContent = (stats.volume24hUsd / 1000).toFixed(0) + 'k';
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

        const integration = cardEl.querySelector('.eq-card-integration')?.textContent?.trim() || '';
        let provider = 'x';
        if (integration.toLowerCase().includes('stripe')) provider = 'stripe';
        else if (integration.toLowerCase().includes('shopify')) provider = 'shopify';
        else if (integration.toLowerCase().includes('amazon')) provider = 'amazon';

        const tierUpper = tier.toUpperCase();
        const multiplier = tierUpper === 'MAXIMUM' ? 4.0 : tierUpper === 'ELEVATED' ? 2.5 : 1.5;

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
            if (id) window.location.hash = '/contract/' + id;
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
