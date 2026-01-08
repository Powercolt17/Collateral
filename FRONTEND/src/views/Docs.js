// Docs View
export function renderDocs() {
    return `
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen">
            <!-- Page Header -->
            <div class="mt-12 mb-12">
                <h1 class="font-display font-bold text-3xl tracking-tight text-[#0E0E11] uppercase mb-2">Documentation</h1>
                <p class="font-sans text-sm text-neutral-500">Everything you need to know about Collateral.</p>
                <div class="h-px w-full bg-neutral-200 mt-6"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- Sidebar -->
                <nav class="md:col-span-1">
                    <div class="sticky top-24 space-y-6">
                        <div>
                            <h4 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-3">Getting Started</h4>
                            <ul class="space-y-2">
                                <li><a href="#overview" class="text-sm text-neutral-900 font-medium hover:text-[#921818]">Overview</a></li>
                                <li><a href="#how-it-works" class="text-sm text-neutral-500 hover:text-neutral-900">How It Works</a></li>
                                <li><a href="#create-account" class="text-sm text-neutral-500 hover:text-neutral-900">Create Account</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-3">Contracts</h4>
                            <ul class="space-y-2">
                                <li><a href="#creating-contracts" class="text-sm text-neutral-500 hover:text-neutral-900">Creating Contracts</a></li>
                                <li><a href="#sources" class="text-sm text-neutral-500 hover:text-neutral-900">Verification Sources</a></li>
                                <li><a href="#settlements" class="text-sm text-neutral-500 hover:text-neutral-900">Settlements</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-3">API</h4>
                            <ul class="space-y-2">
                                <li><a href="#endpoints" class="text-sm text-neutral-500 hover:text-neutral-900">Endpoints</a></li>
                                <li><a href="#authentication" class="text-sm text-neutral-500 hover:text-neutral-900">Authentication</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <!-- Content -->
                <div class="md:col-span-3 space-y-12">
                    <section id="overview">
                        <h2 class="font-display font-semibold text-xl text-neutral-900 mb-4">Overview</h2>
                        <p class="text-sm text-neutral-600 leading-relaxed mb-4">
                            Collateral is an enforcement protocol that lets you lock capital against measurable outcomes. 
                            Set a target, stake funds, and get verified results — automatically.
                        </p>
                        <p class="text-sm text-neutral-600 leading-relaxed">
                            When you succeed, your capital is returned plus potential rewards from the pool. 
                            When you fail, your capital is forfeited. No appeals. No exceptions.
                        </p>
                    </section>

                    <section id="how-it-works">
                        <h2 class="font-display font-semibold text-xl text-neutral-900 mb-4">How It Works</h2>
                        <div class="space-y-4">
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center font-mono text-sm font-medium text-neutral-600 shrink-0">1</div>
                                <div>
                                    <h4 class="font-medium text-sm text-neutral-900 mb-1">Connect a verification source</h4>
                                    <p class="text-sm text-neutral-500">Link your GitHub, X/Twitter, Stripe, or other supported platform.</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center font-mono text-sm font-medium text-neutral-600 shrink-0">2</div>
                                <div>
                                    <h4 class="font-medium text-sm text-neutral-900 mb-1">Define your commitment</h4>
                                    <p class="text-sm text-neutral-500">Set a measurable target with a deadline. Be specific.</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center font-mono text-sm font-medium text-neutral-600 shrink-0">3</div>
                                <div>
                                    <h4 class="font-medium text-sm text-neutral-900 mb-1">Lock capital</h4>
                                    <p class="text-sm text-neutral-500">Stake funds that will be held until verification completes.</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center font-mono text-sm font-medium text-neutral-600 shrink-0">4</div>
                                <div>
                                    <h4 class="font-medium text-sm text-neutral-900 mb-1">Automatic settlement</h4>
                                    <p class="text-sm text-neutral-500">The system verifies your outcome and settles the contract.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="sources">
                        <h2 class="font-display font-semibold text-xl text-neutral-900 mb-4">Verification Sources</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="border border-neutral-200 p-4 bg-white">
                                <h4 class="font-medium text-sm text-neutral-900 mb-2">X / Twitter</h4>
                                <p class="text-xs text-neutral-500">Track follower growth, engagement, and posting frequency.</p>
                            </div>
                            <div class="border border-neutral-200 p-4 bg-white">
                                <h4 class="font-medium text-sm text-neutral-900 mb-2">GitHub</h4>
                                <p class="text-xs text-neutral-500">Track commits, merges, and repository milestones.</p>
                            </div>
                            <div class="border border-neutral-200 p-4 bg-white">
                                <h4 class="font-medium text-sm text-neutral-900 mb-2">Stripe</h4>
                                <p class="text-xs text-neutral-500">Track revenue, MRR, and transaction milestones.</p>
                            </div>
                            <div class="border border-neutral-200 p-4 bg-white">
                                <h4 class="font-medium text-sm text-neutral-900 mb-2">More Coming</h4>
                                <p class="text-xs text-neutral-500">Strava, Linear, custom webhooks, and more.</p>
                            </div>
                        </div>
                    </section>

                    <section id="settlements">
                        <h2 class="font-display font-semibold text-xl text-neutral-900 mb-4">Settlements</h2>
                        <p class="text-sm text-neutral-600 leading-relaxed mb-4">
                            All settlements are final and recorded on the public ledger. There are no appeals, refunds, or exceptions.
                        </p>
                        <div class="bg-neutral-50 border border-neutral-200 p-4">
                            <p class="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                                External systems decide outcomes. Collateral does not arbitrate.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `;
}

export function initDocs() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
