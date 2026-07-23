// Landing CSS — Elite fintech conversion page
export const landingCSS = `
.lp{--bg:#FAF8F5;--p:#FFF;--s:#FAF8F5;--t1:#0F172A;--t2:#334155;--t3:#64748B;--d:#E2E8F0;--r:#5C1414;--rh:#6B1212;--g:#145c14;min-height:100vh;background:#FAF8F5 !important;color:var(--t1);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;opacity:0;transition:opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)}
.lp.v{opacity:1}
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
.animate-fade-in-up { opacity: 0; }
.animate-scale-in { opacity: 0; }
.lp.v .animate-fade-in-up { animation: fadeInUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) both; }
.lp.v .animate-scale-in { animation: scaleIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) both; }
.delay-1 { animation-delay: 150ms; }
.delay-2 { animation-delay: 300ms; }
.delay-3 { animation-delay: 450ms; }
.delay-4 { animation-delay: 600ms; }

/* Promo Bar */
@keyframes textShine {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}
.lpromo-bar{position:fixed;top:0;left:0;right:0;height:32px;background-color:var(--r);display:flex;align-items:center;justify-content:center;text-align:center;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;z-index:60;box-shadow:0 2px 12px rgba(92,20,20,.4);opacity:0}
.promo-text{background:linear-gradient(to right, rgba(255,255,255,0.6) 20%, #fff 40%, #fff 60%, rgba(255,255,255,0.6) 80%);background-size:200% auto;color:transparent;-webkit-background-clip:text;background-clip:text;animation:textShine 4s linear infinite;text-shadow: 0 1px 1px rgba(0,0,0,0.1)}

/* Nav */
.ln{position:fixed;top:32px;left:0;right:0;z-index:50;background:rgba(250,250,250,0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,0.04);opacity:0;transition:top 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease}
.ln.nav-scrolled{top:0px !important;background:rgba(255,255,255,0.25) !important;backdrop-filter:blur(18px) saturate(180%) !important;-webkit-backdrop-filter:blur(18px) saturate(180%) !important;border-bottom-color:rgba(229,229,229,0.35) !important;box-shadow:0 1px 3px rgba(0,0,0,0.02), 0 8px 32px rgba(0,0,0,0.03)}
.ln-in{max-width:none;width:100%;padding:0 48px;height:72px;display:flex;justify-content:space-between;align-items:center}
.ln-brand{font-family:'Inter Tight',sans-serif;font-size:16px;font-weight:800;letter-spacing:3.5px;color:#7A1220;text-decoration:none;display:inline-flex;align-items:center;gap:14px;text-transform:uppercase}
.logo-wordmark{color:#7A1220;text-transform:uppercase}
.ln-logo{width:32px;height:32px;color:var(--r);fill:currentColor;flex-shrink:0}
.ln-cta{background:var(--r) !important;color:#fff !important;font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;padding:12px 24px;border:none;cursor:pointer;transition:all .3s cubic-bezier(.16, 1, 0.3, 1)}

/* Entrance Keyframes for Nav & Promo */
@keyframes promoDown {
  from { opacity: 0; transform: translateY(-32px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes navDown {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}
.lp.v .lpromo-bar { animation: promoDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
.lp.v .ln { animation: navDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 100ms; }
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
[data-r]{opacity:0;transition:opacity .7s cubic-bezier(.16,1,.3,1)}
[data-r].v{opacity:1}

/* ═══ HERO PROCEDURAL BACKGROUND SYSTEM ═══ */
.lhero-section {
    position: relative;
    overflow: hidden;
    padding-top: 145px !important;
    padding-bottom: 24px !important;
    background: #FAF8F5 !important;
}

/* Rotated Institutional Grid Layer & Light Orb Overlays Disabled for Pure #FAF8F5 Background */
.lhero-bg-grid,
.lhero-bg-light-orb,
.lhero-section::before,
.lhero-section::after {
    display: none !important;
}

/* ═══ MOUSE-FOLLOWING SPOTLIGHT & PHYSICAL CARD ELEVATION ═══ */
.lcard, .lstep, .ltype, .lactivity-card {
    position: relative;
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease-out;
}

.lcard::after, .lstep::after, .ltype::after, .lactivity-card::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none !important;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.35s ease-out;
    background: radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(20, 18, 31, 0.05), transparent 80%);
}

.lcard:hover::after, .lstep:hover::after, .ltype:hover::after, .lactivity-card:hover::after {
    opacity: 1;
}

.lcard:hover, .lstep:hover, .lactivity-card:hover {
    transform: translateY(-6px) scale(1.01) !important;
    box-shadow: 0 20px 48px -12px rgba(20, 18, 31, 0.08), 0 1px 3px rgba(20, 18, 31, 0.02) !important;
}

.lhero-headline-wrap{margin-bottom:16px;position:relative;z-index:2}
.lh1{font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:clamp(2.3rem, 4.6vw, 4.2rem) !important;line-height:0.95 !important;letter-spacing:-0.025em !important;color:var(--t1);text-transform:uppercase;margin:0 0 12px}
.lh-gradient{color:#7A1220 !important;background:none !important;-webkit-background-clip:initial !important;-webkit-text-fill-color:initial !important;display:inline-block}
.lh-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(92,20,20,0.04);border:1px solid rgba(92,20,20,0.12);padding:6px 14px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--r);margin-bottom:20px;box-shadow:0 2px 8px rgba(92,20,20,0.02)}
.lh-badge-dot{width:6px;height:6px;background:var(--g);border-radius:50%;display:inline-block;box-shadow:0 0 8px rgba(20,92,20,0.8);animation:badgeDotPulse 1.8s ease-in-out infinite}
@keyframes badgeDotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.85)}}
.lh-nobrk{display:inline}
.lh-br{display:none}
@media(min-width:768px){
  .lh-br{display:block}
}
.lhero-section .lw {
    max-width: 1240px;
    padding: 0 32px;
}
.lhero-grid {
    display: grid;
    grid-template-columns: 0.54fr 0.46fr;
    gap: 40px;
    align-items: center;
    position: relative;
    z-index: 2;
}
@media (max-width: 1024px) {
    .lhero-grid {
        grid-template-columns: 1fr;
        gap: 28px;
    }
}
.lhero-right {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1200px;
    padding-right: 0;
    box-sizing: border-box;
}
.lsub{font-size:15.5px;color:var(--t2);line-height:1.5;margin:0 0 20px;max-width:560px;letter-spacing:-.2px}
.lctas{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:18px}
.lhero-footer-strip{display:flex;justify-content:flex-end;margin-top:24px;position:relative;z-index:2}
.lhero-scroll-down{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--t3);text-decoration:none;transition:color 0.25s ease,transform 0.25s ease}
.lhero-scroll-down:hover{color:var(--r);transform:translateY(2px)}
.lhero-scroll-arrow{font-size:14px;animation:bounceDown 2s infinite ease-in-out}
@keyframes bounceDown{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}

/* ═══ REAL COLLATERAL CONTRACT CARDS DECK CAROUSEL ═══ */
.lfeatured-live-section {
    padding: 90px 0;
    background: #FAF8F5 !important;
    color: #0F172A;
    position: relative;
    overflow: hidden;
    z-index: 2;
    border-top: 1px solid #E2E8F0;
    border-bottom: 1px solid #E2E8F0;
}

.lfan-grid {
    display: grid;
    grid-template-columns: 0.42fr 0.58fr;
    gap: 48px;
    align-items: center;
}

.lfan-left {
    display: flex;
    flex-direction: column;
    gap: 20px;
    z-index: 5;
}

.lfan-h1 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 900;
    font-size: clamp(34px, 4.2vw, 56px);
    line-height: 0.98;
    letter-spacing: -2px;
    color: #0F172A !important;
    text-transform: uppercase;
    margin: 0;
}

.lfan-highlight {
    color: var(--r) !important;
}

.lfan-sub {
    font-size: 15px;
    color: #475569 !important;
    line-height: 1.55;
    max-width: 380px;
    margin: 0;
}

.lfan-nav {
    display: flex;
    gap: 12px;
    margin-top: 8px;
}

.lfan-arrow-btn {
    width: 52px;
    height: 44px;
    background: #FFFFFF !important;
    border: 1px solid #CBD5E1 !important;
    color: #0F172A !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.lfan-arrow-btn:hover {
    border-color: #0F172A !important;
    background: #0F172A !important;
    color: #FFFFFF !important;
    transform: translateY(-1px);
}

.lfan-arrow-btn:active {
    transform: translateY(0);
}

/* REAL CARD STACK DECK STAGE */
.lfan-right {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
}

.lfan-deck-viewport {
    position: relative;
    width: 100%;
    max-width: 520px;
    height: 410px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 16px;
    box-sizing: border-box;
}

.lfan-deck-stage {
    position: relative;
    width: 365px;
    height: 385px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-10px);
}

.lfan-real-card {
    position: absolute !important;
    width: 365px !important;
    top: 0;
    padding: 22px 24px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 350ms ease !important;
    transform-origin: bottom center !important;
    cursor: pointer;
    border: 1px solid rgba(15, 23, 42, 0.12) !important;
    background: #FFFFFF !important;
    border-radius: 16px !important;
}

.lfan-real-card.is-center {
    transform: translateX(0) translateY(0) rotate(0deg) scale(1) !important;
    z-index: 5 !important;
    opacity: 1 !important;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08), 0 24px 48px rgba(15, 23, 42, 0.12) !important;
    pointer-events: auto !important;
    filter: none !important;
    backdrop-filter: none !important;
}

.lfan-real-card.is-left {
    transform: translateX(-20px) translateY(12px) rotate(-3deg) scale(0.95) !important;
    z-index: 2 !important;
    opacity: 0.60 !important;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04) !important;
    pointer-events: auto !important;
    filter: blur(0.5px) !important;
    backdrop-filter: blur(2px) !important;
}

.lfan-real-card.is-right {
    transform: translateX(20px) translateY(12px) rotate(3deg) scale(0.95) !important;
    z-index: 2 !important;
    opacity: 0.60 !important;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04) !important;
    pointer-events: auto !important;
    filter: blur(0.5px) !important;
    backdrop-filter: blur(2px) !important;
}

.lfan-real-card.is-hidden {
    transform: translateX(0) rotate(0deg) scale(0.92) !important;
    z-index: 1 !important;
    opacity: 0 !important;
    pointer-events: none !important;
}

@media(max-width: 900px) {
    .lfan-grid {
        grid-template-columns: 1fr;
        gap: 28px;
    }
    .lfan-right {
        order: 1;
    }
    .lfan-left {
        order: 2;
    }
    .lfan-deck-viewport {
        max-width: 100%;
        height: 340px;
    }
    .lfan-deck-stage {
        transform: none !important;
        width: 100% !important;
        max-width: 340px !important;
    }
    .lfan-real-card {
        width: 100% !important;
        max-width: 340px !important;
    }
    .lfan-real-card.is-left,
    .lfan-real-card.is-right {
        display: none !important;
    }
    .lfan-real-card.is-center {
        transform: none !important;
    }
}
/* Secondary CTA demoted to a plain text link so only "Start Contract" reads as a button */
.lhero-textlink{background:none;border:none;padding:8px 4px;cursor:pointer;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:var(--t2);display:inline-flex;align-items:center;gap:8px;transition:color .25s cubic-bezier(.16,1,.3,1),gap .25s cubic-bezier(.16,1,.3,1)}
.lhero-textlink svg{width:16px;height:16px;transition:transform .25s cubic-bezier(.16,1,.3,1)}
.lhero-textlink:hover{color:var(--r);gap:12px}
.lhero-textlink:hover svg{transform:translateX(2px)}
/* ═══ MATCHING RECTANGULAR HERO BUTTONS (KASPA STYLE) ═══ */
.lctas {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 24px;
}
.lbtn {
    height: 50px !important;
    padding: 0 32px !important;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    letter-spacing: 1px !important;
    text-transform: uppercase !important;
    border-radius: 2px !important;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.25s cubic-bezier(.16, 1, 0.3, 1);
    box-shadow: none !important;
    animation: none !important;
}
.lbtn-r {
    background: #7A1220 !important;
    color: #fff !important;
    border: 1.5px solid #7A1220 !important;
    transition: all 0.3s cubic-bezier(.16, 1, 0.3, 1) !important;
}
.lbtn-r::after {
    content: ' →';
    display: inline-block !important;
    opacity: 0;
    transform: translateX(-6px);
    transition: all 0.25s cubic-bezier(.16, 1, 0.3, 1);
}
.lbtn-r:hover {
    background: #9A1829 !important;
    border-color: #9A1829 !important;
    box-shadow: 0 8px 28px rgba(122, 18, 32, 0.45) !important;
    transform: translateY(-2px) scale(1.02) !important;
}
.lbtn-r:hover::after {
    opacity: 1;
    transform: translateX(0);
    margin-left: 6px;
}
.lbtn-g {
    background: transparent !important;
    color: var(--t1) !important;
    border: 1.5px solid var(--t1) !important;
    transition: all 0.3s cubic-bezier(.16, 1, 0.3, 1) !important;
}
.lbtn-g:hover {
    background: var(--t1) !important;
    color: #fff !important;
    border-color: var(--t1) !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
    transform: translateY(-2px) scale(1.02) !important;
}

/* ═══ HERO LEFT COLUMN (CLEAN KASPA REFERENCE STYLE) ═══ */
.lhero-left {
    position: relative;
    border-left: none !important;
    padding-left: 0 !important;
}
.lhero-left::before {
    display: none !important;
}
.lhero-left > * {
    position: relative;
    z-index: 1;
}
.lhero-eyebrow{font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--t3);margin:0 0 18px;border-left:2px solid var(--t3);padding-left:14px}

/* ═══ PREVIEW CONTRACT CARD ═══ */
@keyframes cardSheen {
  0%, 20% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
  25% { opacity: 0.2; }
  30%, 100% { transform: translateX(150%) skewX(-20deg); opacity: 0; }
}
@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.5; }
}
.lhero-right{display:flex;justify-content:center;align-items:center;position:relative;perspective:1200px}
.lhero-right::before{content:none !important;display:none !important}
.lactivity-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.065) !important;
  border-radius: 16px;
  padding: 24px 28px !important;
  width: 100%;
  max-width: 480px !important;
  position: relative;
  z-index: 2;
  /* Masterpiece layered shadow stack: contact, medium structure, deep ambient, reflected under-glow */
  box-shadow: 
      0 0 0 1px rgba(0, 0, 0, 0.04),
      0 2px 4px rgba(0, 0, 0, 0.015),
      0 12px 28px -4px rgba(0, 0, 0, 0.03),
      0 40px 96px -12px rgba(0, 0, 0, 0.05),
      0 24px 50px -16px rgba(92, 20, 20, 0.04),
      inset 0 1px 1px rgba(255, 255, 255, 0.9) !important;
  display: flex;
  flex-direction: column;
  gap: 20px !important;
  color: #1e1e1e !important;
  font-family: 'Inter', sans-serif;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease-out;
}
@keyframes borderSweep {
  0% { background-position: 0% 0%, 300% 0%; }
  50% { background-position: 0% 0%, 150% 0%; }
  100% { background-position: 0% 0%, 0% 0%; }
}

/* ═══ THE AUTOMATED SETTLEMENT ENGINE (VISUAL CENTERPIECE) ═══ */
.lengine-section {
    padding: 100px 0;
    background: #FAF9F7 !important;
    position: relative;
    overflow: hidden;
    z-index: 2;
    border-top: 1px solid #E2E8F0;
    border-bottom: 1px solid #E2E8F0;
}

.lengine-hdr-wrap {
    text-align: center;
    max-width: 680px;
    margin: 0 auto 56px;
}

.lengine-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(122, 18, 32, 0.05) !important;
    border: 1px solid rgba(122, 18, 32, 0.15) !important;
    padding: 6px 14px;
    border-radius: 100px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #7A1220 !important;
    margin-bottom: 16px;
}

.lengine-h2 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(2rem, 4vw, 3.25rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    color: #0F172A;
    text-transform: uppercase;
    line-height: 1.05;
    margin-bottom: 16px;
}

.lengine-sub {
    font-size: 16px;
    color: #64748B;
    line-height: 1.6;
}
/* ═══ MONEY FLOW SCHEMATIC (CSS GRID — NO ABSOLUTE POSITIONING) ═══ */
.lflow-container {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 20px 28px 16px;
    box-shadow: none;
    position: relative;
}

/* DESKTOP FLOW */
.lflow-desktop {
    display: block;
}

.lflow-row {
    display: grid;
    grid-template-columns: 1fr auto 1.15fr auto 1fr auto 1.15fr;
    gap: 0;
    align-items: center;
}

.lflow-node {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 10px;
    padding: 14px 14px 12px;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05), 0 12px 28px rgba(15, 23, 42, 0.07);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.lflow-node-vault {
    background: #FFFFFF !important;
    border: 2px solid #0F172A !important;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.09), 0 16px 36px rgba(15, 23, 42, 0.08) !important;
}

.lflow-node-hdr {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: #64748B;
    text-transform: uppercase;
    margin-bottom: 3px;
}

.lflow-node-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 800;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: -0.2px;
}

.lflow-node-stat {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    font-weight: 800;
    color: #0F172A;
    margin-top: 5px;
}

.lflow-node-sub {
    font-size: 11px;
    color: #64748B;
    margin-top: 2px;
}

/* ARROWS BETWEEN NODES */
.lflow-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    user-select: none;
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.lflow-arrow svg {
    display: block;
}

.lflow-split-arrows {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.lflow-split-arrows svg {
    display: block;
    width: 44px;
    height: 180px;
}

/* THREE TERMINAL OUTCOMES (stacked vertically inside the grid) */
.lflow-outcomes {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.lflow-outcome {
    display: flex;
    align-items: stretch;
    border-radius: 8px;
    overflow: hidden;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04), 0 8px 20px rgba(15, 23, 42, 0.05);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Win Path Hierarchy Highlighting */
.lflow-outcome.is-win {
    background: linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%) !important;
    border: 1px solid #BBF7D0 !important;
    box-shadow: 0 4px 14px rgba(22, 101, 52, 0.12), 0 16px 36px rgba(22, 101, 52, 0.08) !important;
}

/* ═══ SCROLL-TRIGGERED STAGGERED REVEAL ANIMATIONS ═══ */
.lengine-section .lflow-node,
.lengine-section .lflow-arrow,
.lengine-section .lflow-split-arrows,
.lengine-section .lflow-outcome {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
}

.lengine-section.v .lflow-node,
.lengine-section.v .lflow-arrow,
.lengine-section.v .lflow-split-arrows,
.lengine-section.v .lflow-outcome {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* Flow order left-to-right staggered delays (~120ms per node) */
.lengine-section.v .lflow-row > .lflow-node:nth-of-type(1) { transition-delay: 0ms; }
.lengine-section.v .lflow-row > .lflow-arrow:nth-of-type(1) { transition-delay: 120ms; }
.lengine-section.v .lflow-row > .lflow-node:nth-of-type(2) { transition-delay: 240ms; }
.lengine-section.v .lflow-row > .lflow-arrow:nth-of-type(2) { transition-delay: 360ms; }
.lengine-section.v .lflow-row > .lflow-node:nth-of-type(3) { transition-delay: 480ms; }
.lengine-section.v .lflow-split-arrows { transition-delay: 600ms; }
.lengine-section.v .lflow-outcomes .lflow-outcome:nth-child(1) { transition-delay: 720ms; }
.lengine-section.v .lflow-outcomes .lflow-outcome:nth-child(2) { transition-delay: 820ms; }
.lengine-section.v .lflow-outcomes .lflow-outcome:nth-child(3) { transition-delay: 920ms; }

.lflow-outcome-indicator {
    flex-shrink: 0;
    border-radius: 8px 0 0 8px;
}

.lflow-outcome-body {
    padding: 7px 11px 6px;
    flex: 1;
    min-width: 0;
}

.lflow-out-hdr {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.8px;
    color: #64748B;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 1px;
    text-transform: uppercase;
}

.lflow-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
}

.lflow-out-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 800;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: -0.1px;
}

.lflow-out-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 800;
    color: #0F172A;
    margin-top: 2px;
}

.lflow-val-green { color: #145C14 !important; }
.lflow-val-crimson { color: #7A1220 !important; }

.lflow-out-desc {
    font-size: 10px;
    color: #64748B;
    margin-top: 1px;
}

/* RECIRCULATING LOOP — routed SVG connector beneath the node row */
.lflow-loop-wrap {
    position: relative;
    width: 100%;
    height: 56px;
    margin-top: 4px;
}

.lflow-loop-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 56px;
    pointer-events: none;
}

.lflow-loop-path {
    /* animated via CSS if desired */
}

.lflow-loop-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.6px;
    color: #FFFFFF;
    background: #7A1220;
    padding: 5px 16px;
    border-radius: 100px;
    white-space: nowrap;
    z-index: 2;
}

/* SUMMARY PARAGRAPH */
.lflow-summary {
    max-width: 820px;
    margin: 24px auto 0;
    font-size: 15px;
    color: #475569;
    line-height: 1.6;
    text-align: center;
}

/* MOBILE: vertical layout */
.lflow-mobile {
    display: none;
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
}

@media (max-width: 900px) {
    .lflow-desktop { display: none !important; }
    .lflow-mobile { display: flex !important; }

    .lflow-mob-step {
        display: flex;
        align-items: center;
        gap: 14px;
        background: #FAF9F7;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 14px 16px;
        box-sizing: border-box;
    }
    .lflow-mob-vault {
        background: #FFFFFF !important;
        border: 2px solid #0F172A !important;
    }
    .lflow-mob-num {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        font-weight: 800;
        color: #0F172A;
        background: rgba(15, 23, 42, 0.06);
        padding: 4px 8px;
        border-radius: 4px;
        flex-shrink: 0;
    }
    .lflow-mob-body {
        flex: 1;
        min-width: 0;
    }
    .lflow-mob-arrow {
        text-align: center;
        font-size: 16px;
        color: #64748B;
        font-weight: bold;
    }
    .lflow-mob-outcomes {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .lflow-mob-loop {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 700;
        color: #7A1220;
        margin-top: 4px;
    }
    .lflow-summary {
        text-align: left;
        font-size: 14px;
    }
}


/* CARD TOP PLATFORM HEADER */
.lc-platform-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f4f0;
}
.lc-plat-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
}
.lc-plat-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
}


/* SECTION — FEATURED CONTRACT VISUALIZATION */
.lc-contract {
  background: #fdfdfc;
  border: 1px solid #f5f4f0;
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.lc-contract-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.lc-contract-user {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 10.5px;
  font-weight: 700;
  color: #5c1414;
  text-transform: lowercase;
  margin-bottom: 2px;
}
.lc-contract-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #1e1e1e;
  letter-spacing: -0.5px;
}
.lc-contract-goal {
  font-family: 'Inter', sans-serif;
  font-size: 14.5px;
  font-weight: 500;
  color: #475569;
  margin-top: 2px;
  line-height: 1.35;
}
.lc-contract-time {
  font-family: 'Inter', sans-serif;
  font-size: 11.5px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}
.lc-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 10.5px;
  font-weight: 700;
  color: #145c14;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(20,92,20,0.06);
  padding: 3px 8px;
  border-radius: 100px;
}
.lc-status-dot {
  width: 4.5px;
  height: 4.5px;
  background: #145c14;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(20,92,20,0.4);
  animation: pulseDot 2s ease-in-out infinite;
}

/* DEPOSIT → REWARD → POTENTIAL RETURN FLOW (COMPACT HORIZONTAL) */
.lc-flow-horizontal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #faf9f6;
  border: 1px solid #f2efeb;
  border-radius: 10px;
  padding: 8px 12px;
  gap: 8px;
  margin-top: 2px;
}
.lc-flow-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  flex: 1;
}
.lc-flow-label {
  font-family: 'Inter', sans-serif;
  font-size: 9.5px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.lc-flow-val {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 16px;
  font-weight: 800;
  color: #1e1e1e;
}
.lc-val-green {
  color: #145c14 !important;
}
.lc-flow-arrow-right {
  font-size: 16px;
  color: #5c1414;
  font-weight: bold;
  flex-shrink: 0;
}
.lc-col-final {
  background: linear-gradient(135deg, #5c1414 0%, #3d0d0d 100%) !important;
  padding: 6px 12px !important;
  border-radius: 6px !important;
  box-shadow: 0 4px 10px rgba(92, 20, 20, 0.15);
}
.lc-col-final .lc-flow-label {
  color: rgba(255, 255, 255, 0.95) !important;
}
.lc-col-final .lc-flow-val {
  color: #fff !important;
  font-size: 16px !important;
  font-weight: 800 !important;
}
.lc-flow-footnote {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--t3);
  text-align: center;
  margin-top: 2px;
  line-height: 1.5;
  letter-spacing: -0.1px;
}
.lc-flow-link {
  color: var(--r);
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: color .2s ease;
}
.lc-flow-link:hover { color: var(--rh); text-decoration: underline; }

/* DEDICATED LIVE ACTIVITY STRIP */
.lc-recent-activity {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid #f5f4f0;
}
.lc-ra-header {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #5c1414;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  margin-bottom: 2px;
}
.lc-ra-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.lc-ra-item {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 2px 0;
  border-bottom: 1px solid rgba(0,0,0,0.02);
}
.lc-ra-item:last-child {
  border-bottom: none;
}
.lc-ra-title-line {
  display: flex;
  align-items: center;
  gap: 4px;
}
.lc-ra-username {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #1e1e1e;
  text-transform: lowercase;
}
.lc-ra-action {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #475569;
}
.lc-ra-details-line {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  padding-left: 14px;
  text-transform: lowercase;
  letter-spacing: 0.02em;
}

/* TRUST COPY & TICKER LABELS */
.lc-trust {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #8a8984;
  text-align: center;
  margin-top: 2px;
  padding-top: 10px;
  border-top: 1px solid #f5f4f0;
}
.lmobile-only {
  display: none !important;
}
.lc-trust-lock {
  color: #8a8984;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
  position: relative;
  top: -1px;
}
.lct-check {
  color: #145c14;
  font-weight: 700;
  margin-right: 6px;
}
.lct-cross {
  color: #5c1414;
  font-weight: 700;
  margin-right: 6px;
}
.lct-bullet {
  margin: 0 8px;
  color: #cbd5e1;
}
.lct-green {
  color: #145c14;
  font-weight: 700;
}
.lct-red {
  color: #5c1414;
  font-weight: 700;
}
.lct-locked {
  color: #1e1e1e;
  font-weight: 700;
}

/* ═══ INTEGRATED GLOBAL STATS ROW ═══ */
.lc-global-stats-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  background: #faf9f6;
  border: 1px solid #f2efeb;
  border-radius: 100px;
  padding: 5px 14px;
  width: fit-content;
  margin: 0 auto;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.02);
  white-space: nowrap;
}
.lc-global-stats-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.lc-global-stats-dot {
  width: 5px;
  height: 5px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(34,197,94,0.5);
  animation: statsPulse 2s infinite;
  display: inline-block;
  flex-shrink: 0;
}
@keyframes statsPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}
.lc-global-stats-num {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 11.5px;
  font-weight: 800;
  color: #1e1e1e;
  letter-spacing: -0.2px;
  line-height: 1;
}
.lc-global-stats-label {
  color: #64748b;
  line-height: 1;
  white-space: nowrap;
}
.lc-global-stats-divider {
  color: #cbd5e1;
  font-weight: 400;
  user-select: none;
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
.lcontracts{padding:30px 0 48px;background:#FAF9F7 !important;position:relative}
.lcontracts::after{display:none !important}
.lcontracts .lw{max-width:1280px}
.lcards{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;align-items:start !important;}
@media (max-width: 1024px) {
    .lcards{grid-template-columns:1fr}
}

/* ═══ RIVALRY CARDS ═══ */
.rv-card {
    background: #ffffff;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 24px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
    min-height: 440px;
}
.rv-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #7A1220;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 10;
}
.rv-card:hover::before {
    transform: scaleX(1);
}
.rv-card:hover {
    border-color: #94A3B8 !important;
    box-shadow: 0 24px 52px -10px rgba(15, 23, 42, 0.14), 0 4px 16px rgba(15, 23, 42, 0.05) !important;
    transform: translateY(-8px) scale(1.015) !important;
}
.rv-card-inner { padding: 0; }
.rv-card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 8px;
}
.rv-card-status {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; color: #166534;
    display: flex; align-items: center; gap: 6px;
}
.rv-card-status .dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #166534;
}
.rv-card-metric-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
}
.rv-card-metric {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px; font-weight: 800; color: #0F172A;
    letter-spacing: -0.3px; text-transform: uppercase;
}
.rv-card-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 600; color: #94A3B8;
    letter-spacing: 0.5px;
}
.rv-versus {
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: center; gap: 8px;
    margin-bottom: 16px;
}
.rv-player {
    display: flex; flex-direction: column; gap: 2px;
}
.rv-player.right { text-align: right; }
.rv-player-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px; font-weight: 700; letter-spacing: 1.2px;
    color: #94A3B8; text-transform: uppercase;
}
.rv-player-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600; color: #0F172A; letter-spacing: 0.02em;
    display: flex; align-items: center; gap: 5px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.rv-player.right .rv-player-name { justify-content: flex-end; }
.rv-lead-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.rv-player-growth {
    font-size: 26px; font-weight: 700; color: #0F172A;
    letter-spacing: -1px; margin-top: 2px; line-height: 1.1;
    font-family: 'Plus Jakarta Sans', sans-serif;
}
.rv-player-growth.leading { color: #166534; }
.rv-player-growth.trailing { color: #7A1220; }
.rv-vs-divider {
    display: flex; align-items: center; justify-content: center;
    width: 36px; flex-shrink: 0;
}
.rv-momentum {
    height: 4px; display: flex; overflow: hidden;
    margin: 0; background: #F1F5F9; border-radius: 2px;
}
.rv-momentum-left { background: #166534; border-radius: 2px 0 0 2px; }
.rv-momentum-right { background: #7A1220; border-radius: 0 2px 2px 0; }
.rv-card-bottom {
    display: flex; align-items: flex-end; justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid #F1F5F9;
    margin-top: 14px;
}
.rv-card-stake { display: flex; flex-direction: column; gap: 2px; }
.rv-card-stake-val { font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px; font-family: 'Plus Jakarta Sans', sans-serif; }
.rv-card-stake-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px; font-weight: 700; color: #94A3B8;
    letter-spacing: 1px; text-transform: uppercase;
}
.rv-card-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; color: #7A1220; letter-spacing: 0.5px; font-weight: 700;
    text-transform: uppercase;
}
.rv-card-provider-pill {
    display: inline-flex; align-items: center; padding: 3px 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px; font-weight: 700; letter-spacing: 0.5px;
    color: #fff; text-transform: uppercase; border-radius: 4px;
}
.lcard{border:1px solid #E2E8F0;border-radius:16px;padding:24px;display:flex;flex-direction:column;justify-content:flex-start;transition:all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;background:#FFFFFF !important;position:relative;overflow:hidden;cursor:pointer;box-sizing:border-box;min-height:440px;}
.lcard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:#7A1220;transform:scaleX(0);transform-origin:left;transition:transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);z-index:10}
.lcard:hover::before{transform:scaleX(1)}
.lcard:hover{border-color:#94A3B8 !important;box-shadow:0 24px 52px -10px rgba(15, 23, 42, 0.14), 0 4px 16px rgba(15, 23, 42, 0.05) !important;transform:translateY(-8px) scale(1.015) !important}

/* ═══ UNIFIED CTA BUTTON & SUBTEXT ANCHORING ═══ */
.lcard-btn {
    margin-top: auto !important;
    padding-top: 16px;
    width: 100%;
}
.lcard-subtext {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    color: #94A3B8;
    text-align: center;
    margin-top: 6px !important;
    margin-bottom: 0 !important;
}

/* ═══ EXPANDABLE HOVER DETAILS PANEL (MARKET STYLE) ═══ */
.lcard-hover-details, .rv-card-hover-details {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, margin 0.35s ease, padding 0.35s ease;
    border-top: 1px dashed transparent;
    margin-top: 0;
    padding-top: 0;
}
.lcard:hover .lcard-hover-details, .rv-card:hover .rv-card-hover-details {
    max-height: 120px;
    opacity: 1;
    margin-top: 14px;
    padding-top: 12px;
    border-top-color: #E2E8F0;
}
.lcard-hover-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #64748B;
    margin-bottom: 5px;
    text-transform: uppercase;
}
.lcard-hover-row .val {
    color: #0F172A;
    font-weight: 800;
}
.lcard-hover-row .val.green {
    color: #166534;
}
.lcard-subtext {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    color: #94A3B8;
    text-align: center;
    margin-top: 6px;
    font-style: italic;
}
.lcard-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px 12px}
.lcard-src{font-family:'Inter',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--t2);display:inline-flex;align-items:center;gap:8px;background:rgba(17,17,17,0.03);border:1px solid rgba(0,0,0,0.06);border-radius:6px;padding:5px 10px 5px 8px;transition:all 0.3s ease}
.lcard:hover .lcard-src{border-color:rgba(0,0,0,0.1);background:rgba(17,17,17,0.05)}
.lcard-src-logo{width:16px;height:16px;object-fit:contain;flex-shrink:0;opacity:0.7;transition:opacity 0.3s ease}
.lcard:hover .lcard-src-logo{opacity:1}
.lcard-tier{font-family:'Inter',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:5px 10px;border-radius:6px;display:inline-flex;align-items:center;white-space:nowrap}
.tier-pledge{color:#145C14;background:rgba(20,92,20,.06);border:1px solid rgba(20,92,20,.15)}
.tier-stake{color:#B45309;background:rgba(180,83,9,.06);border:1px solid rgba(180,83,9,.15)}
.tier-allin{color:#7A1220;background:rgba(122,18,32,.06);border:1px solid rgba(122,18,32,.18)}

.ltier-legend-bar {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 14px 20px;
    margin-bottom: 24px;
    gap: 20px;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.02);
}
.ltier-legend-item {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    padding-right: 10px;
}
.ltier-legend-item:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 22px;
    background: #E2E8F0;
}
.ltier-legend-desc {
    font-family: 'Inter', sans-serif;
    font-size: 11.5px;
    color: #475569;
    font-weight: 500;
    line-height: 1.35;
}
@media (max-width: 1024px) {
    .ltier-legend-bar {
        grid-template-columns: 1fr;
        gap: 12px;
        padding: 14px 16px;
    }
    .ltier-legend-item {
        padding-right: 0;
    }
    .ltier-legend-item:not(:last-child)::after {
        display: none;
    }
}
.lcard-title{font-family:'Inter Tight',sans-serif;font-size:19px;font-weight:600;color:var(--t1);margin-bottom:6px;letter-spacing:-.3px}
.lcard-target{font-size:13px;color:var(--t2);margin-bottom:24px;line-height:1.4}
.lcard-row{display:flex;justify-content:space-between;font-size:12px;padding:8px 0;border-bottom:1px solid rgba(229,229,229,.5)}
.lcard-row:last-of-type{border:none}
.lcard-row .k{color:var(--t3)}
.lcard-row .v{font-weight:600;color:var(--t1)}
.lcard-btn button{width:100%;height:44px;background:var(--t1);color:#fff;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center}
.lcard-btn button:hover{background:#7A1220 !important;transform:translateY(-2px) scale(1.02);box-shadow:0 8px 24px rgba(122, 18, 32, 0.4)}
.lcard-btn button::after{content:'→';opacity:0;transform:translateX(-6px);transition:all .25s cubic-bezier(.16, 1, 0.3, 1);display:inline-block;width:0;margin-left:0}
.lcard-btn button:hover::after{opacity:1;transform:translateX(0);width:auto;margin-left:6px}

/* ═══ RIVALRY CARD LAYOUT (MATCHING IMAGE 2 EXACTLY) ═══ */
.lcard-rivalry {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 16px !important;
    padding: 36px 24px !important;
    height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04), 0 12px 28px rgba(15, 23, 42, 0.06) !important;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    cursor: pointer !important;
}
.lcard-rivalry:hover {
    transform: translateY(-4px);
    border-color: #CBD5E1 !important;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08), 0 20px 40px rgba(15, 23, 42, 0.08) !important;
}

.lcard-riv-top {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}
.lcard-riv-status {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: #166534;
    letter-spacing: 1.2px;
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
}
.lcard-riv-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #16A34A;
    display: inline-block;
    box-shadow: 0 0 8px rgba(22, 163, 74, 0.6);
}
.lcard-riv-id-wrap {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
}
.lcard-riv-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: #64748B;
    letter-spacing: 1.2px;
    text-transform: uppercase;
}
.lcard-riv-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: #CBD5E1;
    letter-spacing: 1px;
}

.lcard-riv-match-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
}
.lcard-riv-col {
    display: flex;
    flex-direction: column;
}
.lcard-riv-col.is-left { text-align: left; }
.lcard-riv-col.is-right { text-align: right; }

.lcard-riv-role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: #94A3B8;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
}
.lcard-riv-user {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #0F172A;
    display: flex;
    align-items: center;
    gap: 5px;
}
.lcard-riv-col.is-right .lcard-riv-user {
    justify-content: flex-end;
}

.user-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
}
.user-dot.green { background: #16A34A; }
.user-dot.maroon { background: #991B1B; }

.lcard-riv-score {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 24px;
    font-weight: 900;
    line-height: 1.1;
    margin-top: 4px;
    letter-spacing: -0.5px;
}
.lcard-riv-score.green { color: #16A34A; }
.lcard-riv-score.maroon { color: #991B1B; }

.lcard-riv-swords {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    padding: 0 4px;
}
.lcard-riv-swords svg {
    width: 22px;
    height: 22px;
    stroke: #CBD5E1 !important;
}

.lcard-riv-progress-wrap {
    height: 8px;
    width: 100%;
    background: #F1F5F9;
    border-radius: 100px;
    display: flex;
    overflow: hidden;
    margin-bottom: 20px;
}
.lcard-riv-bar-green {
    height: 100%;
    background: #16A34A;
    border-radius: 100px 0 0 100px;
}
.lcard-riv-bar-maroon {
    height: 100%;
    background: #7A1220;
    border-radius: 0 100px 100px 0;
}

.lcard-riv-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0;
    padding-top: 14px;
    border-top: 1px solid #F1F5F9;
}
.lcard-riv-exp-val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #0F172A;
    line-height: 1;
}
.lcard-riv-exp-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    color: #64748B;
    letter-spacing: 1px;
    margin-top: 4px;
}
.lcard-riv-badge-area {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}
.lcard-src-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 4px 10px;
    border-radius: 6px;
    color: #FFFFFF;
    text-transform: uppercase;
}
.lcard-src-tag.stripe { background: #635BFF; }
.lcard-src-tag.x { background: #000000; }
.lcard-src-tag.shopify { background: #96bf48; }

.lcard-riv-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: #64748B;
    letter-spacing: 0.8px;
}

/* ═══ HOW IT WORKS ═══ */
.lhow{padding:75px 0;background:#FAF8F5 !important;position:relative}
.lhow::before{display:none !important}
.lhow::after{display:none !important}
.lhow-h{font-family:'Inter Tight',sans-serif;font-size:clamp(32px,5vw,56px);font-weight:400;letter-spacing:-1px;margin-bottom:16px}
.lhow-h strong{font-weight:700;color:var(--r)}
.lhow-sub{font-size:18px;color:var(--t2);margin-bottom:44px;max-width:640px;line-height:1.6}
.lsteps{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;background:transparent;border:none;margin-top:24px}
.lstep{padding:32px;background:#fff;border:1px solid #eaeaea;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.02);transition:all 0.3s ease;position:relative;overflow:hidden;display:flex;flex-direction:column;z-index:1}
.lstep:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.06);border-color:rgba(92,20,20,0.15)}
.lstep-num{font-family:'Inter Tight',sans-serif;font-size:48px;font-weight:700;color:var(--r) !important;opacity:0.1;line-height:1;margin-bottom:16px;letter-spacing:-2px;transition:opacity 0.3s ease}
.lstep:hover .lstep-num{opacity:0.2}
.lstep-h{font-family:'Inter Tight',sans-serif;font-size:20px;font-weight:600;color:var(--t1);margin-bottom:12px;letter-spacing:-.4px;position:relative}
.lstep-p{font-size:15px;color:var(--t2);line-height:1.6;position:relative;z-index:1}

/* Mini CTA Block */
.lmini-cta{text-align:center;background:transparent;border:none;padding:75px 0;margin:0 auto;max-width:800px}
.lmini-cta-h{font-family:'Inter Tight',sans-serif;font-size: 30px;font-weight:600;margin-bottom:16px;letter-spacing:-1px;color:var(--t1)}
.lmini-cta-p{font-size:18px;color:var(--t2);margin-bottom:28px;line-height:1.6}
.lmini-cta-micro{font-size:12px;color:var(--t3);margin-top:20px;font-weight:500;text-transform:uppercase;letter-spacing:2px}


/* ═══ CONTRACT TYPES ═══ */
.ltypes{padding:100px 0;background:#FAF8F5 !important}
.ltypes-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px}
.ltype{background:transparent;border:none;padding:40px 0 0 0;border-top:1px solid rgba(0,0,0,0.08);transition:border-color 0.3s ease}
.ltype:hover{border-top-color:var(--r)}
.ltype-badge{font-family:'Inter',monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:24px;display:inline-block;padding:0;background:transparent!important;border:none!important}
.ltype-h{font-family:'Inter Tight',sans-serif;font-size: 28px;font-weight:600;letter-spacing:-1px;margin-bottom:16px}
.ltype-p{font-size:18px;color:var(--t2);line-height:1.65;margin-bottom:32px}
.ltype-detail{font-size:15px;color:var(--t2);line-height:1.6;padding-top:24px;border-top:1px dashed rgba(0,0,0,0.08)}

/* ═══ FAQ ═══ */
.lfaq{padding:36px 0;text-align:center;background:#FAF8F5 !important;position:relative}
.lfaq::after{display:none !important}
.lfaq-wrap{max-width:640px;margin:0 auto;text-align:left}
.lfaq .lred-dash{justify-content:center}
.fq{border-bottom:1px solid var(--d)}.fq-q{padding:18px 0;font-family:'Inter Tight',sans-serif;font-size:15px;font-weight:600;color:var(--t1);cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;transition:color 0.2s ease}.fq-q:hover{color:var(--r)}.fq-q::after{content:'+';font-size:16px;color:var(--t3);transition:transform 0.3s ease}.fq.open .fq-q::after{content:'\\2212';transform:rotate(180deg)}.fq-a{max-height:0;overflow:hidden;transition:max-height .3s;font-size:13px;color:var(--t2);line-height:1.6}.fq.open .fq-a{max-height:400px;padding-bottom:18px}.fq-a strong{color:var(--t1);font-weight:600}
/* ═══ FINAL CTA ═══ */
.lfoot{background:#FAF8F5 !important;text-align:center;padding:32px 24px;position:relative;overflow:hidden}
.lfoot::before{display:none !important}
.lfoot-overdue{display:inline-flex;align-items:center;gap:8px;background:rgba(92,20,20,0.04);border:1px solid rgba(92,20,20,0.12);padding:6px 14px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--r);margin-bottom:24px;box-shadow:0 2px 8px rgba(92,20,20,0.02);position:relative;z-index:1}
.lfoot-h{font-family:'Inter Tight',sans-serif;font-size:clamp(24px,4vw,36px);font-weight:700;color:var(--t1);letter-spacing:-1px;line-height:1.15;margin-bottom:12px;position:relative;z-index:1}
.lfoot-h em{font-style:normal;color:var(--r);font-weight:800}
.lfoot-sub{font-size:15px;color:var(--t2);font-weight:600;margin-bottom:28px;position:relative;z-index:1}
.lfoot-btn{display:inline-flex;height:52px;padding:0 36px;align-items:center;justify-content:center;background:var(--r) !important;color:#fff !important;font-size:13px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;border:none;cursor:pointer;transition:all .3s cubic-bezier(.16, 1, 0.3, 1);position:relative;overflow:hidden;z-index:1}
.lfoot-btn:hover{background:var(--rh) !important;transform:scale(1.04);box-shadow:0 8px 32px rgba(92,20,20,0.25)}
.lfoot-btn::after{content:'→';opacity:0;transform:translateX(-6px);transition:all .25s cubic-bezier(.16, 1, 0.3, 1);display:inline-block;width:0;margin-left:0}
.lfoot-btn:hover::after{opacity:1;transform:translateX(0);width:auto;margin-left:8px}
.lfoot-micro{font-size:12px;color:var(--t3);margin-top:16px;font-weight:500;letter-spacing:.5px;position:relative;z-index:1}
.lfoot-line{margin-top:0;padding-top:0;border-top:none;font-size:10px;color:var(--t3);font-family:'Inter',monospace;text-transform:uppercase;letter-spacing:1.5px;position:relative;z-index:1}

/* ═══ RESPONSIVE ═══ */
@media(max-width:768px){
  /* ── 1. UNIFIED MAIN SECTION HEADINGS (STRICT SAME SIZE ON MOBILE) ── */
  .lh1,
  .lh-section-title,
  .lhow-h,
  .lmini-cta-h,
  .lfoot-h,
  .lhow-title,
  .ltypes-headline,
  .lledger-h-title,
  .lledger-h-title-prod {
    font-size: 26px !important;
    line-height: 1.2 !important;
    letter-spacing: -0.6px !important;
    font-weight: 800 !important;
    margin-bottom: 14px !important;
  }

  /* ── 2. UNIFIED SECTION SUBTITLES & BODY TEXT ── */
  .lsub,
  .lh-section-subtitle,
  .lhow-sub,
  .lmini-cta-p,
  .lfoot-sub,
  .lemo-body,
  .ltype-p,
  .lhow-body,
  .lhow-caption,
  .ltype-desc-new {
    font-size: 15px !important;
    line-height: 1.55 !important;
    letter-spacing: -0.1px !important;
    color: var(--t2) !important;
    margin-bottom: 20px !important;
  }

  /* ── 3. UNIFIED CARD & SUBSECTION HEADINGS ── */
  .lcard-title,
  .lhow-card-title,
  .lstep-h,
  .ltype-h,
  .ltype-title-new,
  .lhow-timeline-title,
  .lstat-label,
  .lstat-item-borderless .lstat-label,
  .lspec-title {
    font-size: 18px !important;
    line-height: 1.3 !important;
    font-weight: 700 !important;
    letter-spacing: -0.3px !important;
  }

  /* ── 4. UNIFIED CARD DETAILS & SECONDARY COPY ── */
  .lcard-target,
  .lhow-card-desc,
  .lstep-p,
  .ltype-detail,
  .lhow-timeline-desc,
  .lstat-sub,
  .lspec-desc {
    font-size: 13px !important;
    line-height: 1.5 !important;
    color: var(--t3) !important;
  }

  /* ── 5. UNIFIED SECTION EYEBROWS & BADGES ── */
  .lmono,
  .lred-dash span,
  .lh-eyebrow,
  .ltype-badge,
  .ltype-badge-new,
  .lhow-card-badge {
    font-size: 11px !important;
    font-weight: 700 !important;
    letter-spacing: 1.2px !important;
    text-transform: uppercase !important;
  }

  /* ── 6. HOMEPAGE SECTION PADDING & LAYOUT SYMMETRY ── */
  .lpromo-bar { height: auto; min-height: 32px; padding: 6px 10px; line-height: 1.3; font-size: 9px; }
  .ln { top: 32px; }
  .lmain { padding-top: 84px; }
  .lhide-mobile{display:none !important}
  .ln-in{padding:0 16px; height: 60px;}
  .ln-cta{padding:6px 10px; font-size:11px; letter-spacing:0.5px}
  .lhero-grid{grid-template-columns:1fr;gap:32px;padding:120px 0 24px}
  .lhero-right {
    display: flex !important;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 32px;
  }
  .lactivity-card {
    max-width: 100% !important;
    padding: 16px 20px !important;
    gap: 16px !important;
  }
  .lc-flow-horizontal {
    padding: 8px 10px !important;
    gap: 6px !important;
  }
  .lc-flow-val {
    font-size: 14px !important;
  }
  .lc-col-final .lc-flow-val {
    font-size: 14px !important;
  }
  .lbtn{height:48px;padding:0 24px;font-size:11px}
  .lbtn-r{height:52px;font-size:12px;padding:0 28px}
  .lcards{display:flex !important;overflow-x:auto !important;scroll-snap-type:x mandatory !important;gap:16px !important;padding:12px 24px 24px !important;margin:0 -24px !important;scrollbar-width:none}
  .lcards::-webkit-scrollbar{display:none}
  .lcard{flex:0 0 280px !important;scroll-snap-align:start !important;padding:24px 20px !important;min-height:auto !important}
  .lcard-row{padding:6px 0;font-size:11px}
  .lcard-btn{padding-top:16px}
  .lcontracts{padding:36px 0 40px !important}
  .lhow{padding:36px 0 !important}
  .lsteps{grid-template-columns:1fr;gap:16px}
  .lstep{padding:24px}
  .lstep-num{font-size: 36px;top:16px;right:16px;margin-bottom:0}
  .lmini-cta{padding:36px 20px;margin:20px auto}
  .lmini-cta-micro{font-size:11px}
  .ltypes{padding:36px 0 !important}
  .ltypes-grid{grid-template-columns:1fr;gap:28px}
  .ltype{padding:20px 0 0 0}
  .lex{padding:32px 0 !important}
  .lex-box{margin:0 auto}
  .lfaq{padding:36px 0 !important}
  .fq-q{font-size:14px;padding:14px 0}
  .lfoot{padding:40px 20px 56px !important}
  .lctas{flex-direction:column}.lbtn{width:100%;justify-content:center}
}
@media(max-width:600px){
  .lledger-table th:nth-child(3),
  .lledger-table td:nth-child(3),
  .lledger-table th:nth-child(4),
  .lledger-table td:nth-child(4),
  .lledger-table th:nth-child(6),
  .lledger-table td:nth-child(6) {
    display: none !important;
  }
  .lledger-table {
    min-width: 100% !important;
  }
}
@media(max-width:540px){
  .lsteps{grid-template-columns:1fr}
  .lstep{border-right:none!important;border-bottom:1px solid var(--d)!important}
  .lstep:last-child{border-bottom:none!important}
}

/* ═══ SLIDE-OUT PANEL ═══ */
.pnl-overlay { position: fixed; inset: 0; background: rgba(10,10,10,0.35); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); z-index: 90; opacity: 0; visibility: hidden; transition: opacity 0.35s ease, visibility 0.35s ease; }
.pnl-overlay.open { opacity: 1; visibility: visible; }
.pnl-drawer { position: fixed; top: 0; right: 0; width: 380px; max-width: 90vw; height: 100%; background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 100; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; box-shadow: -16px 0 48px rgba(92, 20, 20, 0.08); border-left: 1px solid rgba(229, 229, 229, 0.5); }
.pnl-drawer.open { transform: translateX(0); }
.pnl-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 28px 20px; border-bottom: 1px solid rgba(229, 229, 229, 0.4); flex-shrink: 0; }
.pnl-header-left { display: flex; align-items: center; gap: 10px; }
.pnl-header-title { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #5C1414; }
.pnl-close { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid transparent; border-radius: 50%; cursor: pointer; color: #888; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.pnl-close:hover { background: rgba(92, 20, 20, 0.05); color: #5C1414; transform: rotate(90deg); }

/* User identity card */
.pnl-user { display: none; align-items: center; gap: 16px; padding: 24px 28px; background: linear-gradient(135deg, rgba(92, 20, 20, 0.03) 0%, rgba(255, 255, 255, 0.8) 100%); border-bottom: 1px solid rgba(229, 229, 229, 0.5); border-left: 4px solid #5C1414; flex-shrink: 0; }
.pnl-user.visible { display: flex; }
.pnl-user-badge { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #111; border: 2px solid rgba(92, 20, 20, 0.1); flex-shrink: 0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.pnl-user-initial { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 800; color: #fff; }
.pnl-user-avatar { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: none; }
.pnl-user-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.pnl-user-name { font-size: 15px; font-weight: 700; color: #111; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pnl-user-role { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888; font-family: 'JetBrains Mono', monospace; }

.pnl-body { flex: 1; overflow-y: auto; padding: 0; }
.pnl-body::-webkit-scrollbar { width: 3px; }
.pnl-body::-webkit-scrollbar-track { background: transparent; }
.pnl-body::-webkit-scrollbar-thumb { background: #e5e5e5; }
.pnl-section-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #888; padding: 24px 28px 12px; display: flex; align-items: center; gap: 8px; }
.pnl-section-label::after { content: ''; flex: 1; height: 1px; background: rgba(229, 229, 229, 0.3); }

.pnl-nav-link { display: flex; align-items: center; gap: 14px; padding: 16px 28px; font-size: 15px; font-weight: 600; color: #444; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.2px; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); position: relative; opacity: 0; transform: translateX(12px); animation: pnlSlideIn 0.35s ease forwards; border-left: 3px solid transparent; }
.pnl-nav-link:hover { background: rgba(92, 20, 20, 0.02); color: #5C1414; border-left-color: rgba(92, 20, 20, 0.2); padding-left: 36px; }
.pnl-nav-link.active { color: #5C1414; font-weight: 700; background: linear-gradient(90deg, rgba(92, 20, 20, 0.04) 0%, rgba(255, 255, 255, 0.5) 100%); border-left-color: #5C1414; }
.pnl-nav-indicator { width: 5px; height: 5px; background: #d4d4d4; border-radius: 50%; flex-shrink: 0; transition: all 0.25s ease; }
.pnl-nav-link.active .pnl-nav-indicator { background: #5C1414; box-shadow: 0 0 8px rgba(92, 20, 20, 0.6); }
.pnl-nav-link:hover .pnl-nav-indicator { background: #5C1414; transform: scale(1.3); }

.pnl-nav-group { display: flex; flex-direction: column; }
.pnl-chevron { opacity: 0.4; transition: transform 0.25s ease; }
.pnl-nav-group.expanded .pnl-chevron { transform: rotate(180deg); }

.pnl-subnav { display: none; flex-direction: column; background: rgba(92, 20, 20, 0.01); padding-bottom: 8px; }
.pnl-nav-group.expanded .pnl-subnav { display: flex; }
.pnl-subnav-link { display: flex; align-items: center; padding: 12px 28px 12px 48px; font-size: 14px; font-weight: 600; color: #666; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; border-left: 2px solid rgba(229, 229, 229, 0.6); margin-left: 34px; transition: all 0.2s ease; }
.pnl-subnav-link:hover, .pnl-subnav-link.active { color: #5C1414; border-left-color: #5C1414; background: rgba(92, 20, 20, 0.03); }

/* Divider */
.pnl-divider { height: 1px; background: rgba(229, 229, 229, 0.4); margin: 4px 28px; }

/* Account links */
.pnl-acct-link { display: flex; align-items: center; gap: 12px; padding: 14px 28px; font-size: 14px; font-weight: 600; color: #555; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s ease; opacity: 0; transform: translateX(12px); animation: pnlSlideIn 0.35s ease forwards; }
.pnl-acct-link:hover { background: rgba(92, 20, 20, 0.02); color: #5C1414; padding-left: 36px; }

/* Sign out */
.pnl-signout { display: flex; align-items: center; gap: 12px; width: calc(100% - 56px); margin: 16px 28px 8px; padding: 14px 20px; font-size: 11px; font-weight: 700; color: #5C1414; background: rgba(92, 20, 20, 0.04); border: 1px solid rgba(92, 20, 20, 0.12); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; text-align: left; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.pnl-signout:hover { background: rgba(92, 20, 20, 0.08); border-color: rgba(92, 20, 20, 0.2); color: #6B1212; transform: translateY(-1px); }

.pnl-connect-section {
  padding: 24px;
  margin: 16px 20px 24px;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  border: 1px solid rgba(92, 20, 20, 0.12);
  box-shadow: 0 10px 30px rgba(92, 20, 20, 0.04);
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.pnl-connect-section::before {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(92, 20, 20, 0.06) 0%, transparent 70%);
  pointer-events: none;
  border-radius: 50%;
}
.pnl-connect-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  background: rgba(20, 92, 20, 0.05);
  border: 1px solid rgba(20, 92, 20, 0.15);
  color: #145C14;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 4px;
  position: relative;
  z-index: 2;
}
.pnl-connect-badge-dot {
  width: 5px;
  height: 5px;
  background: #145C14;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(20, 92, 20, 0.6);
  animation: badgeDotPulse 1.8s ease-in-out infinite;
}
.pnl-connect-promo {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.4;
  letter-spacing: -0.2px;
  position: relative;
  z-index: 2;
}
.pnl-connect-promo-sub {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
  position: relative;
  z-index: 2;
}
.pnl-connect-btn {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #FFFFFF !important;
  background: var(--r) !important;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(92, 20, 20, 0.15);
  position: relative;
  z-index: 2;
}
.pnl-connect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(92, 20, 20, 0.25);
  background: var(--rh) !important;
}
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

/* Redesign activity feed marquee styles container layout */
.lpreview-container {
  position: relative;
  width: 100%;
  max-width: 440px;
  height: auto;
}

/* ═══ SOCIAL PROOF (REAL RESULTS) ═══ */
.lreal-results {
    padding: 56px 0 40px;
    background: var(--bg);
    position: relative;
}
.lreal-results::after {
    display: none !important;
}
.lreal-header-stack {
    margin-bottom: 28px;
}
.lreal-header-stack .lred-dash {
    margin-bottom: 6px;
}
.lh-section-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(26px, 3.5vw, 36px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -1px;
    color: var(--t1);
    margin-bottom: 8px;
}
.lh-section-subtitle {
    font-size: 14px;
    color: #64748B;
    line-height: 1.45;
    margin-bottom: 0;
    max-width: 640px;
}
.lstats-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 36px;
}
.lstat-card {
    background: #FAFAF7 !important;
    border: 1px solid rgba(226, 232, 240, 0.85) !important;
    border-radius: 16px !important;
    box-shadow: 0 12px 32px -10px rgba(15, 23, 42, 0.05), 0 2px 6px rgba(15, 23, 42, 0.02) !important;
    padding: 20px 20px !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 154px;
    position: relative;
    box-sizing: border-box;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
}
.lstat-card:hover {
    transform: translateY(-3px);
    border-color: rgba(203, 213, 225, 0.9) !important;
    box-shadow: 0 20px 44px -12px rgba(15, 23, 42, 0.09), 0 4px 12px rgba(15, 23, 42, 0.03) !important;
}
.lstat-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    height: 42px;
}
.lstat-num {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 38px;
    font-weight: 800;
    color: #7A1220;
    letter-spacing: -1.2px;
    line-height: 1;
    display: block;
}
.lstat-card-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(122, 18, 32, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
}
.lstat-card-footer {
    display: flex;
    flex-direction: column;
    margin-top: auto;
}
.lstat-label {
    font-family: 'Inter Tight', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 4px 0;
    line-height: 1.25;
    min-height: 18px; /* Lock label baseline */
}
.lstat-sub {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    color: #64748B;
    line-height: 1.4;
    text-wrap: balance;
    margin: 0;
    min-height: 34px; /* Lock supporting line baseline */
}
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
.lcard-popular{border-color:#0F172A !important;transform:scale(1.02);box-shadow:0 12px 30px rgba(15,23,42,0.06);position:relative;z-index:10}
.lcard-popular:hover{transform:scale(1.04) translateY(-6px) !important;box-shadow:0 20px 40px rgba(15,23,42,0.1) !important}
.lcard-popular-badge{background:var(--r);color:#fff;font-family:'Inter',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:5px 10px;border-radius:6px;white-space:nowrap}
.tier-3x-yield{color:#fff !important;background:var(--r) !important;border:1px solid var(--r) !important}

/* ═══ EMOTIONAL REFRAME ═══ */
.lemo-reframe{padding:100px 0;background:var(--bg);position:relative}
.lemo-reframe::after{content:'';position:absolute;bottom:0;left:0;right:0;height:60px;background:linear-gradient(to bottom, var(--bg), var(--s));pointer-events:none}
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

/* New "Why It Works" Layout Styles */
.lhow-it-works-section {
    padding: 100px 0;
    background: var(--s);
    position: relative;
}
.lhow-it-works-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(to bottom, var(--s), var(--s));
    pointer-events: none;
}
.lhow-it-works-section::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 80px;
    background: linear-gradient(to bottom, var(--s), var(--bg));
    pointer-events: none;
}
.lhow-layout {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 64px;
    align-items: flex-start;
    margin-top: 32px;
}
.lhow-intro {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.lhow-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(28px, 3vw, 44px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -1.2px;
    color: var(--t1);
    margin: 0;
}
.lhow-body {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.65;
    color: var(--t2);
    margin: 0;
}
.lhow-caption {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: var(--t3);
    margin: 0;
}
.lhow-flow {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
}
.lflow-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.lflow-header {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--t3);
    margin: 0;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.execution .lflow-header {
    color: var(--r);
    border-bottom-color: rgba(92, 20, 20, 0.15);
}
.lflow-steps {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.lflow-step {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}
.lflow-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.25);
    margin-top: 3px;
}
.execution .lflow-num {
    color: rgba(92, 20, 20, 0.4);
}
.lflow-text {
    font-family: 'Inter', sans-serif;
    font-size: 13.5px;
    line-height: 1.45;
    color: var(--t2);
}
.execution .lflow-text {
    color: var(--t1);
    font-weight: 550;
}
.lflow-text.highlight-green {
    color: #145c14 !important;
    font-weight: 700;
}

/* ═══ RESPONSIVE UPGRADES ═══ */
@media(max-width:768px){
  .lstats-grid{grid-template-columns:1fr;gap:16px;margin-bottom:40px;margin-top:16px}
  .lledger-container{padding:20px;margin-top:32px}
  .lledger-header{flex-direction:column;align-items:flex-start;gap:8px;padding-bottom:16px}
  .lreal-results{padding:50px 0}
  .lhow-grid{grid-template-columns:1fr;gap:16px;margin-top:32px}
  .lemo-grid{grid-template-columns:1fr;gap:32px}
  .lemo-comparison-card{grid-template-columns:1fr;gap:24px}
  .lemo-divider{width:100%;height:1px}
  .lemo-item{font-size:13px}
  .lemo-reframe{padding:50px 0}
  .lc-recent-activity { display: none !important; }
  .l-exec-item { font-size: 10px !important; white-space: nowrap !important; }
  
  /* New Why It Works mobile adjustments */
  .lhow-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .lhow-flow {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .lhow-it-works-section {
    padding: 60px 0;
  }
}

/* Staggered Scroll Reveals */
.reveal-item {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-item.v {
  opacity: 1;
  transform: none;
}

/* Global Disable Entrance Animations */
.lp-no-animations .reveal-item,
.lp-no-animations [data-r],
.lp-no-animations .animate-fade-in-up,
.lp-no-animations .animate-scale-in {
  opacity: 1 !important;
  transform: none !important;
  transition: none !important;
  animation: none !important;
}

/* Prefers Reduced Motion override */
@media (prefers-reduced-motion: reduce) {
  .reveal-item,
  [data-r],
  .animate-fade-in-up,
  .animate-scale-in,
  .lhero-right,
  .lcard,
  .lstep,
  .lhow-timeline-step,
  .lstats-grid-borderless,
  .lstat-item-borderless {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
    animation: none !important;
  }
}

/* One-way Glass Sheen Hover Sweep */
.lhow-card, .lstep, .lstat-card {
  position: relative;
  overflow: hidden;
}
.lhow-card::after, .lstep::after, .lstat-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
  transform: skewX(-25deg);
  pointer-events: none;
  z-index: 5;
}
.lhow-card:hover::after, .lstep:hover::after, .lstat-card:hover::after {
  left: 150%;
  transition: left 0.8s ease-in-out;
}



/* Upgraded Live ticker status strip styles */
.l-live-ticker-strip {
    border-top: 1px solid var(--d);
    border-bottom: 1px solid var(--d);
    padding: 10px 0;
    background: #fff;
}
.l-live-rivalry-preview {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 0.5px solid rgba(0, 0, 0, 0.12);
    cursor: pointer;
    max-width: 520px;
    background: transparent;
    box-shadow: none;
}
.l-lr-hdr {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: #888;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    text-transform: uppercase;
}
.l-lr-dot {
    width: 4px;
    height: 4px;
    background: #7A1220 !important;
    border-radius: 50%;
    display: inline-block;
}
.l-lr-ticker {
    display: flex;
    align-items: center;
    gap: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    color: var(--t2);
    letter-spacing: -0.2px;
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    padding: 10px 14px;
    width: fit-content;
    white-space: nowrap !important;
    transition: background 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.l-live-rivalry-preview:hover .l-lr-ticker {
    background: #ffffff;
    border-color: rgba(20, 18, 31, 0.25);
    box-shadow: 0 6px 16px rgba(20, 18, 31, 0.06);
    transform: translateY(-2px);
}
.l-lr-token {
    font-weight: 600;
    color: #000;
    white-space: nowrap !important;
}
.l-lr-num {
    font-weight: 700;
    margin-left: 4px;
    white-space: nowrap !important;
}
.l-lr-num.lead {
    color: #145c14;
}
.l-lr-num.lag {
    color: #14121F !important;
}
.l-lr-divider {
    color: rgba(17, 17, 17, 0.08);
    font-weight: 400;
}
.l-lr-cap, .l-lr-time {
    font-weight: 700;
    color: #555;
    white-space: nowrap !important;
}
.l-lr-action-badge {
    font-weight: 800;
    color: #14121F !important;
    font-size: 10.5px;
    letter-spacing: 0.5px;
    white-space: nowrap !important;
    transition: color 0.2s ease;
}
.l-live-rivalry-preview:hover .l-lr-action-badge {
    color: #14121F !important;
}
.l-live-rivalry-preview:hover .l-lr-action-badge span {
    transform: translateX(3px);
}
.l-ticker-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    color: var(--t2);
}
.l-ticker-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    color: var(--r);
    letter-spacing: 1px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}
.l-ticker-pulse {
    width: 5px;
    height: 5px;
    background: var(--r);
    border-radius: 50%;
    animation: badgeDotPulse 1.8s ease-in-out infinite;
}
.l-ticker-scroll {
    width: 480px;
    max-width: 100%;
    overflow: hidden;
    position: relative;
    height: 18px;
    display: flex;
    align-items: center;
}
.l-exec-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    white-space: nowrap;
}
.l-exec-item.active {
    opacity: 1;
    transform: translateY(0);
}
.l-exec-item.exit {
    opacity: 0;
    transform: translateY(-6px);
}
.l-exec-status-ok {
    color: var(--g);
    font-weight: bold;
}
.l-exec-username {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: var(--t1);
}
.l-exec-amount {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: #111;
}
.l-exec-time {
    color: var(--t3);
    font-size: 11px;
}

/* ═══ ELEVATED SUPPORTED INTEGRATIONS & STATS BAND ═══ */
.l-stats-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    color: #94A3B8;
    text-align: center;
    margin-bottom: 22px;
}
.l-global-stats-bar {
    background: #FAFAF7 !important;
    border: 1px solid rgba(226, 232, 240, 0.85) !important;
    border-radius: 20px !important;
    box-shadow: 0 16px 44px -12px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.02) !important;
    padding: 32px 24px !important;
    margin: 40px auto !important;
    position: relative;
    max-width: 1200px;
    transition: box-shadow 0.35s ease, border-color 0.35s ease;
}
.l-global-stats-bar:hover {
    border-color: rgba(203, 213, 225, 0.9) !important;
    box-shadow: 0 24px 56px -14px rgba(15, 23, 42, 0.09), 0 4px 12px rgba(15, 23, 42, 0.03) !important;
}
.l-global-stats-bar::before, .l-global-stats-bar::after {
    display: none !important;
}
.l-stats-bar-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
}
.l-stat-bar-item {
    text-decoration: none !important;
    position: relative;
    overflow: visible;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none !important;
    outline: none;
    cursor: pointer;
    padding: 0;
    width: 100%;
}
/* Soft gradient dividers */
.l-stat-bar-item:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 15%;
    bottom: 15%;
    width: 1px;
    background: linear-gradient(to bottom, rgba(226, 232, 240, 0), rgba(203, 213, 225, 0.65), rgba(226, 232, 240, 0));
    pointer-events: none;
}
.l-stat-bar-wrapper {
    position: relative;
    overflow: hidden;
    height: 76px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateZ(0); /* promote to GPU */
}
.l-stat-bar-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-align: center;
    opacity: 0.85;
    filter: desaturate(15%);
    transform: translateY(0) scale(1);
    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.l-stat-bar-content.incoming {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    pointer-events: none;
}
.l-stat-bar-item:hover .l-stat-bar-content.current {
    opacity: 1;
    filter: desaturate(0%);
    transform: translateY(-2px) scale(1.04);
}
.l-stat-bar-value-zone {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}
.l-stat-bar-val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.6px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    transition: color 0.3s ease;
}
.l-stat-bar-item:hover .l-stat-bar-val {
    color: #7A1220;
}
.l-stat-bar-logo-wrap {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.l-stat-bar-logo-wrap svg {
    display: block;
    width: auto;
    object-fit: contain;
    transition: transform 0.3s ease, filter 0.3s ease;
}
.l-stat-bar-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.6px;
    color: #64748B;
    line-height: 1.2;
    margin-top: 2px;
}
.l-stat-bar-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateY(4px);
    opacity: 0;
    transition: opacity 220ms ease-out, transform 220ms ease-out;
    transition-delay: 60ms;
    pointer-events: none;
    
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: var(--r);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    white-space: nowrap;
}
.l-stat-bar-static-cta {
    display: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    font-weight: 700;
    color: var(--r);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin-top: 4px;
    white-space: nowrap;
}

/* Hover & Focus state transitions */
.l-stat-bar-item:hover .l-stat-bar-wrapper,
.l-stat-bar-item:focus-visible .l-stat-bar-wrapper {
    filter: blur(6px);
    opacity: 0.35;
}
.l-stat-bar-item:hover .l-stat-bar-overlay,
.l-stat-bar-item:focus-visible .l-stat-bar-overlay {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0);
}

/* Touch & hover: none media query fallback */
@media (hover: none) {
    .l-stat-bar-static-cta {
        display: block;
    }
    .l-stat-bar-item:hover .l-stat-bar-wrapper,
    .l-stat-bar-item:focus-visible .l-stat-bar-wrapper {
        filter: none !important;
        opacity: 1 !important;
    }
    .l-stat-bar-item:hover .l-stat-bar-overlay,
    .l-stat-bar-item:focus-visible .l-stat-bar-overlay {
        opacity: 0 !important;
    }
}

/* Prefers reduced motion overrides */
@media (prefers-reduced-motion: reduce) {
    .l-stat-bar-wrapper {
        transition: opacity 120ms linear !important;
        filter: none !important;
    }
    .l-stat-bar-overlay {
        transition: opacity 120ms linear !important;
        transform: translate(-50%, -50%) !important;
        transition-delay: 0s !important;
    }
    .l-stat-bar-item:hover .l-stat-bar-wrapper,
    .l-stat-bar-item:focus-visible .l-stat-bar-wrapper {
        filter: none !important;
        opacity: 0.35 !important;
    }
}

/* Responsive height adjustment */
@media (max-width: 768px) {
    .l-stat-bar-wrapper {
        height: 38px;
    }
    .l-stat-bar-content {
        gap: 3px;
    }
}
@media(max-width:768px) {
    .lmobile-only {
        display: block !important;
    }
    .l-global-stats-bar {
        padding: 20px 0 !important;
    }
    .l-stats-bar-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 0 !important;
    }
    .l-stat-bar-item {
        border-right: 1px solid rgba(17, 17, 17, 0.05) !important;
        gap: 3px !important;
    }
    .l-stat-bar-item:nth-child(2) {
        border-right: none !important;
    }
    .l-stat-bar-val {
        font-size: 20px !important;
    }
    .l-stat-bar-lbl {
        font-size: 8px !important;
        letter-spacing: 0.8px !important;
    }
    .l-live-rivalry-preview {
        display: none !important;
    }
}



/* Live state ticker */
.lc-live-state-ticker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0,0,0,0.015);
    border: 1px dashed rgba(0,0,0,0.06);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 10.5px;
    transition: opacity 0.3s ease;
    margin-top: 8px;
}
.lc-live-state-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: var(--t3);
    letter-spacing: 0.5px;
    transition: opacity 0.3s ease;
}
.lc-live-state-val {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    color: var(--r);
    transition: opacity 0.3s ease, color 0.3s ease;
}

/* Card live indicators */
.lcard-live-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    margin-bottom: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--t3);
}
.lcard-live-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--g);
    display: inline-block;
    animation: badgeDotPulse 1.8s ease-in-out infinite;
}
.lcard-live-dot.urgent {
    background: var(--r);
}
.lcard-live-text {
    line-height: 1;
}

/* Community momentum activity */
.l-community-momentum {
    background: var(--s);
    padding: 20px 0;
    position: relative;
}
.l-momentum-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: var(--t2);
}
.l-momentum-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: var(--r);
    letter-spacing: 1px;
    text-transform: uppercase;
    flex-shrink: 0;
}
.l-momentum-items {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}
.l-momentum-item strong {
    color: #111;
}
.l-momentum-dot {
    color: #ccc;
    font-weight: bold;
}
@media(max-width:768px) {
    .l-momentum-wrap {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
    .l-momentum-items {
        gap: 8px 12px;
    }
}

/* Rivalry Quick-View Overlay Modal */
.l-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(12px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.l-modal-overlay.active {
    opacity: 1;
    pointer-events: auto;
}
.l-modal-container {
    background: #fff;
    border: 1px solid var(--d);
    border-radius: 16px;
    width: 90%;
    max-width: 580px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.12);
    overflow: hidden;
    transform: translateY(16px) scale(0.98);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.l-modal-overlay.active .l-modal-container {
    transform: translateY(0) scale(1);
}
.l-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid var(--d);
}
.l-modal-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: var(--r);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
}
.l-modal-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--t3);
    transition: color 0.2s;
    line-height: 1;
    padding: 4px;
}
.l-modal-close:hover {
    color: #111;
}
.l-modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
/* Redesigned Scoreboard Hero */
.l-modal-scoreboard {
    border: 1px solid var(--d);
    border-radius: 12px;
    padding: 20px;
    background: #fbfbf9;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.l-ms-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}
.l-ms-player {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}
.l-ms-player.left {
    text-align: left;
}
.l-ms-player.right {
    text-align: right;
    align-items: flex-end;
}
.l-ms-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: var(--t1);
    letter-spacing: -0.5px;
}
.l-ms-delta {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1.1;
}
.l-ms-delta.green {
    color: var(--g);
}
.l-ms-delta.burgundy {
    color: var(--r);
}
.l-ms-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    display: inline-block;
    width: fit-content;
}
.l-ms-badge.leading {
    background: rgba(16,185,129,0.06);
    border: 1px solid rgba(16,185,129,0.15);
    color: var(--g);
}
.l-ms-badge.trailing {
    background: rgba(92,20,20,0.06);
    border: 1px solid rgba(92,20,20,0.15);
    color: var(--r);
}
.l-ms-vs-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}
.l-ms-vs-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: #ccc;
}
.l-ms-lead-bubble {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px 8px;
    background: #fff;
    border: 1px solid var(--d);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.01);
}
.l-ms-lead-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7px;
    font-weight: 700;
    color: var(--t3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.l-ms-lead-val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 800;
    color: #111;
}

/* Momentum Bar */
.l-ms-momentum-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.l-ms-momentum-names {
    display: flex;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: var(--t3);
}
.l-ms-momentum-bar {
    position: relative;
    height: 6px;
    background: #eee;
    border-radius: 3px;
    overflow: hidden;
    display: flex;
}
.l-ms-momentum-fill {
    height: 100%;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.l-ms-momentum-fill.left {
    background: var(--g);
}
.l-ms-momentum-fill.right {
    background: var(--r);
}
.l-ms-momentum-divider {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #fff;
    transform: translateX(-50%);
    transition: left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.l-ms-momentum-footer {
    display: none;
}

/* Performance Chart */
.l-modal-graph-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.l-mg-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.l-mg-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 700;
    color: var(--t3);
    letter-spacing: 0.5px;
}
.l-mg-live-dot {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 700;
    color: var(--g);
    display: flex;
    align-items: center;
    gap: 4px;
}
.l-modal-graph {
    height: 170px;
    width: 100%;
    border: 1px solid var(--d);
    border-radius: 8px;
    position: relative;
    overflow: visible;
    background: #fff;
    padding: 8px 0;
}

/* Oracle structured Feed */
.l-modal-oracle-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.l-os-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 700;
    color: var(--t3);
    letter-spacing: 0.5px;
}
.l-modal-console-new {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 160px;
    overflow-y: auto;
}
.l-os-card {
    border: 1px solid var(--d);
    border-radius: 8px;
    padding: 10px 12px;
    background: #fbfbf9;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.l-os-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0,0,0,0.03);
    padding-bottom: 4px;
}
.l-os-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: var(--t3);
}
.l-os-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 700;
    color: var(--r);
    text-transform: uppercase;
}
.l-os-status.verified {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 700;
    color: var(--g);
}
.l-os-card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.l-os-competitor {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 11px;
    color: var(--t1);
}
.l-os-metric {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    color: var(--t2);
}
.l-os-metric strong {
    color: var(--t1);
}

/* Summary Strip */
.l-modal-summary-strip {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border: 1px solid var(--d);
    border-radius: 8px;
    padding: 10px 12px;
    background: #fbfbf9;
    align-items: center;
}
.l-ss-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: center;
    text-align: center;
}
.l-ss-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--t3);
    letter-spacing: 0.5px;
}
.l-ss-val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: var(--t1);
}

/* New Taller CTA */
.l-modal-action-btn-new {
    width: 100%;
    background: var(--r);
    color: #fff;
    border: none;
    padding: 14px 20px;
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: center;
}
.l-modal-action-btn-new:hover {
    background: #470d0d;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(92,20,20,0.12);
}

/* Contract Specification Modal Styles */
.l-spec-hero-card {
    border: 1px solid var(--d);
    border-radius: 12px;
    padding: 20px;
    background: #fbfbf9;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.l-spec-platform-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    color: var(--r);
    text-transform: uppercase;
}
.l-spec-tier-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    font-weight: 700;
    color: var(--t2);
    background: rgba(0,0,0,0.03);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.06);
    text-transform: uppercase;
}
.l-spec-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #111;
    letter-spacing: -0.5px;
    margin: 4px 0 0 0;
}
.l-spec-desc {
    font-size: 13px;
    color: var(--t2);
    margin: 4px 0 0 0;
}
.l-spec-params {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid var(--d);
    border-radius: 8px;
    padding: 16px;
    background: #fff;
}
.l-spec-param-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
}
.l-spec-param-row .lbl {
    font-family: 'JetBrains Mono', monospace;
    color: var(--t3);
    font-weight: 700;
    font-size: 8.5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.l-spec-param-row .val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    color: var(--t1);
}
.l-spec-activity-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 700;
    color: var(--g);
    border: 1px solid rgba(16,185,129,0.12);
    background: rgba(16,185,129,0.04);
    padding: 10px 12px;
    border-radius: 8px;
}
.l-spec-activity-bar.urgent {
    color: var(--r);
    border-color: rgba(92,20,20,0.12);
    background: rgba(92,20,20,0.04);
}

/* Premium Background Animation & Grid — Institutional Luxury Architectural Environment */
.lhero-bg-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    background: #FAF8F5;
    opacity: 1;
}
@keyframes envFadeIn {
    to { opacity: 1; }
}
.l-arch-light-shift {
    display: none;
}
@keyframes ambientLightShift {
    0% { opacity: 0.15; transform: translate(-30px, -30px); }
    100% { opacity: 0.65; transform: translate(30px, 30px); }
}
.l-arch-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    pointer-events: none;
}
.panel-left {
    left: 0;
    width: 55%;
}
.panel-right {
    right: 0;
    width: 45%;
    background: transparent !important; /* Matte white overlay removed for universal background */
    transition: transform 0.1s ease-out;
}

/* UNIVERSAL HOMEPAGE BACKGROUND ENFORCEMENT (#FAF8F5) */
.lp, .lhero-v2, .lhero-bg-grid-v2, .l-arch-env, .ltypes-asymmetric, .lengine-section, .lhow-it-works-section, .lemo-reframe, .l-global-stats-bar, .lfaq-section, .lcta-bottom, .lp-footer, section {
    background-color: #FAF8F5 !important;
}
.l-arch-seam {
    position: absolute;
    pointer-events: none;
}
.seam-vertical {
    left: 55%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(0, 0, 0, 0.08); /* 8% opacity machined gap line */
    box-shadow: 1px 0 0 rgba(255, 255, 255, 0.9); /* clean highlight reflection */
}
.seam-horizontal {
    top: 68%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.07); /* 7% opacity horizontal milled gap */
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9); /* clean milled highlight reflection */
}

/* =============================================================================
   VISUAL/LAYOUT CADENCE & HIERARCHY OVERRIDES
   ============================================================================= */

/* Section Labels from Maroon to Muted Neutral Gray */
.lmono {
    color: var(--t3) !important;
    font-size: 11px !important;
}
.lred-dash::before {
    background: var(--d) !important;
    width: 20px !important;
}

/* Page Navigation CTA - Outline/Ghost Style */
.ln-cta {
    background: transparent !important;
    color: var(--t1) !important;
    border: 1px solid var(--d) !important;
    padding: 10px 20px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    letter-spacing: 0.5px !important;
}
.ln-cta:hover {
    background: #fafafa !important;
    border-color: #bbb !important;
    transform: scale(1.02) !important;
}
.ln-cta::after {
    display: none !important;
}

/* Full-bleed Stats Bar — uses smooth gradient transitions now */

/* Asymmetric Left-Aligned Layout for Contract Types */
/* Asymmetric Left-Aligned Layout for Contract Types */
.ltypes-asymmetric {
    display: grid;
    grid-template-columns: 0.42fr 0.58fr;
    gap: 48px;
    padding: 40px 0;
    align-items: center;
}
.ltypes-left {
    position: relative;
    display: flex;
    flex-direction: column;
}
.ltypes-headline {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(2.4rem, 4vw, 3.6rem);
    font-weight: 900;
    line-height: 0.96;
    letter-spacing: -0.025em;
    color: #0F172A;
    margin: 16px 0 0;
    text-align: left;
    text-transform: uppercase;
}
.ltypes-headline .lh-gradient {
    color: #7A1220 !important;
    background: none !important;
    -webkit-background-clip: initial !important;
    -webkit-text-fill-color: initial !important;
    display: inline-block;
}
.ltypes-sub {
    font-size: 15px;
    color: #475569;
    line-height: 1.6;
    margin-top: 16px;
    max-width: 480px;
}
.ltypes-steps {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 22px;
    margin-bottom: 8px;
    max-width: 480px;
}
.ltypes-step-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 13.5px;
    color: #334155;
    font-weight: 500;
    line-height: 1.45;
}
.ltypes-step-num {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #0F172A;
    color: #FFFFFF;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
}
.ltypes-step-text {
    color: #334155;
}
.ltypes-step-text strong {
    color: #0F172A;
    font-weight: 700;
}
.ltypes-cta-wrap {
    margin-top: 28px;
}
.ltypes-right {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    justify-content: center;
}

/* ═══ IMAGE-ONLY MODE CAROUSEL ═══ */
.mode-image-carousel {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
}

/* SYNCHRONIZED MODE PILL BADGES */
.mode-badge-wrap {
    position: relative;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.mode-badge-pill {
    position: absolute;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease, transform 0.5s ease, visibility 0.5s ease;
    transform: translateY(4px);
    white-space: nowrap;
}
.mode-badge-pill.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}
.mode-badge-pill.is-solo {
    background: #F1F5F9;
    color: #0F172A;
    border: 1px solid #CBD5E1;
}
.mode-badge-pill.is-rivalry {
    background: #5C1414;
    color: #FFFFFF;
    border: 1px solid #7A1220;
    box-shadow: 0 4px 12px rgba(92, 20, 20, 0.2);
}
.mode-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #0F172A;
}
.mode-badge-dot.secondary {
    background: #EF4444;
    box-shadow: 0 0 6px #EF4444;
}
.mode-carousel-viewport {
    position: relative;
    width: 100%;
    max-width: 420px;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 16px;
}
.mode-carousel-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
}
.mode-carousel-slide.active {
    opacity: 1;
    visibility: visible;
}
.mode-carousel-slide picture,
.mode-carousel-slide img {
    width: 100%;
    height: 100%;
    max-width: 420px;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    display: block;
}
.mode-carousel-slide#mode-slide-1 img {
    border-radius: 16px;
}

.mode-carousel-dots {
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
}
.mode-carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #CBD5E1;
    cursor: pointer;
    transition: all 0.3s ease;
}
.mode-carousel-dot.active {
    width: 24px;
    border-radius: 4px;
    background: #0F172A;
}


.ltype-row {
    position: relative;
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px;
    padding: 28px 32px !important;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.ltype-row.is-solo {
    border-left: 4px solid #64748B !important;
}
.ltype-row.is-solo:hover {
    border-left-color: #0F172A !important;
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 28px -6px rgba(20, 18, 31, 0.06);
}
.ltype-row.is-rivalry {
    border-left: 4px solid #7A1220 !important;
}
.ltype-row.is-rivalry:hover {
    border-left-color: #5C1414 !important;
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 28px -6px rgba(20, 18, 31, 0.06);
}
.ltype-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}
.ltype-badge-new {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px !important;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: inline-block;
    background: #F1F5F9;
    color: #475569;
    padding: 4px 10px;
    border-radius: 4px;
}
.ltype-badge-new.secondary {
    background: rgba(122, 18, 32, 0.06);
    color: #7A1220;
}
.ltype-stat-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: #64748B;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    padding: 3px 8px;
    border-radius: 4px;
}
.ltype-stat-pill.secondary {
    color: #7A1220 !important;
    background: rgba(122, 18, 32, 0.06) !important;
    border-color: rgba(122, 18, 32, 0.18) !important;
}
.ltype-title-new {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 20px !important;
    font-weight: 800 !important;
    letter-spacing: -0.4px;
    margin: 0 0 8px 0;
    color: #0F172A !important;
}
.ltype-desc-new {
    font-size: 14px !important;
    color: #475569 !important;
    line-height: 1.55 !important;
    margin: 0 0 16px 0;
}
.ltype-stat-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    padding: 10px 0;
    border-top: 1px dashed #E2E8F0;
    border-bottom: 1px dashed #E2E8F0;
    margin-bottom: 16px;
}
.ltype-stat-k {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.ltype-stat-v {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 800;
    color: #0F172A;
}
.ltype-meta-new {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}
.lmeta-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px !important;
    font-weight: 700;
    color: #64748B !important;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-right: 4px;
}
.lmeta-tag {
    font-family: 'Inter', sans-serif;
    font-size: 11px !important;
    font-weight: 500;
    color: #475569 !important;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    padding: 3px 9px;
    border-radius: 4px;
    transition: all 0.2s ease;
}
.ltype-row:hover .lmeta-tag {
    border-color: rgba(92, 20, 20, 0.15);
    color: var(--t1);
    box-shadow: 0 2px 8px rgba(92, 20, 20, 0.02);
}

/* Horizontal Connected-Timeline for How It Works */
.lhow-timeline-wrap {
    position: relative;
    margin-top: 64px;
    padding: 20px 0;
}
.lhow-timeline-line {
    position: absolute;
    top: 36px;
    left: 8%;
    right: 8%;
    height: 2px;
    background: var(--d);
    z-index: 1;
}
.lhow-timeline-steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    position: relative;
    z-index: 2;
}
.lhow-timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
.lhow-timeline-node {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #FFF;
    border: 2px solid var(--d);
    color: var(--t3);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 0 0 6px #FFF;
}
.lhow-timeline-step:hover .lhow-timeline-node {
    border-color: var(--r);
    color: var(--r);
    transform: scale(1.1);
}
.lhow-timeline-node.final {
    border-color: var(--r);
    color: var(--r);
    background: rgba(92,20,20,0.02);
}
.lhow-timeline-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--t1);
    letter-spacing: -0.3px;
    margin: 0 0 12px 0;
}
.lhow-timeline-desc {
    font-size: 13px;
    color: var(--t2);
    line-height: 1.5;
    margin: 0;
    max-width: 200px;
}

/* Borderless separated statistics for Real Results */
.lstats-grid-borderless {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: stretch;
    margin-bottom: 40px;
    margin-top: 32px;
    border-top: 1px solid var(--d);
    border-bottom: 1px solid var(--d);
    padding: 32px 0;
}
.lstat-item-borderless {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 12px 24px;
    border-right: 1px solid rgba(17, 17, 17, 0.08);
}
.lstat-item-borderless:last-child {
    border-right: none;
}
.lstat-item-borderless .lstat-num {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: var(--r);
    letter-spacing: -1px;
    line-height: 1;
}
.lstat-item-borderless .lstat-label {
    font-family: 'Inter Tight', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--t1);
    margin: 10px 0 4px;
}
.lstat-item-borderless .lstat-sub {
    font-size: 11.5px;
    color: #64748B;
    line-height: 1.45;
    max-width: 220px;
    margin: 6px auto 0;
    text-wrap: balance;
    text-align: center;
}

/* Responsive collapse rules */
@media(max-width: 768px) {
    .ltypes-asymmetric {
        grid-template-columns: 1fr;
        gap: 40px;
        padding: 60px 0;
    }
    .ltypes-left {
        position: static;
    }
    .lhow-timeline-line {
        display: none;
    }
    .lhow-timeline-steps {
        grid-template-columns: 1fr;
        gap: 32px;
    }
    .lhow-timeline-step {
        align-items: flex-start;
        text-align: left;
        padding-left: 48px;
        position: relative;
    }
    .lhow-timeline-node {
        position: absolute;
        left: 0;
        top: 0;
        margin-bottom: 0;
        box-shadow: none;
    }
    .lhow-timeline-desc {
        max-width: none;
    }
    .lstats-grid-borderless {
        grid-template-columns: 1fr;
        gap: 32px;
        padding: 32px 0;
    }
    .lstat-item-borderless {
        border-right: none;
        border-bottom: 1px solid rgba(17, 17, 17, 0.08);
        padding: 16px 0 32px;
    }
    .lstat-item-borderless:last-child {
        border-bottom: none;
        padding-bottom: 16px;
    }
}

/* Production Compressed Ledger Styles (Option B) */
.lledger-container-prod {
    background: #FFF;
    border: 1px solid var(--d);
    border-radius: 16px;
    padding: 32px 32px 24px 32px; /* reduced bottom padding */
    box-shadow: 0 4px 24px rgba(0,0,0,0.015);
    margin-top: 24px; /* tightened gap to visual connector label */
    width: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
}
.lledger-header-prod {
    border-bottom: 1px solid var(--d);
    padding-bottom: 16px;
    margin-bottom: 16px;
}
.lledger-h-title-prod {
    font-family: 'Inter Tight', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: var(--t1);
    letter-spacing: -0.3px;
    margin: 0 0 6px 0;
}
.lledger-h-desc-prod {
    font-size: 13px;
    color: var(--t3);
    font-weight: 500;
}
.lledger-table-wrap-prod {
    width: 100%;
    overflow-x: auto;
}
.lledger-table-prod {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 13px;
}
.lledger-table-prod th {
    padding: 12px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--t3);
    border-bottom: 1px solid var(--d);
    box-sizing: border-box;
    text-align: left;
}
.lledger-table-prod tbody tr {
    transition: background-color 0.2s ease;
}
.lledger-table-prod tbody tr:hover {
    background-color: rgba(245, 245, 240, 0.65);
}
.lledger-table-prod td {
    padding: 14px 18px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    vertical-align: middle;
    color: var(--t2);
    box-sizing: border-box;
}
.lledger-table-prod tr:last-child td {
    border-bottom: none;
}
.lledger-table-prod .td-id {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: #0F172A;
    font-size: 13px;
}
.lledger-table-prod .td-user {
    color: #64748B;
    font-size: 11.5px;
    font-weight: 500;
    margin-left: 6px;
    font-family: 'Inter', sans-serif;
}
.lledger-table-prod .td-metric {
    font-weight: 600;
    color: #0F172A;
}
.lledger-table-prod .td-capital {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    color: #0F172A;
}
.lledger-table-prod .td-outcome {
    vertical-align: middle;
}
.td-icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    vertical-align: middle;
}
.td-brand-svg {
    height: 16px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    display: block;
}
.lstatus-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 9999px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
}
.lstatus-badge .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
}
/* Active - soft neutral/blue */
.lstatus-badge.status-active {
    background: #EFF6FF;
    color: #1E40AF;
    border: 1px solid #DBEAFE;
}
.lstatus-badge.status-active .status-dot {
    background: #3B82F6;
}
/* Settled - soft maroon (brand) */
.lstatus-badge.status-settled {
    background: #FDF2F2;
    color: #7A1220;
    border: 1px solid rgba(122, 18, 32, 0.2);
}
.lstatus-badge.status-settled .status-dot {
    background: #7A1220;
}
/* Won - soft green */
.lstatus-badge.status-won {
    background: #F0FDF4;
    color: #166534;
    border: 1px solid #BBF7D0;
}
.lstatus-badge.status-won .status-dot {
    background: #22C55E;
}
.lledger-footer-prod {
    border-top: 1px solid var(--d);
    padding-top: 16px;
    margin-top: 16px;
    text-align: center;
}
.lledger-more-link-prod {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--t3);
    text-decoration: none;
    transition: color 0.2s ease;
}
.lledger-more-link-prod:hover {
    color: var(--r);
}

/* Fused connecting element: stats -> ledger */
.lledger-connector-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin: 32px auto -12px auto; /* visual bridge */
    position: relative;
    z-index: 2;
    max-width: 400px;
}
.lledger-connector-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, rgba(0,0,0,0) 0%, var(--d) 50%, rgba(0,0,0,0) 100%);
}
.lledger-connector-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--t3);
    background: var(--bg);
    padding: 2px 8px;
    border-radius: 4px;
}

.td-value {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

/* Responsive Table Collapse to Cards on Mobile */
@media(max-width: 768px) {
    .lledger-container-prod {
        padding: 16px 14px !important;
        margin-top: 16px !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        border-radius: 12px !important;
    }
    .lledger-header-prod {
        padding-bottom: 12px !important;
        margin-bottom: 12px !important;
    }
    .lledger-table-wrap-prod {
        overflow-x: hidden !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    .lledger-table-prod {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    .lledger-table-prod thead {
        display: none !important;
    }
    .lledger-table-prod tbody {
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    .lledger-table-prod tr {
        display: flex !important;
        flex-direction: column !important;
        background: #FFF !important;
        border: 1px solid var(--d) !important;
        border-radius: 10px !important;
        margin-bottom: 0 !important;
        padding: 10px 12px !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02) !important;
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
        overflow: hidden !important;
    }
    .lledger-table-prod td {
        border-bottom: 1px solid rgba(0,0,0,0.04) !important;
        padding: 8px 0 !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        text-align: right !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        background: transparent !important;
        min-width: 0 !important;
        overflow: hidden !important;
    }
    .lledger-table-prod td:last-child {
        border-bottom: none !important;
        padding-bottom: 0 !important;
    }
    .lledger-table-prod td:first-child {
        padding-top: 0 !important;
    }
    .lledger-table-prod td::before {
        content: attr(data-label);
        font-family: 'JetBrains Mono', monospace !important;
        font-size: 10px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        color: var(--t3) !important;
        text-align: left !important;
        flex-shrink: 0 !important;
        margin-right: 8px !important;
    }
    .lledger-table-prod .td-value {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 4px !important;
        text-align: right !important;
        margin-left: auto !important;
        font-size: 12px !important;
        color: var(--t1) !important;
        min-width: 0 !important;
        max-width: 70% !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }
    .lledger-table-prod .td-metric {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
    }
    .lledger-table-prod .td-metric .td-value {
        display: inline-flex !important;
        align-items: center !important;
    }
    .lledger-table-prod .td-user {
        font-size: 11px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }
}

/* ═══════════════════════════════════════════════════════════════ */
/* MASTER MOBILE RESPONSIVE ENGINE (320px - 768px Viewports)        */
/* Enforces 100% Symmetrical, High-Precision Alignment & Scaling    */
/* ═══════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  /* Prevent Any Horizontal Overflow Page-Wide */
  html, body, .lp, .lmain {
    overflow-x: hidden !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  /* Global Container Side Padding */
  .lw {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 20px !important;
    box-sizing: border-box !important;
  }

  /* Promo Bar & Fixed Header Placement */
  .lpromo-bar {
    height: 32px !important;
    line-height: 32px !important;
    font-size: 10px !important;
    font-weight: 700 !important;
    letter-spacing: 1px !important;
    padding: 0 12px !important;
  }
  .ln {
    top: 32px !important;
    height: 60px !important;
  }
  .ln-in {
    height: 60px !important;
    padding: 0 16px !important;
  }

  /* Hero Section Mobile Layout */
  .lhero-section {
    padding-top: 108px !important;
    padding-bottom: 32px !important;
    overflow: hidden !important;
  }
  .lhero-grid {
    grid-template-columns: 1fr !important;
    gap: 28px !important;
    padding: 0 !important;
  }
  .lhero-left {
    width: 100% !important;
    text-align: left !important;
  }
  .lhero-eyebrow {
    font-size: 10px !important;
    font-weight: 700 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    color: var(--t3) !important;
    margin: 0 0 14px 0 !important;
    border-left: 2px solid var(--r) !important;
    padding-left: 10px !important;
    display: inline-block !important;
  }
  .lh1 {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: clamp(28px, 7.8vw, 42px) !important;
    line-height: 1.08 !important;
    letter-spacing: -1.2px !important;
    color: var(--t1) !important;
    margin: 0 0 16px 0 !important;
    text-transform: uppercase !important;
    word-break: break-word !important;
  }
  .lsub {
    font-size: 14.5px !important;
    line-height: 1.55 !important;
    color: var(--t2) !important;
    margin-bottom: 22px !important;
    max-width: 100% !important;
  }

  /* CTAs & Button Stacking */
  .lctas {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    width: 100% !important;
    margin-bottom: 12px !important;
  }
  .lbtn, .lbtn-r, #lp-hero-cta {
    width: 100% !important;
    height: 50px !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    letter-spacing: 1px !important;
    justify-content: center !important;
    text-align: center !important;
    border-radius: 8px !important;
    box-sizing: border-box !important;
  }
  .lhero-textlink, #lp-see-contracts-cta {
    width: 100% !important;
    height: 46px !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    letter-spacing: 0.8px !important;
    justify-content: center !important;
    text-align: center !important;
    background: transparent !important;
    border: 1px solid var(--d) !important;
    border-radius: 8px !important;
    color: var(--t1) !important;
    box-sizing: border-box !important;
  }
  .lcta-match {
    font-size: 11px !important;
    color: var(--t3) !important;
    margin: 6px 0 0 0 !important;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
  }

  /* Mobile Live Rivalry Ticker */
  .l-live-rivalry-preview {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    width: 100% !important;
    padding: 12px 14px !important;
    margin-top: 18px !important;
    border-radius: 10px !important;
    background: #FFFFFF !important;
    border: 1px solid var(--d) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
    box-sizing: border-box !important;
  }
  .l-lr-hdr {
    font-size: 9px !important;
    letter-spacing: 1px !important;
  }
  .l-lr-ticker {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px 12px !important;
    font-size: 11px !important;
    justify-content: space-between !important;
    align-items: center !important;
  }

  /* Hero Centerpiece Card */
  .lhero-right {
    display: flex !important;
    width: 100% !important;
    margin-top: 24px !important;
    justify-content: center !important;
    align-items: center !important;
  }
  .lactivity-card {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    padding: 18px 16px !important;
    gap: 14px !important;
    border-radius: 16px !important;
    border: 1px solid rgba(0, 0, 0, 0.08) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important;
  }

  /* Open Contracts Section & Horizontal Swipe Cards */
  .lcontracts {
    padding: 40px 0 44px !important;
  }
  .lh-section-title {
    font-size: clamp(22px, 6.5vw, 30px) !important;
    line-height: 1.18 !important;
    letter-spacing: -0.8px !important;
    margin-bottom: 10px !important;
    text-align: center !important;
  }
  .lh-section-subtitle {
    font-size: 13.5px !important;
    line-height: 1.5 !important;
    color: var(--t2) !important;
    margin: 0 auto 24px auto !important;
    max-width: 100% !important;
    text-align: center !important;
  }
  .lred-dash {
    justify-content: center !important;
    margin-bottom: 10px !important;
  }

  .lcards {
    display: flex !important;
    overflow-x: auto !important;
    scroll-snap-type: x mandatory !important;
    -webkit-overflow-scrolling: touch !important;
    gap: 14px !important;
    padding: 4px 20px 20px 20px !important;
    margin: 0 -20px !important;
    scrollbar-width: none !important;
  }
  .lcards::-webkit-scrollbar {
    display: none !important;
  }
  .lcard {
    flex: 0 0 280px !important;
    width: 280px !important;
    max-width: 82vw !important;
    scroll-snap-align: start !important;
    border-radius: 14px !important;
    padding: 20px 18px !important;
    box-sizing: border-box !important;
  }

  /* Money Flow Schematic / How It Works */
  .lhow {
    padding: 44px 0 !important;
  }
  .lfan-grid, .l-schematic-grid {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
  }
  .lstep {
    padding: 20px 16px !important;
    border-radius: 12px !important;
  }

  /* Real Results / Protocol Metrics */
  .lreal-results {
    padding: 40px 0 !important;
  }
  .lstats-cards-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
    margin-bottom: 28px !important;
  }

  /* Why It Works / Emotional Reframe */
  .lhow-it-works-section {
    padding: 44px 0 !important;
  }
  .lhow-layout {
    grid-template-columns: 1fr !important;
    gap: 28px !important;
    margin-top: 20px !important;
  }
  .lhow-title {
    font-size: clamp(22px, 6vw, 30px) !important;
    line-height: 1.2 !important;
    letter-spacing: -0.8px !important;
    text-align: left !important;
    margin-bottom: 14px !important;
  }
  .lhow-flow {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
  }

  /* CLTR Token Economy Section */
  .lemo-reframe {
    padding: 44px 0 !important;
  }
  .lemo-grid {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
    margin-top: 20px !important;
  }

  /* FAQ Section */
  .lfaq {
    padding: 44px 0 !important;
  }
  .fq-q {
    font-size: 14px !important;
    padding: 14px 0 !important;
  }

  /* Footer */
  .lfoot {
    padding: 36px 20px 48px !important;
    text-align: center !important;
  }

  /* Drawer Menu Width */
  .pnl-drawer {
    width: 100% !important;
    max-width: 100% !important;
    border-left: none !important;
  }
}

/* ═══ FLAGSHIP DOMINANT INTERACTIVE CONTRACT INSTRUMENT ═══ */
.lterm-centerpiece-wrapper {
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
}

/* Integrated Mode Selector Bar */
.lterm-integrated-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 28px;
}

.lterm-select-card {
    background: #FFFFFF;
    border: 1.5px solid #E2E8F0;
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
}

.lterm-select-card:hover {
    border-color: #CBD5E1;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.lterm-select-card.active {
    background: #FFFFFF !important;
    border: 2px solid #0F172A !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08), 0 12px 32px rgba(15, 23, 42, 0.06) !important;
}

.lterm-select-card.active#card-mode-rivalry {
    border-color: #7A1220 !important;
    box-shadow: 0 4px 20px rgba(122, 18, 32, 0.08), 0 12px 32px rgba(15, 23, 42, 0.06) !important;
}

.lselect-left {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.lselect-badge {
    align-self: flex-start;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
}

.lselect-badge.solo { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
.lselect-badge.rivalry { background: #FDF2F2; color: #991B1B; border: 1px solid #FECDD3; }

.lselect-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 17px;
    font-weight: 800;
    color: #0F172A;
    margin-top: 2px;
    letter-spacing: -0.3px;
}

.lselect-sub {
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    color: #64748B;
    font-weight: 500;
}

.lselect-stat-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    color: #166534;
    background: #DCFCE7;
    border: 1px solid #BBF7D0;
    padding: 5px 12px;
    border-radius: 100px;
    white-space: nowrap;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.lselect-stat-badge.rivalry {
    color: #991B1B;
    background: #FEE2E2;
    border: 1px solid #FECDD3;
}

@media (max-width: 768px) {
    .lterm-integrated-selector {
        grid-template-columns: 1fr;
        gap: 12px;
    }
}

/* ═══ PREMIUM FINANCIAL CONTRACT INSTRUMENT PANEL ═══ */
.lproto-term-window {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 20px 50px -10px rgba(15, 23, 42, 0.08);
    overflow: hidden;
    color: #0F172A;
    font-family: 'Inter', sans-serif;
    position: relative;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.lterm-bar {
    background: #FAFAFA;
    padding: 14px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #F1F5F9;
}

.lterm-dots {
    display: flex;
    align-items: center;
    gap: 7px;
}

.lterm-dots .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
.lterm-dots .dot.red { background: #EF4444; }
.lterm-dots .dot.yellow { background: #F59E0B; }
.lterm-dots .dot.green { background: #10B981; }

.lterm-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #475569;
    text-transform: uppercase;
}

.lterm-status-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 4px 11px;
    border-radius: 100px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
}

.lterm-status-badge.live { background: #FDF2F2; color: #7A1220; border: 1px solid #FECDD3; }
.lterm-status-badge.rivalry { background: #FDF2F2; color: #7A1220; border: 1px solid #FECDD3; }

.pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #991B1B;
    box-shadow: 0 0 8px rgba(153, 27, 27, 0.6);
    animation: termDotPulse 2s ease-in-out infinite;
}

@keyframes termDotPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.5; }
}

.lterm-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #FFFFFF;
}

.lterm-hero-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #F8FAFC;
    border: 1px solid #F1F5F9;
    border-radius: 14px;
    padding: 18px 22px;
}

.lterm-metric-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.lterm-metric-box.right { text-align: right; }

.lterm-metric-box .lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: #64748B;
    text-transform: uppercase;
}

.lterm-metric-box .val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.4px;
}
.lterm-metric-box .val.green { color: #7A1220; }

/* Grid Metrics */
.lterm-grid-metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
}

@media (max-width: 768px) {
    .lterm-grid-metrics {
        grid-template-columns: 1fr 1fr;
    }
}

.lterm-m {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.lterm-m .k {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.lterm-m .v {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 800;
    color: #0F172A;
}
.lterm-m .v.green { color: #16A34A; }

/* View Container Animation */
.lterm-view-anim {
    animation: modeViewFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modeViewFadeIn {
    0% { opacity: 0; transform: translateY(8px) scale(0.99); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}

.live-radar-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #166534;
    vertical-align: middle;
    margin-right: 5px;
    box-shadow: 0 0 0 0 rgba(22, 101, 52, 0.4);
    animation: liveRadarPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.live-radar-dot.burgundy {
    background: #7A1220;
    box-shadow: 0 0 0 0 rgba(122, 18, 32, 0.4);
    animation: liveRadarPulseBurgundy 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes liveRadarPulse {
    0% { box-shadow: 0 0 0 0 rgba(22, 101, 52, 0.5); }
    70% { box-shadow: 0 0 0 6px rgba(22, 101, 52, 0); }
    100% { box-shadow: 0 0 0 0 rgba(22, 101, 52, 0); }
}

@keyframes liveRadarPulseBurgundy {
    0% { box-shadow: 0 0 0 0 rgba(122, 18, 32, 0.5); }
    70% { box-shadow: 0 0 0 6px rgba(122, 18, 32, 0); }
    100% { box-shadow: 0 0 0 0 rgba(122, 18, 32, 0); }
}

.escrow-lock-icon {
    display: inline-block;
    margin-right: 4px;
    font-size: 13px;
    animation: lockFloat 3s ease-in-out infinite;
}

@keyframes lockFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
}

/* Progress Tracks Stack */
.lterm-tracks-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #F8FAFC;
    border: 1px solid #F1F5F9;
    border-radius: 14px;
    padding: 20px;
}

.lterm-track-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.lterm-track-hdr {
    display: flex;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    color: #475569;
}
.lterm-track-hdr .pct { color: #991B1B; font-weight: 800; display: flex; align-items: center; }
.lterm-track-hdr .pct.completed { color: #166534; }

.lterm-progress-track {
    height: 10px;
    background: #E2E8F0;
    border-radius: 100px;
    overflow: hidden;
    position: relative;
}

.lterm-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #7A1220, #991B1B);
    box-shadow: 0 0 10px rgba(153, 27, 27, 0.25);
    border-radius: 100px;
    position: relative;
    transition: width 0.8s ease-in-out;
}

.lterm-progress-fill.completed {
    background: linear-gradient(90deg, #16A34A, #22C55E);
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.25);
}

.lterm-progress-glow {
    position: absolute;
    top: 0; bottom: 0;
    width: 40px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0) 100%);
    animation: trackShimmerTravel 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes trackShimmerTravel {
    0% { left: -40px; }
    100% { left: 100%; }
}

/* Rules Box */
.lterm-rules-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

@media (max-width: 640px) {
    .lterm-rules-box {
        grid-template-columns: 1fr;
    }
}

.lterm-rule {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    line-height: 1.35;
}

.lterm-rule.pass {
    background: #F0FDF4;
    border: 1px solid #BBF7D0;
    color: #166534;
}
.lterm-rule.pass .ic { color: #166534; font-weight: 800; font-size: 14px; }

.lterm-rule.fail {
    background: #FDF2F2;
    border: 1px solid #FECDD3;
    color: #991B1B;
}
.lterm-rule.fail .ic { color: #991B1B; font-weight: 800; font-size: 14px; }

/* Rivalry Matchup Layout */
.lterm-matchup-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
}

.lterm-player-card {
    background: #FAF9F7;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.lterm-player-card.opponent { text-align: right; }

.lterm-player-card .tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.2px;
    color: #64748B;
}

.lterm-player-card .handle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: #0F172A;
}

.lterm-player-card .metric {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #166534;
}
.lterm-player-card.opponent .metric { color: #7A1220; }

.lterm-player-card .stake {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: #64748B;
}

.lterm-vs-battle-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lterm-vs-badge {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #FDF2F2;
    border: 1.5px solid rgba(122, 18, 32, 0.35);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(122, 18, 32, 0.12);
    position: relative;
    z-index: 2;
    gap: 1px;
}

.battle-swords {
    font-size: 15px;
    line-height: 1;
    display: inline-block;
    animation: swordClash 2.4s ease-in-out infinite;
}

.battle-vs {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 800;
    color: #7A1220;
    letter-spacing: 0.5px;
    line-height: 1;
}

.battle-pulse-ring {
    position: absolute;
    top: 50%; left: 50%;
    width: 48px; height: 48px;
    margin-top: -24px; margin-left: -24px;
    border-radius: 50%;
    border: 1px solid rgba(122, 18, 32, 0.4);
    animation: battleRingPulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    pointer-events: none;
    z-index: 1;
}

@keyframes swordClash {
    0%, 100% { transform: scale(1) rotate(0deg); }
    20% { transform: scale(1.25) rotate(-12deg); }
    40% { transform: scale(1.15) rotate(12deg); }
    60% { transform: scale(1.2) rotate(-6deg); }
    80% { transform: scale(1.05) rotate(0deg); }
}

@keyframes battleRingPulse {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.7); opacity: 0; }
}

.lterm-vault-core {
    background: linear-gradient(180deg, #FFFDFA 0%, #FDF9F7 100%);
    border: 1.5px solid rgba(122, 18, 32, 0.3);
    border-radius: 18px;
    padding: 22px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
    box-shadow: 0 8px 32px rgba(122, 18, 32, 0.06);
}

.lterm-vault-core .v-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.4px;
    color: #7A1220;
    text-transform: uppercase;
}

.lterm-vault-core .v-val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 36px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #7A1220;
}

.lterm-vault-core .v-sub {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: #475569;
}

.lterm-telemetry {
    background: #FAF9F7;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 16px 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.lterm-telemetry .t-line { color: #475569; }
.lterm-telemetry .t-line .ts { color: #94A3B8; margin-right: 8px; }
.lterm-telemetry .t-line.green { color: #166534; font-weight: 700; }

/* ═══ FLAGSHIP MARKETING PROTOCOL ILLUSTRATION ═══ */
.proto-diagram-wrapper {
    position: relative;
    width: 100%;
    max-width: 580px;
    height: 380px;
    background: linear-gradient(180deg, #FAFAF7 0%, #F5F5F0 100%);
    border: 1px solid rgba(226, 232, 240, 0.9);
    border-radius: 24px;
    box-shadow: 0 24px 54px -12px rgba(15, 23, 42, 0.08);
    overflow: hidden;
    box-sizing: border-box;
}

.proto-ambient-glow {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 200px;
    background: radial-gradient(circle, rgba(122, 18, 32, 0.07) 0%, rgba(122, 18, 32, 0) 70%);
    pointer-events: none;
    z-index: 1;
}

.proto-svg-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
}

.proto-nodes-canvas {
    position: absolute;
    inset: 0;
    z-index: 3;
}

/* Side Competitor Cards */
.proto-mini-card {
    position: absolute;
    background: #FFFFFF;
    border: 1px solid rgba(226, 232, 240, 0.95);
    border-radius: 14px;
    padding: 14px 15px;
    width: 155px;
    box-shadow: 0 8px 24px -6px rgba(15, 23, 42, 0.05);
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-sizing: border-box;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.proto-mini-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.08);
}

.proto-mini-card.challenger {
    left: 20px;
    top: 90px;
}

.proto-mini-card.opponent {
    right: 20px;
    top: 90px;
}

.mini-card-hdr {
    display: flex;
    align-items: center;
    gap: 6px;
}

.mini-brand-svg {
    width: 14px;
    height: 14px;
    object-fit: contain;
}

.mini-role-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 800;
    color: #64748B;
    letter-spacing: 0.8px;
    text-transform: uppercase;
}

.mini-metric-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
}

.mini-metric {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
}

.mini-badge-green {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    color: #166534;
}

.mini-badge-blue {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    color: #1D4ED8;
}

/* Micro progress bar */
.mini-progress-bar {
    width: 100%;
    height: 5px;
    background: #F1F5F9;
    border-radius: 9999px;
    overflow: hidden;
}

.mini-progress-fill.green {
    height: 100%;
    background: #22C55E;
    border-radius: 9999px;
}

.mini-progress-fill.blue {
    height: 100%;
    background: #3B82F6;
    border-radius: 9999px;
}

.mini-lock-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 800;
    color: #7A1220;
    letter-spacing: 0.4px;
}

/* DOMINANT ESCROW VAULT (Middle Box Dominates) */
.proto-vault-anchor.dominant {
    position: absolute;
    top: 75px;
    left: 50%;
    transform: translateX(-50%);
    background: #FFFFFF;
    border: 2px solid rgba(122, 18, 32, 0.4);
    border-radius: 20px;
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    box-shadow: 0 16px 44px -8px rgba(122, 18, 32, 0.18), 0 4px 12px rgba(15, 23, 42, 0.04);
    z-index: 10;
    width: 200px;
    box-sizing: border-box;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.proto-vault-anchor.dominant:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 20px 50px -6px rgba(122, 18, 32, 0.22);
}

.vault-verified-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 800;
    color: #7A1220;
    background: rgba(122, 18, 32, 0.06);
    border: 1px solid rgba(122, 18, 32, 0.15);
    padding: 3px 10px;
    border-radius: 9999px;
    letter-spacing: 0.5px;
}

.vault-main-amount {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 26px;
    font-weight: 900;
    color: #7A1220;
    letter-spacing: -0.6px;
    line-height: 1;
    margin: 2px 0;
}

.vault-main-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: 1px;
}

.vault-tag-maroon {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 800;
    color: #166534;
    background: #F0FDF4;
    padding: 2px 8px;
    border-radius: 9999px;
    border: 1px solid #BBF7D0;
}

/* Verification Layer Row */
.proto-verification-layer {
    position: absolute;
    top: 220px;
    left: 50%;
    transform: translateX(-50%);
    background: #FFFFFF;
    border: 1px solid rgba(226, 232, 240, 0.9);
    border-radius: 9999px;
    padding: 6px 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
    white-space: nowrap;
    z-index: 4;
}

.verif-item {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 700;
    color: #64748B;
}

.verif-item.highlight {
    color: #7A1220;
    font-weight: 800;
}

.verif-sep {
    color: #CBD5E1;
    font-size: 10px;
}

/* Bottom Node: AUTOMATED SETTLEMENT ENDPOINT */
.proto-settlement-endpoint {
    position: absolute;
    bottom: 22px;
    left: 50%;
    transform: translateX(-50%);
    background: #FFFFFF;
    border: 1.5px solid rgba(34, 197, 94, 0.45);
    border-radius: 9999px;
    padding: 9px 20px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.12);
    white-space: nowrap;
    z-index: 4;
}

.settle-check {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #22C55E;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

.settle-text {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: #0F172A;
}

/* Reduced Motion Override */
@media (prefers-reduced-motion: reduce) {
    .proto-pulse-circle {
        display: none !important;
    }
}

/* Mobile Vertical Reflow (below 640px) */
@media(max-width: 640px) {
    .proto-diagram-wrapper {
        height: auto;
        min-height: 480px;
        padding: 20px 16px;
    }
    .proto-svg-canvas, .proto-ambient-glow {
        display: none;
    }
    .proto-nodes-canvas {
        position: relative;
        inset: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
    }
    .proto-mini-card {
        position: relative;
        left: auto !important;
        right: auto !important;
        top: auto !important;
        width: 100%;
        max-width: 280px;
    }
    .proto-vault-anchor.dominant {
        position: relative;
        top: auto !important;
        left: auto !important;
        transform: none !important;
        width: 100%;
        max-width: 280px;
    }
    .proto-verification-layer {
        position: relative;
        top: auto !important;
        left: auto !important;
        transform: none !important;
        width: 100%;
        max-width: 280px;
        justify-content: center;
    }
    .proto-settlement-endpoint {
        position: relative;
        bottom: auto !important;
        left: auto !important;
        transform: none !important;
        width: 100%;
        max-width: 280px;
        justify-content: center;
        border-radius: 12px;
    }
}

/* ═══ CLTR PROTOCOL TOKEN FLYWHEEL ═══ */
.cltr-flywheel-container {
    width: 100%;
    margin-top: 24px;
    background: #FAFAF7;
    border: 1px solid rgba(226, 232, 240, 0.85);
    border-radius: 18px;
    padding: 28px 20px;
    box-shadow: 0 12px 32px -10px rgba(15, 23, 42, 0.05);
}

.cltr-flywheel-grid {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.flywheel-step-card {
    background: #FFFFFF;
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 14px;
    padding: 16px 14px;
    flex: 1;
    min-width: 120px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
}

.flywheel-step-card:hover {
    transform: translateY(-3px);
    border-color: rgba(122, 18, 32, 0.3);
}

.flywheel-step-card.highlight {
    background: #FDF2F2;
    border-color: rgba(122, 18, 32, 0.3);
}

.flywheel-step-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 800;
    color: #7A1220;
}

.flywheel-step-title {
    font-family: 'Inter Tight', sans-serif;
    font-size: 12.5px;
    font-weight: 700;
    color: #0F172A;
}

.flywheel-step-desc {
    font-size: 11px;
    color: #64748B;
    line-height: 1.35;
}

.flywheel-arrow {
    font-size: 16px;
    color: #94A3B8;
    font-weight: bold;
}

@media(max-width: 768px) {
    .cltr-flywheel-grid {
        flex-direction: column;
        align-items: stretch;
    }
    .flywheel-arrow {
        text-align: center;
        transform: rotate(90deg);
        margin: 4px 0;
    }
}

/* ═══ SLEEK LINEAR-STYLE SEGMENTED TAB CONTROL ═══ */
.lseg-control-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #F1F5F9;
    padding: 6px;
    border-radius: 100px;
    max-width: 580px;
    margin: 0 auto 32px;
    border: 1px solid #E2E8F0;
}
.lseg-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    user-select: none;
}
.lseg-tab:hover {
    background: rgba(255, 255, 255, 0.6);
}
.lseg-tab.active {
    background: #FFFFFF !important;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04) !important;
}
.lseg-tab-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 800;
    color: #475569;
    letter-spacing: 0.2px;
}
.lseg-tab.active .lseg-tab-title {
    color: #0F172A;
}
.lseg-tab-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 100px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}
.lseg-tab-badge.green { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
.lseg-tab-badge.rose { background: #FEE2E2; color: #991B1B; border: 1px solid #FECDD3; }

/* ═══ DARK OBSIDIAN EXECUTION CONSOLE ═══ */
.lobsidian-console {
    max-width: 960px;
    margin: 0 auto;
    background: #090D16;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
    color: #F8FAFC;
    font-family: 'Inter', sans-serif;
}
.lobsidian-bar {
    background: #111827;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 14px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.lobsidian-dots {
    display: flex;
    align-items: center;
    gap: 7px;
}
.lobsidian-dots .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
.lobsidian-dots .dot.red { background: #FF5F56; }
.lobsidian-dots .dot.yellow { background: #FFBD2E; }
.lobsidian-dots .dot.green { background: #27C93F; }

.lobsidian-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #94A3B8;
    text-transform: uppercase;
}
.lobsidian-status {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 4px 11px;
    border-radius: 100px;
    background: rgba(225, 29, 72, 0.12);
    color: #FB7185;
    border: 1px solid rgba(225, 29, 72, 0.3);
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
}
.obsidian-pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #F43F5E;
    box-shadow: 0 0 8px #F43F5E;
    animation: obsDotPulse 2s ease-in-out infinite;
}
@keyframes obsDotPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.5; }
}

.lobsidian-body {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 22px;
}
.lobsidian-hero-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 14px;
    padding: 18px 22px;
}
.lobsidian-m-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.lobsidian-m-block.right { text-align: right; }
.lobsidian-m-block .lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: #64748B;
    text-transform: uppercase;
}
.lobsidian-m-block .val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #F8FAFC;
    letter-spacing: -0.4px;
}
.lobsidian-m-block .val.highlight { color: #FB7185; }

.lobsidian-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
}
.lobsidian-stat-col {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.lobsidian-stat-col .k {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 1px;
}
.lobsidian-stat-col .v {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 800;
    color: #F8FAFC;
}
.lobsidian-stat-col .v.green { color: #34D399; }
.lobsidian-stat-col .v.api { display: flex; align-items: center; gap: 6px; }

.obsidian-live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10B981;
    box-shadow: 0 0 8px #10B981;
}

.lobsidian-tracks-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 14px;
    padding: 20px;
}
.lobsidian-track {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.lobsidian-track-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    color: #94A3B8;
}
.lobsidian-track-hdr .tag.green { color: #34D399; }
.lobsidian-track-hdr .tag.rose { color: #FB7185; }

.lobsidian-track-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 100px;
    overflow: hidden;
    position: relative;
}
.lobsidian-track-fill {
    height: 100%;
    border-radius: 100px;
    position: relative;
    transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.lobsidian-track-fill.green {
    background: linear-gradient(90deg, #059669, #10B981);
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}
.lobsidian-track-fill.rose {
    background: linear-gradient(90deg, #991B1B, #F43F5E);
    box-shadow: 0 0 12px rgba(244, 63, 94, 0.4);
}
.lobsidian-glow {
    position: absolute;
    top: 0; bottom: 0;
    width: 40px;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%);
    animation: obsGlowTravel 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes obsGlowTravel {
    0% { left: -40px; }
    100% { left: 100%; }
}

.lobsidian-rules-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}
.lobsidian-rule {
    padding: 14px 18px;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 10px;
}
.lobsidian-rule.pass {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.25);
    color: #34D399;
}
.lobsidian-rule.fail {
    background: rgba(244, 63, 94, 0.1);
    border: 1px solid rgba(244, 63, 94, 0.25);
    color: #FB7185;
}

/* RIVALRY MATCHUP GRID FOR OBSIDIAN CONSOLE */
.lobsidian-matchup-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 14px;
    padding: 20px;
}
.lobsidian-player {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.lobsidian-player.opponent { text-align: right; }
.lobsidian-player .role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 700;
    color: #64748B;
    letter-spacing: 1px;
}
.lobsidian-player .handle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: #F8FAFC;
}
.lobsidian-player .score {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 24px;
    font-weight: 900;
}
.lobsidian-player .score.green { color: #34D399; }
.lobsidian-player .score.rose { color: #FB7185; }
.lobsidian-player .staked {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #64748B;
}

.lobsidian-vs {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
}
.lobsidian-vs .swords { font-size: 20px; }
.lobsidian-vs .vs-txt {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    color: #64748B;
}

.lobsidian-vault-bar {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.lobsidian-vault-bar .lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: #64748B;
    letter-spacing: 1px;
}
.lobsidian-vault-bar .pool-val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 22px;
    font-weight: 900;
    color: #34D399;
}
.lobsidian-vault-bar .sub {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: #94A3B8;
}

@media (max-width: 768px) {
    .lseg-control-bar { flex-direction: column; border-radius: 16px; }
    .lseg-tab { width: 100%; border-radius: 12px; }
    .lobsidian-stats-grid { grid-template-columns: 1fr 1fr; }
    .lobsidian-rules-row { grid-template-columns: 1fr; }
    .lobsidian-matchup-grid { grid-template-columns: 1fr; text-align: center; }
    .lobsidian-player.opponent { text-align: center; }
    .lobsidian-hero-bar { flex-direction: column; align-items: flex-start; gap: 10px; }
}

/* ═══ SIGNATURE TYPOGRAPHIC HERO: SOLO OR RIVALRY (YOU vs YOU / YOU vs THEM) ═══ */
.sor-section {
    background: #F4EFE7;
    padding: clamp(36px, 6vw, 72px) clamp(20px, 4vw, 48px);
    font-family: 'Inter', sans-serif;
    border-top: 1px solid rgba(28, 35, 51, 0.08);
    border-bottom: 1px solid rgba(28, 35, 51, 0.08);
}
.sor-grid {
    display: grid;
    grid-template-columns: 42% 58%;
    gap: clamp(28px, 4vw, 56px);
    align-items: center;
    max-width: 1240px;
    margin: 0 auto;
}
@media (max-width: 900px) {
    .sor-grid { grid-template-columns: 1fr; }
    .sor-grid > div:last-child { order: -1; }
}

.sor-mode {
    text-align: left;
    cursor: pointer;
    width: 100%;
    font: inherit;
    background: #FBF9F5;
    border: 1.5px solid rgba(28,35,51,0.10);
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 8px 24px -18px rgba(28,35,51,0.25);
    transition: all 0.22s cubic-bezier(.2,.7,.3,1);
    position: relative;
}
.sor-mode:hover {
    transform: translateY(-3px);
}
.sor-mode.active {
    background: #FFFFFF !important;
    border-color: #7A1C2B !important;
    box-shadow: 0 18px 40px -22px rgba(122,28,43,0.4), 0 0 0 4px rgba(122,28,43,0.08) !important;
}

.sor-mode-badge {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.4px;
    color: #7A1C2B;
    background: rgba(122,28,43,0.08);
    padding: 4px 10px;
    border-radius: 100px;
    margin-bottom: 12px;
}

.sor-mode-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 16.5px;
    font-weight: 800;
    color: #1C2333;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
}

.sor-bullets {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
}
.sor-bullets li {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #5A6072;
    line-height: 1.35;
}

.sor-cta {
    margin-top: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 800;
    letter-spacing: 0.3px;
    color: #7A1C2B;
    display: flex;
    align-items: center;
    gap: 6px;
}
.sor-arrow { transition: transform .2s ease; display: inline-block; }
.sor-mode:hover .sor-arrow { transform: translateX(4px); }

.sor-icon-box {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #FBF9F5;
    border: 1px solid rgba(28,35,51,0.10);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 16px -12px rgba(28,35,51,0.3);
}

.sor-primary {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #FFFFFF;
    background: linear-gradient(135deg, #7A1C2B 0%, #5E1521 100%);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 6px;
    padding: 16px 32px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 24px -10px rgba(122,28,43,0.6), 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.sor-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 65%;
    height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
    transform: skewX(-22deg);
    transition: left 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.sor-primary:hover {
    transform: translateY(-3px) scale(1.02);
    background: linear-gradient(135deg, #9A2B3D 0%, #6E1827 100%);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 16px 36px -10px rgba(122,28,43,0.85), 0 0 24px rgba(154,43,61,0.45);
}

.sor-primary:hover::before {
    left: 140%;
}

.sor-primary:hover .sor-arrow {
    transform: translateX(6px) scale(1.15);
    color: #FFFFFF;
}

.sor-primary:active {
    transform: translateY(-1px) scale(0.99);
}

/* HERO RIGHT CARD */
.sor-hero-card {
    position: relative;
    background: #F7F2EA;
    border: 1px solid rgba(28,35,51,0.10);
    border-radius: 26px;
    padding: clamp(26px, 4vw, 52px);
    overflow: hidden;
    min-height: 440px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 40px 100px -60px rgba(28,35,51,0.5);
}

.sor-ambient-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(60% 55% at 50% 42%, rgba(122,28,43,0.10), rgba(122,28,43,0) 70%);
}

.sor-mode-tag {
    position: absolute;
    top: 20px;
    right: 24px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.7px;
    color: #8C8577;
    z-index: 2;
}
.sor-live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3F9D5A;
    animation: sorBlink 2s ease-in-out infinite;
}

.sor-word-top, .sor-word-bottom {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(58px, 9vw, 132px);
    font-weight: 900;
    letter-spacing: -0.045em;
    line-height: 0.92;
    color: #1C2333;
    text-transform: uppercase;
}

.sor-vs-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin: clamp(6px, 1.4vw, 14px) 0;
}
.sor-rule {
    display: block;
    width: clamp(40px, 7vw, 96px);
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(28,35,51,0.16), transparent);
}
.sor-vs {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 4px;
    color: #7A1C2B;
    text-transform: uppercase;
}

.sor-figure-val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(26px, 3.4vw, 40px);
    font-weight: 900;
    letter-spacing: -1px;
    color: #7A1C2B;
    line-height: 1;
}
.sor-figure-lbl {
    margin-top: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 2.2px;
    color: #8C8577;
    text-transform: uppercase;
}

.sor-outcome-text {
    margin-top: clamp(16px, 2.2vw, 26px);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #5A6072;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.5;
}

/* MORPHING ANIMATIONS */
@media (prefers-reduced-motion: no-preference) {
    .sor-morph   { animation: sorMorph .55s cubic-bezier(.2,.75,.25,1) both; }
    .sor-figure  { animation: sorRise .5s cubic-bezier(.2,.75,.25,1) .06s both; }
    .sor-outcome { animation: sorRise .5s cubic-bezier(.2,.75,.25,1) .12s both; }
}

@keyframes sorMorph {
    from { opacity: 0; transform: translateY(18px); filter: blur(6px); }
    to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes sorRise {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes sorBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}
.tl-tile {
    width: 50px;
    height: 50px;
    border-radius: 15px;
    background: linear-gradient(180deg, #FFFFFF, #FAF7F2);
    border: 1px solid rgba(28, 35, 51, 0.10);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 20px -13px rgba(28, 35, 51, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition: transform 0.2s cubic-bezier(0.2, 0.7, 0.3, 1), box-shadow 0.2s ease;
}
.tl-tile:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 30px -15px rgba(28, 35, 51, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
`;
