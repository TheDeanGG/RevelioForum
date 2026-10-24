/* REVELIO — animation « Revelio » à l'ouverture d'un spoiler */
(function () {
  if (window.__rvSp) { return; } window.__rvSp = 1;
  document.addEventListener('click', function (e) {
    var h = e.target.closest ? e.target.closest('.sp-head') : null; if (!h) { return; }
    var w = h.parentNode, b = w.querySelector('.sp-body'); if (!b) { return; }
    setTimeout(function () {
      var open = b.offsetParent !== null && getComputedStyle(b).display !== 'none';
      var old = b.querySelector('.rv-rv'); if (old) { old.parentNode.removeChild(old); }
      var inn = b.querySelector('.rv-in'); if (inn) { while (inn.firstChild) { b.insertBefore(inn.firstChild, inn); } b.removeChild(inn); }
      w.className = w.className.replace(/\s*rv-open/, '');
      if (!open || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) { return; }
      w.className += ' rv-open';
      var d = document.createElement('div'); d.className = 'rv-in';
      while (b.firstChild) { d.appendChild(b.firstChild); } b.appendChild(d);
      var r = document.createElement('div'); r.className = 'rv-rv'; r.setAttribute('aria-hidden', 'true');
      'Revelio'.split('').forEach(function (c, i) { var s = document.createElement('span'); s.style.setProperty('--i', i); s.textContent = c; r.appendChild(s); });
      b.appendChild(r);
    }, 30);
  });
})();
