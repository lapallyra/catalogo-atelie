const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Catalog', 'CatalogHeader.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/style=\{\{\s*color:\s*\(isMimada.*?\?.*?:.*?\}\}/g, "");
content = content.replace(/style=\{\{\s*color:\s*isMimada.*?\}\}/g, "");
// just inject theme.textPrimary / theme.textSecondary via classNames

// 76: color: isMimada && theme.primaryColor === '#FFFFFF' ? '#FF007F' : (isMimada ? '#ffffff' : theme.accentColor),
// 89: style={{ color: (isMimada && theme.primaryColor !== '#FFFFFF') || companyId === 'guennita' ? '#ffffff' : '#000000' }}
// 106: style={{ color: (isMimada && theme.primaryColor !== '#FFFFFF') || companyId === 'guennita' ? '#ffffff' : theme.accentColor }}
// 112: color: (isMimada && theme.primaryColor !== '#FFFFFF') || companyId === 'guennita' ? '#ffffff' : '#161616',
// 122: style={{ color: isMimada && theme.primaryColor !== '#FFFFFF' ? '#ffffff' : theme.accentColor }}

content = content.replace(/style=\{\{\s*color:\s*[^}]+\}\}/g, ""); // removes all style color overrides
content = content.replace(/<span className="text-\[10px\] uppercase tracking-\[0\.2em\] font-black opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-2"/g, 
'<span className={`text-[10px] uppercase tracking-[0.2em] font-black opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-2 ${theme.textPrimary}`}'
);

content = content.replace(/<Search size=\{16\} className="opacity-40 transition-opacity group-focus-within:opacity-100"/g, 
'<Search size={16} className={`opacity-40 transition-opacity group-focus-within:opacity-100 ${theme.textPrimary}`}'
);

content = content.replace(/<div className="flex flex-col text-right"/g, 
'<div className={`flex flex-col text-right ${theme.textPrimary}`}'
);

content = content.replace(/<ShoppingBag size=\{20\} strokeWidth=\{1\.5\} className="opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110"/g, 
'<ShoppingBag size={20} strokeWidth={1.5} className={`opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 ${theme.textPrimary}`}'
);

content = content.replace(/<h1 className="relative z-10 text-xl font-bold tracking-widest uppercase"/g, 
'<h1 className={`relative z-10 text-xl font-bold tracking-widest uppercase ${theme.textPrimary}`}'
);

// fix the icon container background 
content = content.replace(/className=\{`w-32 h-32 md:w-40 md:h-40 \$\{isMimada \? 'bg-white shadow-lg' : 'bg-white\/10 shadow-2xl'\} rounded-full flex items-center justify-center relative transition-all duration-700 overflow-hidden cursor-pointer`\}/g,
'className={`w-32 h-32 md:w-40 md:h-40 ${theme.cardBg} shadow-2xl rounded-full flex items-center justify-center relative transition-all duration-700 overflow-hidden cursor-pointer`}'
);

fs.writeFileSync(filePath, content);
console.log('Fixed CatalogHeader.tsx');
