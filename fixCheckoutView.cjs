const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'CheckoutView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file has a lot of hardcoded rose/white styles, we replace them with theme properties
content = content.replace(/bg-white/g, '${theme.cardBg}');
content = content.replace(/border-rose-100/g, '${theme.borderLine}');
content = content.replace(/border-rose-50/g, '${theme.borderLine}');
content = content.replace(/border border-emerald-100/g, 'border ${theme.borderLine}');
content = content.replace(/text-gray-400/g, '${theme.textMuted}');
content = content.replace(/text-gray-300/g, '${theme.textVeryMuted}');
content = content.replace(/bg-gray-100/g, '${theme.searchBg}');
content = content.replace(/bg-rose-500 text-white/g, '${theme.btnPrimary}');
content = content.replace(/shadow-rose-200/g, ''); // maybe remove shadow color
content = content.replace(/text-amber-600/g, '${theme.textPrimary}');
content = content.replace(/bg-amber-100/g, '${theme.specialBg}');

content = content.replace(/className="max-w-md w-full \$\{theme.cardBg\} rounded-\[3rem\] p-12 shadow-2xl space-y-8"/g, 'className={`max-w-md w-full ${theme.cardBg} rounded-[3rem] p-12 shadow-2xl space-y-8`}');
content = content.replace(/className="\$\{theme.cardBg\} rounded-\[3rem\] p-8 md:p-14 shadow-2xl border \$\{theme.borderLine\} space-y-10"/g, 'className={`${theme.cardBg} rounded-[3rem] p-8 md:p-14 shadow-2xl border ${theme.borderLine} space-y-10`}');
content = content.replace(/className="\$\{theme.cardBg\} rounded-\[3rem\] p-10 shadow-2xl border \$\{theme.borderLine\} space-y-8"/g, 'className={`${theme.cardBg} rounded-[3rem] p-10 shadow-2xl border ${theme.borderLine} space-y-8`}');
content = content.replace(/className="\$\{theme.cardBg\} rounded-\[2.5rem\] p-6 border \$\{theme.borderLine\} flex items-center gap-4"/g, 'className={`${theme.cardBg} rounded-[2.5rem] p-6 border ${theme.borderLine} flex items-center gap-4`}');
content = content.replace(/className="w-14 h-14 rounded-2xl \$\{theme.cardBg\} border \$\{theme.borderLine\} flex items-center justify-center text-2xl shrink-0 shadow-sm overflow-hidden"/g, 'className={`w-14 h-14 rounded-2xl ${theme.cardBg} border ${theme.borderLine} flex items-center justify-center text-2xl shrink-0 shadow-sm overflow-hidden`}');

fs.writeFileSync(filePath, content);
console.log('Fixed CheckoutView.tsx');
