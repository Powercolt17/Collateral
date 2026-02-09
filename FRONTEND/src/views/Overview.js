// Overview View - Original Institutional Design
// White background, red accents, clean typography

export function renderOverview() {
    return `
        <style>
            /* === INSTITUTIONAL LIGHT === */
            .collateral-home {
                background: #FFFFFF;
                color: #1A1A1A;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* Mechanism step */
            .mechanism-step {
                border: 1px solid #E5E5E5;
                padding: 32px 28px;
                transition: border-color 0.2s ease;
            }
            .mechanism-step:hover {
                border-color: #D0D0D0;
            }
            .mechanism-number {
                font-size: 48px;
                font-weight: 700;
                color: #8B1818;
                letter-spacing: -0.02em;
                margin-bottom: 16px;
                font-family: 'Inter', sans-serif;
            }
            .mechanism-title {
                font-size: 15px;
                font-weight: 600;
                color: #1A1A1A;
                margin-bottom: 8px;
            }
            .mechanism-desc {
                font-size: 13px;
                color: #6B6B6B;
                line-height: 1.5;
            }

            /* Economics card */
            .economics-card {
                border: 1px solid #E5E5E5;
                padding: 28px;
            }
            .economics-card h4 {
                font-size: 16px;
                font-weight: 600;
                color: #1A1A1A;
                margin-bottom: 12px;
            }
            .economics-card p {
                font-size: 13px;
                color: #6B6B6B;
                line-height: 1.6;
                margin-bottom: 12px;
            }
            .economics-card p:last-child {
                margin-bottom: 0;
            }

            /* Risk tiers */
            .risk-tier {
                font-size: 13px;
                margin-bottom: 4px;
            }
            .risk-tier.conservative { color: #166534; }
            .risk-tier.standard { color: #8B1818; }
            .risk-tier.aggressive { color: #8B1818; }

            /* Integration row */
            .integration-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 0;
                border-bottom: 1px solid #F0F0F0;
            }
            .integration-row:last-child { border-bottom: none; }
            .integration-name {
                font-size: 14px;
                font-weight: 500;
                color: #1A1A1A;
            }
            .integration-type {
                font-size: 12px;
                color: #9CA3AF;
            }

            /* Guarantee item */
            .guarantee-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                margin-bottom: 20px;
            }
            .guarantee-item:last-child { margin-bottom: 0; }
            .guarantee-icon {
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
            .guarantee-icon svg {
                width: 12px;
                height: 12px;
                color: #6B6B6B;
            }
            .guarantee-title {
                font-size: 14px;
                font-weight: 600;
                color: #1A1A1A;
                margin-bottom: 4px;
            }
            .guarantee-desc {
                font-size: 13px;
                color: #6B6B6B;
                line-height: 1.5;
            }

            /* CTAs */
            .cta-primary {
                background: #8B1818;
                color: #FFFFFF;
                padding: 14px 28px;
                font-size: 14px;
                font-weight: 600;
                border: none;
                cursor: pointer;
                transition: background 0.15s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .cta-primary:hover {
                background: #6B1212;
            }
            .cta-secondary {
                background: transparent;
                color: #1A1A1A;
                padding: 14px 28px;
                font-size: 14px;
                font-weight: 500;
                border: 1px solid #E5E5E5;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            .cta-secondary:hover {
                border-color: #D0D0D0;
                background: #FAFAFA;
            }

            /* Section label */
            .section-label {
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: #8B1818;
                text-transform: uppercase;
                margin-bottom: 24px;
            }
        </style>

        <div class="collateral-home">
            
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- HERO -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="pt-20 pb-16 md:pt-28 md:pb-24">
                <div class="max-w-[1000px] mx-auto px-6 md:px-8">
                    <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6" style="line-height: 1.1;">
                        <span class="italic">Intentions Fail</span><br/>
                        <span class="text-[#8B1818] italic">Without</span> Stakes.
                    </h1>
                    
                    <p class="text-base md:text-lg text-[#6B6B6B] max-w-xl mb-10" style="line-height: 1.6;">
                        Performance contracts with on-chain enforcement. Capital at stake. 
                        Outcomes verified via platform integrations. Winners paid from forfeited funds.
                    </p>

                    <div class="flex flex-col sm:flex-row gap-4">
                        <button onclick="window.app.handleInitiate()" class="cta-primary">
                            Commit Capital
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <button onclick="window.router.navigate('/docs')" class="cta-secondary">
                            View Documentation
                        </button>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- MECHANISM -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-24">
                <div class="max-w-[1000px] mx-auto px-6 md:px-8">
                    <div class="section-label">MECHANISM</div>
                    
                    <div class="grid md:grid-cols-4 gap-0">
                        <div class="mechanism-step">
                            <div class="mechanism-number">01</div>
                            <div class="mechanism-title">Set Baseline</div>
                            <div class="mechanism-desc">
                                Define measurable target: revenue threshold, commit frequency, post cadence.
                            </div>
                        </div>
                        <div class="mechanism-step">
                            <div class="mechanism-number">02</div>
                            <div class="mechanism-title">Lock Capital</div>
                            <div class="mechanism-desc">
                                Capital deposited into smart contract. Non-reversible until settlement.
                            </div>
                        </div>
                        <div class="mechanism-step">
                            <div class="mechanism-number">03</div>
                            <div class="mechanism-title">Verify Performance</div>
                            <div class="mechanism-desc">
                                Outcome validated via OAuth integration. Zero subjective assessment.
                            </div>
                        </div>
                        <div class="mechanism-step">
                            <div class="mechanism-number">04</div>
                            <div class="mechanism-title">Contract Settles</div>
                            <div class="mechanism-desc">
                                Target met: capital returned + payout. Target missed: forfeiture.
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- RATIONALE -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-24 bg-[#FAFAFA]">
                <div class="max-w-[1000px] mx-auto px-6 md:px-8">
                    <div class="section-label">RATIONALE</div>
                    
                    <div class="max-w-2xl">
                        <p class="text-lg md:text-xl text-[#1A1A1A] mb-6" style="line-height: 1.6;">
                            Commitments without cost are noise. Intentions fade when stakes are zero.
                        </p>
                        <p class="text-lg md:text-xl text-[#1A1A1A] mb-6" style="line-height: 1.6;">
                            Capital enforces follow-through. Markets price risk. Outcomes become inevitable when failure has real consequence.
                        </p>
                        <p class="text-lg md:text-xl text-[#1A1A1A] font-medium" style="line-height: 1.6;">
                            This is not motivation. This is mechanism.
                        </p>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- VERIFICATION LAYER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-24">
                <div class="max-w-[1000px] mx-auto px-6 md:px-8">
                    <div class="section-label">VERIFICATION LAYER</div>
                    
                    <div class="grid md:grid-cols-2 gap-12 md:gap-16">
                        <!-- Platform Integrations -->
                        <div>
                            <h3 class="text-xl font-semibold text-[#1A1A1A] mb-6">Platform Integrations</h3>
                            
                            <div class="integration-row">
                                <span class="integration-name">Stripe</span>
                                <span class="integration-type">Revenue metrics</span>
                            </div>
                            <div class="integration-row">
                                <span class="integration-name">GitHub</span>
                                <span class="integration-type">Commit frequency</span>
                            </div>
                            <div class="integration-row">
                                <span class="integration-name">X (Twitter)</span>
                                <span class="integration-type">Post cadence</span>
                            </div>
                        </div>

                        <!-- Enforcement Guarantees -->
                        <div>
                            <h3 class="text-xl font-semibold text-[#1A1A1A] mb-6">Enforcement Guarantees</h3>
                            
                            <div class="guarantee-item">
                                <div class="guarantee-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <div class="guarantee-title">Objective verification only</div>
                                    <div class="guarantee-desc">No manual review. No subjective judgment. Outcome validated via API response.</div>
                                </div>
                            </div>
                            <div class="guarantee-item">
                                <div class="guarantee-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <div class="guarantee-title">Immutable settlement</div>
                                    <div class="guarantee-desc">Smart contract execution. Once verified, settlement is automatic and final.</div>
                                </div>
                            </div>
                            <div class="guarantee-item">
                                <div class="guarantee-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
            <!-- CONTRACT ECONOMICS -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-24 bg-[#FAFAFA]">
                <div class="max-w-[1000px] mx-auto px-6 md:px-8">
                    <div class="section-label">CONTRACT ECONOMICS</div>
                    
                    <div class="grid md:grid-cols-3 gap-0">
                        <div class="economics-card bg-white">
                            <h4>Contract Terms</h4>
                            <p>Capital is locked per contract. Terms are defined upfront. Payout multiplier is known before execution.</p>
                            <p class="text-[#9CA3AF] text-xs">No post-hoc adjustment. Terms are immutable once executed.</p>
                        </div>
                        <div class="economics-card bg-white">
                            <h4>Outcome Settlement</h4>
                            <p>Binary settlement: success or failure. Success returns capital + predefined multiplier. Failure forfeits capital in full.</p>
                            <p class="text-[#9CA3AF] text-xs">Settlement does not depend on other users' outcomes.</p>
                        </div>
                        <div class="economics-card bg-white">
                            <h4>Risk Model</h4>
                            <p>Risk level determines multiplier. Difficulty and verification scope determine tier.</p>
                            <div class="mt-4 p-3 bg-[#FEF2F2] rounded">
                                <div class="risk-tier conservative">Conservative: 1.2x-1.5x</div>
                                <div class="risk-tier standard">Standard: 1.5x-2.5x</div>
                                <div class="risk-tier aggressive">Aggressive: 2.5x-5.0x</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- FOOTER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <footer class="py-10 border-t border-[#E5E5E5]">
                <div class="max-w-[1000px] mx-auto px-6 md:px-8">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-[#6B6B6B]">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-[#1A1A1A]">COLLATERAL</span>
                            <span class="text-[#E5E5E5]">·</span>
                            <span>Capital-backed commitment protocol</span>
                        </div>
                        <div class="flex gap-6">
                            <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="hover:text-[#1A1A1A] transition-colors">Ledger</a>
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="hover:text-[#1A1A1A] transition-colors">Docs</a>
                            <a href="#" class="hover:text-[#1A1A1A] transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    `;
}


export function initOverview() {
    console.log('[Overview] Homepage initialized');

    if (window.lucide) {
        window.lucide.createIcons();
    }
}
