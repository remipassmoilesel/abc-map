const defaultLang = 'en';

initApi();
initI18n();
initExternalLinks();
initImageZoom();

function initApi() {
  window.abc = {
    ...window.abc,
    openInMainApp: function () {
      const parts = document.location.pathname.split('/').filter((v) => !!v.trim());
      const lang = parts[1] || defaultLang;
      const path = parts.slice(2).join('/');
      const destination = '/' + [lang, 'modules/documentation', path].join('/');

      console.log('Opening ' + destination);
      document.location.href = destination;
    },
    tableOfContent: function () {
      const parts = document.location.pathname.split('/').filter((v) => !!v.trim());
      const lang = parts[1] || defaultLang;
      const destination = '/documentation/' + lang + '/';

      console.log('Opening ' + destination);
      document.location.href = destination;
    },
  };
}

function initI18n() {
  let langMatch = document.location.pathname.match(/\/([a-z]{2})\//i);
  const lang = langMatch ? langMatch[1] : defaultLang;

  i18next.init({
    lng: lang,
    debug: true,
    resources: abc.documentationTranslations,
  });

  for (const node of document.querySelectorAll('[data-i18n]')) {
    node.innerHTML = i18next.t(node.dataset['i18n']);
  }
}

function initExternalLinks() {
  document.querySelectorAll('a').forEach((element) => {
    const href = element?.getAttribute('href')?.trim().toLowerCase();
    const isExternal = href && (href.startsWith('http') || href.startsWith('www'));
    if (isExternal) {
      element.setAttribute('target', '_blank');
    }
  });
}

function initImageZoom() {
  ['figure img', 'figure picture'].forEach((selector) => {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((node) => {
      node.style.cursor = 'pointer';

      node.addEventListener('click', () => {
        window.location.assign(node.src);
      });
    });
  });
}
