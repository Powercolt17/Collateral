// Shared Header Component - Institutional Design
export function renderHeader(currentRoute) {
    const routes = [
        { path: '/overview', label: 'OVERVIEW' },
        { path: '/ledger', label: 'LEDGER' },
        { path: '/contracts', label: 'CONTRACTS' },
        { path: '/docs', label: 'DOCS' }
    ];

    const navItems = routes.map(route => {
        const isActive = currentRoute === route.path ||
            (route.path === '/contracts' && currentRoute.startsWith('/contracts')) ||
            (route.path === '/overview' && currentRoute === '/');

        return `
            <a href="#" 
                onclick="window.router.navigate('${route.path}'); return false;" 
                class="text-sm tracking-wide transition-all duration-150 pb-0.5 border-b-2 ${isActive
                ? 'text-black border-[#751212]'
                : 'text-black/70 border-transparent hover:text-black hover:border-[#751212]'
            }"
                style="font-family: 'Inter', sans-serif; font-weight: 500;"
                data-target="${route.path}" 
                data-active="${isActive}">
                ${route.label}
            </a>
        `;
    }).join('');

    // Generate mobile navigation items
    const mobileNavItems = routes.map(route => {
        const isActive = currentRoute === route.path ||
            (route.path === '/contracts' && currentRoute.startsWith('/contracts')) ||
            (route.path === '/overview' && currentRoute === '/');

        return `
            <a href="#" 
                onclick="window.app.closeMobileMenu(); window.router.navigate('${route.path}'); return false;" 
                class="block w-full px-6 py-4 text-base tracking-wide border-b border-black/10 ${isActive
                ? 'text-black bg-black/5 border-l-4 border-l-[#751212]'
                : 'text-black/70 hover:text-black hover:bg-black/5'
            }"
                style="font-family: 'Inter', sans-serif; font-weight: 500;">
                ${route.label}
            </a>
        `;
    }).join('');

    return `
        <header class="w-full border-b border-black/10 bg-white fixed top-0 z-50">
            <div class="mx-auto max-w-[1600px] px-4 md:px-8 py-4">
                <div class="flex items-center justify-between">
                    <!-- LEFT: WORDMARK -->
                    <a href="#" onclick="window.router.navigate('/overview'); return false;" class="flex flex-col gap-0.5 items-center cursor-pointer hover:opacity-80 transition-opacity shrink-0">
                        <h1 
                            class="text-xl tracking-tight m-0 p-0 leading-none"
                            style="font-family: 'IBM Plex Sans', sans-serif; font-weight: 600;"
                        >
                            COLLATERAL
                        </h1>
                        <span 
                            class="text-xs tracking-widest uppercase leading-none"
                            style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #751212;"
                        >
                            MARKET
                        </span>
                    </a>

                    <!-- CENTER: PRIMARY NAVIGATION - visible on sm+ screens -->
                    <nav class="hidden sm:flex items-center gap-8">
                        ${navItems}
                    </nav>

                    <!-- RIGHT: SYSTEM ZONE -->
                    <div class="flex items-center gap-6">
                        <!-- System Status Indicator - hidden on small screens -->
                        <div class="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-black/10">
                            <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span 
                                class="text-[10px] tracking-widest uppercase leading-none"
                                style="font-family: 'JetBrains Mono', monospace; font-weight: 500;"
                            >
                                SYSTEM: OPERATIONAL
                            </span>
                        </div>

                        <!-- Guest State - hidden on mobile -->
                        <button onclick="window.app.handleAuthClick()" id="btn-auth" class="hidden sm:flex bg-black hover:bg-gray-800 text-white text-xs font-medium px-5 py-2.5 transition-all items-center gap-2 uppercase tracking-wide" style="font-family: 'Inter', sans-serif;">
                            <span>Sign In</span>
                        </button>

                        <!-- Authenticated State (Dropdown) - Hidden by default -->
                        <div id="user-menu" class="relative group hidden">
                            <button id="user-menu-btn" onclick="window.app.toggleMenuPersistence(event)" class="hidden sm:flex items-center gap-2 hover:opacity-70 transition-opacity duration-150">
                                <div class="w-6 h-6 border border-black/20 flex items-center justify-center">
                                    <span 
                                        class="text-[10px] leading-none"
                                        style="font-family: 'JetBrains Mono', monospace; font-weight: 500;"
                                        id="menu-initial"
                                    >
                                        U
                                    </span>
                                </div>
                                <span 
                                    class="text-xs tracking-wide leading-none"
                                    style="font-family: 'JetBrains Mono', monospace; font-weight: 400;"
                                    id="menu-username"
                                >
                                    @username
                                </span>
                                <svg 
                                    width="10" 
                                    height="6" 
                                    viewBox="0 0 10 6" 
                                    fill="none"
                                    class="transition-transform duration-200 group-hover:rotate-180"
                                >
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
                                </svg>
                            </button>

                            <!-- Dropdown Menu -->
                            <div id="user-dropdown-content" class="absolute right-0 top-full mt-2 w-56 bg-white border border-black/10 shadow-sm hidden group-hover:block origin-top z-50">
                                <div class="py-2">
                                    <button onclick="window.router.navigate('/profile')" class="w-full px-4 py-3 text-left text-xs tracking-wide hover:bg-black/5 transition-colors duration-100 uppercase" style="font-family: 'JetBrains Mono', monospace; font-weight: 400;">
                                        MY IDENTITY RECORD
                                    </button>
                                    <button onclick="window.router.navigate('/my-contracts')" class="w-full px-4 py-3 text-left text-xs tracking-wide hover:bg-black/5 transition-colors duration-100 uppercase" style="font-family: 'JetBrains Mono', monospace; font-weight: 400;">
                                        MY CONTRACTS
                                    </button>
                                    <button onclick="window.router.navigate('/receipts')" class="w-full px-4 py-3 text-left text-xs tracking-wide hover:bg-black/5 transition-colors duration-100 uppercase" style="font-family: 'JetBrains Mono', monospace; font-weight: 400;">
                                        RECEIPTS
                                    </button>
                                    <button onclick="window.router.navigate('/funding')" class="w-full px-4 py-3 text-left text-xs tracking-wide hover:bg-black/5 transition-colors duration-100 uppercase" style="font-family: 'JetBrains Mono', monospace; font-weight: 400;">
                                        FUNDING & PAYOUTS
                                    </button>
                                    <button onclick="window.app.openSettingsModal()" class="w-full px-4 py-3 text-left text-xs tracking-wide hover:bg-black/5 transition-colors duration-100 uppercase" style="font-family: 'JetBrains Mono', monospace; font-weight: 400;">
                                        SETTINGS
                                    </button>
                                    
                                    <!-- Separator -->
                                    <div class="my-2 border-t border-black/10"></div>
                                    
                                    <!-- Sign Out -->
                                    <button onclick="window.app.handleSignOut()" class="w-full px-4 py-3 text-left text-xs tracking-wide hover:bg-black/5 transition-colors duration-100 uppercase" style="font-family: 'JetBrains Mono', monospace; font-weight: 400; color: #751212;">
                                        SIGN OUT
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Mobile Hamburger Menu Button - only visible on mobile -->
                        <button 
                            id="mobile-menu-btn" 
                            onclick="window.app.toggleMobileMenu()" 
                            class="sm:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5"
                            aria-label="Toggle menu"
                        >
                            <span id="hamburger-line-1" class="block w-6 h-0.5 bg-black transition-all duration-300"></span>
                            <span id="hamburger-line-2" class="block w-6 h-0.5 bg-black transition-all duration-300"></span>
                            <span id="hamburger-line-3" class="block w-6 h-0.5 bg-black transition-all duration-300"></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu-overlay" class="fixed inset-0 bg-black/50 z-40 hidden sm:hidden" onclick="window.app.closeMobileMenu()"></div>

        <!-- Mobile Menu Drawer -->
        <div id="mobile-menu" class="fixed top-0 right-0 h-full w-72 bg-white z-50 transform translate-x-full transition-transform duration-300 ease-out sm:hidden shadow-xl">
            <!-- Mobile Menu Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-black/10">
                <span class="text-sm font-semibold tracking-wide uppercase" style="font-family: 'Inter', sans-serif;">Menu</span>
                <button onclick="window.app.closeMobileMenu()" class="w-8 h-8 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Mobile Navigation Links -->
            <nav class="flex flex-col">
                ${mobileNavItems}
            </nav>

            <!-- Mobile Auth Section -->
            <div class="px-6 py-4 border-t border-black/10 mt-auto">
                <button onclick="window.app.closeMobileMenu(); window.app.handleAuthClick()" id="btn-auth-mobile" class="w-full bg-black hover:bg-gray-800 text-white text-sm font-medium px-5 py-3 transition-all flex items-center justify-center gap-2 uppercase tracking-wide" style="font-family: 'Inter', sans-serif;">
                    <span>Sign In</span>
                </button>
            </div>

            <!-- Mobile User Menu (Hidden when not authenticated) -->
            <div id="mobile-user-section" class="hidden px-6 py-4 border-t border-black/10">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 border border-black/20 flex items-center justify-center">
                        <span class="text-xs" style="font-family: 'JetBrains Mono', monospace;" id="mobile-menu-initial">U</span>
                    </div>
                    <span class="text-sm" style="font-family: 'JetBrains Mono', monospace;" id="mobile-menu-username">@username</span>
                </div>
                <div class="space-y-1">
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/profile')" class="w-full px-3 py-2 text-left text-xs tracking-wide hover:bg-black/5 uppercase" style="font-family: 'JetBrains Mono', monospace;">
                        MY IDENTITY
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/my-contracts')" class="w-full px-3 py-2 text-left text-xs tracking-wide hover:bg-black/5 uppercase" style="font-family: 'JetBrains Mono', monospace;">
                        MY CONTRACTS
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/funding')" class="w-full px-3 py-2 text-left text-xs tracking-wide hover:bg-black/5 uppercase" style="font-family: 'JetBrains Mono', monospace;">
                        FUNDING
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.app.handleSignOut()" class="w-full px-3 py-2 text-left text-xs tracking-wide hover:bg-black/5 uppercase" style="font-family: 'JetBrains Mono', monospace; color: #751212;">
                        SIGN OUT
                    </button>
                </div>
            </div>
        </div>
    `;
}
