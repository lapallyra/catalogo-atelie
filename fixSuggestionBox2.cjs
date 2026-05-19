const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'SuggestionBox.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// remove the internal themes definition entirely
content = content.replace(/const themes = \{[\s\S]*?text: 'text-pink-600'\n    }\n  \};\n/g, "");

content = content.replace(/\$\{theme\.input\}/g, '${theme.cardBg} border ${theme.borderLine} text-inherit');
content = content.replace(/\$\{theme\.floating\}/g, '${theme.specialBtn}');
content = content.replace(/\$\{theme\.btn\}/g, '${theme.btnPrimary}');
content = content.replace(/\$\{theme\.text\}/g, '${theme.textPrimary}');

if(!content.includes("import { themes }")) {
    content = content.replace(/import \{ CompanyId \} from '\.\.\/types';/, "$&\nimport { themes } from '../lib/theme';");
}

fs.writeFileSync(filePath, content);
console.log('Fixed SuggestionBox.tsx fully');
