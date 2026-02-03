// Overview View - Institutional Homepage
export function renderOverview() {
    return `
        <!-- Institutional Motion System CSS -->
        <style>
            /* === MOTION TOKENS === */
            :root {
                --motion-duration-micro: 200ms;
                --motion-duration-reveal: 600ms;
                --motion-duration-divider: 800ms;
                --motion-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
                --motion-distance: 10px;
                --motion-stagger: 80ms;
            }

            /* === REVEAL SYSTEM === */
            [data-reveal] {
                opacity: 0;
                transform: translateY(var(--motion-distance));
                transition: 
                    opacity var(--motion-duration-reveal) var(--motion-easing),
                    transform var(--motion-duration-reveal) var(--motion-easing);
            }
            
            [data-reveal].is-visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Stagger delays */
            [data-reveal-delay="1"] { transition-delay: calc(var(--motion-stagger) * 1); }
            [data-reveal-delay="2"] { transition-delay: calc(var(--motion-stagger) * 2); }
            [data-reveal-delay="3"] { transition-delay: calc(var(--motion-stagger) * 3); }
            [data-reveal-delay="4"] { transition-delay: calc(var(--motion-stagger) * 4); }
            [data-reveal-delay="5"] { transition-delay: calc(var(--motion-stagger) * 5); }
            
            /* === DIVIDER DRAW ANIMATION === */
            .divider-draw {
                transform: scaleX(0);
                transform-origin: left;
                transition: transform var(--motion-duration-divider) var(--motion-easing);
            }
            .divider-draw.is-visible {
                transform: scaleX(1);
            }
            
            /* === BUTTON INTERACTIONS (Hardware Feel) === */
            .btn-institutional {
                transition: 
                    background-color var(--motion-duration-micro) var(--motion-easing),
                    transform var(--motion-duration-micro) var(--motion-easing),
                    box-shadow var(--motion-duration-micro) var(--motion-easing);
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }
            .btn-institutional:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .btn-institutional:active {
                transform: translateY(1px);
                box-shadow: 0 0 0 rgba(0,0,0,0);
            }
            
            /* === CARD HOVER (Mechanism Cards) === */
            .card-hover {
                transition: 
                    transform var(--motion-duration-micro) var(--motion-easing),
                    border-color var(--motion-duration-micro) var(--motion-easing),
                    box-shadow var(--motion-duration-micro) var(--motion-easing);
            }
            .card-hover:hover {
                transform: translateY(-2px);
                border-color: #999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            }
            
            /* === SYSTEM STATUS PULSE === */
            .status-pulse {
                animation: statusPulse 2.5s ease-in-out infinite;
            }
            @keyframes statusPulse {
                0%, 100% { 
                    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
                }
                50% { 
                    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0);
                }
            }
            
            /* === REDUCED MOTION === */
            @media (prefers-reduced-motion: reduce) {
                [data-reveal] {
                    opacity: 1;
                    transform: none;
                    transition: none;
                }
                .divider-draw {
                    transform: scaleX(1);
                    transition: none;
                }
                .btn-institutional,
                .card-hover {
                    transition: none;
                    transform: none !important;
                }
                .btn-institutional:hover,
                .btn-institutional:active,
                .card-hover:hover {
                    transform: none !important;
                }
                .status-pulse {
                    animation: none;
                }
            }
        </style>

        <div class="w-full relative z-10 min-h-screen bg-white">
            
            <!-- Hero Section -->
            <section class="border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div class="max-w-4xl">
                        <h1 data-reveal class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-950 leading-tight"
    style="font-family: 'IBM Plex Sans', sans-serif;">
  Intentions Fail<br />
  <span data-reveal data-reveal-delay="1" style="color: #751212; display: inline-block;">Without</span> Stakes.</h1>
                        </h1>
                        <p data-reveal data-reveal-delay="2" class="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed" style="font-family: 'Inter', sans-serif; font-weight: 400;">
                            Performance contracts with on-chain enforcement. Capital at stake. Outcomes verified via platform integrations. Winners paid from forfeited funds.
                        </p>
                        <div data-reveal data-reveal-delay="3" class="flex flex-col sm:flex-row items-start gap-4">
                            <button onclick="window.app.handleInitiate()" class="btn-institutional px-8 py-4 text-white font-semibold flex items-center gap-2" style="font-family: 'Inter', sans-serif; background-color: #751212;">
                                <span>Commit Capital</span>
                                <i data-lucide="arrow-right" class="w-5 h-5"></i>
                            </button>
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="btn-institutional px-8 py-4 border border-gray-300 text-gray-950 font-medium" style="font-family: 'Inter', sans-serif;">
                                View Documentation
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Hero Divider -->
                <div class="divider-draw h-px bg-gray-300" style="margin-top: -1px;"></div>
            </section>

            <!-- How It Works -->
            <section class="border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-6 py-20 md:py-24">
                    <h2 data-reveal class="text-sm font-semibold text-gray-500 mb-12 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">MECHANISM</h2>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                        <div data-reveal data-reveal-delay="1" class="card-hover border border-gray-200 p-6 md:p-8">
                            <div class="text-4xl md:text-5xl font-bold mb-4" style="font-family: 'JetBrains Mono', monospace; color: #751212;">01</div>
                            <h3 class="text-lg font-semibold mb-3 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Set Baseline</h3>
                            <p class="text-gray-600 text-sm leading-relaxed" style="font-family: 'Inter', sans-serif;">Define measurable target: revenue threshold, commit frequency, post cadence.</p>
                        </div>
                        <div data-reveal data-reveal-delay="2" class="card-hover border border-gray-200 p-6 md:p-8">
                            <div class="text-4xl md:text-5xl font-bold mb-4" style="font-family: 'JetBrains Mono', monospace; color: #751212;">02</div>
                            <h3 class="text-lg font-semibold mb-3 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Lock Capital</h3>
                            <p class="text-gray-600 text-sm leading-relaxed" style="font-family: 'Inter', sans-serif;">Capital deposited into smart contract. Non-reversible until settlement.</p>
                        </div>
                        <div data-reveal data-reveal-delay="3" class="card-hover border border-gray-200 p-6 md:p-8">
                            <div class="text-4xl md:text-5xl font-bold mb-4" style="font-family: 'JetBrains Mono', monospace; color: #751212;">03</div>
                            <h3 class="text-lg font-semibold mb-3 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Verify Performance</h3>
                            <p class="text-gray-600 text-sm leading-relaxed" style="font-family: 'Inter', sans-serif;">Outcome validated via OAuth integration. Zero subjective assessment.</p>
                        </div>
                        <div data-reveal data-reveal-delay="4" class="card-hover border border-gray-200 p-6 md:p-8">
                            <div class="text-4xl md:text-5xl font-bold mb-4" style="font-family: 'JetBrains Mono', monospace; color: #751212;">04</div>
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
                        <h2 data-reveal class="text-sm font-semibold text-gray-500 mb-8 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">RATIONALE</h2>
                        <div class="space-y-6">
                            <p data-reveal data-reveal-delay="1" class="text-xl md:text-2xl text-gray-950 leading-relaxed" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                                Commitments without cost are noise. Intentions fade when stakes are zero.
                            </p>
                            <p data-reveal data-reveal-delay="2" class="text-xl md:text-2xl text-gray-950 leading-relaxed" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                                Capital enforces follow-through. Markets price risk. Outcomes become inevitable when failure has real consequence.
                            </p>
                            <p data-reveal data-reveal-delay="3" class="text-xl md:text-2xl text-gray-950 leading-relaxed" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                                This is not motivation. This is mechanism.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Verification & Trust Layer -->
            <section class="border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-6 py-20 md:py-24">
                    <h2 data-reveal class="text-sm font-semibold text-gray-500 mb-12 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">VERIFICATION LAYER</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div data-reveal data-reveal-delay="1">
                            <h3 class="text-xl font-semibold mb-6 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Platform Integrations</h3>
                            <div class="space-y-4">
                                <div class="card-hover flex items-center justify-between border border-gray-200 px-6 py-4">
                                    <span class="font-medium text-gray-950" style="font-family: 'JetBrains Mono', monospace;">Stripe</span>
                                    <span class="text-xs text-gray-500" style="font-family: 'Inter', sans-serif;">Revenue metrics</span>
                                </div>
                                <div class="card-hover flex items-center justify-between border border-gray-200 px-6 py-4">
                                    <span class="font-medium text-gray-950" style="font-family: 'JetBrains Mono', monospace;">GitHub</span>
                                    <span class="text-xs text-gray-500" style="font-family: 'Inter', sans-serif;">Commit frequency</span>
                                </div>
                                <div class="card-hover flex items-center justify-between border border-gray-200 px-6 py-4">
                                    <span class="font-medium text-gray-950" style="font-family: 'JetBrains Mono', monospace;">X (Twitter)</span>
                                    <span class="text-xs text-gray-500" style="font-family: 'Inter', sans-serif;">Post cadence</span>
                                </div>
                            </div>
                        </div>
                        <div data-reveal data-reveal-delay="2">
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

            <!-- Contract Economics -->
            <section class="border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-6 py-20 md:py-24">
                    <h2 data-reveal class="text-sm font-semibold text-gray-500 mb-12 tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">CONTRACT ECONOMICS</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div data-reveal data-reveal-delay="1" class="card-hover border-2 border-gray-950 p-6 md:p-8">
                            <h3 class="text-xl font-bold mb-4 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Contract Terms</h3>
                            <p class="text-gray-600 leading-relaxed mb-4" style="font-family: 'Inter', sans-serif;">Capital is locked per contract. Terms are defined upfront. Payout multiplier is known before execution.</p>
                            <p class="text-sm text-gray-500" style="font-family: 'Inter', sans-serif;">No post-hoc adjustment. Terms are immutable once executed.</p>
                        </div>
                        <div data-reveal data-reveal-delay="2" class="card-hover border-2 border-gray-950 p-6 md:p-8">
                            <h3 class="text-xl font-bold mb-4 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Outcome Settlement</h3>
                            <p class="text-gray-600 leading-relaxed mb-4" style="font-family: 'Inter', sans-serif;">Binary settlement: success or failure. Success returns capital + predefined multiplier. Failure forfeits capital in full.</p>
                            <p class="text-sm text-gray-500" style="font-family: 'Inter', sans-serif;">Settlement does not depend on other users' outcomes.</p>
                        </div>
                        <div data-reveal data-reveal-delay="3" class="card-hover border-2 p-6 md:p-8" style="border-color: #751212; background-color: #fef2f2;">
                            <h3 class="text-xl font-bold mb-4 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Risk Model</h3>
                            <p class="text-gray-950 leading-relaxed mb-4 font-medium" style="font-family: 'Inter', sans-serif;">Risk level determines multiplier. Difficulty and verification scope determine tier.</p>
                            <div class="text-sm space-y-1 mb-4" style="font-family: 'JetBrains Mono', monospace; color: #751212;">
                                <div>Conservative: 1.2x–1.5x</div>
                                <div>Standard: 1.5x–2.5x</div>
                                <div>Aggressive: 2.5x–5.0x</div>
                            </div>
                            <p class="text-sm font-semibold" style="font-family: 'Inter', sans-serif; color: #751212;">Risk is opt-in and explicit.</p>
                        </div>
                    </div>

                    <div data-reveal class="mt-12 md:mt-16 p-6 md:p-8 bg-gray-50 border border-gray-200">
                        <h3 class="text-lg font-semibold mb-6 text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Example Settlement</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Success Case -->
                            <div class="p-6 border-l-4 border-green-600 bg-white">
                                <div class="text-xs font-semibold text-green-700 mb-4 uppercase tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif;">Success Case</div>
                                <div class="space-y-3" style="font-family: 'JetBrains Mono', monospace;">
                                    <div class="flex justify-between">
                                        <span class="text-gray-500 text-sm">Contract Stake</span>
                                        <span class="text-gray-950 font-medium">$500</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-500 text-sm">Multiplier</span>
                                        <span class="text-gray-950 font-medium">2.5x</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-500 text-sm">Outcome</span>
                                        <span class="text-green-700 font-medium">Verified success</span>
                                    </div>
                                    <div class="flex justify-between pt-3 border-t border-gray-200">
                                        <span class="text-gray-950 font-semibold">Settlement</span>
                                        <span class="text-green-700 font-bold text-lg">$1,250 returned</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Failure Case -->
                            <div class="p-6 border-l-4 bg-white" style="border-color: #751212;">
                                <div class="text-xs font-semibold mb-4 uppercase tracking-wider" style="font-family: 'IBM Plex Sans', sans-serif; color: #751212;">Failure Case</div>
                                <div class="space-y-3" style="font-family: 'JetBrains Mono', monospace;">
                                    <div class="flex justify-between">
                                        <span class="text-gray-500 text-sm">Contract Stake</span>
                                        <span class="text-gray-950 font-medium">$500</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-500 text-sm">Multiplier</span>
                                        <span class="text-gray-950 font-medium">2.5x</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-500 text-sm">Outcome</span>
                                        <span class="font-medium" style="color: #751212;">Not met</span>
                                    </div>
                                    <div class="flex justify-between pt-3 border-t border-gray-200">
                                        <span class="text-gray-950 font-semibold">Settlement</span>
                                        <span class="font-bold text-lg" style="color: #751212;">$0 returned</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-6" style="font-family: 'Inter', sans-serif;">Settlement is automatic and final once verification completes. No appeals. No partial returns.</p>
                    </div>
                </div>
            </section>

            <!-- Final CTA -->
            <section class="bg-gray-50 border-t border-gray-200">
                <div class="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div class="max-w-3xl">
                        <h2 data-reveal class="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-950" style="font-family: 'IBM Plex Sans', sans-serif;">Outcomes Enforced.</h2>
                        <p data-reveal data-reveal-delay="1" class="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed" style="font-family: 'Inter', sans-serif;">This platform is for users who understand that capital at stake changes behavior. If you're looking for encouragement, look elsewhere.</p>
                        <div data-reveal data-reveal-delay="2" class="flex flex-col sm:flex-row gap-4">
                            <button onclick="window.app.handleInitiate()" class="btn-institutional px-8 py-4 bg-gray-950 text-white font-semibold flex items-center justify-center gap-2" style="font-family: 'Inter', sans-serif;">
                                <span>Create Contract</span>
                                <i data-lucide="arrow-right" class="w-5 h-5"></i>
                            </button>
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="btn-institutional px-8 py-4 border border-gray-950 text-gray-950 font-medium text-center" style="font-family: 'Inter', sans-serif;">
                                Read Terms
                            </a>
                        </div>
                        <p data-reveal data-reveal-delay="3" class="text-xs text-gray-500 mt-8" style="font-family: 'Inter', sans-serif;">Capital at risk. Verify you understand the mechanism before committing funds.</p>
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
    // === INTERSECTION OBSERVER FOR SCROLL REVEALS ===
    // Use requestAnimationFrame to ensure DOM is fully painted before observing
    requestAnimationFrame(() => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add small delay for staggered feel
                    requestAnimationFrame(() => {
                        entry.target.classList.add('is-visible');
                    });
                    // Only reveal once
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,  // Lower threshold for earlier trigger
            rootMargin: '0px 0px 0px 0px'  // No negative margin to ensure visibility
        });

        // Observe all reveal elements
        document.querySelectorAll('[data-reveal]').forEach(el => {
            revealObserver.observe(el);
        });

        // Observe divider elements
        document.querySelectorAll('.divider-draw').forEach(el => {
            revealObserver.observe(el);
        });
    });


    // === TICKER ANIMATION ===
    const track = document.getElementById('ticker-track');
    if (!track) {
        // Initialize Lucide icons and exit
        if (window.lucide) window.lucide.createIcons();
        return;
    }

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

