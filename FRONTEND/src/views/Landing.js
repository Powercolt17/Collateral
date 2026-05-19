// Landing Page — /go — Cold-traffic conversion page
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

export function renderLanding() {
    return `
        <style>${landingCSS}</style>
        <div class="lp">

            <!-- NAV -->
            <nav class="ln">
                <div class="ln-in">
                    <a class="ln-brand" href="/">COLLATERAL</a>
                    <button class="ln-cta" id="lp-nav-cta">Start Contract</button>
                </div>
            </nav>

            <!-- ═══ HERO ═══ -->
            <div class="lw">
                <div class="lhero" data-r>
                    <h1 class="lh1">
                        Put money behind the goal<br>
                        you keep saying you'll <em>hit.</em>
                    </h1>
                    <p class="lsub">
                        Create a performance contract tied to real metrics — revenue, followers, views, sales, or launches. Hit the target and get paid. Miss it and lose the stake.
                    </p>
                    <div class="lctas">
                        <button class="lbtn lbtn-r" id="lp-hero-cta">Start Contract</button>
                        <button class="lbtn lbtn-g" onclick="document.getElementById('contracts').scrollIntoView({behavior:'smooth'})">See Live Contracts</button>
                    </div>
                </div>
            </div>

            <!-- ═══ LIVE CONTRACT EXAMPLES ═══ -->
            <div class="lcontracts" id="contracts">
                <div class="lw" data-r>
                    <div class="lred-dash"><span class="lmono">Open Contracts</span></div>
                    <div class="lcards">
                        <div class="lcard">
                            <div class="lcard-top">
                                <span class="lcard-src">Stripe</span>
                                <span class="lcard-tier tier-stake">Stake</span>
                            </div>
                            <div class="lcard-title">Revenue Growth</div>
                            <div class="lcard-target">Grow revenue 20% in 30 days</div>
                            <div class="lcard-row"><span class="k">Stake</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Multiplier</span><span class="v">2.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn">Start Contract</button></div>
                        </div>
                        <div class="lcard">
                            <div class="lcard-top">
                                <span class="lcard-src">X / Twitter</span>
                                <span class="lcard-tier tier-allin">All-In</span>
                            </div>
                            <div class="lcard-title">Follower Growth</div>
                            <div class="lcard-target">Gain 1,000 followers in 14 days</div>
                            <div class="lcard-row"><span class="k">Stake</span><span class="v">$500 – $5,000</span></div>
                            <div class="lcard-row"><span class="k">Multiplier</span><span class="v">4x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">14 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn">Start Contract</button></div>
                        </div>
                        <div class="lcard">
                            <div class="lcard-top">
                                <span class="lcard-src">Shopify</span>
                                <span class="lcard-tier tier-pledge">Pledge</span>
                            </div>
                            <div class="lcard-title">Store Sales</div>
                            <div class="lcard-target">Hit $5,000 net sales in 30 days</div>
                            <div class="lcard-row"><span class="k">Stake</span><span class="v">$100 – $1,500</span></div>
                            <div class="lcard-row"><span class="k">Multiplier</span><span class="v">1.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn">Start Contract</button></div>
                        </div>
                        <div class="lcard">
                            <div class="lcard-top">
                                <span class="lcard-src">YouTube</span>
                                <span class="lcard-tier tier-stake">Stake</span>
                            </div>
                            <div class="lcard-title">Subscriber Growth</div>
                            <div class="lcard-target">Gain 500 subscribers in 30 days</div>
                            <div class="lcard-row"><span class="k">Stake</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Multiplier</span><span class="v">1.7x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn">Start Contract</button></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ HOW IT WORKS ═══ -->
            <div class="lw">
                <div class="lhow" data-r id="how">
                    <div class="lred-dash"><span class="lmono">How It Works</span></div>
                    <h2 class="lhow-h">Set a target. Lock capital.<br>Let performance <strong>decide.</strong></h2>
                    <p class="lhow-sub">Every contract follows the same deterministic process. No human judgment. No appeals.</p>

                    <div class="lsteps">
                        <div class="lstep">
                            <div class="lstep-num">01</div>
                            <div class="lstep-h">Choose the metric</div>
                            <div class="lstep-p">Pick a verified target: revenue, followers, views, sales, launches, or growth.</div>
                        </div>
                        <div class="lstep">
                            <div class="lstep-num">02</div>
                            <div class="lstep-h">Lock the stake</div>
                            <div class="lstep-p">Commit capital before the clock starts. No backing out once the contract is live.</div>
                        </div>
                        <div class="lstep">
                            <div class="lstep-num">03</div>
                            <div class="lstep-h">Track performance</div>
                            <div class="lstep-p">Collateral monitors progress through connected sources like Stripe, X, Shopify, and YouTube.</div>
                        </div>
                        <div class="lstep">
                            <div class="lstep-num">04</div>
                            <div class="lstep-h">Settle automatically</div>
                            <div class="lstep-p">Hit the target and get paid. Miss it and the stake is forfeited. Final. No exceptions.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA ROW -->
            <div class="lcta-row"><button class="lbtn lbtn-r lp-cta-btn">Start Contract</button></div>

            <!-- ═══ VERIFIED SOURCES ═══ -->
            <div class="lsources">
                <div class="lsources-in">
                    <span class="lmono" style="color:var(--t2)">Verified via official APIs</span>
                    <span class="lsrc-logo">
                        <svg height="20" viewBox="0 0 60 25" fill="#444"><path d="M5 4.8C5 3.5 6.1 3 7.5 3c2.5 0 5.6 1.3 8.1 3.5V1.2C13.3.4 11 0 8.7 0 3.5 0 0 2.7 0 7.2c0 7 9.7 5.9 9.7 8.9 0 1.5-1.3 2-3.1 2-2.7 0-6.2-1.5-8.9-3.6v5.4C0 21.5 2.5 23 6.6 23c5.3 0 8-2.8 8-7.2C14.6 8.3 5 9.6 5 4.8zm14.3-4.5l-4.5.9v20.6h4.5V.3zm6.1 5.5l-.3-1.5h-4.2v17.5h4.5v-11.9c1.1-1.4 2.9-1.1 3.5-.9V4.3c-.6-.2-2.8-.7-3.5 1.5zm7.5-1.8c1.6 0 2.8.7 3.4 2.2l3.5-1.5C38.8 2.2 36.5.9 34 .9 28.2.9 24 5.6 24 11.8s4.2 10.9 10 10.9c2.6 0 4.8-1 6-3.3l-3.5-1.5c-.6 1.4-1.8 2.1-3.4 2.1-2.5 0-4.5-2-4.5-5.4v-1.5c0-3.3 2-5.3 4.5-5.3zM55.5 0c-1.7 0-2.8.8-3.5 1.8l-.2-1.5h-4.2v23.5l4.5-.9v-5.7c.7.6 1.7 1 2.9 1C59 18.2 62 14.8 62 9 62 3.6 59.1 0 55.5 0zm-1 14.5c-1.3 0-2-.5-2.5-1.2V7c.5-.7 1.2-1.3 2.5-1.3 2 0 3.3 2 3.3 4.4s-1.3 4.4-3.3 4.4z" transform="scale(0.95)"/></svg>
                    </span>
                    <span class="lsrc-logo">
                        <svg height="18" viewBox="0 0 24 24" fill="#444"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </span>
                    <span class="lsrc-logo">
                        <svg height="20" viewBox="0 0 109 124" fill="#444"><path d="M74.7 0L54.5 11.8 34.3 0 0 19.7v64.9l34.3 19.7 20.2-11.8 20.2 11.8 34.3-19.7V19.7L74.7 0zM68 46.2L54.5 54 41 46.2V30.5L54.5 22.7 68 30.5v15.7z" transform="scale(0.85)"/></svg>
                    </span>
                    <span class="lsrc-logo">
                        <svg height="18" viewBox="0 0 24 24" fill="#444"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.87.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>
                    </span>
                </div>
            </div>

            <!-- ═══ CONTRACT TYPES ═══ -->
            <div class="lw">
                <div class="ltypes" data-r>
                    <div class="lred-dash"><span class="lmono">Contract Types</span></div>
                    <h2 class="lhow-h" style="margin-bottom:32px">Two ways to <strong>compete.</strong></h2>

                    <div class="ltypes-grid">
                        <div class="ltype">
                            <div class="ltype-badge" style="color:var(--t1);background:rgba(17,17,17,.04);border:1px solid var(--d)">Solo</div>
                            <div class="ltype-h">You vs. your target.</div>
                            <div class="ltype-p">Set a measurable performance target tied to a connected data source. Lock your stake. If you hit the target by the deadline, you get your capital back plus a bonus. If you miss, the stake is forfeited.</div>
                            <div class="ltype-detail">Best for: Revenue goals, follower milestones, launch deadlines, sales targets. You compete against yourself.</div>
                        </div>
                        <div class="ltype">
                            <div class="ltype-badge" style="color:var(--r);background:rgba(92,20,20,.04);border:1px solid rgba(92,20,20,.15)">Rivalry</div>
                            <div class="ltype-h">You vs. another operator.</div>
                            <div class="ltype-p">Both participants lock equal stakes on the same metric. The one who outperforms the other takes the entire pot. Verified by the same connected data sources. Winner takes all.</div>
                            <div class="ltype-detail">Best for: Head-to-head growth sprints, competitive accountability, high-stakes challenges between founders or creators.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lw"><div class="lhr"></div></div>

            <!-- ═══ WORKED EXAMPLE ═══ -->
            <div class="lw">
                <div class="lex" data-r>
                    <div class="lred-dash"><span class="lmono">Payout Example</span></div>
                    <h2 class="lhow-h" style="margin-bottom:8px">How the money gets <strong>decided.</strong></h2>
                    <p class="lhow-sub">No vague promises. Here's the exact math.</p>

                    <div class="lex-box">
                        <div class="lex-head"><span class="lmono" style="color:var(--r);font-weight:700">Stripe Revenue — Stake Tier</span></div>
                        <div class="lex-row"><span class="k">You stake</span><span class="v">$500</span></div>
                        <div class="lex-row"><span class="k">Target</span><span class="v">Grow Stripe revenue 20% in 30 days</span></div>
                        <div class="lex-row"><span class="k">Baseline</span><span class="v">Pulled automatically via API (read-only)</span></div>
                        <div class="lex-row"><span class="k">Hit the target</span><span class="v green">$500 back + $750 bonus = $1,250</span></div>
                        <div class="lex-row"><span class="k">Miss the target</span><span class="v red">$500 forfeited. No refund.</span></div>
                    </div>

                    <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--d)">
                        <p class="lmono" style="line-height:1.6;max-width:520px">Payouts funded by platform capital. Multipliers reflect target difficulty vs. your baseline. Harder targets earn higher payouts.</p>
                    </div>
                </div>
            </div>

            <!-- CTA ROW -->
            <div class="lcta-row"><button class="lbtn lbtn-r lp-cta-btn">Back Your Goal</button></div>

            <!-- ═══ FAQ ═══ -->
            <div class="lw">
                <div class="lfaq" data-r id="faq">
                    <div class="lred-dash"><span class="lmono">Common Questions</span></div>
                    <h2 class="lhow-h" style="margin-bottom:28px">No fine print. Just <strong>answers.</strong></h2>
                    <div class="lfaq-wrap">
                        <div class="fq open"><div class="fq-q">Is this gambling?</div><div class="fq-a"><strong>No.</strong> You stake against your own performance, verified by APIs you already use. No chance, no odds, no opponent required, no house edge. The outcome is 100% determined by your own work.</div></div>
                        <div class="fq"><div class="fq-q">Where is the money held?</div><div class="fq-a">Stakes are held in escrow via <strong>Stripe Connect</strong>. Collateral never touches your funds while the contract is active. Funds are released only at settlement.</div></div>
                        <div class="fq"><div class="fq-q">What if an API goes down during my contract?</div><div class="fq-a">Contracts pause automatically. You don't forfeit due to a platform outage. If a source is permanently unavailable, stakes are fully refunded.</div></div>
                        <div class="fq"><div class="fq-q">How is the target verified?</div><div class="fq-a">The exact metric, pulled directly from the platform API at the deadline. No screenshots, no self-reports, no human judgment. The API number is the final answer.</div></div>
                        <div class="fq"><div class="fq-q">Can I cancel after locking?</div><div class="fq-a"><strong>No.</strong> Once the stake is locked, the contract is live. Capital is locked from execution to settlement. You can cancel anytime <em>before</em> locking.</div></div>
                        <div class="fq"><div class="fq-q">What data do you access?</div><div class="fq-a">Read-only access to the single metric your contract measures. We never access payment details, customer data, DMs, or anything outside the contract metric. Revoke anytime.</div></div>
                        <div class="fq"><div class="fq-q">Is this legal?</div><div class="fq-a">Available in the US, Canada, UK, and EU. This is a performance contract, not gambling. You stake against your own verifiable output, not against chance.</div></div>
                        <div class="fq"><div class="fq-q">Can I get a refund if I miss?</div><div class="fq-a"><strong>No.</strong> The forfeit is the mechanism. Without consequences, it's just another goal tracker. Only stake what you can afford to lose.</div></div>
                    </div>
                </div>
            </div>

            <!-- ═══ FINAL CTA ═══ -->
            <div class="lfoot">
                <h2 class="lfoot-h">Put money behind the goal<br>you keep saying you'll <em>hit.</em></h2>
                <div class="lfoot-sub">Free account. Lock capital only when you're ready.</div>
                <button class="lfoot-btn" id="lp-final-cta">Start Contract</button>
                <div class="lfoot-micro">Stripe · X · Shopify · YouTube</div>
                <div class="lfoot-line">Collateral.market · © 2026</div>
            </div>
        </div>
    `;
}

export function initLanding() {
    const p = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source','utm_campaign','utm_medium','utm_content','utm_term'].forEach(k => { const v = p.get(k); if (v) utm[k] = v; });
    if (Object.keys(utm).length) sessionStorage.setItem('collateral_utm', JSON.stringify(utm));
    if (window.trackEvent) window.trackEvent('go_page_view', { source: utm.utm_source || 'direct', campaign: utm.utm_campaign || 'none' });

    function goAction() {
        if (window.appState?.isLoggedIn) {
            sessionStorage.removeItem('collateral_go_flow');
            window.router.navigate('/funding');
        } else {
            window.app.openAccessModal();
        }
    }

    // All CTAs route through goAction
    ['lp-hero-cta', 'lp-final-cta', 'lp-nav-cta'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); goAction();
            if (window.trackEvent) window.trackEvent('cta_click', { button: id, ...utm });
        });
    });
    document.querySelectorAll('.lp-cta-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); goAction();
            if (window.trackEvent) window.trackEvent('cta_click', { button: 'inline', ...utm });
        });
    });

    // FAQ
    document.querySelectorAll('.fq').forEach(item => {
        item.querySelector('.fq-q')?.addEventListener('click', () => item.classList.toggle('open'));
    });

    // Scroll reveal
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.lp [data-r]').forEach(el => obs.observe(el));
}
