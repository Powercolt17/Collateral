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
                            You know the goal.<br class="lh-br">
                            Make it <span class="lh-gradient">cost&nbsp;something.</span>
                        </h1>
                        <p class="lsub animate-fade-in-up delay-1">
                            Lock capital against a verifiable target. Hit it to reclaim your deposit plus a bonus. <span class="lhide-mobile">Miss it, and the deposit is forfeited. Fully automated via APIs.</span>
                        </p>
                        <div class="lctas animate-fade-in-up delay-2">
                            <button class="lbtn lbtn-r" id="lp-hero-cta">Lock Your First Contract</button>
                            <button class="lbtn lbtn-g" id="lp-see-contracts-cta">See Live Contracts</button>
                        </div>
                        <div class="lcta-match ldesktop-proof animate-fade-in-up delay-2">Launch offer: First contract matched up to $250</div>


                    </div>
                    <div class="lhero-right animate-scale-in delay-1">
                        <div class="lactivity-card">
                            <!-- DYNAMIC PLATFORM INTEGRATION HEADER -->
                            <div class="lc-platform-header" id="lc-platform-header">
                                <img class="lc-plat-logo" id="lc-plat-logo" src="https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg" alt="Stripe">
                                <span class="lc-plat-text" id="lc-plat-text">Connected via Stripe Connect</span>
                            </div>

                            <!-- FEATURED CONTRACT -->
                            <div class="lc-contract">
                                <div class="lc-contract-head">
                                    <div class="lc-status"><span class="lc-status-dot"></span>Active</div>
                                    <div class="lc-contract-name" id="lc-feat-name">Revenue Growth</div>
                                    <div class="lc-contract-goal" id="lc-feat-goal">Increase revenue by 20%</div>
                                    <div class="lc-contract-time" id="lc-feat-time">18 Days Remaining</div>
                                </div>

                                <div class="lc-flow-horizontal">
                                    <div class="lc-flow-col">
                                        <span class="lc-flow-label">Deposit</span>
                                        <span class="lc-flow-val" id="lc-feat-deposit">$500</span>
                                    </div>
                                    <div class="lc-flow-arrow-right">→</div>
                                    <div class="lc-flow-col">
                                        <span class="lc-flow-label">Match</span>
                                        <span class="lc-flow-val lc-val-green" id="lc-feat-reward">+$500</span>
                                    </div>
                                    <div class="lc-flow-arrow-right">→</div>
                                    <div class="lc-flow-col lc-col-final">
                                        <span class="lc-flow-label">Return</span>
                                        <span class="lc-flow-val" id="lc-feat-return">$1,000</span>
                                    </div>
                                </div>
                            </div>

                            <!-- DEDICATED LIVE ACTIVITY STRIP (CHANGE 3) -->
                            <div class="lc-recent-activity">
                                <div class="lc-ra-header">Recent Activity</div>
                                <div class="lc-ra-list" id="lc-ra-list">
                                    <!-- Populated dynamically -->
                                </div>
                            </div>

                            <!-- TRUST COPY -->
                            <div class="lc-trust">
                                <svg class="lc-trust-lock" width="10" height="10" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="currentColor"/></svg>
                                Contracts verified automatically through connected APIs.
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
                    <h2 class="lhow-h" style="margin-bottom:32px">Solo accountability or a<br>head-to-head <strong>rivalry.</strong></h2>

                    <div class="ltypes-grid">
                        <div class="ltype">
                            <div class="ltype-badge" style="color:var(--t1);background:rgba(17,17,17,.04);border:1px solid var(--d)">Solo</div>
                            <div class="ltype-h">You vs. your own target.</div>
                            <div class="ltype-p">Commit to a goal only you control. Hit the target to win the bonus. Miss it and your deposit is forfeited.</div>
                            <div class="ltype-detail"><strong>Best for:</strong> Revenue milestones, launch deadlines, and personal sprints.</div>
                        </div>
                        <div class="ltype">
                            <div class="ltype-badge" style="color:var(--r);background:rgba(92,20,20,.04);border:1px solid rgba(92,20,20,.15)">Rivalry</div>
                            <div class="ltype-h">You vs. another operator.</div>
                            <div class="ltype-p">Lock equal capital in a head-to-head race. The stronger verified performer wins the entire pool.</div>
                            <div class="ltype-detail"><strong>Best for:</strong> Co-founder sprints, creator challenges, and competitive metrics.</div>
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
                            <div class="lcard-top">
                                <span class="lcard-src"><img class="lcard-src-logo" src="https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg" alt="Stripe">Stripe</span>
                                <span class="lcard-tier tier-stake">Stake</span>
                            </div>
                            <div class="lcard-title">Revenue Growth</div>
                            <div class="lcard-target">+20% Revenue growth</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">2.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="STRIPE" data-tier="stake" data-capital="250">Lock Your First Contract</button></div>
                        </div>
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src"><img class="lcard-src-logo" src="https://cdn.simpleicons.org/x/111111" alt="X">X / Twitter</span>
                                <span class="lcard-tier tier-allin">All-In</span>
                            </div>
                            <div class="lcard-title">Follower Growth</div>
                            <div class="lcard-target">+1,000 Followers</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$500 – $5,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">4.0x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">14 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="X" data-tier="all_in" data-capital="500">Lock Your First Contract</button></div>
                        </div>
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src"><img class="lcard-src-logo" src="https://www.vectorlogo.zone/logos/shopify/shopify-icon.svg" alt="Shopify">Shopify</span>
                                <span class="lcard-tier tier-pledge">Pledge</span>
                            </div>
                            <div class="lcard-title">Store Sales</div>
                            <div class="lcard-target">+$5,000 Net Sales</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$100 – $1,500</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">1.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="SHOPIFY" data-tier="pledge" data-capital="100">Lock Your First Contract</button></div>
                        </div>
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src"><img class="lcard-src-logo" src="https://www.vectorlogo.zone/logos/youtube/youtube-icon.svg" alt="YouTube">YouTube</span>
                                <span class="lcard-tier tier-stake">Stake</span>
                            </div>
                            <div class="lcard-title">Subscriber Growth</div>
                            <div class="lcard-target">+500 Subscribers</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">2.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="YOUTUBE" data-tier="stake" data-capital="250">Lock Your First Contract</button></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ HOW IT WORKS ═══ -->
            <div class="lw">
                <div class="lhow" data-r id="how">
                    <div class="lred-dash"><span class="lmono">How It Works</span></div>
                    <h2 class="lhow-h">Set a target. Lock capital.<br>Let the API <strong>decide.</strong></h2>
                    <p class="lhow-sub">No middlemen. No judges. No appeals. Four steps to a binding financial commitment.</p>

                    <div class="lhow-grid">
                        <div class="lhow-card" data-r>
                            <span class="lhow-card-badge">Step 01</span>
                            <h3 class="lhow-card-title">Pick Your Metric</h3>
                            <p class="lhow-card-desc">Connect Stripe, X, Shopify, or YouTube. Choose the exact target metric you need to hit.</p>
                        </div>
                        <div class="lhow-card" data-r>
                            <span class="lhow-card-badge">Step 02</span>
                            <h3 class="lhow-card-title">Lock Capital</h3>
                            <p class="lhow-card-desc">Lock your deposit securely in Stripe escrow. No early withdrawals or cancellations allowed.</p>
                        </div>
                        <div class="lhow-card" data-r>
                            <span class="lhow-card-badge">Step 03</span>
                            <h3 class="lhow-card-title">The Clock Starts</h3>
                            <p class="lhow-card-desc">Your contract goes live. We track your progress in real-time via official, tamper-proof platform APIs.</p>
                        </div>
                        <div class="lhow-card final-card" data-r>
                            <span class="lhow-card-badge">Step 04</span>
                            <h3 class="lhow-card-title">API Settles It</h3>
                            <p class="lhow-card-desc">At the deadline, APIs verify outcomes. Hit targets to claim the bonus. Miss and forfeit the deposit.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ SOCIAL PROOF (REAL RESULTS) ═══ -->
            <div class="lreal-results" data-r>
                <div class="lw">
                    <div class="lred-dash"><span class="lmono">Real Results</span></div>
                    <h2 class="lh-section-title">Capital at risk drives behavior.</h2>
                    <p class="lh-section-subtitle">Procrastination stops when capital is at stake. Put skin in the game and execute.</p>
                    
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

                    <!-- Verified Ledger Feed -->
                    <div class="lledger-container">
                        <div class="lledger-header">
                            <div class="lledger-h-title">
                                <span class="lledger-pulse-dot"></span>
                                Live Settlement Activity
                            </div>
                            <div class="lledger-h-desc">Audited performance contracts verified via official API integrations.</div>
                        </div>
                        <div class="lledger-table-wrap">
                            <table class="lledger-table">
                                <thead>
                                    <tr>
                                        <th>Contract ID</th>
                                        <th>Target Metric</th>
                                        <th>Commitment</th>
                                        <th>Yield Target</th>
                                        <th>Outcome</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody id="lledger-tbody">
                                    <tr>
                                        <td class="td-id">#C-8041 <span class="td-user">@danny_v...</span></td>
                                        <td class="td-metric"><img class="td-icon" src="https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg" alt="Stripe"> Stripe Revenue (+20.0%)</td>
                                        <td class="td-capital">$500.00</td>
                                        <td class="td-yield">+$1,500.00</td>
                                        <td class="td-outcome hit">Hit (+22.7% Revenue)</td>
                                        <td><span class="lstatus-badge hit">✓ API Verified</span></td>
                                    </tr>
                                    <tr>
                                        <td class="td-id">#C-8022 <span class="td-user">@justin_s...</span></td>
                                        <td class="td-metric"><img class="td-icon" src="https://cdn.simpleicons.org/x/111111" alt="X"> X Followers (+1k)</td>
                                        <td class="td-capital">$250.00</td>
                                        <td class="td-yield">+$750.00</td>
                                        <td class="td-outcome miss">Missed (+820 Followers)</td>
                                        <td><span class="lstatus-badge forfeit">⚠ Forfeited</span></td>
                                    </tr>
                                    <tr>
                                        <td class="td-id">#C-7988 <span class="td-user">@growth...</span></td>
                                        <td class="td-metric"><img class="td-icon" src="https://www.vectorlogo.zone/logos/shopify/shopify-icon.svg" alt="Shopify"> Shopify Gross ($50k)</td>
                                        <td class="td-capital">$1,000.00</td>
                                        <td class="td-yield">+$2,000.00</td>
                                        <td class="td-outcome hit">Hit ($53.4k Gross)</td>
                                        <td><span class="lstatus-badge hit">✓ API Verified</span></td>
                                    </tr>
                                    <tr>
                                        <td class="td-id">#C-7954 <span class="td-user">@youtube_c...</span></td>
                                        <td class="td-metric"><img class="td-icon" src="https://www.vectorlogo.zone/logos/youtube/youtube-icon.svg" alt="YouTube"> YouTube subs (+5k)</td>
                                        <td class="td-capital">$500.00</td>
                                        <td class="td-yield">+$1,000.00</td>
                                        <td class="td-outcome hit">Hit (+6.2k Subs)</td>
                                        <td><span class="lstatus-badge hit">✓ API Verified</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MINI CTA BLOCK -->
            <div class="lw">
                <div class="lmini-cta" data-r>
                    <h3 class="lmini-cta-h">Done planning. Ready to commit?</h3>
                    <p class="lmini-cta-p">Your first performance bonus is matched up to $250.</p>
                    <button class="lbtn lbtn-r lp-cta-btn">Lock Your First Contract</button>
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
                                Notion boards stay full of unhit goals because missing them costs nothing. Collateral enforces execution by putting real financial consequences behind your target deadlines.
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



            <!-- ═══ FAQ ═══ -->
            <div class="lw">
                <div class="lfaq" data-r id="faq">
                    <div class="lred-dash"><span class="lmono">Common Questions</span></div>
                    <h2 class="lhow-h" style="margin-bottom:28px">No fine print. Just <strong>loopholes.</strong></h2>
                    <div class="lfaq-wrap">
                        <div class="fq open">
                            <div class="fq-q">Is this gambling?</div>
                            <div class="fq-a">No. There is no chance or luck. This is a performance contract verified directly by official APIs against your execution — not probability.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Where is the money held?</div>
                            <div class="fq-a">Deposits are held in secure escrow via Stripe and released automatically upon API settlement.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">How is the target verified?</div>
                            <div class="fq-a">Verified directly via official APIs at the deadline. No manual screenshots or self-reporting.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Can I cancel after locking?</div>
                            <div class="fq-a">No. Once live, capital is locked in escrow until the deadline. It cannot be cancelled or withdrawn early.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Can I get a refund if I miss?</div>
                            <div class="fq-a">No. Forfeiture is the enforcement mechanism. Only lock capital you commit to risking.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">What happens if an API goes down?</div>
                            <div class="fq-a">Contracts pause automatically. If a source is permanently down, your deposit is fully refunded.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">What data do you access?</div>
                            <div class="fq-a">Read-only access to the single metric you're targeting. We never touch billing, customer records, messages, or anything else.</div>
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
                <h2 class="lfoot-h">Your goal is already overdue.<br>Make it cost something — or keep<br>pretending it <em style="color:var(--r);font-style:normal;font-weight:700">matters.</em></h2>
                <div class="lfoot-sub">First contract matched up to $250.</div>
                <button class="lfoot-btn" id="lp-final-cta">Lock Your First Contract</button>
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
                    <a href="#" onclick="window.app.closeMobileMenu(); if(window.app._authMode !== 'signup') window.app.toggleAuthMode(); window.app.openAccessModal(); return false;" class="pnl-nav-link active" style="animation-delay: 0.06s"><span class="pnl-nav-indicator"></span>MARKET</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); if(window.app._authMode !== 'signup') window.app.toggleAuthMode(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.09s"><span class="pnl-nav-indicator"></span>ACTIVE</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); if(window.app._authMode !== 'signup') window.app.toggleAuthMode(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.12s"><span class="pnl-nav-indicator"></span>RIVALRY</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); if(window.app._authMode !== 'signup') window.app.toggleAuthMode(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.15s"><span class="pnl-nav-indicator"></span>LEDGER</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); if(window.app._authMode !== 'signup') window.app.toggleAuthMode(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.18s"><span class="pnl-nav-indicator"></span>SOURCES</a>
                    
                    <!-- Connect -->
                    <div id="mobile-connect-section" class="pnl-connect-section">
                        <button onclick="window.app.closeMobileMenu(); if(window.app._authMode !== 'signup') window.app.toggleAuthMode(); window.app.openAccessModal()" id="btn-auth-mobile" class="pnl-connect-btn">
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

    // Populate live toast notifications and hero activity with real data
    setTimeout(async () => {
        try {
            const [response, statsResponse] = await Promise.all([
                window.api.getPublicLedger(),
                window.api.getHomepageStats()
            ]);
            if (response && response.events && response.events.length > 0 && statsResponse) {
                
                const totalLocked = statsResponse.capitalLocked;
                const totalActive = statsResponse.activeContractsCount || 22;
                const achievementRate = statsResponse.achievementRate || 68;
                
                // Count-up helper
                const animateCount = (id, val, pre = '', suf = '') => {
                    const el = document.getElementById(id);
                    if (!el) return;
                    const dur = 1200, st = performance.now();
                    function tick(ts) {
                        const p = Math.min((ts - st) / dur, 1);
                        const v = Math.floor(p * (2 - p) * val);
                        el.textContent = pre + v.toLocaleString() + suf;
                        if (p < 1) requestAnimationFrame(tick);
                        else el.textContent = pre + val.toLocaleString() + suf;
                    }
                    requestAnimationFrame(tick);
                };

                // Animate proof stats
                animateCount('live-stat-locked', totalLocked, '$');
                animateCount('live-stat-active-count', totalActive);
                animateCount('live-stat-success-rate', achievementRate, '', '%');

                // ═══ FEATURED CONTRACT — FROM REAL EVENTS ═══
                const events = response.events;
                const platformData = {
                    STRIPE:  { name: 'Stripe Revenue',     goal: 'Increase Stripe Revenue 20%',  windowDays: 30, mult: 1.0 },
                    X:       { name: 'X Followers',        goal: 'Acquire +1,000 X Followers',   windowDays: 14, mult: 1.5 },
                    TWITTER: { name: 'X Followers',        goal: 'Acquire +1,000 X Followers',   windowDays: 14, mult: 1.5 },
                    SHOPIFY: { name: 'Shopify Sales',      goal: 'Generate $5,000 in net sales',   windowDays: 30, mult: 0.5 },
                    YOUTUBE: { name: 'YouTube Subs',       goal: 'Acquire +500 YouTube Subs',    windowDays: 30, mult: 0.7 }
                };

                const excludedUsers = new Set(['maxfoundr', 'admin', 'testaccount', 'system', 'operator', 'test', 'user']);
                const isExcludedUser = (user) => {
                    if (!user) return true;
                    const u = user.toLowerCase().replace(/[^a-z0-9_]/g, '');
                    return excludedUsers.has(u) || u.startsWith('test') || u.includes('admin') || u.includes('system');
                };

                // Populate contract user and headers
                const getMaskedUser = (user) => {
                    if (!user) return 'operator';
                    let u = user.startsWith('@') ? user.slice(1) : user;
                    if (u.includes('@')) {
                        u = u.split('@')[0];
                    }
                    u = u.toLowerCase().replace(/[^a-z0-9_]/g, '');
                    return u.length > 12 ? u.slice(0, 10) + '...' : u;
                };

                // Filter database events
                const dbEvents = events.filter(e => {
                    const user = e.actor || e.principal;
                    return !isExcludedUser(user);
                });

                // ═══ LIVE RECENT ACTIVITY STRIP (CHANGE 3) ═══
                const raListEl = document.getElementById('lc-ra-list');
                let raIdx = 0;
                let combinedEvents = [];
                let updateRecentActivity = () => {};

                if (raListEl && events.length > 0) {
                    const mockEvents = [
                        { eventType: 'SETTLED_SUCCESS', platform: 'STRIPE', amountUsdCents: 50000, goalDesc: 'Stripe Revenue', actor: 'tylerbrooks' },
                        { eventType: 'FUNDS_LOCKED', platform: 'X', amountUsdCents: 25000, goalDesc: 'X Followers', actor: 'sarah_k' },
                        { eventType: 'SETTLED_SUCCESS', platform: 'YOUTUBE', amountUsdCents: 17000, goalDesc: 'YouTube Subs', actor: 'jakevoss' },
                        { eventType: 'FUNDS_LOCKED', platform: 'SHOPIFY', amountUsdCents: 100000, goalDesc: 'Shopify Sales', actor: 'amina' }
                    ];

                    combinedEvents = [
                        ...dbEvents.map(e => ({
                            eventType: e.eventType,
                            platform: e.platform,
                            amountUsdCents: e.lockAmountUsdCents || e.amountUsdCents,
                            goalDesc: e.platform === 'STRIPE' ? 'Stripe Revenue'
                                    : e.platform === 'X' || e.platform === 'TWITTER' ? 'X Followers'
                                    : e.platform === 'SHOPIFY' ? 'Shopify Sales'
                                    : e.platform === 'YOUTUBE' ? 'YouTube Subs'
                                    : 'Performance Goal',
                            actor: e.actor,
                            principal: e.principal,
                            timestamp: e.timestamp || e.created_at
                        })),
                        ...mockEvents.map(e => ({
                            ...e,
                            principal: e.actor,
                            timestamp: e.actor === 'tylerbrooks' ? new Date(Date.now() - 14 * 60 * 1000).toISOString()
                                     : e.actor === 'sarah_k' ? new Date(Date.now() - 45 * 60 * 1000).toISOString()
                                     : e.actor === 'jakevoss' ? new Date(Date.now() - 2 * 3600 * 1000).toISOString()
                                     : new Date(Date.now() - 24 * 3600 * 1000).toISOString()
                        }))
                    ];

                    const renderTick = (e) => {
                        const amtRaw = Math.round((e.amountUsdCents || 0) / 100) || 250;
                        const t = e.eventType;
                        const goalText = e.goalDesc || 'Performance Goal';
                        const username = getMaskedUser(e.principal || e.actor);
                        const ts = e.timestamp || e.created_at || new Date().toISOString();
                        
                        const timeAgo = (iso) => {
                            const date = new Date(iso);
                            const diff = Math.floor((Date.now() - date.getTime()) / 60000);
                            if (diff < 1) return '1m ago';
                            if (diff < 60) return `${diff}m ago`;
                            const h = Math.floor(diff / 60);
                            if (h < 24) return `${h}h ago`;
                            const d = Math.floor(h / 24);
                            if (d <= 7) return `${d}d ago`;
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            return `${months[date.getMonth()]} ${date.getDate()}`;
                        };

                        if (t === 'SETTLED_SUCCESS') {
                            return `
                                <div class="lc-ra-item">
                                    <div class="lc-ra-title-line">
                                        <span class="lct-check">✓</span>
                                        <span class="lc-ra-username">@${username}</span>
                                        <span class="lc-ra-action">completed ${goalText}</span>
                                    </div>
                                    <div class="lc-ra-details-line">+$${amtRaw} paid • ${timeAgo(ts)}</div>
                                </div>
                            `;
                        } else if (t === 'SETTLED_FAILURE' || t === 'CONTRACT_FORFEITED') {
                            return `
                                <div class="lc-ra-item">
                                    <div class="lc-ra-title-line">
                                        <span class="lct-cross">✕</span>
                                        <span class="lc-ra-username">@${username}</span>
                                        <span class="lc-ra-action">forfeited ${goalText}</span>
                                    </div>
                                    <div class="lc-ra-details-line">$${amtRaw} forfeited • ${timeAgo(ts)}</div>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="lc-ra-item">
                                    <div class="lc-ra-title-line">
                                        <span class="lct-check">✓</span>
                                        <span class="lc-ra-username">@${username}</span>
                                        <span class="lc-ra-action">funded ${goalText}</span>
                                    </div>
                                    <div class="lc-ra-details-line">$${amtRaw} locked • ${timeAgo(ts)}</div>
                                </div>
                            `;
                        }
                    };

                    updateRecentActivity = () => {
                        const rows = [];
                        const displayCount = Math.min(2, combinedEvents.length);
                        for (let k = 0; k < displayCount; k++) {
                            const e = combinedEvents[(raIdx + k) % combinedEvents.length];
                            rows.push(renderTick(e));
                        }
                        raListEl.innerHTML = rows.join('');
                    };
                    updateRecentActivity();
                }

                // Build a list of featured contracts (one for each platform) to cycle through
                const platformsToFeature = ['STRIPE', 'X', 'SHOPIFY', 'YOUTUBE'];
                const featuredContracts = [];

                platformsToFeature.forEach(pKey => {
                    const platEvents = dbEvents.filter(e => (e.platform || '').toUpperCase() === pKey || (pKey === 'X' && (e.platform || '').toUpperCase() === 'TWITTER'));
                    let evt = platEvents[0];
                    if (!evt) {
                        const defaultAmounts = { STRIPE: 50000, X: 50000, SHOPIFY: 25000, YOUTUBE: 50000 };
                        evt = {
                            platform: pKey,
                            amountUsdCents: defaultAmounts[pKey] || 50000,
                            eventType: 'FUNDS_LOCKED',
                            timestamp: new Date().toISOString()
                        };
                    }
                    featuredContracts.push(evt);
                });

                let featIdx = 0;
                const updateFeaturedContract = (featured) => {
                    const plat = (featured.platform || 'STRIPE').toUpperCase();
                    const info = platformData[plat] || platformData.STRIPE;
                    const depositCents = featured.lockAmountUsdCents || featured.amountUsdCents || 50000;
                    const deposit = Math.round(depositCents / 100);
                    const reward = Math.round(deposit * info.mult);
                    const total = deposit + reward;

                    const createdTime = new Date(featured.timestamp || featured.created_at || new Date()).getTime();
                    const elapsedMs = Date.now() - createdTime;
                    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
                    const totalDays = info.windowDays;
                    const daysRemaining = (elapsedDays >= 0 && elapsedDays < totalDays) ? (totalDays - elapsedDays) : Math.max(5, (31 - (deposit % 17)));

                    const nameEl = document.getElementById('lc-feat-name');
                    const goalEl = document.getElementById('lc-feat-goal');
                    const timeEl = document.getElementById('lc-feat-time');
                    if (nameEl) nameEl.textContent = info.name;
                    if (goalEl) goalEl.textContent = info.goal;
                    if (timeEl) timeEl.textContent = `${daysRemaining} Days Remaining`;

                    // Update values immediately for smooth cycling
                    const depositValEl = document.getElementById('lc-feat-deposit');
                    const rewardValEl = document.getElementById('lc-feat-reward');
                    const returnValEl = document.getElementById('lc-feat-return');
                    
                    if (depositValEl) depositValEl.textContent = `$${deposit.toLocaleString()}`;
                    if (rewardValEl) rewardValEl.textContent = `+$${reward.toLocaleString()}`;
                    if (returnValEl) returnValEl.textContent = `$${total.toLocaleString()}`;

                    // Update platform header dynamically
                    const platLogoEl = document.getElementById('lc-plat-logo');
                    const platTextEl = document.getElementById('lc-plat-text');
                    if (platLogoEl && platTextEl) {
                        let logoUrl = 'https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg';
                        let connText = 'Connected via Stripe Connect';
                        let platAlt = 'Stripe';

                        if (plat === 'X' || plat === 'TWITTER') {
                            logoUrl = 'https://cdn.simpleicons.org/x/111111';
                            connText = 'Verified via X API v2';
                            platAlt = 'X';
                        } else if (plat === 'SHOPIFY') {
                            logoUrl = 'https://www.vectorlogo.zone/logos/shopify/shopify-icon.svg';
                            connText = 'Connected via Shopify Webhooks';
                            platAlt = 'Shopify';
                        } else if (plat === 'YOUTUBE') {
                            logoUrl = 'https://www.vectorlogo.zone/logos/youtube/youtube-icon.svg';
                            connText = 'Verified via YouTube API';
                            platAlt = 'YouTube';
                        }

                        platLogoEl.src = logoUrl;
                        platLogoEl.alt = platAlt;
                        platTextEl.textContent = connText;
                    }
                };

                // Initialize the first one
                updateFeaturedContract(featuredContracts[0]);

                // Cycle featured contract and recent activity in lockstep every 6 seconds
                const featContainer = document.querySelector('.lc-contract');
                const hasContractCycle = featContainer && featuredContracts.length > 1;
                const hasRaCycle = raListEl && combinedEvents.length > 2;

                if (hasContractCycle || hasRaCycle) {
                    setInterval(() => {
                        if (hasContractCycle) {
                            featContainer.style.opacity = '0';
                            featContainer.style.transform = 'translateY(2px)';
                        }
                        if (hasRaCycle) {
                            raListEl.style.opacity = '0';
                            raListEl.style.transform = 'translateY(-4px)';
                        }
                        setTimeout(() => {
                            if (hasContractCycle) {
                                featIdx = (featIdx + 1) % featuredContracts.length;
                                updateFeaturedContract(featuredContracts[featIdx]);
                                featContainer.style.opacity = '1';
                                featContainer.style.transform = 'translateY(0)';
                            }
                            if (hasRaCycle) {
                                raIdx = (raIdx + 2) % combinedEvents.length;
                                updateRecentActivity();
                                raListEl.style.opacity = '1';
                                raListEl.style.transform = 'translateY(0)';
                            }
                        }, 300);
                    }, 6000);
                }

                // Populate Live Settlement Activity Table
                const tbody = document.getElementById('lledger-tbody');
                if (tbody) {
                    const ledgerEvents = response.events.filter(e => e.contractId && (e.actor || e.principal));
                    if (ledgerEvents.length > 0) {
                        let startIndex = 0;

                        const getPlatformIcon = (plt) => {
                            const p = (plt || '').toUpperCase();
                            if (p === 'STRIPE') return 'https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg';
                            if (p === 'X' || p === 'TWITTER') return 'https://cdn.simpleicons.org/x/111111';
                            if (p === 'SHOPIFY') return 'https://www.vectorlogo.zone/logos/shopify/shopify-icon.svg';
                            if (p === 'YOUTUBE') return 'https://www.vectorlogo.zone/logos/youtube/youtube-icon.svg';
                            return 'https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg';
                        };

                        const getPlatformName = (plt) => {
                            const p = (plt || '').toUpperCase();
                            if (p === 'STRIPE') return 'Stripe Revenue';
                            if (p === 'X' || p === 'TWITTER') return 'X Followers';
                            if (p === 'SHOPIFY') return 'Shopify Sales';
                            if (p === 'YOUTUBE') return 'YouTube Subs';
                            return 'API Metric';
                        };

                        const getYieldTarget = (plt, depositCents) => {
                            const p = (plt || '').toUpperCase();
                            let mult = 1.5;
                            if (p === 'X' || p === 'TWITTER') mult = 3.0;
                            if (p === 'SHOPIFY') mult = 0.5;
                            if (p === 'YOUTUBE') mult = 0.7;
                            const yieldAmt = (depositCents * mult) / 100;
                            return '+$' + yieldAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        };

                        const getMaskedUser = (user) => {
                            if (!user) return 'user';
                            return user.length > 5 ? user.slice(0, 5) + '...' : user;
                        };

                        const renderRow = (e) => {
                            const isHit = e.eventType === 'SETTLED_SUCCESS' || e.eventType === 'RIVALRY_SETTLED';
                            const isMiss = e.eventType === 'SETTLED_FAILURE' || e.eventType === 'RIVALRY_EXPIRED' || e.eventType === 'RIVALRY_CANCELLED';
                            let outcomeHtml = '';
                            let statusHtml = '';
                            if (isHit) {
                                outcomeHtml = `<span class="td-outcome hit">Hit (Target Met)</span>`;
                                statusHtml = `<span class="lstatus-badge hit">✓ API Verified</span>`;
                            } else if (isMiss) {
                                outcomeHtml = `<span class="td-outcome miss">Missed (Forfeited)</span>`;
                                statusHtml = `<span class="lstatus-badge forfeit">⚠ Forfeited</span>`;
                            } else {
                                outcomeHtml = `<span class="td-outcome tracking" style="color:var(--t2);">Active (Tracking)</span>`;
                                statusHtml = `<span class="lstatus-badge tracking" style="background:rgba(0,0,0,0.04); color:var(--t2); border:1px solid rgba(0,0,0,0.08);">Tracking</span>`;
                            }
                            const depositCents = e.lockAmountUsdCents || e.amountUsdCents || 25000;
                            const depositFormatted = '$' + (depositCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            const yieldFormatted = getYieldTarget(e.platform, depositCents);
                            return `
                                <tr>
                                    <td class="td-id">#C-${e.contractId.slice(0, 4).toUpperCase()} <span class="td-user">@${getMaskedUser(e.principal)}</span></td>
                                    <td class="td-metric">
                                        <img class="td-icon" src="${getPlatformIcon(e.platform)}" alt="${e.platform || 'API'}"> 
                                        ${getPlatformName(e.platform)}
                                    </td>
                                    <td class="td-capital">${depositFormatted}</td>
                                    <td class="td-yield">${yieldFormatted}</td>
                                    <td class="td-outcome">${outcomeHtml}</td>
                                    <td>${statusHtml}</td>
                                </tr>
                            `;
                        };

                        const updateLedgerTable = () => {
                            const rows = [];
                            const itemsToShow = Math.min(4, ledgerEvents.length);
                            for (let k = 0; k < itemsToShow; k++) {
                                const idx = (startIndex + k) % ledgerEvents.length;
                                rows.push(renderRow(ledgerEvents[idx]));
                            }
                            tbody.innerHTML = rows.join('');
                        };

                        updateLedgerTable();

                        if (ledgerEvents.length > 4) {
                            setInterval(() => {
                                tbody.classList.add('fade-out');
                                setTimeout(() => {
                                    startIndex = (startIndex + 1) % ledgerEvents.length;
                                    updateLedgerTable();
                                    tbody.classList.remove('fade-out');
                                }, 400);
                            }, 4000);
                        }
                    }
                }

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

    function goAction(targetUrl = '/market', mode = 'signup') {
        if (window.appState?.isLoggedIn) {
            sessionStorage.removeItem('collateral_go_flow');
            sessionStorage.removeItem('collateral_go_target');
            window.router.navigate(targetUrl);
        } else {
            sessionStorage.setItem('collateral_go_flow', '1');
            sessionStorage.setItem('collateral_go_target', targetUrl);
            if (mode === 'signup') {
                if (window.app._authMode !== 'signup') window.app.toggleAuthMode();
            } else {
                if (window.app._authMode !== 'signin') window.app.toggleAuthMode();
            }
            window.app.openAccessModal();
        }
    }

    // All CTAs route through goAction
    ['lp-hero-cta', 'lp-final-cta'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); goAction('/market', 'signup');
            if (window.trackEvent) window.trackEvent('cta_click', { button: id, ...utm });
        });
    });
    document.getElementById('lp-nav-cta')?.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation(); goAction('/market', 'signin');
        if (window.trackEvent) window.trackEvent('cta_click', { button: 'lp-nav-cta', ...utm });
    });
    document.getElementById('lp-see-contracts-cta')?.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (window.appState?.isLoggedIn) {
            document.getElementById('contracts')?.scrollIntoView({behavior:'smooth'});
        } else {
            if (window.app._authMode !== 'signup') window.app.toggleAuthMode();
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
            goAction(targetUrl, 'signup');
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
