// Overview View - Institutional Homepage
export function renderOverview() {
    return `
        <div class="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 relative z-10 min-h-screen">
            <main id="view-landing" class="view-section flex flex-col opacity-0 animate-activate">
                
                <!-- 1. HERO -->
                <section class="pt-12 md:pt-20 pb-14 md:pb-16 border-b border-[#E5E7EB]">
                    <h1 class="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.0] tracking-tight text-[#0A0A0A] mb-5">
                        Lock Capital.<br>
                        Verify Performance.<br>
                        <span class="text-[#B22222]">Settle Outcomes.</span>
                    </h1>
                    <p class="font-sans text-base md:text-lg text-[#4B5563] max-w-lg mb-8">
                        Performance contracts with economic enforcement. Capital locked until verified outcomes determine settlement.
                    </p>
                    <div class="flex flex-col sm:flex-row items-start gap-4">
                        <button onclick="window.app.handleInitiate()" class="h-14 px-10 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white text-sm font-semibold uppercase tracking-wide flex items-center justify-center gap-3 transition-colors">
                            <span>Commit Capital</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="h-14 px-10 border-2 border-[#E5E7EB] bg-white text-[#0A0A0A] text-sm font-medium flex items-center justify-center hover:border-[#0A0A0A] transition-colors">
                            View Ledger
                        </a>
                    </div>
                </section>

                <!-- 2. MECHANISM -->
                <section class="py-12 md:py-16 border-b border-[#E5E7EB]">
                    <h2 class="font-display font-bold text-lg md:text-xl text-[#0A0A0A] mb-8 uppercase tracking-wide">Mechanism</h2>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                        <div class="p-5 md:p-6 border-2 border-[#E5E7EB] bg-[#FAFAFA]">
                            <span class="font-mono text-lg md:text-xl text-[#B22222] font-bold block mb-2">01</span>
                            <p class="font-sans text-sm text-[#0A0A0A] font-semibold mb-1">Set baseline</p>
                            <p class="font-mono text-xs text-[#6B7280]">Revenue, commits, metrics</p>
                        </div>
                        <div class="p-5 md:p-6 border-2 border-[#E5E7EB] bg-[#FAFAFA]">
                            <span class="font-mono text-lg md:text-xl text-[#B22222] font-bold block mb-2">02</span>
                            <p class="font-sans text-sm text-[#0A0A0A] font-semibold mb-1">Lock capital</p>
                            <p class="font-mono text-xs text-[#6B7280]">$100 – $10,000</p>
                        </div>
                        <div class="p-5 md:p-6 border-2 border-[#E5E7EB] bg-[#FAFAFA]">
                            <span class="font-mono text-lg md:text-xl text-[#B22222] font-bold block mb-2">03</span>
                            <p class="font-sans text-sm text-[#0A0A0A] font-semibold mb-1">Verify performance</p>
                            <p class="font-mono text-xs text-[#6B7280]">Platform integration</p>
                        </div>
                        <div class="p-5 md:p-6 border-2 border-[#E5E7EB] bg-[#FAFAFA]">
                            <span class="font-mono text-lg md:text-xl text-[#B22222] font-bold block mb-2">04</span>
                            <p class="font-sans text-sm text-[#0A0A0A] font-semibold mb-1">Settle contract</p>
                            <p class="font-mono text-xs text-[#6B7280]">Paid or forfeited</p>
                        </div>
                    </div>
                </section>

                <!-- 3. ECONOMIC REALITY -->
                <section class="py-12 md:py-16 border-b border-[#E5E7EB]">
                    <h2 class="font-display font-bold text-lg md:text-xl text-[#0A0A0A] mb-8 uppercase tracking-wide">Economic Reality</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <div>
                            <p class="font-sans text-sm text-[#0A0A0A] font-semibold mb-2">Promises have no cost</p>
                            <p class="font-sans text-sm text-[#6B7280] leading-relaxed">Without capital at risk, commitments are noise.</p>
                        </div>
                        <div>
                            <p class="font-sans text-sm text-[#0A0A0A] font-semibold mb-2">Consequences enforce</p>
                            <p class="font-sans text-sm text-[#6B7280] leading-relaxed">Loss aversion drives follow-through. Forfeiture is real.</p>
                        </div>
                        <div>
                            <p class="font-sans text-sm text-[#0A0A0A] font-semibold mb-2">Zero-sum settlement</p>
                            <p class="font-sans text-sm text-[#6B7280] leading-relaxed">Winners paid from losers. No external subsidy.</p>
                        </div>
                    </div>
                </section>

                <!-- 4. VERIFICATION LAYER -->
                <section class="py-12 md:py-16 border-b border-[#E5E7EB]">
                    <h2 class="font-display font-bold text-lg md:text-xl text-[#0A0A0A] mb-8 uppercase tracking-wide">Verification</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#0A0A0A]">
                        <div class="p-5 md:p-6 bg-white">
                            <span class="font-mono text-sm text-[#0A0A0A] font-bold block mb-1">STRIPE</span>
                            <span class="font-mono text-xs text-[#6B7280]">Revenue</span>
                        </div>
                        <div class="p-5 md:p-6 bg-white">
                            <span class="font-mono text-sm text-[#0A0A0A] font-bold block mb-1">GITHUB</span>
                            <span class="font-mono text-xs text-[#6B7280]">Commits</span>
                        </div>
                        <div class="p-5 md:p-6 bg-white">
                            <span class="font-mono text-sm text-[#0A0A0A] font-bold block mb-1">X</span>
                            <span class="font-mono text-xs text-[#6B7280]">Metrics</span>
                        </div>
                        <div class="p-5 md:p-6 bg-white">
                            <span class="font-mono text-sm text-[#6B7280] font-bold block mb-1">MORE</span>
                            <span class="font-mono text-xs text-[#6B7280]">Pending</span>
                        </div>
                    </div>
                    <p class="font-mono text-xs text-[#6B7280] mt-4 uppercase tracking-wider">Objective only • Immutable records • No social layer</p>
                </section>

                <!-- 5. PAYOUT STRUCTURE -->
                <section class="py-12 md:py-16 border-b border-[#E5E7EB]">
                    <h2 class="font-display font-bold text-lg md:text-xl text-[#0A0A0A] mb-8 uppercase tracking-wide">Settlement</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
                        <div class="p-6 md:p-8 border-l-4 border-[#059669] bg-[#F8FAF9]">
                            <span class="font-mono text-sm text-[#059669] font-bold block mb-3">SUCCESS</span>
                            <p class="font-sans text-sm text-[#0A0A0A] font-medium">Capital returned + pool share</p>
                            <p class="font-mono text-xs text-[#6B7280] mt-2">1.2x – 2.5x+ multiplier</p>
                        </div>
                        <div class="p-6 md:p-8 border-l-4 border-[#B22222] bg-[#FDF8F8]">
                            <span class="font-mono text-sm text-[#B22222] font-bold block mb-3">FAILURE</span>
                            <p class="font-sans text-sm text-[#0A0A0A] font-medium">Capital forfeited. No appeals.</p>
                            <p class="font-mono text-xs text-[#6B7280] mt-2">Settlement is final</p>
                        </div>
                    </div>
                </section>

                <!-- 6. FINAL CTA -->
                <section class="py-14 md:py-20">
                    <h2 class="font-display font-bold text-2xl md:text-4xl text-[#0A0A0A] leading-[1.1] mb-4">
                        Capital at risk.<br>
                        <span class="text-[#B22222]">Outcomes enforced.</span>
                    </h2>
                    <p class="font-sans text-sm text-[#6B7280] mb-6 max-w-md">
                        Serious users only.
                    </p>
                    <button onclick="window.app.handleInitiate()" class="h-14 px-12 bg-[#B22222] hover:bg-[#8B1A1A] text-white text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-3 transition-colors">
                        <span>Lock Position</span>
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </section>

                <!-- FOOTER -->
                <footer class="py-6 border-t border-[#E5E7EB]">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-[#059669] rounded-full"></div>
                            <span class="font-mono text-xs text-[#6B7280] uppercase tracking-wider">Operational</span>
                        </div>
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="font-mono text-xs text-[#0A0A0A] font-medium hover:text-[#B22222] transition-colors uppercase tracking-wider">
                            Public Ledger →
                        </a>
                    </div>
                </footer>
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
