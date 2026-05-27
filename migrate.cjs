const fs = require('fs');

const overviewContent = fs.readFileSync('FRONTEND/src/views/Overview.js', 'utf8');
const activeContent = fs.readFileSync('FRONTEND/src/views/ActiveContracts.js', 'utf8');

// 1. EXTRACT OVERVIEW ASSETS
// CSS
const cssStart = overviewContent.indexOf('.eq-market-header {');
const cssEnd = overviewContent.indexOf('</style>', cssStart);
const overviewCSS = overviewContent.substring(cssStart, cssEnd);

// HTML
const gridHtmlStart = overviewContent.indexOf('<!-- Controls -->');
const gridHtmlEnd = overviewContent.indexOf('<!-- Rules Modal -->');
const overviewHTML = overviewContent.substring(gridHtmlStart, gridHtmlEnd);

const modalStart = overviewContent.indexOf('<!-- Rules Modal -->');
const modalEnd = overviewContent.indexOf('`;\n}', modalStart);
const overviewModal = overviewContent.substring(modalStart, modalEnd);

// Stats Strip
const statsStart = overviewContent.indexOf('<div class="eq-stats-strip">');
const statsEnd = overviewContent.indexOf('<!-- Controls -->', statsStart);
let heroStats = overviewContent.substring(statsStart, statsEnd);
// Keep the background white for ActiveContracts stats
heroStats = heroStats.replace('eq-stats-strip', 'eq-stats-strip" style="margin: 0; padding: 0; background: transparent; border: none; max-width: none;');

// JS
const jsStart = overviewContent.indexOf('export function initOverview() {');
const overviewJS = overviewContent.substring(jsStart);


// 2. MODIFY ACTIVECONTRACTS HTML
let newActive = activeContent;

// Inject CSS
newActive = newActive.replace('</style>', overviewCSS + '\n        </style>');

// Replace Title
newActive = newActive.replace(/<h1 class="act-hero-title">.*?<\/h1>/s, '<h2 class="eq-market-title" style="margin-bottom:0; font-size:48px;">Active <strong>market.</strong></h2>');
newActive = newActive.replace(/<p class="act-hero-desc">.*?<\/p>/s, '');

// Replace Hero Stats
newActive = newActive.replace(/<div class="act-hero-stats">.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/s, heroStats + '\n                    </div>\n                </div>\n            </div>');

// Replace everything from <!-- Tabs Row --> up to <!-- Contract Type Picker Modal -->
const actHtmlStart = newActive.indexOf('<!-- Tabs Row -->');
const actHtmlEnd = newActive.indexOf('<!-- Contract Type Picker Modal -->');
if (actHtmlStart !== -1 && actHtmlEnd !== -1) {
    newActive = newActive.substring(0, actHtmlStart) + overviewHTML + '\n        ' + overviewModal + '\n        ' + newActive.substring(actHtmlEnd);
}


// 3. MODIFY ACTIVECONTRACTS JS
const actJsStart = newActive.indexOf('export async function initActiveContracts() {');
if (actJsStart !== -1) {
    let replacedJS = overviewJS.replace('export function initOverview() {', `
export async function initActiveContracts() {
    const container = document.getElementById('act-content') || document.getElementById('eq-grid');
    if (!container) return;
    
    // Support the Open Market / Solo / Rivalry Toggles from ActiveContracts
    let activeMarketType = 'all';
    
    const marketToggles = document.getElementById('act-market-toggles');
    if (marketToggles) {
        marketToggles.addEventListener('click', (e) => {
            const btn = e.target.closest('.act-market-btn');
            if (!btn) return;
            marketToggles.querySelectorAll('.act-market-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeMarketType = btn.dataset.type || 'all';
            
            // Re-fetch with the new type
            if (typeof fetchFeed === 'function') fetchFeed(false);
        });
    }
    
`);
    
    // Inject the activeMarketType into fetchFeed logic
    replacedJS = replacedJS.replace('const params = { sort: activeSort };', 'const params = { sort: activeSort };\n            if (activeMarketType && activeMarketType !== \'all\') params.type = activeMarketType;');

    // Fix router references
    replacedJS = replacedJS.replace(/document\.getElementById\('live-market'\)\.scrollIntoView/g, 'window.scrollTo');

    // Replace everything from actJsStart to EOF
    newActive = newActive.substring(0, actJsStart) + replacedJS;
}

fs.writeFileSync('patch5.cjs', 'done');
fs.writeFileSync('FRONTEND/src/views/ActiveContracts.js', newActive, 'utf8');
console.log("Migration script executed.");
