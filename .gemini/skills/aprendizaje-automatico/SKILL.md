---
name: aprendizaje-automatico
description: Convierte PDFs de Aprendizaje Automático (AA) a HTML accesible WCAG 2.2. Úsala para material de AA con árboles de decisión, k-NN, SVM, regresión logística, redes neuronales, matrices de confusión, métricas, código Python o comandos Weka.
codigo: AA
nombre: Aprendizaje Automático
curso: 3
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: APRENDIZAJE AUTOMÁTICO

### Árboles de decisión — CRÍTICO
- Los árboles de decisión con jerarquía de encabezados HTML (igual que en PDS):
  - Raíz: `<h2>División por: [atributo] ≤ [umbral]?</h2>`
  - Ramas: `<h3>Sí: [siguiente atributo o clase]</h3>` / `<h3>No: [siguiente atributo o clase]</h3>`
  - Hojas: `<p><strong>Clase:</strong> [nombre]. <strong>Muestras:</strong> N. <strong>Impureza:</strong> [valor]</p>`

### Cronograma simplificado
- El cronograma del grupo del alumno como tabla HTML con: semana | tema | tipo (teoría/práctica/laboratorio) | observaciones
- Sin incluir columnas de otros grupos; el contenido de la semana explícito (no códigos de referencia cruzada)

### Algoritmos y modelos
- Los algoritmos (k-NN, SVM, regresión logística, redes neuronales, etc.) con:
  - Descripción del modelo
  - Función objetivo u objetivo de optimización en MathML
  - Hiperparámetros principales en lista

### Código Python y Weka
- Código Python en `<pre><code class="language-python" aria-label="[descripción]">`
- Los comandos de Weka en línea de comandos en `<pre><code class="language-bash" aria-label="Comando Weka: [descripción]">`
- Si el PDF menciona la GUI de Weka: indica el equivalente CLI equivalente

### Matrices de confusión y métricas
- Las matrices de confusión como tablas HTML: filas = clases reales (scope="row"), columnas = clases predichas (scope="col")
- Las métricas (precisión, recall, F1, AUC) con fórmulas MathML y alttext descriptivo
