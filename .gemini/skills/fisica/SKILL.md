---
name: fisica
description: Convierte PDFs de Física (FIS) a HTML accesible WCAG 2.2. Úsala para material de FIS con leyes físicas, fórmulas con unidades SI, diagramas de cuerpo libre, vectores, campos eléctrico o magnético.
codigo: FIS
nombre: Física
curso: 1
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: FÍSICA

### Fórmulas físicas
- Todas las ecuaciones en MathML con alttext que incluya las unidades SI
- Ejemplo: alttext="F igual a m por a, donde F es fuerza en Newtons, m es masa en kilogramos, a es aceleración en metros por segundo al cuadrado"
- Las leyes físicas (Newton, Coulomb, etc.) en `<dl>`: `<dt>nombre</dt><dd>enunciado completo</dd>`

### Magnitudes y unidades
- Escribe siempre la unidad completa la primera vez con su abreviatura: "kilogramo (kg)"
- Usa tablas para comparar magnitudes, órdenes de magnitud o unidades del sistema SI

### Diagramas y vectores
- Los vectores descritos con módulo, dirección y sentido en texto
- Los diagramas de cuerpo libre como listas de fuerzas: nombre, dirección, magnitud
- Los campos (eléctrico, magnético, gravitacional) descritos con texto y fórmulas MathML
