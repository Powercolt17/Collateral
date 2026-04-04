// PUBLIC LEDGER — Append-only record of executions and settlements
// Redesigned institutional layout matching premium aesthetic

export function renderLedger() {
    return `
        <style>
            /* ============================================================
               PUBLIC LEDGER — INSTITUTIONAL LAYOUT
               ============================================================ */

            .ldg {
                background: #fff;
                min-height: calc(100vh - 72px);
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
                display: flex;
                flex-direction: column;
                font-feature-settings: 'zero' 0;
                -moz-font-feature-settings: 'zero' 0;
                -webkit-font-feature-settings: 'zero' 0;
            }

            /* ── Hero Header ── */
            .ldg-header {
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
            }
            .ldg-header-inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 48px 64px 48px;
            }
            .ldg-hero-row {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 48px;
            }
            .ldg-hero-left { flex: 1; }
            .ldg-hero-title {
                font-size: 42px;
                font-weight: 300;
                color: #111;
                letter-spacing: -1.5px;
                margin: 0;
                line-height: 1.1;
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .ldg-hero-title strong {
                font-weight: 700;
            }
            .ldg-synced-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-family: 'Inter', monospace;
                font-size: 9px;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: #16a34a;
                background: #f0fdf4;
                border: 1px solid #bbf7d0;
                padding: 4px 10px;
            }
            .ldg-synced-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #16a34a;
                animation: ldg-pulse 2s infinite;
            }
            @keyframes ldg-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }
            .ldg-hero-desc {
                font-size: 15px;
                color: #999;
                margin-top: 12px;
                line-height: 1.6;
                max-width: 480px;
            }

            /* Stats on the right */
            .ldg-hero-stats {
                display: flex;
                align-items: flex-end;
                gap: 48px;
                flex-shrink: 0;
            }
            .ldg-stat {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .ldg-stat-value {
                font-size: 36px;
                font-weight: 300;
                letter-spacing: -1px;
                color: #111;
                line-height: 1;
            }
            .ldg-stat-label {
                font-family: 'Inter', monospace;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.12em;
                color: #ccc;
                text-transform: uppercase;
                margin-top: 8px;
            }

            /* ── Content Area ── */
            .ldg-content {
                flex: 1;
                max-width: 1440px;
                margin: 0 auto;
                padding: 0 64px;
                width: 100%;
                box-sizing: border-box;
            }

            /* ── Tabs + Search Row ── */
            .ldg-controls-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #f0f0f0;
                margin-top: 8px;
            }
            .ldg-tabs {
                display: flex;
                align-items: center;
                gap: 0;
            }
            .ldg-tab {
                padding: 16px 0;
                margin-right: 32px;
                font-size: 13px;
                font-weight: 500;
                color: #bbb;
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                transition: color 0.15s;
            }
            .ldg-tab:hover { color: #666; }
            .ldg-tab.active {
                color: #111;
                font-weight: 600;
                border-bottom-color: #111;
            }

            .ldg-controls-right {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .ldg-search {
                padding: 8px 14px;
                font-size: 13px;
                border: 1px solid #e5e5e5;
                outline: none;
                width: 180px;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #333;
                background: #fafafa;
                transition: border-color 0.15s;
            }
            .ldg-search:focus { border-color: #111; background: #fff; }
            .ldg-search::placeholder { color: #ccc; }

            .ldg-csv-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 14px;
                font-family: 'Inter', monospace;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #666;
                background: #fff;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                transition: all 0.15s;
            }
            .ldg-csv-btn:hover { border-color: #111; color: #111; }
            .ldg-csv-btn svg { width: 14px; height: 14px; }

            /* ── Filters Row ── */
            .ldg-filters-row {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 14px 0;
                border-bottom: 1px solid #f0f0f0;
                flex-wrap: wrap;
            }
            .ldg-filter-label {
                font-family: 'Inter', monospace;
                font-size: 10px;
                font-weight: 700;
                color: #bbb;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin-right: 4px;
            }
            .ldg-filter-divider {
                width: 1px;
                height: 16px;
                background: #e5e5e5;
                margin: 0 12px;
            }
            .ldg-pill {
                padding: 5px 12px;
                font-size: 11px;
                font-weight: 500;
                color: #999;
                background: #fff;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                transition: all 0.15s;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .ldg-pill:hover { border-color: #ccc; color: #666; }
            .ldg-pill.active {
                background: #111;
                color: #fff;
                border-color: #111;
            }
            .ldg-sort-inline {
                font-family: 'Inter', monospace;
                font-size: 10px;
                font-weight: 700;
                color: #bbb;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                display: flex;
                align-items: center;
                gap: 6px;
                margin-left: auto;
            }
            .ldg-sort-select {
                padding: 5px 8px;
                font-size: 12px;
                border: 1px solid #e5e5e5;
                background: #fff;
                cursor: pointer;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #333;
                outline: none;
                font-weight: 500;
            }
            .ldg-sort-select:focus { border-color: #111; }

            /* ── Table ── */
            .ldg-table-wrap {
                margin-top: 0;
            }
            .ldg-table {
                width: 100%;
                border-collapse: collapse;
            }
            .ldg-table thead th {
                font-family: 'Inter', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                color: #ccc;
                padding: 16px 0 12px;
                border-bottom: 1px solid #f0f0f0;
                text-align: left;
            }
            .ldg-table thead th:last-child {
                text-align: right;
            }
            .ldg-table tbody tr {
                border-bottom: 1px solid #f5f5f5;
                cursor: pointer;
                transition: background 0.1s;
            }
            .ldg-table tbody tr:hover {
                background: #fcfcfc;
            }
            .ldg-table tbody td {
                padding: 18px 0;
                font-size: 13px;
                vertical-align: middle;
            }

            /* Status cell — dot + text */
            .ldg-status-cell {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .ldg-status-dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .ldg-status-dot.execution { background: #f59e0b; }
            .ldg-status-dot.locked { background: #16a34a; }
            .ldg-status-dot.settlement { background: #16a34a; }
            .ldg-status-dot.failure { background: #752122; }
            .ldg-status-dot.fee { background: #92400e; }

            .ldg-status-text {
                font-family: 'Inter', monospace;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.04em;
            }
            .ldg-status-text.execution { color: #752122; }
            .ldg-status-text.locked { color: #16a34a; }
            .ldg-status-text.settlement { color: #16a34a; }
            .ldg-status-text.failure { color: #752122; }
            .ldg-status-text.fee { color: #92400e; }

            /* Receipt cell */
            .ldg-rcpt {
                font-family: 'Inter', monospace;
                font-size: 12px;
                font-weight: 700;
                color: #111;
            }

            /* Principal cell */
            .ldg-principal {
                font-size: 13px;
                font-weight: 600;
                color: #111;
            }

            /* Platform cell */
            .ldg-platform {
                font-family: 'Inter', monospace;
                font-size: 11px;
                font-weight: 600;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 0.06em;
            }

            /* Date cell */
            .ldg-date {
                font-size: 13px;
                color: #888;
            }

            /* Amount cell */
            .ldg-amount {
                font-family: 'Inter', sans-serif;
                font-size: 15px;
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
                font-family: 'Inter', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                color: #ccc;
                margin-bottom: 8px;
            }
            .ldg-empty-text {
                font-size: 13px;
                color: #aaa;
            }

            /* ── Pagination ── */
            .ldg-pagination {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 0;
                margin-top: 8px;
            }
            .ldg-page-info {
                font-family: 'Inter', monospace;
                font-size: 10px;
                font-weight: 500;
                color: #ccc;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }
            .ldg-page-btns {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .ldg-page-btn {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                font-weight: 600;
                color: #888;
                background: #fff;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                transition: all 0.15s;
            }
            .ldg-page-btn:hover { border-color: #111; color: #111; }
            .ldg-page-btn.active {
                background: #111;
                color: #fff;
                border-color: #111;
            }
            .ldg-page-btn:disabled {
                color: #ddd;
                border-color: #f0f0f0;
                cursor: not-allowed;
            }

            /* ── Footer ── */
            .ldg-footer {
                border-top: 1px solid #f0f0f0;
                background: #fff;
                margin-top: auto;
            }
            .ldg-footer-inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 16px 64px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .ldg-footer-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .ldg-footer-label {
                font-family: 'Inter', monospace;
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.1em;
                color: #ccc;
                text-transform: uppercase;
            }
            .ldg-footer-sep {
                color: #e0e0e0;
            }
            .ldg-footer-live {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .ldg-footer-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #16a34a;
            }
            .ldg-footer-text {
                font-family: 'Inter', monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.05em;
                color: #16a34a;
                text-transform: uppercase;
            }
            .ldg-footer-count {
                font-family: 'Inter', monospace;
                font-size: 10px;
                font-weight: 500;
                color: #ccc;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }
            .ldg-footer-count .ldg-count-badge {
                display: inline-flex;
                align-items: center;
                padding: 3px 10px;
                background: #752122;
                color: #fff;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.08em;
                margin-left: 8px;
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
                border-left: 1px solid #e5e5e5;
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
                padding: 20px 24px;
                border-bottom: 1px solid #f0f0f0;
            }
            .ldg-drawer-title {
                font-family: 'Inter', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                color: #111;
            }
            .ldg-drawer-close {
                width: 28px; height: 28px;
                display: flex; align-items: center; justify-content: center;
                background: #fafafa;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                color: #888;
                font-size: 12px;
                transition: all 0.1s;
            }
            .ldg-drawer-close:hover { background: #fef2f2; color: #752122; border-color: #fecaca; }
            .ldg-drawer-body { padding: 24px; flex: 1; }
            .ldg-drawer-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 12px 0;
                border-bottom: 1px solid #f5f5f5;
            }
            .ldg-drawer-row:last-child { border-bottom: none; }
            .ldg-drawer-label {
                font-family: 'Inter', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                color: #bbb;
                flex-shrink: 0;
                padding-top: 1px;
            }
            .ldg-drawer-value {
                font-size: 13px;
                color: #111;
                font-weight: 600;
                text-align: right;
                max-width: 240px;
                word-break: break-all;
            }
            .ldg-drawer-value.mono {
                font-family: 'Inter', monospace;
                font-size: 10px;
                color: #666;
            }
            .ldg-copy-btn {
                padding: 2px 8px;
                margin-left: 6px;
                font-size: 9px;
                color: #888;
                background: #fafafa;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                font-family: 'Inter', monospace;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                transition: all 0.1s;
            }
            .ldg-copy-btn:hover { border-color: #ccc; color: #111; }
            .ldg-drawer-section {
                font-family: 'Inter', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                color: #bbb;
                padding: 16px 0 8px;
                border-bottom: 1px solid #f0f0f0;
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
                font-family: 'Inter', monospace;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                transition: color 0.1s;
            }
            .ldg-drawer-link:hover { color: #5a1818; }
            .ldg-drawer-json {
                background: #0a0a0a;
                color: #a3a3a3;
                padding: 14px;
                font-family: 'Inter', monospace;
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
                padding: 10px;
                font-size: 10px;
                font-weight: 700;
                color: #888;
                background: #fafafa;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                font-family: 'Inter', monospace;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                transition: all 0.1s;
                margin-top: 10px;
            }
            .ldg-json-toggle:hover { border-color: #ccc; color: #111; }

            /* Status pills for drawer */
            .ldg-status { display: inline-flex; align-items: center; padding: 3px 8px; font-family: 'Inter', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; }
            .ldg-status.locked    { background: #f5f5f5; color: #666; border: 1px solid #e0e0e0; }
            .ldg-status.settled   { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
            .ldg-status.failed    { background: #fef2f2; color: #752122; border: 1px solid #fecaca; }
            .ldg-status.pending   { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
            .ldg-status.fee       { background: #fefce8; color: #713f12; border: 1px solid #fef08a; }

            /* ── Skeleton ── */
            .ldg-skeleton-row {
                height: 52px;
                border-bottom: 1px solid #f5f5f5;
                position: relative;
                overflow: hidden;
            }
            .ldg-skeleton-row::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(90deg, transparent, rgba(0,0,0,0.012), transparent);
                animation: ldg-shimmer 1.5s infinite;
            }
            @keyframes ldg-shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            /* ── Responsive ── */
            @media (max-width: 1024px) {
                .ldg-header-inner { padding: 32px 32px; }
                .ldg-content { padding: 0 32px; }
                .ldg-footer-inner { padding: 16px 32px; }
                .ldg-hero-row { flex-direction: column; align-items: flex-start; gap: 32px; }
            }
            @media (max-width: 768px) {
                .ldg-header-inner { padding: 24px 16px; }
                .ldg-content { padding: 0 16px; }
                .ldg-footer-inner { padding: 12px 16px; }
                .ldg-hero-stats { gap: 32px; }
                .ldg-controls-row { flex-direction: column; align-items: flex-start; gap: 12px; }
                .ldg-controls-right { width: 100%; }
                .ldg-search { width: 100%; }
                .ldg-filters-row { padding: 10px 0; }
                .ldg-table-wrap { overflow-x: auto; }
                .ldg-tab { font-size: 11px; margin-right: 20px; }
                .ldg-drawer { width: 100vw; max-width: 100vw; border-left: none; }
                .ldg-pagination { flex-direction: column; gap: 12px; align-items: flex-start; }
            }
            @media (max-width: 480px) {
                .ldg-hero-stats { gap: 24px; }
                .ldg-stat-value { font-size: 28px; }
                .ldg-hash { display: none; }
            }
        </style>

        <div class="ldg">
            <!-- Hero Header -->
            <div class="ldg-header" data-reveal>
                <div class="ldg-header-inner">
                    <div class="ldg-hero-row">
                        <div class="ldg-hero-left">
                            <h1 class="ldg-hero-title">
                                Live <strong>Ledger</strong>
                                <span class="ldg-synced-badge">
                                    <span class="ldg-synced-dot"></span>
                                    SYNCED
                                </span>
                            </h1>
                            <p class="ldg-hero-desc">Real-time execution log for all contract events, rivalry duels, settlements, and capital flows.</p>
                        </div>
                        <div class="ldg-hero-stats">
                            <div class="ldg-stat">
                                <span class="ldg-stat-value" id="ldg-tvl">&mdash;</span>
                                <span class="ldg-stat-label">Capital Locked</span>
                            </div>
                            <div class="ldg-stat">
                                <span class="ldg-stat-value" id="ldg-active">&mdash;</span>
                                <span class="ldg-stat-label">Events</span>
                            </div>
                            <div class="ldg-stat">
                                <span class="ldg-stat-value" id="ldg-volume">$0</span>
                                <span class="ldg-stat-label">Settled</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="ldg-content" data-reveal>
                <!-- Tabs + Search -->
                <div class="ldg-controls-row">
                    <div class="ldg-tabs" id="ldg-tabs">
                        <button class="ldg-tab active" data-filter="all">ALL</button>
                        <button class="ldg-tab" data-filter="execution">EXECUTIONS</button>
                        <button class="ldg-tab" data-filter="settlement">SETTLEMENTS</button>
                        <button class="ldg-tab" data-filter="failure">FAILURES</button>
                        <button class="ldg-tab" data-filter="fee">FEES</button>
                    </div>
                    <div class="ldg-controls-right">
                        <input type="text" class="ldg-search" id="ldg-search" placeholder="Search...">
                        <button class="ldg-csv-btn" id="ldg-csv-btn">
                            <i data-lucide="download" style="width:14px;height:14px;"></i>
                            CSV
                        </button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="ldg-filters-row" id="ldg-filters">
                    <span class="ldg-filter-label">Platform</span>
                    <button class="ldg-pill active" data-provider="all">All</button>
                    <button class="ldg-pill" data-provider="X">X</button>
                    <button class="ldg-pill" data-provider="STRIPE">Stripe</button>
                    <button class="ldg-pill" data-provider="SHOPIFY">Shopify</button>
                    <button class="ldg-pill" data-provider="AMAZON">Amazon</button>
                    <div class="ldg-filter-divider"></div>
                    <span class="ldg-filter-label">Period</span>
                    <button class="ldg-pill active" data-time="all">ALL</button>
                    <button class="ldg-pill" data-time="24h">24h</button>
                    <button class="ldg-pill" data-time="7d">7D</button>
                    <button class="ldg-pill" data-time="30d">30D</button>
                    <span class="ldg-sort-inline">SORT:
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
                                <th>Type</th>
                                <th>Contract</th>
                                <th>Platform</th>
                                <th>Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody id="ldg-list">
                            <tr class="ldg-skeleton-row"><td colspan="6"></td></tr>
                            <tr class="ldg-skeleton-row"><td colspan="6"></td></tr>
                            <tr class="ldg-skeleton-row"><td colspan="6"></td></tr>
                            <tr class="ldg-skeleton-row"><td colspan="6"></td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="ldg-pagination" id="ldg-pagination">
                    <div class="ldg-page-info" id="ldg-page-info">Showing 0 records</div>
                    <div class="ldg-page-btns" id="ldg-page-btns"></div>
                </div>
            </div>

            <!-- Footer -->
            <div class="ldg-footer" data-reveal>
                <div class="ldg-footer-inner">
                    <div class="ldg-footer-left">
                        <span class="ldg-footer-label">System Status</span>
                        <span class="ldg-footer-sep">&mdash;</span>
                        <div class="ldg-footer-live">
                            <div class="ldg-footer-dot"></div>
                            <span class="ldg-footer-text">Operational</span>
                        </div>
                    </div>
                    <div class="ldg-footer-count" id="ldg-record-count">
                        0 Records
                    </div>
                </div>
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
    let currentPage = 1;
    const perPage = 15;

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
        if (!type) return '—';
        // Clean up RIVALRY_ prefix for display
        const cleaned = type.replace(/^RIVALRY_/, '');
        return cleaned.replace(/_/g, ' ');
    }

    function getEventCategory(type) {
        if (['FUNDS_LOCKED', 'EXECUTION_CONFIRMED', 'FUNDS_AUTHORIZED', 'CONTRACT_CREATED', 'BASELINE_SNAPSHOTTED'].includes(type)) return 'execution';
        if (['SETTLED_SUCCESS', 'SETTLEMENT_STARTED', 'SETTLEMENT_COMPLETE', 'RIVALRY_SETTLED', 'RIVALRY_DRAW', 'RIVALRY_SETTLEMENT_STARTED'].includes(type)) return 'settlement';
        if (['SETTLED_FAILURE', 'VERIFICATION_FAILED', 'RIVALRY_EXPIRED', 'RIVALRY_CANCELLED'].includes(type)) return 'failure';
        if (['FEE_COLLECTED'].includes(type)) return 'fee';
        if (['RIVALRY_CREATED', 'RIVALRY_ACCEPTED', 'RIVALRY_BOTH_FUNDED', 'RIVALRY_ACTIVATED', 'RIVALRY_CHALLENGER_FUNDED', 'RIVALRY_OPPONENT_FUNDED', 'RIVALRY_VERIFIED', 'RIVALRY_VERIFICATION_STARTED'].includes(type)) return 'execution';
        return 'execution';
    }

    function getStatusClass(type) {
        if (type.includes('SETTLED_SUCCESS') || type.includes('SETTLEMENT') || type.includes('VERIFICATION_SUCCEEDED') || type === 'RIVALRY_SETTLED' || type === 'RIVALRY_DRAW') return 'settlement';
        if (type.includes('SETTLED_FAILURE') || type.includes('VERIFICATION_FAILED') || type === 'RIVALRY_EXPIRED' || type === 'RIVALRY_CANCELLED') return 'failure';
        if (type.includes('FEE')) return 'fee';
        if (type.includes('LOCKED') || type === 'RIVALRY_BOTH_FUNDED' || type === 'RIVALRY_CHALLENGER_FUNDED' || type === 'RIVALRY_OPPONENT_FUNDED') return 'locked';
        if (type.includes('EXECUTION_CONFIRMED') || type === 'RIVALRY_ACTIVATED') return 'execution';
        if (type === 'RIVALRY_CREATED' || type === 'RIVALRY_ACCEPTED') return 'pending';
        return 'execution';
    }

    function getTagColor(type) {
        if (type.includes('SETTLED_SUCCESS') || type.includes('SETTLEMENT') || type.includes('VERIFICATION_SUCCEEDED') || type === 'RIVALRY_SETTLED' || type === 'RIVALRY_DRAW') return '#16a34a';
        if (type.includes('SETTLED_FAILURE') || type.includes('VERIFICATION_FAILED') || type === 'RIVALRY_EXPIRED' || type === 'RIVALRY_CANCELLED') return '#752122';
        if (type.includes('FEE')) return '#92400e';
        if (type.includes('LOCKED') || type.includes('EXECUTION_CONFIRMED') || type.includes('RIVALRY_ACTIVATED') || type.includes('RIVALRY_BOTH_FUNDED')) return '#111';
        if (type.includes('RIVALRY_CREATED') || type.includes('RIVALRY_ACCEPTED')) return '#752122';
        return '#666';
    }

    function getStatusPill(type) {
        if (type.includes('SETTLED_SUCCESS') || type.includes('SETTLEMENT') || type.includes('VERIFICATION_SUCCEEDED')) return '<span class="ldg-status settled">SETTLED</span>';
        if (type === 'RIVALRY_SETTLED') return '<span class="ldg-status settled">RIVALRY SETTLED</span>';
        if (type === 'RIVALRY_DRAW') return '<span class="ldg-status settled">RIVALRY DRAW</span>';
        if (type.includes('SETTLED_FAILURE') || type.includes('VERIFICATION_FAILED')) return '<span class="ldg-status failed">FAILED</span>';
        if (type === 'RIVALRY_EXPIRED') return '<span class="ldg-status failed">EXPIRED</span>';
        if (type === 'RIVALRY_CANCELLED') return '<span class="ldg-status failed">CANCELLED</span>';
        if (type.includes('LOCKED') || type.includes('EXECUTION_CONFIRMED')) return '<span class="ldg-status locked">LOCKED</span>';
        if (type === 'RIVALRY_BOTH_FUNDED') return '<span class="ldg-status locked">FUNDED</span>';
        if (type === 'RIVALRY_ACTIVATED') return '<span class="ldg-status locked">ACTIVE</span>';
        if (type.includes('FEE')) return '<span class="ldg-status fee">FEE</span>';
        if (type.includes('AUTHORIZED') || type.includes('CREATED')) return '<span class="ldg-status pending">PENDING</span>';
        if (type === 'RIVALRY_CREATED') return '<span class="ldg-status pending">CHALLENGE ISSUED</span>';
        if (type === 'RIVALRY_ACCEPTED') return '<span class="ldg-status pending">ACCEPTED</span>';
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
        if (event.platform) return event.platform;
        const meta = event.metadataJson || event.metadata || {};
        if (meta.platform) return meta.platform;
        if (meta.provider) return meta.provider;
        return '';
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
                (e.eventType && e.eventType.toLowerCase().includes(q)) ||
                (e.principal && e.principal.toLowerCase().includes(q)) ||
                (e.platform && e.platform.toLowerCase().includes(q))
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

    // ── Pagination ──
    function renderPagination(totalItems) {
        const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
        const pageInfo = document.getElementById('ldg-page-info');
        const pageBtns = document.getElementById('ldg-page-btns');

        const start = (currentPage - 1) * perPage + 1;
        const end = Math.min(currentPage * perPage, totalItems);

        if (pageInfo) pageInfo.textContent = totalItems > 0 ? `Showing ${start}-${end} of ${totalItems}` : 'No records';

        if (pageBtns && totalPages > 1) {
            let html = '';
            // Previous
            html += `<button class="ldg-page-btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>&lt;</button>`;

            for (let i = 1; i <= totalPages; i++) {
                if (totalPages > 7 && i > 3 && i < totalPages - 1 && Math.abs(i - currentPage) > 1) {
                    if (i === 4) html += `<button class="ldg-page-btn" disabled>…</button>`;
                    continue;
                }
                html += `<button class="ldg-page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }

            // Next
            html += `<button class="ldg-page-btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>`;

            pageBtns.innerHTML = html;

            pageBtns.querySelectorAll('.ldg-page-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.dataset.page;
                    if (val === 'prev' && currentPage > 1) currentPage--;
                    else if (val === 'next' && currentPage < totalPages) currentPage++;
                    else if (!isNaN(val)) currentPage = parseInt(val);
                    renderEvents();
                });
            });
        } else if (pageBtns) {
            pageBtns.innerHTML = '';
        }
    }

    // ── Render Events — Table Rows ──
    function renderEvents() {
        const filtered = filterEvents();
        const totalItems = filtered.length;

        // Paginate
        const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
        if (currentPage > totalPages) currentPage = totalPages;
        const pageItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

        // Update record count in footer
        const countEl = document.getElementById('ldg-record-count');
        if (countEl) {
            countEl.innerHTML = `${totalItems} Records` +
                (totalItems > 0 ? `<span class="ldg-count-badge">Showing ${pageItems.length} records</span>` : '');
        }

        renderPagination(totalItems);

        if (pageItems.length === 0) {
            list.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="ldg-empty">
                            <div class="ldg-empty-lbl">No Records</div>
                            <div class="ldg-empty-text">No events match your current filter set.</div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        list.innerHTML = pageItems.map((event, i) => {
            const globalIdx = (currentPage - 1) * perPage + i;
            const isRivalry = event.sourceType === 'RIVALRY' || (event.eventType || '').startsWith('RIVALRY_');
            const contractShort = event.contractId
                ? (isRivalry ? 'RVL-' : 'RCPT-') + event.contractId.slice(0, 4).toUpperCase()
                : '—';
            const contractLink = event.contractId
                ? (isRivalry ? `#/rivalry/${event.contractId}` : `#/contracts/${event.contractId}`)
                : '#';
            const statusClass = getStatusClass(event.eventType);
            const platform = event.platform || '—';

            const typeBadge = isRivalry
                ? '<span style="font-family:\'Inter\',monospace;font-size:9px;font-weight:700;letter-spacing:0.08em;padding:3px 8px;background:#fef2f2;color:#752122;border:1px solid #fecaca;">RIVALRY</span>'
                : '<span style="font-family:\'Inter\',monospace;font-size:9px;font-weight:700;letter-spacing:0.08em;padding:3px 8px;background:#f5f5f5;color:#666;border:1px solid #e0e0e0;">SOLO</span>';

            return `
                <tr data-index="${globalIdx}">
                    <td>
                        <div class="ldg-status-cell">
                            <div class="ldg-status-dot ${statusClass}"></div>
                            <span class="ldg-status-text ${statusClass}">${formatEventType(event.eventType)}</span>
                        </div>
                    </td>
                    <td>${typeBadge}</td>
                    <td><a href="${contractLink}" class="ldg-rcpt" style="text-decoration:none;color:#111;" onclick="event.stopPropagation()">${contractShort}</a></td>
                    <td><span class="ldg-platform">${platform}</span></td>
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
            ? ((event.sourceType === 'RIVALRY' || (event.eventType || '').startsWith('RIVALRY_')) ? 'RVL-' : 'RCPT-') + event.contractId.slice(0, 4).toUpperCase()
            : '—';
        const isRivalry = event.sourceType === 'RIVALRY' || (event.eventType || '').startsWith('RIVALRY_');
        const viewLink = isRivalry
            ? `<a class="ldg-drawer-link" style="margin-left:8px;" onclick="window.router.navigate('/rivalry/${event.contractId}')">VIEW →</a>`
            : `<a class="ldg-drawer-link" style="margin-left:8px;" onclick="window.router.navigate('/contracts/${event.contractId}')">VIEW →</a>`;

        body.innerHTML = `
            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Event Type</span>
                <span class="ldg-drawer-value" style="color: ${getTagColor(event.eventType)}; font-weight: 700; font-family: 'Inter', monospace; font-size:11px;">
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
                    ${event.contractId ? viewLink : ''}
                </span>
            </div>
            <div class="ldg-drawer-row">
                <span class="ldg-drawer-label">Amount</span>
                <span class="ldg-drawer-value" style="font-family:'Inter',monospace; font-size:18px; font-weight:700; letter-spacing:-0.5px;">
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

        if (activeEl) activeEl.textContent = allEvents.length.toString();

        // Settled amount
        const settledCents = allEvents
            .filter(e => e.amountUsdCents && (e.eventType?.includes('SETTLED') || e.eventType?.includes('SETTLEMENT')))
            .reduce((sum, e) => sum + (e.amountUsdCents || 0), 0);
        if (volumeEl) volumeEl.textContent = formatCurrency(settledCents);
    }

    // ── CSV Export ──
    function exportCSV() {
        const filtered = filterEvents();
        if (filtered.length === 0) return;

        const headers = ['Event Type', 'Receipt', 'Hash', 'Date', 'Amount (USD)'];
        const rows = filtered.map(e => [
            e.eventType || '',
            e.contractId ? 'RCPT-' + e.contractId.slice(0, 4).toUpperCase() : '',
            e.eventHash || '',
            e.timestamp || '',
            e.amountUsdCents ? (e.amountUsdCents / 100).toFixed(2) : ''
        ]);

        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ledger-export-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ── Event Wiring ──
    document.getElementById('ldg-tabs')?.addEventListener('click', (e) => {
        const tab = e.target.closest('.ldg-tab');
        if (!tab) return;
        document.querySelectorAll('.ldg-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab.dataset.filter;
        currentPage = 1;
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
        currentPage = 1;
        renderEvents();
    });

    const searchInput = document.getElementById('ldg-search');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuery = searchInput.value.trim();
                currentPage = 1;
                renderEvents();
            }, 200);
        });
    }

    const sortSelect = document.getElementById('ldg-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortBy = sortSelect.value;
            currentPage = 1;
            renderEvents();
        });
    }

    document.getElementById('ldg-csv-btn')?.addEventListener('click', exportCSV);
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
            <tr>
                <td colspan="6">
                    <div class="ldg-empty">
                        <div class="ldg-empty-lbl">LEDGER UNAVAILABLE</div>
                        <div class="ldg-empty-text">System synchronizing. Records will appear shortly.</div>
                    </div>
                </td>
            </tr>
        `;
    }

    if (window.lucide) window.lucide.createIcons();

    // ── Auto-Refresh (30s polling) ──
    if (window._ledgerPollId) clearInterval(window._ledgerPollId);
    window._ledgerPollId = setInterval(async () => {
        try {
            const el = document.getElementById('ldg-list');
            if (!el) { clearInterval(window._ledgerPollId); return; }
            const response = await window.api.getPublicLedger();
            const newEvents = response?.events || [];
            if (newEvents.length !== allEvents.length) {
                allEvents = newEvents;
                updateStats();
                renderEvents();
                console.log('[Ledger] Auto-refreshed:', allEvents.length, 'events');
            }
        } catch (e) { /* silent retry */ }
    }, 30000);
}
