// Shared Header Component - Exact same markup/styling as overview.html
export function renderHeader(currentRoute) {
    const routes = [
        { path: '/overview', label: 'Overview' },
        { path: '/ledger', label: 'Ledger' },
        { path: '/contracts', label: 'Contracts' },
        { path: '/docs', label: 'Docs' }
    ];

    const navItems = routes.map(route => {
        const isActive = currentRoute === route.path ||
            (route.path === '/contracts' && currentRoute.startsWith('/contracts'));

        return `
            <button onclick="window.router.navigate('${route.path}')" 
                class="nav-btn relative px-4 py-1.5 text-[11px] font-medium tracking-wide uppercase transition-colors rounded-full
                    ${isActive
                ? 'bg-[#F7F7F6] text-[#0E0E11] shadow-none'
                : 'text-[#6B6E76] hover:text-[#0E0E11]'
            }" 
                data-target="${route.path}" 
                data-active="${isActive}">
                ${route.label}
            </button>
        `;
    }).join('');

    return `
        <nav id="main-nav" class="fixed top-0 w-full z-50 border-b border-[#D9DBE1] bg-[#F7F7F6]/95 backdrop-blur-sm">
            <div class="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
                <!-- Left: Brand -->
                <a href="#" onclick="window.router.navigate('/overview'); return false;" class="flex items-center gap-2.5 group cursor-pointer">
                    <div class="w-4 h-4 bg-[#0E0E11] flex items-center justify-center rounded-[1px]">
                        <div class="w-1.5 h-1.5 bg-white rounded-[0.5px]"></div>
                    </div>
                    <span class="font-mono text-xs font-medium tracking-wider uppercase text-[#0E0E11]">
                        Collateral<span class="text-[#921818]">.market</span>
                    </span>
                </a>

                <!-- Center: Links -->
                <div class="hidden md:flex items-center bg-white border border-[#D9DBE1] rounded-full px-1 py-1">
                    ${navItems}
                </div>

                <!-- Right: Identity/Login -->
                <div class="flex items-center gap-4 relative">
                    <!-- Guest State -->
                    <button onclick="window.app.handleAuthClick()" id="btn-auth" class="bg-[#0E0E11] hover:bg-[#1E1F23] text-white text-[11px] font-medium px-5 py-2 rounded-[2px] transition-all flex items-center gap-2 uppercase tracking-wide">
                        <span>Sign In</span>
                    </button>

                    <!-- Authenticated State (Dropdown) - Hidden by default -->
                    <div id="user-menu" class="relative group hidden">
                        <button id="user-menu-btn" onclick="window.app.toggleMenuPersistence(event)" class="flex items-center gap-3 bg-white border border-[#D9DBE1] hover:border-[#6B6E76] text-[#0E0E11] px-3.5 py-1.5 h-9 rounded-[2px] transition-all shadow-sm group-hover:border-[#6B6E76]">
                            <div class="w-1.5 h-1.5 bg-[#1F7A4D] rounded-full"></div>
                            <span class="font-mono text-[11px] font-medium tracking-wide pt-0.5" id="menu-username">@username</span>
                            <i data-lucide="chevron-down" class="w-3 h-3 text-[#6B6E76] transition-transform duration-200 group-hover:text-[#0E0E11]"></i>
                        </button>
                        
                        <!-- Dropdown Menu -->
                        <div id="user-dropdown-content" class="absolute right-0 top-full mt-2 w-52 bg-white border border-[#D9DBE1] shadow-[0_10px_30px_rgba(0,0,0,0.06)] rounded-[2px] hidden group-hover:block z-50 py-1.5">
                            <div class="flex flex-col">
                                <button onclick="window.router.navigate('/profile')" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#0E0E11] hover:bg-[#F7F7F6] uppercase tracking-widest transition-colors">
                                    My Identity Record
                                </button>
                                <button onclick="window.router.navigate('/my-contracts')" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#0E0E11] hover:bg-[#F7F7F6] uppercase tracking-widest transition-colors">
                                    My Contracts
                                </button>
                                <button onclick="window.router.navigate('/receipts')" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#0E0E11] hover:bg-[#F7F7F6] uppercase tracking-widest transition-colors">
                                    Receipts
                                </button>
                                <button onclick="window.router.navigate('/funding')" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#0E0E11] hover:bg-[#F7F7F6] uppercase tracking-widest transition-colors">
                                    Funding & Payouts
                                </button>
                                <button onclick="window.app.openSettingsModal()" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#0E0E11] hover:bg-[#F7F7F6] uppercase tracking-widest transition-colors">
                                    Settings
                                </button>
                                <div class="h-px w-full bg-[#D9DBE1] my-1"></div>
                                <button onclick="window.app.handleSignOut()" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#921818] hover:bg-[#921818]/5 uppercase tracking-widest transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;
}
