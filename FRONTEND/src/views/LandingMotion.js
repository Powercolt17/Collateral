// ═══════════════════════════════════════════════════════════════════════════
// Collateral — Institutional Motion Controller & Scroll Animation System
// Reference Standards: Bloomberg Terminal, Stripe Dashboard, Linear, Apple
// ═══════════════════════════════════════════════════════════════════════════

class MotionController {
    constructor() {
        this.activePermits = 0;
        this.maxPermits = 3;
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

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.isReduced = mediaQuery.matches;
        mediaQuery.addEventListener('change', (e) => {
            this.isReduced = e.matches;
            if (this.isReduced) this.pauseAll();
        });

        // NO-JS Fallback Mandatory — add js-motion-active class ONLY after JS confirms runtime support
        if (!this.isReduced && document.documentElement) {
            document.documentElement.classList.add('js-motion-active');
        }

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

    resumeAll() {}

    registerObserver(observer) {
        this.observers.add(observer);
    }
}

export const motionController = new MotionController();

export function useReveal({ threshold = 0.12, rootMargin = "0px 0px -10% 0px" } = {}) {
    return [null, true];
}

export function useCountUp(target, { duration = 400, active = true, format = (n) => n } = {}) {
    return format(target);
}

export function animateValue(element, start, end, duration = 400, formatter = (n) => n.toLocaleString()) {
    if (!element) return;
    if (motionController.isReduced || motionController.isTabHidden) {
        element.textContent = formatter(end);
        return;
    }

    const startTime = performance.now();
    const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
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

// Universal Entrance Observers for Scroll Animations
export function initEntranceObservers() {
    motionController.init();

    if (!('IntersectionObserver' in window)) return;

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                entry.target.querySelectorAll('.r-item, .r-plate, .r-rule').forEach(child => {
                    child.classList.add('is-in');
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const targets = document.querySelectorAll(
        '.reveal, .r-item, .r-plate, .receipt-card, .rc-card, .leaf, .reg, .cmp, .faq-item, .calc-card, section.section'
    );
    
    targets.forEach((el, idx) => {
        if (!el.style.getPropertyValue('--i')) {
            el.style.setProperty('--i', (idx % 6).toString());
        }
        revealObserver.observe(el);
    });

    motionController.registerObserver(revealObserver);
}

export const revealStyles = '';
