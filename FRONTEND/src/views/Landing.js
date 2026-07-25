// Landing Page — Collateral Financial Document System with Paper Grain & Scoped Styling
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';
import { useReveal, useCountUp, revealStyles } from './LandingMotion.js';

// Inject LandingCSS once into document head
if (!document.getElementById('lp-injected-styles')) {
    const style = document.createElement('style');
    style.id = 'lp-injected-styles';
    style.textContent = landingCSS;
    document.head.appendChild(style);
}

export function renderLanding() {
    return `
        <div class="lp cl-root">
            <div class="cl-grain" aria-hidden="true"></div>

            <!-- ═════ NAV HEADER ═════ -->
            <nav class="ln">
                <div class="ln-in">
                    <a class="ln-brand" href="/" onclick="window.router.navigate('/'); return false;">
                        <span class="logo-wordmark">COLLATERAL</span>
                    </a>
                    <div class="ln-right-group">
                        <button class="ln-cta" id="lp-nav-cta" type="button" style="background:transparent;color:#0E1420;border:1px solid #0E1420;" onclick="if(window.app && window.app.openAccessModal){ window.app.openAccessModal('login'); } else { window.router.navigate('/signin'); } return false;">SIGN IN</button>
                        <button class="ch-hamburger" id="mobile-menu-btn" aria-label="Menu" onclick="window.app.toggleMobileMenu()">
                            <div class="ch-hamburger-lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            <!-- ═════ 1 · HERO + LIVE TAPE ═════ -->
            <section class="hero section">
                <div class="shell hero-grid">
                    <div>
                        <p class="eyebrow rise" style="--d:40ms">Self-enforcing performance contracts</p>
                        <h1 class="h1 rise" style="--d:120ms">Put money on your own deadline</h1>
                        <p class="lede rise" style="--d:220ms">Lock a deposit against a public goal. If your platform API confirms you hit it on time, your money comes back with matching yield. If you miss, your deposit funds someone who didn't.</p>
                        <div class="hero-actions rise" style="--d:340ms">
                            <button class="btn btn-fill" type="button" onclick="if(window.app && window.app.openAccessModal){ window.app.openAccessModal('signup'); } else { window.router.navigate('/signin'); } return false;">Write a contract</button>
                            <a class="btn btn-ghost" href="#flow">Watch forfeiture flow &darr;</a>
                        </div>
                        <div class="oracles-strip rise" style="--d:480ms">
                            <span class="mono" style="opacity:.45">ORACLES</span>
                            <a class="mono rise" style="--d:570ms" href="#oracles">Stripe</a>
                            <a class="mono rise" style="--d:600ms" href="#oracles">X</a>
                            <a class="mono rise" style="--d:630ms" href="#oracles">YouTube</a>
                            <a class="mono rise" style="--d:660ms" href="#oracles">Shopify</a>
                        </div>
                    </div>

                    <div class="tape seat ticks" style="--d:260ms">
                        <div class="tape-head">
                            <span class="dot pulse"></span>
                            <span class="mono">Settlement queue &middot; live</span>
                            <span class="mono" style="margin-left:auto" id="clock">--:--:--</span>
                        </div>
                        <div class="tape-meters">
                            <div class="meter">
                                <span class="mono">Held in escrow</span>
                                <span class="meter-val blood" id="m-escrow">$8,700,000</span>
                            </div>
                            <div class="meter-div"></div>
                            <div class="meter">
                                <span class="mono">Settled today</span>
                                <span class="meter-val win" id="m-settled">$34,200</span>
                            </div>
                        </div>
                        <div class="tape-rows" id="rows"></div>
                        <div class="tape-foot">
                            <span class="mono">Custody &middot; Stripe Connect</span>
                            <span class="mono" id="m-count">48 settled</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ═════ 2 · MODES ═════ -->
            <section class="section alt reveal" id="modes">
                <span class="idx-mark" aria-hidden="true">02</span>
                <div class="shell">
                    <p class="eyebrow r-item" style="--i:0">Contract execution modes</p>
                    <h2 class="title r-item" style="--i:1">Two ways to make quitting expensive</h2>
                    <p class="lede r-item" style="--i:2">Stake against your own record, or against somebody who wants it as badly as
                        you claim to. Both settle the same way, and neither asks your opinion.</p>

                    <div class="modes">
                        <div class="plates plate ticks r-plate" style="--i:3">
                            <article class="leaf r-plate" style="--i:3">
                                <div class="leaf-art">
                                    <img src="/assets/images/solo-seal.png" alt="Solo Contract Seal" class="leaf-img" loading="lazy" />
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span class="mono mono-b">MODE 01 &middot; SOLO</span>
                                    <span class="mono">FORM S&ndash;01</span>
                                </div>
                                <h3 class="leaf-name">The only opponent is the version of you who quits</h3>
                                <ul class="leaf-list">
                                    <li>You set the target. You don't get to move it</li>
                                    <li>Hit it and every dollar comes back, plus yield</li>
                                    <li>Miss it and the money goes to someone who didn't</li>
                                </ul>
                                <a class="link" href="/signin" onclick="if(window.app && window.app.openAccessModal){ window.app.openAccessModal('signup'); } else { window.router.navigate('/signin'); } return false;">Write a solo contract &rarr;</a>
                            </article>

                            <div class="vrule" aria-hidden="true"></div>

                            <article class="leaf leaf--dark r-plate" style="--i:4">
                                <div class="leaf-art">
                                    <img src="/assets/images/rivalry-seal.png" alt="Rivalry Contract Seal" class="leaf-img" loading="lazy" />
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span class="mono">MODE 02 &middot; RIVALRY</span>
                                    <span class="mono">FORM R&ndash;02</span>
                                </div>
                                <h3 class="leaf-name">Someone else is counting on you to fail</h3>
                                <p class="mono" style="margin: 6px 0 14px; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;">TWO COUNTERPARTIES &middot; ONE ORACLE &middot; NO DRAW</p>
                                <ul class="leaf-list">
                                    <li>Equal capital, same metric, same clock</li>
                                    <li>One oracle decides. Neither of you gets a vote</li>
                                    <li>The winner takes the escrow. There is no draw</li>
                                </ul>
                                <a class="link" href="/signin" onclick="if(window.app && window.app.openAccessModal){ window.app.openAccessModal('signup'); } else { window.router.navigate('/signin'); } return false;">Find a counterparty &rarr;</a>
                            </article>
                        </div>

                        <aside class="demo plate-quiet ticks r-plate" style="--i:5">
                            <div class="demo-top">
                                <span class="mono">SPECIMEN</span>
                                <span class="mono">SOLO CONTRACT</span>
                            </div>
                            <div class="demo-center-block">
                                <p class="demo-you">You</p>
                                <p class="demo-vs">VS</p>
                                <p class="demo-you">You</p>
                                <p class="demo-amt">$1,000</p>
                                <p class="mono demo-sub">Locked by you, against you</p>
                            </div>

                            <dl class="demo-ledger">
                                <div class="t-row"><dt>DEPOSIT</dt><span class="dots"></span><dd>$1,000</dd></div>
                                <div class="t-row"><dt>WINDOW</dt><span class="dots"></span><dd>30 days</dd></div>
                                <div class="t-row"><dt>ON SUCCESS</dt><span class="dots"></span><dd class="win">$2,500</dd></div>
                                <div class="t-row"><dt>ON MISS</dt><span class="dots"></span><dd class="blood">&minus;$1,000</dd></div>
                            </dl>

                            <div class="demo-foot-bar">
                                <span class="mono">SPECIMEN &middot; NOT A LIVE CONTRACT</span>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <!-- ═════ 3 · CASE ═════ -->
            <section class="section reveal" id="case">
                <div class="shell argue">
                    <div>
                        <p class="eyebrow r-item" style="--i:0">Why it works</p>
                        <h2 class="title r-item" style="--i:1">A plan without stakes is just a comfortable wish</h2>
                        <p class="lede r-item" style="--i:2; margin-top:18px">You already know what the next step is. You've
                            known for months. What you don't have is a reason it has to happen this week instead of
                            some other week, because missing it costs a feeling, and feelings are cheap enough to
                            absorb forever.</p>
                        <aside class="argue-note r-item" style="--i:4">
                            <span class="mono mono-b">Clerk's note</span>
                            <p>The median contract is opened at 11:40pm on a Sunday. We have theories about why,
                                and none of them are flattering.</p>
                        </aside>
                    </div>

                    <div>
                        <p class="cmp-caption mono r-item" style="--i:3">Same goal, recorded two ways</p>
                        <table class="cmp plate-quiet r-plate" style="--i:3">
                            <thead>
                                <tr><th scope="col">Wk</th><th scope="col">Without stakes &middot; VOID</th><th scope="col">Under contract</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>01</td><td class="void">Announce the goal</td><td>Lock the deposit</td></tr>
                                <tr><td>02</td><td class="void">Something urgent comes up</td><td>Something urgent comes up anyway</td></tr>
                                <tr><td>03</td><td class="void">Move the deadline, quietly</td><td>The deadline does not move</td></tr>
                                <tr><td>04</td><td class="void">Decide it wasn't the right time</td><td>Ship it at 2am, badly, on time</td></tr>
                                <tr><td>&mdash;</td><td class="void">Nothing at risk, nothing changed</td>
                                    <td class="won-txt">Money back. And the thing exists.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ═════ 3b · ORACLE REGISTER ═════ -->
            <section class="section reveal" id="oracles" style="padding-top:0">
                <div class="shell">
                    <div class="oracles-head">
                        <div>
                            <p class="eyebrow r-item" style="--i:0">Verification sources</p>
                            <h2 class="title r-item" style="--i:1">Four APIs decide every contract</h2>
                            <p class="lede r-item" style="--i:2">Collateral does not score you. It reads the same numbers your platform
                                already reports, on a fixed schedule, and settles on whatever it finds there.</p>
                        </div>
                        <aside class="marg-note-top r-item" style="--i:3">
                            <span class="mono mono-b" style="color:var(--blood)">&sect; 3.4</span>
                            <p class="mono">Read-only scopes only. Collateral cannot post, message, refund, or change a single
                                setting on any account you connect, and the token can be revoked from your side at any
                                time without affecting an open contract's settlement.</p>
                        </aside>
                    </div>

                    <p class="reg-caption mono r-item" style="--i:3">Register of accepted oracles &middot; read-only scopes</p>
                    <table class="reg plate r-plate" style="--i:4">
                        <thead>
                            <tr>
                                <th scope="col">Platform</th>
                                <th scope="col">Metrics read</th>
                                <th scope="col">Poll cadence</th>
                                <th scope="col">Last poll</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="reg-name">
                                        <span class="reg-mark" aria-hidden="true">
                                            <img src="/assets/images/stripe-brand.svg" alt="Stripe" class="reg-logo" />
                                        </span>
                                        <span class="reg-plat">Stripe</span>
                                    </span>
                                </td>
                                <td data-label="Reads">Net revenue, MRR, order volume</td>
                                <td data-label="Cadence"><span class="reg-num">Every 6h</span></td>
                                <td data-label="Last poll"><span class="reg-num"><span class="dot-live"></span>4m ago</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="reg-name">
                                        <span class="reg-mark" aria-hidden="true">
                                            <img src="/assets/images/x-brand.svg" alt="X" class="reg-logo" />
                                        </span>
                                        <span class="reg-plat">X</span>
                                    </span>
                                </td>
                                <td data-label="Reads">Followers, impressions, post reach</td>
                                <td data-label="Cadence"><span class="reg-num">Every 1h</span></td>
                                <td data-label="Last poll"><span class="reg-num">12m ago</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="reg-name">
                                        <span class="reg-mark" aria-hidden="true">
                                            <img src="/assets/images/youtube-brand.svg" alt="YouTube" class="reg-logo" />
                                        </span>
                                        <span class="reg-plat">YouTube</span>
                                    </span>
                                </td>
                                <td data-label="Reads">Subscribers, views, watch time</td>
                                <td data-label="Cadence"><span class="reg-num">Every 12h</span></td>
                                <td data-label="Last poll"><span class="reg-num">1h ago</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="reg-name">
                                        <span class="reg-mark" aria-hidden="true">
                                            <img src="/assets/images/shopify-brand.svg" alt="Shopify" class="reg-logo" />
                                        </span>
                                        <span class="reg-plat">Shopify</span>
                                    </span>
                                </td>
                                <td data-label="Reads">Orders, revenue, average order value</td>
                                <td data-label="Cadence"><span class="reg-num">Every 6h</span></td>
                                <td data-label="Last poll"><span class="reg-num">22m ago</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ═════ 4 · RECORD ═════ -->
            <section class="section alt reveal" id="record" style="padding-bottom: 52px;">
                <span class="idx-mark" aria-hidden="true">05</span>
                <div class="shell">
                    <p class="eyebrow r-item" style="--i:0">Settlement record</p>
                    <h2 class="title r-item" style="--i:1">The receipts, including the ones that hurt</h2>
                    <p class="lede r-item" style="--i:2">Most sites show you the wins. Every contract here settles on the same
                        telemetry whether it went well or not, and we publish both, because a record with no
                        losses in it isn't a record.</p>

                    <div class="receipts">
                        <article class="receipt r-plate" style="--i:3">
                            <div class="r-top">
                                <div class="r-meta"><span class="mono">Settlement receipt</span><span class="mono">№ C&ndash;34D6</span></div>
                                <h3 class="r-goal">+20% revenue in 30 days</h3>
                                <p class="r-src">@revpilot &middot; via Stripe API</p>
                                <dl class="r-fields">
                                    <div class="r-row"><dt>Capital staked</dt><span class="dots"></span><dd>$2,000.00</dd></div>
                                    <div class="r-row"><dt>Verified by</dt><span class="dots"></span><dd>Stripe oracle</dd></div>
                                    <div class="r-row"><dt>Settled on</dt><span class="dots"></span><dd>14 Mar 2026</dd></div>
                                </dl>
                            </div>
                            <div class="perf" aria-hidden="true"></div>
                            <div class="r-bottom won">
                                <div><p class="r-amt">+$2,240.00</p><p class="r-note">Principal + yield returned</p></div>
                                <span class="r-stamp won">Approved</span>
                            </div>
                        </article>

                        <article class="receipt r-plate" style="--i:4">
                            <div class="r-top">
                                <div class="r-meta"><span class="mono">Settlement receipt</span><span class="mono">№ C&ndash;9F21</span></div>
                                <h3 class="r-goal">50,000 subscribers in 60 days</h3>
                                <p class="r-src">@deltacreator &middot; via YouTube API</p>
                                <dl class="r-fields">
                                    <div class="r-row"><dt>Capital staked</dt><span class="dots"></span><dd>$1,000.00</dd></div>
                                    <div class="r-row"><dt>Verified by</dt><span class="dots"></span><dd>YouTube oracle</dd></div>
                                    <div class="r-row"><dt>Settled on</dt><span class="dots"></span><dd>09 Mar 2026</dd></div>
                                </dl>
                            </div>
                            <div class="perf" aria-hidden="true"></div>
                            <div class="r-bottom won">
                                <div><p class="r-amt">+$1,120.00</p><p class="r-note">Principal + yield returned</p></div>
                                <span class="r-stamp won">Approved</span>
                            </div>
                        </article>

                        <article class="receipt r-plate" style="--i:5">
                            <div class="r-top">
                                <div class="r-meta"><span class="mono">Settlement receipt</span><span class="mono">№ C&ndash;780B</span></div>
                                <h3 class="r-goal">25,000 followers in 30 days</h3>
                                <p class="r-src">@marcusk &middot; via X API</p>
                                <dl class="r-fields">
                                    <div class="r-row"><dt>Capital staked</dt><span class="dots"></span><dd>$1,500.00</dd></div>
                                    <div class="r-row"><dt>Verified by</dt><span class="dots"></span><dd>X oracle</dd></div>
                                    <div class="r-row"><dt>Settled on</dt><span class="dots"></span><dd>02 Mar 2026</dd></div>
                                </dl>
                            </div>
                            <div class="perf" aria-hidden="true"></div>
                            <div class="r-bottom lost">
                                <div><p class="r-amt">&minus;$1,500.00</p><p class="r-note">Forfeited to match pool</p></div>
                                <span class="r-stamp lost">Denied</span>
                            </div>
                        </article>
                    </div>

                    <div class="footing r-plate" style="--i:6">
                        <p class="mono" style="margin:0 0 6px">Book totals &middot; inception to date</p>
                        <dl style="margin:0">
                            <div class="f-row"><dt>Contracts won</dt><span class="dots"></span><dd>74%</dd></div>
                            <div class="f-row"><dt>Verified counterparties</dt><span class="dots"></span><dd>812</dd></div>
                            <div class="f-row"><dt>Average time to target</dt><span class="dots"></span><dd>18 days</dd></div>
                            <div class="f-row f-total"><dt>Total capital settled</dt><span class="dots"></span><dd id="book-total-amt">$8,700,000</dd></div>
                        </dl>
                    </div>
                </div>
            </section>

            <!-- ═════ 5 · FORFEIT FLOW + SCHEMATIC ═════ -->
            <section class="section reveal" id="flow">
                <span class="idx-mark" aria-hidden="true">06</span>
                <div class="shell">
                    <p class="eyebrow r-item" style="--i:0">Where forfeited money goes</p>
                    <h2 class="title r-item" style="--i:1">Losers pay winners. That is the whole engine.</h2>
                    <p class="lede r-item" style="--i:2">Marcus's fifteen hundred dollars did not vanish into a house account. Watch
                        where it actually went, then read the full path underneath.</p>

                    <div class="flow-wrap plate r-plate" style="--i:3" id="flowwrap">
                        <div class="flow-head">
                            <span class="mono">Cycle 2026&ndash;W12 &middot; recirculation</span>
                            <span class="mono">Settled 14 Mar 2026</span>
                        </div>
                        <div class="flow-stage">
                            <div class="stage-col">
                                <span class="mono">Contract denied</span>
                                <div class="loser">
                                    <span class="mono" style="color:var(--blood)">№ C&ndash;780B &middot; @marcusk</span>
                                    <p class="loser-amt">&minus;$1,500</p>
                                    <p class="loser-goal">Missed 25,000 followers in 30 days</p>
                                </div>
                            </div>
                            <div class="stage-mid">
                                <div class="track" id="track" aria-hidden="true"></div>
                                <p class="mid-label">Forfeited deposit<br>recirculates &rarr;</p>
                            </div>
                            <div class="stage-col">
                                <span class="mono">Match pool</span>
                                <div class="pool">
                                    <span class="mono" style="color:var(--win)">Funds this cycle's winners</span>
                                    <p class="pool-amt" id="pool-amt">$0</p>
                                    <div class="pool-bar"><i id="pool-bar"></i></div>
                                    <div class="winners" id="winners">
                                        <div class="winner"><span>@revpilot</span><span class="amt">+$240</span></div>
                                        <div class="winner"><span>@deltacreator</span><span class="amt">+$120</span></div>
                                        <div class="winner"><span>@quietbuild</span><span class="amt">+$180</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flow-foot">
                            <span class="mono">3.8% of deposits forfeit &middot; 100% recirculates</span>
                            <button class="replay" id="replay">Replay</button>
                        </div>
                    </div>

                    <div class="marg marg-strip r-item" style="--i:4; margin-top:34px">
                        <span class="marg-mark">&sect; 4.1</span>
                        <p>We take half a percent and nothing else. There is no spread, no rake on the match
                            pool, and no scenario in which Collateral profits more when you miss.</p>
                    </div>

                    <div class="sch plate-quiet r-plate" style="--i:5; margin-top:34px">
                        <div class="sch-head">
                            <span class="mono">Drawing 01 &middot; full settlement path</span>
                            <span class="mono">Rev. 2026.03</span>
                        </div>
                        <svg viewBox="0 0 1080 400" role="img"
                             aria-label="Schematic: deposits enter custodial escrow, are verified by platform APIs, then split into returned capital, forfeited deposits which recirculate, and a protocol fee.">
                            <defs>
                                <marker id="cl-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                                    <path d="M1 1L9 5L1 9" fill="none" stroke="context-stroke" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                </marker>
                            </defs>
                            <g fill="none" stroke="#0E1420" stroke-width="1">
                                <rect x="20" y="150" width="180" height="86" rx="2"/>
                                <rect x="290" y="150" width="180" height="86" rx="2" stroke-width="1.7"/>
                                <rect x="560" y="150" width="180" height="86" rx="2"/>
                            </g>
                            <g font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="1.6" fill="#6E7686">
                                <text x="34" y="172">INPUT</text>
                                <text x="304" y="172">CUSTODY</text>
                                <text x="574" y="172">VERIFICATION</text>
                            </g>
                            <g font-family="Archivo, sans-serif" font-size="14" font-weight="600" fill="#0E1420">
                                <text x="34" y="197">Deposit in</text>
                                <text x="304" y="197">Escrow vault</text>
                                <text x="574" y="197">Oracle API stream</text>
                            </g>
                            <g font-family="IBM Plex Mono, monospace" font-size="14" fill="#7A1C29">
                                <text x="34" y="221">$8,700,000</text>
                                <text x="304" y="221">$8.7M locked</text>
                                <text x="574" y="221">96.2% hit rate</text>
                            </g>
                            <g stroke-width="1" marker-end="url(#cl-ar)" fill="none">
                                <line x1="204" y1="193" x2="282" y2="193" stroke="#0E1420"/>
                                <line x1="474" y1="193" x2="552" y2="193" stroke="#0E1420"/>
                                <path d="M744 193 L800 193 L800 78 L856 78" stroke="#186B4A" stroke-width="1.5"/>
                                <path d="M744 193 L820 193 L856 193" stroke="#7A1C29" stroke-dasharray="5 4"/>
                                <path d="M744 193 L800 193 L800 310 L856 310" stroke="#6E7686" stroke-dasharray="2 4"/>
                            </g>
                            <g fill="none" stroke-width="1">
                                <rect x="860" y="40" width="200" height="76" rx="2" stroke="#186B4A"/>
                                <rect x="860" y="155" width="200" height="76" rx="2" stroke="#7A1C29"/>
                                <rect x="860" y="272" width="200" height="76" rx="2" stroke="#DCD5C6"/>
                            </g>
                            <g font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="1.6">
                                <text x="874" y="62" fill="#186B4A">WIN PATH &middot; 95.7%</text>
                                <text x="874" y="177" fill="#7A1C29">FORFEITED &middot; 3.8%</text>
                                <text x="874" y="294" fill="#6E7686">PROTOCOL FEE &middot; 0.5%</text>
                            </g>
                            <g font-family="Archivo, sans-serif" font-size="13" font-weight="600" fill="#0E1420">
                                <text x="874" y="84">Returned to creator</text>
                                <text x="874" y="199">Feeds winner match pool</text>
                                <text x="874" y="316">Operations</text>
                            </g>
                            <g font-family="IBM Plex Mono, monospace" font-size="14">
                                <text x="874" y="106" fill="#186B4A">$8,326,200</text>
                                <text x="874" y="221" fill="#7A1C29">$330,600</text>
                                <text x="874" y="338" fill="#6E7686">$43,200</text>
                            </g>
                            <path d="M960 235 L960 372 L380 372 L380 240" fill="none" stroke="#7A1C29" stroke-width="1" stroke-dasharray="5 4" marker-end="url(#cl-ar)"/>
                            <text x="670" y="366" font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="1.6" fill="#7A1C29" text-anchor="middle">FORFEITED DEPOSITS RECIRCULATE TO ESCROW VAULT</text>
                            <g stroke="#6E7686" stroke-width=".6"><path d="M20 268 v10 M200 268 v10 M20 273 h180"/></g>
                            <text x="110" y="290" font-family="IBM Plex Mono, monospace" font-size="9.5" letter-spacing="1.4" fill="#6E7686" text-anchor="middle">STRIPE CONNECT CUSTODY</text>
                        
                            <!-- ═══ SCHEMATIC TRACER OVERLAY ═══ -->
                            <g class="tracer-group" aria-hidden="true">
                              <!-- Deposit in → Escrow vault -->
                              <line class="tracer t1" pathLength="100"
                                    x1="204" y1="193" x2="282" y2="193"
                                    fill="none" stroke="#0E1420" stroke-width="3.5" />

                              <!-- Escrow Vault Impact Pulse -->
                              <rect class="vault-box-pulse"
                                    x="290" y="150" width="180" height="86" rx="2"
                                    fill="none" stroke="#7A1C29" />

                              <!-- Escrow vault → Oracle API stream -->
                              <line class="tracer t2" pathLength="100"
                                    x1="474" y1="193" x2="552" y2="193"
                                    fill="none" stroke="#0E1420" stroke-width="3.5" />

                              <!-- Oracle Stream Impact Pulse -->
                              <rect class="oracle-box-pulse"
                                    x="560" y="150" width="180" height="86" rx="2"
                                    fill="none" stroke="#0E1420" />

                              <!-- Oracle API stream → junction -->
                              <line class="tracer t3" pathLength="100"
                                    x1="744" y1="193" x2="800" y2="193"
                                    fill="none" stroke="#0E1420" stroke-width="3.5" />

                              <!-- Junction → win box (the payoff leg) -->
                              <path class="tracer t-win" pathLength="100"
                                    d="M800 193 L800 78 L856 78"
                                    fill="none" stroke="#186B4A" stroke-width="4.2" />

                              <!-- Win box receives the pulse -->
                              <rect class="win-box-pulse"
                                    x="860" y="40" width="200" height="76" rx="2"
                                    fill="none" stroke="#186B4A" />

                              <!-- Forfeited Recirculation Loop (Crimson Tracer) -->
                              <path class="tracer t-forfeit" pathLength="100"
                                    d="M960 235 L960 372 L380 372 L380 240"
                                    fill="none" stroke="#7A1C29" stroke-width="3.4" />
                            </g>
                        </svg>
                        <dl class="sch-mobile">
                            <div class="sm-row"><dt>Deposits in</dt><span class="dots"></span><dd>$8,700,000</dd></div>
                            <div class="sm-row"><dt>Escrow vault</dt><span class="dots"></span><dd>Stripe Connect</dd></div>
                            <div class="sm-row"><dt>Oracle hit rate</dt><span class="dots"></span><dd>96.2%</dd></div>
                            <div class="sm-row win"><dt>Returned &middot; 95.7%</dt><span class="dots"></span><dd>$8,326,200</dd></div>
                            <div class="sm-row blood"><dt>Forfeited &middot; 3.8%</dt><span class="dots"></span><dd>$330,600</dd></div>
                            <div class="sm-row"><dt>Protocol fee &middot; 0.5%</dt><span class="dots"></span><dd>$43,200</dd></div>
                        </dl>
                        <div class="sch-foot">
                            <span class="legend"><span class="swatch" style="color:#186B4A"></span>Returned capital</span>
                            <span class="legend"><span class="swatch dash" style="color:#7A1C29"></span>Forfeited &amp; recirculated</span>
                            <span class="legend"><span class="swatch dash" style="color:#6E7686"></span>Protocol fee</span>
                            <span class="legend" style="margin-left:auto">Sums to deposits in</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ═════ 6 · CALCULATOR + TIERS ═════ -->
            <section class="section alt reveal" id="terms">
                <span class="idx-mark" aria-hidden="true">07</span>
                <div class="shell">
                    <p class="eyebrow r-item" style="--i:0">Price your own contract</p>
                    <h2 class="title r-item" style="--i:1">Name a number that would actually hurt to lose</h2>
                    <p class="lede r-item" style="--i:2">Too small and you'll shrug it off in week two. Too large and you'll talk
                        yourself out of signing at all. The right number is the one you flinch at slightly.</p>

                    <div class="calc plate r-plate" style="--i:3">
                        <div class="calc-left">
                            <div>
                                <span class="mono">Contract parameters</span>
                                <div class="field">
                                    <div class="field-top">
                                        <label class="mono" for="dep" style="color:var(--ink-2)">Deposit</label>
                                        <span class="field-val" id="dep-out">$1,000</span>
                                    </div>
                                    <input type="range" id="dep" min="100" max="10000" step="50" value="1000">
                                    <div class="scale"><span class="mono">$100</span><span class="mono">$10,000</span></div>
                                </div>
                                <div class="field" style="margin-top:30px">
                                    <div class="field-top">
                                        <span class="mono" style="color:var(--ink-2)">Execution window</span>
                                    </div>
                                    <div class="seg" id="seg" role="group" aria-label="Execution window">
                                        <button type="button" data-days="14" aria-pressed="false">14 days</button>
                                        <button type="button" data-days="30" aria-pressed="true">30 days</button>
                                        <button type="button" data-days="60" aria-pressed="false">60 days</button>
                                    </div>
                                </div>
                            </div>

                            <div class="calc-left-foot">
                                <span class="mono">Parameters lock on signature</span>
                            </div>
                        </div>

                        <div class="calc-right">
                            <span class="mono">Settlement outcomes</span>
                            <div class="outcomes">
                                <div class="outcome">
                                    <span class="mono" style="color:var(--win)">If you hit target</span>
                                    <p class="outcome-val" id="o-win">$2,500</p>
                                    <p class="outcome-note">Principal + matching yield</p>
                                </div>
                                <div class="outcome">
                                    <span class="mono" style="color:var(--blood)">If you miss</span>
                                    <p class="outcome-val" id="o-lose">&minus;$1,000</p>
                                    <p class="outcome-note">Forfeited to match pool</p>
                                </div>
                            </div>
                            <dl class="terms">
                                <div class="t-row"><dt>Tier</dt><span class="dots"></span><dd id="t-tier">Stake</dd></div>
                                <div class="t-row"><dt>Return multiple</dt><span class="dots"></span><dd id="t-mult">2.5&times;</dd></div>
                                <div class="t-row"><dt>Net gain on success</dt><span class="dots"></span><dd id="t-net">+$1,500</dd></div>
                                <div class="t-row"><dt>On miss</dt><span class="dots"></span><dd id="t-miss">Full forfeit</dd></div>
                            </dl>
                            <div class="calc-cta">
                                <button class="btn btn-fill" type="button" id="calc-go" onclick="if(window.app && window.app.openAccessModal){ window.app.openAccessModal('signup'); } else { window.router.navigate('/signin'); } return false;">Lock $1,000 for 30 days</button>
                            </div>
                        </div>
                    </div>

                    <div class="tiers" id="tiers">
                        <button type="button" class="tier r-plate" style="--i:4" data-tier="14">
                            <span class="tier-tab">Your selection</span>
                            <span class="mono">Schedule A &middot; All-in</span>
                            <p class="tier-mult">4.0<small>&times;</small></p>
                            <span class="mono">14-day window</span>
                            <dl class="tier-rows">
                                <div class="t-row"><dt>Deposit</dt><span class="dots"></span><dd>$500 &ndash; $10,000</dd></div>
                                <div class="t-row"><dt>On miss</dt><span class="dots"></span><dd>Full forfeit</dd></div>
                            </dl>
                        </button>
                        <button type="button" class="tier r-plate" style="--i:5" data-tier="30" data-active="true">
                            <span class="tier-tab">Your selection</span>
                            <span class="mono">Schedule A &middot; Stake</span>
                            <p class="tier-mult">2.5<small>&times;</small></p>
                            <span class="mono">30-day window</span>
                            <dl class="tier-rows">
                                <div class="t-row"><dt>Deposit</dt><span class="dots"></span><dd>$250 &ndash; $3,000</dd></div>
                                <div class="t-row"><dt>On miss</dt><span class="dots"></span><dd>Full forfeit</dd></div>
                            </dl>
                        </button>
                        <button type="button" class="tier r-plate" style="--i:6" data-tier="60">
                            <span class="tier-tab">Your selection</span>
                            <span class="mono">Schedule A &middot; Pledge</span>
                            <p class="tier-mult">1.5<small>&times;</small></p>
                            <span class="mono">60-day window</span>
                            <dl class="tier-rows">
                                <div class="t-row"><dt>Deposit</dt><span class="dots"></span><dd>$100 &ndash; $1,500</dd></div>
                                <div class="t-row"><dt>On miss</dt><span class="dots"></span><dd>Grace period</dd></div>
                            </dl>
                        </button>
                    </div>

                    <div class="marg r-item" style="--i:7; margin-top:34px">
                        <span class="marg-mark">&sect; 6.2</span>
                        <p>Shorter windows pay more because they are harder, not because we are being generous.
                            Fourteen days is chosen by people who have already started.</p>
                    </div>
                </div>
            </section>

            <!-- ═════ 7 · DUELS ═════ -->
            <section class="section reveal" id="duels">
                <span class="idx-mark" aria-hidden="true">08</span>
                <div class="shell">
                    <p class="eyebrow eyebrow--live r-item" style="--i:0">Live rivalry duels</p>
                    <h2 class="title r-item" style="--i:1">Open right now, and somebody is behind</h2>
                    <p class="lede r-item" style="--i:2">Real capital, real clocks, updated every oracle poll. Open a duel to see
                        the full position.</p>

                    <div class="duels r-plate" style="--i:3">
                        <button class="duel ticks" type="button" onclick="if(window.app && window.app.openAccessModal){ window.app.openAccessModal('login'); } else { window.router.navigate('/signin'); } return false;">
                            <span class="duel-head">
                                <span class="mono">Audience &middot; X API</span>
                                <span class="duel-badge badge-live">Live &middot; 14d left</span>
                            </span>
                            <span class="duel-vs">
                                <span class="duel-side"><span class="duel-handle">@jakevoss</span>
                                    <span class="duel-delta lead">+12.4%</span></span>
                                <span class="duel-mid">VS</span>
                                <span class="duel-side r"><span class="duel-handle">@marcus</span>
                                    <span class="duel-delta trail">+9.2%</span></span>
                            </span>
                            <span class="bar"><span class="a" style="width:57%"></span><span class="g"></span><span class="b"></span></span>
                            <span class="duel-foot">
                                <span>$5,000 pool</span>
                                <span class="duel-cta">View duel <span>&rarr;</span></span>
                            </span>
                        </button>

                        <button class="duel ticks" type="button" onclick="if(window.app && window.app.openAccessModal){ window.app.openAccessModal('login'); } else { window.router.navigate('/signin'); } return false;">
                            <span class="duel-head">
                                <span class="mono">Revenue &middot; Stripe API</span>
                                <span class="duel-badge badge-settle">Settling</span>
                            </span>
                            <span class="duel-vs">
                                <span class="duel-side"><span class="duel-handle">@revpilot</span>
                                    <span class="duel-delta lead">+8.1%</span></span>
                                <span class="duel-mid">VS</span>
                                <span class="duel-side r"><span class="duel-handle">@quotaops</span>
                                    <span class="duel-delta trail">+5.4%</span></span>
                            </span>
                            <span class="bar"><span class="a" style="width:60%"></span><span class="g"></span><span class="b"></span></span>
                            <span class="duel-foot">
                                <span>$2,000 pool</span>
                                <span class="duel-cta">View results <span>&rarr;</span></span>
                            </span>
                        </button>
                    </div>
                </div>
            </section>

                        <!-- ═════ 8 · SIGNATURE ═════ -->
            <section class="section alt reveal" id="manifesto" style="padding-top:0">
                <span class="idx-mark" aria-hidden="true">09</span>
                <div class="shell">
                    <div class="sign plate ticks r-plate">
                        <svg width="70" height="70" viewBox="0 0 76 76" role="img" aria-label="Collateral seal"
                             fill="none" stroke="#7A1C29">
                            <circle cx="38" cy="38" r="35" stroke-width="1"/>
                            <circle cx="38" cy="38" r="30" stroke-width=".6"/>
                            <circle cx="38" cy="38" r="17" stroke-width=".6"/>
                            <g stroke-width=".6" opacity=".7">
                                <path d="M38 8v6M38 62v6M8 38h6M62 38h6M17 17l4 4M55 55l4 4M59 17l-4 4M21 55l-4 4"/>
                            </g>
                            <text x="38" y="43" text-anchor="middle" font-family="Archivo, sans-serif"
                                  font-size="17" font-weight="700" fill="#7A1C29" stroke="none">C</text>
                        </svg>
                        <h2 class="sign-title">Sign it, and the week reorders itself</h2>
                        <p class="sign-copy">You will know within about four days whether you meant it. That is
                            the fastest honest answer anyone has ever given you about your own goal.</p>
                        <button class="btn btn-fill" type="button" onclick="if(window.app && window.app.openAccessModal){ window.app.openAccessModal('signup'); } else { window.router.navigate('/signin'); } return false;">Write a contract</button>
                        <div class="sign-lines">
                            <div class="sign-line">
                                <div class="sign-script" aria-hidden="true">&nbsp;</div>
                                <span class="mono">Counterparty signature</span>
                            </div>
                            <div class="sign-line">
                                <div class="sign-script">Collateral</div>
                                <span class="mono">Custodian, countersigned</span>
                            </div>
                        </div>
                        <p class="disclosure">Deposits are held by a third-party custodian via Stripe Connect and
                            are not held by Collateral. Outcomes are determined solely by read-only telemetry from
                            the connected platform API named in the contract. Matching yield is funded from
                            forfeited deposits and sponsor contributions, is not interest, and is not guaranteed.
                            Collateral is not a broker, dealer, exchange, investment adviser, or deposit
                            institution. Forfeited capital is not recoverable. The settlement feed shows recently
                            settled contracts and may be delayed. Figures shown are book totals as of 24 July 2026.</p>
                    </div>
                </div>
            </section>
        </div>
    `;
}

export function initLanding() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function money(n) {
        return '$' + Math.round(n).toLocaleString('en-US');
    }

    /* ── Motion System (Section Reveal Observers) ── */
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in');
                    revealObserver.unobserve(e.target);

                    // Count up book totals when Section 05 becomes active
                    if (e.target.id === 'record') {
                        const bookTotalEl = document.getElementById('book-total-amt');
                        countUp(bookTotalEl, 8700000, money);
                    }
                }
            });
        }, { threshold: 0.18, rootMargin: '0px 0px -12% 0px' });

        document.querySelectorAll('.reveal').forEach((sec) => {
            const rect = sec.getBoundingClientRect();
            if (reduce || (rect.top < window.innerHeight * 0.85 && rect.bottom > 0)) {
                sec.classList.add('is-in');
                if (sec.id === 'record') {
                    countUp(document.getElementById('book-total-amt'), 8700000, money);
                }
            } else {
                revealObserver.observe(sec);
            }
        });
    } else {
        document.querySelectorAll('.reveal').forEach((sec) => sec.classList.add('is-in'));
    }

    function countUp(el, target, formatFn) {
        if (!el || reduce) {
            if (el) el.textContent = formatFn(target);
            return;
        }
        let start = null;
        const duration = 1500;
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        function step(ts) {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            el.textContent = formatFn(target * easeOutQuart(p));
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    /* ── 1 · Live Hero Tape Engine ── */
    var rowsEl = document.getElementById('rows');
    var escrowEl = document.getElementById('m-escrow');
    var settledEl = document.getElementById('m-settled');
    var countEl = document.getElementById('m-count');
    var clockEl = document.getElementById('clock');

    var SAMPLE_GOALS = [
        { g: '+20% revenue in 30 days',       u: '@revpilot',   p: 'Stripe API',   a: 2000, w: true  },
        { g: '50,000 subscribers in 60 days', u: '@deltacreator', p: 'YouTube API', a: 1000, w: true  },
        { g: '25,000 followers in 30 days',   u: '@marcusk',     p: 'X API',       a: 1500, w: false },
        { g: '$100k ARR in 90 days',          u: '@saasfounder', p: 'Stripe API',   a: 5000, w: true  },
        { g: '10,000 email leads in 30 days', u: '@growthlead',  p: 'Shopify API',  a: 1200, w: true  },
        { g: '100k views on launch video',    u: '@indiehacker', p: 'YouTube API', a: 800,  w: false }
    ];

    var escrow = 8700000;
    var settledToday = 34200;
    var settledCount = 48;
    var rowCounter = 100;
    var pickIndex = 4;

    function paint() {
        if (escrowEl)  escrowEl.textContent  = money(escrow);
        if (settledEl) settledEl.textContent = money(settledToday);
        if (countEl)   countEl.textContent   = settledCount + ' settled today';
    }

    function makeRow(data) {
        rowCounter++;
        var div = document.createElement('div');
        div.className = 'row';
        div.dataset.amt = data.a;
        div.dataset.win = data.w ? '1' : '0';
        div.innerHTML =
            '<div class="row-main">' +
                '<p class="row-goal"><span class="row-id" style="font-family:var(--mono);font-size:10px;opacity:.6;margin-right:8px">№ ' + rowCounter + '</span>' + data.g + '</p>' +
                '<p class="row-src">' + data.u + ' &middot; via ' + data.p + '</p>' +
            '</div>' +
            '<div class="row-right" style="min-width:90px;text-align:right">' +
                '<span class="row-amt">' + money(data.a) + '</span>' +
                '<span class="row-state"><span class="dot-live"></span>Pending</span>' +
            '</div>';
        return div;
    }

    if (rowsEl && rowsEl.children.length === 0) {
        for (var i = 0; i < 4; i++) {
            var item = SAMPLE_GOALS[i % SAMPLE_GOALS.length];
            var r = makeRow(item);
            if (i === 2) {
                r.classList.add('settled', 'won');
                var s = document.createElement('span');
                s.className = 'stamp static won';
                s.textContent = 'Approved';
                r.appendChild(s);
            }
            rowsEl.appendChild(r);
        }
    }

    function pick() {
        var item = SAMPLE_GOALS[pickIndex % SAMPLE_GOALS.length];
        pickIndex++;
        return item;
    }

    function settleTop() {
        if (!rowsEl || rowsEl.children.length === 0) return;
        var firstSettled = rowsEl.querySelector('.row.settled');
        if (firstSettled) {
            firstSettled.classList.add('exiting');
            setTimeout(function(){
                if (firstSettled.parentNode) firstSettled.parentNode.removeChild(firstSettled);
                while (rowsEl.children.length < 4) {
                    rowsEl.appendChild(makeRow(pick()));
                }
                paint();
            }, 420);
            return;
        }

        var row = rowsEl.children[0];
        if (row.classList.contains('settled')) {
            row.classList.add('exiting');
            setTimeout(function(){
                if (row.parentNode) row.parentNode.removeChild(row);
                while (rowsEl.children.length < 4) {
                    rowsEl.appendChild(makeRow(pick()));
                }
                paint();
            }, 420);
            return;
        }

        var amt = +row.dataset.amt, won = row.dataset.win === '1';
        row.classList.add('settled', won ? 'won' : 'lost');
        var stamp = document.createElement('span');
        stamp.className = 'stamp ' + (won ? 'won' : 'lost');
        stamp.textContent = won ? 'Approved' : 'Denied';
        row.appendChild(stamp);
        escrow -= amt;
        settledToday += won ? Math.round(amt * 1.12) : amt;
        if (settledCount < 54) settledCount++;
        paint();
        setTimeout(function(){
            row.classList.add('exiting');
            setTimeout(function(){
                if (row.parentNode) row.parentNode.removeChild(row);
                while (rowsEl.children.length < 4) {
                    rowsEl.appendChild(makeRow(pick()));
                }
                escrow += amt;
                escrow = Math.max(8400000, Math.min(8900000, escrow));
                paint();
            }, 420);
        }, 1500);
    }

    function tickClock(){
        if (!clockEl) return;
        var d = new Date();
        clockEl.textContent = String(d.getHours()).padStart(2,'0') + ':' +
            String(d.getMinutes()).padStart(2,'0') + ':' + String(d.getSeconds()).padStart(2,'0');
    }

    paint();
    tickClock();

    if (window._lpClockInterval) clearInterval(window._lpClockInterval);
    if (window._lpSettleInterval) clearInterval(window._lpSettleInterval);

    window._lpClockInterval = setInterval(tickClock, 1000);
    window._lpSettleInterval = setInterval(settleTop, 4200);
    setTimeout(settleTop, 2400);

    /* ── 2 · Calculator Engine & Tiers Synchronizer ── */
    var depEl = document.getElementById('dep');
    var seg   = document.getElementById('seg');
    var tiers = document.getElementById('tiers');
    var days  = 30;
    var TIERS = {
        14:{name:'All-in', mult:4.0, miss:'Full forfeit'},
        30:{name:'Stake',  mult:2.5, miss:'Full forfeit'},
        60:{name:'Pledge', mult:1.5, miss:'Grace period'}
    };

    function calc(){
        if (!depEl) return;
        var dep = +depEl.value, t = TIERS[days], ret = dep * t.mult;
        const depOut = document.getElementById('dep-out');
        const winOut = document.getElementById('win-out');
        const oWin = document.getElementById('o-win');
        const oLose = document.getElementById('o-lose');
        const tTier = document.getElementById('t-tier');
        const tMult = document.getElementById('t-mult');
        const tNet = document.getElementById('t-net');
        const tMiss = document.getElementById('t-miss');
        const calcGo = document.getElementById('calc-go');

        if (depOut) depOut.textContent = money(dep);
        if (winOut) winOut.textContent = days + 'd';
        if (oWin) oWin.textContent   = money(ret);
        if (oLose) oLose.textContent  = '\u2212' + money(dep);
        if (tTier) tTier.textContent  = t.name;
        if (tMult) tMult.textContent  = t.mult.toFixed(1) + '\u00D7';
        if (tNet) tNet.textContent   = '+' + money(ret - dep);
        if (tMiss) tMiss.textContent  = t.miss;
        if (calcGo) calcGo.textContent = 'Lock ' + money(dep) + ' for ' + days + ' days';
        
        if (tiers) {
            tiers.querySelectorAll('.tier').forEach(function(card){
                card.dataset.active = (+card.dataset.tier === days) ? 'true' : 'false';
            });
        }
    }

    if (depEl) depEl.addEventListener('input', calc);
    if (seg) {
        seg.addEventListener('click', function(e){
            var b = e.target.closest('button[data-days]'); if (!b) return;
            days = +b.dataset.days;
            seg.querySelectorAll('button').forEach(function(x){
                x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
            });
            calc();
        });
    }
    if (tiers) {
        tiers.addEventListener('click', function(e){
            var card = e.target.closest('.tier'); if (!card) return;
            days = +card.dataset.tier;
            if (seg) {
                seg.querySelectorAll('button').forEach(function(x){
                    x.setAttribute('aria-pressed', +x.dataset.days === days ? 'true' : 'false');
                });
            }
            calc();
        });
    }
    calc();

    /* ── 3 · Forfeit Recirculation Flow ── */
    var track   = document.getElementById('track');
    var poolBar = document.getElementById('pool-bar');
    var poolAmt = document.getElementById('pool-amt');
    var winners = document.getElementById('winners') ? document.getElementById('winners').querySelectorAll('.winner') : [];
    var played  = false;

    function runFlow(){
        if (!track || !poolBar || !poolAmt) return;
        track.innerHTML = '';
        poolBar.style.width = '0%';
        poolAmt.textContent = '$0';
        winners.forEach(function(w){ w.classList.remove('paid'); });

        if (!reduce) {
            for (var i = 0; i < 10; i++) (function(i){
                var c = document.createElement('span');
                c.className = 'coin';
                c.style.top = (32 + Math.random()*36) + '%';
                track.appendChild(c);
                setTimeout(function(){ c.classList.add('go'); }, i * 150);
            })(i);
        }

        var delay = reduce ? 0 : 700;
        setTimeout(function(){
            poolBar.style.width = '100%';
            if (reduce) { poolAmt.textContent = money(1500); return; }
            countUp(poolAmt, 1500, money);
        }, delay);

        winners.forEach(function(w, i){
            setTimeout(function(){ w.classList.add('paid'); }, delay + 1300 + i * 260);
        });
    }

    const replayBtn = document.getElementById('replay');
    if (replayBtn) replayBtn.addEventListener('click', runFlow);

    const flowWrap = document.getElementById('flowwrap');
    if (flowWrap && 'IntersectionObserver' in window) {
        new IntersectionObserver(function(entries){
            entries.forEach(function(en){
                if (en.isIntersecting && !played) { played = true; runFlow(); }
            });
        }, {threshold:0.35}).observe(flowWrap);
    } else {
        runFlow();
    }

    /* ── Seal Strike Observer ── */
    var seal = document.querySelector('.sign svg');
    if (seal && 'IntersectionObserver' in window && !reduce) {
        var sealed = false;
        new IntersectionObserver(function(en){
            en.forEach(function(e){
                if (e.isIntersecting && !sealed) { sealed = true; seal.classList.add('strike'); }
            });
        }, {threshold:0.6}).observe(seal);
    }
}

export const initLandingEvents = initLanding;
