---
name: direccion-proyectos-software
description: Convierte PDFs de Dirección de Proyectos de Desarrollo de Software (DPDS) a HTML accesible WCAG 2.2. Úsala para material de DPDS con diagramas de Gantt, gráficas Burndown o Burnup, gestión de riesgos, documentos de entrega o diagramas UML de gestión.
codigo: DPDS
nombre: Dirección de Proyectos de Desarrollo de Software
curso: 3
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: DIRECCIÓN DE PROYECTOS DE DESARROLLO DE SOFTWARE

### Diagramas UML de gestión
- Los diagramas de casos de uso y de secuencia con doble representación (igual que en IS):
  1. Descripción textual accesible
  2. Código PlantUML en `<pre><code class="language-plantuml">`

### Diagramas de Gantt
- Como tablas HTML: tarea | responsable | duración | fecha inicio | fecha fin | dependencias (IDs de tareas previas)
- La ruta crítica marcada con nota textual al final: "Ruta crítica: Tarea 2 → Tarea 5 → Tarea 8"

### Gráficas de avance (Burndown, Burnup, Velocity)
- Descripción de ejes y tendencia: "Gráfica Burndown: eje X semanas 1–8, eje Y puntos de historia pendientes. Tendencia ideal (línea recta) vs. tendencia real (semanas 1–3 por debajo de lo ideal, semanas 4–8 por encima)"

### Documentos de entrega
- Los documentos a entregar como tablas: nombre | descripción | criterios de aceptación | fecha límite

### Gestión de riesgos
- Los riesgos como tabla: ID | descripción | probabilidad (A/M/B) | impacto (A/M/B) | plan de mitigación
