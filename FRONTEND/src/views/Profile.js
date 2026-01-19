// Profile View - Identity Record
export function renderProfile() {
    return `
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 mb-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-8">
                <span>Collateral</span>
                <span>›</span>
                <span class="text-neutral-900">Identity Record</span>
            </div>

            <!-- Profile Header -->
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                    <h1 class="font-display text-4xl md:text-5xl font-normal text-[#921818] tracking-tight mb-2" id="profile-display-name">Alexander Doe</h1>
                    <div class="flex items-center gap-3">
                        <span class="font-mono text-sm text-neutral-500" id="profile-handle">@alex_dev</span>
                        <span class="text-neutral-300">•</span>
                        <span class="font-mono text-[11px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-sm">0x8a7...b21</span>
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button class="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 bg-white text-neutral-600 text-[11px] font-medium uppercase tracking-wide hover:border-neutral-400 transition-colors">
                        <i data-lucide="link" class="w-3.5 h-3.5"></i>
                        Copy Record Link
                    </button>
                    <button onclick="window.app.openSettingsModal()" class="flex items-center gap-2 px-4 py-2.5 bg-[#921818] text-white text-[11px] font-medium uppercase tracking-wide hover:bg-[#751212] transition-colors">
                        <i data-lucide="settings" class="w-3.5 h-3.5"></i>
                        Settings
                    </button>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 mb-10">
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Settlement Rate</span>
                    <span class="font-display text-3xl font-medium text-neutral-900" id="stat-settlement-rate">—</span>
                    <p class="font-mono text-[9px] text-neutral-400 mt-1">Derived from settled vs forfeited contracts</p>
                </div>
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Total Contracts</span>
                    <span class="font-display text-3xl font-medium text-neutral-900" id="stat-total-contracts">—</span>
                </div>
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">TVL (Settled)</span>
                    <span class="font-display text-3xl font-medium text-neutral-900" id="stat-tvl">—</span>
                </div>
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Forfeited</span>
                    <span class="font-display text-3xl font-medium text-[#921818]" id="stat-forfeited">—</span>
                </div>
            </div>

            <!-- Tabs -->
            <div class="flex gap-0 border-b border-neutral-200 mb-8 overflow-x-auto">
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-neutral-900 text-neutral-900 font-medium whitespace-nowrap" data-tab="overview">Overview</button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="contracts">Active Contracts <span class="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded ml-1">—</span></button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="history">Settlement History</button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="sources">Connected Sources</button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="timeline">Identity Timeline</button>
            </div>

            <!-- Tab Content Container -->
            <div id="tab-content">
                <!-- Overview Tab (default) -->
                <div id="tab-overview" class="tab-panel">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="md:col-span-2 border border-neutral-200 bg-white p-6">
                            <h3 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">Identity Summary</h3>
                            <p class="text-sm text-neutral-600 leading-relaxed">
                                Summary of this identity's historical contract performance. This record aggregates cryptographic proof of executed commitments, settlement rates, and total value locked across all connected verification sources. This account maintains a high settlement standing with minimal forfeiture history.
                            </p>
                        </div>
                        <div class="border border-neutral-200 bg-neutral-50 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-mono text-[10px] text-[#921818] uppercase tracking-widest font-medium">Identity Metadata</h3>
                                <i data-lucide="lock" class="w-3.5 h-3.5 text-neutral-300"></i>
                            </div>
                            <div class="space-y-4">
                                <div>
                                    <span class="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block mb-1">Bio</span>
                                    <p class="text-sm text-neutral-700">Full-stack developer building on-chain accountability tools.</p>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">Verified</span>
                                    <span class="flex items-center gap-1.5 text-[#1F7A4D] text-sm font-medium">
                                        <i data-lucide="check-circle" class="w-4 h-4"></i>
                                        True
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Active Contracts Tab -->
                <div id="tab-contracts" class="tab-panel hidden">
                    <div id="contracts-list" class="border border-neutral-200 bg-white overflow-hidden">
                        <!-- Empty State -->
                        <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <div class="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                <i data-lucide="file-text" class="w-6 h-6 text-neutral-400"></i>
                            </div>
                            <h4 class="font-sans text-sm font-medium text-neutral-700 mb-1">No Active Contracts</h4>
                            <p class="font-mono text-[11px] text-neutral-400 max-w-xs">Create your first performance contract to start building your accountability record.</p>
                            <button onclick="window.router.navigate('/contracts')" class="mt-4 px-4 py-2 bg-neutral-900 text-white text-[11px] font-mono uppercase tracking-wide hover:bg-neutral-800 transition-colors">
                                Create Contract
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Settlement History Tab -->
                <div id="tab-history" class="tab-panel hidden">
                    <div id="history-list" class="border border-neutral-200 bg-white overflow-hidden">
                        <!-- Empty State -->
                        <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <div class="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                <i data-lucide="history" class="w-6 h-6 text-neutral-400"></i>
                            </div>
                            <h4 class="font-sans text-sm font-medium text-neutral-700 mb-1">No Settlement History</h4>
                            <p class="font-mono text-[11px] text-neutral-400 max-w-xs">Completed contracts and their outcomes will appear here.</p>
                        </div>
                    </div>
                </div>

                <!-- Connected Sources Tab -->
                <div id="tab-sources" class="tab-panel hidden">
                    <!-- Alert for new users -->
                    <div id="sources-alert" class="bg-[rgba(161,130,57,0.06)] border border-[#A18239]/30 p-4 mb-6">
                        <p class="font-sans text-sm text-[#A18239] font-medium mb-1">Connect verification sources to create contracts</p>
                        <p class="font-mono text-[10px] text-[#A18239]/70 uppercase tracking-widest">At least one source required for contract execution.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- X / Twitter -->
                        <div id="source-twitter" class="border border-neutral-200 bg-white p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-neutral-900 rounded flex items-center justify-center">
                                    <span class="text-white font-bold text-lg">X</span>
                                </div>
                                <div>
                                    <h4 class="font-sans text-sm font-medium text-neutral-900">X / Twitter</h4>
                                    <p class="font-mono text-[11px] text-neutral-400" id="twitter-status">Not connected</p>
                                </div>
                            </div>
                            <button onclick="window.app.connectSource('twitter')" id="twitter-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                                Connect
                            </button>
                        </div>
                        
                        <!-- GitHub -->
                        <div id="source-github" class="border border-neutral-200 bg-white p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center">
                                    <i data-lucide="github" class="w-5 h-5 text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-sans text-sm font-medium text-neutral-900">GitHub</h4>
                                    <p class="font-mono text-[11px] text-neutral-400" id="github-status">Not connected</p>
                                </div>
                            </div>
                            <button onclick="window.app.connectSource('github')" id="github-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                                Connect
                            </button>
                        </div>
                        
                        <!-- Stripe -->
                        <div id="source-stripe" class="border border-neutral-200 bg-white p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-[#635BFF] rounded flex items-center justify-center">
                                    <span class="text-white font-bold text-sm">S</span>
                                </div>
                                <div>
                                    <h4 class="font-sans text-sm font-medium text-neutral-900">Stripe</h4>
                                    <p class="font-mono text-[11px] text-neutral-400" id="stripe-status">Not connected</p>
                                </div>
                            </div>
                            <button onclick="window.app.connectSource('stripe')" id="stripe-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                                Connect
                            </button>
                        </div>
                        
                        <!-- Add More -->
                        <div class="border border-dashed border-neutral-300 bg-neutral-50 p-6 flex items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors">
                            <div class="flex items-center gap-2 text-neutral-400">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                                <span class="font-mono text-[11px] uppercase tracking-wide">More Sources Coming</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Identity Timeline Tab -->
                <div id="tab-timeline" class="tab-panel hidden">
                    <div id="timeline-list" class="border border-neutral-200 bg-white overflow-hidden">
                        <!-- Empty State -->
                        <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <div class="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                <i data-lucide="clock" class="w-6 h-6 text-neutral-400"></i>
                            </div>
                            <h4 class="font-sans text-sm font-medium text-neutral-700 mb-1">Identity Timeline</h4>
                            <p class="font-mono text-[11px] text-neutral-400 max-w-xs">Your account activity and connection events will appear here as they happen.</p>
                        </div>
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
        console.log('[Profile] Identity from API:', profile.identity);
        console.log('[Profile] appState.displayName:', window.appState?.displayName);

        // Check for error response (API returns raw data, not wrapped with ok field)
        if (profile.error) {
            console.error('[Profile] Failed to load profile:', profile.error);
            return;
        }

        // Update display name - identity from DATABASE is CANONICAL (NO email fallbacks)
        const displayNameEl = document.getElementById('profile-display-name');
        if (displayNameEl) {
            if (profile.identity?.displayName) {
                displayNameEl.textContent = profile.identity.displayName;
                console.log('[Profile] ✅ Using identity displayName:', profile.identity.displayName);
            } else if (profile.identity?.username) {
                displayNameEl.textContent = profile.identity.username;
                console.log('[Profile] ✅ Using identity username as displayName:', profile.identity.username);
            } else {
                displayNameEl.textContent = 'UNCLAIMED IDENTITY';
                console.log('[Profile] ⚠️ No identity found');
            }
        }

        // Update handle - identity.username is CANONICAL (NO email fallbacks)
        const handleEl = document.getElementById('profile-handle');
        if (handleEl) {
            if (profile.identity?.username) {
                handleEl.textContent = '@' + profile.identity.username;
                console.log('[Profile] ✅ Using identity handle:', profile.identity.username);
            } else {
                handleEl.textContent = '@—';
                console.log('[Profile] ⚠️ No identity handle');
            }
        }

        // Update stats
        const settlementRateEl = document.getElementById('stat-settlement-rate');
        if (settlementRateEl) {
            // null = new user with no completed contracts
            settlementRateEl.textContent = profile.stats.settlementRate !== null
                ? profile.stats.settlementRate + '%'
                : '—';
        }

        const totalContractsEl = document.getElementById('stat-total-contracts');
        if (totalContractsEl) {
            totalContractsEl.textContent = profile.stats.totalContracts.toString();
        }

        const tvlEl = document.getElementById('stat-tvl');
        if (tvlEl) {
            tvlEl.textContent = '$' + profile.stats.tvlSettledUsd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }

        const forfeitedEl = document.getElementById('stat-forfeited');
        if (forfeitedEl) {
            forfeitedEl.textContent = profile.stats.forfeitedContracts.toString();
        }

        // Update active contracts badge
        const activeContractsBadge = document.querySelector('.profile-tab[data-tab="contracts"] span');
        if (activeContractsBadge) {
            activeContractsBadge.textContent = profile.stats.activeContracts.toString();
        }

        // Update X connection status
        const twitterStatusEl = document.getElementById('twitter-status');
        const twitterBtnEl = document.getElementById('twitter-btn');
        if (profile.xConnection?.connected) {
            if (twitterStatusEl) {
                twitterStatusEl.textContent = '@' + (profile.xConnection.xUsername || 'connected') + ' • Connected';
                twitterStatusEl.classList.remove('text-neutral-400');
                twitterStatusEl.classList.add('text-[#1F7A4D]');
            }
            if (twitterBtnEl) {
                // Show "Connected" and disable (we don't support disconnect yet)
                twitterBtnEl.textContent = 'Connected';
                twitterBtnEl.disabled = true;
                twitterBtnEl.removeAttribute('onclick');
                twitterBtnEl.classList.add('opacity-50', 'cursor-not-allowed');
                twitterBtnEl.classList.remove('hover:border-neutral-400', 'hover:text-neutral-900');
            }
        }

        // Update Stripe connection status
        const stripeStatusEl = document.getElementById('stripe-status');
        const stripeBtnEl = document.getElementById('stripe-btn');
        if (profile.stripeConnection?.connected) {
            if (stripeStatusEl) {
                stripeStatusEl.textContent = (profile.stripeConnection.accountId || 'acct_xxx') + ' • Connected';
                stripeStatusEl.classList.remove('text-neutral-400');
                stripeStatusEl.classList.add('text-[#1F7A4D]');
            }
            if (stripeBtnEl) {
                stripeBtnEl.textContent = 'Connected';
                stripeBtnEl.disabled = true;
                stripeBtnEl.removeAttribute('onclick');
                stripeBtnEl.classList.add('opacity-50', 'cursor-not-allowed');
                stripeBtnEl.classList.remove('hover:border-neutral-400', 'hover:text-neutral-900');
            }
        }

        // Hide "Connect verification sources" alert when any platform is connected
        const alertEl = document.getElementById('sources-alert');
        const anyConnected = profile.xConnection?.connected || profile.stripeConnection?.connected;
        if (alertEl && anyConnected) {
            alertEl.classList.add('hidden');
        }

        // Fetch and render contracts
        try {
            const contractsResponse = await window.api.getContracts();
            const contracts = contractsResponse?.contracts || [];
            const contractsList = document.getElementById('contracts-list');

            console.log('[Profile] Loaded contracts:', contracts.length);

            if (contracts.length > 0 && contractsList) {
                // Helper functions
                function formatCurrency(cents) {
                    if (!cents) return '-';
                    return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });
                }

                function formatDate(isoString) {
                    if (!isoString) return '-';
                    const date = new Date(isoString);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }

                function getStatusText(state) {
                    const map = {
                        'CREATED': 'Created', 'FUNDS_AUTHORIZED': 'Pending', 'FUNDS_LOCKED': 'Funded',
                        'LOCKED': 'Active', 'ACTIVE': 'Active', 'EXECUTION_CONFIRMED': 'Executed',
                        'VERIFIED': 'Verified', 'SETTLED_SUCCESS': 'Settled', 'SETTLED_FAILURE': 'Forfeited'
                    };
                    return map[state] || state;
                }

                function getStatusClass(state) {
                    if (['SETTLED_SUCCESS', 'SETTLED'].includes(state)) return 'bg-green-100 text-green-800';
                    if (['SETTLED_FAILURE', 'FORFEITED'].includes(state)) return 'bg-red-100 text-red-800';
                    if (['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED'].includes(state)) return 'bg-neutral-900 text-white';
                    return 'bg-neutral-100 text-neutral-800';
                }

                let html = '';
                contracts.forEach(c => {
                    html += `
                        <div class="flex items-center justify-between p-4 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer" onclick="window.router.navigate('/receipts/${c.id}')">
                            <div class="flex items-center gap-4">
                                <div>
                                    <div class="font-mono text-xs text-neutral-500">${c.id.slice(0, 8)}...</div>
                                    <div class="font-sans text-sm font-medium">${formatCurrency(c.lockAmountUsdCents)}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="text-right">
                                    <div class="font-mono text-[10px] text-neutral-400 uppercase">${formatDate(c.createdAt)}</div>
                                </div>
                                <span class="px-2 py-1 text-[10px] font-mono uppercase ${getStatusClass(c.state)}">${getStatusText(c.state)}</span>
                            </div>
                        </div>
                    `;
                });

                contractsList.innerHTML = html;
            }
        } catch (contractsErr) {
            console.error('[Profile] Error loading contracts:', contractsErr);
        }

    } catch (err) {
        console.error('[Profile] Error loading profile:', err);
    }
}
