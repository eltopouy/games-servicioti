# 🐣 Propuesta Pedagógica y Diseño de Minijuegos Infantiles (3+ Años)
**Proyecto:** Pajaritos de Pinamar — Paisaje Interactivo y Sonoro de Aves del Uruguay (`games.servicioti.com.uy`)  
**Público Objetivo:** Primera infancia (niños y niñas a partir de **3 años**, nivel inicial / preescolar y juego en familia)  
**Versión:** `v26` — Edición Infantil Interactiva

---

## 🎯 1. Principios de Diseño para Niños de 3+ Años (Pre-lectores)

A los 3 años de edad, los niños se encuentran en una etapa de **pensamiento preoperacional temprano**, caracterizada por la exploración sensorial directa, el aprendizaje por causa-efecto inmediato y una motricidad fina en pleno desarrollo. Para que la experiencia sea 100% autónoma, inclusiva y libre de frustración sin necesidad de saber leer, todos los minijuegos siguen estas reglas de oro:

1. **Autonomía sin Lectura (100% Icónico y Sonoro):**
   - Cada acción está guiada por **iconos grandes y expresivos** (🔊, 🔍, 💡, 🐣, ⭐, 🏆), **animaciones de pulso** que invitan a tocar y **cantos/locuciones reales** (`playBirdVoice`).
   - El texto escrito acompaña como apoyo para adultos o hermanos mayores, pero el niño comprende el objetivo únicamente mirando la imagen del ave o escuchando su canto.
2. **Tolerancia Cero a la Frustración (Feedback Positivo):**
   - No existen "vidas perdidas", cronómetros punitivos ni pantallas de "Game Over".
   - Cuando un niño toca una opción incorrecta, el pajarito hace un suave balanceo simpático (*wiggle*) con un sonido amigable (`"¡Casi! Probá con otro pajarito 🐦"`), invitándolo a intentar de nuevo sin penalización.
3. **Ergonomía Táctil Infantil (Botones XL y Aislamiento de Gestos):**
   - Áreas de toque amplias (mínimo `64px–110px`), alto contraste visual, bordes redondeados y bloqueo de propagación de eventos (`pointerdown`, `touchstart`, `touchmove`, `wheel`) dentro de los modales para evitar que un deslizamiento involuntario del dedo mueva el mapa de fondo.
4. **Recompensa Sensorial Multimodelo:**
   - Cada acierto combina **refuerzo auditivo** (acorde musical alegre + canto real del ave + voz con el nombre del pajarito) y **refuerzo visual** (lluvia de estrellas ⭐, confeti y trofeo al completar 5 rondas).

---

## 🎮 2. Suite de Minijuegos Implementados (`kids_games.js` + `coloring_game.js`)

### 👂 Juego 1: ¿Quién Canta? (Adivina el Canto — Discriminación Auditiva)
* **Cómo funciona sin saber leer:**
  - Al iniciar cada ronda, suena automáticamente el **canto real** de una de las 15 aves uruguayas (`audioElements[targetId]`) acompañado de un gran botón parlante animado (`🔊 Escuchar de nuevo`) que late al ritmo del sonido.
  - Debajo aparecen **3 tarjetas grandes y amigables** con las ilustraciones a todo color de los pajaritos (1 correcto y 2 distractores visualmente distintos).
  - Si el niño toca el pajarito correcto, estallan estrellas doradas, suena la locución con la voz real del ave (`playBirdVoice`), suma una estrella en su barra de progreso (`⭐ 1/5`) y avanza a la siguiente ronda hasta ganar la **Copa de Explorador Sonoro 🏆**.
* **Beneficios Cognitivos y Pedagógicos (3–5 años):**
  - **Discriminación auditiva y atención selectiva:** Entrena al oído infantil para diferenciar timbres, ritmos y frecuencias naturales (por ejemplo, distinguir el repiqueteo alegre del *Hornero*, el grito enérgico del *Benteveo*, el ulular grave del *Ñacurutú* o el tamborileo del *Carpintero*).
  - **Asociación multisensorial (oído-vista):** Vincula la huella acústica de la naturaleza con la morfología y colores reales del ave.

---

### 🃏 Juego 2: Memoria de Pajaritos (Memotest Visual y Sonoro)
* **Cómo funciona sin saber leer:**
  - Ofrece dos niveles claramente diferenciados por iconos:
    - **🐣 Pequeños (3+ años):** Tablero de **6 cartas gigantes** (3 parejas). Ideal para la memoria de trabajo de un niño de 3 años.
    - **🦅 Exploradores (5+ años):** Tablero de **12 cartas** (6 parejas) para niños mayores o juego compartido.
  - Al tocar una carta, gira suavemente en 3D mostrando la ilustración del pajarito y produciendo un tono musical suave.
  - Al encontrar la pareja idéntica, ambas cartas brillan en dorado, suena una fanfarria alegre, se escucha un **fragmento del canto real y la voz del ave**, y las cartas quedan descubiertas con una estrella `⭐`.
* **Beneficios Cognitivos y Pedagógicos (3–6 años):**
  - **Memoria de trabajo visoespacial:** Fortalece la retención a corto plazo de ubicaciones espaciales y rasgos visuales (colores del plumaje, forma del pico, copete rojo del *Cardenal*, antifaz del *Benteveo*).
  - **Funciones ejecutivas y control inhibitorio:** Enseña a esperar el giro de las cartas, observar con atención y planificar el siguiente toque.

---

### 🕵️ Juego 3: ¿Dónde Está? (Búsqueda Visual en el Paisaje de Pinamar)
* **Cómo funciona sin saber leer:**
  - Al elegir este juego, el modal se cierra y se despliega un **Banner Flotante Infantil (HUD)** en la parte superior del paisaje de Pinamar.
  - El banner muestra en tamaño grande la **foto del pajarito buscado** (`"🔍 ¡Buscá y tocá al [Nombre] en el paisaje!"`), el contador de estrellas (`⭐ 0/5`), un botón **`💡 Pista`** y el botón **`❌ Salir`**.
  - Si un niño pequeño necesita ayuda para encontrar un ave pequeña (como el *Picaflor* de 9 cm o el *Tordo* en la azotea), al tocar **`💡 Pista`** la cámara se desplaza suavemente hacia la zona del ave (`zoomToBird`), hace brillar al pajarito con un **halo dorado pulsante** en el paisaje y reproduce un fragmento de su canto como guía auditiva.
  - Cuando el niño toca al pajarito correcto directamente sobre el escenario (`#world-stage`), el ave canta, hace zoom de celebración, suma una estrella y tras unos instantes propone un nuevo pajarito para buscar.
* **Beneficios Cognitivos y Pedagógicos (3–6 años):**
  - **Percepción figura-fondo y atención espacial:** Estimula la capacidad de localizar una silueta específica integrada en un entorno natural rico en estímulos (árboles, playa, postes, techos).
  - **Comprensión de proporciones reales y hábitat:** Permite descubrir que cada ave ocupa un lugar propio en el ecosistema costero de Pinamar (la *Gaviota* en la arena, el *Tero* en el pasto, el *Carpintero* en el tronco, el *Ñacurutú* en la rama alta) y que tienen tamaños biológicos reales diferentes.

---

### 🎨 Juego 4: Taller de Pintura Mágica (`coloring_game.js` — Acceso Directo)
* **Cómo funciona sin saber leer:**
  - Accesible tanto desde la barra superior como desde la tarjeta dedicada en la Sala de Minijuegos.
  - Genera contornos tipo libro de colorear a partir de las 15 aves reales y permite pintar con el dedo usando **recorte mágico dentro de la silueta** (*sin salirse de la raya*), crayones de colores reales del ave, balde de relleno por zonas, sellos infantiles (⭐, ❤️, 🌸, 🎵) y mini-modelo de referencia.
* **Beneficios Cognitivos y Motores:**
  - **Motricidad fina y coordinación óculo-manual:** Prepara el control digital y la precisión del trazo previo a la lectoescritura.
  - **Observación naturalista:** Invita a mirar el modelo real para reconocer qué partes del *Cardenal* son rojas o qué colores tiene el *Picaflor*.

---

### 🌾 Juego 5: Dar de Comer a los Pajaritos (Empatía y Cuidado)
* **Cómo funciona sin saber leer:**
  - Integrado con un acceso directo desde la Sala de Minijuegos y la barra principal: el niño toca cualquier pajarito en el paisaje para lanzarle semillitas y miguitas (`🌾`, `🍓`, `🌽`), viendo cómo salta contento, dice `"¡Ñam ñam!"` y gana su estrella de alimentado hasta completar las 15 aves.
* **Beneficios Socioemocionales:**
  - **Empatía y vínculo afectivo con la biodiversidad local:** Fomenta el cuidado respetuoso de las aves del barrio y del balneario.

---

## 🌱 3. Ideas Futuras de Expansión (Hoja de Ruta Pedagógica)

Para próximas iteraciones de **Pajaritos de Pinamar**, se proponen tres actividades complementarias para seguir enriqueciendo el aprendizaje infantil:

1. **🪺 Constructor de Nidos (Motricidad de Arrastre — 3 a 5 años):**
   - Arrastrar ramitas, barro y hojitas hacia el poste para ayudar al *Hornero* a construir su casita de barro paso a paso, o ayudar a la *Cotorra* en lo alto del eucalipto.
2. **📏 ¿Cuál es Más Grande? (Pensamiento Lógico-Matemático — 4 a 6 años):**
   - Aprovechando las medidas biológicas reales (`realCm`: desde el *Picaflor* de 9 cm hasta la *Gaviota* de 58 cm), mostrar 2 o 3 pajaritos a escala real para que el niño toque el **más pequeñito** o el **más grandote**.
3. **🎵 Coro del Amanecer / Simón Dice Musical (Memoria Secuencial — 4 a 6 años):**
   - Dos o tres pajaritos cantan en orden iluminándose (ej. *Hornero* → *Benteveo*), y el niño los toca en el mismo orden para recrear la melodía del bosque.
