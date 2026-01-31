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

    return `
        <header class="w-full border-b border-black/10 bg-white fixed top-0 z-50">
            <div class="mx-auto max-w-[1600px] px-8 py-4">
                <div class="flex items-center justify-between">
                    <!-- LEFT: LOGO -->
                    <a href="#" onclick="window.router.navigate('/overview'); return false;" class="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="/logo.png" alt="Collateral" class="h-20" />
                    </a>

                    <!-- CENTER: PRIMARY NAVIGATION -->
                    <nav class="flex items-center gap-8">
                        ${navItems}
                    </nav>

                    <!-- RIGHT: SYSTEM ZONE -->
                    <div class="flex items-center gap-6">
                        <!-- System Status Indicator -->
                        <div class="flex items-center gap-2 px-3 py-1.5 border border-black/10">
                            <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span 
                                class="text-[10px] tracking-widest uppercase leading-none"
                                style="font-family: 'JetBrains Mono', monospace; font-weight: 500;"
                            >
                                SYSTEM: OPERATIONAL
                            </span>
                        </div>

                        <!-- Guest State -->
                        <button onclick="window.app.handleAuthClick()" id="btn-auth" class="bg-black hover:bg-gray-800 text-white text-xs font-medium px-5 py-2.5 transition-all flex items-center gap-2 uppercase tracking-wide" style="font-family: 'Inter', sans-serif;">
                            <span>Sign In</span>
                        </button>

                        <!-- Authenticated State (Dropdown) - Hidden by default -->
                        <div id="user-menu" class="relative group hidden">
                            <button id="user-menu-btn" onclick="window.app.toggleMenuPersistence(event)" class="flex items-center gap-2 hover:opacity-70 transition-opacity duration-150">
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
                    </div>
                </div>
            </div>
        </header>
    `;
}

