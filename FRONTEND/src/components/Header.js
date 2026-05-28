// Header Component - Premium Clearinghouse Terminal Nav
export function renderHeader(currentRoute) {
    const routes = [
        { path: '/market', label: 'MARKET', hasDropdown: true },
        { path: '/my-contracts', label: 'ACTIVE' },
        { path: '/ledger', label: 'LEDGER' },
        { path: '/sources', label: 'SOURCES' }
    ];

    const navItems = routes.map(route => {
        const isActive = currentRoute === route.path ||
            (route.path === '/market' && (currentRoute === '/market' || currentRoute.startsWith('/market/'))) ||
            (route.path === '/my-contracts' && (currentRoute === '/my-contracts' || currentRoute.startsWith('/contracts/')));

        if (route.hasDropdown) {
            return `
                <div class="nav-dropdown-wrap">
                    <a href="#" 
                        onclick="window.router.navigate('${route.path}'); return false;" 
                        class="nav-link ${isActive ? 'active' : ''}"
                        data-target="${route.path}" 
                        data-active="${isActive}">
                        ${route.label}
                    </a>
                    <div class="nav-dropdown">
                        <a href="#" onclick="window.router.navigate('/market'); return false;">Solo Contracts</a>
                        <a href="#" onclick="window.router.navigate('/rivalry'); return false;">Rivalry Contracts</a>
                    </div>
                </div>
            `;
        }

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

    const panelNavItems = routes.map((route, i) => {
        const isActive = currentRoute === route.path ||
            (route.path === '/market' && (currentRoute === '/market' || currentRoute.startsWith('/market/'))) ||
            (route.path === '/my-contracts' && (currentRoute === '/my-contracts' || currentRoute.startsWith('/contracts/')));

        let itemHTML = `
            <a href="#" 
                onclick="window.app.closeMobileMenu(); window.router.navigate('${route.path}'); return false;" 
                class="pnl-nav-link ${isActive ? 'active' : ''}"
                style="animation-delay: ${0.06 + i * 0.03}s">
                <span class="pnl-nav-indicator"></span>
                ${route.label}
            </a>
        `;

        if (route.hasDropdown) {
            itemHTML = `
                <div class="pnl-nav-group" style="animation-delay: ${0.06 + i * 0.03}s">
                    <a href="#" 
                        onclick="this.parentElement.classList.toggle('expanded'); return false;" 
                        class="pnl-nav-link ${isActive ? 'active' : ''}">
                        <span class="pnl-nav-indicator"></span>
                        <span style="flex: 1;">${route.label}</span>
                        <svg class="pnl-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </a>
                    <div class="pnl-subnav">
                        <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/market'); return false;" class="pnl-subnav-link ${(currentRoute === '/market' || currentRoute === '/market/') ? 'active' : ''}">Solo Contracts</a>
                        <a href="#" onclick="window.app.closeMobileMenu(); window.router.navigate('/rivalry'); return false;" class="pnl-subnav-link ${(currentRoute === '/rivalry' || currentRoute.startsWith('/rivalry/')) ? 'active' : ''}">Rivalry Contracts</a>
                    </div>
                </div>
            `;
        }

        return itemHTML;
    }).join('');

    const accountLinks = [
        { path: '/profile', label: 'Profile', icon: 'user' },
        { path: '/referrals', label: 'Referrals', icon: 'gift' },
        { path: '/funding', label: 'Account Capital', icon: 'wallet' },
        { path: '/docs', label: 'Documentation', icon: 'file-text' },
    ];

    const panelAccountItems = accountLinks.map((link, i) => `
        <a href="#" 
            onclick="window.app.closeMobileMenu(); window.router.navigate('${link.path}'); return false;" 
            class="pnl-acct-link"
            style="animation-delay: ${0.18 + i * 0.03}s">
            <i data-lucide="${link.icon}" style="width:14px;height:14px;opacity:0.5;"></i>
            ${link.label}
        </a>
    `).join('');

    return `
        <style>
            /* ══════════════════════════════════════════════════════════════
               HEADER — INSTITUTIONAL CLEARINGHOUSE
               ══════════════════════════════════════════════════════════════ */
            .ch-header {
                width: 100%;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
                position: fixed;
                top: 32px;
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
                background: linear-gradient(90deg, transparent 0%, #5C1414 50%, transparent 100%);
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            .ch-header.nav-scrolled::after { opacity: 1; }

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

            .ch-header-inner {
                width: 100%;
                padding: 0 32px;
                height: 72px;
                display: flex;
                align-items: center;
                gap: 64px;
            }

            .ch-logo {
                display: inline-flex;
                align-items: center;
                text-decoration: none;
                flex-shrink: 0;
                transition: transform 0.2s ease;
            }
            .ch-logo:hover {
                transform: scale(1.04);
            }
            .ch-logo-svg {
                width: 32px;
                height: 32px;
                color: #5C1414;
                margin-right: 12px;
                fill: currentColor;
                flex-shrink: 0;
            }
            .ch-logo-wordmark {
                font-size: 18px;
                font-weight: 800;
                color: #111111;
                letter-spacing: 0.22em;
                font-family: 'Sora', 'IBM Plex Sans', 'Helvetica Neue', -apple-system, sans-serif;
                text-transform: uppercase;
                line-height: 1;
                margin: 0;
            }

            /* ── Premium Nav Dropdown ── */
            .nav-dropdown-wrap { 
                position: relative; 
                display: flex; 
                height: 100%; 
                align-items: center; 
            }
            .nav-dropdown {
                position: absolute;
                top: 60px;
                left: 50%;
                transform: translateX(-50%) translateY(16px) scale(0.96);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(229, 229, 229, 0.6);
                box-shadow: 0 16px 40px -8px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.03);
                padding: 12px 0;
                min-width: 200px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                            transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                            visibility 0.25s;
                z-index: 100;
                border-radius: 8px;
            }
            .nav-dropdown-wrap:hover .nav-dropdown {
                opacity: 1;
                visibility: visible;
                transform: translateX(-50%) translateY(0) scale(1);
            }
            .nav-dropdown a {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 24px;
                color: #475569;
                text-decoration: none;
                font-family: 'Sora', 'Inter', sans-serif;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .nav-dropdown a::after {
                content: '→';
                opacity: 0;
                transform: translateX(-8px);
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                color: #5C1414;
            }
            .nav-dropdown a:hover {
                background: rgba(248, 250, 252, 0.8);
                color: #111;
                padding-left: 28px;
            }
            .nav-dropdown a:hover::after {
                opacity: 1;
                transform: translateX(0);
            }

            /* ── Nav Links (desktop center) ── */
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
                padding: 26px 4px;
                font-size: 13px;
                font-weight: 600;
                color: #333333;
                text-decoration: none;
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                letter-spacing: 0.1px;
                transition: color 0.12s;
                position: relative;
                border-bottom: 2px solid transparent;
            }
            .nav-link::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 0;
                height: 2px;
                background: #5C1414;
                transition: width 0.3s ease, left 0.3s ease;
            }
            .nav-link:hover::after { width: 100%; left: 0; }
            .nav-link:hover { color: #000000; }
            .nav-link.active {
                color: #111111;
                font-weight: 700;
                border-bottom-color: #5C1414;
            }
            .nav-link.active::after { width: 100%; left: 0; }

            /* ── Right section ── */
            .ch-right {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-left: auto;
            }

            /* Search bar (desktop only) */
            .ch-capital {
                display: none;
                flex-direction: column;
                align-items: flex-end;
                cursor: pointer;
                padding-right: 24px;
                border-right: 1px solid #eaeaea;
                margin-right: 12px;
            }
            @media (min-width: 1024px) {
                .ch-capital { display: flex; }
            }

            /* ── Hamburger Button — Always Visible ── */
            .ch-hamburger {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: 1px solid transparent;
                cursor: pointer;
                position: relative;
                transition: border-color 0.2s, background 0.2s;
                flex-shrink: 0;
            }
            .ch-hamburger:hover {
                border-color: #e5e5e5;
                background: #fafafa;
            }
            .ch-hamburger-lines {
                width: 18px;
                height: 14px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .ch-hamburger-lines span {
                display: block;
                width: 100%;
                height: 1.5px;
                background: #333;
                transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
                transform-origin: center;
            }
            .ch-hamburger-lines span:nth-child(2) { width: 12px; margin-left: auto; }
            .ch-hamburger.open .ch-hamburger-lines span:nth-child(1) {
                transform: translateY(6.25px) rotate(45deg);
            }
            .ch-hamburger.open .ch-hamburger-lines span:nth-child(2) {
                opacity: 0;
                width: 0;
            }
            .ch-hamburger.open .ch-hamburger-lines span:nth-child(3) {
                transform: translateY(-6.25px) rotate(-45deg);
            }

            /* Connect button (header) — hidden when logged in or on mobile */
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
            .ch-connect:hover { background: #5C1414; }

            /* Notification dropdown — desktop only */
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

            /* ══════════════════════════════════════════════════════════════
               SLIDE-OUT PANEL — UNIVERSAL (DESKTOP + MOBILE)
               ══════════════════════════════════════════════════════════════ */
            .pnl-overlay {
                position: fixed;
                inset: 0;
                background: rgba(10, 10, 10, 0.35);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                z-index: 90;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.35s ease, visibility 0.35s ease;
            }
            .pnl-overlay.open {
                opacity: 1;
                visibility: visible;
            }

            .pnl-drawer {
                position: fixed;
                top: 0;
                right: 0;
                width: 380px;
                max-width: 90vw;
                height: 100%;
                background: #ffffff;
                z-index: 100;
                transform: translateX(100%);
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex;
                flex-direction: column;
                box-shadow: -24px 0 80px rgba(0,0,0,0.08);
                border-left: 1px solid #f0f0f0;
            }
            .pnl-drawer.open {
                transform: translateX(0);
            }

            /* Panel header */
            .pnl-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px 28px 20px;
                border-bottom: 1px solid #f0f0f0;
                flex-shrink: 0;
            }
            .pnl-header-left {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .pnl-header-logo {
                width: 20px;
                height: 20px;
                opacity: 0.6;
            }
            .pnl-header-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2.5px;
                color: #999;
            }
            .pnl-close {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: 1px solid transparent;
                cursor: pointer;
                color: #999;
                transition: all 0.15s;
            }
            .pnl-close:hover {
                border-color: #e5e5e5;
                background: #fafafa;
                color: #333;
            }

            /* User identity card */
            .pnl-user {
                display: none;
                align-items: center;
                gap: 14px;
                padding: 20px 28px;
                background: linear-gradient(135deg, #faf9f9 0%, #f5f2f2 100%);
                border-bottom: 1px solid #f0f0f0;
                border-left: 3px solid #5C1414;
                flex-shrink: 0;
            }
            .pnl-user.visible { display: flex; }
            .pnl-user-badge {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #111;
                border: none;
                flex-shrink: 0;
                overflow: hidden;
            }
            .pnl-user-initial {
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 15px;
                font-weight: 700;
                color: #fff;
            }
            .pnl-user-avatar {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
                display: none;
            }
            .pnl-user-info {
                display: flex;
                flex-direction: column;
                gap: 3px;
                min-width: 0;
            }
            .pnl-user-name {
                font-size: 14px;
                font-weight: 600;
                color: #111;
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .pnl-user-role {
                font-size: 9px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #aaa;
                font-family: 'JetBrains Mono', monospace;
            }

            /* Panel scrollable body */
            .pnl-body {
                flex: 1;
                overflow-y: auto;
                padding: 0;
            }
            .pnl-body::-webkit-scrollbar { width: 3px; }
            .pnl-body::-webkit-scrollbar-track { background: transparent; }
            .pnl-body::-webkit-scrollbar-thumb { background: #e5e5e5; }

            /* Section label */
            .pnl-section-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: #ccc;
                padding: 20px 28px 10px;
            }

            /* Navigation links */
            .pnl-nav-link {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 14px 28px;
                font-size: 14px;
                font-weight: 500;
                color: #555;
                text-decoration: none;
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                letter-spacing: 0.04em;
                transition: all 0.15s ease;
                position: relative;
                opacity: 0;
                transform: translateX(12px);
                animation: pnlSlideIn 0.35s ease forwards;
                border-left: 3px solid transparent;
            }
            .pnl-nav-link:hover {
                background: #fafafa;
                color: #111;
                border-left-color: #e5e5e5;
            }
            .pnl-nav-link.active {
                color: #111;
                font-weight: 700;
                background: linear-gradient(90deg, #fdf5f5 0%, #fff 100%);
                border-left-color: #5C1414;
            }
            .pnl-nav-indicator {
                width: 3px;
                height: 3px;
                background: #d4d4d4;
                flex-shrink: 0;
                transition: all 0.15s;
            }
            .pnl-nav-link.active .pnl-nav-indicator {
                width: 5px;
                height: 5px;
                background: #5C1414;
                box-shadow: 0 0 4px rgba(92, 20, 20, 0.3);
            }
            .pnl-nav-link:hover .pnl-nav-indicator {
                background: #888;
            }

            .pnl-nav-group {
                display: flex;
                flex-direction: column;
            }
            .pnl-chevron {
                opacity: 0.4;
                transition: transform 0.25s ease;
            }
            .pnl-nav-group.expanded .pnl-chevron {
                transform: rotate(180deg);
            }

            .pnl-subnav {
                display: none;
                flex-direction: column;
                background: #fcfcfc;
                border-left: 3px solid transparent;
                padding-bottom: 8px;
            }
            .pnl-nav-group.expanded .pnl-subnav {
                display: flex;
            }
            .pnl-subnav-link {
                display: flex;
                align-items: center;
                padding: 10px 28px 10px 48px;
                font-size: 13px;
                font-weight: 500;
                color: #777;
                text-decoration: none;
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                border-left: 2px solid #eaeaea;
                margin-left: 34px;
                transition: all 0.15s;
            }
            .pnl-subnav-link:hover, .pnl-subnav-link.active {
                color: #111;
                font-weight: 600;
                border-left-color: #5C1414;
                background: #f9f9f9;
            }

            /* Divider */
            .pnl-divider {
                height: 1px;
                background: #f0f0f0;
                margin: 4px 28px;
            }

            /* Account links */
            .pnl-acct-link {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 28px;
                font-size: 13px;
                font-weight: 500;
                color: #555;
                text-decoration: none;
                font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                transition: all 0.15s ease;
                opacity: 0;
                transform: translateX(12px);
                animation: pnlSlideIn 0.35s ease forwards;
            }
            .pnl-acct-link:hover {
                background: #fafafa;
                color: #111;
            }

            /* Sign out */
            .pnl-signout {
                display: flex;
                align-items: center;
                gap: 12px;
                width: calc(100% - 56px);
                margin: 12px 28px 4px;
                padding: 12px 16px;
                font-size: 11px;
                font-weight: 600;
                color: #5C1414;
                background: #fef8f8;
                border: 1px solid #f0e5e5;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                cursor: pointer;
                text-align: left;
                transition: all 0.15s;
            }
            .pnl-signout:hover {
                background: #fdf0f0;
                border-color: #e5d0d0;
            }

            /* Connect button in panel */
            .pnl-connect-section {
                padding: 20px 28px;
                flex-shrink: 0;
            }
            .pnl-connect-btn {
                width: 100%;
                padding: 14px 24px;
                font-size: 12px;
                font-weight: 700;
                color: #fff;
                background: #111;
                border: none;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                transition: background 0.15s;
            }
            .pnl-connect-btn:hover { background: #5C1414; }

            /* Panel footer */
            .pnl-footer {
                border-top: 1px solid #f0f0f0;
                padding: 20px 28px;
                background: #fafafa;
                flex-shrink: 0;
            }
            .pnl-status {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
            }
            .pnl-status-dot {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #22c55e;
                box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
            }
            .pnl-status-text {
                font-size: 10px;
                font-weight: 500;
                color: #aaa;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }
            .pnl-meta {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 16px;
            }
            .pnl-meta-item {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .pnl-meta-label {
                font-size: 8px;
                font-weight: 700;
                color: #ccc;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.12em;
            }
            .pnl-meta-value {
                font-size: 11px;
                font-weight: 500;
                color: #777;
                font-family: 'Sora', 'IBM Plex Sans', sans-serif;
            }
            .pnl-legal {
                display: flex;
                gap: 16px;
                padding-top: 12px;
                border-top: 1px solid #eee;
            }
            .pnl-legal a {
                font-size: 10px;
                color: #ccc;
                text-decoration: none;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.04em;
                transition: color 0.12s;
            }
            .pnl-legal a:hover { color: #888; }

            @keyframes pnlSlideIn {
                to { opacity: 1; transform: translateX(0); }
            }

            /* ── Mobile overrides ── */
            @media (max-width: 767px) {
                .ch-header-inner { padding: 0 16px; gap: 0; }
                .ch-icon-btn { display: none !important; }
                .ch-notif-wrap { display: none !important; }
                #btn-auth { display: none !important; }
                .pnl-drawer { width: 100%; max-width: 100%; border-left: none; }
            }
            @media (max-width: 480px) {
                .ch-logo-wordmark { font-size: 11px; letter-spacing: 0.18em; }
            }
        </style>

        <header class="ch-header">
            <div class="ch-header-inner">
                <!-- Logo -->
                <a href="#" onclick="window.router.navigate('/'); return false;" class="ch-logo">
                    <span class="logo-wordmark">COLLA<span style="color: #5C1414;">TERAL</span></span>
                </a>

                <!-- Nav Links (desktop) -->
                <nav class="ch-nav">
                    ${navItems}
                </nav>

                <!-- Right Section -->
                <div class="ch-right">
                    <!-- Capital Display (logged in) / Connect Button (logged out) -->
                    <div class="ch-capital" id="header-capital-area" onclick="window.router.navigate('/funding')">
                        <span style="font-size: 10px; color: #888; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; text-transform: uppercase;">Available Capital</span>
                        <span id="header-avail-cap" style="font-size: 14px; font-weight: 600; color: #111; letter-spacing: -0.02em;">$0.00</span>
                    </div>
                    <button class="ch-connect" id="btn-auth" onclick="window.app.openAccessModal()" style="display:none;">SIGN IN</button>

                    <!-- Notification Bell (desktop only) -->
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

                    <!-- Hamburger — Always Visible -->
                    <button id="mobile-menu-btn" onclick="window.app.toggleMobileMenu()" class="ch-hamburger" aria-label="Menu">
                        <div class="ch-hamburger-lines">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>
            </div>
        </header>

        <!-- Panel Overlay -->
        <div id="mobile-menu-overlay" class="pnl-overlay" onclick="window.app.closeMobileMenu()"></div>

        <!-- Slide-Out Panel -->
        <div id="mobile-menu" class="pnl-drawer">
            <div class="pnl-header">
                <div class="pnl-header-left">
                    <span class="pnl-header-title">Menu</span>
                </div>
                <button onclick="window.app.closeMobileMenu()" class="pnl-close" aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>

            <!-- User Identity (shown when logged in) -->
            <div id="mobile-user-section" class="pnl-user">
                <div class="pnl-user-badge">
                    <span class="pnl-user-initial" id="mobile-menu-initial">U</span>
                    <img class="pnl-user-avatar" id="mobile-menu-avatar" alt="" />
                </div>
                <div class="pnl-user-info">
                    <span class="pnl-user-name" id="mobile-menu-username">@user</span>
                </div>
            </div>

            <div class="pnl-body">
                <!-- Navigation -->
                <div class="pnl-section-label">Navigation</div>
                ${panelNavItems}

                <!-- Account Links (shown when logged in) -->
                <div id="mobile-account-links" style="display:none;">
                    <div class="pnl-divider"></div>
                    <div class="pnl-section-label">Account</div>
                    ${panelAccountItems}

                    <!-- Sign Out -->
                    <button id="pnl-signout-btn" onclick="window.app.closeMobileMenu(); window.app.handleSignOut()" class="pnl-signout" style="display:none;">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign Out
                    </button>
                </div>

                <!-- Connect (shown when NOT logged in) -->
                <div id="mobile-connect-section" class="pnl-connect-section">
                    <button onclick="window.app.closeMobileMenu(); window.app.handleAuthClick()" id="btn-auth-mobile" class="pnl-connect-btn">
                        SIGN IN
                    </button>
                </div>
            </div>

            <div class="pnl-footer">
                <div class="pnl-status">
                    <div class="pnl-status-dot"></div>
                    <span class="pnl-status-text">All systems operational</span>
                </div>
                <div class="pnl-meta">
                    <div class="pnl-meta-item">
                        <span class="pnl-meta-label">Protocol</span>
                        <span class="pnl-meta-value">v1.0</span>
                    </div>
                    <div class="pnl-meta-item">
                        <span class="pnl-meta-label">Network</span>
                        <span class="pnl-meta-value">Mainnet</span>
                    </div>
                    <div class="pnl-meta-item">
                        <span class="pnl-meta-label">Settlement</span>
                        <span class="pnl-meta-value">USD</span>
                    </div>
                    <div class="pnl-meta-item">
                        <span class="pnl-meta-label">Uptime</span>
                        <span class="pnl-meta-value">99.9%</span>
                    </div>
                </div>
                <div class="pnl-legal">
                    <a href="/terms" onclick="window.app.closeMobileMenu()">Terms</a>
                    <a href="/docs" onclick="window.app.closeMobileMenu()">Docs</a>
                    <a href="https://x.com/collaboralcap" target="_blank">X / Twitter</a>
                </div>
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
