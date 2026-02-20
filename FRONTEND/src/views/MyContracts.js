// My Contracts View - Fetches and displays real contracts
export function renderMyContracts() {
    return `
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 mb-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-8">
                <span>Collateral</span>
                <span>›</span>
                <span class="text-neutral-900">My Contracts</span>
            </div>

            <!-- Profile Header -->
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                    <h1 id="mycontracts-displayname" class="font-display text-4xl md:text-5xl font-normal text-[#921818] tracking-tight mb-2">Loading...</h1>
                    <div class="flex items-center gap-3">
                        <span id="mycontracts-handle" class="font-mono text-sm text-neutral-500">@...</span>
                        <span class="text-neutral-300">•</span>
                        <span id="mycontracts-userid" class="font-mono text-[11px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-sm">...</span>
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button onclick="window.router.navigate('/profile')" class="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 bg-white text-neutral-600 text-[11px] font-medium uppercase tracking-wide hover:border-neutral-400 transition-colors">
                        <i data-lucide="user" class="w-3.5 h-3.5"></i>
                        View Profile
                    </button>
                    <button onclick="window.router.navigate('/contracts')" class="flex items-center gap-2 px-4 py-2.5 bg-[#921818] text-white text-[11px] font-medium uppercase tracking-wide hover:bg-[#751212] transition-colors">
                        <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                        New Contract
                    </button>
                </div>
            </div>

            <!-- Tabs -->
            <div class="flex gap-0 border-b border-neutral-200 mb-8">
                <button class="contracts-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-neutral-900 text-neutral-900 font-medium" data-tab="overview">Overview</button>
                <button class="contracts-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600" data-tab="active">All Contracts <span id="contracts-count-badge" class="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded ml-1">0</span></button>
            </div>

            <!-- Tab Content -->
            <div id="contracts-tab-content">
                <!-- Overview Tab -->
                <div id="contracts-tab-overview" class="contracts-panel">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">My Contracts</h3>
                        <button onclick="window.router.navigate('/my-contracts')" class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900">View all contracts</button>
                    </div>
                    
                    <!-- Contract Cards - populated by JS -->
                    <div id="contracts-cards-container" class="space-y-4">
                        <div class="text-center py-8 text-neutral-400 font-mono text-sm">Loading contracts...</div>
                    </div>
                </div>

                <!-- All Contracts Tab (Table View) -->
                <div id="contracts-tab-active" class="contracts-panel hidden">
                    <div class="border border-neutral-200 bg-white overflow-hidden">
                        <table class="w-full">
                            <thead class="border-b border-neutral-200">
                                <tr>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">ID</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Platform</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Status</th>
                                    <th class="text-right py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Amount</th>
                                    <th class="text-right py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody id="contracts-table-body" class="divide-y divide-neutral-100">
                                <tr><td colspan="5" class="py-8 text-center text-neutral-400 font-mono text-sm">Loading...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function initMyContracts() {
    const tabs = document.querySelectorAll('.contracts-tab');
    const panels = document.querySelectorAll('.contracts-panel');

    // Tab switching
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
            panels.forEach(panel => panel.classList.add('hidden'));
            const targetPanel = document.getElementById('contracts-tab-' + targetTab);
            if (targetPanel) targetPanel.classList.remove('hidden');

            if (window.lucide) window.lucide.createIcons();
        });
    });

    if (window.lucide) window.lucide.createIcons();

    // Fetch profile data
    try {
        const profile = await window.api.getProfile();

        const displayNameEl = document.getElementById('mycontracts-displayname');
        const handleEl = document.getElementById('mycontracts-handle');
        const userIdEl = document.getElementById('mycontracts-userid');

        if (displayNameEl && profile.identity?.displayName) {
            displayNameEl.textContent = profile.identity.displayName;
        } else if (displayNameEl && profile.identity?.username) {
            displayNameEl.textContent = profile.identity.username;
        }

        if (handleEl && profile.identity?.username) {
            handleEl.textContent = '@' + profile.identity.username;
        }

        if (userIdEl && profile.user?.id) {
            userIdEl.textContent = profile.user.id.slice(0, 7) + '...';
        }
    } catch (err) {
        console.error('[MyContracts] Error loading profile:', err);
    }

    // Fetch and render contracts
    try {
        const response = await window.api.getContracts();
        const contracts = response?.contracts || [];

        console.log('[MyContracts] Loaded contracts:', contracts.length);

        // Update badge
        const badge = document.getElementById('contracts-count-badge');
        if (badge) badge.textContent = contracts.length.toString();

        // Helper functions
        function formatCurrency(cents) {
            if (!cents) return '-';
            return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });
        }

        function getStatusText(state) {
            const map = {
                'CREATED': 'Created', 'FUNDS_AUTHORIZED': 'Pending', 'FUNDS_LOCKED': 'Funded',
                'LOCKED': 'Active', 'ACTIVE': 'Active', 'EXECUTION_CONFIRMED': 'Executed',
                'VERIFIED': 'Verified', 'VERIFYING': 'Verifying',
                'SETTLED_SUCCESS': 'Settled', 'SETTLED': 'Settled',
                'SETTLED_FAILURE': 'Forfeited', 'FORFEITED': 'Forfeited'
            };
            return map[state] || state;
        }

        function getStatusColor(state) {
            if (['SETTLED_SUCCESS', 'SETTLED'].includes(state)) return 'text-green-600';
            if (['SETTLED_FAILURE', 'FORFEITED'].includes(state)) return 'text-red-600';
            if (['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED'].includes(state)) return 'text-neutral-900 font-medium';
            return 'text-neutral-500';
        }

        function getPlatformName(platform) {
            if (platform === 'x' || platform === 'twitter') return 'X (Twitter)';
            if (platform === 'stripe') return 'Stripe';
            if (platform === 'github') return 'GitHub';
            return platform || 'Unknown';
        }

        // Render cards view
        const cardsContainer = document.getElementById('contracts-cards-container');
        if (cardsContainer) {
            if (contracts.length === 0) {
                cardsContainer.innerHTML = `
                    <div class="border border-neutral-200 bg-white p-8 text-center">
                        <div class="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="file-text" class="w-6 h-6 text-neutral-400"></i>
                        </div>
                        <h4 class="font-sans text-sm font-medium text-neutral-700 mb-1">No Contracts Yet</h4>
                        <p class="font-mono text-[11px] text-neutral-400 mb-4">Create your first performance contract to get started.</p>
                        <button onclick="window.router.navigate('/contracts')" class="px-4 py-2 bg-neutral-900 text-white text-[11px] font-mono uppercase tracking-wide hover:bg-neutral-800">
                            Create Contract
                        </button>
                    </div>
                `;
            } else {
                let cardsHtml = '';
                contracts.forEach(c => {
                    cardsHtml += `
                        <div class="border border-neutral-200 bg-white p-6 hover:border-neutral-300 transition-colors cursor-pointer" onclick="window.router.navigate('/contracts/${c.id}')">
                            <div class="flex justify-between items-start mb-3">
                                <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">${getPlatformName(c.platform)}</span>
                                <span class="font-mono text-sm text-neutral-900">${formatCurrency(c.lockAmountUsdCents)} <span class="${getStatusColor(c.state)}">${getStatusText(c.state)}</span></span>
                            </div>
                            <h4 class="font-sans text-lg font-medium text-neutral-900 mb-2">${c.id.slice(0, 8)}...</h4>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 text-neutral-500">
                                    <i data-lucide="${c.platform === 'x' || c.platform === 'twitter' ? 'twitter' : 'credit-card'}" class="w-4 h-4"></i>
                                    <span class="font-mono text-[11px]">${getPlatformName(c.platform)}</span>
                                </div>
                                <span class="font-mono text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 uppercase tracking-wide">
                                    View Contract <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                </span>
                            </div>
                        </div>
                    `;
                });
                cardsContainer.innerHTML = cardsHtml;
            }
        }

        // Render table view
        const tableBody = document.getElementById('contracts-table-body');
        if (tableBody) {
            if (contracts.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-neutral-400 font-mono text-sm">No contracts found</td></tr>`;
            } else {
                let tableHtml = '';
                contracts.forEach(c => {
                    tableHtml += `
                        <tr class="hover:bg-neutral-50">
                            <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">${c.id.slice(0, 8)}...</td>
                            <td class="py-4 px-4 font-sans text-sm text-neutral-900">${getPlatformName(c.platform)}</td>
                            <td class="py-4 px-4 font-mono text-[11px] ${getStatusColor(c.state)}">${getStatusText(c.state)}</td>
                            <td class="py-4 px-4 font-mono text-sm text-neutral-900 text-right">${formatCurrency(c.lockAmountUsdCents)}</td>
                            <td class="py-4 px-4 text-right">
                                <button onclick="window.router.navigate('/contracts/${c.id}')" class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900 uppercase">View</button>
                            </td>
                        </tr>
                    `;
                });
                tableBody.innerHTML = tableHtml;
            }
        }

        if (window.lucide) window.lucide.createIcons();

    } catch (err) {
        console.error('[MyContracts] Error loading contracts:', err);
        const cardsContainer = document.getElementById('contracts-cards-container');
        if (cardsContainer) {
            cardsContainer.innerHTML = `<div class="text-center py-8 text-red-500 font-mono text-sm">Error loading contracts: ${err.message}</div>`;
        }
    }
}
