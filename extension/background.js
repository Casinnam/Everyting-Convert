// EverythingConvert launcher — thin extension that opens the site's tools.
// All conversion happens on the site (keeps ads/Pro revenue + reuses everything).
const BASE = 'https://www.everythingconvert.com/';

// Build a site URL from a relative path, tagging it so the traffic shows up as
// "extension" in analytics. `extra` adds query params (e.g. the clicked image).
function toolUrl(path, medium, extra) {
  const url = new URL(path, BASE);
  url.searchParams.set('utm_source', 'extension');
  url.searchParams.set('utm_medium', medium);
  if (extra) {
    Object.keys(extra).forEach((k) => url.searchParams.set(k, extra[k]));
  }
  return url.href;
}

// Pick the best tool for a clicked link based on its file extension.
function toolForLink(link) {
  const lower = (link || '').toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf tools/pdf-tools.html';
  if (/\.(jpe?g|png|webp|gif|heic|bmp)(\?|#|$)/.test(lower)) return 'image converter/image-converter.html';
  return 'index.html';
}

chrome.runtime.onInstalled.addListener(() => {
  // removeAll first so re-installs/updates don't throw "duplicate id".
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'ec-image',
      title: 'Convert this image with EverythingConvert',
      contexts: ['image'],
    });
    chrome.contextMenus.create({
      id: 'ec-link',
      title: 'Convert this file with EverythingConvert',
      contexts: ['link'],
    });
    chrome.contextMenus.create({
      id: 'ec-open',
      title: 'Open EverythingConvert',
      contexts: ['page', 'selection'],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  let url;
  if (info.menuItemId === 'ec-image') {
    url = toolUrl('image converter/image-converter.html', 'context-image',
      info.srcUrl ? { src: info.srcUrl } : null);
  } else if (info.menuItemId === 'ec-link') {
    url = toolUrl(toolForLink(info.linkUrl), 'context-link',
      info.linkUrl ? { src: info.linkUrl } : null);
  } else {
    url = toolUrl('index.html', 'context-open');
  }
  chrome.tabs.create({ url });
});
