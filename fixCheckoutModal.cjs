const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'CheckoutModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/const themeByAtelier = \{[\s\S]*?\};/m, '');
content = content.replace(/const theme = \{[\s\S]*?\};/m, "const theme = themes[companyId as keyof typeof themes] || themes.pallyra;");

if (!content.includes("import { themes }")) {
    content = content.replace(/import \{.*\} from '\.\/ImageWithFallback';/m, "$&\nimport { themes } from '../lib/theme';");
}

fs.writeFileSync(filePath, content);
console.log('Fixed CheckoutModal.tsx');
