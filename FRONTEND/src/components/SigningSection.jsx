import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Closing signature section.
 *
 * Self-contained — the wax seal is inlined as a data URI, so there is no asset
 * setup and nothing can 404.
 *
 * The seal is stamped in the right margin, level with the signature block —
 * off the signature line, rotated, like a die pressed onto the page by hand.
 * It is a transparent PNG with no wrapper background, so it cannot render as
 * a box. Do not add a background, border, or shadow to it or its container.
 */

const CONTRACT_DATE = "25 JUL 2026";
const BOOK_TOTAL_DATE = "25 July 2026";

const SEAL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAYAAAAdHLWhAABRhEl..." + 
"iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAYAAAAdHLWhAABRhEl..." + 
"iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAYAAAAdHLWhAABRhEl..."; // Truncated for safety

export default function SigningSection({
  onWriteContract,
  date = CONTRACT_DATE,
  bookTotalDate = BOOK_TOTAL_DATE,
  sealSrc = SEAL,
}) {
  const blockRef = useRef(null);
  const [armed, setArmed] = useState(false);
  const [pressed, setPressed] = useState(false);

  useLayoutEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const el = blockRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setPressed(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es)
          if (e.isIntersecting) {
            setPressed(true);
            io.disconnect();
          }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  const a = armed ? "1" : "0";
  const p = pressed ? "1" : "0";

  return (
    <section className="cs" aria-labelledby="cs-heading">
      <style>{CSS}</style>

      <img
        className="cs-stamp"
        src={sealSrc}
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      <div className="cs-inner">
        <h2 id="cs-heading" className="cs-heading">
          Sign it, and
          <br />
          the week reorders itself
        </h2>

        <p className="cs-body">
          You will know within about four days whether you meant it. That is the
          fastest honest answer anyone has ever given you about your own goal.
        </p>

        <button type="button" className="cs-cta" onClick={onWriteContract}>
          Write a contract
        </button>

        <div className="cs-signatures" ref={blockRef}>
          <div className="cs-col">
            <div className="cs-rule" />
            <div className="cs-label">Counterparty signature</div>
          </div>

          <div className="cs-col">
            <div className="cs-rule">
              <span className="cs-mark" data-armed={a} data-pressed={p}>
                Collateral
              </span>
            </div>
            <div
              className="cs-label cs-label--signed"
              data-armed={a}
              data-pressed={p}
            >
              Custodian, countersigned · {date}
            </div>
          </div>
        </div>

        <p className="cs-disclaimer">
          Deposits are held by a third-party custodian via Stripe Connect and are not
          held by Collateral. Outcomes are determined solely by read-only
          telemetry from the connected platform API named in the contract.
          Matching yield is funded from forfeited deposits and sponsor
          contributions, is not interest, and is not guaranteed. Collateral is
          not a broker, dealer, exchange, investment adviser, or deposit
          institution. Forfeited capital is not recoverable. The settlement feed
          shows recently settled contracts and may be delayed. Figures shown are
          book totals as of {bookTotalDate}.
        </p>
      </div>
    </section>
  );
}

const CSS = `
.cs {
  --cs-bg: #FDFBF7;
  --cs-ink: #1A1A18;
  --cs-body: #55534E;
  --cs-muted: #6B6862;
  --cs-rule: #D5CFC3;
  --cs-accent: #7A1F2B;
  --cs-accent-press: #661820;
  --cs-block: 660px;
  --cs-ease: cubic-bezier(0.16, 0.84, 0.44, 1);

  position: relative;
  background: var(--cs-bg);
  padding: 124px 24px 132px;
  overflow: hidden;
  isolation: isolate;
}

.cs-stamp {
  position: absolute;
  z-index: 1;
  left: 50%;
  bottom: 178px;
  width: 148px;
  height: 148px;
  transform: translateX(352px) rotate(-9deg);
  pointer-events: none;
  user-select: none;
  display: none;
}
@media (min-width: 1160px) { .cs-stamp { display: block; } }
@media (min-width: 1400px) {
  .cs-stamp { width: 168px; height: 168px; transform: translateX(392px) rotate(-9deg); }
}

.cs-inner {
  position: relative;
  z-index: 1;
  max-width: var(--cs-block);
  margin: 0 auto;
}

.cs-heading {
  margin: 0;
  text-align: center;
  color: var(--cs-ink);
  font-size: clamp(34px, 4.6vw, 50px);
  font-weight: 700;
  line-height: 1.14;
  letter-spacing: -0.02em;
}

.cs-body {
  max-width: 30rem;
  margin: 22px auto 0;
  text-align: center;
  color: var(--cs-body);
  font-size: 17px;
  line-height: 1.62;
  text-wrap: balance;
}

.cs-cta {
  display: block;
  margin: 38px auto 0;
  padding: 17px 34px;
  border: 0;
  border-radius: 0;
  background: var(--cs-accent);
  color: #FFFFFF;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: none;
  transition: background-color 120ms var(--cs-ease), transform 120ms var(--cs-ease);
}
@media (hover: hover) { .cs-cta:hover { background: var(--cs-accent-press); } }
.cs-cta:active { transform: translateY(1px); }
.cs-cta:focus-visible { outline: 2px solid var(--cs-accent); outline-offset: 3px; }

.cs-signatures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 48px;
  margin-top: 92px;
}

.cs-col { min-width: 0; }

.cs-rule {
  display: flex;
  align-items: flex-end;
  min-height: 46px;
  border-bottom: 1px solid var(--cs-rule);
  overflow: visible;
}

.cs-mark {
  color: var(--cs-ink);
  font-size: 27px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.05;
  padding-bottom: 4px;
  white-space: nowrap;
}

.cs-label {
  margin-top: 12px;
  color: var(--cs-muted);
  font-family: var(--cs-mono, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  font-size: 11px;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  line-height: 1.5;
}

.cs-disclaimer {
  max-width: var(--cs-block);
  margin: 54px auto 0;
  color: var(--cs-body);
  font-family: var(--cs-mono, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  font-size: 12px;
  line-height: 1.75;
  letter-spacing: 0.01em;
}

.cs-mark, .cs-label--signed { opacity: 1; }
.cs-mark { transform: translateY(0); }

.cs-mark[data-armed="1"] { opacity: 0; transform: translateY(6px); }
.cs-label--signed[data-armed="1"] { opacity: 0; }

.cs-mark[data-armed="1"][data-pressed="1"] {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 320ms var(--cs-ease), transform 320ms var(--cs-ease);
}
.cs-label--signed[data-armed="1"][data-pressed="1"] {
  opacity: 1;
  transition: opacity 320ms var(--cs-ease) 80ms;
}

@media (prefers-reduced-motion: reduce) {
  .cs-cta, .cs-mark, .cs-label--signed { transition: none !important; }
  .cs-mark, .cs-label--signed { opacity: 1 !important; }
  .cs-mark { transform: none !important; }
}

@media (max-width: 760px) {
  .cs { padding: 86px 22px 94px; }
  .cs-signatures { grid-template-columns: 1fr; row-gap: 42px; margin-top: 70px; }
  .cs-mark { font-size: 23px; }
  .cs-disclaimer { margin-top: 42px; }
}
`;
