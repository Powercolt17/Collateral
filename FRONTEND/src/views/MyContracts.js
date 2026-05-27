// MyContracts.js — Personal Performance Hub
// Upgraded 10/10 Premium Layout

export function renderMyContracts() {
    return `
        <style>
            .myc {
                background: #f8f9fa;
                background-image: 
                    radial-gradient(at 0% 0%, rgba(255, 255, 255, 0.4) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, rgba(230, 235, 240, 0.5) 0px, transparent 50%);
                min-height: calc(100vh - 72px);
                font-family: 'Inter', sans-serif;
                color: #111;
                position: relative;
                overflow: hidden;
            }
            .myc::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 350px;
                background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,249,250,0) 100%);
                z-index: 0;
                pointer-events: none;
            }

            .myc-inner {
                position: relative;
                z-index: 1;
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 32px 100px;
            }

            /* ── Page Header ── */
            .myc-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-bottom: 40px;
            }
            .myc-title-wrap {
                position: relative;
            }
            .myc-page-title {
                font-size: 28px;
                font-weight: 800;
                letter-spacing: -0.5px;
                color: #111;
                margin: 0;
                font-family: 'Sora', sans-serif;
            }
            .myc-page-sub {
                font-size: 13px;
                color: #666;
                margin: 6px 0 0;
                font-weight: 500;
                letter-spacing: 0.2px;
            }

            .myc-header-actions {
                display: flex;
                gap: 16px;
            }
            .myc-btn {
                padding: 12px 24px;
                font-size: 13px;
                font-weight: 600;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .myc-btn-outline {
                background: rgba(255, 255, 255, 0.8);
                border: 1px solid #e2e8f0;
                color: #334155;
                backdrop-filter: blur(8px);
                box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            }
            .myc-btn-outline:hover {
                background: #fff;
                border-color: #cbd5e1;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                transform: translateY(-1px);
            }
            .myc-btn-primary {
                background: #111;
                border: 1px solid #111;
                color: #fff;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 0 0 0 rgba(17,17,17,0.2);
            }
            .myc-btn-primary:hover {
                background: #000;
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.12), 0 0 0 4px rgba(17,17,17,0.05);
            }

            /* ── Metrics Grid ── */
            .myc-metrics {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
                margin-bottom: 48px;
            }
            .myc-metric {
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(255,255,255,0.8);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .myc-metric::after {
                content: '';
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%);
                pointer-events: none;
            }
            .myc-metric:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,1);
            }
            .myc-metric-value {
                font-size: 32px;
                font-weight: 800;
                color: #0f172a;
                letter-spacing: -1px;
                margin-bottom: 8px;
                font-family: 'Sora', sans-serif;
            }
            .myc-metric-label {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #64748b;
            }

            /* ── Contract Feed ── */
            .myc-list { display: flex; flex-direction: column; gap: 16px; }

            .myc-card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                cursor: pointer;
                text-decoration: none;
                color: inherit;
                box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                position: relative;
                overflow: hidden;
            }
            .myc-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0; bottom: 0;
                width: 4px;
                background: #e2e8f0;
                transition: background 0.3s ease;
            }
            .myc-card[data-is-active="true"]::before { background: #10b981; }
            .myc-card[data-status="SETTLED"]::before { background: #0f5132; }
            .myc-card[data-status="FORFEITED"]::before { background: #ef4444; }

            .myc-card:hover { 
                transform: translateY(-2px);
                box-shadow: 0 12px 32px rgba(0,0,0,0.06);
                border-color: #cbd5e1;
            }

            .myc-card-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; padding-left: 8px; }
            .myc-card-icon {
                width: 44px; height: 44px;
                background: #f1f5f9; border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
                color: #475569; flex-shrink: 0;
            }
            .myc-card-icon svg { width: 20px; height: 20px; }

            .myc-card-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
            .myc-card-platform { font-size: 15px; font-weight: 700; color: #1e293b; }
            .myc-card-id { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; }

            .myc-card-center { display: flex; align-items: center; gap: 12px; flex-shrink: 0; justify-content: center; width: 120px; }
            .myc-status-badge {
                font-size: 10px; font-weight: 700;
                text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 12px;
                border-radius: 20px;
                background: #f1f5f9; color: #475569;
            }
            .myc-card[data-is-active="true"] .myc-status-badge { background: #ecfdf5; color: #059669; }
            .myc-card[data-status="SETTLED"] .myc-status-badge { background: #ecfdf5; color: #065f46; }
            .myc-card[data-status="FORFEITED"] .myc-status-badge { background: #fef2f2; color: #b91c1c; }

            .myc-card-right { text-align: right; display: flex; flex-direction: column; gap: 4px; padding-left: 24px; min-width: 140px; }
            .myc-card-amount { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; font-family: 'Sora', sans-serif; }
            .myc-card-status-text { font-size: 12px; font-weight: 600; color: #64748b; }

            /* Loading & Empty */
            .myc-loading { display: flex; flex-direction: column; align-items: center; padding: 100px 0; gap: 20px; }
            @keyframes cl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes cl-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            @keyframes myc-dot-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.3)} }

            .myc-empty-state {
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                padding: 100px 20px;
                background: rgba(255,255,255,0.6);
                backdrop-filter: blur(10px);
                border: 1px dashed #cbd5e1;
                border-radius: 20px;
                text-align: center;
                margin-top: 20px;
            }
            .myc-empty-icon {
                width: 64px; height: 64px;
                background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                margin-bottom: 24px;
                color: #94a3b8;
                box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 12px rgba(0,0,0,0.05);
            }
            .myc-empty-icon svg { width: 32px; height: 32px; }
            .myc-empty-title {
                font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 8px; font-family: 'Sora', sans-serif;
            }
            .myc-empty-sub {
                font-size: 14px; color: #64748b; margin-bottom: 32px; max-width: 400px; line-height: 1.5;
            }

            /* ── Live Metric Column ── */
            .myc-card-live {
                min-width: 160px; max-width: 200px;
                display: flex; align-items: center; justify-content: flex-start;
                padding: 0 16px; flex-shrink: 0;
            }
            .myc-live-loading {
                display: flex; align-items: center; gap: 8px;
                font-size: 11px; color: #64748b; font-weight: 600;
                text-transform: uppercase; letter-spacing: 0.5px;
            }
            .myc-live-dot {
                width: 8px; height: 8px; border-radius: 50%;
                background: #10b981;
                animation: myc-dot-pulse 1.5s ease infinite;
                box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
            }
            .myc-live-settled {
                font-size: 11px; font-weight: 600; color: #94a3b8; letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .myc-live-error {
                font-size: 11px; font-weight: 600; color: #ef4444; letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .myc-live-data {
                display: flex; flex-direction: column; gap: 6px; width: 100%;
            }
            .myc-live-current {
                display: flex; align-items: baseline; gap: 4px;
            }
            .myc-live-value {
                font-size: 18px; font-weight: 800; color: #0f172a;
                letter-spacing: -0.5px;
            }
            .myc-live-unit {
                font-size: 10px; font-weight: 700; color: #64748b;
                text-transform: uppercase; letter-spacing: 0.5px;
            }
            .myc-live-progress {
                display: flex; flex-direction: column; gap: 6px;
            }
            .myc-live-progress-bar {
                width: 100%; height: 4px; background: #e2e8f0;
                border-radius: 2px; overflow: hidden;
            }
            .myc-live-progress-fill {
                height: 100%; border-radius: 2px;
                transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .myc-live-progress-label {
                font-size: 9px; font-weight: 700;
                letter-spacing: 0.3px; text-transform: uppercase;
            }
            
            @media (max-width: 900px) {
                .myc-metrics { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 768px) {
                .myc-inner { padding: 32px 20px 80px; }
                .myc-header { flex-direction: column; align-items: flex-start; gap: 20px; }
                .myc-card { flex-direction: column; align-items: stretch; gap: 16px; }
                .myc-card-center { width: auto; justify-content: flex-start; padding-left: 68px; }
                .myc-card-right { text-align: left; padding-left: 68px; flex-direction: row; align-items: baseline; gap: 10px; }
                .myc-card-live { max-width: 100%; min-width: 0; padding: 0 0 0 68px; }
            }
        </style>

        <div class="myc">
            <div class="myc-inner">
                <div class="myc-header" data-reveal>
                    <div class="myc-title-wrap">
                        <h1 class="myc-page-title">Active Portfolio</h1>
                        <p class="myc-page-sub">Your personalized performance record and active capital</p>
                    </div>
                    <div class="myc-header-actions">
                        <button class="myc-btn myc-btn-outline" onclick="window.router.navigate('/profile')">
                            <i data-lucide="user"></i> View Identity
                        </button>
                        <button class="myc-btn myc-btn-primary" onclick="window.router.navigate('/market')">
                            <i data-lucide="plus"></i> New Contract
                        </button>
                    </div>
                </div>

                <div class="myc-metrics" data-reveal data-reveal-delay="1">
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
                        <div class="myc-metric-label">Total Payout</div>
                    </div>
                </div>

                <div class="myc-feed" data-reveal data-reveal-delay="2">
                    <div id="myc-content">
                        <div class="myc-loading">
                            <div style="position:relative;width:48px;height:48px;">
                                <svg style="position:absolute;top:0;left:0;width:100%;height:100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="15.5" stroke="#111" stroke-width="2"/><line x1="32" y1="19.5" x2="32" y2="44.5" stroke="#111" stroke-width="1.5" stroke-linecap="round" style="animation:cl-pulse 1.6s ease-in-out infinite"/></svg>
                                <svg style="position:absolute;top:0;left:0;width:100%;height:100%;animation:cl-spin 2.4s linear infinite;transform-origin:center center" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="26.5" ry="7.5" stroke="#111" stroke-width="1.1" fill="none" transform="rotate(-27 32 32)"/></svg>
                            </div>
                            <p style="font-size:12px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Retrieving personal record...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function initMyContracts() {
    const container = document.getElementById('myc-content');
    if (!container) return;

    // Trigger reveal animations
    setTimeout(() => {
        document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    }, 50);

    try {
        const response = await window.api.getContracts();
        const contracts = response?.contracts || [];

        // Summary Calculations
        const totalLocked = contracts.reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);
        const activeCount = contracts.filter(c => !c.isTerminal).length;

        const terminal = contracts.filter(c => c.isTerminal);
        const wins = terminal.filter(c => ['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE'].includes(c.derivedState || c.state)).length;
        const rate = terminal.length > 0 ? (wins / terminal.length * 100).toFixed(1) + '%' : '100%';

        // Total payout
        const totalPayout = contracts.reduce((sum, c) => sum + (c.payoutAmountUsdCents || 0), 0);

        // Update Summary
        document.getElementById('myc-total-locked').textContent = '$' + (totalLocked / 100).toLocaleString('en-US', { minimumFractionDigits: 0 });
        document.getElementById('myc-active-count').textContent = activeCount.toString();
        document.getElementById('myc-settle-rate').textContent = rate;
        document.getElementById('myc-avg-risk').textContent = '$' + (totalPayout / 100).toLocaleString('en-US', { minimumFractionDigits: 0 });

        if (contracts.length === 0) {
            container.innerHTML = `
                <div class="myc-empty-state">
                    <div class="myc-empty-icon"><i data-lucide="inbox"></i></div>
                    <div class="myc-empty-title">No Active Contracts</div>
                    <div class="myc-empty-sub">Your portfolio is currently empty. Start by exploring the open market to find opportunities.</div>
                    <button class="myc-btn myc-btn-primary" onclick="window.router.navigate('/market')">
                        Explore Market
                    </button>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
        } else {
            renderContractList(container, contracts);
        }
    } catch (err) {
        console.error('[MyContracts] Error:', err);
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#ef4444; font-size:14px; font-weight:600;">System Error: ${err.message}</div>`;
    }

    if (window.lucide) window.lucide.createIcons();
}

function renderContractList(container, contracts) {
    contracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const listHtml = contracts.map(c => {
        const platform = c.platform?.toUpperCase() || 'UNKNOWN';
        const amount = (c.lockAmountUsdCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
        const state = c.derivedState || c.state;
        
        let statusLabel = 'ACTIVE';
        if (['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE'].includes(state)) statusLabel = 'SETTLED';
        else if (['FORFEITED', 'SETTLED_FAILURE'].includes(state)) statusLabel = 'FORFEITED';
        else if (['CREATED', 'FUNDS_AUTHORIZED'].includes(state)) statusLabel = 'PENDING';

        const isActive = !['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE', 'FORFEITED', 'SETTLED_FAILURE'].includes(state);

        const iconMap = { 'twitter': 'twitter', 'x': 'twitter', 'stripe': 'credit-card', 'shopify': 'shopping-bag', 'amazon': 'package', 'github': 'github' };
        const lucideIcon = iconMap[c.platform?.toLowerCase()] || 'file-text';

        const metricLabels = {
            SUBSCRIBERS: 'subscribers', FOLLOWERS: 'followers', REVENUE: 'revenue',
            VIEWS: 'views', GROSS_SALES: 'sales', ORDER_COUNT: 'orders',
            IMPRESSIONS: 'impressions', COMMITS: 'commits', PRS_MERGED: 'PRs',
            STARS_GAINED: 'stars',
        };
        const metricLabel = metricLabels[c.metricType] || c.metricType?.toLowerCase() || 'metric';

        return `
            <a href="#/contract/${c.id}" class="myc-card" data-contract-id="${c.id}" data-status="${statusLabel}" data-is-active="${isActive}">
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
                            <span>Live Data...</span>
                        </div>
                    ` : `
                        <span class="myc-live-settled">${statusLabel}</span>
                    `}
                </div>
                <div class="myc-card-center">
                    <span class="myc-status-badge">${statusLabel}</span>
                </div>
                <div class="myc-card-right">
                    <span class="myc-card-amount">${amount}</span>
                    <span class="myc-card-status-text">Capital Exposure</span>
                </div>
            </a>
        `;
    }).join('');

    container.innerHTML = `<div class="myc-list">${listHtml}</div>`;
    if (window.lucide) window.lucide.createIcons();

    // ── Fetch live data for each active contract ──
    fetchLiveMetrics(contracts);
}

async function fetchLiveMetrics(contracts) {
    const activeContracts = contracts.filter(c => {
        const state = c.derivedState || c.state;
        return !['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE', 'FORFEITED', 'SETTLED_FAILURE'].includes(state);
    });

    if (activeContracts.length === 0) return;

    const providersSeen = new Set();
    const previewCache = {};

    for (const c of activeContracts) {
        const provider = (c.platform || '').toLowerCase();
        const metricKey = mapMetricToKey(c.metricType);
        const cacheKey = `${provider}:${metricKey}`;

        if (providersSeen.has(cacheKey)) {
            updateCardWithLiveData(c, previewCache[cacheKey]);
            continue;
        }

        providersSeen.add(cacheKey);

        try {
            const data = await window.api.getProviderPreview(provider, metricKey);
            previewCache[cacheKey] = data;
            updateCardWithLiveData(c, data);
        } catch (err) {
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
        const label = code === 'NOT_CONNECTED' ? 'Connect Oracle' : code === 'RECONNECT_REQUIRED' ? 'Reconnect' : 'Unavailable';
        el.innerHTML = `<span class="myc-live-error">${label}</span>`;
        return;
    }

    const currentValue = data.current_baseline || 0;
    const provider = (contract.platform || '').toLowerCase();
    const isMonetary = ['stripe', 'shopify', 'amazon'].includes(provider);

    const fmt = (v) => {
        if (isMonetary) return '$' + (v / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        return Math.round(v).toLocaleString('en-US');
    };

    const baseline = parseFloat(contract.baselineValue || 0);
    const target = parseFloat(contract.targetValue || 0);
    const hasTarget = target > 0 && baseline > 0;

    let progressPct = 0;
    let progressColor = '#10b981';
    if (hasTarget && currentValue > baseline) {
        const needed = target - baseline;
        const achieved = currentValue - baseline;
        progressPct = Math.min(100, Math.round((achieved / needed) * 100));
    }
    if (progressPct < 25) progressColor = '#ef4444';
    else if (progressPct < 60) progressColor = '#f59e0b';

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
                    <span class="myc-live-progress-label" style="color:${progressColor}">${progressPct}% to goal</span>
                </div>
            ` : `
                <span class="myc-live-unit" style="color:#10b981">LIVE METRICS INC.</span>
            `}
        </div>
    `;
}

function updateCardWithError(contract) {
    const el = document.querySelector(`[data-live-id="${contract.id}"]`);
    if (!el) return;
    el.innerHTML = `<span class="myc-live-error">--</span>`;
}
