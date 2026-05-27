const fs = require('fs');
const activePath = 'FRONTEND/src/views/ActiveContracts.js';
let activeContent = fs.readFileSync(activePath, 'utf8');

// Normalize to \n just for finding
const normalizedActive = activeContent.replace(/\r\n/g, '\n');

const chunks = JSON.parse(fs.readFileSync('patch.json', 'utf8'));

chunks.forEach(chunk => {
    // Normalize chunk target too
    const target = chunk.TargetContent.replace(/\r\n/g, '\n');
    const replacement = chunk.ReplacementContent.replace(/\n/g, '\r\n');
    
    // Find index in normalized string
    const idx = normalizedActive.indexOf(target);
    if (idx !== -1) {
        // Since we know where it is, let's do a precise replace on the original string
        // Actually, let's just normalize the whole activeContent to \n, do the replace, and then write it back
        activeContent = activeContent.replace(/\r\n/g, '\n').replace(target, chunk.ReplacementContent).replace(/\n/g, '\r\n');
    } else {
        console.log("Could not find chunk!");
    }
});

fs.writeFileSync(activePath, activeContent, 'utf8');
console.log("Patched successfully with line ending normalization");
