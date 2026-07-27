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

        // Add js-motion-active class ONLY after JS confirms runtime support
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

// Robust Entrance Observers for Scroll Animations (Safe initial viewport check)
export function initEntranceObservers() {
    motionController.init();

    const revealElement = (el) => {
        if (!el) return;
        el.classList.add('is-in');
        el.querySelectorAll('.r-item, .r-plate, .r-rule, .clip-wipe, .clip-reveal, .rise, .cm-rise, .card-rise, .item, .duel').forEach(child => {
            child.classList.add('is-in');
        });
    };

    const targets = document.querySelectorAll(
        'section, .reveal, .r-item, .r-plate, .receipt-card, .rc-card, .leaf, .reg, .cmp, .faq-item, .item, .duel, .calc-card, .hero'
    );

    const vh = window.innerHeight || 800;

    targets.forEach((el, idx) => {
        if (!el.style.getPropertyValue('--i')) {
            el.style.setProperty('--i', (idx % 6).toString());
        }

        // Bounding rect pre-check: reveal elements already in/near viewport on load
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.95 && rect.bottom > 0) {
            revealElement(el);
            return;
        }

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        revealElement(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });
            observer.observe(el);
            motionController.registerObserver(observer);
        } else {
            revealElement(el);
        }
    });
}

export const revealStyles = '';
