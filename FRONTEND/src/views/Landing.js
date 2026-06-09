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
                        <div class="lpreview-container">
                            <!-- STAGE 1: TERMS -->
                            <div class="lpreview-card stage-card active" data-stage="1">
                                <div class="lpcard-header">
                                    <div class="lpcard-logo-area">
                                        <svg class="lpcard-logo-s" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M13.976 9.15c-1.372-.47-2.502-.816-2.502-1.434 0-.515.467-.852 1.277-.852.886 0 1.95.32 2.766.745l.623-2.185c-.91-.397-2.155-.733-3.46-.733-2.614 0-4.385 1.34-4.385 3.652 0 2.378 2.012 3.036 3.692 3.616 1.488.515 2.185.875 2.185 1.488 0 .616-.623.97-1.488.97-.992 0-2.222-.44-3.07-.935l-.645 2.228c.99.49 2.454.896 3.824.896 2.72 0 4.542-1.293 4.542-3.714 0-2.434-1.92-3.08-3.56-3.644z"/>
                                        </svg>
                                        <span class="lpcard-header-title">COLLATERAL CONTRACT</span>
                                    </div>
                                    <div class="lpcard-status status-active" style="background:#F3F4F6; border-color:#E5E7EB; color:#374151;">
                                        <span class="status-dot" style="background:#9CA3AF;"></span>
                                        DRAFT
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-goal-target-row">
                                    <div class="lpcard-field">
                                        <span class="field-label">GOAL</span>
                                        <span class="field-value">Increase Revenue</span>
                                    </div>
                                    <div class="lpcard-field">
                                        <span class="field-label">TARGET</span>
                                        <span class="field-value">+20.0%</span>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-financials-row">
                                    <div class="lpcard-financial-cell">
                                        <span class="field-label">DEPOSIT</span>
                                        <span class="financial-val">$500.00</span>
                                        <span class="financial-sub">To lock in escrow</span>
                                    </div>
                                    <div class="lpcard-financial-cell">
                                        <span class="field-label">REWARD MATCH</span>
                                        <span class="financial-val">+$500.00</span>
                                        <span class="financial-sub">Match ready</span>
                                    </div>
                                    <div class="lpcard-financial-cell">
                                        <span class="field-label">POTENTIAL RETURN</span>
                                        <span class="financial-val green">$1,000.00</span>
                                        <span class="financial-sub green">Deposit + Reward</span>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-outcomes-row">
                                    <div class="outcome-panel success">
                                        <div class="outcome-header">
                                            <div class="outcome-icon-circle green">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <span class="outcome-title green">SUCCESS</span>
                                        </div>
                                        <span class="outcome-sub">You receive</span>
                                        <span class="outcome-val green">$1,000.00</span>
                                        <span class="outcome-desc">When target is achieved</span>
                                    </div>
                                    <div class="outcome-panel failure">
                                        <div class="outcome-header">
                                            <div class="outcome-icon-circle red">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </div>
                                            <span class="outcome-title red">FAILURE</span>
                                        </div>
                                        <span class="outcome-sub">You forfeit</span>
                                        <span class="outcome-val red">$500.00</span>
                                        <span class="outcome-desc">If target is not met</span>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-progress-row">
                                    <div class="progress-header">
                                        <span class="progress-label">PROGRESS</span>
                                        <span class="progress-percentage">0% COMPLETED</span>
                                    </div>
                                    <div class="progress-bar-track">
                                        <div class="progress-bar-fill" style="width: 0%;"></div>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-time-row">
                                    <span class="time-label">TIME REMAINING</span>
                                    <div class="time-display-grid">
                                        <div class="time-box">
                                            <span class="time-num">30</span>
                                            <span class="time-unit">DAYS</span>
                                        </div>
                                        <div class="time-divider"></div>
                                        <div class="time-box">
                                            <span class="time-num">00</span>
                                            <span class="time-unit">HRS</span>
                                        </div>
                                        <div class="time-divider"></div>
                                        <div class="time-box">
                                            <span class="time-num">00</span>
                                            <span class="time-unit">MIN</span>
                                        </div>
                                        <div class="time-divider"></div>
                                        <div class="time-box">
                                            <span class="time-num">00</span>
                                            <span class="time-unit">SEC</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="lpcard-footer">
                                    <svg class="footer-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <span>FUNDS SECURED BY STRIPE</span>
                                </div>
                            </div>

                            <!-- STAGE 2: TRACKING -->
                            <div class="lpreview-card stage-card" data-stage="2">
                                <div class="lpcard-header">
                                    <div class="lpcard-logo-area">
                                        <svg class="lpcard-logo-s" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M13.976 9.15c-1.372-.47-2.502-.816-2.502-1.434 0-.515.467-.852 1.277-.852.886 0 1.95.32 2.766.745l.623-2.185c-.91-.397-2.155-.733-3.46-.733-2.614 0-4.385 1.34-4.385 3.652 0 2.378 2.012 3.036 3.692 3.616 1.488.515 2.185.875 2.185 1.488 0 .616-.623.97-1.488.97-.992 0-2.222-.44-3.07-.935l-.645 2.228c.99.49 2.454.896 3.824.896 2.72 0 4.542-1.293 4.542-3.714 0-2.434-1.92-3.08-3.56-3.644z"/>
                                        </svg>
                                        <span class="lpcard-header-title">COLLATERAL CONTRACT</span>
                                    </div>
                                    <div class="lpcard-status status-active">
                                        <span class="status-dot"></span>
                                        ACTIVE
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-goal-target-row">
                                    <div class="lpcard-field">
                                        <span class="field-label">GOAL</span>
                                        <span class="field-value">Increase Revenue</span>
                                    </div>
                                    <div class="lpcard-field">
                                        <span class="field-label">TARGET</span>
                                        <span class="field-value">+20.0%</span>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-financials-row">
                                    <div class="lpcard-financial-cell">
                                        <span class="field-label">DEPOSIT</span>
                                        <span class="financial-val">$500.00</span>
                                        <span class="financial-sub">Locked in escrow</span>
                                    </div>
                                    <div class="lpcard-financial-cell">
                                        <span class="field-label">REWARD MATCH</span>
                                        <span class="financial-val">+$500.00</span>
                                        <span class="financial-sub">If target is achieved</span>
                                    </div>
                                    <div class="lpcard-financial-cell">
                                        <span class="field-label">POTENTIAL RETURN</span>
                                        <span class="financial-val green">$1,000.00</span>
                                        <span class="financial-sub green">Deposit + Reward</span>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-outcomes-row">
                                    <div class="outcome-panel success">
                                        <div class="outcome-header">
                                            <div class="outcome-icon-circle green">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <span class="outcome-title green">SUCCESS</span>
                                        </div>
                                        <span class="outcome-sub">You receive</span>
                                        <span class="outcome-val green">$1,000.00</span>
                                        <span class="outcome-desc">When target is achieved</span>
                                    </div>
                                    <div class="outcome-panel failure">
                                        <div class="outcome-header">
                                            <div class="outcome-icon-circle red">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </div>
                                            <span class="outcome-title red">FAILURE</span>
                                        </div>
                                        <span class="outcome-sub">You forfeit</span>
                                        <span class="outcome-val red">$500.00</span>
                                        <span class="outcome-desc">If target is not met</span>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-progress-row">
                                    <div class="progress-header">
                                        <span class="progress-label">PROGRESS</span>
                                        <span class="progress-percentage">67% COMPLETED</span>
                                    </div>
                                    <div class="progress-bar-track">
                                        <div class="progress-bar-fill" style="width: 67%;"></div>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-time-row">
                                    <span class="time-label">TIME REMAINING</span>
                                    <div class="time-display-grid">
                                        <div class="time-box">
                                            <span class="time-num">9</span>
                                            <span class="time-unit">DAYS</span>
                                        </div>
                                        <div class="time-divider"></div>
                                        <div class="time-box">
                                            <span class="time-num">14</span>
                                            <span class="time-unit">HRS</span>
                                        </div>
                                        <div class="time-divider"></div>
                                        <div class="time-box">
                                            <span class="time-num">22</span>
                                            <span class="time-unit">MIN</span>
                                        </div>
                                        <div class="time-divider"></div>
                                        <div class="time-box">
                                            <span class="time-num">45</span>
                                            <span class="time-unit">SEC</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="lpcard-footer">
                                    <svg class="footer-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <span>FUNDS SECURED BY STRIPE</span>
                                </div>
                            </div>

                            <!-- STAGE 3: SETTLED -->
                            <div class="lpreview-card stage-card" data-stage="3">
                                <div class="lpcard-header">
                                    <div class="lpcard-logo-area">
                                        <svg class="lpcard-logo-s" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M13.976 9.15c-1.372-.47-2.502-.816-2.502-1.434 0-.515.467-.852 1.277-.852.886 0 1.95.32 2.766.745l.623-2.185c-.91-.397-2.155-.733-3.46-.733-2.614 0-4.385 1.34-4.385 3.652 0 2.378 2.012 3.036 3.692 3.616 1.488.515 2.185.875 2.185 1.488 0 .616-.623.97-1.488.97-.992 0-2.222-.44-3.07-.935l-.645 2.228c.99.49 2.454.896 3.824.896 2.72 0 4.542-1.293 4.542-3.714 0-2.434-1.92-3.08-3.56-3.644z"/>
                                        </svg>
                                        <span class="lpcard-header-title">COLLATERAL CONTRACT</span>
                                    </div>
                                    <div class="lpcard-status status-settled" style="background:#ECFDF5; border-color:#D1FAE5; color:#065F46;">
                                        <span class="status-dot" style="background:#10B981;"></span>
                                        SETTLED
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-goal-target-row">
                                    <div class="lpcard-field">
                                        <span class="field-label">GOAL</span>
                                        <span class="field-value">Increase Revenue</span>
                                    </div>
                                    <div class="lpcard-field">
                                        <span class="field-label">TARGET</span>
                                        <span class="field-value">+20.0%</span>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-financials-row">
                                    <div class="lpcard-financial-cell">
                                        <span class="field-label">DEPOSIT</span>
                                        <span class="financial-val">$500.00</span>
                                        <span class="financial-sub">Released to user</span>
                                    </div>
                                    <div class="lpcard-financial-cell">
                                        <span class="field-label">REWARD MATCH</span>
                                        <span class="financial-val">+$500.00</span>
                                        <span class="financial-sub">Settled & disbursed</span>
                                    </div>
                                    <div class="lpcard-financial-cell">
                                        <span class="field-label">POTENTIAL RETURN</span>
                                        <span class="financial-val green">$1,000.00</span>
                                        <span class="financial-sub green">Paid to bank</span>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-outcomes-row">
                                    <div class="outcome-panel success winner">
                                        <div class="outcome-header">
                                            <div class="outcome-icon-circle green">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <span class="outcome-title green">SUCCESS</span>
                                        </div>
                                        <span class="outcome-sub">You received</span>
                                        <span class="outcome-val green">$1,000.00</span>
                                        <span class="outcome-desc">Target achieved</span>
                                    </div>
                                    <div class="outcome-panel failure faded">
                                        <div class="outcome-header">
                                            <div class="outcome-icon-circle red">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </div>
                                            <span class="outcome-title red">FAILURE</span>
                                        </div>
                                        <span class="outcome-sub">You forfeit</span>
                                        <span class="outcome-val red">$500.00</span>
                                        <span class="outcome-desc">If target was not met</span>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-progress-row">
                                    <div class="progress-header">
                                        <span class="progress-label">PROGRESS</span>
                                        <span class="progress-percentage">100% COMPLETED</span>
                                    </div>
                                    <div class="progress-bar-track">
                                        <div class="progress-bar-fill settled" style="width: 100%;"></div>
                                    </div>
                                </div>
                                <div class="lpcard-divider"></div>
                                <div class="lpcard-time-row">
                                    <span class="time-label">TIME REMAINING</span>
                                    <div class="time-display-grid">
                                        <div class="time-box">
                                            <span class="time-num">0</span>
                                            <span class="time-unit">DAYS</span>
                                        </div>
                                        <div class="time-divider"></div>
                                        <div class="time-box">
                                            <span class="time-num">00</span>
                                            <span class="time-unit">HRS</span>
                                        </div>
                                        <div class="time-divider"></div>
                                        <div class="time-box">
                                            <span class="time-num">00</span>
                                            <span class="time-unit">MIN</span>
                                        </div>
                                        <div class="time-divider"></div>
                                        <div class="time-box">
                                            <span class="time-num">00</span>
                                            <span class="time-unit">SEC</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="lpcard-footer">
                                    <svg class="footer-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <span>FUNDS SECURED BY STRIPE</span>
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
                                <span class="lcard-tier tier-allin">All In</span>
                            </div>
                            <div class="lcard-title">Follower Growth</div>
                            <div class="lcard-target">+1,000 Followers</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$500 – $5,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">4x</span></div>
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
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">1.7x</span></div>
                            <div class="lcard-row"><span class="k">Window</span><span class="v">30 days</span></div>
                            <div class="lcard-btn"><button class="lp-cta-btn" data-source="SHOPIFY" data-tier="pledge" data-capital="100">Lock Your First Contract</button></div>
                        </div>
                        <div class="lcard" data-r>
                            <div class="lcard-top">
                                <span class="lcard-src"><img class="lcard-src-logo" src="https://www.vectorlogo.zone/logos/youtube/youtube-icon.svg" alt="YouTube">YouTube</span>
                                <span class="lcard-tier tier-stake">Standard</span>
                            </div>
                            <div class="lcard-title">Subscriber Growth</div>
                            <div class="lcard-target">+500 Subscribers</div>
                            <div class="lcard-row"><span class="k">Deposit</span><span class="v">$250 – $3,000</span></div>
                            <div class="lcard-row"><span class="k">Bonus Yield</span><span class="v">0.7x</span></div>
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

    // Populate live toast notifications with real mock data
    setTimeout(async () => {
        try {
            const response = await window.api.getPublicLedger();
            if (response && response.events && response.events.length > 0) {
                // Populate Live Settlement Activity Table
                const tbody = document.getElementById('lledger-tbody');
                if (tbody) {
                    const ledgerEvents = response.events.filter(e => e.contractId && e.principal);
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
