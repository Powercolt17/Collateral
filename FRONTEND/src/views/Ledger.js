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
                <div class="w-full mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 pb-8 mt-12">
                    <div>
                        <div class="flex flex-col gap-1 mb-4">
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Network: Mainnet</span>
                                <span class="text-neutral-300">|</span>
                                <div class="flex items-center gap-1.5">
                                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot"></div>
                                    <span class="font-mono text-[10px] uppercase tracking-widest text-emerald-600 font-medium">Live Feed</span>
                                </div>
                            </div>
                            <span class="font-mono text-[10px] uppercase tracking-widest text-neutral-500">System Status: Operational</span>
                        </div>
                        <h1 class="font-display font-bold text-3xl tracking-tight text-[#921818] uppercase">Public Record</h1>
                        <p class="font-mono text-[10px] text-neutral-400 mt-3 uppercase tracking-widest">Every contract settles. Outcomes are permanent.</p>
                    </div>

                    <!-- Global Stats -->
                    <div class="flex gap-12">
                        <div class="flex flex-col gap-1">
                            <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Total Value Locked</span>
                            <span class="font-mono text-xs text-neutral-500" id="global-tvl">2,840,500 USD</span>
                        </div>
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

export function initLedger() {
    const principals = ['@jason_ship', '@alice_dev', '@sarah_builds', '@founder_01', '@yield_hunter', '@anon_cap', '@vector_vc', '@protocol_labs', '@sol_wizard'];
    const outcomes = [
        { type: 'Contract Settled', status: 'Settled', outcome: 'Success', color: 'emerald-700', flash: 'flash-success', weight: 4 },
        { type: 'Contract Forfeited', status: 'Forfeited', outcome: 'Failure', color: '[#921818]', flash: 'flash-failure', weight: 1 },
        { type: 'Contract Executed', status: 'Locked', outcome: '—', color: 'neutral-900', flash: '', weight: 3 },
        { type: 'Identity Confirmed', status: 'Confirmed', outcome: '—', color: 'neutral-500', flash: '', weight: 2 }
    ];

    const multipliers = ['2.5x', '1.8x', '+$7,500', '3.1x', '+$12,400', '1.5x', '+$1,200', '10.0x', '+$500', '4.2x'];

    const initialData = [
        { ts: '14:02:11', type: 'Contract Settled', hash: '0x8a7...2b91', user: '@jason_ship', val: '5,000.00', mult: '2.5x', status: 'Settled', outcome: 'Success', color: 'emerald-700' },
        { ts: '14:02:05', type: 'Identity Confirmed', hash: '0x8a7...2b91', user: '@jason_ship', val: '—', mult: '—', status: 'Confirmed', outcome: '—', color: 'neutral-500' },
        { ts: '14:01:44', type: 'Contract Forfeited', hash: '0x3c2...9f44', user: '@demo_user', val: '1,200.00', mult: '—', status: 'Forfeited', outcome: 'Failure', color: '[#921818]' },
        { ts: '14:00:12', type: 'Contract Executed', hash: '0xe11...5a02', user: '@alice_dev', val: '10,000.00', mult: '—', status: 'Locked', outcome: '—', color: 'neutral-900' },
        { ts: '13:58:30', type: 'Contract Settled', hash: '0xf33...1b99', user: '@sarah_builds', val: '500.00', mult: '+$240', status: 'Settled', outcome: 'Success', color: 'emerald-700' }
    ];

    const tbody = document.getElementById('ledger-body');
    if (!tbody) return;

    const MAX_LEDGER_ITEMS = 15;

    function getRandomItem(arr, weightProp) {
        if (!weightProp) return arr[Math.floor(Math.random() * arr.length)];
        const totalWeight = arr.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        for (const item of arr) {
            if (random < item.weight) return item;
            random -= item.weight;
        }
        return arr[0];
    }

    function generateHash() {
        return '0x' + Math.floor(Math.random() * 16777215).toString(16) + '...' + Math.floor(Math.random() * 65535).toString(16);
    }

    function generateValue() {
        return (Math.random() * 15000 + 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function getTimestamp() {
        const now = new Date();
        return now.toISOString().split('T')[1].split('.')[0] + ' UTC';
    }

    function createRowHTML(data, isNew = false) {
        const row = document.createElement('tr');
        row.className = `group hover:bg-neutral-50/50 transition-colors ${isNew ? 'animate-new-row ' + (data.flash || '') : ''}`;
        const multColor = data.status === 'Settled' ? 'text-emerald-700 font-semibold' : 'text-neutral-400';

        row.innerHTML = `
            <td class="py-3 pr-4 font-mono text-[11px] text-neutral-500 align-top whitespace-nowrap">${data.ts}</td>
            <td class="py-3 px-4 font-mono text-[10px] text-${data.color} font-medium uppercase tracking-wide align-top">${data.type}</td>
            <td class="py-3 px-4 font-mono text-[11px] text-neutral-500 truncate align-top select-all cursor-text">${data.hash}</td>
            <td class="py-3 px-4 font-mono text-[11px] text-neutral-600 align-top cursor-pointer hover:text-neutral-900 transition-colors">${data.user}</td>
            <td class="py-3 px-4 font-mono text-[11px] ${data.type.includes('Settled') || data.type.includes('Forfeited') ? 'text-' + data.color : 'text-neutral-900'} text-right align-top">${data.val}</td>
            <td class="py-3 px-4 font-mono text-[11px] ${multColor} text-right align-top tracking-tight">${data.mult}</td>
            <td class="py-3 px-4 font-mono text-[10px] text-${data.color} font-semibold text-right uppercase tracking-widest align-top">${data.status}</td>
            <td class="py-3 pl-4 font-mono text-[10px] text-${data.color} ${data.status === 'Locked' || data.status === 'Confirmed' ? 'text-neutral-400' : 'font-semibold'} text-right uppercase tracking-widest align-top">${data.outcome}</td>
        `;
        return row;
    }

    // Initialize with seed data
    initialData.forEach(d => {
        const eventTypeObj = outcomes.find(o => o.status === d.status);
        if (eventTypeObj) d.flash = eventTypeObj.flash;
        tbody.appendChild(createRowHTML(d));
    });

    // Live feed generator
    function addNewEvent() {
        const eventConfig = getRandomItem(outcomes, 'weight');
        const user = getRandomItem(principals);
        const val = eventConfig.status === 'Confirmed' ? '—' : generateValue();

        let mult = '—';
        if (eventConfig.status === 'Settled') {
            mult = getRandomItem(multipliers);
        }

        const data = {
            ts: getTimestamp(),
            type: eventConfig.type,
            hash: generateHash(),
            user: user,
            val: val,
            mult: mult,
            status: eventConfig.status,
            outcome: eventConfig.outcome,
            color: eventConfig.color,
            flash: eventConfig.flash
        };

        const newRow = createRowHTML(data, true);

        if (tbody.firstChild) {
            tbody.insertBefore(newRow, tbody.firstChild);
        } else {
            tbody.appendChild(newRow);
        }

        while (tbody.children.length > MAX_LEDGER_ITEMS) {
            tbody.removeChild(tbody.lastChild);
        }

        const tvlEl = document.getElementById('global-tvl');
        if (tvlEl) {
            let currentTVL = parseInt(tvlEl.innerText.replace(/,/g, '').replace(' USD', ''));
            if (Math.random() > 0.5) currentTVL += Math.floor(Math.random() * 5000);
            else currentTVL -= Math.floor(Math.random() * 2000);
            tvlEl.innerText = currentTVL.toLocaleString() + " USD";
        }
    }

    function scheduleNextEvent() {
        const delay = Math.random() * 4000 + 2000;
        window.ledgerInterval = setTimeout(() => {
            if (document.getElementById('ledger-body')) {
                addNewEvent();
                scheduleNextEvent();
            }
        }, delay);
    }

    scheduleNextEvent();

    if (window.lucide) {
        window.lucide.createIcons();
    }
}
