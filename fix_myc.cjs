const fs = require('fs');

const active = fs.readFileSync('FRONTEND/src/views/ActiveContracts.js', 'utf8');
const match = active.match(/\/\* --- CARD GRID ---\s*\*\/([\s\S]*?)\/\* --- RULES MODAL --- \*\//);

if (!match) {
    console.error("Could not find CARD GRID css");
    process.exit(1);
}

const css = match[1];

let myc = fs.readFileSync('FRONTEND/src/views/MyContracts.js', 'utf8');
myc = myc.replace('${cssStr}', css);

fs.writeFileSync('FRONTEND/src/views/MyContracts.js', myc);
console.log("Fixed CSS in MyContracts.js");
