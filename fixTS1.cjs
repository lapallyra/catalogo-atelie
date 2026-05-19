const fs = require('fs');
const path = require('path');

{
    const filePath = path.join(__dirname, 'src', 'components', 'SuggestionBox.tsx');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Completely remove the themes definition
    content = content.replace(/const themes = \{[\s\S]*?bg: 'bg-white\/95 border-\[#FF007F\]\/20 text-gray-900',[\s\S]*?\}\s*};\s*/m, "");
    
    fs.writeFileSync(filePath, content);
}

{
    const filePath = path.join(__dirname, 'src', 'components', 'CheckoutModal.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/theme=\{\{ accentColor: theme\.accent\.includes[\s\S]*?\? '#d4af37' : '#d4af37' \}\}/g, "theme={{ accentColor: theme.accentColor }}");
    content = content.replace(/\$\{theme\.text\}/g, "${theme.textPrimary}");
    content = content.replace(/\$\{theme\.accent\}/g, "${theme.specialText}");
    content = content.replace(/className=\{theme\.text\}/g, "className={theme.textPrimary}");
    content = content.replace(/className=\{theme\.accent\}/g, "className={theme.specialText}");
    fs.writeFileSync(filePath, content);
}

{
    const filePath = path.join(__dirname, 'src', 'components', 'SalesNotificationPortal.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    if(!content.includes("import { themes }")) {
        content = content.replace(/import \{ CompanyId \} from '\.\.\/types';/g, "import { CompanyId } from '../types';\nimport { themes } from '../lib/theme';");
    }

    fs.writeFileSync(filePath, content);
}

console.log('Fixed additional typescript errors');
