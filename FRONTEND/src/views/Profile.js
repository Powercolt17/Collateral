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
                            <h1 class="text-4xl font-semibold tracking-tight mb-3" id="identity-title" style="font-family: 'IBM Plex Sans', sans-serif; letter-spacing: -0.02em; color: #751212;">
                                <span id="identity-name">Powercolt</span>
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
                        <span class="text-3xl font-semibold text-neutral-900 block" id="stat-settlement-rate">—</span>
                        <p class="font-mono text-[10px] text-neutral-400 mt-2" id="stat-settlement-detail">Loading...</p>
                    </div>
                    <div class="bg-white p-6">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-3">Executed Contracts</span>
                        <span class="text-3xl font-semibold text-neutral-900 block" id="stat-total-contracts">—</span>
                        <p class="font-mono text-[10px] text-neutral-400 mt-2" id="stat-since-date">Loading...</p>
                    </div>
                    <div class="bg-white p-6">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-3">Total Value Settled</span>
                        <span class="text-3xl font-semibold text-neutral-900 block" id="stat-tvl">—</span>
                        <p class="font-mono text-[10px] text-neutral-400 mt-2">Cumulative</p>
                    </div>
                    <div class="bg-white p-6">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-3">Forfeiture Events</span>
                        <span class="text-3xl font-semibold block" style="color: #751212;" id="stat-forfeited">—</span>
                        <p class="font-mono text-[10px] text-neutral-400 mt-2" id="stat-forfeiture-detail">Loading...</p>
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
                                <div class="px-6 py-8 text-center text-xs text-neutral-500 font-mono">Loading records...</div>
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
                                    <span class="font-mono text-[10px] text-neutral-400 uppercase" id="active-count">Loading...</span>
                                </div>
                                <div id="active-contracts-list">
                                    <div class="px-6 py-12 text-center text-sm text-neutral-500">Loading active contracts...</div>
                                </div>
                            </div>

                            <!-- Verification Metadata Panel (Right - 1 col) -->
                            <div class="border border-neutral-200 bg-neutral-50 p-6">
                                <h3 class="font-mono text-[11px] text-neutral-900 uppercase tracking-widest mb-5 font-medium">Verification Metadata</h3>
                                <div class="space-y-5">
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Account ID</span>
                                        <span class="text-sm text-neutral-900 flex items-center gap-1.5" id="meta-account-id">
                                            Loading...
                                        </span>
                                    </div>
                                    <div class="flex justify-between items-start">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Stripe Account</span>
                                        <span class="text-sm text-neutral-900 flex items-center gap-1.5" id="meta-stripe">
                                            Loading...
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
                                        <span class="text-sm text-neutral-900" id="meta-identity-created">Loading...</span>
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
                                <div class="px-6 py-12 text-center text-sm text-neutral-500">Loading history...</div>
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
                                <div class="px-6 py-12 text-center text-sm text-neutral-500 font-mono">Loading verification sources...</div>
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
                                    <div class="px-6 py-12 text-center text-sm text-neutral-500 ml-4">Loading event history...</div>
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

    // Helper to format currency
    const formatUSD = (cents) => {
        return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Helper to format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Fetch live profile data
    try {
        const [profile, contractsResponse] = await Promise.all([
            window.api.getProfile(),
            window.api.getContracts()
        ]);

        console.log('[Profile] Loaded data:', { profile, contracts: contractsResponse?.contracts?.length });

        // Check for error response
        if (profile.error) {
            console.error('[Profile] Failed to load profile:', profile.error);
            return;
        }

        const contracts = contractsResponse?.contracts || [];

        // Filter contracts
        const activeContracts = contracts.filter(c => !c.isTerminal);
        const settledContracts = contracts.filter(c => c.isTerminal);

        // --- UPDATE HEADER ---
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

        const identityHashEl = document.getElementById('identity-hash');
        if (identityHashEl && profile.user?.id) {
            identityHashEl.textContent = `USR-${profile.user.id.substring(0, 8).toUpperCase()}`;
        }

        // --- UPDATE STATS ---
        const settlementRateEl = document.getElementById('stat-settlement-rate');
        if (settlementRateEl) {
            // Calculate local if API stats are stale or null
            const total = settledContracts.length;
            const wins = settledContracts.filter(c => c.derivedState === 'SETTLED').length; // Assuming SETTLED is success
            const rate = total > 0 ? ((wins / total) * 100).toFixed(1) : '—';

            // Prefer API stats if available and non-null
            settlementRateEl.textContent = profile.stats.settlementRate !== null ? profile.stats.settlementRate + '%' : (rate === '—' ? '—' : rate + '%');
        }

        const settlementDetailEl = document.getElementById('stat-settlement-detail');
        if (settlementDetailEl) {
            const settledCount = settledContracts.length;
            const totalCount = contracts.length;
            settlementDetailEl.textContent = `${settledCount} of ${totalCount} contracts settled`;
        }

        const totalContractsEl = document.getElementById('stat-total-contracts');
        if (totalContractsEl) {
            totalContractsEl.textContent = contracts.length.toString();
        }

        const sinceDateEl = document.getElementById('stat-since-date');
        if (sinceDateEl && contracts.length > 0) {
            // Find earliest contract
            const earliest = contracts.reduce((min, c) => c.createdAt < min ? c.createdAt : min, contracts[0].createdAt);
            sinceDateEl.textContent = `Since ${formatDate(earliest)}`;
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

        // --- UPDATE METADATA PANELS ---
        const updateMetadata = (prefix) => {
            const accountIdEl = document.getElementById(`meta-account-id${prefix || ''}`);
            if (accountIdEl && profile.user?.id) accountIdEl.innerHTML = `USR-${profile.user.id.substring(0, 5)} <i data-lucide="copy" class="w-3 h-3 text-neutral-400 cursor-pointer"></i>`;

            const stripeEl = document.getElementById(`meta-stripe${prefix || ''}`);
            if (stripeEl) {
                if (profile.stripeConnection?.connected) {
                    stripeEl.innerHTML = `Connected <i data-lucide="external-link" class="w-3 h-3 text-neutral-400"></i>`;
                } else {
                    stripeEl.textContent = 'Not connected';
                }
            }

            const createdEl = document.getElementById(`meta-identity-created${prefix || ''}`);
            if (createdEl && profile.user?.createdAt) createdEl.textContent = formatDate(profile.user.createdAt);

            // First/Last dates for Overview panel specific
            if (!prefix) {
                const firstContractEl = document.getElementById('meta-first-contract');
                if (firstContractEl && contracts.length > 0) {
                    const earliest = contracts.reduce((min, c) => c.createdAt < min ? c.createdAt : min, contracts[0].createdAt);
                    firstContractEl.textContent = formatDate(earliest);
                }

                const lastSettlementEl = document.getElementById('meta-last-settlement');
                if (lastSettlementEl && settledContracts.length > 0) {
                    // contracts sorted by createdAt desc usually, but verify?
                    // Just take the most recent settled
                    const latest = settledContracts[0].createdAt; // Approximation if sorted
                    lastSettlementEl.textContent = formatDate(latest);
                } else if (lastSettlementEl) {
                    lastSettlementEl.textContent = '—';
                }

                const totalLockedEl = document.getElementById('meta-total-locked');
                if (totalLockedEl) {
                    const totalCents = contracts.reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);
                    totalLockedEl.textContent = formatUSD(totalCents) + ' USD';
                }

                const activeCountEl = document.getElementById('meta-active-contracts');
                if (activeCountEl) {
                    activeCountEl.textContent = `${activeContracts.length} Outstanding`;
                }
            }
        };
        updateMetadata('');


        // --- RENDER LISTS ---

        // 1. RECENT OUTCOMES (Overview) & TIMELINE
        const recentOutcomesList = document.getElementById('recent-outcomes-list');
        const timelineList = document.getElementById('timeline-list');

        if (recentOutcomesList) recentOutcomesList.innerHTML = '';
        if (timelineList) {
            timelineList.innerHTML = '<div class="absolute left-6 top-0 bottom-0 w-px bg-neutral-200"></div>';
        }

        if (contracts.length === 0) {
            if (recentOutcomesList) recentOutcomesList.innerHTML = `<div class="px-6 py-6 text-center text-xs text-neutral-500 font-mono">No contracts found.</div>`;
        } else {
            // Take top 5 for recent
            contracts.slice(0, 5).forEach(c => {
                const isSettled = c.isTerminal;
                const stateColor = c.derivedState === 'FORFEITED' ? 'text-red-700' : (isSettled ? 'text-neutral-600' : 'text-emerald-600');

                // Add to Recent Outcomes
                if (recentOutcomesList) {
                    recentOutcomesList.innerHTML += `
                        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 hover:bg-neutral-50">
                            <div class="flex items-center gap-6">
                                <span class="font-mono text-xs text-neutral-900 font-medium">CTR-${c.id.substring(0, 5).toUpperCase()}</span>
                                <span class="font-mono text-xs text-neutral-400">ID: ${c.id.substring(0, 8)}...</span>
                            </div>
                            <div class="flex items-center gap-6">
                                <span class="font-mono text-[10px] text-neutral-400">${formatDate(c.createdAt)}</span>
                                <span class="font-mono text-[10px] uppercase ${stateColor}">${c.derivedState?.replace('_', ' ') || c.state}</span>
                                <span class="font-mono text-sm font-medium text-neutral-900 w-32 text-right">${formatUSD(c.lockAmountUsdCents)}</span>
                            </div>
                        </div>
                      `;
                }

                // Add to Timeline
                if (timelineList) {
                    const isForfeited = c.derivedState === 'FORFEITED';
                    const bgClass = isForfeited ? 'bg-red-50 border-l-2' : '';
                    const borderStyle = isForfeited ? 'border-left-color: #751212;' : '';
                    const dotColor = isForfeited ? 'bg-[#751212]' : 'bg-neutral-400';

                    timelineList.innerHTML += `
                        <div class="relative px-6 py-5 border-b border-neutral-100 ml-4 ${bgClass}" style="${borderStyle}">
                            <div class="absolute left-2 top-6 w-2 h-2 ${dotColor} rounded-full"></div>
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="text-sm font-medium ${isForfeited ? 'text-[#751212]' : 'text-neutral-900'}">${isSettled ? 'Contract Settled' : 'Contract Created'}</h4>
                                    <p class="text-xs text-neutral-500 mt-1">${c.description || 'Performance contract execution'}</p>
                                    <div class="flex gap-4 mt-3">
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase">VALUE: <span class="${isForfeited ? 'text-[#751212]' : 'text-neutral-900'} font-medium">${formatUSD(c.lockAmountUsdCents)}</span></span>
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase">REFERENCE: <span class="text-neutral-600">CTR-${c.id.substring(0, 5).toUpperCase()}</span></span>
                                        <span class="font-mono text-[10px] text-neutral-400 uppercase">STATE: <span class="${stateColor}">${c.derivedState}</span></span>
                                    </div>
                                </div>
                                <span class="font-mono text-[10px] text-neutral-400">${formatDate(c.createdAt)}</span>
                            </div>
                        </div>
                      `;
                }
            });
        }

        // 2. ACTIVE CONTRACTS
        const activeContractsList = document.getElementById('active-contracts-list');
        const activeCountLabel = document.getElementById('active-count');

        if (activeCountLabel) activeCountLabel.textContent = `${activeContracts.length} Outstanding`;

        if (activeContractsList) {
            activeContractsList.innerHTML = '';
            if (activeContracts.length === 0) {
                activeContractsList.innerHTML = `<div class="px-6 py-8 text-center text-sm text-neutral-500">No active contracts.</div>`;
            } else {
                activeContracts.forEach(c => {
                    activeContractsList.innerHTML += `
                        <div class="px-6 py-5 border-b border-neutral-100">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <span class="font-mono text-sm font-medium text-neutral-900">CTR-${c.id.substring(0, 5).toUpperCase()}</span>
                                    <div class="font-mono text-[10px] text-neutral-400 mt-1">PLATFORM: ${c.platform}</div>
                                </div>
                                <div class="text-right">
                                    <span class="font-mono text-sm font-medium text-neutral-900">${formatUSD(c.lockAmountUsdCents)}</span>
                                    <div class="font-mono text-[10px] uppercase mt-1 text-[#751212]">${c.derivedState?.replace('_', ' ') || 'ACTIVE'}</div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                                <div>
                                    <span class="font-mono text-[10px] text-neutral-400 uppercase block mb-1">Locked Value</span>
                                    <span class="font-mono text-sm font-medium text-neutral-900">${formatUSD(c.lockAmountUsdCents)}</span>
                                </div>
                                <div>
                                    <span class="font-mono text-[10px] text-neutral-400 uppercase block mb-1">Deadline</span>
                                    <span class="font-mono text-sm text-neutral-700">${formatDate(c.deadlineUtc)}</span>
                                </div>
                            </div>
                        </div>
                      `;
                });
            }
        }

        // 3. SETTLEMENT HISTORY
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = '';
            if (settledContracts.length === 0) {
                historyList.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <h4 class="font-sans text-sm font-medium text-neutral-700 mb-1">No Settlement History</h4>
                        <p class="font-mono text-[11px] text-neutral-400 max-w-xs">Completed contracts and their outcomes will appear here.</p>
                    </div>`;
            } else {
                settledContracts.forEach(c => {
                    const isForfeited = c.derivedState === 'FORFEITED';
                    const statusColor = isForfeited ? 'text-[#751212]' : 'text-emerald-600';
                    historyList.innerHTML += `
                        <div class="px-6 py-5 border-b border-neutral-100 flex items-center justify-between hover:bg-neutral-50">
                            <div class="flex items-center gap-6">
                                <div>
                                    <span class="font-mono text-sm font-medium text-neutral-900">CTR-${c.id.substring(0, 5).toUpperCase()}</span>
                                    <div class="font-mono text-[10px] text-neutral-400 mt-1">ended ${formatDate(c.deadlineUtc)}</div>
                                </div>
                                <div class="hidden md:block">
                                    <span class="font-mono text-[10px] uppercase tracking-wide px-2 py-1 bg-neutral-100 rounded text-neutral-600">${c.metricType}</span>
                                </div>
                            </div>
                            <div class="text-right flex items-center gap-6">
                                <span class="font-mono text-[10px] uppercase tracking-wide font-medium ${statusColor}">${c.derivedState}</span>
                                <span class="font-mono text-sm font-medium text-neutral-900 w-24">${formatUSD(c.lockAmountUsdCents)}</span>
                            </div>
                        </div>
                     `;
                });
            }
        }

        // 4. CONNECTED SOURCES (Dynamic)
        // Find existing hardcoded elements and update state or remove if not present?
        // Better to regenerate the list to be safe.
        const sourcesTab = document.getElementById('tab-sources');
        const sourcesListContainer = sourcesTab?.querySelector('.divide-y');

        if (sourcesListContainer) {
            sourcesListContainer.innerHTML = '';

            // X / Twitter
            const xConnected = profile.xConnection?.connected;
            sourcesListContainer.innerHTML += `
                <div class="px-6 py-5 flex items-center justify-between ${xConnected ? '' : 'opacity-60 bg-neutral-50'}">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-neutral-900 rounded flex items-center justify-center">
                            <span class="text-white font-bold text-lg">X</span>
                        </div>
                        <div>
                            <h4 class="font-sans text-sm font-medium text-neutral-900">X / Twitter</h4>
                            <p class="font-mono text-[11px] text-neutral-500">${xConnected ? '@' + profile.xConnection.xUsername : 'Not connected'}</p>
                        </div>
                    </div>
                    <span class="font-mono text-[10px] uppercase tracking-wide ${xConnected ? 'text-emerald-600' : 'text-neutral-400'}">${xConnected ? 'Verified' : 'Unverified'}</span>
                </div>
             `;

            // Stripe
            const stripeConnected = profile.stripeConnection?.connected;
            sourcesListContainer.innerHTML += `
                <div class="px-6 py-5 flex items-center justify-between ${stripeConnected ? '' : 'opacity-60 bg-neutral-50'}">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-[#635BFF] rounded flex items-center justify-center">
                            <span class="text-white font-bold text-sm">S</span>
                        </div>
                        <div>
                            <h4 class="font-sans text-sm font-medium text-neutral-900">Stripe</h4>
                            <p class="font-mono text-[11px] text-neutral-500">${stripeConnected ? 'Connected' : 'Not setup'}</p>
                        </div>
                    </div>
                    <span class="font-mono text-[10px] uppercase tracking-wide ${stripeConnected ? 'text-emerald-600' : 'text-neutral-400'}">${stripeConnected ? 'Verified' : 'Unverified'}</span>
                </div>
             `;

            // GitHub (Placeholder for now but dynamic state)
            const githubConnected = profile.githubConnection?.connected;
            sourcesListContainer.innerHTML += `
                <div class="px-6 py-5 flex items-center justify-between ${githubConnected ? '' : 'opacity-60 bg-neutral-50'}">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center">
                            <i data-lucide="github" class="w-5 h-5 text-white"></i>
                        </div>
                        <div>
                            <h4 class="font-sans text-sm font-medium text-neutral-900">GitHub</h4>
                            <p class="font-mono text-[11px] text-neutral-500">${githubConnected ? profile.githubConnection.username : 'Not connected'}</p>
                        </div>
                    </div>
                    <span class="font-mono text-[10px] uppercase tracking-wide ${githubConnected ? 'text-emerald-600' : 'text-neutral-400'}">${githubConnected ? 'Verified' : 'Unverified'}</span>
                </div>
             `;
        }

        // Re-init icons for injected content
        if (window.lucide) {
            window.lucide.createIcons();
        }

    } catch (err) {
        console.error('[Profile] Error loading profile:', err);
    }
}
