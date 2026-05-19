// Landing Page — Institutional Design System
// Matches overview.html tokens: #F7F7F6 bg, #0E0E11 text, #921818 red, Inter Tight display
export const landingCSS = `
/* ── Tokens (inherited from index.css :root, but scoped for safety) ── */
.lp {
    --bg: #F7F7F6;
    --panel: #FFFFFF;
    --text-1: #0E0E11;
    --text-2: #6B6E76;
    --text-3: #B0B2B8;
    --divider: #D9DBE1;
    --red: #921818;
    --red-hover: #751212;
    --green: #1F7A4D;
    --gold: #A18239;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-1);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
}

/* ── Grid background (matches overview) ── */
.lp-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(14,14,17,.03) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(14,14,17,.03) 1px, transparent 1px);
}

/* ── Scroll Reveal ── */
.lp [data-reveal] {
    opacity: 0; transform: translateY(28px);
    transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
}
.lp [data-reveal].revealed { opacity: 1; transform: translateY(0); }
.lp [data-reveal-delay="1"] { transition-delay: .1s; }
.lp [data-reveal-delay="2"] { transition-delay: .2s; }
.lp [data-reveal-delay="3"] { transition-delay: .3s; }

/* ── Layout ── */
.lp-wrap {
    max-width: 920px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
}
.lp-section { padding: 80px 0; }
.lp-divider { height: 1px; background: var(--divider); }

/* ── Typography ── */
.lp-mono {
    font-family: 'Inter', monospace;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-2);
}
.lp-section-label {
    font-family: 'Inter Tight', sans-serif;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .8px;
    color: var(--red);
    margin-bottom: 32px;
}

/* ════════════════════ HERO ════════════════════ */
.lp-hero {
    padding: 56px 0 64px;
    max-width: 640px;
}
.lp-eyebrow {
    font-family: 'Inter', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 20px;
    display: block;
}
.lp-h1 {
    font-family: 'Inter Tight', sans-serif;
    font-size: 52px;
    font-weight: 700;
    letter-spacing: -1.5px;
    line-height: 1.05;
    color: var(--text-1);
    margin: 0 0 20px;
}
.lp-sub {
    font-size: 16px;
    color: var(--text-2);
    line-height: 1.7;
    margin: 0 0 32px;
    max-width: 540px;
}
.lp-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 28px;
    background: var(--red);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .8px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all .2s;
}
.lp-cta:hover { background: var(--red-hover); }
.lp-cta:active { transform: scale(.98); }
.lp-cta-secondary {
    display: inline-flex;
    align-items: center;
    height: 48px;
    padding: 0 28px;
    background: var(--panel);
    color: var(--text-2);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .8px;
    text-transform: uppercase;
    border: 1px solid var(--divider);
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all .2s;
}
.lp-cta-secondary:hover { border-color: var(--text-3); color: var(--text-1); }
.lp-micro {
    font-size: 12px;
    color: var(--text-3);
    margin-top: 12px;
}
.lp-trust {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 32px;
    flex-wrap: wrap;
}
.lp-trust-label { font-size: 11px; color: var(--text-2); font-weight: 500; }
.lp-trust-badge {
    font-family: 'Inter', monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-2);
    background: var(--panel);
    border: 1px solid var(--divider);
    padding: 4px 10px;
}
.lp-disclaimer {
    font-size: 11px;
    color: var(--text-3);
    line-height: 1.5;
    margin-top: 16px;
}
.lp-disclaimer a { color: var(--red); text-decoration: none; }

/* ════════════════════ HOW IT WORKS ════════════════════ */
.lp-steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
}
.lp-step {
    padding: 0 20px;
    border-left: 1px solid var(--divider);
}
.lp-step:first-child { border-left: 1px solid var(--red); }
.lp-step-num {
    font-family: 'Inter', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--red);
    margin-bottom: 12px;
}
.lp-step-title {
    font-family: 'Inter Tight', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-1);
    margin-bottom: 6px;
}
.lp-step-desc {
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.5;
}

/* ════════════════════ WORKED EXAMPLE ════════════════════ */
.lp-example-box {
    background: var(--panel);
    border: 1px solid var(--divider);
    padding: 32px;
    max-width: 600px;
}
.lp-example-label {
    font-family: 'Inter', monospace;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--red);
    margin-bottom: 20px;
}
.lp-example-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(217,219,225,.5);
    font-size: 14px;
}
.lp-example-row:last-child { border-bottom: none; }
.lp-example-row .lbl { color: var(--text-2); }
.lp-example-row .val { font-weight: 600; color: var(--text-1); }
.lp-example-row .val.green { color: var(--green); }
.lp-example-row .val.red { color: var(--red); }

/* ════════════════════ CONTRACT CARDS ════════════════════ */
.lp-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}
.lp-card {
    background: var(--panel);
    border: 1px solid var(--divider);
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    transition: border-color .2s, box-shadow .2s;
    cursor: default;
}
.lp-card:hover {
    border-color: var(--text-3);
    box-shadow: 0 8px 24px rgba(0,0,0,.04);
}
.lp-card-provider {
    font-family: 'Inter', monospace;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-2);
    margin-bottom: 12px;
}
.lp-card-title {
    font-family: 'Inter Tight', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-1);
    margin-bottom: 4px;
    letter-spacing: -.3px;
}
.lp-card-min {
    font-size: 11px;
    color: var(--red);
    font-weight: 600;
    margin-bottom: 20px;
}
.lp-card-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(217,219,225,.4);
    font-size: 13px;
}
.lp-card-row:last-child { border-bottom: none; }
.lp-card-row .lbl { color: var(--text-2); }
.lp-card-row .val { font-weight: 600; color: var(--text-1); }
.lp-card-cta {
    margin-top: auto;
    padding-top: 20px;
    font-family: 'Inter', monospace;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-2);
    cursor: pointer;
    transition: color .2s;
    background: none;
    border: none;
    text-align: left;
    padding-left: 0;
}
.lp-card:hover .lp-card-cta { color: var(--red); }

/* ════════════════════ FAQ ════════════════════ */
.lp-faq { max-width: 680px; }
.fq { border-bottom: 1px solid var(--divider); }
.fq-q {
    padding: 20px 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-1);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    font-family: 'Inter Tight', sans-serif;
}
.fq-q::after {
    content: '+';
    font-size: 18px;
    color: var(--text-3);
    transition: transform .2s;
    font-weight: 400;
}
.fq.open .fq-q::after { content: '\\2212'; }
.fq-a {
    max-height: 0;
    overflow: hidden;
    transition: max-height .3s ease;
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.65;
}
.fq.open .fq-a { max-height: 400px; padding-bottom: 20px; }
.fq-a strong { color: var(--text-1); font-weight: 600; }

/* ════════════════════ FINAL CTA ════════════════════ */
.lp-final {
    background: var(--text-1);
    color: #fff;
    text-align: center;
    padding: 80px 24px;
}
.lp-final-h {
    font-family: 'Inter Tight', sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -.5px;
    margin-bottom: 8px;
}
.lp-final-sub {
    font-size: 14px;
    color: rgba(255,255,255,.5);
    margin-bottom: 28px;
}
.lp-final-btn {
    display: inline-flex;
    height: 48px;
    padding: 0 32px;
    align-items: center;
    background: var(--red);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .8px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all .2s;
}
.lp-final-btn:hover { background: var(--red-hover); }
.lp-final-micro {
    font-size: 12px;
    color: rgba(255,255,255,.35);
    margin-top: 12px;
}
.lp-final-foot {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,.08);
    font-size: 11px;
    color: rgba(255,255,255,.25);
}

/* ════════════════════ RESPONSIVE ════════════════════ */
@media (max-width: 768px) {
    .lp-h1 { font-size: 36px; }
    .lp-hero { padding: 40px 0 48px; }
    .lp-steps { grid-template-columns: 1fr; gap: 0; }
    .lp-step { border-left: none; border-top: 1px solid var(--divider); padding: 16px 0; }
    .lp-step:first-child { border-top: 1px solid var(--red); }
    .lp-cards { grid-template-columns: 1fr; }
    .lp-section { padding: 56px 0; }
    .lp-cta-group { flex-direction: column; }
    .lp-cta, .lp-cta-secondary { width: 100%; justify-content: center; }
}
`;
