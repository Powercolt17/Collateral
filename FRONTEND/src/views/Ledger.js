// PUBLIC LEDGER — Append-only record of executions and settlements
// Institutional Document System Alignment (Paper #F7F4ED, Plates #FFFDF9, Segmented Sort, Dark Ink Pills #0E1420)

import { collateralFullLoader } from '../components/CollateralLoader.js';

export function renderLedger() {
    return `
        <style>
            :root {
              --paper: #F7F4ED;
              --paper-alt: #EFEAE0;
              --paper-deep: #E7E1D4;
              --plate: #FFFDF9;
              --notch: #F7F4ED;
              --ink: #0E1420;
              --ink-2: #4A5464;
              --ink-3: #6E7686;
              --ink-4: #9AA0AC;
              --blood: #7A1C29;
              --blood-deep: #54111B;
              --blood-mid: #9B3341;
              --blood-tint: #F5E6E8;
              --blood-wash: #FBF3F4;
              --win: #186B4A;
              --win-tint: #E6F1EA;
              --win-wash: #F2F8F4;
              --gilt: #A8854E;
              --rule: #DCD5C6;
              --rule-soft: #EAE4D8;
              --rule-strong: #BDB3A0;
              --display: "Archivo", system-ui, sans-serif;
              --wordmark: "Archivo", system-ui, sans-serif;
              --body: "Public Sans", system-ui, sans-serif;
              --mono: "IBM Plex Mono", ui-monospace, monospace;
              --r: 2px;
              --lift: 0 1px 2px rgba(14,20,32,.04), 0 12px 28px -18px rgba(14,20,32,.22);
            }

            .ldg {
                background: var(--paper, #F7F4ED);
                min-height: 100vh;
                font-family: var(--body, 'Public Sans', sans-serif);
                color: var(--ink, #0E1420);
                padding-bottom: 100px;
                position: relative;
                font-variant-numeric: tabular-nums;
            }

            /* Fixed Grain Overlay */
            .cl-grain {
                position: fixed;
                inset: 0;
                pointer-events: none;
                z-index: 9999;
                opacity: .035;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            }

            /* Clerical Mono Label Utility */
            .mono-lbl {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                letter-spacing: .16em;
                text-transform: uppercase;
                color: var(--ink-3, #6E7686);
            }

            /* ── Header Section ── */
            .ldg-header-inner {
                max-width: 1300px;
                margin: 0 auto;
                padding: 60px 32px 24px;
            }
            .ldg-hero-title {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 40px;
                font-weight: 700;
                letter-spacing: -.026em;
                color: var(--ink, #0E1420);
                margin: 0;
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .ldg-hero-title strong { font-weight: 800; color: var(--blood, #7A1C29); }

            .ldg-synced-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 9.5px;
                font-weight: 700;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                color: var(--win, #186B4A);
                background: rgba(24, 107, 74, 0.08);
                border: 1px solid rgba(24, 107, 74, 0.2);
                border-radius: var(--r, 2px);
                padding: 4px 10px;
            }
            .ldg-synced-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--win, #186B4A);
                animation: ldg-pulse 2s infinite;
            }
            @keyframes ldg-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }

            .ldg-hero-desc {
                font-size: 14px;
                color: var(--ink-2, #4A5464);
                margin-top: 12px;
                line-height: 1.6;
                max-width: 520px;
            }

            /* Reconciled Stat Strip (Order Aligned with Market Page: Value -> Label) */
            .ldg-stats-strip {
                display: flex;
                gap: 64px;
                margin: 32px 0 0;
                padding: 20px 32px;
                background: var(--plate, #FFFDF9);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                box-shadow: var(--lift);
                max-width: 1300px;
            }
            .ldg-stat-group { display: flex; flex-direction: column; gap: 6px; }
            .ldg-stat-value {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 30px;
                font-weight: 700;
                letter-spacing: -.026em;
                color: var(--ink, #0E1420);
                font-variant-numeric: tabular-nums;
                line-height: 1;
            }
            .ldg-stat-label {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                text-transform: uppercase;
                letter-spacing: .16em;
                color: var(--ink-3, #6E7686);
            }

            /* ── Content Area ── */
            .ldg-content {
                max-width: 1300px;
                margin: 0 auto;
                padding: 0 32px 48px;
                width: 100%;
                box-sizing: border-box;
            }

            /* ── Controls & Tabs Row ── */
            .ldg-controls-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid var(--rule, #DCD5C6);
                padding-bottom: 12px;
                margin-top: 24px;
            }
            .ldg-tabs {
                display: flex;
                align-items: center;
                gap: 24px;
            }
            .ldg-tab {
                padding: 8px 0;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                font-weight: 700;
                color: var(--ink-3, #6E7686);
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: .16em;
                transition: all 0.2s ease;
            }
            .ldg-tab:hover { color: var(--ink, #0E1420); }
            .ldg-tab.active {
                color: var(--ink, #0E1420) !important;
                border-bottom-color: var(--blood, #7A1C29) !important;
            }

            .ldg-controls-right {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .ldg-search {
                background: var(--plate, #FFFDF9);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                padding: 8px 14px;
                font-size: 13px;
                width: 220px;
                font-family: var(--body, 'Public Sans', sans-serif);
                color: var(--ink, #0E1420);
                transition: border-color 0.2s ease;
            }
            .ldg-search:focus {
                outline: none;
                border-color: var(--ink, #0E1420);
            }

            .ldg-csv-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 14px;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                font-weight: 700;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                color: var(--ink-2, #4A5464);
                background: var(--plate, #FFFDF9);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .ldg-csv-btn:hover { border-color: var(--ink, #0E1420); color: var(--ink, #0E1420); }

            /* ── Filter Bar & Dark Ink Pills (#0E1420) ── */
            .ldg-filters-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 0;
                border-bottom: 1px solid var(--rule, #DCD5C6);
                flex-wrap: wrap;
                gap: 16px;
            }
            .ldg-pills-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ldg .ldg-pill,
            .ldg button.ldg-pill {
                padding: 6px 14px;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                font-weight: 600;
                letter-spacing: .12em;
                text-transform: uppercase;
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                background: var(--plate, #FFFDF9);
                cursor: pointer;
                color: var(--ink-2, #4A5464);
                transition: all 0.2s ease;
            }
            /* Dark Ink Pills (#0E1420, ZERO pure black) */
            .ldg .ldg-pill.active,
            .ldg button.ldg-pill.active {
                background: #0E1420 !important;
                color: #FFFDF9 !important;
                border-color: #0E1420 !important;
            }
            .ldg .ldg-pill:hover:not(.active) {
                border-color: var(--ink-3, #6E7686);
                color: var(--ink, #0E1420);
            }

            /* ── Table Plate & Dotted Separators ── */
            .ldg-table-wrap {
                margin-top: 24px;
                background: var(--plate, #FFFDF9);
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                box-shadow: var(--lift);
                overflow: hidden;
            }
            .ldg-table {
                width: 100%;
                border-collapse: collapse;
            }
            .ldg-table thead th {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10.5px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.16em;
                color: var(--ink-3, #6E7686);
                background: var(--paper-alt, #EFEAE0);
                padding: 14px 20px;
                border-bottom: 1px solid var(--rule, #DCD5C6);
                text-align: left;
            }
            .ldg-table thead th:last-child {
                text-align: right;
            }
            .ldg-table tbody tr {
                border-bottom: 1px dotted var(--rule, #DCD5C6) !important;
                cursor: pointer;
                transition: background 0.15s ease;
            }
            .ldg-table tbody tr:last-child {
                border-bottom: none !important;
            }
            .ldg-table tbody tr:hover {
                background: rgba(122, 28, 41, 0.02);
            }
            .ldg-table td {
                padding: 14px 20px;
                font-size: 13px;
                color: var(--ink, #0E1420);
                font-variant-numeric: tabular-nums;
            }

            /* Responsive */
            @media (max-width: 1024px) {
                .ldg-stats-strip { gap: 32px; flex-wrap: wrap; }
                .ldg-controls-row { flex-direction: column; align-items: flex-start; gap: 16px; }
            }
            @media (max-width: 768px) {
                .ldg-filters-row { flex-direction: column; align-items: flex-start; }
            }
        </style>

        <div class="cl-grain" aria-hidden="true"></div>

        <div class="ldg">
            <div class="ldg-header-inner" data-reveal>
                <div class="ldg-hero-title">
                    Public <strong>Ledger.</strong>
                    <div class="ldg-synced-badge">
                        <div class="ldg-synced-dot"></div>
                        SYNCED
                    </div>
                </div>
                <!-- Item 4: Verified by platform APIs (Removed "Verified on-chain") -->
                <div class="ldg-hero-desc">
                    Append-only record of all contract commitments, oracle verifications, and capital settlements. USD contracts custodied via Stripe Connect; CLTR contracts verified on Robinhood Chain.
                </div>

                <!-- Reconciled Stat Strip -->
                <div class="ldg-stats-strip">
                    <div class="ldg-stat-group">
                        <div class="ldg-stat-value" id="stat-total-volume">$1,000</div>
                        <div class="ldg-stat-label">TOTAL VOLUME</div>
                    </div>
                    <div class="ldg-stat-group">
                        <div class="ldg-stat-value" id="stat-total-events">2</div>
                        <div class="ldg-stat-label">TOTAL SETTLEMENTS</div>
                    </div>
                    <div class="ldg-stat-group">
                        <div class="ldg-stat-value" id="stat-settled-rate">100%</div>
                        <div class="ldg-stat-label">SETTLEMENT RATE</div>
                    </div>
                </div>
            </div>

            <div class="ldg-content">
                <!-- Controls Row -->
                <div class="ldg-controls-row">
                    <div class="ldg-tabs" id="ldg-tabs">
                        <button class="ldg-tab active" data-tab="all">ALL TRANSACTIONS</button>
                        <button class="ldg-tab" data-tab="settled">SETTLED</button>
                        <button class="ldg-tab" data-tab="active">ACTIVE</button>
                    </div>
                    <div class="ldg-controls-right">
                        <input type="text" class="ldg-search" id="ldg-search" placeholder="Search hash, user, metric...">
                        <button class="ldg-csv-btn" id="btn-export-csv">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export CSV
                        </button>
                    </div>
                </div>

                <!-- Filters Bar & Dark Ink Pills (#0E1420) -->
                <div class="ldg-filters-row">
                    <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                        <div class="ldg-pills-group" id="platform-filters">
                            <span class="mono-lbl">PLATFORM</span>
                            <button class="ldg-pill active" data-platform="all">ALL</button>
                            <button class="ldg-pill" data-platform="stripe">STRIPE</button>
                            <button class="ldg-pill" data-platform="shopify">SHOPIFY</button>
                            <button class="ldg-pill" data-platform="x">X</button>
                            <button class="ldg-pill" data-platform="youtube">YOUTUBE</button>
                        </div>
                        <div class="ldg-pills-group" id="period-filters">
                            <span class="mono-lbl">PERIOD</span>
                            <button class="ldg-pill active" data-period="all">ALL</button>
                            <button class="ldg-pill" data-period="24h">24H</button>
                            <button class="ldg-pill" data-period="7d">7D</button>
                            <button class="ldg-pill" data-period="30d">30D</button>
                        </div>
                    </div>

                    <!-- Item 2: Segmented Control replacing native <select> -->
                    <div class="ldg-pills-group" id="sort-filters">
                        <span class="mono-lbl">SORT</span>
                        <button class="ldg-pill active" data-sort="newest">NEWEST</button>
                        <button class="ldg-pill" data-sort="oldest">OLDEST</button>
                        <button class="ldg-pill" data-sort="amount">HIGHEST</button>
                    </div>
                </div>

                <!-- Table Plate -->
                <div class="ldg-table-wrap">
                    <table class="ldg-table">
                        <thead>
                            <tr>
                                <th>TRANSACTION / CONTRACT ID</th>
                                <th>OPERATOR</th>
                                <th>METRIC TARGET</th>
                                <th>VERIFICATION SOURCE</th>
                                <th>STAKE AMOUNT</th>
                                <th>STATE</th>
                                <th>SETTLEMENT TIME</th>
                            </tr>
                        </thead>
                        <tbody id="ldg-rows">
                            <!-- Rows rendered dynamically -->
                        </tbody>
                    </table>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
                    <span class="mono-lbl" id="ldg-showing-count">SHOWING 1-2 OF 2</span>
                </div>
            </div>
        </div>
    `;
}

export function initLedger() {
    const rowsEl = document.getElementById('ldg-rows');
    if (!rowsEl) return;

    const mockEvents = [
        {
            id: 'RVL-34D6-991A',
            contract: 'Order Volume Growth (30d)',
            operator: '@northloop',
            source: 'Shopify API',
            amount: 1000, rail: 'USD', state: 'SETTLED',
            time: '12m ago'
        },
        {
            id: 'RVL-8812-442B',
            contract: 'Monthly Recurring Revenue (30d)',
            operator: '@vance_cap',
            source: 'Stripe API',
            amount: 2500, rail: 'CLTR', state: 'ACTIVE',
            time: '1h ago'
        }
    ];

    function renderRows(events) {
        rowsEl.innerHTML = '';
        events.forEach(e => {
            const tr = document.createElement('tr');
            // Item 6: Neutral Ink state badge for ACTIVE (not oxblood loss state)
            const stateColor = e.state === 'SETTLED' ? 'var(--win, #186B4A)' : 'var(--ink-2, #4A5464)';
            const stateBg = e.state === 'SETTLED' ? 'rgba(24, 107, 74, 0.08)' : 'var(--paper-alt, #EFEAE0)';
            const stateBorder = e.state === 'SETTLED' ? 'rgba(24, 107, 74, 0.2)' : 'var(--rule, #DCD5C6)';

            tr.innerHTML = `
                <td style="font-family: var(--mono, 'IBM Plex Mono', monospace); font-weight: 700;">${e.id}</td>
                <td>${e.operator}</td>
                <td>${e.contract}</td>
                <td><span class="mono-lbl">${e.source.toUpperCase()}</span> <span style="font-family: var(--mono, 'IBM Plex Mono', monospace); font-size: 9px; font-weight: 700; background: var(--paper-alt, #EFEAE0); border: 1px solid var(--rule, #DCD5C6); padding: 2px 5px; border-radius: 2px; margin-left: 6px; color: var(--ink-2, #4A5464);">${e.rail || 'USD'}</span></td>
                <td style="font-family: var(--display, 'Archivo', sans-serif); font-weight: 700;">$${e.amount.toLocaleString()}</td>
                <td><span style="font-family: var(--mono, 'IBM Plex Mono', monospace); font-size: 9.5px; font-weight: 700; color: ${stateColor}; background: ${stateBg}; border: 1px solid ${stateBorder}; padding: 3px 8px; border-radius: 2px; text-transform: uppercase;">${e.state}</span></td>
                <td style="text-align: right; font-family: var(--mono, 'IBM Plex Mono', monospace); color: var(--ink-3, #6E7686);">${e.time}</td>
            `;
            rowsEl.appendChild(tr);
        });
    }

    // Segmented Sort Listener
    const sortContainer = document.getElementById('sort-filters');
    if (sortContainer) {
        sortContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.ldg-pill');
            if (!btn) return;
            sortContainer.querySelectorAll('.ldg-pill').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
        });
    }

    renderRows(mockEvents);
}
