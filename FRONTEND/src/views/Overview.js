// Overview View - 10/10 Institutional Protocol Homepage
// Surgical upgrades: tighter spacing, receipt artifact, ledger mechanism, branded motifs

export function renderOverview() {
    return `
        <style>
            /* === 10/10 INSTITUTIONAL PROTOCOL === */
            .homepage {
                background: #FFFFFF;
                color: #1A1A1A;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                padding-bottom: 60px;
                position: relative;
            }

            /* Subtle ledger spine motif - left side */
            .homepage::before {
                content: '';
                position: fixed;
                left: 40px;
                top: 80px;
                bottom: 60px;
                width: 1px;
                background: linear-gradient(
                    to bottom,
                    transparent 0%,
                    #E5E5E5 10%,
                    #E5E5E5 90%,
                    transparent 100%
                );
                opacity: 0.6;
                pointer-events: none;
                z-index: 1;
            }
            .homepage::after {
                content: '';
                position: fixed;
                left: 36px;
                top: 120px;
                width: 9px;
                height: 1px;
                background: #8B1818;
                opacity: 0.4;
                pointer-events: none;
                z-index: 1;
            }
            @media (max-width: 1200px) {
                .homepage::before, .homepage::after { display: none; }
            }

            /* Mechanism pipeline steps */
            .mechanism-pipeline {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                position: relative;
            }
            @media (max-width: 768px) {
                .mechanism-pipeline { grid-template-columns: 1fr; }
            }
            .mechanism-step {
                padding: 24px 20px;
                border-left: 1px solid #E5E5E5;
                position: relative;
            }
            .mechanism-step:first-child {
                border-left: none;
            }
            @media (max-width: 768px) {
                .mechanism-step { 
                    border-left: 2px solid #E5E5E5; 
                    border-top: none;
                    margin-left: 12px;
                    padding-left: 24px;
                }
                .mechanism-step:first-child { border-left: 2px solid #E5E5E5; }
            }
            .mechanism-step::before {
                content: '';
                position: absolute;
                left: -5px;
                top: 28px;
                width: 9px;
                height: 9px;
                background: #FFFFFF;
                border: 2px solid #8B1818;
                border-radius: 50%;
            }
            @media (min-width: 769px) {
                .mechanism-step::before { display: none; }
            }
            .step-event {
                font-family: 'JetBrains Mono', 'SF Mono', monospace;
                font-size: 10px;
                color: #9CA3AF;
                letter-spacing: 0.05em;
                margin-bottom: 8px;
            }
            .step-num {
                font-size: 36px;
                font-weight: 700;
                color: #8B1818;
                letter-spacing: -0.03em;
                line-height: 1;
                margin-bottom: 12px;
            }
            .step-title {
                font-size: 13px;
                font-weight: 600;
                color: #1A1A1A;
                margin-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 0.02em;
            }
            .step-desc {
                font-size: 12px;
                color: #6B6B6B;
                line-height: 1.5;
            }

            /* Section header */
            .section-header {
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.12em;
                color: #8B1818;
                text-transform: uppercase;
                margin-bottom: 16px;
            }

            /* Contract Receipt Panel */
            .receipt-panel {
                border: 1px solid #E5E5E5;
                background: #FAFAFA;
                padding: 20px 24px;
                font-family: 'JetBrains Mono', 'SF Mono', monospace;
                position: relative;
            }
            .receipt-header {
                font-size: 9px;
                letter-spacing: 0.1em;
                color: #9CA3AF;
                margin-bottom: 12px;
                padding-bottom: 10px;
                border-bottom: 1px solid #E5E5E5;
            }
            .receipt-baseline {
                margin-bottom: 16px;
            }
            .receipt-baseline-label {
                font-size: 9px;
                color: #6B6B6B;
                letter-spacing: 0.05em;
                margin-bottom: 4px;
            }
            .receipt-baseline-value {
                font-size: 28px;
                font-weight: 600;
                color: #1A1A1A;
                letter-spacing: -0.02em;
                font-family: 'Inter', sans-serif;
            }
            .receipt-baseline-period {
                font-size: 12px;
                color: #9CA3AF;
                margin-left: 4px;
            }
            .receipt-row {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                padding: 6px 0;
                border-bottom: 1px solid #F0F0F0;
            }
            .receipt-row:last-child { border-bottom: none; }
            .receipt-key {
                color: #6B6B6B;
            }
            .receipt-val {
                color: #1A1A1A;
                font-weight: 500;
            }
            .receipt-val.stake { color: #8B1818; }
            .receipt-stamp {
                position: absolute;
                top: 16px;
                right: 16px;
                font-size: 8px;
                letter-spacing: 0.08em;
                color: #D0D0D0;
                border: 1px solid #E5E5E5;
                padding: 3px 6px;
                transform: rotate(2deg);
            }

            /* Integration list */
            .integration-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #F0F0F0;
            }
            .integration-row:last-child { border-bottom: none; }
            .integration-left {
                display: flex;
                flex-direction: column;
            }
            .integration-name {
                font-size: 14px;
                font-weight: 500;
                color: #1A1A1A;
                margin-bottom: 2px;
            }
            .integration-type {
                font-size: 11px;
                color: #9CA3AF;
            }
            .integration-status {
                font-family: 'JetBrains Mono', 'SF Mono', monospace;
                font-size: 9px;
                letter-spacing: 0.08em;
                color: #6B6B6B;
                text-transform: uppercase;
            }

            /* Guarantee check items */
            .guarantee-row {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
            }
            .guarantee-row:last-child { margin-bottom: 0; }
            .guarantee-check {
                width: 18px;
                height: 18px;
                border: 1px solid #E5E5E5;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .guarantee-check svg {
                width: 10px;
                height: 10px;
                stroke: #6B6B6B;
            }
            .guarantee-title {
                font-size: 13px;
                font-weight: 600;
                color: #1A1A1A;
                margin-bottom: 2px;
            }
            .guarantee-desc {
                font-size: 12px;
                color: #6B6B6B;
                line-height: 1.45;
            }

            /* Economics cards */
            .econ-card {
                border: 1px solid #E5E5E5;
                border-left: none;
                padding: 22px;
                background: #FFFFFF;
            }
            .econ-card:first-child { border-left: 1px solid #E5E5E5; }
            @media (max-width: 768px) {
                .econ-card { border-left: 1px solid #E5E5E5; border-top: none; }
                .econ-card:first-child { border-top: 1px solid #E5E5E5; }
            }
            .econ-card h4 {
                font-size: 14px;
                font-weight: 600;
                color: #1A1A1A;
                margin-bottom: 8px;
            }
            .econ-card p {
                font-size: 12px;
                color: #6B6B6B;
                line-height: 1.5;
                margin-bottom: 8px;
            }
            .econ-card .small {
                font-size: 11px;
                color: #9CA3AF;
            }

            /* Risk tiers */
            .risk-box {
                background: #FEF2F2;
                padding: 10px 12px;
                margin-top: 10px;
            }
            .risk-tier {
                font-size: 11px;
                color: #8B1818;
                margin-bottom: 2px;
                font-family: 'JetBrains Mono', 'SF Mono', monospace;
            }
            .risk-tier:last-child { margin-bottom: 0; }

            /* Rationale with ledger anchor */
            .rationale-block {
                position: relative;
                padding-left: 20px;
                border-left: 2px solid #E5E5E5;
            }
            .rationale-stamp {
                font-family: 'JetBrains Mono', 'SF Mono', monospace;
                font-size: 9px;
                letter-spacing: 0.08em;
                color: #9CA3AF;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .rationale-stamp::before {
                content: '';
                width: 6px;
                height: 6px;
                background: #8B1818;
                border-radius: 50%;
                opacity: 0.6;
            }

            /* CTAs */
            .btn-primary {
                background: #8B1818;
                color: #FFFFFF;
                padding: 11px 22px;
                font-size: 13px;
                font-weight: 500;
                border: none;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: background 0.15s;
            }
            .btn-primary:hover { background: #6B1212; }
            .btn-secondary {
                background: transparent;
                color: #1A1A1A;
                padding: 11px 22px;
                font-size: 13px;
                font-weight: 500;
                border: 1px solid #E5E5E5;
                cursor: pointer;
                transition: all 0.15s;
            }
            .btn-secondary:hover {
                border-color: #D0D0D0;
                background: #FAFAFA;
            }
        </style>

        <div class="homepage">
            
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- HERO SECTION (tighter spacing + receipt artifact) -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="pt-14 pb-10">
                <div class="max-w-[900px] mx-auto px-6 md:px-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                        
                        <!-- Left: Headline + CTAs -->
                        <div>
                            <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-4" style="line-height: 1.15;">
                                <span class="italic">Intentions Fail</span><br/>
                                <span class="text-[#8B1818] italic">Without</span><span class="italic"> Stakes.</span>
                            </h1>
                            
                            <p class="text-sm text-[#6B6B6B] max-w-md mb-6" style="line-height: 1.6;">
                                Performance contracts with on-chain enforcement. Capital at stake. Outcomes verified via platform integrations. Winners paid from forfeited funds.
                            </p>

                            <div class="flex flex-wrap gap-3">
                                <button onclick="window.app.handleInitiate()" class="btn-primary">
                                    Commit Capital
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <button onclick="window.router.navigate('/docs')" class="btn-secondary">
                                    View Documentation
                                </button>
                            </div>
                        </div>

                        <!-- Right: Contract Receipt Panel -->
                        <div class="receipt-panel">
                            <div class="receipt-stamp">IMMUTABLE</div>
                            <div class="receipt-header">BASELINE SNAPSHOT — EXECUTION RECORD</div>
                            
                            <div class="receipt-baseline">
                                <div class="receipt-baseline-label">VERIFIED BASELINE</div>
                                <div>
                                    <span class="receipt-baseline-value">$4,221</span>
                                    <span class="receipt-baseline-period">(30D)</span>
                                </div>
                            </div>

                            <div class="receipt-row">
                                <span class="receipt-key">INSTRUMENT</span>
                                <span class="receipt-val">REVENUE_COMMITMENT</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-key">TARGET</span>
                                <span class="receipt-val">+18%</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-key">WINDOW</span>
                                <span class="receipt-val">14 DAYS</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-key">STAKE</span>
                                <span class="receipt-val stake">$500 LOCKED</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-key">OUTCOME</span>
                                <span class="receipt-val">PENDING</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-key">RCPT</span>
                                <span class="receipt-val">0184-9F2A</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- MECHANISM SECTION (pipeline style) -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-10 border-t border-[#F0F0F0]">
                <div class="max-w-[900px] mx-auto px-6 md:px-8">
                    <div class="section-header">MECHANISM</div>
                    
                    <div class="mechanism-pipeline">
                        <div class="mechanism-step">
                            <div class="step-event">EVENT_001</div>
                            <div class="step-num">01</div>
                            <div class="step-title">Baseline Captured</div>
                            <div class="step-desc">Define measurable target: revenue threshold, commit frequency, post cadence.</div>
                        </div>
                        <div class="mechanism-step">
                            <div class="step-event">EVENT_002</div>
                            <div class="step-num">02</div>
                            <div class="step-title">Capital Locked</div>
                            <div class="step-desc">Capital deposited into smart contract. Non-reversible until settlement.</div>
                        </div>
                        <div class="mechanism-step">
                            <div class="step-event">EVENT_003</div>
                            <div class="step-num">03</div>
                            <div class="step-title">Performance Verified</div>
                            <div class="step-desc">Outcome validated via OAuth integration. Zero subjective assessment.</div>
                        </div>
                        <div class="mechanism-step">
                            <div class="step-event">EVENT_004</div>
                            <div class="step-num">04</div>
                            <div class="step-title">Contract Settled</div>
                            <div class="step-desc">Target met: capital returned + payout. Target missed: forfeiture.</div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- RATIONALE SECTION (with ledger anchor) -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-10 bg-[#FAFAFA]">
                <div class="max-w-[900px] mx-auto px-6 md:px-8">
                    <div class="section-header">RATIONALE</div>
                    
                    <div class="rationale-block max-w-lg">
                        <div class="rationale-stamp">EXECUTION LOGIC // REV.01</div>
                        
                        <p class="text-base text-[#1A1A1A] mb-4" style="line-height: 1.55;">
                            Commitments without cost are noise. Intentions fade when stakes are zero.
                        </p>
                        <p class="text-base text-[#1A1A1A] mb-4" style="line-height: 1.55;">
                            Capital enforces follow-through. Markets price risk. Outcomes become inevitable when failure has real consequence.
                        </p>
                        <p class="text-base text-[#1A1A1A] font-medium" style="line-height: 1.55;">
                            This is not motivation. This is mechanism.
                        </p>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- VERIFICATION LAYER SECTION -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-10">
                <div class="max-w-[900px] mx-auto px-6 md:px-8">
                    <div class="section-header">VERIFICATION LAYER</div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                        
                        <!-- Platform Integrations -->
                        <div>
                            <h3 class="text-base font-semibold text-[#1A1A1A] mb-3">Platform Integrations</h3>
                            
                            <div class="integration-row">
                                <div class="integration-left">
                                    <span class="integration-name">Stripe</span>
                                    <span class="integration-type">Revenue Metrics</span>
                                </div>
                                <span class="integration-status">VERIFIED</span>
                            </div>
                            <div class="integration-row">
                                <div class="integration-left">
                                    <span class="integration-name">GitHub</span>
                                    <span class="integration-type">Commit Frequency</span>
                                </div>
                                <span class="integration-status">BOUND</span>
                            </div>
                            <div class="integration-row">
                                <div class="integration-left">
                                    <span class="integration-name">X (Twitter)</span>
                                    <span class="integration-type">Post Cadence</span>
                                </div>
                                <span class="integration-status">CONNECTED</span>
                            </div>
                        </div>

                        <!-- Enforcement Guarantees -->
                        <div>
                            <h3 class="text-base font-semibold text-[#1A1A1A] mb-3">Enforcement Guarantees</h3>
                            
                            <div class="guarantee-row">
                                <div class="guarantee-check">
                                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <div class="guarantee-title">Objective verification only</div>
                                    <div class="guarantee-desc">No manual review. No subjective judgment. Outcome validated via API response.</div>
                                </div>
                            </div>
                            
                            <div class="guarantee-row">
                                <div class="guarantee-check">
                                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <div class="guarantee-title">Immutable settlement</div>
                                    <div class="guarantee-desc">Smart contract execution. Once verified, settlement is automatic and final.</div>
                                </div>
                            </div>
                            
                            <div class="guarantee-row">
                                <div class="guarantee-check">
                                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <div class="guarantee-title">Zero social layer</div>
                                    <div class="guarantee-desc">No feeds, likes, or comments. Performance data only. Capital speaks.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- CONTRACT ECONOMICS SECTION -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-10 bg-[#FAFAFA]">
                <div class="max-w-[900px] mx-auto px-6 md:px-8">
                    <div class="section-header">CONTRACT ECONOMICS</div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3">
                        
                        <div class="econ-card">
                            <h4>Contract Terms</h4>
                            <p>Capital is locked per contract. Terms are defined upfront. Payout multiplier is known before execution.</p>
                            <p class="small">No post-hoc adjustment. Terms are immutable once executed.</p>
                        </div>
                        
                        <div class="econ-card">
                            <h4>Outcome Settlement</h4>
                            <p>Binary settlement: success or failure. Success returns capital + predefined multiplier. Failure forfeits capital in full.</p>
                            <p class="small">Settlement does not depend on other users' outcomes.</p>
                        </div>
                        
                        <div class="econ-card">
                            <h4>Risk Model</h4>
                            <p>Risk level determines multiplier. Difficulty and verification scope determine tier.</p>
                            <div class="risk-box">
                                <div class="risk-tier">CONSERVATIVE: 1.2x-1.5x</div>
                                <div class="risk-tier">STANDARD: 1.5x-2.5x</div>
                                <div class="risk-tier">AGGRESSIVE: 2.5x-5.0x</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    `;
}


export function initOverview() {
    console.log('[Overview] 10/10 Institutional homepage initialized');
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
