const fs = require('fs');

const activeJs = fs.readFileSync('FRONTEND/src/views/ActiveContracts.js', 'utf8');

// Extract the CARD GRID CSS
const cssMatch = activeJs.match(/\/\* --- CARD GRID ---\s*\*\/([\s\S]*?)\/\* --- ANIMATIONS --- \*\//);
let cssStr = cssMatch ? cssMatch[1] : '';

// Generate MyContracts.js
const newMyContracts = `// MyContracts.js — Personal Performance Hub
// Matches ActiveContracts.js institutional layout

export function renderMyContracts() {
    return \`
        <style>
            .myc {
                background: #fff;
                min-height: calc(100vh - 72px);
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
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
                font-size: 32px;
                font-weight: 700;
                letter-spacing: -1px;
                color: #111;
                margin: 0;
            }
            .myc-page-sub {
                font-size: 11px;
                color: #999;
                margin: 8px 0 0;
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
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                transition: border-color 0.1s;
            }
            .myc-btn-secondary:hover { border-color: #aaa; }

            /* ── Metrics Strip ── */
            .myc-metrics {
                display: flex;
                align-items: stretch;
                padding: 32px 32px 24px;
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
                font-size: 32px;
                font-weight: 700;
                color: #111;
                letter-spacing: -1px;
                line-height: 1.2;
                margin-bottom: 6px;
            }
            .myc-metric-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #888;
            }

            .myc-feed { padding: 48px 32px 80px; }

            /* Loading */
            .myc-loading { display: flex; flex-direction: column; align-items: center; padding: 80px 0; gap: 16px; }
            @keyframes cl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes cl-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }

            /* --- INJECTED CARD GRID CSS --- */
            \${cssStr}
            
            /* Overrides to prevent hover-execution */
            .myc .eq-card:hover { transform: none; box-shadow: none; border-color: #e5e5e5; }
            
            @media (max-width: 768px) {
                .myc-header { padding: 32px 16px 0; flex-direction: column; align-items: flex-start; gap: 16px; }
                .myc-metrics { padding: 24px 16px; flex-wrap: wrap; }
                .myc-metric { min-width: calc(50% - 1px); }
                .myc-feed { padding: 24px 16px 60px; }
            }
        </style>

        <div class="myc">
            <div class="myc-header" data-reveal>
                <div class="myc-title-wrap">
                    <h1 class="myc-page-title">Active Portfolio</h1>
                    <p class="myc-page-sub">Personalized performance record</p>
                </div>
                <div class="myc-header-actions">
                    <button class="myc-btn-secondary" onclick="window.router.navigate('/profile')">View Identity</button>
                    <button class="myc-btn-secondary" style="background: #111; color: #fff; border: none;" onclick="window.router.navigate('/market')">New Contract</button>
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
    \`;
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
            container.innerHTML = \`
                <div style="text-align:center; padding: 60px 0;">
                    <div style="font-family:'JetBrains Mono', monospace; font-size:11px; color:#888; text-transform:uppercase; margin-bottom:16px;">No contracts in record</div>
                    <button class="myc-btn-secondary" style="background:#111; color:#fff; border:none;" onclick="window.router.navigate('/market')">Create First Contract</button>
                </div>
            \`;
        } else {
            renderContractList(container, contracts);
        }
    } catch (err) {
        console.error('[MyContracts] Error:', err);
        container.innerHTML = \`<div style="text-align:center; padding:40px; color:#752122; font-family:'JetBrains Mono', monospace; font-size:12px;">SYSTEM_RECORD_ERROR: \${err.message}</div>\`;
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
        const goal = metricLabels[c.metricType] ? \`Grow \${metricLabels[c.metricType]}\` : 'Performance Goal';

        return \`
            <div class="eq-card"
                 onclick="window.router.navigate('/contracts/\${c.id}')"
                 style="cursor:pointer;"
                 data-id="\${c.id}">
                <div class="eq-card-meta">
                    <span class="eq-closing">\${closingAmtText}</span>
                    <span class="eq-id">CNTRCT-\${shortId.slice(0, 5).toUpperCase()}</span>
                    <span class="eq-time">· \${timeLabel}</span>
                </div>
                <div class="eq-card-title">\${goal}</div>
                <div class="eq-card-provider">
                    <span class="dot \${dotClass}" style="width: 6px; height: 6px; border-radius: 50%; background: \${dotClass === 'stripe' ? '#635bff' : dotClass === 'shopify' ? '#96bf48' : dotClass === 'amazon' ? '#ff9900' : '#111'}"></span>
                    <span class="eq-provider-name">\${platform.toUpperCase()}</span>
                    <span class="eq-tier-badge \${tierUpper.toLowerCase()}">\${tierBadge}</span>
                </div>
                <div class="eq-card-status"><span class="dot" style="width:4px; height:4px; border-radius:50%; background:\${isTerminal ? '#555' : '#10b981'}; display:inline-block; margin-right:4px;"></span> \${isTerminal ? 'SETTLED' : 'TERMS VERIFIED'}</div>
                <div class="eq-card-stake-info">
                    <div>
                        <div class="eq-stake-val">\${stakeDisplay}</div>
                        <div class="eq-stake-lbl">STAKE CAPACITY</div>
                    </div>
                    <div class="eq-stake-separator"></div>
                    <div>
                        <div class="eq-stake-val">\${multiplier}x</div>
                        <div class="eq-stake-lbl">YIELD MULTIPLIER</div>
                    </div>
                </div>
                <button class="eq-card-cta \${isTerminal ? '' : 'primary'}" onclick="event.stopPropagation(); window.router.navigate('/contracts/\${c.id}')">
                    \${isTerminal ? 'VIEW RECORD' : 'VIEW DETAILS'}
                </button>
                <div class="eq-card-footer">Capital is \${isTerminal ? 'released' : 'locked until settlement'}.</div>
            </div>
        \`;
    }).join('');

    container.innerHTML = \`<div class="eq-grid">\${listHtml}</div>\`;
}
`;

// Extract eq-grid css using the exact same match from ActiveContracts.js to make sure we get the responsive overrides
const responsiveCssMatch = activeJs.match(/@media \(max-width: 1200px\) {[\s\S]*?\.eq-card {/);
if (responsiveCssMatch) {
    // we just use the raw extracted css Str, it should contain the card grid
}

fs.writeFileSync('FRONTEND/src/views/MyContracts.js', newMyContracts);
console.log('Successfully updated MyContracts.js with eq-grid design');
