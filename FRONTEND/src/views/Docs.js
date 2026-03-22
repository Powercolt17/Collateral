// Docs.js — System Documentation — Enforcement Doctrine
// Clear. Direct. Institutional. Protective.

export function renderDocs() {
    return `
        <style>
            /* ============================================================
               DOCUMENTATION — PREMIUM ENFORCEMENT DOCTRINE
               ============================================================ */
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

            .doc {
                background: #FAFAFA;
                min-height: calc(100vh - 72px);
                font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #1A1A1A;
            }

            .doc-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 48px;
            }

            /* ── Hero Header ── */
            .doc-top {
                background: linear-gradient(135deg, #3B0001 0%, #7A1414 40%, #5E1010 100%);
                border-bottom: none;
                position: relative;
                overflow: hidden;
            }
            .doc-top::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -20%;
                width: 500px;
                height: 500px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%);
                pointer-events: none;
            }
            .doc-page-hdr {
                padding: 48px 0 40px;
                position: relative;
                z-index: 1;
            }
            .doc-page-title {
                font-size: 36px;
                font-weight: 900;
                letter-spacing: -1.5px;
                color: #FFFFFF;
                margin: 0;
                line-height: 1.1;
                background: linear-gradient(135deg, #FFFFFF 0%, #D4D4D4 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .doc-page-sub {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.7);
                margin: 12px 0 0;
                font-family: 'JetBrains Mono', monospace;
                font-weight: 500;
                letter-spacing: 2px;
                text-transform: uppercase;
            }

            /* ── Layout ── */
            .doc-layout {
                display: grid;
                grid-template-columns: 220px 1fr;
                gap: 56px;
                padding: 40px 0 80px;
            }

            /* ── Sidebar ── */
            .doc-sidebar {
                position: sticky;
                top: 88px;
                align-self: start;
                max-height: calc(100vh - 100px);
                overflow-y: auto;
            }
            .doc-sidebar::-webkit-scrollbar { width: 3px; }
            .doc-sidebar::-webkit-scrollbar-track { background: transparent; }
            .doc-sidebar::-webkit-scrollbar-thumb { background: #D4D4D4; border-radius: 3px; }

            .doc-nav-group {
                margin-bottom: 28px;
            }
            .doc-nav-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: #3B0001;
                margin: 0 0 10px;
                padding: 0;
            }
            .doc-nav-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .doc-nav-item {
                margin: 0;
            }
            .doc-nav-link {
                display: block;
                font-size: 13px;
                color: #777;
                text-decoration: none;
                padding: 6px 0 6px 14px;
                border-left: 2px solid #EBEBEB;
                transition: all 0.2s ease;
                line-height: 1.5;
                font-weight: 400;
            }
            .doc-nav-link:hover {
                color: #1A1A1A;
                border-left-color: rgba(59, 0, 1, 0.4);
                background: rgba(59, 0, 1, 0.03);
            }
            .doc-nav-link.active {
                color: #3B0001;
                font-weight: 600;
                border-left-color: #3B0001;
                background: rgba(59, 0, 1, 0.06);
            }

            /* ── Content ── */
            .doc-content {
                min-width: 0;
            }

            .doc-section {
                margin-bottom: 48px;
                padding-bottom: 48px;
                border-bottom: 1px solid #E8E8E8;
            }
            .doc-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .doc-section-title {
                font-size: 26px;
                font-weight: 800;
                color: #1A1A1A;
                margin: 0 0 20px;
                letter-spacing: -0.8px;
                line-height: 1.2;
                position: relative;
                padding-left: 18px;
            }
            .doc-section-title::before {
                content: '';
                position: absolute;
                left: 0;
                top: 4px;
                bottom: 4px;
                width: 4px;
                background: linear-gradient(180deg, #3B0001, #B52020);
                border-radius: 2px;
            }

            .doc-section-title-sm {
                font-size: 16px;
                font-weight: 700;
                color: #1A1A1A;
                margin: 24px 0 10px;
                letter-spacing: -0.3px;
            }

            .doc-p {
                font-size: 15px;
                color: #555;
                line-height: 1.8;
                margin: 0 0 16px;
            }
            .doc-p:last-child { margin-bottom: 0; }

            .doc-strong {
                color: #1A1A1A;
                font-weight: 700;
            }

            .doc-list {
                list-style: none;
                padding: 0;
                margin: 0 0 16px;
            }
            .doc-list li {
                font-size: 15px;
                color: #555;
                line-height: 1.9;
                padding-left: 22px;
                position: relative;
            }
            .doc-list li::before {
                content: '';
                position: absolute;
                left: 4px;
                top: 12px;
                width: 6px;
                height: 6px;
                background: #3B0001;
                border-radius: 50%;
            }

            /* ── Rule Blocks (Callouts) ── */
            .doc-rule-block {
                background: linear-gradient(135deg, rgba(59, 0, 1, 0.05) 0%, rgba(59, 0, 1, 0.02) 100%);
                border: 1px solid rgba(59, 0, 1, 0.15);
                border-left: 3px solid #3B0001;
                border-radius: 6px;
                padding: 16px 20px;
                margin: 18px 0;
            }
            .doc-rule-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                color: #3B0001;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                line-height: 1.7;
                font-weight: 500;
            }

            /* ── Steps ── */
            .doc-step {
                display: flex;
                gap: 18px;
                margin-bottom: 20px;
                padding: 16px 20px;
                background: #FFFFFF;
                border: 1px solid #E8E8E8;
                border-radius: 10px;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            }
            .doc-step:hover {
                border-color: rgba(59, 0, 1, 0.25);
                box-shadow: 0 4px 12px rgba(59, 0, 1, 0.08);
                transform: translateY(-1px);
            }
            .doc-step-num {
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #3B0001, #B52020);
                border: none;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                font-weight: 700;
                color: #FFFFFF;
                flex-shrink: 0;
                box-shadow: 0 2px 8px rgba(59, 0, 1, 0.3);
            }
            .doc-step-content {
                flex: 1;
                padding-top: 2px;
            }
            .doc-step-title {
                font-size: 15px;
                font-weight: 700;
                color: #1A1A1A;
                margin: 0 0 4px;
            }
            .doc-step-desc {
                font-size: 14px;
                color: #888;
                line-height: 1.6;
            }

            /* ── Tier Cards ── */
            .doc-tier {
                background: #FFFFFF;
                border: 1px solid #E8E8E8;
                border-radius: 10px;
                padding: 16px 20px;
                margin-bottom: 10px;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            }
            .doc-tier:hover {
                border-color: rgba(59, 0, 1, 0.3);
                box-shadow: 0 4px 12px rgba(59, 0, 1, 0.08);
            }
            .doc-tier-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #3B0001;
                margin: 0 0 6px;
            }
            .doc-tier-desc {
                font-size: 14px;
                color: #888;
                line-height: 1.6;
            }

            /* ── FAQ ── */
            .doc-faq {
                margin-bottom: 18px;
                padding: 16px 20px;
                background: #FFFFFF;
                border: 1px solid #E8E8E8;
                border-radius: 10px;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            }
            .doc-faq:hover {
                border-color: rgba(59, 0, 1, 0.25);
                box-shadow: 0 4px 12px rgba(59, 0, 1, 0.08);
            }
            .doc-faq-q {
                font-size: 15px;
                font-weight: 700;
                color: #1A1A1A;
                margin: 0 0 8px;
            }
            .doc-faq-a {
                font-size: 14px;
                color: #666;
                line-height: 1.7;
                padding-left: 16px;
                border-left: 2px solid #3B0001;
            }

            /* ── Footer Notice ── */
            .doc-divider-note {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 16px 20px;
                background: linear-gradient(135deg, rgba(59, 0, 1, 0.04) 0%, rgba(59, 0, 1, 0.01) 100%);
                border: 1px solid rgba(59, 0, 1, 0.15);
                border-radius: 10px;
                margin-top: 32px;
            }
            .doc-divider-note-icon {
                color: #3B0001;
                flex-shrink: 0;
            }
            .doc-divider-note-icon svg { width: 16px; height: 16px; }
            .doc-divider-note-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                color: #777;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                line-height: 1.7;
            }

            /* ── Section reveal animation ── */
            .doc-section[data-reveal] {
                opacity: 0;
                transform: translateY(16px);
                animation: docReveal 0.5s ease forwards;
            }
            .doc-section:nth-child(1) { animation-delay: 0.05s; }
            .doc-section:nth-child(2) { animation-delay: 0.1s; }
            .doc-section:nth-child(3) { animation-delay: 0.15s; }
            .doc-section:nth-child(4) { animation-delay: 0.2s; }
            .doc-section:nth-child(5) { animation-delay: 0.25s; }
            .doc-section:nth-child(6) { animation-delay: 0.3s; }
            .doc-section:nth-child(7) { animation-delay: 0.35s; }
            .doc-section:nth-child(8) { animation-delay: 0.4s; }
            .doc-section:nth-child(9) { animation-delay: 0.45s; }
            .doc-section:nth-child(10) { animation-delay: 0.5s; }
            .doc-section:nth-child(11) { animation-delay: 0.55s; }
            @keyframes docReveal {
                to { opacity: 1; transform: translateY(0); }
            }

            /* ── Responsive ── */
            @media (max-width: 900px) {
                .doc-container { padding: 0 20px; }
                .doc-layout {
                    grid-template-columns: 1fr;
                    gap: 0;
                }
                .doc-sidebar {
                    position: relative;
                    top: 0;
                    border-bottom: 1px solid #E8E8E8;
                    padding-bottom: 20px;
                    margin-bottom: 32px;
                    max-height: none;
                }
                .doc-page-title { font-size: 28px; }
                .doc-section-title { font-size: 22px; }
                .doc-page-hdr { padding: 32px 0 28px; }
            }
        </style>

        <div class="doc">
            <div class="doc-top">
                <div class="doc-page-hdr">
                    <div class="doc-container">
                        <h1 class="doc-page-title">SYSTEM DOCUMENTATION</h1>
                        <p class="doc-page-sub">Enforcement protocol. Capital custody. Settlement rules.</p>
                    </div>
                </div>
            </div>

            <div class="doc-container">
                <div class="doc-layout">
                    <!-- Sidebar -->
                    <nav class="doc-sidebar" id="doc-sidebar">
                        <div class="doc-nav-group">
                            <div class="doc-nav-label">System</div>
                            <ul class="doc-nav-list">
                                <li class="doc-nav-item"><a href="#overview" class="doc-nav-link active" data-section="overview">Overview</a></li>
                                <li class="doc-nav-item"><a href="#how-it-works" class="doc-nav-link" data-section="how-it-works">How It Works</a></li>
                            </ul>
                        </div>
                        <div class="doc-nav-group">
                            <div class="doc-nav-label">Capital</div>
                            <ul class="doc-nav-list">
                                <li class="doc-nav-item"><a href="#capital" class="doc-nav-link" data-section="capital">Capital & Forfeiture</a></li>
                                <li class="doc-nav-item"><a href="#economic-model" class="doc-nav-link" data-section="economic-model">Economic Model</a></li>
                                <li class="doc-nav-item"><a href="#risk" class="doc-nav-link" data-section="risk">Risk Disclosure</a></li>
                            </ul>
                        </div>
                        <div class="doc-nav-group">
                            <div class="doc-nav-label">Verification</div>
                            <ul class="doc-nav-list">
                                <li class="doc-nav-item"><a href="#verification" class="doc-nav-link" data-section="verification">Verification System</a></li>
                                <li class="doc-nav-item"><a href="#sources" class="doc-nav-link" data-section="sources">Source Requirements</a></li>
                                <li class="doc-nav-item"><a href="#anti-gaming" class="doc-nav-link" data-section="anti-gaming">Anti-Gaming Rules</a></li>
                            </ul>
                        </div>
                        <div class="doc-nav-group">
                            <div class="doc-nav-label">Settlement</div>
                            <ul class="doc-nav-list">
                                <li class="doc-nav-item"><a href="#settlement" class="doc-nav-link" data-section="settlement">Settlement Process</a></li>
                                <li class="doc-nav-item"><a href="#disputes" class="doc-nav-link" data-section="disputes">Dispute Policy</a></li>
                            </ul>
                        </div>
                        <div class="doc-nav-group">
                            <div class="doc-nav-label">Infrastructure</div>
                            <ul class="doc-nav-list">
                                <li class="doc-nav-item"><a href="#architecture" class="doc-nav-link" data-section="architecture">Technical Architecture</a></li>
                                <li class="doc-nav-item"><a href="#security" class="doc-nav-link" data-section="security">Security</a></li>
                                <li class="doc-nav-item"><a href="#api" class="doc-nav-link" data-section="api">API</a></li>
                            </ul>
                        </div>
                        <div class="doc-nav-group">
                            <div class="doc-nav-label">Reference</div>
                            <ul class="doc-nav-list">
                                <li class="doc-nav-item"><a href="#faq" class="doc-nav-link" data-section="faq">FAQ</a></li>
                            </ul>
                        </div>
                    </nav>

                    <!-- Content -->
                    <div class="doc-content">

                        <!-- OVERVIEW -->
                        <section class="doc-section" data-reveal id="overview">
                            <h2 class="doc-section-title">Overview</h2>
                            <p class="doc-p">Collateral is a capital-backed enforcement protocol.</p>
                            <p class="doc-p">Users voluntarily lock capital against measurable, externally verifiable outcomes. If the outcome is achieved within the defined contract window, capital is returned and payout is issued according to tier rules. If the outcome is not achieved, capital is forfeited.</p>
                            <p class="doc-p">All contracts are:</p>
                            <ul class="doc-list">
                                <li>Deterministic</li>
                                <li>Time-bounded</li>
                                <li>Immutable after execution</li>
                                <li>Settled via verified provider APIs</li>
                                <li>Append-only recorded</li>
                            </ul>
                            <div class="doc-rule-block">
                                <div class="doc-rule-text">No manual review. No discretionary settlement. No subjective interpretation.</div>
                            </div>
                        </section>

                        <!-- HOW IT WORKS -->
                        <section class="doc-section" data-reveal id="how-it-works">
                            <h2 class="doc-section-title">How It Works</h2>
                            <div class="doc-step">
                                <div class="doc-step-num">01</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-title">Connect a Verification Source</div>
                                    <div class="doc-step-desc">Bind a supported provider via official OAuth or API authentication.</div>
                                </div>
                            </div>
                            <div class="doc-step">
                                <div class="doc-step-num">02</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-title">Define Commitment</div>
                                    <div class="doc-step-desc">Select contract template, risk tier, target metric delta, and deadline.</div>
                                </div>
                            </div>
                            <div class="doc-step">
                                <div class="doc-step-num">03</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-title">Lock Capital</div>
                                    <div class="doc-step-desc">Funds are reserved and recorded on execution confirmation.</div>
                                </div>
                            </div>
                            <div class="doc-step">
                                <div class="doc-step-num">04</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-title">Baseline Snapshot</div>
                                    <div class="doc-step-desc">The system captures immutable baseline metrics at execution time.</div>
                                </div>
                            </div>
                            <div class="doc-step">
                                <div class="doc-step-num">05</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-title">Monitoring Window</div>
                                    <div class="doc-step-desc">Metrics are observed within the defined duration.</div>
                                </div>
                            </div>
                            <div class="doc-step">
                                <div class="doc-step-num">06</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-title">Automatic Settlement</div>
                                    <div class="doc-step-desc">At deadline, outcome is verified and settlement is executed automatically.</div>
                                </div>
                            </div>
                        </section>

                        <!-- CAPITAL & FORFEITURE -->
                        <section class="doc-section" data-reveal id="capital">
                            <h2 class="doc-section-title">Capital & Forfeiture</h2>
                            <p class="doc-p">Capital is locked upon execution confirmation.</p>
                            <p class="doc-p">Capital is:</p>
                            <ul class="doc-list">
                                <li>Held for the full contract duration</li>
                                <li>Non-withdrawable until settlement</li>
                                <li>Not partially refundable</li>
                            </ul>
                            <p class="doc-p"><span class="doc-strong">If performance conditions are met:</span> Capital is returned plus payout.</p>
                            <p class="doc-p"><span class="doc-strong">If performance conditions are not met:</span> Capital is forfeited.</p>
                            <p class="doc-p">Forfeited capital contributes to the payout pool structure defined by tier.</p>
                            <div class="doc-rule-block">
                                <div class="doc-rule-text">There are no discretionary refunds.</div>
                            </div>
                        </section>

                        <!-- ECONOMIC MODEL -->
                        <section class="doc-section" data-reveal id="economic-model">
                            <h2 class="doc-section-title">Economic Model</h2>
                            <p class="doc-p">Collateral uses tiered payout design.</p>
                            <div class="doc-tier">
                                <div class="doc-tier-name">Tier 1</div>
                                <div class="doc-tier-desc">Higher probability of success. Lower payout multiple.</div>
                            </div>
                            <div class="doc-tier">
                                <div class="doc-tier-name">Tier 2</div>
                                <div class="doc-tier-desc">Moderate probability. Higher payout multiple.</div>
                            </div>
                            <div class="doc-tier">
                                <div class="doc-tier-name">Tier 3</div>
                                <div class="doc-tier-desc">Low probability. High payout multiple.</div>
                            </div>
                            <p class="doc-p" style="margin-top: 12px;">Payouts are structured to maintain overall system sustainability. Users select tier after baseline normalization. Expected value varies by difficulty.</p>
                            <div class="doc-rule-block">
                                <div class="doc-rule-text">Collateral does not guarantee profit.</div>
                            </div>
                        </section>

                        <!-- RISK DISCLOSURE -->
                        <section class="doc-section" data-reveal id="risk">
                            <h2 class="doc-section-title">Risk Disclosure</h2>
                            <p class="doc-p">Participation involves financial risk.</p>
                            <p class="doc-p"><span class="doc-strong">Users may lose 100% of locked capital.</span></p>
                            <p class="doc-p">Performance outcomes depend on external systems, market conditions, and user behavior.</p>
                            <p class="doc-p">Collateral does not provide financial advice.</p>
                            <p class="doc-p">All contracts are voluntary.</p>
                            <div class="doc-rule-block">
                                <div class="doc-rule-text">Users are responsible for understanding contract terms prior to execution.</div>
                            </div>
                        </section>

                        <!-- VERIFICATION SYSTEM -->
                        <section class="doc-section" data-reveal id="verification">
                            <h2 class="doc-section-title">Verification System</h2>
                            <p class="doc-p">Collateral verifies performance exclusively via official provider APIs.</p>
                            <p class="doc-p"><span class="doc-strong">No manual data input is accepted.</span></p>
                            <ul class="doc-list">
                                <li>No screenshots</li>
                                <li>No self-reported metrics</li>
                                <li>No CSV uploads</li>
                                <li>No subjective review</li>
                            </ul>
                            <p class="doc-p">Baseline snapshot and settlement verification are provider-derived only.</p>
                            <p class="doc-p">If provider APIs fail or return ambiguous data, contracts fail closed unless deterministic verification succeeds before window end.</p>
                        </section>

                        <!-- SOURCE REQUIREMENTS -->
                        <section class="doc-section" data-reveal id="sources">
                            <h2 class="doc-section-title">Source Requirements</h2>
                            <p class="doc-p">Supported providers:</p>
                            <ul class="doc-list">
                                <li>X (Twitter)</li>
                                <li>Stripe</li>
                                <li>Shopify</li>
                                <li>Amazon Seller</li>
                                <li>YouTube</li>
                            </ul>
                            <p class="doc-p">More providers may be added.</p>
                            <p class="doc-p">All providers must:</p>
                            <ul class="doc-list">
                                <li>Support official API access</li>
                                <li>Allow deterministic metric retrieval</li>
                                <li>Meet verification reliability thresholds</li>
                            </ul>
                            <p class="doc-p">Public-only connections may have limited eligibility. OAuth identity binding may be required.</p>
                        </section>

                        <!-- ANTI-GAMING RULES -->
                        <section class="doc-section" data-reveal id="anti-gaming">
                            <h2 class="doc-section-title">Anti-Gaming Rules</h2>
                            <p class="doc-p">Collateral enforces strict anti-manipulation safeguards.</p>
                            <p class="doc-p">These include but are not limited to:</p>
                            <ul class="doc-list">
                                <li>Immutable baseline snapshots</li>
                                <li>Time compression prevention</li>
                                <li>Minimum difficulty floors</li>
                                <li>Anti-sybil caps</li>
                                <li>Connected account verification required for payouts</li>
                                <li>Objective event filtering</li>
                                <li>Exclusion of cancelled or refunded transactions</li>
                                <li>Exclusion of suspicious metric spikes</li>
                                <li>No self-minting behavior</li>
                                <li>Idempotent settlement logic</li>
                                <li>Single-writer job locks</li>
                                <li>Fail-closed verification policy</li>
                            </ul>
                            <p class="doc-p">Contracts attempting to exploit provider mechanics, artificial engagement, self-transactions, bot amplification, or metric inflation may fail settlement automatically.</p>
                            <div class="doc-rule-block">
                                <div class="doc-rule-text">All verification logic is deterministic.</div>
                            </div>
                        </section>

                        <!-- SETTLEMENT PROCESS -->
                        <section class="doc-section" data-reveal id="settlement">
                            <h2 class="doc-section-title">Settlement Process</h2>
                            <p class="doc-p">At deadline:</p>
                            <div class="doc-step">
                                <div class="doc-step-num">01</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-desc">Provider metrics are fetched.</div>
                                </div>
                            </div>
                            <div class="doc-step">
                                <div class="doc-step-num">02</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-desc">Baseline delta is computed.</div>
                                </div>
                            </div>
                            <div class="doc-step">
                                <div class="doc-step-num">03</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-desc">Tier conditions are evaluated.</div>
                                </div>
                            </div>
                            <div class="doc-step">
                                <div class="doc-step-num">04</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-desc">Settlement result is generated.</div>
                                </div>
                            </div>
                            <div class="doc-step">
                                <div class="doc-step-num">05</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-desc">Ledger event is recorded.</div>
                                </div>
                            </div>
                            <div class="doc-step">
                                <div class="doc-step-num">06</div>
                                <div class="doc-step-content">
                                    <div class="doc-step-desc">Capital is returned or forfeited.</div>
                                </div>
                            </div>
                            <div class="doc-rule-block" style="margin-top: 8px;">
                                <div class="doc-rule-text">Settlement is final. All ledger events are append-only. No edits. No retroactive changes.</div>
                            </div>
                        </section>

                        <!-- DISPUTE POLICY -->
                        <section class="doc-section" data-reveal id="disputes">
                            <h2 class="doc-section-title">Dispute Policy</h2>
                            <p class="doc-p">Collateral contracts are deterministic.</p>
                            <p class="doc-p"><span class="doc-strong">There is no discretionary appeal system.</span></p>
                            <p class="doc-p">If provider data confirms failure, contract fails. If provider data confirms success, contract succeeds.</p>
                            <h3 class="doc-section-title-sm">Provider Outage</h3>
                            <p class="doc-p">In rare cases of provider outage, verification retries occur within the defined window. If verification remains indeterminate, contract fails closed.</p>
                        </section>

                        <!-- TECHNICAL ARCHITECTURE -->
                        <section class="doc-section" data-reveal id="architecture">
                            <h2 class="doc-section-title">Technical Architecture</h2>
                            <ul class="doc-list">
                                <li>Append-only ledger model</li>
                                <li>Immutable contract terms</li>
                                <li>Baseline snapshot references</li>
                                <li>Deterministic verification adapters</li>
                                <li>Idempotent settlement workers</li>
                                <li>Rate-limit aware provider fetch</li>
                                <li>Retry with exponential backoff</li>
                                <li>Fail-closed logic</li>
                            </ul>
                            <p class="doc-p">Collateral does not alter provider data. Collateral reads provider data.</p>
                        </section>

                        <!-- SECURITY -->
                        <section class="doc-section" data-reveal id="security">
                            <h2 class="doc-section-title">Security</h2>
                            <ul class="doc-list">
                                <li>OAuth authentication</li>
                                <li>Encrypted credential storage</li>
                                <li>No plaintext API keys</li>
                                <li>No provider tokens exposed to frontend</li>
                                <li>Role-based execution permissions</li>
                                <li>No direct client-side settlement</li>
                            </ul>
                            <div class="doc-rule-block">
                                <div class="doc-rule-text">All sensitive operations are server-side.</div>
                            </div>
                        </section>

                        <!-- API -->
                        <section class="doc-section" data-reveal id="api">
                            <h2 class="doc-section-title">API</h2>
                            <p class="doc-p">Collateral exposes authenticated REST endpoints for contract execution, source connection, ledger access, and settlement queries.</p>
                            <p class="doc-p">All endpoints require bearer token authentication. Rate limits apply. Settlement endpoints are server-side only and are not exposed to client applications.</p>
                            <p class="doc-p">For integration inquiries, contact the development team.</p>
                        </section>

                        <!-- FAQ -->
                        <section class="doc-section" data-reveal id="faq">
                            <h2 class="doc-section-title">FAQ</h2>
                            <div class="doc-faq">
                                <div class="doc-faq-q">Can I withdraw capital early?</div>
                                <div class="doc-faq-a">No. Capital remains locked until settlement.</div>
                            </div>
                            <div class="doc-faq">
                                <div class="doc-faq-q">Can I dispute settlement?</div>
                                <div class="doc-faq-a">No. Settlement is deterministic and final.</div>
                            </div>
                            <div class="doc-faq">
                                <div class="doc-faq-q">Can I manually adjust my metrics?</div>
                                <div class="doc-faq-a">No. Only provider APIs are used.</div>
                            </div>
                            <div class="doc-faq">
                                <div class="doc-faq-q">What happens if provider API fails?</div>
                                <div class="doc-faq-a">The system retries. If still unverifiable, contract fails closed.</div>
                            </div>
                        </section>

                        <!-- Footer Notice -->
                        <div class="doc-divider-note">
                            <div class="doc-divider-note-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
                            </div>
                            <span class="doc-divider-note-text">This documentation constitutes system disclosure. All rules are enforced programmatically.</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initDocs() {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Sidebar scroll-spy
    const sidebar = document.getElementById('doc-sidebar');
    if (!sidebar) return;

    const links = sidebar.querySelectorAll('.doc-nav-link');
    const sections = [];

    links.forEach(link => {
        const sectionId = link.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) sections.push({ link, section });
    });

    // Click handler — smooth scroll + active state
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            const target = document.getElementById(sectionId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Scroll spy
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('data-section') === id);
                });
            }
        });
    }, {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
    });

    sections.forEach(({ section }) => observer.observe(section));
}
