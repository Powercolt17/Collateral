// Contract Receipt Detail Page - Immutable Record View
// Route: /receipts/:id
// Fetches real contract data from API

export function renderReceiptDetail() {
    return `
        <div class="min-h-screen bg-white" id="receipt-container">
            <!-- Loading state -->
            <div class="flex items-center justify-center min-h-screen">
                <p class="text-sm font-mono text-neutral-500">Loading receipt...</p>
            </div>
        </div>
    `;
}

export async function initReceiptDetail(params) {
    const container = document.getElementById('receipt-container');
    const contractId = params?.id;

    if (!contractId) {
        container.innerHTML = `
            <div class="min-h-screen bg-white flex items-center justify-center">
                <div class="text-center">
                    <p class="font-mono text-sm text-neutral-600 mb-4">
                        CONTRACT NOT FOUND
                    </p>
                    <a href="javascript:window.router.navigate('/receipts')" 
                       class="font-mono text-xs text-neutral-900 underline decoration-1 underline-offset-2">
                        Return to Records
                    </a>
                </div>
            </div>
        `;
        return;
    }

    // Format helpers
    function formatCurrency(cents) {
        if (cents === null || cents === undefined) return '$0.00';
        return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatDateTime(isoString) {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    }

    function formatContractId(id) {
        if (!id) return '-';
        const year = new Date().getFullYear();
        const shortId = id.slice(0, 4).toUpperCase();
        const hash = id.slice(-4).toUpperCase();
        return `CTX-${year}-${shortId}-${hash}`;
    }

    function formatNumber(num) {
        return num?.toLocaleString('en-US') ?? '-';
    }

    function getEventDescription(eventType) {
        const descriptions = {
            'CONTRACT_CREATED': 'Contract created and capital locked',
            'BASELINE_SNAPSHOTTED': 'Baseline snapshot recorded',
            'FUNDS_AUTHORIZED': 'Payment authorized',
            'FUNDS_LOCKED': 'Funds locked in escrow',
            'EXECUTION_REQUESTED': 'Execution requested',
            'EXECUTION_CONFIRMED': 'Execution confirmed',
            'LOCKED': 'Capital locked',
            'SETTLEMENT_INITIATED': 'Settlement initiated',
            'SETTLED_SUCCESS': 'Contract settled: SUCCESS',
            'SETTLED_FAILURE': 'Contract settled: FORFEITED',
            'EXPIRED': 'Contract expired',
            'CANCELLED': 'Contract cancelled'
        };
        return descriptions[eventType] || eventType;
    }

    try {
        // Fetch contract data from API
        console.log('[Receipt] Fetching contract:', contractId);
        const response = await window.api.getContract(contractId);

        if (!response?.contract) {
            throw new Error('Contract not found');
        }

        const contract = response.contract;
        const events = response.events || [];

        // Determine status
        const state = contract.state || 'UNKNOWN';
        const isSuccess = ['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE', 'COMPLETED'].includes(state);
        const isForfeited = ['SETTLED_FAILURE', 'FORFEITED', 'EXPIRED', 'CANCELLED'].includes(state);

        // Status display
        const statusMap = {
            'CREATED': 'AWAITING_EXECUTION',
            'FUNDS_AUTHORIZED': 'AWAITING_EXECUTION',
            'FUNDS_LOCKED': 'ACTIVE',
            'LOCKED': 'ACTIVE',
            'ACTIVE': 'ACTIVE',
            'EXECUTION_CONFIRMED': 'ACTIVE',
            'VERIFIED': 'ACTIVE',
            'VERIFYING': 'ACTIVE',
            'SETTLED_SUCCESS': 'SETTLED_SUCCESS',
            'SETTLED': 'SETTLED_SUCCESS',
            'SETTLED_FAILURE': 'SETTLED_FORFEITED',
            'FORFEITED': 'SETTLED_FORFEITED',
            'PAYOUT_COMPLETE': 'SETTLED_SUCCESS',
            'COMPLETED': 'SETTLED_SUCCESS',
        };
        const statusDisplay = statusMap[state] || state;

        // Platform info
        const platform = contract.platform || 'Unknown';
        const platformDisplay = platform === 'X' ? 'Twitter' : platform === 'STRIPE' ? 'Stripe Revenue' : platform;
        const metricType = contract.metricType || 'Unknown';
        const metricDisplay = metricType === 'FOLLOWERS' ? 'Follower Count' : metricType === 'REVENUE' ? 'Net Revenue' : metricType;

        // Baseline info
        const baseline = contract.baseline || {};
        const baselineValue = platform === 'STRIPE'
            ? formatCurrency(baseline.baselineNetRevenueCents || baseline.lifetimeRevenue)
            : formatNumber(baseline.followerCount || baseline.value) + (platform === 'X' ? ' followers' : '');

        // Condition/target
        const condition = contract.conditionJson || {};
        const targetValue = platform === 'STRIPE'
            ? formatCurrency(condition.threshold)
            : formatNumber(condition.threshold) + (platform === 'X' ? ' followers' : '');

        // Payout amount (0 if forfeited)
        const payoutAmount = isForfeited ? 0 : (contract.payoutAmountUsdCents || contract.lockAmountUsdCents);

        // Build timeline
        let timelineHtml = '';
        if (events.length > 0) {
            const sortedEvents = [...events].sort((a, b) =>
                new Date(a.timestampUtc || a.createdAt).getTime() - new Date(b.timestampUtc || b.createdAt).getTime()
            );

            timelineHtml = sortedEvents.map(evt => `
                <div class="flex gap-4 mb-3 last:mb-0">
                    <div class="flex-shrink-0 mt-1">
                        <div class="w-2 h-2 bg-neutral-500 rounded-full"></div>
                    </div>
                    <div class="flex-1">
                        <div class="font-mono text-xs text-neutral-400 mb-1">
                            ${formatDateTime(evt.timestampUtc || evt.createdAt)}
                        </div>
                        <div class="font-mono text-sm text-neutral-100">
                            ${getEventDescription(evt.eventType)}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            // Show contract creation as default event
            timelineHtml = `
                <div class="flex gap-4 mb-3">
                    <div class="flex-shrink-0 mt-1">
                        <div class="w-2 h-2 bg-neutral-500 rounded-full"></div>
                    </div>
                    <div class="flex-1">
                        <div class="font-mono text-xs text-neutral-400 mb-1">
                            ${formatDateTime(contract.createdAt)}
                        </div>
                        <div class="font-mono text-sm text-neutral-100">
                            Contract created and capital locked
                        </div>
                    </div>
                </div>
            `;
        }

        // Status message
        const statusMessages = {
            'ACTIVE': 'Capital is locked. Outcome will be verified at deadline.',
            'AWAITING_EXECUTION': 'Contract created. Awaiting capital lock.',
            'SETTLED_SUCCESS': 'Target achieved. Capital released to beneficiary.',
            'SETTLED_FORFEITED': 'Target not achieved. Capital forfeited.',
        };
        const statusMessage = statusMessages[statusDisplay] || 'Status pending.';

        // Render the receipt
        container.innerHTML = `
            <!-- Header -->
            <div class="border-b border-neutral-300">
                <div class="max-w-4xl mx-auto px-8 py-8">
                    <h1 class="text-2xl font-normal tracking-tight text-neutral-900 mb-2">
                        CONTRACT EXECUTION RECEIPT
                    </h1>
                    <p class="text-sm text-neutral-700 mb-4">
                        This document certifies the execution of an immutable performance contract on the Collateral platform.
                    </p>
                    <p class="text-xs font-mono tracking-wider uppercase" style="color: #B22222;">
                        THIS RECORD CANNOT BE ALTERED.
                    </p>
                </div>
            </div>

            <!-- Metadata Block -->
            <div class="max-w-4xl mx-auto px-8 py-8">
                <div class="border border-neutral-300 p-6 mb-8">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <div class="text-xs font-mono tracking-wider text-neutral-500 uppercase mb-1">
                                Contract ID
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-sm text-neutral-900">
                                    ${formatContractId(contractId)}
                                </span>
                                <button onclick="navigator.clipboard.writeText('${contractId}')" 
                                        class="p-1 hover:bg-neutral-100 transition-colors"
                                        aria-label="Copy Contract ID">
                                    <i data-lucide="copy" class="w-3 h-3 text-neutral-600"></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <div class="text-xs font-mono tracking-wider text-neutral-500 uppercase mb-1">
                                Status
                            </div>
                            <div class="font-mono text-sm text-neutral-900">
                                ${statusDisplay.replace(/_/g, ' — ')}
                            </div>
                        </div>
                        <div>
                            <div class="text-xs font-mono tracking-wider text-neutral-500 uppercase mb-1">
                                Created (UTC)
                            </div>
                            <div class="font-mono text-sm text-neutral-900">
                                ${formatDateTime(contract.createdAt)}
                            </div>
                        </div>
                        <div>
                            <div class="text-xs font-mono tracking-wider text-neutral-500 uppercase mb-1">
                                Deadline
                            </div>
                            <div class="font-mono text-sm text-neutral-900">
                                ${formatDateTime(contract.deadlineUtc || condition.deadline)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contract Terms -->
                <div class="mb-8">
                    <h2 class="text-lg font-normal text-neutral-900 mb-4 border-b border-neutral-300 pb-2">
                        CONTRACT TERMS
                    </h2>
                    <div class="space-y-0">
                        <div class="flex justify-between py-2 border-b border-neutral-200">
                            <span class="text-xs font-mono tracking-wider text-neutral-500 uppercase">
                                Platform
                            </span>
                            <span class="font-mono text-sm text-neutral-900">
                                ${platformDisplay}
                            </span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-neutral-200">
                            <span class="text-xs font-mono tracking-wider text-neutral-500 uppercase">
                                Metric
                            </span>
                            <span class="font-mono text-sm text-neutral-900">
                                ${metricDisplay}
                            </span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-neutral-200">
                            <span class="text-xs font-mono tracking-wider text-neutral-500 uppercase">
                                Baseline Snapshot
                            </span>
                            <span class="font-mono text-sm text-neutral-900">
                                ${baselineValue}
                            </span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-neutral-200">
                            <span class="text-xs font-mono tracking-wider text-neutral-500 uppercase">
                                Target
                            </span>
                            <span class="font-mono text-sm text-neutral-900">
                                ${targetValue}
                            </span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-neutral-200">
                            <span class="text-xs font-mono tracking-wider text-neutral-500 uppercase">
                                Time Window
                            </span>
                            <span class="font-mono text-sm text-neutral-900">
                                30 days
                            </span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-neutral-200 bg-neutral-50 -mx-2 px-2">
                            <span class="text-xs font-mono tracking-wider text-neutral-900 uppercase font-medium">
                                Capital Locked
                            </span>
                            <span class="font-mono text-sm font-medium text-neutral-900">
                                ${formatCurrency(contract.lockAmountUsdCents)}
                            </span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-neutral-200">
                            <span class="text-xs font-mono tracking-wider text-neutral-500 uppercase">
                                Payout Amount
                            </span>
                            <span class="font-mono text-sm text-neutral-900">
                                ${formatCurrency(payoutAmount)}
                            </span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-neutral-200">
                            <span class="text-xs font-mono tracking-wider text-neutral-500 uppercase">
                                Verification Method
                            </span>
                            <span class="font-mono text-sm text-neutral-900">
                                ${platform} API
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Execution Timeline -->
                <div class="mb-8">
                    <h2 class="text-lg font-normal text-neutral-900 mb-4 border-b border-neutral-300 pb-2">
                        EXECUTION TIMELINE
                    </h2>
                    <div class="bg-neutral-900 p-6">
                        ${timelineHtml}
                    </div>
                </div>

                <!-- Contract Status -->
                <div class="mb-8">
                    <div class="border p-6 ${isForfeited ? 'border-red-800 bg-red-50' : 'border-neutral-300'}">
                        <div class="text-xs font-mono tracking-wider text-neutral-500 uppercase mb-2">
                            STATUS: ${statusDisplay.replace(/_/g, ' — ')}
                        </div>
                        <div class="font-mono text-sm text-neutral-900">
                            ${statusMessage}
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="mb-8">
                    <div class="flex gap-4 flex-wrap">
                        <button id="btn-copy-id"
                                class="px-4 py-2 border border-neutral-300 font-mono text-xs text-neutral-900 hover:bg-neutral-50 transition-colors">
                            Copy Contract ID
                        </button>
                        <button id="btn-view-ledger"
                                class="px-4 py-2 border border-neutral-300 font-mono text-xs text-neutral-900 hover:bg-neutral-50 transition-colors">
                            View Ledger
                        </button>
                        <button id="btn-create-another"
                                class="px-4 py-2 border border-neutral-300 font-mono text-xs text-neutral-900 hover:bg-neutral-50 transition-colors">
                            Create Another Contract
                        </button>
                    </div>
                </div>

                <!-- Dev Tools (non-production only) -->
                ${window.location.hostname !== 'collateral.market' ? `
                    <div class="border border-neutral-200 bg-neutral-50 p-4 mb-8">
                        <div class="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
                            DEVELOPMENT UTILITIES
                        </div>
                        <div class="flex gap-2">
                            <button id="btn-export-json" class="px-3 py-1 bg-neutral-200 font-mono text-xs text-neutral-600 rounded hover:bg-neutral-300">
                                Export JSON
                            </button>
                            <button id="btn-dev-simulate" class="px-3 py-1 bg-neutral-200 font-mono text-xs text-neutral-600 rounded hover:bg-neutral-300">
                                Simulate Success
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>

            <!-- Footer Finality Statement -->
            <div class="border-t border-neutral-300 mt-12">
                <div class="max-w-4xl mx-auto px-8 py-8">
                    <p class="text-xs font-mono text-neutral-600 text-center">
                        All contracts settle publicly. Outcomes are permanent. No appeals. No overrides.
                    </p>
                </div>
            </div>
        `;

        // Initialize lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Bind button events
        document.getElementById('btn-copy-id')?.addEventListener('click', () => {
            navigator.clipboard.writeText(contractId);
            const btn = document.getElementById('btn-copy-id');
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy Contract ID', 2000);
        });

        document.getElementById('btn-view-ledger')?.addEventListener('click', () => {
            window.router.navigate('/receipts');
        });

        document.getElementById('btn-create-another')?.addEventListener('click', () => {
            window.router.navigate('/contracts');
        });

        document.getElementById('btn-export-json')?.addEventListener('click', () => {
            const data = JSON.stringify({ contract, events }, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `contract-${formatContractId(contractId)}.json`;
            a.click();
        });

        document.getElementById('btn-dev-simulate')?.addEventListener('click', async () => {
            const btn = document.getElementById('btn-dev-simulate');
            btn.disabled = true;
            btn.textContent = 'Simulating...';

            try {
                const result = await window.api.devSimulateSuccess(contractId);
                if (result.ok) {
                    alert('✅ Success simulated! Refreshing...');
                    window.location.reload();
                } else {
                    alert('❌ Simulation failed: ' + (result.error || 'Unknown error'));
                    btn.disabled = false;
                    btn.textContent = 'Simulate Success';
                }
            } catch (err) {
                alert('❌ Error: ' + err.message);
                btn.disabled = false;
                btn.textContent = 'Simulate Success';
            }
        });

        console.log('[Receipt] Loaded', { contractId, state });

    } catch (error) {
        console.error('[Receipt] Error loading contract:', error);
        container.innerHTML = `
            <div class="min-h-screen bg-white flex items-center justify-center">
                <div class="text-center">
                    <p class="font-mono text-sm text-neutral-600 mb-4">
                        CONTRACT NOT FOUND
                    </p>
                    <p class="font-mono text-xs text-neutral-500 mb-4">
                        ${error.message || 'The requested receipt does not exist.'}
                    </p>
                    <a href="javascript:window.router.navigate('/receipts')" 
                       class="font-mono text-xs text-neutral-900 underline decoration-1 underline-offset-2">
                        Return to Records
                    </a>
                </div>
            </div>
        `;
    }
}
