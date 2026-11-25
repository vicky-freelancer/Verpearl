const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "website");
const dist = path.join(root, "dist");
const pdfDir = path.join(dist, "assets", "pdfs");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(source, dist, { recursive: true });

const cataloguePath = path.join(dist, "catalogue.html");
let html = fs.readFileSync(cataloguePath, "utf8");
const pattern = /href="\.\.\/([^"]+\.pdf)"/g;
const pdfRefs = Array.from(html.matchAll(pattern), (match) => match[1]);

if (pdfRefs.length) {
  fs.mkdirSync(pdfDir, { recursive: true });
  pdfRefs.forEach((ref) => {
    const fileName = decodeURIComponent(ref);
    fs.copyFileSync(path.join(root, fileName), path.join(pdfDir, fileName));
  });
  html = html.replace(pattern, 'href="assets/pdfs/$1"');
  fs.writeFileSync(cataloguePath, html);
}

const pages = fs.readdirSync(dist).filter((file) => file.endsWith(".html")).length;
console.log(`Built ${pages} pages and ${pdfRefs.length} catalogues into dist/`);
