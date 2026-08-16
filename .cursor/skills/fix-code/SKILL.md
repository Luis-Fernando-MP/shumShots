---
name: fix-code
description: >-
  Refine and fix code quality using Impeccable audit and polish commands in sequence. 
  Use when you want a thorough quality pass on a feature or component. 
  Modes: "slow" (audit -> polish -> audit) or "hard" (sequence with an extra pass if score < 17).
---

# /fix-code

Ejecuta un ciclo de refinamiento de código basado en los estándares de **Impeccable**. Esta skill combina la detección técnica (`audit`) y el refinamiento visual/lógico (`polish`) para asegurar que el código cumpla con los estándares del proyecto sin consumir tokens excesivos.

## Instrucciones

Determina el modo solicitado por el usuario (`slow` o `hard`) y sigue la secuencia de comandos correspondiente.

### Modo: /fix-code slow
Realiza una única pasada de refinamiento estructurada:

1.  **Detección inicial**: Ejecuta `/impeccable audit <target>`. Analiza los hallazgos técnicos (a11y, perf, theming, responsive, integridad).
2.  **Refinamiento**: Ejecuta `/impeccable polish <target>`. Aplica los arreglos identificados en el audit y mejora la consistencia siguiendo `DESIGN.md` y `PRODUCT.md`.
3.  **Verificación final**: Ejecuta `/impeccable audit <target>` nuevamente para obtener la nota final y confirmar las mejoras.

### Modo: /fix-code hard
Realiza un refinamiento más exigente y recurrente si la calidad no alcanza el umbral de excelencia:

1.  **Primera pasada**: Sigue la secuencia del modo `slow` (`audit` -> `polish` -> `audit`).
2.  **Condición de recurrencia**:
    -   Si la nota final del segundo `audit` es **menor a 17/20**: Inicia una **segunda pasada** completa de refinamiento (`polish` -> `audit`).
    -   En esta segunda pasada, sé más estricto con el cumplimiento de tokens, alineación óptica y limpieza de código (eliminar duplicación, optimizar renders).
3.  **Finalización**: Detente después de la segunda pasada, independientemente de la nota, para conservar tokens. Informa al usuario sobre el progreso del puntaje.

## Reglas de Ejecución

-   **Eficiencia de Tokens**: No pidas playbooks innecesarios. Usa el conocimiento previo del proyecto (`AGENTS.md`, `DESIGN.md`) para actuar rápido.
-   **Priorización**: Enfócate en hallazgos P0 y P1 durante el `polish`.
-   **Sin Comentarios**: No añadas comentarios de implementación. Usa JSDoc en español sobre componentes o métodos reutilizables según indica `AGENTS.md`.
-   **Lógica de Render**: Asegura que el código resultante use `&&` para renderizado condicional en lugar de ternarias.
-   **Radio Canónico**: Mantén el radio en `4px` según los tokens globales.

## Ejemplos

-   "Revisa este componente con /fix-code slow"
-   "Aplica /fix-code hard a la vista de image-studio"
