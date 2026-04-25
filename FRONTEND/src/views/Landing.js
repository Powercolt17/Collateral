// Landing Page — Dedicated ad traffic conversion page
// Route: /#/go
// No header/nav — focused single-CTA conversion flow

import { getPublicLedger } from '../api.js';

export function renderLanding() {
    return `
        <style>
            .lp {
                background: #fff;
                min-height: 100vh;
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
                overflow-x: hidden;
            }

            /* ── Minimal top bar ── */
            .lp-topbar {
                padding: 24px 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .lp-logo {
                font-family: 'Sora', sans-serif;
                font-weight: 800;
                font-size: 15px;
                letter-spacing: 3px;
                color: #5C1414;
                text-transform: uppercase;
            }
            .lp-topbar-cta {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                letter-spacing: 1px;
                color: #5C1414;
                text-decoration: none;
                border: 1px solid #5C1414;
                padding: 10px 20px;
                cursor: pointer;
                background: none;
                transition: all 0.3s ease;
                text-transform: uppercase;
            }
            .lp-topbar-cta:hover {
                background: #5C1414;
                color: #fff;
            }

            /* ── Hero ── */
            .lp-hero {
                max-width: 900px;
                margin: 0 auto;
                padding: 80px 40px 60px;
                text-align: center;
            }
            .lp-eyebrow {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                letter-spacing: 3px;
                text-transform: uppercase;
                color: #5C1414;
                margin-bottom: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }
            .lp-eyebrow::before, .lp-eyebrow::after {
                content: '';
                width: 28px;
                height: 1px;
                background: #5C1414;
                opacity: 0.4;
            }
            .lp-headline {
                font-size: clamp(40px, 7vw, 72px);
                font-weight: 500;
                line-height: 1.0;
                letter-spacing: -2.5px;
                margin-bottom: 28px;
                color: #111;
            }
            .lp-headline strong {
                font-weight: 800;
                color: #5C1414;
            }
            .lp-subline {
                font-size: 17px;
                color: #777;
                line-height: 1.7;
                max-width: 560px;
                margin: 0 auto 48px;
            }
            .lp-hero-cta {
                display: inline-block;
                background: #5C1414;
                color: #fff;
                padding: 20px 48px;
                font-size: 14px;
                font-weight: 700;
                border: none;
                cursor: pointer;
                letter-spacing: 1px;
                text-transform: uppercase;
                transition: all 0.35s ease;
                position: relative;
                overflow: hidden;
            }
            .lp-hero-cta:hover {
                background: #6e1c1c;
                transform: translateY(-2px);
                box-shadow: 0 8px 32px rgba(92, 20, 20, 0.25);
                letter-spacing: 1.5px;
            }
            .lp-hero-cta:active {
                transform: translateY(0);
            }
            .lp-trust-line {
                margin-top: 20px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #bbb;
                letter-spacing: 1.5px;
                text-transform: uppercase;
            }

            /* ── How it works ── */
            .lp-how {
                max-width: 1100px;
                margin: 0 auto;
                padding: 80px 40px;
                border-top: 1px solid #f0f0f0;
            }
            .lp-section-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: #5C1414;
                margin-bottom: 48px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .lp-section-tag::before {
                content: '';
                width: 24px;
                height: 1px;
                background: #5C1414;
            }
            .lp-steps {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0;
                border-top: 1px solid #eee;
            }
            .lp-step {
                padding: 48px 36px;
                border-right: 1px solid #eee;
                position: relative;
                transition: background 0.3s ease, transform 0.3s ease;
            }
            .lp-step:last-child { border-right: none; }
            .lp-step:hover {
                background: #fafafa;
                transform: translateY(-4px);
            }
            .lp-step::before {
                content: '';
                position: absolute;
                top: 0; left: 0;
                width: 0; height: 3px;
                background: #5C1414;
                transition: width 0.4s ease;
            }
            .lp-step:hover::before { width: 100%; }
            .lp-step-num {
                font-family: 'Sora', sans-serif;
                font-size: 64px;
                font-weight: 700;
                color: #f0eded;
                line-height: 0.85;
                margin-bottom: 28px;
            }
            .lp-step-title {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 12px;
                color: #111;
            }
            .lp-step-desc {
                font-size: 14px;
                color: #888;
                line-height: 1.6;
            }

            /* ── Social proof / stats ── */
            .lp-proof {
                max-width: 1100px;
                margin: 0 auto;
                padding: 80px 40px;
                border-top: 1px solid #f0f0f0;
            }
            .lp-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0;
                border: 1px solid #eee;
            }
            .lp-stat {
                padding: 40px 32px;
                border-right: 1px solid #eee;
                text-align: center;
                transition: background 0.3s;
            }
            .lp-stat:last-child { border-right: none; }
            .lp-stat:hover { background: #fafafa; }
            .lp-stat-val {
                font-size: 36px;
                font-weight: 800;
                color: #5C1414;
                margin-bottom: 8px;
                font-family: 'Sora', sans-serif;
            }
            .lp-stat-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                color: #aaa;
            }

            /* ── Sources bar ── */
            .lp-sources {
                max-width: 1100px;
                margin: 0 auto;
                padding: 60px 40px;
                text-align: center;
                border-top: 1px solid #f0f0f0;
            }
            .lp-sources-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: #ccc;
                margin-bottom: 32px;
            }
            .lp-sources-logos {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 48px;
                flex-wrap: wrap;
            }
            .lp-source-item {
                font-family: 'Sora', sans-serif;
                font-size: 16px;
                font-weight: 600;
                color: #ccc;
                letter-spacing: 0.5px;
                transition: color 0.3s;
            }
            .lp-source-item:hover { color: #5C1414; }

            /* ── Bottom CTA ── */
            .lp-bottom-cta {
                padding: 100px 40px;
                text-align: center;
                border-top: 1px solid #f0f0f0;
                background: #fafafa;
            }
            .lp-bottom-headline {
                font-size: clamp(28px, 4vw, 44px);
                font-weight: 500;
                letter-spacing: -1.5px;
                margin-bottom: 16px;
                color: #111;
            }
            .lp-bottom-headline strong {
                font-weight: 800;
                color: #5C1414;
            }
            .lp-bottom-sub {
                font-size: 15px;
                color: #888;
                margin-bottom: 40px;
                max-width: 460px;
                margin-left: auto;
                margin-right: auto;
                line-height: 1.6;
            }

            /* ── Footer ── */
            .lp-footer {
                padding: 32px 40px;
                text-align: center;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #ccc;
                letter-spacing: 1.5px;
                text-transform: uppercase;
            }

            /* ── Mobile ── */
            @media (max-width: 768px) {
                .lp-hero { padding: 60px 24px 40px; }
                .lp-headline { letter-spacing: -1.5px; }
                .lp-subline { font-size: 15px; }
                .lp-hero-cta { padding: 18px 36px; width: 100%; }
                .lp-steps { grid-template-columns: 1fr; }
                .lp-step { border-right: none; border-bottom: 1px solid #eee; }
                .lp-step:last-child { border-bottom: none; }
                .lp-stats { grid-template-columns: repeat(2, 1fr); }
                .lp-stat { border-bottom: 1px solid #eee; }
                .lp-stat:nth-child(odd) { border-right: 1px solid #eee; }
                .lp-stat:nth-child(even) { border-right: none; }
                .lp-stat:nth-last-child(-n+2) { border-bottom: none; }
                .lp-how, .lp-proof, .lp-sources { padding: 60px 24px; }
                .lp-bottom-cta { padding: 80px 24px; }
                .lp-topbar { padding: 20px 24px; }
                .lp-sources-logos { gap: 28px; }
            }
        </style>

        <div class="lp">
            <!-- Top bar -->
            <div class="lp-topbar">
                <div class="lp-logo">Collateral</div>
                <button class="lp-topbar-cta" onclick="window.app.openAccessModal()">Sign Up Free</button>
            </div>

            <!-- Hero -->
            <div class="lp-hero">
                <div class="lp-eyebrow">Performance Contract Protocol</div>
                <h1 class="lp-headline">
                    Put your <strong>money</strong> where your <strong>metrics</strong> are
                </h1>
                <p class="lp-subline">
                    Lock capital against real growth targets — Stripe revenue, X followers, Shopify sales. 
                    Hit your number, get paid. Miss it, lose your deposit. No excuses.
                </p>
                <button class="lp-hero-cta" id="lp-main-cta" onclick="window.app.openAccessModal()">
                    Start a Contract →
                </button>
                <div class="lp-trust-line">Free to sign up · No card required · Cancel anytime</div>
            </div>

            <!-- How it works -->
            <div class="lp-how">
                <div class="lp-section-tag">How It Works</div>
                <div class="lp-steps">
                    <div class="lp-step">
                        <div class="lp-step-num">01</div>
                        <div class="lp-step-title">Connect Your Source</div>
                        <div class="lp-step-desc">Link Stripe, X, Shopify, or Amazon. We read your real metrics — no screenshots, no self-reporting.</div>
                    </div>
                    <div class="lp-step">
                        <div class="lp-step-num">02</div>
                        <div class="lp-step-title">Set Your Target</div>
                        <div class="lp-step-desc">Choose a growth target and lock capital against it. Pledge, Stake, or go All-In — higher risk, higher reward.</div>
                    </div>
                    <div class="lp-step">
                        <div class="lp-step-num">03</div>
                        <div class="lp-step-title">Results Decide</div>
                        <div class="lp-step-desc">The protocol verifies your performance automatically at settlement. Hit it — capital returns plus payout. Miss it — forfeited.</div>
                    </div>
                </div>
            </div>

            <!-- Stats -->
            <div class="lp-proof">
                <div class="lp-section-tag">Protocol Metrics</div>
                <div class="lp-stats" id="lp-stats-grid">
                    <div class="lp-stat">
                        <div class="lp-stat-val" id="lp-stat-contracts">—</div>
                        <div class="lp-stat-label">Contracts Executed</div>
                    </div>
                    <div class="lp-stat">
                        <div class="lp-stat-val" id="lp-stat-tvl">—</div>
                        <div class="lp-stat-label">Total Value Locked</div>
                    </div>
                    <div class="lp-stat">
                        <div class="lp-stat-val" id="lp-stat-sources">4</div>
                        <div class="lp-stat-label">Verified Sources</div>
                    </div>
                    <div class="lp-stat">
                        <div class="lp-stat-val" id="lp-stat-settlement">14d</div>
                        <div class="lp-stat-label">Avg Settlement</div>
                    </div>
                </div>
            </div>

            <!-- Sources -->
            <div class="lp-sources">
                <div class="lp-sources-label">Verified Integrations</div>
                <div class="lp-sources-logos">
                    <span class="lp-source-item">Stripe</span>
                    <span class="lp-source-item">X (Twitter)</span>
                    <span class="lp-source-item">Shopify</span>
                    <span class="lp-source-item">Amazon</span>
                </div>
            </div>

            <!-- Bottom CTA -->
            <div class="lp-bottom-cta">
                <h2 class="lp-bottom-headline">
                    Stop talking about growth.<br><strong>Prove it.</strong>
                </h2>
                <p class="lp-bottom-sub">
                    Lock capital against your next milestone. 
                    The protocol doesn't care about your excuses.
                </p>
                <button class="lp-hero-cta" onclick="window.app.openAccessModal()">
                    Create Your First Contract →
                </button>
            </div>

            <!-- Footer -->
            <div class="lp-footer">
                Collateral.market · Performance Contract Protocol · © 2026
            </div>
        </div>
    `;
}

export function initLanding() {
    // GA4: track landing page view specifically
    if (window.trackEvent) {
        window.trackEvent('landing_page_view', { source: 'ad_traffic' });
    }

    // Fetch live stats from API
    fetchLandingStats();
}

async function fetchLandingStats() {
    try {
        const events = await getPublicLedger();
        if (!Array.isArray(events) || events.length === 0) return;

        // Count unique contracts/rivalries
        const uniqueSources = new Set();
        let totalLockedCents = 0;
        let rivalryCount = 0;

        events.forEach(e => {
            uniqueSources.add(e.sourceId);

            // Sum locked amounts from FUNDS_LOCKED and RIVALRY_CREATED events
            if (e.eventType === 'FUNDS_LOCKED' || e.eventType === 'RIVALRY_CREATED' || e.eventType === 'EXECUTION_CONFIRMED') {
                totalLockedCents += Math.abs(e.amountUsdCents || e.lockAmountUsdCents || 0);
            }

            if (e.sourceType === 'RIVALRY') rivalryCount++;
        });

        const contractsEl = document.getElementById('lp-stat-contracts');
        const tvlEl = document.getElementById('lp-stat-tvl');
        const sourcesEl = document.getElementById('lp-stat-sources');

        if (contractsEl) contractsEl.textContent = uniqueSources.size.toLocaleString();
        if (tvlEl) {
            const dollars = totalLockedCents / 100;
            tvlEl.textContent = dollars >= 1000
                ? '$' + (dollars / 1000).toFixed(1) + 'k'
                : '$' + Math.round(dollars).toLocaleString();
        }
        // Show rivalry count if any
        if (sourcesEl && rivalryCount > 0) {
            // Keep "4" for verified sources — it's correct
        }
    } catch (_) {
        // Silent — show dashes as fallback
    }
}
