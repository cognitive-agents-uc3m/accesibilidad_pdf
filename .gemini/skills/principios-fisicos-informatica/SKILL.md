---
name: principios-fisicos-informatica
description: Convierte PDFs de Principios Físicos de la Ingeniería Informática (PFI) a HTML accesible WCAG 2.2. Úsala para material de PFI con circuitos eléctricos, componentes electrónicos, mallas de Kirchhoff, piezas 3D o fórmulas con unidades eléctricas.
codigo: PFI
nombre: Principios Físicos de la Ingeniería Informática
curso: 1
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: PRINCIPIOS FÍSICOS DE LA INGENIERÍA INFORMÁTICA

### Circuitos eléctricos y electrónicos
- Cada componente del circuito descrito en un bloque `<dl>`:
  - `<dt>` nombre del componente (ej: R1 — Resistencia)
  - `<dd>` valor, nodos de conexión y función: "10 kΩ; terminal A conectada a VCC (+5V), terminal B a la base del transistor Q1"
- Las mallas de Kirchhoff como listas de ecuaciones, cada una como ítem numerado
- Los nodos identificados con nombres explícitos (Nodo A, Nodo B...)

### Piezas 3D y elementos táctiles
- Para componentes representados físicamente mediante impresión 3D:
  describe geometría, material y función: "Pieza cilíndrica que representa una resistencia; dos terminales en los extremos del cilindro unidos con hilo"
- La posición espacial de cada pin o terminal descrita: "pin 1 en esquina superior izquierda de la placa"

### Fórmulas
- Todas en MathML con alttext que incluya unidades: "V igual a I por R, donde V es voltios, I amperios, R ohmios"
