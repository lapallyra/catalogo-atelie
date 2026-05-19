const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'SearchedGiftListModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/className=\{`fixed left-1\/2 top-1\/2 -translate-x-1\/2 -translate-y-1\/2 w-full max-w-2xl bg-white shadow-2xl z-\[1001\] overflow-hidden md:rounded-\[2\.5rem\] flex flex-col max-h-\[90vh\]`\}/g,
"className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl ${theme.bg} shadow-2xl z-[1001] overflow-hidden md:rounded-[2.5rem] flex flex-col max-h-[90vh]`}");

content = content.replace(/className="bg-white p-4 md:p-5 rounded-3xl border border-black\/5 flex items-center gap-5 group cursor-pointer hover:shadow-xl transition-all duration-500"/g,
'className={`p-4 md:p-5 rounded-3xl border ${theme.borderLine} ${theme.cardBg} flex items-center gap-5 group cursor-pointer hover:shadow-xl transition-all duration-500`}'
);

content = content.replace(/className="p-3 rounded-2xl text-white shadow-lg shadow-black\/10 transition-all hover:scale-110 active:scale-95"/g,
'className={`p-3 rounded-2xl ${theme.btnPrimary} shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95`}'
);

content = content.replace(/className="p-8 md:p-10 border-t border-black\/5 bg-white"/g,
'className={`p-8 md:p-10 border-t ${theme.borderLine} ${theme.bg}`}'
);

content = content.replace(/className="w-full py-5 rounded-2xl bg-\[#161616\] text-white text-\[11px\] font-black uppercase tracking-\[0\.3em\] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"/g,
'className={`w-full py-5 rounded-2xl ${theme.btnPrimary} text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95`}'
);

content = content.replace(/className="text-\[10px\] font-black uppercase tracking-\[0\.2em\] opacity-40"/g,
'className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.textMuted}`}'
);

content = content.replace(/className="text-lg md:text-xl font-bold"/g,
'className={`text-lg md:text-xl font-bold ${theme.textPrimary}`}'
);

fs.writeFileSync(filePath, content);
console.log('Fixed SearchedGiftListModal.tsx');
