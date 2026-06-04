const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const oldPalette = [
  '#fbf6e7',
  '#fffdf6',
  '#fff3cf',
  '#2f2612',
  '#8b5e05',
  '#9a6a05',
  '#211a0b',
  '#6a5726',
  '#e3d3a3',
  '#fbf3dc',
  '#f3e3b6',
];

const skipDirs = new Set(['.git', 'node_modules', '.agents', '.codex', 'tests']);
const targetExtensions = new Set(['.html', '.css', '.js']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walk(path.join(dir, entry.name), files);
      }
    } else if (targetExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

const offenders = [];

for (const file of walk(root)) {
  const content = fs.readFileSync(file, 'latin1').toLowerCase();
  const matches = oldPalette.filter((color) => content.includes(color));
  if (matches.length) {
    offenders.push(`${path.relative(root, file)}: ${matches.join(', ')}`);
  }
}

assert.deepStrictEqual(offenders, [], `Legacy yellow/brown palette should be removed:\n${offenders.join('\n')}`);

console.log('legacy yellow palette test passed');
