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
      ['Hors RP', ['multicomptes', 'credits', 'discord']]
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
		if (!root) { return; }
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
		root.className = (root.className ? root.className + ' ' : '') + 'hf-root';
		if (!uid) { root.appendChild(h('div', 'hf-empty', 'Connecte-toi pour voir tes hauts-faits.')); return; }
		root.appendChild(h('div', 'hf-empty', 'Chargement des hauts-faits…'));

		function fields(doc) {
			var out = {};
			Array.prototype.forEach.call(doc.querySelectorAll('dl'), function (dl) {
				var dts = dl.querySelectorAll('dt'), dds = dl.querySelectorAll('dd');
				if (dts.length === 1 && dds.length >= 1) {
					var k = norm(dts[0].textContent);
					if (k && !(k in out)) { out[k] = dds[0].textContent.replace(/ /g, ' ').replace(/^\s+|\s+$/g, ''); out[k + '#html'] = dds[0]; }
				}
			});
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
			var staff = parseStaff(f['hauts faits#html']);
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
			var name = (!qs && ud.username) ? String(ud.username) : '';
			if (!name) { var t = (doc.title || '').split(' - ')[0].replace(/^Profil de\s*/i, '').replace(/^Voir le profil\s*:?\s*/i, ''); name = t || 'ce membre'; }
			render(build(f, name), name, f, { cat: 0, st: 0 });
		};
		xhr.onerror = function () { root.innerHTML = ''; root.appendChild(h('div', 'hf-empty', 'Impossible de charger le profil.')); };
		xhr.send();
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();
