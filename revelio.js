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
      if (!ci) { encadre(q); continue; }
      q.insertBefore(el('i', 'rv-bar'), q.firstChild);
      q.insertBefore(el('span', 'rv-rb', 'Citation'), q.firstChild);
      q.insertBefore(el('span', 'rv-qg', '”'), q.firstChild);
      if (who) { var sg = el('div', 'rv-sig', who + ' '); sg.appendChild(el('span', '', 'a écrit')); inner.appendChild(sg); }
    }
  }
  var CO = {
    info: ['Info', '#7fa8d8', 'rgba(80,120,190,.12)', 'rgba(127,168,216,.35)', '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'],
    astuce: ['Astuce', '#8cc7a0', 'rgba(80,160,110,.12)', 'rgba(140,199,160,.35)', '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'],
    attention: ['Attention', '#e3b95f', 'rgba(217,179,106,.12)', 'rgba(227,185,95,.4)', '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>'],
    interdit: ['Interdit', '#e08a8a', 'rgba(190,70,70,.13)', 'rgba(224,138,138,.38)', '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>'],
    magie: ['Magie', '#b79be0', 'rgba(130,95,200,.13)', 'rgba(183,155,224,.38)', '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7z"/>'],
    note: ['Note', '#d9b36a', 'rgba(255,255,255,.04)', 'rgba(217,179,106,.3)', '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>']
  };
  function encadre(q) {
    var key = 'note', w = document.createTreeWalker(q, 4, null, false), n, m;
    while ((n = w.nextNode())) {
      if (!/\S/.test(n.nodeValue)) { continue; }
      m = /^\s*(info|astuce|attention|interdit|magie|note)\s*:\s*/i.exec(n.nodeValue);
      if (m) { key = m[1].toLowerCase(); n.nodeValue = n.nodeValue.slice(m[0].length); }
      break;
    }
    var d = CO[key];
    q.className += ' rv-co';
    q.setAttribute('data-co', key);
    q.style.setProperty('--c', d[1]); q.style.setProperty('--bg', d[2]); q.style.setProperty('--bd', d[3]);
    var ic = document.createElement('span'); ic.className = 'rv-ci';
    ic.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + d[4] + '</svg>';
    q.insertBefore(ic, q.firstChild);
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

/* Comptes liés (Switcheroo) : page d'accueil uniquement */
(function () {
  try {
    if (!/^\/(forum|index)?\/?$/.test(location.pathname) || document.getElementById('switcheroo')) { return; }
    var BASE = 'https://cdn.jsdelivr.net/gh/caezd/switcheroo@master/';
    function load(src, cb) { var s = document.createElement('script'); s.src = src; s.onload = cb; document.body.appendChild(s); }
    function boot() {
      var nav = document.createElement('nav');
      nav.id = 'switcheroo'; nav.className = 'switcheroo';
      nav.setAttribute('direction', 'vertical'); nav.setAttribute('position', 'top');
      var hero = document.querySelector('.rv-hero'); if (!hero) { return; }
      hero.appendChild(nav);
      load(BASE + 'monomer.js', function () {
        load(BASE + 'switcheroo.js', function () {
          try { new Switcheroo('#switcheroo', { enableReorder: true, updateAvatar: true, confirm: true, deleteIcon: '×', addIcon: '+' }); } catch (e) { }
        });
      });
    }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
  } catch (e) { }
})();
