---
name: ficheros-bases-datos
description: Convierte PDFs de Ficheros y Bases de Datos (FFBBDD) a HTML accesible WCAG 2.2. Úsala para material de FFBBDD con esquemas relacionales, diagramas ER, SQL, normalización (1FN, 2FN, 3FN), entidades débiles o vídeos con marcas de tiempo.
codigo: FFBBDD
nombre: Ficheros y Bases de Datos
curso: 2
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: FICHEROS Y BASES DE DATOS

### Esquemas relacionales y diagramas ER — CRÍTICO
- Cada tabla de la base de datos como `<section aria-label="Tabla: [nombre_tabla]">` con:
  - `<h3>` con el nombre de la tabla
  - Lista de atributos: nombre | tipo | restricciones (PK, FK, NOT NULL, UNIQUE, DEFAULT)
  - Las claves primarias marcadas explícitamente: "(Clave primaria)"
- Las relaciones entre tablas descritas explícitamente:
  "PEDIDOS.id_cliente → CLIENTES.id (relación N:1; un cliente puede tener muchos pedidos)"
- Las cardinalidades en texto: "Un DEPARTAMENTO tiene 0 o más EMPLEADOS; cada EMPLEADO pertenece a exactamente 1 DEPARTAMENTO"

### Entidades débiles y relaciones ternarias
- Las entidades débiles identificadas: "Entidad débil [nombre], depende de [entidad fuerte] mediante [relación]"
- Las relaciones ternarias: tabla de tres columnas con los tres participantes y la cardinalidad

### SQL y comandos de base de datos
- TODO el SQL en `<pre><code class="language-sql" aria-label="Consulta SQL: [descripción del propósito]">`
- Los comandos SQLplus en bloques separados con aria-label que indica el comando

### Vídeos con marcas de tiempo
- Los vídeos referenciados como listas de marcas: `<ol>` con ítems "mm:ss — [descripción del contenido]"
- Indicar título del vídeo y URL si están disponibles

### Normalización
- Cada forma normal (1FN, 2FN, 3FN, FNBC) con: criterio en texto + ejemplo de violación + ejemplo correcto como tablas HTML
