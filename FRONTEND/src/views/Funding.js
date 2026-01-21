// Funding & Payouts View
export function renderFunding() {
    return `
        <div class="min-h-screen bg-gray-50">
            <div class="mx-auto max-w-6xl px-6 py-12">
                <!-- Page Header -->
                <div class="mb-12">
                    <h1 class="mb-2 text-2xl tracking-tight text-gray-900">
                        Funding & Payouts
                    </h1>
                    <p class="text-sm text-gray-500">
                        Manage capital custody and settlement flows.
                    </p>
                </div>

                <!-- Main Content -->
                <div class="space-y-8">
                    <!-- Funding Sources -->
                    <div class="border border-gray-200 bg-white">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h2 class="text-xs uppercase tracking-wider text-gray-500">
                                Funding Sources
                            </h2>
                        </div>
                        <div class="divide-y divide-gray-200" id="funding-sources-list">
                            <!-- Card -->
                            <div class="flex items-center justify-between px-6 py-4" id="source-card">
                                <div class="flex flex-col gap-1">
                                    <div class="flex items-center gap-3">
                                        <span class="text-sm text-gray-900">Card</span>
                                        <span class="text-xs text-gray-400">via Stripe</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs text-gray-400" id="card-status">Not configured</span>
                                    </div>
                                </div>
                                <button id="manage-card-btn" onclick="window.app.addCard()" class="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                                    <i data-lucide="settings" class="w-3.5 h-3.5"></i>
                                    Manage
                                </button>
                            </div>
                            <!-- Bank Account -->
                            <div class="flex items-center justify-between px-6 py-4" id="source-bank">
                                <div class="flex flex-col gap-1">
                                    <div class="flex items-center gap-3">
                                        <span class="text-sm text-gray-900">Bank Account</span>
                                        <span class="text-xs text-gray-400">via Stripe Connect</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs text-gray-400" id="bank-status">Not configured</span>
                                    </div>
                                </div>
                                <button id="manage-bank-btn" onclick="window.app.setupPayout()" class="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                                    <i data-lucide="settings" class="w-3.5 h-3.5"></i>
                                    Manage
                                </button>
                            </div>
                        </div>
                        <div class="border-t border-gray-200 px-6 py-4">
                            <button id="add-source-btn" class="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900">
                                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                                Add Source
                            </button>
                        </div>
                    </div>

                    <!-- Balance State -->
                    <div class="border border-gray-200 bg-white">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h2 class="text-xs uppercase tracking-wider text-gray-500">
                                Balance State
                            </h2>
                        </div>
                        <div class="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0">
                            <!-- Available Balance -->
                            <div class="px-6 py-6">
                                <div class="flex flex-col gap-3">
                                    <div class="text-xs uppercase tracking-wider text-gray-400">
                                        Available Balance
                                    </div>
                                    <div class="text-2xl tabular-nums text-gray-900" id="available-balance">
                                        $0.00
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        Capital not currently locked
                                    </div>
                                </div>
                            </div>
                            <!-- Locked in Contracts -->
                            <div class="px-6 py-6">
                                <div class="flex flex-col gap-3">
                                    <div class="text-xs uppercase tracking-wider text-gray-400">
                                        Locked in Contracts
                                    </div>
                                    <div class="text-2xl tabular-nums text-amber-900" id="locked-balance">
                                        $0.00
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        Capital actively committed and at risk
                                    </div>
                                </div>
                            </div>
                            <!-- Pending Payout -->
                            <div class="px-6 py-6">
                                <div class="flex flex-col gap-3">
                                    <div class="text-xs uppercase tracking-wider text-gray-400">
                                        Pending Payout
                                    </div>
                                    <div class="text-2xl tabular-nums text-blue-900" id="pending-payout">
                                        $0.00
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        Capital released but not yet transferred
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payout Destinations -->
                    <div class="border border-gray-200 bg-white">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h2 class="text-xs uppercase tracking-wider text-gray-500">
                                Payout Destinations
                            </h2>
                        </div>
                        <div class="divide-y divide-gray-200" id="payout-destinations-list">
                            <!-- Bank Account Destination -->
                            <div class="flex items-center justify-between px-6 py-4" id="destination-bank">
                                <div class="flex flex-col gap-1">
                                    <div class="flex items-center gap-3">
                                        <span class="text-sm text-gray-900">
                                            Bank Account
                                            <span class="ml-2 text-gray-400" id="payout-last-four"></span>
                                        </span>
                                        <span class="text-xs text-gray-400">via Stripe Connect</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs text-gray-400" id="payout-status">Not configured</span>
                                    </div>
                                </div>
                                <button id="manage-payout-btn" onclick="window.app.setupPayout()" class="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                                    <i data-lucide="settings" class="w-3.5 h-3.5"></i>
                                    Manage
                                </button>
                            </div>
                        </div>
                        <div class="border-t border-gray-200 px-6 py-4">
                            <button id="add-destination-btn" class="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900">
                                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                                Add Destination
                            </button>
                        </div>
                        <div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <div class="space-y-1 text-xs text-gray-600">
                                <p>Payouts occur only after contract settlement.</p>
                                <p>Timing depends on settlement and provider processing.</p>
                            </div>
                        </div>
                    </div>

                    <!-- System Notice -->
                    <div class="border border-gray-300 bg-gray-50 p-6">
                        <div class="flex gap-4">
                            <i data-lucide="info" class="w-5 h-5 flex-shrink-0 text-gray-500"></i>
                            <p class="text-sm leading-relaxed text-gray-700">
                                Funding sources are used exclusively to lock and release capital
                                for performance contracts. Verification sources and identity
                                attestations are managed separately.
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
    const manageCardBtn = document.getElementById('manage-card-btn');
    const manageBankBtn = document.getElementById('manage-bank-btn');
    const managePayoutBtn = document.getElementById('manage-payout-btn');

    if (isProduction) {
        // Production: Update messaging for Stripe flow
        if (cardStatus) {
            cardStatus.textContent = 'Configured during contract execution';
        }
        if (bankStatus) {
            bankStatus.textContent = 'Via Stripe Connect';
        }
        if (payoutStatus) {
            payoutStatus.textContent = 'Via Stripe Connect';
        }
    }

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
        if (lockedEl) {
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
