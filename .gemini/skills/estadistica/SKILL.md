---
name: estadistica
description: Convierte PDFs de Estadística (EST) a HTML accesible WCAG 2.2. Úsala para material de EST con fórmulas estadísticas, tablas de distribuciones (Z, t-Student, chi-cuadrado), código R, histogramas, diagramas de dispersión o de caja.
codigo: EST
nombre: Estadística
curso: 2
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: ESTADÍSTICA

### Fórmulas estadísticas
- Cada estadístico en MathML con alttext descriptivo que incluye su nombre:
  Ejemplo: alttext="media muestral x barra, igual a suma de x sub i desde i igual a 1 hasta n, partido por n"
- Tablas resumen por tema: nombre del estadístico, fórmula (MathML), condiciones de aplicación

### Tablas de distribuciones
- Las tablas de distribuciones (Z, t de Student, chi-cuadrado, F de Fisher) como tablas HTML
- scope="col" Y scope="row" para filas y columnas de encabezado simultáneamente
- Caption: "Tabla de distribución [nombre] — [parámetros, nivel de confianza]"

### Código R
- Todo el código R en `<pre><code class="language-r" aria-label="Código R: [descripción del análisis]">`
- Reemplazar referencias a Statgraphics (no accesible) por equivalente en R si el PDF los menciona
- Indica qué paquetes de R se necesitan instalar

### Gráficas estadísticas
- Histogramas: describe forma (simétrica/sesgada), número de clases, rango del eje X, valores frecuentes
- Diagramas de dispersión: tendencia, valores extremos, rango de ambos ejes
- Diagramas de caja: mediana, cuartiles Q1 y Q3, valores atípicos, todos en texto
