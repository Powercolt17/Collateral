const fs = require('fs');

// 1. UPDATE MAIN.JS
let mainJs = fs.readFileSync('FRONTEND/src/main.js', 'utf8');

// Replace routes
mainJs = mainJs.replace(/path: '\/contracts'/g, "path: '/market'");
// Also update the redirect on search
mainJs = mainJs.replace(/window\.router\.navigate\('\/contracts'\)/g, "window.router.navigate('/market')");
// Update protected routes
mainJs = mainJs.replace(/'\/contracts'/g, "'/market'");

fs.writeFileSync('FRONTEND/src/main.js', mainJs);


// 2. UPDATE HEADER.JS
let headerJs = fs.readFileSync('FRONTEND/src/components/Header.js', 'utf8');

const oldRoutes = `    const routes = [
        { path: '/contracts', label: 'ACTIVE' },
        { path: '/rivalry', label: 'RIVALRY' },
        { path: '/ledger', label: 'LEDGER' },
        { path: '/sources', label: 'SOURCES' }
    ];`;

const newRoutes = `    const routes = [
        { path: '/market', label: 'MARKET', hasDropdown: true },
        { path: '/ledger', label: 'LEDGER' },
        { path: '/sources', label: 'SOURCES' }
    ];`;

headerJs = headerJs.replace(oldRoutes, newRoutes);

const oldNavItems = `    const navItems = routes.map(route => {
        const isActive = currentRoute === route.path ||
            (route.path === '/contracts' && (currentRoute === '/contracts' || currentRoute.startsWith('/contracts/')));

        return \`
            <a href="#" 
                onclick="window.router.navigate('\${route.path}'); return false;" 
                class="nav-link \${isActive ? 'active' : ''}"
                data-target="\${route.path}" 
                data-active="\${isActive}">
                \${route.label}
            </a>
        \`;
    }).join('');`;

const newNavItems = `    const navItems = routes.map(route => {
        const isActive = currentRoute === route.path ||
            (route.path === '/market' && (currentRoute === '/market' || currentRoute.startsWith('/market/')));

        if (route.hasDropdown) {
            return \`
                <div class="nav-dropdown-wrap">
                    <a href="#" 
                        onclick="window.router.navigate('\${route.path}'); return false;" 
                        class="nav-link \${isActive ? 'active' : ''}"
                        data-target="\${route.path}" 
                        data-active="\${isActive}">
                        \${route.label}
                    </a>
                    <div class="nav-dropdown">
                        <a href="#" onclick="window.router.navigate('/market?type=solo'); return false;">Solo Contracts</a>
                        <a href="#" onclick="window.router.navigate('/market?type=rivalry'); return false;">Rivalry Contracts</a>
                    </div>
                </div>
            \`;
        }

        return \`
            <a href="#" 
                onclick="window.router.navigate('\${route.path}'); return false;" 
                class="nav-link \${isActive ? 'active' : ''}"
                data-target="\${route.path}" 
                data-active="\${isActive}">
                \${route.label}
            </a>
        \`;
    }).join('');`;

headerJs = headerJs.replace(oldNavItems, newNavItems);

const oldPanelItems = `    const panelNavItems = routes.map((route, i) => {
        const isActive = currentRoute === route.path ||
            (route.path === '/contracts' && (currentRoute === '/contracts' || currentRoute.startsWith('/contracts/')));`;

const newPanelItems = `    const panelNavItems = routes.map((route, i) => {
        const isActive = currentRoute === route.path ||
            (route.path === '/market' && (currentRoute === '/market' || currentRoute.startsWith('/market/')));`;

headerJs = headerJs.replace(oldPanelItems, newPanelItems);


// Add Dropdown CSS
const cssToInject = `
            /* ── Nav Dropdown ── */
            .nav-dropdown-wrap { position: relative; display: flex; height: 100%; align-items: center; }
            .nav-dropdown {
                position: absolute;
                top: 54px;
                left: 50%;
                transform: translateX(-50%) translateY(10px);
                background: #fff;
                border: 1px solid #e5e5e5;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                padding: 8px 0;
                min-width: 180px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s ease;
                z-index: 100;
                border-radius: 4px;
            }
            .nav-dropdown-wrap:hover .nav-dropdown {
                opacity: 1;
                visibility: visible;
                transform: translateX(-50%) translateY(0);
            }
            .nav-dropdown a {
                display: block;
                padding: 10px 20px;
                color: #555;
                text-decoration: none;
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                font-weight: 500;
                transition: background 0.15s, color 0.15s;
                text-align: left;
            }
            .nav-dropdown a:hover {
                background: #fafafa;
                color: #111;
            }
`;

headerJs = headerJs.replace('/* ── Nav Links (desktop center) ── */', cssToInject + '\n            /* ── Nav Links (desktop center) ── */');

fs.writeFileSync('FRONTEND/src/components/Header.js', headerJs);


// 3. UPDATE ACTIVECONTRACTS.JS to read query params on load
let activeJs = fs.readFileSync('FRONTEND/src/views/ActiveContracts.js', 'utf8');

// We need to parse query params in initActiveContracts
const initStart = activeJs.indexOf(`let activeMarketType = 'all';`);
if (initStart !== -1) {
    const replacement = `const urlParams = new URLSearchParams(window.location.search);
    let activeMarketType = urlParams.get('type') || 'all';`;
    activeJs = activeJs.replace(`let activeMarketType = 'all';`, replacement);
}

// We also need to update the UI toggles to reflect the query param
const toggleScript = `
    const marketToggles = document.getElementById('act-market-toggles');
    if (marketToggles) {
        // Init active state based on URL param
        marketToggles.querySelectorAll('.act-market-btn').forEach(b => {
            if (b.dataset.type === activeMarketType) {
                marketToggles.querySelectorAll('.act-market-btn').forEach(bb => bb.classList.remove('active'));
                b.classList.add('active');
            }
        });

        marketToggles.addEventListener('click', (e) => {
`;

activeJs = activeJs.replace(`    const marketToggles = document.getElementById('act-market-toggles');\n    if (marketToggles) {\n        marketToggles.addEventListener('click', (e) => {`, toggleScript);

fs.writeFileSync('FRONTEND/src/views/ActiveContracts.js', activeJs);

console.log('Successfully updated navigation to dropdown and /market route.');
