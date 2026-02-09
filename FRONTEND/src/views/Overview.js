// Overview View - EXACT copy from screenshots
// DO NOT MODIFY - pixel-perfect replica

export function renderOverview() {
    return `
        <style>
            /* === EXACT SCREENSHOT STYLES === */
            .homepage {
                background: #FFFFFF;
                color: #1A1A1A;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                padding-bottom: 60px;
            }

            /* Mechanism numbered boxes */
            .mechanism-box {
                border: 1px solid #E5E5E5;
                padding: 28px 24px;
            }
            .mechanism-box:hover {
                border-color: #D0D0D0;
            }
            .mechanism-num {
                font-size: 42px;
                font-weight: 700;
                color: #8B1818;
                letter-spacing: -0.03em;
                line-height: 1;
                margin-bottom: 16px;
            }
            .mechanism-title {
                font-size: 14px;
                font-weight: 600;
                color: #1A1A1A;
                margin-bottom: 8px;
            }
            .mechanism-text {
                font-size: 13px;
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
                margin-bottom: 20px;
            }

            /* Integration list */
            .integration-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 0;
                border-bottom: 1px solid #F0F0F0;
            }
            .integration-item:last-child {
                border-bottom: none;
            }
            .integration-name {
                font-size: 14px;
                font-weight: 500;
                color: #1A1A1A;
            }
            .integration-type {
                font-size: 12px;
                color: #9CA3AF;
                font-style: italic;
            }

            /* Guarantee check items */
            .guarantee-row {
                display: flex;
                gap: 12px;
                margin-bottom: 18px;
            }
            .guarantee-row:last-child {
                margin-bottom: 0;
            }
            .guarantee-check {
                width: 20px;
                height: 20px;
                border: 1px solid #E5E5E5;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .guarantee-check svg {
                width: 11px;
                height: 11px;
                stroke: #6B6B6B;
            }
            .guarantee-title {
                font-size: 14px;
                font-weight: 600;
                color: #1A1A1A;
                margin-bottom: 3px;
            }
            .guarantee-desc {
                font-size: 13px;
                color: #6B6B6B;
                line-height: 1.5;
            }

            /* Economics cards */
            .econ-card {
                border: 1px solid #E5E5E5;
                padding: 24px;
                background: #FFFFFF;
            }
            .econ-card h4 {
                font-size: 15px;
                font-weight: 600;
                color: #1A1A1A;
                margin-bottom: 10px;
            }
            .econ-card p {
                font-size: 13px;
                color: #6B6B6B;
                line-height: 1.55;
                margin-bottom: 10px;
            }
            .econ-card .small {
                font-size: 12px;
                color: #9CA3AF;
            }

            /* Risk tiers box */
            .risk-box {
                background: #FEF2F2;
                padding: 12px 14px;
                margin-top: 12px;
            }
            .risk-tier {
                font-size: 12px;
                color: #8B1818;
                margin-bottom: 2px;
            }
            .risk-tier:last-child {
                margin-bottom: 0;
            }

            /* CTAs */
            .btn-primary {
                background: #8B1818;
                color: #FFFFFF;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 500;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: background 0.15s;
            }
            .btn-primary:hover {
                background: #6B1212;
            }
            .btn-secondary {
                background: transparent;
                color: #1A1A1A;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 500;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
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
            <!-- HERO SECTION -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="pt-20 pb-14">
                <div class="max-w-[900px] mx-auto px-6 md:px-8">
                    
                    <!-- Headline -->
                    <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-5" style="line-height: 1.15;">
                        <span class="italic">Intentions Fail</span><br/>
                        <span class="text-[#8B1818] italic">Without</span><span class="italic"> Stakes.</span>
                    </h1>
                    
                    <!-- Subtext -->
                    <p class="text-base text-[#6B6B6B] max-w-lg mb-8" style="line-height: 1.6;">
                        Performance contracts with on-chain enforcement. Capital at stake. Outcomes verified via platform integrations. Winners paid from forfeited funds.
                    </p>

                    <!-- CTAs -->
                    <div class="flex flex-wrap gap-3">
                        <button onclick="window.app.handleInitiate()" class="btn-primary">
                            Commit Capital
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <button onclick="window.router.navigate('/docs')" class="btn-secondary">
                            View Documentation
                        </button>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- MECHANISM SECTION -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-14">
                <div class="max-w-[900px] mx-auto px-6 md:px-8">
                    <div class="section-header">MECHANISM</div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-0">
                        <div class="mechanism-box">
                            <div class="mechanism-num">01</div>
                            <div class="mechanism-title">Set Baseline</div>
                            <div class="mechanism-text">Define measurable target: revenue threshold, commit frequency, post cadence.</div>
                        </div>
                        <div class="mechanism-box">
                            <div class="mechanism-num">02</div>
                            <div class="mechanism-title">Lock Capital</div>
                            <div class="mechanism-text">Capital deposited into smart contract. Non-reversible until settlement.</div>
                        </div>
                        <div class="mechanism-box">
                            <div class="mechanism-num">03</div>
                            <div class="mechanism-title">Verify Performance</div>
                            <div class="mechanism-text">Outcome validated via OAuth integration. Zero subjective assessment.</div>
                        </div>
                        <div class="mechanism-box">
                            <div class="mechanism-num">04</div>
                            <div class="mechanism-title">Contract Settles</div>
                            <div class="mechanism-text">Target met: capital returned + payout. Target missed: forfeiture.</div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- RATIONALE SECTION -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-14 bg-[#FAFAFA]">
                <div class="max-w-[900px] mx-auto px-6 md:px-8">
                    <div class="section-header">RATIONALE</div>
                    
                    <div class="max-w-xl">
                        <p class="text-lg text-[#1A1A1A] mb-5" style="line-height: 1.55;">
                            Commitments without cost are noise. Intentions fade when stakes are zero.
                        </p>
                        <p class="text-lg text-[#1A1A1A] mb-5" style="line-height: 1.55;">
                            Capital enforces follow-through. Markets price risk. Outcomes become inevitable when failure has real consequence.
                        </p>
                        <p class="text-lg text-[#1A1A1A] font-medium" style="line-height: 1.55;">
                            This is not motivation. This is mechanism.
                        </p>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- VERIFICATION LAYER SECTION -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-14">
                <div class="max-w-[900px] mx-auto px-6 md:px-8">
                    <div class="section-header">VERIFICATION LAYER</div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                        
                        <!-- Platform Integrations -->
                        <div>
                            <h3 class="text-lg font-semibold text-[#1A1A1A] mb-4">Platform Integrations</h3>
                            
                            <div class="integration-item">
                                <span class="integration-name">Stripe</span>
                                <span class="integration-type">Revenue metrics</span>
                            </div>
                            <div class="integration-item">
                                <span class="integration-name">GitHub</span>
                                <span class="integration-type">Commit frequency</span>
                            </div>
                            <div class="integration-item">
                                <span class="integration-name">X (Twitter)</span>
                                <span class="integration-type">Post cadence</span>
                            </div>
                        </div>

                        <!-- Enforcement Guarantees -->
                        <div>
                            <h3 class="text-lg font-semibold text-[#1A1A1A] mb-4">Enforcement Guarantees</h3>
                            
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
            <section class="py-14 bg-[#FAFAFA]">
                <div class="max-w-[900px] mx-auto px-6 md:px-8">
                    <div class="section-header">CONTRACT ECONOMICS</div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-0">
                        
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
                                <div class="risk-tier">Conservative: 1.2x-1.5x</div>
                                <div class="risk-tier">Standard: 1.5x-2.5x</div>
                                <div class="risk-tier">Aggressive: 2.5x-5.0x</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    `;
}


export function initOverview() {
    console.log('[Overview] Homepage initialized');
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
