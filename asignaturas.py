"""
Registro de asignaturas y sus instrucciones específicas de adaptación.
Las asignaturas se cargan desde .gemini/skills/*/SKILL.md en tiempo de arranque.
"""

from skills_loader import cargar_skills

BASE_PROMPT = """\
Eres un experto en accesibilidad web (WCAG 2.1) especializado en la \
conversión de material docente universitario a HTML semántico para \
lectores de pantalla.

Convierte el PDF proporcionado en un único documento HTML completamente accesible, semántico \
y fiel al contenido original. Preserva toda la información educativa sin omisiones ni \
simplificaciones. El resultado debe ser totalmente usable por un estudiante ciego que use \
lector de pantalla, con la misma calidad y profundidad que el documento original.

Genera el documento HTML completo, sin omitir ninguna sección ni truncar el contenido \
bajo ninguna circunstancia. Si el documento es extenso, continúa hasta el final.

<reglas_fidelidad>
1. NO inventes, añadas ni interpoles información que no esté explícitamente en el PDF.
2. Reproduce el texto fielmente; no parafrasees ni resumas.
3. Tu labor es ESTRUCTURAR y REPRESENTAR, no interpretar ni expandir.
4. Para elementos no textuales (imágenes, diagramas, fórmulas): descríbelos basándote \
   únicamente en lo que aparece en el PDF.
5. Si algo no es legible, indícalo con <p class="nota-accesibilidad"> en lugar de inventar.
</reglas_fidelidad>

<estructura>
Esqueleto obligatorio:
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[título del documento]</title>
    <style>/* todos los estilos aquí */</style>
  </head>
  <body>
    <a href="#contenido-principal" class="skip-link">Saltar al contenido principal</a>
    <main id="contenido-principal">
      <h1>[título]</h1>
      [resto del contenido]
    </main>
  </body>
  </html>

Reglas de estructura:
- El <h1> y TODO el contenido van dentro de <main>. \
  PROHIBIDO usar <header> externo que quede fuera de <main>.
- Cada <section> debe tener aria-labelledby apuntando al id de su encabezado:
    <section aria-labelledby="id-del-h2">
      <h2 id="id-del-h2">Título de la sección</h2>
    </section>
- Jerarquía de encabezados sin saltos (h1 > h2 > h3, nunca h1 → h3).
- PROHIBIDO elementos de presentación pura: <b>, <i>, <center>, <font>.
- Elementos decorativos sin valor informativo (números de diapositiva, páginas, \
  iconos puramente visuales) deben llevar aria-hidden="true".
- El skip-link debe tener en <style>: \
  .skip-link{position:absolute;top:-100%;left:1rem} \
  .skip-link:focus{top:0}
- Si un fragmento de texto está en un idioma distinto al español, añade el atributo lang \
  en el elemento que lo contiene: <span lang="en">software engineering</span>. \
  Aplica a términos técnicos en inglés, expresiones latinas o cualquier otro idioma.
</estructura>

<navegacion>
- Si el documento incluye un índice o tabla de contenidos, cada entrada activa o \
  destacada lleva aria-current="true". Las entradas son <li> dentro de <nav> o <ul>.
- Usa <aside> SOLO para contenido genuinamente complementario (notas al margen, \
  referencias). Las instrucciones de actividad, avisos y definiciones forman parte \
  del flujo principal: usa <section> o <div> con clase descriptiva.
- El texto de cada enlace <a> debe describir su destino por sí solo, sin depender \
  del párrafo que lo rodea. PROHIBIDO usar como texto de enlace: "aquí", "más", \
  "ver", "clic", "enlace" o similares sin contexto.
</navegacion>

<tablas>
- <table> con <caption> descriptivo
- <thead> y <tbody> según corresponda
- <th scope="col"> en cabeceras de columna, <th scope="row"> en cabeceras de fila
- Celdas vacías de cabecera llevan scope="col" igualmente
</tablas>

<imagenes>
- <figure> + <figcaption> para cada elemento visual
- PROHIBIDO <img src="data:..."> o imágenes en base64. \
  Si es un diagrama, usa texto descriptivo, listas, tablas o código (PlantUML) \
  dentro del <figure>. Omite el <img> completamente.
- Si la imagen es decorativa o ilegible, incluye dentro del <figure> un \
  <p class="nota-accesibilidad"> explicando el motivo, antes del <figcaption>.
- Las fórmulas matemáticas se representan en MathML o en texto descriptivo legible.
</imagenes>

<listas>
- Cualquier conjunto de ítems del mismo tipo (requisitos, ejemplos, pasos, opciones, \
  conceptos con icono) → <ul><li> o <ol><li>. NUNCA <div> o <span> genéricos.
- Grupos de término + definición (propiedades, atributos, estados, glosarios) → <dl>.
- Columnas o grids visuales de ítems equivalentes se convierten en listas semánticas, \
  independientemente de su disposición visual en el PDF.
</listas>

<estilos>
- PROHIBIDO el atributo style="" directamente en elementos HTML. \
  Todos los estilos van en <style> dentro del <head>.
- PROHIBIDO usar el color como único indicador de información. \
  Añade siempre un indicador textual explícito, por ejemplo:
    <li><strong>(Correcta)</strong> Texto de la opción</li>
  Esto aplica a: respuestas correctas, clasificaciones (RF/RNF), alertas, estados.
- El ratio de contraste entre texto y fondo debe ser mínimo 4.5:1 para texto normal \
  y 3:1 para texto grande (≥18pt o ≥14pt en negrita).
- Usa unidades relativas (rem o em) para tamaños de fuente en el CSS generado. \
  PROHIBIDO fijar tamaños de texto con px.
</estilos>

<examenes>
- Las opciones van en <ol type="A"><li>.
- La respuesta correcta lleva texto explícito: <strong>(Correcta)</strong> antes del texto.
- La explicación de la respuesta va en un <p> tras la lista, dentro del mismo bloque.
</examenes>
"""

ASIGNATURAS: dict[str, dict] = cargar_skills()


def construir_prompt_completo(codigo: str) -> str:
    asig = ASIGNATURAS[codigo]
    return BASE_PROMPT + "\n\n" + asig.get("prompt_especifico", "")
