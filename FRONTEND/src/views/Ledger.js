// PUBLIC LEDGER — Append-only record of executions and settlements
// Table-based institutional layout — clean flat rows

export function renderLedger() {
    return `
        <style>
            /* ============================================================
               PUBLIC LEDGER — TABLE-BASED INSTITUTIONAL LAYOUT
               ============================================================ */

            .ldg {
                background: #fff;
                min-height: calc(100vh - 72px);
                font-family: 'IBM Plex Sans', -apple-system, sans-serif;
                color: #111;
            }

            /* ── Live Header Bar ── */
            .ldg-live-bar {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 32px;
                background: #fafafa;
                border-bottom: 1px solid #e5e5e5;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #666;
            }
            .ldg-live-dot {
                width: 6px; height: 6px;
                background: #752122;
                border-radius: 50%;
                animation: ldg-pulse 2s infinite;
            }
            @keyframes ldg-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }

            /* ── Metrics Strip ── */
            .ldg-metrics {
                display: flex;
                align-items: baseline;
                gap: 40px;
                padding: 28px 32px 24px;
                border-bottom: 1px solid #e5e5e5;
            }
            .ldg-metric {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .ldg-metric-value {
                font-family: 'IBM Plex Sans', sans-serif;
                font-size: 28px;
                font-weight: 700;
                color: #111;
                letter-spacing: -1px;
                line-height: 1;
            }
            .ldg-metric-label {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #888;
            }
            .ldg-metrics-right {
                margin-left: auto;
                display: flex;
                align-items: center;
            }
            .ldg-search {
                padding: 8px 12px;
                font-size: 12px;
                border: 1px solid #e0e0e0;
                outline: none;
                width: 200px;
                font-family: 'IBM Plex Sans', sans-serif;
                color: #333;
                background: #fff;
                transition: border-color 0.12s;
            }
            .ldg-search:focus { border-color: #752122; }
            .ldg-search::placeholder { color: #bbb; }

            /* ── Tabs ── */
            .ldg-tabs-bar {
                display: flex;
                align-items: center;
                border-bottom: 1px solid #e5e5e5;
                padding: 0 32px;
            }
            .ldg-tab {
                padding: 14px 0;
                margin-right: 28px;
                font-size: 12px;
                font-weight: 600;
                color: #888;
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-family: 'IBM Plex Sans', sans-serif;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: color 0.12s;
            }
            .ldg-tab:hover { color: #444; }
            .ldg-tab.active {
                color: #111;
                font-weight: 700;
                border-bottom-color: #111;
            }

            /* ── Filters Row ── */
            .ldg-filters-row {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 12px 32px;
                border-bottom: 1px solid #f0f0f0;
                flex-wrap: wrap;
            }
            .ldg-filter-label {
                font-size: 10px;
                font-weight: 700;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                font-family: 'IBM Plex Sans', sans-serif;
                margin-right: 2px;
            }
            .ldg-filter-divider {
                width: 1px;
                height: 14px;
                background: #e0e0e0;
                margin: 0 10px;
            }
            .ldg-pill {
                padding: 4px 10px;
                font-size: 11px;
                font-weight: 600;
                color: #666;
                background: #fff;
                border: 1px solid #e0e0e0;
                cursor: pointer;
                transition: all 0.12s;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .ldg-pill:hover { border-color: #ccc; color: #333; }
            .ldg-pill.active {
                background: #111;
                color: #fff;
                border-color: #111;
            }
            .ldg-sort-inline {
                font-size: 10px;
                font-weight: 600;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-family: 'IBM Plex Sans', sans-serif;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .ldg-sort-select {
                padding: 3px 6px;
                font-size: 11px;
                border: 1px solid #e0e0e0;
                background: #fff;
                cursor: pointer;
                font-family: 'IBM Plex Sans', sans-serif;
                color: #333;
                outline: none;
                font-weight: 600;
            }
            .ldg-sort-select:focus { border-color: #752122; }

            /* ── Table ── */
            .ldg-table-wrap {
                padding: 0 32px;
            }
            .ldg-table {
                width: 100%;
                border-collapse: collapse;
            }
            .ldg-table thead th {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #999;
                padding: 14px 0 10px;
                border-bottom: 1px solid #e5e5e5;
                text-align: left;
            }
            .ldg-table thead th:last-child {
                text-align: right;
            }
            .ldg-table tbody tr {
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                transition: background 0.1s;
            }
            .ldg-table tbody tr:hover {
                background: #fafafa;
            }
            .ldg-table tbody td {
                padding: 14px 0;
                font-size: 13px;
                vertical-align: middle;
            }

            /* Status cell */
            .ldg-status-text {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            .ldg-status-text.execution { color: #752122; }
            .ldg-status-text.locked { color: #15803d; }
            .ldg-status-text.settlement { color: #15803d; }
            .ldg-status-text.failure { color: #752122; }
            .ldg-status-text.fee { color: #92400e; }

            /* Receipt cell */
            .ldg-rcpt {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 12px;
                font-weight: 700;
                color: #111;
            }

            /* Hash cell */
            .ldg-hash {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 11px;
                color: #999;
                letter-spacing: 0;
            }

            /* Date cell */
            .ldg-date {
                font-family: 'IBM Plex Sans', sans-serif;
                font-size: 12px;
                color: #888;
            }

            /* Amount cell */
            .ldg-amount {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 14px;
                font-weight: 700;
                color: #111;
                text-align: right;
                letter-spacing: -0.3px;
            }

            /* ── Empty State ── */
            .ldg-empty {
                text-align: center;
                padding: 64px 20px;
            }
            .ldg-empty-lbl {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: #999;
                margin-bottom: 8px;
            }
            .ldg-empty-text {
                font-size: 13px;
                color: #888;
            }

            /* ── Footer ── */
            .ldg-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 32px;
                border-top: 1px solid #e5e5e5;
                margin-top: 40px;
            }
            .ldg-footer-status {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #888;
            }
            .ldg-footer-status span {
                color: #15803d;
            }
            .ldg-footer-count {
                font-family: 'IBM Plex Sans', sans-serif;
                font-size: 12px;
                color: #999;
            }

            /* ── Skeleton ── */
            .ldg-skeleton-row {
                height: 48px;
                border-bottom: 1px solid #f0f0f0;
                position: relative;
                overflow: hidden;
            }
            .ldg-skeleton-row::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(90deg, transparent, rgba(0,0,0,0.015), transparent);
                animation: ldg-shimmer 1.5s infinite;
            }
            @keyframes ldg-shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            /* ── Drawer / Detail Panel ── */
            .ldg-drawer-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.3);
                z-index: 200;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
            }
            .ldg-drawer-backdrop.open {
                opacity: 1;
                pointer-events: auto;
            }
            .ldg-drawer {
                position: fixed;
                top: 0; right: 0;
                width: 400px; max-width: 90vw;
                height: 100vh;
                background: #fff;
                border-left: 1px solid #e0e0e0;
                z-index: 201;
                transform: translateX(100%);
                transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }
            .ldg-drawer-backdrop.open .ldg-drawer {
                transform: translateX(0);
            }
            .ldg-drawer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 18px 20px;
                border-bottom: 1px solid #e5e5e5;
            }
            .ldg-drawer-title {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #111;
            }
            .ldg-drawer-close {
                width: 28px; height: 28px;
                display: flex; align-items: center; justify-content: center;
                background: #f5f5f5;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                color: #888;
                font-size: 12px;
                transition: all 0.1s;
            }
            .ldg-drawer-close:hover { background: #fef2f2; color: #752122; border-color: #fecaca; }
            .ldg-drawer-body { padding: 20px; flex: 1; }
            .ldg-drawer-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 11px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .ldg-drawer-row:last-child { border-bottom: none; }
            .ldg-drawer-label {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                flex-shrink: 0;
                padding-top: 1px;
            }
            .ldg-drawer-value {
                font-size: 12px;
                color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
                font-weight: 600;
                text-align: right;
                max-width: 240px;
                word-break: break-all;
            }
            .ldg-drawer-value.mono {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #444;
            }
            .ldg-copy-btn {
                padding: 2px 6px;
                margin-left: 6px;
                font-size: 9px;
                color: #888;
                background: #f5f5f5;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                transition: all 0.1s;
            }
            .ldg-copy-btn:hover { border-color: #ccc; color: #111; }
            .ldg-drawer-section {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #888;
                padding: 16px 0 8px;
                border-bottom: 1px solid #e5e5e5;
                margin-top: 8px;
            }
            .ldg-drawer-link {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                font-weight: 700;
                color: #752122;
                text-decoration: none;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                transition: color 0.1s;
            }
            .ldg-drawer-link:hover { color: #5a1818; }
            .ldg-drawer-json {
                background: #0a0a0a;
                color: #a3a3a3;
                padding: 14px;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                line-height: 1.6;
                overflow-x: auto;
                margin-top: 10px;
                white-space: pre-wrap;
                word-break: break-all;
                max-height: 280px;
                overflow-y: auto;
                display: none;
            }
            .ldg-json-toggle {
                width: 100%;
                padding: 9px;
                font-size: 10px;
                font-weight: 700;
                color: #888;
                background: #fafafa;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.1s;
                margin-top: 10px;
            }
            .ldg-json-toggle:hover { border-color: #ccc; color: #111; }

            /* Status pills for drawer */
            .ldg-status { display: inline-flex; align-items: center; padding: 2px 6px; font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
            .ldg-status.locked    { background: #f5f5f5; color: #666; border: 1px solid #e0e0e0; }
            .ldg-status.settled   { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
            .ldg-status.failed    { background: #fef2f2; color: #752122; border: 1px solid #fecaca; }
            .ldg-status.pending   { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
            .ldg-status.fee       { background: #fefce8; color: #713f12; border: 1px solid #fef08a; }

            /* ── Responsive ── */
            @media (max-width: 768px) {
                .ldg-live-bar { padding: 10px 16px; }
                .ldg-metrics { padding: 20px 16px; gap: 24px; flex-wrap: wrap; }
                .ldg-metric-value { font-size: 22px; }
                .ldg-metrics-right { width: 100%; margin-left: 0; margin-top: 12px; }
                .ldg-search { width: 100%; }
                .ldg-tabs-bar { padding: 0 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
                .ldg-tab { font-size: 11px; margin-right: 20px; white-space: nowrap; }
                .ldg-filters-row { padding: 10px 16px; }
                .ldg-table-wrap { padding: 0 16px; overflow-x: auto; }
                .ldg-footer { padding: 16px 16px; flex-direction: column; gap: 8px; align-items: flex-start; }
                .ldg-drawer { width: 100vw; max-width: 100vw; border-left: none; }
            }
            @media (max-width: 480px) {
                .ldg-metrics { gap: 16px; }
                .ldg-metric-value { font-size: 18px; }
                .ldg-hash { display: none; }
            }
        </style>

        <div class="ldg">
            <!-- Live Header Bar -->
            <div class="ldg-live-bar">
                <div class="ldg-live-dot"></div>
                LIVE LEDGER — UPDATED <span id="ldg-time">just now</span>
            </div>

            <!-- Metrics Strip -->
            <div class="ldg-metrics">
                <div class="ldg-metric">
                    <div class="ldg-metric-value" id="ldg-tvl">—</div>
                    <div class="ldg-metric-label">Capital Locked</div>
                </div>
                <div class="ldg-metric">
                    <div class="ldg-metric-value" id="ldg-active">—</div>
                    <div class="ldg-metric-label">Active Contracts</div>
                </div>
                <div class="ldg-metric">
                    <div class="ldg-metric-value" id="ldg-volume">$0</div>
                    <div class="ldg-metric-label">Volume (24H)</div>
                </div>
                <div class="ldg-metrics-right">
                    <input type="text" class="ldg-search" id="ldg-search" placeholder="Search Ledger ...">
                </div>
            </div>

            <!-- Tabs -->
            <div class="ldg-tabs-bar" id="ldg-tabs">
                <button class="ldg-tab active" data-filter="all">All</button>
                <button class="ldg-tab" data-filter="execution">Executions</button>
                <button class="ldg-tab" data-filter="settlement">Settlements</button>
                <button class="ldg-tab" data-filter="failure">Failures</button>
                <button class="ldg-tab" data-filter="fee">Fees</button>
            </div>

            <!-- Filters -->
            <div class="ldg-filters-row" id="ldg-filters">
                <span class="ldg-filter-label">Parties</span>
                <button class="ldg-pill active" data-provider="all">ALL</button>
                <button class="ldg-pill" data-provider="stripe">Byson</button>
                <button class="ldg-pill" data-provider="shopify">Modept</button>
                <button class="ldg-pill" data-provider="amazon">Amazon</button>
                <div class="ldg-filter-divider"></div>
                <span class="ldg-filter-label">Period</span>
                <button class="ldg-pill active" data-time="all">ALL</button>
                <button class="ldg-pill" data-time="24h">24h</button>
                <button class="ldg-pill" data-time="7d">7D</button>
                <button class="ldg-pill" data-time="30d">30D</button>
                <div class="ldg-filter-divider"></div>
                <span class="ldg-sort-inline">Sort:
                    <select class="ldg-sort-select" id="ldg-sort">
                        <option value="newest">Newest ↓</option>
                        <option value="value">Value</option>
                        <option value="status">Status</option>
                    </select>
                </span>
            </div>

            <!-- Table -->
            <div class="ldg-table-wrap">
                <table class="ldg-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Receipt</th>
                            <th>Hash</th>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody id="ldg-list">
                        <tr class="ldg-skeleton-row"><td colspan="5"></td></tr>
                        <tr class="ldg-skeleton-row"><td colspan="5"></td></tr>
                        <tr class="ldg-skeleton-row"><td colspan="5"></td></tr>
                        <tr class="ldg-skeleton-row"><td colspan="5"></td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer -->
            <div class="ldg-footer">
                <div class="ldg-footer-status">System Status — <span>Operational</span></div>
                <div class="ldg-footer-count" id="ldg-record-count">Showing 0 records</div>
            </div>
        </div>

        <!-- Detail Drawer -->
        <div class="ldg-drawer-backdrop" id="ldg-drawer">
            <div class="ldg-drawer">
                <div class="ldg-drawer-header">
                    <span class="ldg-drawer-title">Event Record</span>
                    <button class="ldg-drawer-close" id="ldg-drawer-close">✕</button>
                </div>
                <div class="ldg-drawer-body" id="ldg-drawer-body"></div>
            </div>
        </div>
    `;
}

export async function initLedger() {
    const list = document.getElementById('ldg-list');
    if (!list) return;

    // ── State ──
    let allEvents = [];
    let activeTab = 'all';
    let activeProvider = 'all';
    let activeTime = 'all';
    let searchQuery = '';
    let sortBy = 'newest';

    // ── Helpers ──
    function formatTimestamp(isoString) {
        if (!isoString) return '—';
        const d = new Date(isoString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
    }

    function formatFullTimestamp(isoString) {
        if (!isoString) return '—';
        const d = new Date(isoString);
        return d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    }

    function formatEventType(type) {
        return (type || '—').replace(/_/g, ' ');
    }

    function getEventCategory(type) {
        if (['FUNDS_LOCKED', 'EXECUTION_CONFIRMED', 'FUNDS_AUTHORIZED', 'CONTRACT_CREATED', 'BASELINE_SNAPSHOTTED'].includes(type)) return 'execution';
        if (['SETTLED_SUCCESS', 'SETTLEMENT_STARTED'].includes(type)) return 'settlement';
        if (['SETTLED_FAILURE', 'VERIFICATION_FAILED'].includes(type)) return 'failure';
        if (['FEE_COLLECTED'].includes(type)) return 'fee';
        return 'execution';
    }

    function getStatusClass(type) {
        if (type.includes('SETTLED_SUCCESS') || type.includes('VERIFICATION_SUCCEEDED')) return 'settlement';
        if (type.includes('SETTLED_FAILURE') || type.includes('VERIFICATION_FAILED')) return 'failure';
        if (type.includes('FEE')) return 'fee';
        if (type.includes('LOCKED')) return 'locked';
        if (type.includes('EXECUTION_CONFIRMED')) return 'execution';
        return 'execution';
    }

    function getTagColor(type) {
        if (type.includes('SETTLED_SUCCESS') || type.includes('VERIFICATION_SUCCEEDED')) return '#15803d';
        if (type.includes('SETTLED_FAILURE') || type.includes('VERIFICATION_FAILED')) return '#752122';
        if (type.includes('FEE')) return '#92400e';
        if (type.includes('LOCKED') || type.includes('EXECUTION_CONFIRMED')) return '#111';
        return '#666';
    }

    function getStatusPill(type) {
        if (type.includes('SETTLED_SUCCESS') || type.includes('VERIFICATION_SUCCEEDED')) return '<span class="ldg-status settled">SETTLED</span>';
        if (type.includes('SETTLED_FAILURE') || type.includes('VERIFICATION_FAILED')) return '<span class="ldg-status failed">FAILED</span>';
        if (type.includes('LOCKED') || type.includes('EXECUTION_CONFIRMED')) return '<span class="ldg-status locked">LOCKED</span>';
        if (type.includes('FEE')) return '<span class="ldg-status fee">FEE</span>';
        if (type.includes('AUTHORIZED') || type.includes('CREATED')) return '<span class="ldg-status pending">PENDING</span>';
        return '<span class="ldg-status locked">ACTIVE</span>';
    }

    function formatCurrency(cents) {
        if (!cents && cents !== 0) return '—';
        return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function truncateHash(hash) {
        if (!hash) return '—';
        if (hash.length > 20) return hash.slice(0, 12) + '…' + hash.slice(-6);
        return hash;
    }

    function getProviderFromEvent(event) {
        const meta = event.metadataJson || event.metadata || {};
        if (meta.platform) return meta.platform.toLowerCase();
        if (meta.provider) return meta.provider.toLowerCase();
        return '';
    }

    function updateTime() {
        const el = document.getElementById('ldg-time');
        if (el) {
            const now = new Date();
            el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
    }

    // ── Filter / Sort ──
    function filterEvents() {
        let filtered = [...allEvents];

        if (activeTab !== 'all') {
            filtered = filtered.filter(e => getEventCategory(e.eventType) === activeTab);
        }
        if (activeProvider !== 'all') {
            filtered = filtered.filter(e => getProviderFromEvent(e) === activeProvider);
        }
        if (activeTime !== 'all') {
            const now = Date.now();
            const cutoffs = { '24h': 86400000, '7d': 604800000, '30d': 2592000000 };
            const cutoff = cutoffs[activeTime];
            if (cutoff) filtered = filtered.filter(e => (now - new Date(e.timestamp).getTime()) <= cutoff);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                (e.contractId && e.contractId.toLowerCase().includes(q)) ||
                (e.eventHash && e.eventHash.toLowerCase().includes(q)) ||
                (e.eventType && e.eventType.toLowerCase().includes(q))
            );
        }
        if (sortBy === 'value') {
            filtered.sort((a, b) => (b.amountUsdCents || 0) - (a.amountUsdCents || 0));
        } else if (sortBy === 'status') {
            filtered.sort((a, b) => a.eventType.localeCompare(b.eventType));
        } else {
            filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }

        return filtered;
    }

    // ── Render Events — Table Rows ──
    function renderEvents() {
        const filtered = filterEvents();

        // Update record count
        const countEl = document.getElementById('ldg-record-count');
        if (countEl) countEl.textContent = `Showing ${filtered.length} records`;

        if (filtered.length === 0) {
            list.innerHTML = `
                <tr>
                    <td colspan="5">
                        <div class="ldg-empty">
                            <div class="ldg-empty-lbl">No Records</div>
                            <div class="ldg-empty-text">No events match your current filter set.</div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        list.innerHTML = filtered.map((event, i) => {
            const contractShort = event.contractId
                ? 'RCPT-' + event.contractId.slice(0, 4).toUpperCase()
                : '—';
            const statusClass = getStatusClass(event.eventType);

            return `
                <tr data-index="${i}">
                    <td><span class="ldg-status-text ${statusClass}">${formatEventType(event.eventType)}</span></td>
                    <td><span class="ldg-rcpt">${contractShort}</span></td>
                    <td><span class="ldg-hash">${truncateHash(event.eventHash)}</span></td>
                    <td><span class="ldg-date">${formatTimestamp(event.timestamp)}</span></td>
                    <td><span class="ldg-amount">${formatCurrency(event.amountUsdCents)}</span></td>
                </tr>
            `;
        }).join('');

        // Click → drawer
        list.querySelectorAll('tr[data-index]').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.index);
                const current = filterEvents();
                if (current[idx]) openDrawer(current[idx]);
            });
        });
    }

    // ── Drawer ──
    function openDrawer(event) {
        const drawer = document.getElementById('ldg-drawer');
        const body = document.getElementById('ldg-drawer-body');
        if (!drawer || !body) return;

        const contractShort = event.contractId
            ? 'RCPT-' + event.contractId.slice(0, 4).toUpperCase()
            : '—';

        body.innerHTML = `
            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Event Type</span>
                <span class="ldg-drawer-value" style="color: ${getTagColor(event.eventType)}; font-weight: 700; font-family: 'IBM Plex Mono', monospace; font-size:11px;">
                    ${formatEventType(event.eventType)}
                </span>
            </div>
            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Timestamp</span>
                <span class="ldg-drawer-value mono">${formatFullTimestamp(event.timestamp)}</span>
            </div>
            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Contract</span>
                <span class="ldg-drawer-value">
                    ${contractShort}
                    ${event.contractId ? `<a class="ldg-drawer-link" style="margin-left:8px;" onclick="window.router.navigate('/contracts/${event.contractId}')">VIEW →</a>` : ''}
                </span>
            </div>
            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Amount</span>
                <span class="ldg-drawer-value" style="font-family:'IBM Plex Mono',monospace; font-size:18px; font-weight:700; letter-spacing:-0.5px;">
                    ${formatCurrency(event.amountUsdCents)}
                </span>
            </div>
            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Status</span>
                <span class="ldg-drawer-value">${getStatusPill(event.eventType)}</span>
            </div>
            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Tx Hash</span>
                <span class="ldg-drawer-value mono">
                    ${event.eventHash || '—'}
                    ${event.eventHash ? `<button class="ldg-copy-btn" data-copy="${event.eventHash}">COPY</button>` : ''}
                </span>
            </div>

            <div class="ldg-drawer-section">Raw Event Payload</div>
            <button class="ldg-json-toggle" id="ldg-json-toggle">SHOW RAW JSON</button>
            <div class="ldg-drawer-json" id="ldg-json-body">${JSON.stringify(event, null, 2)}</div>
        `;

        // Copy buttons
        body.querySelectorAll('.ldg-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(btn.dataset.copy);
                const orig = btn.textContent;
                btn.textContent = 'COPIED';
                setTimeout(() => btn.textContent = orig, 1500);
            });
        });

        // JSON toggle
        const toggle = document.getElementById('ldg-json-toggle');
        const jsonBody = document.getElementById('ldg-json-body');
        if (toggle && jsonBody) {
            toggle.addEventListener('click', () => {
                const hidden = jsonBody.style.display === 'none' || !jsonBody.style.display;
                jsonBody.style.display = hidden ? 'block' : 'none';
                toggle.textContent = hidden ? 'HIDE RAW JSON' : 'SHOW RAW JSON';
            });
        }

        drawer.classList.add('open');
    }

    function closeDrawer() {
        document.getElementById('ldg-drawer')?.classList.remove('open');
    }

    // ── Stats ──
    function updateStats() {
        const tvlEl = document.getElementById('ldg-tvl');
        const activeEl = document.getElementById('ldg-active');
        const volumeEl = document.getElementById('ldg-volume');

        const totalCents = allEvents
            .filter(e => e.amountUsdCents)
            .reduce((sum, e) => sum + (e.amountUsdCents || 0), 0);
        if (tvlEl) tvlEl.textContent = formatCurrency(totalCents);

        const activeCount = allEvents.filter(e =>
            ['FUNDS_LOCKED', 'EXECUTION_CONFIRMED'].includes(e.eventType)
        ).length;
        if (activeEl) activeEl.textContent = activeCount.toString();

        // 24h volume
        const now = Date.now();
        const vol24h = allEvents
            .filter(e => e.amountUsdCents && (now - new Date(e.timestamp).getTime()) <= 86400000)
            .reduce((sum, e) => sum + (e.amountUsdCents || 0), 0);
        if (volumeEl) volumeEl.textContent = formatCurrency(vol24h);
    }

    // ── Event Wiring ──
    document.getElementById('ldg-tabs')?.addEventListener('click', (e) => {
        const tab = e.target.closest('.ldg-tab');
        if (!tab) return;
        document.querySelectorAll('.ldg-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab.dataset.filter;
        renderEvents();
    });

    document.getElementById('ldg-filters')?.addEventListener('click', (e) => {
        const pill = e.target.closest('.ldg-pill');
        if (!pill) return;
        if (pill.dataset.provider) {
            document.querySelectorAll('.ldg-pill[data-provider]').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeProvider = pill.dataset.provider;
        }
        if (pill.dataset.time) {
            document.querySelectorAll('.ldg-pill[data-time]').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeTime = pill.dataset.time;
        }
        renderEvents();
    });

    const searchInput = document.getElementById('ldg-search');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuery = searchInput.value.trim();
                renderEvents();
            }, 200);
        });
    }

    const sortSelect = document.getElementById('ldg-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortBy = sortSelect.value;
            renderEvents();
        });
    }

    document.getElementById('ldg-drawer-close')?.addEventListener('click', closeDrawer);
    document.getElementById('ldg-drawer')?.addEventListener('click', (e) => {
        if (e.target.id === 'ldg-drawer') closeDrawer();
    });

    // ── Fetch ──
    updateTime();

    try {
        const response = await window.api.getPublicLedger();
        allEvents = response?.events || [];
        console.log('[Ledger] Loaded', allEvents.length, 'events');
        updateStats();
        renderEvents();
        updateTime();
    } catch (error) {
        console.error('[Ledger] Error loading events:', error);
        list.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="ldg-empty">
                        <div class="ldg-empty-lbl">LEDGER UNAVAILABLE</div>
                        <div class="ldg-empty-text">System synchronizing. Records will appear shortly.</div>
                    </div>
                </td>
            </tr>
        `;
    }

    if (window.lucide) window.lucide.createIcons();
}
