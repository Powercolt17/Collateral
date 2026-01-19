// Overview View - Institutional Homepage
export function renderOverview() {
    return `
        <div class="pb-24 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen flex flex-col">
            <main id="view-landing" class="view-section flex flex-col items-start opacity-0 animate-activate">
                
                <!-- HERO -->
                <div class="w-full mt-16">
                    <h1 class="font-display font-medium text-4xl md:text-5xl leading-[0.95] tracking-tight text-[#0E0E11] mb-4">
                        PERFORMANCE-BACKED<br>
                        <span class="text-[#921818]">CAPITAL COMMITMENT.</span>
                    </h1>
                    <p class="font-mono text-[11px] text-[#6B6E76] uppercase tracking-widest max-w-lg mb-6">
                        Capital is locked at execution. Released only upon objective verification.
                    </p>
                    
                    <!-- INLINE STATS -->
                    <div class="flex items-center gap-3 mb-8 flex-wrap">
                        <div class="flex items-center gap-2">
                            <div class="w-1.5 h-1.5 bg-[#1F7A4D] rounded-full"></div>
                            <span class="font-mono text-[10px] uppercase tracking-widest text-[#0E0E11] font-medium">LIVE</span>
                        </div>
                        <span class="font-mono text-[10px] text-[#6B6E76]">•</span>
                        <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76]"><span class="text-[#0E0E11] font-medium">127</span> ACTIVE CONTRACTS</span>
                        <span class="font-mono text-[10px] text-[#6B6E76]">•</span>
                        <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76]"><span class="text-[#0E0E11] font-medium">$412,888</span> TVL</span>
                        <span class="font-mono text-[10px] text-[#6B6E76] hidden md:inline">•</span>
                        <span class="font-mono text-[10px] uppercase tracking-widest text-[#1F7A4D] hidden md:inline">MAINNET OPERATIONAL</span>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <button onclick="window.app.handleInitiate()" class="h-11 px-6 bg-[#921818] hover:bg-[#751212] text-white text-[11px] font-medium uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                            <span>Execute Contract</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </button>
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="h-11 px-6 border border-[#D9DBE1] bg-white text-[#6B6E76] text-[11px] font-medium uppercase tracking-widest flex items-center justify-center hover:border-[#0E0E11] hover:text-[#0E0E11] transition-colors">
                            Public Ledger
                        </a>
                    </div>
                </div>

                <!-- HAIRLINE -->
                <div class="w-full h-px bg-[#0E0E11]/5 mt-14"></div>

                <!-- CONTRACT CLASS -->
                <div class="w-full mt-10">
                    <h2 class="font-mono text-[10px] text-[#0E0E11] uppercase tracking-widest font-medium mb-5">Contract Class</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D9DBE1] border border-[#D9DBE1]">
                        <div class="p-5 bg-white">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-mono text-[10px] font-medium uppercase tracking-widest text-[#0E0E11]">Class A — Conservative</span>
                                <span class="font-mono text-[10px] text-[#6B6E76]">≤1.6X</span>
                            </div>
                            <p class="font-mono text-[9px] text-[#6B6E76] leading-relaxed">High completion probability.<br>Lower return multiple.<br>Designed for capital preservation.</p>
                        </div>
                        
                        <div class="p-5 bg-[#FAFAFA] border-l border-r border-[#0E0E11]">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-mono text-[10px] font-medium uppercase tracking-widest text-[#0E0E11]">Class B — Standard</span>
                                <span class="font-mono text-[10px] text-[#0E0E11] font-medium">≤2.0X</span>
                            </div>
                            <p class="font-mono text-[9px] text-[#0E0E11] leading-relaxed">Balanced risk profile.<br>Default execution class.<br>Expected variance.</p>
                        </div>
                        
                        <div class="p-5 bg-white">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-mono text-[10px] font-medium uppercase tracking-widest text-[#0E0E11]">Class C — Aggressive</span>
                                <span class="font-mono text-[10px] text-[#A18239] font-medium">2.5X+</span>
                            </div>
                            <p class="font-mono text-[9px] text-[#6B6E76] leading-relaxed">Low completion probability.<br>Maximum forfeiture exposure.<br>Designed for asymmetric outcomes.</p>
                        </div>
                    </div>
                </div>

                <!-- HAIRLINE -->
                <div class="w-full h-px bg-[#0E0E11]/5 mt-10"></div>

                <!-- DETERMINISTIC VERIFICATION SOURCES -->
                <div class="w-full mt-10">
                    <h2 class="font-mono text-[10px] text-[#0E0E11] uppercase tracking-widest font-medium mb-5">Deterministic Verification Sources</h2>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D9DBE1] border border-[#D9DBE1]">
                        <div class="p-4 bg-white">
                            <span class="font-mono text-[10px] text-[#0E0E11] uppercase tracking-widest font-medium">X / Twitter</span>
                            <p class="font-mono text-[9px] text-[#6B6E76] mt-1.5 leading-relaxed">Public metrics only.<br>No private data.</p>
                        </div>
                        <div class="p-4 bg-white">
                            <span class="font-mono text-[10px] text-[#0E0E11] uppercase tracking-widest font-medium">GitHub</span>
                            <p class="font-mono text-[9px] text-[#6B6E76] mt-1.5 leading-relaxed">Commits and releases.<br>No subjective review.</p>
                        </div>
                        <div class="p-4 bg-white">
                            <span class="font-mono text-[10px] text-[#0E0E11] uppercase tracking-widest font-medium">Stripe</span>
                            <p class="font-mono text-[9px] text-[#6B6E76] mt-1.5 leading-relaxed">Net revenue thresholds.<br>Gross manipulation excluded.</p>
                        </div>
                        <div class="p-4 bg-white">
                            <span class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest">Additional</span>
                            <p class="font-mono text-[9px] text-[#6B6E76] mt-1.5">Coming soon.</p>
                        </div>
                    </div>
                </div>

                <!-- HAIRLINE -->
                <div class="w-full h-px bg-[#0E0E11]/5 mt-10"></div>

                <!-- SETTLEMENT IS FINAL -->
                <div class="w-full mt-10">
                    <h2 class="font-mono text-[10px] text-[#0E0E11] uppercase tracking-widest font-medium mb-5">Settlement Is Final</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#D9DBE1] border border-[#D9DBE1]">
                        <div class="p-5 bg-white">
                            <span class="font-mono text-[10px] text-[#1F7A4D] uppercase tracking-widest font-medium">On Success</span>
                            <p class="font-mono text-[9px] text-[#6B6E76] leading-relaxed mt-2">Capital released.<br>Incentives paid automatically.<br>No discretionary approval.</p>
                        </div>
                        <div class="p-5 bg-white border-l-2 border-[#921818]">
                            <span class="font-mono text-[10px] text-[#921818] uppercase tracking-widest font-medium">On Failure</span>
                            <p class="font-mono text-[9px] text-[#6B6E76] leading-relaxed mt-2">Capital forfeited.<br>No recovery.<br>No appeals.</p>
                        </div>
                    </div>
                    
                    <p class="font-mono text-[9px] text-[#6B6E76] uppercase tracking-widest mt-4">
                        Outcomes determined by external data. Collateral does not arbitrate.
                    </p>
                </div>

                <!-- FOOTER -->
                <div class="w-full mt-14 pt-6 border-t border-[#D9DBE1]/50">
                    <p class="font-mono text-[9px] text-[#6B6E76] uppercase tracking-widest text-center">
                        All contracts settle publicly. Records are immutable.
                    </p>
                </div>
            </main>
        </div>
    `;
}

export function initOverview() {
    // Initialize ticker
    const track = document.getElementById('ticker-track');
    if (!track) return;

    const winners = [
        { user: "@alex_ship", val1: "$1K", val2: "$2.5K" },
        { user: "@sarah_dev", val1: "$500", val2: "$1.2K" },
        { user: "@david_builds", val1: "$2K", val2: "$5.2K" },
        { user: "@jason_v1", val1: "$100", val2: "$250" },
        { user: "@emma_scale", val1: "$5K", val2: "$12.5K" }
    ];

    const createItem = (w) => `
        <span class="font-mono text-[10px] text-[#2A523E] bg-[#F4F5F4] px-2 py-0.5 rounded-[1px] h-5 flex items-center w-fit whitespace-nowrap">
            ${w.user} turned ${w.val1} → ${w.val2}
        </span>`;

    track.innerHTML = "";
    winners.forEach(w => track.innerHTML += createItem(w));

    setInterval(() => {
        const itemHeight = 20;
        track.style.transition = 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform = `translateY(-${itemHeight}px)`;

        setTimeout(() => {
            track.style.transition = 'none';
            track.appendChild(track.firstElementChild);
            track.style.transform = 'translateY(0)';

            if (Math.random() > 0.7) {
                const newAmount = Math.floor(Math.random() * 50) * 100;
                const multiplier = (1.5 + Math.random()).toFixed(1);
                const newWin = {
                    user: `@user_${Math.floor(Math.random() * 900) + 100}`,
                    val1: `$${newAmount}`,
                    val2: `$${Math.floor(newAmount * multiplier)}`
                };
                const div = document.createElement('div');
                div.innerHTML = createItem(newWin);
                track.appendChild(div.firstElementChild);
            }
        }, 500);

    }, 3000);

    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
