// MyContracts.js — Personal Performance Hub
// Matches ActiveContracts.js institutional layout

export function renderMyContracts() {
    return `
        <style>
            .myc {
                background: #fff;
                min-height: calc(100vh - 72px);
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
            }

            /* ── Page Header ── */
            .myc-header {
                padding: 28px 32px 0;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }
            .myc-title-wrap {}
            .myc-page-title {
                font-size: 16px;
                font-weight: 700;
                letter-spacing: 0.5px;
                color: #111;
                margin: 0;
                text-transform: uppercase;
            }
            .myc-page-sub {
                font-size: 11px;
                color: #999;
                margin: 4px 0 0;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .myc-header-actions {
                display: flex;
                gap: 12px;
            }
            .myc-btn-secondary {
                padding: 10px 18px;
                background: #fff;
                border: 1px solid #e5e5e5;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                cursor: pointer;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                transition: border-color 0.1s;
            }
            .myc-btn-secondary:hover { border-color: #aaa; }

            /* ── Metrics Strip ── */
            .myc-metrics {
                display: flex;
                align-items: stretch;
                padding: 20px 32px 24px;
                border-bottom: 1px solid #e5e5e5;
            }
            .myc-metric {
                flex: 1;
                padding: 16px 24px;
                border: 1px solid #e5e5e5;
                border-right: none;
            }
            .myc-metric:last-child { border-right: 1px solid #e5e5e5; }
            .myc-metric-value {
                font-size: 26px;
                font-weight: 700;
                color: #111;
                letter-spacing: -0.5px;
                line-height: 1.2;
                margin-bottom: 4px;
            }
            .myc-metric-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #888;
            }

            /* ── Contract Feed ── */
            .myc-feed { padding: 24px 32px 60px; }
            .myc-list { display: flex; flex-direction: column; }

            .myc-card {
                background: #fafafa;
                border: 1px solid #e5e5e5;
                padding: 16px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: background 0.12s;
                cursor: pointer;
                text-decoration: none;
                color: inherit;
                margin-bottom: -1px;
            }
            .myc-card:first-child { border-radius: 4px 4px 0 0; }
            .myc-card:last-child { border-radius: 0 0 4px 4px; }
            .myc-card:hover { background: #f5f5f5; }

            .myc-card-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
            .myc-card-icon {
                width: 36px; height: 36px;
                background: #e8e8e8; border-radius: 6px;
                display: flex; align-items: center; justify-content: center;
                color: #666; flex-shrink: 0;
            }
            .myc-card-icon svg { width: 16px; height: 16px; }

            .myc-card-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
            .myc-card-platform { font-size: 14px; font-weight: 700; color: #111; }
            .myc-card-id { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #999; }

            .myc-card-center { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
            .myc-status-badge {
                font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700;
                text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px;
                border: 1px solid #ddd; background: #fff; color: #555;
            }

            .myc-card-right { text-align: right; display: flex; flex-direction: column; gap: 2px; padding-left: 24px; }
            .myc-card-amount { font-size: 22px; font-weight: 700; color: #111; letter-spacing: -0.5px; }
            .myc-card-status-text { font-size: 12px; font-weight: 600; font-family: 'JetBrains Mono', monospace; }

            /* Loading & Empty */
            .myc-loading { display: flex; flex-direction: column; align-items: center; padding: 80px 0; gap: 16px; }
            .myc-spinner { width: 20px; height: 20px; border: 2px solid #eee; border-top-color: #752122; border-radius: 50%; animation: myc-spin 0.8s linear infinite; }
            @keyframes myc-spin { to { transform: rotate(360deg); } }
            
            @media (max-width: 768px) {
                .myc-header { padding: 20px 16px 0; flex-direction: column; align-items: flex-start; gap: 16px; }
                .myc-metrics { padding: 16px 16px 20px; flex-wrap: wrap; }
                .myc-metric { min-width: calc(50% - 1px); }
                .myc-feed { padding: 16px 16px 60px; }
                .myc-card { flex-direction: column; align-items: stretch; gap: 10px; }
                .myc-card-right { text-align: left; padding-left: 0; flex-direction: row; align-items: baseline; gap: 10px; }
            }
        </style>

        <div class="myc">
            <div class="myc-header" data-reveal>
                <div class="myc-title-wrap">
                    <h1 class="myc-page-title">MY CONTRACTS</h1>
                    <p class="myc-page-sub">Personalized performance record</p>
                </div>
                <div class="myc-header-actions">
                    <button class="myc-btn-secondary" onclick="window.router.navigate('/profile')">View Identity</button>
                    <button class="myc-btn-secondary" style="background: #111; color: #fff; border: none;" onclick="window.router.navigate('/overview')">New Contract</button>
                </div>
            </div>

            <div class="myc-metrics" data-reveal>
                <div class="myc-metric">
                    <div class="myc-metric-value" id="myc-total-locked">—</div>
                    <div class="myc-metric-label">Total Locked</div>
                </div>
                <div class="myc-metric">
                    <div class="myc-metric-value" id="myc-active-count">—</div>
                    <div class="myc-metric-label">Active Contracts</div>
                </div>
                <div class="myc-metric">
                    <div class="myc-metric-value" id="myc-settle-rate">—</div>
                    <div class="myc-metric-label">Settlement Rate</div>
                </div>
                <div class="myc-metric">
                    <div class="myc-metric-value" id="myc-avg-risk">—</div>
                    <div class="myc-metric-label">Avg Risk Tier</div>
                </div>
            </div>

            <div class="myc-feed" data-reveal>
                <div id="myc-content">
                    <div class="myc-loading">
                        <div class="myc-spinner"></div>
                        <p style="font-family:'JetBrains Mono',monospace; font-size:10px; color:#888; text-transform:uppercase;">Retrieving personal record...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function initMyContracts() {
    const container = document.getElementById('myc-content');
    if (!container) return;

    try {
        const response = await window.api.getContracts();
        const contracts = response?.contracts || [];

        // Summary Calculations
        const totalLocked = contracts.reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);
        const activeCount = contracts.filter(c => !c.isTerminal).length;

        const terminal = contracts.filter(c => c.isTerminal);
        const wins = terminal.filter(c => ['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE'].includes(c.derivedState || c.state)).length;
        const rate = terminal.length > 0 ? (wins / terminal.length * 100).toFixed(1) + '%' : '100%';

        // Risk average
        const tierMap = { 'CONSERVATIVE': 1, 'STANDARD': 2, 'AGGRESSIVE': 3 };
        const tierLabels = ['—', 'CONSERVATIVE', 'STANDARD', 'AGGRESSIVE'];
        const totalTier = contracts.length > 0 ? contracts.reduce((sum, c) => sum + (tierMap[c.riskTier?.toUpperCase()] || 2), 0) : 0;
        const avgTier = contracts.length > 0 ? tierLabels[Math.round(totalTier / contracts.length)] : '—';

        // Update Summary
        document.getElementById('myc-total-locked').textContent = '$' + (totalLocked / 100).toLocaleString('en-US', { minimumFractionDigits: 0 });
        document.getElementById('myc-active-count').textContent = activeCount.toString();
        document.getElementById('myc-settle-rate').textContent = rate;
        document.getElementById('myc-avg-risk').textContent = avgTier;

        if (contracts.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 60px 0;">
                    <div style="font-family:'JetBrains Mono',monospace; font-size:11px; color:#888; text-transform:uppercase; margin-bottom:16px;">No contracts in record</div>
                    <button class="myc-btn-secondary" style="background:#111; color:#fff; border:none;" onclick="window.router.navigate('/overview')">Create First Contract</button>
                </div>
            `;
        } else {
            renderContractList(container, contracts);
        }
    } catch (err) {
        console.error('[MyContracts] Error:', err);
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#752122; font-family:'JetBrains Mono',monospace; font-size:12px;">SYSTEM_RECORD_ERROR: ${err.message}</div>`;
    }

    if (window.lucide) window.lucide.createIcons();
}

function renderContractList(container, contracts) {
    contracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const listHtml = contracts.map(c => {
        const platform = c.platform?.toUpperCase() || 'UNKNOWN';
        const amount = (c.lockAmountUsdCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const state = c.derivedState || c.state;
        const riskTier = c.riskTier?.toUpperCase() || 'STANDARD';

        let statusLabel = 'ACTIVE';
        let statusColor = '#555';
        if (['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE'].includes(state)) {
            statusLabel = 'SETTLED';
            statusColor = '#166534';
        } else if (['FORFEITED', 'SETTLED_FAILURE'].includes(state)) {
            statusLabel = 'FORFEITED';
            statusColor = '#921818';
        } else if (['CREATED', 'FUNDS_AUTHORIZED'].includes(state)) {
            statusLabel = 'PENDING';
        }

        const iconMap = { 'twitter': 'twitter', 'x': 'twitter', 'stripe': 'credit-card', 'shopify': 'shopping-bag', 'amazon': 'package', 'github': 'github' };
        const lucideIcon = iconMap[c.platform?.toLowerCase()] || 'file-text';

        return `
            <a href="#/contracts/${c.id}" class="myc-card">
                <div class="myc-card-left">
                    <div class="myc-card-icon"><i data-lucide="${lucideIcon}"></i></div>
                    <div class="myc-card-info">
                        <span class="myc-card-platform">${platform.charAt(0) + platform.slice(1).toLowerCase()} Performance</span>
                        <span class="myc-card-id">CNTRCT-${c.id.slice(0, 5).toUpperCase()}</span>
                    </div>
                </div>
                <div class="myc-card-center">
                    <span class="myc-status-badge" style="background:transparent; border-color:#eee; color:#999; font-weight:500;">${riskTier}</span>
                    <span class="myc-status-badge">${statusLabel}</span>
                </div>
                <div class="myc-card-right">
                    <span class="myc-card-amount">${amount}</span>
                    <span class="myc-card-status-text" style="color:${statusColor}">${statusLabel}</span>
                </div>
            </a>
        `;
    }).join('');

    container.innerHTML = `<div class="myc-list">${listHtml}</div>`;
}
