---
name: teoria-automatas-lenguajes-formales
description: Convierte PDFs de Teoría de Autómatas y Lenguajes Formales (TALF) a HTML accesible WCAG 2.2. Úsala para material de TALF con autómatas finitos AFD o AFND, autómatas de pila, máquinas de Turing, gramáticas formales o jerarquía de Chomsky.
codigo: TALF
nombre: Teoría de Autómatas y Lenguajes Formales
curso: 2
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: TEORÍA DE AUTÓMATAS Y LENGUAJES FORMALES

### Autómatas finitos (AFD y AFND) — CRÍTICO
- Los autómatas se representan SIEMPRE como tablas de transición, JAMÁS como grafos de estados
- Estructura de la tabla de transición:
  - Primera columna: estado (marcar estado inicial con "→", estados de aceptación con "*", ambos con "→*")
  - scope="row" en la primera columna
  - Una columna adicional por cada símbolo del alfabeto Σ (scope="col")
  - Celda: estado destino, o "∅" si no existe transición
  - Caption: "[Tipo] para el lenguaje [descripción del lenguaje reconocido]"

### Autómatas de pila (AP)
- Tabla de transición con columnas: estado actual | símbolo entrada (ε si vacío) | tope de pila | estado destino | pila resultante

### Máquinas de Turing
- Tabla de transición: estado actual | símbolo leído | símbolo escrito | dirección (L/R/S) | estado siguiente

### Gramáticas formales
- Las producciones como lista `<ul>`: cada producción un `<li>`: "S → aSb | ε"
- La jerarquía de Chomsky como tabla comparativa: tipo, nombre, restricción en producciones, autómata equivalente

### Algoritmos de determinización y minimización
- Listas numeradas de pasos con tablas intermedias (ε-clausura, tabla de transiciones del AFD resultante)
- Los conjuntos de estados del AFD resultante nombrados explícitamente: "{q0, q1} → estado A"
