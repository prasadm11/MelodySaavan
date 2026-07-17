const fs = require('fs');
const path = require('path');

const filesToCopy = ['index.html', 'index.css', 'app.js', 'favicon.svg'];
const distDir = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  console.log('Created dist/ directory');
}

// Copy each file to the dist folder
filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied ${file} -> dist/${file}`);
  } else {
    console.warn(`Warning: source file ${file} not found!`);
  }
});

console.log('\n==============================================');
console.log(' Build Completed! Production files are in: dist/');
console.log('==============================================');
