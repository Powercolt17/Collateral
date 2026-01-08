// My Contracts View
export function renderMyContracts() {
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
                    <h1 class="font-display text-4xl md:text-5xl font-normal text-[#921818] tracking-tight mb-2">Alexander Doe</h1>
                    <div class="flex items-center gap-3">
                        <span class="font-mono text-sm text-neutral-500">@alex_dev</span>
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
                    <button class="flex items-center gap-2 px-4 py-2.5 bg-[#921818] text-white text-[11px] font-medium uppercase tracking-wide hover:bg-[#751212] transition-colors">
                        <i data-lucide="settings" class="w-3.5 h-3.5"></i>
                        Edit Profile
                    </button>
                </div>
            </div>

            <!-- Tabs -->
            <div class="flex gap-0 border-b border-neutral-200 mb-8">
                <button class="contracts-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-neutral-900 text-neutral-900 font-medium" data-tab="overview">Overview</button>
                <button class="contracts-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600" data-tab="active">Active Contracts <span class="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded ml-1">3</span></button>
            </div>

            <!-- Tab Content -->
            <div id="contracts-tab-content">
                <!-- Overview Tab -->
                <div id="contracts-tab-overview" class="contracts-panel">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Active Commitments</h3>
                        <button class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900">View all</button>
                    </div>
                    
                    <!-- Contract Cards -->
                    <div class="space-y-4">
                        <div class="border border-neutral-200 bg-white p-6">
                            <div class="flex justify-between items-start mb-3">
                                <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Expires in 12h</span>
                                <span class="font-mono text-sm text-neutral-900">$500.00 <span class="text-neutral-400">Locked</span></span>
                            </div>
                            <h4 class="font-sans text-lg font-medium text-neutral-900 mb-2">Ship v2.1 to Production</h4>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 text-neutral-500">
                                    <i data-lucide="git-branch" class="w-4 h-4"></i>
                                    <span class="font-mono text-[11px]">GitHub Integration</span>
                                </div>
                                <button onclick="window.router.navigate('/contracts/4421')" class="font-mono text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 uppercase tracking-wide">
                                    View Receipt <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                </button>
                            </div>
                        </div>

                        <div class="border border-neutral-200 bg-white p-6">
                            <div class="flex justify-between items-start mb-3">
                                <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Expires in 7d</span>
                                <span class="font-mono text-sm text-neutral-900">$5,000.00 <span class="text-neutral-400">Locked</span></span>
                            </div>
                            <h4 class="font-sans text-lg font-medium text-neutral-900 mb-2">Maintain 99.9% Uptime</h4>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 text-neutral-500">
                                    <i data-lucide="activity" class="w-4 h-4"></i>
                                    <span class="font-mono text-[11px]">PingDOM Integration</span>
                                </div>
                                <button onclick="window.router.navigate('/contracts/4422')" class="font-mono text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 uppercase tracking-wide">
                                    View Receipt <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                </button>
                            </div>
                        </div>

                        <div class="border border-neutral-200 bg-white p-6">
                            <div class="flex justify-between items-start mb-3">
                                <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Expires in 2d</span>
                                <span class="font-mono text-sm text-neutral-900">$100.00 <span class="text-neutral-400">Locked</span></span>
                            </div>
                            <h4 class="font-sans text-lg font-medium text-neutral-900 mb-2">Weekly Fitness Goal</h4>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 text-neutral-500">
                                    <i data-lucide="heart" class="w-4 h-4"></i>
                                    <span class="font-mono text-[11px]">Strava Integration</span>
                                </div>
                                <button onclick="window.router.navigate('/contracts/4423')" class="font-mono text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 uppercase tracking-wide">
                                    View Receipt <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Active Contracts Tab (Table View) -->
                <div id="contracts-tab-active" class="contracts-panel hidden">
                    <div class="border border-neutral-200 bg-white overflow-hidden">
                        <table class="w-full">
                            <thead class="border-b border-neutral-200">
                                <tr>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">ID</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Description</th>
                                    <th class="text-right py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Staked</th>
                                    <th class="text-right py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-100">
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">#4421</td>
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Ship v2.1 to Production</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900 text-right">$500.00</td>
                                    <td class="py-4 px-4 text-right">
                                        <button onclick="window.router.navigate('/contracts/4421')" class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900 uppercase">View</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">#4422</td>
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Maintain 99.9% Uptime</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900 text-right">$5,000.00</td>
                                    <td class="py-4 px-4 text-right">
                                        <button onclick="window.router.navigate('/contracts/4422')" class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900 uppercase">View</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">#4423</td>
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Weekly Fitness Goal</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900 text-right">$100.00</td>
                                    <td class="py-4 px-4 text-right">
                                        <button onclick="window.router.navigate('/contracts/4423')" class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900 uppercase">View</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initMyContracts() {
    const tabs = document.querySelectorAll('.contracts-tab');
    const panels = document.querySelectorAll('.contracts-panel');

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
            panels.forEach(panel => panel.classList.add('hidden'));
            const targetPanel = document.getElementById('contracts-tab-' + targetTab);
            if (targetPanel) targetPanel.classList.remove('hidden');

            if (window.lucide) window.lucide.createIcons();
        });
    });

    if (window.lucide) window.lucide.createIcons();
}
