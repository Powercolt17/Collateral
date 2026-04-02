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
                font-family: 'Inter', monospace;
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
                font-family: 'Inter', monospace;
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
            .myc-card-id { font-family: 'Inter', monospace; font-size: 10px; color: #999; }

            .myc-card-center { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
            .myc-status-badge {
                font-family: 'Inter', monospace; font-size: 9px; font-weight: 700;
                text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px;
                border: 1px solid #ddd; background: #fff; color: #555;
            }

            .myc-card-right { text-align: right; display: flex; flex-direction: column; gap: 2px; padding-left: 24px; }
            .myc-card-amount { font-size: 22px; font-weight: 700; color: #111; letter-spacing: -0.5px; }
            .myc-card-status-text { font-size: 12px; font-weight: 600; font-family: 'Inter', monospace; }

            /* Loading & Empty */
            .myc-loading { display: flex; flex-direction: column; align-items: center; padding: 80px 0; gap: 16px; }
            @keyframes cl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes cl-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            @keyframes myc-spin { to { transform: rotate(360deg); } }
            @keyframes myc-dot-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.3)} }

            /* ── Live Metric Column ── */
            .myc-card-live {
                min-width: 140px; max-width: 180px;
                display: flex; align-items: center; justify-content: center;
                padding: 0 12px; flex-shrink: 0;
            }
            .myc-live-loading {
                display: flex; align-items: center; gap: 6px;
                font-family: 'Inter', monospace;
                font-size: 9px; color: #bbb; letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .myc-live-dot {
                width: 6px; height: 6px; border-radius: 50%;
                background: #10b981;
                animation: myc-dot-pulse 1.5s ease infinite;
            }
            .myc-live-settled {
                font-family: 'Inter', monospace;
                font-size: 9px; color: #999; letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .myc-live-error {
                font-family: 'Inter', monospace;
                font-size: 9px; color: #C41E24; letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .myc-live-data {
                display: flex; flex-direction: column; gap: 4px; width: 100%;
            }
            .myc-live-current {
                display: flex; align-items: baseline; gap: 4px;
            }
            .myc-live-value {
                font-size: 16px; font-weight: 700; color: #111;
                letter-spacing: -0.3px;
            }
            .myc-live-unit {
                font-family: 'Inter', monospace;
                font-size: 8px; font-weight: 600; color: #999;
                text-transform: uppercase; letter-spacing: 0.5px;
            }
            .myc-live-progress {
                display: flex; align-items: center; gap: 6px;
            }
            .myc-live-progress-bar {
                flex: 1; height: 3px; background: #f0f0f0;
                border-radius: 2px; overflow: hidden;
            }
            .myc-live-progress-fill {
                height: 100%; border-radius: 2px;
                transition: width 0.6s ease;
            }
            .myc-live-progress-label {
                font-family: 'Inter', monospace;
                font-size: 8px; font-weight: 700;
                letter-spacing: 0.3px; white-space: nowrap;
            }
            
            @media (max-width: 768px) {
                .myc-header { padding: 20px 16px 0; flex-direction: column; align-items: flex-start; gap: 16px; }
                .myc-metrics { padding: 16px 16px 20px; flex-wrap: wrap; }
                .myc-metric { min-width: calc(50% - 1px); }
                .myc-feed { padding: 16px 16px 60px; }
                .myc-card { flex-direction: column; align-items: stretch; gap: 10px; }
                .myc-card-right { text-align: left; padding-left: 0; flex-direction: row; align-items: baseline; gap: 10px; }
                .myc-card-live { max-width: 100%; min-width: 0; padding: 8px 0 0; }
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
                        <div style="position:relative;width:48px;height:48px;">
                            <svg style="position:absolute;top:0;left:0;width:100%;height:100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="15.5" stroke="#3B0001" stroke-width="2"/><line x1="32" y1="19.5" x2="32" y2="44.5" stroke="#3B0001" stroke-width="1.5" stroke-linecap="round" style="animation:cl-pulse 1.6s ease-in-out infinite"/></svg>
                            <svg style="position:absolute;top:0;left:0;width:100%;height:100%;animation:cl-spin 2.4s linear infinite;transform-origin:center center" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="26.5" ry="7.5" stroke="#3B0001" stroke-width="1.1" fill="none" transform="rotate(-27 32 32)"/></svg>
                        </div>
                        <p style="font-family:'Inter',monospace; font-size:10px; color:#888; text-transform:uppercase;">Retrieving personal record...</p>
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
                    <div style="font-family:'Inter',monospace; font-size:11px; color:#888; text-transform:uppercase; margin-bottom:16px;">No contracts in record</div>
                    <button class="myc-btn-secondary" style="background:#111; color:#fff; border:none;" onclick="window.router.navigate('/overview')">Create First Contract</button>
                </div>
            `;
        } else {
            renderContractList(container, contracts);
        }
    } catch (err) {
        console.error('[MyContracts] Error:', err);
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#752122; font-family:'Inter',monospace; font-size:12px;">SYSTEM_RECORD_ERROR: ${err.message}</div>`;
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

        const isActive = !['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE', 'FORFEITED', 'SETTLED_FAILURE'].includes(state);

        const iconMap = { 'twitter': 'twitter', 'x': 'twitter', 'stripe': 'credit-card', 'shopify': 'shopping-bag', 'amazon': 'package', 'github': 'github' };
        const lucideIcon = iconMap[c.platform?.toLowerCase()] || 'file-text';

        // Metric label for each platform
        const metricLabels = {
            SUBSCRIBERS: 'subscribers', FOLLOWERS: 'followers', REVENUE: 'revenue',
            VIEWS: 'views', GROSS_SALES: 'sales', ORDER_COUNT: 'orders',
            IMPRESSIONS: 'impressions', COMMITS: 'commits', PRS_MERGED: 'PRs',
            STARS_GAINED: 'stars',
        };
        const metricLabel = metricLabels[c.metricType] || c.metricType?.toLowerCase() || 'metric';

        return `
            <a href="#/contracts/${c.id}" class="myc-card" data-contract-id="${c.id}" data-platform="${c.platform?.toLowerCase() || ''}" data-metric-type="${c.metricType || ''}" data-is-active="${isActive}" data-baseline="${c.baselineValue || 0}" data-target="${c.targetValue || 0}">
                <div class="myc-card-left">
                    <div class="myc-card-icon"><i data-lucide="${lucideIcon}"></i></div>
                    <div class="myc-card-info">
                        <span class="myc-card-platform">${platform.charAt(0) + platform.slice(1).toLowerCase()} Performance</span>
                        <span class="myc-card-id">CNTRCT-${c.id.slice(0, 5).toUpperCase()} · ${metricLabel}</span>
                    </div>
                </div>
                <div class="myc-card-live" data-live-id="${c.id}">
                    ${isActive ? `
                        <div class="myc-live-loading">
                            <div class="myc-live-dot"></div>
                            <span>Fetching live data...</span>
                        </div>
                    ` : `
                        <span class="myc-live-settled">${statusLabel}</span>
                    `}
                </div>
                <div class="myc-card-center">
                    <span class="myc-status-badge" style="background:transparent; border-color:#eee; color:#999; font-weight:500;">${riskTier}</span>
                    <span class="myc-status-badge" style="color:${statusColor}">${statusLabel}</span>
                </div>
                <div class="myc-card-right">
                    <span class="myc-card-amount">${amount}</span>
                    <span class="myc-card-status-text" style="color:${statusColor}">${statusLabel}</span>
                </div>
            </a>
        `;
    }).join('');

    container.innerHTML = `<div class="myc-list">${listHtml}</div>`;

    // ── Fetch live data for each active contract ──
    fetchLiveMetrics(contracts);
}

async function fetchLiveMetrics(contracts) {
    // Deduplicate provider+metric pairs to avoid redundant calls
    const activeContracts = contracts.filter(c => {
        const state = c.derivedState || c.state;
        return !['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE', 'FORFEITED', 'SETTLED_FAILURE'].includes(state);
    });

    if (activeContracts.length === 0) return;

    // We need to fetch per-provider since the oracle preview is user-scoped
    const providersSeen = new Set();
    const previewCache = {};

    for (const c of activeContracts) {
        const provider = (c.platform || '').toLowerCase();
        const metricKey = mapMetricToKey(c.metricType);
        const cacheKey = `${provider}:${metricKey}`;

        if (providersSeen.has(cacheKey)) {
            // Use cached result
            updateCardWithLiveData(c, previewCache[cacheKey]);
            continue;
        }

        providersSeen.add(cacheKey);

        try {
            const data = await window.api.getProviderPreview(provider, metricKey);
            previewCache[cacheKey] = data;
            updateCardWithLiveData(c, data);
        } catch (err) {
            console.warn(`[MyContracts] Live data fetch failed for ${provider}/${metricKey}:`, err.message);
            updateCardWithError(c);
        }
    }
}

function mapMetricToKey(metricType) {
    const map = {
        SUBSCRIBERS: 'subscribers', FOLLOWERS: 'followers',
        REVENUE: 'revenue', VIEWS: 'views',
        GROSS_SALES: 'shopify_revenue', ORDER_COUNT: 'orders',
        IMPRESSIONS: 'impressions', COMMITS: 'commits',
        PRS_MERGED: 'prs_merged', STARS_GAINED: 'stars',
    };
    return map[metricType] || metricType?.toLowerCase() || 'followers';
}

function updateCardWithLiveData(contract, data) {
    const el = document.querySelector(`[data-live-id="${contract.id}"]`);
    if (!el) return;

    if (!data || data.status === 'error') {
        const code = data?.code || '';
        const label = code === 'NOT_CONNECTED' ? 'Not Connected' : code === 'RECONNECT_REQUIRED' ? 'Reconnect' : 'Unavailable';
        el.innerHTML = `<span class="myc-live-error">${label}</span>`;
        return;
    }

    const currentValue = data.current_baseline || 0;
    const provider = (contract.platform || '').toLowerCase();
    const isMonetary = ['stripe', 'shopify', 'amazon'].includes(provider);

    // Format values
    const fmt = (v) => {
        if (isMonetary) return '$' + (v / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        return Math.round(v).toLocaleString('en-US');
    };

    // Calculate target from baseline + growth %
    const baseline = parseFloat(contract.baselineValue || 0);
    const target = parseFloat(contract.targetValue || 0);
    const hasTarget = target > 0 && baseline > 0;

    // Progress calculation
    let progressPct = 0;
    let progressColor = '#0F5132';
    if (hasTarget && currentValue > baseline) {
        const needed = target - baseline;
        const achieved = currentValue - baseline;
        progressPct = Math.min(100, Math.round((achieved / needed) * 100));
    }
    if (progressPct < 25) progressColor = '#C41E24';
    else if (progressPct < 60) progressColor = '#d97706';

    const metricLabels = {
        SUBSCRIBERS: 'subs', FOLLOWERS: 'followers', REVENUE: 'rev',
        VIEWS: 'views', GROSS_SALES: 'sales', ORDER_COUNT: 'orders',
    };
    const unit = metricLabels[contract.metricType] || '';

    el.innerHTML = `
        <div class="myc-live-data">
            <div class="myc-live-current">
                <span class="myc-live-value">${fmt(currentValue)}</span>
                <span class="myc-live-unit">${unit}</span>
            </div>
            ${hasTarget ? `
                <div class="myc-live-progress">
                    <div class="myc-live-progress-bar">
                        <div class="myc-live-progress-fill" style="width:${progressPct}%;background:${progressColor}"></div>
                    </div>
                    <span class="myc-live-progress-label" style="color:${progressColor}">${progressPct}% to target</span>
                </div>
            ` : `
                <span class="myc-live-unit" style="color:#0F5132">LIVE</span>
            `}
        </div>
    `;
}

function updateCardWithError(contract) {
    const el = document.querySelector(`[data-live-id="${contract.id}"]`);
    if (!el) return;
    el.innerHTML = `<span class="myc-live-error">--</span>`;
}
