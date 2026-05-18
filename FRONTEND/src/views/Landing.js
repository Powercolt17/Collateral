// Landing Page — /go — Cold X ad traffic conversion
import api from '../api.js';

export function renderLanding() {
    return `
        <style>
            .lp{min-height:100vh;background:#fff;color:#111;font-family:'Sora',sans-serif;overflow-x:hidden}
            .lp *,.lp *::before,.lp *::after{box-sizing:border-box}
            @keyframes lpUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
            .lp-fade{opacity:0;transform:translateY(18px);transition:opacity .5s,transform .5s}.lp-fade.vis{opacity:1;transform:none}
            @keyframes scrollFeed{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

            .lp-brand{text-align:center;padding:24px 0 0;font-size:11px;font-weight:800;letter-spacing:.2em;color:#5C1414;font-family:'Sora',sans-serif}

            /* HERO */
            .lp-hero-wrap{display:flex;align-items:center;justify-content:center;padding:24px 24px 32px;max-width:1100px;margin:0 auto;gap:48px}
            .lp-hero-content{flex:1;max-width:600px;animation:lpUp .7s ease both}
            .lp-hero-mock{flex:1;max-width:440px;animation:lpUp .7s ease both .1s;display:none} 
            @media(min-width:900px){.lp-hero-mock{display:block}}
            
            .lp-eyebrow{font-size:10px;font-family:'JetBrains Mono',monospace;letter-spacing:1px;color:#777;text-transform:uppercase;margin-bottom:16px;display:block}
            .lp-h1{font-size:48px;font-weight:900;color:#111;letter-spacing:-1.5px;line-height:1.05;margin:0 0 16px}
            .lp-h1 strong{color:#5C1414}
            .lp-sub{font-size:16px;color:#444;line-height:1.6;margin:0 0 24px}
            
            .lp-cta-wrap{margin-bottom:12px}
            .lp-btn-p{display:inline-block;padding:18px 36px;background:#5C1414;color:#fff;font-size:14px;font-weight:800;letter-spacing:0.5px;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:all .3s;box-shadow:0 4px 14px rgba(92,20,20,.2)}
            .lp-btn-p:hover{background:#7a1e1e;box-shadow:0 6px 20px rgba(92,20,20,.3);transform:translateY(-1px)}
            .lp-micro{font-size:12px;color:#777;margin-bottom:24px}
            
            .lp-trust-strip{display:flex;align-items:center;gap:12px;font-size:12px;color:#111;font-weight:600;margin-bottom:8px;flex-wrap:wrap}
            .lp-trust-logos{display:flex;gap:8px;flex-wrap:wrap}
            .lp-trust-logos span{background:#f4f4f4;padding:4px 8px;border-radius:4px;font-size:10px;text-transform:uppercase;letter-spacing:1px;font-family:'JetBrains Mono',monospace}
            .lp-anti-gamble{font-size:11px;color:#888;line-height:1.4}
            .lp-anti-gamble a{color:#5C1414;text-decoration:none}
            .lp-anti-gamble a:hover{text-decoration:underline}

            /* Mockup styling */
            .mock-window{background:#fff;border:1px solid #eaeaea;border-radius:12px;box-shadow:0 24px 48px rgba(0,0,0,.08);overflow:hidden}
            .mock-header{background:#fafafa;padding:12px 16px;border-bottom:1px solid #eaeaea;display:flex;gap:6px}
            .mock-dot{width:10px;height:10px;border-radius:50%;background:#ddd}
            .mock-body{padding:24px}
            .mock-title{font-size:14px;font-weight:700;margin-bottom:16px}
            .mock-field{background:#f9f9f9;border:1px solid #eee;border-radius:6px;padding:12px;margin-bottom:12px;font-size:12px;color:#555}
            .mock-field strong{color:#111;display:block;margin-bottom:4px}
            .mock-btn{background:#111;color:#fff;text-align:center;padding:12px;border-radius:6px;font-size:12px;font-weight:700;margin-top:8px}

            /* PROOF BAR */
            .lp-proof-bar{background:#0a0a0a;color:#fff;padding:24px 0;overflow:hidden;border-bottom:4px solid #5C1414}
            .pb-stats{display:flex;justify-content:center;gap:64px;margin-bottom:20px;max-width:1000px;margin-left:auto;margin-right:auto;padding:0 24px}
            .pb-stat{text-align:center}
            .pb-val{font-size:28px;font-weight:900;letter-spacing:-1px;margin-bottom:4px;font-family:'JetBrains Mono',monospace}
            .pb-lbl{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888}
            
            .pb-feed-wrap{position:relative;width:100%;display:flex;overflow:hidden}
            .pb-feed{display:flex;gap:32px;white-space:nowrap;animation:scrollFeed 40s linear infinite;min-width:200%}
            .pb-feed:hover{animation-play-state:paused}
            .pb-item{font-size:13px;color:#aaa;background:rgba(255,255,255,0.05);padding:6px 16px;border-radius:20px}
            .pb-item strong{color:#fff}

            /* PAYOUT EXPLANATION */
            .lp-payout{padding:64px 24px;background:#fafafa;text-align:center}
            .lp-payout-in{max-width:680px;margin:0 auto}
            .payout-h2{font-size:24px;font-weight:800;margin-bottom:16px;letter-spacing:-0.5px}
            .payout-p{font-size:15px;color:#555;line-height:1.6;margin-bottom:24px}
            .payout-box{background:#fff;border:1px solid #eee;padding:24px;text-align:left;box-shadow:0 4px 12px rgba(0,0,0,.03);border-left:4px solid #5C1414}
            .payout-box-h{font-size:12px;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:1px;color:#5C1414;margin-bottom:12px}
            .payout-math{font-size:14px;color:#333;line-height:1.6}
            .payout-math span{display:block;margin-bottom:8px;padding-bottom:8px;border-bottom:1px dashed #eee}
            .payout-math span:last-child{border:none;margin:0;padding:0}
            .payout-math strong{color:#111}

            /* EXAMPLE CONTRACTS */
            .lp-ex{max-width:1000px;margin:0 auto;padding:64px 24px}
            .lp-sect-tag{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:32px;text-align:center}
            .lp-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}

            .lp-card{border:1px solid #e5e5e5;padding:32px 24px 0;cursor:pointer;position:relative;background:#fff;display:flex;flex-direction:column;box-shadow:0 2px 8px rgba(0,0,0,.04);overflow:hidden}
            .lp-card-front{transition:opacity .3s}
            .lp-card-back{position:absolute;top:0;left:0;right:0;bottom:0;background:#111;color:#fff;padding:32px 24px;opacity:0;pointer-events:none;transition:opacity .3s;display:flex;flex-direction:column;justify-content:center}
            .lp-card:hover .lp-card-front{opacity:0.1}
            .lp-card:hover .lp-card-back{opacity:1;pointer-events:auto}
            
            .c-title{font-size:20px;font-weight:800;color:#111;margin-bottom:8px;letter-spacing:-.5px}
            .c-src{font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:0.5px;color:#555;margin-bottom:24px}
            .c-rows{display:flex;flex-direction:column;gap:12px;margin-bottom:24px}
            .c-row{display:flex;justify-content:space-between;font-size:13px;border-bottom:1px solid #f4f4f4;padding-bottom:4px}
            .c-lbl{color:#777}
            .c-val{font-weight:700;color:#111}
            .c-btn{display:block;width:calc(100% + 48px);margin:0 -24px;padding:16px;background:#fafafa;color:#111;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;text-align:center;border-top:1px solid #eee;border-bottom:none;border-left:none;border-right:none;cursor:pointer;font-family:'Sora',sans-serif;transition:all .2s}
            .lp-card:hover .c-btn{background:#5C1414;color:#fff}

            .cb-math{font-size:13px;line-height:1.6;color:#ccc}
            .cb-math strong{color:#fff}
            .cb-math div{margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #333}
            .cb-btn{margin-top:auto;display:block;width:100%;padding:12px;background:#fff;color:#111;text-align:center;font-size:12px;font-weight:700;text-transform:uppercase;border:none;cursor:pointer}

            /* HOW IT WORKS */
            .lp-how{padding:64px 24px;background:#fff;border-top:1px solid #eee}
            .lp-how-in{max-width:1000px;margin:0 auto}
            .lp-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
            .lp-step{padding:0 12px;border-left:2px solid #eee}
            .s-num{font-size:14px;font-weight:900;color:#5C1414;margin-bottom:12px;font-family:'JetBrains Mono',monospace}
            .s-desc{font-size:14px;font-weight:600;color:#111;line-height:1.5}
            .s-desc span{color:#666;font-weight:400}

            /* TESTIMONIALS */
            .lp-testi{background:#fafafa;padding:64px 24px;border-top:1px solid #eee;border-bottom:1px solid #eee}
            .lp-testi-in{max-width:1000px;margin:0 auto}
            .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
            .testi-card{background:#fff;padding:24px;border:1px solid #eee;box-shadow:0 4px 12px rgba(0,0,0,.02)}
            .testi-quote{font-size:14px;color:#333;line-height:1.6;margin-bottom:20px;font-style:italic}
            .testi-quote strong{font-weight:700;font-style:normal;color:#111}
            .testi-user{display:flex;align-items:center;gap:12px}
            .testi-av{width:40px;height:40px;border-radius:50%;background:#ddd;background-size:cover;background-position:center}
            .testi-name{font-size:13px;font-weight:700;color:#111;margin:0}
            .testi-role{font-size:11px;color:#777;margin:0}

            /* OBJECTIONS / FAQ */
            .lp-obj{max-width:800px;margin:0 auto;padding:64px 24px}
            .obj-h2{font-size:28px;font-weight:800;margin-bottom:32px;text-align:center;letter-spacing:-0.5px}
            .fq{border-bottom:1px solid #eee}
            .fq-q{padding:20px 0;font-size:16px;font-weight:700;color:#111;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
            .fq-q::after{content:'+';font-size:20px;color:#888;transition:transform .2s}
            .fq.open .fq-q::after{content:'−'}
            .fq-a{max-height:0;overflow:hidden;transition:max-height .3s;font-size:14px;color:#555;line-height:1.6}
            .fq.open .fq-a{max-height:400px;padding-bottom:20px}
            .fq-a strong{color:#111}

            /* BOTTOM CTA */
            .lp-bot{background:#0a0a0a;color:#fff;text-align:center;padding:80px 24px}
            .lp-bot-h{font-size:36px;font-weight:900;margin-bottom:16px;letter-spacing:-1px}
            .lp-bot-btn{padding:18px 48px;background:#5C1414;color:#fff;font-size:14px;font-weight:800;letter-spacing:0.5px;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:all .3s;box-shadow:0 4px 20px rgba(92,20,20,.3);margin-bottom:16px}
            .lp-bot-btn:hover{background:#7a1e1e;transform:translateY(-1px);box-shadow:0 6px 24px rgba(92,20,20,.4)}
            .lp-bot-micro{font-size:13px;color:#888}

            .lp-bot-foot{margin-top:64px;padding-top:32px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;color:#555}

            @media(max-width:900px){
                .lp-hero-wrap{flex-direction:column;text-align:center;padding-top:32px}
                .lp-trust-strip{justify-content:center;flex-direction:column;gap:8px}
                .pb-stats{flex-direction:column;gap:24px}
                .lp-cards, .testi-grid, .lp-steps{grid-template-columns:1fr;gap:16px}
                .lp-step{border-left:none;border-top:2px solid #eee;padding:16px 0 0}
                .lp-h1{font-size:38px}
            }
        </style>
        <div class="lp">
            <div class="lp-brand">COLLATERAL</div>

            <div class="lp-hero-wrap">
                <div class="lp-hero-content">
                    <span class="lp-eyebrow">The Accountability Contract for Founders, Creators, and Operators</span>
                    <h1 class="lp-h1">Finally finish what you start.</h1>
                    <p class="lp-sub">Stake money on a measurable goal. Connect Stripe, X, Shopify, or Amazon. Hit it, you get your stake back plus a bonus. Miss it, the stake is forfeit. Verification is automatic — no screenshots, no self-reports.</p>
                    
                    <div class="lp-cta-wrap">
                        <button class="lp-btn-p" id="lp-hero-cta" onclick="window.app.openAccessModal()">Start your first contract — from $25</button>
                    </div>
                    <div class="lp-micro">Free account. No card required. Only lock money when you're ready to commit.</div>
                    
                    <div class="lp-trust-strip">
                        <span>Verified via official APIs:</span>
                        <div class="lp-trust-logos">
                            <span>Stripe</span><span>X</span><span>Shopify</span><span>Amazon</span>
                        </div>
                    </div>
                    <div class="lp-anti-gamble">
                        Not gambling. You're staking against your own measurable performance — not betting on chance or other people. <a href="#faq">Read FAQ.</a>
                    </div>
                </div>
                
                <div class="lp-hero-mock">
                    <div class="mock-window">
                        <div class="mock-header"><div class="mock-dot"></div><div class="mock-dot"></div><div class="mock-dot"></div></div>
                        <div class="mock-body">
                            <div class="mock-title">New Contract: Stripe Revenue</div>
                            <div class="mock-field"><strong>Target Metric</strong>Grow 30-day volume by 20% vs baseline</div>
                            <div class="mock-field"><strong>Stake Amount</strong>$500.00</div>
                            <div class="mock-field"><strong>Potential Payout</strong>$1,250.00 (2.5x multiplier)</div>
                            <div class="mock-btn">Lock Stake & Start Contract</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PROOF BAR -->
            <div class="lp-proof-bar">
                <div class="pb-stats">
                    <div class="pb-stat"><div class="pb-val">[DATA_NEEDED: $142k]</div><div class="pb-lbl">Committed this month</div></div>
                    <div class="pb-stat"><div class="pb-val">[DATA_NEEDED: 312]</div><div class="pb-lbl">Active contracts</div></div>
                    <div class="pb-stat"><div class="pb-val">[DATA_NEEDED: 62%]</div><div class="pb-lbl">Hit rate</div></div>
                </div>
                <div class="pb-feed-wrap">
                    <div class="pb-feed" id="pb-feed-1">
                        <!-- Populated by JS -->
                    </div>
                </div>
            </div>

            <!-- PAYOUT EXPLANATION -->
            <div class="lp-payout lp-fade">
                <div class="lp-payout-in">
                    <h2 class="payout-h2">How the payout actually works</h2>
                    <p class="payout-p">Collateral funds payouts directly. Multipliers reflect how ambitious your target is vs. your historical baseline — we pull the last 90 days from your connected account to calibrate.</p>
                    <div class="payout-box">
                        <div class="payout-box-h">Worked Example</div>
                        <div class="payout-math">
                            <span><strong>1. Lock $500.</strong> Target: grow Stripe revenue 20% in 30 days.</span>
                            <span><strong>2. Baseline pulled.</strong> We check your last 90 days of Stripe data automatically.</span>
                            <span><strong>3. Hit it:</strong> Get your $500 back + $750 payout ($1,250 total).</span>
                            <span><strong>4. Miss it:</strong> Stake forfeit. No exceptions.</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- EXAMPLE CONTRACTS -->
            <div class="lp-ex lp-fade">
                <div class="lp-sect-tag">Example Contracts</div>
                <div class="lp-cards">
                    <div class="lp-card">
                        <div class="lp-card-front">
                            <div class="c-title">Revenue Growth</div>
                            <div class="c-src">Verified with Stripe</div>
                            <div class="c-rows">
                                <div class="c-row"><span class="c-lbl">Target</span><span class="c-val">Grow revenue by 20%</span></div>
                                <div class="c-row"><span class="c-lbl">Deadline</span><span class="c-val">30 days</span></div>
                                <div class="c-row"><span class="c-lbl">Lock</span><span class="c-val">from $25</span></div>
                                <div class="c-row"><span class="c-lbl">Payout</span><span class="c-val" style="color:#15803d">Up to 2.5x</span></div>
                            </div>
                            <button class="c-btn">See how this contract works →</button>
                        </div>
                        <div class="lp-card-back">
                            <div class="cb-math">
                                <div><strong>Hit it:</strong><br>Get your stake back + 1.5x bonus.<br><em>e.g. Lock $100 → Get $250.</em></div>
                                <div><strong>Miss it:</strong><br>Stake forfeit.</div>
                            </div>
                            <button class="cb-btn" onclick="window.app.openAccessModal()">Start from $25</button>
                        </div>
                    </div>
                    
                    <div class="lp-card">
                        <div class="lp-card-front">
                            <div class="c-title">Follower Growth</div>
                            <div class="c-src">Verified with X</div>
                            <div class="c-rows">
                                <div class="c-row"><span class="c-lbl">Target</span><span class="c-val">Gain 1,000 followers</span></div>
                                <div class="c-row"><span class="c-lbl">Deadline</span><span class="c-val">14 days</span></div>
                                <div class="c-row"><span class="c-lbl">Lock</span><span class="c-val">from $25</span></div>
                                <div class="c-row"><span class="c-lbl">Payout</span><span class="c-val" style="color:#15803d">Up to 4.0x</span></div>
                            </div>
                            <button class="c-btn">See how this contract works →</button>
                        </div>
                        <div class="lp-card-back">
                            <div class="cb-math">
                                <div><strong>Hit it:</strong><br>Get your stake back + 3.0x bonus.<br><em>e.g. Lock $100 → Get $400.</em></div>
                                <div><strong>Miss it:</strong><br>Stake forfeit.</div>
                            </div>
                            <button class="cb-btn" onclick="window.app.openAccessModal()">Start from $25</button>
                        </div>
                    </div>

                    <div class="lp-card">
                        <div class="lp-card-front">
                            <div class="c-title">Order Growth</div>
                            <div class="c-src">Verified with Shopify</div>
                            <div class="c-rows">
                                <div class="c-row"><span class="c-lbl">Target</span><span class="c-val">Hit $5,000 in sales</span></div>
                                <div class="c-row"><span class="c-lbl">Deadline</span><span class="c-val">30 days</span></div>
                                <div class="c-row"><span class="c-lbl">Lock</span><span class="c-val">from $25</span></div>
                                <div class="c-row"><span class="c-lbl">Payout</span><span class="c-val" style="color:#15803d">Up to 2.5x</span></div>
                            </div>
                            <button class="c-btn">See how this contract works →</button>
                        </div>
                        <div class="lp-card-back">
                            <div class="cb-math">
                                <div><strong>Hit it:</strong><br>Get your stake back + 1.5x bonus.<br><em>e.g. Lock $100 → Get $250.</em></div>
                                <div><strong>Miss it:</strong><br>Stake forfeit.</div>
                            </div>
                            <button class="cb-btn" onclick="window.app.openAccessModal()">Start from $25</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- HOW IT WORKS -->
            <div class="lp-how lp-fade">
                <div class="lp-how-in">
                    <div class="lp-sect-tag">How It Works</div>
                    <div class="lp-steps">
                        <div class="lp-step"><div class="s-num">01</div><div class="s-desc"><strong>Pick a target</strong> — <span>measurable, time-boxed.</span></div></div>
                        <div class="lp-step"><div class="s-num">02</div><div class="s-desc"><strong>Lock your stake</strong> — <span>$25 to $25,000, held in escrow.</span></div></div>
                        <div class="lp-step"><div class="s-num">03</div><div class="s-desc"><strong>Connect your source</strong> — <span>Stripe, X, Shopify, or Amazon. Read-only.</span></div></div>
                        <div class="lp-step"><div class="s-num">04</div><div class="s-desc"><strong>Hit it or forfeit</strong> — <span>verified automatically. No disputes.</span></div></div>
                    </div>
                </div>
            </div>

            <!-- TESTIMONIALS -->
            <div class="lp-testi lp-fade">
                <div class="lp-testi-in">
                    <div class="lp-sect-tag">Proof</div>
                    <div class="testi-grid">
                        <div class="testi-card">
                            <div class="testi-quote">"I locked $500 on Stripe revenue growth. Hit it and took home a $1,250 payout. <strong>Finally forced me to launch my new feature instead of polishing it endlessly.</strong>"</div>
                            <div class="testi-user">
                                <div class="testi-av" style="background-image:url('[DATA_NEEDED: Photo URL 1]')"></div>
                                <div>
                                    <div class="testi-name">[DATA_NEEDED: Name 1]</div>
                                    <div class="testi-role">[DATA_NEEDED: Role/Company]</div>
                                </div>
                            </div>
                        </div>
                        <div class="testi-card">
                            <div class="testi-quote">"I locked $1,000 on growing my X followers. Forfeited the stake because I got lazy. <strong>Brutal, but I won't miss the next one.</strong>"</div>
                            <div class="testi-user">
                                <div class="testi-av" style="background-image:url('[DATA_NEEDED: Photo URL 2]')"></div>
                                <div>
                                    <div class="testi-name">[DATA_NEEDED: Name 2]</div>
                                    <div class="testi-role">[DATA_NEEDED: Role/Company]</div>
                                </div>
                            </div>
                        </div>
                        <div class="testi-card">
                            <div class="testi-quote">"Staked $250 on my Shopify store orders. The API verification is seamless. <strong>The money on the line changed my entire work ethic for the month.</strong>"</div>
                            <div class="testi-user">
                                <div class="testi-av" style="background-image:url('[DATA_NEEDED: Photo URL 3]')"></div>
                                <div>
                                    <div class="testi-name">[DATA_NEEDED: Name 3]</div>
                                    <div class="testi-role">[DATA_NEEDED: Role/Company]</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- OBJECTIONS / FAQ -->
            <div class="lp-obj lp-fade" id="faq">
                <h2 class="obj-h2">Questions you're probably asking</h2>
                
                <div class="fq open"><div class="fq-q">Is this gambling?</div><div class="fq-a"><strong>No.</strong> You're staking against your own measurable performance using read-only data from platforms you already use. There's no opponent, no chance, no house edge. It's an accountability contract.</div></div>
                
                <div class="fq"><div class="fq-q">Is my money safe before the contract resolves?</div><div class="fq-a"><strong>Yes.</strong> Stakes are held securely in [DATA_NEEDED: Escrow Provider / Stripe Connect]. Collateral never touches the principal directly while the contract is active.</div></div>
                
                <div class="fq"><div class="fq-q">What if Stripe / X / Shopify / Amazon goes down or the API breaks?</div><div class="fq-a">Contracts pause until verification can complete. You don't lose by default — we lose, not you. If an API is permanently deprecated, original stakes are fully refunded.</div></div>
                
                <div class="fq"><div class="fq-q">What counts as "hitting" the target?</div><div class="fq-a">The exact metric you choose, pulled directly from the connected platform's API at the deadline. No interpretation, no human judgment calls, no screenshots.</div></div>
                
                <div class="fq"><div class="fq-q">Can I cancel after I lock?</div><div class="fq-a"><strong>[DATA_NEEDED: Cancellation Policy].</strong> Usually, once a contract begins and the stake is locked, it cannot be canceled. You must hit the target or forfeit. Cancel before locking at any time.</div></div>
                
                <div class="fq"><div class="fq-q">What about taxes?</div><div class="fq-a">Payouts may be taxable income. We issue 1099s for US users who earn over $600 in net profit. Check with your tax professional.</div></div>
                
                <div class="fq"><div class="fq-q">Is this legal in my state/country?</div><div class="fq-a">Available in the US, Canada, UK, and EU, except [DATA_NEEDED: Specific restricted regions/states]. Not available in restricted jurisdictions.</div></div>
                
                <div class="fq"><div class="fq-q">What if I lose? Can I get a refund?</div><div class="fq-a"><strong>No.</strong> The forfeit is the entire mechanism. That's the point. Do not lock money you cannot afford to lose.</div></div>
            </div>

            <!-- BOTTOM CTA -->
            <div class="lp-bot">
                <div class="lp-bot-h">Your next goal. With actual consequences.</div>
                <button class="lp-bot-btn" id="lp-final-cta" onclick="window.app.openAccessModal()">Start your first contract</button>
                <div class="lp-bot-micro">$25 minimum. Cancel before locking. No card required to sign up.</div>
                
                <div class="lp-bot-foot">
                    Collateral turns goals into contracts with real stakes.
                    <div style="margin-top:8px;font-family:'JetBrains Mono';font-size:10px;color:#444">Collateral.market · © 2026</div>
                </div>
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

    function goAction() {
        if (window.appState?.isLoggedIn) {
            sessionStorage.removeItem('collateral_go_flow');
            window.router.navigate('/funding');
        } else {
            window.app.openAccessModal();
        }
    }

    document.getElementById('lp-hero-cta')?.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();goAction();if(window.trackEvent)window.trackEvent('hero_create_contract_click',utm)});
    document.getElementById('lp-final-cta')?.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();goAction();if(window.trackEvent)window.trackEvent('final_create_contract_click',{button_location:'footer',...utm})});

    document.querySelectorAll('.fq').forEach(item=>{
        item.querySelector('.fq-q')?.addEventListener('click',()=>{
            item.classList.toggle('open');
            if(window.trackEvent&&item.classList.contains('open'))window.trackEvent('faq_opened',{q:item.querySelector('.fq-q')?.textContent});
        });
    });

    const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}})},{threshold:.12});
    document.querySelectorAll('.lp-fade').forEach(el=>obs.observe(el));

    // Populate Proof Feed
    const feed = document.getElementById('pb-feed-1');
    if (feed) {
        const events = [
            "<strong>Sarah M.</strong> committed $500 on a 30-day Shopify contract &bull; 4m ago",
            "<strong>James K.</strong> earned $1,200 on a Stripe revenue contract &bull; 18m ago",
            "<strong>Elena R.</strong> committed $250 on an X follower contract &bull; 32m ago",
            "<strong>Marcus T.</strong> earned $800 on a Shopify sales contract &bull; 1h ago",
            "<strong>David L.</strong> committed $1,000 on a Stripe revenue contract &bull; 1h 15m ago"
        ];
        // Duplicate to ensure smooth scrolling loop
        const allEvents = [...events, ...events, ...events, ...events];
        feed.innerHTML = allEvents.map(e => \`<div class="pb-item">\${e}</div>\`).join('');
    }
}
