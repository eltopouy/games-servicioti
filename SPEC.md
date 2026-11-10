# SPEC - Pajaritos de Pinamar (games.servicioti.com.uy)

## 📌 Descripción General
Videojuego web interactivo y educativo ambientado en los balnearios de Uruguay (Pinamar, Canelones), enfocado en la fauna autóctona de aves, sus cantos reales, comportamiento ornitológico, animaciones y minijuegos infantiles.

## 🦤 Aves Presentes (15 Especies Autóctonas de Uruguay con Tamaño Biológico Real)
1. **Hornero** (*Furnarius rufus*, `19.5 cm` / envergadura `29 cm`) - Ave nacional, posado sin nido, canta con aleteo alegre.
2. **Tero** (*Vanellus chilensis*, `35 cm` / envergadura `78 cm`) - Centinela del campo, espolones carmesí, primer plano en suelo.
3. **Benteveo** (*Pitangus sulphuratus*, `23 cm` / envergadura `36 cm`) - Antifaz negro, pecho amarillo vivo, posado en ramas.
4. **Cotorra** (*Myiopsitta monachus*, `29 cm` / envergadura `45 cm`) - Verde esmeralda, gregario en eucaliptos y pinos, safe-area móvil.
5. **Cardenal de Copete Rojo** (*Paroaria coronata*, `19 cm` / envergadura `27 cm`) - Cabeza roja brillante, en arbustos florales.
6. **Zorzal Colorado** (*Turdus rufiventris*, `23.5 cm` / envergadura `37 cm`) - Vientre rojizo, primer plano en césped buscando lombrices.
7. **Chingolo** (*Zonotrichia capensis*, `14 cm` / envergadura `21 cm`) - Copete estriado y collar canela, en postes de alambrado.
8. **Gaviota Cocinera** (*Larus dominicanus*, `58 cm` / envergadura `135 cm`) - De pie en suelo despejado o losa, primer plano.
9. **Tordo Renegrido** (*Molothrus bonariensis*, `20 cm` / envergadura `31 cm`) - Plumaje azabache tornasolado, posado en el pretil de la azotea escolar al fondo a escala pequeña por perspectiva.
10. **Carpintero** (*Colaptes campestris / melanochloros*, `30 cm` / envergadura `48 cm`) - Nuca roja y pecho amarillo dorado con barras negras, posado en el tronco principal del eucalipto/pino.
11. **Dorado** (*Sicalis flaveola*, `14 cm` / envergadura `22 cm`) - Plumaje amarillo solar con frente anaranjada, posado en el cerco soleado.
12. **Ñacurutú** (*Bubo virginianus nacurutu*, `50 cm` / envergadura `125 cm`) - El gran búho cornudo de Uruguay con penachos auriculares, ojos ámbar, babero blanco y pecho barrado, posado en las ramas altas.
13. **Torcaza** (*Zenaida auriculata*, `24 cm` / envergadura `38 cm`) - Paloma nativa con reflejos tornasolados violáceos en el cuello y manchas negras alares, en la explanada frontal.
14. **Calandria** (*Mimus saturninus*, `26 cm` / envergadura `36 cm`) - Ceja blanca marcada y cola larga con timoneras externas blancas, posada en los postes centrales.
15. **Picaflor Bronceado** (*Hylocharis chrysura*, `9 cm` / envergadura `12 cm`) - Plumaje verde esmeralda y dorado metálico con pico rojo coral, junto a los arbustos floridos.

## 🎨 Escenarios y Fondos 16:9
1. **Balneario Pinamar Escuela 295** (`costa`, por defecto).
2. **Calle de Tosca - Mediodía** (`mediodia`).
3. **Calle de Tosca - Atardecer** (`atardecer`).
4. **Calle de Tosca - Amanecer** (`amanecer`).

## 📐 Sistema de Proporción Biológica Real + Perspectiva Z (`v26`)
- **Fórmula Combinada (`tools/calcular_proporciones_v26.py` & `tools/proporciones_aves_v26.json`):**
  $$\text{scale} = \text{clamp}\left(0.89 \times \text{sizeFactor} \times \text{depthFactor} \times \text{spriteComp},\ 0.44,\ 1.48\right)$$
  donde $\text{sizeFactor} = (\text{realCm} / 22.0)^{0.58}$ refleja la proporción biológica real entre especies (desde el Picaflor de `9 cm` hasta el Ñacurutú de `50 cm` y la Gaviota de `58 cm`), $\text{depthFactor}$ modela la profundidad Z del apoyo (`0.91 - 1.07` en suelo de primer plano, `0.83 - 0.90` en ramas y postes de plano medio, y `0.54 - 0.55` en cumbrera/pretil lejano para el Tordo), y $\text{spriteComp}$ corrige la reducción de `object-fit: contain` en sprites altos y angostos (como el Ñacurutú de `292x484` o el Cardenal de `413x597` dentro del contenedor `.bird-perch` de `120x120`).
- **Aves Pequeñas (`9 - 14 cm`):** Picaflor (`scale: 0.46 - 0.47`), Dorado (`0.57 - 0.58`), Chingolo (`0.60 - 0.64`), y Tordo en pretil lejano (`0.44 - 0.45`).
- **Aves Medianas (`19 - 30 cm`):** Hornero (`0.71 - 0.75`), Cardenal (`0.75 - 0.76`), Benteveo (`0.79 - 0.80`), Calandria (`0.81 - 0.82`), Cotorra (`0.84 - 0.86`), Carpintero (`0.92 - 0.93`), Torcaza en suelo (`0.93 - 0.94`), Zorzal en primer plano (`0.98 - 0.99`).
- **Aves Grandes (`35 - 58 cm`):** Tero (`1.24 - 1.25`), Ñacurutú (`1.39 - 1.41`), Gaviota Cocinera (`1.41 - 1.44`).
- **Insignia en Pokédex:** Cada tarjeta en la Pokédex muestra la medida biológica real del ave (`📏 9 cm` a `📏 58 cm`).
- **Compensación de Zoom Dinámico:** La cámara calcula el aumento de forma proporcional inversa a la escala (`camera.targetScale = baseZoom / Math.pow(birdScale, 0.65)`), permitiendo que aves lejanas y pequeñas se acerquen con un zoom de hasta 3.4x para apreciarlas en detalle.
- **Etiquetas de Texto no deformables:** Los tooltips de nombre contrarrestan la escala del contenedor (`scale(calc(1 / var(--bird-scale)))`), asegurando legibilidad 100% nítida.

## 🎨 Taller de Pintura Infantil 3+ Años (`coloring_game.js`, `v26`)
- **Acceso directo en barra superior (`🎨 Pintar`) y Menú Hamburguesa (`Taller de Pintura 3+`).**
- **Generador Automático de Contornos de Libro de Colorear (`CW=600x600`):** Extrae en tiempo real líneas de contorno oscuras sobre interior blanco puro (`#FFFFFF`) a partir de los sprites `assets_mobile/[id]_reposo_trans.webp` mediante detección de bordes Sobel 3x3 (luminancia + crominancia) y Laplaciano local con cierre morfológico, enmarcado en un sticker de naturaleza suave y acompañado de la tarjeta interactiva **⭐ Modelo Real** en la esquina.
- **Mecánica "No salirse de la raya" (3+ años):** Todos los trazos de pincel quedan recortados automáticamente a la silueta opaca del ave (`alpha > 35`) y los trazos lineales del dibujo se recomponen encima con `multiply` en cada fotograma para que los ojos, pico y plumas nunca se borren.
- **Herramientas Táctiles Grandes:** `🖌️ Pincel`, `🖍️ Crayón Grueso`, `🪣 Pintar Zona (Balde Mágico BFS)`, `🌈 Pincel Arcoíris`, `🧽 Goma`, `↩️ Deshacer` (10 pasos) y `🗑️ Borrar Todo`.
- **Paleta de 14 Colores con Guía Estelar (`⭐`):** Resalta automáticamente con una estrella los colores reales del ave seleccionada.
- **Integración con el Paisaje (`🎉 ¡Terminé!`):** Permite escuchar el canto del ave mientras se pinta, descargar el dibujo en PNG (`💾 Guardar Dibujo`) o pulsar `✨ Usar mi Pájaro Pintado en el Paisaje` para posar el ave pintada por el niño directamente en Pinamar.

## 🎮 Sala de Minijuegos Infantiles 3+ Años (`kids_games.js` & `PROPUESTA_JUEGOS_INFANTILES.md`, `v26`)
- **Acceso directo en barra superior (`🎮 Juegos`) y Menú Hamburguesa (`Sala de Minijuegos 3+`).**
- **Juego 1 — 👂 ¿Quién Canta? (Discriminación Auditiva 3+):** Reproduce el canto real de una de las 15 aves uruguayas, ofrece un botón grande pulsante (`🔊 Escuchar de nuevo`) y 3 tarjetas grandes de aves. Si el niño se equivoca, la tarjeta tiembla suavemente sin penalización (`"¡Casi! Probá con otro pajarito"`); al acertar celebra con estrellas, reproduce la locución real (`playBirdVoice`) y otorga un trofeo al completar 5 rondas.
- **Juego 2 — 🃏 Memoria de Pajaritos (Memotest Visual y Sonoro 3+):** Dos niveles adaptados (`🐣 Pequeños 3+ años` con 6 cartas grandes / 3 parejas, y `🦅 Exploradores 5+ años` con 12 cartas / 6 parejas). Al formar cada pareja suena el canto real y la voz del ave.
- **Juego 3 — 🕵️ ¿Dónde Está? (Búsqueda Visual en el Paisaje 3+):** Activa el banner flotante `#kids-where-hud` sobre el escenario panorámico pidiendo encontrar un ave por su foto y nombre, con botón `💡 Pista` (que ilumina al ave con un anillo dorado pulsante y acerca la cámara si el niño necesita ayuda) y premiación con estrellas y canto al tocarla.

## 🕹️ Mecánicas de Interacción
- **1 Tap / Clic:** Inicia o detiene el canto del ave individualmente, con enfoque de cámara.
- **Doble Tap Rápido:** Despliega alas en perspectiva 3D (`[bird]_vuelo_trans.webp`), emite sonido de aleteo y vuela hacia el cielo desapareciendo de escena; la cámara panorámica se acomoda automáticamente.
- **Arrastre Libre de Aves (Drag & Drop, v20/v21):** Al mantener presionado un ave (hold de 300ms o desplazamiento >7px), el jugador puede transportarla y posarla libremente en cualquier rincón del escenario. El ave se eleva sutilmente con sombra profunda y feedback táctil, recalcula en tiempo real su escala por perspectiva Z respecto a su percha base inmutable (`DEFAULT_THEME_PERCHES`, evitando deriva de escala) y emite un suave sonido de aterrizaje al soltarla, limpiando la transición inline tras posarse.
- **Botón Llamar / Reiniciar:** Hace aterrizar a todas las aves de vuelta a sus perchas con animación suave de descenso (`is-landing`).
- **Modo Dar de Comer (🌾🍞):** Al tocar un ave, caen miguitas/semillas, come con satisfacción, suma puntos en el contador HUD y muestra mensaje de agradecimiento. Al activarse, hace regresar automáticamente a cualquier ave que hubiera volado para garantizar las 9 aves en escena.
- **Modo Pokédex:** Alterna entre ilustraciones hiperrealistas de fauna uruguaya y sus versiones estilo criaturas coleccionables.
- **Zoom Táctil Multitouch / Pellizco con 2 Dedos (Mobile Pinch-to-Zoom, v24):** Soporte completo para pellizcar la pantalla con dos dedos en celulares y tablets. Calcula dinámicamente la distancia euclidiana y el baricentro entre ambos toques para acercar o alejar el escenario manteniendo el punto medio exactamente bajo los dedos, cancelando automáticamente el arrastre accidental de aves y evitando conflictos con el zoom nativo del navegador.
- **Zoom con Ruedita del Ratón (Mouse Wheel Zoom, v23):** Control de aumento fluido e interactivo en PC/escritorio con la ruedita del mouse, centrado matemáticamente sobre el cursor para explorar cada detalle del plumaje sin perder la orientación espacial, con límites de escala seguros (1.0x a 3.8x) y clamp de bordes continuo.
- **Normalización Acústica y Equilibrio de Cantos (v23):** Se normalizaron todos los cantos reales con estándar EBU R128 (-14.5 LUFS, pico -1.0 dBTP), eliminando el silencio inicial muerto en especies como Zorzal Colorado, Tordo y Cotorra. El ducking de locución se ajustó a un nivel balanceado y armónico (65%), garantizando que tanto la voz humana como el canto del ave se escuchen perfectamente juntos, con temporizador de seguridad de recuperación de volumen.
- **Locución con Voz Humana (v21/v23):** Integración de audios de pronunciación grabados localmente en Voice Studio (`audio/voz_[id].mp3`) con control de disponibilidad (`voiceAvailable`) para evitar peticiones 404 y ducking balanceado al 65%.
- **Menú Hamburguesa:** Control de escenarios, tarjetas de sonido, reinicio y créditos sin saturar la pantalla en dispositivos móviles.

## 🚀 Despliegue y PWA
- **Hosting:** GitHub Pages en `https://games.servicioti.com.uy/` (repo `eltopouy/games-servicioti`).
- **PWA Service Worker:** Caché estricto con versionado automático (`v21-voices`).
- **Composición Multimodal:** Perchas calculadas por Gemini 3.8 Flash alimentado con la imagen de fondo y las 9 aves simultáneas en el prompt multimodal, garantizando orientación natural hacia el centro y apoyos físicos verificados.
- **Animación Exclusiva de Pico Sutil y Lossless (v19):** Se eliminó por completo el aleteo corporal (`cantoAlas`) y el rebote CSS (`singingBob`) durante el canto. El ave permanece serena, nítida y perfectamente posada en su rama o pretil, activando única y exclusivamente una micro-rotación angular suave (1.2° a 1.4°) de la mandíbula inferior con sombreado orgánico de oclusión en la comisura bucal.
- **Corrección Definitiva de la Gaviota Cocinera (v19):** Se restauró el pico íntegro de la gaviota (que había sido truncado en 34 píxeles durante el recorte inicial del spritesheet en x=438, mutilando el gancho terminal y la mancha roja gonidial característica). Ahora se posa en un lienzo extendido de 488x525 con coordenadas calibradas (`comisura: [380, 64]`, `punta: [471, 74]`, `mentón: [413, 86]`).
- **Fidelidad y Silueta 100% Bloqueada con WebP Lossless:** Al exportar con compresión sin pérdidas (`lossless=True`), el 100% de los píxeles fuera del pico (ojos, cabeza, cuello, pecho, patas, alas y cola) presentan **EXACTAMENTE 0 PÍXELES DE DIFERENCIA** respecto a la pose de reposo, erradicando por completo cualquier parpadeo, temblor o ruido de compresión.
- **Limpieza de Sprites Quirúrgica:** Componentes conexos con SciPy para eliminar motas flotantes y halos JPEG; anclaje anatómico de patas y base desde el fotograma de reposo para eliminar al 100% las basuritas y el parpadeo en las transiciones de canto.
- **Compatibilidad Móvil:** Safe-area para pantallas con notch, touch events delimitados, soporte offline.
