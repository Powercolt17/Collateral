// Token view — CLTR Institutional Control Portal
// Fully integrated with Reown AppKit & Viem on Robinhood Chain

import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { 
    getAccount, 
    watchAccount, 
    disconnect, 
    switchChain, 
    readContract, 
    writeContract, 
    simulateContract,
    waitForTransactionReceipt
} from '@wagmi/core';
import { formatUnits, parseUnits } from 'viem';

// Config variables injected by Vite env
const PROJECT_ID = import.meta.env.VITE_REOWN_PROJECT_ID || '1467417e2e8e9de7d8d21dfbc2ccf28e';
const RPC_URL = import.meta.env.VITE_ROBINHOOD_RPC_URL || 'https://rpc.mainnet.chain.robinhood.com';

const CLTR_TOKEN_ADDRESS = import.meta.env.VITE_CLTR_TOKEN || '0x0000000000000000000000000000000000000000';
const STAKING_ADDRESS = import.meta.env.VITE_STAKING || '0x0000000000000000000000000000000000000000';
const FOUNDER_VESTING_ADDRESS = import.meta.env.VITE_FOUNDER_VESTING || '0x0000000000000000000000000000000000000000';
const TEAM_VESTING_ADDRESS = import.meta.env.VITE_TEAM_VESTING || '0x0000000000000000000000000000000000000000';
const SETTLEMENT_ADDRESS = import.meta.env.VITE_SETTLEMENT || '0x0000000000000000000000000000000000000000';

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

// 1. Define custom Robinhood Chain
const robinhoodChain = {
    id: 4663,
    name: 'Robinhood Chain',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: [RPC_URL] },
    },
    blockExplorers: {
        default: { name: 'Robinhood Explorer', url: 'https://explorer.mainnet.chain.robinhood.com' },
    }
};

// 2. Initialize Wagmi adapter & Reown AppKit
const networks = [robinhoodChain];
const wagmiAdapter = new WagmiAdapter({
    projectId: PROJECT_ID,
    networks
});

const modal = createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId: PROJECT_ID,
    features: {
        email: false,
        socials: false,
        analytics: false
    },
    themeMode: 'light',
    themeVariables: {
        '--w3m-accent': '#5C1414',
        '--w3m-color-mix': '#5C1414',
        '--w3m-font-family': 'Sora, sans-serif',
        '--w3m-border-radius-master': '4px',
        '--w3m-watermark-display': 'none'
    },
    metadata: {
        name: 'CLTR Identity Terminal',
        description: 'Credibility Ambition Protocol',
        url: window.location.origin,
        icons: [window.location.origin + '/favicon.ico']
    }
});

// ABIs
const ERC20_ABI = [
    { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
    { name: 'allowance', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
    { name: 'approve', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }] }
];

const STAKING_ABI = [
    { name: 'stake', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'amount', type: 'uint256' }, { name: 'duration', type: 'uint256' }], outputs: [] },
    { name: 'unstake', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'index', type: 'uint256' }], outputs: [] },
    { name: 'getStakesOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{
        name: '', type: 'tuple[]', components: [
            { name: 'amount', type: 'uint256' },
            { name: 'startTime', type: 'uint256' },
            { name: 'endTime', type: 'uint256' },
            { name: 'yield', type: 'uint256' },
            { name: 'durationDays', type: 'uint256' },
            { name: 'apy', type: 'uint256' },
            { name: 'active', type: 'bool' }
        ]
    }] }
];

const VESTING_ABI = [
    { name: 'vestedAmount', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
    { name: 'released', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
    { name: 'release', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] }
];

export function renderToken() {
    return `
        <style>
            @keyframes panelReveal {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .cltr-page {
                background: #FAFAFA;
                min-height: 100vh;
                font-family: 'Sora', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #111111;
                padding-bottom: 120px;
            }

            .cltr-container {
                max-width: 1240px;
                margin: 0 auto;
                padding: 128px 32px 0;
            }

            /* --- TOP BRAND HEADER --- */
            .cltr-header-group {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #E5E5E5;
                padding-bottom: 24px;
                margin-bottom: 32px;
                animation: panelReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .cltr-header-left {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .cltr-logo-svg {
                width: 40px;
                height: 40px;
                color: #5C1414;
                fill: currentColor;
            }
            .cltr-title-text {
                font-size: 18px;
                font-weight: 800;
                letter-spacing: -0.5px;
                color: #111;
                margin: 0;
                text-transform: uppercase;
            }
            .cltr-title-desc {
                font-size: 10px;
                color: #666;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-top: 4px;
            }

            /* --- WEB3 WALLET BAR --- */
            w3m-modal, w3m-connect-button, w3m-account-button {
                --w3m-watermark-display: none !important;
            }
            .cltr-wallet-banner {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 18px 24px;
                margin-bottom: 32px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                animation: panelReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
                transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .cltr-wallet-banner.connected {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 24px;
            }
            .cltr-wallet-status {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .cltr-status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #D82224;
            }
            .cltr-status-indicator.connected {
                background: #10B981;
                animation: pulseIndicator 2.5s infinite;
            }
            @keyframes pulseIndicator {
                0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                50% { box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
            }
            .cltr-status-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .cltr-wallet-hash {
                color: #888;
                font-weight: 500;
                margin-left: 8px;
                font-size: 11px;
                background: #F5F5F5;
                padding: 2px 6px;
                border-radius: 2px;
            }
            .cltr-connect-btn {
                background: #111111;
                color: #FFFFFF;
                border: none;
                padding: 10px 18px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                cursor: pointer;
                border-radius: 3px;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .cltr-connect-btn:hover {
                background: #5C1414;
            }
            .cltr-connect-btn.connected {
                background: transparent;
                border: 1px solid #E5E5E5;
                color: #555;
            }
            .cltr-connect-btn.connected:hover {
                border-color: #D82224;
                color: #D82224;
                background: rgba(216, 34, 36, 0.02);
            }

            /* ===================================================
               DOMINANT FOCAL POINT
               =================================================== */
            .cltr-focal-hero {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 40px;
                margin-bottom: 32px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 40px;
                position: relative;
                animation: panelReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
            }
            .cltr-focal-hero::before {
                content: '';
                position: absolute;
                left: 0; top: 0; bottom: 0;
                width: 4px;
                background: #5C1414;
            }
            .cltr-focal-left {
                flex: 1;
            }
            .cltr-focal-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #5C1414;
                margin-bottom: 12px;
            }
            .cltr-focal-num {
                font-family: 'JetBrains Mono', monospace;
                font-size: 48px;
                font-weight: 800;
                letter-spacing: -2px;
                color: #111111;
                line-height: 1;
            }
            .cltr-focal-sub {
                font-size: 12px;
                color: #666;
                margin-top: 10px;
            }
            .cltr-focal-right {
                display: flex;
                gap: 48px;
            }
            .cltr-focal-mini-card {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .cltr-focal-mini-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
            }
            .cltr-focal-mini-num {
                font-family: 'JetBrains Mono', monospace;
                font-size: 20px;
                font-weight: 700;
                color: #111;
            }

            /* ===================================================
               METRICS & STATS GRID
               =================================================== */
            .cltr-metrics-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
                margin-bottom: 32px;
                animation: panelReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
            }
            .cltr-metric-card {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 24px;
                transition: border-color 0.2s;
            }
            .cltr-metric-card:hover {
                border-color: rgba(92, 20, 20, 0.2);
            }
            .cltr-metric-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                margin-bottom: 8px;
                display: block;
            }
            .cltr-metric-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 20px;
                font-weight: 700;
                color: #111;
                line-height: 1;
            }
            .cltr-metric-sub {
                font-size: 10px;
                color: #666;
                margin-top: 6px;
                display: block;
            }

            /* --- TWO COLUMN MAIN LAYOUT --- */
            .cltr-main-grid {
                display: grid;
                grid-template-columns: 1.3fr 1fr;
                gap: 32px;
                animation: panelReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
            }

            /* ===================================================
               PANEL & CARD SYSTEM
               =================================================== */
            .cltr-panel {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 32px;
                margin-bottom: 32px;
                position: relative;
            }
            .cltr-panel-hdr {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;
                border-bottom: 1px solid #F0F0F0;
                padding-bottom: 16px;
            }
            .cltr-panel-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #111111;
            }

            /* --- STAKING TERMINAL --- */
            .cltr-stake-wrap {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .cltr-field-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .cltr-field-lbl-row {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #888;
            }
            .cltr-max-trigger {
                cursor: pointer;
                color: #5C1414;
                text-decoration: underline;
            }
            .cltr-input-container {
                position: relative;
            }
            .cltr-input-field {
                width: 100%;
                padding: 16px;
                padding-right: 80px;
                border: 1px solid #E5E5E5;
                background: #FCFCFC;
                font-family: 'JetBrains Mono', monospace;
                font-size: 18px;
                font-weight: 700;
                outline: none;
                box-sizing: border-box;
                border-radius: 4px;
                transition: all 0.15s ease;
            }
            .cltr-input-field:focus:not(:disabled) {
                border-color: #5C1414;
                background: #FFFFFF;
                box-shadow: 0 0 0 3px rgba(92, 20, 20, 0.04);
            }
            .cltr-input-token {
                position: absolute;
                right: 18px;
                top: 50%;
                transform: translateY(-50%);
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                color: #888;
            }

            /* Lock Pills Grid */
            .cltr-lock-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
            }
            .cltr-lock-pill {
                border: 1px solid #E5E5E5;
                background: #FFFFFF;
                padding: 14px 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                border-radius: 4px;
                outline: none;
            }
            .cltr-lock-pill:hover:not(:disabled) {
                border-color: #5C1414;
            }
            .cltr-lock-pill.active {
                background: #111111;
                border-color: #111111;
                color: #FFFFFF;
            }
            .cltr-lock-days {
                font-size: 13px;
                font-weight: 700;
                display: block;
                margin-bottom: 2px;
            }
            .cltr-lock-yield {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                opacity: 0.85;
            }

            /* Staking summary */
            .cltr-calc-summary {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 18px 20px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .cltr-calc-row {
                display: flex;
                justify-content: space-between;
                color: #666;
            }
            .cltr-calc-row strong {
                color: #111;
            }
            .cltr-calc-row.accent strong {
                color: #5C1414;
                font-size: 12px;
            }

            /* Action Button */
            .cltr-action-submit {
                width: 100%;
                padding: 16px;
                background: #5C1414;
                color: #FFFFFF;
                border: none;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.2s ease;
                border-radius: 4px;
            }
            .cltr-action-submit:hover:not(:disabled) {
                background: #4A1010;
            }
            .cltr-action-submit:disabled {
                background: #E5E5E5;
                color: #999;
                cursor: not-allowed;
            }

            /* ===================================================
               BURN VISUALIZATION
               =================================================== */
            .cltr-burn-visualizer {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-top: 8px;
            }
            .cltr-chart-container {
                height: 100px;
                border-bottom: 1px solid #E5E5E5;
                position: relative;
                display: flex;
                align-items: flex-end;
            }
            .cltr-chart-svg {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0; left: 0;
            }
            .cltr-chart-grid {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: absolute;
                pointer-events: none;
            }
            .cltr-chart-grid-line {
                width: 100%;
                height: 1px;
                background: #F0F0F0;
            }
            .cltr-burn-period-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
            }
            .cltr-burn-period-card {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 12px 14px;
            }
            .cltr-burn-period-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                color: #888;
                text-transform: uppercase;
                display: block;
                margin-bottom: 4px;
            }
            .cltr-burn-period-num {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                font-weight: 700;
                color: #111;
            }

            /* ===================================================
               IDENTITY / REPUTATION LAYER
               =================================================== */
            .cltr-rep-layout {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                margin-bottom: 20px;
            }
            .cltr-rep-stat {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 14px 16px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .cltr-rep-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 700;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .cltr-rep-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 16px;
                font-weight: 700;
                color: #111;
            }
            .cltr-rep-score-box {
                background: #111111;
                color: #FFFFFF;
                border-radius: 4px;
                padding: 20px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .cltr-rep-score-left {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .cltr-rep-score-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .cltr-rep-score-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 28px;
                font-weight: 800;
                color: #FFFFFF;
                line-height: 1;
            }
            .cltr-badge-glow {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                padding: 4px 10px;
                background: #5C1414;
                color: #FFFFFF;
                border-radius: 2px;
                text-transform: uppercase;
            }

            /* --- TRUST & VESTING CARDS --- */
            .cltr-trust-card {
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 20px;
                margin-bottom: 16px;
                background: #FFFFFF;
            }
            .cltr-trust-card-hdr {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 12px;
            }
            .cltr-trust-name {
                font-size: 13px;
                font-weight: 700;
                color: #111;
            }
            .cltr-trust-alloc {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                color: #5C1414;
                font-weight: 700;
            }
            .cltr-trust-progress-bg {
                height: 4px;
                background: #F0F0F0;
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            .cltr-trust-progress-fill {
                height: 100%;
                background: #5C1414;
                width: 0%;
                transition: width 0.3s ease;
            }
            .cltr-trust-meta {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #888;
                margin-bottom: 16px;
            }
            .cltr-trust-claim-box {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                padding: 12px 16px;
                border-radius: 4px;
            }
            .cltr-trust-claim-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #888;
                text-transform: uppercase;
                display: block;
            }
            .cltr-trust-claim-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 13px;
                font-weight: 700;
                color: #5C1414;
            }
            .cltr-trust-claim-btn {
                background: #111111;
                color: #FFFFFF;
                border: none;
                padding: 8px 14px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                cursor: pointer;
                border-radius: 2px;
                transition: all 0.15s ease;
            }
            .cltr-trust-claim-btn:hover:not(:disabled) {
                background: #5C1414;
            }
            .cltr-trust-claim-btn:disabled {
                background: #E5E5E5;
                color: #999;
                cursor: not-allowed;
            }
            .cltr-contract-addr-row {
                margin-top: 12px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                color: #888;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .cltr-contract-addr-row span.addr {
                color: #555;
                cursor: pointer;
                text-decoration: underline;
            }

            /* ===================================================
               LIVE ACTIVITY FEED
               =================================================== */
            .cltr-feed-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .cltr-feed-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                font-size: 12px;
                color: #333;
                line-height: 1.4;
                border-bottom: 1px solid #F5F5F5;
                padding-bottom: 10px;
            }
            .cltr-feed-item:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            .cltr-feed-icon {
                font-size: 12px;
                flex-shrink: 0;
            }
            .cltr-feed-details {
                flex: 1;
            }
            .cltr-feed-text {
                font-weight: 500;
            }
            .cltr-feed-time {
                display: block;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                color: #888;
                margin-top: 2px;
            }
            .cltr-feed-txlink {
                color: #5C1414;
                text-decoration: underline;
                margin-left: 6px;
            }

            /* --- PROTOCOL HEALTH TABLE --- */
            .cltr-health-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            .cltr-health-stat {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 14px 16px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            /* --- TABLE SYSTEM --- */
            .cltr-table-container {
                overflow-x: auto;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
            }
            .cltr-data-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                text-align: left;
            }
            .cltr-data-table th {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                padding: 14px 16px;
                border-bottom: 1px solid #E5E5E5;
                background: #FCFCFC;
            }
            .cltr-data-table td {
                padding: 14px 16px;
                border-bottom: 1px solid #F0F0F0;
                font-family: 'JetBrains Mono', monospace;
            }
            .cltr-data-table tr:last-child td {
                border-bottom: none;
            }
            .cltr-progress-bar-mini {
                width: 80px;
                height: 4px;
                background: #EEE;
                border-radius: 2px;
                overflow: hidden;
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
            }
            .cltr-progress-bar-mini-fill {
                height: 100%;
                background: #5C1414;
                width: 0%;
            }

            .cltr-unstake-btn {
                background: #111111;
                color: #FFFFFF;
                border: none;
                padding: 4px 10px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                cursor: pointer;
                border-radius: 2px;
            }
            .cltr-unstake-btn:disabled {
                background: #E5E5E5;
                color: #999;
                cursor: not-allowed;
            }

            /* --- MODALS --- */
            .cltr-modal-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(4px);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .cltr-modal-backdrop.open {
                display: flex;
            }
            .cltr-modal-box {
                background: #FFFFFF;
                border-radius: 4px;
                border: 1px solid #E5E5E5;
                padding: 32px;
                width: 100%;
                max-width: 360px;
                text-align: center;
                box-shadow: 0 16px 48px rgba(0,0,0,0.1);
            }
            .cltr-tx-spinner {
                width: 32px;
                height: 32px;
                border: 3px solid #F0F0F0;
                border-top-color: #5C1414;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin: 0 auto 16px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            @media (max-width: 1024px) {
                .cltr-main-grid { grid-template-columns: 1fr; }
                .cltr-metrics-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 640px) {
                .cltr-metrics-grid { grid-template-columns: 1fr; }
                .cltr-focal-hero { flex-direction: column; align-items: flex-start; padding: 24px; }
                .cltr-focal-right { flex-direction: column; gap: 16px; width: 100%; }
                .cltr-lock-grid { grid-template-columns: repeat(2, 1fr); }
                .cltr-rep-layout { grid-template-columns: 1fr; }
                .cltr-health-grid { grid-template-columns: 1fr; }
            }
        </style>

        <div class="cltr-page">
            <div class="cltr-container">

                <!-- Header block -->
                <div class="cltr-header-group">
                    <div class="cltr-header-left">
                        <svg class="cltr-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 44.690,43.190 L 48.940,38.940 L 39.243,29.243 Q 35.000,25.000 30.757,29.243 L 14.243,45.757 Q 10.000,50.000 14.243,54.243 L 30.757,70.757 Q 35.000,75.000 39.243,70.757 L 55.757,54.243 Q 60.000,50.000 55.757,45.757 L 55.310,45.310 L 51.060,49.560 L 51.500,50.000 Q 53.621,52.121 51.500,54.243 L 39.243,66.500 Q 37.121,68.621 35.000,66.500 L 22.743,54.243 Q 20.621,52.121 22.743,50.000 L 35.000,37.743 Q 37.121,35.621 39.243,37.743 Z" />
                            <path d="M 55.310,56.810 L 51.060,61.060 L 60.757,70.757 Q 65.000,75.000 69.243,70.757 L 85.757,54.243 Q 90.000,50.000 85.757,45.757 L 69.243,29.243 Q 65.000,25.000 60.757,29.243 L 44.243,45.757 Q 40.000,50.000 44.243,54.243 L 44.690,54.690 L 48.940,50.440 L 48.500,50.000 Q 46.379,47.879 48.500,45.757 L 60.757,33.500 Q 62.879,31.379 65.000,33.500 L 77.257,45.757 Q 79.379,47.879 77.257,50.000 L 65.000,62.257 Q 62.879,64.379 60.757,62.257 Z" />
                        </svg>
                        <div class="cltr-hdr-title-group">
                            <h1 class="cltr-title-text">CLTR CUSTODY TERMINAL</h1>
                            <p class="cltr-title-desc">REPUTATION &amp; EXECUTION ESCROW PORTAL</p>
                        </div>
                    </div>
                </div>

                <!-- Web3 Connect Banner -->
                <div class="cltr-wallet-banner" id="wallet-banner-container">
                    <div class="cltr-wallet-status">
                        <div class="cltr-status-indicator" id="w-dot"></div>
                        <div class="cltr-wallet-text">
                            <span id="w-status">DISCONNECTED</span>
                            <span class="cltr-wallet-hash" id="w-addr">—</span>
                        </div>
                    </div>
                    <button class="cltr-connect-btn" id="w-connect-btn">CONNECT IDENTITY</button>
                </div>

                <!-- DOMINANT FOCAL POINT -->
                <div class="cltr-focal-hero">
                    <div class="cltr-focal-left">
                        <div class="cltr-focal-lbl">TOTAL CAPITAL COMMITTED</div>
                        <div class="cltr-focal-num" id="focal-total-committed">—</div>
                        <p class="cltr-focal-sub">Aggregated collateral locked in active verification contracts across the protocol.</p>
                    </div>
                    <div class="cltr-focal-right">
                        <div class="cltr-focal-mini-card">
                            <span class="cltr-focal-mini-lbl">PROOFS CONVERTED TO BURN</span>
                            <span class="cltr-focal-mini-num" id="focal-total-burned">—</span>
                        </div>
                        <div class="cltr-focal-mini-card">
                            <span class="cltr-focal-mini-lbl">GLOBAL SUCCESS RATE</span>
                            <span class="cltr-focal-mini-num" id="focal-success-rate">94.8%</span>
                        </div>
                    </div>
                </div>

                <!-- METRICS GRID -->
                <div class="cltr-metrics-grid">
                    <div class="cltr-metric-card">
                        <span class="cltr-metric-lbl">Conviction Balance</span>
                        <div class="cltr-metric-val" id="metric-conviction-bal">—</div>
                        <span class="cltr-metric-sub">CLTR unlocked in wallet</span>
                    </div>
                    <div class="cltr-metric-card">
                        <span class="cltr-metric-lbl">Committed Collateral</span>
                        <div class="cltr-metric-val" id="metric-committed-collateral">—</div>
                        <span class="cltr-metric-sub">CLTR locked in staking</span>
                    </div>
                    <div class="cltr-metric-card">
                        <span class="cltr-metric-lbl">Interest Earned</span>
                        <div class="cltr-metric-val" id="metric-yield-earned">—</div>
                        <span class="cltr-metric-sub">Accrued rewards</span>
                    </div>
                    <div class="cltr-metric-card">
                        <span class="cltr-metric-lbl">Protocol Supply</span>
                        <div class="cltr-metric-val" id="metric-protocol-supply">—</div>
                        <span class="cltr-metric-sub">Fixed cap: 1,000,000,000</span>
                    </div>
                </div>

                <!-- Main Layout -->
                <div class="cltr-main-grid">

                    <!-- Left Column -->
                    <div>
                        <!-- Commitment Staking Panel -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">COMMITMENT STAKING</span>
                                <span style="font-family:'JetBrains Mono', monospace; font-size:10px; font-weight:700; color:#10B981;">MAX YIELD: 25%</span>
                            </div>

                            <div class="cltr-stake-wrap">
                                <div class="cltr-field-group">
                                    <div class="cltr-field-lbl-row">
                                        <span>Stake Amount</span>
                                        <span class="cltr-max-trigger" id="stake-max-btn">MAX</span>
                                    </div>
                                    <div class="cltr-input-container">
                                        <input type="number" class="cltr-input-field" id="stake-input" min="1" placeholder="0.00" disabled>
                                        <span class="cltr-input-token">CLTR</span>
                                    </div>
                                </div>

                                <div class="cltr-field-group">
                                    <label class="cltr-field-lbl-row">Commitment Lockup Period</label>
                                    <div class="cltr-lock-grid">
                                        <button class="cltr-lock-pill active" data-days="30" data-apy="5" disabled>
                                            <span class="cltr-lock-days">30 Days</span>
                                            <span class="cltr-lock-yield">5% Yield</span>
                                        </button>
                                        <button class="cltr-lock-pill" data-days="90" data-apy="10" disabled>
                                            <span class="cltr-lock-days">90 Days</span>
                                            <span class="cltr-lock-yield">10% Yield</span>
                                        </button>
                                        <button class="cltr-lock-pill" data-days="180" data-apy="15" disabled>
                                            <span class="cltr-lock-days">180 Days</span>
                                            <span class="cltr-lock-yield">15% Yield</span>
                                        </button>
                                        <button class="cltr-lock-pill" data-days="365" data-apy="25" disabled>
                                            <span class="cltr-lock-days">365 Days</span>
                                            <span class="cltr-lock-yield">25% Yield</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="cltr-calc-summary">
                                    <div class="cltr-calc-row">
                                        <span>Commitment Yield</span>
                                        <span id="calc-apy">5.0%</span>
                                    </div>
                                    <div class="cltr-calc-row">
                                        <span>Interest Accrual</span>
                                        <span id="calc-yield">0.00 CLTR</span>
                                    </div>
                                    <div class="cltr-calc-row accent">
                                        <span>Total Release Balance</span>
                                        <strong id="calc-total">0.00 CLTR</strong>
                                    </div>
                                </div>

                                <button class="cltr-action-submit" id="stake-btn" disabled>STAKE CLTR</button>
                            </div>
                        </div>

                        <!-- Active Stakes Panel -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">ACTIVE COMMITMENT POSITIONS</span>
                                <span style="font-family:'JetBrains Mono', monospace; font-size:10px; color:#888;" id="stakes-count">0 Positions</span>
                            </div>

                            <div class="cltr-table-container">
                                <table class="cltr-data-table">
                                    <thead>
                                        <tr>
                                            <th>Staked Amount</th>
                                            <th>Lock Period</th>
                                            <th>Maturity</th>
                                            <th>Accrued Yield</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="stakes-tbody">
                                        <tr>
                                            <td colspan="6" style="text-align:center; color:#999; padding: 24px;">Connect wallet to view active positions.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- BURN VISUALIZATION -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">DEFLATIONARY HISTORY &amp; SUPPLY SHRINKS</span>
                            </div>
                            <div class="cltr-burn-visualizer">
                                <div class="cltr-chart-container">
                                    <div class="cltr-chart-grid">
                                        <div class="cltr-chart-grid-line"></div>
                                        <div class="cltr-chart-grid-line"></div>
                                        <div class="cltr-chart-grid-line"></div>
                                    </div>
                                    <svg class="cltr-chart-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
                                        <path d="M 0,2 L 15,3 L 30,5 L 45,9 L 60,14 L 75,18 L 90,23 L 100,26" fill="none" stroke="#5C1414" stroke-width="2"/>
                                    </svg>
                                </div>
                                <div class="cltr-burn-period-grid">
                                    <div class="cltr-burn-period-card">
                                        <span class="cltr-burn-period-lbl">Today</span>
                                        <span class="cltr-burn-period-num" id="burn-today">🔥 —</span>
                                    </div>
                                    <div class="cltr-burn-period-card">
                                        <span class="cltr-burn-period-lbl">This Week</span>
                                        <span class="cltr-burn-period-num" id="burn-week">🔥 —</span>
                                    </div>
                                    <div class="cltr-burn-period-card">
                                        <span class="cltr-burn-period-lbl">Burn Rate</span>
                                        <span class="cltr-burn-period-num">1.25%</span>
                                    </div>
                                    <div class="cltr-burn-period-card">
                                        <span class="cltr-burn-period-lbl">Proof Burn</span>
                                        <span class="cltr-burn-period-num" id="burn-total" style="color:#5C1414;">—</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div>
                        <!-- Reputation Identity Card -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">CREDIBILITY IDENTITY LAYER</span>
                            </div>

                            <div class="cltr-rep-score-box">
                                <div class="cltr-rep-score-left">
                                    <span class="cltr-rep-score-lbl">CONVICTION SCORE</span>
                                    <span class="cltr-rep-score-val" id="rep-score">—</span>
                                </div>
                                <span class="cltr-badge-glow" id="rep-rank">CONNECT WALLET</span>
                            </div>

                            <div class="cltr-rep-layout">
                                <div class="cltr-rep-stat">
                                    <span class="cltr-rep-lbl">SUCCESS RATE</span>
                                    <span class="cltr-rep-val" id="rep-success-rate">—</span>
                                </div>
                                <div class="cltr-rep-stat">
                                    <span class="cltr-rep-lbl">CONTRACTS</span>
                                    <span class="cltr-rep-val" id="rep-contracts-completed">—</span>
                                </div>
                                <div class="cltr-rep-stat">
                                    <span class="cltr-rep-lbl">RANK</span>
                                    <span class="cltr-rep-val" id="rep-rank-num">—</span>
                                </div>
                            </div>
                        </div>

                        <!-- Founder Vesting alignment -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">FOUNDER ALIGNMENT &amp; VESTING TRUST</span>
                            </div>

                            <!-- Founder Trust Vesting Details -->
                            <div class="cltr-trust-card">
                                <div class="cltr-trust-card-hdr">
                                    <span class="cltr-trust-name">Founder Escrow Wallet</span>
                                    <span class="cltr-trust-alloc">50,000,000 CLTR</span>
                                </div>
                                <div class="cltr-trust-progress-bg">
                                    <div class="cltr-trust-progress-fill" id="founder-vest-progress"></div>
                                </div>
                                <div class="cltr-trust-meta">
                                    <span>Vested: <strong id="founder-vested-label">—</strong></span>
                                    <span id="founder-time-remaining">—</span>
                                </div>
                                <div class="cltr-trust-claim-box">
                                    <div>
                                        <span class="cltr-trust-claim-lbl">Claimable Vested</span>
                                        <span class="cltr-trust-claim-val" id="founder-claimable-label">—</span>
                                    </div>
                                    <button class="cltr-trust-claim-btn" id="founder-claim-btn" disabled>RELEASE TOKENS</button>
                                </div>
                                <div class="cltr-contract-addr-row">
                                    <span>Vesting Contract Address</span>
                                    <span class="addr" id="founder-addr-copy">0x8f3Cf...3a4D</span>
                                </div>
                            </div>

                            <!-- Team Trust Vesting Details -->
                            <div class="cltr-trust-card">
                                <div class="cltr-trust-card-hdr">
                                    <span class="cltr-trust-name">Team Allocation Vesting</span>
                                    <span class="cltr-trust-alloc">150,000,000 CLTR</span>
                                </div>
                                <div class="cltr-trust-progress-bg">
                                    <div class="cltr-trust-progress-fill" id="team-vest-progress"></div>
                                </div>
                                <div class="cltr-trust-meta">
                                    <span>Vested: <strong id="team-vested-label">—</strong></span>
                                    <span id="team-time-remaining">—</span>
                                </div>
                                <div class="cltr-trust-claim-box">
                                    <div>
                                        <span class="cltr-trust-claim-lbl">Claimable Vested</span>
                                        <span class="cltr-trust-claim-val" id="team-claimable-label">—</span>
                                    </div>
                                    <button class="cltr-trust-claim-btn" id="team-claim-btn" disabled>RELEASE TOKENS</button>
                                </div>
                                <div class="cltr-contract-addr-row">
                                    <span>Vesting Contract Address</span>
                                    <span class="addr" id="team-addr-copy">0x2e9bA...1f9E</span>
                                </div>
                            </div>
                        </div>

                        <!-- Live Activity Feed -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">LIVE PROTOCOL ACTIVITY</span>
                            </div>
                            <div class="cltr-feed-list" id="activity-feed">
                                <div style="text-align:center; color:#999; font-size:11px; padding:12px; font-family:'JetBrains Mono', monospace;">Connecting live node feed...</div>
                            </div>
                        </div>

                        <!-- Protocol Health -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">PROTOCOL HEALTH SUMMARY</span>
                            </div>
                            <div class="cltr-health-grid">
                                <div class="cltr-health-stat">
                                    <span class="cltr-rep-lbl">Active Contracts</span>
                                    <span class="cltr-rep-val" id="health-active-contracts">—</span>
                                </div>
                                <div class="cltr-health-stat">
                                    <span class="cltr-rep-lbl">Escrow Locked</span>
                                    <span class="cltr-rep-val" id="health-escrow-locked">—</span>
                                </div>
                                <div class="cltr-health-stat">
                                    <span class="cltr-rep-lbl">Burned Today</span>
                                    <span class="cltr-rep-val" id="health-burned-today">—</span>
                                </div>
                                <div class="cltr-health-stat">
                                    <span class="cltr-rep-lbl">Circulating Supply</span>
                                    <span class="cltr-rep-val" id="health-circulating">—</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- ===== TX MODAL ===== -->
        <div id="tx-modal" class="cltr-modal-backdrop">
            <div class="cltr-modal-box" style="text-align: left; max-width: 400px; padding: 40px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
                    <h3 class="cltr-panel-title" style="margin:0; font-size:11px; font-family:'JetBrains Mono', monospace; letter-spacing: 0.5px;">TRANSACTION PIPELINE</h3>
                    <div class="cltr-tx-spinner" style="width:16px; height:16px; margin:0; border-width:2px;"></div>
                </div>
                
                <div class="cltr-stepper" style="display:flex; flex-direction:column; gap:16px; font-family:'JetBrains Mono', monospace; font-size:11px;">
                    <div class="cltr-step" id="step-approve" style="display:flex; align-items:center; gap:12px; color:#888;">
                        <span class="step-indicator">[ ]</span>
                        <span>Approving CLTR Allowance</span>
                    </div>
                    <div class="cltr-step" id="step-sign" style="display:flex; align-items:center; gap:12px; color:#888;">
                        <span class="step-indicator">[ ]</span>
                        <span>Waiting for Wallet Signature</span>
                    </div>
                    <div class="cltr-step" id="step-submit" style="display:flex; align-items:center; gap:12px; color:#888;">
                        <span class="step-indicator">[ ]</span>
                        <span>Submitting to Network</span>
                    </div>
                    <div class="cltr-step" id="step-confirm" style="display:flex; align-items:center; gap:12px; color:#888;">
                        <span class="step-indicator">[ ]</span>
                        <span>Awaiting Block Confirmation</span>
                    </div>
                    <div class="cltr-step" id="step-done" style="display:flex; align-items:center; gap:12px; color:#888;">
                        <span class="step-indicator">[ ]</span>
                        <span id="step-done-text">Commitment Completed</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initToken() {
    const bannerContainer = document.getElementById('wallet-banner-container');

    function renderDisconnectedBanner() {
        if (!bannerContainer) return;
        bannerContainer.className = 'cltr-wallet-banner';
        bannerContainer.style.display = 'flex';
        bannerContainer.style.gridTemplateColumns = 'none';
        bannerContainer.style.background = '#FFFFFF';
        bannerContainer.style.border = '1px solid #E5E5E5';
        bannerContainer.style.borderRadius = '4px';
        bannerContainer.style.padding = '18px 24px';
        bannerContainer.style.marginBottom = '32px';
        bannerContainer.style.alignItems = 'center';
        bannerContainer.style.justifyContent = 'space-between';
        bannerContainer.style.gap = '20px';

        bannerContainer.innerHTML = `
            <div class="cltr-wallet-status">
                <div class="cltr-status-indicator" id="w-dot" style="background:#D82224;"></div>
                <div class="cltr-wallet-text">
                    <span id="w-status" style="font-family:'JetBrains Mono', monospace; font-size:10px; font-weight:700; color:#111; letter-spacing:0.5px; text-transform:uppercase;">DISCONNECTED</span>
                    <span class="cltr-wallet-hash" id="w-addr">—</span>
                </div>
            </div>
            <button class="cltr-connect-btn" id="w-connect-btn">CONNECT IDENTITY</button>
        `;
    }

    function renderConnectedBanner(address, formattedBalance) {
        if (!bannerContainer) return;
        bannerContainer.className = 'cltr-wallet-banner connected';
        bannerContainer.style.display = 'grid';
        bannerContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        bannerContainer.style.background = '#FFFFFF';
        bannerContainer.style.border = '1px solid #E5E5E5';
        bannerContainer.style.borderRadius = '4px';
        bannerContainer.style.padding = '18px 24px';
        bannerContainer.style.marginBottom = '32px';
        bannerContainer.style.alignItems = 'center';
        bannerContainer.style.gap = '24px';

        const shortAddr = address.slice(0, 6) + '...' + address.slice(-4);

        bannerContainer.innerHTML = `
            <div class="cltr-wallet-status" style="border-right: 1px solid #E5E5E5; padding-right:24px;">
                <div class="cltr-status-indicator connected" style="background:#10B981; animation: pulseIndicator 2.5s infinite;"></div>
                <div class="cltr-wallet-text">
                    <span style="font-family:'JetBrains Mono', monospace; font-size:10px; font-weight:700; color:#10B981; letter-spacing:0.5px; display:block;">CONNECTED</span>
                    <span class="cltr-wallet-hash" style="display:block; font-size:11px; margin-top:2px; margin-left:0; background:none; padding:0; color:#555;" id="w-addr">${shortAddr}</span>
                </div>
            </div>
            <div style="border-right: 1px solid #E5E5E5; padding-right:24px;">
                <span style="font-family:'JetBrains Mono', monospace; font-size:8px; color:#888; text-transform:uppercase; display:block; letter-spacing:0.5px;">Conviction Balance</span>
                <span style="font-family:'JetBrains Mono', monospace; font-size:13px; font-weight:700; color:#111; display:block; margin-top:2px;" id="banner-balance">${formattedBalance} CLTR</span>
            </div>
            <div style="border-right: 1px solid #E5E5E5; padding-right:24px;">
                <span style="font-family:'JetBrains Mono', monospace; font-size:8px; color:#888; text-transform:uppercase; display:block; letter-spacing:0.5px;">Network</span>
                <span style="font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:700; color:#5C1414; display:block; margin-top:2px;">Robinhood Mainnet</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-family:'JetBrains Mono', monospace; font-size:8px; color:#888; text-transform:uppercase; display:block; letter-spacing:0.5px;">Identity status</span>
                    <span style="font-family:'JetBrains Mono', monospace; font-size:11px; font-weight:700; color:#10B981; display:block; margin-top:2px;">Verified Identity</span>
                </div>
                <button class="cltr-connect-btn connected" id="w-disconnect-btn" style="padding: 6px 12px; font-size: 8px;">DISCONNECT</button>
            </div>
        `;
    }

    function updateTxStep(stepId, status) {
        const el = document.getElementById(stepId);
        if (!el) return;
        const indicator = el.querySelector('.step-indicator');
        if (status === 'pending') {
            el.style.color = '#5C1414';
            el.style.fontWeight = '700';
            if (indicator) indicator.innerText = '[/]';
        } else if (status === 'success') {
            el.style.color = '#10B981';
            el.style.fontWeight = '700';
            if (indicator) indicator.innerText = '[x]';
        } else {
            el.style.color = '#888';
            el.style.fontWeight = 'normal';
            if (indicator) indicator.innerText = '[ ]';
        }
    }

    function resetTxSteps(hasApprove = false, completionText = "Commitment Completed") {
        const stepApproveEl = document.getElementById('step-approve');
        if (stepApproveEl) {
            stepApproveEl.style.display = hasApprove ? 'flex' : 'none';
        }
        const stepDoneTextEl = document.getElementById('step-done-text');
        if (stepDoneTextEl) {
            stepDoneTextEl.innerText = completionText;
        }

        updateTxStep('step-approve', 'inactive');
        updateTxStep('step-sign', 'inactive');
        updateTxStep('step-submit', 'inactive');
        updateTxStep('step-confirm', 'inactive');
        updateTxStep('step-done', 'inactive');
    }

    const focalTotalCommitted = document.getElementById('focal-total-committed');
    const focalTotalBurned = document.getElementById('focal-total-burned');

    const metricConvictionBal = document.getElementById('metric-conviction-bal');
    const metricCommittedCollateral = document.getElementById('metric-committed-collateral');
    const metricYieldEarned = document.getElementById('metric-yield-earned');
    const metricProtocolSupply = document.getElementById('metric-protocol-supply');

    const stakeInput = document.getElementById('stake-input');
    const maxBtn = document.getElementById('stake-max-btn');
    const stakeBtn = document.getElementById('stake-btn');
    const lockPills = document.querySelectorAll('.cltr-lock-pill');
    const calcApy = document.getElementById('calc-apy');
    const calcYield = document.getElementById('calc-yield');
    const calcTotal = document.getElementById('calc-total');

    const stakesCount = document.getElementById('stakes-count');
    const stakesTbody = document.getElementById('stakes-tbody');

    const txModal = document.getElementById('tx-modal');
    const txTitle = document.getElementById('tx-title');
    const txSub = document.getElementById('tx-sub');

    // Reputation
    const repScore = document.getElementById('rep-score');
    const repRank = document.getElementById('rep-rank');
    const repSuccessRate = document.getElementById('rep-success-rate');
    const repContractsCompleted = document.getElementById('rep-contracts-completed');
    const repRankNum = document.getElementById('rep-rank-num');

    // Vesting elements
    const founderProgress = document.getElementById('founder-vest-progress');
    const founderVestedLabel = document.getElementById('founder-vested-label');
    const founderTimeRemaining = document.getElementById('founder-time-remaining');
    const founderClaimableLabel = document.getElementById('founder-claimable-label');
    const founderClaimBtn = document.getElementById('founder-claim-btn');

    const teamProgress = document.getElementById('team-vest-progress');
    const teamVestedLabel = document.getElementById('team-vested-label');
    const teamTimeRemaining = document.getElementById('team-time-remaining');
    const teamClaimableLabel = document.getElementById('team-claimable-label');
    const teamClaimBtn = document.getElementById('team-claim-btn');

    // Health elements
    const healthActiveContracts = document.getElementById('health-active-contracts');
    const healthEscrowLocked = document.getElementById('health-escrow-locked');
    const healthBurnedToday = document.getElementById('health-burned-today');
    const healthCirculating = document.getElementById('health-circulating');

    const burnToday = document.getElementById('burn-today');
    const burnWeek = document.getElementById('burn-week');
    const burnTotal = document.getElementById('burn-total');

    const activityFeed = document.getElementById('activity-feed');

    // Copy Address Click events
    const founderAddrCopy = document.getElementById('founder-addr-copy');
    if (founderAddrCopy) {
        founderAddrCopy.innerText = FOUNDER_VESTING_ADDRESS.slice(0, 6) + '...' + FOUNDER_VESTING_ADDRESS.slice(-4);
        founderAddrCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(FOUNDER_VESTING_ADDRESS);
            alert('Founder Vesting address copied!');
        });
    }
    const teamAddrCopy = document.getElementById('team-addr-copy');
    if (teamAddrCopy) {
        teamAddrCopy.innerText = TEAM_VESTING_ADDRESS.slice(0, 6) + '...' + TEAM_VESTING_ADDRESS.slice(-4);
        teamAddrCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(TEAM_VESTING_ADDRESS);
            alert('Team Vesting address copied!');
        });
    }

    // Local state variables
    let userAddress;
    let balance = 0n;
    let stakedBalance = 0n;
    let activeAPY = 5;
    let activeDuration = 30;
    let activeStakesList = [];

    // Vesting stats variables
    const vestingStart = 1717171200; // June 1, 2024
    const vestingDuration = 4 * 365 * 24 * 60 * 60; // 4 Years
    const vestingCliff = 365 * 24 * 60 * 60; // 1 Year

    function getAPY(days) {
        if (days === 30) return 5;
        if (days === 90) return 10;
        if (days === 180) return 15;
        if (days === 365) return 25;
        return 5;
    }

    function formatNumber(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // 1. Fetch live protocol stats (Loads even without wallet)
    async function loadPublicStats() {
        try {
            const res = await fetch(`${API_BASE_URL}/v1/token/stats`);
            const data = await res.json();
            if (data.ok) {
                const s = data.stats;
                focalTotalCommitted.innerText = formatNumber(s.capitalCommitted) + ' CLTR';
                focalTotalBurned.innerText = formatNumber(s.totalBurned) + ' CLTR';
                metricProtocolSupply.innerText = formatNumber(s.circulatingSupply);

                // Health card aggregates
                healthActiveContracts.innerText = s.activeContracts.toString();
                healthEscrowLocked.innerText = formatNumber(s.capitalCommitted) + ' CLTR';
                healthBurnedToday.innerText = '🔥 14,210 CLTR'; // Daily Burn constant target
                healthCirculating.innerText = formatNumber(s.circulatingSupply) + ' CLTR';

                // Burn period grid
                burnToday.innerText = '🔥 14,210';
                burnWeek.innerText = '🔥 98,420';
                burnTotal.innerText = formatNumber(s.totalBurned);
            }
        } catch (err) {
            console.error('Failed loading live public stats:', err);
        }
    }

    // 2. Fetch live blockchain indexed activity
    async function loadLiveActivity() {
        try {
            const res = await fetch(`${API_BASE_URL}/v1/token/activity`);
            const data = await res.json();
            if (data.ok && data.events.length > 0) {
                activityFeed.innerHTML = data.events.map(ev => {
                    let text = '';
                    if (ev.eventType === 'BURN') text = `Burned ${formatNumber(parseFloat(ev.amount))} CLTR from protocol execution fees.`;
                    if (ev.eventType === 'STAKE') text = `Committed ${formatNumber(parseFloat(ev.amount))} CLTR lockup.`;
                    if (ev.eventType === 'UNSTAKE') text = `Unstaked ${formatNumber(parseFloat(ev.amount))} CLTR commitment.`;
                    if (ev.eventType === 'VESTING_RELEASE') text = `Released ${formatNumber(parseFloat(ev.amount))} CLTR vested tokens.`;
                    if (ev.eventType === 'SETTLEMENT') text = `Settled self-betting contract escrow payout.`;

                    const dateStr = new Date(ev.blockTimestamp).toLocaleTimeString('en-US', { hour12: false });
                    const expLink = `https://explorer.mainnet.chain.robinhood.com/tx/${ev.txHash}`;

                    return `
                        <div class="cltr-feed-item">
                            <span class="cltr-feed-icon">${ev.eventType === 'BURN' ? '🔥' : '✓'}</span>
                            <div class="cltr-feed-details">
                                <span class="cltr-feed-text">${text}</span>
                                <span class="cltr-feed-time">${dateStr} UTC <a href="${expLink}" target="_blank" class="cltr-feed-txlink">View</a></span>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                activityFeed.innerHTML = '<div style="text-align:center; color:#999; font-size:11px; padding:12px;">No recent block transactions found.</div>';
            }
        } catch (err) {
            console.error('Failed loading live activity log:', err);
        }
    }

    // 3. Update Staking Calculator
    function updateStakingCalc() {
        const val = parseFloat(stakeInput.value) || 0;
        const interest = val * (activeAPY / 100) * (activeDuration / 365);
        calcApy.innerText = `${activeAPY.toFixed(1)}%`;
        calcYield.innerText = `${formatNumber(interest)} CLTR`;
        calcTotal.innerText = `${formatNumber(val + interest)} CLTR`;

        if (userAddress && val > 0 && parseUnits(stakeInput.value, 18) <= balance) {
            stakeBtn.removeAttribute('disabled');
        } else {
            stakeBtn.setAttribute('disabled', 'true');
        }
    }

    // 4. Load Active Stake Positions
    async function loadStakingPositions() {
        if (!userAddress || STAKING_ADDRESS === '0x0000000000000000000000000000000000000000') {
            stakesTbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:#999; padding: 24px;">Connect wallet to view active positions.</td>
                </tr>
            `;
            stakesCount.innerText = '0 Positions';
            return;
        }

        try {
            const rawStakes = await readContract(wagmiAdapter.wagmiConfig, {
                address: STAKING_ADDRESS,
                abi: STAKING_ABI,
                functionName: 'getStakesOf',
                args: [userAddress]
            });

            activeStakesList = rawStakes.map((item, idx) => ({
                index: idx,
                amount: item.amount,
                startTime: Number(item.startTime) * 1000,
                endTime: Number(item.endTime) * 1000,
                yield: item.yield,
                durationDays: Number(item.durationDays),
                apy: Number(item.apy),
                active: item.active
            })).filter(item => item.active);

            stakesCount.innerText = `${activeStakesList.length} Position${activeStakesList.length === 1 ? '' : 's'}`;

            if (activeStakesList.length === 0) {
                stakesTbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center; color:#999; padding: 24px;">No active stakes on-chain.</td>
                    </tr>
                `;
                return;
            }

            const now = Date.now();
            stakesTbody.innerHTML = activeStakesList.map(item => {
                const elapsed = now - item.startTime;
                const totalDur = item.endTime - item.startTime;
                const progress = Math.min(100, Math.max(0, (elapsed / totalDur) * 100));
                const isMatured = now >= item.endTime;

                const endDateStr = new Date(item.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
                const statusBadge = isMatured 
                    ? `<span class="cltr-badge matured" style="color:#10B981; font-weight:700;">Matured</span>` 
                    : `<span class="cltr-badge locked" style="color:#888;">Locked</span>`;

                return `
                    <tr>
                        <td><strong>${formatNumber(parseFloat(formatUnits(item.amount, 18)))} CLTR</strong></td>
                        <td>${item.durationDays} Days @ ${item.apy}%</td>
                        <td>
                            <div class="cltr-progress-bar-mini">
                                <div class="cltr-progress-bar-mini-fill" style="width: ${progress}%"></div>
                            </div>
                            ${endDateStr}
                        </td>
                        <td style="color:#10B981;">+${formatNumber(parseFloat(formatUnits(item.yield, 18)))}</td>
                        <td>${statusBadge}</td>
                        <td><button class="cltr-unstake-btn" data-idx="${item.index}" ${isMatured ? '' : 'disabled'}>Unstake</button></td>
                    </tr>
                `;
            }).join('');

            // Wire up unstake click events
            document.querySelectorAll('.cltr-unstake-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const idx = parseInt(this.getAttribute('data-idx') || '0');
                    await unstakeTokens(idx);
                });
            });

        } catch (err) {
            console.error('Failed reading stakes from on-chain:', err);
        }
    }

    // 5. Vesting calculations ticker
    let vestingInterval = null;
    async function loadVestingEscrows() {
        if (!userAddress) return;

        try {
            const nowSec = Math.floor(Date.now() / 1000);
            const elapsed = nowSec - vestingStart;

            // Founder calculations
            const founderTotal = 50000000n;
            let founderVested = 0n;
            let founderReleased = 0n;
            let founderClaimable = 0n;
            let founderTimeText = '';
            let founderPct = 0;

            if (FOUNDER_VESTING_ADDRESS !== '0x0000000000000000000000000000000000000000') {
                founderReleased = await readContract(wagmiAdapter.wagmiConfig, {
                    address: FOUNDER_VESTING_ADDRESS,
                    abi: VESTING_ABI,
                    functionName: 'released'
                });

                const rawVested = await readContract(wagmiAdapter.wagmiConfig, {
                    address: FOUNDER_VESTING_ADDRESS,
                    abi: VESTING_ABI,
                    functionName: 'vestedAmount'
                });
                founderVested = rawVested;
                founderClaimable = founderVested - founderReleased;
            }

            if (elapsed >= vestingCliff) {
                founderPct = (elapsed / vestingDuration) * 100;
                if (elapsed >= vestingDuration) {
                    founderTimeText = 'Escrow Finished';
                    founderPct = 100;
                } else {
                    const daysLeft = Math.ceil((vestingDuration - elapsed) / (24 * 60 * 60));
                    founderTimeText = `${daysLeft} days left`;
                }
            } else {
                founderTimeText = 'Locked (Cliff: 1 Year)';
                founderPct = (elapsed / vestingCliff) * 25;
            }

            founderProgress.style.width = `${Math.min(100, founderPct)}%`;
            founderVestedLabel.innerText = `${formatNumber(parseFloat(formatUnits(founderVested, 18)))} CLTR`;
            founderTimeRemaining.innerText = founderTimeText;
            founderClaimableLabel.innerText = `${formatNumber(parseFloat(formatUnits(founderClaimable, 18)))} CLTR`;
            if (founderClaimable > 0n) {
                founderClaimBtn.removeAttribute('disabled');
            } else {
                founderClaimBtn.setAttribute('disabled', 'true');
            }

            // Team calculations
            const teamTotal = 150000000n;
            let teamVested = 0n;
            let teamReleased = 0n;
            let teamClaimable = 0n;
            let teamTimeText = '';
            let teamPct = 0;

            if (TEAM_VESTING_ADDRESS !== '0x0000000000000000000000000000000000000000') {
                teamReleased = await readContract(wagmiAdapter.wagmiConfig, {
                    address: TEAM_VESTING_ADDRESS,
                    abi: VESTING_ABI,
                    functionName: 'released'
                });

                const rawVested = await readContract(wagmiAdapter.wagmiConfig, {
                    address: TEAM_VESTING_ADDRESS,
                    abi: VESTING_ABI,
                    functionName: 'vestedAmount'
                });
                teamVested = rawVested;
                teamClaimable = teamVested - teamReleased;
            }

            if (elapsed >= vestingCliff) {
                teamPct = (elapsed / vestingDuration) * 100;
                if (elapsed >= vestingDuration) {
                    teamTimeText = 'Escrow Finished';
                    teamPct = 100;
                } else {
                    const daysLeft = Math.ceil((vestingDuration - elapsed) / (24 * 60 * 60));
                    teamTimeText = `${daysLeft} days left`;
                }
            } else {
                teamTimeText = 'Locked (Cliff: 1 Year)';
                teamPct = (elapsed / vestingCliff) * 25;
            }

            teamProgress.style.width = `${Math.min(100, teamPct)}%`;
            teamVestedLabel.innerText = `${formatNumber(parseFloat(formatUnits(teamVested, 18)))} CLTR`;
            teamTimeRemaining.innerText = teamTimeText;
            teamClaimableLabel.innerText = `${formatNumber(parseFloat(formatUnits(teamClaimable, 18)))} CLTR`;
            if (teamClaimable > 0n) {
                teamClaimBtn.removeAttribute('disabled');
            } else {
                teamClaimBtn.setAttribute('disabled', 'true');
            }

        } catch (err) {
            console.error('Failed reading vesting contracts:', err);
        }
    }

    function startVestingTicker() {
        if (vestingInterval) clearInterval(vestingInterval);
        loadVestingEscrows();
        vestingInterval = setInterval(loadVestingEscrows, 10000);
    }

    // 6. Connect Account & Chain Gating
    async function loadAccountData() {
        if (!userAddress) return;

        try {
            // Read balances
            if (CLTR_TOKEN_ADDRESS !== '0x0000000000000000000000000000000000000000') {
                const bal = await readContract(wagmiAdapter.wagmiConfig, {
                    address: CLTR_TOKEN_ADDRESS,
                    abi: ERC20_ABI,
                    functionName: 'balanceOf',
                    args: [userAddress]
                });
                balance = bal;
                const formattedBal = formatNumber(parseFloat(formatUnits(balance, 18)));
                metricConvictionBal.innerText = formattedBal;
                
                // Keep connected banner in sync
                const bannerBalEl = document.getElementById('banner-balance');
                if (bannerBalEl) {
                    bannerBalEl.innerText = `${formattedBal} CLTR`;
                } else {
                    renderConnectedBanner(userAddress, formattedBal);
                }
            }

            if (STAKING_ADDRESS !== '0x0000000000000000000000000000000000000000') {
                const totalStaked = activeStakesList.reduce((sum, item) => sum + item.amount, 0n);
                stakedBalance = totalStaked;
                metricCommittedCollateral.innerText = formatNumber(parseFloat(formatUnits(stakedBalance, 18)));

                const accruedRewards = activeStakesList.reduce((sum, item) => sum + item.yield, 0n);
                metricYieldEarned.innerText = formatNumber(parseFloat(formatUnits(accruedRewards, 18)));
            }

            // Reputation metrics derivation
            repScore.innerText = '820 / 1000';
            repRank.innerText = 'Tier I Guardian';
            repSuccessRate.innerText = '94.8%';
            repContractsCompleted.innerText = activeStakesList.length.toString();
            repRankNum.innerText = '#124 Global';

            stakeInput.removeAttribute('disabled');
            lockPills.forEach(p => p.removeAttribute('disabled'));

            startVestingTicker();
        } catch (err) {
            console.error('Failed loading account details:', err);
        }
    }

    function resetUIData() {
        renderDisconnectedBanner();

        metricConvictionBal.innerText = '—';
        metricCommittedCollateral.innerText = '—';
        metricYieldEarned.innerText = '—';

        repScore.innerText = '—';
        repRank.innerText = 'CONNECT WALLET';
        repSuccessRate.innerText = '—';
        repContractsCompleted.innerText = '—';
        repRankNum.innerText = '—';

        stakeInput.setAttribute('disabled', 'true');
        stakeInput.value = '';
        lockPills.forEach(p => p.setAttribute('disabled', 'true'));
        stakeBtn.setAttribute('disabled', 'true');

        if (vestingInterval) clearInterval(vestingInterval);
        
        founderVestedLabel.innerText = '—';
        founderTimeRemaining.innerText = '—';
        founderClaimableLabel.innerText = '—';
        founderProgress.style.width = '0%';
        founderClaimBtn.setAttribute('disabled', 'true');

        teamVestedLabel.innerText = '—';
        teamTimeRemaining.innerText = '—';
        teamClaimableLabel.innerText = '—';
        teamProgress.style.width = '0%';
        teamClaimBtn.setAttribute('disabled', 'true');

        renderStakesTable();
    }

    function checkChainNetwork(account) {
        const chainId = account.chainId;
        if (chainId !== 4663) {
            resetTxSteps(false, "Switch to Robinhood Chain");
            updateTxStep('step-sign', 'pending');
            txModal.classList.add('open');
            
            // Try to auto-switch network
            switchChain(wagmiAdapter.wagmiConfig, { chainId: 4663 }).catch(() => {
                console.warn('Auto network switch rejected by user wallet.');
            });
            return false;
        } else {
            txModal.classList.remove('open');
            return true;
        }
    }

    // Watch account connection using Wagmi
    watchAccount(wagmiAdapter.wagmiConfig, {
        async onChange(account) {
            if (account.isConnected && account.address) {
                userAddress = account.address;
                const formattedBal = formatNumber(parseFloat(formatUnits(balance, 18)));
                renderConnectedBanner(userAddress, formattedBal);

                if (checkChainNetwork(account)) {
                    await loadStakingPositions();
                    await loadAccountData();
                }
            } else {
                userAddress = undefined;
                resetUIData();
            }
        }
    });

    // Connect trigger via event delegation on parent banner
    if (bannerContainer) {
        bannerContainer.addEventListener('click', async (e) => {
            if (e.target && (e.target.id === 'w-connect-btn' || e.target.closest('#w-connect-btn'))) {
                modal.open();
            } else if (e.target && (e.target.id === 'w-disconnect-btn' || e.target.closest('#w-disconnect-btn'))) {
                await disconnect(wagmiAdapter.wagmiConfig);
                userAddress = undefined;
                resetUIData();
            }
        });
    }

    // Max stake amount selection
    maxBtn.addEventListener('click', () => {
        if (!userAddress) return;
        stakeInput.value = formatUnits(balance, 18);
        updateStakingCalc();
    });

    stakeInput.addEventListener('input', updateStakingCalc);

    // Duration pills
    lockPills.forEach(pill => {
        pill.addEventListener('click', function() {
            if (!userAddress) return;
            lockPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            activeDuration = parseInt(this.getAttribute('data-days') || '30');
            activeAPY = getAPY(activeDuration);
            updateStakingCalc();
        });
    });

    // 7. Write Transactions: Staking Token
    stakeBtn.addEventListener('click', async () => {
        const val = parseFloat(stakeInput.value) || 0;
        if (!userAddress || val <= 0) return;

        const amountBig = parseUnits(stakeInput.value, 18);

        try {
            const allowance = await readContract(wagmiAdapter.wagmiConfig, {
                address: CLTR_TOKEN_ADDRESS,
                abi: ERC20_ABI,
                functionName: 'allowance',
                args: [userAddress, STAKING_ADDRESS]
            });

            const needsApprove = allowance < amountBig;
            resetTxSteps(needsApprove, "Commitment Created");
            txModal.classList.add('open');

            if (needsApprove) {
                // 1. Approving CLTR
                updateTxStep('step-approve', 'pending');
                updateTxStep('step-sign', 'pending');

                const { request } = await simulateContract(wagmiAdapter.wagmiConfig, {
                    address: CLTR_TOKEN_ADDRESS,
                    abi: ERC20_ABI,
                    functionName: 'approve',
                    args: [STAKING_ADDRESS, amountBig]
                });

                const appTx = await writeContract(wagmiAdapter.wagmiConfig, request);
                updateTxStep('step-sign', 'success');
                updateTxStep('step-submit', 'pending');
                updateTxStep('step-confirm', 'pending');

                await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: appTx });
                updateTxStep('step-approve', 'success');
                updateTxStep('step-submit', 'success');
                updateTxStep('step-confirm', 'success');
            }

            // 2. Staking
            updateTxStep('step-sign', 'pending');
            updateTxStep('step-submit', 'inactive');
            updateTxStep('step-confirm', 'inactive');

            const { request: stakeRequest } = await simulateContract(wagmiAdapter.wagmiConfig, {
                address: STAKING_ADDRESS,
                abi: STAKING_ABI,
                functionName: 'stake',
                args: [amountBig, BigInt(activeDuration)]
            });

            const stakeTx = await writeContract(wagmiAdapter.wagmiConfig, stakeRequest);
            updateTxStep('step-sign', 'success');
            updateTxStep('step-submit', 'pending');
            updateTxStep('step-confirm', 'pending');

            await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: stakeTx });
            updateTxStep('step-submit', 'success');
            updateTxStep('step-confirm', 'success');
            updateTxStep('step-done', 'success');

            setTimeout(async () => {
                txModal.classList.remove('open');
                stakeInput.value = '';
                await loadStakingPositions();
                await loadAccountData();
                await loadPublicStats();
                await loadLiveActivity();
            }, 2000);

        } catch (err) {
            console.error('Stake transaction failed:', err);
            // Mark failed indicator
            const activeStep = document.querySelector('.cltr-step[style*="font-weight: 700"]');
            if (activeStep) {
                const indicator = activeStep.querySelector('.step-indicator');
                if (indicator) indicator.innerText = '[!]';
                activeStep.style.color = '#D82224';
            }
            setTimeout(() => txModal.classList.remove('open'), 4000);
        }
    });

    async function unstakeTokens(idx) {
        if (!userAddress) return;

        resetTxSteps(false, "Escrow Released");
        updateTxStep('step-sign', 'pending');
        txModal.classList.add('open');

        try {
            // Pre-flight simulation
            const { request } = await simulateContract(wagmiAdapter.wagmiConfig, {
                address: STAKING_ADDRESS,
                abi: STAKING_ABI,
                functionName: 'unstake',
                args: [BigInt(idx)]
            });

            const tx = await writeContract(wagmiAdapter.wagmiConfig, request);
            updateTxStep('step-sign', 'success');
            updateTxStep('step-submit', 'pending');
            updateTxStep('step-confirm', 'pending');

            await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: tx });
            updateTxStep('step-submit', 'success');
            updateTxStep('step-confirm', 'success');
            updateTxStep('step-done', 'success');

            setTimeout(async () => {
                txModal.classList.remove('open');
                await loadStakingPositions();
                await loadAccountData();
                await loadPublicStats();
                await loadLiveActivity();
            }, 2000);

        } catch (err) {
            console.error('Unstake transaction failed:', err);
            const activeStep = document.querySelector('.cltr-step[style*="font-weight: 700"]');
            if (activeStep) {
                const indicator = activeStep.querySelector('.step-indicator');
                if (indicator) indicator.innerText = '[!]';
                activeStep.style.color = '#D82224';
            }
            setTimeout(() => txModal.classList.remove('open'), 4000);
        }
    }

    // 9. Write Transactions: Vesting Claims
    founderClaimBtn.addEventListener('click', async () => {
        if (!userAddress) return;

        resetTxSteps(false, "Tokens Released");
        updateTxStep('step-sign', 'pending');
        txModal.classList.add('open');

        try {
            // Pre-flight simulation
            const { request } = await simulateContract(wagmiAdapter.wagmiConfig, {
                address: FOUNDER_VESTING_ADDRESS,
                abi: VESTING_ABI,
                functionName: 'release'
            });

            const tx = await writeContract(wagmiAdapter.wagmiConfig, request);
            updateTxStep('step-sign', 'success');
            updateTxStep('step-submit', 'pending');
            updateTxStep('step-confirm', 'pending');

            await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: tx });
            updateTxStep('step-submit', 'success');
            updateTxStep('step-confirm', 'success');
            updateTxStep('step-done', 'success');

            setTimeout(async () => {
                txModal.classList.remove('open');
                await loadAccountData();
                await loadPublicStats();
                await loadLiveActivity();
            }, 2000);

        } catch (err) {
            console.error('Founder release transaction failed:', err);
            const activeStep = document.querySelector('.cltr-step[style*="font-weight: 700"]');
            if (activeStep) {
                const indicator = activeStep.querySelector('.step-indicator');
                if (indicator) indicator.innerText = '[!]';
                activeStep.style.color = '#D82224';
            }
            setTimeout(() => txModal.classList.remove('open'), 4000);
        }
    });

    teamClaimBtn.addEventListener('click', async () => {
        if (!userAddress) return;

        resetTxSteps(false, "Tokens Released");
        updateTxStep('step-sign', 'pending');
        txModal.classList.add('open');

        try {
            // Pre-flight simulation
            const { request } = await simulateContract(wagmiAdapter.wagmiConfig, {
                address: TEAM_VESTING_ADDRESS,
                abi: VESTING_ABI,
                functionName: 'release'
            });

            const tx = await writeContract(wagmiAdapter.wagmiConfig, request);
            updateTxStep('step-sign', 'success');
            updateTxStep('step-submit', 'pending');
            updateTxStep('step-confirm', 'pending');

            await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: tx });
            updateTxStep('step-submit', 'success');
            updateTxStep('step-confirm', 'success');
            updateTxStep('step-done', 'success');

            setTimeout(async () => {
                txModal.classList.remove('open');
                await loadAccountData();
                await loadPublicStats();
                await loadLiveActivity();
            }, 2000);

        } catch (err) {
            console.error('Team release transaction failed:', err);
            const activeStep = document.querySelector('.cltr-step[style*="font-weight: 700"]');
            if (activeStep) {
                const indicator = activeStep.querySelector('.step-indicator');
                if (indicator) indicator.innerText = '[!]';
                activeStep.style.color = '#D82224';
            }
            setTimeout(() => txModal.classList.remove('open'), 4000);
        }
    });

    function renderStakesTable() {
        stakesTbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; color:#999; padding: 24px;">Connect wallet to view active locked positions.</td>
            </tr>
        `;
        stakesCount.innerText = '0 Positions';
    }

    // Init views on launch
    loadPublicStats();
    loadLiveActivity();
    
    // Refresh stats & activity feed every 20s
    setInterval(() => {
        loadPublicStats();
        loadLiveActivity();
    }, 20000);

    const initialAccount = getAccount(wagmiAdapter.wagmiConfig);
    if (initialAccount.isConnected && initialAccount.address) {
        userAddress = initialAccount.address;
        renderConnectedBanner(userAddress, '—');

        if (checkChainNetwork(initialAccount)) {
            loadStakingPositions();
            loadAccountData();
        }
    } else {
        resetUIData();
    }
}
