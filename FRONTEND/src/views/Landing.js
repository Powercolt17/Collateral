// Landing Page — 10/10 cold X ad traffic conversion
// Route: /#/go
import api from '../api.js';

export function renderLanding() {
    return `
        <style>
            .lp { min-height:100vh;background:#fff;color:#111;font-family:'Sora',sans-serif;overflow-x:hidden; }
            .lp *,.lp *::before,.lp *::after { box-sizing:border-box; }

            /* Fade-in animation */
            @keyframes lpFadeUp { from { opacity:0;transform:translateY(16px); } to { opacity:1;transform:translateY(0); } }
            .lp-fade { opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease; }
            .lp-fade.visible { opacity:1;transform:translateY(0); }

            /* Brand mark */
            .lp-brand { text-align:center;padding:28px 0 0;display:flex;align-items:center;justify-content:center;gap:8px; }
            .lp-brand-bar { width:3px;height:16px;background:#5C1414; }
            .lp-brand-text { font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#111; }

            /* Hero */
            .lp-hero { text-align:center;padding:36px 24px 32px;max-width:680px;margin:0 auto;animation:lpFadeUp .7s ease both; }
            .lp-h1 { font-size:48px;font-weight:900;color:#111;letter-spacing:-2px;line-height:1.08;margin:0 0 16px; }
            .lp-h1 strong { color:#5C1414; }
            .lp-sub { font-size:17px;color:#555;line-height:1.7;margin:0 auto 28px;max-width:520px; }
            .lp-cta-row { display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:14px; }
            .lp-cta-primary { padding:16px 36px;background:#5C1414;color:#fff;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:all .3s;box-shadow:0 2px 12px rgba(92,20,20,.2); }
            .lp-cta-primary:hover { background:#7a1e1e;box-shadow:0 4px 20px rgba(92,20,20,.35);transform:translateY(-1px); }
            .lp-cta-secondary { padding:16px 36px;background:transparent;color:#111;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:2px solid #ddd;cursor:pointer;font-family:'Sora',sans-serif;transition:all .3s; }
            .lp-cta-secondary:hover { border-color:#111; }
            .lp-trust-line { font-size:12px;color:#aaa;font-family:'JetBrains Mono',monospace;letter-spacing:.5px; }

            /* Example cards */
            .lp-examples { max-width:1000px;margin:0 auto;padding:8px 24px 48px; }
            .lp-ex-tag { font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:20px;text-align:center; }
            .lp-cards { display:grid;grid-template-columns:repeat(3,1fr);gap:16px; }
            .lp-card { border:1px solid #e5e5e5;padding:0;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);position:relative;display:flex;flex-direction:column;box-shadow:0 1px 4px rgba(0,0,0,.04); }
            .lp-card:hover { border-color:#5C1414;transform:translateY(-4px);box-shadow:0 16px 40px rgba(92,20,20,.1); }
            .mc-header { display:flex;justify-content:space-between;align-items:center;padding:16px 20px 0; }
            .mc-badge { font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#888;font-weight:600; }
            .mc-rcpt { font-family:'JetBrains Mono',monospace;font-size:9px;color:#ccc;letter-spacing:1px; }
            .mc-time { font-family:'JetBrains Mono',monospace;font-size:9px;color:#aaa;display:flex;align-items:center;gap:5px; }
            .mc-time-dot { width:5px;height:5px;background:#22c55e;border-radius:50%;display:inline-block; }
            .mc-title { font-size:20px;font-weight:800;color:#111;padding:12px 20px 10px;letter-spacing:-.3px; }
            .mc-tags { display:flex;align-items:center;gap:8px;padding:0 20px;margin-bottom:6px; }
            .mc-platform-dot { width:6px;height:6px;border-radius:50%;background:#111; }
            .mc-platform-name { font-family:'JetBrains Mono',monospace;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px; }
            .mc-tier { font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 8px;border-radius:2px; }
            .mc-tier.allin { background:#5C1414;color:#fff; }
            .mc-tier.stake { background:#f0f0f0;color:#111; }
            .mc-verified { display:flex;align-items:center;gap:5px;padding:0 20px 16px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#15803d;font-weight:600; }
            .mc-verified-dot { width:5px;height:5px;background:#15803d;border-radius:50%; }
            .mc-nums { display:flex;justify-content:space-between;align-items:flex-end;padding:0 20px 20px;border-top:1px solid #f0f0f0;padding-top:16px; }
            .mc-stake-range { font-size:28px;font-weight:900;color:#111;letter-spacing:-1px;line-height:1.1; }
            .mc-stake-label { font-family:'JetBrains Mono',monospace;font-size:8px;color:#aaa;letter-spacing:1.5px;text-transform:uppercase;margin-top:4px; }
            .mc-mult { text-align:right; }
            .mc-mult-val { font-size:28px;font-weight:900;color:#111;letter-spacing:-1px; }
            .mc-mult-label { font-family:'JetBrains Mono',monospace;font-size:8px;color:#aaa;letter-spacing:1.5px;text-transform:uppercase;text-align:right; }
            .lp-card-cta { display:block;width:100%;padding:16px;background:#111;color:#fff;font-size:13px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;text-align:center;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:background .2s; }
            .lp-card-cta:hover { background:#222; }
            .mc-lock-note { text-align:center;padding:10px 20px 16px;font-size:10px;color:#ccc;font-family:'JetBrains Mono',monospace;letter-spacing:.5px; }

            /* Mid CTA */
            .lp-mid-cta { text-align:center;padding:40px 24px;max-width:600px;margin:0 auto; }
            .lp-mid-text { font-size:15px;color:#777;margin-bottom:20px; }
            .lp-mid-text strong { color:#111; }

            /* How it works */
            .lp-how { background:#0a0a0a;color:#fff;padding:72px 24px;border-top:4px solid #5C1414;position:relative; }
            .lp-how::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(92,20,20,.4),transparent); }
            .lp-how-inner { max-width:880px;margin:0 auto; }
            .lp-how-tag { font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:40px;text-align:center; }
            .lp-steps { display:grid;grid-template-columns:repeat(4,1fr);gap:28px; }
            .lp-step { text-align:center;cursor:pointer;padding:20px 12px;transition:background .3s;border-radius:4px; }
            .lp-step:hover { background:rgba(255,255,255,.04); }
            .lp-step:hover .lp-step-num { color:#5C1414; }
            .lp-step-num { font-size:32px;font-weight:900;color:#2a2a2a;margin-bottom:14px;transition:color .3s;font-family:'JetBrains Mono',monospace; }
            .lp-step-title { font-size:14px;font-weight:700;color:#eee;margin-bottom:8px; }
            .lp-step-desc { font-size:12px;color:#999;line-height:1.6; }

            /* Trust blocks */
            .lp-trust-section { max-width:700px;margin:0 auto;padding:56px 24px;display:grid;grid-template-columns:1fr 1fr;gap:20px; }
            .lp-trust-box { border:1px solid #eee;padding:28px;background:#fafafa; }
            .lp-trust-h { font-size:14px;font-weight:800;color:#111;margin-bottom:8px; }
            .lp-trust-p { font-size:13px;color:#777;line-height:1.7; }

            /* Proof */
            .lp-proof-section { text-align:center;max-width:600px;margin:0 auto;padding:48px 24px;border-top:1px solid #f0f0f0; }
            .lp-proof-h { font-size:22px;font-weight:800;color:#111;margin-bottom:12px;letter-spacing:-.3px; }
            .lp-proof-p { font-size:15px;color:#777;line-height:1.7; }

            /* FAQ */
            .lp-faq { max-width:600px;margin:0 auto;padding:56px 24px; }
            .lp-faq-tag { font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:24px; }
            .lp-faq-item { border-bottom:1px solid #eee; }
            .lp-faq-q { padding:18px 0;font-size:15px;font-weight:700;color:#111;cursor:pointer;display:flex;justify-content:space-between;align-items:center; }
            .lp-faq-q::after { content:'+';font-size:20px;color:#bbb;transition:transform .2s; }
            .lp-faq-item.open .lp-faq-q::after { content:'−'; }
            .lp-faq-a { max-height:0;overflow:hidden;transition:max-height .3s;font-size:13px;color:#666;line-height:1.7; }
            .lp-faq-item.open .lp-faq-a { max-height:200px;padding-bottom:18px; }

            /* Bottom CTA */
            .lp-bottom { background:#111;color:#fff;text-align:center;padding:72px 24px; }
            .lp-bottom-h2 { font-size:34px;font-weight:800;margin-bottom:14px;letter-spacing:-1px;line-height:1.15; }
            .lp-bottom-sub { font-size:14px;color:#888;margin-bottom:32px; }
            .lp-bottom-btn { padding:18px 44px;background:#5C1414;color:#fff;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:background .3s; }
            .lp-bottom-btn:hover { background:#7a1e1e; }

            /* Sticky mobile */
            .lp-sticky { display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #eee;padding:12px 20px;z-index:90;box-shadow:0 -4px 20px rgba(0,0,0,.06); }
            .lp-sticky button { width:100%;background:#5C1414;color:#fff;padding:16px;border:none;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;font-family:'Sora',sans-serif; }

            .lp-footer { text-align:center;padding:28px;font-size:11px;color:#ccc;font-family:'JetBrains Mono',monospace;letter-spacing:.5px; }

            /* Ticker */
            .lp-ticker { position:fixed;bottom:24px;left:24px;z-index:80;background:#111;color:#fff;padding:12px 20px;font-size:12px;display:flex;align-items:center;gap:10px;opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s;max-width:360px; }
            .lp-ticker.show { opacity:1;transform:translateY(0); }
            .lp-ticker-dot { width:6px;height:6px;background:#22c55e;border-radius:50%;flex-shrink:0; }
            .lp-ticker-time { font-size:10px;color:#666;margin-left:auto;white-space:nowrap; }

            @media (max-width:768px) {
                .lp-hero { padding:44px 20px 24px; }
                .lp-h1 { font-size:32px;letter-spacing:-1px; }
                .lp-sub { font-size:15px;margin-bottom:24px; }
                .lp-cta-row { flex-direction:column;align-items:stretch; }
                .lp-cta-primary,.lp-cta-secondary { width:100%;text-align:center; }
                .lp-cards { grid-template-columns:1fr; }
                .lp-steps { grid-template-columns:repeat(2,1fr);gap:20px; }
                .lp-trust-section { grid-template-columns:1fr; }
                .lp-bottom-h2 { font-size:26px; }
                .lp-sticky { display:block; }
                .lp-footer { padding-bottom:80px; }
                .lp-ticker { display:none !important; }
                .lp-proof-h { font-size:20px; }
            }
        </style>

        <div class="lp">
            <div class="lp-brand">
                <div class="lp-brand-bar"></div>
                <div class="lp-brand-text">Collateral</div>
            </div>
            <div class="lp-hero">
                <h1 class="lp-h1">Pick a target.<br><strong>Put money behind it.</strong></h1>
                <p class="lp-sub">Hit the target and get paid. Miss it and lose the contract. Collateral verifies the result automatically through Stripe, X, Shopify, and Amazon.</p>
                <div class="lp-cta-row">
                    <button class="lp-cta-primary" id="lp-hero-cta" onclick="window.app.openAccessModal()">Create Your First Contract</button>
                    <button class="lp-cta-secondary" id="lp-see-examples" onclick="document.getElementById('lp-ex').scrollIntoView({behavior:'smooth'})">See Example Contracts</button>
                </div>
                <div class="lp-trust-line">Free to sign up. Lock capital only when you're ready.</div>
            </div>

            <div class="lp-examples lp-fade" id="lp-ex">
                <div class="lp-ex-tag">Example Contracts</div>
                <div class="lp-cards">
                    <div class="lp-card" onclick="window.app.openAccessModal();if(window.trackEvent)window.trackEvent('example_card_click',{c:'stripe'})">
                        <div class="mc-header">
                            <span class="mc-badge">Open Market</span>
                            <span class="mc-rcpt">RCPT-A7F2</span>
                            <span class="mc-time"><span class="mc-time-dot"></span> 30D LEFT</span>
                        </div>
                        <div class="mc-title">Revenue Growth (30d)</div>
                        <div class="mc-tags">
                            <span class="mc-platform-dot"></span>
                            <span class="mc-platform-name">Stripe</span>
                            <span class="mc-tier allin">ALL-IN</span>
                        </div>
                        <div class="mc-verified"><span class="mc-verified-dot"></span> Terms Verified</div>
                        <div class="mc-nums">
                            <div><div class="mc-stake-range">$250 –<br>$5,000</div><div class="mc-stake-label">Stake Capacity</div></div>
                            <div class="mc-mult"><div class="mc-mult-val">2.5x</div><div class="mc-mult-label">Yield<br>Multiplier</div></div>
                        </div>
                        <div class="mc-lock-note">Capital is locked until settlement.</div>
                    </div>
                    <div class="lp-card" onclick="window.app.openAccessModal();if(window.trackEvent)window.trackEvent('example_card_click',{c:'x'})">
                        <div class="mc-header">
                            <span class="mc-badge">Open Market</span>
                            <span class="mc-rcpt">RCPT-F599</span>
                            <span class="mc-time"><span class="mc-time-dot"></span> 14D LEFT</span>
                        </div>
                        <div class="mc-title">Follower Growth (14d)</div>
                        <div class="mc-tags">
                            <span class="mc-platform-dot"></span>
                            <span class="mc-platform-name">X</span>
                            <span class="mc-tier allin">ALL-IN</span>
                        </div>
                        <div class="mc-verified"><span class="mc-verified-dot"></span> Terms Verified</div>
                        <div class="mc-nums">
                            <div><div class="mc-stake-range">$500 –<br>$5,000</div><div class="mc-stake-label">Stake Capacity</div></div>
                            <div class="mc-mult"><div class="mc-mult-val">4x</div><div class="mc-mult-label">Yield<br>Multiplier</div></div>
                        </div>
                        <div class="mc-lock-note">Capital is locked until settlement.</div>
                    </div>
                    <div class="lp-card" onclick="window.app.openAccessModal();if(window.trackEvent)window.trackEvent('example_card_click',{c:'shopify'})">
                        <div class="mc-header">
                            <span class="mc-badge">Open Market</span>
                            <span class="mc-rcpt">RCPT-BAF0</span>
                            <span class="mc-time"><span class="mc-time-dot"></span> 30D LEFT</span>
                        </div>
                        <div class="mc-title">Order Volume Growth (30d)</div>
                        <div class="mc-tags">
                            <span class="mc-platform-dot"></span>
                            <span class="mc-platform-name">Shopify</span>
                            <span class="mc-tier stake">STAKE</span>
                        </div>
                        <div class="mc-verified"><span class="mc-verified-dot"></span> Terms Verified</div>
                        <div class="mc-nums">
                            <div><div class="mc-stake-range">$250 –<br>$3,000</div><div class="mc-stake-label">Stake Capacity</div></div>
                            <div class="mc-mult"><div class="mc-mult-val">2.5x</div><div class="mc-mult-label">Yield<br>Multiplier</div></div>
                        </div>
                        <div class="mc-lock-note">Capital is locked until settlement.</div>
                    </div>
                </div>
            </div>

            <div class="lp-mid-cta">
                <div class="lp-mid-text">Start with <strong>$25</strong>. Create your first contract in under <strong>60 seconds</strong>.</div>
            </div>

            <div class="lp-how lp-fade">
                <div class="lp-how-inner">
                    <div class="lp-how-tag">How It Works</div>
                    <div class="lp-steps">
                        <div class="lp-step" onclick="window.app.openAccessModal()">
                            <div class="lp-step-num">01</div>
                            <div class="lp-step-title">Pick a target</div>
                            <div class="lp-step-desc">Choose a real number to hit: revenue, followers, sales, or orders.</div>
                        </div>
                        <div class="lp-step" onclick="window.app.openAccessModal()">
                            <div class="lp-step-num">02</div>
                            <div class="lp-step-title">Lock money</div>
                            <div class="lp-step-desc">Put $25 to $25,000 behind the target.</div>
                        </div>
                        <div class="lp-step" onclick="window.app.openAccessModal()">
                            <div class="lp-step-num">03</div>
                            <div class="lp-step-title">Connect source</div>
                            <div class="lp-step-desc">Link Stripe, X, Shopify, or Amazon so the result can be verified.</div>
                        </div>
                        <div class="lp-step" onclick="window.app.openAccessModal()">
                            <div class="lp-step-num">04</div>
                            <div class="lp-step-title">Get paid or lose it</div>
                            <div class="lp-step-desc">Hit the target and collect the payout. Miss it and lose the contract.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lp-trust-section lp-fade">
                <div class="lp-trust-box">
                    <div class="lp-trust-h">No screenshots. No manual claims.</div>
                    <div class="lp-trust-p">Collateral checks connected accounts automatically. The result is based on real data, not trust.</div>
                </div>
                <div class="lp-trust-box">
                    <div class="lp-trust-h">You stay in control.</div>
                    <div class="lp-trust-p">Signing up is free. You only lock money when you choose a contract.</div>
                </div>
            </div>

            <div class="lp-proof-section lp-fade">
                <div class="lp-proof-h">Built for people who are done negotiating with themselves.</div>
                <div class="lp-proof-p">If the target matters, make the deadline real. Collateral turns vague ambition into a contract with money attached.</div>
            </div>

            <div class="lp-faq">
                <div class="lp-faq-tag">Questions</div>
                <div class="lp-faq-item open">
                    <div class="lp-faq-q">What happens if I miss my target?</div>
                    <div class="lp-faq-a">You lose the contract. That is the point: the deadline has consequences.</div>
                </div>
                <div class="lp-faq-item">
                    <div class="lp-faq-q">How are results verified?</div>
                    <div class="lp-faq-a">We connect directly to Stripe, X, Shopify, or Amazon via read-only access. No screenshots, no self-reporting. Everything is checked automatically at deadline.</div>
                </div>
                <div class="lp-faq-item">
                    <div class="lp-faq-q">Do I have to lock money when I sign up?</div>
                    <div class="lp-faq-a">No. Signing up is free. You only lock capital when you choose and confirm a contract.</div>
                </div>
                <div class="lp-faq-item">
                    <div class="lp-faq-q">What sources can I connect?</div>
                    <div class="lp-faq-a">Stripe, X (Twitter), Shopify, and Amazon. All read-only — we never post, modify, or store raw data.</div>
                </div>
                <div class="lp-faq-item">
                    <div class="lp-faq-q">What is the minimum to start?</div>
                    <div class="lp-faq-a">$25. You can lock up to $25,000 depending on how serious you are about the target.</div>
                </div>
            </div>

            <div class="lp-bottom">
                <div class="lp-bottom-h2">Stop planning.<br>Start proving.</div>
                <div class="lp-bottom-sub">Create a free account. Lock capital only when you're ready.</div>
                <button class="lp-bottom-btn" id="lp-final-cta" onclick="window.app.openAccessModal()">Create Your First Contract →</button>
            </div>

            <div class="lp-sticky"><button onclick="window.app.openAccessModal()">Create Your First Contract →</button></div>

            <div class="lp-ticker" id="lp-ticker">
                <span class="lp-ticker-dot"></span>
                <span id="lp-ticker-text"></span>
                <span class="lp-ticker-time" id="lp-ticker-time"></span>
            </div>

            <div class="lp-footer">Collateral.market · © 2026</div>
        </div>
    `;
}

export function initLanding() {
    // UTM preservation
    const p = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source','utm_campaign','utm_medium','utm_content','utm_term'].forEach(k => { const v = p.get(k); if(v) utm[k] = v; });
    if (Object.keys(utm).length) sessionStorage.setItem('collateral_utm', JSON.stringify(utm));

    // Analytics
    if (window.trackEvent) {
        window.trackEvent('go_page_view', { source: utm.utm_source||'direct', campaign: utm.utm_campaign||'none', medium: utm.utm_medium||'none' });
    }
    document.getElementById('lp-hero-cta')?.addEventListener('click', () => { if(window.trackEvent) window.trackEvent('hero_create_contract_click', utm); });
    document.getElementById('lp-see-examples')?.addEventListener('click', () => { if(window.trackEvent) window.trackEvent('hero_see_examples_click'); });
    document.getElementById('lp-final-cta')?.addEventListener('click', () => { if(window.trackEvent) window.trackEvent('final_create_contract_click', utm); });

    // FAQ accordion
    document.querySelectorAll('.lp-faq-item').forEach(item => {
        item.querySelector('.lp-faq-q')?.addEventListener('click', () => {
            item.classList.toggle('open');
            if(window.trackEvent && item.classList.contains('open')) window.trackEvent('faq_opened', { q: item.querySelector('.lp-faq-q')?.textContent });
        });
    });

    // Ticker
    const msgs = [
        { t:'Creator locked $300 on a revenue contract', d:'2m ago' },
        { t:'Rivalry settled — $1,200 payout on X duel', d:'8m ago' },
        { t:'New Shopify contract — $500 locked', d:'14m ago' },
        { t:'$2,400 payout on 30-day Stripe contract', d:'22m ago' },
    ];
    let ti = 0;
    const tk = document.getElementById('lp-ticker'), tt = document.getElementById('lp-ticker-text'), td = document.getElementById('lp-ticker-time');
    function showT() { if(!tk||!tt) return; const m=msgs[ti%msgs.length]; tt.textContent=m.t; if(td) td.textContent=m.d; tk.classList.add('show'); setTimeout(()=>tk.classList.remove('show'),4000); ti++; }
    setTimeout(showT, 8000); setInterval(showT, 15000);

    // Scroll fade-in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll('.lp-fade').forEach(el => observer.observe(el));
}
