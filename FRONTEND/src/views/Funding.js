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
                                    <span class="text-xs text-gray-500 mt-0.5" id="card-status">Configured</span>
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
                                    <span class="text-xs text-gray-500 mt-0.5" id="bank-status">Configured</span>
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
                                    $42,750.00
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
                                    $18,500.00
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
                                    $3,200.00
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
                                            <span class="text-gray-400" id="payout-last-four">•••• 4242</span>
                                        </span>
                                        <span class="text-xs text-gray-400">via Stripe Connect</span>
                                    </div>
                                    <span class="text-xs text-gray-500 mt-0.5" id="payout-status">Configured</span>
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

    try {
        // Fetch user's contracts to calculate locked balance
        const response = await window.api.getContracts();
        const contracts = response?.contracts || [];

        // Calculate locked balance (contracts in active states)
        const activeStates = ['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED', 'FUNDS_LOCKED', 'VERIFIED', 'VERIFYING'];
        const lockedCents = contracts
            .filter(c => activeStates.includes(c.state))
            .reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);

        // Update locked balance display
        const lockedEl = document.getElementById('locked-balance');
        if (lockedEl && lockedCents > 0) {
            lockedEl.textContent = '$' + (lockedCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });
        }

        // Only log in non-production
        if (!isProduction) {
            console.log('[Funding] Calculated locked balance:', lockedCents / 100);
        }

        // Fetch Stripe connection status
        try {
            const stripeStatus = await window.api.getStripeStatus();

            if (stripeStatus?.connected) {
                if (cardStatus) {
                    cardStatus.textContent = 'Configured';
                }
                if (bankStatus) {
                    bankStatus.textContent = 'Configured';
                }
                if (payoutStatus) {
                    payoutStatus.textContent = 'Configured';
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
            if (!isProduction) {
                console.log('[Funding] Stripe status not available:', stripeErr.message);
            }
        }

    } catch (error) {
        if (!isProduction) {
            console.error('[Funding] Error loading funding data:', error);
        }
    }
}
