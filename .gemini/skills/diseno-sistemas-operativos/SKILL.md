---
name: diseno-sistemas-operativos
description: Convierte PDFs de Diseño de Sistemas Operativos (DSO) a HTML accesible WCAG 2.2. Úsala para material de DSO con conexiones GPIO de Raspberry Pi, código C o Arduino, módulos del kernel Linux, sistemas de archivos (inodos, FAT, ext4) o sincronización de bajo nivel.
codigo: DSO
nombre: Diseño de Sistemas Operativos
curso: 3
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: DISEÑO DE SISTEMAS OPERATIVOS

### Raspberry Pi y conexiones hardware — CRÍTICO
- Los esquemas de conexiones GPIO como tablas de pines:
  Columnas: nº pin | nombre GPIO | función asignada | voltaje | descripción de la conexión física
- Las conexiones que no pueden adaptarse (componentes visuales sin alternativa táctil) marcadas explícitamente:
  `<p class="nota-adaptacion"><strong>Nota:</strong> Esta sección requiere apoyo presencial o compañero de laboratorio para el montaje físico.</p>`

### Código C y Arduino
- Todo código en `<pre><code class="language-c" aria-label="Código C: [descripción]">`
- El código Arduino en `<pre><code class="language-arduino" aria-label="Arduino: [descripción]">`
- Los módulos del kernel Linux en secciones separadas con descripción del propósito

### Máquinas virtuales y entornos de desarrollo
- Los pasos de configuración de VMs como listas numeradas con los comandos en `<code>`
- Las limitaciones de accesibilidad conocidas de las herramientas del curso indicadas explícitamente con la alternativa utilizada (ej: editor de texto plano en lugar del IDE de Arduino)

### Sistemas de archivos
- Las estructuras de inodos, FAT, ext4 como tablas de campos: nombre | tamaño | descripción
- Los árboles de directorios como listas anidadas `<ul>` con `<li>` por entrada

### Sincronización de bajo nivel
- Los mecanismos del kernel (spinlocks, mutexes del kernel, semáforos) con pseudocódigo y descripción de las primitivas
