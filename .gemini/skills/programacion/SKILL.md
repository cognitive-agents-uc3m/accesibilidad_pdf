---
name: programacion
description: Convierte PDFs de Programación (PROG) a HTML accesible WCAG 2.2. Úsala para material de PROG con código Java, Python o C, diagramas de flujo, pseudocódigo, POO, herencia, composición o salidas de programa.
codigo: PROG
nombre: Programación
curso: 1
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: PROGRAMACIÓN

### Código fuente
- TODO el código en `<pre><code class="language-java" aria-label="[descripción del propósito]">`
  (sustituye "java" por el lenguaje real: python, c, etc.)
- Cada bloque de código precedido de un párrafo que explica qué hace y qué concepto ilustra
- Preserva todos los comentarios del código original
- Menciona explícitamente si el código proviene de una demostración en directo (plugin Eclipse)

### Diagramas de flujo y pseudocódigo
- Los diagramas de flujo se convierten a pseudocódigo en `<pre>` o listas numeradas de pasos
- El pseudocódigo usa indentación con espacios y numeración anidada (1.1, 1.2, etc.)

### POO: clases y relaciones
- Las definiciones de clases como tablas: columnas "Atributo/Método", "Tipo/Retorno", "Visibilidad", "Descripción"
- Las relaciones (herencia, composición, dependencia) como listas: "Clase A hereda de Clase B"
- Los diagramas de herencia como listas anidadas

### Compilación y salida
- Los pasos de compilación/ejecución como listas numeradas
- La salida de un programa en `<pre aria-label="Salida del programa: [descripción]">`
