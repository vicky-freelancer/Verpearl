(() => {
  const root = document.querySelector('[data-page-browser]');
  if (!root) return;
  const category = root.querySelector('#source-category');
  const collection = root.querySelector('#source-collection');
  const grid = root.querySelector('[data-page-grid]');
  const status = root.querySelector('[data-page-status]');
  const previous = root.querySelector('[data-page-previous]');
  const next = root.querySelector('[data-page-next]');
  let sources = [];
  let current = 0;
  let hasRendered = false;
  const pageSize = 12;
  const pdfLinks = Array.from(document.querySelectorAll('.catalogue-item__link[href], .catalogue-item[href]'));

  function selectedPages() {
    return sources.filter(source => (!category.value || source.category === category.value) && (!collection.value || source.slug === collection.value))
      .flatMap(source => Array.from({length: source.pages}, (_, i) => ({source, page: i + 1})));
  }
  function render() {
    const pages = selectedPages();
    current = Math.max(0, Math.min(current, Math.max(0, Math.ceil(pages.length / pageSize) - 1)));
    grid.replaceChildren();
    pages.slice(current * pageSize, (current + 1) * pageSize).forEach(({source, page}, index) => {
      const card = document.createElement('a');
      card.className = 'source-page';
      const link = pdfLinks.find(item => decodeURIComponent(item.getAttribute('href')).endsWith(source.filename));
      card.href = link ? `${link.getAttribute('href')}#page=${page}` : '#';
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      const image = document.createElement('img');
      image.src = `assets/catalogue-pages/${source.slug}/${String(page).padStart(3, '0')}.webp`;
      image.alt = `${source.title}, page ${page}`;
      image.loading = 'lazy';
      const label = document.createElement('span');
      label.textContent = `${source.title} · Page ${page}`;
      card.append(image, label);
      grid.append(card);
      if (hasRendered && card.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        card.animate(
          [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 280, delay: Math.min(index, 5) * 35, easing: 'ease-out', fill: 'backwards' }
        );
      }
    });
    hasRendered = true;
    status.textContent = pages.length ? `Showing ${current * pageSize + 1}–${Math.min((current + 1) * pageSize, pages.length)} of ${pages.length} pages` : 'No pages found';
    previous.disabled = current === 0;
    next.disabled = (current + 1) * pageSize >= pages.length;
  }
  function updateCollections() {
    collection.replaceChildren(new Option('All collections', ''));
    sources.filter(source => !category.value || source.category === category.value).forEach(source => collection.add(new Option(source.title, source.slug)));
    current = 0;
    render();
  }
  category.addEventListener('change', updateCollections);
  collection.addEventListener('change', () => { current = 0; render(); });
  previous.addEventListener('click', () => { current--; render(); });
  next.addEventListener('click', () => { current++; render(); });
  fetch('assets/catalogue-pages/sources.json').then(response => {
    if (!response.ok) throw new Error('Catalogue data unavailable');
    return response.json();
  }).then(data => {
    sources = data;
    [...new Set(sources.map(source => source.category))].forEach(name => category.add(new Option(name, name)));
    updateCollections();
  }).catch(() => { status.textContent = 'The page browser could not be loaded. Open a PDF below to view the catalogue.'; });
})();
