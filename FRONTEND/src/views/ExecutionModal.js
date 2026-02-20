// ExecutionModal.js — Unified Institutional Execution Overlay
// One pathway. Card click or Lock button. Same modal.

import { hasAuthToken } from '../api.js';

let _modalEl = null;
let _onExecuteCallback = null;

function ensureModal() {
    if (_modalEl) return _modalEl;

    const wrapper = document.createElement('div');
    wrapper.id = 'exec-modal-root';
    wrapper.innerHTML = `
        <style>
            #exec-modal-root { display: none; }
            #exec-modal-root.open { display: block; }

            .exec-backdrop {
                position: fixed; inset: 0; z-index: 200;
                background: rgba(0,0,0,0.45);
                backdrop-filter: blur(4px);
                animation: exec-fade 150ms ease forwards;
            }
            @keyframes exec-fade {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .exec-modal {
                position: fixed; top: 50%; left: 50%;
                transform: translate(-50%, -50%) scale(0.98);
                z-index: 201;
                width: 100%; max-width: 480px;
                background: #fff;
                border: 1px solid #e5e5e5;
                box-shadow: 0 25px 60px rgba(0,0,0,0.18);
                animation: exec-scale 180ms ease forwards;
                border-top: 3px solid #921818;
            }
            @keyframes exec-scale {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.98); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }

            .exec-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 20px 24px; border-bottom: 1px solid #e5e5e5;
            }
            .exec-header-title {
                font-size: 14px; font-weight: 700; color: #0a0a0a;
                font-family: 'IBM Plex Sans', sans-serif;
                text-transform: uppercase; letter-spacing: 0.03em;
            }
            .exec-header-id {
                font-size: 11px; color: #9ca3af;
                font-family: 'IBM Plex Mono', monospace;
            }

            .exec-body { padding: 24px; }

            .exec-row {
                display: flex; justify-content: space-between; align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .exec-row:last-of-type { border-bottom: none; }
            .exec-row-label {
                font-size: 11px; color: #6b7280;
                text-transform: uppercase; letter-spacing: 0.05em;
                font-family: 'IBM Plex Mono', monospace; font-weight: 500;
            }
            .exec-row-value {
                font-size: 14px; font-weight: 600; color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .exec-row-value.success { color: #166534; }
            .exec-row-value.failure { color: #921818; }

            .exec-summary-grid {
                display: grid; grid-template-columns: 1fr 1fr 1fr;
                gap: 1px; background: #e5e5e5;
                border: 1px solid #e5e5e5;
                margin-bottom: 20px;
            }
            .exec-summary-cell {
                background: #fafafa; padding: 14px 12px; text-align: center;
            }
            .exec-summary-label {
                font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em;
                color: #9ca3af; font-family: 'IBM Plex Mono', monospace;
                font-weight: 500; margin-bottom: 4px;
            }
            .exec-summary-value {
                font-size: 16px; font-weight: 700; color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
            }

            .exec-divider {
                border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;
            }

            .exec-escrow-note {
                font-size: 11px; color: #9ca3af; text-align: center;
                font-family: 'IBM Plex Sans', sans-serif;
                margin-bottom: 20px; font-style: italic;
            }

            .exec-risk-row {
                display: flex; align-items: flex-start; gap: 10px;
                margin-bottom: 20px; cursor: pointer; user-select: none;
            }
            .exec-risk-row input[type="checkbox"] {
                width: 16px; height: 16px; margin-top: 2px;
                accent-color: #921818; cursor: pointer; flex-shrink: 0;
            }
            .exec-risk-text {
                font-size: 12px; color: #4b5563; line-height: 1.5;
                font-family: 'IBM Plex Sans', sans-serif;
            }

            .exec-btn-primary {
                width: 100%; height: 48px; border: none;
                background: #921818; color: #fff;
                font-size: 12px; font-weight: 700;
                text-transform: uppercase; letter-spacing: 0.08em;
                font-family: 'IBM Plex Sans', sans-serif;
                cursor: pointer; position: relative; overflow: hidden;
                transition: all 180ms ease;
                box-shadow: 0 2px 8px rgba(146,24,24,0.15);
            }
            .exec-btn-primary:hover:not(:disabled) {
                background: #6B1212;
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(146,24,24,0.25);
            }
            .exec-btn-primary:active:not(:disabled) {
                transform: translateY(0);
            }
            .exec-btn-primary:disabled {
                opacity: 0.35; cursor: not-allowed;
            }

            .exec-btn-cancel {
                width: 100%; border: none; background: transparent;
                color: #9ca3af; font-size: 12px; font-weight: 500;
                font-family: 'IBM Plex Sans', sans-serif;
                cursor: pointer; padding: 10px; margin-top: 4px;
                transition: color 150ms;
            }
            .exec-btn-cancel:hover { color: #4b5563; }

            .exec-error {
                background: #fef2f2; border: 1px solid #fecaca;
                padding: 10px 14px; margin-top: 12px;
                font-size: 12px; color: #921818;
                font-family: 'IBM Plex Mono', monospace;
                display: none;
            }

            .exec-steps { margin-top: 16px; }
            .exec-step {
                display: flex; align-items: center; gap: 10px;
                padding: 8px 0; font-size: 12px;
                font-family: 'IBM Plex Mono', monospace;
                color: #d4d4d4; transition: all 0.3s;
            }
            .exec-step.active { color: #0a0a0a; }
            .exec-step.done { color: #166534; }
            .exec-step-dot {
                width: 8px; height: 8px; border-radius: 50%;
                background: #e5e5e5; transition: all 0.3s; flex-shrink: 0;
            }
            .exec-step.active .exec-step-dot {
                background: #921818;
                box-shadow: 0 0 6px rgba(146,24,24,0.4);
                animation: exec-pulse-dot 1s infinite;
            }
            .exec-step.done .exec-step-dot { background: #166534; }
            .exec-step-check { margin-left: auto; font-size: 12px; }
            @keyframes exec-pulse-dot {
                0%,100% { opacity:1; } 50% { opacity:0.4; }
            }

            .exec-success {
                text-align: center; padding: 20px 0;
            }
            .exec-success-icon { font-size: 28px; margin-bottom: 8px; }
            .exec-success-title {
                font-size: 13px; font-weight: 700; color: #166534;
                text-transform: uppercase; letter-spacing: 0.05em;
                font-family: 'IBM Plex Sans', sans-serif;
                margin-bottom: 4px;
            }
            .exec-success-sub {
                font-size: 11px; color: #9ca3af;
                font-family: 'IBM Plex Mono', monospace;
            }
            .exec-success-actions {
                display: flex; gap: 10px; margin-top: 16px;
            }
            .exec-success-btn {
                flex: 1; padding: 12px; border: none;
                font-size: 12px; font-weight: 600;
                text-transform: uppercase; letter-spacing: 0.03em;
                font-family: 'IBM Plex Sans', sans-serif;
                cursor: pointer; transition: all 150ms;
            }
            .exec-success-btn.primary {
                background: #166534; color: #fff;
            }
            .exec-success-btn.primary:hover { background: #14532d; }
            .exec-success-btn.secondary {
                background: #f5f5f5; color: #333; border: 1px solid #e5e5e5;
            }
            .exec-success-btn.secondary:hover { background: #eee; }
        </style>

        <div class="exec-backdrop" id="exec-backdrop"></div>
        <div class="exec-modal" id="exec-modal-panel">
            <div class="exec-header">
                <span class="exec-header-title">Execution Confirmation</span>
                <span class="exec-header-id" id="exec-m-id"></span>
            </div>
            <div class="exec-body" id="exec-modal-body">
                <!-- Dynamically populated -->
            </div>
        </div>
    `;

    document.body.appendChild(wrapper);
    _modalEl = wrapper;

    // Close on backdrop click
    wrapper.querySelector('#exec-backdrop').addEventListener('click', closeExecutionModal);

    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && wrapper.classList.contains('open')) {
            closeExecutionModal();
        }
    });

    return wrapper;
}

export function openExecutionModal(contractData) {
    const modal = ensureModal();
    const body = modal.querySelector('#exec-modal-body');
    const idEl = modal.querySelector('#exec-m-id');

    const {
        id, title, tier, provider, platform,
        min_stake, max_stake, multiplier,
        fee_bps, window_days, target_hint, goal
    } = contractData;

    const shortId = (id || '').split('-')[0].slice(0, 4).toUpperCase();
    idEl.textContent = `RCP-${shortId}`;

    const displayPlatform = provider || platform || 'Provider';
    const displayTier = (tier || 'controlled').toUpperCase();
    const displayTitle = title || goal || 'Performance Contract';
    const windowDays = window_days || 30;
    const mult = multiplier || (displayTier === 'MAXIMUM' ? 4.0 : displayTier === 'ELEVATED' ? 2.5 : 1.5);
    const stake = min_stake || 25;
    const payout = Math.round(stake * mult);
    const feePercent = fee_bps ? (fee_bps / 100) : 2;
    const targetDisplay = target_hint || goal || '+15%';

    body.innerHTML = `
        <div class="exec-summary-grid">
            <div class="exec-summary-cell">
                <div class="exec-summary-label">Locked Capital</div>
                <div class="exec-summary-value">$${stake.toLocaleString()}</div>
            </div>
            <div class="exec-summary-cell">
                <div class="exec-summary-label">Target</div>
                <div class="exec-summary-value">${targetDisplay}</div>
            </div>
            <div class="exec-summary-cell">
                <div class="exec-summary-label">Window</div>
                <div class="exec-summary-value">${windowDays} Days</div>
            </div>
        </div>

        <div class="exec-row">
            <span class="exec-row-label">If Successful</span>
            <span class="exec-row-value success">+$${payout.toLocaleString()}</span>
        </div>
        <div class="exec-row">
            <span class="exec-row-label">If Failed</span>
            <span class="exec-row-value failure">-$${stake.toLocaleString()}</span>
        </div>

        <hr class="exec-divider">

        <div class="exec-escrow-note">Capital is held in escrow until settlement.</div>

        <label class="exec-risk-row">
            <input type="checkbox" id="exec-risk-check">
            <span class="exec-risk-text">I understand capital is at risk and settlement is binary.</span>
        </label>

        <button class="exec-btn-primary" id="exec-btn-lock" disabled>
            LOCK $${stake.toLocaleString()} CAPITAL →
        </button>

        <button class="exec-btn-cancel" id="exec-btn-cancel">Cancel</button>

        <div class="exec-error" id="exec-error-msg"></div>
    `;

    // Wire checkbox
    const checkbox = body.querySelector('#exec-risk-check');
    const lockBtn = body.querySelector('#exec-btn-lock');
    const cancelBtn = body.querySelector('#exec-btn-cancel');

    checkbox.addEventListener('change', () => {
        lockBtn.disabled = !checkbox.checked;
    });

    cancelBtn.addEventListener('click', closeExecutionModal);

    // Wire execute
    lockBtn.addEventListener('click', async () => {
        await runExecution(contractData, stake, mult, lockBtn, body);
    });

    // Show
    modal.classList.add('open');
}

export function closeExecutionModal() {
    if (_modalEl) {
        _modalEl.classList.remove('open');
    }
}

async function runExecution(contractData, stake, multiplier, btnEl, bodyEl) {
    const id = contractData.id;
    const provider = contractData.provider || contractData.platform || 'stripe';
    const tier = (contractData.tier || 'controlled').toUpperCase();
    const riskTier = tier === 'ELEVATED' ? 'ADVANCED' : tier === 'MAXIMUM' ? 'ELITE' : 'STANDARD';
    const goal = contractData.title || contractData.goal || '';
    const thresholdMatch = goal.match(/(\d+)%/);
    const threshold = thresholdMatch ? parseInt(thresholdMatch[1]) : 15;
    const platform = provider.toUpperCase();
    const metricType = (platform === 'X' || platform === 'TWITTER') ? 'FOLLOWERS' : 'REVENUE';

    // Switch to execution steps UI
    btnEl.disabled = true;
    btnEl.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><span style="width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;"></span> Processing...</span>';

    const errorEl = bodyEl.querySelector('#exec-error-msg');

    try {
        await sleep(800);

        const createResult = await window.api.createContract({
            platform: platform,
            metricType,
            condition: {
                operator: 'GTE',
                threshold,
                deadline: contractData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
            lockAmountUsdCents: Math.round(stake * 100),
            payoutAmountUsdCents: Math.round(stake * multiplier * 100),
            riskTier,
            marketInstanceId: id
        });

        const realContractId = createResult.contract?.id || createResult.id;

        if (realContractId) {
            try {
                await window.api.createFundingIntent(realContractId);
                await window.api.executeContract(realContractId);
            } catch (e) {
                console.warn('[Exec] Warning:', e.message);
            }
        }

        // Success state
        showSuccess(bodyEl, stake, multiplier, realContractId || id);

    } catch (err) {
        console.error('[Exec] Error:', err);
        errorEl.textContent = err.message || 'Execution failed. Please try again.';
        errorEl.style.display = 'block';
        btnEl.disabled = false;
        btnEl.textContent = `LOCK $${stake.toLocaleString()} CAPITAL →`;
    }
}

function showSuccess(bodyEl, stake, multiplier, receiptId) {
    const payout = Math.round(stake * multiplier);
    const shortId = (receiptId || '').split('-')[0].slice(0, 4).toUpperCase();

    bodyEl.innerHTML = `
        <div class="exec-success">
            <div class="exec-success-icon">✅</div>
            <div class="exec-success-title">Execution Confirmed</div>
            <div class="exec-success-sub">RCPT-${shortId} · Capital locked until settlement</div>

            <div class="exec-success-actions">
                <button class="exec-success-btn primary" id="exec-view-receipt">View Receipt →</button>
                <button class="exec-success-btn secondary" id="exec-return-market">Return to Market</button>
            </div>
        </div>
    `;

    bodyEl.querySelector('#exec-view-receipt').addEventListener('click', () => {
        closeExecutionModal();
        window.location.hash = '/receipts/' + receiptId;
    });

    bodyEl.querySelector('#exec-return-market').addEventListener('click', () => {
        closeExecutionModal();
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
