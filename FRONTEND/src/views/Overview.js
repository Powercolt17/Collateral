// Overview View - Capital Enforcement Instrument
// NOT a landing page. An execution terminal.

export function renderOverview() {
    return `
        <style>
            /* === EXECUTION TERMINAL === */
            .execution-terminal {
                background: #FFFFFF;
                color: #0A0A0A;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* Ledger spine - vertical tick marks */
            .ledger-spine {
                position: fixed;
                left: 32px;
                top: 80px;
                bottom: 40px;
                width: 1px;
                background: #E5E5E5;
                pointer-events: none;
                z-index: 1;
            }
            .ledger-spine::before {
                content: '';
                position: absolute;
                left: -1px;
                top: 0;
                width: 3px;
                height: 100%;
                background: repeating-linear-gradient(
                    180deg,
                    transparent 0px,
                    transparent 48px,
                    #0A0A0A 48px,
                    #0A0A0A 49px
                );
                opacity: 0.08;
            }

            /* Contract field rows */
            .field-row {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                padding: 10px 0;
                border-bottom: 1px solid #E5E5E5;
            }
            .field-row:last-child { border-bottom: none; }
            .field-label { 
                font-size: 11px;
                font-weight: 500;
                color: #6B6B6B;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .field-value { 
                font-size: 13px;
                font-weight: 600;
                color: #0A0A0A;
            }
            .field-value.mono {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
            }
            .field-value.red { color: #8B1818; }

            /* State machine */
            .state-machine {
                display: flex;
                align-items: center;
                gap: 4px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                color: #0A0A0A;
            }
            .state-machine .arrow {
                color: #CCCCCC;
            }
            .state-machine .state {
                padding: 4px 8px;
                background: #F5F5F5;
                border: 1px solid #E5E5E5;
            }
            .state-machine .state.active {
                background: #0A0A0A;
                color: #FFFFFF;
                border-color: #0A0A0A;
            }
            .state-machine .state.forfeited {
                background: #8B1818;
                color: #FFFFFF;
                border-color: #8B1818;
            }

            /* Ledger table */
            .ledger-table {
                width: 100%;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                border-collapse: collapse;
            }
            .ledger-table th {
                text-align: left;
                font-size: 10px;
                font-weight: 500;
                color: #6B6B6B;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 8px 0;
                border-bottom: 2px solid #0A0A0A;
            }
            .ledger-table td {
                padding: 12px 0;
                border-bottom: 1px solid #E5E5E5;
                color: #0A0A0A;
            }
            .ledger-table .status {
                font-weight: 600;
            }
            .ledger-table .status.verifying { color: #0A0A0A; }
            .ledger-table .status.settled { color: #0A0A0A; }
            .ledger-table .status.forfeited { color: #8B1818; }

            /* Execute button */
            .btn-execute {
                background: #8B1818;
                color: #FFFFFF;
                padding: 14px 32px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
                border: none;
                cursor: pointer;
                transition: background 150ms ease;
            }
            .btn-execute:hover {
                background: #6B1212;
            }

            /* Text link */
            .text-link {
                font-size: 12px;
                color: #6B6B6B;
                text-decoration: none;
                transition: color 150ms ease;
            }
            .text-link:hover {
                color: #0A0A0A;
            }

            /* Section divider */
            .section-divider {
                height: 1px;
                background: #0A0A0A;
                margin: 48px 0;
            }

            /* Minimal animations */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .fade-in {
                animation: fadeIn 400ms ease forwards;
            }

            @media (max-width: 768px) {
                .ledger-spine { display: none; }
                .state-machine { flex-wrap: wrap; }
            }
        </style>

        <div class="execution-terminal">
            <div class="ledger-spine"></div>

            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- EXECUTION HEADER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-20 border-b border-[#E5E5E5]">
                <div class="max-w-3xl mx-auto px-6 md:px-8">
                    
                    <!-- System Status -->
                    <div class="mb-12 fade-in">
                        <div class="inline-block px-3 py-1.5 border border-[#0A0A0A] mb-8">
                            <span class="text-[10px] font-semibold tracking-widest text-[#0A0A0A]">
                                EXECUTION STATUS: READY
                            </span>
                        </div>

                        <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-[#0A0A0A] mb-4" 
                            style="font-family: 'IBM Plex Sans', 'Inter', sans-serif; line-height: 1.1;">
                            Intentions Fail<br/>Without Stakes.
                        </h1>
                    </div>

                    <!-- Contract Terms -->
                    <div class="border border-[#E5E5E5] p-6 mb-8 fade-in" style="animation-delay: 100ms;">
                        <div class="field-row">
                            <span class="field-label">Instrument</span>
                            <span class="field-value mono">REVENUE_COMMITMENT</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Baseline Snapshot</span>
                            <span class="field-value">$4,221 (30D)</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Target Delta</span>
                            <span class="field-value red">+18%</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Window</span>
                            <span class="field-value">14 DAYS</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Settlement</span>
                            <span class="field-value">BINARY</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Stake</span>
                            <span class="field-value red">$500 LOCKED</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Failure</span>
                            <span class="field-value red">FORFEITURE</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Verification</span>
                            <span class="field-value mono">API-ONLY</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Receipt ID</span>
                            <span class="field-value mono">RCPT_0184_9F2A</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-6 fade-in" style="animation-delay: 200ms;">
                        <button onclick="window.app.handleInitiate()" class="btn-execute">
                            EXECUTE CONTRACT
                        </button>
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="text-link">
                            View Ledger Record →
                        </a>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- ENFORCEMENT LIFECYCLE -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-12 md:py-16 border-b border-[#E5E5E5]">
                <div class="max-w-3xl mx-auto px-6 md:px-8">
                    <div class="text-[10px] font-semibold tracking-widest text-[#6B6B6B] mb-6 uppercase">
                        Enforcement Lifecycle
                    </div>
                    
                    <div class="state-machine">
                        <span class="state active">BASELINE_CAPTURED</span>
                        <span class="arrow">→</span>
                        <span class="state">CAPITAL_LOCKED</span>
                        <span class="arrow">→</span>
                        <span class="state">VERIFYING</span>
                        <span class="arrow">→</span>
                        <span class="state">SETTLED</span>
                        <span class="text-[#CCCCCC] mx-1">/</span>
                        <span class="state forfeited">FORFEITED</span>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- CONTRACT SPECIFICATIONS -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-12 md:py-16 border-b border-[#E5E5E5]">
                <div class="max-w-3xl mx-auto px-6 md:px-8">
                    <div class="text-[10px] font-semibold tracking-widest text-[#6B6B6B] mb-6 uppercase">
                        Contract Terms
                    </div>
                    
                    <table class="w-full text-sm border-collapse">
                        <tbody>
                            <tr class="border-b border-[#E5E5E5]">
                                <td class="py-3 text-[#6B6B6B] w-1/3">Baseline</td>
                                <td class="py-3 text-[#0A0A0A] font-medium">Captured at execution. Immutable.</td>
                            </tr>
                            <tr class="border-b border-[#E5E5E5]">
                                <td class="py-3 text-[#6B6B6B]">Capital</td>
                                <td class="py-3 text-[#0A0A0A] font-medium">Locked until settlement. Non-reversible.</td>
                            </tr>
                            <tr class="border-b border-[#E5E5E5]">
                                <td class="py-3 text-[#6B6B6B]">Verification</td>
                                <td class="py-3 text-[#0A0A0A] font-medium">API response only. Zero subjective layer.</td>
                            </tr>
                            <tr class="border-b border-[#E5E5E5]">
                                <td class="py-3 text-[#6B6B6B]">Settlement</td>
                                <td class="py-3 text-[#0A0A0A] font-medium">Automatic. Receipt-grade finality.</td>
                            </tr>
                            <tr>
                                <td class="py-3 text-[#6B6B6B]">Outcome</td>
                                <td class="py-3 font-medium"><span class="text-[#0A0A0A]">Paid</span> <span class="text-[#CCCCCC]">or</span> <span class="text-[#8B1818]">Forfeited</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- CLEARING LEDGER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-12 md:py-16 border-b border-[#E5E5E5]">
                <div class="max-w-3xl mx-auto px-6 md:px-8">
                    <div class="text-[10px] font-semibold tracking-widest text-[#6B6B6B] mb-6 uppercase">
                        Recent Executions
                    </div>
                    
                    <table class="ledger-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Stake</th>
                                <th class="text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#0187</td>
                                <td>$1,200 LOCKED</td>
                                <td class="text-right status verifying">VERIFYING</td>
                            </tr>
                            <tr>
                                <td>#0186</td>
                                <td>$500 LOCKED</td>
                                <td class="text-right status verifying">VERIFYING</td>
                            </tr>
                            <tr>
                                <td>#0185</td>
                                <td>$1,000 LOCKED</td>
                                <td class="text-right status settled">SETTLED</td>
                            </tr>
                            <tr>
                                <td>#0184</td>
                                <td>$750 LOCKED</td>
                                <td class="text-right status forfeited">FORFEITED</td>
                            </tr>
                            <tr>
                                <td>#0183</td>
                                <td>$2,000 LOCKED</td>
                                <td class="text-right status settled">SETTLED</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="mt-6 text-right">
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="text-link">
                            View Full Ledger →
                        </a>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- VERIFICATION SOURCES -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-12 md:py-16 border-b border-[#E5E5E5]">
                <div class="max-w-3xl mx-auto px-6 md:px-8">
                    <div class="text-[10px] font-semibold tracking-widest text-[#6B6B6B] mb-6 uppercase">
                        Verification Layer
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                        <div>
                            <div class="font-medium text-[#0A0A0A] mb-1">Stripe</div>
                            <div class="text-[#6B6B6B]">Revenue, MRR</div>
                        </div>
                        <div>
                            <div class="font-medium text-[#0A0A0A] mb-1">Shopify</div>
                            <div class="text-[#6B6B6B]">Store revenue</div>
                        </div>
                        <div>
                            <div class="font-medium text-[#0A0A0A] mb-1">X</div>
                            <div class="text-[#6B6B6B]">Engagement</div>
                        </div>
                        <div>
                            <div class="font-medium text-[#0A0A0A] mb-1">GitHub</div>
                            <div class="text-[#6B6B6B]">Commits</div>
                        </div>
                    </div>

                    <div class="mt-6 text-xs text-[#6B6B6B]">
                        All verification via OAuth API. No manual review. No appeals.
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- EXECUTE -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-20">
                <div class="max-w-3xl mx-auto px-6 md:px-8">
                    <div class="border-t-2 border-[#0A0A0A] pt-8">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <div class="text-lg font-semibold text-[#0A0A0A] mb-1">
                                    Capital at risk.
                                </div>
                                <div class="text-sm text-[#6B6B6B]">
                                    Execution is irreversible. Settlement is final.
                                </div>
                            </div>
                            <button onclick="window.app.handleInitiate()" class="btn-execute">
                                EXECUTE CONTRACT
                            </button>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- FOOTER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <footer class="border-t border-[#E5E5E5] py-8">
                <div class="max-w-3xl mx-auto px-6 md:px-8">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-[#6B6B6B]">
                        <div>
                            <span class="font-medium text-[#0A0A0A]">Collateral</span>
                            <span class="mx-2">·</span>
                            <span>Enforcement Protocol</span>
                        </div>
                        <div class="flex gap-6">
                            <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="hover:text-[#0A0A0A] transition-colors">Ledger</a>
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="hover:text-[#0A0A0A] transition-colors">Terms</a>
                            <a href="#" class="hover:text-[#0A0A0A] transition-colors">Risk</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    `;
}


export function initOverview() {
    console.log('[Overview] Execution terminal initialized');

    // Initialize Lucide icons if present
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
