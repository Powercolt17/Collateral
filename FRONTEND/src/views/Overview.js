// Overview View - Contract Execution Terminal
// Exact replica from screenshots

export function renderOverview() {
    return `
        <style>
            /* === CONTRACT TERMINAL === */
            .contract-terminal {
                background: #FFFFFF;
                color: #1A1A1A;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                padding-bottom: 60px;
            }

            /* Field row table */
            .field-table {
                width: 100%;
                max-width: 500px;
                border: 1px solid #E5E5E5;
            }
            .field-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 20px;
                border-bottom: 1px solid #F0F0F0;
                font-size: 13px;
            }
            .field-row:last-child {
                border-bottom: none;
            }
            .field-label {
                color: #6B6B6B;
                text-transform: uppercase;
                font-size: 11px;
                letter-spacing: 0.05em;
            }
            .field-value {
                color: #1A1A1A;
                font-weight: 500;
                text-align: right;
            }
            .field-value.red {
                color: #8B1818;
            }

            /* Status badge */
            .status-badge {
                display: inline-block;
                border: 1px solid #1A1A1A;
                padding: 6px 14px;
                font-size: 11px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            /* Lifecycle pills */
            .lifecycle-pill {
                display: inline-flex;
                align-items: center;
                padding: 6px 12px;
                font-size: 10px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.03em;
                border: 1px solid #E5E5E5;
                background: white;
                color: #6B6B6B;
            }
            .lifecycle-pill.active {
                background: #1A1A1A;
                color: white;
                border-color: #1A1A1A;
            }
            .lifecycle-pill.forfeited {
                background: #8B1818;
                color: white;
                border-color: #8B1818;
            }
            .lifecycle-arrow {
                color: #D0D0D0;
                margin: 0 4px;
                font-size: 10px;
            }

            /* Contract terms list */
            .terms-table {
                width: 100%;
                max-width: 600px;
            }
            .terms-row {
                display: flex;
                padding: 12px 0;
                border-bottom: 1px solid #F5F5F5;
                font-size: 13px;
            }
            .terms-row:last-child {
                border-bottom: none;
            }
            .terms-label {
                width: 140px;
                flex-shrink: 0;
                color: #6B6B6B;
            }
            .terms-value {
                color: #1A1A1A;
            }
            .terms-value .red {
                color: #8B1818;
            }

            /* CTA buttons */
            .cta-execute {
                background: #8B1818;
                color: white;
                padding: 12px 24px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                border: none;
                cursor: pointer;
                transition: background 0.15s ease;
            }
            .cta-execute:hover {
                background: #6B1212;
            }
            .cta-link {
                color: #6B6B6B;
                font-size: 13px;
                margin-left: 20px;
                text-decoration: none;
                transition: color 0.15s;
            }
            .cta-link:hover {
                color: #1A1A1A;
            }

            /* Section label */
            .section-label {
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.1em;
                color: #9CA3AF;
                text-transform: uppercase;
                margin-bottom: 16px;
            }

            /* Recent executions table */
            .executions-table {
                width: 100%;
                font-size: 12px;
            }
            .executions-header {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
                gap: 16px;
                padding: 12px 16px;
                background: #FAFAFA;
                border-bottom: 1px solid #E5E5E5;
                font-weight: 500;
                color: #6B6B6B;
                text-transform: uppercase;
                font-size: 10px;
                letter-spacing: 0.05em;
            }
            .executions-row {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
                gap: 16px;
                padding: 14px 16px;
                border-bottom: 1px solid #F5F5F5;
                align-items: center;
            }
            .executions-row:hover {
                background: #FAFAFA;
            }
            .execution-status {
                font-size: 10px;
                font-weight: 500;
                text-transform: uppercase;
                padding: 4px 8px;
                display: inline-block;
            }
            .execution-status.paid { background: #F0FDF4; color: #166534; }
            .execution-status.forfeited { background: #FEF2F2; color: #8B1818; }
        </style>

        <div class="contract-terminal">
            
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- HERO + CONTRACT FORM -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="pt-16 pb-12">
                <div class="max-w-[800px] mx-auto px-6 md:px-8">
                    
                    <!-- Status Badge -->
                    <div class="mb-8">
                        <span class="status-badge">EXECUTION STATUS: READY</span>
                    </div>

                    <!-- Headline -->
                    <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-10 italic" style="line-height: 1.2;">
                        Intentions Fail<br/>Without Stakes.
                    </h1>

                    <!-- Contract Field Table -->
                    <div class="field-table mb-8">
                        <div class="field-row">
                            <span class="field-label">Instrument</span>
                            <span class="field-value">REVENUE_COMMITMENT</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Baseline Snapshot</span>
                            <span class="field-value">$4,221(30D)</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Target Delta</span>
                            <span class="field-value red">+10%</span>
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
                            <span class="field-value">API-ONLY</span>
                        </div>
                        <div class="field-row">
                            <span class="field-label">Receipt ID</span>
                            <span class="field-value">RCPT_0384_9F2A</span>
                        </div>
                    </div>

                    <!-- CTAs -->
                    <div class="flex items-center">
                        <button onclick="window.app.handleInitiate()" class="cta-execute">
                            EXECUTE CONTRACT
                        </button>
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="cta-link">
                            View Ledger Record →
                        </a>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- ENFORCEMENT LIFECYCLE -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-12 border-t border-[#F0F0F0]">
                <div class="max-w-[800px] mx-auto px-6 md:px-8">
                    <div class="section-label">ENFORCEMENT LIFECYCLE</div>
                    
                    <div class="flex flex-wrap items-center gap-1">
                        <span class="lifecycle-pill active">BASELINE_CAPTURED</span>
                        <span class="lifecycle-arrow">→</span>
                        <span class="lifecycle-pill">CAPITAL_LOCKED</span>
                        <span class="lifecycle-arrow">→</span>
                        <span class="lifecycle-pill">VERIFYING</span>
                        <span class="lifecycle-arrow">→</span>
                        <span class="lifecycle-pill">SETTLED</span>
                        <span class="lifecycle-arrow">→</span>
                        <span class="lifecycle-pill forfeited">FORFEITED</span>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- CONTRACT TERMS -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-12 border-t border-[#F0F0F0]">
                <div class="max-w-[800px] mx-auto px-6 md:px-8">
                    <div class="section-label">CONTRACT TERMS</div>
                    
                    <div class="terms-table">
                        <div class="terms-row">
                            <span class="terms-label">Baseline</span>
                            <span class="terms-value">Captured at execution. Immutable.</span>
                        </div>
                        <div class="terms-row">
                            <span class="terms-label">Capital</span>
                            <span class="terms-value">Locked until settlement. Non-reversible.</span>
                        </div>
                        <div class="terms-row">
                            <span class="terms-label">Verification</span>
                            <span class="terms-value">API response only. Zero subjective layer.</span>
                        </div>
                        <div class="terms-row">
                            <span class="terms-label">Settlement</span>
                            <span class="terms-value">Automatic. Receipt-grade finality.</span>
                        </div>
                        <div class="terms-row">
                            <span class="terms-label">Outcome</span>
                            <span class="terms-value">Paid <span class="red">or Forfeited</span></span>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- RECENT EXECUTIONS -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-12 border-t border-[#F0F0F0]">
                <div class="max-w-[1000px] mx-auto px-6 md:px-8">
                    <div class="section-label">RECENT EXECUTIONS</div>
                    
                    <div class="executions-table border border-[#E5E5E5]">
                        <div class="executions-header">
                            <span>USER</span>
                            <span>STAKE</span>
                            <span>INSTRUMENT</span>
                            <span>TARGET</span>
                            <span>WINDOW</span>
                            <span>STATUS</span>
                        </div>
                        <div class="executions-row">
                            <span class="font-medium">@founder_x</span>
                            <span>$1,000</span>
                            <span>REVENUE</span>
                            <span>+15%</span>
                            <span>30D</span>
                            <span class="execution-status paid">PAID</span>
                        </div>
                        <div class="executions-row">
                            <span class="font-medium">@dev_studio</span>
                            <span>$500</span>
                            <span>COMMITS</span>
                            <span>20/wk</span>
                            <span>14D</span>
                            <span class="execution-status forfeited">FORFEITED</span>
                        </div>
                        <div class="executions-row">
                            <span class="font-medium">@creator_co</span>
                            <span>$750</span>
                            <span>POSTS</span>
                            <span>5/wk</span>
                            <span>7D</span>
                            <span class="execution-status paid">PAID</span>
                        </div>
                        <div class="executions-row">
                            <span class="font-medium">@saas_builder</span>
                            <span>$2,000</span>
                            <span>REVENUE</span>
                            <span>+25%</span>
                            <span>60D</span>
                            <span class="execution-status forfeited">FORFEITED</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
}


export function initOverview() {
    console.log('[Overview] Contract terminal initialized');

    if (window.lucide) {
        window.lucide.createIcons();
    }
}
