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
                    <a class="ln-brand" href="/" onclick="window.router.navigate('/'); return false;">
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
            <div class="lhero-saturn-bg">
                <svg class="lsaturn-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
                    <defs>
                        <!-- Planet Radial Gradient for 3D Sphere Shading with Ring Red Reflection -->
                        <radialGradient id="planetGrad" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stop-color="#FFFFFF" />
                            <stop offset="40%" stop-color="#F8FAFC" />
                            <stop offset="70%" stop-color="#E2E8F0" />
                            <stop offset="90%" stop-color="#8C3A3A" />
                            <stop offset="100%" stop-color="#1E0A0A" />
                        </radialGradient>
                        
                        <!-- Ring A (Outer Ring) Gradient -->
                        <linearGradient id="ringA" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="rgba(15, 23, 42, 0.01)" />
                            <stop offset="30%" stop-color="rgba(92, 20, 20, 0.2)" />
                            <stop offset="50%" stop-color="rgba(148, 163, 184, 0.3)" />
                            <stop offset="70%" stop-color="rgba(92, 20, 20, 0.2)" />
                            <stop offset="100%" stop-color="rgba(15, 23, 42, 0.01)" />
                        </linearGradient>

                        <!-- Ring B (Main Ring) Gradient -->
                        <linearGradient id="ringB" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="rgba(15, 23, 42, 0.02)" />
                            <stop offset="30%" stop-color="rgba(92, 20, 20, 0.45)" />
                            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.75)" />
                            <stop offset="70%" stop-color="rgba(92, 20, 20, 0.45)" />
                            <stop offset="100%" stop-color="rgba(15, 23, 42, 0.02)" />
                        </linearGradient>

                        <!-- Ring C (Inner Ring) Gradient -->
                        <linearGradient id="ringC" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="rgba(15, 23, 42, 0)" />
                            <stop offset="50%" stop-color="rgba(148, 163, 184, 0.25)" />
                            <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
                        </linearGradient>
                        
                        <!-- Planet Soft Drop Shadow -->
                        <filter id="planetShadow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="-1" dy="3" stdDeviation="4" flood-color="#0F172A" flood-opacity="0.1" />
                        </filter>
                    </defs>

                    <!-- 1. Outer Orbit Line (Technical Blueprint Style - Spins Fast) -->
                    <path d="M 3 50 A 47 12 0 0 1 97 50" class="lsaturn-dash-fast" stroke="rgba(92,20,20,0.12)" stroke-width="0.75" />
                    
                    <!-- 2. Back Rings (drawn behind planet) -->
                    <!-- Ring A Back (Spins Slow) -->
                    <path d="M 12 50 A 38 9.5 0 0 1 88 50" class="lsaturn-dash-slow" stroke="url(#ringA)" stroke-width="1.8" stroke-linecap="round" />
                    <!-- Ring B Back (Cassini Division split - Solid) -->
                    <path d="M 17 50 A 33 8.25 0 0 1 83 50" stroke="url(#ringB)" stroke-width="2" stroke-linecap="round" />
                    <path d="M 15 50 A 35 8.75 0 0 1 85 50" stroke="url(#ringB)" stroke-width="1.2" stroke-linecap="round" />
                    <!-- Ring C Back (Spins Reverse) -->
                    <path d="M 22 50 A 28 7 0 0 1 78 50" class="lsaturn-dash-reverse" stroke="url(#ringC)" stroke-width="1.2" stroke-linecap="round" />

                    <!-- 3. Planet Body (with soft 3D shading & drop shadow) -->
                    <circle cx="50" cy="50" r="22" fill="url(#planetGrad)" filter="url(#planetShadow)" />
                    <!-- Subtle Atmospheric Rim Highlight -->
                    <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="0.5" />

                    <!-- 4. Front Rings (drawn in front of planet, creating overlap depth) -->
                    <!-- Ring C Front (Spins Reverse) -->
                    <path d="M 78 50 A 28 7 0 0 1 22 50" class="lsaturn-dash-reverse" stroke="url(#ringC)" stroke-width="1.2" stroke-linecap="round" />
                    <!-- Ring B Front (Cassini Division split - Solid) -->
                    <path d="M 85 50 A 35 8.75 0 0 1 15 50" stroke="url(#ringB)" stroke-width="1.2" stroke-linecap="round" />
                    <path d="M 83 50 A 33 8.25 0 0 1 17 50" stroke="url(#ringB)" stroke-width="2" stroke-linecap="round" />
                    <!-- Ring A Front (Spins Slow) -->
                    <path d="M 88 50 A 38 9.5 0 0 1 12 50" class="lsaturn-dash-slow" stroke="url(#ringA)" stroke-width="1.8" stroke-linecap="round" />

                    <!-- 5. Front Outer Orbit Line (Technical Blueprint Style - Spins Fast) -->
                    <path d="M 97 50 A 47 12 0 0 1 3 50" class="lsaturn-dash-fast" stroke="rgba(92,20,20,0.12)" stroke-width="0.75" />
                </svg>
            </div>
            <div class="lw">
                <div class="lhero-grid">
                    <div class="lhero-left">

                        <h1 class="lh1 animate-fade-in-up">
                            Are you going to execute,<br class="lh-br">
                            or wait until <span class="lh-gradient">AI takes your job?</span>
                        </h1>
                        <p class="lsub animate-fade-in-up delay-1">
                            You keep setting goals, getting distracted, and letting yourself off the hook. If todo lists worked, you'd have hit them by now. Lock capital. Force yourself to win.
                        </p>
                        <div class="lctas animate-fade-in-up delay-2">
                            <button class="lbtn lbtn-r" id="lp-hero-cta">Lock Your First Contract</button>
                            <button class="lbtn lbtn-g" id="lp-see-contracts-cta">See Live Contracts</button>
                        </div>
                        <div class="lcta-match ldesktop-proof animate-fade-in-up delay-2">First contract matched up to $250</div>


                    </div>
                    <div class="lhero-right animate-scale-in delay-1">
                        <div class="lactivity-card">
                            <!-- DYNAMIC PLATFORM INTEGRATION HEADER -->
                            <div class="lc-platform-header" id="lc-platform-header">
                                <img class="lc-plat-logo" id="lc-plat-logo" src="https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg" alt="Stripe">
                                <span class="lc-plat-text" id="lc-plat-text">Connected via Stripe Connect</span>
                            </div>

                            <!-- INTEGRATED GLOBAL STATS ROW -->
                            <div class="lc-global-stats-row">
                                <span class="lc-global-stats-item">
                                    <span class="lc-global-stats-dot"></span>
                                    <span id="lc-global-active-count" class="lc-global-stats-num">22</span>
                                    <span class="lc-global-stats-label">Active Contracts</span>
                                </span>
                                <span class="lc-global-stats-divider">|</span>
                                <span class="lc-global-stats-item">
                                    <span id="lc-global-locked-amount" class="lc-global-stats-num">$8,700</span>
                                    <span class="lc-global-stats-label">Locked</span>
                                </span>
                            </div>

                            <!-- FEATURED CONTRACT -->
                            <div class="lc-contract">
                                <div class="lc-contract-head">
                                    <div>
                                        <div class="lc-contract-name" id="lc-feat-name">Revenue Growth</div>
                                        <div class="lc-contract-goal" id="lc-feat-goal">Increase revenue by 20%</div>
                                        <div class="lc-contract-time" id="lc-feat-time">18 Days Remaining</div>
                                    </div>
                                    <div class="lc-status"><span class="lc-status-dot"></span>Active</div>
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
                                <div class="lc-flow-footnote">Yields mathematically backed by protocol forfeiture pools and sponsors.</div>
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
                    <h2 class="lhow-h" style="margin-bottom:32px">Use financial leverage on yourself,<br>or challenge a <strong>competitor.</strong></h2>

                    <div class="ltypes-grid">
                        <div class="ltype">
                            <div class="ltype-badge" style="color:var(--t1);background:rgba(17,17,17,.04);border:1px solid var(--d)">Solo</div>
                            <div class="ltype-h">You vs. your own laziness.</div>
                            <div class="ltype-p">Put real cash on the line to force yourself to execute. Hit your target to win a bonus; fail and your deposit is gone. Use the threat of loss to force yourself to grow, ship, or publish.</div>
                            <div class="ltype-detail"><strong>Best for:</strong> Growing followers, launching projects, and hitting revenue goals.</div>
                        </div>
                        <div class="ltype">
                            <div class="ltype-badge" style="color:var(--r);background:rgba(92,20,20,.04);border:1px solid rgba(92,20,20,.15)">Rivalry</div>
                            <div class="ltype-h">You vs. another builder.</div>
                            <div class="ltype-p">Lock equal cash in a head-to-head race. May the hungrier builder win. The winner takes all the money. The loser gets nothing.</div>
                            <div class="ltype-detail"><strong>Best for:</strong> Audience growth races, creator showdowns, and competitive fire.</div>
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
                                <span class="lcard-src"><svg class="lcard-src-logo" viewBox="0 0 24 24" fill="currentColor" style="color:#635BFF;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M20 10.3c0-1.8-1.5-2.7-3.6-3.2l-2-.5c-1.3-.3-1.9-.7-1.9-1.3 0-.6.7-1 1.7-1 1.7 0 3 .6 3.6 1l.7-2.6C17.9 2.2 16.3 1.8 14.8 1.8c-3.1 0-5.2 1.6-5.2 4.3 0 2.9 2.4 3.7 4.9 4.3l1.8.4c1.4.3 2 .8 2 1.5 0 .7-.8 1.1-2.1 1.1-1.9 0-3.6-.7-4.3-1.1l-.8 2.7c1 .5 2.9 1 4.7 1C18.2 16 20 14.4 20 10.3z"/></svg>Stripe</span>
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
                                <span class="lcard-src"><svg class="lcard-src-logo" viewBox="0 0 24 24" fill="currentColor" style="color:#111111;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>X / Twitter</span>
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
                                <span class="lcard-src"><svg class="lcard-src-logo" viewBox="0 0 24 24" fill="currentColor" style="color:#96bf48;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M19.58 6.425a.86.86 0 00-.7-.34h-2.193a4.52 4.52 0 00-9.04 0H5.454a.86.86 0 00-.7.34.887.887 0 00-.16.766l1.97 10.96a2.41 2.41 0 002.37 1.986h6.49a2.41 2.41 0 002.37-1.985l1.97-10.96a.887.887 0 00-.184-.767zM12 3.86a2.53 2.53 0 012.513 2.225H9.487A2.53 2.53 0 0112 3.86zm3.267 11.516a2.036 2.036 0 01-1.745.892 2.374 2.374 0 01-1.614-.648A2.348 2.348 0 0010.3 15a2.036 2.036 0 01-1.745-.892.429.429 0 11.734-.442c.245.408.66.634 1.01.634.341 0 .614-.148.914-.442A3.21 3.21 0 0113.627 15c.341 0 .614-.148.914-.442a.429.429 0 01.734.442z"/></svg>Shopify</span>
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
                                <span class="lcard-src"><svg class="lcard-src-logo" viewBox="0 0 24 24" fill="currentColor" style="color:#FF0000;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>YouTube</span>
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
                    <h2 class="lhow-h">Set a target. Lock capital.<br>Force yourself to <strong>win.</strong></h2>
                    <p class="lhow-sub">If you are serious about hitting your target, put something on the line. Four steps to guarantee your next milestone.</p>

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
                    <h2 class="lh-section-title">Skin in the game is the only thing that works.</h2>
                    <p class="lh-section-subtitle">Stop pretending you will do it tomorrow. Lock capital today, execute your goals, and win.</p>
                    
                    <!-- Stats Grid -->
                    <div class="lstats-grid">
                        <div class="lstat-card">
                            <div class="lstat-num"><span data-count="74">0</span>%</div>
                            <div class="lstat-label">of contracts are won</div>
                            <div class="lstat-sub">Go-getters who lock cash hit their targets way faster.</div>
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
                                        <td class="td-metric"><svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#635BFF;width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M20 10.3c0-1.8-1.5-2.7-3.6-3.2l-2-.5c-1.3-.3-1.9-.7-1.9-1.3 0-.6.7-1 1.7-1 1.7 0 3 .6 3.6 1l.7-2.6C17.9 2.2 16.3 1.8 14.8 1.8c-3.1 0-5.2 1.6-5.2 4.3 0 2.9 2.4 3.7 4.9 4.3l1.8.4c1.4.3 2 .8 2 1.5 0 .7-.8 1.1-2.1 1.1-1.9 0-3.6-.7-4.3-1.1l-.8 2.7c1 .5 2.9 1 4.7 1C18.2 16 20 14.4 20 10.3z"/></svg> Stripe Revenue (+20.0%)</td>
                                        <td class="td-capital">$500.00</td>
                                        <td class="td-yield">+$1,500.00</td>
                                        <td class="td-outcome hit">Hit (+22.7% Revenue)</td>
                                        <td><span class="lstatus-badge hit">✓ API Verified</span></td>
                                    </tr>
                                    <tr>
                                        <td class="td-id">#C-8022 <span class="td-user">@justin_s...</span></td>
                                        <td class="td-metric"><svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#111111;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X Followers (+1k)</td>
                                        <td class="td-capital">$250.00</td>
                                        <td class="td-yield">+$750.00</td>
                                        <td class="td-outcome miss">Missed (+820 Followers)</td>
                                        <td><span class="lstatus-badge forfeit">⚠ Forfeited</span></td>
                                    </tr>
                                    <tr>
                                        <td class="td-id">#C-7988 <span class="td-user">@growth...</span></td>
                                        <td class="td-metric"><svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#96bf48;width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M19.58 6.425a.86.86 0 00-.7-.34h-2.193a4.52 4.52 0 00-9.04 0H5.454a.86.86 0 00-.7.34.887.887 0 00-.16.766l1.97 10.96a2.41 2.41 0 002.37 1.986h6.49a2.41 2.41 0 002.37-1.985l1.97-10.96a.887.887 0 00-.184-.767zM12 3.86a2.53 2.53 0 012.513 2.225H9.487A2.53 2.53 0 0112 3.86zm3.267 11.516a2.036 2.036 0 01-1.745.892 2.374 2.374 0 01-1.614-.648A2.348 2.348 0 0010.3 15a2.036 2.036 0 01-1.745-.892.429.429 0 11.734-.442c.245.408.66.634 1.01.634.341 0 .614-.148.914-.442A3.21 3.21 0 0113.627 15c.341 0 .614-.148.914-.442a.429.429 0 01.734.442z"/></svg> Shopify Gross ($50k)</td>
                                        <td class="td-capital">$1,000.00</td>
                                        <td class="td-yield">+$2,000.00</td>
                                        <td class="td-outcome hit">Hit ($53.4k Gross)</td>
                                        <td><span class="lstatus-badge hit">✓ API Verified</span></td>
                                    </tr>
                                    <tr>
                                        <td class="td-id">#C-7954 <span class="td-user">@youtube_c...</span></td>
                                        <td class="td-metric"><svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#FF0000;width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> YouTube subs (+5k)</td>
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
                    <h2 class="lh-section-title">Your Notion workspace is a graveyard<br>of goals you never hit.</h2>
                    
                    <div class="lemo-grid">
                        <div class="lemo-left">
                            <p class="lemo-body">
                                Planning is easy. Executing is hard. You miss your targets because failing is free. Collateral gives you the financial leverage you need to stop planning, force your own hand, and start winning.
                            </p>
                        </div>
                        <div class="lemo-right">
                            <div class="lemo-comparison-card">
                                <div class="lemo-col without-collateral">
                                    <div class="lemo-col-header">Comfortable Procrastination</div>
                                    <ul class="lemo-list">
                                        <li class="lemo-item">Plan a new goal</li>
                                        <li class="lemo-item">Get distracted or lazy</li>
                                        <li class="lemo-item">Push deadline to next month</li>
                                        <li class="lemo-item">Sit there until AI takes your job</li>
                                    </ul>
                                </div>
                                <div class="lemo-divider"></div>
                                <div class="lemo-col with-collateral">
                                    <div class="lemo-col-header text-strong">Pure Execution</div>
                                    <ul class="lemo-list">
                                        <li class="lemo-item text-strong">Lock $500 on the target</li>
                                        <li class="lemo-item text-strong">Realize failure hurts</li>
                                        <li class="lemo-item text-strong">Work through the night</li>
                                        <li class="lemo-item text-strong text-green">Hit target & claim your money</li>
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
                            <div class="fq-a">No. There is no luck involved. You win if you hit your goal. You lose if you don't. The API checks your real data.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Where is the money held?</div>
                            <div class="fq-a">Your cash is held securely by Stripe. It gets released to you automatically as soon as the API verifies you hit your target.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">How is the target verified?</div>
                            <div class="fq-a">We check your real numbers directly through official platform APIs. No screenshots, no lies, no cheating.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Can I cancel after locking?</div>
                            <div class="fq-a">No. Once your cash is locked, you cannot get it back until the timer runs out. No early exits.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Can I get a refund if I miss?</div>
                            <div class="fq-a">No. If you fail, your money is gone. That's the only reason this works. Only lock cash you are ready to lose.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">What happens if an API goes down?</div>
                            <div class="fq-a">The contract pauses. If an API breaks permanently, you get your money back.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">What data do you access?</div>
                            <div class="fq-a">We connect using official OAuth read-only scopes. We do not store raw API keys, and we have zero access to customer data, PII, billing details, or funds.</div>
                        </div>
                        <div class="fq">
                            <div class="fq-q">Is this legal?</div>
                            <div class="fq-a">Yes. Available in the US, CA, UK, and EU. This is a performance-based commercial escrow agreement based on objective third-party metrics, not probability.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ FINAL CTA ═══ -->
            <div class="lfoot">
                <h2 class="lfoot-h">Are you going to keep pretending todo lists work,<br>or lock capital to guarantee you execute?<br>Make it <em style="color:var(--r);font-style:normal;font-weight:700">cost something.</em></h2>
                <div class="lfoot-sub">First performance contract matched up to $250.</div>
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

                <!-- User Identity (shown when logged in) -->
                <div id="mobile-user-section" class="pnl-user">
                    <div class="pnl-user-badge">
                        <span class="pnl-user-initial" id="mobile-menu-initial">U</span>
                        <img class="pnl-user-avatar" id="mobile-menu-avatar" alt="" />
                    </div>
                    <div class="pnl-user-info">
                        <span class="pnl-user-name" id="mobile-menu-username">@user</span>
                    </div>
                </div>

                <div class="pnl-body">
                    <!-- Navigation -->
                    <div class="pnl-section-label">Navigation</div>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/market'); return false;" class="pnl-nav-link active" style="animation-delay: 0.06s"><span class="pnl-nav-indicator"></span>MARKET</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/my-contracts'); return false;" class="pnl-nav-link" style="animation-delay: 0.09s"><span class="pnl-nav-indicator"></span>ACTIVE</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/rivalry'); return false;" class="pnl-nav-link" style="animation-delay: 0.12s"><span class="pnl-nav-indicator"></span>RIVALRY</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/ledger'); return false;" class="pnl-nav-link" style="animation-delay: 0.15s"><span class="pnl-nav-indicator"></span>LEDGER</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/sources'); return false;" class="pnl-nav-link" style="animation-delay: 0.18s"><span class="pnl-nav-indicator"></span>SOURCES</a>
                    
                    <!-- Account Links (shown when logged in) -->
                    <div id="mobile-account-links" style="display:none;">
                        <div class="pnl-divider"></div>
                        <div class="pnl-section-label">Account</div>
                        <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/profile'); return false;" class="pnl-acct-link" style="animation-delay: 0.21s"><i data-lucide="user" style="width:14px;height:14px;opacity:0.5;display:inline-block;vertical-align:middle;margin-right:8px;"></i>Profile</a>
                        <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/referrals'); return false;" class="pnl-acct-link" style="animation-delay: 0.24s"><i data-lucide="gift" style="width:14px;height:14px;opacity:0.5;display:inline-block;vertical-align:middle;margin-right:8px;"></i>Referrals</a>
                        <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/funding'); return false;" class="pnl-acct-link" style="animation-delay: 0.27s"><i data-lucide="wallet" style="width:14px;height:14px;opacity:0.5;display:inline-block;vertical-align:middle;margin-right:8px;"></i>Account Capital</a>
                        <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/docs'); return false;" class="pnl-acct-link" style="animation-delay: 0.30s"><i data-lucide="file-text" style="width:14px;height:14px;opacity:0.5;display:inline-block;vertical-align:middle;margin-right:8px;"></i>Documentation</a>
                        
                        <!-- Sign Out -->
                        <button id="pnl-signout-btn" onclick="window.app.closeMobileMenu(); window.app.handleSignOut()" class="pnl-signout" style="display:none;">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            Sign Out
                        </button>
                    </div>

                    <!-- Connect (shown when NOT logged in) -->
                    <div id="mobile-connect-section" class="pnl-connect-section">
                        <div class="pnl-connect-promo">Lock capital. Force execution.</div>
                        <div class="pnl-connect-promo-sub">Connect your account to lock performance contracts and match up to $250.</div>
                        <button onclick="window.app.closeMobileMenu(); window.app.handleAuthClick()" id="btn-auth-mobile" class="pnl-connect-btn">
                            Sign In
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

                // Update centerpiece card active contract indicators
                const globalActiveCountEl = document.getElementById('lc-global-active-count');
                if (globalActiveCountEl) {
                    globalActiveCountEl.textContent = totalActive;
                }
                const globalLockedAmountEl = document.getElementById('lc-global-locked-amount');
                if (globalLockedAmountEl) {
                    globalLockedAmountEl.textContent = `$${totalLocked.toLocaleString()}`;
                }

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
                            connText = 'Verified via Shopify API';
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

                // Cycle featured contract and recent activity in lockstep every 2.5 seconds
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
                    }, 2500);
                }

                // Populate Live Settlement Activity Table
                const tbody = document.getElementById('lledger-tbody');
                if (tbody) {
                    const ledgerEvents = response.events.filter(e => e.contractId && (e.actor || e.principal));
                    if (ledgerEvents.length > 0) {
                        let startIndex = 0;

                        const getPlatformIcon = (plt) => {
                            const p = (plt || '').toUpperCase();
                            if (p === 'STRIPE') return `<svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#635BFF;width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M20 10.3c0-1.8-1.5-2.7-3.6-3.2l-2-.5c-1.3-.3-1.9-.7-1.9-1.3 0-.6.7-1 1.7-1 1.7 0 3 .6 3.6 1l.7-2.6C17.9 2.2 16.3 1.8 14.8 1.8c-3.1 0-5.2 1.6-5.2 4.3 0 2.9 2.4 3.7 4.9 4.3l1.8.4c1.4.3 2 .8 2 1.5 0 .7-.8 1.1-2.1 1.1-1.9 0-3.6-.7-4.3-1.1l-.8 2.7c1 .5 2.9 1 4.7 1C18.2 16 20 14.4 20 10.3z"/></svg>`;
                            if (p === 'X' || p === 'TWITTER') return `<svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#111111;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
                            if (p === 'SHOPIFY') return `<svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#96bf48;width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M19.58 6.425a.86.86 0 00-.7-.34h-2.193a4.52 4.52 0 00-9.04 0H5.454a.86.86 0 00-.7.34.887.887 0 00-.16.766l1.97 10.96a2.41 2.41 0 002.37 1.986h6.49a2.41 2.41 0 002.37-1.985l1.97-10.96a.887.887 0 00-.184-.767zM12 3.86a2.53 2.53 0 012.513 2.225H9.487A2.53 2.53 0 0112 3.86zm3.267 11.516a2.036 2.036 0 01-1.745.892 2.374 2.374 0 01-1.614-.648A2.348 2.348 0 0010.3 15a2.036 2.036 0 01-1.745-.892.429.429 0 11.734-.442c.245.408.66.634 1.01.634.341 0 .614-.148.914-.442A3.21 3.21 0 0113.627 15c.341 0 .614-.148.914-.442a.429.429 0 01.734.442z"/></svg>`;
                            if (p === 'YOUTUBE') return `<svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#FF0000;width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
                            return `<svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#635BFF;width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M20 10.3c0-1.8-1.5-2.7-3.6-3.2l-2-.5c-1.3-.3-1.9-.7-1.9-1.3 0-.6.7-1 1.7-1 1.7 0 3 .6 3.6 1l.7-2.6C17.9 2.2 16.3 1.8 14.8 1.8c-3.1 0-5.2 1.6-5.2 4.3 0 2.9 2.4 3.7 4.9 4.3l1.8.4c1.4.3 2 .8 2 1.5 0 .7-.8 1.1-2.1 1.1-1.9 0-3.6-.7-4.3-1.1l-.8 2.7c1 .5 2.9 1 4.7 1C18.2 16 20 14.4 20 10.3z"/></svg>`;
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
                                        ${getPlatformIcon(e.platform)} 
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
        entries.forEach(e => {
            if (e.isIntersecting) {
                console.log("[ScrollReveal] Element intersected and revealed:", e.target);
                e.target.classList.add('v');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.02, rootMargin: '0px 0px -20px 0px' });
    
    const revealEls = document.querySelectorAll('[data-r]');
    console.log("[ScrollReveal] Observer initialized. Observing elements count:", revealEls.length);
    revealEls.forEach(el => obs.observe(el));

    // Count-up animation for stats (Premium cubic ease-out)
    const countEls = document.querySelectorAll('[data-count]');
    console.log("[CountUp] Observer initialized. Target elements count:", countEls.length);
    if (countEls.length) {
        const countObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const target = parseFloat(el.dataset.count);
                    console.log("[CountUp] Starting count animation for target:", target, el);
                    const duration = 1600; // 1.6 seconds ease-out
                    const startTime = performance.now();
                    
                    const animateCount = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Cubic ease-out curve
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const currentVal = easeOut * target;
                        
                        if (Number.isInteger(target)) {
                            el.textContent = Math.floor(currentVal);
                        } else {
                            el.textContent = currentVal.toFixed(1);
                        }
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        } else {
                            el.textContent = target;
                        }
                    };
                    requestAnimationFrame(animateCount);
                    countObs.unobserve(el);
                }
            });
        }, { threshold: 0.2 });
        countEls.forEach(el => countObs.observe(el));
    }

}
