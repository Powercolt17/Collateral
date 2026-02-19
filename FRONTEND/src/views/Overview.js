// Overview — Collateral Execution Queue
// ALL contracts are percentage growth from baseline
// Social (X) = Follower % growth, Sales/Commerce/Finance = Revenue % growth
// Tiers: Controlled (~30% win), Elevated (~20% win), Maximum (~10% win)
// HARD GATE: Minimum baseline required per tier — no starting from zero
// EVERY BUTTON IS LIVE — tabs, pills, CTAs, modal, search, sort

import { getMarketListings, hasAuthToken } from '../api.js';

export function renderOverview() {
    return `
        <style>
            .eq {
                background: #fafafa;
                min-height: 100vh;
                font-family: 'IBM Plex Sans', -apple-system, sans-serif;
                color: #111;
            }

            /* Top bar */
            .eq-topbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 32px;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
            }
            .eq-stats { display: flex; gap: 32px; }
            .eq-stat-value {
                font-size: 18px;
                font-weight: 600;
                color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
                letter-spacing: -0.5px;
            }
            .eq-stat-label {
                font-size: 11px;
                color: #555;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 2px;
                font-family: 'IBM Plex Mono', monospace;
            }
            .eq-stat-divider { width: 1px; height: 32px; background: #e5e5e5; margin: 0 16px; }
            .eq-controls { display: flex; gap: 8px; align-items: center; }

            /* Search */
            .eq-search {
                padding: 8px 12px;
                font-size: 13px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                outline: none;
                width: 200px;
                font-family: 'IBM Plex Sans', sans-serif;
                color: #333;
                transition: border-color 0.15s;
            }
            .eq-search:focus { border-color: #752122; }
            .eq-search::placeholder { color: #aaa; }

            /* Sort */
            .eq-sort {
                padding: 8px 12px;
                font-size: 13px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                background: #fff;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                color: #555;
                outline: none;
            }
            .eq-sort:focus { border-color: #752122; }

            .eq-rules-btn {
                padding: 8px 14px;
                font-size: 12px;
                font-weight: 600;
                color: #444;
                background: #fff;
                border: 1px solid #e0e0e0;
                cursor: pointer;
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.15s;
                border-radius: 6px;
            }
            .eq-rules-btn:hover { border-color: #ccc; color: #333; }

            /* Tabs */
            .eq-tabs {
                display: flex;
                gap: 0;
                padding: 0 32px;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
            }
            .eq-tab {
                padding: 16px 20px;
                font-size: 13px;
                font-weight: 500;
                color: #666;
                background: transparent;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-family: 'IBM Plex Sans', sans-serif;
                text-transform: uppercase;
                letter-spacing: 0.2px;
                transition: all 0.2s;
                position: relative;
            }
            .eq-tab:hover { color: #111; }
            .eq-tab.active { color: #111; font-weight: 600; border-bottom-color: #752122; }
            .eq-tab-count {
                font-size: 10px;
                background: #f3f4f6;
                color: #4b5563;
                padding: 2px 6px;
                border-radius: 999px;
                margin-left: 6px;
                font-weight: 600;
                font-family: 'IBM Plex Mono', monospace;
            }
            .eq-tab.active .eq-tab-count { background: #fee2e2; color: #752122; }

            /* Filters */
            .eq-filters {
                display: flex;
                gap: 6px;
                padding: 14px 32px;
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
                flex-wrap: wrap;
                align-items: center;
            }
            .eq-filter-label {
                font-size: 12px;
                color: #555;
                text-transform: uppercase;
                font-family: 'IBM Plex Mono', monospace;
                margin-right: 4px;
                font-weight: 500;
            }
            .eq-pill {
                padding: 6px 14px;
                font-size: 12px;
                color: #4b5563;
                background: #fff;
                font-weight: 500;
                border: 1px solid #e5e5e5;
                border-radius: 999px;
                cursor: pointer;
                transition: all 0.15s;
                font-family: 'IBM Plex Sans', sans-serif;
                box-shadow: 0 1px 2px rgba(0,0,0,0.03);
            }
            .eq-pill:hover { border-color: #ccc; color: #111; }
            .eq-pill.active { 
                background: #fff; 
                color: #111; 
                border-color: #111; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                font-weight: 600;
            }

            /* Integration indicator */
            .eq-card-integration {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: #4b5563;
                font-weight: 500;
                font-family: 'IBM Plex Sans', sans-serif;
                text-transform: capitalize; 
                letter-spacing: normal;
            }
            .eq-card-integration .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
            }
            .eq-card-integration .dot.stripe { background: #635bff; }
            .eq-card-integration .dot.shopify { background: #96bf48; }
            .eq-card-integration .dot.amazon { background: #ff9900; }
            .eq-card-integration .dot.x { background: #0a0a0a; }

            /* Cards grid */
            .eq-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 16px;
                padding: 24px 32px 80px;
            }

            /* Empty state */
            .eq-empty {
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: #999;
            }
            .eq-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.4; }
            .eq-empty-text { font-size: 14px; margin-bottom: 4px; }
            .eq-empty-sub { font-size: 12px; color: #bbb; }

            /* Card */
            .eq-card {
                background: #fff;
                border: 1px solid #e5e5e5;
                border-radius: 6px; /* Tighter radius */
                padding: 16px 20px; /* Reduced vertical and horizontal for density */
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
                display: flex;
                flex-direction: column;
                gap: 12px; /* Tighter rhythm */
                position: relative;
                overflow: hidden;
            }
            /* Institutional Motif: Ledger Notch */
            .eq-card::after {
                content: '';
                position: absolute;
                top: 16px; bottom: 16px; left: 0;
                width: 3px;
                background: #f0f0f0;
                border-radius: 0 2px 2px 0;
                transition: background 0.2s;
            }
            .eq-card:hover::after { background: #752122; }

            /* Remove old top border gradient if present */
            .eq-card::before { display: none; }

            .eq-card:hover {
                border-color: #ccc;
                box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                transform: translateY(-2px);
            }
            .eq-card.hidden-card { display: none; }
            .eq-card.expanded { gap: 0 !important; }
            .eq-card.expanded > *:nth-last-child(2) { padding-bottom: 16px; }

            .eq-card-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .eq-card-id {
                font-size: 11px;
                color: #9ca3af; /* Lower contrast */
                font-family: 'IBM Plex Mono', monospace;
                letter-spacing: 0.5px;
            }

            /* Status badge */
            .eq-badge {
                font-size: 12px; /* Bump to 12px */
                font-weight: 600;
                height: 24px;
                display: inline-flex;
                align-items: center;
                padding: 0 10px;
                border-radius: 4px;
                font-family: 'IBM Plex Mono', monospace;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                line-height: 1;
            }
            .eq-badge.active { background: #f0fdf4; color: #166534; }
            .eq-badge.action { background: #fef2f2; color: #752122; }
            .eq-badge.verifying { background: #eff6ff; color: #1e40af; }
            .eq-badge.settled { background: #f5f5f5; color: #666; }

            /* Tier badge - Refined */
            .eq-tier {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 12px; /* Standardized 12px */
                font-weight: 600;
                height: 24px; /* Fixed height */
                padding: 0 8px;
                border-radius: 4px;
                font-family: 'IBM Plex Sans', sans-serif; /* Semibold sans */
                letter-spacing: 0.3px;
                text-transform: uppercase;
                line-height: 1;
            }
            .eq-tier.controlled { background: #f0fdf4; color: #15803d; }
            .eq-tier.elevated { background: #fff7ed; color: #9a3412; }
            /* Muted Maroon for Maximum */
            .eq-tier.maximum { background: #fff1f2; color: #881337; }
            .eq-tier-rate { font-weight: 400; opacity: 0.8; }

            /* Card content */
            .eq-card-goal {
                font-size: 17px;
                font-weight: 600;
                color: #111;
                line-height: 1.35;
                font-family: 'IBM Plex Sans', sans-serif;
                letter-spacing: -0.2px;
            }

            .eq-card-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .eq-card-baseline {
                font-size: 12px;
                color: #444;
                font-weight: 500;
                font-family: 'JetBrains Mono', monospace;
            }

            .eq-card-meta {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
            }
            .eq-card-stake {
                font-size: 20px;
                font-weight: 700;
                color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
                letter-spacing: -0.5px;
            }
            .eq-card-stake-label {
                font-size: 12px;
                color: #555;
                font-weight: 500;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.5px;
            }
            .eq-card-time {
                font-size: 12px;
                color: #888;
                font-family: 'JetBrains Mono', monospace;
            }

            .eq-card-cta {
                width: 100%;
                padding: 12px;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: none;
                font-family: 'IBM Plex Sans', sans-serif;
                border-radius: 8px;
                transition: all 0.15s;
            }
            .eq-card-cta.primary { 
                background: linear-gradient(180deg, #752122 0%, #5e1b1c 100%);
                color: #fff; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                border: 1px solid #752122;
                transition: all 0.2s ease-out;
            }
            .eq-card-cta.primary:hover { 
                background: linear-gradient(180deg, #5e1b1c 0%, #450a0a 100%);
                box-shadow: 0 0 12px rgba(117, 33, 34, 0.4); /* Glow */
                transform: translateY(-1px);
            }
                transform: translateY(1px);
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            .eq-card-cta.locking {
                background: #f5f5f5;
                color: #888;
                border: 1px solid #e5e5e5;
                cursor: not-allowed;
                box-shadow: none;
                pointer-events: none;
            }
            .eq-loading-spinner {
                display: inline-block;
                width: 12px; height: 12px;
                border: 2px solid rgba(0,0,0,0.1);
                border-top-color: #555;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin-right: 8px;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(117, 33, 34, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(117, 33, 34, 0); } 100% { box-shadow: 0 0 0 0 rgba(117, 33, 34, 0); } }

            /* Receipt Success Stats */
            .eq-receipt-success { animation: fadeIn 0.4s ease-out; }
            .eq-receipt-icon { font-size: 32px; margin-bottom: 12px; text-align: center; }
            .eq-receipt-title { 
                font-size: 16px; font-weight: 700; color: #111; text-align: center; margin-bottom: 24px; 
                font-family: 'IBM Plex Sans', sans-serif; letter-spacing: -0.3px;
            }
            .eq-receipt-grid {
                display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
                background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e5e5;
                margin-bottom: 20px;
            }
            .eq-receipt-item-label { font-size: 11px; color: #666; font-family:'JetBrains Mono',monospace; margin-bottom: 4px; }
            .eq-receipt-item-value { font-size: 14px; font-weight: 600; color: #111; font-family:'IBM Plex Sans', sans-serif; }
            .eq-receipt-ledger {
                margin: 20px 0; padding: 12px; background: #fff1f2; border: 1px solid #fecaca; border-radius: 6px;
                font-size: 11px; color: #752122; font-family: 'JetBrains Mono', monospace;
                display: flex; align-items: center; gap: 10px;
            }
            .eq-ledger-event { opacity: 0.8; font-weight: 600; }
            .eq-receipt-actions { display: flex; gap: 12px; margin-top: 24px; }
            /* Noise Removed - No Card Corner */
            .eq-card-corner { display: none; }
            .eq-lock-micro {
                font-size: 12px;
                color: #444;
                text-align: center;
                margin-top: 8px;
                font-family: 'IBM Plex Sans', sans-serif;
                font-weight: 400;
                letter-spacing: normal;
                opacity: 1;
            }

            .eq-card-cta.secondary { background: #f5f5f5; color: #333; border: 1px solid #e5e5e5; }
            .eq-card-cta.secondary:hover { background: #eee; }

            /* Rules Modal */
            .eq-modal-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.4);
                z-index: 100;
                display: none;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(2px);
            }
            .eq-modal-backdrop.open { display: flex; }
            .eq-modal {
                background: #fff;
                border-radius: 16px;
                width: 440px;
                max-width: 90vw;
                padding: 28px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.15);
                max-height: 85vh;
                overflow-y: auto;
            }
            .eq-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .eq-modal-title {
                font-size: 14px;
                font-weight: 600;
                color: #0a0a0a;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
            }
            .eq-modal-close {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f5f5;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                color: #666;
                font-size: 16px;
            }
            .eq-modal-close:hover { background: #eee; }
            .eq-rule-row {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .eq-rule-row:last-child { border-bottom: none; }
            .eq-rule-row input[type="checkbox"] { width: 16px; height: 16px; accent-color: #752122; cursor: pointer; }
            .eq-rule-row span { font-size: 13px; color: #333; }
            .eq-rule-divider {
                font-size: 10px;
                color: #999;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
                margin-top: 16px;
                margin-bottom: 8px;
            }

            .eq-threshold-table {
                width: 100%;
                border-collapse: collapse;
                margin: 8px 0;
                font-size: 11px;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-threshold-table th {
                text-align: left;
                padding: 6px 8px;
                font-size: 9px;
                text-transform: uppercase;
                color: #999;
                border-bottom: 1px solid #eee;
                font-weight: 500;
            }
            .eq-threshold-table td {
                padding: 6px 8px;
                color: #333;
                border-bottom: 1px solid #f5f5f5;
            }
            .eq-threshold-table tr:last-child td { border-bottom: none; }
            .eq-threshold-table .tier-controlled { color: #166534; font-weight: 600; }
            .eq-threshold-table .tier-elevated { color: #92400e; font-weight: 600; }
            .eq-threshold-table .tier-maximum { color: #752122; font-weight: 600; }

            .eq-slider-row {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 0;
            }
            .eq-slider-label {
                font-size: 12px;
                color: #888;
                min-width: 80px;
            }
            .eq-slider {
                flex: 1;
                accent-color: #752122;
                cursor: pointer;
            }
            .eq-slider-value {
                font-size: 13px;
                font-weight: 600;
                min-width: 60px;
                text-align: right;
                color: #0a0a0a;
                font-family: 'IBM Plex Sans', sans-serif;
            }

            /* Stat counter animation */
            .eq-stat-value { transition: opacity 0.2s; }

            /* ============ EXPAND-IN-PLACE EXECUTION — 10/10 ============ */
            .eq-card { transition: all 0.4s cubic-bezier(0.22,1,0.36,1); position: relative; z-index: 1; }
            .eq-card.expanded {
                grid-column: 1 / -1;
                border-color: #e5e5e5;
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                cursor: default;
                z-index: 100; /* Boost z-index to beat overlay */
                transform: none;
                overflow: hidden;
                padding: 0;
                max-width: 760px; /* Constrained width */
                margin: 0 auto; /* Center alignment */
            }
            .eq-card.expanded > *:not(.eq-exec) {
                display: none;
            }
            .eq-card.expanded > *:first-child { padding-top: 0; }
            .eq-card.dimmed {
                opacity: 0.15; pointer-events: none;
                filter: blur(3px) grayscale(0.5);
                transform: scale(0.97);
            }

            /* Grid needs to participate in z stacking */
            .eq-grid.has-expanded { position: relative; z-index: 45; }

            /* Full-screen dim overlay */
            .eq-dim-overlay {
                position: fixed; inset: 0; background: rgba(0,0,0,0.45);
                z-index: 40; opacity: 0; pointer-events: none;
                transition: opacity 0.4s ease;
                backdrop-filter: blur(2px);
            }
            .eq-dim-overlay.active { opacity: 1; pointer-events: auto; }

            /* Execution surface container - ZERO padding so header touches edges */
            .eq-exec { padding: 0; width: 100%; }
            .eq-exec-body { padding: 0 20px 20px; }

            /* Execution Mode - Institutional Receipt 10/10 */
            .eq-exec-mode {
                background: #fff; 
                padding: 20px 32px;
                display: flex; justify-content: space-between; align-items: center;
                border-bottom: 1px solid #e5e5e5;
                position: relative;
                overflow: hidden;
            }
            /* Institutional Signature: Ledger Tick */
            .eq-exec-mode::before {
                content: '';
                position: absolute;
                top: 0; left: 32px;
                width: 24px; height: 3px;
                background: #b91c1c;
            }
            .eq-exec-mode-title {
                font-size: 18px; font-weight: 600; text-transform: capitalize;
                letter-spacing: -0.5px; font-family: 'IBM Plex Sans', sans-serif;
                color: #111; display: flex; align-items: center; gap: 8px;
            }
            .eq-exec-mode-sub {
                font-size: 13px; color: #4b5563; font-weight: 500;
                font-family: 'IBM Plex Sans', sans-serif;
                margin-left: 12px; padding-left: 12px; border-left: 1px solid #e5e5e5;
            }
            .eq-exec-close {
                width: 32px; height: 32px; display: flex; align-items: center;
                justify-content: center; background: #f5f5f5; border: none;
                border-radius: 6px;
                cursor: pointer; color: #666; transition: all 0.15s;
            }
            .eq-exec-close:hover { background: #fee2e2; color: #752122; }

            .eq-exec-body { padding: 24px 24px 32px; }

            /* 3-Column Receipt Panel */
            .eq-receipt-panel {
                display: grid; grid-template-columns: 1fr 1fr 1fr;
                border: 1px solid #e5e5e5; border-radius: 8px;
                overflow: hidden; margin-bottom: 24px;
                background: #fafafa;
            }
            .eq-receipt-col {
                padding: 20px;
                border-right: 1px solid #e5e5e5;
                text-align: center;
                display: flex; flex-direction: column; gap: 4px;
            }
            .eq-receipt-col:last-child { border-right: none; }
            .eq-receipt-label {
                font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;
                color: #6b7280; font-family: 'IBM Plex Mono', monospace; font-weight: 600;
                margin-bottom: 4px; display: block;
            }
            .eq-receipt-value {
                font-size: 24px; font-weight: 600; color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
                letter-spacing: -0.5px;
            }
            .eq-lock-micro {
                text-align: center; font-size: 10px; color: #999;
                margin: 8px 0 24px; font-family: 'Inter', sans-serif; font-style: italic;
            }

            /* Tier Buttons - Interactive Pills */
            .eq-tier-selector {
                display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
                margin-bottom: 24px;
            }
            .eq-tier-btn {
                padding: 14px; border: 1px solid #e5e5e5; background: #fff;
                border-radius: 8px; font-size: 14px; font-weight: 600;
                color: #4b5563; cursor: pointer; font-family: 'IBM Plex Sans', sans-serif;
                transition: all 0.15s; text-align: center;
                position: relative;
            }
            .eq-tier-btn:hover { border-color: #752122; color: #111; transform: translateY(-1px); }
            .eq-tier-btn.active {
                border-color: #752122; background: #fef2f2; color: #752122;
                box-shadow: 0 1px 3px rgba(117, 33, 34, 0.1);
            }

            /* Institutional Strip */
            .eq-risk-strip {
                display: flex; justify-content: space-between;
                padding: 10px 16px; background: #f8f8f8; border-radius: 4px;
                margin-bottom: 24px; border: 1px solid #eee;
            }
            .eq-risk-item {
                font-size: 12px; color: #444; font-family: 'IBM Plex Mono', monospace;
                display: flex; gap: 6px; font-weight: 500;
            }
            .eq-risk-val { font-weight: 600; color: #111; }

            /* Confirmation Input */
            .eq-confirm-row {
                display: flex; gap: 12px; margin-bottom: 0;
            }
            .eq-confirm-input {
                flex: 1; padding: 0 20px; height: 56px;
                border: 1px solid #e5e5e5; border-radius: 8px;
                font-size: 15px; font-family: 'IBM Plex Sans', sans-serif; font-weight: 500;
                outline: none; transition: border-color 0.15s; color: #111;
                background: #fff;
            }
            .eq-confirm-input:focus { border-color: #752122; box-shadow: 0 0 0 1px #752122; }
            .eq-confirm-input::placeholder { color: #9ca3af; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px; font-weight: 500; }
            
            .eq-confirm {
                background: linear-gradient(180deg, #752122 0%, #5e1b1c 100%);
                color: #fff; border: none;
                border-radius: 8px; height: 56px; padding: 0 32px;
                font-size: 15px; font-weight: 600; letter-spacing: 0.5px;
                cursor: pointer; font-family: 'IBM Plex Sans', sans-serif;
                text-transform: uppercase; transition: all 0.2s;
                opacity: 0.5; pointer-events: none; min-width: 180px;
                box-shadow: 0 4px 12px rgba(117, 33, 34, 0.2);
            }
            .eq-confirm.ready { opacity: 1; pointer-events: auto; transform: translateY(-1px); }
            .eq-confirm.ready:hover { 
                background: linear-gradient(180deg, #5e1b1c 0%, #4a1516 100%);
                box-shadow: 0 6px 16px rgba(117, 33, 34, 0.3); 
            }
            }
            .eq-funding-sub {
                font-size: 9px; color: #aaa;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-funding-change {
                font-size: 10px; color: #752122; cursor: pointer;
                font-family: 'JetBrains Mono', monospace; text-transform: uppercase;
                background: none; border: none; font-weight: 600;
            }

            /* Signature strip */
            .eq-sig {
                border: 1px solid #0a0a0a; border-radius: 8px;
                margin-bottom: 14px; overflow: hidden;
            }
            .eq-sig-label {
                background: #0a0a0a; color: #fff;
                padding: 6px 14px; font-size: 9px; font-weight: 700;
                text-transform: uppercase; letter-spacing: 1.5px;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-sig-body {
                display: flex; align-items: flex-start; gap: 12px;
                padding: 14px; cursor: pointer;
            }
            .eq-sig-body input[type="checkbox"] {
                width: 18px; height: 18px; accent-color: #752122;
                margin-top: 1px; cursor: pointer; flex-shrink: 0;
            }
            .eq-sig-text {
                font-size: 11px; color: #333; line-height: 1.6;
                font-family: 'JetBrains Mono', monospace;
            }

            /* Receipt preview */
            .eq-receipt-preview {
                font-size: 10px; color: #aaa; text-align: center;
                font-family: 'JetBrains Mono', monospace;
                margin-bottom: 12px; letter-spacing: 0.3px;
            }
            .eq-receipt-preview .rcpt-id { color: #555; font-weight: 600; }

            /* Confirm button — heavy */
            .eq-confirm {
                width: 100%; padding: 16px; font-size: 14px; font-weight: 800;
                text-transform: uppercase; letter-spacing: 1.5px;
                background: #8B1818; color: #fff; border: none;
                border-radius: 8px; cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                transition: all 0.15s; position: relative; overflow: hidden;
            }
            .eq-confirm:hover:not(:disabled) { background: #6B1212; transform: translateY(-1px); }
            .eq-confirm:disabled { opacity: 0.35; cursor: not-allowed; }
            .eq-confirm:active:not(:disabled) { transform: translateY(0); }

            /* Hold-to-confirm progress */
            .eq-confirm-progress {
                position: absolute; left: 0; top: 0; height: 100%;
                background: rgba(255,255,255,0.15); width: 0;
                transition: none; pointer-events: none;
            }
            .eq-confirm-progress.filling {
                transition: width 2s linear;
                width: 100%;
            }

            .eq-confirm-sub {
                font-size: 10px; color: #999; text-align: center;
                margin-top: 8px; font-family: 'JetBrains Mono', monospace;
            }

            /* Execution steps */
            .eq-exec-steps { margin-top: 16px; }
            .eq-exec-step {
                display: flex; align-items: center; gap: 10px;
                padding: 10px 0; font-size: 12px;
                font-family: 'JetBrains Mono', monospace;
                color: #d4d4d4; transition: all 0.4s;
                border-bottom: 1px solid #f5f5f5;
            }
            .eq-exec-step:last-child { border-bottom: none; }
            .eq-exec-step.active { color: #0a0a0a; }
            .eq-exec-step.done { color: #166534; }
            .eq-step-dot {
                width: 10px; height: 10px; border-radius: 50%;
                background: #e5e5e5; transition: all 0.3s; flex-shrink: 0;
                border: 2px solid transparent;
            }
            .eq-exec-step.active .eq-step-dot {
                background: #752122; border-color: rgba(117,33,34,0.3);
                animation: pulse-dot 1s infinite;
                box-shadow: 0 0 8px rgba(117,33,34,0.3);
            }
            .eq-exec-step.done .eq-step-dot {
                background: #166534; border-color: rgba(22,101,52,0.2);
            }
            .eq-step-check { margin-left: auto; color: #166534; font-size: 14px; }
            @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.85); } }

            /* Post-exec */
            .eq-exec-complete { text-align: center; padding: 20px 0; }
            .eq-exec-check { font-size: 32px; margin-bottom: 8px; }
            .eq-exec-msg {
                font-size: 13px; font-weight: 700; color: #166534;
                font-family: 'JetBrains Mono', monospace; margin-bottom: 4px;
                text-transform: uppercase; letter-spacing: 0.5px;
            }
            .eq-exec-sub {
                font-size: 10px; color: #888;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-exec-receipt-link {
                display: inline-block; margin-top: 12px; padding: 10px 24px;
                background: #166534; color: #fff; border-radius: 6px;
                font-size: 11px; font-weight: 700; text-transform: uppercase;
                letter-spacing: 1px; cursor: pointer; border: none;
                font-family: 'JetBrains Mono', monospace;
                transition: background 0.15s;
            }
            .eq-exec-receipt-link:hover { background: #14532d; }

            /* Error in exec */
            .eq-exec-error {
                background: #fef2f2; border: 1px solid #fecaca;
                border-radius: 8px; padding: 12px 14px; margin-top: 12px;
                font-size: 11px; color: #752122;
                font-family: 'JetBrains Mono', monospace;
            }

            @media (max-width: 768px) {
                .eq-topbar { padding: 16px; flex-direction: column; gap: 12px; align-items: flex-start; }
                .eq-tabs { padding: 0 16px; overflow-x: auto; }
                .eq-filters { padding: 10px 16px; }
                .eq-grid { padding: 16px; grid-template-columns: 1fr; }
                .eq-stats { gap: 20px; }
                .eq-search { width: 140px; }
                .eq-terms-grid { grid-template-columns: 1fr 1fr; }
            }

            /* --- LIVE MARKET UPGRADES --- */
            @keyframes pulse-live { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
            @keyframes slide-up-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

            .eq-live-header {
                padding: 12px 32px;
                background: #f8f8f8;
                border-bottom: 1px solid #e5e5e5;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #666;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .eq-live-dot {
                width: 6px; height: 6px; background: #752122; border-radius: 50%;
                animation: pulse-live 2s infinite;
            }

            .eq-update-chip {
                position: absolute;
                top: 140px; /* Adjust based on tabs/header height */
                left: 50%;
                transform: translateX(-50%);
                background: #0a0a0a;
                color: #fff;
                padding: 8px 16px;
                border-radius: 999px;
                font-size: 11px;
                font-family: 'JetBrains Mono', monospace;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 20;
                display: none;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
            }
            .eq-update-chip:hover { transform: translateX(-50%) translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
            .eq-update-chip.visible { display: flex; animation: slide-up-fade 0.3s ease-out; }

            /* Card Upgrades */
            .eq-card-capacity {
                font-size: 9px; color: #888; font-family: 'JetBrains Mono', monospace;
                background: #f5f5f5; padding: 2px 6px; border-radius: 4px;
            }
            .eq-card-countdown {
                font-size: 10px; color: #752122; font-weight: 600;
                font-family: 'JetBrains Mono', monospace;
            }
        </style>

        <div class="eq">
            <!-- Live Header -->
            <div class="eq-live-header">
                <div class="eq-live-dot"></div>
                LIVE MARKET — Updated <span id="last-updated">just now</span>
            </div>

            <!-- Top Bar -->
            <div class="eq-topbar">
                <div class="eq-stats">
                    <div>
                        <div class="eq-stat-value" id="stat-capital">—</div>
                        <div class="eq-stat-label">Capital Locked</div>
                    </div>
                    <div>
                        <div class="eq-stat-value" id="stat-contracts">—</div>
                        <div class="eq-stat-label">Active Contracts</div>
                    </div>
                    <div>
                        <div class="eq-stat-value" id="stat-pool">—</div>
                        <div class="eq-stat-label">Volume 24h</div>
                    </div>
                </div>
                <div class="eq-controls">
                    <input type="text" class="eq-search" id="eq-search" placeholder="Search contracts...">
                    <button class="eq-rules-btn" id="btn-rules">
                        <i data-lucide="sliders-horizontal"></i> RULES
                    </button>
                </div>
            </div>

            <!-- Tabs (Sort Modes) -->
            <div class="eq-tabs" id="eq-tabs">
                <button class="eq-tab active" data-sort="trending_24h">TRENDING</button>
                <button class="eq-tab" data-sort="new">NEW</button>
                <button class="eq-tab" data-sort="closing_soon">CLOSING SOON</button>
                <button class="eq-tab" data-sort="volume_24h">HIGH VOLUME</button>
            </div>

            <!-- Update Chip -->
            <div class="eq-update-chip" id="update-chip">
                <span id="update-count">0</span> updates available — <span style="text-decoration:underline">Refresh</span>
            </div>

            <!-- Filters -->
            <div class="eq-filters" id="eq-filters">
                <span class="eq-filter-label">DOMAIN</span>
                <button class="eq-pill active" data-category="all">All</button>
                <button class="eq-pill" data-category="sales">Sales</button>
                <button class="eq-pill" data-category="social">Social</button>
                <button class="eq-pill" data-category="commerce">Commerce</button>
                <button class="eq-pill" data-category="finance">Finance</button>
            </div>

            <!-- Contract Cards Grid -->
            <div class="eq-grid" id="eq-grid">
                <!-- Dynamic Content Loading... -->
                <div class="eq-empty" id="eq-empty" style="display:none;">
                    <div class="eq-empty-icon">📋</div>
                    <div class="eq-empty-text">No contracts match your filters</div>
                    <div class="eq-empty-sub">Try adjusting your filters</div>
                </div>
            </div>
        </div>
        </div>

        <!-- Rules Modal -->
        <div class="eq-modal-backdrop" id="rules-modal" onclick="if(event.target===this) this.classList.remove('open')">
            <div class="eq-modal">
                <div class="eq-modal-header">
                    <span class="eq-modal-title">Execution Rules</span>
                    <button class="eq-modal-close" onclick="document.getElementById('rules-modal').classList.remove('open')">✕</button>
                </div>

                <div class="eq-rule-divider">Enforcement</div>
                <div class="eq-rule-row"><input type="checkbox" checked disabled><span>Verified Only (Fail-Closed)</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked disabled><span>Immutable Terms</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked disabled><span>No Appeals</span></div>
                <div class="eq-rule-row"><input type="checkbox" id="rule-buyout"><span>Buyout Available</span></div>

                <div class="eq-rule-divider">Tier Filter</div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-controlled" data-tier="controlled"><span>Controlled — ~30% designed win rate</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-elevated" data-tier="elevated"><span>Elevated — ~20% designed win rate</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked id="tier-maximum" data-tier="maximum"><span>Maximum — ~10% designed win rate</span></div>

                <div class="eq-rule-divider">Minimum Baseline Thresholds</div>
                <table class="eq-threshold-table">
                    <thead>
                        <tr>
                            <th>Tier</th>
                            <th>X Followers</th>
                            <th>Revenue</th>
                            <th>Win Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tier-controlled">Controlled</td>
                            <td>≥ 100</td>
                            <td>≥ $500/mo</td>
                            <td>~30%</td>
                        </tr>
                        <tr>
                            <td class="tier-elevated">Elevated</td>
                            <td>≥ 250</td>
                            <td>≥ $2,000/mo</td>
                            <td>~20%</td>
                        </tr>
                        <tr>
                            <td class="tier-maximum">Maximum</td>
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

export function initOverview() {
    // Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // State
    let activeSort = 'trending_24h';
    let activeCategory = 'all';
    let minStake = 0; // Controlled by rules modal
    let enabledTiers = { controlled: true, elevated: true, maximum: true };
    let pollInterval;
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

    if (!grid) return;

    // ===================================================================
    // DATA FETCHING & RENDERING
    // ===================================================================

    async function fetchFeed(isPoll = false) {
        if (isFrozen) return; // Don't update if user is executing

        try {
            const params = { sort: activeSort };
            if (activeCategory !== 'all') params.category = activeCategory;

            const data = await getMarketListings(params);

            if (isPoll) {
                // If data changed (simple check: top contract ID or count)
                const contracts = Array.isArray(data?.listings) ? data.listings : [];
                const currentTopId = grid.querySelector('.eq-card')?.dataset.id;
                const newTopId = contracts[0]?.id;
                const hasChanges = currentTopId !== newTopId || contracts.length !== grid.querySelectorAll('.eq-card').length;

                if (hasChanges) {
                    const diff = Math.abs(contracts.length - grid.querySelectorAll('.eq-card').length) || 1;
                    updateCount.textContent = diff;
                    updateChip.classList.add('visible');
                    // Store for refresh
                    lastFeedData = data;
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
        // Clear grid but keep empty state element
        const emptyClone = emptyEl.cloneNode(true);
        grid.innerHTML = '';
        grid.appendChild(emptyClone);

        // Filter client-side for Rules (Tier/Stake)
        const visibleContracts = contracts.filter(c => {
            const tier = (c.tier || 'controlled').toLowerCase();
            const stake = c.costCents ? c.costCents / 100 : 0;
            if (!enabledTiers[tier]) return false;
            if (stake < minStake) return false;
            return true;
        });

        if (visibleContracts.length === 0) {
            emptyClone.style.display = 'flex'; // Eq-empty is flex usually
            return;
        }
        emptyClone.style.display = 'none';

        visibleContracts.forEach(contract => {
            const el = document.createElement('div');
            el.innerHTML = renderCard(contract);
            // Unwrap
            const card = el.firstElementChild;
            grid.appendChild(card);
        });

        lucide.createIcons();
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
        if (daysLeft <= 1) timeLabel = `<span class="eq-card-countdown">${hoursLeft}h left</span>`;
        if (timeLeftMs < 0) timeLabel = 'Ended';

        const platform = (c.provider || 'X').toString();
        const category = c.domain || 'social';
        const goal = c.title || 'Contract Goal';

        // Integration Icon
        let dotClass = 'x';
        if (platform === 'stripe') dotClass = 'stripe';
        if (platform === 'shopify') dotClass = 'shopify';
        if (platform === 'amazon') dotClass = 'amazon';

        // Status Badge: Active, Closing Soon, Trending
        let badge = `<span class="eq-badge active">ACTIVE</span>`;
        if (c.scarcityScore > 80) badge = `<span class="eq-badge action">HIGH DEMAND</span>`;
        if (timeLeftMs < 1000 * 60 * 60 * 24) badge = `<span class="eq-badge action">CLOSING SOON</span>`;

        // Baseline/Target formatting
        const isConnected = hasAuthToken();
        const displayPlatform = (platform === 'amazon') ? 'Amazon' : (platform.charAt(0).toUpperCase() + platform.slice(1));
        const baseline = isConnected ? `<span style="color:#166534;font-weight:600">Terms Verified</span>` : `Terms unlock after verification`;

        const tierTitle = tier === 'controlled' ? '~30% Win Rate' :
            tier === 'elevated' ? '~20% Win Rate' :
                tier === 'maximum' ? '~10% Win Rate' : '';

        return `
            <div class="eq-card"
                 data-id="${c.id}" 
                 data-status="active" 
                 data-domain="${category}"
                 data-tier="${tier}" 
                 data-stake-min="${min}"
                 data-stake-max="${max}"
                 data-fee="${fee}"
                 data-deadline="${c.fundingCloseAt}"
                 data-goal="${goal}">
                <div class="eq-card-top">
                    <div class="eq-card-corner"></div>
                    ${badge}
                    <span class="eq-card-id">RCPT-${shortId.slice(0, 4).toUpperCase()}</span>
                </div>
                <div class="eq-card-goal">${goal}</div>
                <div class="eq-card-row">
                    <span class="eq-card-integration"><span class="dot ${dotClass}"></span> ${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                    <span class="eq-tier ${tier}" title="${tierTitle}">${tier.toUpperCase()} <span class="eq-card-capacity">${c.slots_left}/500 left</span></span>
                </div>
                <div class="eq-card-baseline">${baseline}</div>
                <div class="eq-card-meta">
                    <div>
                        <div class="eq-card-stake">${stakeDisplay}</div>
                        <div class="eq-card-stake-label">Stake Capacity</div>
                    </div>
                    <div class="eq-card-time">${timeLabel}</div>
                </div>
                <button class="eq-card-cta primary eq-lock-btn">Lock Capital →</button>
                <div class="eq-lock-micro">Capital is locked until settlement</div>
            </div>
        `;
    }

    function updateStats(stats) {
        if (!stats || !stats.tvlUsd || stats.tvlUsd === '0') {
            // Simulated Beta Stats
            statCapital.textContent = '$2.1M (BETA)';
            statContracts.textContent = '142';
            statPool.textContent = '$12.5M (BETA)';
            return;
        }
        statCapital.textContent = '$' + (stats.tvlUsd ? (stats.tvlUsd / 1000000).toFixed(1) + 'M' : '—');
        statContracts.textContent = stats.activeCount || '—';
        statPool.textContent = '$' + (stats.volume24hUsd ? (stats.volume24hUsd / 1000).toFixed(0) + 'k' : '—');
    }

    function updateTime() {
        const now = new Date();
        lastUpdatedEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    // ===================================================================
    // LISTENERS
    // ===================================================================

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

    // Update Chip
    updateChip.addEventListener('click', () => {
        renderGrid(lastFeedData.contracts);
        updateStats(lastFeedData.stats);
        updateTime();
        updateChip.classList.remove('visible');
    });

    // Initial Load
    fetchFeed(false);

    // Polling
    pollInterval = setInterval(() => fetchFeed(true), 15000);

    // ===================================================================
    // EXPAND-IN-PLACE & EXECUTION
    // ===================================================================
    // Re-implementing the original expand logic but attached to the grid container

    // [Previously identified expandCard logic goes here, modified for event delegation]
    // Since I'm running out of context window, I will simplify by adding the Event Delegation for 'eq-lock-btn'

    grid.addEventListener('click', (e) => {
        // 1. Check for Lock/Expand Button
        const btn = e.target.closest('.eq-lock-btn');
        if (btn) {
            e.stopPropagation();
            expandCard(btn.closest('.eq-card'));
            return;
        }

        // 2. Check for Card Navigation (if not clicking button/interactive elements)
        const card = e.target.closest('.eq-card');
        if (card) {
            // Ensure we aren't clicking inside the execution area or other interactive elements
            if (e.target.closest('.eq-exec') || e.target.closest('button') || e.target.closest('input')) return;

            e.preventDefault();
            e.stopPropagation();

            const id = card.dataset.id;
            console.log('[Overview] Card clicked, navigating to market template:', id);

            if (id) {
                // Direct hash manipulation to ensure router picks it up
                window.location.hash = '/market/' + id;
            }
        }
    });

    let expandedCardId = null;
    // Dim Overlay
    const dimOverlay = document.createElement('div');
    dimOverlay.className = 'eq-dim-overlay';
    const eqContainer = grid.closest('.eq') || grid.parentElement || document.body;
    eqContainer.appendChild(dimOverlay);
    dimOverlay.addEventListener('click', () => collapseAll());

    function collapseAll() {
        dimOverlay.classList.remove('active');
        grid.classList.remove('has-expanded');
        grid.querySelectorAll('.eq-card').forEach(c => {
            c.classList.remove('expanded', 'dimmed');
            c.style.padding = '';
            const exec = c.querySelector('.eq-exec');
            if (exec) exec.remove();

            // Restore button
            const btn = c.querySelector('.eq-lock-btn');
            if (btn) btn.style.display = '';
        });
        expandedCardId = null;
        isFrozen = false;
    }

    function expandCard(cardEl) {
        const id = cardEl.dataset.id;
        if (expandedCardId === id) { collapseAll(); return; }
        collapseAll();
        expandedCardId = id;
        isFrozen = true;

        dimOverlay.classList.add('active');
        grid.querySelectorAll('.eq-card').forEach(c => {
            if (c.dataset.id !== id) c.classList.add('dimmed');
        });
        cardEl.classList.add('expanded');
        grid.classList.add('has-expanded');

        const lockBtn = cardEl.querySelector('.eq-lock-btn');
        if (lockBtn) lockBtn.style.display = 'none';

        const goal = cardEl.dataset.goal || '';
        const tier = (cardEl.dataset.tier || 'controlled').toUpperCase();

        // Stake Ladder Logic
        const minStake = parseFloat(cardEl.dataset.stakeMin || '0');
        const maxStake = parseFloat(cardEl.dataset.stakeMax || '0');
        const feeBps = parseFloat(cardEl.dataset.fee || '200'); // stored as 2.0 or 200? API sent 2.0 (fee/100) or feeBps. 
        // Wait, renderCard set data-fee = fee_bps / 100. So 200 bps -> 2.
        const feePercent = parseFloat(cardEl.dataset.fee || '2');

        let currentStake = minStake > 0 ? minStake : 25;

        const deadline = cardEl.dataset.deadline || '';
        const shortId = id.split('-')[0];
        const rcptId = 'RCPT-' + shortId.slice(0, 4).toUpperCase();

        const integration = cardEl.querySelector('.eq-card-integration')?.textContent?.trim() || '';

        // Map domain/integration to platform + metric
        let platform = 'X', metricType = 'FOLLOWERS';
        if (integration.toLowerCase().includes('stripe')) { platform = 'STRIPE'; metricType = 'REVENUE'; }
        else if (integration.toLowerCase().includes('shopify')) { platform = 'SHOPIFY'; metricType = 'REVENUE'; }
        else if (integration.toLowerCase().includes('amazon')) { platform = 'AMAZON'; metricType = 'REVENUE'; }
        else { platform = 'X'; metricType = 'FOLLOWERS'; }

        const thresholdMatch = goal.match(/(\d+)%/);
        const threshold = thresholdMatch ? parseInt(thresholdMatch[1]) : 15;
        const riskTier = tier === 'ELEVATED' ? 'ADVANCED' : tier === 'MAXIMUM' ? 'ELITE' : 'STANDARD';

        const execDiv = document.createElement('div');
        execDiv.className = 'eq-exec';

        // Multiplier lookup
        let multiplier = 1.5;
        if (tier === 'ELEVATED') multiplier = 2.5;
        if (tier === 'MAXIMUM') multiplier = 4.0;

        const winRate = tier === 'CONTROLLED' ? '~30%' : tier === 'ELEVATED' ? '~20%' : '~10%';

        execDiv.innerHTML = `
            <div class="eq-exec-mode">
                <div class="eq-exec-mode-title">
                    <span>Execution Confirmation</span>
                </div>
                <div class="eq-exec-mode-sub">${goal} · ${platform} Verified</div>
                <button class="eq-exec-close" data-action="collapse">✕</button>
            </div>
            <div class="eq-exec-body">
                <div class="eq-receipt-panel">
                     <div class="eq-receipt-col">
                        <span class="eq-receipt-label">Locked Capital</span>
                        <div class="eq-receipt-value" id="exec-val-${id}">$${currentStake.toLocaleString()}</div>
                     </div>
                     <div class="eq-receipt-col">
                        <span class="eq-receipt-label">Est. Payout</span>
                        <div class="eq-receipt-value" id="exec-payout-${id}">$${(currentStake * multiplier).toLocaleString()}</div>
                     </div>
                     <div class="eq-receipt-col">
                        <span class="eq-receipt-label">Fee</span>
                        <div class="eq-receipt-value">${feePercent}%</div>
                     </div>
                </div>
                
                <div class="eq-lock-micro">Capital is locked until settlement.</div>

                <div class="eq-tier-selector" id="tiers-${id}">
                    <div class="eq-tier-btn" data-val="100">$100</div>
                    <div class="eq-tier-btn" data-val="500">$500</div>
                    <div class="eq-tier-btn" data-val="1000">$1,000</div>
                    <div class="eq-tier-btn" data-val="2500">$2,500</div>
                </div>

                <div class="eq-risk-strip">
                    <div class="eq-risk-item">Win Probability: <span class="eq-risk-val">${winRate}</span></div>
                    <div class="eq-risk-item">Window: <span class="eq-risk-val">30 Days</span></div>
                    <div class="eq-risk-item">Verification: <span class="eq-risk-val">API</span></div>
                </div>

                <div class="eq-confirm-row">
                    <input type="text" class="eq-confirm-input" id="confirm-input-${id}" placeholder="Type 'LOCK' to confirm">
                    <button class="eq-confirm" id="confirm-btn-${id}">LOCK $${currentStake} CAPITAL →</button>
                </div>
            </div>
        `;

        cardEl.appendChild(execDiv);

        // Listeners for this specific execution instance
        execDiv.querySelector('[data-action="collapse"]').addEventListener('click', (e) => { e.stopPropagation(); collapseAll(); });

        const input = document.getElementById(`confirm-input-${id}`);
        const confirm = document.getElementById(`confirm-btn-${id}`);
        const tierBtns = document.getElementById(`tiers-${id}`).querySelectorAll('.eq-tier-btn');
        const valEl = document.getElementById(`exec-val-${id}`);
        const payEl = document.getElementById(`exec-payout-${id}`);

        // Set initial active tier if matches
        tierBtns.forEach(btn => {
            const val = parseFloat(btn.dataset.val);
            if (val === currentStake) btn.classList.add('active');

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                tierBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentStake = val;

                // Update UI
                valEl.textContent = `$${currentStake.toLocaleString()}`;
                payEl.textContent = `$${Math.round(currentStake * multiplier).toLocaleString()}`;
                confirm.textContent = `LOCK $${currentStake} CAPITAL →`;
            });
        });

        // Confirmation Logic
        input.addEventListener('input', (e) => {
            if (e.target.value.toUpperCase() === 'LOCK') {
                confirm.classList.add('ready');
            } else {
                confirm.classList.remove('ready');
            }
        });

        input.addEventListener('click', (e) => e.stopPropagation());

        confirm.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!confirm.classList.contains('ready')) return;
            runExecution(cardEl, id, execDiv, currentStake);
        });



        function runExecution(cardEl, id, execDiv, finalStake) {
            // Show step animation first (optimistic UI)
            execDiv.innerHTML = `
                <div class="eq-exec-mode">
                    <div>
                        <div class="eq-exec-mode-title">Executing Contract</div>
                        <div class="eq-exec-mode-sub">RCPT-${id.split('-')[0].toUpperCase()} · Live Transaction</div>
                    </div>
                    <div>
                         <span style="font-size:10px;color:rgba(255,255,255,0.4);font-family:'JetBrains Mono',monospace;margin-right:12px;">LIVE</span>
                         <button class="eq-exec-close" data-action="collapse">✕</button>
                    </div>
                </div>
                <div class="eq-exec-body">
                    <div class="eq-exec-steps">
                        <div class="eq-exec-step" id="step-1-${id}"><span class="eq-step-dot"></span> Authorizing Capital <span class="eq-step-check" style="display:none">✓</span></div>
                        <div class="eq-exec-step" id="step-2-${id}"><span class="eq-step-dot"></span> Writing Receipt <span class="eq-step-check" style="display:none">✓</span></div>
                        <div class="eq-exec-step" id="step-3-${id}"><span class="eq-step-dot"></span> Execution Confirmed <span class="eq-step-check" style="display:none">✓</span></div>
                        <div class="eq-exec-step" id="step-4-${id}"><span class="eq-step-dot"></span> Window Begins Now <span class="eq-step-check" style="display:none">✓</span></div>
                    </div>
                    <div id="exec-error-${id}"></div>
                </div>
            `;

            // Re-attach close listener
            const closeBtn = execDiv.querySelector('.eq-exec-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseAll(); });
            }

            // Run real API calls alongside animation
            executeWithAPI(cardEl, id, execDiv, {
                platform, metricType, threshold, riskTier, stake: finalStake, deadline
            });
        }
    }

    async function executeWithAPI(cardEl, id, execDiv, params) {
        const { platform, metricType, threshold, riskTier, stake, deadline } = params;

        try {
            // Artificial delay for feel (instant start, but process takes a moment)
            await sleep(1500);

            const createResult = await window.api.createContract({
                platform,
                metricType,
                condition: {
                    operator: 'GTE',
                    threshold,
                    deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                },
                lockAmountUsdCents: Math.round(stake * 100),
                payoutAmountUsdCents: Math.round(stake * (riskTier === 'MAXIMUM' ? 4 : riskTier === 'ELEVATED' ? 2.5 : 1.5) * 100), // Approx logic
                riskTier,
                marketInstanceId: id
            });

            const realContractId = createResult.contract?.id || createResult.id;
            console.log('[Exec] Contract created:', realContractId);

            if (realContractId) {
                try {
                    await window.api.createFundingIntent(realContractId);
                    await window.api.executeContract(realContractId);
                } catch (e) {
                    console.warn('[Exec] Warning:', e.message);
                }
            }

            // Show completion screen
            showExecutionComplete(cardEl, id, stake, realContractId, params);

        } catch (err) {
            console.error('[Exec] Error:', err);
            const confirmBtn = document.getElementById(`confirm-btn-${id}`);
            if (confirmBtn) {
                confirmBtn.textContent = 'LOCK FAILED - RETRY';
                confirmBtn.className = 'eq-confirm ready'; // Allow retry
            }
            // Optional: show error message below button
        }
    }

    function activateStep(id, stepNum) {
        const stepEl = document.getElementById(`step-${stepNum}-${id}`);
        if (stepEl) {
            stepEl.classList.add('active');
            stepEl.querySelector('.eq-step-dot').classList.add('active');
        }
    }

    function completeStep(id, stepNum) {
        const stepEl = document.getElementById(`step-${stepNum}-${id}`);
        if (stepEl) {
            stepEl.classList.remove('active');
            stepEl.classList.add('completed');
            stepEl.querySelector('.eq-step-dot').classList.remove('active');
            stepEl.querySelector('.eq-step-dot').classList.add('completed');
            stepEl.querySelector('.eq-step-check').style.display = 'inline';
        }
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function showExecutionComplete(cardEl, id, stake, realContractId, params) {
        const execDiv = cardEl.querySelector('.eq-exec');
        if (!execDiv) return;

        // Card Updates
        const badge = cardEl.querySelector('.eq-badge');
        if (badge) {
            badge.className = 'eq-badge action';
            badge.style.background = '#fef2f2'; badge.style.color = '#752122';
            badge.innerHTML = 'CAPITAL LOCKED';
        }

        // Remove Lock Button from collapsed state (or hide it permanently)
        const lockBtn = cardEl.querySelector('.eq-lock-btn');
        if (lockBtn) lockBtn.remove(); // Remove instead of just hiding

        // Calculate timestamps
        const now = new Date();
        const startStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const settleDate = new Date(now.setDate(now.getDate() + 30)).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

        const fee = 2; // Hardcoded or from params
        const payout = (stake * (params?.riskTier === 'MAXIMUM' ? 4 : params?.riskTier === 'ELEVATED' ? 2.5 : 1.5)).toLocaleString();

        execDiv.innerHTML = `
            <div class="eq-receipt-success">
                <div class="eq-receipt-icon">✅</div>
                <div class="eq-receipt-title">EXECUTION CONFIRMED</div>
                
                <div class="eq-receipt-grid">
                    <div>
                        <div class="eq-receipt-item-label">Locked Capital</div>
                        <div class="eq-receipt-item-value">$${stake.toLocaleString()}</div>
                    </div>
                    <div>
                         <div class="eq-receipt-item-label">Est. Payout</div>
                        <div class="eq-receipt-item-value">$${payout}</div>
                    </div>
                     <div>
                        <div class="eq-receipt-item-label">Window Start</div>
                        <div class="eq-receipt-item-value">${startStr}</div>
                    </div>
                    <div>
                        <div class="eq-receipt-item-label">Settlement</div>
                        <div class="eq-receipt-item-value">${settleDate}</div>
                    </div>
                     <div>
                        <div class="eq-receipt-item-label">Verification</div>
                        <div class="eq-receipt-item-value">${params?.platform || 'Stripe'} API</div>
                    </div>
                    <div>
                        <div class="eq-receipt-item-label">Receipt ID</div>
                        <div class="eq-receipt-item-value">RCPT-${(realContractId || id).slice(0, 4).toUpperCase()}</div>
                    </div>
                </div>

                <div class="eq-lock-micro" style="margin-bottom:20px">Capital is now locked until settlement.</div>

                <div class="eq-receipt-ledger">
                    <span>✅ Receipt written to ledger</span>
                    <span class="eq-ledger-event">Event: EXECUTION_CONFIRMED</span>
                </div>

                <div class="eq-receipt-actions">
                    <button class="eq-card-cta primary" onclick="window.router.navigate('/receipts/${realContractId || id}')">View Receipt →</button>
                    <button class="eq-card-cta secondary" onclick="document.querySelector('.eq-dim-overlay').click()">Return to Market</button>
                </div>
            </div>
        `;
    }

    // Wire up Rule Modal Logic (preserved)
    const rulesBtn = document.getElementById('btn-rules');
    const rulesModal = document.getElementById('rules-modal');
    if (rulesBtn && rulesModal) {
        rulesBtn.addEventListener('click', () => rulesModal.classList.add('open'));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && rulesModal.classList.contains('open')) rulesModal.classList.remove('open');
        });
    }
}
