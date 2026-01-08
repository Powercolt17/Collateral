// Funding & Payouts View
export function renderFunding() {
    return `
        <div class="pb-32 w-full max-w-3xl mx-auto px-6 relative z-10 min-h-screen">
            <!-- Page Header -->
            <div class="mt-12 mb-10">
                <h1 class="font-display font-bold text-2xl tracking-tight text-[#0E0E11] uppercase mb-2">Funding & Payouts</h1>
                <p class="font-sans text-sm text-neutral-500">Manage payment methods and view your balance.</p>
                <div class="h-px w-full bg-neutral-200 mt-6"></div>
            </div>

            <!-- Funding Methods Section -->
            <section class="mb-10">
                <h2 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">Funding Methods</h2>
                
                <div class="border border-neutral-200 bg-white">
                    <!-- Card Row -->
                    <div id="funding-card-row" class="p-5 flex items-center justify-between border-b border-neutral-100">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-8 bg-gradient-to-r from-[#635BFF] to-[#8B85FF] rounded flex items-center justify-center">
                                <span class="text-white font-bold text-[10px]">VISA</span>
                            </div>
                            <div>
                                <h4 class="font-sans text-sm font-medium text-neutral-900">Credit / Debit Card (Stripe)</h4>
                                <p class="font-mono text-[11px] text-neutral-400" id="card-status">No card on file</p>
                            </div>
                        </div>
                        <button onclick="window.app.addCard()" id="add-card-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                            Add Card
                        </button>
                    </div>
                    
                    <!-- Info -->
                    <div class="p-4 bg-neutral-50">
                        <p class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Secure payments processed by Stripe</p>
                    </div>
                </div>
            </section>

            <!-- Balance State Section -->
            <section class="mb-10">
                <h2 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">Balance State</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200">
                    <div class="bg-white p-5">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Available Balance</span>
                        <span class="font-display text-2xl font-medium text-neutral-900" id="available-balance">$0.00</span>
                    </div>
                    <div class="bg-white p-5">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Locked in Contracts</span>
                        <span class="font-display text-2xl font-medium text-[#A18239]" id="locked-balance">$0.00</span>
                    </div>
                    <div class="bg-white p-5">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Pending Payout</span>
                        <span class="font-display text-2xl font-medium text-[#1F7A4D]" id="pending-payout">$0.00</span>
                    </div>
                </div>
            </section>

            <!-- Payout Method Section -->
            <section class="mb-10">
                <h2 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">Payout Method</h2>
                
                <div class="border border-neutral-200 bg-white">
                    <div class="p-5 flex items-center justify-between border-b border-neutral-100">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center">
                                <i data-lucide="building-2" class="w-5 h-5 text-neutral-500"></i>
                            </div>
                            <div>
                                <h4 class="font-sans text-sm font-medium text-neutral-900">Default Payout Destination</h4>
                                <p class="font-mono text-[11px] text-neutral-400" id="payout-status">No payout method configured</p>
                            </div>
                        </div>
                        <button onclick="window.app.setupPayout()" id="setup-payout-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                            Setup
                        </button>
                    </div>
                    
                    <div class="p-4 bg-neutral-50">
                        <p class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Bank transfers via Stripe Connect (coming soon)</p>
                    </div>
                </div>
            </section>

            <!-- Important Notice -->
            <div class="bg-neutral-50 border border-neutral-200 p-5">
                <p class="font-mono text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed">
                    <span class="text-neutral-900 font-medium">Important:</span> Funding methods are used only to lock and release capital. 
                    Verification sources are managed separately in your profile.
                </p>
            </div>
        </div>
    `;
}

export function initFunding() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
