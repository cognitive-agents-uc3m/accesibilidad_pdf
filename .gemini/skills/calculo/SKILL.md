---
name: calculo
description: Convierte PDFs de Cálculo (CAL) a HTML accesible WCAG 2.2. Úsala para material de CAL con límites, derivadas, integrales, series de Taylor o Maclaurin, gráficas de funciones o cronogramas de la asignatura.
codigo: CAL
nombre: Cálculo
curso: 1
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: CÁLCULO

### Fórmulas de cálculo
- Límites, derivadas e integrales SIEMPRE en MathML con alttext que verbalice la operación completa
- Ejemplo: alttext="límite cuando x tiende a cero de seno de x partido por x, igual a uno"
- Las series (Taylor, Maclaurin) como listas con cada término descrito individualmente

### Cronograma
- Los cronogramas de la asignatura como tablas HTML:
  - Primera columna: semana/sesión (scope="row")
  - Columnas: tema, tipo de clase (magistral/grupo pequeño), observaciones
  - Celdas sin contenido señalizadas con "—"
  - La fila de encabezado con scope="col"

### Gráficas de funciones
- Cada gráfica descrita con: dominio, rango, ceros, máximos/mínimos, asíntotas, comportamiento general
- Formato: `<figure><img alt="[descripción breve]"><figcaption>Descripción detallada: dominio [...], ceros en [...], máximo en [...]</figcaption></figure>`
