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
                height: 4px;
                background: #e5e5e5;
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
            
            <!-- Progress Bar - Right below header -->
            <div class="progress-container shrink-0">
                <div class="progress-fill" id="progress-fill" style="width: 33%;"></div>
            </div>

            <!-- Main Content Area -->
            <main class="flex-1 relative overflow-y-auto flex flex-col px-6 md:px-12 py-6 md:py-8">
                
                <!-- STEP 1: RISK PROFILE -->
                <section id="step-1" class="max-w-5xl mx-auto w-full flex flex-col">
                    <!-- Top System Context Bar -->
                    <div class="border-b border-gray-200 mb-8 pb-4">
                        <div class="font-mono text-[11px] tracking-wider text-gray-500 uppercase">
                            STEP 01 OF 03 — EXPOSURE SELECTION
                        </div>
                        <div class="font-mono text-[11px] tracking-wider text-gray-500 uppercase mt-1">
                            THIS DECISION AFFECTS CAPITAL FORFEITURE
                        </div>
                    </div>

                    <!-- Primary Heading -->
                    <div class="mb-12">
                        <h1 class="text-3xl font-medium tracking-tight mb-4" style="font-family: 'IBM Plex Sans', sans-serif;">
                            SELECT ENFORCEMENT PROFILE
                        </h1>
                        <p class="text-base text-gray-600 max-w-2xl leading-relaxed" style="font-family: 'Inter', sans-serif;">
                            This selection defines your risk of capital forfeiture and maximum payout.
                            Once confirmed, exposure cannot be reduced.
                        </p>
                    </div>
                    
                    <!-- Tier Cards Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <!-- TIER I: CONTROLLED -->
                        <button class="border-2 border-gray-200 p-8 text-left flex flex-col justify-between h-72 hover:border-gray-900 transition-colors bg-white"
                             onclick="window.wizard.selectRisk('STEADY', this)">
                            <div class="flex justify-between items-start mb-6">
                                <span class="font-mono text-[10px] text-gray-400 uppercase tracking-widest">TIER I</span>
                                <span class="font-mono text-xs bg-gray-100 px-2 py-1 font-medium">1.5×</span>
                            </div>
                            <div class="flex-1">
                                <h2 class="text-xl font-semibold mb-4" style="font-family: 'IBM Plex Sans', sans-serif;">CONTROLLED</h2>
                                <div class="space-y-2 font-mono text-[11px] text-gray-500">
                                    <div class="flex justify-between">
                                        <span>Capital Risk</span>
                                        <span class="text-gray-700">Partial forfeiture</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Verification</span>
                                        <span class="text-gray-700">Baseline thresholds</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Variance</span>
                                        <span class="text-gray-700">Low</span>
                                    </div>
                                </div>
                            </div>
                        </button>

                        <!-- TIER II: ELEVATED -->
                        <button class="border-2 border-gray-200 p-8 text-left flex flex-col justify-between h-72 hover:border-gray-900 transition-colors bg-white"
                             onclick="window.wizard.selectRisk('BOLD', this)">
                            <div class="flex justify-between items-start mb-6">
                                <span class="font-mono text-[10px] text-gray-400 uppercase tracking-widest">TIER II</span>
                                <span class="font-mono text-xs bg-gray-100 px-2 py-1 font-medium">2.5×</span>
                            </div>
                            <div class="flex-1">
                                <h2 class="text-xl font-semibold mb-4" style="font-family: 'IBM Plex Sans', sans-serif;">ELEVATED</h2>
                                <div class="space-y-2 font-mono text-[11px] text-gray-500">
                                    <div class="flex justify-between">
                                        <span>Capital Risk</span>
                                        <span class="text-gray-700">Majority forfeiture</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Verification</span>
                                        <span class="text-gray-700">Strict thresholds</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Variance</span>
                                        <span class="text-gray-700">Moderate</span>
                                    </div>
                                </div>
                            </div>
                        </button>

                        <!-- TIER III: MAXIMUM -->
                        <button class="border-2 border-gray-200 p-8 text-left flex flex-col justify-between h-72 hover:border-gray-900 transition-colors bg-white"
                             onclick="window.wizard.selectRisk('ALL_IN', this)"
                             style="border-color: rgba(117, 18, 18, 0.3);">
                            <div class="flex justify-between items-start mb-6">
                                <span class="font-mono text-[10px] text-gray-400 uppercase tracking-widest">TIER III</span>
                                <span class="font-mono text-xs px-2 py-1 font-medium" style="background-color: #fef2f2; color: #751212;">4.0×</span>
                            </div>
                            <div class="flex-1">
                                <h2 class="text-xl font-semibold mb-4" style="font-family: 'IBM Plex Sans', sans-serif;">MAXIMUM</h2>
                                <div class="space-y-2 font-mono text-[11px] text-gray-500">
                                    <div class="flex justify-between">
                                        <span>Capital Risk</span>
                                        <span style="color: #751212;">Total forfeiture</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Verification</span>
                                        <span class="text-gray-700">Highest strictness</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Variance</span>
                                        <span class="text-gray-700">High</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>

                    <!-- Confirmation Area -->
                    <div class="border-t border-gray-200 pt-8">
                         <button id="btn-step-1" class="w-full md:w-auto px-12 py-4 border-2 font-medium tracking-wide transition-all border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" disabled onclick="window.wizard.nextStep()" style="font-family: 'Inter', sans-serif;">
                            CONFIRM EXPOSURE
                        </button>
                        <div class="font-mono text-[11px] tracking-wider text-gray-400 mt-4">
                            This decision is irreversible after execution.
                        </div>
                    </div>
                </section>


                <!-- STEP 2: SELECT PERFORMANCE DOMAIN -->
                <section id="step-2" class="hidden max-w-5xl mx-auto w-full flex flex-col">
                    <!-- Page Header -->
                    <div class="mb-10 pb-6 border-b border-gray-200">
                        <h1 class="uppercase tracking-tight mb-3 text-2xl font-medium" style="font-family: 'IBM Plex Sans', sans-serif; letter-spacing: -0.01em;">
                            SELECT PERFORMANCE DOMAIN
                        </h1>
                        <p class="text-sm text-gray-600 leading-relaxed max-w-3xl" style="font-weight: 300;">
                            Choose your performance verification domain. Each domain uses verified data sources 
                            to measure outcomes. The selected authority will serve as the sole arbiter of contract settlement.
                        </p>
                    </div>

                    <!-- Domain Sections -->
                    <div class="space-y-8 mb-12">
                        
                        <!-- 🟦 SALES DOMAIN -->
                        <div class="domain-section">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-1 h-6 rounded-full" style="background: #2563eb;"></div>
                                <h3 class="text-sm font-semibold uppercase tracking-wide" style="font-family: 'IBM Plex Sans', sans-serif;">Sales</h3>
                                <span class="font-mono text-[9px] px-2 py-0.5 uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">Primary</span>
                            </div>
                            <p class="text-xs text-gray-500 mb-4 ml-4 leading-relaxed max-w-xl">
                                Tracks verified net revenue collected through connected payment processors. 
                                Only settled funds count. Refunds and chargebacks are excluded.
                            </p>
                            
                            <div class="ml-4 space-y-2">
                                <!-- Authorize.net (Coming Soon) -->
                                <div class="border border-gray-100 bg-gray-50/50 p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm font-medium text-gray-400">Authorize.net</span>
                                                <span class="font-mono text-[8px] px-1.5 py-0.5 uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">Recommended</span>
                                                <span class="font-mono text-[8px] px-1.5 py-0.5 uppercase tracking-wider bg-gray-100 text-gray-500">Coming Soon</span>
                                            </div>
                                            <p class="text-[10px] text-gray-400 mt-0.5">Ideal for insurance agents and agencies</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Stripe (Active) -->
                                <button class="w-full border-2 border-gray-200 bg-white p-4 flex items-center justify-between hover:border-gray-400 transition-colors authority-card text-left"
                                     onclick="window.wizard.selectSource('STRIPE', this)" data-domain="sales">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-[#635bff]/10 rounded flex items-center justify-center">
                                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="#635bff"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm font-medium text-gray-900">Stripe</span>
                                                <span class="font-mono text-[8px] px-1.5 py-0.5 uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">Payment-Verified</span>
                                            </div>
                                            <p class="text-[10px] text-gray-500 mt-0.5">Digital sales, SaaS, and online transactions</p>
                                        </div>
                                    </div>
                                    <div id="stripe-card-connected-sales" class="hidden">
                                        <span class="font-mono text-[10px] text-emerald-600 flex items-center gap-1">
                                            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                            Connected
                                        </span>
                                    </div>
                                </button>
                                
                                <!-- PayPal (Coming Soon) -->
                                <div class="border border-gray-100 bg-gray-50/50 p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm font-medium text-gray-400">PayPal Business</span>
                                                <span class="font-mono text-[8px] px-1.5 py-0.5 uppercase tracking-wider bg-gray-100 text-gray-500">Coming Soon</span>
                                            </div>
                                            <p class="text-[10px] text-gray-400 mt-0.5">E-commerce and marketplace transactions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 🟨 SOCIAL MEDIA DOMAIN -->
                        <div class="domain-section">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-1 h-6 rounded-full" style="background: #ea580c;"></div>
                                <h3 class="text-sm font-semibold uppercase tracking-wide" style="font-family: 'IBM Plex Sans', sans-serif;">Social Media / Audience</h3>
                            </div>
                            <p class="text-xs text-gray-500 mb-4 ml-4 leading-relaxed max-w-xl">
                                Tracks public engagement metrics through verified platform APIs.
                            </p>
                            
                            <div class="ml-4 space-y-2">
                                <!-- X (Active) -->
                                <button class="w-full border-2 border-gray-200 bg-white p-4 flex items-center justify-between hover:border-gray-400 transition-colors authority-card text-left"
                                     onclick="window.wizard.selectSource('TWITTER', this)" data-domain="social">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-black/5 rounded flex items-center justify-center">
                                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm font-medium text-gray-900">X (Twitter)</span>
                                                <span class="font-mono text-[8px] px-1.5 py-0.5 uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">Public Data</span>
                                                <span class="font-mono text-[8px] px-1.5 py-0.5 uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200">Non-Financial</span>
                                            </div>
                                            <p class="text-[10px] text-gray-500 mt-0.5">Follower growth, engagement, and impressions</p>
                                        </div>
                                    </div>
                                    <div id="x-card-connected" class="hidden">
                                        <span class="font-mono text-[10px] text-emerald-600 flex items-center gap-1">
                                            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                            Connected
                                        </span>
                                    </div>
                                </button>
                                
                                <!-- YouTube (Coming Soon) -->
                                <div class="border border-gray-100 bg-gray-50/50 p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm font-medium text-gray-400">YouTube</span>
                                                <span class="font-mono text-[8px] px-1.5 py-0.5 uppercase tracking-wider bg-gray-100 text-gray-500">Coming Soon</span>
                                            </div>
                                            <p class="text-[10px] text-gray-400 mt-0.5">Subscriber growth and video performance</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 🟩 FINANCE DOMAIN -->
                        <div class="domain-section">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-1 h-6 rounded-full" style="background: #16a34a;"></div>
                                <h3 class="text-sm font-semibold uppercase tracking-wide" style="font-family: 'IBM Plex Sans', sans-serif;">Finance / Business Performance</h3>
                            </div>
                            <p class="text-xs text-gray-500 mb-4 ml-4 leading-relaxed max-w-xl">
                                Measures business performance through verified financial inflows.
                            </p>
                            
                            <div class="ml-4 space-y-2">
                                <!-- Stripe (Active) -->
                                <button class="w-full border-2 border-gray-200 bg-white p-4 flex items-center justify-between hover:border-gray-400 transition-colors authority-card text-left"
                                     onclick="window.wizard.selectSource('STRIPE', this)" data-domain="finance">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-[#635bff]/10 rounded flex items-center justify-center">
                                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="#635bff"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm font-medium text-gray-900">Stripe</span>
                                                <span class="font-mono text-[8px] px-1.5 py-0.5 uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">Revenue-Verified</span>
                                            </div>
                                            <p class="text-[10px] text-gray-500 mt-0.5">Revenue growth and financial metrics</p>
                                        </div>
                                    </div>
                                    <div id="stripe-card-connected-finance" class="hidden">
                                        <span class="font-mono text-[10px] text-emerald-600 flex items-center gap-1">
                                            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                            Connected
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>

                    </div>

                    <!-- Authority Detail Panel -->
                    <div id="authority-panel" class="mb-8 border border-gray-200 bg-gray-50 p-6" style="display: none;">
                        <div class="flex justify-between items-start mb-6">
                            <h4 id="panel-title" class="font-medium text-base uppercase tracking-wide" style="font-family: 'IBM Plex Sans', sans-serif;"></h4>
                            <span id="panel-integrity" class="font-mono text-[10px] text-gray-500 uppercase tracking-widest"></span>
                        </div>
                        <div class="space-y-4 text-sm text-gray-600">
                            <div>
                                <h5 class="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2">MEASURED</h5>
                                <p id="panel-measured" class="leading-relaxed"></p>
                            </div>
                            <div>
                                <h5 class="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2">VERIFICATION</h5>
                                <p id="panel-verified" class="leading-relaxed"></p>
                            </div>
                            <div>
                                <h5 class="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2">FAILURE HANDLING</h5>
                                <p id="panel-failcases" class="leading-relaxed"></p>
                            </div>
                        </div>
                    </div>

                    <!-- Binding Section - X -->
                    <div id="x-verify-panel" class="mb-8 border border-gray-200 bg-white p-6" style="display: none;">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-medium text-base" style="font-family: 'IBM Plex Sans', sans-serif;">Authority Binding — X</h4>
                            <span id="x-verify-status" class="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Not Connected</span>
                        </div>
                        <p class="text-sm text-gray-600 mb-6 leading-relaxed">
                            Read-only OAuth connection. Binding is <span style="color: #751212; font-weight: 500;">irreversible</span> after confirmation.
                        </p>
                        
                        <!-- Not Connected State -->
                        <div id="x-connect-section">
                            <button onclick="window.wizard.connectXOAuth()" id="x-connect-btn"
                                class="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gray-900 text-white text-xs font-medium uppercase tracking-wide hover:bg-black transition-colors">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                Connect X Account
                            </button>
                        </div>
                        
                        <!-- Connected State -->
                        <div id="x-connected-state" class="hidden">
                            <div class="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                                        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    </div>
                                    <div>
                                        <p id="x-connected-handle" class="font-mono text-sm font-medium text-emerald-700">@username</p>
                                        <p class="text-[10px] text-gray-500 uppercase tracking-wider">Connected</p>
                                    </div>
                                </div>
                                <button onclick="window.wizard.disconnectX()" class="text-[10px] text-gray-400 hover:text-gray-600 uppercase tracking-wider transition-colors">
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Binding Section - Stripe -->
                    <div id="stripe-verify-panel" class="mb-8 border border-gray-200 bg-white p-6" style="display: none;">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-medium text-base" style="font-family: 'IBM Plex Sans', sans-serif;">Authority Binding — Stripe</h4>
                            <span id="stripe-verify-status" class="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Not Connected</span>
                        </div>
                        
                        <!-- Connect Button -->
                        <div id="stripe-connect-step1">
                            <p class="text-sm text-gray-600 mb-6 leading-relaxed">
                                Connect your Stripe account to enable revenue verification. Binding is <span style="color: #751212; font-weight: 500;">irreversible</span> after confirmation.
                            </p>
                            <button onclick="window.wizard.startStripeConnect()" id="stripe-connect-btn"
                                class="w-full flex items-center justify-center gap-2 px-4 py-4 bg-[#635bff] text-white text-xs font-medium uppercase tracking-wide hover:bg-[#5851eb] transition-colors">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
                                Connect with Stripe
                            </button>
                        </div>
                        
                        <!-- Connected State -->
                        <div id="stripe-connect-success" class="hidden">
                            <div class="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200">
                                <div class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <i data-lucide="check" class="w-4 h-4 text-white"></i>
                                </div>
                                <div>
                                    <p class="font-sans text-sm font-medium text-emerald-700">Stripe Connected</p>
                                    <p id="stripe-account-id" class="font-mono text-[11px] text-gray-500">acct_xxx • Connected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Metric Preview -->
                    <div id="metric-preview" class="mb-8 border border-gray-200 bg-white p-6" style="display: none;">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h4 class="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1">Current Signal</h4>
                            </div>
                            <span id="preview-authority-badge" class="font-mono text-[10px] text-gray-500 uppercase">--</span>
                        </div>
                        <div id="preview-current" class="text-2xl font-semibold font-mono">--</div>
                        <p class="text-xs text-gray-500 mt-2">This will be snapshotted at execution.</p>
                    </div>

                    <!-- Primary Action -->
                    <div class="flex items-center justify-between pt-8 border-t border-gray-200 pb-16">
                        <div class="font-mono text-[10px] text-gray-400" style="font-weight: 300;">
                            Contract ID: <span id="step2-contract-id">--</span>
                        </div>
                        <button id="btn-step-2" 
                            class="px-8 py-3 flex items-center gap-2 transition-colors uppercase tracking-wide bg-gray-200 text-gray-400 cursor-not-allowed text-xs font-medium" 
                            disabled 
                            onclick="window.wizard.nextStep()">
                            <span>Bind Authority</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </div>
                </section>



                <!-- STEP 3: EXECUTE CONTRACT -->
                <section id="step-3" class="hidden max-w-7xl mx-auto w-full flex flex-col" style="font-family: 'IBM Plex Mono', monospace;">
                    <!-- System Metadata Header -->
                    <div class="pb-5 mb-10 border-b border-black/10">
                        <div class="text-[10px] tracking-widest uppercase text-black/40 space-y-0.5 leading-tight">
                            <div>STEP 03 OF 03 — TERMINAL EXECUTION</div>
                            <div>CAPITAL WILL BE LOCKED. THIS ACTION IS BINDING.</div>
                        </div>
                    </div>

                    <!-- Page Header -->
                    <div class="mb-12">
                        <h1 class="text-3xl font-semibold tracking-tight mb-2 leading-none" style="font-family: 'IBM Plex Sans', sans-serif;">EXECUTE CONTRACT</h1>
                        <div class="h-[2px] w-48 mb-3" style="background-color: #B91C1C;"></div>
                        <div class="text-[11px] tracking-wider uppercase text-black/40 leading-tight">REF: <span id="contract-ref">0x7A2B4C8D9E1F3G5H</span></div>
                    </div>

                    <!-- Two Column Layout -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        <!-- Contract Summary Panel -->
                        <div class="border border-black p-6">
                            <div class="text-[11px] tracking-widest uppercase text-black/40 mb-5 leading-tight">CONTRACT TERMS</div>
                            
                            <div class="space-y-5">
                                <div class="flex justify-between items-start pb-3 border-b border-black/10">
                                    <div class="text-[11px] tracking-wider uppercase text-black/50 leading-tight">Authority</div>
                                    <div id="final-oracle" class="text-[13px] font-medium leading-tight">--</div>
                                </div>

                                <div class="flex justify-between items-start pb-3 border-b border-black/10">
                                    <div class="text-[11px] tracking-wider uppercase text-black/50 leading-tight">Condition</div>
                                    <div class="text-[13px] font-medium text-right leading-tight">Target > Baseline + 15%</div>
                                </div>

                                <div class="flex justify-between items-start pb-3 border-b border-black/10">
                                    <div class="text-[11px] tracking-wider uppercase text-black/50 leading-tight">Time Window</div>
                                    <div class="text-[13px] font-medium leading-tight">30 Days</div>
                                </div>

                                <div class="flex justify-between items-start pb-3 border-b border-black/10">
                                    <div class="text-[11px] tracking-wider uppercase text-black/50 leading-tight">Payout</div>
                                    <div id="final-mult" class="text-[13px] font-semibold leading-tight">
                                        <span class="text-[15px]">--</span>×
                                    </div>
                                </div>

                                <div class="flex justify-between items-start">
                                    <div class="text-[11px] tracking-wider uppercase text-black/50 leading-tight">Failure Outcome</div>
                                    <div class="text-[13px] font-medium leading-tight" style="color: #B91C1C;">Capital Forfeited</div>
                                </div>
                            </div>
                        </div>

                        <!-- Capital Allocation Panel -->
                        <div class="border border-black p-6 flex flex-col">
                            <div class="text-[11px] tracking-widest uppercase text-black/40 mb-5 leading-tight">CAPITAL ALLOCATION</div>
                            
                            <div class="flex-1 flex flex-col justify-center items-center py-8">
                                <div class="flex items-baseline">
                                    <span class="text-3xl text-gray-400 mr-2">$</span>
                                    <input type="number" id="capital-input" value="5000" 
                                        class="text-5xl font-semibold tracking-tight bg-transparent border-none outline-none w-40 text-center"
                                        style="font-family: 'IBM Plex Mono', monospace;">
                                </div>
                                <div class="text-[11px] tracking-wide uppercase text-black/40 mt-4 text-center max-w-xs leading-tight">
                                    Funds locked until contract resolution
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Metric Snapshot Panel -->
                    <div class="border border-black p-6 mb-10">
                        <div class="text-[11px] tracking-widest uppercase text-black/40 mb-5 leading-tight">METRIC SNAPSHOT — SYSTEM RECORD</div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div class="text-[11px] tracking-wider uppercase text-black/50 mb-2 leading-tight">Authority Source</div>
                                <div id="metric-authority-source" class="text-[13px] font-medium leading-tight">--</div>
                                <div class="text-[10px] text-black/40 mt-1 leading-tight">Verified • Public</div>
                            </div>

                            <div>
                                <div class="text-[11px] tracking-wider uppercase text-black/50 mb-2 leading-tight">Current (Baseline)</div>
                                <div id="metric-current" class="text-2xl font-semibold leading-none">--</div>
                                <div id="metric-recorded" class="text-[10px] text-black/40 mt-1 leading-tight">Recorded: --</div>
                            </div>

                            <div>
                                <div class="text-[11px] tracking-wider uppercase text-black/50 mb-2 leading-tight">Target Value</div>
                                <div id="metric-goal" class="text-2xl font-semibold leading-none">--</div>
                                <div id="metric-required" class="text-[10px] mt-1 leading-tight flex items-center gap-1" style="color: #B91C1C;">
                                    <span>+-- Required</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Execution Control -->
                    <div class="mb-10">
                        <div class="text-center text-[11px] text-black/50 mb-3 tracking-widest uppercase leading-tight">
                            This action is irreversible
                        </div>
                        <button id="btn-execute" 
                            class="w-full py-6 text-[15px] tracking-widest uppercase font-medium relative overflow-hidden transition-opacity select-none"
                            style="background-color: #030213; color: white;"
                            onmousedown="window.wizard.startHold()" 
                            onmouseup="window.wizard.endHold()" 
                            onmouseleave="window.wizard.endHold()"
                            ontouchstart="window.wizard.startHold()"
                            ontouchend="window.wizard.endHold()">
                            <div id="hold-bar" class="absolute left-0 top-0 h-full transition-all" style="width: 0%; background-color: #B91C1C;"></div>
                            <span class="relative z-10">
                                <span id="btn-text">HOLD TO EXECUTE</span>
                            </span>
                        </button>
                        <div class="text-center text-[11px] text-black/40 mt-3 tracking-wide leading-tight">
                            Execution locks capital and records baseline. Withdrawal prohibited until settlement.
                        </div>
                    </div>

                    <!-- Settlement Disclaimer -->
                    <div class="border-t border-black/10 pt-6 pb-8">
                        <div class="text-[10px] tracking-widest uppercase text-black/40 space-y-2 leading-tight">
                            <div>ALL CONTRACTS SETTLE PUBLICLY. OUTCOMES ARE PERMANENT.</div>
                            <div class="text-black/30">
                                Outcomes evaluated at deadline • Verification via public API snapshots • Settlement is final and on-chain
                            </div>
                        </div>
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
    // FLOW LOCK UTILITIES - Prevent stale locks
    // =========================================================
    const FLOW_LOCK_KEY = 'collateral_flow_lock';
    const FLOW_LOCK_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

    /**
     * Check if a valid (non-expired) flow lock exists
     */
    function hasActiveFlowLock() {
        const lockData = localStorage.getItem(FLOW_LOCK_KEY);
        if (!lockData) return false;

        try {
            const lock = JSON.parse(lockData);
            const age = Date.now() - lock.startedAt;

            if (age >= FLOW_LOCK_EXPIRY_MS) {
                // Lock is stale - auto-clear it
                console.warn('[FLOW LOCK] Cleared stale execution lock (age: ' + Math.round(age / 1000) + 's)');
                localStorage.removeItem(FLOW_LOCK_KEY);
                return false;
            }

            return true;
        } catch (e) {
            // Invalid lock data - clear it
            localStorage.removeItem(FLOW_LOCK_KEY);
            return false;
        }
    }

    /**
     * Acquire the flow lock (returns false if already locked)
     */
    function acquireFlowLock() {
        if (hasActiveFlowLock()) {
            return false;
        }
        localStorage.setItem(FLOW_LOCK_KEY, JSON.stringify({
            startedAt: Date.now(),
            contractId: null // Will be set after contract creation
        }));
        return true;
    }

    /**
     * Release the flow lock
     */
    function releaseFlowLock() {
        localStorage.removeItem(FLOW_LOCK_KEY);
        console.log('[FLOW LOCK] Released');
    }

    // Clear any stale locks on page load
    if (hasActiveFlowLock()) {
        console.log('[FLOW LOCK] Active lock detected on page load');
    }

    // =========================================================
    // QUERY PARAM HANDLING + STATUS REFRESH
    // =========================================================

    // Parse URL query params (e.g., /contracts?step=source&connected=x)
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get('step');
    const connectedParam = urlParams.get('connected');

    // Refresh connection status from backend on init
    // CANONICAL: Uses only /v1/connect/status endpoint (single source of truth)
    const refreshConnectionStatus = async () => {
        try {
            const status = await window.api.getConnectionStatus();
            console.log('[Contracts] Canonical status:', status);

            if (!status?.platforms) {
                console.warn('[Contracts] No platforms in status response');
                updateAuthorityGatingUI();
                return;
            }

            // X: Check verificationStatus === 'VERIFIED' (not just connected)
            const x = status.platforms.find(p => p.platform === 'X');
            if (x && x.verificationStatus === 'VERIFIED') {
                xVerified = true;
                xUsername = x.metadata?.resolvedUsername || null;
                window.appState.connectedSources.twitter = true;
                // Update UI if X panel is visible
                const xPanel = document.getElementById('x-verify-panel');
                if (xPanel && xPanel.style.display !== 'none' && xUsername) {
                    window.wizard?.showXConnectedState?.(xUsername);
                }
            } else {
                xVerified = false;
                xUsername = null;
                window.appState.connectedSources.twitter = false;
            }

            // Stripe: Check verificationStatus === 'VERIFIED'
            const stripe = status.platforms.find(p => p.platform === 'STRIPE');
            if (stripe && stripe.verificationStatus === 'VERIFIED') {
                stripeVerified = true;
                stripeAccountId = stripe.externalAccountId || null;
                window.appState.connectedSources.stripe = true;
            } else {
                stripeVerified = false;
                stripeAccountId = null;
                window.appState.connectedSources.stripe = false;
            }

        } catch (err) {
            console.log('[Contracts] Status check failed:', err.message);
        }

        // Re-render panel state based on selectedSource
        if (selectedSource === 'TWITTER') {
            if (xVerified && xUsername) {
                window.wizard?.showXConnectedState?.(xUsername);
            }
        } else if (selectedSource === 'STRIPE') {
            if (stripeVerified && stripeAccountId) {
                // Show Stripe connected UI
                const step1 = document.getElementById('stripe-connect-step1');
                const success = document.getElementById('stripe-connect-success');
                const accountId = document.getElementById('stripe-account-id');
                const status = document.getElementById('stripe-verify-status');
                if (step1) step1.classList.add('hidden');
                if (success) success.classList.remove('hidden');
                if (accountId) accountId.textContent = stripeAccountId + ' • Connected';
                if (status) {
                    status.textContent = 'Connected';
                    status.classList.remove('text-neutral-400');
                    status.classList.add('text-[#1F7A4D]');
                }
            }
        }

        // Update authority gating UI based on fetched status
        updateAuthorityGatingUI();
    };

    // Run status refresh
    refreshConnectionStatus();

    // Step mapper for query param jumping
    const stepMap = {
        'profile': 1,
        'source': 2,
        'lock': 3
    };

    // Jump to step if specified in query param
    if (stepParam && stepMap[stepParam]) {
        currentStep = stepMap[stepParam];
        // Mark previous steps as completed if jumping forward
        for (let i = 1; i < currentStep; i++) {
            if (!completedSteps.includes(i)) {
                completedSteps.push(i);
            }
        }
    }

    // Show toast if just connected
    if (connectedParam === 'x') {
        setTimeout(() => {
            showToast('X Account Connected', 'Authority binding established successfully.');
        }, 500);
    } else if (connectedParam === 'stripe') {
        setTimeout(() => {
            showToast('Stripe Connected', 'Revenue authority binding established.');
        }, 500);
    }

    // Clean URL after consuming all query params (prevent toast replay on refresh)
    if (stepParam || connectedParam) {
        window.history.replaceState({}, '', window.location.pathname + '#/contracts');
    }

    // Helper: show toast notification
    function showToast(title, message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-6 right-6 bg-[#1F7A4D] text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
        toast.innerHTML = `
            <div class="font-semibold text-sm">${title}</div>
            <div class="text-xs opacity-90 mt-1">${message}</div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // =========================================================
    // AUTHORITY GATING - Fail-closed verification
    // =========================================================

    // Single source of truth: is the selected platform authority satisfied?
    function isAuthoritySatisfied() {
        if (!selectedSource) return false; // No source selected = not satisfied
        if (selectedSource === 'TWITTER') return !!xVerified;
        if (selectedSource === 'STRIPE') return !!stripeVerified;
        return false; // Unknown source = not satisfied
    }

    // Update UI based on authority gating status
    function updateAuthorityGatingUI() {
        const bindBtn = document.getElementById('btn-step-2');
        if (!bindBtn) return;

        const satisfied = isAuthoritySatisfied();
        bindBtn.disabled = !satisfied;

        // Update button appearance
        if (satisfied) {
            bindBtn.classList.remove('bg-gray-200', 'text-gray-400', 'cursor-not-allowed');
            bindBtn.classList.add('bg-gray-900', 'text-white', 'cursor-pointer', 'hover:bg-gray-800');
        } else {
            bindBtn.classList.remove('bg-gray-900', 'text-white', 'cursor-pointer', 'hover:bg-gray-800');
            bindBtn.classList.add('bg-gray-200', 'text-gray-400', 'cursor-not-allowed');
        }

        // Also update metric preview visibility (only show if authority satisfied)
        const metricPreview = document.getElementById('metric-preview');
        if (metricPreview) {
            metricPreview.style.display = satisfied ? 'block' : 'none';
        }
    }

    // Helper: show authority required modal
    function showAuthorityRequiredModal() {
        // Handle no source selected
        if (!selectedSource) {
            showEnforcementModal({
                title: 'Select an Authority',
                message: 'You must select an authority source (X or Stripe) before proceeding.',
                ruleId: 'REQUIRE_AUTHORITY_SELECTION'
            });
            return;
        }

        const platformName = selectedSource === 'TWITTER' ? 'X (Twitter)' : 'Stripe';
        const panelId = selectedSource === 'TWITTER' ? 'x-verify-panel' : 'stripe-verify-panel';

        showEnforcementModal({
            title: 'Authority Binding Required',
            message: `You must connect and verify your ${platformName} account before proceeding. Authority binding ensures oracle integrity during contract execution.`,
            ruleId: 'REQUIRE_AUTHORITY_BINDING',
            primaryText: 'Connect Authority',
            primaryAction: () => {
                const panel = document.getElementById(panelId);
                if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

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

        // Navigate to step (enforces authority gating on forward navigation)
        goToStep: function (stepNumber) {
            // Always allow backward navigation
            if (stepNumber <= currentStep) {
                this.setStep(stepNumber);
                return;
            }

            // Forward navigation: check authority gating for Step 3
            if (stepNumber >= 3 && !isAuthoritySatisfied()) {
                showAuthorityRequiredModal();
                return;
            }

            // Only allow forward if previous step is completed
            if (completedSteps.includes(stepNumber - 1)) {
                this.setStep(stepNumber);
            }
        },

        selectRisk: function (risk, el) {
            selectedRisk = risk;
            // Remove selection from all tier cards
            document.querySelectorAll('#step-1 .grid button').forEach(c => {
                c.classList.remove('border-gray-900');
                c.style.borderColor = '';
            });
            // Add selection to clicked card
            el.classList.add('border-gray-900');
            el.style.borderColor = '#0a0a0a';

            // Enable and style the confirm button
            const btn = document.getElementById('btn-step-1');
            btn.disabled = false;
            btn.classList.remove('border-gray-200', 'bg-gray-100', 'text-gray-400', 'cursor-not-allowed');
            btn.classList.add('border-gray-900', 'bg-gray-900', 'text-white', 'cursor-pointer', 'hover:bg-gray-800');
        },

        selectSource: function (source, el) {
            selectedSource = source;
            // Remove selection from all authority cards
            document.querySelectorAll('#step-2 .authority-card').forEach(c => {
                c.classList.remove('border-gray-900');
                c.style.borderColor = '';
            });
            // Add selection to clicked card
            el.classList.add('border-gray-900');
            el.style.borderColor = '#0a0a0a';

            // Show authority panel with correct content
            const panel = document.getElementById('authority-panel');
            const data = authorityData[source];

            if (data) {
                document.getElementById('panel-title').textContent = data.title;
                document.getElementById('panel-integrity').textContent = data.integrity;
                document.getElementById('panel-measured').textContent = data.measured;
                document.getElementById('panel-verified').textContent = data.verified;
                document.getElementById('panel-failcases').textContent = data.failcases;
                panel.style.display = 'block';
            }

            // Show/hide X verification panel based on source
            const xVerifyPanel = document.getElementById('x-verify-panel');
            const stripeVerifyPanel = document.getElementById('stripe-verify-panel');

            // Hide both panels first
            xVerifyPanel.style.display = 'none';
            stripeVerifyPanel.style.display = 'none';

            if (source === 'TWITTER') {
                xVerifyPanel.style.display = 'block';
                // Check if X is already connected via OAuth
                this.checkXConnection();
            } else if (source === 'STRIPE') {
                stripeVerifyPanel.style.display = 'block';
            }

            // Update authority gating UI (controls button disabled state + metric preview)
            updateAuthorityGatingUI();

            if (window.lucide) window.lucide.createIcons();
        },

        nextStep: function () {
            if (currentStep === 1) {
                this.markCompleted(1);
                this.setStep(2);
            } else if (currentStep === 2) {
                // AUTHORITY GATE: cannot proceed to Step 3 without VERIFIED binding
                if (!isAuthoritySatisfied()) {
                    showAuthorityRequiredModal();
                    return;
                }
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
            const holdBar = document.getElementById('hold-bar');
            const btnText = document.getElementById('btn-text');

            btn.classList.add('holding');
            btnText.textContent = 'EXECUTING...';

            // Animate the red progress bar inside button
            holdBar.style.transition = 'width 2s linear';
            holdBar.style.width = '100%';

            holdTimer = setTimeout(() => { this.completeHold(); }, 2000);
        },

        endHold: function () {
            if (holdComplete) return;
            const btn = document.getElementById('btn-execute');
            const holdBar = document.getElementById('hold-bar');
            const btnText = document.getElementById('btn-text');

            btn.classList.remove('holding');
            btnText.textContent = 'HOLD TO EXECUTE';

            // Reset the progress bar
            holdBar.style.transition = 'none';
            holdBar.style.width = '0%';

            clearTimeout(holdTimer);
        },

        completeHold: async function () {
            const btn = document.getElementById('btn-execute');
            const btnText = document.getElementById('btn-text');

            // ==================================================
            // FLOW LOCK - Prevent multi-click / multi-tab double runs
            // Uses centralized lock utilities with auto-expiry
            // ==================================================
            if (!acquireFlowLock()) {
                showErrorModal('A contract execution is already in progress. Please wait for it to complete or close the other browser tab.', {
                    code: 'FLOW_LOCKED',
                    title: 'Flow In Progress'
                });
                return;
            }

            holdComplete = true;
            btn.disabled = true;

            // Fill the top progress bar to 100%
            const topProgressBar = document.getElementById('progress-fill');
            if (topProgressBar) {
                topProgressBar.style.width = '100%';
            }

            // Helper: poll until state matches (with timeout return)
            // SAFETY: Abort if contractId missing or state undefined
            const pollUntilState = async (contractId, acceptStates, timeoutMs = 90000) => {
                if (!contractId) {
                    console.error('[Contracts] pollUntilState: contractId missing!');
                    return { timeout: true, lastState: undefined, aborted: true };
                }

                const start = Date.now();
                let delay = 750;
                const maxDelay = 4000;
                let lastState = null;
                let consecutiveUndefined = 0;

                while (true) {
                    try {
                        const res = await window.api.getContract(contractId);
                        lastState = res.contract?.derivedState || res.contract?.state;
                        console.log(`[Contracts] Polling state: ${lastState}`);

                        // Safety: if state is consistently undefined, abort polling
                        if (lastState === undefined) {
                            consecutiveUndefined++;
                            if (consecutiveUndefined >= 3) {
                                console.error('[Contracts] Polling aborted: state undefined 3 times');
                                return { timeout: true, lastState: undefined, aborted: true, contract: res.contract, events: res.events };
                            }
                        } else {
                            consecutiveUndefined = 0;
                        }

                        if (acceptStates.includes(lastState)) return res;
                    } catch (pollErr) {
                        console.warn('[Contracts] Poll error:', pollErr.message);
                    }

                    if (Date.now() - start > timeoutMs) {
                        return { timeout: true, lastState, contract: null, events: [] };
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
                if (lockRes.contract?.derivedState === 'LOCKED') {
                    console.log('[Contracts] Already LOCKED, skipping execute...');
                    // Jump to finalize
                    btnText.textContent = "Already executed";
                    releaseFlowLock();
                    console.log('[Contracts] Redirecting to receipt', { contractId });
                    setTimeout(() => {
                        window.router.navigate('/receipts/' + contractId);
                    }, 1000);
                    return;
                }

                // Wait for FUNDS_LOCKED if still FUNDS_AUTHORIZED
                if (lockRes.contract?.derivedState === 'FUNDS_AUTHORIZED') {
                    console.log('[Contracts] FUNDS_AUTHORIZED, waiting for FUNDS_LOCKED...');
                    const lockedRes = await pollUntilState(contractId, ['FUNDS_LOCKED', 'LOCKED'], 60000);
                    if (lockedRes.timeout) {
                        const e = new Error(`Funds authorized but not locked. State: ${lockedRes.lastState}`);
                        e.code = 'FUNDS_LOCK_TIMEOUT';
                        throw e;
                    }
                    if (lockedRes.contract?.derivedState === 'LOCKED') {
                        console.log('[Contracts] Already LOCKED, skipping execute...');
                        btnText.textContent = "Already executed";
                        releaseFlowLock();
                        console.log('[Contracts] Redirecting to receipt', { contractId });
                        setTimeout(() => {
                            window.router.navigate('/receipts/' + contractId);
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
                releaseFlowLock(); // Release flow lock on success
                this.markCompleted(3);
                btnText.textContent = "Contract Executed";
                btn.classList.remove('bg-neutral-900');
                btn.classList.add('bg-black', 'cursor-default');

                const statusText = document.querySelector('.step-status');
                if (statusText) statusText.textContent = 'S: Complete';

                updateProgressBar(3, true);

                // Navigate to receipt page
                console.log('[Contracts] Redirecting to receipt', { contractId });
                setTimeout(() => {
                    window.router.navigate('/receipts/' + contractId);
                }, 1500);

            } catch (error) {
                console.error('[Contracts] completeHold error:', error);
                releaseFlowLock(); // Release lock on failure
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

        // Check X connection - thin wrapper around canonical refreshConnectionStatus
        checkXConnection: async function () {
            await refreshConnectionStatus();
            return xVerified;
        },

        // Show connected state in UI (PURE RENDERER - does NOT set gating)
        showXConnectedState: function (username) {
            // Hide connect button, show connected state
            const connectSection = document.getElementById('x-connect-section');
            const connectedState = document.getElementById('x-connected-state');
            const connectedHandle = document.getElementById('x-connected-handle');
            const statusLabel = document.getElementById('x-verify-status');

            if (connectSection) connectSection.classList.add('hidden');
            if (connectedState) connectedState.classList.remove('hidden');
            if (connectedHandle) connectedHandle.textContent = '@' + (username || 'connected');
            if (statusLabel) {
                statusLabel.textContent = 'Connected';
                statusLabel.classList.remove('text-neutral-400');
                statusLabel.classList.add('text-[#1F7A4D]');
            }

            // Gating is controlled by updateAuthorityGatingUI() - NOT here
            updateAuthorityGatingUI();
        },

        connectXOAuth: async function () {
            const btn = document.getElementById('x-connect-btn');
            if (!btn) return;

            btn.disabled = true;
            btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>';

            try {
                // Call backend to get OAuth URL
                const result = await window.api.startXOAuth();
                console.log('[Contracts] startXOAuth result:', result);

                // If already connected, refresh canonical status
                if (result.connected) {
                    await refreshConnectionStatus();
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
                btn.innerHTML = '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> Connect X Account';
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
                    // Already connected - refresh canonical status
                    await refreshConnectionStatus();
                    // Show UI immediately since we know it's connected
                    document.getElementById('stripe-connect-step1').classList.add('hidden');
                    document.getElementById('stripe-connect-success').classList.remove('hidden');
                    document.getElementById('stripe-account-id').textContent = result.stripeAccountId + ' • Connected';
                    document.getElementById('stripe-verify-status').textContent = 'Connected';
                    document.getElementById('stripe-verify-status').classList.remove('text-neutral-400');
                    document.getElementById('stripe-verify-status').classList.add('text-[#1F7A4D]');
                    if (window.lucide) window.lucide.createIcons();
                    return;
                }

                // Store state for callback handling
                localStorage.setItem('stripe_oauth_flow', JSON.stringify({
                    state: result.state,
                    startedAt: Date.now(),
                }));
                localStorage.setItem('stripe_oauth_state', result.state);

                // Open Stripe Connect in a popup
                const popup = window.open(
                    result.oauthUrl,
                    'stripe-connect',
                    'width=600,height=700,scrollbars=yes'
                );

                // Poll for connection status WHILE popup is open (every 2 seconds)
                const pollInterval = setInterval(async () => {
                    try {
                        // Check if popup was closed by user
                        if (popup && popup.closed) {
                            clearInterval(pollInterval);
                            // Final check for connection
                            await refreshConnectionStatus();
                            if (stripeVerified) {
                                console.log('[Contracts] Stripe connected after popup closed');
                                showStripeConnectedUI();
                            } else {
                                // User closed without completing
                                btn.textContent = 'Connect with Stripe';
                                btn.disabled = false;
                            }
                            localStorage.removeItem('stripe_oauth_flow');
                            localStorage.removeItem('stripe_oauth_state');
                            return;
                        }

                        // Poll backend for connection status while popup is open
                        const status = await window.api.getStripeStatus();
                        console.log('[Contracts] Stripe status poll:', status);

                        if (status.connected) {
                            console.log('[Contracts] Stripe connected during poll!');
                            clearInterval(pollInterval);

                            // Close popup
                            if (popup && !popup.closed) popup.close();

                            // Update local state
                            stripeVerified = true;
                            stripeAccountId = status.stripeAccountId || null;
                            window.appState.connectedSources.stripe = true;

                            // Re-hydrate session
                            if (window.hydrateSession) await window.hydrateSession();

                            // Show connected UI
                            showStripeConnectedUI();

                            // Clean up
                            localStorage.removeItem('stripe_oauth_flow');
                            localStorage.removeItem('stripe_oauth_state');
                        }
                    } catch (pollErr) {
                        console.warn('[Contracts] Stripe poll error:', pollErr);
                    }
                }, 2000); // Poll every 2 seconds

                // Timeout after 10 minutes
                setTimeout(() => {
                    clearInterval(pollInterval);
                    if (btn.innerHTML.includes('spin')) {
                        btn.innerHTML = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg> Connect with Stripe';
                        btn.disabled = false;
                    }
                    localStorage.removeItem('stripe_oauth_flow');
                    localStorage.removeItem('stripe_oauth_state');
                }, 10 * 60 * 1000);

                // Helper to show connected UI
                function showStripeConnectedUI() {
                    document.getElementById('stripe-connect-step1').classList.add('hidden');
                    document.getElementById('stripe-connect-success').classList.remove('hidden');
                    document.getElementById('stripe-account-id').textContent = (stripeAccountId || 'acct_xxx') + ' • Connected';
                    document.getElementById('stripe-verify-status').textContent = 'Connected';
                    document.getElementById('stripe-verify-status').classList.remove('text-neutral-400');
                    document.getElementById('stripe-verify-status').classList.add('text-[#1F7A4D]');
                    if (window.lucide) window.lucide.createIcons();

                    // CRITICAL: Enable the BIND AUTHORITY button now that Stripe is connected
                    updateAuthorityGatingUI();
                }

            } catch (error) {
                console.error('[Contracts] startStripeConnect error:', error);
                btn.innerHTML = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg> Connect with Stripe';
                btn.disabled = false;
                alert('Failed to start Stripe Connect: ' + (error.message || 'Unknown error'));
            }
        }
    };

    // Initialize wizard to correct step (supports query param jumping)
    window.wizard.setStep(currentStep);
    updateProgressBar(currentStep);
}
