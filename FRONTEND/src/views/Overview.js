// Overview View - Premium Institutional with Edge
// Conversion-focused, makes people WANT to create contracts

export function renderOverview() {
    return `
        <style>
            /* === PREMIUM INSTITUTIONAL === */
            .collateral-home {
                background: linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 40%);
                color: #1A1A1A;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* Hero gradient accent */
            .hero-accent {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 800px;
                height: 400px;
                background: radial-gradient(ellipse at center, rgba(139, 24, 24, 0.06) 0%, transparent 70%);
                pointer-events: none;
            }

            /* Premium card */
            .premium-card {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
                transition: all 0.2s ease;
            }
            .premium-card:hover {
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
                border-color: #D0D0D0;
            }

            /* Stats */
            .stat-value {
                font-size: 32px;
                font-weight: 700;
                color: #1A1A1A;
                letter-spacing: -0.02em;
                line-height: 1;
            }
            .stat-label {
                font-size: 13px;
                color: #6B6B6B;
                margin-top: 6px;
            }

            /* Primary CTA */
            .cta-primary {
                background: linear-gradient(180deg, #9B2020 0%, #7A1818 100%);
                color: #FFFFFF;
                padding: 16px 32px;
                font-size: 14px;
                font-weight: 600;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.15s ease;
                box-shadow: 0 2px 8px rgba(139, 24, 24, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
            .cta-primary:hover {
                background: linear-gradient(180deg, #8B1818 0%, #6B1212 100%);
                box-shadow: 0 4px 16px rgba(139, 24, 24, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                transform: translateY(-1px);
            }

            /* Secondary CTA */
            .cta-secondary {
                background: #FFFFFF;
                color: #1A1A1A;
                padding: 16px 32px;
                font-size: 14px;
                font-weight: 600;
                border: 1px solid #E5E5E5;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            .cta-secondary:hover {
                background: #F5F5F5;
                border-color: #D0D0D0;
            }

            /* Process step */
            .process-step {
                position: relative;
                padding-left: 48px;
            }
            .process-step::before {
                content: attr(data-step);
                position: absolute;
                left: 0;
                top: 0;
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
                color: #FFFFFF;
                font-size: 13px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
            }

            /* Ledger row */
            .ledger-row {
                display: grid;
                grid-template-columns: 100px 1fr 120px 100px;
                padding: 16px 0;
                border-bottom: 1px solid #F0F0F0;
                font-size: 14px;
                align-items: center;
            }
            .ledger-row:last-child { border-bottom: none; }
            .ledger-id { 
                font-family: 'JetBrains Mono', monospace; 
                font-size: 13px;
                color: #6B6B6B;
            }
            .ledger-user { color: #1A1A1A; font-weight: 500; }
            .ledger-amount { 
                font-weight: 600; 
                color: #1A1A1A;
                text-align: right;
            }
            .ledger-status { 
                text-align: right;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .status-active { color: #0066CC; }
            .status-settled { color: #1A7F37; }
            .status-forfeited { color: #8B1818; }

            /* Badge */
            .badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: #F5F5F5;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                color: #6B6B6B;
            }
            .badge-dot {
                width: 6px;
                height: 6px;
                background: #1A7F37;
                border-radius: 50%;
            }

            /* Integrations grid */
            .integration-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px 24px;
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 8px;
                color: #9CA3AF;
                transition: all 0.2s ease;
            }
            .integration-logo:hover {
                border-color: #D0D0D0;
                color: #6B6B6B;
            }

            /* Animations */
            @keyframes fadeUp {
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .fade-up {
                animation: fadeUp 0.5s ease forwards;
            }
            .fade-up-delay-1 { animation-delay: 0.1s; opacity: 0; }
            .fade-up-delay-2 { animation-delay: 0.2s; opacity: 0; }
            .fade-up-delay-3 { animation-delay: 0.3s; opacity: 0; }

            @media (max-width: 768px) {
                .ledger-row { grid-template-columns: 80px 1fr 100px; }
                .ledger-user { display: none; }
                .stat-value { font-size: 24px; }
            }
        </style>

        <div class="collateral-home">
            
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- HERO -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="relative pt-20 pb-24 md:pt-28 md:pb-32">
                <div class="hero-accent"></div>
                <div class="max-w-5xl mx-auto px-6 md:px-8 relative">
                    
                    <!-- Badge -->
                    <div class="fade-up mb-8">
                        <span class="badge">
                            <span class="badge-dot"></span>
                            $847,000 locked this month
                        </span>
                    </div>

                    <!-- Headline -->
                    <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-[#1A1A1A] mb-6 fade-up fade-up-delay-1" 
                        style="line-height: 1.1;">
                        Put Money<br/>
                        <span style="background: linear-gradient(135deg, #8B1818 0%, #6B1212 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Behind Your Goals</span>
                    </h1>

                    <!-- Subhead -->
                    <p class="text-lg md:text-xl text-[#6B6B6B] max-w-2xl mb-10 fade-up fade-up-delay-2" style="line-height: 1.6;">
                        Lock capital against measurable outcomes. Hit your target, get it back. 
                        Miss it, forfeit. No excuses, no appeals — just results.
                    </p>

                    <!-- CTAs -->
                    <div class="flex flex-col sm:flex-row gap-4 mb-16 fade-up fade-up-delay-3">
                        <button onclick="window.app.handleInitiate()" class="cta-primary">
                            Create Contract
                        </button>
                        <button onclick="window.router.navigate('/docs')" class="cta-secondary">
                            How It Works
                        </button>
                    </div>

                    <!-- Stats -->
                    <div class="grid grid-cols-3 gap-8 md:gap-16 pt-8 border-t border-[#E5E5E5] fade-up fade-up-delay-3">
                        <div>
                            <div class="stat-value">2,847</div>
                            <div class="stat-label">Contracts Executed</div>
                        </div>
                        <div>
                            <div class="stat-value">$2.4M</div>
                            <div class="stat-label">Capital Locked</div>
                        </div>
                        <div>
                            <div class="stat-value">73%</div>
                            <div class="stat-label">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- HOW IT WORKS -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-20 md:py-28 bg-[#FAFAFA]">
                <div class="max-w-5xl mx-auto px-6 md:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
                            Three steps. Zero ambiguity.
                        </h2>
                        <p class="text-[#6B6B6B] max-w-xl mx-auto">
                            Connect your data. Lock your stake. Let the numbers decide.
                        </p>
                    </div>

                    <div class="grid md:grid-cols-3 gap-8 md:gap-12">
                        <!-- Step 1 -->
                        <div class="process-step" data-step="1">
                            <h3 class="font-semibold text-[#1A1A1A] mb-2">Set Your Baseline</h3>
                            <p class="text-[#6B6B6B] text-sm leading-relaxed">
                                Connect Stripe, Shopify, or X. We capture your current numbers as your starting point.
                            </p>
                        </div>

                        <!-- Step 2 -->
                        <div class="process-step" data-step="2">
                            <h3 class="font-semibold text-[#1A1A1A] mb-2">Lock Capital</h3>
                            <p class="text-[#6B6B6B] text-sm leading-relaxed">
                                Choose your target and stake. $100 to $50,000. Money is held until your deadline.
                            </p>
                        </div>

                        <!-- Step 3 -->
                        <div class="process-step" data-step="3">
                            <h3 class="font-semibold text-[#1A1A1A] mb-2">Automatic Settlement</h3>
                            <p class="text-[#6B6B6B] text-sm leading-relaxed">
                                Hit the target? Stake returned. Miss it? Forfeited. No manual review, no appeals.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- LIVE LEDGER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-20 md:py-28">
                <div class="max-w-5xl mx-auto px-6 md:px-8">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h2 class="text-2xl font-bold text-[#1A1A1A] mb-1">Live Contracts</h2>
                            <p class="text-[#6B6B6B] text-sm">Real commitments, real stakes</p>
                        </div>
                        <a href="#" onclick="window.router.navigate('/ledger'); return false;" 
                           class="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                            View All →
                        </a>
                    </div>

                    <div class="premium-card rounded-lg overflow-hidden">
                        <div class="px-6 py-4 border-b border-[#F0F0F0] bg-[#FAFAFA]">
                            <div class="ledger-row" style="border: none; padding: 0; font-size: 11px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px;">
                                <div>ID</div>
                                <div>User</div>
                                <div class="text-right">Stake</div>
                                <div class="text-right">Status</div>
                            </div>
                        </div>
                        <div class="px-6">
                            <div class="ledger-row">
                                <div class="ledger-id">#CTR-0847</div>
                                <div class="ledger-user">@marcuswilliams</div>
                                <div class="ledger-amount">$2,500</div>
                                <div class="ledger-status status-active">ACTIVE</div>
                            </div>
                            <div class="ledger-row">
                                <div class="ledger-id">#CTR-0846</div>
                                <div class="ledger-user">@sarahchen</div>
                                <div class="ledger-amount">$1,000</div>
                                <div class="ledger-status status-active">ACTIVE</div>
                            </div>
                            <div class="ledger-row">
                                <div class="ledger-id">#CTR-0845</div>
                                <div class="ledger-user">@jasonkim</div>
                                <div class="ledger-amount">$5,000</div>
                                <div class="ledger-status status-settled">SETTLED</div>
                            </div>
                            <div class="ledger-row">
                                <div class="ledger-id">#CTR-0844</div>
                                <div class="ledger-user">@emilydavis</div>
                                <div class="ledger-amount">$500</div>
                                <div class="ledger-status status-forfeited">FORFEITED</div>
                            </div>
                            <div class="ledger-row">
                                <div class="ledger-id">#CTR-0843</div>
                                <div class="ledger-user">@alexturner</div>
                                <div class="ledger-amount">$10,000</div>
                                <div class="ledger-status status-settled">SETTLED</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- INTEGRATIONS -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-20 md:py-28 bg-[#FAFAFA]">
                <div class="max-w-5xl mx-auto px-6 md:px-8">
                    <div class="text-center mb-12">
                        <h2 class="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
                            Verified by the source
                        </h2>
                        <p class="text-[#6B6B6B] max-w-xl mx-auto">
                            We pull directly from your platforms. No screenshots, no honor system.
                        </p>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="integration-logo">
                            <svg width="80" height="24" viewBox="0 0 80 24" fill="currentColor">
                                <text x="0" y="18" font-size="16" font-weight="600">Stripe</text>
                            </svg>
                        </div>
                        <div class="integration-logo">
                            <svg width="80" height="24" viewBox="0 0 80 24" fill="currentColor">
                                <text x="0" y="18" font-size="16" font-weight="600">Shopify</text>
                            </svg>
                        </div>
                        <div class="integration-logo">
                            <svg width="80" height="24" viewBox="0 0 80 24" fill="currentColor">
                                <text x="0" y="18" font-size="16" font-weight="600">X</text>
                            </svg>
                        </div>
                        <div class="integration-logo">
                            <svg width="80" height="24" viewBox="0 0 80 24" fill="currentColor">
                                <text x="0" y="18" font-size="16" font-weight="600">GitHub</text>
                            </svg>
                        </div>
                    </div>

                    <p class="text-center text-sm text-[#9CA3AF] mt-8">
                        More integrations coming: Plaid, YouTube, Instagram, Linear
                    </p>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- FINAL CTA -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <section class="py-24 md:py-32">
                <div class="max-w-3xl mx-auto px-6 md:px-8 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6" style="line-height: 1.2;">
                        Ready to back yourself?
                    </h2>
                    <p class="text-lg text-[#6B6B6B] mb-10 max-w-xl mx-auto">
                        Create your first contract in under 2 minutes. 
                        Connect, commit, execute.
                    </p>
                    <button onclick="window.app.handleInitiate()" class="cta-primary">
                        Create Your Contract
                    </button>
                    <p class="text-sm text-[#9CA3AF] mt-6">
                        Minimum stake: $100. Maximum: $50,000.
                    </p>
                </div>
            </section>


            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!-- FOOTER -->
            <!-- ═══════════════════════════════════════════════════════════════ -->
            <footer class="border-t border-[#E5E5E5] py-12">
                <div class="max-w-5xl mx-auto px-6 md:px-8">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div class="font-semibold text-[#1A1A1A] mb-1">Collateral</div>
                            <div class="text-sm text-[#6B6B6B]">Capital-backed commitment protocol</div>
                        </div>
                        <div class="flex gap-8 text-sm text-[#6B6B6B]">
                            <a href="#" onclick="window.router.navigate('/docs'); return false;" class="hover:text-[#1A1A1A] transition-colors">Documentation</a>
                            <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="hover:text-[#1A1A1A] transition-colors">Ledger</a>
                            <a href="#" class="hover:text-[#1A1A1A] transition-colors">Terms</a>
                            <a href="#" class="hover:text-[#1A1A1A] transition-colors">Privacy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    `;
}


export function initOverview() {
    console.log('[Overview] Premium homepage initialized');

    // Initialize Lucide icons if present
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
