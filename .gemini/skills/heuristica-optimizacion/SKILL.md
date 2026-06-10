---
name: heuristica-optimizacion
description: Convierte PDFs de Heurística y Optimización (HYO) a HTML accesible WCAG 2.2. Úsala para material de HYO con grafos de búsqueda, trazas de A* o Dijkstra, algoritmos genéticos, simulated annealing, búsqueda tabú o código Python de optimización.
codigo: HYO
nombre: Heurística y Optimización
curso: 3
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: HEURÍSTICA Y OPTIMIZACIÓN

### Grafos de búsqueda — CRÍTICO
- Los grafos SIEMPRE como tablas de adyacencia:
  - Filas: nodo de origen (scope="row"), Columnas: nodo de destino (scope="col")
  - Celda: peso de la arista, "—" si no existe conexión
  - Caption: nombre del grafo, dirigido/no dirigido, tipo de pesos
- Para grafos con muchos nodos (>10): lista de aristas como alternativa: "A → B (peso: 5), A → C (peso: 3)..."

### Expansión de nodos
- Las trazas de A*, Branch & Bound, Dijkstra como tablas:
  Columnas: iteración | nodo expandido | coste acumulado g | heurística h | f=g+h | lista abierta (ordenada) | lista cerrada
- Los estados de la expansión en Moodle replicados exactamente como tablas HTML

### Metaheurísticas
- Los algoritmos genéticos: estructura de cromosoma, operadores (selección/cruce/mutación) como listas de pasos
- El simulated annealing, búsqueda tabú: pseudocódigo del bucle principal en `<pre>`
- Las poblaciones de individuos como tablas cuando sea relevante: individuo | codificación | fitness

### Código Python
- En `<pre><code class="language-python" aria-label="[descripción del algoritmo implementado]">`
- Las referencias a hojas de cálculo Excel descritas como la estructura de columnas y fórmulas usadas
