const fs = require('fs');

let content = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf8');

// Replace the Lapallyra theme
content = content.replace(
  /pallyra: \{\s*bg: 'bg-black',\s*card: 'bg-neutral-900 border-\\[#d4af37\\]\\/20',\s*border: 'border-\\[#d4af37\\]',\s*text: 'text-white',\s*input: 'bg-black border-\\[#d4af37\\]\\/40 focus:border-\\[#d4af37\\] text-white',\s*button: 'bg-\\[#d4af37\\] text-black shadow-\\[0_10px_30px_rgba\\(212,175,55,0\\.2\\)\\]',\s*accent: 'text-\\[#d4af37\\]',\s*divider: 'border-\\[#d4af37\\]\\/20',\s*textSecondary: 'text-gray-400'\s*\}/g,
  `pallyra: {
      bg: 'bg-[#F8F8F6]',
      card: 'bg-[#F8F8F6] border-[#161616]/10 shadow-lg',
      border: 'border-[#161616]/20',
      text: 'text-[#161616]',
      input: 'bg-white border-[#161616]/20 focus:border-[#C6A664] text-[#161616] placeholder-[#161616]/40',
      button: 'bg-[#161616] text-[#C6A664] shadow-md hover:bg-[#C6A664] hover:text-[#161616]',
      accent: 'text-[#C6A664]',
      divider: 'border-[#161616]/10',
      textSecondary: 'text-[#161616]/60'
    }`
);

// Replace hardcoded inputs
content = content.replace(/\$\{companyId === 'mimada' \? 'text-pink-700 font-bold' : 'text-white'\}/g, '');

// Replace line 691 text-white
content = content.replace(/\$\{companyId === 'mimada' \? 'text-gray-900 border-gray-200' : 'text-white'\}/g, '');

// Replace line 722 checkbox text-white
content = content.replace(/className="text-white" size=\{12\}/g, '');

// Write back
fs.writeFileSync('src/components/CheckoutModal.tsx', content);

// Also do it for CartSidebar
let cartContent = fs.readFileSync('src/components/CartSidebar.tsx', 'utf8');

cartContent = cartContent.replace(/text-white\\/40/g, '${theme.textMuted}');
cartContent = cartContent.replace(/bg-white\\\/5/g, 'bg-transparent');

fs.writeFileSync('src/components/CartSidebar.tsx', cartContent);

console.log("Fixed files");
