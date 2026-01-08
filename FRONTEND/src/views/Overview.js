// Overview View - Content from overview.html
export function renderOverview() {
    return `
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen flex flex-col">
            <main id="view-landing" class="view-section flex flex-col items-start opacity-0 animate-activate">
                <div class="w-full mt-12 relative">
                    <div class="absolute -left-4 top-0 bottom-0 w-[1px] bg-[#D9DBE1] hidden md:block"></div>
                    
                    <div class="relative">
                        <h1 class="font-display font-normal text-5xl md:text-7xl leading-[0.9] tracking-tight text-[#0E0E11] mb-6 max-w-3xl">
                            YOU ARE BETTING <br>
                            <span class="text-[#921818] font-medium tracking-tighter">ON YOURSELF.</span>
                        </h1>
                    </div>

                    <div class="flex flex-col md:flex-row gap-12 items-start max-w-4xl">
                        <div class="flex flex-col gap-5 max-w-lg">
                            <p class="font-sans text-sm font-medium text-[#4D5057] leading-snug tracking-tight bg-[rgba(161,130,57,0.06)] px-3 py-2 -ml-3 border-l-2 border-[#A18239]/50 w-fit">
                                Unlock up to <span class="text-[#A18239] font-semibold">2.5x</span> if you deliver—funded by those who don't.
                            </p>

                            <p class="font-sans text-lg text-[#6B6E76] leading-relaxed tracking-tight">
                                Set a target that forces action. Your profit only unlocks if you follow through.
                            </p>
                            
                            <p class="font-sans text-sm text-[#6B6E76]/80 leading-relaxed pl-1">
                                Lock $500 against shipping a feature or generating revenue — verified automatically.
                            </p>
                        </div>

                        <div class="flex flex-col gap-4 w-full md:w-auto mt-4">
                            <div class="flex items-center gap-3">
                                <button onclick="window.app.handleInitiate()" class="group h-12 px-6 bg-[#921818] hover:bg-[#751212] text-white text-xs font-medium uppercase tracking-widest rounded-[2px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm">
                                    <span>Execute Contract</span>
                                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"></i>
                                </button>
                                <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="h-12 px-6 border border-[#D9DBE1] bg-white text-[#6B6E76] text-xs font-medium uppercase tracking-widest rounded-[2px] flex items-center justify-center hover:border-[#B0B2B8] hover:text-[#0E0E11] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                    See Live Contracts
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full mt-24 max-w-2xl">
                     <p class="font-display font-normal text-lg text-[#6B6E76] italic">"Most people underestimate how motivating locked capital is."</p>
                </div>

                <!-- RISK PROFILE SECTION -->
                <div class="w-full mt-16">
                    <h2 class="font-display font-semibold text-lg uppercase tracking-tight text-[#921818] mb-8">Choose Your Risk Profile</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="p-6 border border-[#D9DBE1] bg-white rounded-[2px] flex flex-col h-full group transition-all duration-200 hover:border-[#B0B2B8]">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-mono text-xs font-medium uppercase tracking-wider text-[#0E0E11]">Steady</h3>
                                <span class="font-mono text-[10px] font-medium text-[#6B6E76] bg-[#F0F0F0] px-1.5 py-0.5 rounded-[1px] border border-[#D9DBE1]">UP TO 1.6X</span>
                            </div>
                            <p class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest mb-4">Higher probability</p>
                            
                            <div class="flex-grow flex flex-col gap-1">
                                <p class="text-sm text-[#6B6E76] leading-relaxed">Designed to be achievable.</p>
                                <p class="text-sm text-[#6B6E76] leading-relaxed">Most contracts here succeed.</p>
                                <p class="text-sm text-[#6B6E76] leading-relaxed">Returns feel fair.</p>
                            </div>
                        </div>

                        <div class="p-6 border-2 border-[#0E0E11] bg-[#FBFBFA] rounded-[2px] flex flex-col h-full shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative z-10">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-mono text-xs font-medium uppercase tracking-wider text-[#0E0E11]">Bold</h3>
                                <span class="font-mono text-[10px] font-medium text-[#0E0E11] bg-[#D9DBE1]/30 px-1.5 py-0.5 rounded-[1px] border border-[#D9DBE1]">UP TO 2X</span>
                            </div>
                            <p class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest mb-4">Balanced risk</p>

                            <div class="flex-grow flex flex-col gap-1">
                                <p class="text-sm text-[#0E0E11] leading-relaxed font-medium">Assumes you outperform baseline.</p>
                                <p class="text-sm text-[#0E0E11] leading-relaxed">Many fail.</p>
                                <p class="text-sm text-[#0E0E11] leading-relaxed">Winners changed something real.</p>
                            </div>
                            
                            <div class="mt-4 pt-4 border-t border-[#D9DBE1] flex items-center gap-2">
                                 <div class="w-1.5 h-1.5 bg-[#0E0E11] rounded-full"></div>
                                 <span class="font-mono text-[9px] uppercase tracking-widest text-[#0E0E11]">Selected Strategy</span>
                            </div>
                        </div>

                        <div class="p-6 border border-[#D9DBE1] bg-white rounded-[2px] flex flex-col h-full group transition-all duration-200 hover:border-[#B0B2B8]">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-mono text-xs font-medium uppercase tracking-wider text-[#0E0E11]">All In</h3>
                                <span class="font-mono text-[10px] font-bold text-[#A18239] bg-[rgba(161,130,57,0.06)] px-1.5 py-0.5 rounded-[1px] border border-[#A18239]/20">2.5X+ REWARD</span>
                            </div>
                            <p class="font-mono text-[10px] text-[#A18239] uppercase tracking-widest mb-4">Low probability</p>

                            <div class="flex-grow flex flex-col gap-1">
                                <p class="text-sm text-[#6B6E76] leading-relaxed">Not a stretch goal.</p>
                                <p class="text-sm text-[#6B6E76] leading-relaxed">A declaration.</p>
                                <p class="text-sm text-[#6B6E76] leading-relaxed">Failure is the expected outcome.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Live Market Activity -->
                    <div class="w-full border-t border-b border-[#D9DBE1] py-4 mb-4 bg-white">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div class="flex items-center gap-2 flex-shrink-0">
                                <div class="relative w-2 h-2">
                                    <div class="relative w-2 h-2 bg-[#1F7A4D] rounded-full"></div>
                                </div>
                                <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76]">Market Live: <span class="text-[#0E0E11] font-medium">127 Active Contracts</span></span>
                            </div>
                            
                            <div class="hidden md:block h-3 w-px bg-[#D9DBE1] flex-shrink-0"></div>
                            
                            <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76] flex-shrink-0">$412,000 Total Value Locked</span>
                            
                            <div class="hidden md:block h-3 w-px bg-[#D9DBE1] flex-shrink-0"></div>
                            
                            <div class="flex items-center gap-2 overflow-hidden h-5 w-full max-w-[320px] relative">
                                <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76] whitespace-nowrap flex-shrink-0 z-10 bg-white pr-1">Recent Win:</span>
                                <div class="relative h-full w-full overflow-hidden">
                                    <div id="ticker-track" class="absolute top-0 left-0 w-full flex flex-col gap-0 transition-transform duration-500 ease-in-out">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <p class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest leading-relaxed mt-4">
                        Collateral does not recommend difficulty. Users self-select.
                    </p>
                </div>

                <!-- WHAT CAN BE VERIFIED SECTION -->
                <div class="w-full mt-24 max-w-4xl">
                     <h2 class="font-display font-semibold text-lg uppercase tracking-tight text-[#921818] mb-2">What Can Be Verified</h2>
                     <div class="w-full h-px bg-[#D9DBE1] mb-8"></div>
                     
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                        <div class="flex flex-col">
                            <h3 class="font-mono text-xs font-medium uppercase tracking-wider text-[#0E0E11] mb-4">Public Signals</h3>
                            <ul class="flex flex-col gap-1.5 mb-4">
                                <li class="font-sans text-sm text-[#6B6E76]">X / Twitter</li>
                                <li class="font-sans text-sm text-[#6B6E76]">GitHub</li>
                                <li class="font-sans text-sm text-[#6B6E76]">Other public platforms</li>
                            </ul>
                            <p class="font-sans text-xs text-[#6B6E76]/70">
                                Publicly observable. Reputation at stake.
                            </p>
                        </div>

                        <div class="flex flex-col">
                            <h3 class="font-mono text-xs font-medium uppercase tracking-wider text-[#0E0E11] mb-4">Economic Signals</h3>
                            <ul class="flex flex-col gap-1.5 mb-4">
                                <li class="font-sans text-sm text-[#6B6E76]">Stripe</li>
                                <li class="font-sans text-sm text-[#6B6E76]">Revenue sources</li>
                            </ul>
                            <p class="font-sans text-xs text-[#6B6E76]/70">
                                No vanity. Money settles truth.
                            </p>
                        </div>
                     </div>
                </div>

                <!-- EXECUTION MODEL SECTION -->
                <div class="w-full mt-24 max-w-4xl">
                    <h2 class="font-display font-semibold text-lg uppercase tracking-tight text-[#921818] mb-2">Execution Model</h2>
                    <div class="w-full h-px bg-[#921818]/20 mb-8"></div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                        <div class="flex flex-col">
                            <p class="font-sans text-sm font-medium text-[#0E0E11] mb-6 leading-relaxed">
                                Capital is committed at execution.<br>Funds are inaccessible until verification.
                            </p>
                            
                            <p class="font-sans text-sm text-[#6B6E76] leading-relaxed mb-6">
                                Outcomes are final.
                            </p>
                            
                            <div class="w-full h-px bg-[#D9DBE1] mb-6"></div>
                        </div>

                        <div class="flex flex-col gap-8">
                            <div>
                                <h3 class="font-display font-medium text-sm text-[#0E0E11] uppercase tracking-wide mb-3">On Success</h3>
                                <ul class="flex flex-col gap-1 mb-2">
                                    <li class="font-sans text-sm text-[#6B6E76]">Capital released.</li>
                                    <li class="font-sans text-sm text-[#6B6E76]">Incentives settled automatically.</li>
                                </ul>
                            </div>

                            <div class="pl-4 border-l border-[#921818]">
                                <h3 class="font-display font-medium text-sm text-[#0E0E11] uppercase tracking-wide mb-2">On Failure</h3>
                                <p class="font-sans text-sm text-[#0E0E11] mb-2">
                                    Capital forfeited.
                                </p>
                                <p class="font-sans text-sm text-[#0E0E11]">
                                    No recovery possible.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-8 pt-6 border-t border-[#D9DBE1]">
                        <p class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest leading-relaxed">
                            External systems decide outcomes. Collateral does not arbitrate.
                        </p>
                    </div>
                </div>
                
                <div class="w-full mt-32 mb-8 text-center">
                    <p class="font-sans text-sm text-[#6B6E76]">Contracts are enforced by external data sources, not internal discretion.</p>
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
