// Gravedad dentro de un recipiente: qué cambia con la forma y qué no.
//
// 1. Silo (efecto Janssen, 1895). En un tubo con material granular, las
//    paredes sostienen parte del peso por rozamiento y la presión en el fondo
//    se satura:  P(z) = ρ·g·D / (4·μ·K) · (1 − e^(−4·μ·K·z / D))
//    En un líquido, en cambio, la presión solo depende de la altura: P = ρ·g·z.
//
// 2. Marea (el ascensor de Einstein). Adentro de una caja sin ventanas, la
//    gravedad uniforme no se distingue de una aceleración. Lo que la delata es
//    que el campo no es uniforme: dos bolas que caen lado a lado se acercan
//    (ambas apuntan al centro de la Tierra) y dos bolas una arriba de la otra
//    se separan. Para separaciones chicas frente al radio:
//      horizontal: d(t) = d₀·cos(ω·t)        con ω² = GM / r³
//      vertical:   d(t) = d₀·cosh(√2·ω·t)
const Caja = (() => {
  const G_TIERRA = 9.81;      // m/s², en la superficie
  const GM = 3.986004e14;     // m³/s², Tierra
  const R_TIERRA = 6.371e6;   // m

  // Valores típicos para arroz en un tubo de cartón o plástico. Son supuestos
  // editables: μ y K dependen mucho del material y de cómo se llena el tubo.
  const ARROZ = { rho: 800, D: 0.05, mu: 0.4, K: 0.4, g: G_TIERRA };

  function longitudSaturacion(p) {
    return p.D / (4 * p.mu * p.K);
  }

  function presionGranular(z, p) {
    const l = longitudSaturacion(p);
    return p.rho * p.g * l * (1 - Math.exp(-z / l));
  }

  function presionLiquido(z, p) {
    return p.rho * p.g * z;
  }

  const area = (p) => (Math.PI * p.D * p.D) / 4;

  // Lo que marcaría una balanza que solo sostiene el fondo (el tubo apoyado aparte), en kg.
  function masaAparente(H, p) {
    return (presionGranular(H, p) * area(p)) / p.g;
  }

  function masaReal(H, p) {
    return p.rho * area(p) * H;
  }

  function masaSaturacion(p) {
    return p.rho * area(p) * longitudSaturacion(p);
  }

  // Efectos de marea en una caja en caída libre a una altitud dada (m).
  // h: separación vertical, w: separación horizontal (m), T: tiempo de caída (s).
  function marea({ h, w, altitud = 0, T }) {
    const r = R_TIERRA + altitud;
    const g = GM / (r * r);
    const omega = Math.sqrt(GM / (r * r * r));
    return {
      g,
      dgVertical: (2 * GM * h) / (r * r * r),   // diferencia de g entre piso y techo
      dgRelativo: (2 * h) / r,
      omega,
      periodo: (2 * Math.PI) / omega,          // período de Schuler (≈ 84 min en la superficie)
      acercamiento: w * (1 - Math.cos(omega * T)),
      separacion: h * (Math.cosh(Math.SQRT2 * omega * T) - 1),
    };
  }

  return { G_TIERRA, GM, R_TIERRA, ARROZ, longitudSaturacion, presionGranular, presionLiquido, masaAparente, masaReal, masaSaturacion, marea };
})();

if (typeof module !== "undefined") module.exports = Caja;
