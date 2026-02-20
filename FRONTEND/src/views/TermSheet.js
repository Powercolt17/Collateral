
// TermSheet.js — Institutional Execution Interface
// Cold. Precise. Like signing a financial instrument.

import { openExecutionModal } from './ExecutionModal.js';

export function renderTermSheet(params) {
    return `
        <style>
            .ts-grain {
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.015'/%3E%3C/svg%3E");
            }
            .ts-tier-card { transition: all 150ms ease; }
            .ts-tier-card:has(input:checked) {
                border-color: #1a1a1a;
                background: #fafaf9;
                box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);
                transform: scale(1.01);
            }
            .ts-tier-card:hover { border-color: #d4d4d4; }
            #btn-ts-execute {
                transition: all 180ms ease;
            }
            #btn-ts-execute:hover {
                background: #6B1212;
                transform: translateY(-1px);
                box-shadow: 0 8px 24px rgba(146, 24, 24, 0.25);
            }
            #btn-ts-execute:active {
                transform: translateY(0) scale(0.98);
            }
            .ts-overlay {
                animation: ts-fade-in 200ms ease forwards;
            }
            .ts-overlay-card {
                animation: ts-slide-up 250ms ease forwards;
            }
            @keyframes ts-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes ts-slide-up {
                from { opacity: 0; transform: translate(-50%, -48%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
        </style>

        <div class="pb-32 w-full max-w-6xl mx-auto px-6 relative z-10 min-h-screen font-sans text-neutral-900 ts-grain">
            <!-- Navigation Breadcrumb -->
            <div class="flex items-center gap-2 mb-8 font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-8">
                <button onclick="window.router.navigate('/overview')" class="hover:text-neutral-900 cursor-pointer transition-colors">Market</button>
                <i data-lucide="chevron-right" class="w-3 h-3"></i>
                <span class="text-neutral-900">Term Sheet</span>
            </div>

            <!-- Loading State -->
            <div id="terms-loading" class="flex items-center justify-center py-32">
                <div class="w-6 h-6 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
            </div>

            <!-- Error State -->
            <div id="terms-error" class="hidden flex flex-col items-center justify-center py-32 text-center">
                <div class="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <i data-lucide="file-x" class="w-6 h-6 text-neutral-400"></i>
                </div>
                <h2 class="text-lg font-medium text-neutral-900 mb-2">Contract Unavailable</h2>
                <p id="terms-error-msg" class="text-sm text-neutral-500 max-w-md mb-6">The requested contract terms could not be retrieved.</p>
                <button onclick="window.router.navigate('/overview')" class="px-6 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors">
                    Return to Market
                </button>
            </div>

            <!-- Term Sheet Content -->
            <div id="terms-content" class="hidden">
                
                <!-- HEADER -->
                <header class="mb-14 border-b border-neutral-200 pb-10">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div class="flex-1">
                            <!-- Pre-header authority line -->
                            <p id="ts-pre-header" class="text-[11px] uppercase tracking-[0.08em] text-[#6B7280] mb-3 font-medium leading-tight"></p>

                            <div class="flex items-center gap-3 mb-5">
                                <span id="ts-provider-badge" class="px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider font-medium border"></span>
                                <span id="ts-risk-badge" class="px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider font-medium border"></span>
                                <span id="ts-id" class="px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-50 border border-neutral-100"></span>
                            </div>
                            <h1 id="ts-title" class="text-4xl md:text-[2.8rem] font-bold tracking-[-0.02em] text-[#0a0a0a] mb-3"></h1>
                            <p id="ts-description" class="text-neutral-500 text-lg leading-relaxed max-w-2xl"></p>
                        </div>
                    </div>
                </header>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-14">
                    
                    <!-- LEFT COLUMN: TERMS (8 cols) -->
                    <div class="lg:col-span-8 space-y-14">
                        
                        <!-- Contract Mechanics -->
                        <section>
                            <h3 class="font-mono text-[10px] text-[#4B5563] uppercase tracking-widest mb-7 border-b border-neutral-200 pb-2 font-semibold">Contract Mechanics</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div class="bg-[#fafaf9] p-6 rounded-sm border border-neutral-200">
                                    <div class="flex items-center gap-2 mb-2">
                                        <i data-lucide="clock" class="w-4 h-4 text-neutral-400"></i>
                                        <span class="text-xs font-semibold text-neutral-900 uppercase tracking-wide">Duration</span>
                                    </div>
                                    <p id="ts-duration" class="text-2xl font-mono font-medium text-neutral-900 mb-1"></p>
                                    <p class="text-[11px] text-neutral-500 leading-normal">
                                        Verification window begins immediately upon execution. Settlement occurs automatically at window close.
                                    </p>
                                </div>
                                <div class="bg-[#fafaf9] p-6 rounded-sm border border-neutral-200">
                                    <div class="flex items-center gap-2 mb-2">
                                        <i data-lucide="target" class="w-4 h-4 text-neutral-400"></i>
                                        <span class="text-xs font-semibold text-neutral-900 uppercase tracking-wide">Objective</span>
                                    </div>
                                    <p id="ts-objective" class="text-2xl font-mono font-medium text-neutral-900 mb-1"></p>
                                    <p class="text-[11px] text-neutral-500 leading-normal">
                                        Target delta required above baseline. Measured via confirmed <span id="ts-source-name"></span> events.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- Objective Visualization -->
                        <section id="ts-obj-viz">
                            <h3 class="font-mono text-[10px] text-[#4B5563] uppercase tracking-widest mb-7 border-b border-neutral-200 pb-2 font-semibold">Target Projection</h3>
                            <div class="grid grid-cols-3 gap-px bg-neutral-200 rounded-sm overflow-hidden border border-neutral-200">
                                <div class="bg-white p-5 text-center">
                                    <div class="text-[10px] uppercase tracking-widest text-neutral-400 font-medium mb-2">Baseline</div>
                                    <div id="ts-viz-baseline" class="font-mono text-lg font-semibold text-neutral-900">—</div>
                                </div>
                                <div class="bg-white p-5 text-center">
                                    <div class="text-[10px] uppercase tracking-widest text-neutral-400 font-medium mb-2">Target Increase</div>
                                    <div id="ts-viz-delta" class="font-mono text-lg font-semibold text-[#166534]">—</div>
                                </div>
                                <div class="bg-white p-5 text-center">
                                    <div class="text-[10px] uppercase tracking-widest text-neutral-400 font-medium mb-2">Required Revenue</div>
                                    <div id="ts-viz-required" class="font-mono text-lg font-semibold text-neutral-900">—</div>
                                </div>
                            </div>
                            <p id="ts-viz-note" class="mt-2 text-[10px] text-neutral-400 italic"></p>
                        </section>

                        <!-- Payout Schedule -->
                        <section>
                            <h3 class="font-mono text-[10px] text-[#4B5563] uppercase tracking-widest mb-7 border-b border-neutral-200 pb-2 font-semibold">Payout Schedule (Estimated)</h3>
                            <div class="border border-neutral-200 rounded-sm overflow-hidden">
                                <table class="w-full text-sm text-left">
                                    <thead class="bg-[#f0f0ee] border-b border-neutral-300">
                                        <tr>
                                            <th class="px-6 py-2.5 font-mono text-[10px] uppercase tracking-wider text-neutral-600 font-semibold">Stake Tier</th>
                                            <th class="px-6 py-2.5 font-mono text-[10px] uppercase tracking-wider text-neutral-600 font-semibold">Capital Required</th>
                                            <th class="px-6 py-2.5 font-mono text-[10px] uppercase tracking-wider text-neutral-600 font-semibold">Net Payout</th>
                                            <th class="px-6 py-2.5 font-mono text-[10px] uppercase tracking-wider text-neutral-600 font-semibold text-right">Implied Yield</th>
                                        </tr>
                                    </thead>
                                    <tbody id="ts-payout-rows" class="divide-y divide-neutral-100 bg-white">
                                        <!-- Rows injected here -->
                                    </tbody>
                                </table>
                            </div>
                            <p class="mt-3 text-[10px] text-neutral-400 italic">
                                * Payouts are net of platform fees (2.5%). Yield implies successful verification. Capital is fully forfeited on failure.
                            </p>
                            <p class="mt-1 text-[10px] text-[#9CA3AF]">
                                Most users fail to reach this target.
                            </p>
                        </section>

                        <!-- Verification Rules -->
                        <section>
                            <h3 class="font-mono text-[10px] text-[#4B5563] uppercase tracking-widest mb-7 border-b border-neutral-200 pb-2 font-semibold">Verification & Settlement</h3>
                            <div class="prose prose-sm max-w-none text-neutral-600">
                                <ul class="list-disc pl-4 space-y-2 marker:text-neutral-300">
                                    <li><strong>Source of Truth:</strong> Settlement depends solely on data retrieved from the connected <span id="ts-source-ref"></span> account.</li>
                                    <li><strong>Baseline Snapshot:</strong> A snapshot of historical performance is taken at the moment of execution to establish the baseline.</li>
                                    <li><strong>Binary Outcome:</strong> Contracts are binary. You either meet the target and receive the full payout, or you miss it and forfeit 100% of locked capital.</li>
                                    <li><strong>Anti-Gaming:</strong> Artificial manipulation of metrics (e.g., wash trading, self-dealing) detected by the oracle will result in immediate forfeiture.</li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    <!-- RIGHT COLUMN: ACTION PANEL (Sticky) (4 cols) -->
                    <div class="lg:col-span-4">
                        <div class="sticky top-6 space-y-6">
                            
                            <!-- Action Card -->
                            <div class="bg-[#fcfcfb] border border-neutral-200 shadow-xl shadow-neutral-200/40 rounded-sm overflow-hidden relative" style="border-top: 2px solid #921818;">
                                <!-- Status Bar -->
                                <div id="ts-action-status" class="h-[2px] w-full bg-neutral-200"></div>
                                
                                <div class="p-6 md:p-8">
                                    <h2 id="ts-action-title" class="text-lg font-semibold text-neutral-900 mb-4 font-sans tracking-[-0.01em]">
                                        Connect Provider
                                    </h2>
                                    
                                    <!-- Dynamic Content Container -->
                                    <div id="ts-action-content" class="space-y-5">
                                        <!-- Injected by JS -->
                                    </div>
                                </div>

                                <!-- Trust Footer -->
                                <div class="bg-[#f7f7f5] px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <i data-lucide="shield-check" class="w-3 h-3 text-neutral-400"></i>
                                        <span class="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Secure Execution</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <i data-lucide="lock" class="w-3 h-3 text-neutral-400"></i>
                                        <span class="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Escrowed</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Help / Support -->
                            <div class="text-center">
                                <a href="mailto:support@collateral.market" class="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                                    Need help with this contract?
                                </a>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Execution Overlay handled by shared ExecutionModal.js -->
    `;
}

export async function initTermSheet(params) {
    const templateId = params?.id;
    if (!templateId) {
        showError('No contract template ID provided.');
        return;
    }

    const loadingEl = document.getElementById('terms-loading');
    const contentEl = document.getElementById('terms-content');
    const errorEl = document.getElementById('terms-error');

    try {
        if (window.lucide) window.lucide.createIcons();

        let template = null;
        try {
            template = await window.api.getMarketContract(templateId);
        } catch (e) {
            console.error('Failed to fetch market contract:', e);
            throw new Error('Contract template not found.');
        }

        if (!template) {
            throw new Error('Contract template not found.');
        }

        hydrateTermSheet(template);

        const isConnected = checkProviderConnection(template.provider);
        renderActionPanel(template, isConnected);

        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');

        if (window.lucide) window.lucide.createIcons();

    } catch (err) {
        console.error('[TermSheet] Error:', err);
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        document.getElementById('terms-error-msg').textContent = err.message || 'Could not load contract terms.';
    }
}

function hydrateTermSheet(template) {
    const platform = template.provider || template.platform || 'General';
    const risk = template.riskTier || 'Standard';
    const windowDays = template.windowDays || template.durationDays || 30;

    // Pre-header authority line
    document.getElementById('ts-pre-header').textContent = `${platform} Verified Contract · ${windowDays} Day Performance Window`;

    document.getElementById('ts-title').textContent = template.title || 'Performance Contract';
    document.getElementById('ts-description').textContent = template.description || 'Verified outcome contract based on platform performance metrics.';
    document.getElementById('ts-id').textContent = `TMPL-${(template.id || '').substring(0, 6).toUpperCase()}`;

    // Badges
    const providerBadge = document.getElementById('ts-provider-badge');
    providerBadge.textContent = platform;
    providerBadge.className = `px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider font-medium border ${getProviderColor(platform)}`;

    const riskBadge = document.getElementById('ts-risk-badge');
    riskBadge.textContent = risk;
    riskBadge.className = `px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider font-medium border ${getRiskColor(risk)}`;

    // Terms
    document.getElementById('ts-duration').textContent = formatDuration(windowDays);
    document.getElementById('ts-objective').textContent = `> ${template.targetHint || template.targetValue || 'Baseline + ' + (template.targetDelta || '10%')}`;
    document.getElementById('ts-source-name').textContent = platform;
    document.getElementById('ts-source-ref').textContent = platform;

    // Objective Visualization
    const isConnected = checkProviderConnection(platform);
    if (isConnected) {
        // Real numbers would come from baseline API; placeholder for now
        const baseline = 48000;
        const delta = 15;
        const required = Math.round(baseline * (1 + delta / 100));
        document.getElementById('ts-viz-baseline').textContent = `$${baseline.toLocaleString()}`;
        document.getElementById('ts-viz-delta').textContent = `+${delta}%`;
        document.getElementById('ts-viz-required').textContent = `$${required.toLocaleString()}`;
        document.getElementById('ts-viz-note').textContent = 'Projected from your connected account baseline.';
    } else {
        document.getElementById('ts-viz-baseline').style.color = '#d4d4d4';
        document.getElementById('ts-viz-delta').style.color = '#d4d4d4';
        document.getElementById('ts-viz-required').style.color = '#d4d4d4';
        document.getElementById('ts-viz-baseline').textContent = '$—,———';
        document.getElementById('ts-viz-delta').textContent = '+——%';
        document.getElementById('ts-viz-required').textContent = '$—,———';
        document.getElementById('ts-viz-note').textContent = 'Connect your provider to see projected numbers.';
    }

    // Payout Table — refined
    const tbody = document.getElementById('ts-payout-rows');
    const tiers = template.tiers || generateDynamicTiers(template.minStakeCents, template.maxStakeCents, template.multiplier);

    tbody.innerHTML = tiers.map(tier => `
        <tr class="hover:bg-neutral-50/80 transition-colors">
            <td class="px-6 py-3 font-medium text-neutral-900 text-sm">${tier.name}</td>
            <td class="px-6 py-3 font-mono text-neutral-600 text-sm">$${(tier.stake || 0).toLocaleString()}</td>
            <td class="px-6 py-3 font-mono text-[#166534] font-bold text-sm">$${(tier.payout || 0).toLocaleString()}</td>
            <td class="px-6 py-3 text-right font-mono text-neutral-500 text-sm">${((tier.payout / tier.stake - 1) * 100).toFixed(0)}%</td>
        </tr>
    `).join('');

    template.tiers = tiers;
}

function generateDynamicTiers(minCents, maxCents, multiplier = 1.5) {
    const min = (minCents || 0) / 100;
    const max = (maxCents || 0) / 100;

    if (min === max || max === 0) {
        return [{ name: 'Fixed', stake: min || 25, payout: (min || 25) * multiplier }];
    }

    return [
        { name: 'Micro', stake: min, payout: Math.round(min * multiplier * 100) / 100 },
        { name: 'Standard', stake: Math.floor((min + max) / 2), payout: Math.round(Math.floor((min + max) / 2) * multiplier * 100) / 100 },
        { name: 'Institutional', stake: max, payout: Math.round(max * multiplier * 100) / 100 }
    ];
}

function renderActionPanel(template, isConnected) {
    const container = document.getElementById('ts-action-content');
    const title = document.getElementById('ts-action-title');
    const statusBar = document.getElementById('ts-action-status');
    const platform = template.provider || template.platform || 'Provider';

    if (!isConnected) {
        statusBar.className = 'h-[2px] w-full bg-amber-400';
        title.textContent = `Connect ${platform}`;

        container.innerHTML = `
            <p class="text-sm text-neutral-600 leading-relaxed">
                To generate personalized terms for this contract, you must connect your <strong>${platform}</strong> account.
                This allows us to verify your eligibility and calculate your baseline.
            </p>
            <div class="bg-amber-50 border border-amber-100 p-4 rounded-sm">
                <div class="flex items-start gap-3">
                    <i data-lucide="alert-circle" class="w-4 h-4 text-amber-600 mt-0.5"></i>
                    <p class="text-xs text-amber-800 leading-snug">
                        We only access read-only data required for verification. Your credentials are never stored.
                    </p>
                </div>
            </div>
            <button id="btn-ts-connect" class="w-full py-4 bg-neutral-900 text-white text-sm font-medium uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group">
                Connect ${platform}
                <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
            </button>
        `;

        document.getElementById('btn-ts-connect').addEventListener('click', () => {
            const source = platform.toLowerCase();
            if (window.app && window.app.connectSource) {
                window.app.connectSource(source);
            } else {
                alert('Connect function not available.');
            }
        });

    } else {
        statusBar.className = 'h-[2px] w-full bg-[#166534]';
        title.textContent = 'Lock Capital';

        const tiers = template.tiers || generateDefaultTiers(template.riskTier);

        container.innerHTML = `
            <p class="text-sm text-neutral-600 leading-relaxed">
                Select your capital commitment. Funds are held in escrow until settlement.
            </p>
            
            <!-- Tier Selector -->
            <div class="space-y-3">
                ${tiers.map((tier, i) => `
                    <label class="block ts-tier-card relative border border-neutral-200 rounded-sm cursor-pointer overflow-hidden">
                        <input type="radio" name="stake-tier" value="${tier.stake}" data-payout="${tier.payout}" class="peer sr-only" ${i === 0 ? 'checked' : ''}>
                        <div class="p-4">
                            <div class="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">${tier.name}</div>
                            <div class="space-y-1">
                                <div class="flex justify-between items-center">
                                    <span class="text-xs text-neutral-500">Capital Locked</span>
                                    <span class="font-mono text-sm font-bold text-neutral-900">$${tier.stake.toLocaleString()}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-xs text-neutral-500">If Successful</span>
                                    <span class="font-mono text-sm font-medium text-[#166534]">$${tier.payout.toLocaleString()}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-xs text-neutral-500">If Failed</span>
                                    <span class="font-mono text-sm font-medium text-[#921818]">-$${tier.stake.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </label>
                `).join('')}
            </div>

            <div class="pt-1">
                <button id="btn-ts-execute" class="w-full py-4 bg-[#921818] text-white text-[11px] font-semibold uppercase tracking-widest shadow-lg shadow-red-900/10">
                    Lock Capital
                </button>
                <p class="text-[10px] text-center text-neutral-400 mt-3">
                    Funds are held in escrow until settlement.
                </p>
            </div>
        `;

        // Execution Handler — opens shared execution modal
        document.getElementById('btn-ts-execute').addEventListener('click', () => {
            const selectedInput = document.querySelector('input[name="stake-tier"]:checked');
            const stake = Number(selectedInput.value);
            const payout = Number(selectedInput.dataset.payout);
            const windowDays = template.windowDays || template.durationDays || 30;
            const mult = stake > 0 ? payout / stake : 1.5;

            openExecutionModal({
                id: template.id || template.templateId,
                title: template.title || 'Performance Contract',
                goal: template.title || 'Performance Contract',
                tier: (template.riskTier || 'controlled').toLowerCase(),
                provider: template.provider || template.platform || 'stripe',
                platform: template.provider || template.platform || 'stripe',
                min_stake: stake,
                max_stake: stake,
                multiplier: mult,
                fee_bps: 250,
                window_days: windowDays,
                target_hint: template.targetHint || template.targetValue || '+15%',
                deadline: template.deadline || new Date(Date.now() + windowDays * 24 * 60 * 60 * 1000).toISOString()
            });
        });
    }

    if (window.lucide) window.lucide.createIcons();
}



// --- Helpers ---

function checkProviderConnection(platform) {
    if (!window.appState || !window.appState.connectedSources) return false;
    const key = (platform || '').toLowerCase();
    if (key === 'x' || key === 'twitter') return window.appState.connectedSources.twitter;
    if (key === 'stripe' || key === 'sales') return window.appState.connectedSources.stripe;
    return false;
}

function getProviderColor(platform) {
    const p = (platform || '').toLowerCase();
    if (p === 'stripe') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (p === 'twitter' || p === 'x') return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    return 'bg-neutral-50 text-neutral-600 border-neutral-100';
}

function getRiskColor(tier) {
    const t = (tier || '').toUpperCase();
    if (t === 'MAXIMUM' || t === 'ELITE' || t === 'TIER III') return 'bg-red-50 text-red-700 border-red-100';
    if (t === 'ELEVATED' || t === 'ADVANCED' || t === 'TIER II') return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-blue-50 text-blue-700 border-blue-100';
}

function generateDefaultTiers(risk) {
    const t = (risk || '').toUpperCase();
    if (t === 'MAXIMUM' || t === 'ELITE') {
        return [
            { name: 'Micro', stake: 100, payout: 400 },
            { name: 'Standard', stake: 500, payout: 2000 },
            { name: 'Institutional', stake: 2500, payout: 10000 }
        ];
    }
    return [
        { name: 'Micro', stake: 25, payout: 37.50 },
        { name: 'Standard', stake: 100, payout: 150 },
        { name: 'Institutional', stake: 1000, payout: 1500 }
    ];
}

function formatDuration(days) {
    return `${days} Days`;
}

function showError(msg) {
    document.getElementById('terms-loading')?.classList.add('hidden');
    document.getElementById('terms-error')?.classList.remove('hidden');
    document.getElementById('terms-error-msg').textContent = msg;
}
