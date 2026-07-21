// Landing Page — /go — Cold-traffic conversion page
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

// Inject LandingCSS once into document head to avoid duplication and parsing overhead
if (!document.getElementById('lp-injected-styles')) {
    const style = document.createElement('style');
    style.id = 'lp-injected-styles';
    style.textContent = landingCSS + `\n@media(max-width:768px){.lp .ldesktop-proof{display:none!important}}`;
    document.head.appendChild(style);
}

export function renderLanding() {
    return `
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
            </nav>            <!-- ═══ HERO ═══ -->
            <div class="lhero-section">
                <!-- DYNAMIC CONSTELLATION MESH BACKGROUND -->
                <div class="lhero-bg-container">
                    <svg class="lhero-mesh-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
                        <g opacity="0.12" stroke="var(--r)" stroke-width="1.2">
                            <line x1="120" y1="140" x2="380" y2="260" />
                            <line x1="380" y1="260" x2="720" y2="160" />
                            <line x1="720" y1="160" x2="1080" y2="320" />
                            <line x1="1080" y1="320" x2="1360" y2="140" />
                            <line x1="380" y1="260" x2="280" y2="520" />
                            <line x1="720" y1="160" x2="820" y2="480" />
                            <line x1="1080" y1="320" x2="960" y2="640" />
                            <line x1="280" y1="520" x2="620" y2="580" />
                            <line x1="620" y1="580" x2="820" y2="480" />
                            <line x1="820" y1="480" x2="1240" y2="580" />
                            <line x1="500" y1="100" x2="720" y2="160" />
                            <line x1="900" y1="80" x2="1080" y2="320" />
                        </g>
                        <g fill="var(--r)" opacity="0.25">
                            <circle cx="120" cy="140" r="4.5" />
                            <circle cx="380" cy="260" r="6.5" />
                            <circle cx="720" cy="160" r="5.5" />
                            <circle cx="1080" cy="320" r="7.5" />
                            <circle cx="1360" cy="140" r="4.5" />
                            <circle cx="280" cy="520" r="5.5" />
                            <circle cx="820" cy="480" r="6.5" />
                            <circle cx="620" cy="580" r="4.5" />
                            <circle cx="960" cy="640" r="5.5" />
                            <circle cx="1240" cy="580" r="6.5" />
                        </g>
                    </svg>
                </div>

                <div class="lw">
                    <div class="lhero-main-wrap">
                        <!-- MASSIVE DISPLAY TYPOGRAPHY HEADLINE -->
                        <div class="lhero-headline-wrap">
                            <h1 class="lh1 animate-fade-in-up">
                                YOUR BIGGEST BET<br>
                                SHOULD BE ON <span class="lh-gradient">YOU.</span>
                            </h1>
                        </div>

                        <!-- HERO LOWER FLEX CONTENT -->
                        <div class="lhero-bottom-area">
                            <div class="lhero-left">
                                <p class="lsub animate-fade-in-up delay-1">
                                    Every day, people risk money on outcomes they can't control—like sports teams, markets, or ad algorithms. Collateral lets you lock capital on the only asset you actually control: your own focus and execution.
                                </p>
                                <div class="lctas animate-fade-in-up delay-2">
                                    <button class="lbtn lbtn-r" id="lp-hero-cta">START CONTRACT</button>
                                    <button class="lbtn lbtn-g" id="lp-see-contracts-cta">SEE LIVE CONTRACTS</button>
                                </div>

                                <!-- COMPACT LIVE RIVALRY SNAPSHOT -->
                                <div class="l-live-rivalry-preview animate-fade-in-up delay-3" id="l-live-rivalry-preview-card">
                                    <div class="l-lr-hdr">
                                        <span class="l-lr-dot l-ticker-pulse"></span> LIVE CONTRACT RIVALRY
                                    </div>
                                    <div class="l-lr-ticker">
                                        <span class="l-lr-token">@jakevoss <span class="l-lr-num lead">+8.40%</span></span>
                                        <span class="l-lr-divider">/</span>
                                        <span class="l-lr-token">@marcus <span class="l-lr-num lag">+7.80%</span></span>
                                        <span class="l-lr-divider">|</span>
                                        <span class="l-lr-cap">POOL $2.0K</span>
                                        <span class="l-lr-divider">|</span>
                                        <span class="l-lr-time">T-MINUS 9D</span>
                                        <span class="l-lr-divider">|</span>
                                        <span class="l-lr-action-badge">VIEW MATCH <span style="display:inline-block; transition: transform 0.2s ease;">→</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SCROLL DOWN INDICATOR -->
                        <div class="lhero-footer-strip">
                            <a href="#contracts" onclick="window.app.scrollToSection('contracts'); return false;" class="lhero-scroll-down animate-fade-in-up delay-4">
                                <span class="lhero-scroll-arrow">↓</span> SCROLL DOWN
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- GLOBAL PROTOCOL STATISTICS -->
            <div class="l-global-stats-bar animate-fade-in-up delay-4">
                <div class="lw">
                    <!-- Visually hidden list of all metrics for screen readers -->
                    <div style="position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0,0,0,0) !important; border: 0 !important;">
                        Protocol metrics: Capital locked: $8.7M; Total commitments: 12,483; Settlement success: 96.2%; Execution identities: 3,442; Active contracts: 1,206; Average contract size: $6,940; Median settlement time: 1.4 days; Counterparties: 812.
                    </div>
                    <div class="l-stats-bar-grid" aria-live="off">
                        <a href="/market" class="l-stat-bar-item" data-cell-index="0" aria-label="See more: capital locked">
                            <div class="l-stat-bar-wrapper">
                                <div class="l-stat-bar-content current">
                                    <span class="l-stat-bar-val" id="ls-locked">$8.7M</span>
                                    <span class="l-stat-bar-lbl">Capital Locked</span>
                                </div>
                            </div>
                            <div class="l-stat-bar-overlay">
                                SEE MORE <span class="arrow">→</span>
                            </div>
                            <div class="l-stat-bar-static-cta">
                                SEE MORE →
                            </div>
                        </a>
                        <a href="/market" class="l-stat-bar-item" data-cell-index="1" aria-label="See more: total commitments">
                            <div class="l-stat-bar-wrapper">
                                <div class="l-stat-bar-content current">
                                    <span class="l-stat-bar-val" id="ls-commitments">12,483</span>
                                    <span class="l-stat-bar-lbl">Total Commitments</span>
                                </div>
                            </div>
                            <div class="l-stat-bar-overlay">
                                SEE MORE <span class="arrow">→</span>
                            </div>
                            <div class="l-stat-bar-static-cta">
                                SEE MORE →
                            </div>
                        </a>
                        <a href="/market" class="l-stat-bar-item lhide-mobile" data-cell-index="2" aria-label="See more: settlement success">
                            <div class="l-stat-bar-wrapper">
                                <div class="l-stat-bar-content current">
                                    <span class="l-stat-bar-val" id="ls-success">96.2%</span>
                                    <span class="l-stat-bar-lbl">Settlement Success</span>
                                </div>
                            </div>
                            <div class="l-stat-bar-overlay">
                                SEE MORE <span class="arrow">→</span>
                            </div>
                            <div class="l-stat-bar-static-cta">
                                SEE MORE →
                            </div>
                        </a>
                        <a href="/market" class="l-stat-bar-item lhide-mobile" data-cell-index="3" aria-label="See more: execution identities">
                            <div class="l-stat-bar-wrapper">
                                <div class="l-stat-bar-content current">
                                    <span class="l-stat-bar-val" id="ls-identities">3,442</span>
                                    <span class="l-stat-bar-lbl">Execution Identities</span>
                                </div>
                            </div>
                            <div class="l-stat-bar-overlay">
                                SEE MORE <span class="arrow">→</span>
                            </div>
                            <div class="l-stat-bar-static-cta">
                                SEE MORE →
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <!-- ═══ FANNED-DECK SHOWCASE WITH REAL COLLATERAL CONTRACT CARDS ═══ -->
            <div class="lfeatured-live-section" id="lfeatured-live-section" data-r>
                <div class="lw">
                    <div class="lfan-grid">
                        <!-- LEFT COLUMN -->
                        <div class="lfan-left">
                            <h2 class="lfan-h1">
                                DISCOVER THE<br>
                                POWER OF<br>
                                <span class="lfan-highlight">COLLATERAL</span>
                            </h2>
                            <p class="lfan-sub">
                                Every contract is backed by smart escrow and verified directly through platform APIs. No manual uploads. No cheating.
                            </p>
                            <div class="lfan-nav">
                                <button class="lfan-arrow-btn" id="lfan-prev" aria-label="Previous Contract Card">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                </button>
                                <button class="lfan-arrow-btn" id="lfan-next" aria-label="Next Contract Card">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            </div>
                        </div>

                        <!-- RIGHT COLUMN: 3 REAL COLLATERAL CONTRACT CARDS DECK -->
                        <div class="lfan-right" id="lfan-deck-container" tabindex="0" aria-label="Interactive Contract Deck Carousel">
                            <div class="lfan-deck-viewport">
                                <div class="lfan-deck-stage" id="lfan-deck-stage">
                                    
                                    <!-- CARD 1: STRIPE REVENUE CONTRACT -->
                                    <div class="lactivity-card lfan-real-card is-center" id="lfan-card-0">
                                        <div class="lc-platform-header">
                                            <img class="lc-plat-logo" src="https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg" alt="Stripe">
                                            <span class="lc-plat-text">Connected via Stripe Connect</span>
                                        </div>
                                        <div class="lc-global-stats-row">
                                            <span class="lc-global-stats-item">
                                                <span class="lc-global-stats-dot"></span>
                                                <span class="lc-global-stats-num">22</span>
                                                <span class="lc-global-stats-label">Active Contracts</span>
                                            </span>
                                            <span class="lc-global-stats-divider">|</span>
                                            <span class="lc-global-stats-item">
                                                <span class="lc-global-stats-num">$8,700</span>
                                                <span class="lc-global-stats-label">Locked</span>
                                            </span>
                                        </div>
                                        <div class="lc-contract">
                                            <div class="lc-contract-head">
                                                <div>
                                                    <div class="lc-contract-name">Stripe Revenue</div>
                                                    <div class="lc-contract-goal">Increase Stripe revenue by 20%</div>
                                                    <div class="lc-contract-time">18 Days Remaining</div>
                                                </div>
                                                <div class="lc-status"><span class="lc-status-dot"></span>Active</div>
                                            </div>
                                            <div class="lc-flow-horizontal">
                                                <div class="lc-flow-col">
                                                    <span class="lc-flow-label">Deposit</span>
                                                    <span class="lc-flow-val">$500</span>
                                                </div>
                                                <div class="lc-flow-arrow-right">→</div>
                                                <div class="lc-flow-col">
                                                    <span class="lc-flow-label">Match</span>
                                                    <span class="lc-flow-val lc-val-green">+$500</span>
                                                </div>
                                                <div class="lc-flow-arrow-right">→</div>
                                                <div class="lc-flow-col lc-col-final">
                                                    <span class="lc-flow-label">Return</span>
                                                    <span class="lc-flow-val">$1,000</span>
                                                </div>
                                            </div>
                                            <div class="lc-flow-footnote">Matches are funded by forfeited deposits and sponsors. <a href="#how" class="lc-flow-link" onclick="document.getElementById('how')?.scrollIntoView({behavior:'smooth'}); return false;">How it works →</a></div>
                                            <div class="lc-live-state-ticker">
                                                <span class="lc-live-state-lbl">PROTOCOL STATE</span>
                                                <span class="lc-live-state-val">Deposit Escrowed</span>
                                            </div>
                                        </div>
                                        <div class="lc-recent-activity">
                                            <div class="lc-ra-header">Recent Activity</div>
                                            <div class="lc-ra-list">
                                                <div class="lc-ra-item"><span class="lc-ra-dot hit">✓</span><div><strong>@tylerbrooks</strong> completed Stripe Revenue<div class="lc-ra-meta">+$500 paid · 14m ago</div></div></div>
                                                <div class="lc-ra-item"><span class="lc-ra-dot hit">✓</span><div><strong>@sarah_k</strong> funded X Followers<div class="lc-ra-meta">$250 locked · 45m ago</div></div></div>
                                            </div>
                                        </div>
                                        <div class="lc-trust">
                                            <svg class="lc-trust-lock" width="10" height="10" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="currentColor"/></svg>
                                            Contracts verified automatically through connected APIs.
                                        </div>
                                    </div>

                                    <!-- CARD 2: SHOPIFY SALES CONTRACT -->
                                    <div class="lactivity-card lfan-real-card is-right" id="lfan-card-1">
                                        <div class="lc-platform-header">
                                            <img class="lc-plat-logo" src="https://www.vectorlogo.zone/logos/shopify/shopify-icon.svg" alt="Shopify">
                                            <span class="lc-plat-text">Verified via Shopify API</span>
                                        </div>
                                        <div class="lc-global-stats-row">
                                            <span class="lc-global-stats-item">
                                                <span class="lc-global-stats-dot"></span>
                                                <span class="lc-global-stats-num">15</span>
                                                <span class="lc-global-stats-label">Active Contracts</span>
                                            </span>
                                            <span class="lc-global-stats-divider">|</span>
                                            <span class="lc-global-stats-item">
                                                <span class="lc-global-stats-num">$6,200</span>
                                                <span class="lc-global-stats-label">Locked</span>
                                            </span>
                                        </div>
                                        <div class="lc-contract">
                                            <div class="lc-contract-head">
                                                <div>
                                                    <div class="lc-contract-name">Shopify Sales</div>
                                                    <div class="lc-contract-goal">Generate $5,000 in net sales</div>
                                                    <div class="lc-contract-time">30 Days Remaining</div>
                                                </div>
                                                <div class="lc-status"><span class="lc-status-dot"></span>Active</div>
                                            </div>
                                            <div class="lc-flow-horizontal">
                                                <div class="lc-flow-col">
                                                    <span class="lc-flow-label">Deposit</span>
                                                    <span class="lc-flow-val">$250</span>
                                                </div>
                                                <div class="lc-flow-arrow-right">→</div>
                                                <div class="lc-flow-col">
                                                    <span class="lc-flow-label">Match</span>
                                                    <span class="lc-flow-val lc-val-green">+$125</span>
                                                </div>
                                                <div class="lc-flow-arrow-right">→</div>
                                                <div class="lc-flow-col lc-col-final">
                                                    <span class="lc-flow-label">Return</span>
                                                    <span class="lc-flow-val">$375</span>
                                                </div>
                                            </div>
                                            <div class="lc-flow-footnote">Matches are funded by forfeited deposits and sponsors. <a href="#how" class="lc-flow-link" onclick="document.getElementById('how')?.scrollIntoView({behavior:'smooth'}); return false;">How it works →</a></div>
                                            <div class="lc-live-state-ticker">
                                                <span class="lc-live-state-lbl">PROTOCOL STATE</span>
                                                <span class="lc-live-state-val">Yield Multiplier Active</span>
                                            </div>
                                        </div>
                                        <div class="lc-recent-activity">
                                            <div class="lc-ra-header">Recent Activity</div>
                                            <div class="lc-ra-list">
                                                <div class="lc-ra-item"><span class="lc-ra-dot hit">✓</span><div><strong>@marcus_d</strong> completed Shopify Sales<div class="lc-ra-meta">+$375 paid · 22m ago</div></div></div>
                                                <div class="lc-ra-item"><span class="lc-ra-dot hit">✓</span><div><strong>@alex_dev</strong> funded Store Milestone<div class="lc-ra-meta">$250 locked · 1h ago</div></div></div>
                                            </div>
                                        </div>
                                        <div class="lc-trust">
                                            <svg class="lc-trust-lock" width="10" height="10" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="currentColor"/></svg>
                                            Contracts verified automatically through connected APIs.
                                        </div>
                                    </div>

                                    <!-- CARD 3: X AUDIENCE GROWTH CONTRACT -->
                                    <div class="lactivity-card lfan-real-card is-left" id="lfan-card-2">
                                        <div class="lc-platform-header">
                                            <img class="lc-plat-logo" src="https://cdn.simpleicons.org/x/111111" alt="X">
                                            <span class="lc-plat-text">Verified via X API v2</span>
                                        </div>
                                        <div class="lc-global-stats-row">
                                            <span class="lc-global-stats-item">
                                                <span class="lc-global-stats-dot"></span>
                                                <span class="lc-global-stats-num">31</span>
                                                <span class="lc-global-stats-label">Active Contracts</span>
                                            </span>
                                            <span class="lc-global-stats-divider">|</span>
                                            <span class="lc-global-stats-item">
                                                <span class="lc-global-stats-num">$12,400</span>
                                                <span class="lc-global-stats-label">Locked</span>
                                            </span>
                                        </div>
                                        <div class="lc-contract">
                                            <div class="lc-contract-head">
                                                <div>
                                                    <div class="lc-contract-name">X Audience Growth</div>
                                                    <div class="lc-contract-goal">Gain 1,000 net new followers</div>
                                                    <div class="lc-contract-time">12 Days Remaining</div>
                                                </div>
                                                <div class="lc-status"><span class="lc-status-dot"></span>Active</div>
                                            </div>
                                            <div class="lc-flow-horizontal">
                                                <div class="lc-flow-col">
                                                    <span class="lc-flow-label">Deposit</span>
                                                    <span class="lc-flow-val">$1,000</span>
                                                </div>
                                                <div class="lc-flow-arrow-right">→</div>
                                                <div class="lc-flow-col">
                                                    <span class="lc-flow-label">Match</span>
                                                    <span class="lc-flow-val lc-val-green">+$1,000</span>
                                                </div>
                                                <div class="lc-flow-arrow-right">→</div>
                                                <div class="lc-flow-col lc-col-final">
                                                    <span class="lc-flow-label">Return</span>
                                                    <span class="lc-flow-val">$2,000</span>
                                                </div>
                                            </div>
                                            <div class="lc-flow-footnote">Matches are funded by forfeited deposits and sponsors. <a href="#how" class="lc-flow-link" onclick="document.getElementById('how')?.scrollIntoView({behavior:'smooth'}); return false;">How it works →</a></div>
                                            <div class="lc-live-state-ticker">
                                                <span class="lc-live-state-lbl">PROTOCOL STATE</span>
                                                <span class="lc-live-state-val">Escrow Verified</span>
                                            </div>
                                        </div>
                                        <div class="lc-recent-activity">
                                            <div class="lc-ra-header">Recent Activity</div>
                                            <div class="lc-ra-list">
                                                <div class="lc-ra-item"><span class="lc-ra-dot hit">✓</span><div><strong>@jakevoss</strong> completed X Growth<div class="lc-ra-meta">+$2,000 paid · 5m ago</div></div></div>
                                                <div class="lc-ra-item"><span class="lc-ra-dot hit">✓</span><div><strong>@elena_m</strong> funded Audience Target<div class="lc-ra-meta">$1,000 locked · 38m ago</div></div></div>
                                            </div>
                                        </div>
                                        <div class="lc-trust">
                                            <svg class="lc-trust-lock" width="10" height="10" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="currentColor"/></svg>
                                            Contracts verified automatically through connected APIs.
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <!-- TRUST COPY FOR MOBILE ONLY -->
            <div class="lc-trust lmobile-only" style="margin-top: 16px; border-top: none; padding-top: 0; margin-bottom: 24px;">
                <svg class="lc-trust-lock" width="10" height="10" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="currentColor"/></svg>
                Contracts verified automatically through connected APIs.
            </div>



            <!-- ═══ CONTRACT TYPES ═══ -->
            <div class="lw">
                <div class="ltypes-asymmetric" data-r>
                    <div class="ltypes-left">
                        <div class="lred-dash reveal-item"><span class="lmono">Contract Types</span></div>
                        <h2 class="ltypes-headline reveal-item">Use financial leverage on yourself,<br>or challenge a <strong>competitor.</strong></h2>
                    </div>

                    <div class="ltypes-right">
                        <div class="ltype-row reveal-item">
                            <div class="ltype-badge-new">Solo</div>
                            <h3 class="ltype-title-new">You vs. Yourself</h3>
                            <p class="ltype-desc-new">Lock deposits to force yourself to execute. <span class="lhide-mobile">Hit targets to win; fail and forfeit capital.</span></p>
                            <div class="ltype-meta-new">
                                <span class="lmeta-label">Best for</span>
                                <span class="lmeta-tag">Milestones</span>
                                <span class="lmeta-tag">Shipping code</span>
                                <span class="lmeta-tag">Audience building</span>
                            </div>
                        </div>
                        <div class="ltype-row reveal-item">
                            <div class="ltype-badge-new secondary">Rivalry</div>
                            <h3 class="ltype-title-new">You vs. Competitors</h3>
                            <p class="ltype-desc-new">Lock equal deposits in a head-to-head race. <span class="lhide-mobile">Winner takes the entire pool.</span></p>
                            <div class="ltype-meta-new">
                                <span class="lmeta-label">Best for</span>
                                <span class="lmeta-tag">Audience races</span>
                                <span class="lmeta-tag">Competitive fire</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- ═══ LIVE CONTRACT EXAMPLES ═══ -->
            <div class="lcontracts" id="contracts" data-r>
                <div class="lw">
                    <div class="reveal-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
                        <div class="lred-dash" style="margin-bottom: 0;"><span class="lmono">Open Contracts</span></div>
                        
                        <!-- ═══ OPEN CONTRACTS STATS ═══ -->
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="width: 6px; height: 6px; background: #145c14; border-radius: 50%; box-shadow: 0 0 10px rgba(20,92,20,0.8);"></span>
                            <span style="font-family: 'Inter Tight', sans-serif; font-weight: 700; color: #145c14; font-size: 15px; letter-spacing: -0.2px;">$7.6k</span>
                            <span style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.05em;">Capital Locked</span>
                        </div>
                    </div>
                    <div class="lcards">
                        <div class="lcard lcard-popular reveal-item">
                            <div class="lcard-top">
                                <span class="lcard-src"><svg class="lcard-src-logo" viewBox="0 0 24 24" fill="currentColor" style="color:#635BFF;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M20 10.3c0-1.8-1.5-2.7-3.6-3.2l-2-.5c-1.3-.3-1.9-.7-1.9-1.3 0-.6.7-1 1.7-1 1.7 0 3 .6 3.6 1l.7-2.6C17.9 2.2 16.3 1.8 14.8 1.8c-3.1 0-5.2 1.6-5.2 4.3 0 2.9 2.4 3.7 4.9 4.3l1.8.4c1.4.3 2 .8 2 1.5 0 .7-.8 1.1-2.1 1.1-1.9 0-3.6-.7-4.3-1.1l-.8 2.7c1 .5 2.9 1 4.7 1C18.2 16 20 14.4 20 10.3z"/></svg>Stripe</span>
                                <span class="lcard-tier tier-stake">Stake</span>
                            </div>
                            <div class="lcard-title">Revenue Growth</div>
                            <div class="lcard-target">+20% Revenue growth</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">2.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-live-indicator">
                                <span class="lcard-live-dot"></span>
                                <span class="lcard-live-text">48 Active duels</span>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="STRIPE" data-tier="stake" data-capital="250">Start Contract</button></div>
                        </div>
                        <div class="lcard reveal-item">
                            <div class="lcard-top">
                                <span class="lcard-src"><svg class="lcard-src-logo" viewBox="0 0 24 24" fill="currentColor" style="color:#111111;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>X / Twitter</span>
                                <span class="lcard-tier tier-allin">All-In</span>
                            </div>
                            <div class="lcard-title">Follower Growth</div>
                            <div class="lcard-target">+1,000 Followers</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$500 – $5,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">4.0x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">14 days</span></div>
                            <div class="lcard-live-indicator">
                                <span class="lcard-live-dot"></span>
                                <span class="lcard-live-text">$82k Locked in escrow</span>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="X" data-tier="all_in" data-capital="500">Start Contract</button></div>
                        </div>
                        <div class="lcard reveal-item">
                            <div class="lcard-top">
                                <span class="lcard-src"><svg class="lcard-src-logo" viewBox="0 0 24 24" fill="currentColor" style="color:#96bf48;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M19.58 6.425a.86.86 0 00-.7-.34h-2.193a4.52 4.52 0 00-9.04 0H5.454a.86.86 0 00-.7.34.887.887 0 00-.16.766l1.97 10.96a2.41 2.41 0 002.37 1.986h6.49a2.41 2.41 0 002.37-1.985l1.97-10.96a.887.887 0 00-.184-.767zM12 3.86a2.53 2.53 0 012.513 2.225H9.487A2.53 2.53 0 0112 3.86zm3.267 11.516a2.036 2.036 0 01-1.745.892 2.374 2.374 0 01-1.614-.648A2.348 2.348 0 0010.3 15a2.036 2.036 0 01-1.745-.892.429.429 0 11.734-.442c.245.408.66.634 1.01.634.341 0 .614-.148.914-.442A3.21 3.21 0 0113.627 15c.341 0 .614-.148.914-.442a.429.429 0 01.734.442z"/></svg>Shopify</span>
                                <span class="lcard-tier tier-pledge">Pledge</span>
                            </div>
                            <div class="lcard-title">Store Sales</div>
                            <div class="lcard-target">+$5,000 Net Sales</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$100 – $1,500</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">1.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-live-indicator">
                                <span class="lcard-live-dot"></span>
                                <span class="lcard-live-text">Oracle Verified</span>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="SHOPIFY" data-tier="pledge" data-capital="100">Start Contract</button></div>
                        </div>
                        <div class="lcard reveal-item">
                            <div class="lcard-top">
                                <span class="lcard-src"><svg class="lcard-src-logo" viewBox="0 0 24 24" fill="currentColor" style="color:#FF0000;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>YouTube</span>
                                <span class="lcard-tier tier-stake">Stake</span>
                            </div>
                            <div class="lcard-title">Subscriber Growth</div>
                            <div class="lcard-target">+500 Subscribers</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">2.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-live-indicator">
                                <span class="lcard-live-dot urgent"></span>
                                <span class="lcard-live-text">3 Hours Remaining</span>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="YOUTUBE" data-tier="stake" data-capital="250">Start Contract</button></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ HOW IT WORKS ═══ -->
            <div class="lhow" data-r id="how">
            <div class="lw">
                    <div class="lred-dash reveal-item"><span class="lmono">How It Works</span></div>
                    <h2 class="lhow-h reveal-item">Set a target. Lock money.<br>Force yourself to <strong>win.</strong></h2>
                    <p class="lhow-sub reveal-item">If you are serious, put something on the line.</p>

                    <div class="lhow-timeline-wrap reveal-item">
                        <div class="lhow-timeline-line"></div>
                        <div class="lhow-timeline-steps">
                            <div class="lhow-timeline-step reveal-item">
                                <div class="lhow-timeline-node">01</div>
                                <h3 class="lhow-timeline-title">Set Target</h3>
                                <p class="lhow-timeline-desc">Connect Stripe, X, Shopify, or YouTube. Set your exact metric target.</p>
                            </div>
                            <div class="lhow-timeline-step reveal-item">
                                <div class="lhow-timeline-node">02</div>
                                <h3 class="lhow-timeline-title">Lock Deposit</h3>
                                <p class="lhow-timeline-desc">Lock your security deposit in escrow. No early withdrawals allowed.</p>
                            </div>
                            <div class="lhow-timeline-step reveal-item">
                                <div class="lhow-timeline-node">03</div>
                                <h3 class="lhow-timeline-title">Execute</h3>
                                <p class="lhow-timeline-desc">Your contract runs. Progress is tracked in real-time via platform APIs.</p>
                            </div>
                            <div class="lhow-timeline-step reveal-item">
                                <div class="lhow-timeline-node final">04</div>
                                <h3 class="lhow-timeline-title">API Settle</h3>
                                <p class="lhow-timeline-desc">APIs verify outcomes. Hit goals to win yields; fail and forfeit deposits.</p>
                            </div>
                        </div>
                    </div>
            </div>
            </div>

            <!-- ═══ SOCIAL PROOF (REAL RESULTS) ═══ -->
            <div class="lreal-results" data-r>
                <div class="lw">
                    <div class="lred-dash reveal-item"><span class="lmono">Real Results</span></div>
                    <h2 class="lh-section-title reveal-item">Skin in the game is the only thing that works.</h2>
                    <p class="lh-section-subtitle reveal-item">Stop pretending you will do it tomorrow. Lock capital today, execute your goals, and win.</p>
                    
                    <!-- Stats Grid - borderless separated statistics -->
                    <div class="lstats-grid-borderless">
                        <div class="lstat-item-borderless reveal-item">
                            <div class="lstat-num"><span data-count="74">0</span>%</div>
                            <div class="lstat-label">of contracts are won</div>
                            <div class="lstat-sub">Go-getters who lock cash hit their targets way faster.</div>
                        </div>
                        <div class="lstat-item-borderless reveal-item">
                            <div class="lstat-num">$<span data-count="127">0</span>k</div>
                            <div class="lstat-label">total capital settled</div>
                            <div class="lstat-sub">Across revenue, follower, and subscriber contracts</div>
                        </div>
                        <div class="lstat-item-borderless reveal-item">
                            <div class="lstat-num"><span data-count="18">0</span> days</div>
                            <div class="lstat-label">average time to target</div>
                            <div class="lstat-sub">Accountability compresses timelines.</div>
                        </div>
                    </div>

                    <!-- Fused connecting element: stats -> ledger -->
                    <div class="lledger-connector-wrap reveal-item">
                        <div class="lledger-connector-line"></div>
                        <span class="lledger-connector-label">Audited Evidence</span>
                        <div class="lledger-connector-line"></div>
                    </div>

                    <!-- Verified Ledger Feed (Compressed Option B) -->
                    <div class="lledger-container-prod reveal-item">
                        <div class="lledger-header-prod">
                            <h3 class="lledger-h-title-prod">Live Settlement Activity</h3>
                            <div class="lledger-h-desc-prod">Verified platform outcomes.</div>
                        </div>
                        <div class="lledger-table-wrap-prod">
                            <table class="lledger-table-prod">
                                <thead>
                                    <tr>
                                        <th>Contract ID</th>
                                        <th>Metric</th>
                                        <th>Commitment</th>
                                        <th>Outcome</th>
                                    </tr>
                                </thead>
                                <tbody id="lledger-tbody-prod">
                                    <tr class="reveal-item v">
                                        <td data-label="Contract ID" class="td-id"><span class="td-value">#C-8041 <span class="td-user">@danny_v...</span></span></td>
                                        <td data-label="Metric" class="td-metric"><span class="td-value"><svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#635BFF;width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M20 10.3c0-1.8-1.5-2.7-3.6-3.2l-2-.5c-1.3-.3-1.9-.7-1.9-1.3 0-.6.7-1 1.7-1 1.7 0 3 .6 3.6 1l.7-2.6C17.9 2.2 16.3 1.8 14.8 1.8c-3.1 0-5.2 1.6-5.2 4.3 0 2.9 2.4 3.7 4.9 4.3l1.8.4c1.4.3 2 .8 2 1.5 0 .7-.8 1.1-2.1 1.1-1.9 0-3.6-.7-4.3-1.1l-.8 2.7c1 .5 2.9 1 4.7 1C18.2 16 20 14.4 20 10.3z"/></svg> Stripe Revenue (+20.0%)</span></td>
                                        <td data-label="Commitment" class="td-capital"><span class="td-value">$500.00</span></td>
                                        <td data-label="Outcome" class="td-outcome hit"><span class="td-value"><span class="outcome-marker-hit">✓</span> Hit</span></td>
                                    </tr>
                                    <tr class="reveal-item v">
                                        <td data-label="Contract ID" class="td-id"><span class="td-value">#C-8022 <span class="td-user">@justin_s...</span></span></td>
                                        <td data-label="Metric" class="td-metric"><span class="td-value"><svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#111111;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X Followers (+1k)</span></td>
                                        <td data-label="Commitment" class="td-capital"><span class="td-value">$250.00</span></td>
                                        <td data-label="Outcome" class="td-outcome miss"><span class="td-value"><span class="outcome-marker-miss">✗</span> Missed</span></td>
                                    </tr>
                                    <tr class="reveal-item v">
                                        <td data-label="Contract ID" class="td-id"><span class="td-value">#C-7988 <span class="td-user">@growth...</span></span></td>
                                        <td data-label="Metric" class="td-metric"><span class="td-value"><svg class="td-icon" viewBox="0 0 24 24" fill="currentColor" style="color:#96bf48;width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M19.58 6.425a.86.86 0 00-.7-.34h-2.193a4.52 4.52 0 00-9.04 0H5.454a.86.86 0 00-.7.34.887.887 0 00-.16.766l1.97 10.96a2.41 2.41 0 002.37 1.986h6.49a2.41 2.41 0 002.37-1.985l1.97-10.96a.887.887 0 00-.184-.767zM12 3.86a2.53 2.53 0 012.513 2.225H9.487A2.53 2.53 0 0112 3.86zm3.267 11.516a2.036 2.036 0 01-1.745.892 2.374 2.374 0 01-1.614-.648A2.348 2.348 0 0010.3 15a2.036 2.036 0 01-1.745-.892.429.429 0 11.734-.442c.245.408.66.634 1.01.634.341 0 .614-.148.914-.442A3.21 3.21 0 0113.627 15c.341 0 .614-.148.914-.442a.429.429 0 01.734.442z"/></svg> Shopify Gross ($50k)</span></td>
                                        <td data-label="Commitment" class="td-capital"><span class="td-value">$1,000.00</span></td>
                                        <td data-label="Outcome" class="td-outcome hit"><span class="td-value"><span class="outcome-marker-hit">✓</span> Hit</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="lledger-footer-prod">
                            <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="lledger-more-link-prod">View all settlements →</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MINI CTA BLOCK -->
            <div class="lw">
                <div class="lmini-cta" data-r>
                    <h3 class="lmini-cta-h reveal-item">Done planning. Ready to commit?</h3>
                    <p class="lmini-cta-p reveal-item">Your first performance bonus is matched up to $250.</p>
                    <button class="lbtn lbtn-r reveal-item" id="lp-mini-cta">Start Contract</button>
                    <div class="lmini-cta-micro reveal-item">Objective tracking. Verified business data only.</div>
                </div>
            </div>

            <!-- ═══ EMOTIONAL REFRAME (WHY IT WORKS) ═══ -->
            <!-- ═══ EMOTIONAL REFRAME (WHY IT WORKS) ═══ -->
            <div class="lhow-it-works-section" data-r>
                <div class="lw">
                    <div class="lred-dash reveal-item"><span class="lmono">Why It Works</span></div>
                    <div class="lhow-layout">
                        <!-- Left Side: Large Bold Copy & Subtext -->
                        <div class="lhow-intro reveal-item">
                            <h2 class="lhow-title">A plan without stakes is just a comfortable wish.</h2>
                            <p class="lhow-body">
                                Planning is easy. Executing is hard. You miss targets because failing is free. Collateral makes failure cost something, shifting you from passive planning to pure execution.
                            </p>
                            <p class="lhow-caption lhide-mobile">
                                Stop betting on variables you can't control. Bet on your own focus.
                            </p>
                        </div>
                        
                        <!-- Right Side: Side-by-Side Architectural Timeline Paths (No card container) -->
                        <div class="lhow-flow reveal-item">
                            <div class="lflow-col procrastination">
                                <h4 class="lflow-header">Comfortable Procrastination</h4>
                                <div class="lflow-steps">
                                    <div class="lflow-step">
                                        <span class="lflow-num">01</span>
                                        <span class="lflow-text">Plan a new goal</span>
                                    </div>
                                    <div class="lflow-step">
                                        <span class="lflow-num">02</span>
                                        <span class="lflow-text">Get distracted or lazy</span>
                                    </div>
                                    <div class="lflow-step">
                                        <span class="lflow-num">03</span>
                                        <span class="lflow-text">Push deadline to next month</span>
                                    </div>
                                    <div class="lflow-step">
                                        <span class="lflow-num">04</span>
                                        <span class="lflow-text">Let another year slide by</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="lflow-col execution">
                                <h4 class="lflow-header">Pure Execution</h4>
                                <div class="lflow-steps">
                                    <div class="lflow-step">
                                        <span class="lflow-num">01</span>
                                        <span class="lflow-text">Lock deposit on target</span>
                                    </div>
                                    <div class="lflow-step">
                                        <span class="lflow-num">02</span>
                                        <span class="lflow-text">Failure has real cost</span>
                                    </div>
                                    <div class="lflow-step">
                                        <span class="lflow-num">03</span>
                                        <span class="lflow-text">Work through the night</span>
                                    </div>
                                    <div class="lflow-step">
                                        <span class="lflow-num">04</span>
                                        <span class="lflow-text highlight-green">Hit target & claim yields</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ THE CLTR TOKEN ECONOMY ═══ -->
            <div class="lemo-reframe" data-r>
                <div class="lw">
                    <div class="lred-dash reveal-item"><span class="lmono">Protocol Token</span></div>
                    <h2 class="lh-section-title reveal-item">The CLTR Token Economy</h2>
                    <p class="lh-section-subtitle reveal-item" style="font-size:18px; color:var(--t2); margin-top:12px; margin-bottom:32px; max-width:680px; line-height:1.6;">Securing trust, locking bandwidth, and burning supply programmatically.</p>
                    
                    <div class="lemo-grid">
                        <div class="reveal-item">
                            <p class="lemo-body" style="font-size:16px; line-height:1.65; color:var(--t2);">
                                CLTR is the utility token powering Collateral reputation and execution on the Robinhood Chain.
                                <br class="lhide-mobile"><br class="lhide-mobile">
                                <span class="lhide-mobile">Builders bond CLTR for milestone capacity. Validators and jurors lock it to secure the network. Every contract forfeiture burns CLTR permanently.</span>
                            </p>
                            <div style="display:flex; gap:16px; margin-top:32px; flex-wrap:wrap;">
                                <a href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x7b69C7E57d7004EB2374E5Aabb9db5334aE73B9f" target="_blank" class="lbtn lbtn-g" style="height:50px; padding:0 24px; font-size:11px; text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
                                    <span>Trade CLTR on Uniswap</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                                </a>
                                <a href="#" onclick="window.router.navigate('/protocol?tab=economics'); return false;" class="lbtn lbtn-g" style="height:50px; padding:0 24px; font-size:11px; text-decoration:none; display:inline-flex; align-items:center;">
                                    <span>Explore Tokenomics</span>
                                </a>
                            </div>
                        </div>
                        <div class="reveal-item" style="background:var(--bg); border:1px solid var(--d); border-radius:12px; padding:32px; display:flex; flex-direction:column; gap:20px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--d); padding-bottom:12px;">
                                <span style="font-family:'Inter Tight', sans-serif; font-weight:800; font-size:13px; color:var(--t1);">CLTR UTILITY</span>
                                <span style="font-family:'Inter', sans-serif; font-size:9px; font-weight:700; color:var(--r); background:rgba(92,20,20,0.06); padding:3px 8px; border-radius:100px; border:1px solid rgba(92,20,20,0.12); text-transform:uppercase;">Live Network</span>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:16px; font-size:13px; color:var(--t2);">
                                <div style="display:flex; flex-direction:column; gap:2px;">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <span style="color:var(--g); font-weight:bold;">✓</span>
                                        <strong style="color:var(--t1);">Commitment Collateral</strong>
                                    </div>
                                    <div style="padding-left:20px; font-size:12px; color:var(--t3); line-height:1.4;">Stake CLTR to unlock larger personal contracts.</div>
                                </div>
                                <div style="display:flex; flex-direction:column; gap:2px;">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <span style="color:var(--g); font-weight:bold;">✓</span>
                                        <strong style="color:var(--t1);">Reputation Weight</strong>
                                    </div>
                                    <div style="padding-left:20px; font-size:12px; color:var(--t3); line-height:1.4;">Token stake increases commitment capacity and platform trust.</div>
                                </div>
                                <div style="display:flex; flex-direction:column; gap:2px;">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <span style="color:var(--g); font-weight:bold;">✓</span>
                                        <strong style="color:var(--t1);">Settlement Economics</strong>
                                    </div>
                                    <div style="padding-left:20px; font-size:12px; color:var(--t3); line-height:1.4;">A portion of completed contract volume is permanently removed from circulation.</div>
                                </div>
                                <div style="display:flex; flex-direction:column; gap:2px;">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <span style="color:var(--g); font-weight:bold;">✓</span>
                                        <strong style="color:var(--t1);">Accountability Layer</strong>
                                    </div>
                                    <div style="padding-left:20px; font-size:12px; color:var(--t3); line-height:1.4;">Failed commitments trigger penalties that reinforce the network.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- COMMUNITY MOMENTUM / PROTOCOL ACTIVITY -->
            <div class="l-community-momentum" data-r>
                <div class="lw">
                    <div class="l-momentum-wrap">
                        <span class="l-momentum-title reveal-item">Today's Activity</span>
                        <div class="l-momentum-items">
                            <span class="l-momentum-item reveal-item"><strong>178</strong> commitments created</span>
                            <span class="l-momentum-dot">•</span>
                            <span class="l-momentum-item reveal-item"><strong>$412k</strong> capital locked</span>
                            <span class="l-momentum-dot">•</span>
                            <span class="l-momentum-item reveal-item"><strong>94</strong> settlements completed</span>
                            <span class="l-momentum-dot">•</span>
                            <span class="l-momentum-item reveal-item"><strong>12</strong> rivalries started</span>
                            <span class="l-momentum-dot">•</span>
                            <span class="l-momentum-item reveal-item"><strong>1.2M CLTR</strong> burned this week</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ FAQ ═══ -->
            <div class="lfaq" data-r id="faq">
            <div class="lw">
                    <div class="lred-dash reveal-item"><span class="lmono">Common Questions</span></div>
                    <h2 class="lhow-h reveal-item" style="margin-bottom:28px">No fine print. Just <strong>loopholes.</strong></h2>
                    <div class="lfaq-wrap">
                        <div class="fq open reveal-item">
                            <div class="fq-q">Is this gambling?</div>
                            <div class="fq-a">No. Gambling is risking money on variables you can't control (sports, markets, algorithms). Collateral is betting on your own focus, work, and execution.</div>
                        </div>
                        <div class="fq reveal-item">
                            <div class="fq-q">Where is the money held?</div>
                            <div class="fq-a">All deposits are held securely in a dedicated Stripe escrow account until settled.</div>
                        </div>
                        <div class="fq reveal-item">
                            <div class="fq-q">How is the target verified?</div>
                            <div class="fq-a">We query official platform APIs (Stripe, Shopify, X, YouTube) directly. No manual uploads, no cheating.</div>
                        </div>
                        <div class="fq reveal-item">
                            <div class="fq-q">Can I cancel after locking?</div>
                            <div class="fq-a">No. Once capital is locked, it cannot be withdrawn or canceled until the contract deadline.</div>
                        </div>
                        <div class="fq lhide-mobile reveal-item">
                            <div class="fq-q">Can I get a refund if I miss?</div>
                            <div class="fq-a">No. If you fail, the deposit is forfeited. This financial risk is why the system works.</div>
                        </div>
                        <div class="fq lhide-mobile reveal-item">
                            <div class="fq-q">What happens if an API goes down?</div>
                            <div class="fq-a">The contract pauses. If an integration breaks permanently, deposits are refunded.</div>
                        </div>
                        <div class="fq lhide-mobile reveal-item">
                            <div class="fq-q">What data do you access?</div>
                            <div class="fq-a">We request read-only access to verify target metrics. We never store customer or billing data.</div>
                        </div>
                        <div class="fq lhide-mobile reveal-item">
                            <div class="fq-q">Is this legal?</div>
                            <div class="fq-a">Yes. It is a performance-based commercial escrow agreement based on objective business data, not probability.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ FOOTER ═══ -->
            <div class="lfoot" data-r>
                <div class="lfoot-line reveal-item">Collateral.market · © 2026</div>
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
                    <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/market?type=rivalry'); return false;" class="pnl-nav-link" style="animation-delay: 0.12s"><span class="pnl-nav-indicator"></span>RIVALRY</a>
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
                        <div class="pnl-connect-badge">
                            <span class="pnl-connect-badge-dot"></span>
                            $250 Match Active
                        </div>
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

            <!-- RIVALRY QUICK-VIEW OVERLAY MODAL -->
            <div id="rivalry-quick-view-overlay" class="l-modal-overlay">
                <div class="l-modal-container">
                    <div class="l-modal-header">
                        <span class="l-modal-title">
                            <span class="l-ticker-pulse"></span> RIVALRY SPECIFICATION · ID: R-VOSS-MARCUS
                        </span>
                        <button class="l-modal-close" id="l-modal-close-btn">✕</button>
                    </div>
                    <div class="l-modal-body">
                        
                        <!-- 1. LIVE RIVALRY SCOREBOARD (HERO) -->
                        <div class="l-modal-scoreboard">
                            <div class="l-ms-header">
                                <div class="l-ms-player left">
                                    <span class="l-ms-name">JakeVoss</span>
                                    <span class="l-ms-delta green">+8.40%</span>
                                    <span class="l-ms-badge leading">LEADING</span>
                                </div>
                                <div class="l-ms-vs-box">
                                    <span class="l-ms-vs-lbl">VS</span>
                                    <div class="l-ms-lead-bubble">
                                        <span class="l-ms-lead-lbl">Lead Margin</span>
                                        <span class="l-ms-lead-val">+0.60%</span>
                                    </div>
                                </div>
                                <div class="l-ms-player right">
                                    <span class="l-ms-name">Marcus</span>
                                    <span class="l-ms-delta burgundy">+7.80%</span>
                                    <span class="l-ms-badge trailing">TRAILING</span>
                                </div>
                            </div>
                            
                            <!-- 2. MOMENTUM BAR -->
                            <div class="l-ms-momentum-wrap">
                                <div class="l-ms-momentum-names">
                                    <span>JakeVoss</span>
                                    <span>Marcus</span>
                                </div>
                                <div class="l-ms-momentum-bar">
                                    <div class="l-ms-momentum-fill left" style="width: 54%;"></div>
                                    <div class="l-ms-momentum-fill right" style="width: 46%;"></div>
                                    <div class="l-ms-momentum-divider" style="left: 54%;"></div>
                                </div>
                                <div class="l-ms-momentum-footer">
                                    <span>Current Lead: +0.60%</span>
                                </div>
                            </div>
                        </div>

                        <!-- 3. PERFORMANCE CHART -->
                        <div class="l-modal-graph-container">
                            <div class="l-mg-header">
                                <span class="l-mg-title">PERFORMANCE METRIC HISTORY</span>
                                <span class="l-mg-live-dot">● LIVE STREAM</span>
                            </div>
                            <div class="l-modal-graph">
                                <svg width="100%" height="100%" viewBox="0 0 532 170" preserveAspectRatio="none" style="display: block; overflow: visible;">
                                    <!-- Grids -->
                                    <line x1="0" y1="42.5" x2="532" y2="42.5" stroke="rgba(0,0,0,0.03)" stroke-width="1" stroke-dasharray="3,3"/>
                                    <line x1="0" y1="85" x2="532" y2="85" stroke="rgba(0,0,0,0.03)" stroke-width="1" stroke-dasharray="3,3"/>
                                    <line x1="0" y1="127.5" x2="532" y2="127.5" stroke="rgba(0,0,0,0.03)" stroke-width="1" stroke-dasharray="3,3"/>
                                    <!-- Paths -->
                                    <path d="M 0 130 Q 100 120 200 95 T 400 65 T 532 30" fill="none" stroke="var(--g)" stroke-width="1.5"/>
                                    <path d="M 0 130 Q 100 125 200 110 T 400 90 T 532 60" fill="none" stroke="var(--r)" stroke-width="1.2" stroke-dasharray="2,2"/>
                                    <!-- Live Pulse Dot -->
                                    <circle cx="532" cy="30" r="3" fill="var(--g)"/>
                                    <circle cx="532" cy="30" r="8" fill="none" stroke="var(--g)" stroke-width="0.8">
                                        <animate attributeName="r" values="3;9;3" dur="2.2s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="1;0;1" dur="2.2s" repeatCount="indefinite" />
                                    </circle>
                                </svg>
                            </div>
                        </div>

                        <!-- 4. ORACLE FEED -->
                        <div class="l-modal-oracle-section">
                            <div class="l-os-title">ORACLE VERIFICATION FEED</div>
                            <div class="l-modal-console-new">
                                <div class="l-os-card">
                                    <div class="l-os-card-header">
                                        <span class="l-os-time">12:31:05</span>
                                        <span class="l-os-label">Oracle Verification</span>
                                        <span class="l-os-status verified">✓ Verified</span>
                                    </div>
                                    <div class="l-os-card-body">
                                        <span class="l-os-competitor">JakeVoss</span>
                                        <span class="l-os-metric">Subscribers: <strong>+8.22% → +8.40%</strong></span>
                                    </div>
                                </div>
                                <div class="l-os-card">
                                    <div class="l-os-card-header">
                                        <span class="l-os-time">12:31:05</span>
                                        <span class="l-os-label">Oracle Verification</span>
                                        <span class="l-os-status verified">✓ Verified</span>
                                    </div>
                                    <div class="l-os-card-body">
                                        <span class="l-os-competitor">Marcus</span>
                                        <span class="l-os-metric">Subscribers: <strong style="color:var(--t3)">Unchanged (+7.80%)</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 5. CONTRACT SUMMARY STRIP -->
                        <div class="l-modal-summary-strip">
                            <div class="l-ss-item">
                                <span class="l-ss-lbl">Pool</span>
                                <span class="l-ss-val">$2,000</span>
                            </div>
                            <div class="l-ss-item">
                                <span class="l-ss-lbl">Lead</span>
                                <span class="l-ss-val">+0.60%</span>
                            </div>
                            <div class="l-ss-item">
                                <span class="l-ss-lbl">Time</span>
                                <span class="l-ss-val">9 Days</span>
                            </div>
                            <div class="l-ss-item">
                                <span class="l-ss-lbl">Oracle</span>
                                <span class="l-ss-val" style="color:var(--g)">Verified</span>
                            </div>
                            <div class="l-ss-item">
                                <span class="l-ss-lbl">Platform</span>
                                <span class="l-ss-val">YouTube</span>
                            </div>
                        </div>

                        <!-- 6. PRIMARY CTA -->
                        <button class="l-modal-action-btn-new" id="l-modal-action-btn">Open Live Rivalry</button>
                    </div>
            </div>

            <!-- CONTRACT SPECIFICATION OVERLAY MODAL -->
            <div id="contract-spec-overlay" class="l-modal-overlay">
                <div class="l-modal-container">
                    <div class="l-modal-header">
                        <span class="l-modal-title">
                            <span class="l-ticker-pulse"></span> CONTRACT SPECIFICATION
                        </span>
                        <button class="l-modal-close" id="l-spec-modal-close-btn">✕</button>
                    </div>
                    <div class="l-modal-body">
                        
                        <!-- 1. CONTRACT HEADER DETAILS -->
                        <div class="l-spec-hero-card">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <span class="l-spec-platform-badge" id="l-spec-platform-name">Platform</span>
                                <span class="l-spec-tier-badge" id="l-spec-tier-name">Tier</span>
                            </div>
                            <h3 class="l-spec-title" id="l-spec-title">Revenue Growth</h3>
                            <p class="l-spec-desc" id="l-spec-desc">Objective target tracking via API integrations.</p>
                        </div>

                        <!-- 2. SPEC PARAMETERS -->
                        <div class="l-spec-params">
                            <div class="l-spec-param-row">
                                <span class="lbl">Deposit Range</span>
                                <span class="val" id="l-spec-deposit-range">$250 – $3,000</span>
                            </div>
                            <div class="l-spec-param-row">
                                <span class="lbl">Custody Yield</span>
                                <span class="val" id="l-spec-bonus-yield">2.5x</span>
                            </div>
                            <div class="l-spec-param-row">
                                <span class="lbl">Contract Window</span>
                                <span class="val" id="l-spec-window">30 days</span>
                            </div>
                            <div class="l-spec-param-row">
                                <span class="lbl">Verification API</span>
                                <span class="val" id="l-spec-verification-api">Stripe API Balance v3</span>
                            </div>
                        </div>

                        <!-- 3. CUSTODY & RESOLUTION CONSOLE -->
                        <div style="display:flex; flex-direction:column; gap:6px;">
                            <span style="font-family:'JetBrains Mono', monospace; font-size:8.5px; font-weight:700; color:var(--t3); letter-spacing:0.5px;">CUSTODY & RESOLUTION PIPELINE</span>
                            <div class="l-modal-console" style="height:100px;">
                                <div class="l-console-line"><span class="c-time">[ESCROW]</span> Funds held in secure Stripe custody vault</div>
                                <div class="l-console-line"><span class="c-time">[ORACLE]</span> Performance queries resolved every 24 hours</div>
                                <div class="l-console-line"><span class="c-time">[SETTLE]</span> Target matched returns paid out immediately on success</div>
                                <div class="l-console-line"><span class="c-time">[FORFEIT]</span> Failure triggers custody burn to capacity pool</div>
                            </div>
                        </div>

                        <!-- 4. LIVE ACTIVITY STAT -->
                        <div class="l-spec-activity-bar" id="l-spec-live-stat-bar">
                            <span class="l-ticker-pulse" id="l-spec-live-pulse-dot"></span>
                            <span id="l-spec-live-stat">48 Active contracts currently tracking</span>
                        </div>

                        <!-- 5. PRIMARY CTA -->
                        <button class="l-modal-action-btn-new" id="l-spec-execute-btn">Execute Contract</button>
                    </div>
                </div>
            </div>

        </div>
    `;
}

export function initLanding() {
    if (window.landingIntervals) {
        window.landingIntervals.forEach(clearInterval);
    }
    window.landingIntervals = [];

    // Count-up helpers
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

    const animateCountFloat = (id, val, pre = '', suf = '', decimals = 1) => {
        const el = document.getElementById(id);
        if (!el) return;
        const dur = 1200, st = performance.now();
        function tick(ts) {
            const p = Math.min((ts - st) / dur, 1);
            const v = p * (2 - p) * val;
            el.textContent = pre + v.toFixed(decimals) + suf;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = pre + val.toFixed(decimals) + suf;
        }
        requestAnimationFrame(tick);
    };

    // Fade in page container and run hero animations immediately
    setTimeout(() => {
        const lp = document.querySelector('.lp');
        if (lp) {
            lp.classList.add('v');
            
            // Force immediate opacity 1 / normal transform on hero items if animations are disabled
            const disableAnimations = window.DISABLE_ENTRANCE_ANIMATIONS || 
                                      document.querySelector('.lp-no-animations') || 
                                      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (disableAnimations) {
                document.querySelectorAll('.animate-fade-in-up, .animate-scale-in').forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                    el.style.animation = 'none';
                });
            }
        }
    }, 50);

    // Fast fallback for above-the-fold hero elements (1000ms) to ensure they are visible
    setTimeout(() => {
        const heroItems = document.querySelectorAll('.lh1, .lsub, .lctas, .lcta-match, .l-live-rivalry-preview, .lhero-right, .l-global-stats-bar');
        heroItems.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.animation = 'none';
        });
    }, 1000);

    // Update nav CTA text if logged in
    const navCta = document.getElementById('lp-nav-cta');
    if (navCta && window.appState?.isLoggedIn) {
        navCta.textContent = 'Dashboard';
    }

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

    // ── AUTO-ROTATING STATS TICKER ──
    const STATS_ROTATION_INTERVAL = 3000;
    const TOUCH_ROTATION_INTERVAL = 4500;

    const METRIC_POOL = [
        { key: 'capital_locked', label: 'Capital Locked', value: 8700000, type: 'currency_short' },
        { key: 'total_commitments', label: 'Total Commitments', value: 12483, type: 'count' },
        { key: 'settlement_success', label: 'Settlement Success', value: 96.2, type: 'percent' },
        { key: 'execution_identities', label: 'Execution Identities', value: 3442, type: 'count' },
        { key: 'active_contracts', label: 'Active Contracts', value: 1206, type: 'count' },
        { key: 'avg_contract_size', label: 'Average Contract Size', value: 6940, type: 'currency' },
        { key: 'median_settlement_time', label: 'Median Settlement Time', value: 1.4, type: 'days' },
        { key: 'counterparties', label: 'Counterparties', value: 812, type: 'count' }
    ];

    function formatMetricValue(val, type) {
        if (type === 'currency_short') {
            return '$' + (val / 1000000).toFixed(1) + 'M';
        }
        if (type === 'currency') {
            return '$' + val.toLocaleString('en-US');
        }
        if (type === 'count') {
            return val.toLocaleString('en-US');
        }
        if (type === 'percent') {
            return val.toFixed(1) + '%';
        }
        if (type === 'days') {
            return val.toFixed(1) + ' days';
        }
        return val.toString();
    }

    let activeMetricIndices = [0, 1, 2, 3];
    let nextCellToSwap = 0;
    let isPaused = false;
    let isTabVisible = true;
    let isElementVisible = false;

    function performSwap() {
        const cellIndex = nextCellToSwap;
        
        // Find next metric from pool excluding every metric currently displayed in any of the four cells
        const currentMetricIndex = activeMetricIndices[cellIndex];
        const nextStartIdx = (currentMetricIndex + 1) % METRIC_POOL.length;
        let foundIdx = -1;

        for (let step = 0; step < METRIC_POOL.length; step++) {
            const candidateIdx = (nextStartIdx + step) % METRIC_POOL.length;
            if (!activeMetricIndices.includes(candidateIdx)) {
                foundIdx = candidateIdx;
                break;
            }
        }

        if (foundIdx === -1) {
            // Pool exhausted by active filter, skip this swap tick
            nextCellToSwap = (nextCellToSwap + 1) % 4;
            return;
        }

        // Update active indices list
        activeMetricIndices[cellIndex] = foundIdx;
        
        // Advance staggered cell index for the next swap
        nextCellToSwap = (nextCellToSwap + 1) % 4;

        // Perform DOM transition
        const cellEl = document.querySelector(`.l-stat-bar-item[data-cell-index="${cellIndex}"]`);
        if (!cellEl) return;

        const wrapper = cellEl.querySelector('.l-stat-bar-wrapper');
        const currentContent = wrapper?.querySelector('.l-stat-bar-content.current');
        if (!wrapper || !currentContent) return;

        const metric = METRIC_POOL[foundIdx];
        const formattedVal = formatMetricValue(metric.value, metric.type);

        const incomingContent = document.createElement('div');
        incomingContent.className = 'l-stat-bar-content incoming';
        
        const valSpan = document.createElement('span');
        valSpan.className = 'l-stat-bar-val';
        valSpan.textContent = formattedVal;
        
        const lblSpan = document.createElement('span');
        lblSpan.className = 'l-stat-bar-lbl';
        lblSpan.textContent = metric.label;

        incomingContent.appendChild(valSpan);
        incomingContent.appendChild(lblSpan);

        // Check prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            incomingContent.style.opacity = '0';
            incomingContent.style.transform = 'translateY(0)'; // No vertical transform
            wrapper.appendChild(incomingContent);
            
            // Force reflow
            incomingContent.getBoundingClientRect();
            
            currentContent.style.transition = 'opacity 150ms linear';
            currentContent.style.opacity = '0';
            
            incomingContent.style.transition = 'opacity 150ms linear';
            incomingContent.style.opacity = '1';
            
            setTimeout(() => {
                if (currentContent.parentNode === wrapper) {
                    wrapper.removeChild(currentContent);
                }
                incomingContent.classList.remove('incoming');
                incomingContent.classList.add('current');
                incomingContent.style.transition = '';
            }, 150);
        } else {
            incomingContent.style.opacity = '0';
            
            const isMobile = window.innerWidth <= 768;
            const yOffset = isMobile ? '30px' : '43px';
            incomingContent.style.transform = `translateY(${yOffset})`;
            incomingContent.style.willChange = 'transform, opacity';
            
            wrapper.appendChild(incomingContent);
            
            // Force reflow
            incomingContent.getBoundingClientRect();
            
            currentContent.style.transition = 'opacity 80ms linear';
            currentContent.style.opacity = '0';
            
            incomingContent.style.transition = 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1), opacity 480ms cubic-bezier(0.22, 1, 0.36, 1)';
            incomingContent.style.opacity = '1';
            incomingContent.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                if (currentContent.parentNode === wrapper) {
                    wrapper.removeChild(currentContent);
                }
                incomingContent.classList.remove('incoming');
                incomingContent.classList.add('current');
                incomingContent.style.willChange = '';
                incomingContent.style.transition = '';
            }, 480);
        }
    }

    // Set up pause on hover for the stats grid
    const statsBarGrid = document.querySelector('.l-stats-bar-grid');
    if (statsBarGrid) {
        statsBarGrid.addEventListener('mouseenter', () => { isPaused = true; });
        statsBarGrid.addEventListener('mouseleave', () => { isPaused = false; });
    }

    // Tab visibility handling
    const onVisibilityChange = () => {
        isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    
    // Intersection Observer for viewport visibility
    const statsSection = document.querySelector('.l-global-stats-bar');
    if (statsSection && window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isElementVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });
        observer.observe(statsSection);
    } else {
        isElementVisible = true;
    }

    // Staggered interval rotation
    const isTouch = window.matchMedia('(hover: none)').matches;
    const currentInterval = isTouch ? TOUCH_ROTATION_INTERVAL : STATS_ROTATION_INTERVAL;
    const rotationIntervalId = setInterval(() => {
        // Guard to prevent leaks/running when page changes (element destroyed)
        if (!document.body.contains(statsBarGrid)) {
            clearInterval(rotationIntervalId);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            return;
        }
        if (!isPaused && isTabVisible && isElementVisible) {
            performSwap();
        }
    }, currentInterval);
    window.landingIntervals.push(rotationIntervalId);

    // Set up hover/focus & click handlers for all cells
    const cells = document.querySelectorAll('.l-stat-bar-item');
    cells.forEach((cell, idx) => {
        cell.addEventListener('focus', () => { isPaused = true; });
        cell.addEventListener('blur', () => { isPaused = false; });
        
        cell.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Route through the main landing auth logic
            goAction('/market', 'signup');
            
            // Track event if available
            if (window.trackEvent) {
                const metricIndex = activeMetricIndices[idx];
                const metric = METRIC_POOL[metricIndex];
                window.trackEvent('stat_cell_click', { cell_index: idx, metric_key: metric?.key });
            }
        });
    });

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

                // Animate proof stats
                animateCount('live-stat-locked', totalLocked, '$');
                animateCount('live-stat-active-count', totalActive);
                animateCount('live-stat-success-rate', achievementRate, '', '%');

                // Upgraded executions stream loop
                const executionsList = [
                    { name: 'JakeVoss', action: 'completed YouTube Goal', amount: '+$1,270 paid', time: '14 sec ago' },
                    { name: 'Shopify merchant', action: 'hit revenue target', amount: '+$4,800 settled', time: '1 min ago' },
                    { name: 'X Creator', action: 'reached follower milestone', amount: '+$950 returned', time: '3 min ago' },
                    { name: 'tylerbrooks', action: 'completed Stripe Goal', amount: '+$1,500 settled', time: '5 min ago' },
                    { name: 'sarah_k', action: 'hit follower growth target', amount: '+$750 returned', time: '8 min ago' }
                ];
                let exIdx = 0;
                const scrollEl = document.getElementById('l-exec-feed-scroll');
                if (scrollEl) {
                    const renderExec = (item) => `
                        <div class="l-exec-item active">
                            <span class="l-exec-status-ok">✓</span>
                            <span class="l-exec-username">@${item.name}</span>
                            <span>${item.action}</span>
                            <span class="l-exec-amount">${item.amount}</span>
                            <span class="l-exec-time">• ${item.time}</span>
                        </div>
                    `;
                    scrollEl.innerHTML = renderExec(executionsList[0]);

                    const intervalId1 = setInterval(() => {
                        const current = scrollEl.querySelector('.l-exec-item');
                        if (current) {
                            current.classList.remove('active');
                            current.classList.add('exit');
                            setTimeout(() => current.remove(), 400);
                        }
                        exIdx = (exIdx + 1) % executionsList.length;
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = renderExec(executionsList[exIdx]);
                        const nextEl = tempDiv.firstElementChild;
                        nextEl.classList.remove('active');
                        scrollEl.appendChild(nextEl);
                        nextEl.offsetHeight; // force reflow
                        nextEl.classList.add('active');
                    }, 3500);
                    window.landingIntervals.push(intervalId1);
                }

                // Upgraded subtle Hero Contract State Ticker
                const heroStatesList = [
                    { label: 'DEPOSIT LOCKED', val: 'Match Escrowed' },
                    { label: 'MATCH ESCROWED', val: 'Yield Multiplier Active' },
                    { label: 'PROJECTED RETURN', val: 'Secured via Forfeitures' },
                    { label: 'ORACLE VERIFIED', val: 'API Oracle Resolved' },
                    { label: 'RECENT SETTLEMENT', val: 'Payout Executed' }
                ];
                let hStateIdx = 0;
                const stateValEl = document.getElementById('lc-live-state-val');
                const stateLblEl = document.querySelector('.lc-live-state-lbl');
                if (stateValEl && stateLblEl) {
                    const intervalId2 = setInterval(() => {
                        hStateIdx = (hStateIdx + 1) % heroStatesList.length;
                        stateValEl.style.opacity = '0';
                        stateLblEl.style.opacity = '0';
                        setTimeout(() => {
                            stateLblEl.textContent = heroStatesList[hStateIdx].label;
                            stateValEl.textContent = heroStatesList[hStateIdx].val;
                            stateValEl.style.opacity = '1';
                            stateLblEl.style.opacity = '1';
                        }, 300);
                    }, 4000);
                    window.landingIntervals.push(intervalId2);
                }

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
                    const intervalId3 = setInterval(() => {
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
                    window.landingIntervals.push(intervalId3);
                }

                // ═══ REAL COLLATERAL CONTRACT CARDS DECK CAROUSEL CONTROLLER ═══
                let realCardIndex = 0; // 0: Stripe Revenue, 1: Shopify Sales, 2: X Audience Growth
                const totalRealCards = 3;

                const updateRealCardPositions = () => {
                    const card0 = document.getElementById('lfan-card-0');
                    const card1 = document.getElementById('lfan-card-1');
                    const card2 = document.getElementById('lfan-card-2');
                    const cards = [card0, card1, card2].filter(Boolean);

                    cards.forEach((card, i) => {
                        let diff = (i - realCardIndex) % totalRealCards;
                        if (diff < -1) diff += totalRealCards;
                        if (diff > 1) diff -= totalRealCards;

                        card.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden');
                        if (diff === 0) {
                            card.classList.add('is-center');
                        } else if (diff === 1 || diff === -2) {
                            card.classList.add('is-right');
                        } else {
                            card.classList.add('is-left');
                        }
                    });
                };

                const nextRealCard = () => {
                    realCardIndex = (realCardIndex + 1) % totalRealCards;
                    updateRealCardPositions();
                };

                const prevRealCard = () => {
                    realCardIndex = (realCardIndex - 1 + totalRealCards) % totalRealCards;
                    updateRealCardPositions();
                };

                updateRealCardPositions();

                const prevBtn = document.getElementById('lfan-prev');
                const nextBtn = document.getElementById('lfan-next');
                if (prevBtn) prevBtn.onclick = prevRealCard;
                if (nextBtn) nextBtn.onclick = nextRealCard;

                // Click card to advance
                [0, 1, 2].forEach(idx => {
                    const card = document.getElementById(`lfan-card-${idx}`);
                    if (card) {
                        card.onclick = () => {
                            if (idx !== realCardIndex) {
                                realCardIndex = idx;
                                updateRealCardPositions();
                            }
                        };
                    }
                });

                // Auto-advance every 5 seconds
                let isRealPaused = false;
                const realAutoTimer = setInterval(() => {
                    if (!isRealPaused) nextRealCard();
                }, 5000);
                window.landingIntervals.push(realAutoTimer);

                const deckContainer = document.getElementById('lfan-deck-container');
                if (deckContainer) {
                    deckContainer.addEventListener('mouseenter', () => { isRealPaused = true; });
                    deckContainer.addEventListener('mouseleave', () => { isRealPaused = false; });
                    deckContainer.addEventListener('keydown', (e) => {
                        if (e.key === 'ArrowLeft') prevRealCard();
                        if (e.key === 'ArrowRight') nextRealCard();
                    });
                }

                // Populate Live Settlement Activity Table (Option B Compressed)
                const tbodyProd = document.getElementById('lledger-tbody-prod');
                if (tbodyProd) {
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

                        const getMaskedUser = (user) => {
                            if (!user) return 'user';
                            return user.length > 5 ? user.slice(0, 5) + '...' : user;
                        };

                        const renderRow = (e) => {
                            const isHit = e.eventType === 'SETTLED_SUCCESS' || e.eventType === 'RIVALRY_SETTLED';
                            const isMiss = e.eventType === 'SETTLED_FAILURE' || e.eventType === 'RIVALRY_EXPIRED' || e.eventType === 'RIVALRY_CANCELLED';
                            let outcomeHtml = '';
                            if (isHit) {
                                outcomeHtml = `<span class="td-outcome hit"><span class="outcome-marker-hit">✓</span> Hit</span>`;
                            } else if (isMiss) {
                                outcomeHtml = `<span class="td-outcome miss"><span class="outcome-marker-miss">✗</span> Missed</span>`;
                            } else {
                                outcomeHtml = `<span class="td-outcome tracking" style="color:var(--t3);"><span class="outcome-marker-tracking">●</span> Active</span>`;
                            }
                            const depositCents = e.lockAmountUsdCents || e.amountUsdCents || 25000;
                            const depositFormatted = '$' + (depositCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            return `
                                <tr class="reveal-item v">
                                    <td data-label="Contract ID" class="td-id"><span class="td-value">#C-${e.contractId.slice(0, 4).toUpperCase()} <span class="td-user">@${getMaskedUser(e.principal)}</span></span></td>
                                    <td data-label="Metric" class="td-metric"><span class="td-value">${getPlatformIcon(e.platform)} ${getPlatformName(e.platform)}</span></td>
                                    <td data-label="Commitment" class="td-capital"><span class="td-value">${depositFormatted}</span></td>
                                    <td data-label="Outcome" class="td-outcome"><span class="td-value">${outcomeHtml}</span></td>
                                </tr>
                            `;
                        };

                        const updateLedgerTable = () => {
                            const rows = [];
                            const itemsToShow = Math.min(3, ledgerEvents.length);
                            for (let k = 0; k < itemsToShow; k++) {
                                const idx = (startIndex + k) % ledgerEvents.length;
                                rows.push(renderRow(ledgerEvents[idx]));
                            }
                            tbodyProd.innerHTML = rows.join('');
                            
                            // Immediately reveal items if parent section is already active
                            const parentSection = document.querySelector('.lreal-results');
                            if (parentSection && parentSection.classList.contains('v')) {
                                tbodyProd.querySelectorAll('.reveal-item').forEach((row) => {
                                    row.classList.add('v');
                                    row.style.transform = '';
                                    row.style.transitionDelay = '';
                                });
                            }
                        };

                        updateLedgerTable();

                        if (ledgerEvents.length > 3) {
                            const intervalId4 = setInterval(() => {
                                tbodyProd.classList.add('fade-out');
                                setTimeout(() => {
                                     startIndex = (startIndex + 1) % ledgerEvents.length;
                                     updateLedgerTable();
                                     tbodyProd.classList.remove('fade-out');
                                }, 400);
                            }, 4000);
                            window.landingIntervals.push(intervalId4);
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
    ['lp-hero-cta', 'lp-final-cta', 'lp-mini-cta'].forEach(id => {
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
    const specData = {
        STRIPE: {
            title: 'Revenue Growth Contract',
            desc: 'Secure performance matched yield on Stripe revenue volume increases.',
            deposit: '$250 – $3,000',
            yield: '2.5x Multiplier',
            window: '30 Days',
            api: 'Stripe Balance & Payout APIs v3',
            live: '48 Active contracts currently tracking',
            urgent: false
        },
        X: {
            title: 'Follower Growth Contract',
            desc: 'Escrow capital to verify audience growth targets via X (formerly Twitter).',
            deposit: '$500 – $5,000',
            yield: '4.0x Multiplier',
            window: '14 Days',
            api: 'X API v2 User Metrics Endpoint',
            live: '$82k Capital Locked in custody escrow',
            urgent: false
        },
        SHOPIFY: {
            title: 'Store Sales Contract',
            desc: 'Pledge performance bounds on Shopify merchant net order sales.',
            deposit: '$100 – $1,500',
            yield: '1.5x Multiplier',
            window: '30 Days',
            api: 'Shopify Admin Order REST API',
            live: 'Oracle connection status: OPERATIONAL',
            urgent: false
        },
        YOUTUBE: {
            title: 'Subscriber Growth Contract',
            desc: 'Verify YouTube creator audience milestone targets with matching yield.',
            deposit: '$250 – $3,000',
            yield: '2.5x Multiplier',
            window: '30 Days',
            api: 'YouTube Analytics API v2',
            live: 'Urgent: 3 Hours remaining on matching round',
            urgent: true
        }
    };

    let targetExecUrl = '/market';

    // Unified Event Delegation for Landing Page Overlays (Spec Modal + Rivalry Modal)
    document.addEventListener('click', (e) => {
        try {
            // ═══ A. CONTRACT SPECIFICATION OVERLAY MODAL ═══
            // 1. Card Container Click
            const card = e.target.closest('.lcard');
            if (card) {
                e.preventDefault();
                e.stopPropagation();
                const btn = card.querySelector('.lp-cta-btn');
                if (!btn) return;
                
                const source = btn.getAttribute('data-source') || 'STRIPE';
                const tier = btn.getAttribute('data-tier') || 'stake';
                const capital = btn.getAttribute('data-capital') || '250';
                
                const data = specData[source.toUpperCase()] || specData.STRIPE;
                
                const nameEl = document.getElementById('l-spec-platform-name');
                const tierEl = document.getElementById('l-spec-tier-name');
                const titleEl = document.getElementById('l-spec-title');
                const descEl = document.getElementById('l-spec-desc');
                const depEl = document.getElementById('l-spec-deposit-range');
                const yldEl = document.getElementById('l-spec-bonus-yield');
                const winEl = document.getElementById('l-spec-window');
                const apiEl = document.getElementById('l-spec-verification-api');
                const statEl = document.getElementById('l-spec-live-stat');
                
                if (nameEl) nameEl.textContent = source;
                if (tierEl) tierEl.textContent = tier.replace('_', ' ');
                if (titleEl) titleEl.textContent = data.title;
                if (descEl) descEl.textContent = data.desc;
                if (depEl) depEl.textContent = data.deposit;
                if (yldEl) yldEl.textContent = data.yield;
                if (winEl) winEl.textContent = data.window;
                if (apiEl) apiEl.textContent = data.api;
                if (statEl) statEl.textContent = data.live;
                
                const liveBar = document.getElementById('l-spec-live-stat-bar');
                if (liveBar) {
                    if (data.urgent) {
                        liveBar.classList.add('urgent');
                    } else {
                        liveBar.classList.remove('urgent');
                    }
                }
                
                targetExecUrl = `/contracts/execute?source=${source}&tier=${tier}&capital=${capital}`;
                
                const overlay = document.getElementById('contract-spec-overlay');
                if (overlay) {
                    overlay.classList.add('active');
                }
                
                if (window.trackEvent) window.trackEvent('cta_spec_open', { source, tier, capital, ...utm });
                return;
            }
    
            // 2. Spec Close Button Click
            const specClose = e.target.closest('#l-spec-modal-close-btn');
            if (specClose) {
                e.preventDefault();
                e.stopPropagation();
                const overlay = document.getElementById('contract-spec-overlay');
                if (overlay) overlay.classList.remove('active');
                return;
            }
    
            // 3. Spec Execute Button Click
            const specExec = e.target.closest('#l-spec-execute-btn');
            if (specExec) {
                e.preventDefault();
                e.stopPropagation();
                const overlay = document.getElementById('contract-spec-overlay');
                if (overlay) overlay.classList.remove('active');
                goAction(targetExecUrl, 'signup');
                return;
            }
    
            // 4. Spec Backdrop Click
            const specOverlay = document.getElementById('contract-spec-overlay');
            if (specOverlay && e.target === specOverlay) {
                e.preventDefault();
                e.stopPropagation();
                specOverlay.classList.remove('active');
                return;
            }
    
            // ═══ B. RIVALRY QUICK-VIEW OVERLAY MODAL ═══
            // 1. Rivalry Preview Card Click
            const rivalryCard = e.target.closest('#l-live-rivalry-preview-card');
            if (rivalryCard) {
                e.preventDefault();
                e.stopPropagation();
                const overlay = document.getElementById('rivalry-quick-view-overlay');
                if (overlay) overlay.classList.add('active');
                return;
            }
    
            // 2. Rivalry Close Button Click
            const rivalryClose = e.target.closest('#l-modal-close-btn');
            if (rivalryClose) {
                e.preventDefault();
                e.stopPropagation();
                const overlay = document.getElementById('rivalry-quick-view-overlay');
                if (overlay) overlay.classList.remove('active');
                return;
            }
    
            // 3. Rivalry Action Button Click
            const rivalryAction = e.target.closest('#l-modal-action-btn');
            if (rivalryAction) {
                e.preventDefault();
                e.stopPropagation();
                const overlay = document.getElementById('rivalry-quick-view-overlay');
                if (overlay) overlay.classList.remove('active');
                window.router.navigate('/market?type=rivalry');
                return;
            }
    
            // 4. Rivalry Backdrop Click
            const rivalryOverlay = document.getElementById('rivalry-quick-view-overlay');
            if (rivalryOverlay && e.target === rivalryOverlay) {
                e.preventDefault();
                e.stopPropagation();
                rivalryOverlay.classList.remove('active');
                return;
            }
        } catch (clickErr) {
            console.error('[Landing Click Error]', clickErr);
            alert('[Landing Click Error]: ' + clickErr.message + '\n' + clickErr.stack);
        }
    });

    // FAQ
    document.querySelectorAll('.fq').forEach(item => {
        item.querySelector('.fq-q')?.addEventListener('click', () => item.classList.toggle('open'));
    });

    // Scroll reveal observer with programmatic stagger delays & post-transition cleanup
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const section = e.target;
                section.classList.add('v');
                
                // Honor global config flag or prefers-reduced-motion media query
                const disableAnimations = window.DISABLE_ENTRANCE_ANIMATIONS || 
                                          document.querySelector('.lp-no-animations') || 
                                          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                const items = section.querySelectorAll('.reveal-item');
                items.forEach((item, idx) => {
                    if (disableAnimations) {
                        item.style.transitionDelay = '0ms';
                        item.style.transition = 'none';
                        item.style.transform = 'none';
                        item.style.opacity = '1';
                    } else {
                        item.style.transitionDelay = `${idx * 80}ms`;
                        // Remove inline transform and transition delay after transition finishes
                        setTimeout(() => {
                            item.style.transform = '';
                            item.style.transitionDelay = '';
                        }, 1000 + idx * 80);
                    }
                    item.classList.add('v');
                });
                
                obs.unobserve(section);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
    
    const revealEls = document.querySelectorAll('[data-r]');
    console.log("[ScrollReveal] Observer initialized. Observing elements count:", revealEls.length);
    revealEls.forEach(el => obs.observe(el));

    // Global safety fallback: force all elements to final visible state after 1.5s
    setTimeout(() => {
        console.log("[ScrollReveal] Safety fallback triggered. Forcing all animations to complete.");
        document.querySelectorAll('.reveal-item, [data-r]').forEach(el => {
            el.classList.add('v');
            el.style.transform = '';
            el.style.transitionDelay = '';
        });
        document.querySelectorAll('.animate-fade-in-up, .animate-scale-in').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.animation = 'none';
        });
    }, 1500);

    // Count-up animation for stats (Premium cubic ease-out, fast 800ms)
    const countEls = document.querySelectorAll('[data-count]');
    console.log("[CountUp] Observer initialized. Target elements count:", countEls.length);
    if (countEls.length) {
        const countObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const target = parseFloat(el.dataset.count);
                    console.log("[CountUp] Starting count animation for target:", target, el);
                    
                    const disableAnimations = window.DISABLE_ENTRANCE_ANIMATIONS || 
                                              document.querySelector('.lp-no-animations') || 
                                              window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    
                    if (disableAnimations) {
                        el.textContent = target;
                        countObs.unobserve(el);
                        return;
                    }
                    
                    const duration = 800; // Fast 800ms ease-out count-up
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
    // Mouse parallax for contract card (subtle Apple TV tilt)
    const activityCard = document.querySelector('.lactivity-card');
    if (activityCard) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5);
            const mouseY = (e.clientY / window.innerHeight - 0.5);
            
    // Extremely subtle tilt on the contract card (1.5deg max)
            const rx = mouseY * -1.5;
            const ry = mouseX * 1.5;
            activityCard.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg) translateY(-2px)`;
        }, { passive: true });
    }

    // Direct explicit backup event listeners for card clicks and spec modals
    document.querySelectorAll('.lcard').forEach(card => {
        card.addEventListener('click', (e) => {
            const btn = card.querySelector('.lp-cta-btn');
            if (!btn) return;
            const source = btn.getAttribute('data-source') || 'STRIPE';
            const tier = btn.getAttribute('data-tier') || 'stake';
            const capital = btn.getAttribute('data-capital') || '250';
            
            const data = specData[source.toUpperCase()] || specData.STRIPE;
            
            const nameEl = document.getElementById('l-spec-platform-name');
            const tierEl = document.getElementById('l-spec-tier-name');
            const titleEl = document.getElementById('l-spec-title');
            const descEl = document.getElementById('l-spec-desc');
            const depEl = document.getElementById('l-spec-deposit-range');
            const yldEl = document.getElementById('l-spec-bonus-yield');
            const winEl = document.getElementById('l-spec-window');
            const apiEl = document.getElementById('l-spec-verification-api');
            const statEl = document.getElementById('l-spec-live-stat');
            
            if (nameEl) nameEl.textContent = source;
            if (tierEl) tierEl.textContent = tier.replace('_', ' ');
            if (titleEl) titleEl.textContent = data.title;
            if (descEl) descEl.textContent = data.desc;
            if (depEl) depEl.textContent = data.deposit;
            if (yldEl) yldEl.textContent = data.yield;
            if (winEl) winEl.textContent = data.window;
            if (apiEl) apiEl.textContent = data.api;
            if (statEl) statEl.textContent = data.live;
            
            const liveBar = document.getElementById('l-spec-live-stat-bar');
            if (liveBar) {
                if (data.urgent) {
                    liveBar.classList.add('urgent');
                } else {
                    liveBar.classList.remove('urgent');
                }
            }
            
            targetExecUrl = `/contracts/execute?source=${source}&tier=${tier}&capital=${capital}`;
            
            const overlay = document.getElementById('contract-spec-overlay');
            if (overlay) {
                overlay.classList.add('active');
            }
        });
    });

    document.getElementById('l-spec-modal-close-btn')?.addEventListener('click', (e) => {
        document.getElementById('contract-spec-overlay')?.classList.remove('active');
    });

    document.getElementById('l-spec-execute-btn')?.addEventListener('click', (e) => {
        document.getElementById('contract-spec-overlay')?.classList.remove('active');
        goAction(targetExecUrl, 'signup');
    });

    document.getElementById('l-live-rivalry-preview-card')?.addEventListener('click', (e) => {
        document.getElementById('rivalry-quick-view-overlay')?.classList.add('active');
    });

    document.getElementById('l-modal-close-btn')?.addEventListener('click', (e) => {
        document.getElementById('rivalry-quick-view-overlay')?.classList.remove('active');
    });

    document.getElementById('l-modal-action-btn')?.addEventListener('click', (e) => {
        document.getElementById('rivalry-quick-view-overlay')?.classList.remove('active');
        window.router.navigate('/market?type=rivalry');
    });
}

