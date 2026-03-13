// Rivalry.js — Head-to-Head Performance Duels
// Institutional design matching existing Collateral aesthetic

import api from '../api.js';
import { showAlert } from '../modal.js';

export function renderRivalry() {
    return `
        <style>
            /* ============================================================
               RIVALRY MODE — HEAD-TO-HEAD DUELS
               Premium Financial Terminal Aesthetic
               ============================================================ */
            :root {
                --rv-ease: cubic-bezier(0.4, 0, 0.2, 1);
                --rv-dur: 0.25s;
                --rv-brand: #3B0001;
                --rv-green: #0F5132;
                --rv-red: #EF4444;
                --rv-amber: #F59E0B;
                --rv-muted: #999;
            }

            .rv {
                background: #fff;
                min-height: calc(100vh - 72px);
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
                display: flex;
                flex-direction: column;
            }

            /* ── Animations ── */
            @media (prefers-reduced-motion: no-preference) {
                @keyframes rv-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.35} }
                @keyframes rv-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes rv-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
                @keyframes rv-pendingPulse { 0%,100%{opacity:1} 50%{opacity:.55} }
                @keyframes rv-aurora { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                .rv-reveal { opacity:0; transform:translateY(16px); transition:opacity .5s var(--rv-ease), transform .5s var(--rv-ease); }
                .rv-reveal.visible { opacity:1; transform:translateY(0); }
            }

            /* ── Hero ── */
            .rv-hero {
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
                position: relative;
                overflow: hidden;
            }
            .rv-hero::before {
                content: '';
                position: absolute;
                top: -20%;
                left: 50%;
                transform: translateX(-50%);
                width: 120%;
                height: 140%;
                background: radial-gradient(ellipse at 30% 40%, rgba(59,0,1,0.05) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(59,0,1,0.03) 0%, transparent 50%);
                pointer-events: none;
            }
            .rv-hero-inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 58px 64px 58px;
                position: relative;
            }
            .rv-breadcrumb {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.12em;
                color: #ccc;
                text-transform: uppercase;
                margin-bottom: 24px;
            }
            .rv-breadcrumb span { color: var(--rv-brand); }
            .rv-hero-row {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 48px;
            }
            .rv-hero-left { flex: 1; }
            .rv-hero-title {
                font-size: 56px;
                font-weight: 300;
                color: #111;
                letter-spacing: -2px;
                margin: 0 0 20px;
                line-height: 1.08;
            }
            .rv-hero-title strong {
                font-weight: 600;
                color: var(--rv-brand);
                font-size: 1.05em;
            }
            .rv-hero-sub {
                font-size: 15px;
                color: #888;
                line-height: 1.6;
                max-width: 560px;
                margin: 0 0 20px;
            }
            .rv-hero-rule {
                width: 48px; height: 2px; background: var(--rv-brand); opacity: 0.25;
            }
            .rv-hero-right { display: flex; gap: 12px; flex-shrink: 0; }
            .rv-btn-challenge {
                height: 48px; padding: 0 36px;
                background: #111; color: #fff; border: none;
                font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase; cursor: pointer;
                transition: all var(--rv-dur) var(--rv-ease);
                display: flex; align-items: center; gap: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            .rv-btn-challenge:hover {
                background: var(--rv-brand);
                transform: scale(1.02);
                box-shadow: 0 4px 16px rgba(59,0,1,0.15);
            }
            .rv-btn-challenge:active { transform: scale(0.98); }

            /* ── Stats Strip ── */
            .rv-stats {
                display: flex; gap: 0; margin-top: 36px;
                border-top: 1px solid #f0f0f0;
            }
            .rv-stat-group {
                flex: 1; padding: 24px 0;
                border-right: 1px solid #f0f0f0;
                position: relative;
            }
            .rv-stat-group:last-child { border-right: none; }
            .rv-stat-group::before {
                content: ''; position: absolute; left: 0; top: 24px; bottom: 24px;
                width: 2px; background: var(--rv-brand); opacity: 0.2;
            }
            .rv-stat-group:first-child::before { display: none; }
            .rv-stat-group:not(:first-child) { padding-left: 32px; }
            .rv-stat-val {
                font-size: 40px; font-weight: 300; color: #111; letter-spacing: -1px;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                line-height: 1;
            }
            .rv-stat-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 600; letter-spacing: 0.12em;
                color: #bbb; text-transform: uppercase; margin-top: 8px;
            }

            /* ── Controls ── */
            .rv-controls {
                max-width: 1440px; margin: 0 auto; padding: 28px 64px 0;
                display: flex; align-items: center; justify-content: space-between;
                gap: 24px; width: 100%; box-sizing: border-box;
            }
            .rv-tabs { display: flex; gap: 32px; }
            .rv-tab {
                background: none; border: none;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
                text-transform: uppercase; color: #bbb; cursor: pointer;
                padding: 8px 0; border-bottom: 2px solid transparent;
                transition: color .15s, border-color .15s;
            }
            .rv-tab:hover { color: #666; }
            .rv-tab.active { color: #111; border-bottom-color: var(--rv-brand); }
            .rv-search-box {
                height: 38px; padding: 0 14px; border: 1px solid #e5e5e5;
                border-radius: 6px; font-size: 13px; color: #111; background: #fff;
                outline: none; width: 240px;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                transition: border-color .15s, box-shadow .15s;
            }
            .rv-search-box:focus { border-color: var(--rv-brand); box-shadow: 0 0 0 2px rgba(59,0,1,0.06); }

            /* ── Rivalry Cards Grid ── */
            .rv-grid-container {
                max-width: 1440px; margin: 0 auto; padding: 28px 64px 60px;
                width: 100%; box-sizing: border-box;
            }
            .rv-count {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; color: #ccc; margin-bottom: 20px;
            }
            .rv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

            /* ── Skeleton Cards ── */
            .rv-skeleton {
                background: #fff; border: 1px solid #f0f0f0; padding: 28px;
                border-left: 3px solid #f0f0f0;
            }
            .rv-skel-bar {
                background: linear-gradient(90deg, #f5f5f5 0%, #ececec 40%, #f5f5f5 80%);
                background-size: 800px 100%;
                border-radius: 3px;
            }
            @media(prefers-reduced-motion:no-preference){
                .rv-skel-bar { animation: rv-shimmer 1.5s infinite linear; }
            }

            /* ── Rivalry Card ── */
            .rv-card {
                background: #fff; border: 1px solid #f0f0f0; padding: 28px;
                transition: all var(--rv-dur) var(--rv-ease);
                cursor: pointer; position: relative; overflow: hidden;
                box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                border-left: 3px solid var(--rv-green);
            }
            .rv-card[data-status="pending"] { border-left-color: var(--rv-amber); }
            .rv-card[data-status="settled"] { border-left-color: var(--rv-muted); }
            .rv-card:hover {
                border-color: rgba(59,0,1,0.2); border-left-color: inherit;
                box-shadow: 0 8px 30px rgba(0,0,0,0.08);
                transform: translateY(-2px);
            }
            .rv-card:active { transform: scale(0.995); }
            /* Live card subtle aurora */
            @media(prefers-reduced-motion:no-preference){
                .rv-card[data-status="active"] {
                    background: linear-gradient(135deg, #fff 0%, rgba(16,185,129,0.015) 50%, #fff 100%);
                    background-size: 200% 200%;
                    animation: rv-aurora 8s ease infinite;
                }
            }
            .rv-card-header {
                display: flex; align-items: center; justify-content: space-between;
                margin-bottom: 16px;
            }
            .rv-card-status {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
                text-transform: uppercase; color: var(--rv-green);
                display: flex; align-items: center; gap: 6px;
            }
            .rv-card-status .dot {
                width: 6px; height: 6px; border-radius: 50%;
                background: var(--rv-green);
            }
            @media(prefers-reduced-motion:no-preference){
                .rv-card-status .dot { animation: rv-pulse 1.8s infinite; }
            }
            .rv-card-status.pending { color: var(--rv-amber); }
            .rv-card-status.pending .dot { background: var(--rv-amber); animation: none; }
            .rv-card-status.ended { color: var(--rv-muted); }
            .rv-card-status.ended .dot { background: var(--rv-muted); animation: none; }
            .rv-card-id {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; color: #ddd; letter-spacing: 0.04em;
                max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            }
            .rv-card-metric {
                font-size: 15px; font-weight: 500; color: #111;
                margin-bottom: 16px; letter-spacing: -0.3px; line-height: 1.3;
            }

            /* Versus Strip */
            .rv-versus {
                display: flex; align-items: stretch; gap: 0;
                background: #fafafa; border: 1px solid #f0f0f0;
                margin-bottom: 16px; overflow: hidden;
            }
            .rv-player {
                flex: 1; padding: 20px 20px; display: flex;
                flex-direction: column; gap: 4px;
            }
            .rv-player.right { text-align: right; border-left: 1px solid #f0f0f0; }
            .rv-player-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 600; letter-spacing: 0.1em;
                color: #bbb; text-transform: uppercase;
            }
            .rv-player-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 600; color: #333; letter-spacing: 0.04em;
                display: flex; align-items: center; gap: 5px;
            }
            .rv-player.right .rv-player-name { justify-content: flex-end; }
            .rv-lead-dot {
                width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
            }
            .rv-player-growth {
                font-size: 30px; font-weight: 300; color: #111;
                letter-spacing: -1px; margin-top: 4px; line-height: 1.1;
            }
            .rv-player-growth.leading { color: var(--rv-green); }
            .rv-player-growth.trailing { color: var(--rv-brand); }
            @media(prefers-reduced-motion:no-preference){
                .rv-player-growth.awaiting { animation: rv-pendingPulse 2s ease infinite; color: #ccc; font-size: 14px; letter-spacing: 0.08em; font-family: 'JetBrains Mono', monospace; }
            }
            .rv-vs-divider {
                display: flex; align-items: center; justify-content: center;
                width: 56px; flex-shrink: 0;
                background: linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%);
                border-left: 1px solid #ebebeb; border-right: 1px solid #ebebeb;
            }
            .rv-vs-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px; font-weight: 800; color: #bbb; letter-spacing: 0.08em;
            }

            /* Momentum Bar */
            .rv-momentum {
                height: 4px; display: flex; overflow: hidden;
                margin-bottom: 16px; background: #f5f5f5; border-radius: 2px;
            }
            .rv-momentum-left { background: var(--rv-green); transition: width .6s var(--rv-ease); border-radius: 2px 0 0 2px; }
            .rv-momentum-right { background: var(--rv-brand); transition: width .6s var(--rv-ease); border-radius: 0 2px 2px 0; }

            /* Card Action Buttons */
            .rv-card-actions {
                display: flex; gap: 0; margin: 0 -28px; padding: 12px 0 0;
                border-top: 1px solid #f0f0f0;
            }
            .rv-action-btn {
                flex: 1; padding: 12px; border: none;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
                cursor: pointer; transition: all .15s var(--rv-ease);
                text-transform: uppercase; display: flex; align-items: center;
                justify-content: center; gap: 6px;
            }
            .rv-action-accept {
                background: #111; color: #fff;
            }
            .rv-action-accept:hover { background: var(--rv-brand); }
            .rv-action-decline {
                background: transparent; color: #999;
                border-left: 1px solid #f0f0f0 !important;
            }
            .rv-action-decline:hover { background: rgba(239,68,68,0.04); color: var(--rv-red); }

            /* Card Bottom */
            .rv-card-bottom {
                display: flex; align-items: center; justify-content: space-between;
            }
            .rv-card-stake { display: flex; flex-direction: column; gap: 2px; }
            .rv-card-stake-val {
                font-size: 20px; font-weight: 600; color: #111; letter-spacing: -0.5px;
            }
            .rv-card-stake-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 600; color: #bbb;
                letter-spacing: 0.1em; text-transform: uppercase;
            }
            .rv-card-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; color: var(--rv-muted); letter-spacing: 0.04em;
            }
            .rv-card-time.urgent { color: var(--rv-red); font-weight: 700; }
            .rv-card-provider-pill {
                display: inline-flex; align-items: center; padding: 3px 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 700; letter-spacing: 0.08em;
                color: #fff; text-transform: uppercase; border-radius: 2px;
            }
            .rv-open-badge {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 700; letter-spacing: 0.1em;
                background: #111; color: #fff; padding: 3px 8px;
                text-transform: uppercase;
            }

            /* ── How It Works ── */
            .rv-mechanism {
                background: #fafafa;
                border-top: 3px solid var(--rv-brand);
                border-bottom: 1px solid #f0f0f0;
                padding: 64px 0; position: relative;
            }
            .rv-mechanism-inner {
                max-width: 1440px; margin: 0 auto; padding: 0 64px;
            }
            .rv-mechanism-header {
                display: flex; align-items: flex-end; justify-content: space-between;
                margin-bottom: 48px;
            }
            .rv-mechanism-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
                color: #ccc; text-transform: uppercase; margin-bottom: 12px;
            }
            .rv-mechanism-title {
                font-size: 32px; font-weight: 300; color: #111;
                letter-spacing: -1px; margin: 0;
            }
            .rv-mechanism-title strong { font-weight: 600; }
            .rv-mechanism-grid {
                display: grid; grid-template-columns: repeat(3, 1fr);
                position: relative;
            }
            .rv-mechanism-grid::before {
                content: ''; position: absolute;
                top: 40px; left: 10%; right: 10%; height: 1px;
                background: linear-gradient(90deg, transparent, rgba(59,0,1,0.12) 20%, rgba(59,0,1,0.12) 80%, transparent);
                z-index: 0;
            }
            .rv-mech-card {
                padding: 40px 32px;
                border-right: 1px solid #e8e8e8;
                transition: all .2s var(--rv-ease);
                cursor: default; position: relative; z-index: 1;
            }
            .rv-mech-card:hover {
                background: #fff; transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.05);
            }
            .rv-mech-card:last-child { border-right: none; }
            .rv-mech-num {
                font-size: 56px; font-weight: 200;
                color: rgba(59,0,1,0.6);
                margin-bottom: 16px; line-height: 1;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', sans-serif;
            }
            .rv-mech-label {
                font-size: 20px; font-weight: 500; color: #111;
                margin-bottom: 12px; letter-spacing: -0.3px;
            }
            .rv-mech-desc {
                font-size: 14px; color: #888; line-height: 1.6;
            }

            /* ── Stake Warning ── */
            .rv-warning {
                max-width: 1440px; margin: 0 auto;
                padding: 40px 64px; text-align: center;
            }
            .rv-warning-inner {
                display: inline-flex; align-items: center; gap: 10px;
                background: rgba(59,0,1,0.03); padding: 14px 28px;
                border: 1px solid rgba(59,0,1,0.06);
            }
            .rv-warning-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
                color: #999; text-transform: uppercase;
            }

            /* ── Challenge Modal ── */
            @media(prefers-reduced-motion:no-preference){
                @keyframes rv-modalIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
            }
            .rv-modal-backdrop {
                position: fixed; inset: 0;
                background: rgba(0,0,0,0.4); backdrop-filter: blur(6px);
                z-index: 80; display: none;
                align-items: center; justify-content: center;
            }
            .rv-modal-backdrop.open { display: flex; }
            .rv-modal-backdrop.open .rv-modal { animation: rv-modalIn .2s var(--rv-ease) both; }
            .rv-modal {
                background: #fff;
                width: 480px;
                max-width: 90vw;
                max-height: 85vh;
                overflow-y: auto;
                border: 1px solid #eaeaea;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                padding: 36px;
            }
            .rv-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 28px;
            }
            .rv-modal-title {
                font-size: 20px;
                font-weight: 500;
                color: #111;
                letter-spacing: -0.3px;
            }
            .rv-modal-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #999;
                font-size: 18px;
            }
            .rv-modal-close:hover { color: #333; }
            .rv-form-group {
                margin-bottom: 20px;
            }
            .rv-form-label {
                font-size: 12px;
                font-weight: 500;
                color: #6B6B6B;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                margin-bottom: 6px;
                display: block;
            }
            .rv-form-input {
                width: 100%;
                height: 44px;
                background: #fff;
                border: 1px solid #E5E5E5;
                border-radius: 8px;
                padding: 0 14px;
                font-size: 14px;
                color: #1A1A1A;
                outline: none;
                transition: border-color 0.15s, box-shadow 0.15s;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                box-sizing: border-box;
            }
            .rv-form-input:focus {
                border-color: #3B0001;
                box-shadow: 0 0 0 2px rgba(59,0,1,0.08);
            }
            .rv-form-select {
                width: 100%;
                height: 44px;
                background: #fff;
                border: 1px solid #E5E5E5;
                border-radius: 8px;
                padding: 0 14px;
                font-size: 14px;
                color: #1A1A1A;
                outline: none;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                box-sizing: border-box;
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 14px center;
            }
            .rv-form-select:focus {
                border-color: #3B0001;
                box-shadow: 0 0 0 2px rgba(59,0,1,0.08);
            }
            .rv-duration-pills {
                display: flex;
                gap: 8px;
            }
            .rv-dur-pill {
                flex: 1;
                height: 40px;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                background: #fff;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 600;
                color: #999;
                cursor: pointer;
                transition: all 0.15s;
                letter-spacing: 0.04em;
            }
            .rv-dur-pill:hover { border-color: #ccc; color: #666; }
            .rv-dur-pill.active {
                background: #111;
                color: #fff;
                border-color: #111;
            }
            .rv-stake-pills {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 6px;
            }
            .rv-stake-pill {
                padding: 10px 8px;
                background: #fff;
                border: 1px solid #e5e5e5;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 600;
                color: #666;
                cursor: pointer;
                transition: all 0.15s;
                letter-spacing: 0.02em;
                text-align: center;
            }
            .rv-stake-pill:hover { border-color: #999; color: #333; }
            .rv-stake-pill.active {
                background: #111;
                color: #fff;
                border-color: #111;
            }
            .rv-modal.high-stakes .rv-stake-pill.active {
                background: var(--rv-brand);
                border-color: var(--rv-brand);
            }
            .rv-form-hint {
                font-size: 11px;
                color: #bbb;
                margin-top: 6px;
                font-family: 'JetBrains Mono', monospace;
            }
            .rv-modal-preview {
                background: #fafafa;
                border: 1px solid #f0f0f0;
                padding: 20px;
                margin-bottom: 24px;
            }
            .rv-preview-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 0;
            }
            .rv-preview-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 600;
                color: #bbb;
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }
            .rv-preview-value {
                font-size: 13px;
                font-weight: 500;
                color: #111;
            }
            .rv-btn-submit {
                width: 100%;
                height: 46px;
                background: #111;
                color: #fff;
                border: none;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.06em;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                cursor: pointer;
                transition: background 0.15s;
            }
            .rv-btn-submit:hover { background: #000; }
            .rv-modal-footer {
                text-align: center;
                margin-top: 16px;
            }
            .rv-modal-footer-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #ccc;
                letter-spacing: 0.06em;
            }

            /* ── Empty State ── */
            .rv-empty {
                text-align: center; padding: 80px 20px;
                border: 2px dashed #f0f0f0;
            }
            .rv-empty-icon {
                width: 48px; height: 48px; margin: 0 auto 20px;
                opacity: 0.2;
            }
            .rv-empty-title {
                font-size: 16px; font-weight: 500; color: #999;
                margin-bottom: 8px;
            }
            .rv-empty-sub {
                font-size: 13px; color: #ccc; margin-bottom: 24px;
            }

            /* ── Hottest Rivalry Featured Card ── */
            .rv-featured {
                max-width: 1440px;
                margin: 0 auto;
                padding: 0 64px;
            }
            .rv-featured-card {
                background: #fafafa;
                border: 1px solid #f0f0f0;
                padding: 32px 36px;
                position: relative;
                margin-bottom: 12px;
                overflow: hidden;
            }
            .rv-featured-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 3px;
                background: linear-gradient(90deg, #3B0001 0%, #ef4444 50%, #10b981 100%);
            }
            .rv-featured-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                color: #3B0001;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .rv-featured-tag .fire { font-size: 12px; }
            .rv-featured-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 32px;
            }
            .rv-featured-vs {
                display: flex;
                align-items: center;
                gap: 20px;
                flex: 1;
            }
            .rv-featured-player {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .rv-featured-player.right { text-align: right; }
            .rv-featured-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 14px;
                font-weight: 600;
                color: #111;
                letter-spacing: 0.02em;
            }
            .rv-featured-growth {
                font-size: 28px;
                font-weight: 300;
                letter-spacing: -0.5px;
            }
            .rv-featured-meta {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 4px;
                flex-shrink: 0;
            }
            .rv-featured-pool {
                font-size: 22px;
                font-weight: 500;
                color: #111;
            }
            .rv-featured-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #999;
            }

            /* ── Modal High Stakes Warning ── */
            .rv-modal.high-stakes {
                border-color: rgba(59, 0, 1, 0.3);
            }
            .rv-modal-warning {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.06em;
                color: #3B0001;
                text-align: center;
                padding: 12px 0 0;
            }

            /* ── Responsive ── */
            @media (max-width: 1200px) {
                .rv-grid { grid-template-columns: 1fr; }
                .rv-mechanism-grid { grid-template-columns: repeat(3, 1fr); }
                .rv-hero-inner { padding: 40px 32px; }
                .rv-controls { padding: 24px 32px 0; }
                .rv-grid-container { padding: 24px 32px 48px; }
                .rv-mechanism-inner { padding: 0 32px; }
                .rv-warning { padding: 32px; }
                .rv-stats { gap: 40px; }
                .rv-featured { padding: 0 32px; }
            }

            @media (max-width: 768px) {
                .rv-hero-inner { padding: 40px 20px; }
                .rv-hero-row { flex-direction: column; align-items: flex-start; gap: 20px; }
                .rv-hero-title { font-size: 32px; letter-spacing: -1px; }
                .rv-hero-sub { font-size: 14px; }
                .rv-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0;
                    border: 1px solid #f0f0f0;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-top: 24px;
                    padding-top: 0;
                    border-top: 1px solid #f0f0f0;
                }
                .rv-stat-group {
                    padding: 16px 12px;
                    text-align: center;
                    border-right: 1px solid #f0f0f0;
                }
                .rv-stat-group:last-child { border-right: none; }
                .rv-stat-val { font-size: 20px; letter-spacing: -0.5px; }
                .rv-stat-lbl { font-size: 8px; }
                .rv-controls { padding: 20px 20px 0; flex-direction: column; align-items: flex-start; gap: 12px; }
                .rv-tabs { gap: 20px; overflow-x: auto; width: 100%; }
                .rv-tab { white-space: nowrap; font-size: 10px; }
                .rv-search-box { width: 100%; }
                .rv-grid-container { padding: 20px 20px 40px; }
                .rv-grid { grid-template-columns: 1fr; }
                .rv-card { padding: 20px; }
                .rv-versus { flex-direction: column; }
                .rv-player.right { text-align: left; border-left: none; border-top: 1px solid #f0f0f0; }
                .rv-vs-divider { width: 100%; height: 32px; border-left: none; border-right: none; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; }
                .rv-mechanism { padding: 40px 0; }
                .rv-mechanism-inner { padding: 0 20px; }
                .rv-mechanism-grid { grid-template-columns: 1fr; }
                .rv-mech-card { border-right: none; border-bottom: 1px solid #e8e8e8; padding: 28px 0; }
                .rv-mech-card:last-child { border-bottom: none; }
                .rv-mechanism-title { font-size: 24px; }
                .rv-warning { padding: 28px 20px; }
                .rv-btn-challenge { width: 100%; }
                .rv-featured { padding: 0 20px; }
                .rv-featured-row { flex-direction: column; gap: 16px; }
                .rv-featured-meta { align-items: flex-start; }
                .rv-featured-vs { flex-direction: column; gap: 8px; }
                .rv-featured-player.right { text-align: left; }
                .rv-stat-val::after { margin: 6px auto 0; }
            }
        </style>

        <div class="rv">
            <!-- Hero -->
            <div class="rv-hero">
                <div class="rv-hero-inner">
                    <div class="rv-breadcrumb">Collateral Protocol <span>/ Rivalry</span></div>
                    <div class="rv-hero-row">
                        <div class="rv-hero-left">
                            <h1 class="rv-hero-title">Head-to-head <strong>duels.</strong><br>Operators vs operators.</h1>
                            <p class="rv-hero-sub">Challenge another operator to a capital-backed performance contest. Both lock funds. Verified metrics determine the winner. Loser forfeits capital.</p>
                            <div class="rv-hero-rule"></div>
                        </div>
                        <div class="rv-hero-right">
                            <button class="rv-btn-challenge" id="rv-btn-issue">
                        ⚔ ISSUE CHALLENGE
                    </button>
                        </div>
                    </div>

                    <div class="rv-stats">
                        <div class="rv-stat-group">
                            <div class="rv-stat-val" id="rv-stat-active">0</div>
                            <div class="rv-stat-lbl">Active Rivalries</div>
                        </div>
                        <div class="rv-stat-group">
                            <div class="rv-stat-val">$<span id="rv-stat-capital">0</span></div>
                            <div class="rv-stat-lbl">Capital in Duels</div>
                        </div>
                        <div class="rv-stat-group">
                            <div class="rv-stat-val">$<span id="rv-stat-largest">0</span></div>
                            <div class="rv-stat-lbl">Largest Rivalry</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Hottest Rivalry -->
            <div class="rv-featured" id="rv-featured"></div>

            <!-- Controls -->
            <div class="rv-controls">
                <div class="rv-tabs" id="rv-tabs">
                    <button class="rv-tab active" data-filter="active">LIVE</button>
                    <button class="rv-tab" data-filter="pending">PENDING</button>
                    <button class="rv-tab" data-filter="settled">SETTLED</button>
                    <button class="rv-tab" data-filter="all">ALL</button>
                </div>
                <input type="text" class="rv-search-box" id="rv-search" placeholder="Search rivalries...">
            </div>

            <!-- Grid -->
            <div class="rv-grid-container">
                <div class="rv-count" id="rv-count">0 rivalries</div>
                <div class="rv-grid" id="rv-grid">
                    <!-- Dynamic rivalry cards -->
                </div>
            </div>

            <!-- How It Works -->
            <section class="rv-mechanism">
                <div class="rv-mechanism-inner">
                    <div class="rv-mechanism-header">
                        <div>
                            <div class="rv-mechanism-tag">How Rivalry Works</div>
                            <h2 class="rv-mechanism-title">Three steps to <strong>settlement.</strong></h2>
                        </div>
                    </div>
                    <div class="rv-mechanism-grid">
                        <div class="rv-mech-card">
                            <div class="rv-mech-num">01</div>
                            <div class="rv-mech-label">Challenge</div>
                            <div class="rv-mech-desc">Challenge any verified operator to a head-to-head duel. Choose the metric, set the stake, define the time window. Both sides lock capital.</div>
                        </div>
                        <div class="rv-mech-card">
                            <div class="rv-mech-num">02</div>
                            <div class="rv-mech-label">Compete</div>
                            <div class="rv-mech-desc">Performance is tracked in real-time via verified API integrations. Baseline snapshots are taken at lock-in. Growth percentage determines standing.</div>
                        </div>
                        <div class="rv-mech-card">
                            <div class="rv-mech-num">03</div>
                            <div class="rv-mech-label">Settle</div>
                            <div class="rv-mech-desc">At deadline, each operator's growth is verified against their target. Hit it and collect the rivalry multiplier. Miss and forfeit your capital.</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Warning -->
            <div class="rv-warning">
                <div class="rv-warning-inner">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <div class="rv-warning-text">Both operators lock capital. The losing operator forfeits their stake. No appeals. No reversals.</div>
                </div>
            </div>
        </div>

        <!-- Challenge Modal -->
        <div class="rv-modal-backdrop" id="rv-challenge-modal" onclick="if(event.target===this) this.classList.remove('open')">
            <div class="rv-modal">
                <div class="rv-modal-header">
                    <span class="rv-modal-title">Issue Challenge</span>
                    <button class="rv-modal-close" onclick="document.getElementById('rv-challenge-modal').classList.remove('open')">✕</button>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Challenge Type</label>
                    <div class="rv-challenge-type-toggle" id="rv-challenge-type" style="display:flex;gap:0;border:1px solid #e5e5e5;overflow:hidden;margin-bottom:8px;">
                        <button class="rv-type-btn active" data-type="direct" style="flex:1;padding:10px 16px;background:#1a1a1a;color:#fff;border:none;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.08em;cursor:pointer;font-weight:700;text-transform:uppercase;transition:all 0.15s;">✉ Direct Challenge</button>
                        <button class="rv-type-btn" data-type="open" style="flex:1;padding:10px 16px;background:#fff;color:#666;border:none;border-left:1px solid #e5e5e5;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.08em;cursor:pointer;font-weight:700;text-transform:uppercase;transition:all 0.15s;">🌐 Open Challenge</button>
                    </div>
                    <div class="rv-form-hint" id="rv-type-hint">Send to a specific operator</div>
                </div>

                <div class="rv-form-group" id="rv-opponent-group">
                    <label class="rv-form-label">Opponent Username</label>
                    <input type="text" class="rv-form-input" id="rv-opponent" placeholder="@username">
                    <div class="rv-form-hint">Enter the username of the operator you want to challenge</div>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Competition Metric</label>
                    <select class="rv-form-select" id="rv-metric">
                        <option value="revenue_growth">Revenue Growth (Stripe)</option>
                        <option value="follower_growth">Follower Growth (X)</option>
                        <option value="subscriber_growth">Subscriber Growth (YouTube)</option>
                        <option value="views_growth">Views Growth (YouTube)</option>
                        <option value="sales_growth">Sales Growth (Shopify)</option>
                        <option value="order_growth">Order Growth (Amazon)</option>
                    </select>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Your Stake</label>
                    <div class="rv-stake-pills" id="rv-stake-pills">
                        <button class="rv-stake-pill active" data-amount="100">$100</button>
                        <button class="rv-stake-pill" data-amount="250">$250</button>
                        <button class="rv-stake-pill" data-amount="500">$500</button>
                        <button class="rv-stake-pill" data-amount="1000">$1K</button>
                        <button class="rv-stake-pill" data-amount="2500">$2.5K</button>
                        <button class="rv-stake-pill" data-amount="5000">$5K</button>
                        <button class="rv-stake-pill" data-amount="10000">$10K</button>
                        <button class="rv-stake-pill" data-amount="20000">$20K</button>
                    </div>
                    <div class="rv-form-hint">Minimum $100 · Opponent must match your stake</div>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Duration</label>
                    <div class="rv-duration-pills" id="rv-duration-pills">
                        <button class="rv-dur-pill" data-days="7">7D</button>
                        <button class="rv-dur-pill active" data-days="14">14D</button>
                        <button class="rv-dur-pill" data-days="30">30D</button>
                        <button class="rv-dur-pill" data-days="90">90D</button>
                    </div>
                </div>

                <div class="rv-modal-preview" id="rv-preview">
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Your Stake</span>
                        <span class="rv-preview-value" id="rv-preview-stake">$0</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Combined Pool</span>
                        <span class="rv-preview-value" id="rv-preview-pool">$0</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Duration</span>
                        <span class="rv-preview-value" id="rv-preview-duration">14 days</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Metric</span>
                        <span class="rv-preview-value" id="rv-preview-metric">Revenue Growth</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Protocol Fee</span>
                        <span class="rv-preview-value">2%</span>
                    </div>
                </div>

                <button class="rv-btn-submit" id="rv-btn-submit">SEND CHALLENGE</button>

                <div class="rv-modal-footer">
                    <div class="rv-modal-footer-text">Challenge is binding once accepted. Capital locks immediately.</div>
                    <div class="rv-modal-warning">Both operators lock capital. Losing operator forfeits stake.</div>
                </div>
            </div>
        </div>
    `;
}


export async function initRivalry() {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const grid = document.getElementById('rv-grid');
    const countLbl = document.getElementById('rv-count');
    const statActive = document.getElementById('rv-stat-active');
    const statCapital = document.getElementById('rv-stat-capital');
    const statLargest = document.getElementById('rv-stat-largest');

    if (!grid) return;

    // ── State mapping: API state → card status ──
    const STATE_TO_STATUS = {
        CHALLENGE_ISSUED: 'pending', ACCEPTED: 'pending',
        BOTH_FUNDED: 'active', ACTIVE: 'active', VERIFYING: 'active',
        VERIFIED: 'active', SETTLING: 'active',
        SETTLED: 'settled', DRAW: 'settled',
        DECLINED: 'settled', EXPIRED: 'settled', CANCELLED: 'settled',
    };
    const METRIC_LABELS = { REVENUE: 'Revenue Growth', FOLLOWERS: 'Follower Growth', SUBSCRIBERS: 'Subscriber Growth', VIEWS: 'Views Growth', GROSS_SALES: 'Sales Growth', ORDER_COUNT: 'Order Growth' };
    const PLATFORM_MAP = { STRIPE: 'stripe', X: 'x', YOUTUBE: 'youtube', SHOPIFY: 'shopify', AMAZON: 'amazon' };

    // Transform API rivalry → card format
    function transformRivalry(r) {
        const challPart = r.participants?.find(p => p.role === 'challenger');
        const oppPart = r.participants?.find(p => p.role === 'opponent');
        const now = new Date();
        const start = new Date(r.activatedAt || r.createdAt);
        const end = new Date(start.getTime() + (r.durationDays || 30) * 86400000);
        const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));

        return {
            id: r.id,
            status: STATE_TO_STATUS[r.state] || 'active',
            state: r.state,
            metric: METRIC_LABELS[r.metricType] || r.metricType || 'Revenue Growth',
            provider: PLATFORM_MAP[r.platform] || (r.platform || 'stripe').toLowerCase(),
            isOpen: !r.opponentUserId || r.opponentUsername === 'unknown' || !r.opponentUsername,
            challenger: {
                name: '@' + (r.challengerUsername || 'unknown'),
                growth: parseFloat(challPart?.growthPercent || challPart?.currentDelta || 0),
                baseline: parseFloat(challPart?.baselineValue || 0),
            },
            opponent: {
                name: r.opponentUserId ? ('@' + (r.opponentUsername || 'unknown')) : 'Open — Anyone',
                growth: parseFloat(oppPart?.growthPercent || oppPart?.currentDelta || 0),
                baseline: parseFloat(oppPart?.baselineValue || 0),
            },
            stake: (r.stakePerSideCents || 0) / 100,
            daysLeft,
            totalDays: r.durationDays || 30,
        };
    }

    // ── Fetch live rivalries ── 
    let allRivalries = [];
    let isLive = false;

    // Show skeleton loading in grid
    grid.innerHTML = Array(4).fill(0).map(() => `<div class="rv-skeleton">
        <div class="rv-skel-bar" style="width:120px;height:10px;margin-bottom:20px;"></div>
        <div class="rv-skel-bar" style="width:180px;height:14px;margin-bottom:18px;"></div>
        <div style="display:flex;gap:0;background:#fafafa;border:1px solid #f0f0f0;margin-bottom:18px;">
            <div style="flex:1;padding:20px;"><div class="rv-skel-bar" style="width:60px;height:8px;margin-bottom:8px;"></div><div class="rv-skel-bar" style="width:80px;height:10px;margin-bottom:8px;"></div><div class="rv-skel-bar" style="width:50px;height:24px;"></div></div>
            <div style="width:56px;background:#f0f0f0;"></div>
            <div style="flex:1;padding:20px;text-align:right;"><div class="rv-skel-bar" style="width:60px;height:8px;margin-bottom:8px;margin-left:auto;"></div><div class="rv-skel-bar" style="width:80px;height:10px;margin-bottom:8px;margin-left:auto;"></div><div class="rv-skel-bar" style="width:50px;height:24px;margin-left:auto;"></div></div>
        </div>
        <div style="display:flex;justify-content:space-between;"><div class="rv-skel-bar" style="width:80px;height:16px;"></div><div class="rv-skel-bar" style="width:60px;height:14px;"></div><div class="rv-skel-bar" style="width:70px;height:10px;"></div></div>
    </div>`).join('');

    try {
        const res = await api.getRivalries({ limit: 50 });
        if (res.ok && res.rivalries && res.rivalries.length > 0) {
            allRivalries = res.rivalries.map(transformRivalry);
            isLive = true;
            console.log(`[Rivalry] Loaded ${allRivalries.length} live rivalries`);
        } else {
            console.log('[Rivalry] No rivalries found');
        }
    } catch (e) {
        console.log('[Rivalry] API unavailable:', e.message);
    }

    let activeFilter = 'all';
    let searchQuery = '';

    function getProviderColor(provider) {
        const colors = { stripe: '#635bff', x: '#111', youtube: '#ff0000', shopify: '#96bf48', amazon: '#ff9900' };
        return colors[provider] || '#111';
    }

    function renderSkeleton() {
        return `<div class="rv-skeleton">
            <div class="rv-skel-bar" style="width:120px;height:10px;margin-bottom:20px;"></div>
            <div class="rv-skel-bar" style="width:180px;height:14px;margin-bottom:18px;"></div>
            <div style="display:flex;gap:0;background:#fafafa;border:1px solid #f0f0f0;margin-bottom:18px;">
                <div style="flex:1;padding:20px;"><div class="rv-skel-bar" style="width:60px;height:8px;margin-bottom:8px;"></div><div class="rv-skel-bar" style="width:80px;height:10px;margin-bottom:8px;"></div><div class="rv-skel-bar" style="width:50px;height:24px;"></div></div>
                <div style="width:56px;background:#f0f0f0;"></div>
                <div style="flex:1;padding:20px;text-align:right;"><div class="rv-skel-bar" style="width:60px;height:8px;margin-bottom:8px;margin-left:auto;"></div><div class="rv-skel-bar" style="width:80px;height:10px;margin-bottom:8px;margin-left:auto;"></div><div class="rv-skel-bar" style="width:50px;height:24px;margin-left:auto;"></div></div>
            </div>
            <div style="display:flex;justify-content:space-between;"><div class="rv-skel-bar" style="width:80px;height:16px;"></div><div class="rv-skel-bar" style="width:60px;height:14px;"></div><div class="rv-skel-bar" style="width:70px;height:10px;"></div></div>
        </div>`;
    }

    function renderCard(r) {
        const isLeadingChallenger = r.challenger.growth >= r.opponent.growth;
        const statusClass = r.status === 'pending' ? 'pending' : r.status === 'settled' ? 'ended' : '';
        const statusLabel = r.status === 'pending' ? 'AWAITING ACCEPTANCE' : r.status === 'settled' ? 'SETTLED' : 'LIVE';
        const timeLabel = r.status === 'settled' ? 'Completed' : r.daysLeft <= 1 ? `${r.daysLeft * 24}h left` : `${r.daysLeft}d left`;
        const timeUrgent = r.status !== 'settled' && r.daysLeft <= 3;
        const shortId = r.id.substring(0, 8);

        // Momentum bar percentages
        const totalGrowth = Math.abs(r.challenger.growth) + Math.abs(r.opponent.growth);
        const leftPct = totalGrowth > 0 ? Math.round((Math.abs(r.challenger.growth) / totalGrowth) * 100) : 50;
        const rightPct = 100 - leftPct;

        // Growth display
        const challGrowth = r.status === 'pending'
            ? '<span class="rv-player-growth awaiting">Awaiting</span>'
            : `<span class="rv-player-growth ${isLeadingChallenger ? 'leading' : 'trailing'}">${r.challenger.growth > 0 ? '+' : ''}${r.challenger.growth}%</span>`;
        const oppGrowth = r.status === 'pending'
            ? '<span class="rv-player-growth awaiting">Awaiting</span>'
            : `<span class="rv-player-growth ${!isLeadingChallenger ? 'leading' : 'trailing'}">${r.opponent.growth > 0 ? '+' : ''}${r.opponent.growth}%</span>`;

        // Lead dots
        const challDot = r.status !== 'pending' ? `<span class="rv-lead-dot" style="background:${isLeadingChallenger ? 'var(--rv-green)' : 'var(--rv-red)'}"></span>` : '';
        const oppDot = r.status !== 'pending' ? `<span class="rv-lead-dot" style="background:${!isLeadingChallenger ? 'var(--rv-green)' : 'var(--rv-red)'}"></span>` : '';

        // Action buttons
        let actionsHtml = '';
        if (r.status === 'pending') {
            if (r.isOpen) {
                actionsHtml = `<div class="rv-card-actions"><button class="rv-action-btn rv-action-accept" data-rivalry-id="${r.id}" onclick="event.stopPropagation();window.app.acceptRivalry('${r.id}')" style="flex:1;">⚡ ACCEPT OPEN CHALLENGE</button></div>`;
            } else {
                actionsHtml = `<div class="rv-card-actions"><button class="rv-action-btn rv-action-accept" data-rivalry-id="${r.id}" onclick="event.stopPropagation();window.app.acceptRivalry('${r.id}')">✓ ACCEPT</button><button class="rv-action-btn rv-action-decline" data-rivalry-id="${r.id}" onclick="event.stopPropagation();window.app.declineRivalry('${r.id}')">✕ DECLINE</button></div>`;
            }
        }

        return `
            <div class="rv-card" data-status="${r.status}" data-id="${r.id}">
                <div class="rv-card-header">
                    <div class="rv-card-status ${statusClass}">
                        <span class="dot"></span>
                        ${statusLabel}
                    </div>
                    ${r.isOpen && r.status === 'pending' ? '<span class="rv-open-badge">🌐 OPEN</span>' : ''}
                    <span class="rv-card-id">${shortId}</span>
                </div>
                <div class="rv-card-metric">${r.metric}</div>
                <div class="rv-versus">
                    <div class="rv-player">
                        <span class="rv-player-label">Challenger</span>
                        <span class="rv-player-name">${challDot}${r.challenger.name}</span>
                        ${challGrowth}
                    </div>
                    <div class="rv-vs-divider">
                        <span class="rv-vs-text">VS</span>
                    </div>
                    <div class="rv-player right">
                        <span class="rv-player-label">Opponent</span>
                        <span class="rv-player-name">${r.opponent.name}${oppDot}</span>
                        ${oppGrowth}
                    </div>
                </div>
                ${r.status !== 'pending' ? `
                <div class="rv-momentum">
                    <div class="rv-momentum-left" style="width:${leftPct}%"></div>
                    <div class="rv-momentum-right" style="width:${rightPct}%"></div>
                </div>` : ''}
                <div class="rv-card-bottom">
                    <div class="rv-card-stake">
                        <span class="rv-card-stake-val">$${(r.stake * 2).toLocaleString()}</span>
                        <span class="rv-card-stake-lbl">Combined Pool</span>
                    </div>
                    <span class="rv-card-provider-pill" style="background:${getProviderColor(r.provider)}">${r.provider.toUpperCase()}</span>
                    <span class="rv-card-time${timeUrgent ? ' urgent' : ''}">○ ${timeLabel}</span>
                </div>
                ${actionsHtml}
            </div>
        `;
    }

    function renderGrid() {
        let filtered = allRivalries;

        if (activeFilter !== 'all') {
            filtered = filtered.filter(r => r.status === activeFilter);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.challenger.name.toLowerCase().includes(q) ||
                r.opponent.name.toLowerCase().includes(q) ||
                r.metric.toLowerCase().includes(q) ||
                r.id.toLowerCase().includes(q)
            );
        }

        if (countLbl) countLbl.textContent = `${filtered.length} rivalr${filtered.length !== 1 ? 'ies' : 'y'}`;

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="rv-empty" style="grid-column:1/-1;">
                    <svg class="rv-empty-icon" viewBox="0 0 48 48" fill="none" stroke="#ccc" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="40" x2="24" y2="8"/><line x1="40" y1="40" x2="24" y2="8"/><line x1="12" y1="32" x2="36" y2="32"/></svg>
                    <div class="rv-empty-title">No rivalries found</div>
                    <div class="rv-empty-sub">${activeFilter === 'active' ? 'Issue a challenge to start the first duel.' : 'No rivalries match your current filter.'}</div>
                    <button class="rv-btn-challenge" onclick="document.getElementById('rv-challenge-modal').classList.add('open')" style="margin:0 auto;">⚔ ISSUE CHALLENGE</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(renderCard).join('');

        // Empty state
        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
                <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:0.12em;color:#ccc;text-transform:uppercase;margin-bottom:12px;">No rivalries found</div>
                <div style="font-size:13px;color:#999;">${activeFilter === 'active' ? 'No active duels right now. Issue a challenge to start one.' : activeFilter === 'pending' ? 'No pending challenges.' : activeFilter === 'settled' ? 'No settled rivalries yet.' : 'No rivalries have been created yet.'}</div>
            </div>`;
        }

        // Card click → detail page
        grid.querySelectorAll('.rv-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                if (id) window.location.hash = '/rivalry/' + id;
            });
        });
    }

    // ── Hottest Rivalry ──
    function renderFeatured() {
        const featured = document.getElementById('rv-featured');
        if (!featured) return;

        // Find the hottest active rivalry (largest stake)
        const activeRivalries = allRivalries.filter(r => r.status === 'active');
        if (activeRivalries.length === 0) { featured.innerHTML = ''; return; }

        const hottest = activeRivalries.reduce((a, b) => a.stake > b.stake ? a : b);
        const isLeading = hottest.challenger.growth >= hottest.opponent.growth;

        featured.innerHTML = `
            <div class="rv-featured-card">
                <div class="rv-featured-tag"><span class="fire">🔥</span> HOTTEST RIVALRY</div>
                <div class="rv-featured-row">
                    <div class="rv-featured-vs">
                        <div class="rv-featured-player">
                            <span class="rv-player-label">CHALLENGER</span>
                            <span class="rv-featured-name">${hottest.challenger.name}</span>
                            <span class="rv-featured-growth ${isLeading ? 'leading' : 'trailing'}">${hottest.challenger.growth > 0 ? '+' : ''}${hottest.challenger.growth}%</span>
                        </div>
                        <div class="rv-vs-divider" style="height:60px;">
                            <span class="rv-vs-text">VS</span>
                        </div>
                        <div class="rv-featured-player right">
                            <span class="rv-player-label">OPPONENT</span>
                            <span class="rv-featured-name">${hottest.opponent.name}</span>
                            <span class="rv-featured-growth ${!isLeading ? 'leading' : 'trailing'}">${hottest.opponent.growth > 0 ? '+' : ''}${hottest.opponent.growth}%</span>
                        </div>
                    </div>
                    <div class="rv-featured-meta">
                        <span class="rv-featured-pool">$${(hottest.stake * 2).toLocaleString()}</span>
                        <span class="rv-featured-time">${hottest.daysLeft}d remaining · ${hottest.provider.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // ── Stats (try live API first, fallback to sample data) ──
    async function updateStats() {
        try {
            if (api && api.getRivalryStats) {
                const res = await api.getRivalryStats();
                if (res.ok && res.stats) {
                    const s = res.stats;
                    if (statActive) statActive.textContent = s.activeRivalries || '—';
                    if (statCapital) {
                        const c = (s.totalCapitalLockedCents || 0) / 100;
                        statCapital.textContent = c === 0 ? '—' : c >= 1000 ? (c / 1000).toFixed(0) + 'k' : c.toLocaleString();
                    }
                    if (statLargest) {
                        const l = (s.largestPoolCents || 0) / 100;
                        statLargest.textContent = l === 0 ? '—' : l >= 1000 ? (l / 1000).toFixed(0) + 'k' : l.toLocaleString();
                    }
                    return;
                }
            }
        } catch { /* fallback to sample */ }

        // Fallback: local data stats
        const active = allRivalries.filter(r => r.status === 'active');
        const totalCapital = allRivalries.reduce((sum, r) => sum + (r.stake * 2), 0);
        const largest = Math.max(...allRivalries.map(r => r.stake * 2));

        if (statActive) statActive.textContent = active.length || '—';
        if (statCapital) {
            statCapital.textContent = totalCapital >= 1000 ? (totalCapital / 1000).toFixed(0) + 'k' : totalCapital.toLocaleString();
        }
        if (statLargest) {
            statLargest.textContent = largest >= 1000 ? (largest / 1000).toFixed(0) + 'k' : largest.toLocaleString();
        }
    }

    // ── Tabs ──
    const tabsContainer = document.getElementById('rv-tabs');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.rv-tab');
            if (!tab) return;
            tabsContainer.querySelectorAll('.rv-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            renderGrid();
        });
    }

    // ── Search ──
    const searchInput = document.getElementById('rv-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderGrid();
        });
    }

    // ── Challenge Modal ──
    const stakePills = document.getElementById('rv-stake-pills');
    const metricSelect = document.getElementById('rv-metric');
    const durationPills = document.getElementById('rv-duration-pills');
    let selectedStake = 100;
    let selectedDuration = 14;

    function updatePreview() {
        const stake = selectedStake;
        const metric = metricSelect?.selectedOptions[0]?.text || 'Revenue Growth';

        const previewStake = document.getElementById('rv-preview-stake');
        const previewPool = document.getElementById('rv-preview-pool');
        const previewDuration = document.getElementById('rv-preview-duration');
        const previewMetric = document.getElementById('rv-preview-metric');

        if (previewStake) previewStake.textContent = '$' + stake.toLocaleString();
        if (previewPool) previewPool.textContent = '$' + (stake * 2).toLocaleString();
        if (previewDuration) previewDuration.textContent = selectedDuration + ' days';
        if (previewMetric) previewMetric.textContent = metric;
    }

    if (stakePills) {
        stakePills.addEventListener('click', (e) => {
            const pill = e.target.closest('.rv-stake-pill');
            if (!pill) return;
            stakePills.querySelectorAll('.rv-stake-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedStake = parseInt(pill.dataset.amount);
            updatePreview();
            // Toggle high-stakes styling
            const modal = document.querySelector('.rv-modal');
            if (modal) {
                if (selectedStake >= 5000) modal.classList.add('high-stakes');
                else modal.classList.remove('high-stakes');
            }
        });
    }
    if (metricSelect) metricSelect.addEventListener('change', updatePreview);

    if (durationPills) {
        durationPills.addEventListener('click', (e) => {
            const pill = e.target.closest('.rv-dur-pill');
            if (!pill) return;
            durationPills.querySelectorAll('.rv-dur-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedDuration = parseInt(pill.dataset.days);
            updatePreview();
        });
    }

    // Submit challenge — calls real API
    const METRIC_MAP = {
        revenue_growth: { platform: 'STRIPE', metricType: 'REVENUE', metricKey: 'net_settled_amount' },
        follower_growth: { platform: 'X', metricType: 'FOLLOWERS', metricKey: 'followers' },
        subscriber_growth: { platform: 'YOUTUBE', metricType: 'SUBSCRIBERS', metricKey: 'subscribers' },
        views_growth: { platform: 'YOUTUBE', metricType: 'VIEWS', metricKey: 'views_30d' },
        sales_growth: { platform: 'SHOPIFY', metricType: 'GROSS_SALES', metricKey: 'gross_sales' },
        order_growth: { platform: 'AMAZON', metricType: 'ORDER_COUNT', metricKey: 'order_count' },
    };

    const submitBtn = document.getElementById('rv-btn-submit');

    // ── Challenge Type Toggle ──
    let challengeType = 'direct';
    const typeToggle = document.getElementById('rv-challenge-type');
    const opponentGroup = document.getElementById('rv-opponent-group');
    const typeHint = document.getElementById('rv-type-hint');
    if (typeToggle) {
        typeToggle.addEventListener('click', (e) => {
            const btn = e.target.closest('.rv-type-btn');
            if (!btn) return;
            challengeType = btn.dataset.type;
            typeToggle.querySelectorAll('.rv-type-btn').forEach(b => {
                if (b.dataset.type === challengeType) {
                    b.style.background = '#1a1a1a'; b.style.color = '#fff';
                } else {
                    b.style.background = '#fff'; b.style.color = '#666';
                }
            });
            if (opponentGroup) opponentGroup.style.display = challengeType === 'direct' ? '' : 'none';
            if (typeHint) typeHint.textContent = challengeType === 'direct' ? 'Send to a specific operator' : 'Anyone can accept this challenge';
            if (submitBtn) submitBtn.textContent = challengeType === 'direct' ? 'SEND CHALLENGE' : 'POST OPEN CHALLENGE';
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const opponent = document.getElementById('rv-opponent')?.value?.trim();
            const stake = selectedStake;

            if (challengeType === 'direct' && !opponent) {
                showAlert('Enter an opponent username', { type: 'warning', title: 'Missing Field' });
                return;
            }
            if (stake < 1) {
                showAlert('Select a stake amount', { type: 'warning', title: 'Invalid Stake' });
                return;
            }

            if (!window.appState?.isLoggedIn) {
                document.getElementById('rv-challenge-modal').classList.remove('open');
                window.app.openAccessModal();
                return;
            }

            const metricValue = metricSelect?.value || 'revenue_growth';
            const mapping = METRIC_MAP[metricValue] || METRIC_MAP.revenue_growth;

            submitBtn.disabled = true;
            submitBtn.textContent = 'SENDING...';

            try {
                const payload = {
                    platform: mapping.platform,
                    metricType: mapping.metricType,
                    metricKey: mapping.metricKey,
                    stakePerSideCents: stake * 100,
                    durationDays: selectedDuration,
                };
                if (challengeType === 'direct') {
                    payload.opponentUsername = opponent.replace('@', '');
                }
                // For open challenge, don't send opponentUsername

                const result = await api.createRivalry(payload);

                if (result.ok) {
                    document.getElementById('rv-challenge-modal').classList.remove('open');
                    if (challengeType === 'direct') {
                        showAlert(`Challenge issued to @${opponent.replace('@', '')}! They have 72 hours to accept.`, { type: 'success', title: 'Challenge Sent' });
                    } else {
                        showAlert('Open challenge posted! Any operator can accept it.', { type: 'success', title: 'Challenge Posted' });
                    }
                    // Refresh: re-fetch live data
                    try {
                        const res = await api.getRivalries({ limit: 50 });
                        if (res.ok && res.rivalries && res.rivalries.length > 0) {
                            allRivalries = res.rivalries.map(transformRivalry);
                        }
                    } catch { }
                    updateStats();
                    renderFeatured();
                    renderGrid();
                } else {
                    showAlert(result.error || 'Failed to create challenge', { type: 'error' });
                }
            } catch (err) {
                showAlert('Failed to send challenge: ' + (err.message || 'Unknown error'), { type: 'error' });
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = challengeType === 'direct' ? 'SEND CHALLENGE' : 'POST OPEN CHALLENGE';
            }
        });
    }

    // ── Issue Challenge button — auth guard ──
    const issueBtn = document.getElementById('rv-btn-issue');
    if (issueBtn) {
        issueBtn.addEventListener('click', () => {
            if (!window.appState?.isLoggedIn) {
                window.app.openAccessModal();
                return;
            }
            document.getElementById('rv-challenge-modal').classList.add('open');
        });
    }

    // ── Initial render ──
    updateStats();
    renderFeatured();
    renderGrid();
    updatePreview();

    // ── How It Works scroll-reveal ──
    if ('IntersectionObserver' in window) {
        const mechCards = document.querySelectorAll('.rv-mech-card');
        mechCards.forEach((card, i) => {
            card.classList.add('rv-reveal');
            card.style.transitionDelay = `${i * 150}ms`;
        });
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        mechCards.forEach(card => observer.observe(card));
    }
}
