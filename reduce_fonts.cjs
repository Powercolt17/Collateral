const fs = require('fs');
const path = require('path');
const dir = 'FRONTEND/src/views';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

const map = {
  '56': '42',
  '52': '38',
  '48': '36',
  '44': '32',
  '42': '32',
  '40': '30',
  '38': '28',
  '36': '28',
  '32': '24',
  '28': '22'
};

let totalChanged = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const newContent = content.replace(/font-size:\s*(56|52|48|44|42|40|38|36|32|28)px/g, (match, size) => {
    return 'font-size: ' + map[size] + 'px';
  });
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated ' + file);
    totalChanged++;
  }
}
console.log('Total files updated: ' + totalChanged);
