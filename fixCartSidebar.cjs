const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'CartSidebar.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all companyId === 'pallyra' ? X : Y and just use theme
content = content.replace(/\$\{companyId === 'pallyra' \? 'bg-\[#F8F8F6\] text-\[#161616\]' : theme\.bg\}/g, "${theme.bg} ${theme.textPrimary}");
content = content.replace(/\$\{companyId === 'pallyra' \? 'border-\[#161616\]\/5' : theme\.borderLine\}/g, "${theme.borderLine}");
content = content.replace(/\$\{companyId === 'pallyra' \? 'text-\[#161616\]' : theme\.textPrimary\}/g, "${theme.textPrimary}");
content = content.replace(/\$\{companyId === 'pallyra' \? 'hover:bg-\[#161616\]\/5 text-\[#161616\]\/50 hover:text-\[#161616\]' : theme\.btnSecondary\}/g, "${theme.btnSecondary}");
content = content.replace(/\$\{companyId === 'pallyra' \? 'border-\[#161616\]\/5 bg-white' : theme\.borderLine \+ ' ' \+ \(isMimada \? 'bg-\[#FF007F\]\/5' : 'bg-white\/5'\)\}/g, "${theme.borderLine} ${theme.cardBg}");
content = content.replace(/\$\{companyId === 'pallyra' \? 'bg-\[#C6A664\]\/10 border-\[#C6A664\]\/50 text-\[#161616\]' : theme\.specialBg \+ ' ' \+ theme\.specialBorder \+ ' ' \+ theme\.textPrimary\}/g, "${theme.specialBg} ${theme.specialBorder} ${theme.textPrimary}");
content = content.replace(/\$\{companyId === 'pallyra' \? 'border-\[#161616\]\/10 text-\[#161616\] focus:border-\[#C6A664\]' : theme\.borderLine \+ ' ' \+ theme\.textPrimary\}/g, "${theme.borderLine} ${theme.textPrimary}");
content = content.replace(/\$\{companyId === 'pallyra' \? 'border-\[#161616\]\/10 text-\[#161616\] hover:border-\[#C6A664\] hover:bg-\[#F8F8F6\]' : 'bg-white\/5 ' \+ theme\.borderLine \+ ' ' \+ theme\.textPrimary \+ ' hover:bg-white\/10'\}/g, "${theme.btnSecondary}");
content = content.replace(/\$\{companyId === 'pallyra' \? 'bg-\[#161616\] text-\[#C6A664\] hover:bg-\[#C6A664\] hover:text-\[#161616\]' : theme\.btnPrimary\}/g, "${theme.btnPrimary}");
content = content.replace(/className="flex items-center gap-3 bg-white p-1 rounded-lg border border-\[#161616\]\/10"/g, "className={`flex items-center gap-3 ${theme.searchBg} p-1 rounded-lg border ${theme.borderLine}`}");
content = content.replace(/bg-white \$\{theme\.textPrimary\}/g, "${theme.btnPrimary}");

fs.writeFileSync(filePath, content);
console.log('Fixed CartSidebar.tsx');
