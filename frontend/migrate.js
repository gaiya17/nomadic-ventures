import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add "use client" for tsx
  if (filePath.endsWith('.tsx') && !content.includes('"use client"') && !content.includes("'use client'")) {
    content = '"use client";\n' + content;
    changed = true;
  }

  // Handle Path aliases
  const oldContent = content;
  content = content.replace(/from\s+["'](\.\.\/)+components([^"']*)["']/g, 'from "@/components$2"');
  content = content.replace(/from\s+["'](\.\.\/)+data([^"']*)["']/g, 'from "@/data$2"');
  content = content.replace(/from\s+["'](\.\.\/)+imports([^"']*)["']/g, 'from "@/imports$2"');
  content = content.replace(/from\s+["']\.\/components([^"']*)["']/g, 'from "@/components$1"');
  if (oldContent !== content) changed = true;

  // React Router to Next.js
  if (content.includes('react-router')) {
    changed = true;
    
    // Replace imports
    if (content.includes('useNavigate') || content.includes('useLocation') || content.includes('useParams') || content.includes('useSearchParams')) {
      content = content.replace(/import\s+{([^}]*)}\s+from\s+["']react-router["'];?/, (match, p1) => {
        let newImports = [];
        let hooks = [];
        if (p1.includes('Link') || p1.includes('NavLink')) {
          newImports.push(`import Link from "next/link";`);
        }
        if (p1.includes('useNavigate')) hooks.push('useRouter');
        if (p1.includes('useLocation')) hooks.push('usePathname');
        if (p1.includes('useParams')) hooks.push('useParams');
        if (p1.includes('useSearchParams')) hooks.push('useSearchParams');
        
        if (hooks.length > 0) {
          newImports.push(`import { ${hooks.join(', ')} } from "next/navigation";`);
        }
        return newImports.join('\n');
      });
    } else if (content.includes('Link')) {
      content = content.replace(/import\s+{([^}]*Link[^}]*)}\s+from\s+["']react-router["'];?/, 'import Link from "next/link";');
    } else {
      content = content.replace(/import\s+.*\s+from\s+["']react-router["'];?\n?/g, '');
    }

    // Replace usages
    content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, 'const router = useRouter();\n  const navigate = (path) => router.push(path);');
    content = content.replace(/const\s+{\s*pathname\s*}\s*=\s*useLocation\(\);?/g, 'const pathname = usePathname();');
    content = content.replace(/const\s+location\s*=\s*useLocation\(\);?/g, 'const pathname = usePathname();\n  const location = { pathname };');
    content = content.replace(/<NavLink/g, '<Link');
    content = content.replace(/<\/NavLink>/g, '</Link>');
    content = content.replace(/to={/g, 'href={');
    content = content.replace(/to="/g, 'href="');
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filePath);
  }
});
