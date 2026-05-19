// Landing CSS — Conversion-optimized, institutional fintech
export const landingCSS = `
.lp{--bg:#F9F9F9;--p:#FFF;--t1:#111;--t2:#444;--t3:#888;--d:#E5E5E5;--r:#5C1414;--rh:#6B1212;--g:#15803D;min-height:100vh;background:var(--bg);color:var(--t1);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.lp *{box-sizing:border-box}

/* Promo Bar */
.lpromo-bar{position:fixed;top:0;left:0;right:0;height:32px;background:var(--r);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;z-index:100;font-family:'Inter',sans-serif}

/* Nav */
.ln{position:fixed;top:32px;left:0;right:0;z-index:50;background:rgba(249,249,249,.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--d)}
.ln-in{max-width:1080px;margin:0 auto;padding:0 24px;height:56px;display:flex;justify-content:space-between;align-items:center}
.ln-brand{font-family:'Inter Tight',sans-serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--t1);text-decoration:none}
.ln-cta{background:var(--r) !important;color:#fff !important;font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;padding:9px 20px;border:none;cursor:pointer;transition:background .15s}
.ln-cta:hover{background:var(--rh) !important}

/* Shared */
.lw{max-width:1080px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
.lhr{height:1px;background:var(--d);width:100%}
.lmono{font-family:'Inter',monospace;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--t3)}
.lred-dash{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.lred-dash::before{content:'';width:28px;height:2px;background:var(--r)}
[data-r]{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
[data-r].v{opacity:1;transform:none}

/* ═══ HERO ═══ */
.lhero-grid{display:grid;grid-template-columns:1.25fr 0.75fr;gap:64px;align-items:center;padding:120px 0 40px}
.lh1{font-family:'Inter Tight',sans-serif;font-weight:400;font-size:clamp(36px,5.5vw,56px);line-height:.95;letter-spacing:-0.5px;color:var(--t1);margin:0 0 20px;max-width:850px}
.lh1 em{font-style:normal;color:var(--r);font-weight:500;letter-spacing:-0.5px}
.lh-nobrk{display:inline}
.lh-br{display:none}
@media(min-width:768px){
  .lh-nobrk{white-space:nowrap}
  .lh-br{display:block}
}
.lsub{font-size:17px;color:var(--t2);line-height:1.6;margin:0 0 28px;max-width:540px;letter-spacing:-.2px}
.lctas{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.lbtn{height:48px;padding:0 28px;font-size:12px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .15s;font-family:'Inter',sans-serif}
.lbtn-r{background:var(--r) !important;color:#fff !important;box-shadow:0 2px 8px rgba(92,20,20,.15)}.lbtn-r:hover{background:var(--rh) !important;box-shadow:0 4px 16px rgba(92,20,20,.2);transform:translateY(-1px)}
.lbtn-g{background:var(--p);color:var(--t2);border:1px solid var(--d)}.lbtn-g:hover{border-color:#bbb;color:var(--t1)}
.lcta-match{font-size:14px;color:var(--t1);margin-top:16px;font-weight:700;display:flex;align-items:center;gap:8px;letter-spacing:-.1px}
.lcta-match::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--r)}
.ltrust-bar{font-size:11px;color:var(--t2);margin-top:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;display:flex;align-items:center;gap:6px}
.ltrust-bar::before{content:'✓';color:var(--g);font-weight:bold;font-size:12px}

/* Preview Card */
.lhero-right{display:flex;justify-content:center;align-items:center}
.lpreview-card{background:var(--p);border:1px solid var(--d);padding:24px;width:100%;max-width:360px;box-shadow:0 12px 32px rgba(0,0,0,.03);position:relative}
.lpcard-badge{position:absolute;top:-10px;left:20px;background:var(--t1);color:#fff;font-family:'Inter',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:4px 8px;border-radius:2px}
.lpcard-src{font-family:'Inter',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--t3);margin-bottom:6px}
.lpcard-title{font-family:'Inter Tight',sans-serif;font-size:22px;font-weight:600;color:var(--t1);margin-bottom:20px;letter-spacing:-.4px}
.lpcard-row{display:flex;justify-content:space-between;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(229,229,229,.6)}
.lpcard-row .k{color:var(--t3)}
.lpcard-row .v{font-weight:600;color:var(--t1)}
.lpcard-outcome{margin-top:20px;background:var(--bg);padding:14px;border:1px solid var(--d)}
.lpcard-outcome-title{font-family:'Inter',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--t3);margin-bottom:8px}
.lpcard-outcome-item{font-size:12px;font-weight:500;display:flex;align-items:center;gap:8px;margin-bottom:6px}
.lpcard-outcome-item:last-child{margin-bottom:0}
.lpcard-outcome-item.success{color:var(--g)}
.lpcard-outcome-item.success .dot{width:6px;height:6px;border-radius:50%;background:var(--g)}
.lpcard-outcome-item.failure{color:var(--r)}
.lpcard-outcome-item.failure .dot{width:6px;height:6px;border-radius:50%;background:var(--r)}

/* ═══ LIVE CONTRACTS ═══ */
.lcontracts{padding:40px 0 64px;background:var(--p);border-top:1px solid var(--d);border-bottom:1px solid var(--d)}
.lcontracts .lw{max-width:1280px}
.lcards{display:grid;grid-template-columns:repeat(4,1fr);gap:32px}
.lcard{border:1px solid var(--d);padding:36px 32px;display:flex;flex-direction:column;transition:border-color .15s,box-shadow .15s;background:var(--p)}
.lcard:hover{border-color:#bbb;box-shadow:0 4px 16px rgba(0,0,0,.04)}
.lcard-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
.lcard-src{font-family:'Inter',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--t3)}
.lcard-tier{font-family:'Inter',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:3px 8px}
.tier-pledge{color:var(--g);background:rgba(21,128,61,.06);border:1px solid rgba(21,128,61,.15)}
.tier-stake{color:#B45309;background:rgba(180,83,9,.06);border:1px solid rgba(180,83,9,.15)}
.tier-allin{color:var(--r);background:rgba(92,20,20,.05);border:1px solid rgba(92,20,20,.12)}
.lcard-title{font-family:'Inter Tight',sans-serif;font-size:19px;font-weight:600;color:var(--t1);margin-bottom:6px;letter-spacing:-.3px}
.lcard-target{font-size:13px;color:var(--t2);margin-bottom:24px;line-height:1.4}
.lcard-row{display:flex;justify-content:space-between;font-size:12px;padding:8px 0;border-bottom:1px solid rgba(229,229,229,.5)}
.lcard-row:last-of-type{border:none}
.lcard-row .k{color:var(--t3)}
.lcard-row .v{font-weight:600;color:var(--t1)}
.lcard-btn{margin-top:auto;padding-top:20px}
.lcard-btn button{width:100%;height:44px;background:var(--t1);color:#fff;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;transition:background .15s}
.lcard-btn button:hover{background:var(--r)}

/* ═══ HOW IT WORKS ═══ */
.lhow{padding:48px 0}
.lhow-h{font-family:'Inter Tight',sans-serif;font-size:clamp(24px,3.5vw,36px);font-weight:400;letter-spacing:-.5px;margin-bottom:8px}
.lhow-h strong{font-weight:700;color:var(--r)}
.lhow-sub{font-size:14px;color:var(--t2);margin-bottom:32px;max-width:480px}
.lsteps{display:grid;grid-template-columns:repeat(4,1fr);gap:0;background:var(--p);border:1px solid var(--d)}
.lstep{padding:32px 24px;border-right:1px solid var(--d)}
.lstep:last-child{border-right:none}
.lstep-num{font-family:'Inter Tight',sans-serif;font-size:48px;font-weight:700;color:var(--r) !important;opacity:0.25;line-height:1;margin-bottom:16px}
.lstep-h{font-family:'Inter Tight',sans-serif;font-size:14px;font-weight:600;color:var(--t1);margin-bottom:8px;text-transform:uppercase;letter-spacing:.3px}
.lstep-p{font-size:13px;color:var(--t2);line-height:1.55}

/* Mini CTA Block */
.lmini-cta{text-align:center;background:var(--p);border:1px solid var(--d);padding:48px 32px;margin:32px auto 48px;max-width:640px}
.lmini-cta-h{font-family:'Inter Tight',sans-serif;font-size:24px;font-weight:600;margin-bottom:8px;letter-spacing:-.4px;color:var(--t1)}
.lmini-cta-p{font-size:14px;color:var(--t1);font-weight:700;margin-bottom:24px}
.lmini-cta-micro{font-size:11px;color:var(--t3);margin-top:12px;font-weight:500;text-transform:uppercase;letter-spacing:1.5px}

/* ═══ LOGO MARQUEE CAROUSEL ═══ */
.lmarquee{padding:32px 0;border-top:1px solid var(--d);border-bottom:1px solid var(--d);background:var(--p);overflow:hidden;position:relative}
.lmarquee-label{text-align:center;margin-bottom:16px}
.lmarquee-track{display:flex;overflow:hidden;width:100%;position:relative}
.lmarquee-track::before,.lmarquee-track::after{content:'';position:absolute;top:0;bottom:0;width:100px;z-index:2;pointer-events:none}
.lmarquee-track::before{left:0;background:linear-gradient(to right,var(--p),transparent)}
.lmarquee-track::after{right:0;background:linear-gradient(to left,var(--p),transparent)}
.lmarquee-slide{display:flex;align-items:center;gap:180px;padding:4px 180px 4px 0;animation:marquee 28s linear infinite;flex-shrink:0}
.lmarquee-slide img{opacity:.55;transition:opacity .3s;flex-shrink:0;filter:grayscale(1)}
.lmarquee-slide img:hover{opacity:.9}
.lmarquee-slide img.logo-stripe{height:50px}
.lmarquee-slide img.logo-x{height:34px;margin:0 8px}
.lmarquee-slide img.logo-shopify{height:52px}
.lmarquee-slide img.logo-youtube{height:44px}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}

@media(max-width:767px){
  .lmarquee{padding:20px 0}
  .lmarquee-slide{gap:100px;padding-right:100px;animation-duration:18s}
  .lmarquee-slide img.logo-stripe{height:36px}
  .lmarquee-slide img.logo-x{height:24px;margin:0 6px}
  .lmarquee-slide img.logo-shopify{height:38px}
  .lmarquee-slide img.logo-youtube{height:32px}
}

/* ═══ CONTRACT TYPES ═══ */
.ltypes{padding:48px 0}
.ltypes-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.ltype{background:var(--p);border:1px solid var(--d);padding:32px}
.ltype-badge{font-family:'Inter',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px;display:inline-block;padding:3px 10px}
.ltype-h{font-family:'Inter Tight',sans-serif;font-size:22px;font-weight:600;letter-spacing:-.3px;margin-bottom:8px}
.ltype-p{font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:20px}
.ltype-detail{font-size:12px;color:var(--t3);line-height:1.5;padding-top:16px;border-top:1px solid var(--d)}

/* ═══ EXAMPLE ═══ */
.lex{padding:48px 0;text-align:center}
.lex-box{background:var(--p);border:1px solid var(--d);max-width:540px;margin:0 auto;text-align:left}
.lex .lred-dash{justify-content:center}
.lex .lhow-sub{margin-left:auto;margin-right:auto}
.lex-head{background:var(--bg);border-bottom:1px solid var(--d);padding:14px 24px}
.lex-row{display:flex;justify-content:space-between;padding:12px 24px;font-size:13px;border-bottom:1px solid rgba(229,229,229,.4)}
.lex-row:last-child{border:none}
.lex-row .k{color:var(--t2)}
.lex-row .v{font-weight:600;color:var(--t1)}
.lex-row .v.green{color:var(--g)}
.lex-row .v.red{color:var(--r)}

/* ═══ FAQ ═══ */
.lfaq{padding:48px 0;text-align:center}
.lfaq-wrap{max-width:640px;margin:0 auto;text-align:left}
.lfaq .lred-dash{justify-content:center}
.fq{border-bottom:1px solid var(--d)}.fq-q{padding:18px 0;font-family:'Inter Tight',sans-serif;font-size:15px;font-weight:600;color:var(--t1);cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none}.fq-q::after{content:'+';font-size:16px;color:var(--t3)}.fq.open .fq-q::after{content:'\\2212'}.fq-a{max-height:0;overflow:hidden;transition:max-height .3s;font-size:13px;color:var(--t2);line-height:1.6}.fq.open .fq-a{max-height:400px;padding-bottom:18px}.fq-a strong{color:var(--t1);font-weight:600}

/* ═══ FINAL CTA ═══ */
.lfoot{background:var(--t1);text-align:center;padding:80px 24px 96px}
.lfoot-h{font-family:'Inter Tight',sans-serif;font-size:clamp(24px,4vw,36px);font-weight:400;color:#fff;letter-spacing:-.5px;line-height:1.1;margin-bottom:8px}
.lfoot-h em{font-style:normal;color:var(--r);font-weight:500}
.lfoot-sub{font-size:14px;color:rgba(255,255,255,.85);font-weight:600;margin-bottom:24px}
.lfoot-btn{display:inline-flex;height:48px;padding:0 32px;align-items:center;background:var(--r) !important;color:#fff !important;font-size:12px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;border:none;cursor:pointer;transition:all .15s}.lfoot-btn:hover{background:var(--rh) !important}
.lfoot-micro{font-size:12px;color:rgba(255,255,255,.6);margin-top:16px;font-weight:500;letter-spacing:.5px}
.lfoot-line{margin-top:48px;padding-top:20px;border-top:1px solid rgba(255,255,255,.06);font-size:10px;color:rgba(255,255,255,.15);font-family:'Inter',monospace;text-transform:uppercase;letter-spacing:1.5px}

/* Inline CTA row */
.lcta-row{padding:32px 0 40px;text-align:center;border-top:1px solid var(--d)}
.lcta-row-sub{font-size:13px;color:var(--t1);margin-top:12px;font-weight:700;letter-spacing:.2px}

/* ═══ RESPONSIVE ═══ */
@media(max-width:768px){
.lhero-grid{grid-template-columns:1fr;gap:40px;padding:100px 0 40px}
.lhero-right{display:none}
.lcards{grid-template-columns:1fr 1fr;gap:20px}
.lcard{padding:28px 24px}
.lsteps{grid-template-columns:1fr 1fr}
.lstep{border-right:none;border-bottom:1px solid var(--d)}
.lstep:nth-child(2){border-right:1px solid var(--d)}
.lstep:nth-child(4){border-bottom:none}
.lstep:nth-child(3){border-bottom:none}
.ltypes-grid{grid-template-columns:1fr}
.lctas{flex-direction:column}.lbtn{width:100%;justify-content:center}
}
@media(max-width:480px){
.lcards{grid-template-columns:1fr;gap:16px}
.lcard{padding:24px 20px}
.lsteps{grid-template-columns:1fr}
.lstep{border-right:none!important}
}
`;
