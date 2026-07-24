// Landing Page — Redesigned Financial Instrument Document Homepage
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

// Inject LandingCSS once into document head
if (!document.getElementById('lp-injected-styles')) {
    const style = document.createElement('style');
    style.id = 'lp-injected-styles';
    style.textContent = landingCSS;
    document.head.appendChild(style);
}

export function renderLanding() {
    return `
        <div class="lp">

            <!-- ══════════════════ NAV ══════════════════ -->
            <header class="nav">
                <div class="nav-in">
                    <a class="wordmark" href="/" onclick="window.router.navigate('/'); return false;">Collateral</a>
                    <nav class="nav-links" aria-label="Primary">
                        <a href="#modes">Contracts</a>
                        <a href="#record">Record</a>
                        <a href="#flow">Escrow</a>
                        <a href="#terms">Terms</a>
                        <a href="#tape">Live</a>
                    </nav>
                    <div class="nav-right">
                        <span class="nav-escrow"><span class="dot"></span>$12,400 in escrow</span>
                        <a class="btn btn-out nav-btn" href="/signin" id="lp-nav-signin" onclick="window.router.navigate('/signin'); return false;">Sign in</a>
                    </div>
                </div>
            </header>

            <!-- 
                ============================================================
                SECTION 1 · HERO: THE CERTIFICATE
                Document Type: Cover Plate of an Issued Financial Instrument
                Invariant Kit: Paper (plate on #F8F6F1), Hairline Rules, 
                Mono Caps Clerical Voice, Oxblood Accent & Tabular Numerals, 
                Guilloche Engraving Pattern.
                ============================================================
            -->
            <section class="hero">
                <div class="shell">
                    <div class="plate">

                        <!-- GUILLOCHE BACKGROUND ENGRAVING -->
                        <svg class="guilloche" aria-hidden="true" preserveAspectRatio="none">
                            <defs>
                                <pattern id="gl" width="112" height="112" patternUnits="userSpaceOnUse">
                                    <g fill="none" stroke="#7B1E2B" stroke-width=".4" opacity=".2">
                                        <ellipse cx="56" cy="56" rx="52" ry="17"/>
                                        <ellipse cx="56" cy="56" rx="52" ry="17" transform="rotate(30 56 56)"/>
                                        <ellipse cx="56" cy="56" rx="52" ry="17" transform="rotate(60 56 56)"/>
                                        <ellipse cx="56" cy="56" rx="52" ry="17" transform="rotate(90 56 56)"/>
                                        <ellipse cx="56" cy="56" rx="52" ry="17" transform="rotate(120 56 56)"/>
                                        <ellipse cx="56" cy="56" rx="52" ry="17" transform="rotate(150 56 56)"/>
                                    </g>
                                </pattern>
                                <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
                                    <stop offset="34%" stop-color="#fff" stop-opacity="0"/>
                                    <stop offset="66%" stop-color="#fff" stop-opacity="0"/>
                                    <stop offset="100%" stop-color="#fff" stop-opacity="1"/>
                                </linearGradient>
                                <mask id="edge"><rect width="100%" height="100%" fill="url(#fade)"/></mask>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#gl)" mask="url(#edge)"/>
                        </svg>

                        <div class="cert-head">
                            <span class="mono">Escrow instrument &middot; Series&nbsp;A</span>
                            <span class="mono">No.&nbsp;C&ndash;0001</span>
                            <span class="mono">Custodian &middot; Stripe Connect</span>
                        </div>

                        <div class="cert-body">
                            <p class="cert-kicker">Binding on execution</p>
                            <h1 class="cert-title">Put your money<br>behind your <span class="em">word</span></h1>

                            <div class="ornament" aria-hidden="true">
                                <span></span>
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#7B1E2B" stroke-width="1">
                                    <circle cx="15" cy="15" r="10.5"/>
                                    <circle cx="15" cy="15" r="6"/>
                                    <path d="M15 1.5v27M1.5 15h27M5.4 5.4l19.2 19.2M24.6 5.4L5.4 24.6" opacity=".4"/>
                                </svg>
                                <span></span>
                            </div>

                            <p class="cert-copy">Every day people risk money on outcomes they don't control &mdash;
                                sports teams, markets, ad algorithms. Collateral lets you lock capital on the one
                                asset you do control: your own focus and execution.</p>

                            <div class="cert-actions">
                                <a class="btn btn-fill" href="/signin" id="lp-cert-cta-open" onclick="window.router.navigate('/signin'); return false;">Open a contract</a>
                                <a class="btn btn-out" href="#tape">See live contracts</a>
                            </div>
                        </div>

                        <div class="cert-foot">
                            <div class="foot-cell">
                                <span class="mono">Held in escrow</span>
                                <span class="foot-val blood">$8,700,000</span>
                            </div>
                            <div class="foot-cell">
                                <span class="mono">Returned to creators</span>
                                <span class="foot-val win">$8,326,200</span>
                            </div>
                            <div class="foot-cell">
                                <span class="mono">Oracle hit rate</span>
                                <span class="foot-val">96.2%</span>
                            </div>
                            <div class="foot-cell">
                                <span class="mono">Open contracts</span>
                                <span class="foot-val">31</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <!-- 
                ============================================================
                SECTION 2 · DIPTYCH: SOLO OR RIVALRY
                Document Type: Printed Spread Diptych with Vertical Rule Separator
                Invariant Kit: Hairline Rules, Dual Engraved Plates (Hand-and-Coin 
                & Two-Hands Pressing Coin), Mono Caps Labels, Oxblood Dark Leaf.
                ============================================================
            -->
            <section class="section" id="modes">
                <div class="shell">
                    <p class="eyebrow">Execution modes</p>
                    <h2 class="title">Two ways to make a promise cost something</h2>
                    <p class="lede">Lock money behind a goal. Hit it and take back your principal plus yield.
                        Miss it and the deposit funds somebody who didn't.</p>

                    <div class="diptych">
                        <article class="leaf">
                            <div class="leaf-art">
                                <svg viewBox="0 0 400 190" role="img" aria-label="Engraving: a hand pressing a coin into still water">
                                    <g fill="none" stroke="#131A2B" stroke-width=".7" stroke-linecap="round">
                                        <ellipse cx="200" cy="150" rx="122" ry="17" opacity=".3"/>
                                        <ellipse cx="200" cy="150" rx="94" ry="13" opacity=".45"/>
                                        <ellipse cx="200" cy="150" rx="66" ry="9" opacity=".6"/>
                                        <ellipse cx="200" cy="150" rx="38" ry="5.5" opacity=".8"/>
                                        <circle cx="200" cy="132" r="17"/>
                                        <circle cx="200" cy="132" r="12" opacity=".55"/>
                                        <path d="M193 132h14M200 125v14" opacity=".55"/>
                                        <path d="M186 96c0-15 5-27 12-30 6-2 9 3 8 11l-3 21"/>
                                        <path d="M203 98l4-24c1-8 5-11 10-9 5 2 6 8 5 15l-4 20"/>
                                        <path d="M218 100l5-19c2-7 6-9 10-7 4 3 4 8 3 14l-4 15"/>
                                        <path d="M232 105l4-13c2-6 6-7 9-5 3 3 3 7 2 11l-3 10"/>
                                        <path d="M186 96c-9 4-13 12-11 21 3 12 13 19 26 19h22c15 0 23-8 25-20l2-11"/>
                                        <g opacity=".28">
                                            <path d="M192 74v14M198 68v18M205 72v14M212 78v12M219 82v9"/>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <span class="mono mono-b">Mode 01 &middot; Solo</span>
                            <h3 class="leaf-name">Stake against your own goal</h3>
                            <ul class="leaf-list">
                                <li>You set the target and the window</li>
                                <li>Your principal stays yours on success</li>
                                <li>Execution yield paid from the match pool</li>
                                <li>Settles on your own connected API</li>
                            </ul>
                            <a class="link" href="/signin" onclick="window.router.navigate('/signin'); return false;">Open a solo contract &rarr;</a>
                        </article>

                        <div class="divider-v" aria-hidden="true"></div>

                        <article class="leaf leaf--dark">
                            <div class="leaf-art">
                                <svg viewBox="0 0 400 190" role="img" aria-label="Engraving: two hands pressing a single coin from opposite sides">
                                    <g fill="none" stroke="#F4EDE9" stroke-width=".7" stroke-linecap="round">
                                        <ellipse cx="200" cy="150" rx="122" ry="17" opacity=".28"/>
                                        <ellipse cx="200" cy="150" rx="94" ry="13" opacity=".4"/>
                                        <ellipse cx="200" cy="150" rx="66" ry="9" opacity=".55"/>
                                        <circle cx="200" cy="132" r="17"/>
                                        <circle cx="200" cy="132" r="12" opacity=".55"/>
                                        <path d="M193 132h14M200 125v14" opacity=".55"/>
                                        <path d="M150 98c-2-15 2-28 9-32 6-3 10 2 10 10l-1 22"/>
                                        <path d="M168 98l2-25c1-8 5-11 10-9 5 2 6 8 5 15l-3 20"/>
                                        <path d="M150 98c-9 5-12 13-9 22 4 11 13 17 25 17h20"/>
                                        <path d="M250 98c2-15-2-28-9-32-6-3-10 2-10 10l1 22"/>
                                        <path d="M232 98l-2-25c-1-8-5-11-10-9-5 2-6 8-5 15l3 20"/>
                                        <path d="M250 98c9 5 12 13 9 22-4 11-13 17-25 17h-20"/>
                                        <g opacity=".25">
                                            <path d="M158 76v13M166 70v17M234 70v17M242 76v13"/>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <span class="mono">Mode 02 &middot; Rivalry</span>
                            <h3 class="leaf-name">Stake head to head</h3>
                            <ul class="leaf-list">
                                <li>Two counterparties lock equal capital</li>
                                <li>Same metric, same window, same oracle</li>
                                <li>Verified winner takes the escrow</li>
                                <li>No manual claim, no dispute queue</li>
                            </ul>
                            <a class="link" href="/signin" onclick="window.router.navigate('/signin'); return false;">Open a rivalry contract &rarr;</a>
                        </article>
                    </div>
                </div>
            </section>

            <!-- 
                ============================================================
                SECTION 3 · ARGUMENT: THE PRINTED PAGE
                Document Type: Printed Book Page with Marginalia & Ruled Table
                Invariant Kit: Deep Cream Stock (#F2EEE7), Dropcap Typography, 
                Hairline Ledger Rules, Struck-through Void Column.
                ============================================================
            -->
            <section class="section alt">
                <div class="shell">
                    <div class="argument">
                        <div>
                            <p class="eyebrow">The case</p>
                            <h2 class="title">A plan without stakes is just a comfortable wish</h2>

                            <div class="prose">
                                <p class="dropcap">Planning is easy and executing is hard, and the gap between them
                                    is not a knowledge problem. You already know what the next step is. You have known
                                    for months.</p>
                                <p>What you don't have is a reason that the step has to happen this week rather than
                                    some other week. Failure is free. Nothing arrives to mark it. The deadline slides
                                    and the only cost is a feeling, and feelings are cheap enough to absorb
                                    indefinitely.</p>
                                <p>Collateral makes the miss cost something you can count. Not a streak, not a badge,
                                    not a notification &mdash; capital you already own, held by a custodian, released only on
                                    evidence.</p>
                                <p>That single change reorders the week. The work stops competing with everything
                                    else on equal terms, because now it is the only item on the list with a price
                                    attached to skipping it.</p>
                            </div>
                        </div>

                        <aside class="margin-note">
                            <span class="mono mono-b">Note</span>
                            <p>Contracts settle on read-only telemetry from the platform where the goal lives.
                                Collateral never asks you to self-report, and self-reported outcomes are not
                                accepted as evidence.</p>
                        </aside>
                    </div>

                    <table class="ledger-compare">
                        <caption>Same goal, recorded two ways</caption>
                        <thead>
                            <tr><th scope="col">Wk</th><th scope="col">Without stakes</th><th scope="col">Under contract</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>01</td><td class="void">Plan a new goal</td><td>Lock a deposit on target</td></tr>
                            <tr><td>02</td><td class="void">Get distracted</td><td>Failure now has a price</td></tr>
                            <tr><td>03</td><td class="void">Push the deadline</td><td>Work through the night</td></tr>
                            <tr><td>04</td><td class="void">Another year slides by</td><td>Target hit, yield claimed</td></tr>
                            <tr>
                                <td>&mdash;</td>
                                <td class="void">Nothing was at risk, so nothing changed</td>
                                <td class="outcome-win">Capital returned. The goal actually happened.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- 
                ============================================================
                SECTION 4 · SETTLEMENT RECORD: THE LEDGER
                Document Type: Official Perforated Receipts Ledger
                Invariant Kit: Perforated Edge Detailing, Serialized Receipt Numbers, 
                APPROVED & DENIED Rubber Stamps, Tabular Book Totals Footing.
                ============================================================
            -->
            <section class="section" id="record">
                <div class="shell">
                    <p class="eyebrow">Settlement record</p>
                    <h2 class="title">Skin in the game is the only thing that works</h2>
                    <p class="lede">Every contract settles automatically on objective API telemetry &mdash; including
                        the ones people lose. Three from the current book.</p>

                    <div class="receipts">

                        <article class="receipt">
                            <div class="r-top">
                                <div class="r-meta">
                                    <span class="mono">Settlement receipt</span>
                                    <span class="mono">№ C&ndash;34D6</span>
                                </div>
                                <h3 class="r-goal">+20% revenue in 30 days</h3>
                                <p class="r-src">@revpilot &middot; via Stripe API</p>
                                <dl class="r-fields">
                                    <div class="r-row"><dt>Capital staked</dt><span class="r-dots"></span><dd>$2,000.00</dd></div>
                                    <div class="r-row"><dt>Verified by</dt><span class="r-dots"></span><dd>Stripe oracle</dd></div>
                                    <div class="r-row"><dt>Settled on</dt><span class="r-dots"></span><dd>14 Mar 2026</dd></div>
                                </dl>
                            </div>
                            <div class="perf" aria-hidden="true"></div>
                            <div class="r-bottom won">
                                <div>
                                    <p class="r-amt">+$2,240.00</p>
                                    <p class="r-note">Principal + yield returned</p>
                                </div>
                                <span class="stamp won">Approved</span>
                            </div>
                        </article>

                        <article class="receipt">
                            <div class="r-top">
                                <div class="r-meta">
                                    <span class="mono">Settlement receipt</span>
                                    <span class="mono">№ C&ndash;9F21</span>
                                </div>
                                <h3 class="r-goal">50,000 subscribers in 60 days</h3>
                                <p class="r-src">@deltacreator &middot; via YouTube API</p>
                                <dl class="r-fields">
                                    <div class="r-row"><dt>Capital staked</dt><span class="r-dots"></span><dd>$1,000.00</dd></div>
                                    <div class="r-row"><dt>Verified by</dt><span class="r-dots"></span><dd>YouTube oracle</dd></div>
                                    <div class="r-row"><dt>Settled on</dt><span class="r-dots"></span><dd>09 Mar 2026</dd></div>
                                </dl>
                            </div>
                            <div class="perf" aria-hidden="true"></div>
                            <div class="r-bottom won">
                                <div>
                                    <p class="r-amt">+$1,120.00</p>
                                    <p class="r-note">Principal + yield returned</p>
                                </div>
                                <span class="stamp won">Approved</span>
                            </div>
                        </article>

                        <article class="receipt">
                            <div class="r-top">
                                <div class="r-meta">
                                    <span class="mono">Settlement receipt</span>
                                    <span class="mono">№ C&ndash;780B</span>
                                </div>
                                <h3 class="r-goal">25,000 followers in 30 days</h3>
                                <p class="r-src">@marcusk &middot; via X API</p>
                                <dl class="r-fields">
                                    <div class="r-row"><dt>Capital staked</dt><span class="r-dots"></span><dd>$1,500.00</dd></div>
                                    <div class="r-row"><dt>Verified by</dt><span class="r-dots"></span><dd>X oracle</dd></div>
                                    <div class="r-row"><dt>Settled on</dt><span class="r-dots"></span><dd>02 Mar 2026</dd></div>
                                </dl>
                            </div>
                            <div class="perf" aria-hidden="true"></div>
                            <div class="r-bottom lost">
                                <div>
                                    <p class="r-amt">&minus;$1,500.00</p>
                                    <p class="r-note">Forfeited to match pool</p>
                                </div>
                                <span class="stamp lost">Denied</span>
                            </div>
                        </article>

                    </div>

                    <div class="footing">
                        <p class="mono" style="margin:0 0 4px">Book totals &middot; inception to date</p>
                        <dl class="footing-rows">
                            <div class="f-row"><dt>Contracts won</dt><span class="f-dots"></span><dd>74%</dd></div>
                            <div class="f-row"><dt>Verified counterparties</dt><span class="f-dots"></span><dd>812</dd></div>
                            <div class="f-row"><dt>Average time to target</dt><span class="f-dots"></span><dd>18 days</dd></div>
                            <div class="f-row"><dt>Deposits taken in</dt><span class="f-dots"></span><dd>$8,700,000</dd></div>
                            <div class="f-row f-total"><dt>Total capital settled</dt><span class="f-dots"></span><dd>$8,369,400</dd></div>
                        </dl>
                    </div>
                </div>
            </section>

            <!-- 
                ============================================================
                SECTION 5 · HOW MONEY FLOWS: THE SCHEMATIC
                Document Type: Technical Plotted Engineering Blueprint
                Invariant Kit: Mono Annotations, Linear SVG Arrow Flows, 
                Recirculating Forfeit Path, Reconciled Figures Legend.
                ============================================================
            -->
            <section class="section alt" id="flow">
                <div class="shell">
                    <p class="eyebrow">Escrow schematic</p>
                    <h2 class="title">How money moves through a contract</h2>
                    <p class="lede">Deposits sit in custodial escrow until a platform API confirms the outcome.
                        Winners receive principal plus matching yield funded by forfeited deposits.</p>

                    <div class="schematic">
                        <div class="sch-head">
                            <span class="mono">Drawing 01 &middot; settlement path</span>
                            <span class="mono">Rev. 2026.03</span>
                        </div>

                        <svg class="sch-svg" viewBox="0 0 1080 400" role="img"
                             aria-label="Schematic: deposits enter custodial escrow, are verified by platform APIs, then split into returned capital, forfeited deposits which recirculate to the match pool, and a protocol fee.">
                            <defs>
                                <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                                    <path d="M1 1L9 5L1 9" fill="none" stroke="context-stroke" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                </marker>
                            </defs>

                            <g fill="none" stroke="#131A2B" stroke-width="1">
                                <rect x="20" y="150" width="180" height="86"/>
                                <rect x="290" y="150" width="180" height="86" stroke-width="1.6"/>
                                <rect x="560" y="150" width="180" height="86"/>
                            </g>

                            <g font-size="10" letter-spacing="1.6" fill="#8B909D">
                                <text x="34" y="172">INPUT</text>
                                <text x="304" y="172">CUSTODY</text>
                                <text x="574" y="172">VERIFICATION</text>
                            </g>
                            <g font-size="13" fill="#131A2B" letter-spacing=".4">
                                <text x="34" y="196">Deposit in</text>
                                <text x="304" y="196">Escrow vault</text>
                                <text x="574" y="196">Oracle API</text>
                            </g>
                            <g font-size="14" fill="#7B1E2B" letter-spacing=".4">
                                <text x="34" y="220">$8,700,000</text>
                                <text x="304" y="220">$8.7M locked</text>
                                <text x="574" y="220">96.2% hit rate</text>
                            </g>

                            <g stroke-width="1" marker-end="url(#ar)" fill="none">
                                <line x1="204" y1="193" x2="282" y2="193" stroke="#131A2B"/>
                                <line x1="474" y1="193" x2="552" y2="193" stroke="#131A2B"/>
                                <path d="M744 193 L800 193 L800 78 L856 78" stroke="#1A7A52" stroke-width="1.4"/>
                                <path d="M744 193 L820 193 L856 193" stroke="#7B1E2B" stroke-dasharray="5 4"/>
                                <path d="M744 193 L800 193 L800 310 L856 310" stroke="#8B909D" stroke-dasharray="2 4"/>
                            </g>

                            <g fill="none" stroke-width="1">
                                <rect x="860" y="40" width="200" height="76" stroke="#1A7A52"/>
                                <rect x="860" y="155" width="200" height="76" stroke="#7B1E2B"/>
                                <rect x="860" y="272" width="200" height="76" stroke="#D9D2C6"/>
                            </g>
                            <g font-size="10" letter-spacing="1.6">
                                <text x="874" y="62" fill="#1A7A52">WIN PATH &middot; 95.7%</text>
                                <text x="874" y="177" fill="#7B1E2B">FORFEITED &middot; 3.8%</text>
                                <text x="874" y="294" fill="#8B909D">PROTOCOL FEE &middot; 0.5%</text>
                            </g>
                            <g font-size="12.5" fill="#131A2B" letter-spacing=".3">
                                <text x="874" y="83">Returned to creator</text>
                                <text x="874" y="198">Funds the match pool</text>
                                <text x="874" y="315">Operations</text>
                            </g>
                            <g font-size="14" letter-spacing=".3">
                                <text x="874" y="105" fill="#1A7A52">$8,326,200</text>
                                <text x="874" y="220" fill="#7B1E2B">$330,600</text>
                                <text x="874" y="337" fill="#8B909D">$43,200</text>
                            </g>

                            <path d="M960 235 L960 372 L380 372 L380 240" fill="none" stroke="#7B1E2B"
                                  stroke-width="1" stroke-dasharray="5 4" marker-end="url(#ar)"/>
                            <text x="670" y="366" font-size="10" letter-spacing="1.6" fill="#7B1E2B"
                                  text-anchor="middle">FORFEITED DEPOSITS RECIRCULATE TO THE VAULT</text>

                            <g stroke="#8B909D" stroke-width=".6">
                                <path d="M20 268 v10 M200 268 v10 M20 273 h180"/>
                            </g>
                            <text x="110" y="290" font-size="9.5" letter-spacing="1.4" fill="#8B909D"
                                  text-anchor="middle">STRIPE CONNECT CUSTODY</text>
                        </svg>

                        <div class="sch-foot">
                            <span class="legend"><span class="swatch" style="color:#1A7A52"></span>Returned capital</span>
                            <span class="legend"><span class="swatch dash" style="color:#7B1E2B"></span>Forfeited &amp; recirculated</span>
                            <span class="legend"><span class="swatch dash" style="color:#8B909D"></span>Protocol fee</span>
                            <span class="legend" style="margin-left:auto">Figures reconcile to the book totals above</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 
                ============================================================
                SECTION 6 · CHOOSE YOUR COMMITMENT: THE TERM SHEET
                Document Type: Ruled Financial Rate Table (Schedule A)
                Invariant Kit: Monospace Column Headers, Oxblood Multiplier Figures, 
                Marked Column Annotation (Stake 2.5x), Hairline Field Grid.
                ============================================================
            -->
            <section class="section" id="terms">
                <div class="shell">
                    <p class="eyebrow">Commitment terms</p>
                    <h2 class="title">How much is the goal worth to you</h2>
                    <p class="lede">Bigger stake, bigger return. Miss the target and you forfeit. Every tier
                        settles on the same oracle.</p>

                    <table class="termsheet">
                        <caption>Schedule A &middot; deposit tiers and forfeit terms</caption>
                        <thead>
                            <tr>
                                <th scope="col"><span class="t-tier">Term</span></th>
                                <th scope="col">
                                    <span class="t-tier">Pledge</span>
                                    <span class="t-mult">1.5<small>&times;</small></span>
                                </th>
                                <th scope="col" class="col-mark">
                                    <span class="t-tier">Stake</span>
                                    <span class="t-mult">2.5<small>&times;</small></span>
                                    <span class="t-annot">&larr; Most contracts written here</span>
                                </th>
                                <th scope="col">
                                    <span class="t-tier">All-in</span>
                                    <span class="t-mult">4.0<small>&times;</small></span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Deposit range</th>
                                <td>$100 &ndash; $1,500</td>
                                <td class="col-mark">$250 &ndash; $3,000</td>
                                <td>$500 &ndash; $10,000</td>
                            </tr>
                            <tr>
                                <th scope="row">Execution window</th>
                                <td>30 days</td>
                                <td class="col-mark">30 days</td>
                                <td>14 days</td>
                            </tr>
                            <tr>
                                <th scope="row">Return on success</th>
                                <td>1.5&times; principal</td>
                                <td class="col-mark">2.5&times; principal</td>
                                <td>4.0&times; principal</td>
                            </tr>
                            <tr>
                                <th scope="row">On miss</th>
                                <td>Grace period</td>
                                <td class="col-mark">Full forfeit</td>
                                <td>Full forfeit</td>
                            </tr>
                            <tr>
                                <th scope="row">Rivalry eligible</th>
                                <td>No</td>
                                <td class="col-mark">Yes</td>
                                <td>Yes</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td><a class="btn btn-out" href="/signin" onclick="window.router.navigate('/signin'); return false;">Open pledge</a></td>
                                <td class="col-mark"><a class="btn btn-fill" href="/signin" onclick="window.router.navigate('/signin'); return false;">Open stake</a></td>
                                <td><a class="btn btn-out" href="/signin" onclick="window.router.navigate('/signin'); return false;">Open all-in</a></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>

            <!-- 
                ============================================================
                SECTION 7 · LIVE RIVALRY: THE TAPE
                Document Type: Monospace Live Market Feed Ticker
                Invariant Kit: Continuous Monospace Stream, Live Emerald Pulse Dot, 
                Tabular Growth Deltas, Live Market Contract Data.
                ============================================================
            -->
            <section class="section alt" id="tape" style="padding-bottom:calc(var(--section-y) - 20px)">
                <div class="shell">
                    <p class="eyebrow eyebrow--live">Live rivalry tape</p>
                    <h2 class="title">Contracts running right now</h2>
                    <p class="lede">Open rivalry duels, updated on every oracle poll. Select any line to open
                        the match.</p>
                </div>

                <div class="tape">
                    <div class="tape-head shell" style="max-width:none">
                        <span class="dot" aria-hidden="true"></span>
                        <span class="mono">6 open &middot; $19,500 at risk &middot; polled 40s ago</span>
                    </div>
                    <div class="tape-strip">
                        <a class="tick" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Audience</span><span>@jakevoss</span><span class="tick-up">+12.4%</span><span class="tick-vs">VS</span><span>@marcus</span><span class="tick-dn">+9.2%</span><span class="tick-pool">$5,000</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Revenue</span><span>@revpilot</span><span class="tick-up">+8.1%</span><span class="tick-vs">VS</span><span>@quotaops</span><span class="tick-dn">+5.4%</span><span class="tick-pool">$2,000</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Subscribers</span><span>@deltacreator</span><span class="tick-up">+21.0%</span><span class="tick-vs">VS</span><span>@northloop</span><span class="tick-dn">+18.7%</span><span class="tick-pool">$3,500</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Orders</span><span>@shopfern</span><span class="tick-up">+6.9%</span><span class="tick-vs">VS</span><span>@basketcase</span><span class="tick-dn">+4.1%</span><span class="tick-pool">$4,000</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Audience</span><span>@quietbuild</span><span class="tick-up">+15.2%</span><span class="tick-vs">VS</span><span>@harborco</span><span class="tick-dn">+11.8%</span><span class="tick-pool">$2,500</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Revenue</span><span>@mileshaus</span><span class="tick-up">+3.4%</span><span class="tick-vs">VS</span><span>@ridgeline</span><span class="tick-dn">+2.9%</span><span class="tick-pool">$2,500</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" aria-hidden="true" tabindex="-1" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Audience</span><span>@jakevoss</span><span class="tick-up">+12.4%</span><span class="tick-vs">VS</span><span>@marcus</span><span class="tick-dn">+9.2%</span><span class="tick-pool">$5,000</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" aria-hidden="true" tabindex="-1" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Revenue</span><span>@revpilot</span><span class="tick-up">+8.1%</span><span class="tick-vs">VS</span><span>@quotaops</span><span class="tick-dn">+5.4%</span><span class="tick-pool">$2,000</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" aria-hidden="true" tabindex="-1" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Subscribers</span><span>@deltacreator</span><span class="tick-up">+21.0%</span><span class="tick-vs">VS</span><span>@northloop</span><span class="tick-dn">+18.7%</span><span class="tick-pool">$3,500</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" aria-hidden="true" tabindex="-1" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Orders</span><span>@shopfern</span><span class="tick-up">+6.9%</span><span class="tick-vs">VS</span><span>@basketcase</span><span class="tick-dn">+4.1%</span><span class="tick-pool">$4,000</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" aria-hidden="true" tabindex="-1" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Audience</span><span>@quietbuild</span><span class="tick-up">+15.2%</span><span class="tick-vs">VS</span><span>@harborco</span><span class="tick-dn">+11.8%</span><span class="tick-pool">$2,500</span><span class="tick-arrow">&rarr;</span></a>
                        <a class="tick" aria-hidden="true" tabindex="-1" href="/signin" onclick="window.router.navigate('/signin'); return false;"><span class="tick-cat">Revenue</span><span>@mileshaus</span><span class="tick-up">+3.4%</span><span class="tick-vs">VS</span><span>@ridgeline</span><span class="tick-dn">+2.9%</span><span class="tick-pool">$2,500</span><span class="tick-arrow">&rarr;</span></a>
                    </div>
                </div>
            </section>

            <!-- 
                ============================================================
                SECTION 8 · SIGNATURE BLOCK & DISCLOSURE
                Document Type: Countersigned Affidavit & Statutory Disclosure
                Invariant Kit: Engraved Institutional Wax Seal SVG, Dual Signature Lines, 
                Formal Custody Disclosure Footnote.
                ============================================================
            -->
            <section class="section" style="padding-top:0">
                <div class="shell">
                    <div class="signblock">
                        <svg width="76" height="76" viewBox="0 0 76 76" role="img" aria-label="Collateral seal"
                             style="margin:0 auto" fill="none" stroke="#7B1E2B">
                            <circle cx="38" cy="38" r="35" stroke-width="1"/>
                            <circle cx="38" cy="38" r="30" stroke-width=".6"/>
                            <circle cx="38" cy="38" r="17" stroke-width=".6"/>
                            <g stroke-width=".6" opacity=".75">
                                <path d="M38 8v6M38 62v6M8 38h6M62 38h6M17 17l4 4M55 55l4 4M59 17l-4 4M21 55l-4 4"/>
                            </g>
                            <text x="38" y="42" text-anchor="middle" font-family="IBM Plex Mono, monospace"
                                  font-size="12" letter-spacing="1.5" fill="#7B1E2B" stroke="none">CLTR</text>
                        </svg>

                        <h2 class="sign-title">Sign it, and the week reorders itself</h2>
                        <p class="sign-copy">Objective tracking. Verified business data only. No self-reporting,
                            no manual claims, no disputes.</p>
                        <a class="btn btn-fill" href="/signin" onclick="window.router.navigate('/signin'); return false;">Open a contract</a>

                        <div class="sign-lines">
                            <div class="sign-line">
                                <p class="sign-script">&nbsp;</p>
                                <span class="mono">Counterparty signature</span>
                            </div>
                            <div class="sign-line">
                                <p class="sign-script">Collateral</p>
                                <span class="mono">Custodian, countersigned</span>
                            </div>
                        </div>

                        <p class="disclosure">Deposits are held by a third-party custodian via Stripe Connect and
                            are not held by Collateral. Outcomes are determined solely by read-only telemetry from
                            the connected platform API named in the contract. Matching yield is funded from
                            forfeited deposits and sponsor contributions, is not interest, and is not guaranteed.
                            Collateral is not a broker, dealer, exchange, investment adviser, or deposit
                            institution, and contracts are not securities, insurance, or wagers on events outside
                            the counterparty's control. Forfeited capital is not recoverable. Figures shown are
                            book totals as of 24 July 2026.</p>
                    </div>
                </div>
            </section>

            <!-- FOOTER -->
            <footer class="foot">
                <div class="shell foot-in">
                    <span class="wordmark" style="font-size:16px">Collateral</span>
                    <span class="mono">Escrow via Stripe Connect</span>
                    <nav class="foot-links" aria-label="Footer">
                        <a href="#modes">Contracts</a>
                        <a href="#record">Record</a>
                        <a href="#flow">Escrow</a>
                        <a href="#terms">Terms</a>
                        <a href="#tape">Live</a>
                    </nav>
                </div>
            </footer>

        </div>
    `;
}

export function initLandingEvents() {
    // Enable smooth hash scrolling for inline nav links
    document.querySelectorAll('.lp a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
