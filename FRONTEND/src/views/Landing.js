// Landing Page — /go — Cold-traffic conversion page
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

export function renderLanding() {
    return `
        <style>${landingCSS}</style>
        <div class="lp">

            <!-- LOADING BAR -->
            <div class="lloading-bar" id="lp-loading-bar"></div>

            <!-- PROMO BAR REMOVED -->

            <!-- NAV -->
            <nav class="ln">
                <div class="ln-in">
                    <a class="ln-brand" href="/">
                        <svg class="ln-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="45,5 10,40 20,40 20,60 10,60 45,95 45,67 28,50 45,33" fill="currentColor"/>
                            <rect x="40" y="40" width="20" height="20" fill="currentColor"/>
                            <polygon points="55,5 90,40 80,40 80,60 90,60 55,95 55,67 72,50 55,33" fill="currentColor"/>
                        </svg>
                        COLLATERAL
                    </a>
                    <button class="ln-cta" id="lp-nav-cta">Start Contract</button>
                </div>
            </nav>

            <!-- ═══ HERO ═══ -->
            <div class="lw">
                <div class="lhero-grid">
                    <div class="lhero-left">
                        <h1 class="lh1 animate-fade-in-up">
                            <span class="lh-nobrk">Put money behind the goal</span><br class="lh-br">
                            <span class="lh-nobrk">you keep saying you'll <em>hit.</em></span>
                        </h1>
                        <p class="lsub animate-fade-in-up delay-1">
                            Lock capital against your growth targets. Hit the target and get paid. Miss it and forfeit the stake. Verified by official APIs.
                        </p>
                        <div class="lctas animate-fade-in-up delay-2">
                            <button class="lbtn lbtn-r" id="lp-hero-cta">Start Contract</button>
                            <button class="lbtn lbtn-g" onclick="document.getElementById('contracts').scrollIntoView({behavior:'smooth'})">See Live Contracts</button>
                        </div>
                        <div class="lcta-match animate-fade-in-up delay-2">First contract match up to $250.</div>
                        <div class="ltrust-bar animate-fade-in-up delay-3">No odds. No gambling. Verified performance only.</div>
                    </div>
                    <div class="lhero-right animate-scale-in delay-1">
                        <div class="lpreview-card">
                            <div class="lpcard-header">
                                <div class="lpcard-type">Performance Contract</div>
                                <div class="lpcard-status"><span class="lpcard-status-dot"></span>Live</div>
                            </div>
                            <div class="lpcard-divider"></div>
                            <div class="lpcard-title">Stripe Revenue Growth</div>
                            <div class="lpcard-terms">
                                <div class="lpcard-term"><span class="lpcard-term-k">Stake</span><span class="lpcard-term-v">$250.00</span></div>
                                <div class="lpcard-term"><span class="lpcard-term-k">Target</span><span class="lpcard-term-v">+20% in 30 days</span></div>
                                <div class="lpcard-term"><span class="lpcard-term-k">Multiplier</span><span class="lpcard-term-v lpcard-term-highlight">4.0×</span></div>
                                <div class="lpcard-term"><span class="lpcard-term-k">Verification</span><span class="lpcard-term-v">Stripe API</span></div>
                            </div>
                            <div class="lpcard-outcome">
                                <div class="lpcard-outcome-row lpcard-outcome-hit"><span class="lpcard-outcome-icon">↑</span><span class="lpcard-outcome-text">Hit</span><span class="lpcard-outcome-result">+$1,000</span></div>
                                <div class="lpcard-outcome-row lpcard-outcome-miss"><span class="lpcard-outcome-icon">↓</span><span class="lpcard-outcome-text">Miss</span><span class="lpcard-outcome-result">−$250</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ SOCIAL PROOF STATS ═══ -->
            <div class="lstats">
                <div class="lstats-inner">
                    <div class="lstat">
                        <div class="lstat-val"><span data-count="4">0</span></div>
                        <div class="lstat-label">Platform Integrations</div>
                    </div>
                    <div class="lstat-sep"></div>
                    <div class="lstat">
                        <div class="lstat-val"><span data-count="340">0</span>+</div>
                        <div class="lstat-label">Contracts Executed</div>
                    </div>
                    <div class="lstat-sep"></div>
                    <div class="lstat">
                        <div class="lstat-val"><span data-count="98">0</span>%</div>
                        <div class="lstat-label">Settlement Success</div>
                    </div>
                    <div class="lstat-sep"></div>
                    <div class="lstat">
                        <div class="lstat-val">Stripe</div>
                        <div class="lstat-label">Secured Escrow</div>
                    </div>
                </div>
            </div>

            <!-- ═══ LIVE CONTRACT EXAMPLES ═══ -->
            <div class="lcontracts" id="contracts">
                <div class="lw">
                    <div class="lred-dash"><span class="lmono">Open Contracts</span></div>
                    <div class="lcards">
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src">Stripe</span>
                                <span class="lcard-tier tier-stake">Stake</span>
                            </div>
                            <div class="lcard-title">Revenue Growth</div>
                            <div class="lcard-target">+20% Revenue growth</div>
                            <div class="lcard-row"><span class="k">Stake</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Multiplier</span><span class="v">2.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="STRIPE" data-tier="stake" data-capital="250">Start Contract</button></div>
                        </div>
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src">X / Twitter</span>
                                <span class="lcard-tier tier-allin">All-In</span>
                            </div>
                            <div class="lcard-title">Follower Growth</div>
                            <div class="lcard-target">+1,000 Followers</div>
                            <div class="lcard-row"><span class="k">Stake</span><span class="v">$500 – $5,000</span></div>
                            <div class="lcard-row"><span class="k">Multiplier</span><span class="v">4x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">14 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="X" data-tier="all_in" data-capital="500">Start Contract</button></div>
                        </div>
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src">Shopify</span>
                                <span class="lcard-tier tier-pledge">Pledge</span>
                            </div>
                            <div class="lcard-title">Store Sales</div>
                            <div class="lcard-target">+$5,000 Net Sales</div>
                            <div class="lcard-row"><span class="k">Stake</span><span class="v">$100 – $1,500</span></div>
                            <div class="lcard-row"><span class="k">Multiplier</span><span class="v">1.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="SHOPIFY" data-tier="pledge" data-capital="100">Start Contract</button></div>
                        </div>
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src">YouTube</span>
                                <span class="lcard-tier tier-stake">Stake</span>
                            </div>
                            <div class="lcard-title">Subscriber Growth</div>
                            <div class="lcard-target">+500 Subscribers</div>
                            <div class="lcard-row"><span class="k">Stake</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Multiplier</span><span class="v">1.7x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="YOUTUBE" data-tier="stake" data-capital="250">Start Contract</button></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ LOGO CAROUSEL ═══ -->
            <div class="lmarquee" data-r>
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

            <!-- ═══ HOW IT WORKS ═══ -->
            <div class="lw">
                <div class="lhow" data-r id="how">
                    <div class="lred-dash"><span class="lmono">How It Works</span></div>
                    <h2 class="lhow-h">Set a target. Lock capital.<br>Let performance <strong>decide.</strong></h2>
                    <p class="lhow-sub">Fully automated via APIs. No human bias. No exceptions.</p>

                    <div class="lsteps">
                        <div class="lstep">
                            <div class="lstep-num">01</div>
                            <div class="lstep-h">Choose Metric</div>
                            <div class="lstep-p">Select your platform and define a verifiable target.</div>
                        </div>
                        <div class="lstep">
                            <div class="lstep-num">02</div>
                            <div class="lstep-h">Lock Stake</div>
                            <div class="lstep-p">Commit capital to escrow. Once live, terms are locked.</div>
                        </div>
                        <div class="lstep">
                            <div class="lstep-num">03</div>
                            <div class="lstep-h">Track Progress</div>
                            <div class="lstep-p">We monitor performance directly via official API integrations.</div>
                        </div>
                        <div class="lstep">
                            <div class="lstep-num">04</div>
                            <div class="lstep-h">Auto Settle</div>
                            <div class="lstep-p">Hit your goal and get paid. Miss it and forfeit the stake.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MINI CTA BLOCK -->
            <div class="lw">
                <div class="lmini-cta" data-r>
                    <h3 class="lmini-cta-h">Ready to back your first goal?</h3>
                    <p class="lmini-cta-p">We'll match your first contract up to $250.</p>
                    <button class="lbtn lbtn-r lp-cta-btn">Start Contract</button>
                    <div class="lmini-cta-micro">No odds. Verified performance only.</div>
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
                            <div class="ltype-p">Lock a stake against your own goal. Hit the target to claim your payout. Miss it, and the stake is forfeited.</div>
                            <div class="ltype-detail"><strong>Best for:</strong> Revenue growth, follower milestones, and launch deadlines.</div>
                        </div>
                        <div class="ltype">
                            <div class="ltype-badge" style="color:var(--r);background:rgba(92,20,20,.04);border:1px solid rgba(92,20,20,.15)">Rivalry</div>
                            <div class="ltype-h">You vs. another operator.</div>
                            <div class="ltype-p">Lock equal stakes with another founder or creator. The strongest verified performance wins the entire pool.</div>
                            <div class="ltype-detail"><strong>Best for:</strong> Co-founder sprints, growth challenges, and sales duels.</div>
                        </div>
                    </div>
                </div>
            </div>



            <!-- ═══ FAQ ═══ -->
            <div class="lw">
                <div class="lfaq" data-r id="faq">
                    <div class="lred-dash"><span class="lmono">Common Questions</span></div>
                    <h2 class="lhow-h" style="margin-bottom:28px">No fine print. Just <strong>answers.</strong></h2>
                    <div class="lfaq-wrap">
                        <div class="fq open">
                            <div class="fq-q">Is this gambling?</div>
                            <div class="fq-a">No. You stake against your own performance, verified by APIs. No odds, no luck. The outcome depends entirely on your work.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Where is the money held?</div>
                            <div class="fq-a">Stakes are held securely in escrow via Stripe Connect. Funds are released only at settlement.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">How is the target verified?</div>
                            <div class="fq-a">Directly via official APIs at the deadline. No screenshots, no self-reporting. The API data is objective and final.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Can I cancel after locking?</div>
                            <div class="fq-a">No. Once live, capital is locked from execution to settlement. You can cancel anytime before locking.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Can I get a refund if I miss?</div>
                            <div class="fq-a">No. Forfeiting is the commitment mechanism. Only stake what you can afford.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">What happens if an API goes down?</div>
                            <div class="fq-a">Contracts pause automatically. If a source is permanently down, your stake is fully refunded.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">What data do you access?</div>
                            <div class="fq-a">Read-only access to the specific metric you target. We never access billing, customer records, or DMs.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Is this legal?</div>
                            <div class="fq-a">Yes. Available in the US, CA, UK, and EU. This is a performance contract based on skill, not gambling.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ FINAL CTA ═══ -->
            <div class="lfoot">
                <h2 class="lfoot-h">Put money behind the goal<br>you keep saying you'll <em style="color:var(--r);font-style:normal;font-weight:700">hit.</em></h2>
                <div class="lfoot-sub">First contract match up to $250.</div>
                <button class="lfoot-btn" id="lp-final-cta">Start Contract</button>
                <div class="lfoot-micro">No odds. Verified performance only.</div>
                <div class="lfoot-line">Collateral.market · © 2026</div>
            </div>
        </div>
    `;
}

export function initLanding() {
    // Fade in page container
    setTimeout(() => {
        document.querySelector('.lp')?.classList.add('v');
    }, 50);

    // Animate progress loading bar
    const bar = document.getElementById('lp-loading-bar');
    if (bar) {
        bar.style.width = '30%';
        setTimeout(() => { bar.style.width = '70%'; }, 100);
        setTimeout(() => {
            bar.style.width = '100%';
            setTimeout(() => {
                bar.style.opacity = '0';
                setTimeout(() => { bar.style.display = 'none'; }, 300);
            }, 150);
        }, 450);
    }

    const p = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source','utm_campaign','utm_medium','utm_content','utm_term'].forEach(k => { const v = p.get(k); if (v) utm[k] = v; });
    if (Object.keys(utm).length) sessionStorage.setItem('collateral_utm', JSON.stringify(utm));
    if (window.trackEvent) window.trackEvent('go_page_view', { source: utm.utm_source || 'direct', campaign: utm.utm_campaign || 'none' });

    function goAction(targetUrl = '/contracts/execute') {
        if (window.appState?.isLoggedIn) {
            sessionStorage.removeItem('collateral_go_flow');
            sessionStorage.removeItem('collateral_go_target');
            window.router.navigate(targetUrl);
        } else {
            sessionStorage.setItem('collateral_go_flow', '1');
            sessionStorage.setItem('collateral_go_target', targetUrl);
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
            e.preventDefault(); e.stopPropagation();
            const source = btn.getAttribute('data-source');
            const tier = btn.getAttribute('data-tier');
            const capital = btn.getAttribute('data-capital');
            let targetUrl = '/contracts/execute';
            if (source && tier && capital) {
                targetUrl = `/contracts/execute?source=${source}&tier=${tier}&capital=${capital}`;
            }
            goAction(targetUrl);
            if (window.trackEvent) window.trackEvent('cta_click', { button: 'inline', source, tier, capital, ...utm });
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

    // Count-up animation for stats
    const countEls = document.querySelectorAll('[data-count]');
    if (countEls.length) {
        const countObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const target = parseInt(el.dataset.count, 10);
                    let current = 0;
                    const step = Math.max(1, Math.floor(target / 30));
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) { current = target; clearInterval(interval); }
                        el.textContent = current;
                    }, 40);
                    countObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        countEls.forEach(el => countObs.observe(el));
    }
}
