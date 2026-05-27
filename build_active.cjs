const fs = require('fs');

const overviewContent = fs.readFileSync('FRONTEND/src/views/Overview.js', 'utf8');

// The new ActiveContracts.js will be derived from Overview.js
let newActive = overviewContent;

// 1. Rename functions
newActive = newActive.replace('export function renderOverview()', 'export function renderActiveContracts()');
newActive = newActive.replace('export function initOverview()', 'export async function initActiveContracts()');

// 2. Add the act-market-btn CSS
const actMarketCSS = `
            .act-market-toggles {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 32px;
            }
            .act-market-btn {
                padding: 10px 20px;
                border-radius: 30px;
                background: #f5f5f5;
                color: #888;
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                border: 1px solid transparent;
                cursor: pointer;
                transition: all 0.2s;
            }
            .act-market-btn:hover { background: #eee; color: #111; }
            .act-market-btn.active { background: #111; color: #fff; border-color: #111; }
`;
newActive = newActive.replace('</style>', actMarketCSS + '\n        </style>');

// 3. Remove Sections 1, 2, 2.5, 2.75
const heroStart = newActive.indexOf('<!-- Section 1: Hero -->');
const marketHeaderStart = newActive.indexOf('<!-- Section 3: Live Market Header -->');
newActive = newActive.substring(0, heroStart) + newActive.substring(marketHeaderStart);

// 4. Update the Market Header text and add the toggles
const oldHeader = `
            <!-- Section 3: Live Market Header -->
            <section class="eq-market-header" id="live-market" data-reveal>
                <div class="eq-tag">Live Contracts</div>
                <h2 class="eq-market-title">Active <strong>market.</strong></h2>
                <div class="eq-market-live">
                    <div class="eq-market-dot"></div>
                    Live — Updated <span id="last-updated">04:20:00 PM</span>
                </div>
`;
const newHeader = `
            <!-- Active Market Header -->
            <section class="eq-market-header" style="padding-top:60px;" data-reveal>
                <h2 class="eq-market-title" style="margin-bottom:0; font-size:42px;">Active <strong>market.</strong></h2>
                <div class="eq-market-live" style="margin-top:16px;">
                    <div class="eq-market-dot"></div>
                    Live — Updated <span id="last-updated">04:20:00 PM</span>
                </div>
`;
newActive = newActive.replace(oldHeader, newHeader);

// 5. Insert Toggles above the Controls
const controlsStart = newActive.indexOf('<!-- Controls -->');
const togglesHtml = `
                <!-- Top Market Toggles -->
                <div class="act-market-toggles" id="act-market-toggles">
                    <button class="act-market-btn active" data-type="all">Open Market</button>
                    <button class="act-market-btn" data-type="solo">Solo Contracts</button>
                    <button class="act-market-btn" data-type="rivalry">Rivalries</button>
                </div>

                `;
newActive = newActive.substring(0, controlsStart) + togglesHtml + newActive.substring(controlsStart);

// 6. Update initActiveContracts to support toggles
const initStart = newActive.indexOf('let activeSort = \'trending_24h\';');
newActive = newActive.substring(0, initStart) + `let activeMarketType = 'all';\n    ` + newActive.substring(initStart);

const paramsStart = newActive.indexOf('const params = { sort: activeSort };');
newActive = newActive.substring(0, paramsStart) + `const params = { sort: activeSort };\n            if (activeMarketType !== 'all') params.type = activeMarketType;\n            ` + newActive.substring(paramsStart + 36);

const listenersStart = newActive.indexOf('// Tabs');
const listenersHtml = `
    // Market Toggles
    const marketToggles = document.getElementById('act-market-toggles');
    if (marketToggles) {
        marketToggles.addEventListener('click', (e) => {
            const btn = e.target.closest('.act-market-btn');
            if (!btn) return;
            marketToggles.querySelectorAll('.act-market-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeMarketType = btn.dataset.type || 'all';
            fetchFeed(false);
        });
    }

    `;
newActive = newActive.substring(0, listenersStart) + listenersHtml + newActive.substring(listenersStart);

// Save back to ActiveContracts.js
fs.writeFileSync('FRONTEND/src/views/ActiveContracts.js', newActive, 'utf8');
console.log('Successfully generated new ActiveContracts.js from Overview.js');
