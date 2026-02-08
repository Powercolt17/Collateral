// Shared Header Component - Institutional Light Design
export function renderHeader(currentRoute) {
    const routes = [
        { path: '/overview', label: 'Overview' },
        { path: '/ledger', label: 'Ledger' },
        { path: '/contracts', label: 'Contracts' },
        { path: '/docs', label: 'Docs' }
    ];

    const navItems = routes.map(route => {
        const isActive = currentRoute === route.path ||
            (route.path === '/contracts' && currentRoute.startsWith('/contracts')) ||
            (route.path === '/overview' && currentRoute === '/');

        return `
            <a href="#" 
                onclick="window.router.navigate('${route.path}'); return false;" 
                class="text-sm transition-all duration-150 pb-0.5 border-b-2 ${isActive
                ? 'text-[#1A1A1A] border-[#8B1818] font-medium'
                : 'text-[#6B6B6B] border-transparent hover:text-[#1A1A1A] hover:border-[#8B1818]'
            }"
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
                class="block w-full px-6 py-4 text-base border-b border-[#E8E6E3] ${isActive
                ? 'text-[#1A1A1A] bg-[#F8F7F5] border-l-4 border-l-[#8B1818] font-medium'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F8F7F5]'
            }">
                ${route.label}
            </a>
        `;
    }).join('');

    return `
        <style>
            /* Header responsive styles */
            .desktop-nav { display: none; }
            .desktop-auth { display: none; }
            .mobile-menu-btn { display: flex; }
            @media (min-width: 640px) {
                .desktop-nav { display: flex !important; }
                .desktop-auth { display: flex !important; }
                .mobile-menu-btn { display: none !important; }
            }
        </style>
        <header class="w-full border-b border-[#E8E6E3] bg-white fixed top-0 z-50">
            <div class="mx-auto max-w-[1200px] px-4 md:px-8 py-4">
                <div class="flex items-center justify-between">
                    <!-- LEFT: WORDMARK -->
                    <a href="#" onclick="window.router.navigate('/overview'); return false;" class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0">
                        <h1 
                            class="text-xl tracking-tight m-0 p-0 leading-none text-[#1A1A1A]"
                            style="font-weight: 600;"
                        >
                            Collateral
                        </h1>
                    </a>

                    <!-- CENTER: PRIMARY NAVIGATION -->
                    <nav class="desktop-nav items-center gap-8">
                        ${navItems}
                    </nav>

                    <!-- RIGHT: SYSTEM ZONE -->
                    <div class="flex items-center gap-6">
                        <!-- Guest State - hidden on mobile -->
                        <button onclick="window.app.handleAuthClick()" id="btn-auth" class="desktop-auth bg-[#8B1818] hover:bg-[#6B1212] text-white text-sm font-medium px-5 py-2.5 transition-all items-center gap-2">
                            <span>Sign In</span>
                        </button>

                        <!-- Authenticated State (Dropdown) - Hidden by default -->
                        <div id="user-menu" class="relative group hidden">
                            <button id="user-menu-btn" onclick="window.app.toggleMenuPersistence(event)" class="desktop-auth items-center gap-2 hover:opacity-70 transition-opacity duration-150">
                                <div class="w-7 h-7 bg-[#F8F7F5] border border-[#E8E6E3] rounded-full flex items-center justify-center">
                                    <span 
                                        class="text-xs leading-none text-[#1A1A1A] font-medium"
                                        id="menu-initial"
                                    >
                                        U
                                    </span>
                                </div>
                                <span 
                                    class="text-sm leading-none text-[#1A1A1A]"
                                    id="menu-username"
                                >
                                    @username
                                </span>
                                <svg 
                                    width="10" 
                                    height="6" 
                                    viewBox="0 0 10 6" 
                                    fill="none"
                                    class="transition-transform duration-200 group-hover:rotate-180 text-[#6B6B6B]"
                                >
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
                                </svg>
                            </button>

                            <!-- Dropdown Menu -->
                            <div id="user-dropdown-content" class="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E8E6E3] shadow-lg hidden group-hover:block origin-top z-50 rounded">
                                <div class="py-2">
                                    <button onclick="window.router.navigate('/profile')" class="w-full px-4 py-3 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F8F7F5] transition-colors duration-100">
                                        My Identity
                                    </button>
                                    <button onclick="window.router.navigate('/my-contracts')" class="w-full px-4 py-3 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F8F7F5] transition-colors duration-100">
                                        My Contracts
                                    </button>
                                    <button onclick="window.router.navigate('/receipts')" class="w-full px-4 py-3 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F8F7F5] transition-colors duration-100">
                                        Receipts
                                    </button>
                                    <button onclick="window.router.navigate('/funding')" class="w-full px-4 py-3 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F8F7F5] transition-colors duration-100">
                                        Funding & Payouts
                                    </button>
                                    <button onclick="window.app.openSettingsModal()" class="w-full px-4 py-3 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F8F7F5] transition-colors duration-100">
                                        Settings
                                    </button>
                                    
                                    <!-- Separator -->
                                    <div class="my-2 border-t border-[#E8E6E3]"></div>
                                    
                                    <!-- Sign Out -->
                                    <button onclick="window.app.handleSignOut()" class="w-full px-4 py-3 text-left text-sm text-[#8B1818] hover:bg-[#FEF2F2] transition-colors duration-100">
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Mobile Hamburger Menu Button - only visible on mobile -->
                        <button 
                            id="mobile-menu-btn" 
                            onclick="window.app.toggleMobileMenu()" 
                            class="mobile-menu-btn flex-col items-center justify-center w-10 h-10 gap-1.5"
                            aria-label="Toggle menu"
                        >
                            <span id="hamburger-line-1" class="block w-6 h-0.5 bg-[#1A1A1A] transition-all duration-300"></span>
                            <span id="hamburger-line-2" class="block w-6 h-0.5 bg-[#1A1A1A] transition-all duration-300"></span>
                            <span id="hamburger-line-3" class="block w-6 h-0.5 bg-[#1A1A1A] transition-all duration-300"></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu-overlay" class="fixed inset-0 bg-black/30 z-40 hidden sm:hidden" onclick="window.app.closeMobileMenu()"></div>

        <!-- Mobile Menu Drawer -->
        <div id="mobile-menu" class="fixed top-0 right-0 h-full w-72 bg-white z-50 transform translate-x-full transition-transform duration-300 ease-out sm:hidden shadow-xl border-l border-[#E8E6E3]">
            <!-- Mobile Menu Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E3]">
                <span class="text-sm font-semibold text-[#1A1A1A]">Menu</span>
                <button onclick="window.app.closeMobileMenu()" class="w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A]">
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
            <div class="px-6 py-4 border-t border-[#E8E6E3] mt-auto">
                <button onclick="window.app.closeMobileMenu(); window.app.handleAuthClick()" id="btn-auth-mobile" class="w-full bg-[#8B1818] hover:bg-[#6B1212] text-white text-sm font-medium px-5 py-3 transition-all flex items-center justify-center gap-2">
                    <span>Sign In</span>
                </button>
            </div>

            <!-- Mobile User Menu (Hidden when not authenticated) -->
            <div id="mobile-user-section" class="hidden px-6 py-4 border-t border-[#E8E6E3]">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 bg-[#F8F7F5] border border-[#E8E6E3] rounded-full flex items-center justify-center">
                        <span class="text-xs text-[#1A1A1A] font-medium" id="mobile-menu-initial">U</span>
                    </div>
                    <span class="text-sm text-[#6B6B6B]" id="mobile-menu-username">@username</span>
                </div>
                <div class="space-y-1">
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/profile')" class="w-full px-3 py-2 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F8F7F5]">
                        My Identity
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/my-contracts')" class="w-full px-3 py-2 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F8F7F5]">
                        My Contracts
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/funding')" class="w-full px-3 py-2 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F8F7F5]">
                        Funding
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.app.handleSignOut()" class="w-full px-3 py-2 text-left text-sm text-[#8B1818] hover:bg-[#FEF2F2]">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    `;
}
