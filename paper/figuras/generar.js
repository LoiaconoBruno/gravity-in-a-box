#!/usr/bin/env node
// Genera las figuras del paper (SVG) en esta carpeta y escribe las cifras que cita el texto.
// Uso: node paper/figuras/generar.js
// Contiene solo las funciones del modelo que hacen falta. Licencia MIT (ver LICENSE).
// Unidades SI en todo el archivo: m, kg, s, Pa.
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const COLORES = ["#2a55c9", "#c25a00", "#1f7a4d", "#b3261e", "#7a3fb8", "#555555"];
const FUENTE = 'font-family="DejaVu Sans, Helvetica, Arial, sans-serif"';

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Números con coma decimal y signo menos tipográfico.
function num(x) {
  if (x === 0) return "0";
  const a = Math.abs(x);
  let s;
  if (a >= 1e4 || a < 1e-3) {
    const e = Math.floor(Math.log10(a));
    const m = x / 10 ** e;
    s = (Math.abs(m - 1) < 1e-9 ? "" : `${Number(m.toPrecision(2))}×`) + `10^${e}`;
  } else s = String(Number(x.toPrecision(3)));
  return s.replace(".", ",").replace(/-/g, "−");
}

function marcas(min, max, n = 5) {
  const crudo = (max - min) / n;
  const pot = 10 ** Math.floor(Math.log10(crudo));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * pot).find((p) => p >= crudo);
  const out = [];
  for (let x = Math.ceil(min / paso - 1e-9) * paso; x <= max + paso * 1e-9; x += paso) out.push(Math.abs(x) < paso * 1e-9 ? 0 : x);
  return out;
}

function potencias(min, max) {
  const out = [];
  for (let k = Math.floor(Math.log10(min)); k <= Math.ceil(Math.log10(max)); k++) out.push(10 ** k);
  return out;
}

// Texto con superíndices para etiquetas del tipo 10^3.
function textoSVG(s) {
  return esc(s).replace(/\^(−?\d+)/g, '<tspan baseline-shift="super" font-size="70%">$1</tspan>');
}

/**
 * Gráfico de líneas.
 * op: { series: [{nombre, puntos: [[x,y]], color?, punteada?, grosor?}], xMin, xMax, yMin, yMax,
 *       xEtiqueta, yEtiqueta, logX, logY, verticales: [{x, etiqueta}], horizontales: [{y, etiqueta}],
 *       ancho, alto, leyenda: "arriba" | "abajo" | null }
 */
function grafico(op) {
  const W = op.ancho || 640, H = op.alto || 400;
  const m = { l: 70, r: 18, t: op.leyenda === null ? 16 : 40, b: 56 };
  const tx = (x) => (op.logX ? Math.log10(x) : x);
  const ty = (y) => (op.logY ? Math.log10(y) : y);
  const pts = op.series.flatMap((s) => s.puntos).filter(([x, y]) => isFinite(tx(x)) && isFinite(ty(y)));
  const xMin = op.xMin ?? Math.min(...pts.map((p) => p[0]));
  const xMax = op.xMax ?? Math.max(...pts.map((p) => p[0]));
  const yMin = op.yMin ?? Math.min(...pts.map((p) => p[1]));
  const yMax = op.yMax ?? Math.max(...pts.map((p) => p[1]));
  const X = (x) => m.l + ((tx(x) - tx(xMin)) / (tx(xMax) - tx(xMin))) * (W - m.l - m.r);
  const Y = (y) => H - m.b - ((ty(y) - ty(yMin)) / (ty(yMax) - ty(yMin))) * (H - m.t - m.b);
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`];
  const mx = op.logX ? potencias(xMin, xMax) : marcas(xMin, xMax, op.marcasX || 6);
  const my = op.logY ? potencias(yMin, yMax) : marcas(yMin, yMax, op.marcasY || 5);
  for (const x of mx) {
    if (x < xMin - 1e-12 || x > xMax + 1e-12) continue;
    o.push(`<line x1="${X(x)}" y1="${m.t}" x2="${X(x)}" y2="${H - m.b}" stroke="#e3e1db"/>`);
    o.push(`<text x="${X(x)}" y="${H - m.b + 18}" text-anchor="middle" fill="#333">${textoSVG(num(x))}</text>`);
  }
  for (const y of my) {
    if (y < yMin - 1e-12 || y > yMax + 1e-12) continue;
    o.push(`<line x1="${m.l}" y1="${Y(y)}" x2="${W - m.r}" y2="${Y(y)}" stroke="#e3e1db"/>`);
    o.push(`<text x="${m.l - 8}" y="${Y(y) + 4}" text-anchor="end" fill="#333">${textoSVG(num(y))}</text>`);
  }
  o.push(`<rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}" fill="none" stroke="#333"/>`);
  if (op.xEtiqueta) o.push(`<text x="${m.l + (W - m.l - m.r) / 2}" y="${H - 14}" text-anchor="middle" fill="#111">${textoSVG(op.xEtiqueta)}</text>`);
  if (op.yEtiqueta) o.push(`<text transform="translate(18 ${m.t + (H - m.t - m.b) / 2}) rotate(-90)" text-anchor="middle" fill="#111">${textoSVG(op.yEtiqueta)}</text>`);
  o.push(`<clipPath id="area"><rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}"/></clipPath><g clip-path="url(#area)">`);
  (op.verticales || []).forEach((v, j) => {
    o.push(`<line x1="${X(v.x)}" y1="${m.t}" x2="${X(v.x)}" y2="${H - m.b}" stroke="#666" stroke-dasharray="4 4"/>`);
    // etiquetas escalonadas para que no se pisen si las líneas están cerca
    if (v.etiqueta) o.push(`<text x="${X(v.x) + 5}" y="${m.t + 16 + 15 * j}" fill="#444" font-size="12">${textoSVG(v.etiqueta)}</text>`);
  });
  for (const h of op.horizontales || []) {
    o.push(`<line x1="${m.l}" y1="${Y(h.y)}" x2="${W - m.r}" y2="${Y(h.y)}" stroke="#666" stroke-dasharray="4 4"/>`);
    if (h.etiqueta) o.push(`<text x="${W - m.r - 6}" y="${Y(h.y) - 6}" text-anchor="end" fill="#444" font-size="12">${textoSVG(h.etiqueta)}</text>`);
  }
  op.series.forEach((s, i) => {
    const d = [];
    let abierto = false;
    for (const [x, y] of s.puntos) {
      if (!isFinite(tx(x)) || !isFinite(ty(y))) { abierto = false; continue; }
      d.push(`${abierto ? "L" : "M"}${X(x).toFixed(2)} ${Y(y).toFixed(2)}`);
      abierto = true;
    }
    const color = s.color || COLORES[i % COLORES.length];
    o.push(`<path d="${d.join(" ")}" fill="none" stroke="${color}" stroke-width="${s.grosor || 2.2}"${s.punteada ? ' stroke-dasharray="7 5"' : ""} stroke-linejoin="round"/>`);
  });
  o.push("</g>");
  if (op.leyenda !== null) {
    let lx = m.l;
    op.series.forEach((s, i) => {
      if (!s.nombre) return;
      const color = s.color || COLORES[i % COLORES.length];
      o.push(`<line x1="${lx}" y1="${m.t - 16}" x2="${lx + 22}" y2="${m.t - 16}" stroke="${color}" stroke-width="3"${s.punteada ? ' stroke-dasharray="6 4"' : ""}/>`);
      o.push(`<text x="${lx + 28}" y="${m.t - 12}" fill="#111">${textoSVG(s.nombre)}</text>`);
      lx += 40 + s.nombre.length * 7.2;
    });
  }
  o.push("</svg>");
  return o.join("\n");
}

function guardar(nombre, svg) {
  fs.writeFileSync(path.join(__dirname, nombre + ".svg"), svg + "\n");
  console.log("figura:", nombre + ".svg");
}

/**
 * Barras apiladas horizontales. grupos: [{nombre, partes: [valor...]}], categorias: [nombre...]
 */
function barras(op) {
  const W = op.ancho || 640, alto = op.alturaBarra || 34, sep = op.separacion || 22;
  const m = { l: op.margenIzq || 210, r: 30, t: 54, b: 46 };
  const H = m.t + op.grupos.length * (alto + sep) - sep + m.b;
  const total = op.maximo || Math.max(...op.grupos.map((g) => g.partes.reduce((a, b) => a + b, 0)));
  const X = (v) => m.l + (v / total) * (W - m.l - m.r);
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`];
  let lx = m.l;
  op.categorias.forEach((c, i) => {
    o.push(`<rect x="${lx}" y="${m.t - 36}" width="14" height="14" fill="${(op.colores || COLORES)[i]}"/>`);
    o.push(`<text x="${lx + 20}" y="${m.t - 24}" fill="#111">${esc(c)}</text>`);
    lx += 34 + c.length * 7.2;
  });
  for (const v of marcas(0, total, op.marcas || 5)) {
    o.push(`<line x1="${X(v)}" y1="${m.t - 6}" x2="${X(v)}" y2="${H - m.b}" stroke="#e3e1db"/>`);
    o.push(`<text x="${X(v)}" y="${H - m.b + 18}" text-anchor="middle" fill="#333">${num(v)}</text>`);
  }
  op.grupos.forEach((g, k) => {
    const y = m.t + k * (alto + sep);
    o.push(`<text x="${m.l - 10}" y="${y + alto / 2 + 5}" text-anchor="end" fill="#111">${esc(g.nombre)}</text>`);
    let acum = 0;
    g.partes.forEach((v, i) => {
      if (!v) return;
      o.push(`<rect x="${X(acum)}" y="${y}" width="${X(acum + v) - X(acum)}" height="${alto}" fill="${(op.colores || COLORES)[i]}"/>`);
      o.push(`<text x="${(X(acum) + X(acum + v)) / 2}" y="${y + alto / 2 + 5}" text-anchor="middle" fill="#fff" font-weight="bold">${num(v)}</text>`);
      acum += v;
    });
  });
  if (op.xEtiqueta) o.push(`<text x="${m.l + (W - m.l - m.r) / 2}" y="${H - 10}" text-anchor="middle" fill="#111">${esc(op.xEtiqueta)}</text>`);
  o.push("</svg>");
  return o.join("\n");
}

/** Diagrama de pasos en fila: cajas con número y texto, unidas por flechas. */
function pasos(lista, op = {}) {
  const W = op.ancho || 640, porFila = op.porFila || 3, cw = (W - 40 - (porFila - 1) * 30) / porFila, ch = op.altoCaja || 92;
  const filas = Math.ceil(lista.length / porFila);
  const H = 20 + filas * ch + (filas - 1) * 40 + 20;
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`,
    `<defs><marker id="flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#555"/></marker></defs>`];
  const pos = lista.map((_, i) => {
    const f = Math.floor(i / porFila), c = f % 2 === 0 ? i % porFila : porFila - 1 - (i % porFila);
    return { x: 20 + c * (cw + 30), y: 20 + f * (ch + 40) };
  });
  lista.forEach((p, i) => {
    const { x, y } = pos[i];
    o.push(`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="10" fill="#f3f5fc" stroke="${COLORES[0]}" stroke-width="1.5"/>`);
    o.push(`<text x="${x + 12}" y="${y + 24}" fill="${COLORES[0]}" font-weight="bold" font-size="14">${esc(p.titulo)}</text>`);
    (p.lineas || []).forEach((l, j) => o.push(`<text x="${x + 12}" y="${y + 46 + j * 17}" fill="#222">${esc(l)}</text>`));
    if (i + 1 < lista.length) {
      const a = pos[i], b = pos[i + 1];
      if (a.y === b.y) {
        const izq = b.x > a.x;
        o.push(`<line x1="${izq ? a.x + cw : a.x}" y1="${a.y + ch / 2}" x2="${izq ? b.x - 2 : b.x + cw + 2}" y2="${b.y + ch / 2}" stroke="#555" stroke-width="1.6" marker-end="url(#flecha)"/>`);
      } else {
        o.push(`<line x1="${a.x + cw / 2}" y1="${a.y + ch}" x2="${b.x + cw / 2}" y2="${b.y - 2}" stroke="#555" stroke-width="1.6" marker-end="url(#flecha)"/>`);
      }
    }
  });
  o.push("</svg>");
  return o.join("\n");
}

// ---------------------------------------------------------------------------
// Constantes (NASA Earth y Moon Fact Sheets; CODATA para G)
// ---------------------------------------------------------------------------
const G = 6.6743e-11;          // m³ kg⁻¹ s⁻²
const GM = 3.986004e14;        // m³/s², Tierra
const R_TIERRA = 6.371e6;      // m, radio medio
const M_LUNA = 7.346e22;       // kg
const D_LUNA = 3.844e8;        // m, semieje mayor de la órbita lunar
const C = 299792458;           // m/s
const g0 = 9.81;               // m/s², valor de referencia en la superficie

// ---------------------------------------------------------------------------
// Silo: modelo de Janssen
// ---------------------------------------------------------------------------
// Valores supuestos para arroz en un tubo liso: no son medidos.
const ARROZ = { rho: 800, D: 0.05, mu: 0.4, K: 0.4, g: g0 };
const lambda = (p) => p.D / (4 * p.mu * p.K);                                   // m
const presionGranular = (z, p) => p.rho * p.g * lambda(p) * (1 - Math.exp(-z / lambda(p))); // Pa
const presionLiquido = (z, p) => p.rho * p.g * z;                               // Pa
const area = (p) => (Math.PI * p.D * p.D) / 4;                                  // m²
const masaAparente = (H, p) => (presionGranular(H, p) * area(p)) / p.g;         // kg
const masaReal = (H, p) => p.rho * area(p) * H;                                 // kg
// Rankine, estado activo: K = (1 − sen φ) / (1 + sen φ)
const kRankine = (phiGrados) => { const s = Math.sin((phiGrados * Math.PI) / 180); return (1 - s) / (1 + s); };

// ---------------------------------------------------------------------------
// Caja: mareas de primer orden en un campo central
// ---------------------------------------------------------------------------
function marea({ h, w, altitud = 0, T }) {
  const r = R_TIERRA + altitud;
  const omega = Math.sqrt(GM / r ** 3);                         // s⁻¹
  return {
    g: GM / r ** 2,
    dgRelativo: (2 * h) / r,
    omega,
    periodo: (2 * Math.PI) / omega,
    acercamiento: w * (1 - Math.cos(omega * T)),
    separacion: h * (Math.cosh(Math.SQRT2 * omega * T) - 1),
  };
}

const f = (x, d = 4) => Number(x.toPrecision(d));
const out = [];
const linea = (s) => { out.push(s); console.log(s); };

// --- Ejemplo del silo
const p5 = ARROZ, p20 = { ...ARROZ, D: 0.2 };
const H = 0.5;
linea(`Silo D=5 cm, H=50 cm: área ${f(area(p5))} m², masa real ${f(masaReal(H, p5) * 1000)} g, λ ${f(lambda(p5) * 100)} cm, H/λ ${f(H / lambda(p5))}, factor ${f(1 - Math.exp(-H / lambda(p5)))}, balanza ${f(masaAparente(H, p5) * 1000)} g, paredes ${f(100 * (1 - masaAparente(H, p5) / masaReal(H, p5)))} %`);
linea(`Silo D=20 cm, H=50 cm: λ ${f(lambda(p20) * 100)} cm, balanza ${f(masaAparente(H, p20))} kg de ${f(masaReal(H, p20))} kg`);
linea(`Presión de saturación D=5 cm: ρgλ = ${f(ARROZ.rho * g0 * lambda(p5))} Pa; líquido a 50 cm: ${f(presionLiquido(H, p5))} Pa`);
linea(`Rankine: K(30°) = ${f(kRankine(30), 3)}`);

// --- Ejemplo de la caja
const m10 = marea({ h: 1, w: 1, T: 10 });
linea(`Caja 1 m en superficie: g ${f(m10.g)} m/s², Δg/g ${f(m10.dgRelativo)}, ω² ${f(m10.omega ** 2)} s⁻², ω ${f(m10.omega)} s⁻¹, Schuler ${f(m10.periodo / 60)} min`);
linea(`10 s de caída: acercamiento ${f(m10.acercamiento * 1e6)} µm, separación ${f(m10.separacion * 1e6)} µm, cociente ${f(m10.separacion / m10.acercamiento)}`);
const iss = marea({ h: 1, w: 1, T: 10, altitud: 400e3 });
linea(`A 400 km: g ${f(iss.g, 3)} m/s², acercamiento ${f(iss.acercamiento * 1e6)} µm, marea relativa ${f(iss.omega ** 2 / m10.omega ** 2)}`);
linea(`Gradiente vertical 2g/r = ${f((2 * GM) / R_TIERRA ** 3)} s⁻² = ${f((2 * GM) / R_TIERRA ** 3 / 1e-9)} E`);
linea(`Marea lunar en la superficie: 2 G M R / d³ = ${f((2 * G * M_LUNA * R_TIERRA) / D_LUNA ** 3)} m/s²`);
linea(`Pound y Rebka, 22,5 m: g h / c² = ${f((g0 * 22.5) / C ** 2)}`);
for (const h of [1, 100, 1e4, 1e6]) {
  const exacto = 1 - (R_TIERRA / (R_TIERRA + h)) ** 2;
  linea(`Caja de ${h} m: Δg/g primer orden ${f(2 * h / R_TIERRA, 3)}, exacto ${f(exacto, 3)}`);
}
// Campo de las paredes de un silo de hormigón en el centro de su fondo:
// cáscara cilíndrica de radio a, largo L y densidad superficial σ; punto en el eje, en un extremo.
// g = 2πGσa (1/a − 1/√(a² + L²))
{
  const a = 3, L = 20, sigma = 2400 * 0.2;
  const gp = 2 * Math.PI * G * sigma * a * (1 / a - 1 / Math.sqrt(a * a + L * L));
  linea(`Silo de hormigón (a=3 m, L=20 m, 20 cm de pared): g_paredes = ${f(gp, 3)} m/s² = ${f(gp / g0, 3)} g`);
}

// ---------------------------------------------------------------------------
// Figura 1: presión en el fondo en función de la altura
// ---------------------------------------------------------------------------
const zs = Array.from({ length: 201 }, (_, i) => i * 0.005);
guardar("presion", grafico({
  series: [
    { nombre: "Líquido, ρ = 800 kg/m³", puntos: zs.map((z) => [z * 100, presionLiquido(z, ARROZ) / 1000]), color: COLORES[5], punteada: true },
    { nombre: "Grano, D = 20 cm", puntos: zs.map((z) => [z * 100, presionGranular(z, { ...ARROZ, D: 0.2 }) / 1000]), color: COLORES[2] },
    { nombre: "D = 10 cm", puntos: zs.map((z) => [z * 100, presionGranular(z, { ...ARROZ, D: 0.1 }) / 1000]), color: COLORES[1] },
    { nombre: "D = 5 cm", puntos: zs.map((z) => [z * 100, presionGranular(z, ARROZ) / 1000]), color: COLORES[0] },
  ],
  xMin: 0, xMax: 100, yMin: 0, yMax: 4,
  xEtiqueta: "Profundidad z (cm)", yEtiqueta: "Presión vertical P (kPa)",
}));

// ---------------------------------------------------------------------------
// Figura 2: fracción del peso que llega a la balanza
// ---------------------------------------------------------------------------
const Hs = Array.from({ length: 200 }, (_, i) => 0.005 + i * 0.005);
guardar("fraccion", grafico({
  series: [0.05, 0.1, 0.2].map((Dd, i) => ({
    nombre: `D = ${Dd * 100} cm`,
    puntos: Hs.map((h) => [h * 100, masaAparente(h, { ...ARROZ, D: Dd }) / masaReal(h, { ...ARROZ, D: Dd })]),
    color: [COLORES[0], COLORES[1], COLORES[2]][i],
  })),
  xMin: 0, xMax: 100, yMin: 0, yMax: 1,
  verticales: [{ x: 50, etiqueta: "ejemplo, H = 50 cm" }],
  xEtiqueta: "Altura de llenado H (cm)", yEtiqueta: "Masa en la balanza / masa real",
}));

// ---------------------------------------------------------------------------
// Figura 3: mareas en función del tiempo de caída
// ---------------------------------------------------------------------------
const ts = [];
for (let e = -1; e <= 3.6; e += 0.02) ts.push(10 ** e);
const um = (x) => x * 1e6;
const w0 = marea({ h: 1, w: 1, T: 0 }).omega;
guardar("marea-tiempo", grafico({
  series: [
    { nombre: "Separación vertical", puntos: ts.map((t) => [t, um(marea({ h: 1, w: 1, T: t }).separacion)]), color: COLORES[1] },
    { nombre: "Acercamiento horizontal", puntos: ts.map((t) => [t, um(marea({ h: 1, w: 1, T: t }).acercamiento)]), color: COLORES[0] },
    { nombre: "ω²t² h", puntos: ts.map((t) => [t, um(w0 ** 2 * t * t)]), color: COLORES[1], punteada: true, grosor: 1.4 },
    { nombre: "ω²t² w/2", puntos: ts.map((t) => [t, um((w0 ** 2 * t * t) / 2)]), color: COLORES[0], punteada: true, grosor: 1.4 },
  ],
  logX: true, logY: true, xMin: 0.1, xMax: 4000, yMin: 1e-2, yMax: 1e7,
  verticales: [{ x: 10, etiqueta: "10 s" }],
  xEtiqueta: "Tiempo de caída t (s)", yEtiqueta: "Cambio de separación (µm)",
}));

// ---------------------------------------------------------------------------
// Figura 4: diferencia de g entre piso y techo
// ---------------------------------------------------------------------------
const hs = [];
for (let e = 0; e <= 7; e += 0.05) hs.push(10 ** e);
guardar("gradiente", grafico({
  series: [
    { nombre: "Primer orden, 2h/r", puntos: hs.map((h) => [h, (2 * h) / R_TIERRA]), color: COLORES[0], punteada: true },
    { nombre: "Exacto, 1 − r²/(r + h)²", puntos: hs.map((h) => [h, 1 - (R_TIERRA / (R_TIERRA + h)) ** 2]), color: COLORES[1] },
  ],
  logX: true, logY: true, xMin: 1, xMax: 1e7, yMin: 1e-7, yMax: 10,
  verticales: [{ x: R_TIERRA, etiqueta: "h = r" }],
  xEtiqueta: "Altura de la caja h (m)", yEtiqueta: "Δg / g entre piso y techo",
}));
