# Gravedad contenida

**El efecto Janssen y las fuerzas de marea como respuestas a qué cambia la forma de un recipiente.** Preprint de Bruno Loiacono, estudiante de Física (Universidad de Buenos Aires).

¿La forma de un recipiente cambia cómo actúa la gravedad adentro? El paper separa la pregunta en dos problemas con solución numérica. En un silo, la fricción con las paredes desvía parte del peso del grano y la presión en el fondo se satura (modelo de Janssen). En una caja cerrada en caída libre, las fuerzas de marea delatan que el campo no es uniforme. Cada ecuación se deriva con unidades explícitas y se compara con mediciones publicadas.

- 📄 **[PDF](paper/paper.pdf)**
- 🌐 **[Versión web](https://loiaconobruno.github.io/gravity-in-a-box/)**

> Preprint, documento de trabajo sin revisión por pares.

## Cómo se genera

`paper/paper.tex` es la única fuente. En cada push, GitHub Actions compila el PDF con TeX Live y arma la versión web (`index.html`). Para regenerar a mano las figuras, chequear las referencias o rearmar la página:

```bash
node paper/figuras/generar.js     # figuras y todas las cifras de la sección 4
python3 paper/verificar_bib.py    # cada referencia contra Crossref, Open Library o su URL
python3 paper/web.py              # index.html a partir del .tex
```

## Cómo citarlo

```bibtex
@misc{loiacono2026gravedad,
  author       = {Loiacono, Bruno},
  title        = {Gravedad contenida: el efecto {Janssen} y las fuerzas de marea como respuestas a qué cambia la forma de un recipiente},
  year         = {2026},
  howpublished = {Preprint, documento de trabajo sin revisión por pares},
  url          = {https://github.com/LoiaconoBruno/gravity-in-a-box}
}
```

## Licencia

El texto, las figuras y el PDF están bajo [CC BY 4.0](LICENSE-CC-BY-4.0.txt). Los scripts que generan las figuras y la página están bajo MIT. El detalle está en [LICENSE](LICENSE).
