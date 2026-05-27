const fs = require('fs');

const overviewContent = fs.readFileSync('FRONTEND/src/views/Overview.js', 'utf8');
const activeContent = fs.readFileSync('FRONTEND/src/views/ActiveContracts.js', 'utf8');

// 1. EXTRACT FROM OVERVIEW
const cssStart = overviewContent.indexOf('.eq-market-header {');
const cssEnd = overviewContent.indexOf('</style>', cssStart);
const overviewCSS = overviewContent.substring(cssStart, cssEnd);

const gridHtmlStart = overviewContent.indexOf('<!-- Controls -->');
const gridHtmlEnd = overviewContent.indexOf('<!-- Rules Modal -->');
const overviewHTML = overviewContent.substring(gridHtmlStart, gridHtmlEnd);

const modalStart = overviewContent.indexOf('<!-- Rules Modal -->');
const modalEnd = overviewContent.indexOf('`;\n}', modalStart);
const overviewModal = overviewContent.substring(modalStart, modalEnd);

const statsStart = overviewContent.indexOf('<div class="eq-stats-strip">');
const statsEnd = overviewContent.indexOf('<!-- Controls -->', statsStart);
let heroStats = overviewContent.substring(statsStart, statsEnd);
heroStats = heroStats.replace('eq-stats-strip', 'eq-stats-strip" style="margin: 0; padding: 0; background: transparent; border: none; max-width: none;');

const jsStart = overviewContent.indexOf('export function initOverview() {');
const overviewJS = overviewContent.substring(jsStart);

// 2. APPLY TO ACTIVE
let newActive = activeContent;

// Append CSS right before </style>
newActive = newActive.replace('</style>', overviewCSS + '\n        </style>');

// Fix Header text
newActive = newActive.replace(/<h1 class="act-hero-title">.*?<\/h1>/s, '<h2 class="eq-market-title" style="margin-bottom:0; font-size:48px;">Active <strong>market.</strong></h2>');
newActive = newActive.replace(/<p class="act-hero-desc">.*?<\/p>/s, '');

// Replace Hero Stats
newActive = newActive.replace(/<div class="act-hero-stats">.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/s, heroStats + '\n                    </div>\n                </div>\n            </div>');

// Replace Tabs + List with Grid
const actHtmlStart = newActive.indexOf('<!-- Tabs Row -->');
const actHtmlEnd = newActive.indexOf('<!-- Contract Type Picker Modal -->');
newActive = newActive.substring(0, actHtmlStart) + overviewHTML + '\n        ' + overviewModal + '\n        ' + newActive.substring(actHtmlEnd);

// Replace JS
const actJsStart = newActive.indexOf('export async function initActiveContracts() {');

let replacedJS = overviewJS.replace('export function initOverview() {', `
export async function initActiveContracts() {
    const container = document.getElementById('act-content') || document.getElementById('eq-grid');
    if (!container) return;
    
    let activeMarketType = 'all';
    
    const marketToggles = document.getElementById('act-market-toggles');
    if (marketToggles) {
        marketToggles.addEventListener('click', (e) => {
            const btn = e.target.closest('.act-market-btn');
            if (!btn) return;
            marketToggles.querySelectorAll('.act-market-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeMarketType = btn.dataset.type || 'all';
            
            if (typeof fetchFeed === 'function') fetchFeed(false);
        });
    }
`);

replacedJS = replacedJS.replace('const params = { sort: activeSort };', 'const params = { sort: activeSort };\n            if (activeMarketType && activeMarketType !== \'all\') params.type = activeMarketType;');
replacedJS = replacedJS.replace(/document\.getElementById\('live-market'\)\.scrollIntoView/g, 'window.scrollTo');

newActive = newActive.substring(0, actJsStart) + replacedJS;

fs.writeFileSync('FRONTEND/src/views/ActiveContracts.js', newActive, 'utf8');
console.log('Clean patch applied.');
