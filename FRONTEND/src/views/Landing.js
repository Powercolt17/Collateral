// Landing Page — Rewritten for cold X ad traffic conversion
// Route: /#/go
// Optimized for: 5-second comprehension, immediate CTA, zero jargon above fold
// Based on Clarity data: 28s active, 1.4 pages/session, 53% scroll, 7.69% dead clicks

import api from '../api.js';

export function renderLanding() {
    return `
        <style>
            /* ── Base ── */
            .lp {
                min-height: 100vh; background: #fff; color: #111;
                font-family: 'Sora', sans-serif; overflow-x: hidden;
            }
            .lp *, .lp *::before, .lp *::after { box-sizing: border-box; }

            /* ── Hero ── */
            .lp-hero {
                text-align: center; padding: 80px 24px 48px;
                max-width: 680px; margin: 0 auto;
            }
            .lp-h1 {
                font-size: 52px; font-weight: 900; color: #111;
                letter-spacing: -2px; line-height: 1.1; margin: 0 0 20px;
            }
            .lp-h1 strong { color: #5C1414; }
            .lp-sub {
                font-size: 18px; color: #666; line-height: 1.7;
                margin: 0 0 36px; max-width: 520px; margin-left: auto; margin-right: auto;
            }
            .lp-cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
            .lp-cta-primary {
                padding: 18px 40px; background: #5C1414; color: #fff;
                font-size: 14px; font-weight: 700; letter-spacing: 1px;
                text-transform: uppercase; border: none; cursor: pointer;
                font-family: 'Sora', sans-serif; transition: background 0.3s;
            }
            .lp-cta-primary:hover { background: #6e1c1c; }
            .lp-cta-secondary {
                padding: 18px 40px; background: transparent; color: #111;
                font-size: 14px; font-weight: 700; letter-spacing: 1px;
                text-transform: uppercase; border: 2px solid #ddd; cursor: pointer;
                font-family: 'Sora', sans-serif; transition: all 0.3s;
            }
            .lp-cta-secondary:hover { border-color: #111; }

            /* ── Example contracts ── */
            .lp-examples {
                max-width: 960px; margin: 0 auto; padding: 0 24px 60px;
            }
            .lp-examples-tag {
                font-family: 'JetBrains Mono', monospace; font-size: 10px;
                letter-spacing: 2px; text-transform: uppercase; color: #aaa;
                margin-bottom: 24px; text-align: center;
            }
            .lp-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
            .lp-card {
                border: 1px solid #eee; padding: 28px 24px; cursor: pointer;
                transition: all 0.2s ease; position: relative;
            }
            .lp-card:hover { border-color: #5C1414; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
            .lp-card-platform {
                font-family: 'JetBrains Mono', monospace; font-size: 10px;
                letter-spacing: 1.5px; text-transform: uppercase; color: #999;
                margin-bottom: 12px;
            }
            .lp-card-target {
                font-size: 18px; font-weight: 800; color: #111;
                margin-bottom: 16px; letter-spacing: -0.3px;
            }
            .lp-card-meta { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
            .lp-card-row {
                display: flex; justify-content: space-between; font-size: 13px;
            }
            .lp-card-label { color: #999; }
            .lp-card-value { color: #111; font-weight: 600; }
            .lp-card-value.green { color: #15803d; }
            .lp-card-cta {
                display: block; width: 100%; padding: 14px; background: #111; color: #fff;
                font-size: 12px; font-weight: 700; letter-spacing: 1px;
                text-transform: uppercase; text-align: center; border: none;
                cursor: pointer; font-family: 'Sora', sans-serif;
                transition: background 0.2s;
            }
            .lp-card-cta:hover { background: #5C1414; }

            /* ── How it works ── */
            .lp-how {
                background: #fafafa; border-top: 1px solid #f0f0f0;
                border-bottom: 1px solid #f0f0f0;
                padding: 64px 24px;
            }
            .lp-how-inner { max-width: 800px; margin: 0 auto; }
            .lp-how-tag {
                font-family: 'JetBrains Mono', monospace; font-size: 10px;
                letter-spacing: 2px; text-transform: uppercase; color: #aaa;
                margin-bottom: 32px; text-align: center;
            }
            .lp-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
            .lp-step { text-align: center; cursor: pointer; }
            .lp-step:hover .lp-step-num { color: #5C1414; }
            .lp-step-num {
                font-size: 36px; font-weight: 900; color: #ddd;
                margin-bottom: 12px; transition: color 0.3s;
                font-family: 'JetBrains Mono', monospace;
            }
            .lp-step-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
            .lp-step-desc { font-size: 12px; color: #888; line-height: 1.6; }

            /* ── Trust ── */
            .lp-trust {
                text-align: center; padding: 48px 24px;
                max-width: 600px; margin: 0 auto;
            }
            .lp-trust-text {
                font-size: 15px; color: #777; line-height: 1.7;
                border: 1px solid #f0f0f0; padding: 24px 32px;
                background: #fafafa;
            }
            .lp-trust-text strong { color: #111; }

            /* ── Testimonial ── */
            .lp-quote-block {
                max-width: 600px; margin: 0 auto; padding: 48px 24px;
                text-align: center;
            }
            .lp-quote {
                font-size: 18px; font-style: italic; color: #444;
                line-height: 1.7; margin-bottom: 16px;
            }
            .lp-quote-author {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; color: #aaa; letter-spacing: 1.5px; text-transform: uppercase;
            }

            /* ── Bottom CTA ── */
            .lp-bottom {
                background: #111; color: #fff; text-align: center;
                padding: 80px 24px;
            }
            .lp-bottom-h2 {
                font-size: 36px; font-weight: 800; margin-bottom: 16px;
                letter-spacing: -1px;
            }
            .lp-bottom-sub { font-size: 15px; color: #888; margin-bottom: 36px; }
            .lp-bottom-btn {
                padding: 18px 48px; background: #5C1414; color: #fff;
                font-size: 14px; font-weight: 700; letter-spacing: 1px;
                text-transform: uppercase; border: none; cursor: pointer;
                font-family: 'Sora', sans-serif;
            }

            /* ── FAQ ── */
            .lp-faq { max-width: 600px; margin: 0 auto; padding: 64px 24px; }
            .lp-faq-tag {
                font-family: 'JetBrains Mono', monospace; font-size: 10px;
                letter-spacing: 2px; text-transform: uppercase; color: #aaa;
                margin-bottom: 24px;
            }
            .lp-faq-item { border-bottom: 1px solid #f0f0f0; }
            .lp-faq-q {
                padding: 20px 0; font-size: 15px; font-weight: 600; color: #111;
                cursor: pointer; display: flex; justify-content: space-between; align-items: center;
            }
            .lp-faq-q::after { content: '+'; font-size: 20px; color: #ccc; transition: transform 0.2s; }
            .lp-faq-item.open .lp-faq-q::after { content: '−'; }
            .lp-faq-a {
                max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
                font-size: 13px; color: #777; line-height: 1.7;
            }
            .lp-faq-item.open .lp-faq-a { max-height: 200px; padding-bottom: 20px; }

            /* ── Sticky mobile CTA ── */
            .lp-sticky {
                display: none; position: fixed; bottom: 0; left: 0; right: 0;
                background: #fff; border-top: 1px solid #eee;
                padding: 12px 20px; z-index: 90;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
            }
            .lp-sticky button {
                width: 100%; background: #5C1414; color: #fff;
                padding: 16px; border: none; font-size: 13px;
                font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
                cursor: pointer; font-family: 'Sora', sans-serif;
            }

            /* ── Footer ── */
            .lp-footer {
                text-align: center; padding: 32px; font-size: 11px; color: #ccc;
                font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px;
            }

            /* ── Ticker ── */
            .lp-ticker {
                position: fixed; bottom: 24px; left: 24px; z-index: 80;
                background: #111; color: #fff; padding: 12px 20px;
                font-size: 12px; display: flex; align-items: center; gap: 10px;
                opacity: 0; transform: translateY(10px);
                transition: opacity 0.3s, transform 0.3s;
                max-width: 360px;
            }
            .lp-ticker.show { opacity: 1; transform: translateY(0); }
            .lp-ticker-dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; flex-shrink: 0; }
            .lp-ticker-time { font-size: 10px; color: #888; margin-left: auto; white-space: nowrap; }

            /* ── Mobile ── */
            @media (max-width: 768px) {
                .lp-hero { padding: 60px 20px 36px; }
                .lp-h1 { font-size: 34px; letter-spacing: -1px; }
                .lp-sub { font-size: 16px; margin-bottom: 28px; }
                .lp-cta-row { flex-direction: column; align-items: stretch; }
                .lp-cta-primary, .lp-cta-secondary { width: 100%; text-align: center; }
                .lp-cards { grid-template-columns: 1fr; }
                .lp-steps { grid-template-columns: repeat(2, 1fr); gap: 20px; }
                .lp-bottom-h2 { font-size: 28px; }
                .lp-sticky { display: block; }
                .lp-footer { padding-bottom: 80px; }
                .lp-ticker { display: none !important; }
                .lp-trust-text { padding: 20px; font-size: 14px; }
                .lp-quote { font-size: 16px; }
            }
        </style>

        <div class="lp">
            <!-- ═══ HERO ═══ -->
            <div class="lp-hero">
                <h1 class="lp-h1">Pick a goal.<br><strong>Put money behind it.</strong></h1>
                <p class="lp-sub">
                    Hit your target and get paid. Miss it and lose the contract. 
                    Collateral verifies the result automatically.
                </p>
                <div class="lp-cta-row">
                    <button class="lp-cta-primary" id="lp-hero-cta" onclick="window.app.openAccessModal()">
                        Create Your First Contract
                    </button>
                    <button class="lp-cta-secondary" id="lp-see-examples" onclick="document.getElementById('lp-example-section').scrollIntoView({behavior:'smooth'})">
                        See Example Contracts
                    </button>
                </div>
            </div>

            <!-- ═══ EXAMPLE CONTRACTS ═══ -->
            <div class="lp-examples" id="lp-example-section">
                <div class="lp-examples-tag">Example Contracts</div>
                <div class="lp-cards">
                    <!-- Card 1: Stripe -->
                    <div class="lp-card" onclick="window.app.openAccessModal(); if(window.trackEvent) window.trackEvent('example_contract_click', {contract:'stripe_revenue'});">
                        <div class="lp-card-platform">Stripe Revenue</div>
                        <div class="lp-card-target">Grow revenue by 20%</div>
                        <div class="lp-card-meta">
                            <div class="lp-card-row">
                                <span class="lp-card-label">Deadline</span>
                                <span class="lp-card-value">30 days</span>
                            </div>
                            <div class="lp-card-row">
                                <span class="lp-card-label">You lock</span>
                                <span class="lp-card-value">$500</span>
                            </div>
                            <div class="lp-card-row">
                                <span class="lp-card-label">You earn</span>
                                <span class="lp-card-value green">$1,250</span>
                            </div>
                        </div>
                        <button class="lp-card-cta">Start This Contract →</button>
                    </div>

                    <!-- Card 2: X -->
                    <div class="lp-card" onclick="window.app.openAccessModal(); if(window.trackEvent) window.trackEvent('example_contract_click', {contract:'x_followers'});">
                        <div class="lp-card-platform">X (Twitter)</div>
                        <div class="lp-card-target">Gain 1,000 followers</div>
                        <div class="lp-card-meta">
                            <div class="lp-card-row">
                                <span class="lp-card-label">Deadline</span>
                                <span class="lp-card-value">14 days</span>
                            </div>
                            <div class="lp-card-row">
                                <span class="lp-card-label">You lock</span>
                                <span class="lp-card-value">$250</span>
                            </div>
                            <div class="lp-card-row">
                                <span class="lp-card-label">You earn</span>
                                <span class="lp-card-value green">$625</span>
                            </div>
                        </div>
                        <button class="lp-card-cta">Start This Contract →</button>
                    </div>

                    <!-- Card 3: Shopify -->
                    <div class="lp-card" onclick="window.app.openAccessModal(); if(window.trackEvent) window.trackEvent('example_contract_click', {contract:'shopify_sales'});">
                        <div class="lp-card-platform">Shopify</div>
                        <div class="lp-card-target">Hit $5,000 in sales</div>
                        <div class="lp-card-meta">
                            <div class="lp-card-row">
                                <span class="lp-card-label">Deadline</span>
                                <span class="lp-card-value">30 days</span>
                            </div>
                            <div class="lp-card-row">
                                <span class="lp-card-label">You lock</span>
                                <span class="lp-card-value">$300</span>
                            </div>
                            <div class="lp-card-row">
                                <span class="lp-card-label">You earn</span>
                                <span class="lp-card-value green">$750</span>
                            </div>
                        </div>
                        <button class="lp-card-cta">Start This Contract →</button>
                    </div>
                </div>
            </div>

            <!-- ═══ HOW IT WORKS ═══ -->
            <div class="lp-how">
                <div class="lp-how-inner">
                    <div class="lp-how-tag">How It Works</div>
                    <div class="lp-steps">
                        <div class="lp-step" onclick="window.app.openAccessModal()">
                            <div class="lp-step-num">01</div>
                            <div class="lp-step-title">Pick a target</div>
                            <div class="lp-step-desc">Revenue, followers, sales — choose a real metric to hit.</div>
                        </div>
                        <div class="lp-step" onclick="window.app.openAccessModal()">
                            <div class="lp-step-num">02</div>
                            <div class="lp-step-title">Lock money</div>
                            <div class="lp-step-desc">Put $25 to $25,000 behind your goal. Real stakes.</div>
                        </div>
                        <div class="lp-step" onclick="window.app.openAccessModal()">
                            <div class="lp-step-num">03</div>
                            <div class="lp-step-title">Connect source</div>
                            <div class="lp-step-desc">Link Stripe, X, Shopify, or Amazon. We verify automatically.</div>
                        </div>
                        <div class="lp-step" onclick="window.app.openAccessModal()">
                            <div class="lp-step-num">04</div>
                            <div class="lp-step-title">Get paid</div>
                            <div class="lp-step-desc">Hit the target = payout. Miss it = you lose the contract.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ TRUST ═══ -->
            <div class="lp-trust">
                <div class="lp-trust-text">
                    <strong>No screenshots. No manual claims.</strong><br>
                    Results are checked automatically through your connected accounts. 
                    The protocol verifies everything — you just focus on hitting your number.
                </div>
            </div>

            <!-- ═══ TESTIMONIAL ═══ -->
            <div class="lp-quote-block">
                <div class="lp-quote">"I put $500 on myself to hit my revenue goal. No coach, no accountability partner — just me and a deadline. Crushed it in 11 days and walked away with $2,000. Best bet I ever made was on myself."</div>
                <div class="lp-quote-author">Beta Creator · Stripe Revenue Contract</div>
            </div>

            <!-- ═══ FAQ ═══ -->
            <div class="lp-faq">
                <div class="lp-faq-tag">Common Questions</div>
                <div class="lp-faq-item" id="lp-faq-1">
                    <div class="lp-faq-q">What happens if I miss my target?</div>
                    <div class="lp-faq-a">You lose the money you locked. That's the point — real consequences drive real performance.</div>
                </div>
                <div class="lp-faq-item" id="lp-faq-2">
                    <div class="lp-faq-q">How do you verify results?</div>
                    <div class="lp-faq-a">We connect directly to Stripe, X, Shopify, or Amazon via read-only OAuth. No screenshots, no self-reporting. Everything is verified automatically at deadline.</div>
                </div>
                <div class="lp-faq-item" id="lp-faq-3">
                    <div class="lp-faq-q">What's the minimum to start?</div>
                    <div class="lp-faq-a">$25. You can lock anywhere from $25 to $25,000 depending on how serious you are.</div>
                </div>
                <div class="lp-faq-item" id="lp-faq-4">
                    <div class="lp-faq-q">Is my data safe?</div>
                    <div class="lp-faq-a">We use read-only access. We never post, modify, or store raw data. Your accounts are yours.</div>
                </div>
                <div class="lp-faq-item" id="lp-faq-5">
                    <div class="lp-faq-q">How much can I earn?</div>
                    <div class="lp-faq-a">Up to 2.5x your locked amount, depending on the contract difficulty tier you choose.</div>
                </div>
            </div>

            <!-- ═══ BOTTOM CTA ═══ -->
            <div class="lp-bottom">
                <div class="lp-bottom-h2">Stop planning.<br>Start proving.</div>
                <div class="lp-bottom-sub">Free to sign up. Lock capital when you're ready.</div>
                <button class="lp-bottom-btn" onclick="window.app.openAccessModal(); if(window.trackEvent) window.trackEvent('bottom_cta_click');">
                    Create Your First Contract →
                </button>
            </div>

            <!-- ═══ STICKY MOBILE CTA ═══ -->
            <div class="lp-sticky">
                <button onclick="window.app.openAccessModal()">Create Your First Contract →</button>
            </div>

            <!-- ═══ TICKER ═══ -->
            <div class="lp-ticker" id="lp-ticker">
                <span class="lp-ticker-dot"></span>
                <span id="lp-ticker-text"></span>
                <span class="lp-ticker-time" id="lp-ticker-time"></span>
            </div>

            <!-- ═══ FOOTER ═══ -->
            <div class="lp-footer">
                Collateral.market · © 2026
            </div>
        </div>
    `;
}

export function initLanding() {
    // ── UTM PRESERVATION ──
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {};
    ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term'].forEach(key => {
        const val = urlParams.get(key);
        if (val) utmData[key] = val;
    });
    if (Object.keys(utmData).length > 0) {
        sessionStorage.setItem('collateral_utm', JSON.stringify(utmData));
    }

    // ── ANALYTICS: landing page view ──
    if (window.trackEvent) {
        window.trackEvent('landing_page_view', {
            source: utmData.utm_source || 'direct',
            campaign: utmData.utm_campaign || 'none',
            medium: utmData.utm_medium || 'none',
        });
    }

    // ── HERO CTA tracking ──
    const heroCta = document.getElementById('lp-hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', () => {
            if (window.trackEvent) window.trackEvent('hero_create_contract_click', utmData);
        });
    }

    // ── See Examples tracking ──
    const seeExamples = document.getElementById('lp-see-examples');
    if (seeExamples) {
        seeExamples.addEventListener('click', () => {
            if (window.trackEvent) window.trackEvent('see_examples_click');
        });
    }

    // ── FAQ accordion ──
    document.querySelectorAll('.lp-faq-item').forEach(item => {
        item.querySelector('.lp-faq-q').addEventListener('click', () => {
            item.classList.toggle('open');
        });
    });

    // ── LIVE TICKER ──
    const tickerMsgs = [
        { text: 'A creator just locked $300 on a revenue contract', time: '2 min ago' },
        { text: 'Rivalry settled — someone won $1,200 in X followers duel', time: '8 min ago' },
        { text: 'New Shopify sales contract created — $500 locked', time: '14 min ago' },
        { text: '$2,400 payout confirmed on a 30-day Stripe contract', time: '22 min ago' },
        { text: 'Creator hit 142% of their follower target', time: '31 min ago' },
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
    setTimeout(showTicker, 8000);
    setInterval(showTicker, 15000);

    // ── LIVE STATS (fetch real data) ──
    fetchLandingStats();
}

async function fetchLandingStats() {
    try {
        const res = await api.getRivalryStats();
        if (!res.ok || !res.stats) return;
        // Stats are available but we don't show them above fold anymore
        // They could be used for ticker messages or future sections
    } catch (err) {
        console.warn('[Landing] Stats fetch failed:', err.message);
    }
}
