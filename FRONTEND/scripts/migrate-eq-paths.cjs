const fs = require('fs');
const path = require('path');

const overviewPath = path.join(__dirname, '../src/views/Overview.js');
const activePath = path.join(__dirname, '../src/views/ActiveContracts.js');

let overviewContent = fs.readFileSync(overviewPath, 'utf8');
let activeContent = fs.readFileSync(activePath, 'utf8');

// Extract eq-paths CSS
const cssStart = overviewContent.indexOf('/* --- TWO PATHS (Solo vs Rivalry) --- */');
const cssEnd = overviewContent.indexOf('/* --- HOW IT WORKS (Shared) --- */', cssStart);
let cssBlock = overviewContent.substring(cssStart, cssEnd || overviewContent.indexOf('/* ---', cssStart + 10));

if (!cssBlock || cssBlock.length < 50) {
    console.log("Could not find CSS block");
    process.exit(1);
}

// Extract eq-paths HTML
const htmlStart = overviewContent.indexOf('<section class="eq-paths"');
const htmlEnd = overviewContent.indexOf('</section>', htmlStart) + 10;
let htmlBlock = overviewContent.substring(htmlStart, htmlEnd);

if (!htmlBlock || htmlBlock.length < 50) {
    console.log("Could not find HTML block");
    process.exit(1);
}

// Inject CSS into ActiveContracts.js
// Find the end of the style tag in ActiveContracts.js
const activeStyleEnd = activeContent.indexOf('</style>');
if (activeStyleEnd !== -1) {
    activeContent = activeContent.substring(0, activeStyleEnd) + '\n' + cssBlock + '\n' + activeContent.substring(activeStyleEnd);
}

// Inject HTML into ActiveContracts.js
// Find the end of the content area in ActiveContracts.js
// It ends with </div> \n </div> \n </div> \n `;
const actContentEnd = activeContent.lastIndexOf('</div>\n        </div>\n    `;');
if (actContentEnd !== -1) {
    activeContent = activeContent.substring(0, actContentEnd) + '\n                <!-- Integrated Solo Contracts -->\n                ' + htmlBlock + '\n' + activeContent.substring(actContentEnd);
}

fs.writeFileSync(activePath, activeContent, 'utf8');
console.log("Migration complete.");
