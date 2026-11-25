"""Render source catalogue pages for the website's visual catalogue browser."""
from pathlib import Path
import json
import pymupdf

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'website' / 'assets' / 'catalogue-pages'
SOURCES = [
    ('wood', 'Carving Wood', 'Ceramics', 'CARVING WOOD.pdf'),
    ('satatuario-1', 'Satatuario Collection Vol. 1', 'Ceramics', 'SATATUARIO COLEECTION VOL-1_600X1200MM.pdf'),
    ('satatuario-2', 'Satatuario Collection Vol. 2', 'Ceramics', 'SATATUARIO COLEECTION VOL-2_600X1200MM.pdf'),
    ('surfaces', 'Surface Collection', 'Ceramics', 'Untitled.pdf'),
    ('sanitary', 'Velpearl 170 Series', 'Sanitaryware', 'VELPEARL - 170 - FB - 10 SET.pdf'),
    ('fittings', 'Velpearl Fittings', 'Fittings', 'VELPEARL FITTINGS - 170 - FB - 10 NOS.pdf'),
    ('sinks', 'Velpearl Catalogue 2025–26', 'Kitchen sinks', 'VELPEARL_CATALOGUE_2025-26_FINAL_ADDRESS-1.pdf'),
]

OUTPUT.mkdir(parents=True, exist_ok=True)
sources = []
for slug, title, category, filename in SOURCES:
    doc = pymupdf.open(ROOT / filename)
    folder = OUTPUT / slug
    folder.mkdir(exist_ok=True)
    for index, page in enumerate(doc):
        pix = page.get_pixmap(matrix=pymupdf.Matrix(0.6, 0.6), alpha=False)
        pix.pil_save(folder / f'{index + 1:03}.webp', format='WEBP', quality=78)
    sources.append(dict(slug=slug, title=title, category=category, filename=filename, pages=len(doc)))
    print(title, len(doc), flush=True)
(OUTPUT / 'sources.json').write_text(json.dumps(sources, ensure_ascii=False, indent=2), encoding='utf-8')
