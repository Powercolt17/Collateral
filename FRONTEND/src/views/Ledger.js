// Ledger View - Content from ledger.html
export function renderLedger() {
    return `
        <style>
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(-12px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes flashGreen {
                0% { background-color: rgba(16, 185, 129, 0.08); }
                100% { background-color: transparent; }
            }
            @keyframes flashRed {
                0% { background-color: rgba(159, 29, 29, 0.08); }
                100% { background-color: transparent; }
            }
            .animate-new-row {
                animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .flash-success {
                animation: flashGreen 1.5s ease-out forwards;
            }
            .flash-failure {
                animation: flashRed 1.5s ease-out forwards;
            }
            .live-dot {
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                animation: pulse-green 2s infinite;
            }
            @keyframes pulse-green {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
        </style>
        <div class="pb-32 w-full max-w-6xl mx-auto px-6 relative z-10 min-h-screen flex flex-col">
            <main id="view-ledger" class="view-section flex flex-col gap-0 w-full animate-activate">
                
                <!-- Page Header -->
                <div class="w-full border-b border-gray-300 pb-8 mb-12 mt-12">
                    <!-- Top metadata row -->
                    <div class="flex items-start justify-between mb-8">
                        <!-- Left: System metadata -->
                        <div class="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-wider text-gray-500">
                            <div>NETWORK: MAINNET</div>
                            <div class="flex items-center gap-1.5">
                                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot"></div>
                                <span>LIVE FEED</span>
                            </div>
                            <div>SYSTEM STATUS: OPERATIONAL</div>
                        </div>

                        <!-- Right: Total Value Locked -->
                        <div class="text-right">
                            <div class="font-mono text-[11px] uppercase tracking-wider text-gray-500 mb-1">
                                TOTAL VALUE LOCKED
                            </div>
                            <div class="font-mono text-2xl" id="global-tvl">
                                $24,567,890
                            </div>
                        </div>
                    </div>

                    <!-- Center: Primary heading -->
                    <div class="text-center">
                        <h1 class="text-5xl tracking-tight mb-3" style="color: #751212; font-family: 'IBM Plex Sans', sans-serif; font-weight: 700;">
                            PUBLIC RECORD
                        </h1>
                        <p class="font-mono text-xs uppercase tracking-wider text-gray-500">
                            EVERY CONTRACT SETTLES. OUTCOMES ARE PERMANENT.
                        </p>
                    </div>
                </div>

                <!-- Filters -->
                <div class="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
                    <div class="flex gap-4 w-full sm:w-auto">
                        <div class="relative w-full sm:w-80">
                            <input type="text" placeholder="Search transaction hash or principal" class="h-10 pl-0 pr-3 w-full bg-white border-b border-neutral-200 font-mono text-[11px] focus:outline-none focus:border-neutral-900 transition-colors placeholder-neutral-400 text-neutral-900 rounded-none">
                        </div>
                        
                        <div class="relative">
                            <select class="h-10 pl-2 pr-8 w-full sm:w-40 bg-white border-b border-neutral-200 font-mono text-[11px] focus:outline-none focus:border-neutral-900 transition-colors text-neutral-500 cursor-pointer appearance-none rounded-none uppercase tracking-wide">
                                <option value="" selected>All Events</option>
                                <option value="created">Contract Authored</option>
                                <option value="locked">Contract Executed</option>
                                <option value="settled">Contract Settled</option>
                                <option value="forfeited">Forfeited</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <div class="w-full">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr class="border-b border-neutral-200">
                                    <th class="py-3 pr-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest w-[150px]">Timestamp</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest w-[180px]">Event Type</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest w-[120px]">Tx Hash</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest w-[160px]">Principal</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest text-right w-[110px]">Value (USD)</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest text-right w-[110px]">Multiplier</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest text-right w-[100px]">Status</th>
                                    <th class="py-3 pl-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest text-right w-[100px]">Outcome</th>
                                </tr>
                            </thead>
                            <tbody id="ledger-body" class="divide-y divide-neutral-100">
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Footer Authority Line -->
                <div class="mt-20 border-t border-neutral-200 pt-8">
                    <p class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest text-center select-none">
                        Records are immutable. Outcomes cannot be appealed.
                    </p>
                </div>
            </main>
        </div>
    `;
}

export async function initLedger() {
    const tbody = document.getElementById('ledger-body');
    if (!tbody) return;

    // Show loading state
    tbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center font-mono text-sm text-neutral-400">Loading ledger events...</td></tr>`;

    try {
        // Fetch real ledger events from API
        const response = await window.api.getPublicLedger();
        const events = response?.events || [];

        console.log('[Ledger] Loaded', events.length, 'events');

        if (events.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="py-12 text-center">
                        <div class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-2">No Events Recorded</div>
                        <div class="font-sans text-sm text-neutral-500">The public ledger is empty. Contracts will appear here when executed.</div>
                    </td>
                </tr>
            `;
            return;
        }

        // Helper functions
        function formatTimestamp(isoString) {
            if (!isoString) return '-';
            const date = new Date(isoString);
            return date.toISOString().split('T')[1].split('.')[0] + ' UTC';
        }

        function formatEventType(type) {
            const map = {
                'CONTRACT_CREATED': 'Contract Authored',
                'FUNDS_AUTHORIZED': 'Payment Authorized',
                'FUNDS_LOCKED': 'Contract Executed',
                'EXECUTION_CONFIRMED': 'Execution Confirmed',
                'VERIFICATION_STARTED': 'Verification Started',
                'VERIFICATION_SUCCEEDED': 'Verification Passed',
                'VERIFICATION_FAILED': 'Verification Failed',
                'SETTLED_SUCCESS': 'Contract Settled',
                'SETTLED_FAILURE': 'Contract Forfeited',
            };
            return map[type] || type;
        }

        function getEventColor(type) {
            if (type.includes('SETTLED_SUCCESS') || type.includes('VERIFIED')) return 'emerald-700';
            if (type.includes('SETTLED_FAILURE') || type.includes('FORFEITED')) return '[#921818]';
            if (type.includes('LOCKED') || type.includes('EXECUTED')) return 'neutral-900';
            return 'neutral-500';
        }

        function getStatus(type) {
            if (type.includes('SETTLED_SUCCESS')) return { status: 'Settled', outcome: 'Success' };
            if (type.includes('SETTLED_FAILURE')) return { status: 'Forfeited', outcome: 'Failure' };
            if (type.includes('LOCKED') || type.includes('EXECUTION_CONFIRMED')) return { status: 'Locked', outcome: '—' };
            if (type.includes('FUNDS_AUTHORIZED')) return { status: 'Pending', outcome: '—' };
            return { status: 'Created', outcome: '—' };
        }

        function formatCurrency(cents) {
            if (!cents) return '—';
            return (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });
        }

        function truncateHash(hash) {
            if (!hash) return '—';
            if (hash.length > 12) return hash.slice(0, 6) + '...' + hash.slice(-4);
            return hash;
        }

        // Render events
        let html = '';
        events.forEach(event => {
            const color = getEventColor(event.eventType);
            const { status, outcome } = getStatus(event.eventType);
            const contractIdShort = event.contractId ? event.contractId.slice(0, 8) + '...' : '—';

            html += `
                <tr class="group hover:bg-neutral-50/50 transition-colors">
                    <td class="py-3 pr-4 font-mono text-[11px] text-neutral-500 align-top whitespace-nowrap">${formatTimestamp(event.timestamp)}</td>
                    <td class="py-3 px-4 font-mono text-[10px] text-${color} font-medium uppercase tracking-wide align-top">${formatEventType(event.eventType)}</td>
                    <td class="py-3 px-4 font-mono text-[11px] text-neutral-500 truncate align-top select-all cursor-text">${truncateHash(event.eventHash)}</td>
                    <td class="py-3 px-4 font-mono text-[11px] text-neutral-600 align-top cursor-pointer hover:text-neutral-900 transition-colors">${contractIdShort}</td>
                    <td class="py-3 px-4 font-mono text-[11px] text-neutral-900 text-right align-top">${formatCurrency(event.amountUsdCents)}</td>
                    <td class="py-3 px-4 font-mono text-[11px] text-neutral-400 text-right align-top tracking-tight">—</td>
                    <td class="py-3 px-4 font-mono text-[10px] text-${color} font-semibold text-right uppercase tracking-widest align-top">${status}</td>
                    <td class="py-3 pl-4 font-mono text-[10px] text-${color} text-right uppercase tracking-widest align-top">${outcome}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;

        // Update TVL display
        const tvlEl = document.getElementById('global-tvl');
        if (tvlEl) {
            // Calculate total from settled events (approximate TVL)
            const totalCents = events
                .filter(e => e.amountUsdCents)
                .reduce((sum, e) => sum + (e.amountUsdCents || 0), 0);
            tvlEl.textContent = (totalCents / 100).toLocaleString() + ' USD';
        }

    } catch (error) {
        console.error('[Ledger] Error loading events:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="py-8 text-center font-mono text-sm text-red-500">
                    Error loading ledger: ${error.message || 'Unknown error'}
                </td>
            </tr>
        `;
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

