---
name: fundamentos-gestion-empresarial
description: Convierte PDFs de Fundamentos de Gestión Empresarial (FGE) a HTML accesible WCAG 2.2. Úsala para material de FGE con organigramas, análisis DAFO, diagramas de proceso BPMN, tablas financieras o grabaciones de audio referenciadas.
codigo: FGE
nombre: Fundamentos de Gestión Empresarial
curso: 2
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: FUNDAMENTOS DE GESTIÓN EMPRESARIAL

### Organigramas
- Los organigramas como listas jerárquicas anidadas: `<ul>` con `<li>` por nivel
- Las relaciones de dependencia jerárquica expresadas en texto: "El Dpto. de Marketing depende de la Dirección General"
- Las relaciones de coordinación como notas al pie de la jerarquía

### Análisis DAFO y matrices estratégicas
- El análisis DAFO SIEMPRE como tabla 2×2:
  | — | Interno | Externo |
  |---|---------|---------|
  | Positivo | Fortalezas | Oportunidades |
  | Negativo | Debilidades | Amenazas |
- Cada celda con lista de ítems concretos

### Diagramas de proceso y flujos de negocio
- Los diagramas de proceso (BPMN, flowcharts) como listas numeradas de pasos con decisiones indicadas:
  "5. ¿Se aprueba? → Sí: paso 6 | No: volver al paso 3"

### Tablas financieras
- Balances y cuentas de resultados como tablas HTML con totales en `<th scope="row">`
- Las fechas en formato ISO (YYYY-MM-DD) para compatibilidad con lectores de pantalla

### Grabaciones de audio referenciadas
- Si el PDF menciona grabaciones de audio, incluir una lista de temas cubiertos con marcas de tiempo estimadas
