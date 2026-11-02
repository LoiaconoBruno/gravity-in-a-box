// Interfaz: silo (Janssen) y caja en caída libre (marea).
(() => {
  const $ = (id) => document.getElementById(id);
  const num = (x, d = 2) => Number(x.toFixed(d)).toLocaleString("es-AR");
  const val = (id) => parseFloat($(id).value);

  // Distancias y tiempos con la unidad más cómoda.
  function largo(m) {
    const a = Math.abs(m);
    if (a >= 1000) return num(m / 1000, 1) + " km";
    if (a >= 1) return num(m, 2) + " m";
    if (a >= 0.01) return num(m * 100, 1) + " cm";
    if (a >= 1e-3) return num(m * 1000, 2) + " mm";
    if (a >= 1e-6) return num(m * 1e6, 1) + " µm";
    return num(m * 1e9, 1) + " nm";
  }
  function tiempo(s) {
    if (s >= 3 * 3600) return num(s / 3600, 1) + " h";
    if (s >= 60) return num(s / 60, 1) + " min";
    return num(s, 1) + " s";
  }
  const masa = (kg) => (kg >= 1 ? num(kg, 2) + " kg" : Math.round(kg * 1000) + " g");

  function silo() {
    const p = { rho: val("rho"), D: val("D"), mu: val("mu"), K: val("K"), g: Caja.G_TIERRA };
    const H = val("H");
    $("v-H").textContent = largo(H);
    $("v-D").textContent = largo(p.D);
    $("v-mu").textContent = num(p.mu);
    $("v-K").textContent = num(p.K);
    $("v-rho").textContent = p.rho + " kg/m³";
    $("s-real").textContent = masa(Caja.masaReal(H, p));
    $("s-balanza").textContent = masa(Caja.masaAparente(H, p));
    $("s-sat").textContent = largo(Caja.longitudSaturacion(p));
    const pts = [];
    for (let i = 0; i <= 100; i++) pts.push((i / 100) * 1);
    Grafico.lineas($("g-silo"), {
      series: [
        { nombre: "Líquido (o sin paredes)", puntos: pts.map((z) => [z * 100, Caja.masaReal(z, p) * 1000]) },
        { nombre: "Grano (Janssen)", puntos: pts.map((z) => [z * 100, Caja.masaAparente(z, p) * 1000]) },
      ],
      xMin: 0, xMax: 100, yMin: 0,
      xEtiqueta: "altura de llenado (cm)", yEtiqueta: "lo que marca la balanza (g)",
      verticales: [{ x: H * 100, etiqueta: "ahora" }],
      alto: 280,
    });
  }

  function marea() {
    const tam = Math.pow(10, val("tam"));
    const T = Math.pow(10, val("T"));
    const alt = val("alt") * 1000;
    $("v-tam").textContent = largo(tam);
    $("v-T").textContent = tiempo(T);
    $("v-alt").textContent = alt === 0 ? "superficie" : largo(alt);
    const m = Caja.marea({ h: tam, w: tam, altitud: alt, T });
    $("s-dg").textContent = m.dgRelativo < 1e-3 ? `${num(m.dgRelativo * 1e7, 2)} en 10 millones` : `${num(m.dgRelativo * 100, 2)} %`;
    $("s-acerca").textContent = largo(m.acercamiento);
    $("s-separa").textContent = largo(m.separacion);
    $("s-schuler").textContent = tiempo(m.periodo);
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const t = (T * i) / 120;
      pts.push([t, Caja.marea({ h: tam, w: tam, altitud: alt, T: t }).acercamiento]);
    }
    Grafico.lineas($("g-marea"), {
      series: [{ nombre: "Acercamiento de las bolas de los costados (m)", puntos: pts }],
      xMin: 0, xMax: T, yMin: 0,
      xEtiqueta: "tiempo de caída (s)", yEtiqueta: "acercamiento (m)",
      alto: 260,
    });
    $("txt-marea").textContent = tam > 0.05 * Caja.R_TIERRA
      ? "Con una caja de este tamaño las fórmulas de primer orden dejan de ser exactas: la forma de la caja ya importa, porque el campo cambia mucho de un extremo al otro."
      : `En ${tiempo(T)} de caída, dos bolas separadas ${largo(tam)} se acercan ${largo(m.acercamiento)}. Si medís eso, sabés que estás cerca de una masa y no en un cohete que acelera.`;
  }

  for (const id of ["H", "D", "mu", "K", "rho"]) $(id).addEventListener("input", silo);
  for (const id of ["tam", "T", "alt"]) $(id).addEventListener("input", marea);
  window.addEventListener("resize", () => { silo(); marea(); });
  silo();
  marea();
})();
