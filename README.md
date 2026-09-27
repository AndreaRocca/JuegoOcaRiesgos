# JuegoOcaRiesgos · Oca en red

Primera versión de un juego para el aula sobre ciudadanía digital y riesgos en red. HTML, CSS y JavaScript sin dependencias, servicios externos ni instalación. Funciona sin conexión una vez descargados sus archivos.

## Probar

Abrí `index.html` en un navegador moderno. Escribí entre 2 y 6 nombres de equipos (uno por línea), elegí las consecuencias y empezá. Todos juegan en la misma pantalla. No se guardan datos ni partidas: recargar reinicia el juego.

## GitHub Pages

1. Creá o abrí el repositorio `JuegoOcaRiesgos` en GitHub.
2. Subí **el contenido de esta carpeta**, con `index.html` en la raíz del repositorio.
3. En **Settings → Pages**, elegí **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`. Guardá.
4. Cuando finalice la publicación, abrí la dirección que muestra GitHub Pages.

Los recursos usan rutas relativas, por lo que funcionan dentro del subdirectorio del repositorio. Juego publicado: https://andrearocca.github.io/JuegoOcaRiesgos/

## Reglas de esta versión

- Salida 0, 28 casillas temáticas y meta 29; recorrido serpenteante de izquierda a derecha y luego en sentido inverso.
- Cada lanzamiento avanza de 1 a 6 casillas y abre una pregunta de la categoría de destino.
- Las respuestas tienen tres opciones y una explicación. Las preguntas rotan al azar dentro de cada categoría, sin repetir hasta agotar sus ejemplos.
- La consecuencia se puede fijar para toda la partida o tomar de cada pregunta.
- Retroceder 1 o 2: desde la casilla de destino, sin bajar de 0.
- Perder un turno: el próximo turno del equipo se salta automáticamente.
- Volver: regresa a la posición anterior al dado.
- Rebote: responde el siguiente equipo, antes de revelar la solución. Si acierta, avanza 1 casilla hasta un máximo de 28. Conserva su turno normal. El equipo original conserva su posición, salvo que estuviera en la meta.
- Segunda oportunidad: otra pregunta de la misma categoría; si falla, vuelve a la posición anterior al dado. No se encadenan consecuencias.
- No hace falta llegar con número exacto. Para ganar hay que llegar a 29 y acertar. Si falla allí, vuelve a la posición anterior al lanzamiento **antes** de aplicar la consecuencia. Acertar la segunda oportunidad después de ese fallo no gana la partida: conserva esa posición anterior.

## Cargar preguntas de estudiantes

1. Revisá las fichas en papel con la docente antes de digitalizarlas.
2. Descargá plantilla-preguntas.csv desde el juego. Incluye 14 ejemplos válidos, dos por tema. Reemplazalos por tus preguntas aprobadas.
3. Exportá como CSV UTF-8 (coma o punto y coma). En Google Forms/Sheets, conservá solo las columnas de la plantilla y las filas aprobadas.
4. Antes de empezar la partida, pulsá «Cargar mis preguntas (CSV)» y seleccioná el archivo.
5. Si el banco es válido se reemplaza completo. Si no, se indican líneas y correcciones y se conserva el banco anterior.

Columnas obligatorias (el orden puede variar): id, tema, situacion, pregunta, opcionA, opcionB, opcionC, correcta, explicacion, consecuencia, dificultad.

Temas: ciudadania_digital, informacion_sensible, phishing, ciberbullying, grooming, fake_news_ia, ludopatia.

Correcta: A/B/C. Dificultad: facil/media/dificil (acepta tildes e intermedia). Consecuencias: 1 retrocede una; 2 retrocede dos; 3 pierde turno; 4 vuelve al origen del tiro; 5 rebote al siguiente equipo; 6 segunda oportunidad.

Se verifican columnas, campos completos, IDs únicos, opciones diferentes, valores permitidos y dos preguntas por cada tema. Límite: 2 MB, 1000 preguntas y 4000 caracteres por campo. Las 24 fichas son una consigna del curso, no un límite del juego. Los errores señalan la línea física donde empieza la fila del CSV. Se admiten campos con comas, comillas escapadas y saltos de línea.

La carga es local: no envía el CSV a ningún servidor ni modifica el repositorio. «Nueva partida» conserva el banco; recargar la página vuelve a los ejemplos. «Usar ejemplos» permite restaurarlos antes de jugar. El PDF es para papel; no se convierte automáticamente.

### Arquitectura

cargarPreguntas.js ofrece BancoCSV.cargarPreguntas(fuente), que recibe un File local o una URL y devuelve {preguntas, cuenta, errores}. No modifica el estado del juego. app.js solo reemplaza su banco activo al obtener un resultado válido. Los ejemplos siguen separados en preguntas.js; la plantilla CSV es su versión editable. Una futura fuente externa puede usar este adaptador (sujeta a CORS) sin cambiar las reglas.

## Criterio pedagógico

Los 14 ejemplos iniciales proponen decisiones sobre situaciones, en lugar de pedir definiciones. Son contenido provisional para revisión docente y reemplazo por las fichas del alumnado. No se cotejaron con el PDF adjunto al chat original.

Las consecuencias solo pertenecen al juego. Nunca implican culpabilizar a quienes atraviesan riesgos. No se pide relatar experiencias personales. Conviene leer la devolución en voz alta y conversar antes de seguir.

## Archivos

- `index.html`: pantalla de configuración, tablero y diálogo de preguntas.
- `styles.css`: diseño adaptable sin fuentes ni recursos externos.
- `preguntas.js`: categorías y banco de preguntas.
- `app.js`: turnos, dado, consecuencias y resultado.

La configuración docente se realiza al iniciar. Esta versión no incluye editor visual de preguntas, guardado de partidas ni juego remoto entre dispositivos.

## Autoría y licencia

Autoría: **Andrea Rocca**. Oca en red se comparte bajo **Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**. Podés compartir y adaptar el material dando crédito, enlazando la licencia e indicando cambios, sin fines comerciales y distribuyendo las adaptaciones con la misma licencia.

[Resumen de la licencia](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es) · [Texto legal](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.es) · [Aviso de licencia](LICENSE.md)

Atribución sugerida: «Oca en red, de Andrea Rocca — CC BY-NC-SA 4.0 — https://andrearocca.github.io/JuegoOcaRiesgos/». Si realizás cambios, indicá cuáles.

## Fichas con emojis

Al escribir los nombres aparecen los selectores de fichas. Cada equipo elige uno de los 12 emojis; no se permiten fichas repetidas en una misma partida. El emoji acompaña al equipo tanto en el tablero como en la lista de posiciones. Los lectores de pantalla reciben el nombre del equipo y de la ficha. Los emojis se muestran con las fuentes del dispositivo y pueden variar de aspecto.
