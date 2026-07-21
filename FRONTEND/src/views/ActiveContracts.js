// Overview — Collateral Execution Queue
// ALL contracts are percentage growth from baseline
// Social (X) = Follower % growth, Sales/Commerce/Finance = Revenue % growth
// Tiers: PLEDGE (~30% win), STAKE (~20% win), ALL-IN (~10% win)
// HARD GATE: Minimum baseline required per tier — no starting from zero
// EVERY BUTTON IS LIVE — tabs, pills, CTAs, modal, search, sort

import api, { getMarketListings, hasAuthToken } from '../api.js';
import { openExecutionModal } from './ExecutionModal.js';

export function renderActiveContracts() {
    return `
        <style>
            .eq {
                background: #fbfbf9;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                color: #1e1e1e;
                padding-bottom: 100px;
            }

            /* --- TYPE SYSTEM --- */
            .eq-tag {
                display: flex;
                align-items: center;
                gap: 12px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #5C1414;
                margin-bottom: 24px;
            }
            .eq-tag::before {
                content: '';
                width: 32px;
                height: 1px;
                background: #5C1414;
            }

            /* --- HERO SECTION --- */
            .eq-hero {
                padding: 120px 32px 100px;
                max-width: 1300px;
                margin: 0 auto;
                position: relative;
            }
            .eq-hero-headline {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 84px;
                font-weight: 800;
                color: #111;
                line-height: 0.95;
                letter-spacing: -3.5px;
                margin-bottom: 40px;
                max-width: 900px;
            }
            .eq-hero-headline strong {
                color: #5C1414;
            }
            .eq-hero-sub {
                font-size: 16px;
                color: #8a8984;
                max-width: 480px;
                line-height: 1.6;
                margin-bottom: 40px;
                font-family: 'Inter', sans-serif;
            }
            .eq-hero-actions {
                display: flex;
                align-items: center;
                gap: 24px;
            }
            .eq-btn-primary {
                background: #111111;
                color: #fff;
                padding: 18px 32px;
                font-size: 14px;
                font-weight: 700;
                border: none;
                cursor: pointer;
                border-radius: 6px;
                position: relative;
                overflow: hidden;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 4px 12px rgba(92, 20, 20, 0.1);
            }
            .eq-btn-primary:hover {
                background: #5C1414;
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(92, 20, 20, 0.25);
            }
            .eq-btn-primary::before {
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
            .eq-btn-primary:hover::before {
                left: 150%;
                transition: left 0.8s ease-in-out;
            }
            .eq-link-more {
                color: #888;
                font-size: 14px;
                text-decoration: none;
                font-weight: 500;
            }
            .eq-hero-scroll {
                position: absolute;
                right: 32px;
                bottom: 100px;
                writing-mode: vertical-rl;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #ccc;
                letter-spacing: 3px;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .eq-hero-scroll::after {
                content: '';
                width: 1px;
                height: 60px;
                background: #eee;
            }

            /* --- MECHANISM SECTION --- */
            .eq-mechanism {
                padding: 100px 0;
                border-top: 1px solid #f2f2f2;
                max-width: 1300px;
                margin: 0 auto;
            }
            .eq-mechanism-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-bottom: 80px;
                padding: 0 32px;
            }
            .eq-mechanism-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 36px;
                font-weight: 800;
                letter-spacing: -2px;
                line-height: 1;
            }
            .eq-mechanism-title strong { color: #5C1414; }
            .eq-mechanism-side {
                max-width: 320px;
                font-size: 14px;
                color: #8a8984;
                line-height: 1.6;
                text-align: right;
            }

            .eq-mechanism-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                border-top: 1px solid rgba(0,0,0,0.05);
                position: relative;
            }
            .eq-mech-card {
                padding: 60px 40px;
                border-right: 1px solid rgba(0,0,0,0.05);
                position: relative;
                overflow: hidden;
                background: #fff;
                transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .eq-mech-card:hover {
                background: #fff;
                transform: translateY(-6px);
                box-shadow: 0 16px 48px -16px rgba(0, 0, 0, 0.05);
            }
            .eq-mech-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 3px;
                background: #5C1414;
                transition: width 0.4s ease;
            }
            .eq-mech-card:hover::before { width: 100%; }
            .eq-mech-card:last-child { border-right: none; }
            /* Step connector arrow */
            .eq-mech-card:not(:last-child)::after {
                content: '→';
                position: absolute;
                right: -8px; top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                color: #cbd5e1;
                z-index: 2;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-mech-num {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 80px;
                font-weight: 800;
                color: #e0e0e0;
                line-height: 0.8;
                margin-bottom: 40px;
                transition: color 0.3s;
            }
            .eq-mech-card:hover .eq-mech-num { color: rgba(92, 20, 20, 0.12); }
            .eq-mech-label {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 22px;
                font-weight: 800;
                margin-bottom: 20px;
                color: #111;
            }
            .eq-mech-desc {
                font-size: 14px;
                color: #666;
                line-height: 1.7;
            }
            .eq-mechanism-sub {
                font-size: 15px; color: #888;
                line-height: 1.65; max-width: 520px;
                margin-top: 16px;
            }

            /* --- MARKET SECTION --- */
            .eq-market-header {
                padding: 24px 32px 8px;
                max-width: 1300px;
                margin: 0 auto;
            }
            .eq-market-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 36px;
                font-weight: 800;
                letter-spacing: -2px;
                margin-bottom: 4px;
            }
            .eq-market-title strong { color: #5C1414; }
            .eq-market-live {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                color: #8a8984;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 12px;
            }
            .eq-market-dot {
                width: 6px; height: 6px;
                background: #10b981;
                border-radius: 50%;
                animation: dotPulse 2s ease-in-out infinite;
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
            }
            @keyframes dotPulse {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
                }
                50% {
                    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
                }
            }

            .eq-stats-strip {
                display: flex;
                gap: 60px;
                margin-bottom: 24px;
            }
            .eq-stat-group { display: flex; flex-direction: column; gap: 6px; }
            .eq-stat-val {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 24px;
                font-weight: 800;
                letter-spacing: -1px;
                display: flex;
                align-items: baseline;
                gap: 4px;
                transition: color 0.3s ease;
                color: #111;
            }
            .eq-stat-group:hover .eq-stat-val {
                color: #5C1414;
            }
            .eq-stat-val small { font-size: 12px; color: #8a8984; font-weight: 400; letter-spacing: 0; }
            .eq-stat-lbl {
                font-family: 'Inter', sans-serif;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #8a8984;
            }

            /* --- CONTROLS --- */
            .eq-controls {
                display: flex;
                align-items: flex-end;
                padding-bottom: 2px;
                border-bottom: 1px solid #f2f2f2;
                margin-bottom: 16px;
            }
            .eq-tabs { display: flex; gap: 36px; }
            .eq-tab {
                padding: 8px 0;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9.5px;
                font-weight: 700;
                color: #8a8984;
                background: none;
                border: none;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 1px;
                border-bottom: 2px solid transparent;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .eq-tab:hover { color: #5C1414; }
            .eq-tab.active { color: #111; border-bottom-color: #5C1414; }
            
            .eq-search-wrap {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .eq-search-box {
                background: #fcfcfc;
                border: 1px solid rgba(0,0,0,0.08);
                border-radius: 6px;
                padding: 10px 16px;
                font-size: 13px;
                width: 320px;
                font-family: 'Inter', sans-serif;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .eq-search-box:focus {
                border-color: rgba(92, 20, 20, 0.3);
                outline: none;
                box-shadow: 0 0 0 3px rgba(92, 20, 20, 0.05);
            }
            .eq-btn-rules {
                background: #fff;
                border: 1px solid rgba(0,0,0,0.08);
                border-radius: 6px;
                padding: 10px 16px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                cursor: pointer;
                color: #1e1e1e;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .eq-btn-rules:hover {
                border-color: rgba(92, 20, 20, 0.25);
                background: rgba(92, 20, 20, 0.02);
                color: #5C1414;
            }

            .eq-filter-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            .eq-pills { display: flex; align-items: center; gap: 12px; }
            .eq-filter-lbl { 
                font-family: 'JetBrains Mono', monospace; 
                font-size: 8px; 
                color: #8a8984; 
                text-transform: uppercase; 
                margin-right: 8px; 
            }
            .eq-pill {
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 9px;
                font-weight: 600;
                border: 1px solid rgba(0,0,0,0.08);
                background: #fff;
                cursor: pointer;
                color: #8a8984;
                font-family: 'Inter', sans-serif;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .eq-pill:hover {
                border-color: rgba(92, 20, 20, 0.2);
                color: #5C1414;
            }
            .eq-pill.active { background: #111111; color: #fff; border-color: #111111; }

            .eq-status-operational {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                text-transform: uppercase;
                color: #8a8984;
            }
            .eq-status-operational .dot { width: 5px; height: 5px; background: #10b981; border-radius: 50%; }

            /* --- CARD GRID --- */
            .eq-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 24px;
            }
            .eq-card {
                background: #fff;
                padding: 24px 24px;
                border-radius: 12px;
                border: 1px solid rgba(0,0,0,0.06);
                box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                display: flex;
                flex-direction: column;
                cursor: pointer;
                transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms ease, box-shadow 200ms ease;
                position: relative;
                overflow: hidden;
            }
            .eq-card:hover {
                background: #fff;
                transform: translateY(-2px);
                border-color: rgba(92, 20, 20, 0.18);
                box-shadow: 0 8px 24px rgba(92, 20, 20, 0.05), 0 2px 4px rgba(0,0,0,0.01);
            }
            .eq-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 3px;
                background: #5C1414;
                transition: width 200ms ease;
            }
            .eq-card:hover::before { width: 100%; }
            .eq-card-meta {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .eq-closing { color: #5C1414; font-weight: 700; }
            .eq-id { color: #bbb; }
            .eq-time { color: #bbb; display: flex; align-items: center; gap: 4px; }
            .eq-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 700;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .eq-badge.closing-soon {
                background: rgba(92, 20, 20, 0.08);
                color: #5c1414;
            }
            .eq-badge.high-confidence {
                background: rgba(16, 185, 129, 0.08);
                color: #10b981;
            }
            .eq-badge.trending {
                background: rgba(245, 158, 11, 0.08);
                color: #f59e0b;
            }
            .eq-badge.popular {
                background: rgba(99, 91, 255, 0.08);
                color: #635bff;
            }

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
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 24px;
                font-weight: 800;
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

            .eq-card-hover-details {
                opacity: 0;
                max-height: 0;
                overflow: hidden;
                transition: opacity 200ms ease, max-height 200ms ease, margin-top 200ms ease, margin-bottom 200ms ease;
                font-size: 11px;
                color: #666;
                border-top: 1px dashed rgba(0,0,0,0.06);
                padding-top: 12px;
                margin-top: 0;
                margin-bottom: 0;
            }
            .eq-card:hover .eq-card-hover-details {
                opacity: 1;
                max-height: 100px;
                margin-top: 16px;
                margin-bottom: 16px;
            }

            /* --- RULES MODAL --- */
            .eq-modal-backdrop {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.4);
                z-index: 1000;
                align-items: center;
                justify-content: center;
            }
            .eq-modal-backdrop.open { display: flex; }
            .eq-modal {
                background: #fff;
                width: 520px;
                max-width: 90vw;
                max-height: 85vh;
                overflow-y: auto;
                padding: 32px;
            }
            .eq-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }
            .eq-modal-title { font-size: 18px; font-weight: 700; color: #111; }
            .eq-modal-close { background: none; border: none; font-size: 18px; cursor: pointer; color: #888; padding: 4px 8px; }
            .eq-rule-divider {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #aaa;
                border-top: 1px solid #f2f2f2;
                padding-top: 16px;
                margin-top: 20px;
                margin-bottom: 12px;
                font-weight: 700;
            }
            .eq-rule-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 13px; color: #555; }
            .eq-rule-row input[type="checkbox"] { accent-color: #5C1414; }
            .eq-threshold-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
            .eq-threshold-table th { text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #aaa; padding: 8px 12px; border-bottom: 1px solid #f2f2f2; }
            .eq-threshold-table td { padding: 8px 12px; color: #555; border-bottom: 1px solid #f8f8f8; }
            .eq-threshold-table .tier-controlled { color: #166534; font-weight: 600; }
            .eq-threshold-table .tier-elevated { color: #9a3412; font-weight: 600; }
            .eq-threshold-table .tier-maximum { color: #9f1239; font-weight: 600; }
            .eq-threshold-table .tier-pledge { color: #166534; font-weight: 600; }
            .eq-threshold-table .tier-stake { color: #9a3412; font-weight: 600; }
            .eq-threshold-table .tier-all-in { color: #9f1239; font-weight: 600; }
            .eq-slider-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
            .eq-slider-label { font-size: 12px; color: #888; min-width: 80px; }
            .eq-slider { flex: 1; accent-color: #5C1414; }
            .eq-slider-value { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #111; font-weight: 600; min-width: 60px; text-align: right; }

            /* --- STAKE WARNING --- */
            .eq-stake-warning { max-width: 1300px; margin: 0 auto; padding: 24px 32px; border-top: 1px solid #f2f2f2; }
            .eq-stake-warning-text { font-size: 12px; color: #ccc; font-style: italic; }

            /* --- TWO PATHS (Solo vs Rivalry) --- */
            .eq-paths {
                max-width: 1300px; margin: 0 auto;
                padding: 80px 32px;
                border-top: 1px solid #f2f2f2;
            }
            .eq-paths-header {
                margin-bottom: 48px;
            }
            .eq-paths-sub {
                font-size: 15px; color: #888;
                line-height: 1.65; max-width: 560px;
                margin-top: 16px;
            }
            .eq-paths-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
            }
            .eq-path-card {
                background: #fff;
                border: 1px solid rgba(0,0,0,0.05);
                padding: 40px 36px;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                display: flex; flex-direction: column;
                transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
                overflow: hidden;
            }
            .eq-path-card:hover {
                background: #fff;
                transform: translateY(-4px);
                border-color: rgba(92, 20, 20, 0.15);
                box-shadow: 0 16px 48px -16px rgba(92, 20, 20, 0.08), 0 0 1px rgba(92, 20, 20, 0.12);
            }
            .eq-path-card.rivalry { border-color: rgba(92, 20, 20, 0.1); }
            .eq-path-card.rivalry:hover {
                border-color: rgba(92, 20, 20, 0.25);
                box-shadow: 0 16px 48px -16px rgba(92, 20, 20, 0.12), 0 0 1px rgba(92, 20, 20, 0.18);
            }
            .eq-path-icon { margin-bottom: 24px; }
            .eq-path-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px; font-weight: 700;
                letter-spacing: 1.2px; text-transform: uppercase;
                color: #8a8984; margin-bottom: 12px;
            }
            .eq-path-tag.rivalry { color: #5C1414; }
            .eq-path-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 22px; font-weight: 800;
                line-height: 1.2; letter-spacing: -0.5px;
                color: #111; margin-bottom: 16px;
            }
            .eq-path-title strong { font-weight: 800; }
            .eq-path-card.rivalry .eq-path-title strong { color: #5C1414; }
            .eq-path-desc {
                font-family: 'Inter', sans-serif;
                font-size: 14px; color: #666;
                line-height: 1.6; margin-bottom: 24px;
                flex-grow: 1;
            }
            .eq-path-details { margin-bottom: 28px; }
            .eq-path-detail {
                display: flex; align-items: center; gap: 10px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; color: #555;
                letter-spacing: 0.03em;
                padding: 6px 0;
            }
            .eq-path-check {
                font-size: 13px; font-weight: 700;
                color: #0F5132;
            }
            .eq-path-check.rivalry { color: #5C1414; }
            .eq-path-cta {
                display: inline-block;
                padding: 14px 24px;
                background: #111; color: #fff;
                border: none;
                border-radius: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 700;
                letter-spacing: 1px; text-transform: uppercase;
                text-decoration: none; text-align: center;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                align-self: flex-start;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                position: relative;
                overflow: hidden;
            }
            .eq-path-cta:hover {
                background: #5C1414;
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(92, 20, 20, 0.25);
            }
            .eq-path-cta.rivalry { background: #5C1414; }
            .eq-path-cta.rivalry:hover {
                background: #111;
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(17, 17, 17, 0.25);
            }
            .eq-path-cta::before {
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
            .eq-path-cta:hover::before {
                left: 150%;
                transition: left 0.8s ease-in-out;
            }

            /* ── Responsive: Tablet (≤1200px) ── */
            @media (max-width: 1200px) {
                .eq-grid { grid-template-columns: repeat(2, 1fr); }
                .eq-mechanism-grid { grid-template-columns: repeat(2, 1fr); }
                .eq-hero-headline { font-size: 64px; letter-spacing: -2.5px; }
                .eq-hero { padding: 80px 32px 60px; }
                .eq-mechanism { padding: 60px 0; }
                .eq-mechanism-header { flex-direction: column; align-items: flex-start; gap: 16px; }
                .eq-mechanism-side { text-align: left; max-width: 100%; }
                .eq-mech-card { padding: 40px 28px; }
                .eq-stats-strip { gap: 48px; }
                .eq-stat-val { font-size: 24px; }
                .eq-paths-grid { grid-template-columns: 1fr; gap: 20px; }
                .eq-paths { padding: 60px 32px; }
            }

            /* ── Responsive: Mobile (≤768px) ── */
            @media (max-width: 768px) {
                /* Hero */
                .eq-hero {
                    padding: 48px 20px 40px;
                    text-align: center;
                }
                .eq-hero-headline {
                    font-size: 36px !important;
                    letter-spacing: -1.5px !important;
                    margin-bottom: 24px;
                    max-width: 100%;
                }
                .eq-hero-sub {
                    font-size: 14px;
                    margin-bottom: 28px;
                    max-width: 100%;
                    margin-left: auto;
                    margin-right: auto;
                }
                .eq-hero-actions {
                    flex-direction: column;
                    gap: 16px;
                    align-items: center;
                }
                .eq-btn-primary {
                    padding: 16px 40px;
                    font-size: 13px;
                    text-align: center;
                    width: auto;
                }
                .eq-link-more {
                    text-align: center;
                }
                .eq-hero-scroll {
                    display: none;
                }
                .eq-tag {
                    display: none;
                }

                /* Mechanism */
                .eq-mechanism {
                    padding: 48px 0;
                }
                .eq-mechanism-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 40px;
                    padding: 0 20px;
                }
                .eq-mechanism-title {
                    font-size: 22px;
                    letter-spacing: -1px;
                }
                .eq-mechanism-side {
                    text-align: left;
                    max-width: 100%;
                    font-size: 13px;
                }
                .eq-mechanism-grid {
                    grid-template-columns: 1fr;
                }
                .eq-mech-card {
                    padding: 32px 20px;
                    border-right: none;
                    border-bottom: 1px solid #f0f0f0;
                }
                .eq-mech-card:last-child { border-bottom: none; }
                .eq-mech-num {
                    font-size: 36px;
                    margin-bottom: 20px;
                }
                .eq-mech-label {
                    font-size: 18px;
                    margin-bottom: 12px;
                }
                .eq-mech-desc {
                    font-size: 14px;
                }

                /* Market Header */
                .eq-market-header {
                    padding: 24px 20px 12px;
                }
                .eq-market-title {
                    font-size: 22px;
                    letter-spacing: -1px;
                    margin-bottom: 4px;
                }

                /* Stats — compact horizontal row on mobile */
                .eq-stats-strip {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0;
                    margin-bottom: 12px;
                    border: 1px solid #f0f0f0;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .eq-stat-group {
                    padding: 16px 12px;
                    text-align: center;
                    border-right: 1px solid #f0f0f0;
                }
                .eq-stat-group:last-child { border-right: none; }
                .eq-stat-val {
                    font-size: 16px;
                    letter-spacing: -0.5px;
                }
                .eq-stat-lbl {
                    font-size: 8px;
                    letter-spacing: 0.08em;
                }

                /* Controls — scrollable tabs */
                .eq-controls {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                }
                .eq-tabs {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    gap: 20px;
                    width: 100%;
                    padding-bottom: 2px;
                }
                .eq-tab {
                    white-space: nowrap;
                    font-size: 8px;
                }
                .eq-search-wrap {
                    width: 100%;
                }
                .eq-search-box {
                    flex: 1;
                    width: 100%;
                    min-width: 0;
                }

                /* Filters — scrollable pills */
                .eq-filter-bar {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .eq-pills {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    width: 100%;
                    padding-bottom: 4px;
                    flex-wrap: nowrap;
                }
                .eq-pill {
                    white-space: nowrap;
                    flex-shrink: 0;
                    font-size: 8px;
                    padding: 4px 10px;
                }

                /* Grid */
                .eq-grid {
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                .eq-grid-container {
                    padding: 0 20px !important;
                }
                .eq-card {
                    padding: 24px 20px 20px;
                }
                .eq-card-title {
                    font-size: 16px;
                }
                .eq-stake-val {
                    font-size: 20px;
                }
                .eq-card-cta {
                    padding: 14px;
                    font-size: 10px;
                }
                .eq-paths { padding: 48px 20px; }
                .eq-paths-grid { grid-template-columns: 1fr; gap: 16px; }
                .eq-path-card { padding: 28px 24px; }
                .eq-path-title { font-size: 24px; }
                .eq-path-desc { font-size: 13px; }

                /* Warning */
                .eq-stake-warning {
                    padding: 20px;
                }

                /* Modal */
                .eq-modal {
                    padding: 20px;
                    max-height: 90vh;
                }
                .eq-threshold-table th,
                .eq-threshold-table td {
                    padding: 6px 8px;
                    font-size: 11px;
                }
            }

            /* ── Responsive: Small phone (≤400px) ── */
            @media (max-width: 400px) {
                .eq-hero {
                    padding: 36px 16px 32px;
                }
                .eq-hero-headline {
                    font-size: 32px !important;
                    letter-spacing: -1.5px !important;
                }
                .eq-hero-sub {
                    font-size: 13px;
                }
                .eq-market-header {
                    padding: 36px 16px 20px;
                }
                .eq-market-title {
                    font-size: 24px;
                }
                .eq-mechanism-header {
                    padding: 0 16px;
                }
                .eq-mechanism-title {
                    font-size: 24px;
                }
                .eq-grid-container {
                    padding: 0 16px !important;
                }
                .eq-stat-val {
                    font-size: 24px;
                }
            }

            /* ── Hero Entrance Animations ── */
            @keyframes fadeSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes fadeSlideLeft {
                from {
                    opacity: 0;
                    transform: translateX(-24px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes headlineReveal {
                from {
                    opacity: 0;
                    transform: translateY(48px) scale(0.97);
                    filter: blur(4px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    filter: blur(0);
                }
            }
            @keyframes cardSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(36px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .anim-tag {
                opacity: 0;
                animation: fadeSlideLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
            }
            .anim-headline {
                opacity: 0;
                animation: headlineReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
            }
            .anim-sub {
                opacity: 0;
                animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards;
            }
            .anim-actions {
                opacity: 0;
                animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.75s forwards;
            }
            .anim-scroll-hint {
                opacity: 0;
                animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards;
            }

            /* ── Mechanism Section Animations ── */
            .anim-mech-tag {
                opacity: 0;
                animation: fadeSlideLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
                animation-play-state: paused;
            }
            .anim-mech-title {
                opacity: 0;
                animation: headlineReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
                animation-play-state: paused;
            }
            .anim-mech-card-1 {
                opacity: 0;
                animation: cardSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
                animation-play-state: paused;
            }
            .anim-mech-card-2 {
                opacity: 0;
                animation: cardSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.42s forwards;
                animation-play-state: paused;
            }
            .anim-mech-card-3 {
                opacity: 0;
                animation: cardSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.54s forwards;
                animation-play-state: paused;
            }
            .anim-mech-card-4 {
                opacity: 0;
                animation: cardSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.66s forwards;
                animation-play-state: paused;
            }

            /* When revealed by IntersectionObserver, play the animations */
            .revealed .anim-mech-tag,
            .revealed .anim-mech-title,
            .revealed .anim-mech-card-1,
            .revealed .anim-mech-card-2,
            .revealed .anim-mech-card-3,
            .revealed .anim-mech-card-4 {
                animation-play-state: running;
            }

            /* --- TIER SYSTEM SECTION --- */
            .eq-tiers {
                max-width: 1300px;
                margin: 0 auto;
                padding: 80px 32px;
                border-top: 1px solid #f2f2f2;
            }
            .eq-tiers-header {
                margin-bottom: 48px;
            }
            .eq-tiers-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            .eq-tier-card {
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 16px;
                padding: 36px 32px;
                display: flex;
                flex-direction: column;
                transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
                overflow: hidden;
                background: #fff;
            }
            .eq-tier-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0;
                width: 0; height: 3px;
                transition: width 0.4s ease;
            }
            .eq-tier-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 16px 48px -16px rgba(0,0,0,0.05);
            }
            .eq-tier-card:hover::before { width: 100%; }
            .eq-tier-card.pledge::before { background: #166534; }
            .eq-tier-card.pledge:hover { border-color: rgba(22, 101, 52, 0.2); }
            .eq-tier-card.stake::before { background: #9a3412; }
            .eq-tier-card.stake:hover { border-color: rgba(154, 52, 18, 0.2); }
            .eq-tier-card.allin::before { background: #5C1414; }
            .eq-tier-card.allin:hover { border-color: rgba(92, 20, 20, 0.2); }

            .eq-tier-card-badge {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                padding: 4px 10px;
                border-radius: 3px;
                display: inline-block;
                align-self: flex-start;
                margin-bottom: 24px;
            }
            .eq-tier-card-badge.pledge { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
            .eq-tier-card-badge.stake { background: #fff7ed; color: #9a3412; border: 1px solid #ffedd5; }
            .eq-tier-card-badge.allin { background: #fff1f2; color: #9f1239; border: 1px solid #ffe4e6; }

            .eq-tier-card-rate {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 36px;
                font-weight: 800;
                letter-spacing: -2px;
                color: #111;
                line-height: 1;
            }
            .eq-tier-card-rate-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #8a8984;
                margin-top: 6px;
            }
            .eq-tier-card-divider {
                width: 100%;
                height: 1px;
                background: #f0f0f0;
                margin: 24px 0;
            }
            .eq-tier-card-specs {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 20px;
            }
            .eq-tier-spec-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .eq-tier-spec-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #aaa;
            }
            .eq-tier-spec-value {
                font-size: 14px;
                font-weight: 600;
                color: #111;
                letter-spacing: -0.3px;
            }
            .eq-tier-card-note {
                font-size: 13px;
                color: #888;
                line-height: 1.5;
                margin-top: auto;
                font-style: italic;
            }
            .eq-tiers-footer {
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid #f0f0f0;
            }
            .eq-tiers-footer p {
                font-size: 13px;
                color: #999;
                line-height: 1.7;
                max-width: 720px;
            }
            .eq-tiers-footer strong { color: #555; }

            /* Tier section responsive: Tablet */
            @media (max-width: 1200px) {
                .eq-tiers-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
                .eq-tier-card { padding: 28px 24px; }
                .eq-tier-card-rate { font-size: 28px; }
            }
            /* Tier section responsive: Mobile */
            @media (max-width: 768px) {
                .eq-tiers { padding: 48px 20px; }
                .eq-tiers-grid { grid-template-columns: 1fr; gap: 16px; }
                .eq-tier-card { padding: 28px 24px; }
                .eq-tier-card-rate { font-size: 30px; }
            }
        
            .act-market-toggles {
                display: flex;
                align-items: center;
                background: #f1f1f2;
                padding: 4px;
                border-radius: 12px;
                margin-top: 24px;
                margin-bottom: 24px;
                position: relative;
                width: 100%;
                max-width: 400px;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
            }
            .act-market-btn {
                flex: 1;
                padding: 10px 0;
                background: transparent;
                border: none;
                border-radius: 8px;
                color: #888;
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.02em;
                cursor: pointer;
                position: relative;
                z-index: 2;
                transition: color 0.3s ease;
                text-align: center;
            }
            .act-market-btn:hover { color: #555; }
            .act-market-btn.active { color: #111; }
            .act-market-indicator {
                position: absolute;
                top: 4px;
                bottom: 4px;
                left: 4px;
                width: calc(50% - 4px);
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                z-index: 1;
            }
            .act-market-toggles[data-active="solo"] .act-market-indicator { transform: translateX(0); }
            .act-market-toggles[data-active="rivalry"] .act-market-indicator { transform: translateX(100%); }

            /* --- REVERTED RIVALRY DUEL CARDS (FIT TO GRID) --- */
            .eq-duel-card {
                background: #fff;
                border: 1px solid rgba(0,0,0,0.06);
                padding: 0;
                transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms ease, box-shadow 200ms ease;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                height: 100%;
                border-radius: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            }
            .eq-duel-card::before {
                content: ''; position: absolute; top: 0; left: 0;
                width: 3px; height: 0; background: var(--red);
                transition: height 200ms ease;
            }
            .eq-duel-card:hover::before { height: 100%; }
            .eq-duel-card:hover {
                border-color: rgba(92, 20, 20, 0.18);
                box-shadow: 0 8px 24px rgba(92, 20, 20, 0.05), 0 2px 4px rgba(0,0,0,0.01);
                transform: translateY(-2px);
            }
            .eq-duel-card:active { transform: translateY(-1px); }
            .eq-duel-card-inner { padding: 24px 24px 0; flex: 1; }
            .eq-duel-card-header {
                display: flex; align-items: center; justify-content: space-between;
                margin-bottom: 12px;
            }
            .eq-duel-card-status {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; font-weight: 700; letter-spacing: 1px;
                text-transform: uppercase; color: var(--green);
                display: flex; align-items: center; gap: 6px;
            }
            .eq-duel-card-status .dot {
                width: 5px; height: 5px; border-radius: 50%;
                background: currentcolor;
            }
            .eq-duel-card-status.pending { color: #d97706; }
            .eq-duel-card-status.ended { color: #9ca3af; }
            .eq-duel-card-metric {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                color: #8a8984;
                margin-bottom: 24px;
            }
            .eq-duel-card-metric span { font-weight: 400; }
            
            .eq-duel-versus {
                display: grid; grid-template-columns: 1fr auto 1fr;
                align-items: center;
                margin-bottom: 20px;
            }
            .eq-duel-player {
                display: flex; flex-direction: column; gap: 3px;
            }
            .eq-duel-player.right { text-align: right; }
            .eq-duel-player-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px; font-weight: 700; letter-spacing: 1.2px;
                color: #bbb; text-transform: uppercase;
            }
            .eq-duel-player-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 600; color: #333; letter-spacing: 0.02em;
                display: flex; align-items: center; gap: 5px;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .eq-duel-player.right .eq-duel-player-name { justify-content: flex-end; }
            .eq-duel-lead-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
            .eq-duel-player-growth {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 28px; font-weight: 800; color: #111;
                letter-spacing: -1px; margin-top: 2px; line-height: 1.1;
            }
            .eq-duel-player-growth.leading { color: var(--green); }
            .eq-duel-player-growth.trailing { color: var(--red); }
            .eq-duel-vs-divider {
                display: flex; align-items: center; justify-content: center;
                width: 48px; flex-shrink: 0;
                flex-direction: column; gap: 0;
                padding: 0 4px;
            }
            .eq-duel-swords svg {
                color: #e5e7eb;
                width: 32px;
                height: 32px;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .eq-duel-card:hover .eq-duel-swords svg {
                transform: scale(1.15);
                color: #111;
                filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
            }
            .eq-duel-momentum {
                height: 7px; display: flex; overflow: hidden;
                margin: 0 28px 0; background: #f5f4f0; border-radius: 4px;
            }
            .eq-duel-momentum-left { background: var(--green); transition: width .6s ease; border-radius: 4px 0 0 4px; }
            .eq-duel-momentum-right { background: var(--red); transition: width .6s ease; border-radius: 0 4px 4px 0; }
            
            .eq-duel-card-actions {
                display: flex; gap: 0; border-top: 1px solid rgba(0,0,0,0.05);
            }
            .eq-duel-action-btn {
                flex: 1; padding: 14px; border: none;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px; font-weight: 700; letter-spacing: 1px;
                cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                text-transform: uppercase; display: flex; align-items: center;
                justify-content: center; gap: 8px;
            }
            .eq-duel-action-accept { background: #111111; color: #fff; }
            .eq-duel-action-accept:hover { background: #5C1414; }
            .eq-duel-action-decline { background: #fff; color: #8a8984; border-left: 1px solid rgba(0,0,0,0.05) !important; }
            .eq-duel-action-decline:hover { color: #5C1414; background: rgba(92, 20, 20, 0.02); }
            
            .eq-duel-card-bottom {
                display: flex; align-items: flex-end; justify-content: space-between;
                padding: 16px 28px 24px;
                border-top: 1px solid rgba(0,0,0,0.05);
                margin-top: auto;
            }
            .eq-duel-card-stake { display: flex; flex-direction: column; gap: 2px; }
            .eq-duel-card-stake-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 800; color: #111; letter-spacing: -0.5px; }
            .eq-duel-card-stake-lbl {
                font-family: 'Inter', sans-serif;
                font-size: 8px; font-weight: 700; color: #8a8984;
                letter-spacing: 1px; text-transform: uppercase;
            }
            .eq-duel-card-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px; color: #8a8984; letter-spacing: 0.5px;
            }
            .eq-duel-card-time.urgent { color: #5C1414; font-weight: 700; }
            .eq-duel-card-provider-pill {
                display: inline-flex; align-items: center; padding: 2px 7px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 7px; font-weight: 700; letter-spacing: 0.5px;
                border-radius: 4px; color: #fff; margin-bottom: 4px;
            }

            .eq-duel-card-hover-details {
                opacity: 0;
                max-height: 0;
                overflow: hidden;
                transition: opacity 200ms ease, max-height 200ms ease, margin-top 200ms ease;
            }
            .eq-duel-card:hover .eq-duel-card-hover-details {
                opacity: 1;
                max-height: 100px;
                margin-top: 12px;
            }

        </style>

        <div class="eq">
            <!-- Section 3: Live Market Header -->
            <section class="eq-market-header" id="live-market" data-reveal style="margin-bottom: 24px;">
                <!-- Layer 1: Title, Live Status & Search -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <h2 class="eq-market-title" style="margin: 0; font-size: 36px; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif;">Collateral <strong style="color: #5C1414;">Market</strong></h2>
                        <div class="eq-market-live" style="margin: 8px 0 0 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <div class="eq-market-dot"></div>
                            <span style="font-weight: 700; color: #10b981; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.5px;">LIVE</span>
                            <span style="color: #ddd;">•</span>
                            <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #8a8984;" id="live-time-ago">Updated just now</span>
                        </div>
                    </div>
                    <div class="eq-search-wrap" style="margin-bottom: 0;">
                        <div style="position: relative; display: flex; align-items: center;">
                            <input type="text" class="eq-search-box" id="eq-search" placeholder="Search contracts, creators, or platforms… (Press '/')" style="padding-left: 36px; margin: 0; width: 320px;">
                            <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: #8a8984; pointer-events: none;"></i>
                        </div>
                        <button class="eq-btn-rules" id="btn-rules" style="margin: 0;">Rules</button>
                    </div>
                </div>

                <!-- Layer 2: Segmented Control & Compact Metrics -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                    <!-- Top Market Toggles (Segmented Control) -->
                    <div class="act-market-toggles" id="act-market-toggles" data-active="solo" style="margin-bottom: 0;">
                        <div class="act-market-indicator"></div>
                        <button class="act-market-btn active" data-type="solo">Solo Contracts</button>
                        <button class="act-market-btn" data-type="rivalry">Rivalries</button>
                    </div>

                    <!-- Compact inline stats with market-oriented labels -->
                    <div class="eq-stats-strip" style="margin-bottom: 0; gap: 24px; align-items: center;">
                        <div class="eq-stat-group" style="flex-direction: row; gap: 6px; align-items: baseline;">
                            <span class="eq-stat-lbl" style="font-size: 8px; color: #8a8984; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Open Capital:</span>
                            <span class="eq-stat-val" style="font-size: 15px; font-weight: 800; color: #111; letter-spacing: -0.5px; font-family: 'Plus Jakarta Sans', sans-serif;">$<span id="stat-capital">0</span></span>
                        </div>
                        <div class="eq-stat-group" style="flex-direction: row; gap: 6px; align-items: baseline;">
                            <span class="eq-stat-lbl" style="font-size: 8px; color: #8a8984; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Open Contracts:</span>
                            <span class="eq-stat-val" id="stat-contracts" style="font-size: 15px; font-weight: 800; color: #111; letter-spacing: -0.5px; font-family: 'Plus Jakarta Sans', sans-serif;">0</span>
                        </div>
                        <div class="eq-stat-group" style="flex-direction: row; gap: 6px; align-items: baseline;">
                            <span class="eq-stat-lbl" style="font-size: 8px; color: #8a8984; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Daily Volume:</span>
                            <span class="eq-stat-val" style="font-size: 15px; font-weight: 800; color: #111; letter-spacing: -0.5px; font-family: 'Plus Jakarta Sans', sans-serif;">$<span id="stat-pool">0</span></span>
                        </div>
                    </div>
                </div>

                <!-- Layer 3: Controls (Tabs) & Filters (Domain Pills) -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 12px; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                    <!-- Tabs -->
                    <div class="eq-controls" style="margin: 0; border: none; padding: 0; display: block;">
                        <div class="eq-tabs" id="eq-tabs">
                            <button class="eq-tab active" data-sort="trending_24h">TRENDING</button>
                            <button class="eq-tab" data-sort="new">NEW</button>
                            <button class="eq-tab" data-sort="closing_soon">CLOSING SOON</button>
                            <button class="eq-tab" data-sort="volume_24h">HIGH VOLUME</button>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="eq-filter-bar" style="margin: 0; padding: 0; border: none; display: block;">
                        <div class="eq-pills" id="eq-filters" style="margin: 0; gap: 8px;">
                            <span class="eq-filter-lbl" style="font-size: 9px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #8a8984; text-transform: uppercase; margin-right: 8px; letter-spacing: 0.5px;">Domain</span>
                            <button class="eq-pill active" data-category="all">All</button>
                            <button class="eq-pill" data-category="social">Social</button>
                            <button class="eq-pill" data-category="commerce">Commerce</button>
                            <button class="eq-pill" data-category="finance">Finance</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Contract Grid -->
            <div class="eq-grid-container" style="padding: 0 32px; max-width: 1440px; margin: 0 auto;">
                <div style="font-family:'Inter'; font-size: 10px; color: #ccc; margin-bottom: 24px;" id="eq-count-lbl">12 contracts</div>
                <div class="eq-grid" id="eq-grid">
                    <!-- Dynamic cards go here -->
                </div>
                <div id="eq-empty" style="display:none; padding:60px; text-align:center; color:#ccc; font-size:14px; grid-column:1/-1;">No contracts match your filters.</div>
            </div>

            <!-- Stake Warning -->
            <div class="eq-stake-warning">
                <div class="eq-stake-warning-text">Your deposit is locked during the goal period. If you fail to hit the target, the deposit is forfeited.</div>
            </div>
        </div>
        </div>

        <!-- Rules Modal -->
        <div class="eq-modal-backdrop" id="rules-modal" onclick="if(event.target===this) this.classList.remove('open')">
            <div class="eq-modal">
                <div class="eq-modal-header">
                    <span class="eq-modal-title">Goal Verification Rules</span>
                    <button class="eq-modal-close" onclick="document.getElementById('rules-modal').classList.remove('open')">✕</button>
                </div>

                <div class="eq-rule-divider">Enforcement</div>
                <div class="eq-rule-row"><input type="checkbox" checked disabled><span>Automatic Tracking (Direct API checks)</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked disabled><span>Locked-in Targets (Cannot be edited)</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked disabled><span>Final Decisions (No manual overrides)</span></div>
                <div class="eq-rule-row"><input type="checkbox" id="rule-buyout"><span>Buyout Available</span></div>

                <div class="eq-rule-divider">Goal Difficulty Filter</div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-controlled" data-tier="controlled"><span>PLEDGE — Normal targets (~30% success rate)</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-elevated" data-tier="elevated"><span>STAKE — Advanced targets (~20% success rate)</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-maximum" data-tier="maximum"><span>ALL-IN — Expert targets (~10% success rate)</span></div>

                <div class="eq-rule-divider">Minimum Staking Requirements</div>
                <table class="eq-threshold-table">
                    <thead>
                        <tr>
                            <th>Difficulty</th>
                            <th>X Followers</th>
                            <th>Revenue</th>
                            <th>Success Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tier-controlled">PLEDGE</td>
                            <td>≥ 100</td>
                            <td>≥ $500/mo</td>
                            <td>~30%</td>
                        </tr>
                        <tr>
                            <td class="tier-elevated">STAKE</td>
                            <td>≥ 250</td>
                            <td>≥ $2,000/mo</td>
                            <td>~20%</td>
                        </tr>
                        <tr>
                            <td class="tier-maximum">ALL-IN</td>
                            <td>≥ 500</td>
                            <td>≥ $5,000/mo</td>
                            <td>~10%</td>
                        </tr>
                    </tbody>
                </table>

                <div class="eq-rule-divider">Stake Range</div>
                <div class="eq-slider-row">
                    <span class="eq-slider-label">Min Capital</span>
                    <input type="range" class="eq-slider" id="stake-slider" min="0" max="10000" value="0" step="100">
                    <span class="eq-slider-value" id="stake-slider-value">$0</span>
                </div>
            </div>
        </div>
    `;
}

export async function initActiveContracts() {
    // Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Clear any existing intervals from previous mounts to prevent memory leaks and overlapping timers
    if (window.marketPollInterval) {
        clearInterval(window.marketPollInterval);
        window.marketPollInterval = null;
    }
    if (window.marketTimeAgoInterval) {
        clearInterval(window.marketTimeAgoInterval);
        window.marketTimeAgoInterval = null;
    }

    // State
    const urlParams = new URLSearchParams(window.location.search);
    let activeMarketType = urlParams.get('type') || 'solo';
    let activeSort = 'trending_24h';
    let activeCategory = 'all';
    let minStake = 0; // Controlled by rules modal
    let enabledTiers = { controlled: true, elevated: true, maximum: true };
    let lastFeedData = null;
    let isFrozen = false; // When execution is open

    // DOM Elements
    const grid = document.getElementById('eq-grid');
    const emptyEl = document.getElementById('eq-empty');
    const updateChip = document.getElementById('update-chip');
    const updateCount = document.getElementById('update-count');
    const lastUpdatedEl = document.getElementById('last-updated');
    const statCapital = document.getElementById('stat-capital');
    const statContracts = document.getElementById('stat-contracts');
    const statPool = document.getElementById('stat-pool');
    const countLbl = document.getElementById('eq-count-lbl');

    // ===================================================================
    // FIRST-VISIT ONBOARDING — now handled by /welcome route (Onboarding.js)
    // Mark as onboarded if they reach overview directly
    // ===================================================================
    if (!localStorage.getItem('collateral_onboarded')) {
        localStorage.setItem('collateral_onboarded', '1');
    }

    if (!grid) return;

    // Stats start at 0 until API data loads
    if (statCapital) statCapital.textContent = '0';
    if (statContracts) statContracts.textContent = '0';
    if (statPool) statPool.textContent = '0';

    // ===================================================================
    // DATA FETCHING & RENDERING
    // ===================================================================

    async function fetchFeed(isPoll = false) {
        if (isFrozen) return; // Don't update if user is executing

        try {
            let data;
            
            if (activeMarketType === 'rivalry') {
                const res = await api.getRivalries({ limit: 50 });
                if (res.ok && res.rivalries) {
                    data = { listings: res.rivalries.map(transformRivalry), stats: {} };
                } else {
                    data = { listings: [], stats: {} };
                }
            } else {
                const params = { sort: activeSort };
                if (activeCategory !== 'all') params.category = activeCategory;
                data = await getMarketListings(params);
            }

            if (isPoll) {
                // If data changed, auto-refresh the grid
                const contracts = Array.isArray(data?.listings) ? data.listings : [];
                const currentTopId = grid.querySelector('.eq-card')?.dataset.id;
                const newTopId = contracts[0]?.id;
                const hasChanges = currentTopId !== newTopId || contracts.length !== grid.querySelectorAll('.eq-card').length;

                if (hasChanges) {
                    lastFeedData = data;
                    renderGrid(contracts);
                    updateStats(data?.stats || {});
                    updateTime();
                }
            } else {
                const contracts = Array.isArray(data?.listings) ? data.listings : [];
                renderGrid(contracts);
                updateStats(data?.stats || {});
                lastFeedData = data;
                updateTime();
            }
        } catch (e) {
            console.error('[Market] Load failed:', e);
            if (!isPoll) grid.innerHTML = '<div class="eq-empty" style="display:block">Error loading market data</div>';
        }
    }

    function renderGrid(contracts) {
        // Clear grid
        grid.innerHTML = '';

        const searchQuery = (document.getElementById('eq-search')?.value || '').toLowerCase().trim();

        // Filter client-side for Rules (Tier/Stake) and Search Query
        const visibleContracts = contracts.filter(c => {
            const tier = (c.tier || 'controlled').toLowerCase();
            const stake = c.min_stake || (c.costCents ? c.costCents / 100 : 0);
            if (!enabledTiers[tier]) return false;
            if (stake < minStake) return false;

            if (searchQuery) {
                const titleMatch = (c.title || '').toLowerCase().includes(searchQuery);
                const metricMatch = (c.metric || '').toLowerCase().includes(searchQuery);
                const providerMatch = (c.provider || '').toLowerCase().includes(searchQuery);
                const challengerMatch = c.challenger && (c.challenger.name || '').toLowerCase().includes(searchQuery);
                const opponentMatch = c.opponent && (c.opponent.name || '').toLowerCase().includes(searchQuery);
                return titleMatch || metricMatch || providerMatch || challengerMatch || opponentMatch;
            }

            return true;
        });

        // Update count label
        if (countLbl) countLbl.textContent = `${visibleContracts.length} contract${visibleContracts.length !== 1 ? 's' : ''}`;

        if (visibleContracts.length === 0) {
            grid.innerHTML = '<div style="padding:60px; text-align:center; color:#ccc; font-size:14px; grid-column:1/-1; background:#fff;">No contracts match your filters.</div>';
            return;
        }

        visibleContracts.forEach(contract => {
            const el = document.createElement('div');
            el.innerHTML = (activeMarketType === 'rivalry') ? renderRivalryCard(contract) : renderCard(contract);
            const card = el.firstElementChild;
            grid.appendChild(card);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    
    function getProviderColor(provider) {
        const colors = { stripe: '#635bff', x: '#111', youtube: '#ff0000', shopify: '#96bf48', amazon: '#ff9900' };
        return colors[provider] || '#111';
    }


    const PLATFORM_MAP = { stripe: 'stripe', shopify: 'shopify', amazon: 'amazon', youtube: 'youtube' };
    const METRIC_LABELS = { 'revenue_growth': 'Revenue Growth', 'mrr_growth': 'MRR Growth', 'subscriber_growth': 'Subscriber Growth' };
    const STATE_TO_STATUS = { 'CHALLENGE_ISSUED': 'pending', 'ACCEPTED': 'pending', 'LIVE': 'active', 'SETTLED': 'settled', 'FORFEITED': 'settled' };

    function transformRivalry(r) {
        const challPart = r.participants?.find(p => p.role === 'challenger');
        const oppPart = r.participants?.find(p => p.role === 'opponent');
        const now = new Date();
        const end = r.deadlineUtc ? new Date(r.deadlineUtc) : new Date((new Date(r.activatedAt || r.createdAt)).getTime() + (r.durationDays || 30) * 86400000);
        const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));

        const metricName = METRIC_LABELS[r.metricType] || r.metricType || 'Revenue Growth';

        return {
            id: r.id,
            status: STATE_TO_STATUS[r.state] || 'active',
            state: r.state,
            metric: metricName,
            provider: PLATFORM_MAP[r.platform] || (r.platform || 'stripe').toLowerCase(),
            isOpen: !r.opponentUserId || r.opponentUsername === 'unknown' || !r.opponentUsername,
            challenger: {
                name: (r.challengerUsername || 'unknown'),
                growth: Math.max(0, parseFloat(challPart?.percentageDelta || challPart?.percentage_delta || challPart?.growthPercent || challPart?.currentDelta || 0)),
                baseline: parseFloat(challPart?.baselineValue || 0),
            },
            opponent: {
                name: r.opponentUserId ? (r.opponentUsername || 'unknown') : 'OPEN OPPONENT',
                growth: Math.max(0, parseFloat(oppPart?.percentageDelta || oppPart?.percentage_delta || oppPart?.growthPercent || oppPart?.currentDelta || 0)),
                baseline: parseFloat(oppPart?.baselineValue || 0),
            },
            stake: (r.stakePerSideCents || 0) / 100,
            daysLeft,
            totalDays: r.durationDays || 30,
            challFunded: !!challPart?.funded,
            oppFunded: !!oppPart?.funded,
            challengerUserId: r.challengerUserId,
            opponentUserId: r.opponentUserId,
            deadlineUtc: r.deadlineUtc,
            activatedAt: r.activatedAt,
            createdAt: r.createdAt,
            durationDays: r.durationDays
        };
    }

    function renderRivalryCard(r) {
        const isLeadingChallenger = r.challenger.growth >= r.opponent.growth;
        const isPending = r.state === 'CHALLENGE_ISSUED';
        const isAccepted = r.state === 'ACCEPTED';
        const isPreActive = isPending || isAccepted;
        const isSettled = r.status === 'settled';

        const statusClass = isPreActive ? 'pending' : isSettled ? 'ended' : '';
        const statusLabel = isPending ? 'FORMING' : isAccepted ? 'AWAITING FUNDS' : isSettled ? 'SETTLED' : 'LOCKED';
        
        const end = r.deadlineUtc ? new Date(r.deadlineUtc) : new Date((new Date(r.activatedAt || r.createdAt || Date.now())).getTime() + (r.durationDays || 30) * 86400000);
        const now = new Date();
        const timeLeftMs = end - now;
        const daysLeft = Math.max(0, Math.ceil(timeLeftMs / (1000 * 60 * 60 * 24)));
        const hoursLeft = Math.max(0, Math.ceil(timeLeftMs / (1000 * 60 * 60)));
        
        const timeLabel = isSettled ? 'SETTLED' : daysLeft <= 1 ? `${hoursLeft}H REMAINING` : `${daysLeft}D REMAINING`;
        const timeUrgent = !isSettled && daysLeft <= 3;
        
        const shortId = (r.id || '').substring(0, 8);

        const totalGrowth = Math.abs(r.challenger.growth) + Math.abs(r.opponent.growth);
        let leftPct = 50; let rightPct = 50;
        
        if (!isPreActive && totalGrowth > 0) {
            const rawLeft = (Math.abs(r.challenger.growth) / totalGrowth) * 100;
            leftPct = isLeadingChallenger ? Math.min(rawLeft + 10, 95) : Math.max(rawLeft - 10, 5);
            rightPct = 100 - leftPct;
        }

        const challGrowth = isPreActive
            ? '<span class="eq-duel-player-growth awaiting" style="font-family:\'Inter\',monospace;letter-spacing:0.1em;text-transform:uppercase;color:#ddd;font-size:12px;">FORMING</span>'
            : `<span class="eq-duel-player-growth ${isLeadingChallenger ? 'leading' : 'trailing'}">${r.challenger.growth > 0 ? '+' : ''}${r.challenger.growth}%</span>`;
            
        const oppGrowth = isPreActive
            ? '<span class="eq-duel-player-growth awaiting" style="font-family:\'Inter\',monospace;letter-spacing:0.1em;text-transform:uppercase;color:#ddd;font-size:12px;">FORMING</span>'
            : `<span class="eq-duel-player-growth ${!isLeadingChallenger ? 'leading' : 'trailing'}">${r.opponent.growth > 0 ? '+' : ''}${r.opponent.growth}%</span>`;

        const challDot = !isPreActive ? `<span class="eq-duel-lead-dot" style="background:${isLeadingChallenger ? 'var(--green)' : 'var(--red)'}"></span>` : '';
        const oppDot = !isPreActive ? `<span class="eq-duel-lead-dot" style="background:${!isLeadingChallenger ? 'var(--green)' : 'var(--red)'}"></span>` : '';

        let actionsHtml = '';
        if (isPending) {
            if (r.isOpen) {
                actionsHtml = `<div class="eq-duel-card-actions"><button class="eq-duel-action-btn eq-duel-action-accept" onclick="event.stopPropagation();window.app.acceptRivalry('${r.id}')" style="flex:1;">ACCEPT</button></div>`;
            } else {
                actionsHtml = `<div class="eq-duel-card-actions"><button class="eq-duel-action-btn eq-duel-action-accept" onclick="event.stopPropagation();window.app.acceptRivalry('${r.id}')">ACCEPT</button><button class="eq-duel-action-btn eq-duel-action-decline" onclick="event.stopPropagation();window.app.declineRivalry('${r.id}')">DECLINE</button></div>`;
            }
        } else if (isAccepted) {
            const myUserId = window.appState?.userId;
            const iAmChallenger = myUserId && r.challengerUserId === myUserId;
            const iAmOpponent = myUserId && r.opponentUserId === myUserId;
            const myFunded = (iAmChallenger && r.challFunded) || (iAmOpponent && r.oppFunded);
            if (myFunded) {
                actionsHtml = `<div class="eq-duel-card-actions"><div style="flex:1;padding:14px 16px;background:#f8f8f8;color:#999;text-align:center;font-family:'JetBrains Mono', monospace;font-size:10px;font-weight:700;letter-spacing:0.08em;border-top:1px solid #eee;">WAITING FOR OPPONENT</div></div>`;
            } else {
                actionsHtml = `<div class="eq-duel-card-actions"><button class="eq-duel-action-btn eq-duel-action-accept" onclick="event.stopPropagation();window.app.fundRivalry('${r.id}')" style="flex:1;">FUND YOUR SIDE</button></div>`;
            }
        }
        
        const providerColor = r.provider === 'stripe' ? '#635bff' : r.provider === 'shopify' ? '#96bf48' : '#111';

        return `
            <div class="eq-duel-card" data-status="${r.status}" data-id="${r.id}" onclick="window.router.navigate('/rivalry/${r.id}')">
                <div class="eq-duel-card-inner">
                    <div class="eq-duel-card-header">
                        <div class="eq-duel-card-status ${statusClass}">
                            <span class="dot"></span>
                            ${statusLabel}
                        </div>
                    </div>
                    <div class="eq-duel-card-metric">${r.metric} <span style="color:#ccc;font-size:10px;font-family:'JetBrains Mono', monospace;margin-left:6px;">ID:${shortId}</span></div>
                    <div class="eq-duel-versus">
                        <div class="eq-duel-player">
                            <span class="eq-duel-player-label">Challenger</span>
                            <span class="eq-duel-player-name">${challDot}${r.challenger.name}</span>
                            ${challGrowth}
                        </div>
                        <div class="eq-duel-vs-divider">
                            <div class="eq-duel-swords">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <g id="sword">
                                            <!-- Blade -->
                                            <path d="M48 20 L50 5 L52 20 L52 70 L48 70 Z" fill="currentColor" />
                                            <!-- Crossguard -->
                                            <rect x="35" y="70" width="30" height="4" rx="1.5" fill="currentColor" />
                                            <!-- Handle -->
                                            <rect x="47" y="74" width="6" height="16" fill="currentColor" />
                                            <!-- Pommel -->
                                            <circle cx="50" cy="92" r="4.5" fill="currentColor" />
                                        </g>
                                    </defs>
                                    <use href="#sword" transform="rotate(45 50 50)" />
                                    <use href="#sword" transform="rotate(-45 50 50)" />
                                </svg>
                            </div>
                        </div>
                        <div class="eq-duel-player right">
                            <span class="eq-duel-player-label">Opponent</span>
                            <span class="eq-duel-player-name">${r.opponent.name}${oppDot}</span>
                            ${oppGrowth}
                        </div>
                    </div>
                </div>
                ${!isPreActive ? `
                <div class="eq-duel-momentum">
                    <div class="eq-duel-momentum-left" style="width:${leftPct}%"></div>
                    <div class="eq-duel-momentum-right" style="width:${rightPct}%"></div>
                </div>` : ''}
                <div class="eq-duel-card-hover-details" style="padding: 0 28px; border-top: 1px dashed rgba(0,0,0,0.06); padding-top: 12px; margin-top: 0;">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 4px; font-size:10px;">
                        <span style="color:#8a8984; font-family:'JetBrains Mono',monospace;">VERIFICATION:</span>
                        <span style="font-weight:700; color:#1e1e1e; font-family:'JetBrains Mono',monospace;">${r.provider.toUpperCase()} API</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom: 4px; font-size:10px;">
                        <span style="color:#8a8984; font-family:'JetBrains Mono',monospace;">SETTLEMENT:</span>
                        <span style="font-weight:700; color:#1e1e1e; font-family:'JetBrains Mono',monospace;">MUTUAL CONSENSUS</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:10px;">
                        <span style="color:#8a8984; font-family:'JetBrains Mono',monospace;">HISTORICAL SUC:</span>
                        <span style="font-weight:700; color:#10b981; font-family:'JetBrains Mono',monospace;">98.6%</span>
                    </div>
                </div>
                <div class="eq-duel-card-bottom">
                    <div class="eq-duel-card-stake">
                        <span class="eq-duel-card-stake-val">$${(r.stake * 2).toLocaleString()}</span>
                        <span class="eq-duel-card-stake-lbl">CAPITAL EXPOSURE</span>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                        <span class="eq-duel-card-provider-pill" style="background:${providerColor}">${(r.provider || '').toUpperCase()}</span>
                        <span class="eq-duel-card-time${timeUrgent ? ' urgent' : ''}">${timeLabel}</span>
                    </div>
                </div>
                ${actionsHtml}
            </div>
        `;
    }

    

    function renderCard(c) {
        // map API data to UI
        const rawId = (c.id || '').toString();
        const shortId = rawId.split('-')[0] || rawId || '????';

        const tier = (c.tier || 'controlled').toLowerCase();
        // Use min_stake/max_stake from new API
        const min = c.min_stake || 0;
        const max = c.max_stake || 0;
        const fee = c.fee_bps ? (c.fee_bps / 100) : 2; // default 2%

        const stakeDisplay = (min === max)
            ? `$${min.toLocaleString()}`
            : `$${min.toLocaleString()} – $${max.toLocaleString()}`;

        const deadline = new Date(c.open_until || Date.now() + 86400000);
        const now = new Date();
        const timeLeftMs = deadline - now;
        const daysLeft = Math.ceil(timeLeftMs / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.ceil(timeLeftMs / (1000 * 60 * 60));

        let timeLabel = `${daysLeft}d left`;
        if (daysLeft <= 1) timeLabel = `${hoursLeft}h left`;
        if (timeLeftMs < 0) timeLabel = 'Ended';

        const platform = (c.provider || 'X').toString();
        const goal = c.title || 'Contract Goal';

        // Integration Icon
        let dotClass = 'x';
        if (platform === 'stripe') dotClass = 'stripe';
        if (platform === 'shopify') dotClass = 'shopify';
        if (platform === 'amazon') dotClass = 'amazon';

        const tierUpper = tier.toUpperCase();
        const multiplier = c.multiplier || (tierUpper === 'MAXIMUM' ? 4.0 : tierUpper === 'ELEVATED' ? 2.5 : 1.7);

        // Dynamic State Badge selection
        let badgeHtml = '';
        if (timeLeftMs > 0 && timeLeftMs < 1000 * 60 * 60 * 24) {
            badgeHtml = `<span class="eq-badge closing-soon">⏳ CLOSING SOON</span>`;
        } else if (multiplier >= 3.5 || tier === 'maximum') {
            badgeHtml = `<span class="eq-badge high-confidence">🟢 HIGH CONFIDENCE</span>`;
        } else if (parseInt(shortId, 16) % 3 === 0) {
            badgeHtml = `<span class="eq-badge trending">🔥 TRENDING</span>`;
        } else {
            badgeHtml = `<span class="eq-badge popular">⭐ POPULAR</span>`;
        }

        return `
            <div class="eq-card"
                 data-id="${c.id}" 
                 data-status="active" 
                 data-domain="${c.domain || 'social'}"
                 data-tier="${tier}" 
                 data-stake-min="${min}"
                 data-stake-max="${max}"
                 data-fee="${fee}"
                 data-deadline="${c.fundingCloseAt}"
                 data-goal="${goal}"
                 data-provider="${platform}">
                <div class="eq-card-meta">
                    ${badgeHtml}
                    <span class="eq-id">RCPT-${shortId.slice(0, 4).toUpperCase()}</span>
                    <span class="eq-time">○ ${timeLabel}</span>
                </div>
                <div class="eq-card-title">${goal}</div>
                <div class="eq-card-provider">
                    <span class="dot ${dotClass}" style="width: 6px; height: 6px; border-radius: 50%; background: ${dotClass === 'stripe' ? '#635bff' : dotClass === 'shopify' ? '#96bf48' : dotClass === 'amazon' ? '#ff9900' : '#111'}"></span>
                    <span class="eq-provider-name">${platform.toUpperCase()}</span>
                    <span class="eq-tier-badge ${tier}">${{controlled:'PLEDGE',elevated:'STAKE',maximum:'ALL-IN'}[tier] || tier.toUpperCase()}</span>
                </div>
                <div class="eq-card-status"><span class="dot" style="width:4px; height:4px; border-radius:50%; background:#10b981; display:inline-block; margin-right:4px;"></span> AUTOMATIC TRACKING</div>
                <div class="eq-card-stake-info" style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px dashed rgba(0,0,0,0.05); padding-top: 16px; margin-top: 16px; margin-bottom: 20px;">
                    <div>
                        <div class="eq-stake-val capacity" style="font-size: 28px; font-weight: 800; color: #111; letter-spacing: -1.2px; line-height: 1.1;">${stakeDisplay}</div>
                        <div class="eq-stake-lbl" style="font-size: 8px; font-weight: 700; color: #8a8984; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 6px;">Stake Range</div>
                    </div>
                    <div style="text-align: right;">
                        <div class="eq-stake-val multiplier" style="font-size: 20px; font-weight: 800; color: #5C1414; letter-spacing: -0.5px; line-height: 1.1;">${multiplier}x</div>
                        <div class="eq-stake-lbl" style="font-size: 8px; font-weight: 700; color: #8a8984; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 6px;">Yield Multiplier</div>
                    </div>
                </div>
                <div class="eq-card-hover-details">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 4px; font-size:10px;">
                        <span style="color:#8a8984; font-family:'JetBrains Mono',monospace;">TRACKED VIA:</span>
                        <span style="font-weight:700; color:#1e1e1e; font-family:'JetBrains Mono',monospace;">${platform.toUpperCase()} DATA</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom: 4px; font-size:10px;">
                        <span style="color:#8a8984; font-family:'JetBrains Mono',monospace;">VERIFICATION:</span>
                        <span style="font-weight:700; color:#1e1e1e; font-family:'JetBrains Mono',monospace;">AUTOMATIC</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:10px;">
                        <span style="color:#8a8984; font-family:'JetBrains Mono',monospace;">PAYOUT ON SUCCESS:</span>
                        <span style="font-weight:700; color:#10b981; font-family:'JetBrains Mono',monospace;">STAKE × ${multiplier}</span>
                    </div>
                </div>
                <button class="eq-card-cta primary eq-lock-btn">START COMMITMENT</button>
                <div class="eq-card-footer">Deposit returned once goal is verified.</div>
            </div>
        `;
    }

    function updateStats(stats) {
        if (!stats) return;

        // Active contracts
        if (statContracts) {
            statContracts.textContent = stats.activeCount || '0';
        }

        // Capital locked & Volume: pull from rivalry stats (this works NOW)
        fetchRivalryCapital();
    }

    async function fetchRivalryCapital() {
        try {
            const res = await api.getRivalryStats();
            if (!res.ok || !res.stats) return;
            const capital = (res.stats.totalCapitalLockedCents || 0) / 100;
            const largest = (res.stats.largestPoolCents || 0) / 100;

            if (statCapital) {
                if (capital >= 1_000_000) {
                    statCapital.textContent = (capital / 1_000_000).toFixed(1) + 'M';
                } else if (capital >= 1_000) {
                    statCapital.textContent = (capital / 1_000).toFixed(1) + 'k';
                } else {
                    statCapital.textContent = capital.toLocaleString();
                }
            }

            // Use largest pool as volume proxy
            if (statPool) {
                if (largest >= 1_000_000) {
                    statPool.textContent = (largest / 1_000_000).toFixed(1) + 'M';
                } else if (largest >= 1_000) {
                    statPool.textContent = (largest / 1_000).toFixed(1) + 'k';
                } else {
                    statPool.textContent = largest.toLocaleString();
                }
            }
        } catch (_) { /* silent */ }
    }

    let lastFeedUpdateTime = new Date();

    function updateTime() {
        lastFeedUpdateTime = new Date();
        updateTimeAgoText();
    }

    function updateTimeAgoText() {
        const now = new Date();
        const diffSec = Math.floor((now - lastFeedUpdateTime) / 1000);
        const timeAgoEl = document.getElementById('live-time-ago');
        if (timeAgoEl) {
            if (diffSec < 5) {
                timeAgoEl.textContent = 'Updated just now';
            } else {
                timeAgoEl.textContent = `Updated ${diffSec}s ago`;
            }
        }
    }

    window.marketTimeAgoInterval = setInterval(updateTimeAgoText, 1000);

    // ===================================================================
    // LISTENERS
    // ===================================================================

    
    // Market Toggles
    const marketToggles = document.getElementById('act-market-toggles');
    if (marketToggles) {
        marketToggles.dataset.active = activeMarketType;
        marketToggles.querySelectorAll('.act-market-btn').forEach(b => {
            if (b.dataset.type === activeMarketType) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        marketToggles.addEventListener('click', (e) => {
            const btn = e.target.closest('.act-market-btn');
            if (!btn) return;
            
            const type = btn.dataset.type || 'solo';
            
            marketToggles.querySelectorAll('.act-market-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            marketToggles.dataset.active = type;
            activeMarketType = type;
            fetchFeed(false);
        });
    }

    // Tabs
    const tabsContainer = document.getElementById('eq-tabs');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.eq-tab');
            if (!tab) return;
            tabsContainer.querySelectorAll('.eq-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeSort = tab.dataset.sort;
            fetchFeed(false);
        });
    }

    // Filters (Domain)
    const filtersContainer = document.getElementById('eq-filters');
    if (filtersContainer) {
        filtersContainer.addEventListener('click', (e) => {
            const pill = e.target.closest('.eq-pill');
            if (!pill) return;
            filtersContainer.querySelectorAll('.eq-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeCategory = pill.dataset.category;
            fetchFeed(false);
        });
    }

    // Search Live Filter
    const searchEl = document.getElementById('eq-search');
    if (searchEl) {
        searchEl.addEventListener('input', () => {
            if (lastFeedData) {
                const contracts = Array.isArray(lastFeedData?.listings) ? lastFeedData.listings : [];
                renderGrid(contracts);
            }
        });
    }

    // Update Chip
    if (updateChip) {
        updateChip.addEventListener('click', () => {
            if (lastFeedData) {
                const contracts = Array.isArray(lastFeedData?.listings) ? lastFeedData.listings : [];
                renderGrid(contracts);
                updateStats(lastFeedData.stats);
                updateTime();
            }
            updateChip.classList.remove('visible');
        });
    }

    // Initial Load
    fetchFeed(false);

    window.marketPollInterval = setInterval(() => fetchFeed(true), 15000);

    // ===================================================================
    // UNIFIED EXECUTION — Card click + Lock button → same modal
    // ===================================================================

    function extractContractData(cardEl) {
        const id = cardEl.dataset.id;
        const tier = (cardEl.dataset.tier || 'controlled').toLowerCase();
        const minStake = parseFloat(cardEl.dataset.stakeMin || '0');
        const maxStake = parseFloat(cardEl.dataset.stakeMax || '0');
        const feeBps = parseFloat(cardEl.dataset.fee || '2') * 100;
        const goal = cardEl.dataset.goal || '';
        const deadline = cardEl.dataset.deadline || '';

        const provider = (cardEl.dataset.provider || 'x').toLowerCase();

        const tierUpper = tier.toUpperCase();
        const multiplier = tierUpper === 'MAXIMUM' ? 4.0 : tierUpper === 'ELEVATED' ? 2.5 : 1.7;

        return {
            id,
            title: goal,
            goal,
            tier,
            provider,
            platform: provider,
            min_stake: minStake > 0 ? minStake : 25,
            max_stake: maxStake,
            multiplier,
            fee_bps: feeBps,
            window_days: 30,
            target_hint: goal,
            deadline
        };
    }

    grid.addEventListener('click', (e) => {
        // 1. Lock button — stop propagation, open modal
        const btn = e.target.closest('.eq-lock-btn');
        if (btn) {
            e.stopPropagation();
            e.preventDefault();
            const card = btn.closest('.eq-card');
            if (card) openExecutionModal(extractContractData(card));
            return;
        }

        // 2. Card click — navigate to contract term sheet
        const card = e.target.closest('.eq-card');
        if (card) {
            if (e.target.closest('button') || e.target.closest('input')) return;
            e.preventDefault();
            e.stopPropagation();
            const id = card.dataset.id;
            if (id) window.router.navigate('/contract/' + id);
        }
    });

    // Wire up Rule Modal Logic (preserved)
    const rulesBtn = document.getElementById('btn-rules');
    const rulesModal = document.getElementById('rules-modal');
    if (rulesBtn && rulesModal) {
        rulesBtn.addEventListener('click', () => rulesModal.classList.add('open'));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && rulesModal.classList.contains('open')) rulesModal.classList.remove('open');
        });

        // Rules filters
        document.getElementById('tier-controlled')?.addEventListener('change', (e) => { enabledTiers.controlled = e.target.checked; fetchFeed(false); });
        document.getElementById('tier-elevated')?.addEventListener('change', (e) => { enabledTiers.elevated = e.target.checked; fetchFeed(false); });
        document.getElementById('tier-maximum')?.addEventListener('change', (e) => { enabledTiers.maximum = e.target.checked; fetchFeed(false); });

        const stakeSlider = document.getElementById('stake-slider');
        const stakeVal = document.getElementById('stake-slider-value');
        if (stakeSlider && stakeVal) {
            stakeSlider.addEventListener('input', (e) => {
                minStake = parseInt(e.target.value);
                stakeVal.textContent = `$${minStake.toLocaleString()}`;
                fetchFeed(false);
            });
        }
    }

    // Keyboard Focus shortcut "/"
    const searchInputEl = document.getElementById('eq-search');
    if (searchInputEl) {
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInputEl) {
                if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                    return;
                }
                e.preventDefault();
                searchInputEl.focus();
                searchInputEl.select();
            }
        });
    }
}
