// Header Component - Clearinghouse Terminal Nav
export function renderHeader(currentRoute) {
    const routes = [
        { path: '/overview', label: 'MARKET' },
        { path: '/ledger', label: 'LEDGER' },
        { path: '/contracts', label: 'CONTRACTS' },
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
            }
            .ch-header-inner {
                width: 100%;
                padding: 0 32px;
                height: 72px;
                display: flex;
                align-items: center;
                gap: 40px;
            }

            /* ── Wordmark ── */
            .ch-logo {
                display: inline-flex;
                align-items: center;
                text-decoration: none;
                flex-shrink: 0;
            }
            .ch-logo-text {
                font-size: 17px;
                font-weight: 600;
                color: #111111;
                letter-spacing: -0.02em;
                font-family: 'IBM Plex Sans', sans-serif;
                line-height: 1;
            }

            /* Nav links */
            .ch-nav {
                display: none;
                align-items: center;
                gap: 4px;
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
                font-family: 'IBM Plex Sans', sans-serif;
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
                flex: 1;
                max-width: 400px;
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
                font-family: 'IBM Plex Mono', monospace;
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
                font-family: 'IBM Plex Sans', sans-serif;
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
                font-family: 'IBM Plex Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                color: #111111;
                letter-spacing: -0.2px;
                line-height: 1;
            }
            .ch-user-label-role {
                font-family: 'IBM Plex Mono', monospace;
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
                font-family: 'IBM Plex Mono', monospace;
                transition: background 0.1s;
            }
            .ch-user-dropdown button:last-child { border-bottom: none; }
            .ch-user-dropdown button:hover { background: #FAFAFA; }
            .ch-user-dropdown .signout { color: #921818; }

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
                    <span class="ch-logo-text">COLLATERAL</span>
                </a>

                <!-- Nav Links -->
                <nav class="ch-nav">
                    ${navItems}
                </nav>

                <!-- Search Bar -->
                <div class="ch-search">
                    <i data-lucide="search" class="ch-search-icon" style="width: 16px; height: 16px;"></i>
                    <input type="text" placeholder="Search RCPT or Provider...">
                </div>

                <!-- Right Section -->
                <div class="ch-right">
                    <!-- Status Dropdown -->
                    <button class="ch-dropdown">
                        <span class="ch-dropdown-label">STATUS:</span>
                        <span>ALL</span>
                        <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
                    </button>

                    <!-- Sort Dropdown -->
                    <button class="ch-dropdown">
                        <span class="ch-dropdown-label">SORT:</span>
                        <span>CAPITAL</span>
                        <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
                    </button>

                    <!-- Icon Buttons -->
                    <button class="ch-icon-btn">
                        <i data-lucide="bell" style="width: 18px; height: 18px;"></i>
                    </button>
                    <button class="ch-icon-btn">
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
                            <button onclick="window.router.navigate('/profile')">MY IDENTITY</button>
                            <button onclick="window.router.navigate('/my-contracts')">MY CONTRACTS</button>
                            <button onclick="window.router.navigate('/receipts')">RECEIPTS</button>
                            <button onclick="window.router.navigate('/funding')">CAPITAL</button>
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
