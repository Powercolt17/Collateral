// Collateral — Landing Styles (Institutional Document Design System & Motion Tokens)
export const landingCSS = `
/* ═══════════ TOKENS ═══════════ */
.cl-root {
  --paper: #F7F4ED;
  --paper-alt: #EFEAE0;
  --paper-deep: #E7E1D4;
  --plate: #FFFDF9;
  --notch: #F7F4ED;
  --ink: #0E1420;
  --ink-2: #4A5464;
  --ink-3: #6E7686;
  --ink-4: #9AA0AC;
  --blood: #7A1C29;
  --blood-deep: #54111B;
  --blood-mid: #9B3341;
  --blood-tint: #F5E6E8;
  --blood-wash: #FBF3F4;
  --win: #186B4A;
  --win-tint: #E6F1EA;
  --win-wash: #F2F8F4;
  --gilt: #A8854E;
  --rule: #DCD5C6;
  --rule-soft: #EAE4D8;
  --rule-strong: #BDB3A0;
  --display: "Archivo", system-ui, sans-serif;
  --wordmark: "Archivo", system-ui, sans-serif;
  --body: "Public Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --shell: 1240px;
  --gutter: 28px;
  --section-y: 132px;
  --r: 2px;
  --lift: 0 1px 2px rgba(14,20,32,.04), 0 12px 28px -18px rgba(14,20,32,.22);
  --lift-lg: 0 2px 4px rgba(14,20,32,.05), 0 40px 80px -44px rgba(14,20,32,.42);
  --ease: cubic-bezier(.22,.85,.26,1);
}

@media(max-width:900px){
  .cl-root { --section-y: 84px; --gutter: 20px }
}

.cl-root *, .cl-root *::before, .cl-root *::after {
  box-sizing: border-box;
}

.cl-root {
  position: relative;
  background: var(--paper) !important;
  color: var(--ink);
  font-family: var(--body);
  font-size: 17px;
  line-height: 1.62;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  min-height: 100vh;
  opacity: 1;
}

.cl-root svg { display: block; max-width: 100%; }
.cl-root a { color: inherit; }
.cl-root h1, .cl-root h2, .cl-root h3, .cl-root p, .cl-root dl, .cl-root dd,
.cl-root figure, .cl-root blockquote, .cl-root ul { margin: 0; }

.cl-grain {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: .5;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E");
}

.cl-root > *:not(.cl-grain) {
  position: relative;
  z-index: 2;
}

.shell {
  max-width: var(--shell);
  margin: 0 auto;
  padding-inline: var(--gutter);
}

.section {
  padding-block: var(--section-y);
  position: relative;
}

.alt {
  background: var(--paper-alt);
  --notch: #EFEAE0;
}

.alt::before, .alt::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--rule-strong) 12%, var(--rule-strong) 88%, transparent);
}

.alt::before { top: 0; }
.alt::after { bottom: 0; }

/* ═══════════ CLERICAL VOICE ═══════════ */
.mono {
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-3);
  font-feature-settings: "tnum" 1;
}

.mono-b { color: var(--blood); }

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--win);
  flex: none;
  box-shadow: 0 0 0 3px rgba(24,107,74,.14);
}

.dots {
  flex: 1;
  border-bottom: 1px dotted var(--rule-strong);
  transform: translateY(-3px);
  opacity: .75;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 22px;
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--blood);
}

.eyebrow::before {
  content: "";
  width: 26px;
  height: 3px;
  flex: none;
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
}

.eyebrow--live { color: var(--ink-2); }
.eyebrow--live::before {
  width: 5px;
  height: 5px;
  border: 0;
  border-radius: 50%;
  background: var(--win);
  box-shadow: 0 0 0 3px rgba(24,107,74,.14);
}

.eyebrow--c { justify-content: center; }

.title {
  margin: 0 0 16px;
  font-family: var(--display);
  font-size: clamp(30px, 4.3vw, 50px);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -.034em;
  max-width: 17ch;
  text-wrap: balance;
}

.title--c {
  max-width: 21ch;
  margin-inline: auto;
  text-align: center;
}

.lede {
  margin: 0;
  font-size: 17.5px;
  line-height: 1.68;
  color: var(--ink-2);
  max-width: 54ch;
  text-wrap: pretty;
}

.lede--c {
  margin-inline: auto;
  text-align: center;
}

.link {
  position: relative;
  font-size: 14px;
  font-weight: 600;
  color: var(--blood);
  text-decoration: none;
  padding-bottom: 3px;
  display: inline-block;
}

.link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: currentColor;
  transform-origin: left;
  transition: transform .35s var(--ease);
}

.link:hover::after { transform: scaleX(.4); }

.cl-root :where(a, button, input, [tabindex]):focus-visible {
  outline: 1px solid var(--blood);
  outline-offset: 4px;
}

/* ═══════════ PLATE ═══════════ */
.plate {
  position: relative;
  background: var(--plate);
  border: 1px solid var(--ink);
  border-radius: var(--r);
  box-shadow: var(--lift);
}

.plate::after {
  content: "";
  position: absolute;
  inset: 5px;
  border: 1px solid var(--rule-soft);
  pointer-events: none;
}

.plate-quiet {
  position: relative;
  background: var(--plate);
  border: 1px solid var(--rule);
  border-radius: var(--r);
  box-shadow: var(--lift);
}

.ticks::before, .ticks::after {
  content: "";
  position: absolute;
  width: 11px;
  height: 11px;
  background: transparent !important;
  pointer-events: none;
  opacity: .75;
  z-index: 3;
}

.ticks::before {
  top: 1px;
  left: 1px;
  border-top: 1px solid var(--gilt);
  border-left: 1px solid var(--gilt);
  border-bottom: none !important;
  border-right: none !important;
}

.ticks::after {
  bottom: 1px;
  right: 1px;
  border-bottom: 1px solid var(--gilt);
  border-right: 1px solid var(--gilt);
  border-top: none !important;
  border-left: none !important;
}

/* ═══════════ GLOBAL BANNER HIDE ON LANDING ═══════════ */
#global-banner {
  display: none !important;
}

/* ═══════════ HEADER ═══════════ */
.ln {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 60;
  background: rgba(247,244,237,.95);
  backdrop-filter: saturate(1.6) blur(14px);
  -webkit-backdrop-filter: saturate(1.6) blur(14px);
  border-bottom: 1px solid var(--rule-soft);
  transition: background 0.4s ease, box-shadow 0.4s ease;
}

.ln.nav-scrolled {
  background: rgba(255,255,255,0.96) !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 8px 32px rgba(0,0,0,0.03);
}

.ln-in {
  width: 100%;
  max-width: 100%;
  padding: 0 24px 0 48px;
  height: 68px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ln-brand {
  font-family: var(--wordmark);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: .22em;
  color: #0F172A !important;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  transition: opacity 0.2s ease;
}

.ln-brand:hover {
  opacity: 0.85;
}

.logo-wordmark {
  color: #0F172A !important;
  font-weight: 800 !important;
  letter-spacing: .22em !important;
  text-transform: uppercase !important;
}

.ln-right-group {
  display: flex;
  align-items: center;
  gap: 28px;
}

.ln-cta {
  background: transparent !important;
  color: var(--ink) !important;
  font-family: var(--body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 9px 20px;
  border: 1px solid var(--ink) !important;
  border-radius: 4px;
  cursor: pointer;
  transition: all .2s ease;
}

.ln-cta:hover {
  background: var(--paper-alt) !important;
  color: var(--ink) !important;
}

.ch-hamburger {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.ch-hamburger:hover {
  opacity: 0.7;
}

.ch-hamburger-lines {
  width: 18px;
  height: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ch-hamburger-lines span {
  display: block;
  width: 100%;
  height: 1.5px;
  background: #111;
  border-radius: 1px;
  transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
  transform-origin: center;
}

.ch-hamburger-lines span:nth-child(2) {
  width: 12px;
  margin-left: auto;
}

@media(max-width:760px){
  .ln-in { padding: 0 16px; height: 60px; }
  .ln-right-group { gap: 16px; }
}

/* ═══════════ BUTTONS & ACTIONS ═══════════ */
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 28px;
  border: 1px solid transparent;
  border-radius: var(--r);
  font-family: var(--body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background .25s var(--ease), color .25s var(--ease), border-color .25s var(--ease), box-shadow .25s var(--ease), transform .25s var(--ease);
}

.btn:active { transform: translateY(1px); }

.btn-fill {
  background: var(--blood);
  color: #FFF8F5 !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.16), 0 10px 24px -16px rgba(122,28,41,.85);
}

.btn-fill:hover {
  background: var(--blood-deep);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 16px 32px -16px rgba(122,28,41,.9);
}

.btn-out {
  background: transparent !important;
  border: 1px solid var(--ink) !important;
  color: var(--ink) !important;
}

.btn-out:hover {
  background: var(--ink) !important;
  color: var(--paper) !important;
  box-shadow: 0 12px 26px -18px rgba(14,20,32,.8);
}

/* ═══════════ SECTION INDEX MARK ═══════════ */
.idx-mark {
  position: absolute;
  top: calc(var(--section-y) - 30px);
  right: max(var(--gutter), calc((100vw - var(--shell)) / 2));
  font-family: var(--display);
  font-size: 136px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.06em;
  color: var(--ink);
  opacity: .035;
  pointer-events: none;
  user-select: none;
}

@media(max-width:1280px){
  .idx-mark { display: none; }
}

/* ═══════════ HERO (authoritative block) ═══════════ */
.hero { padding-block: 88px 104px; }
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(0, .96fr);
  gap: 64px;
  align-items: center;
}

@media(max-width:1020px){
  .hero-grid { grid-template-columns: 1fr; gap: 52px; }
  .hero { padding-block: 52px 72px; }
}

.h1 {
  font-family: var(--display);
  font-size: clamp(44px, 7.2vw, 92px);
  font-weight: 700;
  line-height: .9;
  letter-spacing: -.046em;
  text-transform: uppercase;
  color: var(--ink);
}

.h1 .em { color: var(--blood); }
.hero-copy { margin: 32px 0 0; max-width: 42ch; color: var(--ink-2); font-size: 17.5px; line-height: 1.68; text-wrap: pretty; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 48px; }

.oracles {
  position: relative;
  margin-top: 42px;
  padding-top: 22px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 26px;
  align-items: center;
}

.oracles a {
  text-decoration: none;
  color: var(--ink);
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
  transition: border-color .3s var(--ease), color .3s var(--ease);
}

.oracles a:hover {
  border-color: var(--blood);
  color: var(--blood);
}

.rule-top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 3px;
  border-top: 1px solid var(--rule-strong);
  border-bottom: 1px solid var(--rule-soft);
}

/* ═══════════ LIVE TAPE ═══════════ */
.tape {
  position: relative;
  background: var(--plate);
  border: 1px solid var(--ink);
  border-radius: var(--r);
  overflow: hidden;
  box-shadow: var(--lift-lg);
}

.tape-head {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 15px 20px;
  border-bottom: 1px solid var(--rule);
  background: linear-gradient(180deg, #FFFEFB, #FBF8F2);
}

.pulse { position: relative; }
.pulse::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--win);
  animation: cl-ring 2.6s ease-out infinite;
}

@keyframes cl-ring {
  0% { transform: scale(.6); opacity: .85; }
  100% { transform: scale(2.4); opacity: 0; }
}

.tape-meters {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  border-bottom: 1px solid var(--rule);
}

.meter { padding: 17px 20px; }
.meter .mono { display: block; margin-bottom: 8px; }
.meter-val {
  font-family: var(--mono);
  font-size: 26px;
  font-variant-numeric: tabular-nums;
  letter-spacing: -.022em;
  font-weight: 500;
}

.meter-val.blood { color: var(--blood); }
.meter-val.win { color: var(--win); }
.meter-div { background: var(--rule); }

.tape-rows {
  position: relative;
  min-height: 150px;
}

.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13.5px 20px;
  border-bottom: 1px dotted var(--rule);
  overflow: hidden;
  transition: background .55s var(--ease), opacity .45s var(--ease), transform .45s var(--ease);
}

.row:last-child { border-bottom: 0; }
.row-main { min-width: 0; flex: 1; }

.row-goal {
  font-family: var(--display);
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -.014em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-src {
  margin-top: 3px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .09em;
  color: var(--ink-4);
}

.row-right { text-align: right; flex: none; }
.row-amt { font-family: var(--mono); font-size: 15px; font-variant-numeric: tabular-nums; font-weight: 500; }
.row-state {
  display: block;
  margin-top: 4px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-4);
  transition: opacity .2s ease;
}

.row.won { background: var(--win-wash); }
.row.lost { background: var(--blood-wash); }
.row.won .row-amt { color: var(--win); }
.row.lost .row-amt { color: var(--blood); }
.row.exiting { opacity: 0; transform: translateY(-10px); }
.row.settled .row-state { opacity: 0; }

.stamp {
  position: absolute;
  right: 86px;
  top: 50%;
  border: 2px solid currentColor;
  border-radius: 2px;
  padding: 4px 9px;
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: .16em;
  text-transform: uppercase;
  pointer-events: none;
  transform-origin: center;
  animation: cl-press .46s cubic-bezier(.18,.92,.24,1) forwards;
}

/* Static stamp: rendered at mount, not triggered by settleTop — skip animation */
.stamp.static {
  animation: none;
  opacity: .78;
  transform: translateY(-50%) rotate(-11deg) scale(1);
}

.stamp.won { color: var(--win); }
.stamp.lost { color: var(--blood); }

@keyframes cl-press {
  0% { transform: translateY(-50%) rotate(-15deg) scale(2.6); opacity: 0; }
  55% { opacity: .98; }
  80% { transform: translateY(-50%) rotate(-13deg) scale(.93); opacity: .88; }
  100% { transform: translateY(-50%) rotate(-11deg) scale(1); opacity: .78; }
}

.tape-foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid var(--rule);
  background: #FBF8F2;
}

/* ═══════════ MODES ═══════════ */
.modes {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, .8fr);
  gap: 36px;
  margin-top: 52px;
  align-items: stretch;
}

@media(max-width:1020px){
  .modes { grid-template-columns: 1fr; }
}

.plates {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  overflow: hidden;
}

.vrule { background: var(--rule); }

@media(max-width:720px){
  .plates { grid-template-columns: 1fr; }
  .vrule { height: 1px; }
}

.leaf { padding: 26px; display: flex; flex-direction: column; height: 100%; }

.leaf--dark {
  color: #F7EDEA;
  background-image: radial-gradient(120% 100% at 50% 0%, #8E2432 0%, #6E1723 100%);
}

.leaf--dark .mono { color: #DEBBC0; }
.leaf--dark .link { color: #FFF; }

.leaf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.leaf-form-ref {
  font-size: 10px;
  letter-spacing: .14em;
  opacity: .6;
}

.rivalry-subline {
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #DEBBC0;
  margin: -4px 0 14px;
}

.leaf-art {
  position: relative;
  border: 1px solid var(--rule);
  background: var(--paper);
  margin-bottom: 20px;
  overflow: hidden;
  height: 165px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--r) - 2px);
}

.leaf--dark .leaf-art {
  border-color: #96505D;
  background: #5E1420;
}

.leaf-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s var(--ease);
}

.leaf:hover .leaf-img {
  transform: scale(1.04);
}

.leaf-name {
  margin: 14px 0 16px;
  font-family: var(--display);
  font-size: 21px;
  font-weight: 700;
  line-height: 1.16;
  letter-spacing: -.028em;
}

.leaf-list {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
}

.leaf-list li {
  display: flex;
  gap: 11px;
  padding: 10px 0;
  border-bottom: 1px dotted var(--rule);
  font-size: 14.5px;
  color: var(--ink-2);
  line-height: 1.5;
}

.leaf--dark .leaf-list li {
  border-color: #96505D;
  color: #EEDADD;
}

.leaf-list li::before {
  content: "§";
  font-family: var(--mono);
  font-size: 11px;
  color: var(--blood);
  flex: none;
  padding-top: 2px;
  opacity: .8;
}

.leaf--dark .leaf-list li::before { color: #E5B4BC; }
.leaf .link { margin-top: auto !important; align-self: flex-start; }

/* ═══════════ SPECIMEN PANEL ═══════════ */
.demo {
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.demo-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.demo-center-block {
  text-align: center;
  margin-bottom: 16px;
}

.demo-you {
  font-family: var(--display);
  font-size: clamp(44px, 6vw, 72px);
  font-weight: 800;
  line-height: .88;
  letter-spacing: -.052em;
  text-transform: uppercase;
  color: var(--ink) !important;
  text-align: center;
}

.demo-vs {
  margin: 10px 0;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .52em;
  color: var(--blood);
  text-indent: .52em;
  text-align: center;
}

.demo-amt {
  margin: 18px 0 4px;
  font-family: var(--mono);
  font-size: 32px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--blood) !important;
  letter-spacing: -.02em;
  text-align: center;
}

.demo-sub {
  text-align: center;
  font-size: 11px;
  color: var(--ink-3);
}

.demo-ledger {
  margin-top: auto;
  padding: 18px 0 14px;
  border-top: 1px solid var(--rule);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-ledger .t-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11px;
  margin: 0;
}

.demo-ledger .t-row dt {
  color: var(--ink-3);
  font-weight: 400;
}

.demo-ledger .t-row .dots {
  flex: 1;
  border-bottom: 1px dotted var(--rule-strong);
}

.demo-ledger .t-row dd {
  margin: 0;
  font-weight: 500;
  color: var(--ink);
}

.demo-ledger .t-row dd.win {
  color: var(--win) !important;
  font-weight: 600;
}

.demo-ledger .t-row dd.blood {
  color: var(--blood) !important;
  font-weight: 600;
}

.demo-foot-bar {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--rule);
  text-align: center;
  font-size: 10px;
  letter-spacing: .14em;
  color: var(--ink-3);
}

/* Section 02 explicit overrides */
#modes .title {
  margin-bottom: 26px !important;
}

#modes .idx-mark {
  top: calc(var(--section-y) + 12px) !important;
}

/* ═══════════ CASE ═══════════ */
.argue {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.04fr);
  gap: 64px;
  align-items: start;
}

@media(max-width:1020px){
  .argue { grid-template-columns: 1fr; gap: 40px; }
}

.argue-note {
  margin: 32px 0 0;
  padding-top: 16px;
  border-top: 2px solid var(--ink);
}

.argue-note p {
  margin: 10px 0 0;
  font-family: var(--mono);
  font-size: 11.5px;
  line-height: 1.8;
  color: var(--ink-2);
}

.cmp { width: 100%; border-collapse: collapse; }
.cmp caption {
  caption-side: top;
  text-align: left;
  padding: 0 0 14px;
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.cmp th {
  text-align: left;
  padding: 14px 20px;
  border-bottom: 1px solid var(--ink);
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.cmp th:first-child { width: 58px; color: var(--ink-4); }

.cmp td {
  padding: 14px 20px;
  border-bottom: 1px dotted var(--rule);
  font-size: 15px;
  color: var(--ink-2);
}

.cmp td:first-child { font-family: var(--mono); font-size: 10px; letter-spacing: .14em; color: var(--ink-4); }

.void {
  color: var(--ink-3);
  text-decoration: line-through;
  text-decoration-color: var(--blood-mid);
  text-decoration-thickness: 1px;
}

.cmp tr:last-child td { border-bottom: 0; font-weight: 600; color: var(--ink); padding-block: 18px; }
.cmp tr:last-child .void { font-weight: 400; color: var(--ink-3); }
.won-txt { color: var(--win); }

/* ═══════════ ORACLE REGISTER ═══════════ */
.reg { width: 100%; border-collapse: collapse; margin-top: 44px; }
.reg caption {
  caption-side: top;
  text-align: left;
  padding: 0 0 14px;
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.reg th {
  text-align: left;
  padding: 15px 22px;
  border-bottom: 1px solid var(--ink);
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-2);
  white-space: nowrap;
}

.reg td { padding: 18px 22px; border-bottom: 1px dotted var(--rule); font-size: 14.5px; color: var(--ink-2); }
.reg tr:last-child td { border-bottom: 0; }
.reg tbody tr { transition: background .25s var(--ease); }
.reg tbody tr:hover { background: var(--paper-alt); }

.reg-name { display: flex; align-items: center; gap: 14px; }
.reg-mark {
  width: 34px;
  height: 34px;
  flex: none;
  border: 1px solid var(--rule-strong);
  display: grid;
  place-items: center;
  background: var(--paper);
  font-family: var(--display);
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
}

.reg-plat {
  font-family: var(--display);
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -.022em;
  white-space: nowrap;
}

.reg-num {
  font-family: var(--mono);
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  letter-spacing: .04em;
}

.reg-live {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--win);
}

@media(max-width:780px){
  .reg, .reg tbody, .reg tr, .reg td { display: block; width: auto; }
  .reg thead { display: none; }
  .reg tr { border-bottom: 1px solid var(--rule); padding: 10px 0; }
  .reg tr:last-child { border-bottom: 0; }
  .reg td { border-bottom: 0; padding: 7px 18px; display: flex; gap: 14px; align-items: baseline; }
  .reg td::before {
    content: attr(data-label);
    font-family: var(--mono);
    font-size: 9.5px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--ink-4);
    flex: none;
    min-width: 88px;
  }
  .reg td:first-child::before { display: none; }
}

/* ═══════════ RECEIPTS ═══════════ */
.receipts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(266px, 1fr));
  gap: 26px;
  margin-top: 48px;
}

.receipt {
  position: relative;
  background: var(--plate);
  border: 1px solid var(--rule);
  border-radius: var(--r);
  box-shadow: var(--lift);
  transition: transform .35s var(--ease), box-shadow .35s var(--ease), border-color .35s var(--ease);
}

.receipt:hover {
  transform: translateY(-5px);
  border-color: var(--rule-strong);
  box-shadow: 0 2px 4px rgba(14,20,32,.05), 0 30px 56px -30px rgba(14,20,32,.4);
}

.r-top { padding: 20px 22px 22px; }
.r-meta { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 15px; }

.r-goal {
  font-family: var(--display);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -.026em;
}

.r-src { margin-top: 6px; font-family: var(--mono); font-size: 10.5px; letter-spacing: .06em; color: var(--ink-4); }

.r-fields { margin-top: 17px; padding-top: 15px; border-top: 1px dotted var(--rule); }

.r-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 6px 0;
}

.r-row dt {
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-4);
  white-space: nowrap;
}

.r-row dd {
  font-family: var(--mono);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.perf {
  position: relative;
  border-top: 2px dashed var(--rule-strong);
  height: 0;
}

.perf::before, .perf::after {
  content: "";
  position: absolute;
  top: -12px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--notch);
  box-shadow: inset -1px 1px 2px rgba(14,20,32,.08);
}

.perf::before { left: -12px; }
.perf::after { right: -12px; }

.r-bottom { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 21px 22px; }
.r-bottom.won { background: var(--win-tint); }
.r-bottom.lost { background: var(--blood-tint); }

.r-amt {
  font-family: var(--mono);
  font-size: 24px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  letter-spacing: -.02em;
}

.won .r-amt { color: var(--win); }
.lost .r-amt { color: var(--blood); }

.r-note {
  margin-top: 6px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-4);
}

.r-stamp {
  flex: none;
  transform: rotate(-10deg);
  border: 2px solid currentColor;
  border-radius: 2px;
  padding: 5px 11px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .2em;
  text-transform: uppercase;
  opacity: .76;
}

.r-stamp.won { color: var(--win); }
.r-stamp.lost { color: var(--blood); }

.footing { margin-top: 64px; max-width: 740px; }

.f-row {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 13px 0;
  border-bottom: 1px dotted var(--rule);
}

.f-row dt {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-2);
}

.f-row dd {
  font-family: var(--mono);
  font-size: 20px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--blood);
  letter-spacing: -.02em;
}

.f-total {
  margin-top: 8px;
  padding-top: 17px;
  border-top: 2px solid var(--ink);
  border-bottom: 0;
}

.f-total dt { color: var(--ink); font-weight: 500; }
.f-total dd { font-size: 26px; }

/* ═══════════ COUNTERPARTY ═══════════ */
.cp {
  display: grid;
  grid-template-columns: 224px minmax(0, 1fr);
  gap: 52px;
  align-items: start;
  margin-top: 56px;
}

@media(max-width:840px){
  .cp { grid-template-columns: 1fr; gap: 32px; }
}

.cp-portrait { padding: 16px; }
.cp-cap { margin-top: 14px; padding-top: 12px; border-top: 1px dotted var(--rule); text-align: center; }

.cp-quote {
  font-family: var(--display);
  font-size: clamp(22px, 3vw, 33px);
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: -.03em;
  text-indent: -.44em;
  text-wrap: pretty;
}

.cp-quote em { font-style: normal; color: var(--blood); }

.cp-attrib {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  align-items: baseline;
  margin-top: 26px;
  padding-top: 16px;
  border-top: 2px solid var(--ink);
}

.cp-name { font-family: var(--display); font-size: 16px; font-weight: 700; letter-spacing: -.02em; }

.cp-receipt {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 24px;
  padding: 16px 18px;
  border: 1px solid var(--blood);
  border-radius: var(--r);
  background: var(--blood-tint);
}

.cp-receipt .amt {
  font-family: var(--mono);
  font-size: 20px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--blood);
  letter-spacing: -.02em;
}

.cp-stamp {
  margin-left: auto;
  transform: rotate(-8deg);
  border: 2px solid var(--blood);
  border-radius: 2px;
  padding: 3px 10px;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--blood);
  opacity: .76;
}

/* ═══════════ FORFEIT FLOW ═══════════ */
.flow-wrap { margin-top: 48px; overflow: hidden; }

.flow-head {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  justify-content: space-between;
  padding: 15px 22px;
  border-bottom: 1px solid var(--rule);
  background: #FBF8F2;
}

.flow-stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(120px, 1fr) minmax(0, 1fr);
}

@media(max-width:900px){
  .flow-stage { grid-template-columns: 1fr; }
}

.stage-col { padding: 30px 24px; }

.stage-mid {
  position: relative;
  border-inline: 1px dotted var(--rule);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}

@media(max-width:900px){
  .stage-mid {
    border-inline: 0;
    border-block: 1px dotted var(--rule);
    min-height: 120px;
  }
}

.loser {
  border: 1px solid var(--blood);
  border-radius: var(--r);
  padding: 20px;
  background: var(--blood-tint);
  margin-top: 14px;
}

.loser-amt {
  margin-top: 12px;
  font-family: var(--mono);
  font-size: 30px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--blood);
  line-height: 1;
  letter-spacing: -.024em;
}

.loser-goal { margin-top: 8px; font-size: 14px; color: var(--ink-2); }

.track { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }

.coin {
  position: absolute;
  top: 50%;
  left: -14px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1.5px solid var(--blood);
  background: var(--blood-tint);
  opacity: 0;
  box-shadow: 0 1px 3px rgba(122,28,41,.3);
}

.coin.go { animation: cl-travel 1.55s cubic-bezier(.5, 0, .5, 1) forwards; }

@keyframes cl-travel {
  0% { opacity: 0; transform: translate(0, -50%) scale(.5); }
  12% { opacity: 1; transform: translate(12%, -50%) scale(1); }
  88% { opacity: 1; }
  100% { opacity: 0; transform: translate(760%, -50%) scale(.5); }
}

@media(max-width:900px){
  .coin.go { animation-name: cl-travel-v; }
}

@keyframes cl-travel-v {
  0% { opacity: 0; transform: translate(0, -50%) scale(.5); }
  12% { opacity: 1; transform: translate(0, -20%) scale(1); }
  88% { opacity: 1; }
  100% { opacity: 0; transform: translate(0, 420%) scale(.5); }
}

.mid-label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--blood);
  text-align: center;
  padding: 0 10px;
  line-height: 1.9;
}

.pool {
  border: 1px solid var(--win);
  border-radius: var(--r);
  padding: 20px;
  background: var(--win-tint);
  margin-top: 14px;
}

.pool-amt {
  margin-top: 12px;
  font-family: var(--mono);
  font-size: 30px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--win);
  line-height: 1;
  letter-spacing: -.024em;
}

.pool-bar { height: 5px; background: #C9DED2; margin-top: 16px; overflow: hidden; }

.pool-bar i {
  display: block;
  height: 100%;
  width: 0;
  background: var(--win);
  transition: width 1.5s cubic-bezier(.28, .82, .3, 1);
}

.winners { margin-top: 20px; padding-top: 16px; border-top: 1px dotted var(--rule); }

.winner {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 0;
  font-family: var(--mono);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  opacity: .22;
  transition: opacity .6s var(--ease);
}

.winner.paid { opacity: 1; }
.winner .amt { margin-left: auto; color: var(--win); }

.flow-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  align-items: center;
  padding: 15px 22px;
  border-top: 1px solid var(--rule);
  background: #FBF8F2;
}

.replay {
  margin-left: auto;
  background: none;
  border: 1px solid var(--rule-strong);
  border-radius: var(--r);
  padding: 9px 16px;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-2);
  transition: border-color .3s var(--ease), color .3s var(--ease);
}

.replay:hover { border-color: var(--ink); color: var(--ink); }

.sch { margin-top: 36px; padding: clamp(18px, 2.8vw, 32px); }

.sch-head, .sch-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 26px;
  justify-content: space-between;
}

.sch-head { padding-bottom: 15px; margin-bottom: 24px; border-bottom: 1px solid var(--rule); }
.sch-foot { padding-top: 17px; margin-top: 20px; border-top: 1px solid var(--rule); }

.legend {
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--ink-2);
}

.swatch { width: 24px; height: 0; border-top: 2px solid currentColor; flex: none; }
.swatch.dash { border-top-style: dashed; }

.sch-mobile { display: none; }
@media(max-width:780px){
  .sch svg { display: none; }
  .sch-mobile { display: block; }
  .sch-foot .legend:last-child { margin-left: 0; }
}

.sm-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px dotted var(--rule);
}

.sm-row:last-child { border-bottom: 0; }
.sm-row dt {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-4);
  white-space: nowrap;
}

.sm-row dd { font-family: var(--mono); font-size: 14px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.sm-row.win dd { color: var(--win); }
.sm-row.blood dd { color: var(--blood); }

/* ═══════════ CALCULATOR ═══════════ */
.calc {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.04fr);
  margin-top: 48px;
  overflow: hidden;
}

@media(max-width:940px){
  .calc { grid-template-columns: 1fr; }
}

.calc-left { padding: 32px; border-right: 1px solid var(--rule); background: #FCFAF5; }

@media(max-width:940px){
  .calc-left { border-right: 0; border-bottom: 1px solid var(--rule); }
}

.field { margin-top: 30px; }
.field-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 14px;
}

.field-val {
  font-family: var(--mono);
  font-size: 28px;
  font-variant-numeric: tabular-nums;
  color: var(--blood);
  font-weight: 500;
  letter-spacing: -.024em;
}

.cl-root input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 24px;
  background: transparent;
  cursor: pointer;
  margin: 0;
}

.cl-root input[type=range]::-webkit-slider-runnable-track { height: 2px; background: var(--rule-strong); }
.cl-root input[type=range]::-moz-range-track { height: 2px; background: var(--rule-strong); }
.cl-root input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--blood);
  margin-top: -8px;
  border: 2px solid var(--plate);
  box-shadow: 0 2px 8px -2px rgba(122,28,41,.7);
}
.cl-root input[type=range]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--blood);
  border: 2px solid var(--plate);
  box-shadow: 0 2px 8px -2px rgba(122,28,41,.7);
}

.scale { display: flex; justify-content: space-between; margin-top: 9px; }

.seg {
  display: flex;
  border: 1px solid var(--rule-strong);
  border-radius: var(--r);
  overflow: hidden;
}

.seg button {
  flex: 1;
  padding: 14px 8px;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-2);
  border-right: 1px solid var(--rule);
  transition: background .28s var(--ease), color .28s var(--ease);
}

.seg button:last-child { border-right: 0; }
.seg button:hover { background: var(--paper-alt); }
.seg button[aria-pressed="true"] { background: var(--ink); color: var(--paper); }

.calc-right { padding: 32px; display: flex; flex-direction: column; }

.outcomes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--rule-strong);
  border-radius: var(--r);
  overflow: hidden;
  margin-top: 18px;
}

.outcome { padding: 26px 22px; }
.outcome:first-child { border-right: 1px solid var(--rule-strong); background: var(--win-tint); }
.outcome:last-child { background: var(--blood-tint); }

.outcome-val {
  margin-top: 10px;
  font-family: var(--mono);
  font-size: clamp(26px, 3.4vw, 37px);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -.032em;
}

.outcome:first-child .outcome-val { color: var(--win); }
.outcome:last-child .outcome-val { color: var(--blood); }

.outcome-note {
  margin-top: 10px;
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--ink-4);
}

.terms { margin-top: 24px; padding-top: 18px; border-top: 2px solid var(--ink); }

.t-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dotted var(--rule);
}

.t-row:last-child { border-bottom: 0; }
.t-row dt {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--ink-4);
  white-space: nowrap;
}

.t-row dd { font-family: var(--mono); font-size: 13px; font-variant-numeric: tabular-nums; white-space: nowrap; }

.calc-cta { margin-top: auto; padding-top: 24px; }
.calc-cta .btn { width: 100%; }

.tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(244px, 1fr));
  gap: 22px;
  margin-top: 34px;
}

.tier {
  position: relative;
  background: var(--plate);
  border: 1px solid var(--rule);
  border-radius: var(--r);
  padding: 26px 24px;
  cursor: pointer;
  box-shadow: var(--lift);
  text-align: left;
  font: inherit;
  width: 100%;
  transition: border-color .32s var(--ease), background .32s var(--ease),
    transform .32s var(--ease), box-shadow .32s var(--ease);
}

.tier:hover { transform: translateY(-3px); border-color: var(--rule-strong); }
.tier[data-active="true"] {
  border-color: var(--blood);
  background: var(--blood-wash);
  box-shadow: 0 2px 4px rgba(122,28,41,.06), 0 26px 50px -30px rgba(122,28,41,.5);
}

.tier-tab {
  position: absolute;
  top: -10px;
  left: 24px;
  background: var(--blood);
  color: #FFF8F5;
  padding: 5px 13px;
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: .2em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity .32s var(--ease), transform .32s var(--ease);
}

.tier[data-active="true"] .tier-tab { opacity: 1; transform: none; }

.tier-mult {
  margin: 10px 0 6px;
  font-family: var(--display);
  font-size: 48px;
  font-weight: 700;
  line-height: .9;
  letter-spacing: -.055em;
  color: var(--blood);
}

.tier-mult small { font-size: .4em; font-weight: 500; }

.tier-rows { margin-top: 20px; padding-top: 16px; border-top: 2px solid var(--ink); }

/* ═══════════ DUELS ═══════════ */
.duels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(304px, 1fr));
  gap: 22px;
  margin-top: 44px;
}

.duel {
  display: block;
  width: 100%;
  text-align: left;
  cursor: pointer;
  background: var(--plate);
  border: 1px solid var(--rule);
  border-radius: var(--r);
  padding: 20px 22px;
  font: inherit;
  box-shadow: var(--lift);
  transition: transform .32s var(--ease), border-color .32s var(--ease), box-shadow .32s var(--ease);
}

.duel:hover {
  transform: translateY(-4px);
  border-color: var(--ink);
  box-shadow: 0 2px 4px rgba(14,20,32,.05), 0 30px 56px -30px rgba(14,20,32,.42);
}

.duel:hover .duel-cta { color: var(--blood); }
.duel:hover .duel-cta span { transform: translateX(4px); }

.duel-head { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }

.duel-badge {
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 20px;
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.badge-live { background: var(--win-tint); color: var(--win); }
.badge-settle { background: var(--blood-tint); color: var(--blood); }

.duel-vs { display: flex; align-items: flex-end; gap: 14px; margin-bottom: 14px; }
.duel-side { flex: 1; min-width: 0; }
.duel-side.r { text-align: right; }
.duel-handle { font-family: var(--mono); font-size: 12.5px; letter-spacing: .03em; }

.duel-delta {
  margin-top: 5px;
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -.026em;
}

.lead { color: var(--win); }
.trail { color: var(--blood); }

.duel-mid { font-family: var(--mono); font-size: 9px; letter-spacing: .22em; color: var(--ink-4); padding-bottom: 5px; }

.bar { display: flex; height: 4px; overflow: hidden; background: var(--paper-deep); }
.bar .a { background: var(--win); }
.bar .g { width: 2px; background: var(--plate); flex: none; }
.bar .b { flex: 1; background: var(--blood); }

.duel-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dotted var(--rule);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .06em;
}

.duel-cta {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-2);
  transition: color .3s var(--ease);
}

.duel-cta span { transition: transform .3s var(--ease); }

/* ═══════════ SIGNATURE ═══════════ */
.sign { padding: clamp(32px, 5vw, 68px); text-align: center; }

.sign-title {
  margin: 26px 0 14px;
  font-family: var(--display);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -.036em;
  text-wrap: balance;
}

.sign-copy { margin: 0 auto 34px; max-width: 45ch; color: var(--ink-2); font-size: 17px; }

.sign-lines {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 36px;
  max-width: 640px;
  margin: 48px auto 0;
  text-align: left;
}

.sign-line { border-top: 1px solid var(--ink); padding-top: 11px; }

.sign-script {
  margin-bottom: 9px;
  min-height: 28px;
  font-family: var(--display);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: .02em;
}

.disclosure {
  max-width: 74ch;
  margin: 46px auto 0;
  font-family: var(--mono);
  font-size: 10px;
  line-height: 1.9;
  color: var(--ink-4);
  text-align: left;
  letter-spacing: .02em;
}

/* ═══════════ MARGINALIA ═══════════ */
.marg { display: flex; gap: 16px; align-items: flex-start; max-width: 660px; margin: 0; }
.marg-mark {
  font-family: var(--mono);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: .18em;
  color: var(--blood);
  white-space: nowrap;
  padding-top: 4px;
  flex: none;
}

.marg p { font-family: var(--mono); font-size: 11.5px; line-height: 1.85; color: var(--ink-2); }
.marg-strip { border-top: 1px solid var(--rule-strong); border-bottom: 1px solid var(--rule-strong); padding-block: 22px; }

/* ═══════════ FIRST PAINT ═══════════ */
@keyframes cl-rise { to { opacity: 1; transform: none; } }
@keyframes cl-draw { to { transform: scaleX(1); } }
@keyframes cl-seat { to { opacity: 1; transform: none; } }
@keyframes cl-strike {
  0% { opacity: 0; transform: rotate(-9deg) scale(2); }
  60% { opacity: 1; }
  100% { opacity: 1; transform: rotate(0) scale(1); }
}

.js-load .rise {
  opacity: 0;
  transform: translateY(16px);
  animation: cl-rise .72s var(--ease) forwards;
  animation-delay: var(--d, 0ms);
}

.js-load .draw {
  transform: scaleX(0);
  transform-origin: left;
  animation: cl-draw .78s var(--ease) forwards;
  animation-delay: var(--d, 0ms);
}

.js-load .seat {
  opacity: 0;
  transform: translateY(24px) scale(.985);
  animation: cl-seat .88s var(--ease) forwards;
  animation-delay: var(--d, 0ms);
}

.strike { animation: cl-strike .52s cubic-bezier(.18,.92,.24,1) forwards; }

/* ═══════════ MOBILE ═══════════ */
@media(max-width:580px){
  .h1 { font-size: clamp(34px, 10.5vw, 50px); }
  .row { padding: 14px 15px; gap: 11px; }
  .row-goal {
    font-size: 13.5px;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .row-amt { font-size: 13.5px; }
  .tape-rows { min-height: 0; }
  .meter-val { font-size: 21px; }
  .stamp { right: 11px; font-size: 10px; padding: 4px 8px; }
  .outcomes { grid-template-columns: 1fr; }
  .outcome:first-child { border-right: 0; border-bottom: 1px solid var(--rule-strong); }
  .calc-left, .calc-right { padding: 22px; }
  .demo { padding: 28px 20px; }
  .cp-quote { text-indent: 0; }
  .sign-lines { gap: 26px; }
  .stage-col { padding: 24px 18px; }
}

@media(prefers-reduced-motion:reduce){
  .cl-root * { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  .js-load .rise, .js-load .draw, .js-load .seat {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
  .pulse::after { opacity: 0; }
  .stamp { transform: translateY(-50%) rotate(-11deg); opacity: .78; }
  .coin { display: none; }
}
`;

export default landingCSS;