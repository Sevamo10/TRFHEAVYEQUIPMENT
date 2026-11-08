/* Genera en HTML estático (visible para Google y asistentes de IA):
   - las 3 tarjetas más recientes en index.html
   - todas las tarjetas en blog/index.html
   - sitemap.xml
   Uso: node tools/generar-blog.js   (después de agregar un artículo en assets/posts.js) */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.join(__dirname, "..");
const DOMINIO = "https://trf-digital-marketing.vercel.app"; // cambiar al comprar dominio propio

const ctx = {};
vm.runInNewContext(fs.readFileSync(path.join(RAIZ, "assets/posts.js"), "utf8") + ";this.P=TRF_POSTS;this.F=trfFecha;", ctx);
const posts = ctx.P, fecha = ctx.F;

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function tarjeta(p, base) {
  const url = base + p.slug + ".html";
  return `<article class="pcard" data-cat="${esc(p.categoria)}">` +
    `<a class="ph" href="${url}" tabindex="-1" aria-hidden="true"><img loading="lazy" alt="" width="800" height="500" src="${p.img}?w=800&q=65&auto=format&fit=crop"></a>` +
    `<div class="pcard-body"><p class="pmeta"><b>${esc(p.categoria)}</b> · <time datetime="${p.fecha}">${fecha(p.fecha)}</time> · ${p.lectura} min</p>` +
    `<h3><a href="${url}">${esc(p.titulo)}</a></h3><p class="pres">${esc(p.resumen)}</p>` +
    `<a class="plink" href="${url}" aria-label="Leer: ${esc(p.titulo)}">Leer artículo <svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg></a></div></article>`;
}

function inyectar(archivo, html) {
  const ruta = path.join(RAIZ, archivo);
  const txt = fs.readFileSync(ruta, "utf8");
  const nuevo = txt.replace(/<!--TARJETAS:INICIO-->[\s\S]*?<!--TARJETAS:FIN-->/, `<!--TARJETAS:INICIO-->\n${html}\n<!--TARJETAS:FIN-->`);
  if (nuevo === txt && !txt.includes("<!--TARJETAS:INICIO-->")) throw new Error("Faltan marcadores en " + archivo);
  fs.writeFileSync(ruta, nuevo);
  console.log("Tarjetas actualizadas:", archivo);
}

inyectar("index.html", posts.slice(0, 3).map(p => tarjeta(p, "blog/")).join("\n"));
inyectar("blog/index.html", posts.map(p => tarjeta(p, "")).join("\n"));

const hoy = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: "/", lastmod: hoy, prio: "1.0" },
  { loc: "/blog/", lastmod: posts[0] ? posts[0].fecha : hoy, prio: "0.8" },
  ...posts.map(p => ({ loc: `/blog/${p.slug}.html`, lastmod: p.fecha, prio: "0.7" }))
];
fs.writeFileSync(path.join(RAIZ, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${DOMINIO}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.prio}</priority></url>`).join("\n") +
  `\n</urlset>\n`);
console.log("sitemap.xml con", urls.length, "URLs");
