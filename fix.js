const fs = require('fs');
const fileIn = 'c:/Users/girid/OneDrive/Desktop/watchly/app/(admin)/admin/page.tsx.bak';
const fileOut = 'c:/Users/girid/OneDrive/Desktop/watchly/app/(admin)/admin/page.tsx';

let content = fs.readFileSync(fileIn, 'utf8');

// Strip line numbers
content = content.split('\n').map(line => {
    return line.replace(/^\d+:\s?/, '');
}).join('\n');

// Add suppressHydrationWarning
content = content.replace(/<(button|input|select|textarea|form)\b/g, '<$1 suppressHydrationWarning');

fs.writeFileSync(fileOut, content);
console.log('Restored and updated');
