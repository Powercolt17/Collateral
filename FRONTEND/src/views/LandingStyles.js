// Landing CSS — Institutional Financial Instrument Design System
export const landingCSS = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500;6..96,700&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --paper: #F8F6F1;
  --paper-alt: #F2EEE7;
  --plate: #FFFFFF;
  --ink: #131A2B;
  --ink-2: #565E70;
  --ink-3: #6C7280;
  --blood: #7B1E2B;
  --blood-deep: #5C1420;
  --blood-tint: #F6E9EB;
  --win: #1A7A52;
  --win-tint: #E9F3ED;
  --rule: #D9D2C6;
  --rule-soft: #E7E1D7;

  --display: "Bodoni Moda", Georgia, serif;
  --body: "Public Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  --shell: 1200px;
  --gutter: 28px;
  --section-y: 110px;
}
@media(max-width:860px){ :root { --section-y: 70px; --gutter: 20px } }

.lp {
  min-height: 100vh;
  background: var(--paper) !important;
  color: var(--ink);
  font-family: var(--body);
  font-size: 17px;
  line-height: 1.6;
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
}

/* Clerical Monospace Voice */
.mono {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.mono-b {
  color: var(--blood);
}

.num {
  font-family: var(--mono);
  font-variant-numeric: tabular-nums;
  color: var(--blood);
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 22px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .14em;
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

h2.title {
  margin: 0 0 14px;
  font-family: var(--display);
  font-size: clamp(31px, 4.1vw, 47px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -.005em;
  max-width: 17ch;
}

.lede {
  margin: 0;
  font-size: 17px;
  line-height: 1.62;
  color: var(--ink-2);
  max-width: 56ch;
}

.rule {
  height: 1px;
  background: var(--rule);
  border: 0;
  margin: 0;
}

.rule-double {
  height: 4px;
  border: 0;
  margin: 0;
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
}

/* Institutional Action Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 52px;
  padding: 0 30px;
  border: 1px solid transparent;
  border-radius: 2px;
  font-family: var(--body);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background .16s ease, color .16s ease, border-color .16s ease;
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
  font-family: var(--body);
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

:where(a, button, [tabindex]):focus-visible {
  outline: 2px solid var(--blood);
  outline-offset: 3px;
}

/* Header & Nav */
.nav {
  border-bottom: 1px solid var(--rule);
  background: var(--paper);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-in {
  max-width: var(--shell);
  margin: 0 auto;
  padding: 0 var(--gutter);
  height: 70px;
  display: flex;
  align-items: center;
  gap: 38px;
}

.wordmark {
  font-family: var(--display);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--ink);
}

.nav-links {
  display: flex;
  gap: 30px;
  margin-left: 8px;
}

.nav-links a {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink-2);
  text-decoration: none;
  padding: 6px 0;
  border-bottom: 1px solid transparent;
}

.nav-links a:hover {
  color: var(--ink);
  border-color: var(--ink);
}

.nav-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-escrow {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--win);
  flex: none;
}

.nav-btn {
  min-height: 38px;
  padding: 0 18px;
  font-size: 11px;
}

@media(max-width:900px){
  .nav-links, .nav-escrow { display: none; }
}

/* Section 1: Hero Certificate */
.hero {
  padding-block: 48px 0;
}

.plate {
  position: relative;
  border: 1px solid var(--ink);
  background: var(--plate);
  padding: clamp(30px, 5vw, 64px) clamp(20px, 4vw, 56px);
  overflow: hidden;
}

.plate::before {
  content: "";
  position: absolute;
  inset: 7px;
  border: 1px solid var(--rule);
  pointer-events: none;
}

.guilloche {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: .5;
  pointer-events: none;
}

.cert-head {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 14px 26px;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--rule);
}

.cert-body {
  position: relative;
  text-align: center;
  padding: 48px 0 8px;
}

.cert-kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .3em;
  text-transform: uppercase;
  color: var(--blood);
  margin: 0 0 24px;
}

h1.cert-title {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(38px, 7.8vw, 98px);
  font-weight: 700;
  line-height: .94;
  letter-spacing: -.015em;
  text-transform: uppercase;
  color: var(--ink);
}

h1.cert-title .em {
  color: var(--blood);
  font-style: italic;
  font-weight: 500;
  text-transform: none;
  letter-spacing: -.01em;
}

.ornament {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
  margin: 30px 0 24px;
}

.ornament span {
  height: 1px;
  width: min(150px, 22vw);
  background: var(--rule);
}

.cert-copy {
  margin: 0 auto;
  max-width: 52ch;
  font-size: 16.5px;
  line-height: 1.68;
  color: var(--ink-2);
}

.cert-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  margin-top: 36px;
}

.cert-foot {
  position: relative;
  margin-top: 48px;
  padding-top: 18px;
  border-top: 1px solid var(--rule);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 22px;
}

.foot-cell .mono {
  display: block;
  margin-bottom: 7px;
}

.foot-val {
  font-family: var(--mono);
  font-size: 19px;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}

.foot-val.blood {
  color: var(--blood);
}

.foot-val.win {
  color: var(--win);
}

/* Section 2: Diptych (Solo or Rivalry) */
.diptych {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  border: 1px solid var(--ink);
  background: var(--plate);
  margin-top: 48px;
}

.divider-v {
  background: var(--rule);
}

.leaf {
  padding: clamp(26px, 3.4vw, 44px);
}

.leaf--dark {
  background: var(--blood);
  color: #F4EDE9;
}

.leaf--dark .leaf-name, .leaf--dark .leaf-list li {
  color: #F4EDE9;
}

.leaf--dark .mono {
  color: #DCC3C7;
}

.leaf--dark .link {
  color: #F4EDE9;
}

.leaf-art {
  border: 1px solid var(--rule);
  margin-bottom: 26px;
  background: var(--paper);
}

.leaf--dark .leaf-art {
  border-color: #94505C;
  background: #6B1725;
}

.leaf-name {
  margin: 12px 0 16px;
  font-family: var(--display);
  font-size: 29px;
  font-weight: 500;
  line-height: 1.14;
}

.leaf-list {
  list-style: none;
  margin: 0 0 26px;
  padding: 0;
}

.leaf-list li {
  display: flex;
  gap: 11px;
  padding: 9px 0;
  border-bottom: 1px dotted var(--rule);
  font-size: 15px;
  color: var(--ink-2);
}

.leaf--dark .leaf-list li {
  border-color: #94505C;
}

.leaf-list li::before {
  content: "§";
  font-family: var(--mono);
  font-size: 12px;
  color: var(--blood);
  flex: none;
  padding-top: 2px;
}

.leaf--dark .leaf-list li::before {
  color: #E8B9C0;
}

@media(max-width:800px){
  .diptych { grid-template-columns: 1fr; }
  .divider-v { height: 1px; }
}

/* Section 3: Argument (The Case) */
.argument {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px;
  gap: 56px;
  align-items: start;
}

@media(max-width:900px){
  .argument { grid-template-columns: 1fr; gap: 32px; }
}

.prose {
  columns: 2;
  column-gap: 44px;
  font-size: 16px;
  line-height: 1.72;
  color: var(--ink-2);
  margin-top: 30px;
}

.prose p {
  margin: 0 0 1.05em;
  break-inside: avoid;
}

@media(max-width:700px){
  .prose { columns: 1; }
}

.dropcap::first-letter {
  float: left;
  font-family: var(--display);
  font-size: 64px;
  line-height: .82;
  font-weight: 700;
  color: var(--blood);
  padding: 6px 11px 0 0;
}

.margin-note {
  border-top: 1px solid var(--ink);
  padding-top: 13px;
  margin-top: 34px;
}

.margin-note p {
  margin: 9px 0 0;
  font-family: var(--mono);
  font-size: 11.5px;
  line-height: 1.72;
  color: var(--ink-2);
  letter-spacing: .01em;
}

.ledger-compare {
  width: 100%;
  border-collapse: collapse;
  margin-top: 56px;
}

.ledger-compare caption {
  text-align: left;
  padding-bottom: 13px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.ledger-compare th {
  text-align: left;
  padding: 11px 14px;
  border-bottom: 1px solid var(--ink);
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink);
}

.ledger-compare th:first-child {
  width: 52px;
  color: var(--ink-3);
}

.ledger-compare td {
  padding: 13px 14px;
  border-bottom: 1px dotted var(--rule);
  font-size: 15.5px;
}

.ledger-compare td:first-child {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-3);
}

.void {
  color: var(--ink-2);
  text-decoration: line-through;
  text-decoration-color: var(--blood);
  text-decoration-thickness: 1px;
}

.ledger-compare tr:last-child td {
  border-bottom: 0;
  padding-top: 18px;
  font-weight: 600;
}

.ledger-compare tr:last-child .void {
  font-weight: 400;
}

.outcome-win {
  color: var(--win);
}

/* Section 4: Settlement Receipts Ledger */
.receipts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
  gap: 26px;
  margin-top: 44px;
}

.receipt {
  position: relative;
  background: var(--plate);
  border: 1px solid var(--rule);
  transition: transform .2s ease;
}

.receipt:nth-child(1) { transform: rotate(-.5deg); }
.receipt:nth-child(3) { transform: rotate(.55deg); }
.receipt:hover { transform: rotate(0) translateY(-3px); }

.r-top {
  padding: 19px 21px 21px;
}

.r-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px;
}

.r-goal {
  margin: 0 0 5px;
  font-family: var(--display);
  font-size: 19px;
  font-weight: 500;
  line-height: 1.24;
}

.r-src {
  margin: 0;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-3);
  letter-spacing: .04em;
}

.r-fields {
  margin: 17px 0 0;
  padding-top: 14px;
  border-top: 1px dotted var(--rule);
}

.r-row {
  display: flex;
  align-items: baseline;
  gap: 9px;
  padding: 6px 0;
}

.r-row dt {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
  white-space: nowrap;
}

.r-dots {
  flex: 1;
  border-bottom: 1px dotted var(--rule);
  transform: translateY(-3px);
}

.r-row dd {
  margin: 0;
  font-family: var(--mono);
  font-size: 12.5px;
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
  background: var(--paper-alt);
}

.perf::before { left: -11px; }
.perf::after { right: -11px; }

.r-bottom {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 21px;
}

.r-bottom.won { background: var(--win-tint); }
.r-bottom.lost { background: var(--blood-tint); }

.r-amt {
  margin: 0;
  font-family: var(--mono);
  font-size: 25px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.won .r-amt { color: var(--win); }
.lost .r-amt { color: var(--blood); }

.r-note {
  margin: 5px 0 0;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.stamp {
  flex: none;
  transform: rotate(-11deg);
  border: 2px solid currentColor;
  border-radius: 3px;
  padding: 5px 11px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .16em;
  opacity: .72;
}

.stamp.won { color: var(--win); background: transparent; }
.stamp.lost { color: var(--blood); }

.footing {
  margin-top: 64px;
}

.footing-rows {
  margin: 0;
  padding: 0;
}

.f-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px dotted var(--rule);
}

.f-row dt {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink-2);
}

.f-dots {
  flex: 1;
  border-bottom: 1px dotted var(--rule);
  transform: translateY(-4px);
}

.f-row dd {
  margin: 0;
  font-family: var(--mono);
  font-size: 20px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--blood);
}

.f-total {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--ink);
  border-bottom: 0;
}

.f-total dt {
  color: var(--ink);
  font-weight: 500;
}

.f-total dd {
  font-size: 25px;
}

/* Section 5: Escrow Schematic */
.schematic {
  margin-top: 46px;
  border: 1px solid var(--ink);
  background: var(--plate);
  padding: clamp(18px, 3vw, 34px);
  overflow-x: auto;
}

.sch-head {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 26px;
  justify-content: space-between;
  padding-bottom: 14px;
  margin-bottom: 26px;
  border-bottom: 1px solid var(--rule);
}

.sch-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 30px;
  padding-top: 16px;
  margin-top: 22px;
  border-top: 1px solid var(--rule);
}

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

.swatch {
  width: 22px;
  height: 0;
  border-top: 2px solid currentColor;
  flex: none;
}

.swatch.dash {
  border-top-style: dashed;
}

.sch-svg text {
  font-family: var(--mono);
}

/* Section 6: Term Sheet Rate Table */
.termsheet {
  width: 100%;
  border-collapse: collapse;
  margin-top: 44px;
  background: var(--plate);
}

.termsheet caption {
  caption-side: top;
  text-align: left;
  padding: 0 0 14px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.termsheet th, .termsheet td {
  padding: 17px 20px;
  text-align: right;
  border-bottom: 1px dotted var(--rule);
}

.termsheet thead th {
  border-bottom: 1px solid var(--ink);
  vertical-align: bottom;
}

.termsheet th:first-child, .termsheet td:first-child {
  text-align: left;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink-2);
  width: 210px;
}

.t-tier {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-3);
  display: block;
  margin-bottom: 9px;
}

.t-mult {
  font-family: var(--display);
  font-size: clamp(31px, 4.4vw, 45px);
  font-weight: 500;
  line-height: 1;
  color: var(--blood);
  display: block;
}

.t-mult small {
  font-size: .44em;
  font-weight: 400;
}

.termsheet tbody td {
  font-family: var(--mono);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}

.col-mark {
  background: var(--blood-tint);
}

.t-annot {
  display: block;
  margin-top: 9px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--blood);
}

.termsheet tfoot td {
  border-bottom: 0;
  padding-top: 24px;
}

.termsheet tfoot .btn {
  width: 100%;
}

@media(max-width:840px){
  .termsheet, .termsheet thead, .termsheet tbody, .termsheet tfoot,
  .termsheet tr, .termsheet th, .termsheet td { display: block; width: auto; }
  .termsheet thead { display: none; }
  .termsheet tbody tr { display: flex; justify-content: space-between; gap: 16px; }
  .termsheet tbody td, .termsheet th:first-child { width: auto; text-align: left; }
}

/* Section 7: Live Rivalry Tape Ticker */
.tape {
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  background: var(--plate);
  overflow: hidden;
  margin-top: 40px;
}

.tape-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px var(--gutter);
  border-bottom: 1px solid var(--rule);
}

.tape-strip {
  display: flex;
  gap: 0;
  width: max-content;
  animation: roll 46s linear infinite;
}

@keyframes roll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.tape:hover .tape-strip {
  animation-play-state: paused;
}

@media(prefers-reduced-motion:reduce){
  .tape-strip { animation: none; }
  .tape { overflow-x: auto; }
}

.tick {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 26px;
  border-right: 1px dotted var(--rule);
  font-family: var(--mono);
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.tick:hover {
  background: var(--paper-alt);
}

.tick-cat {
  font-size: 10px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.tick-up { color: var(--win); }
.tick-dn { color: var(--blood); }
.tick-vs { color: var(--ink-3); font-size: 10px; letter-spacing: .14em; }
.tick-pool { color: var(--ink-2); }
.tick-arrow { color: var(--blood); }

/* Section 8: Signature Block */
.signblock {
  border: 1px solid var(--ink);
  background: var(--plate);
  padding: clamp(30px, 4.6vw, 60px);
  text-align: center;
  margin-top: 20px;
}

.sign-title {
  margin: 22px 0 12px;
  font-family: var(--display);
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 500;
  line-height: 1.12;
}

.sign-copy {
  margin: 0 auto 34px;
  max-width: 46ch;
  color: var(--ink-2);
  font-size: 16.5px;
}

.sign-lines {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 34px;
  max-width: 660px;
  margin: 44px auto 0;
  text-align: left;
}

.sign-line {
  border-top: 1px solid var(--ink);
  padding-top: 10px;
}

.sign-script {
  font-family: var(--display);
  font-style: italic;
  font-size: 21px;
  color: var(--ink);
  margin: 0 0 8px;
  min-height: 28px;
}

.disclosure {
  max-width: 74ch;
  margin: 44px auto 0;
  font-family: var(--mono);
  font-size: 10.5px;
  line-height: 1.8;
  color: var(--ink-3);
  text-align: left;
  letter-spacing: .02em;
}

/* Footer */
.foot {
  border-top: 1px solid var(--rule);
  padding-block: 36px;
  margin-top: var(--section-y);
}

.foot-in {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 34px;
  align-items: center;
}

.foot-links {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-left: auto;
}

.foot-links a {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink-3);
  text-decoration: none;
}

.foot-links a:hover {
  color: var(--ink);
}

@media(prefers-reduced-motion:reduce){
  * { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
`;