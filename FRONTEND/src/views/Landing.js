// Landing Page — Collateral Financial Document System with Paper Grain & Scoped Styling
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
        <div class="lp cl-root">
            <div class="cl-grain" aria-hidden="true"></div>

            <!-- ═════ TOP BURGUNDY BANNER ═════ -->
            <div class="top-banner">
                <span class="promo-text">LAUNCH OFFER &mdash; FIRST CONTRACT MATCH UP TO $250</span>
            </div>

            <!-- ═════ NAV ═════ -->
            <header class="nav">
                <div class="nav-in">
                    <div class="nav-left">
                        <a class="wordmark rise" style="--d:40ms" href="/" onclick="window.router.navigate('/'); return false;">COLLATERAL</a>
                        <div class="nav-divider"></div>
                        <div class="nav-tape">
                            <span class="dot"></span>
                            <span class="mono" id="nav-escrow">$8,754,010 IN ESCROW</span>
                        </div>
                    </div>
                    <div class="nav-right">
                        <button class="btn btn-fill nav-btn" type="button" onclick="if(window.app && window.app.openAccessModal){ window.app.openAccessModal('login'); } else { window.router.navigate('/signin'); } return false;">SIGN IN</button>
                    </div>
                </div>
            </header>

            <!-- ═════ 1 · HERO + LIVE TAPE ═════ -->
            <section class="hero section">
                <span class="idx-mark" aria-hidden="true">01</span>
                <div class="shell hero-grid">
                    <div>
                        <h1 class="h1"><span class="rise" style="--d:120ms;display:block">Put your money</span><span class="rise" style="--d:210ms;display:block">behind your <span class="em">word.</span></span></h1>
                        <p class="hero-copy rise" style="--d:330ms">Everyone means it when they say it. The problem is that quitting is
                            free, so the deadline slides and nothing arrives to mark it. Collateral puts your own
                            money on the line and hands the decision to an API that doesn't care how your week went.</p>
                        <div class="hero-actions rise" style="--d:410ms">
                            <button class="btn btn-fill" type="button" onclick="if(window.app && window.app.openAccessModal){ window.app.openAccessModal('signup'); } else { window.router.navigate('/signin'); } return false;">Write a contract</button>
                            <a class="btn btn-out" href="#terms">Name your number</a>
                        </div>
                        <div class="oracles">
                            <span class="rule-top" style="--d:480ms"></span>
                            <span class="mono rise" style="--d:540ms">Settles on</span>
                            <a class="mono rise" style="--d:570ms" href="#oracles">Stripe</a>
                            <a class="mono rise" style="--d:600ms" href="#oracles">X</a>
                            <a class="mono rise" style="--d:630ms" href="#oracles">YouTube</a>
                            <a class="mono rise" style="--d:660ms" href="#oracles">Shopify</a>
                        </div>
                    </div>

                    <div class="tape seat ticks" style="--d:260ms">
                        <div class="tape-head">
                            <span class="dot pulse"></span>
                            <span class="mono">Recently settled &middot; oracle feed</span>
                            <span class="mono" style="margin-left:auto" id="clock">--:--:--</span>
                        </div>
                        <div class="tape-meters">
                            <div class="meter">
                                <span class="mono">Held in escrow</span>
                                <span class="meter-val blood" id="m-escrow">$0</span>
                            </div>
                            <div class="meter-div"></div>
                            <div class="meter">
                                <span class="mono">Settled today</span>
                                <span class="meter-val win" id="m-settled">$0</span>
                            </div>
                        </div>
                        <div class="tape-rows" id="rows"></div>
                        <div class="tape-foot">
                            <span class="mono">Custody &middot; Stripe Connect</span>
                            <span class="mono" id="m-count">0 settled</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ═════ 2 · MODES ═════ -->
            <section class="section alt" id="modes">
                <span class="idx-mark" aria-hidden="true">02</span>
                <div class="shell">
                    <p class="eyebrow">Contract execution modes</p>
                    <h2 class="title">Two ways to make quitting expensive</h2>
                    <p class="lede">Stake against your own record, or against somebody who wants it as badly as
                        you claim to. Both settle the same way, and neither asks your opinion.</p>

                    <div class="modes">
                        <div class="plates plate ticks">
                            <article class="leaf">
                                <div class="leaf-art">
                                    <svg viewBox="0 0 360 150" role="img" aria-label="Engraving: a hand pressing a coin into still water">
                                        <g fill="none" stroke="#131A2B" stroke-width=".7" stroke-linecap="round">
                                            <ellipse cx="180" cy="118" rx="110" ry="15" opacity=".28"/>
                                            <ellipse cx="180" cy="118" rx="84" ry="11" opacity=".42"/>
                                            <ellipse cx="180" cy="118" rx="58" ry="8" opacity=".58"/>
                                            <ellipse cx="180" cy="118" rx="32" ry="4.6" opacity=".78"/>
                                            <circle cx="180" cy="102" r="15"/><circle cx="180" cy="102" r="10.5" opacity=".55"/>
                                            <path d="M174 102h12M180 96v12" opacity=".55"/>
                                            <path d="M167 70c0-14 5-25 11-28 5-2 8 3 7 10l-3 20"/>
                                            <path d="M183 72l4-22c1-7 5-10 9-8 5 2 6 7 5 14l-4 18"/>
                                            <path d="M197 74l5-17c2-6 5-8 9-6 4 2 4 7 3 13l-4 13"/>
                                            <path d="M210 79l4-12c2-5 5-6 8-4 3 2 3 6 2 10l-3 9"/>
                                            <path d="M167 70c-8 4-12 11-10 19 3 11 12 17 24 17h20c14 0 21-7 23-18l2-10"/>
                                            <g opacity=".26"><path d="M172 50v13M178 45v17M185 48v13M192 54v11M199 58v8"/></g>
                                        </g>
                                    </svg>
                                </div>
                                <span class="mono mono-b">Mode 01 &middot; Solo</span>
                                <h3 class="leaf-name">The only opponent is the version of you who quits</h3>
                                <ul class="leaf-list">
                                    <li>You set the target. You don't get to move it</li>
                                    <li>Hit it and every dollar comes back, plus yield</li>
                                    <li>Miss it and the money goes to someone who didn't</li>
                                </ul>
                                <a class="link" href="/signin" onclick="window.router.navigate('/signin'); return false;">Write a solo contract &rarr;</a>
                            </article>

                            <div class="vrule" aria-hidden="true"></div>

                            <article class="leaf leaf--dark">
                                <div class="leaf-art">
                                    <svg viewBox="0 0 360 150" role="img" aria-label="Engraving: two hands pressing a single coin from opposite sides">
                                        <g fill="none" stroke="#F6EEEA" stroke-width=".7" stroke-linecap="round">
                                            <ellipse cx="180" cy="118" rx="110" ry="15" opacity=".26"/>
                                            <ellipse cx="180" cy="118" rx="84" ry="11" opacity=".38"/>
                                            <ellipse cx="180" cy="118" rx="58" ry="8" opacity=".52"/>
                                            <circle cx="180" cy="102" r="15"/><circle cx="180" cy="102" r="10.5" opacity=".55"/>
                                            <path d="M174 102h12M180 96v12" opacity=".55"/>
                                            <path d="M136 72c-2-14 2-26 8-30 5-3 9 2 9 9l-1 20"/>
                                            <path d="M152 72l2-23c1-7 5-10 9-8 5 2 6 7 5 14l-3 18"/>
                                            <path d="M136 72c-8 5-11 12-8 20 4 10 12 16 23 16h18"/>
                                            <path d="M224 72c2-14-2-26-8-30-5-3-9 2-9 9l1 20"/>
                                            <path d="M208 72l-2-23c-1-7-5-10-9-8-5 2-6 7-5 14l3 18"/>
                                            <path d="M224 72c8 5 11 12 8 20-4 10-12 16-23 16h-18"/>
                                            <g opacity=".24"><path d="M143 52v12M150 46v16M210 46v16M217 52v12"/></g>
                                        </g>
                                    </svg>
                                </div>
                                <span class="mono">Mode 02 &middot; Rivalry</span>
                                <h3 class="leaf-name">Someone else is counting on you to fail</h3>
                                <ul class="leaf-list">
                                    <li>Equal capital, same metric, same clock</li>
                                    <li>One oracle decides. Neither of you gets a vote</li>
                                    <li>The winner takes the escrow. There is no draw</li>
                                </ul>
                                <a class="link" href="/signin" onclick="window.router.navigate('/signin'); return false;">Find a counterparty &rarr;</a>
                            </article>
                        </div>

                        <aside class="demo plate-quiet ticks">
                            <div class="demo-top">
                                <span class="mono">Specimen</span>
                                <span class="mono">Solo contract</span>
                            </div>
                            <p class="demo-you">You</p>
                            <p class="demo-vs">VS</p>
                            <p class="demo-you">You</p>
                            <p class="demo-amt">$1,000</p>
                            <p class="mono">Locked by you, against you</p>
                            <p class="demo-foot">No opponent to blame. That is the entire feature.</p>
                        </aside>
                    </div>
                </div>
            </section>

            <!-- ═════ 3 · CASE ═════ -->
            <section class="section" id="case">
                <span class="idx-mark" aria-hidden="true">03</span>
                <div class="shell argue">
                    <div>
                        <p class="eyebrow">Why it works</p>
                        <h2 class="title">A plan without stakes is just a comfortable wish</h2>
                        <p class="lede" style="margin-top:18px">You already know what the next step is. You've
                            known for months. What you don't have is a reason it has to happen this week instead of
                            some other week, because missing it costs a feeling, and feelings are cheap enough to
                            absorb forever.</p>
                        <aside class="argue-note">
                            <span class="mono mono-b">Clerk's note</span>
                            <p>The median contract is opened at 11:40pm on a Sunday. We have theories about why,
                                and none of them are flattering.</p>
                        </aside>
                    </div>

                    <table class="cmp plate-quiet ticks">
                        <caption>Same goal, recorded two ways</caption>
                        <thead>
                            <tr><th scope="col">Wk</th><th scope="col">Without stakes</th><th scope="col">Under contract</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>01</td><td class="void">Announce the goal</td><td>Lock the deposit</td></tr>
                            <tr><td>02</td><td class="void">Something urgent comes up</td><td>Something urgent comes up anyway</td></tr>
                            <tr><td>03</td><td class="void">Move the deadline, quietly</td><td>The deadline does not move</td></tr>
                            <tr><td>04</td><td class="void">Decide it wasn't the right time</td><td>Ship it at 2am, badly, on time</td></tr>
                            <tr><td>&mdash;</td><td class="void">Nothing was at risk, so nothing changed</td>
                                <td class="won-txt">Money back. And the thing exists.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ═════ 3b · ORACLE REGISTER ═════ -->
            <section class="section" id="oracles" style="padding-top:0">
                <span class="idx-mark" aria-hidden="true">04</span>
                <div class="shell">
                    <p class="eyebrow">Verification sources</p>
                    <h2 class="title">Four APIs decide every contract</h2>
                    <p class="lede">Collateral does not score you. It reads the same numbers your platform
                        already reports, on a fixed schedule, and settles on whatever it finds there.</p>

                    <table class="reg plate ticks">
                        <caption>Register of accepted oracles &middot; read-only scopes</caption>
                        <thead>
                            <tr>
                                <th scope="col">Platform</th>
                                <th scope="col">Metrics read</th>
                                <th scope="col">Poll cadence</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="reg-name">
                                        <span class="reg-mark" aria-hidden="true">S</span>
                                        <span class="reg-plat">Stripe</span>
                                    </span>
                                </td>
                                <td data-label="Reads">Net revenue, MRR, order volume</td>
                                <td data-label="Cadence"><span class="reg-num">Every 6h</span></td>
                                <td data-label="Status"><span class="reg-live"><span class="dot"></span>Live</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="reg-name">
                                        <span class="reg-mark" aria-hidden="true">X</span>
                                        <span class="reg-plat">X</span>
                                    </span>
                                </td>
                                <td data-label="Reads">Followers, impressions, post reach</td>
                                <td data-label="Cadence"><span class="reg-num">Every 1h</span></td>
                                <td data-label="Status"><span class="reg-live"><span class="dot"></span>Live</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="reg-name">
                                        <span class="reg-mark" aria-hidden="true">Y</span>
                                        <span class="reg-plat">YouTube</span>
                                    </span>
                                </td>
                                <td data-label="Reads">Subscribers, views, watch time</td>
                                <td data-label="Cadence"><span class="reg-num">Every 12h</span></td>
                                <td data-label="Status"><span class="reg-live"><span class="dot"></span>Live</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="reg-name">
                                        <span class="reg-mark" aria-hidden="true">Sh</span>
                                        <span class="reg-plat">Shopify</span>
                                    </span>
                                </td>
                                <td data-label="Reads">Orders, revenue, average order value</td>
                                <td data-label="Cadence"><span class="reg-num">Every 6h</span></td>
                                <td data-label="Status"><span class="reg-live"><span class="dot"></span>Live</span></td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="marg" style="margin-top:30px">
                        <span class="marg-mark">§ 3.4</span>
                        <p>Read-only scopes only. Collateral cannot post, message, refund, or change a single
                            setting on any account you connect, and the token can be revoked from your side at any
                            time without affecting an open contract's settlement.</p>
                    </div>
                </div>
            </section>

            <!-- ═════ 4 · RECORD ═════ -->
            <section class="section alt" id="record">
                <span class="idx-mark" aria-hidden="true">05</span>
                <div class="shell">
                    <p class="eyebrow">Settlement record</p>
                    <h2 class="title">The receipts, including the ones that hurt</h2>
                    <p class="lede">Most sites show you the wins. Every contract here settles on the same
                        telemetry whether it went well or not, and we publish both, because a record with no
                        losses in it isn't a record.</p>

                    <div class="receipts">
                        <article class="receipt ticks">
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

                        <article class="receipt ticks">
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

                        <article class="receipt ticks">
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

                    <div class="footing">
                        <p class="mono" style="margin:0 0 6px">Book totals &middot; inception to date</p>
                        <dl style="margin:0">
                            <div class="f-row"><dt>Contracts won</dt><span class="dots"></span><dd>74%</dd></div>
                            <div class="f-row"><dt>Verified counterparties</dt><span class="dots"></span><dd>812</dd></div>
                            <div class="f-row"><dt>Average time to target</dt><span class="dots"></span><dd>18 days</dd></div>
                            <div class="f-row f-total"><dt>Total capital settled</dt><span class="dots"></span><dd>$8,700,000</dd></div>
                        </dl>
                    </div>

                    <div class="cp">
                        <figure class="cp-portrait plate ticks" style="margin:0">
                            <svg viewBox="0 0 200 236" role="img" aria-label="Engraved portrait of Marcus Kade">
                                <defs>
                                    <clipPath id="cp-oval"><ellipse cx="100" cy="112" rx="76" ry="94"/></clipPath>
                                </defs>
                                <ellipse cx="100" cy="112" rx="76" ry="94" fill="#EFEAE0"/>
                                <g clip-path="url(#cp-oval)" fill="none" stroke="#0E1420" stroke-width=".65" stroke-linecap="round">
                                    <g opacity=".26">
                                        <path d="M24 40h152M24 54h152M24 68h152M24 82h152M24 96h152M24 110h152M24 124h152M24 138h152M24 152h152M24 166h152M24 180h152M24 194h152"/>
                                    </g>
                                    <path d="M100 44c-21 0-34 15-34 36 0 13 3 22 8 30"/>
                                    <path d="M100 44c21 0 34 15 34 36 0 13-3 22-8 30"/>
                                    <path d="M74 110c4 12 13 21 26 21s22-9 26-21"/>
                                    <path d="M78 86c5-3 12-3 16 0M106 86c4-3 11-3 16 0"/>
                                    <path d="M96 96l-3 14h9"/>
                                    <path d="M88 120c7 4 17 4 24 0"/>
                                    <path d="M66 74c2-20 15-32 34-32s32 12 34 32"/>
                                    <path d="M74 131l-22 12c-14 8-22 22-24 38l-4 25h152l-4-25c-2-16-10-30-24-38l-22-12"/>
                                    <path d="M100 143l-9 18 9 10 9-10z"/>
                                    <g opacity=".5">
                                        <path d="M52 150c-8 8-13 19-15 31M148 150c8 8 13 19 15 31"/>
                                        <path d="M70 62c8-6 20-8 30-8s22 2 30 8"/>
                                    </g>
                                </g>
                                <ellipse cx="100" cy="112" rx="76" ry="94" fill="none" stroke="#0E1420" stroke-width="1"/>
                                <ellipse cx="100" cy="112" rx="70" ry="88" fill="none" stroke="#7A1C29" stroke-width=".5" opacity=".55"/>
                            </svg>
                            <figcaption class="cp-cap">
                                <span class="mono">Counterparty № 0417</span>
                            </figcaption>
                        </figure>

                        <div>
                            <span class="mono mono-b">On the record</span>
                            <blockquote class="cp-quote" style="margin-top:14px">
                                &ldquo;I'd missed that same follower target three times before, and it cost me
                                <em>nothing</em> every time. Missed it once here and it cost me fifteen hundred
                                dollars. I have not missed one since.&rdquo;
                            </blockquote>
                            <div class="cp-attrib">
                                <span class="cp-name">Marcus Kade</span>
                                <span class="mono">@marcusk &middot; 4 contracts &middot; 3 won</span>
                            </div>

                            <div class="cp-receipt">
                                <span class="mono" style="color:var(--blood)">№ C&ndash;780B</span>
                                <span class="amt">&minus;$1,500.00</span>
                                <span class="mono">Forfeited 02 Mar 2026</span>
                                <span class="cp-stamp">Denied</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ═════ 5 · FORFEIT FLOW + SCHEMATIC ═════ -->
            <section class="section" id="flow">
                <span class="idx-mark" aria-hidden="true">06</span>
                <div class="shell">
                    <p class="eyebrow">Where forfeited money goes</p>
                    <h2 class="title">Losers pay winners. That is the whole engine.</h2>
                    <p class="lede">Marcus's fifteen hundred dollars did not vanish into a house account. Watch
                        where it actually went, then read the full path underneath.</p>

                    <div class="flow-wrap plate ticks" id="flowwrap">
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

                    <div class="marg marg-strip" style="margin-top:34px">
                        <span class="marg-mark">§ 4.1</span>
                        <p>We take half a percent and nothing else. There is no spread, no rake on the match
                            pool, and no scenario in which Collateral profits more when you miss.</p>
                    </div>

                    <div class="sch plate-quiet ticks" style="margin-top:34px">
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
                                <text x="34" y="172">INPUT</text><text x="304" y="172">CUSTODY</text><text x="574" y="172">VERIFICATION</text>
                            </g>
                            <g font-family="Archivo, sans-serif" font-size="14" font-weight="600" fill="#0E1420">
                                <text x="34" y="197">Deposit in</text><text x="304" y="197">Escrow vault</text><text x="574" y="197">Oracle API stream</text>
                            </g>
                            <g font-family="IBM Plex Mono, monospace" font-size="14" fill="#7A1C29">
                                <text x="34" y="221">$8,700,000</text><text x="304" y="221">$8.7M locked</text><text x="574" y="221">96.2% hit rate</text>
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
                            <path d="M960 235 L960 372 L380 372 L380 240" fill="none" stroke="#7A1C29"
                                  stroke-width="1" stroke-dasharray="5 4" marker-end="url(#cl-ar)"/>
                            <text x="670" y="366" font-family="IBM Plex Mono, monospace" font-size="10"
                                  letter-spacing="1.6" fill="#7A1C29" text-anchor="middle">FORFEITED DEPOSITS RECIRCULATE TO ESCROW VAULT</text>
                            <g stroke="#6E7686" stroke-width=".6"><path d="M20 268 v10 M200 268 v10 M20 273 h180"/></g>
                            <text x="110" y="290" font-family="IBM Plex Mono, monospace" font-size="9.5"
                                  letter-spacing="1.4" fill="#6E7686" text-anchor="middle">STRIPE CONNECT CUSTODY</text>
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
            <section class="section alt" id="terms">
                <span class="idx-mark" aria-hidden="true">07</span>
                <div class="shell">
                    <p class="eyebrow">Price your own contract</p>
                    <h2 class="title">Name a number that would actually hurt to lose</h2>
                    <p class="lede">Too small and you'll shrug it off in week two. Too large and you'll talk
                        yourself out of signing at all. The right number is the one you flinch at slightly.</p>

                    <div class="calc plate ticks">
                        <div class="calc-left">
                            <span class="mono">Contract parameters</span>
                            <div class="field">
                                <div class="field-top">
                                    <label class="mono" for="dep" style="color:var(--ink-2)">Deposit</label>
                                    <span class="field-val" id="dep-out">$1,000</span>
                                </div>
                                <input type="range" id="dep" min="100" max="10000" step="50" value="1000">
                                <div class="scale"><span class="mono">$100</span><span class="mono">$10,000</span></div>
                            </div>
                            <div class="field">
                                <div class="field-top">
                                    <span class="mono" style="color:var(--ink-2)">Execution window</span>
                                    <span class="field-val" id="win-out">30d</span>
                                </div>
                                <div class="seg" id="seg" role="group" aria-label="Execution window">
                                    <button type="button" data-days="14" aria-pressed="false">14 days</button>
                                    <button type="button" data-days="30" aria-pressed="true">30 days</button>
                                    <button type="button" data-days="60" aria-pressed="false">60 days</button>
                                </div>
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
                        <button type="button" class="tier ticks" data-tier="60">
                            <span class="tier-tab">Your selection</span>
                            <span class="mono">Schedule A &middot; Pledge</span>
                            <p class="tier-mult">1.5<small>&times;</small></p>
                            <span class="mono">60-day window</span>
                            <dl class="tier-rows">
                                <div class="t-row"><dt>Deposit</dt><span class="dots"></span><dd>$100 &ndash; $1,500</dd></div>
                                <div class="t-row"><dt>On miss</dt><span class="dots"></span><dd>Grace period</dd></div>
                            </dl>
                        </button>
                        <button type="button" class="tier ticks" data-tier="30" data-active="true">
                            <span class="tier-tab">Your selection</span>
                            <span class="mono">Schedule A &middot; Stake</span>
                            <p class="tier-mult">2.5<small>&times;</small></p>
                            <span class="mono">30-day window</span>
                            <dl class="tier-rows">
                                <div class="t-row"><dt>Deposit</dt><span class="dots"></span><dd>$250 &ndash; $3,000</dd></div>
                                <div class="t-row"><dt>On miss</dt><span class="dots"></span><dd>Full forfeit</dd></div>
                            </dl>
                        </button>
                        <button type="button" class="tier ticks" data-tier="14">
                            <span class="tier-tab">Your selection</span>
                            <span class="mono">Schedule A &middot; All-in</span>
                            <p class="tier-mult">4.0<small>&times;</small></p>
                            <span class="mono">14-day window</span>
                            <dl class="tier-rows">
                                <div class="t-row"><dt>Deposit</dt><span class="dots"></span><dd>$500 &ndash; $10,000</dd></div>
                                <div class="t-row"><dt>On miss</dt><span class="dots"></span><dd>Full forfeit</dd></div>
                            </dl>
                        </button>
                    </div>

                    <div class="marg" style="margin-top:34px">
                        <span class="marg-mark">§ 6.2</span>
                        <p>Shorter windows pay more because they are harder, not because we are being generous.
                            Fourteen days is chosen by people who have already started.</p>
                    </div>
                </div>
            </section>

            <!-- ═════ 7 · DUELS ═════ -->
            <section class="section" id="duels">
                <span class="idx-mark" aria-hidden="true">08</span>
                <div class="shell">
                    <p class="eyebrow eyebrow--live">Live rivalry duels</p>
                    <h2 class="title">Open right now, and somebody is behind</h2>
                    <p class="lede">Real capital, real clocks, updated every oracle poll. Open a duel to see
                        the full position.</p>

                    <div class="duels">
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
            <section class="section alt" style="padding-top:0">
                <span class="idx-mark" aria-hidden="true">09</span>
                <div class="shell">
                    <div class="sign plate ticks">
                        <svg width="70" height="70" viewBox="0 0 76 76" role="img" aria-label="Collateral seal"
                             style="margin:0 auto" fill="none" stroke="#7A1C29">
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
                            <div class="sign-line"><p class="sign-script">&nbsp;</p><span class="mono">Counterparty signature</span></div>
                            <div class="sign-line"><p class="sign-script">Collateral</p><span class="mono">Custodian, countersigned</span></div>
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
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const money = function(n){ return '$' + Math.round(n).toLocaleString('en-US'); };

    /* ── First Paint entrance classes ── */
    document.documentElement.classList.add('js-load');
    document.body.classList.add('js-load');

    /* ── Smooth Anchor Navigation ── */
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

    /* ── 1 · Settlement Tape Feed Engine ── */
    const BOOK = [
        {goal:'+20% revenue in 30 days',     src:'@revpilot \u00B7 Stripe',      amt:2000, win:true},
        {goal:'25,000 followers in 30 days', src:'@marcusk \u00B7 X API',        amt:1500, win:false},
        {goal:'50,000 subs in 60 days',      src:'@deltacreator \u00B7 YouTube', amt:1000, win:true},
        {goal:'+15% orders in 30 days',      src:'@shopfern \u00B7 Shopify',     amt:2500, win:true},
        {goal:'10,000 followers in 14 days', src:'@northloop \u00B7 X API',      amt:800,  win:false},
        {goal:'+30% MRR in 60 days',         src:'@quietbuild \u00B7 Stripe',    amt:3000, win:true},
        {goal:'5,000 subs in 30 days',       src:'@harborco \u00B7 YouTube',     amt:1200, win:true},
        {goal:'+8% AOV in 30 days',          src:'@basketcase \u00B7 Shopify',   amt:900,  win:false},
        {goal:'40,000 followers in 60 days', src:'@mileshaus \u00B7 X API',      amt:1800, win:true}
    ];

    const rowsEl   = document.getElementById('rows');
    const escrowEl = document.getElementById('m-escrow');
    const settleEl = document.getElementById('m-settled');
    const countEl  = document.getElementById('m-count');
    const navEl    = document.getElementById('nav-escrow');
    const clockEl  = document.getElementById('clock');

    let escrow = 8700000, settledToday = 0, settledCount = 0, cursor = 0;

    function pick(){ var c = BOOK[cursor % BOOK.length]; cursor++; return c; }

    function makeRow(c){
        var el = document.createElement('div');
        el.className = 'row';
        el.dataset.amt = c.amt;
        el.dataset.win = c.win ? '1' : '0';
        el.innerHTML =
            '<div class="row-main"><p class="row-goal"></p><p class="row-src"></p>' +
            '<div class="bar-mini"><i style="width:' + (28 + Math.random()*46).toFixed(0) + '%"></i></div></div>' +
            '<div class="row-right"><span class="row-amt"></span><span class="row-state">Pending</span></div>';
        el.querySelector('.row-goal').textContent = c.goal;
        el.querySelector('.row-src').textContent  = c.src;
        el.querySelector('.row-amt').textContent  = money(c.amt);
        return el;
    }

    if (rowsEl) {
        rowsEl.innerHTML = '';
        for (var i = 0; i < 4; i++) {
            var r = makeRow(pick());
            if (!reduce) { r.classList.add('rise'); r.style.setProperty('--d', (560 + i*90) + 'ms'); }
            rowsEl.appendChild(r);
        }
    }

    function paint(){
        if (escrowEl) escrowEl.textContent = money(escrow);
        if (settleEl) settleEl.textContent = money(settledToday);
        if (countEl) countEl.textContent  = settledCount + ' settled';
        if (navEl) navEl.textContent = money(escrow) + ' in escrow';
    }

    function settleTop(){
        if (!rowsEl) return;
        var row = rowsEl.firstElementChild;
        if (!row) return;
        var amt = +row.dataset.amt, won = row.dataset.win === '1';
        row.classList.add('settled', won ? 'won' : 'lost');
        var fill = row.querySelector('.bar-mini i');
        if (fill) fill.style.width = won ? '100%' : '62%';
        var stamp = document.createElement('span');
        stamp.className = 'stamp ' + (won ? 'won' : 'lost');
        stamp.textContent = won ? 'Approved' : 'Denied';
        row.appendChild(stamp);
        escrow -= amt;
        settledToday += won ? Math.round(amt * 1.12) : amt;
        settledCount++;
        paint();
        setTimeout(function(){
            row.classList.add('exiting');
            setTimeout(function(){
                if (row.parentNode) row.parentNode.removeChild(row);
                rowsEl.appendChild(makeRow(pick()));
                escrow += 1200 + Math.round(Math.random()*2400);
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
            var start = null;
            (function step(ts){
                if (!start) start = ts;
                var p = Math.min((ts - start) / 1400, 1);
                poolAmt.textContent = money(1500 * p);
                if (p < 1) requestAnimationFrame(step);
            })(performance.now());
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
