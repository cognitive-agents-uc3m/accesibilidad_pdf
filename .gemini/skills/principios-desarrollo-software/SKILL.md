---
name: principios-desarrollo-software
description: Convierte PDFs de Principios de Desarrollo de Software (PDS) a HTML accesible WCAG 2.2. Úsala para material de PDS con árboles de decisión, diagramas UML, patrones de diseño (creacional, estructural, comportamiento) o casos de prueba.
codigo: PDS
nombre: Principios de Desarrollo de Software
curso: 2
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: PRINCIPIOS DE DESARROLLO DE SOFTWARE

### Árboles de decisión — CRÍTICO
- Los árboles de decisión se representan usando jerarquía de encabezados HTML:
  - Nodo raíz (pregunta principal): `<h2>Decisión: [condición o pregunta]</h2>`
  - Rama de nivel 1: `<h3>[Respuesta/condición]: [siguiente decisión o resultado]</h3>`
  - Rama de nivel 2: `<h4>[Respuesta/condición]: [resultado final]</h4>`
  - Hojas (resultados finales): `<p class="resultado-decision">Resultado: [valor]</p>`
- Alternativamente, como listas anidadas `<ul>` con la condición y sus ramas como sub-ítems

### Diagramas UML
- Los diagramas de clases como tablas: clase | atributos (visibilidad+tipo+nombre) | métodos (visibilidad+retorno+signatura)
- Los casos de uso como listas: actor | caso de uso | descripción breve | relaciones (include/extend)
- Los diagramas de secuencia como listas de mensajes numerados

### Patrones de diseño
- Cada patrón en `<section>`: nombre, categoría (creacional/estructural/comportamiento), intención, participantes (lista), ejemplo de código

### Pruebas de software
- Los casos de prueba como tablas: ID | descripción | entrada | salida esperada | resultado
