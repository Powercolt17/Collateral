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
                @keyframes rvd-gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes rvd-slideInLeft { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
                @keyframes rvd-slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
                @keyframes rvd-scaleIn { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
                @keyframes rvd-skeletonWave { 0%{opacity:0.3} 50%{opacity:0.6} 100%{opacity:0.3} }
                .rvd-anim { animation: rvd-fadeUp .4s var(--rvd-ease) both; }
                .rvd-anim-left { animation: rvd-slideInLeft .6s var(--rvd-ease) both; }
                .rvd-anim-right { animation: rvd-slideInRight .6s var(--rvd-ease) .15s both; }
                .rvd-anim-vs { animation: rvd-scaleIn .5s var(--rvd-ease) .08s both; }
                .rvd-anim-delay-1 { animation-delay: .2s; }
                .rvd-anim-delay-2 { animation-delay: .35s; }
                .rvd-anim-delay-3 { animation-delay: .5s; }
                .rvd-anim-delay-4 { animation-delay: .65s; }
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
            .rvd-player-header {
                display: flex; align-items: center; gap: 12px;
                margin-bottom: 4px;
            }
            .rvd-player.right .rvd-player-header {
                flex-direction: row-reverse;
            }
            .rvd-player-avatar {
                width: 36px; height: 36px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                font-family: 'JetBrains Mono', monospace;
                font-size: 14px; font-weight: 800; color: #fff;
                flex-shrink: 0;
            }
            .rvd-player-avatar.challenger { background: var(--rvd-green); }
            .rvd-player-avatar.opponent { background: var(--rvd-brand); }
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
                font-size: 64px; font-weight: 200;
                letter-spacing: -3px; margin-top: 4px;
                line-height: 1.0;
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
                flex-direction: column; gap: 4px;
                width: 80px; flex-shrink: 0;
                background: linear-gradient(180deg, #f5f0f0 0%, #ece6e6 100%);
                border-left: 1px solid #ebebeb;
                border-right: 1px solid #ebebeb;
            }
            .rvd-vs-icon {
                font-size: 28px; line-height: 1;
                filter: drop-shadow(0 1px 2px rgba(59,0,1,0.15));
            }
            .rvd-vs-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 800;
                color: #bbb; letter-spacing: 0.14em;
            }

            /* Momentum Bar */
            .rvd-momentum {
                height: 8px; display: flex;
                overflow: hidden; margin-bottom: 24px;
                background: #f0f0f0; border-radius: 4px;
                box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
            }
            .rvd-momentum-left {
                background: linear-gradient(90deg, #0a7a4a, #10b981);
                transition: width .8s var(--rvd-ease);
                border-radius: 4px 0 0 4px;
                position: relative;
            }
            .rvd-momentum-left::after {
                content: ''; position: absolute; right: 0; top: 0;
                width: 20px; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3));
            }
            .rvd-momentum-right {
                background: linear-gradient(90deg, #5a1718, #3B0001);
                transition: width .8s var(--rvd-ease);
                border-radius: 0 4px 4px 0;
            }
            .rvd-momentum-labels {
                display: flex; justify-content: space-between;
                margin-top: -20px; margin-bottom: 20px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700;
                letter-spacing: 0.08em; color: #bbb;
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
                padding: 16px 24px;
                background: rgba(250,250,250,0.85);
                backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(240,240,240,0.8);
                border-radius: 2px;
            }
            .rvd-status-badge {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700;
                letter-spacing: 0.1em; text-transform: uppercase;
                display: flex; align-items: center; gap: 8px;
            }
            .rvd-status-badge .dot {
                width: 9px; height: 9px;
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
                display: inline-flex; align-items: center; padding: 4px 12px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 700; letter-spacing: 0.08em;
                color: #fff; text-transform: uppercase; border-radius: 3px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.12);
            }
            .rvd-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; color: var(--rvd-muted);
                letter-spacing: 0.04em;
            }
            .rvd-time.urgent { color: var(--rvd-red); font-weight: 700; }

            /* ── Target Badge (replaces emoji) ── */
            .rvd-target-badge {
                display: inline-flex; align-items: center; gap: 4px;
                padding: 2px 8px; border-radius: 3px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700;
                letter-spacing: 0.06em;
            }
            .rvd-target-badge.hit {
                background: rgba(15,81,50,0.08); color: #0F5132;
            }
            .rvd-target-badge.miss {
                background: rgba(59,0,1,0.06); color: #3B0001;
            }
            .rvd-target-badge .badge-dot {
                width: 5px; height: 5px; border-radius: 50%;
            }
            .rvd-target-badge.hit .badge-dot { background: #0F5132; }
            .rvd-target-badge.miss .badge-dot { background: #3B0001; }

            /* ── Panel Icons ── */
            .rvd-panel-header {
                display: flex; align-items: center; gap: 8px;
                margin-bottom: 20px;
            }
            .rvd-panel-icon {
                font-size: 14px; opacity: 0.7;
            }

            /* ── Warning Row ── */
            .rvd-row-warning {
                background: rgba(59,0,1,0.03);
                border: 1px solid rgba(59,0,1,0.08);
                border-radius: 3px; margin-top: 4px;
                padding: 10px 12px !important;
            }
            .rvd-row-warning .rvd-row-value {
                color: #3B0001; font-weight: 700;
            }

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
                transition: all .3s var(--rvd-ease);
            }
            .rvd-panel:hover {
                box-shadow: 0 8px 28px rgba(0,0,0,0.06);
                border-left-color: rgba(59,0,1,0.35);
                transform: translateY(-2px);
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
                height: 52px; padding: 0 40px;
                border: none; cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 700;
                letter-spacing: 0.1em; text-transform: uppercase;
                transition: all .25s var(--rvd-ease);
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                border-radius: 2px;
            }
            .rvd-action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.12);
            }
            .rvd-action-btn:active { transform: scale(0.98); }
            .rvd-action-btn:disabled {
                opacity: 0.5; cursor: not-allowed;
                transform: none; box-shadow: none;
            }
            .rvd-action-btn.accept {
                background: linear-gradient(135deg, #0F5132, #10b981);
                background-size: 200% 200%;
                color: #fff;
            }
            @media(prefers-reduced-motion:no-preference){
                .rvd-action-btn.accept { animation: rvd-gradientShift 3s ease infinite; }
            }
            .rvd-action-btn.accept:hover { box-shadow: 0 6px 24px rgba(15,81,50,0.3); }
            .rvd-action-btn.decline {
                background: #fff; color: var(--rvd-brand);
                border: 1.5px solid var(--rvd-brand);
            }
            .rvd-action-btn.decline:hover { background: rgba(59,0,1,0.04); }
            .rvd-action-btn.fund {
                background: linear-gradient(135deg, #111, #333);
                background-size: 200% 200%;
                color: #fff;
            }
            @media(prefers-reduced-motion:no-preference){
                .rvd-action-btn.fund { animation: rvd-gradientShift 3s ease infinite; }
            }
            .rvd-action-btn.fund:hover { background: var(--rvd-brand); box-shadow: 0 6px 24px rgba(59,0,1,0.25); }
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
                height: 42px; padding: 0 28px;
                border: 1px solid #e5e5e5; background: #fff;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600;
                letter-spacing: 0.08em; text-transform: uppercase;
                color: #888; cursor: pointer;
                transition: all .2s var(--rvd-ease);
                border-radius: 2px;
            }
            .rvd-share-btn:hover {
                border-color: #111; color: #111;
                box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                transform: translateY(-1px);
            }

            /* ── Warning ── */
            .rvd-warning {
                max-width: 1200px; margin: 0 auto;
                padding: 0 64px 40px;
            }
            .rvd-warning-inner {
                display: flex; align-items: center; gap: 14px;
                background: linear-gradient(135deg, rgba(59,0,1,0.03), rgba(59,0,1,0.06));
                padding: 18px 28px;
                border: 1px solid rgba(59,0,1,0.08);
                border-left: 3px solid rgba(59,0,1,0.25);
                border-radius: 2px;
            }
            .rvd-warning-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600;
                letter-spacing: 0.10em; color: #666;
                text-transform: uppercase;
                line-height: 1.6;
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
                .rvd-player-growth { font-size: 42px; letter-spacing: -1.5px; }
                .rvd-player-avatar { width: 28px; height: 28px; font-size: 11px; }
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
            targetGrowthPct: parseFloat(r.targetGrowthPct || r.rivalry?.targetGrowthPct || 15),
            rivalryTier: r.rivalryTier || r.rivalry?.rivalryTier || 'DUEL',
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
                    <div class="rvd-player rvd-anim-left">
                        ${isLeading ? '<div class="rvd-leader-tag">LEADING</div>' : ''}
                        <div class="rvd-player-header">
                            <div class="rvd-player-avatar challenger">${rivalry.challenger.name.replace('@','').charAt(0).toUpperCase()}</div>
                            <div>
                                <span class="rvd-player-label">CHALLENGER</span>
                                <span class="rvd-player-name">${rivalry.challenger.name}</span>
                            </div>
                        </div>
                        <span class="rvd-player-growth ${isLeading ? 'leading' : 'trailing'}">${rivalry.challenger.growth > 0 ? '+' : ''}${rivalry.challenger.growth}%</span>
                        <span class="rvd-player-baseline"><span class="rvd-target-badge ${rivalry.challenger.growth >= rivalry.targetGrowthPct ? 'hit' : 'miss'}"><span class="badge-dot"></span>${rivalry.challenger.growth >= rivalry.targetGrowthPct ? 'ON TARGET' : 'BELOW TARGET'}</span> +${rivalry.targetGrowthPct}%</span>
                    </div>
                    <div class="rvd-vs-center rvd-anim-vs">
                        <span class="rvd-vs-icon">⚔</span>
                        <span class="rvd-vs-text">DUEL</span>
                    </div>
                    <div class="rvd-player right rvd-anim-right">
                        ${!isLeading ? '<div class="rvd-leader-tag">LEADING</div>' : ''}
                        <div class="rvd-player-header">
                            <div class="rvd-player-avatar opponent">${rivalry.opponent.name.replace('@','').charAt(0).toUpperCase()}</div>
                            <div>
                                <span class="rvd-player-label">OPPONENT</span>
                                <span class="rvd-player-name">${rivalry.opponent.name}</span>
                            </div>
                        </div>
                        <span class="rvd-player-growth ${!isLeading ? 'leading' : 'trailing'}">${rivalry.opponent.growth > 0 ? '+' : ''}${rivalry.opponent.growth}%</span>
                        <span class="rvd-player-baseline"><span class="rvd-target-badge ${rivalry.opponent.growth >= rivalry.targetGrowthPct ? 'hit' : 'miss'}"><span class="badge-dot"></span>${rivalry.opponent.growth >= rivalry.targetGrowthPct ? 'ON TARGET' : 'BELOW TARGET'}</span> +${rivalry.targetGrowthPct}%</span>
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
                            <div class="rvd-chart-legend-dot" style="background:${isLeading ? '#0F5132' : '#C41E24'}"></div>
                            ${rivalry.challenger.name}
                        </div>
                        <div class="rvd-chart-legend-item">
                            <div class="rvd-chart-legend-dot" style="background:${!isLeading ? '#0F5132' : '#C41E24'}"></div>
                            ${rivalry.opponent.name}
                        </div>
                        ${rivalry.status === 'active' ? `<div class="rvd-chart-legend-item" style="color:#0F5132;font-weight:600"><span style="width:6px;height:6px;border-radius:50%;background:#0F5132;display:inline-block;animation:rvd-skeletonWave 1s infinite;margin-right:4px"></span> LIVE</div>` : ''}
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
            <div class="rvd-panel rvd-anim rvd-anim-delay-1">
                <div class="rvd-panel-header">
                    <span class="rvd-panel-icon">📋</span>
                    <div class="rvd-panel-title" style="margin-bottom:0">Contract Terms</div>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Tier</span>
                    <span class="rvd-row-value">${rivalry.rivalryTier}</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Growth Target</span>
                    <span class="rvd-row-value" style="color:#3B0001;font-weight:700">+${rivalry.targetGrowthPct}%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Stake Per Side</span>
                    <span class="rvd-row-value">$${rivalry.stake.toLocaleString()}</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Combined Pool</span>
                    <span class="rvd-row-value" style="font-size:15px;font-weight:800">$${pool.toLocaleString()}</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Duration</span>
                    <span class="rvd-row-value">${rivalry.totalDays} days</span>
                </div>
                <div class="rvd-row rvd-row-warning">
                    <span class="rvd-row-label" style="color:#3B0001;font-weight:600">⚠ If Both Miss</span>
                    <span class="rvd-row-value">Protocol Keeps Pool</span>
                </div>
            </div>

            <div class="rvd-panel rvd-anim rvd-anim-delay-2">
                <div class="rvd-panel-header">
                    <span class="rvd-panel-icon">📊</span>
                    <div class="rvd-panel-title" style="margin-bottom:0">Current Performance</div>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">${rivalry.challenger.name}</span>
                    <span class="rvd-row-value"><span class="rvd-target-badge ${rivalry.challenger.growth >= rivalry.targetGrowthPct ? 'hit' : 'miss'}"><span class="badge-dot"></span>${rivalry.challenger.growth >= rivalry.targetGrowthPct ? 'HIT' : 'MISS'}</span> +${rivalry.challenger.growth}%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">${rivalry.opponent.name}</span>
                    <span class="rvd-row-value"><span class="rvd-target-badge ${rivalry.opponent.growth >= rivalry.targetGrowthPct ? 'hit' : 'miss'}"><span class="badge-dot"></span>${rivalry.opponent.growth >= rivalry.targetGrowthPct ? 'HIT' : 'MISS'}</span> +${rivalry.opponent.growth}%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Target</span>
                    <span class="rvd-row-value" style="font-weight:700;color:#3B0001">+${rivalry.targetGrowthPct}%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Time Remaining</span>
                    <span class="rvd-row-value ${rivalry.daysLeft <= 3 && rivalry.daysLeft > 0 ? 'urgent' : ''}">${rivalry.daysLeft <= 0 ? 'Completed' : rivalry.daysLeft + 'd ' + Math.floor(Math.random()*23) + 'h'}</span>
                </div>
            </div>

            <div class="rvd-panel rvd-anim rvd-anim-delay-3">
                <div class="rvd-panel-header">
                    <span class="rvd-panel-icon">⚖️</span>
                    <div class="rvd-panel-title" style="margin-bottom:0">Settlement Rules</div>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Method</span>
                    <span class="rvd-row-value">Target Growth Comparison</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Both Hit Target</span>
                    <span class="rvd-row-value" style="color:var(--rvd-green)">Draw — Stakes Returned</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">One Hits Target</span>
                    <span class="rvd-row-value" style="font-weight:700">Winner Takes Pool</span>
                </div>
                <div class="rvd-row rvd-row-warning">
                    <span class="rvd-row-label" style="color:#3B0001;font-weight:600">Both Miss Target</span>
                    <span class="rvd-row-value">Protocol Keeps Pool</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Appeals</span>
                    <span class="rvd-row-value">None — Final</span>
                </div>
            </div>

            <div class="rvd-panel rvd-anim rvd-anim-delay-4">
                <div class="rvd-panel-header">
                    <span class="rvd-panel-icon">✓</span>
                    <div class="rvd-panel-title" style="margin-bottom:0">Verification</div>
                </div>
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
                    <span class="rvd-row-value" style="color:var(--rvd-green);font-weight:700">Immutable ✓</span>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C1414" stroke-width="2" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <div class="rvd-warning-text">Capital is locked until settlement. Automatic execution. No appeals. No reversals. This record is immutable.</div>
            </div>
        </div>
    `;

    // ── Render Performance Chart (SVG) — Uses Live Metric Data ──
    const chartEl = document.getElementById('rvd-perf-chart');

    function renderLiveChart(metricsData, challUserId, oppUserId, targetPct) {
        if (!chartEl) return;

        // Parse metric snapshots into per-user time series
        const challPoints = [];
        const oppPoints = [];
        let challBaseline = null;
        let oppBaseline = null;

        (metricsData || []).forEach(m => {
            const val = parseFloat(m.metricValue || m.metric_value || 0);
            const ts = new Date(m.fetchedAt || m.fetched_at);
            if (m.userId === challUserId || m.user_id === challUserId) {
                if (challBaseline === null) challBaseline = val;
                challPoints.push({ t: ts, v: val, pct: challBaseline ? ((val - challBaseline) / challBaseline) * 100 : 0 });
            } else if (m.userId === oppUserId || m.user_id === oppUserId) {
                if (oppBaseline === null) oppBaseline = val;
                oppPoints.push({ t: ts, v: val, pct: oppBaseline ? ((val - oppBaseline) / oppBaseline) * 100 : 0 });
            }
        });

        // Sort by timestamp
        challPoints.sort((a, b) => a.t - b.t);
        oppPoints.sort((a, b) => a.t - b.t);

        // If no data, show the skeleton
        if (challPoints.length === 0 && oppPoints.length === 0) {
            chartEl.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;">
                    <div style="display:flex;align-items:flex-end;gap:10px;height:60px;">
                        <div style="width:8px;height:20px;background:linear-gradient(180deg,#0F5132 0%,#0F513220 100%);border-radius:2px;animation:rvd-skeletonWave 1.5s infinite"></div>
                        <div style="width:8px;height:36px;background:linear-gradient(180deg,#3B0001 0%,#3B000120 100%);border-radius:2px;animation:rvd-skeletonWave 1.5s .2s infinite"></div>
                        <div style="width:8px;height:28px;background:linear-gradient(180deg,#0F5132 0%,#0F513220 100%);border-radius:2px;animation:rvd-skeletonWave 1.5s .4s infinite"></div>
                        <div style="width:8px;height:48px;background:linear-gradient(180deg,#3B0001 0%,#3B000120 100%);border-radius:2px;animation:rvd-skeletonWave 1.5s .6s infinite"></div>
                        <div style="width:8px;height:16px;background:linear-gradient(180deg,#0F5132 0%,#0F513220 100%);border-radius:2px;animation:rvd-skeletonWave 1.5s .8s infinite"></div>
                    </div>
                    <span style="color:#999;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase">AWAITING METRIC DATA</span>
                    <span style="color:#ccc;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.06em">Live tracking begins once the duel is active</span>
                </div>`;
            return;
        }

        const W = 800, H = 240, PAD_L = 50, PAD_R = 16, PAD_T = 16, PAD_B = 28;

        // Determine who's leading for color assignment
        const challCurrent = challPoints.length > 0 ? challPoints[challPoints.length - 1].pct : 0;
        const oppCurrent = oppPoints.length > 0 ? oppPoints[oppPoints.length - 1].pct : 0;
        const challLeading = challCurrent >= oppCurrent;

        // Leader = green (#0F5132), trailer = red (#3B0001)
        const challColor = challLeading ? '#0F5132' : '#C41E24';
        const oppColor = !challLeading ? '#0F5132' : '#C41E24';
        const challGradColor = challLeading ? '#0F5132' : '#C41E24';
        const oppGradColor = !challLeading ? '#0F5132' : '#C41E24';

        // Combine all pct values for scale
        const allPcts = [...challPoints.map(p => p.pct), ...oppPoints.map(p => p.pct), 0, targetPct];
        const minPct = Math.min(...allPcts) - 2;
        const maxPct = Math.max(...allPcts) + 2;
        const range = maxPct - minPct || 1;

        // Time range
        const allTimes = [...challPoints.map(p => p.t.getTime()), ...oppPoints.map(p => p.t.getTime())];
        const tMin = Math.min(...allTimes);
        const tMax = Math.max(...allTimes);
        const tRange = tMax - tMin || 1;

        function toX(t) { return PAD_L + ((t - tMin) / tRange) * (W - PAD_L - PAD_R); }
        function toY(pct) { return PAD_T + ((maxPct - pct) / range) * (H - PAD_T - PAD_B); }

        function buildPath(pts) {
            if (pts.length === 0) return '';
            return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.t.getTime()).toFixed(1)},${toY(p.pct).toFixed(1)}`).join(' ');
        }
        function buildAreaPath(pts) {
            if (pts.length === 0) return '';
            const line = buildPath(pts);
            const lastX = toX(pts[pts.length - 1].t.getTime()).toFixed(1);
            const firstX = toX(pts[0].t.getTime()).toFixed(1);
            const baseY = toY(0).toFixed(1);
            return `${line} L${lastX},${baseY} L${firstX},${baseY} Z`;
        }

        // Gridlines
        const gridCount = 5;
        let gridSvg = '';
        for (let i = 0; i <= gridCount; i++) {
            const pct = minPct + (range / gridCount) * i;
            const y = toY(pct);
            gridSvg += `<line x1="${PAD_L}" y1="${y}" x2="${W - PAD_R}" y2="${y}" stroke="#f0f0f0" stroke-width="1"/>`;
            gridSvg += `<text x="${PAD_L - 8}" y="${y + 4}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9" fill="#bbb" font-weight="500">${pct.toFixed(0)}%</text>`;
        }

        // Zero line
        const zeroY = toY(0);
        gridSvg += `<line x1="${PAD_L}" y1="${zeroY}" x2="${W - PAD_R}" y2="${zeroY}" stroke="#ddd" stroke-width="1.5"/>`;

        // Target line
        const targetY = toY(targetPct);
        gridSvg += `<line x1="${PAD_L}" y1="${targetY}" x2="${W - PAD_R}" y2="${targetY}" stroke="#3B0001" stroke-width="1" stroke-dasharray="6 4" opacity="0.5"/>`;
        gridSvg += `<text x="${W - PAD_R + 4}" y="${targetY + 3}" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#3B0001" opacity="0.6">TARGET +${targetPct}%</text>`;

        const challPath = buildPath(challPoints);
        const oppPath = buildPath(oppPoints);
        const challArea = buildAreaPath(challPoints);
        const oppArea = buildAreaPath(oppPoints);

        // End dots
        const challEnd = challPoints.length > 0 ? challPoints[challPoints.length - 1] : null;
        const oppEnd = oppPoints.length > 0 ? oppPoints[oppPoints.length - 1] : null;

        let endDots = '';
        if (challEnd) {
            const cx = toX(challEnd.t.getTime()).toFixed(1);
            const cy = toY(challEnd.pct).toFixed(1);
            endDots += `<circle cx="${cx}" cy="${cy}" r="6" fill="${challColor}" stroke="#fff" stroke-width="2.5" filter="url(#dot-glow)"/>`;
            endDots += `<text x="${parseFloat(cx) + 10}" y="${parseFloat(cy) + 4}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${challColor}">${challEnd.pct >= 0 ? '+' : ''}${challEnd.pct.toFixed(1)}%</text>`;
        }
        if (oppEnd) {
            const cx = toX(oppEnd.t.getTime()).toFixed(1);
            const cy = toY(oppEnd.pct).toFixed(1);
            endDots += `<circle cx="${cx}" cy="${cy}" r="6" fill="${oppColor}" stroke="#fff" stroke-width="2.5" filter="url(#dot-glow)"/>`;
            endDots += `<text x="${parseFloat(cx) + 10}" y="${parseFloat(cy) + 4}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${oppColor}">${oppEnd.pct >= 0 ? '+' : ''}${oppEnd.pct.toFixed(1)}%</text>`;
        }

        // Pulse animation on leading dot
        const pulseColor = challLeading ? challColor : oppColor;
        const pulseEnd = challLeading ? challEnd : oppEnd;
        let pulseSvg = '';
        if (pulseEnd) {
            const px = toX(pulseEnd.t.getTime()).toFixed(1);
            const py = toY(pulseEnd.pct).toFixed(1);
            pulseSvg = `<circle cx="${px}" cy="${py}" r="6" fill="none" stroke="${pulseColor}" stroke-width="2" opacity="0.4"><animate attributeName="r" from="6" to="18" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite"/></circle>`;
        }

        chartEl.innerHTML = `
            <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%">
                <defs>
                    <linearGradient id="grad-chall-live" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${challGradColor}" stop-opacity="0.15"/>
                        <stop offset="100%" stop-color="${challGradColor}" stop-opacity="0"/>
                    </linearGradient>
                    <linearGradient id="grad-opp-live" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${oppGradColor}" stop-opacity="0.12"/>
                        <stop offset="100%" stop-color="${oppGradColor}" stop-opacity="0"/>
                    </linearGradient>
                    <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="glow"/>
                        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>
                ${gridSvg}
                ${challArea ? `<path d="${challArea}" fill="url(#grad-chall-live)"/>` : ''}
                ${oppArea ? `<path d="${oppArea}" fill="url(#grad-opp-live)"/>` : ''}
                ${oppPath ? `<path d="${oppPath}" fill="none" stroke="${oppColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>` : ''}
                ${challPath ? `<path d="${challPath}" fill="none" stroke="${challColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
                ${pulseSvg}
                ${endDots}
            </svg>`;
    }

    // Initial render
    if (rivalry.status !== 'pending') {
        renderLiveChart(rivalry.metrics, rivalry._challengerUserId, rivalry._opponentUserId, rivalry.targetGrowthPct);
    } else if (chartEl) {
        chartEl.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;">
                <div style="display:flex;align-items:flex-end;gap:10px;height:60px;">
                    <div style="width:8px;height:20px;background:linear-gradient(180deg,#0F5132 0%,#0F513220 100%);border-radius:2px;animation:rvd-skeletonWave 1.5s infinite"></div>
                    <div style="width:8px;height:36px;background:linear-gradient(180deg,#3B0001 0%,#3B000120 100%);border-radius:2px;animation:rvd-skeletonWave 1.5s .2s infinite"></div>
                    <div style="width:8px;height:28px;background:linear-gradient(180deg,#0F5132 0%,#0F513220 100%);border-radius:2px;animation:rvd-skeletonWave 1.5s .4s infinite"></div>
                    <div style="width:8px;height:48px;background:linear-gradient(180deg,#3B0001 0%,#3B000120 100%);border-radius:2px;animation:rvd-skeletonWave 1.5s .6s infinite"></div>
                    <div style="width:8px;height:16px;background:linear-gradient(180deg,#0F5132 0%,#0F513220 100%);border-radius:2px;animation:rvd-skeletonWave 1.5s .8s infinite"></div>
                </div>
                <span style="color:#999;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase">AWAITING ACTIVATION</span>
                <span style="color:#ccc;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.06em">Chart data will populate once both sides fund</span>
            </div>`;
    }

    // ── Live Auto-Refresh (60s polling) ──
    if (rivalry.status === 'active' && rivalry._rawState && !['SETTLED','DRAW','DECLINED','EXPIRED','CANCELLED'].includes(rivalry._rawState)) {
        let pollCount = 0;
        const pollInterval = setInterval(async () => {
            pollCount++;
            try {
                // Update the LIVE badge
                const legendEl = document.querySelector('.rvd-chart-header');
                if (legendEl) {
                    let liveTag = legendEl.querySelector('.rvd-live-refresh');
                    if (!liveTag) {
                        liveTag = document.createElement('span');
                        liveTag.className = 'rvd-live-refresh';
                        liveTag.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:9px;color:#0F5132;letter-spacing:0.06em;display:flex;align-items:center;gap:4px;';
                        legendEl.appendChild(liveTag);
                    }
                    liveTag.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:#0F5132;display:inline-block;animation:rvd-skeletonWave 1s infinite"></span> LIVE · Refreshing...`;
                }

                const res = await api.getRivalryMetrics(id);
                if (res.ok && res.metrics) {
                    renderLiveChart(res.metrics, rivalry._challengerUserId, rivalry._opponentUserId, rivalry.targetGrowthPct);
                }

                // Update live badge with timestamp
                const liveTag = document.querySelector('.rvd-live-refresh');
                if (liveTag) {
                    const now = new Date();
                    liveTag.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:#0F5132;display:inline-block;animation:rvd-skeletonWave 1s infinite"></span> LIVE · Updated ${now.toLocaleTimeString()}`;
                }
            } catch (err) {
                console.warn('[RivalryDetail] Metric poll failed:', err.message);
            }
        }, 60000); // 60 seconds

        // Cleanup on navigation
        window.addEventListener('hashchange', () => clearInterval(pollInterval), { once: true });
    }

    // ── Action Bar — accept/decline/fund ──
    const actionsEl = document.getElementById('rvd-actions');
    if (actionsEl && rivalry._rawState) {
        const userId = window.appState?.userId;
        const rawState = rivalry._rawState;
        const isOpponent = rivalry._opponentUserId && userId === rivalry._opponentUserId;
        const isChallenger = rivalry._challengerUserId && userId === rivalry._challengerUserId;
        const isOpenChallenge = !rivalry._opponentUserId;

        if (rawState === 'CHALLENGE_ISSUED' && isOpponent) {
            // Directed challenge — designated opponent sees ACCEPT/DECLINE
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
        } else if (rawState === 'CHALLENGE_ISSUED' && isOpenChallenge && userId && !isChallenger) {
            // Open challenge — any logged-in non-challenger can accept
            actionsEl.innerHTML = `
                <button class="rvd-action-btn accept" id="rvd-accept">⚡ ACCEPT OPEN CHALLENGE</button>
                <span class="rvd-action-status">This is an open challenge. Accept to lock capital and begin the duel.</span>
            `;
            document.getElementById('rvd-accept')?.addEventListener('click', async (e) => {
                e.target.disabled = true; e.target.textContent = 'ACCEPTING...';
                try {
                    const res = await api.acceptRivalry(id);
                    if (res.ok) { await showAlert('Challenge accepted! Fund your side to begin.', { type: 'success', title: 'Challenge Accepted' }); location.reload(); }
                    else showAlert(res.error || 'Failed to accept', { type: 'error' });
                } catch (err) { showAlert('Error: ' + err.message, { type: 'error' }); }
                e.target.disabled = false; e.target.textContent = '⚡ ACCEPT OPEN CHALLENGE';
            });
        } else if (rawState === 'CHALLENGE_ISSUED' && isOpenChallenge && !userId) {
            // Open challenge — not logged in
            actionsEl.innerHTML = `
                <button class="rvd-action-btn accept" onclick="window.app.openAccessModal()">SIGN IN TO ACCEPT</button>
                <span class="rvd-action-status">Sign in to accept this open challenge.</span>
            `;
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
