// Overview View - Institutional Homepage
export function renderOverview() {
    return `
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen flex flex-col">
            <main id="view-landing" class="view-section flex flex-col items-start opacity-0 animate-activate">
                
                <!-- MARKET STATUS BAR -->
                <div class="w-full mt-8 border border-[#D9DBE1] bg-white">
                    <div class="flex flex-col md:flex-row md:items-center justify-between py-3 px-4 gap-3">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 bg-[#1F7A4D] rounded-full"></div>
                                <span class="font-mono text-[10px] uppercase tracking-widest text-[#0E0E11] font-medium">LIVE</span>
                            </div>
                            <div class="h-3 w-px bg-[#D9DBE1]"></div>
                            <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76]"><span class="text-[#0E0E11]">127</span> Active Contracts</span>
                            <div class="h-3 w-px bg-[#D9DBE1] hidden md:block"></div>
                            <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76] hidden md:inline"><span class="text-[#0E0E11]">$412,000</span> TVL</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76]">Last Settlement:</span>
                            <div id="ticker-track" class="font-mono text-[10px] text-[#1F7A4D]"></div>
                        </div>
                    </div>
                </div>

                <!-- HERO -->
                <div class="w-full mt-12">
                    <h1 class="font-display font-medium text-4xl md:text-6xl leading-[0.95] tracking-tight text-[#0E0E11] mb-4">
                        CAPITAL LOCKED.<br>
                        <span class="text-[#921818]">OUTCOMES VERIFIED.</span>
                    </h1>
                    <p class="font-mono text-[11px] text-[#6B6E76] uppercase tracking-widest max-w-md mb-8">
                        Performance-backed commitment infrastructure. Capital is inaccessible until verification settles.
                    </p>
                    
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

                <!-- CONTRACT CLASS -->
                <div class="w-full mt-16">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="font-mono text-[11px] text-[#0E0E11] uppercase tracking-widest font-medium">Contract Class</h2>
                        <span class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest">Risk / Reward Structure</span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D9DBE1] border border-[#D9DBE1]">
                        <div class="p-5 bg-white">
                            <div class="flex justify-between items-start mb-3">
                                <span class="font-mono text-[10px] font-medium uppercase tracking-widest text-[#0E0E11]">Class A</span>
                                <span class="font-mono text-[10px] text-[#6B6E76]">≤1.6X</span>
                            </div>
                            <p class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest mb-3">Conservative</p>
                            <p class="text-xs text-[#6B6E76] leading-relaxed">High completion rate. Lower multiplier.</p>
                        </div>
                        
                        <div class="p-5 bg-[#FAFAFA] border-l border-r border-[#0E0E11]">
                            <div class="flex justify-between items-start mb-3">
                                <span class="font-mono text-[10px] font-medium uppercase tracking-widest text-[#0E0E11]">Class B</span>
                                <span class="font-mono text-[10px] text-[#0E0E11] font-medium">≤2.0X</span>
                            </div>
                            <p class="font-mono text-[10px] text-[#0E0E11] uppercase tracking-widest mb-3">Standard</p>
                            <p class="text-xs text-[#0E0E11] leading-relaxed">Balanced risk. Default selection.</p>
                        </div>
                        
                        <div class="p-5 bg-white">
                            <div class="flex justify-between items-start mb-3">
                                <span class="font-mono text-[10px] font-medium uppercase tracking-widest text-[#0E0E11]">Class C</span>
                                <span class="font-mono text-[10px] text-[#A18239] font-medium">2.5X+</span>
                            </div>
                            <p class="font-mono text-[10px] text-[#A18239] uppercase tracking-widest mb-3">Aggressive</p>
                            <p class="text-xs text-[#6B6E76] leading-relaxed">Low completion rate. High forfeiture.</p>
                        </div>
                    </div>
                </div>

                <!-- VERIFICATION SOURCES -->
                <div class="w-full mt-12">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="font-mono text-[11px] text-[#0E0E11] uppercase tracking-widest font-medium">Verification Sources</h2>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D9DBE1] border border-[#D9DBE1]">
                        <div class="p-4 bg-white">
                            <span class="font-mono text-[10px] text-[#0E0E11] uppercase tracking-widest">X / Twitter</span>
                            <p class="font-mono text-[9px] text-[#6B6E76] mt-1">Public posts</p>
                        </div>
                        <div class="p-4 bg-white">
                            <span class="font-mono text-[10px] text-[#0E0E11] uppercase tracking-widest">GitHub</span>
                            <p class="font-mono text-[9px] text-[#6B6E76] mt-1">Commits, releases</p>
                        </div>
                        <div class="p-4 bg-white">
                            <span class="font-mono text-[10px] text-[#0E0E11] uppercase tracking-widest">Stripe</span>
                            <p class="font-mono text-[9px] text-[#6B6E76] mt-1">Revenue thresholds</p>
                        </div>
                        <div class="p-4 bg-white">
                            <span class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest">More</span>
                            <p class="font-mono text-[9px] text-[#6B6E76] mt-1">Coming</p>
                        </div>
                    </div>
                </div>

                <!-- SETTLEMENT MODEL -->
                <div class="w-full mt-12">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="font-mono text-[11px] text-[#0E0E11] uppercase tracking-widest font-medium">Settlement</h2>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#D9DBE1] border border-[#D9DBE1]">
                        <div class="p-5 bg-white">
                            <span class="font-mono text-[10px] text-[#1F7A4D] uppercase tracking-widest font-medium">On Success</span>
                            <p class="text-xs text-[#6B6E76] leading-relaxed mt-2">Capital released. Incentive paid.</p>
                        </div>
                        <div class="p-5 bg-white border-l-2 border-[#921818]">
                            <span class="font-mono text-[10px] text-[#921818] uppercase tracking-widest font-medium">On Failure</span>
                            <p class="text-xs text-[#6B6E76] leading-relaxed mt-2">Capital forfeited. No recovery.</p>
                        </div>
                    </div>
                    
                    <p class="font-mono text-[9px] text-[#6B6E76] uppercase tracking-widest mt-4">
                        Outcomes determined by external data. Collateral does not arbitrate.
                    </p>
                </div>

                <!-- FOOTER -->
                <div class="w-full mt-16 pt-8 border-t border-[#D9DBE1]">
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
