// PUBLIC LEDGER — Append-only record of executions and settlements
// 10/10 Institutional Terminal Design

export function renderLedger() {
    return `
        <style>
            /* ============================================================
               PUBLIC LEDGER — INSTITUTIONAL TERMINAL DESIGN SYSTEM
               Deterministic · Immutable · Financial · Terminal-grade
               ============================================================ */

            .ldg {
                background: #f9f9f9;
                min-height: calc(100vh - 72px);
                font-family: 'IBM Plex Sans', -apple-system, sans-serif;
                color: #111;
            }

            /* ── Page Header Strip ── */
            .ldg-page-hdr {
                background: #fff;
                border-bottom: 1px solid #e5e5e5;
                padding: 28px 32px 0;
            }
            .ldg-page-title {
                font-size: 22px;
                font-weight: 700;
                letter-spacing: -0.5px;
                color: #0a0a0a;
                margin: 0 0 4px;
            }
            .ldg-page-sub {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 11px;
                color: #888;
                margin: 0 0 20px;
                letter-spacing: 0.3px;
            }
            .ldg-page-meta {
                display: flex;
                gap: 24px;
                padding-bottom: 0;
            }
            .ldg-page-meta-item {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 1px;
                color: #bbb;
                text-transform: uppercase;
            }
            .ldg-page-meta-item span {
                color: #888;
            }

            /* ── Stats Topbar ── */
            .ldg-topbar {
                background: #fff;
                border-bottom: 1px solid #e5e5e5;
                display: grid;
                grid-template-columns: repeat(4, 1fr) auto auto;
                align-items: center;
            }
            .ldg-stat {
                padding: 20px 28px;
                border-right: 1px solid #f0f0f0;
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
                padding: 0 20px;
                grid-column: span 2;
            }

            /* ── Search ── */
            .ldg-search {
                padding: 8px 12px;
                font-size: 12px;
                border: 1px solid #e5e5e5;
                border-radius: 0;
                outline: none;
                width: 200px;
                font-family: 'IBM Plex Mono', monospace;
                color: #333;
                background: #fafafa;
                transition: border-color 0.15s;
            }
            .ldg-search:focus { border-color: #bbb; background: #fff; }
            .ldg-search::placeholder { color: #ccc; }

            .ldg-sort {
                padding: 8px 10px;
                font-size: 11px;
                border: 1px solid #e5e5e5;
                border-radius: 0;
                background: #fafafa;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                color: #666;
                outline: none;
            }
            .ldg-sort:focus { border-color: #bbb; }

            /* ── Tabs ── */
            .ldg-tabs {
                display: flex;
                padding: 0 32px;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
                gap: 0;
            }
            .ldg-tab {
                padding: 14px 18px;
                font-size: 11px;
                font-weight: 700;
                color: #aaa;
                background: transparent;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                transition: color 0.15s;
                position: relative;
            }
            .ldg-tab:hover { color: #555; }
            .ldg-tab.active {
                color: #111;
                border-bottom-color: #752122;
            }
            .ldg-tab-count {
                font-size: 9px;
                background: #f3f4f6;
                color: #666;
                padding: 1px 5px;
                margin-left: 5px;
                font-weight: 700;
                font-family: 'IBM Plex Mono', monospace;
            }
            .ldg-tab.active .ldg-tab-count {
                background: #fff0f0;
                color: #752122;
            }

            /* ── Filter Row ── */
            .ldg-filters {
                display: flex;
                gap: 5px;
                padding: 12px 32px;
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
                flex-wrap: wrap;
                align-items: center;
            }
            .ldg-filter-label {
                font-size: 9px;
                font-weight: 700;
                color: #bbb;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-family: 'IBM Plex Mono', monospace;
                margin-right: 4px;
            }
            .ldg-filter-divider {
                width: 1px;
                height: 16px;
                background: #e5e5e5;
                margin: 0 8px;
            }
            .ldg-pill {
                padding: 5px 11px;
                font-size: 10px;
                font-weight: 600;
                color: #888;
                background: #fff;
                border: 1px solid #e8e8e8;
                border-radius: 2px;
                cursor: pointer;
                transition: all 0.12s;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            .ldg-pill:hover { border-color: #ccc; color: #444; }
            .ldg-pill.active {
                background: #111;
                color: #fff;
                border-color: #111;
            }

            /* ── Event List ── */
            .ldg-list {
                padding: 20px 32px 80px;
                display: flex;
                flex-direction: column;
                gap: 0;
            }

            /* ── Event Row ── */
            .ldg-event {
                background: #fff;
                border: 1px solid #DCDCDC;
                border-bottom: none;
                padding: 18px 20px;
                cursor: pointer;
                transition: background 0.1s, border-color 0.1s;
                display: grid;
                grid-template-columns: 220px 1fr 120px 110px 28px;
                align-items: center;
                gap: 16px;
                position: relative;
            }
            .ldg-event:first-child { border-top: 1px solid #e8e8e8; }
            .ldg-event:last-child { border-bottom: 1px solid #e8e8e8; }
            .ldg-event::before {
                content: '';
                position: absolute;
                top: 0; bottom: 0; left: 0;
                width: 3px;
                background: transparent;
                transition: background 0.12s;
            }
            .ldg-event:hover { background: #fafafa; border-color: #d5d5d5; }
            .ldg-event:hover::before { background: #752122; }
            .ldg-event:hover + .ldg-event { border-top-color: #d5d5d5; }

            /* Col 1: Event Type Tag + Timestamp */
            .ldg-event-tag {
                display: inline-block;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                padding: 4px 9px;
                border: 1px solid currentColor;
                margin-bottom: 6px;
                opacity: 1;
            }
            .ldg-event-time {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 11px;
                color: #6B6B6B;
            }

            /* Col 2: Contract ID + Provider + Hash */
            .ldg-event-contract {
                display: flex;
                flex-direction: column;
                gap: 3px;
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
            }
            .ldg-provider {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 10px;
                color: #888;
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
                color: #ccc;
            }

            /* Col 3: Amount */
            .ldg-event-amount {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 17px;
                font-weight: 700;
                color: #111111;
                letter-spacing: -0.5px;
                text-align: right;
            }
            .ldg-event-amount-sub {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                color: #8A8A8A;
                text-align: right;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-top: 2px;
            }

            /* Col 4: Status Tag */
            .ldg-status {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 4px 8px;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-radius: 2px;
                white-space: nowrap;
            }
            .ldg-status.locked    { background: #f5f5f5; color: #555; border: 1px solid #e5e5e5; }
            .ldg-status.settled   { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
            .ldg-status.failed    { background: #fff0f0; color: #752122; border: 1px solid #fecaca; }
            .ldg-status.pending   { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
            .ldg-status.fee       { background: #fefce8; color: #713f12; border: 1px solid #fef08a; }

            /* Col 5: Arrow */
            .ldg-event-arrow {
                color: #ddd;
                font-size: 14px;
                text-align: right;
                transition: color 0.12s;
            }
            .ldg-event:hover .ldg-event-arrow { color: #752122; }

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
                color: #ccc;
                margin-bottom: 8px;
            }
            .ldg-empty-text {
                font-size: 13px;
                color: #999;
            }

            /* ── Skeleton ── */
            .ldg-skeleton {
                background: #fff;
                border: 1px solid #e8e8e8;
                border-bottom: none;
                height: 64px;
                position: relative;
                overflow: hidden;
            }
            .ldg-skeleton:last-child { border-bottom: 1px solid #e8e8e8; }
            .ldg-skeleton::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(90deg, transparent, rgba(0,0,0,0.025), transparent);
                animation: ldg-shimmer 1.5s infinite;
            }
            @keyframes ldg-shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            /* ── Footer ── */
            .ldg-footer {
                padding: 20px 32px;
                border-top: 1px solid #f0f0f0;
                background: #fff;
                text-align: center;
            }
            .ldg-footer-line {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: #ccc;
                line-height: 2;
            }

            /* ── Drawer ── */
            .ldg-drawer-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.35);
                z-index: 200;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.25s ease;
            }
            .ldg-drawer-backdrop.open {
                opacity: 1;
                pointer-events: auto;
            }
            .ldg-drawer {
                position: fixed;
                top: 0; right: 0;
                width: 420px; max-width: 90vw;
                height: 100vh;
                background: #fff;
                border-left: 1px solid #e5e5e5;
                z-index: 201;
                transform: translateX(100%);
                transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
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
                border-bottom: 1px solid #f0f0f0;
                background: #fafafa;
            }
            .ldg-drawer-header-red {
                width: 20px;
                height: 2px;
                background: #752122;
                margin-bottom: 6px;
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
                transition: all 0.12s;
                border-radius: 0;
            }
            .ldg-drawer-close:hover { background: #fff0f0; color: #752122; border-color: #fecaca; }
            .ldg-drawer-body { padding: 20px; flex: 1; }
            .ldg-drawer-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 11px 0;
                border-bottom: 1px solid #f5f5f5;
            }
            .ldg-drawer-row:last-child { border-bottom: none; }
            .ldg-drawer-label {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #bbb;
                flex-shrink: 0;
                padding-top: 1px;
            }
            .ldg-drawer-value {
                font-size: 12px;
                color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
                font-weight: 500;
                text-align: right;
                max-width: 240px;
                word-break: break-all;
            }
            .ldg-drawer-value.mono {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #555;
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
                transition: all 0.12s;
                border-radius: 0;
            }
            .ldg-copy-btn:hover { border-color: #bbb; color: #111; }
            .ldg-drawer-section {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #bbb;
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
                transition: color 0.12s;
            }
            .ldg-drawer-link:hover { color: #5a191a; }
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
                transition: all 0.12s;
                margin-top: 10px;
                border-radius: 0;
            }
            .ldg-json-toggle:hover { border-color: #bbb; color: #111; }

            /* ── Responsive ── */
            @media (max-width: 860px) {
                .ldg-topbar { grid-template-columns: 1fr 1fr; }
                .ldg-controls { padding: 12px 16px; grid-column: 1 / -1; }
                .ldg-tabs { padding: 0 16px; overflow-x: auto; }
                .ldg-filters { padding: 10px 16px; }
                .ldg-list { padding: 12px 16px 60px; }
                .ldg-page-hdr { padding: 20px 16px 0; }
                .ldg-event {
                    grid-template-columns: 1fr;
                    gap: 6px;
                }
                .ldg-event-amount { text-align: left; }
                .ldg-event-amount-sub { text-align: left; }
                .ldg-drawer { width: 100vw; max-width: 100vw; }
            }
        </style>

        <div class="ldg">

            <!-- Page Header -->
            <div class="ldg-page-hdr">
                <div style="display:flex; align-items:baseline; gap:16px; margin-bottom:4px;">
                    <h1 class="ldg-page-title">PUBLIC LEDGER</h1>
                    <div style="width:32px; height:2px; background:#752122; flex-shrink:0; margin-bottom:4px;"></div>
                </div>
                <p class="ldg-page-sub">Append-only record of executions and settlements.</p>
                <div class="ldg-page-meta">
                    <span class="ldg-page-meta-item">Network: <span>USD Settlement</span></span>
                    <span class="ldg-page-meta-item">Custody: <span>Stripe Connect</span></span>
                    <span class="ldg-page-meta-item">Model: <span>Deterministic Verification</span></span>
                </div>
            </div>

            <!-- Stats Topbar -->
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
                    <div>
                        <div class="ldg-drawer-header-red"></div>
                        <span class="ldg-drawer-title">Event Record</span>
                    </div>
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
        if (type.includes('SETTLED_FAILURE') || type.includes('VERIFICATION_FAILED')) return '#752122';
        if (type.includes('FEE')) return '#92400e';
        if (type.includes('LOCKED') || type.includes('EXECUTION_CONFIRMED')) return '#0a0a0a';
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

    // ── Render Events ──
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
                    <!-- Col 1: Tag + Time -->
                    <div>
                        <div class="ldg-event-tag" style="color: ${tagColor}; border-color: ${tagColor};">
                            ${formatEventType(event.eventType)}
                        </div>
                        <div class="ldg-event-time">${formatTimestamp(event.timestamp)}</div>
                    </div>

                    <!-- Col 2: Contract + Meta -->
                    <div class="ldg-event-contract">
                        <span class="ldg-event-rcpt">${contractShort}</span>
                        <div class="ldg-event-meta">
                            ${provider ? getProviderBadge(provider) : ''}
                            <span class="ldg-event-hash">${truncateHash(event.eventHash)}</span>
                        </div>
                    </div>

                    <!-- Col 3: Amount -->
                    <div>
                        <div class="ldg-event-amount">${formatCurrency(event.amountUsdCents)}</div>
                        <div class="ldg-event-amount-sub">USD</div>
                    </div>

                    <!-- Col 4: Status -->
                    <div style="text-align: right;">
                        ${getStatusPill(event.eventType)}
                    </div>

                    <!-- Col 5: Arrow -->
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
                <span class="ldg-drawer-label">Tx Hash</span>
                <span class="ldg-drawer-value mono">
                    ${event.eventHash || '—'}
                    ${event.eventHash ? `<button class="ldg-copy-btn" data-copy="${event.eventHash}">COPY</button>` : ''}
                </span>
            </div>
            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Principal ID</span>
                <span class="ldg-drawer-value mono">
                    ${event.contractId ? truncateHash(event.contractId) : '—'}
                    ${event.contractId ? `<button class="ldg-copy-btn" data-copy="${event.contractId}">COPY</button>` : ''}
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
