const fs = require('fs');

const file = 'FRONTEND/src/views/Landing.js';
let content = fs.readFileSync(file, 'utf8');

const contractMatch = content.match(/<!--.*?LIVE CONTRACT EXAMPLES.*?-->/);
const logoMatch = content.match(/<!--.*?LOGO CAROUSEL.*?-->/);
const howMatch = content.match(/<!--.*?HOW IT WORKS.*?-->/);

if (contractMatch && logoMatch && howMatch) {
    const contractStart = contractMatch.index;
    const logoStart = logoMatch.index;
    const howStart = howMatch.index;
    
    const contractsBlock = content.substring(contractStart, logoStart);
    const logoBlock = content.substring(logoStart, howStart);
    
    const before = content.substring(0, contractStart);
    const after = content.substring(howStart);
    
    // Swap them: logoBlock then contractsBlock
    const newContent = before + logoBlock + '\n' + contractsBlock + after;
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Successfully swapped sections.');
} else {
    console.log('Could not find all sections via regex.');
}
