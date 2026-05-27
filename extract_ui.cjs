const fs = require('fs');

const overviewContent = fs.readFileSync('FRONTEND/src/views/Overview.js', 'utf8');

// Get the grid container HTML from Overview.js
const marketControlsStart = overviewContent.indexOf('<!-- Controls -->');
const gridEnd = overviewContent.indexOf('<!-- Stake Warning -->');
const marketUI = overviewContent.substring(marketControlsStart, gridEnd);

console.log(marketUI.length);
