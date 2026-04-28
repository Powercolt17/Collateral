// Landing Page — /go — Cold X ad traffic conversion
import api from '../api.js';

export function renderLanding() {
    return `
        <style>
            .lp{min-height:100vh;background:#fff;color:#111;font-family:'Sora',sans-serif;overflow-x:hidden}
            .lp *,.lp *::before,.lp *::after{box-sizing:border-box}
            @keyframes lpUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
            .lp-fade{opacity:0;transform:translateY(18px);transition:opacity .5s,transform .5s}.lp-fade.vis{opacity:1;transform:none}

            .lp-brand{text-align:center;padding:28px 0 0;display:flex;align-items:center;justify-content:center;gap:8px}
            .lp-brand-bar{width:3px;height:16px;background:#5C1414}
            .lp-brand-name{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#111}

            .lp-hero{text-align:center;padding:32px 24px 28px;max-width:660px;margin:0 auto;animation:lpUp .7s ease both}
            .lp-h1{font-size:46px;font-weight:900;color:#111;letter-spacing:-2px;line-height:1.08;margin:0 0 16px}
            .lp-h1 strong{color:#5C1414}
            .lp-sub{font-size:17px;color:#555;line-height:1.7;margin:0 auto 28px;max-width:520px}
            .lp-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:14px}
            .lp-btn-p{padding:16px 36px;background:#5C1414;color:#fff;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:all .3s;box-shadow:0 2px 12px rgba(92,20,20,.18)}
            .lp-btn-p:hover{background:#7a1e1e;box-shadow:0 4px 20px rgba(92,20,20,.32);transform:translateY(-1px)}
            .lp-btn-s{padding:16px 36px;background:transparent;color:#111;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:2px solid #ddd;cursor:pointer;font-family:'Sora',sans-serif;transition:all .3s}
            .lp-btn-s:hover{border-color:#111}
            .lp-tl{font-size:12px;color:#aaa;font-family:'JetBrains Mono',monospace;letter-spacing:.5px}

            .lp-ex{max-width:980px;margin:0 auto;padding:4px 24px 40px}
            .lp-ex-tag{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:20px;text-align:center}
            .lp-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}

            .lp-card{border:1px solid #e5e5e5;padding:28px 24px 0;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,.04)}
            .lp-card:hover{border-color:#5C1414;transform:translateY(-4px);box-shadow:0 14px 36px rgba(92,20,20,.09)}
            .c-title{font-size:19px;font-weight:800;color:#111;margin-bottom:6px;letter-spacing:-.3px}
            .c-src{font-size:10px;font-family:'JetBrains Mono',monospace;letter-spacing:1px;text-transform:uppercase;color:#15803d;display:flex;align-items:center;gap:5px;margin-bottom:16px}
            .c-src::before{content:'✓';font-weight:700}
            .c-rows{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
            .c-row{display:flex;justify-content:space-between;font-size:13px}
            .c-lbl{color:#999}
            .c-val{font-weight:600;color:#111}
            .c-val.grn{color:#15803d}
            .c-btn{display:block;width:calc(100% + 48px);margin:0 -24px;padding:16px;background:#111;color:#fff;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;text-align:center;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:background .2s}
            .c-btn:hover{background:#5C1414}

            .lp-mid{text-align:center;padding:40px 24px;max-width:560px;margin:0 auto}
            .lp-mid-t{font-size:15px;color:#666;margin-bottom:20px}.lp-mid-t strong{color:#111}

            .lp-how{background:#0a0a0a;color:#fff;padding:72px 24px;border-top:3px solid #5C1414}
            .lp-how-in{max-width:860px;margin:0 auto}
            .lp-how-tag{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:40px;text-align:center}
            .lp-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
            .lp-step{text-align:center;padding:20px 10px;cursor:pointer;transition:background .3s;border-radius:4px}
            .lp-step:hover{background:rgba(255,255,255,.03)}
            .s-num{font-size:30px;font-weight:900;color:#2a2a2a;margin-bottom:14px;font-family:'JetBrains Mono',monospace;transition:color .3s}
            .lp-step:hover .s-num{color:#5C1414}
            .s-title{font-size:14px;font-weight:700;color:#f0f0f0;margin-bottom:8px}
            .s-desc{font-size:12px;color:#888;line-height:1.65}

            .lp-clarity{text-align:center;padding:32px 24px;max-width:620px;margin:0 auto}
            .lp-clarity-text{font-size:13px;color:#999;font-family:'JetBrains Mono',monospace;letter-spacing:.3px;line-height:1.7;border:1px solid #f0f0f0;padding:20px 28px;background:#fafafa}

            .lp-trust{max-width:680px;margin:0 auto;padding:40px 24px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
            .lp-tb{border:1px solid #eee;padding:24px;background:#fafafa}
            .lp-tb-h{font-size:14px;font-weight:800;color:#111;margin-bottom:6px}
            .lp-tb-p{font-size:13px;color:#777;line-height:1.7}

            .lp-proof{text-align:center;max-width:560px;margin:0 auto;padding:48px 24px;border-top:1px solid #f0f0f0}
            .lp-proof-h{font-size:21px;font-weight:800;color:#111;margin-bottom:10px;letter-spacing:-.3px}
            .lp-proof-p{font-size:14px;color:#777;line-height:1.7}

            .lp-faq{max-width:580px;margin:0 auto;padding:48px 24px}
            .lp-faq-tag{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:20px}
            .fq{border-bottom:1px solid #eee}
            .fq-q{padding:16px 0;font-size:15px;font-weight:700;color:#111;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
            .fq-q::after{content:'+';font-size:18px;color:#bbb;transition:transform .2s}
            .fq.open .fq-q::after{content:'−'}
            .fq-a{max-height:0;overflow:hidden;transition:max-height .3s;font-size:13px;color:#666;line-height:1.7}
            .fq.open .fq-a{max-height:200px;padding-bottom:16px}

            .lp-bot{background:#0a0a0a;color:#fff;text-align:center;padding:72px 24px}
            .lp-bot-h{font-size:32px;font-weight:800;margin-bottom:10px;letter-spacing:-1px;line-height:1.15}
            .lp-bot-sub{font-size:14px;color:#888;margin-bottom:12px}
            .lp-bot-trust{font-size:11px;color:#555;font-family:'JetBrains Mono',monospace;letter-spacing:.5px;margin-bottom:28px}
            .lp-bot-btn{padding:18px 44px;background:#5C1414;color:#fff;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:all .3s;box-shadow:0 2px 12px rgba(92,20,20,.2)}
            .lp-bot-btn:hover{background:#7a1e1e;transform:translateY(-1px);box-shadow:0 4px 20px rgba(92,20,20,.35)}

            .lp-stick{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #eee;padding:12px 20px;z-index:90;box-shadow:0 -4px 16px rgba(0,0,0,.06)}
            .lp-stick button{width:100%;background:#5C1414;color:#fff;padding:16px;border:none;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;font-family:'Sora',sans-serif}

            .lp-foot{text-align:center;padding:32px 24px;font-size:12px;color:#999;line-height:1.6}
            .lp-foot-line{font-size:10px;color:#ccc;font-family:'JetBrains Mono',monospace;letter-spacing:.5px;margin-top:8px}

            .lp-tick{position:fixed;bottom:24px;left:24px;z-index:80;background:#111;color:#fff;padding:12px 20px;font-size:12px;display:flex;align-items:center;gap:10px;opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s;max-width:340px}
            .lp-tick.show{opacity:1;transform:translateY(0)}
            .tk-dot{width:6px;height:6px;background:#22c55e;border-radius:50%;flex-shrink:0}
            .tk-time{font-size:10px;color:#555;margin-left:auto;white-space:nowrap}

            @media(max-width:768px){
                .lp-hero{padding:28px 20px 24px}
                .lp-h1{font-size:32px;letter-spacing:-1px}
                .lp-sub{font-size:15px;margin-bottom:24px}
                .lp-ctas{flex-direction:column;align-items:stretch}
                .lp-btn-p,.lp-btn-s{width:100%;text-align:center}
                .lp-cards{grid-template-columns:1fr}
                .lp-steps{grid-template-columns:repeat(2,1fr);gap:16px}
                .lp-trust{grid-template-columns:1fr}
                .lp-bot-h{font-size:26px}
                .lp-stick{display:block}
                .lp-foot{padding-bottom:80px}
                .lp-tick{display:none!important}
                .lp-proof-h{font-size:19px}
            }
        </style>
        <div class="lp">
            <div class="lp-brand"><div class="lp-brand-bar"></div><div class="lp-brand-name">Collateral</div></div>

            <div class="lp-hero">
                <h1 class="lp-h1">Pick a target.<br><strong>Put money behind it.</strong></h1>
                <p class="lp-sub">Hit the target and get paid. Miss it and lose the contract. Collateral verifies the result automatically through Stripe, X, Shopify, and Amazon.</p>
                <div class="lp-ctas">
                    <button class="lp-btn-p" id="lp-hero-cta" onclick="window.app.openAccessModal()">Create Your First Contract</button>
                </div>
                <div class="lp-tl">Free to sign up. Lock capital only when you're ready.</div>
            </div>

            <div class="lp-ex lp-fade" id="lp-ex">
                <div class="lp-ex-tag">Example Contracts</div>
                <div class="lp-cards">
                    <div class="lp-card" data-card="stripe" onclick="window.app.openAccessModal();if(window.trackEvent)window.trackEvent('example_card_click',{card_type:'stripe',source:'stripe',target:'revenue_20pct'})">
                        <div class="c-title">Revenue Growth</div>
                        <div class="c-src">Verified with Stripe</div>
                        <div class="c-rows">
                            <div class="c-row"><span class="c-lbl">Target</span><span class="c-val">Grow revenue by 20%</span></div>
                            <div class="c-row"><span class="c-lbl">Deadline</span><span class="c-val">30 days</span></div>
                            <div class="c-row"><span class="c-lbl">Lock</span><span class="c-val">$250 – $5,000</span></div>
                            <div class="c-row"><span class="c-lbl">Payout</span><span class="c-val grn">Up to 2.5x</span></div>
                        </div>
                        <button class="c-btn" onclick="event.stopPropagation();window.app.openAccessModal();if(window.trackEvent)window.trackEvent('example_start_contract_click',{card_type:'stripe',button_location:'card'})">Start This Contract →</button>
                    </div>
                    <div class="lp-card" data-card="x" onclick="window.app.openAccessModal();if(window.trackEvent)window.trackEvent('example_card_click',{card_type:'x',source:'x',target:'followers_1000'})">
                        <div class="c-title">Follower Growth</div>
                        <div class="c-src">Verified with X</div>
                        <div class="c-rows">
                            <div class="c-row"><span class="c-lbl">Target</span><span class="c-val">Gain 1,000 followers</span></div>
                            <div class="c-row"><span class="c-lbl">Deadline</span><span class="c-val">14 days</span></div>
                            <div class="c-row"><span class="c-lbl">Lock</span><span class="c-val">$100 – $2,500</span></div>
                            <div class="c-row"><span class="c-lbl">Payout</span><span class="c-val grn">Up to 4x</span></div>
                        </div>
                        <button class="c-btn" onclick="event.stopPropagation();window.app.openAccessModal();if(window.trackEvent)window.trackEvent('example_start_contract_click',{card_type:'x',button_location:'card'})">Start This Contract →</button>
                    </div>
                    <div class="lp-card" data-card="shopify" onclick="window.app.openAccessModal();if(window.trackEvent)window.trackEvent('example_card_click',{card_type:'shopify',source:'shopify',target:'sales_5000'})">
                        <div class="c-title">Order Growth</div>
                        <div class="c-src">Verified with Shopify</div>
                        <div class="c-rows">
                            <div class="c-row"><span class="c-lbl">Target</span><span class="c-val">Hit $5,000 in sales</span></div>
                            <div class="c-row"><span class="c-lbl">Deadline</span><span class="c-val">30 days</span></div>
                            <div class="c-row"><span class="c-lbl">Lock</span><span class="c-val">$250 – $3,000</span></div>
                            <div class="c-row"><span class="c-lbl">Payout</span><span class="c-val grn">Up to 2.5x</span></div>
                        </div>
                        <button class="c-btn" onclick="event.stopPropagation();window.app.openAccessModal();if(window.trackEvent)window.trackEvent('example_start_contract_click',{card_type:'shopify',button_location:'card'})">Start This Contract →</button>
                    </div>
                </div>
            </div>

            <div class="lp-mid lp-fade">
                <div class="lp-mid-t">Start with <strong>$25</strong>. Create your first contract in under <strong>60 seconds</strong>.</div>
                <button class="lp-btn-p" id="lp-mid-cta" onclick="window.app.openAccessModal()">Create Your First Contract →</button>
            </div>

            <div class="lp-how lp-fade">
                <div class="lp-how-in">
                    <div class="lp-how-tag">How It Works</div>
                    <div class="lp-steps">
                        <div class="lp-step" onclick="window.app.openAccessModal()"><div class="s-num">01</div><div class="s-title">Pick a target</div><div class="s-desc">Choose a real number to hit: revenue, followers, sales, or orders.</div></div>
                        <div class="lp-step" onclick="window.app.openAccessModal()"><div class="s-num">02</div><div class="s-title">Lock money</div><div class="s-desc">Put $25 to $25,000 behind the target.</div></div>
                        <div class="lp-step" onclick="window.app.openAccessModal()"><div class="s-num">03</div><div class="s-title">Connect source</div><div class="s-desc">Link Stripe, X, Shopify, or Amazon so the result can be verified.</div></div>
                        <div class="lp-step" onclick="window.app.openAccessModal()"><div class="s-num">04</div><div class="s-title">Get paid or lose it</div><div class="s-desc">Hit the target and collect the payout. Miss it and lose the contract.</div></div>
                    </div>
                </div>
            </div>

            <div class="lp-clarity lp-fade">
                <div class="lp-clarity-text">No screenshots. No manual claims. No fake progress. Results are checked automatically through connected accounts.</div>
            </div>

            <div class="lp-trust lp-fade">
                <div class="lp-tb"><div class="lp-tb-h">No screenshots. No manual claims.</div><div class="lp-tb-p">Collateral checks connected accounts automatically. The result is based on real data, not trust.</div></div>
                <div class="lp-tb"><div class="lp-tb-h">You stay in control.</div><div class="lp-tb-p">Signing up is free. You only lock money when you choose a contract.</div></div>
            </div>

            <div class="lp-proof lp-fade">
                <div class="lp-proof-h">Built for people who are done negotiating with themselves.</div>
                <div class="lp-proof-p">If the target matters, make the deadline real. Collateral turns vague ambition into a contract with money attached.</div>
            </div>

            <div class="lp-faq lp-fade">
                <div class="lp-faq-tag">Questions</div>
                <div class="fq open"><div class="fq-q">What happens if I miss my target?</div><div class="fq-a">You lose the contract. That is the point: the deadline has real consequences.</div></div>
                <div class="fq"><div class="fq-q">Do I have to pay to sign up?</div><div class="fq-a">No. Creating an account is free. You only lock money when you choose a contract.</div></div>
                <div class="fq"><div class="fq-q">How are results verified?</div><div class="fq-a">Collateral checks connected accounts like Stripe, X, Shopify, and Amazon automatically. No screenshots or manual proof.</div></div>
                <div class="fq"><div class="fq-q">What is the minimum to start?</div><div class="fq-a">You can start with $25 on supported contracts.</div></div>
                <div class="fq"><div class="fq-q">What sources can I connect?</div><div class="fq-a">Stripe, X, Shopify, and Amazon are supported or planned verification sources depending on the contract type.</div></div>
            </div>

            <div class="lp-bot">
                <div class="lp-bot-h">Stop planning.<br>Start proving.</div>
                <div class="lp-bot-sub">Create a free account. Lock capital only when you're ready.</div>
                <div class="lp-bot-trust">Free account. Real deadline. Verified result.</div>
                <button class="lp-bot-btn" id="lp-final-cta" onclick="window.app.openAccessModal()">Create Your First Contract →</button>
            </div>

            <div class="lp-stick"><button onclick="window.app.openAccessModal()">Create Your First Contract →</button></div>
            <div class="lp-tick" id="lp-tick"><span class="tk-dot"></span><span id="tk-t"></span><span class="tk-time" id="tk-d"></span></div>

            <div class="lp-foot">
                Collateral turns measurable goals into contracts with real stakes.
                <div class="lp-foot-line">Collateral.market · © 2026</div>
            </div>
        </div>
    `;
}

export function initLanding() {
    const p = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source','utm_campaign','utm_medium','utm_content','utm_term'].forEach(k=>{const v=p.get(k);if(v)utm[k]=v;});
    if(Object.keys(utm).length) sessionStorage.setItem('collateral_utm',JSON.stringify(utm));

    if(window.trackEvent) window.trackEvent('go_page_view',{source:utm.utm_source||'direct',campaign:utm.utm_campaign||'none',medium:utm.utm_medium||'none'});

    document.getElementById('lp-hero-cta')?.addEventListener('click',()=>{if(window.trackEvent)window.trackEvent('hero_create_contract_click',utm)});
    document.getElementById('lp-see-ex')?.addEventListener('click',()=>{if(window.trackEvent)window.trackEvent('hero_see_examples_click')});
    document.getElementById('lp-mid-cta')?.addEventListener('click',()=>{if(window.trackEvent)window.trackEvent('midpage_create_contract_click',{button_location:'midpage',...utm})});
    document.getElementById('lp-final-cta')?.addEventListener('click',()=>{if(window.trackEvent)window.trackEvent('final_create_contract_click',{button_location:'footer',...utm})});

    document.querySelectorAll('.fq').forEach(item=>{
        item.querySelector('.fq-q')?.addEventListener('click',()=>{
            item.classList.toggle('open');
            if(window.trackEvent&&item.classList.contains('open'))window.trackEvent('faq_opened',{q:item.querySelector('.fq-q')?.textContent});
        });
    });

    const msgs=[{t:'Creator locked $300 on a revenue contract',d:'2m ago'},{t:'$1,200 payout on follower growth duel',d:'8m ago'},{t:'New Shopify contract — $500 locked',d:'14m ago'},{t:'$2,400 payout on 30-day Stripe contract',d:'22m ago'}];
    let ti=0;const tk=document.getElementById('lp-tick'),tt=document.getElementById('tk-t'),td=document.getElementById('tk-d');
    function showT(){if(!tk||!tt)return;const m=msgs[ti%msgs.length];tt.textContent=m.t;if(td)td.textContent=m.d;tk.classList.add('show');setTimeout(()=>tk.classList.remove('show'),4000);ti++}
    setTimeout(showT,8000);setInterval(showT,15000);

    const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}})},{threshold:.12});
    document.querySelectorAll('.lp-fade').forEach(el=>obs.observe(el));
}
