// Profile View - Identity Record
export function renderProfile() {
    return `
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 mb-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-8">
                <span>Collateral</span>
                <span>›</span>
                <span class="text-neutral-900">Identity Record</span>
            </div>

            <!-- Profile Header -->
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                    <h1 class="font-display text-4xl md:text-5xl font-normal text-[#921818] tracking-tight mb-2" id="profile-display-name">Alexander Doe</h1>
                    <div class="flex items-center gap-3">
                        <span class="font-mono text-sm text-neutral-500" id="profile-handle">@alex_dev</span>
                        <span class="text-neutral-300">•</span>
                        <span class="font-mono text-[11px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-sm">0x8a7...b21</span>
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button class="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 bg-white text-neutral-600 text-[11px] font-medium uppercase tracking-wide hover:border-neutral-400 transition-colors">
                        <i data-lucide="link" class="w-3.5 h-3.5"></i>
                        Copy Record Link
                    </button>
                    <button onclick="window.app.openSettingsModal()" class="flex items-center gap-2 px-4 py-2.5 bg-[#921818] text-white text-[11px] font-medium uppercase tracking-wide hover:bg-[#751212] transition-colors">
                        <i data-lucide="settings" class="w-3.5 h-3.5"></i>
                        Settings
                    </button>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 mb-10">
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Settlement Rate</span>
                    <span class="font-display text-3xl font-medium text-neutral-900">98.5%</span>
                    <p class="font-mono text-[9px] text-neutral-400 mt-1">Derived from settled vs forfeited contracts</p>
                </div>
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Total Contracts</span>
                    <span class="font-display text-3xl font-medium text-neutral-900">42</span>
                </div>
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">TVL (Settled)</span>
                    <span class="font-display text-3xl font-medium text-neutral-900">$12,450</span>
                </div>
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Forfeited</span>
                    <span class="font-display text-3xl font-medium text-[#921818]">1</span>
                </div>
            </div>

            <!-- Tabs -->
            <div class="flex gap-0 border-b border-neutral-200 mb-8 overflow-x-auto">
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-neutral-900 text-neutral-900 font-medium whitespace-nowrap" data-tab="overview">Overview</button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="contracts">Active Contracts <span class="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded ml-1">3</span></button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="history">Settlement History</button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="sources">Connected Sources</button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="timeline">Identity Timeline</button>
            </div>

            <!-- Tab Content Container -->
            <div id="tab-content">
                <!-- Overview Tab (default) -->
                <div id="tab-overview" class="tab-panel">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="md:col-span-2 border border-neutral-200 bg-white p-6">
                            <h3 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">Identity Summary</h3>
                            <p class="text-sm text-neutral-600 leading-relaxed">
                                Summary of this identity's historical contract performance. This record aggregates cryptographic proof of executed commitments, settlement rates, and total value locked across all connected verification sources. This account maintains a high settlement standing with minimal forfeiture history.
                            </p>
                        </div>
                        <div class="border border-neutral-200 bg-neutral-50 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-mono text-[10px] text-[#921818] uppercase tracking-widest font-medium">Identity Metadata</h3>
                                <i data-lucide="lock" class="w-3.5 h-3.5 text-neutral-300"></i>
                            </div>
                            <div class="space-y-4">
                                <div>
                                    <span class="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block mb-1">Bio</span>
                                    <p class="text-sm text-neutral-700">Full-stack developer building on-chain accountability tools.</p>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">Verified</span>
                                    <span class="flex items-center gap-1.5 text-[#1F7A4D] text-sm font-medium">
                                        <i data-lucide="check-circle" class="w-4 h-4"></i>
                                        True
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Active Contracts Tab -->
                <div id="tab-contracts" class="tab-panel hidden">
                    <div class="border border-neutral-200 bg-white overflow-hidden">
                        <table class="w-full">
                            <thead class="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Contract</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Source</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Locked</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Deadline (UTC)</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Status</th>
                                    <th class="text-right py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-100">
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Ship v2.1 to Production</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">GitHub</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$500.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Oct 25, 12:00</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-white bg-[#1F7A4D] px-2 py-1 uppercase tracking-wider">Active</span></td>
                                    <td class="py-4 px-4 text-right"><button class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900">View</button></td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Maintain 99.9% Uptime</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">PingDOM</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$5,000.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Nov 01, 00:00</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-white bg-[#1F7A4D] px-2 py-1 uppercase tracking-wider">Active</span></td>
                                    <td class="py-4 px-4 text-right"><button class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900">View</button></td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Weekly Fitness Goal</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Strava</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$100.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Oct 27, 08:00</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-neutral-600 bg-neutral-200 px-2 py-1 uppercase tracking-wider">Pending</span></td>
                                    <td class="py-4 px-4 text-right"><button class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900">View</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Settlement History Tab -->
                <div id="tab-history" class="tab-panel hidden">
                    <div class="border border-neutral-200 bg-white overflow-hidden">
                        <table class="w-full">
                            <thead class="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Contract</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Source</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Value</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Settled</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Outcome</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-100">
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Launch MVP by Q3</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">GitHub</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$2,000.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Sep 30, 2024</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-[#1F7A4D]">+$800 RETURNED</span></td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">10K Twitter Followers</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">X/Twitter</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$500.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Aug 15, 2024</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-[#921818]">FORFEITED</span></td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">$5K MRR Milestone</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Stripe</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$1,000.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Jul 01, 2024</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-[#1F7A4D]">+$1,500 RETURNED</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Connected Sources Tab -->
                <div id="tab-sources" class="tab-panel hidden">
                    <!-- Alert for new users -->
                    <div id="sources-alert" class="bg-[rgba(161,130,57,0.06)] border border-[#A18239]/30 p-4 mb-6">
                        <p class="font-sans text-sm text-[#A18239] font-medium mb-1">Connect verification sources to create contracts</p>
                        <p class="font-mono text-[10px] text-[#A18239]/70 uppercase tracking-widest">At least one source required for contract execution.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- X / Twitter -->
                        <div id="source-twitter" class="border border-neutral-200 bg-white p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-neutral-900 rounded flex items-center justify-center">
                                    <span class="text-white font-bold text-lg">X</span>
                                </div>
                                <div>
                                    <h4 class="font-sans text-sm font-medium text-neutral-900">X / Twitter</h4>
                                    <p class="font-mono text-[11px] text-neutral-400" id="twitter-status">Not connected</p>
                                </div>
                            </div>
                            <button onclick="window.app.connectSource('twitter')" id="twitter-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                                Connect
                            </button>
                        </div>
                        
                        <!-- GitHub -->
                        <div id="source-github" class="border border-neutral-200 bg-white p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center">
                                    <i data-lucide="github" class="w-5 h-5 text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-sans text-sm font-medium text-neutral-900">GitHub</h4>
                                    <p class="font-mono text-[11px] text-neutral-400" id="github-status">Not connected</p>
                                </div>
                            </div>
                            <button onclick="window.app.connectSource('github')" id="github-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                                Connect
                            </button>
                        </div>
                        
                        <!-- Stripe -->
                        <div id="source-stripe" class="border border-neutral-200 bg-white p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-[#635BFF] rounded flex items-center justify-center">
                                    <span class="text-white font-bold text-sm">S</span>
                                </div>
                                <div>
                                    <h4 class="font-sans text-sm font-medium text-neutral-900">Stripe</h4>
                                    <p class="font-mono text-[11px] text-neutral-400" id="stripe-status">Not connected</p>
                                </div>
                            </div>
                            <button onclick="window.app.connectSource('stripe')" id="stripe-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                                Connect
                            </button>
                        </div>
                        
                        <!-- Add More -->
                        <div class="border border-dashed border-neutral-300 bg-neutral-50 p-6 flex items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors">
                            <div class="flex items-center gap-2 text-neutral-400">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                                <span class="font-mono text-[11px] uppercase tracking-wide">More Sources Coming</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Identity Timeline Tab -->
                <div id="tab-timeline" class="tab-panel hidden">
                    <div class="border border-neutral-200 bg-white p-6">
                        <div class="relative pl-6 space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-neutral-200">
                            <div class="relative">
                                <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#1F7A4D] border-2 border-white"></div>
                                <div class="flex justify-between items-baseline mb-1">
                                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">Identity Created</span>
                                    <span class="font-mono text-[10px] text-neutral-400">Jan 15, 2024</span>
                                </div>
                                <p class="text-sm text-neutral-500">Account registered and email verified.</p>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white"></div>
                                <div class="flex justify-between items-baseline mb-1">
                                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">X/Twitter Connected</span>
                                    <span class="font-mono text-[10px] text-neutral-400">Jan 16, 2024</span>
                                </div>
                                <p class="text-sm text-neutral-500">Linked @alex_dev for public signal verification.</p>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white"></div>
                                <div class="flex justify-between items-baseline mb-1">
                                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">First Contract Executed</span>
                                    <span class="font-mono text-[10px] text-neutral-400">Feb 01, 2024</span>
                                </div>
                                <p class="text-sm text-neutral-500">Locked $500 against shipping MVP milestone.</p>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white"></div>
                                <div class="flex justify-between items-baseline mb-1">
                                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">GitHub Connected</span>
                                    <span class="font-mono text-[10px] text-neutral-400">Mar 10, 2024</span>
                                </div>
                                <p class="text-sm text-neutral-500">Linked alex-dev for code verification.</p>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white"></div>
                                <div class="flex justify-between items-baseline mb-1">
                                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">Stripe Connected</span>
                                    <span class="font-mono text-[10px] text-neutral-400">Apr 22, 2024</span>
                                </div>
                                <p class="text-sm text-neutral-500">Linked Stripe for revenue verification.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initProfile() {
    const tabs = document.querySelectorAll('.profile-tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Update tab styles
            tabs.forEach(t => {
                t.classList.remove('border-neutral-900', 'text-neutral-900', 'font-medium');
                t.classList.add('border-transparent', 'text-neutral-400');
            });
            tab.classList.remove('border-transparent', 'text-neutral-400');
            tab.classList.add('border-neutral-900', 'text-neutral-900', 'font-medium');

            // Show/hide panels
            panels.forEach(panel => {
                panel.classList.add('hidden');
            });
            const targetPanel = document.getElementById('tab-' + targetTab);
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
            }

            // Re-init icons for the new panel
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}
