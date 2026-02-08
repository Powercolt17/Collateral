// Overview View - Collateral Enforcement Protocol
// Stripe/BlackRock institutional aesthetic - Premium finance documentation

export function renderOverview() {
    return `
        <style>
            /* === INSTITUTIONAL ENFORCEMENT PROTOCOL === */
            :root {
                --inst-bg: #F8F7F5;
                --inst-surface: #FFFFFF;
                --inst-panel: #FAF9F8;
                --inst-border: #E8E6E3;
                --inst-border-subtle: #EFEDE9;
                --inst-text: #1A1A1A;
                --inst-text-secondary: #6B6B6B;
                --inst-text-muted: #9CA3AF;
                --inst-red: #8B1818;
                --inst-red-light: #FEF2F2;
                --inst-green: #166534;
                --inst-green-light: #F0FDF4;
            }

            .institutional-protocol {
                background: var(--inst-bg);
                color: var(--inst-text);
                min-height: 100vh;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* Subtle ledger spine - institutional motif */
            .ledger-spine {
                position: fixed;
                left: 48px;
                top: 0;
                bottom: 0;
                width: 1px;
                background: linear-gradient(
                    180deg,
                    transparent 0%,
                    var(--inst-border) 10%,
                    var(--inst-border) 90%,
                    transparent 100%
                );
                pointer-events: none;
                z-index: 1;
            }
            .ledger-spine::before {
                content: '';
                position: absolute;
                left: -2px;
                top: 20%;
                width: 5px;
                height: 60%;
                background: repeating-linear-gradient(
                    180deg,
                    transparent,
                    transparent 40px,
                    var(--inst-red) 40px,
                    var(--inst-red) 41px
                );
                opacity: 0.15;
            }

            /* Saturn ring watermark - subtle institutional */
            .saturn-watermark-light {
                position: fixed;
                top: 50%;
                right: -300px;
                width: 800px;
                height: 800px;
                transform: translateY(-50%);
                pointer-events: none;
                z-index: 0;
                opacity: 0.04;
            }
            .saturn-watermark-light::before {
                content: '';
                position: absolute;
                inset: 0;
                border: 2px solid var(--inst-red);
                border-radius: 50%;
            }
            .saturn-watermark-light::after {
                content: '';
                position: absolute;
                top: 50%;
                left: -20%;
                right: -20%;
                height: 4px;
                background: linear-gradient(90deg, transparent, var(--inst-red), transparent);
                transform: rotate(-12deg);
            }

            /* Document panel styling */
            .doc-panel {
                background: var(--inst-surface);
                border: 1px solid var(--inst-border);
                box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            }

            /* Receipt/table row styling */
            .ledger-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 0;
                border-bottom: 1px solid var(--inst-border-subtle);
            }
            .ledger-row:last-child { border-bottom: none; }
            .ledger-label { 
                color: var(--inst-text-secondary); 
                font-size: 13px; 
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .ledger-value { 
                color: var(--inst-text); 
                font-size: 14px; 
                font-weight: 600; 
            }
            .ledger-value.accent { color: var(--inst-red); }
            .ledger-value.success { color: var(--inst-green); }
            .ledger-value code {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                background: var(--inst-panel);
                padding: 2px 6px;
                border-radius: 3px;
            }

            /* Section header - document filing style */
            .section-header {
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                color: var(--inst-text-secondary);
                padding-bottom: 12px;
                border-bottom: 2px solid var(--inst-text);
                margin-bottom: 24px;
                display: inline-block;
            }

            /* CTA buttons - institutional */
            .cta-primary {
                background: var(--inst-red);
                color: white;
                padding: 14px 32px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.3px;
                border: none;
                cursor: pointer;
                transition: all 150ms ease;
            }
            .cta-primary:hover {
                background: #6B1212;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(139, 24, 24, 0.2);
            }

            .cta-secondary {
                background: transparent;
                color: var(--inst-text);
                padding: 14px 32px;
                font-size: 13px;
                font-weight: 500;
                border: 1px solid var(--inst-border);
                cursor: pointer;
                transition: all 150ms ease;
            }
            .cta-secondary:hover {
                border-color: var(--inst-text);
                background: var(--inst-panel);
            }

            /* Verification stamp motif */
            .verification-stamp {
                position: relative;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 6px 12px;
                border: 2px solid var(--inst-green);
                color: var(--inst-green);
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                transform: rotate(-2deg);
            }
            .verification-stamp::before {
                content: '✓';
                font-size: 14px;
            }

            /* Execution table - settlement record style */
            .execution-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            .execution-table thead {
                background: var(--inst-panel);
                border-bottom: 2px solid var(--inst-border);
            }
            .execution-table th {
                padding: 12px 16px;
                text-align: left;
                font-weight: 600;
                color: var(--inst-text-secondary);
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .execution-table td {
                padding: 14px 16px;
                border-bottom: 1px solid var(--inst-border-subtle);
                color: var(--inst-text);
            }
            .execution-table tbody tr:hover {
                background: var(--inst-panel);
            }

            /* Status badges */
            .status-settled {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                background: var(--inst-green-light);
                color: var(--inst-green);
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            .status-settled::before {
                content: '';
                width: 6px;
                height: 6px;
                background: var(--inst-green);
                border-radius: 50%;
            }
            .status-active {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                background: #FEF3C7;
                color: #92400E;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            .status-active::before {
                content: '';
                width: 6px;
                height: 6px;
                background: #F59E0B;
                border-radius: 50%;
            }
            .status-forfeited {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                background: var(--inst-red-light);
                color: var(--inst-red);
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            /* Animations - subtle and professional */
            @keyframes fadeUp {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-in {
                animation: fadeUp 500ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
            }
            .delay-1 { animation-delay: 100ms; opacity: 0; }
            .delay-2 { animation-delay: 200ms; opacity: 0; }
            .delay-3 { animation-delay: 300ms; opacity: 0; }

            @media (prefers-reduced-motion: reduce) {
                .animate-in { animation: none !important; opacity: 1 !important; }
            }

            @media (max-width: 768px) {
                .ledger-spine { display: none; }
            }
        </style>

        <div class="institutional-protocol">
            <div class="ledger-spine"></div>
            <div class="saturn-watermark-light"></div>

            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- HERO - INSTITUTIONAL PROTOCOL STATEMENT -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-20 md:py-28 relative z-10">
                <div class="max-w-6xl mx-auto px-6 md:px-12">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        
                        <!-- LEFT: Protocol Statement -->
                        <div class="animate-in">
                            <div class="section-header mb-8">Enforcement Protocol</div>
                            
                            <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight" 
                                style="color: #1A1A1A;">
                                Commitments<br/>
                                <span style="color: #8B1818;">Require</span> Capital.
                            </h1>
                            
                            <p class="text-lg text-[#6B6B6B] leading-relaxed mb-10 max-w-md">
                                Performance contracts backed by locked capital. 
                                Baselines captured at execution. Settlement is automatic and final.
                            </p>
                            
                            <div class="flex flex-wrap gap-4 mb-10">
                                <button onclick="window.app.handleInitiate()" class="cta-primary">
                                    Execute Contract
                                </button>
                                <button onclick="window.router.navigate('/docs'); return false;" class="cta-secondary">
                                    View Documentation
                                </button>
                            </div>

                            <div class="verification-stamp">
                                Regulated Settlement Protocol
                            </div>
                        </div>

                        <!-- RIGHT: Baseline Snapshot Panel -->
                        <div class="animate-in delay-2">
                            <div class="doc-panel p-8">
                                <div class="flex items-center justify-between mb-6 pb-4 border-b border-[#E8E6E3]">
                                    <span class="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Baseline Snapshot</span>
                                    <span class="text-xs text-[#166534] font-medium">Immutable at execution</span>
                                </div>
                                
                                <div class="mb-6">
                                    <div class="text-3xl font-bold text-[#1A1A1A] mb-1">$4,221</div>
                                    <div class="text-sm text-[#6B6B6B]">30-Day Revenue Baseline</div>
                                </div>

                                <div class="space-y-0">
                                    <div class="ledger-row">
                                        <span class="ledger-label">Contract</span>
                                        <span class="ledger-value">Revenue Commitment</span>
                                    </div>
                                    <div class="ledger-row">
                                        <span class="ledger-label">Target</span>
                                        <span class="ledger-value accent">+18% Growth</span>
                                    </div>
                                    <div class="ledger-row">
                                        <span class="ledger-label">Window</span>
                                        <span class="ledger-value">14 Days</span>
                                    </div>
                                    <div class="ledger-row">
                                        <span class="ledger-label">Stake</span>
                                        <span class="ledger-value accent">$500.00 Locked</span>
                                    </div>
                                    <div class="ledger-row">
                                        <span class="ledger-label">Settlement</span>
                                        <span class="ledger-value success">$800.00 Return</span>
                                    </div>
                                </div>
                                
                                <div class="mt-6 pt-4 border-t border-[#E8E6E3]">
                                    <div class="text-xs text-[#9CA3AF]">
                                        This record cannot be altered after execution.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- ENFORCEMENT PIPELINE - DOCUMENT LAYOUT -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-20 bg-white border-y border-[#E8E6E3] relative z-10">
                <div class="max-w-6xl mx-auto px-6 md:px-12">
                    <div class="section-header mb-12">Settlement Process</div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <!-- Step 1 -->
                        <div class="animate-in delay-1">
                            <div class="text-sm font-bold text-[#8B1818] mb-3">01</div>
                            <div class="text-lg font-semibold text-[#1A1A1A] mb-2">
                                Baseline Captured
                            </div>
                            <div class="text-sm text-[#6B6B6B] leading-relaxed">
                                Current metrics recorded at contract execution. Immutable reference point.
                            </div>
                        </div>

                        <!-- Step 2 -->
                        <div class="animate-in delay-2">
                            <div class="text-sm font-bold text-[#8B1818] mb-3">02</div>
                            <div class="text-lg font-semibold text-[#1A1A1A] mb-2">
                                Capital Locked
                            </div>
                            <div class="text-sm text-[#6B6B6B] leading-relaxed">
                                Stake held in escrow. Non-reversible until settlement window closes.
                            </div>
                        </div>

                        <!-- Step 3 -->
                        <div class="animate-in delay-3">
                            <div class="text-sm font-bold text-[#8B1818] mb-3">03</div>
                            <div class="text-lg font-semibold text-[#1A1A1A] mb-2">
                                Verification
                            </div>
                            <div class="text-sm text-[#6B6B6B] leading-relaxed">
                                API-based outcome verification. No manual review or appeals.
                            </div>
                        </div>

                        <!-- Step 4 -->
                        <div class="animate-in delay-3">
                            <div class="text-sm font-bold text-[#8B1818] mb-3">04</div>
                            <div class="text-lg font-semibold text-[#1A1A1A] mb-2">
                                Settlement
                            </div>
                            <div class="text-sm text-[#6B6B6B] leading-relaxed">
                                Automatic funds release. Receipt-grade finality recorded to ledger.
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- RECENT EXECUTIONS - TABLE FORMAT (NOT LIVE FEED) -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-20 relative z-10">
                <div class="max-w-6xl mx-auto px-6 md:px-12">
                    <div class="section-header mb-8">Recent Executions</div>
                    
                    <div class="doc-panel overflow-hidden">
                        <table class="execution-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Contract</th>
                                    <th>Stake</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="executions-table">
                                <tr>
                                    <td class="font-mono text-xs text-[#6B6B6B]">Feb 08, 14:22</td>
                                    <td>Revenue Growth +15%</td>
                                    <td class="font-medium">$1,000</td>
                                    <td><span class="status-settled">Settled</span></td>
                                </tr>
                                <tr>
                                    <td class="font-mono text-xs text-[#6B6B6B]">Feb 08, 12:18</td>
                                    <td>Commit Cadence 5/wk</td>
                                    <td class="font-medium">$500</td>
                                    <td><span class="status-active">Active</span></td>
                                </tr>
                                <tr>
                                    <td class="font-mono text-xs text-[#6B6B6B]">Feb 07, 09:44</td>
                                    <td>MRR Target $8,000</td>
                                    <td class="font-medium">$750</td>
                                    <td><span class="status-settled">Settled</span></td>
                                </tr>
                                <tr>
                                    <td class="font-mono text-xs text-[#6B6B6B]">Feb 06, 16:03</td>
                                    <td>Revenue Growth +20%</td>
                                    <td class="font-medium">$2,000</td>
                                    <td><span class="status-forfeited">Forfeited</span></td>
                                </tr>
                                <tr>
                                    <td class="font-mono text-xs text-[#6B6B6B]">Feb 06, 11:29</td>
                                    <td>Engagement +25%</td>
                                    <td class="font-medium">$400</td>
                                    <td><span class="status-settled">Settled</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-4 text-right">
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" 
                           class="text-sm text-[#8B1818] hover:underline font-medium">
                            View Complete Ledger →
                        </a>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- CONTRACT SPECIFICATIONS -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-20 bg-white border-y border-[#E8E6E3] relative z-10">
                <div class="max-w-6xl mx-auto px-6 md:px-12">
                    <div class="section-header mb-12">Contract Terms</div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Settlement Tiers -->
                        <div class="doc-panel p-6">
                            <div class="text-sm font-semibold text-[#1A1A1A] mb-4 uppercase tracking-wide">Settlement Tiers</div>
                            <table class="w-full text-sm">
                                <thead class="text-[#6B6B6B] border-b border-[#E8E6E3]">
                                    <tr>
                                        <th class="text-left py-3 font-medium">Tier</th>
                                        <th class="text-right py-3 font-medium">Return</th>
                                        <th class="text-right py-3 font-medium">Risk</th>
                                    </tr>
                                </thead>
                                <tbody class="text-[#1A1A1A]">
                                    <tr class="border-b border-[#EFEDE9]">
                                        <td class="py-3 font-medium">Conservative</td>
                                        <td class="text-right">1.2x – 1.5x</td>
                                        <td class="text-right text-[#166534]">Low</td>
                                    </tr>
                                    <tr class="border-b border-[#EFEDE9]">
                                        <td class="py-3 font-medium">Standard</td>
                                        <td class="text-right">1.5x – 2.5x</td>
                                        <td class="text-right text-[#92400E]">Medium</td>
                                    </tr>
                                    <tr>
                                        <td class="py-3 font-medium">Aggressive</td>
                                        <td class="text-right">2.5x – 5.0x</td>
                                        <td class="text-right text-[#8B1818]">High</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Verification Sources -->
                        <div class="doc-panel p-6">
                            <div class="text-sm font-semibold text-[#1A1A1A] mb-4 uppercase tracking-wide">Verification Sources</div>
                            <div class="space-y-0">
                                <div class="ledger-row">
                                    <span class="ledger-label text-sm normal-case font-normal">Stripe</span>
                                    <span class="text-sm text-[#1A1A1A]">Revenue, MRR</span>
                                </div>
                                <div class="ledger-row">
                                    <span class="ledger-label text-sm normal-case font-normal">Shopify</span>
                                    <span class="text-sm text-[#1A1A1A]">Store revenue</span>
                                </div>
                                <div class="ledger-row">
                                    <span class="ledger-label text-sm normal-case font-normal">X (Twitter)</span>
                                    <span class="text-sm text-[#1A1A1A]">Engagement metrics</span>
                                </div>
                                <div class="ledger-row">
                                    <span class="ledger-label text-sm normal-case font-normal">GitHub</span>
                                    <span class="text-sm text-[#1A1A1A]">Commit frequency</span>
                                </div>
                            </div>
                            <div class="mt-4 pt-4 border-t border-[#E8E6E3] text-xs text-[#9CA3AF]">
                                All verification via OAuth API. No manual review.
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- PROTOCOL STATEMENT - INSTITUTIONAL CLOSE -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-20 md:py-28 relative z-10">
                <div class="max-w-6xl mx-auto px-6 md:px-12">
                    <div class="max-w-xl">
                        <div class="section-header mb-8">Protocol</div>
                        
                        <div class="space-y-6 mb-12">
                            <p class="text-2xl md:text-3xl text-[#1A1A1A] leading-snug font-medium tracking-tight">
                                Intentions without stakes<br/>
                                produce nothing.
                            </p>
                            <p class="text-base text-[#6B6B6B] leading-relaxed">
                                Capital enforcement creates accountability. 
                                Markets price commitment. Outcomes become inevitable 
                                when failure carries real consequence.
                            </p>
                        </div>
                        
                        <div class="flex flex-wrap gap-4 mb-8">
                            <button onclick="window.app.handleInitiate()" class="cta-primary">
                                Execute Contract
                            </button>
                            <button onclick="window.router.navigate('/docs'); return false;" class="cta-secondary">
                                Read Terms
                            </button>
                        </div>
                        
                        <p class="text-xs text-[#9CA3AF]">
                            Capital at risk. Review contract terms before committing funds.
                        </p>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- FOOTER - MINIMAL INSTITUTIONAL -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <footer class="border-t border-[#E8E6E3] py-12 bg-white relative z-10">
                <div class="max-w-6xl mx-auto px-6 md:px-12">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div class="font-bold text-lg mb-1 text-[#1A1A1A]">
                                Collateral
                            </div>
                            <div class="text-xs text-[#9CA3AF]">
                                Enforcement Protocol • v1.0
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-6 text-sm text-[#6B6B6B]">
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="hover:text-[#1A1A1A] transition-colors">
                                Documentation
                            </a>
                            <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="hover:text-[#1A1A1A] transition-colors">
                                Ledger
                            </a>
                            <a href="#" class="hover:text-[#1A1A1A] transition-colors">
                                Terms
                            </a>
                            <a href="#" class="hover:text-[#1A1A1A] transition-colors">
                                Risk Disclosure
                            </a>
                        </div>
                    </div>
                    
                    <div class="mt-8 pt-6 border-t border-[#E8E6E3] text-xs text-[#9CA3AF]">
                        © 2026 Collateral. Capital at risk. Settlement is final and irreversible.
                    </div>
                </div>
            </footer>
        </div>
    `;
}


export function initOverview() {
    console.log('[Overview] Initializing institutional protocol interface');

    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
