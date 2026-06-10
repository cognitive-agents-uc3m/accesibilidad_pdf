---
name: algebra-lineal
description: Convierte PDFs de Álgebra Lineal (AL) a HTML accesible WCAG 2.2. Úsala para material de AL con matrices, vectores, sistemas de ecuaciones lineales, eigenvalores, espacios vectoriales, transformaciones lineales o código Matlab.
codigo: AL
nombre: Álgebra Lineal
curso: 1
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: ÁLGEBRA LINEAL

### Matrices y vectores
- Cada matriz se representa como tabla HTML con `<caption>` que indique su nombre y dimensiones: "Matriz A (3×3)"
- Los vectores columna se presentan como tablas de una sola columna; los vectores fila como tablas de una sola fila
- Indica siempre si una matriz es cuadrada, triangular, simétrica, etc. en el caption

### Fórmulas y operaciones
- TODAS las fórmulas algebraicas en MathML con `alttext` que verbalice la expresión completa
- Ejemplo de alttext: "determinante de A igual a a sub 11 por a sub 22 menos a sub 12 por a sub 21"
- Los sistemas de ecuaciones como listas ordenadas, cada ecuación como ítem: "1. 2x₁ + 3x₂ = 5"
- Los pasos de eliminación gaussiana como tabla: fila, operación aplicada, resultado

### Código Matlab
- Todo código Matlab en `<pre><code class="language-matlab" aria-label="Código Matlab: [descripción]">`
- Incluir comentario textual previo describiendo qué calcula

### Conceptos clave
- Escribe siempre completo: "eigenvalor" (no solo λ), "espacio vectorial", "transformación lineal"
- Define cada símbolo la primera vez que aparece o incluye un glosario al inicio del documento
