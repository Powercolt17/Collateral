// Ledger View — Public Record of Executions & Settlements
// Styled to match Market/Overview design system exactly

export function renderLedger() {
    return `
        <style>
            /* ===== LEDGER — MARKET-MATCHED DESIGN SYSTEM ===== */

            .ldg {
                background: #fafafa;
                min-height: 100vh;
                font-family: 'IBM Plex Sans', -apple-system, sans-serif;
                color: #111;
            }

            /* Live Header */
            .ldg-live-header {
                padding: 12px 32px;
                background: #f8f8f8;
                border-bottom: 1px solid #e5e5e5;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #666;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ldg-live-dot {
                width: 6px; height: 6px; background: #752122; border-radius: 50%;
                animation: ldg-pulse 2s infinite;
            }
            @keyframes ldg-pulse {
                0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; }
            }

            /* Top Bar — matches eq-topbar */
            .ldg-topbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 32px;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
            }
            .ldg-stats { display: flex; gap: 32px; }
            .ldg-stat-value {
                font-size: 18px; font-weight: 600; color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
                letter-spacing: -0.5px;
                transition: opacity 0.2s;
            }
            .ldg-stat-label {
                font-size: 11px; color: #555; font-weight: 600;
                text-transform: uppercase; letter-spacing: 0.5px;
                margin-top: 2px;
                font-family: 'IBM Plex Mono', monospace;
            }
            .ldg-controls { display: flex; gap: 8px; align-items: center; }

            /* Search — matches eq-search */
            .ldg-search {
                padding: 8px 12px; font-size: 13px;
                border: 1px solid #e0e0e0; border-radius: 6px;
                outline: none; width: 220px;
                font-family: 'IBM Plex Sans', sans-serif;
                color: #333; transition: border-color 0.15s;
            }
            .ldg-search:focus { border-color: #752122; }
            .ldg-search::placeholder { color: #aaa; }

            /* Sort — matches eq-sort */
            .ldg-sort {
                padding: 8px 12px; font-size: 13px;
                border: 1px solid #e0e0e0; border-radius: 6px;
                background: #fff; cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                color: #555; outline: none;
            }
            .ldg-sort:focus { border-color: #752122; }

            /* Tabs — matches eq-tabs exactly */
            .ldg-tabs {
                display: flex; gap: 0;
                padding: 0 32px;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
            }
            .ldg-tab {
                padding: 16px 20px; font-size: 13px; font-weight: 500;
                color: #666; background: transparent; border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer; font-family: 'IBM Plex Sans', sans-serif;
                text-transform: uppercase; letter-spacing: 0.2px;
                transition: all 0.2s; position: relative;
            }
            .ldg-tab:hover { color: #111; }
            .ldg-tab.active { color: #111; font-weight: 600; border-bottom-color: #752122; }
            .ldg-tab-count {
                font-size: 10px; background: #f3f4f6; color: #4b5563;
                padding: 2px 6px; border-radius: 999px;
                margin-left: 6px; font-weight: 600;
                font-family: 'IBM Plex Mono', monospace;
            }
            .ldg-tab.active .ldg-tab-count { background: #fee2e2; color: #752122; }

            /* Filters — matches eq-filters exactly */
            .ldg-filters {
                display: flex; gap: 6px;
                padding: 14px 32px;
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
                flex-wrap: wrap;
                align-items: center;
            }
            .ldg-filter-label {
                font-size: 12px; color: #555; text-transform: uppercase;
                font-family: 'IBM Plex Mono', monospace;
                margin-right: 4px; font-weight: 500;
            }
            .ldg-filter-divider {
                width: 1px; height: 20px; background: #e5e5e5; margin: 0 8px;
            }
            .ldg-pill {
                padding: 6px 14px; font-size: 12px;
                color: #4b5563; background: #fff; font-weight: 500;
                border: 1px solid #e5e5e5; border-radius: 999px;
                cursor: pointer; transition: all 0.15s;
                font-family: 'IBM Plex Sans', sans-serif;
                box-shadow: 0 1px 2px rgba(0,0,0,0.03);
            }
            .ldg-pill:hover { border-color: #ccc; color: #111; }
            .ldg-pill.active {
                background: #fff; color: #111;
                border-color: #111;
                box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                font-weight: 600;
            }

            /* Event List Container */
            .ldg-list {
                padding: 24px 32px 80px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            /* Event Card Row — inspired by eq-card but full-width */
            .ldg-event {
                background: #fff;
                border: 1px solid #e5e5e5;
                border-radius: 6px;
                padding: 16px 20px;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
                display: grid;
                grid-template-columns: 200px 1fr 140px 120px 100px;
                align-items: center;
                gap: 16px;
                position: relative;
                overflow: hidden;
            }
            /* Ledger notch — same as eq-card */
            .ldg-event::after {
                content: '';
                position: absolute;
                top: 12px; bottom: 12px; left: 0;
                width: 3px;
                background: #f0f0f0;
                border-radius: 0 2px 2px 0;
                transition: background 0.2s;
            }
            .ldg-event:hover::after { background: #752122; }
            .ldg-event:hover {
                border-color: #bbb;
                box-shadow: 0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06);
                transform: translateY(-1px);
            }
            .ldg-event:active {
                transform: translateY(0);
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }

            .ldg-event-type {
                font-size: 13px; font-weight: 600;
                font-family: 'IBM Plex Sans', sans-serif;
                letter-spacing: -0.2px;
            }
            .ldg-event-time {
                font-size: 11px; color: #888;
                font-family: 'IBM Plex Mono', monospace;
                margin-top: 3px;
            }
            .ldg-event-contract {
                display: flex; align-items: center; gap: 8px;
                font-size: 13px; color: #333;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .ldg-event-hash {
                font-size: 11px; color: #999;
                font-family: 'IBM Plex Mono', monospace;
            }
            .ldg-event-value {
                font-size: 15px; font-weight: 600; color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
                letter-spacing: -0.3px;
                text-align: right;
            }
            .ldg-event-value-label {
                font-size: 10px; color: #888;
                font-family: 'IBM Plex Mono', monospace;
                text-align: right;
                margin-top: 2px;
            }

            /* Provider badge — matches eq-card-integration */
            .ldg-provider {
                display: inline-flex; align-items: center;
                gap: 5px; font-size: 12px; color: #4b5563;
                font-weight: 500;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .ldg-provider-dot {
                width: 6px; height: 6px; border-radius: 50%;
            }
            .ldg-provider-dot.stripe { background: #635bff; }
            .ldg-provider-dot.shopify { background: #96bf48; }
            .ldg-provider-dot.amazon { background: #ff9900; }
            .ldg-provider-dot.x { background: #0a0a0a; }

            /* Status pill — matches contract pills */
            .ldg-status {
                display: inline-flex;
                padding: 4px 10px;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-radius: 999px;
                font-family: 'IBM Plex Mono', monospace;
                white-space: nowrap;
            }
            .ldg-status.locked { background: #f3f4f6; color: #374151; }
            .ldg-status.settled { background: #ecfdf5; color: #065f46; }
            .ldg-status.failed { background: #fef2f2; color: #752122; }
            .ldg-status.pending { background: #fffbeb; color: #92400e; }
            .ldg-status.fee { background: #fefce8; color: #854d0e; }

            /* Empty state — matches eq-empty */
            .ldg-empty {
                text-align: center;
                padding: 80px 20px;
                color: #999;
            }
            .ldg-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.4; }
            .ldg-empty-text { font-size: 14px; margin-bottom: 4px; color: #666; }
            .ldg-empty-sub { font-size: 12px; color: #bbb; }

            /* Loading skeleton */
            .ldg-skeleton {
                background: #fff;
                border: 1px solid #e5e5e5;
                border-radius: 6px;
                padding: 20px;
                height: 56px;
                position: relative;
                overflow: hidden;
            }
            .ldg-skeleton::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(90deg, transparent, rgba(0,0,0,0.03), transparent);
                animation: ldg-shimmer 1.5s infinite;
            }
            @keyframes ldg-shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            /* Detail Drawer */
            .ldg-drawer-backdrop {
                position: fixed; inset: 0;
                background: rgba(0,0,0,0.4);
                z-index: 200;
                opacity: 0; pointer-events: none;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(2px);
            }
            .ldg-drawer-backdrop.open { opacity: 1; pointer-events: auto; }

            .ldg-drawer {
                position: fixed;
                top: 0; right: 0;
                width: 440px; max-width: 90vw;
                height: 100vh;
                background: #fff;
                z-index: 201;
                box-shadow: -20px 0 60px rgba(0,0,0,0.15);
                transform: translateX(100%);
                transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }
            .ldg-drawer-backdrop.open .ldg-drawer { transform: translateX(0); }

            .ldg-drawer-header {
                display: flex; justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid #e5e5e5;
                position: relative;
            }
            .ldg-drawer-header::before {
                content: '';
                position: absolute;
                top: 0; left: 24px;
                width: 24px; height: 3px;
                background: #752122;
            }
            .ldg-drawer-title {
                font-size: 14px; font-weight: 600;
                font-family: 'IBM Plex Sans', sans-serif;
                letter-spacing: -0.3px;
                text-transform: uppercase;
            }
            .ldg-drawer-close {
                width: 32px; height: 32px;
                display: flex; align-items: center; justify-content: center;
                background: #f5f5f5; border: none; border-radius: 6px;
                cursor: pointer; color: #666; transition: all 0.15s;
                font-size: 14px;
            }
            .ldg-drawer-close:hover { background: #fee2e2; color: #752122; }

            .ldg-drawer-body { padding: 24px; flex: 1; }

            .ldg-drawer-row {
                display: flex; justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #f0f0f0;
                align-items: flex-start;
            }
            .ldg-drawer-row:last-child { border-bottom: none; }
            .ldg-drawer-label {
                font-size: 11px; color: #888;
                text-transform: uppercase; letter-spacing: 0.5px;
                font-family: 'IBM Plex Mono', monospace;
                font-weight: 500;
            }
            .ldg-drawer-value {
                font-size: 13px; color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
                font-weight: 500;
                text-align: right;
                max-width: 240px;
                word-break: break-all;
            }
            .ldg-drawer-value.mono {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 11px; color: #555;
            }

            .ldg-copy-btn {
                padding: 2px 8px; margin-left: 6px;
                font-size: 10px; color: #888;
                background: #f5f5f5; border: 1px solid #e5e5e5;
                border-radius: 4px; cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                transition: all 0.15s;
            }
            .ldg-copy-btn:hover { border-color: #ccc; color: #111; }

            .ldg-drawer-section {
                font-size: 11px; color: #888;
                text-transform: uppercase; letter-spacing: 0.5px;
                font-family: 'IBM Plex Mono', monospace;
                font-weight: 600;
                padding: 16px 0 8px;
                border-bottom: 1px solid #e5e5e5;
                margin-top: 8px;
            }

            .ldg-drawer-json {
                background: #0a0a0a;
                color: #a3a3a3;
                padding: 16px;
                border-radius: 6px;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 11px;
                line-height: 1.6;
                overflow-x: auto;
                margin-top: 12px;
                white-space: pre-wrap;
                word-break: break-all;
                max-height: 300px;
                overflow-y: auto;
            }

            .ldg-drawer-link {
                display: inline-flex; align-items: center; gap: 4px;
                font-size: 12px; font-weight: 600; color: #752122;
                text-decoration: none; cursor: pointer;
                font-family: 'IBM Plex Sans', sans-serif;
                transition: color 0.15s;
            }
            .ldg-drawer-link:hover { color: #5a191a; }

            .ldg-json-toggle {
                padding: 8px 14px;
                font-size: 11px; font-weight: 600;
                color: #555; background: #f5f5f5;
                border: 1px solid #e5e5e5; border-radius: 6px;
                cursor: pointer; font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase; letter-spacing: 0.3px;
                transition: all 0.15s;
                margin-top: 12px;
                width: 100%;
            }
            .ldg-json-toggle:hover { border-color: #ccc; color: #111; }

            /* Footer */
            .ldg-footer {
                padding: 20px 32px;
                border-top: 1px solid #e5e5e5;
                background: #fff;
            }
            .ldg-footer-text {
                font-size: 11px; color: #999;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                text-align: center;
            }

            /* Responsive */
            @media (max-width: 860px) {
                .ldg-topbar { padding: 16px; flex-direction: column; gap: 12px; align-items: flex-start; }
                .ldg-tabs { padding: 0 16px; overflow-x: auto; }
                .ldg-filters { padding: 10px 16px; }
                .ldg-list { padding: 16px; }
                .ldg-stats { gap: 20px; }
                .ldg-search { width: 160px; }
                .ldg-event {
                    grid-template-columns: 1fr;
                    gap: 8px;
                }
                .ldg-event-value { text-align: left; }
                .ldg-event-value-label { text-align: left; }
                .ldg-drawer { width: 100vw; max-width: 100vw; }
            }

            /* Animate rows in */
            @keyframes ldg-slide-in {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .ldg-event { animation: ldg-slide-in 0.3s ease-out both; }
        </style>

        <div class="ldg">
            <!-- Live Header -->
            <div class="ldg-live-header">
                <div class="ldg-live-dot"></div>
                PUBLIC LEDGER — Read-only record of executions and settlements
            </div>

            <!-- Top Bar — Stats Strip -->
            <div class="ldg-topbar">
                <div class="ldg-stats">
                    <div>
                        <div class="ldg-stat-value" id="ldg-tvl">—</div>
                        <div class="ldg-stat-label">Total Value Locked</div>
                    </div>
                    <div>
                        <div class="ldg-stat-value" id="ldg-events-24h">—</div>
                        <div class="ldg-stat-label">Events (24h)</div>
                    </div>
                    <div>
                        <div class="ldg-stat-value" id="ldg-active">—</div>
                        <div class="ldg-stat-label">Active Contracts</div>
                    </div>
                    <div>
                        <div class="ldg-stat-value" style="color: #065f46;">●</div>
                        <div class="ldg-stat-label">System Status</div>
                    </div>
                </div>
                <div class="ldg-controls">
                    <input type="text" class="ldg-search" id="ldg-search" placeholder="Search RCPT or hash...">
                    <select class="ldg-sort" id="ldg-sort">
                        <option value="newest">Newest</option>
                        <option value="value">Value</option>
                        <option value="status">Status</option>
                    </select>
                </div>
            </div>

            <!-- Tabs -->
            <div class="ldg-tabs" id="ldg-tabs">
                <button class="ldg-tab active" data-filter="all">ALL EVENTS <span class="ldg-tab-count" id="ldg-count-all">0</span></button>
                <button class="ldg-tab" data-filter="execution">EXECUTIONS <span class="ldg-tab-count" id="ldg-count-exec">0</span></button>
                <button class="ldg-tab" data-filter="settlement">SETTLEMENTS <span class="ldg-tab-count" id="ldg-count-settle">0</span></button>
                <button class="ldg-tab" data-filter="failure">FAILURES <span class="ldg-tab-count" id="ldg-count-fail">0</span></button>
                <button class="ldg-tab" data-filter="fee">FEES <span class="ldg-tab-count" id="ldg-count-fee">0</span></button>
            </div>

            <!-- Filter Pills -->
            <div class="ldg-filters" id="ldg-filters">
                <span class="ldg-filter-label">PROVIDER</span>
                <button class="ldg-pill active" data-provider="all">All</button>
                <button class="ldg-pill" data-provider="stripe">Stripe</button>
                <button class="ldg-pill" data-provider="shopify">Shopify</button>
                <button class="ldg-pill" data-provider="amazon">Amazon</button>
                <button class="ldg-pill" data-provider="x">X</button>

                <div class="ldg-filter-divider"></div>

                <span class="ldg-filter-label">TIME</span>
                <button class="ldg-pill active" data-time="all">All</button>
                <button class="ldg-pill" data-time="24h">24h</button>
                <button class="ldg-pill" data-time="7d">7d</button>
                <button class="ldg-pill" data-time="30d">30d</button>
            </div>

            <!-- Event List -->
            <div class="ldg-list" id="ldg-list">
                <!-- Loading skeletons -->
                <div class="ldg-skeleton"></div>
                <div class="ldg-skeleton"></div>
                <div class="ldg-skeleton"></div>
                <div class="ldg-skeleton"></div>
            </div>

            <!-- Footer -->
            <div class="ldg-footer">
                <div class="ldg-footer-text">
                    Records are immutable. Outcomes cannot be appealed. All settlements are final.
                </div>
            </div>
        </div>

        <!-- Detail Drawer -->
        <div class="ldg-drawer-backdrop" id="ldg-drawer">
            <div class="ldg-drawer">
                <div class="ldg-drawer-header">
                    <span class="ldg-drawer-title">Event Detail</span>
                    <button class="ldg-drawer-close" id="ldg-drawer-close">✕</button>
                </div>
                <div class="ldg-drawer-body" id="ldg-drawer-body">
                    <!-- Populated dynamically -->
                </div>
            </div>
        </div>
    `;
}

export async function initLedger() {
    const list = document.getElementById('ldg-list');
    if (!list) return;

    // State
    let allEvents = [];
    let activeTab = 'all';
    let activeProvider = 'all';
    let activeTime = 'all';
    let searchQuery = '';
    let sortBy = 'newest';

    // ========== HELPERS ==========

    function formatTimestamp(isoString) {
        if (!isoString) return '—';
        const d = new Date(isoString);
        const now = new Date();
        const diffMs = now - d;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        if (diffDay < 7) return `${diffDay}d ago`;
        return d.toISOString().split('T')[0];
    }

    function formatFullTimestamp(isoString) {
        if (!isoString) return '—';
        const d = new Date(isoString);
        return d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    }

    function formatEventType(type) {
        const map = {
            'CONTRACT_CREATED': 'Contract Created',
            'FUNDS_AUTHORIZED': 'Payment Authorized',
            'FUNDS_LOCKED': 'Contract Executed',
            'EXECUTION_CONFIRMED': 'Execution Confirmed',
            'VERIFICATION_STARTED': 'Verification Started',
            'VERIFICATION_SUCCEEDED': 'Verification Passed',
            'VERIFICATION_FAILED': 'Verification Failed',
            'SETTLED_SUCCESS': 'Settled — Success',
            'SETTLED_FAILURE': 'Settled — Forfeited',
            'SETTLEMENT_STARTED': 'Settlement Started',
            'FEE_COLLECTED': 'Fee Collected',
            'BASELINE_SNAPSHOTTED': 'Baseline Recorded',
        };
        return map[type] || type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }

    function getEventCategory(type) {
        if (['FUNDS_LOCKED', 'EXECUTION_CONFIRMED', 'FUNDS_AUTHORIZED', 'CONTRACT_CREATED', 'BASELINE_SNAPSHOTTED'].includes(type)) return 'execution';
        if (['SETTLED_SUCCESS', 'SETTLEMENT_STARTED'].includes(type)) return 'settlement';
        if (['SETTLED_FAILURE', 'VERIFICATION_FAILED'].includes(type)) return 'failure';
        if (['FEE_COLLECTED'].includes(type)) return 'fee';
        return 'execution';
    }

    function getEventColor(type) {
        if (type.includes('SETTLED_SUCCESS') || type.includes('VERIFICATION_SUCCEEDED')) return '#065f46';
        if (type.includes('SETTLED_FAILURE') || type.includes('VERIFICATION_FAILED')) return '#752122';
        if (type.includes('FEE')) return '#854d0e';
        if (type.includes('LOCKED') || type.includes('EXECUTION_CONFIRMED')) return '#111';
        return '#4b5563';
    }

    function getStatusPill(type) {
        if (type.includes('SETTLED_SUCCESS') || type.includes('VERIFICATION_SUCCEEDED')) return '<span class="ldg-status settled">Settled</span>';
        if (type.includes('SETTLED_FAILURE') || type.includes('VERIFICATION_FAILED')) return '<span class="ldg-status failed">Failed</span>';
        if (type.includes('LOCKED') || type.includes('EXECUTION_CONFIRMED')) return '<span class="ldg-status locked">Locked</span>';
        if (type.includes('FEE')) return '<span class="ldg-status fee">Fee</span>';
        if (type.includes('AUTHORIZED') || type.includes('CREATED')) return '<span class="ldg-status pending">Pending</span>';
        return '<span class="ldg-status locked">Active</span>';
    }

    function formatCurrency(cents) {
        if (!cents && cents !== 0) return '—';
        return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function truncateHash(hash) {
        if (!hash) return '—';
        if (hash.length > 16) return hash.slice(0, 8) + '…' + hash.slice(-6);
        return hash;
    }

    function getProviderFromEvent(event) {
        // Infer provider from metadata or contract info
        const meta = event.metadataJson || event.metadata || {};
        if (meta.platform) return meta.platform.toLowerCase();
        if (meta.provider) return meta.provider.toLowerCase();
        return '';
    }

    function getProviderBadge(provider) {
        if (!provider) return '';
        const name = provider.charAt(0).toUpperCase() + provider.slice(1);
        return `<span class="ldg-provider"><span class="ldg-provider-dot ${provider}"></span> ${name}</span>`;
    }

    // ========== FILTERING ==========

    function filterEvents() {
        let filtered = [...allEvents];

        // Tab filter
        if (activeTab !== 'all') {
            filtered = filtered.filter(e => getEventCategory(e.eventType) === activeTab);
        }

        // Provider filter
        if (activeProvider !== 'all') {
            filtered = filtered.filter(e => getProviderFromEvent(e) === activeProvider);
        }

        // Time filter
        if (activeTime !== 'all') {
            const now = Date.now();
            const cutoffs = { '24h': 86400000, '7d': 604800000, '30d': 2592000000 };
            const cutoff = cutoffs[activeTime];
            if (cutoff) {
                filtered = filtered.filter(e => (now - new Date(e.timestamp).getTime()) <= cutoff);
            }
        }

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                (e.contractId && e.contractId.toLowerCase().includes(q)) ||
                (e.eventHash && e.eventHash.toLowerCase().includes(q)) ||
                (e.eventType && e.eventType.toLowerCase().includes(q)) ||
                (formatEventType(e.eventType).toLowerCase().includes(q))
            );
        }

        // Sort
        if (sortBy === 'value') {
            filtered.sort((a, b) => (b.amountUsdCents || 0) - (a.amountUsdCents || 0));
        } else if (sortBy === 'status') {
            filtered.sort((a, b) => a.eventType.localeCompare(b.eventType));
        } else {
            filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }

        return filtered;
    }

    // ========== RENDER ==========

    function renderEvents() {
        const filtered = filterEvents();

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="ldg-empty">
                    <div class="ldg-empty-icon">📋</div>
                    <div class="ldg-empty-text">No events match your filters</div>
                    <div class="ldg-empty-sub">Try adjusting your filters or search query</div>
                </div>
            `;
            return;
        }

        list.innerHTML = filtered.map((event, i) => {
            const contractShort = event.contractId
                ? 'RCPT-' + event.contractId.slice(0, 4).toUpperCase()
                : '—';
            const provider = getProviderFromEvent(event);

            return `
                <div class="ldg-event" data-index="${i}" data-event-id="${event.eventHash || event.id || i}"
                     style="animation-delay: ${Math.min(i * 30, 300)}ms">
                    <!-- Col 1: Event Type + Time -->
                    <div>
                        <div class="ldg-event-type" style="color: ${getEventColor(event.eventType)}">
                            ${formatEventType(event.eventType)}
                        </div>
                        <div class="ldg-event-time">${formatTimestamp(event.timestamp)}</div>
                    </div>

                    <!-- Col 2: Contract + Provider -->
                    <div class="ldg-event-contract">
                        <span style="font-weight: 600; font-family: 'IBM Plex Mono', monospace; font-size: 12px;">${contractShort}</span>
                        ${getProviderBadge(provider)}
                        <span class="ldg-event-hash">${truncateHash(event.eventHash)}</span>
                    </div>

                    <!-- Col 3: Value -->
                    <div>
                        <div class="ldg-event-value">${formatCurrency(event.amountUsdCents)}</div>
                        <div class="ldg-event-value-label">USD</div>
                    </div>

                    <!-- Col 4: Status -->
                    <div style="text-align: right;">
                        ${getStatusPill(event.eventType)}
                    </div>

                    <!-- Col 5: Arrow -->
                    <div style="text-align: right; color: #ccc; font-size: 16px;">→</div>
                </div>
            `;
        }).join('');

        // Click handlers
        list.querySelectorAll('.ldg-event').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.index);
                const filtered = filterEvents();
                if (filtered[idx]) openDrawer(filtered[idx]);
            });
        });
    }

    // ========== DRAWER ==========

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
                <span class="ldg-drawer-value" style="color: ${getEventColor(event.eventType)}; font-weight: 600;">
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
                    ${event.contractId ? `<a class="ldg-drawer-link" style="margin-left: 8px;" onclick="window.location.hash='/contract/${event.contractId}'">View Term Sheet →</a>` : ''}
                </span>
            </div>

            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Tx Hash</span>
                <span class="ldg-drawer-value mono">
                    ${event.eventHash || '—'}
                    ${event.eventHash ? `<button class="ldg-copy-btn" data-copy="${event.eventHash}">Copy</button>` : ''}
                </span>
            </div>

            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Principal</span>
                <span class="ldg-drawer-value mono">
                    ${event.contractId ? truncateHash(event.contractId) : '—'}
                    ${event.contractId ? `<button class="ldg-copy-btn" data-copy="${event.contractId}">Copy</button>` : ''}
                </span>
            </div>

            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Value</span>
                <span class="ldg-drawer-value" style="font-size: 16px; font-weight: 700;">
                    ${formatCurrency(event.amountUsdCents)}
                </span>
            </div>

            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Status</span>
                <span class="ldg-drawer-value">${getStatusPill(event.eventType)}</span>
            </div>

            <div class="ldg-drawer-section">Raw Event</div>
            <button class="ldg-json-toggle" id="ldg-json-toggle">Show Raw JSON</button>
            <div class="ldg-drawer-json" id="ldg-json-body" style="display: none;">
${JSON.stringify(event, null, 2)}
            </div>
        `;

        // Bind copy buttons
        body.querySelectorAll('.ldg-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(btn.dataset.copy);
                const original = btn.textContent;
                btn.textContent = 'Copied';
                setTimeout(() => btn.textContent = original, 1500);
            });
        });

        // JSON toggle
        const jsonToggle = document.getElementById('ldg-json-toggle');
        const jsonBody = document.getElementById('ldg-json-body');
        if (jsonToggle && jsonBody) {
            jsonToggle.addEventListener('click', () => {
                const isHidden = jsonBody.style.display === 'none';
                jsonBody.style.display = isHidden ? 'block' : 'none';
                jsonToggle.textContent = isHidden ? 'Hide Raw JSON' : 'Show Raw JSON';
            });
        }

        drawer.classList.add('open');
    }

    function closeDrawer() {
        document.getElementById('ldg-drawer')?.classList.remove('open');
    }

    // ========== STATS ==========

    function updateStats() {
        const tvlEl = document.getElementById('ldg-tvl');
        const events24hEl = document.getElementById('ldg-events-24h');
        const activeEl = document.getElementById('ldg-active');

        const totalCents = allEvents
            .filter(e => e.amountUsdCents)
            .reduce((sum, e) => sum + (e.amountUsdCents || 0), 0);

        if (tvlEl) tvlEl.textContent = formatCurrency(totalCents);

        const now = Date.now();
        const events24h = allEvents.filter(e => (now - new Date(e.timestamp).getTime()) <= 86400000).length;
        if (events24hEl) events24hEl.textContent = events24h.toString();

        const activeCount = allEvents.filter(e =>
            ['FUNDS_LOCKED', 'EXECUTION_CONFIRMED'].includes(e.eventType)
        ).length;
        if (activeEl) activeEl.textContent = activeCount.toString();

        // Tab counts
        const counts = { all: allEvents.length, execution: 0, settlement: 0, failure: 0, fee: 0 };
        allEvents.forEach(e => {
            const cat = getEventCategory(e.eventType);
            if (counts[cat] !== undefined) counts[cat]++;
        });
        const countAll = document.getElementById('ldg-count-all');
        const countExec = document.getElementById('ldg-count-exec');
        const countSettle = document.getElementById('ldg-count-settle');
        const countFail = document.getElementById('ldg-count-fail');
        const countFee = document.getElementById('ldg-count-fee');
        if (countAll) countAll.textContent = counts.all;
        if (countExec) countExec.textContent = counts.execution;
        if (countSettle) countSettle.textContent = counts.settlement;
        if (countFail) countFail.textContent = counts.failure;
        if (countFee) countFee.textContent = counts.fee;
    }

    // ========== BIND EVENTS ==========

    // Tabs
    document.getElementById('ldg-tabs')?.addEventListener('click', (e) => {
        const tab = e.target.closest('.ldg-tab');
        if (!tab) return;
        document.querySelectorAll('.ldg-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab.dataset.filter;
        renderEvents();
    });

    // Filter pills
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

    // Search
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

    // Sort
    const sortSelect = document.getElementById('ldg-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortBy = sortSelect.value;
            renderEvents();
        });
    }

    // Drawer close
    document.getElementById('ldg-drawer-close')?.addEventListener('click', closeDrawer);
    document.getElementById('ldg-drawer')?.addEventListener('click', (e) => {
        if (e.target.id === 'ldg-drawer') closeDrawer();
    });

    // ========== FETCH DATA ==========

    try {
        const response = await window.api.getPublicLedger();
        allEvents = response?.events || [];
        console.log('[Ledger] Loaded', allEvents.length, 'events');
        updateStats();
        renderEvents();
    } catch (error) {
        console.error('[Ledger] Error loading events:', error);
        list.innerHTML = `
            <div class="ldg-empty">
                <div class="ldg-empty-icon">⚠</div>
                <div class="ldg-empty-text">Ledger temporarily unavailable</div>
                <div class="ldg-empty-sub">The system is synchronizing records. Please check back shortly.</div>
            </div>
        `;
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}
