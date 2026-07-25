// Header Component - Refactored Navigation Drawer & Responsive Panel
export function renderHeader(currentRoute = '') {
    const isMarket = currentRoute === '/market' || currentRoute.startsWith('/market/');
    const isActiveContracts = currentRoute === '/my-contracts' || currentRoute.startsWith('/contracts/');
    const isLedger = currentRoute === '/ledger';
    const isSources = currentRoute === '/sources';
    const isProtocol = currentRoute === '/protocol' || currentRoute.startsWith('/protocol');
    const isCustodyTerminal = currentRoute === '/protocol?tab=terminal';
    const isDocs = currentRoute === '/docs';
    const isProfile = currentRoute === '/profile';
    const isReferrals = currentRoute === '/referrals';
    const isFunding = currentRoute === '/funding';

    const routes = [
        { path: '/market', label: 'MARKET', hasDropdown: true },
        { path: '/my-contracts', label: 'ACTIVE' },
        { path: '/ledger', label: 'LEDGER' },
        { path: '/sources', label: 'SOURCES' },
        { path: '/protocol', label: 'PROTOCOL', hasDropdown: true },
        { path: '/protocol?tab=terminal', label: 'CUSTODY TERMINAL' }
    ];

    // Desktop top-bar nav links
    const topNavItems = [
        { path: '/market', label: 'MARKET' },
        { path: '/my-contracts', label: 'ACTIVE' },
        { path: '/ledger', label: 'LEDGER' },
        { path: '/sources', label: 'SOURCES' },
        { path: '/protocol', label: 'PROTOCOL' },
        { path: '/protocol?tab=terminal', label: 'CUSTODY TERMINAL' }
    ].map(route => {
        const active = currentRoute === route.path || 
            (route.path === '/market' && isMarket) ||
            (route.path === '/my-contracts' && isActiveContracts) ||
            (route.path === '/protocol' && isProtocol && !isCustodyTerminal);

        return `<a href="#" onclick="window.router.navigate('${route.path}'); return false;" class="nav-link ${active ? 'active' : ''}" ${active ? 'aria-current="page"' : ''}>${route.label}</a>`;
    }).join('');

    return `
        <style>
            /* ══════════════════════════════════════════════════════════════
               NAVIGATION DRAWER & PANEL STYLES
               ══════════════════════════════════════════════════════════════ */
            .ch-header {
                width: 100%;
                border-bottom: 1px solid var(--rule, #DCD5C6);
                background: var(--paper, #FFFDF9) !important;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 50;
                height: 64px;
            }
            .ch-header-inner {
                width: 100%;
                padding: 0 28px;
                height: 100%;
                display: flex;
                align-items: center;
                gap: 40px;
            }
            .ch-logo-wordmark {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 16px;
                font-weight: 800;
                letter-spacing: 0.18em;
                color: var(--ink, #0E1420);
                text-decoration: none;
            }

            .ch-nav {
                display: none;
                align-items: center;
                gap: 24px;
                flex: 1;
            }
            @media (min-width: 1024px) {
                .ch-nav { display: flex; }
            }

            .nav-link {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.12em;
                color: var(--ink-3, #6E7686);
                text-decoration: none;
                padding: 8px 0;
                position: relative;
                transition: color 150ms ease;
            }
            .nav-link:hover { color: var(--ink, #0E1420); }
            .nav-link.active {
                color: var(--blood, #7A1C29);
                font-weight: 700;
            }
            .nav-link.active::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                right: 0;
                height: 2px;
                background: var(--blood, #7A1C29);
            }

            .ch-right {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-left: auto;
            }

            .ch-hamburger {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                cursor: pointer;
                color: var(--ink, #0E1420);
                transition: background 150ms ease, border-color 150ms ease;
            }
            .ch-hamburger:hover {
                background: var(--paper-deep, #E7E1D4);
                border-color: var(--rule-strong, #BDB3A0);
            }
            .ch-hamburger:focus-visible {
                outline: 2px solid var(--blood, #7A1C29);
                outline-offset: -2px;
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
                background: var(--ink, #0E1420);
                transition: transform 200ms ease, opacity 200ms ease;
                transform-origin: center;
            }
            .ch-hamburger.open .ch-hamburger-lines span:nth-child(1) { transform: translateY(5.25px) rotate(45deg); }
            .ch-hamburger.open .ch-hamburger-lines span:nth-child(2) { opacity: 0; }
            .ch-hamburger.open .ch-hamburger-lines span:nth-child(3) { transform: translateY(-5.25px) rotate(-45deg); }

            /* ════════ SCRIM / OVERLAY (Mobile <768px only) ════════ */
            .pnl-overlay {
                position: fixed;
                inset: 0;
                background: rgba(14, 20, 32, 0.4);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                z-index: 90;
                opacity: 0;
                visibility: hidden;
                transition: opacity 250ms ease, visibility 250ms ease;
            }
            .pnl-overlay.open {
                opacity: 1;
                visibility: visible;
            }
            @media (min-width: 768px) {
                .pnl-overlay { display: none !important; }
            }

            /* ════════ UNIVERSAL PANEL CONTAINER ════════ */
            .pnl-drawer {
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                height: 100vh;
                background: var(--paper, #FFFDF9);
                border-right: 1px solid var(--rule, #DCD5C6);
                z-index: 100;
                display: flex;
                flex-direction: column;
                box-shadow: 12px 0 36px rgba(14, 20, 32, 0.08);
                box-sizing: border-border;
            }

            /* Mobile (<768px): overlay drawer 85vw max 360px */
            @media (max-width: 767px) {
                .pnl-drawer {
                    width: 85vw;
                    max-width: 360px;
                    transform: translateX(-100%);
                    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
                }
                .pnl-drawer.open {
                    transform: translateX(0);
                }
            }

            /* Desktop (>=768px): 280px fixed panel flush to edge */
            @media (min-width: 768px) {
                .pnl-drawer {
                    width: 280px;
                    transform: translateX(-100%);
                    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
                }
                .pnl-drawer.open {
                    transform: translateX(0);
                }
            }

            /* Header row inside panel */
            .pnl-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid var(--rule, #DCD5C6);
                flex-shrink: 0;
                height: 64px;
                box-sizing: border-box;
            }
            .pnl-header-title {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.16em;
                color: var(--blood, #7A1C29);
            }
            .pnl-close {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: 1px solid var(--rule, #DCD5C6);
                border-radius: var(--r, 2px);
                cursor: pointer;
                color: var(--ink-3, #6E7686);
                transition: color 150ms ease, border-color 150ms ease, background 150ms ease;
            }
            .pnl-close:hover {
                color: var(--blood, #7A1C29);
                border-color: var(--blood, #7A1C29);
                background: rgba(122, 28, 41, 0.04);
            }
            .pnl-close:focus-visible {
                outline: 2px solid var(--blood, #7A1C29);
                outline-offset: -2px;
            }

            /* User identity card (No left border, accent means location only) */
            .pnl-user {
                display: none;
                align-items: center;
                gap: 14px;
                padding: 16px 20px;
                background: var(--paper-deep, #E7E1D4);
                border-bottom: 1px solid var(--rule, #DCD5C6);
                flex-shrink: 0;
            }
            .pnl-user.visible { display: flex; }
            .pnl-user-badge {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--ink, #0E1420);
                flex-shrink: 0;
                overflow: hidden;
            }
            .pnl-user-initial {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 15px;
                font-weight: 800;
                color: #FFF8F5;
            }
            .pnl-user-avatar {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: none;
            }
            .pnl-user-info {
                display: flex;
                flex-direction: column;
                min-width: 0;
            }
            .pnl-user-name {
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 14px;
                font-weight: 700;
                color: var(--ink, #0E1420);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .pnl-user-handle {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                color: var(--ink-3, #6E7686);
            }

            /* Capital Summary Block (Two columns directly under profile) */
            .pnl-capital-summary {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                padding: 14px 20px;
                background: var(--plate, #FFFDF9);
                border-bottom: 1px solid var(--rule, #DCD5C6);
                cursor: pointer;
                transition: background 150ms ease;
            }
            .pnl-capital-summary:hover {
                background: var(--paper-deep, #E7E1D4);
            }
            .pnl-cap-col {
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            .pnl-cap-lbl {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 9px;
                font-weight: 500;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--ink-3, #6E7686);
            }
            .pnl-cap-val {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 13px;
                font-weight: 700;
                font-variant-numeric: tabular-nums;
                color: var(--ink, #0E1420);
            }

            /* Body wrapper with scroll affordance mask */
            .pnl-body-wrap {
                position: relative;
                flex: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
            }
            .pnl-body {
                flex: 1;
                overflow-y: auto;
                padding: 12px 0;
                box-sizing: border-box;
            }
            .pnl-body::-webkit-scrollbar { width: 4px; }
            .pnl-body::-webkit-scrollbar-track { background: transparent; }
            .pnl-body::-webkit-scrollbar-thumb { background: var(--rule, #DCD5C6); }

            .pnl-scroll-mask {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 32px;
                background: linear-gradient(to bottom, transparent, var(--paper, #FFFDF9));
                pointer-events: none;
                transition: opacity 200ms ease;
                z-index: 10;
            }
            .pnl-scroll-mask.at-bottom { opacity: 0; }

            /* Group labels */
            .pnl-section-label {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.16em;
                color: var(--ink-3, #6E7686);
                padding: 14px 20px 6px;
            }

            /* Sticky parent group header */
            .pnl-nav-group-header {
                position: sticky;
                top: 0;
                z-index: 5;
                background: var(--paper, #FFFDF9);
                border-bottom: 1px solid var(--rule-light, #EFECE6);
            }

            /* Navigation Rows (Mobile >=44px, Desktop >=36px) */
            .pnl-nav-link, .pnl-acct-link {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                letter-spacing: 0.08em;
                text-transform: uppercase;
                text-decoration: none;
                background: transparent;
                border: none;
                border-left: 3px solid transparent;
                color: var(--ink, #0E1420);
                cursor: pointer;
                transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
                outline: none;
            }
            @media (max-width: 767px) {
                .pnl-nav-link, .pnl-acct-link {
                    min-height: 44px;
                    padding: 10px 20px;
                    font-size: 12px;
                }
            }
            @media (min-width: 768px) {
                .pnl-nav-link, .pnl-acct-link {
                    min-height: 36px;
                    padding: 8px 20px;
                    font-size: 11.5px;
                }
            }

            @media (hover: hover) {
                .pnl-nav-link:hover, .pnl-acct-link:hover {
                    background: rgba(122, 28, 41, 0.025);
                    color: var(--blood, #7A1C29);
                }
            }

            /* Parent Active State: 3px accent left rail + fill + accent text */
            .pnl-nav-link.active, .pnl-acct-link.active {
                border-left-color: var(--blood, #7A1C29) !important;
                background: rgba(122, 28, 41, 0.05) !important;
                color: var(--blood, #7A1C29) !important;
                font-weight: 700;
            }

            .pnl-nav-link:focus-visible, .pnl-acct-link:focus-visible, .pnl-subnav-link:focus-visible {
                outline: 2px solid var(--blood, #7A1C29);
                outline-offset: -2px;
            }

            /* Subnav Children */
            .pnl-subnav {
                display: none;
                flex-direction: column;
                background: rgba(14, 20, 32, 0.015);
                padding: 4px 0;
            }
            .pnl-nav-group.expanded .pnl-subnav {
                display: flex;
            }
            .pnl-chevron {
                transition: transform 200ms ease;
                color: var(--ink-3, #6E7686);
            }
            .pnl-nav-group.expanded .pnl-chevron {
                transform: rotate(180deg);
            }

            /* Child Active State: Accent text + 1px accent rail on indent guide only */
            .pnl-subnav-link {
                display: flex;
                align-items: center;
                padding: 8px 20px 8px 36px;
                min-height: 36px;
                font-family: var(--display, 'Archivo', sans-serif);
                font-size: 13px;
                font-weight: 500;
                color: var(--ink-2, #4A5464);
                text-decoration: none;
                border-left: 1px solid var(--rule, #DCD5C6);
                margin-left: 20px;
                transition: color 150ms ease, border-color 150ms ease;
                box-sizing: border-box;
            }
            @media (hover: hover) {
                .pnl-subnav-link:hover {
                    color: var(--blood, #7A1C29);
                    border-left-color: var(--blood, #7A1C29);
                }
            }
            .pnl-subnav-link.active {
                color: var(--blood, #7A1C29) !important;
                font-weight: 700 !important;
                border-left: 1px solid var(--blood, #7A1C29) !important;
                background: transparent !important;
            }

            /* Divider */
            .pnl-divider {
                height: 1px;
                background: var(--rule, #DCD5C6);
                margin: 12px 20px;
            }

            /* Sign out button */
            .pnl-signout {
                width: calc(100% - 40px);
                margin: 14px 20px 6px;
                min-height: 40px;
                padding: 10px 16px;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--blood, #7A1C29);
                background: rgba(122, 28, 41, 0.04);
                border: 1px solid rgba(122, 28, 41, 0.2);
                border-radius: var(--r, 2px);
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 150ms ease, border-color 150ms ease;
            }
            .pnl-signout:hover {
                background: rgba(122, 28, 41, 0.08);
                border-color: var(--blood, #7A1C29);
            }
            .pnl-signout:focus-visible {
                outline: 2px solid var(--blood, #7A1C29);
                outline-offset: -2px;
            }

            /* Connect promo block */
            .pnl-connect-section {
                padding: 16px 20px;
                border-top: 1px solid var(--rule, #DCD5C6);
                background: var(--paper-deep, #E7E1D4);
            }
            .pnl-connect-btn {
                width: 100%;
                min-height: 44px;
                background: var(--blood, #7A1C29);
                color: #FFF8F5;
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                border: none;
                border-radius: var(--r, 2px);
                cursor: pointer;
                transition: background 150ms ease;
            }
            .pnl-connect-btn:hover {
                background: #54111B;
            }

            /* Footer (Mobile collapsed <60px vs Desktop full grid) */
            .pnl-footer {
                border-top: 1px solid var(--rule, #DCD5C6);
                padding: 14px 20px;
                background: var(--paper-deep, #E7E1D4);
                flex-shrink: 0;
            }
            .pnl-status-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                user-select: none;
            }
            .pnl-status-left {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .pnl-status-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--win, #186B4A);
            }
            .pnl-status-text {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--ink, #0E1420);
            }
            .pnl-meta {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px 16px;
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px dotted var(--rule, #DCD5C6);
                transition: max-height 200ms ease, opacity 200ms ease;
            }
            @media (max-width: 767px) {
                .pnl-meta.collapsed {
                    display: none;
                }
            }

            .pnl-meta-item {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .pnl-meta-label {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 8.5px;
                font-weight: 500;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--ink-3, #6E7686);
            }
            .pnl-meta-value {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 11px;
                font-weight: 600;
                color: var(--ink, #0E1420);
            }

            .pnl-legal {
                display: flex;
                gap: 14px;
                margin-top: 12px;
                padding-top: 10px;
                border-top: 1px solid var(--rule, #DCD5C6);
            }
            .pnl-legal a {
                font-family: var(--mono, 'IBM Plex Mono', monospace);
                font-size: 9.5px;
                color: var(--ink-3, #6E7686);
                text-decoration: none;
            }
            .pnl-legal a:hover { color: var(--blood, #7A1C29); }

            /* Honor prefers-reduced-motion */
            @media (prefers-reduced-motion: reduce) {
                .pnl-drawer, .pnl-overlay, .pnl-subnav, .pnl-chevron, .pnl-scroll-mask {
                    transition: none !important;
                    animation: none !important;
                }
            }
        </style>

        <header class="ch-header">
            <div class="ch-header-inner">
                <!-- Logo -->
                <a href="#" onclick="window.router.navigate('/'); return false;" class="ch-logo-wordmark">
                    COLLATERAL
                </a>

                <!-- Nav Links (Desktop Top-Bar) -->
                <nav class="ch-nav" aria-label="Top Navigation">
                    ${topNavItems}
                </nav>

                <!-- Right Controls -->
                <div class="ch-right">
                    <button id="mobile-menu-btn" 
                            onclick="window.app.toggleMobileMenu()" 
                            class="ch-hamburger" 
                            aria-label="Toggle Navigation Menu"
                            aria-expanded="false"
                            aria-controls="mobile-menu">
                        <div class="ch-hamburger-lines">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>
            </div>
        </header>

        <!-- Scrim Overlay (Mobile <768px) -->
        <div id="mobile-menu-overlay" class="pnl-overlay" onclick="window.app.closeMobileMenu()"></div>

        <!-- Universal Navigation Panel -->
        <aside id="mobile-menu" 
               class="pnl-drawer" 
               role="dialog" 
               aria-modal="true" 
               aria-label="Navigation Menu">
            
            <div class="pnl-header">
                <span class="pnl-header-title">Menu</span>
                <button onclick="window.app.closeMobileMenu()" class="pnl-close" aria-label="Close menu">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>

            <!-- Profile Row (No accent left rail) -->
            <div id="mobile-user-section" class="pnl-user">
                <div class="pnl-user-badge">
                    <span class="pnl-user-initial" id="mobile-menu-initial">U</span>
                    <img class="pnl-user-avatar" id="mobile-menu-avatar" alt="" />
                </div>
                <div class="pnl-user-info">
                    <span class="pnl-user-name" id="mobile-menu-username">User</span>
                    <span class="pnl-user-handle" id="mobile-menu-handle">@user</span>
                </div>
            </div>

            <!-- Capital Summary Block (Tapping routes to /funding) -->
            <div id="mobile-capital-summary" class="pnl-capital-summary" onclick="window.app.closeMobileMenu(); window.router.navigate('/funding');">
                <div class="pnl-cap-col">
                    <span class="pnl-cap-lbl">AVAILABLE BALANCE</span>
                    <span class="pnl-cap-val">$2,500.00</span>
                </div>
                <div class="pnl-cap-col">
                    <span class="pnl-cap-lbl">OPEN EXPOSURE</span>
                    <span class="pnl-cap-val">$633,600.00</span>
                </div>
            </div>

            <!-- Body Wrapper with Bottom Scroll Affordance Mask -->
            <div class="pnl-body-wrap">
                <div class="pnl-body" id="pnl-body-scroll">
                    <nav aria-label="Sidebar Navigation">
                        <div class="pnl-section-label">NAVIGATION</div>

                        <!-- MARKET Group -->
                        <div class="pnl-nav-group ${isMarket ? 'expanded' : ''}">
                            <div class="pnl-nav-group-header">
                                <button class="pnl-nav-link ${isMarket ? 'active' : ''}" 
                                        onclick="window.app.toggleNavSection(this); return false;"
                                        aria-expanded="${isMarket ? 'true' : 'false'}"
                                        aria-controls="subnav-market">
                                    <span>MARKET</span>
                                    <svg class="pnl-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
                                </button>
                            </div>
                            <div class="pnl-subnav" id="subnav-market">
                                <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/market'); return false;" class="pnl-subnav-link ${(currentRoute === '/market' && !window.location.search.includes('type=rivalry')) ? 'active' : ''}">Solo Contracts</a>
                                <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/market?type=rivalry'); return false;" class="pnl-subnav-link ${(currentRoute === '/market' && window.location.search.includes('type=rivalry')) ? 'active' : ''}">Rivalry Contracts</a>
                            </div>
                        </div>

                        <!-- Top-Level Items -->
                        <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/my-contracts'); return false;" class="pnl-nav-link ${isActiveContracts ? 'active' : ''}" ${isActiveContracts ? 'aria-current="page"' : ''}>ACTIVE</a>
                        <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/ledger'); return false;" class="pnl-nav-link ${isLedger ? 'active' : ''}" ${isLedger ? 'aria-current="page"' : ''}>LEDGER</a>
                        <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/sources'); return false;" class="pnl-nav-link ${isSources ? 'active' : ''}" ${isSources ? 'aria-current="page"' : ''}>SOURCES</a>

                        <!-- PROTOCOL Group (Overview, Vision, Whitepaper, Economics) -->
                        <div class="pnl-nav-group ${(isProtocol && !isCustodyTerminal) ? 'expanded' : ''}">
                            <div class="pnl-nav-group-header">
                                <button class="pnl-nav-link ${(isProtocol && !isCustodyTerminal) ? 'active' : ''}" 
                                        onclick="window.app.toggleNavSection(this); return false;"
                                        aria-expanded="${(isProtocol && !isCustodyTerminal) ? 'true' : 'false'}"
                                        aria-controls="subnav-protocol">
                                    <span>PROTOCOL</span>
                                    <svg class="pnl-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
                                </button>
                            </div>
                            <div class="pnl-subnav" id="subnav-protocol">
                                <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/protocol?tab=overview'); return false;" class="pnl-subnav-link ${window.location.search.includes('tab=overview') ? 'active' : ''}">Overview</a>
                                <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/protocol?tab=vision'); return false;" class="pnl-subnav-link ${window.location.search.includes('tab=vision') ? 'active' : ''}">Vision</a>
                                <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/protocol?tab=whitepaper'); return false;" class="pnl-subnav-link ${window.location.search.includes('tab=whitepaper') ? 'active' : ''}">Whitepaper</a>
                                <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/protocol?tab=economics'); return false;" class="pnl-subnav-link ${window.location.search.includes('tab=economics') ? 'active' : ''}">Economics</a>
                            </div>
                        </div>

                        <!-- Promoted Custody Terminal Top-Level Item -->
                        <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/protocol?tab=terminal'); return false;" class="pnl-nav-link ${isCustodyTerminal ? 'active' : ''}" ${isCustodyTerminal ? 'aria-current="page"' : ''}>CUSTODY TERMINAL</a>

                        <!-- Account Group (Normalized uppercase without icons) -->
                        <div id="mobile-account-links" style="display:none;">
                            <div class="pnl-divider"></div>
                            <div class="pnl-section-label">ACCOUNT</div>
                            <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/profile'); return false;" class="pnl-acct-link ${isProfile ? 'active' : ''}">PROFILE</a>
                            <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/referrals'); return false;" class="pnl-acct-link ${isReferrals ? 'active' : ''}">REFERRALS</a>
                            <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/funding'); return false;" class="pnl-acct-link ${isFunding ? 'active' : ''}">ACCOUNT CAPITAL</a>
                            <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/docs'); return false;" class="pnl-acct-link ${isDocs ? 'active' : ''}">DOCUMENTATION</a>

                            <button id="pnl-signout-btn" onclick="window.app.closeMobileMenu(); window.app.handleSignOut()" class="pnl-signout" style="display:none;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                SIGN OUT
                            </button>
                        </div>

                        <!-- Connect Section (Logged out state) -->
                        <div id="mobile-connect-section" class="pnl-connect-section">
                            <button onclick="window.app.closeMobileMenu(); window.app.handleAuthClick()" id="btn-auth-mobile" class="pnl-connect-btn">
                                SIGN IN
                            </button>
                        </div>
                    </nav>
                </div>
                
                <!-- Bottom Scroll Affordance Mask -->
                <div id="pnl-scroll-mask" class="pnl-scroll-mask"></div>
            </div>

            <!-- Footer (Collapsed on mobile, expanded on desktop) -->
            <div class="pnl-footer">
                <div class="pnl-status-bar" onclick="window.app.toggleFooterMeta()">
                    <div class="pnl-status-left">
                        <div class="pnl-status-dot"></div>
                        <span class="pnl-status-text">ALL SYSTEMS OPERATIONAL</span>
                    </div>
                    <svg id="pnl-footer-chevron" class="pnl-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>

                <div id="pnl-footer-meta" class="pnl-meta collapsed">
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
                    <a href="https://x.com/collaboralcap" target="_blank" rel="noopener">X / Twitter</a>
                </div>
            </div>
        </aside>
    `;
}

export function initScrollEffects() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        revealEls.forEach(el => observer.observe(el));
    }
}
