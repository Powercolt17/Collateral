// Shared Header Component - Original Institutional Design
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
                class="text-xs tracking-wide transition-all duration-150 ${isActive
                ? 'text-[#1A1A1A] font-medium border-b-2 border-[#1A1A1A] pb-1'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
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
                class="block w-full px-6 py-4 text-sm tracking-wide border-b border-[#F0F0F0] ${isActive
                ? 'text-[#1A1A1A] font-medium bg-[#FAFAFA]'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#FAFAFA]'
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
        <header class="w-full border-b border-[#E5E5E5] bg-white fixed top-0 z-50">
            <div class="mx-auto max-w-[1000px] px-6 md:px-8 py-4">
                <div class="flex items-center justify-between">
                    <!-- LEFT: WORDMARK -->
                    <a href="#" onclick="window.router.navigate('/overview'); return false;" class="flex flex-col gap-0 items-start cursor-pointer hover:opacity-80 transition-opacity shrink-0">
                        <span class="text-base font-semibold tracking-tight text-[#1A1A1A]">COLLATERAL</span>
                        <span class="text-[10px] tracking-widest text-[#8B1818] font-medium">MARKET</span>
                    </a>

                    <!-- CENTER: PRIMARY NAVIGATION -->
                    <nav class="desktop-nav items-center gap-8">
                        ${navItems}
                    </nav>

                    <!-- RIGHT: AUTH -->
                    <div class="flex items-center gap-4">
                        <!-- Guest State - hidden on mobile -->
                        <button onclick="window.app.handleAuthClick()" id="btn-auth" class="desktop-auth text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors items-center gap-2">
                            <span>Sign In</span>
                        </button>

                        <!-- Authenticated State (Dropdown) - Hidden by default -->
                        <div id="user-menu" class="relative group hidden">
                            <button id="user-menu-btn" onclick="window.app.toggleMenuPersistence(event)" class="desktop-auth items-center gap-2 hover:opacity-80 transition-opacity duration-150">
                                <div class="w-6 h-6 border border-[#E5E5E5] rounded-full flex items-center justify-center bg-[#FAFAFA]">
                                    <span 
                                        class="text-[10px] font-medium text-[#1A1A1A]"
                                        id="menu-initial"
                                    >
                                        U
                                    </span>
                                </div>
                                <span 
                                    class="text-sm text-[#1A1A1A]"
                                    id="menu-username"
                                >
                                    @username
                                </span>
                                <svg 
                                    width="10" 
                                    height="6" 
                                    viewBox="0 0 10 6" 
                                    fill="none"
                                    class="text-[#6B6B6B] transition-transform duration-200 group-hover:rotate-180"
                                >
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
                                </svg>
                            </button>

                            <!-- Dropdown Menu -->
                            <div id="user-dropdown-content" class="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E5E5] shadow-lg rounded-lg hidden group-hover:block origin-top z-50">
                                <div class="py-2">
                                    <button onclick="window.router.navigate('/profile')" class="w-full px-4 py-2.5 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#FAFAFA] transition-colors">
                                        My Profile
                                    </button>
                                    <button onclick="window.router.navigate('/my-contracts')" class="w-full px-4 py-2.5 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#FAFAFA] transition-colors">
                                        My Contracts
                                    </button>
                                    <button onclick="window.router.navigate('/receipts')" class="w-full px-4 py-2.5 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#FAFAFA] transition-colors">
                                        Receipts
                                    </button>
                                    <button onclick="window.router.navigate('/funding')" class="w-full px-4 py-2.5 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#FAFAFA] transition-colors">
                                        Funding & Payouts
                                    </button>
                                    
                                    <div class="my-2 border-t border-[#F0F0F0]"></div>
                                    
                                    <button onclick="window.app.handleSignOut()" class="w-full px-4 py-2.5 text-left text-sm text-[#8B1818] hover:bg-[#FEF2F2] transition-colors">
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Mobile Hamburger -->
                        <button 
                            id="mobile-menu-btn" 
                            onclick="window.app.toggleMobileMenu()" 
                            class="mobile-menu-btn flex-col items-center justify-center w-10 h-10 gap-1.5"
                            aria-label="Toggle menu"
                        >
                            <span id="hamburger-line-1" class="block w-5 h-0.5 bg-[#1A1A1A] transition-all duration-300"></span>
                            <span id="hamburger-line-2" class="block w-5 h-0.5 bg-[#1A1A1A] transition-all duration-300"></span>
                            <span id="hamburger-line-3" class="block w-5 h-0.5 bg-[#1A1A1A] transition-all duration-300"></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu-overlay" class="fixed inset-0 bg-black/30 z-40 hidden sm:hidden" onclick="window.app.closeMobileMenu()"></div>

        <!-- Mobile Menu Drawer -->
        <div id="mobile-menu" class="fixed top-0 right-0 h-full w-72 bg-white z-50 transform translate-x-full transition-transform duration-300 ease-out sm:hidden shadow-xl">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
                <span class="font-semibold text-[#1A1A1A]">Menu</span>
                <button onclick="window.app.closeMobileMenu()" class="w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <nav class="flex flex-col">
                ${mobileNavItems}
            </nav>

            <div class="px-6 py-4">
                <button onclick="window.app.closeMobileMenu(); window.app.handleAuthClick()" id="btn-auth-mobile" class="w-full bg-[#8B1818] hover:bg-[#6B1212] text-white text-sm font-medium py-3 transition-colors">
                    Sign In
                </button>
            </div>

            <div id="mobile-user-section" class="hidden px-6 py-4 border-t border-[#F0F0F0]">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-[#FAFAFA] border border-[#E5E5E5] rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-[#1A1A1A]" id="mobile-menu-initial">U</span>
                    </div>
                    <span class="text-sm text-[#1A1A1A] font-medium" id="mobile-menu-username">@user</span>
                </div>
                <div class="space-y-1">
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/profile')" class="w-full py-2.5 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A]">
                        My Profile
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/my-contracts')" class="w-full py-2.5 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A]">
                        My Contracts
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/funding')" class="w-full py-2.5 text-left text-sm text-[#6B6B6B] hover:text-[#1A1A1A]">
                        Funding
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.app.handleSignOut()" class="w-full py-2.5 text-left text-sm text-[#8B1818]">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    `;
}
