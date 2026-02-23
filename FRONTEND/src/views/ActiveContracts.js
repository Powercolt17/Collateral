// ActiveContracts.js — Institutional Contract Hub
// Capital infrastructure. Not SaaS dashboard.

export function renderActiveContracts() {
    return `
        <style>
            /* ===== ACTIVE CONTRACTS — CLEARINGHOUSE GRADE ===== */
            .act {
                background: #F2F2F2;
                min-height: calc(100vh - 72px);
                font-family: 'IBM Plex Sans', -apple-system, sans-serif;
                color: #111;
            }

            .act-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 40px;
            }

            /* ── Top Block (white) ── */
            .act-top {
                background: #fff;
                border-bottom: 1px solid #DADADA;
            }

            /* Layer 1: Title */
            .act-page-hdr {
                padding: 20px 0 0;
            }
            .act-page-title {
                font-size: 18px;
                font-weight: 600;
                letter-spacing: -0.3px;
                color: #111;
                margin: 0;
            }
            .act-page-sub {
                font-size: 12px;
                color: #888;
                margin: 4px 0 0;
                font-family: 'IBM Plex Mono', monospace;
            }

            /* Layer 2: Metrics Strip */
            .act-metrics {
                padding: 20px 0;
                border-bottom: 1px solid #ECECEC;
            }
            .act-metrics-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0;
            }
            .act-metric {
                text-align: center;
                padding: 0 32px;
                border-right: 1px solid #ECECEC;
            }
            .act-metric:last-child { border-right: none; }
            .act-metric-value {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 26px;
                font-weight: 700;
                color: #111;
                letter-spacing: -0.5px;
                line-height: 1.2;
                margin-bottom: 6px;
            }
            .act-metric-label {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #777;
            }

            /* ── Feed ── */
            .act-feed {
                padding: 24px 0 60px;
            }

            /* ── Contract Cards ── */
            .act-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .act-card {
                background: #fff;
                border: 1px solid #DADADA;
                border-radius: 4px;
                padding: 10px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: border-color 0.12s, box-shadow 0.12s, transform 0.15s;
                cursor: pointer;
                text-decoration: none;
                color: inherit;
                position: relative;
            }
            .act-card:hover {
                border-color: #C8C8C8;
                box-shadow: 0 1px 4px rgba(0,0,0,0.04);
                transform: translateY(-1px);
            }
            .act-card::before {
                content: '';
                position: absolute;
                top: 4px; bottom: 4px; left: 0;
                width: 3px;
                border-radius: 0 2px 2px 0;
                background: transparent;
                transition: background 0.1s;
            }
            .act-card:hover::before { background: #921818; }

            .act-card-left {
                display: flex;
                align-items: center;
                gap: 16px;
                flex: 1;
                min-width: 0;
            }

            .act-card-icon {
                width: 36px;
                height: 36px;
                background: #EFEFEF;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                flex-shrink: 0;
            }
            .act-card-icon svg { width: 16px; height: 16px; }

            .act-card-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
                min-width: 0;
            }
            .act-card-platform {
                font-size: 13px;
                font-weight: 700;
                color: #111;
            }
            .act-card-id {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #999;
                letter-spacing: 0.5px;
            }

            /* Center: Risk + Status */
            .act-card-center {
                display: flex;
                align-items: center;
                gap: 12px;
                flex-shrink: 0;
            }

            .act-risk-badge {
                display: inline-block;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 3px 8px;
                background: #EFEFEF;
                color: #555;
                border-radius: 3px;
            }

            .act-status-badge {
                display: inline-block;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 3px 8px;
                border-radius: 3px;
            }
            .act-status-active { background: #f0fdf4; color: #166534; }
            .act-status-pending { background: #fffbeb; color: #92400e; }
            .act-status-executed { background: #eff6ff; color: #1e40af; }
            .act-status-locked { background: #f5f5f5; color: #666; }

            /* Right: Capital */
            .act-card-right {
                text-align: right;
                display: flex;
                flex-direction: column;
                gap: 2px;
                flex-shrink: 0;
                padding-left: 24px;
            }
            .act-card-amount {
                font-size: 24px;
                font-weight: 700;
                color: #111;
                font-family: 'IBM Plex Mono', monospace;
                letter-spacing: -0.5px;
                line-height: 1;
            }
            .act-card-payout {
                font-size: 13px;
                font-weight: 600;
                color: #166534;
                font-family: 'IBM Plex Mono', monospace;
                letter-spacing: -0.3px;
            }

            /* ── Empty State ── */
            .act-empty {
                text-align: center;
                padding: 60px 40px;
            }
            .act-empty-title {
                font-size: 12px;
                font-weight: 700;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-family: 'IBM Plex Mono', monospace;
                margin: 0 0 16px;
            }
            .act-empty-btn {
                padding: 10px 24px;
                background: #111;
                color: #fff;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.12s;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .act-empty-btn:hover { background: #921818; }

            /* ── Loading ── */
            .act-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 80px 0;
                gap: 16px;
            }
            .act-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid #eee;
                border-top-color: #921818;
                border-radius: 50%;
                animation: act-spin 0.8s linear infinite;
            }
            @keyframes act-spin { to { transform: rotate(360deg); } }
            .act-loading-text {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            /* ── Responsive ── */
            @media (max-width: 640px) {
                .act-container { padding: 0 16px; }
                .act-page-hdr { padding: 16px 0 0; }
                .act-metrics { padding: 16px 0; }
                .act-metrics-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px 0;
                }
                .act-card {
                    flex-direction: column;
                    align-items: stretch;
                    padding: 14px 16px;
                    gap: 10px;
                }
                .act-card-center { justify-content: flex-start; }
                .act-card-right {
                    text-align: left;
                    padding-left: 0;
                    flex-direction: row;
                    align-items: baseline;
                    gap: 10px;
                }
                .act-card-amount { font-size: 20px; }
            }
        </style>

        <div class="act">
            <div class="act-top">
                <!-- Layer 1: Title -->
                <div class="act-page-hdr">
                    <div class="act-container">
                        <h1 class="act-page-title">CONTRACTS</h1>
                        <p class="act-page-sub">Active positions and performance monitors</p>
                    </div>
                </div>

                <!-- Layer 2: Metrics -->
                <div class="act-metrics">
                    <div class="act-container">
                        <div class="act-metrics-grid">
                            <div class="act-metric">
                                <div class="act-metric-value" id="act-deployed">—</div>
                                <div class="act-metric-label">Deployed Capital</div>
                            </div>
                            <div class="act-metric">
                                <div class="act-metric-value" id="act-active-count">—</div>
                                <div class="act-metric-label">Active Contracts</div>
                            </div>
                            <div class="act-metric">
                                <div class="act-metric-value" id="act-payout-total">—</div>
                                <div class="act-metric-label">Potential Payout</div>
                            </div>
                            <div class="act-metric">
                                <div class="act-metric-value" id="act-avg-risk">—</div>
                                <div class="act-metric-label">Avg Risk Tier</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Feed -->
            <div class="act-feed">
                <div class="act-container">
                    <div id="act-content">
                        <div class="act-loading">
                            <div class="act-spinner"></div>
                            <p class="act-loading-text">Retrieving ledger state...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function initActiveContracts() {
    const container = document.getElementById('act-content');
    if (!container) return;

    try {
        const response = await window.api.getContracts();
        const contracts = response?.contracts || [];

        // Filter for active/meaningful contracts
        const activeStates = ['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED', 'CREATED', 'FUNDS_AUTHORIZED'];
        const activeContracts = contracts.filter(c => activeStates.includes(c.derivedState || c.state));

        // Hydrate summary strip
        hydrateSummary(activeContracts);

        if (activeContracts.length === 0) {
            renderEmptyState(container);
        } else {
            renderContractList(container, activeContracts);
        }

    } catch (err) {
        console.error('[ActiveContracts] Load error:', err);
        container.innerHTML = `
            <div style="text-align:center; padding: 40px; color: #752122; font-family: 'IBM Plex Mono', monospace; font-size: 12px;">
                ERROR_RETRIEVING_CONTRACT_STATE: ${err.message}
            </div>
        `;
    }

    if (window.lucide) window.lucide.createIcons();
}

function hydrateSummary(contracts) {
    const deployedEl = document.getElementById('act-deployed');
    const activeEl = document.getElementById('act-active-count');
    const payoutEl = document.getElementById('act-payout-total');
    const riskEl = document.getElementById('act-avg-risk');

    if (!deployedEl) return;

    const totalLocked = contracts.reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);
    const totalPayout = contracts.reduce((sum, c) => sum + (c.payoutAmountUsdCents || 0), 0);
    const activeCount = contracts.length;

    // Average risk tier
    const tierMap = { 'CONSERVATIVE': 1, 'STANDARD': 2, 'AGGRESSIVE': 3 };
    const tierLabels = ['—', 'CONSERVATIVE', 'STANDARD', 'AGGRESSIVE'];
    let avgTier = '—';
    if (activeCount > 0) {
        const totalTier = contracts.reduce((sum, c) => sum + (tierMap[c.riskTier?.toUpperCase()] || 2), 0);
        avgTier = tierLabels[Math.round(totalTier / activeCount)] || 'STANDARD';
    }

    deployedEl.textContent = (totalLocked / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
    activeEl.textContent = activeCount.toString();
    payoutEl.textContent = (totalPayout / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
    riskEl.textContent = avgTier;
}

function renderEmptyState(container) {
    container.innerHTML = `
        <div class="act-empty">
            <h2 class="act-empty-title">No Active Capital Deployed</h2>
            <button class="act-empty-btn" onclick="window.router.navigate('/market')">
                BROWSE MARKET
            </button>
        </div>
    `;
}

function renderContractList(container, contracts) {
    contracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const listHtml = contracts.map(c => {
        const platform = c.platform?.toUpperCase() || 'UNKNOWN';
        const amount = (c.lockAmountUsdCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const payout = c.payoutAmountUsdCents ? '+' + (c.payoutAmountUsdCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
        const riskTier = c.riskTier?.toUpperCase() || 'STANDARD';
        const state = c.derivedState || c.state;

        let statusClass = 'act-status-active';
        let statusLabel = 'ACTIVE';

        if (['CREATED', 'FUNDS_AUTHORIZED'].includes(state)) {
            statusClass = 'act-status-pending';
            statusLabel = 'PENDING';
        } else if (state === 'EXECUTION_CONFIRMED') {
            statusClass = 'act-status-executed';
            statusLabel = 'EXECUTED';
        } else if (state === 'LOCKED') {
            statusClass = 'act-status-locked';
            statusLabel = 'LOCKED';
        }

        const icon = getPlatformIcon(c.platform);

        return `
            <a href="#/contracts/${c.id}" class="act-card">
                <div class="act-card-left">
                    <div class="act-card-icon">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="act-card-info">
                        <span class="act-card-platform">${platform} Performance</span>
                        <span class="act-card-id">${c.id.slice(0, 12).toUpperCase()}</span>
                    </div>
                </div>
                <div class="act-card-center">
                    <span class="act-risk-badge">${riskTier}</span>
                    <span class="act-status-badge ${statusClass}">${statusLabel}</span>
                </div>
                <div class="act-card-right">
                    <span class="act-card-amount">${amount}</span>
                    ${payout ? `<span class="act-card-payout">${payout}</span>` : ''}
                </div>
            </a>
        `;
    }).join('');

    container.innerHTML = `<div class="act-list">${listHtml}</div>`;
}

function getPlatformIcon(platform) {
    const map = {
        'twitter': 'twitter',
        'x': 'twitter',
        'stripe': 'credit-card',
        'shopify': 'shopping-bag',
        'amazon': 'package',
        'github': 'github'
    };
    return map[platform?.toLowerCase()] || 'file-text';
}
