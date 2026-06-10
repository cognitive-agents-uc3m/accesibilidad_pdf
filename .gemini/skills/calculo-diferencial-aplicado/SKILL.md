---
name: calculo-diferencial-aplicado
description: Convierte PDFs de Cálculo Diferencial Aplicado (CALDIF) a HTML accesible WCAG 2.2. Úsala para material de CALDIF con derivadas parciales, gradientes, matrices jacobianas, cálculo multivariable, apuntes manuscritos escaneados o formularios de fórmulas.
codigo: CALDIF
nombre: Cálculo Diferencial Aplicado
curso: 2
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: CÁLCULO DIFERENCIAL APLICADO

### Fórmulas — CRÍTICO
- ABSOLUTAMENTE TODAS las fórmulas en MathML con alttext que verbalice la expresión entera
- Ejemplo completo:
  `<math alttext="derivada de f respecto a x igual al límite cuando h tiende a cero de f de x más h menos f de x, todo partido por h">`
- Para LaTeX en el original: conviértelo a MathML equivalente, nunca dejes LaTeX sin procesar

### Apuntes escaneados o escritura a mano
- Si el PDF contiene imágenes de apuntes manuscritos, transcribe todo su contenido matemático a MathML
- Indica con `<aside>`: "Nota: este contenido proviene de apuntes manuscritos originales"

### Formularios de estudio
- Los formularios de fórmulas por tema como tablas:
  - Columna 1: Nombre de la fórmula/teorema
  - Columna 2: Expresión MathML
  - Columna 3: Condiciones o dominio de aplicación

### Cálculo multivariable
- Los gradientes y matrices jacobianas en MathML con alttext completo
- Las derivadas parciales con alttext explícito: "derivada parcial de f respecto a x sub 1, evaluada en el punto (a, b)"
- Los teoremas (Fubini, cambio de variable, etc.) en `<dl>` con nombre, enunciado y condiciones
