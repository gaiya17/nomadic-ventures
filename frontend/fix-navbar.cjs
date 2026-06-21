const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace standard active class logic
content = content.replace(
  /className=\{\(\{\s*isActive\s*\}\)\s*=>\s*\`([^`]+)\$\{\s*isActive\s*\?\s*\"([^\"]+)\"\s*:\s*\"([^\"]+)\"\s*\}\`\s*\}/g,
  "className={`$1${pathname === item.to ? \\\"$2\\\" : \\\"$3\\\"}`}"
);

// Specifically handle any remaining NavLinks
content = content.replace(/<NavLink/g, '<Link');
content = content.replace(/<\/NavLink>/g, '</Link>');

fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
console.log('Fixed Navbar');
