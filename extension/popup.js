const BASE = 'https://www.everythingconvert.com/';

// Popular tools surfaced in the launcher. `path` is relative to the site root.
const TOOLS = [
  { name: 'Image Converter', emoji: '🖼️', path: 'image converter/image-converter.html' },
  { name: 'PDF to Word', emoji: '📄', path: 'pdf to word/pdf-to-word.html' },
  { name: 'PDF to Excel', emoji: '📊', path: 'pdf to excel/pdf-to-excel.html' },
  { name: 'PDF to JPG', emoji: '🏞️', path: 'pdf to jpg/pdf-to-jpg.html' },
  { name: 'Merge PDF', emoji: '🔗', path: 'pdf tools/pdf-tools.html?mode=merge' },
  { name: 'Compress PDF', emoji: '🗜️', path: 'pdf tools/pdf-tools.html?mode=compress' },
  { name: 'Image to PDF', emoji: '📑', path: 'image to pdf/image-to-pdf.html' },
  { name: 'Excel to PDF', emoji: '📈', path: 'excel to pdf/excel-to-pdf.html' },
  { name: 'QR Code Generator', emoji: '🔳', path: 'qr code generator/qr-code-generator.html' },
  { name: 'Video Converter', emoji: '🎬', path: 'media converter/media-converter.html' },
];

function toolUrl(path) {
  const url = new URL(path, BASE);
  url.searchParams.set('utm_source', 'extension');
  url.searchParams.set('utm_medium', 'popup');
  return url.href;
}

function open(path) {
  chrome.tabs.create({ url: toolUrl(path) });
  window.close();
}

const listEl = document.getElementById('tools');
const emptyEl = document.getElementById('empty');

function render(filter) {
  const q = (filter || '').trim().toLowerCase();
  listEl.innerHTML = '';
  const matches = TOOLS.filter((t) => !q || t.name.toLowerCase().includes(q));
  emptyEl.hidden = matches.length > 0;
  matches.forEach((t) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = `<span class="tool-emoji">${t.emoji}</span><span>${t.name}</span>`;
    btn.addEventListener('click', () => open(t.path));
    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

document.getElementById('search').addEventListener('input', (e) => render(e.target.value));

// Enter on the search box opens the first match — fast keyboard flow.
document.getElementById('search').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const first = listEl.querySelector('button');
  if (first) first.click();
});

document.getElementById('allTools').addEventListener('click', (e) => {
  e.preventDefault();
  open('index.html');
});

render('');
