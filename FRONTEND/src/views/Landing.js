// Landing Page — /go — Cold-traffic conversion page
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

export function renderLanding() {
    return `
        <style>${landingCSS}</style>
        <div class="lp">

            <!-- PROMO BAR -->
            <div class="lpromo-bar">
                Launch Offer — First contract match up to $250
            </div>

            <!-- NAV -->
            <nav class="ln">
                <div class="ln-in">
                    <a class="ln-brand" href="/">COLLATERAL</a>
                    <button class="ln-cta" id="lp-nav-cta">Start Contract</button>
                </div>
            </nav>

            <!-- ═══ HERO ═══ -->
            <div class="lw">
                <div class="lhero-grid" data-r>
                    <div class="lhero-left">
                        <h1 class="lh1">
                            <span class="lh-nobrk">Put money behind the goal</span><br class="lh-br">
                            <span class="lh-nobrk">you keep saying you'll <em>hit.</em></span>
                        </h1>
                        <p class="lsub">
                            Create a performance contract tied to real metrics — revenue, followers, views, sales, or launches. Hit the target and get paid. Miss it and lose the stake.
                        </p>
                        <div class="lctas">
                            <button class="lbtn lbtn-r" id="lp-hero-cta">Start Contract</button>
                            <button class="lbtn lbtn-g" onclick="document.getElementById('contracts').scrollIntoView({behavior:'smooth'})">See Live Contracts</button>
                        </div>
                        <div class="lcta-match">Create your first contract. We’ll match up to $250.</div>
                        <div class="ltrust-bar">Not gambling. No odds. No chance. Verified performance only.</div>
                    </div>
                    <div class="lhero-right">
                        <div class="lpreview-card">
                            <div class="lpcard-badge">Example Contract</div>
                            <div class="lpcard-src">Stripe Integration</div>
                            <div class="lpcard-title">Stripe Revenue Growth</div>
                            <div class="lpcard-row"><span class="k">Stake</span><span class="v">$250</span></div>
                            <div class="lpcard-row"><span class="k">Target</span><span class="v">+20% in 30 days</span></div>
                            <div class="lpcard-row"><span class="k">Source</span><span class="v">Stripe API</span></div>
                            <div class="lpcard-outcome">
                                <div class="lpcard-outcome-title">Outcome</div>
                                <div class="lpcard-outcome-item success"><span class="dot"></span> Hit target &rarr; get paid</div>
                                <div class="lpcard-outcome-item failure"><span class="dot"></span> Miss target &rarr; stake forfeited</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ LOGO CAROUSEL ═══ -->
            <div class="lmarquee">
                <div class="lmarquee-label"><span class="lmono">Verified via official APIs</span></div>
                <div class="lmarquee-track">
                    <div class="lmarquee-slide">
                        <img class="logo-stripe" src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" alt="Stripe">
                        <img class="logo-x" src="https://cdn.simpleicons.org/x/555555" alt="X">
                        <img class="logo-shopify" src="https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" alt="Shopify">
                        <img class="logo-youtube" src="https://www.vectorlogo.zone/logos/youtube/youtube-ar21.svg" alt="YouTube">
                        <img class="logo-stripe" src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" alt="Stripe">
                        <img class="logo-x" src="https://cdn.simpleicons.org/x/555555" alt="X">
                        <img class="logo-shopify" src="https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" alt="Shopify">
                        <img class="logo-youtube" src="https://www.vectorlogo.zone/logos/youtube/youtube-ar21.svg" alt="YouTube">
                    </div>
                    <div class="lmarquee-slide">
                        <img class="logo-stripe" src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" alt="Stripe">
                        <img class="logo-x" src="https://cdn.simpleicons.org/x/555555" alt="X">
                        <img class="logo-shopify" src="https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" alt="Shopify">
                        <img class="logo-youtube" src="https://www.vectorlogo.zone/logos/youtube/youtube-ar21.svg" alt="YouTube">
                        <img class="logo-stripe" src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" alt="Stripe">
                        <img class="logo-x" src="https://cdn.simpleicons.org/x/555555" alt="X">
                        <img class="logo-shopify" src="https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" alt="Shopify">
                        <img class="logo-youtube" src="https://www.vectorlogo.zone/logos/youtube/youtube-ar21.svg" alt="YouTube">
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

            <!-- MINI CTA BLOCK -->
            <div class="lw">
                <div class="lmini-cta" data-r>
                    <h3 class="lmini-cta-h">Ready to back your first goal?</h3>
                    <p class="lmini-cta-p">Create your first performance contract. We’ll match up to $250.</p>
                    <button class="lbtn lbtn-r lp-cta-btn">Start Contract</button>
                    <div class="lmini-cta-micro">No odds. No chance. Verified performance only.</div>
                </div>
            </div>

            <!-- ═══ CONTRACT TYPES ═══ -->
            <div class="lw">
                <div class="ltypes" data-r>
                    <div class="lred-dash"><span class="lmono">Contract Types</span></div>
                    <h2 class="lhow-h" style="margin-bottom:32px">Choose your <strong>contract type.</strong></h2>

                    <div class="ltypes-grid">
                        <div class="ltype">
                            <div class="ltype-badge" style="color:var(--t1);background:rgba(17,17,17,.04);border:1px solid var(--d)">Solo</div>
                            <div class="ltype-h">You vs. your target.</div>
                            <div class="ltype-p">Set a measurable target tied to a connected data source. Lock your stake. Hit the deadline target and receive the payout. Miss it, and the stake is forfeited.</div>
                            <div class="ltype-detail"><strong>Best for:</strong> Revenue goals, follower milestones, launch deadlines, sales targets.</div>
                        </div>
                        <div class="ltype">
                            <div class="ltype-badge" style="color:var(--r);background:rgba(92,20,20,.04);border:1px solid rgba(92,20,20,.15)">Rivalry</div>
                            <div class="ltype-h">You vs. another operator.</div>
                            <div class="ltype-p">Both participants lock equal stakes on the same metric. The operator with the strongest verified performance wins the pool.</div>
                            <div class="ltype-detail"><strong>Best for:</strong> Founder sprints, creator growth challenges, sales competitions, operator accountability.</div>
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
                    <p class="lhow-sub">Terms are locked before the contract starts. Settlement is based on connected source data.</p>

                    <div class="lex-box">
                        <div class="lex-head"><span class="lmono" style="color:var(--r);font-weight:700">Stripe Revenue — Stake Tier</span></div>
                        <div class="lex-row"><span class="k">You stake</span><span class="v">$500</span></div>
                        <div class="lex-row"><span class="k">Target</span><span class="v">+20% Stripe revenue in 30 days</span></div>
                        <div class="lex-row"><span class="k">Verified by</span><span class="v">Stripe API</span></div>
                        <div class="lex-row"><span class="k">If you hit</span><span class="v green">Payout released</span></div>
                        <div class="lex-row"><span class="k">If you miss</span><span class="v red">Stake forfeited</span></div>
                    </div>
                </div>
            </div>

            <!-- CTA ROW -->
            <div class="lcta-row">
                <button class="lbtn lbtn-r lp-cta-btn">Start Contract</button>
                <div class="lcta-row-sub">Start your first performance contract. Match available up to $250.</div>
            </div>

            <!-- ═══ FAQ ═══ -->
            <div class="lw">
                <div class="lfaq" data-r id="faq">
                    <div class="lred-dash"><span class="lmono">Common Questions</span></div>
                    <h2 class="lhow-h" style="margin-bottom:28px">No fine print. Just <strong>answers.</strong></h2>
                    <div class="lfaq-wrap">
                        <div class="fq open">
                            <div class="fq-q">Is this gambling?</div>
                            <div class="fq-a">No. You stake against your own performance, verified by APIs you already use. No chance, no odds, no opponent required. The outcome is determined by your verified work.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Where is the money held?</div>
                            <div class="fq-a">Stakes are held in escrow via Stripe Connect. Collateral never touches your funds while the contract is active. Funds are released only at settlement.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">How is the target verified?</div>
                            <div class="fq-a">The exact metric is pulled directly from the platform API at the deadline. No screenshots, no self-reports, no human judgment. The API data is final.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Can I cancel after locking?</div>
                            <div class="fq-a">No. Once the stake is locked, the contract is live. Capital is locked from execution to settlement. You can cancel anytime before locking.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Can I get a refund if I miss?</div>
                            <div class="fq-a">No. The forfeit is the mechanism. Without consequences, it's just another goal tracker. Only stake what you can afford.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">What happens if an API goes down?</div>
                            <div class="fq-a">Contracts pause automatically. You don't forfeit due to a platform outage. If a source is permanently unavailable, stakes are fully refunded.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">What data do you access?</div>
                            <div class="fq-a">Read-only access to the single metric your contract measures. We never access payment details, customer data, or DMs.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Is this legal?</div>
                            <div class="fq-a">Yes. Available in the US, Canada, UK, and EU. This is a performance contract, not gambling. You stake against your own verifiable output.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ FINAL CTA ═══ -->
            <div class="lfoot">
                <h2 class="lfoot-h">Put money behind the goal<br>you keep saying you'll <em style="color:var(--r);font-style:normal;font-weight:700">hit.</em></h2>
                <div class="lfoot-sub">Create your first performance contract. We’ll match up to $250.</div>
                <button class="lfoot-btn" id="lp-final-cta">Start Contract</button>
                <div class="lfoot-micro">No odds. No chance. Verified performance only.</div>
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
