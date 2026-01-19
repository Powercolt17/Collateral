// Receipt Detail Page - Immutable Record View
// Route: /receipts/:id
// Fetches real contract data from API, not mock data

export function renderReceiptDetail() {
    return `
        <style>
            /* Receipt Page Styles */
            .receipt-page {
                max-width: 900px;
                margin: 0 auto;
                padding: 3rem 1.5rem;
                font-family: ui-sans-serif, system-ui, sans-serif;
            }
            
            .receipt-loading {
                text-align: center;
                padding: 4rem;
                color: #6B6E76;
            }
            
            .receipt-loading .spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #E5E5E5;
                border-top-color: #0E0E11;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .receipt-header {
                border-bottom: 2px solid #0E0E11;
                padding-bottom: 2rem;
                margin-bottom: 2rem;
            }
            
            .receipt-title {
                font-size: 2rem;
                font-weight: 700;
                letter-spacing: -0.02em;
                color: #0E0E11;
                margin-bottom: 0.5rem;
            }
            
            .receipt-title.success { color: #1F7A4D; }
            .receipt-title.pending { color: #0E0E11; }
            .receipt-title.failure { color: #8B1E1E; }
            
            .receipt-subtitle {
                font-size: 0.875rem;
                color: #6B6E76;
                max-width: 500px;
            }
            
            .finality-notice {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #8B1E1E;
                margin-top: 1rem;
            }
            
            .receipt-meta {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                margin-top: 1.5rem;
                padding: 1rem;
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
            }
            
            @media (max-width: 600px) {
                .receipt-meta { grid-template-columns: 1fr; }
            }
            
            .receipt-meta-item {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .receipt-meta-label {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #6B6E76;
            }
            
            .receipt-meta-value {
                font-family: ui-monospace, monospace;
                font-size: 13px;
                color: #0E0E11;
            }
            
            .receipt-meta-value.hash {
                font-size: 11px;
                color: #4D5057;
                cursor: pointer;
            }
            
            .receipt-meta-value.hash:hover {
                text-decoration: underline;
            }
            
            .receipt-section {
                margin-bottom: 2rem;
            }
            
            .receipt-section-title {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: #0E0E11;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid #E5E5E5;
                margin-bottom: 1rem;
            }
            
            .receipt-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .receipt-table tr {
                border-bottom: 1px solid #F0F0F0;
            }
            
            .receipt-table tr:last-child {
                border-bottom: none;
            }
            
            .receipt-table td {
                padding: 0.75rem 0;
                font-size: 14px;
            }
            
            .receipt-table td:first-child {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: #6B6E76;
                width: 40%;
            }
            
            .receipt-table td:last-child {
                font-family: ui-monospace, monospace;
                font-size: 13px;
                color: #0E0E11;
                text-align: right;
            }
            
            .receipt-table .value-gold {
                color: #C9A227;
                font-weight: 600;
            }
            
            .receipt-table .value-red {
                color: #8B1E1E;
                font-weight: 600;
            }
            
            .receipt-table tr.capital-row {
                background: #FAFAFA;
                border-top: 1px solid #E5E5E5;
                border-bottom: 1px solid #E5E5E5;
            }
            
            .receipt-table tr.capital-row td:first-child {
                font-weight: 700;
                color: #0E0E11;
            }
            
            .receipt-table tr.capital-row td:last-child {
                font-size: 1rem;
                font-weight: 700;
                color: #0E0E11;
            }
            
            .event-timeline {
                background: #0E0E11;
                padding: 1.5rem;
            }
            
            .event-item {
                display: flex;
                gap: 1rem;
                padding: 0.75rem 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .event-item:last-child {
                border-bottom: none;
            }
            
            .event-item.terminal {
                background: rgba(31, 122, 77, 0.1);
                margin: 0 -1.5rem;
                padding: 0.75rem 1.5rem;
            }
            
            .event-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                margin-top: 6px;
                flex-shrink: 0;
            }
            
            .event-item.terminal .event-dot {
                background: #1F7A4D;
            }
            
            .event-content {
                flex: 1;
            }
            
            .event-type {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.05em;
                color: rgba(255,255,255,0.9);
            }
            
            .event-time {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                color: rgba(255,255,255,0.4);
                margin-top: 0.25rem;
            }
            
            .status-block {
                padding: 1.5rem;
                border: 2px solid #0E0E11;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #FAFAFA;
            }
            
            .status-block.active { border-color: #0E0E11; }
            .status-block.success { border-color: #1F7A4D; background: rgba(31,122,77,0.05); }
            .status-block.failure { border-color: #8B1E1E; background: rgba(139,30,30,0.05); }
            
            .status-label {
                font-family: ui-monospace, monospace;
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 0.15em;
                text-transform: uppercase;
            }
            
            .status-label.active { color: #0E0E11; }
            .status-label.success { color: #1F7A4D; }
            .status-label.failure { color: #8B1E1E; }
            
            .status-detail {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                color: #6B6E76;
                margin-top: 0.5rem;
            }
            
            .status-timestamp {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                color: #6B6E76;
                text-align: right;
            }
            
            .receipt-footer {
                margin-top: 3rem;
                padding-top: 1.5rem;
                border-top: 1px solid #E5E5E5;
                text-align: center;
            }
            
            .receipt-footer p {
                font-size: 11px;
                color: #6B6E76;
                line-height: 1.6;
            }
            
            .receipt-footer .legal {
                margin-top: 1rem;
                font-size: 10px;
                color: #B0B2B8;
            }
            
            .receipt-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .receipt-btn {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                padding: 0.75rem 1.5rem;
                border: 1px solid #D9DBE1;
                background: #FFFFFF;
                color: #4D5057;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            
            .receipt-btn:hover {
                border-color: #0E0E11;
                color: #0E0E11;
            }
            
            .receipt-btn.primary {
                background: #0E0E11;
                color: #FFFFFF;
                border-color: #0E0E11;
            }
            
            .receipt-btn.primary:hover {
                background: #2A2A2F;
            }
            
            .receipt-not-found {
                max-width: 600px;
                margin: 6rem auto;
                text-align: center;
                padding: 3rem;
                border: 1px solid #E5E5E5;
            }
            
            .receipt-not-found h1 {
                font-family: ui-monospace, monospace;
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: #0E0E11;
                margin-bottom: 1rem;
            }
            
            .receipt-not-found p {
                font-size: 13px;
                color: #6B6E76;
            }
        </style>
        
        <div class="receipt-page" id="receipt-container">
            <div class="receipt-loading">
                <div class="spinner"></div>
                <p>Loading receipt...</p>
            </div>
        </div>
    `;
}

export async function initReceiptDetail(params) {
    const container = document.getElementById('receipt-container');
    const contractId = params?.id;

    if (!contractId) {
        container.innerHTML = `
            <div class="receipt-not-found">
                <h1>Record Not Found</h1>
                <p>No contract ID provided.</p>
            </div>
        `;
        return;
    }

    // Format helpers
    function formatNumber(num) {
        return num?.toLocaleString('en-US') ?? '-';
    }

    function formatCurrency(cents) {
        if (cents === null || cents === undefined) return '-';
        return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatDate(isoString) {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    }

    function formatShortDate(isoString) {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function truncateId(id, startLen = 8, endLen = 4) {
        if (!id) return '-';
        if (id.length <= startLen + endLen + 3) return id;
        return id.slice(0, startLen) + '...' + id.slice(-endLen);
    }

    function getEventDescription(eventType) {
        const descriptions = {
            'CONTRACT_CREATED': 'Contract created',
            'BASELINE_SNAPSHOTTED': 'Baseline snapshot captured',
            'FUNDS_AUTHORIZED': 'Payment authorized',
            'FUNDS_LOCKED': 'Funds locked in escrow',
            'EXECUTION_REQUESTED': 'Execution requested',
            'EXECUTION_CONFIRMED': 'Execution confirmed',
            'SETTLEMENT_INITIATED': 'Settlement initiated',
            'SETTLED_SUCCESS': 'Contract settled - SUCCESS',
            'SETTLED_FAILURE': 'Contract settled - FAILURE',
            'EXPIRED': 'Contract expired',
            'CANCELLED': 'Contract cancelled'
        };
        return descriptions[eventType] || eventType;
    }

    function isTerminalEvent(eventType) {
        return ['EXECUTION_CONFIRMED', 'SETTLED_SUCCESS', 'SETTLED_FAILURE', 'EXPIRED', 'CANCELLED', 'LOCKED'].includes(eventType);
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
        const isSuccess = ['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED', 'SETTLED_SUCCESS'].includes(state);
        const isFailure = ['SETTLED_FAILURE', 'EXPIRED', 'CANCELLED'].includes(state);
        const statusClass = isSuccess ? 'success' : isFailure ? 'failure' : 'active';

        // Get status text
        const statusTexts = {
            'LOCKED': 'EXECUTION CONFIRMED',
            'ACTIVE': 'ACTIVE',
            'EXECUTION_CONFIRMED': 'EXECUTION CONFIRMED',
            'SETTLED_SUCCESS': 'SETTLED — SUCCESS',
            'SETTLED_FAILURE': 'SETTLED — FAILURE',
            'EXPIRED': 'EXPIRED',
            'CANCELLED': 'CANCELLED'
        };
        const statusText = statusTexts[state] || state;

        // Title based on state
        const titleTexts = {
            'LOCKED': 'Execution Confirmed',
            'ACTIVE': 'Contract Active',
            'EXECUTION_CONFIRMED': 'Execution Confirmed',
            'SETTLED_SUCCESS': 'Contract Settled — Success',
            'SETTLED_FAILURE': 'Contract Settled — Failure'
        };
        const pageTitle = titleTexts[state] || 'Contract Receipt';

        // Platform info
        const platform = contract.platform || 'UNKNOWN';
        const platformDisplay = platform === 'X' ? 'X (Twitter)' : platform === 'STRIPE' ? 'Stripe' : platform;
        const metricType = contract.metricType || 'UNKNOWN';
        const metricDisplay = metricType === 'FOLLOWERS' ? 'Followers' : metricType === 'REVENUE' ? 'Revenue' : metricType;

        // Baseline info (from baseline JSON if available)
        const baseline = contract.baseline || {};
        const baselineValue = platform === 'STRIPE'
            ? formatCurrency(baseline.baselineNetRevenueCents || baseline.lifetimeRevenue)
            : formatNumber(baseline.followerCount || baseline.value);

        // Condition/target
        const condition = contract.conditionJson || {};
        const targetValue = platform === 'STRIPE'
            ? formatCurrency(condition.threshold)
            : formatNumber(condition.threshold);

        // Render timeline
        let timelineHtml = '';
        if (events.length > 0) {
            const sortedEvents = [...events].sort((a, b) =>
                new Date(a.timestampUtc || a.createdAt).getTime() - new Date(b.timestampUtc || b.createdAt).getTime()
            );

            timelineHtml = sortedEvents.map(evt => {
                const isTerminal = isTerminalEvent(evt.eventType);
                return `
                    <div class="event-item ${isTerminal ? 'terminal' : ''}">
                        <div class="event-dot"></div>
                        <div class="event-content">
                            <div class="event-type">${getEventDescription(evt.eventType)}</div>
                            <div class="event-time">${formatDate(evt.timestampUtc || evt.createdAt)}</div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            timelineHtml = `
                <div class="event-item">
                    <div class="event-dot"></div>
                    <div class="event-content">
                        <div class="event-type">No events recorded</div>
                    </div>
                </div>
            `;
        }

        // Render page
        container.innerHTML = `
            <header class="receipt-header">
                <h1 class="receipt-title ${statusClass}">${pageTitle}</h1>
                <p class="receipt-subtitle">This document certifies the execution of an immutable performance contract on the Collateral platform.</p>
                <p class="finality-notice">This record cannot be altered.</p>
                
                <div class="receipt-meta">
                    <div class="receipt-meta-item">
                        <span class="receipt-meta-label">Contract ID</span>
                        <span class="receipt-meta-value hash" onclick="navigator.clipboard.writeText('${contractId}')" title="Click to copy">${truncateId(contractId)}</span>
                    </div>
                    <div class="receipt-meta-item">
                        <span class="receipt-meta-label">Status</span>
                        <span class="receipt-meta-value">${statusText}</span>
                    </div>
                    <div class="receipt-meta-item">
                        <span class="receipt-meta-label">Created</span>
                        <span class="receipt-meta-value">${formatDate(contract.createdAt)}</span>
                    </div>
                    <div class="receipt-meta-item">
                        <span class="receipt-meta-label">Deadline</span>
                        <span class="receipt-meta-value">${formatShortDate(contract.deadlineUtc || condition.deadline)}</span>
                    </div>
                </div>
            </header>
            
            <section class="receipt-section">
                <h2 class="receipt-section-title">Contract Terms</h2>
                <table class="receipt-table">
                    <tr><td>Platform</td><td>${platformDisplay}</td></tr>
                    <tr><td>Metric</td><td>${metricDisplay}</td></tr>
                    <tr><td>Baseline Snapshot</td><td>${baselineValue}</td></tr>
                    <tr><td>Target</td><td>${targetValue}</td></tr>
                    <tr><td>Time Window</td><td>30 days</td></tr>
                    <tr class="capital-row"><td>Capital Locked</td><td>${formatCurrency(contract.lockAmountUsdCents)}</td></tr>
                    <tr><td>Payout Amount</td><td class="value-gold">${formatCurrency(contract.payoutAmountUsdCents)}</td></tr>
                    <tr><td>Verification</td><td>API Verified</td></tr>
                </table>
            </section>
            
            <section class="receipt-section">
                <h2 class="receipt-section-title">Event Timeline</h2>
                <div class="event-timeline">
                    ${timelineHtml}
                </div>
            </section>
            
            <section class="receipt-section">
                <h2 class="receipt-section-title">Contract Status</h2>
                <div class="status-block ${statusClass}">
                    <div>
                        <div class="status-label ${statusClass}">${statusText}</div>
                        <div class="status-detail">${isSuccess ? 'Contract is active. Settlement will occur at deadline.' : isFailure ? 'This contract has been settled.' : 'Awaiting execution.'}</div>
                    </div>
                    <div class="status-timestamp">Deadline: ${formatShortDate(contract.deadlineUtc || condition.deadline)}</div>
                </div>
            </section>
            
            <footer class="receipt-footer">
                <p>All contracts settle publicly.<br>Outcomes are permanent.<br>No appeals. No overrides.</p>
                <p class="legal">This receipt may be used for personal records or verification purposes.</p>
                
                <div class="receipt-actions">
                    <button class="receipt-btn" onclick="navigator.clipboard.writeText('${contractId}')">
                        Copy Contract ID
                    </button>
                    <button class="receipt-btn" onclick="window.router.navigate('/ledger')">
                        View Ledger
                    </button>
                    <button class="receipt-btn primary" onclick="window.router.navigate('/contracts')">
                        Create Another Contract
                    </button>
                </div>
            </footer>
        `;

    } catch (error) {
        console.error('[Receipt] Error loading contract:', error);
        container.innerHTML = `
            <div class="receipt-not-found">
                <h1>Record Not Found</h1>
                <p>${error.message || 'The requested receipt does not exist or is not accessible.'}</p>
                <div style="margin-top: 1.5rem;">
                    <button class="receipt-btn" onclick="window.router.navigate('/my-contracts')">View My Contracts</button>
                </div>
            </div>
        `;
    }
}
