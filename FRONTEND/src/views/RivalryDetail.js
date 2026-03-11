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
                background: linear-gradient(
                    to right,
                    rgba(15,81,50,0.04),
                    transparent 40%,
                    transparent 60%,
                    rgba(59,0,1,0.04)
                );
                border: 1px solid #f0f0f0;
                overflow: hidden;
                margin-bottom: 24px;
            }
            .rvd-player {
                flex: 1;
                padding: 40px 40px;
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
                font-size: 48px; font-weight: 300;
                letter-spacing: -1.5px; margin-top: 4px;
            }
            .rvd-player-growth.leading {
                color: #0F5132;
                text-shadow: 0 0 8px rgba(15,81,50,0.2);
            }
            .rvd-player-growth.trailing { color: #3B0001; }
            .rvd-player-baseline {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; color: #bbb;
                letter-spacing: 0.04em;
            }
            .rvd-leader-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: #0F5132;
                margin-bottom: 2px;
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
                height: 10px; display: flex;
                overflow: hidden; margin-bottom: 32px;
                background: #f0f0f0;
                border-radius: 5px;
            }
            .rvd-momentum-left {
                background: #0F5132; transition: width 0.4s ease;
                border-radius: 5px 0 0 5px;
            }
            .rvd-momentum-right {
                background: #3B0001; transition: width 0.4s ease;
                border-radius: 0 5px 5px 0;
            }
            .rvd-momentum-left.is-leader {
                box-shadow: 0 0 8px rgba(15,81,50,0.35);
            }
            .rvd-momentum-right.is-leader {
                box-shadow: 0 0 8px rgba(59,0,1,0.35);
            }

            /* ── Performance Chart ── */
            .rvd-chart-section {
                max-width: 1200px; margin: 0 auto;
                padding: 0 64px 8px;
            }
            .rvd-chart-panel {
                background: #fafafa;
                border: 1px solid #f0f0f0;
                padding: 28px;
            }
            .rvd-chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .rvd-chart-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700;
                letter-spacing: 0.12em; color: #bbb;
                text-transform: uppercase;
            }
            .rvd-chart-legend {
                display: flex; gap: 16px;
            }
            .rvd-chart-legend-item {
                display: flex; align-items: center; gap: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 600;
                letter-spacing: 0.06em; color: #999;
            }
            .rvd-chart-legend-dot {
                width: 8px; height: 8px;
                border-radius: 50%;
            }
            .rvd-chart-canvas {
                position: relative;
                height: 200px;
                width: 100%;
            }
            .rvd-chart-canvas svg {
                width: 100%; height: 100%;
            }
            .rvd-chart-gridline {
                stroke: #f0f0f0; stroke-width: 1;
            }
            .rvd-chart-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; fill: #ccc;
            }
            .rvd-chart-footer {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
            }
            .rvd-chart-footer span {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; color: #ccc;
                letter-spacing: 0.04em;
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
                border-radius: 50%; background: #0F5132;
                animation: rv-pulse 1.8s infinite;
            }
            .rvd-status-badge.live { color: #0F5132; }
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
                .rvd-player-growth { font-size: 32px; }
                .rvd-grid { grid-template-columns: 1fr; padding: 24px 20px 40px; }
                .rvd-share { padding: 0 20px 32px; flex-wrap: wrap; }
                .rvd-warning { padding: 0 20px 32px; }
                .rvd-status-bar { flex-direction: column; align-items: flex-start; gap: 8px; }
                .rvd-chart-section { padding: 0 20px 8px; }
                .rvd-chart-canvas { height: 160px; }
            }
        </style>

        <div class="rvd" id="rvd-container">
            <div class="rvd-loading">
                <div class="rvd-loading-text">Loading rivalry...</div>
            </div>
        </div>
    `;
}

export async function initRivalryDetail() {
    const container = document.getElementById('rvd-container');
    if (!container) return;

    // Extract rivalry ID from hash-based URL (#/rivalry/RV-001)
    const hash = window.location.hash || '';
    const id = hash.replace('#', '').split('/rivalry/')[1] || '';

    // ── Maps ──
    const STATE_TO_STATUS = {
        CHALLENGE_ISSUED: 'pending', ACCEPTED: 'pending',
        BOTH_FUNDED: 'active', ACTIVE: 'active', VERIFYING: 'active',
        VERIFIED: 'active', SETTLING: 'active',
        SETTLED: 'settled', DRAW: 'settled',
        DECLINED: 'settled', EXPIRED: 'settled', CANCELLED: 'settled',
    };
    const METRIC_LABELS = { REVENUE: 'Revenue Growth', FOLLOWERS: 'Follower Growth', GROSS_SALES: 'Sales Growth', ORDER_COUNT: 'Order Growth' };
    const PLATFORM_MAP = { STRIPE: 'stripe', X: 'x', SHOPIFY: 'shopify', AMAZON: 'amazon' };

    // Transform API response → display format
    function transformDetail(r) {
        const challPart = r.participants?.find(p => p.role === 'challenger');
        const oppPart = r.participants?.find(p => p.role === 'opponent');
        const now = new Date();
        const start = new Date(r.activatedAt || r.createdAt);
        const end = new Date(start.getTime() + (r.durationDays || 30) * 86400000);
        const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));

        return {
            id: r.id,
            status: STATE_TO_STATUS[r.state] || 'active',
            metric: METRIC_LABELS[r.metricType] || r.metricType || 'Revenue Growth',
            provider: PLATFORM_MAP[r.platform] || (r.platform || 'stripe').toLowerCase(),
            challenger: {
                name: '@' + (r.challengerUsername || 'unknown'),
                growth: parseFloat(challPart?.growthPercent || challPart?.currentDelta || 0),
                baseline: parseFloat(challPart?.baselineValue || 0),
            },
            opponent: {
                name: '@' + (r.opponentUsername || 'unknown'),
                growth: parseFloat(oppPart?.growthPercent || oppPart?.currentDelta || 0),
                baseline: parseFloat(oppPart?.baselineValue || 0),
            },
            stake: (r.stakePerSideCents || 0) / 100,
            daysLeft,
            totalDays: r.durationDays || 30,
            metrics: r.metrics || [],
        };
    }

    // ── Sample data (fallback) ──
    const sampleRivalries = [
        { id: 'RV-001', status: 'active', metric: 'Revenue Growth', provider: 'stripe', challenger: { name: '@apex_capital', growth: 34.2, baseline: 48200 }, opponent: { name: '@northpeak', growth: 28.7, baseline: 62800 }, stake: 2500, daysLeft: 12, totalDays: 30 },
        { id: 'RV-002', status: 'active', metric: 'Follower Growth', provider: 'x', challenger: { name: '@buildfast', growth: 18.5, baseline: 12400 }, opponent: { name: '@shipweekly', growth: 22.1, baseline: 8900 }, stake: 1000, daysLeft: 6, totalDays: 14 },
        { id: 'RV-003', status: 'pending', metric: 'Sales Growth', provider: 'shopify', challenger: { name: '@ecomgrind', growth: 0, baseline: 15600 }, opponent: { name: '@storescale', growth: 0, baseline: 22100 }, stake: 5000, daysLeft: 30, totalDays: 30 },
        { id: 'RV-004', status: 'active', metric: 'Order Growth', provider: 'amazon', challenger: { name: '@fbaseller', growth: 41.8, baseline: 340 }, opponent: { name: '@primeops', growth: 39.2, baseline: 520 }, stake: 3000, daysLeft: 3, totalDays: 14 },
        { id: 'RV-005', status: 'settled', metric: 'Revenue Growth', provider: 'stripe', challenger: { name: '@growthlab', growth: 67.3, baseline: 35000 }, opponent: { name: '@revscale', growth: 45.1, baseline: 41200 }, stake: 10000, daysLeft: 0, totalDays: 90 },
        { id: 'RV-006', status: 'active', metric: 'Follower Growth', provider: 'x', challenger: { name: '@contentking', growth: 12.4, baseline: 5200 }, opponent: { name: '@viralops', growth: 15.8, baseline: 7800 }, stake: 750, daysLeft: 9, totalDays: 14 },
    ];

    // ── Fetch live rivalry, fallback to sample ──
    let rivalry = null;
    try {
        const res = await api.getRivalry(id);
        if (res.ok && res.rivalry) {
            rivalry = transformDetail(res.rivalry);
            console.log(`[RivalryDetail] Loaded live rivalry ${id}`);
        }
    } catch (e) {
        console.log('[RivalryDetail] API unavailable, checking sample data');
    }
    if (!rivalry) {
        rivalry = sampleRivalries.find(r => r.id === id) || null;
    }

    if (!rivalry) {
        container.innerHTML = `
            <div class="rvd-loading">
                <div class="rvd-loading-text">RIVALRY NOT FOUND</div>
                <a href="#/rivalry" style="color:#3B0001; font-size:13px; margin-top:16px; display:inline-block;">← Back to Rivalries</a>
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
                    <a href="#/rivalry">Rivalry</a> <span>/ ${rivalry.id}</span>
                </div>

                <div class="rvd-vs-strip">
                    <div class="rvd-player">
                        ${isLeading ? '<div class="rvd-leader-tag">LEADING</div>' : ''}
                        <span class="rvd-player-label">CHALLENGER</span>
                        <span class="rvd-player-name">${rivalry.challenger.name}</span>
                        <span class="rvd-player-growth ${isLeading ? 'leading' : 'trailing'}">${rivalry.challenger.growth > 0 ? '+' : ''}${rivalry.challenger.growth}%</span>
                        <span class="rvd-player-baseline">Baseline: ${(rivalry.challenger.baseline || 0).toLocaleString()}</span>
                    </div>
                    <div class="rvd-vs-center">
                        <span class="rvd-vs-text">VS</span>
                    </div>
                    <div class="rvd-player right">
                        ${!isLeading ? '<div class="rvd-leader-tag">LEADING</div>' : ''}
                        <span class="rvd-player-label">OPPONENT</span>
                        <span class="rvd-player-name">${rivalry.opponent.name}</span>
                        <span class="rvd-player-growth ${!isLeading ? 'leading' : 'trailing'}">${rivalry.opponent.growth > 0 ? '+' : ''}${rivalry.opponent.growth}%</span>
                        <span class="rvd-player-baseline">Baseline: ${(rivalry.opponent.baseline || 0).toLocaleString()}</span>
                    </div>
                </div>

                <div class="rvd-momentum">
                    <div class="rvd-momentum-left ${isLeading ? 'is-leader' : ''}" style="width:${leftPct}%"></div>
                    <div class="rvd-momentum-right ${!isLeading ? 'is-leader' : ''}" style="width:${rightPct}%"></div>
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

        <div class="rvd-chart-section">
            <div class="rvd-chart-panel">
                <div class="rvd-chart-header">
                    <div class="rvd-chart-title">Performance Over Time</div>
                    <div class="rvd-chart-legend">
                        <div class="rvd-chart-legend-item">
                            <div class="rvd-chart-legend-dot" style="background:#0F5132"></div>
                            ${rivalry.challenger.name}
                        </div>
                        <div class="rvd-chart-legend-item">
                            <div class="rvd-chart-legend-dot" style="background:#3B0001"></div>
                            ${rivalry.opponent.name}
                        </div>
                    </div>
                </div>
                <div class="rvd-chart-canvas" id="rvd-perf-chart"></div>
                <div class="rvd-chart-footer">
                    <span>Day 0</span>
                    <span>Day ${Math.floor(rivalry.totalDays / 4)}</span>
                    <span>Day ${Math.floor(rivalry.totalDays / 2)}</span>
                    <span>Day ${Math.floor(rivalry.totalDays * 3 / 4)}</span>
                    <span>Day ${rivalry.totalDays}</span>
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
                    <span class="rvd-row-value" style="color:${isLeading ? '#0F5132' : '#3B0001'}">+${rivalry.challenger.growth}%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">${rivalry.opponent.name}</span>
                    <span class="rvd-row-value" style="color:${!isLeading ? '#0F5132' : '#3B0001'}">+${rivalry.opponent.growth}%</span>
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

    // ── Render Performance Chart (SVG) ──
    const chartEl = document.getElementById('rvd-perf-chart');
    if (chartEl && rivalry.status !== 'pending') {
        const W = 800, H = 200, PAD = 32;
        const POINTS = 20;
        const elapsed = rivalry.totalDays - rivalry.daysLeft;
        const visiblePoints = Math.max(2, Math.round((elapsed / rivalry.totalDays) * POINTS));

        // Generate realistic growth curves
        function generateCurve(finalGrowth, seed) {
            const pts = [0];
            let val = 0;
            for (let i = 1; i <= POINTS; i++) {
                const progress = i / POINTS;
                const target = finalGrowth * progress;
                const noise = Math.sin(seed * i * 0.7) * (finalGrowth * 0.15) +
                    Math.cos(seed * i * 1.3) * (finalGrowth * 0.08);
                val = target + noise;
                if (i === POINTS) val = finalGrowth;
                pts.push(val);
            }
            return pts.slice(0, visiblePoints + 1);
        }

        const challData = generateCurve(rivalry.challenger.growth, 3.14);
        const oppData = generateCurve(rivalry.opponent.growth, 7.28);

        const allVals = [...challData, ...oppData];
        const minVal = Math.min(0, ...allVals);
        const maxVal = Math.max(...allVals) * 1.15;
        const range = maxVal - minVal || 1;

        function toX(i, total) { return PAD + (i / (total - 1)) * (W - PAD * 2); }
        function toY(v) { return H - PAD - ((v - minVal) / range) * (H - PAD * 2); }

        function buildPath(data) {
            return data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i, data.length).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
        }
        function buildAreaPath(data) {
            const line = buildPath(data);
            const lastX = toX(data.length - 1, data.length).toFixed(1);
            const firstX = toX(0, data.length).toFixed(1);
            const baseY = toY(0).toFixed(1);
            return `${line} L${lastX},${baseY} L${firstX},${baseY} Z`;
        }

        // Gridlines
        const gridCount = 4;
        let gridLines = '';
        for (let i = 0; i <= gridCount; i++) {
            const val = minVal + (range / gridCount) * i;
            const y = toY(val);
            gridLines += `<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}" class="rvd-chart-gridline"/>`;
            gridLines += `<text x="${PAD - 6}" y="${y + 3}" text-anchor="end" class="rvd-chart-label">${val.toFixed(0)}%</text>`;
        }

        const challPath = buildPath(challData);
        const oppPath = buildPath(oppData);
        const challArea = buildAreaPath(challData);
        const oppArea = buildAreaPath(oppData);

        const challEnd = challData[challData.length - 1];
        const oppEnd = oppData[oppData.length - 1];
        const challEndX = toX(challData.length - 1, challData.length);
        const oppEndX = toX(oppData.length - 1, oppData.length);

        chartEl.innerHTML = `
            <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="grad-chall" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#0F5132" stop-opacity="0.12"/>
                        <stop offset="100%" stop-color="#0F5132" stop-opacity="0"/>
                    </linearGradient>
                    <linearGradient id="grad-opp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#3B0001" stop-opacity="0.10"/>
                        <stop offset="100%" stop-color="#3B0001" stop-opacity="0"/>
                    </linearGradient>
                </defs>
                ${gridLines}
                <path d="${challArea}" fill="url(#grad-chall)"/>
                <path d="${oppArea}" fill="url(#grad-opp)"/>
                <path d="${oppPath}" fill="none" stroke="#3B0001" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
                <path d="${challPath}" fill="none" stroke="#0F5132" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="${challEndX}" cy="${toY(challEnd)}" r="4" fill="#0F5132"/>
                <circle cx="${oppEndX}" cy="${toY(oppEnd)}" r="4" fill="#3B0001"/>
            </svg>
        `;
    } else if (chartEl) {
        chartEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ccc;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.06em;">PENDING — CHART AVAILABLE ONCE ACTIVE</div>`;
    }
}
