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
                --error-bg: #0a0a0a;
                --error-border: rgba(139,30,30,0.25);
                --error-accent: #8B1E1E;
                --error-accent-muted: rgba(139,30,30,0.6);
            }
            
            /* === ENFORCEMENT MODAL === */
            .enforcement-overlay {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.75);
                backdrop-filter: blur(2px);
                z-index: 9999;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .enforcement-overlay.visible {
                display: flex;
                animation: enforceFadeIn 0.14s ease-out;
            }
            @keyframes enforceFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .enforcement-modal {
                background: linear-gradient(180deg, #0c0c0c 0%, #0a0a0a 100%);
                border: 1px solid var(--error-border);
                border-radius: 14px;
                max-width: 440px;
                width: 100%;
                overflow: hidden;
                animation: enforceSlideUp 0.16s ease-out;
                box-shadow: 0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset;
            }
            @keyframes enforceSlideUp {
                from { opacity: 0; transform: translateY(6px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Top status bar line */
            .enforcement-status-bar {
                height: 2px;
                background: linear-gradient(90deg, var(--error-accent) 0%, transparent 100%);
            }
            
            /* Header with icon */
            .enforcement-header {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 16px 24px 0 24px;
            }
            .enforcement-icon {
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .enforcement-icon svg {
                width: 16px;
                height: 16px;
                color: var(--error-accent-muted);
            }
            .enforcement-label {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--error-accent-muted);
            }
            
            /* Title */
            .enforcement-title {
                font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
                font-size: 20px;
                font-weight: 600;
                letter-spacing: -0.02em;
                color: #ffffff;
                padding: 12px 24px 0 24px;
                line-height: 1.3;
            }
            
            /* Body */
            .enforcement-body {
                padding: 16px 24px 20px 24px;
            }
            .enforcement-message {
                font-family: ui-sans-serif, system-ui, sans-serif;
                font-size: 14px;
                line-height: 1.6;
                color: #888;
            }
            .enforcement-message strong {
                color: #ccc;
                font-weight: 500;
            }
            
            /* Rule ID (subtle) */
            .enforcement-rule {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                letter-spacing: 0.05em;
                color: #444;
                padding: 0 24px 16px 24px;
            }
            
            /* Footer */
            .enforcement-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 16px 24px;
                border-top: 1px solid rgba(255,255,255,0.05);
                background: rgba(0,0,0,0.3);
            }
            .enforcement-btn {
                font-family: ui-sans-serif, system-ui, sans-serif;
                font-size: 13px;
                font-weight: 500;
                padding: 10px 18px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.12s ease;
            }
            .enforcement-btn-secondary {
                background: transparent;
                color: #777;
                border: 1px solid #333;
            }
            .enforcement-btn-secondary:hover {
                background: rgba(255,255,255,0.03);
                color: #aaa;
                border-color: #444;
            }
            .enforcement-btn-primary {
                background: var(--error-accent);
                color: #fff;
                border: none;
            }
            .enforcement-btn-primary:hover {
                background: #a02828;
            }
            
            /* Mobile responsive */
            @media (max-width: 480px) {
                .enforcement-modal {
                    border-radius: 12px;
                }
                .enforcement-title {
                    font-size: 18px;
                }
                .enforcement-footer {
                    flex-direction: column-reverse;
                    gap: 8px;
                }
                .enforcement-btn {
                    width: 100%;
                    text-align: center;
                }
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
                    
                    <!-- X VERIFICATION PANEL (Shows when X is selected) -->
                    <div id="x-verify-panel" class="border border-neutral-200 bg-white p-6 mb-8" style="display: none;">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-medium text-base">Verify X Account</h4>
                            <span id="x-verify-status" class="text-body-mono text-neutral-400 uppercase text-[10px]">Not Verified</span>
                        </div>
                        
                        <!-- Step 1: Enter Username -->
                        <div id="x-verify-step1">
                            <label class="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-2">X Username</label>
                            <div class="flex gap-3">
                                <div class="flex-1 flex items-center border border-neutral-200 focus-within:border-neutral-900 transition-colors">
                                    <span class="text-neutral-400 pl-3">@</span>
                                    <input type="text" id="x-username-input" 
                                        class="flex-1 px-2 py-3 text-sm font-mono bg-transparent border-none outline-none" 
                                        placeholder="yourhandle">
                                </div>
                                <button onclick="window.wizard.generateVerifyCode()" id="x-generate-btn"
                                    class="px-4 py-3 bg-neutral-900 text-white text-[11px] font-medium uppercase tracking-wide hover:bg-black transition-colors">
                                    Generate Code
                                </button>
                            </div>
                        </div>
                        
                        <!-- Step 2: Show Code & Verify (Hidden initially) -->
                        <div id="x-verify-step2" class="hidden mt-6">
                            <div class="bg-neutral-50 border border-neutral-200 p-4 mb-4">
                                <label class="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-2">Add this code to your X bio</label>
                                <div class="flex items-center justify-between">
                                    <code id="x-verify-code" class="font-mono text-lg font-semibold text-neutral-900 tracking-wide">COL-XXXXXX</code>
                                    <button onclick="window.wizard.copyVerifyCode()" class="text-neutral-400 hover:text-neutral-900 transition-colors">
                                        <i data-lucide="copy" class="w-4 h-4"></i>
                                    </button>
                                </div>
                                <p class="text-xs text-neutral-500 mt-2">The code must be visible in your public bio when you click verify.</p>
                            </div>
                            
                            <div class="flex gap-3">
                                <a id="x-profile-link" href="https://twitter.com/settings/profile" target="_blank" rel="noopener"
                                    class="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 text-neutral-600 text-[11px] font-medium uppercase tracking-wide hover:border-neutral-400 transition-colors">
                                    <i data-lucide="external-link" class="w-3 h-3"></i>
                                    Edit X Bio
                                </a>
                                <button onclick="window.wizard.verifyXAccount()" id="x-verify-btn"
                                    class="flex-1 px-4 py-3 bg-neutral-900 text-white text-[11px] font-medium uppercase tracking-wide hover:bg-black transition-colors">
                                    Verify Account
                                </button>
                            </div>
                        </div>
                        
                        <!-- Verified State (Hidden initially) -->
                        <div id="x-verify-success" class="hidden mt-4">
                            <div class="flex items-center gap-3 p-4 bg-[#E8F4ED] border border-[#1F7A4D]/20">
                                <div class="w-8 h-8 bg-[#1F7A4D] rounded-full flex items-center justify-center">
                                    <i data-lucide="check" class="w-4 h-4 text-white"></i>
                                </div>
                                <div>
                                    <p class="font-sans text-sm font-medium text-[#1F7A4D]">Account Verified</p>
                                    <p id="x-verified-handle" class="font-mono text-[11px] text-neutral-500">@handle • Connected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- STRIPE CONNECT PANEL (Shows when Stripe is selected) -->
                    <div id="stripe-verify-panel" class="border border-neutral-200 bg-white p-6 mb-8" style="display: none;">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-medium text-base">Connect Stripe Account</h4>
                            <span id="stripe-verify-status" class="text-body-mono text-neutral-400 uppercase text-[10px]">Not Connected</span>
                        </div>
                        
                        <!-- Step 1: Connect Button -->
                        <div id="stripe-connect-step1">
                            <p class="text-sm text-neutral-600 mb-4">Connect your Stripe account to enable revenue verification. We'll use read-only access to verify your revenue metrics.</p>
                            <button onclick="window.wizard.startStripeConnect()" id="stripe-connect-btn"
                                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#635bff] text-white text-[11px] font-medium uppercase tracking-wide hover:bg-[#5851eb] transition-colors">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
                                Connect with Stripe
                            </button>
                        </div>
                        
                        <!-- Connected State (Hidden initially) -->
                        <div id="stripe-connect-success" class="hidden">
                            <div class="flex items-center gap-3 p-4 bg-[#E8F4ED] border border-[#1F7A4D]/20">
                                <div class="w-8 h-8 bg-[#1F7A4D] rounded-full flex items-center justify-center">
                                    <i data-lucide="check" class="w-4 h-4 text-white"></i>
                                </div>
                                <div>
                                    <p class="font-sans text-sm font-medium text-[#1F7A4D]">Stripe Connected</p>
                                    <p id="stripe-account-id" class="font-mono text-[11px] text-neutral-500">acct_xxx • Connected</p>
                                </div>
                            </div>
                        </div>
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

    // X Verification state
    let xVerified = false;
    let xUsername = null;
    let xVerifyCode = null;

    // Stripe Connect state
    let stripeVerified = false;
    let stripeAccountId = null;

    // =========================================================
    // ENFORCEMENT MODAL - Institutional rule enforcement notices
    // =========================================================
    const showEnforcementModal = ({
        title = 'Policy Block',
        message = '',
        ruleId = null,
        primaryText = null,
        primaryAction = null,
        secondaryText = 'Dismiss'
    } = {}) => {
        // Remove any existing modal
        const existing = document.getElementById('enforcement-overlay');
        if (existing) existing.remove();

        // Shield icon SVG
        const shieldIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

        // Create modal HTML
        const modalHTML = `
            <div id="enforcement-overlay" class="enforcement-overlay visible">
                <div class="enforcement-modal">
                    <div class="enforcement-status-bar"></div>
                    <div class="enforcement-header">
                        <div class="enforcement-icon">${shieldIcon}</div>
                        <span class="enforcement-label">Enforcement</span>
                    </div>
                    <div class="enforcement-title">${title}</div>
                    <div class="enforcement-body">
                        <div class="enforcement-message">${message}</div>
                    </div>
                    ${ruleId ? `<div class="enforcement-rule">Rule: ${ruleId}</div>` : ''}
                    <div class="enforcement-footer">
                        <button class="enforcement-btn enforcement-btn-secondary" id="enforcement-dismiss">${secondaryText}</button>
                        ${primaryText ? `<button class="enforcement-btn enforcement-btn-primary" id="enforcement-primary">${primaryText}</button>` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Event listeners
        const overlay = document.getElementById('enforcement-overlay');
        const dismissBtn = document.getElementById('enforcement-dismiss');
        const primaryBtn = document.getElementById('enforcement-primary');

        const closeModal = () => overlay?.remove();

        dismissBtn?.addEventListener('click', closeModal);
        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        }, { once: true });

        if (primaryBtn && primaryAction) {
            primaryBtn.addEventListener('click', () => {
                closeModal();
                primaryAction();
            });
        }
    };

    // Error-to-enforcement mapping
    const showErrorModal = (rawMessage, { code = null, title = null, actionText = null, onAction = null, activeContractId = null } = {}) => {
        // Map specific error codes to enforcement-style messages
        const enforcementMappings = {
            'MAX_ACTIVE_CONTRACT_PER_PLATFORM': {
                title: 'One active contract per platform',
                message: `You already have an active contract on <strong>${selectedSource === 'TWITTER' ? 'X' : 'Stripe'}</strong>.<br><br>To protect against duplicate commitments, only <strong>1 active contract</strong> per platform is allowed.`,
                ruleId: 'MAX_ACTIVE_PER_PLATFORM',
                primaryText: activeContractId ? 'View Active Contract' : null,
                primaryAction: activeContractId ? () => window.router.navigate('/contracts/' + activeContractId) : null
            },
            'PLATFORM_NOT_CONNECTED': {
                title: 'Platform connection required',
                message: `Connect your <strong>${selectedSource === 'TWITTER' ? 'X (Twitter)' : 'Stripe'}</strong> account before creating a contract.`,
                ruleId: 'REQUIRE_PLATFORM_CONNECTION',
                primaryText: 'Connect Account',
                primaryAction: () => {
                    const panel = selectedSource === 'TWITTER' ? document.getElementById('x-verify-panel') : document.getElementById('stripe-connect-panel');
                    panel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            },
            'PLATFORM_NOT_VERIFIED': {
                title: 'Verification incomplete',
                message: `Complete verification for your <strong>${selectedSource === 'TWITTER' ? 'X' : 'Stripe'}</strong> account to proceed.`,
                ruleId: 'REQUIRE_VERIFIED_CONNECTION',
                primaryText: 'Complete Verification',
                primaryAction: () => {
                    const panel = selectedSource === 'TWITTER' ? document.getElementById('x-verify-panel') : document.getElementById('stripe-connect-panel');
                    panel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            },
            'PLATFORM_CONNECTION_INACTIVE': {
                title: 'Connection revoked',
                message: `Your <strong>${selectedSource === 'TWITTER' ? 'X' : 'Stripe'}</strong> connection has been revoked or expired. Please reconnect.`,
                ruleId: 'CONNECTION_STATUS_ACTIVE',
                primaryText: 'Reconnect',
                primaryAction: () => {
                    const panel = selectedSource === 'TWITTER' ? document.getElementById('x-verify-panel') : document.getElementById('stripe-connect-panel');
                    panel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            },
            'FLOW_LOCKED': {
                title: 'Execution in progress',
                message: 'A contract execution is already running. Please wait for it to complete or close the other browser tab.',
                ruleId: 'SINGLE_FLOW_LOCK'
            },
            'FUNDS_LOCK_TIMEOUT': {
                title: 'Funds not locked',
                message: 'The payment was authorized but funds have not fully locked yet. Please wait a moment and try again.',
                ruleId: 'FUNDS_LOCK_REQUIRED'
            }
        };

        // Check for enforcement mapping
        const mapping = code ? enforcementMappings[code] : null;

        if (mapping) {
            showEnforcementModal({
                title: mapping.title,
                message: mapping.message,
                ruleId: mapping.ruleId,
                primaryText: mapping.primaryText || actionText,
                primaryAction: mapping.primaryAction || onAction
            });
        } else {
            // Fallback for unmapped errors - still use enforcement style
            showEnforcementModal({
                title: title || 'Execution blocked',
                message: rawMessage || 'An unexpected issue occurred. Please try again.',
                ruleId: code || null,
                primaryText: actionText,
                primaryAction: onAction
            });
        }
    };

    // =========================================================
    // AUTO-CHECK CONNECTION STATUS ON PAGE LOAD
    // =========================================================
    (async function checkConnectionStatus() {
        try {
            const status = await window.api.getConnectionStatus();
            console.log('[Contracts] Connection status:', status);

            if (status?.platforms) {
                // Check X (Twitter) status
                const xStatus = status.platforms.find(p => p.platform === 'X');
                if (xStatus?.verificationStatus === 'VERIFIED') {
                    xVerified = true;
                    xUsername = xStatus.metadata?.resolvedUsername || xStatus.externalAccountId;
                    console.log('[Contracts] X already verified:', xUsername);
                }

                // Check Stripe status
                const stripeStatus = status.platforms.find(p => p.platform === 'STRIPE');
                if (stripeStatus?.verificationStatus === 'VERIFIED') {
                    stripeVerified = true;
                    stripeAccountId = stripeStatus.externalAccountId;
                    console.log('[Contracts] Stripe already connected:', stripeAccountId);
                }
            }
        } catch (err) {
            console.log('[Contracts] Could not check connection status:', err.message);
        }
    })();

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

            // Show/hide X verification panel based on source
            const xVerifyPanel = document.getElementById('x-verify-panel');
            const stripeVerifyPanel = document.getElementById('stripe-verify-panel');

            // Hide both panels first
            xVerifyPanel.style.display = 'none';
            stripeVerifyPanel.style.display = 'none';

            if (source === 'TWITTER') {
                xVerifyPanel.style.display = 'block';
                // Disable next button until X is verified
                document.getElementById('btn-step-2').disabled = !xVerified;
            } else if (source === 'STRIPE') {
                stripeVerifyPanel.style.display = 'block';
                // Disable next button until Stripe is connected
                document.getElementById('btn-step-2').disabled = !stripeVerified;
            } else {
                // Non-X/Stripe sources can proceed immediately
                document.getElementById('btn-step-2').disabled = false;
            }

            // Show metric preview (light - current only) - only if verified for X
            const metricPreview = document.getElementById('metric-preview');
            const mockData = mockMetricData[source];
            if (metricPreview && mockData && (source !== 'TWITTER' || xVerified)) {
                metricPreview.style.display = 'block';

                const isRevenue = mockData.metricType === 'REVENUE';
                const formatValue = isRevenue ? formatCurrency : formatNumber;
                const unit = isRevenue ? '' : ' followers';

                document.getElementById('preview-current').textContent = formatValue(mockData.currentValue) + unit;
                document.getElementById('preview-authority-badge').textContent = source === 'TWITTER' ? 'X' : 'Stripe';
            }

            if (window.lucide) window.lucide.createIcons();
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

        completeHold: async function () {
            const btn = document.getElementById('btn-execute');
            const btnText = document.getElementById('btn-text');

            // ==================================================
            // FLOW LOCK - Prevent multi-click / multi-tab double runs
            // Uses localStorage for cross-tab visibility
            // ==================================================
            const FLOW_LOCK_KEY = `collateral_flow_lock:v1:${location.pathname}`;
            const flowLockData = localStorage.getItem(FLOW_LOCK_KEY);
            if (flowLockData) {
                try {
                    const lock = JSON.parse(flowLockData);
                    if (Date.now() - lock.startedAt < 300000) { // 5 min lock
                        showErrorModal('A contract execution is already in progress. Please wait for it to complete or close the other browser tab.', {
                            code: 'FLOW_LOCKED',
                            title: 'Flow In Progress'
                        });
                        return;
                    }
                } catch (e) { /* Invalid lock data, proceed */ }
            }
            localStorage.setItem(FLOW_LOCK_KEY, JSON.stringify({ startedAt: Date.now() }));
            const releaseLock = () => localStorage.removeItem(FLOW_LOCK_KEY);

            holdComplete = true;
            btn.disabled = true;

            // Helper: poll until state matches (with timeout return)
            const pollUntilState = async (contractId, acceptStates, timeoutMs = 90000) => {
                const start = Date.now();
                let delay = 750;
                const maxDelay = 4000;
                let lastState = null;

                while (true) {
                    const res = await window.api.getContract(contractId);
                    lastState = res.contract?.state;
                    console.log(`[Contracts] Polling state: ${lastState}`);

                    if (acceptStates.includes(lastState)) return res;

                    if (Date.now() - start > timeoutMs) {
                        return { timeout: true, lastState, contract: res.contract, events: res.events };
                    }

                    await new Promise(r => setTimeout(r, delay));
                    delay = Math.min(maxDelay, Math.floor(delay * 1.35));
                }
            };

            // Helper: map platform error codes to actionable UX
            const getPlatformErrorAction = (code, platform) => {
                const name = platform === 'X' ? 'X (Twitter)' : 'Stripe';
                switch (code) {
                    case 'PLATFORM_NOT_CONNECTED':
                        return { message: `Connect your ${name} account first.`, action: 'connect' };
                    case 'PLATFORM_NOT_VERIFIED':
                        return { message: `Complete ${name} verification.`, action: 'verify' };
                    case 'PLATFORM_CONNECTION_INACTIVE':
                        return { message: `${name} connection revoked. Please reconnect.`, action: 'reconnect' };
                    default: return null;
                }
            };

            // Helper: check if platform enforcement error
            const isPlatformBlock = (code) => {
                return code === 'PLATFORM_NOT_CONNECTED' ||
                    code === 'PLATFORM_CONNECTION_INACTIVE' ||
                    code === 'PLATFORM_NOT_VERIFIED';
            };

            // DEV MODE CHECK
            const IS_DEV_MODE = !window.stripe || !window.stripeElements;
            if (IS_DEV_MODE) {
                console.warn('[Contracts] DEV MODE: Stripe not initialized.');
            }

            try {
                // Get capital amount from input
                const capitalInput = document.querySelector('#step-3 input[type="number"]');
                const capitalAmount = parseFloat(capitalInput?.value || 5000);

                // Build contract params
                const deadline = new Date();
                deadline.setDate(deadline.getDate() + 30);

                // Extract platform for use in error handling
                const chosenPlatform = selectedSource === 'TWITTER' ? 'X' : 'STRIPE';

                const params = {
                    platform: chosenPlatform,
                    metricType: chosenPlatform === 'X' ? 'FOLLOWERS' : 'REVENUE',
                    condition: {
                        operator: 'GTE',
                        threshold: 10000,
                        deadline: deadline.toISOString(),
                    },
                    lockAmountUsdCents: Math.round(capitalAmount * 100),
                    payoutAmountUsdCents: Math.round(capitalAmount * 100),
                    fundingMethod: 'USD_CARD',
                };

                // ==================================================
                // STEP 1: CREATE CONTRACT
                // ==================================================
                btnText.textContent = "Creating contract...";
                console.log('[Contracts] Step 1: Creating contract...');

                const createRes = await window.api.createContract(params);
                console.log('[Contracts] Contract created:', createRes);

                // Strict success check: ok must be truthy
                if (!createRes?.ok) {
                    const code = createRes?.code;
                    const e = new Error(createRes?.error || 'Contract creation failed');
                    e.code = code;
                    e.platform = chosenPlatform;
                    throw e;
                }

                const contractId = createRes.contractId || createRes.contract?.id;
                if (!contractId) {
                    throw new Error('Contract created but no ID returned');
                }
                console.log('[Contracts] Contract ID:', contractId);

                // ==================================================
                // STEP 2: CREATE FUNDING INTENT
                // ==================================================
                btnText.textContent = "Preparing payment...";
                console.log('[Contracts] Step 2: Creating funding intent...');

                const fundingRes = await window.api.createFundingIntent(contractId);
                console.log('[Contracts] Funding intent:', fundingRes);

                const clientSecret = fundingRes?.clientSecret;
                if (!clientSecret) {
                    throw new Error('Failed to create payment intent');
                }

                // ==================================================
                // STEP 3: CONFIRM PAYMENT WITH STRIPE
                // ==================================================
                btnText.textContent = "Confirming payment...";
                console.log('[Contracts] Step 3: Confirming payment...');

                // Note: In production, you'd use stripe.confirmPayment here
                // For now, we simulate direct confirmation or skip if no Stripe
                if (window.stripe && window.stripeElements) {
                    const confirm = await window.stripe.confirmPayment({
                        elements: window.stripeElements,
                        clientSecret,
                        redirect: 'if_required',
                    });

                    if (confirm?.error) {
                        throw new Error(confirm.error.message || 'Payment failed');
                    }
                } else {
                    console.log('[Contracts] Stripe not initialized - skipping payment confirmation (dev mode)');
                }

                // ==================================================
                // STEP 4: POLL UNTIL FUNDS_LOCKED (accept FUNDS_AUTHORIZED as intermediate)
                // ==================================================
                btnText.textContent = "Locking funds...";
                console.log('[Contracts] Step 4: Waiting for funds to lock...');

                const lockRes = await pollUntilState(contractId, ['FUNDS_AUTHORIZED', 'FUNDS_LOCKED', 'LOCKED'], 90000);

                // Handle timeout
                if (lockRes.timeout) {
                    console.error('[Contracts] Timeout waiting for funds lock. State:', lockRes.lastState);
                    console.error('[Contracts] Last events:', lockRes.events?.slice(-5));
                    const e = new Error(`Funds did not lock. State: ${lockRes.lastState}. Check again in a minute.`);
                    e.code = 'FUNDS_LOCK_TIMEOUT';
                    throw e;
                }

                // Skip execute if already LOCKED (idempotent)
                if (lockRes.contract?.state === 'LOCKED') {
                    console.log('[Contracts] Already LOCKED, skipping execute...');
                    // Jump to finalize
                    btnText.textContent = "Already executed";
                    releaseLock();
                    setTimeout(() => {
                        window.router.navigate('/contracts/' + contractId);
                    }, 1000);
                    return;
                }

                // Wait for FUNDS_LOCKED if still FUNDS_AUTHORIZED
                if (lockRes.contract?.state === 'FUNDS_AUTHORIZED') {
                    console.log('[Contracts] FUNDS_AUTHORIZED, waiting for FUNDS_LOCKED...');
                    const lockedRes = await pollUntilState(contractId, ['FUNDS_LOCKED', 'LOCKED'], 60000);
                    if (lockedRes.timeout) {
                        const e = new Error(`Funds authorized but not locked. State: ${lockedRes.lastState}`);
                        e.code = 'FUNDS_LOCK_TIMEOUT';
                        throw e;
                    }
                    if (lockedRes.contract?.state === 'LOCKED') {
                        console.log('[Contracts] Already LOCKED, skipping execute...');
                        btnText.textContent = "Already executed";
                        releaseLock();
                        setTimeout(() => {
                            window.router.navigate('/contracts/' + contractId);
                        }, 1000);
                        return;
                    }
                }
                console.log('[Contracts] Funds locked!');

                // ==================================================
                // STEP 5: EXECUTE CONTRACT
                // ==================================================
                btnText.textContent = "Sealing contract...";
                console.log('[Contracts] Step 5: Executing contract...');

                try {
                    const execRes = await window.api.executeContract(contractId);
                    console.log('[Contracts] Execute result:', execRes);

                    if (!execRes?.ok) {
                        const code = execRes?.code;
                        if (code === 'FUNDS_NOT_LOCKED') {
                            // Webhook lag - poll and retry once
                            console.log('[Contracts] Funds not locked yet, retrying...');
                            btnText.textContent = "Waiting for lock...";
                            const retryLock = await pollUntilState(contractId, ['FUNDS_LOCKED', 'LOCKED'], 60000);
                            if (retryLock.timeout) {
                                const e = new Error(`Funds still locking. State: ${retryLock.lastState}`);
                                e.code = 'FUNDS_NOT_LOCKED';
                                throw e;
                            }
                            const retry = await window.api.executeContract(contractId);
                            if (!retry?.ok) {
                                const e = new Error(retry?.error || 'Execute failed after retry');
                                e.code = retry?.code;
                                e.platform = retry?.platform;
                                throw e;
                            }
                        } else if (isPlatformBlock(code)) {
                            const e = new Error(execRes?.error || 'Connection issue');
                            e.code = code;
                            e.platform = execRes?.platform || chosenPlatform;
                            throw e;
                        } else if (code === 'DELTA_FLOOR_NOT_MET' || code?.includes('INELIGIBLE')) {
                            const e = new Error(`Eligibility check failed: ${execRes?.error}`);
                            e.code = code;
                            throw e;
                        } else {
                            const e = new Error(execRes?.error || 'Execution failed');
                            e.code = code;
                            throw e;
                        }
                    }
                } catch (execErr) {
                    console.error('[Contracts] Execute error:', execErr);
                    throw execErr;
                }

                // ==================================================
                // STEP 6: POLL UNTIL LOCKED
                // ==================================================
                btnText.textContent = "Finalizing...";
                console.log('[Contracts] Step 6: Waiting for LOCKED state...');

                const finalRes = await pollUntilState(contractId, ['LOCKED'], 30000);

                // Handle timeout with audit trail
                if (finalRes.timeout) {
                    console.error('[Contracts] Failed to reach LOCKED. State:', finalRes.lastState);
                    console.error('[Contracts] Last events:', finalRes.events?.slice(-5));
                    throw new Error(`Contract not finalized. State: ${finalRes.lastState}. Check ledger.`);
                }
                console.log('[Contracts] Contract LOCKED! Baseline:', finalRes.contract?.baseline);

                // ==================================================
                // SUCCESS - Update UI
                // ==================================================
                releaseLock(); // Release flow lock on success
                this.markCompleted(3);
                btnText.textContent = "Contract Executed";
                btn.classList.remove('bg-neutral-900');
                btn.classList.add('bg-black', 'cursor-default');

                const statusText = document.querySelector('.step-status');
                if (statusText) statusText.textContent = 'S: Complete';

                updateProgressBar(3, true);

                // Navigate to contract detail
                setTimeout(() => {
                    window.router.navigate('/contracts/' + contractId);
                }, 1500);

            } catch (error) {
                console.error('[Contracts] completeHold error:', error);
                releaseLock(); // Release lock on failure
                holdComplete = false;
                btnText.textContent = "Hold to Execute";
                btn.disabled = false;

                // Show enforcement modal - mapping is handled internally
                const errCode = error?.code || error?.data?.code;
                showErrorModal(error.message, {
                    code: errCode,
                    activeContractId: error?.activeContractId || error?.data?.activeContractId
                });
            }
        },

        // === X OAUTH CONNECTION (NEW) ===

        connectXOAuth: async function () {
            const btn = document.getElementById('x-connect-btn');
            if (!btn) return;

            btn.disabled = true;
            btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>';

            try {
                // Call backend to get OAuth URL
                const result = await window.api.startXOAuth();
                console.log('[Contracts] startXOAuth result:', result);

                // If already connected, show success
                if (result.connected) {
                    xUsername = result.xUsername;
                    xVerified = true;

                    // Show connected state
                    const connectSection = document.getElementById('x-connect-section');
                    if (connectSection) {
                        connectSection.innerHTML = `
                            <div class="flex items-center justify-between p-4 bg-[#1F7A4D]/10 border border-[#1F7A4D]/30 rounded-lg">
                                <div class="flex items-center gap-3">
                                    <svg class="w-5 h-5 text-[#1F7A4D]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    <div>
                                        <div class="text-sm font-medium text-white">@${result.xUsername}</div>
                                        <div class="text-xs text-[#1F7A4D]">Connected</div>
                                    </div>
                                </div>
                                <button onclick="window.contractWizard?.disconnectX()" class="text-xs text-neutral-400 hover:text-white transition-colors">Disconnect</button>
                            </div>
                        `;
                    }
                    document.getElementById('btn-step-2').disabled = false;
                    return;
                }

                // Redirect to X OAuth
                if (result.oauthUrl) {
                    window.location.href = result.oauthUrl;
                } else {
                    throw new Error('No OAuth URL returned from server');
                }
            } catch (error) {
                console.error('[Contracts] startXOAuth error:', error);
                alert('Failed to connect X: ' + (error.message || 'Unknown error'));
                btn.innerHTML = 'Connect X';
                btn.disabled = false;
            }
        },

        disconnectX: async function () {
            if (!confirm('Are you sure you want to disconnect your X account?')) return;

            try {
                await window.api.disconnectX();
                xUsername = null;
                xVerified = false;

                // Reload to reset UI
                location.reload();
            } catch (error) {
                console.error('[Contracts] disconnectX error:', error);
                alert('Failed to disconnect: ' + (error.message || 'Unknown error'));
            }
        },

        // === DEPRECATED: X BIO VERIFICATION ===
        // Kept for backward compatibility but should not be used

        generateVerifyCode: async function () {
            console.warn('[Contracts] generateVerifyCode is DEPRECATED. Use connectXOAuth instead.');
            // Redirect to OAuth flow instead
            return this.connectXOAuth();
        },

        copyVerifyCode: function () {
            if (xVerifyCode) {
                navigator.clipboard.writeText(xVerifyCode).then(() => {
                    const btn = document.querySelector('#x-verify-step2 button[onclick*="copyVerifyCode"]');
                    if (btn) {
                        const originalHTML = btn.innerHTML;
                        btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
                        if (window.lucide) window.lucide.createIcons();
                        setTimeout(() => {
                            btn.innerHTML = originalHTML;
                            if (window.lucide) window.lucide.createIcons();
                        }, 2000);
                    }
                });
            }
        },

        verifyXAccount: async function () {
            const btn = document.getElementById('x-verify-btn');

            // UPFRONT COOLDOWN CHECK - Don't call API if still in cooldown
            const storedUnlockTime = parseInt(localStorage.getItem('x_verify_unlock_time') || '0', 10);
            if (storedUnlockTime > Date.now()) {
                const remaining = Math.ceil((storedUnlockTime - Date.now()) / 1000);
                console.log(`[Contracts] BLOCKED: Cooldown active. ${remaining}s remaining.`);
                btn.textContent = `Wait ${remaining}s`;
                btn.disabled = true;
                // Start countdown if not already running
                const countdownInterval = setInterval(() => {
                    const now = Date.now();
                    const unlock = parseInt(localStorage.getItem('x_verify_unlock_time') || '0', 10);
                    const rem = Math.ceil((unlock - now) / 1000);
                    if (rem <= 0) {
                        clearInterval(countdownInterval);
                        btn.textContent = 'Verify X Account';
                        btn.disabled = false;
                        localStorage.removeItem('x_verify_unlock_time');
                    } else {
                        btn.textContent = `Wait ${rem}s`;
                    }
                }, 1000);
                return; // DON'T call API
            }

            const originalText = btn.textContent;
            btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>';
            btn.disabled = true;

            try {
                // Call the real backend API (no username needed, backend tracks challenge)
                const result = await window.api.verifyX();
                console.log('[Contracts] X verification result:', result);

                // Mark as verified
                xVerified = true;

                // Update UI to show success
                document.getElementById('x-verify-step1').classList.add('hidden');
                document.getElementById('x-verify-step2').classList.add('hidden');
                document.getElementById('x-verify-success').classList.remove('hidden');
                document.getElementById('x-verified-handle').textContent = '@' + xUsername + ' • Connected';
                document.getElementById('x-verify-status').textContent = 'Verified';
                document.getElementById('x-verify-status').classList.remove('text-neutral-400');
                document.getElementById('x-verify-status').classList.add('text-[#1F7A4D]');

                // Enable the next button and show metric preview
                document.getElementById('btn-step-2').disabled = false;

                // Show metric preview now
                const metricPreview = document.getElementById('metric-preview');
                const mockData = mockMetricData['TWITTER'];
                if (metricPreview && mockData) {
                    metricPreview.style.display = 'block';
                    document.getElementById('preview-current').textContent = formatNumber(mockData.currentValue) + ' followers';
                    document.getElementById('preview-authority-badge').textContent = 'X';
                }

                if (window.lucide) window.lucide.createIcons();

            } catch (error) {
                console.error('[Contracts] X verification error:', error);

                // Check for rate limit or cooldown errors
                const errorData = error.data || {};
                const isRateLimited = errorData.code === 'X_VERIFY_COOLDOWN' ||
                    errorData.code === 'X_API_RATE_LIMITED' ||
                    error.status === 429;

                if (isRateLimited) {
                    // Show countdown timer - keep button disabled
                    const resetAt = errorData.resetAt;
                    const retryAfterSeconds = errorData.retryAfterSeconds;

                    let remainingSeconds = retryAfterSeconds || 60;
                    if (resetAt) {
                        remainingSeconds = Math.max(1, Math.ceil(resetAt - Date.now() / 1000));
                    }

                    // Store unlock time in localStorage for page reload persistence
                    const unlockTime = Date.now() + remainingSeconds * 1000;
                    localStorage.setItem('x_verify_unlock_time', unlockTime.toString());

                    // Start countdown
                    const countdownInterval = setInterval(() => {
                        const now = Date.now();
                        const storedUnlockTime = parseInt(localStorage.getItem('x_verify_unlock_time') || '0', 10);
                        const remaining = Math.ceil((storedUnlockTime - now) / 1000);

                        if (remaining <= 0) {
                            clearInterval(countdownInterval);
                            btn.textContent = originalText;
                            btn.disabled = false;
                            localStorage.removeItem('x_verify_unlock_time');
                        } else {
                            btn.textContent = `Wait ${remaining}s`;
                            btn.disabled = true;
                        }
                    }, 1000);

                    btn.textContent = `Wait ${remainingSeconds}s`;
                    btn.disabled = true;
                    console.log(`[Contracts] X rate limited. Retry in ${remainingSeconds}s`);
                    return;
                }

                // Non-rate-limit error - re-enable button
                btn.textContent = originalText;
                btn.disabled = false;

                // Show specific error message
                const errorMsg = error.message || 'Verification failed';
                if (errorMsg.includes('could not find') || errorMsg.includes('not found')) {
                    alert('Verification failed: Could not find the code "' + xVerifyCode + '" in your X bio. Please add it and try again.');
                } else {
                    alert('Verification failed: ' + errorMsg);
                }
            }
        },

        // === STRIPE CONNECT METHODS ===

        startStripeConnect: async function () {
            const btn = document.getElementById('stripe-connect-btn');
            btn.disabled = true;
            btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>';

            try {
                // Get OAuth URL from backend
                const result = await window.api.startStripeConnect();
                console.log('[Contracts] startStripeConnect result:', result);

                if (result.alreadyConnected) {
                    // Already connected - show success state
                    stripeVerified = true;
                    stripeAccountId = result.stripeAccountId;
                    document.getElementById('stripe-connect-step1').classList.add('hidden');
                    document.getElementById('stripe-connect-success').classList.remove('hidden');
                    document.getElementById('stripe-account-id').textContent = stripeAccountId + ' • Connected';
                    document.getElementById('stripe-verify-status').textContent = 'Connected';
                    document.getElementById('stripe-verify-status').classList.remove('text-neutral-400');
                    document.getElementById('stripe-verify-status').classList.add('text-[#1F7A4D]');
                    document.getElementById('btn-step-2').disabled = false;
                    if (window.lucide) window.lucide.createIcons();
                    return;
                }

                // Store state for callback handling
                localStorage.setItem('stripe_oauth_state', result.state);

                // Open Stripe Connect in a popup
                const popup = window.open(
                    result.oauthUrl,
                    'stripe-connect',
                    'width=600,height=700,scrollbars=yes'
                );

                // Listen for OAuth callback completion
                const checkPopup = setInterval(async () => {
                    if (popup.closed) {
                        clearInterval(checkPopup);
                        btn.textContent = 'Connect with Stripe';
                        btn.disabled = false;

                        // Check if Stripe was connected
                        const status = await window.api.getStripeStatus();
                        if (status.connected) {
                            stripeVerified = true;
                            stripeAccountId = status.stripeAccountId;
                            document.getElementById('stripe-connect-step1').classList.add('hidden');
                            document.getElementById('stripe-connect-success').classList.remove('hidden');
                            document.getElementById('stripe-account-id').textContent = stripeAccountId + ' • Connected';
                            document.getElementById('stripe-verify-status').textContent = 'Connected';
                            document.getElementById('stripe-verify-status').classList.remove('text-neutral-400');
                            document.getElementById('stripe-verify-status').classList.add('text-[#1F7A4D]');
                            document.getElementById('btn-step-2').disabled = false;
                            if (window.lucide) window.lucide.createIcons();
                        }
                    }
                }, 500);

            } catch (error) {
                console.error('[Contracts] startStripeConnect error:', error);
                btn.innerHTML = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg> Connect with Stripe';
                btn.disabled = false;
                alert('Failed to start Stripe Connect: ' + (error.message || 'Unknown error'));
            }
        }
    };

    // Initialize progress bar on load
    updateProgressBar(1);
}
