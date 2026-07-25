// ═══════════════════════════════════════════════════════════════════════════
// Collateral — Institutional Motion Controller (Phase 1 Motion System)
// Reference Standards: Bloomberg Terminal, Stripe Dashboard, Linear, Apple
// ═══════════════════════════════════════════════════════════════════════════

class MotionController {
    constructor() {
        this.activePermits = 0;
        this.maxPermits = 3; // Rule 7: Enforce 3-simultaneous-animation cap
        this.isReduced = false;
        this.isTabHidden = false;
        this.registeredTimers = new Set();
        this.registeredRafs = new Set();
        this.observers = new Set();
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        // Check reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.isReduced = mediaQuery.matches;
        mediaQuery.addEventListener('change', (e) => {
            this.isReduced = e.matches;
            if (this.isReduced) this.pauseAll();
        });

        // Rule 5: NO-JS Fallback Mandatory — add js-motion-active class ONLY after JS confirms runtime support
        if (!this.isReduced && document.documentElement) {
            document.documentElement.classList.add('js-motion-active');
        }

        // Rule 3 & 7: Pause all motion when tab is hidden or off-screen
        document.addEventListener('visibilitychange', () => {
            this.isTabHidden = document.visibilityState === 'hidden';
            if (this.isTabHidden) {
                this.pauseAll();
            } else {
                this.resumeAll();
            }
        });
    }

    requestPermit() {
        if (this.isReduced || this.isTabHidden || this.activePermits >= this.maxPermits) {
            return false;
        }
        this.activePermits++;
        return true;
    }

    releasePermit() {
        if (this.activePermits > 0) {
            this.activePermits--;
        }
    }

    setTimeout(fn, delay) {
        if (this.isTabHidden || this.isReduced) return null;
        const timerId = setTimeout(() => {
            this.registeredTimers.delete(timerId);
            fn();
        }, delay);
        this.registeredTimers.add(timerId);
        return timerId;
    }

    setInterval(fn, interval) {
        if (this.isReduced) return null;
        const timerId = setInterval(() => {
            if (!this.isTabHidden) fn();
        }, interval);
        this.registeredTimers.add(timerId);
        return timerId;
    }

    clearInterval(timerId) {
        if (timerId) {
            clearInterval(timerId);
            this.registeredTimers.delete(timerId);
        }
    }

    requestAnimationFrame(fn) {
        if (this.isTabHidden || this.isReduced) return null;
        const rafId = requestAnimationFrame((ts) => {
            this.registeredRafs.delete(rafId);
            fn(ts);
        });
        this.registeredRafs.add(rafId);
        return rafId;
    }

    cancelAnimationFrame(rafId) {
        if (rafId) {
            cancelAnimationFrame(rafId);
            this.registeredRafs.delete(rafId);
        }
    }

    pauseAll() {
        this.registeredRafs.forEach(id => cancelAnimationFrame(id));
        this.registeredRafs.clear();
    }

    resumeAll() {
        // Observers and timers resume naturally
    }

    registerObserver(observer) {
        this.observers.add(observer);
    }
}

// Singleton Motion Controller
export const motionController = new MotionController();

// React / Helper hooks for Landing Motion
export function useReveal({ threshold = 0.18, rootMargin = "0px 0px -12% 0px" } = {}) {
    return [null, true];
}

export function useCountUp(target, { duration = 400, active = true, format = (n) => n } = {}) {
    return format(target);
}

// Number Interpolation Helper with Tabular Nums (Rule 6 & Rule 4)
export function animateValue(element, start, end, duration = 400, formatter = (n) => n.toLocaleString()) {
    if (!element) return;
    if (motionController.isReduced || motionController.isTabHidden) {
        element.textContent = formatter(end);
        return;
    }

    const startTime = performance.now();
    const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (end - start) * ease);
        element.textContent = formatter(current);

        if (progress < 1) {
            motionController.requestAnimationFrame(step);
        } else {
            element.textContent = formatter(end);
        }
    };
    motionController.requestAnimationFrame(step);
}

// Entrance Observers for Receipt Cards, Flow Diagrams & Tables
export function initEntranceObservers() {
    motionController.init();

    if (!('IntersectionObserver' in window)) return;

    // Viewport Observer for Entrance Elements (Animate once, then disconnect)
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                obs.unobserve(entry.target); // Unobserve immediately after entrance
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .receipt-card, .r-plate').forEach(el => {
        revealObserver.observe(el);
    });

    motionController.registerObserver(revealObserver);
}

export const revealStyles = `
/* ═══════════════════════════════════════════════════════════════════════════
   INSTITUTIONAL MOTION SYSTEM STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

/* Rule 6: Numeric stability — tabular nums & fixed alignment on all animated figures */
.meter-val, .row-amt, .demo-amt, .demo-ledger dd, #m-escrow, #m-settled, #m-count, #clock {
    font-variant-numeric: tabular-nums !important;
    display: inline-block;
}

/* Rule 1: LIVE status dot pulses ONCE for 500ms when a settlement resolves */
.pulse { position: relative; }
.pulse::after {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid var(--win, #186B4A);
    opacity: 0;
    transform: scale(.6);
    pointer-events: none;
}
.pulse.pulse-flash::after {
    animation: cl-ring-once 500ms ease-out forwards;
}
@keyframes cl-ring-once {
    0% { transform: scale(.6); opacity: .95; }
    100% { transform: scale(2.2); opacity: 0; }
}

/* Rule 5: NO-JS FALLBACK — default CSS state is 100% VISIBLE (opacity 1, transform none) */
.reveal .r-item, .reveal .r-plate, .reveal tbody tr, .receipt-card {
    opacity: 1;
    transform: none;
}

/* Start states ONLY apply when html has .js-motion-active class */
html.js-motion-active .reveal .r-item {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 350ms cubic-bezier(.22,.85,.26,1) calc(var(--i,0) * 60ms),
                transform 350ms cubic-bezier(.22,.85,.26,1) calc(var(--i,0) * 60ms);
    will-change: opacity, transform;
}
html.js-motion-active .reveal.is-in .r-item {
    opacity: 1;
    transform: translateY(0);
}

html.js-motion-active .reveal .r-plate {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 400ms cubic-bezier(.22,.85,.26,1) calc(var(--i,0) * 60ms),
                transform 400ms cubic-bezier(.22,.85,.26,1) calc(var(--i,0) * 60ms);
    will-change: opacity, transform;
}
html.js-motion-active .reveal.is-in .r-plate {
    opacity: 1;
    transform: translateY(0);
}

/* Rule 2: Decorative rules draw on entry */
html.js-motion-active .reveal .r-rule {
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 500ms cubic-bezier(.65,0,.35,1) calc(var(--i,0) * 60ms);
}
html.js-motion-active .reveal.is-in .r-rule {
    transform: scaleX(1);
}

/* Rule 9: Hover States gated behind @media (hover: hover) */
@media (hover: hover) {
    .card-inner, .r-plate-inner {
        transition: transform 180ms ease-out, box-shadow 180ms ease-out;
    }
    .card-inner:hover, .r-plate-inner:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 24px rgba(14, 20, 32, 0.08);
    }
    .btn {
        transition: transform 120ms ease, background 120ms ease;
    }
    .btn:active {
        transform: translateY(1px);
    }
    .link::after {
        transition: transform 150ms ease;
    }
}

/* Rule 10: Universal Focus-Visible (2px accent outline with offset) */
.cl-root :where(a, button, input, [tabindex]):focus-visible {
    outline: 2px solid var(--blood, #7A1C29) !important;
    outline-offset: -2px !important;
}

/* Table Row Hover & Value Flash */
.table-row-flash {
    animation: cell-flash 400ms ease-out;
}
@keyframes cell-flash {
    0% { background: rgba(24, 107, 74, 0.12); }
    100% { background: transparent; }
}

/* Prefers Reduced Motion override */
@media (prefers-reduced-motion: reduce) {
    .reveal .r-item, .reveal .r-plate, .reveal .r-rule, .pulse::after, .row {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
        animation: none !important;
    }
}
`;
