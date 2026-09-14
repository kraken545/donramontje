/* DON RAMON JETFUEL — interacciones */
(function () {
  'use strict';

  var D = window.DR_DATA;
  if (!D) return;

  var body = document.body;
  var LANG_KEY = 'dr-lang';
  var CUR_KEY = 'dr-cur';

  function waLink(text) {
    return 'https://wa.me/' + D.contact.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  /* ---------- i18n ---------- */
  function setLang(lang) {
    body.dataset.lang = lang;
    body.lang = lang;
    var dict = D.i18n[lang] || D.i18n.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (dict[k] !== undefined) el.textContent = dict[k];
    });
    var toggle = document.getElementById('langToggle');
    if (toggle) toggle.textContent = lang === 'en' ? 'ES' : 'EN';
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    renderMenu();
    renderLocation();
    renderFooter();
    applyMenuTheme(menuTheme);
    document.getElementById('menuIgLink').textContent = dict['menu.more'];
    document.getElementById('menuIgLink').innerHTML = dict['menu.more'] + ' <span aria-hidden="true">&rarr;</span>';
  }

  var lang = 'en';
  try { lang = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) {}
  if (D.i18n && !D.i18n[lang]) lang = 'en';

  document.getElementById('langToggle').addEventListener('click', function () {
    setLang(body.dataset.lang === 'en' ? 'es' : 'en');
  });

  /* ---------- menú ---------- */
  var currency = 'usd';
  try { currency = localStorage.getItem(CUR_KEY) || 'usd'; } catch (e) {}

  function renderMenu() {
    var dict = D.i18n[body.dataset.lang] || D.i18n.en;
    var panels = document.getElementById('menuPanels');
    panels.innerHTML = '';
    D.menu.forEach(function (cat) {
      var panel = document.createElement('div');
      panel.className = 'menu-panel';

      var head = document.createElement('div');
      head.className = 'menu-cat-head';
      var kicker = document.createElement('p');
      kicker.className = 'menu-cat-kicker badge-bangers';
      kicker.textContent = (cat.kicker && (cat.kicker[body.dataset.lang] || cat.kicker.en)) || cat.label.en;
      var title = document.createElement('h3');
      title.className = 'menu-cat-title';
      title.textContent = cat.label[body.dataset.lang] || cat.label.en;
      head.appendChild(kicker);
      head.appendChild(title);
      panel.appendChild(head);

      var note = document.createElement('p');
      note.className = 'menu-note';
      note.textContent = cat.note[body.dataset.lang] || cat.note.en;
      panel.appendChild(note);

      var list = document.createElement('div');
      list.className = 'menu-list';
      cat.items.forEach(function (item) {
        var row = document.createElement('div');
        row.className = 'menu-row';

        var top = document.createElement('div');
        top.className = 'menu-row-top';

        var name = document.createElement('span');
        name.className = 'menu-row-name';
        name.textContent = item.name[body.dataset.lang] || item.name.en;

        var dots = document.createElement('span');
        dots.className = 'menu-row-dots';
        dots.setAttribute('aria-hidden', 'true');

        var price = document.createElement('span');
        price.className = 'menu-row-price';
        var val = item.price[currency];
        price.textContent = currency === 'usd' ? ('$' + val) : String(val);
        var curLabel = document.createElement('span');
        curLabel.className = 'cur';
        curLabel.textContent = currency.toUpperCase();
        price.appendChild(curLabel);

        top.appendChild(name);
        top.appendChild(dots);
        top.appendChild(price);
        row.appendChild(top);

        if (item.desc) {
          var desc = document.createElement('p');
          desc.className = 'menu-row-desc';
          desc.textContent = item.desc[body.dataset.lang] || item.desc.en;
          row.appendChild(desc);
        }
        list.appendChild(row);
      });
      panel.appendChild(list);
      panels.appendChild(panel);
    });
  }

  document.querySelectorAll('.currency-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      currency = btn.getAttribute('data-cur');
      document.querySelectorAll('.currency-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      try { localStorage.setItem(CUR_KEY, currency); } catch (e) {}
      renderMenu();
    });
  });
  var savedCur = document.querySelector('.currency-btn[data-cur="' + currency + '"]');
  if (savedCur) savedCur.classList.add('active');

  /* ---------- tema claro/oscuro (solo sección menú) ---------- */
  var MENU_THEME_KEY = 'dr-menu-theme';
  var menuSection = document.getElementById('menu');
  var menuTheme = 'dark';
  try { menuTheme = localStorage.getItem(MENU_THEME_KEY) || 'dark'; } catch (e) {}

  function applyMenuTheme(t) {
    menuTheme = t;
    menuSection.setAttribute('data-theme', t);
    var dict = D.i18n[body.dataset.lang] || D.i18n.en;
    var btn = document.getElementById('menuThemeToggle');
    var icon = btn.querySelector('.theme-icon');
    var label = btn.querySelector('.theme-label');
    if (t === 'light') {
      icon.textContent = '\u263E';
      label.textContent = dict['menu.themeDark'];
      btn.setAttribute('aria-pressed', 'true');
    } else {
      icon.textContent = '\u2600';
      label.textContent = dict['menu.themeLight'];
      btn.setAttribute('aria-pressed', 'false');
    }
    try { localStorage.setItem(MENU_THEME_KEY, t); } catch (e) {}
  }

  document.getElementById('menuThemeToggle').addEventListener('click', function () {
    applyMenuTheme(menuTheme === 'light' ? 'dark' : 'light');
  });

  /* ---------- ubicación / horarios ---------- */
  function compactHours() {
    var l = body.dataset.lang;
    var parts = [];
    var open = D.hours.filter(function (h) { return h.time; });
    var i = 0;
    while (i < open.length) {
      var j = i;
      while (j + 1 < open.length && open[j + 1].time === open[i].time) j++;
      var range = open[i].dayShort[l] + (j > i ? '\u2013' + open[j].dayShort[l] : '');
      parts.push(range + ' ' + open[i].time);
      i = j + 1;
    }
    return parts.join(' \u00B7 ');
  }

  function renderLocation() {
    var dict = D.i18n[body.dataset.lang] || D.i18n.en;
    var addr = document.getElementById('locationAddress');
    addr.textContent = D.location.address[body.dataset.lang] || D.location.address.en;

    var today = (new Date().getDay() + 6) % 7; // 0 = lunes ... 6 = domingo
    var hoursList = document.getElementById('hoursList');
    hoursList.innerHTML = '';
    D.hours.forEach(function (h, i) {
      var li = document.createElement('li');
      if (i === today) li.className = 'is-today';
      var day = document.createElement('span');
      day.className = 'h-day';
      day.textContent = h.day[body.dataset.lang] || h.day.en;
      var time = document.createElement('span');
      time.className = 'h-time';
      time.textContent = h.time || dict.closed;
      li.appendChild(day);
      li.appendChild(time);
      hoursList.appendChild(li);
    });

    var mapFrame = document.getElementById('mapFrame');
    if (D.location.mapsEmbed) {
      mapFrame.innerHTML = '<iframe src="' + D.location.mapsEmbed + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Don Ramon Jetfuel location map" allowfullscreen></iframe>';
    } else {
      mapFrame.innerHTML = '<div class="map-placeholder"><span class="pin">&#128205;</span><p>' + dict['loc.hours'] + '</p></div>';
    }
    document.getElementById('mapDirections').href = D.location.mapsLink;
    document.getElementById('heroHoursText').textContent = compactHours();
  }

  function renderFooter() {
    var dict = D.i18n[body.dataset.lang] || D.i18n.en;
    var lines = D.hours
      .filter(function (h) { return h.time; })
      .map(function (h) { return (h.day[body.dataset.lang] || h.day.en) + ': ' + h.time; });
    document.getElementById('footerHours').innerHTML = lines.length
      ? lines.join('<br>')
      : dict['loc.hours'] + ': —';
  }

  /* ---------- galería + lightbox ---------- */
  function renderGallery() {
    var grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    D.gallery.forEach(function (img) {
      var a = document.createElement('a');
      a.className = 'gallery-item';
      a.href = img.src.replace('-grid.', '-hero.');
      a.setAttribute('data-alt', img.alt);
      var el = document.createElement('img');
      el.src = img.src;
      el.alt = img.alt;
      el.loading = 'lazy';
      el.width = 720;
      el.height = 540;
      a.appendChild(el);
      grid.appendChild(a);
    });
  }

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  document.getElementById('galleryGrid').addEventListener('click', function (e) {
    var item = e.target.closest('.gallery-item');
    if (!item) return;
    e.preventDefault();
    lightboxImg.src = item.href;
    lightboxImg.alt = item.getAttribute('data-alt') || '';
    lightbox.hidden = false;
    body.style.overflow = 'hidden';
  });
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    body.style.overflow = '';
  }
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  /* ---------- contactos ---------- */
  function setupContact() {
    var orderText = body.dataset.lang === 'es' ? '¡Hola Don Ramon Jetfuel! Quiero hacer un pedido.' : 'Hi Don Ramon Jetfuel! I want to place an order.';
    var orderHref = waLink(orderText);
    document.getElementById('headerOrderBtn').href = orderHref;
    document.getElementById('heroOrderBtn').href = orderHref;
    document.getElementById('stickyOrderBtn').href = orderHref;
    document.getElementById('waCard').href = orderHref;
    document.getElementById('igCard').href = D.contact.instagram;
    document.getElementById('menuIgLink').href = D.contact.instagram;
    document.getElementById('telCard').href = D.contact.phone;
    document.getElementById('phoneNumber').textContent = D.contact.phoneDisplay;
    document.getElementById('igHandle').textContent = D.contact.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@');
  }

  /* ---------- nav móvil / scrollspy / sticky CTA ---------- */
  var burger = document.getElementById('navBurger');
  var nav = document.getElementById('mainNav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  var sections = ['home', 'menu', 'about', 'gallery', 'location', 'contact'];
  var navLinks = document.querySelectorAll('.nav-link');
  var stickyCta = document.getElementById('stickyCta');
  var heroEl = document.getElementById('home');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  window.addEventListener('scroll', function () {
    stickyCta.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
  }, { passive: true });

  /* ---------- hero imagen ---------- */
  var heroImg = document.getElementById('heroImg');
  if (heroImg) { heroImg.src = D.heroImage; heroImg.alt = D.heroAlt; }

  /* ---------- init ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  renderGallery();
  setLang(lang);
  setupContact();
  renderMenu();
  renderLocation();
  renderFooter();

  document.documentElement.style.visibility = '';
})();
