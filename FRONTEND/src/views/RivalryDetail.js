// RivalryDetail.js — /rivalry/:id detail page
// Spectator-grade view of a single head-to-head duel

import api from '../api.js';

export function renderRivalryDetail() {
    return `
        <style>
            .rvd {
                background: #fff;
                min-height: calc(100vh - 72px);
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
            }

            /* ── Hero VS Header ── */
            .rvd-hero {
                position: relative;
                overflow: hidden;
                border-bottom: 1px solid #f0f0f0;
            }
            .rvd-hero::before {
                content: '';
                position: absolute;
                top: -20%; left: 50%; transform: translateX(-50%);
                width: 120%; height: 140%;
                background: radial-gradient(circle at center, rgba(59,0,1,0.05), transparent 60%);
                pointer-events: none;
            }
            .rvd-hero-inner {
                max-width: 1200px;
                margin: 0 auto;
                padding: 56px 64px 48px;
                position: relative;
            }
            .rvd-breadcrumb {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700;
                letter-spacing: 0.12em; color: #ccc;
                text-transform: uppercase; margin-bottom: 32px;
            }
            .rvd-breadcrumb a { color: #ccc; text-decoration: none; }
            .rvd-breadcrumb a:hover { color: #999; }
            .rvd-breadcrumb span { color: #3B0001; }

            .rvd-vs-strip {
                display: flex;
                align-items: stretch;
                background: #fafafa;
                border: 1px solid #f0f0f0;
                overflow: hidden;
                margin-bottom: 24px;
            }
            .rvd-player {
                flex: 1;
                padding: 32px 36px;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .rvd-player.right {
                text-align: right;
                border-left: 1px solid #f0f0f0;
            }
            .rvd-player-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 600;
                letter-spacing: 0.1em; color: #bbb;
                text-transform: uppercase;
            }
            .rvd-player-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 18px; font-weight: 600;
                color: #111; letter-spacing: 0.02em;
            }
            .rvd-player-growth {
                font-size: 36px; font-weight: 300;
                letter-spacing: -1px; margin-top: 4px;
            }
            .rvd-player-growth.leading {
                color: #10b981;
                text-shadow: 0 0 8px rgba(16,185,129,0.2);
            }
            .rvd-player-growth.trailing { color: #ef4444; }
            .rvd-player-baseline {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; color: #bbb;
                letter-spacing: 0.04em;
            }

            .rvd-vs-center {
                display: flex; align-items: center; justify-content: center;
                width: 80px; flex-shrink: 0;
                background: #f2f2f2;
                border-left: 1px solid #f0f0f0;
                border-right: 1px solid #f0f0f0;
                box-shadow: inset 0 0 6px rgba(0,0,0,0.04);
            }
            .rvd-vs-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 14px; font-weight: 700;
                color: #bbb; letter-spacing: 0.06em;
            }

            /* Momentum Bar */
            .rvd-momentum {
                height: 8px; display: flex;
                overflow: hidden; margin-bottom: 32px;
                background: #f0f0f0;
            }
            .rvd-momentum-left {
                background: #10b981; transition: width 0.4s ease;
            }
            .rvd-momentum-right {
                background: #ef4444; transition: width 0.4s ease;
            }

            /* ── Status Bar ── */
            .rvd-status-bar {
                display: flex; align-items: center;
                justify-content: space-between; gap: 24px;
            }
            .rvd-status-badge {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700;
                letter-spacing: 0.1em; text-transform: uppercase;
                display: flex; align-items: center; gap: 6px;
            }
            .rvd-status-badge .dot {
                width: 6px; height: 6px;
                border-radius: 50%; background: #10b981;
                animation: rv-pulse 1.8s infinite;
            }
            .rvd-status-badge.live { color: #10b981; }
            .rvd-status-badge.ended { color: #999; }
            .rvd-status-badge.ended .dot { background: #999; animation: none; }
            .rvd-status-badge.pending { color: #f59e0b; }
            .rvd-status-badge.pending .dot { background: #f59e0b; animation: none; }

            .rvd-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; color: #999;
            }

            /* ── Detail Grid ── */
            .rvd-grid {
                max-width: 1200px; margin: 0 auto;
                padding: 40px 64px 64px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 28px;
            }
            .rvd-panel {
                background: #fafafa;
                border: 1px solid #f0f0f0;
                padding: 28px;
            }
            .rvd-panel-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700;
                letter-spacing: 0.12em; color: #bbb;
                text-transform: uppercase;
                margin-bottom: 20px;
            }
            .rvd-row {
                display: flex; justify-content: space-between;
                align-items: center; padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .rvd-row:last-child { border-bottom: none; }
            .rvd-row-label {
                font-size: 13px; color: #888;
            }
            .rvd-row-value {
                font-size: 14px; font-weight: 500; color: #111;
            }

            /* ── Share Section ── */
            .rvd-share {
                max-width: 1200px; margin: 0 auto;
                padding: 0 64px 48px;
                display: flex; gap: 12px;
            }
            .rvd-share-btn {
                height: 40px; padding: 0 24px;
                border: 1px solid #e5e5e5; background: #fff;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600;
                letter-spacing: 0.08em; text-transform: uppercase;
                color: #666; cursor: pointer;
                transition: border-color 0.15s, color 0.15s;
            }
            .rvd-share-btn:hover { border-color: #111; color: #111; }

            /* ── Warning ── */
            .rvd-warning {
                max-width: 1200px; margin: 0 auto;
                padding: 0 64px 40px; text-align: center;
            }
            .rvd-warning-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600;
                letter-spacing: 0.1em; color: #ccc;
                text-transform: uppercase;
            }

            /* ── Loading ── */
            .rvd-loading {
                text-align: center; padding: 120px 20px;
                color: #ccc;
            }
            .rvd-loading-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px; letter-spacing: 0.08em;
            }

            /* ── Responsive ── */
            @media (max-width: 768px) {
                .rvd-hero-inner { padding: 36px 20px 32px; }
                .rvd-vs-strip { flex-direction: column; }
                .rvd-player.right { text-align: left; border-left: none; border-top: 1px solid #f0f0f0; }
                .rvd-vs-center { width: 100%; height: 40px; border-left: none; border-right: none; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; }
                .rvd-player-growth { font-size: 28px; }
                .rvd-grid { grid-template-columns: 1fr; padding: 24px 20px 40px; }
                .rvd-share { padding: 0 20px 32px; flex-wrap: wrap; }
                .rvd-warning { padding: 0 20px 32px; }
                .rvd-status-bar { flex-direction: column; align-items: flex-start; gap: 8px; }
            }
        </style>

        <div class="rvd" id="rvd-container">
            <div class="rvd-loading">
                <div class="rvd-loading-text">Loading rivalry...</div>
            </div>
        </div>
    `;
}

export function initRivalryDetail() {
    const container = document.getElementById('rvd-container');
    if (!container) return;

    // Extract rivalry ID from URL
    const path = window.location.pathname;
    const id = path.split('/rivalry/')[1];

    // Sample data lookup (will be replaced by API)
    const sampleRivalries = [
        {
            id: 'RV-001', status: 'active', metric: 'Revenue Growth', provider: 'stripe',
            challenger: { name: '@apex_capital', growth: 34.2, baseline: 48200 },
            opponent: { name: '@northpeak', growth: 28.7, baseline: 62800 },
            stake: 2500, daysLeft: 12, totalDays: 30,
        },
        {
            id: 'RV-002', status: 'active', metric: 'Follower Growth', provider: 'x',
            challenger: { name: '@buildfast', growth: 18.5, baseline: 12400 },
            opponent: { name: '@shipweekly', growth: 22.1, baseline: 8900 },
            stake: 1000, daysLeft: 6, totalDays: 14,
        },
        {
            id: 'RV-004', status: 'active', metric: 'Order Growth', provider: 'amazon',
            challenger: { name: '@fbaseller', growth: 41.8, baseline: 340 },
            opponent: { name: '@primeops', growth: 39.2, baseline: 520 },
            stake: 3000, daysLeft: 3, totalDays: 14,
        },
        {
            id: 'RV-005', status: 'settled', metric: 'Revenue Growth', provider: 'stripe',
            challenger: { name: '@growthlab', growth: 67.3, baseline: 35000 },
            opponent: { name: '@revscale', growth: 45.1, baseline: 41200 },
            stake: 10000, daysLeft: 0, totalDays: 90,
        },
    ];

    const rivalry = sampleRivalries.find(r => r.id === id);

    if (!rivalry) {
        container.innerHTML = `
            <div class="rvd-loading">
                <div class="rvd-loading-text">RIVALRY NOT FOUND</div>
                <a href="/rivalry" style="color:#3B0001; font-size:13px; margin-top:16px; display:inline-block;">← Back to Rivalries</a>
            </div>`;
        return;
    }

    const isLeading = rivalry.challenger.growth >= rivalry.opponent.growth;
    const totalGrowth = Math.abs(rivalry.challenger.growth) + Math.abs(rivalry.opponent.growth);
    const leftPct = totalGrowth > 0 ? Math.round((Math.abs(rivalry.challenger.growth) / totalGrowth) * 100) : 50;
    const rightPct = 100 - leftPct;
    const statusClass = rivalry.status === 'active' ? 'live' : rivalry.status === 'pending' ? 'pending' : 'ended';
    const statusLabel = rivalry.status === 'active' ? 'LIVE' : rivalry.status === 'pending' ? 'PENDING' : 'SETTLED';
    const timeLabel = rivalry.daysLeft <= 0 ? 'Completed' : `${rivalry.daysLeft}d remaining of ${rivalry.totalDays}d`;
    const pool = rivalry.stake * 2;

    container.innerHTML = `
        <div class="rvd-hero">
            <div class="rvd-hero-inner">
                <div class="rvd-breadcrumb">
                    <a href="/rivalry">Rivalry</a> <span>/ ${rivalry.id}</span>
                </div>

                <div class="rvd-vs-strip">
                    <div class="rvd-player">
                        <span class="rvd-player-label">CHALLENGER</span>
                        <span class="rvd-player-name">${rivalry.challenger.name}</span>
                        <span class="rvd-player-growth ${isLeading ? 'leading' : 'trailing'}">${rivalry.challenger.growth > 0 ? '+' : ''}${rivalry.challenger.growth}%</span>
                        <span class="rvd-player-baseline">Baseline: ${(rivalry.challenger.baseline || 0).toLocaleString()}</span>
                    </div>
                    <div class="rvd-vs-center">
                        <span class="rvd-vs-text">VS</span>
                    </div>
                    <div class="rvd-player right">
                        <span class="rvd-player-label">OPPONENT</span>
                        <span class="rvd-player-name">${rivalry.opponent.name}</span>
                        <span class="rvd-player-growth ${!isLeading ? 'leading' : 'trailing'}">${rivalry.opponent.growth > 0 ? '+' : ''}${rivalry.opponent.growth}%</span>
                        <span class="rvd-player-baseline">Baseline: ${(rivalry.opponent.baseline || 0).toLocaleString()}</span>
                    </div>
                </div>

                <div class="rvd-momentum">
                    <div class="rvd-momentum-left" style="width:${leftPct}%"></div>
                    <div class="rvd-momentum-right" style="width:${rightPct}%"></div>
                </div>

                <div class="rvd-status-bar">
                    <div class="rvd-status-badge ${statusClass}">
                        <span class="dot"></span>
                        ${statusLabel} · ${rivalry.metric} · ${rivalry.provider.toUpperCase()}
                    </div>
                    <span class="rvd-time">${timeLabel}</span>
                </div>
            </div>
        </div>

        <div class="rvd-grid">
            <div class="rvd-panel">
                <div class="rvd-panel-title">Contract Terms</div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Stake Per Side</span>
                    <span class="rvd-row-value">$${rivalry.stake.toLocaleString()}</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Combined Pool</span>
                    <span class="rvd-row-value">$${pool.toLocaleString()}</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Duration</span>
                    <span class="rvd-row-value">${rivalry.totalDays} days</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Protocol Fee</span>
                    <span class="rvd-row-value">2%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Winner Payout</span>
                    <span class="rvd-row-value">$${Math.floor(pool * 0.98).toLocaleString()}</span>
                </div>
            </div>

            <div class="rvd-panel">
                <div class="rvd-panel-title">Current Performance</div>
                <div class="rvd-row">
                    <span class="rvd-row-label">${rivalry.challenger.name}</span>
                    <span class="rvd-row-value" style="color:${isLeading ? '#10b981' : '#ef4444'}">+${rivalry.challenger.growth}%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">${rivalry.opponent.name}</span>
                    <span class="rvd-row-value" style="color:${!isLeading ? '#10b981' : '#ef4444'}">+${rivalry.opponent.growth}%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Delta</span>
                    <span class="rvd-row-value">${Math.abs(rivalry.challenger.growth - rivalry.opponent.growth).toFixed(1)}%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Current Leader</span>
                    <span class="rvd-row-value">${isLeading ? rivalry.challenger.name : rivalry.opponent.name}</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Time Remaining</span>
                    <span class="rvd-row-value">${rivalry.daysLeft <= 0 ? 'Completed' : rivalry.daysLeft + 'd'}</span>
                </div>
            </div>

            <div class="rvd-panel">
                <div class="rvd-panel-title">Settlement Rules</div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Method</span>
                    <span class="rvd-row-value">Percentage Growth Comparison</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Tie Margin</span>
                    <span class="rvd-row-value">±0.5%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Settlement</span>
                    <span class="rvd-row-value">Automatic at Deadline</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Appeals</span>
                    <span class="rvd-row-value">None — Final</span>
                </div>
            </div>

            <div class="rvd-panel">
                <div class="rvd-panel-title">Verification</div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Provider</span>
                    <span class="rvd-row-value">${rivalry.provider.charAt(0).toUpperCase() + rivalry.provider.slice(1)}</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Metric</span>
                    <span class="rvd-row-value">${rivalry.metric}</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Data Source</span>
                    <span class="rvd-row-value">API Oracle</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Baseline Lock</span>
                    <span class="rvd-row-value">Immutable</span>
                </div>
            </div>
        </div>

        <div class="rvd-share">
            <button class="rvd-share-btn" onclick="navigator.clipboard.writeText(window.location.href).then(()=>alert('Link copied!'))">COPY LINK</button>
            <button class="rvd-share-btn" onclick="window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent('${rivalry.challenger.name} vs ${rivalry.opponent.name} — $${pool.toLocaleString()} at stake. ${rivalry.metric}. ' + window.location.href))">SHARE ON X</button>
        </div>

        <div class="rvd-warning">
            <div class="rvd-warning-text">Capital is locked. Settlement is automatic and final. No appeals. No reversals.</div>
        </div>
    `;
}
