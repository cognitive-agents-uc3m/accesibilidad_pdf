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
