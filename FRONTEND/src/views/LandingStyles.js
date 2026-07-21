// Landing CSS — Elite fintech conversion page
export const landingCSS = `
.lp{--bg:#ffffff;--p:#FFF;--s:#fafaf9;--t1:#0F172A;--t2:#334155;--t3:#64748B;--d:#E2E8F0;--r:#5C1414;--rh:#6B1212;--g:#145c14;min-height:100vh;background:var(--bg);color:var(--t1);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;opacity:0;transition:opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)}
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
.ln-brand{font-family:'Inter Tight',sans-serif;font-size:16px;font-weight:800;letter-spacing:3.5px;color:var(--t1);text-decoration:none;display:inline-flex;align-items:center;gap:14px}
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

/* ═══ HERO ═══ */
.lhero-section{position:relative;overflow:hidden;padding-top:140px;padding-bottom:50px;background:#FAF8F5}
.lhero-bg-container{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.lhero-mesh-svg{width:100%;height:100%;opacity:0.95;will-change:transform;transition:transform 0.05s ease-out}
.lhero-headline-wrap{margin-bottom:36px;position:relative;z-index:2}
.lh1{font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:clamp(44px,7.5vw,98px);line-height:0.98;letter-spacing:-2.5px;color:var(--t1);text-transform:uppercase;margin:0 0 16px}
.lh-gradient{color:var(--r);background:linear-gradient(135deg,#5C1414 0%,#8B1212 50%,#3D0D0D 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:inline-block}
.lh-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(92,20,20,0.04);border:1px solid rgba(92,20,20,0.12);padding:6px 14px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--r);margin-bottom:20px;box-shadow:0 2px 8px rgba(92,20,20,0.02)}
.lh-badge-dot{width:6px;height:6px;background:var(--g);border-radius:50%;display:inline-block;box-shadow:0 0 8px rgba(20,92,20,0.8);animation:badgeDotPulse 1.8s ease-in-out infinite}
@keyframes badgeDotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.85)}}
.lh-nobrk{display:inline}
.lh-br{display:none}
@media(min-width:768px){
  .lh-br{display:block}
}
.lhero-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:48px;align-items:flex-start;position:relative;z-index:2}
.lsub{font-size:18px;color:var(--t2);line-height:1.55;margin:0 0 32px;max-width:640px;letter-spacing:-.2px}
.lctas{display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
.lhero-footer-strip{display:flex;justify-content:flex-end;margin-top:24px;position:relative;z-index:2}
.lhero-scroll-down{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--t3);text-decoration:none;transition:color 0.25s ease,transform 0.25s ease}
.lhero-scroll-down:hover{color:var(--r);transform:translateY(2px)}
.lhero-scroll-arrow{font-size:14px;animation:bounceDown 2s infinite ease-in-out}
@keyframes bounceDown{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}

/* ═══ REAL COLLATERAL CONTRACT CARDS DECK CAROUSEL ═══ */
.lfeatured-live-section {
    padding: 90px 0;
    background: #FAF9F7 !important;
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
    max-width: 560px;
    height: 410px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.lfan-deck-stage {
    position: relative;
    width: 380px;
    height: 390px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.lfan-real-card {
    position: absolute !important;
    width: 380px !important;
    top: 0;
    transition: transform 450ms cubic-bezier(0.4, 0, 0.2, 1), opacity 450ms cubic-bezier(0.4, 0, 0.2, 1) !important;
    transform-origin: bottom center !important;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.08) !important;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.1) !important;
    background: #FFFFFF !important;
}

.lfan-real-card.is-center {
    transform: translateX(0) rotate(0deg) scale(1) !important;
    z-index: 5 !important;
    opacity: 1 !important;
    pointer-events: auto !important;
}

.lfan-real-card.is-left {
    transform: translateX(-42px) translateY(10px) rotate(-6deg) scale(0.92) !important;
    z-index: 2 !important;
    opacity: 0.85 !important;
    pointer-events: auto !important;
}

.lfan-real-card.is-right {
    transform: translateX(42px) translateY(10px) rotate(6deg) scale(0.92) !important;
    z-index: 2 !important;
    opacity: 0.85 !important;
    pointer-events: auto !important;
}

.lfan-real-card.is-hidden {
    transform: translateX(0) rotate(0deg) scale(0.8) !important;
    z-index: 1 !important;
    opacity: 0 !important;
    pointer-events: none !important;
}

@media(max-width: 900px) {
    .lfan-grid {
        grid-template-columns: 1fr;
        gap: 36px;
    }
    .lfan-right {
        order: 1;
    }
    .lfan-left {
        order: 2;
    }
    .lfan-deck-viewport {
        max-width: 100%;
        height: 390px;
    }
    .lfan-real-card {
        width: 100% !important;
        max-width: 350px !important;
    }
    .lfan-real-card.is-left {
        transform: translateX(-20px) rotate(-4deg) scale(0.92) !important;
    }
    .lfan-real-card.is-right {
        transform: translateX(20px) rotate(4deg) scale(0.92) !important;
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
    background: var(--r) !important;
    color: #fff !important;
    border: 1.5px solid var(--r) !important;
}
.lbtn-r:hover {
    background: var(--rh) !important;
    border-color: var(--rh) !important;
    box-shadow: none !important;
    transform: none !important;
}
.lbtn-r::after {
    display: none !important;
}
.lbtn-g {
    background: transparent !important;
    color: var(--t1) !important;
    border: 1.5px solid var(--t1) !important;
}
.lbtn-g:hover {
    background: var(--t1) !important;
    color: #fff !important;
    border-color: var(--t1) !important;
    transform: none !important;
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
.lcontracts{padding:30px 0 48px;background:var(--bg);position:relative}
.lcontracts::after{content:'';position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(to bottom, var(--bg), var(--s));pointer-events:none}
.lcontracts .lw{max-width:1280px}
.lcards{display:grid;grid-template-columns:repeat(4,1fr);gap:32px}
.lcard{border:1px solid var(--d);padding:36px 24px;display:flex;flex-direction:column;transition:all 0.4s cubic-bezier(0.16, 1, 0.3, 1);background:var(--p);position:relative;overflow:hidden;cursor:pointer}
.lcard::before{content:'';position:absolute;top:-1px;left:0;right:0;height:2px;background:var(--r);transform:scaleX(0);transform-origin:left;transition:transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)}
.lcard:hover::before{transform:scaleX(1)}
.lcard:hover{border-color:#bbb;box-shadow:0 16px 40px rgba(0,0,0,.08);transform:translateY(-6px)}
.lcard-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px 12px}
.lcard-src{font-family:'Inter',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--t2);display:inline-flex;align-items:center;gap:8px;background:rgba(17,17,17,0.03);border:1px solid rgba(0,0,0,0.06);border-radius:6px;padding:5px 10px 5px 8px;transition:all 0.3s ease}
.lcard:hover .lcard-src{border-color:rgba(0,0,0,0.1);background:rgba(17,17,17,0.05)}
.lcard-src-logo{width:16px;height:16px;object-fit:contain;flex-shrink:0;opacity:0.7;transition:opacity 0.3s ease}
.lcard:hover .lcard-src-logo{opacity:1}
.lcard-tier{font-family:'Inter',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:5px 10px;border-radius:6px}
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
.lhow{padding:75px 0;background:var(--s);position:relative}
.lhow::before{content:'';position:absolute;top:0;left:0;right:0;height:60px;background:linear-gradient(to bottom, var(--s), var(--s));pointer-events:none}
.lhow::after{content:'';position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(to bottom, var(--s), var(--bg));pointer-events:none}
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
.ltypes{padding:100px 0}
.ltypes-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px}
.ltype{background:transparent;border:none;padding:40px 0 0 0;border-top:1px solid rgba(0,0,0,0.08);transition:border-color 0.3s ease}
.ltype:hover{border-top-color:var(--r)}
.ltype-badge{font-family:'Inter',monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:24px;display:inline-block;padding:0;background:transparent!important;border:none!important}
.ltype-h{font-family:'Inter Tight',sans-serif;font-size: 28px;font-weight:600;letter-spacing:-1px;margin-bottom:16px}
.ltype-p{font-size:18px;color:var(--t2);line-height:1.65;margin-bottom:32px}
.ltype-detail{font-size:15px;color:var(--t2);line-height:1.6;padding-top:24px;border-top:1px dashed rgba(0,0,0,0.08)}

/* ═══ FAQ ═══ */
.lfaq{padding:36px 0;text-align:center;background:var(--bg);position:relative}
.lfaq::after{content:'';position:absolute;bottom:0;left:0;right:0;height:60px;background:linear-gradient(to bottom, var(--bg), var(--s));pointer-events:none}
.lfaq-wrap{max-width:640px;margin:0 auto;text-align:left}
.lfaq .lred-dash{justify-content:center}
.fq{border-bottom:1px solid var(--d)}.fq-q{padding:18px 0;font-family:'Inter Tight',sans-serif;font-size:15px;font-weight:600;color:var(--t1);cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;transition:color 0.2s ease}.fq-q:hover{color:var(--r)}.fq-q::after{content:'+';font-size:16px;color:var(--t3);transition:transform 0.3s ease}.fq.open .fq-q::after{content:'\\2212';transform:rotate(180deg)}.fq-a{max-height:0;overflow:hidden;transition:max-height .3s;font-size:13px;color:var(--t2);line-height:1.6}.fq.open .fq-a{max-height:400px;padding-bottom:18px}.fq-a strong{color:var(--t1);font-weight:600}
/* ═══ FINAL CTA ═══ */
.lfoot{background:var(--s);text-align:center;padding:32px 24px;position:relative;overflow:hidden}
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

/* ═══ SOCIAL PROOF ═══ */
.lreal-results{padding:100px 0;background:var(--bg);position:relative}
.lreal-results::after{content:'';position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(to bottom, var(--bg), var(--s));pointer-events:none}
.lh-section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(26px, 3.5vw, 36px);font-weight:800;line-height:1.15;letter-spacing:-1px;color:var(--t1);margin-bottom:16px}
.lh-section-subtitle{font-size:14px;color:var(--t3);line-height:1.5;margin-bottom:24px;max-width:640px}
.lstats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-bottom:64px;margin-top:32px}
.lstat-card{background:#fff;border:1px solid var(--d);padding:32px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.01)}
.lstat-num{font-family:'Plus Jakarta Sans',sans-serif;font-size:36px;font-weight:800;color:var(--r);letter-spacing:-1px;line-height:1}
.lstat-label{font-family:'Inter Tight',sans-serif;font-size:13px;font-weight:700;color:var(--t1);margin:10px 0 4px}
.lstat-sub{font-size:11px;color:var(--t3);line-height:1.4}
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
    background: var(--r);
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
    border-color: rgba(92, 20, 20, 0.25);
    box-shadow: 0 6px 16px rgba(92, 20, 20, 0.06);
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
    color: var(--r);
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
    color: var(--r);
    font-size: 10.5px;
    letter-spacing: 0.5px;
    white-space: nowrap !important;
    transition: color 0.2s ease;
}
.l-live-rivalry-preview:hover .l-lr-action-badge {
    color: #000000;
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

/* Global stats bar */
.l-global-stats-bar {
    background: var(--s);
    padding: 48px 0;
    position: relative;
}
.l-global-stats-bar::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 40px;
    background: linear-gradient(to bottom, var(--bg), var(--s));
    pointer-events: none;
}
.l-global-stats-bar::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 40px;
    background: linear-gradient(to bottom, var(--s), var(--bg));
    pointer-events: none;
}
.l-stats-bar-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
}
.l-stat-bar-item {
    text-decoration: none !important;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    width: 100%;
    border-right: 1px solid rgba(17, 17, 17, 0.05);
}
.l-stat-bar-item:last-child {
    border-right: none;
}
.l-stat-bar-wrapper {
    position: relative;
    overflow: hidden;
    height: 52px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: filter 220ms ease-out, opacity 220ms ease-out;
    transform: translateZ(0); /* promote to GPU */
}
.l-stat-bar-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
}
.l-stat-bar-content.incoming {
    position: absolute;
    left: 0;
    right: 0;
}
.l-stat-bar-val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #111;
    letter-spacing: -0.6px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    transition: color 0.3s ease;
}
.l-stat-bar-item:hover .l-stat-bar-val {
    color: var(--r);
}
.l-stat-bar-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #6e6d6a;
    line-height: 1.2;
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
    background: rgba(255, 255, 255, 0.45); /* Matte white overlay */
    transition: transform 0.1s ease-out;
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
.ltypes-asymmetric {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: 80px;
    padding: 100px 0;
    align-items: start;
}
.ltypes-left {
    position: sticky;
    top: 120px;
}
.ltypes-headline {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(30px, 4vw, 44px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -1.2px;
    color: var(--t1);
    margin: 16px 0 0;
    text-align: left;
}
.ltypes-headline strong {
    font-weight: 800;
    color: var(--r);
}
.ltypes-right {
    display: flex;
    flex-direction: column;
    gap: 48px;
}
.ltype-row {
    position: relative;
    border-left: 2px solid rgba(17, 17, 17, 0.08);
    padding: 8px 0 8px 24px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.ltype-row:hover {
    border-left-color: var(--r);
    transform: translateX(6px);
    background: linear-gradient(90deg, rgba(92, 20, 20, 0.02) 0%, transparent 100%);
}
.ltype-badge-new {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
    display: inline-block;
    background: rgba(17, 17, 17, 0.04);
    color: var(--t2);
    padding: 3px 10px;
    border-radius: 100px;
    transition: all 0.3s ease;
}
.ltype-row:hover .ltype-badge-new {
    background: rgba(17, 17, 17, 0.08);
    color: var(--t1);
}
.ltype-badge-new.secondary {
    background: rgba(92, 20, 20, 0.04);
    color: var(--r);
}
.ltype-row:hover .ltype-badge-new.secondary {
    background: var(--r);
    color: #FFF;
}
.ltype-title-new {
    font-family: 'Inter Tight', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.4px;
    margin: 0 0 8px 0;
    color: var(--t1);
}
.ltype-desc-new {
    font-size: 14px;
    color: var(--t2);
    line-height: 1.55;
    margin: 0 0 16px 0;
}
.ltype-meta-new {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}
.lmeta-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    color: var(--t3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 4px;
}
.lmeta-tag {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: var(--t2);
    background: #FFF;
    border: 1px solid var(--d);
    padding: 2px 8px;
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
    font-size: 11px;
    color: var(--t3);
    line-height: 1.4;
    max-width: 240px;
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
.lledger-table-prod td {
    padding: 12px 16px; /* reduced row vertical padding for comfortable but tighter height */
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
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
    color: var(--t1);
    font-size: 13px;
}
.lledger-table-prod .td-user {
    color: var(--t3);
    font-size: 11px;
    font-weight: 400;
    margin-left: 4px;
}
.lledger-table-prod .td-metric {
    font-weight: 600;
    color: var(--t1);
}
.lledger-table-prod .td-capital {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    color: var(--t1);
}
.lledger-table-prod .td-outcome {
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}
.lledger-table-prod .td-outcome.hit {
    color: var(--g);
}
.lledger-table-prod .td-outcome.miss {
    color: var(--r);
}
.outcome-marker-hit {
    color: var(--g);
    font-weight: bold;
    margin-right: 4px;
}
.outcome-marker-miss {
    color: var(--r);
    font-weight: bold;
    margin-right: 4px;
}
.outcome-marker-tracking {
    color: var(--t3);
    margin-right: 6px;
    font-size: 10px;
    display: inline-block;
    vertical-align: middle;
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


`;
