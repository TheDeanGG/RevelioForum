/* REVELIO — spoilers (œil + animation « Revelio ») et citations */
(function () {
  if (window.__rvSp) { return; } window.__rvSp = 1;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function prep(root) {
    var i, L = (root || document).querySelectorAll('dl.codebox.spoiler:not([data-rv])');
    for (i = 0; i < L.length; i++) {
      var dl = L[i], dt = dl.querySelector('dt.spoiler_title'); dl.setAttribute('data-rv', '1'); if (!dt) { continue; }
      var t = (dt.textContent || '').replace(/\s*:\s*$/, '').replace(/^\s+|\s+$/g, '');
      dt.textContent = '';
      var e = document.createElement('span'); e.className = 'rv-eye'; dt.appendChild(e);
      dt.appendChild(document.createTextNode('Spoiler'));
      if (t && t.toLowerCase() !== 'spoiler') { var m = document.createElement('span'); m.className = 'rv-ttl'; m.textContent = t; dt.appendChild(m); }
      var c = document.createElement('span'); c.className = 'rv-chv'; dt.appendChild(c);
    }
    var Q = (root || document).querySelectorAll('blockquote cite:not([data-rv])');
    for (i = 0; i < Q.length; i++) { Q[i].setAttribute('data-rv', '1'); Q[i].textContent = Q[i].textContent.replace(/\s*:\s*$/, ' :'); }
  }
  function toggle(dl) {
    var b = dl.querySelector('.spoiler_content'); if (!b) { return; }
    var open = dl.className.indexOf('rv-open') > -1;
    function vis(on) { if (on) { b.className = b.className.replace(/\s*\bhidden\b/g, ''); b.style.setProperty('display', 'block', 'important'); b.style.setProperty('visibility', 'visible', 'important'); b.style.setProperty('height', 'auto', 'important'); b.style.setProperty('opacity', '1', 'important'); } else { b.style.setProperty('display', 'none', 'important'); } }
    var old = b.querySelector('.rv-rv'); if (old) { b.removeChild(old); }
    var inn = b.querySelector('.rv-in'); if (inn) { while (inn.firstChild) { b.insertBefore(inn.firstChild, inn); } b.removeChild(inn); }
    if (open) { dl.className = dl.className.replace(/\s*rv-open/, ''); vis(false); return; }
    vis(true);
    dl.className += ' rv-open';
    if (reduce) { return; }
    var d = document.createElement('div'); d.className = 'rv-in';
    while (b.firstChild) { d.appendChild(b.firstChild); } b.appendChild(d);
    var r = document.createElement('div'); r.className = 'rv-rv'; r.setAttribute('aria-hidden', 'true');
    'Revelio'.split('').forEach(function (ch, k) { var s = document.createElement('span'); s.style.setProperty('--i', k); s.textContent = ch; r.appendChild(s); });
    b.appendChild(r);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('dl.codebox.spoiler dt.spoiler_title') : null; if (!t) { return; }
    e.stopPropagation(); e.stopImmediatePropagation(); e.preventDefault();
    toggle(t.parentNode);
  }, true);
  function go() { prep(document); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', go); } else { go(); }
  if (window.MutationObserver) { new MutationObserver(function () { prep(document); }).observe(document.documentElement, { childList: true, subtree: true }); }
})();
