const fs = require('fs');
const activePath = 'FRONTEND/src/views/ActiveContracts.js';
let activeContent = fs.readFileSync(activePath, 'utf8');
const chunks = JSON.parse(fs.readFileSync('patch.json', 'utf8'));

chunks.forEach(chunk => {
    activeContent = activeContent.replace(chunk.TargetContent, chunk.ReplacementContent);
});

fs.writeFileSync(activePath, activeContent, 'utf8');
console.log("Patched successfully");
