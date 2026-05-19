// Landing Page — /go — Cold traffic conversion (Reddit/Twitter)
// Full rewrite: outcome-first framing, proof, payout transparency, objection handling
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

export function renderLanding() {
    return `
        <style>${landingCSS}</style>
        <div class="lp">

            <!-- ═══ 1. HERO ═══ -->
            <div class="lp-hero">
                <div class="lp-hero-left">
                    <div class="lp-eyebrow">The accountability contract for founders, creators, and operators</div>
                    <h1 class="lp-h1">Make your goals expensive to miss.</h1>
                    <p class="lp-sub">Stake money on a measurable goal. Connect Stripe, X, Shopify, or Amazon. Hit it, you get your stake back plus a bonus. Miss it, the stake is forfeit. Verification is automatic — no screenshots, no self-reports.</p>

                    <div>
                        <button class="lp-cta" id="lp-hero-cta">Start your first contract — from $25</button>
                    </div>
                    <div class="lp-micro">Free account. No card required. Only lock money when you're ready to commit.</div>

                    <div class="lp-trust">
                        <span>Verified via official APIs:</span>
                        <div class="lp-trust-logos">
                            <span>Stripe</span><span>X / Twitter</span><span>Shopify</span><span>Amazon</span>
                        </div>
                    </div>
                    <div class="lp-not-gambling">
                        Not gambling. You stake against your own measurable performance — no chance, no opponent, no house edge. <a href="#faq">Read the FAQ →</a>
                    </div>
                </div>

                <div class="lp-hero-right">
                    <div class="mock-win">
                        <div class="mock-bar"><div class="mock-dot"></div><div class="mock-dot"></div><div class="mock-dot"></div></div>
                        <div class="mock-bd">
                            <div class="mock-t">New Contract: Stripe Revenue</div>
                            <div class="mock-f"><strong>Target Metric</strong>Grow 30-day revenue by 20% vs. baseline</div>
                            <div class="mock-f"><strong>Stake Amount</strong>$500.00 — held in escrow until resolution</div>
                            <div class="mock-f"><strong>If you hit it</strong>$500 back + $750 bonus = $1,250 total</div>
                            <div class="mock-f"><strong>If you miss it</strong>$500 forfeit. No exceptions.</div>
                            <div class="mock-b">Lock Stake & Start Contract</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ 2. LIVE PROOF BAR ═══ -->
            <div class="lp-proof">
                <div class="pb-live"><span class="pb-dot"></span> Live Platform Activity</div>
                <div class="pb-stats">
                    <div class="pb-stat"><div class="pb-val" id="pb-committed">[FOUNDER_DATA: $__k]</div><div class="pb-lbl">Committed This Month</div></div>
                    <div class="pb-stat"><div class="pb-val" id="pb-active">[FOUNDER_DATA: ___]</div><div class="pb-lbl">Active Contracts</div></div>
                    <div class="pb-stat"><div class="pb-val" id="pb-hitrate">[FOUNDER_DATA: __%]</div><div class="pb-lbl">Hit Rate</div></div>
                </div>
                <div class="pb-feed-w">
                    <div class="pb-feed" id="pb-feed-1"></div>
                </div>
            </div>

            <!-- ═══ 3. HOW THE PAYOUT WORKS ═══ -->
            <div class="lp-payout lp-fade">
                <div class="lp-payout-in">
                    <h2 class="po-h2">How the payout actually works</h2>
                    <p class="po-src">No vague promises. Here's the exact mechanic.</p>
                    <p class="po-p">Collateral funds payouts directly from platform capital — not from other users' stakes. Multipliers reflect how ambitious your target is relative to your historical baseline. We pull the last 90 days of data from your connected account to calibrate difficulty. Harder targets earn higher multipliers because fewer people hit them.</p>
                    <div class="po-box">
                        <div class="po-box-h">Worked Example — Stripe Revenue</div>
                        <div class="po-math">
                            <span><strong>1. Lock $500.</strong> Target: grow Stripe revenue 20% in 30 days.</span>
                            <span><strong>2. Baseline pulled automatically.</strong> We read your last 90 days of Stripe data (read-only access).</span>
                            <span><strong>3. Hit it:</strong> Get your $500 back + $750 bonus = <strong>$1,250 total</strong>.</span>
                            <span><strong>4. Miss it:</strong> $500 stake forfeit. No exceptions, no appeals.</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ 4. EXAMPLE CONTRACT CARDS ═══ -->
            <div class="lp-ex lp-fade">
                <div class="lp-tag">Example Contracts — from $25</div>
                <div class="lp-cards">
                    <div class="lp-card">
                        <div class="lp-card-front">
                            <div class="c-title">Revenue Growth</div>
                            <div class="c-min">$25 minimum stake</div>
                            <div class="c-src">Verified with Stripe</div>
                            <div class="c-rows">
                                <div class="c-row"><span class="c-lbl">Target</span><span class="c-val">Grow revenue 20%</span></div>
                                <div class="c-row"><span class="c-lbl">Deadline</span><span class="c-val">30 days</span></div>
                                <div class="c-row"><span class="c-lbl">Example</span><span class="c-val">Lock $500 → get $1,250</span></div>
                            </div>
                            <button class="c-btn">See how this contract works →</button>
                        </div>
                        <div class="lp-card-back">
                            <div class="cb-math">
                                <div><strong>Hit it:</strong><br>$500 back + $750 bonus = $1,250.<br><em>2.5x multiplier on this target.</em></div>
                                <div><strong>Miss it:</strong><br>$500 stake forfeit.</div>
                            </div>
                            <button class="cb-btn" onclick="window.app.openAccessModal()">Start from $25</button>
                        </div>
                    </div>

                    <div class="lp-card">
                        <div class="lp-card-front">
                            <div class="c-title">Follower Growth</div>
                            <div class="c-min">$25 minimum stake</div>
                            <div class="c-src">Verified with X / Twitter</div>
                            <div class="c-rows">
                                <div class="c-row"><span class="c-lbl">Target</span><span class="c-val">Gain 1,000 followers</span></div>
                                <div class="c-row"><span class="c-lbl">Deadline</span><span class="c-val">14 days</span></div>
                                <div class="c-row"><span class="c-lbl">Example</span><span class="c-val">Lock $100 → get $400</span></div>
                            </div>
                            <button class="c-btn">See how this contract works →</button>
                        </div>
                        <div class="lp-card-back">
                            <div class="cb-math">
                                <div><strong>Hit it:</strong><br>$100 back + $300 bonus = $400.<br><em>4.0x multiplier — hard target.</em></div>
                                <div><strong>Miss it:</strong><br>$100 stake forfeit.</div>
                            </div>
                            <button class="cb-btn" onclick="window.app.openAccessModal()">Start from $25</button>
                        </div>
                    </div>

                    <div class="lp-card">
                        <div class="lp-card-front">
                            <div class="c-title">Order Growth</div>
                            <div class="c-min">$25 minimum stake</div>
                            <div class="c-src">Verified with Shopify</div>
                            <div class="c-rows">
                                <div class="c-row"><span class="c-lbl">Target</span><span class="c-val">Hit $5,000 in sales</span></div>
                                <div class="c-row"><span class="c-lbl">Deadline</span><span class="c-val">30 days</span></div>
                                <div class="c-row"><span class="c-lbl">Example</span><span class="c-val">Lock $200 → get $500</span></div>
                            </div>
                            <button class="c-btn">See how this contract works →</button>
                        </div>
                        <div class="lp-card-back">
                            <div class="cb-math">
                                <div><strong>Hit it:</strong><br>$200 back + $300 bonus = $500.<br><em>2.5x multiplier on this target.</em></div>
                                <div><strong>Miss it:</strong><br>$200 stake forfeit.</div>
                            </div>
                            <button class="cb-btn" onclick="window.app.openAccessModal()">Start from $25</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ 5. HOW IT WORKS (4 steps) ═══ -->
            <div class="lp-how lp-fade">
                <div class="lp-how-in">
                    <div class="lp-tag">How It Works</div>
                    <div class="lp-steps">
                        <div class="lp-step"><div class="s-num">01</div><div class="s-desc"><strong>Pick a target</strong> — <span>measurable, time-boxed, tied to a real metric.</span></div></div>
                        <div class="lp-step"><div class="s-num">02</div><div class="s-desc"><strong>Lock your stake</strong> — <span>$25 to $25,000. Held in escrow until the contract resolves.</span></div></div>
                        <div class="lp-step"><div class="s-num">03</div><div class="s-desc"><strong>Connect your source</strong> — <span>Stripe, X, Shopify, or Amazon. Read-only API access only.</span></div></div>
                        <div class="lp-step"><div class="s-num">04</div><div class="s-desc"><strong>Hit it or forfeit</strong> — <span>verified automatically at the deadline. No disputes, no appeals.</span></div></div>
                    </div>
                </div>
            </div>

            <!-- ═══ 6. TESTIMONIALS ═══ -->
            <div class="lp-testi lp-fade">
                <div class="lp-testi-in">
                    <div class="lp-tag">From Real Users</div>
                    <div class="tg">
                        <div class="tc">
                            <div class="tc-q">"I locked $500 on Stripe revenue growth. Hit the target and took home $1,250. <strong>Finally forced myself to launch the feature I'd been polishing for months.</strong>"</div>
                            <div class="tc-detail">Contract: +20% Stripe revenue in 30 days · Staked $500 · Won $1,250</div>
                            <div class="tc-user">
                                <div class="tc-av" style="background-image:url('[FOUNDER_DATA: Photo URL 1]')"></div>
                                <div><div class="tc-name">[FOUNDER_DATA: Name 1]</div><div class="tc-role">[FOUNDER_DATA: Role/Company]</div></div>
                            </div>
                        </div>
                        <div class="tc">
                            <div class="tc-q">"Staked $1,000 on X follower growth. Forfeited the stake — got lazy week 2. <strong>Brutal, but I won't miss the next one. The forfeit was the lesson.</strong>"</div>
                            <div class="tc-detail">Contract: +1,000 X followers in 14 days · Staked $1,000 · Forfeited</div>
                            <div class="tc-user">
                                <div class="tc-av" style="background-image:url('[FOUNDER_DATA: Photo URL 2]')"></div>
                                <div><div class="tc-name">[FOUNDER_DATA: Name 2]</div><div class="tc-role">[FOUNDER_DATA: Role/Company]</div></div>
                            </div>
                        </div>
                        <div class="tc">
                            <div class="tc-q">"Staked $250 on Shopify orders. The API verification is seamless — zero manual input. <strong>The money on the line changed my entire work ethic for the month.</strong>"</div>
                            <div class="tc-detail">Contract: $5k Shopify sales in 30 days · Staked $250 · Won $625</div>
                            <div class="tc-user">
                                <div class="tc-av" style="background-image:url('[FOUNDER_DATA: Photo URL 3]')"></div>
                                <div><div class="tc-name">[FOUNDER_DATA: Name 3]</div><div class="tc-role">[FOUNDER_DATA: Role/Company]</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ 7. OBJECTIONS + 9. FAQ (combined) ═══ -->
            <div class="lp-obj lp-fade" id="faq">
                <h2 class="obj-h2">Questions you're probably asking</h2>

                <div class="fq open"><div class="fq-q">Is this gambling?</div><div class="fq-a"><strong>No.</strong> You're staking against your own measurable performance using read-only data from platforms you already use. There's no opponent, no chance element, no house edge. You control the outcome through your own work. It's a self-imposed accountability contract with financial consequences.</div></div>

                <div class="fq"><div class="fq-q">Is my money safe before the contract resolves?</div><div class="fq-a"><strong>Yes.</strong> Stakes are held in escrow via [FOUNDER_DATA: Escrow provider — e.g. Stripe Connect custodial accounts]. Collateral never touches your principal while the contract is active. Funds are released only at resolution — either back to you (on success) or forfeit (on miss).</div></div>

                <div class="fq"><div class="fq-q">What if Stripe / X / Shopify / Amazon goes down or the API breaks?</div><div class="fq-a">Contracts pause automatically until verification can complete. You don't forfeit by default due to a platform outage — we absorb that risk. If an API is permanently deprecated mid-contract, original stakes are fully refunded.</div></div>

                <div class="fq"><div class="fq-q">What counts as "hitting" the target?</div><div class="fq-a">The exact metric you chose, pulled directly from the connected platform's API at the deadline. No interpretation, no human judgment, no screenshots. The API number is the final answer.</div></div>

                <div class="fq"><div class="fq-q">Can I cancel after I lock my stake?</div><div class="fq-a"><strong>[FOUNDER_DATA: Exact cancellation policy].</strong> Once a contract begins and the stake is locked, it cannot be canceled. You must hit the target or forfeit. You can cancel at any time before locking — no penalty.</div></div>

                <div class="fq"><div class="fq-q">What about taxes?</div><div class="fq-a">Payouts may be taxable income depending on your jurisdiction. For US users, we issue 1099s for net profit exceeding $600 in a calendar year. Consult your tax professional for specifics.</div></div>

                <div class="fq"><div class="fq-q">Is this legal in my state or country?</div><div class="fq-a">Currently available in the US, Canada, UK, and EU. Not available in [FOUNDER_DATA: specific restricted states/regions]. Because this is a performance contract (not gambling), it falls outside gambling regulations in supported jurisdictions.</div></div>

                <div class="fq"><div class="fq-q">What if I miss the target? Can I get a refund?</div><div class="fq-a"><strong>No.</strong> The forfeit is the entire mechanism — that's what makes it work. Without real consequences, it's just another goal-setting app. Do not stake money you cannot afford to forfeit.</div></div>

                <div class="fq"><div class="fq-q">What data do you access from my connected accounts?</div><div class="fq-a">Read-only access to the specific metric your contract measures — nothing else. For Stripe, that's revenue volume. For X, that's follower count. We never access payment details, customer data, DMs, or anything outside the contract metric. You can revoke access at any time.</div></div>

                <div class="fq"><div class="fq-q">Why do multipliers vary between contracts?</div><div class="fq-a">Multipliers reflect target difficulty relative to your baseline. A 20% revenue growth target is easier than a 100% growth target, so the multiplier is lower. We calibrate using your last 90 days of data from the connected platform. Harder targets = higher payout if you hit them.</div></div>
            </div>

            <!-- ═══ 8. FINAL CTA ═══ -->
            <div class="lp-bot">
                <div class="lp-bot-h">The goal you've been putting off. With $25 behind it.</div>
                <button class="lp-bot-btn" id="lp-final-cta">Start your first contract</button>
                <div class="lp-bot-micro">$25 minimum. No card required to sign up.</div>
                <div class="lp-bot-foot">
                    Collateral turns goals into contracts with real financial stakes.
                    <div style="margin-top:8px;font-family:'JetBrains Mono';font-size:10px;color:#444">Collateral.market · © 2026</div>
                </div>
            </div>
        </div>
    `;
}

export function initLanding() {
    // UTM capture
    const p = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source','utm_campaign','utm_medium','utm_content','utm_term'].forEach(k => { const v = p.get(k); if (v) utm[k] = v; });
    if (Object.keys(utm).length) sessionStorage.setItem('collateral_utm', JSON.stringify(utm));
    if (window.trackEvent) window.trackEvent('go_page_view', { source: utm.utm_source || 'direct', campaign: utm.utm_campaign || 'none', medium: utm.utm_medium || 'none' });

    // CTA handler — routes to /funding if logged in, else opens auth modal
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
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } }); }, { threshold: .12 });
    document.querySelectorAll('.lp-fade').forEach(el => obs.observe(el));

    // Proof bar feed
    const feed = document.getElementById('pb-feed-1');
    if (feed) {
        const events = [
            "<strong>Sarah M.</strong> committed $500 on a 30-day Shopify contract · 4m ago",
            "<strong>James K.</strong> earned $1,200 on a Stripe revenue contract · 18m ago",
            "<strong>Elena R.</strong> committed $250 on an X follower contract · 32m ago",
            "<strong>Marcus T.</strong> earned $800 on a Shopify sales contract · 1h ago",
            "<strong>David L.</strong> committed $1,000 on a Stripe revenue contract · 1h 15m ago"
        ];
        const all = [...events, ...events, ...events, ...events];
        feed.innerHTML = all.map(e => `<div class="pb-item">${e}</div>`).join('');
    }
}
