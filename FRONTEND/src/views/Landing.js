// Landing Page — /go — Cold-traffic conversion page
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

export function renderLanding() {
    return `
        <style>${landingCSS}</style>
        <style>@media(max-width:768px){.lp .ldesktop-proof{display:none!important}}</style>
        <div class="lp">

            <!-- LOADING BAR -->
            <div class="lloading-bar" id="lp-loading-bar"></div>

            <!-- NAV -->
            <nav class="ln">
                <div class="ln-in">
                    <a class="ln-brand" href="/">
                        <span class="logo-wordmark">Collateral</span>
                    </a>
                    <div style="display:flex; align-items:center;">
                        <button class="ln-cta" id="lp-nav-cta">Sign In</button>
                        <button class="ch-hamburger" id="mobile-menu-btn" aria-label="Menu" onclick="window.app.toggleMobileMenu()">
                            <div class="ch-hamburger-lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            <!-- ═══ HERO ═══ -->
            <div class="lhero-section">
            <div class="lw">
                <div class="lhero-grid">
                    <div class="lhero-left">

                        <h1 class="lh1 animate-fade-in-up">
                            Performance contracts<br class="lh-br">
                            for ambitious <span class="lh-gradient">goals.</span>
                        </h1>
                        <p class="lsub animate-fade-in-up delay-1">
                            Lock capital against a verifiable metric. Hit the target, reclaim your deposit plus a bonus. <span class="lhide-mobile">Miss it, forfeit the funds. Fully API-automated.</span>
                        </p>
                        <div class="lctas animate-fade-in-up delay-2">
                            <button class="lbtn lbtn-r" id="lp-hero-cta">Create Your Contract</button>
                            <button class="lbtn lbtn-g" id="lp-see-contracts-cta">See Live Contracts</button>
                        </div>
                        <div class="lcta-match ldesktop-proof animate-fade-in-up delay-2">First contract matched up to $250</div>
                        <div class="ltrust-bar ldesktop-proof animate-fade-in-up delay-3">API-verified • Funds in escrow • Auto-settled</div>


                    </div>
                    <div class="lhero-right animate-scale-in delay-1">
                        <div class="lpreview-container">
                            <!-- STAGE 1: TERMS -->
                            <div class="lpreview-card stage-card active" data-stage="1">
                                <div class="lpcard-header">
                                    <div class="lpcard-type">Performance Contract</div>
                                    <div class="lpcard-status"><span class="lpcard-status-dot"></span>Live</div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-title">Stripe Revenue Growth</div>
                                <div class="lpcard-terms">
                                    <div class="lpcard-term"><span class="lpcard-term-k">Deposit</span><span class="lpcard-term-v">$250.00</span></div>
                                    <div class="lpcard-term"><span class="lpcard-term-k">Target</span><span class="lpcard-term-v">+20% in 30 days</span></div>
                                    <div class="lpcard-term"><span class="lpcard-term-k">Bonus Yield</span><span class="lpcard-term-v lpcard-term-highlight">+$750.00</span></div>
                                    <div class="lpcard-term"><span class="lpcard-term-k">Verification</span><span class="lpcard-term-v">Stripe API</span></div>
                                </div>
                                <div class="lpcard-outcome">
                                    <div class="lpcard-outcome-row lpcard-outcome-hit"><span class="lpcard-outcome-icon">↑</span><span class="lpcard-outcome-text">Hit Target</span><span class="lpcard-outcome-result">+$1,000</span></div>
                                    <div class="lpcard-outcome-row lpcard-outcome-miss"><span class="lpcard-outcome-icon">↓</span><span class="lpcard-outcome-text">Miss Target</span><span class="lpcard-outcome-result">−$250</span></div>
                                </div>
                            </div>

                            <!-- STAGE 2: TRACKING -->
                            <div class="lpreview-card stage-card" data-stage="2">
                                <div class="lpcard-header">
                                    <div class="lpcard-type">Performance Contract</div>
                                    <div class="lpcard-status status-tracking"><span class="lpcard-status-dot dot-tracking"></span>Tracking</div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-title">Stripe Revenue Growth</div>
                                <div class="lpcard-body">
                                    <div class="lpcard-progress-container">
                                        <div class="lpcard-progress-labels">
                                            <span>Current: <strong>+13.4%</strong></span>
                                            <span>Target: <strong>+20.0%</strong></span>
                                        </div>
                                        <div class="lpcard-progress-bg">
                                            <div class="lpcard-progress-bar" style="width: 67%;"></div>
                                        </div>
                                    </div>
                                    <div class="lpcard-timer-container">
                                        <div class="lpcard-timer-label">Time Remaining</div>
                                        <div class="lpcard-timer-value">09 days : 14 hours : 22 min</div>
                                    </div>
                                </div>
                            </div>

                            <!-- STAGE 3: SETTLED -->
                            <div class="lpreview-card stage-card" data-stage="3">
                                <div class="lpcard-header">
                                    <div class="lpcard-type">Performance Contract</div>
                                    <div class="lpcard-status status-settled"><span class="lpcard-status-icon">✓</span>Settled</div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-title">Stripe Revenue Growth</div>
                                <div class="lpcard-settled-body">
                                    <div class="lpcard-settled-hero">
                                        <div class="lpcard-settled-badge">Target Hit</div>
                                        <div class="lpcard-settled-stats">Final: <strong>+22.7%</strong> vs +20% target</div>
                                    </div>
                                    <div class="lpcard-divider"></div>
                                    <div class="lpcard-settled-payout">
                                        <div class="lpcard-payout-total">
                                            <span>Total Payout</span>
                                            <span>+$1,000.00</span>
                                        </div>
                                        <div class="lpcard-payout-breakdown">
                                            <div class="lpcard-breakdown-row"><span>Deposit Returned</span><span>$250</span></div>
                                            <div class="lpcard-breakdown-row"><span>Bonus Yield</span><span>+$750</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- CONTROLS -->
                            <div class="lpreview-controls">
                                <span class="lpreview-dot active" data-stage="1"></span>
                                <span class="lpreview-dot" data-stage="2"></span>
                                <span class="lpreview-dot" data-stage="3"></span>
                            </div>
                        </div>
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

            <!-- ═══ SOCIAL PROOF (REAL RESULTS) ═══ -->
            <div class="lreal-results" data-r>
                <div class="lw">
                    <div class="lred-dash"><span class="lmono">Real Results</span></div>
                    <h2 class="lh-section-title">Capital at risk changes behavior.</h2>
                    <p class="lh-section-subtitle">When founders lock real money against their goals, they stop planning and start executing.</p>
                    
                    <!-- Stats Grid -->
                    <div class="lstats-grid">
                        <div class="lstat-card">
                            <div class="lstat-num"><span data-count="74">0</span>%</div>
                            <div class="lstat-label">of contracts settle successfully</div>
                            <div class="lstat-sub">Founders who lock capital outperform their own projections</div>
                        </div>
                        <div class="lstat-card">
                            <div class="lstat-num">$<span data-count="127">0</span>k</div>
                            <div class="lstat-label">total capital settled</div>
                            <div class="lstat-sub">Across revenue, follower, and subscriber contracts</div>
                        </div>
                        <div class="lstat-card">
                            <div class="lstat-num"><span data-count="18">0</span> days</div>
                            <div class="lstat-label">average time to target</div>
                            <div class="lstat-sub">Accountability compresses timelines.</div>
                        </div>
                    </div>

                    <!-- Testimonials Grid -->
                    <div class="ltestimonials-grid">
                        <div class="ltestimonial-card">
                            <div class="ltest-quote">"I'd been 'planning' to hit $10k MRR for six months. Locked $500 against it and hit the target in three weeks. The money made it real."</div>
                            <div class="ltest-profile">
                                <div class="ltest-avatar">S</div>
                                <div class="ltest-info">
                                    <div class="ltest-attribution">SaaS Founder</div>
                                    <div class="ltest-meta">Stripe Revenue Contract · $500 deposit · Target hit</div>
                                </div>
                            </div>
                        </div>
                        <div class="ltestimonial-card">
                            <div class="ltest-quote">"Doubled my subscriber count in 12 days. I was sitting on the same content strategy for months — the deposit was the missing variable."</div>
                            <div class="ltest-profile">
                                <div class="ltest-avatar">Y</div>
                                <div class="ltest-info">
                                    <div class="ltest-attribution">YouTube Creator</div>
                                    <div class="ltest-meta">YouTube Subscriber Contract · $250 deposit · Target hit</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

<!-- ═══ LIVE CONTRACT EXAMPLES ═══ -->
            <div class="lcontracts" id="contracts">
                <div class="lw">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
                        <div class="lred-dash" style="margin-bottom: 0;"><span class="lmono">Open Contracts</span></div>
                        
                        <!-- ═══ OPEN CONTRACTS STATS ═══ -->
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="width: 6px; height: 6px; background: #145c14; border-radius: 50%; box-shadow: 0 0 10px rgba(20,92,20,0.8);"></span>
                            <span style="font-family: 'Inter Tight', sans-serif; font-weight: 700; color: #145c14; font-size: 15px; letter-spacing: -0.2px;">$7.6k</span>
                            <span style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.05em;">Capital Locked</span>
                        </div>
                    </div>
                    <div class="lcards">
                        <div class="lcard lcard-popular" data-r>
                            <div class="lcard-popular-badge">Most Popular</div>
                            <div class="lcard-top">
                                <span class="lcard-src">Stripe</span>
                                <span class="lcard-tier tier-stake">Standard</span>
                            </div>
                            <div class="lcard-title">Revenue Growth</div>
                            <div class="lcard-target">+20% Revenue growth</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">1.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="STRIPE" data-tier="stake" data-capital="250">Draft Contract</button></div>
                        </div>
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src">X / Twitter</span>
                                <div style="display:flex; gap:6px;">
                                    <span class="lcard-tier tier-allin">High Yield</span>
                                    <span class="lcard-tier tier-3x-yield">3x Yield</span>
                                </div>
                            </div>
                            <div class="lcard-title">Follower Growth</div>
                            <div class="lcard-target">+1,000 Followers</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$500 – $5,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">3x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">14 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="X" data-tier="all_in" data-capital="500">Draft Contract</button></div>
                        </div>
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src">Shopify</span>
                                <span class="lcard-tier tier-pledge">Standard</span>
                            </div>
                            <div class="lcard-title">Store Sales</div>
                            <div class="lcard-target">+$5,000 Net Sales</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$100 – $1,500</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">0.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="SHOPIFY" data-tier="pledge" data-capital="100">Draft Contract</button></div>
                        </div>
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src">YouTube</span>
                                <span class="lcard-tier tier-stake">Standard</span>
                            </div>
                            <div class="lcard-title">Subscriber Growth</div>
                            <div class="lcard-target">+500 Subscribers</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">0.7x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="YOUTUBE" data-tier="stake" data-capital="250">Draft Contract</button></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ HOW IT WORKS ═══ -->
            <div class="lw">
                <div class="lhow" data-r id="how">
                    <div class="lred-dash"><span class="lmono">How It Works</span></div>
                    <h2 class="lh-section-title">Set a target. Lock capital.<br>Let performance <strong>decide.</strong></h2>
                    <p class="lhow-sub">Fully automated via APIs. No human bias. No exceptions.</p>

                    <div class="ltimeline-container">
                        <div class="ltimeline-line"></div>
                        
                        <div class="ltimeline-step" data-r>
                            <div class="ltimeline-marker">01</div>
                            <div class="ltimeline-content">
                                <h3 class="ltimeline-h">Choose Metric</h3>
                                <p class="ltimeline-p">Select your platform and define a verifiable business target.</p>
                            </div>
                        </div>

                        <div class="ltimeline-step" data-r>
                            <div class="ltimeline-marker">02</div>
                            <div class="ltimeline-content">
                                <h3 class="ltimeline-h">Lock Capital</h3>
                                <p class="ltimeline-p">Commit your deposit to escrow. Once live, the contract is financially binding.</p>
                            </div>
                        </div>

                        <div class="ltimeline-step" data-r>
                            <div class="ltimeline-marker">03</div>
                            <div class="ltimeline-content">
                                <h3 class="ltimeline-h">Track Progress</h3>
                                <p class="ltimeline-p">We monitor your performance directly via official API integrations.</p>
                            </div>
                        </div>

                        <div class="ltimeline-step final-step" data-r>
                            <div class="ltimeline-marker final-marker">04</div>
                            <div class="ltimeline-content">
                                <h3 class="ltimeline-h">Auto Settle</h3>
                                <p class="ltimeline-p">Hit your goal to unlock your deposit and bonus. Miss it and forfeit the capital.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MINI CTA BLOCK -->
            <div class="lw">
                <div class="lmini-cta" data-r>
                    <h3 class="lmini-cta-h">Ready to commit to your next milestone?</h3>
                    <p class="lmini-cta-p">We'll fund your first performance bonus up to $250.</p>
                    <button class="lbtn lbtn-r lp-cta-btn">Draft Contract</button>
                    <div class="lmini-cta-micro">Objective tracking. Verified business data only.</div>
                </div>
            </div>

            <!-- ═══ EMOTIONAL REFRAME (WHY IT WORKS) ═══ -->
            <div class="lemo-reframe" data-r>
                <div class="lw">
                    <div class="lred-dash"><span class="lmono">Why It Works</span></div>
                    <h2 class="lh-section-title">Accountability tools don't work. <br class="lhide-mobile">Financial exposure does.</h2>
                    
                    <div class="lemo-grid">
                        <div class="lemo-left">
                            <p class="lemo-body">
                                Every founder has a Notion board full of goals they haven't hit. The problem isn't strategy — it's that missing a target costs nothing. Collateral fixes that by attaching a real financial consequence to the goals you already know you should be hitting.
                            </p>
                        </div>
                        <div class="lemo-right">
                            <div class="lemo-comparison-card">
                                <div class="lemo-col without-collateral">
                                    <div class="lemo-col-header">Without Collateral</div>
                                    <ul class="lemo-list">
                                        <li class="lemo-item">Set a goal</li>
                                        <li class="lemo-item">Miss the deadline</li>
                                        <li class="lemo-item">Push it to next quarter</li>
                                        <li class="lemo-item">Repeat indefinitely</li>
                                    </ul>
                                </div>
                                <div class="lemo-divider"></div>
                                <div class="lemo-col with-collateral">
                                    <div class="lemo-col-header text-strong">With Collateral</div>
                                    <ul class="lemo-list">
                                        <li class="lemo-item text-strong">Set a goal</li>
                                        <li class="lemo-item text-strong">Lock $500 against it</li>
                                        <li class="lemo-item text-strong">Execute like it matters</li>
                                        <li class="lemo-item text-strong text-green">Hit target + collect $1,250</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <div class="ltype-p">Lock a deposit against your own goal. Hit the target to claim your bonus yield. Miss it, and the deposit is forfeited.</div>
                            <div class="ltype-detail"><strong>Best for:</strong> Revenue growth, follower milestones, and strict launch deadlines.</div>
                        </div>
                        <div class="ltype">
                            <div class="ltype-badge" style="color:var(--r);background:rgba(92,20,20,.04);border:1px solid rgba(92,20,20,.15)">Rivalry</div>
                            <div class="ltype-h">You vs. another operator.</div>
                            <div class="ltype-p">Lock equal capital deposits with another founder or creator. The strongest verified performance claims the entire escrow pool.</div>
                            <div class="ltype-detail"><strong>Best for:</strong> Co-founder sprints, growth challenges, and transparent duels.</div>
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
                            <div class="fq-a">No. This is a binding performance contract based strictly on your own business data, verified by official APIs. There are no odds, games of chance, or luck involved. The outcome depends entirely on your verifiable execution.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Where is the money held?</div>
                            <div class="fq-a">Deposits are held securely in escrow via Stripe Connect. Funds are released automatically only at settlement.</div>
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
                            <div class="fq-a">No. The forfeiture is the enforcement mechanism of the contract. Only commit capital that you are willing to put at risk for accountability.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">What happens if an API goes down?</div>
                            <div class="fq-a">Contracts pause automatically. If a source is permanently down, your deposit is fully refunded.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">What data do you access?</div>
                            <div class="fq-a">Read-only access to the specific metric you target. We never access billing, customer records, or DMs.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Is this legal?</div>
                            <div class="fq-a">Yes. Available in the US, CA, UK, and EU. This is a commercial performance contract based on skill, execution, and objective data.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ FINAL CTA ═══ -->
            <div class="lfoot">
                <div class="lfoot-overdue lmono" style="color:rgba(255,255,255,0.45); margin-bottom:20px; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Your goal is already overdue.</div>
                <h2 class="lfoot-h">Turn your next business goal<br>into a binding financial <em style="color:var(--r);font-style:normal;font-weight:700">commitment.</em></h2>
                <div class="lfoot-sub">First contract matched up to $250.</div>
                <button class="lfoot-btn" id="lp-final-cta">Draft Contract</button>
                <div class="lfoot-micro">Objective tracking. Verified business data only.</div>
                <div class="lfoot-line">Collateral.market · © 2026</div>
            </div>

            <!-- Landing Mobile Menu Overlay & Drawer -->
            <div id="mobile-menu-overlay" class="pnl-overlay" onclick="window.app.closeMobileMenu()"></div>
            <div id="mobile-menu" class="pnl-drawer">
                <div class="pnl-header">
                    <div class="pnl-header-left">
                        <span class="pnl-header-title">Menu</span>
                    </div>
                    <button onclick="window.app.closeMobileMenu()" class="pnl-close" aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="pnl-body">
                    <!-- Navigation -->
                    <div class="pnl-section-label">Navigation</div>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.app.openAccessModal(); return false;" class="pnl-nav-link active" style="animation-delay: 0.06s"><span class="pnl-nav-indicator"></span>MARKET</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.09s"><span class="pnl-nav-indicator"></span>ACTIVE</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.12s"><span class="pnl-nav-indicator"></span>RIVALRY</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.15s"><span class="pnl-nav-indicator"></span>LEDGER</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.18s"><span class="pnl-nav-indicator"></span>SOURCES</a>
                    
                    <!-- Connect -->
                    <div id="mobile-connect-section" class="pnl-connect-section">
                        <button onclick="window.app.closeMobileMenu(); window.app.openAccessModal()" id="btn-auth-mobile" class="pnl-connect-btn">
                            CONNECT
                        </button>
                    </div>
                </div>
                
                <div class="pnl-footer">
                    <div class="pnl-status">
                        <div class="pnl-status-dot"></div>
                        <span class="pnl-status-text">All systems operational</span>
                    </div>
                    <div class="pnl-meta">
                        <div class="pnl-meta-item">
                            <span class="pnl-meta-label">Protocol</span>
                            <span class="pnl-meta-value">v1.0</span>
                        </div>
                        <div class="pnl-meta-item">
                            <span class="pnl-meta-label">Network</span>
                            <span class="pnl-meta-value">Mainnet</span>
                        </div>
                        <div class="pnl-meta-item">
                            <span class="pnl-meta-label">Settlement</span>
                            <span class="pnl-meta-value">USD</span>
                        </div>
                        <div class="pnl-meta-item">
                            <span class="pnl-meta-label">Uptime</span>
                            <span class="pnl-meta-value">99.9%</span>
                        </div>
                    </div>
                    <div class="pnl-legal">
                        <a href="/terms" onclick="window.app.closeMobileMenu()">Terms</a>
                        <a href="/docs" onclick="window.app.closeMobileMenu()">Docs</a>
                        <a href="https://x.com/collaboralcap" target="_blank">X / Twitter</a>
                    </div>
                </div>
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

    // Populate live toast notifications with real mock data
    setTimeout(async () => {
        try {
            const response = await window.api.getPublicLedger();
            if (response && response.events && response.events.length > 0) {
                let container = document.getElementById('l-toast-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'l-toast-container';
                    document.body.appendChild(container);
                }
                
                const timeAgo = (iso) => {
                    const diff = Math.floor((new Date() - new Date(iso)) / 60000);
                    if (diff < 1) return 'just now';
                    if (diff < 60) return `${diff}m ago`;
                    const h = Math.floor(diff / 60);
                    if (h < 24) return `${h}h ago`;
                    return `${Math.floor(h/24)}d ago`;
                };

                const formatAmt = (amt) => '$' + parseInt(amt, 10).toLocaleString();

                const recentEvents = response.events.slice(0, 10);
                let i = 0;
                
                const showToast = () => {
                    if (i >= recentEvents.length) i = 0;
                    const e = recentEvents[i];
                    i++;
                    
                    let amtClass = 'locked';
                    let amtPrefix = '';
                    let preAction = '@' + (e.principal || 'User');
                    let actionText = 'locked';
                    let amtRaw = (e.amountUsdCents || e.lockAmountUsdCents || 0) / 100;
                    
                    if (e.eventType === 'FUNDS_LOCKED' || e.eventType === 'EXECUTION_CONFIRMED' || e.eventType === 'CONTRACT_CREATED') {
                        actionText = `escrowed via ${e.platform || 'API'} oracle`;
                        amtPrefix = '';
                        amtClass = 'locked';
                    } else if (e.eventType === 'SETTLED_SUCCESS') {
                        actionText = `cleared settlement + yield`;
                        amtPrefix = '+';
                        amtClass = 'recovered';
                    } else if (e.eventType === 'SETTLED_FAILURE') {
                        actionText = `liquidated by ${e.platform || 'API'} oracle`;
                        amtPrefix = '-';
                        amtClass = 'liquidated';
                    }
                    
                    let displayAmt = formatAmt(amtRaw);

                    const toast = document.createElement('div');
                    toast.className = 'l-toast animate-slide-up';
                    toast.innerHTML = `<span class="lticker-time">${timeAgo(e.timestamp || e.created_at || new Date().toISOString())}</span> <span class="lticker-action">${preAction}</span> <span class="lticker-amt ${amtClass}">${amtPrefix}${displayAmt}</span> <span class="lticker-action">${actionText}</span>`;
                    
                    container.appendChild(toast);
                    
                    // Remove toast after 4.5 seconds
                    setTimeout(() => {
                        toast.classList.remove('animate-slide-up');
                        toast.classList.add('animate-slide-down');
                        setTimeout(() => toast.remove(), 500);
                    }, 4500);
                };
                
                showToast();
                setInterval(showToast, 6000);
            }
        } catch (err) {
            console.error('Failed to load ledger ticker data', err);
        }
    }, 100);

    const p = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source','utm_campaign','utm_medium','utm_content','utm_term'].forEach(k => { const v = p.get(k); if (v) utm[k] = v; });
    if (Object.keys(utm).length) sessionStorage.setItem('collateral_utm', JSON.stringify(utm));
    if (window.trackEvent) window.trackEvent('go_page_view', { source: utm.utm_source || 'direct', campaign: utm.utm_campaign || 'none' });

    function goAction(targetUrl = '/market') {
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
    document.getElementById('lp-see-contracts-cta')?.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (window.appState?.isLoggedIn) {
            document.getElementById('contracts')?.scrollIntoView({behavior:'smooth'});
        } else {
            window.app.openAccessModal();
        }
    });
    document.querySelectorAll('.lp-cta-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const source = btn.getAttribute('data-source');
            const tier = btn.getAttribute('data-tier');
            const capital = btn.getAttribute('data-capital');
            let targetUrl = '/market';
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

    // Hero Card Lifecycle auto-cycle & controls
    let currentStage = 1;
    let cardInterval;
    const totalStages = 3;

    function showStage(stageNum) {
        currentStage = stageNum;
        document.querySelectorAll('.stage-card').forEach(card => {
            if (parseInt(card.dataset.stage, 10) === stageNum) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        document.querySelectorAll('.lpreview-dot').forEach(dot => {
            if (parseInt(dot.dataset.stage, 10) === stageNum) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function startCycle() {
        cardInterval = setInterval(() => {
            let nextStage = currentStage + 1;
            if (nextStage > totalStages) nextStage = 1;
            showStage(nextStage);
        }, 4000);
    }

    // Attach click events to dots
    document.querySelectorAll('.lpreview-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(cardInterval);
            const selectedStage = parseInt(dot.dataset.stage, 10);
            showStage(selectedStage);
            startCycle(); // Restart cycle from selected stage
        });
    });

    // Start initial cycle
    startCycle();
}
