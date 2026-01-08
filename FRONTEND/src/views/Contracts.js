// Contract Wizard V1.5 - Premium Step Header + Progress Bar
// Aesthetic: "Apple settings stepper meets institutional terminal system"

export function renderContracts() {
    return `
        <style>
            /* === GLOBAL ACCENT TOKENS === */
            :root {
                --accent-red: #8B1E1E;
                --accent-gold: #C9A227;
                --ink: #111111;
                --muted: #666666;
                --light: #999999;
                --border: rgba(0,0,0,0.12);
                --border-strong: rgba(0,0,0,0.22);
                --panel: rgba(0,0,0,0.02);
                --step-active-bg: rgba(139,30,30,0.03);
            }
            
            /* Typography Scale */
            .text-display-lg { font-size: 3.5rem; letter-spacing: -0.03em; line-height: 0.95; font-weight: 700; color: var(--ink); }
            .text-display-md { font-size: 2rem; letter-spacing: -0.02em; line-height: 1; font-weight: 600; color: var(--ink); }
            .text-body-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.75rem; letter-spacing: 0.05em; }
            .text-body-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; font-size: 1.125rem; line-height: 1.6; color: var(--muted); }
            .text-legal { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 0.75rem; color: var(--muted); letter-spacing: 0.01em; }
            
            /* Accent Colors */
            .text-accent-red { color: var(--accent-red); }
            .text-accent-gold { color: var(--accent-gold); }
            
            /* Reward Chip (Gold) */
            .reward-chip {
                display: inline-block;
                border: 1px solid var(--accent-gold);
                color: var(--accent-gold);
                background: transparent;
                font-family: ui-monospace, monospace;
                font-size: 0.65rem;
                font-weight: 600;
                letter-spacing: 0.05em;
                padding: 4px 8px;
                text-transform: uppercase;
            }
            
            /* Cards */
            .card-standard {
                border: 1px solid var(--border);
                background: #ffffff;
                transition: all 0.15s ease;
                cursor: pointer;
            }
            .card-standard:hover {
                border-color: var(--border-strong);
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }
            .card-selected {
                border: 2px solid var(--ink) !important;
                background: #fafafa;
            }
            .card-disabled {
                opacity: 0.5;
                cursor: not-allowed;
                pointer-events: none;
            }
            
            /* Authority Details Panel */
            .authority-panel {
                display: none;
                border: 1px solid var(--border);
                background: var(--panel);
                border-left: 2px solid var(--accent-gold);
            }
            .authority-panel.visible { display: block; }
            
            /* Headline Accent Underline */
            .headline-accent::after {
                content: '';
                display: block;
                width: 60px;
                height: 2px;
                background: var(--accent-red);
                margin-top: 12px;
            }
            
            /* === STEP HEADER === */
            .step-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 48px;
                height: 72px;
                background: #ffffff;
                border-bottom: 1px solid var(--border);
            }
            
            .step-nav {
                display: flex;
                align-items: center;
                gap: 48px;
            }
            
            .step-item {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: default;
                position: relative;
                padding-bottom: 4px;
            }
            
            .step-item.clickable { cursor: pointer; }
            .step-item.clickable:hover .step-label { color: var(--ink); }
            
            .step-number {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 12px;
                letter-spacing: 0.1em;
                color: var(--light);
                transition: color 0.2s;
            }
            
            .step-label {
                font-size: 14px;
                font-weight: 600;
                color: var(--light);
                transition: color 0.2s;
            }
            
            /* Step States */
            .step-item.active .step-number { color: var(--muted); }
            .step-item.active .step-label { color: var(--ink); }
            .step-item.active::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                right: 0;
                height: 2px;
                background: var(--accent-red);
            }
            
            .step-item.completed .step-number { color: var(--muted); }
            .step-item.completed .step-label { color: var(--ink); font-weight: 500; }
            .step-item.completed .step-check {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                background: var(--accent-red);
                color: white;
                font-size: 10px;
                margin-left: 6px;
            }
            
            .step-check { display: none; }
            
            .step-status {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                letter-spacing: 0.05em;
                color: var(--light);
                text-transform: uppercase;
            }
            
            /* === PROGRESS BAR === */
            .progress-container {
                position: relative;
                height: 3px;
                background: #f0f0f0;
                overflow: hidden;
            }
            
            .progress-fill {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: var(--accent-red);
                width: 0%;
                transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Utility */
            .no-radius { border-radius: 0 !important; }
            .hold-progress { width: 0%; transition: width 0s linear; }
            .holding .hold-progress { width: 100%; transition: width 3s linear; }
            .section-box { border: 1px solid var(--border); padding: 1.5rem; background: var(--panel); }
            
            /* === METRIC STATUS CARD === */
            .metric-status-card {
                border: 1px solid var(--border);
                background: #ffffff;
                padding: 1.5rem;
            }
            .metric-status-card .card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid var(--border);
            }
            .metric-status-card .card-title {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: var(--muted);
                text-transform: uppercase;
            }
            .metric-status-card .card-subtext {
                font-size: 11px;
                color: var(--light);
                margin-top: 4px;
            }
            .metric-status-card .authority-badge {
                font-family: ui-monospace, monospace;
                font-size: 9px;
                letter-spacing: 0.05em;
                color: var(--muted);
                background: #f5f5f5;
                border: 1px solid var(--border);
                padding: 3px 8px;
                text-transform: uppercase;
            }
            .metric-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
                margin-bottom: 1rem;
            }
            .metric-col label {
                display: block;
                font-family: ui-monospace, monospace;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: var(--light);
                text-transform: uppercase;
                margin-bottom: 6px;
            }
            .metric-col .metric-value {
                font-family: ui-monospace, monospace;
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--ink);
                letter-spacing: -0.02em;
            }
            .metric-col .metric-meta {
                font-size: 10px;
                color: var(--light);
                margin-top: 4px;
            }
            .metric-delta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 0;
                border-top: 1px solid var(--border);
                border-bottom: 1px solid var(--border);
                margin-bottom: 1rem;
            }
            .metric-delta label {
                font-family: ui-monospace, monospace;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: var(--light);
                text-transform: uppercase;
            }
            .metric-delta .delta-value {
                font-family: ui-monospace, monospace;
                font-size: 1rem;
                font-weight: 700;
                color: var(--accent-red);
            }
            .metric-progress-container {
                height: 2px;
                background: #e5e5e5;
                position: relative;
                margin-bottom: 0.75rem;
            }
            .metric-progress-fill {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: var(--accent-red);
                transition: width 300ms ease;
            }
            .metric-microcopy {
                font-size: 10px;
                color: var(--light);
                line-height: 1.5;
            }
            
            /* Active Step Background Tint */
            .step-content-active { background: var(--step-active-bg); }
        </style>

        <div class="h-[calc(100vh-64px)] flex flex-col bg-white font-sans text-black overflow-hidden relative no-radius">
            
            <!-- Step Header -->
            <header class="step-header shrink-0" data-current-step="1">
                <nav class="step-nav">
                    <div class="step-item active" data-step="1" onclick="window.wizard.goToStep(1)">
                        <span class="step-number">01</span>
                        <span class="step-label">Profile</span>
                        <span class="step-check">✓</span>
                    </div>
                    <div class="step-item" data-step="2" onclick="window.wizard.goToStep(2)">
                        <span class="step-number">02</span>
                        <span class="step-label">Source</span>
                        <span class="step-check">✓</span>
                    </div>
                    <div class="step-item" data-step="3" onclick="window.wizard.goToStep(3)">
                        <span class="step-number">03</span>
                        <span class="step-label">Lock</span>
                        <span class="step-check">✓</span>
                    </div>
                </nav>
                <div class="step-status">S: Ready</div>
            </header>
            
            <!-- Progress Bar -->
            <div class="progress-container">
                <div class="progress-fill" id="progress-fill" style="width: 33%;"></div>
            </div>

            <!-- Main Content Area -->
            <main class="flex-1 relative overflow-y-auto flex flex-col px-6 md:px-12 py-8 md:py-16">
                
                <!-- STEP 1: RISK PROFILE -->
                <section id="step-1" class="max-w-5xl mx-auto w-full flex flex-col h-full">
                    <div class="mb-16">
                        <h1 class="text-display-lg headline-accent">Select Exposure</h1>
                        <p class="text-body-serif max-w-xl mt-6">Choose an enforcement profile. This determines your verification threshold and potential multiplier.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <!-- Steady -->
                        <button class="card-standard p-8 text-left flex flex-col justify-between h-64"
                             onclick="window.wizard.selectRisk('STEADY', this)">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-500 uppercase">Tier 1</span>
                                <span class="reward-chip">1.5x</span>
                            </div>
                            <div>
                                <h2 class="text-display-md mb-2">Steady</h2>
                                <p class="text-sm text-neutral-500 leading-relaxed">Consistent baseline performance. Low variance expected.</p>
                            </div>
                        </button>

                        <!-- Bold -->
                        <button class="card-standard p-8 text-left flex flex-col justify-between h-64"
                             onclick="window.wizard.selectRisk('BOLD', this)">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-500 uppercase">Tier 2</span>
                                <span class="reward-chip">2.0x</span>
                            </div>
                            <div>
                                <h2 class="text-display-md mb-2">Bold</h2>
                                <p class="text-sm text-neutral-500 leading-relaxed">Significant deviation from baseline. Requires strict discipline.</p>
                            </div>
                        </button>

                        <!-- All-In -->
                        <button class="card-standard p-8 text-left flex flex-col justify-between h-64"
                             onclick="window.wizard.selectRisk('ALL_IN', this)">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-500 uppercase">Tier 3</span>
                                <span class="reward-chip">4.0x</span>
                            </div>
                            <div>
                                <h2 class="text-display-md mb-2">All-In</h2>
                                <p class="text-sm text-neutral-500 leading-relaxed">Maximum exposure. Failure results in immediate <span class="text-accent-red">total forfeiture</span>.</p>
                            </div>
                        </button>
                    </div>

                    <div class="flex justify-end">
                         <button id="btn-step-1" class="bg-black text-white text-body-mono uppercase px-8 py-4 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors" disabled onclick="window.wizard.nextStep()">
                            Confirm Profile →
                        </button>
                    </div>
                </section>


                <!-- STEP 2: METRIC SOURCE -->
                <section id="step-2" class="hidden max-w-5xl mx-auto w-full flex flex-col h-full">
                    <div class="mb-16">
                        <h1 class="text-display-lg headline-accent">Select Authority</h1>
                        <p class="text-body-serif max-w-xl mt-6">Designate the external source of truth. The selected authority will be the sole arbiter of the contract outcome.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-neutral-100 pt-8">
                        <!-- X (Twitter) -->
                        <button class="card-standard p-8 text-left h-52 flex flex-col justify-between group"
                             onclick="window.wizard.selectSource('TWITTER', this)">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-400 uppercase">Oracle_01</span>
                                <span class="text-body-mono text-neutral-400 uppercase text-[10px]">Integrity: High</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold mb-2">X (Twitter)</h3>
                                <p class="text-legal">Public, immutable follower snapshots.</p>
                            </div>
                        </button>

                        <!-- Stripe -->
                        <button class="card-standard p-8 text-left h-52 flex flex-col justify-between group"
                             onclick="window.wizard.selectSource('STRIPE', this)">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-400 uppercase">Oracle_02</span>
                                <span class="text-body-mono text-neutral-400 uppercase text-[10px]">Integrity: Proven</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold mb-2">Stripe</h3>
                                <p class="text-legal">Verified gross revenue from Stripe Connect.</p>
                            </div>
                        </button>

                        <!-- GitHub (Coming Soon) -->
                        <div class="card-standard card-disabled p-8 text-left h-52 flex flex-col justify-between">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-400 uppercase">Oracle_03</span>
                                <span class="text-body-mono text-neutral-300 uppercase text-[10px]">Coming Soon</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold mb-2 text-neutral-400">GitHub</h3>
                                <p class="text-legal">Commit history from GitHub API.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Authority Details Panel (Hidden by Default) -->
                    <div id="authority-panel" class="authority-panel p-6 mb-8">
                        <div class="flex justify-between items-start mb-4">
                            <h4 id="panel-title" class="font-medium text-base"></h4>
                            <span id="panel-integrity" class="text-body-mono text-neutral-500 uppercase text-[10px]"></span>
                        </div>
                        <ul class="space-y-2 text-sm text-neutral-600 mb-4">
                            <li><span class="text-neutral-400 mr-2">•</span><strong>Measured:</strong> <span id="panel-measured"></span></li>
                            <li><span class="text-neutral-400 mr-2">•</span><strong>Verified:</strong> <span id="panel-verified"></span></li>
                            <li><span class="text-neutral-400 mr-2">•</span><strong>Fail Cases:</strong> <span id="panel-failcases"></span></li>
                        </ul>
                        <p class="text-xs text-neutral-500">Binding is <span class="text-accent-red font-medium">irreversible</span> after confirmation.</p>
                    </div>
                    
                    <!-- Metric Preview (Light - Current only) -->
                    <div id="metric-preview" class="metric-status-card mb-8" style="display: none;">
                        <div class="card-header" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">
                            <div>
                                <div class="card-title">Current Signal</div>
                            </div>
                            <span id="preview-authority-badge" class="authority-badge">--</span>
                        </div>
                        <div style="padding-top: 0.75rem;">
                            <div id="preview-current" class="metric-value" style="font-size: 1.5rem;">--</div>
                            <p class="metric-microcopy" style="margin-top: 8px;">This will be snapshotted at execution.</p>
                        </div>
                    </div>
                    
                    <!-- Status Row (Shown when no selection) -->
                    <div id="status-row" class="border-t border-neutral-100 pt-4 mb-16">
                        <p class="text-body-mono text-neutral-400 uppercase">Status: Awaiting selection</p>
                    </div>

                    <div class="flex justify-end pb-40">
                         <button id="btn-step-2" class="bg-black text-white text-body-mono uppercase px-8 py-4 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors" disabled onclick="window.wizard.nextStep()">
                            Bind Authority →
                        </button>
                    </div>
                </section>


                <!-- STEP 3: FINAL LOCK -->
                <section id="step-3" class="hidden max-w-5xl mx-auto w-full flex flex-col h-full">
                    <div class="mb-10">
                        <h1 class="text-display-lg headline-accent">Execute Contract</h1>
                        <p class="text-body-mono text-neutral-500 uppercase mt-6">Ref: <span class="text-black">0x7A...9F</span></p>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
                        <!-- LEFT: Contract Definition -->
                        <div class="space-y-6">
                            <div class="section-box space-y-4">
                                <div class="flex justify-between border-b border-black/5 pb-2">
                                    <span class="text-body-mono text-neutral-500 uppercase">Authority</span>
                                    <span id="final-oracle" class="font-mono text-sm font-semibold">--</span>
                                </div>
                                <div class="flex justify-between border-b border-black/5 pb-2">
                                    <span class="text-body-mono text-neutral-500 uppercase">Condition</span>
                                    <span class="font-mono text-sm">Target > Baseline + 15%</span>
                                </div>
                                <div class="flex justify-between border-b border-black/5 pb-2">
                                    <span class="text-body-mono text-neutral-500 uppercase">Time Window</span>
                                    <span class="font-mono text-sm">30 Days</span>
                                </div>
                                <div class="flex justify-between border-b border-black/5 pb-2">
                                    <span class="text-body-mono text-neutral-500 uppercase">Payout</span>
                                    <span id="final-mult" class="font-mono text-sm font-semibold text-accent-gold">--</span>
                                </div>
                                <div class="flex justify-between pt-2">
                                    <span class="text-body-mono text-neutral-500 uppercase">Failure Outcome</span>
                                    <span class="font-mono text-sm text-accent-red font-semibold">Forfeiture on failure</span>
                                </div>
                            </div>
                            
                            <!-- Metric Status Card -->
                            <div id="metric-status-card" class="metric-status-card">
                                <div class="card-header">
                                    <div>
                                        <div class="card-title">Metric Status</div>
                                        <div class="card-subtext">Snapshot is taken at execution and becomes your baseline.</div>
                                    </div>
                                    <span id="metric-authority-badge" class="authority-badge">Authority Verified</span>
                                </div>
                                
                                <div class="metric-row">
                                    <div class="metric-col">
                                        <label>Current (Baseline)</label>
                                        <div id="metric-current" class="metric-value">--</div>
                                        <div id="metric-recorded" class="metric-meta">Recorded: --</div>
                                    </div>
                                    <div class="metric-col">
                                        <label>Goal</label>
                                        <div id="metric-goal" class="metric-value">--</div>
                                        <div id="metric-deadline" class="metric-meta">Due in -- days</div>
                                    </div>
                                </div>
                                
                                <div class="metric-delta">
                                    <label>Required</label>
                                    <span id="metric-required" class="delta-value">--</span>
                                </div>
                                
                                <div class="metric-progress-container">
                                    <div id="metric-progress-fill" class="metric-progress-fill" style="width: 0%"></div>
                                </div>
                                
                                <p class="metric-microcopy">Outcome evaluated at deadline.</p>
                                <p id="metric-source-note" class="metric-microcopy" style="margin-top: 6px; font-style: italic;">--</p>
                            </div>
                        </div>

                        <!-- RIGHT: Execution -->
                        <div class="flex flex-col">
                            <!-- Capital Allocation -->
                            <div class="section-box mb-6">
                                <label class="text-body-mono text-neutral-400 mb-4 block uppercase">Capital Allocation</label>
                                <div class="flex items-baseline border-b-2 border-neutral-200 focus-within:border-black transition-colors pb-3">
                                    <span class="text-3xl text-neutral-400 mr-2 font-normal">$</span>
                                    <input type="number" value="5000" class="w-full text-4xl font-medium text-neutral-900 bg-transparent border-none outline-none p-0 placeholder-neutral-200" placeholder="0">
                                </div>
                                <p class="text-legal mt-3">This amount will be <span class="text-accent-red">unavailable</span> until resolution.</p>
                            </div>
                            
                            <!-- Execute Button -->
                            <div class="relative select-none">
                                <button id="btn-execute" class="w-full bg-neutral-900 text-white text-body-mono uppercase py-5 relative overflow-hidden transition-colors group hover:bg-black"
                                    onmousedown="window.wizard.startHold()" 
                                    onmouseup="window.wizard.endHold()" 
                                    onmouseleave="window.wizard.endHold()"
                                    ontouchstart="window.wizard.startHold()"
                                    ontouchend="window.wizard.endHold()">
                                    <div id="hold-bar" class="hold-progress absolute top-0 left-0 h-full bg-white/20 z-0"></div>
                                    <span class="relative z-10 flex items-center justify-center gap-2">
                                        <span id="btn-text">Hold to Execute</span>
                                    </span>
                                </button>
                                <p class="text-legal text-center mt-3">Execution finalizes the contract and records the baseline.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quote (below grid) -->
                    <div class="border-t border-neutral-100 pt-6 mt-auto">
                        <p class="font-serif italic text-neutral-600 text-base">"This contract will execute exactly as written."</p>
                        <p class="text-legal mt-1">No manual review. <span class="text-accent-red">No overrides.</span></p>
                    </div>
                </section>
                
                <!-- Footer Spacer (extra clearance for global footer) -->
                <div class="h-32"></div>
            </main>
        </div>`
}

export function initContracts() {
    let currentStep = 1;
    let completedSteps = [];
    let selectedRisk = null;
    let selectedSource = null;
    let holdTimer = null;
    let holdComplete = false;

    // === METRIC STATUS MODULE (Backend-ready) ===
    // Mock data for metric status - will be replaced by API call
    const mockMetricData = {
        'TWITTER': {
            authority: 'X',
            metricType: 'FOLLOWERS',
            baselineValue: 3842,
            currentValue: 3842,
            goalValue: 10000,
            deadlineUtc: '2026-02-04T00:00:00Z',
            recordedAtUtc: '2026-01-04T19:43:00Z'
        },
        'STRIPE': {
            authority: 'STRIPE',
            metricType: 'REVENUE',
            baselineValue: 4224.00,
            currentValue: 4224.00,
            goalValue: 10000.00,
            deadlineUtc: '2026-02-04T00:00:00Z',
            recordedAtUtc: '2026-01-04T19:43:00Z'
        }
    };

    // Backend-ready function stub - replace with real API call later
    // GET /v1/contracts/:id/metric-status
    async function loadMetricStatus(contractId) {
        // TODO: Replace with actual fetch call
        // const response = await fetch(`/v1/contracts/${contractId}/metric-status`);
        // return response.json();

        // Return mock data based on selected source
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockMetricData[selectedSource] || mockMetricData['TWITTER']);
            }, 100);
        });
    }

    // Format number with commas
    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    // Format currency
    function formatCurrency(num) {
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Format date from ISO string
    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    }

    // Calculate days until deadline
    function daysUntil(isoString) {
        const deadline = new Date(isoString);
        const now = new Date();
        const diffMs = deadline - now;
        return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    // Render metric status card
    function renderMetricStatus(data) {
        const isRevenue = data.metricType === 'REVENUE';
        const formatValue = isRevenue ? formatCurrency : formatNumber;
        const unit = isRevenue ? '' : ' followers';

        // Compute derived values
        const required = Math.max(0, data.goalValue - data.currentValue);
        const progress = data.goalValue > data.baselineValue
            ? Math.min(1, Math.max(0, (data.currentValue - data.baselineValue) / (data.goalValue - data.baselineValue)))
            : 0;

        // Update DOM
        const currentEl = document.getElementById('metric-current');
        const goalEl = document.getElementById('metric-goal');
        const recordedEl = document.getElementById('metric-recorded');
        const deadlineEl = document.getElementById('metric-deadline');
        const requiredEl = document.getElementById('metric-required');
        const progressEl = document.getElementById('metric-progress-fill');
        const badgeEl = document.getElementById('metric-authority-badge');
        const sourceNoteEl = document.getElementById('metric-source-note');

        if (currentEl) currentEl.textContent = formatValue(data.currentValue) + unit;
        if (goalEl) goalEl.textContent = formatValue(data.goalValue) + unit;
        if (recordedEl) recordedEl.textContent = 'Recorded: ' + formatDate(data.recordedAtUtc);
        if (deadlineEl) deadlineEl.textContent = 'Due in ' + daysUntil(data.deadlineUtc) + ' days';
        if (requiredEl) requiredEl.textContent = '+' + formatValue(required) + unit;
        if (progressEl) progressEl.style.width = (progress * 100) + '%';

        // Authority-specific content
        if (data.authority === 'X') {
            if (badgeEl) badgeEl.textContent = 'X Verified';
            if (sourceNoteEl) sourceNoteEl.textContent = 'Pulled from X (Twitter) API snapshots.';
        } else if (data.authority === 'STRIPE') {
            if (badgeEl) badgeEl.textContent = 'Stripe Verified';
            if (sourceNoteEl) sourceNoteEl.textContent = 'Verified gross revenue via Stripe Connect.';
        }
    }


    // Authority panel content mapping
    const authorityData = {
        'TWITTER': {
            title: 'Public Signal — X (Twitter)',
            integrity: 'Integrity: High',
            measured: 'Follower count / impressions (public).',
            verified: 'Snapshots taken at execution + at deadline. Public API source-of-truth.',
            failcases: 'Account private/suspended, API unavailable, or verification errors → fail closed.'
        },
        'STRIPE': {
            title: 'Economic Signal — Stripe',
            integrity: 'Integrity: Proven',
            measured: 'Verified revenue (gross or net per contract definition).',
            verified: 'Pulled from your connected Stripe account (proof-of-control required).',
            failcases: 'Disconnected Stripe, missing permissions, Stripe outage → fail closed.'
        }
    };

    // Update progress bar (4 stages: Profile 25%, Source 50%, Lock 75%, Executed 100%)
    function updateProgressBar(step, executed = false) {
        const fill = document.getElementById('progress-fill');
        if (!fill) return;
        if (executed) {
            fill.style.width = '100%';
        } else {
            const percentages = { 1: '25%', 2: '50%', 3: '75%' };
            fill.style.width = percentages[step] || '0%';
        }
    }

    // Update step header UI
    function updateStepHeader(activeStep) {
        const stepItems = document.querySelectorAll('.step-item');
        stepItems.forEach(item => {
            const step = parseInt(item.dataset.step);
            item.classList.remove('active', 'completed', 'clickable');

            if (step === activeStep) {
                item.classList.add('active');
            } else if (completedSteps.includes(step)) {
                item.classList.add('completed', 'clickable');
            }
        });

        // Update status
        const statusText = document.querySelector('.step-status');
        if (statusText) {
            const statusMap = { 1: 'S: Profile', 2: 'S: Source', 3: 'S: Lock' };
            statusText.textContent = statusMap[activeStep] || 'S: Ready';
        }
    }

    window.wizard = {
        // Set active step
        setStep: function (stepNumber) {
            currentStep = stepNumber;

            // Hide all sections, show current
            document.querySelectorAll('section[id^="step-"]').forEach(s => s.classList.add('hidden'));
            const currentSection = document.getElementById('step-' + stepNumber);
            if (currentSection) currentSection.classList.remove('hidden');

            updateStepHeader(stepNumber);
            updateProgressBar(stepNumber);
        },

        // Mark step as completed
        markCompleted: function (stepNumber) {
            if (!completedSteps.includes(stepNumber)) {
                completedSteps.push(stepNumber);
            }
            updateStepHeader(currentStep);
        },

        // Navigate to step (only if completed)
        goToStep: function (stepNumber) {
            if (completedSteps.includes(stepNumber) || stepNumber === currentStep) {
                this.setStep(stepNumber);
            }
        },

        selectRisk: function (risk, el) {
            selectedRisk = risk;
            document.querySelectorAll('#step-1 button').forEach(c => c.classList.remove('card-selected'));
            el.classList.add('card-selected');
            document.getElementById('btn-step-1').disabled = false;
        },

        selectSource: function (source, el) {
            selectedSource = source;
            document.querySelectorAll('#step-2 button').forEach(c => c.classList.remove('card-selected'));
            el.classList.add('card-selected');

            // Show authority panel with correct content
            const panel = document.getElementById('authority-panel');
            const data = authorityData[source];

            if (data) {
                document.getElementById('panel-title').textContent = data.title;
                document.getElementById('panel-integrity').textContent = data.integrity;
                document.getElementById('panel-measured').textContent = data.measured;
                document.getElementById('panel-verified').textContent = data.verified;
                document.getElementById('panel-failcases').textContent = data.failcases;
                panel.classList.add('visible');
                document.getElementById('status-row').classList.add('hidden');
            }

            // Show metric preview (light - current only)
            const metricPreview = document.getElementById('metric-preview');
            const mockData = mockMetricData[source];
            if (metricPreview && mockData) {
                metricPreview.style.display = 'block';

                const isRevenue = mockData.metricType === 'REVENUE';
                const formatValue = isRevenue ? formatCurrency : formatNumber;
                const unit = isRevenue ? '' : ' followers';

                document.getElementById('preview-current').textContent = formatValue(mockData.currentValue) + unit;
                document.getElementById('preview-authority-badge').textContent = source === 'TWITTER' ? 'X' : 'Stripe';
            }

            document.getElementById('btn-step-2').disabled = false;
        },

        nextStep: function () {
            if (currentStep === 1) {
                this.markCompleted(1);
                this.setStep(2);
            } else if (currentStep === 2) {
                this.markCompleted(2);
                this.setStep(3);

                // Populate summary
                let mult = "1.5x";
                if (selectedRisk === 'BOLD') mult = "2.0x";
                if (selectedRisk === 'ALL_IN') mult = "4.0x";
                document.getElementById('final-mult').textContent = mult;

                const sourceNames = { 'TWITTER': 'X (Twitter)', 'STRIPE': 'Stripe', 'GITHUB': 'GitHub' };
                document.getElementById('final-oracle').textContent = sourceNames[selectedSource] || 'Unknown';

                // Load and render metric status
                loadMetricStatus('preview').then(data => {
                    renderMetricStatus(data);
                });
            }
        },

        startHold: function () {
            if (holdComplete) return;
            const btn = document.getElementById('btn-execute');
            btn.classList.add('holding');
            holdTimer = setTimeout(() => { this.completeHold(); }, 2000);
        },

        endHold: function () {
            if (holdComplete) return;
            const btn = document.getElementById('btn-execute');
            btn.classList.remove('holding');
            clearTimeout(holdTimer);
        },

        completeHold: function () {
            holdComplete = true;
            this.markCompleted(3);
            const btn = document.getElementById('btn-execute');
            document.getElementById('btn-text').textContent = "Contract Executed";
            btn.classList.remove('bg-neutral-900');
            btn.classList.add('bg-black', 'cursor-default');
            btn.disabled = true;

            // Update status
            const statusText = document.querySelector('.step-status');
            if (statusText) statusText.textContent = 'S: Complete';

            // Fill progress bar to 100%
            updateProgressBar(3, true);
        }
    };

    // Initialize progress bar on load
    updateProgressBar(1);
}
