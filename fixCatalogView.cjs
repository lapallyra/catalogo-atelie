const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'CatalogView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/className=\{`group relative flex flex-col cursor-pointer \$\{companyId === 'guennita' \? 'bg-\[#2A0A0A\] border-white\/5' : 'bg-white border-black\/5'\} rounded-\[2\.5rem\] overflow-hidden transition-all duration-500 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] hover:shadow-2xl border hover:-translate-y-2`\}/g,
'className={`group relative flex flex-col cursor-pointer ${theme.cardBg} ${theme.borderLine} rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl border hover:-translate-y-2`}'
);

content = content.replace(/className=\{`p-4 md:p-5 flex flex-col gap-1\.5 relative z-10 \$\{companyId === 'guennita' \? 'bg-\[#2A0A0A\]' : 'bg-white'\}`\}/g,
'className={`p-4 md:p-5 flex flex-col gap-1.5 relative z-10 ${theme.cardBg}`}'
);

content = content.replace(/className="fixed left-1\/2 top-1\/2 -translate-x-1\/2 -translate-y-1\/2 w-full max-w-sm bg-white p-8 rounded-3xl z-\[1101\] shadow-2xl overflow-hidden"/g,
'className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm ${theme.cardBg} p-8 rounded-3xl z-[1101] shadow-2xl overflow-hidden`}'
);

content = content.replace(/className="w-full bg-\[#F9F9F8\] border border-black\/5 rounded-2xl px-5 py-4 text-sm font-bold uppercase tracking-widest focus:ring-4 transition-all focus:bg-white"/g,
'className={`w-full ${theme.searchBg} border ${theme.borderLine} rounded-2xl px-5 py-4 text-sm font-bold uppercase tracking-widest focus:ring-4 transition-all focus:bg-white ${theme.textPrimary}`}'
);

// fix nav buttons in CatalogView
content = content.replace(/className="w-9 h-9 flex items-center justify-center rounded-full text-\[#161616\]\/70 bg-white\/20 backdrop-blur-md border border-white\/20 shadow-md hover:text-\[#161616\] active:scale-95 transition-all"/g,
'className={`w-9 h-9 flex items-center justify-center rounded-full ${theme.btnSecondary} backdrop-blur-md shadow-md active:scale-95 transition-all`}'
);

fs.writeFileSync(filePath, content);
console.log('Fixed CatalogView.tsx');
