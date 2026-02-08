// Overview View - Collateral Signature Homepage
// Capital Enforcement Protocol — Not a SaaS landing page

export function renderOverview() {
    return `
        <style>
            /* === COLLATERAL SIGNATURE === */
            .collateral-home {
                background: #FFFFFF;
                color: #1A1A1A;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                position: relative;
            }

            /* Ledger spine - subtle vertical line with tick marks */
            .ledger-spine {
                position: fixed;
                left: 40px;
                top: 80px;
                bottom: 60px;
                width: 1px;
                background: #E8E8E8;
                pointer-events: none;
                z-index: 1;
            }
            .ledger-spine::before {
                content: '';
                position: absolute;
                left: -2px;
                top: 0;
                width: 5px;
                height: 100%;
                background: repeating-linear-gradient(
                    180deg,
                    transparent 0px,
                    transparent 79px,
                    #1A1A1A 79px,
                    #1A1A1A 80px
                );
                opacity: 0.12;
            }

            /* Execution receipt panel */
            .receipt-panel {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                font-family: 'JetBrains Mono', 'SF Mono', monospace;
                font-size: 12px;
                position: relative;
            }
            .receipt-panel::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #8B1818 0%, #6B1212 100%);
            }
            .receipt-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #EEEEEE;
            }
            .receipt-row:last-child { border-bottom: none; }
            .receipt-label { 
                color: #888888;
                font-size: 10px;
                letter-spacing: 0.5px;
            }
            .receipt-value { 
                color: #1A1A1A;
                font-weight: 500;
            }
            .receipt-value.red { color: #8B1818; }

            /* State machine */
            .state-machine {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 0;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
            }
            .state {
                padding: 8px 14px;
                background: #F5F5F5;
                border: 1px solid #E5E5E5;
                color: #6B6B6B;
            }
            .state.current {
                background: #1A1A1A;
                border-color: #1A1A1A;
                color: #FFFFFF;
            }
            .state.terminal-success {
                background: #1A1A1A;
                border-color: #1A1A1A;
                color: #FFFFFF;
            }
            .state.terminal-fail {
                background: #8B1818;
                border-color: #8B1818;
                color: #FFFFFF;
            }
            .state-arrow {
                padding: 0 4px;
                color: #CCCCCC;
                font-size: 14px;
            }
            .state-divider {
                padding: 0 6px;
                color: #CCCCCC;
            }

            /* Clearinghouse ledger */
            .ledger-header {
                display: grid;
                grid-template-columns: 110px 1fr 100px 100px;
                padding: 12px 20px;
                background: #FAFAFA;
                border-bottom: 2px solid #1A1A1A;
                font-size: 10px;
                font-weight: 600;
                color: #888888;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .ledger-entry {
                display: grid;
                grid-template-columns: 110px 1fr 100px 100px;
                padding: 14px 20px;
                border-bottom: 1px solid #F0F0F0;
                font-size: 13px;
                align-items: center;
            }
            .ledger-entry:last-child { border-bottom: none; }
            .ledger-rcpt { 
                font-family: 'JetBrains Mono', monospace; 
                font-size: 12px;
                color: #6B6B6B;
            }
            .ledger-stake { 
                font-weight: 600; 
                color: #1A1A1A;
            }
            .ledger-state {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                color: #6B6B6B;
            }
            .ledger-outcome {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 600;
                text-align: right;
            }
            .outcome-verifying { color: #1A1A1A; }
            .outcome-settled { color: #1A1A1A; }
            .outcome-forfeited { color: #8B1818; }

            /* Protocol stats */
            .protocol-stat {
                text-align: center;
            }
            .protocol-stat-value {
                font-size: 28px;
                font-weight: 700;
                color: #1A1A1A;
                letter-spacing: -0.02em;
                line-height: 1;
            }
            .protocol-stat-label {
                font-size: 12px;
                color: #888888;
                margin-top: 6px;
            }

            /* Primary CTA */
            .cta-execute {
                background: linear-gradient(180deg, #9B2020 0%, #7A1818 100%);
                color: #FFFFFF;
                padding: 16px 40px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.3px;
                border: none;
                cursor: pointer;
                transition: all 0.15s ease;
                box-shadow: 0 2px 8px rgba(139, 24, 24, 0.3);
            }
            .cta-execute:hover {
                background: linear-gradient(180deg, #8B1818 0%, #6B1212 100%);
                box-shadow: 0 4px 16px rgba(139, 24, 24, 0.4);
                transform: translateY(-1px);
            }

            /* Text link */
            .text-link {
                font-size: 13px;
                color: #6B6B6B;
                text-decoration: none;
                transition: color 0.15s ease;
            }
            .text-link:hover { color: #1A1A1A; }

            /* Animations */
            @keyframes fadeUp {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .fade-up { animation: fadeUp 0.5s ease forwards; }
            .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
            .fade-up-2 { animation-delay: 0.2s; opacity: 0; }
            .fade-up-3 { animation-delay: 0.3s; opacity: 0; }

            @media (max-width: 900px) {
                .ledger-spine { display: none; }
                .hero-grid { grid-template-columns: 1fr !important; }
                .ledger-header, .ledger-entry { 
                    grid-template-columns: 100px 1fr 90px; 
                }
                .ledger-state { display: none; }
            }
        </style>

        <div class="collateral-home">
            <div class="ledger-spine"></div>

            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- HERO -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="pt-24 pb-20 md:pt-32 md:pb-28">
                <div class="max-w-5xl mx-auto px-6 md:px-8">
                    <div class="hero-grid grid md:grid-cols-2 gap-12 md:gap-16 items-start">
                        
                        <!-- Left: Copy -->
                        <div class="fade-up">
                            <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] mb-6" 
                                style="line-height: 1.1;">
                                Intentions Fail<br/>Without Stakes.
                            </h1>
                            
                            <p class="text-lg text-[#6B6B6B] mb-4" style="line-height: 1.6;">
                                Lock capital against measurable outcomes. 
                                Hit the target — stake returned. 
                                Miss it — forfeited.
                            </p>
                            
                            <p class="text-sm text-[#888888] mb-10">
                                Miss the target. Capital is forfeited. No appeals.
                            </p>

                            <div class="flex flex-col sm:flex-row items-start gap-4 mb-12">
                                <button onclick="window.app.handleInitiate()" class="cta-execute">
                                    Execute Contract
                                </button>
                                <a href="#" onclick="window.router.navigate('/docs'); return false;" class="text-link py-4">
                                    View Protocol Terms →
                                </a>
                            </div>

                            <!-- Protocol Stats -->
                            <div class="grid grid-cols-3 gap-6 pt-8 border-t border-[#E5E5E5]">
                                <div class="protocol-stat">
                                    <div class="protocol-stat-value">$2.4M</div>
                                    <div class="protocol-stat-label">Capital Locked</div>
                                </div>
                                <div class="protocol-stat">
                                    <div class="protocol-stat-value">2,847</div>
                                    <div class="protocol-stat-label">Contracts Executed</div>
                                </div>
                                <div class="protocol-stat">
                                    <div class="protocol-stat-value">~30%</div>
                                    <div class="protocol-stat-label">Tier 1 Win Rate</div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Execution Receipt -->
                        <div class="receipt-panel p-6 fade-up fade-up-1">
                            <div class="text-[10px] font-semibold tracking-widest text-[#888888] mb-4 uppercase">
                                Execution Receipt
                            </div>
                            
                            <div class="receipt-row">
                                <span class="receipt-label">INSTRUMENT</span>
                                <span class="receipt-value">REVENUE_COMMITMENT</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">BASELINE</span>
                                <span class="receipt-value">$4,221 (30D)</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">TARGET</span>
                                <span class="receipt-value">+18%</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">WINDOW</span>
                                <span class="receipt-value">14 DAYS</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">STAKE</span>
                                <span class="receipt-value red">$500 LOCKED</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">OUTCOME</span>
                                <span class="receipt-value">SETTLED <span class="text-[#CCCCCC]">/</span> <span class="red">FORFEITED</span></span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">RCPT</span>
                                <span class="receipt-value">0184-9F2A</span>
                            </div>

                            <div class="mt-6 pt-4 border-t border-[#E5E5E5]">
                                <div class="text-[9px] text-[#AAAAAA] tracking-wide uppercase">
                                    Settlement: Binary · Verification: API-Only · Appeals: None
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- ENFORCEMENT LIFECYCLE -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-24 bg-[#FAFAFA] border-y border-[#E5E5E5]">
                <div class="max-w-5xl mx-auto px-6 md:px-8">
                    <div class="text-[10px] font-semibold tracking-widest text-[#888888] mb-6 uppercase">
                        Enforcement Lifecycle
                    </div>
                    
                    <div class="state-machine mb-8">
                        <span class="state current">BASELINE_CAPTURED</span>
                        <span class="state-arrow">→</span>
                        <span class="state">CAPITAL_LOCKED</span>
                        <span class="state-arrow">→</span>
                        <span class="state">VERIFYING</span>
                        <span class="state-arrow">→</span>
                        <span class="state terminal-success">SETTLED</span>
                        <span class="state-divider">/</span>
                        <span class="state terminal-fail">FORFEITED</span>
                    </div>

                    <div class="grid md:grid-cols-4 gap-8 text-sm">
                        <div>
                            <div class="font-medium text-[#1A1A1A] mb-1">Baseline Captured</div>
                            <div class="text-[#888888]">Current metrics pulled via OAuth. Immutable once recorded.</div>
                        </div>
                        <div>
                            <div class="font-medium text-[#1A1A1A] mb-1">Capital Locked</div>
                            <div class="text-[#888888]">Stake held in escrow. Non-reversible until settlement.</div>
                        </div>
                        <div>
                            <div class="font-medium text-[#1A1A1A] mb-1">Verifying</div>
                            <div class="text-[#888888]">Window expires. API queried for final state. Zero subjectivity.</div>
                        </div>
                        <div>
                            <div class="font-medium text-[#1A1A1A] mb-1">Settlement</div>
                            <div class="text-[#888888]">Target met = stake returned. Target missed = forfeited.</div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- CLEARINGHOUSE LEDGER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-24">
                <div class="max-w-5xl mx-auto px-6 md:px-8">
                    <div class="flex items-center justify-between mb-6">
                        <div class="text-[10px] font-semibold tracking-widest text-[#888888] uppercase">
                            Recent Executions
                        </div>
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="text-link text-sm">
                            Full Ledger →
                        </a>
                    </div>

                    <div class="border border-[#E5E5E5] overflow-hidden">
                        <div class="ledger-header">
                            <div>RCPT</div>
                            <div>STAKE</div>
                            <div>STATE</div>
                            <div class="text-right">OUTCOME</div>
                        </div>
                        
                        <div class="ledger-entry">
                            <div class="ledger-rcpt">RCPT-0847</div>
                            <div class="ledger-stake">$2,500 LOCKED</div>
                            <div class="ledger-state">VERIFYING</div>
                            <div class="ledger-outcome outcome-verifying">PENDING</div>
                        </div>
                        <div class="ledger-entry">
                            <div class="ledger-rcpt">RCPT-0846</div>
                            <div class="ledger-stake">$1,000 LOCKED</div>
                            <div class="ledger-state">VERIFYING</div>
                            <div class="ledger-outcome outcome-verifying">PENDING</div>
                        </div>
                        <div class="ledger-entry">
                            <div class="ledger-rcpt">RCPT-0845</div>
                            <div class="ledger-stake">$5,000 LOCKED</div>
                            <div class="ledger-state">COMPLETE</div>
                            <div class="ledger-outcome outcome-settled">SETTLED</div>
                        </div>
                        <div class="ledger-entry">
                            <div class="ledger-rcpt">RCPT-0844</div>
                            <div class="ledger-stake">$750 LOCKED</div>
                            <div class="ledger-state">COMPLETE</div>
                            <div class="ledger-outcome outcome-forfeited">FORFEITED</div>
                        </div>
                        <div class="ledger-entry">
                            <div class="ledger-rcpt">RCPT-0843</div>
                            <div class="ledger-stake">$10,000 LOCKED</div>
                            <div class="ledger-state">COMPLETE</div>
                            <div class="ledger-outcome outcome-settled">SETTLED</div>
                        </div>
                    </div>

                    <div class="mt-4 text-xs text-[#AAAAAA]">
                        Binary Settlement — No Appeals
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- VERIFICATION LAYER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-24 bg-[#FAFAFA] border-y border-[#E5E5E5]">
                <div class="max-w-5xl mx-auto px-6 md:px-8">
                    <div class="text-[10px] font-semibold tracking-widest text-[#888888] mb-6 uppercase">
                        Verification Sources
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div class="bg-white border border-[#E5E5E5] p-5">
                            <div class="font-semibold text-[#1A1A1A] mb-1">Stripe</div>
                            <div class="text-sm text-[#888888]">Revenue, MRR, volume</div>
                        </div>
                        <div class="bg-white border border-[#E5E5E5] p-5">
                            <div class="font-semibold text-[#1A1A1A] mb-1">Shopify</div>
                            <div class="text-sm text-[#888888]">Store revenue, orders</div>
                        </div>
                        <div class="bg-white border border-[#E5E5E5] p-5">
                            <div class="font-semibold text-[#1A1A1A] mb-1">X / Twitter</div>
                            <div class="text-sm text-[#888888]">Followers, engagement</div>
                        </div>
                        <div class="bg-white border border-[#E5E5E5] p-5">
                            <div class="font-semibold text-[#1A1A1A] mb-1">GitHub</div>
                            <div class="text-sm text-[#888888]">Commits, contributions</div>
                        </div>
                    </div>

                    <div class="mt-6 text-sm text-[#888888]">
                        All verification via OAuth API response. No manual review. No exceptions.
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- FINAL CTA -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-20 md:py-28">
                <div class="max-w-3xl mx-auto px-6 md:px-8 text-center">
                    <h2 class="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4" style="line-height: 1.2;">
                        Capital Enforces Follow-Through.
                    </h2>
                    <p class="text-[#6B6B6B] mb-10 max-w-lg mx-auto">
                        Create a contract. Lock your stake. Let the numbers decide.
                    </p>
                    <button onclick="window.app.handleInitiate()" class="cta-execute">
                        Execute Contract
                    </button>
                    <p class="text-xs text-[#AAAAAA] mt-6">
                        Minimum stake: $100 · Maximum: $50,000
                    </p>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- FOOTER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <footer class="border-t border-[#E5E5E5] py-10">
                <div class="max-w-5xl mx-auto px-6 md:px-8">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div class="font-semibold text-[#1A1A1A] mb-1">Collateral</div>
                            <div class="text-sm text-[#888888]">Capital-backed commitment enforcement</div>
                        </div>
                        <div class="flex gap-8 text-sm text-[#888888]">
                            <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="hover:text-[#1A1A1A] transition-colors">Ledger</a>
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="hover:text-[#1A1A1A] transition-colors">Terms</a>
                            <a href="#" class="hover:text-[#1A1A1A] transition-colors">Risk</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    `;
}


export function initOverview() {
    console.log('[Overview] Collateral signature homepage initialized');

    if (window.lucide) {
        window.lucide.createIcons();
    }
}
