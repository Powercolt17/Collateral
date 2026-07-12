// Token view — $CLTR Control Portal
// Interactive simulated Web3 controls for Staking, Vesting, and Wallet connection.
// Real state persistence via localStorage.

export function renderToken() {
    return `
        <style>
            /* ===================================================
               CLTR CONTROL PORTAL — ULTRA-PREMIUM WEB3 INTERFACE
               Brand Burgundy #5C1414 · Off-White · JetBrains Mono
               =================================================== */

            @keyframes cltrReveal {
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .cltr-page {
                background: #FAFAFA;
                min-height: calc(100vh - 72px);
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
                padding-bottom: 120px;
            }

            .cltr-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 48px 32px 0;
            }

            /* Header Section */
            .cltr-hdr {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 24px;
                margin-bottom: 40px;
                animation: cltrReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .cltr-hdr-title {
                font-size: 24px;
                font-weight: 800;
                letter-spacing: -1px;
                color: #111;
                margin: 0 0 6px;
                position: relative;
                display: inline-block;
            }
            .cltr-hdr-title::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 48px;
                height: 3px;
                background: #5C1414;
            }
            .cltr-hdr-sub {
                font-size: 13px;
                color: #666;
                margin: 8px 0 0;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.2px;
            }

            /* Top Wallet Connect Bar */
            .cltr-wallet-bar {
                background: #fff;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 20px 24px;
                margin-bottom: 32px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 24px;
                animation: cltrReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
            }
            .cltr-wallet-info {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .cltr-wallet-status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #D82224; /* Disconnected by default */
            }
            .cltr-wallet-status-dot.connected {
                background: #10B981;
                animation: dotPulseWeb3 2s ease-in-out infinite;
            }
            @keyframes dotPulseWeb3 {
                0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            }
            .cltr-wallet-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                font-weight: 700;
            }
            .cltr-wallet-address {
                color: #666;
                font-weight: 500;
                margin-left: 8px;
            }
            .cltr-wallet-btn {
                background: #5C1414;
                color: #fff;
                border: none;
                padding: 12px 24px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
                overflow: hidden;
            }
            .cltr-wallet-btn:hover {
                background: #4A1010;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(92, 20, 20, 0.15);
            }
            .cltr-wallet-btn.connected {
                background: transparent;
                border: 1px solid #E5E5E5;
                color: #555;
            }
            .cltr-wallet-btn.connected:hover {
                border-color: #5C1414;
                color: #5C1414;
                box-shadow: none;
                transform: none;
            }

            /* Stats Grid */
            .cltr-stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
                margin-bottom: 32px;
                animation: cltrReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
            }
            .cltr-stat-card {
                background: #fff;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                position: relative;
                overflow: hidden;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .cltr-stat-card:hover {
                border-color: rgba(92, 20, 20, 0.2);
                box-shadow: 0 4px 16px rgba(92, 20, 20, 0.03);
            }
            .cltr-stat-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0;
                width: 0; height: 3px;
                background: #5C1414;
                transition: width 0.35s ease;
            }
            .cltr-stat-card:hover::before { width: 100%; }
            .cltr-stat-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #5C1414;
            }
            .cltr-stat-val {
                font-size: 22px;
                font-weight: 800;
                letter-spacing: -1px;
                color: #111;
                font-family: 'Sora', sans-serif;
            }
            .cltr-stat-sub {
                font-size: 11px;
                color: #888;
                font-family: 'JetBrains Mono', monospace;
            }

            /* Main Layout Grid */
            .cltr-main-grid {
                display: grid;
                grid-template-columns: 1.2fr 1fr;
                gap: 32px;
                margin-bottom: 32px;
                animation: cltrReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
            }

            /* Sections */
            .cltr-panel {
                background: #fff;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 32px;
                margin-bottom: 32px;
                position: relative;
            }
            .cltr-panel::before {
                content: '';
                position: absolute;
                left: 0; top: 0; bottom: 0;
                width: 3px;
                background: #5C1414;
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
                letter-spacing: 2px;
                color: #5C1414;
            }

            /* Staking Input & APY selectors */
            .cltr-stake-box {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .cltr-input-wrap {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .cltr-input-lbl-row {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #5C1414;
            }
            .cltr-input-lbl-row span.max-link {
                cursor: pointer;
                text-decoration: underline;
            }
            .cltr-input-box {
                position: relative;
            }
            .cltr-input-box input {
                width: 100%;
                padding: 16px;
                padding-right: 80px;
                border: 1px solid #E5E5E5;
                background: #FAFAFA;
                font-family: 'JetBrains Mono', monospace;
                font-size: 20px;
                font-weight: 700;
                outline: none;
                box-sizing: border-box;
                border-radius: 4px;
                transition: border-color 0.15s, background 0.15s;
            }
            .cltr-input-box input:focus {
                border-color: #5C1414;
                background: #fff;
                box-shadow: 0 0 0 3px rgba(92, 20, 20, 0.08);
            }
            .cltr-input-suffix {
                position: absolute;
                right: 18px;
                top: 50%;
                transform: translateY(-50%);
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                font-weight: 700;
                color: #888;
            }

            /* Lock Duration Pills */
            .cltr-durations {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
            }
            .cltr-duration-pill {
                border: 1px solid #E5E5E5;
                background: #fff;
                padding: 16px 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                border-radius: 4px;
            }
            .cltr-duration-pill:hover {
                border-color: #5C1414;
                background: rgba(92, 20, 20, 0.01);
            }
            .cltr-duration-pill.active {
                background: #5C1414;
                border-color: #5C1414;
                color: #fff;
            }
            .cltr-dur-days {
                font-family: 'Sora', sans-serif;
                font-size: 14px;
                font-weight: 700;
                display: block;
                margin-bottom: 4px;
            }
            .cltr-dur-apy {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                opacity: 0.8;
            }

            /* APY Info Row */
            .cltr-stake-summary {
                background: #FCFCFC;
                border: 1px dashed #E5E5E5;
                border-radius: 4px;
                padding: 16px 20px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .cltr-sum-row {
                display: flex;
                justify-content: space-between;
                color: #666;
            }
            .cltr-sum-row strong {
                color: #111;
            }
            .cltr-sum-row.highlight strong {
                color: #5C1414;
                font-size: 12px;
            }

            /* Staking Button */
            .cltr-btn-submit {
                width: 100%;
                padding: 16px;
                background: #5C1414;
                color: #fff;
                border: none;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.2s;
                border-radius: 4px;
            }
            .cltr-btn-submit:hover {
                background: #4A1010;
                box-shadow: 0 4px 16px rgba(92, 20, 20, 0.2);
            }
            .cltr-btn-submit:disabled {
                background: #ccc;
                color: #888;
                cursor: not-allowed;
                box-shadow: none;
            }

            /* Vesting Cards */
            .cltr-vest-card {
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 20px;
                margin-bottom: 16px;
                background: #fff;
                transition: border-color 0.2s;
            }
            .cltr-vest-card:hover {
                border-color: rgba(92, 20, 20, 0.15);
            }
            .cltr-vest-card-hdr {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 16px;
            }
            .cltr-vest-name {
                font-size: 14px;
                font-weight: 700;
                color: #111;
            }
            .cltr-vest-alloc {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                color: #5C1414;
                font-weight: 700;
            }
            .cltr-vest-progress-bar {
                height: 4px;
                background: #EEE;
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            .cltr-vest-progress-fill {
                height: 100%;
                background: #5C1414;
                width: 0%;
                transition: width 0.3s ease;
            }
            .cltr-vest-progress-meta {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #888;
                margin-bottom: 16px;
            }

            .cltr-claim-section {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #FAFAFA;
                padding: 12px 16px;
                border-radius: 4px;
            }
            .cltr-claim-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #888;
            }
            .cltr-claim-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 14px;
                font-weight: 700;
                color: #5C1414;
            }
            .cltr-claim-btn {
                background: #111;
                color: #fff;
                border: none;
                padding: 8px 16px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.2s;
                border-radius: 3px;
            }
            .cltr-claim-btn:hover {
                background: #5C1414;
            }
            .cltr-claim-btn:disabled {
                background: #eee;
                color: #ccc;
                cursor: not-allowed;
            }

            /* Active Stakes Table */
            .cltr-table-wrap {
                overflow-x: auto;
            }
            .cltr-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                text-align: left;
            }
            .cltr-table th {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                padding: 12px 16px;
                border-bottom: 1px solid #F0F0F0;
                background: #FCFCFC;
            }
            .cltr-table td {
                padding: 16px;
                border-bottom: 1px solid #F0F0F0;
                font-family: 'JetBrains Mono', monospace;
            }
            .cltr-stake-progress {
                width: 120px;
                height: 4px;
                background: #eee;
                border-radius: 2px;
                overflow: hidden;
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
            }
            .cltr-stake-progress-fill {
                height: 100%;
                background: #5C1414;
                width: 0%;
            }
            .cltr-badge {
                padding: 3px 6px;
                border-radius: 3px;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
            }
            .cltr-badge.locked {
                background: rgba(92, 20, 20, 0.05);
                color: #5C1414;
            }
            .cltr-badge.matured {
                background: rgba(16, 185, 129, 0.1);
                color: #10B981;
            }

            .cltr-unstake-btn {
                background: none;
                border: 1px solid #E5E5E5;
                padding: 4px 10px;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.2s;
                border-radius: 3px;
            }
            .cltr-unstake-btn:hover {
                border-color: #D82224;
                color: #D82224;
                background: rgba(216, 34, 36, 0.02);
            }
            .cltr-unstake-btn:disabled {
                opacity: 0.3;
                cursor: not-allowed;
                border-color: #E5E5E5;
                color: #aaa;
                background: none;
            }

            /* Transaction Log Loader overlay */
            .cltr-tx-modal {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.6);
                backdrop-filter: blur(4px);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .cltr-tx-modal.open {
                display: flex;
            }
            .cltr-tx-box {
                background: #fff;
                border-radius: 4px;
                border: 1px solid #E5E5E5;
                padding: 32px;
                width: 100%;
                max-width: 360px;
                text-align: center;
            }
            .cltr-tx-spinner {
                width: 36px;
                height: 36px;
                border: 3px solid rgba(92, 20, 20, 0.1);
                border-top-color: #5C1414;
                border-radius: 50%;
                animation: cltrSpin 1s linear infinite;
                margin: 0 auto 20px;
            }
            @keyframes cltrSpin {
                to { transform: rotate(360deg); }
            }
            .cltr-tx-title {
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            .cltr-tx-sub {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #888;
            }

            /* Responsive */
            @media (max-width: 1024px) {
                .cltr-main-grid { grid-template-columns: 1fr; }
                .cltr-stats-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 640px) {
                .cltr-stats-grid { grid-template-columns: 1fr; }
                .cltr-durations { grid-template-columns: repeat(2, 1fr); }
                .cltr-hdr { flex-direction: column; align-items: flex-start; gap: 12px; }
                .cltr-wallet-bar { flex-direction: column; align-items: flex-start; gap: 16px; }
                .cltr-wallet-btn { width: 100%; text-align: center; }
            }
        </style>

        <div class="cltr-page">
            <div class="cltr-container">

                <!-- Header -->
                <div class="cltr-hdr">
                    <div>
                        <h1 class="cltr-hdr-title">CLTR CONTROL PORTAL</h1>
                        <p class="cltr-hdr-sub">Manage staking, vesting, and protocol utilities.</p>
                    </div>
                </div>

                <!-- Web3 Connect Banner -->
                <div class="cltr-wallet-bar">
                    <div class="cltr-wallet-info">
                        <div class="cltr-wallet-status-dot" id="w-dot"></div>
                        <div class="cltr-wallet-text">
                            <span id="w-status">DISCONNECTED</span>
                            <span class="cltr-wallet-address" id="w-addr">—</span>
                        </div>
                    </div>
                    <button class="cltr-wallet-btn" id="w-connect-btn">CONNECT WALLET</button>
                </div>

                <!-- Deflationary Stats Grid -->
                <div class="cltr-stats-grid">
                    <div class="cltr-stat-card">
                        <span class="cltr-stat-lbl">Wallet Balance</span>
                        <div class="cltr-stat-val" id="stat-wallet-bal">—</div>
                        <span class="cltr-stat-sub">CLTR available</span>
                    </div>
                    <div class="cltr-stat-card">
                        <span class="cltr-stat-lbl">Locked TVL</span>
                        <div class="cltr-stat-val" id="stat-locked-tvl">—</div>
                        <span class="cltr-stat-sub" id="stat-locked-percent">—</span>
                    </div>
                    <div class="cltr-stat-card">
                        <span class="cltr-stat-lbl">Proof-of-Success Burned</span>
                        <div class="cltr-stat-val" id="stat-burned-cltr">—</div>
                        <span class="cltr-stat-sub" id="stat-burned-ratio">—</span>
                    </div>
                    <div class="cltr-stat-card">
                        <span class="cltr-stat-lbl">Total Supply</span>
                        <div class="cltr-stat-val">987,549,770</div>
                        <span class="cltr-stat-sub">Fixed: 1,000,000,000</span>
                    </div>
                </div>

                <!-- Main Layout -->
                <div class="cltr-main-grid">

                    <!-- Left: Staking & Active Stakes -->
                    <div>
                        <!-- Staking Panel -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">COMMITMENT STAKING</span>
                                <span id="staking-apr-badge" style="font-family:'JetBrains Mono', monospace; font-size:10px; font-weight:700; color:#10B981;">UP TO 25% APY</span>
                            </div>

                            <div class="cltr-stake-box">
                                <div class="cltr-input-wrap">
                                    <div class="cltr-input-lbl-row">
                                        <span>Amount to Stake</span>
                                        <span class="max-link" id="stake-max-btn">MAX</span>
                                    </div>
                                    <div class="cltr-input-box">
                                        <input type="number" id="stake-input" min="1" placeholder="0.00" disabled>
                                        <span class="cltr-input-suffix">CLTR</span>
                                    </div>
                                </div>

                                <div class="cltr-input-wrap">
                                    <label class="cltr-input-lbl-row">Lockup Duration</label>
                                    <div class="cltr-durations">
                                        <button class="cltr-duration-pill active" data-days="30" data-apy="5" disabled>
                                            <span class="cltr-dur-days">30 Days</span>
                                            <span class="cltr-dur-apy">5% APY</span>
                                        </button>
                                        <button class="cltr-duration-pill" data-days="90" data-apy="10" disabled>
                                            <span class="cltr-dur-days">90 Days</span>
                                            <span class="cltr-dur-apy">10% APY</span>
                                        </button>
                                        <button class="cltr-duration-pill" data-days="180" data-apy="15" disabled>
                                            <span class="cltr-dur-days">180 Days</span>
                                            <span class="cltr-dur-apy">15% APY</span>
                                        </button>
                                        <button class="cltr-duration-pill" data-days="365" data-apy="25" disabled>
                                            <span class="cltr-dur-days">365 Days</span>
                                            <span class="cltr-dur-apy">25% APY</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="cltr-stake-summary">
                                    <div class="cltr-sum-row">
                                        <span>Staking APY</span>
                                        <span id="sum-apy">5.0%</span>
                                    </div>
                                    <div class="cltr-sum-row">
                                        <span>Interest Earned</span>
                                        <span id="sum-yield">0.00 CLTR</span>
                                    </div>
                                    <div class="cltr-sum-row highlight">
                                        <span>Total Release</span>
                                        <strong id="sum-total">0.00 CLTR</strong>
                                    </div>
                                </div>

                                <button class="cltr-btn-submit" id="stake-btn" disabled>STAKE CLTR</button>
                            </div>
                        </div>

                        <!-- Active Stakes Panel -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">ACTIVE LOCKED STAKES</span>
                                <span style="font-family:'JetBrains Mono', monospace; font-size:10px; color:#888;" id="stakes-count">0 Stakes</span>
                            </div>

                            <div class="cltr-table-wrap">
                                <table class="cltr-table">
                                    <thead>
                                        <tr>
                                            <th>Locked Amount</th>
                                            <th>Lock Period</th>
                                            <th>Maturity</th>
                                            <th>Yield</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="stakes-tbody">
                                        <tr>
                                            <td colspan="6" style="text-align:center; color:#999; padding: 24px;">Connect wallet to view active locked positions.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Vesting Contracts -->
                    <div>
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">LINEAR VESTING CONTRACTS</span>
                            </div>

                            <!-- Founder Vesting -->
                            <div class="cltr-vest-card">
                                <div class="cltr-vest-card-hdr">
                                    <span class="cltr-vest-name">Founder Vesting Wallet</span>
                                    <span class="cltr-vest-alloc">50,000,000 CLTR</span>
                                </div>
                                <div class="cltr-vest-progress-bar">
                                    <div class="cltr-vest-progress-fill" id="founder-vest-progress"></div>
                                </div>
                                <div class="cltr-vest-progress-meta">
                                    <span>Vested: <strong id="founder-vested-label">—</strong></span>
                                    <span id="founder-time-remaining">—</span>
                                </div>
                                <div class="cltr-claim-section">
                                    <div>
                                        <span class="cltr-claim-lbl" style="display:block;">Claimable Vested</span>
                                        <span class="cltr-claim-val" id="founder-claimable-label">—</span>
                                    </div>
                                    <button class="cltr-claim-btn" id="founder-claim-btn" disabled>RELEASE TOKENS</button>
                                </div>
                            </div>

                            <!-- Team Vesting -->
                            <div class="cltr-vest-card">
                                <div class="cltr-vest-card-hdr">
                                    <span class="cltr-vest-name">Team Allocation Vesting</span>
                                    <span class="cltr-vest-alloc">150,000,000 CLTR</span>
                                </div>
                                <div class="cltr-vest-progress-bar">
                                    <div class="cltr-vest-progress-fill" id="team-vest-progress"></div>
                                </div>
                                <div class="cltr-vest-progress-meta">
                                    <span>Vested: <strong id="team-vested-label">—</strong></span>
                                    <span id="team-time-remaining">—</span>
                                </div>
                                <div class="cltr-claim-section">
                                    <div>
                                        <span class="cltr-claim-lbl" style="display:block;">Claimable Vested</span>
                                        <span class="cltr-claim-val" id="team-claimable-label">—</span>
                                    </div>
                                    <button class="cltr-claim-btn" id="team-claim-btn" disabled>RELEASE TOKENS</button>
                                </div>
                            </div>
                        </div>

                        <!-- Info Card -->
                        <div class="cltr-panel" style="background:#5C1414; border:none; color:#fff; padding: 24px;">
                            <div style="font-family:'JetBrains Mono', monospace; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; color:rgba(255,255,255,0.7);">Deflationary Proof-of-Success Burn</div>
                            <h4 style="font-size:16px; font-weight:700; margin:0 0 12px; line-height:1.3;">Human execution directly drives token supply reduction.</h4>
                            <p style="font-size:12px; opacity:0.8; line-height:1.6; margin:0;">Whenever a self-betting contract is verified successfully on the platform, 2% of the settled amount is charged as a protocol execution fee. 50% of this fee is immediately converted and permanently burned, causing automatic token supply deflation.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- ===== TX STATUS MODAL ===== -->
        <div id="tx-modal" class="cltr-tx-modal">
            <div class="cltr-tx-box">
                <div class="cltr-tx-spinner"></div>
                <h3 class="cltr-tx-title" id="tx-title">Waiting for Wallet Confirmation</h3>
                <p class="cltr-tx-sub" id="tx-sub">Please approve the transaction in MetaMask or your linked Web3 wallet.</p>
            </div>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════
// DYNAMIC INTERACTION LOGIC
// ═══════════════════════════════════════════════════════
export function initToken() {
    const connectBtn = document.getElementById('w-connect-btn');
    const wDot = document.getElementById('w-dot');
    const wStatus = document.getElementById('w-status');
    const wAddr = document.getElementById('w-addr');

    const statWalletBal = document.getElementById('stat-wallet-bal');
    const statLockedTvl = document.getElementById('stat-locked-tvl');
    const statLockedPercent = document.getElementById('stat-locked-percent');
    const statBurnedCltr = document.getElementById('stat-burned-cltr');
    const statBurnedRatio = document.getElementById('stat-burned-ratio');

    const stakeInput = document.getElementById('stake-input');
    const maxBtn = document.getElementById('stake-max-btn');
    const stakeBtn = document.getElementById('stake-btn');
    const durationPills = document.querySelectorAll('.cltr-duration-pill');
    const sumApy = document.getElementById('sum-apy');
    const sumYield = document.getElementById('sum-yield');
    const sumTotal = document.getElementById('sum-total');

    const stakesCount = document.getElementById('stakes-count');
    const stakesTbody = document.getElementById('stakes-tbody');

    const txModal = document.getElementById('tx-modal');
    const txTitle = document.getElementById('tx-title');
    const txSub = document.getElementById('tx-sub');

    // Vesting Elements
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

    // State Variables (with persistent store)
    let isConnected = localStorage.getItem('cltr_wallet_connected') === 'true';
    let balance = parseFloat(localStorage.getItem('cltr_wallet_balance') || '250000');
    let stakedBalance = parseFloat(localStorage.getItem('cltr_staked_balance') || '0');
    let activeAPY = 5;
    let activeDuration = 30;

    // Vesting Timelines
    const vestingStart = 1717171200; // June 1, 2024
    const vestingDuration = 4 * 365 * 24 * 60 * 60; // 4 Years in seconds
    const vestingCliff = 365 * 24 * 60 * 60; // 1 Year in seconds
    
    // Claimed tracking
    let founderClaimed = parseFloat(localStorage.getItem('cltr_founder_claimed') || '0');
    let teamClaimed = parseFloat(localStorage.getItem('cltr_team_claimed') || '0');

    // APY helper
    function getAPY(days) {
        if (days === 30) return 5;
        if (days === 90) return 10;
        if (days === 180) return 15;
        if (days === 365) return 25;
        return 5;
    }

    // Number Formatter
    function formatNumber(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Update Global Display Statistics
    function updateStats() {
        if (!isConnected) {
            statWalletBal.innerText = '—';
            statLockedTvl.innerText = '—';
            statLockedPercent.innerText = '—';
            statBurnedCltr.innerText = '12,450,230';
            statBurnedRatio.innerText = '1.25% Burn rate';
            return;
        }

        statWalletBal.innerText = formatNumber(balance);
        statLockedTvl.innerText = formatNumber(182450000 + stakedBalance);
        
        const tvlPercent = ((182450000 + stakedBalance) / 1000000000) * 100;
        statLockedPercent.innerText = `${tvlPercent.toFixed(2)}% of supply locked`;

        statBurnedCltr.innerText = '12,450,230';
        statBurnedRatio.innerText = '1.25% Burn rate';
    }

    // Load active stakes list
    function getStakes() {
        try {
            return JSON.parse(localStorage.getItem('cltr_stakes_list') || '[]');
        } catch(e) {
            return [];
        }
    }

    function saveStakes(list) {
        localStorage.setItem('cltr_stakes_list', JSON.stringify(list));
    }

    // Update Staking Summary card values
    function updateStakeSummary() {
        const amt = parseFloat(stakeInput.value) || 0;
        const interest = amt * (activeAPY / 100) * (activeDuration / 365);
        sumApy.innerText = `${activeAPY.toFixed(1)}%`;
        sumYield.innerText = `${formatNumber(interest)} CLTR`;
        sumTotal.innerText = `${formatNumber(amt + interest)} CLTR`;

        if (amt > 0 && amt <= balance) {
            stakeBtn.removeAttribute('disabled');
        } else {
            stakeBtn.setAttribute('disabled', 'true');
        }
    }

    // Render Stakes Table
    function renderStakesTable() {
        if (!isConnected) {
            stakesTbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:#999; padding: 24px;">Connect wallet to view active locked positions.</td>
                </tr>
            `;
            stakesCount.innerText = '0 Stakes';
            return;
        }

        const list = getStakes();
        stakesCount.innerText = `${list.length} Stake${list.length === 1 ? '' : 's'}`;

        if (list.length === 0) {
            stakesTbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:#999; padding: 24px;">No active stakes. Select duration and amount above to commit.</td>
                </tr>
            `;
            return;
        }

        const now = Date.now();
        stakesTbody.innerHTML = list.map((item, index) => {
            const start = item.startTime;
            const end = item.endTime;
            const duration = end - start;
            const elapsed = now - start;
            let progress = Math.min(100, Math.max(0, (elapsed / duration) * 100));
            const isMatured = now >= end;

            // Format dates
            const startDateStr = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
            const endDateStr = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

            const statusBadge = isMatured 
                ? `<span class="cltr-badge matured">Matured</span>` 
                : `<span class="cltr-badge locked">Locked</span>`;

            const actionBtn = `<button class="cltr-unstake-btn" data-index="${index}" ${isMatured ? '' : 'disabled'}>Unstake</button>`;

            return `
                <tr>
                    <td><strong>${formatNumber(item.amount)} CLTR</strong></td>
                    <td>${item.durationDays} Days @ ${item.apy}%</td>
                    <td>
                        <div class="cltr-stake-progress">
                            <div class="cltr-stake-progress-fill" style="width: ${progress}%"></div>
                        </div>
                        ${endDateStr}
                    </td>
                    <td style="color:#10B981;">+${formatNumber(item.yield)}</td>
                    <td>${statusBadge}</td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        }).join('');

        // Wire up unstake buttons
        document.querySelectorAll('.cltr-unstake-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                executeUnstake(idx);
            });
        });
    }

    // Ticking Live Vesting Data
    let vestingInterval = null;
    function startVestingTicker() {
        if (vestingInterval) clearInterval(vestingInterval);

        function tick() {
            if (!isConnected) return;

            const nowSec = Math.floor(Date.now() / 1000);
            const elapsed = nowSec - vestingStart;

            // 1. Founder Vesting Calculation (50M CLTR)
            const founderTotal = 50000000;
            let founderVested = 0;
            let founderClaimable = 0;
            let founderTimeText = '';
            let founderProgressPct = 0;

            if (elapsed >= vestingCliff) {
                founderVested = Math.min(founderTotal, (founderTotal * elapsed) / vestingDuration);
                founderClaimable = Math.max(0, founderVested - founderClaimed);
                founderProgressPct = (elapsed / vestingDuration) * 100;

                if (elapsed >= vestingDuration) {
                    founderTimeText = 'Fully Vested';
                    founderProgressPct = 100;
                } else {
                    const daysLeft = Math.ceil((vestingDuration - elapsed) / (24 * 60 * 60));
                    founderTimeText = `${daysLeft} days remaining`;
                }
            } else {
                founderTimeText = 'Locked (Cliff: 1 Year)';
                founderProgressPct = (elapsed / vestingCliff) * 25; // fake progress pre-cliff
            }

            // Update Founder DOM
            founderProgress.style.width = `${Math.min(100, founderProgressPct)}%`;
            founderVestedLabel.innerText = `${formatNumber(founderVested)} CLTR`;
            founderTimeRemaining.innerText = founderTimeText;
            founderClaimableLabel.innerText = `${formatNumber(founderClaimable)} CLTR`;
            if (founderClaimable > 1) {
                founderClaimBtn.removeAttribute('disabled');
            } else {
                founderClaimBtn.setAttribute('disabled', 'true');
            }

            // 2. Team Vesting Calculation (150M CLTR)
            const teamTotal = 150000000;
            let teamVested = 0;
            let teamClaimable = 0;
            let teamTimeText = '';
            let teamProgressPct = 0;

            if (elapsed >= vestingCliff) {
                teamVested = Math.min(teamTotal, (teamTotal * elapsed) / vestingDuration);
                teamClaimable = Math.max(0, teamVested - teamClaimed);
                teamProgressPct = (elapsed / vestingDuration) * 100;

                if (elapsed >= vestingDuration) {
                    teamTimeText = 'Fully Vested';
                    teamProgressPct = 100;
                } else {
                    const daysLeft = Math.ceil((vestingDuration - elapsed) / (24 * 60 * 60));
                    teamTimeText = `${daysLeft} days remaining`;
                }
            } else {
                teamTimeText = 'Locked (Cliff: 1 Year)';
                teamProgressPct = (elapsed / vestingCliff) * 25;
            }

            // Update Team DOM
            teamProgress.style.width = `${Math.min(100, teamProgressPct)}%`;
            teamVestedLabel.innerText = `${formatNumber(teamVested)} CLTR`;
            teamTimeRemaining.innerText = teamTimeText;
            teamClaimableLabel.innerText = `${formatNumber(teamClaimable)} CLTR`;
            if (teamClaimable > 1) {
                teamClaimBtn.removeAttribute('disabled');
            } else {
                teamClaimBtn.setAttribute('disabled', 'true');
            }
        }

        tick();
        vestingInterval = setInterval(tick, 1000);
    }

    // Toggle Connection States
    function updateConnectionUI() {
        if (isConnected) {
            wDot.classList.add('connected');
            wStatus.innerText = 'METAMASK CONNECTED';
            wStatus.style.color = '#10B981';
            wAddr.innerText = '0x71C...896e';
            connectBtn.innerText = 'DISCONNECT';
            connectBtn.classList.add('connected');

            // Enable Staking Box
            stakeInput.removeAttribute('disabled');
            durationPills.forEach(p => p.removeAttribute('disabled'));
        } else {
            wDot.classList.remove('connected');
            wStatus.innerText = 'DISCONNECTED';
            wStatus.style.color = '#111';
            wAddr.innerText = '—';
            connectBtn.innerText = 'CONNECT WALLET';
            connectBtn.classList.remove('connected');

            // Disable Staking Box
            stakeInput.setAttribute('disabled', 'true');
            stakeInput.value = '';
            durationPills.forEach(p => p.setAttribute('disabled', 'true'));
            stakeBtn.setAttribute('disabled', 'true');

            // Reset Vesting Cards labels
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

            if (vestingInterval) clearInterval(vestingInterval);
        }

        updateStats();
        renderStakesTable();
    }

    // Trigger Wallet Connect animation
    connectBtn.addEventListener('click', function() {
        if (isConnected) {
            // Disconnect Flow
            isConnected = false;
            localStorage.setItem('cltr_wallet_connected', 'false');
            updateConnectionUI();
        } else {
            // Connect Flow with simulated latency
            txTitle.innerText = 'Connecting Web3 Wallet';
            txSub.innerText = 'Please sign the connection request in your wallet extension.';
            txModal.classList.add('open');

            setTimeout(() => {
                txModal.classList.remove('open');
                isConnected = true;
                localStorage.setItem('cltr_wallet_connected', 'true');
                updateConnectionUI();
                startVestingTicker();
            }, 1000);
        }
    });

    // Staking input listener
    stakeInput.addEventListener('input', updateStakeSummary);
    maxBtn.addEventListener('click', function() {
        if (!isConnected) return;
        stakeInput.value = balance;
        updateStakeSummary();
    });

    // Duration pills handler
    durationPills.forEach(pill => {
        pill.addEventListener('click', function() {
            if (!isConnected) return;
            durationPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            activeDuration = parseInt(this.getAttribute('data-days'));
            activeAPY = getAPY(activeDuration);
            updateStakeSummary();
        });
    });

    // Stake Execution
    stakeBtn.addEventListener('click', function() {
        const amt = parseFloat(stakeInput.value) || 0;
        if (amt <= 0 || amt > balance) return;

        txTitle.innerText = 'Executing Stake Commitment';
        txSub.innerText = `Locking ${formatNumber(amt)} CLTR in staking contract for ${activeDuration} days...`;
        txModal.classList.add('open');

        setTimeout(() => {
            txTitle.innerText = 'Broadcasting Transaction';
            txSub.innerText = 'Confirming block state on Robinhood Chain…';
        }, 1500);

        setTimeout(() => {
            txModal.classList.remove('open');
            
            // Deduct balance and update TVL
            balance -= amt;
            stakedBalance += amt;
            localStorage.setItem('cltr_wallet_balance', balance.toString());
            localStorage.setItem('cltr_staked_balance', stakedBalance.toString());

            // Add to active stakes list
            const list = getStakes();
            const now = Date.now();
            const durationMs = activeDuration * 24 * 60 * 60 * 1000;
            
            list.push({
                amount: amt,
                durationDays: activeDuration,
                apy: activeAPY,
                startTime: now,
                endTime: now + durationMs,
                yield: amt * (activeAPY / 100) * (activeDuration / 365)
            });
            saveStakes(list);

            // Reset inputs
            stakeInput.value = '';
            updateStakeSummary();
            updateStats();
            renderStakesTable();

            // Simple browser alert for success confirmation
            alert(`✅ Staking Successful!\n\nLocked ${formatNumber(amt)} CLTR at ${activeAPY}% APY for ${activeDuration} days.`);
        }, 3000);
    });

    // Unstake Execution
    function executeUnstake(index) {
        const list = getStakes();
        const item = list[index];
        if (!item) return;

        txTitle.innerText = 'Releasing Staked Balance';
        txSub.innerText = `Unstaking ${formatNumber(item.amount)} CLTR + ${formatNumber(item.yield)} Yield...`;
        txModal.classList.add('open');

        setTimeout(() => {
            txModal.classList.remove('open');

            // Credit balance
            const payout = item.amount + item.yield;
            balance += payout;
            stakedBalance -= item.amount;

            localStorage.setItem('cltr_wallet_balance', balance.toString());
            localStorage.setItem('cltr_staked_balance', stakedBalance.toString());

            // Remove from list
            list.splice(index, 1);
            saveStakes(list);

            updateStats();
            renderStakesTable();

            alert(`✅ Unstaked Successful!\n\nCredited ${formatNumber(payout)} CLTR to your wallet.`);
        }, 2000);
    }

    // Release Vesting Tokens
    founderClaimBtn.addEventListener('click', function() {
        const nowSec = Math.floor(Date.now() / 1000);
        const elapsed = nowSec - vestingStart;
        const founderTotal = 50000000;
        const founderVested = Math.min(founderTotal, (founderTotal * elapsed) / vestingDuration);
        const claimable = founderVested - founderClaimed;

        if (claimable <= 0) return;

        txTitle.innerText = 'Releasing Vested Tokens';
        txSub.innerText = `Withdrawing ${formatNumber(claimable)} CLTR to beneficiary address…`;
        txModal.classList.add('open');

        setTimeout(() => {
            txModal.classList.remove('open');

            balance += claimable;
            founderClaimed += claimable;

            localStorage.setItem('cltr_wallet_balance', balance.toString());
            localStorage.setItem('cltr_founder_claimed', founderClaimed.toString());

            updateStats();
            alert(`✅ Release Successful!\n\nTransferred ${formatNumber(claimable)} CLTR to your wallet.`);
        }, 2000);
    });

    teamClaimBtn.addEventListener('click', function() {
        const nowSec = Math.floor(Date.now() / 1000);
        const elapsed = nowSec - vestingStart;
        const teamTotal = 150000000;
        const teamVested = Math.min(teamTotal, (teamTotal * elapsed) / vestingDuration);
        const claimable = teamVested - teamClaimed;

        if (claimable <= 0) return;

        txTitle.innerText = 'Releasing Vested Tokens';
        txSub.innerText = `Withdrawing ${formatNumber(claimable)} CLTR to team wallet…`;
        txModal.classList.add('open');

        setTimeout(() => {
            txModal.classList.remove('open');

            balance += claimable;
            teamClaimed += claimable;

            localStorage.setItem('cltr_wallet_balance', balance.toString());
            localStorage.setItem('cltr_team_claimed', teamClaimed.toString());

            updateStats();
            alert(`✅ Release Successful!\n\nTransferred ${formatNumber(claimable)} CLTR to your wallet.`);
        }, 2000);
    });

    // Initialize UI state
    updateConnectionUI();
    if (isConnected) {
        startVestingTicker();
    }
}
