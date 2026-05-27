const fs = require('fs');

let activeJs = fs.readFileSync('FRONTEND/src/views/ActiveContracts.js', 'utf8');
const rivalryJs = fs.readFileSync('FRONTEND/src/views/Rivalry.js', 'utf8');

// 1. Extract CSS
const cssStartMarker = "/* \"?\"? Skeleton Cards \"?\"? */";
const cssEndMarker = "/* --- RULES MODAL --- */";
const cssStartIndex = rivalryJs.indexOf(cssStartMarker);
const cssEndIndex = rivalryJs.indexOf("</style>", cssStartIndex);

if (cssStartIndex !== -1 && cssEndIndex !== -1) {
    let extractedCss = rivalryJs.substring(cssStartIndex, cssEndIndex);
    // Remove the skeleton css
    extractedCss = extractedCss.replace(/(\/\* \"?\"? Skeleton Cards \"?\"? \*\/[\s\S]*?\/\* \"?\"? Rivalry Card \"?\"? \*\/)/, '');
    
    // Inject into ActiveContracts.js
    activeJs = activeJs.replace('/* --- RULES MODAL --- */', extractedCss + '\n            /* --- RULES MODAL --- */');
}

// 2. Extract getProviderColor
const providerStart = rivalryJs.indexOf('function getProviderColor(');
const providerEnd = rivalryJs.indexOf('}', providerStart) + 1;
const providerFunc = rivalryJs.substring(providerStart, providerEnd);

// 3. Extract renderCard
const renderCardStart = rivalryJs.indexOf('function renderCard(r) {');
const renderGridStart = rivalryJs.indexOf('function renderGrid() {', renderCardStart);
let renderRivalryCardFunc = rivalryJs.substring(renderCardStart, renderGridStart);
renderRivalryCardFunc = renderRivalryCardFunc.replace('function renderCard(r)', 'function renderRivalryCard(r)');

// Inject functions
const injectPoint = "function renderCard(c) {";
activeJs = activeJs.replace(injectPoint, providerFunc + '\n\n    ' + renderRivalryCardFunc + '\n\n    ' + injectPoint);

// 4. Update renderGrid
const renderGridOld = `        visibleContracts.forEach(contract => {
            const el = document.createElement('div');
            el.innerHTML = renderCard(contract);
            const card = el.firstElementChild;
            grid.appendChild(card);
        });`;

const renderGridNew = `        visibleContracts.forEach(contract => {
            const el = document.createElement('div');
            if (activeMarketType === 'rivalry' || contract.challenger) {
                el.innerHTML = renderRivalryCard(contract);
                // Also listen to rivalry clicks to go to rivalry detail
                const card = el.firstElementChild;
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = card.dataset.id;
                    if (id) window.router.navigate('/rivalry/' + id);
                });
                grid.appendChild(card);
            } else {
                el.innerHTML = renderCard(contract);
                const card = el.firstElementChild;
                grid.appendChild(card);
            }
        });`;

activeJs = activeJs.replace(renderGridOld, renderGridNew);

fs.writeFileSync('FRONTEND/src/views/ActiveContracts.js', activeJs);
console.log('Successfully migrated Rivalry UI to ActiveContracts.js');
