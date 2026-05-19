import fs from 'fs';

let content = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf8');

// Replace hardcoded inputs
content = content.replace(/\$\{companyId === 'mimada' \? 'text-pink-700 font-bold' : 'text-white'\}/g, '${theme.text}');

// Replace line 691 text-white
content = content.replace(/\$\{companyId === 'mimada' \? 'text-gray-900 border-gray-200' : 'text-white'\}/g, '${theme.text}');

// Replace line 722 checkbox text-white
content = content.replace(/className="text-white" size=\{12\}/g, 'className={theme.text} size={12}');

// Write back
fs.writeFileSync('src/components/CheckoutModal.tsx', content);

// Also do it for CartSidebar
let cartContent = fs.readFileSync('src/components/CartSidebar.tsx', 'utf8');

cartContent = cartContent.replace(/text-white\/40/g, 'text-inherit/40');

fs.writeFileSync('src/components/CartSidebar.tsx', cartContent);

console.log("Fixed files");
