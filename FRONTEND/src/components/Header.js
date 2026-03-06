// Header Component - Clearinghouse Terminal Nav
export function renderHeader(currentRoute) {
    const routes = [
        { path: '/overview', label: 'MARKET' },
        { path: '/contracts', label: 'ACTIVE' },
        { path: '/ledger', label: 'LEDGER' },
        { path: '/sources', label: 'SOURCES' },
        { path: '/docs', label: 'DOCS' }
    ];

    const navItems = routes.map(route => {
        const isActive = currentRoute === route.path ||
            (route.path === '/contracts' && (currentRoute === '/contracts' || currentRoute.startsWith('/contracts/'))) ||
            (route.path === '/overview' && currentRoute === '/');

        return `
            <a href="#" 
                onclick="window.router.navigate('${route.path}'); return false;" 
                class="nav-link ${isActive ? 'active' : ''}"
                data-target="${route.path}" 
                data-active="${isActive}">
                ${route.label}
            </a>
        `;
    }).join('');

    // Generate mobile navigation items
    const mobileNavItems = routes.map(route => {
        const isActive = currentRoute === route.path ||
            (route.path === '/contracts' && (currentRoute === '/contracts' || currentRoute.startsWith('/contracts/'))) ||
            (route.path === '/overview' && currentRoute === '/');

        return `
            <a href="#" 
                onclick="window.app.closeMobileMenu(); window.router.navigate('${route.path}'); return false;" 
                class="mobile-nav-link ${isActive ? 'active' : ''}">
                ${route.label}
            </a>
        `;
    }).join('');

    return `
        <style>
            /* Clearinghouse Header */
            .ch-header {
                width: 100%;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
                position: fixed;
                top: 0;
                z-index: 50;
                transition: background 0.4s ease,
                            border-color 0.4s ease,
                            box-shadow 0.4s ease,
                            backdrop-filter 0.4s ease;
            }
            .ch-header.nav-scrolled {
                background: rgba(255, 255, 255, 0.55) !important;
                backdrop-filter: blur(18px) saturate(180%);
                -webkit-backdrop-filter: blur(18px) saturate(180%);
                border-bottom-color: rgba(229, 229, 229, 0.35) !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 8px 32px rgba(0,0,0,0.03);
            }
            .ch-header::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent 0%, #921818 50%, transparent 100%);
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            .ch-header.nav-scrolled::after {
                opacity: 1;
            }

            /* ── Global Scroll Reveal ── */
            [data-reveal] {
                opacity: 0;
                transform: translateY(28px);
                transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                            transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
            }
            [data-reveal].revealed {
                opacity: 1;
                transform: translateY(0);
            }
            [data-reveal-delay="1"] { transition-delay: 0.1s; }
            [data-reveal-delay="2"] { transition-delay: 0.2s; }
            [data-reveal-delay="3"] { transition-delay: 0.3s; }


            /* ── Nav Link Underline Sweep ── */
            .nav-link::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 0;
                height: 2px;
                background: #921818;
                transition: width 0.3s ease, left 0.3s ease;
            }
            .nav-link:hover::after {
                width: 100%;
                left: 0;
            }
            .nav-link.active::after {
                width: 100%;
                left: 0;
            }
            .ch-header-inner {
                width: 100%;
                padding: 0 32px;
                height: 72px;
                display: flex;
                align-items: center;
                gap: 64px;
            }

            /* ── Wordmark ── */
            /* ── New Institutional Wordmark — POWERFUL ── */
            .ch-logo {
                display: inline-flex;
                align-items: center;
                text-decoration: none;
                flex-shrink: 0;
                gap: 12px;
            }
            .ch-logo-accent {
                width: 20px;
                height: 20px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .ch-logo-headline {
                font-size: 15px;
                font-weight: 600;
                color: #111111;
                letter-spacing: 0.2em;
                font-family: 'IBM Plex Sans', 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                text-transform: uppercase;
                margin: 0;
            }

            /* Nav links */
            .ch-nav {
                display: none;
                align-items: center;
                justify-content: center;
                gap: 24px;
                flex: 1;
            }
            @media (min-width: 768px) {
                .ch-nav { display: flex; }
            }
            .nav-link {
                padding: 26px 4px; /* Height of header to create clickable area */
                font-size: 13px;
                font-weight: 600;
                color: #333333;
                text-decoration: none;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                letter-spacing: 0.1px;
                transition: color 0.12s;
                position: relative;
                border-bottom: 2px solid transparent;
            }
            .nav-link:hover { color: #000000; }
            .nav-link.active {
                color: #111111;
                font-weight: 700;
                border-bottom-color: #921818;
            }

            /* Search bar */
            .ch-search {
                max-width: 280px;
                width: 280px;
                position: relative;
                display: none;
            }
            @media (min-width: 1024px) {
                .ch-search { display: block; }
            }
            .ch-search input {
                width: 100%;
                height: 36px;
                padding: 0 12px 0 36px;
                font-size: 13px;
                border: 1px solid #e5e5e5;
                background: #fafafa;
                font-family: 'Inter', sans-serif;
                color: #333;
            }
            .ch-search input::placeholder {
                color: #999;
            }
            .ch-search input:focus {
                outline: none;
                border-color: #ccc;
                background: #fff;
            }
            .ch-search-icon {
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: #999;
            }

            /* Dropdowns */
            .ch-dropdown {
                display: none;
                align-items: center;
                gap: 4px;
                padding: 6px 10px;
                font-size: 11px;
                font-weight: 500;
                color: #666;
                border: 1px solid #e5e5e5;
                background: #fff;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
            }
            @media (min-width: 768px) {
                .ch-dropdown { display: flex; }
            }
            .ch-dropdown:hover { border-color: #ccc; }
            .ch-dropdown-label { color: #999; font-weight: 400; }

            /* Right section */
            .ch-right {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-left: auto;
            }

            /* User icons */
            .ch-icon-btn {
                width: 36px;
                height: 36px;
                display: none;
                align-items: center;
                justify-content: center;
                color: #666;
                background: transparent;
                border: none;
                cursor: pointer;
                transition: color 0.15s;
            }
            @media (min-width: 768px) {
                .ch-icon-btn { display: flex; }
            }
            .ch-icon-btn:hover { color: #0a0a0a; }

            /* Connect button */
            .ch-connect {
                padding: 8px 16px;
                font-size: 11px;
                font-weight: 700;
                color: #fff;
                background: #111111;
                border: none;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                transition: background 0.12s;
            }
            .ch-connect:hover { background: #921818; }

            /* Account badge — institutional */
            .ch-user-menu {
                position: relative;
            }
            .ch-user-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 0;
                background: transparent;
                border: none;
                cursor: pointer;
            }
            .ch-user-badge {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #fff;
                border: 1px solid #E5E5E5;
                transition: background 0.1s, border-color 0.1s;
            }
            .ch-user-btn:hover .ch-user-badge {
                background: #F7F7F7;
                border-color: #DCDCDC;
            }
            .ch-user-initials {
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 12px;
                font-weight: 700;
                color: #111111;
                letter-spacing: -0.3px;
                line-height: 1;
            }
            .ch-user-label-wrap {
                display: none;
                flex-direction: column;
                align-items: flex-start;
                gap: 0;
            }
            @media (min-width: 1024px) {
                .ch-user-label-wrap { display: flex; }
            }
            .ch-user-label-id {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                color: #111111;
                letter-spacing: -0.2px;
                line-height: 1;
            }
            .ch-user-label-role {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                color: #8A8A8A;
                line-height: 1;
                margin-top: 3px;
            }
            .ch-user-chevron {
                color: #CCCCCC;
                transition: color 0.1s;
            }
            .ch-user-btn:hover .ch-user-chevron { color: #888; }

            /* Account dropdown */
            .ch-user-dropdown {
                position: absolute;
                right: 0;
                top: 100%;
                margin-top: 6px;
                width: 200px;
                background: #fff;
                border: 1px solid #E5E5E5;
                box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                display: none;
                z-index: 100;
            }
            .ch-user-menu:hover .ch-user-dropdown,
            .ch-user-menu.open .ch-user-dropdown { display: block; }
            .ch-user-dropdown button {
                width: 100%;
                padding: 10px 14px;
                font-size: 10px;
                font-weight: 700;
                text-align: left;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #333333;
                background: transparent;
                border: none;
                border-bottom: 1px solid #F5F5F5;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                transition: background 0.1s;
            }
            .ch-user-dropdown button:last-child { border-bottom: none; }
            .ch-user-dropdown button:hover { background: #FAFAFA; }
            .ch-user-dropdown .signout { color: #921818; }

            /* Notification dropdown */
            .ch-notif-wrap { position: relative; }
            .ch-notif-panel {
                position: absolute;
                right: 0;
                top: 100%;
                margin-top: 6px;
                width: 320px;
                background: #fff;
                border: 1px solid #E5E5E5;
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                display: none;
                z-index: 100;
                max-height: 360px;
                overflow-y: auto;
            }
            .ch-notif-wrap.open .ch-notif-panel { display: block; }
            .ch-notif-hd {
                padding: 10px 14px;
                border-bottom: 1px solid #f0f0f0;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-notif-item {
                padding: 10px 14px;
                border-bottom: 1px solid #f5f5f5;
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                transition: background 0.1s;
                font-size: 12px;
            }
            .ch-notif-item:hover { background: #fafafa; }
            .ch-notif-item:last-child { border-bottom: none; }
            .ch-notif-icon {
                width: 28px; height: 28px;
                border-radius: 6px;
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0; font-size: 11px;
            }
            .ch-notif-icon.exec { background: #fef2f2; color: #752122; }
            .ch-notif-icon.settle { background: #f0fdf4; color: #166534; }
            .ch-notif-icon.forfeit { background: #fef2f2; color: #991b1b; }
            .ch-notif-text { flex: 1; color: #444; font-weight: 500; }
            .ch-notif-time { font-size: 10px; color: #999; font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
            .ch-notif-empty {
                padding: 24px 14px;
                text-align: center;
                font-size: 11px;
                color: #999;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-notif-badge {
                position: absolute;
                top: 4px; right: 4px;
                width: 7px; height: 7px;
                background: #752122;
                border-radius: 50%;
                display: none;
            }
            .ch-notif-wrap.has-items .ch-notif-badge { display: block; }

            /* Mobile menu button */
            .ch-mobile-btn {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 8px;
                background: transparent;
                border: none;
                cursor: pointer;
            }
            @media (min-width: 768px) {
                .ch-mobile-btn { display: none; }
            }
            .ch-mobile-btn span {
                width: 20px;
                height: 2px;
                background: #333;
                transition: all 0.2s;
            }

            /* Mobile menu */
            .ch-mobile-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.5);
                z-index: 40;
                display: none;
            }
            .ch-mobile-menu {
                position: fixed;
                top: 0;
                right: 0;
                width: 280px;
                height: 100%;
                background: #fff;
                z-index: 50;
                transform: translateX(100%);
                transition: transform 0.3s;
                padding: 20px;
            }
            .ch-mobile-menu.open { transform: translateX(0); }
            .mobile-nav-link {
                display: block;
                padding: 12px 0;
                font-size: 14px;
                color: #333;
                text-decoration: none;
                border-bottom: 1px solid #f0f0f0;
                font-family: 'JetBrains Mono', monospace;
            }
            .mobile-nav-link.active { color: #752122; font-weight: 600; }
        </style>

        <header class="ch-header">
            <div class="ch-header-inner">
                <!-- Logo -->
                <a href="#" onclick="window.router.navigate('/overview'); return false;" class="ch-logo">
                    <img src="/logo.svg" alt="Collateral" style="height:36px;width:auto;" />
                </a>

                <!-- Nav Links -->
                <nav class="ch-nav">
                    ${navItems}
                </nav>

                <!-- Right Section -->
                <div class="ch-right">
                    <!-- Search Bar -->
                    <div class="ch-search">
                        <i data-lucide="search" class="ch-search-icon" style="width: 16px; height: 16px;"></i>
                        <input type="text" id="global-search" placeholder="Search RCPT or Provider..." onkeydown="if(event.key==='Enter'){const q=this.value.trim();if(q){window.router.navigate('/contracts');setTimeout(()=>{const s=document.getElementById('ac-search');if(s){s.value=q;s.dispatchEvent(new Event('input'));}},200);}this.blur();}">
                    </div>

                    <!-- Notification Bell -->
                    <div class="ch-notif-wrap" id="notif-wrap">
                        <button class="ch-icon-btn" onclick="window.app.toggleNotifications(event)">
                            <i data-lucide="bell" style="width: 18px; height: 18px;"></i>
                            <div class="ch-notif-badge"></div>
                        </button>
                        <div class="ch-notif-panel" id="notif-panel">
                            <div class="ch-notif-hd">Recent Activity</div>
                            <div id="notif-list">
                                <div class="ch-notif-empty">Loading...</div>
                            </div>
                        </div>
                    </div>
                    <button class="ch-icon-btn" onclick="window.router.navigate('/profile')">
                        <i data-lucide="user" style="width: 18px; height: 18px;"></i>
                    </button>

                    <!-- Connect / User Button -->
                    <button onclick="window.app.handleAuthClick()" id="btn-auth" class="ch-connect">
                        CONNECT
                    </button>

                    <!-- Authenticated Account Badge (hidden by default) -->
                    <div id="user-menu" class="ch-user-menu hidden">
                        <button id="user-menu-btn" onclick="window.app.toggleMenuPersistence(event)" class="ch-user-btn">
                            <div class="ch-user-badge">
                                <span class="ch-user-initials" id="menu-initial">U</span>
                            </div>
                            <div class="ch-user-label-wrap">
                                <span class="ch-user-label-id" id="menu-username">OPERATOR</span>
                                <span class="ch-user-label-role">CLEARING ACCOUNT</span>
                            </div>
                            <i data-lucide="chevron-down" class="ch-user-chevron" style="width: 12px; height: 12px;"></i>
                        </button>
                        <div id="user-dropdown-content" class="ch-user-dropdown">
                            <button onclick="window.router.navigate('/profile')">Profile</button>
                            <button onclick="window.router.navigate('/contracts')">Active</button>
                            <button onclick="window.router.navigate('/referrals')">Referrals</button>
                            <button onclick="window.router.navigate('/receipts')">Ledger Receipts</button>
                            <button onclick="window.router.navigate('/funding')">Account Capital</button>
                            <button onclick="window.app.handleSignOut()" class="signout">SIGN OUT</button>
                        </div>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button id="mobile-menu-btn" onclick="window.app.toggleMobileMenu()" class="ch-mobile-btn" aria-label="Menu">
                        <span id="hamburger-line-1"></span>
                        <span id="hamburger-line-2"></span>
                        <span id="hamburger-line-3"></span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu-overlay" class="ch-mobile-overlay" onclick="window.app.closeMobileMenu()"></div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="ch-mobile-menu">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <span style="font-size: 14px; font-weight: 600; font-family: 'JetBrains Mono', monospace;">MENU</span>
                <button onclick="window.app.closeMobileMenu()" style="background: none; border: none; cursor: pointer;">
                    <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                </button>
            </div>
            <nav>
                ${mobileNavItems}
            </nav>
            <div style="margin-top: 20px;">
                <button onclick="window.app.closeMobileMenu(); window.app.handleAuthClick()" id="btn-auth-mobile" class="ch-connect" style="width: 100%;">
                    CONNECT
                </button>
            </div>
        </div>
    `;
}

/**
 * Initialize scroll effects:
 * 1. Transparent glass navbar on scroll
 * 2. IntersectionObserver scroll-reveal animations
 * Call this AFTER the header HTML is injected into the DOM.
 */
export function initScrollEffects() {
    // ── Scroll-Transparent Navbar ──
    const header = document.querySelector('.ch-header');
    if (header) {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY > 60) {
                        header.classList.add('nav-scrolled');
                    } else {
                        header.classList.remove('nav-scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ── Scroll Reveal (IntersectionObserver) ──
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        revealEls.forEach(el => observer.observe(el));
    }
}
