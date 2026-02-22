// ActiveContracts.js — Institutional Contract Hub
// Displays active positions and provides a premium empty state for new users.

export function renderActiveContracts() {
    return `
        <style>
            /* ===== ACTIVE CONTRACTS HUB — INSTITUTIONAL DESIGN ===== */
            .act {
                background: #fafafa;
                min-height: calc(100vh - 72px);
                font-family: 'IBM Plex Sans', -apple-system, sans-serif;
                color: #111;
                padding-bottom: 80px;
            }

            .act-container {
                max-width: 780px;
                margin: 0 auto;
                padding: 40px 24px;
            }

            /* Breadcrumb */
            .act-breadcrumb {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 24px;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #999;
            }
            .act-breadcrumb span.active { color: #111; font-weight: 500; }

            /* Header Section */
            .act-header {
                margin-bottom: 40px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .act-title {
                font-size: 28px;
                font-weight: 700;
                letter-spacing: -0.5px;
                color: #0a0a0a;
                margin: 0;
            }
            .act-subtitle {
                font-size: 14px;
                color: #666;
                margin: 0;
                line-height: 1.5;
            }

            /* Contracts Grid/List */
            .act-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .act-card {
                background: #fff;
                border: 1px solid #e5e5e5;
                border-radius: 6px;
                padding: 20px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: all 0.2s ease;
                cursor: pointer;
                text-decoration: none;
                color: inherit;
            }
            .act-card:hover {
                border-color: #bbb;
                box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                transform: translateY(-1px);
            }

            .act-card-left {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .act-card-icon {
                width: 40px;
                height: 40px;
                background: #f8f8f8;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #888;
                font-size: 18px;
            }

            .act-card-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .act-card-id {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 11px;
                color: #999;
                letter-spacing: 0.5px;
            }
            .act-card-platform {
                font-size: 15px;
                font-weight: 600;
                color: #111;
            }

            .act-card-right {
                text-align: right;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .act-card-amount {
                font-size: 16px;
                font-weight: 700;
                color: #111;
                font-family: 'IBM Plex Mono', monospace;
            }
            .act-card-status {
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-family: 'IBM Plex Mono', monospace;
            }

            /* Status Colors */
            .status-active { color: #065f46; }
            .status-pending { color: #d97706; }
            .status-settled { color: #111; opacity: 0.6; }

            /* Empty State */
            .act-empty {
                background: #fff;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                padding: 80px 40px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }
            .act-empty-icon {
                width: 64px;
                height: 64px;
                background: #fafafa;
                border: 1px solid #f0f0f0;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ccc;
                margin-bottom: 8px;
            }
            .act-empty-title {
                font-size: 20px;
                font-weight: 600;
                color: #111;
                margin: 0;
            }
            .act-empty-msg {
                font-size: 14px;
                color: #666;
                max-width: 320px;
                line-height: 1.6;
                margin: 0;
            }
            .act-empty-btn {
                margin-top: 12px;
                padding: 12px 24px;
                background: #111;
                color: #fff;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.15s;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .act-empty-btn:hover { background: #333; }

            /* Loading */
            .act-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 100px 0;
                gap: 16px;
            }
            .act-spinner {
                width: 24px;
                height: 24px;
                border: 2px solid #eee;
                border-top-color: #752122;
                border-radius: 50%;
                animation: act-spin 0.8s linear infinite;
            }
            @keyframes act-spin { to { transform: rotate(360deg); } }
            .act-loading-text {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 11px;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            @media (max-width: 640px) {
                .act-container { padding: 32px 16px; }
                .act-card { padding: 16px; gap: 12px; }
                .act-card-left { gap: 12px; }
                .act-card-icon { width: 32px; height: 32px; font-size: 14px; }
                .act-card-platform { font-size: 14px; }
            }
        </style>

        <div class="act">
            <div class="act-container">
                <!-- Breadcrumb -->
                <div class="act-breadcrumb">
                    <span>Collateral</span>
                    <i data-lucide="chevron-right" style="width: 10px; height: 10px;"></i>
                    <span class="active">Contracts Hub</span>
                </div>

                <!-- Header -->
                <div class="act-header">
                    <h1 class="act-title">CONTRACTS</h1>
                    <p class="act-subtitle">Manage your active positions and performance monitors.</p>
                </div>

                <!-- Main Content Slot -->
                <div id="act-content">
                    <div class="act-loading">
                        <div class="act-spinner"></div>
                        <p class="act-loading-text">Retrieving ledger state...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function initActiveContracts() {
    const container = document.getElementById('act-content');
    if (!container) return;

    try {
        const response = await window.api.getContracts();
        const contracts = response?.contracts || [];

        // Filter for active/meaningful contracts
        // LOCKED, ACTIVE, EXECUTION_CONFIRMED = Primary
        // CREATED, FUNDS_AUTHORIZED = Needs attention
        const activeStates = ['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED', 'CREATED', 'FUNDS_AUTHORIZED'];
        const activeContracts = contracts.filter(c => activeStates.includes(c.state));

        if (activeContracts.length === 0) {
            renderEmptyState(container);
        } else {
            renderContractList(container, activeContracts);
        }

    } catch (err) {
        console.error('[ActiveContracts] Load error:', err);
        container.innerHTML = `
            <div style="text-align:center; padding: 40px; color: #752122; font-family: 'IBM Plex Mono', monospace; font-size: 12px;">
                ERROR_RETRIEVING_CONTRACT_STATE: ${err.message}
            </div>
        `;
    }

    if (window.lucide) window.lucide.createIcons();
}

function renderEmptyState(container) {
    container.innerHTML = `
        <div class="act-empty">
            <div class="act-empty-icon">
                <i data-lucide="file-text" style="width: 32px; height: 32px;"></i>
            </div>
            <h2 class="act-empty-title">No Active Contracts</h2>
            <p class="act-empty-msg">You have no active performance contracts monitorized in the clearinghouse.</p>
            <button class="act-empty-btn" onclick="window.router.navigate('/overview')">
                Browse Market Feed
            </button>
        </div>
    `;
}

function renderContractList(container, contracts) {
    // Sort by creation date (newest first)
    contracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const listHtml = contracts.map(c => {
        const platform = c.platform?.toUpperCase() || 'UNKNOWN';
        const amount = (c.lockAmountUsdCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        let statusClass = 'status-active';
        let statusLabel = 'ACTIVE';

        if (['CREATED', 'FUNDS_AUTHORIZED'].includes(c.state)) {
            statusClass = 'status-pending';
            statusLabel = 'FUNDING_REQUIRED';
        } else if (c.state === 'EXECUTION_CONFIRMED') {
            statusLabel = 'EXECUTED';
        }

        const icon = getPlatformIcon(c.platform);

        return `
            <a href="#/contracts/${c.id}" class="act-card">
                <div class="act-card-left">
                    <div class="act-card-icon">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="act-card-info">
                        <span class="act-card-id">${c.id.slice(0, 12).toUpperCase()}</span>
                        <span class="act-card-platform">${platform} Performance</span>
                    </div>
                </div>
                <div class="act-card-right">
                    <span class="act-card-amount">${amount}</span>
                    <span class="act-card-status ${statusClass}">${statusLabel}</span>
                </div>
            </a>
        `;
    }).join('');

    container.innerHTML = `<div class="act-list">${listHtml}</div>`;
}

function getPlatformIcon(platform) {
    const map = {
        'twitter': 'twitter',
        'x': 'twitter',
        'stripe': 'credit-card',
        'shopify': 'shopping-bag',
        'amazon': 'package',
        'github': 'github'
    };
    return map[platform?.toLowerCase()] || 'file-text';
}
