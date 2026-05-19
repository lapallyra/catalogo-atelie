const fs = require('fs');
const path = require('path');

{
    const filePath = path.join(__dirname, 'src', 'components', 'SalesNotificationPortal.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    if(!content.includes("import { themes }")) {
        content = content.replace(/import \{ SaleNotification, CompanyId \} from '\.\.\/types';/g, "import { SaleNotification, CompanyId } from '../types';\nimport { themes } from '../lib/theme';");
    }
    fs.writeFileSync(filePath, content);
}

{
    const filePath = path.join(__dirname, 'src', 'components', 'CheckoutModal.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/theme\.text\.replace/g, "theme.textPrimary.replace");
    fs.writeFileSync(filePath, content);
}
console.log("Fixed Sales and Checkout modal");
