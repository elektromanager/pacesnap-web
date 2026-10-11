// German/English for every page. The choice comes from ?lang=, then the
// visitor's earlier pick, then the browser language (German → de, else en).
// Elements with data-t="key" get the text of that key; onChange can render
// anything more complex.
(function () {
  const KEY = 'pacesnap_lang';
  let lang = 'en';

  function load() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'de' || fromUrl === 'en') return fromUrl;
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'de' || saved === 'en') return saved;
    } catch (_) {}
    return (navigator.language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en';
  }

  window.currentLang = () => lang;

  window.initI18n = function (texts, onChange) {
    function apply(next) {
      lang = next;
      const t = texts[lang];
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-t]').forEach(el => {
        const v = t[el.dataset.t];
        if (typeof v === 'string') el.textContent = v;
      });
      document.querySelectorAll('[data-href-' + lang + ']').forEach(a =>
        a.href = a.getAttribute('data-href-' + lang));
      document.querySelectorAll('[data-lang]').forEach(b =>
        b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
      if (onChange) onChange(t);
    }
    document.querySelectorAll('[data-lang]').forEach(b =>
      b.addEventListener('click', () => {
        try { localStorage.setItem(KEY, b.dataset.lang); } catch (_) {}
        apply(b.dataset.lang);
      }));
    apply(load());
  };
})();
