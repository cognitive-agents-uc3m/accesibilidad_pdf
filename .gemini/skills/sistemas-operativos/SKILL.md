---
name: sistemas-operativos
description: Convierte PDFs de Sistemas Operativos (SSOO) a HTML accesible WCAG 2.2. Úsala para material de SSOO con preguntas de autoevaluación tipo test, planificación de procesos (FCFS, SJF, Round Robin), llamadas al sistema, semáforos o sincronización.
codigo: SSOO
nombre: Sistemas Operativos
curso: 2
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: SISTEMAS OPERATIVOS

### Preguntas de autoevaluación
- Las preguntas tipo test como elementos `<details>`/`<summary>` plegables:
  ```html
  <details>
    <summary>Pregunta N: [enunciado completo]</summary>
    <ol type="a">
      <li>[opción A]</li>
      <li>[opción B — CORRECTA]</li>
    </ol>
    <p><strong>Respuesta correcta:</strong> B. [Explicación]</p>
  </details>
  ```
- Las preguntas de desarrollo como `<section>` con enunciado y respuesta modelo

### Planificación de procesos
- Los diagramas de Gantt como tablas: proceso | llegada | ráfaga CPU | inicio | fin | espera | retorno
- Los algoritmos (FCFS, SJF, Round Robin, prioridades) con traza de ejecución como tabla por quantum

### Llamadas al sistema y código C
- Las syscalls en tabla: nombre | parámetros (tipo+nombre) | valor de retorno | descripción
- El código C en `<pre><code class="language-c" aria-label="[descripción]">`

### Sincronización y concurrencia
- Los semáforos y mutex con sus operaciones P/V o wait/signal como listas de pseudocódigo
- Los problemas clásicos (productores-consumidores, cena de filósofos, lectores-escritores) con pseudocódigo accesible
- Los cronogramas de ejecución concurrente como tablas: tiempo | proceso | estado | acción
