const fs = require('fs');

function wrapSuspense(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('import { Suspense }')) {
    content = content.replace('"use client";', '"use client";\nimport { Suspense } from "react";');
  }
  
  content = content.replace(/export default function\s*\(\)\s*\{/, 'function PageContent() {');
  
  content += '\n\nexport default function Page() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <PageContent />\n    </Suspense>\n  );\n}\n';
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Wrapped ' + filePath);
}

wrapSuspense('src/app/gallery/page.tsx');
wrapSuspense('src/app/journeys/page.tsx');
