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
                font-size: 28px; font-weight: 600;
                letter-spacing: -1px; margin-top: 4px;
                line-height: 1.2;
                transition: color .3s;
                font-family: 'JetBrains Mono', monospace;
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

            /* ── Pool / Stakes Hero ── */
            .rvd-pool-hero {
                text-align: center; padding: 28px 0 20px;
            }
            .rvd-pool-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700;
                letter-spacing: 1.5px; color: #bbb;
                text-transform: uppercase; margin-bottom: 6px;
            }
            .rvd-pool-amount {
                font-size: 56px; font-weight: 300;
                letter-spacing: -2px; color: #111;
                line-height: 1.0;
            }
            .rvd-pool-sub {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; color: #999; letter-spacing: 0.06em;
                margin-top: 6px;
            }

            /* ── Collateral Stake Bar ── */
            .rvd-stake-bar {
                display: flex; align-items: center;
                gap: 0; margin-bottom: 20px;
                border: 1px solid #f0f0f0;
                overflow: hidden; height: 44px;
            }
            .rvd-stake-side {
                flex: 1; display: flex; align-items: center;
                justify-content: center; gap: 8px;
                padding: 0 16px; height: 100%;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 700;
                letter-spacing: 0.04em;
                transition: background .3s;
            }
            .rvd-stake-side.challenger {
                background: rgba(15,81,50,0.06); color: #0F5132;
                border-right: 2px solid #0F5132;
            }
            .rvd-stake-side.opponent {
                background: rgba(59,0,1,0.04); color: var(--rvd-brand);
                border-left: 2px solid var(--rvd-brand);
            }
            .rvd-stake-side .rvd-stake-icon {
                width: 6px; height: 6px; border-radius: 50%;
            }
            .rvd-stake-side.challenger .rvd-stake-icon { background: #0F5132; }
            .rvd-stake-side.opponent .rvd-stake-icon { background: var(--rvd-brand); }

            /* ── Countdown Timer ── */
            .rvd-countdown {
                display: flex; align-items: center; justify-content: center;
                gap: 4px; padding: 14px 0;
                margin-bottom: 20px;
                background: #fafafa; border: 1px solid #f0f0f0;
            }
            .rvd-countdown-unit {
                display: flex; flex-direction: column; align-items: center;
                min-width: 52px; padding: 0 8px;
            }
            .rvd-countdown-val {
                font-size: 24px; font-weight: 600; color: #111;
                letter-spacing: -0.5px; line-height: 1.2;
                font-family: 'JetBrains Mono', monospace;
            }
            .rvd-countdown-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 7px; font-weight: 700;
                letter-spacing: 1px; color: #ccc;
                text-transform: uppercase;
            }
            .rvd-countdown-sep {
                font-size: 20px; font-weight: 300; color: #ddd;
                margin-top: -8px;
            }
            .rvd-countdown.urgent .rvd-countdown-val { color: #C41E24; }
            .rvd-countdown.urgent { border-color: rgba(196,30,36,0.15); background: rgba(196,30,36,0.02); }
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

            /* ── Performance Chart — Polymarket-style ── */
            .rvd-chart-section {
                max-width: 1200px; margin: 0 auto; padding: 0 64px 8px;
            }
            .rvd-chart-panel {
                background: #fff; border: 1px solid #eaeaea;
                overflow: hidden;
            }
            .rvd-chart-header {
                display: flex; justify-content: space-between;
                align-items: center; padding: 20px 28px 0;
            }
            .rvd-chart-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700;
                letter-spacing: 1.2px; color: #bbb;
                text-transform: uppercase;
            }
            .rvd-chart-legend { display: flex; gap: 20px; align-items: center; }
            .rvd-chart-legend-item {
                display: flex; align-items: center; gap: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600;
                letter-spacing: 0.04em; color: #666;
            }
            .rvd-chart-legend-dot {
                width: 10px; height: 3px; border-radius: 1px;
            }

            /* Live metric value cards */
            .rvd-chart-metrics {
                display: grid; grid-template-columns: 1fr 1fr;
                gap: 0; border-bottom: 1px solid #f0f0f0;
            }
            .rvd-chart-metric-card {
                padding: 20px 28px;
                display: flex; flex-direction: column; gap: 4px;
            }
            .rvd-chart-metric-card:first-child {
                border-right: 1px solid #f0f0f0;
            }
            .rvd-chart-metric-card.right { text-align: right; }
            .rvd-chart-metric-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700;
                letter-spacing: 1px; color: #bbb;
                text-transform: uppercase;
            }
            .rvd-chart-metric-name {
                font-size: 13px; font-weight: 600; color: #333;
                letter-spacing: -0.2px;
            }
            .rvd-chart-metric-row {
                display: flex; align-items: baseline; gap: 10px;
            }
            .rvd-chart-metric-card.right .rvd-chart-metric-row {
                justify-content: flex-end;
            }
            .rvd-chart-metric-value {
                font-size: 28px; font-weight: 500; color: #111;
                letter-spacing: -1px; line-height: 1.1;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', sans-serif;
            }
            .rvd-chart-metric-change {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 700;
                letter-spacing: 0.02em;
            }
            .rvd-chart-metric-change.positive { color: #0F5132; }
            .rvd-chart-metric-change.negative { color: #C41E24; }
            .rvd-chart-metric-target {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; color: #bbb;
                letter-spacing: 0.5px;
            }

            .rvd-chart-canvas {
                position: relative; height: 320px; width: 100%;
                padding: 0 28px;
                box-sizing: border-box;
            }
            .rvd-chart-canvas svg { width: 100%; height: 100%; }
            .rvd-chart-footer {
                display: flex; justify-content: space-between;
                padding: 8px 28px 16px;
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
                .rvd-player-growth { font-size: 22px; letter-spacing: -0.5px; }
                .rvd-player-avatar { width: 28px; height: 28px; font-size: 11px; }
                .rvd-pool-hero { padding: 20px 0 16px; }
                .rvd-pool-amount { font-size: 38px; }
                .rvd-stake-bar { flex-direction: column; height: auto; }
                .rvd-stake-side { padding: 10px 16px; border: none !important; }
                .rvd-stake-side.challenger { border-bottom: 1px solid #f0f0f0 !important; }
                .rvd-countdown-val { font-size: 20px; }
                .rvd-countdown-unit { min-width: 44px; }
                .rvd-grid { grid-template-columns: 1fr; padding: 24px 20px 40px; gap: 16px; }
                .rvd-share { padding: 0 20px 32px; flex-wrap: wrap; }
                .rvd-warning { padding: 0 20px 32px; }
                .rvd-status-bar { flex-direction: column; align-items: flex-start; gap: 8px; padding: 12px 16px; }
                .rvd-chart-section { padding: 0 20px 8px; }
                .rvd-chart-canvas { height: 220px; padding: 0 16px; }
                .rvd-chart-metrics { grid-template-columns: 1fr 1fr; }
                .rvd-chart-metric-card { padding: 14px 16px; }
                .rvd-chart-metric-value { font-size: 20px; }
                .rvd-chart-header { padding: 16px 16px 0; }
                .rvd-chart-footer { padding: 8px 16px 12px; }
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

        const targetPct = parseFloat(r.targetGrowthPct || r.rivalry?.targetGrowthPct || 15);
        const challBaseline = parseFloat(challPart?.baselineValue || 0);
        const oppBaseline = parseFloat(oppPart?.baselineValue || 0);
        const challGrowth = parseFloat(challPart?.growthPercent || challPart?.percentageDelta || 0);
        const oppGrowth = parseFloat(oppPart?.growthPercent || oppPart?.percentageDelta || 0);
        const challCurrentValue = challBaseline > 0 ? Math.round(challBaseline * (1 + challGrowth / 100)) : 0;
        const oppCurrentValue = oppBaseline > 0 ? Math.round(oppBaseline * (1 + oppGrowth / 100)) : 0;
        const challTargetValue = challBaseline > 0 ? Math.round(challBaseline * (1 + targetPct / 100)) : 0;
        const oppTargetValue = oppBaseline > 0 ? Math.round(oppBaseline * (1 + targetPct / 100)) : 0;
        const prov = PLATFORM_MAP[r.platform] || (r.platform || 'stripe').toLowerCase();
        const isMonetary = prov === 'stripe' || prov === 'shopify' || prov === 'amazon';

        return {
            id: r.id,
            status: STATE_TO_STATUS[r.state] || 'active',
            metric: METRIC_LABELS[r.metricType] || r.metricType || 'Revenue Growth',
            metricType: r.metricType || 'FOLLOWERS',
            provider: prov,
            isMonetary,
            challenger: {
                name: '@' + (r.challengerUsername || 'unknown'),
                growth: challGrowth,
                baseline: challBaseline,
                currentValue: challCurrentValue,
                targetValue: challTargetValue,
            },
            opponent: {
                name: '@' + (r.opponentUsername || 'unknown'),
                growth: oppGrowth,
                baseline: oppBaseline,
                currentValue: oppCurrentValue,
                targetValue: oppTargetValue,
            },
            stake: (r.stakePerSideCents || 0) / 100,
            daysLeft,
            totalDays: r.durationDays || 30,
            targetGrowthPct: targetPct,
            rivalryTier: r.rivalryTier || r.rivalry?.rivalryTier || 'DUEL',
            metrics: r.metrics || [],
            _rawState: r.state,
            _challengerUserId: r.challengerUserId,
            _opponentUserId: r.opponentUserId,
            _activatedAt: r.activatedAt || r.createdAt,
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

    // Format metric values: monetary ($X.XX) vs count (X,XXX)
    function fmtMetric(val) {
        if (!val && val !== 0) return '--';
        if (rivalry.isMonetary) return '$' + (val / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        return Math.round(val).toLocaleString('en-US');
    }
    function metricUnit() {
        const m = rivalry.metricType || '';
        if (m.includes('SUBSCRIBER')) return 'subscribers';
        if (m.includes('FOLLOWER')) return 'followers';
        if (m.includes('VIEW')) return 'views';
        if (m.includes('REVENUE')) return 'revenue';
        if (m.includes('ORDER')) return 'orders';
        if (m.includes('SALE')) return 'sales';
        return 'metric';
    }

    container.innerHTML = `
        <div class="rvd-hero">
            <div class="rvd-hero-inner">
                <div class="rvd-breadcrumb">
                    <a href="#/rivalry">Rivalry</a> <span>/ ${rivalry.id.substring(0, 12)}…</span>
                </div>

                <div class="rvd-pool-hero">
                    <div class="rvd-pool-label">Total Pool At Stake</div>
                    <div class="rvd-pool-amount">$${pool.toLocaleString()}</div>
                    <div class="rvd-pool-sub">$${rivalry.stake.toLocaleString()} per side · ${rivalry.metric} · ${rivalry.totalDays} day window</div>
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
                        <span class="rvd-player-baseline" data-live-role="challenger" style="color:#666;margin-top:6px;">Current: <strong style="color:#111">${fmtMetric(rivalry.challenger.currentValue)}</strong> ${metricUnit()} · Target: <strong style="color:#3B0001">${fmtMetric(rivalry.challenger.targetValue)}</strong></span>
                    </div>
                    <div class="rvd-vs-center rvd-anim-vs">
                        <span class="rvd-vs-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg></span>
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
                        <span class="rvd-player-baseline" data-live-role="opponent" style="color:#666;margin-top:6px;">Current: <strong style="color:#111">${fmtMetric(rivalry.opponent.currentValue)}</strong> ${metricUnit()} · Target: <strong style="color:#3B0001">${fmtMetric(rivalry.opponent.targetValue)}</strong></span>
                    </div>
                </div>

                <div class="rvd-stake-bar">
                    <div class="rvd-stake-side challenger">
                        <span class="rvd-stake-icon"></span>
                        $${rivalry.stake.toLocaleString()} LOCKED · ${rivalry.challenger.name}
                    </div>
                    <div class="rvd-stake-side opponent">
                        $${rivalry.stake.toLocaleString()} LOCKED · ${rivalry.opponent.name}
                        <span class="rvd-stake-icon"></span>
                    </div>
                </div>

                <div class="rvd-momentum">
                    <div class="rvd-momentum-left ${isLeading ? 'is-leader' : ''}" style="width:${leftPct}%"></div>
                    <div class="rvd-momentum-right ${!isLeading ? 'is-leader' : ''}" style="width:${rightPct}%"></div>
                </div>

                <div class="rvd-countdown ${rivalry.daysLeft <= 3 && rivalry.status !== 'settled' ? 'urgent' : ''}" id="rvd-countdown">
                    <div class="rvd-countdown-unit">
                        <span class="rvd-countdown-val" id="rvd-cd-days">${rivalry.daysLeft}</span>
                        <span class="rvd-countdown-label">Days</span>
                    </div>
                    <span class="rvd-countdown-sep">:</span>
                    <div class="rvd-countdown-unit">
                        <span class="rvd-countdown-val" id="rvd-cd-hours">00</span>
                        <span class="rvd-countdown-label">Hours</span>
                    </div>
                    <span class="rvd-countdown-sep">:</span>
                    <div class="rvd-countdown-unit">
                        <span class="rvd-countdown-val" id="rvd-cd-mins">00</span>
                        <span class="rvd-countdown-label">Mins</span>
                    </div>
                    <span class="rvd-countdown-sep">:</span>
                    <div class="rvd-countdown-unit">
                        <span class="rvd-countdown-val" id="rvd-cd-secs">00</span>
                        <span class="rvd-countdown-label">Secs</span>
                    </div>
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
                        ${rivalry.status === 'active' ? `<div class="rvd-chart-legend-item" style="color:#0F5132;font-weight:700"><span style="width:6px;height:6px;border-radius:50%;background:#0F5132;display:inline-block;animation:rvd-skeletonWave 1s infinite;margin-right:4px"></span> LIVE</div>` : ''}
                    </div>
                </div>
                <div class="rvd-chart-metrics">
                    <div class="rvd-chart-metric-card" id="rvd-metric-chall">
                        <div class="rvd-chart-metric-label">Challenger</div>
                        <div class="rvd-chart-metric-name">${rivalry.challenger.name}</div>
                        <div class="rvd-chart-metric-row">
                            <span class="rvd-chart-metric-value">${fmtMetric(rivalry.challenger.currentValue)}</span>
                            <span class="rvd-chart-metric-change ${rivalry.challenger.growth >= 0 ? 'positive' : 'negative'}">${rivalry.challenger.growth >= 0 ? '+' : ''}${rivalry.challenger.growth}%</span>
                        </div>
                        <div class="rvd-chart-metric-target">Target: ${fmtMetric(rivalry.challenger.targetValue)} ${metricUnit()} (+${rivalry.targetGrowthPct}%)</div>
                    </div>
                    <div class="rvd-chart-metric-card right" id="rvd-metric-opp">
                        <div class="rvd-chart-metric-label">Opponent</div>
                        <div class="rvd-chart-metric-name">${rivalry.opponent.name}</div>
                        <div class="rvd-chart-metric-row">
                            <span class="rvd-chart-metric-value">${fmtMetric(rivalry.opponent.currentValue)}</span>
                            <span class="rvd-chart-metric-change ${rivalry.opponent.growth >= 0 ? 'positive' : 'negative'}">${rivalry.opponent.growth >= 0 ? '+' : ''}${rivalry.opponent.growth}%</span>
                        </div>
                        <div class="rvd-chart-metric-target">Target: ${fmtMetric(rivalry.opponent.targetValue)} ${metricUnit()} (+${rivalry.targetGrowthPct}%)</div>
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
                    <span class="rvd-row-label" style="font-size:11px;color:#aaa">${rivalry.challenger.name} current</span>
                    <span class="rvd-row-value" data-perf-role="challenger" style="font-size:13px">${fmtMetric(rivalry.challenger.currentValue)} / ${fmtMetric(rivalry.challenger.targetValue)} ${metricUnit()}</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">${rivalry.opponent.name}</span>
                    <span class="rvd-row-value"><span class="rvd-target-badge ${rivalry.opponent.growth >= rivalry.targetGrowthPct ? 'hit' : 'miss'}"><span class="badge-dot"></span>${rivalry.opponent.growth >= rivalry.targetGrowthPct ? 'HIT' : 'MISS'}</span> +${rivalry.opponent.growth}%</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label" style="font-size:11px;color:#aaa">${rivalry.opponent.name} current</span>
                    <span class="rvd-row-value" data-perf-role="opponent" style="font-size:13px">${fmtMetric(rivalry.opponent.currentValue)} / ${fmtMetric(rivalry.opponent.targetValue)} ${metricUnit()}</span>
                </div>
                <div class="rvd-row">
                    <span class="rvd-row-label">Growth Target</span>
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

    // ── Live Oracle Preview — Fetch real metrics for current user ──
    // The oracle preview returns the logged-in user's live metric from their connected account.
    // We use this to populate real numbers before the rivalry tracker snapshots baselines.
    (async () => {
        try {
            // Get current user ID from appState (set during session hydration)
            const currentUserId = window.appState?.userId;
            if (!currentUserId) {
                console.log('[RivalryDetail] No userId in appState, skipping oracle preview');
                return;
            }

            // Determine if current user is challenger or opponent
            let myRole = null;
            if (currentUserId === rivalry._challengerUserId) myRole = 'challenger';
            else if (currentUserId === rivalry._opponentUserId) myRole = 'opponent';
            if (!myRole) {
                console.log('[RivalryDetail] Current user is not a participant, skipping oracle');
                return;
            }

            // Map rivalry metricType to oracle metric key
            const METRIC_TO_KEY = {
                SUBSCRIBERS: 'subscribers', FOLLOWERS: 'followers',
                REVENUE: 'revenue', VIEWS: 'views',
                GROSS_SALES: 'shopify_revenue', ORDER_COUNT: 'orders',
            };
            const oracleMetric = METRIC_TO_KEY[rivalry.metricType] || rivalry.metricType?.toLowerCase() || 'followers';

            console.log(`[RivalryDetail] Fetching oracle preview: provider=${rivalry.provider}, metric=${oracleMetric}, role=${myRole}`);
            const data = await api.getProviderPreview(rivalry.provider, oracleMetric);
            console.log('[RivalryDetail] Oracle preview result:', data);

            if (data && data.status !== 'error' && data.current_baseline !== undefined) {
                const liveBaseline = data.current_baseline || 0;
                const targetPct = rivalry.targetGrowthPct;
                const liveTarget = Math.round(liveBaseline * (1 + targetPct / 100));
                const fmtLive = (v) => {
                    if (rivalry.isMonetary) return '$' + (v / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    return Math.round(v).toLocaleString('en-US');
                };
                const unit = metricUnit();

                // Calculate live growth % (current vs baseline at rivalry start)
                const rivalryBaseline = myRole === 'challenger' ? rivalry.challenger.baseline : rivalry.opponent.baseline;
                let liveGrowthPct = 0;
                if (rivalryBaseline > 0) {
                    liveGrowthPct = ((liveBaseline - rivalryBaseline) / rivalryBaseline * 100);
                }
                const growthSign = liveGrowthPct >= 0 ? '+' : '';
                const growthClass = liveGrowthPct >= 0 ? 'positive' : 'negative';

                // Update hero card metric line for this user's role
                document.querySelectorAll(`[data-live-role="${myRole}"]`).forEach(el => {
                    el.innerHTML = `Current: <strong style="color:#111">${fmtLive(liveBaseline)}</strong> ${unit} · Target: <strong style="color:#3B0001">${fmtLive(liveTarget)}</strong>`;
                });

                // Update performance panel for this user's role
                document.querySelectorAll(`[data-perf-role="${myRole}"]`).forEach(el => {
                    el.textContent = `${fmtLive(liveBaseline)} / ${fmtLive(liveTarget)} ${unit}`;
                });

                // Update chart metric cards with live data
                const metricCardId = myRole === 'challenger' ? 'rvd-metric-chall' : 'rvd-metric-opp';
                const metricCard = document.getElementById(metricCardId);
                if (metricCard) {
                    metricCard.querySelector('.rvd-chart-metric-value').textContent = fmtLive(liveBaseline);
                    const changeEl = metricCard.querySelector('.rvd-chart-metric-change');
                    if (changeEl) {
                        changeEl.textContent = `${growthSign}${liveGrowthPct.toFixed(1)}%`;
                        changeEl.className = `rvd-chart-metric-change ${growthClass}`;
                    }
                    const targetEl = metricCard.querySelector('.rvd-chart-metric-target');
                    if (targetEl) {
                        targetEl.textContent = `Target: ${fmtLive(liveTarget)} ${unit} (+${targetPct}%)`;
                    }
                }

                console.log(`[RivalryDetail] ✅ Updated ${myRole} metrics: baseline=${liveBaseline}, target=${liveTarget}, growth=${liveGrowthPct.toFixed(1)}%`);

                // Re-render chart with updated data so race bars reflect live values
                if (chartEl && rivalry.status !== 'pending') {
                    renderLiveChart(rivalry.metrics, rivalry._challengerUserId, rivalry._opponentUserId, rivalry.targetGrowthPct);
                }
            }
        } catch (err) {
            console.warn('[RivalryDetail] Oracle preview fetch failed:', err.message);
        }
    })();

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

        // If no time-series data, show race-to-target visualization using available baseline data
        if (challPoints.length === 0 && oppPoints.length === 0) {
            // Use whatever data we have from rivalry baselines or oracle
            const challGrowth = parseFloat(document.querySelector('#rvd-metric-chall .rvd-chart-metric-change')?.textContent || '0');
            const oppGrowth = parseFloat(document.querySelector('#rvd-metric-opp .rvd-chart-metric-change')?.textContent || '0');
            
            const W = 900, H = 280, PAD_L = 50, PAD_R = 80;
            const barH = 36, barGap = 24, startY = 60;
            const maxPct = Math.max(targetPct, Math.abs(challGrowth), Math.abs(oppGrowth), 5);
            const barWidth = W - PAD_L - PAD_R;
            
            const challW = Math.max(2, (Math.abs(challGrowth) / maxPct) * barWidth);
            const oppW = Math.max(2, (Math.abs(oppGrowth) / maxPct) * barWidth);
            const targetX = PAD_L + (targetPct / maxPct) * barWidth;
            
            const challColor = challGrowth >= oppGrowth ? '#0F5132' : '#C41E24';
            const oppColor = oppGrowth >= challGrowth ? '#0F5132' : '#C41E24';

            chartEl.innerHTML = `
                <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%">
                    <defs>
                        <linearGradient id="grad-chall-bar" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="${challColor}" stop-opacity="0.9"/>
                            <stop offset="100%" stop-color="${challColor}" stop-opacity="0.6"/>
                        </linearGradient>
                        <linearGradient id="grad-opp-bar" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="${oppColor}" stop-opacity="0.9"/>
                            <stop offset="100%" stop-color="${oppColor}" stop-opacity="0.6"/>
                        </linearGradient>
                    </defs>
                    
                    <!-- Title -->
                    <text x="${PAD_L}" y="30" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#bbb" letter-spacing="1.2px">RACE TO TARGET · +${targetPct}%</text>
                    
                    <!-- Challenger bar -->
                    <text x="${PAD_L}" y="${startY - 6}" font-family="JetBrains Mono, monospace" font-size="9" fill="#888" font-weight="600" letter-spacing="0.5px">CHALLENGER</text>
                    <rect x="${PAD_L}" y="${startY}" width="${barWidth}" height="${barH}" fill="#f5f5f5" rx="3"/>
                    <rect x="${PAD_L}" y="${startY}" width="${challW}" height="${barH}" fill="url(#grad-chall-bar)" rx="3">
                        <animate attributeName="width" from="0" to="${challW}" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
                    </rect>
                    <text x="${PAD_L + challW + 8}" y="${startY + barH/2 + 4}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="${challColor}">${challGrowth >= 0 ? '+' : ''}${challGrowth.toFixed(1)}%</text>
                    
                    <!-- Opponent bar -->
                    <text x="${PAD_L}" y="${startY + barH + barGap - 6}" font-family="JetBrains Mono, monospace" font-size="9" fill="#888" font-weight="600" letter-spacing="0.5px">OPPONENT</text>
                    <rect x="${PAD_L}" y="${startY + barH + barGap}" width="${barWidth}" height="${barH}" fill="#f5f5f5" rx="3"/>
                    <rect x="${PAD_L}" y="${startY + barH + barGap}" width="${oppW}" height="${barH}" fill="url(#grad-opp-bar)" rx="3">
                        <animate attributeName="width" from="0" to="${oppW}" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
                    </rect>
                    <text x="${PAD_L + oppW + 8}" y="${startY + barH + barGap + barH/2 + 4}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="${oppColor}">${oppGrowth >= 0 ? '+' : ''}${oppGrowth.toFixed(1)}%</text>
                    
                    <!-- Target line -->
                    <line x1="${targetX}" y1="${startY - 14}" x2="${targetX}" y2="${startY + barH*2 + barGap + 10}" stroke="#3B0001" stroke-width="2" stroke-dasharray="6 4" opacity="0.5"/>
                    <rect x="${targetX - 32}" y="${startY + barH*2 + barGap + 16}" width="64" height="18" rx="3" fill="#3B0001" opacity="0.85"/>
                    <text x="${targetX}" y="${startY + barH*2 + barGap + 29}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#fff">+${targetPct}% TARGET</text>
                    
                    <!-- Bottom note -->
                    <text x="${W/2}" y="${H - 20}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#ccc" letter-spacing="0.5px">Time-series chart populates as metric snapshots accumulate</text>
                </svg>`;
            return;
        }

        const W = 900, H = 320, PAD_L = 50, PAD_R = 80, PAD_T = 20, PAD_B = 20;

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
            // Polymarket-style stepped line
            let d = `M${toX(pts[0].t.getTime()).toFixed(1)},${toY(pts[0].pct).toFixed(1)}`;
            for (let i = 1; i < pts.length; i++) {
                const x = toX(pts[i].t.getTime()).toFixed(1);
                const y = toY(pts[i].pct).toFixed(1);
                const prevY = toY(pts[i-1].pct).toFixed(1);
                d += ` L${x},${prevY} L${x},${y}`;
            }
            return d;
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
            gridSvg += `<line x1="${PAD_L}" y1="${y}" x2="${W - PAD_R}" y2="${y}" stroke="#f0f0f0" stroke-width="1" stroke-dasharray="4 4"/>`;
            gridSvg += `<text x="${PAD_L - 8}" y="${y + 4}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9" fill="#ccc" font-weight="500">${pct.toFixed(0)}%</text>`;
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
            // Extend line to right edge
            endDots += `<line x1="${cx}" y1="${cy}" x2="${W - PAD_R}" y2="${cy}" stroke="${challColor}" stroke-width="1" stroke-dasharray="3 3" opacity="0.4"/>`;
            endDots += `<circle cx="${cx}" cy="${cy}" r="5" fill="${challColor}" stroke="#fff" stroke-width="2" filter="url(#dot-glow)"/>`;
            // Right-side label badge
            endDots += `<rect x="${W - PAD_R + 4}" y="${parseFloat(cy) - 10}" width="68" height="20" rx="3" fill="${challColor}" opacity="0.9"/>`;
            endDots += `<text x="${W - PAD_R + 38}" y="${parseFloat(cy) + 3.5}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#fff">${challEnd.pct >= 0 ? '+' : ''}${challEnd.pct.toFixed(1)}%</text>`;
        }
        if (oppEnd) {
            const cx = toX(oppEnd.t.getTime()).toFixed(1);
            const cy = toY(oppEnd.pct).toFixed(1);
            endDots += `<line x1="${cx}" y1="${cy}" x2="${W - PAD_R}" y2="${cy}" stroke="${oppColor}" stroke-width="1" stroke-dasharray="3 3" opacity="0.4"/>`;
            endDots += `<circle cx="${cx}" cy="${cy}" r="5" fill="${oppColor}" stroke="#fff" stroke-width="2" filter="url(#dot-glow)"/>`;
            endDots += `<rect x="${W - PAD_R + 4}" y="${parseFloat(cy) - 10}" width="68" height="20" rx="3" fill="${oppColor}" opacity="0.9"/>`;
            endDots += `<text x="${W - PAD_R + 38}" y="${parseFloat(cy) + 3.5}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#fff">${oppEnd.pct >= 0 ? '+' : ''}${oppEnd.pct.toFixed(1)}%</text>`;
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
        const W = 900, H = 220;
        chartEl.innerHTML = `
            <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%">
                <text x="${W/2}" y="30" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#ddd" letter-spacing="1.2px">AWAITING ACTIVATION</text>
                <rect x="50" y="50" width="770" height="32" rx="3" fill="#f5f5f5"/>
                <rect x="50" y="50" width="50" height="32" rx="3" fill="#e8e8e8" opacity="0.5">
                    <animate attributeName="width" values="50;120;50" dur="2s" repeatCount="indefinite"/>
                </rect>
                <rect x="50" y="100" width="770" height="32" rx="3" fill="#f5f5f5"/>
                <rect x="50" y="100" width="30" height="32" rx="3" fill="#e8e8e8" opacity="0.5">
                    <animate attributeName="width" values="30;80;30" dur="2s" repeatCount="indefinite"/>
                </rect>
                <text x="${W/2}" y="${H - 20}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#ddd" letter-spacing="0.5px">Chart activates once both sides fund their position</text>
            </svg>`;
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

    // ── Live Countdown Timer ──
    if (rivalry.status !== 'settled' && rivalry.daysLeft > 0) {
        const start = new Date(rivalry._activatedAt || Date.now());
        const endTime = new Date(start.getTime() + (rivalry.totalDays) * 86400000).getTime();

        function updateCountdown() {
            const now = Date.now();
            const diff = Math.max(0, endTime - now);
            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            const pad = (n) => String(n).padStart(2, '0');
            
            const dEl = document.getElementById('rvd-cd-days');
            const hEl = document.getElementById('rvd-cd-hours');
            const mEl = document.getElementById('rvd-cd-mins');
            const sEl = document.getElementById('rvd-cd-secs');
            if (dEl) dEl.textContent = days;
            if (hEl) hEl.textContent = pad(hours);
            if (mEl) mEl.textContent = pad(mins);
            if (sEl) sEl.textContent = pad(secs);

            // Urgency class
            const cdEl = document.getElementById('rvd-countdown');
            if (cdEl && days <= 3) cdEl.classList.add('urgent');

            if (diff <= 0) {
                clearInterval(cdInterval);
                if (dEl) dEl.textContent = '0';
                if (hEl) hEl.textContent = '00';
                if (mEl) mEl.textContent = '00';
                if (sEl) sEl.textContent = '00';
            }
        }
        updateCountdown();
        const cdInterval = setInterval(updateCountdown, 1000);
        window.addEventListener('hashchange', () => clearInterval(cdInterval), { once: true });
    }
}
