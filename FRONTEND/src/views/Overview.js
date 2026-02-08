// Overview View - Original Dark Terminal Aesthetic
export function renderOverview() {
    return `
        <style>
            /* === ENFORCEMENT TERMINAL === */
            .enforcement-terminal {
                background: #0a0a0c;
                color: #e8e8ec;
                position: relative;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* Grid overlay */
            .grid-overlay {
                position: absolute;
                inset: 0;
                background-image: 
                    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                background-size: 40px 40px;
                pointer-events: none;
            }

            /* Terminal glow effect */
            .terminal-glow {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 600px;
                height: 400px;
                background: radial-gradient(ellipse at center, rgba(146, 24, 24, 0.08) 0%, transparent 70%);
                pointer-events: none;
            }

            /* Panel styles */
            .terminal-panel {
                background: #111114;
                border: 1px solid #1e1e24;
            }

            /* Status indicator */
            .status-pulse {
                animation: pulse 2s ease-in-out infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            /* Feed entry animation */
            @keyframes feedSlide {
                from { 
                    opacity: 0; 
                    transform: translateY(-10px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            .feed-entry {
                animation: feedSlide 0.3s ease forwards;
            }

            /* Terminal reveal */
            @keyframes terminalReveal {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .terminal-reveal {
                animation: terminalReveal 0.6s ease forwards;
            }
            .terminal-reveal-delay-1 { animation-delay: 0.1s; opacity: 0; }
            .terminal-reveal-delay-2 { animation-delay: 0.2s; opacity: 0; }
            .terminal-reveal-delay-3 { animation-delay: 0.3s; opacity: 0; }
        </style>

        <div class="enforcement-terminal min-h-screen pb-16">
            <div class="grid-overlay"></div>
            <div class="terminal-glow"></div>

            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- HERO SECTION -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="relative pt-20 pb-16 md:pt-28 md:pb-24">
                <div class="max-w-[1200px] mx-auto px-6 md:px-8">
                    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        
                        <!-- Left Column: Copy -->
                        <div class="terminal-reveal">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="w-2 h-2 bg-[#22c55e] rounded-full status-pulse"></div>
                                <span class="text-[10px] font-mono uppercase tracking-widest text-[#6b6b78]">
                                    SYSTEM OPERATIONAL
                                </span>
                            </div>
                            
                            <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-[#e8e8ec] mb-6" 
                                style="font-family: 'IBM Plex Sans', sans-serif; line-height: 1.1;">
                                CAPITAL-BACKED<br/>
                                <span class="text-[#921818]">COMMITMENT</span><br/>
                                PROTOCOL
                            </h1>
                            
                            <p class="text-base md:text-lg text-[#6b6b78] mb-8 max-w-lg" style="line-height: 1.6;">
                                Lock stake against measurable outcomes. Verified by API. 
                                Settled automatically. No appeals.
                            </p>

                            <div class="flex flex-col sm:flex-row gap-4">
                                <button onclick="window.app.handleInitiate()" 
                                    class="bg-[#921818] hover:bg-[#751212] text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 transition-all">
                                    INITIATE CONTRACT
                                </button>
                                <a href="#" onclick="window.router.navigate('/docs'); return false;" 
                                   class="text-[#6b6b78] hover:text-[#e8e8ec] text-xs font-mono uppercase tracking-widest px-8 py-4 border border-[#1e1e24] hover:border-[#921818] transition-all text-center">
                                    VIEW PROTOCOL
                                </a>
                            </div>
                        </div>

                        <!-- Right Column: Stats Panel -->
                        <div class="terminal-panel p-6 terminal-reveal terminal-reveal-delay-1">
                            <div class="text-[10px] font-mono uppercase tracking-widest text-[#6b6b78] mb-4">
                                PROTOCOL METRICS
                            </div>
                            
                            <div class="grid grid-cols-2 gap-6">
                                <div class="border-l-2 border-[#921818] pl-4">
                                    <div class="text-2xl md:text-3xl font-bold text-[#e8e8ec]" style="font-family: 'JetBrains Mono', monospace;">
                                        $2.4M
                                    </div>
                                    <div class="text-[10px] font-mono uppercase tracking-widest text-[#6b6b78] mt-1">
                                        CAPITAL LOCKED
                                    </div>
                                </div>
                                <div class="border-l-2 border-[#1e1e24] pl-4">
                                    <div class="text-2xl md:text-3xl font-bold text-[#e8e8ec]" style="font-family: 'JetBrains Mono', monospace;">
                                        2,847
                                    </div>
                                    <div class="text-[10px] font-mono uppercase tracking-widest text-[#6b6b78] mt-1">
                                        CONTRACTS EXECUTED
                                    </div>
                                </div>
                                <div class="border-l-2 border-[#1e1e24] pl-4">
                                    <div class="text-2xl md:text-3xl font-bold text-[#e8e8ec]" style="font-family: 'JetBrains Mono', monospace;">
                                        14D
                                    </div>
                                    <div class="text-[10px] font-mono uppercase tracking-widest text-[#6b6b78] mt-1">
                                        AVG WINDOW
                                    </div>
                                </div>
                                <div class="border-l-2 border-[#1e1e24] pl-4">
                                    <div class="text-2xl md:text-3xl font-bold text-[#921818]" style="font-family: 'JetBrains Mono', monospace;">
                                        68%
                                    </div>
                                    <div class="text-[10px] font-mono uppercase tracking-widest text-[#6b6b78] mt-1">
                                        FORFEITURE RATE
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- LIVE SYSTEM FEED -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-12 md:py-16 relative">
                <div class="max-w-[1200px] mx-auto px-6 md:px-8">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-3">
                            <div class="w-2 h-2 bg-[#921818] rounded-full status-pulse"></div>
                            <span class="text-[10px] font-mono uppercase tracking-widest text-[#6b6b78]">
                                LIVE SYSTEM FEED
                            </span>
                        </div>
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" 
                           class="text-[10px] font-mono uppercase tracking-widest text-[#6b6b78] hover:text-[#e8e8ec] transition-colors">
                            FULL LEDGER →
                        </a>
                    </div>

                    <div class="terminal-panel overflow-hidden">
                        <div class="border-b border-[#1e1e24] px-4 py-3 grid grid-cols-4 gap-4 text-[10px] font-mono uppercase tracking-widest text-[#6b6b78]">
                            <div>CONTRACT</div>
                            <div>STAKE</div>
                            <div>WINDOW</div>
                            <div class="text-right">STATUS</div>
                        </div>
                        
                        <div id="feed-container">
                            <div class="feed-entry border-b border-[#1e1e24] px-4 py-4 grid grid-cols-4 gap-4 text-sm">
                                <div class="font-mono text-[#6b6b78]">#CTR-2847</div>
                                <div class="text-[#e8e8ec] font-medium">$2,500</div>
                                <div class="text-[#6b6b78]">14D</div>
                                <div class="text-right">
                                    <span class="text-[10px] font-mono uppercase tracking-widest px-2 py-1 bg-[#921818]/20 text-[#921818]">
                                        LOCKED
                                    </span>
                                </div>
                            </div>
                            <div class="feed-entry border-b border-[#1e1e24] px-4 py-4 grid grid-cols-4 gap-4 text-sm">
                                <div class="font-mono text-[#6b6b78]">#CTR-2846</div>
                                <div class="text-[#e8e8ec] font-medium">$1,000</div>
                                <div class="text-[#6b6b78]">7D</div>
                                <div class="text-right">
                                    <span class="text-[10px] font-mono uppercase tracking-widest px-2 py-1 bg-[#1a5c3a]/20 text-[#22c55e]">
                                        VERIFIED
                                    </span>
                                </div>
                            </div>
                            <div class="feed-entry border-b border-[#1e1e24] px-4 py-4 grid grid-cols-4 gap-4 text-sm">
                                <div class="font-mono text-[#6b6b78]">#CTR-2845</div>
                                <div class="text-[#e8e8ec] font-medium">$5,000</div>
                                <div class="text-[#6b6b78]">30D</div>
                                <div class="text-right">
                                    <span class="text-[10px] font-mono uppercase tracking-widest px-2 py-1 bg-[#921818]/20 text-[#921818]">
                                        FORFEITED
                                    </span>
                                </div>
                            </div>
                            <div class="feed-entry px-4 py-4 grid grid-cols-4 gap-4 text-sm">
                                <div class="font-mono text-[#6b6b78]">#CTR-2844</div>
                                <div class="text-[#e8e8ec] font-medium">$750</div>
                                <div class="text-[#6b6b78]">14D</div>
                                <div class="text-right">
                                    <span class="text-[10px] font-mono uppercase tracking-widest px-2 py-1 bg-[#1a5c3a]/20 text-[#22c55e]">
                                        SETTLED
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- ENFORCEMENT PIPELINE -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-12 md:py-16 relative">
                <div class="max-w-[1200px] mx-auto px-6 md:px-8">
                    <div class="text-[10px] font-mono uppercase tracking-widest text-[#6b6b78] mb-8">
                        ENFORCEMENT PIPELINE
                    </div>

                    <div class="grid md:grid-cols-4 gap-6">
                        <div class="terminal-panel p-6 terminal-reveal">
                            <div class="text-[#921818] text-xs font-mono uppercase tracking-widest mb-3">01</div>
                            <div class="text-[#e8e8ec] font-semibold mb-2">BASELINE LOCK</div>
                            <div class="text-sm text-[#6b6b78]">
                                Connect data source. Snapshot current metrics. Immutable baseline recorded.
                            </div>
                        </div>
                        <div class="terminal-panel p-6 terminal-reveal terminal-reveal-delay-1">
                            <div class="text-[#921818] text-xs font-mono uppercase tracking-widest mb-3">02</div>
                            <div class="text-[#e8e8ec] font-semibold mb-2">CAPITAL STAKE</div>
                            <div class="text-sm text-[#6b6b78]">
                                Lock capital against target. Funds held in escrow until settlement.
                            </div>
                        </div>
                        <div class="terminal-panel p-6 terminal-reveal terminal-reveal-delay-2">
                            <div class="text-[#921818] text-xs font-mono uppercase tracking-widest mb-3">03</div>
                            <div class="text-[#e8e8ec] font-semibold mb-2">VERIFICATION</div>
                            <div class="text-sm text-[#6b6b78]">
                                Window expires. API queried. Delta calculated against baseline.
                            </div>
                        </div>
                        <div class="terminal-panel p-6 terminal-reveal terminal-reveal-delay-3">
                            <div class="text-[#921818] text-xs font-mono uppercase tracking-widest mb-3">04</div>
                            <div class="text-[#e8e8ec] font-semibold mb-2">SETTLEMENT</div>
                            <div class="text-sm text-[#6b6b78]">
                                Target met = stake returned. Target missed = forfeited. Automatic. Final.
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- VERIFICATION SOURCES -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-12 md:py-16 relative">
                <div class="max-w-[1200px] mx-auto px-6 md:px-8">
                    <div class="text-[10px] font-mono uppercase tracking-widest text-[#6b6b78] mb-8">
                        VERIFICATION ORACLES
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="terminal-panel p-5 flex flex-col items-center justify-center text-center">
                            <div class="text-[#e8e8ec] font-semibold mb-1">Stripe</div>
                            <div class="text-[10px] font-mono text-[#6b6b78]">REVENUE</div>
                        </div>
                        <div class="terminal-panel p-5 flex flex-col items-center justify-center text-center">
                            <div class="text-[#e8e8ec] font-semibold mb-1">Shopify</div>
                            <div class="text-[10px] font-mono text-[#6b6b78]">COMMERCE</div>
                        </div>
                        <div class="terminal-panel p-5 flex flex-col items-center justify-center text-center">
                            <div class="text-[#e8e8ec] font-semibold mb-1">X / Twitter</div>
                            <div class="text-[10px] font-mono text-[#6b6b78]">ENGAGEMENT</div>
                        </div>
                        <div class="terminal-panel p-5 flex flex-col items-center justify-center text-center">
                            <div class="text-[#e8e8ec] font-semibold mb-1">GitHub</div>
                            <div class="text-[10px] font-mono text-[#6b6b78]">COMMITS</div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- FINAL CTA -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-16 md:py-24 relative">
                <div class="max-w-3xl mx-auto px-6 md:px-8 text-center">
                    <h2 class="text-2xl md:text-3xl font-bold text-[#e8e8ec] mb-4" 
                        style="font-family: 'IBM Plex Sans', sans-serif;">
                        READY TO EXECUTE?
                    </h2>
                    <p class="text-[#6b6b78] mb-8 max-w-lg mx-auto">
                        Create an immutable commitment. Lock capital. Let the data decide.
                    </p>
                    <button onclick="window.app.handleInitiate()" 
                        class="bg-[#921818] hover:bg-[#751212] text-white text-xs font-semibold uppercase tracking-widest px-10 py-4 transition-all">
                        INITIATE CONTRACT
                    </button>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- FOOTER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <footer class="border-t border-[#1e1e24] py-8">
                <div class="max-w-[1200px] mx-auto px-6 md:px-8">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-[#6b6b78]">
                        <div>
                            <span class="text-[#e8e8ec]">COLLATERAL</span>
                            <span class="mx-2">·</span>
                            <span>ENFORCEMENT PROTOCOL</span>
                        </div>
                        <div class="flex gap-6">
                            <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="hover:text-[#e8e8ec] transition-colors">LEDGER</a>
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="hover:text-[#e8e8ec] transition-colors">DOCS</a>
                            <a href="#" class="hover:text-[#e8e8ec] transition-colors">TERMS</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    `;
}


export function initOverview() {
    console.log('[Overview] Terminal interface initialized');

    if (window.lucide) {
        window.lucide.createIcons();
    }
}
