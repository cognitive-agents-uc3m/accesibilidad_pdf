---
name: ingenieria-software
description: Convierte PDFs de Ingeniería del Software (IS) a HTML accesible WCAG 2.2. Úsala para material de IS con diagramas UML (clases, secuencia, componentes, despliegue), casos de uso, gestión de configuración o comandos Git y SVN.
codigo: IS
nombre: Ingeniería del Software
curso: 3
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: INGENIERÍA DEL SOFTWARE

### Diagramas UML — CRÍTICO: DOBLE REPRESENTACIÓN
Para CADA diagrama UML, proporcionar OBLIGATORIAMENTE las dos representaciones siguientes:

**1. Descripción textual accesible:**

*Diagrama de clases:*
- Tabla por clase: nombre | estereotipo | atributos (visibilidad+tipo+nombre) | métodos (visibilidad+retorno+signatura)
- Lista de relaciones: "ClaseA hereda de ClaseB", "ClaseA compone 1..* ClaseC", etc.

*Diagrama de secuencia:*
- Lista numerada: "Paso N: [Participante A] → [Participante B]: [mensaje]([parámetros])"
- Indicar explícitamente mensajes síncronos (→) vs asíncronos (--→) y retornos

*Diagrama de componentes/despliegue:*
- Lista de componentes con interfaces proporcionadas y requeridas
- Los nodos de despliegue como secciones con los artefactos que alojan

**2. Código PlantUML:**
```html
<pre><code class="language-plantuml" aria-label="PlantUML: [tipo de diagrama] — [descripción]">
@startuml
[código PlantUML]
@enduml
</code></pre>
```

### Casos de uso
- Tabla: nombre del CU | actores | precondición | flujo principal (lista numerada) | postcondición | flujos alternativos

### Gestión de configuración y versionado
- Los comandos Git/SVN en `<pre><code class="language-bash">`
- Los flujos de trabajo de ramas como listas de pasos
