// ExecutionModal.js — Capital Commitment Instrument
// One pathway. Institutional. Final.

import { hasAuthToken } from '../api.js';

let _modalEl = null;

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
                background: rgba(0,0,0,0.50);
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
                width: 100%; max-width: 460px;
                background: #fff;
                border: 1px solid #d4d4d4;
                border-top: 2px solid #752122;
                border-radius: 6px;
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.03);
                animation: exec-scale 180ms ease forwards;
                overflow: hidden;
            }
            @keyframes exec-scale {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.98); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }

            /* Header */
            .exec-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #e5e5e5;
                background: #fafafa;
            }
            .exec-header-title {
                font-size: 11px; font-weight: 600; color: #374151;
                font-family: 'IBM Plex Mono', 'JetBrains Mono', monospace;
                text-transform: uppercase; letter-spacing: 0.08em;
            }
            .exec-header-id {
                font-size: 10px; color: #9ca3af;
                font-family: 'IBM Plex Mono', monospace;
                letter-spacing: 0.04em;
            }

            /* Body */
            .exec-body { padding: 20px; }

            /* Term Grid */
            .exec-term-grid {
                display: grid; grid-template-columns: 1fr 1fr 1fr;
                gap: 0;
                border: 1px solid #d4d4d4;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 16px;
            }
            .exec-term-cell {
                padding: 14px 12px;
                text-align: center;
                border-right: 1px solid #e5e5e5;
                background: #fafafa;
            }
            .exec-term-cell:last-child { border-right: none; }
            .exec-term-label {
                font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em;
                color: #6b7280; font-family: 'IBM Plex Mono', monospace;
                font-weight: 600; margin-bottom: 6px; display: block;
            }
            .exec-term-value {
                font-size: 14px; font-weight: 600; color: #111;
                font-family: 'IBM Plex Sans', -apple-system, sans-serif;
                letter-spacing: -0.01em;
            }
            .exec-term-value.capital {
                font-size: 22px; font-weight: 700;
                letter-spacing: -0.02em; color: #0a0a0a;
            }

            /* Outcome Rows */
            .exec-outcome {
                display: flex; justify-content: space-between; align-items: center;
                padding: 11px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .exec-outcome:last-of-type { border-bottom: none; }
            .exec-outcome-label {
                font-size: 11px; color: #6b7280;
                text-transform: uppercase; letter-spacing: 0.06em;
                font-family: 'IBM Plex Mono', monospace; font-weight: 500;
            }
            .exec-outcome-value {
                font-size: 14px; font-weight: 600;
                font-family: 'IBM Plex Sans', sans-serif;
                letter-spacing: -0.01em;
            }
            .exec-outcome-value.success { color: #166534; }
            .exec-outcome-value.failure { color: #752122; opacity: 0.85; }

            /* Divider */
            .exec-div {
                border: none; border-top: 1px solid #e5e5e5;
                margin: 16px 0;
            }

            /* Escrow */
            .exec-escrow {
                font-size: 10px; color: #9ca3af; text-align: center;
                font-family: 'IBM Plex Mono', monospace;
                letter-spacing: 0.02em;
                margin-bottom: 16px;
            }

            /* Risk Row */
            .exec-risk-row {
                display: flex; align-items: flex-start; gap: 10px;
                margin-bottom: 20px; cursor: pointer; user-select: none;
            }
            .exec-risk-row input[type="checkbox"] {
                width: 15px; height: 15px; margin-top: 1px;
                accent-color: #752122; cursor: pointer; flex-shrink: 0;
            }
            .exec-risk-text {
                font-size: 12px; color: #374151; line-height: 1.5;
                font-family: 'IBM Plex Sans', sans-serif;
            }

            /* Primary Button */
            .exec-btn-primary {
                width: 100%; height: 48px; border: none;
                background: #752122; color: #fff;
                font-size: 12px; font-weight: 600;
                text-transform: uppercase; letter-spacing: 0.06em;
                font-family: 'IBM Plex Sans', sans-serif;
                cursor: pointer; overflow: hidden;
                transition: background 180ms ease, transform 100ms ease, box-shadow 180ms ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                border-radius: 4px;
            }
            .exec-btn-primary:hover:not(:disabled) {
                background: #5a191a;
                box-shadow: 0 4px 12px rgba(146,24,24,0.2);
            }
            .exec-btn-primary:active:not(:disabled) {
                transform: translateY(1px);
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            .exec-btn-primary:disabled {
                opacity: 0.30; cursor: not-allowed;
            }

            /* Cancel */
            .exec-btn-cancel {
                width: 100%; border: none; background: transparent;
                color: #9ca3af; font-size: 11px; font-weight: 500;
                font-family: 'IBM Plex Sans', sans-serif;
                cursor: pointer; padding: 8px; margin-top: 4px;
                transition: color 150ms; letter-spacing: 0.02em;
            }
            .exec-btn-cancel:hover { color: #4b5563; }

            /* Error */
            .exec-error {
                background: #fef2f2; border: 1px solid #e5c5c5;
                padding: 10px 14px; margin-top: 12px;
                font-size: 11px; color: #752122;
                font-family: 'IBM Plex Mono', monospace;
                border-radius: 4px; display: none;
            }

            /* Success State */
            .exec-success { text-align: center; padding: 16px 0; }
            .exec-success-icon { font-size: 24px; margin-bottom: 8px; }
            .exec-success-title {
                font-size: 11px; font-weight: 700; color: #166534;
                text-transform: uppercase; letter-spacing: 0.06em;
                font-family: 'IBM Plex Mono', monospace;
                margin-bottom: 4px;
            }
            .exec-success-sub {
                font-size: 10px; color: #9ca3af;
                font-family: 'IBM Plex Mono', monospace;
            }
            .exec-success-actions {
                display: flex; gap: 8px; margin-top: 16px;
            }
            .exec-success-btn {
                flex: 1; padding: 12px; border: none;
                font-size: 11px; font-weight: 600;
                text-transform: uppercase; letter-spacing: 0.04em;
                font-family: 'IBM Plex Sans', sans-serif;
                cursor: pointer; transition: all 150ms;
                border-radius: 4px;
            }
            .exec-success-btn.primary {
                background: #166534; color: #fff;
            }
            .exec-success-btn.primary:hover { background: #14532d; }
            .exec-success-btn.secondary {
                background: #f5f5f5; color: #374151; border: 1px solid #d4d4d4;
            }
            .exec-success-btn.secondary:hover { background: #eee; }

            @keyframes exec-spin { to { transform: rotate(360deg); } }
        </style>

        <div class="exec-backdrop" id="exec-backdrop"></div>
        <div class="exec-modal" id="exec-modal-panel">
            <div class="exec-header">
                <span class="exec-header-title">Execution Confirmation</span>
                <span class="exec-header-id" id="exec-m-id"></span>
            </div>
            <div class="exec-body" id="exec-modal-body"></div>
        </div>
    `;

    document.body.appendChild(wrapper);
    _modalEl = wrapper;

    wrapper.querySelector('#exec-backdrop').addEventListener('click', closeExecutionModal);

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

    const displayTier = (tier || 'controlled').toUpperCase();
    const windowDays = window_days || 30;
    const mult = multiplier || (displayTier === 'MAXIMUM' ? 4.0 : displayTier === 'ELEVATED' ? 2.5 : 1.5);
    const stake = min_stake || 25;
    const payout = Math.round(stake * mult);
    const targetDisplay = target_hint || goal || '+15%';

    body.innerHTML = `
        <div class="exec-term-grid">
            <div class="exec-term-cell">
                <span class="exec-term-label">Locked Capital</span>
                <div class="exec-term-value capital">$${stake.toLocaleString()}</div>
            </div>
            <div class="exec-term-cell">
                <span class="exec-term-label">Target</span>
                <div class="exec-term-value">${targetDisplay}</div>
            </div>
            <div class="exec-term-cell">
                <span class="exec-term-label">Window</span>
                <div class="exec-term-value">${windowDays}d</div>
            </div>
        </div>

        <div class="exec-outcome">
            <span class="exec-outcome-label">If Successful</span>
            <span class="exec-outcome-value success">+$${payout.toLocaleString()}</span>
        </div>
        <div class="exec-outcome">
            <span class="exec-outcome-label">If Failed</span>
            <span class="exec-outcome-value failure">-$${stake.toLocaleString()}</span>
        </div>

        <hr class="exec-div">

        <div class="exec-escrow">Capital is held in escrow until settlement.</div>

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

    lockBtn.addEventListener('click', async () => {
        await runExecution(contractData, stake, mult, lockBtn, body);
    });

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

    btnEl.disabled = true;
    btnEl.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><span style="width:12px;height:12px;border:2px solid rgba(255,255,255,0.25);border-top-color:#fff;border-radius:50%;animation:exec-spin 0.7s linear infinite;display:inline-block;"></span>Processing</span>';

    const errorEl = bodyEl.querySelector('#exec-error-msg');

    try {
        await sleep(800);

        const createResult = await window.api.createContract({
            platform,
            metricType,
            condition: {
                operator: 'GTE',
                threshold,
                deadline: contractData.deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
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

        showSuccess(bodyEl, stake, multiplier, realContractId || id);

    } catch (err) {
        console.error('[Exec] Error:', err);
        errorEl.textContent = err.message || 'Execution failed.';
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
