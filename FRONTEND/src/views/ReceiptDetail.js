// Receipt Detail Page - Immutable Record View
// Route: /receipts/:id
// Aesthetic: Financial trade confirmation + legal receipt + public record

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
            
            .receipt-header {
                border-bottom: 2px solid #0E0E11;
                padding-bottom: 2rem;
                margin-bottom: 2rem;
            }
            
            .receipt-title {
                font-size: 2.5rem;
                font-weight: 700;
                letter-spacing: -0.02em;
                color: #0E0E11;
                margin-bottom: 0.5rem;
            }
            
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
            
            .snapshot-box {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                padding: 1.25rem;
            }
            
            .snapshot-source {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                font-family: ui-monospace, monospace;
                font-size: 10px;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: #6B6E76;
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                padding: 0.25rem 0.5rem;
                margin-bottom: 1rem;
            }
            
            .snapshot-value {
                font-family: ui-monospace, monospace;
                font-size: 1.75rem;
                font-weight: 600;
                color: #0E0E11;
                margin-bottom: 0.5rem;
            }
            
            .snapshot-timestamp {
                font-size: 11px;
                color: #6B6E76;
            }
            
            .snapshot-note {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #E5E5E5;
                font-size: 11px;
                color: #6B6E76;
                font-style: italic;
            }
            
            .ledger-box {
                background: #0E0E11;
                color: #FFFFFF;
                padding: 1.5rem;
            }
            
            .ledger-row {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .ledger-row:last-child {
                border-bottom: none;
            }
            
            .ledger-label {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: rgba(255,255,255,0.5);
            }
            
            .ledger-value {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                color: rgba(255,255,255,0.9);
            }
            
            .ledger-note {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid rgba(255,255,255,0.1);
                font-size: 10px;
                color: rgba(255,255,255,0.4);
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
            .status-block.success { border-color: #1F7A4D; }
            .status-block.failure { border-color: #8B1E1E; }
            
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
                letter-spacing: 0.02em;
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
            }
            
            .receipt-btn:hover {
                border-color: #0E0E11;
                color: #0E0E11;
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
            <!-- Content populated by JS -->
        </div>
    `;
}

export function initReceiptDetail(params) {
    const container = document.getElementById('receipt-container');
    const receiptId = params?.id;

    // Mock receipts database
    const mockReceipts = {
        'RCP-001': {
            receiptId: 'RCP-0x8a72390f1d2b4c5e6f7a8b9cd',
            contractId: 'CTR-0x7A3F9E2B1C4D5E6F7A8B9CD4D1',
            executionTimestamp: '2026-01-04T19:43:22Z',
            status: 'ACTIVE',
            terms: {
                authority: 'X (Twitter)',
                metric: 'Followers',
                baseline: 3842,
                target: 10000,
                timeWindow: 30,
                capitalLocked: 5000,
                multiplier: 2.0,
                failureCondition: 'Capital forfeiture'
            },
            snapshot: {
                source: 'X API v2',
                value: 3842,
                unit: 'followers',
                capturedAt: '2026-01-04T19:43:22Z'
            },
            ledger: {
                eventId: 'EVT-0x9f3d2a1b4c5e6f7e8',
                eventType: 'CONTRACT_EXECUTED',
                hashChain: '0xa8b3c9d4e5f67890abcdef12345672a1',
                prevHash: '0x7c2d1e0f8a9b3c4d5e6f70819b3',
                appendTimestamp: '2026-01-04T19:43:22.847Z'
            },
            deadline: '2026-02-03T19:43:22Z'
        }
    };

    const receipt = mockReceipts[receiptId];

    if (!receipt) {
        container.innerHTML = `
            <div class="receipt-not-found">
                <h1>Record Not Found</h1>
                <p>The requested receipt does not exist or is not accessible.</p>
            </div>
        `;
        return;
    }

    // Format helpers
    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    function formatCurrency(num) {
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    }

    function truncateHash(hash, startLen = 12, endLen = 3) {
        if (hash.length <= startLen + endLen + 3) return hash;
        return hash.slice(0, startLen) + '...' + hash.slice(-endLen);
    }

    // Render receipt
    const statusClass = receipt.status === 'SETTLED_SUCCESS' ? 'success' :
        receipt.status === 'SETTLED_FAILURE' ? 'failure' : 'active';
    const statusText = receipt.status === 'SETTLED_SUCCESS' ? 'SETTLED — SUCCESS' :
        receipt.status === 'SETTLED_FAILURE' ? 'SETTLED — FAILURE' : 'ACTIVE';
    const statusDetail = receipt.status === 'ACTIVE' ? 'Settlement will occur automatically at deadline.' :
        receipt.status === 'SETTLED_SUCCESS' ? `Target achieved. Payout: ${formatCurrency(receipt.terms.capitalLocked * receipt.terms.multiplier)}` :
            `Target not achieved. Capital forfeited: ${formatCurrency(receipt.terms.capitalLocked)}`;

    container.innerHTML = `
        <header class="receipt-header">
            <h1 class="receipt-title">Contract Receipt</h1>
            <p class="receipt-subtitle">This document certifies the execution of an immutable performance contract.</p>
            <p class="finality-notice">This record cannot be altered.</p>
            
            <div class="receipt-meta">
                <div class="receipt-meta-item">
                    <span class="receipt-meta-label">Receipt ID</span>
                    <span class="receipt-meta-value hash">${truncateHash(receipt.receiptId)}</span>
                </div>
                <div class="receipt-meta-item">
                    <span class="receipt-meta-label">Contract ID</span>
                    <span class="receipt-meta-value hash">${truncateHash(receipt.contractId)}</span>
                </div>
                <div class="receipt-meta-item">
                    <span class="receipt-meta-label">Execution Timestamp</span>
                    <span class="receipt-meta-value">${formatDate(receipt.executionTimestamp)}</span>
                </div>
                <div class="receipt-meta-item">
                    <span class="receipt-meta-label">Status</span>
                    <span class="receipt-meta-value">${receipt.status}</span>
                </div>
            </div>
        </header>
        
        <section class="receipt-section">
            <h2 class="receipt-section-title">Contract Terms</h2>
            <table class="receipt-table">
                <tr><td>Authority</td><td>${receipt.terms.authority}</td></tr>
                <tr><td>Metric</td><td>${receipt.terms.metric}</td></tr>
                <tr><td>Baseline Snapshot</td><td>${formatNumber(receipt.terms.baseline)} ${receipt.snapshot.unit}</td></tr>
                <tr><td>Target</td><td>${formatNumber(receipt.terms.target)} ${receipt.snapshot.unit}</td></tr>
                <tr><td>Time Window</td><td>${receipt.terms.timeWindow} days</td></tr>
                <tr class="capital-row"><td>Capital Locked</td><td>${formatCurrency(receipt.terms.capitalLocked)}</td></tr>
                <tr><td>Payout Multiplier</td><td class="value-gold">${receipt.terms.multiplier}×</td></tr>
                <tr><td>Failure Condition</td><td class="value-red">${receipt.terms.failureCondition}</td></tr>
            </table>
        </section>
        
        <section class="receipt-section">
            <h2 class="receipt-section-title">Verified Baseline Snapshot</h2>
            <div class="snapshot-box">
                <span class="snapshot-source">Pulled from ${receipt.snapshot.source}</span>
                <div class="snapshot-value">${formatNumber(receipt.snapshot.value)} ${receipt.snapshot.unit}</div>
                <div class="snapshot-timestamp">Captured: ${formatDate(receipt.snapshot.capturedAt)}</div>
                <p class="snapshot-note">This value is immutable and used as the baseline for settlement.</p>
            </div>
        </section>
        
        <section class="receipt-section">
            <h2 class="receipt-section-title">Ledger Record</h2>
            <div class="ledger-box">
                <div class="ledger-row">
                    <span class="ledger-label">Ledger Event ID</span>
                    <span class="ledger-value">${truncateHash(receipt.ledger.eventId)}</span>
                </div>
                <div class="ledger-row">
                    <span class="ledger-label">Event Type</span>
                    <span class="ledger-value">CONTRACT_EXECUTED</span>
                </div>
                <div class="ledger-row">
                    <span class="ledger-label">Hash Chain Reference</span>
                    <span class="ledger-value">${truncateHash(receipt.ledger.hashChain)}</span>
                </div>
                <div class="ledger-row">
                    <span class="ledger-label">Previous Event Hash</span>
                    <span class="ledger-value">${truncateHash(receipt.ledger.prevHash)}</span>
                </div>
                <div class="ledger-row">
                    <span class="ledger-label">Append Timestamp</span>
                    <span class="ledger-value">${formatDate(receipt.ledger.appendTimestamp)}</span>
                </div>
                <p class="ledger-note">This receipt is backed by an append-only ledger. Records cannot be altered or removed.</p>
            </div>
        </section>
        
        <section class="receipt-section">
            <h2 class="receipt-section-title">Contract Status</h2>
            <div class="status-block ${statusClass}">
                <div>
                    <div class="status-label ${statusClass}">${statusText}</div>
                    <div class="status-detail">${statusDetail}</div>
                </div>
                <div class="status-timestamp">Deadline: ${formatDate(receipt.deadline)}</div>
            </div>
        </section>
        
        <footer class="receipt-footer">
            <p>All contracts settle publicly.<br>Outcomes are permanent.<br>No appeals. No overrides.</p>
            <p class="legal">This receipt may be used for personal records or verification purposes.</p>
            
            <div class="receipt-actions">
                <button class="receipt-btn" onclick="navigator.clipboard.writeText('${receipt.receiptId}')">
                    Copy Receipt ID
                </button>
            </div>
        </footer>
    `;
}
