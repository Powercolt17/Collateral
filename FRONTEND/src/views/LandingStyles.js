// Landing CSS — Conversion-optimized, institutional fintech
export const landingCSS = `
.lp{--bg:#F9F9F9;--p:#FFF;--t1:#111;--t2:#444;--t3:#888;--d:#E5E5E5;--r:#5C1414;--rh:#6B1212;--g:#15803D;min-height:100vh;background:var(--bg);color:var(--t1);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;opacity:0;transform:translateY(10px);transition:opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)}
.lp.v{opacity:1;transform:translateY(0)}
.lp *{box-sizing:border-box}
.lloading-bar{position:fixed;top:0;left:0;height:2px;background:var(--r);z-index:1000;width:0;transition:width 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;box-shadow:0 0 8px var(--r)}

/* Entry Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.97) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) both; }
.animate-scale-in { animation: scaleIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) both; }
.delay-1 { animation-delay: 120ms; }
.delay-2 { animation-delay: 240ms; }
.delay-3 { animation-delay: 360ms; }
.delay-4 { animation-delay: 480ms; }

/* Promo Bar */
@keyframes promoShine {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}
@keyframes promoSweep {
  0% { transform: translateX(-150%) skewX(-15deg); }
  30%, 100% { transform: translateX(250%) skewX(-15deg); }
}
.lpromo-bar{position:fixed;top:0;left:0;right:0;height:32px;background:linear-gradient(90deg, var(--r), #8B2020, #a12323, #8B2020, var(--r));background-size:200% auto;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;z-index:60;animation:promoShine 5s linear infinite;overflow:hidden;text-shadow:0 1px 2px rgba(0,0,0,.2)}
.lpromo-bar::before{content:'';position:absolute;top:0;left:-50%;width:50%;height:100%;background:linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);animation:promoSweep 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;pointer-events:none}

/* Nav */
.ln{position:fixed;top:32px;left:0;right:0;z-index:50;background:var(--bg);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.ln-in{max-width:none;width:100%;padding:0 48px;height:72px;display:flex;justify-content:space-between;align-items:center}
.ln-brand{font-family:'Inter Tight',sans-serif;font-size:16px;font-weight:800;letter-spacing:3.5px;text-transform:uppercase;color:var(--t1);text-decoration:none;display:inline-flex;align-items:center;gap:14px}
.ln-logo{width:32px;height:32px;color:var(--r);fill:currentColor;flex-shrink:0}
.ln-cta{background:var(--r) !important;color:#fff !important;font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;padding:12px 24px;border:none;cursor:pointer;transition:all .3s cubic-bezier(.16, 1, 0.3, 1)}
.ln-cta:hover{background:var(--rh) !important;transform:scale(1.02)}
.ln-cta::after{content:'→';opacity:0;transform:translateX(-6px);transition:all .25s cubic-bezier(.16, 1, 0.3, 1);display:inline-block;width:0;margin-left:0}
.ln-cta:hover::after{opacity:1;transform:translateX(0);width:auto;margin-left:8px}
.ch-hamburger { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid transparent; cursor: pointer; position: relative; transition: border-color 0.2s, background 0.2s; flex-shrink: 0; margin-left: 16px; }
.ch-hamburger:hover { border-color: #e5e5e5; background: #fafafa; }
.ch-hamburger-lines { width: 18px; height: 14px; display: flex; flex-direction: column; justify-content: space-between; }
.ch-hamburger-lines span { display: block; width: 100%; height: 1.5px; background: #333; transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease; transform-origin: center; }
.ch-hamburger-lines span:nth-child(2) { width: 12px; margin-left: auto; }

/* Shared */
.lw{max-width:1080px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
.lhr{height:1px;background:var(--d);width:100%}
.lmono{font-family:'Inter',monospace;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--t3)}
.lred-dash{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.lred-dash::before{content:'';width:28px;height:2px;background:var(--r)}
[data-r]{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
[data-r].v{opacity:1;transform:none}

/* ═══ HERO ═══ */
.lhero-grid{display:grid;grid-template-columns:1.1fr 0.9fr;gap:48px;align-items:center;padding:160px 0 80px}
.lh1{font-family:'Inter Tight',sans-serif;font-weight:400;font-size:clamp(48px,6vw,72px);line-height:.95;letter-spacing:-1.5px;color:var(--t1);margin:0 0 24px;max-width:600px}
.lh1 em{font-style:normal;color:var(--r);font-weight:600;letter-spacing:-1.5px}
.lh-nobrk{display:inline}
.lh-br{display:none}
@media(min-width:768px){
  .lh-nobrk{white-space:nowrap}
  .lh-br{display:block}
}
.lsub{font-size:20px;color:var(--t2);line-height:1.5;margin:0 0 40px;max-width:680px;letter-spacing:-.2px}
.lctas{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px}
.lbtn{height:56px;padding:0 32px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:all .4s cubic-bezier(.16, 1, 0.3, 1);font-family:'Inter',sans-serif;position:relative;overflow:hidden}
.lbtn-r{background:var(--r) !important;color:#fff !important;box-shadow:0 8px 24px -6px rgba(92,20,20,.4)}
.lbtn-r:hover{background:var(--rh) !important;box-shadow:0 12px 32px -8px rgba(92,20,20,.6);transform:translateY(-2px) scale(1.02)}
.lbtn-r::after{content:'→';opacity:0;transform:translateX(-8px);transition:all .3s cubic-bezier(.16, 1, 0.3, 1);display:inline-block;width:0;margin-left:0}
.lbtn-r:hover::after{opacity:1;transform:translateX(0);width:auto;margin-left:10px}
.lbtn-g{background:var(--p);color:var(--t2);border:1px solid var(--d)}
.lbtn-g:hover{border-color:#bbb;color:var(--t1);transform:translateY(-1px)}
.lcta-match{font-size:14px;color:var(--t1);margin-top:16px;font-weight:700;display:flex;align-items:center;gap:8px;letter-spacing:-.1px}
.lcta-match::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--r)}
.ltrust-bar{font-size:11px;color:var(--t2);margin-top:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;display:flex;align-items:center;gap:6px}
.ltrust-bar::before{content:'✓';color:var(--g);font-weight:bold;font-size:12px}

/* ═══ PREVIEW CONTRACT CARD ═══ */
@keyframes premiumFloat {
  0%, 100% { 
    transform: translateY(0);
    box-shadow: 0 12px 40px -12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03);
  }
  50% { 
    transform: translateY(-6px);
    box-shadow: 0 24px 50px -16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03);
  }
}
@keyframes heroGlow {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.5; }
}
@keyframes cardSheen {
  0%, 20% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
  25% { opacity: 0.4; }
  30%, 100% { transform: translateX(150%) skewX(-20deg); opacity: 0; }
}
.lhero-right{display:flex;justify-content:center;align-items:center;position:relative;perspective:1200px}
.lhero-right::before{content:'';position:absolute;width:400px;height:400px;background:radial-gradient(circle, rgba(92,20,20,0.06) 0%, transparent 65%);z-index:0;animation:heroGlow 8s ease-in-out infinite;border-radius:50%}
.lpreview-card{background:var(--p);border:1px solid rgba(0,0,0,0.05);width:100%;max-width:400px;position:relative;overflow:hidden;border-radius:14px;animation:premiumFloat 8s ease-in-out infinite;transform-style:preserve-3d;will-change:transform,box-shadow;z-index:1}
.lpreview-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--r),#8B2020,var(--r));z-index:10}
.lpreview-card::after{content:'';position:absolute;top:0;left:-50%;width:150%;height:100%;background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);z-index:5;animation:cardSheen 8s ease-in-out infinite;pointer-events:none}

.lpcard-header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px 0}
.lpcard-type{font-family:'Inter Tight',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:var(--t1)}
.lpcard-status{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--g);background:rgba(21,128,61,.06);border:1px solid rgba(21,128,61,.15);padding:3px 8px;border-radius:2px}
.lpcard-status-dot{width:5px;height:5px;border-radius:50%;background:var(--g);animation:statusPulse 2s ease-in-out infinite}
@keyframes statusPulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(21,128,61,.4)}50%{opacity:.7;box-shadow:0 0 0 4px rgba(21,128,61,0)}}
.lpcard-divider{height:1px;background:var(--d);margin:12px 20px}
.lpcard-title{font-family:'Inter Tight',sans-serif;font-size:18px;font-weight:700;color:var(--t1);padding:0 20px 14px;letter-spacing:-.3px}

.lpcard-terms{padding:0 20px 16px}
.lpcard-term{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(229,229,229,.5)}
.lpcard-term:last-child{border-bottom:none}
.lpcard-term-k{font-size:12px;color:var(--t3);font-weight:500}
.lpcard-term-v{font-size:13px;font-weight:700;color:var(--t1);font-family:'SF Mono','Fira Code','Consolas',monospace;letter-spacing:-.2px}
.lpcard-term-highlight{color:var(--t1);background:rgba(17,17,17,.04);padding:2px 6px;border-radius:2px;font-weight:800}

.lpcard-outcome{padding:12px 20px 16px;border-top:1px solid var(--d)}
.lpcard-outcome-row{display:flex;align-items:center;gap:8px;padding:6px 10px;margin-bottom:4px;border-radius:2px;font-size:12px;font-weight:600}
.lpcard-outcome-row:last-child{margin-bottom:0}
.lpcard-outcome-hit{background:rgba(21,128,61,.04);border:1px solid rgba(21,128,61,.1)}
.lpcard-outcome-miss{background:rgba(92,20,20,.03);border:1px solid rgba(92,20,20,.08)}
.lpcard-outcome-icon{font-size:13px;font-weight:700;line-height:1}
.lpcard-outcome-hit .lpcard-outcome-icon{color:var(--g)}
.lpcard-outcome-miss .lpcard-outcome-icon{color:var(--r)}
.lpcard-outcome-text{flex:1;color:var(--t2);font-weight:500}
.lpcard-outcome-result{font-family:'SF Mono','Fira Code','Consolas',monospace;font-weight:700;letter-spacing:-.3px}
.lpcard-outcome-hit .lpcard-outcome-result{color:var(--g)}
.lpcard-outcome-miss .lpcard-outcome-result{color:var(--r)}



/* ═══ FLOATING BADGES ═══ */
.lbadge-glass {
    position: absolute;
    background: rgba(17, 17, 17, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
    padding: 8px 12px;
    border-radius: 6px;
    z-index: 20;
    animation: premiumFloat 6s ease-in-out infinite;
    display: flex;
    align-items: center;
    gap: 8px;
    pointer-events: none;
}
.lbadge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
}
@keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
}
.lbadge-num {
    font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #FFF;
    letter-spacing: -0.2px;
}
.lbadge-txt {
    font-family: 'Inter Tight', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* ═══ LIVE CONTRACTS ═══ */
.lcontracts{padding:40px 0 64px;background:var(--p);border-top:1px solid var(--d)}
.lcontracts .lw{max-width:1280px}
.lcards{display:grid;grid-template-columns:repeat(4,1fr);gap:32px}
.lcard{border:1px solid var(--d);padding:36px 32px;display:flex;flex-direction:column;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);background:var(--p);position:relative}
.lcard::before{content:'';position:absolute;top:-1px;left:0;right:0;height:2px;background:var(--r);transform:scaleX(0);transform-origin:left;transition:transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)}
.lcard:hover::before{transform:scaleX(1)}
.lcard:hover{border-color:#bbb;box-shadow:0 8px 24px rgba(0,0,0,.06);transform:translateY(-3px)}
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
.lcard-btn button{width:100%;height:44px;background:var(--t1);color:#fff;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center}
.lcard-btn button:hover{background:var(--r);transform:scale(1.02)}
.lcard-btn button::after{content:'→';opacity:0;transform:translateX(-6px);transition:all .25s cubic-bezier(.16, 1, 0.3, 1);display:inline-block;width:0;margin-left:0}
.lcard-btn button:hover::after{opacity:1;transform:translateX(0);width:auto;margin-left:6px}

/* ═══ HOW IT WORKS ═══ */
.lhow{padding:100px 0}
.lhow-h{font-family:'Inter Tight',sans-serif;font-size:clamp(32px,5vw,56px);font-weight:400;letter-spacing:-1px;margin-bottom:16px}
.lhow-h strong{font-weight:700;color:var(--r)}
.lhow-sub{font-size:18px;color:var(--t2);margin-bottom:64px;max-width:640px;line-height:1.6}
.lsteps{display:grid;grid-template-columns:repeat(4,1fr);gap:40px;background:transparent;border:none}
.lstep{padding:32px 0 0 0;border:none;border-top:1px solid rgba(0,0,0,0.08)}
.lstep-num{font-family:'Inter Tight',sans-serif;font-size:56px;font-weight:400;color:var(--r) !important;opacity:0.3;line-height:1;margin-bottom:24px;letter-spacing:-2px}
.lstep-h{font-family:'Inter Tight',sans-serif;font-size:22px;font-weight:600;color:var(--t1);margin-bottom:12px;letter-spacing:-.4px}
.lstep-p{font-size:16px;color:var(--t2);line-height:1.65}

/* Mini CTA Block */
.lmini-cta{text-align:center;background:transparent;border:none;padding:100px 0;margin:0 auto;max-width:800px}
.lmini-cta-h{font-family:'Inter Tight',sans-serif;font-size:40px;font-weight:600;margin-bottom:16px;letter-spacing:-1px;color:var(--t1)}
.lmini-cta-p{font-size:18px;color:var(--t2);margin-bottom:40px;line-height:1.6}
.lmini-cta-micro{font-size:12px;color:var(--t3);margin-top:20px;font-weight:500;text-transform:uppercase;letter-spacing:2px}

/* ═══ LOGO MARQUEE CAROUSEL ═══ */
.lmarquee{padding:32px 0;border-bottom:1px solid var(--d);background:var(--p);overflow:hidden;position:relative}
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
.ltypes{padding:100px 0}
.ltypes-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px}
.ltype{background:transparent;border:none;padding:40px 0 0 0;border-top:1px solid rgba(0,0,0,0.08)}
.ltype-badge{font-family:'Inter',monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:24px;display:inline-block;padding:0;background:transparent!important;border:none!important}
.ltype-h{font-family:'Inter Tight',sans-serif;font-size:36px;font-weight:600;letter-spacing:-1px;margin-bottom:16px}
.ltype-p{font-size:18px;color:var(--t2);line-height:1.65;margin-bottom:32px}
.ltype-detail{font-size:15px;color:var(--t2);line-height:1.6;padding-top:24px;border-top:1px dashed rgba(0,0,0,0.08)}



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
.lfoot-btn{display:inline-flex;height:48px;padding:0 32px;align-items:center;justify-content:center;background:var(--r) !important;color:#fff !important;font-size:12px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;border:none;cursor:pointer;transition:all .3s cubic-bezier(.16, 1, 0.3, 1);position:relative;overflow:hidden}
.lfoot-btn:hover{background:var(--rh) !important;transform:scale(1.02)}
.lfoot-btn::after{content:'→';opacity:0;transform:translateX(-6px);transition:all .25s cubic-bezier(.16, 1, 0.3, 1);display:inline-block;width:0;margin-left:0}
.lfoot-btn:hover::after{opacity:1;transform:translateX(0);width:auto;margin-left:8px}
.lfoot-micro{font-size:12px;color:rgba(255,255,255,.6);margin-top:16px;font-weight:500;letter-spacing:.5px}
.lfoot-line{margin-top:48px;padding-top:20px;border-top:1px solid rgba(255,255,255,.06);font-size:10px;color:rgba(255,255,255,.15);font-family:'Inter',monospace;text-transform:uppercase;letter-spacing:1.5px}

/* ═══ RESPONSIVE ═══ */
@media(max-width:768px){
  .ln-in{padding:0 20px}
  .ln-cta{padding:8px 14px; font-size:10px; letter-spacing:0.5px}
  .lhero-grid{grid-template-columns:1fr;gap:32px;padding:130px 0 24px}
  .lhero-right{display:none}
  .lh1{font-size:clamp(38px, 11vw, 48px);line-height:1.05;letter-spacing:-1px}
  .lsub{font-size:16px;margin-bottom:24px}
  .lbtn{height:48px;padding:0 24px;font-size:11px}
  .lcards{grid-template-columns:1fr 1fr;gap:16px}
  .lcard{padding:20px;min-height:auto}
  .lcard-title{font-size:17px;margin-bottom:4px}
  .lcard-target{font-size:12px;margin-bottom:16px}
  .lcard-row{padding:6px 0;font-size:11px}
  .lcard-btn{padding-top:16px}
  .lcontracts{padding:32px 0 48px}
  .lhow{padding:48px 0}
  .lhow-h{font-size:28px}
  .lhow-sub{margin-bottom:32px;font-size:14px}
  .lsteps{grid-template-columns:1fr;gap:24px}
  .lstep{padding:24px 0 0 0;border-top:1px solid rgba(0,0,0,0.08)}
  .lstep-num{font-size:32px;margin-bottom:12px}
  .lstep-h{font-size:16px}
  .lstep-p{font-size:14px}
  .lmini-cta{padding:48px 20px;margin:24px auto}
  .lmini-cta-h{font-size:24px}
  .lmini-cta-p{font-size:14px;margin-bottom:24px}
  .lmini-cta-micro{font-size:11px}
  .ltypes{padding:48px 0}
  .ltypes-grid{grid-template-columns:1fr;gap:32px}
  .ltype{padding:24px 0 0 0}
  .ltype-badge{font-size:11px;margin-bottom:16px}
  .ltype-h{font-size:22px;margin-bottom:8px}
  .ltype-p{font-size:14px;margin-bottom:20px}
  .ltype-detail{font-size:13px;padding-top:16px}
  .lex{padding:32px 0}
  .lex-box{margin:0 auto}
  .lfaq{padding:32px 0}
  .fq-q{font-size:14px;padding:14px 0}
  .lfoot{padding:48px 20px 64px}
  .lctas{flex-direction:column}.lbtn{width:100%;justify-content:center}
}
@media(max-width:540px){
  .lcards{grid-template-columns:1fr;gap:16px}
  .lsteps{grid-template-columns:1fr}
  .lstep{border-right:none!important;border-bottom:1px solid var(--d)!important}
  .lstep:last-child{border-bottom:none!important}
}
`;
