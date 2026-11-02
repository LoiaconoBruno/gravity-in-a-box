const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../src/caja.js");

const relCerca = (a, b, rel, msg) => assert.ok(Math.abs(a - b) <= rel * Math.abs(b), msg || `${a} ≈ ${b}`);

test("Janssen: con poca altura se comporta como un líquido", () => {
  const z = 0.001;
  relCerca(C.presionGranular(z, C.ARROZ), C.presionLiquido(z, C.ARROZ), 0.01);
});

test("Janssen: con mucha altura la presión se satura en ρ·g·D/(4μK)", () => {
  const sat = C.ARROZ.rho * C.ARROZ.g * C.longitudSaturacion(C.ARROZ);
  relCerca(C.presionGranular(5, C.ARROZ), sat, 1e-9);
  assert.ok(C.presionGranular(0.5, C.ARROZ) < C.presionLiquido(0.5, C.ARROZ) / 4);
});

test("arroz en un tubo de 5 cm: la balanza marca mucho menos que la masa real", () => {
  relCerca(C.longitudSaturacion(C.ARROZ), 0.078125, 1e-9);
  const real = C.masaReal(0.5, C.ARROZ);
  const aparente = C.masaAparente(0.5, C.ARROZ);
  relCerca(real, 0.785, 0.01);
  relCerca(aparente, 0.1225, 0.01);
  relCerca(C.masaSaturacion(C.ARROZ), 0.1227, 0.01);
});

test("un tubo más ancho satura más alto", () => {
  const ancho = { ...C.ARROZ, D: 0.2 };
  assert.ok(C.longitudSaturacion(ancho) > C.longitudSaturacion(C.ARROZ));
});

test("marea: en una caja de 1 m, g cambia ~3 partes en 10 millones", () => {
  const m = C.marea({ h: 1, w: 1, T: 1 });
  relCerca(m.dgRelativo, 3.14e-7, 0.01);
  relCerca(m.g, 9.82, 0.01);
});

test("marea: el período de Schuler es de unos 84 minutos", () => {
  const m = C.marea({ h: 1, w: 1, T: 1 });
  relCerca(m.periodo / 60, 84.4, 0.01);
});

test("marea: dos bolas a 1 m que caen 10 s se acercan unas 77 micras", () => {
  const m = C.marea({ h: 1, w: 1, T: 10 });
  relCerca(m.acercamiento, 7.7e-5, 0.02);
  // Las de arriba y abajo se separan el doble (a primer orden).
  relCerca(m.separacion, 2 * m.acercamiento, 0.01);
});

test("marea: más arriba el efecto es más chico", () => {
  const abajo = C.marea({ h: 1, w: 1, T: 10 });
  const arriba = C.marea({ h: 1, w: 1, T: 10, altitud: 400e3 });
  assert.ok(arriba.acercamiento < abajo.acercamiento);
});
