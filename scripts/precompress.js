const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function walk(dir, exts, files=[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, exts, files);
    else if (exts.includes(path.extname(e.name))) files.push(full);
  }
  return files;
}

function compressFile(file) {
  const content = fs.readFileSync(file);
  try {
    const br = zlib.brotliCompressSync(content, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } });
    fs.writeFileSync(file + '.br', br);
  } catch (e) {
    console.error('brotli failed for', file, e.message);
  }
  try {
    const gz = zlib.gzipSync(content, { level: 9 });
    fs.writeFileSync(file + '.gz', gz);
  } catch (e) {
    console.error('gzip failed for', file, e.message);
  }
}

function main() {
  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) {
    console.error('No build directory found. Run build first.');
    process.exit(1);
  }
  const exts = ['.js', '.css', '.html', '.svg'];
  const files = walk(buildDir, exts);
  console.log('Files to compress:', files.length);
  for (const f of files) {
    console.log('Compressing', f);
    compressFile(f);
  }
  console.log('Precompression done.');
}

main();
