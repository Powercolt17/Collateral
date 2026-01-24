// Contract Detail View - Dynamic with State-Based Actions
export function renderContractDetail(params) {
    const contractId = params?.id || '';
    return `
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen">
            <div class="flex items-center gap-2 mb-8 font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-12">
                <button onclick="window.router.navigate('/my-contracts')" class="hover:text-neutral-900 cursor-pointer transition-colors">My Contracts</button>
                <i data-lucide="chevron-right" class="w-3 h-3"></i>
                <span class="text-neutral-900" id="contract-id-display">${contractId}</span>
            </div>

            <!-- Loading State -->
            <div id="contract-loading" class="flex items-center justify-center py-20">
                <div class="w-8 h-8 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
            </div>

            <!-- Error State -->
            <div id="contract-error" class="hidden text-center py-20">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h2 class="text-lg font-semibold text-neutral-800 mb-2">Failed to load contract</h2>
                <p id="contract-error-message" class="text-sm text-neutral-500 mb-4"></p>
                <button onclick="window.router.navigate('/my-contracts')" class="px-4 py-2 bg-neutral-900 text-white text-sm rounded">
                    Back to Contracts
                </button>
            </div>

            <!-- Contract Detail -->
            <div id="contract-detail" class="hidden bg-white border border-neutral-200 shadow-sm max-w-3xl mx-auto w-full rounded-sm overflow-hidden">
                <!-- Header -->
                <div class="p-8 border-b border-neutral-200">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col gap-2">
                            <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Contract ID</span>
                            <h1 id="contract-full-id" class="font-mono text-xl tracking-tight text-neutral-900"></h1>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                            <div id="contract-status-badge" class="inline-flex items-center px-2 py-1 rounded"></div>
                            <span id="contract-updated-at" class="font-mono text-[10px] text-neutral-400 uppercase tracking-wider"></span>
                        </div>
                    </div>
                </div>

                <!-- Details Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 border-b border-neutral-200">
                    <div class="p-8 border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col gap-6">
                        <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400">Contract Info</h4>
                        <div class="space-y-4">
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Platform</span>
                                <span id="contract-platform" class="font-mono text-[11px] font-medium text-neutral-900"></span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Risk Tier</span>
                                <span id="contract-tier" class="font-mono text-[11px] font-medium text-neutral-900"></span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Deadline</span>
                                <span id="contract-deadline" class="font-mono text-[11px] font-medium text-neutral-900"></span>
                            </div>
                        </div>
                    </div>

                    <div class="p-8 flex flex-col gap-6 bg-neutral-50/20">
                        <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400">Capital Block</h4>
                        <div class="space-y-4">
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Locked Amount</span>
                                <span id="contract-lock-amount" class="font-mono text-lg font-medium text-neutral-900"></span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Potential Payout</span>
                                <span id="contract-payout-amount" class="font-mono text-[11px] font-medium text-emerald-700"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Panel -->
                <div id="action-panel" class="p-8 border-b border-neutral-200 bg-neutral-50">
                    <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400 mb-4">Next Action</h4>
                    <div id="action-content"></div>
                </div>

                <!-- Event Log -->
                <div class="p-8 bg-white">
                    <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400 mb-6">Event Log</h4>
                    <div id="event-log" class="relative pl-2 space-y-6 before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-px before:bg-neutral-200">
                        <!-- Events will be loaded dynamically -->
                    </div>
                </div>

                <!-- Footer -->
                <div class="bg-neutral-50 border-t border-neutral-200 px-8 py-6">
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col gap-1">
                            <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Created</span>
                            <span id="contract-created-at" class="font-mono text-[10px] text-neutral-500"></span>
                        </div>
                        <div class="flex items-center gap-2 text-neutral-400">
                            <i data-lucide="lock" class="w-3 h-3"></i>
                            <span class="font-mono text-[9px] uppercase tracking-widest">Immutable Ledger</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

export async function initContractDetail(params) {
    const contractId = params?.id;
    if (!contractId) {
        showError('No contract ID provided');
        return;
    }

    const loadingEl = document.getElementById('contract-loading');
    const errorEl = document.getElementById('contract-error');
    const detailEl = document.getElementById('contract-detail');

    try {
        // Check for 3DS redirect return
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
        const redirectStatus = urlParams.get('redirect_status');

        if (paymentIntentClientSecret) {
            console.log('[ContractDetail] 3DS redirect return detected:', redirectStatus);

            // Clean URL (remove query params)
            window.history.replaceState({}, '', window.location.pathname);

            // Initialize Stripe and check payment status
            const stripeInstance = await initializeStripe();
            const { paymentIntent, error } = await stripeInstance.retrievePaymentIntent(paymentIntentClientSecret);

            if (error) {
                console.error('[ContractDetail] Payment retrieval error:', error);
                showPaymentResult('error', error.message);
            } else if (paymentIntent) {
                console.log('[ContractDetail] PaymentIntent status:', paymentIntent.status);

                switch (paymentIntent.status) {
                    case 'succeeded':
                        showPaymentResult('success', 'Payment successful! Waiting for confirmation...');
                        break;
                    case 'processing':
                        showPaymentResult('pending', 'Payment is processing. Please wait...');
                        break;
                    case 'requires_payment_method':
                        showPaymentResult('error', 'Payment failed. Please try again.');
                        break;
                    default:
                        showPaymentResult('pending', `Payment status: ${paymentIntent.status}`);
                }
            }
        }

        // Load contract data
        const contract = await window.api.getContract(contractId);
        console.log('[ContractDetail] Loaded:', contract);

        // Load events
        const eventsData = await window.api.getLedgerEvents(contractId);
        const events = eventsData.events || [];

        // Hide loading, show detail
        loadingEl.classList.add('hidden');
        detailEl.classList.remove('hidden');

        // Populate contract info
        document.getElementById('contract-full-id').textContent = contractId.substring(0, 8).toUpperCase();
        document.getElementById('contract-platform').textContent = contract.platform;
        document.getElementById('contract-tier').textContent = contract.riskTier || 'STANDARD';
        document.getElementById('contract-deadline').textContent = formatDate(contract.deadline || contract.deadlineUtc);
        document.getElementById('contract-lock-amount').textContent = formatCurrency(contract.lockAmountUsdCents);
        document.getElementById('contract-payout-amount').textContent = formatCurrency(contract.payoutAmountUsdCents);
        document.getElementById('contract-created-at').textContent = formatDate(contract.createdAt);
        document.getElementById('contract-updated-at').textContent = formatDate(contract.updatedAt);

        // Set status badge
        const state = contract.state || 'CREATED';
        setStatusBadge(state);

        // Render action panel based on state
        renderActionPanel(contract, state);

        // Render event log
        renderEventLog(events);

        if (window.lucide) window.lucide.createIcons();

    } catch (err) {
        console.error('[ContractDetail] Error:', err);
        showError(err.message);
    }
}

// Show payment result message at top of page
function showPaymentResult(type, message) {
    const colors = {
        success: 'bg-green-50 border-green-200 text-green-700',
        error: 'bg-red-50 border-red-200 text-red-700',
        pending: 'bg-amber-50 border-amber-200 text-amber-700',
    };

    const existing = document.getElementById('payment-result-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'payment-result-banner';
    banner.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 border rounded-lg shadow-lg ${colors[type]}`;
    banner.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="font-medium text-sm">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="text-current opacity-60 hover:opacity-100">✕</button>
        </div>
    `;
    document.body.appendChild(banner);

    // Auto-dismiss success/pending after 5 seconds
    if (type !== 'error') {
        setTimeout(() => banner.remove(), 5000);
    }
}

function showError(message) {
    document.getElementById('contract-loading').classList.add('hidden');
    document.getElementById('contract-error').classList.remove('hidden');
    document.getElementById('contract-error-message').textContent = message;
}

function formatCurrency(cents) {
    if (!cents) return '$0.00';
    return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(isoString) {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
        ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function setStatusBadge(state) {
    const badge = document.getElementById('contract-status-badge');
    const stateConfig = {
        CREATED: { label: 'Created', bg: 'bg-neutral-100', border: 'border-neutral-200', text: 'text-neutral-600' },
        FUNDS_AUTHORIZED: { label: 'Awaiting Payment', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
        FUNDS_LOCKED: { label: 'Funded', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
        LOCKED: { label: 'Active', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
        VERIFYING: { label: 'Verifying', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' },
        SETTLING: { label: 'Settling', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' },
        SETTLED: { label: 'Settled', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
        FORFEITED: { label: 'Forfeited', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700' },
    };

    const config = stateConfig[state] || stateConfig.CREATED;
    badge.className = `inline-flex items-center px-2 py-1 rounded ${config.bg} border ${config.border} ${config.text}`;
    badge.innerHTML = `<span class="font-mono text-[10px] font-medium uppercase tracking-widest">${config.label}</span>`;
}

function renderActionPanel(contract, state) {
    const content = document.getElementById('action-content');
    const contractId = contract.id;

    switch (state) {
        case 'CREATED':
            content.innerHTML = `
                <p class="text-sm text-neutral-600 mb-4">Fund this contract to lock in your commitment.</p>
                <button id="btn-fund" class="px-6 py-3 bg-neutral-900 text-white text-sm font-medium uppercase tracking-wide hover:bg-neutral-800 transition-colors">
                    Fund Contract
                </button>
            `;
            document.getElementById('btn-fund').addEventListener('click', () => handleFund(contractId));
            break;

        case 'FUNDS_AUTHORIZED':
            content.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-sm text-amber-700">Waiting for payment confirmation...</p>
                </div>
                <p class="text-xs text-neutral-500 mt-2">This page will update automatically once your payment is confirmed.</p>
            `;
            // Start polling for FUNDS_LOCKED
            startPolling(contractId);
            break;

        case 'FUNDS_LOCKED':
            content.innerHTML = `
                <p class="text-sm text-neutral-600 mb-2">Your funds are locked. Execute to make the contract binding.</p>
                <p class="text-xs text-red-600 mb-4">⚠️ Once executed, this contract becomes irrevocable. No appeals.</p>
                <button id="btn-execute" class="px-6 py-3 bg-[#921818] text-white text-sm font-medium uppercase tracking-wide hover:bg-[#751212] transition-colors">
                    Execute Contract
                </button>
            `;
            document.getElementById('btn-execute').addEventListener('click', () => handleExecute(contractId));
            break;

        case 'LOCKED':
            const deadline = new Date(contract.deadline || contract.deadlineUtc);
            const now = new Date();
            const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
            content.innerHTML = `
                <div class="flex items-center gap-3">
                    <i data-lucide="clock" class="w-5 h-5 text-emerald-600"></i>
                    <div>
                        <p class="text-sm text-neutral-900 font-medium">Contract is Active</p>
                        <p class="text-xs text-neutral-500">${daysLeft} days until verification deadline</p>
                    </div>
                </div>
            `;
            break;

        case 'SETTLED':
            content.innerHTML = `
                <div class="flex items-center gap-3">
                    <i data-lucide="check-circle" class="w-5 h-5 text-emerald-600"></i>
                    <div>
                        <p class="text-sm text-emerald-700 font-medium">Contract Settled Successfully</p>
                        <p class="text-xs text-neutral-500">Your funds have been returned.</p>
                    </div>
                </div>
                <button onclick="window.router.navigate('/receipts/${contractId}')" class="mt-4 px-4 py-2 border border-neutral-200 text-neutral-600 text-sm font-medium hover:border-neutral-400 transition-colors">
                    View Receipt
                </button>
            `;
            break;

        case 'FORFEITED':
            content.innerHTML = `
                <div class="flex items-center gap-3">
                    <i data-lucide="x-circle" class="w-5 h-5 text-red-600"></i>
                    <div>
                        <p class="text-sm text-red-700 font-medium">Contract Forfeited</p>
                        <p class="text-xs text-neutral-500">Conditions were not met by the deadline.</p>
                    </div>
                </div>
            `;
            break;

        default:
            content.innerHTML = `<p class="text-sm text-neutral-500">Processing...</p>`;
    }
}

function renderEventLog(events) {
    const container = document.getElementById('event-log');
    if (!events || events.length === 0) {
        container.innerHTML = '<p class="text-sm text-neutral-400 pl-6">No events yet</p>';
        return;
    }

    const eventLabels = {
        'CONTRACT_CREATED': { label: 'Contract Created', color: 'bg-neutral-300' },
        'BASELINE_SNAPSHOTTED': { label: 'Baseline Captured', color: 'bg-neutral-300' },
        'FUNDS_AUTHORIZED': { label: 'Funding Initiated', color: 'bg-amber-400' },
        'FUNDS_LOCKED': { label: 'Funds Locked', color: 'bg-blue-500' },
        'EXECUTION_REQUESTED': { label: 'Execution Requested', color: 'bg-neutral-300' },
        'EXECUTION_CONFIRMED': { label: 'Contract Executed', color: 'bg-emerald-500' },
        'VERIFICATION_STARTED': { label: 'Verification Started', color: 'bg-purple-400' },
        'SETTLED_SUCCESS': { label: 'Settled (Success)', color: 'bg-emerald-500' },
        'SETTLED_FAILURE': { label: 'Settled (Failed)', color: 'bg-red-500' },
        'CONTRACT_FORFEITED': { label: 'Forfeited', color: 'bg-red-500' },
    };

    container.innerHTML = events.map(event => {
        const config = eventLabels[event.eventType] || { label: event.eventType, color: 'bg-neutral-300' };
        return `
            <div class="relative pl-6">
                <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full ${config.color} border-2 border-white"></div>
                <div class="flex justify-between items-baseline">
                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">${config.label}</span>
                    <span class="font-mono text-[10px] text-neutral-400">${formatDate(event.timestampUtc)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Stripe instance
let stripe = null;
let elements = null;

async function initializeStripe() {
    if (stripe) return stripe;

    // Get key from environment (or placeholder if dev)
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
        throw new Error('Stripe Publishable Key not found in environment');
    }

    stripe = await window.Stripe(publishableKey);
    return stripe;
}

async function handleFund(contractId) {
    const btn = document.getElementById('btn-fund');
    const container = document.getElementById('action-content');

    btn.disabled = true;
    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>';

    try {
        // Create PaymentIntent on backend (will use saved card if available)
        console.log('[ContractDetail] Creating funding intent...');
        const result = await window.api.createFundingIntent(contractId);
        console.log('[ContractDetail] FundingIntent result:', result);

        if (result.error) {
            throw new Error(result.error);
        }

        // Check if payment already succeeded (off-session with saved card)
        if (result.status === 'succeeded') {
            // Payment already complete! Show success and wait for webhook
            container.innerHTML = `
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <p class="text-sm text-green-700 font-medium">Payment successful!</p>
                </div>
                <p class="text-xs text-neutral-500">Locking funds... This page will update automatically.</p>
            `;

            // Start polling for FUNDS_LOCKED
            startPolling(contractId);
            return;
        }

        // If we need to show Payment Element (no saved card case)
        if (!result.clientSecret) {
            throw new Error('No client secret received - please add a card first on the Funding page.');
        }

        // Initialize Stripe for Payment Element
        const stripeInstance = await initializeStripe();

        // Mount Payment Element
        const appearance = { theme: 'stripe' };
        elements = stripeInstance.elements({
            appearance,
            clientSecret: result.clientSecret
        });

        // Clear container and show Payment Element
        container.innerHTML = `
            <div class="mb-6">
                <p class="text-sm text-neutral-600 mb-4">Complete payment to lock funds.</p>
                <div id="payment-element" class="mb-4">
                    <!-- Stripe Payment Element mounts here -->
                </div>
                <div id="payment-message" class="hidden text-sm text-red-600 mb-4"></div>
                <button id="btn-submit-payment" class="w-full px-6 py-3 bg-neutral-900 text-white text-sm font-medium uppercase tracking-wide hover:bg-neutral-800 transition-colors">
                    Pay Now
                </button>
            </div>
        `;

        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');

        // Handle Submit
        document.getElementById('btn-submit-payment').addEventListener('click', async () => {
            const submitBtn = document.getElementById('btn-submit-payment');
            const messageEl = document.getElementById('payment-message');

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>';
            messageEl.classList.add('hidden');

            try {
                const { error } = await stripeInstance.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: window.location.href,
                    },
                    redirect: 'if_required'
                });

                if (error) {
                    messageEl.textContent = error.message;
                    messageEl.classList.remove('hidden');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Pay Now';
                } else {
                    // Success!
                    messageEl.textContent = 'Payment successful! Locking funds...';
                    messageEl.classList.remove('hidden', 'text-red-600');
                    messageEl.classList.add('text-green-600');

                    // Refresh in a moment to catch the webhook update
                    setTimeout(() => {
                        window.router.navigate(`/contracts/${contractId}`);
                    }, 2000);
                }
            } catch (e) {
                console.error('[Stripe] Confirm error:', e);
                messageEl.textContent = 'An unexpected error occurred.';
                messageEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Pay Now';
            }
        });

    } catch (err) {
        console.error('[ContractDetail] Fund error:', err);
        container.innerHTML = `
            <div class="text-red-600 text-sm mb-4">${err.message}</div>
            <button id="btn-fund-retry" class="px-6 py-3 bg-neutral-900 text-white text-sm font-medium uppercase tracking-wide hover:bg-neutral-800 transition-colors">
                Try Again
            </button>
        `;
        document.getElementById('btn-fund-retry').addEventListener('click', () => handleFund(contractId));
    }
}

async function handleExecute(contractId) {
    const btn = document.getElementById('btn-execute');

    // Confirm
    if (!confirm('Execute this contract?\n\n⚠️ This action is IRREVERSIBLE.\n⚠️ No appeals will be accepted.\n⚠️ Settlement is automatic at deadline.')) {
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>';

    try {
        const result = await window.api.executeContract(contractId);
        console.log('[ContractDetail] Execute result:', result);

        // Refresh to show LOCKED state
        window.router.navigate(`/contracts/${contractId}`);

    } catch (err) {
        console.error('[ContractDetail] Execute error:', err);
        alert('Failed to execute contract: ' + err.message);
        btn.disabled = false;
        btn.textContent = 'Execute Contract';
    }
}

let pollingInterval = null;

function startPolling(contractId) {
    // Poll every 3 seconds for state changes
    pollingInterval = setInterval(async () => {
        try {
            const contract = await window.api.getContract(contractId);
            if (contract.state !== 'FUNDS_AUTHORIZED') {
                clearInterval(pollingInterval);
                window.router.navigate(`/contracts/${contractId}`);
            }
        } catch (err) {
            console.error('[ContractDetail] Polling error:', err);
        }
    }, 3000);
}
