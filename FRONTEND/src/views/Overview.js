// Overview — Collateral Execution Queue
// ALL contracts are percentage growth from baseline
// Social (X) = Follower % growth, Sales/Commerce/Finance = Revenue % growth
// Tiers: Controlled (~30% win), Elevated (~20% win), Maximum (~10% win)
// HARD GATE: Minimum baseline required per tier — no starting from zero
// EVERY BUTTON IS LIVE — tabs, pills, CTAs, modal, search, sort

export function renderOverview() {
    return `
        <style>
            .eq {
                background: #fafafa;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, sans-serif;
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
                font-size: 22px;
                font-weight: 600;
                color: #0a0a0a;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .eq-stat-label {
                font-size: 10px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 2px;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-controls { display: flex; gap: 8px; align-items: center; }

            /* Search */
            .eq-search {
                padding: 7px 12px;
                font-size: 12px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                outline: none;
                width: 180px;
                font-family: 'Inter', sans-serif;
                color: #333;
                transition: border-color 0.15s;
            }
            .eq-search:focus { border-color: #8B1818; }
            .eq-search::placeholder { color: #aaa; }

            /* Sort */
            .eq-sort {
                padding: 7px 12px;
                font-size: 11px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                background: #fff;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                color: #555;
                outline: none;
            }
            .eq-sort:focus { border-color: #8B1818; }

            .eq-rules-btn {
                padding: 8px 14px;
                font-size: 11px;
                font-weight: 500;
                color: #666;
                background: #fff;
                border: 1px solid #e0e0e0;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
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
                padding: 14px 20px;
                font-size: 12px;
                font-weight: 500;
                color: #888;
                background: transparent;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                transition: color 0.15s;
                position: relative;
            }
            .eq-tab:hover { color: #333; }
            .eq-tab.active { color: #0a0a0a; border-bottom-color: #8B1818; }
            .eq-tab-count {
                font-size: 9px;
                background: #eee;
                color: #666;
                padding: 1px 5px;
                border-radius: 8px;
                margin-left: 6px;
                font-weight: 600;
            }
            .eq-tab.active .eq-tab-count { background: #8B1818; color: #fff; }

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
                font-size: 10px;
                color: #999;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
                margin-right: 4px;
            }
            .eq-pill {
                padding: 5px 12px;
                font-size: 11px;
                color: #555;
                background: #f5f5f5;
                border: 1px solid #eee;
                border-radius: 999px;
                cursor: pointer;
                transition: all 0.15s;
                font-family: 'Inter', sans-serif;
            }
            .eq-pill:hover { border-color: #ccc; }
            .eq-pill.active { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }

            /* Integration indicator */
            .eq-card-integration {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                font-size: 10px;
                color: #888;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
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
                border-radius: 12px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .eq-card:hover {
                border-color: #ccc;
                box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                transform: translateY(-1px);
            }
            .eq-card.hidden-card { display: none; }

            .eq-card-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .eq-card-id {
                font-size: 10px;
                color: #aaa;
                font-family: 'JetBrains Mono', monospace;
            }

            /* Status badge */
            .eq-badge {
                font-size: 10px;
                font-weight: 600;
                padding: 3px 10px;
                border-radius: 999px;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.3px;
                text-transform: uppercase;
            }
            .eq-badge.active { background: #f0fdf4; color: #166534; }
            .eq-badge.action { background: #fef2f2; color: #8B1818; }
            .eq-badge.verifying { background: #eff6ff; color: #1e40af; }
            .eq-badge.settled { background: #f5f5f5; color: #666; }

            /* Tier badge */
            .eq-tier {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 10px;
                font-weight: 600;
                padding: 3px 10px;
                border-radius: 999px;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.3px;
                text-transform: uppercase;
            }
            .eq-tier.controlled { background: #f0fdf4; color: #166534; }
            .eq-tier.elevated { background: #fffbeb; color: #92400e; }
            .eq-tier.maximum { background: #fef2f2; color: #8B1818; }
            .eq-tier-rate { font-weight: 400; opacity: 0.7; }

            /* Card content */
            .eq-card-goal {
                font-size: 17px;
                font-weight: 600;
                color: #0a0a0a;
                line-height: 1.3;
                font-family: 'IBM Plex Sans', sans-serif;
            }

            .eq-card-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .eq-card-baseline {
                font-size: 10px;
                color: #999;
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
                color: #0a0a0a;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .eq-card-stake-label {
                font-size: 10px;
                color: #999;
                font-weight: 400;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-card-time {
                font-size: 12px;
                color: #888;
                font-family: 'JetBrains Mono', monospace;
            }

            .eq-card-cta {
                width: 100%;
                padding: 12px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: none;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                border-radius: 8px;
                transition: all 0.15s;
            }
            .eq-card-cta.primary { background: #8B1818; color: #fff; }
            .eq-card-cta.primary:hover { background: #6B1212; }
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
            .eq-rule-row input[type="checkbox"] { width: 16px; height: 16px; accent-color: #8B1818; cursor: pointer; }
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
            .eq-threshold-table .tier-maximum { color: #8B1818; font-weight: 600; }

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
                accent-color: #8B1818;
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

            /* ============ EXPAND-IN-PLACE EXECUTION ============ */
            .eq-card { transition: all 0.35s cubic-bezier(0.4,0,0.2,1); }
            .eq-card.expanded {
                grid-column: 1 / -1;
                border-color: #8B1818;
                box-shadow: 0 8px 40px rgba(139,24,24,0.12);
                cursor: default;
            }
            .eq-card.dimmed { opacity: 0.4; pointer-events: none; filter: grayscale(0.3); }

            .eq-exec { border-top: 1px solid #eee; margin-top: 12px; padding-top: 16px; }
            .eq-exec-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 16px;
            }
            .eq-exec-title {
                font-size: 13px; font-weight: 700; text-transform: uppercase;
                letter-spacing: 0.5px; color: #0a0a0a;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-exec-close {
                width: 24px; height: 24px; display: flex; align-items: center;
                justify-content: center; background: #f5f5f5; border: none;
                border-radius: 6px; cursor: pointer; color: #666; font-size: 14px;
            }
            .eq-exec-close:hover { background: #eee; }

            /* Term sheet */
            .eq-terms {
                background: #fafafa; border: 1px solid #f0f0f0;
                border-radius: 8px; padding: 16px; margin-bottom: 16px;
            }
            .eq-terms-label {
                font-size: 9px; font-weight: 600; text-transform: uppercase;
                letter-spacing: 1px; color: #999; margin-bottom: 10px;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-terms-grid {
                display: grid; grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            .eq-term-item {}
            .eq-term-key {
                font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px;
                color: #999; font-family: 'JetBrains Mono', monospace;
            }
            .eq-term-val {
                font-size: 13px; font-weight: 600; color: #0a0a0a;
                font-family: 'IBM Plex Sans', sans-serif; margin-top: 2px;
            }

            /* Funding source */
            .eq-funding {
                display: flex; justify-content: space-between; align-items: center;
                background: #fff; border: 1px solid #e5e5e5;
                border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;
            }
            .eq-funding-left { display: flex; align-items: center; gap: 10px; }
            .eq-funding-icon {
                width: 36px; height: 24px; background: linear-gradient(135deg,#1a1f71,#2a4bd7);
                border-radius: 4px; display: flex; align-items: center;
                justify-content: center; color: #fff; font-size: 9px;
                font-weight: 700; font-family: 'Inter',sans-serif;
            }
            .eq-funding-card {
                font-size: 12px; font-weight: 500; color: #333;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-funding-change {
                font-size: 10px; color: #8B1818; cursor: pointer;
                font-family: 'JetBrains Mono', monospace; text-transform: uppercase;
                background: none; border: none; font-weight: 600;
            }

            /* Acknowledgement */
            .eq-ack {
                display: flex; align-items: flex-start; gap: 10px;
                padding: 12px; background: #fef2f2; border: 1px solid #fecaca;
                border-radius: 8px; margin-bottom: 16px; cursor: pointer;
            }
            .eq-ack input[type="checkbox"] {
                width: 16px; height: 16px; accent-color: #8B1818;
                margin-top: 1px; cursor: pointer; flex-shrink: 0;
            }
            .eq-ack-text {
                font-size: 11px; color: #7f1d1d; line-height: 1.5;
                font-family: 'Inter', sans-serif;
            }

            /* Confirm button */
            .eq-confirm {
                width: 100%; padding: 14px; font-size: 13px; font-weight: 700;
                text-transform: uppercase; letter-spacing: 1px;
                background: #8B1818; color: #fff; border: none;
                border-radius: 8px; cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                transition: all 0.15s; position: relative; overflow: hidden;
            }
            .eq-confirm:hover:not(:disabled) { background: #6B1212; }
            .eq-confirm:disabled { opacity: 0.45; cursor: not-allowed; }
            .eq-confirm-sub {
                font-size: 10px; color: #999; text-align: center;
                margin-top: 8px; font-family: 'JetBrains Mono', monospace;
            }

            /* Execution steps */
            .eq-exec-steps { margin-top: 16px; }
            .eq-exec-step {
                display: flex; align-items: center; gap: 10px;
                padding: 8px 0; font-size: 12px;
                font-family: 'JetBrains Mono', monospace;
                color: #ccc; transition: color 0.3s;
            }
            .eq-exec-step.active { color: #0a0a0a; }
            .eq-exec-step.done { color: #166534; }
            .eq-step-dot {
                width: 8px; height: 8px; border-radius: 50%;
                background: #e5e5e5; transition: background 0.3s; flex-shrink: 0;
            }
            .eq-exec-step.active .eq-step-dot { background: #8B1818; animation: pulse-dot 1s infinite; }
            .eq-exec-step.done .eq-step-dot { background: #166534; }
            @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

            /* Post-exec active card */
            .eq-exec-complete {
                text-align: center; padding: 16px 0;
            }
            .eq-exec-check {
                font-size: 28px; margin-bottom: 6px;
            }
            .eq-exec-msg {
                font-size: 12px; font-weight: 600; color: #166534;
                font-family: 'JetBrains Mono', monospace; margin-bottom: 4px;
            }
            .eq-exec-sub {
                font-size: 10px; color: #888;
                font-family: 'JetBrains Mono', monospace;
            }

            @media (max-width: 768px) {
                .eq-topbar { padding: 16px; flex-direction: column; gap: 12px; align-items: flex-start; }
                .eq-tabs { padding: 0 16px; overflow-x: auto; }
                .eq-filters { padding: 10px 16px; }
                .eq-grid { padding: 16px; grid-template-columns: 1fr; }
                .eq-stats { gap: 20px; }
                .eq-search { width: 140px; }
                .eq-terms-grid { grid-template-columns: 1fr; }
            }
        </style>

        <div class="eq">
            <!-- Top Bar -->
            <div class="eq-topbar">
                <div class="eq-stats">
                    <div>
                        <div class="eq-stat-value" id="stat-capital">$4.2M</div>
                        <div class="eq-stat-label">Capital Locked</div>
                    </div>
                    <div>
                        <div class="eq-stat-value" id="stat-contracts">142</div>
                        <div class="eq-stat-label">Active Contracts</div>
                    </div>
                    <div>
                        <div class="eq-stat-value" id="stat-pool">$892k</div>
                        <div class="eq-stat-label">Pool Balance</div>
                    </div>
                </div>
                <div class="eq-controls">
                    <input type="text" class="eq-search" id="eq-search" placeholder="Search contracts...">
                    <select class="eq-sort" id="eq-sort">
                        <option value="newest">Sort: Newest</option>
                        <option value="capital-high">Capital: High→Low</option>
                        <option value="capital-low">Capital: Low→High</option>
                        <option value="deadline">Deadline: Soonest</option>
                    </select>
                    <button class="eq-rules-btn" id="btn-rules">
                        <i data-lucide="sliders-horizontal"></i> RULES
                    </button>
                </div>
            </div>

            <!-- Tabs -->
            <div class="eq-tabs" id="eq-tabs">
                <button class="eq-tab active" data-status="all">ALL <span class="eq-tab-count" id="count-all">8</span></button>
                <button class="eq-tab" data-status="new">NEW <span class="eq-tab-count" id="count-new">0</span></button>
                <button class="eq-tab" data-status="action">ACTION REQUIRED <span class="eq-tab-count" id="count-action">2</span></button>
                <button class="eq-tab" data-status="verifying">VERIFYING <span class="eq-tab-count" id="count-verifying">1</span></button>
                <button class="eq-tab" data-status="settled">SETTLED <span class="eq-tab-count" id="count-settled">2</span></button>
            </div>

            <!-- Filters -->
            <div class="eq-filters" id="eq-filters">
                <span class="eq-filter-label">DOMAIN</span>
                <button class="eq-pill active" data-domain="all">All</button>
                <button class="eq-pill" data-domain="sales">Sales</button>
                <button class="eq-pill" data-domain="social">Social</button>
                <button class="eq-pill" data-domain="commerce">Commerce</button>
                <button class="eq-pill" data-domain="finance">Finance</button>
            </div>

            <!-- Contract Cards — ALL % growth from verified baseline -->
            <div class="eq-grid" id="eq-grid">

                <!-- STRIPE — Revenue +15% — CONTROLLED — Baseline $12k/mo -->
                <div class="eq-card"
                     data-id="0184" data-status="active" data-domain="finance"
                     data-tier="controlled" data-stake="5000" data-deadline="2026-03-06"
                     data-goal="Revenue Growth +15% in 30 Days"
                     onclick="window.router.navigate('/contracts/0184')">
                    <div class="eq-card-top">
                        <span class="eq-badge active">ACTIVE</span>
                        <span class="eq-card-id">RCPT-0184</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +15% in 30 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot stripe"></span> Stripe · Revenue</span>
                        <span class="eq-tier controlled">CONTROLLED <span class="eq-tier-rate">~30%</span></span>
                    </div>
                    <div class="eq-card-baseline">Baseline: $12,000/mo → Target: $13,800/mo</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$5,000</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">24d left</div>
                    </div>
                    <button class="eq-card-cta secondary" onclick="event.stopPropagation(); window.router.navigate('/receipts/0184')">View Receipt →</button>
                </div>

                <!-- X — Followers +35% — ELEVATED — Baseline 2,800 -->
                <div class="eq-card"
                     data-id="0190" data-status="action" data-domain="social"
                     data-tier="elevated" data-stake="1200" data-deadline="2026-02-28"
                     data-goal="Follower Growth +35% in 21 Days"
                     onclick="window.router.navigate('/contracts/0190')">
                    <div class="eq-card-top">
                        <span class="eq-badge action">ACTION REQUIRED</span>
                        <span class="eq-card-id">RCPT-0190</span>
                    </div>
                    <div class="eq-card-goal">Follower Growth +35% in 21 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot x"></span> X · Followers</span>
                        <span class="eq-tier elevated">ELEVATED <span class="eq-tier-rate">~20%</span></span>
                    </div>
                    <div class="eq-card-baseline">Baseline: 2,800 → Target: 3,780</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$1,200</div>
                            <div class="eq-card-stake-label">Stake</div>
                        </div>
                        <div class="eq-card-time">Ends Feb 28</div>
                    </div>
                    <button class="eq-card-cta primary eq-lock-btn" data-contract="0190" onclick="event.stopPropagation();">Lock Capital →</button>
                </div>

                <!-- SHOPIFY — Revenue +20% — CONTROLLED — Baseline $8k/mo -->
                <div class="eq-card"
                     data-id="0178" data-status="active" data-domain="commerce"
                     data-tier="controlled" data-stake="10000" data-deadline="2026-02-28"
                     data-goal="Revenue Growth +20% in 30 Days"
                     onclick="window.router.navigate('/contracts/0178')">
                    <div class="eq-card-top">
                        <span class="eq-badge active">ACTIVE</span>
                        <span class="eq-card-id">RCPT-0178</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +20% in 30 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot shopify"></span> Shopify · Revenue</span>
                        <span class="eq-tier controlled">CONTROLLED <span class="eq-tier-rate">~30%</span></span>
                    </div>
                    <div class="eq-card-baseline">Baseline: $8,200/mo → Target: $9,840/mo</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$10,000</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">18d left</div>
                    </div>
                    <button class="eq-card-cta secondary" onclick="event.stopPropagation(); window.router.navigate('/receipts/0178')">View Receipt →</button>
                </div>

                <!-- X — Followers +60% — MAXIMUM — Baseline 1,200 -->
                <div class="eq-card"
                     data-id="0185" data-status="verifying" data-domain="social"
                     data-tier="maximum" data-stake="2500" data-deadline="2026-02-14"
                     data-goal="Follower Growth +60% in 14 Days"
                     onclick="window.router.navigate('/contracts/0185')">
                    <div class="eq-card-top">
                        <span class="eq-badge verifying">VERIFYING</span>
                        <span class="eq-card-id">RCPT-0185</span>
                    </div>
                    <div class="eq-card-goal">Follower Growth +60% in 14 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot x"></span> X · Followers</span>
                        <span class="eq-tier maximum">MAXIMUM <span class="eq-tier-rate">~10%</span></span>
                    </div>
                    <div class="eq-card-baseline">Baseline: 1,200 → Target: 1,920</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$2,500</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">Verifying</div>
                    </div>
                    <button class="eq-card-cta secondary" onclick="event.stopPropagation(); window.router.navigate('/receipts/0185')">View Receipt →</button>
                </div>

                <!-- STRIPE — Revenue +60% — MAXIMUM — Baseline $32k/mo -->
                <div class="eq-card"
                     data-id="0192" data-status="active" data-domain="finance"
                     data-tier="maximum" data-stake="25000" data-deadline="2026-02-18"
                     data-goal="Revenue Growth +60% in 14 Days"
                     onclick="window.router.navigate('/contracts/0192')">
                    <div class="eq-card-top">
                        <span class="eq-badge active">ACTIVE</span>
                        <span class="eq-card-id">RCPT-0192</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +60% in 14 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot stripe"></span> Stripe · Revenue</span>
                        <span class="eq-tier maximum">MAXIMUM <span class="eq-tier-rate">~10%</span></span>
                    </div>
                    <div class="eq-card-baseline">Baseline: $32,000/mo → Target: $51,200/mo</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$25,000</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">9d left</div>
                    </div>
                    <button class="eq-card-cta secondary" onclick="event.stopPropagation(); window.router.navigate('/receipts/0192')">View Receipt →</button>
                </div>

                <!-- AMAZON — Revenue +35% — ELEVATED — Baseline $6k/mo -->
                <div class="eq-card"
                     data-id="0181" data-status="action" data-domain="sales"
                     data-tier="elevated" data-stake="3000" data-deadline="2026-03-02"
                     data-goal="Revenue Growth +35% in 21 Days"
                     onclick="window.router.navigate('/contracts/0181')">
                    <div class="eq-card-top">
                        <span class="eq-badge action">ACTION REQUIRED</span>
                        <span class="eq-card-id">RCPT-0181</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +35% in 21 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot amazon"></span> Amazon · Revenue</span>
                        <span class="eq-tier elevated">ELEVATED <span class="eq-tier-rate">~20%</span></span>
                    </div>
                    <div class="eq-card-baseline">Baseline: $6,400/mo → Target: $8,640/mo</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$3,000</div>
                            <div class="eq-card-stake-label">Stake</div>
                        </div>
                        <div class="eq-card-time">Ends Mar 2</div>
                    </div>
                    <button class="eq-card-cta primary eq-lock-btn" data-contract="0181" onclick="event.stopPropagation();">Lock Capital →</button>
                </div>

                <!-- X — Followers +15% — CONTROLLED — Baseline 850 -->
                <div class="eq-card"
                     data-id="0195" data-status="active" data-domain="social"
                     data-tier="controlled" data-stake="500" data-deadline="2026-03-04"
                     data-goal="Follower Growth +15% in 30 Days"
                     onclick="window.router.navigate('/contracts/0195')">
                    <div class="eq-card-top">
                        <span class="eq-badge active">ACTIVE</span>
                        <span class="eq-card-id">RCPT-0195</span>
                    </div>
                    <div class="eq-card-goal">Follower Growth +15% in 30 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot x"></span> X · Followers</span>
                        <span class="eq-tier controlled">CONTROLLED <span class="eq-tier-rate">~30%</span></span>
                    </div>
                    <div class="eq-card-baseline">Baseline: 850 → Target: 978</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$500</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">22d left</div>
                    </div>
                    <button class="eq-card-cta secondary" onclick="event.stopPropagation(); window.router.navigate('/receipts/0195')">View Receipt →</button>
                </div>

                <!-- SHOPIFY — Revenue +35% — ELEVATED (Settled/Won) -->
                <div class="eq-card"
                     data-id="0162" data-status="settled" data-domain="commerce"
                     data-tier="elevated" data-stake="4000" data-deadline="2026-01-20"
                     data-goal="Revenue Growth +35% in 21 Days"
                     onclick="window.router.navigate('/contracts/0162')">
                    <div class="eq-card-top">
                        <span class="eq-badge settled">SETTLED</span>
                        <span class="eq-card-id">RCPT-0162</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +35% in 21 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot shopify"></span> Shopify · Revenue</span>
                        <span class="eq-tier elevated">ELEVATED <span class="eq-tier-rate">~20%</span></span>
                    </div>
                    <div class="eq-card-baseline">Baseline: $4,500/mo → Target: $6,075/mo ✓</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$4,000</div>
                            <div class="eq-card-stake-label">Returned</div>
                        </div>
                        <div class="eq-card-time">Settled</div>
                    </div>
                    <button class="eq-card-cta secondary" onclick="event.stopPropagation(); window.router.navigate('/receipts/0162')">View Receipt →</button>
                </div>

                <!-- STRIPE — Revenue +15% — CONTROLLED (Settled/Forfeited) -->
                <div class="eq-card"
                     data-id="0155" data-status="settled" data-domain="finance"
                     data-tier="controlled" data-stake="3000" data-deadline="2026-01-15"
                     data-goal="Revenue Growth +15% in 30 Days"
                     onclick="window.router.navigate('/contracts/0155')">
                    <div class="eq-card-top">
                        <span class="eq-badge settled">SETTLED</span>
                        <span class="eq-card-id">RCPT-0155</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +15% in 30 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot stripe"></span> Stripe · Revenue</span>
                        <span class="eq-tier controlled">CONTROLLED <span class="eq-tier-rate">~30%</span></span>
                    </div>
                    <div class="eq-card-baseline">Baseline: $9,200/mo → Target: $10,580/mo ✗</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$3,000</div>
                            <div class="eq-card-stake-label">Forfeited</div>
                        </div>
                        <div class="eq-card-time">Settled</div>
                    </div>
                    <button class="eq-card-cta secondary" onclick="event.stopPropagation(); window.router.navigate('/receipts/0155')">View Receipt →</button>
                </div>

                <!-- Empty state (shown when all cards filtered out) -->
                <div class="eq-empty" id="eq-empty" style="display:none;">
                    <div class="eq-empty-icon">📋</div>
                    <div class="eq-empty-text">No contracts match your filters</div>
                    <div class="eq-empty-sub">Try adjusting your status, domain, or search filters</div>
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
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // State
    let activeStatus = 'all';
    let activeDomain = 'all';
    let searchQuery = '';
    let sortBy = 'newest';
    let minStake = 0;
    let enabledTiers = { controlled: true, elevated: true, maximum: true };

    const grid = document.getElementById('eq-grid');
    const emptyEl = document.getElementById('eq-empty');
    if (!grid) return;

    // ===================================================================
    // FILTER ENGINE — runs on every state change
    // ===================================================================
    function applyFilters() {
        const cards = grid.querySelectorAll('.eq-card');
        let visibleCount = 0;
        const statusCounts = { all: 0, new: 0, action: 0, verifying: 0, settled: 0, active: 0 };

        // Collect all cards with visibility info for sorting
        const cardEntries = [];

        cards.forEach(card => {
            const cardStatus = card.dataset.status;
            const cardDomain = card.dataset.domain;
            const cardTier = card.dataset.tier;
            const cardStake = parseInt(card.dataset.stake || '0');
            const cardGoal = (card.dataset.goal || '').toLowerCase();
            const cardId = card.dataset.id || '';

            // Count by status (before filters, for tab counts)
            if (cardStatus) statusCounts[cardStatus] = (statusCounts[cardStatus] || 0) + 1;
            statusCounts.all++;

            // Status filter
            let visible = true;
            if (activeStatus !== 'all' && cardStatus !== activeStatus) visible = false;

            // Domain filter
            if (activeDomain !== 'all' && cardDomain !== activeDomain) visible = false;

            // Tier filter (from modal checkboxes)
            if (cardTier && !enabledTiers[cardTier]) visible = false;

            // Stake minimum filter
            if (cardStake < minStake) visible = false;

            // Search filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesGoal = cardGoal.includes(q);
                const matchesId = cardId.includes(q);
                const matchesTier = (cardTier || '').includes(q);
                const matchesDomain = (cardDomain || '').includes(q);
                if (!matchesGoal && !matchesId && !matchesTier && !matchesDomain) visible = false;
            }

            cardEntries.push({ card, visible, stake: cardStake, deadline: card.dataset.deadline || '' });

            if (visible) {
                card.classList.remove('hidden-card');
                visibleCount++;
            } else {
                card.classList.add('hidden-card');
            }
        });

        // Sort visible cards
        const visibleCards = cardEntries.filter(e => e.visible);
        visibleCards.sort((a, b) => {
            switch (sortBy) {
                case 'capital-high': return b.stake - a.stake;
                case 'capital-low': return a.stake - b.stake;
                case 'deadline': return a.deadline.localeCompare(b.deadline);
                case 'newest':
                default:
                    return (b.card.dataset.id || '').localeCompare(a.card.dataset.id || '');
            }
        });

        // Re-order DOM
        visibleCards.forEach(entry => grid.appendChild(entry.card));
        // Move hidden cards to end (and empty state)
        cardEntries.filter(e => !e.visible).forEach(e => grid.appendChild(e.card));
        if (emptyEl) {
            grid.appendChild(emptyEl);
            emptyEl.style.display = visibleCount === 0 ? '' : 'none';
        }

        // Update tab counts
        const countAll = document.getElementById('count-all');
        const countNew = document.getElementById('count-new');
        const countAction = document.getElementById('count-action');
        const countVerifying = document.getElementById('count-verifying');
        const countSettled = document.getElementById('count-settled');
        if (countAll) countAll.textContent = statusCounts.all;
        if (countNew) countNew.textContent = statusCounts.new || 0;
        if (countAction) countAction.textContent = statusCounts.action || 0;
        if (countVerifying) countVerifying.textContent = statusCounts.verifying || 0;
        if (countSettled) countSettled.textContent = statusCounts.settled || 0;
    }

    // ===================================================================
    // STATUS TABS
    // ===================================================================
    const tabsContainer = document.getElementById('eq-tabs');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.eq-tab');
            if (!tab) return;

            // Update active state
            tabsContainer.querySelectorAll('.eq-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            activeStatus = tab.dataset.status || 'all';
            applyFilters();
        });
    }

    // ===================================================================
    // DOMAIN PILLS
    // ===================================================================
    const filtersContainer = document.getElementById('eq-filters');
    if (filtersContainer) {
        filtersContainer.addEventListener('click', (e) => {
            const pill = e.target.closest('.eq-pill');
            if (!pill) return;

            // Update active state
            filtersContainer.querySelectorAll('.eq-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            activeDomain = pill.dataset.domain || 'all';
            applyFilters();
        });
    }

    // ===================================================================
    // SEARCH
    // ===================================================================
    const searchInput = document.getElementById('eq-search');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuery = searchInput.value.trim();
                applyFilters();
            }, 200); // Debounce 200ms
        });

        // Clear search on Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchQuery = '';
                applyFilters();
                searchInput.blur();
            }
        });
    }

    // ===================================================================
    // SORT
    // ===================================================================
    const sortSelect = document.getElementById('eq-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortBy = sortSelect.value;
            applyFilters();
        });
    }

    // ===================================================================
    // RULES MODAL
    // ===================================================================
    const rulesBtn = document.getElementById('btn-rules');
    const rulesModal = document.getElementById('rules-modal');
    if (rulesBtn && rulesModal) {
        rulesBtn.addEventListener('click', () => {
            rulesModal.classList.add('open');
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && rulesModal.classList.contains('open')) {
                rulesModal.classList.remove('open');
            }
        });
    }

    // ===================================================================
    // TIER CHECKBOXES (in rules modal) — filter cards in real-time
    // ===================================================================
    ['tier-controlled', 'tier-elevated', 'tier-maximum'].forEach(id => {
        const cb = document.getElementById(id);
        if (cb) {
            cb.addEventListener('change', () => {
                enabledTiers[cb.dataset.tier] = cb.checked;
                applyFilters();
            });
        }
    });

    // ===================================================================
    // STAKE SLIDER (in rules modal)
    // ===================================================================
    const stakeSlider = document.getElementById('stake-slider');
    const stakeValue = document.getElementById('stake-slider-value');
    if (stakeSlider && stakeValue) {
        stakeSlider.addEventListener('input', () => {
            const val = parseInt(stakeSlider.value);
            minStake = val;
            stakeValue.textContent = val === 0 ? '$0' : `$${val.toLocaleString()}`;
            applyFilters();
        });
    }

    // ===================================================================
    // BUYOUT TOGGLE (purely visual for now)
    // ===================================================================
    const buyoutCb = document.getElementById('rule-buyout');
    if (buyoutCb) {
        buyoutCb.addEventListener('change', () => {
            console.log('[Rules] Buyout available:', buyoutCb.checked);
            // Future: filter cards that have buyout option
        });
    }

    // Run initial filter to set counts
    applyFilters();

    // ===================================================================
    // EXPAND-IN-PLACE EXECUTION SURFACE
    // ===================================================================
    let expandedCardId = null;

    function collapseAll() {
        grid.querySelectorAll('.eq-card').forEach(c => {
            c.classList.remove('expanded', 'dimmed');
            const exec = c.querySelector('.eq-exec');
            if (exec) exec.remove();
        });
        expandedCardId = null;
    }

    function expandCard(cardEl) {
        const id = cardEl.dataset.id;
        if (expandedCardId === id) { collapseAll(); return; }
        collapseAll();
        expandedCardId = id;

        // Dim others
        grid.querySelectorAll('.eq-card').forEach(c => {
            if (c.dataset.id !== id) c.classList.add('dimmed');
        });
        cardEl.classList.add('expanded');

        // Extract card data
        const goal = cardEl.dataset.goal || '';
        const tier = (cardEl.dataset.tier || 'controlled').toUpperCase();
        const stake = parseInt(cardEl.dataset.stake || '0');
        const deadline = cardEl.dataset.deadline || '';
        const baseline = cardEl.querySelector('.eq-card-baseline')?.textContent || '';
        const integration = cardEl.querySelector('.eq-card-integration')?.textContent?.trim() || '';
        const rcpt = 'RCPT-' + id;
        const tierRate = tier === 'CONTROLLED' ? '~30%' : tier === 'ELEVATED' ? '~20%' : '~10%';
        const deadlineFmt = deadline ? new Date(deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

        // Build execution surface
        const execDiv = document.createElement('div');
        execDiv.className = 'eq-exec';
        execDiv.innerHTML = `
            <div class="eq-exec-header">
                <span class="eq-exec-title">Execute Contract</span>
                <button class="eq-exec-close" data-action="collapse">✕</button>
            </div>

            <div class="eq-terms">
                <div class="eq-terms-label">Immutable Term Sheet — ${rcpt}</div>
                <div class="eq-terms-grid">
                    <div class="eq-term-item">
                        <div class="eq-term-key">Provider</div>
                        <div class="eq-term-val">${integration}</div>
                    </div>
                    <div class="eq-term-item">
                        <div class="eq-term-key">Window</div>
                        <div class="eq-term-val">${goal.match(/\d+ Days/)?.[0] || '30 Days'}</div>
                    </div>
                    <div class="eq-term-item">
                        <div class="eq-term-key">Tier / Win Rate</div>
                        <div class="eq-term-val">${tier} ${tierRate}</div>
                    </div>
                    <div class="eq-term-item">
                        <div class="eq-term-key">Locked Capital</div>
                        <div class="eq-term-val">$${stake.toLocaleString()}</div>
                    </div>
                    <div class="eq-term-item">
                        <div class="eq-term-key">Baseline Snapshot</div>
                        <div class="eq-term-val">${baseline.replace('Baseline: ', '').split('→')[0]?.trim() || '—'}</div>
                    </div>
                    <div class="eq-term-item">
                        <div class="eq-term-key">Target Required</div>
                        <div class="eq-term-val">${baseline.split('→')[1]?.trim() || '—'}</div>
                    </div>
                    <div class="eq-term-item">
                        <div class="eq-term-key">Expiration</div>
                        <div class="eq-term-val">${deadlineFmt}</div>
                    </div>
                    <div class="eq-term-item">
                        <div class="eq-term-key">Settlement</div>
                        <div class="eq-term-val">Automatic</div>
                    </div>
                </div>
            </div>

            <div class="eq-funding">
                <div class="eq-funding-left">
                    <div class="eq-funding-icon">VISA</div>
                    <span class="eq-funding-card">•••• 4242</span>
                </div>
                <button class="eq-funding-change">Change</button>
            </div>

            <label class="eq-ack" id="ack-label-${id}">
                <input type="checkbox" id="ack-cb-${id}">
                <span class="eq-ack-text">I understand this capital becomes locked immediately under immutable terms. No appeals. Settlement is enforced automatically at deadline.</span>
            </label>

            <button class="eq-confirm" id="confirm-btn-${id}" disabled>Confirm Lock →</button>
            <div class="eq-confirm-sub">Settlement is enforced automatically. No manual approval.</div>
        `;

        cardEl.appendChild(execDiv);

        // Scroll card into view
        setTimeout(() => cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);

        // Close button
        execDiv.querySelector('[data-action="collapse"]').addEventListener('click', (e) => {
            e.stopPropagation();
            collapseAll();
        });

        // Checkbox enables confirm
        const cb = document.getElementById(`ack-cb-${id}`);
        const confirmBtn = document.getElementById(`confirm-btn-${id}`);
        cb.addEventListener('change', () => {
            confirmBtn.disabled = !cb.checked;
        });

        // Prevent card navigation while expanded
        cardEl.onclick = (e) => e.stopPropagation();

        // CONFIRM → execution animation
        confirmBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            runExecution(cardEl, id, execDiv, stake);
        });
    }

    async function runExecution(cardEl, id, execDiv, stake) {
        const confirmBtn = document.getElementById(`confirm-btn-${id}`);
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'LOCKING…';

        // Replace form with step animation
        setTimeout(() => {
            execDiv.innerHTML = `
                <div class="eq-exec-header">
                    <span class="eq-exec-title">Executing Contract</span>
                    <span style="font-size:10px;color:#999;font-family:'JetBrains Mono',monospace;">RCPT-${id}</span>
                </div>
                <div class="eq-exec-steps">
                    <div class="eq-exec-step" id="step-1-${id}"><span class="eq-step-dot"></span> Authorizing Capital</div>
                    <div class="eq-exec-step" id="step-2-${id}"><span class="eq-step-dot"></span> Writing Receipt</div>
                    <div class="eq-exec-step" id="step-3-${id}"><span class="eq-step-dot"></span> Execution Confirmed</div>
                    <div class="eq-exec-step" id="step-4-${id}"><span class="eq-step-dot"></span> Window Begins Now</div>
                </div>
            `;

            // Step through animation
            const steps = [1, 2, 3, 4];
            let i = 0;
            const interval = setInterval(() => {
                if (i > 0) {
                    document.getElementById(`step-${i}-${id}`)?.classList.remove('active');
                    document.getElementById(`step-${i}-${id}`)?.classList.add('done');
                }
                i++;
                if (i <= 4) {
                    document.getElementById(`step-${i}-${id}`)?.classList.add('active');
                } else {
                    clearInterval(interval);
                    // All done — show completion
                    setTimeout(() => showExecutionComplete(cardEl, id, stake), 400);
                }
            }, 800);
        }, 300);
    }

    function showExecutionComplete(cardEl, id, stake) {
        // Flip card to ACTIVE state
        cardEl.dataset.status = 'active';
        const badge = cardEl.querySelector('.eq-badge');
        if (badge) {
            badge.className = 'eq-badge active';
            badge.textContent = 'ACTIVE';
        }

        // Remove exec panel
        const exec = cardEl.querySelector('.eq-exec');
        if (exec) {
            exec.innerHTML = `
                <div class="eq-exec-complete">
                    <div class="eq-exec-check">✅</div>
                    <div class="eq-exec-msg">Execution Confirmed</div>
                    <div class="eq-exec-sub">Day 1 / 30 — Tracking begins immediately</div>
                </div>
            `;
        }

        // Swap CTA button
        const cta = cardEl.querySelector('.eq-lock-btn');
        if (cta) {
            cta.className = 'eq-card-cta secondary';
            cta.textContent = '✅ View Receipt →';
            cta.onclick = (e) => {
                e.stopPropagation();
                window.router.navigate(`/receipts/${id}`);
            };
        }

        // Update stake label
        const stakeLabel = cardEl.querySelector('.eq-card-stake-label');
        if (stakeLabel) stakeLabel.textContent = 'Locked';

        // Un-dim others after 2s
        setTimeout(() => {
            grid.querySelectorAll('.eq-card').forEach(c => c.classList.remove('dimmed'));
            cardEl.classList.remove('expanded');
            const execFinal = cardEl.querySelector('.eq-exec');
            if (execFinal) execFinal.remove();
            // Restore click navigation
            cardEl.onclick = () => window.router.navigate(`/contracts/${id}`);
            applyFilters();
        }, 2500);
    }

    // Wire up all Lock Capital buttons
    grid.querySelectorAll('.eq-lock-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.eq-card');
            if (card) expandCard(card);
        });
    });

    // Escape to collapse
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && expandedCardId) collapseAll();
    });
}
