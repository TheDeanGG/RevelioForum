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
    head.firstChild.src = 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@01c027f16067ad6fdf2c6ad1a46335cf2d039134/img/ecussons/Poudlard-4-maisons.png'; head.firstChild.alt = 'Écusson de Poudlard';
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
      for (var k = 0; k < ins.length; k++) { var n = ins[k]; while (n && n !== lg.querySelector('.content')) { if (n.tagName !== 'LABEL') { fix(n); if (n.tagName === 'INPUT') { n.style.setProperty('padding-left', '16px', 'important'); n.style.setProperty('padding-right', '44px', 'important'); } } n = n.parentNode; } }
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
/* Mon compte : en-tête (fil d'Ariane, titre, accroche) au-dessus des onglets */
(function () {
  function run() {
    var tabs = document.getElementById('tabs');
    if (!tabs || document.querySelector('.rv-uh') || !tabs.querySelector('a[href*="page_profil="]')) { return; }
    var act = tabs.querySelector('li.activetab span'); if (!act) { return; }
    var name = act.textContent.replace(/^\s+|\s+$/g, '');
    var M = {
      'Informations': ['Mon profil', 'Ce que les autres sorciers lisent sur toi, à côté de chacun de tes hiboux.'],
      'Préférences': ['Mes préférences', 'Comment le forum se comporte avec toi : contacts, courrier, affichage.'],
      'Avatar': ['Mon avatar', 'La grande image qui accompagne chacun de tes hiboux.'],
      'Amis et ignorés': ['Mes amis', 'Les sorciers que tu fréquentes, et ceux que tu préfères ne plus entendre.'],
      'Membres suivis': ['Membres suivis', 'Les membres dont tu veux suivre chaque nouveau message.'],
      'Notifications': ['Mes notifications', 'Choisis comment le forum te prévient, et retrouve tes dernières alertes.'],
      'Sujets surveillés': ['Sujets surveillés', 'Les sujets dont tu veux être prévenu des nouvelles réponses.'],
      'Favoris': ['Mes favoris', 'Les sujets que tu gardes sous la main.']
    };
    if (name !== 'Informations') { document.documentElement.className += ' rv-nohero'; }
    var m = M[name] || [name, ''];
    var h = document.createElement('div'); h.className = 'rv-uh';
    h.innerHTML = '<nav class="rv-uh-crumb"><span>Revelio</span>›<span>Mon compte</span>›<b></b></nav><h1 class="rv-uh-h1"></h1>' + (m[1] ? '<p class="rv-uh-tag"></p>' : '');
    h.querySelector('b').textContent = name; h.querySelector('h1').textContent = m[0]; if (m[1]) { h.querySelector('p').textContent = m[1]; }
    tabs.parentNode.insertBefore(h, tabs);
  }
  try { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } } catch (e) { }
})();
/* Mon compte : liste des sujets surveillés / favoris */
(function () {
  var RV_CUT_DATE = true; /* true : retire la date et la suite du titre (« Titre | 19/09/1996 | … » devient « Titre ») ; false : titre complet */
  function run() {
    var cp = document.getElementById('cp-main'), tb = cp && cp.querySelector('table#memberlist, table.table1');
    if (!tb || cp.querySelector('.rv-wt')) { return; }
    var ths = tb.querySelectorAll('thead th'), ok = false;
    for (var i = 0; i < ths.length; i++) { if (/^\s*Sujets?\s*$/.test(ths[i].textContent)) { ok = true; } }
    if (!ok) { return; }
    var form = tb.closest('form'), h1 = cp.querySelector('h1.page-title'), panel = tb.closest('.panel');
    var rows = tb.querySelectorAll('tbody tr'), list = document.createElement('div'); list.className = 'rv-wt';
    list.innerHTML = '<div class="rv-wt-h"><span></span><span></span><span>Prophétie</span><span>Hiboux</span><span>Vues</span><span>Dernier hibou</span></div>';
    for (var r = 0; r < rows.length; r++) {
      var td = rows[r].children; if (td.length < 8) { continue; }
      var a = td[1].querySelector('a.topictitle'), fo = td[2].querySelector('a'), au = td[4].querySelector('a'), cb = td[7].querySelector('input');
      var lp = td[6], date = '', lu = lp.querySelector('strong a'), ln = lu ? lu.textContent.replace(/^\s+|\s+$/g, '') : '';
      for (var n = lp.firstChild; n; n = n.nextSibling) { if (n.nodeType === 3 && n.textContent.replace(/\s/g, '')) { date = n.textContent.replace(/^\s+|\s+$/g, ''); break; } }
      var col = '', sp = lu ? lu.querySelector('span') : null; if (sp && sp.style.color) { col = sp.style.color; }
      var row = document.createElement('div'); row.className = 'rv-wt-r';
      var c0 = document.createElement('label'); c0.className = 'rv-wt-ck'; if (cb) { c0.appendChild(cb); }
      var c1 = document.createElement('span'); c1.className = 'rv-wt-ic'; c1.innerHTML = '<i></i>';
      var c2 = document.createElement('div'); c2.className = 'rv-wt-t';
      var t = document.createElement('a'); t.className = 'rv-wt-tt'; t.href = a ? a.getAttribute('href') : '#'; var full = a ? a.textContent.replace(/^\s+|\s+$/g, '') : ''; t.textContent = RV_CUT_DATE ? full.replace(/\s*\|\s*(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}(er)?\s+[A-Za-zÀ-ÿ]+\.?\s+\d{4}).*$/, '') : full; t.title = full;
      var s = document.createElement('div'); s.className = 'rv-wt-s'; s.appendChild(document.createTextNode('dans '));
      if (fo) { var f2 = fo.cloneNode(true); f2.className = 'rv-wt-f'; s.appendChild(f2); }
      s.appendChild(document.createTextNode(' · par ')); if (au) { s.appendChild(au.cloneNode(true)); }
      c2.appendChild(t); c2.appendChild(s);
      var c3 = document.createElement('span'); c3.className = 'rv-wt-n'; c3.textContent = td[3].textContent.replace(/\s/g, '');
      var c4 = document.createElement('span'); c4.className = 'rv-wt-n'; c4.textContent = td[5].textContent.replace(/\s/g, '');
      var c5 = document.createElement('div'); c5.className = 'rv-wt-l';
      var dia = document.createElement('span'); dia.className = 'rv-wt-d'; if (col) { dia.style.setProperty('--c', col); } dia.innerHTML = '<b></b>'; dia.firstChild.textContent = ln.charAt(0).toUpperCase();
      var who = document.createElement('div'); if (lu) { who.appendChild(lu.cloneNode(true)); } var dt = document.createElement('div'); dt.className = 'rv-wt-dt'; dt.textContent = date; who.appendChild(dt);
      c5.appendChild(dia); c5.appendChild(who);
      row.appendChild(c0); row.appendChild(c1); row.appendChild(c2); row.appendChild(c3); row.appendChild(c4); row.appendChild(c5);
      list.appendChild(row);
    }
    var fav = /favouritesearch/.test(location.search + location.href), nrows = list.querySelectorAll('.rv-wt-r').length;
    if (!nrows) {
      var em = document.createElement('div'); em.className = 'rv-wt-e';
      var ec = tb.querySelector('tbody td'), et = ec ? ec.textContent.replace(/^\s+|\s+$/g, '') : '';
      em.innerHTML = '<span class="rv-wt-ei"><i>☆</i></span><div><div class="rv-wt-et"></div><div class="rv-wt-es"></div></div>';
      em.querySelector('.rv-wt-et').textContent = et || (fav ? 'Aucun favori' : 'Aucune prophétie surveillée');
      em.querySelector('.rv-wt-es').textContent = fav ? 'Ajoute une prophétie à tes favoris depuis sa page pour la retrouver ici.' : 'Surveille une prophétie depuis sa page pour être prévenu des nouvelles réponses.';
      list.appendChild(em);
    }
    /* barre d'outils */
    var bar = document.createElement('div'); bar.className = 'rv-wt-bar';
    if (!nrows) { var bar0 = true; }
    var b1 = document.createElement('a'); b1.href = 'javascript:select_switch_search(true);'; b1.className = 'rv-wt-gh'; b1.textContent = 'Tout sélectionner';
    var b2 = document.createElement('a'); b2.href = 'javascript:select_switch_search(false);'; b2.className = 'rv-wt-gh'; b2.textContent = 'Tout désélectionner';
    if (nrows) { bar.appendChild(b1); bar.appendChild(b2); }
    var sub = form ? form.querySelector('fieldset.submit-buttons') : null; if (sub) { sub.className += ' rv-wt-go'; bar.appendChild(sub); }
    var cap = document.createElement('div'); cap.className = 'rv-wt-cap';
    cap.textContent = h1 ? h1.textContent.replace(/sujets?/i, function (m) { return /s$/i.test(m) ? 'prophéties' : 'prophétie'; }).replace(/surveillés/i, 'surveillées').replace(/surveillé\b/i, 'surveillée') : '';
    if (bar.children.length) { panel.parentNode.insertBefore(bar, panel); }
     panel.parentNode.insertBefore(list, panel); panel.parentNode.insertBefore(cap, panel);
    panel.style.setProperty('display', 'none', 'important'); if (h1) { h1.style.setProperty('display', 'none', 'important'); }
    var gi = bar.querySelector('input[type="submit"]'); if (gi) { gi.value = fav ? 'Retirer la sélection des favoris' : gi.value.replace(/les sujets sélectionnés/i, 'la sélection'); }
  }
  try { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } } catch (e) { }
})();
/* Mon profil (Informations) : mise en page deux colonnes, sections en cartes, colonne d'avancement */
(function () {
  function el(t, c, h) { var e = document.createElement(t); if (c) { e.className = c; } if (h) { e.innerHTML = h; } return e; }
  function norm(t) { return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim(); }
  function run() {
    var root = document.querySelector('.rv-pe'), form = root && root.querySelector('form#ucp');
    if (!form || root.classList.contains('pi-on') || !root.querySelector('.rv-hero') || !form.querySelector('h1.page-title')) { return; }
    var act = document.querySelector('#tabs li.activetab'); if (act && act.previousElementSibling) { return; }
    var DESC = { 'Compte': 'Les champs marqués d’un * sont obligatoires.', 'Ton personnage': 'Ce qui s’affiche à côté de chacun de tes hiboux.', 'Allégeance': 'Où va ta loyauté ? Tu peux en choisir plusieurs.', 'Karma': 'Ta place entre ténèbres et lumière.', 'Contacts': 'Ces informations seront visibles publiquement.', 'Tes données': '' };
    var GROUPS = [
      ['Identité', ['titre', 'statut', 'annee scolaire', 'genre', 'date de naissance', 'lieu de naissance', 'habitation']],
      ['Image', ['portrait', 'faceclaim']],
      ['Histoire', ['resume', 'citation']],
      ['Serment inviolable', ['serment inviolable', 'serment • type', 'serment • depuis', 'serment • citation', 'serment • infos', 'serment • profil']],
      ['Hors RP', ['multicomptes', 'credits', 'discord', 'absence']]
    ];
    var REN = { 'serment inviolable': 'Avec qui', 'serment • type': 'Type', 'serment • depuis': 'Depuis', 'serment • citation': 'Citation', 'serment • infos': 'Infos', 'serment • profil': 'Profil', 'changer votre mot de passe': 'Mot de passe' };
    var S3 = { 'genre': 1, 'date de naissance': 1, 'lieu de naissance': 1, 'habitation / colocation': 1 };
    var S6 = { 'resume': 1, 'citation': 1 };
    var hs = form.querySelectorAll('h1.page-title'), secs = [];
    for (var i = 0; i < hs.length; i++) {
      var h1 = hs[i], panel = h1.nextElementSibling; if (!panel || !/panel/.test(panel.className)) { continue; }
      var title = h1.textContent.replace(/^\s+|\s+$/g, ''), fs = panel.querySelector('fieldset'); if (!fs) { continue; }
      var sec = el('section', 'pi-sec'); sec.id = 'rv-s' + i;
      var head = el('div', 'pi-sh', '<span class="dm"></span><h2></h2><p></p><span class="ct"></span>');
      head.querySelector('h2').textContent = title; head.querySelector('p').textContent = DESC[title] || '';
      var body = el('div', 'pi-sb'); body.appendChild(fs); sec.appendChild(head); sec.appendChild(body);
      h1.parentNode.insertBefore(sec, h1); h1.parentNode.removeChild(h1); panel.parentNode.removeChild(panel);
      var kind = title === 'Compte' ? 'c' : title === 'Ton personnage' ? 'p' : title === 'Allégeance' ? 'a' : title === 'Karma' ? 'k' : title === 'Contacts' ? 'n' : 'd';
      var dls = [].slice.call(fs.children).filter(function (x) { return x.tagName === 'DL'; });
      var byKey = [];
      for (var d = 0; d < dls.length; d++) {
        var dl = dls[d], dt = dl.querySelector('dt'), dd = dl.querySelector('dd'); if (!dt) { continue; }
        var raw = dt.textContent.replace(/ /g, ' '), req = /\*/.test(raw), nm = raw.replace(/\*/g, '').replace(/\s*:\s*/g, ' ').replace(/\s+/g, ' ').trim(), key = norm(nm);
        byKey.push([key, dl]);
        var shown = REN[key] || nm;
        if (kind === 'a' || kind === 'k') { dt.style.display = 'none'; dl.className += ' pi-f s6'; continue; }
        if (kind === 'd') { dl.className += ' pi-f s6 pi-data'; continue; }
        dt.innerHTML = ''; var lb = el('label', 'pi-lb'); lb.appendChild(document.createTextNode(shown.charAt(0).toUpperCase() + shown.slice(1))); if (req) { lb.appendChild(el('b', '', '*')); } dt.appendChild(lb);
        dl.className += ' pi-f ' + (S6[key] ? 's6' : key === 'portrait' ? 's4' : S3[key] ? 's3' : 's2');
        if (kind === 'c' && key === 'changer votre mot de passe' && dd) { var a = dd.querySelector('a'); var href = a ? a.getAttribute('href') : '#'; dd.innerHTML = ''; var pw = el('div', 'pi-pw', '<span>••••••••••</span>'); var pa = el('a', '', 'Modifier'); pa.href = href; pa.target = '_blank'; pw.appendChild(pa); dd.appendChild(pw); }
        if (key === 'date de naissance' && dd) { var se = dd.querySelectorAll('select'), ip = dd.querySelector('input'); var g = el('div', 'pi-date'); for (var s = 0; s < se.length; s++) { g.appendChild(se[s]); } if (ip) { g.appendChild(ip); } dd.insertBefore(g, dd.firstChild); var tn = []; for (var n = dd.firstChild; n; n = n.nextSibling) { if (n.nodeType === 3) { tn.push(n); } } for (var t = 0; t < tn.length; t++) { dd.removeChild(tn[t]); } }
        if (key === 'genre' && dd) { var ul = dd.querySelector('ul.profile_field_list'); if (ul) { ul.parentNode.removeChild(ul); } }
      }
      if (kind === 'p') {
        var used = {}, frag = [];
        for (var gI = 0; gI < GROUPS.length; gI++) {
          frag.push(el('div', 'pi-sub', GROUPS[gI][0]));
          for (var kI = 0; kI < GROUPS[gI][1].length; kI++) { for (var b = 0; b < byKey.length; b++) { if (!used[b] && byKey[b][0].indexOf(GROUPS[gI][1][kI]) === 0) { used[b] = 1; frag.push(byKey[b][1]); break; } } }
        }
        for (var b2 = 0; b2 < byKey.length; b2++) { if (!used[b2]) { frag.push(byKey[b2][1]); } }
        for (var f = 0; f < frag.length; f++) { fs.appendChild(frag[f]); }
      }
      secs.push({ el: sec, kind: kind, title: title, ct: head.querySelector('.ct') });
    }
    if (!secs.length) { return; }
    /* grille : colonne gauche + sections */
    var hero = root.querySelector('.rv-hero'); hero.style.marginLeft = '0'; hero.style.width = 'auto';
    var grid = el('div', 'pi-grid'), side = el('aside', 'pi-side'), main = el('div', 'pi-main');
    side.innerHTML = '<div class="pi-box"><h3 class="pi-bt">Ta fiche</h3><div class="pi-score"><b>0</b><span></span></div><div class="pi-prog"><i></i></div><ul class="pi-miss"></ul></div><div class="pi-box pi-navbox"><h3 class="pi-bt">Sections</h3><nav class="pi-nav"></nav></div><div class="pi-act"></div>';
    for (var m = 0; m < secs.length; m++) { main.appendChild(secs[m].el); }
    grid.appendChild(side); grid.appendChild(main);
    hero.parentNode.insertBefore(grid, hero.nextSibling);
    var sub = form.querySelector('fieldset.submit-buttons'); if (sub) { side.querySelector('.pi-act').appendChild(sub); }
    root.className += ' pi-on';
    /* calculs */
    var nav = side.querySelector('.pi-nav'), navA = [];
    for (var q = 0; q < secs.length; q++) { var na = el('a', '', ''); na.href = '#' + secs[q].el.id; na.appendChild(document.createTextNode(secs[q].title)); na.appendChild(el('em', '', '')); (function (a, s) { a.addEventListener('click', function (e) { e.preventDefault(); s.el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); })(na, secs[q]); nav.appendChild(na); navA.push(na); }
    function vis(x) { return x.offsetParent !== null; }
    function fields(sec) { return [].slice.call(sec.el.querySelectorAll('input[type=text],input[type=url],input[type=email],input[type=number],textarea,select')).filter(function (x) { return vis(x) && !/^rv-kdl$/.test(x.closest('dl').className); }); }
    function refresh() {
      var tot = 0, ok = 0, req = [], opt = [];
      for (var s = 0; s < secs.length; s++) {
        var sc = secs[s], c = sc.ct, a = navA[s], em = a.querySelector('em'), txt = '', cls = '';
        if (sc.kind === 'a') { var n = sc.el.querySelectorAll('input:checked').length; txt = n + (n > 1 ? ' choisies' : ' choisie'); cls = n ? 'ok' : ''; em.textContent = String(n); }
        else if (sc.kind === 'c' || sc.kind === 'p' || sc.kind === 'n') {
          var fl = fields(sc), o = 0;
          for (var f = 0; f < fl.length; f++) {
            var filled = (fl[f].value || '').replace(/\s/g, '') !== ''; if (filled) { o++; }
            var dl = fl[f].closest('dl'); fl[f].classList.toggle('miss', !filled && !!(dl && dl.querySelector('.pi-lb b')));
            if (!filled) { var lbl = dl && dl.querySelector('.pi-lb'); (dl && dl.querySelector('.pi-lb b') ? req : opt).push({ f: fl[f], t: lbl ? lbl.textContent.replace(/\*$/, '') : '' }); }
          }
          tot += fl.length; ok += o; txt = o + ' / ' + fl.length; cls = o === fl.length ? 'ok' : ''; em.textContent = o + '/' + fl.length;
        }
        if (c) { c.textContent = txt; c.className = 'ct ' + cls; c.style.display = txt ? '' : 'none'; }
        a.className = (cls === 'ok' ? 'ok ' : '') + (a.className.indexOf('on') > -1 ? 'on' : '');
      }
      var sb = side.querySelector('.pi-score'); sb.querySelector('b').textContent = String(ok); sb.querySelector('span').textContent = '/ ' + tot + ' champs remplis';
      side.querySelector('.pi-prog i').style.width = (tot ? Math.round(ok * 100 / tot) : 0) + '%';
      var ul = side.querySelector('.pi-miss'); ul.innerHTML = '';
      var list = req.slice(0, 4).map(function (x) { x.r = 1; return x; }).concat(opt.slice(0, 3));
      if (!req.length) { ul.appendChild(el('li', 'pi-done', 'Tous les champs obligatoires sont remplis.')); }
      list.forEach(function (x) { var li = el('li'), a = el('a', '', '<i></i>'); a.appendChild(document.createTextNode(x.t)); if (!x.r) { a.appendChild(el('em', '', 'facultatif')); } a.href = '#'; a.addEventListener('click', function (e) { e.preventDefault(); x.f.scrollIntoView({ behavior: 'smooth', block: 'center' }); try { x.f.focus({ preventScroll: true }); } catch (er) { } }); li.appendChild(a); ul.appendChild(li); });
    }
    var tm = null; function later() { clearTimeout(tm); tm = setTimeout(refresh, 60); }
    root.addEventListener('input', later); root.addEventListener('change', later); refresh();
    function spy() { var cur = 0; for (var s = 0; s < secs.length; s++) { if (secs[s].el.getBoundingClientRect().top < 160) { cur = s; } } for (var z = 0; z < navA.length; z++) { navA[z].classList.toggle('on', z === cur); } }
    window.addEventListener('scroll', spy, { passive: true }); spy();
  }
  try { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } } catch (e) { if (window.console) { console.log('rv-pi', e); } }
})();
/* Switcheroo : libellé du bouton de connexion s'il est vide */
(function () {
  function fix() {
    var b = document.querySelectorAll('.switcheroo__form-button');
    for (var i = 0; i < b.length; i++) {
      var x = b[i];
      if (x.tagName === 'INPUT') { if (!x.value) { x.value = 'Connexion'; } }
      else if (!(x.textContent || '').replace(/\s/g, '')) { x.textContent = 'Connexion'; }
    }
  }
  try { new MutationObserver(fix).observe(document.documentElement, { childList: true, subtree: true }); fix(); } catch (e) { }
})();

/* ===== REVELIO : page de la catégorie Poudlard (lieux + maisons) ===== */
(function () {
	function run() {
		if (!/^\/c\d+/.test(location.pathname)) { return; }
		var main = document.getElementById('main-content');
		var card = main && main.querySelector('.forabg');
		var rvx = main && main.querySelector('.rvx');
		if (!card || !rvx) { return; }
		var title = card.querySelector('.table-title');
		function norm(s) { s = (s || '').toLowerCase(); if (s.normalize) { s = s.normalize('NFD').replace(/[̀-ͯ]/g, ''); } return s.replace(/[’']/g, "'").replace(/\s+/g, ' ').trim(); }
		if (!title || norm(title.textContent).indexOf('poudlard') < 0) { return; }
		var base = 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@main/';
		var sc = document.querySelector('script[src*="revelio.js"]');
		if (sc) { base = sc.getAttribute('src').replace(/revelio\.js.*$/, ''); }
		var IMG = {
			'le grand hall': 'img/lieux/grand-hall.jpg', 'les salles de cours': 'img/lieux/salles-de-cours.jpg',
			'la bibliotheque': 'img/lieux/bibliotheque.jpg', 'la foret interdite': 'img/lieux/foret-interdite.jpg', 'le lac noir': 'img/lieux/lac-noir.jpg', 'exterieur de poudlard': 'img/lieux/foret-interdite.jpg',
			'le terrain de quidditch': 'img/lieux/terrain-quidditch.jpg', 'couloir et passage secrets': 'img/lieux/couloirs.jpg',
			"l'infirmerie": 'img/lieux/infirmerie.jpg', 'le bureau du directeur': 'img/lieux/bureau-directeur.jpg',
			'salle commune de gryffondor': 'img/lieux/salle-commune-gryffondor.jpg', 'dortoirs de gryffondor': 'img/lieux/dortoirs-gryffondor.jpg',
			'salle commune de serpentard': 'img/lieux/salle-commune-serpentard.jpg', 'dortoirs de serpentard': 'img/lieux/dortoirs-serpentard.jpg'
		};
		var DESC = {
			'le grand hall': 'Le cœur du château : arrivées, rencontres au détour de l’escalier, annonces du directeur.',
			'les salles de cours': 'Cours, travaux pratiques et retenues, de la métamorphose aux potions.',
			'la bibliotheque': 'Recherches, section interdite et nuits de révision.',
			'la foret interdite': 'Créatures, secrets et dangers : on n’y entre pas sans raison.',
			'le lac noir': 'Sirènes, calamar géant et rives silencieuses.',
			'exterieur de poudlard': 'Parc, forêt, lac et cabane : tout ce qui se passe hors des murs.',
			'le terrain de quidditch': 'Entraînements, matchs et rivalités entre maisons.',
			'couloir et passage secrets': 'Tours, passages dérobés et salles que l’on ne trouve qu’en cherchant.',
			"l'infirmerie": 'Soins, convalescences et visites tardives.',
			'le bureau du directeur': 'Audiences, convocations et secrets de l’université.'
		};
		var HOUSES = [
			{ k: 'gryffondor', c: '#d65a6b', crest: 'img/ecussons/Gryffondor.png', tag: 'Courage, audace et loyauté.' },
			{ k: 'serdaigle', c: '#6fb0cf', crest: 'img/ecussons/Serdaigle.png', tag: 'Savoir, esprit et curiosité.' },
			{ k: 'serpentard', c: '#5fc4a0', crest: 'img/ecussons/Serpentard.png', tag: 'Ambition, ruse et détermination.' },
			{ k: 'poufsouffle', c: '#d9b650', crest: 'img/ecussons/Poufsouffle.png', tag: 'Travail, patience et justice.' }
		];
		function h(tag, cls, txt) { var e = document.createElement(tag); if (cls) { e.className = cls; } if (txt !== undefined && txt !== null) { e.textContent = txt; } return e; }
		function link(cls, txt, href) { var a = h('a', cls, txt); a.href = href || '#'; return a; }
		function clean(s) { return (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, ''); }
		function num(n) { if (!n) { return 0; } var t = n.firstChild ? (n.firstChild.nodeValue || '') : ''; var v = parseInt(t.replace(/\D/g, ''), 10); return isNaN(v) ? 0 : v; }

		/* lecture des forums */
		var rows = [];
		Array.prototype.forEach.call(card.querySelectorAll('li.row'), function (row) {
			var a = row.querySelector('a.forumtitle');
			if (!a) { return; }
			var subs = [];
			Array.prototype.forEach.call(row.querySelectorAll('dd.dterm a.gensmall'), function (s) { subs.push({ name: clean(s.textContent), href: s.getAttribute('href') }); });
			var lp = row.querySelector('dd.lastpost .lastpost-infos');
			var ta = lp ? lp.querySelector('a') : null;
			var who = row.querySelector('dd.lastpost a.gensmall');
			var date = '';
			if (lp) { Array.prototype.forEach.call(lp.childNodes, function (nd) { if (nd.nodeType === 3) { date += nd.nodeValue; } }); }
			date = clean(date).replace(/\s*\bpar\b\s*$/i, '');
			var whoTxt = who ? clean(who.textContent) : '';
			rows.push({
				name: clean(a.textContent), href: a.getAttribute('href'), subs: subs,
				topics: num(row.querySelector('dd.topics')), posts: num(row.querySelector('dd.posts')),
				lastTitle: ta && clean(ta.textContent) ? clean(ta.textContent) : '', lastHref: ta ? ta.getAttribute('href') : '',
				lastRest: date && whoTxt ? date + ' · ' + whoTxt : (date || whoTxt), lastBy: whoTxt
			});
		});
		if (!rows.length) { return; }
		function imgOf(name) { var p = IMG[norm(name)]; return p ? base + p : ''; }
		function foot(r) {
			var f = h('div', 'cp-cf');
			var s = h('span');
			s.appendChild(h('b', '', String(r.topics))); s.appendChild(document.createTextNode(' prophéties · '));
			s.appendChild(h('b', '', String(r.posts))); s.appendChild(document.createTextNode(' hiboux'));
			f.appendChild(s);
			f.appendChild(h('span', '', r.lastTitle || '—'));
			return f;
		}

		var places = [], houses = [], topics = 0, posts = 0, last = null;
		rows.forEach(function (r) {
			topics += r.topics; posts += r.posts;
			if (!last && r.lastTitle) { last = r; }
			var n = norm(r.name), hs = null;
			HOUSES.forEach(function (x) { if (n.indexOf('maison') === 0 && n.indexOf(x.k) > -1) { hs = x; } });
			if (hs) { houses.push({ r: r, h: hs }); } else { places.push(r); }
		});

		var root = h('div', 'cpx');
		/* bandeau */
		var hero = h('section', 'cp-hero');
		hero.style.setProperty('--cp-img', 'url(' + base + 'img/lieux/poudlard-nuit.jpg)');
		var hi = h('div', 'cp-hi');
		var num1 = h('div', 'cp-num', 'IV'); num1.appendChild(h('i')); hi.appendChild(num1);
		hi.appendChild(h('h1', '', 'Poudlard'));
		hi.appendChild(h('p', 'cp-tag', 'L’université de sorcellerie, étage par étage.'));
		hi.appendChild(h('p', 'cp-desc', 'Le cœur de la vie universitaire, organisé par zones du château. Les lieux précis sont des sujets RP dans l’espace concerné.'));
		hero.appendChild(hi);
		var st = h('div', 'cp-st');
		var s1 = h('div'); s1.appendChild(h('b', '', String(topics))); s1.appendChild(document.createTextNode('prophéties'));
		var s2 = h('div'); s2.appendChild(h('b', '', String(posts))); s2.appendChild(document.createTextNode('hiboux'));
		st.appendChild(s1); st.appendChild(s2); hero.appendChild(st);
		var lb = h('div', 'cp-last');
		lb.appendChild(h('span', 'dm', last && last.lastBy ? last.lastBy.charAt(0).toUpperCase() : '✦'));
		var lt = h('div'); lt.appendChild(h('small', '', 'Dernier hibou'));
		if (last) { var sa = h('strong'); sa.appendChild(link('', last.lastTitle, last.lastHref)); lt.appendChild(sa); lt.appendChild(h('span', '', last.lastRest)); }
		else { lt.appendChild(h('strong', '', 'Aucun hibou')); lt.appendChild(h('span', '', 'pour le moment')); }
		lb.appendChild(lt);
		var act = h('div', 'cp-act');
		var mark = main.querySelector('ul.linklist li.rightside a[href*="mark=forums"]');
		if (mark) { act.appendChild(link('', 'Marquer comme lu', mark.getAttribute('href'))); }
		act.appendChild(link('g', 'Nouveaux hiboux', '/search?search_id=newposts'));
		lb.appendChild(act); hero.appendChild(lb);
		root.appendChild(hero);

		/* lieux */
		if (places.length) {
			var lab = h('div', 'cp-lab', 'Les lieux du château'); lab.appendChild(h('em', '', 'Choisis où se déroule ta scène')); root.appendChild(lab);
			var grid = h('div', 'cp-grid');
			places.forEach(function (r) {
				var art = h('article', 'cp-card');
				var im = imgOf(r.name), ci = h('div', 'cp-ci');
				if (im) { ci.style.backgroundImage = 'url(' + im + ')'; } else { ci.className += ' none'; }
				art.appendChild(ci);
				var cb = h('div', 'cp-cb'), h3 = h('h3'); h3.appendChild(link('', r.name, r.href)); cb.appendChild(h3);
				var d = DESC[norm(r.name)]; if (d) { cb.appendChild(h('p', '', d)); }
				if (r.subs.length) { var ch = h('div', 'cp-chips'); r.subs.forEach(function (s) { ch.appendChild(link('', s.name, s.href)); }); cb.appendChild(ch); }
				cb.appendChild(foot(r)); art.appendChild(cb); grid.appendChild(art);
			});
			root.appendChild(grid);
		}
		/* maisons */
		if (houses.length) {
			var lab2 = h('div', 'cp-lab', 'Les quatre maisons'); lab2.appendChild(h('em', '', 'Salles communes et dortoirs')); root.appendChild(lab2);
			var hg = h('div', 'cp-hg');
			houses.forEach(function (o) {
				var art = h('article', 'cp-h'); art.style.setProperty('--c', o.h.c);
				var hh = h('div', 'cp-hh'), im = h('img'); im.src = base + o.h.crest; im.alt = ''; hh.appendChild(im);
				var tx = h('div'), h3 = h('h3'); h3.appendChild(link('', o.r.name, o.r.href)); tx.appendChild(h3); tx.appendChild(h('p', '', o.h.tag)); hh.appendChild(tx); art.appendChild(hh);
				var ht = h('div', 'cp-ht');
				o.r.subs.forEach(function (s) {
					var n = norm(s.name), label = n.indexOf('dortoir') > -1 ? 'Dortoirs' : (n.indexOf('commune') > -1 ? 'Salle Commune' : s.name);
					var p = imgOf(s.name), a = link('cp-t', '', s.href);
					if (p) { a.style.backgroundImage = 'url(' + p + ')'; }
					else { a.className += ' empty'; var ci = h('img'); ci.src = base + o.h.crest; ci.alt = ''; a.appendChild(ci); }
					a.appendChild(h('span', '', label)); ht.appendChild(a);
				});
				art.appendChild(ht); art.appendChild(foot(o.r)); hg.appendChild(art);
			});
			root.appendChild(hg);
		}
		rvx.parentNode.insertBefore(root, rvx);
		document.body.className += ' rv-catp';
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();

/* ===== REVELIO : page Hauts-faits (page HTML contenant <div id="rv-hf"></div>) ===== */
(function () {
	function run() {
		var root = document.getElementById('rv-hf');
		function h(tag, cls, txt) { var e = document.createElement(tag); if (cls) { e.className = cls; } if (txt !== undefined && txt !== null) { e.textContent = txt; } return e; }
		function norm(s) { s = (s || '').toLowerCase(); if (s.normalize) { s = s.normalize('NFD').replace(/[̀-ͯ]/g, ''); } return s.replace(/[^a-z0-9?]+/g, ' ').replace(/^ | $/g, ''); }
		var ICON = {
			wand: 'M4 20L16 8M16 8l2-2M14 3v2M20 9h2M18 5l1-1M21 3l-1 1', flame: 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 3-4z',
			shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
			feather: 'M20.2 3.8a6 6 0 0 0-8.5 0L5 10.5V19h8.5l6.7-6.7a6 6 0 0 0 0-8.5zM16 8 3 21M17.5 15H9', moon: 'M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z',
			star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
			key: 'M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
			eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', flask: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8',
			book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z', scroll: 'M8 21h11a2 2 0 0 0 2-2v-1H10v1a2 2 0 0 1-2 2zM8 21a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2h4M19 18V5a2 2 0 0 0-2-2H6',
			bag: 'M6 8h12l1.5 12h-15zM9 8V6a3 3 0 0 1 6 0v2', gem: 'M6 3h12l4 6-10 12L2 9zM2 9h20M12 21 8 9l4-6 4 6z', broom: 'M3 21l9-9M12 12l5-5 4 4-5 5zM15 9l3 3',
			lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4', heart: 'M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z',
			rings: 'M9 12m-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0-11 0M15 12m-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0-11 0'
		};
		var R = { C: { label: 'Commun', c: '#a8a193', t: '#d4cfc0' }, R: { label: 'Rare', c: '#4f9fc9', t: '#8fcbea' }, E: { label: 'Épique', c: '#9a62c9', t: '#c9a2ec' }, L: { label: 'Légendaire', c: '#c9972f', t: '#f0d28f' } };
		var CATS = ['Tous', 'RP', 'IRL', 'IG', 'Monde'];
		/* [catégorie, rareté, icône, nom, description, source, règle automatique ou clé secrète] */
		var DEFS = [
			['RP', 'C', 'feather', 'Premier hibou', 'Poster son premier message.', 'auto', { posts: 1 }],
			['RP', 'C', 'scroll', 'Conteur', 'Poster dix messages.', 'auto', { posts: 10 }],
			['RP', 'R', 'feather', 'Plume d’or', 'Poster 250 messages.', 'auto', { posts: 250 }],
			['RP', 'L', 'star', 'Légende de Poudlard', 'Poster 1 000 messages.', 'auto', { posts: 1000 }],
			['RP', 'C', 'moon', 'Retourneur de temps', 'Écrire son premier flashback.', 'staff'],
			['RP', 'C', 'book', 'Élève de première classe', 'Assister à son premier cours.', 'staff'],
			['RP', 'R', 'flame', 'Duelliste', 'Remporter un duel officiel.', 'staff'],
			['RP', 'R', 'book', 'Fresque vivante', 'Participer à cinq RP de groupe.', 'staff'],
			['RP', 'R', 'heart', 'Les histoires de camarades', 'Terminer le fil RP de trois personnages du forum.', 'staff'],
			['RP', 'R', 'flame', 'Y’a pas de troll !', 'Survivre à un événement du staff à Pré-au-Lard.', 'staff'],
			['RP', 'R', 'broom', 'Un bon coup de balai', 'Battre le temps d’Imelda lors d’une course de balai.', 'staff'],
			['RP', 'E', 'rings', 'Serment tenu', 'Prononcer un serment inviolable.', 'staff'],
			['RP', 'E', 'star', 'Champion du Tournoi', 'Participer à un Event du staff.', 'staff'],
			['RP', 'E', 'eye', 'Par la barbe de Merlin !', 'Réussir une série d’épreuves lancée par le staff.', 'staff'],
			['RP', 'E', 'shield', 'Gardien des créatures', 'Sauver une créature lors d’un événement.', 'staff'],
			['RP', 'L', 'eye', '???', 'Ce haut-fait reste secret.', 'staff', { secret: 'Secret RP' }],
			['IRL', 'C', 'shield', 'Bienvenue', 'Faire valider sa fiche : rejoindre le groupe des élèves.', 'staff'],
			['IRL', 'C', 'scroll', 'Une Répartition fracassante', 'Être réparti dans une maison.', 'staff'],
			['IRL', 'R', 'bolt', 'Fidèle', 'Être inscrit depuis trente jours.', 'auto', { days: 30 }],
			['IRL', 'E', 'moon', 'Une année à Poudlard', 'Être inscrit depuis un an.', 'auto', { days: 365 }],
			['IRL', 'R', 'heart', 'Parrain', 'Parrainer un nouveau membre.', 'staff'],
			['IRL', 'R', 'star', 'Révélation du mois', 'Être choisi comme meilleur nouveau venu.', 'staff'],
			['IRL', 'E', 'feather', 'Plume du mois', 'Signer le meilleur RP du mois.', 'staff'],
			['IRL', 'E', 'shield', 'Esprit de maison', 'Faire vivre sa maison au quotidien.', 'staff'],
			['IRL', 'E', 'heart', 'Élu', 'Être choisi par le peuple du forum.', 'staff'],
			['IRL', 'E', 'moon', 'Pionnier', 'Avoir rejoint REVELIO pendant sa première année.', 'staff'],
			['IRL', 'L', 'gem', 'Coupe des maisons', 'Faire gagner sa maison en fin d’année.', 'staff'],
			['IRL', 'L', 'gem', 'Maître de Poudlard', 'Obtenir tous les autres hauts-faits.', 'staff', { plat: true }],
			['IG', 'C', 'wand', 'Premier sort', 'Lancer un sort pour la première fois.', 'staff'],
			['IG', 'R', 'flask', 'Maître des potions', 'Réussir dix potions.', 'staff'],
			['IG', 'R', 'key', 'Chasseur de trésors', 'Trouver cinq objets cachés.', 'staff'],
			['IG', 'R', 'wand', 'Sur le bout de la baguette', 'Apprendre tous les sortilèges du guidebook.', 'staff'],
			['IG', 'R', 'book', 'Main verte', 'Réussir tous les cours de botanique.', 'staff'],
			['IG', 'R', 'shield', 'Jamais deux sans trois', 'Améliorer un équipement trois fois.', 'staff'],
			['IG', 'E', 'bag', 'Millionnaire', 'Posséder 10 000 gallions.', 'staff'],
			['IG', 'E', 'flask', 'Potions à profusion', 'Préparer tous les types de potions.', 'staff'],
			['IG', 'E', 'gem', 'Collectionnite', 'Compléter toutes les collections de la fiche technique.', 'staff'],
			['IG', 'E', 'scroll', 'Une bonne âme', 'Terminer toutes les quêtes annexes.', 'staff'],
			['IG', 'L', 'star', 'Un effort exceptionnel', 'Atteindre le niveau maximum.', 'staff'],
			['IG', 'L', 'broom', 'Animagus', 'Découvrir sa forme animale.', 'staff'],
			['Monde', 'C', 'key', 'Premiers pas', 'Jouer une scène au Grand Hall.', 'staff'],
			['Monde', 'C', 'broom', 'Escapade à Pré-au-Lard', 'Jouer une scène au village.', 'staff'],
			['Monde', 'R', 'book', 'Cartographe', 'Jouer dans les six ailes du château.', 'staff'],
			['Monde', 'R', 'moon', 'Sous la surface', 'Jouer dans les sous-sols du château.', 'staff'],
			['Monde', 'R', 'flame', 'Au cœur de la forêt', 'Jouer une scène dans la Forêt interdite.', 'staff'],
			['Monde', 'R', 'key', 'Une vue imprenable', 'Jouer une scène au sommet de la tour du directeur.', 'staff'],
			['Monde', 'R', 'wand', '???', 'Ce haut-fait reste secret.', 'staff', { secret: 'Secret Monde 1' }],
			['Monde', 'E', 'eye', 'Salle sur demande', 'Trouver la salle qui apparaît à qui la cherche.', 'staff'],
			['Monde', 'E', 'key', 'Soif d’aventure', 'Découvrir tous les lieux de la carte.', 'staff'],
			['Monde', 'E', 'eye', '???', 'Ce haut-fait reste secret.', 'staff', { secret: 'Secret Monde 2' }],
			['Monde', 'L', 'gem', 'Explorateur du monde', 'Jouer dans les douze hameaux du monde.', 'staff'],
			['Monde', 'L', 'eye', '???', 'Ce haut-fait reste secret.', 'staff', { secret: 'Secret Monde 3' }]
		];

		var qs = (location.search.match(/[?&]u=(\d+)/) || [])[1];
		var ud = window._userdata || {};
		var uid = qs || (ud.user_id > 0 ? String(ud.user_id) : '');
		if (root) {
			root.className = (root.className ? root.className + ' ' : '') + 'hf-root';
			if (uid) { root.appendChild(h('div', 'hf-empty', 'Chargement des hauts-faits…')); }
		}

		function fields(doc) {
			var out = {};
			Array.prototype.forEach.call(doc.querySelectorAll('dt'), function (dt) {
				var dd = dt.nextElementSibling;
				while (dd && dd.tagName !== 'DD') { dd = dd.nextElementSibling; }
				if (!dd) { return; }
				var k = norm(dt.textContent);
				if (k && !(k in out)) { out[k] = dd.textContent.replace(/\u00a0/g, ' ').replace(/^\s+|\s+$/g, ''); out[k + '#html'] = dd; }
			});
			if (location.hash === '#debug') { try { console.log('RV champs', Object.keys(out).filter(function (x) { return x.indexOf('#') < 0; })); } catch (e) { } }
			return out;
		}
		function parseStaff(node) {
			var map = {};
			if (!node) { return map; }
			var txt = node.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li)>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
			txt.split(/\n+/).forEach(function (line) {
				var p = line.split('|').map(function (x) { return x.replace(/^\s+|\s+$/g, ''); });
				if (!p[0]) { return; }
				var e = { date: '', cur: null, max: null, reveal: '' };
				var m = (p[1] || '').match(/^(\d+)\s*\/\s*(\d+)$/);
				if (m) { e.cur = parseInt(m[1], 10); e.max = parseInt(m[2], 10); } else { e.date = p[1] || ''; }
				e.reveal = p[2] || '';
				map[norm(p[0])] = e;
			});
			return map;
		}
		function build(f, name) {
			var posts = parseInt((f['messages'] || '0').replace(/\D/g, ''), 10) || 0;
			var days = null, dm = (f['date d inscription'] || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
			if (dm) { days = Math.floor((Date.now() - new Date(+dm[3], +dm[2] - 1, +dm[1]).getTime()) / 864e5); }
			var staff = parseStaff(f['hauts faits#html'] || f['haut faits#html'] || f['haut fait#html'] || f['hauts fait#html']);
			var all = DEFS.map(function (d) {
				var x = d[6] || {}, r = R[d[1]], got = false, cur = null, max = null, date = '', nm = d[3], desc = d[4], secret = !!x.secret, ic = d[2];
				if (x.posts) { cur = Math.min(posts, x.posts); max = x.posts; got = posts >= x.posts; }
				else if (x.days) { cur = Math.min(days || 0, x.days); max = x.days; got = days !== null && days >= x.days; }
				else if (!x.plat) {
					var s = staff[norm(secret ? x.secret : nm)];
					if (s) { if (s.date) { got = true; date = /^\d/.test(s.date) ? s.date : ''; } else if (s.max) { cur = s.cur; max = s.max; got = s.cur >= s.max; } else { got = true; }
						if (got && secret) { secret = false; if (s.reveal) { nm = s.reveal; } desc = 'Haut-fait secret découvert.'; ic = d[2]; } }
				}
				return { cat: d[0], rk: d[1], r: r, icon: secret ? 'lock' : ic, name: nm, desc: desc, src: d[5], got: got, secret: secret, cur: cur, max: max, date: date, plat: !!x.plat };
			});
			var others = all.filter(function (a) { return !a.plat; });
			var plat = all.filter(function (a) { return a.plat; })[0];
			if (plat) { plat.cur = others.filter(function (a) { return a.got; }).length; plat.max = others.length; plat.got = plat.cur === plat.max; }
			return all;
		}
		/* ---- Aperçu sur le profil : <div class="rv-hfmini" data-u="ID" data-n="Nom"> ---- */
		function mini(box) {
			var u = box.getAttribute('data-u');
			if (!u) { return; }
			var x = new XMLHttpRequest();
			x.open('GET', '/u' + u, true);
			x.onload = function () {
				if (x.status !== 200) { return; }
				var f = fields(new DOMParser().parseFromString(x.responseText, 'text/html'));
				var all = build(f, '');
				var on = all.filter(function (a) { return a.got; }).length;
				var bx = box.closest ? box.closest('.pa-badgebox') : null;
				if (bx) {
					var bn = bx.querySelector('.pa-bh-n'), bb = bx.querySelector('.pa-bar b');
					if (bn) { bn.innerHTML = on + '<i> / ' + all.length + '</i>'; }
					if (bb) { bb.style.width = Math.round(on / all.length * 100) + '%'; }
				}
				box.innerHTML = '';
				var GROUPS = [['RP', 'Récompenses RP'], ['IRL', 'Récompenses IRL'], ['IG', 'Récompenses IG'], ['Monde', 'Exploration du monde']];
				GROUPS.forEach(function (g) {
					var items = all.filter(function (a) { return a.cat === g[0]; });
					var n = items.filter(function (a) { return a.got; }).length;
					var row = h('div', 'pa-brow'), tag = h('div', 'pa-btag');
					tag.appendChild(h('span', '', g[1]));
					var em = h('em'); em.appendChild(h('b', '', String(n))); em.appendChild(document.createTextNode(' / ' + items.length + ' obtenus')); tag.appendChild(em);
					row.appendChild(tag);
					var grid = h('div', 'pa-bgrid');
					items.slice().sort(function (a, b) { return (b.got ? 1 : 0) - (a.got ? 1 : 0); }).forEach(function (a) {
						var bd = h('div', 'pa-badge' + (a.got ? '' : ' pa-badge-off'));
						bd.title = a.got ? a.name + (a.date ? ' · ' + a.date : '') : (a.secret ? 'Haut-fait secret' : a.name + ' · à débloquer');
						bd.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="' + ICON[a.icon] + '"/></svg>';
						grid.appendChild(bd);
					});
					row.appendChild(grid); box.appendChild(row);
				});
			};
			x.send();
		}
		window.RVHF = { fields: fields, build: build };
		var tries = 0, iv = setInterval(function () {
			var b = document.querySelector('.rv-hfmini:not([data-done])');
			if (b) { b.setAttribute('data-done', '1'); mini(b); clearInterval(iv); }
			else if (++tries > 40) { clearInterval(iv); }
		}, 150);
		if (!root) { return; }
		if (!uid) { root.appendChild(h('div', 'hf-empty', 'Connecte-toi pour voir tes hauts-faits.')); return; }

		function render(all, name, f, S) {
			root.innerHTML = '';
			var on = all.filter(function (a) { return a.got; }).length, total = all.length;
			var who = h('div', 'hf-who'), dm = h('div', 'hf-dm'); dm.appendChild(h('span', '', (name || '?').replace(/[^A-Za-zÀ-ÿ ]/g, '').split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase()));
			who.appendChild(dm);
			var wt = h('div'); wt.appendChild(h('div', 'hf-eyebrow', 'Revelio · Profil de ' + name)); wt.appendChild(h('h1', '', 'Hauts-faits'));
			var meta = [];
			var an = (f['annee scolaire'] || '').replace(/^[\s-]+|[\s-]+$/g, ''); if (an) { meta.push(an); }
			var ti = f['titre'] || ''; if (ti && !/^aucun/i.test(ti)) { meta.push(ti.length > 40 ? '' : ti); }
			meta = meta.filter(Boolean);
			if (meta.length) { var mm = h('div', 'hf-m'); meta.forEach(function (t, i) { if (i) { mm.appendChild(h('i')); } mm.appendChild(h('b', '', t)); }); wt.appendChild(mm); }
			who.appendChild(wt); root.appendChild(who);
			root.appendChild(h('p', 'hf-lead', 'Chaque haut-fait raconte un moment du personnage ou de son joueur : un sort lancé, un coin du château exploré, un titre remporté ou un cap franchi sur le forum.'));
			var top = h('div', 'hf-top');
			var sum = h('section', 'hf-sum'), sn = h('div', 'hf-sum-n', String(on)); sn.appendChild(h('i', '', '/ ' + total)); sn.appendChild(h('span', '', 'hauts-faits obtenus')); sum.appendChild(sn);
			var bar = h('div', 'hf-bar'), bb = h('b'); bb.style.width = Math.round(on / total * 100) + '%'; bar.appendChild(bb); sum.appendChild(bar);
			var rar = h('div', 'hf-rar');
			['C', 'R', 'E', 'L'].forEach(function (k) { var d = h('div'); d.style.setProperty('--c', R[k].c); d.appendChild(h('i')); d.appendChild(h('b', '', String(all.filter(function (a) { return a.got && a.rk === k; }).length))); d.appendChild(document.createTextNode(' ' + R[k].label + 's')); rar.appendChild(d); });
			sum.appendChild(rar);
			var nAuto = all.filter(function (a) { return a.src === 'auto'; }).length;
			var pts = h('div', 'hf-pts'); pts.appendChild(h('b', '', String(nAuto))); pts.appendChild(document.createTextNode(' automatiques · ')); pts.appendChild(h('b', '', String(total - nAuto))); pts.appendChild(document.createTextNode(' validés par le staff'));
			sum.appendChild(pts); top.appendChild(sum);
			var best = null;
			all.forEach(function (a) { if (!a.got && a.max && !a.secret && !a.plat && (!best || a.cur / a.max > best.cur / best.max)) { best = a; } });
			if (best) {
				var nx = h('section', 'hf-next'), hx = h('div', 'hf-hex'); hx.style.setProperty('--c', best.r.c); hx.style.setProperty('--t', best.r.t);
				hx.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="' + ICON[best.icon] + '"/></svg>'; nx.appendChild(hx);
				var nb = h('div'); nb.style.cssText = 'flex:1;min-width:0'; nb.appendChild(h('small', '', 'Presque là')); nb.appendChild(h('h3', '', best.name)); nb.appendChild(h('p', '', best.desc));
				var pw = h('div', 'hf-pgw'); pw.style.setProperty('--c', best.r.c); var pg = h('div', 'hf-pg'), pi = h('i'); pi.style.width = Math.round(best.cur / best.max * 100) + '%'; pg.appendChild(pi); pw.appendChild(pg);
				var pc = h('span', '', best.cur + ' / ' + best.max); pc.style.cssText = 'font-size:11px;color:#cfc9ba'; pw.appendChild(pc); nb.appendChild(pw); nx.appendChild(nb); top.appendChild(nx);
			}
			root.appendChild(top);
			var tools = h('div', 'hf-tools'), tabs = h('div', 'hf-tabs'), sts = h('div', 'hf-st');
			CATS.forEach(function (l, i) { var b = h('button', 'hf-tab' + (i === S.cat ? ' on' : ''), l); b.type = 'button'; b.appendChild(h('em', '', String(i === 0 ? total : all.filter(function (a) { return a.cat === l; }).length))); b.addEventListener('click', function () { S.cat = i; render(all, name, f, S); }); tabs.appendChild(b); });
			['Tous', 'Obtenus', 'À débloquer'].forEach(function (l, i) { var b = h('button', 'hf-tab' + (i === S.st ? ' on' : ''), l); b.type = 'button'; b.addEventListener('click', function () { S.st = i; render(all, name, f, S); }); sts.appendChild(b); });
			tools.appendChild(tabs); tools.appendChild(sts); root.appendChild(tools);
			var grid = h('div', 'hf-grid'), n = 0;
			all.forEach(function (a) {
				if (S.cat && a.cat !== CATS[S.cat]) { return; }
				if (S.st === 1 && !a.got) { return; } if (S.st === 2 && a.got) { return; }
				n++;
				var hasPg = !a.got && a.max && !a.secret;
				var c = h('article', 'hf-card' + (a.got ? '' : ' off') + (a.secret ? ' hf-secret' : '')); c.style.setProperty('--c', a.r.c); c.style.setProperty('--t', a.r.t);
				var hx = h('div', 'hf-hex'); hx.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="' + ICON[a.icon] + '"/></svg>'; c.appendChild(hx);
				var b = h('div', 'hf-b'); b.appendChild(h('span', 'hf-r', a.r.label + ' · ' + a.cat)); b.appendChild(h('h4', '', a.name)); b.appendChild(h('p', '', a.desc));
				var me = h('div', 'hf-meta');
				if (hasPg) { var pw = h('div', 'hf-pgw'), pg = h('div', 'hf-pg'), pi = h('i'); pi.style.width = Math.round(a.cur / a.max * 100) + '%'; pg.appendChild(pi); pw.appendChild(pg); pw.appendChild(h('span', '', a.cur + ' / ' + a.max)); me.appendChild(pw); }
				else { me.appendChild(h('span', '', a.got ? (a.date ? 'Décerné le ' + a.date : 'Débloqué') : 'À débloquer')); }
				me.appendChild(h('span', 'hf-staff', a.src === 'auto' ? 'Automatique' : 'Staff'));
				b.appendChild(me); c.appendChild(b); grid.appendChild(c);
			});
			root.appendChild(grid);
			if (!n) { root.appendChild(h('div', 'hf-empty', 'Aucun haut-fait ici pour l’instant.')); }
			root.appendChild(h('p', 'hf-note', 'Les hauts-faits secrets restent masqués jusqu’à leur obtention. Les hauts-faits « Automatique » se débloquent d’eux-mêmes grâce aux données du forum (nombre de messages, date d’inscription). Les autres sont validés par le staff, qui les inscrit sur ton profil.'));
		}
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/u' + uid, true);
		xhr.onload = function () {
			if (xhr.status !== 200) { root.innerHTML = ''; root.appendChild(h('div', 'hf-empty', 'Profil introuvable.')); return; }
			var doc = new DOMParser().parseFromString(xhr.responseText, 'text/html');
			var f = fields(doc);
			var nq = (location.search.match(/[?&]n=([^&]+)/) || [])[1], name = '';
			try { if (nq) { name = decodeURIComponent(nq.replace(/\+/g, ' ')); } } catch (e) { }
			if (!name && !qs && ud.username) { name = String(ud.username); }
			if (!name) { var hn = (doc.querySelector('h1 .usr_grp_clr') || doc.querySelector('h1 strong') || doc.querySelector('#profile-advanced-details h1')); if (hn) { name = hn.textContent.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '').replace(/^(tout|toutes?) (à|a) propos de\s*/i, '').replace(/^(profil|à propos) de\s*/i, ''); } }
			if (!name) {
				var sl = doc.querySelector('a[href^="/spa/"], a[href^="/st/"], a[href^="/sta/"]');
				if (sl) { try { name = decodeURIComponent((sl.getAttribute('href') || '').replace(/^\/(spa|st|sta)\//, '').replace(/\+/g, ' ').replace(/\?.*$/, '')); } catch (e) { } }
			}
			if (!name && !qs && ud.username) { name = String(ud.username); }
			if (!name) { name = 'ce membre'; }
			render(build(f, name), name, f, { cat: 0, st: 0 });
		};
		xhr.onerror = function () { root.innerHTML = ''; root.appendChild(h('div', 'hf-empty', 'Impossible de charger le profil.')); };
		xhr.send();
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();

/* ===== REVELIO : résultats de recherche (liste de sujets) ===== */
(function () {
	function run() {
		var main = document.getElementById('main-content');
		var rows = main ? main.querySelectorAll('ul.topiclist.search li.row') : [];
		if (!rows.length) { return; }
		var forabg = rows[0].closest('.forabg');
		if (!forabg) { return; }
		function h(tag, cls, txt) { var e = document.createElement(tag); if (cls) { e.className = cls; } if (txt !== undefined && txt !== null) { e.textContent = txt; } return e; }
		function clean(s) { return (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, ''); }
		function num(n) { var v = parseInt(((n && n.firstChild && n.firstChild.nodeValue) || '').replace(/\D/g, ''), 10); return isNaN(v) ? 0 : v; }
		function ico(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>'; }
		var CHAT = 'M4 5h16v11H9l-5 4z', FLAME = 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 3-4z', LOCK = 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4';
		var list = h('div', 'rs-list');
		var cols = h('div', 'rs-cols');
		['', 'Prophéties', 'Réponses', 'Vues', 'Dernier hibou'].forEach(function (t) { cols.appendChild(h('span', '', t)); });
		list.appendChild(cols);
		Array.prototype.forEach.call(rows, function (row) {
			var ta = row.querySelector('a.topictitle');
			if (!ta) { return; }
			var dl = row.querySelector('dl'), bg = dl ? (dl.style.backgroundImage || '') : '';
			var unread = /unread/i.test(bg), locked = /lock/i.test(bg);
			var au = row.querySelector('.topic-author'), auA = au ? au.querySelector('a') : null;
			var auCol = '', sp = auA ? auA.querySelector('[style*="color"]') : null;
			if (sp) { auCol = sp.style.color; }
			var inA = au ? au.querySelectorAll('a')[1] : null;
			var lp = row.querySelector('dd.lastpost'), lpA = lp ? lp.querySelector('a.gensmall') : null;
			var lpCol = '', lps = lpA ? lpA.querySelector('[style*="color"]') : null; if (lps) { lpCol = lps.style.color; }
			var date = '';
			if (lp) { var sp2 = lp.querySelector('span'); if (sp2) { Array.prototype.forEach.call(sp2.childNodes, function (n) { if (n.nodeType === 3) { date += n.nodeValue; } }); } }
			var parts = clean(ta.textContent).split('|').map(clean).filter(Boolean);
			var r = h('article', 'rs-row'); var col = auCol || '#d9b36a'; r.style.setProperty('--l', col); r.style.setProperty('--t', lpCol || col);
			var st = h('div', 'rs-st'); st.appendChild(h('i')); var sv = h('span'); sv.innerHTML = ico(locked ? LOCK : (unread ? FLAME : CHAT)); st.appendChild(sv); r.appendChild(st);
			var ti = h('div', 'rs-ti'), h2 = h('h2'), a = h('a', '', parts[0] || clean(ta.textContent)); a.href = ta.getAttribute('href'); h2.appendChild(a); ti.appendChild(h2);
			var meta = h('div', 'rs-meta');
			if (auA) { meta.appendChild(document.createTextNode('par ')); var b = h('b', '', clean(auA.textContent)); if (auCol) { b.style.color = auCol; } meta.appendChild(b); }
			if (inA) { meta.appendChild(document.createTextNode('dans ')); var fa = h('a', 'rs-in', clean(inA.textContent)); fa.href = inA.getAttribute('href'); meta.appendChild(fa); }
			parts.slice(1, 4).forEach(function (p) { meta.appendChild(h('span', 'rs-chip', p)); });
			if (unread) { meta.appendChild(h('span', 'rs-chip g', 'Nouveau')); }
			if (locked) { meta.appendChild(h('span', 'rs-chip w', 'Verrouillé')); }
			ti.appendChild(meta); r.appendChild(ti);
			var n1 = h('div', 'rs-n', String(num(row.querySelector('dd.posts')))); n1.appendChild(h('small', '', 'Réponses'));
			var n2 = h('div', 'rs-n', String(num(row.querySelector('dd.views')))); n2.appendChild(h('small', '', 'Vues'));
			r.appendChild(n1); r.appendChild(n2);
			var lw = h('div', 'rs-lp'), av = h('div', 'rs-lav'); av.appendChild(h('i')); av.appendChild(h('b', '', lpA ? clean(lpA.textContent).charAt(0).toUpperCase() : '✦')); lw.appendChild(av);
			var lt = h('div', 'rs-lt'), ls = h('strong', '', lpA ? clean(lpA.textContent) : '—'); lt.appendChild(ls); lt.appendChild(document.createTextNode(clean(date))); lw.appendChild(lt); r.appendChild(lw);
			list.appendChild(r);
		});
		forabg.parentNode.insertBefore(list, forabg);
		forabg.style.display = 'none';
		var sh = main.querySelector('.sub-header .sub-header-info');
		if (sh) { var t = sh.querySelector('.page-title'); if (t) { sh.insertBefore(h('div', 'rs-eyebrow', 'Recherche'), sh.firstChild); } }
		var sp = main.querySelector('.sub-header-path');
		if (sp) { Array.prototype.forEach.call(sp.childNodes, function (n) { if (n.nodeType === 3) { n.nodeValue = n.nodeValue.replace(/\s*::\s*/g, '  ›  '); } }); }
		main.className += ' rv-sr';
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();

/* ===== REVELIO : résultats de recherche (messages) ===== */
(function () {
	function run() {
		var main = document.getElementById('main-content');
		var posts = main ? main.querySelectorAll('.search.post') : [];
		if (!posts.length || main.querySelector('.rs-list')) { return; }
		function h(tag, cls, txt) { var e = document.createElement(tag); if (cls) { e.className = cls; } if (txt !== undefined && txt !== null) { e.textContent = txt; } return e; }
		function clean(s) { return (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, ''); }
		var wrap = h('div', 'rs-msgs');
		var first = posts[0];
		Array.prototype.forEach.call(posts, function (p) {
			var pp = p.querySelector('.postprofile'), pb = p.querySelector('.postbody');
			if (!pp || !pb) { return; }
			var au = pp.querySelector('dt.author a'), col = '', cs = au ? au.querySelector('[style*="color"]') : null;
			if (cs) { col = cs.style.color; }
			var dds = pp.querySelectorAll('dd'), date = clean(dds[0] ? dds[0].textContent : '');
			var links = pp.querySelectorAll('a.postdetails'), fa = links[0], ta = links[1];
			var strongs = pp.querySelectorAll('dd strong'), rep = '', vue = '';
			Array.prototype.forEach.call(dds, function (d) { var t = clean(d.textContent); if (/^Réponses/i.test(t)) { rep = t.replace(/\D/g, ''); } if (/^Vues/i.test(t)) { vue = t.replace(/\D/g, ''); } });
			var h2 = pb.querySelector('h2'), href = h2 && h2.querySelector('a') ? h2.querySelector('a').getAttribute('href') : (ta ? ta.getAttribute('href') : '#');
			var parts = clean(ta ? ta.textContent : (h2 ? h2.textContent : '')).split('|').map(clean).filter(Boolean);
			var art = h('article', 'rs-msg'); art.style.setProperty('--l', col || '#d9b36a');
			var hd = h('header', 'rs-mh');
			var av = h('div', 'rs-lav'); av.appendChild(h('i')); av.appendChild(h('b', '', au ? clean(au.textContent).charAt(0).toUpperCase() : '✦')); hd.appendChild(av);
			var tx = h('div', 'rs-mt'), t2 = h('h2'), a = h('a', '', parts[0] || 'Message'); a.href = href; t2.appendChild(a); tx.appendChild(t2);
			var meta = h('div', 'rs-meta');
			if (au) { meta.appendChild(document.createTextNode('par ')); var b = h('b', '', clean(au.textContent)); if (col) { b.style.color = col; } meta.appendChild(b); }
			if (date) { meta.appendChild(h('span', '', date)); }
			if (fa) { meta.appendChild(document.createTextNode('dans ')); var f = h('a', 'rs-in', clean(fa.textContent)); f.href = fa.getAttribute('href'); meta.appendChild(f); }
			parts.slice(1, 4).forEach(function (x) { meta.appendChild(h('span', 'rs-chip', x)); });
			tx.appendChild(meta); hd.appendChild(tx);
			var st = h('div', 'rs-ms');
			[['Réponses', rep], ['Vues', vue]].forEach(function (x) { if (x[1] !== '') { var s = h('div', 'rs-mn'); s.appendChild(h('b', '', x[1])); s.appendChild(h('small', '', x[0])); st.appendChild(s); } });
			hd.appendChild(st);
			art.appendChild(hd);
			var body = h('div', 'postbody'), ct = h('div', 'content');
			Array.prototype.slice.call(pb.childNodes).forEach(function (n) { if (n !== h2) { ct.appendChild(n); } });
			body.appendChild(ct); art.appendChild(body);
			var ft = h('footer', 'rs-mf'), tg = h('button', 'rs-tg', 'Déplier'); tg.type = 'button';
			tg.addEventListener('click', function () { var o = art.classList.toggle('rs-open'); tg.textContent = o ? 'Replier' : 'Déplier'; });
			var go = h('a', 'rs-go', 'Voir le message'); go.href = href;
			ft.appendChild(tg); ft.appendChild(go); art.appendChild(ft);
			wrap.appendChild(art);
		});
		first.parentNode.insertBefore(wrap, first);
		Array.prototype.forEach.call(posts, function (p) { p.parentNode.removeChild(p); });
		wrap.className = 'rs-list rs-msgs';
		function chk() { Array.prototype.forEach.call(wrap.querySelectorAll('.rs-msg'), function (m) { var c = m.querySelector('.content'); if (c && c.scrollHeight > 330) { m.classList.add('rs-long'); } }); }
		chk(); setTimeout(chk, 800);
		var title = main.querySelector('h1.page-title');
		if (title) { title.parentNode.insertBefore(h('div', 'rs-eyebrow', 'Recherche'), title); }
		main.className += ' rv-sr rv-srm';
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();

/* ===== REVELIO : formulaire de recherche avancée ===== */
(function () {
	function run() {
		var main = document.getElementById('main-content');
		var f = main ? main.querySelector('form[name=searchform]') : null;
		if (!f) { return; }
		var t = main.querySelector('h1.page-title');
		if (t) { var e = document.createElement('div'); e.className = 'rs-eyebrow'; e.textContent = 'Recherche'; t.parentNode.insertBefore(e, t); }
		var MAP = { 'Sujets': 'Prophéties', 'Messages': 'Hiboux', 'Tous mes messages': 'Tous mes hiboux', 'Sujet du Message': 'Prophétie du hibou', 'Heure du Message': 'Heure du hibou', 'Titre du Sujet': 'Titre de la prophétie' };
		Array.prototype.forEach.call(f.querySelectorAll('label, option'), function (n) {
			Array.prototype.forEach.call(n.childNodes, function (c) { if (c.nodeType === 3) { var k = c.nodeValue.replace(/^\s+|\s+$/g, ''); if (MAP[k]) { c.nodeValue = c.nodeValue.replace(k, MAP[k]); } } });
		});
		Array.prototype.forEach.call(f.querySelectorAll('dt label'), function (l) { l.textContent = l.textContent.replace(/\s*:\s*$/, ''); });
		main.className += ' rv-sf';
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();

/* ===== REVELIO : formulaire de présentation (génère le code BBCode) ===== */
(function () {
	var PRES_FORUM = 8;               /* id du forum « Les Présentations » */
	var KEY = 'rv_pres_draft';
	var BLOODS = ['Sang-pur', 'Sang-mêlé', 'Né-moldu', 'Cracmol'];
	var FACS = [['Élève de Poudlard', '#d9b36a'], ['Personnel de Poudlard', '#c98a52'], ['Ministère', '#8f94e0'], ['Sorcier', '#8fb0d8'], ['Mage noir', '#aeb6c2'], ['Sans pouvoirs magiques', '#FFA57D']];
	var FCREST = ['Poudlard-4-maisons.png', 'Poudlard-4-maisons.png', 'Ministere-de-la-Magie.png', 'sor.png', 'mag.png', 'mol.png'];
	var BASE = 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@main/';
	(function () { var q = document.querySelector('script[src*="revelio.js"]'); if (q) { BASE = q.getAttribute('src').replace(/revelio\.js.*$/, ''); } })();
	var FTAG = ['Élève', 'Personnel', 'Ministère', 'Sorcier libre', 'Mage noir', 'Moldu ou Cracmol'], FDESC = ['Dès 18 ans · choisis ta maison, la Répartition est faite par le staff.', 'Professeur, médicomage, concierge… tu fais vivre le château.', 'Auror, Département des Mystères… tu fais respecter la loi.', 'Apothicaire, journaliste, guérisseur… sans allégeance au château.', 'Espion, recruteur, chasseur de prime… tu sers l’ombre.', 'Un regard extérieur sur un monde qu’on ne te montre pas.'];
	var ROLES = [[], ['Professeur', 'Médicomage', 'Concierge', 'Bibliothécaire', 'Directeur de maison', 'Autre'], ['Auror', 'Ministre de la Magie', 'Langue-de-Plomb', 'Département des Mystères', 'Magenmagot', 'Régulation des créatures', 'Autre'], ['Apothicaire', 'Journaliste', 'Guérisseur', 'Chasseur de reliques', 'Autre'], ['Espion', 'Recruteur', 'Chasseur de prime', 'Autre'], ['Libraire', 'Médecin', 'Journaliste', 'Autre']];
	var HOUSES = [['Gryffondor', '#d65a6b', 'Courage'], ['Serdaigle', '#6fb0cf', 'Sagesse'], ['Serpentard', '#5fc4a0', 'Ambition'], ['Poufsouffle', '#d9b650', 'Loyauté']];
	function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

	/* --- côté éditeur : pré-remplit le message depuis la fiche --- */
	function fillEditor() {
		var raw; try { raw = localStorage.getItem(KEY); } catch (e) { return; }
		if (!raw) { return; }
		var d; try { d = JSON.parse(raw); } catch (e) { return; }
		var ta = document.querySelector('textarea[name=message]'), sj = document.querySelector('input[name=subject]');
		if (!ta || !d || (Date.now() - d.t) > 3600000) { return; }
		ta.value = d.body; if (sj && !sj.value) { sj.value = d.subject; }
		try { ta.dispatchEvent(new Event('input', { bubbles: true })); localStorage.removeItem(KEY); } catch (e) { }
	}
	if (/mode=newtopic/.test(location.search) || /\/post/.test(location.pathname)) {
		if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fillEditor); } else { fillEditor(); }
	}

	/* --- côté page « Présentation » --- */
	function run() {
		var box = document.getElementById('rv-pres');
		if (!box || box.getAttribute('data-ok')) { return; }
		box.setAttribute('data-ok', '1');
		var S = { blood: 0, fac: 0, house: 0, reg: false, role: 0 };
		function field(id, lab, ph, req, tag) { return '<div><label class="pf-lab" for="pf-' + id + '">' + lab + (req ? ' <em>*</em>' : '') + '</label><input id="pf-' + id + '" class="pf-in" type="text" placeholder="' + esc(ph) + '"></div>'; }
		function area(id, lab, ph, req, cls) { return '<label class="pf-lab' + (cls === 'gap' ? ' pf-gap' : '') + '" for="pf-' + id + '">' + lab + (req ? ' <em>*</em>' : '') + '</label><textarea id="pf-' + id + '" class="pf-in pf-ta' + (cls === 'tall' ? ' tall' : '') + '" placeholder="' + esc(ph) + '"></textarea>'; }
		function sec(n, t, sub, inner, extra) { return '<div class="pf-sec"><h2 class="pf-h"><i><b>' + n + '</b></i>' + t + (extra || '') + '</h2><p class="pf-sub">' + sub + '</p>' + inner + '</div>'; }
		var html = '<div class="pf-root"><div class="pf-head" style="background-image:linear-gradient(180deg,rgba(11,10,8,.55),rgba(11,10,8,.92)),url(' + BASE + 'img/lieux/bibliotheque.jpg)"><span class="pf-eye">Le Choixpeau magique</span><h1>Nouvelle <em>présentation</em></h1><p class="pf-tag">Raconte-nous qui franchit les portes de Poudlard.</p></div><div class="pf-main"><form class="pf-box" onsubmit="return false">' +
			sec('I', 'Quel personnage veux-tu incarner ?', 'C’est le premier choix, et il décide du reste de ta fiche. Tu pourras créer d’autres personnages plus tard.',
				'<div class="pf-types" data-g="fac" role="group" aria-label="Type de personnage">' + FACS.map(function (f, i) { return '<button type="button" class="pf-ty' + (i ? '' : ' on') + '" style="--c:' + f[1] + '" data-i="' + i + '"><span class="ck"></span><img src="' + BASE + 'img/ecussons/' + FCREST[i] + '" alt=""><strong>' + f[0] + '</strong><em>' + FTAG[i] + '</em><small>' + FDESC[i] + '</small></button>'; }).join('') + '</div>') +
			sec('II', 'Identité', 'L’essentiel de ton personnage, tel qu’il apparaîtra dans sa fiche.',
				'<div class="pf-row3">' + field('n', 'Prénom', 'Elijah', 1) + field('p', 'Nom', 'Gaunt', 1) + field('a', 'Alias', 'Le Corbeau') + '</div>' +
				'<div class="pf-row3 pf-gap">' + field('ag', 'Âge', '18 à 25 ans', 1) + field('b', 'Date et lieu de naissance', '12 mars 1978 · Londres') + field('o', 'Origine', 'Famille de sorciers') + '</div>' +
				'<div class="pf-gap pf-cit"><label class="pf-lab" for="pf-ci">Citation</label><textarea id="pf-ci" class="pf-in pf-ta" placeholder="Une phrase qui te ressemble, dite par ton personnage ou à son sujet…"></textarea><p class="pf-hint">Facultatif. Elle s’affiche en grand en tête de ta fiche.</p></div>' +
				'<div class="pf-gap"><span class="pf-lab">Statut du sang <em>*</em></span><div class="pf-pills" data-g="blood" id="pf-bloods"></div></div>') +
			sec('III', 'Rang et maison', 'Les détails qui dépendent du type de personnage choisi plus haut.',
				'<div id="pf-rwrap" style="margin-bottom:6px"><span class="pf-lab">Quel rôle ? <em>*</em></span><div class="pf-pills" data-g="role" id="pf-roles"></div></div>' +
				'<div class="pf-gap" id="pf-hwrap"><span class="pf-lab" id="pf-hlab">Maison <em>*</em></span><div class="pf-houses" data-g="house">' + HOUSES.map(function (h, i) { return '<button type="button" class="pf-house' + (i ? '' : ' on') + '" style="--c:' + h[1] + '" data-i="' + i + '"><span class="sh"></span><b>' + h[0] + '</b>' + h[2] + '</button>'; }).join('') + '</div></div>' +
				'<div class="pf-row pf-gap"><div id="pf-ywrap">' + field('y', 'Année', 'Première année') + '</div>' + field('k', 'Karma', 'Neutre, bienveillant…') + '</div>' +
				'<div class="pf-row pf-gap" id="pf-fnwrap"><div><label class="pf-lab" for="pf-fn" id="pf-fnlab">Fonction</label><input id="pf-fn" class="pf-in" type="text" placeholder=""></div>' + field('lv', 'Lieu de vie', 'Ex : Pré-au-Lard, Londres, un manoir en Écosse') + '</div>') +
			sec('IV', 'Faceclaim', 'Le visage de ton personnage. Tu es responsable des images que tu importes.',
				'<div class="pf-row">' + field('f', 'Faceclaim', 'Nom de l’acteur ou de l’actrice', 1) + field('u', 'Lien de l’image', 'https://…') + '</div><p class="pf-hint">Un faceclaim par personnage. Il apparaît dans le Registre des sorciers.</p>') +
			sec('V', 'Physique et caractère', 'Quelques lignes suffisent. Ce qu’on voit, puis ce qu’on devine.',
				area('ph', 'Physique', 'Taille, silhouette, signes distinctifs…') + area('c', 'Caractère', 'Qualités, défauts, peurs, manies…', 1, 'gap') + '<div class="pf-gap">' + field('m', 'Motivation', 'Ce qui le pousse à franchir les portes de Poudlard') + '</div>') +
			sec('VI', 'Histoire', 'Son passé, sa famille, son rapport au monde de Grindelwald. Minimum 400 mots.',
				'<div id="pf-i2wrap" style="display:none;margin-bottom:18px">' + field('i2', 'Image d’illustration', 'https://… (un lieu, un objet, une scène)') + '<p class="pf-hint">Facultatif. Cette image est affichée au-dessus de ton histoire, pour personnaliser ta fiche.</p></div>' +
				area('h', 'Histoire', 'Il était une fois…', 1, 'tall') + '<p class="pf-wc" id="pf-wc">0 / 400 mots</p>',
				'<button type="button" class="pf-ico" id="pf-i2btn" title="Ajouter une image d’illustration" aria-label="Ajouter une image d’illustration"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="9" cy="10" r="1.6"/><path d="M3 17l5-5 4 4 3-3 6 6"/></svg></button>') +
			sec('VII', 'Derrière le personnage', 'Quelques mots sur toi, pour que le staff et les joueurs te connaissent.',
				'<div class="pf-row">' + field('pr', 'Pseudo / prénom', 'Comment t’appeler') + field('fr', 'Fréquence de jeu', 'Ex : une réponse par semaine') + '</div>' +
				'<div class="pf-gap">' + field('co', 'Comment as-tu découvert Revelio ?', 'Facultatif') + '</div>' +
				'<div class="pf-gap"><span class="pf-lab">Règlement <em>*</em></span><div class="pf-pills"><button type="button" class="pf-pill" id="pf-reg"><i></i>J’ai lu et j’accepte le règlement</button></div></div>') +
			'<div class="pf-acts"><p>Le formulaire écrit ta fiche pour toi : tu récupères le code prêt à coller, ou tu l’envoies directement dans l’éditeur.</p><div><button type="button" class="pf-btn" id="pf-go">Générer ma fiche</button></div></div>' +
			'<div class="pf-out" id="pf-out" style="display:none"></div>' +
			'</form><aside class="pf-side">' +
			'<section class="pf-box pf-card"><h3>Aperçu de la fiche</h3><div class="pf-pv" id="pf-pv"></div></section>' +
			'<section class="pf-box pf-card"><h3>Avancement</h3><div class="pf-prog"><b id="pf-pb" style="width:0"></b></div><ul class="pf-ck" id="pf-ck"></ul></section>' +
			'<section class="pf-box pf-card"><h3>Avant d’envoyer</h3><p class="pf-rules"><b>Un seul personnage</b> par joueur. <b>Élèves</b> : 18 ans minimum, Poudlard étant une université. <b>Contexte</b> : Grindelwald a vaincu Dumbledore, ton histoire doit en tenir compte.</p></section>' +
			'</aside></div></div>';
		box.innerHTML = html;
		function $(id) { return document.getElementById('pf-' + id); }
		var MUG = ['Moldu', 'Cracmol'], FN = [['', ''], ['Précision', 'Ex : Botanique, infirmerie nord…'], ['Précision', 'Ex : section des enquêtes, grade…'], ['Précision', 'Ex : Gazette du Sorcier, Pré-au-Lard…'], ['Précision', 'Ex : réseau, zone d’action…'], ['Précision', 'Ex : librairie du Londres moldu…']];
		function bl() { return S.fac === 5 ? MUG : BLOODS.slice(0, 3); }
		function applyFac() {
			var stu = S.fac === 0, house = S.fac <= 1;
			$('hwrap').style.display = house ? '' : 'none'; $('ywrap').style.display = stu ? '' : 'none'; $('fnwrap').style.display = stu ? 'none' : '';
			$('hlab').innerHTML = stu ? 'Maison <em>*</em>' : 'Maison <span style="text-transform:none;letter-spacing:0;font-weight:300">(facultatif)</span>';
			$('fnlab').innerHTML = FN[S.fac][0] || 'Précision'; $('fn').placeholder = FN[S.fac][1];
			$('rwrap').style.display = stu ? 'none' : ''; if (S.role >= ROLES[S.fac].length) { S.role = 0; }
			$('roles').innerHTML = ROLES[S.fac].map(function (r, i) { return '<button type="button" class="pf-pill' + (i === S.role ? ' on' : '') + '" data-i="' + i + '"><i></i>' + r + '</button>'; }).join('');
			$('ag').placeholder = stu ? '18 à 25 ans' : 'Son âge';
			var B = bl(); if (S.blood >= B.length) { S.blood = 0; }
			$('bloods').innerHTML = B.map(function (b, i) { return '<button type="button" class="pf-pill' + (i === S.blood ? ' on' : '') + '" data-i="' + i + '">' + b + '</button>'; }).join('');
			if (!house) { S.house = -1; } else if (S.house < 0 && stu) { S.house = 0; }
			Array.prototype.forEach.call(box.querySelectorAll('.pf-house'), function (x, i) { x.className = 'pf-house' + (i === S.house ? ' on' : ''); });
		}
		function v(id) { var e = $(id); return e ? e.value.replace(/^\s+|\s+$/g, '') : ''; }
		function words(s) { var m = s.match(/\S+/g); return m ? m.length : 0; }
		function fullName() { return (v('n') + ' ' + v('p')).replace(/^\s+|\s+$/g, ''); }
		function missing() {
			var m = [];
			if (!v('n') || !v('p')) { m.push('prénom et nom'); }
			if (!v('ag')) { m.push('âge'); }
			if (S.fac === 0 && S.house < 0) { m.push('maison'); }
			
			if (!v('f')) { m.push('faceclaim'); }
			if (!v('c')) { m.push('caractère'); }
			if (words(v('h')) < 400) { m.push('histoire (400 mots minimum)'); }
			if (!S.reg) { m.push('acceptation du règlement'); }
			return m;
		}
		function update() {
			var f = FACS[S.fac], h = HOUSES[S.house] || ['#d9b36a', '—'], nm = fullName() || 'Prénom Nom', al = v('a');
			var ini = ((v('n').charAt(0) || 'P') + (v('p').charAt(0) || 'N')).toUpperCase();
			$('pv').style.setProperty('--c', f[1]);
			var cr = (S.house >= 0 && S.fac <= 1) ? BASE + 'img/ecussons/' + h[1] + '.png' : BASE + 'img/ecussons/' + FCREST[S.fac];
			$('pv').innerHTML = '<img class="pf-wm2" src="' + cr + '" alt=""><div class="av"><i></i><b>' + esc(ini) + '</b></div><strong>' + esc(nm) + '</strong>' + (al ? '<small>« ' + esc(al) + ' »</small>' : '') +
				'<ul><span>Faction</span><li>' + f[0] + '</li>' + (S.house >= 0 ? '<span>Maison</span><li>' + h[0] + '</li>' : '') + (S.fac !== 0 ? '<span>Rôle</span><li>' + esc(ROLES[S.fac][S.role]) + '</li>' : '') + '<span>Sang</span><li>' + bl()[S.blood] + '</li><span>Statut</span><li>En attente de validation</li></ul>';
			var w = words(v('h')), wc = $('wc'); wc.textContent = w + ' / 400 mots'; wc.className = 'pf-wc' + (w >= 400 ? ' ok' : '');
			var ck = [[v('n') && v('p') && v('ag'), 'Identité renseignée'], [S.fac !== 0 || S.house >= 0, S.fac === 0 ? 'Faction et maison choisies' : 'Faction choisie'], [v('f'), 'Faceclaim ajouté'], [v('c'), 'Caractère décrit'], [w >= 400, 'Histoire de 400 mots minimum'], [S.reg, 'Règlement accepté']];
			var n = 0; $('ck').innerHTML = ck.map(function (c) { if (c[0]) { n++; } return '<li' + (c[0] ? ' class="ok"' : '') + '>' + c[1] + '</li>'; }).join('');
			$('pb').style.width = Math.round(n / ck.length * 100) + '%';
		}
		function line(k, val) { return val ? '[b]' + k + ' :[/b] ' + val + '\n' : ''; }
		function build() {
			var f = FACS[S.fac], h = HOUSES[S.house], c = f[1], t = '', sg = bl()[S.blood];
			t += '[center][size=30][b][color=' + c + ']' + fullName().toUpperCase() + '[/color][/b][/size]\n';
			if (v('a')) { t += '[i]« ' + v('a') + ' »[/i]\n'; }
			if (v('ci')) { t += '[size=15][i]“' + v('ci').replace(/\s*\n+\s*/g, ' ') + '”[/i][/size]\n'; }
			t += '[size=13][color=#a8a193]' + f[0] + (h ? ' · ' + h[0] : '') + ' · ' + sg + '[/color][/size]\n';
			if (v('u')) { t += '\n[img]' + v('u') + '[/img]\n'; }
			t += '[i]' + v('f') + '[/i][/center]\n\n';
			t += '[b][color=' + c + ']IDENTITÉ[/color][/b]\n';
			t += line('Prénom', v('n')) + line('Nom', v('p')) + line('Alias', v('a')) + line('Âge', v('ag')) + line('Naissance', v('b')) + line('Origine', v('o')) + line('Statut du sang', sg);
			t += '\n[b][color=' + c + ']ALLÉGEANCE ET RANG[/color][/b]\n';
			t += line('Faction', f[0]) + (h ? line('Maison', h[0]) : '') + (S.fac === 0 ? line('Année', v('y')) : line('Rôle', ROLES[S.fac][S.role]) + line('Précision', v('fn')) + line('Lieu de vie', v('lv'))) + line('Karma', v('k')) + line('Faceclaim', v('f'));
			if (v('ph')) { t += '\n[b][color=' + c + ']PHYSIQUE[/color][/b]\n' + v('ph') + '\n'; }
			t += '\n[b][color=' + c + ']CARACTÈRE[/color][/b]\n' + v('c') + '\n';
			if (v('m')) { t += '\n[b][color=' + c + ']MOTIVATION[/color][/b]\n' + v('m') + '\n'; }
			if (v('i2')) { t += '\n[b][color=' + c + ']ILLUSTRATION[/color][/b]\n[center][img]' + v('i2') + '[/img][/center]\n'; }
			t += '\n[spoiler="Histoire de ' + fullName() + '"]' + v('h') + '[/spoiler]\n';
			var d = (v('pr') ? line('Pseudo', v('pr')) : '') + line('Fréquence de jeu', v('fr')) + line('Découverte', v('co'));
			if (d) { t += '\n[b][color=' + c + ']DERRIÈRE LE PERSONNAGE[/color][/b]\n' + d; }
			return t.replace(/\n+$/, '') + '\n';
		}
		box.addEventListener('click', function (e) {
			var b = e.target.closest ? e.target.closest('button') : null; if (!b) { return; }
			var g = b.parentNode.getAttribute('data-g');
			if (g) {
				var iv = parseInt(b.getAttribute('data-i'), 10);
				if (g === 'house' && S.fac !== 0 && S.house === iv) { S.house = -1; } else { S[g] = iv; }
				if (g === 'fac') { S.role = 0; applyFac(); }
				{ Array.prototype.forEach.call(b.parentNode.children, function (x) { x.className = x.className.replace(/\bon\b/, '').replace(/\s+$/, ''); }); if (S[g] === iv) { b.className += ' on'; } }
				update(); return;
			}
			if (b.id === 'pf-i2btn') { var w = $('i2wrap'), op = w.style.display === 'none'; w.style.display = op ? '' : 'none'; b.className = 'pf-ico' + (op ? ' on' : ''); if (op) { $('i2').focus(); } return; }
			if (b.id === 'pf-reg') { S.reg = !S.reg; b.className = 'pf-pill' + (S.reg ? ' on' : ''); update(); return; }
			if (b.id === 'pf-go') { gen(); }
		});
		box.addEventListener('input', update);
		function gen() {
			var out = $('out'), m = missing(), code = build(), subject = fullName() + (v('f') ? ' | ' + v('f') : '') + ' | ' + FACS[S.fac][0];
			if (m.length) {
				out.style.display = 'block';
				out.innerHTML = '<div class="pf-err"><b>Il manque encore :</b> ' + m.join(', ') + '.<br>Tu peux quand même copier le code ci-dessous, mais le staff refusera une fiche incomplète.</div>';
			} else { out.style.display = 'block'; out.innerHTML = ''; }
			out.innerHTML += '<span class="pf-lab" style="margin-top:' + (m.length ? 16 : 0) + 'px">Ton code, prêt à coller</span><textarea id="pf-code" readonly></textarea>' +
				'<div class="pf-bar2"><button type="button" class="pf-btn" id="pf-copy">Copier le code</button><a class="pf-btn ghost" id="pf-open" href="/post?mode=newtopic&f=' + PRES_FORUM + '">Ouvrir l’éditeur avec ma fiche</a><span class="pf-ok" id="pf-msg"></span></div>' +
				'<p class="pf-hint">Titre conseillé : <b>' + esc(subject) + '</b></p>';
			$('code').value = code;
			$('copy').onclick = function () {
				var ta = $('code'); ta.select();
				var done = function () { $('msg').textContent = 'Code copié.'; };
				if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(code).then(done, function () { try { document.execCommand('copy'); done(); } catch (e) { } }); } else { try { document.execCommand('copy'); done(); } catch (e) { } }
			};
			$('open').onclick = function () { try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), body: code, subject: subject })); } catch (e) { } };
			out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
		applyFac(); update();
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();

/* ===== REVELIO : fiche de présentation postée (met en page le code généré) ===== */
(function () {
	var HOUSES = { 'gryffondor': ['#d65a6b', 'Gryffondor'], 'serdaigle': ['#6fb0cf', 'Serdaigle'], 'serpentard': ['#5fc4a0', 'Serpentard'], 'poufsouffle': ['#d9b650', 'Poufsouffle'] };
	var HEADS = ['IDENTITÉ', 'ALLÉGEANCE ET RANG', 'PHYSIQUE', 'CARACTÈRE', 'MOTIVATION', 'ILLUSTRATION', 'DERRIÈRE LE PERSONNAGE'];
	function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
	function plain(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; }
	function paras(t) { return t.split(/\n\s*\n/).map(function (p) { return p.replace(/^\s+|\s+$/g, ''); }).filter(Boolean).map(function (p) { return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>'; }).join(''); }
	function words(s) { var m = s.match(/\S+/g); return m ? m.length : 0; }
	function run() {
		var main = document.getElementById('main-content');
		if (!main || main.querySelector('.rv-fiche')) { return; }
		var cs = main.querySelectorAll('.postbody .content, .post .content'), c = null, i;
		for (i = 0; i < cs.length; i++) { var tx = cs[i].textContent; if (tx.indexOf('IDENTITÉ') > -1 && tx.indexOf('ALLÉGEANCE ET RANG') > -1) { c = cs[i]; break; } }
		if (!c) { return; }
		var post = c.closest('.post') || c.parentNode;
		var clone = c.cloneNode(true), img = null, sp = clone.querySelector('dl.codebox.spoiler, dl.spoiler'), hist = '';
		var img2 = null, idEl = null;
		Array.prototype.forEach.call(clone.querySelectorAll('strong, b'), function (st) { if (!idEl && st.textContent.replace(/\s+/g, '').toUpperCase() === 'IDENTITÉ') { idEl = st; } });
		Array.prototype.forEach.call(clone.querySelectorAll('img'), function (im) {
			if (/smil|emoticon|icon_/i.test(im.getAttribute('src') || '') || im.closest('dl')) { return; }
			var after = idEl && (idEl.compareDocumentPosition(im) & 4);
			if (after) { if (!img2) { img2 = im.getAttribute('src'); } } else if (!img) { img = im.getAttribute('src'); }
		});
		if (sp) { var sc2 = sp.querySelector('.spoiler_content'); hist = sc2 ? sc2.innerHTML.replace(/<br\s*\/?>/gi, '\n') : ''; hist = plain(hist); sp.parentNode.removeChild(sp); }
		Array.prototype.forEach.call(clone.querySelectorAll('img,script,style'), function (n) { n.parentNode.removeChild(n); });
		var lines = plain(clone.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(div|p|li)>/gi, '\n')).replace(/ /g, ' ').split('\n').map(function (l) { return l.replace(/^\s+|\s+$/g, ''); });
		var idx = -1; for (i = 0; i < lines.length; i++) { if (lines[i].toUpperCase() === 'IDENTITÉ') { idx = i; break; } }
		if (idx < 0) { return; }
		var head = lines.slice(0, idx).filter(Boolean), cit = '', alias = '', tags = '', fc = '', nm = head[0] || '';
		head.slice(1).forEach(function (h) { if (h.charAt(0) === '“' || h.charAt(0) === '"') { cit = h.replace(/^[“"]\s*/, '').replace(/\s*[”"]$/, ''); } else if (h.charAt(0) === '«') { alias = h.replace(/^«\s*/, '').replace(/\s*»$/, ''); } else if (h.indexOf(' · ') > -1) { tags = h; } else { fc = h; } });
		var S = {}, cur = null, buf = [];
		function flush() { if (cur) { S[cur] = buf.slice(); } buf = []; }
		for (i = idx; i < lines.length; i++) { var up = lines[i].toUpperCase(); if (HEADS.indexOf(up) > -1) { flush(); cur = up; } else { buf.push(lines[i]); } }
		flush();
		function kv(sec) { var o = {}; (S[sec] || []).forEach(function (l) { var m = /^([^:]+?)\s*:\s*(.*)$/.exec(l); if (m) { o[m[1]] = m[2]; } }); return o; }
		var id = kv('IDENTITÉ'), al = kv('ALLÉGEANCE ET RANG'), me = kv('DERRIÈRE LE PERSONNAGE');
		function txt(sec) { return (S[sec] || []).join('\n').replace(/^\s+|\s+$/g, ''); }
		var first = id['Prénom'] || nm.split(' ')[0] || '', last = id['Nom'] || nm.split(' ').slice(1).join(' ');
		var FCOL = { 'élève de poudlard': '#d9b36a', 'personnel de poudlard': '#c98a52', 'ministère': '#8f94e0', 'sorcier': '#8fb0d8', 'mage noir': '#aeb6c2', 'sans pouvoirs magiques': '#FFA57D' };
		var FCR = { 'élève de poudlard': 'Poudlard-4-maisons.png', 'personnel de poudlard': 'Poudlard-4-maisons.png', 'ministère': 'Ministere-de-la-Magie.png', 'sorcier': 'sor.png', 'mage noir': 'mag.png', 'sans pouvoirs magiques': 'mol.png' };
		var hk = (al['Maison'] || '').toLowerCase(), H = HOUSES[hk.normalize ? hk.normalize('NFD').replace(/[̀-ͯ]/g, '') : hk] || [FCOL[(al['Faction'] || '').toLowerCase()] || '#d9b36a', al['Maison'] || ''];
		var base = 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@main/', sc = document.querySelector('script[src*="revelio.js"]');
		if (sc) { base = sc.getAttribute('src').replace(/revelio\.js.*$/, ''); }
		var fk = (al['Faction'] || '').toLowerCase(), crest = HOUSES[hk.normalize ? hk.normalize('NFD').replace(/[̀-ͯ]/g, '') : hk] ? base + 'img/ecussons/' + H[1] + '.png' : (FCR[fk] ? base + 'img/ecussons/' + FCR[fk] : '');
		var path = (document.querySelector('.sub-header-path') || { textContent: '' }).textContent;
		var ST = /Valid/i.test(path) ? ['Validée', '#8cc7a0', 'M5 12l5 5L20 7', 'Bienvenue à Poudlard. Ce personnage est répertorié dans le Registre des sorciers.']
			: /Refus/i.test(path) ? ['Refusée', '#e08a8a', 'M12 8v5M12 17h.01M12 3l10 18H2z', 'Cette fiche n’a pas été retenue. Le staff explique pourquoi dans les réponses.']
			: /Abandon/i.test(path) ? ['Abandonnée', '#8f8878', 'M6 6l12 12M18 6L6 18', 'Cette fiche n’est plus suivie par son joueur.']
			: ['En attente', '#d9b36a', 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', 'Cette fiche attend la relecture d’un membre du staff.'];
		var tg = []; if (al['Faction']) { tg.push('<span class="pp-tag c">' + esc(al['Faction']) + '</span>'); } if (al['Rôle']) { tg.push('<span class="pp-tag c">' + esc(al['Rôle']) + '</span>'); } if (al['Maison']) { tg.push('<span class="pp-tag c">' + esc(al['Maison']) + '</span>'); } if (id['Statut du sang']) { tg.push('<span class="pp-tag">' + esc(id['Statut du sang']) + '</span>'); } if (id['Âge']) { tg.push('<span class="pp-tag">' + esc(id['Âge']) + '</span>'); }
		var facts = [['Âge', id['Âge']], ['Naissance', id['Naissance']], ['Origine', id['Origine']], ['Statut du sang', id['Statut du sang']], ['Faction', al['Faction']], ['Maison', al['Maison']], ['Année', al['Année']], ['Rôle', al['Rôle']], ['Fonction', al['Fonction']], ['Précision', al['Précision']], ['Lieu de vie', al['Lieu de vie']], ['Karma', al['Karma']]].filter(function (f) { return f[1]; });
		var mot = txt('MOTIVATION'), phy = txt('PHYSIQUE'), car = txt('CARACTÈRE');
		var author = post.querySelector('.postprofile .author a, .postprofile dt a, a.username, .postprofile a[href^="/u"]');
		var edit = post.querySelector('a[href*="mode=editpost"]'), quote = post.querySelector('a[href*="mode=quote"]');
		var h = '<article class="pp-card" style="--c:' + H[0] + '">' + (crest ? '<img class="pp-wm" src="' + esc(crest) + '" alt="">' : '') + '<div class="pp-stat" style="--s:' + ST[1] + '" title="' + esc(ST[3]) + '"><div class="ic"><svg viewBox="0 0 24 24"><path d="' + ST[2] + '"/></svg></div><div><small>Décision du staff</small><strong>' + ST[0] + '</strong></div></div>' +
			'<header class="pp-hero"><div class="pp-por">' + (img ? '<img src="' + esc(img) + '" alt="">' : '<span class="ini">' + esc(((first || ' ').charAt(0) + (last || ' ').charAt(0)).toUpperCase()) + '</span>') + '<i></i><i></i>' + (fc ? '<em>' + esc(fc) + '</em>' : '') + '</div>' +
			'<div class="pp-id"><div class="pp-tags">' + tg.join('') + '</div><h2 class="pp-name"><span>' + esc(first) + '</span>' + esc(last) + '</h2>' + (alias ? '<p class="pp-alias"><small>Alias</small>' + esc(alias) + '</p>' : '') +
			(mot ? '<div class="pp-quote"><small>Motivation</small>' + esc(mot) + '</div>' : '') + '</div></header>' +
			(cit ? '<div class="pp-cit"><p>' + esc(cit) + '</p><footer>' + esc((first + ' ' + last).replace(/^\s+|\s+$/g, '')) + '</footer></div>' : '') +
			(facts.length ? '<div class="pp-facts">' + facts.map(function (f) { return '<div><span>' + f[0] + '</span><b>' + esc(f[1]) + '</b></div>'; }).join('') + '</div>' : '') +
			((phy || car) ? '<div class="pp-sec"><div class="pp-two">' + (phy ? '<div><h3 class="pp-h">Physique</h3><div class="pp-tx">' + paras(phy) + '</div></div>' : '') + (car ? '<div><h3 class="pp-h">Caractère</h3><div class="pp-tx">' + paras(car) + '</div></div>' : '') + '</div></div>' : '') +
			(hist ? '<div class="pp-sec"><h3 class="pp-h">Histoire</h3>' + '<div class="pp-hist' + (img2 ? ' has' : '') + '">' + (img2 ? '<figure class="pp-ill"><img src="' + esc(img2) + '" alt=""></figure>' : '') + '<div class="pp-spo"><button type="button" class="pp-spt" aria-expanded="false"><i class="d"></i><b>Spoiler</b><em>Histoire de ' + esc((first + ' ' + last).replace(/^\s+|\s+$/g, '')) + '</em><span>' + words(hist) + ' mots · cliquer pour lire</span></button><div class="pp-spb" style="display:none"><div class="pp-tx">' + paras(hist) + '</div><button type="button" class="pp-btn pp-close" style="margin-top:20px">Fermer le spoiler</button></div></div></div></div>' : '') +
			(Object.keys(me).length ? '<div class="pp-sec"><h3 class="pp-h">Derrière le personnage</h3><div class="pp-me">' + Object.keys(me).map(function (k) { return '<div><span>' + esc(k) + '</span><b>' + esc(me[k]) + '</b></div>'; }).join('') + '</div></div>' : '') +
			'<footer class="pp-act"><span class="sp"></span>' + (quote ? '<a class="pp-btn" href="' + esc(quote.getAttribute('href')) + '">Citer</a>' : '') + (edit ? '<a class="pp-btn g" href="' + esc(edit.getAttribute('href')) + '">Modifier</a>' : '') + '</footer></article>';
		var wrap = document.createElement('div'); wrap.className = 'rv-fiche'; wrap.innerHTML = '<div class="pp-main">' + h + '</div>';
		post.parentNode.insertBefore(wrap, post); post.style.display = 'none'; document.body.className += ' rv-fp';
		wrap.addEventListener('click', function (e) {
			var b = e.target.closest ? e.target.closest('button') : null; if (!b) { return; }
			var spo = wrap.querySelector('.pp-spo'); if (!spo) { return; }
			if (b.className.indexOf('pp-spt') > -1 || b.className.indexOf('pp-close') > -1) {
				var body = spo.querySelector('.pp-spb'), open = body.style.display === 'none';
				body.style.display = open ? 'block' : 'none'; spo.querySelector('.pp-spt').setAttribute('aria-expanded', open ? 'true' : 'false');
				var s = spo.querySelector('.pp-spt span'); if (s) { s.textContent = words(hist) + (open ? ' mots · ouvert' : ' mots · cliquer pour lire'); }
			}
		});
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 50); }); } else { setTimeout(run, 50); }
})();

/* REVELIO — carrousel d'accueil */
(function () {
  function init() {
    var R = document.querySelector('.rvc'); if (!R || R.__rvc) { return; } R.__rvc = 1;
    var S = R.querySelectorAll('.rvc-sl'), T = R.querySelectorAll('.rvc-tab'), N = S.length, cur = 0, prog = 0, paused = false, hover = false;
    try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { paused = true; } } catch (e) {}
    var btnP = R.querySelector('[data-rvc=pause]'), stage = R.querySelector('.rvc-stage'), roll = R.querySelector('.rvc-ht');
    function paint() {
      for (var i = 0; i < N; i++) {
        var on = i === cur; S[i].classList.toggle('on', on); S[i].setAttribute('aria-hidden', on ? 'false' : 'true');
        S[i].style.opacity = on ? 1 : 0; S[i].style.visibility = on ? 'visible' : 'hidden';
        T[i].classList.toggle('on', on); T[i].setAttribute('aria-current', on ? 'true' : 'false');
        T[i].querySelector('b').style.width = on ? Math.round(prog) + '%' : (i < cur ? '100%' : '0%');
      }
    }
    function go(i) { cur = (i + N) % N; prog = 0; paint(); }
    function state() {
      if (roll) { roll.style.animationPlayState = hover ? 'paused' : 'running'; }
      stage.querySelector('.rvc-slides').setAttribute('aria-live', (paused || hover) ? 'polite' : 'off');
      btnP.setAttribute('aria-label', paused ? 'Reprendre le défilement' : 'Mettre le défilement en pause'); btnP.title = btnP.getAttribute('aria-label');
      btnP.querySelector('.ic-p').style.display = paused ? 'none' : ''; btnP.querySelector('.ic-g').style.display = paused ? '' : 'none';
    }
    for (var k = 0; k < T.length; k++) { (function (j) { T[j].addEventListener('click', function () { go(j); }); })(k); }
    R.querySelector('[data-rvc=prev]').addEventListener('click', function () { go(cur - 1); });
    R.querySelector('[data-rvc=next]').addEventListener('click', function () { go(cur + 1); });
    btnP.addEventListener('click', function () { paused = !paused; state(); });
    stage.addEventListener('mouseenter', function () { hover = true; state(); }); stage.addEventListener('mouseleave', function () { hover = false; state(); });
    stage.addEventListener('focusin', function () { hover = true; state(); }); stage.addEventListener('focusout', function () { hover = false; state(); });
    setInterval(function () { if (hover || paused || document.hidden) { return; } prog += 100 / 80; if (prog >= 100) { go(cur + 1); } else { paint(); } }, 100);
    // personnage connecté
    try {
      var u = window._userdata || {}, nm = u.username || '', logged = u.session_logged_in === 1 || u.session_logged_in === '1';
      var f = R.querySelector('[data-rvc=first]'), l = R.querySelector('[data-rvc=last]'), av = R.querySelector('[data-rvc=avatar]');
      if (logged && nm && f && l) { var p = String(nm).split(/\s+/); f.textContent = p.shift(); l.textContent = p.join(' '); if (!p.length) { l.textContent = ''; } }
      if (av) { var src = (u.avatar && /src="([^"]+)"/.exec(u.avatar)); src = src ? src[1] : (/^https?:/.test(u.avatar || '') ? u.avatar : ''); if (src) { av.src = src; } else { av.parentNode.style.display = 'none'; } }
    } catch (x) {}
    paint(); state();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

/* REVELIO — carrousel : derniers hiboux */
(function () {
  function go() {
    var T = document.querySelector('.rvc-ht'); if (!T || T.__rvh) { return; } T.__rvh = 1;
    function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    var ICO = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" style="position:absolute;left:12px;top:12px;color:#a88a4c"><circle cx="12" cy="9" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>';
    var xhr = new XMLHttpRequest(); xhr.open('GET', '/search?search_id=newposts'); xhr.onload = function () {
      try {
        var doc = new DOMParser().parseFromString(xhr.responseText, 'text/html'), A = doc.querySelectorAll('a.topictitle'), out = [], seen = {};
        for (var i = 0; i < A.length && out.length < 4; i++) {
          var a = A[i], href = a.getAttribute('href'); if (seen[href]) { continue; } seen[href] = 1;
          var row = a.closest('li.row, tr, dl.row-item, .topic-row') || a.parentNode.parentNode, lp = row.querySelector('.lastpost, dd.lastpost, .topic-lastpost') || row;
          var who = lp.querySelector('a[href^="/u"], a.username, a.username-coloured'), forum = row.querySelector('a[href^="/f"]:not(.topictitle)');
          var cnt = row.querySelector('.posts, dd.posts, .topic-posts'), when = (lp.textContent || '').replace(/\s+/g, ' ').match(/(Aujourd'hui[^\d]*\d{1,2}:\d{2}|Hier[^\d]*\d{1,2}:\d{2}|\d{1,2} \S+ \d{4}[^\d]*\d{1,2}:\d{2}|\w+ \d{1,2} \w+ \d{4})/i);
          out.push({ t: a.textContent.trim(), h: href, by: who ? who.textContent.trim() : '', w: when ? when[1].replace(/\s+/g, ' ') : '', f: forum ? forum.textContent.trim() : '', n: cnt ? (parseInt(cnt.textContent, 10) || 0) + ' msg' : '' });
        }
        if (!out.length) { return; }
        while (out.length < 4) { out.push(out[out.length % Math.max(1, out.length)]); }
        var h = ''; for (var k = 0; k < 8; k++) { var o = out[k % 4]; h += '<div class="rvc-hi" style="--r:#a88a4c"><div class="rvc-av"><i></i>' + ICO + '</div><div style="min-width:0"><a href="' + esc(o.h) + '">' + esc(o.t) + '</a><small><b>' + esc(o.by) + '</b>' + (o.w ? ' · ' + esc(o.w) : '') + (o.f ? ' · ' + esc(o.f) : '') + '</small></div><span class="n">' + esc(o.n) + '</span></div>'; }
        T.innerHTML = h;
      } catch (e) {}
    };
    xhr.send();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', go); } else { go(); }
})();

/* ===== REVELIO : générateur de journal (page HTML contenant <div id="rv-jr"></div>) ===== */
(function () {
	var JR_FORUM = 15;               /* id du forum « Le Carnet des relations » où se postent les journaux */
	var KEY = 'rv_jr_draft', FKEY = 'rv_jr_form';
	var AFF = [['Amour', '#d65a6b'], ['Amitié', '#8cc7a0'], ['Neutre', '#a8a193'], ['Rivalité', '#e0975f'], ['Ennemi', '#b79be0']];
	var BLOODS = ['Sang-pur', 'Sang-mêlé', 'Né-moldu', 'Cracmol'];
	var HOUSES = [['Gryffondor', '#d65a6b'], ['Serdaigle', '#6fb0cf'], ['Serpentard', '#5fc4a0'], ['Poufsouffle', '#d9b650']];
	var BASE = 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@main/';
	(function () { var q = document.querySelector('script[src*="revelio.js"]'); if (q) { BASE = q.getAttribute('src').replace(/revelio\.js.*$/, ''); } })();
	function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
	function trim(s) { return String(s == null ? '' : s).replace(/^\s+|\s+$/g, ''); }
	function one(s) { return trim(s).replace(/\s*\n+\s*/g, ' '); }
	function words(s) { var m = String(s).match(/\S+/g); return m ? m.length : 0; }

	/* --- côté éditeur : pré-remplit le message depuis le générateur --- */
	function fillEditor() {
		var raw; try { raw = localStorage.getItem(KEY); } catch (e) { return; }
		if (!raw) { return; }
		var d; try { d = JSON.parse(raw); } catch (e) { return; }
		var ta = document.querySelector('textarea[name=message]'), sj = document.querySelector('input[name=subject]');
		if (!ta || !d || (Date.now() - d.t) > 3600000) { return; }
		ta.value = d.body; if (sj && !sj.value) { sj.value = d.subject; }
		try { ta.dispatchEvent(new Event('input', { bubbles: true })); localStorage.removeItem(KEY); } catch (e) { }
	}
	if (/mode=newtopic/.test(location.search) || /\/post/.test(location.pathname)) {
		if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fillEditor); } else { fillEditor(); }
	}

	function run() {
		var box = document.getElementById('rv-jr');
		if (!box || box.getAttribute('data-ok')) { return; }
		box.setAttribute('data-ok', '1');

		/* ---------- briques de formulaire ---------- */
		function attr(k, card) { return card ? 'data-k="' + k + '"' : 'id="jg-' + k + '"'; }
		function field(k, lab, ph, req, card) { return '<div><label class="pf-lab">' + lab + (req ? ' <em>*</em>' : '') + '</label><input ' + attr(k, card) + ' class="pf-in" type="text" placeholder="' + esc(ph || '') + '"></div>'; }
		function area(k, lab, ph, req, card, cls) { return '<div><label class="pf-lab">' + lab + (req ? ' <em>*</em>' : '') + '</label><textarea ' + attr(k, card) + ' class="pf-in pf-ta' + (cls ? ' ' + cls : '') + '" placeholder="' + esc(ph || '') + '"></textarea></div>'; }
		function pills(k, list, on, opt) { return '<div class="pf-pills" data-g="' + k + '"' + (opt ? ' data-opt="1"' : '') + '>' + list.map(function (o, i) { var lb = typeof o === 'string' ? o : o[0], c = typeof o === 'string' ? '' : ' style="--c:' + o[1] + '"'; return '<button type="button" class="pf-pill' + (i === on ? ' on' : '') + '"' + c + ' data-i="' + i + '"><i></i>' + lb + '</button>'; }).join('') + '</div>'; }
		function sec(n, t, sub, inner) { return '<div class="pf-sec"><h2 class="pf-h"><i><b>' + n + '</b></i>' + t + '</h2><p class="pf-sub">' + sub + '</p>' + inner + '</div>'; }
		var G = ' pf-gap';

		/* ---------- modèles de cartes répétables ---------- */
		var TPL = {
			pres: function () {
				return '<div class="jg-hd"><b>Lien recherché</b><button type="button" class="jg-x" data-del="1" aria-label="Retirer">Retirer</button></div>' +
					'<div class="pf-row">' + field('n', 'Prénom', 'Dorian', 1, 1) + field('p', 'Nom', 'Gaunt', 1, 1) + '</div>' +
					'<div class="pf-gap"><span class="pf-lab">Nature du lien <em>*</em></span>' + pills('nat', AFF, 3) + '</div>' +
					'<div class="pf-row pf-gap">' + field('rel', 'Relation', 'Ex : Frère aîné', 1, 1) + '<div><span class="pf-lab">Disponibilité</span>' + pills('dispo', ['Disponible', 'Réservé'], 0) + '</div></div>' +
					'<div class="pf-row3 pf-gap">' + field('ag', 'Âge', '22 ans', 0, 1) + field('mai', 'Maison', 'Serpentard (ancien)', 0, 1) + field('sg', 'Statut du sang', 'Sang-pur', 0, 1) + '</div>' +
					'<div class="pf-gap">' + field('fc', 'Faceclaim', 'Laisse vide pour « faceclaim libre »', 0, 1) + '</div>' +
					'<div class="pf-gap">' + area('st', 'Ce qui les lie', 'Leur histoire commune, ce que le futur joueur doit savoir pour incarner ce personnage. Environ 400 mots.', 1, 1, 'tall') + '<p class="pf-wc" data-wc="st">0 mot</p></div>' +
					'<div class="pf-gap">' + area('ot', 'Autres liens de ce personnage', 'Un par ligne : Nom | relation   (ex : Corvus Black | Ancien meilleur ami)   Écris « À définir | … » pour un lien encore libre.', 0, 1) + '</div>' +
					'<div class="pf-row pf-gap">' + field('rt', 'Scène d’ouverture : titre', 'La lettre restée sans réponse', 0, 1) + field('rd', 'Date de la scène', 'À situer, hiver 1996', 0, 1) + '</div>' +
					'<div class="pf-gap">' + area('rx', 'Scène d’ouverture : résumé', 'En une ou deux phrases, comment la scène commence.', 0, 1) + '</div>';
			},
			seeks: function () {
				return '<div class="jg-hd"><b>Autre recherche</b><button type="button" class="jg-x" data-del="1" aria-label="Retirer">Retirer</button></div>' +
					'<div><span class="pf-lab">Nature du lien</span>' + pills('nat', AFF, 1) + '</div>' +
					'<div class="pf-gap">' + field('d', 'Ce que tu cherches', 'Un rival de duel, pour se mesurer.', 1, 1) + '</div>';
			},
			links: function () {
				return '<div class="jg-hd"><b>Lien</b><button type="button" class="jg-x" data-del="1" aria-label="Retirer">Retirer</button></div>' +
					'<div class="pf-row">' + field('n', 'Prénom', 'Leta', 1, 1) + field('p', 'Nom', 'Lestrange', 1, 1) + '</div>' +
					'<div class="pf-gap"><span class="pf-lab">Nature du lien <em>*</em></span>' + pills('nat', AFF, 0) + '</div>' +
					'<div class="pf-row pf-gap">' + field('rel', 'Relation', 'Ex : Fiancée, Mentor, Camarade', 1, 1) + '<div><span class="pf-lab">Statut</span>' + pills('ok', ['Lien établi', 'En attente'], 0) + '</div></div>' +
					'<div class="pf-gap"><span class="pf-lab">Profondeur du lien</span>' + pills('dp', ['0', '1', '2', '3', '4', '5'], 3) + '</div>' +
					'<div class="pf-row pf-gap">' + field('fc', 'Faceclaim', 'Nom de l’acteur ou de l’actrice', 0, 1) + field('im', 'Lien de l’image', 'https://…', 0, 1) + '</div>' +
					'<div class="pf-row3 pf-gap">' + field('sg', 'Statut du sang', 'Sang-pur', 0, 1) + field('si', 'Première rencontre', 'Leurs 10 ans', 0, 1) + field('li', 'Lieu', 'Poudlard', 0, 1) + '</div>' +
					'<div class="pf-gap">' + area('st', 'Leur histoire', 'Comment ils se sont connus, où en est le lien. Si le texte dépasse 110 mots, un bouton « Lire la suite » est ajouté. Si tu préfères une simple citation, écris-la ici (une seule phrase).', 1, 1, 'tall') + '<p class="pf-wc" data-wc="st">0 mot</p></div>' +
					'<div class="pf-gap">' + area('sc', 'Scènes jouées ensemble', 'Une par ligne : Titre | date | résumé | lien du sujet | terminé (facultatif)   (ex : La promesse des dix ans | 14 octobre 1986 | Deux enfants, deux familles… | /t12-la-promesse | terminé)', 0, 1) + '</div>';
			}
		};

		/* ---------- page ---------- */
		var html = '<div class="pf-root"><div class="pf-head" style="background-image:linear-gradient(180deg,rgba(11,10,8,.55),rgba(11,10,8,.92)),url(' + BASE + 'img/lieux/bibliotheque.jpg)"><span class="pf-eye">Le journal</span><h1>Mon <em>journal</em></h1><p class="pf-tag">Ton personnage, ses liens et ceux qu’il cherche, réunis dans un seul carnet.</p></div><div class="pf-main"><form class="pf-box" onsubmit="return false">' +
			sec('I', 'Le détenteur du journal', 'L’identité de ton personnage, telle qu’elle apparaît en tête du journal.',
				'<div class="pf-row3">' + field('n', 'Prénom', 'Elijah', 1) + field('p', 'Nom', 'Gaunt', 1) + field('a', 'Alias', 'Le Corbeau') + '</div>' +
				'<div class="pf-row3 pf-gap">' + field('ag', 'Âge', '17 ans', 1) + field('yf', 'Année ou fonction', '6e année, ou Professeur de Potions') + field('bn', 'Naissance', 'le 14 octobre 1996') + '</div>' +
				'<div class="pf-row3 pf-gap">' + field('or', 'Origine', 'Britannique') + field('sx', 'Orientation', 'Bisexuel') + '<div></div></div>' +
				'<div class="pf-gap"><span class="pf-lab">Statut du sang <em>*</em></span>' + pills('blood', BLOODS, 0) + '</div>' +
				'<div class="pf-gap"><span class="pf-lab">Maison <span style="text-transform:none;letter-spacing:0;font-weight:300">(facultatif)</span></span>' + pills('house', HOUSES, -1, 1) + '</div>' +
				'<div class="pf-row pf-gap">' + field('f', 'Faceclaim', 'Nom de l’acteur ou de l’actrice', 1) + field('u', 'Lien du portrait', 'https://… (format portrait, 3:4)') + '</div>' +
				'<div class="pf-gap pf-cit"><label class="pf-lab">Citation</label><textarea id="jg-ci" class="pf-in pf-ta" placeholder="Une phrase qui ouvre le journal…"></textarea><p class="pf-hint">Facultatif.</p></div>') +
			sec('II', 'Résumé', 'Quelques lignes pour présenter le personnage, puis ce qu’il faut savoir sur le joueur.',
				area('sm', 'Résumé du personnage', 'Arrivé à Poudlard en septembre 1996, Elijah passe ses soirées à la bibliothèque…', 1) +
				'<div class="pf-gap">' + area('nt', 'Note du joueur', 'Un mot pour ceux qui voudraient te proposer un lien.') + '</div>' +
				'<div class="pf-row pf-gap">' + field('rt', 'Rythme de réponse', 'Un à trois jours') + field('sj', 'Style de jeu', 'Narratif, deux paragraphes') + '</div>' +
				'<div class="pf-row pf-gap">' + field('lf', 'Lieux favoris', 'Bibliothèque, Serre 3') + field('ct', 'Contact', 'Hibou ou Beuglante') + '</div>' +
				'<div class="pf-gap"><span class="pf-lab">Ouvert aux liens ?</span>' + pills('open', ['Ouvert', 'Fermé'], 0) + '</div>') +
			sec('III', 'Physique et mental', 'Deux colonnes dans le journal : un court paragraphe et quelques traits pour chacune.',
				'<div class="pf-row">' + '<div>' + area('ph', 'Physique', 'Taille, silhouette, signes distinctifs…') + '<div class="pf-gap">' + field('pt', 'Traits du physique', '1m83, Cheveux noirs, Yeux gris') + '</div></div>' +
				'<div>' + area('me', 'Mental', 'Qualités, défauts, peurs, manies…') + '<div class="pf-gap">' + field('mt', 'Traits du mental', 'Réservé, Curieux, Têtu') + '</div></div></div><p class="pf-hint">Les traits se séparent par des virgules (4 conseillés par colonne).</p>') +
			sec('IV', 'Liens établis', 'Les personnages avec qui le tien est déjà lié, ou en passe de l’être. Une carte par lien.',
				'<div class="jg-list" data-t="links"></div><button type="button" class="pf-btn ghost jg-add" data-add="links">+ Ajouter un lien</button>') +
			sec('V', 'Liens recherchés', 'Un personnage précis dont tu as déjà l’histoire : un frère, un rival, un ancien amour. Le futur joueur la lira avant de te proposer le lien.',
				'<div class="jg-list" data-t="pres"></div><button type="button" class="pf-btn ghost jg-add" data-add="pres">+ Ajouter un lien recherché</button>') +
			sec('VI', 'Autres recherches', 'Ce que tu cherches sans personnage précis : un rival, un ami, un secret partagé.',
				'<div class="jg-list" data-t="seeks"></div><button type="button" class="pf-btn ghost jg-add" data-add="seeks">+ Ajouter une recherche</button>') +
			'<div class="pf-acts"><p>Le générateur écrit ton journal : tu récupères le code prêt à coller, ou tu l’envoies directement dans l’éditeur.<br><span class="jg-draft" id="jg-draft">Brouillon enregistré automatiquement sur cet appareil.</span> <button type="button" class="jg-clr" id="jg-clr">Effacer le brouillon</button></p><div><button type="button" class="pf-btn" id="jg-go">Générer mon journal</button></div></div>' +
			'<div class="pf-out" id="jg-out" style="display:none"></div>' +
			'</form><aside class="pf-side">' +
			'<section class="pf-box pf-card"><h3>Aperçu</h3><div class="pf-pv" id="jg-pv"></div></section>' +
			'<section class="pf-box pf-card"><h3>Avancement</h3><div class="pf-prog"><b id="jg-pb" style="width:0"></b></div><ul class="pf-ck" id="jg-ck"></ul></section>' +
			'<section class="pf-box pf-card"><h3>Avant d’envoyer</h3><p class="pf-rules"><b>Un seul journal</b> par personnage. Les liens établis sont ceux qui existent déjà en RP, les liens recherchés ceux que tu proposes aux autres joueurs. <b>Tu peux modifier ton journal à tout moment</b> : relance le générateur et remplace le texte du message.</p></section>' +
			'</aside></div></div>';
		box.innerHTML = html;

		/* ---------- accès aux valeurs ---------- */
		function $(id) { return document.getElementById('jg-' + id); }
		function v(k) { var e = $(k); return e ? trim(e.value) : ''; }
		function gi(g) { var b = g.querySelectorAll('.pf-pill'), i; for (i = 0; i < b.length; i++) { if (/\bon\b/.test(b[i].className)) { return i; } } return -1; }
		function gv(scope, k, list) { var g = scope.querySelector('[data-g="' + k + '"]'), i = g ? gi(g) : -1; if (i < 0) { return ''; } var o = list[i]; return typeof o === 'string' ? o : o[0]; }
		function cards(t) { return Array.prototype.slice.call(box.querySelectorAll('.jg-list[data-t="' + t + '"] .jg-card')); }
		function cv(card, k) { var e = card.querySelector('[data-k="' + k + '"]'); return e ? trim(e.value) : ''; }
		function addCard(t, d) {
			var list = box.querySelector('.jg-list[data-t="' + t + '"]'), c = document.createElement('div');
			c.className = 'jg-card'; c.innerHTML = TPL[t]();
			list.appendChild(c);
			if (d) {
				Array.prototype.forEach.call(c.querySelectorAll('[data-k]'), function (e) { var k = e.getAttribute('data-k'); if (d.f && d.f[k] != null) { e.value = d.f[k]; } });
				if (d.g) { Array.prototype.forEach.call(c.querySelectorAll('[data-g]'), function (g) { var k = g.getAttribute('data-g'), b = g.querySelectorAll('.pf-pill'); if (d.g[k] != null) { Array.prototype.forEach.call(b, function (x, i) { x.className = 'pf-pill' + (i === d.g[k] ? ' on' : ''); }); } }); }
			}
			return c;
		}
		function ttl(c) { var t = c.getAttribute('data-t') || c.parentNode.getAttribute('data-t'); return t; }

		/* ---------- brouillon ---------- */
		function snap() {
			var d = { f: {}, g: {}, L: { links: [], pres: [], seeks: [] } };
			Array.prototype.forEach.call(box.querySelectorAll('[id^="jg-"]'), function (e) { if ((e.tagName === 'INPUT' || e.tagName === 'TEXTAREA') && e.id !== 'jg-code') { d.f[e.id.slice(3)] = e.value; } });
			Array.prototype.forEach.call(box.querySelectorAll('.pf-pills[data-g]'), function (g) { if (!g.closest('.jg-card')) { d.g[g.getAttribute('data-g')] = gi(g); } });
			['links', 'pres', 'seeks'].forEach(function (t) {
				cards(t).forEach(function (c) { var o = { f: {}, g: {} }; Array.prototype.forEach.call(c.querySelectorAll('[data-k]'), function (e) { o.f[e.getAttribute('data-k')] = e.value; }); Array.prototype.forEach.call(c.querySelectorAll('[data-g]'), function (g) { o.g[g.getAttribute('data-g')] = gi(g); }); d.L[t].push(o); });
			});
			return d;
		}
		var saveT = null;
		function stamp(t) { var e = $('draft'); if (e) { e.textContent = t; } }
		function save() { clearTimeout(saveT); saveT = setTimeout(function () { try { localStorage.setItem(FKEY, JSON.stringify(snap())); var d = new Date(); stamp('Brouillon enregistré à ' + (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + '.'); } catch (e) { stamp('Brouillon non enregistré (stockage du navigateur indisponible).'); } }, 400); }
		function restore() {
			var raw; try { raw = localStorage.getItem(FKEY); } catch (e) { return; }
			if (!raw) { return; }
			var d; try { d = JSON.parse(raw); } catch (e) { return; }
			Object.keys(d.f || {}).forEach(function (k) { var e = $(k); if (e) { e.value = d.f[k]; } });
			Object.keys(d.g || {}).forEach(function (k) { var g = box.querySelector('.pf-sec [data-g="' + k + '"]'); if (g && !g.closest('.jg-card')) { Array.prototype.forEach.call(g.querySelectorAll('.pf-pill'), function (x, i) { x.className = 'pf-pill' + (i === d.g[k] ? ' on' : ''); }); } });
			['links', 'pres', 'seeks'].forEach(function (t) { ((d.L || {})[t] || []).forEach(function (o) { addCard(t, o); }); });
			stamp('Brouillon restauré depuis ta dernière visite.');
		}

		/* ---------- aperçu + avancement ---------- */
		function nm() { return trim(v('n') + ' ' + v('p')); }
		function update() {
			var ini = ((v('n').charAt(0) || 'P') + (v('p').charAt(0) || 'N')).toUpperCase(), al = v('a'), L = cards('links'), P = cards('pres'), K = cards('seeks');
			var okN = L.filter(function (c) { return gv(c, 'ok', ['Lien établi', 'En attente']) === 'Lien établi'; }).length;
			var hs = gv(box, 'house', HOUSES), bl = gv(box, 'blood', BLOODS);
			$('pv').style.setProperty('--c', '#d9b36a');
			$('pv').innerHTML = '<div class="av"><i></i><b>' + esc(ini) + '</b></div><strong>' + esc(nm() || 'Prénom Nom') + '</strong>' + (al ? '<small>« ' + esc(al) + ' »</small>' : '') +
				'<ul><span>Sang</span><li>' + esc(bl) + '</li>' + (hs ? '<span>Maison</span><li>' + esc(hs) + '</li>' : '') + '<span>Liens</span><li>' + okN + ' établi' + (okN > 1 ? 's' : '') + ', ' + (L.length - okN) + ' en attente</li><span>Recherchés</span><li>' + (P.length + K.length) + '</li></ul>';
			Array.prototype.forEach.call(box.querySelectorAll('[data-wc]'), function (p) { var ta = p.parentNode.querySelector('textarea'), w = words(ta ? ta.value : ''); p.textContent = w + ' mot' + (w > 1 ? 's' : ''); });
			var ck = [[v('n') && v('p') && v('ag'), 'Identité renseignée'], [v('f'), 'Faceclaim ajouté'], [v('sm'), 'Résumé écrit'], [v('ph') && v('me'), 'Physique et mental décrits'], [L.length > 0, 'Au moins un lien ajouté']];
			var n = 0; $('ck').innerHTML = ck.map(function (c) { if (c[0]) { n++; } return '<li' + (c[0] ? ' class="ok"' : '') + '>' + c[1] + '</li>'; }).join('');
			$('pb').style.width = Math.round(n / ck.length * 100) + '%';
		}
		function missing() {
			var m = [];
			if (!v('n') || !v('p')) { m.push('prénom et nom'); }
			if (!v('ag')) { m.push('âge'); }
			if (!v('f')) { m.push('faceclaim'); }
			if (!v('sm')) { m.push('résumé'); }
			cards('links').forEach(function (c, i) { if (!cv(c, 'n') || !cv(c, 'p') || !cv(c, 'st')) { m.push('lien ' + (i + 1) + ' (nom et histoire)'); } });
			cards('pres').forEach(function (c, i) { if (!cv(c, 'n') || !cv(c, 'p') || !cv(c, 'st')) { m.push('lien recherché ' + (i + 1) + ' (nom et histoire)'); } });
			return m;
		}

		/* ---------- génération du code ---------- */
		var COL = '#d9b36a';
		function H(t) { return '[b][color=' + COL + ']' + t + '[/color][/b]\n'; }
		function line(k, val) { return trim(val) ? k + ' : ' + trim(val) + '\n' : ''; }
		function build() {
			var t = '', tags = [v('ag'), v('yf'), gv(box, 'house', HOUSES), gv(box, 'blood', BLOODS)].filter(Boolean);
			t += '[center][size=30][b][color=' + COL + ']' + nm().toUpperCase() + '[/color][/b][/size]\n';
			if (v('a')) { t += '[i]« ' + v('a') + ' »[/i]\n'; }
			if (v('ci')) { t += '[size=15][i]“' + one(v('ci')) + '”[/i][/size]\n'; }
			t += '[size=13][color=#a8a193]' + tags.join(' · ') + '[/color][/size]\n';
			if (v('u')) { t += '\n[img]' + v('u') + '[/img]\n'; }
			if (v('f')) { t += '[i]' + v('f') + '[/i]'; }
			t += '[/center]\n\n';
			t += H('JOURNAL') + line('Prénom', v('n')) + line('Nom', v('p')) + line('Alias', v('a')) + line('Âge', v('ag')) + line('Année ou fonction', v('yf')) + line('Naissance', v('bn')) + line('Origine', v('or')) + line('Orientation', v('sx')) + line('Statut du sang', gv(box, 'blood', BLOODS)) + line('Maison', gv(box, 'house', HOUSES)) + line('Faceclaim', v('f')) + line('Ouvert aux liens', gv(box, 'open', ['Ouvert', 'Fermé']));
			t += '\n' + H('RÉSUMÉ DU JOURNAL') + v('sm') + '\n';
			if (v('nt')) { t += '\n' + H('NOTE DU JOUEUR') + v('nt') + '\n'; }
			var jf = line('Rythme de réponse', v('rt')) + line('Style de jeu', v('sj')) + line('Lieux favoris', v('lf')) + line('Contact', v('ct'));
			if (jf) { t += '\n' + H('DERRIÈRE LE PERSONNAGE') + jf; }
			if (v('ph') || v('pt')) { t += '\n' + H('PHYSIQUE') + (v('ph') ? v('ph') + '\n' : '') + line('Traits', v('pt')); }
			if (v('me') || v('mt')) { t += '\n' + H('MENTAL') + (v('me') ? v('me') + '\n' : '') + line('Traits', v('mt')); }
			var L = cards('links');
			if (L.length) {
				t += '\n[b][color=' + COL + ']LIENS[/color][/b]\n';
				L.forEach(function (c) {
					var name = trim(cv(c, 'n') + ' ' + cv(c, 'p'));
					t += '\n' + H('LIEN : ' + name) + line('Nature', gv(c, 'nat', AFF)) + line('Relation', cv(c, 'rel')) + line('Statut', gv(c, 'ok', ['Lien établi', 'En attente'])) + line('Profondeur', gv(c, 'dp', ['0', '1', '2', '3', '4', '5']) ? gv(c, 'dp', ['0', '1', '2', '3', '4', '5']) + '/5' : '') + line('Faceclaim', cv(c, 'fc')) + line('Image', cv(c, 'im')) + line('Statut du sang', cv(c, 'sg')) + line('Première rencontre', cv(c, 'si')) + line('Lieu', cv(c, 'li'));
					t += H('HISTOIRE') + cv(c, 'st') + '\n';
					cv(c, 'sc').split('\n').forEach(function (s) { s = trim(s); if (s) { t += 'Scène : ' + s + '\n'; } });
				});
			}
			var P = cards('pres');
			if (P.length) {
				t += '\n[b][color=' + COL + ']RECHERCHÉS[/color][/b]\n';
				P.forEach(function (c) {
					var name = trim(cv(c, 'n') + ' ' + cv(c, 'p'));
					t += '\n' + H('RECHERCHÉ : ' + name) + line('Nature', gv(c, 'nat', AFF)) + line('Relation', cv(c, 'rel')) + line('Disponibilité', gv(c, 'dispo', ['Disponible', 'Réservé'])) + line('Âge', cv(c, 'ag')) + line('Maison', cv(c, 'mai')) + line('Statut du sang', cv(c, 'sg')) + line('Faceclaim', cv(c, 'fc') || 'libre');
					t += H('HISTOIRE') + cv(c, 'st') + '\n';
					cv(c, 'ot').split('\n').forEach(function (s) { s = trim(s); if (s) { t += 'Autre lien : ' + s + '\n'; } });
					if (cv(c, 'rt')) { t += 'Scène : ' + cv(c, 'rt') + ' | ' + cv(c, 'rd') + ' | ' + one(cv(c, 'rx')) + '\n'; }
				});
			}
			var K = cards('seeks').filter(function (c) { return cv(c, 'd'); });
			if (K.length) {
				t += '\n' + H('AUTRES RECHERCHES');
				K.forEach(function (c) { t += 'Recherche : ' + gv(c, 'nat', AFF) + ' | ' + one(cv(c, 'd')) + '\n'; });
			}
			return t.replace(/\n+$/, '') + '\n';
		}

		/* ---------- évènements ---------- */
		box.addEventListener('click', function (e) {
			var b = e.target.closest ? e.target.closest('button') : null; if (!b) { return; }
			if (b.getAttribute('data-add')) { var c = addCard(b.getAttribute('data-add')); update(); save(); try { c.querySelector('input').focus(); } catch (x) { } return; }
			if (b.getAttribute('data-del')) { var cd = b.closest('.jg-card'); if (cd) { cd.parentNode.removeChild(cd); update(); save(); } return; }
			if (/\bpf-pill\b/.test(b.className) && b.parentNode.getAttribute('data-g')) {
				var was = /\bon\b/.test(b.className), opt = b.parentNode.getAttribute('data-opt');
				Array.prototype.forEach.call(b.parentNode.children, function (x) { x.className = 'pf-pill'; });
				if (!(was && opt)) { b.className = 'pf-pill on'; }
				update(); save(); return;
			}
			if (b.id === 'jg-clr') { if (b.getAttribute('data-sure')) { try { localStorage.removeItem(FKEY); } catch (x) { } location.reload(); } else { b.setAttribute('data-sure', '1'); b.textContent = 'Confirmer : tout effacer'; setTimeout(function () { b.removeAttribute('data-sure'); b.textContent = 'Effacer le brouillon'; }, 4000); } return; }
			if (b.id === 'jg-go') { gen(); }
		});
		box.addEventListener('input', function () { update(); save(); });
		function gen() {
			var out = $('out'), m = missing(), code = build(), subject = 'Journal de ' + (nm() || 'mon personnage');
			out.style.display = 'block';
			out.innerHTML = m.length ? '<div class="pf-err"><b>Il manque encore :</b> ' + m.join(', ') + '.<br>Tu peux quand même copier le code ci-dessous.</div>' : '';
			if (code.length > 60000) { out.innerHTML += '<div class="pf-err"><b>Le code est très long (' + code.length + ' caractères).</b> Le forum risque de le refuser : retire un lien ou raccourcis une histoire.</div>'; }
			out.innerHTML += '<span class="pf-lab" style="margin-top:' + (out.innerHTML ? 16 : 0) + 'px">Ton code, prêt à coller</span><textarea id="jg-code" readonly></textarea>' +
				'<div class="pf-bar2"><button type="button" class="pf-btn" id="jg-copy">Copier le code</button>' + (JR_FORUM ? '<a class="pf-btn ghost" id="jg-open" href="/post?mode=newtopic&f=' + JR_FORUM + '">Ouvrir l’éditeur avec mon journal</a>' : '') + '<span class="pf-ok" id="jg-msg"></span></div>' +
				'<p class="pf-hint">Titre conseillé : <b>' + esc(subject) + '</b></p>';
			$('code').value = code;
			$('copy').onclick = function () {
				var ta = $('code'); ta.select();
				var done = function () { $('msg').textContent = 'Code copié.'; };
				if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(code).then(done, function () { try { document.execCommand('copy'); done(); } catch (e) { } }); } else { try { document.execCommand('copy'); done(); } catch (e) { } }
			};
			if ($('open')) { $('open').onclick = function () { try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), body: code, subject: subject })); } catch (e) { } }; }
			out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
		restore(); update();
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();

/* ===== REVELIO : journal posté (met en page le code généré par le générateur de journal) ===== */
(function () {
	var AFF = { 'amour': ['Amour', '#d65a6b'], 'amitié': ['Amitié', '#8cc7a0'], 'neutre': ['Neutre', '#a8a193'], 'rivalité': ['Rivalité', '#e0975f'], 'ennemi': ['Ennemi', '#b79be0'] };
	var AFFL = ['amour', 'amitié', 'neutre', 'rivalité', 'ennemi'];
	var HCOL = { 'gryffondor': '#d65a6b', 'serdaigle': '#6fb0cf', 'serpentard': '#5fc4a0', 'poufsouffle': '#d9b650' };
	var HEADS = ['JOURNAL', 'RÉSUMÉ DU JOURNAL', 'NOTE DU JOUEUR', 'DERRIÈRE LE PERSONNAGE', 'PHYSIQUE', 'MENTAL', 'LIENS', 'RECHERCHÉS', 'AUTRES RECHERCHES', 'HISTOIRE'];
	function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
	function plain(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; }
	function words(s) { var m = String(s).match(/\S+/g); return m ? m.length : 0; }
	function trim(s) { return String(s == null ? '' : s).replace(/^\s+|\s+$/g, ''); }
	function ini(nm) { return nm.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase(); }
	function aff(n) { return AFF[trim(n).toLowerCase()] || AFF['neutre']; }
	function safeUrl(u) { u = trim(u); return /^(https?:\/\/|\/)/i.test(u) ? u : ''; }
	function kv(lines) { var o = {}; lines.forEach(function (l) { var m = /^([^:]+?)\s*:\s*(.*)$/.exec(l); if (m && !(m[1] in o)) { o[m[1]] = trim(m[2]); } }); return o; }
	var STAT = ['Tout a commencé…', 'Autre scène'];

	/* ---------- lecture du message ---------- */
	function parse(c) {
		var clone = c.cloneNode(true), portrait = '', first = true;
		Array.prototype.forEach.call(clone.querySelectorAll('img'), function (im) {
			var s = im.getAttribute('src') || '';
			if (!/smil|emoticon|icon_/i.test(s) && first) { portrait = s; first = false; }
			im.parentNode.removeChild(im);
		});
		Array.prototype.forEach.call(clone.querySelectorAll('script,style'), function (n) { n.parentNode.removeChild(n); });
		var lines = plain(clone.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(div|p|li)>/gi, '\n')).replace(/ /g, ' ').split('\n').map(trim);
		var blocks = [], cur = null, sub = null, i, l;
		for (i = 0; i < lines.length; i++) {
			l = lines[i];
			if (!l) { if (cur && sub) { sub.push(''); } continue; }
			var isH = (l === l.toUpperCase() && HEADS.indexOf(l) > -1) || /^LIEN : /.test(l) || /^RECHERCHÉ : /.test(l);
			if (isH && l !== 'LIENS' && l !== 'RECHERCHÉS' && l !== 'HISTOIRE') {
				cur = { h: l, kv: [], hist: [], hasHist: false }; blocks.push(cur); sub = cur.kv; continue;
			}
			if (l === 'HISTOIRE' && cur && /^(LIEN|RECHERCHÉ) : /.test(cur.h)) { cur.hasHist = true; sub = cur.hist; continue; }
			if (l === 'LIENS' || l === 'RECHERCHÉS') { cur = null; sub = null; continue; }
			if (cur) { sub.push(l); }
		}
		function block(h) { for (var j = 0; j < blocks.length; j++) { if (blocks[j].h === h) { return blocks[j]; } } return null; }
		function text(h) { var b = block(h); return b ? b.kv.filter(function (x, idx, a) { return !(x === '' && (idx === 0 || idx === a.length - 1)); }).join('\n') : ''; }
		var J = block('JOURNAL'), jk = J ? kv(J.kv) : {};
		var first_ = jk['Prénom'] || '', last_ = jk['Nom'] || '';
		var own = {
			first: first_, last: last_, name: trim(first_ + ' ' + last_), alias: jk['Alias'] || '', age: jk['Âge'] || '', yf: jk['Année ou fonction'] || '', born: jk['Naissance'] || '', origin: jk['Origine'] || '', sx: jk['Orientation'] || '',
			blood: jk['Statut du sang'] || '', house: jk['Maison'] || '', fc: jk['Faceclaim'] || '', open: !/^ferm/i.test(jk['Ouvert aux liens'] || 'Ouvert'), portrait: portrait,
			sum: text('RÉSUMÉ DU JOURNAL'), note: text('NOTE DU JOUEUR')
		};
		var pb = block('DERRIÈRE LE PERSONNAGE'); own.facts = pb ? kv(pb.kv) : {};
		function pm(h) { var b = block(h); if (!b) { return null; } var tr = '', body = []; b.kv.forEach(function (x) { var m = /^Traits\s*:\s*(.*)$/.exec(x); if (m) { tr = m[1]; } else if (x) { body.push(x); } }); return { p: body, tags: tr.split(',').map(trim).filter(Boolean) }; }
		own.phy = pm('PHYSIQUE'); own.men = pm('MENTAL');
		var links = [], pres = [], seeks = [];
		blocks.forEach(function (b) {
			var m;
			if ((m = /^LIEN : (.*)$/.exec(b.h))) {
				var k = kv(b.kv), nm = trim(m[1]), sc = [], story = [];
				b.hist.forEach(function (x) { var s = /^Scène\s*:\s*(.*)$/.exec(x); if (s) { var p = s[1].split('|').map(trim); sc.push({ t: p[0] || '', d: p[1] || '', x: p[2] || '', u: safeUrl(p[3]), fin: /^term/i.test(p[4] || '') }); } else if (x) { story.push(x); } });
				var dp = parseInt(k['Profondeur'], 10);
				links.push({ name: nm, first: nm.split(' ')[0], last: nm.split(' ').slice(1).join(' '), nat: k['Nature'] || 'Neutre', rel: k['Relation'] || '', ok: !/attente/i.test(k['Statut'] || ''), depth: isNaN(dp) ? null : Math.max(0, Math.min(5, dp)), fc: k['Faceclaim'] || '', img: safeUrl(k['Image']), blood: k['Statut du sang'] || '', since: k['Première rencontre'] || '', lieu: k['Lieu'] || '', story: story, scenes: sc });
			} else if ((m = /^RECHERCHÉ : (.*)$/.exec(b.h))) {
				var k2 = kv(b.kv), nm2 = trim(m[1]), oth = [], st2 = [], sc2 = null;
				b.hist.forEach(function (x) { var o = /^Autre lien\s*:\s*(.*)$/.exec(x), s = /^Scène\s*:\s*(.*)$/.exec(x); if (o) { var p = o[1].split('|').map(trim); oth.push({ name: p[0] || '', rel: p[1] || '' }); } else if (s) { var q = s[1].split('|').map(trim); sc2 = { t: q[0] || '', d: q[1] || '', x: q[2] || '' }; } else if (x) { st2.push(x); } });
				pres.push({ name: nm2, first: nm2.split(' ')[0], last: nm2.split(' ').slice(1).join(' '), nat: k2['Nature'] || 'Neutre', rel: k2['Relation'] || '', dispo: k2['Disponibilité'] || 'Disponible', age: k2['Âge'] || '', house: k2['Maison'] || '', blood: k2['Statut du sang'] || '', fc: k2['Faceclaim'] || 'libre', story: st2, others: oth, scene: sc2 });
			} else if (b.h === 'AUTRES RECHERCHES') {
				b.kv.forEach(function (x) { var s = /^Recherche\s*:\s*(.*)$/.exec(x); if (s) { var p = s[1].split('|'); seeks.push({ nat: trim(p[0]), desc: trim(p.slice(1).join('|')) }); } });
			}
		});
		return { own: own, links: links, pres: pres, seeks: seeks };
	}

	/* ---------- gabarits ---------- */
	var SVG_PERSON = '<svg viewBox="0 0 66 86" aria-hidden="true"><circle cx="33" cy="26" r="16"/><path d="M0 86c2-24 14-38 33-38s31 14 33 38z"/></svg>';
	function paras(arr) { return arr.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join(''); }
	function facts(list) { var f = list.filter(function (x) { return x[1]; }); return f.map(function (x) { return '<div><i class="fk">' + esc(x[0]) + '</i><span>' + esc(x[1]) + '</span></div>'; }).join(''); }
	function story(title, arr, cls) { var w = words(arr.join(' ')), fold = w > 110; return '<div class="jr-story ' + (cls || '') + (fold ? ' clamp' : '') + '" data-fold="' + (fold ? 1 : 0) + '"><h5 class="sh"><span>' + title + '</span></h5><div class="sbody">' + paras(arr) + '</div><button type="button" class="jr-fold' + (fold ? '' : ' jr-off') + '" data-more="1">Lire la suite ↓</button></div>'; }
	function ownView(D, ctx) {
		var o = D.own, hc = HCOL[(o.house || '').toLowerCase()] || '#d9b36a', okN = D.links.filter(function (l) { return l.ok; }).length, kinds = {}; D.links.forEach(function (l) { kinds[aff(l.nat)[0]] = 1; });
		var chips = [o.age, o.yf, o.sx, o.origin, o.blood].filter(Boolean).map(function (t) { return '<b>' + esc(t) + '</b>'; }).join('');
		var kpi = [[okN, 'Liens établis'], [D.links.length - okN, 'En attente'], [D.pres.length + D.seeks.length, 'Recherchés'], [Object.keys(kinds).length, 'Natures de lien']].map(function (q) { return '<div><strong>' + q[0] + '</strong><span>' + q[1] + '</span></div>'; }).join('');
		var f = facts([['Rythme de réponse', o.facts['Rythme de réponse']], ['Style de jeu', o.facts['Style de jeu']], ['Lieux favoris', o.facts['Lieux favoris']], ['Contact', o.facts['Contact']]]);
		var pmHtml = [['Physique', o.phy], ['Mental', o.men]].filter(function (x) { return x[1]; }).map(function (x) { return '<article><h3><span>' + x[0] + '</span></h3><p>' + esc(x[1].p.join(' ')) + '</p><div class="tg">' + x[1].tags.map(function (t) { return '<b>' + esc(t) + '</b>'; }).join('') + '</div></article>'; }).join('');
		return '<div class="jr-body">' +
			'<header class="lp-hero jr-blk" style="animation-delay:.1s"><div class="lp-ban"></div><div class="lp-hi" style="--c:' + hc + '">' +
			'<div class="jr-dm jr-hdm"><i>' + SVG_PERSON + (o.portrait ? '<img src="' + esc(o.portrait) + '" alt="' + esc(o.name) + '">' : '') + '</i></div>' +
			'<div class="lp-who"><small>Journal' + (o.house ? ' · ' + esc(o.house) : '') + '</small><h1>' + esc(o.name) + '</h1><div class="jr-alias">' + (o.alias ? '<span class="al"><u></u><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l8-8"/></svg><em>' + esc(o.alias) + '</em><u></u></span>' : '') + '<div class="jr-meta">' + (o.born ? '<p>' + esc(o.born) + '</p>' : '') + '<div class="jr-chips">' + chips + '</div></div></div></div>' +
			'<div class="lp-cta"><div class="lp-stat" style="--s:' + (o.open ? '#8cc7a0' : '#e08a8a') + '"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (o.open ? 'M5 12l5 5L20 7' : 'M6 6l12 12M18 6L6 18') + '"/></svg></div><div><small>Ouvert aux liens</small><strong>' + (o.open ? 'Ouvert' : 'Fermé') + '</strong></div></div><a class="lp-btn" href="' + esc(ctx.reply) + '">Proposer un lien à ' + esc(o.first) + '</a></div></div>' +
			'<div class="lp-kpi">' + kpi + '</div></header>' +
			'<section class="lp-sec jr-grow jr-blk" style="animation-delay:.5s"><h2 class="lp-h">Résumé</h2><p class="jr-sum">' + esc(o.sum.replace(/\n+/g, ' ')) + '</p>' +
			((o.note || f) ? '<div class="jr-play">' + (o.note ? '<p class="lp-note">' + esc(o.note.replace(/\n+/g, ' ')) + '<cite>Note du joueur</cite></p>' : '<span></span>') + (f ? '<div class="lp-facts">' + f + '</div>' : '') + '</div>' : '') + '</section>' +
			(pmHtml ? '<section class="lp-sec jr-blk jr-pm" style="animation-delay:.6s"><h2 class="lp-h">Physique &amp; mental</h2><div class="jr-pmg">' + pmHtml + '</div></section>' : '') + '</div>';
	}
	function seekView(D, ctx) {
		var o = D.own, h = '<div class="jr-body">';
		if (D.pres.length) {
			h += '<section class="lp-sec jr-blk" style="margin-top:0;animation-delay:.05s"><h2 class="lp-h">Pré-lien · un personnage à pourvoir</h2>';
			D.pres.forEach(function (p) {
				var a = aff(p.nat), c = a[1], fcFree = !p.fc || /^libre$/i.test(p.fc);
				var others = p.others.map(function (x) { var free = /^à définir/i.test(x.name); return '<a class="o' + (free ? ' free' : '') + '" href="' + esc(ctx.reply) + '" style="--c:' + (free ? '#b79be0' : '#8cc7a0') + '"><i><b>' + esc(free ? '?' : ini(x.name)) + '</b></i><div><strong>' + esc(x.name) + '</strong><em>' + esc(x.rel) + '</em></div><u>' + (free ? 'À pourvoir' : 'Joué') + '</u></a>'; }).join('');
				h += '<article class="lp-cd wait pre" style="--c:' + c + '"><div class="jr-cg"><aside class="jr-as"><div class="jr-dm"><i><b>' + esc(ini(p.name)) + '</b></i></div><div class="cd-fcn">' + (fcFree ? 'Faceclaim libre' : 'Faceclaim · ' + esc(p.fc)) + '</div>' +
					'<div class="jr-gj"><div class="gh"><span>Profondeur du lien</span><b>0 / 5</b></div><div class="gd"><i></i><i></i><i></i><i></i><i></i></div><p class="gn">Tout reste à écrire.</p></div>' +
					'<div class="lp-facts jr-f3">' + facts([['Âge', p.age], ['Maison', p.house], ['Sang', p.blood]]) + '</div></aside>' +
					'<div class="jr-mn"><div class="jr-hd"><span class="aff dash"><i></i><span>Pré-lien · ' + esc(a[0]) + '</span></span><span class="no">À pourvoir</span></div>' +
					'<h4 class="jr-nm"><small>' + esc(p.first) + '</small><span>' + esc(p.last) + '</span></h4><div class="jr-ln"><i></i><em>' + esc(p.rel) + '</em><u></u></div>' +
					story('Ce qui les lie', p.story) +
					'<div class="jr-dg mini"><div class="nd"><div class="sm own"><i><b>' + esc(ini(o.name)) + '</b>' + (o.portrait ? '<img src="' + esc(o.portrait) + '" alt="">' : '') + '</i></div><small>' + esc(o.name) + '</small></div><div class="ln"><span class="lb">' + esc(p.rel) + '</span></div><div class="nd"><div class="sm ghost"><i><b>' + esc(ini(p.name)) + '</b></i></div><small>' + esc(p.name) + '</small></div></div>' +
					(others ? '<div class="jr-around"><h5 class="sh"><span>Autres liens de ' + esc(p.first) + '</span></h5><div class="ar">' + others + '</div></div>' : '') +
					(p.scene && p.scene.t ? '<div class="jr-tl"><div class="rh"><span>Pensine · scène d’ouverture proposée</span></div><a class="jr-ev" href="' + esc(ctx.reply) + '"><i class="nd"></i><div class="bd"><small>À jouer ensemble</small><b>' + esc(p.scene.t) + '</b><em>' + esc(p.scene.d) + '</em><p>' + esc(p.scene.x) + '</p></div><u>Ouvert</u></a></div>' : '') +
					'</div></div><div class="cd-ft"><a class="lp-b2 g" href="' + esc(ctx.reply) + '">Proposer ' + esc(p.name) + '</a><a class="lp-b2" href="' + esc(ctx.reply) + '">Poser une question</a><span class="cd-st' + (/réserv/i.test(p.dispo) ? ' wt' : '') + '"><i></i>' + esc(p.dispo) + '</span></div></article>';
			});
			h += '</section>';
		}
		if (D.seeks.length) {
			h += '<section class="lp-sec jr-grow jr-blk" style="animation-delay:.4s"><h2 class="lp-h">Ce qu’on recherche aussi</h2><p class="jr-lead">Ces pages sont encore blanches. Si l’un de ces liens vous ressemble, écrivez-vous dessus.</p><div class="jr-seek1">' +
				D.seeks.map(function (k, i) { var a = aff(k.nat); return '<div class="lp-sk jr-blk" style="--c:' + a[1] + ';animation-delay:' + (0.3 + i * 0.18).toFixed(2) + 's"><i><b>?</b></i><div><em>' + esc(a[0]) + '</em><p>' + esc(k.desc) + '</p><a class="go" href="' + esc(ctx.reply) + '">Me proposer ce lien →</a></div></div>'; }).join('') + '</div></section>';
		}
		var cnt = {}; D.links.forEach(function (l) { var n = aff(l.nat)[0]; cnt[n] = (cnt[n] || 0) + 1; });
		h += '<section class="lp-sec jr-blk" style="animation-delay:.9s"><h2 class="lp-h">Natures de lien</h2><div class="jr-leg">' + AFFL.map(function (k) { var a = AFF[k]; return '<span style="--c:' + a[1] + '"><i></i>' + a[0] + ' <b>' + (cnt[a[0]] || 0) + '</b></span>'; }).join('') + '</div></section></div>';
		return h;
	}
	function linkView(D, i, ctx) {
		var l = D.links[i], a = aff(l.nat), c = a[1], sc = l.scenes, depth = l.depth != null ? l.depth : (l.ok ? Math.min(5, 1 + sc.length) : 0);
		var one = l.story.length === 1 && words(l.story[0]) <= 45, quote = one ? l.story[0] : '';
		var q = quote.split(' ').map(function (w, k, arr) { return '<span class="jr-w" style="animation-delay:' + (0.5 + k * 0.07).toFixed(2) + 's">' + esc(w + (k < arr.length - 1 ? ' ' : '')) + '</span>'; }).join('');
		var rows = sc.length ? sc.map(function (r, k) { return '<a class="jr-ev" href="' + esc(r.u || ctx.reply) + '"><i class="nd"></i><div class="bd"><small>' + STAT[k === 0 ? 0 : 1] + '</small><b>' + esc(r.t) + '</b><em>' + esc(r.d) + '</em><p>' + esc(r.x) + '</p></div><u class="' + (r.fin ? 'fin' : '') + '">' + (r.fin ? 'Terminé' : 'En cours') + '</u></a>'; }).join('') :
			'<a class="jr-ev none" href="' + esc(ctx.reply) + '"><i class="nd"></i><div class="bd"><small>Pensine vide</small><b>Aucune scène pour l’instant</b><em></em><p>Ce lien attend sa première page.</p></div><u></u></a>';
		var last = sc.length ? sc[0].d : '—';
		var gauge = [0, 1, 2, 3, 4].map(function (g) { return '<i class="' + (g < depth ? 'on' : '') + '"></i>'; }).join('');
		return '<div class="jr-body ent"><article class="lp-cd' + (l.ok ? '' : ' wait') + '" style="--c:' + c + '"><div class="cd-wm" aria-hidden="true"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 10L110 102H10Z"/><circle cx="60" cy="72" r="30"/><path d="M60 10V102"/></svg></div>' +
			'<div class="jr-cg"><aside class="jr-as"><div class="jr-dm"><i>' + SVG_PERSON + (l.img ? '<img src="' + esc(l.img) + '" alt="">' : '') + '</i></div><div class="cd-fcn">' + (l.fc ? 'Faceclaim · ' + esc(l.fc) : 'Faceclaim') + '</div>' +
			'<div class="jr-gj"><div class="gh"><span>Profondeur du lien</span><b>' + depth + ' / 5</b></div><div class="gd">' + gauge + '</div></div>' +
			'<div class="lp-facts jr-f3">' + facts([['Première rencontre', l.since], ['Lieu', l.lieu], ['Dernière scène', last], ['Sang', l.blood]]) + '</div></aside>' +
			'<div class="jr-mn"><div class="jr-hd"><span class="aff"><i></i><span>' + esc(a[0]) + '</span></span><span class="no">n° ' + (i < 9 ? '0' : '') + (i + 1) + '</span></div>' +
			'<h4 class="jr-nm"><small>' + esc(l.first) + '</small><span>' + esc(l.last) + '</span></h4><div class="jr-ln"><i></i><em>' + esc(l.rel) + '</em><u></u></div>' +
			(one ? '<p class="cd-q">' + q + '</p>' : story('Leur histoire', l.story)) +
			'<div class="jr-tl"><div class="rh"><span>Pensine · scènes ensemble</span></div>' + rows + '</div></div></div>' +
			'<div class="cd-ft"><a class="lp-b2 g" href="' + esc(sc.length && sc[0].u ? sc[0].u : ctx.reply) + '">' + (sc.length ? 'Lire la première scène' : 'Proposer un RP') + '</a><span class="cd-st' + (l.ok ? '' : ' wt') + '"><i></i>' + (l.ok ? 'Lien établi' : 'En attente') + '</span></div></article></div>';
	}

	/* ---------- composant ---------- */
	function mount(D, ctx) {
		var pages = [{ name: 'Journal', c: '#6fb0cf', nav: 'Détenteur', v: function () { return ownView(D, ctx); } }];
		if (D.pres.length || D.seeks.length) { pages.push({ name: 'Recherchés', c: '#d9b36a', nav: 'Recherchés', v: function () { return seekView(D, ctx); } }); }
		D.links.forEach(function (l, i) { pages.push({ name: l.first, c: aff(l.nat)[1], nav: 'Lien ' + (i < 9 ? '0' : '') + (i + 1) + ' / ' + (D.links.length < 10 ? '0' : '') + D.links.length, v: function () { return linkView(D, i, ctx); } }); });
		var S = { phase: -1, sel: 0, k: 0, dir: 0 }, timers = [], root = document.createElement('div'), seenKey = 'rv_jr_seen_' + (ctx.id || '');
		root.className = 'rv-journal'; root.innerHTML = '<div class="jr-wrap"><div class="jr-stage"></div></div>';
		var stage = root.querySelector('.jr-stage');
		function chars(txt, t0, step) { return txt.split('').map(function (ch, i) { return { ch: ch, d: (t0 + i * step).toFixed(2) + 's' }; }); }
		function dis(arr) { return arr.map(function (c, i) { return { ch: c.ch, d: S.phase === 1 ? (((i * 37) % 11) * 0.07).toFixed(2) + 's' : c.d }; }); }
		function spans(arr) { return arr.map(function (c) { return '<span class="jr-ch" style="animation-delay:' + c.d + '">' + esc(c.ch) + '</span>'; }).join(''); }
		function render() {
			var p = S.phase, pg = pages[S.sel], turn = function (d) { return S.dir === d ? (S.k % 2 ? 'kb' : 'ka') : ''; };
			var lC, lA, lB;
			if (ctx.isOwner) { lC = dis(chars('Depuis plusieurs mois, ma nouvelle cible, c’est toi.', 0.5, 0.045)); lA = dis(chars('Bonjour', 3.1, 0.1)); lB = dis(chars(ctx.viewer, 4.1, 0.11)); }
			else { lC = dis(chars('La curiosité est un vilain défaut,', 0.5, 0.05)); lA = []; lB = dis(chars(ctx.viewer, 2.9, 0.11)); }
			stage.innerHTML = '<button type="button" class="jr-replay" data-act="replay"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/></svg>Rejouer l’ouverture</button>' +
				'<div class="jr-pg"><div class="jr-hello ' + (p < 0 ? '' : p === 0 ? 'w' : p === 1 ? 'f' : 'h') + '" aria-live="polite"><i class="jr-rip"></i><i class="jr-rip b"></i><div class="jr-lC">' + spans(lC) + '</div><div class="jr-lA">' + spans(lA) + '</div><div class="jr-lB">' + spans(lB) + '</div></div>' +
				'<div class="jr-fade ' + (p >= 2 ? 'on' : '') + '"><div class="jr-view ' + (S.k % 2 ? 'kb' : 'ka') + '">' + pg.v() + '</div>' +
				'<div class="jr-nav"><button type="button" class="jr-arw" data-act="prev" aria-label="Page précédente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span>' + esc(pg.nav) + '</span><button type="button" class="jr-arw" data-act="next" aria-label="Page suivante"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div></div>' +
				'<div class="jr-turn jr-tN ' + (S.k > 0 ? turn(1) : '') + '"></div><div class="jr-turn jr-tP ' + (S.k > 0 ? turn(-1) : '') + '"></div>' +
				'<button type="button" class="jr-skip ' + (p === 0 || p === 1 ? '' : 'h') + '" data-act="skip">Passer</button></div>' +
				'<div class="jr-tabs">' + pages.map(function (t, i) { return '<button type="button" class="lp-tab jr-tab ' + (i === S.sel ? 'on' : '') + '" style="--c:' + t.c + '" data-tab="' + i + '"><i></i>' + esc(t.name) + '</button>'; }).join('') + '</div>';
		}
		function clear() { timers.forEach(clearTimeout); timers = []; }
		function setPhase(n) { S.phase = n; render(); }
		function play() {
			clear(); var reduce = false; try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
			
			if (reduce) { setPhase(2); return; }
			setPhase(-1);
			timers.push(setTimeout(function () { setPhase(0); }, 80));
			timers.push(setTimeout(function () { setPhase(1); }, 6600));
			timers.push(setTimeout(function () { setPhase(2); try { sessionStorage.setItem(seenKey, '1'); } catch (e) { } }, 8000));
		}
		function go(i, dir) { var m = pages.length, j = ((i % m) + m) % m; S.dir = dir !== undefined ? dir : (j >= S.sel ? 1 : -1); S.sel = j; S.k++; render(); }
		root.addEventListener('click', function (e) {
			var b = e.target.closest ? e.target.closest('button') : null; if (!b) { return; }
			var act = b.getAttribute('data-act');
			if (b.getAttribute('data-tab') != null) { var t = parseInt(b.getAttribute('data-tab'), 10); go(t, t >= S.sel ? 1 : -1); return; }
			if (b.getAttribute('data-more')) { var st = b.closest('.jr-story'), cl = st.className.indexOf('clamp') > -1; st.className = cl ? st.className.replace(/\s*\bclamp\b/, '') : st.className + ' clamp'; b.textContent = cl ? 'Réduire ↑' : 'Lire la suite ↓'; return; }
			if (act === 'prev') { go(S.sel - 1, -1); } else if (act === 'next') { go(S.sel + 1, 1); } else if (act === 'skip') { clear(); setPhase(2); try { sessionStorage.setItem(seenKey, '1'); } catch (x) { } } else if (act === 'replay') { S.sel = 0; S.k = 0; S.dir = 0; play(); }
		});
		render(); play();
		return root;
	}

	function run() {
		var main = document.getElementById('main-content');
		if (!main || main.querySelector('.rv-journal')) { return; }
		var cs = main.querySelectorAll('.postbody .content, .post .content'), c = null, i;
		for (i = 0; i < cs.length; i++) { var tx = cs[i].textContent; if (tx.indexOf('RÉSUMÉ DU JOURNAL') > -1 && tx.indexOf('Prénom :') > -1) { c = cs[i]; break; } }
		if (!c) { return; }
		var post = c.closest('.post') || c.parentNode, D = parse(c);
		if (!D.own.name) { return; }
		var quote = post.querySelector('a[href*="mode=quote"]'), edit = post.querySelector('a[href*="mode=editpost"]'), reply = document.querySelector('a[href*="mode=reply"]');
		var ud = window._userdata || {}, viewer = (ud.user_id > 0 && ud.username) ? ud.username : 'voyageur';
		var au = post.querySelector('.postprofile .author a, .postprofile dt a, a.username, .postprofile a[href^="/u"]'), auId = au ? (/\/u(\d+)/.exec(au.getAttribute('href') || '') || [])[1] : '', auName = au ? trim(au.textContent).toLowerCase() : '';
		var isOwner = !au || (ud.user_id > 0 && ((auId && String(ud.user_id) === auId) || (!auId && auName && auName === trim(ud.username).toLowerCase())));
		var ctx = { reply: reply ? reply.getAttribute('href') : '#', viewer: viewer, isOwner: isOwner, id: (location.pathname.match(/\/t(\d+)/) || [])[1] || '' };
		var el = mount(D, ctx), wrap = document.createElement('div'); wrap.className = 'rv-jpost';
		wrap.appendChild(el);
		if (quote || edit) { var act = document.createElement('div'); act.className = 'rv-jact'; act.innerHTML = (quote ? '<a class="ja-btn" href="' + esc(quote.getAttribute('href')) + '">Citer</a>' : '') + (edit ? '<a class="ja-btn" href="' + esc(edit.getAttribute('href')) + '">Modifier</a>' : ''); wrap.appendChild(act); }
		post.parentNode.insertBefore(wrap, post); post.style.display = 'none'; document.body.className += ' rv-jp';
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 50); }); } else { setTimeout(run, 50); }
})();

/* ===== REVELIO : cérémonie du Choixpeau (page contenant <div id="rv-hat"></div> + messages « RÉPARTITION DU CHOIXPEAU ») ===== */
(function () {
	if (window.__rvHat) { return; } window.__rvHat = 1;
	var BASE = 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@main/';
	(function () { var q = document.querySelector('script[src*="revelio.js"]'); if (q) { BASE = q.getAttribute('src').replace(/revelio\.js.*$/, ''); } })();
	var H = {
		gryffondor: { n: 'Gryffondor', c: '#d65a6b', tag: 'Courage, audace et loyauté.', tr: ['du courage', 'de l’audace', 'un cœur qui ne recule pas'], cry: 'GRYFFONDOR !' },
		serdaigle: { n: 'Serdaigle', c: '#6fb0cf', tag: 'Savoir, esprit et curiosité.', tr: ['une soif de savoir', 'un esprit vif', 'une curiosité insatiable'], cry: 'SERDAIGLE !' },
		serpentard: { n: 'Serpentard', c: '#5fc4a0', tag: 'Ambition, ruse et détermination.', tr: ['de l’ambition', 'de la ruse', 'une détermination farouche'], cry: 'SERPENTARD !' },
		poufsouffle: { n: 'Poufsouffle', c: '#d9b650', tag: 'Travail, patience et justice.', tr: ['de la loyauté', 'une patience rare', 'un grand sens de la justice'], cry: 'POUFSOUFFLE !' }
	}, KEYS = ['gryffondor', 'serdaigle', 'serpentard', 'poufsouffle'];
	var reduce = false; try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
	function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
	function norm(s) { s = String(s || '').toLowerCase().replace(/^\s+|\s+$/g, ''); return s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s; }
	/* Choixpeau : images de l'artiste (12 expressions), la bouche alterne quand il parle */
	var FR = BASE + 'img/choixpeau/', MID = { neutral: 'neu', curious: 'neu', stern: 'sev', warm: 'che', think: 'pen', shock: 'sur', sly: 'mal' }, M = {}, IDLE = {}, SEQ = [2, 3, 2, 4, 3, 5, 6, 2, 1, 3];
	Object.keys(MID).forEach(function (k) { M[k] = SEQ.map(function (n) { return MID[k] + n; }); IDLE[k] = MID[k] + '1'; });
	function fsrc(n) { return FR + n + '.webp'; }
	setTimeout(function () { ['neu', 'sev', 'che', 'pen', 'sur', 'mal'].forEach(function (m) { for (var k = 1; k <= 8; k++) { var im = new Image(); im.src = fsrc(m + k); } }); }, 600);
	function faceHtml(n) { return '<div class="ht-fr"><img alt="" draggable="false" data-n="' + (n || 'neu1') + '" src="' + fsrc(n || 'neu1') + '"></div>'; }
	function fimg(root) { return root && root.querySelector('.ht-fr img'); }
	function setI(i, n) { i.setAttribute('data-n', n); i.src = fsrc(n); }
	function stopTalk(root) { if (root && root.__ft) { clearInterval(root.__ft); root.__ft = 0; } }
	function idleF(root, n) { stopTalk(root); var i = fimg(root); if (i) { setI(i, n || 'neu1'); } }
	function talkF(root, fr) { stopTalk(root); var i = fimg(root), last = ''; if (!i || !fr) { return; } root.__ft = setInterval(function () { var n; do { n = fr[Math.floor(Math.random() * fr.length)]; } while (n === last && fr.length > 1); last = n; setI(i, n); }, 170); }
	/* clignement : quand le chapeau écoute (bouche fermée, yeux ouverts), mêmes yeux que l'humeur courante */
	setInterval(function () {
		[].forEach.call(document.querySelectorAll('.ht-fr img'), function (i) {
			var d = i.getAttribute('data-n') || '', r = i.closest('.ht-fr').parentNode; if (!/^[a-z]{3}1$/.test(d) || (r && r.__ft)) { return; }
			var p = d.slice(0, 3), seq = [p + '7', p + '8', p + '7', d];
			seq.forEach(function (n, k) { setTimeout(function () { if (r && r.__ft) { return; } i.src = fsrc(n); i.setAttribute('data-n', k === seq.length - 1 ? d : n); }, k * 85); });
		});
	}, 4600);
	var HAT = faceHtml('neu1');
	function play(opts, done) {
		var name = opts.name || 'Élève', key = KEYS.indexOf(opts.house) > -1 ? opts.house : KEYS[Math.floor(Math.random() * 4)], h = H[key];
		var other = H[KEYS[(KEYS.indexOf(key) + 1 + Math.floor(Math.random() * 3)) % 4]];
		var ov = document.createElement('div'); ov.className = 'rv-hat'; ov.style.setProperty('--hc', h.c);
		ov.innerHTML = '<div class="ht-dim"></div><div class="ht-stars"></div><div class="ht-box"><div class="ht-hat">' + faceHtml('neu1') + '</div><div class="ht-line" aria-live="polite"></div>' +
			'<div class="ht-res"><img class="ht-crest" alt="" src="' + BASE + 'img/ecussons/' + h.n + '.png"><div class="ht-cry">' + h.cry + '</div><div class="ht-sub">Bienvenue chez ' + h.n + ', <b>' + esc(name) + '</b>.<br><em>' + h.tag + '</em></div><button type="button" class="ht-ok">Fermer</button></div></div>' +
			'<button type="button" class="ht-skip">Passer</button>';
		document.body.appendChild(ov); document.body.className += ' rv-hat-on'; if (window.RVMusic) { var mb = window.RVMusic.button(); mb.className += ' ht-music'; ov.appendChild(mb); }
		var tm = [], line = ov.querySelector('.ht-line'), box = ov.querySelector('.ht-box');
		function at(ms, f) { tm.push(setTimeout(f, ms)); }
		function say(t, mood) { line.className = 'ht-line'; void line.offsetWidth; line.textContent = t; line.className = 'ht-line on'; if (mood) { talkF(box, M[mood]); } else { idleF(box, 'neu1'); } }
		function stop() { tm.forEach(clearTimeout); tm = []; }
		function result() { stop(); stopTalk(box); ov.classList.add('res'); line.textContent = ''; }
		function close() { stop(); ov.classList.add('out'); document.body.className = document.body.className.replace(/\s*rv-hat-on/, ''); setTimeout(function () { if (ov.parentNode) { ov.parentNode.removeChild(ov); } }, 500); document.removeEventListener('keydown', key2); if (done) { done(key); } }
		function key2(e) { if (e.key === 'Escape') { close(); } }
		document.addEventListener('keydown', key2);
		ov.querySelector('.ht-skip').onclick = function () { if (ov.classList.contains('res')) { close(); } else { result(); } };
		ov.querySelector('.ht-ok').onclick = close;
		if (reduce) { result(); return; }
		requestAnimationFrame(function () { ov.classList.add('in'); });
		var t = 1800;
		[['Hmm… voyons voir…', 2200, 'think'], ['Oh, oui. Je lis en toi, ' + name + '…', 3000, 'warm'], ['Il y a ' + h.tr[0] + ', c’est certain…', 3000, 'stern'], ['Mais aussi ' + h.tr[1] + '… intéressant.', 3000, 'sly'],
		['Je vois ' + other.tr[0] + '… non, ce n’est pas ici que tu brilleras.', 3400, 'stern'], ['Difficile… très difficile…', 2600, 'think'], ['Ah ! ' + h.tr[2].charAt(0).toUpperCase() + h.tr[2].slice(1) + '. Voilà ce que je cherchais.', 3200, 'warm']].forEach(function (s) {
			(function (txt, d, mo, t0) { at(t0, function () { say(txt, mo); at(d - 350, function () { idleF(box, IDLE[mo]); }); }); })(s[0], s[1], s[2], t); t += s[1];
		});
		at(t, function () { say('Alors… que ce soit…', 'stern'); }); t += 1800;
		at(t, function () { ov.classList.add('shout'); say(h.cry, 'shock'); }); t += 1700;
		at(t, result);
	}
	window.RVHat = { play: play, houses: H, hat: HAT, face: faceHtml, talk: talkF, idle: idleF, M: M, IDLE: IDLE };

	/* --- page : <div id="rv-hat"></div> (cérémonie libre + BBCode staff) --- */
	function page() {
		var root = document.getElementById('rv-hat'); if (!root || root.getAttribute('data-rv')) { return; } root.setAttribute('data-rv', '1');
		root.innerHTML = '<div class="rv-hatpg"><div class="hp-hd"><span>Le Choixpeau magique</span><h2>La <em>Répartition</em></h2><p>Entre un nom, laisse le Choixpeau décider — ou impose la maison si tu es du staff.</p></div>' +
			'<div class="hp-form"><label>Nom du sorcier<input id="hp-n" type="text" maxlength="60" placeholder="Prénom Nom"></label>' +
			'<label>Maison<select id="hp-h"><option value="">Au hasard (le Choixpeau décide)</option>' + KEYS.map(function (k) { return '<option value="' + k + '">' + H[k].n + '</option>'; }).join('') + '</select></label>' +
			'<button type="button" id="hp-go">Poser le Choixpeau</button></div><div class="hp-out" id="hp-out" hidden><span>Résultat · BBCode à coller dans la fiche de présentation</span><textarea id="hp-bb" readonly rows="4"></textarea><button type="button" id="hp-cp">Copier</button></div></div>';
		var $ = function (i) { return document.getElementById(i); };
		$('hp-go').onclick = function () {
			var n = $('hp-n').value.replace(/^\s+|\s+$/g, ''); if (!n) { $('hp-n').focus(); return; }
			play({ name: n, house: $('hp-h').value }, function (k) {
				$('hp-bb').value = '[b]RÉPARTITION DU CHOIXPEAU[/b]\nÉlève : ' + n + '\nMaison : ' + H[k].n; $('hp-out').hidden = false;
			});
		};
		$('hp-cp').onclick = function () { var b = $('hp-bb'); b.select(); try { document.execCommand('copy'); $('hp-cp').textContent = 'Copié !'; setTimeout(function () { $('hp-cp').textContent = 'Copier'; }, 1500); } catch (e) { } };
	}

	/* --- messages : « RÉPARTITION DU CHOIXPEAU » / Élève : … / Maison : … (uniquement dans un sujet de présentation) --- */
	function isPres() {
		if (document.querySelector('.rv-fiche')) { return true; }
		var L = document.querySelectorAll('.post .content'), i; for (i = 0; i < L.length; i++) { if ((L[i].textContent || '').indexOf('ALLÉGEANCE ET RANG') > -1) { return true; } } return false;
	}
	function flat(s) { return norm(String(s).replace(/\s+/g, '')); }
	function mk(c, i) {
		var tmp = document.createElement('div'); tmp.innerHTML = c.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li)>/gi, '\n'); var tx = tmp.textContent || '';
		if (tx.indexOf('RÉPARTITION DU CHOIXPEAU') < 0) { return; }
		var m = /Élève\s*:\s*([^\n\r]+)/.exec(tx), mh = /Maison\s*:\s*([^\n\r]+)/.exec(tx); if (!m || !mh) { return; }
		var name = m[1].replace(/\s+$/, ''), hk = norm(mh[1]); if (!H[hk]) { return; }
		var post = c.closest('.post') || c, pid = post.id || String(i), seenKey = 'rv_hat_' + pid, seen = false;
		try { seen = !!localStorage.getItem(seenKey); } catch (e) { }
		var cards = [], fiche = null;
		function mkCard(extra) { var d = document.createElement('div'); d.className = 'rv-hatcard' + (extra || ''); d.style.setProperty('--hc', H[hk].c); cards.push(d); return d; }
		function draw(done) {
			cards.forEach(function (card) {
				card.innerHTML = '<div class="hc-ic">' + faceHtml('che1') + '</div><div class="hc-tx"><span>Le Choixpeau a parlé</span><b>' + esc(name) + '</b>' + (done ? '<em>Réparti à <i>' + H[hk].n + '</i></em>' : '<em>Sa Répartition l’attend…</em>') + '</div><button type="button" class="hc-bt">' + (done ? 'Revoir la cérémonie' : 'Écouter le Choixpeau') + '</button>';
				card.querySelector('.hc-bt').onclick = function () { play({ name: name, house: hk }, function () { try { localStorage.setItem(seenKey, '1'); } catch (e) { } draw(true); }); };
			});
		}
		var main = mkCard(); main.className += ' in-reply';
		function addFiche() {
			if (fiche) { return true; } var pn = document.querySelector('.rv-fiche .pp-name'), hero = document.querySelector('.rv-fiche .pp-hero');
			if (!pn || !hero || flat(pn.textContent) !== flat(name)) { return false; }
			fiche = mkCard(' in-fiche'); hero.parentNode.insertBefore(fiche, hero); draw(seen); return true;
		}
		draw(seen); c.style.display = 'none'; c.parentNode.insertBefore(main, c);
		if (!addFiche()) { setTimeout(addFiche, 700); setTimeout(addFiche, 2000); }
		var ud = window._userdata || {};
		if (!seen && ud.user_id > 0 && norm(ud.username) === norm(name)) { setTimeout(function () { var bt = (fiche || main).querySelector('.hc-bt'); if (bt) { bt.click(); } }, 700); }
	}
	function posts() {
		if (!isPres()) { return; }
		var L = document.querySelectorAll('.post .content:not([data-rvh])'), i;
		for (i = 0; i < L.length; i++) { L[i].setAttribute('data-rvh', '1'); mk(L[i], i); }
	}
	function run() { page(); posts(); }
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 80); }); } else { setTimeout(run, 80); }
})();

/* ===== REVELIO : quiz de répartition (page contenant <div id="rv-quiz"></div>) ===== */
(function () {
	if (window.__rvQuiz) { return; } window.__rvQuiz = 1;
	var G = 'gryffondor', R = 'serdaigle', S = 'serpentard', P = 'poufsouffle', QB = 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@main/';
	(function () { var q = document.querySelector('script[src*="revelio.js"]'); if (q) { QB = q.getAttribute('src').replace(/revelio\.js.*$/, ''); } })();
	var Q = [
		{ t: 'Aube ou crépuscule ?', bin: 1, o: [['Aube', 'Tout commence', [G, P], 'dawn'], ['Crépuscule', 'Tout se révèle', [R, S], 'dusk']] },
		{ t: 'Forêt ou rivière ?', bin: 1, o: [['Forêt', 'Sentiers perdus et mystères', [G, S], 'forest'], ['Rivière', 'Courant calme et reflets', [R, P], 'river']] },
		{ t: 'Lune ou étoiles ?', bin: 1, o: [['Lune', 'Discrète, elle règle les marées', [S, P], 'moon'], ['Étoiles', 'Innombrables, elles guident', [R, G], 'stars']] },
		{ t: 'Un couloir du château se sépare en quatre portes. Laquelle pousses-tu ?', o: [['Celle d’où montent des cris et des bruits de bataille.', [G]], ['Celle qui porte une inscription que personne n’a su traduire.', [R]], ['Celle qui est entrouverte, comme si on t’attendait.', [S]], ['Celle d’où s’échappe une odeur de pain chaud et de rires.', [P]]] },
		{ t: 'Lequel de ces reproches te blesserait le plus ?', o: [['« Tu as eu peur. »', [G]], ['« Tu n’as rien compris. »', [R]], ['« Tu n’es personne. »', [S]], ['« Tu as laissé tomber les tiens. »', [P]]] },
		{ t: 'Un ami te cache un secret dangereux. Que fais-tu ?', o: [['Je l’affronte sur-le-champ : on réglera ça ensemble.', [G]], ['Je cherche d’abord à comprendre ce qui se joue vraiment.', [R]], ['Je me tais, et je prépare discrètement un plan pour le protéger.', [S]], ['Je reste à ses côtés, quoi qu’il arrive.', [P]]] },
		{ t: 'Un objet ensorcelé t’est offert. Lequel choisis-tu ?', o: [['Une épée qui ne s’émousse jamais.', [G]], ['Un livre qui répond à toutes les questions.', [R]], ['Un miroir qui révèle les intentions de chacun.', [S]], ['Un jardin où tout pousse, même en hiver.', [P]]] }
	];
	var HC = { gryffondor: '#d65a6b', serdaigle: '#6fb0cf', serpentard: '#5fc4a0', poufsouffle: '#d9b650' };
	function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
	function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
	function mount() {
		var root = document.getElementById('rv-quiz'); if (!root || root.getAttribute('data-rv')) { return; } root.setAttribute('data-rv', '1');
		var ud = window._userdata || {}, st = { i: -1, sc: { gryffondor: 0, serdaigle: 0, serpentard: 0, poufsouffle: 0 }, name: (ud.user_id > 0 && ud.username) ? ud.username : '' };
		var stage = document.createElement('div'); stage.className = 'rv-qzstage'; stage.style.setProperty('--bg', 'url(' + QB + 'img/lieux/bibliotheque.jpg)');
		var motes = '', mi; for (mi = 0; mi < 18; mi++) { motes += '<i style="left:' + Math.round(Math.random() * 100) + '%;width:' + (2 + Math.round(Math.random() * 3)) + 'px;height:' + (2 + Math.round(Math.random() * 3)) + 'px;animation-delay:-' + (Math.random() * 14).toFixed(1) + 's;animation-duration:' + (9 + Math.random() * 9).toFixed(1) + 's"></i>'; }
		stage.innerHTML = '<div class="qz-motes">' + motes + '</div>'; if (window.RVMusic) { var mbt = window.RVMusic.button(); mbt.className += ' qz-music'; stage.appendChild(mbt); }
		var box = document.createElement('div'); box.className = 'rv-quiz'; stage.appendChild(box); root.appendChild(stage);
		function swap(html, cls) { box.className = 'rv-quiz out'; setTimeout(function () { box.className = 'rv-quiz in ' + (cls || ''); box.innerHTML = html; bind(); }, 320); }
		var REA = ['Hmm… intéressant.', 'Ah, je vois…', 'Voilà qui en dit long.', 'Oh, tiens, tiens…', 'Curieux… très curieux.', 'Je note, je note…'], INT = ['Voyons voir… une première question.'];
		function hatBlk(txt, big) { var R = window.RVHat; return '<div class="qz-hatw' + (big ? ' big' : '') + '"><div class="qz-hat">' + (R ? R.face('neu1') : '') + '</div><div class="qz-sub">' + txt + '</div></div>'; }
		function speak(mood, ms) { var R = window.RVHat, e = box.querySelector('.qz-hat'); if (!R || !e) { return; } R.talk(e, R.M[mood]); if (ms) { setTimeout(function () { if (e.isConnected !== false) { R.idle(e, R.IDLE[mood]); } }, ms); } }
		function dots() { var s = ''; for (var k = 0; k < Q.length; k++) { s += '<i class="' + (k < st.i ? 'd' : k === st.i ? 'n' : '') + '"></i>'; } return '<div class="qz-dots">' + s + '</div>'; }
		function intro() {
			st.i = -1; st.sc = { gryffondor: 0, serdaigle: 0, serpentard: 0, poufsouffle: 0 };
			setTimeout(function () { speak('warm', 2600); }, 360); swap(hatBlk('Approche, jeune sorcier… Je t’attendais.', 1) + '<div class="qz-eye">Le Choixpeau magique</div><h2>Quelle est ta <em>maison</em> ?</h2><p class="qz-p">Sept questions, pas de bonne réponse. Réponds avec ton instinct : le Choixpeau écoute ce que tu es vraiment.</p>' +
				'<div class="qz-crests">' + ['Gryffondor', 'Serdaigle', 'Serpentard', 'Poufsouffle'].map(function (n) { return '<img alt="' + n + '" src="' + QB + 'img/ecussons/' + n + '.png">'; }).join('') + '</div><label class="qz-lab">Ton nom de sorcier<input id="qz-n" type="text" maxlength="60" placeholder="Prénom Nom" value="' + esc(st.name) + '"></label><button type="button" class="qz-go" data-a="start">Commencer</button>', 'qz-intro');
		}
		function ask() {
			var q = Q[st.i], opts = q.bin ? q.o : shuf(q.o);
			var h = hatBlk(st.i === 0 ? INT[0] : REA[Math.floor(Math.random() * REA.length)]) + dots() + '<div class="qz-n">Question ' + (st.i + 1) + ' sur ' + Q.length + '</div><h3>' + esc(q.t) + '</h3>';
			if (q.bin) { h += '<div class="qz-bin">' + opts.map(function (o, k) { return '<button type="button" class="qz-b ' + o[3] + '" data-k="' + k + '"><b>' + o[0] + '</b><span>' + o[1] + '</span></button>'; }).join('') + '</div>'; }
			else { h += '<div class="qz-opts">' + opts.map(function (o, k) { return '<button type="button" class="qz-o" data-k="' + k + '"><span class="qz-bul"></span>' + o[0] + '</button>'; }).join('') + '</div>'; }
			q._cur = opts; swap(h, q.bin ? 'qz-q qz-isbin' : 'qz-q'); setTimeout(function () { speak(['sly', 'warm', 'stern', 'think', 'neutral'][Math.floor(Math.random() * 5)], 1700); }, 360);
		}
		function pick(k) {
			var q = Q[st.i], o = q._cur[k], hs = q.bin ? o[2] : o[1], w = q.bin ? 1 : 2; hs.forEach(function (x) { st.sc[x] += w; });
			st.i++; if (st.i < Q.length) { ask(); } else { verdict(); }
		}
		function verdict() {
			var mx = Math.max.apply(null, Object.keys(st.sc).map(function (k) { return st.sc[k]; })), top = Object.keys(st.sc).filter(function (k) { return st.sc[k] === mx; }), h = top[Math.floor(Math.random() * top.length)];
			swap(hatBlk('Hmm…', 1) + '<div class="qz-eye">Le Choixpeau délibère</div>', 'qz-w'); var MO = ['think', 'stern', 'warm'];
			var L = ['Hmm… difficile, très difficile…', 'Du courage, de la ruse… non, pas seulement…', 'Je crois que je tiens ma réponse.'], k = 0, sub = null;
			function tick() { sub = box.querySelector('.qz-sub'); if (sub && k < L.length) { speak(MO[k]); sub.textContent = L[k++]; setTimeout(tick, 1500); } }
			setTimeout(tick, 700);
			setTimeout(function () { if (window.RVHat) { window.RVHat.play({ name: st.name || 'jeune sorcier', house: h }, function () { result(h); }); } else { result(h); } }, 5400);
		}
		function result(h) {
			var I = window.RVHat ? window.RVHat.houses[h] : { n: h, tag: '' }, total = Object.keys(st.sc).reduce(function (a, k) { return a + st.sc[k]; }, 0) || 1;
			var bars = Object.keys(st.sc).map(function (k) { var n = window.RVHat ? window.RVHat.houses[k].n : k; return '<div class="qz-bar"><span>' + n + '</span><div><i style="width:' + Math.round(st.sc[k] / total * 100) + '%;background:' + HC[k] + '"></i></div><em>' + Math.round(st.sc[k] / total * 100) + ' %</em></div>'; }).join('');
			swap('<div class="qz-eye" style="color:' + HC[h] + '">Résultat du quiz</div><h2 style="--hc:' + HC[h] + '">' + esc(st.name || 'Toi') + ', tu irais à <em style="color:' + HC[h] + '">' + I.n + '</em></h2><p class="qz-p">' + I.tag + '<br>Ce quiz t’oriente : la Répartition officielle de ton personnage reste décidée par le staff, selon ta présentation.</p>' + '<div class="qz-bars">' + bars + '</div>' +
				'<div class="qz-row"><button type="button" class="qz-go" data-a="again">Refaire le quiz</button><button type="button" class="qz-go alt" data-a="copy">Copier mon résultat</button></div><textarea id="qz-bb" class="qz-bb" readonly rows="2">Quiz du Choixpeau : ' + I.n + '</textarea>', 'qz-res');
		}
		function bind() {
			var L = box.querySelectorAll('button'), i;
			for (i = 0; i < L.length; i++) {
				L[i].onclick = function () {
					var a = this.getAttribute('data-a'), k = this.getAttribute('data-k');
					if (a === 'start') { var n = box.querySelector('#qz-n'); st.name = n ? n.value.replace(/^\s+|\s+$/g, '') : ''; st.i = 0; ask(); }
					else if (a === 'again') { intro(); }
					else if (a === 'copy') { var b = box.querySelector('#qz-bb'); b.select(); try { document.execCommand('copy'); this.textContent = 'Copié !'; } catch (e) { } }
					else if (k !== null) { pick(+k); }
				};
			}
		}
		box.className = 'rv-quiz'; intro();
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', function () { setTimeout(mount, 100); }); } else { setTimeout(mount, 100); }
})();


/* ===== REVELIO : musique d'ambiance (lecteur YouTube, activable / désactivable) ===== */
(function () {
	if (window.RVMusic) { return; }
	var VID = '2DobDCA26HA', P = null, ready = false, want = false, btns = [], loading = false;
	function sync() { var on = want && P && ready; btns.forEach(function (b) { b.className = b.className.replace(/\s*\bon\b/, '') + (want ? ' on' : ''); b.setAttribute('aria-pressed', want ? 'true' : 'false'); b.title = want ? 'Couper la musique' : 'Activer la musique'; }); }
	function load() {
		if (loading) { return; } loading = true;
		var d = document.createElement('div'); d.style.cssText = 'position:fixed;left:-20px;bottom:0;width:2px;height:2px;overflow:hidden;opacity:.01;pointer-events:none'; d.innerHTML = '<div id="rv-yt"></div>'; document.body.appendChild(d);
		var prev = window.onYouTubeIframeAPIReady;
		window.onYouTubeIframeAPIReady = function () {
			if (prev) { try { prev(); } catch (e) { } }
			P = new YT.Player('rv-yt', { width: '2', height: '2', videoId: VID, playerVars: { controls: 0, loop: 1, playlist: VID, playsinline: 1, rel: 0, modestbranding: 1, disablekb: 1 }, events: {
				onReady: function () { ready = true; try { P.setVolume(35); } catch (e) { } if (want) { P.playVideo(); } sync(); },
				onStateChange: function (e) { if (e.data === 0 && want) { P.playVideo(); } },
				onError: function () { want = false; sync(); }
			} });
		};
		if (window.YT && window.YT.Player) { window.onYouTubeIframeAPIReady(); } else { var s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s); }
	}
	function toggle() {
		want = !want; try { sessionStorage.setItem('rv_mus', want ? '1' : '0'); } catch (e) { }
		if (want) { if (!P) { load(); } else if (ready) { P.playVideo(); } } else if (P && ready) { P.pauseVideo(); }
		sync();
	}
	function button() {
		var b = document.createElement('button'); b.type = 'button'; b.className = 'rv-mus'; b.innerHTML = '<span class="mu-eq"><i></i><i></i><i></i><i></i></span><span class="mu-t">Musique</span>';
		b.onclick = toggle; btns.push(b); sync(); return b;
	}
	window.RVMusic = { button: button, toggle: toggle };
})();

/* ===== REVELIO : Guidebook (page contenant <div id="rv-guide"></div>) ===== */
(function () {
	'use strict';
	if (window.__rvGuide) { return; } window.__rvGuide = 1;
	var G = [{"n":"I","t":"Le contexte","s":"Grindelwald a gagné","c":"#c9a24f","i":"Nous sommes en 2026, et le monde que tu vas jouer n’est pas celui des livres. En 1945, Gellert Grindelwald a vaincu Albus Dumbledore. Depuis quatre-vingts ans, il gouverne un monde où la magie n’est plus un secret, et toute une génération n’en a connu aucun autre. Nihil occultum : rien ne restera caché.","tl":[["1945","Le Duel","Grindelwald vainc Dumbledore et s’empare de la Baguette de Sureau. Dumbledore disparaît, sans corps ni dernier mot."],["1945-1946","La démonstration","Soins, reconstruction et secours : les sorciers se rendent utiles à des nations épuisées. La bombe atomique donne un poids nouveau à leur argument."],["1946","Le Dévoilement","Le Secret magique est levé. Des accords avec quelques États donnent naissance aux Tuteurs."],["1947-1959","La consolidation","Le Ministère est réorganisé, l’Ordre crée ses accréditations et le Bureau de la Révélation est institué."],["1960-1979","La première génération","L’Année de Service est instituée et Poudlard devient une université. Les premiers étudiants ont grandi sous l’Ordre."],["1980-2000","La normalisation","Les Tuteurs deviennent une profession et le règne s’installe dans la durée. Les premiers doutes apparaissent."],["2026","Aujourd’hui","Quatre-vingts ans après le Duel, une génération entière n’a connu que l’Ordre. C’est ici que commence ton histoire."]],"x":[["Le Duel, 1945","Deux hommes qui s’étaient aimés comme on n’aime qu’une fois se font face, sans témoin. Un éclair visible à des lieues, puis un silence plus lourd encore. Quand il retombe, Grindelwald est debout, la Baguette de Sureau au poing. Du côté de Dumbledore, rien : ni corps, ni baguette brisée, ni dernier mot.","","#d9b36a"],["Le Dévoilement, 1946","Un an plus tard, Grindelwald lève le Secret magique. Il ne conquiert pas le monde par la guerre : il l’obtient par la scène. Devant des nations épuisées par six ans de conflit, et alors que la bombe atomique vient de montrer ce que les hommes peuvent détruire, les sorciers offrent reconstruction, soins et protection. Un monde qui ne pouvait plus refuser.","","#d9b36a"],["L’Ordre","Grindelwald est charmant, éloquent et patient. Il promet à chaque sorcier la place que sa valeur mérite, au sommet d’une élite qui n’a plus à se cacher. L’Ordre fixe la doctrine et distribue la légitimité : être accrédité, c’est exister. Ses réussites sont réelles, ses partisans sincères. Beaucoup y croient, d’autres s’en accommodent, quelques-uns commencent à douter.","","#d9b36a"],["Les institutions","Le Ministère de la Magie administre : lois, justice, permis, services. Les Tuteurs, sorciers accrédités, font l’interface avec les autorités moldues : ils conseillent, coordonnent et peuvent suspendre une décision qui met les sorciers en danger. Le Bureau de la Révélation veille à la transparence promise : il enquête et exige des documents, mais ne condamne pas.","","#d9b36a"],["Le monde dévoilé","Les Moldus savent que la magie existe, mais tout le monde n’entre pas partout. Le Chemin de Traverse, Pré-au-Lard et le Chaudron Baveur sont connus, mais protégés ; le quai 9¾ reste un accès réglementé au Poudlard Express. Le mystère ne tient plus à la dissimulation de la magie, mais aux règles d’accès et à ce que le régime choisit de montrer, ou de classer.","","#d9b36a"],["Et Dumbledore ?","Il a disparu. Mort, captif, caché ? Chaque version a ses partisans, et la seule certitude est que celui qui pourrait répondre ne parle plus. Certains l’attendent encore, sans organisation, avec un espoir têtu.","","#d9b36a"],["Une paix qui a un prix","La paix est réelle, mais elle a des règles. Les sorciers sont tenus en haut de l’échelle et les personnes sans pouvoirs magiques dépendent d’eux. Le Bureau de la Révélation promet la clarté, et décide aussi de ce qui doit rester classé.","","#d9b36a"],["Ton personnage dans ce monde","Rien ne t’impose un camp, et personne n’est obligé de toucher au grand mystère. Ton personnage peut adhérer, se taire, douter, résister ou espionner. Il peut aussi simplement vivre sa vie d’étudiant, de fonctionnaire, de commerçant ou de Tuteur.","","#d9b36a"]]},{"n":"II","t":"Le monde au quotidien","s":"Ce que quatre-vingts ans ont changé","c":"#d9a05a","i":"Quatre-vingts ans après le Duel, le monde sorcier n’a plus rien d’une société cachée. Il a ses habitudes, ses fêtes, ses journaux et ses modes. Voici ce qu’un étudiant de 2026 tient pour évident, et qu’un sorcier de 1944 aurait pris pour de la folie.","tl":[],"x":[["Vivre au grand jour","La magie se voit, mais elle s’encadre. Chaque sorcier porte son accréditation et sa baguette est enregistrée. On peut lancer un sort dans la rue, sauf dans les zones où l’Ordre l’interdit. Les Moldus ont appris à ne plus sursauter, et les enfants de sorciers grandissent dans des quartiers où l’on croise les deux mondes.","","#d9b36a"],["Le calendrier de l’Ordre","Deux dates sont devenues des rendez-vous nationaux : le Jour du Dévoilement, célébré en grande pompe, et la Nuit du Duel, que beaucoup passent en silence. Les fêtes anciennes sont restées : Samain, le solstice d’hiver, Beltane.","","#d9b36a"],["La presse et les ondes","La Gazette du sorcier est un quotidien reconnu, que l’Ordre lit de près. Le Chicaneur survit en marge, toléré et lu sous le manteau. À la radio, la Sorcière Radio Réseau accompagne les trajets et les soirées. Sur le forum, la Gazette de REVELIO raconte la vie de l’université.","","#d9b36a"],["Les arts et le sport","Le Quidditch est devenu un sport de stade, retransmis dans les deux mondes. Les tableaux animés, les concerts enchantés et le théâtre de la Révélation font salle comble. Après 1946, on a vu apparaître des modes mixtes : séries, chansons et mode vestimentaire empruntent désormais aux deux univers.","","#d9b36a"],["L’argent","Le gallion est la monnaie du monde sorcier. Gringotts tient les comptes et le change avec les devises moldues. À l’université, on le gagne par ses exploits et on le dépense à Pré-au-Lard.","","#d9b36a"],["Les mots de l’Ordre","La devise « Nihil occultum » orne les édifices officiels. Dans les administrations, on se salue d’un « À la lumière », et l’on répond de même. Beaucoup y voient un simple rituel, certains une façon de se reconnaître.","","#d9b36a"],["Sorciers et personnes sans pouvoirs","Les familles mixtes sont devenues courantes, et les Tuteurs servent d’intermédiaires. Les anciennes insultes sont proscrites par le Bureau de la Révélation, mais elles n’ont pas disparu des conversations privées. La cohabitation est réelle, et les tensions aussi.","","#d9b36a"],["Ce qu’on ne dit pas","Personne ne parle publiquement de Dumbledore, ni de ceux qui l’attendent encore. On évite de poser des questions sur les dossiers classés. À REVELIO, ces silences font partie du jeu.","","#d9b36a"]]},{"n":"III","t":"L’université","s":"Ouverte dès 18 ans","c":"#6fb0cf","i":"Sous l’Ordre, Poudlard est devenu une université. On n’y entre plus enfant, mais en adulte, et on y vit autant qu’on y apprend.","tl":[],"x":[["De l’école à l’université","Le château est le même, mais ses habitants ont changé : des étudiants, des enseignants, des rivalités et des amitiés d’adultes. Ses murs sont plus anciens que n’importe quel pouvoir, et gardent des passages que nul décret ne connaît.","","#d9b36a"],["L’Année de Service","À 17 ans, chaque jeune sorcier accomplit une Année de Service avant de pouvoir prétendre à l’université.","","#d9b36a"],["Entrer à Poudlard","L’université ouvre ses portes à partir de 18 ans, et l’accès est large : la plupart des candidats entrent. Les cursus prestigieux et les postes de pouvoir, eux, sont sélectifs. À son arrivée, chaque étudiant passe sous le Choixpeau pour être réparti dans l’une des quatre maisons.","","#d9b36a"],["Les niveaux de 1 à 7","Sept années d’études. Le niveau 1 à 7 est une progression : il mesure l’avancée de ton personnage, pas son âge. On parle d’« année » comme dans toute université.","","#d9b36a"],["Les préfets et le personnel","Les préfets sont des étudiants. Le personnel (direction, enseignants, gardiens) forme une faction à part, avec son propre écusson.","","#d9b36a"]]},{"n":"IV","t":"Les maisons","s":"Quatre maisons, un choix","c":"#d65a6b","i":"La Répartition est conservée pour tous. Ta maison donne sa couleur à ton profil, son blason à ta fiche et ses valeurs à ton personnage.","tl":[],"x":[["Gryffondor","Courage et audace. Le lion des braves, du rouge et de l’or.","Gryffondor","#d65a6b"],["Serpentard","Ambition et ruse. Le serpent des ambitieux, du vert et de l’argent.","Serpentard","#5fc4a0"],["Serdaigle","Sagesse et savoir. L’aigle des érudits, du bleu et du bronze.","Serdaigle","#6fb0cf"],["Poufsouffle","Loyauté et travail. Le blaireau des fidèles, du jaune et du noir.","Poufsouffle","#d9b650"]]},{"n":"V","t":"Les factions","s":"Cinq factions","c":"#8f94e0","i":"En plus de sa maison, un personnage appartient à une faction. Chacune a son écusson, sa couleur et son rôle dans le monde.","tl":[],"x":[["Personnel de Poudlard","Direction, enseignants et gardiens. Les quatre maisons réunies sous le « H » de l’université, en marron.","Poudlard-4-maisons","#c98a52"],["Ministère de la Magie","Aurors, administration et justice. Le « M » orné, la baguette et la balance, en bleu-violet.","Ministere-de-la-Magie","#8f94e0"],["Sorciers","La communauté magique au sens large. Deux baguettes croisées sur un grimoire ouvert, en bleu acier.","sor","#8fb0d8"],["Mages noirs","Mangemorts et adeptes des arts interdits. Crâne, serpent et ronces, en gris acier.","mag","#aeb6c2"],["Personnes sans pouvoirs magiques","Moldus et Cracmols. Une clé, une baguette brisée et un balai cassé, en brun-or.","mol","#c9a24f"]]},{"n":"VI","t":"Où jouer","s":"Les grands lieux du jeu","c":"#5fc4a0","i":"Le forum est organisé en lieux, du plus grand au plus précis. Une salle, une boutique ou un couloir sont des prophéties ouvertes dans l’espace concerné. Une carte interactive te permet de te repérer et de choisir où jouer.","tl":[],"x":[["Le Quai 9¾","Le point de départ : arrivées, présentations et premières rencontres.","","#d9b36a"],["Le Choixpeau magique","La Répartition de chaque nouvel étudiant.","","#d9b36a"],["Poudlard","Le cœur de la vie universitaire. Le château est découpé en grandes zones : l’aile sud et son horloge, le Grand Escalier, le Grand Hall et le rez-de-chaussée, l’annexe de la bibliothèque, l’aile du Beffroi, l’aile d’Astronomie, et les abords du château.","","#d9b36a"],["Les lieux de vie","Les dortoirs de chaque maison, la salle des préfets, la salle des professeurs et les toilettes abandonnées de Mimi Geignarde ont chacun leur espace. Les salles de cours, les couloirs et les passages secrets sont regroupés à part.","","#d9b36a"],["Pré-au-Lard","Boutiques et ruelles : l’escapade préférée des étudiants, et un lieu de rencontre pour les adultes.","","#d9b36a"],["Le Monde des sorciers","Tout ce qui se passe hors de l’université : hameaux, villes et campagnes, pour que le jeu ne se résume pas à elle.","","#d9b36a"],["La carte interactive","Un clic sur un lieu de la carte t’emmène directement dans son espace. Explorer toute la carte débloque des hauts faits.","","#d9b36a"],["Le Chaudron Baveur et La Pensine","","","#d9b36a"]]},{"n":"VII","t":"Ton personnage","s":"La fiche technique","c":"#d9b650","i":"Créer un personnage, c’est choisir qui il est, puis remplir sa fiche technique. Il a au moins 18 ans à son entrée.","tl":[],"x":[["Choisir sa maison et sa faction","La maison vient de la Répartition. La faction décrit sa place dans le monde.","","#d9b36a"],["Choisir son niveau","De 1 à 7. Un niveau plus élevé donne accès à plus de sorts et de hauts faits.","","#d9b36a"],["Les sortilèges","Les sorts de ton personnage sont rangés dans le grimoire de sa fiche technique. Retrouve le catalogue complet : les types de sorts, les neuf catégories et l’effet de chaque sortilège.","","#d9b650","/h6-guidebook-sorts-et-sortileges"],["Les gallions","Le gallion est à la fois l’expérience et la monnaie de REVELIO. Tu en gagnes en jouant, et tu les dépenses pour progresser ou acheter.","","#d9b36a"],["Faire valider sa fiche","","","#d9b36a"]]},{"n":"VIII","t":"Le karma","s":"Une jauge de lumière et d’ombre","c":"#8fb0d8","i":"Chaque personnage a un karma. Il se lit d’un coup d’œil sur une jauge, dans le profil et sous chacun de ses hiboux.","tl":[],"x":[["Lire la jauge","La jauge indique où se place ton personnage entre lumière et ombre. Elle bouge avec ses actes en RP.","","#d9b36a"],["Comment il évolue","","","#d9b36a"],["À quoi ça sert","","","#d9b36a"]]},{"n":"IX","t":"Les hauts faits","s":"Des objectifs à débloquer","c":"#c98a52","i":"Les hauts faits récompensent ce que ton personnage vit et ce que tu fais sur le forum : écrire, explorer le monde, réussir des épreuves, marquer ta maison.","tl":[],"x":[["Quatre raretés","Un haut fait est commun, rare, épique ou légendaire. La rareté se lit à sa couleur.","","#d9b36a"],["Automatiques ou validés par le staff","Certains se débloquent tout seuls : nombre de hiboux écrits, ancienneté sur le forum, maison et groupe. Les autres sont validés par le staff, qui les inscrit sur ton profil.","","#d9b36a"],["Des exemples","Envoyer son premier hibou, écrire 250 hiboux, jouer dans les six ailes du château, remporter un duel, ou être choisi comme plume du mois.","","#d9b36a"],["Explorer le monde","Une catégorie est dédiée à l’exploration : château, Pré-au-Lard, forêt, hameaux. Certains hauts faits restent secrets jusqu’à leur obtention.","","#d9b36a"],["Maître de Poudlard","Le haut fait ultime, obtenu en réunissant tous les autres.","","#d9b36a"],["La page dédiée","Retrouve la liste complète et ta progression sur la page des hauts faits, accessible depuis le menu.","","#d9b36a"]]},{"n":"X","t":"Le parler de REVELIO","s":"Les mots du forum","c":"#e0b87a","i":"Sur REVELIO, on parle la langue du monde que l’on joue. Quelques mots à connaître, un ton à adopter, et le jeu y gagne en cohérence.","tl":[],"x":[["Pourquoi REVELIO ?","Revelio est le sortilège qui révèle ce qui était caché, et c’est la devise de l’Ordre : « Nihil occultum ». Le forum porte ce nom comme un clin d’œil : ici, tout se révèle, de la vérité d’un personnage aux secrets d’un château.","","#d9b36a"],["Le lexique","Un message est un hibou. Un sujet est une prophétie. La messagerie privée est ta volière. L’inscription passe par le Choixpeau. Ta fiche est la fiche technique, tes exploits sont des hauts faits, et le gallion est à la fois ton expérience et ta monnaie.","","#d9b36a"],["Écrire en RP","On écrit un français soigné, au passé ou au présent, à la troisième personne ou à la première, selon ce qui te convient. Un hibou raconte un moment, pas un chapitre entier.","","#d9b36a"],["Se saluer et s’adresser","Entre étudiants, on se tutoie. On vouvoie le personnel, les représentants du Ministère et les personnes que l’on ne connaît pas encore. On dit « Professeur », « Madame » ou « Monsieur », et les lettres officielles se terminent par « Nihil occultum ».","","#d9b36a"],["Jurons et exclamations","On jure par Merlin, par Morgane ou par la barbe de Merlin. Les jurons du monde réel restent dehors : ils briseraient l’ambiance.","","#d9b36a"],["Hors prophétie","Quand tu sors du RP, signale-le entre parenthèses ou avec la mention « HRP ». On ne mélange pas ce que dit ton personnage et ce que tu penses.","","#d9b36a"]]},{"n":"XI","t":"Prophéties et hiboux","s":"Écrire en RP","c":"#aeb6c2","i":"Le vocabulaire du forum est celui de la magie : on écrit des hiboux, dans des prophéties.","tl":[],"x":[["Une prophétie","Une prophétie est un sujet de RP. Tu peux en entamer une ou rejoindre celle d’un autre personnage.","","#d9b36a"],["Un hibou","Chaque réponse est un hibou. Ton profil garde la liste de tes hiboux et des prophéties où tu apparais.","","#d9b36a"],["Les hiboux privés","Les hiboux privés sont les messages entre membres. Ils partent et arrivent par ta volière.","","#d9b36a"]]},{"n":"XII","t":"Les règles","s":"Vivre ensemble","c":"#c9a24f","i":"Quelques règles simples pour que le jeu reste agréable pour tous. À lire avant ta première prophétie.","tl":[],"x":[["Règles générales","","","#d9b36a"],["Règles du RP","","","#d9b36a"],["Modération et sanctions","","","#d9b36a"]]}];
	function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
	function mount() {
		var host = document.getElementById('rv-guide'); if (!host) { return; }
		var sc = document.querySelector('script[src*="revelio.js"]'), base = sc ? sc.getAttribute('src').replace(/revelio\.js.*$/, '') : 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@main/';
		var cur = 0, m = /ch=(\d+)/.exec(location.hash); if (m) { cur = Math.max(0, Math.min(G.length - 1, parseInt(m[1], 10) - 1)); }
		function draw(go) {
			var c = G[cur], h = '<div class="gd" style="--l:' + c.c + '">';
			h += '<div class="gd-crumb">Guidebook · <b>Chapitre ' + c.n + '</b></div><div class="gd-wrap"><aside class="gd-side"><h2>Guidebook</h2><nav class="gd-nav">';
			G.forEach(function (x, k) { h += '<button type="button" class="gd-nb' + (k === cur ? ' on' : '') + '" data-k="' + k + '" style="--c:' + x.c + '"><em>' + x.n + '</em><span>' + esc(x.t) + '</span></button>'; });
			h += '</nav></aside><article class="gd-main"><div class="gd-kind">Chapitre ' + c.n + '</div><h1>' + esc(c.t) + '</h1><p class="gd-sub">' + esc(c.s) + '</p><div class="gd-rule"></div><p class="gd-intro">' + esc(c.i) + '</p>';
			if (c.tl.length) { h += '<div class="gd-tl">'; c.tl.forEach(function (t) { h += '<div class="gd-tli"><div class="gd-tly">' + esc(t[0]) + '</div><div class="gd-tlm"><i></i></div><div class="gd-tlt"><h4>' + esc(t[1]) + '</h4><p>' + esc(t[2]) + '</p></div></div>'; }); h += '</div>'; }
			c.x.forEach(function (z) {
				h += '<section class="gd-sec" style="--s:' + (z[3] || c.c) + '">' + (z[2] ? '<div class="gd-img"><img src="' + base + 'img/ecussons/' + z[2] + '.png" alt=""></div>' : '') + '<div class="gd-t"><h3>' + esc(z[0]) + '</h3>' + (z[1] ? '<p>' + esc(z[1]) + '</p>' : '<p class="gd-soon">Cette section sera bientôt complétée.</p>') + (z[4] ? '<a class="gd-go" href="' + z[4] + '">Ouvrir le catalogue</a>' : '') + '</div></section>';
			});
			h += '<div class="gd-pager">' + (cur > 0 ? '<button type="button" class="gd-pg" data-k="' + (cur - 1) + '"><small>Chapitre précédent</small><span>' + esc(G[cur - 1].t) + '</span></button>' : '<span></span>') + (cur < G.length - 1 ? '<button type="button" class="gd-pg nx" data-k="' + (cur + 1) + '"><small>Chapitre suivant</small><span>' + esc(G[cur + 1].t) + '</span></button>' : '') + '</div></article></div></div>';
			host.innerHTML = h;
			Array.prototype.forEach.call(host.querySelectorAll('[data-k]'), function (b) { b.onclick = function () { cur = parseInt(b.getAttribute('data-k'), 10); try { history.replaceState(null, '', '#ch=' + (cur + 1)); } catch (e) { } draw(true); }; });
			if (go) { var t = host.getBoundingClientRect().top + window.pageYOffset - 20; window.scrollTo(0, Math.max(0, t)); }
		}
		draw(false);
	}
	setTimeout(mount, 60);
})();

/* ===== REVELIO : Guidebook · Sorts et sortilèges (page contenant <div id="rv-sorts"></div>) ===== */
(function () {
	'use strict';
	if (window.__rvSorts) { return; } window.__rvSorts = 1;
	var D = {"total":118,"v":[{"nm":"Qu’est-ce qu’un sort ?","hd":"Les sorts","ct":"5","c":"#c9a24f","kd":"Chapitre","t":"Les sorts","s":"Une magie maîtrisée","i":"Tout ce qui se fait avec une baguette passe par un sort. Avant d’entrer dans le détail des sortilèges, voici ce qu’il faut savoir sur les sorts en général.","p":[["01","Qu’est-ce qu’un sort ?","Un sort est une manifestation maîtrisée de la magie qui agit sur le monde de façon surnaturelle. Il peut faire apparaître ou disparaître un objet, le transformer, le faire léviter ou agir, et servir au combat pour stupéfier ou protéger. Le faire s’appelle lancer un sort, ou faire de la magie."],["02","Le lancer","En général, on fait un mouvement de baguette précis en prononçant une incantation. Quatre choses comptent : le mouvement, l’incantation, la concentration et l’intention. Si l’une est fausse, le sort échoue ou se retourne contre son lanceur. Les incantations sont le plus souvent latines, comme Accio, parfois anglaises, comme Stupéfix en version française. Certains sorts apparaissent comme un jet de lumière, qui peut rater, être esquivé ou bloqué par un objet ou un autre sort. Les sorciers expérimentés savent aussi lancer un sort sans parler, ou sans baguette, mais c’est bien plus difficile et enseigné en général en sixième année."],["03","Puissance et difficulté","La qualité et la durée d’un sort dépendent de l’énergie produite et de la façon dont le lanceur la transmet. Elle progresse avec l’entraînement et se perd quand on néglige la pratique. Certains sorts sont simples, comme la lévitation ou la transformation d’une allumette en aiguille, et un enfant peut les maîtriser. D’autres, comme le Patronus ou la Métamorphose humaine, donnent du mal même à des sorciers adultes."],["04","Durée et séquelles","La plupart des sorts sont temporaires. Expelliarmus agit en un instant, Stupefy et Petrificus Totalus s’estompent tout seuls, et un contre-sort peut arrêter un effet durable. Un sort s’arrête en général à la mort de son lanceur, mais certaines malédictions anciennes, comme celles des tombeaux égyptiens, résistent. Même quand l’effet cesse, il peut laisser des séquelles : un puissant sortilège d’Oubliettes, un Impero mal lancé ou un Endoloris prolongé peuvent abîmer l’esprit. Le Sortilège de Mort est irréversible, sauf protection sacrificielle ou Horcruxe."],["05","Inventer un sort","Chaque sort a eu un inventeur. Severus Snape est crédité de Levicorpus et de Sectumsempra, inventés alors qu’il était élève. Créer un sort est dangereux : Pandora Lovegood y a laissé la vie. Un nouveau sort peut aussi en rendre un ancien obsolète. Open Sesame arrachait des portes entières, Portaberto n’en détruisait que la serrure, puis Alohomora a tout remplacé en ouvrant sans rien abîmer."]],"b":"Dans le jeu, un sort se lance dans un hibou de RP.","g":[]},{"nm":"Les types de sorts","hd":"","ct":"9","c":"#6fb0cf","kd":"Chapitre","t":"Les types de sorts","s":"Du plus anodin au plus grave","i":"On range les sorts par famille. Les frontières sont souples : la règle simple est qu’un sortilège change la fonction ou les propriétés d’un objet, et qu’une métamorphose change sa forme.","p":[],"b":"","g":[["Métamorphoses","Changent la forme ou l’apparence. La vraie métamorphose transforme un objet existant (Vera Verto change un animal en gobelet) et la conjuration crée à partir de rien (Avis fait apparaître des oiseaux).","#5fc4a0"],["Sortilèges (enchantements)","Donnent de nouvelles propriétés à une cible ou lui font accomplir une action. Plus le sorcier est expérimenté, plus ils durent. Exemple : Expelliarmus.","#6fb0cf"],["Maléfices mineurs (jinx)","Magie noire mineure : petits désagréments, parfois pour rire. L’effet ne dure que tant que le lanceur garde le contact visuel. Exemple : Impedimenta.","#d9b650"],["Maléfices (hex)","Magie noire modérée, qui gêne beaucoup ou fait un peu de mal. Exemple : Densaugeo, qui fait grandir les dents de la cible.","#c98a52"],["Malédictions (curses)","La magie noire la plus grave, aux effets extrêmes. Les trois sortilèges impardonnables en font partie : Avada Kedavra (Sortilège de Mort), Endoloris et Impero.","#d65a6b"],["Contre-sorts","Inversent ou bloquent un autre sort : contre-jinx, contre-malédictions, contre-sortilèges, détransfigurations. Finite Incantatem est un contre-sort général.","#8f94e0"],["Sorts de soin","Améliorent l’état d’un blessé ou d’un malade. Exemple : Episkey pour les blessures légères.","#5fc4a0"],["Quand les catégories se mêlent","La Pétrification est à la fois magie noire et métamorphose. Melofors est un jinx et une conjuration. Feudeymon peut passer pour une conjuration ou une malédiction.","#aeb6c2"],["Les effets visibles","Un sort prend souvent la forme de lumière, d’étincelles ou d’éclairs colorés : rouge pour Stupéfix, vert pour Avada Kedavra. D’autres, comme Accio ou Silencio, ne montrent rien. Harry l’a remarqué : bangs et fumée sont plus souvent la marque de la maladresse que de l’expérience.","#8fb0d8"]]},{"nm":"Les sortilèges","hd":"Les sortilèges","ct":"4","c":"#c9a24f","kd":"Chapitre","t":"Les sortilèges","s":"Ajouter des propriétés à ce qui existe","i":"Les sortilèges sont l’une des grandes branches de la magie. Ils sont enseignés à l’université et servent autant au combat qu’à la vie de tous les jours.","p":[["01","Qu’est-ce qu’un sortilège ?","Un sortilège ajoute ou modifie les propriétés d’un objet ou d’un être vivant, ou l’action qu’il accomplit. La Métamorphose, elle, change ce qu’il est. Les sortilèges sont plus souples et laissent plus de place à l’invention : c’est pourquoi les sorciers en créent plus facilement de nouveaux. Un objet marqué durablement par un sortilège est dit ensorcelé. On parle parfois de sortilèges noirs pour les maléfices et les malédictions."],["02","Bien le lancer","Tout repose sur trois choses : la concentration, un geste de baguette précis et une incantation bien prononcée. Un sort mal lancé peut échouer, ou se retourner contre son auteur. Même bien lancé, il reste dangereux si on ignore ce qu’il fait : Harry en a fait l’amère expérience avec Sectumsempra. Un sortilège s’éteint le plus souvent à la mort de son lanceur, mais certains objets ensorcelés, comme les Vifs d’or ou les Scrutoscopes, gardent leur magie. Et chaque sortilège peut avoir son contre-sort, comme l’Anti-Alohomora."],["03","Ce qu’ils ne peuvent pas faire","On ne ramène pas les morts : la nécromancie est une branche ratée de la magie, et seuls des cadavres peuvent être animés, comme les Inferi. L’amour ne se fabrique pas : les envoûtements ne provoquent qu’une infatuation. Une âme ne se duplique pas. Et plus on touche aux lois fondamentales de la magie, plus les conséquences sont terribles, comme pour un Horcruxe. Voyager dans le temps de plus de cinq heures reste très risqué."],["04","Les apprendre","Les Sortilèges sont une matière obligatoire pendant les cinq premières années à Poudlard, puis facultative en fin de cursus pour qui a eu une bonne note aux B.U.S.E. Les cours sont surtout pratiques et vont des sorts simples, comme Lumos ou la lévitation, aux plus avancés. Un professeur de la matière estimait qu’on progresse mieux quand on s’amuse : les sorts difficiles deviennent plus faciles quand on en fait un jeu."]],"b":"Les sortilèges de ton personnage sont rangés dans le grimoire de sa fiche technique, par catégorie. Chaque sort a un niveau de maîtrise de 1 à 3.","g":[]},{"nm":"Mouvement et objets","hd":"Catalogue","ct":"14","c":"#6fb0cf","kd":"Catalogue","t":"Mouvement et objets","s":"14 sortilèges","i":"Attirer, repousser, soulever, déplacer : les sorts qui font bouger les choses et les gens.","p":[],"b":"","g":[["Accio (Sortilège d’Attraction)","Attire à soi un objet éloigné.","#6fb0cf"],["Depulso","Repousse objets ou créatures loin du lanceur.","#6fb0cf"],["Wingardium Leviosa","Fait voler ou léviter un objet.","#6fb0cf"],["Locomotor","Soulève une cible et la déplace dans toutes les directions.","#6fb0cf"],["Ascendio","Propulse le lanceur vers le haut.","#6fb0cf"],["Arresto Momentum","Ralentit un objet en mouvement.","#6fb0cf"],["Piertotum Locomotor","Anime un objet.","#6fb0cf"],["Carpe Retractum","Crée une corde de lumière rétractable.","#6fb0cf"],["Mobiliarbus","Déplace un arbre ou une plante.","#6fb0cf"],["Mobilicorpus","Déplace le corps d’une personne qui ne peut pas marcher.","#6fb0cf"],["Portus","Transforme un objet ordinaire en Portoloin.","#6fb0cf"],["Glisseo","Transforme un escalier en toboggan.","#6fb0cf"],["Failamalle (Pack)","Range des affaires dans une malle sans y toucher.","#6fb0cf"],["Sortilège de Placement","Pose un objet à l’endroit voulu sans que personne ne le touche.","#6fb0cf"]]},{"nm":"Ouverture et destruction","hd":"","ct":"15","c":"#d9b650","kd":"Catalogue","t":"Ouverture et destruction","s":"15 sortilèges","i":"Ouvrir, fermer, couper, faire gonfler ou exploser : les sorts qui agissent sur la matière.","p":[],"b":"","g":[["Alohomora","Déverrouille portes et fenêtres qui ne sont pas protégées par magie.","#d9b650"],["Collaporta (Colloportus)","Verrouille ou scelle une porte.","#d9b650"],["Aberto","Ouvre portes et fenêtres.","#d9b650"],["Cistem Aperio","Fait sauter malles, coffres et caisses.","#d9b650"],["Dissendium","Révèle un passage caché.","#d9b650"],["Portaberto","Fait sauter une serrure.","#d9b650"],["Diffindo","Coupe avec précision.","#d9b650"],["Reducio","Réduit la taille apparente d’un objet.","#d9b650"],["Engorgio","Fait gonfler la cible, jusqu’à l’explosion si on force.","#d9b650"],["Diminuendo","Rétrécit un objet.","#d9b650"],["Bombarda","Provoque une petite explosion.","#d9b650"],["Bombarda Maxima","Provoque une explosion violente.","#d9b650"],["Deprimo","Perce des trous par explosion.","#d9b650"],["Defodio","Creuse la terre ou la pierre.","#d9b650"],["Finestra","Brise une vitre.","#d9b650"]]},{"nm":"Lumière, feu et eau","hd":"","ct":"14","c":"#d65a6b","kd":"Catalogue","t":"Lumière, feu et eau","s":"14 sortilèges","i":"Éclairer, enflammer, éteindre, geler : les sorts des éléments.","p":[],"b":"","g":[["Lumos","Allume le bout de la baguette.","#d65a6b"],["Lumos Maxima","Produit un éclat aveuglant.","#d65a6b"],["Lumos Solem","Crée un faisceau étroit et brillant.","#d65a6b"],["Nox","Éteint la lumière de la baguette.","#d65a6b"],["Incendio","Met le feu à la cible.","#d65a6b"],["Lacarnum Inflamari","Embrase une cape d’une boule de feu.","#d65a6b"],["Flammes bleues","Feu froid qui se propage sur les objets proches.","#d65a6b"],["Aguamenti","Lance un jet d’eau pure.","#d65a6b"],["Aqua Eructo","Fait jaillir de l’eau, d’une fontaine fine à un jet puissant.","#d65a6b"],["Glacius","Invoque de la glace pour éteindre un feu ou refroidir.","#d65a6b"],["Immobulus","Immobilise instantanément la cible.","#d65a6b"],["Vermillious","Lance des étincelles rouges.","#d65a6b"],["Fumos","Crée un nuage de fumée défensif.","#d65a6b"],["Meteolojinx Recanto","Annule les effets d’un sortilège météo.","#d65a6b"]]},{"nm":"Son et révélation","hd":"","ct":"12","c":"#5fc4a0","kd":"Catalogue","t":"Son et révélation","s":"12 sortilèges","i":"Amplifier, étouffer, révéler : les sorts de l’invisible et du caché.","p":[],"b":"","g":[["Sonorus","Amplifie une voix ou un son.","#5fc4a0"],["Quietus","Atténue un son.","#5fc4a0"],["Silencio","Réduit la cible au silence pour un temps.","#5fc4a0"],["Assurdiato (Muffliato)","Remplit les oreilles proches d’un bourdonnement.","#5fc4a0"],["Illegibilus","Rend un texte illisible.","#5fc4a0"],["Aparecium","Révèle une encre invisible ou un message caché.","#5fc4a0"],["Revelio","Révèle un objet dissimulé.","#5fc4a0"],["Specialis Revelio","Révèle les sortilèges ou maléfices posés sur un objet.","#5fc4a0"],["Prior Incantato","Révèle le dernier sort lancé par une baguette.","#5fc4a0"],["Homenum Revelio","Révèle une présence humaine à proximité.","#5fc4a0"],["Scarpin’s Revelaspell","Identifie les ingrédients d’une potion.","#5fc4a0"],["Point Me","Oriente la baguette vers le nord.","#5fc4a0"]]},{"nm":"Esprit et émotions","hd":"","ct":"11","c":"#8f94e0","kd":"Catalogue","t":"Esprit et émotions","s":"11 sortilèges","i":"Troubler, effacer, apaiser, faire rire : les sorts qui touchent à l’esprit.","p":[],"b":"","g":[["Stupéfix (Stupefy)","Assomme la cible et stoppe un objet en mouvement.","#8f94e0"],["Confundo (Sortilège de Confusion)","Embrouille une personne ou ensorcelle un objet.","#8f94e0"],["Oubliettes (Obliviate)","Efface des souvenirs.","#8f94e0"],["Fausse mémoire","Implante un souvenir qui n’a jamais existé.","#8f94e0"],["Legilimens (Sortilège de legilimancie)","Lit les souvenirs, les émotions et les pensées de la cible.","#8f94e0"],["Sortilège de Bonne Humeur","Rend joyeux. En excès, il provoque un fou rire incontrôlable.","#8f94e0"],["Enchantements d’envoûtement","Émoussent les sens et provoquent une infatuation.","#8f94e0"],["Spero Patronum (Expecto Patronum)","Invoque un gardien argenté qui repousse les Détraqueurs.","#8f94e0"],["Riddikulus","Change un Épouvantard en quelque chose de comique.","#8f94e0"],["Rictusempra","Provoque un fou rire chez la victime.","#8f94e0"],["Tarantallegra","Fait danser les jambes de la victime malgré elle.","#8f94e0"]]},{"nm":"Défense et protection","hd":"","ct":"10","c":"#c98a52","kd":"Catalogue","t":"Défense et protection","s":"10 sortilèges","i":"Boucliers, désarmement et barrières : ce qui protège un sorcier de ses ennemis.","p":[],"b":"","g":[["Protego","Dresse un bouclier invisible autour d’une personne ou d’une zone.","#c98a52"],["Protego Duo","Protège des attaques physiques et magiques.","#c98a52"],["Protego Maxima","Bouclier plus puissant.","#c98a52"],["Protego Horribilis","Protège une vaste zone contre une magie très noire.","#c98a52"],["Protego Totalum","Défend une zone sur la durée.","#c98a52"],["Fianto Duri","Renforce les sorts de bouclier.","#c98a52"],["Repello Inimicum","Avec Protego Maxima, forme une barrière presque infranchissable.","#c98a52"],["Cave Inimicum","Tient les ennemis à distance.","#c98a52"],["Expelliarmus (Sortilège de Désarmement)","Force la victime à lâcher ce qu’elle tient.","#c98a52"],["Arania Exumai","Repousse les araignées, y compris les Acromentules.","#c98a52"]]},{"nm":"Dissimulation et sécurité","hd":"","ct":"13","c":"#aeb6c2","kd":"Catalogue","t":"Dissimulation et sécurité","s":"13 sortilèges","i":"Cacher, alerter, verrouiller : les sorts qui gardent une maison, un lieu ou un secret.","p":[],"b":"","g":[["Fidelitas (Fidelius)","Cache une information dans l’âme du Gardien du Secret.","#aeb6c2"],["Sortilège de Désillusion","Fond la cible dans le décor.","#aeb6c2"],["Sortilège d’Invisibilité","Rend invisible une zone.","#aeb6c2"],["Repello Moldus","Éloigne les Moldus d’un endroit.","#aeb6c2"],["Brouillard du Ministère","Dissimule une zone aux yeux des Moldus.","#aeb6c2"],["Sortilège de Vacarme","Déclenche une alarme stridente quand un intrus entre.","#aeb6c2"],["Anti-Alohomora","Rend une serrure insensible à Alohomora.","#aeb6c2"],["Anti-Transplanage","Empêche de transplaner dans une zone.","#aeb6c2"],["Anti-Triche","Empêche de tricher aux examens.","#aeb6c2"],["Trace","Repère les jeunes sorciers qui font de la magie.","#aeb6c2"],["Sortilège d’Incassabilité","Rend un objet incassable.","#aeb6c2"],["Sortilège d’Imperturbabilité","Pose une barrière magique sur une porte.","#aeb6c2"],["Impossible à localiser","Cache un lieu des cartes.","#aeb6c2"]]},{"nm":"Maison et quotidien","hd":"","ct":"16","c":"#8fb0d8","kd":"Catalogue","t":"Maison et quotidien","s":"16 sortilèges","i":"Nettoyer, réparer, ranger : la magie de tous les jours.","p":[],"b":"","g":[["Récurvite (Scourgify)","Nettoie un objet.","#8fb0d8"],["Tergeo","Aspire liquides, poussière et graisse.","#8fb0d8"],["Skurge","Nettoie l’ectoplasme laissé par les fantômes.","#8fb0d8"],["Sortilège de Remplissage","Remplit un contenant de la boisson qu’il contenait.","#8fb0d8"],["Vaisselle automatique","La vaisselle sale se lave toute seule.","#8fb0d8"],["Chauffe-eau","Chauffe l’eau.","#8fb0d8"],["Molliare","Adoucit une surface, par exemple pour rendre un balai plus confortable.","#8fb0d8"],["Spongify","Rend une surface élastique.","#8fb0d8"],["Duro","Change un objet en pierre.","#8fb0d8"],["Sortilège d’Allègement","Rend les objets lourds plus légers.","#8fb0d8"],["Sortilège de Collage","Fixe un objet en place, de manière réversible.","#8fb0d8"],["Epoximise","Lie deux objets entre eux.","#8fb0d8"],["Reparo","Répare un objet brisé.","#8fb0d8"],["Oculus Reparo","Répare des lunettes.","#8fb0d8"],["Capacious Extremis","Agrandit l’intérieur d’un objet sans changer l’extérieur.","#8fb0d8"],["Deletrius","Désintègre la cible.","#8fb0d8"]]},{"nm":"Balais, nature et divers","hd":"","ct":"13","c":"#c9a24f","kd":"Catalogue","t":"Balais, nature et divers","s":"13 sortilèges","i":"Vol, plantes, créatures et quelques sorts qui ne rentrent nulle part ailleurs.","p":[],"b":"","g":[["Horton-Keitch","Permet aux cavaliers de balai de freiner avec précision.","#c9a24f"],["Sortilège de Freinage","Aide un balai à s’arrêter plus vite.","#c9a24f"],["Sortilège contre les Marche-arrière","Aide un balai rétif à reculer.","#c9a24f"],["Taille-griffes","Coupe les griffes d’un animal, surtout pour soigner les dragons.","#c9a24f"],["Herbivicus","Accélère la pousse des plantes et fait éclore les fleurs.","#c9a24f"],["Croissance des roses","Fait pousser un rosier très vite.","#c9a24f"],["Sortilège de Croissance","Augmente la taille de la cible.","#c9a24f"],["Avis","Invoque une volée d’oiseaux.","#c9a24f"],["Têtenbulle","Entoure la tête d’air pour respirer sous l’eau.","#c9a24f"],["Colovaria","Change la couleur d’un objet ou d’un animal.","#c9a24f"],["Inversion des heures","Remonte le temps jusqu’à cinq heures. Très instable.","#c9a24f"],["Harmonia Nectere Passus","Répare une armoire à disparaître.","#c9a24f"],["Waddiwasi","Projette un objet sur une cible.","#c9a24f"]]}]};
	function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
	function mount() {
		var host = document.getElementById('rv-sorts'); if (!host) { return; }
		var V = D.v, cur = 0, m = /s=(\d+)/.exec(location.hash); if (m) { cur = Math.max(0, Math.min(V.length - 1, parseInt(m[1], 10) - 1)); }
		function draw(go) {
			var c = V[cur], h = '<div class="sg" style="--l:' + c.c + '"><div class="sg-crumb">Guidebook · Sorts et sortilèges · <b>' + esc(c.nm) + '</b></div><div class="sg-wrap"><aside class="sg-side"><h2>Les sorts</h2><p>' + D.total + ' sortilèges recensés</p><nav class="sg-nav">';
			V.forEach(function (x, k) { if (x.hd) { h += '<div class="sg-nh">' + esc(x.hd) + '</div>'; } h += '<button type="button" class="sg-nb' + (k === cur ? ' on' : '') + '" data-k="' + k + '" style="--c:' + x.c + '"><span>' + esc(x.nm) + '</span><em>' + esc(x.ct) + '</em></button>'; });
			h += '</nav></aside><article class="sg-main"><div class="sg-kind">' + esc(c.kd) + '</div><h1>' + esc(c.t) + '</h1><p class="sg-sub">' + esc(c.s) + '</p><p class="sg-intro">' + esc(c.i) + '</p>';
			c.p.forEach(function (s) { h += '<section class="sg-sec"><div class="sg-num">' + s[0] + '</div><div class="sg-sect"><h3>' + esc(s[1]) + '</h3><p>' + esc(s[2]) + '</p></div></section>'; });
			if (c.b) { h += '<div class="sg-box"><small>Dans REVELIO</small><p>' + esc(c.b) + '</p></div>'; }
			if (c.g.length) { h += '<div class="sg-grid">'; c.g.forEach(function (x) { h += '<div class="sg-ch" style="--c:' + x[2] + '"><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>'; }); h += '</div>'; }
			h += '<div class="sg-pager">' + (cur > 0 ? '<button type="button" class="sg-pg" data-k="' + (cur - 1) + '"><small>Précédent</small><span>' + esc(V[cur - 1].nm) + '</span></button>' : '<span></span>') + (cur < V.length - 1 ? '<button type="button" class="sg-pg nx" data-k="' + (cur + 1) + '"><small>Suivant</small><span>' + esc(V[cur + 1].nm) + '</span></button>' : '') + '</div></article></div></div>';
			host.innerHTML = h;
			Array.prototype.forEach.call(host.querySelectorAll('[data-k]'), function (b) { b.onclick = function () { cur = parseInt(b.getAttribute('data-k'), 10); try { history.replaceState(null, '', '#s=' + (cur + 1)); } catch (e) { } draw(true); }; });
			if (go) { window.scrollTo(0, Math.max(0, host.getBoundingClientRect().top + window.pageYOffset - 20)); }
		}
		draw(false);
	}
	setTimeout(mount, 60);
})();

/* ===== REVELIO : La Gazette du sorcier (page contenant <div id="rv-gazette"></div>) ===== */
(function () {
	'use strict';
	if (window.__rvGaz) { return; } window.__rvGaz = 1;
	function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
	var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
	var TITLES = [['plume', 'Choisi par le staff', 'Plume du mois', 'Le meilleur RP du mois.', '#d9b36a'], ['revelation', 'Choisi par le staff', 'Révélation du mois', 'Le meilleur nouveau venu.', '#6fb0cf'], ['esprit', 'Choisi par le staff', 'Esprit de maison', 'Celui qui fait vivre sa maison.', '#5fc4a0'], ['elu', 'Élu par les membres', 'Élu', 'Le favori de la communauté.', '#8f94e0']];
	var HOUSES = [['Gryffondor', '#d65a6b', 'Gryffondor'], ['Serpentard', '#5fc4a0', 'Serpentard'], ['Serdaigle', '#6fb0cf', 'Serdaigle'], ['Poufsouffle', '#d9b650', 'Poufsouffle']];
	var FACTS = [['Personnel de Poudlard', '#c98a52', 'Poudlard-4-maisons'], ['Ministère de la Magie', '#8f94e0', 'Ministere-de-la-Magie'], ['Sorciers', '#8fb0d8', 'sor'], ['Mages noirs', '#aeb6c2', 'mag'], ['Personnes sans pouvoirs magiques', '#c9a24f', 'mol']];
	var STEPS = [['1', 'Les hiboux', 'Chaque hibou écrit rapporte automatiquement des points à %s de son auteur.'], ['2', 'Les votes', 'Les votes ajoutent eux aussi des points.'], ['3', 'Le rythme', 'Un classement chaque mois, un cumul sur l’année, et une Coupe finalisée à la fin de l’année.']];
	var TROPHY = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 6h20v12a10 10 0 0 1-20 0z"/><path d="M14 10H7v3a8 8 0 0 0 8 8M34 10h7v3a8 8 0 0 1-8 8" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="21" y="26" width="6" height="8"/><path d="M15 42h18l-2-8H17z"/></svg>', ORD = ['1er', '2e', '3e', '4e', '5e'];
	function board(list, label, base, data) {
		var mx = 1, any = false, i; list.forEach(function (x) { var d = data[x[0]] || [0, 0]; if (data[x[0]]) { any = true; } mx = Math.max(mx, d[1] || 0); });
		var rk = list.map(function (x, k) { var d = data[x[0]] || [0, 0]; return { x: x, k: k, a: d[1] || 0, m: d[0] || 0 }; });
		rk.sort(function (p, q) { return (q.a - p.a) || (q.m - p.m) || (p.k - q.k); });
		var h = '<div class="gz-board' + (any ? '' : ' gz-pending') + '"><div class="gz-colh"><div class="gz-rk"></div><div class="sp"></div><div class="gz-hm">' + label + '</div><div class="gz-n">Ce mois</div><div class="gz-n">Année</div></div>';
		rk.forEach(function (r, pos) { var x = r.x, d = data[x[0]], has = !!d; d = d || [0, 0]; h += '<div class="gz-row gz-p' + (pos + 1) + '" style="--l:' + x[1] + '"><div class="gz-rk">' + (pos < 3 ? TROPHY : '') + '<b>' + ORD[pos] + '</b></div><img class="gz-crest" src="' + base + 'img/ecussons/' + x[2] + '.png" alt=""><div class="gz-hm"><div class="gz-hn">' + esc(x[0]) + '</div><div class="gz-bar"><i style="width:' + Math.round(100 * (d[1] || 0) / mx) + '%"></i></div></div><div class="gz-n">' + (has ? d[0] : '—') + '</div><div class="gz-n">' + (has ? d[1] : '—') + '</div></div>'; });
		return h + '</div>';
	}
	function steps(who) { var h = '<aside class="gz-side"><h3>Comment les points arrivent</h3>'; STEPS.forEach(function (s) { h += '<div class="gz-step"><em>' + s[0] + '</em><div><b>' + s[1] + '</b><span>' + esc(s[2].replace('%s', who)) + '</span></div></div>'; }); return h + '</aside>'; }
	function mount() {
		var host = document.getElementById('rv-gazette'); if (!host) { return; }
		var data = {}; try { data = JSON.parse(host.getAttribute('data-gz') || '{}'); } catch (e) { }
		var sc = document.querySelector('script[src*="revelio.js"]'), base = sc ? sc.getAttribute('src').replace(/revelio\.js.*$/, '') : 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@main/';
		if (!document.getElementById('rv-fraktur')) { var lk = document.createElement('link'); lk.id = 'rv-fraktur'; lk.rel = 'stylesheet'; lk.href = 'https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap'; document.head.appendChild(lk); }
		var CR = function (n) { return '<img class="gz-mc" src="' + base + 'img/ecussons/' + n + '.png" alt="">'; }, RN = ['I', 'II', 'III', 'IV', 'V'];
		var SIL = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="34" r="19"/><path d="M12 100c0-30 17-42 38-42s38 12 38 42z"/></svg>';
		var now = new Date(), mois = data.mois || (MOIS[now.getMonth()] + ' ' + now.getFullYear()), L = data.laureats || {};
		var h = '<div class="gz"><div class="gz-wrap"><header class="gz-mast"><div class="gz-meta"><span>Hors RP</span><span>Édition de ' + esc(mois) + '</span><span>Revelio</span></div><div class="gz-title">' + CR('Gryffondor') + '<h1>La Gazette du sorcier</h1>' + CR('Serdaigle') + '</div><p class="gz-tag">Les membres du mois et la Coupe des maisons</p></header>';
		h += '<p class="gz-lead">Chaque mois, le staff distingue trois membres et la communauté en élit un quatrième. Pendant ce temps, les maisons et les factions se disputent chacune leur Coupe.</p>';
		h += '<h2 class="gz-h2"><span class="gz-rn">I</span>Les quatre titres du mois</h2><p class="gz-sub">Trois titres sont décernés par le staff, un par le vote des membres.</p><div class="gz-cards">';
		TITLES.forEach(function (t, ti) { var l = L[t[0]]; h += '<article class="gz-card" style="--l:' + t[4] + '"><div class="gz-num">' + RN[ti] + '</div><div class="gz-port">' + (l && l[3] ? '<img class="gz-ph" src="' + esc(l[3]) + '" alt="" referrerpolicy="no-referrer">' : SIL) + '</div><div class="gz-kind">' + t[1] + '</div><h3>' + t[2] + '</h3><p class="gz-d">' + t[3] + '</p><div class="gz-who"><div class="gz-who-in">' + (l ? '<b>' + esc(l[0]) + '</b>' + (l[1] ? '<span>' + esc(l[1]) + '</span>' : '') + (l[2] ? '<p>' + esc(l[2]) + '</p>' : '') : '<b class="gz-soon">À annoncer</b><span>Le lauréat sera dévoilé dans la prochaine Gazette.</span>') + '</div></div></article>'; });
		h += '</div><div class="gz-vote"><p>Le titre d’Élu se joue au vote : les membres élisent celui qu’ils veulent voir à la une du mois.</p></div>';
		h += '<div class="gz-houses"><h2 class="gz-h2"><span class="gz-rn">II</span>La Coupe des maisons</h2><p class="gz-sub">Le classement est publié chaque mois dans la Gazette. Les mois s’additionnent, et la Coupe est finalisée à la fin de l’année.</p><div class="gz-cup">' + board(HOUSES, 'Maison', base, data.maisons || {}) + steps('la maison') + '</div></div>';
		h += '<div class="gz-fact"><h2 class="gz-h2"><span class="gz-rn">III</span>La Coupe des factions</h2><p class="gz-sub">Les cinq factions s’affrontent selon le même principe : un classement publié chaque mois dans la Gazette, un cumul sur l’année, et une Coupe finalisée à la fin de l’année.</p><div class="gz-cup">' + board(FACTS, 'Faction', base, data.factions || {}) + steps('la faction') + '</div></div>';
		if (data.interview && data.interview.qa && data.interview.qa.length) { h += '<h2 class="gz-h2">L’interview du mois</h2><p class="gz-sub">' + esc(data.interview.qui || '') + '</p><div class="gz-int">'; data.interview.qa.forEach(function (q) { h += '<div class="gz-q"><b>' + esc(q[0]) + '</b><p>' + esc(q[1]) + '</p></div>'; }); h += '</div>'; }
		h += '<h2 class="gz-h2">Le règlement</h2><ul class="gz-rules"><li>Le staff choisit la Plume du mois, la Révélation du mois et l’Esprit de maison.</li><li>Les membres élisent l’Élu du mois.</li></ul><div class="gz-end"><a class="gz-btn" href="' + esc((data.interview && data.interview.url) || '/h7-la-gazette-du-sorcier') + '">Interview de l’Élu<span>→</span></a></div><div class="gz-thanks"><div class="gz-th-t">Merci</div><p>Merci à REVELIO et à chacun de ses membres. Vos hiboux, vos votes et vos personnages font vivre Poudlard chaque jour. Cette Gazette est la vôtre.</p></div></div></div>';
		host.innerHTML = h;
	}
	setTimeout(mount, 60);
})();

/* ===== REVELIO : mise en page des messages de la Gazette (premier mot : « LA GAZETTE DU SORCIER ») ===== */
(function () {
	'use strict';
	function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
	function GB() { var sc = document.querySelector('script[src*="revelio.js"]'); return sc ? sc.getAttribute('src').replace(/revelio\.js.*$/, '') : 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@main/'; }
	var OF_IC = { ANNONCE: '<path d="M4 10v4h3l6 4V6L7 10H4zm12-1.5a4 4 0 010 7M18 6a7.5 7.5 0 010 12"/>', REGLEMENT: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>', GAZETTE: '<path d="M4 5h13v14H6a2 2 0 01-2-2zM17 9h3v8a2 2 0 01-2 2M7 9h7M7 13h7"/>', GUIDE: '<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v13"/>', VOTE: '<path d="M5 12l4 4 10-10M4 20h16"/>' };
	var OF_LB = { ANNONCE: 'Annonce', REGLEMENT: 'Règlement', GAZETTE: 'Gazette', GUIDE: 'Guide', VOTE: 'Vote' };
	var OF_HOUSES = ['Gryffondor', 'Serpentard', 'Serdaigle', 'Poufsouffle'], OF_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI'];
	function buildOf(TY, lines, lists, links) {
		var h = '<div class="gp of of-' + TY.toLowerCase() + '"><header class="mast"><div class="emb"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + OF_IC[TY] + '</svg></div><div class="mt"><div class="meta"><span class="kind">' + OF_LB[TY] + '</span><span>Revelio</span></div><h2>' + esc(lines[0]) + '</h2>' + (lines[1] ? '<p class="tag">' + esc(lines[1]) + '</p>' : '') + '</div></header><div class="orn" aria-hidden="true"><i></i><b></b><i></i></div><div class="gp-body">';
		var rest = lines.slice(2), last = rest.length - 1;
		rest.forEach(function (l, k) {
			var m;
			if ((m = /^§L(\d+)§$/.exec(l))) {
				var it = lists[+m[1]].map(function (t) { return t.split(' : '); });
				if (TY === 'ANNONCE') { h += '<dl class="facts">' + it.map(function (x) { return '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x.slice(1).join(' : ')) + '</dd></div>'; }).join('') + '</dl>'; }
				else if (TY === 'REGLEMENT') { h += '<ol class="rules">' + it.map(function (x) { return '<li><b>' + esc(x[0]) + '</b><span>' + esc(x.slice(1).join(' : ')) + '</span></li>'; }).join('') + '</ol>'; }
				else if (TY === 'GAZETTE') { h += '<ul class="gzl">' + it.map(function (x) { var hs = OF_HOUSES.indexOf(x[2] || ''); return '<li>' + (hs >= 0 ? '<img class="cr" src="' + GB() + 'img/ecussons/' + OF_HOUSES[hs] + '.png" alt="">' : '') + '<span class="rk">' + esc(x[0]) + '</span><span class="dots"></span><b>' + esc(x[1] || '') + '</b></li>'; }).join('') + '</ul>'; }
				else if (TY === 'GUIDE') { h += '<ul class="idx">' + it.map(function (x, i) { return '<li><i>' + (OF_ROMAN[i] || i + 1) + '</i><div><b>' + esc(x[0]) + '</b><span>' + esc(x.slice(1).join(' : ')) + '</span></div><em>→</em></li>'; }).join('') + '</ul>'; }
				else { h += '<ul class="opts">' + it.map(function (x) { return '<li><span class="rad"></span><div><b>' + esc(x[0]) + '</b><span>' + esc(x.slice(1).join(' : ')) + '</span></div></li>'; }).join('') + '</ul>'; }
			}
			else if ((m = /^§A(\d+)§$/.exec(l))) { var a = links[+m[1]]; h += '<a class="gp-btn" href="' + esc(a[0]) + '">' + esc(a[1]) + '</a>'; }
			else if (/:$/.test(l)) { h += '<h3>' + esc(l.replace(/\s*:$/, '')) + '</h3>'; }
			else if (k === last && k > 0) { h += '<p class="gp-note">' + esc(l) + '</p>'; }
			else { h += '<p>' + esc(l) + '</p>'; }
		});
		if (TY === 'ANNONCE') { h += '<img class="of-seal" src="' + GB() + 'img/cire.png" alt="">'; }
		return h + '</div></div>';
	}
	function build(c) {
		var cl = c.cloneNode(true), lists = [], links = [], i;
		Array.prototype.forEach.call(cl.querySelectorAll('ul,ol'), function (u) { var items = []; Array.prototype.forEach.call(u.querySelectorAll('li'), function (li) { items.push(li.textContent.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '')); }); lists.push(items); u.parentNode.replaceChild(document.createTextNode('\n§L' + (lists.length - 1) + '§\n'), u); });
		Array.prototype.forEach.call(cl.querySelectorAll('a[href]'), function (a) { links.push([a.getAttribute('href'), a.textContent.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '')]); a.parentNode.replaceChild(document.createTextNode('\n§A' + (links.length - 1) + '§\n'), a); });
		var tmp = document.createElement('div'); tmp.innerHTML = cl.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h\d)>/gi, '\n');
		var lines = (tmp.textContent || '').split('\n').map(function (l) { return l.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, ''); }).filter(Boolean);
		var tm = /^\[?\s*(ANNONCE|R[ÈE]GLEMENT|GAZETTE|GUIDE|VOTE)\s*\]?$/i.exec(lines[0] || ''), TY = null;
		if (tm) { TY = tm[1].toUpperCase().replace('È', 'E'); lines = lines.slice(1); }
		else if (!lines.length || (lines[0].toUpperCase() !== 'LA GAZETTE DU SORCIER' && lines[0].toUpperCase() !== 'LE GUIDEBOOK')) { return null; }
		if (!lines.length) { return null; }
		if (TY) { return buildOf(TY, lines, lists, links); }
		var LB = { ANNONCE: 'Annonce', REGLEMENT: 'Règlement', GAZETTE: 'Gazette', GUIDE: 'Guide', VOTE: 'Vote' };
		var h = '<div class="gp' + (TY ? ' of of-' + TY.toLowerCase() : '') + '"><header class="gp-mast"><div class="gp-meta"><span>' + (TY ? LB[TY] : 'Hors RP') + '</span><span>Revelio</span></div><h2>' + esc(lines[0]) + '</h2>' + (lines[1] ? '<p class="gp-tag">' + esc(lines[1]) + '</p>' : '') + '<div class="gp-crests">' + ['Gryffondor', 'Serpentard', 'Serdaigle', 'Poufsouffle'].map(function (n) { return '<img src="' + GB() + 'img/ecussons/' + n + '.png" alt="">'; }).join('') + '</div></header><div class="gp-body">';
		var rest = lines.slice(2), last = rest.length - 1;
		rest.forEach(function (l, k) {
			var m;
			if ((m = /^§L(\d+)§$/.exec(l))) { h += '<div class="gp-cards">'; lists[+m[1]].forEach(function (t) { var p = t.indexOf(' : '), a = p > 0 ? t.slice(0, p) : '', b = p > 0 ? t.slice(p + 3) : t; h += '<div class="gp-card">' + (a ? '<b>' + esc(a) + '</b>' : '') + '<span>' + esc(b) + '</span></div>'; }); h += '</div>'; }
			else if ((m = /^§A(\d+)§$/.exec(l))) { var a = links[+m[1]]; h += '<a class="gp-btn" href="' + esc(a[0]) + '">' + esc(a[1]) + '</a>'; }
			else if (/:$/.test(l)) { h += '<h3>' + esc(l.replace(/\s*:$/, '')) + '</h3>'; }
			else if (k === last && k > 0) { h += '<p class="gp-note">' + esc(l) + '</p>'; }
			else { h += '<p>' + esc(l) + '</p>'; }
		});
		return h + '</div></div>';
	}
	function run() {
		var L = document.querySelectorAll('.post .content:not([data-rvg])'), i;
		for (i = 0; i < L.length; i++) {
			var c = L[i]; c.setAttribute('data-rvg', '1');
			if (!/LA GAZETTE DU SORCIER|LE GUIDEBOOK|^\s*\[?\s*(ANNONCE|R[ÈE]GLEMENT|GAZETTE|GUIDE|VOTE)\s*\]?/i.test(c.textContent || '')) { continue; }
			var html = build(c); if (!html) { continue; }
			var d = document.createElement('div'); d.innerHTML = html; c.style.display = 'none'; c.parentNode.insertBefore(d.firstChild, c);
			if (!(d.firstChild.className || '').match(/(^|\s)of(\s|$)/)) { var po = c.closest('.post'); if (po) { po.className += ' rv-gazp'; } document.documentElement.className += ' rv-gaz'; }
			var dl = !c.parentNode.querySelector('.of') && /GAZETTE DU/i.test(c.textContent) && /(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i.exec(document.title), sp = document.querySelector('.gp-meta span:first-child'); if (sp && dl) { sp.textContent = 'Édition de ' + dl[1].toLowerCase() + ' ' + dl[2]; }
		}
	}
	setTimeout(run, 70);
})();

/* ===== REVELIO : absences et pauses ===== */
(function () {
	if (window.__rvAbs) { return; } window.__rvAbs = 1;
	function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
	/* 1. badge à côté du nom, d'après le champ de profil « Absence » */
	function badges() {
		var posts = document.querySelectorAll('.post'), i;
		for (i = 0; i < posts.length; i++) {
			var post = posts[i], rows = post.querySelectorAll('.rv-pf'), j, val = '';
			for (j = 0; j < rows.length; j++) {
				var l = rows[j].querySelector('.rv-pfl'), c = rows[j].querySelector('.rv-pfc');
				if (l && /^\s*absence\s*:?\s*$/i.test(l.textContent)) { val = (c ? c.textContent : '').replace(/\s+/g, ' ').trim(); rows[j].style.display = 'none'; }
			}
			if (!val || /^(non|aucune?|présent|-|—)$/i.test(val) || post.querySelector('.rv-absb')) { continue; }
			var host = post.querySelector('.rvb-id') || post.querySelector('.postprofile-name'); if (!host) { continue; }
			var pause = /pause/i.test(val), b = document.createElement('div'); b.className = 'rv-absb ' + (pause ? 'is-pause' : 'is-abs');
			b.innerHTML = '<i></i><b>' + (pause ? 'En pause' : 'Absent') + '</b><span>' + esc(val) + '</span>';
			host.appendChild(b);
		}
	}
	/* 2. message d'absence mis en forme */
	function cards() {
		var cs = document.querySelectorAll('.post .content'), i;
		for (i = 0; i < cs.length; i++) {
			var c = cs[i]; if (c.getAttribute('data-rvabs')) { continue; }
			var t = (c.innerText || '').replace(/\r/g, ''), m = /^\s*(ABSENCE COURTE|PAUSE LONGUE)\s*\n/.exec(t); if (!m) { continue; }
			c.setAttribute('data-rvabs', '1');
			var kind = m[1] === 'PAUSE LONGUE' ? 'pause' : 'abs', lines = t.slice(m[0].length).split('\n'), kv = {}, free = [], k;
			lines.forEach(function (ln) { var x = /^\s*([^:\n]{2,30})\s*:\s*(.+)$/.exec(ln); if (x) { kv[x[1].trim().toLowerCase()] = x[2].trim(); } else if (ln.trim()) { free.push(ln.trim()); } });
			var sc = document.querySelector('script[src*="revelio.js"]'), sb = sc ? sc.getAttribute('src').replace(/revelio\.js.*$/, '') : 'https://cdn.jsdelivr.net/gh/TheDeanGG/RevelioForum@main/';
			var h = '<div class="rv-abc ' + (kind === 'pause' ? 'is-pause' : 'is-abs') + '"><img class="rv-abc-seal" src="' + sb + 'img/cire.png" alt=""><div class="rv-abc-h"><span class="rv-abc-k">' + (kind === 'pause' ? 'Pause longue' : 'Absence courte') + '</span><span class="rv-abc-s">' + (kv['retour'] ? 'Retour prévu · ' + esc(kv['retour']) : '') + '</span></div><div class="rv-abc-b">';
			[['du', 'Depuis le'], ['retour', 'Retour prévu'], ['raison', 'Raison'], ['prophéties', 'Mes prophéties'], ['joignable', 'Joignable']].forEach(function (p) { if (kv[p[0]]) { h += '<div class="rv-abc-r"><em>' + p[1] + '</em><span>' + esc(kv[p[0]]) + '</span></div>'; } });
			h += '</div>' + (free.length ? '<p class="rv-abc-n">' + esc(free.join(' ')) + '</p>' : '') + '</div>';
			c.innerHTML = h;
		}
	}
	/* 1b. vue profil : bandeau + badge d'après la ligne « Absence » */
	function profile() {
		var pv = document.querySelector('.rv-pv'); if (!pv || pv.querySelector('.rv-abp')) { return; }
		var ks = pv.querySelectorAll('.pa-k'), cell = null, i;
		for (i = 0; i < ks.length; i++) { if (/^\s*absence\s*$/i.test(ks[i].textContent)) { cell = ks[i].parentNode; break; } }
		if (!cell) { return; }
		var vEl = cell.querySelector('.pa-v'), val = (vEl ? vEl.textContent : '').replace(/[«»]/g, '').replace(/\s+/g, ' ').trim();
		if (!val || /^(non|aucune?|présent|-|—)$/i.test(val)) { cell.style.display = 'none'; return; }
		var pause = /pause/i.test(val); cell.className += ' pa-abs ' + (pause ? 'is-pause' : 'is-abs');
		var body = pv.querySelector('.pa-body'), n = document.createElement('div'); n.className = 'rv-abp ' + (pause ? 'is-pause' : 'is-abs');
		n.innerHTML = '<i></i><div><b>' + (pause ? 'Ce joueur est en pause' : 'Ce joueur est absent') + '</b><span>' + esc(val) + '. Ses réponses peuvent tarder.</span></div><a href="/h8-absences-pauses">Absences &amp; pauses</a>';
		if (body) { body.parentNode.insertBefore(n, body); } else { pv.insertBefore(n, pv.children[1] || null); }
	}
	function run() { try { badges(); cards(); profile(); } catch (e) { } }
	[80, 600, 1600, 3200].forEach(function (d) { setTimeout(run, d); });

	/* 3. page de déclaration (#rv-absence) */
	function mount() {
		var host = document.getElementById('rv-absence'); if (!host) { return; }
		var data = {}; try { data = JSON.parse(host.getAttribute('data-abs') || '{}'); } catch (e) { }
		var S = { kind: 'abs', sort: 0 }, SORTS = ['Mes prophéties continuent sans moi : mon personnage devient un PNJ.', 'Mes prophéties sont mises en attente jusqu’à mon retour.', 'Mon personnage quitte la scène : à mes partenaires de conclure.'];
		var h = '<div class="ab"><div class="ab-wrap"><header class="ab-mast"><div class="ab-eye">Hors RP</div><h1>Absences &amp; pauses</h1><p class="ab-tag">Prévenir, c’est laisser le jeu vivre sans toi.</p></header>';
		h += '<div class="ab-grid"><form class="ab-form" onsubmit="return false"><div class="ab-step"><em>1</em><h2>Ton absence</h2></div><div class="ab-kinds"><button type="button" class="on" data-k="abs"><b>Absence courte</b><span>Quelques jours, tu reviens vite.</span></button><button type="button" data-k="pause"><b>Pause longue</b><span>Plusieurs semaines, avec une date de retour.</span></button></div>';
		h += '<div class="ab-row"><label>Depuis le<input type="date" id="ab-du"></label><label>Retour prévu<input type="date" id="ab-re"></label></div><label class="ab-l">Raison <i>(facultatif)</i><input type="text" id="ab-ra" maxlength="120" placeholder="Examens, voyage, besoin de souffler…"></label>';
		h += '<div class="ab-step"><em>2</em><h2>Tes prophéties</h2></div><div class="ab-sorts">' + SORTS.map(function (s, i) { return '<button type="button"' + (i === 0 ? ' class="on"' : '') + ' data-s="' + i + '">' + s + '</button>'; }).join('') + '</div><label class="ab-l">Joignable pour te prévenir <i>(facultatif)</i><input type="text" id="ab-jo" maxlength="80" placeholder="Beuglante, Discord…"></label><label class="ab-l">Un mot pour tes partenaires <i>(facultatif)</i><input type="text" id="ab-mo" maxlength="160"></label></form>';
		h += '<aside class="ab-out"><div class="ab-step"><em>3</em><h2>Copie et colle</h2></div><div class="ab-box"><div class="ab-bt">Dans ton profil, champ « Absence »</div><code id="ab-p"></code><button type="button" class="ab-cp" data-c="p">Copier</button><a class="ab-go" href="/profile?mode=editprofile" target="_blank" rel="noopener">Ouvrir mon profil</a></div><div class="ab-box"><div class="ab-bt">Le message à poster</div><pre id="ab-m"></pre><button type="button" class="ab-cp" data-c="m">Copier</button>' + (data.url ? '<a class="ab-go" href="' + esc(data.url) + '" target="_blank" rel="noopener">Aller poster</a>' : '') + '</div></aside></div>';
		h += '<section class="ab-rules"><h2>Comment ça marche</h2><div class="ab-cols"><div><b>Absence courte</b><p>Jusqu’à deux semaines. Un message suffit, tes prophéties peuvent continuer sans toi ou attendre.</p></div><div><b>Pause longue</b><p>De deux semaines à trois mois. Indique une date de retour ; à ton retour, retire le mot de ton profil.</p></div><div><b>Sans nouvelles</b><p>Au-delà de trois mois sans signe, le staff te contacte avant de libérer ton personnage.</p></div></div></section></div></div>';
		host.innerHTML = h;
		function fd(v) { if (!v) { return ''; } var p = v.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
		function g(id) { return host.querySelector('#' + id); }
		function upd() {
			var du = fd(g('ab-du').value), re = fd(g('ab-re').value), ra = g('ab-ra').value.trim(), jo = g('ab-jo').value.trim(), mo = g('ab-mo').value.trim(), pause = S.kind === 'pause';
			g('ab-p').textContent = (pause ? 'Pause longue' : 'Absent') + (re ? (pause ? ', retour le ' : ' jusqu’au ') + re : '');
			var m = (pause ? 'PAUSE LONGUE' : 'ABSENCE COURTE') + '\n'; if (du) { m += 'Du : ' + du + '\n'; } if (re) { m += 'Retour : ' + re + '\n'; } if (ra) { m += 'Raison : ' + ra + '\n'; } m += 'Prophéties : ' + SORTS[S.sort] + '\n'; if (jo) { m += 'Joignable : ' + jo + '\n'; } if (mo) { m += mo + '\n'; }
			g('ab-m').textContent = m.replace(/\n$/, '');
		}
		host.addEventListener('click', function (e) {
			var b = e.target.closest('button'); if (!b) { return; }
			if (b.getAttribute('data-k')) { S.kind = b.getAttribute('data-k'); [].forEach.call(host.querySelectorAll('.ab-kinds button'), function (x) { x.classList.toggle('on', x === b); }); upd(); }
			else if (b.getAttribute('data-s')) { S.sort = +b.getAttribute('data-s'); [].forEach.call(host.querySelectorAll('.ab-sorts button'), function (x) { x.classList.toggle('on', x === b); }); upd(); }
			else if (b.getAttribute('data-c')) { var t = g('ab-' + b.getAttribute('data-c')).textContent; var done = function () { b.textContent = 'Copié'; setTimeout(function () { b.textContent = 'Copier'; }, 1600); }; if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(done, done); } else { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (x) { } document.body.removeChild(ta); done(); } }
		});
		host.addEventListener('input', upd); upd();
	}
	setTimeout(mount, 60);
})();
