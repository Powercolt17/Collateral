// CAPITAL — Institutional Capital Control Terminal
// Redesigned from "Funding & Payouts" to match homepage contract grid aesthetic

export function renderFunding() {
    return `
        <style>
            /* ===================================================
               CAPITAL TERMINAL — INSTITUTIONAL DESIGN SYSTEM
               IBM Plex Sans / Mono · Sharp borders · Ledger-first
               =================================================== */
            .cap {
                background: #f9f9f9;
                min-height: calc(100vh - 72px);
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
            }

            .cap-inner {
                max-width: 860px;
                margin: 0 auto;
                padding: 40px 24px 80px;
            }

            /* ── Page Header ── */
            .cap-hdr {
                margin-bottom: 36px;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 16px;
            }
            .cap-hdr-left {}
            .cap-hdr-title {
                font-size: 28px;
                font-weight: 700;
                letter-spacing: -0.5px;
                color: #111111;
                margin: 0 0 4px;
            }
            .cap-hdr-sub {
                font-size: 13px;
                color: #444444;
                margin: 0;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.2px;
            }
            .cap-deposit-btn {
                padding: 10px 20px;
                background: #111;
                color: #fff;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                border: none;
                cursor: pointer;
                transition: background 0.15s;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                white-space: nowrap;
                flex-shrink: 0;
            }
            .cap-deposit-btn:hover { background: #752122; }

            /* ── Restriction Banner ── */
            .cap-alert {
                display: none;
                background: #fff8f8;
                border: 1px solid #fca5a5;
                border-left: 3px solid #752122;
                padding: 12px 16px;
                margin-bottom: 24px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                color: #752122;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .cap-alert.visible { display: block; }

            /* ── Overview Strip ── */
            .cap-overview {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                border: 1px solid #DCDCDC;
                background: #fff;
                margin-bottom: 24px;
            }
            .cap-stat {
                padding: 24px;
                border-right: 1px solid #E5E5E5;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .cap-stat:last-child { border-right: none; }
            .cap-stat-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #6B6B6B;
            }
            .cap-stat-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 26px;
                font-weight: 700;
                color: #111111;
                letter-spacing: -1px;
                line-height: 1;
            }
            .cap-stat-val.locked { color: #921818; }
            .cap-stat-val.pending { color: #1e40af; }
            .cap-stat-sub {
                font-size: 12px;
                color: #6B6B6B;
                line-height: 1.4;
            }

            /* ── Section Container ── */
            .cap-section {
                background: #fff;
                border: 1px solid #e5e5e5;
                margin-bottom: 16px;
            }
            .cap-section-hdr {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 20px;
                border-bottom: 1px solid #f0f0f0;
            }
            .cap-section-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: #888;
            }

            /* ── Source/Destination Row ── */
            .cap-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 18px 20px;
                border-bottom: 1px solid #f4f4f4;
                transition: background 0.1s;
            }
            .cap-row:last-child { border-bottom: none; }
            .cap-row:hover { background: #fafafa; }
            .cap-row-left {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .cap-row-label {
                font-size: 13px;
                font-weight: 600;
                color: #111;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .cap-row-detail {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                color: #666;
            }

            /* ── Status Badges ── */
            .cap-badge {
                display: inline-flex;
                align-items: center;
                padding: 2px 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-radius: 2px;
            }
            .cap-badge.verified {
                background: #f0fdf4;
                color: #15803d;
                border: 1px solid #bbf7d0;
            }
            .cap-badge.required {
                background: #fff7ed;
                color: #c2410c;
                border: 1px solid #fed7aa;
            }
            .cap-badge.pending-badge {
                background: #eff6ff;
                color: #1e40af;
                border: 1px solid #bfdbfe;
            }

            /* ── Action Links ── */
            .cap-action {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #666;
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px 0;
                transition: color 0.15s;
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .cap-action::before { content: '→'; }
            .cap-action:hover { color: #752122; }

            /* ── Footer (Bloomberg-style) ── */
            .cap-footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #f0f0f0;
                display: flex;
                gap: 32px;
            }
            .cap-footer-item {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .cap-footer-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #bbb;
            }
            .cap-footer-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #888;
            }
            .cap-footer-dot {
                display: inline-block;
                width: 6px;
                height: 6px;
                background: #15803d;
                border-radius: 50%;
                margin-right: 5px;
                vertical-align: middle;
            }

            @media (max-width: 640px) {
                .cap-overview { grid-template-columns: 1fr; }
                .cap-stat { border-right: none; border-bottom: 1px solid #e5e5e5; }
                .cap-stat:last-child { border-bottom: none; }
                .cap-hdr { flex-direction: column; align-items: flex-start; }
                .cap-footer { flex-wrap: wrap; gap: 20px; }
            }

            /* ===================================================
               MODAL SYSTEM — Institutional dialogs
               =================================================== */
            .cap-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.5);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 9000;
            }
            .cap-modal-overlay.open {
                display: flex;
            }
            .cap-modal {
                background: #fff;
                width: 100%;
                max-width: 440px;
                margin: 0 16px;
                border: 1px solid #e5e5e5;
                box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            }
            .cap-modal-hdr {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                border-bottom: 1px solid #f0f0f0;
            }
            .cap-modal-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #111;
            }
            .cap-modal-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #999;
                padding: 4px;
                display: flex;
                align-items: center;
            }
            .cap-modal-close:hover { color: #111; }
            .cap-modal-body {
                padding: 24px 20px;
            }
            .cap-modal-sub {
                font-size: 12px;
                color: #666;
                margin-bottom: 20px;
                font-family: 'JetBrains Mono', monospace;
            }
            .cap-modal-footer {
                padding: 12px 20px;
                border-top: 1px solid #f0f0f0;
                background: #fafafa;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #999;
                text-align: center;
            }

            /* Card element */
            .cap-card-el {
                border: 1px solid #e5e5e5;
                padding: 12px;
                margin-bottom: 16px;
                background: #fafafa;
            }
            .cap-card-el:focus-within { border-color: #bbb; background: #fff; }

            /* Error  */
            .cap-error {
                font-size: 11px;
                color: #752122;
                font-family: 'JetBrains Mono', monospace;
                margin-bottom: 12px;
                display: none;
            }
            .cap-error.visible { display: block; }

            /* Modal Buttons */
            .cap-btn-primary {
                width: 100%;
                padding: 12px;
                background: #111;
                color: #fff;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                border: none;
                cursor: pointer;
                transition: background 0.15s;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .cap-btn-primary:hover { background: #333; }
            .cap-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

            .cap-btn-danger {
                width: 100%;
                padding: 12px;
                background: #752122;
                color: #fff;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                border: none;
                cursor: pointer;
                transition: background 0.15s;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                margin-top: 8px;
            }
            .cap-btn-danger:hover { background: #5c1a1b; }
            .cap-btn-ghost {
                width: 100%;
                padding: 12px;
                background: transparent;
                color: #666;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                transition: all 0.15s;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .cap-btn-ghost:hover { border-color: #bbb; color: #111; }

            /* Add funds input */
            .cap-input-wrap {
                margin-bottom: 16px;
            }
            .cap-input-lbl {
                display: block;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                margin-bottom: 8px;
            }
            .cap-input-amt {
                position: relative;
            }
            .cap-input-prefix {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #666;
                font-family: 'JetBrains Mono', monospace;
                font-size: 16px;
            }
            .cap-input-amt input {
                width: 100%;
                padding: 12px 12px 12px 28px;
                border: 1px solid #e5e5e5;
                font-size: 22px;
                font-family: 'JetBrains Mono', monospace;
                color: #111;
                background: #fafafa;
                box-sizing: border-box;
                outline: none;
            }
            .cap-input-amt input:focus {
                border-color: #bbb;
                background: #fff;
            }

            /* Success modal */
            .cap-success-body {
                text-align: center;
                padding: 32px 24px;
            }
            .cap-success-icon {
                width: 48px;
                height: 48px;
                background: #f0fdf4;
                border: 1px solid #bbf7d0;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 16px;
                color: #15803d;
                font-size: 20px;
            }
            .cap-success-title {
                font-size: 16px;
                font-weight: 700;
                color: #111;
                margin: 0 0 8px;
            }
            .cap-success-amt {
                font-family: 'JetBrains Mono', monospace;
                font-size: 32px;
                font-weight: 700;
                color: #0a0a0a;
                margin: 12px 0 4px;
            }
            .cap-success-sub {
                font-size: 12px;
                color: #888;
                font-family: 'JetBrains Mono', monospace;
                margin-bottom: 24px;
            }
        </style>

        <div class="cap">
            <div class="cap-inner">

                <!-- Restriction Alert -->
                <div class="cap-alert" id="restriction-banner">
                    ⚠ ACCOUNT RESTRICTED — Payouts and new contracts are currently disabled.
                </div>

                <!-- Page Header -->
                <div class="cap-hdr">
                    <div class="cap-hdr-left">
                        <h1 class="cap-hdr-title">CAPITAL</h1>
                        <p class="cap-hdr-sub">Manage capital custody, allocation, and settlement.</p>
                    </div>
                    <button class="cap-deposit-btn" id="add-funds-btn">DEPOSIT CAPITAL</button>
                </div>

                <!-- Capital Overview Strip -->
                <div class="cap-overview">
                    <div class="cap-stat">
                        <div class="cap-stat-lbl">Available Capital</div>
                        <div class="cap-stat-val" id="available-balance">$0.00</div>
                        <div class="cap-stat-sub">Undeployed. Ready to lock.</div>
                    </div>
                    <div class="cap-stat">
                        <div class="cap-stat-lbl">Locked in Contracts</div>
                        <div class="cap-stat-val locked" id="locked-balance">$0.00</div>
                        <div class="cap-stat-sub">Actively committed and at risk.</div>
                    </div>
                    <div class="cap-stat">
                        <div class="cap-stat-lbl">Pending Settlement</div>
                        <div class="cap-stat-val pending" id="pending-payout">$0.00</div>
                        <div class="cap-stat-sub">Released. Transfer in progress.</div>
                    </div>
                </div>

                <!-- Funding Sources -->
                <div class="cap-section">
                    <div class="cap-section-hdr">
                        <span class="cap-section-title">Funding Sources</span>
                    </div>

                    <!-- Card Source -->
                    <div class="cap-row" id="source-card">
                        <div class="cap-row-left">
                            <div class="cap-row-label">
                                <i data-lucide="credit-card" style="width:14px;height:14px;color:#999;"></i>
                                Card
                                <span id="card-badge"></span>
                            </div>
                            <div class="cap-row-detail" id="card-status">Loading...</div>
                        </div>
                        <button class="cap-action" id="manage-card-btn">UPDATE</button>
                    </div>

                    <!-- Bank Source -->
                    <div class="cap-row" id="source-bank">
                        <div class="cap-row-left">
                            <div class="cap-row-label">
                                <i data-lucide="landmark" style="width:14px;height:14px;color:#999;"></i>
                                Bank Account
                                <span class="cap-badge required" id="bank-badge">REQUIRED</span>
                            </div>
                            <div class="cap-row-detail" id="bank-status">Not configured</div>
                        </div>
                        <button class="cap-action" id="manage-bank-btn">CONFIGURE</button>
                    </div>
                </div>

                <!-- Payout Destinations -->
                <div class="cap-section">
                    <div class="cap-section-hdr">
                        <span class="cap-section-title">Settlement Destinations</span>
                    </div>
                    <div class="cap-row" id="destination-bank">
                        <div class="cap-row-left">
                            <div class="cap-row-label">
                                <i data-lucide="building-2" style="width:14px;height:14px;color:#999;"></i>
                                Bank Account
                                <span id="payout-last-four"></span>
                            </div>
                            <div class="cap-row-detail" id="payout-status">Loading...</div>
                        </div>
                        <button class="cap-action" id="manage-payout-btn">CONFIGURE</button>
                    </div>
                    <div style="padding: 10px 20px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #bbb; border-top: 1px solid #f4f4f4;">
                        Payouts execute only after contract settlement and clearance.
                    </div>
                </div>

                <!-- Bloomberg Footer -->
                <div class="cap-footer">
                    <div class="cap-footer-item">
                        <span class="cap-footer-lbl">System Status</span>
                        <span class="cap-footer-val"><span class="cap-footer-dot"></span>OPERATIONAL</span>
                    </div>
                    <div class="cap-footer-item">
                        <span class="cap-footer-lbl">Custody</span>
                        <span class="cap-footer-val">Stripe Connect</span>
                    </div>
                    <div class="cap-footer-item">
                        <span class="cap-footer-lbl">Settlement</span>
                        <span class="cap-footer-val">Automated</span>
                    </div>
                    <div class="cap-footer-item">
                        <span class="cap-footer-lbl">Jurisdiction</span>
                        <span class="cap-footer-val">US / Regulated</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== CARD MODAL ===== -->
        <div id="card-modal" class="cap-modal-overlay">
            <div class="cap-modal">
                <div class="cap-modal-hdr">
                    <span class="cap-modal-title">Add Funding Method</span>
                    <button id="close-card-modal" class="cap-modal-close">
                        <i data-lucide="x" style="width:16px;height:16px;"></i>
                    </button>
                </div>
                <div class="cap-modal-body">
                    <!-- Apple Pay / Google Pay -->
                    <div id="wallet-pay-section" style="display:none;">
                        <div id="payment-request-button" style="margin-bottom:16px;"></div>
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                            <div style="flex:1;height:1px;background:#e5e5e5;"></div>
                            <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:0.1em;">or enter card</span>
                            <div style="flex:1;height:1px;background:#e5e5e5;"></div>
                        </div>
                    </div>
                    <p class="cap-modal-sub">Verify a card to use as your funding instrument.</p>
                    <div class="cap-card-el" id="card-element-container"></div>
                    <div class="cap-error" id="card-error"></div>
                    <button class="cap-btn-primary" id="submit-card-btn">VERIFY &amp; SAVE CARD</button>
                </div>
                <div class="cap-modal-footer">
                    Payment method is verified but not charged until capital is locked.
                </div>
            </div>
        </div>

        <!-- ===== REMOVE CARD MODAL ===== -->
        <div id="remove-card-modal" class="cap-modal-overlay">
            <div class="cap-modal">
                <div class="cap-modal-hdr">
                    <span class="cap-modal-title">Remove Funding Card</span>
                </div>
                <div class="cap-modal-body">
                    <p class="cap-modal-sub">This will remove your verified funding source. A new card must be added before locking capital.</p>
                    <button class="cap-btn-ghost" id="cancel-remove-btn">CANCEL</button>
                    <button class="cap-btn-danger" id="confirm-remove-btn">REMOVE CARD</button>
                </div>
            </div>
        </div>

        <!-- ===== DEPOSIT CAPITAL MODAL ===== -->
        <div id="add-funds-modal" class="cap-modal-overlay">
            <div class="cap-modal">
                <div class="cap-modal-hdr">
                    <span class="cap-modal-title">Deposit Capital</span>
                    <button id="close-add-funds-modal" class="cap-modal-close">
                        <i data-lucide="x" style="width:16px;height:16px;"></i>
                    </button>
                </div>
                <div class="cap-modal-body">
                    <p class="cap-modal-sub">Allocate capital to your available balance.</p>
                    <div class="cap-input-wrap">
                        <label class="cap-input-lbl">AMOUNT_USD</label>
                        <div class="cap-input-amt">
                            <span class="cap-input-prefix">$</span>
                            <input id="add-funds-amount" type="number" min="1" step="1" placeholder="0">
                        </div>
                    </div>
                    <div class="cap-error" id="add-funds-error"></div>
                    <button class="cap-btn-primary" id="submit-add-funds-btn">DEPOSIT CAPITAL</button>
                </div>
                <div class="cap-modal-footer">Charged immediately to your verified card.</div>
            </div>
        </div>

        <!-- ===== SUCCESS MODAL ===== -->
        <div id="success-modal" class="cap-modal-overlay">
            <div class="cap-modal">
                <div class="cap-success-body">
                    <div class="cap-success-icon">✓</div>
                    <h3 class="cap-success-title">Capital Deposited</h3>
                    <div class="cap-success-amt" id="success-amount">$0.00</div>
                    <p class="cap-success-sub">Added to your available balance</p>
                    <button class="cap-btn-primary" id="success-modal-close">CONTINUE</button>
                </div>
            </div>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════
// Helper
// ═══════════════════════════════════════════════════════
function formatUSD(cents) {
    const dollars = cents / 100;
    return '$' + dollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Stripe instance (module-level)
let stripe = null;
let cardElement = null;

// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
export async function initFunding() {
    if (window.lucide) window.lucide.createIcons();

    // Initialize Stripe.js
    const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    const isProduction = window.location.hostname === 'collateral.market';

    if (!isProduction) {
        console.log('[Capital] Stripe key:', STRIPE_PUBLISHABLE_KEY ? 'present' : 'MISSING');
    }

    if (window.Stripe && STRIPE_PUBLISHABLE_KEY && !STRIPE_PUBLISHABLE_KEY.includes('placeholder')) {
        try {
            stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
        } catch (stripeErr) {
            console.error('[Capital] Failed to initialize Stripe:', stripeErr);
        }
    }

    // ── DOM refs ──
    const cardStatusEl = document.getElementById('card-status');
    const bankStatusEl = document.getElementById('bank-status');
    const payoutStatusEl = document.getElementById('payout-status');
    const payoutLastFourEl = document.getElementById('payout-last-four');
    const availableBalanceEl = document.getElementById('available-balance');
    const lockedBalanceEl = document.getElementById('locked-balance');
    const pendingPayoutEl = document.getElementById('pending-payout');
    const manageCardBtn = document.getElementById('manage-card-btn');
    const manageBankBtn = document.getElementById('manage-bank-btn');
    const managePayoutBtn = document.getElementById('manage-payout-btn');
    const addFundsBtn = document.getElementById('add-funds-btn');
    const cardBadgeEl = document.getElementById('card-badge');
    const bankBadgeEl = document.getElementById('bank-badge');

    // Modal refs
    const cardModal = document.getElementById('card-modal');
    const closeCardModalBtn = document.getElementById('close-card-modal');
    const submitCardBtn = document.getElementById('submit-card-btn');
    const cardErrorEl = document.getElementById('card-error');
    const removeCardModal = document.getElementById('remove-card-modal');
    const cancelRemoveBtn = document.getElementById('cancel-remove-btn');
    const confirmRemoveBtn = document.getElementById('confirm-remove-btn');
    const addFundsModal = document.getElementById('add-funds-modal');
    const closeAddFundsBtn = document.getElementById('close-add-funds-modal');
    const addFundsAmountInput = document.getElementById('add-funds-amount');
    const addFundsErrorEl = document.getElementById('add-funds-error');
    const submitAddFundsBtn = document.getElementById('submit-add-funds-btn');
    const successModal = document.getElementById('success-modal');
    const successAmountEl = document.getElementById('success-amount');
    const successCloseBtn = document.getElementById('success-modal-close');

    let currentCardStatus = null;

    // ── Modal helpers ──
    function openModal(el) { el?.classList.add('open'); }
    function closeModal(el) { el?.classList.remove('open'); }

    // ── Success modal ──
    function showSuccessModal(amount) {
        successAmountEl.textContent = `$${amount.toFixed(2)}`;
        openModal(successModal);
    }
    successCloseBtn?.addEventListener('click', () => closeModal(successModal));
    successModal?.addEventListener('click', (e) => { if (e.target === successModal) closeModal(successModal); });

    // ── Load billing status ──
    async function loadBillingStatus() {
        try {
            const billingStatus = await window.api.getBillingStatus();

            if (billingStatus?.identityStatus === 'SUSPENDED') {
                document.getElementById('restriction-banner')?.classList.add('visible');
                [manageCardBtn, manageBankBtn, addFundsBtn].forEach(b => { if (b) { b.disabled = true; b.style.opacity = '0.3'; } });
            }

            if (billingStatus?.fundingSource) {
                const fs = billingStatus.fundingSource;
                currentCardStatus = fs.status;

                if (fs.status === 'verified') {
                    const brand = fs.brand?.toUpperCase() || 'CARD';
                    const last4 = fs.last4 || '****';
                    const exp = fs.expMonth && fs.expYear ? `${String(fs.expMonth).padStart(2, '0')}/${String(fs.expYear).slice(-2)}` : '';
                    cardStatusEl.textContent = `${brand} •••• ${last4}${exp ? '  ·  exp ' + exp : ''}`;
                    if (cardBadgeEl) cardBadgeEl.innerHTML = '<span class="cap-badge verified">VERIFIED</span>';
                    if (manageCardBtn) manageCardBtn.textContent = 'REMOVE';
                } else if (fs.status === 'pending_verification') {
                    cardStatusEl.textContent = 'Verification pending';
                    if (cardBadgeEl) cardBadgeEl.innerHTML = '<span class="cap-badge pending-badge">PENDING</span>';
                } else {
                    cardStatusEl.textContent = 'Not configured';
                    if (cardBadgeEl) cardBadgeEl.innerHTML = '<span class="cap-badge required">REQUIRED</span>';
                }
            } else {
                cardStatusEl.textContent = 'Not configured';
                if (cardBadgeEl) cardBadgeEl.innerHTML = '<span class="cap-badge required">REQUIRED</span>';
            }

            if (billingStatus?.payoutDestination?.connected) {
                bankStatusEl.textContent = 'Configured';
                if (bankBadgeEl) { bankBadgeEl.className = 'cap-badge verified'; bankBadgeEl.textContent = 'ACTIVE'; }
                payoutStatusEl.textContent = 'Connected';
            } else {
                bankStatusEl.textContent = 'Not configured';
                payoutStatusEl.textContent = 'Not configured';
            }

            if (billingStatus?.balances) {
                availableBalanceEl.textContent = formatUSD(billingStatus.balances.availableBalanceUsdCents || 0);
                lockedBalanceEl.textContent = formatUSD(billingStatus.balances.lockedBalanceUsdCents || 0);
                pendingPayoutEl.textContent = formatUSD(billingStatus.balances.pendingPayoutUsdCents || 0);
            }

        } catch (err) {
            console.error('[Capital] Error loading billing status:', err);
            cardStatusEl.textContent = 'Error loading';
        }
    }

    async function loadContractBalances() {
        try {
            const response = await window.api.getContracts();
            const contracts = response?.contracts || [];

            const lockedStates = ['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED', 'FUNDS_LOCKED', 'VERIFIED', 'VERIFYING'];
            const pendingPayoutStates = ['SETTLED', 'PAYOUT_PENDING'];

            const lockedCents = contracts
                .filter(c => lockedStates.includes(c.derivedState))
                .reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);

            const pendingCents = contracts
                .filter(c => pendingPayoutStates.includes(c.derivedState))
                .reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);

            if (lockedCents > 0) lockedBalanceEl.textContent = formatUSD(lockedCents);
            if (pendingCents > 0) pendingPayoutEl.textContent = formatUSD(pendingCents);

        } catch (err) {
            console.error('[Capital] Error loading contracts:', err);
        }
    }

    // ── Card Modal ──
    let walletInitialized = false;
    function showCardModal() {
        openModal(cardModal);
        if (stripe && !cardElement) {
            const elements = stripe.elements();
            cardElement = elements.create('card', {
                style: {
                    base: {
                        fontSize: '15px',
                        color: '#111',
                        fontFamily: "'JetBrains Mono', monospace",
                        '::placeholder': { color: '#bbb' },
                    },
                    invalid: { color: '#752122' },
                },
            });
            cardElement.mount('#card-element-container');
            cardElement.on('change', (event) => {
                if (event.error) {
                    cardErrorEl.textContent = event.error.message;
                    cardErrorEl.classList.add('visible');
                } else {
                    cardErrorEl.classList.remove('visible');
                }
            });
        }

        // ── Apple Pay / Google Pay (Payment Request Button) ──
        if (stripe && !walletInitialized) {
            walletInitialized = true;
            const paymentRequest = stripe.paymentRequest({
                country: 'US',
                currency: 'usd',
                total: { label: 'Collateral — Verify Payment Method', amount: 0 },
                requestPayerName: true,
                requestPayerEmail: true,
            });

            const prButton = stripe.elements().create('paymentRequestButton', {
                paymentRequest,
                style: {
                    paymentRequestButton: {
                        type: 'default',
                        theme: 'dark',
                        height: '48px',
                    },
                },
            });

            paymentRequest.canMakePayment().then((result) => {
                if (result) {
                    const walletSection = document.getElementById('wallet-pay-section');
                    if (walletSection) walletSection.style.display = 'block';
                    prButton.mount('#payment-request-button');
                    console.log('[Capital] Wallet payment available:', result.applePay ? 'Apple Pay' : 'Google Pay');
                } else {
                    console.log('[Capital] No wallet payment available (Apple Pay / Google Pay)');
                }
            });

            // When user authenticates with Apple Pay / Google Pay
            paymentRequest.on('paymentmethod', async (ev) => {
                try {
                    const siResponse = await window.api.createCardSetupIntent();
                    if (!siResponse?.clientSecret) {
                        ev.complete('fail');
                        return;
                    }

                    const { setupIntent, error } = await stripe.confirmCardSetup(
                        siResponse.clientSecret,
                        { payment_method: ev.paymentMethod.id },
                        { handleActions: false }
                    );

                    if (error) {
                        ev.complete('fail');
                        cardErrorEl.textContent = error.message;
                        cardErrorEl.classList.add('visible');
                        return;
                    }

                    ev.complete('success');

                    if (setupIntent.status === 'succeeded') {
                        await window.api.confirmCard(setupIntent.id, setupIntent.payment_method);
                        closeModal(cardModal);
                        await loadBillingStatus();
                    } else if (setupIntent.status === 'requires_action') {
                        const { error: actionError } = await stripe.confirmCardSetup(siResponse.clientSecret);
                        if (actionError) {
                            cardErrorEl.textContent = actionError.message;
                            cardErrorEl.classList.add('visible');
                        } else {
                            await window.api.confirmCard(setupIntent.id, setupIntent.payment_method);
                            closeModal(cardModal);
                            await loadBillingStatus();
                        }
                    }
                } catch (err) {
                    ev.complete('fail');
                    cardErrorEl.textContent = err.message || 'Wallet verification failed.';
                    cardErrorEl.classList.add('visible');
                }
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    async function submitCard() {
        if (!stripe || !cardElement) {
            const reason = !window.Stripe ? 'Stripe.js not loaded'
                : !stripe ? 'VITE_STRIPE_PUBLISHABLE_KEY missing'
                    : 'Card element not ready';
            cardErrorEl.textContent = `${reason}. Contact support.`;
            cardErrorEl.classList.add('visible');
            return;
        }

        submitCardBtn.disabled = true;
        submitCardBtn.textContent = 'VERIFYING...';
        cardErrorEl.classList.remove('visible');

        try {
            const siResponse = await window.api.createCardSetupIntent();
            if (!siResponse?.clientSecret) throw new Error('Failed to create setup intent');
            if (!siResponse.clientSecret.includes('_secret_')) throw new Error('Invalid setup intent format');

            const { setupIntent, error } = await stripe.confirmCardSetup(siResponse.clientSecret, {
                payment_method: { card: cardElement },
            });

            if (error) throw new Error(error.message);

            if (setupIntent.status === 'succeeded') {
                await window.api.confirmCard(setupIntent.id, setupIntent.payment_method);
                closeModal(cardModal);
                await loadBillingStatus();
            } else if (setupIntent.status === 'requires_action') {
                cardErrorEl.textContent = 'Additional authentication required.';
                cardErrorEl.classList.add('visible');
            }
        } catch (err) {
            cardErrorEl.textContent = err.message || 'Verification failed. Please retry.';
            cardErrorEl.classList.add('visible');
        } finally {
            submitCardBtn.disabled = false;
            submitCardBtn.textContent = 'VERIFY & SAVE CARD';
        }
    }

    async function removeCard() {
        confirmRemoveBtn.disabled = true;
        confirmRemoveBtn.textContent = 'REMOVING...';
        try {
            await window.api.removeCard();
            closeModal(removeCardModal);
            await loadBillingStatus();
        } catch (err) {
            alert('Failed to remove card: ' + (err.message || 'Unknown error'));
        } finally {
            confirmRemoveBtn.disabled = false;
            confirmRemoveBtn.textContent = 'REMOVE CARD';
        }
    }

    // ── Add Funds ──
    async function submitAddFunds() {
        const amount = parseFloat(addFundsAmountInput.value);
        if (!amount || amount < 1) {
            addFundsErrorEl.textContent = 'MIN_AMOUNT: $1.00';
            addFundsErrorEl.classList.add('visible');
            return;
        }
        submitAddFundsBtn.disabled = true;
        submitAddFundsBtn.textContent = 'PROCESSING...';
        addFundsErrorEl.classList.remove('visible');
        try {
            const result = await window.api.addFunds(Math.round(amount * 100));
            if (result.error) throw new Error(result.error);
            closeModal(addFundsModal);
            await loadBillingStatus();
            showSuccessModal(amount);
        } catch (err) {
            addFundsErrorEl.textContent = err.message || 'Deposit failed. Retry.';
            addFundsErrorEl.classList.add('visible');
        } finally {
            submitAddFundsBtn.disabled = false;
            submitAddFundsBtn.textContent = 'DEPOSIT CAPITAL';
        }
    }

    // ── Event Wiring ──
    manageCardBtn?.addEventListener('click', () => {
        if (currentCardStatus === 'verified') {
            openModal(removeCardModal);
        } else {
            showCardModal();
        }
    });
    manageBankBtn?.addEventListener('click', () => window.app?.setupPayout?.());
    managePayoutBtn?.addEventListener('click', () => window.app?.setupPayout?.());

    closeCardModalBtn?.addEventListener('click', () => closeModal(cardModal));
    cardModal?.addEventListener('click', (e) => { if (e.target === cardModal) closeModal(cardModal); });
    submitCardBtn?.addEventListener('click', submitCard);

    cancelRemoveBtn?.addEventListener('click', () => closeModal(removeCardModal));
    confirmRemoveBtn?.addEventListener('click', removeCard);
    removeCardModal?.addEventListener('click', (e) => { if (e.target === removeCardModal) closeModal(removeCardModal); });

    addFundsBtn?.addEventListener('click', () => {
        addFundsAmountInput.value = '';
        addFundsErrorEl.classList.remove('visible');
        openModal(addFundsModal);
    });
    closeAddFundsBtn?.addEventListener('click', () => closeModal(addFundsModal));
    addFundsModal?.addEventListener('click', (e) => { if (e.target === addFundsModal) closeModal(addFundsModal); });
    submitAddFundsBtn?.addEventListener('click', submitAddFunds);
    addFundsAmountInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAddFunds(); });

    // ── Load ──
    await loadBillingStatus();
    await loadContractBalances();
}
