const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'PrizeRouletteModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/className=\{`relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-8`\}/g,
'className={`relative ${theme.bg || "bg-white"} w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-8`}'
);

content = content.replace(/className="text-3xl font-fancy mb-4 tracking-widest text-black"/g,
'className="text-3xl font-fancy mb-4 tracking-widest"'
);

content = content.replace(/className="text-2xl font-fancy mb-2 tracking-widest text-black"/g,
'className="text-2xl font-fancy mb-2 tracking-widest"'
);

content = content.replace(/className="w-full py-5 text-white font-black uppercase tracking-\[0\.2em\] text-\[10px\] rounded-2xl transition-all hover:scale-\[1\.02\] active:scale-95 shadow-xl"/g,
'className={`w-full py-5 ${theme.btnPrimary || "bg-black text-white"} font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl`}'
);

content = content.replace(/className=\{`w-full py-4 text-white font-black uppercase tracking-widest rounded-xl transition-transform hover:scale-\[1\.02\] active:scale-95 shadow-xl disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2`\}/g,
'className={`w-full py-4 ${theme.btnPrimary || "bg-black text-white"} font-black uppercase tracking-widest rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-xl disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2`}'
);

content = content.replace(/className="absolute top-1\/2 left-1\/2 -translate-x-1\/2 -translate-y-1\/2 w-8 h-8 rounded-full bg-white shadow-md z-10 flex items-center justify-center"/g,
'className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${theme.cardBg || "bg-white"} shadow-md z-10 flex items-center justify-center`}'
);

// fix text colors that are not inline styled
content = content.replace(/<p className="text-\[11px\] uppercase tracking-\[0\.2em\] mb-8 font-medium text-center opacity-70">/g,
'<p className={`text-[11px] uppercase tracking-[0.2em] mb-8 font-medium text-center ${theme.textPrimary || "text-black"}`}>'
);

content = content.replace(/<p className="text-xs uppercase tracking-widest mb-6 font-medium text-center opacity-70">/g,
'<p className={`text-xs uppercase tracking-widest mb-6 font-medium text-center ${theme.textPrimary || "text-black"}`}>'
);

content = content.replace(/<p className="text-\[10px\] font-black uppercase tracking-\[0\.2em\] mt-6 mb-2 opacity-60">/g,
'<p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-6 mb-2 ${theme.textMuted || "text-gray-500"}`}>'
);

fs.writeFileSync(filePath, content);
console.log('Fixed PrizeRouletteModal.tsx');
