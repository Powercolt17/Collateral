// Profile View - USD/Stripe-Backed Identity Record (Public)
export function renderProfile() {
    return `
        <div class="min-h-screen bg-white" style="font-family: 'Inter', sans-serif;">
            <!-- Identity Header -->
            <div class="bg-neutral-50 px-8 pt-10 pb-8">
                <div class="max-w-7xl mx-auto">
                    <!-- Identity Block -->
                    <div class="flex items-end justify-between">
                        <div>
                            <!-- Primary Identifier -->
                            <h1 class="text-4xl font-semibold tracking-tight text-neutral-900 mb-3" id="identity-title" style="font-family: 'IBM Plex Sans', sans-serif; letter-spacing: -0.02em;">
                                <span id="identity-name">powercolt</span>
                            </h1>
                            <!-- Record Subtitle -->
                            <div class="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-neutral-400">
                                <span>Identity Record</span>
                                <span class="text-neutral-300">·</span>
                                <span id="identity-hash" class="text-neutral-500">USR-08742-8F3A</span>
                            </div>
                        </div>
                        <!-- Primary Action -->
                        <div>
                            <button class="flex items-center gap-2 px-5 py-2.5 border border-neutral-300 bg-white text-neutral-700 text-[11px] font-medium uppercase tracking-wider hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
                                <i data-lucide="link" class="w-3.5 h-3.5"></i>
                                Copy Record Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navigation Tabs -->
            <div class="border-b border-neutral-200 bg-white sticky top-16 z-40">
                <div class="max-w-7xl mx-auto px-8">
                    <div class="flex gap-0 -mb-px">
                        <button class="profile-tab px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest border-b-2 border-neutral-900 text-neutral-900 font-medium" data-tab="overview">Overview</button>
                        <button class="profile-tab px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 hover:border-neutral-300" data-tab="contracts">Active Contracts</button>
                        <button class="profile-tab px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 hover:border-neutral-300" data-tab="history">Settlement History</button>
                        <button class="profile-tab px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 hover:border-neutral-300" data-tab="sources">Connected Sources</button>
                        <button class="profile-tab px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 hover:border-neutral-300" data-tab="timeline">Identity Timeline</button>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-8 py-8">
                <!-- Summary Metric Cards -->
                <div class="grid grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 mb-10">
                    <div class="bg-white p-6">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-3">Settlement Rate (Lifetime)</span>
                        <span class="text-3xl font-semibold text-neutral-900 block" id="stat-settlement-rate">94.7%</span>
                        <p class="font-mono text-[10px] text-neutral-400 mt-2" id="stat-settlement-detail">67 of 71 contracts settled</p>
                    </div>
                    <div class="bg-white p-6">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-3">Executed Contracts</span>
                        <span class="text-3xl font-semibold text-neutral-900 block" id="stat-total-contracts">71</span>
                        <p class="font-mono text-[10px] text-neutral-400 mt-2" id="stat-since-date">Since Jan 12, 2025</p>
                    </div>
                    <div class="bg-white p-6">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-3">Total Value Settled</span>
                        <span class="text-3xl font-semibold text-neutral-900 block" id="stat-tvl">$8.2M</span>
                        <p class="font-mono text-[10px] text-neutral-400 mt-2">Cumulative</p>
                    </div>
                    <div class="bg-white p-6">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-3">Forfeiture Events</span>
                        <span class="text-3xl font-semibold block" style="color: #751212;" id="stat-forfeited">$445K</span>
                        <p class="font-mono text-[10px] text-neutral-400 mt-2" id="stat-forfeiture-detail">4 forfeiture events</p>
                    </div>
                </div>

                <!-- Tab Content Container -->
                <div id="tab-content">
                    <!-- Overview Tab (default) -->
                    <div id="tab-overview" class="tab-panel">
                        <div class="grid grid-cols-3 gap-6">
                            <!-- Record Summary Panel (Left - 2 cols) -->
                            <div class="col-span-2 border border-neutral-200 bg-white p-6">
                                <h3 class="font-mono text-[11px] text-neutral-900 uppercase tracking-widest mb-5 font-medium">Record Summary</h3>
                                <div class="text-sm text-neutral-600 leading-relaxed space-y-4 mb-8">
                                    <p>
                                        This record aggregates all executed USD performance contracts and settlement outcomes linked to this identity. Results are verified via connected platforms and processed through Stripe.
                                    </p>
                                    <p>
                                        All outcomes are permanent and publicly visible. Forfeiture events represent USD capital transferred due to non-performance.
                                    </p>
                                </div>
                                <div class="grid grid-cols-2 gap-8 pt-6 border-t border-neutral-100">
                                    <div>
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">First Contract</span>
                                        <span class="text-sm font-medium text-neutral-900" id="meta-first-contract">January 12, 2025</span>
                                    </div>
                                    <div>
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Last Settlement</span>
                                        <span class="text-sm font-medium text-neutral-900" id="meta-last-settlement">January 18, 2026</span>
                                    </div>
                                    <div>
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Total Value Locked</span>
                                        <span class="text-sm font-medium text-neutral-900" id="meta-total-locked">$2,847,392.00 USD</span>
                                    </div>
                                    <div>
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Active Contracts</span>
                                        <span class="text-sm font-medium text-neutral-900" id="meta-active-contracts">3 Outstanding</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Verification Metadata Panel (Right - 1 col) -->
                            <div class="border border-neutral-200 bg-neutral-50 p-6">
                                <h3 class="font-mono text-[11px] text-neutral-900 uppercase tracking-widest mb-5 font-medium">Verification Metadata</h3>
                                <div class="space-y-5">
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Account ID</span>
                                        <span class="text-sm text-neutral-900 flex items-center gap-1.5" id="meta-account-id">
                                            USR-00742
                                            <i data-lucide="copy" class="w-3 h-3 text-neutral-400 cursor-pointer hover:text-neutral-600"></i>
                                        </span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Stripe Account</span>
                                        <span class="text-sm text-neutral-900 flex items-center gap-1.5" id="meta-stripe">
                                            acct_•••8f3a
                                            <i data-lucide="external-link" class="w-3 h-3 text-neutral-400 cursor-pointer hover:text-neutral-600"></i>
                                        </span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Funding Provider</span>
                                        <span class="text-sm text-neutral-900" id="meta-funding-provider">Stripe Connect</span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Currency</span>
                                        <span class="text-sm text-neutral-900" id="meta-currency">USD</span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Record Status</span>
                                        <span class="text-sm text-neutral-900 font-medium" id="meta-record-status">Active</span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Identity Created</span>
                                        <span class="text-sm text-neutral-900" id="meta-identity-created">Jan 12, 2025</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Contract Outcomes -->
                        <div class="mt-8 border border-neutral-200 bg-white">
                            <div class="px-6 py-4 border-b border-neutral-200">
                                <h3 class="font-mono text-[11px] text-neutral-900 uppercase tracking-widest font-medium">Recent Contract Outcomes</h3>
                            </div>
                            <div id="recent-outcomes-list">
                                <!-- Outcome rows rendered by JS -->
                                <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 hover:bg-neutral-50">
                                    <div class="flex items-center gap-6">
                                        <span class="font-mono text-xs text-neutral-900 font-medium">CTR-00647</span>
                                        <span class="font-mono text-xs text-neutral-400">0x8F42...2d91</span>
                                    </div>
                                    <div class="flex items-center gap-6">
                                        <span class="font-mono text-[10px] text-neutral-400">Jan 18, 2026</span>
                                        <span class="font-mono text-[10px] uppercase text-neutral-600">SETTLED</span>
                                        <span class="font-mono text-sm font-medium text-neutral-900 w-32 text-right">$485,000.00</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 hover:bg-neutral-50">
                                    <div class="flex items-center gap-6">
                                        <span class="font-mono text-xs text-neutral-900 font-medium">CTR-00621</span>
                                        <span class="font-mono text-xs text-neutral-400">0x3c19...7e84</span>
                                    </div>
                                    <div class="flex items-center gap-6">
                                        <span class="font-mono text-[10px] text-neutral-400">Jan 15, 2026</span>
                                        <span class="font-mono text-[10px] uppercase text-neutral-600">ACTIVE</span>
                                        <span class="font-mono text-sm font-medium text-neutral-900 w-32 text-right">$720,000.00</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 hover:bg-neutral-50">
                                    <div class="flex items-center gap-6">
                                        <span class="font-mono text-xs text-neutral-900 font-medium">CTR-00609</span>
                                        <span class="font-mono text-xs text-neutral-400">0x9a27...4f82</span>
                                    </div>
                                    <div class="flex items-center gap-6">
                                        <span class="font-mono text-[10px] text-neutral-400">Jan 10, 2026</span>
                                        <span class="font-mono text-[10px] uppercase text-neutral-600">SETTLED</span>
                                        <span class="font-mono text-sm font-medium text-neutral-900 w-32 text-right">$125,000.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Contracts Tab -->
                    <div id="tab-contracts" class="tab-panel hidden">
                        <div class="grid grid-cols-3 gap-6">
                            <!-- Active Contracts List (Left - 2 cols) -->
                            <div class="col-span-2 border border-neutral-200 bg-white">
                                <div class="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                                    <h3 class="font-mono text-[11px] text-neutral-900 uppercase tracking-widest font-medium">Active Performance Contracts</h3>
                                    <span class="font-mono text-[10px] text-neutral-400 uppercase" id="active-count">3 Outstanding</span>
                                </div>
                                <div id="active-contracts-list">
                                    <!-- Contract CTR-00851 -->
                                    <div class="px-6 py-5 border-b border-neutral-100">
                                        <div class="flex justify-between items-start mb-4">
                                            <div>
                                                <span class="font-mono text-sm font-medium text-neutral-900">CTR-00851</span>
                                                <div class="font-mono text-[10px] text-neutral-400 mt-1">COUNTERPARTY: 0x5c19...7e44</div>
                                            </div>
                                            <div class="text-right">
                                                <span class="font-mono text-sm font-medium text-neutral-900">$720,000.00</span>
                                                <div class="font-mono text-[10px] uppercase mt-1" style="color: #751212;">PENDING EXECUTION</div>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                                            <div>
                                                <span class="font-mono text-[10px] text-neutral-400 uppercase block mb-1">Locked Value</span>
                                                <span class="font-mono text-sm font-medium text-neutral-900">$720,000.00</span>
                                            </div>
                                            <div>
                                                <span class="font-mono text-[10px] text-neutral-400 uppercase block mb-1">Execution Date</span>
                                                <span class="font-mono text-sm text-neutral-700">Feb 15, 2026</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Contract CTR-00849 -->
                                    <div class="px-6 py-5 border-b border-neutral-100">
                                        <div class="flex justify-between items-start mb-4">
                                            <div>
                                                <span class="font-mono text-sm font-medium text-neutral-900">CTR-00849</span>
                                                <div class="font-mono text-[10px] text-neutral-400 mt-1">COUNTERPARTY: 0xF28...5b12</div>
                                            </div>
                                            <div class="text-right">
                                                <span class="font-mono text-sm font-medium text-neutral-900">$540,000.00</span>
                                                <div class="font-mono text-[10px] uppercase mt-1" style="color: #751212;">PENDING EXECUTION</div>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                                            <div>
                                                <span class="font-mono text-[10px] text-neutral-400 uppercase block mb-1">Locked Value</span>
                                                <span class="font-mono text-sm font-medium text-neutral-900">$540,000.00</span>
                                            </div>
                                            <div>
                                                <span class="font-mono text-[10px] text-neutral-400 uppercase block mb-1">Execution Date</span>
                                                <span class="font-mono text-sm text-neutral-700">Feb 10, 2026</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Contract CTR-00848 -->
                                    <div class="px-6 py-5">
                                        <div class="flex justify-between items-start mb-4">
                                            <div>
                                                <span class="font-mono text-sm font-medium text-neutral-900">CTR-00848</span>
                                                <div class="font-mono text-[10px] text-neutral-400 mt-1">COUNTERPARTY: 0x5a04...5c77</div>
                                            </div>
                                            <div class="text-right">
                                                <span class="font-mono text-sm font-medium text-neutral-900">$385,000.00</span>
                                                <div class="font-mono text-[10px] uppercase mt-1" style="color: #751212;">PENDING EXECUTION</div>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                                            <div>
                                                <span class="font-mono text-[10px] text-neutral-400 uppercase block mb-1">Locked Value</span>
                                                <span class="font-mono text-sm font-medium text-neutral-900">$385,000.00</span>
                                            </div>
                                            <div>
                                                <span class="font-mono text-[10px] text-neutral-400 uppercase block mb-1">Execution Date</span>
                                                <span class="font-mono text-sm text-neutral-700">Feb 5, 2026</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Verification Metadata Panel (Right - 1 col) -->
                            <div class="border border-neutral-200 bg-neutral-50 p-6">
                                <h3 class="font-mono text-[11px] text-neutral-900 uppercase tracking-widest mb-5 font-medium">Verification Metadata</h3>
                                <div class="space-y-5">
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Account ID</span>
                                        <span class="text-sm text-neutral-900 flex items-center gap-1.5">
                                            USR-00742
                                            <i data-lucide="copy" class="w-3 h-3 text-neutral-400 cursor-pointer hover:text-neutral-600"></i>
                                        </span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Stripe Account</span>
                                        <span class="text-sm text-neutral-900 flex items-center gap-1.5">
                                            acct_•••8f3a
                                            <i data-lucide="external-link" class="w-3 h-3 text-neutral-400 cursor-pointer hover:text-neutral-600"></i>
                                        </span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Funding Provider</span>
                                        <span class="text-sm text-neutral-900">Stripe Connect</span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Currency</span>
                                        <span class="text-sm text-neutral-900">USD</span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Record Status</span>
                                        <span class="text-sm text-neutral-900 font-medium">Active</span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Identity Created</span>
                                        <span class="text-sm text-neutral-900">Jan 12, 2025</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Settlement History Tab -->
                    <div id="tab-history" class="tab-panel hidden">
                        <div class="border border-neutral-200 bg-white">
                            <div class="px-6 py-4 border-b border-neutral-200">
                                <h3 class="font-mono text-[11px] text-neutral-900 uppercase tracking-widest font-medium">Settlement History</h3>
                            </div>
                            <div id="history-list">
                                <!-- Empty State -->
                                <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
                                    <h4 class="font-sans text-sm font-medium text-neutral-700 mb-1">No Settlement History</h4>
                                    <p class="font-mono text-[11px] text-neutral-400 max-w-xs">Completed contracts and their outcomes will appear here.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Connected Sources Tab -->
                    <div id="tab-sources" class="tab-panel hidden">
                        <div class="border border-neutral-200 bg-white">
                            <div class="px-6 py-4 border-b border-neutral-200">
                                <h3 class="font-mono text-[11px] text-neutral-900 uppercase tracking-widest font-medium">Verification Sources</h3>
                            </div>
                            <div class="divide-y divide-neutral-100">
                                <!-- X / Twitter -->
                                <div id="source-twitter" class="px-6 py-5 flex items-center justify-between">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 bg-neutral-900 rounded flex items-center justify-center">
                                            <span class="text-white font-bold text-lg">X</span>
                                        </div>
                                        <div>
                                            <h4 class="font-sans text-sm font-medium text-neutral-900">X / Twitter</h4>
                                            <p class="font-mono text-[11px] text-neutral-500" id="twitter-status">@mercury_dev</p>
                                        </div>
                                    </div>
                                    <span class="font-mono text-[10px] uppercase tracking-wide text-emerald-600">Verified</span>
                                </div>
                                
                                <!-- GitHub -->
                                <div id="source-github" class="px-6 py-5 flex items-center justify-between">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center">
                                            <i data-lucide="github" class="w-5 h-5 text-white"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-sans text-sm font-medium text-neutral-900">GitHub</h4>
                                            <p class="font-mono text-[11px] text-neutral-500" id="github-status">mercury-labs</p>
                                        </div>
                                    </div>
                                    <span class="font-mono text-[10px] uppercase tracking-wide text-emerald-600">Verified</span>
                                </div>
                                
                                <!-- Stripe -->
                                <div id="source-stripe" class="px-6 py-5 flex items-center justify-between">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 bg-[#635BFF] rounded flex items-center justify-center">
                                            <span class="text-white font-bold text-sm">S</span>
                                        </div>
                                        <div>
                                            <h4 class="font-sans text-sm font-medium text-neutral-900">Stripe</h4>
                                            <p class="font-mono text-[11px] text-neutral-500" id="stripe-status">acct_•••8f3a</p>
                                        </div>
                                    </div>
                                    <span class="font-mono text-[10px] uppercase tracking-wide text-emerald-600">Verified</span>
                                </div>
                            </div>
                        </div>
                        <p class="font-mono text-[10px] text-neutral-400 mt-4">Verification sources are bound to this identity and cannot be modified after execution.</p>
                    </div>

                    <!-- Identity Timeline Tab -->
                    <div id="tab-timeline" class="tab-panel hidden">
                        <div class="grid grid-cols-3 gap-6">
                            <!-- Timeline (Left - 2 cols) -->
                            <div class="col-span-2 border border-neutral-200 bg-white">
                                <div class="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                                    <h3 class="font-mono text-[11px] text-neutral-900 uppercase tracking-widest font-medium">Immutable Event Record</h3>
                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">All Events Are Final</span>
                                </div>
                                <div id="timeline-list" class="relative">
                                    <!-- Timeline line -->
                                    <div class="absolute left-6 top-0 bottom-0 w-px bg-neutral-200"></div>
                                    
                                    <!-- Event: Contract Settled -->
                                    <div class="relative px-6 py-5 border-b border-neutral-100 ml-4">
                                        <div class="absolute left-2 top-6 w-2 h-2 bg-neutral-400 rounded-full"></div>
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="text-sm font-medium text-neutral-900">Contract Settled</h4>
                                                <p class="text-xs text-neutral-500 mt-1">Performance contract executed successfully</p>
                                                <div class="flex gap-4 mt-3">
                                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">VALUE: <span class="text-neutral-900 font-medium">$485,000.00</span></span>
                                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">REFERENCE: <span class="text-neutral-600">CTR-00647</span></span>
                                                </div>
                                            </div>
                                            <span class="font-mono text-[10px] text-neutral-400">Jan 18, 2026</span>
                                        </div>
                                    </div>

                                    <!-- Event: Contract Settled -->
                                    <div class="relative px-6 py-5 border-b border-neutral-100 ml-4">
                                        <div class="absolute left-2 top-6 w-2 h-2 bg-neutral-400 rounded-full"></div>
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="text-sm font-medium text-neutral-900">Contract Settled</h4>
                                                <p class="text-xs text-neutral-500 mt-1">Performance contract executed successfully</p>
                                                <div class="flex gap-4 mt-3">
                                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">VALUE: <span class="text-neutral-900 font-medium">$620,000.00</span></span>
                                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">REFERENCE: <span class="text-neutral-600">CTR-00643</span></span>
                                                </div>
                                            </div>
                                            <span class="font-mono text-[10px] text-neutral-400">Jan 18, 2026</span>
                                        </div>
                                    </div>

                                    <!-- Event: New Contract Executed -->
                                    <div class="relative px-6 py-5 border-b border-neutral-100 ml-4">
                                        <div class="absolute left-2 top-6 w-2 h-2 bg-neutral-400 rounded-full"></div>
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="text-sm font-medium text-neutral-900">New Contract Executed</h4>
                                                <p class="text-xs text-neutral-500 mt-1">Performance contract initiated with counterparty</p>
                                                <div class="flex gap-4 mt-3">
                                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">VALUE: <span class="text-neutral-900 font-medium">$720,000.00</span></span>
                                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">REFERENCE: <span class="text-neutral-600">CTR-00621</span></span>
                                                </div>
                                            </div>
                                            <span class="font-mono text-[10px] text-neutral-400">Jan 15, 2026</span>
                                        </div>
                                    </div>

                                    <!-- Event: Contract Forfeited (VISUALLY DISTINCT) -->
                                    <div class="relative px-6 py-5 border-b border-neutral-100 ml-4 bg-red-50 border-l-2" style="border-left-color: #751212;">
                                        <div class="absolute left-2 top-6 w-2 h-2 rounded-full" style="background-color: #751212;"></div>
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="text-sm font-medium" style="color: #751212;">Contract Forfeited</h4>
                                                <p class="text-xs text-neutral-500 mt-1">Non-performance event; USD capital transferred via Stripe</p>
                                                <div class="flex gap-4 mt-3">
                                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">VALUE: <span style="color: #751212;" class="font-medium">$125,000.00</span></span>
                                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">REFERENCE: <span class="text-neutral-600">CTR-00609</span></span>
                                                </div>
                                            </div>
                                            <span class="font-mono text-[10px] text-neutral-400">Jan 10, 2026</span>
                                        </div>
                                    </div>

                                    <!-- Event: Contract Settled -->
                                    <div class="relative px-6 py-5 ml-4">
                                        <div class="absolute left-2 top-6 w-2 h-2 bg-neutral-400 rounded-full"></div>
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="text-sm font-medium text-neutral-900">Contract Settled</h4>
                                                <p class="text-xs text-neutral-500 mt-1">Performance contract executed successfully</p>
                                                <div class="flex gap-4 mt-3">
                                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">VALUE: <span class="text-neutral-900 font-medium">$340,000.00</span></span>
                                                    <span class="font-mono text-[10px] text-neutral-400 uppercase">REFERENCE: <span class="text-neutral-600">CTR-00598</span></span>
                                                </div>
                                            </div>
                                            <span class="font-mono text-[10px] text-neutral-400">Jan 8, 2026</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Verification Metadata Panel (Right - 1 col) -->
                            <div class="border border-neutral-200 bg-neutral-50 p-6">
                                <h3 class="font-mono text-[11px] text-neutral-900 uppercase tracking-widest mb-5 font-medium">Verification Metadata</h3>
                                <div class="space-y-5">
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Account ID</span>
                                        <span class="text-sm text-neutral-900 flex items-center gap-1.5">
                                            USR-00742
                                            <i data-lucide="copy" class="w-3 h-3 text-neutral-400 cursor-pointer hover:text-neutral-600"></i>
                                        </span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Stripe Account</span>
                                        <span class="text-sm text-neutral-900 flex items-center gap-1.5">
                                            acct_•••8f3a
                                            <i data-lucide="external-link" class="w-3 h-3 text-neutral-400 cursor-pointer hover:text-neutral-600"></i>
                                        </span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Funding Provider</span>
                                        <span class="text-sm text-neutral-900">Stripe Connect</span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Currency</span>
                                        <span class="text-sm text-neutral-900">USD</span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Record Status</span>
                                        <span class="text-sm text-neutral-900 font-medium">Active</span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Identity Created</span>
                                        <span class="text-sm text-neutral-900">Jan 12, 2025</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-neutral-200 mt-16">
                <div class="max-w-7xl mx-auto px-8 py-6">
                    <div class="flex justify-between items-center">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">SYSTEM STATUS <span class="text-emerald-500">●</span> OPERATIONAL</span>
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-neutral-600">DOCS</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function initProfile() {
    const tabs = document.querySelectorAll('.profile-tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Update tab styles
            tabs.forEach(t => {
                t.classList.remove('border-neutral-900', 'text-neutral-900', 'font-medium');
                t.classList.add('border-transparent', 'text-neutral-400');
            });
            tab.classList.remove('border-transparent', 'text-neutral-400');
            tab.classList.add('border-neutral-900', 'text-neutral-900', 'font-medium');

            // Show/hide panels
            panels.forEach(panel => {
                panel.classList.add('hidden');
            });
            const targetPanel = document.getElementById('tab-' + targetTab);
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
            }

            // Re-init icons for the new panel
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Fetch live profile data
    try {
        const profile = await window.api.getProfile();
        console.log('[Profile] Full API response:', JSON.stringify(profile, null, 2));

        // Check for error response
        if (profile.error) {
            console.error('[Profile] Failed to load profile:', profile.error);
            return;
        }

        // Update identity title
        const identityNameEl = document.getElementById('identity-name');
        if (identityNameEl) {
            if (profile.identity?.displayName) {
                identityNameEl.textContent = profile.identity.displayName.toLowerCase().replace(/\s+/g, '');
            } else if (profile.identity?.username) {
                identityNameEl.textContent = profile.identity.username.toLowerCase();
            } else {
                identityNameEl.textContent = 'unclaimed';
            }
        }

        // Update stats
        const settlementRateEl = document.getElementById('stat-settlement-rate');
        if (settlementRateEl) {
            settlementRateEl.textContent = profile.stats.settlementRate !== null
                ? profile.stats.settlementRate + '%'
                : '—';
        }

        const settlementDetailEl = document.getElementById('stat-settlement-detail');
        if (settlementDetailEl && profile.stats.settledContracts !== undefined) {
            settlementDetailEl.textContent = `${profile.stats.settledContracts} of ${profile.stats.totalContracts} contracts settled`;
        }

        const totalContractsEl = document.getElementById('stat-total-contracts');
        if (totalContractsEl) {
            totalContractsEl.textContent = profile.stats.totalContracts.toString();
        }

        const tvlEl = document.getElementById('stat-tvl');
        if (tvlEl) {
            const tvl = profile.stats.tvlSettledUsd || 0;
            if (tvl >= 1000000) {
                tvlEl.textContent = '$' + (tvl / 1000000).toFixed(1) + 'M';
            } else if (tvl >= 1000) {
                tvlEl.textContent = '$' + (tvl / 1000).toFixed(0) + 'K';
            } else {
                tvlEl.textContent = '$' + tvl.toLocaleString();
            }
        }

        const forfeitedEl = document.getElementById('stat-forfeited');
        if (forfeitedEl) {
            const forfeited = profile.stats.forfeitedValueUsd || 0;
            if (forfeited >= 1000000) {
                forfeitedEl.textContent = '$' + (forfeited / 1000000).toFixed(1) + 'M';
            } else if (forfeited >= 1000) {
                forfeitedEl.textContent = '$' + (forfeited / 1000).toFixed(0) + 'K';
            } else {
                forfeitedEl.textContent = '$' + forfeited.toLocaleString();
            }
        }

        const forfeitureDetailEl = document.getElementById('stat-forfeiture-detail');
        if (forfeitureDetailEl) {
            forfeitureDetailEl.textContent = `${profile.stats.forfeitedContracts || 0} forfeiture events`;
        }

        // Update verification sources display (public view - read only)
        const twitterStatusEl = document.getElementById('twitter-status');
        if (twitterStatusEl && profile.xConnection?.connected) {
            twitterStatusEl.textContent = '@' + (profile.xConnection.xUsername || 'verified');
        }

        const githubStatusEl = document.getElementById('github-status');
        if (githubStatusEl && profile.githubConnection?.connected) {
            githubStatusEl.textContent = profile.githubConnection.username || 'verified';
        }

    } catch (err) {
        console.error('[Profile] Error loading profile:', err);
    }
}
