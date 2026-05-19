// Landing Page — /go — Matches homepage design system exactly
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

export function renderLanding() {
    return `
        <style>${landingCSS}</style>
        <div class="lp">
            <div class="lp-grid"></div>
            <div class="lp-noise"></div>

            <!-- NAV -->
            <nav class="lp-nav">
                <div class="lp-nav-in">
                    <a class="lp-nav-brand" href="/">COLLATERAL</a>
                    <button class="lp-nav-cta" id="lp-nav-cta">Connect</button>
                </div>
            </nav>

            <!-- ═══ HERO ═══ -->
            <div class="lp-w">
                <div class="lp-hero" data-reveal>
                    <h1 class="lp-h1">
                        MAKE YOUR GOALS<br>
                        <em>EXPENSIVE TO MISS.</em>
                    </h1>

                    <div class="lp-hero-body">
                        <div class="lp-gold-hook">
                            Earn up to <span>2.5x</span> when you hit your target — funded by those who don't.
                        </div>

                        <p class="lp-hero-sub">
                            Stake money on a measurable goal. Connect Stripe, X, Shopify, or Amazon.
                            Hit it, your stake is returned plus a bonus. Miss it, it's forfeit. Verified automatically.
                        </p>

                        <p class="lp-hero-detail">
                            Lock $500 against revenue growth or gaining followers — verified via read-only API.
                        </p>

                        <div class="lp-ctas">
                            <button class="lp-cta-red" id="lp-hero-cta">
                                <span>Execute Contract</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </button>
                            <a class="lp-cta-ghost" href="#how">How It Works</a>
                        </div>
                        <div class="lp-hero-micro">Free account. Lock capital only when you're ready.</div>
                    </div>
                </div>
            </div>

            <!-- PROOF STRIP -->
            <div class="lp-proof-strip">
                <div class="lp-proof-in">
                    <div class="lp-proof-dot"></div>
                    <span class="lp-mono">Not gambling. You stake against <strong style="color:var(--t1)">your own performance</strong> — no chance, no opponent.</span>
                    <div class="lp-proof-sep"></div>
                    <span class="lp-mono">Stripe · X · Shopify · Amazon</span>
                </div>
            </div>

            <!-- ═══ HOW IT WORKS ═══ -->
            <div class="lp-w" id="how">
                <div class="lp-section" data-reveal>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
                        <div style="width:32px;height:2px;background:var(--red)"></div>
                        <span class="lp-mono">How It Works</span>
                    </div>
                    <h2 style="font-family:'Inter Tight',sans-serif;font-size:clamp(28px,4vw,40px);font-weight:400;letter-spacing:-.5px;margin-bottom:8px">
                        Four steps to <strong>settlement.</strong>
                    </h2>
                    <p style="font-size:13px;color:var(--t2);margin-bottom:48px;max-width:480px">
                        Every contract follows the same deterministic lifecycle. No human intervention. No exceptions.
                    </p>

                    <div style="background:var(--panel);border:1px solid var(--div);border-radius:2px;overflow:hidden">
                        <div class="lp-steps" style="padding:48px 32px">
                            <div class="lp-step">
                                <div style="font-family:'Inter Tight',sans-serif;font-size:56px;font-weight:700;color:rgba(14,14,17,.06);line-height:1;margin-bottom:12px">01</div>
                                <div class="lp-step-h">Commit</div>
                                <div class="lp-step-p">Stake capital against specific, measurable performance targets. Define the metric, set the threshold, lock the funds.</div>
                            </div>
                            <div class="lp-step">
                                <div style="font-family:'Inter Tight',sans-serif;font-size:56px;font-weight:700;color:rgba(14,14,17,.06);line-height:1;margin-bottom:12px">02</div>
                                <div class="lp-step-h">Monitor</div>
                                <div class="lp-step-p">Metrics are tracked in real-time through verified data adapters connected to authoritative sources.</div>
                            </div>
                            <div class="lp-step">
                                <div style="font-family:'Inter Tight',sans-serif;font-size:56px;font-weight:700;color:rgba(14,14,17,.06);line-height:1;margin-bottom:12px">03</div>
                                <div class="lp-step-h">Verify</div>
                                <div class="lp-step-p">Automated oracle verification at the deadline. Deterministic. Transparent. No appeals process.</div>
                            </div>
                            <div class="lp-step">
                                <div style="font-family:'Inter Tight',sans-serif;font-size:56px;font-weight:700;color:rgba(14,14,17,.06);line-height:1;margin-bottom:12px">04</div>
                                <div class="lp-step-h">Settle</div>
                                <div class="lp-step-p">Variance is calculated against the target. Capital is released to the system or returned to the staker.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lp-w"><div class="lp-hr"></div></div>

            <!-- ═══ RISK ARCHITECTURE ═══ -->
            <div class="lp-w">
                <div class="lp-section" data-reveal>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
                        <div style="width:32px;height:2px;background:var(--red)"></div>
                        <span class="lp-mono">Risk Architecture</span>
                    </div>
                    <h2 style="font-family:'Inter Tight',sans-serif;font-size:clamp(28px,4vw,40px);font-weight:400;letter-spacing:-.5px;margin-bottom:8px">
                        Three tiers. One <strong>protocol.</strong>
                    </h2>
                    <p style="font-size:13px;color:var(--t2);margin-bottom:48px;max-width:520px">
                        Every contract is governed by the same tier system. Higher tiers demand harder targets, shorter windows, and bigger stakes. The difficulty is algorithmic, not arbitrary.
                    </p>

                    <div class="lp-cards">
                        <div class="lp-card">
                            <span style="font-family:'Inter',monospace;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--green);margin-bottom:12px;display:block">Pledge</span>
                            <div style="font-family:'Inter Tight',sans-serif;font-size:40px;font-weight:700;letter-spacing:-1px;margin-bottom:4px">1.5x</div>
                            <div class="lp-mono" style="margin-bottom:20px">Peak Multiplier</div>
                            <div class="c-row"><span class="k">Stake Range</span><span class="v">$100 – $1,500</span></div>
                            <div class="c-row"><span class="k">Duration</span><span class="v">7 – 30 days</span></div>
                            <div class="c-row"><span class="k">Growth Target</span><span class="v">15% – 50%</span></div>
                            <p style="font-size:12px;color:var(--t2);margin-top:16px;line-height:1.5;font-style:italic">Achievable targets for proven operators. Start here.</p>
                        </div>
                        <div class="lp-card" style="border:2px solid var(--t1);background:#FBFBFA">
                            <span style="font-family:'Inter',monospace;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--green);margin-bottom:12px;display:block">Stake</span>
                            <div style="font-family:'Inter Tight',sans-serif;font-size:40px;font-weight:700;letter-spacing:-1px;margin-bottom:4px">2.5x</div>
                            <div class="lp-mono" style="margin-bottom:20px">Peak Multiplier</div>
                            <div class="c-row"><span class="k">Stake Range</span><span class="v">$250 – $3,000</span></div>
                            <div class="c-row"><span class="k">Duration</span><span class="v">7 – 21 days</span></div>
                            <div class="c-row"><span class="k">Growth Target</span><span class="v">35% – 100%</span></div>
                            <p style="font-size:12px;color:var(--t2);margin-top:16px;line-height:1.5;font-style:italic">Compressed timelines. Steeper scaling. Serious capital.</p>
                            <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--div);display:flex;align-items:center;gap:8px">
                                <div style="width:6px;height:6px;background:var(--t1);border-radius:50%"></div>
                                <span class="lp-mono" style="color:var(--t1);font-weight:600">Most Popular</span>
                            </div>
                        </div>
                        <div class="lp-card">
                            <span style="font-family:'Inter',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--red);margin-bottom:12px;display:block">All-In</span>
                            <div style="font-family:'Inter Tight',sans-serif;font-size:40px;font-weight:700;letter-spacing:-1px;margin-bottom:4px">4x</div>
                            <div class="lp-mono" style="margin-bottom:20px">Peak Multiplier</div>
                            <div class="c-row"><span class="k">Stake Range</span><span class="v">$500 – $5,000</span></div>
                            <div class="c-row"><span class="k">Duration</span><span class="v">3 – 14 days</span></div>
                            <div class="c-row"><span class="k">Growth Target</span><span class="v">60% – 200%</span></div>
                            <p style="font-size:12px;color:var(--t2);margin-top:16px;line-height:1.5;font-style:italic">Maximum exposure. Exponential scaling. Built for conviction.</p>
                        </div>
                    </div>

                    <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--div)">
                        <p class="lp-mono" style="line-height:1.6;max-width:600px">
                            Targets are calculated algorithmically based on your current baseline, metric type, and account size. The same tier system governs both Solo and Rivalry contracts.
                        </p>
                    </div>
                </div>
            </div>

            <div class="lp-w"><div class="lp-hr"></div></div>

            <!-- ═══ PAYOUT MECHANIC ═══ -->
            <div class="lp-w">
                <div class="lp-section" data-reveal>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
                        <div style="width:32px;height:2px;background:var(--red)"></div>
                        <span class="lp-mono">Execution Model</span>
                    </div>
                    <h2 style="font-family:'Inter Tight',sans-serif;font-size:clamp(28px,4vw,40px);font-weight:400;letter-spacing:-.5px;margin-bottom:8px">
                        How payouts <strong>actually work.</strong>
                    </h2>
                    <p style="font-size:13px;color:var(--t2);margin-bottom:48px;max-width:520px">
                        Collateral funds payouts from platform capital — not from other users. Multipliers reflect target difficulty vs. your baseline. We pull 90 days of data to calibrate.
                    </p>

                    <div class="lp-ex-box">
                        <div class="lp-ex-head"><span class="lp-mono" style="color:var(--red);font-weight:600">Worked Example — Stripe Revenue</span></div>
                        <div class="lp-ex-rows">
                            <div class="lp-ex-row"><span class="k">Your stake</span><span class="v">$500</span></div>
                            <div class="lp-ex-sep"></div>
                            <div class="lp-ex-row"><span class="k">Target</span><span class="v">+20% Stripe revenue in 30 days</span></div>
                            <div class="lp-ex-sep"></div>
                            <div class="lp-ex-row"><span class="k">Baseline</span><span class="v">Pulled automatically (read-only)</span></div>
                            <div class="lp-ex-sep"></div>
                            <div class="lp-ex-row"><span class="k">If you hit it</span><span class="v green">$500 back + $750 bonus = $1,250</span></div>
                            <div class="lp-ex-sep"></div>
                            <div class="lp-ex-row"><span class="k">If you miss it</span><span class="v red">$500 forfeit. No exceptions.</span></div>
                        </div>
                    </div>

                    <div style="margin-top:32px;padding-top:20px;border-top:1px solid var(--div)">
                        <p class="lp-mono" style="line-height:1.6">External systems decide outcomes. Collateral does not arbitrate.</p>
                    </div>
                </div>
            </div>

            <div class="lp-w"><div class="lp-hr"></div></div>

            <!-- ═══ FAQ ═══ -->
            <div class="lp-w">
                <div class="lp-section" data-reveal id="faq">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
                        <div style="width:32px;height:2px;background:var(--red)"></div>
                        <span class="lp-mono">Common Questions</span>
                    </div>
                    <h2 style="font-family:'Inter Tight',sans-serif;font-size:clamp(28px,4vw,40px);font-weight:400;letter-spacing:-.5px;margin-bottom:32px">
                        Questions you're <strong>probably asking.</strong>
                    </h2>
                    <div class="lp-faq">
                        <div class="fq open"><div class="fq-q">Is this gambling?</div><div class="fq-a"><strong>No.</strong> You stake against your own measurable performance using read-only data from platforms you already use. No opponent, no chance element, no house edge. You control the outcome through your own work.</div></div>
                        <div class="fq"><div class="fq-q">Is my money safe?</div><div class="fq-a"><strong>Yes.</strong> Stakes are held in escrow via Stripe Connect. Collateral never touches your principal while the contract is active. Funds release only at resolution.</div></div>
                        <div class="fq"><div class="fq-q">What if an API goes down?</div><div class="fq-a">Contracts pause automatically until verification can complete. You don't forfeit due to a platform outage. If an API is permanently deprecated, stakes are fully refunded.</div></div>
                        <div class="fq"><div class="fq-q">What counts as hitting the target?</div><div class="fq-a">The exact metric, pulled directly from the platform API at the deadline. No interpretation, no screenshots, no human judgment.</div></div>
                        <div class="fq"><div class="fq-q">Can I cancel after I lock?</div><div class="fq-a"><strong>No.</strong> Once executed, the stake cannot be canceled or withdrawn. Capital is locked until settlement. You can cancel anytime <em>before</em> locking.</div></div>
                        <div class="fq"><div class="fq-q">What about taxes?</div><div class="fq-a">Payouts may be taxable income. For US users, we issue 1099s for net profit exceeding $600/year.</div></div>
                        <div class="fq"><div class="fq-q">Is this legal?</div><div class="fq-a">Available in the US, Canada, UK, and EU. As a performance contract — not gambling — it falls outside gambling regulations.</div></div>
                        <div class="fq"><div class="fq-q">Can I get a refund if I miss?</div><div class="fq-a"><strong>No.</strong> The forfeit is the mechanism. Without real consequences, it's just another goal-setting app.</div></div>
                    </div>
                </div>
            </div>

            <!-- CREDIBILITY LINE -->
            <div class="lp-cred" data-reveal>
                <p>Contracts are enforced by external data sources, not internal discretion.</p>
            </div>

            <!-- ═══ FINAL CTA ═══ -->
            <div class="lp-foot">
                <h2 class="lp-foot-h">LOCK CAPITAL<br><em>ON YOUR PERFORMANCE.</em></h2>
                <div class="lp-foot-sub">$25 minimum. No card required to sign up.</div>
                <button class="lp-foot-btn" id="lp-final-cta">Execute Contract</button>
                <div class="lp-foot-micro">Stripe · X · Shopify · Amazon</div>
                <div class="lp-foot-line">Collateral.market · © 2026</div>
            </div>
        </div>
    `;
}

export function initLanding() {
    const p = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source','utm_campaign','utm_medium','utm_content','utm_term'].forEach(k => { const v = p.get(k); if (v) utm[k] = v; });
    if (Object.keys(utm).length) sessionStorage.setItem('collateral_utm', JSON.stringify(utm));
    if (window.trackEvent) window.trackEvent('go_page_view', { source: utm.utm_source || 'direct', campaign: utm.utm_campaign || 'none', medium: utm.utm_medium || 'none' });

    function goAction() {
        if (window.appState?.isLoggedIn) {
            sessionStorage.removeItem('collateral_go_flow');
            window.router.navigate('/funding');
        } else {
            window.app.openAccessModal();
        }
    }

    ['lp-hero-cta', 'lp-final-cta', 'lp-nav-cta'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); goAction();
            if (window.trackEvent) window.trackEvent('cta_click', { button: id, ...utm });
        });
    });

    // FAQ accordion
    document.querySelectorAll('.fq').forEach(item => {
        item.querySelector('.fq-q')?.addEventListener('click', () => {
            item.classList.toggle('open');
        });
    });

    // Scroll reveal (exact overview.html implementation)
    const revealEls = document.querySelectorAll('.lp [data-reveal]');
    if (revealEls.length) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach(el => obs.observe(el));
    }
}
