// Funding & Payouts View with Live Stripe Card Verification
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
                                    <span class="text-xs mt-0.5" id="card-status">Loading...</span>
                                </div>
                                <button id="manage-card-btn" class="flex items-center gap-1.5 border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded">
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
                                <button id="manage-bank-btn" class="flex items-center gap-1.5 border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded">
                                    <i data-lucide="settings" class="w-3 h-3"></i>
                                    Manage
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Balance State -->
                    <div class="border border-gray-200 bg-white rounded">
                        <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                            <h2 class="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                                Balance State
                            </h2>
                            <button id="add-funds-btn" class="hidden items-center gap-1.5 bg-neutral-900 text-white px-4 py-1.5 text-xs font-medium hover:bg-neutral-800 rounded transition-colors">
                                <i data-lucide="plus" class="w-3 h-3"></i>
                                Add Funds
                            </button>
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
                                <button id="manage-payout-btn" class="flex items-center gap-1.5 border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded">
                                    <i data-lucide="settings" class="w-3 h-3"></i>
                                    Manage
                                </button>
                            </div>
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

        <!-- Card Modal -->
        <div id="card-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">Add Card</h3>
                        <button id="close-card-modal" class="text-gray-400 hover:text-gray-600">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">
                        Verify a card to use as your funding source
                    </p>
                </div>
                <div class="px-6 py-6">
                    <div id="card-element-container" class="border border-gray-300 rounded px-3 py-3 mb-4">
                        <!-- Stripe Card Element mounted here -->
                    </div>
                    <div id="card-error" class="text-sm text-red-600 mb-4 hidden"></div>
                    <button id="submit-card-btn" class="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        Verify & Save Card
                    </button>
                </div>
                <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <p class="text-xs text-gray-500 text-center">
                        Your card will be verified but not charged until you lock capital.
                    </p>
                </div>
            </div>
        </div>

        <!-- Remove Card Confirmation Modal -->
        <div id="remove-card-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg w-full max-w-sm mx-4 shadow-xl">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">Remove Card</h3>
                </div>
                <div class="px-6 py-6">
                    <p class="text-sm text-gray-600 mb-4">
                        Are you sure you want to remove this card? You'll need to add a new card before locking capital.
                    </p>
                    <div class="flex gap-3">
                        <button id="cancel-remove-btn" class="flex-1 py-2 border border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-50">
                            Cancel
                        </button>
                        <button id="confirm-remove-btn" class="flex-1 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                            Remove Card
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Funds Modal -->
        <div id="add-funds-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">Add Funds</h3>
                        <button id="close-add-funds-modal" class="text-gray-400 hover:text-gray-600">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">
                        Add capital to your available balance
                    </p>
                </div>
                <div class="px-6 py-6">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input id="add-funds-amount" type="number" min="1" step="1" placeholder="100" 
                                class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded text-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 outline-none">
                        </div>
                        <p class="text-xs text-gray-400 mt-1">Minimum: $1.00</p>
                    </div>
                    <div id="add-funds-error" class="text-sm text-red-600 mb-4 hidden"></div>
                    <button id="submit-add-funds-btn" class="w-full py-2.5 bg-neutral-900 text-white text-sm font-medium rounded hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        Add Funds
                    </button>
                </div>
                <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <p class="text-xs text-gray-500 text-center">
                        Funds will be charged to your verified card immediately.
                    </p>
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

// Stripe.js instance
let stripe = null;
let cardElement = null;

export async function initFunding() {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Initialize Stripe.js
    const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    const isProduction = window.location.hostname === 'collateral.market';

    if (!isProduction) {
        console.log('[Funding] Stripe key:', STRIPE_PUBLISHABLE_KEY ? 'present' : 'MISSING');
        if (STRIPE_PUBLISHABLE_KEY) {
            // Log key prefix (first 15 chars safe to show - helps verify account match)
            console.log('[Funding] Stripe key prefix:', STRIPE_PUBLISHABLE_KEY.substring(0, 15) + '...');
        }
    }

    if (window.Stripe && STRIPE_PUBLISHABLE_KEY && !STRIPE_PUBLISHABLE_KEY.includes('placeholder')) {
        try {
            stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
            if (!isProduction) {
                console.log('[Funding] Stripe initialized successfully');
            }
        } catch (stripeErr) {
            console.error('[Funding] Failed to initialize Stripe:', stripeErr);
        }
    } else if (!window.Stripe) {
        console.warn('[Funding] Stripe.js not loaded - check index.html for <script src="https://js.stripe.com/v3/">');
    } else if (!STRIPE_PUBLISHABLE_KEY) {
        console.warn('[Funding] VITE_STRIPE_PUBLISHABLE_KEY not set in environment');
    }

    // Get UI elements
    const cardStatusEl = document.getElementById('card-status');
    const bankStatusEl = document.getElementById('bank-status');
    const payoutStatusEl = document.getElementById('payout-status');
    const payoutLastFourEl = document.getElementById('payout-last-four');
    const availableBalanceEl = document.getElementById('available-balance');
    const lockedBalanceEl = document.getElementById('locked-balance');
    const pendingPayoutEl = document.getElementById('pending-payout');
    const manageCardBtn = document.getElementById('manage-card-btn');
    const manageBankBtn = document.getElementById('manage-bank-btn');
    const managePayoutBtn = document.getElementById('manage-payout-btn');

    // Modal elements
    const cardModal = document.getElementById('card-modal');
    const closeCardModalBtn = document.getElementById('close-card-modal');
    const submitCardBtn = document.getElementById('submit-card-btn');
    const cardErrorEl = document.getElementById('card-error');
    const removeCardModal = document.getElementById('remove-card-modal');
    const cancelRemoveBtn = document.getElementById('cancel-remove-btn');
    const confirmRemoveBtn = document.getElementById('confirm-remove-btn');

    // Add Funds modal elements
    const addFundsModal = document.getElementById('add-funds-modal');
    const closeAddFundsModalBtn = document.getElementById('close-add-funds-modal');
    const addFundsAmountInput = document.getElementById('add-funds-amount');
    const addFundsErrorEl = document.getElementById('add-funds-error');
    const submitAddFundsBtn = document.getElementById('submit-add-funds-btn');
    const addFundsBtn = document.getElementById('add-funds-btn');

    // Current card state
    let currentCardStatus = null;

    // ====================
    // Fetch & Display Data
    // ====================
    async function loadBillingStatus() {
        try {
            // Fetch billing status
            const billingStatus = await window.api.getBillingStatus();

            if (billingStatus?.fundingSource) {
                const fs = billingStatus.fundingSource;
                currentCardStatus = fs.status;

                if (fs.status === 'verified') {
                    const brand = fs.brand || 'CARD';
                    const last4 = fs.last4 || '****';
                    const exp = fs.expMonth && fs.expYear ? `${String(fs.expMonth).padStart(2, '0')}/${String(fs.expYear).slice(-2)}` : '';

                    cardStatusEl.innerHTML = `
                        <span class="text-gray-700">${brand} •••• ${last4}</span>
                        ${exp ? `<span class="text-gray-400 ml-2">exp ${exp}</span>` : ''}
                        <span class="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">Verified</span>
                    `;
                    manageCardBtn.textContent = 'Manage';

                    // Show Add Funds button when card is verified
                    const addFundsBtn = document.getElementById('add-funds-btn');
                    if (addFundsBtn) {
                        addFundsBtn.classList.remove('hidden');
                        addFundsBtn.classList.add('flex');
                    }
                } else if (fs.status === 'pending_verification') {
                    cardStatusEl.textContent = 'Verification pending...';
                    cardStatusEl.classList.add('text-amber-600');
                } else {
                    cardStatusEl.textContent = 'Not configured';
                    cardStatusEl.classList.add('text-gray-400');
                }
            } else {
                cardStatusEl.textContent = 'Not configured';
                cardStatusEl.classList.add('text-gray-400');
            }

            if (billingStatus?.payoutDestination?.connected) {
                bankStatusEl.textContent = 'Configured';
                bankStatusEl.classList.remove('text-gray-400');
                bankStatusEl.classList.add('text-gray-600');
                payoutStatusEl.textContent = 'Configured';
                payoutStatusEl.classList.remove('text-gray-400');
                payoutStatusEl.classList.add('text-gray-600');
            } else {
                bankStatusEl.textContent = 'Not configured';
                payoutStatusEl.textContent = 'Not configured';
            }

            // Update balances
            if (billingStatus?.balances) {
                availableBalanceEl.textContent = formatUSD(billingStatus.balances.availableBalanceUsdCents || 0);
                lockedBalanceEl.textContent = formatUSD(billingStatus.balances.lockedBalanceUsdCents || 0);
                pendingPayoutEl.textContent = formatUSD(billingStatus.balances.pendingPayoutUsdCents || 0);
            }

        } catch (err) {
            console.error('[Funding] Error loading billing status:', err);
            cardStatusEl.textContent = 'Error loading';
        }
    }

    async function loadContractBalances() {
        try {
            const response = await window.api.getContracts();
            const contracts = response?.contracts || [];

            const lockedStates = ['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED', 'FUNDS_LOCKED', 'VERIFIED', 'VERIFYING'];
            const pendingPayoutStates = ['SETTLED', 'PAYOUT_PENDING'];

            const lockedCents = contracts
                .filter(c => lockedStates.includes(c.state))
                .reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);

            const pendingCents = contracts
                .filter(c => pendingPayoutStates.includes(c.state))
                .reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);

            lockedBalanceEl.textContent = formatUSD(lockedCents);
            pendingPayoutEl.textContent = formatUSD(pendingCents);

        } catch (err) {
            console.error('[Funding] Error loading contracts:', err);
        }
    }

    // ====================
    // Card Modal Logic
    // ====================
    function showCardModal() {
        cardModal.classList.remove('hidden');
        cardModal.classList.add('flex');

        // Mount Stripe Card Element if not already mounted
        if (stripe && !cardElement) {
            const elements = stripe.elements();
            cardElement = elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#374151',
                        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                        '::placeholder': { color: '#9CA3AF' },
                    },
                    invalid: { color: '#DC2626' },
                },
            });
            cardElement.mount('#card-element-container');
            cardElement.on('change', (event) => {
                if (event.error) {
                    cardErrorEl.textContent = event.error.message;
                    cardErrorEl.classList.remove('hidden');
                } else {
                    cardErrorEl.classList.add('hidden');
                }
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    function hideCardModal() {
        cardModal.classList.add('hidden');
        cardModal.classList.remove('flex');
    }

    function showRemoveModal() {
        removeCardModal.classList.remove('hidden');
        removeCardModal.classList.add('flex');
    }

    function hideRemoveModal() {
        removeCardModal.classList.add('hidden');
        removeCardModal.classList.remove('flex');
    }

    async function submitCard() {
        if (!stripe || !cardElement) {
            const reason = !window.Stripe
                ? 'Stripe.js failed to load'
                : !stripe
                    ? 'VITE_STRIPE_PUBLISHABLE_KEY not set in Vercel environment'
                    : 'Card element not ready';
            cardErrorEl.textContent = `${reason}. Please contact support.`;
            cardErrorEl.classList.remove('hidden');
            console.error('[Funding] Submit failed:', { stripe: !!stripe, cardElement: !!cardElement, stripeGlobal: !!window.Stripe });
            return;
        }

        submitCardBtn.disabled = true;
        submitCardBtn.textContent = 'Verifying...';
        cardErrorEl.classList.add('hidden');

        try {
            // Create SetupIntent
            console.log('[Funding] Creating SetupIntent...');
            const siResponse = await window.api.createCardSetupIntent();
            console.log('[Funding] SetupIntent response:', {
                hasClientSecret: !!siResponse?.clientSecret,
                clientSecretPrefix: siResponse?.clientSecret?.substring(0, 20),
                setupIntentId: siResponse?.setupIntentId,
            });

            if (!siResponse?.clientSecret) {
                throw new Error('Failed to create setup intent - no clientSecret in response');
            }

            // Verify client_secret format (must contain _secret_)
            if (!siResponse.clientSecret.includes('_secret_')) {
                console.error('[Funding] Invalid clientSecret format - missing _secret_:', siResponse.clientSecret.substring(0, 30));
                throw new Error('Invalid setup intent format from server');
            }

            // Confirm with Stripe
            console.log('[Funding] Confirming with Stripe.js...');
            const { setupIntent, error } = await stripe.confirmCardSetup(siResponse.clientSecret, {
                payment_method: { card: cardElement },
            });

            if (error) {
                throw new Error(error.message);
            }

            if (setupIntent.status === 'succeeded') {
                // Confirm with backend
                await window.api.confirmCard(setupIntent.id, setupIntent.payment_method);

                hideCardModal();
                await loadBillingStatus();
            } else if (setupIntent.status === 'requires_action') {
                // SCA challenge may have been presented
                cardErrorEl.textContent = 'Additional verification required. Please complete the authentication.';
                cardErrorEl.classList.remove('hidden');
            }

        } catch (err) {
            cardErrorEl.textContent = err.message || 'Card verification failed. Please try again.';
            cardErrorEl.classList.remove('hidden');
        } finally {
            submitCardBtn.disabled = false;
            submitCardBtn.textContent = 'Verify & Save Card';
        }
    }

    async function removeCard() {
        confirmRemoveBtn.disabled = true;
        confirmRemoveBtn.textContent = 'Removing...';

        try {
            await window.api.removeCard();
            hideRemoveModal();
            await loadBillingStatus();
        } catch (err) {
            alert('Failed to remove card: ' + (err.message || 'Unknown error'));
        } finally {
            confirmRemoveBtn.disabled = false;
            confirmRemoveBtn.textContent = 'Remove Card';
        }
    }

    // ====================
    // Add Funds Modal Logic
    // ====================
    function showAddFundsModal() {
        addFundsModal.classList.remove('hidden');
        addFundsModal.classList.add('flex');
        addFundsAmountInput.value = '';
        addFundsErrorEl.classList.add('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    function hideAddFundsModal() {
        addFundsModal.classList.add('hidden');
        addFundsModal.classList.remove('flex');
    }

    async function submitAddFunds() {
        const amount = parseFloat(addFundsAmountInput.value);

        if (!amount || amount < 1) {
            addFundsErrorEl.textContent = 'Please enter an amount of at least $1.00';
            addFundsErrorEl.classList.remove('hidden');
            return;
        }

        submitAddFundsBtn.disabled = true;
        submitAddFundsBtn.textContent = 'Processing...';
        addFundsErrorEl.classList.add('hidden');

        try {
            const amountCents = Math.round(amount * 100);

            // Call backend to create a direct charge to available balance
            const result = await window.api.addFunds(amountCents);

            if (result.error) {
                throw new Error(result.error);
            }

            // Success!
            hideAddFundsModal();
            await loadBillingStatus();

            // Show success message
            alert(`Successfully added $${amount.toFixed(2)} to your available balance!`);

        } catch (err) {
            addFundsErrorEl.textContent = err.message || 'Failed to add funds. Please try again.';
            addFundsErrorEl.classList.remove('hidden');
        } finally {
            submitAddFundsBtn.disabled = false;
            submitAddFundsBtn.textContent = 'Add Funds';
        }
    }

    // ====================
    // Event Listeners
    // ====================
    manageCardBtn?.addEventListener('click', () => {
        if (currentCardStatus === 'verified') {
            // Show options menu (for now, show remove modal)
            showRemoveModal();
        } else {
            showCardModal();
        }
    });

    manageBankBtn?.addEventListener('click', () => {
        window.app?.setupPayout?.();
    });

    managePayoutBtn?.addEventListener('click', () => {
        window.app?.setupPayout?.();
    });

    closeCardModalBtn?.addEventListener('click', hideCardModal);
    cardModal?.addEventListener('click', (e) => {
        if (e.target === cardModal) hideCardModal();
    });

    submitCardBtn?.addEventListener('click', submitCard);

    cancelRemoveBtn?.addEventListener('click', hideRemoveModal);
    confirmRemoveBtn?.addEventListener('click', removeCard);
    removeCardModal?.addEventListener('click', (e) => {
        if (e.target === removeCardModal) hideRemoveModal();
    });

    // Add Funds modal event listeners
    addFundsBtn?.addEventListener('click', showAddFundsModal);
    closeAddFundsModalBtn?.addEventListener('click', hideAddFundsModal);
    submitAddFundsBtn?.addEventListener('click', submitAddFunds);
    addFundsModal?.addEventListener('click', (e) => {
        if (e.target === addFundsModal) hideAddFundsModal();
    });
    addFundsAmountInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitAddFunds();
    });

    // ====================
    // Initial Load
    // ====================
    await loadBillingStatus();
    await loadContractBalances();
}
