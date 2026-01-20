// Overview View - Institutional Homepage
export function renderOverview() {
    return `
        <div class="pb-16 md:pb-24 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10 min-h-screen flex flex-col">
            <main id="view-landing" class="view-section flex flex-col items-start opacity-0 animate-activate">
                
                <!-- HERO -->
                <div class="w-full mt-10 md:mt-20 flex">
                    <div class="w-[3px] md:w-[4px] bg-[#921818] mr-4 md:mr-8 flex-shrink-0"></div>
                    <div class="flex-1">
                        <h1 class="font-display font-medium text-3xl md:text-6xl lg:text-7xl leading-[0.92] tracking-tight text-[#0E0E11] mb-3 md:mb-6">
                            CAPITAL<br>
                            <span class="text-[#921818]">LOCKED.</span>
                        </h1>
                        <p class="font-mono text-[10px] md:text-[13px] text-[#6B6E76] uppercase tracking-widest max-w-xl mb-4 md:mb-8">
                            Lock capital. Verify outcome. Settle.
                        </p>
                        
                        <!-- SYSTEM STATUS -->
                        <div class="flex items-center gap-2 md:gap-4 mb-6 md:mb-10 flex-wrap">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 bg-[#1F7A4D] rounded-full"></div>
                                <span class="font-mono text-[9px] md:text-[11px] uppercase tracking-widest text-[#0E0E11]">OPERATIONAL</span>
                            </div>
                            <span class="font-mono text-[9px] md:text-[11px] text-[#6B6E76]">•</span>
                            <span class="font-mono text-[9px] md:text-[11px] uppercase tracking-widest text-[#6B6E76]"><span class="text-[#0E0E11]">127</span> ACTIVE</span>
                            <span class="font-mono text-[9px] md:text-[11px] text-[#6B6E76]">•</span>
                            <span class="font-mono text-[9px] md:text-[11px] uppercase tracking-widest text-[#6B6E76]"><span class="text-[#0E0E11]">$412,888</span> TVL</span>
                        </div>
                        
                        <!-- CTA -->
                        <div class="flex flex-col items-start gap-2">
                            <button onclick="window.app.handleInitiate()" class="h-11 md:h-14 px-6 md:px-10 bg-[#921818] hover:bg-[#751212] text-white text-[11px] md:text-[13px] font-medium uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                                <span>Execute</span>
                                <i data-lucide="arrow-right" class="w-3.5 h-3.5 md:w-4 md:h-4"></i>
                            </button>
                            <p class="font-mono text-[8px] md:text-[10px] text-[#6B6E76] uppercase tracking-widest">
                                Binding. Final.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- I. CLASSIFICATION -->
                <div class="w-full mt-12 md:mt-20">
                    <div class="flex items-center gap-3 mb-4 md:mb-6">
                        <span class="font-mono text-[11px] md:text-[13px] text-[#921818] font-medium">I.</span>
                        <h2 class="font-mono text-[11px] md:text-[13px] text-[#0E0E11] uppercase tracking-widest font-medium">Classification</h2>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D9DBE1] border border-[#D9DBE1]">
                        <div class="p-4 md:p-6 lg:p-8 bg-white">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-mono text-[10px] md:text-[12px] font-medium uppercase tracking-widest text-[#0E0E11]">Conservative</span>
                                <span class="font-mono text-[10px] md:text-[12px] text-[#6B6E76]">≤1.6X</span>
                            </div>
                            <p class="font-mono text-[9px] md:text-[11px] text-[#6B6E76]">High completion.<br>Capital preservation.</p>
                        </div>
                        
                        <div class="p-4 md:p-6 lg:p-8 bg-[#FAFAFA] border-l border-r border-[#0E0E11]">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-mono text-[10px] md:text-[12px] font-medium uppercase tracking-widest text-[#0E0E11]">Standard</span>
                                <span class="font-mono text-[10px] md:text-[12px] text-[#0E0E11] font-medium">≤2.0X</span>
                            </div>
                            <p class="font-mono text-[9px] md:text-[11px] text-[#0E0E11]">Default class.<br>Expected variance.</p>
                        </div>
                        
                        <div class="p-4 md:p-6 lg:p-8 bg-white">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-mono text-[10px] md:text-[12px] font-medium uppercase tracking-widest text-[#0E0E11]">Aggressive</span>
                                <span class="font-mono text-[10px] md:text-[12px] text-[#A18239] font-medium">2.5X+</span>
                            </div>
                            <p class="font-mono text-[9px] md:text-[11px] text-[#6B6E76]">Low completion.<br>Maximum forfeiture.</p>
                        </div>
                    </div>
                </div>

                <!-- II. VERIFICATION -->
                <div class="w-full mt-10 md:mt-16">
                    <div class="flex items-center gap-3 mb-4 md:mb-6">
                        <span class="font-mono text-[11px] md:text-[13px] text-[#921818] font-medium">II.</span>
                        <h2 class="font-mono text-[11px] md:text-[13px] text-[#0E0E11] uppercase tracking-widest font-medium">Verification</h2>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D9DBE1] border border-[#D9DBE1]">
                        <div class="p-3 md:p-5 lg:p-6 bg-white">
                            <span class="font-mono text-[10px] md:text-[12px] text-[#0E0E11] uppercase tracking-widest font-medium">X</span>
                            <p class="font-mono text-[9px] md:text-[11px] text-[#6B6E76] mt-1.5">Public metrics.</p>
                        </div>
                        <div class="p-3 md:p-5 lg:p-6 bg-white">
                            <span class="font-mono text-[10px] md:text-[12px] text-[#0E0E11] uppercase tracking-widest font-medium">GitHub</span>
                            <p class="font-mono text-[9px] md:text-[11px] text-[#6B6E76] mt-1.5">Commits. Releases.</p>
                        </div>
                        <div class="p-3 md:p-5 lg:p-6 bg-white">
                            <span class="font-mono text-[10px] md:text-[12px] text-[#0E0E11] uppercase tracking-widest font-medium">Stripe</span>
                            <p class="font-mono text-[9px] md:text-[11px] text-[#6B6E76] mt-1.5">Revenue thresholds.</p>
                        </div>
                        <div class="p-3 md:p-5 lg:p-6 bg-white">
                            <span class="font-mono text-[10px] md:text-[12px] text-[#6B6E76] uppercase tracking-widest">+</span>
                            <p class="font-mono text-[9px] md:text-[11px] text-[#6B6E76] mt-1.5">Pending.</p>
                        </div>
                    </div>
                    
                    <p class="font-mono text-[8px] md:text-[10px] text-[#6B6E76] uppercase tracking-widest mt-3">
                        No discretion.
                    </p>
                </div>

                <!-- III. SETTLEMENT -->
                <div class="w-full mt-10 md:mt-16">
                    <div class="flex items-center gap-3 mb-4 md:mb-6">
                        <span class="font-mono text-[11px] md:text-[13px] text-[#921818] font-medium">III.</span>
                        <h2 class="font-mono text-[11px] md:text-[13px] text-[#0E0E11] uppercase tracking-widest font-medium">Settlement</h2>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#D9DBE1] border border-[#D9DBE1]">
                        <div class="p-4 md:p-6 lg:p-8 bg-white border-l-2 border-[#1F7A4D]">
                            <span class="font-mono text-[10px] md:text-[12px] text-[#1F7A4D] uppercase tracking-widest font-medium">Success</span>
                            <p class="font-mono text-[9px] md:text-[11px] text-[#6B6E76] mt-2">Capital released.<br>Incentives paid.</p>
                        </div>
                        <div class="p-4 md:p-6 lg:p-8 bg-white border-l-2 border-[#921818]">
                            <span class="font-mono text-[10px] md:text-[12px] text-[#921818] uppercase tracking-widest font-medium">Failure</span>
                            <p class="font-mono text-[9px] md:text-[11px] text-[#6B6E76] mt-2">Capital forfeited.<br>No appeals.</p>
                        </div>
                    </div>
                </div>

                <!-- FOOTER -->
                <div class="w-full mt-12 md:mt-20 pt-6 border-t border-[#D9DBE1]">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p class="font-mono text-[8px] md:text-[10px] text-[#6B6E76] uppercase tracking-widest">
                            Public settlement. Permanent record.
                        </p>
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="font-mono text-[8px] md:text-[10px] text-[#0E0E11] uppercase tracking-widest hover:text-[#921818] transition-colors">
                            Ledger →
                        </a>
                    </div>
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
