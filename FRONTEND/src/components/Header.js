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

            /* Wordmark */
            .ch-logo {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                text-decoration: none;
                flex-shrink: 0;
                line-height: 1;
                gap: 0;
            }
            .ch-logo-main {
                font-size: 20px;
                font-weight: 700;
                color: #0a0a0a;
                letter-spacing: -1.2px;
                font-family: 'IBM Plex Sans', sans-serif;
                line-height: 1;
                position: relative;
                display: inline-block;
            }
            /* Option C: Subtle red underline accent */
            .ch-logo-main::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 1.5px;
                background: #921818;
            }
            .ch-logo-sub {
                font-size: 8px;
                font-weight: 500;
                color: #921818;
                letter-spacing: 3.5px;
                font-family: 'IBM Plex Sans', sans-serif;
                margin-top: 5px;
                text-transform: uppercase;
                padding-left: 1px; /* optical nudge to counteract letter-spacing overhang */
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
                font-size: 12px;
                font-weight: 600;
                color: #4b5563;
                text-decoration: none;
                font-family: 'IBM Plex Sans', sans-serif;
                letter-spacing: 0.2px;
                transition: all 0.15s;
                position: relative;
                border-bottom: 2px solid transparent;
            }
            .nav-link:hover { color: #111; }
            .nav-link.active { 
                color: #111; 
                font-weight: 600;
                border-bottom-color: #752122;
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
                font-weight: 600;
                color: #fff;
                background: #752122;
                border: none;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.5px;
                transition: background 0.15s;
            }
            .ch-connect:hover { background: #5c1a1b; }

            /* User menu (authenticated) */
            .ch-user-menu {
                position: relative;
            }
            .ch-user-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                padding: 0;
                border-radius: 50%;
                background: #fff;
                border: 1px solid #e5e5e5;
                cursor: pointer;
                transition: all 0.15s;
            }
            .ch-user-btn:hover { border-color: #ccc; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            .ch-user-avatar {
                font-size: 14px;
                font-weight: 600;
                color: #111;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .ch-user-name, .ch-user-btn i { display: none; } /* Hide name and chevron for clean circle look */
            .ch-user-dropdown {
                position: absolute;
                right: 0;
                top: 100%;
                margin-top: 4px;
                width: 200px;
                background: #fff;
                border: 1px solid #e5e5e5;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                display: none;
                z-index: 100;
            }
            .ch-user-menu:hover .ch-user-dropdown,
            .ch-user-menu.open .ch-user-dropdown { display: block; }
            .ch-user-dropdown button {
                width: 100%;
                padding: 10px 14px;
                font-size: 11px;
                text-align: left;
                color: #333;
                background: transparent;
                border: none;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-user-dropdown button:hover { background: #f5f5f5; }
            .ch-user-dropdown .signout { color: #752122; }

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
                    <span class="ch-logo-main">COLLATERAL</span>
                    <span class="ch-logo-sub">MARKET</span>
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

                    <!-- Authenticated User Menu (hidden by default) -->
                    <div id="user-menu" class="ch-user-menu hidden">
                        <button id="user-menu-btn" onclick="window.app.toggleMenuPersistence(event)" class="ch-user-btn">
                            <span class="ch-user-avatar" id="menu-initial">U</span>
                            <span class="ch-user-name" id="menu-username">@username</span>
                            <i data-lucide="chevron-down" style="width: 12px; height: 12px; color: #999;"></i>
                        </button>
                        <div id="user-dropdown-content" class="ch-user-dropdown">
                            <button onclick="window.router.navigate('/profile')">MY IDENTITY</button>
                            <button onclick="window.router.navigate('/my-contracts')">MY CONTRACTS</button>
                            <button onclick="window.router.navigate('/receipts')">RECEIPTS</button>
                            <button onclick="window.router.navigate('/funding')">FUNDING</button>
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
