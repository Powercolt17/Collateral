const fs = require('fs');

const activePath = 'FRONTEND/src/views/ActiveContracts.js';
let activeContent = fs.readFileSync(activePath, 'utf8');

// 1. Fix the header
const heroStart = activeContent.indexOf('<h1 class="act-hero-title">');
const heroEnd = activeContent.indexOf('</h1>', heroStart) + 5;
if (heroStart !== -1) {
    activeContent = activeContent.substring(0, heroStart) + '<h2 class="eq-market-title" style="margin-bottom:0; font-size:42px;">Active <strong>market.</strong></h2>' + activeContent.substring(heroEnd);
}

// 2. Add the toggle logic to initActiveContracts
// I'll inject activeType state into the variables at the top of initActiveContracts
const stateStart = activeContent.indexOf('let activeSort = \'trending_24h\';');
if (stateStart !== -1) {
    activeContent = activeContent.substring(0, stateStart) + 'let activeMarketType = \'all\';\n    ' + activeContent.substring(stateStart);
}

// 3. Update fetchFeed to include activeMarketType
const fetchParamsStart = activeContent.indexOf('const params = { sort: activeSort };');
if (fetchParamsStart !== -1) {
    activeContent = activeContent.substring(0, fetchParamsStart) + 'const params = { sort: activeSort };\n            if (activeMarketType !== \'all\') params.type = activeMarketType;\n' + activeContent.substring(fetchParamsStart + 36);
}

// 4. Bind the "act-market-toggles"
const bindListenersStart = activeContent.indexOf('// Tabs');
if (bindListenersStart !== -1) {
    const bindToggleLogic = `
    // Market Toggles (Open Market, Solo, Rivalries)
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
    activeContent = activeContent.substring(0, bindListenersStart) + bindToggleLogic + activeContent.substring(bindListenersStart);
}

// Also remove the <p class="act-hero-desc"> since the stats strip takes its place
activeContent = activeContent.replace(/<p class="act-hero-desc">.*?<\/p>/s, '');

fs.writeFileSync(activePath, activeContent, 'utf8');
console.log("Fixed ActiveContracts.js");
