const fs = require('fs');
const path = require('path');

{
    const filePath = path.join(__dirname, 'src', 'components', 'SalesNotificationPortal.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/\$\{theme\.text\}/g, "${theme.textPrimary}");
    content = content.replace(/className=\{theme\.text\}/g, "className={theme.textPrimary}");

    fs.writeFileSync(filePath, content);
}
console.log("Fixed Sales again");
