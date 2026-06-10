---
name: estructura-computadores
description: Convierte PDFs de Estructura de Computadores (EC) a HTML accesible WCAG 2.2. Úsala para material de EC con arquitectura interna de CPU, flip-flops, diagramas de temporización, código ensamblador o máquinas de Moore y Mealy.
codigo: EC
nombre: Estructura de Computadores
curso: 2
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: ESTRUCTURA DE COMPUTADORES

### Arquitectura interna del computador — CRÍTICO
- Los diagramas de bloques se describen con pseudolenguaje de grafo en `<section aria-label="Componente: [nombre]">`:
  ```
  COMPONENTE: [nombre completo]
  TIPO: [ALU | registro | bus | memoria | unidad de control | ...]
  DESCRIPCIÓN: [función en una oración]
  ENTRADAS: señal1 (bits), señal2 (bits)
  SALIDAS: señal1 (bits)
  CONECTADO_A: Componente_X mediante Bus_Y (n bits)
  ```
- Cada componente en un `<dl>` con `<dt>` para el nombre y `<dd>` para cada propiedad

### Circuitos lógicos y flip-flops
- Los circuitos combinacionales: expresión booleana + tabla de verdad HTML
- Los flip-flops (D, JK, T, SR): tabla de excitación + tabla de transiciones de estados
- Las máquinas de Moore/Mealy: tabla de transición con columnas estado actual, entrada, estado siguiente, salida

### Diagramas de temporización
- Como tablas: columnas = ciclo de reloj (1, 2, 3...), filas = señal (CLK, D, Q, etc.), celda = valor (0/1/↑/↓)

### Código ensamblador
- En `<pre><code class="language-asm" aria-label="Código ensamblador: [descripción]">`
- Con comentario inline en cada instrucción explicando su efecto sobre registros/memoria
