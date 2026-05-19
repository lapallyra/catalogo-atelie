const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ProductDetailModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// replace variation buttons
content = content.replace(/className=\{`px-6 py-3 text-\[11px\] font-bold rounded-xl border-2 transition-all duration-500 uppercase tracking-widest \$\{selectedVariation === `\$\{v.name\}: \$\{opt.name\}` \? 'text-white border-black shadow-lg scale-\[1.05\]' : 'border-black\/5 hover:border-black\/10 hover:bg-black\/5'\} \$\{selectedVariation === `\$\{v.name\}: \$\{opt.name\}` \? \(isMimada \? 'bg-\[#FF007F\]' : 'bg-black'\) : theme.textSecondary\}`}/g,
'className={`px-6 py-3 text-[11px] font-bold rounded-xl border-2 transition-all duration-500 uppercase tracking-widest ${selectedVariation === `${v.name}: ${opt.name}` ? `scale-[1.05] shadow-lg ${theme.btnPrimary} border-transparent` : `${theme.btnSecondary}`}`}'
);

// replace minus/plus buttons
content = content.replace(/className=\{`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black hover:text-white transition-all active:scale-90 \$\{theme.textPrimary\}`\}/g,
'className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 ${theme.btnSecondary}`}'
);

// bg-white for modal container
content = content.replace(/className="bg-white rounded-\[2rem\] w-full max-w-5xl h-\[90vh\] md:h-auto overflow-hidden relative shadow-2xl flex flex-col md:flex-row"/g,
'className={`${theme.bg} rounded-[2rem] w-full max-w-5xl h-[90vh] md:h-auto overflow-hidden relative shadow-2xl flex flex-col md:flex-row`}'
);

// close button hardcoding
content = content.replace(/className="absolute top-6 right-6 z-50 w-10 h-10 bg-white\/80 backdrop-blur-md rounded-full flex items-center justify-center text-black shadow-lg hover:scale-110 active:scale-90 transition-all border border-black\/5"/g,
'className={`absolute top-6 right-6 z-50 w-10 h-10 ${theme.specialBg} ${theme.specialBorder} backdrop-blur-md rounded-full flex items-center justify-center ${theme.textPrimary} shadow-lg hover:scale-110 active:scale-90 transition-all border`}'
);

fs.writeFileSync(filePath, content);
console.log('Fixed ProductDetailModal.tsx');
