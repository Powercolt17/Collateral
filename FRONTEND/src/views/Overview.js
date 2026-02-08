// Overview View - Capital Enforcement Terminal
// Bloomberg-grade financial infrastructure - NOT a landing page template

export function renderOverview() {
    return `
        <style>
            /* === CAPITAL ENFORCEMENT TERMINAL === */
            :root {
                --terminal-bg: #0a0a0c;
                --terminal-surface: #111114;
                --terminal-border: #1e1e24;
                --terminal-text: #e8e8ec;
                --terminal-muted: #6b6b78;
                --terminal-red: #921818;
                --terminal-red-dim: #5a1010;
                --terminal-green: #1a5c3a;
                --terminal-gold: #8b7028;
            }

            .enforcement-terminal {
                background: var(--terminal-bg);
                color: var(--terminal-text);
                min-height: 100vh;
            }

            /* Grid overlay for texture */
            .grid-overlay {
                position: fixed;
                inset: 0;
                pointer-events: none;
                opacity: 0.03;
                background-image: 
                    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                background-size: 40px 40px;
            }

            /* Saturn ring watermark */
            .saturn-watermark {
                position: fixed;
                bottom: -200px;
                right: -200px;
                width: 600px;
                height: 600px;
                border: 1px solid rgba(146, 24, 24, 0.08);
                border-radius: 50%;
                pointer-events: none;
            }
            .saturn-watermark::before {
                content: '';
                position: absolute;
                top: 50%;
                left: -30%;
                right: -30%;
                height: 3px;
                background: linear-gradient(90deg, transparent, rgba(146, 24, 24, 0.06), transparent);
                transform: rotate(-15deg);
            }

            /* Receipt panel styling */
            .receipt-panel {
                background: var(--terminal-surface);
                border: 1px solid var(--terminal-border);
                font-family: 'JetBrains Mono', monospace;
            }

            .receipt-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid var(--terminal-border);
            }
            .receipt-row:last-child { border-bottom: none; }
            .receipt-label { color: var(--terminal-muted); font-size: 11px; }
            .receipt-value { color: var(--terminal-text); font-size: 11px; font-weight: 500; }
            .receipt-value.highlight { color: var(--terminal-red); }
            .receipt-value.success { color: #22c55e; }

            /* Pipeline styling */
            .pipeline-step {
                background: var(--terminal-surface);
                border: 1px solid var(--terminal-border);
                padding: 20px 24px;
                position: relative;
            }
            .pipeline-step::after {
                content: '→';
                position: absolute;
                right: -20px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--terminal-muted);
                font-size: 18px;
            }
            .pipeline-step:last-child::after { display: none; }

            /* Live feed styling */
            .feed-row {
                display: flex;
                gap: 16px;
                padding: 10px 16px;
                border-bottom: 1px solid var(--terminal-border);
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
            }
            .feed-timestamp { color: var(--terminal-muted); min-width: 80px; }
            .feed-event { color: var(--terminal-text); }
            .feed-event.executed { color: #22c55e; }
            .feed-event.pending { color: #f59e0b; }
            .feed-event.locked { color: var(--terminal-red); }

            /* CTA buttons - hardware feel */
            .cta-execute {
                background: var(--terminal-red);
                color: white;
                padding: 14px 28px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
                border: none;
                cursor: pointer;
                transition: all 150ms ease;
            }
            .cta-execute:hover {
                background: #751212;
                transform: translateY(-1px);
            }
            .cta-execute:active {
                transform: translateY(1px);
            }

            .cta-secondary {
                background: transparent;
                color: var(--terminal-muted);
                padding: 14px 28px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                letter-spacing: 0.5px;
                border: 1px solid var(--terminal-border);
                cursor: pointer;
                transition: all 150ms ease;
            }
            .cta-secondary:hover {
                color: var(--terminal-text);
                border-color: var(--terminal-muted);
            }

            /* Section dividers */
            .section-divider {
                height: 1px;
                background: var(--terminal-border);
                margin: 0;
            }

            /* Terminal header tags */
            .terminal-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                letter-spacing: 1.5px;
                color: var(--terminal-muted);
                text-transform: uppercase;
            }

            /* Animations */
            @keyframes feedPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
            .feed-live-indicator {
                animation: feedPulse 2s ease-in-out infinite;
            }

            @keyframes terminalReveal {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .terminal-reveal {
                animation: terminalReveal 600ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
            }
            .terminal-reveal-delay-1 { animation-delay: 100ms; opacity: 0; }
            .terminal-reveal-delay-2 { animation-delay: 200ms; opacity: 0; }
            .terminal-reveal-delay-3 { animation-delay: 300ms; opacity: 0; }
            .terminal-reveal-delay-4 { animation-delay: 400ms; opacity: 0; }

            @media (prefers-reduced-motion: reduce) {
                .terminal-reveal, .feed-live-indicator {
                    animation: none !important;
                    opacity: 1 !important;
                }
            }
        </style>

        <div class="enforcement-terminal">
            <div class="grid-overlay"></div>
            <div class="saturn-watermark"></div>

            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- PROTOCOL HEADER - NOT MARKETING HERO -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="border-b border-[#1e1e24] py-16 md:py-24">
                <div class="max-w-7xl mx-auto px-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        
                        <!-- LEFT: Protocol Statement -->
                        <div class="terminal-reveal">
                            <span class="terminal-tag mb-6 block">COLLATERAL.MARKET // ENFORCEMENT PROTOCOL</span>
                            
                            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" 
                                style="font-family: 'IBM Plex Sans', sans-serif; color: #e8e8ec;">
                                <span class="block">Intentions Fail</span>
                                <span><span class="text-[#921818]">Without</span> Stakes.</span>
                            </h1>
                            
                            <p class="text-[#6b6b78] text-sm md:text-base leading-relaxed mb-10 max-w-lg"
                               style="font-family: 'JetBrains Mono', monospace;">
                                Performance contracts with capital enforcement. 
                                Baselines captured at execution. Verification via API. 
                                Settlement is automatic and irreversible.
                            </p>
                            
                            <div class="flex flex-wrap gap-4">
                                <button onclick="window.app.handleInitiate()" class="cta-execute">
                                    EXECUTE CONTRACT
                                </button>
                                <button onclick="window.router.navigate('/ledger'); return false;" class="cta-secondary">
                                    VIEW LEDGER
                                </button>
                            </div>
                        </div>

                        <!-- RIGHT: Contract Receipt Panel -->
                        <div class="terminal-reveal terminal-reveal-delay-2">
                            <div class="receipt-panel p-6">
                                <div class="flex items-center justify-between mb-4 pb-4 border-b border-[#1e1e24]">
                                    <span class="terminal-tag">CONTRACT RECEIPT</span>
                                    <span class="text-[10px] font-mono text-[#22c55e] flex items-center gap-1.5">
                                        <span class="w-1.5 h-1.5 bg-[#22c55e] rounded-full feed-live-indicator"></span>
                                        EXECUTION_READY
                                    </span>
                                </div>
                                
                                <div class="space-y-0">
                                    <div class="receipt-row">
                                        <span class="receipt-label">CONTRACT</span>
                                        <span class="receipt-value">REVENUE_COMMITMENT</span>
                                    </div>
                                    <div class="receipt-row">
                                        <span class="receipt-label">BASELINE</span>
                                        <span class="receipt-value">$4,221 (30D)</span>
                                    </div>
                                    <div class="receipt-row">
                                        <span class="receipt-label">TARGET</span>
                                        <span class="receipt-value highlight">+18%</span>
                                    </div>
                                    <div class="receipt-row">
                                        <span class="receipt-label">WINDOW</span>
                                        <span class="receipt-value">14 DAYS</span>
                                    </div>
                                    <div class="receipt-row">
                                        <span class="receipt-label">TIER</span>
                                        <span class="receipt-value">STANDARD (1.6x)</span>
                                    </div>
                                    <div class="receipt-row">
                                        <span class="receipt-label">VERIFICATION</span>
                                        <span class="receipt-value">API-ONLY</span>
                                    </div>
                                    <div class="receipt-row">
                                        <span class="receipt-label">STAKE</span>
                                        <span class="receipt-value highlight">$500.00 LOCKED</span>
                                    </div>
                                </div>
                                
                                <div class="mt-4 pt-4 border-t border-[#1e1e24]">
                                    <div class="text-[9px] font-mono text-[#6b6b78]">
                                        SETTLEMENT: TARGET MET → $800 RETURNED // NOT MET → $0
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- ENFORCEMENT PIPELINE - NOT FEATURE CARDS -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="border-b border-[#1e1e24] py-16 md:py-20">
                <div class="max-w-7xl mx-auto px-6">
                    <span class="terminal-tag mb-10 block">ENFORCEMENT PIPELINE</span>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-0">
                        <!-- Step 1 -->
                        <div class="pipeline-step terminal-reveal terminal-reveal-delay-1">
                            <div class="text-[#921818] font-mono text-[10px] mb-3">EVENT_001</div>
                            <div class="text-[#e8e8ec] font-semibold text-sm mb-2" style="font-family: 'JetBrains Mono', monospace;">
                                BASELINE_CAPTURED
                            </div>
                            <div class="text-[#6b6b78] text-xs leading-relaxed font-mono">
                                Captured at execution.<br/>
                                Cannot be modified.
                            </div>
                        </div>

                        <!-- Step 2 -->
                        <div class="pipeline-step terminal-reveal terminal-reveal-delay-2">
                            <div class="text-[#921818] font-mono text-[10px] mb-3">EVENT_002</div>
                            <div class="text-[#e8e8ec] font-semibold text-sm mb-2" style="font-family: 'JetBrains Mono', monospace;">
                                CAPITAL_LOCKED
                            </div>
                            <div class="text-[#6b6b78] text-xs leading-relaxed font-mono">
                                Non-reversible deposit.<br/>
                                Held until settlement.
                            </div>
                        </div>

                        <!-- Step 3 -->
                        <div class="pipeline-step terminal-reveal terminal-reveal-delay-3">
                            <div class="text-[#921818] font-mono text-[10px] mb-3">EVENT_003</div>
                            <div class="text-[#e8e8ec] font-semibold text-sm mb-2" style="font-family: 'JetBrains Mono', monospace;">
                                VERIFICATION_PASS
                            </div>
                            <div class="text-[#6b6b78] text-xs leading-relaxed font-mono">
                                API response only.<br/>
                                Zero subjective layer.
                            </div>
                        </div>

                        <!-- Step 4 -->
                        <div class="pipeline-step terminal-reveal terminal-reveal-delay-4">
                            <div class="text-[#921818] font-mono text-[10px] mb-3">EVENT_004</div>
                            <div class="text-[#e8e8ec] font-semibold text-sm mb-2" style="font-family: 'JetBrains Mono', monospace;">
                                SETTLEMENT_FINAL
                            </div>
                            <div class="text-[#6b6b78] text-xs leading-relaxed font-mono">
                                Immutable record.<br/>
                                Receipt-grade finality.
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- LIVE SYSTEM FEED - ANTI-SQUARESPACE TEXTURE -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="border-b border-[#1e1e24] py-16 md:py-20">
                <div class="max-w-7xl mx-auto px-6">
                    <div class="flex items-center justify-between mb-6">
                        <span class="terminal-tag">LIVE SYSTEM EVENTS</span>
                        <span class="text-[10px] font-mono text-[#22c55e] flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 bg-[#22c55e] rounded-full feed-live-indicator"></span>
                            STREAMING
                        </span>
                    </div>
                    
                    <div class="receipt-panel overflow-hidden" id="system-feed">
                        <div class="feed-row">
                            <span class="feed-timestamp">14:36:44</span>
                            <span class="feed-event pending">VERIFICATION_PENDING</span>
                            <span class="text-[#6b6b78] ml-auto">CONTRACT #0187 — AWAITING API RESPONSE</span>
                        </div>
                        <div class="feed-row">
                            <span class="feed-timestamp">14:22:09</span>
                            <span class="feed-event executed">BASELINE_SNAPSHOT</span>
                            <span class="text-[#6b6b78] ml-auto">STRIPE CONNECTION — $8,442 (30D)</span>
                        </div>
                        <div class="feed-row">
                            <span class="feed-timestamp">14:22:01</span>
                            <span class="feed-event locked">CONTRACT_EXECUTED</span>
                            <span class="text-[#6b6b78] ml-auto">CONTRACT #0184 — $1,000 LOCKED</span>
                        </div>
                        <div class="feed-row">
                            <span class="feed-timestamp">14:18:33</span>
                            <span class="feed-event executed">SETTLEMENT_COMPLETE</span>
                            <span class="text-[#6b6b78] ml-auto">CONTRACT #0179 — $2,400 RETURNED</span>
                        </div>
                        <div class="feed-row">
                            <span class="feed-timestamp">14:12:07</span>
                            <span class="feed-event locked">FORFEITURE_FINAL</span>
                            <span class="text-[#6b6b78] ml-auto">CONTRACT #0176 — TARGET NOT MET</span>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- PROTOCOL SPECIFICATIONS - LEDGER TABLE FORMAT -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="border-b border-[#1e1e24] py-16 md:py-20">
                <div class="max-w-7xl mx-auto px-6">
                    <span class="terminal-tag mb-10 block">CONTRACT SPECIFICATIONS</span>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Tier Table -->
                        <div class="receipt-panel p-6">
                            <div class="terminal-tag mb-4">SETTLEMENT TIERS</div>
                            <table class="w-full font-mono text-xs">
                                <thead class="text-[#6b6b78] border-b border-[#1e1e24]">
                                    <tr>
                                        <th class="text-left py-2">TIER</th>
                                        <th class="text-right py-2">MULTIPLIER</th>
                                        <th class="text-right py-2">RISK</th>
                                    </tr>
                                </thead>
                                <tbody class="text-[#e8e8ec]">
                                    <tr class="border-b border-[#1e1e24]">
                                        <td class="py-3">CONSERVATIVE</td>
                                        <td class="text-right">1.2x–1.5x</td>
                                        <td class="text-right text-[#22c55e]">LOW</td>
                                    </tr>
                                    <tr class="border-b border-[#1e1e24]">
                                        <td class="py-3">STANDARD</td>
                                        <td class="text-right">1.5x–2.5x</td>
                                        <td class="text-right text-[#f59e0b]">MEDIUM</td>
                                    </tr>
                                    <tr>
                                        <td class="py-3">AGGRESSIVE</td>
                                        <td class="text-right">2.5x–5.0x</td>
                                        <td class="text-right text-[#921818]">HIGH</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Verification Sources -->
                        <div class="receipt-panel p-6">
                            <div class="terminal-tag mb-4">VERIFICATION LAYER</div>
                            <div class="space-y-0">
                                <div class="receipt-row">
                                    <span class="receipt-label">STRIPE</span>
                                    <span class="receipt-value">Revenue metrics, MRR</span>
                                </div>
                                <div class="receipt-row">
                                    <span class="receipt-label">SHOPIFY</span>
                                    <span class="receipt-value">Store revenue, orders</span>
                                </div>
                                <div class="receipt-row">
                                    <span class="receipt-label">AMAZON</span>
                                    <span class="receipt-value">Seller revenue, net</span>
                                </div>
                                <div class="receipt-row">
                                    <span class="receipt-label">X (TWITTER)</span>
                                    <span class="receipt-value">Post cadence, engagement</span>
                                </div>
                                <div class="receipt-row">
                                    <span class="receipt-label">GITHUB</span>
                                    <span class="receipt-value">Commit frequency</span>
                                </div>
                            </div>
                            <div class="mt-4 pt-4 border-t border-[#1e1e24] text-[9px] font-mono text-[#6b6b78]">
                                ALL VERIFICATION: OAUTH API ONLY. NO MANUAL REVIEW.
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- PROTOCOL STATEMENT - INSTITUTIONAL CLOSE -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-20 md:py-28">
                <div class="max-w-7xl mx-auto px-6">
                    <div class="max-w-2xl">
                        <span class="terminal-tag mb-8 block">PROTOCOL RATIONALE</span>
                        
                        <div class="space-y-6 mb-12">
                            <p class="text-lg md:text-xl text-[#e8e8ec] leading-relaxed" 
                               style="font-family: 'IBM Plex Sans', sans-serif; font-weight: 500;">
                                Commitments without cost are noise.<br/>
                                Intentions fade when stakes are zero.
                            </p>
                            <p class="text-base text-[#6b6b78] leading-relaxed font-mono">
                                Capital enforces follow-through. Markets price risk. 
                                Outcomes become inevitable when failure has real consequence.
                            </p>
                            <p class="text-sm text-[#921818] font-mono font-semibold">
                                THIS IS NOT MOTIVATION. THIS IS MECHANISM.
                            </p>
                        </div>
                        
                        <div class="flex flex-wrap gap-4">
                            <button onclick="window.app.handleInitiate()" class="cta-execute">
                                COMMIT CAPITAL
                            </button>
                            <button onclick="window.router.navigate('/docs'); return false;" class="cta-secondary">
                                READ TERMS
                            </button>
                        </div>
                        
                        <p class="text-[10px] text-[#6b6b78] mt-8 font-mono">
                            CAPITAL AT RISK. VERIFY MECHANISM BEFORE COMMITTING FUNDS.
                        </p>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- FOOTER - MINIMAL INSTITUTIONAL -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <footer class="border-t border-[#1e1e24] py-12">
                <div class="max-w-7xl mx-auto px-6">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div class="font-bold text-lg mb-1 text-[#e8e8ec]" style="font-family: 'IBM Plex Sans', sans-serif;">
                                COLLATERAL
                            </div>
                            <div class="text-[10px] font-mono text-[#6b6b78]">
                                ENFORCEMENT PROTOCOL // v1.0
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-6 text-xs font-mono text-[#6b6b78]">
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="hover:text-[#e8e8ec] transition-colors">
                                DOCUMENTATION
                            </a>
                            <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="hover:text-[#e8e8ec] transition-colors">
                                PUBLIC LEDGER
                            </a>
                            <a href="#" class="hover:text-[#e8e8ec] transition-colors">
                                TERMS
                            </a>
                            <a href="#" class="hover:text-[#e8e8ec] transition-colors">
                                RISK DISCLOSURE
                            </a>
                        </div>
                    </div>
                    
                    <div class="mt-8 pt-6 border-t border-[#1e1e24] text-[10px] font-mono text-[#6b6b78]">
                        © 2026 COLLATERAL. ALL CAPITAL AT RISK. NO GUARANTEES OF RETURN. IMMUTABLE SETTLEMENT.
                    </div>
                </div>
            </footer>
        </div>
    `;
}


export function initOverview() {
    console.log('[Overview] Initializing terminal interface');

    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Animate feed entries
    animateFeed();
}


function animateFeed() {
    const feed = document.getElementById('system-feed');
    if (!feed) return;

    const events = [
        { time: getRandomTime(), type: 'executed', event: 'CONTRACT_EXECUTED', detail: 'CONTRACT #' + getRandomId() + ' — $' + getRandomAmount() + ' LOCKED' },
        { time: getRandomTime(), type: 'pending', event: 'VERIFICATION_PENDING', detail: 'CONTRACT #' + getRandomId() + ' — AWAITING API RESPONSE' },
        { time: getRandomTime(), type: 'executed', event: 'SETTLEMENT_COMPLETE', detail: 'CONTRACT #' + getRandomId() + ' — $' + getRandomAmount() + ' RETURNED' },
        { time: getRandomTime(), type: 'locked', event: 'FORFEITURE_FINAL', detail: 'CONTRACT #' + getRandomId() + ' — TARGET NOT MET' },
        { time: getRandomTime(), type: 'executed', event: 'BASELINE_SNAPSHOT', detail: 'STRIPE CONNECTION — $' + getRandomAmount() + ' (30D)' },
    ];

    setInterval(() => {
        if (Math.random() > 0.6) {
            const event = events[Math.floor(Math.random() * events.length)];
            const now = new Date();
            const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');

            const newRow = document.createElement('div');
            newRow.className = 'feed-row';
            newRow.innerHTML = '<span class="feed-timestamp">' + time + '</span>' +
                '<span class="feed-event ' + event.type + '">' + event.event + '</span>' +
                '<span class="text-[#6b6b78] ml-auto">' + event.detail + '</span>';

            // Add to top with animation
            newRow.style.opacity = '0';
            newRow.style.transform = 'translateY(-10px)';
            feed.insertBefore(newRow, feed.firstChild);

            requestAnimationFrame(() => {
                newRow.style.transition = 'all 300ms ease';
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateY(0)';
            });

            // Remove last if too many
            if (feed.children.length > 8) {
                feed.removeChild(feed.lastChild);
            }
        }
    }, 5000);
}

function getRandomTime() {
    return Math.floor(Math.random() * 24).toString().padStart(2, '0') + ':' + Math.floor(Math.random() * 60).toString().padStart(2, '0') + ':' + Math.floor(Math.random() * 60).toString().padStart(2, '0');
}

function getRandomId() {
    return (Math.floor(Math.random() * 200) + 100).toString().padStart(4, '0');
}

function getRandomAmount() {
    return (Math.floor(Math.random() * 50) * 100 + 500).toLocaleString();
}

