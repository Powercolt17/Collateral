import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SEAL from "./seal";

/**
 * Closing signature section.
 *
 * No CSS file, no <style> tag, no class names — every rule is an inline style
 * object. Earlier versions used a <style> tag and the host environment dropped
 * it, rendering the section completely unstyled. Inline styles cannot be
 * dropped by a bundler, a renderer, or a CSS reset.
 *
 * Media queries are resolved with matchMedia in JS, since inline styles cannot
 * express them.
 *
 * The seal is stamped in the right margin, level with the signature block —
 * off the signature line, rotated, like a die pressed onto the page.
 */

const C = {
  bg: "#FDFBF7",
  ink: "#1A1A18",
  body: "#55534E",
  muted: "#6B6862",
  rule: "#D5CFC3",
  accent: "#7A1F2B",
  accentPress: "#661820",
};

const MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
const EASE = "cubic-bezier(0.16, 0.84, 0.44, 1)";

function useMedia(query) {
  const [match, setMatch] = useState(false);
  useLayoutEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    setMatch(mq.matches);
    const on = (e) => setMatch(e.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () =>
      mq.removeEventListener
        ? mq.removeEventListener("change", on)
        : mq.removeListener(on);
  }, [query]);
  return match;
}

export default function SigningSection({
  onWriteContract,
  date = "25 JUL 2026",
  bookTotalDate = "25 July 2026",
  sealSrc = SEAL,
}) {
  const blockRef = useRef(null);
  const [shown, setShown] = useState(true);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [down, setDown] = useState(false);

  const isMobile = useMedia("(max-width: 760px)");
  const wide = useMedia("(min-width: 1160px)");
  const extraWide = useMedia("(min-width: 1400px)");
  const reduce = useMedia("(prefers-reduced-motion: reduce)");

  useLayoutEffect(() => {
    if (!reduce) setShown(false);
  }, [reduce]);

  useEffect(() => {
    if (reduce || shown) return;
    const el = blockRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es)
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, shown]);

  const stampSize = extraWide ? 186 : 168;
  const stampX = extraWide ? 390 : 348;

  const s = {
    section: {
      position: "relative",
      background: C.bg,
      padding: isMobile ? "86px 22px 94px" : "124px 24px 132px",
      boxSizing: "border-box",
      width: "100%",
    },
    stamp: {
      position: "absolute",
      zIndex: 1,
      left: "50%",
      bottom: 292,
      width: stampSize,
      height: stampSize,
      minHeight: stampSize,
      maxHeight: "none",
      flex: "none",
      aspectRatio: "auto",
      backgroundImage: "url(" + sealSrc + ")",
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      transform: "translateX(" + stampX + "px) rotate(-9deg)",
      pointerEvents: "none",
      userSelect: "none",
      display: wide ? "block" : "none",
    },
    inner: {
      position: "relative",
      zIndex: 2,
      maxWidth: 660,
      margin: "0 auto",
    },
    heading: {
      margin: 0,
      textAlign: "center",
      color: C.ink,
      fontSize: isMobile ? 34 : 50,
      fontWeight: 700,
      lineHeight: 1.14,
      letterSpacing: "-0.02em",
    },
    body: {
      maxWidth: 480,
      margin: "22px auto 0",
      textAlign: "center",
      color: C.body,
      fontSize: 17,
      lineHeight: 1.62,
    },
    cta: {
      display: "block",
      margin: "38px auto 0",
      padding: "17px 34px",
      border: 0,
      borderRadius: 0,
      background: hover ? C.accentPress : C.accent,
      color: "#FFFFFF",
      font: "inherit",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      cursor: "pointer",
      boxShadow: "none",
      outline: focus ? "2px solid " + C.accent : "none",
      outlineOffset: 3,
      transform: down ? "translateY(1px)" : "none",
      transition: reduce
        ? "none"
        : "background-color 120ms " + EASE + ", transform 120ms " + EASE,
    },
    signatures: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      columnGap: 48,
      rowGap: isMobile ? 42 : 0,
      marginTop: isMobile ? 70 : 92,
    },
    col: { minWidth: 0 },
    rule: {
      display: "flex",
      alignItems: "flex-end",
      minHeight: 46,
      borderBottom: "1px solid " + C.rule,
    },
    mark: {
      color: C.ink,
      fontSize: isMobile ? 23 : 27,
      fontWeight: 700,
      letterSpacing: "-0.01em",
      lineHeight: 1.05,
      paddingBottom: 4,
      whiteSpace: "nowrap",
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(6px)",
      transition: reduce
        ? "none"
        : "opacity 320ms " + EASE + ", transform 320ms " + EASE,
    },
    label: {
      marginTop: 12,
      color: C.muted,
      fontFamily: MONO,
      fontSize: 11,
      letterSpacing: "0.11em",
      textTransform: "uppercase",
      lineHeight: 1.5,
    },
    labelSigned: {
      opacity: shown ? 1 : 0,
      transition: reduce ? "none" : "opacity 320ms " + EASE + " 80ms",
    },
    disclaimer: {
      maxWidth: 660,
      margin: isMobile ? "42px auto 0" : "54px auto 0",
      color: C.body,
      fontFamily: MONO,
      fontSize: 12,
      lineHeight: 1.75,
      letterSpacing: "0.01em",
    },
  };

  return (
    <section style={s.section} aria-labelledby="cs-heading">
      <div
        style={s.stamp}
        role="img"
        aria-label="Wax seal stamp"
        aria-hidden="true"
      />

      <div style={s.inner}>
        <h2 id="cs-heading" style={s.heading}>
          Sign it, and
          <br />
          the week reorders itself
        </h2>

        <p style={s.body}>
          You will know within about four days whether you meant it. That is the
          fastest honest answer anyone has ever given you about your own goal.
        </p>

        <button
          type="button"
          style={s.cta}
          onClick={onWriteContract}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => {
            setHover(false);
            setDown(false);
          }}
          onMouseDown={() => setDown(true)}
          onMouseUp={() => setDown(false)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        >
          Write a contract
        </button>

        <div style={s.signatures} ref={blockRef}>
          <div style={s.col}>
            <div style={s.rule} />
            <div style={s.label}>Counterparty signature</div>
          </div>

          <div style={s.col}>
            <div style={s.rule}>
              <span style={s.mark}>Collateral</span>
            </div>
            <div style={{ ...s.label, ...s.labelSigned }}>
              Custodian, countersigned &middot; {date}
            </div>
          </div>
        </div>

        <p style={s.disclaimer}>
          Deposits are held by a third-party custodian via Stripe Connect and are
          not held by Collateral. Outcomes are determined solely by read-only
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
