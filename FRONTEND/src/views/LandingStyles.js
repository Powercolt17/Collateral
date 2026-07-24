// Landing CSS — Collateral Document System & Interactive Engine
export const landingCSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --paper: #F8F6F1;
  --paper-alt: #F2EEE7;
  --plate: #FFFFFF;
  --notch: #F8F6F1;
  --ink: #131A2B;
  --ink-2: #565E70;
  --ink-3: #6C7280;
  --blood: #7B1E2B;
  --blood-deep: #5C1420;
  --blood-tint: #F6E9EB;
  --win: #1A7A52;
  --win-tint: #E9F3ED;
  --rule: #DED8CC;
  --rule-strong: #C7C0B2;
  --display: "Archivo", system-ui, sans-serif;
  --wordmark: "Archivo", system-ui, sans-serif;
  --body: "Public Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --shell: 1220px;
  --gutter: 26px;
  --section-y: 112px;
  --r: 3px;
}

@media(max-width:860px){
  :root { --section-y: 74px; --gutter: 18px }
}

.lp {
  min-height: 100vh;
  background: var(--paper) !important;
  color: var(--ink);
  font-family: var(--body);
  font-size: 17px;
  line-height: 1.62;
  -webkit-font-smoothing: antialiased;
  opacity: 1;
}

.lp *, .lp *::before, .lp *::after {
  box-sizing: border-box;
}

.shell {
  max-width: var(--shell);
  margin: 0 auto;
  padding-inline: var(--gutter);
}

.section {
  padding-block: var(--section-y);
}

.alt {
  background: var(--paper-alt);
  --notch: #F2EEE7;
}

.mono {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.mono-b {
  color: var(--blood);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--win);
  flex: none;
}

.dots {
  flex: 1;
  border-bottom: 1px dotted var(--rule);
  transform: translateY(-3px);
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: var(--blood);
}

.eyebrow::before {
  content: "";
  width: 22px;
  height: 1px;
  background: currentColor;
  flex: none;
}

.eyebrow--live {
  color: var(--ink-2);
}

.eyebrow--live::before {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--win);
}

.eyebrow--c {
  justify-content: center;
}

h2.title {
  margin: 0 0 13px;
  font-family: var(--display);
  font-size: clamp(29px, 3.8vw, 43px);
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: -.022em;
  max-width: 18ch;
}

.title--c {
  max-width: 22ch;
  margin-inline: auto;
  text-align: center;
}

.lede {
  margin: 0;
  color: var(--ink-2);
  max-width: 56ch;
}

.lede--c {
  margin-inline: auto;
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 52px;
  padding: 0 28px;
  border: 1px solid transparent;
  border-radius: var(--r);
  font-family: var(--body);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: .11em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background .16s, color .16s, border-color .16s;
}

.btn-fill {
  background: var(--blood);
  color: #fff !important;
}

.btn-fill:hover {
  background: var(--blood-deep);
}

.btn-out {
  background: transparent;
  border-color: var(--ink);
  color: var(--ink) !important;
}

.btn-out:hover {
  background: var(--ink);
  color: var(--paper) !important;
}

.link {
  font-size: 14px;
  font-weight: 600;
  color: var(--blood);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  padding-bottom: 2px;
}

.link:hover {
  color: var(--blood-deep);
}

:where(a, button, input, [tabindex]):focus-visible {
  outline: 2px solid var(--blood);
  outline-offset: 3px;
}

/* Nav */
.nav {
  position: sticky;
  top: 0;
  z-index: 60;
  background: var(--paper);
  border-bottom: 1px solid var(--rule);
}

.nav-in {
  max-width: var(--shell);
  margin: 0 auto;
  padding: 0 var(--gutter);
  height: 68px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.wordmark {
  font-family: var(--wordmark);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--ink);
}

.nav-tape {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 26px;
  padding-left: 26px;
  border-left: 1px solid var(--rule);
}

.nav-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn {
  min-height: 38px;
  padding: 0 18px;
  font-size: 11px;
}

/* 1 · Hero & Live Tape */
.hero {
  padding-block: 66px 88px;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 56px;
  align-items: center;
}

@media(max-width:1000px){
  .hero-grid { grid-template-columns: 1fr; gap: 44px; }
  .hero { padding-block: 44px 64px; }
}

h1.hero-title {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(42px, 6.2vw, 76px);
  font-weight: 700;
  line-height: .95;
  letter-spacing: -.035em;
  text-transform: uppercase;
  color: var(--ink);
}

h1.hero-title .em {
  color: var(--blood);
}

.hero-copy {
  margin: 26px 0 0;
  max-width: 48ch;
  color: var(--ink-2);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  margin-top: 32px;
}

.oracles {
  position: relative;
  margin-top: 34px;
  padding-top: 18px;
  border-top: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
  align-items: center;
}

.tape {
  background: var(--plate);
  border: 1px solid var(--ink);
  border-radius: var(--r);
  overflow: hidden;
  box-shadow: 0 22px 54px -30px rgba(19, 26, 43, .28);
}

.tape-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--rule);
}

.pulse {
  position: relative;
}

.pulse::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--win);
  animation: ring 2.4s ease-out infinite;
}

@keyframes ring {
  0% { transform: scale(.6); opacity: .9; }
  100% { transform: scale(2.1); opacity: 0; }
}

.tape-meters {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  border-bottom: 1px solid var(--rule);
}

.meter {
  padding: 14px 18px;
}

.meter .mono {
  display: block;
  margin-bottom: 6px;
}

.meter-val {
  font-family: var(--mono);
  font-size: 24px;
  font-variant-numeric: tabular-nums;
  letter-spacing: -.01em;
}

.meter-val.blood { color: var(--blood); }
.meter-val.win { color: var(--win); }
.meter-div { background: var(--rule); }

.tape-rows {
  position: relative;
  min-height: 296px;
}

.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 18px;
  border-bottom: 1px dotted var(--rule);
  overflow: hidden;
  transition: background .5s ease, opacity .45s ease, transform .45s ease;
}

.row:last-child {
  border-bottom: 0;
}

.row-main {
  min-width: 0;
  flex: 1;
}

.row-goal {
  margin: 0;
  font-family: var(--display);
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-src {
  margin: 2px 0 0;
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--ink-3);
}

.row-right {
  text-align: right;
  flex: none;
}

.row-amt {
  font-family: var(--mono);
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}

.row-state {
  display: block;
  margin-top: 3px;
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.bar-mini {
  height: 3px;
  border-radius: 2px;
  background: var(--paper-alt);
  margin-top: 7px;
  overflow: hidden;
}

.bar-mini i {
  display: block;
  height: 100%;
  background: var(--ink-3);
  transition: width .9s linear;
}

.row.won { background: var(--win-tint); }
.row.lost { background: var(--blood-tint); }
.row.won .row-amt { color: var(--win); }
.row.lost .row-amt { color: var(--blood); }
.row.won .bar-mini i { background: var(--win); }
.row.lost .bar-mini i { background: var(--blood); }
.row.exiting { opacity: 0; transform: translateY(-8px); }
.row.settled .row-right { opacity: 0; transition: opacity .18s; }

.stamp {
  position: absolute;
  right: 16px;
  top: 50%;
  border: 2px solid currentColor;
  border-radius: 3px;
  padding: 4px 9px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .15em;
  text-transform: uppercase;
  pointer-events: none;
  transform-origin: center;
  animation: press .42s cubic-bezier(.2,.9,.25,1) forwards;
}

.stamp.won { color: var(--win); }
.stamp.lost { color: var(--blood); }

@keyframes press {
  0% { transform: translateY(-50%) rotate(-13deg) scale(2.4); opacity: 0; }
  55% { opacity: .95; }
  80% { transform: translateY(-50%) rotate(-13deg) scale(.94); opacity: .85; }
  100% { transform: translateY(-50%) rotate(-11deg) scale(1); opacity: .76; }
}

.tape-foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 18px;
  border-top: 1px solid var(--rule);
}

/* 2 · Modes */
.modes {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, .82fr);
  gap: 38px;
  margin-top: 42px;
  align-items: start;
}

@media(max-width:980px){
  .modes { grid-template-columns: 1fr; }
}

.plates {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  border: 1px solid var(--ink);
  border-radius: var(--r);
  background: var(--plate);
  overflow: hidden;
}

.vrule { background: var(--rule); }

@media(max-width:700px){
  .plates { grid-template-columns: 1fr; }
  .vrule { height: 1px; }
}

.leaf { padding: 22px; }

.leaf--dark {
  background: var(--blood);
  color: #F6EEEA;
}

.leaf--dark .mono { color: #DFBFC5; }
.leaf--dark .link { color: #fff; }

.leaf-art {
  border: 1px solid var(--rule);
  border-radius: var(--r);
  background: var(--paper);
  margin-bottom: 20px;
}

.leaf--dark .leaf-art {
  border-color: #94505C;
  background: #6B1725;
}

.leaf-name {
  margin: 11px 0 14px;
  font-family: var(--display);
  font-size: 22px;
  font-weight: 600;
  line-height: 1.16;
  letter-spacing: -.015em;
}

.leaf-list {
  list-style: none;
  margin: 0 0 20px;
  padding: 0;
}

.leaf-list li {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dotted var(--rule);
  font-size: 14.5px;
  color: var(--ink-2);
}

.leaf--dark .leaf-list li {
  border-color: #94505C;
  color: #F0DDE0;
}

.leaf-list li::before {
  content: "§";
  font-family: var(--mono);
  font-size: 11px;
  color: var(--blood);
  flex: none;
  padding-top: 2px;
}

.leaf--dark .leaf-list li::before { color: #E8B9C0; }

.demo {
  border: 1px solid var(--rule);
  border-radius: var(--r);
  background: var(--plate);
  padding: 32px 26px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.demo-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.demo-you {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(44px, 6.6vw, 72px);
  font-weight: 700;
  line-height: .92;
  letter-spacing: -.04em;
  text-transform: uppercase;
}

.demo-vs {
  margin: 9px 0;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .4em;
  color: var(--blood);
}

.demo-amt {
  margin: 20px 0 4px;
  font-family: var(--mono);
  font-size: 30px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--blood);
}

.demo-foot {
  margin: 20px 0 0;
  padding-top: 15px;
  border-top: 1px dotted var(--rule);
  font-size: 14px;
  color: var(--ink-2);
}

/* 3 · Case */
.argue {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.06fr);
  gap: 58px;
  align-items: start;
}

@media(max-width:980px){
  .argue { grid-template-columns: 1fr; gap: 36px; }
}

.argue-note {
  margin: 26px 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--ink);
}

.argue-note p {
  margin: 8px 0 0;
  font-family: var(--mono);
  font-size: 11.5px;
  line-height: 1.75;
  color: var(--ink-2);
}

.cmp {
  width: 100%;
  border-collapse: collapse;
  background: var(--plate);
  border: 1px solid var(--rule);
  border-radius: var(--r);
}

.cmp caption {
  caption-side: top;
  text-align: left;
  padding: 0 0 12px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.cmp th {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ink);
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.cmp th:first-child { width: 54px; color: var(--ink-3); }

.cmp td {
  padding: 12px 16px;
  border-bottom: 1px dotted var(--rule);
  font-size: 15px;
}

.cmp td:first-child { font-family: var(--mono); font-size: 10.5px; color: var(--ink-3); }

.void {
  color: var(--ink-2);
  text-decoration: line-through;
  text-decoration-color: var(--blood);
  text-decoration-thickness: 1px;
}

.cmp tr:last-child td { border-bottom: 0; font-weight: 600; }
.cmp tr:last-child .void { font-weight: 400; }
.won-txt { color: var(--win); }

/* 3b · Oracle Register */
.reg {
  width: 100%;
  border-collapse: collapse;
  background: var(--plate);
  border: 1px solid var(--ink);
  border-radius: var(--r);
  margin-top: 40px;
}

.reg caption {
  caption-side: top;
  text-align: left;
  padding: 0 0 12px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.reg th {
  text-align: left;
  padding: 13px 18px;
  border-bottom: 1px solid var(--ink);
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink-2);
  white-space: nowrap;
}

.reg td {
  padding: 15px 18px;
  border-bottom: 1px dotted var(--rule);
  font-size: 14.5px;
  color: var(--ink-2);
}

.reg tr:last-child td { border-bottom: 0; }
.reg tbody tr { transition: background .15s; }
.reg tbody tr:hover { background: var(--paper-alt); }

.reg-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reg-mark {
  width: 30px;
  height: 30px;
  flex: none;
  border: 1px solid var(--rule);
  border-radius: var(--r);
  display: grid;
  place-items: center;
  background: var(--paper);
  font-family: var(--display);
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}

.reg-plat {
  font-family: var(--display);
  font-size: 15.5px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -.01em;
  white-space: nowrap;
}

.reg-num {
  font-family: var(--mono);
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.reg-live {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--win);
}

@media(max-width:760px){
  .reg, .reg tbody, .reg tr, .reg td { display: block; width: auto; }
  .reg thead { display: none; }
  .reg tr { border-bottom: 1px solid var(--rule); padding: 6px 0; }
  .reg tr:last-child { border-bottom: 0; }
  .reg td { border-bottom: 0; padding: 6px 16px; display: flex; gap: 12px; align-items: baseline; }
  .reg td::before {
    content: attr(data-label);
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--ink-3);
    flex: none;
    min-width: 84px;
  }
  .reg td:first-child::before { display: none; }
}

.marg {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  max-width: 640px;
  margin: 0;
}

.marg-mark {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .14em;
  color: var(--blood);
  white-space: nowrap;
  padding-top: 3px;
  flex: none;
}

.marg p {
  margin: 0;
  font-family: var(--mono);
  font-size: 11.5px;
  line-height: 1.75;
  color: var(--ink-2);
}

.marg-strip {
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  padding-block: 20px;
  margin-block: 0;
}

/* 4 · Receipts & Counterparty */
.receipts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(262px, 1fr));
  gap: 24px;
  margin-top: 42px;
}

.receipt {
  background: var(--plate);
  border: 1px solid var(--rule);
  border-radius: var(--r);
  transition: transform .18s ease, border-color .18s ease;
}

.receipt:hover {
  transform: translateY(-3px);
  border-color: var(--rule-strong);
}

.r-top { padding: 18px 20px 20px; }
.r-meta { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 13px; }

.r-goal {
  margin: 0 0 4px;
  font-family: var(--display);
  font-size: 17.5px;
  font-weight: 600;
  line-height: 1.24;
  letter-spacing: -.012em;
}

.r-src { margin: 0; font-family: var(--mono); font-size: 11px; color: var(--ink-3); }

.r-fields {
  margin: 15px 0 0;
  padding-top: 13px;
  border-top: 1px dotted var(--rule);
}

.r-row {
  display: flex;
  align-items: baseline;
  gap: 9px;
  padding: 5px 0;
}

.r-row dt {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
  white-space: nowrap;
}

.r-row dd {
  margin: 0;
  font-family: var(--mono);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.perf {
  position: relative;
  border-top: 2px dashed var(--rule);
  height: 0;
}

.perf::before, .perf::after {
  content: "";
  position: absolute;
  top: -11px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--notch);
}

.perf::before { left: -11px; }
.perf::after { right: -11px; }

.r-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 19px 20px;
}

.r-bottom.won { background: var(--win-tint); }
.r-bottom.lost { background: var(--blood-tint); }

.r-amt {
  margin: 0;
  font-family: var(--mono);
  font-size: 23px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.won .r-amt { color: var(--win); }
.lost .r-amt { color: var(--blood); }

.r-note {
  margin: 4px 0 0;
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.r-stamp {
  flex: none;
  transform: rotate(-10deg);
  border: 2px solid currentColor;
  border-radius: 3px;
  padding: 5px 10px;
  font-family: var(--mono);
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: .15em;
  text-transform: uppercase;
  opacity: .74;
}

.r-stamp.won { color: var(--win); }
.r-stamp.lost { color: var(--blood); }

.footing {
  margin-top: 54px;
  max-width: 720px;
}

.f-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dotted var(--rule);
}

.f-row dt {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink-2);
}

.f-row dd {
  margin: 0;
  font-family: var(--mono);
  font-size: 19px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--blood);
}

.f-total {
  margin-top: 6px;
  padding-top: 15px;
  border-top: 1px solid var(--ink);
  border-bottom: 0;
}

.f-total dt { color: var(--ink); font-weight: 500; }
.f-total dd { font-size: 24px; }

.cp {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 44px;
  align-items: start;
  margin-top: 42px;
}

@media(max-width:820px){
  .cp { grid-template-columns: 1fr; gap: 28px; }
}

.cp-portrait {
  border: 1px solid var(--ink);
  border-radius: var(--r);
  background: var(--plate);
  padding: 14px;
}

.cp-cap {
  margin: 12px 0 0;
  padding-top: 10px;
  border-top: 1px dotted var(--rule);
  text-align: center;
}

.cp-quote {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(22px, 2.9vw, 31px);
  font-weight: 600;
  line-height: 1.24;
  letter-spacing: -.022em;
  text-indent: -.42em;
}

.cp-quote em {
  font-style: normal;
  color: var(--blood);
}

.cp-attrib {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: baseline;
  margin-top: 22px;
  padding-top: 14px;
  border-top: 1px solid var(--ink);
}

.cp-name {
  font-family: var(--display);
  font-size: 16px;
  font-weight: 600;
}

.cp-receipt {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 18px;
  margin-top: 22px;
  padding: 14px 16px;
  border: 1px solid var(--blood);
  border-radius: var(--r);
  background: var(--blood-tint);
}

.cp-receipt .amt {
  font-family: var(--mono);
  font-size: 19px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--blood);
}

.cp-stamp {
  margin-left: auto;
  transform: rotate(-8deg);
  border: 2px solid var(--blood);
  border-radius: 3px;
  padding: 3px 9px;
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--blood);
  opacity: .74;
}

/* 5 · Forfeit Flow & Schematic */
.flow-wrap {
  margin-top: 42px;
  border: 1px solid var(--ink);
  border-radius: var(--r);
  background: var(--plate);
  overflow: hidden;
}

.flow-head {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 22px;
  justify-content: space-between;
  padding: 13px 20px;
  border-bottom: 1px solid var(--rule);
}

.flow-stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(120px, 1.05fr) minmax(0, 1fr);
}

@media(max-width:880px){
  .flow-stage { grid-template-columns: 1fr; }
}

.stage-col { padding: 26px 22px; }

.stage-mid {
  position: relative;
  border-inline: 1px dotted var(--rule);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 210px;
}

@media(max-width:880px){
  .stage-mid {
    border-inline: 0;
    border-block: 1px dotted var(--rule);
    min-height: 110px;
  }
}

.loser {
  border: 1px solid var(--blood);
  border-radius: var(--r);
  padding: 18px;
  background: var(--blood-tint);
  margin-top: 12px;
}

.loser-amt {
  margin: 10px 0 0;
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--blood);
  line-height: 1;
}

.loser-goal { margin: 6px 0 0; font-size: 14px; color: var(--ink-2); }

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
}

.coin.go { animation: travel 1.5s cubic-bezier(.5, 0, .5, 1) forwards; }

@keyframes travel {
  0% { opacity: 0; transform: translate(0, -50%) scale(.5); }
  12% { opacity: 1; transform: translate(12%, -50%) scale(1); }
  88% { opacity: 1; }
  100% { opacity: 0; transform: translate(760%, -50%) scale(.5); }
}

@keyframes travel-v {
  0% { opacity: 0; transform: translate(0, -50%) scale(.5); }
  12% { opacity: 1; transform: translate(0, -20%) scale(1); }
  88% { opacity: 1; }
  100% { opacity: 0; transform: translate(0, 420%) scale(.5); }
}

@media(max-width:880px){
  .coin.go { animation-name: travel-v; }
}

.mid-label {
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--blood);
  text-align: center;
  padding: 0 8px;
}

.pool {
  border: 1px solid var(--win);
  border-radius: var(--r);
  padding: 18px;
  background: var(--win-tint);
  margin-top: 12px;
}

.pool-amt {
  margin: 10px 0 0;
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--win);
  line-height: 1;
}

.pool-bar {
  height: 6px;
  border-radius: 3px;
  background: #CFE4D8;
  margin-top: 14px;
  overflow: hidden;
}

.pool-bar i {
  display: block;
  height: 100%;
  width: 0;
  background: var(--win);
  transition: width 1.4s cubic-bezier(.3, .8, .3, 1);
}

.winners { margin: 18px 0 0; padding-top: 14px; border-top: 1px dotted var(--rule); }

.winner {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 7px 0;
  font-family: var(--mono);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  opacity: .25;
  transition: opacity .5s ease;
}

.winner.paid { opacity: 1; }
.winner .amt { margin-left: auto; color: var(--win); }

.flow-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  align-items: center;
  padding: 13px 20px;
  border-top: 1px solid var(--rule);
}

.replay {
  margin-left: auto;
  background: none;
  border: 1px solid var(--rule);
  border-radius: var(--r);
  padding: 8px 14px;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink-2);
}

.replay:hover { border-color: var(--ink); color: var(--ink); }

.sch {
  margin-top: 34px;
  border: 1px solid var(--rule);
  border-radius: var(--r);
  background: var(--plate);
  padding: clamp(16px, 2.6vw, 28px);
}

.sch-head, .sch-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  justify-content: space-between;
}

.sch-head { padding-bottom: 13px; margin-bottom: 20px; border-bottom: 1px solid var(--rule); }
.sch-foot { padding-top: 15px; margin-top: 18px; border-top: 1px solid var(--rule); }

.legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-2);
}

.swatch { width: 22px; height: 0; border-top: 2px solid currentColor; flex: none; }
.swatch.dash { border-top-style: dashed; }

.sch-mobile { display: none; }
@media(max-width:760px){
  .sch svg { display: none; }
  .sch-mobile { display: block; }
  .sch-foot .legend:last-child { margin-left: 0; }
}

.sm-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px dotted var(--rule);
}

.sm-row:last-child { border-bottom: 0; }
.sm-row dt {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
  white-space: nowrap;
}

.sm-row dd {
  margin: 0;
  font-family: var(--mono);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.sm-row.win dd { color: var(--win); }
.sm-row.blood dd { color: var(--blood); }

/* 6 · Calculator & Tiers */
.calc {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  border: 1px solid var(--ink);
  border-radius: var(--r);
  background: var(--plate);
  margin-top: 42px;
  overflow: hidden;
}

@media(max-width:900px){
  .calc { grid-template-columns: 1fr; }
}

.calc-left { padding: 28px; border-right: 1px solid var(--rule); }
@media(max-width:900px){
  .calc-left { border-right: 0; border-bottom: 1px solid var(--rule); }
}

.field { margin-top: 24px; }
.field-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}

.field-val {
  font-family: var(--mono);
  font-size: 26px;
  font-variant-numeric: tabular-nums;
  color: var(--blood);
}

input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 22px;
  background: transparent;
  cursor: pointer;
  margin: 0;
}

input[type=range]::-webkit-slider-runnable-track { height: 2px; background: var(--rule-strong); }
input[type=range]::-moz-range-track { height: 2px; background: var(--rule-strong); }
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--blood);
  margin-top: -7px;
  border: 2px solid var(--plate);
}
input[type=range]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--blood);
  border: 2px solid var(--plate);
}

.scale { display: flex; justify-content: space-between; margin-top: 7px; }

.seg {
  display: flex;
  border: 1px solid var(--rule);
  border-radius: var(--r);
  overflow: hidden;
}

.seg button {
  flex: 1;
  padding: 12px 8px;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-2);
  border-right: 1px solid var(--rule);
  transition: background .15s, color .15s;
}

.seg button:last-child { border-right: 0; }
.seg button:hover { background: var(--paper-alt); }
.seg button[aria-pressed="true"] { background: var(--ink); color: var(--paper); }

.calc-right { padding: 28px; display: flex; flex-direction: column; }

.outcomes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--rule);
  border-radius: var(--r);
  overflow: hidden;
  margin-top: 16px;
}

.outcome { padding: 22px 20px; }
.outcome:first-child { border-right: 1px solid var(--rule); background: var(--win-tint); }
.outcome:last-child { background: var(--blood-tint); }

.outcome-val {
  margin: 8px 0 0;
  font-family: var(--mono);
  font-size: clamp(25px, 3.2vw, 34px);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -.02em;
}

.outcome:first-child .outcome-val { color: var(--win); }
.outcome:last-child .outcome-val { color: var(--blood); }

.outcome-note {
  margin: 8px 0 0;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.terms { margin: 20px 0 0; padding-top: 16px; border-top: 1px solid var(--ink); }

.t-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px dotted var(--rule);
}

.t-row:last-child { border-bottom: 0; }
.t-row dt {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
  white-space: nowrap;
}

.t-row dd {
  margin: 0;
  font-family: var(--mono);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.calc-cta { margin-top: auto; padding-top: 20px; }
.calc-cta .btn { width: 100%; }

.tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.tier {
  position: relative;
  background: var(--plate);
  border: 1px solid var(--rule);
  border-radius: var(--r);
  padding: 22px;
  transition: border-color .2s, background .2s;
  cursor: pointer;
}

.tier[data-active="true"] {
  border: 1.5px solid var(--blood);
  background: var(--blood-tint);
}

.tier-tab {
  position: absolute;
  top: -10px;
  left: 20px;
  background: var(--blood);
  color: #fff;
  padding: 4px 11px;
  border-radius: 2px;
  font-family: var(--mono);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: .16em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity .2s;
}

.tier[data-active="true"] .tier-tab { opacity: 1; }

.tier-mult {
  margin: 8px 0 4px;
  font-family: var(--display);
  font-size: 44px;
  font-weight: 700;
  line-height: .92;
  letter-spacing: -.04em;
  color: var(--blood);
}

.tier-mult small { font-size: .42em; font-weight: 500; }

.tier-rows {
  margin: 18px 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--ink);
}

/* 7 · Duels */
.duels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 38px;
}

.duel {
  display: block;
  width: 100%;
  text-align: left;
  cursor: pointer;
  background: var(--plate);
  border: 1px solid var(--rule);
  border-radius: var(--r);
  padding: 18px 20px;
  font: inherit;
  transition: transform .16s, border-color .16s;
}

.duel:hover {
  transform: translateY(-2px);
  border-color: var(--ink);
}

.duel:hover .duel-cta { color: var(--blood); }
.duel:hover .duel-cta span { transform: translateX(3px); }

.duel-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.duel-badge {
  margin-left: auto;
  padding: 3px 9px;
  border-radius: 20px;
  font-family: var(--mono);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.badge-live { background: var(--win-tint); color: var(--win); }
.badge-settle { background: var(--blood-tint); color: var(--blood); }

.duel-vs {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 12px;
}

.duel-side { flex: 1; min-width: 0; }
.duel-side.r { text-align: right; }
.duel-handle { font-family: var(--mono); font-size: 13px; }

.duel-delta {
  margin-top: 3px;
  font-family: var(--mono);
  font-size: 21px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.lead { color: var(--win); }
.trail { color: var(--blood); }

.duel-mid {
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: .16em;
  color: var(--ink-3);
  padding-bottom: 4px;
}

.bar {
  display: flex;
  height: 5px;
  border-radius: 2px;
  overflow: hidden;
  background: var(--paper-alt);
}

.bar .a { background: var(--win); }
.bar .g { width: 2px; background: var(--plate); flex: none; }
.bar .b { flex: 1; background: var(--blood); }

.duel-foot {
  display: flex;
  align-items: center;
  gap: 99px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dotted var(--rule);
  font-family: var(--mono);
  font-size: 11.5px;
}

.duel-cta {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-2);
  transition: color .16s;
}

.duel-cta span { transition: transform .16s; }

/* Entrance Motion Keyframes & Animations */
@keyframes rise { to { opacity: 1; transform: none; } }
@keyframes draw { to { transform: scaleX(1); } }
@keyframes seat { to { opacity: 1; transform: none; } }
@keyframes strike {
  0% { opacity: 0; transform: rotate(-8deg) scale(1.9); }
  60% { opacity: 1; }
  100% { opacity: 1; transform: rotate(0) scale(1); }
}

.js-load .rise {
  opacity: 0;
  transform: translateY(15px);
  animation: rise .68s cubic-bezier(.2, .85, .25, 1) forwards;
  animation-delay: var(--d, 0ms);
}

.js-load .draw {
  transform: scaleX(0);
  transform-origin: left;
  animation: draw .72s cubic-bezier(.35, .9, .3, 1) forwards;
  animation-delay: var(--d, 0ms);
}

.js-load .seat {
  opacity: 0;
  transform: translateY(22px) scale(.985);
  animation: seat .82s cubic-bezier(.2, .85, .25, 1) forwards;
  animation-delay: var(--d, 0ms);
}

.js-load .strike {
  opacity: 0;
  animation: strike .5s cubic-bezier(.2, .9, .25, 1) forwards;
  animation-delay: var(--d, 0ms);
}

@media(prefers-reduced-motion:reduce){
  .js-load .rise, .js-load .draw, .js-load .seat, .js-load .strike {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
}

/* Mobile Adjustments */
@media(max-width:560px){
  h1.hero-title { font-size: clamp(34px, 10vw, 48px); }
  .row { padding: 13px 14px; gap: 10px; }
  .row-goal {
    font-size: 13.5px;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .row-amt { font-size: 13.5px; }
  .bar-mini { display: none; }
  .tape-rows { min-height: 0; }
  .meter-val { font-size: 20px; }
  .stamp { right: 10px; font-size: 10px; padding: 3px 7px; }
  .outcomes { grid-template-columns: 1fr; }
  .outcome:first-child { border-right: 0; border-bottom: 1px solid var(--rule); }
  .calc-left, .calc-right { padding: 20px; }
  .demo { padding: 24px 18px; }
  .sign-lines { gap: 24px; }
}

/* 8 · Signature Block */
.sign {
  border: 1px solid var(--ink);
  border-radius: var(--r);
  background: var(--plate);
  padding: clamp(28px, 4.4vw, 56px);
  text-align: center;
}

.sign-title {
  margin: 20px 0 12px;
  font-family: var(--display);
  font-size: clamp(27px, 3.8vw, 40px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -.025em;
}

.sign-copy {
  margin: 0 auto 30px;
  max-width: 46ch;
  color: var(--ink-2);
}

.sign-lines {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 32px;
  max-width: 620px;
  margin: 42px auto 0;
  text-align: left;
}

.sign-line {
  border-top: 1px solid var(--ink);
  padding-top: 9px;
}

.sign-script {
  margin: 0 0 7px;
  min-height: 26px;
  font-family: var(--display);
  font-size: 19px;
  font-weight: 500;
  letter-spacing: .03em;
}

.disclosure {
  max-width: 76ch;
  margin: 40px auto 0;
  font-family: var(--mono);
  font-size: 10.5px;
  line-height: 1.8;
  color: var(--ink-3);
  text-align: left;
}
`;