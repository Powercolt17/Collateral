// Shared Header Component - EXACT copy from screenshot
// COLLATERAL with MARKET in red, OVERVIEW/LEDGER/CONTRACTS/DOCS nav

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
                ? 'text-[#1A1A1A] border-b border-[#1A1A1A] pb-0.5'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }">
                ${route.label}
            </a>
        `;
    }).join('');

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
            <div class="mx-auto max-w-[900px] px-6 md:px-8 py-3">
                <div class="flex items-center justify-between">
                    
                    <!-- LEFT: COLLATERAL / MARKET wordmark -->
                    <a href="#" onclick="window.router.navigate('/overview'); return false;" class="cursor-pointer hover:opacity-80 transition-opacity shrink-0 flex flex-col leading-none">
                        <span class="text-sm font-semibold tracking-wide text-[#1A1A1A]">COLLATERAL</span>
                        <span class="text-[10px] font-semibold tracking-widest text-[#8B1818]">MARKET</span>
                    </a>

                    <!-- CENTER: Navigation -->
                    <nav class="desktop-nav items-center gap-8">
                        ${navItems}
                    </nav>

                    <!-- RIGHT: Auth -->
                    <div class="flex items-center gap-4">
                        <button onclick="window.app.handleAuthClick()" id="btn-auth" class="desktop-auth text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors items-center gap-2">
                            <span>Sign In</span>
                        </button>

                        <div id="user-menu" class="relative group hidden">
                            <button id="user-menu-btn" onclick="window.app.toggleMenuPersistence(event)" class="desktop-auth items-center gap-1 hover:opacity-80 transition-opacity duration-150">
                                <span class="text-xs text-[#6B6B6B]">•</span>
                                <span class="text-xs text-[#1A1A1A]" id="menu-username">@username</span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" class="text-[#6B6B6B] ml-1">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
                                </svg>
                            </button>

                            <div id="user-dropdown-content" class="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E5E5E5] shadow-lg hidden group-hover:block z-50">
                                <div class="py-1">
                                    <button onclick="window.router.navigate('/profile')" class="w-full px-4 py-2.5 text-left text-xs text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#FAFAFA]">Profile</button>
                                    <button onclick="window.router.navigate('/my-contracts')" class="w-full px-4 py-2.5 text-left text-xs text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#FAFAFA]">My Contracts</button>
                                    <button onclick="window.router.navigate('/funding')" class="w-full px-4 py-2.5 text-left text-xs text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#FAFAFA]">Funding</button>
                                    <div class="my-1 border-t border-[#F0F0F0]"></div>
                                    <button onclick="window.app.handleSignOut()" class="w-full px-4 py-2.5 text-left text-xs text-[#8B1818] hover:bg-[#FEF2F2]">Sign Out</button>
                                </div>
                            </div>
                        </div>

                        <button id="mobile-menu-btn" onclick="window.app.toggleMobileMenu()" class="mobile-menu-btn flex-col items-center justify-center w-10 h-10 gap-1.5" aria-label="Toggle menu">
                            <span id="hamburger-line-1" class="block w-5 h-0.5 bg-[#1A1A1A] transition-all duration-300"></span>
                            <span id="hamburger-line-2" class="block w-5 h-0.5 bg-[#1A1A1A] transition-all duration-300"></span>
                            <span id="hamburger-line-3" class="block w-5 h-0.5 bg-[#1A1A1A] transition-all duration-300"></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <div id="mobile-menu-overlay" class="fixed inset-0 bg-black/30 z-40 hidden sm:hidden" onclick="window.app.closeMobileMenu()"></div>

        <div id="mobile-menu" class="fixed top-0 right-0 h-full w-72 bg-white z-50 transform translate-x-full transition-transform duration-300 ease-out sm:hidden shadow-xl">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
                <span class="text-sm font-medium text-[#1A1A1A]">Menu</span>
                <button onclick="window.app.closeMobileMenu()" class="w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <nav class="flex flex-col">${mobileNavItems}</nav>
            <div class="px-6 py-4">
                <button onclick="window.app.closeMobileMenu(); window.app.handleAuthClick()" id="btn-auth-mobile" class="w-full bg-[#8B1818] hover:bg-[#6B1212] text-white text-xs font-medium py-3 rounded transition-colors">Sign In</button>
            </div>
            <div id="mobile-user-section" class="hidden px-6 py-4 border-t border-[#F0F0F0]">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-xs text-[#6B6B6B]" id="mobile-menu-username">@username</span>
                </div>
                <div class="space-y-1">
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/profile')" class="w-full py-2.5 text-left text-xs text-[#6B6B6B] hover:text-[#1A1A1A]">Profile</button>
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/my-contracts')" class="w-full py-2.5 text-left text-xs text-[#6B6B6B] hover:text-[#1A1A1A]">My Contracts</button>
                    <button onclick="window.app.closeMobileMenu(); window.app.handleSignOut()" class="w-full py-2.5 text-left text-xs text-[#8B1818]">Sign Out</button>
                </div>
            </div>
        </div>
    `;
}
