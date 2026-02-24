// ContractDetail.js — Institutional Contract Receipt
// The page users land on after committing capital. Receipt-grade.

export function renderContractDetail(params) {
    const contractId = params?.id || '';
    return `
        <style>
            /* ================================================================
               CONTRACT DETAIL — Institutional Receipt
               ================================================================ */
            .cd {
                max-width: 1400px;
                margin: 0 auto;
                padding: 32px 40px 100px;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
                background: #F2F2F2;
                min-height: calc(100vh - 72px);
            }

            /* Breadcrumb */
            .cd-breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 28px; }
            .cd-breadcrumb a, .cd-breadcrumb span {
                font-size: 10px; font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af;
                text-decoration: none; transition: color 150ms; cursor: pointer;
            }
            .cd-breadcrumb a:hover { color: #111; }
            .cd-breadcrumb .cd-bc-sep { font-size: 9px; color: #d4d4d4; }
            .cd-breadcrumb .cd-bc-current { color: #374151; font-weight: 600; }

            /* Card */
            .cd-card {
                background: #fff;
                border: 1px solid #DADADA;
                border-radius: 4px;
                border-top: 3px solid #752122;
                overflow: hidden;
            }

            /* Loading */
            .cd-loading { display: flex; align-items: center; justify-content: center; min-height: 50vh; }
            .cd-spinner { width: 20px; height: 20px; border: 2px solid #e5e5e5; border-top-color: #374151; border-radius: 50%; animation: cd-spin 0.7s linear infinite; }
            @keyframes cd-spin { to { transform: rotate(360deg); } }

            /* Error */
            .cd-error { text-align: center; padding: 60px 20px; }
            .cd-error-icon { width: 48px; height: 48px; border-radius: 50%; background: #fef2f2; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 20px; }
            .cd-error-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #374151; font-family: 'JetBrains Mono', monospace; margin-bottom: 8px; }
            .cd-error-msg { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
            .cd-error-btn {
                display: inline-block; padding: 10px 24px; background: #111; color: #fff;
                border: none; font-size: 11px; font-weight: 600; text-transform: uppercase;
                letter-spacing: 0.06em; cursor: pointer; transition: background 150ms;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .cd-error-btn:hover { background: #333; }

            .cd-hidden { display: none !important; }

            /* === HEADER === */
            .cd-header { padding: 20px 24px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
            .cd-header-left { display: flex; flex-direction: column; gap: 4px; }
            .cd-header-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; font-family: 'JetBrains Mono', monospace; font-weight: 600; }
            .cd-header-id { font-size: 16px; font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #0a0a0a; letter-spacing: -0.01em; }
            .cd-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
            .cd-badge {
                display: inline-flex; align-items: center; padding: 3px 10px;
                font-size: 10px; font-weight: 700; text-transform: uppercase;
                letter-spacing: 0.08em; font-family: 'JetBrains Mono', monospace;
                border: 1px solid transparent; border-radius: 3px;
            }
            .cd-badge-created { background: #f5f5f5; border-color: #e5e5e5; color: #6b7280; }
            .cd-badge-pending { background: #fffbeb; border-color: #fde68a; color: #92400e; }
            .cd-badge-funded { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
            .cd-badge-active { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
            .cd-badge-verifying { background: #faf5ff; border-color: #e9d5ff; color: #7c3aed; }
            .cd-badge-settled { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
            .cd-badge-forfeited { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
            .cd-updated { font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #9ca3af; letter-spacing: 0.04em; }

            /* === TERMS GRID === */
            .cd-terms { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid #e5e5e5; }
            @media (max-width: 600px) { .cd-terms { grid-template-columns: repeat(2, 1fr); } }
            .cd-term {
                padding: 14px 20px; border-right: 1px solid #e5e5e5;
                background: #fafafa;
            }
            .cd-term:last-child { border-right: none; }
            @media (max-width: 600px) { .cd-term { border-bottom: 1px solid #e5e5e5; } .cd-term:nth-child(2n) { border-right: none; } }
            .cd-term-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; font-family: 'JetBrains Mono', monospace; font-weight: 600; margin-bottom: 6px; }
            .cd-term-val { font-size: 13px; font-weight: 600; color: #111; }

            /* === CAPITAL BLOCK === */
            .cd-capital { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #e5e5e5; }
            @media (max-width: 500px) { .cd-capital { grid-template-columns: 1fr; } }
            .cd-capital-cell { padding: 20px 24px; }
            .cd-capital-cell:first-child { border-right: 1px solid #e5e5e5; }
            @media (max-width: 500px) { .cd-capital-cell:first-child { border-right: none; border-bottom: 1px solid #e5e5e5; } }
            .cd-capital-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; font-family: 'JetBrains Mono', monospace; font-weight: 600; margin-bottom: 8px; }
            .cd-capital-amount { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; color: #0a0a0a; font-family: 'JetBrains Mono', monospace; }
            .cd-capital-payout { font-size: 24px; font-weight: 600; color: #166534; font-family: 'JetBrains Mono', monospace; }

            /* === IMMUTABLE NOTICE === */
            .cd-immutable {
                padding: 8px 24px; border-bottom: 1px solid #e5e5e5;
                background: #fafafa; display: flex; align-items: center; gap: 8px;
                font-size: 10px; font-family: 'JetBrains Mono', monospace;
                color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em;
            }
            .cd-immutable svg { width: 12px; height: 12px; flex-shrink: 0; }

            /* === ACTION PANEL === */
            .cd-action { padding: 20px 24px; border-bottom: 1px solid #e5e5e5; background: #fff; }
            .cd-action-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; font-family: 'JetBrains Mono', monospace; margin-bottom: 16px; }
            .cd-action-body { }

            .cd-action-msg { font-size: 13px; color: #374151; line-height: 1.5; margin-bottom: 8px; }
            .cd-action-warn { font-size: 11px; color: #991b1b; margin-bottom: 16px; display: flex; align-items: center; gap: 6px; }
            .cd-action-hint { font-size: 11px; color: #6b7280; margin-top: 6px; }

            .cd-action-status { display: flex; align-items: center; gap: 10px; }
            .cd-action-status-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .cd-action-status-icon.success { background: #f0fdf4; color: #166534; }
            .cd-action-status-icon.active { background: #f0fdf4; color: #166534; }
            .cd-action-status-icon.fail { background: #fef2f2; color: #991b1b; }
            .cd-action-status-icon.pending { background: #fffbeb; color: #92400e; }
            .cd-action-status-text h4 { font-size: 13px; font-weight: 600; color: #111; margin: 0 0 2px; }
            .cd-action-status-text p { font-size: 11px; color: #6b7280; margin: 0; }

            .cd-btn-primary {
                display: inline-flex; align-items: center; justify-content: center;
                padding: 12px 28px; min-width: 180px; border: none;
                background: #752122; color: #fff;
                font-size: 12px; font-weight: 600; text-transform: uppercase;
                letter-spacing: 0.06em; font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                cursor: pointer; transition: background 180ms, box-shadow 180ms;
                box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            }
            .cd-btn-primary:hover { background: #5a191a; box-shadow: 0 4px 12px rgba(117,33,34,0.2); }
            .cd-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

            .cd-btn-secondary {
                display: inline-flex; align-items: center; justify-content: center;
                padding: 10px 24px; border: 1px solid #d4d4d4; background: #fff;
                color: #374151; font-size: 11px; font-weight: 600; text-transform: uppercase;
                letter-spacing: 0.06em; font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                cursor: pointer; transition: background 150ms;
            }
            .cd-btn-secondary:hover { background: #f5f5f5; }

            .cd-spinner-small { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: cd-spin 0.7s linear infinite; }
            .cd-spinner-dark { border-color: rgba(0,0,0,0.1); border-top-color: #92400e; }

            /* Payment element area */
            .cd-payment-area { margin-top: 16px; }
            .cd-payment-msg { font-size: 12px; margin-top: 8px; }
            .cd-payment-msg.error { color: #991b1b; }
            .cd-payment-msg.success { color: #166534; }

            /* === EVENT LOG === */
            .cd-events { padding: 20px 24px; border-bottom: 1px solid #e5e5e5; }
            .cd-events-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; font-family: 'JetBrains Mono', monospace; margin-bottom: 16px; }
            .cd-timeline { position: relative; padding-left: 20px; }
            .cd-timeline::before {
                content: ''; position: absolute; left: 4px; top: 6px; bottom: 6px;
                width: 1px; background: #E0E0E0;
            }
            .cd-event { position: relative; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
            .cd-event:last-child { margin-bottom: 0; }
            .cd-event-dot {
                position: absolute; left: -20px; top: 5px;
                width: 9px; height: 9px; border-radius: 50%;
                border: 2px solid #fff; box-shadow: 0 0 0 1px #E0E0E0;
            }
            .cd-event-dot.neutral { background: #d4d4d4; }
            .cd-event-dot.amber { background: #f59e0b; }
            .cd-event-dot.blue { background: #3b82f6; }
            .cd-event-dot.green { background: #22c55e; }
            .cd-event-dot.purple { background: #a855f7; }
            .cd-event-dot.red { background: #ef4444; }
            .cd-event-label { font-size: 11px; font-weight: 600; color: #111; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.04em; }
            .cd-event-time { font-size: 10px; color: #9ca3af; font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
            .cd-events-empty { font-size: 12px; color: #9ca3af; font-family: 'JetBrains Mono', monospace; padding-left: 20px; }

            /* === FOOTER === */
            .cd-footer {
                padding: 14px 24px; background: #fafafa;
                display: flex; justify-content: space-between; align-items: center;
                border-radius: 0 0 4px 4px;
            }
            .cd-footer-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; font-family: 'JetBrains Mono', monospace; font-weight: 600; }
            .cd-footer-val { font-size: 10px; color: #6b7280; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
            .cd-footer-stamp { display: flex; align-items: center; gap: 6px; font-size: 9px; color: #9ca3af; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.06em; }
            .cd-footer-stamp svg { width: 12px; height: 12px; }

            /* Payment result banner */
            .cd-banner {
                position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 100;
                padding: 12px 20px; border: 1px solid; border-radius: 4px;
                font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .cd-banner.success { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
            .cd-banner.error { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
            .cd-banner.pending { background: #fffbeb; border-color: #fde68a; color: #92400e; }
            .cd-banner-close { background: none; border: none; color: inherit; opacity: 0.5; cursor: pointer; font-size: 16px; padding: 0; line-height: 1; }
            .cd-banner-close:hover { opacity: 1; }
        </style>

        <div class="cd">
            <div class="cd-breadcrumb">
                <a onclick="window.router.navigate('/my-contracts')">My Contracts</a>
                <span class="cd-bc-sep">›</span>
                <span class="cd-bc-current" id="cd-bc-id">${contractId.substring(0, 8).toUpperCase()}</span>
            </div>

            <!-- Loading -->
            <div id="cd-loading" class="cd-loading">
                <div class="cd-spinner"></div>
            </div>

            <!-- Error -->
            <div id="cd-error" class="cd-hidden cd-error">
                <div class="cd-error-icon">✕</div>
                <div class="cd-error-title">Failed to Load Contract</div>
                <p id="cd-error-msg" class="cd-error-msg"></p>
                <button class="cd-error-btn" onclick="window.router.navigate('/my-contracts')">Back to Contracts</button>
            </div>

            <!-- Detail Card -->
            <div id="cd-detail" class="cd-hidden cd-card">
                <!-- Header -->
                <div class="cd-header">
                    <div class="cd-header-left">
                        <span class="cd-header-lbl">Contract ID</span>
                        <span class="cd-header-id" id="cd-full-id"></span>
                    </div>
                    <div class="cd-header-right">
                        <span id="cd-badge" class="cd-badge"></span>
                        <span id="cd-updated" class="cd-updated"></span>
                    </div>
                </div>

                <!-- Terms Grid -->
                <div class="cd-terms">
                    <div class="cd-term">
                        <div class="cd-term-lbl">Platform</div>
                        <div class="cd-term-val" id="cd-platform"></div>
                    </div>
                    <div class="cd-term">
                        <div class="cd-term-lbl">Risk Tier</div>
                        <div class="cd-term-val" id="cd-tier"></div>
                    </div>
                    <div class="cd-term">
                        <div class="cd-term-lbl">Deadline</div>
                        <div class="cd-term-val" id="cd-deadline"></div>
                    </div>
                    <div class="cd-term">
                        <div class="cd-term-lbl">Duration</div>
                        <div class="cd-term-val" id="cd-duration"></div>
                    </div>
                </div>

                <!-- Capital Block -->
                <div class="cd-capital">
                    <div class="cd-capital-cell">
                        <div class="cd-capital-lbl">Capital Locked</div>
                        <div class="cd-capital-amount" id="cd-lock-amount"></div>
                    </div>
                    <div class="cd-capital-cell">
                        <div class="cd-capital-lbl">Potential Payout</div>
                        <div class="cd-capital-payout" id="cd-payout-amount"></div>
                    </div>
                </div>

                <!-- Immutable Notice -->
                <div class="cd-immutable">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
                    <span>This record is append-only and cannot be altered</span>
                </div>

                <!-- Action Panel -->
                <div class="cd-action">
                    <div class="cd-action-title">Next Action</div>
                    <div class="cd-action-body" id="cd-action-content"></div>
                </div>

                <!-- Event Log -->
                <div class="cd-events">
                    <div class="cd-events-title">Event Log</div>
                    <div id="cd-event-log"></div>
                </div>

                <!-- Footer -->
                <div class="cd-footer">
                    <div>
                        <div class="cd-footer-lbl">Created</div>
                        <div class="cd-footer-val" id="cd-created"></div>
                    </div>
                    <div class="cd-footer-stamp">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
                        Immutable Ledger
                    </div>
                </div>
            </div>
        </div>`;
}

export async function initContractDetail(params) {
    const contractId = params?.id;
    if (!contractId) {
        showError('No contract ID provided');
        return;
    }

    const loadingEl = document.getElementById('cd-loading');
    const errorEl = document.getElementById('cd-error');
    const detailEl = document.getElementById('cd-detail');

    try {
        // Check for 3DS redirect return
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
        const redirectStatus = urlParams.get('redirect_status');

        if (paymentIntentClientSecret) {
            console.log('[ContractDetail] 3DS redirect return detected:', redirectStatus);
            window.history.replaceState({}, '', window.location.pathname);

            const stripeInstance = await initializeStripe();
            const { paymentIntent, error } = await stripeInstance.retrievePaymentIntent(paymentIntentClientSecret);

            if (error) {
                console.error('[ContractDetail] Payment retrieval error:', error);
                showPaymentResult('error', error.message);
            } else if (paymentIntent) {
                console.log('[ContractDetail] PaymentIntent status:', paymentIntent.status);
                switch (paymentIntent.status) {
                    case 'succeeded':
                        showPaymentResult('success', 'Payment successful! Waiting for confirmation...');
                        break;
                    case 'processing':
                        showPaymentResult('pending', 'Payment is processing. Please wait...');
                        break;
                    case 'requires_payment_method':
                        showPaymentResult('error', 'Payment failed. Please try again.');
                        break;
                    default:
                        showPaymentResult('pending', `Payment status: ${paymentIntent.status}`);
                }
            }
        }

        // Load contract + events
        const contract = await window.api.getContract(contractId);
        console.log('[ContractDetail] Loaded:', contract);

        const eventsData = await window.api.getLedgerEvents(contractId);
        const events = eventsData.events || [];

        // Show detail
        loadingEl.classList.add('cd-hidden');
        detailEl.classList.remove('cd-hidden');

        // Populate
        const c = contract.contract || contract;
        document.getElementById('cd-full-id').textContent = contractId.substring(0, 8).toUpperCase();
        document.getElementById('cd-platform').textContent = c.platform || '—';
        document.getElementById('cd-tier').textContent = (c.riskTier || 'STANDARD').toUpperCase();
        document.getElementById('cd-deadline').textContent = formatDate(c.deadline || c.deadlineUtc);
        document.getElementById('cd-lock-amount').textContent = formatCurrency(c.lockAmountUsdCents);
        document.getElementById('cd-payout-amount').textContent = '+' + formatCurrency(c.payoutAmountUsdCents);
        document.getElementById('cd-created').textContent = formatDate(c.createdAt);
        document.getElementById('cd-updated').textContent = formatDate(c.updatedAt);

        // Duration calculation
        if (c.createdAt && (c.deadline || c.deadlineUtc)) {
            const start = new Date(c.createdAt);
            const end = new Date(c.deadline || c.deadlineUtc);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            document.getElementById('cd-duration').textContent = days + ' Days';
        } else {
            document.getElementById('cd-duration').textContent = '—';
        }

        // Status badge
        const state = c.derivedState || c.state || 'CREATED';
        console.log('[ContractDetail] Derived state:', state);
        setStatusBadge(state);

        // Action panel
        renderActionPanel(c, state);

        // Event log
        renderEventLog(events);

    } catch (err) {
        console.error('[ContractDetail] Error:', err);
        showError(err.message);
    }
}

// ============================================================================
// HELPERS
// ============================================================================

function showPaymentResult(type, message) {
    const existing = document.getElementById('cd-payment-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'cd-payment-banner';
    banner.className = `cd-banner ${type}`;
    banner.innerHTML = `
        <span>${message}</span>
        <button class="cd-banner-close" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(banner);

    if (type !== 'error') {
        setTimeout(() => banner.remove(), 5000);
    }
}

function showError(message) {
    const loading = document.getElementById('cd-loading');
    const error = document.getElementById('cd-error');
    if (loading) loading.classList.add('cd-hidden');
    if (error) {
        error.classList.remove('cd-hidden');
        document.getElementById('cd-error-msg').textContent = message;
    }
}

function formatCurrency(cents) {
    if (!cents) return '$0.00';
    return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
        ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function setStatusBadge(state) {
    const badge = document.getElementById('cd-badge');
    const map = {
        CREATED: { label: 'Created', cls: 'cd-badge-created' },
        FUNDS_AUTHORIZED: { label: 'Pending', cls: 'cd-badge-pending' },
        FUNDS_LOCKED: { label: 'Funded', cls: 'cd-badge-funded' },
        LOCKED: { label: 'Active', cls: 'cd-badge-active' },
        VERIFYING: { label: 'Verifying', cls: 'cd-badge-verifying' },
        SETTLING: { label: 'Settling', cls: 'cd-badge-verifying' },
        SETTLED: { label: 'Settled', cls: 'cd-badge-settled' },
        FORFEITED: { label: 'Forfeited', cls: 'cd-badge-forfeited' },
    };
    const cfg = map[state] || map.CREATED;
    badge.className = `cd-badge ${cfg.cls}`;
    badge.textContent = cfg.label;
}

// ============================================================================
// ACTION PANEL — State-based rendering
// ============================================================================

function renderActionPanel(contract, state) {
    const content = document.getElementById('cd-action-content');
    const contractId = contract.id;

    switch (state) {
        case 'CREATED':
            content.innerHTML = `
                <p class="cd-action-msg">Fund this contract to lock in your commitment.</p>
                <button id="btn-fund" class="cd-btn-primary">Fund Contract</button>
            `;
            document.getElementById('btn-fund').addEventListener('click', () => handleFund(contractId));
            break;

        case 'FUNDS_AUTHORIZED':
            content.innerHTML = `
                <div class="cd-action-status">
                    <div class="cd-action-status-icon pending">
                        <div class="cd-spinner-small cd-spinner-dark"></div>
                    </div>
                    <div class="cd-action-status-text">
                        <h4>Waiting for payment confirmation</h4>
                        <p>This page will update automatically once your payment is confirmed.</p>
                    </div>
                </div>
            `;
            startPolling(contractId);
            break;

        case 'FUNDS_LOCKED':
            content.innerHTML = `
                <p class="cd-action-msg">Your funds are locked. Execute to make the contract binding.</p>
                <div class="cd-action-warn">⚠ Once executed, this contract becomes irrevocable. No appeals.</div>
                <button id="btn-execute" class="cd-btn-primary">Execute Contract</button>
            `;
            document.getElementById('btn-execute').addEventListener('click', () => handleExecute(contractId));
            break;

        case 'LOCKED': {
            const deadline = new Date(contract.deadline || contract.deadlineUtc);
            const now = new Date();
            const daysLeft = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));
            content.innerHTML = `
                <div class="cd-action-status">
                    <div class="cd-action-status-icon active">✓</div>
                    <div class="cd-action-status-text">
                        <h4>Contract is Active</h4>
                        <p>${daysLeft} day${daysLeft !== 1 ? 's' : ''} until verification deadline</p>
                    </div>
                </div>
            `;
            break;
        }

        case 'SETTLED':
            content.innerHTML = `
                <div class="cd-action-status">
                    <div class="cd-action-status-icon success">✓</div>
                    <div class="cd-action-status-text">
                        <h4>Contract Settled Successfully</h4>
                        <p>Your funds have been returned.</p>
                    </div>
                </div>
            `;
            break;

        case 'FORFEITED':
            content.innerHTML = `
                <div class="cd-action-status">
                    <div class="cd-action-status-icon fail">✕</div>
                    <div class="cd-action-status-text">
                        <h4>Contract Forfeited</h4>
                        <p>Conditions were not met by the deadline.</p>
                    </div>
                </div>
            `;
            break;

        default:
            content.innerHTML = `<p class="cd-action-hint">Processing...</p>`;
    }
}

// ============================================================================
// EVENT LOG
// ============================================================================

function renderEventLog(events) {
    const container = document.getElementById('cd-event-log');
    if (!events || events.length === 0) {
        container.innerHTML = '<p class="cd-events-empty">No events recorded yet</p>';
        return;
    }

    const eventConfig = {
        'CONTRACT_CREATED': { label: 'Contract Created', dot: 'neutral' },
        'BASELINE_SNAPSHOTTED': { label: 'Baseline Captured', dot: 'neutral' },
        'FUNDS_AUTHORIZED': { label: 'Funding Initiated', dot: 'amber' },
        'FUNDS_LOCKED': { label: 'Funds Locked', dot: 'blue' },
        'EXECUTION_REQUESTED': { label: 'Execution Requested', dot: 'neutral' },
        'EXECUTION_CONFIRMED': { label: 'Contract Executed', dot: 'green' },
        'VERIFICATION_STARTED': { label: 'Verification Started', dot: 'purple' },
        'SETTLED_SUCCESS': { label: 'Settled (Success)', dot: 'green' },
        'SETTLED_FAILURE': { label: 'Settled (Failed)', dot: 'red' },
        'CONTRACT_FORFEITED': { label: 'Forfeited', dot: 'red' },
    };

    container.innerHTML = `
        <div class="cd-timeline">
            ${events.map(event => {
        const cfg = eventConfig[event.eventType] || { label: event.eventType, dot: 'neutral' };
        return `
                    <div class="cd-event">
                        <div class="cd-event-dot ${cfg.dot}"></div>
                        <span class="cd-event-label">${cfg.label}</span>
                        <span class="cd-event-time">${formatDate(event.timestampUtc)}</span>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

// ============================================================================
// STRIPE INTEGRATION
// ============================================================================

let stripe = null;
let elements = null;

async function initializeStripe() {
    if (stripe) return stripe;
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
        throw new Error('Stripe Publishable Key not found in environment');
    }
    stripe = await window.Stripe(publishableKey);
    return stripe;
}

async function handleFund(contractId) {
    const btn = document.getElementById('btn-fund');
    const container = document.getElementById('cd-action-content');

    btn.disabled = true;
    btn.innerHTML = '<div class="cd-spinner-small"></div>';

    try {
        console.log('[ContractDetail] Creating funding intent...');
        const result = await window.api.createFundingIntent(contractId);
        console.log('[ContractDetail] FundingIntent result:', result);

        if (result.error) throw new Error(result.error);

        // Payment already succeeded (off-session saved card)
        if (result.status === 'succeeded') {
            container.innerHTML = `
                <div class="cd-action-status">
                    <div class="cd-action-status-icon success">✓</div>
                    <div class="cd-action-status-text">
                        <h4>Payment successful!</h4>
                        <p>Locking funds... This page will update automatically.</p>
                    </div>
                </div>
            `;
            startPolling(contractId);
            return;
        }

        // Need Payment Element (no saved card)
        if (!result.clientSecret) {
            throw new Error('No client secret received — please add a card first on the Funding page.');
        }

        const stripeInstance = await initializeStripe();
        elements = stripeInstance.elements({
            appearance: { theme: 'stripe' },
            clientSecret: result.clientSecret,
        });

        container.innerHTML = `
            <p class="cd-action-msg">Complete payment to lock funds.</p>
            <div class="cd-payment-area">
                <div id="payment-element"></div>
                <div id="payment-message" class="cd-payment-msg cd-hidden"></div>
                <button id="btn-submit-payment" class="cd-btn-primary" style="width:100%;margin-top:16px;">Pay Now</button>
            </div>
        `;

        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');

        document.getElementById('btn-submit-payment').addEventListener('click', async () => {
            const submitBtn = document.getElementById('btn-submit-payment');
            const messageEl = document.getElementById('payment-message');

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="cd-spinner-small"></div>';
            messageEl.classList.add('cd-hidden');

            try {
                const { error } = await stripeInstance.confirmPayment({
                    elements,
                    confirmParams: { return_url: window.location.href },
                    redirect: 'if_required',
                });

                if (error) {
                    messageEl.textContent = error.message;
                    messageEl.className = 'cd-payment-msg error';
                    messageEl.classList.remove('cd-hidden');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Pay Now';
                } else {
                    messageEl.textContent = 'Payment successful! Locking funds...';
                    messageEl.className = 'cd-payment-msg success';
                    messageEl.classList.remove('cd-hidden');
                    setTimeout(() => window.router.navigate(`/contracts/${contractId}`), 2000);
                }
            } catch (e) {
                console.error('[Stripe] Confirm error:', e);
                messageEl.textContent = 'An unexpected error occurred.';
                messageEl.className = 'cd-payment-msg error';
                messageEl.classList.remove('cd-hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Pay Now';
            }
        });

    } catch (err) {
        console.error('[ContractDetail] Fund error:', err);
        container.innerHTML = `
            <p class="cd-payment-msg error">${err.message}</p>
            <button id="btn-fund-retry" class="cd-btn-secondary" style="margin-top:12px;">Try Again</button>
        `;
        document.getElementById('btn-fund-retry').addEventListener('click', () => handleFund(contractId));
    }
}

async function handleExecute(contractId) {
    const btn = document.getElementById('btn-execute');

    if (!confirm('Execute this contract?\n\n⚠️ This action is IRREVERSIBLE.\n⚠️ No appeals will be accepted.\n⚠️ Settlement is automatic at deadline.')) {
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="cd-spinner-small"></div>';

    try {
        const result = await window.api.executeContract(contractId);
        console.log('[ContractDetail] Execute result:', result);
        window.router.navigate(`/contracts/${contractId}`);
    } catch (err) {
        console.error('[ContractDetail] Execute error:', err);
        alert('Failed to execute contract: ' + err.message);
        btn.disabled = false;
        btn.textContent = 'Execute Contract';
    }
}

// ============================================================================
// POLLING
// ============================================================================

let pollingInterval = null;

function startPolling(contractId) {
    let attempts = 0;
    const maxAttempts = 40; // ~2 minutes

    pollingInterval = setInterval(async () => {
        attempts++;
        try {
            const response = await window.api.getContract(contractId);
            const contractData = response.contract || response;
            const state = contractData.derivedState || contractData.state;
            console.log(`[ContractDetail] Poll ${attempts}: state=${state}`);

            if ((state && state !== 'FUNDS_AUTHORIZED') || attempts >= maxAttempts) {
                clearInterval(pollingInterval);

                if (state === 'FUNDS_AUTHORIZED' && attempts >= maxAttempts) {
                    console.warn('[ContractDetail] Timeout waiting for funds lock');
                    const container = document.getElementById('cd-action-content');
                    if (container) {
                        container.innerHTML = `
                            <div class="cd-action-status">
                                <div class="cd-action-status-icon pending">⚠</div>
                                <div class="cd-action-status-text">
                                    <h4>Funds not yet locked</h4>
                                    <p>Payment authorized but not fully locked. Please wait and refresh.</p>
                                </div>
                            </div>
                            <button id="btn-refresh" class="cd-btn-secondary" style="margin-top:16px;">Refresh</button>
                        `;
                        document.getElementById('btn-refresh')?.addEventListener('click', () => {
                            window.router.navigate(`/contracts/${contractId}`);
                        });
                    }
                } else {
                    window.router.navigate(`/contracts/${contractId}`);
                }
            }
        } catch (err) {
            console.error('[ContractDetail] Polling error:', err);
        }
    }, 3000);
}
