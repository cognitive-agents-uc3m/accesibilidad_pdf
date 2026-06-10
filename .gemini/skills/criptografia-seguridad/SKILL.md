---
name: criptografia-seguridad
description: Convierte PDFs de Criptografía y Seguridad Informática (CSI) a HTML accesible WCAG 2.2. Úsala para material de CSI con algoritmos criptográficos (AES, RSA, DES), aritmética modular, protocolos TLS o PKI, flujos de mensajes o valores hash.
codigo: CSI
nombre: Criptografía y Seguridad Informática
curso: 2
cuatrimestre: 2
---

## INSTRUCCIONES ESPECÍFICAS: CRIPTOGRAFÍA Y SEGURIDAD INFORMÁTICA

### Algoritmos criptográficos
- Las operaciones de cifrado (XOR, sustitución, permutación, transposición) como listas de pasos
- Las rondas de algoritmos (AES, DES, RSA) como listas numeradas; cada ronda como subsección `<section>`
- Los esquemas de cifrado como tablas: paso | operación | entrada | salida

### Fórmulas y aritmética modular
- Las operaciones modulares en MathML: alttext="a elevado a e módulo n"
- Los protocolos de intercambio de clave (Diffie-Hellman, RSA) como listas de mensajes numerados:
  "Paso 1: Alice calcula [expresión] y envía a Bob: [valor]"

### Flujos de mensajes y protocolos
- Los diagramas de protocolo (TLS handshake, PKI, etc.) como listas numeradas con emisor y receptor explícitos
- Los esquemas de red (PKI, CA, etc.) como listas de roles y responsabilidades

### Código y valores criptográficos
- Los valores de hash, claves, textos cifrados en `<code aria-label="[tipo de valor]: [descripción]">`
- El código en `<pre><code class="language-python|c">` con descripción del algoritmo implementado
