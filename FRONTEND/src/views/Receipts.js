// Execution Records Page - List or Empty State
// Route: /receipts
// Shows list of execution receipts from the append-only ledger

export function renderReceipts() {
    return `
        <div class="min-h-screen bg-white">
            <!-- Header -->
            <div class="border-b border-neutral-300">
                <div class="max-w-5xl mx-auto px-8 py-8">
                    <div class="mb-2 text-xs tracking-wider text-neutral-500 font-mono uppercase">
                        SYSTEM STATUS: OPERATIONAL
                    </div>
                    <div class="mb-6 text-xs tracking-wider text-neutral-500 font-mono uppercase">
                        RECORD TYPE: EXECUTION RECEIPTS
                    </div>
                    <h1 class="text-2xl font-normal tracking-tight text-neutral-900 mb-2">
                        EXECUTION RECORDS
                    </h1>
                    <p class="text-sm font-mono text-neutral-600">
                        Permanent records. Append-only ledger.
                    </p>
                </div>
            </div>

            <!-- Table Container -->
            <div class="max-w-5xl mx-auto px-8 py-12">
                <div id="receipts-content">
                    <!-- Populated by JS -->
                    <div class="py-12 text-center">
                        <p class="text-sm font-mono text-neutral-500">Loading records...</p>
                    </div>
                </div>
            </div>

            <!-- Footer Notice -->
            <div class="border-t border-neutral-300 mt-12">
                <div class="max-w-5xl mx-auto px-8 py-6">
                    <p class="text-xs font-mono text-neutral-600 text-center">
                        Records are immutable. Outcomes cannot be altered or removed.
                    </p>
                </div>
            </div>
        </div>
    `;
}

export async function initReceipts() {
    const container = document.getElementById('receipts-content');

    try {
        // Fetch user's contracts from API
        const response = await window.api.getContracts();
        const contracts = response?.contracts || [];

        console.log('[Receipts] Loaded', { total: contracts.length });

        // If no contracts → show empty state
        if (contracts.length === 0) {
            container.innerHTML = `
                <div class="py-24 text-center">
                    <p class="text-sm font-mono text-neutral-600 mb-2">
                        NO EXECUTION RECORDS AVAILABLE
                    </p>
                    <p class="text-xs font-mono text-neutral-500">
                        Execution receipts are generated at contract execution.
                    </p>
                    <p class="text-xs font-mono text-neutral-500">
                        Records cannot be modified or removed.
                    </p>
                </div>
            `;
            return;
        }

        // Format helpers
        function formatCurrency(cents) {
            if (!cents) return '$0.00';
            return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });
        }

        function formatDateTime(isoString) {
            if (!isoString) return '-';
            const date = new Date(isoString);
            return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
        }

        function formatContractId(id) {
            if (!id) return '-';
            // Format as CTX-YYYY-XXXX-HASH
            const year = new Date().getFullYear();
            const shortId = id.slice(0, 4).toUpperCase();
            const hash = id.slice(-4).toUpperCase();
            return \`CTX-\${year}-\${shortId}-\${hash}\`;
        }

        function getStatusText(state) {
            const statusMap = {
                'CREATED': 'PENDING',
                'FUNDS_AUTHORIZED': 'PENDING',
                'FUNDS_LOCKED': 'EXECUTED',
                'LOCKED': 'EXECUTED',
                'ACTIVE': 'EXECUTED',
                'EXECUTION_CONFIRMED': 'EXECUTED',
                'VERIFIED': 'EXECUTED',
                'VERIFYING': 'EXECUTED',
                'SETTLED_SUCCESS': 'SETTLED',
                'SETTLED': 'SETTLED',
                'SETTLED_FAILURE': 'SETTLED',
                'FORFEITED': 'SETTLED',
                'PAYOUT_COMPLETE': 'SETTLED',
                'COMPLETED': 'SETTLED',
            };
            return statusMap[state] || state;
        }

        // Build table HTML
        let tableHTML = `
                < table class="w-full border-collapse" >
                <thead>
                    <tr class="border-b border-neutral-300">
                        <th class="text-left py-3 px-4 text-xs font-mono tracking-wider text-neutral-700 uppercase">
                            Contract ID
                        </th>
                        <th class="text-left py-3 px-4 text-xs font-mono tracking-wider text-neutral-700 uppercase">
                            Capital Locked
                        </th>
                        <th class="text-left py-3 px-4 text-xs font-mono tracking-wider text-neutral-700 uppercase">
                            Executed
                        </th>
                        <th class="text-left py-3 px-4 text-xs font-mono tracking-wider text-neutral-700 uppercase">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
        `;

        contracts.forEach(contract => {
            const contractId = formatContractId(contract.id);
            const capital = formatCurrency(contract.lockAmountUsdCents);
            const executed = formatDateTime(contract.createdAt);
            const status = getStatusText(contract.state);

            tableHTML += `
                <tr class="border-b border-neutral-200 cursor-pointer hover:bg-neutral-50" 
                    onclick="window.router.navigate('/receipts/${contract.id}')">
                    <td class="py-4 px-4">
                        <span class="font-mono text-sm text-neutral-900 underline decoration-1 underline-offset-2">
                            ${contractId}
                        </span>
                    </td>
                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">
                        ${capital}
                    </td>
                    <td class="py-4 px-4 font-mono text-sm text-neutral-600">
                        ${executed}
                    </td>
                    <td class="py-4 px-4">
                        <span class="font-mono text-xs tracking-wider text-neutral-900 uppercase">
                            ${status}
                        </span>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table >
                `;

        container.innerHTML = tableHTML;

    } catch (error) {
        console.error('[Receipts] Error loading contracts:', error);
        container.innerHTML = `
                < div class="py-24 text-center" >
                <p class="text-sm font-mono text-neutral-600 mb-2">
                    ERROR LOADING RECORDS
                </p>
                <p class="text-xs font-mono text-neutral-500">
                    ${error.message || 'Please try again later.'}
                </p>
            </div >
                `;
    }
}
