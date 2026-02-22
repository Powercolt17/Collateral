// PUBLIC LEDGER — Append-only record of executions and settlements
// Institutional Terminal Design — Simplified

export function renderLedger() {
    return `
        <style>
            /* ============================================================
               PUBLIC LEDGER — INSTITUTIONAL RECORD SYSTEM
               Deterministic · Immutable · Financial
               ============================================================ */

            .ldg {
                background: #fafafa;
                min-height: calc(100vh - 72px);
                font-family: 'IBM Plex Sans', -apple-system, sans-serif;
                color: #111;
            }

            /* ── Page Header ── */
            .ldg-page-hdr {
                background: #fff;
                border-bottom: 1px solid #DCDCDC;
                padding: 28px 32px 20px;
            }
            .ldg-page-title {
                font-size: 22px;
                font-weight: 700;
                letter-spacing: -0.5px;
                color: #111111;
                margin: 0;
            }

            /* ── Stats Strip ── */
            .ldg-topbar {
                background: #fff;
                border-bottom: 1px solid #DCDCDC;
                display: flex;
                align-items: stretch;
            }
            .ldg-stat {
                flex: 1;
                padding: 20px 28px;
                border-right: 1px solid #F0F0F0;
            }
            .ldg-stat:last-of-type { border-right: none; }
            .ldg-stat-value {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 22px;
                font-weight: 700;
                color: #111111;
                letter-spacing: -1px;
                line-height: 1;
                margin-bottom: 6px;
            }
            .ldg-stat-value.operational {
                color: #15803d;
                font-size: 13px;
                letter-spacing: 0;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .ldg-stat-dot {
                width: 7px;
                height: 7px;
                background: #15803d;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .ldg-stat-label {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #6B6B6B;
            }
            .ldg-controls {
                display: flex;
                gap: 8px;
                align-items: center;
                padding: 0 24px;
                flex-shrink: 0;
            }

            /* ── Search + Sort ── */
            .ldg-search {
                padding: 8px 12px;
                font-size: 12px;
                border: 1px solid #DCDCDC;
                outline: none;
                width: 180px;
                font-family: 'IBM Plex Mono', monospace;
                color: #333;
                background: #fff;
                transition: border-color 0.12s;
            }
            .ldg-search:focus { border-color: #921818; }
            .ldg-search::placeholder { color: #8A8A8A; }

            .ldg-sort {
                padding: 8px 10px;
                font-size: 11px;
                border: 1px solid #DCDCDC;
                background: #fff;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                color: #444444;
                outline: none;
            }
            .ldg-sort:focus { border-color: #921818; }

            /* ── Tabs ── */
            .ldg-tabs {
                display: flex;
                padding: 0 32px;
                border-bottom: 1px solid #DCDCDC;
                background: #fff;
                gap: 0;
            }
            .ldg-tab {
                padding: 14px 18px;
                font-size: 11px;
                font-weight: 600;
                color: #8A8A8A;
                background: transparent;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                transition: color 0.12s;
            }
            .ldg-tab:hover { color: #444444; }
            .ldg-tab.active {
                color: #111111;
                font-weight: 700;
                border-bottom-color: #921818;
            }
            .ldg-tab-count {
                font-size: 9px;
                background: #f3f4f6;
                color: #6B6B6B;
                padding: 1px 5px;
                margin-left: 5px;
                font-weight: 700;
                font-family: 'IBM Plex Mono', monospace;
            }
            .ldg-tab.active .ldg-tab-count {
                background: #fef2f2;
                color: #921818;
            }

            /* ── Filter Row ── */
            .ldg-filters {
                display: flex;
                gap: 5px;
                padding: 10px 32px;
                background: #fff;
                border-bottom: 1px solid #F0F0F0;
                flex-wrap: wrap;
                align-items: center;
            }
            .ldg-filter-label {
                font-size: 9px;
                font-weight: 700;
                color: #8A8A8A;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-family: 'IBM Plex Mono', monospace;
                margin-right: 4px;
            }
            .ldg-filter-divider {
                width: 1px;
                height: 14px;
                background: #E5E5E5;
                margin: 0 8px;
            }
            .ldg-pill {
                padding: 4px 10px;
                font-size: 10px;
                font-weight: 600;
                color: #8A8A8A;
                background: transparent;
                border: none;
                border-bottom: 1px solid transparent;
                cursor: pointer;
                transition: all 0.12s;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            .ldg-pill:hover { color: #444444; }
            .ldg-pill.active {
                color: #111111;
                font-weight: 700;
                border-bottom-color: #921818;
            }

            /* ── Event List ── */
            .ldg-list {
                padding: 8px 32px 80px;
                display: flex;
                flex-direction: column;
                gap: 0;
            }

            /* ── Event Row — Simplified 2-line ── */
            .ldg-event {
                background: #fff;
                padding: 16px 20px;
                cursor: pointer;
                transition: background 0.08s;
                display: grid;
                grid-template-columns: auto 1fr auto auto 20px;
                align-items: center;
                gap: 16px;
                border-bottom: 1px solid #F0F0F0;
                position: relative;
            }
            .ldg-event:first-child { border-top: 1px solid #F0F0F0; }
            .ldg-event::before {
                content: '';
                position: absolute;
                top: 0; bottom: 0; left: 0;
                width: 3px;
                background: transparent;
                transition: background 0.1s;
            }
            .ldg-event:hover { background: #FAFAFA; }
            .ldg-event:hover::before { background: #921818; }

            /* Col 1: Event Tag */
            .ldg-event-tag {
                display: inline-block;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                padding: 3px 8px;
                border: 1px solid;
                white-space: nowrap;
            }

            /* Col 2: Contract ID + meta line */
            .ldg-event-contract {
                display: flex;
                flex-direction: column;
                gap: 2px;
                min-width: 0;
            }
            .ldg-event-rcpt {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 13px;
                font-weight: 700;
                color: #111111;
            }
            .ldg-event-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #8A8A8A;
            }
            .ldg-provider {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 10px;
                color: #8A8A8A;
                font-family: 'IBM Plex Mono', monospace;
                font-weight: 600;
            }
            .ldg-provider-dot {
                width: 5px;
                height: 5px;
                border-radius: 50%;
            }
            .ldg-provider-dot.stripe  { background: #635bff; }
            .ldg-provider-dot.shopify { background: #96bf48; }
            .ldg-provider-dot.amazon  { background: #ff9900; }
            .ldg-provider-dot.x       { background: #0a0a0a; }
            .ldg-event-hash {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #8A8A8A;
            }
            .ldg-event-time {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #8A8A8A;
            }

            /* Col 3: Amount */
            .ldg-event-amount {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 18px;
                font-weight: 700;
                color: #111111;
                letter-spacing: -0.5px;
                text-align: right;
                white-space: nowrap;
            }

            /* Col 4: Status Tag */
            .ldg-status {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 3px 7px;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                white-space: nowrap;
            }
            .ldg-status.locked    { background: #f5f5f5; color: #444444; border: 1px solid #E5E5E5; }
            .ldg-status.settled   { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
            .ldg-status.failed    { background: #fef2f2; color: #921818; border: 1px solid #fecaca; }
            .ldg-status.pending   { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
            .ldg-status.fee       { background: #fefce8; color: #713f12; border: 1px solid #fef08a; }

            /* Col 5: Arrow */
            .ldg-event-arrow {
                color: #DCDCDC;
                font-size: 14px;
                text-align: right;
                transition: color 0.1s;
            }
            .ldg-event:hover .ldg-event-arrow { color: #921818; }

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
                color: #8A8A8A;
                margin-bottom: 8px;
            }
            .ldg-empty-text {
                font-size: 13px;
                color: #6B6B6B;
            }

            /* ── Skeleton ── */
            .ldg-skeleton {
                background: #fff;
                height: 56px;
                border-bottom: 1px solid #F0F0F0;
                position: relative;
                overflow: hidden;
            }
            .ldg-skeleton::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(90deg, transparent, rgba(0,0,0,0.02), transparent);
                animation: ldg-shimmer 1.5s infinite;
            }
            @keyframes ldg-shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            /* ── Footer ── */
            .ldg-footer {
                padding: 20px 32px;
                border-top: 1px solid #F0F0F0;
                background: #fff;
                text-align: center;
            }
            .ldg-footer-line {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: #DCDCDC;
                line-height: 2;
            }

            /* ── Drawer ── */
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
                border-left: 1px solid #DCDCDC;
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
                border-bottom: 1px solid #E5E5E5;
            }
            .ldg-drawer-title {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #111111;
            }
            .ldg-drawer-close {
                width: 28px; height: 28px;
                display: flex; align-items: center; justify-content: center;
                background: #f5f5f5;
                border: 1px solid #E5E5E5;
                cursor: pointer;
                color: #8A8A8A;
                font-size: 12px;
                transition: all 0.1s;
            }
            .ldg-drawer-close:hover { background: #fef2f2; color: #921818; border-color: #fecaca; }
            .ldg-drawer-body { padding: 20px; flex: 1; }
            .ldg-drawer-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 11px 0;
                border-bottom: 1px solid #F0F0F0;
            }
            .ldg-drawer-row:last-child { border-bottom: none; }
            .ldg-drawer-label {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #8A8A8A;
                flex-shrink: 0;
                padding-top: 1px;
            }
            .ldg-drawer-value {
                font-size: 12px;
                color: #111111;
                font-family: 'IBM Plex Sans', sans-serif;
                font-weight: 600;
                text-align: right;
                max-width: 240px;
                word-break: break-all;
            }
            .ldg-drawer-value.mono {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #444444;
            }
            .ldg-copy-btn {
                padding: 2px 6px;
                margin-left: 6px;
                font-size: 9px;
                color: #8A8A8A;
                background: #f5f5f5;
                border: 1px solid #E5E5E5;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                transition: all 0.1s;
            }
            .ldg-copy-btn:hover { border-color: #DCDCDC; color: #111111; }
            .ldg-drawer-section {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #8A8A8A;
                padding: 16px 0 8px;
                border-bottom: 1px solid #E5E5E5;
                margin-top: 8px;
            }
            .ldg-drawer-link {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                font-weight: 700;
                color: #921818;
                text-decoration: none;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                transition: color 0.1s;
            }
            .ldg-drawer-link:hover { color: #6B1212; }
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
                color: #8A8A8A;
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.1s;
                margin-top: 10px;
            }
            .ldg-json-toggle:hover { border-color: #DCDCDC; color: #111111; }

            /* ── Responsive ── */
            @media (max-width: 860px) {
                .ldg-topbar { flex-wrap: wrap; }
                .ldg-stat { min-width: 50%; }
                .ldg-controls { padding: 12px 16px; width: 100%; }
                .ldg-tabs { padding: 0 16px; overflow-x: auto; }
                .ldg-filters { padding: 10px 16px; }
                .ldg-list { padding: 8px 16px 60px; }
                .ldg-page-hdr { padding: 20px 16px; }
                .ldg-event {
                    grid-template-columns: 1fr;
                    gap: 8px;
                }
                .ldg-event-amount { text-align: left; }
                .ldg-drawer { width: 100vw; max-width: 100vw; }
            }
        </style>

        <div class="ldg">

            <!-- Page Header — Clean -->
            <div class="ldg-page-hdr">
                <h1 class="ldg-page-title">PUBLIC LEDGER</h1>
            </div>

            <!-- Stats Strip — Simplified -->
            <div class="ldg-topbar">
                <div class="ldg-stat">
                    <div class="ldg-stat-value" id="ldg-tvl">—</div>
                    <div class="ldg-stat-label">Capital Locked</div>
                </div>
                <div class="ldg-stat">
                    <div class="ldg-stat-value" id="ldg-active">—</div>
                    <div class="ldg-stat-label">Active Contracts</div>
                </div>
                <div class="ldg-stat">
                    <div class="ldg-stat-value" id="ldg-events-24h">—</div>
                    <div class="ldg-stat-label">Events (24H)</div>
                </div>
                <div class="ldg-stat">
                    <div class="ldg-stat-value operational">
                        <span class="ldg-stat-dot"></span> OPERATIONAL
                    </div>
                    <div class="ldg-stat-label">System Status</div>
                </div>
                <div class="ldg-controls">
                    <input type="text" class="ldg-search" id="ldg-search" placeholder="Search RCPT or hash...">
                    <select class="ldg-sort" id="ldg-sort">
                        <option value="newest">NEWEST</option>
                        <option value="value">VALUE</option>
                        <option value="status">STATUS</option>
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
                <button class="ldg-pill active" data-provider="all">ALL</button>
                <button class="ldg-pill" data-provider="stripe">STRIPE</button>
                <button class="ldg-pill" data-provider="shopify">SHOPIFY</button>
                <button class="ldg-pill" data-provider="amazon">AMAZON</button>
                <button class="ldg-pill" data-provider="x">X</button>

                <div class="ldg-filter-divider"></div>

                <span class="ldg-filter-label">PERIOD</span>
                <button class="ldg-pill active" data-time="all">ALL</button>
                <button class="ldg-pill" data-time="24h">24H</button>
                <button class="ldg-pill" data-time="7d">7D</button>
                <button class="ldg-pill" data-time="30d">30D</button>
            </div>

            <!-- Event List -->
            <div class="ldg-list" id="ldg-list">
                <div class="ldg-skeleton"></div>
                <div class="ldg-skeleton"></div>
                <div class="ldg-skeleton"></div>
                <div class="ldg-skeleton"></div>
                <div class="ldg-skeleton"></div>
            </div>

            <!-- Footer -->
            <div class="ldg-footer">
                <div class="ldg-footer-line">RECORDS ARE IMMUTABLE</div>
                <div class="ldg-footer-line">OUTCOMES ARE FINAL</div>
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
            'CONTRACT_CREATED': 'CONTRACT_CREATED',
            'FUNDS_AUTHORIZED': 'FUNDS_AUTHORIZED',
            'FUNDS_LOCKED': 'FUNDS_LOCKED',
            'EXECUTION_CONFIRMED': 'EXECUTION_CONFIRMED',
            'VERIFICATION_STARTED': 'VERIFICATION_STARTED',
            'VERIFICATION_SUCCEEDED': 'VERIFICATION_SUCCEEDED',
            'VERIFICATION_FAILED': 'VERIFICATION_FAILED',
            'SETTLED_SUCCESS': 'SETTLED_SUCCESS',
            'SETTLED_FAILURE': 'SETTLED_FAILURE',
            'SETTLEMENT_STARTED': 'SETTLEMENT_STARTED',
            'FEE_COLLECTED': 'FEE_COLLECTED',
            'BASELINE_SNAPSHOTTED': 'BASELINE_SNAPSHOTTED',
        };
        return map[type] || type;
    }

    function getEventCategory(type) {
        if (['FUNDS_LOCKED', 'EXECUTION_CONFIRMED', 'FUNDS_AUTHORIZED', 'CONTRACT_CREATED', 'BASELINE_SNAPSHOTTED'].includes(type)) return 'execution';
        if (['SETTLED_SUCCESS', 'SETTLEMENT_STARTED'].includes(type)) return 'settlement';
        if (['SETTLED_FAILURE', 'VERIFICATION_FAILED'].includes(type)) return 'failure';
        if (['FEE_COLLECTED'].includes(type)) return 'fee';
        return 'execution';
    }

    function getTagColor(type) {
        if (type.includes('SETTLED_SUCCESS') || type.includes('VERIFICATION_SUCCEEDED')) return '#15803d';
        if (type.includes('SETTLED_FAILURE') || type.includes('VERIFICATION_FAILED')) return '#921818';
        if (type.includes('FEE')) return '#92400e';
        if (type.includes('LOCKED') || type.includes('EXECUTION_CONFIRMED')) return '#111111';
        return '#6B6B6B';
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
        if (hash.length > 16) return hash.slice(0, 8) + '…' + hash.slice(-6);
        return hash;
    }

    function getProviderFromEvent(event) {
        const meta = event.metadataJson || event.metadata || {};
        if (meta.platform) return meta.platform.toLowerCase();
        if (meta.provider) return meta.provider.toLowerCase();
        return '';
    }

    function getProviderBadge(provider) {
        if (!provider) return '';
        const name = provider.charAt(0).toUpperCase() + provider.slice(1);
        return `<span class="ldg-provider"><span class="ldg-provider-dot ${provider}"></span>${name}</span>`;
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

    // ── Render Events — Simplified Row ──
    function renderEvents() {
        const filtered = filterEvents();

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="ldg-empty">
                    <div class="ldg-empty-lbl">No Records</div>
                    <div class="ldg-empty-text">No events match your current filter set.</div>
                </div>
            `;
            return;
        }

        list.innerHTML = filtered.map((event, i) => {
            const contractShort = event.contractId
                ? 'RCPT-' + event.contractId.slice(0, 4).toUpperCase()
                : '—';
            const provider = getProviderFromEvent(event);
            const tagColor = getTagColor(event.eventType);

            return `
                <div class="ldg-event" data-index="${i}">
                    <!-- Tag -->
                    <div class="ldg-event-tag" style="color: ${tagColor}; border-color: ${tagColor};">
                        ${formatEventType(event.eventType)}
                    </div>

                    <!-- Contract + Meta -->
                    <div class="ldg-event-contract">
                        <span class="ldg-event-rcpt">${contractShort}</span>
                        <div class="ldg-event-meta">
                            <span class="ldg-event-time">${formatTimestamp(event.timestamp)}</span>
                            ${provider ? getProviderBadge(provider) : ''}
                            <span class="ldg-event-hash">${truncateHash(event.eventHash)}</span>
                        </div>
                    </div>

                    <!-- Amount -->
                    <div class="ldg-event-amount">${formatCurrency(event.amountUsdCents)}</div>

                    <!-- Status -->
                    <div style="text-align: right;">
                        ${getStatusPill(event.eventType)}
                    </div>

                    <!-- Arrow -->
                    <div class="ldg-event-arrow">→</div>
                </div>
            `;
        }).join('');

        // Click → drawer
        list.querySelectorAll('.ldg-event').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.index);
                const current = filterEvents();
                if (current[idx]) openDrawer(current[idx]);
            });
        });
    }

    // ── Drawer — Clean label/value pairs ──
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
        const events24El = document.getElementById('ldg-events-24h');
        const activeEl = document.getElementById('ldg-active');

        const totalCents = allEvents
            .filter(e => e.amountUsdCents)
            .reduce((sum, e) => sum + (e.amountUsdCents || 0), 0);
        if (tvlEl) tvlEl.textContent = formatCurrency(totalCents);

        const now = Date.now();
        const events24h = allEvents.filter(e => (now - new Date(e.timestamp).getTime()) <= 86400000).length;
        if (events24El) events24El.textContent = events24h.toString();

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
        const ids = { all: 'ldg-count-all', execution: 'ldg-count-exec', settlement: 'ldg-count-settle', failure: 'ldg-count-fail', fee: 'ldg-count-fee' };
        Object.entries(ids).forEach(([key, id]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = counts[key];
        });
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
                <div class="ldg-empty-lbl">LEDGER UNAVAILABLE</div>
                <div class="ldg-empty-text">System synchronizing. Records will appear shortly.</div>
            </div>
        `;
    }

    if (window.lucide) window.lucide.createIcons();
}
