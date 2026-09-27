# JuegoOcaRiesgos · Oca en red

Primera versión de un juego para el aula sobre ciudadanía digital y riesgos en red. HTML, CSS y JavaScript sin dependencias, servicios externos ni instalación. Funciona sin conexión una vez descargados sus archivos.

## Probar

Abrí `index.html` en un navegador moderno. Escribí entre 2 y 6 nombres de equipos (uno por línea), elegí las consecuencias y empezá. Todos juegan en la misma pantalla. No se guardan datos ni partidas: recargar reinicia el juego.

## GitHub Pages

1. Creá o abrí el repositorio `JuegoOcaRiesgos` en GitHub.
2. Subí **el contenido de esta carpeta**, con `index.html` en la raíz del repositorio.
3. En **Settings → Pages**, elegí **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`. Guardá.
4. Cuando finalice la publicación, abrí la dirección que muestra GitHub Pages.

Los recursos usan rutas relativas, por lo que funcionan dentro del subdirectorio del repositorio. Esta entrega está preparada para publicar; todavía no está subida a GitHub.

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

Editá `preguntas.js`. Cada objeto del arreglo `PREGUNTAS` tiene este formato:

```js
{
  categoria: 0,
  situacion: 'Situación concreta y pregunta para decidir qué hacer.',
  opciones: ['Respuesta A', 'Respuesta B', 'Respuesta C'],
  correcta: 1,
  explicacion: 'Por qué B es la mejor respuesta.',
  consecuencia: 'back1',
  dificultad: 'Intermedia'
}
```

`correcta`: 0 = A, 1 = B, 2 = C. Separá los objetos con comas. Mantené **al menos dos preguntas por categoría** para permitir una segunda oportunidad distinta.

| Categoría | Número |
|---|---|
| Ciudadanía digital | 0 |
| Información sensible | 1 |
| Phishing | 2 |
| Ciberbullying | 3 |
| Grooming | 4 |
| Fake news / IA | 5 |
| Ludopatía adolescente | 6 |

| Consecuencia | Valor |
|---|---|
| Retroceder 1 | `back1` |
| Retroceder 2 | `back2` |
| Perder un turno | `skip` |
| Volver a la posición anterior | `return` |
| Rebote | `rebound` |
| Segunda oportunidad | `retry` |

## Criterio pedagógico

Los 14 ejemplos iniciales proponen decisiones sobre situaciones, en lugar de pedir definiciones. Son contenido provisional para revisión docente y reemplazo por las fichas del alumnado. No se cotejaron con el PDF adjunto al chat original.

Las consecuencias solo pertenecen al juego. Nunca implican culpabilizar a quienes atraviesan riesgos. No se pide relatar experiencias personales. Conviene leer la devolución en voz alta y conversar antes de seguir.

## Archivos

- `index.html`: pantalla de configuración, tablero y diálogo de preguntas.
- `styles.css`: diseño adaptable sin fuentes ni recursos externos.
- `preguntas.js`: categorías y banco de preguntas.
- `app.js`: turnos, dado, consecuencias y resultado.

La configuración docente se realiza al iniciar. Esta versión no incluye editor visual de preguntas, guardado de partidas ni juego remoto entre dispositivos.
