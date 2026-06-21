const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Find all image imports: import Name from '...png'
  const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['\"].*\.(png|jpe?g|gif|svg|webp)['\"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const varName = match[1];
    // Replace src={varName} with src={varName.src}
    const srcRegex = new RegExp('src=\\{' + varName + '\\}', 'g');
    if (srcRegex.test(content)) {
      content = content.replace(srcRegex, 'src={' + varName + '.src}');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed image usage in ' + filePath);
  }
});
