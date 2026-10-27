# SPEC - Pajaritos de Pinamar (games.servicioti.com.uy)

## 📌 Descripción General
Videojuego web interactivo y educativo ambientado en los balnearios de Uruguay (Pinamar, Canelones), enfocado en la fauna autóctona de aves, sus cantos reales, comportamiento ornitológico, animaciones y minijuegos infantiles.

## 🦤 Aves Presentes (9 Especies Autóctonas)
1. **Hornero** (*Furnarius rufus*) - Ave nacional, posado sin nido, canta con aleteo alegre.
2. **Tero** (*Vanellus chilensis*) - Centinela del campo, espolones carmesí, primer plano en suelo.
3. **Benteveo** (*Pitangus sulphuratus*) - Antifaz negro, pecho amarillo vivo, posado en ramas.
4. **Cotorra** (*Myiopsitta monachus*) - Verde esmeralda, gregario en eucaliptos y pinos, safe-area móvil.
5. **Cardenal de Copete Rojo** (*Paroaria coronata*) - Cabeza roja brillante, en arbustos florales.
6. **Zorzal Colorado** (*Turdus rufiventris*) - Vientre rojizo, primer plano en césped buscando lombrices.
7. **Chingolo** (*Zonotrichia capensis*) - Copete estriado y collar canela, en postes de alambrado.
8. **Gaviota Cocinera** (*Larus dominicanus*) - De pie en suelo despejado o losa, primer plano.
9. **Tordo Renegrido** (*Molothrus bonariensis*) - Plumaje azabache tornasolado, posado en el pretil de la azotea escolar al fondo a escala pequeña por perspectiva.

## 🎨 Escenarios y Fondos 16:9
1. **Balneario Pinamar Escuela 295** (`costa`, por defecto).
2. **Calle de Tosca - Mediodía** (`mediodia`).
3. **Calle de Tosca - Atardecer** (`atardecer`).
4. **Calle de Tosca - Amanecer** (`amanecer`).

## 📐 Sistema de Perspectiva y Profundidad Z (Calibrado con Gemini 3.8 Flash)
- **Primer Plano (Foreground, `scale: 1.15 - 1.25`):** Tero, Zorzal, Gaviota.
- **Plano Medio (Midground, `scale: 0.75 - 0.82`):** Cotorra, Hornero, Benteveo, Cardenal, Chingolo.
- **Fondo Lejano (Background, `scale: 0.45 - 0.46`):** Tordo en pretil de azotea o cumbrera lejana.
- **Compensación de Zoom Dinámico:** La cámara calcula el aumento de forma proporcional inversa a la escala (`camera.targetScale = baseZoom / Math.pow(birdScale, 0.65)`), permitiendo que aves lejanas y pequeñas (como el Tordo) se acerquen con un zoom de hasta 3.4x para apreciarlas en detalle.
- **Etiquetas de Texto no deformables:** Los tooltips de nombre contrarrestan la escala del contenedor (`scale(calc(1 / var(--bird-scale)))`), asegurando legibilidad 100% nítida.

## 🕹️ Mecánicas de Interacción
- **1 Tap / Clic:** Inicia o detiene el canto del ave individualmente, con enfoque de cámara.
- **Doble Tap Rápido:** Despliega alas en perspectiva 3D (`[bird]_vuelo_trans.webp`), emite sonido de aleteo y vuela hacia el cielo desapareciendo de escena; la cámara panorámica se acomoda automáticamente.
- **Botón Llamar / Reiniciar:** Hace aterrizar a todas las aves de vuelta a sus perchas con animación suave de descenso (`is-landing`).
- **Modo Dar de Comer (🌾🍞):** Al tocar un ave, caen miguitas/semillas, come con satisfacción, suma puntos en el contador HUD y muestra mensaje de agradecimiento.
- **Modo Pokédex:** Alterna entre ilustraciones hiperrealistas de fauna uruguaya y sus versiones estilo criaturas coleccionables.
- **Menú Hamburguesa:** Control de escenarios, tarjetas de sonido, reinicio y créditos sin saturar la pantalla en dispositivos móviles.

## 🚀 Despliegue y PWA
- **Hosting:** GitHub Pages en `https://games.servicioti.com.uy/` (repo `eltopouy/games-servicioti`).
- **PWA Service Worker:** Caché estricto con versionado automático (`v15`).
- **Compatibilidad Móvil:** Safe-area para pantallas con notch, touch events delimitados, soporte offline.
