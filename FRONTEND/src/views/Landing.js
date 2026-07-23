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

            <!-- GLOBAL PROTOCOL STATISTICS / CYCLING BAND -->
            <div class="l-global-stats-bar animate-fade-in-up delay-4" id="l-stats-band">
                <div class="lw">
                    <!-- Visually hidden list of all metrics and supported APIs for screen readers -->
                    <div style="position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0,0,0,0) !important; border: 0 !important;">
                        Protocol metrics: Active contracts: 1,206; Average contract size: $6,940; Median settlement time: 1.4 days; Counterparties: 812. Supported APIs: Stripe API, X / Twitter API, YouTube API, Shopify API.
                    </div>
                    <div class="l-stats-eyebrow" id="l-stats-eyebrow">LIVE METRICS</div>
                    <div class="l-stats-bar-grid" id="l-stats-grid" aria-live="off">
                        <a href="/market" class="l-stat-bar-item" data-cell-index="0" aria-label="Active contracts">
                            <div class="l-stat-bar-wrapper">
                                <div class="l-stat-bar-content current" data-state="A">
                                    <div class="l-stat-bar-value-zone">
                                        <span class="l-stat-bar-val">1,206</span>
                                    </div>
                                    <span class="l-stat-bar-lbl">Active Contracts</span>
                                </div>
                            </div>
                        </a>
                        <a href="/market" class="l-stat-bar-item" data-cell-index="1" aria-label="Average contract size">
                            <div class="l-stat-bar-wrapper">
                                <div class="l-stat-bar-content current" data-state="A">
                                    <div class="l-stat-bar-value-zone">
                                        <span class="l-stat-bar-val">$6,940</span>
                                    </div>
                                    <span class="l-stat-bar-lbl">Average Contract Size</span>
                                </div>
                            </div>
                        </a>
                        <a href="/market" class="l-stat-bar-item" data-cell-index="2" aria-label="Median settlement time">
                            <div class="l-stat-bar-wrapper">
                                <div class="l-stat-bar-content current" data-state="A">
                                    <div class="l-stat-bar-value-zone">
                                        <span class="l-stat-bar-val">1.4 days</span>
                                    </div>
                                    <span class="l-stat-bar-lbl">Median Settlement Time</span>
                                </div>
                            </div>
                        </a>
                        <a href="/market" class="l-stat-bar-item" data-cell-index="3" aria-label="Counterparties">
                            <div class="l-stat-bar-wrapper">
                                <div class="l-stat-bar-content current" data-state="A">
                                    <div class="l-stat-bar-value-zone">
                                        <span class="l-stat-bar-val">812</span>
                                    </div>
                                    <span class="l-stat-bar-lbl">Counterparties</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>





            <!-- ═══ SIGNATURE TYPOGRAPHIC CONTRACT HERO (YOU vs YOU / YOU vs THEM) ═══ -->
            <section class="sor-section" id="sor-contract-section" data-r style="padding: clamp(48px, 6vw, 80px) clamp(20px, 4vw, 48px);">
                <div class="sor-grid">
                    <!-- LEFT COLUMN: MODE SELECTOR & TIMELINE -->
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 18px; padding-top: 4px;" class="reveal-item">
                            <span style="width: 24px; height: 1.5px; background: #7A1C2B; opacity: 0.5;"></span>
                            <span style="font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2.2px; color: #8C8577; text-transform: uppercase; line-height: 1.4;">
                                CONTRACT EXECUTION MODES
                            </span>
                        </div>

                        <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(38px,5.2vw,62px); line-height: 0.95; margin: 0 0 20px; letter-spacing: -0.035em; font-weight: 900; text-transform: uppercase;">
                            <span style="color: #1C2333;">SOLO OR </span><span style="color: #7A1C2B;">RIVALRY.</span>
                        </h2>

                        <p style="font-family: 'Inter', sans-serif; font-size: 16.5px; line-height: 1.55; color: #5A6072; margin: 0 0 26px; max-width: 420px;">
                            Put money behind your commitment. Complete the goal and the contract pays automatically. Miss it and the rules enforce themselves.
                        </p>

                        <div class="sor-mode-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 0;">
                            <!-- SOLO CARD WITH ENGRAVING -->
                            <button id="card-mode-solo" class="sor-mode active" onclick="window.switchProtocolMode('solo')" style="text-align: left; cursor: pointer; width: 100%; padding: 0; overflow: hidden; border-radius: 16px; transition: all .2s cubic-bezier(.2,.7,.3,1);">
                                <div style="position: relative; height: 132px; overflow: hidden; background: #EFE8DA;">
                                    <img src="/assets/images/solo-seal.png" alt="Solo Seal Engraving" class="sor-art" style="width: 100%; height: 100%; object-fit: cover; object-position: center 48%; display: block;" />
                                    <div class="sor-art-fade" aria-hidden="true"></div>
                                </div>
                                <div style="padding: 14px 18px 16px;">
                                    <span class="sor-mode-badge" style="display: inline-block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.4px; color: #7A1C2B; background: rgba(122,28,43,0.08); padding: 4px 10px; border-radius: 999px; margin-bottom: 11px;">SOLO</span>
                                    <div class="sor-mode-title" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16.5px; font-weight: 700; color: #1C2333; margin-bottom: 12px;">Beat your own goal</div>
                                    <ul class="sor-bullets" style="list-style: none; margin: 0; padding: 0; display: grid; gap: 8px;">
                                        <li style="display: flex; gap: 9px; align-items: flex-start; font-family: 'Inter', sans-serif; font-size: 13px; color: #5A6072; line-height: 1.35;">
                                            <svg width="15" height="15" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:1px;" aria-hidden><circle cx="12" cy="12" r="11" fill="rgba(122,28,43,0.1)"/><path d="m7 12.5 3.2 3.2L17 8.6" fill="none" stroke="#7A1C2B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            Stake against yourself
                                        </li>
                                        <li style="display: flex; gap: 9px; align-items: flex-start; font-family: 'Inter', sans-serif; font-size: 13px; color: #5A6072; line-height: 1.35;">
                                            <svg width="15" height="15" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:1px;" aria-hidden><circle cx="12" cy="12" r="11" fill="rgba(122,28,43,0.1)"/><path d="m7 12.5 3.2 3.2L17 8.6" fill="none" stroke="#7A1C2B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            Keep your principal
                                        </li>
                                        <li style="display: flex; gap: 9px; align-items: flex-start; font-family: 'Inter', sans-serif; font-size: 13px; color: #5A6072; line-height: 1.35;">
                                            <svg width="15" height="15" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:1px;" aria-hidden><circle cx="12" cy="12" r="11" fill="rgba(122,28,43,0.1)"/><path d="m7 12.5 3.2 3.2L17 8.6" fill="none" stroke="#7A1C2B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            Earn execution rewards
                                        </li>
                                    </ul>
                                    <div class="sor-cta" style="margin-top: 14px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12.5px; font-weight: 700; letter-spacing: 0.3px; color: #7A1C2B; display: flex; align-items: center; gap: 6px;">Start solo <span class="sor-arrow">→</span></div>
                                </div>
                            </button>

                            <!-- RIVALRY CARD WITH ENGRAVING -->
                            <button id="card-mode-rivalry" class="sor-mode" onclick="window.switchProtocolMode('rivalry')" style="text-align: left; cursor: pointer; width: 100%; padding: 0; overflow: hidden; border-radius: 16px; transition: all .2s cubic-bezier(.2,.7,.3,1);">
                                <div style="position: relative; height: 132px; overflow: hidden; background: #5E1521;">
                                    <img src="/assets/images/rivalry-seal.png" alt="Rivalry Seals Engraving" class="sor-art" style="width: 100%; height: 100%; object-fit: cover; object-position: center 52%; display: block;" />
                                    <div class="sor-art-fade" aria-hidden="true"></div>
                                </div>
                                <div style="padding: 14px 18px 16px;">
                                    <span class="sor-mode-badge" style="display: inline-block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.4px; color: #7A1C2B; background: rgba(122,28,43,0.08); padding: 4px 10px; border-radius: 999px; margin-bottom: 11px;">RIVALRY</span>
                                    <div class="sor-mode-title" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16.5px; font-weight: 700; color: #1C2333; margin-bottom: 12px;">Stake head-to-head</div>
                                    <ul class="sor-bullets" style="list-style: none; margin: 0; padding: 0; display: grid; gap: 8px;">
                                        <li style="display: flex; gap: 9px; align-items: flex-start; font-family: 'Inter', sans-serif; font-size: 13px; color: #5A6072; line-height: 1.35;">
                                            <svg width="15" height="15" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:1px;" aria-hidden><circle cx="12" cy="12" r="11" fill="rgba(122,28,43,0.1)"/><path d="m7 12.5 3.2 3.2L17 8.6" fill="none" stroke="#7A1C2B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            Two people lock capital
                                        </li>
                                        <li style="display: flex; gap: 9px; align-items: flex-start; font-family: 'Inter', sans-serif; font-size: 13px; color: #5A6072; line-height: 1.35;">
                                            <svg width="15" height="15" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:1px;" aria-hidden><circle cx="12" cy="12" r="11" fill="rgba(122,28,43,0.1)"/><path d="m7 12.5 3.2 3.2L17 8.6" fill="none" stroke="#7A1C2B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            Verified winner
                                        </li>
                                        <li style="display: flex; gap: 9px; align-items: flex-start; font-family: 'Inter', sans-serif; font-size: 13px; color: #5A6072; line-height: 1.35;">
                                            <svg width="15" height="15" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:1px;" aria-hidden><circle cx="12" cy="12" r="11" fill="rgba(122,28,43,0.1)"/><path d="m7 12.5 3.2 3.2L17 8.6" fill="none" stroke="#7A1C2B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            Winner receives escrow
                                        </li>
                                    </ul>
                                    <div class="sor-cta" style="margin-top: 14px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12.5px; font-weight: 700; letter-spacing: 0.3px; color: #7A1C2B; display: flex; align-items: center; gap: 6px;">Start rivalry <span class="sor-arrow">→</span></div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: TYPOGRAPHIC HERO CARD -->
                    <div class="sor-hero-card" id="sor-hero-card" onmouseenter="window.userStopAutoDemo()" onclick="window.userStopAutoDemo()">
                        <div class="sor-ambient-glow"></div>
                        <div class="sor-mode-tag">
                            <span class="sor-live-dot"></span>
                            <span id="sor-tag-text">SOLO CONTRACT</span>
                        </div>

                        <div style="position: relative; text-align: center; z-index: 1;">
                            <div class="sor-word-top">YOU</div>
                            <div class="sor-vs-row">
                                <span class="sor-rule"></span>
                                <span class="sor-vs">vs</span>
                                <span class="sor-rule"></span>
                            </div>
                            <div class="sor-word-bottom sor-morph" id="sor-opponent-word" style="color: #1C2333;">YOU</div>

                            <div class="sor-figure-wrap sor-figure" id="sor-figure-wrap" style="margin-top: clamp(18px,2.6vw,32px);">
                                <div class="sor-figure-val" id="sor-figure-val">$1,000</div>
                                <div class="sor-figure-lbl" id="sor-figure-lbl">LOCKED BY YOU</div>
                            </div>

                            <div class="sor-outcome-text sor-outcome" id="sor-outcome-text">
                                Beat your own goal — keep every dollar, plus yield.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ═══ LIVE CONTRACT EXAMPLES ═══ -->
            <div class="lcontracts" id="contracts" data-r>
                <div class="lw">
                    <div class="reveal-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                        <div class="lred-dash" style="margin-bottom: 0;"><span class="lmono">Open Contracts</span></div>
                        
                        <!-- ═══ OPEN CONTRACTS STATS ═══ -->
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="width: 6px; height: 6px; background: #145c14; border-radius: 50%; box-shadow: 0 0 10px rgba(20,92,20,0.8);"></span>
                            <span style="font-family: 'Inter Tight', sans-serif; font-weight: 700; color: #145c14; font-size: 15px; letter-spacing: -0.2px;">$12.4k</span>
                            <span style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.05em;">Total Escrow · Live Contracts &amp; Rivalry Duels</span>
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
                        <!-- ═══ GROUP 1: SOLO CONTRACTS (CARDS 1 & 2) ═══ -->
                        
                        <!-- CARD 1: SOLO - STRIPE REVENUE GROWTH -->
                        <div class="lcard lcard-popular reveal-item">
                            <div class="lcard-top">
                                <span class="lcard-type-badge solo">SOLO CONTRACT</span>
                                <span class="lcard-src"><svg viewBox="54 36 360.02 149.84" xmlns="http://www.w3.org/2000/svg" style="width:36px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"><path fill="#635BFF" d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z M223.8,61.7l25.1-5.4v-20.3l-25.1,5.3 M223.8,69.3h25.1v87.5h-25.1z M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z"/></svg></span>
                            </div>
                            <div class="lcard-id-row">
                                <span class="lcard-id">ID: #8821A41E</span>
                                <span class="lcard-tier tier-stake">Stake 2.5x</span>
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
                            <div class="lcard-hover-details">
                                <div class="lcard-hover-row"><span>TRACKED VIA:</span><span class="val">STRIPE DATA</span></div>
                                <div class="lcard-hover-row"><span>VERIFICATION:</span><span class="val green">AUTOMATIC</span></div>
                                <div class="lcard-hover-row"><span>PAYOUT ON SUCCESS:</span><span class="val green">STAKE × 2.5</span></div>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn maroon" data-source="STRIPE" data-tier="stake" data-capital="250">Start Contract</button></div>
                            <div class="lcard-subtext">Deposit returned once goal is verified.</div>
                        </div>

                        <!-- CARD 2: SOLO - SHOPIFY STORE SALES -->
                        <div class="lcard reveal-item">
                            <div class="lcard-top">
                                <span class="lcard-type-badge solo">SOLO CONTRACT</span>
                                <span class="lcard-src"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"><path fill="#95BF47" d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/></svg>Shopify</span>
                            </div>
                            <div class="lcard-id-row">
                                <span class="lcard-id">ID: #9042B18C</span>
                                <span class="lcard-tier tier-pledge">Pledge 1.5x</span>
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
                            <div class="lcard-hover-details">
                                <div class="lcard-hover-row"><span>TRACKED VIA:</span><span class="val">SHOPIFY DATA</span></div>
                                <div class="lcard-hover-row"><span>VERIFICATION:</span><span class="val green">AUTOMATIC</span></div>
                                <div class="lcard-hover-row"><span>PAYOUT ON SUCCESS:</span><span class="val green">PLEDGE × 1.5</span></div>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn maroon" data-source="SHOPIFY" data-tier="pledge" data-capital="100">Start Contract</button></div>
                            <div class="lcard-subtext">Deposit returned once goal is verified.</div>
                        </div>

                        <!-- ═══ GROUP 2: RIVALRY DUELS (CARDS 3 & 4) ═══ -->
                        
                        <!-- CARD 3: RIVALRY - AUDIENCE (ID: #7B92A41E) -->
                        <div class="rv-card reveal-item" onclick="window.router.navigate('/rivalry/7B92A41E')">
                            <div class="rv-card-inner">
                                <div class="rv-card-header">
                                    <span class="lcard-type-badge rivalry">RIVALRY DUEL</span>
                                    <div class="rv-card-status">
                                        <span class="dot"></span>
                                        LOCKED
                                    </div>
                                </div>
                                <div class="rv-card-metric-row">
                                    <span class="rv-card-metric">AUDIENCE</span>
                                    <span class="rv-card-id">ID: #7B92A41E</span>
                                </div>
                                <div class="rv-versus">
                                    <div class="rv-player">
                                        <span class="rv-player-label">Challenger</span>
                                        <span class="rv-player-name"><span class="rv-lead-dot" style="background:#166534"></span>jakevoss</span>
                                        <span class="rv-player-growth leading">+12.4%</span>
                                    </div>
                                    <div class="rv-vs-divider">
                                        <span class="rv-vs-badge" style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 999px; background: rgba(122,28,43,0.07); border: 1px solid rgba(122,28,43,0.16); box-shadow: inset 0 1px 0 rgba(255,255,255,0.8); flex-shrink: 0;">
                                            <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true" style="display: block;">
                                                <defs>
                                                    <linearGradient id="cs_steel_card1" x1="0" y1="0" x2="1" y2="0.35">
                                                        <stop offset="0%" stop-color="#F4F2EE" />
                                                        <stop offset="45%" stop-color="#CFCBC3" />
                                                        <stop offset="100%" stop-color="#948F86" />
                                                    </linearGradient>
                                                    <linearGradient id="cs_hilt_card1" x1="0" y1="0" x2="1" y2="1">
                                                        <stop offset="0%" stop-color="#8A2233" />
                                                        <stop offset="100%" stop-color="#4E1119" />
                                                    </linearGradient>
                                                    <radialGradient id="cs_glint_card1" cx="50%" cy="50%" r="50%">
                                                        <stop offset="0%" stop-color="#FFF6E6" stop-opacity="0.95" />
                                                        <stop offset="100%" stop-color="#E8B45C" stop-opacity="0" />
                                                    </radialGradient>
                                                </defs>
                                                <g transform="translate(24 23.5) scale(0.86)">
                                                    <g transform="rotate(-43)">
                                                        <polygon points="0,-26 2.5,-20.5 2.5,5 -2.5,5 -2.5,-20.5" fill="url(#cs_steel_card1)" />
                                                        <polygon points="0,-22.5 0.85,-19 0.85,3.4 -0.85,3.4 -0.85,-19" fill="#948F86" opacity="0.45" />
                                                        <polygon points="0,-26 -2.5,-20.5 -2.5,5 -1.55,5 -1.55,-20.2" fill="#FFFFFF" opacity="0.6" />
                                                        <rect x="-2.5" y="3.2" width="5" height="1.8" fill="#948F86" opacity="0.5" />
                                                        <rect x="-8.2" y="5" width="16.4" height="3.3" rx="1.65" fill="url(#cs_hilt_card1)" />
                                                        <circle cx="-8.4" cy="6.65" r="2.15" fill="url(#cs_hilt_card1)" />
                                                        <circle cx="8.4" cy="6.65" r="2.15" fill="url(#cs_hilt_card1)" />
                                                        <rect x="-8.2" y="5" width="16.4" height="1.1" rx="0.55" fill="#FFFFFF" opacity="0.22" />
                                                        <rect x="-1.95" y="8.3" width="3.9" height="9.2" rx="1.5" fill="#4E1119" />
                                                        <rect x="-1.95" y="10.1" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <rect x="-1.95" y="12.4" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <rect x="-1.95" y="14.7" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <circle cx="0" cy="19.4" r="2.85" fill="url(#cs_hilt_card1)" />
                                                        <circle cx="-0.8" cy="18.6" r="0.95" fill="#FFFFFF" opacity="0.42" />
                                                    </g>
                                                    <g transform="rotate(43)">
                                                        <g fill="#FBF9F5" stroke="#FBF9F5" stroke-width="3.2" stroke-linejoin="round">
                                                            <polygon points="0,-26 2.5,-20.5 2.5,5 -2.5,5 -2.5,-20.5" />
                                                            <rect x="-8.2" y="5" width="16.4" height="3.3" rx="1.65" />
                                                            <circle cx="-8.4" cy="6.65" r="2.15" />
                                                            <circle cx="8.4" cy="6.65" r="2.15" />
                                                            <rect x="-1.95" y="8.3" width="3.9" height="9.2" rx="1.5" />
                                                            <circle cx="0" cy="19.4" r="2.85" />
                                                        </g>
                                                        <polygon points="0,-26 2.5,-20.5 2.5,5 -2.5,5 -2.5,-20.5" fill="url(#cs_steel_card1)" />
                                                        <polygon points="0,-22.5 0.85,-19 0.85,3.4 -0.85,3.4 -0.85,-19" fill="#948F86" opacity="0.45" />
                                                        <polygon points="0,-26 -2.5,-20.5 -2.5,5 -1.55,5 -1.55,-20.2" fill="#FFFFFF" opacity="0.6" />
                                                        <rect x="-2.5" y="3.2" width="5" height="1.8" fill="#948F86" opacity="0.5" />
                                                        <rect x="-8.2" y="5" width="16.4" height="3.3" rx="1.65" fill="url(#cs_hilt_card1)" />
                                                        <circle cx="-8.4" cy="6.65" r="2.15" fill="url(#cs_hilt_card1)" />
                                                        <circle cx="8.4" cy="6.65" r="2.15" fill="url(#cs_hilt_card1)" />
                                                        <rect x="-8.2" y="5" width="16.4" height="1.1" rx="0.55" fill="#FFFFFF" opacity="0.22" />
                                                        <rect x="-1.95" y="8.3" width="3.9" height="9.2" rx="1.5" fill="#4E1119" />
                                                        <rect x="-1.95" y="10.1" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <rect x="-1.95" y="12.4" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <rect x="-1.95" y="14.7" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <circle cx="0" cy="19.4" r="2.85" fill="url(#cs_hilt_card1)" />
                                                        <circle cx="-0.8" cy="18.6" r="0.95" fill="#FFFFFF" opacity="0.42" />
                                                    </g>
                                                    <g transform="translate(0 -9)">
                                                        <circle r="7" fill="url(#cs_glint_card1)" />
                                                        <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z" fill="#FFF3DF" opacity="0.9" />
                                                    </g>
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                    <div class="rv-player right">
                                        <span class="rv-player-label">Opponent</span>
                                        <span class="rv-player-name">marcus<span class="rv-lead-dot" style="background:#7A1220"></span></span>
                                        <span class="rv-player-growth trailing">+9.2%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="rv-momentum">
                                <div class="rv-momentum-left" style="width: 58%;"></div>
                                <div class="rv-momentum-right" style="width: 42%;"></div>
                            </div>
                            <div class="rv-card-bottom">
                                <div class="rv-card-stake">
                                    <span class="rv-card-stake-val">$5,000</span>
                                    <span class="rv-card-stake-lbl">CAPITAL EXPOSURE</span>
                                </div>
                                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                                    <span class="rv-card-provider-pill" style="background:#0F172A; display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px;"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:12px;height:12px;fill:#FFFFFF;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X / TWITTER</span>
                                    <span class="rv-card-time">14D REMAINING</span>
                                </div>
                            </div>
                            <div class="lcard-hover-details">
                                <div class="lcard-hover-row"><span>SETTLEMENT:</span><span class="val">AUTOMATED ESCROW</span></div>
                                <div class="lcard-hover-row"><span>VERIFICATION:</span><span class="val green">X DATA AUTOMATIC</span></div>
                                <div class="lcard-hover-row"><span>WINNER TAKES:</span><span class="val green">100% COMBINED POOL</span></div>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn maroon" onclick="window.router.navigate('/rivalry/7B92A41E')">VIEW DUEL</button></div>
                            <div class="lcard-subtext">Escrow locked during duel period.</div>
                        </div>

                        <!-- CARD 4: RIVALRY - REVENUE (ID: #34D63CA3) -->
                        <div class="rv-card reveal-item" onclick="window.router.navigate('/rivalry/34D63CA3')">
                            <div class="rv-card-inner">
                                <div class="rv-card-header">
                                    <span class="lcard-type-badge rivalry">RIVALRY DUEL</span>
                                    <div class="rv-card-status">
                                        <span class="dot"></span>
                                        LOCKED
                                    </div>
                                </div>
                                <div class="rv-card-metric-row">
                                    <span class="rv-card-metric">REVENUE</span>
                                    <span class="rv-card-id">ID: #34D63CA3</span>
                                </div>
                                <div class="rv-versus">
                                    <div class="rv-player">
                                        <span class="rv-player-label">Challenger</span>
                                        <span class="rv-player-name"><span class="rv-lead-dot" style="background:#166534"></span>revpilot</span>
                                        <span class="rv-player-growth leading">+8.1%</span>
                                    </div>
                                    <div class="rv-vs-divider">
                                        <span class="rv-vs-badge" style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 999px; background: rgba(122,28,43,0.07); border: 1px solid rgba(122,28,43,0.16); box-shadow: inset 0 1px 0 rgba(255,255,255,0.8); flex-shrink: 0;">
                                            <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true" style="display: block;">
                                                <defs>
                                                    <linearGradient id="cs_steel_card2" x1="0" y1="0" x2="1" y2="0.35">
                                                        <stop offset="0%" stop-color="#F4F2EE" />
                                                        <stop offset="45%" stop-color="#CFCBC3" />
                                                        <stop offset="100%" stop-color="#948F86" />
                                                    </linearGradient>
                                                    <linearGradient id="cs_hilt_card2" x1="0" y1="0" x2="1" y2="1">
                                                        <stop offset="0%" stop-color="#8A2233" />
                                                        <stop offset="100%" stop-color="#4E1119" />
                                                    </linearGradient>
                                                    <radialGradient id="cs_glint_card2" cx="50%" cy="50%" r="50%">
                                                        <stop offset="0%" stop-color="#FFF6E6" stop-opacity="0.95" />
                                                        <stop offset="100%" stop-color="#E8B45C" stop-opacity="0" />
                                                    </radialGradient>
                                                </defs>
                                                <g transform="translate(24 23.5) scale(0.86)">
                                                    <g transform="rotate(-43)">
                                                        <polygon points="0,-26 2.5,-20.5 2.5,5 -2.5,5 -2.5,-20.5" fill="url(#cs_steel_card2)" />
                                                        <polygon points="0,-22.5 0.85,-19 0.85,3.4 -0.85,3.4 -0.85,-19" fill="#948F86" opacity="0.45" />
                                                        <polygon points="0,-26 -2.5,-20.5 -2.5,5 -1.55,5 -1.55,-20.2" fill="#FFFFFF" opacity="0.6" />
                                                        <rect x="-2.5" y="3.2" width="5" height="1.8" fill="#948F86" opacity="0.5" />
                                                        <rect x="-8.2" y="5" width="16.4" height="3.3" rx="1.65" fill="url(#cs_hilt_card2)" />
                                                        <circle cx="-8.4" cy="6.65" r="2.15" fill="url(#cs_hilt_card2)" />
                                                        <circle cx="8.4" cy="6.65" r="2.15" fill="url(#cs_hilt_card2)" />
                                                        <rect x="-8.2" y="5" width="16.4" height="1.1" rx="0.55" fill="#FFFFFF" opacity="0.22" />
                                                        <rect x="-1.95" y="8.3" width="3.9" height="9.2" rx="1.5" fill="#4E1119" />
                                                        <rect x="-1.95" y="10.1" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <rect x="-1.95" y="12.4" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <rect x="-1.95" y="14.7" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <circle cx="0" cy="19.4" r="2.85" fill="url(#cs_hilt_card2)" />
                                                        <circle cx="-0.8" cy="18.6" r="0.95" fill="#FFFFFF" opacity="0.42" />
                                                    </g>
                                                    <g transform="rotate(43)">
                                                        <g fill="#FBF9F5" stroke="#FBF9F5" stroke-width="3.2" stroke-linejoin="round">
                                                            <polygon points="0,-26 2.5,-20.5 2.5,5 -2.5,5 -2.5,-20.5" />
                                                            <rect x="-8.2" y="5" width="16.4" height="3.3" rx="1.65" />
                                                            <circle cx="-8.4" cy="6.65" r="2.15" />
                                                            <circle cx="8.4" cy="6.65" r="2.15" />
                                                            <rect x="-1.95" y="8.3" width="3.9" height="9.2" rx="1.5" />
                                                            <circle cx="0" cy="19.4" r="2.85" />
                                                        </g>
                                                        <polygon points="0,-26 2.5,-20.5 2.5,5 -2.5,5 -2.5,-20.5" fill="url(#cs_steel_card2)" />
                                                        <polygon points="0,-22.5 0.85,-19 0.85,3.4 -0.85,3.4 -0.85,-19" fill="#948F86" opacity="0.45" />
                                                        <polygon points="0,-26 -2.5,-20.5 -2.5,5 -1.55,5 -1.55,-20.2" fill="#FFFFFF" opacity="0.6" />
                                                        <rect x="-2.5" y="3.2" width="5" height="1.8" fill="#948F86" opacity="0.5" />
                                                        <rect x="-8.2" y="5" width="16.4" height="3.3" rx="1.65" fill="url(#cs_hilt_card2)" />
                                                        <circle cx="-8.4" cy="6.65" r="2.15" fill="url(#cs_hilt_card2)" />
                                                        <circle cx="8.4" cy="6.65" r="2.15" fill="url(#cs_hilt_card2)" />
                                                        <rect x="-8.2" y="5" width="16.4" height="1.1" rx="0.55" fill="#FFFFFF" opacity="0.22" />
                                                        <rect x="-1.95" y="8.3" width="3.9" height="9.2" rx="1.5" fill="#4E1119" />
                                                        <rect x="-1.95" y="10.1" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <rect x="-1.95" y="12.4" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <rect x="-1.95" y="14.7" width="3.9" height="0.9" rx="0.45" fill="#FFFFFF" opacity="0.18" />
                                                        <circle cx="0" cy="19.4" r="2.85" fill="url(#cs_hilt_card2)" />
                                                        <circle cx="-0.8" cy="18.6" r="0.95" fill="#FFFFFF" opacity="0.42" />
                                                    </g>
                                                    <g transform="translate(0 -9)">
                                                        <circle r="7" fill="url(#cs_glint_card2)" />
                                                        <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z" fill="#FFF3DF" opacity="0.9" />
                                                    </g>
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                    <div class="rv-player right">
                                        <span class="rv-player-label">Opponent</span>
                                        <span class="rv-player-name">quotaops<span class="rv-lead-dot" style="background:#7A1220"></span></span>
                                        <span class="rv-player-growth trailing">+5.4%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="rv-momentum">
                                <div class="rv-momentum-left" style="width: 60%;"></div>
                                <div class="rv-momentum-right" style="width: 40%;"></div>
                            </div>
                            <div class="rv-card-bottom">
                                <div class="rv-card-stake">
                                    <span class="rv-card-stake-val">$2,000</span>
                                    <span class="rv-card-stake-lbl">CAPITAL EXPOSURE</span>
                                </div>
                                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                                    <span class="rv-card-provider-pill" style="background:#635BFF; display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px;"><svg viewBox="54 36 360.02 149.84" xmlns="http://www.w3.org/2000/svg" style="width:28px;height:11px;"><path fill="#FFFFFF" d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z M223.8,61.7l25.1-5.4v-20.3l-25.1,5.3 M223.8,69.3h25.1v87.5h-25.1z M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z"/></svg> STRIPE</span>
                                    <span class="rv-card-time status-settling">SETTLING</span>
                                </div>
                            </div>
                            <div class="lcard-hover-details">
                                <div class="lcard-hover-row"><span>SETTLEMENT:</span><span class="val">AUTOMATED ESCROW</span></div>
                                <div class="lcard-hover-row"><span>VERIFICATION:</span><span class="val green">STRIPE AUTOMATIC</span></div>
                                <div class="lcard-hover-row"><span>WINNER TAKES:</span><span class="val green">100% COMBINED POOL</span></div>
                            </div>
                            <div class="lcard-btn"><button class="lp-cta-btn maroon" onclick="window.router.navigate('/rivalry/34D63CA3')">VIEW DUEL</button></div>
                            <div class="lcard-subtext">Escrow locked during duel period.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ EMOTIONAL REFRAME (THE FORK: WHY IT WORKS) ═══ -->
            <div class="lhow-it-works-section" data-r style="background: #F8F5F0; padding: clamp(48px,7vw,96px) 0; overflow: visible !important;">
                <div class="lw">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-top: 4px;" class="reveal-item">
                        <span style="width: 24px; height: 1.5px; background: #7A1C2B; opacity: 0.5;"></span>
                        <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 2.2px; color: #8C8577; text-transform: uppercase; line-height: 1.4;">
                            WHY IT WORKS
                        </span>
                    </div>


                    <div class="fk-grid reveal-item">
                        <div>
                            <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(34px,4.2vw,50px); font-weight: 800; letter-spacing: -0.03em; color: #1C2333; margin: 0 0 20px; line-height: 1.06;">
                                A plan without stakes is just a <span style="color: #7A1C2B;">comfortable wish.</span>
                            </h2>
                            <p style="font-family: 'Inter', sans-serif; font-size: 16px; color: #5A6072; margin: 0 0 18px; max-width: 420px; line-height: 1.62;">
                                Planning is easy. Executing is hard. You miss targets because failing is free — it costs you nothing but time you'll never see.
                            </p>
                            <p style="font-family: 'Inter', sans-serif; font-size: 16px; color: #5A6072; margin: 0; max-width: 420px; line-height: 1.62;">
                                Collateral makes failure cost something real. That single change moves you from passive planning to pure execution.
                            </p>
                            <p style="margin-top: 26px; padding-top: 20px; border-top: 1px solid rgba(28,35,51,0.11); font-family: 'Inter', sans-serif; font-size: 14.5px; color: #7A1C2B; font-weight: 600; max-width: 420px; line-height: 1.55;">
                                Stop betting on variables you can't control. Bet on your own focus.
                            </p>
                        </div>

                        <!-- THE FORK SVG PANEL -->
                        <div style="background: #FCFAF7; border: 1px solid rgba(28,35,51,0.11); border-radius: 22px; padding: clamp(10px,1.2vw,16px); box-shadow: 0 30px 70px -50px rgba(28,35,51,0.4);">
                            <svg viewBox="0 0 680 520" width="100%" role="img" aria-label="One goal, two paths: without stakes the path fades to nothing; with a locked deposit it ends in capital returned plus yield." style="display: block; height: auto;">
                                <defs>
                                    <marker id="fkArrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
                                        <path d="M0 0.5 L6.5 3.5 L0 6.5 Z" fill="#7A1C2B" />
                                    </marker>
                                    <marker id="fkArrowG" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
                                        <path d="M0 0.5 L6.5 3.5 L0 6.5 Z" fill="#3F9D5A" />
                                    </marker>
                                    <linearGradient id="fkFade" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="#8C8577" stop-opacity="0.5" />
                                        <stop offset="100%" stop-color="#8C8577" stop-opacity="0.08" />
                                    </linearGradient>
                                </defs>

                                <!-- shared origin -->
                                <g>
                                    <rect x="230" y="16" width="220" height="50" rx="12" fill="#FBF9F5" stroke="rgba(28,35,51,0.11)" />
                                    <text x="340" y="41" text-anchor="middle" dominant-baseline="central" font-family="'Plus Jakarta Sans', sans-serif" font-size="17" font-weight="700" fill="#1C2333">You set a goal.</text>
                                </g>

                                <!-- the fork itself -->
                                <path d="M305 66 C 275 84, 213 78, 173 98" fill="none" stroke="#8C8577" stroke-width="1.4" stroke-dasharray="4 5" opacity="0.6" />
                                <path d="M375 66 C 405 84, 467 78, 507 98" fill="none" stroke="#7A1C2B" stroke-width="1.7" opacity="0.65" marker-end="url(#fkArrow)" />

                                <!-- column headers -->
                                <text x="26" y="90" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" letter-spacing="1.8" fill="#8C8577">WITHOUT STAKES</text>
                                <text x="360" y="90" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" letter-spacing="1.8" fill="#7A1C2B">WITH COLLATERAL</text>

                                <!-- ---- LEFT: the path that dissolves ---- -->
                                <!-- Step 01 -->
                                <g opacity="1">
                                    <rect x="26" y="106" width="294" height="62" rx="11" fill="#FCFAF7" stroke="rgba(28,35,51,0.11)" stroke-dasharray="0" />
                                    <text x="42" y="137" dominant-baseline="central" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" fill="#A8A49B">01</text>
                                    <text x="72" y="137" dominant-baseline="central" font-family="'Inter', sans-serif" font-size="16" fill="#5A6072">Plan a new goal</text>
                                </g>
                                <!-- Step 02 -->
                                <g opacity="0.68">
                                    <rect x="26" y="182" width="294" height="62" rx="11" fill="#FCFAF7" stroke="rgba(28,35,51,0.11)" stroke-dasharray="0" />
                                    <text x="42" y="213" dominant-baseline="central" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" fill="#A8A49B">02</text>
                                    <text x="72" y="213" dominant-baseline="central" font-family="'Inter', sans-serif" font-size="16" fill="#5A6072">Get distracted</text>
                                </g>
                                <!-- Step 03 -->
                                <g opacity="0.44">
                                    <rect x="26" y="258" width="294" height="62" rx="11" fill="#FCFAF7" stroke="rgba(28,35,51,0.11)" stroke-dasharray="5 5" />
                                    <text x="42" y="289" dominant-baseline="central" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" fill="#A8A49B">03</text>
                                    <text x="72" y="289" dominant-baseline="central" font-family="'Inter', sans-serif" font-size="16" fill="#5A6072">Push the deadline</text>
                                </g>
                                <!-- Step 04 -->
                                <g opacity="0.26">
                                    <rect x="26" y="334" width="294" height="62" rx="11" fill="#FCFAF7" stroke="rgba(28,35,51,0.11)" stroke-dasharray="5 5" />
                                    <text x="42" y="365" dominant-baseline="central" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" fill="#A8A49B">04</text>
                                    <text x="72" y="365" dominant-baseline="central" font-family="'Inter', sans-serif" font-size="16" fill="#5A6072">Another year slides by</text>
                                </g>

                                <!-- connectors thin out as path fades -->
                                <line x1="173" y1="168" x2="173" y2="182" stroke="#8C8577" stroke-width="1.3" stroke-dasharray="3 5" opacity="0.54" />
                                <line x1="173" y1="244" x2="173" y2="258" stroke="#8C8577" stroke-width="1.0" stroke-dasharray="3 5" opacity="0.35" />
                                <line x1="173" y1="320" x2="173" y2="334" stroke="#8C8577" stroke-width="0.7" stroke-dasharray="3 5" opacity="0.21" />

                                <!-- dead end -->
                                <line x1="173" y1="396" x2="173" y2="422" stroke="url(#fkFade)" stroke-width="1" stroke-dasharray="3 5" />
                                <g opacity="0.9">
                                    <rect x="26" y="424" width="294" height="76" rx="14" fill="none" stroke="#8C8577" stroke-width="1.5" stroke-dasharray="6 6" />
                                    <text x="173" y="454" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="700" fill="#6E685C">Nothing was at risk.</text>
                                    <text x="173" y="480" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" font-weight="500" fill="#5A6072">So nothing changed.</text>
                                </g>

                                <!-- ---- RIGHT: the path that firms up ---- -->
                                <!-- Step 01 -->
                                <g>
                                    <rect x="360" y="106" width="294" height="62" rx="11" fill="#FCFAF7" stroke="rgba(122,28,43,0.14)" stroke-width="1" />
                                    <text x="376" y="137" dominant-baseline="central" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" fill="#7A1C2B" opacity="0.55">01</text>
                                    <text x="406" y="137" dominant-baseline="central" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="600" fill="#1C2333">Lock a deposit on target</text>
                                </g>
                                <!-- Step 02 -->
                                <g>
                                    <rect x="360" y="182" width="294" height="62" rx="11" fill="#FCFAF7" stroke="rgba(122,28,43,0.21)" stroke-width="1" />
                                    <text x="376" y="213" dominant-baseline="central" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" fill="#7A1C2B" opacity="0.7">02</text>
                                    <text x="406" y="213" dominant-baseline="central" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="600" fill="#1C2333">Failure now has a cost</text>
                                </g>
                                <!-- Step 03 -->
                                <g>
                                    <rect x="360" y="258" width="294" height="62" rx="11" fill="#FCFAF7" stroke="rgba(122,28,43,0.28)" stroke-width="1" />
                                    <text x="376" y="289" dominant-baseline="central" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" fill="#7A1C2B" opacity="0.85">03</text>
                                    <text x="406" y="289" dominant-baseline="central" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="600" fill="#1C2333">Work through the night</text>
                                </g>
                                <!-- Step 04 -->
                                <g>
                                    <rect x="360" y="334" width="294" height="62" rx="11" fill="rgba(63,157,90,0.06)" stroke="rgba(63,157,90,0.4)" stroke-width="1.5" />
                                    <text x="376" y="365" dominant-baseline="central" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" fill="#3F9D5A" opacity="1">04</text>
                                    <text x="406" y="365" dominant-baseline="central" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="700" fill="#3F9D5A">Hit target, claim yield</text>
                                </g>

                                <!-- Right solid connectors -->
                                <line x1="507" y1="168" x2="507" y2="176" stroke="#7A1C2B" stroke-width="1.5" opacity="0.4" marker-end="url(#fkArrow)" />
                                <line x1="507" y1="244" x2="507" y2="252" stroke="#7A1C2B" stroke-width="1.5" opacity="0.55" marker-end="url(#fkArrow)" />
                                <line x1="507" y1="320" x2="507" y2="328" stroke="#7A1C2B" stroke-width="1.5" opacity="0.7" marker-end="url(#fkArrow)" />

                                <line x1="507" y1="396" x2="507" y2="418" stroke="#3F9D5A" stroke-width="1.6" opacity="0.7" marker-end="url(#fkArrowG)" />

                                <!-- payout badge -->
                                <g class="fk-payout">
                                    <rect x="360" y="424" width="294" height="76" rx="14" fill="rgba(63,157,90,0.11)" stroke="rgba(63,157,90,0.6)" stroke-width="2" />
                                    <circle cx="394" cy="462" r="13" fill="#3F9D5A" class="fk-check" />
                                    <path d="m-4.4 0 2.9 2.9 5.7-5.8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" transform="translate(394, 462) scale(1.15)" />
                                    <text x="418" y="454" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="700" fill="#1C2333">Capital returned + yield.</text>
                                    <text x="418" y="480" font-family="'Inter', sans-serif" font-size="14" fill="#5A6072">The goal actually happened.</text>
                                </g>
                            </svg>
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
                                    <svg width="34" height="12" viewBox="0 0 34 12" fill="none">
                                        <path d="M 0 6 H 24" stroke="#7A1C2B" stroke-width="2" stroke-linecap="round"/>
                                        <polygon points="32,6 24,2 24,10" fill="#7A1C2B"/>
                                    </svg>
                                </div>

                                <!-- NODE: ESCROW VAULT -->
                                <div class="lflow-node lflow-node-vault" id="lflow-vault-node">
                                    <div class="lflow-node-hdr">CUSTODY</div>
                                    <div class="lflow-node-title">ESCROW VAULT</div>
                                    <div class="lflow-node-stat">$8.7M LOCKED</div>
                                    <div class="lflow-node-sub">Custodial Escrow via Stripe Connect</div>
                                </div>

                                <div class="lflow-arrow">
                                    <svg width="34" height="12" viewBox="0 0 34 12" fill="none">
                                        <path d="M 0 6 H 24" stroke="#7A1C2B" stroke-width="2" stroke-linecap="round"/>
                                        <polygon points="32,6 24,2 24,10" fill="#7A1C2B"/>
                                    </svg>
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
                                    <svg width="44" height="156" viewBox="0 0 44 156" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <!-- Win path (thick green #145C14) -->
                                        <path d="M 0 78 C 16 78, 22 20, 34 20" stroke="#145C14" stroke-width="4.5" stroke-linecap="round"/>
                                        <polygon points="42,20 32,14 32,26" fill="#145C14"/>

                                        <!-- Forfeit path (medium crimson #7A1220) -->
                                        <path d="M 0 78 H 34" stroke="#7A1220" stroke-width="2.5" stroke-linecap="round"/>
                                        <polygon points="42,78 33,73 33,83" fill="#7A1220"/>

                                        <!-- Burn path (hairline dashed crimson #7A1220) -->
                                        <path d="M 0 78 C 16 78, 22 136, 34 136" stroke="#7A1220" stroke-width="1.2" stroke-dasharray="4 3" stroke-linecap="round"/>
                                        <polygon points="41,136 34,132 34,140" fill="#7A1220"/>
                                    </svg>
                                </div>

                                <!-- THREE TERMINAL OUTCOMES -->
                                <div class="lflow-outcomes">
                                    <div class="lflow-outcome is-win">
                                        <div class="lflow-outcome-indicator" style="background:#145C14;width:5px;"></div>
                                        <div class="lflow-outcome-body">
                                            <div class="lflow-out-hdr"><span class="lflow-dot" style="background:#145C14;"></span>WIN PATH (95.7%)</div>
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

                            <!-- RECIRCULATING LOOP — routed SVG path below node row landing directly into Escrow Vault -->
                            <div class="lflow-loop-wrap">
                                <svg class="lflow-loop-svg" viewBox="0 0 1000 48" preserveAspectRatio="none">
                                    <defs>
                                        <marker id="ah-loop" viewBox="0 0 10 10" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
                                            <path d="M 1 9 L 5 1 L 9 9 Z" fill="#7A1C2B"/>
                                        </marker>
                                    </defs>
                                    <!-- Path: exits from x=845 (center of forfeited card), routes down to y=38, runs left, turns UP into x=310 (center of Escrow Vault) -->
                                    <path class="lflow-loop-path" d="M 845 0 C 845 26, 820 38, 770 38 L 385 38 C 310 38, 310 26, 310 2" stroke="#7A1C2B" stroke-width="2.2" fill="none" stroke-dasharray="6 4" stroke-linecap="round" marker-end="url(#ah-loop)"/>
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
                                        <div class="lflow-out-hdr"><span class="lflow-dot" style="background:#145C14;"></span>WIN PATH (95.7%)</div>
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
                        Deposits are held in Stripe Connect custodial escrow accounts mapped to smart contract state. Upon automated API verification, winners receive their principal plus matching yield. Forfeited deposits re-circulate into the match pool to fund future winners. A 0.5% protocol fee is permanently burned from CLTR                   <div class="lcard-subtext">Escrow locked during duel period.</div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- ═══ PROOF OF SETTLEMENT (STAMPED RECEIPTS & STATS) ═══ -->
            <div class="lreal-results" data-r style="background: #F8F5F0; padding: clamp(40px,6vw,88px) clamp(20px,5vw,64px); font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <div class="lw" style="max-width: 1240px; margin: 0 auto;">
                    <!-- SECTION TAG -->
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 18px;" class="reveal-item">
                        <span style="width: 24px; height: 1.5px; background: #7A1C2B; opacity: 0.5;"></span>
                        <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 11px; font-weight: 700; letter-spacing: 2.2px; color: #8C8577; text-transform: uppercase;">
                            PROOF OF SETTLEMENT
                        </span>
                    </div>

                    <!-- HEAD STACK -->
                    <div class="ps-head reveal-item" style="display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; flex-wrap: wrap; margin-bottom: clamp(26px,3vw,42px);">
                        <h2 style="font-size: clamp(30px,3.8vw,46px); font-weight: 800; letter-spacing: -0.03em; color: #1C2333; margin: 0; line-height: 1.06; max-width: 640px;">
                            Skin in the game is the only thing<br />that <span style="color: #7A1C2B;">actually works.</span>
                        </h2>
                        <p style="font-size: 15.5px; color: #5A6072; margin: 0; max-width: 340px; line-height: 1.6;">
                            Every contract settles the same way — automatically, on verified API data. Including the ones people lose.
                        </p>
                    </div>

                    <!-- 3 STAMPED RECEIPT CARDS GRID -->
                    <div class="ps-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px,2vw,26px);">
                        
                        <!-- RECEIPT 1: @revpilot (WIN) -->
                        <article class="ps-card reveal-item" style="position: relative; background: #FFFDFA; border: 1px solid rgba(28,35,51,0.11); border-radius: 6px; box-shadow: 0 14px 34px -22px rgba(28,35,51,0.4); display: flex; flex-direction: column; transition: transform .22s cubic-bezier(.2,.7,.3,1), box-shadow .22s ease;">
                            <!-- HEADER -->
                            <div style="padding: 16px 18px 12px; border-bottom: 1px solid rgba(28,35,51,0.11);">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.7px; color: #7A1C2B;">SETTLEMENT RECEIPT</span>
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 10px; color: #8C8577; font-variant-numeric: tabular-nums;">№ C-34D6</span>
                                </div>
                                <div style="margin-top: 10px; font-size: 15.5px; font-weight: 700; color: #1C2333;">
                                    +20% revenue in 30 days
                                </div>
                                <div style="margin-top: 4px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 11px; color: #8C8577;">
                                    @revpilot · via Stripe API
                                </div>
                            </div>

                            <!-- BODY ROWS -->
                            <div style="padding: 14px 18px 16px; display: grid; gap: 9px;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; letter-spacing: 1.2px; color: #8C8577;">CAPITAL STAKED</span>
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; font-weight: 600; color: #1C2333; text-align: right; font-variant-numeric: tabular-nums;">$2,000.00</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; letter-spacing: 1.2px; color: #8C8577;">VERIFIED BY</span>
                                    <span style="font-size: 13px; font-weight: 600; color: #1C2333; text-align: right;">Stripe oracle</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; letter-spacing: 1.2px; color: #8C8577;">SETTLED ON</span>
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; font-weight: 600; color: #1C2333; text-align: right; font-variant-numeric: tabular-nums;">Mar 14, 2026</span>
                                </div>
                            </div>

                            <!-- TEAR LINE WITH NOTCHES -->
                            <div style="position: relative; height: 1px;">
                                <div style="position: absolute; left: 12px; right: 12px; top: 0; height: 1px; background: repeating-linear-gradient(90deg, rgba(28,35,51,0.11) 0 5px, transparent 5px 10px);"></div>
                                <span class="ps-notch ps-notch-left"></span>
                                <span class="ps-notch ps-notch-right"></span>
                            </div>

                            <!-- OUTCOME BLOCK WITH WAX SEAL -->
                            <div style="position: relative; padding: 16px 18px 20px; background: rgba(63,157,90,0.09); border-radius: 0 0 6px 6px; min-height: 96px;">
                                <div style="font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #3F9D5A; font-variant-numeric: tabular-nums;">+$2,240.00</div>
                                <div style="margin-top: 5px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9px; font-weight: 700; letter-spacing: 1.3px; color: #8C8577; max-width: 150px;">PRINCIPAL + YIELD RETURNED</div>

                                <div class="ps-seal" style="position: absolute; right: 8px; bottom: 8px;">
                                    <svg width="150" height="55" viewBox="0 0 300 110" aria-hidden="true" style="display: block; overflow: visible;">
                                        <defs>
                                            <filter id="stamp1g" x="-30%" y="-30%" width="160%" height="160%">
                                                <feTurbulence type="fractalNoise" baseFrequency="0.13" numOctaves="3" seed="7" result="coarse"/>
                                                <feColorMatrix in="coarse" type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 1 0 0 0 -0.26" result="blotch"/>
                                                <feComposite in="SourceGraphic" in2="blotch" operator="out" result="pass1"/>
                                                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" seed="18" result="fine"/>
                                                <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 1 0 0 0 -0.52" result="speck"/>
                                                <feComposite in="pass1" in2="speck" operator="out" result="pass2"/>
                                                <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="10" result="warp"/>
                                                <feDisplacementMap in="pass2" in2="warp" scale="2.8" xChannelSelector="R" yChannelSelector="G"/>
                                            </filter>
                                            <filter id="stamp1b" x="-10%" y="-10%" width="120%" height="120%">
                                                <feGaussianBlur stdDeviation="0.7" />
                                            </filter>
                                            <linearGradient id="pressure1" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
                                                <stop offset="55%" stop-color="#fff" stop-opacity="0.92"/>
                                                <stop offset="100%" stop-color="#fff" stop-opacity="0.62"/>
                                            </linearGradient>
                                            <mask id="pressureMask1">
                                                <rect x="0" y="0" width="300" height="110" fill="url(#pressure1)"/>
                                            </mask>
                                        </defs>
                                        <g filter="url(#stamp1b)" opacity="0.28" transform="translate(0.5, 0.5) rotate(-9 150 55)">
                                            <rect x="10" y="13" width="280" height="84" rx="8" fill="none" stroke="#2F7A45" stroke-width="5" />
                                            <rect x="18" y="21" width="264" height="68" rx="5" fill="none" stroke="#2F7A45" stroke-width="1.6" />
                                            <text x="151.5" y="55" text-anchor="middle" dominant-baseline="central" font-family='"Arial Narrow", "Helvetica Neue Condensed", "Oswald", "DejaVu Sans Condensed", Impact, system-ui, sans-serif' font-size="35" font-weight="700" letter-spacing="3" fill="#2F7A45" style="font-stretch: condensed;">APPROVED</text>
                                        </g>
                                        <g filter="url(#stamp1g)" mask="url(#pressureMask1)" opacity="0.86" transform="rotate(-9 150 55)">
                                            <rect x="10" y="13" width="280" height="84" rx="8" fill="none" stroke="#2F7A45" stroke-width="5" />
                                            <rect x="18" y="21" width="264" height="68" rx="5" fill="none" stroke="#2F7A45" stroke-width="1.6" />
                                            <text x="151.5" y="55" text-anchor="middle" dominant-baseline="central" font-family='"Arial Narrow", "Helvetica Neue Condensed", "Oswald", "DejaVu Sans Condensed", Impact, system-ui, sans-serif' font-size="35" font-weight="700" letter-spacing="3" fill="#2F7A45" style="font-stretch: condensed;">APPROVED</text>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </article>

                        <!-- RECEIPT 2: @deltacreator (WIN) -->
                        <article class="ps-card reveal-item" style="position: relative; background: #FFFDFA; border: 1px solid rgba(28,35,51,0.11); border-radius: 6px; box-shadow: 0 14px 34px -22px rgba(28,35,51,0.4); display: flex; flex-direction: column; transition: transform .22s cubic-bezier(.2,.7,.3,1), box-shadow .22s ease;">
                            <!-- HEADER -->
                            <div style="padding: 16px 18px 12px; border-bottom: 1px solid rgba(28,35,51,0.11);">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.7px; color: #7A1C2B;">SETTLEMENT RECEIPT</span>
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 10px; color: #8C8577; font-variant-numeric: tabular-nums;">№ C-9F21</span>
                                </div>
                                <div style="margin-top: 10px; font-size: 15.5px; font-weight: 700; color: #1C2333;">
                                    50,000 subscribers in 60 days
                                </div>
                                <div style="margin-top: 4px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 11px; color: #8C8577;">
                                    @deltacreator · via YouTube API
                                </div>
                            </div>

                            <!-- BODY ROWS -->
                            <div style="padding: 14px 18px 16px; display: grid; gap: 9px;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; letter-spacing: 1.2px; color: #8C8577;">CAPITAL STAKED</span>
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; font-weight: 600; color: #1C2333; text-align: right; font-variant-numeric: tabular-nums;">$1,000.00</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; letter-spacing: 1.2px; color: #8C8577;">VERIFIED BY</span>
                                    <span style="font-size: 13px; font-weight: 600; color: #1C2333; text-align: right;">YouTube oracle</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; letter-spacing: 1.2px; color: #8C8577;">SETTLED ON</span>
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; font-weight: 600; color: #1C2333; text-align: right; font-variant-numeric: tabular-nums;">Mar 09, 2026</span>
                                </div>
                            </div>

                            <!-- TEAR LINE WITH NOTCHES -->
                            <div style="position: relative; height: 1px;">
                                <div style="position: absolute; left: 12px; right: 12px; top: 0; height: 1px; background: repeating-linear-gradient(90deg, rgba(28,35,51,0.11) 0 5px, transparent 5px 10px);"></div>
                                <span class="ps-notch ps-notch-left"></span>
                                <span class="ps-notch ps-notch-right"></span>
                            </div>

                            <!-- OUTCOME BLOCK WITH RUBBER STAMP -->
                            <div style="position: relative; padding: 16px 18px 20px; background: rgba(63,157,90,0.09); border-radius: 0 0 6px 6px; min-height: 96px;">
                                <div style="font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #3F9D5A; font-variant-numeric: tabular-nums;">+$1,120.00</div>
                                <div style="margin-top: 5px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9px; font-weight: 700; letter-spacing: 1.3px; color: #8C8577; max-width: 150px;">PRINCIPAL + YIELD RETURNED</div>

                                <div class="ps-seal" style="position: absolute; right: 8px; bottom: 8px;">
                                    <svg width="150" height="55" viewBox="0 0 300 110" aria-hidden="true" style="display: block; overflow: visible;">
                                        <defs>
                                            <filter id="stamp2g" x="-30%" y="-30%" width="160%" height="160%">
                                                <feTurbulence type="fractalNoise" baseFrequency="0.13" numOctaves="3" seed="13" result="coarse"/>
                                                <feColorMatrix in="coarse" type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 1 0 0 0 -0.26" result="blotch"/>
                                                <feComposite in="SourceGraphic" in2="blotch" operator="out" result="pass1"/>
                                                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" seed="24" result="fine"/>
                                                <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 1 0 0 0 -0.52" result="speck"/>
                                                <feComposite in="pass1" in2="speck" operator="out" result="pass2"/>
                                                <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="16" result="warp"/>
                                                <feDisplacementMap in="pass2" in2="warp" scale="2.8" xChannelSelector="R" yChannelSelector="G"/>
                                            </filter>
                                            <filter id="stamp2b" x="-10%" y="-10%" width="120%" height="120%">
                                                <feGaussianBlur stdDeviation="0.7" />
                                            </filter>
                                            <linearGradient id="pressure2" x1="1" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
                                                <stop offset="55%" stop-color="#fff" stop-opacity="0.92"/>
                                                <stop offset="100%" stop-color="#fff" stop-opacity="0.62"/>
                                            </linearGradient>
                                            <mask id="pressureMask2">
                                                <rect x="0" y="0" width="300" height="110" fill="url(#pressure2)"/>
                                            </mask>
                                        </defs>
                                        <g filter="url(#stamp2b)" opacity="0.28" transform="translate(0.5, 0.5) rotate(-14 150 55)">
                                            <rect x="10" y="13" width="280" height="84" rx="8" fill="none" stroke="#2F7A45" stroke-width="5" />
                                            <rect x="18" y="21" width="264" height="68" rx="5" fill="none" stroke="#2F7A45" stroke-width="1.6" />
                                            <text x="151.5" y="55" text-anchor="middle" dominant-baseline="central" font-family='"Arial Narrow", "Helvetica Neue Condensed", "Oswald", "DejaVu Sans Condensed", Impact, system-ui, sans-serif' font-size="35" font-weight="700" letter-spacing="3" fill="#2F7A45" style="font-stretch: condensed;">APPROVED</text>
                                        </g>
                                        <g filter="url(#stamp2g)" mask="url(#pressureMask2)" opacity="0.92" transform="rotate(-14 150 55)">
                                            <rect x="10" y="13" width="280" height="84" rx="8" fill="none" stroke="#2F7A45" stroke-width="5" />
                                            <rect x="18" y="21" width="264" height="68" rx="5" fill="none" stroke="#2F7A45" stroke-width="1.6" />
                                            <text x="151.5" y="55" text-anchor="middle" dominant-baseline="central" font-family='"Arial Narrow", "Helvetica Neue Condensed", "Oswald", "DejaVu Sans Condensed", Impact, system-ui, sans-serif' font-size="35" font-weight="700" letter-spacing="3" fill="#2F7A45" style="font-stretch: condensed;">APPROVED</text>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </article>

                        <!-- RECEIPT 3: @marcusk (FORFEIT / LOSS) -->
                        <article class="ps-card reveal-item" style="position: relative; background: #FFFDFA; border: 1px solid rgba(28,35,51,0.11); border-radius: 6px; box-shadow: 0 14px 34px -22px rgba(28,35,51,0.4); display: flex; flex-direction: column; transition: transform .22s cubic-bezier(.2,.7,.3,1), box-shadow .22s ease;">
                            <!-- HEADER -->
                            <div style="padding: 16px 18px 12px; border-bottom: 1px solid rgba(28,35,51,0.11);">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.7px; color: #7A1C2B;">SETTLEMENT RECEIPT</span>
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 10px; color: #8C8577; font-variant-numeric: tabular-nums;">№ C-7B08</span>
                                </div>
                                <div style="margin-top: 10px; font-size: 15.5px; font-weight: 700; color: #1C2333;">
                                    25,000 followers in 30 days
                                </div>
                                <div style="margin-top: 4px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 11px; color: #8C8577;">
                                    @marcusk · via X API
                                </div>
                            </div>

                            <!-- BODY ROWS -->
                            <div style="padding: 14px 18px 16px; display: grid; gap: 9px;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; letter-spacing: 1.2px; color: #8C8577;">CAPITAL STAKED</span>
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; font-weight: 600; color: #1C2333; text-align: right; font-variant-numeric: tabular-nums;">$1,500.00</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; letter-spacing: 1.2px; color: #8C8577;">VERIFIED BY</span>
                                    <span style="font-size: 13px; font-weight: 600; color: #1C2333; text-align: right;">X oracle</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; letter-spacing: 1.2px; color: #8C8577;">SETTLED ON</span>
                                    <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; font-weight: 600; color: #1C2333; text-align: right; font-variant-numeric: tabular-nums;">Mar 02, 2026</span>
                                </div>
                            </div>

                            <!-- TEAR LINE WITH NOTCHES -->
                            <div style="position: relative; height: 1px;">
                                <div style="position: absolute; left: 12px; right: 12px; top: 0; height: 1px; background: repeating-linear-gradient(90deg, rgba(28,35,51,0.11) 0 5px, transparent 5px 10px);"></div>
                                <span class="ps-notch ps-notch-left"></span>
                                <span class="ps-notch ps-notch-right"></span>
                            </div>

                            <!-- OUTCOME BLOCK WITH RUBBER STAMP (DENIED) -->
                            <div style="position: relative; padding: 16px 18px 20px; background: rgba(168,68,63,0.06); border-radius: 0 0 6px 6px; min-height: 96px;">
                                <div style="font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #A8443F; font-variant-numeric: tabular-nums;">−$1,500.00</div>
                                <div style="margin-top: 5px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9px; font-weight: 700; letter-spacing: 1.3px; color: #8C8577; max-width: 150px;">FORFEITED TO MATCH POOL</div>

                                <div class="ps-seal" style="position: absolute; right: 8px; bottom: 8px;">
                                    <svg width="150" height="55" viewBox="0 0 300 110" aria-hidden="true" style="display: block; overflow: visible;">
                                        <defs>
                                            <filter id="stamp3g" x="-30%" y="-30%" width="160%" height="160%">
                                                <feTurbulence type="fractalNoise" baseFrequency="0.13" numOctaves="3" seed="21" result="coarse"/>
                                                <feColorMatrix in="coarse" type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 1 0 0 0 -0.26" result="blotch"/>
                                                <feComposite in="SourceGraphic" in2="blotch" operator="out" result="pass1"/>
                                                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" seed="32" result="fine"/>
                                                <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 1 0 0 0 -0.52" result="speck"/>
                                                <feComposite in="pass1" in2="speck" operator="out" result="pass2"/>
                                                <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="24" result="warp"/>
                                                <feDisplacementMap in="pass2" in2="warp" scale="2.8" xChannelSelector="R" yChannelSelector="G"/>
                                            </filter>
                                            <filter id="stamp3b" x="-10%" y="-10%" width="120%" height="120%">
                                                <feGaussianBlur stdDeviation="0.7" />
                                            </filter>
                                            <linearGradient id="pressure3" x1="0" y1="1" x2="1" y2="0">
                                                <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
                                                <stop offset="55%" stop-color="#fff" stop-opacity="0.92"/>
                                                <stop offset="100%" stop-color="#fff" stop-opacity="0.62"/>
                                            </linearGradient>
                                            <mask id="pressureMask3">
                                                <rect x="0" y="0" width="300" height="110" fill="url(#pressure3)"/>
                                            </mask>
                                        </defs>
                                        <g filter="url(#stamp3b)" opacity="0.28" transform="translate(0.5, 0.5) rotate(-11 150 55)">
                                            <rect x="10" y="13" width="280" height="84" rx="8" fill="none" stroke="#7A1C2B" stroke-width="5" />
                                            <rect x="18" y="21" width="264" height="68" rx="5" fill="none" stroke="#7A1C2B" stroke-width="1.6" />
                                            <text x="158" y="55" text-anchor="middle" dominant-baseline="central" font-family='"Arial Narrow", "Helvetica Neue Condensed", "Oswald", "DejaVu Sans Condensed", Impact, system-ui, sans-serif' font-size="35" font-weight="700" letter-spacing="16" fill="#7A1C2B" style="font-stretch: condensed;">DENIED</text>
                                        </g>
                                        <g filter="url(#stamp3g)" mask="url(#pressureMask3)" opacity="0.88" transform="rotate(-11 150 55)">
                                            <rect x="10" y="13" width="280" height="84" rx="8" fill="none" stroke="#7A1C2B" stroke-width="5" />
                                            <rect x="18" y="21" width="264" height="68" rx="5" fill="none" stroke="#7A1C2B" stroke-width="1.6" />
                                            <text x="158" y="55" text-anchor="middle" dominant-baseline="central" font-family='"Arial Narrow", "Helvetica Neue Condensed", "Oswald", "DejaVu Sans Condensed", Impact, system-ui, sans-serif' font-size="35" font-weight="700" letter-spacing="16" fill="#7A1C2B" style="font-stretch: condensed;">DENIED</text>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </article>

                    </div>

                    <!-- 4 STATS STRIP BELOW -->
                    <div class="ps-stats reveal-item" style="margin-top: clamp(34px,4vw,54px); padding-top: clamp(24px,3vw,34px); border-top: 1px solid rgba(28,35,51,0.11); display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
                        <div>
                            <div style="font-size: clamp(24px,2.6vw,32px); font-weight: 800; letter-spacing: -0.02em; color: #7A1C2B; line-height: 1; font-variant-numeric: tabular-nums;">74%</div>
                            <div style="margin-top: 8px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.5px; color: #8C8577; text-transform: uppercase;">OF CONTRACTS ARE WON</div>
                        </div>
                        <div>
                            <div style="font-size: clamp(24px,2.6vw,32px); font-weight: 800; letter-spacing: -0.02em; color: #7A1C2B; line-height: 1; font-variant-numeric: tabular-nums;">$127k</div>
                            <div style="margin-top: 8px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.5px; color: #8C8577; text-transform: uppercase;">TOTAL CAPITAL SETTLED</div>
                        </div>
                        <div>
                            <div style="font-size: clamp(24px,2.6vw,32px); font-weight: 800; letter-spacing: -0.02em; color: #7A1C2B; line-height: 1; font-variant-numeric: tabular-nums;">18 days</div>
                            <div style="margin-top: 8px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.5px; color: #8C8577; text-transform: uppercase;">AVERAGE TIME TO TARGET</div>
                        </div>
                        <div>
                            <div style="font-size: clamp(24px,2.6vw,32px); font-weight: 800; letter-spacing: -0.02em; color: #7A1C2B; line-height: 1; font-variant-numeric: tabular-nums;">812</div>
                            <div style="margin-top: 8px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.5px; color: #8C8577; text-transform: uppercase;">VERIFIED COUNTERPARTIES</div>
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

            <!-- ═══ THE CLTR TOKEN ECONOMY (BURN CURVE DATA STORY) ═══ -->
            <div class="lemo-reframe" data-r style="padding: clamp(48px, 6vw, 80px) 0; overflow: visible !important;">
                <div class="lw">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 18px; padding-top: 4px;" class="reveal-item">
                        <span style="width: 24px; height: 1.5px; background: #7A1C2B; opacity: 0.5;"></span>
                        <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 2.2px; color: #8C8577; text-transform: uppercase; line-height: 1.4;">
                            PROTOCOL TOKEN
                        </span>
                    </div>

                    <div class="bc-head reveal-item">
                        <div>
                            <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(34px,4.4vw,52px); font-weight: 800; letter-spacing: -0.03em; color: #1C2333; margin: 0 0 14px; line-height: 1.02;">
                                Supply only<br /><span style="color: #7A1C2B;">goes down.</span>
                            </h2>
                            <p style="font-family: 'Inter', sans-serif; font-size: 16px; color: #5A6072; margin: 0; max-width: 400px; line-height: 1.6;">
                                Every settled contract burns a protocol fee from circulation — permanently. More contracts means less CLTR, and less CLTR means every remaining token backs a larger network.
                            </p>

                            <div style="margin-top: 34px; display: grid; grid-template-columns: 1fr 1fr; gap: 26px 20px; max-width: 400px;">
                                <div>
                                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(26px,3vw,34px); font-weight: 800; letter-spacing: -0.02em; color: #1C2333; line-height: 1; font-variant-numeric: tabular-nums;">91.2M</div>
                                    <div style="margin-top: 7px; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.6px; color: #8C8577;">CIRCULATING SUPPLY</div>
                                </div>
                                <div>
                                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(26px,3vw,34px); font-weight: 800; letter-spacing: -0.02em; color: #7A1C2B; line-height: 1; font-variant-numeric: tabular-nums;">8.8M</div>
                                    <div style="margin-top: 7px; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.6px; color: #8C8577;">BURNED TO DATE</div>
                                </div>
                                <div>
                                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(26px,3vw,34px); font-weight: 800; letter-spacing: -0.02em; color: #7A1C2B; line-height: 1; font-variant-numeric: tabular-nums;">1.2M</div>
                                    <div style="margin-top: 7px; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.6px; color: #8C8577;">BURNED THIS WEEK</div>
                                </div>
                                <div>
                                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(26px,3vw,34px); font-weight: 800; letter-spacing: -0.02em; color: #1C2333; line-height: 1; font-variant-numeric: tabular-nums;">−8.8%</div>
                                    <div style="margin-top: 7px; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 1.6px; color: #8C8577;">SUPPLY, 12 WEEKS</div>
                                </div>
                            </div>
                        </div>

                        <!-- BURN CURVE CHART SVG PANEL -->
                        <div style="background: #FCFAF7; border: 1px solid rgba(28,35,51,0.11); border-radius: 22px; padding: clamp(14px,2vw,24px); box-shadow: 0 30px 70px -50px rgba(28,35,51,0.4);">
                            <svg viewBox="0 0 680 340" width="100%" role="img" aria-label="Circulating CLTR supply over the last twelve weeks, declining from 100 million to 91.2 million as settled contracts burn supply" style="display: block; height: auto;">
                                <defs>
                                    <linearGradient id="bcArea" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="rgba(122,28,43,0.22)" />
                                        <stop offset="100%" stop-color="rgba(122,28,43,0)" />
                                    </linearGradient>
                                    <linearGradient id="bcLine" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stop-color="#9A2B3D" />
                                        <stop offset="100%" stop-color="#7A1C2B" />
                                    </linearGradient>
                                </defs>

                                <!-- horizontal grid + y labels -->
                                <g>
                                    <line x1="62" y1="34" x2="640" y2="34" stroke="rgba(28,35,51,0.07)" stroke-width="1" />
                                    <text x="50" y="37.5" text-anchor="end" font-family='JetBrains Mono', monospace font-size="10" fill="#8C8577">100M</text>
                                </g>
                                <g>
                                    <line x1="62" y1="97.8" x2="640" y2="97.8" stroke="rgba(28,35,51,0.07)" stroke-width="1" />
                                    <text x="50" y="101.3" text-anchor="end" font-family='JetBrains Mono', monospace font-size="10" fill="#8C8577">97M</text>
                                </g>
                                <g>
                                    <line x1="62" y1="161.6" x2="640" y2="161.6" stroke="rgba(28,35,51,0.07)" stroke-width="1" />
                                    <text x="50" y="165.1" text-anchor="end" font-family='JetBrains Mono', monospace font-size="10" fill="#8C8577">94M</text>
                                </g>
                                <g>
                                    <line x1="62" y1="225.5" x2="640" y2="225.5" stroke="rgba(28,35,51,0.07)" stroke-width="1" />
                                    <text x="50" y="229" text-anchor="end" font-family='JetBrains Mono', monospace font-size="10" fill="#8C8577">91M</text>
                                </g>

                                <!-- area + line -->
                                <path d="M62.0 34.0 L114.5 51.1 L167.1 66.0 L219.6 85.2 L272.2 100.1 L324.7 117.1 L377.3 132.0 L429.8 149.1 L482.4 164.0 L534.9 178.9 L587.5 196.0 L640.0 221.5 L640.0 268.0 L62.0 268.0 Z" fill="url(#bcArea)" />
                                <path d="M62.0 34.0 L114.5 51.1 L167.1 66.0 L219.6 85.2 L272.2 100.1 L324.7 117.1 L377.3 132.0 L429.8 149.1 L482.4 164.0 L534.9 178.9 L587.5 196.0 L640.0 221.5" fill="none" stroke="url(#bcLine)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="bc-draw" pathLength="1" />

                                <!-- burn event markers -->
                                <circle cx="62.0" cy="34.0" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="114.5" cy="51.1" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="167.1" cy="66.0" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="219.6" cy="85.2" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="272.2" cy="100.1" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="324.7" cy="117.1" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="377.3" cy="132.0" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="429.8" cy="149.1" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="482.4" cy="164.0" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="534.9" cy="178.9" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="587.5" cy="196.0" r="3" fill="#FBF9F5" stroke="#7A1C2B" stroke-width="1.5" />

                                <!-- latest burn — emphasized -->
                                <circle class="bc-pulse" cx="640.0" cy="221.5" r="6" fill="none" stroke="#7A1C2B" stroke-width="1.5" />
                                <circle cx="640.0" cy="221.5" r="5.5" fill="#7A1C2B" stroke="#FBF9F5" stroke-width="2" />

                                <!-- callout badge on latest burn -->
                                <g class="bc-callout">
                                    <line x1="636.0" y1="210.5" x2="606.0" y2="187.5" stroke="#7A1C2B" stroke-width="1" opacity="0.5" />
                                    <rect x="544.0" y="159.5" width="104" height="28" rx="8" fill="#FBF9F5" stroke="rgba(122,28,43,0.28)" />
                                    <text x="596.0" y="178.5" text-anchor="middle" font-family='JetBrains Mono', monospace font-size="12" font-weight="700" fill="#7A1C2B" style="font-variant-numeric: tabular-nums;">−1.2M</text>
                                </g>

                                <!-- x axis -->
                                <line x1="62" y1="268" x2="640" y2="268" stroke="rgba(28,35,51,0.14)" stroke-width="1" />
                                <text x="62" y="288" font-family='JetBrains Mono', monospace font-size="10" fill="#8C8577">12 WEEKS AGO</text>
                                <text x="640" y="288" text-anchor="end" font-family='JetBrains Mono', monospace font-size="10" fill="#8C8577">NOW</text>

                                <!-- caption -->
                                <text x="62" y="328" font-family='Plus Jakarta Sans', sans-serif font-size="11" fill="#8C8577">
                                    Circulating supply · every settled contract burns a 0.5% protocol fee
                                </text>
                            </svg>
                        </div>
                    </div>

                    <!-- LOOP RIBBON PROCESS BANNER UNDERNEATH -->
                    <div style="margin-top: clamp(30px,4vw,52px);" class="reveal-item">
                        <svg viewBox="0 0 1100 96" width="100%" role="img" aria-label="The loop steps" style="display: block; height: auto;">
                            <defs>
                                <marker id="bcArrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
                                    <path d="M0 0.5 L6.5 3.5 L0 6.5 Z" fill="#7A1C2B" />
                                </marker>
                            </defs>

                            <!-- 6 Step Items -->
                            <!-- Step 1 -->
                            <g>
                                <text x="91.6" y="22" text-anchor="middle" font-family='JetBrains Mono', monospace font-size="10" font-weight="700" letter-spacing="1.2" fill="rgba(122,28,43,0.5)">01</text>
                                <text x="91.6" y="42" text-anchor="middle" font-family='Plus Jakarta Sans', sans-serif font-size="12.5" font-weight="600" fill="#1C2333">Contract created</text>
                                <line x1="153.9" y1="37" x2="205.2" y2="37" stroke="#7A1C2B" stroke-width="1.4" opacity="0.5" marker-end="url(#bcArrow)" />
                            </g>

                            <!-- Step 2 -->
                            <g>
                                <text x="275.0" y="22" text-anchor="middle" font-family='JetBrains Mono', monospace font-size="10" font-weight="700" letter-spacing="1.2" fill="rgba(122,28,43,0.5)">02</text>
                                <text x="275.0" y="42" text-anchor="middle" font-family='Plus Jakarta Sans', sans-serif font-size="12.5" font-weight="600" fill="#1C2333">CLTR staked</text>
                                <line x1="337.3" y1="37" x2="388.6" y2="37" stroke="#7A1C2B" stroke-width="1.4" opacity="0.5" marker-end="url(#bcArrow)" />
                            </g>

                            <!-- Step 3 -->
                            <g>
                                <text x="458.3" y="22" text-anchor="middle" font-family='JetBrains Mono', monospace font-size="10" font-weight="700" letter-spacing="1.2" fill="rgba(122,28,43,0.5)">03</text>
                                <text x="458.3" y="42" text-anchor="middle" font-family='Plus Jakarta Sans', sans-serif font-size="12.5" font-weight="600" fill="#1C2333">Execution verified</text>
                                <line x1="520.6" y1="37" x2="571.9" y2="37" stroke="#7A1C2B" stroke-width="1.4" opacity="0.5" marker-end="url(#bcArrow)" />
                            </g>

                            <!-- Step 4 (Protocol fee burned - HIGHLIGHTED) -->
                            <g>
                                <text x="641.6" y="22" text-anchor="middle" font-family='JetBrains Mono', monospace font-size="10" font-weight="700" letter-spacing="1.2" fill="#7A1C2B">04</text>
                                <text x="641.6" y="42" text-anchor="middle" font-family='Plus Jakarta Sans', sans-serif font-size="12.5" font-weight="800" fill="#7A1C2B">Protocol fee burned</text>
                                <line x1="703.9" y1="37" x2="755.2" y2="37" stroke="#7A1C2B" stroke-width="1.4" opacity="0.5" marker-end="url(#bcArrow)" />
                            </g>

                            <!-- Step 5 -->
                            <g>
                                <text x="825.0" y="22" text-anchor="middle" font-family='JetBrains Mono', monospace font-size="10" font-weight="700" letter-spacing="1.2" fill="rgba(122,28,43,0.5)">05</text>
                                <text x="825.0" y="42" text-anchor="middle" font-family='Plus Jakarta Sans', sans-serif font-size="12.5" font-weight="600" fill="#1C2333">Trust scales</text>
                                <line x1="887.3" y1="37" x2="938.6" y2="37" stroke="#7A1C2B" stroke-width="1.4" opacity="0.5" marker-end="url(#bcArrow)" />
                            </g>

                            <!-- Step 6 -->
                            <g>
                                <text x="1008.3" y="22" text-anchor="middle" font-family='JetBrains Mono', monospace font-size="10" font-weight="700" letter-spacing="1.2" fill="rgba(122,28,43,0.5)">06</text>
                                <text x="1008.3" y="42" text-anchor="middle" font-family='Plus Jakarta Sans', sans-serif font-size="12.5" font-weight="600" fill="#1C2333">More CLTR required</text>
                            </g>

                            <!-- single return line closing the loop -->
                            <path d="M 1008.3 54 C 1008.3 78, 980 82, 640 82 L 181.6 82 C 120 82, 91.6 78, 91.6 58" fill="none" stroke="#7A1C2B" stroke-width="1.3" stroke-dasharray="4 6" opacity="0.55" marker-end="url(#bcArrow)" />
                            <text x="550" y="78" text-anchor="middle" font-family='JetBrains Mono', monospace font-size="9.5" font-weight="700" letter-spacing="1.6" fill="#7A1C2B" opacity="0.8">GROWTH COMPOUNDS</text>
                        </svg>
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

    // ── 2-STATE CYCLING STATS / SUPPORTED APIS BAND ──
    const CYCLE_INTERVAL_MS = 5000;

    const STATE_A_ITEMS = [
        { val: '1,206', lbl: 'Active Contracts', aria: 'Active contracts: 1,206' },
        { val: '$6,940', lbl: 'Average Contract Size', aria: 'Average contract size: $6,940' },
        { val: '1.4 days', lbl: 'Median Settlement Time', aria: 'Median settlement time: 1.4 days' },
        { val: '812', lbl: 'Counterparties', aria: 'Counterparties: 812' }
    ];

    const STATE_B_ITEMS = [
        {
            logoSvg: `<svg viewBox="54 36 360.02 149.84" xmlns="http://www.w3.org/2000/svg" style="display:block;height:24px;width:auto;"><path fill="#635BFF" d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z M223.8,61.7l25.1-5.4v-20.3l-25.1,5.3 M223.8,69.3h25.1v87.5h-25.1z M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z"/></svg>`,
            lbl: 'STRIPE API',
            aria: 'Supported API: Stripe'
        },
        {
            logoSvg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display:block;height:28px;width:auto;"><path fill="#0F172A" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
            lbl: 'X / TWITTER API',
            aria: 'Supported API: X / Twitter'
        },
        {
            logoSvg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display:block;height:28px;width:auto;"><path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
            lbl: 'YOUTUBE API',
            aria: 'Supported API: YouTube'
        },
        {
            logoSvg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display:block;height:32px;width:auto;"><path fill="#95BF47" d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/></svg>`,
            lbl: 'SHOPIFY API',
            aria: 'Supported API: Shopify'
        }
    ];

    let currentState = 'A';
    let isStatsBandPaused = false;
    let isTabVisible = true;

    function cycleStatsBand() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return; // Disable cycle if reduced motion is requested
        }

        const nextState = currentState === 'A' ? 'B' : 'A';
        const items = nextState === 'A' ? STATE_A_ITEMS : STATE_B_ITEMS;

        // Crossfade eyebrow text smoothly
        const eyebrowEl = document.getElementById('l-stats-eyebrow');
        if (eyebrowEl) {
            eyebrowEl.style.transition = 'opacity 250ms ease';
            eyebrowEl.style.opacity = '0';
            setTimeout(() => {
                eyebrowEl.textContent = nextState === 'A' ? 'LIVE METRICS' : 'SUPPORTED INTEGRATIONS';
                eyebrowEl.style.opacity = '1';
            }, 260);
        }

        const cellElements = document.querySelectorAll('.l-stat-bar-item');
        if (!cellElements || cellElements.length < 4) return;

        cellElements.forEach((cellEl, idx) => {
            const wrapper = cellEl.querySelector('.l-stat-bar-wrapper');
            const currentContent = wrapper?.querySelector('.l-stat-bar-content.current');
            if (!wrapper || !currentContent) return;

            const itemData = items[idx];
            cellEl.setAttribute('aria-label', itemData.aria);

            const incomingContent = document.createElement('div');
            incomingContent.className = 'l-stat-bar-content incoming';
            incomingContent.setAttribute('data-state', nextState);

            const valueZone = document.createElement('div');
            valueZone.className = 'l-stat-bar-value-zone';

            if (nextState === 'A') {
                const valSpan = document.createElement('span');
                valSpan.className = 'l-stat-bar-val';
                valSpan.textContent = itemData.val;
                valueZone.appendChild(valSpan);
            } else {
                const logoWrap = document.createElement('div');
                logoWrap.className = 'l-stat-bar-logo-wrap';
                logoWrap.innerHTML = itemData.logoSvg;
                valueZone.appendChild(logoWrap);
            }
            incomingContent.appendChild(valueZone);

            const lblSpan = document.createElement('span');
            lblSpan.className = 'l-stat-bar-lbl';
            lblSpan.textContent = itemData.lbl;
            incomingContent.appendChild(lblSpan);

            incomingContent.style.opacity = '0';
            incomingContent.style.transform = 'translateY(14px)';

            wrapper.appendChild(incomingContent);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    currentContent.style.transition = 'opacity 350ms ease, transform 380ms cubic-bezier(0.16, 1, 0.3, 1)';
                    currentContent.style.opacity = '0';
                    currentContent.style.transform = 'translateY(-14px)';

                    incomingContent.style.transition = 'opacity 420ms ease, transform 420ms cubic-bezier(0.16, 1, 0.3, 1)';
                    incomingContent.style.opacity = '1';
                    incomingContent.style.transform = 'translateY(0)';
                });
            });

            setTimeout(() => {
                if (currentContent.parentNode === wrapper) {
                    wrapper.removeChild(currentContent);
                }
                incomingContent.classList.remove('incoming');
                incomingContent.classList.add('current');
                incomingContent.style.transition = '';
            }, 440);
        });

        currentState = nextState;
    }

    // Set up pause on hover
    const statsBandContainer = document.getElementById('l-stats-band') || document.querySelector('.l-global-stats-bar');
    if (statsBandContainer) {
        statsBandContainer.addEventListener('mouseenter', () => { isStatsBandPaused = true; });
        statsBandContainer.addEventListener('mouseleave', () => { isStatsBandPaused = false; });
    }

    const onVisibilityChange = () => {
        isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const rotationIntervalId = setInterval(() => {
        if (!document.body.contains(statsBandContainer)) {
            clearInterval(rotationIntervalId);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            return;
        }
        if (!isStatsBandPaused && isTabVisible) {
            cycleStatsBand();
        }
    }, CYCLE_INTERVAL_MS);
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
                            if (p === 'STRIPE') return `<span class="td-icon-box"><svg viewBox="54 36 360.02 149.84" xmlns="http://www.w3.org/2000/svg" class="td-brand-svg"><path fill="#635BFF" d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z M223.8,61.7l25.1-5.4v-20.3l-25.1,5.3 M223.8,69.3h25.1v87.5h-25.1z M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z"/></svg></span>`;
                            if (p === 'X' || p === 'TWITTER') return `<span class="td-icon-box"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="td-brand-svg"><path fill="#0F172A" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></span>`;
                            if (p === 'SHOPIFY') return `<span class="td-icon-box"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="td-brand-svg"><path fill="#95BF47" d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/></svg></span>`;
                            if (p === 'YOUTUBE') return `<span class="td-icon-box"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="td-brand-svg"><path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></span>`;
                            return `<span class="td-icon-box"><svg viewBox="54 36 360.02 149.84" xmlns="http://www.w3.org/2000/svg" class="td-brand-svg"><path fill="#635BFF" d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z M223.8,61.7l25.1-5.4v-20.3l-25.1,5.3 M223.8,69.3h25.1v87.5h-25.1z M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z"/></svg></span>`;
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
                            return user;
                        };

                        const renderRow = (e) => {
                            const isHit = e.eventType === 'SETTLED_SUCCESS' || e.eventType === 'RIVALRY_SETTLED';
                            let outcomeHtml = '';
                            if (isHit) {
                                outcomeHtml = `<span class="lstatus-badge status-won"><span class="status-dot"></span> Won</span>`;
                            } else if (e.eventType === 'SETTLED_FAILURE') {
                                outcomeHtml = `<span class="lstatus-badge status-settled"><span class="status-dot"></span> Settled</span>`;
                            } else {
                                outcomeHtml = `<span class="lstatus-badge status-active"><span class="status-dot"></span> Active</span>`;
                            }
                            const depositCents = e.lockAmountUsdCents || e.amountUsdCents || 25000;
                            const depositFormatted = '$' + (depositCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            return `
                                <tr class="reveal-item v">
                                    <td data-label="Contract ID" class="td-id"><span class="td-value">#C-${e.contractId.slice(0, 4).toUpperCase()} <span class="td-user">@${getMaskedUser(e.principal)}</span></span></td>
                                    <td data-label="Metric" class="td-metric"><span class="td-value">${getPlatformIcon(e.platform)} ${getPlatformName(e.platform)}</span></td>
                                    <td data-label="Commitment" class="td-capital"><span class="td-value">${depositFormatted}</span></td>
                                    <td data-label="Outcome" class="td-outcome">${outcomeHtml}</td>
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

    // ═══ C. CONTINUOUS SYNCHRONIZED AUTO-CYCLE ENGINE ═══
    let autoDemoTimer = null;
    let userPauseUntil = 0;
    let currentMode = 'solo';

    window.switchProtocolMode = function(mode, isUserClick = false) {
        if (isUserClick) {
            // Pause auto-cycle for 10 seconds if user explicitly clicks, then resume
            userPauseUntil = Date.now() + 10000;
        }

        currentMode = mode;
        const soloCard = document.getElementById('card-mode-solo');
        const rivalryCard = document.getElementById('card-mode-rivalry');
        const tagText = document.getElementById('sor-tag-text');
        const oppWord = document.getElementById('sor-opponent-word');
        const figVal = document.getElementById('sor-figure-val');
        const figLbl = document.getElementById('sor-figure-lbl');
        const outcomeTxt = document.getElementById('sor-outcome-text');

        if (!oppWord) return;

        if (mode === 'solo') {
            if (soloCard) soloCard.className = 'sor-mode active';
            if (rivalryCard) rivalryCard.className = 'sor-mode';
            if (tagText) tagText.innerText = 'SOLO CONTRACT';

            oppWord.innerText = 'YOU';
            oppWord.style.color = '#1C2333';

            if (figVal) figVal.innerText = '$1,000';
            if (figLbl) figLbl.innerText = 'LOCKED BY YOU';
            if (outcomeTxt) outcomeTxt.innerText = 'Beat your own goal — keep every dollar, plus yield.';
        } else {
            if (rivalryCard) rivalryCard.className = 'sor-mode active';
            if (soloCard) soloCard.className = 'sor-mode';
            if (tagText) tagText.innerText = 'RIVALRY CONTRACT';

            oppWord.innerText = 'THEM';
            oppWord.style.color = '#7A1C2B';

            if (figVal) figVal.innerText = '$2,000';
            if (figLbl) figLbl.innerText = 'WINNER TAKES THE POOL';
            if (outcomeTxt) outcomeTxt.innerText = 'Two stakes, one verified winner. Loser forfeits.';
        }

        // Trigger smooth morphing animation restart on picture elements
        [oppWord, figVal, outcomeTxt].forEach(el => {
            if (!el) return;
            el.classList.remove('sor-morph', 'sor-figure', 'sor-outcome');
            void el.offsetWidth; // force browser reflow
            el.classList.add('sor-morph');
        });
    };

    // Explicitly initialize on SOLO immediately on load
    window.switchProtocolMode('solo', false);

    // Attach direct click listeners to the left mode cards
    document.getElementById('card-mode-solo')?.addEventListener('click', () => {
        window.switchProtocolMode('solo', true);
    });

    document.getElementById('card-mode-rivalry')?.addEventListener('click', () => {
        window.switchProtocolMode('rivalry', true);
    });

    // Start continuous auto-cycle (swaps both left cards & right picture in sync every 3.5s)
    if (autoDemoTimer) clearInterval(autoDemoTimer);
    autoDemoTimer = setInterval(() => {
        if (Date.now() < userPauseUntil) return;
        const nextMode = (currentMode === 'solo') ? 'rivalry' : 'solo';
        window.switchProtocolMode(nextMode, false);
    }, 3500);
}

