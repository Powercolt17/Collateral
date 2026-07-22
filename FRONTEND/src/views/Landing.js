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
                <!-- PROCEDURAL HERO BACKGROUND SYSTEM -->
                <div class="lhero-bg-light-orb"></div>
                
                <div class="lw">
                    <div class="lhero-main-wrap">
                        <!-- HERO LOWER FLEX CONTENT -->
                        <div class="lhero-bottom-area">
                            <div class="lhero-grid">
                                <!-- LEFT COLUMN -->
                                <div class="lhero-left">
                                    <!-- MASSIVE DISPLAY TYPOGRAPHY HEADLINE -->
                                    <div class="lhero-headline-wrap">
                                        <h1 class="lh1 animate-fade-in-up">
                                            YOUR BIGGEST BET<br>
                                            SHOULD BE ON <span class="lh-gradient">YOU.</span>
                                        </h1>
                                    </div>
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

                                <!-- RIGHT COLUMN: 3 COMPACT FANNED COLLATERAL CONTRACT CARDS DECK -->
                                <div class="lhero-right animate-fade-in-up delay-2">
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
                                                        <div class="lc-flow-footnote">Matches are funded by forfeited deposits and sponsors. <a href="#engine-section" class="lc-flow-link" onclick="document.getElementById('engine-section')?.scrollIntoView({behavior:'smooth'}); return false;">How it works →</a></div>
                                                        <div class="lc-live-state-ticker">
                                                            <span class="lc-live-state-lbl">PROTOCOL STATE</span>
                                                            <span class="lc-live-state-val">Deposit Escrowed</span>
                                                        </div>
                                                    </div>
                                                    <div class="lc-trust" style="margin-top: 12px; padding-top: 10px;">
                                                        <svg class="lc-trust-lock" width="10" height="10" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="currentColor"/></svg>
                                                        Verified automatically via Connected API.
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
                                                        <div class="lc-flow-footnote">Matches are funded by forfeited deposits and sponsors. <a href="#engine-section" class="lc-flow-link" onclick="document.getElementById('engine-section')?.scrollIntoView({behavior:'smooth'}); return false;">How it works →</a></div>
                                                        <div class="lc-live-state-ticker">
                                                            <span class="lc-live-state-lbl">PROTOCOL STATE</span>
                                                            <span class="lc-live-state-val">Yield Multiplier Active</span>
                                                        </div>
                                                    </div>
                                                    <div class="lc-trust" style="margin-top: 12px; padding-top: 10px;">
                                                        <svg class="lc-trust-lock" width="10" height="10" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="currentColor"/></svg>
                                                        Verified automatically via Connected API.
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
                                                        <div class="lc-flow-footnote">Matches are funded by forfeited deposits and sponsors. <a href="#engine-section" class="lc-flow-link" onclick="document.getElementById('engine-section')?.scrollIntoView({behavior:'smooth'}); return false;">How it works →</a></div>
                                                        <div class="lc-live-state-ticker">
                                                            <span class="lc-live-state-lbl">PROTOCOL STATE</span>
                                                            <span class="lc-live-state-val">Escrow Verified</span>
                                                        </div>
                                                    </div>
                                                    <div class="lc-trust" style="margin-top: 12px; padding-top: 10px;">
                                                        <svg class="lc-trust-lock" width="10" height="10" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="currentColor"/></svg>
                                                        Verified automatically via Connected API.
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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





            <!-- TRUST COPY FOR MOBILE ONLY -->
            <div class="lc-trust lmobile-only" style="margin-top: 16px; border-top: none; padding-top: 0; margin-bottom: 24px;">
                <svg class="lc-trust-lock" width="10" height="10" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="currentColor"/></svg>
                Contracts verified automatically through connected APIs.
            </div>



            <!-- ═══ CONTRACT TYPES ═══ -->
            <div class="lw" style="padding-top: 80px; padding-bottom: 40px;">
                <div class="ltypes-asymmetric" data-r>
                    <div class="ltypes-left">
                        <div class="lred-dash reveal-item"><span class="lmono">Contract Types</span></div>
                        <h2 class="ltypes-headline reveal-item">Pick your<br><span class="lh-gradient">opponent.</span></h2>
                        <p class="ltypes-sub reveal-item">Choose your execution mode. Lock your own capital behind a goal — hit it and you keep everything, miss it and you forfeit. Go Solo to hold yourself accountable, or enter Rivalry to stake head-to-head against a competitor. Winner takes the pool.</p>
                        
                        <!-- 3-STEP MECHANISM SUMMARY -->
                        <div class="ltypes-steps reveal-item">
                            <div class="ltypes-step-item">
                                <span class="ltypes-step-num">1</span>
                                <span class="ltypes-step-text">Set a goal and lock a deposit.</span>
                            </div>
                            <div class="ltypes-step-item">
                                <span class="ltypes-step-num">2</span>
                                <span class="ltypes-step-text">Execute before the deadline.</span>
                            </div>
                            <div class="ltypes-step-item">
                                <span class="ltypes-step-num">3</span>
                                <span class="ltypes-step-text"><strong>Hit target:</strong> reclaim capital + yield. <strong>Miss:</strong> forfeit to pool.</span>
                            </div>
                        </div>

                        <div class="ltypes-cta-wrap reveal-item">
                            <button class="lbtn lbtn-r" id="ltypes-start-cta" onclick="window.app.goAction('/market', 'signup')">
                                START CONTRACT <span class="lbtn-arrow">→</span>
                            </button>
                        </div>
                    </div>

                    <div class="ltypes-right">
                        <!-- IMAGE-ONLY MODE CAROUSEL WITH SYNCHRONIZED BADGE -->
                        <div class="mode-image-carousel" id="mode-image-carousel">
                            <!-- SYNCHRONIZED MODE PILL BADGES -->
                            <div class="mode-badge-wrap">
                                <span class="mode-badge-pill is-solo active" id="mode-badge-0">
                                    <span class="mode-badge-dot"></span> SOLO MODE · YOU VS. YOURSELF
                                </span>
                                <span class="mode-badge-pill is-rivalry" id="mode-badge-1">
                                    <span class="mode-badge-dot secondary"></span> RIVALRY MODE · YOU VS. COMPETITORS
                                </span>
                            </div>

                            <div class="mode-carousel-viewport">
                                <div class="mode-carousel-slide active" id="mode-slide-0">
                                    <picture>
                                        <source srcset="/assets/images/solo-seal.webp" type="image/webp">
                                        <img src="/assets/images/solo-seal.png" alt="Solo Mode Seal" loading="eager">
                                    </picture>
                                </div>
                                <div class="mode-carousel-slide" id="mode-slide-1">
                                    <picture>
                                        <source srcset="/assets/images/rivalry-seal.webp" type="image/webp">
                                        <img src="/assets/images/rivalry-seal.png" alt="Rivalry Mode Seal" loading="lazy">
                                    </picture>
                                </div>
                            </div>
                            <div class="mode-carousel-dots">
                                <span class="mode-carousel-dot active" id="mode-img-dot-0" data-slide="0"></span>
                                <span class="mode-carousel-dot" id="mode-img-dot-1" data-slide="1"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ LIVE CONTRACT EXAMPLES ═══ -->
            <div class="lcontracts" id="contracts" data-r>
                <div class="lw">
                    <div class="reveal-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                        <div class="lred-dash" style="margin-bottom: 0;"><span class="lmono">Open Contracts</span></div>
                        
                        <!-- ═══ OPEN CONTRACTS STATS ═══ -->
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="width: 6px; height: 6px; background: #145c14; border-radius: 50%; box-shadow: 0 0 10px rgba(20,92,20,0.8);"></span>
                            <span style="font-family: 'Inter Tight', sans-serif; font-weight: 700; color: #145c14; font-size: 15px; letter-spacing: -0.2px;">$14.6k</span>
                            <span style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.05em;">Total Escrow · Solo & Rivalry Contracts</span>
                        </div>
                    </div>

                    <!-- ═══ TIER SYSTEM LEGEND BAR ═══ -->
                    <div class="ltier-legend-bar reveal-item">
                        <div class="ltier-legend-item">
                            <span class="lcard-tier tier-pledge">Pledge 1.5x</span>
                            <span class="ltier-legend-desc">Moderate target · 30-day window · Grace period</span>
                        </div>
                        <div class="ltier-legend-item">
                            <span class="lcard-tier tier-stake">Stake 2.5x</span>
                            <span class="ltier-legend-desc">Standard target · 30-day window · Full forfeit</span>
                        </div>
                        <div class="ltier-legend-item">
                            <span class="lcard-tier tier-allin">All-In 4.0x</span>
                            <span class="ltier-legend-desc">Aggressive target · 14-day window · Full forfeit</span>
                        </div>
                    </div>

                    <div class="lcards">
                        <!-- CARD 1: SOLO CONTRACT (STRIPE REVENUE) -->
                        <div class="lcard lcard-popular reveal-item">
                            <div class="lcard-top">
                                <span class="lcard-src"><svg class="lcard-src-logo" viewBox="0 0 24 24" fill="currentColor" style="color:#635BFF;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M20 10.3c0-1.8-1.5-2.7-3.6-3.2l-2-.5c-1.3-.3-1.9-.7-1.9-1.3 0-.6.7-1 1.7-1 1.7 0 3 .6 3.6 1l.7-2.6C17.9 2.2 16.3 1.8 14.8 1.8c-3.1 0-5.2 1.6-5.2 4.3 0 2.9 2.4 3.7 4.9 4.3l1.8.4c1.4.3 2 .8 2 1.5 0 .7-.8 1.1-2.1 1.1-1.9 0-3.6-.7-4.3-1.1l-.8 2.7c1 .5 2.9 1 4.7 1C18.2 16 20 14.4 20 10.3z"/></svg>Stripe</span>
                                <span class="lcard-tier tier-stake">Stake</span>
                            </div>
                            <div class="lcard-title">Revenue Growth</div>
                            <div class="lcard-target">+20% Revenue growth</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Total Return</span><span class="v">2.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-live-indicator">
                                <span class="lcard-live-dot"></span>
                                <span class="lcard-live-text">$2.4k in escrow</span>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="STRIPE" data-tier="stake" data-capital="250">Start Contract</button></div>
                        </div>

                        <!-- CARD 2: RIVALRY CONTRACT (X / TWITTER AUDIENCE) -->
                        <div class="lcard lcard-rivalry reveal-item">
                            <div class="lcard-riv-top">
                                <div class="lcard-riv-status">
                                    <span class="lcard-riv-dot"></span> LOCKED
                                </div>
                                <div class="lcard-riv-id-wrap">
                                    <span class="lcard-riv-title">AUDIENCE</span>
                                    <span class="lcard-riv-id">ID:7B92A41E</span>
                                </div>
                            </div>
                            <div class="lcard-riv-match-grid">
                                <div class="lcard-riv-col is-left">
                                    <span class="lcard-riv-role">CHALLENGER</span>
                                    <div class="lcard-riv-user"><span class="user-dot green"></span> jakevoss</div>
                                    <div class="lcard-riv-score green">+12.4%</div>
                                </div>
                                <div class="lcard-riv-swords">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="14.5" y1="17.5" x2="3" y2="6"></line>
                                        <polyline points="3 10 3 6 7 6"></polyline>
                                        <line x1="9.5" y1="6.5" x2="21" y2="18"></line>
                                        <polyline points="21 14 21 18 17 18"></polyline>
                                    </svg>
                                </div>
                                <div class="lcard-riv-col is-right">
                                    <span class="lcard-riv-role">OPPONENT</span>
                                    <div class="lcard-riv-user">marcus <span class="user-dot maroon"></span></div>
                                    <div class="lcard-riv-score maroon">+9.2%</div>
                                </div>
                            </div>
                            <div class="lcard-riv-progress-wrap">
                                <div class="lcard-riv-bar-green" style="width: 58%;"></div>
                                <div class="lcard-riv-bar-maroon" style="width: 42%;"></div>
                            </div>
                            <div class="lcard-riv-footer">
                                <div class="lcard-riv-exposure">
                                    <div class="lcard-riv-exp-val">$5,000</div>
                                    <div class="lcard-riv-exp-lbl">CAPITAL EXPOSURE</div>
                                </div>
                                <div class="lcard-riv-badge-area">
                                    <span class="lcard-src-tag x">X / TWITTER</span>
                                    <div class="lcard-riv-time">14D REMAINING</div>
                                </div>
                            </div>
                            <div class="lcard-btn">
                                <button class="lp-cta-btn" data-source="X" data-tier="rivalry" data-capital="5000">Start Contract</button>
                            </div>
                        </div>

                        <!-- CARD 3: SOLO CONTRACT (SHOPIFY STORE SALES) -->
                        <div class="lcard reveal-item">
                            <div class="lcard-top">
                                <span class="lcard-src"><svg class="lcard-src-logo" viewBox="0 0 24 24" fill="currentColor" style="color:#96bf48;width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M19.58 6.425a.86.86 0 00-.7-.34h-2.193a4.52 4.52 0 00-9.04 0H5.454a.86.86 0 00-.7.34.887.887 0 00-.16.766l1.97 10.96a2.41 2.41 0 002.37 1.986h6.49a2.41 2.41 0 002.37-1.985l1.97-10.96a.887.887 0 00-.184-.767zM12 3.86a2.53 2.53 0 012.513 2.225H9.487A2.53 2.53 0 0112 3.86zm3.267 11.516a2.036 2.036 0 01-1.745.892 2.374 2.374 0 01-1.614-.648A2.348 2.348 0 0010.3 15a2.036 2.036 0 01-1.745-.892.429.429 0 11.734-.442c.245.408.66.634 1.01.634.341 0 .614-.148.914-.442A3.21 3.21 0 0113.627 15c.341 0 .614-.148.914-.442a.429.429 0 01.734.442z"/></svg>Shopify</span>
                                <span class="lcard-tier tier-pledge">Pledge</span>
                            </div>
                            <div class="lcard-title">Store Sales</div>
                            <div class="lcard-target">+$5,000 Net Sales</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$100 – $1,500</span></div>
                            <div class="lcard-row"><span class="k">Total Return</span><span class="v">1.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-live-indicator">
                                <span class="lcard-live-dot"></span>
                                <span class="lcard-live-text">$1.2k in escrow</span>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="SHOPIFY" data-tier="pledge" data-capital="100">Start Contract</button></div>
                        </div>

                        <!-- CARD 4: RIVALRY CONTRACT (STRIPE REVENUE - IMAGE 2 EXACT MATCH) -->
                        <div class="lcard lcard-rivalry reveal-item">
                            <div class="lcard-riv-top">
                                <div class="lcard-riv-status">
                                    <span class="lcard-riv-dot"></span> LOCKED
                                </div>
                                <div class="lcard-riv-id-wrap">
                                    <span class="lcard-riv-title">REVENUE</span>
                                    <span class="lcard-riv-id">ID:34D63CA3</span>
                                </div>
                            </div>
                            <div class="lcard-riv-match-grid">
                                <div class="lcard-riv-col is-left">
                                    <span class="lcard-riv-role">CHALLENGER</span>
                                    <div class="lcard-riv-user"><span class="user-dot green"></span> revpilot</div>
                                    <div class="lcard-riv-score green">+8.1%</div>
                                </div>
                                <div class="lcard-riv-swords">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="14.5" y1="17.5" x2="3" y2="6"></line>
                                        <polyline points="3 10 3 6 7 6"></polyline>
                                        <line x1="9.5" y1="6.5" x2="21" y2="18"></line>
                                        <polyline points="21 14 21 18 17 18"></polyline>
                                    </svg>
                                </div>
                                <div class="lcard-riv-col is-right">
                                    <span class="lcard-riv-role">OPPONENT</span>
                                    <div class="lcard-riv-user">quotaops <span class="user-dot maroon"></span></div>
                                    <div class="lcard-riv-score maroon">+5.4%</div>
                                </div>
                            </div>
                            <div class="lcard-riv-progress-wrap">
                                <div class="lcard-riv-bar-green" style="width: 60%;"></div>
                                <div class="lcard-riv-bar-maroon" style="width: 40%;"></div>
                            </div>
                            <div class="lcard-riv-footer">
                                <div class="lcard-riv-exposure">
                                    <div class="lcard-riv-exp-val">$2,000</div>
                                    <div class="lcard-riv-exp-lbl">CAPITAL EXPOSURE</div>
                                </div>
                                <div class="lcard-riv-badge-area">
                                    <span class="lcard-src-tag stripe">STRIPE</span>
                                    <div class="lcard-riv-time">0H REMAINING</div>
                                </div>
                            </div>
                            <div class="lcard-btn">
                                <button class="lp-cta-btn" data-source="STRIPE" data-tier="rivalry" data-capital="2000">Start Contract</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ VISUAL CENTERPIECE: CONTINUOUS MONEY FLOW SCHEMATIC ═══ -->
            <div class="lengine-section" id="engine-section" data-r>
                <div class="lw">
                    <div class="lengine-hdr-wrap">
                        <div class="lengine-tag">
                            <span class="l-lr-dot l-ticker-pulse"></span> AUTOMATED EXECUTION SCHEMATIC
                        </div>
                        <h2 class="lengine-h2">HOW MONEY FLOWS ON COLLATERAL</h2>
                        <p class="lengine-sub">
                            Every deposit is governed by custodial escrow and automated API verification. Winners receive their principal plus matching yield funded by forfeited deposits and brand sponsors.
                        </p>
                    </div>

                    <!-- SCHEMATIC: CSS GRID LAYOUT (no absolute positioning) -->
                    <div class="lflow-container">

                        <!-- DESKTOP FLOW (hidden <900px) -->
                        <div class="lflow-desktop">
                            <!-- NODE ROW — CSS Grid handles horizontal containment -->
                            <div class="lflow-row">
                                <!-- NODE: DEPOSIT IN -->
                                <div class="lflow-node">
                                    <div class="lflow-node-hdr">INPUT</div>
                                    <div class="lflow-node-title">DEPOSIT IN</div>
                                    <div class="lflow-node-stat">$8,700,000</div>
                                    <div class="lflow-node-sub">Stripe Connect Escrow</div>
                                </div>

                                <div class="lflow-arrow">
                                    <svg width="32" height="12" viewBox="0 0 32 12"><path d="M0 6 H26 L22 2 M26 6 L22 10" stroke="#0F172A" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </div>

                                <!-- NODE: ESCROW VAULT -->
                                <div class="lflow-node lflow-node-vault" id="lflow-vault-node">
                                    <div class="lflow-node-hdr">CUSTODY</div>
                                    <div class="lflow-node-title">ESCROW VAULT</div>
                                    <div class="lflow-node-stat">$8.7M LOCKED</div>
                                    <div class="lflow-node-sub">Custodial Escrow via Stripe Connect</div>
                                </div>

                                <div class="lflow-arrow">
                                    <svg width="32" height="12" viewBox="0 0 32 12"><path d="M0 6 H26 L22 2 M26 6 L22 10" stroke="#0F172A" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </div>

                                <!-- NODE: ORACLE API -->
                                <div class="lflow-node">
                                    <div class="lflow-node-hdr">VERIFICATION</div>
                                    <div class="lflow-node-title">ORACLE API STREAM</div>
                                    <div class="lflow-node-stat">96.2% HIT RATE</div>
                                    <div class="lflow-node-sub">Stripe • Shopify • X • YouTube</div>
                                </div>

                                <!-- SPLIT ARROWS — three proportionally weighted paths fanning to outcomes -->
                                <div class="lflow-split-arrows">
                                    <svg width="44" height="180" viewBox="0 0 44 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <!-- Win path (thick green #145C14) -->
                                        <path d="M 0 90 C 16 90, 22 24, 34 24" stroke="#145C14" stroke-width="4.5" stroke-linecap="round"/>
                                        <polygon points="42,24 32,18 32,30" fill="#145C14"/>

                                        <!-- Forfeit path (medium crimson #7A1220) -->
                                        <path d="M 0 90 H 34" stroke="#7A1220" stroke-width="2.5" stroke-linecap="round"/>
                                        <polygon points="42,90 33,85 33,95" fill="#7A1220"/>

                                        <!-- Burn path (hairline dashed crimson #7A1220) -->
                                        <path d="M 0 90 C 16 90, 22 156, 34 156" stroke="#7A1220" stroke-width="1.2" stroke-dasharray="4 3" stroke-linecap="round"/>
                                        <polygon points="41,156 34,152 34,160" fill="#7A1220"/>
                                    </svg>
                                </div>

                                <!-- THREE TERMINAL OUTCOMES -->
                                <div class="lflow-outcomes">
                                    <div class="lflow-outcome is-win">
                                        <div class="lflow-outcome-indicator" style="background:#145C14;width:5px;"></div>
                                        <div class="lflow-outcome-body">
                                            <div class="lflow-out-hdr"><span class="lflow-dot" style="background:#145C14;"></span>WIN PATH (96.2%)</div>
                                            <div class="lflow-out-title">RETURNED TO CREATOR</div>
                                            <div class="lflow-out-val lflow-val-green">$8,326,200</div>
                                            <div class="lflow-out-desc">100% Principal + Matching Yield</div>
                                        </div>
                                    </div>
                                    <div class="lflow-outcome is-forfeit" id="lflow-forfeit-node">
                                        <div class="lflow-outcome-indicator" style="background:#7A1220;width:3px;"></div>
                                        <div class="lflow-outcome-body">
                                            <div class="lflow-out-hdr"><span class="lflow-dot" style="background:#7A1220;"></span>FORFEITED (3.8%)</div>
                                            <div class="lflow-out-title">FORFEITED DEPOSITS</div>
                                            <div class="lflow-out-val lflow-val-crimson">$330,600</div>
                                            <div class="lflow-out-desc">Feeds Winner Match Pool</div>
                                        </div>
                                    </div>
                                    <div class="lflow-outcome is-burn">
                                        <div class="lflow-outcome-indicator" style="background:#7A1220;width:1px;"></div>
                                        <div class="lflow-outcome-body">
                                            <div class="lflow-out-hdr"><span class="lflow-dot" style="background:#7A1220;"></span>PROTOCOL FEE (0.5%)</div>
                                            <div class="lflow-out-title">CLTR BURNED</div>
                                            <div class="lflow-out-val">$43,200</div>
                                            <div class="lflow-out-desc">Permanently Destroyed</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- RECIRCULATING LOOP — routed SVG path below node row -->
                            <div class="lflow-loop-wrap">
                                <svg class="lflow-loop-svg" viewBox="0 0 1000 60" preserveAspectRatio="none">
                                    <defs>
                                        <marker id="ah-loop" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                            <path d="M0 1 L8 5 L0 9z" fill="#7A1220"/>
                                        </marker>
                                    </defs>
                                    <!-- Path: exits from ~85% (forfeit card), routes down, runs left, turns up to ~22% (vault) -->
                                    <path class="lflow-loop-path" d="M 850 0 C 850 28, 850 42, 820 42 L 220 42 C 190 42, 190 28, 190 0" stroke="#7A1220" stroke-width="2.2" fill="none" stroke-dasharray="6 4" stroke-linecap="round" marker-end="url(#ah-loop)"/>
                                </svg>
                                <div class="lflow-loop-badge">↺ FORFEITED DEPOSITS RE-CIRCULATE TO ESCROW VAULT</div>
                            </div>
                        </div>

                        <!-- MOBILE VERTICAL FLOW (shown <900px) -->
                        <div class="lflow-mobile">
                            <div class="lflow-mob-step">
                                <div class="lflow-mob-num">01</div>
                                <div class="lflow-mob-body">
                                    <div class="lflow-node-hdr">INPUT</div>
                                    <div class="lflow-node-title">DEPOSIT IN</div>
                                    <div class="lflow-node-stat">$8,700,000</div>
                                </div>
                            </div>
                            <div class="lflow-mob-arrow">↓</div>

                            <div class="lflow-mob-step lflow-mob-vault">
                                <div class="lflow-mob-num">02</div>
                                <div class="lflow-mob-body">
                                    <div class="lflow-node-hdr">CUSTODY</div>
                                    <div class="lflow-node-title">ESCROW VAULT</div>
                                    <div class="lflow-node-stat">$8.7M LOCKED</div>
                                    <div class="lflow-node-sub">Custodial Escrow via Stripe Connect</div>
                                </div>
                            </div>
                            <div class="lflow-mob-arrow">↓</div>

                            <div class="lflow-mob-step">
                                <div class="lflow-mob-num">03</div>
                                <div class="lflow-mob-body">
                                    <div class="lflow-node-hdr">VERIFICATION</div>
                                    <div class="lflow-node-title">ORACLE API STREAM</div>
                                    <div class="lflow-node-stat">96.2% HIT RATE</div>
                                </div>
                            </div>
                            <div class="lflow-mob-arrow">↓</div>

                            <div class="lflow-mob-outcomes">
                                <div class="lflow-outcome is-win">
                                    <div class="lflow-outcome-indicator" style="background:#145C14;height:5px;"></div>
                                    <div class="lflow-outcome-body">
                                        <div class="lflow-out-hdr"><span class="lflow-dot" style="background:#145C14;"></span>WIN PATH (96.2%)</div>
                                        <div class="lflow-out-title">RETURNED TO CREATOR</div>
                                        <div class="lflow-out-val lflow-val-green">$8,326,200</div>
                                    </div>
                                </div>
                                <div class="lflow-outcome is-forfeit">
                                    <div class="lflow-outcome-indicator" style="background:#7A1220;height:3px;"></div>
                                    <div class="lflow-outcome-body">
                                        <div class="lflow-out-hdr"><span class="lflow-dot" style="background:#7A1220;"></span>FORFEITED (3.8%)</div>
                                        <div class="lflow-out-title">FORFEITED DEPOSITS</div>
                                        <div class="lflow-out-val lflow-val-crimson">$330,600</div>
                                        <div class="lflow-mob-loop">↺ Re-circulates to Escrow Vault</div>
                                    </div>
                                </div>
                                <div class="lflow-outcome is-burn">
                                    <div class="lflow-outcome-indicator" style="background:#7A1220;height:1.5px;"></div>
                                    <div class="lflow-outcome-body">
                                        <div class="lflow-out-hdr"><span class="lflow-dot" style="background:#7A1220;"></span>PROTOCOL FEE (0.5%)</div>
                                        <div class="lflow-out-title">CLTR BURNED</div>
                                        <div class="lflow-out-val">$43,200</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- SUMMARY PARAGRAPH -->
                    <div class="lflow-summary">
                        Deposits are held in Stripe Connect custodial escrow accounts mapped to smart contract state. Upon automated API verification, winners receive their principal plus matching yield. Forfeited deposits re-circulate into the match pool to fund future winners. A 0.5% protocol fee is permanently burned from CLTR supply on every settled contract.
                    </div>
                </div>
            </div>




            <!-- ═══ LIVE CONTRACT EXAMPLES ═══ -->
            <div class="lcontracts" id="contracts" data-r>
                <div class="lw">
                    <div class="reveal-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                        <div class="lred-dash" style="margin-bottom: 0;"><span class="lmono">Open Contracts</span></div>
                        
                        <!-- ═══ OPEN CONTRACTS STATS ═══ -->
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="width: 6px; height: 6px; background: #145c14; border-radius: 50%; box-shadow: 0 0 10px rgba(20,92,20,0.8);"></span>
                            <span style="font-family: 'Inter Tight', sans-serif; font-weight: 700; color: #145c14; font-size: 15px; letter-spacing: -0.2px;">$7.6k</span>
                            <span style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.05em;">Total Escrow · Solo Contracts</span>
                        </div>
                    </div>

                    <!-- ═══ TIER SYSTEM LEGEND BAR ═══ -->
                    <div class="ltier-legend-bar reveal-item">
                        <div class="ltier-legend-item">
                            <span class="lcard-tier tier-pledge">Pledge 1.5x</span>
                            <span class="ltier-legend-desc">Moderate target · 30-day window · Grace period</span>
                        </div>
                        <div class="ltier-legend-item">
                            <span class="lcard-tier tier-stake">Stake 2.5x</span>
                            <span class="ltier-legend-desc">Standard target · 30-day window · Full forfeit</span>
                        </div>
                        <div class="ltier-legend-item">
                            <span class="lcard-tier tier-allin">All-In 4.0x</span>
                            <span class="ltier-legend-desc">Aggressive target · 14-day window · Full forfeit</span>
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
                            <div class="lcard-row"><span class="k">Total Return</span><span class="v">2.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-live-indicator">
                                <span class="lcard-live-dot"></span>
                                <span class="lcard-live-text">$2.4k in escrow</span>
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
                            <div class="lcard-row"><span class="k">Total Return</span><span class="v">4.0x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">14 days</span></div>
                            <div class="lcard-live-indicator">
                                <span class="lcard-live-dot"></span>
                                <span class="lcard-live-text">$3.1k in escrow</span>
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
                            <div class="lcard-row"><span class="k">Total Return</span><span class="v">1.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-live-indicator">
                                <span class="lcard-live-dot"></span>
                                <span class="lcard-live-text">$1.2k in escrow</span>
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
                            <div class="lcard-row"><span class="k">Total Return</span><span class="v">2.5x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-live-indicator">
                                <span class="lcard-live-dot"></span>
                                <span class="lcard-live-text">$0.9k in escrow</span>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="YOUTUBE" data-tier="stake" data-capital="250">Start Contract</button></div>
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

    // ═══ IMAGE-ONLY CAROUSEL AUTO-ROTATE (EVERY 4s) ═══
    let imgCarouselIndex = 0;
    const updateCarouselSlide = (targetIndex) => {
        imgCarouselIndex = targetIndex;
        const slides = [document.getElementById('mode-slide-0'), document.getElementById('mode-slide-1')];
        const dots = [document.getElementById('mode-img-dot-0'), document.getElementById('mode-img-dot-1')];
        const badges = [document.getElementById('mode-badge-0'), document.getElementById('mode-badge-1')];

        slides.forEach((s, idx) => {
            if (s) {
                if (idx === imgCarouselIndex) s.classList.add('active');
                else s.classList.remove('active');
            }
        });
        dots.forEach((d, idx) => {
            if (d) {
                if (idx === imgCarouselIndex) d.classList.add('active');
                else d.classList.remove('active');
            }
        });
        badges.forEach((b, idx) => {
            if (b) {
                if (idx === imgCarouselIndex) b.classList.add('active');
                else b.classList.remove('active');
            }
        });
    };

    let carouselTimer = setInterval(() => {
        updateCarouselSlide((imgCarouselIndex + 1) % 2);
    }, 4000);

    // Dot click handling
    [document.getElementById('mode-img-dot-0'), document.getElementById('mode-img-dot-1')].forEach((dot, idx) => {
        dot?.addEventListener('click', () => {
            clearInterval(carouselTimer);
            updateCarouselSlide(idx);
            carouselTimer = setInterval(() => {
                updateCarouselSlide((imgCarouselIndex + 1) % 2);
            }, 4000);
        });
    });

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

    // ═══ INTERACTIVE MOUSE SPOTLIGHT CURSOR TRACKING ═══
    const spotlightCards = document.querySelectorAll('.lcard, .lstep, .ltype, .lactivity-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // ═══ INTERACTIVE SETTLEMENT ENGINE PIPELINE STAGE SWITCHER ═══
    const engineStageData = {
        1: {
            title: '01. CAPITAL ESCROW & DEPOSIT LOCK',
            desc: 'Creator commits target goal and deposits funds held in FDIC-insured Stripe Connect custodial escrow accounts mapped directly to smart contract state. Principal remains locked until target deadline or API verification event.',
            metric1: '$500.00',
            metric2: 'ESCROW_LOCKED',
            exampleHtml: '',
            logs: [
                { ts: '[15:47:02]', text: 'INIT_ESCROW: Vault #4902 initialized', type: 'text' },
                { ts: '[15:47:03]', text: 'DEPOSIT: $500.00 locked in Stripe Connect escrow', type: 'pending' },
                { ts: '[15:47:03]', text: 'STATUS: Escrow locked & verified safe', type: 'success' }
            ]
        },
        2: {
            title: '02. ORACLE API VERIFICATION STREAM',
            desc: 'Connected platform API (Stripe, Shopify, or X) streams verified telemetry payload directly to the smart contract oracle endpoint.',
            metric1: 'STRIPE_API_V2',
            metric2: 'VERIFIED_100%',
            exampleHtml: '',
            logs: [
                { ts: '[15:48:10]', text: 'ORACLE_POLL: Requesting Stripe revenue payload', type: 'pending' },
                { ts: '[15:48:11]', text: 'API_RESPONSE: 200 OK — Revenue milestone met', type: 'text' },
                { ts: '[15:48:11]', text: 'STATUS: Telemetry target 100% verified', type: 'success' }
            ]
        },
        3: {
            title: '03. MATCH CAPITAL ALLOCATION',
            desc: 'Match capital is funded directly from two explicit sources: 80% comes from forfeited deposits of users who failed to hit their targets, and 20% comes from verified corporate brand sponsors. Multipliers reflect real available pool ratios, not guaranteed investment returns.',
            metric1: '+$500.00 MATCH',
            metric2: '80% FORFEIT / 20% SPONSOR',
            exampleHtml: `
                <div class="lengine-example-box">
                    <div class="lengine-example-hdr">
                        <span style="color:#7A1220;">↳</span> WORKED EXAMPLE: $500 DEPOSIT → $1,000 PAYOUT
                    </div>
                    <div>Deposit <strong>$500.00</strong> → Complete Target → Receive <strong>$1,000.00 Total</strong></div>
                    <div class="lengine-example-breakdown">
                        <span>• <strong>$500.00</strong> — 100% returned principal deposit</span>
                        <span>• <strong>+$400.00</strong> — Funded from forfeited deposits of failed contracts (80%)</span>
                        <span>• <strong>+$100.00</strong> — Funded from corporate brand sponsors & protocol pool (20%)</span>
                    </div>
                </div>
            `,
            logs: [
                { ts: '[15:48:15]', text: 'POOL_AUDIT: Forfeited pool ratio calculated', type: 'pending' },
                { ts: '[15:48:16]', text: 'MATCH_ALLOCATE: +$400.00 (Forfeits) + $100.00 (Sponsors)', type: 'text' },
                { ts: '[15:48:16]', text: 'STATUS: Total payout $1,000.00 fully backed & queued', type: 'success' }
            ]
        },
        4: {
            title: '04. SETTLEMENT & DEFLATIONARY BURN',
            desc: 'Funds automatically unlock and return to creator account. A 0.5% protocol fee is automatically burned from total CLTR supply. Unsuccessful contracts trigger automated deposit forfeiture to fund winner matches.',
            metric1: '$1,000.00',
            metric2: 'SETTLED & BURNED',
            exampleHtml: '',
            logs: [
                { ts: '[15:48:20]', text: 'SETTLEMENT: $1,000.00 payout executed to winner', type: 'success' },
                { ts: '[15:48:21]', text: 'BURN_EVENT: 25.4 CLTR destroyed forever (0.5% fee)', type: 'text' },
                { ts: '[15:48:21]', text: 'STATUS: Contract settled & closed (0.8s)', type: 'success' }
            ]
        }
    };

    const engineBtns = document.querySelectorAll('.lengine-step-btn');
    engineBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const stage = btn.getAttribute('data-stage');
            engineBtns.forEach(b => {
                b.classList.remove('is-active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');

            const data = engineStageData[stage];
            if (data) {
                const titleEl = document.getElementById('engine-stage-title');
                const descEl = document.getElementById('engine-stage-desc');
                const m1El = document.getElementById('engine-metric-1');
                const m2El = document.getElementById('engine-metric-2');
                const exampleEl = document.getElementById('engine-stage-example');
                const terminalBody = document.getElementById('engine-terminal-body');

                if (titleEl) titleEl.textContent = data.title;
                if (descEl) descEl.textContent = data.desc;
                if (m1El) m1El.textContent = data.metric1;
                if (m2El) m2El.textContent = data.metric2;
                if (exampleEl) exampleEl.innerHTML = data.exampleHtml || '';

                if (terminalBody) {
                    terminalBody.innerHTML = data.logs.map(log => {
                        let logClass = 'lengine-log-text';
                        if (log.type === 'success') logClass = 'lengine-log-success';
                        else if (log.type === 'pending') logClass = 'lengine-log-pending';
                        else if (log.type === 'forfeit') logClass = 'lengine-log-forfeit';
                        
                        return `
                            <div class="lengine-log-line">
                                <span class="lengine-log-ts">${log.ts}</span>
                                <span class="${logClass}">${log.text}</span>
                            </div>
                        `;
                    }).join('');
                }
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

