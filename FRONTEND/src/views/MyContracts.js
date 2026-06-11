// MyContracts.js — Personal Performance Hub
// Matches ActiveContracts.js institutional layout

export function renderMyContracts() {
    return `
        <style>
            .myc {
                background: #fbfbf9;
                min-height: calc(100vh - 72px);
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                color: #1e1e1e;
            }

            /* ── Page Header ── */
            .myc-header {
                padding: 48px 32px 0;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }
            .myc-title-wrap {}
            .myc-page-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 32px;
                font-weight: 800;
                letter-spacing: -1.2px;
                color: #111;
                margin: 0;
            }
            .myc-page-sub {
                font-size: 10px;
                color: #8a8984;
                margin: 8px 0 0;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 1.5px;
            }

            .myc-header-actions {
                display: flex;
                gap: 12px;
            }
            .myc-btn-secondary {
                padding: 10px 18px;
                background: #fff;
                border: 1px solid rgba(0,0,0,0.08);
                border-radius: 6px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            }
            .myc-btn-secondary:hover {
                border-color: rgba(92, 20, 20, 0.25);
                background: rgba(92, 20, 20, 0.02);
                color: #5C1414;
                transform: translateY(-1px);
            }
            .myc-btn-primary {
                padding: 10px 18px;
                background: #111111;
                color: #ffffff;
                border: none;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(92, 20, 20, 0.1);
            }
            .myc-btn-primary:hover {
                background: #5C1414;
                transform: translateY(-1px);
                box-shadow: 0 6px 18px rgba(92, 20, 20, 0.25);
            }
            .myc-btn-primary::before {
                content: '';
                position: absolute;
                top: 0;
                left: -150%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
                transform: skewX(-25deg);
                pointer-events: none;
                z-index: 5;
            }
            .myc-btn-primary:hover::before {
                left: 150%;
                transition: left 0.8s ease-in-out;
            }

            /* ── Metrics Strip ── */
            .myc-metrics {
                display: flex;
                align-items: stretch;
                padding: 32px;
                gap: 16px;
                border-bottom: none;
            }
            .myc-metric {
                flex: 1;
                padding: 20px 24px;
                background: #fff;
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .myc-metric:hover {
                border-color: rgba(92, 20, 20, 0.15);
                box-shadow: 0 8px 24px rgba(92, 20, 20, 0.04);
                transform: translateY(-2px);
            }
            .myc-metric-value {
                font-family: 'JetBrains Mono', monospace;
                font-size: 28px;
                font-weight: 700;
                color: #111;
                letter-spacing: -1.2px;
                line-height: 1.2;
                margin-bottom: 6px;
            }
            .myc-metric-label {
                font-family: 'Inter', sans-serif;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #8a8984;
            }

            .myc-feed { padding: 16px 32px 80px; }

            /* Loading */
            .myc-loading { display: flex; flex-direction: column; align-items: center; padding: 80px 0; gap: 16px; }
            @keyframes cl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes cl-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }

            /* --- INJECTED CARD GRID CSS --- */
            
            .eq-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 24px;
            }
            .eq-card {
                background: #fff;
                padding: 32px 28px;
                border-radius: 16px;
                border: 1px solid rgba(0,0,0,0.05);
                box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                display: flex;
                flex-direction: column;
                cursor: pointer;
                transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
                overflow: hidden;
            }
            .eq-card:hover {
                background: #fff;
                transform: translateY(-4px);
                border-color: rgba(92, 20, 20, 0.15);
                box-shadow: 0 16px 48px -16px rgba(92, 20, 20, 0.08), 0 0 1px rgba(92, 20, 20, 0.12);
            }
            .eq-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 3px;
                background: #5C1414;
                transition: width 0.4s ease;
            }
            .eq-card:hover::before { width: 100%; }
            .eq-card-meta {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .eq-closing { color: #5C1414; font-weight: 700; }
            .eq-id { color: #ccc; }
            .eq-time { color: #ccc; display: flex; align-items: center; gap: 4px; }

            .eq-card-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 18px;
                font-weight: 800;
                color: #111;
                margin: 12px 0 8px;
                letter-spacing: -0.5px;
            }
            .eq-card-provider {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
            }
            .eq-provider-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                color: #888;
            }
            .eq-tier-badge {
                padding: 3px 8px;
                font-size: 9px;
                font-weight: 700;
                border-radius: 2px;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.5px;
            }
            .eq-tier-badge.controlled { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
            .eq-tier-badge.elevated { background: #fff7ed; color: #9a3412; border: 1px solid #ffedd5; }
            .eq-tier-badge.maximum { background: #fff1f2; color: #9f1239; border: 1px solid #ffe4e6; }

            .eq-card-status {
                display: flex;
                align-items: center;
                gap: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #10b981;
                text-transform: uppercase;
                margin-bottom: 16px;
            }
            .eq-card-status .dot { width: 4px; height: 4px; border-radius: 50%; background: currentcolor; }

            .eq-card-stake-info {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
            }
            .eq-stake-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: -1px;
            }
            .eq-stake-separator { width: 16px; height: 1px; background: #eee; }
            .eq-stake-lbl {
                font-family: 'Inter', sans-serif;
                font-size: 9px;
                color: #8a8984;
                text-transform: uppercase;
                margin-top: 4px;
                font-weight: 600;
            }

            .eq-card-cta {
                background: #111111;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 16px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                width: 100%;
                cursor: pointer;
                margin-top: auto;
                position: relative;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .eq-card-cta:hover {
                background: #5C1414;
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(92,20,20,0.25);
            }
            .eq-card-cta::before {
                content: '';
                position: absolute;
                top: 0;
                left: -150%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transform: skewX(-25deg);
                pointer-events: none;
                z-index: 5;
            }
            .eq-card-cta:hover::before {
                left: 150%;
                transition: left 0.8s ease-in-out;
            }
            .eq-card-footer {
                font-size: 10px;
                color: #8a8984;
                text-align: center;
                margin-top: 12px;
                font-style: italic;
            }

            @media (max-width: 768px) {
                .myc-header { padding: 32px 16px 0; flex-direction: column; align-items: flex-start; gap: 16px; }
                .myc-metrics { padding: 24px 16px; flex-wrap: wrap; gap: 12px; }
                .myc-metric { min-width: calc(50% - 6px); }
                .myc-feed { padding: 24px 16px 60px; }
                .eq-grid { grid-template-columns: 1fr; gap: 16px; }
            }
        </style>

        <div class="myc">
            <div class="myc-header" data-reveal>
                <div class="myc-title-wrap">
                    <h1 class="myc-page-title">Active <span style="color: #5C1414;">Contracts</span></h1>
                    <p class="myc-page-sub">Personalized performance record</p>
                </div>
                <div class="myc-header-actions">
                    <button class="myc-btn-secondary" onclick="window.router.navigate('/profile')">View Identity</button>
                    <button class="myc-btn-primary" onclick="window.router.navigate('/market')">New Contract</button>
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
                    <div class="myc-metric-label">Total Payout</div>
                </div>
            </div>

            <div class="myc-feed" data-reveal>
                <div id="myc-content">
                    <div class="myc-loading">
                        <div style="position:relative;width:48px;height:48px;">
                            <svg style="position:absolute;top:0;left:0;width:100%;height:100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="15.5" stroke="#3B0001" stroke-width="2"/><line x1="32" y1="19.5" x2="32" y2="44.5" stroke="#3B0001" stroke-width="1.5" stroke-linecap="round" style="animation:cl-pulse 1.6s ease-in-out infinite"/></svg>
                            <svg style="position:absolute;top:0;left:0;width:100%;height:100%;animation:cl-spin 2.4s linear infinite;transform-origin:center center" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="26.5" ry="7.5" stroke="#3B0001" stroke-width="1.1" fill="none" transform="rotate(-27 32 32)"/></svg>
                        </div>
                        <p style="font-family:'JetBrains Mono', monospace; font-size:10px; color:#888; text-transform:uppercase;">Retrieving personal record...</p>
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

        const totalPayout = contracts.reduce((sum, c) => sum + (c.payoutAmountUsdCents || 0), 0);

        document.getElementById('myc-total-locked').textContent = '$' + (totalLocked / 100).toLocaleString('en-US', { minimumFractionDigits: 0 });
        document.getElementById('myc-active-count').textContent = activeCount.toString();
        document.getElementById('myc-settle-rate').textContent = rate;
        document.getElementById('myc-avg-risk').textContent = '$' + (totalPayout / 100).toLocaleString('en-US', { minimumFractionDigits: 0 });

        if (contracts.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 60px 0;">
                    <div style="font-family:'JetBrains Mono', monospace; font-size:11px; color:#888; text-transform:uppercase; margin-bottom:16px;">No contracts in record</div>
                    <button class="myc-btn-secondary" style="background:#5C1414; color:#fff; border:none;" onclick="window.router.navigate('/market')">Create First Contract</button>
                </div>
            `;
        } else {
            renderContractList(container, contracts);
        }
    } catch (err) {
        console.error('[MyContracts] Error:', err);
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#752122; font-family:'JetBrains Mono', monospace; font-size:12px;">SYSTEM_RECORD_ERROR: ${err.message}</div>`;
    }
}

function renderContractList(container, contracts) {
    contracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const listHtml = contracts.map(c => {
        const rawId = (c.id || '').toString();
        const shortId = rawId.split('-')[0] || rawId || '????';
        const min = c.lockAmountUsdCents ? c.lockAmountUsdCents / 100 : 0;
        const stakeDisplay = '$' + min.toLocaleString();

        const platform = (c.platform || 'X').toLowerCase();
        let dotClass = 'x';
        if (platform === 'stripe') dotClass = 'stripe';
        if (platform === 'shopify') dotClass = 'shopify';
        if (platform === 'amazon') dotClass = 'amazon';

        const state = c.derivedState || c.state;
        const isTerminal = ['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE', 'FORFEITED', 'SETTLED_FAILURE'].includes(state);
        let timeLabel = isTerminal ? 'SETTLED' : 'ACTIVE';
        let closingAmtText = isTerminal ? 'COMPLETED' : 'LIVE RECORD';

        const tierUpper = c.riskTier?.toUpperCase() || 'CONTROLLED';
        const multiplier = tierUpper === 'MAXIMUM' ? 4.0 : tierUpper === 'ELEVATED' ? 2.5 : 1.7;
        const tierBadge = tierUpper === 'CONTROLLED' ? 'PLEDGE' : tierUpper === 'ELEVATED' ? 'STAKE' : 'ALL-IN';

        const metricLabels = {
            SUBSCRIBERS: 'subscribers', FOLLOWERS: 'followers', REVENUE: 'revenue',
            VIEWS: 'views', GROSS_SALES: 'sales', ORDER_COUNT: 'orders',
        };
        const goal = metricLabels[c.metricType] ? `Grow ${metricLabels[c.metricType]}` : 'Performance Goal';

        return `
            <div class="eq-card"
                 onclick="window.router.navigate('/contracts/${c.id}')"
                 style="cursor:pointer;"
                 data-id="${c.id}">
                <div class="eq-card-meta">
                    <span class="eq-closing">${closingAmtText}</span>
                    <span class="eq-id">CNTRCT-${shortId.slice(0, 5).toUpperCase()}</span>
                    <span class="eq-time">· ${timeLabel}</span>
                </div>
                <div class="eq-card-title">${goal}</div>
                <div class="eq-card-provider">
                    <span class="dot ${dotClass}" style="width: 6px; height: 6px; border-radius: 50%; background: ${dotClass === 'stripe' ? '#635bff' : dotClass === 'shopify' ? '#96bf48' : dotClass === 'amazon' ? '#ff9900' : '#111'}"></span>
                    <span class="eq-provider-name">${platform.toUpperCase()}</span>
                    <span class="eq-tier-badge ${tierUpper.toLowerCase()}">${tierBadge}</span>
                </div>
                <div class="eq-card-status"><span class="dot" style="width:4px; height:4px; border-radius:50%; background:${isTerminal ? '#555' : '#10b981'}; display:inline-block; margin-right:4px;"></span> ${isTerminal ? 'SETTLED' : 'TERMS VERIFIED'}</div>
                <div class="eq-card-stake-info">
                    <div>
                        <div class="eq-stake-val">${stakeDisplay}</div>
                        <div class="eq-stake-lbl">STAKE CAPACITY</div>
                    </div>
                    <div class="eq-stake-separator"></div>
                    <div>
                        <div class="eq-stake-val">${multiplier}x</div>
                        <div class="eq-stake-lbl">YIELD MULTIPLIER</div>
                    </div>
                </div>
                <button class="eq-card-cta ${isTerminal ? '' : 'primary'}" onclick="event.stopPropagation(); window.router.navigate('/contracts/${c.id}')">
                    ${isTerminal ? 'VIEW RECORD' : 'VIEW DETAILS'}
                </button>
                <div class="eq-card-footer">Capital is ${isTerminal ? 'released' : 'locked until settlement'}.</div>
            </div>
        `;
    }).join('');

    container.innerHTML = `<div class="eq-grid">${listHtml}</div>`;
}
