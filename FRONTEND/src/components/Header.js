// Shared Header Component - Execution Terminal Style
export function renderHeader(currentRoute) {
    const routes = [
        { path: '/overview', label: 'TERMINAL' },
        { path: '/ledger', label: 'LEDGER' },
        { path: '/contracts', label: 'CONTRACTS' },
        { path: '/docs', label: 'TERMS' }
    ];

    const navItems = routes.map(route => {
        const isActive = currentRoute === route.path ||
            (route.path === '/contracts' && currentRoute.startsWith('/contracts')) ||
            (route.path === '/overview' && currentRoute === '/');

        return `
            <a href="#" 
                onclick="window.router.navigate('${route.path}'); return false;" 
                class="text-[11px] tracking-wider transition-all duration-150 py-1 border-b ${isActive
                ? 'text-[#0A0A0A] border-[#0A0A0A] font-medium'
                : 'text-[#6B6B6B] border-transparent hover:text-[#0A0A0A]'
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
                class="block w-full px-6 py-4 text-sm tracking-wide border-b border-[#E5E5E5] ${isActive
                ? 'text-[#0A0A0A] bg-[#F5F5F5] font-medium'
                : 'text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#FAFAFA]'
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
            <div class="mx-auto max-w-3xl px-6 md:px-8 py-4">
                <div class="flex items-center justify-between">
                    <!-- LEFT: WORDMARK -->
                    <a href="#" onclick="window.router.navigate('/overview'); return false;" class="cursor-pointer hover:opacity-70 transition-opacity shrink-0">
                        <span class="text-sm font-semibold tracking-wide text-[#0A0A0A]">COLLATERAL</span>
                    </a>

                    <!-- CENTER: PRIMARY NAVIGATION -->
                    <nav class="desktop-nav items-center gap-6">
                        ${navItems}
                    </nav>

                    <!-- RIGHT: AUTH -->
                    <div class="flex items-center gap-4">
                        <!-- Guest State -->
                        <button onclick="window.app.handleAuthClick()" id="btn-auth" class="desktop-auth text-[11px] tracking-wide text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">
                            ACCESS
                        </button>

                        <!-- Authenticated State (Dropdown) - Hidden by default -->
                        <div id="user-menu" class="relative group hidden">
                            <button id="user-menu-btn" onclick="window.app.toggleMenuPersistence(event)" class="desktop-auth items-center gap-2 hover:opacity-70 transition-opacity duration-150">
                                <span 
                                    class="text-[11px] tracking-wide text-[#0A0A0A]"
                                    id="menu-username"
                                >
                                    @user
                                </span>
                                <span id="menu-initial" class="hidden">U</span>
                            </button>

                            <!-- Dropdown Menu -->
                            <div id="user-dropdown-content" class="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E5E5E5] shadow-lg hidden group-hover:block origin-top z-50">
                                <div class="py-1">
                                    <button onclick="window.router.navigate('/profile')" class="w-full px-4 py-2.5 text-left text-[11px] tracking-wide text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#FAFAFA] transition-colors">
                                        IDENTITY
                                    </button>
                                    <button onclick="window.router.navigate('/my-contracts')" class="w-full px-4 py-2.5 text-left text-[11px] tracking-wide text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#FAFAFA] transition-colors">
                                        MY CONTRACTS
                                    </button>
                                    <button onclick="window.router.navigate('/receipts')" class="w-full px-4 py-2.5 text-left text-[11px] tracking-wide text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#FAFAFA] transition-colors">
                                        RECEIPTS
                                    </button>
                                    <button onclick="window.router.navigate('/funding')" class="w-full px-4 py-2.5 text-left text-[11px] tracking-wide text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#FAFAFA] transition-colors">
                                        FUNDING
                                    </button>
                                    
                                    <div class="my-1 border-t border-[#E5E5E5]"></div>
                                    
                                    <button onclick="window.app.handleSignOut()" class="w-full px-4 py-2.5 text-left text-[11px] tracking-wide text-[#8B1818] hover:bg-[#FEF2F2] transition-colors">
                                        SIGN OUT
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Mobile Hamburger -->
                        <button 
                            id="mobile-menu-btn" 
                            onclick="window.app.toggleMobileMenu()" 
                            class="mobile-menu-btn flex-col items-center justify-center w-8 h-8 gap-1"
                            aria-label="Toggle menu"
                        >
                            <span id="hamburger-line-1" class="block w-5 h-px bg-[#0A0A0A] transition-all duration-300"></span>
                            <span id="hamburger-line-2" class="block w-5 h-px bg-[#0A0A0A] transition-all duration-300"></span>
                            <span id="hamburger-line-3" class="block w-5 h-px bg-[#0A0A0A] transition-all duration-300"></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu-overlay" class="fixed inset-0 bg-black/20 z-40 hidden sm:hidden" onclick="window.app.closeMobileMenu()"></div>

        <!-- Mobile Menu Drawer -->
        <div id="mobile-menu" class="fixed top-0 right-0 h-full w-64 bg-white z-50 transform translate-x-full transition-transform duration-300 ease-out sm:hidden shadow-xl border-l border-[#E5E5E5]">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
                <span class="text-[11px] font-medium tracking-wide text-[#0A0A0A]">MENU</span>
                <button onclick="window.app.closeMobileMenu()" class="w-6 h-6 flex items-center justify-center text-[#6B6B6B] hover:text-[#0A0A0A]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <nav class="flex flex-col">
                ${mobileNavItems}
            </nav>

            <div class="px-6 py-4 border-t border-[#E5E5E5] mt-auto">
                <button onclick="window.app.closeMobileMenu(); window.app.handleAuthClick()" id="btn-auth-mobile" class="w-full text-[11px] tracking-wide text-center py-3 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors">
                    ACCESS
                </button>
            </div>

            <div id="mobile-user-section" class="hidden px-6 py-4 border-t border-[#E5E5E5]">
                <div class="mb-4">
                    <span class="text-[11px] text-[#6B6B6B]" id="mobile-menu-username">@user</span>
                    <span id="mobile-menu-initial" class="hidden">U</span>
                </div>
                <div class="space-y-1">
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/profile')" class="w-full py-2 text-left text-[11px] tracking-wide text-[#6B6B6B] hover:text-[#0A0A0A]">
                        IDENTITY
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.router.navigate('/my-contracts')" class="w-full py-2 text-left text-[11px] tracking-wide text-[#6B6B6B] hover:text-[#0A0A0A]">
                        MY CONTRACTS
                    </button>
                    <button onclick="window.app.closeMobileMenu(); window.app.handleSignOut()" class="w-full py-2 text-left text-[11px] tracking-wide text-[#8B1818]">
                        SIGN OUT
                    </button>
                </div>
            </div>
        </div>
    `;
}
