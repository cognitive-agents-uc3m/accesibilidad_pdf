---
name: matematica-discreta
description: Convierte PDFs de Matemática Discreta (MD) a HTML accesible WCAG 2.2. Úsala para material de MD con grafos, tablas de adyacencia, simbología lógica y de conjuntos, demostraciones por inducción, relaciones o funciones.
codigo: MD
nombre: Matemática Discreta
curso: 1
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: MATEMÁTICA DISCRETA

### Grafos — CRÍTICO
- Los grafos se representan SIEMPRE como tablas de adyacencia, nunca como imágenes visuales
- Estructura: filas = nodo de origen (scope="row"), columnas = nodo de destino (scope="col")
- Celda: "1" o el peso si hay arista, "—" si no hay conexión
- Caption: indica si el grafo es dirigido o no dirigido, y el número de vértices/aristas

### Simbología lógica y de conjuntos
- Glosario al inicio del documento: símbolo Unicode → nombre → lectura en voz alta
  Ejemplo: "∀ | cuantificador universal | para todo"
- Los símbolos usados: ∈ ∉ ⊂ ⊃ ∪ ∩ ∅ ∀ ∃ ¬ ∧ ∨ → ↔ ℕ ℤ ℚ ℝ
- Primera aparición de cada símbolo acompañada de su nombre entre paréntesis

### Demostraciones
- Inducción matemática: tres secciones obligatorias — "Base (n=k₀)", "Hipótesis inductiva", "Paso inductivo"
- Demostraciones directas/contraejemplo como listas numeradas
- Contraejemplos en `<aside aria-label="Contraejemplo">` con descripción completa

### Relaciones y funciones
- Las relaciones binarias como tablas de adyacencia (igual que grafos)
- Las propiedades (reflexiva, simétrica, transitiva) verificadas textualmente para cada relación del ejercicio
