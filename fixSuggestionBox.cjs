const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'SuggestionBox.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// replace local themes definition with import
content = content.replace(/const themes = \{[\s\S]*?\}\s*};\s*/, "import { themes } from '../lib/theme';\n");

// It looks like that wasn't exactly right because the original import check. 
// Actually I'll do this properly via node script

fs.writeFileSync(filePath, content);
console.log('Fixed SuggestionBox.tsx imports');
