from pathlib import Path

path = Path('website/catalogue.html')
html = path.read_text(encoding='utf-8')
marker = '    <main id="main">'
section = '''
      <section class="section section--tight" data-page-browser>
        <div class="container">
          <div class="section-head"><div class="section-head__copy">
            <span class="eyebrow">Explore the source catalogues</span>
            <h2>Browse every catalogue page.</h2>
            <p>Choose a category and collection. Select a page to open the original PDF with its product details and specifications.</p>
          </div></div>
          <div class="source-filters">
            <label>Category <select id="source-category"><option value="">All categories</option></select></label>
            <label>Collection <select id="source-collection"><option value="">All collections</option></select></label>
          </div>
          <p data-page-status role="status">Loading catalogue pages…</p>
          <div class="source-grid" data-page-grid></div>
          <div class="source-pagination"><button class="btn btn--dark" type="button" data-page-previous>Previous</button><button class="btn btn--dark" type="button" data-page-next>Next</button></div>
        </div>
      </section>'''
if 'data-page-browser' not in html:
    html = html.replace(marker, marker + section, 1)
    html = html.replace('<script src="assets/js/main.js" defer></script>', '<script src="assets/js/main.js" defer></script>\n    <script src="assets/js/catalogue-browser.js" defer></script>')
    path.write_text(html, encoding='utf-8')
