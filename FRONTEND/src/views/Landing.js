// Landing Page — /go — Institutional Design System
// Clean, structured, matches overview.html aesthetic
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

export function renderLanding() {
    return `
        <style>${landingCSS}</style>
        <div class="lp">
            <div class="lp-grid"></div>

            <div class="lp-wrap">
                <!-- ═══ HERO ═══ -->
                <div class="lp-hero" data-reveal>
                    <span class="lp-eyebrow">The accountability contract</span>
                    <h1 class="lp-h1">Make your goals<br>expensive to miss.</h1>
                    <p class="lp-sub">Stake money on a measurable goal. Connect Stripe, X, Shopify, or Amazon for verification. Hit it, get your stake back plus a bonus. Miss it, the stake is forfeit. Verified automatically.</p>

                    <div class="lp-cta-group" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
                        <button class="lp-cta" id="lp-hero-cta">Start your first contract — from $25</button>
                    </div>
                    <div class="lp-micro">Free account. No card required to sign up.</div>

                    <div class="lp-trust">
                        <span class="lp-trust-label">Verified via official APIs</span>
                        <span class="lp-trust-badge">Stripe</span>
                        <span class="lp-trust-badge">X</span>
                        <span class="lp-trust-badge">Shopify</span>
                        <span class="lp-trust-badge">Amazon</span>
                    </div>
                    <div class="lp-disclaimer">
                        Not gambling. You stake against your own measurable performance — no chance, no opponent. <a href="#faq">Read FAQ →</a>
                    </div>
                </div>
            </div>

            <div class="lp-divider"></div>

            <!-- ═══ HOW IT WORKS ═══ -->
            <div class="lp-wrap">
                <div class="lp-section" data-reveal>
                    <div class="lp-section-label">How It Works</div>
                    <div class="lp-steps">
                        <div class="lp-step">
                            <div class="lp-step-num">01</div>
                            <div class="lp-step-title">Pick a target</div>
                            <div class="lp-step-desc">Measurable, time-boxed, tied to a real metric from your business.</div>
                        </div>
                        <div class="lp-step">
                            <div class="lp-step-num">02</div>
                            <div class="lp-step-title">Lock your stake</div>
                            <div class="lp-step-desc">$25 to $25,000. Held in escrow via Stripe Connect until resolution.</div>
                        </div>
                        <div class="lp-step">
                            <div class="lp-step-num">03</div>
                            <div class="lp-step-title">Connect your source</div>
                            <div class="lp-step-desc">Stripe, X, Shopify, or Amazon. Read-only API access. Revoke anytime.</div>
                        </div>
                        <div class="lp-step">
                            <div class="lp-step-num">04</div>
                            <div class="lp-step-title">Hit it or forfeit</div>
                            <div class="lp-step-desc">Verified automatically at the deadline. No disputes, no appeals.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lp-divider"></div>

            <!-- ═══ PAYOUT MECHANIC ═══ -->
            <div class="lp-wrap">
                <div class="lp-section" data-reveal>
                    <div class="lp-section-label">How The Payout Works</div>
                    <p style="font-size:15px;color:var(--text-2);line-height:1.7;margin-bottom:28px;max-width:560px">
                        Collateral funds payouts from platform capital — not from other users. Multipliers reflect target difficulty vs. your baseline. We pull 90 days of data to calibrate. Harder targets earn higher payouts.
                    </p>
                    <div class="lp-example-box">
                        <div class="lp-example-label">Worked Example — Stripe Revenue</div>
                        <div class="lp-example-row"><span class="lbl">Your stake</span><span class="val">$500</span></div>
                        <div class="lp-example-row"><span class="lbl">Target</span><span class="val">+20% Stripe revenue in 30 days</span></div>
                        <div class="lp-example-row"><span class="lbl">Baseline</span><span class="val">Pulled automatically (read-only)</span></div>
                        <div class="lp-example-row"><span class="lbl">If you hit it</span><span class="val green">$500 back + $750 bonus = $1,250</span></div>
                        <div class="lp-example-row"><span class="lbl">If you miss it</span><span class="val red">$500 forfeit. No exceptions.</span></div>
                    </div>
                </div>
            </div>

            <div class="lp-divider"></div>

            <!-- ═══ EXAMPLE CONTRACTS ═══ -->
            <div class="lp-wrap">
                <div class="lp-section" data-reveal>
                    <div class="lp-section-label">Example Contracts</div>
                    <div class="lp-cards">
                        <div class="lp-card">
                            <div class="lp-card-provider">Stripe</div>
                            <div class="lp-card-title">Revenue Growth</div>
                            <div class="lp-card-min">From $25</div>
                            <div class="lp-card-row"><span class="lbl">Target</span><span class="val">+20% revenue</span></div>
                            <div class="lp-card-row"><span class="lbl">Window</span><span class="val">30 days</span></div>
                            <div class="lp-card-row"><span class="lbl">Example</span><span class="val">$500 → $1,250</span></div>
                            <button class="lp-card-cta" onclick="window.app.openAccessModal()">See contract details →</button>
                        </div>
                        <div class="lp-card">
                            <div class="lp-card-provider">X / Twitter</div>
                            <div class="lp-card-title">Follower Growth</div>
                            <div class="lp-card-min">From $25</div>
                            <div class="lp-card-row"><span class="lbl">Target</span><span class="val">+1,000 followers</span></div>
                            <div class="lp-card-row"><span class="lbl">Window</span><span class="val">14 days</span></div>
                            <div class="lp-card-row"><span class="lbl">Example</span><span class="val">$100 → $400</span></div>
                            <button class="lp-card-cta" onclick="window.app.openAccessModal()">See contract details →</button>
                        </div>
                        <div class="lp-card">
                            <div class="lp-card-provider">Shopify</div>
                            <div class="lp-card-title">Order Growth</div>
                            <div class="lp-card-min">From $25</div>
                            <div class="lp-card-row"><span class="lbl">Target</span><span class="val">$5,000 in sales</span></div>
                            <div class="lp-card-row"><span class="lbl">Window</span><span class="val">30 days</span></div>
                            <div class="lp-card-row"><span class="lbl">Example</span><span class="val">$200 → $500</span></div>
                            <button class="lp-card-cta" onclick="window.app.openAccessModal()">See contract details →</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lp-divider"></div>

            <!-- ═══ FAQ ═══ -->
            <div class="lp-wrap">
                <div class="lp-section" data-reveal id="faq">
                    <div class="lp-section-label">Questions You're Probably Asking</div>
                    <div class="lp-faq">
                        <div class="fq open"><div class="fq-q">Is this gambling?</div><div class="fq-a"><strong>No.</strong> You stake against your own measurable performance using read-only data from platforms you already use. There's no opponent, no chance element, no house edge. You control the outcome through your own work.</div></div>

                        <div class="fq"><div class="fq-q">Is my money safe before the contract resolves?</div><div class="fq-a"><strong>Yes.</strong> Stakes are held in escrow via Stripe Connect. Collateral never touches your principal while the contract is active. Funds release only at resolution — back to you on success, or forfeit on miss.</div></div>

                        <div class="fq"><div class="fq-q">What if the verification API breaks?</div><div class="fq-a">Contracts pause automatically until verification can complete. You don't forfeit due to a platform outage — we absorb that risk. If an API is permanently deprecated, stakes are fully refunded.</div></div>

                        <div class="fq"><div class="fq-q">What counts as hitting the target?</div><div class="fq-a">The exact metric you chose, pulled directly from the connected platform's API at the deadline. No interpretation, no human judgment, no screenshots. The API number is the final answer.</div></div>

                        <div class="fq"><div class="fq-q">Can I cancel after I lock?</div><div class="fq-a"><strong>No.</strong> Once a contract is executed and the stake is locked, it cannot be canceled or withdrawn. Capital is locked from execution until settlement. You can cancel at any time <em>before</em> locking — no penalty.</div></div>

                        <div class="fq"><div class="fq-q">What about taxes?</div><div class="fq-a">Payouts may be taxable income. For US users, we issue 1099s for net profit exceeding $600 per calendar year. Consult your tax professional for specifics.</div></div>

                        <div class="fq"><div class="fq-q">Is this legal?</div><div class="fq-a">Available in the US, Canada, UK, and EU. Because this is a performance contract — not gambling — it falls outside gambling regulations. You stake against your own verifiable performance, not against chance or other participants.</div></div>

                        <div class="fq"><div class="fq-q">Can I get a refund if I miss?</div><div class="fq-a"><strong>No.</strong> The forfeit is the mechanism. Without real consequences, it's just another goal-setting app. Do not stake money you cannot afford to forfeit.</div></div>

                        <div class="fq"><div class="fq-q">What data do you access?</div><div class="fq-a">Read-only access to the specific metric your contract measures — nothing else. We never access payment details, customer data, or DMs. You can revoke access at any time.</div></div>

                        <div class="fq"><div class="fq-q">Why do multipliers vary?</div><div class="fq-a">Multipliers reflect target difficulty relative to your baseline. We calibrate using your last 90 days of data. A 20% growth target is easier than 100%, so the multiplier is lower. Harder targets = higher payout.</div></div>
                    </div>
                </div>
            </div>

            <!-- ═══ FINAL CTA ═══ -->
            <div class="lp-final">
                <div class="lp-final-h">The goal you've been putting off.<br>With $25 behind it.</div>
                <div class="lp-final-sub">No card required to sign up. Lock money only when you're ready.</div>
                <button class="lp-final-btn" id="lp-final-cta">Start your first contract</button>
                <div class="lp-final-micro">$25 minimum. Verified via Stripe, X, Shopify, Amazon.</div>
                <div class="lp-final-foot">Collateral.market · © 2026</div>
            </div>
        </div>
    `;
}

export function initLanding() {
    // UTM
    const p = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source','utm_campaign','utm_medium','utm_content','utm_term'].forEach(k => { const v = p.get(k); if (v) utm[k] = v; });
    if (Object.keys(utm).length) sessionStorage.setItem('collateral_utm', JSON.stringify(utm));
    if (window.trackEvent) window.trackEvent('go_page_view', { source: utm.utm_source || 'direct', campaign: utm.utm_campaign || 'none', medium: utm.utm_medium || 'none' });

    function goAction() {
        if (window.appState?.isLoggedIn) {
            sessionStorage.removeItem('collateral_go_flow');
            window.router.navigate('/funding');
        } else {
            window.app.openAccessModal();
        }
    }

    document.getElementById('lp-hero-cta')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goAction(); if (window.trackEvent) window.trackEvent('hero_cta_click', utm); });
    document.getElementById('lp-final-cta')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goAction(); if (window.trackEvent) window.trackEvent('final_cta_click', { button_location: 'footer', ...utm }); });

    // FAQ accordion
    document.querySelectorAll('.fq').forEach(item => {
        item.querySelector('.fq-q')?.addEventListener('click', () => {
            item.classList.toggle('open');
            if (window.trackEvent && item.classList.contains('open')) window.trackEvent('faq_opened', { q: item.querySelector('.fq-q')?.textContent });
        });
    });

    // Scroll reveal
    const revealEls = document.querySelectorAll('.lp [data-reveal]');
    if (revealEls.length) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => obs.observe(el));
    }
}
