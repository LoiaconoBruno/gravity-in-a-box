# Gravedad contenida: paper de uso y guía de la idea

## Resumen

Este documento tiene dos partes. La primera es un paper de uso de **Gravity in a Box**, una página web interactiva que responde una pregunta en apariencia simple: ¿la forma de un recipiente cambia cómo actúa la gravedad adentro? La segunda es una guía de la idea que hay detrás: la historia y la física de por qué la respuesta es "sobre los cuerpos, casi nada; sobre los materiales y sobre las cajas grandes, bastante". La guía recorre el efecto Janssen en los silos (1895), la hidrostática de Stevin y Pascal, la física de los medios granulares de Reynolds a Jaeger, Nagel y Behringer, el principio de equivalencia de Einstein (1907) y las fuerzas de marea como la única firma local de un campo gravitatorio real. Cada concepto se conecta con una fórmula concreta del código (`src/caja.js`) y con un número que la herramienta muestra en pantalla.

La tesis es esta: un recipiente no "dobla" la gravedad, pero sí cambia **cómo se reparte el peso** (silo) y **cuánto se nota que el campo no es uniforme** (caja). Separar esas dos cosas es lo que convierte una intuición difusa en dos problemas de física que se pueden medir con una balanza de cocina o, en el caso extremo, con un satélite.

## Parte I. Paper de uso

### 1. Qué es la herramienta

Gravity in a Box es una página estática (HTML, CSS y JavaScript, sin dependencias ni paso de build). Se abre en el navegador, desde la [demo en vivo](https://loiaconobruno.github.io/gravity-in-a-box/) o con doble clic en `index.html` después de clonar el repositorio. Tiene dos tarjetas independientes:

1. **El silo: arroz en un tubo alto.** Calcula cuánto marca una balanza que sostiene solo el fondo de un tubo lleno de grano, y lo compara con lo que marcaría si el tubo estuviera lleno de un líquido de la misma densidad.
2. **La caja cerrada: el ascensor de Einstein.** Calcula cuánto cambia la gravedad entre el piso y el techo de una caja, y cuánto se mueven dos pares de bolas que caen libremente adentro, por efecto de las fuerzas de marea.

Toda la física está en `src/caja.js`, un archivo sin acceso al DOM que se puede probar con `npm test` (Node 18 o más nuevo). `src/grafico.js` dibuja los gráficos en un `<canvas>` y `src/app.js` conecta los deslizadores con los cálculos.

### 2. Instalación

No hace falta instalar nada para usarla. Para trabajar sin conexión o modificarla:

```bash
git clone https://github.com/LoiaconoBruno/gravity-in-a-box.git
cd gravity-in-a-box
npm test
```

Después se abre `index.html` con doble clic. La página funciona desde `file://` porque usa scripts clásicos, no módulos.

### 3. La tarjeta del silo, control por control

| Control | Rango | Qué representa |
|---|---|---|
| Altura de llenado *H* | 2 cm a 1 m | Hasta dónde llenaste el tubo |
| Diámetro *D* | 1 cm a 30 cm | El ancho interior del tubo |
| Rozamiento con la pared *μ* | 0,1 a 0,8 | Coeficiente de fricción entre grano y pared |
| Coeficiente de Janssen *K* | 0,2 a 0,8 | Cociente entre la presión horizontal y la vertical dentro del grano |
| Densidad aparente *ρ* | 400 a 1500 kg/m³ | Masa por volumen del grano a granel, con los huecos incluidos |

Abajo aparecen tres resultados:

- **Masa de grano en el tubo:** ρ · área · H. Es lo que pesa el arroz si lo pusieras todo en un plato.
- **Lo que marca la balanza:** la fuerza que llega al fondo dividida por g, expresada en gramos o kilos.
- **Longitud de saturación λ:** la altura característica a partir de la cual agregar grano arriba casi no cambia lo que siente el fondo.

El gráfico muestra, en función de la altura de llenado, dos curvas: la recta de un líquido (la balanza sube sin límite) y la curva del grano, que se aplana.

### 4. La tarjeta de la caja, control por control

| Control | Rango | Qué representa |
|---|---|---|
| Tamaño de la caja | 10 cm a 1000 km (escala logarítmica) | El lado de la caja; las bolas empiezan separadas esa misma distancia |
| Tiempo de caída libre | 1 s a unos 83 min (escala logarítmica) | Cuánto dura la caída |
| Altitud | de la superficie a 36 000 km | Altura sobre la superficie; 36 000 km es casi la órbita geoestacionaria |

La distancia al centro de la Tierra es r = R + altitud, con R = 6371 km. La página muestra:

- **Cambio de g entre piso y techo:** Δg/g, en partes por diez millones o en porcentaje si es grande.
- **Cuánto se acercan las bolas de los costados:** dos bolas que empiezan separadas en horizontal por el tamaño de la caja, después del tiempo de caída elegido.
- **Cuánto se separan las de arriba y abajo:** dos bolas que empiezan una sobre otra, separadas por el tamaño de la caja.
- **Período de Schuler:** el tiempo 2π/ω, que aparece en la navegación inercial y en el movimiento de un péndulo del tamaño de la Tierra.

El gráfico muestra el acercamiento lateral en función del tiempo. Cuando la caja supera el 5 % del radio terrestre (unos 320 km), el texto debajo del gráfico avisa que las fórmulas de primer orden dejan de ser exactas y que la forma de la caja ya importa.

### 5. Ejemplo resuelto

Este ejemplo es el estado con el que abre la página; los números son los que da la herramienta.

**Silo.** Un tubo de 5 cm de diámetro, lleno de arroz hasta 50 cm, con ρ = 800 kg/m³, μ = 0,4 y K = 0,4.

1. El área es π · (0,025 m)² ≈ 1,963 × 10⁻³ m². El volumen es 0,982 L y la masa de arroz es **785 g**.
2. La longitud de saturación es λ = D / (4μK) = 0,05 / 0,64 ≈ **7,8 cm**.
3. Como H / λ = 6,4, el factor (1 − e^(−6,4)) vale 0,998: el fondo está prácticamente saturado.
4. La masa que marca la balanza es ρ · λ · área · 0,998 ≈ **123 g**.

Es decir: de los 785 g de arroz, la balanza registra 123 g. Las paredes sostienen el 84 % del peso. Si se sube el diámetro a 20 cm, λ pasa a 31,2 cm y la balanza marca **6,27 kg**: cuanto más ancho el tubo, menos pared por unidad de volumen y menos peso desviado.

**Caja.** Una caja de 1 m en la superficie de la Tierra.

1. Δg/g = 2h/r = 2 / 6 371 000 ≈ **3,14 × 10⁻⁷**: tres partes en diez millones.
2. ω² = GM/r³ ≈ 1,54 × 10⁻⁶ s⁻², así que ω ≈ 1,24 × 10⁻³ s⁻¹ y el período de Schuler es 2π/ω ≈ **84,3 min**.
3. Después de 10 s de caída libre, las bolas lado a lado se acercan w(1 − cos ωt) ≈ **77,1 µm**, y las de arriba y abajo se separan h(cosh(√2 ωt) − 1) ≈ **154,1 µm**, el doble.

Ese "el doble" no es casualidad: es una propiedad del campo de Newton fuera de una masa (la traza del tensor de marea es cero), que se explica en la Parte II.

### 6. Cómo leer los resultados

- La curva del silo **no** dice que la gravedad sea menor adentro del tubo. Cada grano pesa lo mismo. Lo que cambia es **por dónde** baja ese peso: una parte va a las paredes por rozamiento.
- Los números de la caja **no** dicen que adentro de una habitación la gravedad sea perceptible como no uniforme. Son micrómetros en diez segundos. Sirven para ver de qué orden es el efecto y a partir de qué tamaño se vuelve dominante.
- Los dos casos responden la misma pregunta desde lados opuestos: en el silo la forma importa mucho y la gravedad es uniforme; en la caja la forma importa poco hasta que la caja es enorme.

#### 6.1 Preguntas frecuentes

**Si la balanza marca 123 g, ¿dónde están los otros 662 g?** En las paredes del tubo. El grano empuja de costado contra la pared y la fricción de ese contacto sostiene peso hacia arriba. Si el tubo estuviera colgado de un dinamómetro, ese dinamómetro registraría los 662 g que faltan (más el peso del propio tubo). La suma de lo que marcan la balanza y el soporte del tubo siempre da el peso total: el efecto Janssen redistribuye, no hace desaparecer.

**¿Por qué el resultado depende de μ y de K por separado si en la fórmula solo aparece su producto?** No depende por separado: λ = D/(4μK) solo ve el producto μK. La página los muestra como dos controles porque se miden de maneras distintas (μ con un plano inclinado de la misma superficie que el tubo, K con un sensor de fuerza lateral o a partir del ángulo de fricción interna). Dos combinaciones con el mismo producto dan curvas idénticas.

**¿Pasa lo mismo con un líquido muy viscoso, como la miel?** No. En reposo, cualquier fluido, por viscoso que sea, tiene presión isótropa y no sostiene esfuerzos de corte. La miel tarda en acomodarse, pero cuando se acomoda la balanza marca todo su peso. La saturación es propia de los materiales con fricción interna.

**¿Las bolas de la caja se acercan porque se atraen entre sí?** No. La atracción mutua entre dos bolas de un kilo separadas un metro es de unos 7 × 10⁻¹¹ N, despreciable. Se acercan porque cada una cae hacia el centro de la Tierra por su propia línea, y esas líneas convergen.

**¿Por qué el tiempo máximo de caída es de unos 83 minutos?** Porque es del orden del período de Schuler. Más allá, las fórmulas oscilatorias (el coseno) dan vueltas completas y la lectura física cambia: es el régimen de las órbitas, no el de una caída corta.

**¿Puedo usar la herramienta para otro planeta?** No desde la página: la masa y el radio de la Tierra están fijos en `src/caja.js` (`GM` y `R_TIERRA`). Se pueden cambiar en el código, o calcular a mano con las fórmulas de la sección 14.

### 7. Experimento casero sugerido

1. Conseguí un tubo rígido (un caño de PVC de 4 a 5 cm de diámetro y 60 cm de largo).
2. Sostenelo con una pinza o un soporte, de modo que no apoye sobre la balanza.
3. Debajo, una tapa suelta (un disco de cartón un poco más chico que el diámetro interior) que apoye sobre una balanza de cocina tarada.
4. Echá arroz de a 100 g y anotá lo que marca la balanza en cada paso.
5. Ajustá μ y K en la página hasta que la curva coincida con tus puntos.

Lo esperable es una saturación clara entre los 10 y los 20 cm de altura. Si la balanza sigue subiendo sin aplanarse, revisá que la tapa no esté trabada ni el tubo apoyado.

### 8. Limitaciones

- μ y K del arroz son valores típicos, no medidos: dependen del material del tubo, del grano, de la humedad y de cómo se llena.
- El modelo de Janssen supone presión uniforme en cada sección y fricción completamente movilizada contra las paredes. Los silos reales tienen efectos dinámicos al vaciarse (sobrepresiones, arcos, flujo de embudo).
- Las fórmulas de marea son de primer orden en h/r: valen para cajas chicas frente al radio de la Tierra.
- La página no aborda la parte de percepción humana de la idea original (cómo se siente un espacio alto o angosto).

## Parte II. Guía de la idea

### 9. La pregunta original y por qué hay que partirla

La idea que dio origen a esta herramienta tenía forma de intuición: en un espacio alto y angosto, ¿la gravedad "se siente" distinta?, ¿el recipiente cambia algo de cómo actúa? Es una pregunta que mezcla tres planos: la percepción (cómo se siente un ambiente), la física de los materiales (cómo se reparte el peso de algo contenido) y la física del campo gravitatorio (si el campo depende del recipiente).

Karl Popper insistía en que una idea avanza cuando se la formula de manera que pueda fallar (Popper, 1959). Para eso hay que separar las preguntas. Esta guía se ocupa de las dos que la física puede contestar con números:

1. **¿La forma del recipiente cambia la gravedad sobre lo que hay adentro?** No, salvo correcciones minúsculas por la propia masa del recipiente. Pero sí cambia **cómo se reparte el peso** cuando el contenido no es un fluido. Ese es el silo.
2. **¿Se puede notar, desde adentro de un recipiente cerrado, que hay gravedad?** Según Einstein, no, si la caja es chica: la gravedad uniforme es indistinguible de una aceleración. Pero el campo real nunca es uniforme, y las **mareas** lo delatan. Esa es la caja.

### 10. Antes del grano: la paradoja hidrostática

#### 10.1 Stevin y el agua que pesa más de lo que hay

Simon Stevin, ingeniero flamenco, publicó en 1586 *De Beghinselen des Waterwichts* ("Los principios del peso del agua"). Ahí aparece lo que hoy se llama la **paradoja hidrostática**: la fuerza que el agua hace sobre el fondo de un recipiente depende solo de la altura de la columna y del área del fondo, no de la cantidad de agua ni de la forma de las paredes. Un recipiente con forma de embudo invertido, angosto arriba y ancho abajo, puede ejercer sobre su fondo una fuerza mucho mayor que el peso del agua que contiene.

La explicación moderna es que, en un fluido en reposo, la presión es la misma en todas direcciones (isótropa) y solo crece con la profundidad:

$$ P(z) = ρ · g · z $$

donde z se mide hacia abajo desde la superficie libre. Las paredes inclinadas empujan hacia abajo o hacia arriba según su orientación, y el balance total siempre cierra con el peso, pero el **fondo** solo siente ρ g z.

#### 10.2 Pascal y el barril que revienta

Blaise Pascal sistematizó estos resultados en el *Traité de l'équilibre des liqueurs* (escrito hacia 1653, publicado póstumamente en 1663). Se le atribuye la demostración del "barril de Pascal": un tubo largo y finito encajado en la tapa de un barril lleno; al agregar apenas un poco de agua en el tubo, la presión en el barril sube lo suficiente para reventarlo. Lo que importa es la altura, no la cantidad.

En la tarjeta del silo, la recta "líquido" es exactamente esta ley: si el tubo se llenara de un líquido con la densidad del arroz, la balanza marcaría todo el peso y seguiría subiendo linealmente con la altura.

### 11. Por qué un grano no es un líquido

#### 11.1 Coulomb y la fricción interna

Un material granular (arena, arroz, trigo, café molido) es un conjunto de partículas sólidas que se tocan y se rozan. Charles-Augustin de Coulomb, en su memoria de 1773 sobre estática aplicada a la arquitectura (*Essai sur une application des règles de maximis et minimis à quelques problèmes de statique relatifs à l'architecture*, publicada en 1776), introdujo la idea de que un suelo resiste el corte con una ley de fricción: la tensión tangencial máxima es proporcional a la tensión normal. Esa es la base de la mecánica de suelos.

La consecuencia central es que, a diferencia de un fluido, **un grano puede sostener tensiones de corte en reposo**. Una pila de arena tiene un ángulo de reposo; un vaso de agua no.

#### 11.2 Rankine y la presión lateral

William Rankine, en 1857, publicó *On the stability of loose earth* en las *Philosophical Transactions of the Royal Society*. Ahí estudió la relación entre la presión vertical y la presión horizontal en un terreno granular. En un fluido ese cociente es 1. En un grano es menor, y depende del ángulo de fricción interna φ. Para el estado "activo" de Rankine:

$$ K = (1 − sen φ) / (1 + sen φ) $$

Con φ ≈ 30°, K ≈ 0,33. En el diseño de silos se usan valores de K entre 0,3 y 0,6 según el material y el criterio. Este K es el "coeficiente de Janssen" de la herramienta.

#### 11.3 Reynolds y la dilatancia

Osborne Reynolds, el mismo del número de Reynolds en fluidos, mostró en 1885 (*On the dilatancy of media composed of rigid particles in contact*, *Philosophical Magazine*) que un medio granular compacto, para deformarse, tiene que **expandirse**. Es la razón por la que la arena mojada de la orilla se seca alrededor del pie cuando la pisás: el grano se dilata y absorbe agua. La dilatancia es una pista de que el comportamiento del grano depende de su historia de compactación, algo que ninguna ecuación de fluidos captura.

#### 11.4 Cadenas de fuerza

Desde los años noventa, experimentos con discos fotoelásticos (que se iluminan bajo tensión) mostraron que en un medio granular las fuerzas no se reparten de manera pareja: viajan por **cadenas de fuerza**, caminos ramificados de granos muy cargados rodeados de granos casi libres. Robert Behringer y su grupo en Duke fueron referentes en estas visualizaciones. Las cadenas de fuerza explican por qué las cargas en el fondo de un silo fluctúan de un llenado a otro, y por qué una parte importante del peso puede desviarse hacia las paredes.

La revisión de Heinrich Jaeger, Sidney Nagel y Robert Behringer, *Granular solids, liquids, and gases* (*Reviews of Modern Physics*, 1996), es la puerta de entrada clásica a todo esto: el grano se comporta como sólido, líquido o gas según cómo se lo exija, y no es ninguno de los tres.

### 12. Janssen, 1895: el experimento del silo

#### 12.1 Quién fue y qué midió

H. A. Janssen era un ingeniero alemán que trabajaba en la construcción de silos para granos. En 1895 publicó *Versuche über Getreidedruck in Silozellen* ("Experimentos sobre la presión del grano en celdas de silo") en la *Zeitschrift des Vereines Deutscher Ingenieure*. Llenó modelos de silo con maíz y midió la presión en el fondo con un fondo móvil apoyado sobre una balanza, en esencia el mismo montaje que el experimento casero de la sección 7.

Encontró que la presión no crecía linealmente con la altura sino que se saturaba, y propuso un modelo de una sola ecuación que la describía bien. Matthias Sperl tradujo el artículo al inglés y lo comentó en 2006 (*Granular Matter*, 8, 59–65), lo que permite leerlo hoy con notación moderna.

#### 12.2 La deducción, paso a paso

Pensemos el tubo como una pila de rebanadas horizontales de espesor dz. Sea P(z) la presión vertical promedio a profundidad z, A = πD²/4 el área y πD el perímetro.

Sobre una rebanada actúan:

1. Su peso: ρ g A dz, hacia abajo.
2. La diferencia de presión vertical entre su cara de arriba y la de abajo: A dP.
3. La fricción con la pared. La presión horizontal contra la pared es K·P. La fricción máxima, por la ley de Coulomb, es μ·K·P por unidad de área de pared. El área de pared de la rebanada es πD dz.

Si la fricción está completamente movilizada (el grano ya deslizó un poco contra las paredes al asentarse), el equilibrio es:

$$ A · dP = ρ g A dz − μ K P · π D dz $$

Dividiendo por A dz y usando A = πD²/4:

$$ dP/dz = ρ g − (4 μ K / D) · P $$

Es una ecuación diferencial lineal de primer orden. Definiendo la longitud característica

$$ λ = D / (4 μ K) $$

la solución con P(0) = 0 es

$$ P(z) = ρ g λ · (1 − e^(−z/λ)) $$

Para z ≪ λ, la exponencial se desarrolla como 1 − z/λ y se recupera P ≈ ρ g z: el grano se comporta como líquido cerca de la superficie. Para z ≫ λ, P → ρ g λ: el fondo "ve" solo una columna de altura λ, por más alto que sea el silo.

#### 12.3 Qué hace la herramienta con esto

La función que calcula la presión en `src/caja.js` implementa exactamente esa fórmula. La masa que marca la balanza es la fuerza en el fondo, P·A, dividida por g:

$$ m_balanza = ρ λ A (1 − e^(−H/λ)) $$

y la masa real del grano es ρ A H. El cociente entre ambas tiende a λ/H para silos altos: con H = 50 cm y λ = 7,8 cm, la balanza ve alrededor de un sexto del peso. Ese es el 123 g sobre 785 g del ejemplo.

#### 12.4 Por qué importa en ingeniería

El efecto Janssen tiene dos caras para un ingeniero:

- **Buena noticia:** el fondo de un silo alto no necesita resistir el peso de toda la columna.
- **Mala noticia:** ese peso no desaparece, va a las paredes como fricción vertical. Las paredes trabajan a compresión y tienen que resistirlo. Muchos colapsos de silos se deben a que las paredes no estaban diseñadas para cargas asimétricas o para las sobrepresiones del vaciado.

Las normas modernas, como la Eurocódigo EN 1991-4 (acciones en silos y tanques), siguen usando la expresión de Janssen como base para el llenado, con correcciones para el vaciado y la excentricidad. Los textos de referencia son el libro de R. M. Nedderman, *Statics and Kinematics of Granular Materials* (Cambridge University Press, 1992), y el de Jacques Duran, *Sands, Powders, and Grains* (Springer, 2000).

#### 12.5 Los límites del modelo

Janssen supone tres cosas que no siempre se cumplen:

1. **Presión uniforme en cada sección.** En realidad la presión es mayor en el centro que contra las paredes.
2. **K constante.** K depende del estado de compactación y puede variar con la profundidad.
3. **Fricción completamente movilizada.** Si el grano no deslizó contra las paredes, la fricción es menor que μKP y la saturación es más débil.

Loïc Vanel y Éric Clément midieron en 1999 la presión en el fondo de columnas granulares con mucho cuidado (*European Physical Journal B*, 11, 525–533) y encontraron que el modelo de Janssen describe bien el promedio, pero que las fluctuaciones de un llenado a otro son grandes y dependen del procedimiento. Esto es lo que la limitación "μ y K son valores típicos" quiere decir en la práctica.

#### 12.6 Vaciar es más difícil que llenar

La herramienta modela un silo que se llena y queda quieto. Cuando se abre la boca de descarga, la física cambia. Andrew Jenike, en el informe *Storage and Flow of Solids* (Universidad de Utah, 1964), clasificó el flujo de un silo en dos regímenes:

- **Flujo másico (mass flow):** todo el grano baja a la vez, como un pistón. Ocurre en tolvas empinadas y lisas. El primero que entra es el primero que sale.
- **Flujo de embudo (funnel flow):** solo baja un canal central y el grano junto a las paredes queda estancado. Ocurre en tolvas chatas o rugosas. El último que entra sale primero, y el grano viejo puede apelmazarse o pudrirse.

En la transición entre la parte cilíndrica y la tolva aparece un "pico" de presión sobre las paredes que el modelo de Janssen no predice. Jenike mostró cómo elegir el ángulo de la tolva y el tamaño de la boca para evitar los dos problemas clásicos: los **arcos** (el grano forma una bóveda estable sobre la boca y deja de salir) y las **chimeneas** (se vacía un canal vertical y el resto queda colgado).

#### 12.7 Otros lugares donde aparece Janssen

La saturación de la presión no es una rareza de los silos. Aparece en cualquier tubo lleno de partículas:

- **El reloj de arena.** El caudal de un grano por un orificio casi no depende de la altura de la columna, porque la presión cerca de la boca está saturada. W. A. Beverloo, H. A. Leniger y J. van de Velde midieron en 1961 (*Chemical Engineering Science*, 15, 260–269) que el caudal crece con el diámetro del orificio a la potencia 5/2 y no con la altura. Con agua, en cambio, el caudal cae a medida que baja el nivel (ley de Torricelli). Por eso los relojes se hacen con arena.
- **La cápsula de café o el filtro compactado.** Una columna de polvo comprimida con un émbolo transmite al fondo mucho menos fuerza de la que se aplica arriba, porque las paredes se quedan con una parte.
- **Las columnas de cromatografía.** En química, el relleno de una columna se compacta en capas; si no se hace con cuidado, el efecto de pared genera canales y la separación empeora.
- **Las tabletas farmacéuticas.** Al comprimir polvo en una matriz, la densidad de la tableta no es uniforme: es mayor arriba, cerca del punzón, y menor abajo, por la fricción con la matriz. La industria farmacéutica modela esto con versiones del mismo balance de rebanadas.

### 13. El ascensor de Einstein

#### 13.1 Galileo y la universalidad de la caída

La segunda mitad de la herramienta se apoya en un hecho que Galileo Galilei ya defendía en los *Discorsi e dimostrazioni matematiche intorno a due nuove scienze* (1638): todos los cuerpos caen con la misma aceleración en el vacío, independientemente de su masa o de qué estén hechos. Isaac Newton lo incorporó en los *Principia* (1687) como la igualdad entre masa inercial y masa gravitatoria, y lo probó con péndulos de distintos materiales.

Esa universalidad es extraordinaria. La fuerza eléctrica sobre un cuerpo depende de su carga, no de su masa; la aceleración resultante varía de un cuerpo a otro. La gravedad no: acelera todo por igual. Experimentos como el de Loránd Eötvös (hacia 1908, publicados en 1922 con Pekár y Fekete) y, más recientemente, la misión satelital MICROSCOPE (Touboul et al., 2017 y 2022) la confirmaron con precisiones de una parte en 10¹⁵.

#### 13.2 "El pensamiento más feliz de mi vida"

En 1907, Albert Einstein escribió un artículo de revisión sobre la relatividad especial para el *Jahrbuch der Radioaktivität und Elektronik* (*Über das Relativitätsprinzip und die aus demselben gezogenen Folgerungen*). En la última sección introdujo lo que después llamaría el **principio de equivalencia**: un observador encerrado en una caja que acelera uniformemente en el espacio vacío no puede distinguir, con ningún experimento local, esa situación de estar en reposo en un campo gravitatorio uniforme. Y al revés: un observador en una caja en caída libre no siente gravedad.

Einstein recordó años más tarde que la idea le vino al pensar que una persona en caída libre no siente su propio peso, y la llamó "el pensamiento más feliz de mi vida". En 1911 (*Annalen der Physik*, 35, 898–908) usó el principio para predecir que la luz se curva al pasar cerca del Sol y que los relojes marchan más lento más abajo en un campo gravitatorio.

#### 13.3 La trampa del principio: "uniforme"

La palabra clave es **uniforme**. Un campo gravitatorio real, como el de la Tierra, no es uniforme por dos razones:

1. **Apunta hacia el centro.** Dos objetos separados horizontalmente caen hacia el mismo punto, así que sus trayectorias convergen.
2. **Se debilita con la distancia.** El objeto de abajo, más cerca del centro, cae con un poco más de aceleración que el de arriba, así que se separan.

Por eso el principio de equivalencia es local: vale en una región lo bastante chica y durante un tiempo lo bastante corto como para que estas diferencias no se noten. Charles Misner, Kip Thorne y John Wheeler lo explican con insistencia en *Gravitation* (1973): la gravedad "verdadera", la que no se puede eliminar eligiendo un sistema de referencia en caída libre, es la marea. En el lenguaje de la relatividad general, la marea es la **curvatura** del espacio-tiempo.

### 14. Las fuerzas de marea, en Newton y en Einstein

#### 14.1 El tensor de marea newtoniano

Sea g(r) = −GM r̂ / r² el campo de la Tierra. Si dos partículas están en posiciones r y r + ξ, con ξ pequeño, la diferencia de aceleraciones es, a primer orden,

$$ d²ξ/dt² = (ξ · ∇) g $$

Para un campo central, en un sistema con el eje z apuntando radialmente hacia afuera, eso da:

$$ d²ξ_x/dt² = −ω² ξ_x,   d²ξ_y/dt² = −ω² ξ_y,   d²ξ_z/dt² = +2 ω² ξ_z $$

con ω² = GM/r³. Las direcciones horizontales se comprimen; la vertical se estira el doble. La suma de los tres coeficientes, −1 −1 +2, es cero: esa es la ecuación de Laplace (∇² Φ = 0) para el potencial gravitatorio fuera de las masas.

#### 14.2 Las soluciones que usa la herramienta

Las ecuaciones de arriba se resuelven con funciones elementales. Si dos bolas empiezan en reposo relativo a una distancia w en horizontal:

$$ ξ_x(t) = w · cos(ω t) $$

y el acercamiento es w (1 − cos ωt). Si empiezan a una distancia h en vertical:

$$ ξ_z(t) = h · cosh(√2 · ω t) $$

y la separación extra es h (cosh(√2 ωt) − 1). Para tiempos cortos (ωt ≪ 1), ambos se aproximan por ω² t²/2 · w y ω² t² · h: la separación vertical es el doble del acercamiento horizontal, exactamente lo que da el ejemplo (154,1 µm contra 77,1 µm).

La diferencia de g entre piso y techo sale de derivar g = GM/r²:

$$ Δg / g ≈ 2 h / r $$

#### 14.3 La misma idea, en relatividad general

En relatividad general, la separación entre dos geodésicas vecinas obedece la **ecuación de desvío geodésico**:

$$ D²ξ^μ / dτ² = − R^μ_(νρσ) · u^ν · ξ^ρ · u^σ $$

donde R es el tensor de curvatura de Riemann y u la cuadrivelocidad. En el límite de campo débil y velocidades bajas, las componentes R^i_(0j0) se reducen a las derivadas segundas del potencial newtoniano, y se recupera exactamente el tensor de marea de la sección anterior. Bernard Schutz desarrolla este paso con cuidado en *A First Course in General Relativity* (2.ª ed., 2009). La herramienta, aunque usa fórmulas newtonianas, está calculando la manifestación de baja velocidad de la curvatura del espacio-tiempo.

#### 14.4 El período de Schuler

El número 2π/ω, unos 84 minutos en la superficie de la Tierra, aparece en un lugar inesperado. En 1923, el ingeniero alemán Max Schuler mostró (*Physikalische Zeitschrift*, 24, 344–350) que un péndulo cuyo largo fuera igual al radio de la Tierra no se vería perturbado por las aceleraciones horizontales del vehículo que lo lleva, y que su período sería de unos 84 minutos. Ese principio se usa en las plataformas de navegación inercial de aviones y submarinos: los errores de un sistema inercial oscilan con el período de Schuler.

Hay una coincidencia que no es coincidencia: 84 minutos es también el período de un satélite en órbita rasante a la Tierra, y el de un objeto que cayera por un túnel recto a través de una Tierra de densidad uniforme. En los tres casos aparece la misma frecuencia √(GM/R³).

### 15. Cuándo la forma de la caja sí importa

Para una caja de 1 m, las mareas son de micrómetros. Pero los efectos crecen con el tamaño y con el tiempo:

| Tamaño de la caja | Δg/g piso-techo | Comentario |
|---|---|---|
| 1 m | 3 × 10⁻⁷ | Medible con gravímetros de laboratorio |
| 100 m (rascacielos) | 3 × 10⁻⁵ | Los gravímetros de átomos fríos lo resuelven con holgura |
| 10 km | 3 × 10⁻³ | Del orden de las variaciones de g por latitud |
| 1000 km | 0,3 | Las fórmulas de primer orden ya fallan |

Más allá de unos cientos de kilómetros, la forma de la caja empieza a importar de verdad: una caja alta y angosta "ve" un campo que cambia mucho a lo largo, mientras que una chata y ancha ve sobre todo la convergencia lateral. La herramienta avisa cuando se entra en ese régimen.

Hay experimentos que miden estos efectos con objetos de tamaño humano. En 1960, Robert Pound y Glen Rebka midieron en una torre de 22,5 m de la Universidad de Harvard el corrimiento al rojo gravitatorio de la luz (*Physical Review Letters*, 4, 337): un cambio de frecuencia de 2,5 partes en 10¹⁵, consistente con la predicción de Einstein de 1911. En 2010, Chou, Hume, Rosenband y Wineland, en el NIST, detectaron con relojes ópticos la diferencia de ritmo entre dos relojes separados solo 33 cm en altura (*Science*, 329, 1630). La gravedad no uniforme dentro de una habitación ya se mide.

A escala planetaria, las misiones GRACE (2002–2017) y GRACE-FO (desde 2018) son literalmente dos "bolas" en caída libre separadas unos 220 km que miden su distancia mutua con precisión de micrómetros. Las variaciones de esa distancia revelan cambios en la distribución de masa de la Tierra: hielo que se derrite, acuíferos que se vacían (Tapley et al., 2004, *Science*, 305, 503). Es la tarjeta de la caja hecha satélite.

### 16. La misma marea, en el mar y en el cielo

#### 16.1 Newton, Laplace y los océanos

Las fuerzas que acercan y separan las bolas de la caja son las mismas que levantan el mar dos veces por día. Newton dio la primera explicación en los *Principia* (Libro III, 1687): la Luna atrae más al océano del lado cercano que al centro de la Tierra, y más al centro que al océano del lado lejano. El resultado no es un solo bulto hacia la Luna sino **dos**, uno de cada lado: es la misma estructura +2, −1, −1 del tensor de marea. Por eso hay dos pleamares diarias y no una.

La aceleración de marea que produce la Luna en la superficie terrestre es

$$ a_marea ≈ 2 G M_Luna R / d³ ≈ 1,1 × 10⁻⁶ m/s² $$

unas diez millonésimas de g. Pierre-Simon Laplace, en el *Traité de mécanique céleste* (1799–1825), mostró que la respuesta del océano a esa fuerza no es estática: el mar es un fluido con resonancias, y la forma de las costas y del fondo amplifica o anula la marea. George Darwin, hijo de Charles, escribió *The Tides and Kindred Phenomena in the Solar System* (1898), donde ya aparece la idea de que la fricción de mareas frena la rotación de la Tierra y aleja a la Luna, unos 3,8 cm por año según los retrorreflectores dejados por las misiones Apolo.

La lección para la herramienta es que la "caja" puede ser un planeta entero, y que la diferencia entre la caja chica y la grande es solo de escala: con ωt ≪ 1 y h ≪ r, todo se reduce a micrómetros; con h ∼ r, a mareas de metros.

#### 16.2 Roche y la espaguetización

Si la caja no fuera rígida sino un cuerpo sostenido solo por su propia gravedad, la marea podría romperlo. Édouard Roche calculó en 1849 la distancia mínima a la que un satélite fluido puede orbitar un planeta sin desarmarse: el **límite de Roche**, de unos 2,44 veces el radio del planeta para densidades iguales. Los anillos de Saturno están adentro de ese límite. En 1992, el cometa Shoemaker-Levy 9 pasó cerca de Júpiter, se partió en más de veinte fragmentos y en 1994 los fragmentos chocaron contra el planeta; Erik Asphaug y Willy Benz usaron la ruptura para estimar que el cometa era un conjunto de rocas sueltas, un *rubble pile* (*Nature*, 370, 120–124, 1994). Un cometa así es, otra vez, un medio granular sometido a gravedad: las dos mitades de esta guía se encuentran.

En el caso extremo de un agujero negro, la marea crece como M/r³ y un objeto que cae se estira en la dirección radial y se comprime en las laterales, lo que Kip Thorne populariza como "espaguetización" en *Black Holes and Time Warps* (1994). Para un agujero negro de masa estelar, eso ocurre mucho antes del horizonte; para uno supermasivo, después. La herramienta no llega a esos regímenes, pero la estructura de las fórmulas que usa es la misma.

#### 16.3 La caja en órbita

El control de altitud permite subir la caja. En la órbita de la Estación Espacial Internacional, a unos 400 km, el acercamiento de las bolas en 10 s baja de 77,1 µm a 64,2 µm: la marea se debilita como 1/r³, así que a 400 km es un 17 % más débil, no cero. La "ingravidez" de los astronautas no es ausencia de gravedad (a esa altura g todavía vale 8,7 m/s²) sino caída libre, el principio de equivalencia en acción. Lo que queda es la **microgravedad**: mareas residuales y pequeñas aceleraciones por el roce con la atmósfera, que los experimentos de física de fluidos y de materiales granulares a bordo tienen que tener en cuenta.

### 17. La masa del recipiente: la pequeña verdad de la intuición

¿Hay algún sentido en que el recipiente cambie la gravedad adentro? Sí, uno pequeño: el recipiente tiene masa y atrae.

Newton demostró en los *Principia* (Libro I, Proposición 70) el **teorema de la cáscara**: dentro de una cáscara esférica uniforme, la atracción gravitatoria de la cáscara es exactamente cero en todos los puntos. Para un tubo o una caja no esférica no es cero, pero es minúscula: un cilindro de hormigón de varias toneladas produce en su interior campos del orden de 10⁻⁸ g. Henry Cavendish necesitó en 1798 una balanza de torsión exquisita para medir la atracción entre esferas de plomo de 158 kg (*Philosophical Transactions*, 88, 469–526).

Así que la respuesta honesta a la pregunta original es: el recipiente cambia la gravedad adentro en una parte en cien millones, y eso no se siente. Lo que sí cambia de manera grande y medible es el reparto del peso en el contenido (silo) y lo que se puede medir desde adentro cuando el recipiente es enorme (caja).

### 18. La parte que la física no contesta: percepción

La idea original también preguntaba cómo **se siente** un espacio alto o angosto. Eso no es física del campo sino psicología de la percepción, y tiene su propia tradición experimental. Adelbert Ames Jr. construyó en los años cuarenta la "habitación de Ames", una sala trapezoidal que, vista desde un punto, parece rectangular y hace que una persona parezca gigante en un rincón y diminuta en el otro. William Ittelson documentó estas demostraciones en *The Ames Demonstrations in Perception* (1952). James J. Gibson, en *The Ecological Approach to Visual Perception* (1979), sostuvo que percibimos el espacio a partir de la información del entorno (gradientes de textura, horizonte), no a partir de "sensaciones" aisladas.

En la percepción de la vertical intervienen el sistema vestibular (los otolitos del oído interno son, literalmente, acelerómetros que no distinguen gravedad de aceleración, el principio de equivalencia en biología) y la vista. Herman Witkin y Solomon Asch mostraron en 1948 con la prueba de la varilla y el marco que un marco inclinado desvía el juicio de la vertical. Esa es la puerta para un próximo experimento: no sobre la gravedad sino sobre cómo un recipiente cambia **lo que creemos** que hace la gravedad.

### 19. Del modelo al código

| Concepto | Dónde en el código | Qué número produce |
|---|---|---|
| Hidrostática de Stevin y Pascal | curva "líquido" en `src/caja.js` | La recta del gráfico del silo |
| Ecuación de Janssen | función de presión del silo | "Lo que marca la balanza" |
| Longitud de saturación λ = D/(4μK) | mismo módulo | "Longitud de saturación" |
| Δg/g = 2h/r | cálculo de la caja | Partes por millón entre piso y techo |
| Tensor de marea, ω² = GM/r³ | funciones de acercamiento y separación | µm de las bolas |
| Período de Schuler 2π/ω | mismo módulo | 84,3 min |

Los tests en `test/caja.test.js` comprueban los límites físicos: que el grano se comporte como líquido para alturas chicas; que la presión se sature en ρgD/(4μK); que en el tubo de 5 cm la balanza marque mucho menos que la masa real; que un tubo más ancho sature más alto; que en una caja de 1 m g cambie unas 3 partes en 10 millones; que el período de Schuler sea de unos 84 minutos; que dos bolas a 1 m que caen 10 s se acerquen unas 77 micras, y que el efecto de marea sea más chico a mayor altitud.

Las funciones públicas de `Caja` son: `longitudSaturacion`, `presionGranular`, `presionLiquido`, `masaAparente`, `masaReal`, `masaSaturacion` y `marea`. Se pueden usar desde Node para hacer cuentas propias:

```js
const Caja = require("./src/caja.js");
const p = { ...Caja.ARROZ, D: 0.2 };
console.log(Caja.masaAparente(0.5, p));            // ≈ 6,27 kg
console.log(Caja.marea({ h: 1, w: 1, T: 10 }));    // acercamiento ≈ 7,71e-5 m
```

### 20. Ejercicios para pensar con la herramienta

1. Con D = 5 cm, ¿qué μ hace falta para que la balanza marque la mitad del peso con H = 20 cm? Resolvelo a mano con la fórmula y comprobalo con los deslizadores.
2. Un silo real de trigo tiene D = 6 m, μ = 0,4, K = 0,5 y ρ = 780 kg/m³. Calculá λ. ¿A partir de qué altura el fondo deja de notar el grano nuevo?
3. ¿Por qué un reloj de arena marca el tiempo de forma bastante pareja aunque la altura de arena cambie? (Pista: el caudal por un orificio en un grano casi no depende de la altura, a diferencia de un líquido; es la ley de Beverloo, de 1961.)
4. Calculá el período de Schuler en la superficie de la Luna (M = 7,35 × 10²² kg, R = 1737 km).
5. Subí la caja a la órbita geoestacionaria (unos 35 800 km). ¿Cuánto vale ahí el período de Schuler? Compará con 24 horas y explicá la coincidencia.
6. Diseñá un experimento para medir K del arroz con un tubo transparente y un sensor de fuerza lateral.

### 21. Glosario

- **Densidad aparente:** masa de un material granular dividida por el volumen total que ocupa, incluidos los huecos.
- **Coeficiente de Janssen (K):** cociente entre la presión horizontal y la vertical dentro del grano.
- **Longitud de saturación (λ):** escala de altura a partir de la cual la presión en el fondo de un silo deja de crecer.
- **Principio de equivalencia:** imposibilidad de distinguir localmente un campo gravitatorio uniforme de una aceleración.
- **Fuerza de marea:** diferencia de la atracción gravitatoria entre dos puntos cercanos; la parte del campo que no se elimina cayendo libremente.
- **Período de Schuler:** 2π √(R³/GM), unos 84 minutos para la Tierra.
- **Desvío geodésico:** cómo se separan o se acercan dos trayectorias de caída libre vecinas; en relatividad general lo controla la curvatura de Riemann.

### 22. Conclusión

La intuición de que "el recipiente cambia la gravedad" es falsa en sentido literal y verdadera en dos sentidos más interesantes. En un silo, la forma del recipiente decide cuánto del peso del grano llega al fondo: Janssen lo midió en 1895 y la ingeniería lo sigue usando. En una caja cerrada, el tamaño decide si se puede detectar la gravedad desde adentro: Einstein mostró que una caja chica no puede, y las mareas, que son la curvatura del espacio-tiempo, muestran a partir de qué tamaño sí. La herramienta pone números a las dos respuestas y deja abierta una tercera pregunta, la de la percepción, para un experimento distinto.

El paso siguiente natural es empírico: hacer el experimento del tubo de arroz, medir μ y K con el propio material y comparar la curva medida con la de la página. Si los puntos se aplanan donde la herramienta dice, la idea pasó su primera prueba. Si no, el desacuerdo dice algo concreto sobre el grano, el tubo o el procedimiento de llenado, que es exactamente lo que Vanel y Clément encontraron al repetir a Janssen un siglo después: el modelo es un punto de partida, no el final.

## Referencias

- Asphaug, E., & Benz, W. (1994). Density of comet Shoemaker–Levy 9 deduced by modelling breakup of the parent 'rubble pile'. *Nature*, 370, 120–124. https://doi.org/10.1038/370120a0
- Beverloo, W. A., Leniger, H. A., & van de Velde, J. (1961). The flow of granular solids through orifices. *Chemical Engineering Science*, 15(3–4), 260–269. https://doi.org/10.1016/0009-2509(61)85030-6
- Cavendish, H. (1798). Experiments to determine the density of the Earth. *Philosophical Transactions of the Royal Society of London*, 88, 469–526. https://doi.org/10.1098/rstl.1798.0022
- Chou, C. W., Hume, D. B., Rosenband, T., & Wineland, D. J. (2010). Optical clocks and relativity. *Science*, 329(5999), 1630–1633. https://doi.org/10.1126/science.1192720
- Coulomb, C.-A. (1776). Essai sur une application des règles de maximis et minimis à quelques problèmes de statique relatifs à l'architecture. *Mémoires de Mathématique et de Physique présentés à l'Académie Royale des Sciences*, 7, 343–382.
- Darwin, G. H. (1898). *The Tides and Kindred Phenomena in the Solar System*. Houghton, Mifflin.
- Duran, J. (2000). *Sands, Powders, and Grains: An Introduction to the Physics of Granular Materials*. Springer. ISBN 978-0-387-98656-2.
- Einstein, A. (1907). Über das Relativitätsprinzip und die aus demselben gezogenen Folgerungen. *Jahrbuch der Radioaktivität und Elektronik*, 4, 411–462.
- Einstein, A. (1911). Über den Einfluß der Schwerkraft auf die Ausbreitung des Lichtes. *Annalen der Physik*, 35, 898–908. https://doi.org/10.1002/andp.19113401005
- Galilei, G. (1638). *Discorsi e dimostrazioni matematiche intorno a due nuove scienze*. Leiden: Elsevier.
- Gibson, J. J. (1979). *The Ecological Approach to Visual Perception*. Houghton Mifflin.
- Ittelson, W. H. (1952). *The Ames Demonstrations in Perception*. Princeton University Press.
- Jaeger, H. M., Nagel, S. R., & Behringer, R. P. (1996). Granular solids, liquids, and gases. *Reviews of Modern Physics*, 68(4), 1259–1273. https://doi.org/10.1103/RevModPhys.68.1259
- Janssen, H. A. (1895). Versuche über Getreidedruck in Silozellen. *Zeitschrift des Vereines Deutscher Ingenieure*, 39(35), 1045–1049.
- Jenike, A. W. (1964). *Storage and Flow of Solids* (Bulletin 123). Utah Engineering Experiment Station, University of Utah.
- Laplace, P.-S. (1799–1825). *Traité de mécanique céleste* (5 vols.). París: Duprat / Bachelier.
- Misner, C. W., Thorne, K. S., & Wheeler, J. A. (1973). *Gravitation*. W. H. Freeman. ISBN 978-0-7167-0344-0.
- Nedderman, R. M. (1992). *Statics and Kinematics of Granular Materials*. Cambridge University Press. ISBN 978-0-521-40435-7.
- Newton, I. (1687). *Philosophiæ Naturalis Principia Mathematica*. Londres: Royal Society.
- Pascal, B. (1663). *Traités de l'équilibre des liqueurs et de la pesanteur de la masse de l'air*. París: Guillaume Desprez.
- Popper, K. (1959). *The Logic of Scientific Discovery*. Hutchinson.
- Pound, R. V., & Rebka, G. A. (1960). Apparent weight of photons. *Physical Review Letters*, 4(7), 337–341. https://doi.org/10.1103/PhysRevLett.4.337
- Rankine, W. J. M. (1857). On the stability of loose earth. *Philosophical Transactions of the Royal Society of London*, 147, 9–27. https://doi.org/10.1098/rstl.1857.0003
- Reynolds, O. (1885). On the dilatancy of media composed of rigid particles in contact. *Philosophical Magazine*, 20(127), 469–481. https://doi.org/10.1080/14786448508627791
- Roche, É. (1849). La figure d'une masse fluide soumise à l'attraction d'un point éloigné. *Mémoires de l'Académie des sciences de Montpellier*, 1, 243–262.
- Schuler, M. (1923). Die Störung von Pendel- und Kreiselapparaten durch die Beschleunigung des Fahrzeuges. *Physikalische Zeitschrift*, 24, 344–350.
- Schutz, B. (2009). *A First Course in General Relativity* (2.ª ed.). Cambridge University Press. ISBN 978-0-521-88705-2.
- Sperl, M. (2006). Experiments on corn pressure in silo cells: Translation and comment of Janssen's paper from 1895. *Granular Matter*, 8(2), 59–65. https://doi.org/10.1007/s10035-005-0224-z
- Stevin, S. (1586). *De Beghinselen des Waterwichts*. Leiden: Plantijn.
- Tapley, B. D., Bettadpur, S., Watkins, M., & Reigber, C. (2004). The gravity recovery and climate experiment: Mission overview and early results. *Geophysical Research Letters*, 31(9), L09607. https://doi.org/10.1029/2004GL019920
- Thorne, K. S. (1994). *Black Holes and Time Warps: Einstein's Outrageous Legacy*. W. W. Norton. ISBN 978-0-393-31276-8.
- Touboul, P., et al. (2017). MICROSCOPE mission: First results of a space test of the equivalence principle. *Physical Review Letters*, 119(23), 231101. https://doi.org/10.1103/PhysRevLett.119.231101
- Vanel, L., & Clément, E. (1999). Pressure screening and fluctuations at the bottom of a granular column. *European Physical Journal B*, 11(3), 525–533. https://doi.org/10.1007/s100510050965
- Witkin, H. A., & Asch, S. E. (1948). Studies in space orientation IV: Further experiments on perception of the upright with displaced visual fields. *Journal of Experimental Psychology*, 38(6), 762–782. https://doi.org/10.1037/h0053671
