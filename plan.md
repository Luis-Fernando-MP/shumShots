# Plan de refactor: `src/views/image-studio/` (dominios + popups granulares)

## Objetivo

Estandarizar `image-studio` a una arquitectura por dominios, con:

- Popups organizados por “parent” (Canvas vs Canvas Images) y cada popup autocontenido (secciones/builders/shared/presets).
- Tipos comunes para “secciones” y “presets” centralizados en `image-studio/types/`.
- Stores de dominio en bajo nivel (consumidos por `BackgroundCanvas` o `PictureCanvas`), no en el padre (`ShotEditor`), respetando:
  - Canvas (fondo): todo lo que afecta a `<BackgroundCanvas />` se aplica dentro de ese componente o su hook.
  - Canvas Images (slots): todo lo que afecta a `<PictureCanvas />` se aplica dentro de ese componente o sus hooks.
- Componentes “grandes” como carpeta con `index.tsx` para permitir crecer con `hooks/`, `utils/`, etc.

## Estado actual (inventario rápido)

### Carpetas principales (hoy)

- `Popups/` (UI de configuración) con dominios mezclados.
- `components/` (BackgroundCanvas, PictureCanvas, ShotEditor, etc.).
- `store/` (background, corner, images, size, grid) pero hay stores fuera: `Popups/FrameConfiguration/store.ts`, `Popups/ShadowConfiguration/store.ts`.
- `hooks/` (useShadowLightDom, useShadowVisualStyles, usePictureSlot, etc.).
- `fx/` (shadow/light/shared) ya sigue patrón data/builders/resolve.
- `slotPositions/` ya sigue patrón data/builders.

### Popups existentes

- Canvas:
  - `Popups/BackgroundConfiguration/*`
  - `Popups/CanvasBorderConfiguration/*`
- Canvas Images:
  - `Popups/CornerConfiguration/*`
  - `Popups/FrameConfiguration/*` (+ store)
  - `Popups/ShadowConfiguration/*` (+ store)
  - `Popups/SlotSizeConfiguration/*`
  - `Popups/ImagesCountConfiguration/*` (+ store re-export)

## Diseño target (estructura de carpetas)

### 1) Tipos comunes (globales de image-studio)

Crear:

```
src/views/image-studio/types/
  sections.types.ts
  presets.types.ts
```

Contrato propuesto (alineado a tu formato y ejecución “directa” de componentes/builders):

- `sections.types.ts`:
  - `export default interface SectionBuilder { key; title; description; SectionIcon; component }`
  - `component` debe ser un `ComponentType<any>` (no un callback inline) para permitir `component={ShadowsSection}` y ejecutar `<Component {...props} />` desde el loop.
- `presets.types.ts`:
  - `export default interface PresetBuilder { key; Title; Description; Builder; Preview }`
  - `Builder` y `Preview` deben ser funciones/componentes invocables directamente en un loop.

### 2) Popups por parent

Target:

```
src/views/image-studio/Popups/
  Canvas/
    Background/
      index.tsx
      sections.ts
      types.sections.ts
      builders/
      presets/
      shared/
  CanvasImages/
    ShadowLight/
      index.tsx
      sections.ts
      types.sections.ts
      store/
        shadow-light/
          initialState.ts
          type.shadow-light.ts
          store.ts
          helpers/
      builders/
        LinkFocusBuilder/
          index.tsx
        ShadowsBuilder/
          index.tsx
        LightsBuilder/
          index.tsx
      shared/
        LayerPanel/
          index.tsx
        FocusPad/
          index.tsx
      presets/
        shadow/
          index.tsx
          constructor.shadow.ts
          preview.shadow.tsx
          types.shadow.ts
        light/
          index.tsx
          constructor.light.ts
          preview.light.tsx
          types.light.ts
```

Notas:

- `sections.ts` define el orden de UI y referencia componentes/builders (sin wrappers inline).
- `builders/*` contiene secciones (UI + conexión con store).
- `shared/*` contiene solo piezas reutilizadas por builders del mismo dominio.
- `presets/*` contiene data + constructor + preview por preset (semántica coherente con la sección).

### 3) Canvas components a carpeta dedicada

Mover:

```
src/views/image-studio/components/BackgroundCanvas/  →  src/views/image-studio/canvas/BackgroundCanvas/
src/views/image-studio/components/PictureCanvas/     →  src/views/image-studio/canvas/PictureCanvas/
```

Y crear dentro de cada uno el hook “unificador”:

```
src/views/image-studio/canvas/BackgroundCanvas/hooks/useBackgroundCanvasStore.tsx
src/views/image-studio/canvas/PictureCanvas/hooks/usePictureCanvasStore.tsx
```

La idea: el hook une stores y aplica DOM/estilos a partir de refs (si hace falta).

## Plan de ejecución (orden seguro y sin romper todo)

### Fase 0 — Preparación (sin cambios funcionales)

1. Crear `src/views/image-studio/types/sections.types.ts` y `presets.types.ts`.
2. Definir la convención de `sections.ts` (Shape + ejecución):
   - `component: ShadowsSection` (ComponentType)
   - el renderer hace `const Component = section.component; return <Component tabId={...} />`
3. Definir convención de `presets/*`:
   - `index.tsx` exporta una constante MAYÚSCULA y la sección consume un arreglo de presets desde ahí.

Validación:

- Typecheck (tsc) sin errores nuevos dentro de `src/views/image-studio/**`.

### Fase 1 — Pilot: refactor del popup “ShadowLight” (Sombras y Luces)

Objetivo: aplicar el nuevo esquema a 1 popup antes de migrar todo.

Pasos:

1. Crear carpeta nueva:
   - `src/views/image-studio/Popups/CanvasImages/ShadowLight/`
2. Partir el popup actual:
   - `Popups/ShadowConfiguration/index.tsx` → nuevo `.../ShadowLight/index.tsx`
   - `wrappers/LinkFocusSection.tsx` → `builders/LinkFocusBuilder/index.tsx`
   - `wrappers/LayerPanel.tsx` → `shared/LayerPanel/index.tsx` (si se usa por sombras y luces)
   - `wrappers/FocusPad.tsx` → `shared/FocusPad/index.tsx`
   - Crear builders “de sección”:
     - `builders/ShadowsBuilder/index.tsx` usa `<LayerPanel kind='shadow' />`
     - `builders/LightsBuilder/index.tsx` usa `<LayerPanel kind='light' />`
3. Crear `sections.ts`:
   - define `SECTIONS: Section[]` (default export) con `component: LinkFocusBuilder/ShadowsBuilder/LightsBuilder`.
4. Presets:
   - mover la data de presets de `store.ts` hacia `presets/shadow` y `presets/light` si el dominio lo permite.
   - si todavía se consumen desde `fx/shadow` y `fx/light`, mantenerlos ahí y solo “wrappear” en presets locales cuando valga la pena.
5. Store:
   - Mantener el store como “aislado de dominio”, pero ubicarlo donde no rompa el bajo nivel.
   - Decisión recomendada (por regla de arquitectura del repo): si el store impacta canvas/slots (sí), moverlo a `src/views/image-studio/store/shadow-light/` y re-exportar un punto de entrada desde el popup:
     - popup importa del store de dominio, no al revés.
   - Mantener STORAGE_KEY y migraciones intactas para no romper persistencia.
6. Actualizar imports consumidores:
   - `PictureCanvas` / `useShadowLightDom` / `ImageStudioPersistGate` deben apuntar al nuevo path del store (si se movió).
7. Dejar “compat” temporal:
   - `Popups/ShadowConfiguration/*` puede quedar como re-export/adapter por 1 PR para minimizar rotura (o eliminarlo en la misma PR si el cambio es atómico).

Validación:

- Probar drag en FocusPad y sliders: no debe repintar todos los slots.
- Confirmar que `reset()` resetea tabs + store (igual que hoy).

### Fase 2 — Popups restantes (migración por dominio)

Orden recomendado:

1. `FrameConfiguration` → `Popups/CanvasImages/Frame/*` + store a dominio `store/frame/`.
2. `CornerConfiguration` → `Popups/CanvasImages/Corner/*` (store ya está en `store/corner/`).
3. `SlotSizeConfiguration` + `ImagesCountConfiguration`:
   - eliminar stores puente/re-exports (`ImagesCountConfiguration/store.ts`).
   - mover UI a `Popups/CanvasImages/Layout/*` o separar `SlotSize` y `ImagesCount` según tu semántica.
4. Canvas:
   - `BackgroundConfiguration` → `Popups/Canvas/Background/*`
   - `CanvasBorderConfiguration` → `Popups/Canvas/CanvasBorder/*`

Validación:

- Cada popup debe tener `index.tsx`, `sections.ts`, `types.sections.ts`, `builders/`, `shared/`, `presets/` (si aplica).
- No deben quedar stores de dominio dentro del árbol de UI si afectan al canvas.

### Fase 3 — Canvas folder y “hooks unificadores”

1. Mover `components/BackgroundCanvas` → `canvas/BackgroundCanvas`.
2. Mover `components/PictureCanvas` → `canvas/PictureCanvas`.
3. Actualizar `ShotEditor` para importar desde `canvas/*`.
4. Crear hooks:
   - `useBackgroundCanvasStore.tsx`: unifica background stores y aplica styles.
   - `usePictureCanvasStore.tsx`: unifica corner/frame/shadow/light/size/tabs y aplica DOM (incluye el binding de `useShadowLightDom` y similares si corresponde).

Regla:

- `ShotEditor` no debe consumir stores de dominio; solo renderiza.
- `BackgroundCanvas` y `PictureCanvas` son los dueños del consumo y side-effects de sus stores.

### Fase 4 — Limpieza final y coherencia

1. Mover/renombrar `hooks/` por dominio cuando sea claro:
   - `useShadowLightDom` cerca de `store/shadow-light` o `canvas/PictureCanvas/hooks`.
2. `shared/components/tabs/store.ts`:
   - opcional: mover a `store/tabs/` (para que UI sea UI).
3. Normalizar imports:
   - evitar `@/shared/*` nuevo; preferir `@views/*`, `@common/*`, `@shared/*` según reglas del repo.
4. Eliminar carpetas viejas una vez que no haya imports.

## Checklist de aceptación (Done Definition)

- `Popups/` solo contiene UI/configuración (secciones/builders/shared/presets).
- Stores que afectan el render de canvas viven en bajo nivel (consumidos por `BackgroundCanvas` o `PictureCanvas`).
- Todos los popups siguen el mismo esquema: `index.tsx`, `sections.ts`, `types.sections.ts`, `builders/`, `shared/`, `presets/`.
- Tipos comunes existen en `image-studio/types/` y se reutilizan (SectionBuilder/PresetBuilder).
- No hay imports rotos (typecheck) y no se pierde persistencia (keys/version iguales).
