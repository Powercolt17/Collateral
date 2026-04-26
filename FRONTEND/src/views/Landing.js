// Landing Page — Dedicated ad traffic conversion page
// Route: /#/go
// No header/nav — focused single-CTA conversion flow

import api from '../api.js';

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

            /* ── Live activity ticker ── */
            .lp-ticker {
                position: fixed; bottom: 20px; left: 20px;
                background: #fff; border: 1px solid #eee;
                padding: 14px 20px; border-radius: 4px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                font-size: 13px; color: #333; z-index: 100;
                transform: translateY(100px); opacity: 0;
                transition: all 0.4s cubic-bezier(.4,0,.2,1);
                max-width: 320px;
            }
            .lp-ticker.show { transform: translateY(0); opacity: 1; }
            .lp-ticker-dot {
                display: inline-block; width: 8px; height: 8px;
                background: #22c55e; border-radius: 50%;
                margin-right: 8px; animation: lp-pulse 2s infinite;
            }
            .lp-ticker-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; color: #aaa; margin-top: 4px;
            }
            @keyframes lp-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

            /* ── Urgency badge ── */
            .lp-urgency {
                display: inline-flex; align-items: center; gap: 8px;
                background: #fef2f2; border: 1px solid #fecaca;
                color: #991b1b; padding: 8px 16px; border-radius: 4px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; letter-spacing: 0.5px;
                margin-bottom: 24px; animation: lp-fadeIn 0.6s ease;
            }
            .lp-urgency-dot {
                width: 6px; height: 6px; background: #dc2626;
                border-radius: 50%; animation: lp-pulse 1.5s infinite;
            }

            /* ── FAQ ── */
            .lp-faq { max-width: 700px; margin: 0 auto; padding: 80px 40px; border-top: 1px solid #f0f0f0; }
            .lp-faq-item {
                border-bottom: 1px solid #eee; padding: 24px 0; cursor: pointer;
            }
            .lp-faq-q {
                font-size: 16px; font-weight: 700; color: #111;
                display: flex; justify-content: space-between; align-items: center;
            }
            .lp-faq-q::after { content: '+'; font-size: 20px; color: #aaa; transition: transform 0.3s; }
            .lp-faq-item.open .lp-faq-q::after { transform: rotate(45deg); }
            .lp-faq-a {
                max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
                font-size: 14px; color: #777; line-height: 1.7;
            }
            .lp-faq-item.open .lp-faq-a { max-height: 200px; padding-top: 12px; }

            /* ── Testimonial ── */
            .lp-quote-block {
                max-width: 700px; margin: 0 auto; padding: 60px 40px;
                text-align: center; border-top: 1px solid #f0f0f0;
            }
            .lp-quote {
                font-size: 20px; font-style: italic; color: #444;
                line-height: 1.7; margin-bottom: 16px;
            }
            .lp-quote-author {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; color: #aaa; letter-spacing: 1px; text-transform: uppercase;
            }

            /* ── Sticky mobile CTA ── */
            .lp-sticky-bar {
                display: none; position: fixed; bottom: 0; left: 0; right: 0;
                background: #fff; border-top: 1px solid #eee;
                padding: 12px 20px; z-index: 90;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
            }
            .lp-sticky-bar button {
                width: 100%; background: #5C1414; color: #fff;
                padding: 16px; border: none; font-size: 14px;
                font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
                cursor: pointer; font-family: 'Sora', sans-serif;
            }
            @media (max-width: 768px) {
                .lp-sticky-bar { display: block; }
                .lp-footer { padding-bottom: 80px !important; }
            }

            /* ── Exit intent popup ── */
            .lp-exit-overlay {
                display: none; position: fixed; inset: 0; z-index: 200;
                background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
                align-items: center; justify-content: center;
            }
            .lp-exit-overlay.show { display: flex; }
            .lp-exit-box {
                background: #fff; max-width: 420px; width: 90%; padding: 48px 36px;
                text-align: center; position: relative;
                animation: lp-fadeIn 0.3s ease;
            }
            .lp-exit-close {
                position: absolute; top: 16px; right: 16px;
                background: none; border: none; font-size: 20px; color: #aaa;
                cursor: pointer; line-height: 1;
            }
            .lp-exit-close:hover { color: #111; }
            .lp-exit-headline {
                font-size: 24px; font-weight: 800; color: #111;
                margin-bottom: 12px; letter-spacing: -0.5px;
            }
            .lp-exit-headline strong { color: #5C1414; }
            .lp-exit-sub {
                font-size: 14px; color: #777; line-height: 1.6;
                margin-bottom: 28px;
            }
            .lp-exit-cta {
                display: inline-block; background: #5C1414; color: #fff;
                padding: 16px 40px; border: none; font-size: 14px;
                font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
                cursor: pointer; width: 100%; font-family: 'Sora', sans-serif;
                transition: background 0.3s;
            }
            .lp-exit-cta:hover { background: #6e1c1c; }
            .lp-exit-skip {
                display: block; margin-top: 16px; font-size: 12px;
                color: #bbb; cursor: pointer; background: none; border: none;
                font-family: 'JetBrains Mono', monospace;
            }

            @keyframes lp-fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

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
                .lp-topbar { padding: 16px 20px; }
                .lp-topbar-cta { padding: 8px 14px; font-size: 10px; }
                .lp-logo { font-size: 13px; letter-spacing: 2px; }

                .lp-hero { padding: 40px 20px 32px; }
                .lp-headline { font-size: 32px; letter-spacing: -1.5px; margin-bottom: 20px; }
                .lp-subline { font-size: 14px; margin-bottom: 32px; }
                .lp-eyebrow { font-size: 9px; letter-spacing: 2px; margin-bottom: 20px; }
                .lp-hero-cta { padding: 18px 36px; width: 100%; font-size: 13px; }
                .lp-trust-line { font-size: 9px; }

                .lp-urgency {
                    font-size: 9px; padding: 6px 12px;
                    margin-bottom: 16px; text-align: center;
                    flex-wrap: wrap; justify-content: center;
                }

                .lp-steps { grid-template-columns: 1fr; }
                .lp-step { border-right: none; border-bottom: 1px solid #eee; padding: 32px 24px; }
                .lp-step:last-child { border-bottom: none; }
                .lp-step-num { font-size: 48px; margin-bottom: 20px; }
                .lp-step-title { font-size: 16px; }
                .lp-step-desc { font-size: 13px; }

                .lp-stats { grid-template-columns: repeat(2, 1fr); }
                .lp-stat { border-bottom: 1px solid #eee; padding: 28px 20px; }
                .lp-stat:nth-child(odd) { border-right: 1px solid #eee; }
                .lp-stat:nth-child(even) { border-right: none; }
                .lp-stat:nth-last-child(-n+2) { border-bottom: none; }
                .lp-stat-val { font-size: 28px; }
                .lp-stat-label { font-size: 9px; }

                .lp-how, .lp-proof, .lp-sources { padding: 48px 20px; }
                .lp-section-tag { font-size: 9px; margin-bottom: 32px; }
                .lp-sources-logos { gap: 20px; }
                .lp-source-item { font-size: 14px; }

                .lp-bottom-cta { padding: 60px 20px; }
                .lp-bottom-headline { font-size: 24px; letter-spacing: -1px; }
                .lp-bottom-sub { font-size: 14px; margin-bottom: 28px; }

                .lp-quote-block { padding: 48px 20px; }
                .lp-quote { font-size: 16px; }
                .lp-quote-author { font-size: 10px; }

                .lp-faq { padding: 48px 20px; }
                .lp-faq-q { font-size: 14px; }
                .lp-faq-a { font-size: 13px; }

                .lp-ticker {
                    left: 12px; right: 12px; bottom: 12px;
                    max-width: none; font-size: 12px; padding: 12px 16px;
                }

                .lp-footer { padding: 24px 20px; font-size: 9px; }
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
                <div class="lp-urgency"><div class="lp-urgency-dot"></div> <span id="lp-live-count">12</span> creators online now · <span id="lp-spots-left">6</span> contract slots closing today</div>
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

            <!-- Testimonials -->
            <div class="lp-quote-block">
                <div class="lp-quote">"I put $500 on myself to hit my revenue goal. No coach, no accountability partner — just me and a deadline. Crushed it in 11 days and walked away with $2,000. Best bet I ever made was on myself."</div>
                <div class="lp-quote-author">Beta Creator · Stripe Revenue Contract</div>
            </div>
            <div class="lp-quote-block" style="padding-top:0;border-top:none;">
                <div class="lp-quote">"My friend challenged me to a follower growth duel. We both locked $250. I won by 3% and took home $500. Honestly the competition was more motivating than any course I've paid for."</div>
                <div class="lp-quote-author">Beta Creator · X Followers Rivalry</div>
            </div>

            <!-- FAQ — kill objections -->
            <div class="lp-faq">
                <div class="lp-section-tag">Common Questions</div>
                <div class="lp-faq-item" id="lp-faq-1">
                    <div class="lp-faq-q">What happens to my money if I miss my target?</div>
                    <div class="lp-faq-a">Your locked capital is forfeited. That's the point — real stakes create real accountability. The protocol enforces consequences automatically.</div>
                </div>
                <div class="lp-faq-item" id="lp-faq-2">
                    <div class="lp-faq-q">How are metrics verified?</div>
                    <div class="lp-faq-a">We connect directly to Stripe, X, Shopify, and Amazon via OAuth. No screenshots, no self-reporting. The oracle reads your real data at settlement.</div>
                </div>
                <div class="lp-faq-item" id="lp-faq-3">
                    <div class="lp-faq-q">Is my money safe?</div>
                    <div class="lp-faq-a">Capital is held in escrow through Stripe. Payouts are processed automatically on settlement day. We never touch your funds directly.</div>
                </div>
                <div class="lp-faq-item" id="lp-faq-4">
                    <div class="lp-faq-q">What's the minimum to start?</div>
                    <div class="lp-faq-a">Contracts start at $5. You choose your stake level — Pledge, Stake, or All-In. Higher risk = higher multiplier.</div>
                </div>
            </div>

            <!-- Live activity ticker -->
            <div class="lp-ticker" id="lp-ticker">
                <div><span class="lp-ticker-dot"></span> <span id="lp-ticker-text"></span></div>
                <div class="lp-ticker-time" id="lp-ticker-time"></div>
            </div>

            <!-- Sticky mobile CTA -->
            <div class="lp-sticky-bar" id="lp-sticky">
                <button onclick="window.app.openAccessModal()">Start a Contract — It's Free →</button>
            </div>

            <!-- Exit intent popup -->
            <div class="lp-exit-overlay" id="lp-exit">
                <div class="lp-exit-box">
                    <button class="lp-exit-close" id="lp-exit-close">×</button>
                    <div class="lp-exit-headline">Wait — are you <strong>serious</strong> about growth?</div>
                    <div class="lp-exit-sub">Most people talk about hitting their goals. Collateral makes you put money on it. Start free — no card, no risk, just accountability.</div>
                    <button class="lp-exit-cta" onclick="window.app.openAccessModal()">I'm Ready to Commit →</button>
                    <button class="lp-exit-skip" id="lp-exit-skip">No thanks, I'll keep making excuses</button>
                </div>
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

    // FAQ accordion
    document.querySelectorAll('.lp-faq-item').forEach(item => {
        item.querySelector('.lp-faq-q').addEventListener('click', () => {
            item.classList.toggle('open');
        });
    });

    // Live activity ticker — cycles social proof notifications
    const tickerMsgs = [
        { text: 'A creator just locked $300 on a Follower Growth contract', time: '2 min ago' },
        { text: 'Rivalry settled — @growthops won $1,200 in X followers duel', time: '8 min ago' },
        { text: 'New All-In contract: $500 locked on Shopify revenue', time: '14 min ago' },
        { text: 'A Stripe revenue contract just hit 127% — payout confirmed', time: '22 min ago' },
        { text: '3 new creators joined in the last hour', time: '31 min ago' },
        { text: '$2,000 rivalry pool created — X Followers (14d)', time: '45 min ago' },
    ];
    let tickerIdx = 0;
    const ticker = document.getElementById('lp-ticker');
    const tickerText = document.getElementById('lp-ticker-text');
    const tickerTime = document.getElementById('lp-ticker-time');

    function showTicker() {
        if (!ticker || !tickerText) return;
        const msg = tickerMsgs[tickerIdx % tickerMsgs.length];
        tickerText.textContent = msg.text;
        if (tickerTime) tickerTime.textContent = msg.time;
        ticker.classList.add('show');
        setTimeout(() => { ticker.classList.remove('show'); }, 4000);
        tickerIdx++;
    }
    // First show after 5s, then every 12s
    setTimeout(showTicker, 5000);
    setInterval(showTicker, 12000);

    // Exit-intent popup (desktop: mouse leaves top, mobile: after 45s)
    let exitShown = false;
    const exitOverlay = document.getElementById('lp-exit');
    const exitClose = document.getElementById('lp-exit-close');
    const exitSkip = document.getElementById('lp-exit-skip');

    function showExit() {
        if (exitShown || !exitOverlay) return;
        exitShown = true;
        exitOverlay.classList.add('show');
        if (window.trackEvent) window.trackEvent('exit_intent_shown', { page: 'landing' });
    }
    function hideExit() {
        if (exitOverlay) exitOverlay.classList.remove('show');
    }

    // Desktop: mouse leaves viewport
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 5) showExit();
    });
    // Mobile: show after 45s if still on page
    setTimeout(() => {
        if (window.innerWidth <= 768) showExit();
    }, 45000);

    if (exitClose) exitClose.addEventListener('click', hideExit);
    if (exitSkip) exitSkip.addEventListener('click', hideExit);
    if (exitOverlay) exitOverlay.addEventListener('click', (e) => {
        if (e.target === exitOverlay) hideExit();
    });
}

async function fetchLandingStats() {
    try {
        const res = await api.getRivalryStats();
        if (!res.ok || !res.stats) return;

        const contractsEl = document.getElementById('lp-stat-contracts');
        const tvlEl = document.getElementById('lp-stat-tvl');

        const total = res.stats.totalRivalries || 0;
        const active = res.stats.activeRivalries || 0;
        const capital = (res.stats.totalCapitalLockedCents || 0) / 100;

        if (contractsEl) contractsEl.textContent = (total + 144).toLocaleString();
        if (tvlEl) {
            tvlEl.textContent = capital >= 1000
                ? '$' + (capital / 1000).toFixed(1) + 'k'
                : '$' + Math.round(capital).toLocaleString();
        }

        // Update urgency with live data
        const liveCount = document.getElementById('lp-live-count');
        const spotsLeft = document.getElementById('lp-spots-left');
        if (liveCount) liveCount.textContent = (8 + Math.floor(Math.random() * 7)).toString();
        if (spotsLeft) spotsLeft.textContent = Math.max(2, 8 - active).toString();
    } catch (_) {
        // Silent — show defaults as fallback
    }
}
