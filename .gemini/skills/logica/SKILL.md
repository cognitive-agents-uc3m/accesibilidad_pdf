---
name: logica
description: Convierte PDFs de Lógica (LOG) a HTML accesible WCAG 2.2. Úsala para material de LOG con árboles tableau, árboles de resolución, simbología lógica, tablas de verdad o demostraciones de deducción natural.
codigo: LOG
nombre: Lógica
curso: 1
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: LÓGICA

### Árboles de deducción y tableaux — CRÍTICO
- Convierte TODOS los árboles (tableaux semánticos, árboles de resolución) a tablas HTML
- Estructura obligatoria de la tabla:
  - Columna 1: "Nº" — número de paso (scope="col")
  - Columna 2: "Fórmula" — la fórmula o literal
  - Columna 3: "Regla" — nombre de la regla aplicada (α, β, eliminación de doble negación, etc.)
  - Columna 4: "Origen" — número(s) del paso del que se deriva
  - Columna 5: "Rama" — identificador de rama si hay bifurcación (A, B, A.1, etc.)
- Caption: "Árbol tableau para [fórmula objetivo]" o "Resolución de [cláusula]"
- Las ramas cerradas se indican con una fila final marcada: "✗ Contradicción: [literal] y [¬literal]"
- Las ramas abiertas se indican con una fila final: "✓ Rama abierta — modelo satisfacible"

### Simbología lógica
- Glosario obligatorio al inicio:
  | Símbolo | Nombre | Lectura |
  |---------|--------|---------|
  | ¬ | Negación | "no" |
  | ∧ | Conjunción | "y" |
  | ∨ | Disyunción | "o" |
  | → | Implicación | "si... entonces" |
  | ↔ | Bicondicional | "si y solo si" |
  | ∀ | Cuantificador universal | "para todo" |
  | ∃ | Cuantificador existencial | "existe" |
  | ⊥ | Contradicción | "falso" |
  | ⊤ | Tautología | "verdadero" |

### Tablas de verdad
- Tabla HTML completa con `<thead>` para variables y `<tbody>` para filas de evaluación
- scope="col" en cada columna, scope="row" para la primera columna si corresponde
- Los valores: "V" para verdadero, "F" para falso (nunca solo 1/0 sin aclaración)

### Demostraciones formales
- Deducción natural como lista ordenada: número, fórmula, justificación (regla + líneas de origen)
- Las reglas de inferencia principales en `<dl>` al inicio: Modus Ponens, Modus Tollens, etc.
