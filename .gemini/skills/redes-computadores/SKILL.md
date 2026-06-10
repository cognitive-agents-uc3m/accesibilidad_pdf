---
name: redes-computadores
description: Convierte PDFs de Redes de Computadores (RDO) a HTML accesible WCAG 2.2. Úsala para material de RDO con topologías de red, cabeceras de protocolos IP/TCP/UDP, tablas de enrutamiento, trazas Wireshark o configuración con comandos ip e iptables.
codigo: RDO
nombre: Redes de Computadores
curso: 3
cuatrimestre: 1
---

## INSTRUCCIONES ESPECÍFICAS: REDES DE COMPUTADORES

### Topologías de red — CRÍTICO
- Las topologías (estrella, bus, anillo, malla) y diagramas de red descritos textualmente:
  ```
  Nodo: [nombre] (Tipo: router|switch|host|servidor)
    Interfaz [eth0]: IP [x.x.x.x/máscara], conectada a [nodo destino] mediante [tipo de medio: Ethernet 1Gbps|Wi-Fi|fibra]
  ```
- La topología general en una frase: "Red en estrella: switch central SW1 conectado a 4 hosts (PC1-PC4) y al router R1 que da acceso a Internet"

### Protocolos y cabeceras
- Los campos de cabecera de protocolos (IP, TCP, UDP, HTTP, etc.) como tablas: campo | tamaño (bits) | descripción | valores posibles
- Los flujos de mensajes (TCP three-way handshake, DNS, ARP) como listas numeradas de mensajes

### Tablas de enrutamiento
- Tabla HTML: red destino | máscara | gateway | interfaz | métrica

### Configuración de red
- Comandos de configuración (ip, iptables, netstat, etc.) en `<pre><code class="language-bash">`
- La máquina virtual y herramientas de prácticas: descripción textual de la configuración (CORE no accesible → describir el diseño de red en texto equivalente)

### Trazas de red
- Las capturas tipo Wireshark como tablas: nº | tiempo | origen | destino | protocolo | longitud | información
