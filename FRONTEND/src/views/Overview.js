// Overview View - Institutional Homepage
export function renderOverview() {
    return `
        <div class="w-full relative z-10 min-h-screen bg-white">
            
            <!-- Hero Section -->
            <section class="border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div class="max-w-4xl">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-950 leading-tight" style="font-family: 'IBM Plex Sans', sans-serif;">
                            Lock Capital. Verify Performance. Settle Outcomes.
                        </h1>
                        <p class="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed" style="font-family: 'Inter', sans-serif; font-weight: 400;">
                            Performance contracts with on-chain enforcement. Capital at stake. Outcomes verified via platform integrations. Winners paid from forfeited funds.
                        </p>
                        <div class="flex flex-col sm:flex-row items-start gap-4">
                            <button onclick="window.app.handleInitiate()" class="px-8 py-4 bg-black text-white font-semibold hover:bg-gray-900 transition-colors flex items-center gap-2" style="font-family: 'Inter', sans-serif;">
                                <span>Commit Capital</span>
                                <i data-lucide="arrow-right" class="w-5 h-5"></i>
                            </button>
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="px-8 py-4 border border-gray-300 text-gray-950 font-medium hover:border-gray-400 transition-colors" style="font-family: 'Inter', sans-serif;">
                                View Documentation
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- How It Works -->
            <section class="border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-6 py-20 md:py-24">
                    <h2 class="text-sm font-semibold text-gray-500 mb-12 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">MECHANISM</h2>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                        <div class="border border-gray-200 p-6 md:p-8">
                            <div class="text-4xl md:text-5xl font-bold text-gray-300 mb-4" style="font-family: 'JetBrains Mono', monospace;">01</div>
                            <h3 class="text-lg font-semibold mb-3 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Set Baseline</h3>
                            <p class="text-gray-600 text-sm leading-relaxed" style="font-family: 'Inter', sans-serif;">Define measurable target: revenue threshold, commit frequency, post cadence.</p>
                        </div>
                        <div class="border border-gray-200 p-6 md:p-8">
                            <div class="text-4xl md:text-5xl font-bold text-gray-300 mb-4" style="font-family: 'JetBrains Mono', monospace;">02</div>
                            <h3 class="text-lg font-semibold mb-3 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Lock Capital</h3>
                            <p class="text-gray-600 text-sm leading-relaxed" style="font-family: 'Inter', sans-serif;">Capital deposited into smart contract. Non-reversible until settlement.</p>
                        </div>
                        <div class="border border-gray-200 p-6 md:p-8">
                            <div class="text-4xl md:text-5xl font-bold text-gray-300 mb-4" style="font-family: 'JetBrains Mono', monospace;">03</div>
                            <h3 class="text-lg font-semibold mb-3 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Verify Performance</h3>
                            <p class="text-gray-600 text-sm leading-relaxed" style="font-family: 'Inter', sans-serif;">Outcome validated via OAuth integration. Zero subjective assessment.</p>
                        </div>
                        <div class="border border-gray-200 p-6 md:p-8">
                            <div class="text-4xl md:text-5xl font-bold text-gray-300 mb-4" style="font-family: 'JetBrains Mono', monospace;">04</div>
                            <h3 class="text-lg font-semibold mb-3 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Contract Settles</h3>
                            <p class="text-gray-600 text-sm leading-relaxed" style="font-family: 'Inter', sans-serif;">Target met: capital returned + payout. Target missed: forfeiture.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Why Collateral Exists -->
            <section class="border-b border-gray-200 bg-gray-50">
                <div class="max-w-7xl mx-auto px-6 py-20 md:py-24">
                    <div class="max-w-3xl">
                        <h2 class="text-sm font-semibold text-gray-500 mb-8 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">RATIONALE</h2>
                        <div class="space-y-6">
                            <p class="text-xl md:text-2xl text-gray-950 leading-relaxed" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                                Commitments without cost are noise. Intentions fade when stakes are zero.
                            </p>
                            <p class="text-xl md:text-2xl text-gray-950 leading-relaxed" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                                Capital enforces follow-through. Markets price risk. Outcomes become inevitable when failure has real consequence.
                            </p>
                            <p class="text-xl md:text-2xl text-gray-950 leading-relaxed" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                                This is not motivation. This is mechanism.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Verification & Trust Layer -->
            <section class="border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-6 py-20 md:py-24">
                    <h2 class="text-sm font-semibold text-gray-500 mb-12 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">VERIFICATION LAYER</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 class="text-xl font-semibold mb-6 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Platform Integrations</h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between border border-gray-200 px-6 py-4">
                                    <span class="font-medium text-gray-950" style="font-family: 'JetBrains Mono', monospace;">Stripe</span>
                                    <span class="text-xs text-gray-500" style="font-family: 'Inter', sans-serif;">Revenue metrics</span>
                                </div>
                                <div class="flex items-center justify-between border border-gray-200 px-6 py-4">
                                    <span class="font-medium text-gray-950" style="font-family: 'JetBrains Mono', monospace;">GitHub</span>
                                    <span class="text-xs text-gray-500" style="font-family: 'Inter', sans-serif;">Commit frequency</span>
                                </div>
                                <div class="flex items-center justify-between border border-gray-200 px-6 py-4">
                                    <span class="font-medium text-gray-950" style="font-family: 'JetBrains Mono', monospace;">X (Twitter)</span>
                                    <span class="text-xs text-gray-500" style="font-family: 'Inter', sans-serif;">Post cadence</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold mb-6 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Enforcement Guarantees</h3>
                            <div class="space-y-6">
                                <div class="flex gap-4">
                                    <i data-lucide="check-circle-2" class="w-6 h-6 text-gray-950 flex-shrink-0 mt-1"></i>
                                    <div>
                                        <h4 class="font-semibold mb-1 text-gray-950" style="font-family: 'Inter', sans-serif;">Objective verification only</h4>
                                        <p class="text-sm text-gray-600 leading-relaxed" style="font-family: 'Inter', sans-serif;">No manual review. No subjective judgment. Outcome validated via API response.</p>
                                    </div>
                                </div>
                                <div class="flex gap-4">
                                    <i data-lucide="check-circle-2" class="w-6 h-6 text-gray-950 flex-shrink-0 mt-1"></i>
                                    <div>
                                        <h4 class="font-semibold mb-1 text-gray-950" style="font-family: 'Inter', sans-serif;">Immutable settlement</h4>
                                        <p class="text-sm text-gray-600 leading-relaxed" style="font-family: 'Inter', sans-serif;">Smart contract execution. Once verified, settlement is automatic and final.</p>
                                    </div>
                                </div>
                                <div class="flex gap-4">
                                    <i data-lucide="check-circle-2" class="w-6 h-6 text-gray-950 flex-shrink-0 mt-1"></i>
                                    <div>
                                        <h4 class="font-semibold mb-1 text-gray-950" style="font-family: 'Inter', sans-serif;">Zero social layer</h4>
                                        <p class="text-sm text-gray-600 leading-relaxed" style="font-family: 'Inter', sans-serif;">No feeds, likes, or comments. Performance data only. Capital speaks.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Payout Structure -->
            <section class="border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-6 py-20 md:py-24">
                    <h2 class="text-sm font-semibold text-gray-500 mb-12 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">PAYOUT STRUCTURE</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div class="border-2 border-gray-950 p-6 md:p-8">
                            <h3 class="text-xl font-bold mb-4 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Pool Mechanics</h3>
                            <p class="text-gray-600 leading-relaxed mb-4" style="font-family: 'Inter', sans-serif;">All locked capital aggregates into a shared pool. Winners are paid from losers' forfeited funds.</p>
                            <p class="text-sm text-gray-500" style="font-family: 'Inter', sans-serif;">No external subsidy. Zero house edge. Pure redistribution.</p>
                        </div>
                        <div class="border-2 border-gray-950 p-6 md:p-8">
                            <h3 class="text-xl font-bold mb-4 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Multiplier Scaling</h3>
                            <p class="text-gray-600 leading-relaxed mb-4" style="font-family: 'Inter', sans-serif;">Payout scales with contract difficulty and risk level. Higher stakes, higher returns.</p>
                            <div class="text-sm text-gray-500 space-y-1" style="font-family: 'JetBrains Mono', monospace;">
                                <div>Low risk: 1.2x–1.5x</div>
                                <div>Medium risk: 1.5x–2.5x</div>
                                <div>High risk: 2.5x–5.0x</div>
                            </div>
                        </div>
                        <div class="border-2 border-red-700 bg-red-50 p-6 md:p-8">
                            <h3 class="text-xl font-bold mb-4 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Capital at Risk</h3>
                            <p class="text-gray-950 leading-relaxed mb-4 font-medium" style="font-family: 'Inter', sans-serif;">Failure results in complete capital forfeiture. No refunds. No appeals.</p>
                            <p class="text-sm text-red-900 font-semibold" style="font-family: 'Inter', sans-serif;">Risk is explicit, opt-in, and enforced.</p>
                        </div>
                    </div>

                    <div class="mt-12 md:mt-16 p-6 md:p-8 bg-gray-50 border border-gray-200">
                        <h3 class="text-lg font-semibold mb-4 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Example Settlement</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm" style="font-family: 'JetBrains Mono', monospace;">
                            <div>
                                <div class="text-gray-500 mb-2">Initial Pool</div>
                                <div class="text-2xl font-bold text-gray-950">$100,000</div>
                                <div class="text-xs text-gray-500 mt-1">200 participants × $500 each</div>
                            </div>
                            <div>
                                <div class="text-gray-500 mb-2">Completion Rate</div>
                                <div class="text-2xl font-bold text-gray-950">35%</div>
                                <div class="text-xs text-gray-500 mt-1">70 succeeded, 130 forfeited</div>
                            </div>
                            <div>
                                <div class="text-gray-500 mb-2">Winner Payout</div>
                                <div class="text-2xl font-bold text-green-700">$1,429</div>
                                <div class="text-xs text-gray-500 mt-1">2.86x multiplier on capital</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Final CTA -->
            <section class="bg-gray-950 text-white">
                <div class="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div class="max-w-3xl">
                        <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight" style="font-family: 'IBM Plex Sans', sans-serif;">Outcomes Enforced.</h2>
                        <p class="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed" style="font-family: 'Inter', sans-serif;">This platform is for users who understand that capital at stake changes behavior. If you're looking for encouragement, look elsewhere.</p>
                        <div class="flex flex-col sm:flex-row gap-4">
                            <button onclick="window.app.handleInitiate()" class="px-8 py-4 bg-white text-gray-950 font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2" style="font-family: 'Inter', sans-serif;">
                                <span>Create Contract</span>
                                <i data-lucide="arrow-right" class="w-5 h-5"></i>
                            </button>
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="px-8 py-4 border border-gray-600 text-white font-medium hover:border-gray-400 transition-colors text-center" style="font-family: 'Inter', sans-serif;">
                                Read Terms
                            </a>
                        </div>
                        <p class="text-xs text-gray-500 mt-8" style="font-family: 'Inter', sans-serif;">Capital at risk. Verify you understand the mechanism before committing funds.</p>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer class="border-t border-gray-200 bg-white">
                <div class="max-w-7xl mx-auto px-6 py-12">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div class="font-bold text-lg mb-4" style="font-family: 'IBM Plex Sans', sans-serif;">COLLATERAL</div>
                            <p class="text-sm text-gray-600" style="font-family: 'Inter', sans-serif;">Performance contracts with economic enforcement.</p>
                        </div>
                        <div>
                            <h4 class="text-xs font-semibold text-gray-500 mb-4 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">PLATFORM</h4>
                            <ul class="space-y-2 text-sm text-gray-600" style="font-family: 'Inter', sans-serif;">
                                <li><a href="#" class="hover:text-gray-950">How It Works</a></li>
                                <li><a href="#" class="hover:text-gray-950">Integrations</a></li>
                                <li><a href="#" class="hover:text-gray-950">Contract Types</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-xs font-semibold text-gray-500 mb-4 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">RESOURCES</h4>
                            <ul class="space-y-2 text-sm text-gray-600" style="font-family: 'Inter', sans-serif;">
                                <li><a href="#" onclick="window.router.navigate('/docs'); return false;" class="hover:text-gray-950">Documentation</a></li>
                                <li><a href="#" onclick="window.router.navigate('/ledger'); return false;" class="hover:text-gray-950">Public Ledger</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-xs font-semibold text-gray-500 mb-4 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">LEGAL</h4>
                            <ul class="space-y-2 text-sm text-gray-600" style="font-family: 'Inter', sans-serif;">
                                <li><a href="#" class="hover:text-gray-950">Terms of Service</a></li>
                                <li><a href="#" class="hover:text-gray-950">Risk Disclosure</a></li>
                                <li><a href="#" class="hover:text-gray-950">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500" style="font-family: 'JetBrains Mono', monospace;">
                        © 2026 Collateral. All capital at risk. No guarantees of return.
                    </div>
                </div>
            </footer>
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
