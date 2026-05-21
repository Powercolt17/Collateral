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
                        <svg class="ln-logo" viewBox="0 0 119 125" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <clipPath id="ln-logo-clip">
                                    <path d="M 1.757812 0.640625 L 116.507812 0.640625 L 116.507812 109 L 1.757812 109 Z"/>
                                </clipPath>
                            </defs>
                            <g fill="currentColor">
                                <path d="M 59.636719 123.566406 L 34.3125 82.125 L 45.179688 75.484375 L 59.945312 99.648438 L 75.808594 75.144531 L 86.5 82.0625 Z"/>
                                <g clip-path="url(#ln-logo-clip)">
                                    <path d="M 83.375 108.589844 C 78.132812 108.589844 74.0625 105.5625 72.589844 104.464844 C 69.625 102.253906 65.089844 96.898438 59.710938 89.707031 C 54.09375 97.050781 49.230469 102.507812 45.828125 104.707031 C 43.800781 106.019531 37.617188 110.011719 30.75 107.859375 C 25.371094 106.171875 21.28125 101.164062 19.230469 93.765625 L 31.5 90.367188 C 32.472656 93.863281 33.890625 95.5 34.558594 95.710938 C 35.082031 95.875 36.269531 95.714844 38.914062 94.007812 C 41.449219 92.371094 45.957031 87.105469 51.953125 78.933594 C 36.53125 56.84375 17.695312 26.539062 7.785156 10.347656 L 1.855469 0.65625 L 116.726562 0.65625 L 111.03125 10.273438 C 101.410156 26.503906 83.089844 56.828125 67.550781 78.960938 C 73.308594 86.929688 77.773438 92.445312 80.199219 94.253906 C 82.171875 95.71875 83.105469 95.914062 83.53125 95.839844 C 84.265625 95.699219 85.976562 93.992188 87.429688 90.027344 L 99.386719 94.410156 C 96.464844 102.382812 91.820312 107.203125 85.96875 108.339844 C 85.074219 108.511719 84.210938 108.589844 83.375 108.589844 Z M 24.617188 13.390625 C 36.839844 33.121094 49.46875 52.792969 59.777344 67.863281 C 69.355469 53.875 81.28125 35.117188 94.335938 13.390625 Z M 24.617188 13.390625 "/>
                                </g>
                                <path d="M 11.75 12.0625 L 19.546875 1.992188 L 94.867188 60.308594 L 87.070312 70.378906 Z"/>
                                <path d="M 26.257812 60.371094 L 99.144531 2.046875 L 107.101562 11.992188 L 34.214844 70.316406 Z"/>
                                <path d="M 72.203125 104.148438 L 79.171875 93.378906 C 77.164062 91.507812 74.226562 87.941406 70.628906 83.144531 L 63.328125 94.421875 C 66.917969 98.964844 69.957031 102.359375 72.203125 104.148438 Z"/>
                                <path d="M 56.421875 93.882812 L 49.382812 82.371094 C 45.777344 87.117188 42.839844 90.570312 40.6875 92.5625 L 47.394531 103.539062 C 49.890625 101.503906 52.964844 98.152344 56.421875 93.882812 Z"/>
                                <path d="M 67.976562 55.589844 L 78.074219 63.410156 C 80.394531 59.875 82.722656 56.285156 85.019531 52.679688 L 74.90625 44.847656 C 72.519531 48.601562 70.203125 52.191406 67.976562 55.589844 Z"/>
                                <path d="M 44.90625 45.449219 L 34.894531 53.457031 C 37.226562 57.054688 39.578125 60.632812 41.914062 64.152344 L 51.914062 56.15625 C 49.640625 52.722656 47.292969 49.128906 44.90625 45.449219 Z"/>
                                <path d="M 60.039062 33.339844 L 49.808594 41.523438 L 60.167969 49.546875 L 70.398438 41.359375 Z"/>
                            </g>
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
