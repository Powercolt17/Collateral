// Receipt Index Page - List or Empty State
// Route: /receipts
// Shows list of receipts if any exist, otherwise empty state

export function renderReceipts() {
    return `
        <style>
            .receipts-page {
                max-width: 900px;
                margin: 0 auto;
                padding: 3rem 1.5rem;
                font-family: ui-sans-serif, system-ui, sans-serif;
                min-height: 70vh;
            }
            
            .receipts-header {
                margin-bottom: 3rem;
            }
            
            .receipts-title {
                font-size: 2rem;
                font-weight: 700;
                letter-spacing: -0.02em;
                color: #0E0E11;
                margin-bottom: 0.5rem;
            }
            
            .receipts-subtitle {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                letter-spacing: 0.05em;
                color: #6B6E76;
            }
            
            .receipts-divider {
                height: 1px;
                background: #E5E5E5;
                margin: 2rem 0;
            }
            
            /* Empty State */
            .receipts-empty {
                padding: 5rem 2rem;
                text-align: center;
                border: 1px solid #D9DBE1;
                background: #FAFAFA;
            }
            
            .receipts-empty-title {
                font-family: ui-monospace, monospace;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: #0E0E11;
                margin-bottom: 1.25rem;
            }
            
            .receipts-empty-text {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                color: #6B6E76;
                line-height: 1.8;
                letter-spacing: 0.02em;
            }
            
            /* Receipt List */
            .receipts-list {
                display: flex;
                flex-direction: column;
                gap: 1px;
                background: #E5E5E5;
                border: 1px solid #E5E5E5;
            }
            
            .receipt-row {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr;
                gap: 1rem;
                padding: 1rem 1.25rem;
                background: #FFFFFF;
                cursor: pointer;
            }
            
            .receipt-row:hover {
                background: #FAFAFA;
            }
            
            .receipt-row-header {
                background: #FAFAFA;
                cursor: default;
            }
            
            .receipt-row-header:hover {
                background: #FAFAFA;
            }
            
            .receipt-cell {
                font-family: ui-monospace, monospace;
                font-size: 12px;
                color: #0E0E11;
                display: flex;
                align-items: center;
            }
            
            .receipt-cell-header {
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #6B6E76;
            }
            
            .receipt-cell-id {
                font-size: 11px;
                color: #4D5057;
            }
            
            .receipt-status {
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                padding: 0.25rem 0.5rem;
                display: inline-block;
            }
            
            .receipt-status.active {
                background: #0E0E11;
                color: #FFFFFF;
            }
            
            .receipt-status.success {
                background: #1F7A4D;
                color: #FFFFFF;
            }
            
            .receipt-status.failure {
                background: #8B1E1E;
                color: #FFFFFF;
            }
            
            .receipts-footer {
                text-align: center;
            }
            
            .receipts-footer p {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                letter-spacing: 0.05em;
                color: #9CA0A8;
            }
        </style>
        
        <div class="receipts-page">
            <header class="receipts-header">
                <h1 class="receipts-title">Execution Receipts</h1>
                <p class="receipts-subtitle">Permanent records. Append-only ledger.</p>
            </header>
            
            <div class="receipts-divider"></div>
            
            <div id="receipts-content">
                <!-- Populated by JS -->
            </div>
            
            <div class="receipts-divider"></div>
            
            <footer class="receipts-footer">
                <p>Receipts are generated at contract execution. Records cannot be modified or removed.</p>
            </footer>
        </div>
    `;
}

export function initReceipts() {
    const container = document.getElementById('receipts-content');

    // Mock: Empty receipts array (simulating user with no executed contracts)
    const userReceipts = [];

    // If receipts.length === 0 → show empty state
    if (userReceipts.length === 0) {
        container.innerHTML = `
            <div class="receipts-empty">
                <h2 class="receipts-empty-title">No execution records exist for this identity.</h2>
                <p class="receipts-empty-text">
                    Receipts are created when a contract is executed.<br>
                    This ledger contains no entries.
                </p>
            </div>
        `;
        return;
    }

    // If receipts.length > 0 → show receipt list
    let listHTML = `
        <div class="receipts-list">
            <div class="receipt-row receipt-row-header">
                <div class="receipt-cell receipt-cell-header">Receipt ID</div>
                <div class="receipt-cell receipt-cell-header">Capital</div>
                <div class="receipt-cell receipt-cell-header">Executed</div>
                <div class="receipt-cell receipt-cell-header">Status</div>
            </div>
    `;

    userReceipts.forEach(receipt => {
        const statusClass = receipt.status === 'SETTLED_SUCCESS' ? 'success' :
            receipt.status === 'SETTLED_FAILURE' ? 'failure' : 'active';
        const statusText = receipt.status === 'SETTLED_SUCCESS' ? 'Settled' :
            receipt.status === 'SETTLED_FAILURE' ? 'Forfeited' : 'Active';

        listHTML += `
            <div class="receipt-row" onclick="window.router.navigate('/receipts/${receipt.id}')">
                <div class="receipt-cell receipt-cell-id">${receipt.receiptId}</div>
                <div class="receipt-cell">${receipt.capital}</div>
                <div class="receipt-cell">${receipt.executedDate}</div>
                <div class="receipt-cell">
                    <span class="receipt-status ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
    });

    listHTML += '</div>';
    container.innerHTML = listHTML;
}
