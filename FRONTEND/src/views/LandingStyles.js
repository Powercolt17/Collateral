// Landing Page Styles — /go — extracted for modularity
export const landingCSS = `
.lp{min-height:100vh;background:#fff;color:#111;font-family:'Sora',sans-serif;overflow-x:hidden}
.lp *,.lp *::before,.lp *::after{box-sizing:border-box}
@keyframes lpUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes scrollFeed{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes dotPulse{0%,100%{box-shadow:0 0 0 0 rgba(31,122,77,.4)}50%{box-shadow:0 0 0 6px rgba(31,122,77,0)}}
.lp-fade{opacity:0;transform:translateY(18px);transition:opacity .6s,transform .6s}.lp-fade.vis{opacity:1;transform:none}

/* HERO */
.lp-hero{padding:40px 24px 48px;max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:48px}
.lp-hero-left{flex:1;max-width:600px;animation:lpUp .7s ease both}
.lp-hero-right{flex:1;max-width:440px;animation:lpUp .7s ease both .1s;display:none}
@media(min-width:900px){.lp-hero-right{display:block}}
.lp-eyebrow{font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:1.5px;color:#5C1414;text-transform:uppercase;margin-bottom:16px;font-weight:600}
.lp-h1{font-size:46px;font-weight:900;color:#111;letter-spacing:-1.5px;line-height:1.08;margin:0 0 16px}
.lp-sub{font-size:16px;color:#444;line-height:1.65;margin:0 0 28px}
.lp-cta{display:inline-block;padding:16px 32px;background:#5C1414;color:#fff;font-size:14px;font-weight:800;letter-spacing:.4px;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:all .3s;box-shadow:0 4px 14px rgba(92,20,20,.2)}
.lp-cta:hover{background:#7a1e1e;box-shadow:0 6px 20px rgba(92,20,20,.3);transform:translateY(-1px)}
.lp-micro{font-size:12px;color:#777;margin:12px 0 24px}
.lp-trust{display:flex;align-items:center;gap:12px;font-size:12px;color:#111;font-weight:600;margin-bottom:8px;flex-wrap:wrap}
.lp-trust-logos{display:flex;gap:8px;flex-wrap:wrap}
.lp-trust-logos span{background:#f4f4f4;padding:4px 10px;border-radius:4px;font-size:10px;text-transform:uppercase;letter-spacing:1px;font-family:'JetBrains Mono',monospace;font-weight:500}
.lp-not-gambling{font-size:11px;color:#888;line-height:1.5;margin-top:4px}
.lp-not-gambling a{color:#5C1414;text-decoration:none}

/* MOCK */
.mock-win{background:#fff;border:1px solid #eaeaea;border-radius:12px;box-shadow:0 24px 48px rgba(0,0,0,.08);overflow:hidden}
.mock-bar{background:#fafafa;padding:12px 16px;border-bottom:1px solid #eaeaea;display:flex;gap:6px}
.mock-dot{width:10px;height:10px;border-radius:50%;background:#ddd}
.mock-bd{padding:24px}
.mock-t{font-size:14px;font-weight:700;margin-bottom:16px}
.mock-f{background:#f9f9f9;border:1px solid #eee;border-radius:6px;padding:12px;margin-bottom:12px;font-size:12px;color:#555}
.mock-f strong{color:#111;display:block;margin-bottom:4px}
.mock-b{background:#111;color:#fff;text-align:center;padding:12px;border-radius:6px;font-size:12px;font-weight:700;margin-top:8px}

/* PROOF BAR */
.lp-proof{background:#0a0a0a;color:#fff;padding:28px 0;overflow:hidden;border-bottom:3px solid #5C1414}
.pb-stats{display:flex;justify-content:center;gap:56px;margin-bottom:20px;max-width:1000px;margin-left:auto;margin-right:auto;padding:0 24px}
.pb-stat{text-align:center}
.pb-val{font-size:26px;font-weight:900;letter-spacing:-1px;margin-bottom:4px;font-family:'JetBrains Mono',monospace}
.pb-lbl{font-size:10px;text-transform:uppercase;letter-spacing:1.2px;color:#888}
.pb-live{display:inline-flex;align-items:center;gap:6px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:16px;padding-left:24px}
.pb-dot{width:6px;height:6px;border-radius:50%;background:#1F7A4D;animation:dotPulse 2s infinite}
.pb-feed-w{position:relative;width:100%;display:flex;overflow:hidden}
.pb-feed{display:flex;gap:32px;white-space:nowrap;animation:scrollFeed 40s linear infinite;min-width:200%}
.pb-feed:hover{animation-play-state:paused}
.pb-item{font-size:13px;color:#aaa;background:rgba(255,255,255,.05);padding:6px 16px;border-radius:20px}
.pb-item strong{color:#fff}

/* PAYOUT */
.lp-payout{padding:64px 24px;background:#fafafa;text-align:center}
.lp-payout-in{max-width:680px;margin:0 auto}
.po-h2{font-size:24px;font-weight:800;margin-bottom:8px;letter-spacing:-.5px}
.po-src{font-size:13px;color:#888;margin-bottom:24px}
.po-p{font-size:15px;color:#555;line-height:1.65;margin-bottom:24px;text-align:left}
.po-box{background:#fff;border:1px solid #eee;padding:24px;text-align:left;box-shadow:0 4px 12px rgba(0,0,0,.03);border-left:4px solid #5C1414}
.po-box-h{font-size:11px;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:1.5px;color:#5C1414;margin-bottom:12px;font-weight:700}
.po-math{font-size:14px;color:#333;line-height:1.6}
.po-math span{display:block;margin-bottom:8px;padding-bottom:8px;border-bottom:1px dashed #eee}
.po-math span:last-child{border:none;margin:0;padding:0}
.po-math strong{color:#111}

/* EXAMPLE CONTRACTS */
.lp-ex{max-width:1000px;margin:0 auto;padding:64px 24px}
.lp-tag{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:32px;text-align:center}
.lp-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.lp-card{border:1px solid #e5e5e5;padding:32px 24px 0;cursor:pointer;position:relative;background:#fff;display:flex;flex-direction:column;box-shadow:0 2px 8px rgba(0,0,0,.04);overflow:hidden;transition:transform .3s,box-shadow .3s}
.lp-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.08)}
.lp-card-front{transition:opacity .3s}
.lp-card-back{position:absolute;top:0;left:0;right:0;bottom:0;background:#111;color:#fff;padding:32px 24px;opacity:0;pointer-events:none;transition:opacity .3s;display:flex;flex-direction:column;justify-content:center}
.lp-card:hover .lp-card-front{opacity:.1}
.lp-card:hover .lp-card-back{opacity:1;pointer-events:auto}
.c-title{font-size:20px;font-weight:800;color:#111;margin-bottom:4px;letter-spacing:-.5px}
.c-min{font-size:11px;font-family:'JetBrains Mono',monospace;color:#5C1414;font-weight:700;margin-bottom:8px}
.c-src{font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:.5px;color:#555;margin-bottom:20px}
.c-rows{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
.c-row{display:flex;justify-content:space-between;font-size:13px;border-bottom:1px solid #f4f4f4;padding-bottom:4px}
.c-lbl{color:#777}.c-val{font-weight:700;color:#111}
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
.tg{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.tc{background:#fff;padding:24px;border:1px solid #eee;box-shadow:0 4px 12px rgba(0,0,0,.02)}
.tc-q{font-size:14px;color:#333;line-height:1.6;margin-bottom:20px;font-style:italic}
.tc-q strong{font-weight:700;font-style:normal;color:#111}
.tc-detail{font-size:11px;color:#888;font-family:'JetBrains Mono',monospace;margin-bottom:16px;line-height:1.5}
.tc-user{display:flex;align-items:center;gap:12px}
.tc-av{width:40px;height:40px;border-radius:50%;background:#ddd;background-size:cover;background-position:center;flex-shrink:0}
.tc-name{font-size:13px;font-weight:700;color:#111;margin:0}
.tc-role{font-size:11px;color:#777;margin:0}

/* OBJECTIONS */
.lp-obj{max-width:800px;margin:0 auto;padding:64px 24px}
.obj-h2{font-size:28px;font-weight:800;margin-bottom:32px;text-align:center;letter-spacing:-.5px}
.fq{border-bottom:1px solid #eee}
.fq-q{padding:20px 0;font-size:16px;font-weight:700;color:#111;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none}
.fq-q::after{content:'+';font-size:20px;color:#888;transition:transform .2s}
.fq.open .fq-q::after{content:'−'}
.fq-a{max-height:0;overflow:hidden;transition:max-height .3s;font-size:14px;color:#555;line-height:1.65}
.fq.open .fq-a{max-height:500px;padding-bottom:20px}
.fq-a strong{color:#111}

/* BOTTOM CTA */
.lp-bot{background:#0a0a0a;color:#fff;text-align:center;padding:80px 24px}
.lp-bot-h{font-size:34px;font-weight:900;margin-bottom:16px;letter-spacing:-1px}
.lp-bot-btn{padding:18px 48px;background:#5C1414;color:#fff;font-size:14px;font-weight:800;letter-spacing:.5px;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:all .3s;box-shadow:0 4px 20px rgba(92,20,20,.3);margin-bottom:16px}
.lp-bot-btn:hover{background:#7a1e1e;transform:translateY(-1px);box-shadow:0 6px 24px rgba(92,20,20,.4)}
.lp-bot-micro{font-size:13px;color:#888}
.lp-bot-foot{margin-top:64px;padding-top:32px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;color:#555}

@media(max-width:900px){
.lp-hero{flex-direction:column;text-align:center;padding-top:24px}
.lp-trust{justify-content:center;flex-direction:column;gap:8px}
.pb-stats{flex-direction:column;gap:20px}
.lp-cards,.tg,.lp-steps{grid-template-columns:1fr;gap:16px}
.lp-step{border-left:none;border-top:2px solid #eee;padding:16px 0 0}
.lp-h1{font-size:34px}
}
`;
