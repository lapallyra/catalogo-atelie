const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'CheckoutModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace property names in CheckoutModal.tsx
content = content.replace(/\$\{theme\.text\}/g, '${theme.textPrimary}');
content = content.replace(/\$\{theme\.card\}/g, '${theme.cardBg}');
content = content.replace(/\$\{theme\.border\}/g, '${theme.borderLine}');
content = content.replace(/\$\{theme\.divider\}/g, '${theme.borderLine}');
content = content.replace(/\$\{theme\.button\}/g, '${theme.btnPrimary}');
content = content.replace(/\$\{theme\.accent\}/g, '${companyId === "mimada" ? "font-bold text-[#FF007F]" : theme.specialText}');
content = content.replace(/\$\{theme\.input\}/g, '${theme.cardBg} border ${theme.borderLine} focus:border-[#C6A664] focus:ring-1');

// there's a place with theme.text.replace which will break
content = content.replace(/theme\.textPrimary\.replace/g, 'theme.bg.replace');

fs.writeFileSync(filePath, content);
console.log('Fixed CheckoutModal props');
