const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'SalesNotificationPortal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// replace getTheme logic
content = content.replace(/const getTheme = \(companyId: CompanyId\) => \{[\s\S]*?return \{ bg: 'bg-white\/10', border: 'border-white\/20', text: 'text-gold', accent: 'text-white\/90', time: 'text-white\/40' \};\n  \};\n/g, "");

content = content.replace(/const theme = notification \? getTheme\(notification\.companyId\) : getTheme\('pallyra' as CompanyId\);/g, 
"const theme = themes[(notification ? notification.companyId : 'pallyra') as keyof typeof themes] || themes.pallyra;");

// Update JSX interpolation from old internal 'time'/'accent' properties to real theme classes
content = content.replace(/\$\{theme\.time\}/g, '${theme.textVeryMuted}');
content = content.replace(/\$\{theme\.accent\}/g, '${theme.textSecondary}');
content = content.replace(/\$\{theme\.border\}/g, '${theme.borderLine}');
content = content.replace(/\$\{theme\.text\}/g, '${theme.textPrimary}');

if (!content.includes('import { themes }')) {
  content = content.replace(/import \{ CompanyId \} from '\.\.\/types';/g, "$&\nimport { themes } from '../lib/theme';");
}

fs.writeFileSync(filePath, content);
console.log('Fixed SalesNotificationPortal.tsx');
