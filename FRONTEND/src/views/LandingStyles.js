// Landing Styles — pixel-for-pixel match with overview.html
// Uses same tokens, same type scale, same spacing rhythm
export const landingCSS = `
/* ── Tokens (from index.css) ── */
.lp {
    --bg: #F9F9F9;
    --panel: #FFFFFF;
    --t1: #111111;
    --t2: #444444;
    --t3: #8A8A8A;
    --div: #E5E5E5;
    --red: #5C1414;
    --red-h: #6B1212;
    --green: #15803D;
    --gold: #A18239;
    --gold-wash: rgba(161,130,57,.06);
    min-height: 100vh;
    background: var(--bg);
    color: var(--t1);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    font-size: 14px;
    line-height: 1.5;
}
.lp *, .lp *::before, .lp *::after { box-sizing: border-box; }

/* ── Background (clean, no grid) ── */
.lp-grid, .lp-noise { display: none; }

/* ── Scroll Reveal (exact overview easing) ── */
.lp [data-reveal] {
    opacity: 0; transform: translateY(32px);
    transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
}
.lp [data-reveal].revealed { opacity: 1; transform: translateY(0); }
.lp [data-reveal-delay="1"] { transition-delay: .1s; }
.lp [data-reveal-delay="2"] { transition-delay: .2s; }
.lp [data-reveal-delay="3"] { transition-delay: .3s; }

/* ── Layout ── */
.lp-w { max-width: 960px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 1; }
.lp-hr { width: 100%; height: 1px; background: var(--div); }

/* ── Shared Typography ── */
.lp-display { font-family: 'Inter Tight', sans-serif; }
.lp-mono { font-family: 'Inter', monospace; font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.8px; color: var(--t2); }
.lp-section-h { font-family: 'Inter Tight', sans-serif; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: -.2px; color: var(--red); margin-bottom: 8px; }
.lp-section-hr { width: 100%; height: 1px; background: rgba(92,20,20,.2); margin-bottom: 32px; }

/* ═══ NAV BAR ═══ */
.lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    border-bottom: 1px solid var(--div);
    background: rgba(249,249,249,.95);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
}
.lp-nav::after {
    content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px;
    background: linear-gradient(90deg, transparent 0%, #5C1414 50%, transparent 100%);
}
.lp-nav-in {
    max-width: 960px; margin: 0 auto; padding: 0 24px;
    height: 64px; display: flex; justify-content: space-between; align-items: center;
}
.lp-nav-brand {
    font-family: 'Inter Tight', sans-serif;
    font-size: 14px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: var(--t1); text-decoration: none;
}
.lp-nav-cta {
    background: var(--red); color: #fff;
    font-size: 11px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase;
    padding: 8px 20px; border: none; cursor: pointer;
    border-radius: 2px; transition: background .2s;
}
.lp-nav-cta:hover { background: var(--red-h); }

/* ═══ HERO ═══ */
.lp-hero {
    padding: 120px 0 80px;
    position: relative;
}
.lp-hero::before {
    content: ''; position: absolute; left: -16px; top: 0; bottom: 0; width: 1px;
    background: var(--red); display: none;
}
@media(min-width:768px) { .lp-hero::before { display: block; } }

.lp-h1 {
    font-family: 'Inter Tight', sans-serif;
    font-weight: 400;
    font-size: clamp(42px, 7vw, 72px);
    line-height: .9;
    letter-spacing: -1px;
    color: var(--t1);
    margin: 0 0 24px;
    max-width: 720px;
}
.lp-h1 em {
    font-style: normal;
    color: var(--red);
    font-weight: 500;
    letter-spacing: -2px;
}
.lp-hero-body {
    display: flex; flex-direction: column; gap: 20px;
    max-width: 520px;
}
.lp-gold-hook {
    font-size: 13px; font-weight: 500; color: #4D5057;
    line-height: 1.4; letter-spacing: -.2px;
    background: var(--gold-wash);
    padding: 8px 12px; margin-left: -12px;
    border-left: 2px solid rgba(161,130,57,.5);
    width: fit-content;
}
.lp-gold-hook span { color: var(--gold); font-weight: 600; }
.lp-hero-sub {
    font-size: 16px; color: var(--t2); line-height: 1.65; letter-spacing: -.2px;
}
.lp-hero-detail {
    font-size: 13px; color: rgba(107,110,118,.8); line-height: 1.5; padding-left: 4px;
}
.lp-ctas {
    display: flex; align-items: center; gap: 12px; margin-top: 4px; flex-wrap: wrap;
}
.lp-cta-red {
    height: 48px; padding: 0 24px;
    background: var(--red); color: #fff;
    font-size: 11px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase;
    border: none; cursor: pointer; border-radius: 2px;
    display: inline-flex; align-items: center; gap: 8px;
    transition: all .2s; box-shadow: 0 1px 3px rgba(0,0,0,.08);
    font-family: 'Inter', sans-serif;
}
.lp-cta-red:hover { background: var(--red-h); }
.lp-cta-red:active { transform: scale(.97); }
.lp-cta-ghost {
    height: 48px; padding: 0 24px;
    background: var(--panel); color: var(--t2);
    font-size: 11px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase;
    border: 1px solid var(--div); cursor: pointer; border-radius: 2px;
    display: inline-flex; align-items: center;
    transition: all .2s; box-shadow: 0 1px 2px rgba(0,0,0,.02);
    font-family: 'Inter', sans-serif;
}
.lp-cta-ghost:hover { border-color: var(--t3); color: var(--t1); }

.lp-hero-micro {
    font-size: 12px; color: var(--t3); margin-top: 4px;
}

/* ═══ PROOF STRIP ═══ */
.lp-proof-strip {
    width: 100%; border-top: 1px solid var(--div); border-bottom: 1px solid var(--div);
    padding: 16px 0; background: var(--panel);
}
.lp-proof-in {
    max-width: 960px; margin: 0 auto; padding: 0 24px;
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
}
.lp-proof-dot {
    width: 8px; height: 8px; background: var(--green); border-radius: 50%; flex-shrink: 0;
}
.lp-proof-sep {
    width: 1px; height: 12px; background: var(--div); flex-shrink: 0;
}

/* ═══ SECTION CONTENT ═══ */
.lp-section { padding: 96px 0; }

/* Steps */
.lp-steps {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 48px 64px;
}
.lp-step {}
.lp-step-h {
    font-family: 'Inter Tight', sans-serif;
    font-size: 14px; font-weight: 500; color: var(--t1);
    text-transform: uppercase; letter-spacing: .5px;
    margin-bottom: 12px;
}
.lp-step-p {
    font-size: 14px; color: var(--t2); line-height: 1.6;
}
.lp-step-num {
    font-family: 'Inter', monospace; font-size: 10px; font-weight: 600;
    color: var(--red); margin-bottom: 8px; letter-spacing: 1px;
}

/* Example box */
.lp-ex-box {
    background: var(--panel); border: 1px solid var(--div); border-radius: 2px;
    overflow: hidden; max-width: 560px;
}
.lp-ex-head {
    background: var(--bg); border-bottom: 1px solid var(--div);
    padding: 12px 24px;
}
.lp-ex-rows { padding: 8px 0; }
.lp-ex-row {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 10px 24px; font-size: 13px;
}
.lp-ex-row .k { color: var(--t2); }
.lp-ex-row .v { font-weight: 500; color: var(--t1); text-align: right; }
.lp-ex-row .v.green { color: var(--green); }
.lp-ex-row .v.red { color: var(--red); }
.lp-ex-sep { height: 1px; background: var(--div); margin: 0 24px; opacity: .5; }

/* Cards */
.lp-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.lp-card {
    padding: 24px; background: var(--panel);
    border: 1px solid var(--div); border-radius: 2px;
    display: flex; flex-direction: column;
    transition: all .2s; cursor: default;
}
.lp-card:hover { border-color: var(--t3); box-shadow: 0 4px 12px rgba(0,0,0,.04); }
.c-prov { font-family: 'Inter', monospace; font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px; color: var(--t2); margin-bottom: 8px; }
.c-title { font-family: 'Inter Tight', sans-serif; font-size: 16px; font-weight: 600; color: var(--t1); margin-bottom: 2px; letter-spacing: -.2px; }
.c-min { font-size: 10px; font-weight: 500; color: var(--red); margin-bottom: 16px; font-family: 'Inter', monospace; text-transform: uppercase; letter-spacing: 1px; }
.c-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 12px; border-bottom: 1px solid rgba(217,219,225,.4); }
.c-row:last-of-type { border-bottom: none; }
.c-row .k { color: var(--t2); }
.c-row .v { font-weight: 500; color: var(--t1); }
.c-cta {
    margin-top: auto; padding-top: 16px;
    font-family: 'Inter', monospace; font-size: 10px; font-weight: 500;
    text-transform: uppercase; letter-spacing: 1.2px;
    color: var(--t2); background: none; border: none; cursor: pointer;
    text-align: left; padding-left: 0; transition: color .2s;
}
.lp-card:hover .c-cta { color: var(--red); }

/* FAQ */
.lp-faq { max-width: 640px; }
.fq { border-bottom: 1px solid var(--div); }
.fq-q {
    padding: 20px 0; font-family: 'Inter Tight', sans-serif;
    font-size: 15px; font-weight: 600; color: var(--t1);
    cursor: pointer; display: flex; justify-content: space-between;
    align-items: center; user-select: none;
}
.fq-q::after { content: '+'; font-size: 16px; color: var(--t3); font-weight: 400; }
.fq.open .fq-q::after { content: '\\2212'; }
.fq-a {
    max-height: 0; overflow: hidden; transition: max-height .35s ease;
    font-size: 13px; color: var(--t2); line-height: 1.65;
}
.fq.open .fq-a { max-height: 400px; padding-bottom: 20px; }
.fq-a strong { color: var(--t1); font-weight: 600; }

/* Footer CTA */
.lp-foot {
    background: var(--t1); text-align: center; padding: 80px 24px;
}
.lp-foot-h {
    font-family: 'Inter Tight', sans-serif;
    font-size: 28px; font-weight: 400; color: #fff;
    letter-spacing: -.5px; line-height: 1.1; margin-bottom: 8px;
}
.lp-foot-h em { font-style: normal; color: var(--red); font-weight: 500; }
.lp-foot-sub { font-size: 13px; color: rgba(255,255,255,.4); margin-bottom: 28px; }
.lp-foot-btn {
    display: inline-flex; height: 48px; padding: 0 28px; align-items: center;
    background: var(--red); color: #fff;
    font-size: 11px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase;
    border: none; cursor: pointer; border-radius: 2px;
    font-family: 'Inter', sans-serif; transition: all .2s;
}
.lp-foot-btn:hover { background: var(--red-h); }
.lp-foot-micro { font-size: 11px; color: rgba(255,255,255,.25); margin-top: 12px; }
.lp-foot-line {
    margin-top: 48px; padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,.06);
    font-size: 10px; color: rgba(255,255,255,.2);
    font-family: 'Inter', monospace; text-transform: uppercase; letter-spacing: 1.5px;
}

/* Credibility line */
.lp-cred {
    text-align: center; padding: 48px 24px;
    font-size: 13px; color: var(--t2);
}

/* ═══ RESPONSIVE ═══ */
@media(max-width:768px) {
    .lp-hero { padding: 96px 0 56px; }
    .lp-h1 { font-size: 40px; line-height: .95; }
    .lp-steps { grid-template-columns: 1fr; gap: 32px; }
    .lp-cards { grid-template-columns: 1fr; }
    .lp-section { padding: 64px 0; }
    .lp-ctas { flex-direction: column; }
    .lp-cta-red, .lp-cta-ghost { width: 100%; justify-content: center; }
    .lp-proof-in { flex-direction: column; align-items: flex-start; gap: 8px; }
    .lp-proof-sep { display: none; }
    .lp-nav-brand { font-size: 12px; }
}
`;
