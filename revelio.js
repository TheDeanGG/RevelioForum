/* REVELIO — citations et spoilers */
(function () {
  if (window.__rvSp) { return; } window.__rvSp = 1;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(t, c, x) { var e = document.createElement(t); if (c) { e.className = c; } if (x) { e.textContent = x; } return e; }
  function prep(root) {
    var i, r = root || document, L = r.querySelectorAll('dl.codebox.spoiler:not([data-rv])');
    for (i = 0; i < L.length; i++) {
      var dl = L[i], dt = dl.querySelector('dt.spoiler_title'), dd = dl.querySelector('dd'); dl.setAttribute('data-rv', '1'); if (!dt) { continue; }
      var t = (dt.textContent || '').replace(/\s*:\s*$/, '').replace(/^\s+|\s+$/g, '');
      var c = dl.querySelector('.spoiler_content'), words = c ? (c.textContent || '').replace(/^\s+|\s+$/g, '').split(/\s+/).filter(Boolean).length : 0;
      dt.textContent = '';
      dt.appendChild(el('span', 'rv-d'));
      var box = el('span', 'rv-t'); box.appendChild(el('b', '', 'Spoiler'));
      if (t && t.toLowerCase() !== 'spoiler') { box.appendChild(el('em', '', t)); }
      dt.appendChild(box);
      if (words) { dt.appendChild(el('span', 'rv-n', words + (words > 1 ? ' mots' : ' mot'))); }
      var p = el('div', 'rv-p'); p.appendChild(el('i')); p.appendChild(el('i')); p.appendChild(el('i'));
      dl.insertBefore(p, dd);
      var cl = el('button', 'rv-cl'); cl.type = 'button'; cl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>Fermer le spoiler'; dd.appendChild(cl);
    }
    var Q = r.querySelectorAll('blockquote:not([data-rv])');
    for (i = 0; i < Q.length; i++) {
      var q = Q[i]; q.setAttribute('data-rv', '1');
      var inner = q.querySelector(':scope > div') || q, ci = q.querySelector(':scope > div > cite') || q.querySelector(':scope > cite');
      var who = ci ? (ci.textContent || '').replace(/\s*(a écrit|wrote)\s*:?\s*$/i, '').replace(/^\s+|\s+$/g, '') : '';
      q.insertBefore(el('i', 'rv-bar'), q.firstChild);
      q.insertBefore(el('span', 'rv-rb', 'Citation'), q.firstChild);
      q.insertBefore(el('span', 'rv-qg', '”'), q.firstChild);
      if (who) { var sg = el('div', 'rv-sig', who + ' '); sg.appendChild(el('span', '', 'a écrit')); inner.appendChild(sg); }
    }
  }
  function toggle(dl) {
    var b = dl.querySelector('.spoiler_content'); if (!b) { return; }
    var open = dl.className.indexOf('rv-open') > -1;
    var old = b.querySelector('.rv-rv'); if (old) { b.removeChild(old); }
    var inn = b.querySelector('.rv-in'); if (inn) { while (inn.firstChild) { b.insertBefore(inn.firstChild, inn); } b.removeChild(inn); }
    if (open) { dl.className = dl.className.replace(/\s*rv-open/, ''); b.style.setProperty('display', 'none', 'important'); return; }
    b.removeAttribute('hidden'); b.className = b.className.replace(/\s*\bhidden\b/g, '');
    b.style.setProperty('display', 'block', 'important'); b.style.setProperty('visibility', 'visible', 'important'); b.style.setProperty('height', 'auto', 'important'); b.style.setProperty('opacity', '1', 'important'); b.style.setProperty('content-visibility', 'visible', 'important');
    dl.className += ' rv-open';
    if (reduce) { return; }
    var d = el('div', 'rv-in');
    while (b.firstChild) { d.appendChild(b.firstChild); } b.appendChild(d);
    var r = el('div', 'rv-rv'); r.setAttribute('aria-hidden', 'true'); var sp = [];
    'Revelio'.split('').forEach(function (ch) { var s = el('span', '', ch); r.appendChild(s); sp.push(s); });
    b.appendChild(r);
    sp.forEach(function (s, k) { setTimeout(function () { s.className = 'on'; }, 60 + k * 110); });
    setTimeout(function () { d.className = 'rv-in rv-show'; r.className = 'rv-rv rv-off'; }, 1150);
    setTimeout(function () { d.className = 'rv-in rv-show'; d.style.opacity = '1'; d.style.transform = 'none'; if (r.parentNode) { r.parentNode.removeChild(r); } }, 2200);
  }
  document.addEventListener('click', function (e) {
    var cb = e.target.closest ? e.target.closest('dl.codebox.spoiler .rv-cl') : null;
    var t = cb || (e.target.closest ? e.target.closest('dl.codebox.spoiler dt.spoiler_title') : null); if (!t) { return; }
    e.stopPropagation(); e.stopImmediatePropagation(); e.preventDefault();
    var dlx = t.closest('dl.codebox.spoiler'); toggle(dlx);
    if (cb && dlx.getBoundingClientRect().top < 0) { dlx.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }, true);
  function go() { prep(document); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', go); } else { go(); }
  if (window.MutationObserver) { new MutationObserver(function () { prep(document); }).observe(document.documentElement, { childList: true, subtree: true }); }
})();
