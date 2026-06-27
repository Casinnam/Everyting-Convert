// ec-modal.js
// Site-styled replacements for the browser's native confirm()/alert()/prompt(),
// matching the dark overlay used by the daily-limit modal. All three return a
// Promise, so callers must `await` them. Exposed as window.EverythingConvertUI.
//
// Pages that don't load this file keep working: the small helpers in the shared
// scripts (auth.js, ai-credits.js, usage-limit.js) fall back to the native dialog
// when window.EverythingConvertUI is absent.
(function () {
  'use strict';
  if (window.EverythingConvertUI && window.EverythingConvertUI.__ec) return;

  function currentLanguage() {
    try {
      var fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (fromUrl) return fromUrl;
      var saved = localStorage.getItem('everything_convert_language');
      if (saved) return saved;
    } catch (e) { /* ignore */ }
    return (document.documentElement.lang || 'en').slice(0, 2);
  }

  var LABELS = {
    en: { ok: 'OK', yes: 'Confirm', cancel: 'Cancel' },
    ko: { ok: '확인', yes: '확인', cancel: '취소' },
    de: { ok: 'OK', yes: 'Bestätigen', cancel: 'Abbrechen' },
    es: { ok: 'Aceptar', yes: 'Confirmar', cancel: 'Cancelar' },
    fr: { ok: 'OK', yes: 'Confirmer', cancel: 'Annuler' }
  };
  function L() { return LABELS[currentLanguage()] || LABELS.en; }

  function ensureStyles() {
    if (document.getElementById('ec-modal-styles')) return;
    var style = document.createElement('style');
    style.id = 'ec-modal-styles';
    style.textContent = [
      '.ec-modal-backdrop{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:1.25rem;background:rgba(2,6,23,.62);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:ecmodalfade .15s ease}',
      '.ec-modal{position:relative;width:min(440px,100%);border:1px solid rgba(148,163,184,.22);border-radius:16px;padding:1.6rem;background:#0f172a;color:#f8fafc;box-shadow:0 24px 80px rgba(0,0,0,.45);font-family:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;animation:ecmodalpop .18s cubic-bezier(.16,1,.3,1)}',
      '.ec-modal-title{margin:0 0 .5rem;font-size:1.12rem;font-weight:800;line-height:1.3}',
      '.ec-modal-msg{margin:0;color:#cbd5e1;line-height:1.6;font-size:.96rem;white-space:pre-wrap;word-break:break-word}',
      '.ec-modal-input{margin-top:.9rem;width:100%;padding:.7rem .8rem;border-radius:9px;border:1px solid rgba(148,163,184,.35);background:#0b1220;color:#f8fafc;font:inherit;box-sizing:border-box}',
      '.ec-modal-input:focus{outline:none;border-color:#2563eb}',
      '.ec-modal-actions{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:flex-end;margin-top:1.4rem}',
      '.ec-modal-btn{min-height:2.6rem;padding:.6rem 1.2rem;border-radius:9px;font-weight:800;font-size:.92rem;cursor:pointer;border:1px solid transparent;font-family:inherit}',
      '.ec-modal-ok{background:#2563eb;color:#fff}',
      '.ec-modal-ok:hover{background:#1d4ed8}',
      '.ec-modal-ok.ec-danger{background:#dc2626}',
      '.ec-modal-ok.ec-danger:hover{background:#b91c1c}',
      '.ec-modal-cancel{background:transparent;color:#e2e8f0;border-color:rgba(148,163,184,.35)}',
      '.ec-modal-cancel:hover{background:rgba(148,163,184,.12)}',
      '@keyframes ecmodalfade{from{opacity:0}to{opacity:1}}',
      '@keyframes ecmodalpop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}'
    ].join('');
    document.head.appendChild(style);
  }

  // Core renderer. kind: 'alert' | 'confirm' | 'prompt'.
  function show(kind, message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      // Defensive fallback if the DOM isn't usable.
      if (typeof document === 'undefined' || !document.body) {
        if (kind === 'confirm') return resolve(window.confirm(message));
        if (kind === 'prompt') return resolve(window.prompt(message, opts.defaultValue || ''));
        window.alert(message); return resolve();
      }
      ensureStyles();
      var lab = L();
      var existing = document.querySelector('.ec-modal-backdrop');
      if (existing) existing.remove();

      var backdrop = document.createElement('div');
      backdrop.className = 'ec-modal-backdrop';
      var modal = document.createElement('div');
      modal.className = 'ec-modal';
      modal.setAttribute('role', kind === 'alert' ? 'alertdialog' : 'dialog');
      modal.setAttribute('aria-modal', 'true');

      if (opts.title) {
        var h = document.createElement('div');
        h.className = 'ec-modal-title';
        h.textContent = opts.title;
        modal.appendChild(h);
      }
      var p = document.createElement('div');
      p.className = 'ec-modal-msg';
      p.textContent = message == null ? '' : String(message);
      modal.appendChild(p);

      var input = null;
      if (kind === 'prompt') {
        input = document.createElement('input');
        input.className = 'ec-modal-input';
        input.type = 'text';
        input.value = opts.defaultValue == null ? '' : String(opts.defaultValue);
        modal.appendChild(input);
      }

      var actions = document.createElement('div');
      actions.className = 'ec-modal-actions';

      var prevFocus = document.activeElement;
      var done = false;
      function close(result) {
        if (done) return;
        done = true;
        document.removeEventListener('keydown', onKey, true);
        backdrop.remove();
        try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch (e) {}
        resolve(result);
      }

      if (kind !== 'alert') {
        var cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'ec-modal-btn ec-modal-cancel';
        cancelBtn.textContent = opts.cancelText || lab.cancel;
        cancelBtn.addEventListener('click', function () { close(kind === 'prompt' ? null : false); });
        actions.appendChild(cancelBtn);
      }
      var okBtn = document.createElement('button');
      okBtn.type = 'button';
      okBtn.className = 'ec-modal-btn ec-modal-ok' + (opts.tone === 'danger' ? ' ec-danger' : '');
      okBtn.textContent = opts.okText || (kind === 'confirm' ? lab.yes : lab.ok);
      okBtn.addEventListener('click', function () {
        if (kind === 'prompt') return close(input ? input.value : '');
        if (kind === 'confirm') return close(true);
        close();
      });
      actions.appendChild(okBtn);
      modal.appendChild(actions);
      backdrop.appendChild(modal);

      // Click outside cancels (alert: closes).
      backdrop.addEventListener('mousedown', function (e) {
        if (e.target === backdrop) { close(kind === 'confirm' ? false : kind === 'prompt' ? null : undefined); }
      });
      function onKey(e) {
        if (e.key === 'Escape') { e.preventDefault(); close(kind === 'confirm' ? false : kind === 'prompt' ? null : undefined); }
        else if (e.key === 'Enter') {
          // In prompt, Enter inside the input submits; otherwise Enter = OK.
          e.preventDefault();
          if (kind === 'prompt') return close(input ? input.value : '');
          if (kind === 'confirm') return close(true);
          close();
        }
      }
      document.addEventListener('keydown', onKey, true);

      document.body.appendChild(backdrop);
      (input || okBtn).focus();
      if (input) input.select();
    });
  }

  window.EverythingConvertUI = {
    __ec: true,
    confirm: function (message, opts) { return show('confirm', message, opts); },
    alert: function (message, opts) { return show('alert', message, opts); },
    prompt: function (message, defaultValue, opts) {
      opts = opts || {}; opts.defaultValue = defaultValue;
      return show('prompt', message, opts);
    }
  };
})();
