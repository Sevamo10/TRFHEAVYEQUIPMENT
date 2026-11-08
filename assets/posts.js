/* TRF — índice de artículos del blog.
   Para publicar un artículo nuevo:
   1. Copie una página de /blog (por ejemplo calificar-comprador-maquinaria.html), cambie textos e imagen.
   2. Agregue aquí su ficha AL INICIO de la lista (el más nuevo primero).
   Las tarjetas del inicio, del listado y de "Siga leyendo" se arman solas con esta lista. */
var TRF_POSTS = [
  {
    slug: "agente-ia-whatsapp-maquinaria",
    titulo: "Agente de IA en WhatsApp para dealers de maquinaria: qué hace, qué no y cómo medirlo",
    resumen: "Responde en segundos, califica y entrega al asesor. Lo que debe hacer un agente de IA, lo que nunca debe hacer y los 5 números para saber si funciona.",
    categoria: "Agentes de IA",
    fecha: "2026-11-07", lectura: 6,
    img: "https://images.unsplash.com/photo-1653315918051-8c4925a4874f"
  },
  {
    slug: "calificar-comprador-maquinaria",
    titulo: "Cómo calificar a un comprador de maquinaria en 4 preguntas, antes de cotizar",
    resumen: "Uso, presupuesto, plazo y financiación. Con estas 4 respuestas su asesor sabe a quién llamar primero y a quién nutrir.",
    categoria: "Calificación de leads",
    fecha: "2026-11-07", lectura: 5,
    img: "https://images.unsplash.com/photo-1714627798569-b3e36d409c4b"
  },
  {
    slug: "ventas-maquinaria-whatsapp-cotizacion",
    titulo: "Por qué se pierden las ventas de maquinaria entre el WhatsApp y la cotización",
    resumen: "3 de cada 4 compradores piden precio por WhatsApp. Estas son las 3 fugas que más ventas cuestan y cómo cerrarlas.",
    categoria: "Ventas por WhatsApp",
    fecha: "2026-11-07", lectura: 6,
    img: "https://images.unsplash.com/photo-1637669886956-bf0e1cc4f0d3"
  }
];

var TRF_MESES = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
function trfFecha(iso) { var p = iso.split("-"); return +p[2] + " " + TRF_MESES[+p[1] - 1] + " " + p[0]; }

/* Pinta tarjetas en un contenedor.
   base: ruta hacia la carpeta /blog desde la página actual ("blog/" en el inicio, "" dentro del blog).
   opciones: { max, excluir, categoria } */
function trfTarjetas(contenedor, base, opciones) {
  opciones = opciones || {};
  var lista = TRF_POSTS.filter(function (p) {
    return p.slug !== opciones.excluir && (!opciones.categoria || p.categoria === opciones.categoria);
  }).slice(0, opciones.max || 99);
  contenedor.innerHTML = "";
  if (!lista.length) { contenedor.innerHTML = '<p class="empty">No hay artículos en esta categoría todavía.</p>'; return; }
  lista.forEach(function (p) {
    var url = base + p.slug + ".html";
    var a = document.createElement("article");
    a.className = "pcard";
    a.innerHTML =
      '<a class="ph" href="' + url + '" tabindex="-1" aria-hidden="true"><img loading="lazy" alt="" src="' + p.img + '?w=800&q=65&auto=format&fit=crop"></a>' +
      '<div class="pcard-body"><p class="pmeta"><b></b> · ' + trfFecha(p.fecha) + " · " + p.lectura + ' min</p>' +
      '<h3><a href="' + url + '"></a></h3><p class="pres"></p>' +
      '<a class="plink" href="' + url + '">Leer artículo <svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 8h12M9 3l5 5-5 5"/></svg></a></div>';
    a.querySelector(".pmeta b").textContent = p.categoria;
    a.querySelector("h3 a").textContent = p.titulo;
    a.querySelector(".pres").textContent = p.resumen;
    contenedor.appendChild(a);
  });
}

/* Botones de compartir en artículos */
function trfCompartir() {
  var url = location.href.split("#")[0], t = document.title;
  var wa = document.getElementById("share-wa"), li = document.getElementById("share-li"), cp = document.getElementById("share-copy");
  if (wa) wa.href = "https://wa.me/?text=" + encodeURIComponent(t + " " + url);
  if (li) li.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);
  if (cp) cp.addEventListener("click", function () {
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { cp.textContent = "Enlace copiado"; }, function () { cp.textContent = url; });
  });
}
