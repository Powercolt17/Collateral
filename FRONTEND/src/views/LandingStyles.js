// Landing CSS — Elite fintech conversion page
export const landingCSS = `
.lp{--bg:#FAFAFA;--p:#FFF;--t1:#111;--t2:#444;--t3:#888;--d:#E5E5E5;--r:#5C1414;--rh:#6B1212;--g:#145c14;min-height:100vh;background:var(--bg);color:var(--t1);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;opacity:0;transform:translateY(10px);transition:opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)}
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
@keyframes textShine {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}
.lpromo-bar{position:fixed;top:0;left:0;right:0;height:32px;background-color:var(--r);display:flex;align-items:center;justify-content:center;text-align:center;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;z-index:60;box-shadow:0 2px 12px rgba(92,20,20,.4)}
.promo-text{background:linear-gradient(to right, rgba(255,255,255,0.6) 20%, #fff 40%, #fff 60%, rgba(255,255,255,0.6) 80%);background-size:200% auto;color:transparent;-webkit-background-clip:text;background-clip:text;animation:textShine 4s linear infinite;text-shadow: 0 1px 1px rgba(0,0,0,0.1)}

/* Nav */
.ln{position:fixed;top:32px;left:0;right:0;z-index:50;background:rgba(250,250,250,0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,0.04)}
.ln-in{max-width:none;width:100%;padding:0 48px;height:72px;display:flex;justify-content:space-between;align-items:center}
.ln-brand{font-family:'Inter Tight',sans-serif;font-size:16px;font-weight:800;letter-spacing:3.5px;color:var(--t1);text-decoration:none;display:inline-flex;align-items:center;gap:14px}
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
.lmono{font-family:'Inter',sans-serif;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--t2)}
.lred-dash{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.lred-dash::before{content:'';width:28px;height:2px;background:var(--r)}
[data-r]{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
[data-r].v{opacity:1;transform:none}

/* ═══ HERO ═══ */
.lhero-section{position:relative;overflow:hidden}
.lhero-section::before{content:'';position:absolute;top:-20%;right:-10%;width:700px;height:700px;background:radial-gradient(circle, rgba(92,20,20,0.04) 0%, rgba(92,20,20,0.02) 30%, transparent 70%);border-radius:50%;pointer-events:none;animation:heroOrb 12s ease-in-out infinite}
.lhero-section::after{content:'';position:absolute;bottom:-30%;left:-5%;width:500px;height:500px;background:radial-gradient(circle, rgba(92,20,20,0.03) 0%, transparent 60%);border-radius:50%;pointer-events:none;animation:heroOrb 15s ease-in-out infinite reverse}
@keyframes heroOrb {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
  33% { transform: translate(30px, -20px) scale(1.05); opacity: 0.7; }
  66% { transform: translate(-20px, 15px) scale(0.95); opacity: 0.4; }
}
.lhero-grid{display:grid;grid-template-columns:1.25fr 0.75fr;gap:48px;align-items:center;padding:160px 0 80px}
.lh1{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:clamp(38px,4.5vw,64px);line-height:1.1;letter-spacing:-2px;color:var(--t1);margin:0 0 24px}
.lh-gradient{color:var(--r);font-weight:800;letter-spacing:-2px;display:inline-block;padding-bottom:0.15em;margin-bottom:-0.15em}
.lh-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(92,20,20,0.04);border:1px solid rgba(92,20,20,0.12);padding:6px 14px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--r);margin-bottom:24px;box-shadow:0 2px 8px rgba(92,20,20,0.02)}
.lh-badge-dot{width:6px;height:6px;background:var(--g);border-radius:50%;display:inline-block;box-shadow:0 0 8px rgba(20,92,20,0.8);animation:badgeDotPulse 1.8s ease-in-out infinite}
@keyframes badgeDotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.85)}}
.lh-nobrk{display:inline}
.lh-br{display:none}
@media(min-width:768px){
  .lh-br{display:block}
}
.lsub{font-size:20px;color:var(--t2);line-height:1.5;margin:0 0 40px;max-width:680px;letter-spacing:-.2px}
.lctas{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px}
.lbtn{height:56px;padding:0 32px;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:all .4s cubic-bezier(.16, 1, 0.3, 1);position:relative;overflow:hidden}
.lbtn-r{background:var(--r) !important;color:#fff !important;box-shadow:0 8px 24px -6px rgba(92,20,20,.4);font-size:14px;font-weight:800;padding:0 40px;height:60px;animation:btnPulse 3s ease-in-out infinite}
.lbtn-r:hover{background:var(--rh) !important;box-shadow:0 16px 40px -8px rgba(92,20,20,.5);transform:translateY(-3px) scale(1.03)}
.lbtn-r::after{content:'→';opacity:0;transform:translateX(-8px);transition:all .3s cubic-bezier(.16, 1, 0.3, 1);display:inline-block;width:0;margin-left:0}
.lbtn-r:hover::after{opacity:1;transform:translateX(0);width:auto;margin-left:10px}
@keyframes btnPulse {
  0%, 100% { box-shadow: 0 8px 24px -6px rgba(92,20,20,.4); }
  50% { box-shadow: 0 8px 32px -4px rgba(92,20,20,.55); }
}
.lbtn-g{background:var(--p);color:var(--t2);border:1px solid var(--d)}
.lbtn-g:hover{border-color:#bbb;color:var(--t1);transform:translateY(-1px)}
@keyframes matchDotPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(92,20,20,0.4); }
  50% { transform: scale(1.3); box-shadow: 0 0 8px 3px rgba(92,20,20,0.25); }
}
@keyframes matchTextShine {
  0%, 100% { text-shadow: 0 0 0px rgba(92,20,20,0); }
  50% { text-shadow: 0 0 4px rgba(92,20,20,0.15); }
}
.lcta-match{font-size:14px;color:var(--t1);margin-top:16px;font-weight:700;display:flex;align-items:center;gap:8px;letter-spacing:-.1px;animation:matchTextShine 3s infinite ease-in-out}
.lcta-match::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--r);animation:matchDotPulse 2s infinite ease-in-out}

/* ═══ PREVIEW CONTRACT CARD ═══ */
@keyframes premiumFloat {
  0%, 100% { 
    transform: translateY(0) rotateX(0deg) rotateY(0deg);
    box-shadow: 0 20px 60px -15px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03);
  }
  50% { 
    transform: translateY(-10px) rotateX(1deg) rotateY(-1deg);
    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
  }
}
@keyframes heroGlow {
  0%, 100% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.05); opacity: 0.25; }
}
@keyframes cardSheen {
  0%, 20% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
  25% { opacity: 0.3; }
  30%, 100% { transform: translateX(150%) skewX(-20deg); opacity: 0; }
}
@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.5; }
}
.lhero-right{display:flex;justify-content:center;align-items:center;position:relative;perspective:1200px}
.lhero-right::before{content:'';position:absolute;width:450px;height:450px;background:radial-gradient(circle, rgba(92,20,20,0.12) 0%, transparent 65%);z-index:0;animation:heroGlow 8s ease-in-out infinite;border-radius:50%}
.lpreview-card{background:linear-gradient(135deg, #0A0B0D 0%, #121318 100%);border:1px solid rgba(255, 255, 255, 0.08);padding:36px 32px;width:100%;max-width:400px;position:relative;overflow:hidden;border-radius:16px;animation:premiumFloat 8s ease-in-out infinite;transform-style:preserve-3d;will-change:transform,box-shadow;z-index:1;box-shadow:0 40px 100px -20px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.1)}
.lpreview-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg, #EF4444 0%, #F59E0B 100%)}
.lpreview-card::after{content:'';position:absolute;top:0;left:-50%;width:150%;height:100%;background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%);z-index:5;animation:cardSheen 8s ease-in-out infinite;pointer-events:none}

.lpcard-header-new{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.lpcard-integration-badge{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:5px 9px}
.lpcard-integration-icon{height:12px;opacity:0.9;filter:brightness(0) invert(1)}
.lpcard-integration-badge span{font-family:'Inter',sans-serif;font-size:10px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:-0.1px}

.lpcard-status{font-family:'Inter',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;border-radius:100px;padding:4px 10px;display:inline-flex;align-items:center;gap:6px}
.lpcard-status.status-live{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:#EF4444}
.lpcard-status.status-tracking{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);color:#F59E0B}
.lpcard-status.status-settled{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);color:#10B981}

.lpcard-status .pulse-dot{width:5px;height:5px;border-radius:50%;background:#EF4444;box-shadow:0 0 8px #EF4444;animation:pulseDot 1.8s ease-in-out infinite}
.lpcard-status .pulse-dot-tracking{width:5px;height:5px;border-radius:50%;background:#F59E0B;box-shadow:0 0 8px #F59E0B;animation:pulseDot 1.8s ease-in-out infinite}
.lpcard-status .pulse-dot-settled{width:5px;height:5px;border-radius:50%;background:#10B981;box-shadow:0 0 8px #10B981}

.lpcard-title-new{font-family:'Plus Jakarta Sans',sans-serif;font-size:19px;font-weight:700;color:#FFF;margin:6px 0 18px;letter-spacing:-0.3px}

.lpcard-grid-new{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}
.lpcard-cell-new{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);padding:10px 14px;border-radius:8px;display:flex;flex-direction:column;gap:3px;transition:all 0.3s ease}
.lpcard-cell-new.highlight{border-color:rgba(245,158,11,0.15);background:linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(245,158,11,0.03) 100%)}
.lpcard-cell-new .label{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.6px}
.lpcard-cell-new .value{font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:#FFF}
.lpcard-cell-new.highlight .value{color:#F59E0B}

.lpcard-outcomes-container{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.lpcard-outcome-box{padding:12px;border-radius:8px;display:flex;flex-direction:column;gap:3px}
.lpcard-outcome-box.positive{background:linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.01) 100%);border:1px solid rgba(16,185,129,0.15)}
.lpcard-outcome-box.negative{background:linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.01) 100%);border:1px solid rgba(239,68,68,0.15)}
.lpcard-outcome-box .outcome-label{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;display:flex;align-items:center;gap:5px}
.lpcard-outcome-box.positive .outcome-label{color:rgba(16,185,129,0.7)}
.lpcard-outcome-box.negative .outcome-label{color:rgba(239,68,68,0.7)}
.lpcard-outcome-box .outcome-dot{width:4px;height:4px;border-radius:50%}
.lpcard-outcome-box.positive .outcome-dot{background:#10B981}
.lpcard-outcome-box.negative .outcome-dot{background:#EF4444}
.lpcard-outcome-box .outcome-value{font-family:'Inter',sans-serif;font-size:15px;font-weight:700}
.lpcard-outcome-box.positive .outcome-value{color:#10B981}
.lpcard-outcome-box.negative .outcome-value{color:#EF4444}



/* ═══ FLOATING BADGES ═══ */
.lbadge-glass {
    position: absolute;
    background: rgba(92, 20, 20, 0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 32px rgba(92, 20, 20, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
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
    color: #FFF;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* ═══ LIVE TOAST NOTIFICATIONS ═══ */
#l-toast-container{position:fixed;bottom:24px;left:24px;z-index:9999;display:flex;flex-direction:column;gap:12px;pointer-events:none}
.l-toast{background:rgba(255,255,255,0.85);backdrop-filter:blur(16px);border:1px solid rgba(0,0,0,0.08);box-shadow:0 8px 32px rgba(0,0,0,0.08);padding:14px 20px;border-radius:12px;display:flex;align-items:center;gap:12px;font-family:'SF Mono','Fira Code','Consolas',monospace;font-size:12px;font-weight:600;color:var(--t2);pointer-events:auto;will-change:transform,opacity}
.lticker-time{color:var(--t3);font-weight:500;font-size:11px}
.lticker-action{color:var(--t1);font-family:'Inter',sans-serif}
.lticker-amt{font-weight:700}
.lticker-amt.positive{color:var(--g)}
.lticker-amt.negative{color:var(--r)}
.lticker-amt.locked{color:var(--t1)}
.animate-slide-up{animation:toastSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards}
.animate-slide-down{animation:toastSlideDown 0.5s cubic-bezier(0.16,1,0.3,1) forwards}
@keyframes toastSlideUp{0%{opacity:0;transform:translateY(24px) scale(0.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
@keyframes toastSlideDown{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(24px) scale(0.95)}}

/* ═══ LIVE CONTRACTS ═══ */
.lcontracts{padding:40px 0 64px;background:var(--p)}
.lcontracts .lw{max-width:1280px}
.lcards{display:grid;grid-template-columns:repeat(4,1fr);gap:32px}
.lcard{border:1px solid var(--d);padding:36px 32px;display:flex;flex-direction:column;transition:all 0.4s cubic-bezier(0.16, 1, 0.3, 1);background:var(--p);position:relative;overflow:hidden}
.lcard::before{content:'';position:absolute;top:-1px;left:0;right:0;height:2px;background:var(--r);transform:scaleX(0);transform-origin:left;transition:transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)}
.lcard:hover::before{transform:scaleX(1)}
.lcard:hover{border-color:#bbb;box-shadow:0 16px 40px rgba(0,0,0,.08);transform:translateY(-6px)}
.lcard-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
.lcard-src{font-family:'Inter',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--t3)}
.lcard-tier{font-family:'Inter',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:3px 8px}
.tier-pledge{color:var(--g);background:rgba(20,92,20,.06);border:1px solid rgba(20,92,20,.15)}
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
.lsteps{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;background:transparent;border:none;margin-top:24px}
.lstep{padding:32px;background:#fff;border:1px solid #eaeaea;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.02);transition:all 0.3s ease;position:relative;overflow:hidden;display:flex;flex-direction:column;z-index:1}
.lstep:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.06);border-color:rgba(92,20,20,0.15)}
.lstep-num{font-family:'Inter Tight',sans-serif;font-size:48px;font-weight:700;color:var(--r) !important;opacity:0.1;line-height:1;margin-bottom:16px;letter-spacing:-2px;transition:opacity 0.3s ease}
.lstep:hover .lstep-num{opacity:0.2}
.lstep-h{font-family:'Inter Tight',sans-serif;font-size:20px;font-weight:600;color:var(--t1);margin-bottom:12px;letter-spacing:-.4px;position:relative}
.lstep-p{font-size:15px;color:var(--t2);line-height:1.6;position:relative;z-index:1}

/* Mini CTA Block */
.lmini-cta{text-align:center;background:transparent;border:none;padding:100px 0;margin:0 auto;max-width:800px}
.lmini-cta-h{font-family:'Inter Tight',sans-serif;font-size: 30px;font-weight:600;margin-bottom:16px;letter-spacing:-1px;color:var(--t1)}
.lmini-cta-p{font-size:18px;color:var(--t2);margin-bottom:40px;line-height:1.6}
.lmini-cta-micro{font-size:12px;color:var(--t3);margin-top:20px;font-weight:500;text-transform:uppercase;letter-spacing:2px}

/* ═══ ORACLE STATUS BAR ═══ */
.loracle-wrapper{margin:32px auto 48px;padding:0;max-width:1080px;width:100%}
.loracle-bar{background:#FFF;border:1px solid var(--d);border-radius:12px;padding:10px 18px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 24px rgba(0,0,0,0.015);position:relative;overflow:hidden}
.loracle-header{display:flex;align-items:center;gap:10px}
.loracle-dot{width:6px;height:6px;background:var(--g);border-radius:50%;display:inline-block;box-shadow:0 0 8px rgba(20,92,20,0.6);animation:badgeDotPulse 1.8s ease-in-out infinite}
.loracle-title{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--t2)}
.loracle-grid{display:flex;align-items:center;gap:12px}
.loracle-pill{background:rgba(17,17,17,0.02);border:1px solid var(--d);border-radius:6px;padding:8px 14px;display:flex;align-items:center;gap:10px;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);cursor:default}
.loracle-pill:hover{background:#FFF;border-color:rgba(92,20,20,0.18);box-shadow:0 4px 12px rgba(92,20,20,0.05);transform:translateY(-1px)}
.loracle-pill img{object-fit:contain;filter:grayscale(1);opacity:0.35;transition:all 0.3s ease}
.loracle-pill:hover img{filter:none;opacity:0.95}
.loracle-pill img.logo-stripe{height:18px}
.loracle-pill img.logo-x{height:14px}
.loracle-pill img.logo-shopify{height:20px}
.loracle-pill img.logo-youtube{height:14px}
.loracle-pill-status{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:0.5px;display:flex;align-items:center;gap:5px;transition:color 0.3s ease}
.loracle-pill:hover .loracle-pill-status{color:var(--t1)}
.loracle-pill-dot{width:4px;height:4px;background:var(--g);border-radius:50%;display:inline-block;box-shadow:0 0 6px rgba(20,92,20,0.4)}

@media(max-width:900px){
  .loracle-bar{flex-direction:column;gap:14px;align-items:stretch;padding:16px}
  .loracle-header{justify-content:center}
  .loracle-grid{grid-template-columns:1fr 1fr;display:grid;gap:8px}
  .loracle-pill{justify-content:center}
}

/* ═══ CONTRACT TYPES ═══ */
.ltypes{padding:100px 0}
.ltypes-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px}
.ltype{background:transparent;border:none;padding:40px 0 0 0;border-top:1px solid rgba(0,0,0,0.08);transition:border-color 0.3s ease}
.ltype:hover{border-top-color:var(--r)}
.ltype-badge{font-family:'Inter',monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:24px;display:inline-block;padding:0;background:transparent!important;border:none!important}
.ltype-h{font-family:'Inter Tight',sans-serif;font-size: 28px;font-weight:600;letter-spacing:-1px;margin-bottom:16px}
.ltype-p{font-size:18px;color:var(--t2);line-height:1.65;margin-bottom:32px}
.ltype-detail{font-size:15px;color:var(--t2);line-height:1.6;padding-top:24px;border-top:1px dashed rgba(0,0,0,0.08)}



/* ═══ FAQ ═══ */
.lfaq{padding:48px 0;text-align:center}
.lfaq-wrap{max-width:640px;margin:0 auto;text-align:left}
.lfaq .lred-dash{justify-content:center}
.fq{border-bottom:1px solid var(--d)}.fq-q{padding:18px 0;font-family:'Inter Tight',sans-serif;font-size:15px;font-weight:600;color:var(--t1);cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;transition:color 0.2s ease}.fq-q:hover{color:var(--r)}.fq-q::after{content:'+';font-size:16px;color:var(--t3);transition:transform 0.3s ease}.fq.open .fq-q::after{content:'\\2212';transform:rotate(180deg)}.fq-a{max-height:0;overflow:hidden;transition:max-height .3s;font-size:13px;color:var(--t2);line-height:1.6}.fq.open .fq-a{max-height:400px;padding-bottom:18px}.fq-a strong{color:var(--t1);font-weight:600}

/* ═══ FINAL CTA ═══ */
.lfoot{background:var(--bg);border-top:1px solid var(--d);text-align:center;padding:100px 24px 120px;position:relative;overflow:hidden}
.lfoot::before{content:'';position:absolute;top:-50%;left:50%;transform:translateX(-50%);width:800px;height:800px;background:radial-gradient(circle, rgba(92,20,20,0.03) 0%, transparent 60%);pointer-events:none;border-radius:50%;animation:heroOrb 10s ease-in-out infinite}
.lfoot-overdue{display:inline-flex;align-items:center;gap:8px;background:rgba(92,20,20,0.04);border:1px solid rgba(92,20,20,0.12);padding:6px 14px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--r);margin-bottom:24px;box-shadow:0 2px 8px rgba(92,20,20,0.02);position:relative;z-index:1}
.lfoot-h{font-family:'Inter Tight',sans-serif;font-size:clamp(24px,4vw,36px);font-weight:700;color:var(--t1);letter-spacing:-1px;line-height:1.15;margin-bottom:12px;position:relative;z-index:1}
.lfoot-h em{font-style:normal;color:var(--r);font-weight:800}
.lfoot-sub{font-size:15px;color:var(--t2);font-weight:600;margin-bottom:28px;position:relative;z-index:1}
.lfoot-btn{display:inline-flex;height:52px;padding:0 36px;align-items:center;justify-content:center;background:var(--r) !important;color:#fff !important;font-size:13px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;border:none;cursor:pointer;transition:all .3s cubic-bezier(.16, 1, 0.3, 1);position:relative;overflow:hidden;z-index:1}
.lfoot-btn:hover{background:var(--rh) !important;transform:scale(1.04);box-shadow:0 8px 32px rgba(92,20,20,0.25)}
.lfoot-btn::after{content:'→';opacity:0;transform:translateX(-6px);transition:all .25s cubic-bezier(.16, 1, 0.3, 1);display:inline-block;width:0;margin-left:0}
.lfoot-btn:hover::after{opacity:1;transform:translateX(0);width:auto;margin-left:8px}
.lfoot-micro{font-size:12px;color:var(--t3);margin-top:16px;font-weight:500;letter-spacing:.5px;position:relative;z-index:1}
.lfoot-line{margin-top:48px;padding-top:20px;border-top:1px solid var(--d);font-size:10px;color:var(--t3);font-family:'Inter',monospace;text-transform:uppercase;letter-spacing:1.5px;position:relative;z-index:1}

/* ═══ RESPONSIVE ═══ */
@media(max-width:768px){
  .lpromo-bar { height: auto; min-height: 32px; padding: 6px 10px; line-height: 1.3; font-size: 9px; }
  .ln { top: 32px; }
  .lmain { padding-top: 84px; }
  .lhide-mobile{display:none !important}
  .ln-in{padding:0 16px; height: 60px;}
  .ln-cta{padding:6px 10px; font-size:8.5px; letter-spacing:0.5px}
  .lhero-grid{grid-template-columns:1fr;gap:32px;padding:130px 0 24px}
  .lhero-right{display:none}
  .lh1{font-size:clamp(38px, 11vw, 48px);line-height:1.05;letter-spacing:-1px}
  .lsub{font-size:16px;margin-bottom:24px}
  .lbtn{height:48px;padding:0 24px;font-size:11px}
  .lbtn-r{height:52px;font-size:12px;padding:0 28px}
  .lcards{grid-template-columns:1fr 1fr;gap:16px}
  .lcard{padding:20px;min-height:auto}
  .lcard-title{font-size:17px;margin-bottom:4px}
  .lcard-target{font-size:12px;margin-bottom:16px}
  .lcard-row{padding:6px 0;font-size:11px}
  .lcard-btn{padding-top:16px}
  .lcontracts{padding:32px 0 48px}
  .lhow{padding:48px 0}
  .lhow-h{font-size: 22px}
  .lhow-sub{margin-bottom:32px;font-size:14px}
    .lsteps{grid-template-columns:1fr;gap:16px}
    .lstep{padding:24px}
    .lstep-num{font-size: 40px;top:16px;right:16px;margin-bottom:0}
    .lstep-h{font-size:18px;margin-top:12px}
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

/* ═══ SLIDE-OUT PANEL ═══ */
.pnl-overlay { position: fixed; inset: 0; background: rgba(10,10,10,0.35); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); z-index: 90; opacity: 0; visibility: hidden; transition: opacity 0.35s ease, visibility 0.35s ease; }
.pnl-overlay.open { opacity: 1; visibility: visible; }
.pnl-drawer { position: fixed; top: 0; right: 0; width: 380px; max-width: 90vw; height: 100%; background: #ffffff; z-index: 100; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; box-shadow: -24px 0 80px rgba(0,0,0,0.08); border-left: 1px solid #f0f0f0; }
.pnl-drawer.open { transform: translateX(0); }
.pnl-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 28px 20px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
.pnl-header-left { display: flex; align-items: center; gap: 10px; }
.pnl-header-title { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2.5px; color: #999; }
.pnl-close { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid transparent; cursor: pointer; color: #999; transition: all 0.15s; }
.pnl-close:hover { border-color: #e5e5e5; background: #fafafa; color: #333; }
.pnl-body { flex: 1; overflow-y: auto; padding: 0; }
.pnl-section-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #ccc; padding: 20px 28px 10px; }
.pnl-nav-link { display: flex; align-items: center; gap: 14px; padding: 14px 28px; font-size: 14px; font-weight: 500; color: #555; text-decoration: none; font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif; letter-spacing: 0.04em; transition: all 0.15s ease; border-left: 3px solid transparent; opacity: 0; transform: translateX(12px); animation: pnlSlideIn 0.35s ease forwards; }
.pnl-nav-link:hover { background: #fafafa; color: #111; border-left-color: #e5e5e5; }
.pnl-nav-indicator { width: 3px; height: 3px; background: #d4d4d4; flex-shrink: 0; transition: all 0.15s; }
.pnl-nav-link:hover .pnl-nav-indicator { background: #888; }
.pnl-connect-section { padding: 20px 28px; flex-shrink: 0; }
.pnl-connect-btn { width: 100%; padding: 14px 24px; font-size: 12px; font-weight: 700; color: #fff; background: #111; border: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px; text-transform: uppercase; transition: background 0.15s; }
.pnl-connect-btn:hover { background: #5C1414; }
.pnl-footer { border-top: 1px solid #f0f0f0; padding: 20px 28px; background: #fafafa; flex-shrink: 0; }
.pnl-status { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.pnl-status-dot { width: 5px; height: 5px; border-radius: 50%; background: #145c14; box-shadow: 0 0 6px rgba(20,92,20,0.4); }
.pnl-status-text { font-size: 10px; font-weight: 500; color: #aaa; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.1em; }
.pnl-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.pnl-meta-item { display: flex; flex-direction: column; gap: 2px; }
.pnl-meta-label { font-size: 8px; font-weight: 700; color: #ccc; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.12em; }
.pnl-meta-value { font-size: 11px; font-weight: 500; color: #777; font-family: 'Sora', 'IBM Plex Sans', sans-serif; }
.pnl-legal { display: flex; gap: 16px; padding-top: 12px; border-top: 1px solid #eee; }
.pnl-legal a { font-size: 10px; color: #ccc; text-decoration: none; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em; transition: color 0.12s; }
.pnl-legal a:hover { color: #888; }
@keyframes pnlSlideIn { to { opacity: 1; transform: translateX(0); } }
@media (max-width: 767px) { .pnl-drawer { width: 100%; max-width: 100%; border-left: none; } }

/* ═══ CARD LIFECYCLE ═══ */
.lpreview-container{position:relative;width:100%;max-width:400px;height:480px;perspective:1200px}
.stage-card{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(12px);transition:opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1), visibility 0.45s}
.stage-card.active{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0)}
.lpreview-controls{display:flex;justify-content:center;gap:12px;position:absolute;bottom:-36px;left:0;right:0}
.lpreview-dot{width:8px;height:8px;border-radius:50%;background:#e5e5e5;cursor:pointer;transition:all 0.3s ease}
.lpreview-dot:hover{background:#bbb}
.lpreview-dot.active{background:var(--r);transform:scale(1.2)}

.lpcard-progress-section-new{margin:16px 0}
.lpcard-progress-label{display:flex;justify-content:space-between;font-family:'Inter',sans-serif;font-size:10px;font-weight:600;color:rgba(255,255,255,0.4);margin-bottom:8px}
.lpcard-progress-track-new{background:rgba(255,255,255,0.06);height:6px;border-radius:100px;overflow:hidden;position:relative}
.lpcard-progress-fill-new{height:100%;background:linear-gradient(90deg, #E53E3E 0%, #F59E0B 100%);border-radius:100px;box-shadow:0 0 10px rgba(245, 158, 11, 0.4)}

.lpcard-countdown-widget-new{background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.04);border-radius:8px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;margin-top:16px}
.lpcard-countdown-widget-new .countdown-label{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px}
.lpcard-countdown-widget-new .countdown-digits{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#FFF;display:flex;align-items:center;gap:3px}
.lpcard-countdown-widget-new .countdown-digits .digit-group{display:flex;align-items:baseline}
.lpcard-countdown-widget-new .countdown-digits .digit-group .unit{font-size:9px;color:rgba(255,255,255,0.4);margin-left:1px;font-family:'Inter',sans-serif;font-weight:600}
.lpcard-countdown-widget-new .countdown-digits .sep{color:rgba(255,255,255,0.25);font-size:11px}

.lpcard-verified-banner-new{background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.18);color:#10B981;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;padding:10px 14px;border-radius:8px;display:flex;align-items:center;gap:8px;margin-bottom:16px;letter-spacing:0.1px}
.lpcard-verified-banner-new .verified-icon{width:14px;height:14px;flex-shrink:0}

.lpcard-payout-breakdown-new{background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.04);border-radius:8px;padding:14px;display:flex;flex-direction:column;gap:10px}
.lpcard-payout-breakdown-new .breakdown-row{display:flex;justify-content:space-between;align-items:center}
.lpcard-payout-breakdown-new .breakdown-row.total{border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:10px;margin-bottom:2px}
.lpcard-payout-breakdown-new .breakdown-row.total .breakdown-label{font-family:'Inter',sans-serif;font-size:10px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px}
.lpcard-payout-breakdown-new .breakdown-row.total .breakdown-value{font-family:'Inter',sans-serif;font-size:16px;font-weight:800;color:#10B981}
.lpcard-payout-breakdown-new .breakdown-row.sub .breakdown-label{font-family:'Inter',sans-serif;font-size:11px;color:rgba(255,255,255,0.4)}
.lpcard-payout-breakdown-new .breakdown-row.sub .breakdown-value{font-family:'Inter',sans-serif;font-size:11px;color:rgba(255,255,255,0.8);font-weight:600}
.lpcard-payout-breakdown-new .breakdown-row.tx{margin-top:2px;padding-top:8px;border-top:1px dashed rgba(255,255,255,0.04)}
.lpcard-payout-breakdown-new .breakdown-row.tx .breakdown-label{font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(255,255,255,0.25)}
.lpcard-payout-breakdown-new .breakdown-row.tx .breakdown-value{font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(255,255,255,0.35)}

/* ═══ SOCIAL PROOF ═══ */
.lreal-results{padding:100px 0;background:var(--bg)}
.lstats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-bottom:64px;margin-top:32px}
.lstat-card{background:#fff;border:1px solid var(--d);padding:32px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.01)}
.lstat-num{font-family:'Plus Jakarta Sans',sans-serif;font-size:44px;font-weight:800;color:var(--r);letter-spacing:-1.5px;line-height:1}
.lstat-label{font-family:'Inter Tight',sans-serif;font-size:15px;font-weight:700;color:var(--t1);margin:12px 0 6px}
.lstat-sub{font-size:13px;color:var(--t3);line-height:1.4}
/* ═══ LIVE LEDGER FEED ═══ */
.lledger-container {background:#FFF;border:1px solid var(--d);border-radius:16px;padding:32px;box-shadow:0 4px 30px rgba(0,0,0,0.015);margin-top:48px}
.lledger-header {display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--d);padding-bottom:20px;margin-bottom:24px;flex-wrap:wrap;gap:16px}
.lledger-h-title {font-family:'Inter Tight',sans-serif;font-size:18px;font-weight:700;color:var(--t1);display:flex;align-items:center;gap:10px}
.lledger-pulse-dot {width:8px;height:8px;background:var(--g);border-radius:50%;display:inline-block;box-shadow:0 0 10px rgba(20,92,20,0.8);animation:statusPulse 2s ease-in-out infinite}
.lledger-h-desc {font-size:13px;color:var(--t3);font-weight:500}
.lledger-table-wrap {overflow-x:auto;width:100%}
.lledger-table {width:100%;border-collapse:collapse;text-align:left;min-width:700px}
.lledger-table tbody {transition:opacity 0.4s ease-in-out}
.lledger-table tbody.fade-out {opacity:0}
.lledger-table th {padding:12px 16px;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--t3);border-bottom:1px solid var(--d)}
.lledger-table td {padding:16px;font-size:13px;color:var(--t2);border-bottom:1px solid rgba(0,0,0,0.03);vertical-align:middle}
.lledger-table tr:last-child td {border-bottom:none}
.td-id {font-family:'SF Mono','Fira Code','Consolas',monospace;font-weight:700;color:var(--t1)}
.td-user {color:var(--t3);font-weight:400;margin-left:6px;font-size:12px}
.td-metric {display:flex;align-items:center;gap:8px;font-weight:600;color:var(--t1)}
.td-icon {width:16px;height:16px;object-fit:contain}
.td-capital {font-family:'SF Mono','Fira Code','Consolas',monospace;font-weight:700;color:var(--t1)}
.td-yield {font-family:'SF Mono','Fira Code','Consolas',monospace;font-weight:700;color:var(--g)}
.td-outcome.hit {color:var(--g);font-weight:600}
.td-outcome.miss {color:var(--r);font-weight:600}
.lstatus-badge {display:inline-flex;align-items:center;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:0.5px}
.lstatus-badge.hit {background:rgba(20,92,20,0.06);color:var(--g);border:1px solid rgba(20,92,20,0.12)}
.lstatus-badge.forfeit {background:rgba(92,20,20,0.06);color:var(--r);border:1px solid rgba(92,20,20,0.12)}

/* ═══ HOW IT WORKS (HORIZONTAL CARDS) ═══ */
.lhow-grid {display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:48px}
.lhow-card {background:#FFF;border:1px solid var(--d);padding:32px 24px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.015);display:flex;flex-direction:column;gap:16px;transition:transform 0.3s ease,box-shadow 0.3s ease;position:relative;overflow:hidden}
.lhow-card:hover {transform:translateY(-4px);box-shadow:0 12px 30px rgba(0,0,0,0.03)}
.lhow-card::before {content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--d);transition:background-color 0.3s ease}
.lhow-card:hover::before {background:var(--r)}
.lhow-card.final-card {border-color:var(--r);box-shadow:0 8px 24px rgba(92,20,20,0.04)}
.lhow-card.final-card::before {background:var(--r)}
.lhow-card-badge {align-self:flex-start;background:rgba(17,17,17,0.04);border:1px solid var(--d);color:var(--t1);font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:4px 10px;border-radius:2px}
.lhow-card.final-card .lhow-card-badge {background:rgba(92,20,20,0.04);border-color:rgba(92,20,20,0.15);color:var(--r)}
.lhow-card-title {font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:700;color:var(--t1);letter-spacing:-0.3px;margin:0}
.lhow-card-desc {font-size:13px;color:var(--t2);line-height:1.5;margin:0}

/* ═══ CONTRACT CARDS DIFFERENTIATION ═══ */
.lcard-popular{border-color:var(--r) !important;transform:scale(1.02);box-shadow:0 12px 30px rgba(92,20,20,0.06);position:relative;z-index:10}
.lcard-popular:hover{transform:scale(1.04) translateY(-6px) !important;box-shadow:0 20px 40px rgba(92,20,20,0.1) !important}
.lcard-popular-badge{position:absolute;top:10px;right:10px;background:var(--r);color:#fff;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:3px 8px;border-radius:2px}
.tier-3x-yield{color:#fff !important;background:var(--r) !important;border:1px solid var(--r) !important}

/* ═══ EMOTIONAL REFRAME ═══ */
.lemo-reframe{padding:100px 0;background:var(--p)}
.lemo-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;margin-top:32px}
.lemo-body{font-size:18px;color:var(--t2);line-height:1.6;margin:0}
.lemo-comparison-card{background:#fff;border:1px solid var(--d);padding:32px;border-radius:16px;box-shadow:0 4px 30px rgba(0,0,0,0.02);display:grid;grid-template-columns:1fr auto 1fr;gap:24px;align-items:stretch}
.lemo-col{display:flex;flex-direction:column}
.lemo-col-header{font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--t3);margin-bottom:20px}
.lemo-col-header.text-strong{color:var(--t1)}
.lemo-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:14px}
.lemo-item{font-size:14px;color:var(--t3);display:flex;align-items:center;gap:8px}
.lemo-item::before{content:'—';color:var(--t3)}
.lemo-item.text-strong{color:var(--t1);font-weight:600}
.lemo-item.text-strong::before{content:'→';color:var(--r)}
.lemo-item.text-green{color:var(--g) !important}
.lemo-item.text-green::before{color:var(--g) !important}
.lemo-divider{width:1px;background:var(--d)}

/* ═══ RESPONSIVE UPGRADES ═══ */
@media(max-width:768px){
  .lstats-grid{grid-template-columns:1fr;gap:16px;margin-bottom:40px;margin-top:16px}
  .lledger-container{padding:20px;margin-top:32px}
  .lledger-header{flex-direction:column;align-items:flex-start;gap:8px;padding-bottom:16px}
  .lreal-results{padding:60px 0}
  .lhow-grid{grid-template-columns:1fr;gap:16px;margin-top:32px}
  .lemo-grid{grid-template-columns:1fr;gap:32px}
  .lemo-comparison-card{grid-template-columns:1fr;gap:24px}
  .lemo-divider{width:100%;height:1px}
  .lemo-item{font-size:13px}
  .lemo-reframe{padding:60px 0}
}
`;
