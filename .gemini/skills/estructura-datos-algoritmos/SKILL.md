---
name: estructura-datos-algoritmos
description: Convierte PDFs de Estructura de Datos y Algoritmos (EDA) a HTML accesible WCAG 2.2. Úsala para material de EDA con listas enlazadas, árboles binarios, pilas, colas, montículos, trazas de ordenación, BFS, DFS o notación O().
codigo: EDA
nombre: Estructura de Datos y Algoritmos
curso: 1
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: ESTRUCTURA DE DATOS Y ALGORITMOS

### Estructuras de datos
- Listas enlazadas como secuencias lineales: "cabeza → [valor1] → [valor2] → null"
- Árboles binarios como tablas: columnas "Nodo", "Valor", "Hijo izquierdo", "Hijo derecho"
- Pilas y colas como listas con indicación del extremo activo (cima/frente)
- Los montículos (heaps) como arrays con índices explícitos y la propiedad de montículo descrita

### Algoritmos y trazas de ejecución
- Pseudocódigo en `<pre aria-label="Pseudocódigo: [nombre del algoritmo]">`
- Las trazas de ejecución como tablas: columnas = iteración, variables clave, estado de la estructura
- Los algoritmos de ordenación (burbuja, quicksort, mergesort) con traza completa para ejemplos pequeños

### Grafos y BFS/DFS
- Grafos como tablas de adyacencia (ver instrucciones de MD para grafos)
- BFS y DFS como tablas de expansión: paso, nodo visitado, cola/pila actual, conjunto de visitados

### Complejidad algorítmica
- Notaciones O(·) en MathML con alttext: "O mayúscula de n al cuadrado"
- Tabla comparativa al final de cada tema: algoritmo, mejor caso, caso promedio, peor caso, espacio
