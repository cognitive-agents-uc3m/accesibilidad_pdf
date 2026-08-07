---
name: interfaces-usuario
description: Convierte PDFs de Interfaces de Usuario (IU) a HTML accesible WCAG 2.2. Úsala para material de IU con capturas de pantalla, mockups, wireframes, heurísticas de Nielsen, evaluaciones heurísticas, pautas WCAG o cronogramas.
codigo: IU
nombre: Interfaces de Usuario
curso: 3
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: INTERFACES DE USUARIO

### Capturas de pantalla y mockups — CRÍTICO
Cada imagen de interfaz DEBE tener una descripción en `<figcaption>` que incluya OBLIGATORIAMENTE:
1. **Tipo de pantalla**: diálogo, formulario, vista principal, menú contextual, etc.
2. **Elementos presentes con posición**: "Cabecera en la zona superior con logo a la izquierda y menú hamburguesa a la derecha. Área central con formulario de tres campos. Pie de página con botones Cancelar (izquierda) y Aceptar (derecha, color azul)."
3. **Texto visible en cada elemento interactivo**: etiquetas, placeholders, valores, mensajes de error
4. **Estado de los controles**: botón activo/desactivado, campo con foco, checkbox marcado, campo con error
5. **Flujo de navegación**: "Al pulsar Aceptar se navega a la pantalla de confirmación; al pulsar Cancelar se vuelve al listado"

Formato:
```html
<figure>
  <img src="..." alt="[descripción breve de una línea]">
  <figcaption>
    <strong>Pantalla: [nombre]</strong>. Layout: [descripción del layout].
    Elementos: [lista de elementos con posición y estado].
    Texto visible: [texto de etiquetas y contenido].
    Navegación: [acciones disponibles y su efecto].
  </figcaption>
</figure>
```

### Wireframes y prototipos de papel
- Los wireframes descritos como estructuras de grid: "Pantalla dividida en tres regiones: barra lateral izquierda (20% del ancho), área principal central (60%), panel de propiedades derecho (20%)"

### Heurísticas de Nielsen y WCAG
- Los heurísticos y pautas en `<dl>`: `<dt>` nombre/número, `<dd>` descripción + ejemplos de cumplimiento/violación
- Las evaluaciones heurísticas como tablas: heurístico | problema encontrado | severidad (1-4) | recomendación

### Cronograma
- Como tabla HTML accesible (ver instrucciones generales de cronograma)

### Conceptos visuales — alternativas no visuales
Algunas leyes y principios de IU asumen que el estudiante puede ver distancias, tamaños y distribuciones en pantalla. Para cada uno de estos conceptos, añade un bloque `<aside class="alternativa-no-visual">` inmediatamente después del elemento que describe el concepto. El bloque ofrece una vía de comprensión independiente de la visión, sin repetir la definición original. La explicación debe incluir, según aplique: la fórmula matemática del principio, una analogía con experiencias no visuales (teclado Braille, melodía musical, esfuerzo físico, secuencia de pasos), y la aplicación práctica en diseño que justifica el principio.

**Formato obligatorio:**

```html
<aside class="alternativa-no-visual" aria-label="Alternativa no visual">
  <p><strong>Alternativa no visual:</strong> [explicación en términos auditivos, táctiles, matemáticos o procedimentales. No uses expresiones como "ver", "mirar" o "notar visualmente".]</p>
</aside>
```

**Añade en el `<style>` del documento (dentro de las reglas existentes):**

```css
aside.alternativa-no-visual { background: #eef4ff; border-left: 4px solid #2563eb; border-radius: 0 0.375rem 0.375rem 0; padding: 0.75rem 1rem; margin: 0.5rem 0 1.25rem; }
aside.alternativa-no-visual p { margin: 0; font-size: 0.95em; }
aside.alternativa-no-visual strong { color: #1d4ed8; }
```

**Ejemplo — Ley de Fitts:**

```html
<aside class="alternativa-no-visual" aria-label="Alternativa no visual">
  <p><strong>Alternativa no visual:</strong> La Ley de Fitts se expresa como T = a + b · log₂(1 + D/W), donde T es el tiempo de apuntamiento, D la distancia al objetivo y W su tamaño. A mayor distancia y menor tamaño, más tiempo se tarda en activar el elemento, igual que en un teclado Braille resulta más rápido pulsar teclas centrales y grandes que teclas pequeñas situadas en las esquinas. En diseño de interfaces, este principio justifica que los botones de acción frecuente sean grandes y estén situados cerca del punto de reposo natural del dedo o del cursor (por ejemplo, la esquina inferior de una pantalla táctil).</p>
</aside>
```

**Ejemplo — Principio Gestalt de proximidad:**

```html
<aside class="alternativa-no-visual" aria-label="Alternativa no visual">
  <p><strong>Alternativa no visual:</strong> El principio de proximidad establece que los elementos situados cerca unos de otros se perciben como un grupo. La analogía sonora: notas musicales tocadas juntas forman un acorde y se perciben como una unidad; tocadas con pausa entre ellas se oyen como frases distintas. En HTML accesible, este principio es la razón de que etiqueta y campo de formulario estén enlazados con <code>&lt;label for&gt;</code>: el lector de pantalla anuncia ambos como una unidad funcional, reproduciendo la misma agrupación que el ojo obtiene por proximidad espacial.</p>
</aside>
```

**Aplica el bloque en cada aparición de:**
- Leyes de interacción con modelos matemáticos: Ley de Fitts, Ley de Hick, Ley de Steering, Ley de Miller
- Principios Gestalt: proximidad, similitud, cierre, continuidad, figura-fondo, simetría
- Composición y jerarquía visual: patrones Z y F de lectura, peso visual, alineación, espaciado
- Uso del color como portador de información: color de estado, contraste cromático, paletas
- Heurísticos de Nielsen cuya evaluación depende de inspección visual
