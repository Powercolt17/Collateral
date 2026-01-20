// Overview View - Institutional Homepage
export function renderOverview() {
    return `
        <div class="w-full max-w-6xl mx-auto px-4 md:px-8 relative z-10 min-h-screen">
            <main id="view-landing" class="view-section flex flex-col opacity-0 animate-activate">
                
                <!-- 1. HERO SECTION -->
                <section class="py-16 md:py-24 border-b border-[#E5E7EB]">
                    <div class="max-w-3xl">
                        <h1 class="font-display font-semibold text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-[#0A0A0A] mb-6">
                            Lock Capital.<br>
                            Verify Performance.<br>
                            <span class="text-[#B91C1C]">Settle Outcomes.</span>
                        </h1>
                        <p class="font-sans text-base md:text-lg text-[#4B5563] max-w-xl mb-8 leading-relaxed">
                            Performance contracts with economic enforcement. Capital is locked until verified outcomes determine settlement.
                        </p>
                        <div class="flex flex-col sm:flex-row items-start gap-3">
                            <button onclick="window.app.handleInitiate()" class="h-12 px-8 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                <span>Commit Capital</span>
                                <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </button>
                            <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="h-12 px-8 border border-[#E5E7EB] bg-white text-[#0A0A0A] text-sm font-medium flex items-center justify-center hover:border-[#0A0A0A] transition-colors">
                                View Public Ledger
                            </a>
                        </div>
                    </div>
                </section>

                <!-- 2. HOW IT WORKS -->
                <section class="py-16 md:py-20 border-b border-[#E5E7EB]">
                    <h2 class="font-display font-semibold text-xl md:text-2xl text-[#0A0A0A] mb-10">Mechanism</h2>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="p-6 border border-[#E5E7EB] bg-[#FAFAFA]">
                            <span class="font-mono text-xs text-[#6B7280] mb-3 block">01</span>
                            <p class="font-sans text-sm text-[#0A0A0A] font-medium">Set baseline metrics</p>
                            <p class="font-mono text-xs text-[#6B7280] mt-2">Revenue, commits, followers</p>
                        </div>
                        <div class="p-6 border border-[#E5E7EB] bg-[#FAFAFA]">
                            <span class="font-mono text-xs text-[#6B7280] mb-3 block">02</span>
                            <p class="font-sans text-sm text-[#0A0A0A] font-medium">Lock capital against target</p>
                            <p class="font-mono text-xs text-[#6B7280] mt-2">$100 – $10,000</p>
                        </div>
                        <div class="p-6 border border-[#E5E7EB] bg-[#FAFAFA]">
                            <span class="font-mono text-xs text-[#6B7280] mb-3 block">03</span>
                            <p class="font-sans text-sm text-[#0A0A0A] font-medium">Performance verified</p>
                            <p class="font-mono text-xs text-[#6B7280] mt-2">Via platform integration</p>
                        </div>
                        <div class="p-6 border border-[#E5E7EB] bg-[#FAFAFA]">
                            <span class="font-mono text-xs text-[#6B7280] mb-3 block">04</span>
                            <p class="font-sans text-sm text-[#0A0A0A] font-medium">Contract settles</p>
                            <p class="font-mono text-xs text-[#6B7280] mt-2">Paid or forfeited</p>
                        </div>
                    </div>
                </section>

                <!-- 3. WHY COLLATERAL EXISTS -->
                <section class="py-16 md:py-20 border-b border-[#E5E7EB]">
                    <h2 class="font-display font-semibold text-xl md:text-2xl text-[#0A0A0A] mb-10">Economic Reality</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <p class="font-sans text-sm text-[#0A0A0A] font-medium mb-2">Promises have no cost</p>
                            <p class="font-sans text-sm text-[#6B7280]">Without capital at risk, commitments are noise. Markets price information; Collateral prices commitment.</p>
                        </div>
                        <div>
                            <p class="font-sans text-sm text-[#0A0A0A] font-medium mb-2">Consequences enforce follow-through</p>
                            <p class="font-sans text-sm text-[#6B7280]">Loss aversion is a stronger motivator than potential gain. Forfeiture is real.</p>
                        </div>
                        <div>
                            <p class="font-sans text-sm text-[#0A0A0A] font-medium mb-2">A market that clears</p>
                            <p class="font-sans text-sm text-[#6B7280]">Winners are paid from losers. No external subsidy. The pool is zero-sum by design.</p>
                        </div>
                    </div>
                </section>

                <!-- 4. VERIFICATION & TRUST LAYER -->
                <section class="py-16 md:py-20 border-b border-[#E5E7EB]">
                    <h2 class="font-display font-semibold text-xl md:text-2xl text-[#0A0A0A] mb-10">Verification Layer</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E5E7EB] border border-[#E5E7EB]">
                        <div class="p-5 bg-white">
                            <span class="font-mono text-xs text-[#0A0A0A] font-medium block mb-1">STRIPE</span>
                            <span class="font-mono text-[10px] text-[#6B7280]">Revenue verification</span>
                        </div>
                        <div class="p-5 bg-white">
                            <span class="font-mono text-xs text-[#0A0A0A] font-medium block mb-1">GITHUB</span>
                            <span class="font-mono text-[10px] text-[#6B7280]">Commit verification</span>
                        </div>
                        <div class="p-5 bg-white">
                            <span class="font-mono text-xs text-[#0A0A0A] font-medium block mb-1">X / TWITTER</span>
                            <span class="font-mono text-[10px] text-[#6B7280]">Metric verification</span>
                        </div>
                        <div class="p-5 bg-white">
                            <span class="font-mono text-xs text-[#6B7280] font-medium block mb-1">MORE</span>
                            <span class="font-mono text-[10px] text-[#6B7280]">Pending</span>
                        </div>
                    </div>
                    <div class="mt-6 flex flex-wrap gap-6">
                        <p class="font-mono text-xs text-[#6B7280]">Objective verification only</p>
                        <p class="font-mono text-xs text-[#6B7280]">Immutable ledger records</p>
                        <p class="font-mono text-xs text-[#6B7280]">No social layer</p>
                    </div>
                </section>

                <!-- 5. PAYOUT STRUCTURE -->
                <section class="py-16 md:py-20 border-b border-[#E5E7EB]">
                    <h2 class="font-display font-semibold text-xl md:text-2xl text-[#0A0A0A] mb-10">Payout Structure</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="p-6 border-l-2 border-[#059669] bg-[#FAFAFA]">
                            <span class="font-mono text-xs text-[#059669] font-medium block mb-3">ON SUCCESS</span>
                            <p class="font-sans text-sm text-[#0A0A0A] mb-2">Capital returned + share of forfeited pool</p>
                            <p class="font-mono text-xs text-[#6B7280]">Multiplier scales with difficulty: 1.2x – 2.5x+</p>
                        </div>
                        <div class="p-6 border-l-2 border-[#B91C1C] bg-[#FAFAFA]">
                            <span class="font-mono text-xs text-[#B91C1C] font-medium block mb-3">ON FAILURE</span>
                            <p class="font-sans text-sm text-[#0A0A0A] mb-2">Capital forfeited to winner pool</p>
                            <p class="font-mono text-xs text-[#6B7280]">No partial returns. No appeals. Settlement is final.</p>
                        </div>
                    </div>
                    <p class="font-sans text-xs text-[#6B7280] mt-6 max-w-xl">
                        Winners are paid from losers' forfeited capital. Risk is explicit, opt-in, and enforced. This is not a savings account.
                    </p>
                </section>

                <!-- 6. FINAL CTA -->
                <section class="py-16 md:py-24">
                    <div class="max-w-xl">
                        <h2 class="font-display font-semibold text-2xl md:text-3xl text-[#0A0A0A] mb-4">
                            Capital at risk.<br>
                            <span class="text-[#B91C1C]">Outcomes enforced.</span>
                        </h2>
                        <p class="font-sans text-sm text-[#6B7280] mb-8">
                            Collateral is infrastructure for performance commitment. Serious users only.
                        </p>
                        <button onclick="window.app.handleInitiate()" class="h-12 px-8 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                            <span>Lock Position</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="py-8 border-t border-[#E5E7EB]">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-[#059669] rounded-full"></div>
                            <span class="font-mono text-xs text-[#6B7280]">SYSTEM OPERATIONAL</span>
                        </div>
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="font-mono text-xs text-[#0A0A0A] hover:text-[#B91C1C] transition-colors">
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
