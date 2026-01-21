// Funding & Payouts View
export function renderFunding() {
    return `
        <div class="min-h-screen bg-gray-50">
            <div class="mx-auto max-w-4xl px-6 py-12">
                <!-- Page Header -->
                <div class="mb-10">
                    <h1 class="mb-2 text-2xl font-medium tracking-tight text-gray-900">
                        Funding & Payouts
                    </h1>
                    <p class="text-sm text-gray-500">
                        Manage capital custody and settlement flows.
                    </p>
                </div>

                <!-- Main Content -->
                <div class="space-y-6">
                    <!-- Funding Sources -->
                    <div class="border border-gray-200 bg-white rounded">
                        <div class="px-5 py-3 border-b border-gray-100">
                            <h2 class="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                                Funding Sources
                            </h2>
                        </div>
                        <div class="divide-y divide-gray-100" id="funding-sources-list">
                            <!-- Card -->
                            <div class="flex items-center justify-between px-5 py-4" id="source-card">
                                <div class="flex flex-col">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm text-gray-900">Card</span>
                                        <span class="text-xs text-gray-400">via Stripe</span>
                                    </div>
                                    <span class="text-xs text-gray-400 mt-0.5" id="card-status">Loading...</span>
                                </div>
                                <button id="manage-card-btn" onclick="window.app.addCard()" class="flex items-center gap-1.5 border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded">
                                    <i data-lucide="settings" class="w-3 h-3"></i>
                                    Manage
                                </button>
                            </div>
                            <!-- Bank Account -->
                            <div class="flex items-center justify-between px-5 py-4" id="source-bank">
                                <div class="flex flex-col">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm text-gray-900">Bank Account</span>
                                        <span class="text-xs text-gray-400">via Stripe Connect</span>
                                    </div>
                                    <span class="text-xs text-gray-400 mt-0.5" id="bank-status">Loading...</span>
                                </div>
                                <button id="manage-bank-btn" onclick="window.app.setupPayout()" class="flex items-center gap-1.5 border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded">
                                    <i data-lucide="settings" class="w-3 h-3"></i>
                                    Manage
                                </button>
                            </div>
                        </div>
                        <div class="px-5 py-3 border-t border-gray-100">
                            <button id="add-source-btn" class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
                                <i data-lucide="plus" class="w-3 h-3"></i>
                                Add Source
                            </button>
                        </div>
                    </div>

                    <!-- Balance State -->
                    <div class="border border-gray-200 bg-white rounded">
                        <div class="px-5 py-3 border-b border-gray-100">
                            <h2 class="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                                Balance State
                            </h2>
                        </div>
                        <div class="grid grid-cols-3 divide-x divide-gray-100">
                            <!-- Available Balance -->
                            <div class="px-5 py-5">
                                <div class="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
                                    Available Balance
                                </div>
                                <div class="text-2xl tabular-nums text-gray-900 mb-1" id="available-balance">
                                    $0.00
                                </div>
                                <div class="text-xs text-gray-400">
                                    Capital not currently locked
                                </div>
                            </div>
                            <!-- Locked in Contracts -->
                            <div class="px-5 py-5">
                                <div class="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
                                    Locked in Contracts
                                </div>
                                <div class="text-2xl tabular-nums mb-1" style="color: #b45309;" id="locked-balance">
                                    $0.00
                                </div>
                                <div class="text-xs text-gray-400">
                                    Capital actively committed and at risk
                                </div>
                            </div>
                            <!-- Pending Payout -->
                            <div class="px-5 py-5">
                                <div class="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
                                    Pending Payout
                                </div>
                                <div class="text-2xl tabular-nums mb-1" style="color: #1e40af;" id="pending-payout">
                                    $0.00
                                </div>
                                <div class="text-xs text-gray-400">
                                    Capital released but not yet transferred
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payout Destinations -->
                    <div class="border border-gray-200 bg-white rounded">
                        <div class="px-5 py-3 border-b border-gray-100">
                            <h2 class="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                                Payout Destinations
                            </h2>
                        </div>
                        <div class="divide-y divide-gray-100" id="payout-destinations-list">
                            <!-- Bank Account Destination -->
                            <div class="flex items-center justify-between px-5 py-4" id="destination-bank">
                                <div class="flex flex-col">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm text-gray-900">
                                            Bank Account
                                            <span class="text-gray-400" id="payout-last-four"></span>
                                        </span>
                                        <span class="text-xs text-gray-400">via Stripe Connect</span>
                                    </div>
                                    <span class="text-xs text-gray-400 mt-0.5" id="payout-status">Loading...</span>
                                </div>
                                <button id="manage-payout-btn" onclick="window.app.setupPayout()" class="flex items-center gap-1.5 border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded">
                                    <i data-lucide="settings" class="w-3 h-3"></i>
                                    Manage
                                </button>
                            </div>
                        </div>
                        <div class="px-5 py-3 border-t border-gray-100">
                            <button id="add-destination-btn" class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
                                <i data-lucide="plus" class="w-3 h-3"></i>
                                Add Destination
                            </button>
                        </div>
                        <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 rounded-b">
                            <p class="text-xs text-gray-500">
                                Payouts occur only after contract settlement.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Helper to format USD amounts
function formatUSD(cents) {
    const dollars = cents / 100;
    return '$' + dollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function initFunding() {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Check if we're on production
    const isProduction = window.location.hostname === 'collateral.market';

    // Get UI elements
    const cardStatus = document.getElementById('card-status');
    const bankStatus = document.getElementById('bank-status');
    const payoutStatus = document.getElementById('payout-status');
    const payoutLastFour = document.getElementById('payout-last-four');
    const availableBalanceEl = document.getElementById('available-balance');
    const lockedBalanceEl = document.getElementById('locked-balance');
    const pendingPayoutEl = document.getElementById('pending-payout');

    try {
        // Fetch all contracts to calculate balances
        const response = await window.api.getContracts();
        const contracts = response?.contracts || [];

        if (!isProduction) {
            console.log('[Funding] Loaded contracts:', contracts.length);
        }

        // Contract state categories
        const lockedStates = ['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED', 'FUNDS_LOCKED', 'VERIFIED', 'VERIFYING'];
        const pendingPayoutStates = ['SETTLED', 'PAYOUT_PENDING'];
        const completedStates = ['PAYOUT_COMPLETE', 'COMPLETED'];

        // Calculate LOCKED balance (contracts actively at risk)
        const lockedCents = contracts
            .filter(c => lockedStates.includes(c.state))
            .reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);

        // Calculate PENDING PAYOUT (settled but not yet transferred)
        const pendingCents = contracts
            .filter(c => pendingPayoutStates.includes(c.state))
            .reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);

        // Calculate total ever locked (for available balance context)
        const totalLockedEver = contracts
            .reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);

        // Calculate total completed payouts
        const completedCents = contracts
            .filter(c => completedStates.includes(c.state))
            .reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);

        // Update LOCKED balance
        if (lockedBalanceEl) {
            lockedBalanceEl.textContent = formatUSD(lockedCents);
        }

        // Update PENDING PAYOUT
        if (pendingPayoutEl) {
            pendingPayoutEl.textContent = formatUSD(pendingCents);
        }

        // For Available Balance, try to get from profile or calculate
        // Available = deposited funds not currently locked
        // Since we don't have a deposit tracking system yet, show $0 or estimate
        if (availableBalanceEl) {
            // Try to fetch from profile stats if available
            try {
                const profile = await window.api.getProfile();
                if (profile?.stats?.availableBalanceUsdCents !== undefined) {
                    availableBalanceEl.textContent = formatUSD(profile.stats.availableBalanceUsdCents);
                } else {
                    // Show $0.00 if no available balance data
                    availableBalanceEl.textContent = formatUSD(0);
                }
            } catch (profileErr) {
                // No profile data available
                availableBalanceEl.textContent = formatUSD(0);
            }
        }

        if (!isProduction) {
            console.log('[Funding] Balance state:', {
                locked: lockedCents / 100,
                pending: pendingCents / 100,
                completed: completedCents / 100
            });
        }

        // Fetch Stripe connection status
        try {
            const stripeStatus = await window.api.getStripeStatus();

            if (stripeStatus?.connected) {
                // Connected
                if (cardStatus) {
                    cardStatus.textContent = 'Configured';
                    cardStatus.classList.remove('text-gray-400');
                    cardStatus.classList.add('text-gray-600');
                }
                if (bankStatus) {
                    bankStatus.textContent = 'Configured';
                    bankStatus.classList.remove('text-gray-400');
                    bankStatus.classList.add('text-gray-600');
                }
                if (payoutStatus) {
                    payoutStatus.textContent = 'Configured';
                    payoutStatus.classList.remove('text-gray-400');
                    payoutStatus.classList.add('text-gray-600');
                }
                if (payoutLastFour && stripeStatus.lastFour) {
                    payoutLastFour.textContent = '•••• ' + stripeStatus.lastFour;
                }
            } else {
                // Not connected
                if (cardStatus) cardStatus.textContent = 'Not configured';
                if (bankStatus) bankStatus.textContent = 'Not configured';
                if (payoutStatus) payoutStatus.textContent = 'Not configured';
                if (payoutLastFour) payoutLastFour.textContent = '';
            }
        } catch (stripeErr) {
            // Stripe status not available
            if (cardStatus) cardStatus.textContent = 'Not configured';
            if (bankStatus) bankStatus.textContent = 'Not configured';
            if (payoutStatus) payoutStatus.textContent = 'Not configured';

            if (!isProduction) {
                console.log('[Funding] Stripe status not available:', stripeErr.message);
            }
        }

    } catch (error) {
        // Handle contract fetch error
        if (cardStatus) cardStatus.textContent = 'Error loading';
        if (bankStatus) bankStatus.textContent = 'Error loading';
        if (payoutStatus) payoutStatus.textContent = 'Error loading';

        if (!isProduction) {
            console.error('[Funding] Error loading funding data:', error);
        }
    }
}
