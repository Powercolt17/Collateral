// RivalryDetail.js — /rivalry/:id detail page
// Spectator-grade view of a single head-to-head duel

import api from '../api.js';
import { showAlert, showConfirm } from '../modal.js';

export function renderRivalryDetail() {
    return `
        <style>
            :root {
                --rvd-ease: cubic-bezier(0.4, 0, 0.2, 1);
                --rvd-dur: 0.25s;
                --rvd-brand: #3B0001;
                --rvd-green: #0F5132;
                --rvd-red: #EF4444;
                --rvd-muted: #999;
            }
            .rvd {
                background: #fff;
                min-height: calc(100vh - 72px);
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
            }

            @media (prefers-reduced-motion: no-preference) {
                @keyframes rvd-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.35} }
                @keyframes rvd-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes rvd-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
                @keyframes rvd-glow { 0%,100%{box-shadow:0 0 8px rgba(16,185,129,0.2)} 50%{box-shadow:0 0 16px rgba(16,185,129,0.35)} }
                .rvd-anim { animation: rvd-fadeUp .4s var(--rvd-ease) both; }
            }

            /* ── Hero VS Header ── */
            .rvd-hero {
                position: relative; overflow: hidden;
                border-bottom: 1px solid #f0f0f0;
            }
            .rvd-hero::before {
                content: ''; position: absolute;
                top: -20%; left: 50%; transform: translateX(-50%);
                width: 120%; height: 140%;
                background: radial-gradient(ellipse at 30% 40%, rgba(59,0,1,0.05) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(59,0,1,0.03) 0%, transparent 50%);
                pointer-events: none;
            }
            .rvd-hero-inner {
                max-width: 1200px; margin: 0 auto;
                padding: 48px 64px 40px; position: relative;
            }
            .rvd-breadcrumb {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700;
                letter-spacing: 0.12em; color: #ccc;
                text-transform: uppercase; margin-bottom: 28px;
            }
            .rvd-breadcrumb a {
                color: #ccc; text-decoration: none;
                transition: color .15s;
            }
            .rvd-breadcrumb a:hover { color: #888; }
            .rvd-breadcrumb span { color: var(--rvd-brand); }

            .rvd-vs-strip {
                display: flex; align-items: stretch;
                background: #fafafa;
                border: 1px solid #f0f0f0;
                overflow: hidden; margin-bottom: 20px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                transition: box-shadow var(--rvd-dur) var(--rvd-ease);
            }
            .rvd-vs-strip:hover {
                box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            }
            .rvd-player {
                flex: 1; padding: 36px 40px;
                display: flex; flex-direction: column; gap: 6px;
            }
            .rvd-player.right {
                text-align: right; border-left: 1px solid #f0f0f0;
            }
            .rvd-player-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700;
                letter-spacing: 0.12em; color: #bbb;
                text-transform: uppercase;
            }
            .rvd-player-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 18px; font-weight: 600;
                color: #111; letter-spacing: 0.02em;
            }
            .rvd-player-growth {
                font-size: 52px; font-weight: 200;
                letter-spacing: -2px; margin-top: 4px;
                line-height: 1.05;
                transition: color .3s;
            }
            .rvd-player-growth.leading {
                color: var(--rvd-green);
            }
            .rvd-player-growth.trailing { color: var(--rvd-brand); }
            .rvd-player-baseline {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; color: #bbb;
                letter-spacing: 0.04em; margin-top: 4px;
            }
            .rvd-leader-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 700;
                letter-spacing: 0.14em; text-transform: uppercase;
                color: var(--rvd-green); margin-bottom: 4px;
                display: inline-flex; align-items: center; gap: 5px;
            }
            .rvd-leader-tag::before {
                content: ''; width: 5px; height: 5px;
                border-radius: 50%; background: var(--rvd-green);
            }

            .rvd-vs-center {
                display: flex; align-items: center; justify-content: center;
                width: 72px; flex-shrink: 0;
                background: linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%);
                border-left: 1px solid #ebebeb;
                border-right: 1px solid #ebebeb;
            }
            .rvd-vs-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 14px; font-weight: 800;
                color: #bbb; letter-spacing: 0.08em;
            }

            /* Momentum Bar */
            .rvd-momentum {
                height: 6px; display: flex;
                overflow: hidden; margin-bottom: 24px;
                background: #f0f0f0; border-radius: 3px;
            }
            .rvd-momentum-left {
                background: var(--rvd-green);
                transition: width .6s var(--rvd-ease);
                border-radius: 3px 0 0 3px;
            }
            .rvd-momentum-right {
                background: var(--rvd-brand);
                transition: width .6s var(--rvd-ease);
                border-radius: 0 3px 3px 0;
            }
            @media(prefers-reduced-motion:no-preference){
                .rvd-momentum-left.is-leader { animation: rvd-glow 2s infinite; }
                .rvd-momentum-right.is-leader { animation: rvd-glow 2s infinite; }
            }

            /* ── Performance Chart ── */
            .rvd-chart-section {
                max-width: 1200px; margin: 0 auto; padding: 0 64px 8px;
            }
            .rvd-chart-panel {
                background: #fafafa; border: 1px solid #f0f0f0;
                padding: 28px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.03);
            }
            .rvd-chart-header {
                display: flex; justify-content: space-between;
                align-items: center; margin-bottom: 20px;
            }
            .rvd-chart-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700;
                letter-spacing: 0.12em; color: #bbb;
                text-transform: uppercase;
            }
            .rvd-chart-legend { display: flex; gap: 16px; }
            .rvd-chart-legend-item {
                display: flex; align-items: center; gap: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 600;
                letter-spacing: 0.06em; color: #999;
            }
            .rvd-chart-legend-dot {
                width: 8px; height: 8px; border-radius: 50%;
            }
            .rvd-chart-canvas {
                position: relative; height: 200px; width: 100%;
            }
            .rvd-chart-canvas svg { width: 100%; height: 100%; }
            .rvd-chart-gridline { stroke: #f0f0f0; stroke-width: 1; }
            .rvd-chart-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; fill: #ccc;
            }
            .rvd-chart-footer {
                display: flex; justify-content: space-between; margin-top: 8px;
            }
            .rvd-chart-footer span {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; color: #ccc; letter-spacing: 0.04em;
            }
            .rvd-chart-pending {
                display: flex; align-items: center; justify-content: center;
                height: 100%; color: #ccc;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; letter-spacing: 0.06em;
            }

            /* ── Status Bar ── */
            .rvd-status-bar {
                display: flex; align-items: center;
                justify-content: space-between; gap: 24px;
                padding: 16px 20px;
                background: #fafafa; border: 1px solid #f0f0f0;
            }
            .rvd-status-badge {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700;
                letter-spacing: 0.1em; text-transform: uppercase;
                display: flex; align-items: center; gap: 8px;
            }
            .rvd-status-badge .dot {
                width: 7px; height: 7px;
                border-radius: 50%; background: var(--rvd-green);
            }
            @media(prefers-reduced-motion:no-preference){
                .rvd-status-badge .dot { animation: rvd-pulse 1.8s infinite; }
            }
            .rvd-status-badge.live { color: var(--rvd-green); }
            .rvd-status-badge.ended { color: var(--rvd-muted); }
            .rvd-status-badge.ended .dot { background: var(--rvd-muted); animation: none; }
            .rvd-status-badge.pending { color: #f59e0b; }
            .rvd-status-badge.pending .dot { background: #f59e0b; animation: none; }
            .rvd-status-info {
                display: flex; gap: 12px; align-items: center;
            }
            .rvd-provider-pill {
                display: inline-flex; align-items: center; padding: 3px 10px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 700; letter-spacing: 0.08em;
                color: #fff; text-transform: uppercase; border-radius: 2px;
            }
            .rvd-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; color: var(--rvd-muted);
                letter-spacing: 0.04em;
            }
            .rvd-time.urgent { color: var(--rvd-red); font-weight: 700; }

            /* ── Detail Grid ── */
            .rvd-grid {
                max-width: 1200px; margin: 0 auto;
                padding: 32px 64px 48px;
                display: grid; grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            .rvd-panel {
                background: #fff; border: 1px solid #f0f0f0;
                padding: 28px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.03);
                border-left: 3px solid #f0f0f0;
                transition: all var(--rvd-dur) var(--rvd-ease);
            }
            .rvd-panel:hover {
                box-shadow: 0 4px 16px rgba(0,0,0,0.05);
                border-left-color: rgba(59,0,1,0.2);
            }
            .rvd-panel-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700;
                letter-spacing: 0.12em; color: var(--rvd-brand);
                text-transform: uppercase; margin-bottom: 20px;
                opacity: 0.6;
            }
            .rvd-row {
                display: flex; justify-content: space-between;
                align-items: center; padding: 10px 0;
                border-bottom: 1px solid #f8f8f8;
            }
            .rvd-row:last-child { border-bottom: none; }
            .rvd-row-label { font-size: 13px; color: #888; }
            .rvd-row-value {
                font-size: 14px; font-weight: 600; color: #111;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.02em;
            }

            /* ── Action Bar ── */
            .rvd-actions {
                max-width: 1200px; margin: 0 auto;
                padding: 0 64px 24px;
                display: flex; gap: 12px; align-items: center;
            }
            .rvd-action-btn {
                height: 48px; padding: 0 36px;
                border: none; cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 700;
                letter-spacing: 0.1em; text-transform: uppercase;
                transition: all var(--rvd-dur) var(--rvd-ease);
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }
            .rvd-action-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            }
            .rvd-action-btn:active { transform: scale(0.98); }
            .rvd-action-btn:disabled {
                opacity: 0.5; cursor: not-allowed;
                transform: none; box-shadow: none;
            }
            .rvd-action-btn.accept {
                background: var(--rvd-green); color: #fff;
            }
            .rvd-action-btn.accept:hover { background: #0e9f6e; }
            .rvd-action-btn.decline {
                background: #fff; color: var(--rvd-brand);
                border: 1px solid var(--rvd-brand);
            }
            .rvd-action-btn.decline:hover { background: rgba(59,0,1,0.04); }
            .rvd-action-btn.fund {
                background: #111; color: #fff;
            }
            .rvd-action-btn.fund:hover { background: var(--rvd-brand); }
            .rvd-action-status {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600;
                letter-spacing: 0.08em; color: var(--rvd-muted);
                text-transform: uppercase;
            }

            /* ── Share Section ── */
            .rvd-share {
                max-width: 1200px; margin: 0 auto;
                padding: 0 64px 40px;
                display: flex; gap: 8px;
            }
            .rvd-share-btn {
                height: 40px; padding: 0 24px;
                border: 1px solid #e5e5e5; background: #fff;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600;
                letter-spacing: 0.08em; text-transform: uppercase;
                color: #888; cursor: pointer;
                transition: all .15s;
            }
            .rvd-share-btn:hover {
                border-color: #111; color: #111;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }

            /* ── Warning ── */
            .rvd-warning {
                max-width: 1200px; margin: 0 auto;
                padding: 0 64px 40px; text-align: center;
            }
            .rvd-warning-inner {
                display: inline-flex; align-items: center; gap: 10px;
                background: rgba(59,0,1,0.03); padding: 14px 28px;
                border: 1px solid rgba(59,0,1,0.06);
            }
            .rvd-warning-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600;
                letter-spacing: 0.12em; color: var(--rvd-muted);
                text-transform: uppercase;
            }

            /* ── Loading ── */
            .rvd-loading {
                text-align: center; padding: 120px 20px; color: #ccc;
            }
            .rvd-loading-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px; letter-spacing: 0.08em;
            }
            .rvd-skel-bar {
                background: linear-gradient(90deg, #f5f5f5 0%, #ececec 40%, #f5f5f5 80%);
                background-size: 800px 100%; border-radius: 3px;
            }
            @media(prefers-reduced-motion:no-preference){
                .rvd-skel-bar { animation: rvd-shimmer 1.5s infinite linear; }
            }

            /* ── Responsive ── */
            @media (max-width: 768px) {
                .rvd-hero-inner { padding: 36px 20px 32px; }
                .rvd-vs-strip { flex-direction: column; }
                .rvd-player { padding: 24px 20px; }
                .rvd-player.right { text-align: left; border-left: none; border-top: 1px solid #f0f0f0; }
                .rvd-vs-center { width: 100%; height: 36px; border-left: none; border-right: none; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; }
                .rvd-player-growth { font-size: 36px; letter-spacing: -1px; }
                .rvd-grid { grid-template-columns: 1fr; padding: 24px 20px 40px; gap: 16px; }
                .rvd-share { padding: 0 20px 32px; flex-wrap: wrap; }
                .rvd-warning { padding: 0 20px 32px; }
                .rvd-status-bar { flex-direction: column; align-items: flex-start; gap: 8px; padding: 12px 16px; }
                .rvd-chart-section { padding: 0 20px 8px; }
                .rvd-chart-canvas { height: 160px; }
                .rvd-actions { padding: 0 20px 24px; flex-wrap: wrap; }
                .rvd-action-btn { width: 100%; text-align: center; display: flex; align-items: center; justify-content: center; }
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
    const METRIC_LABELS = { REVENUE: 'Revenue Growth', FOLLOWERS: 'Follower Growth', SUBSCRIBERS: 'Subscriber Growth', VIEWS: 'Views Growth', GROSS_SALES: 'Sales Growth', ORDER_COUNT: 'Order Growth' };
    const PLATFORM_MAP = { STRIPE: 'stripe', X: 'x', YOUTUBE: 'youtube', SHOPIFY: 'shopify', AMAZON: 'amazon' };

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
            _rawState: r.state,
            _challengerUserId: r.challengerUserId,
            _opponentUserId: r.opponentUserId,
        };
    }

    // ── Fetch live rivalry ──
    let rivalry = null;
    try {
        const res = await api.getRivalry(id);
        if (res.ok && res.rivalry) {
            rivalry = transformDetail(res.rivalry);
            console.log(`[RivalryDetail] Loaded live rivalry ${id}`);
        }
    } catch (e) {
        console.log('[RivalryDetail] API error:', e.message);
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

    function getProviderColor(p) {
        const c = { stripe: '#635bff', x: '#111', youtube: '#ff0000', shopify: '#96bf48', amazon: '#ff9900' };
        return c[p] || '#111';
    }

    container.innerHTML = `
        <div class="rvd-hero">
            <div class="rvd-hero-inner">
                <div class="rvd-breadcrumb">
                    <a href="#/rivalry">Rivalry</a> <span>/ ${rivalry.id.substring(0, 12)}…</span>
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
                        ${statusLabel} · ${rivalry.metric}
                    </div>
                    <div class="rvd-status-info">
                        <span class="rvd-provider-pill" style="background:${getProviderColor(rivalry.provider)}">${rivalry.provider.toUpperCase()}</span>
                        <span class="rvd-time${rivalry.daysLeft <= 3 && rivalry.status !== 'settled' ? ' urgent' : ''}">${timeLabel}</span>
                    </div>
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

        <div class="rvd-actions" id="rvd-actions">
            <!-- Dynamically populated based on state and user role -->
        </div>

        <div class="rvd-share">
            <button class="rvd-share-btn" onclick="navigator.clipboard.writeText(window.location.href).then(()=>window.CollateralModal.showAlert('Link copied!', { type: 'success', title: 'Copied' }))">COPY LINK</button>
            <button class="rvd-share-btn" onclick="window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent('${rivalry.challenger.name} vs ${rivalry.opponent.name} — $${pool.toLocaleString()} at stake. ${rivalry.metric}. ' + window.location.href))">SHARE ON X</button>
        </div>

        <div class="rvd-warning">
            <div class="rvd-warning-inner">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <div class="rvd-warning-text">Capital is locked. Settlement is automatic and final. No appeals. No reversals.</div>
            </div>
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

    // ── Action Bar — accept/decline/fund ──
    const actionsEl = document.getElementById('rvd-actions');
    if (actionsEl && rivalry._rawState) {
        const userId = window.appState?.userId;
        const rawState = rivalry._rawState;
        const isOpponent = rivalry._opponentUserId && userId === rivalry._opponentUserId;
        const isChallenger = rivalry._challengerUserId && userId === rivalry._challengerUserId;

        if (rawState === 'CHALLENGE_ISSUED' && isOpponent) {
            actionsEl.innerHTML = `
                <button class="rvd-action-btn accept" id="rvd-accept">ACCEPT CHALLENGE</button>
                <button class="rvd-action-btn decline" id="rvd-decline">DECLINE</button>
                <span class="rvd-action-status">You have been challenged. Accept to lock capital.</span>
            `;
            document.getElementById('rvd-accept')?.addEventListener('click', async (e) => {
                e.target.disabled = true; e.target.textContent = 'ACCEPTING...';
                try {
                    const res = await api.acceptRivalry(id);
                    if (res.ok) { await showAlert('Challenge accepted! Fund your side to begin.', { type: 'success', title: 'Challenge Accepted' }); location.reload(); }
                    else showAlert(res.error || 'Failed to accept', { type: 'error' });
                } catch (err) { showAlert('Error: ' + err.message, { type: 'error' }); }
                e.target.disabled = false; e.target.textContent = 'ACCEPT CHALLENGE';
            });
            document.getElementById('rvd-decline')?.addEventListener('click', async (e) => {
                if (!(await showConfirm('Are you sure? This cannot be undone.', { title: 'Decline Challenge', confirmText: 'DECLINE', danger: true }))) return;
                e.target.disabled = true; e.target.textContent = 'DECLINING...';
                try {
                    const res = await api.declineRivalry(id);
                    if (res.ok) { await showAlert('Challenge declined.', { type: 'info', title: 'Declined' }); window.location.hash = '/rivalry'; }
                    else showAlert(res.error || 'Failed to decline', { type: 'error' });
                } catch (err) { showAlert('Error: ' + err.message, { type: 'error' }); }
                e.target.disabled = false; e.target.textContent = 'DECLINE';
            });
        } else if (rawState === 'ACCEPTED' && (isChallenger || isOpponent)) {
            actionsEl.innerHTML = `
                <button class="rvd-action-btn fund" id="rvd-fund">FUND YOUR SIDE — $${rivalry.stake.toLocaleString()}</button>
                <span class="rvd-action-status">Both sides must fund before the duel begins.</span>
            `;
            document.getElementById('rvd-fund')?.addEventListener('click', async (e) => {
                e.target.disabled = true; e.target.textContent = 'FUNDING...';
                try {
                    const res = await api.fundRivalry(id);
                    if (res.ok) { await showAlert('Funded! Waiting for opponent to fund.', { type: 'success', title: 'Funded' }); location.reload(); }
                    else showAlert(res.error || 'Failed to fund', { type: 'error' });
                } catch (err) { showAlert('Error: ' + err.message, { type: 'error' }); }
                e.target.disabled = false; e.target.textContent = `FUND YOUR SIDE — $${rivalry.stake.toLocaleString()}`;
            });
        } else if (rawState === 'CHALLENGE_ISSUED' && isChallenger) {
            actionsEl.innerHTML = `<span class="rvd-action-status">WAITING FOR OPPONENT TO ACCEPT</span>`;
        } else if (rawState === 'BOTH_FUNDED' || rawState === 'ACTIVE' || rawState === 'VERIFYING') {
            actionsEl.innerHTML = `<span class="rvd-action-status">DUEL IN PROGRESS — ${rivalry.daysLeft}d REMAINING</span>`;
        } else if (rawState === 'SETTLED' || rawState === 'DRAW') {
            actionsEl.innerHTML = `<span class="rvd-action-status">SETTLED — ${rawState === 'DRAW' ? 'DRAW' : 'WINNER DETERMINED'}</span>`;
        }
    } else if (actionsEl && rivalry.status === 'pending') {
        actionsEl.innerHTML = `<span class="rvd-action-status">CHALLENGE PENDING — WAITING FOR RESPONSE</span>`;
    } else if (actionsEl && rivalry.status === 'active') {
        actionsEl.innerHTML = `<span class="rvd-action-status">DUEL ACTIVE — ${rivalry.daysLeft}d REMAINING</span>`;
    } else if (actionsEl && rivalry.status === 'settled') {
        actionsEl.innerHTML = `<span class="rvd-action-status">SETTLED — FINAL</span>`;
    }
}
