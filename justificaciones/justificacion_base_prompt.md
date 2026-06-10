# Justificación del BASE_PROMPT del conversor de accesibilidad

## Descripción del sistema

La aplicación convierte documentos PDF de material docente universitario en HTML semántico accesible, procesado por Google Gemini. El `BASE_PROMPT` es el conjunto de instrucciones que se envía al modelo en cada conversión. Este documento justifica cada decisión de diseño del prompt desde dos perspectivas:

1. **Estrategias de prompting de Google** — cómo está redactado el prompt para maximizar la calidad de la respuesta de Gemini.
2. **Estándar WCAG 2.1** — qué criterio de éxito concreto motiva cada instrucción de accesibilidad.

---

## Parte 1 — Justificación según estrategias de prompting de Google

Fuente oficial: [Gemini API Prompting Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies?hl=es-419)

### Estructura general del prompt

El `BASE_PROMPT` sigue el orden recomendado por Google para tareas de transformación de contenido:

1. Asignación de rol/persona
2. Instrucción de tarea (objetivo único y concreto)
3. Instrucción de completitud
4. Restricciones negativas (`<reglas_fidelidad>`)
5. Instrucciones de formato por dominio, delimitadas con etiquetas XML

### 1. Rol / persona

```
Eres un experto en accesibilidad web (WCAG 2.1) especializado en la
conversión de material docente universitario a HTML semántico para
lectores de pantalla.
```

**Estrategia Google:** *Asignación de rol* — "Los modelos pueden adoptar personas o roles para dar respuestas más específicas y contextualizadas."

**Justificación:** El rol define tres dimensiones simultáneamente: el dominio de conocimiento (WCAG 2.1), el contexto de uso (material docente universitario) y el destinatario final (lectores de pantalla). Esto orienta el razonamiento del modelo antes de procesar cualquier instrucción concreta.

---

### 2. Instrucción de tarea

```
Convierte el PDF proporcionado en un único documento HTML completamente
accesible, semántico y fiel al contenido original. […] El resultado
debe ser totalmente usable por un estudiante ciego que use lector de
pantalla, con la misma calidad y profundidad que el documento original.
```

**Estrategia Google:** *"Indica tu objetivo de forma clara y concisa. Evita lenguaje innecesario."*

**Justificación:** Una sola frase define qué hacer (convertir), la entrada (PDF), la salida (HTML accesible, semántico, fiel) y el destinatario (estudiante ciego con lector de pantalla). No hay ambigüedad sobre el objetivo ni sobre el criterio de calidad.

---

### 3. Instrucción de completitud

```
Genera el documento HTML completo, sin omitir ninguna sección ni
truncar el contenido bajo ninguna circunstancia. Si el documento es
extenso, continúa hasta el final.
```

**Estrategia Google:** *Instrucciones claras + limitaciones de alcance explícitas.*

**Justificación:** Los LLM tienen tendencia a truncar documentos largos o a resumir secciones densas sin instrucción explícita. Esta instrucción anticipa ese comportamiento y lo cancela. La cláusula "Si el documento es extenso, continúa hasta el final" cubre el caso de PDFs de muchas páginas donde el modelo podría asumir que debe acortar.

---

### 4. `<reglas_fidelidad>` — restricciones negativas numeradas

```xml
<reglas_fidelidad>
1. NO inventes, añadas ni interpoles información que no esté en el PDF.
2. Reproduce el texto fielmente; no parafrasees ni resumas.
3. Tu labor es ESTRUCTURAR y REPRESENTAR, no interpretar ni expandir.
…
</reglas_fidelidad>
```

**Estrategia Google:** *"Especificar lo que el modelo debe y no debe hacer."* + *"Colocar restricciones esenciales al principio."*

**Justificación:** Las restricciones se sitúan antes de las instrucciones de formato porque el riesgo principal en esta tarea es la alucinación de contenido educativo (inventar definiciones, añadir explicaciones, resumir fórmulas), no el formato incorrecto. Google documenta que las restricciones colocadas al principio tienen mayor peso en el razonamiento del modelo. Los imperativos negativos explícitos ("NO inventes", "no parafrasees") son más eficaces que las instrucciones positivas equivalentes ("sé fiel") para este tipo de restricción.

---

### 5. Esqueleto HTML como few-shot implícito

```xml
<estructura>
Esqueleto obligatorio:
  <!DOCTYPE html>
  <html lang="es">
  <head>…</head>
  <body>
    <a href="#contenido-principal" class="skip-link">…</a>
    <main id="contenido-principal">
      <h1>[título]</h1>
      …
    </main>
  </body>
  </html>
```

**Estrategia Google:** *Few-shot learning* + *formato de salida especificado.*

**Justificación:** El bloque de código completo actúa como ejemplo de salida esperada (few-shot implícito). Google documenta que los prompts con ejemplos concretos son sistemáticamente más eficaces que los zero-shot para tareas de generación de código estructurado. El esqueleto especifica simultáneamente el formato exacto de la respuesta, eliminando ambigüedad sobre la estructura del documento de salida.

---

### 6. Delimitadores XML por dominio

```xml
<navegacion> … </navegacion>
<tablas> … </tablas>
<imagenes> … </imagenes>
<listas> … </listas>
<estilos> … </estilos>
<examenes> … </examenes>
```

**Estrategia Google:** *"Usar delimitadores claros (etiquetas XML, Markdown) para separar partes de la instrucción."* + *"Dividir instrucciones complejas en componentes más simples."*

**Justificación:** Cada sección delimita un dominio de conocimiento independiente con sus propias reglas. Google recomienda específicamente etiquetas XML porque el modelo las tokeniza como estructura semántica, no como texto decorativo, reduciendo el riesgo de mezclar instrucciones entre categorías. Se eligieron sobre los delimitadores ASCII usados en versiones anteriores del prompt precisamente por este motivo.

---

### 7. `PROHIBIDO` en mayúsculas

```
PROHIBIDO <img src="data:…"> o imágenes en base64.
PROHIBIDO el atributo style="" directamente en elementos HTML.
PROHIBIDO usar el color como único indicador de información.
```

**Estrategia Google:** *Priorización de instrucciones críticas.*

**Justificación:** El énfasis tipográfico (mayúsculas al inicio del ítem) y la posición inicial dentro del bloque aumentan el peso de la instrucción en el razonamiento del modelo. Estas tres prohibiciones son las que más frecuentemente se violan por defecto (imágenes base64, estilos inline, color sin texto alternativo), por lo que merecen el énfasis más alto.

---

### 8. Definición explícita de términos técnicos

```
Usa <aside> SOLO para contenido genuinamente complementario
(notas al margen, referencias). Las instrucciones de actividad,
avisos y definiciones forman parte del flujo principal.
```

**Estrategia Google:** *"Explica de forma explícita cualquier término o parámetro ambiguo."*

**Justificación:** El prompt define cuándo usar `<aside>` (solo para contenido "genuinamente complementario"), la diferencia semántica entre `<ul>`, `<ol>` y `<dl>`, y qué cuenta como "elemento decorativo" (números de diapositiva, iconos visuales). Esto evita que el modelo interprete libremente conceptos que tienen definiciones técnicas precisas en WCAG 2.1.

---

## Parte 2 — Justificación según WCAG 2.1

Fuente oficial: [WCAG 2.1 — W3C Recommendation](https://www.w3.org/TR/WCAG21/)

### Criterios cubiertos

#### `<reglas_fidelidad>`

| Instrucción del prompt | Criterio WCAG 2.1 | Nivel |
|---|---|---|
| No inventar ni interpolar información | **1.1.1** Non-text Content | A |
| Reproducir el texto fielmente, sin parafrasear | **1.3.2** Meaningful Sequence | A |
| ESTRUCTURAR y REPRESENTAR, no interpretar | **1.3.1** Info and Relationships | A |
| Describir elementos no textuales solo desde el PDF | **1.1.1** Non-text Content | A |
| `<p class="nota-accesibilidad">` para contenido ilegible | **1.1.1** Non-text Content | A |

#### `<estructura>`

| Instrucción del prompt | Criterio WCAG 2.1 | Nivel |
|---|---|---|
| `<!DOCTYPE html>` y marcado válido | **4.1.1** Parsing | A |
| `<html lang="es">` | **3.1.1** Language of Page | A |
| `<title>` descriptivo | **2.4.2** Page Titled | A |
| Todos los estilos en `<style>` del `<head>` | **4.1.1** Parsing | A |
| Skip-link `<a href="#contenido-principal">` | **2.4.1** Bypass Blocks | A |
| `<main id="contenido-principal">` | **1.3.1** Info and Relationships | A |
| `<h1>` para el título principal | **2.4.6** Headings and Labels | AA |
| `aria-labelledby` en cada `<section>` | **4.1.2** Name, Role, Value | A |
| Jerarquía h1→h2→h3 sin saltos | **1.3.1** + **2.4.6** | A / AA |
| PROHIBIDO `<b>`, `<i>`, `<center>`, `<font>` | **1.3.1** Info and Relationships | A |
| `aria-hidden="true"` en elementos decorativos | **1.1.1** Non-text Content | A |
| CSS del skip-link (`:focus{top:0}`) | **2.4.7** Focus Visible | AA |
| `lang="xx"` en fragmentos de otro idioma | **3.1.2** Language of Parts | AA |

> **1.3.1** — La estructura, las relaciones y la información deben poder determinarse programáticamente. Los elementos de presentación pura (`<b>`, `<i>`) no transmiten semántica y los lectores de pantalla no los anuncian de forma significativa.
>
> **3.1.2** — Cada pasaje en una lengua distinta al español (términos técnicos en inglés, expresiones latinas) debe marcarse con `lang` para que el sintetizador de voz aplique la pronunciación correcta.

#### `<navegacion>`

| Instrucción del prompt | Criterio WCAG 2.1 | Nivel |
|---|---|---|
| `aria-current="true"` en entradas activas del índice | **4.1.2** Name, Role, Value | A |
| `<aside>` solo para contenido genuinamente complementario | **1.3.1** Info and Relationships | A |
| Texto de enlace descriptivo; PROHIBIDO "aquí"/"ver"/"más" | **2.4.4** Link Purpose (In Context) | A |

> **2.4.4** — El propósito de un enlace debe ser determinable desde su texto o contexto inmediato. Un enlace que diga "aquí" no puede entenderse sin leer el párrafo completo, lo que rompe la navegación por tabulador en lectores de pantalla.

#### `<tablas>`

| Instrucción del prompt | Criterio WCAG 2.1 | Nivel |
|---|---|---|
| `<caption>` descriptivo | **1.3.1** Info and Relationships | A |
| `<thead>` y `<tbody>` | **1.3.1** Info and Relationships | A |
| `<th scope="col">` / `<th scope="row">` | **1.3.1** Info and Relationships | A |

#### `<imagenes>`

| Instrucción del prompt | Criterio WCAG 2.1 | Nivel |
|---|---|---|
| `<figure>` + `<figcaption>` | **1.1.1** Non-text Content | A |
| PROHIBIDO `<img src="data:…">` o base64 | **1.4.5** Images of Text | AA |
| Diagramas como texto, listas o tablas | **1.1.1** Non-text Content | A |
| `<p class="nota-accesibilidad">` para ilegibles | **1.1.1** Non-text Content | A |
| MathML o texto descriptivo para fórmulas | **1.1.1** + **4.1.1** | A |

> **1.4.5** — Las imágenes de texto deben evitarse en favor de texto real. Un `<img>` base64 con texto escaneado es inaccesible para lectores de pantalla aunque tenga `alt`.

#### `<listas>`

| Instrucción del prompt | Criterio WCAG 2.1 | Nivel |
|---|---|---|
| `<ul>`/`<ol>` para conjuntos de ítems equivalentes | **1.3.1** Info and Relationships | A |
| `<dl>` para pares término+definición | **1.3.1** Info and Relationships | A |
| Grids visuales → listas semánticas | **1.3.2** + **1.3.1** | A |

> **1.3.2** — El orden y la agrupación de la información deben preservarse independientemente de la disposición visual. Un grid de cuatro columnas en el PDF puede ser una lista de cuatro ítems en el HTML.

#### `<estilos>`

| Instrucción del prompt | Criterio WCAG 2.1 | Nivel |
|---|---|---|
| PROHIBIDO `style=""` inline | **4.1.1** + **1.4.3** | A / AA |
| PROHIBIDO color como único indicador + texto explícito | **1.4.1** Use of Color | A |
| Ratio de contraste ≥ 4.5:1 (normal) / 3:1 (grande) | **1.4.3** Contrast (Minimum) | AA |
| Unidades relativas rem/em; PROHIBIDO px para fuentes | **1.4.4** Resize Text | AA |

> **1.4.3** — El contraste mínimo entre texto y fondo garantiza legibilidad para usuarios con baja visión o daltonismo. El umbral es 4,5:1 para texto normal y 3:1 para texto grande (≥18pt o ≥14pt en negrita).
>
> **1.4.4** — El texto debe poder ampliarse al 200% sin pérdida de contenido. Los tamaños en `px` no escalan con la preferencia de tamaño de fuente del sistema operativo; `rem`/`em` sí.

#### `<examenes>`

| Instrucción del prompt | Criterio WCAG 2.1 | Nivel |
|---|---|---|
| `<ol type="A"><li>` para opciones | **1.3.1** Info and Relationships | A |
| `<strong>(Correcta)</strong>` explícito | **1.4.1** Use of Color | A |
| Explicación en `<p>` dentro del mismo bloque | **1.3.1** + **1.3.2** | A |

---

### Criterios excluidos y justificación

Los siguientes criterios de WCAG 2.1 no están contemplados en el prompt porque la arquitectura del sistema hace que no apliquen.

#### 1.2.x — Medios basados en tiempo (A/AA/AAA) — No aplicable

Captions, audio description, sign language, etc. El conversor produce documentos HTML estáticos a partir de PDFs docentes. Los PDFs de origen no contienen vídeo ni audio, y el HTML generado tampoco los incluye. Estos criterios se vuelven aplicables solo si el destino final embebiera multimedia, lo cual está fuera del alcance de esta herramienta.

#### 1.4.2 — Audio Control (A) — No aplicable

Requiere mecanismo para pausar audio que se reproduce automáticamente. El HTML generado es un documento de lectura sin ningún elemento de audio.

#### 1.4.10 — Reflow (AA) — Responsabilidad del revisor humano

Exige presentación sin scroll horizontal a 320 px. El cumplimiento depende de decisiones de layout inevitables en documentos académicos con tablas de datos anchas. No puede garantizarse de forma automática; queda como responsabilidad del revisor humano.

#### 1.4.11 — Non-text Contrast (AA) — No aplicable

Contraste mínimo 3:1 para componentes de interfaz y gráficos informativos. El HTML generado es un documento de lectura sin componentes UI interactivos. Las imágenes del PDF se reemplazan por texto o figuras descriptivas.

#### 1.4.12 — Text Spacing (AA) — Cubierto implícitamente por 1.4.4

El contenido no debe perder funcionalidad al aumentar el espaciado de texto. El cumplimiento es consecuencia directa de la regla `rem`/`em` (criterio 1.4.4 ya cubierto); no se añade como regla independiente para no duplicar.

#### 1.4.13 — Content on Hover or Focus (AA) — No aplicable

Requiere que tooltips y contenido emergente en hover/focus sean descartables y persistentes. El HTML generado no incluye elementos con comportamiento hover/focus adicional.

#### 2.1.x — Keyboard Accessible (A/AA) — Parcialmente cubierto

La accesibilidad por teclado aplica a componentes interactivos. El documento generado solo contiene el skip-link y posibles hipervínculos (cubiertos por 2.4.4). No hay formularios, widgets ni controles que requieran gestión de foco compleja.

#### 2.2.x — Enough Time (A/AAA) — No aplicable

Límites de tiempo ajustables, pausa de contenido móvil, etc. El HTML generado es estático; no tiene temporizadores, sesiones con expiración ni contenido en movimiento.

#### 2.3.x — Seizures and Physical Reactions (A/AAA) — No aplicable

Nada puede parpadear más de 3 veces por segundo. El HTML generado es un documento de lectura sin animaciones, vídeos ni contenido intermitente.

#### 2.4.5 — Multiple Ways (AA) — No aplicable

Múltiples formas de localizar una página (buscador, mapa del sitio, etc.). Este criterio aplica a sitios web con múltiples páginas. El conversor produce un único documento HTML autónomo.

#### 2.4.8 — Location (AAA) — No aplicable

Información sobre la ubicación del usuario dentro del sitio. Mismo motivo que 2.4.5: documento único, no sitio web.

#### 2.5.x — Input Modalities (A/AAA) — No aplicable

Gestos multipunto, cancelación de puntero, tamaño de objetivo de toque, etc. El documento generado no contiene componentes interactivos más allá de enlaces de texto.

#### 3.2.x — Predictable (AA) — No aplicable

Navegación y componentes consistentes entre páginas. Criterio de sitio web multi-página. El documento generado es autónomo.

#### 3.3.x — Input Assistance (A/AA) — No aplicable

Identificación de errores, sugerencias, prevención de errores en formularios. El HTML generado no contiene formularios ni campos de entrada.

#### 4.1.3 — Status Messages (AA) — No aplicable

Los mensajes de estado deben comunicarse a las AT mediante roles ARIA (`role="status"`, `aria-live`). El documento generado es estático; no produce mensajes de estado dinámicos.

#### Criterios de Nivel AAA — Fuera del alcance del conversor automático

Los criterios AAA (contraste mejorado 7:1, descripción de abreviaturas, propósito del enlace sin contexto, etc.) representan el nivel máximo de accesibilidad y su implementación sistemática en un conversor automático no es viable sin revisión humana experta para cada documento. El objetivo del sistema es garantizar **Nivel A completo** y **Nivel AA en todos los criterios aplicables** a documentos HTML estáticos.

---

## Resumen de cobertura

| Nivel | Estado |
|---|---|
| **Nivel A** | Cobertura completa en todos los criterios aplicables a documentos HTML estáticos |
| **Nivel AA** | Cobertura completa: 1.4.3, 1.4.4, 1.4.5, 2.4.6, 2.4.7, 3.1.2, + skip-link CSS |
| **Nivel AAA** | Fuera del alcance del conversor automático |
