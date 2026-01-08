// Contract Detail View
export function renderContractDetail(params) {
    const contractId = params?.id || '4421';
    return `
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen">
            <div class="flex items-center gap-2 mb-8 font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-12">
                <button onclick="window.router.navigate('/contracts')" class="hover:text-neutral-900 cursor-pointer transition-colors">Contracts</button>
                <i data-lucide="chevron-right" class="w-3 h-3"></i>
                <span class="text-neutral-900">${contractId}</span>
            </div>

            <div class="bg-white border border-neutral-200 shadow-sm max-w-3xl mx-auto w-full rounded-sm overflow-hidden">
                <div class="p-8 border-b border-neutral-200">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col gap-2">
                            <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Contract ID</span>
                            <h1 class="font-mono text-xl tracking-tight text-neutral-900">${contractId}-8A7B-21C4</h1>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                             <div class="inline-flex items-center px-2 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700">
                                <span class="font-mono text-[10px] font-medium uppercase tracking-widest">Settled</span>
                            </div>
                            <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">2023-10-27 14:32 UTC</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 border-b border-neutral-200">
                    <div class="p-8 border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col gap-6">
                        <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400">Parties Involved</h4>
                        <div class="space-y-4">
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Principal</span>
                                <span class="font-mono text-[11px] font-medium text-neutral-900">@alex_dev</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Verification Source</span>
                                <span class="font-mono text-[11px] font-medium text-neutral-900">GitHub API</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-8 flex flex-col gap-6 bg-neutral-50/20">
                        <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400">Capital Block</h4>
                        <div class="space-y-4">
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Total Locked</span>
                                <span class="font-mono text-lg font-medium text-neutral-900">$500.00</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Settlement Outcome</span>
                                <span class="font-mono text-[11px] font-medium text-emerald-700">Funds Returned to Principal</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-8 border-b border-neutral-200">
                    <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400 mb-4">Condition Terms</h4>
                    <div class="bg-neutral-50 border border-neutral-100 p-4 rounded-sm">
                        <p class="font-sans text-sm text-neutral-900 leading-relaxed">
                            The principal must merge a Pull Request into the <code class="bg-white border border-neutral-200 px-1 py-0.5 rounded text-[11px]">main</code> branch before the deadline.
                        </p>
                    </div>
                </div>

                <div class="p-8 bg-white">
                    <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400 mb-6">Event Log</h4>
                    <div class="relative pl-2 space-y-8 before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-px before:bg-neutral-200">
                        <div class="relative pl-6">
                            <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-neutral-300 border-2 border-white"></div>
                            <div class="flex justify-between items-baseline">
                                <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">Contract Created</span>
                                <span class="font-mono text-[10px] text-neutral-400">2023-10-25 09:00 UTC</span>
                            </div>
                        </div>
                        <div class="relative pl-6">
                            <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-neutral-300 border-2 border-white"></div>
                            <div class="flex justify-between items-baseline">
                                <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">Funds Locked ($500.00)</span>
                                <span class="font-mono text-[10px] text-neutral-400">2023-10-25 09:05 UTC</span>
                            </div>
                        </div>
                        <div class="relative pl-6">
                            <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white"></div>
                            <div class="flex justify-between items-baseline">
                                <span class="font-mono text-[11px] font-medium text-emerald-700 uppercase">Settled</span>
                                <span class="font-mono text-[10px] text-neutral-400">2023-10-27 14:32 UTC</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-neutral-50 border-t border-neutral-200 px-8 py-6">
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col gap-1">
                            <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Record Hash</span>
                            <span class="font-mono text-[10px] text-neutral-500">0x7f8a92b1c4d5e6f7a8b9c0d1e2f3a4b5</span>
                        </div>
                        <div class="flex items-center gap-2 text-neutral-400">
                            <i data-lucide="lock" class="w-3 h-3"></i>
                            <span class="font-mono text-[9px] uppercase tracking-widest">Immutable</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

export function initContractDetail() {
    if (window.lucide) window.lucide.createIcons();
}
