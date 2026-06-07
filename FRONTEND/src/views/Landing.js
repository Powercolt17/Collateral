// Landing Page — /go — Cold-traffic conversion page
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

export function renderLanding() {
    return `
        <style>${landingCSS}</style>
        <style>@media(max-width:768px){.lp .ldesktop-proof{display:none!important}}</style>
        <div class="lp">

            <!-- LOADING BAR -->
            <div class="lloading-bar" id="lp-loading-bar"></div>

            <!-- NAV -->
            <nav class="ln">
                <div class="ln-in">
                    <a class="ln-brand" href="/">
                        <span class="logo-wordmark">Collateral</span>
                    </a>
                    <div style="display:flex; align-items:center;">
                        <button class="ln-cta" id="lp-nav-cta">Sign In</button>
                        <button class="ch-hamburger" id="mobile-menu-btn" aria-label="Menu" onclick="window.app.toggleMobileMenu()">
                            <div class="ch-hamburger-lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                    </div>
// Landing Page — /go — Cold-traffic conversion page
import api from '../api.js';
import { landingCSS } from './LandingStyles.js';

export function renderLanding() {
    return `
        <style>${landingCSS}</style>
        <style>@media(max-width:768px){.lp .ldesktop-proof{display:none!important}}</style>
        <div class="lp">

            <!-- LOADING BAR -->
            <div class="lloading-bar" id="lp-loading-bar"></div>

            <!-- NAV -->
            <nav class="ln">
                <div class="ln-in">
                    <a class="ln-brand" href="/">
                        <span class="logo-wordmark">Collateral</span>
                    </a>
                    <div style="display:flex; align-items:center;">
                        <button class="ln-cta" id="lp-nav-cta">Sign In</button>
                        <button class="ch-hamburger" id="mobile-menu-btn" aria-label="Menu" onclick="window.app.toggleMobileMenu()">
                            <div class="ch-hamburger-lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            <!-- ═══ HERO ═══ -->
            <div class="lhero-section">
            <div class="lw">
                <div class="lhero-grid">
                    <div class="lhero-left">
                        <h1 class="lh1 animate-fade-in-up">
                            <span class="lh-nobrk">Binding performance contracts</span><br class="lh-br">
                            <span class="lh-nobrk">for driven <em>founders.</em></span>
                        </h1>
                        <p class="lsub animate-fade-in-up delay-1">
                            Lock capital in escrow against a verifiable business metric. Hit your target, reclaim your deposit plus a performance bonus. <span class="lhide-mobile">Miss it, forfeit the capital. Everything is tracked automatically via APIs.</span>
                        </p>
                        <div class="lctas animate-fade-in-up delay-2">
                            <button class="lbtn lbtn-r" id="lp-hero-cta">Draft Your Contract</button>
                            <button class="lbtn lbtn-g" onclick="document.getElementById('contracts').scrollIntoView({behavior:'smooth'})">See Live Contracts</button>
                        </div>
                        <div class="lcta-match ldesktop-proof animate-fade-in-up delay-2">First contract matched up to $250</div>
                        <div class="ltrust-bar ldesktop-proof animate-fade-in-up delay-3">API-verified • Funds in escrow • Auto-settled</div>


                    </div>
                    <div class="lhero-right animate-scale-in delay-1">
                        <div class="lpreview-card">
                            <div class="lpcard-header">
                                <div class="lpcard-type">Performance Contract</div>
                                <div class="lpcard-status"><span class="lpcard-status-dot"></span>Live</div>
                            </div>
                            <div class="lpcard-divider"></div>
                            <div class="lpcard-title">Stripe Revenue Growth</div>
                            <div class="lpcard-terms">
                                <div class="lpcard-term"><span class="lpcard-term-k">Deposit</span><span class="lpcard-term-v">$250.00</span></div>
                                <div class="lpcard-term"><span class="lpcard-term-k">Target</span><span class="lpcard-term-v">+20% in 30 days</span></div>
                                <div class="lpcard-term"><span class="lpcard-term-k">Bonus Yield</span><span class="lpcard-term-v lpcard-term-highlight">+$750.00</span></div>
                                <div class="lpcard-term"><span class="lpcard-term-k">Verification</span><span class="lpcard-term-v">Stripe API</span></div>
                            </div>
                            <div class="lpcard-outcome">
                                <div class="lpcard-outcome-row lpcard-outcome-hit"><span class="lpcard-outcome-icon">↑</span><span class="lpcard-outcome-text">Hit Target</span><span class="lpcard-outcome-result">+$1,000</span></div>
                                <div class="lpcard-outcome-row lpcard-outcome-miss"><span class="lpcard-outcome-icon">↓</span><span class="lpcard-outcome-text">Miss Target</span><span class="lpcard-outcome-result">-$250</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>



            <!-- ═══ LOGO CAROUSEL ═══ -->
            <div class="lmarquee" data-r>
                <div class="lmarquee-label"><span class="lmono">Verified via official APIs</span></div>
                <div class="lmarquee-track">
                    <div class="lmarquee-slide">
                        <img class="logo-stripe" src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" alt="Stripe">
                        <img class="logo-x" src="https://cdn.simpleicons.org/x/555555" alt="X">
                        <img class="logo-shopify" src="https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" alt="Shopify">
                        <img class="logo-youtube" src="https://www.vectorlogo.zone/logos/youtube/youtube-ar21.svg" alt="YouTube">
                        <img class="logo-stripe" src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" alt="Stripe">
                        <img class="logo-x" src="https://cdn.simpleicons.org/x/555555" alt="X">
                        <img class="logo-shopify" src="https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" alt="Shopify">
                        <img class="logo-youtube" src="https://www.vectorlogo.zone/logos/youtube/youtube-ar21.svg" alt="YouTube">
                    </div>
                    <div class="lmarquee-slide">
                        <img class="logo-stripe" src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" alt="Stripe">
                        <img class="logo-x" src="https://cdn.simpleicons.org/x/555555" alt="X">
                        <img class="logo-shopify" src="https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" alt="Shopify">
                        <img class="logo-youtube" src="https://www.vectorlogo.zone/logos/youtube/youtube-ar21.svg" alt="YouTube">
                        <img class="logo-stripe" src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" alt="Stripe">
                        <img class="logo-x" src="https://cdn.simpleicons.org/x/555555" alt="X">
                        <img class="logo-shopify" src="https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" alt="Shopify">
                        <img class="logo-youtube" src="https://www.vectorlogo.zone/logos/youtube/youtube-ar21.svg" alt="YouTube">
                    </div>
                </div>
            </div>

            
            <div id="mobile-menu" class="pnl-drawer">
                <div class="pnl-header">
                    <div class="pnl-header-left">
                        <span class="pnl-header-title">Menu</span>
                    </div>
                    <button onclick="window.app.closeMobileMenu()" class="pnl-close" aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="pnl-body">
                    <!-- Navigation -->
                    <div class="pnl-section-label">Navigation</div>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.app.openAccessModal(); return false;" class="pnl-nav-link active" style="animation-delay: 0.06s"><span class="pnl-nav-indicator"></span>MARKET</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.09s"><span class="pnl-nav-indicator"></span>ACTIVE</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.12s"><span class="pnl-nav-indicator"></span>RIVALRY</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.15s"><span class="pnl-nav-indicator"></span>LEDGER</a>
                    <a href="#" onclick="window.app.closeMobileMenu(); window.app.openAccessModal(); return false;" class="pnl-nav-link" style="animation-delay: 0.18s"><span class="pnl-nav-indicator"></span>SOURCES</a>
                    
                    <!-- Connect -->
                    <div id="mobile-connect-section" class="pnl-connect-section">
                        <button onclick="window.app.closeMobileMenu(); window.app.openAccessModal()" id="btn-auth-mobile" class="pnl-connect-btn">
                            CONNECT
                        </button>
                    </div>
                </div>
                
                <div class="pnl-footer">
                    <div class="pnl-status">
                        <div class="pnl-status-dot"></div>
                        <span class="pnl-status-text">All systems operational</span>
                    </div>
                    <div class="pnl-meta">
                        <div class="pnl-meta-item">
                            <span class="pnl-meta-label">Protocol</span>
                            <span class="pnl-meta-value">v1.0</span>
                        </div>
                        <div class="pnl-meta-item">
                            <span class="pnl-meta-label">Network</span>
                            <span class="pnl-meta-value">Mainnet</span>
                        </div>
                        <div class="pnl-meta-item">
                            <span class="pnl-meta-label">Settlement</span>
                            <span class="pnl-meta-value">USD</span>
                        </div>
                        <div class="pnl-meta-item">
                            <span class="pnl-meta-label">Uptime</span>
                            <span class="pnl-meta-value">99.9%</span>
                        </div>
                    </div>
                    <div class="pnl-legal">
                        <a href="/terms" onclick="window.app.closeMobileMenu()">Terms</a>
                        <a href="/docs" onclick="window.app.closeMobileMenu()">Docs</a>
                        <a href="https://x.com/collaboralcap" target="_blank">X / Twitter</a>
                    </div>
                </div>
            </div>

        </div>
    `;
}

export function initLanding() {
    // Fade in page container
    setTimeout(() => {
        document.querySelector('.lp')?.classList.add('v');
    }, 50);

    // Animate progress loading bar
    const bar = document.getElementById('lp-loading-bar');
    if (bar) {
        bar.style.width = '30%';
        setTimeout(() => { bar.style.width = '70%'; }, 100);
        setTimeout(() => {
            bar.style.width = '100%';
            setTimeout(() => {
                bar.style.opacity = '0';
                setTimeout(() => { bar.style.display = 'none'; }, 300);
            }, 150);
        }, 450);
    }

    // Populate live toast notifications with real mock data
    setTimeout(async () => {
        try {
            const response = await window.api.getPublicLedger();
            if (response && response.events && response.events.length > 0) {
                let container = document.getElementById('l-toast-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'l-toast-container';
                    document.body.appendChild(container);
                }
                
                const timeAgo = (iso) => {
                    const diff = Math.floor((new Date() - new Date(iso)) / 60000);
                    if (diff < 1) return 'just now';
                    if (diff < 60) return `${diff}m ago`;
                    const h = Math.floor(diff / 60);
                    if (h < 24) return `${h}h ago`;
                    return `${Math.floor(h/24)}d ago`;
                };

                const formatAmt = (amt) => '$' + parseInt(amt, 10).toLocaleString();

                const recentEvents = response.events.slice(0, 10);
                let i = 0;
                
                const showToast = () => {
                    if (i >= recentEvents.length) i = 0;
                    const e = recentEvents[i];
                    i++;
                    
                    let amtClass = 'locked';
                    let amtPrefix = '';
                    let preAction = '@' + (e.principal || 'User');
                    let actionText = 'locked';
                    let amtRaw = (e.amountUsdCents || e.lockAmountUsdCents || 0) / 100;
                    
                    if (e.eventType === 'FUNDS_LOCKED' || e.eventType === 'EXECUTION_CONFIRMED' || e.eventType === 'CONTRACT_CREATED') {
                        actionText = `escrowed via ${e.platform || 'API'} oracle`;
                        amtPrefix = '';
                        amtClass = 'locked';
                    } else if (e.eventType === 'SETTLED_SUCCESS') {
                        actionText = `cleared settlement + yield`;
                        amtPrefix = '+';
                        amtClass = 'recovered';
                    } else if (e.eventType === 'SETTLED_FAILURE') {
                        actionText = `liquidated by ${e.platform || 'API'} oracle`;
                        amtPrefix = '-';
                        amtClass = 'liquidated';
                    }
                    
                    let displayAmt = formatAmt(amtRaw);

                    const toast = document.createElement('div');
                    toast.className = 'l-toast animate-slide-up';
                    toast.innerHTML = `<span class="lticker-time">${timeAgo(e.timestamp || e.created_at || new Date().toISOString())}</span> <span class="lticker-action">${preAction}</span> <span class="lticker-amt ${amtClass}">${amtPrefix}${displayAmt}</span> <span class="lticker-action">${actionText}</span>`;
                    
                    container.appendChild(toast);
                    
                    // Remove toast after 4.5 seconds
                    setTimeout(() => {
                        toast.classList.remove('animate-slide-up');
                        toast.classList.add('animate-slide-down');
                        setTimeout(() => toast.remove(), 500);
                    }, 4500);
                };
                
                showToast();
                setInterval(showToast, 6000);
            }
        } catch (err) {
            console.error('Failed to load ledger ticker data', err);
        }
    }, 100);

    const p = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source','utm_campaign','utm_medium','utm_content','utm_term'].forEach(k => { const v = p.get(k); if (v) utm[k] = v; });
    if (Object.keys(utm).length) sessionStorage.setItem('collateral_utm', JSON.stringify(utm));
    if (window.trackEvent) window.trackEvent('go_page_view', { source: utm.utm_source || 'direct', campaign: utm.utm_campaign || 'none' });

    function goAction(targetUrl = '/market') {
        if (window.appState?.isLoggedIn) {
            sessionStorage.removeItem('collateral_go_flow');
            sessionStorage.removeItem('collateral_go_target');
            window.router.navigate(targetUrl);
        } else {
            sessionStorage.setItem('collateral_go_flow', '1');
            sessionStorage.setItem('collateral_go_target', targetUrl);
            window.app.openAccessModal();
        }
    }

    // All CTAs route through goAction
    ['lp-hero-cta', 'lp-final-cta', 'lp-nav-cta'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); goAction();
            if (window.trackEvent) window.trackEvent('cta_click', { button: id, ...utm });
        });
    });
    document.querySelectorAll('.lp-cta-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const source = btn.getAttribute('data-source');
            const tier = btn.getAttribute('data-tier');
            const capital = btn.getAttribute('data-capital');
            let targetUrl = '/market';
            if (source && tier && capital) {
                targetUrl = `/contracts/execute?source=${source}&tier=${tier}&capital=${capital}`;
            }
            goAction(targetUrl);
            if (window.trackEvent) window.trackEvent('cta_click', { button: 'inline', source, tier, capital, ...utm });
        });
    });

    // FAQ
    document.querySelectorAll('.fq').forEach(item => {
        item.querySelector('.fq-q')?.addEventListener('click', () => item.classList.toggle('open'));
    });

    // Scroll reveal
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.lp [data-r]').forEach(el => obs.observe(el));

    // Count-up animation for stats
    const countEls = document.querySelectorAll('[data-count]');
    if (countEls.length) {
        const countObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const target = parseInt(el.dataset.count, 10);
                    let current = 0;
                    const step = Math.max(1, Math.floor(target / 30));
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) { current = target; clearInterval(interval); }
                        el.textContent = current;
                    }, 40);
                    countObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        countEls.forEach(el => countObs.observe(el));
    }
}
