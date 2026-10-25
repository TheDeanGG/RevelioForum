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

/* Connexion rapide : retire les « : » de « Connexion automatique: » */
(function () {
  function fix() {
    var L = document.querySelectorAll('form[name="form_login"] label'), i, n;
    for (i = 0; i < L.length; i++) {
      for (n = L[i].firstChild; n; n = n.nextSibling) {
        if (n.nodeType === 3 && /:\s*$/.test(n.nodeValue)) { n.nodeValue = n.nodeValue.replace(/\s*:\s*$/, ''); }
      }
    }
  }
  try { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fix); } else { fix(); } } catch (e) { }
})();

/* Page de connexion : serment, carte du Maraudeur */
(function () {
  function el(t, c, h) { var e = document.createElement(t); if (c) { e.className = c; } if (h) { e.innerHTML = h; } return e; }
  function run() {
    var lg = document.querySelector('#main-content .login-tabbed');
    if (!lg || lg.getAttribute('data-rv')) { return; }
    lg.setAttribute('data-rv', '1');
    var host = lg.parentNode;
    /* en-tête */
    var head = el('div', 'rv-lg-head');
    head.appendChild(el('img', 'rv-lg-crest'));
    head.firstChild.src = 'https://i.imgur.com/dw1TqNU.png'; head.firstChild.alt = 'Écusson de Poudlard';
    head.appendChild(el('div', 'rv-lg-kick', 'Poudlard · Entrée des sorciers'));
    head.appendChild(el('div', 'rv-lg-oath', 'Je jure solennellement que mes <em>intentions sont mauvaises</em>'));
    head.appendChild(el('p', 'rv-lg-sub', 'Prononce le serment, la carte s’ouvrira.'));
    host.insertBefore(head, lg);
    /* carte connexion */
    var h3 = lg.querySelector('.h3');
    if (h3) { h3.parentNode.insertBefore(el('p', 'rv-lg-card-sub', 'Retrouve ton personnage, tes hiboux et tes prophéties.'), h3.nextSibling); }
    var fp = el('span', 'rv-lg-fp', '<svg viewBox="0 0 120 40" aria-hidden="true"><g fill="currentColor"><ellipse cx="14" cy="26" rx="5" ry="8" transform="rotate(-12 14 26)"/><ellipse cx="9" cy="12" rx="1.6" ry="2"/><ellipse cx="14" cy="10" rx="1.6" ry="2"/><ellipse cx="19" cy="11" rx="1.6" ry="2"/><ellipse cx="23" cy="14" rx="1.5" ry="1.9"/><ellipse cx="52" cy="14" rx="5" ry="8" transform="rotate(10 52 14)"/><ellipse cx="46" cy="29" rx="1.6" ry="2"/><ellipse cx="51" cy="31" rx="1.6" ry="2"/><ellipse cx="56" cy="30" rx="1.6" ry="2"/><ellipse cx="60" cy="27" rx="1.5" ry="1.9"/><ellipse cx="94" cy="26" rx="5" ry="8" transform="rotate(-12 94 26)"/><ellipse cx="89" cy="12" rx="1.6" ry="2"/><ellipse cx="94" cy="10" rx="1.6" ry="2"/><ellipse cx="99" cy="11" rx="1.6" ry="2"/><ellipse cx="103" cy="14" rx="1.5" ry="1.9"/></g></svg>');
    lg.querySelector('.content').appendChild(fp);
    var f = lg.querySelector('#panel-password');
    if (f) {
      var go = f.querySelector('input[type="submit"]'); if (go) { go.value = 'Ouvrir la carte'; }
      var lk = f.querySelector('a[href*="sendpassword"]');
      var ck = f.querySelector('#autologin'), ckdl = ck ? ck.closest('dl') : null;
      if (lk && ckdl) { lk.textContent = 'Mot de passe oublié ?'; lk.className = (lk.className + ' rv-lg-lk').replace(/^\s+/, ''); var dd = el('dd', 'rv-lg-lkdd'); dd.appendChild(lk); ckdl.appendChild(dd); ckdl.className += ' rv-lg-row'; }
    }
    /* force la largeur : neutralise marges/paddings/largeurs des conteneurs entre les champs et la carte */
    if (f) {
      var fix = function (n) {
        var st = [['width', '100%'], ['max-width', 'none'], ['min-width', '0'], ['margin-left', '0'], ['margin-right', '0'], ['padding-left', '0'], ['padding-right', '0'], ['float', 'none'], ['box-sizing', 'border-box']];
        for (var i = 0; i < st.length; i++) n.style.setProperty(st[i][0], st[i][1], 'important');
      };
      var ins = f.querySelectorAll('input.inputbox, .password-container');
      for (var k = 0; k < ins.length; k++) { var n = ins[k]; while (n && n !== lg.querySelector('.content')) { if (n.tagName !== 'LABEL') fix(n); n = n.parentNode; } }
      var lb = lg.querySelector('.login-body'); if (lb) { lb.style.setProperty('text-align', 'center', 'important'); }
      var sb = f.querySelector('input[type="submit"]');
      if (sb) { sb.style.setProperty('display', 'block', 'important'); sb.style.setProperty('margin', '0 auto', 'important'); sb.style.setProperty('float', 'none', 'important'); var p = sb.parentNode; if (p) { p.style.setProperty('text-align', 'center', 'important'); p.style.setProperty('display', 'block', 'important'); } }
    }
    /* onglets : affichage explicite du bon formulaire */
    var tabs = lg.querySelectorAll('.login-tab'), pw = lg.querySelector('#panel-password'), mg = lg.querySelector('#panel-magic');
    if (tabs.length > 1 && pw && mg) {
      var show = function (i) {
        pw.style.setProperty('display', i === 0 ? 'block' : 'none', 'important');
        mg.style.setProperty('display', i === 1 ? 'block' : 'none', 'important');
      };
      show(0);
      for (var t = 0; t < tabs.length; t++) (function (i) { tabs[i].addEventListener('click', function () { show(i); }); })(t);
    }
    /* carte inscription */
    var reg = lg.nextElementSibling;
    if (reg && /panel/.test(reg.className)) {
      var link = reg.querySelector('a[href*="register"]'), href = link ? link.getAttribute('href') : '/register';
      reg.className += ' rv-lg-reg';
      var c = reg.querySelector('.content');
      if (c) {
        c.innerHTML = '';
        var c1 = el('div', 'rv-lg-c1'); c1.appendChild(el('div', 'rv-lg-eye', 'Pas encore de compte ?')); c1.appendChild(el('div', 'rv-lg-big', 'Revelio')); c.appendChild(c1);
        var c2 = el('div', 'rv-lg-c2'); c2.appendChild(el('div', 'rv-lg-names', 'Messieurs Lunard, Queudver, Patmol et Cornedrue')); c2.appendChild(el('div', 'rv-lg-pres', 'fournisseurs d’accessoires pour sorciers facétieux, sont fiers de vous présenter')); c.appendChild(c2);
        var a = el('a', 'rv-lg-join', 'Rejoindre Poudlard'); a.href = href; c.appendChild(a);
      }
    }
  }
  try { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } } catch (e) { }
})();
