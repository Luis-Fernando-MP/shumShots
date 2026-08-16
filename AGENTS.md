# PIXIS Engineering Guide

Índice. **No copies** estos archivos al chat: ábrelos cuando el tema toque.

## Dónde está cada cosa

| Tema | Abrir |
| --- | --- |
| Producto, usuarios, estudios, constraints | `PRODUCT.md` |
| Color, tipo, radio (4px builders; 12/16 chrome), layout, elevación, componentes visuales, do/don't | `DESIGN.md` |
| Tokens machine-readable | `.impeccable/design.json` |
| Temas runtime | `src/app/defaults/themes.ts` |
| Tokens CSS / `@theme` | `src/app/globals.css` |
| Skill Impeccable (polish, audit, live, craft) | `.cursor/skills/impeccable/SKILL.md` |
| image-studio (dominio, popups, canvas) | `PRODUCT.md` → Capabilities + `src/views/image-studio/` |

Tras UI nueva: lee `DESIGN.md` (no lo pegues) y corre `/polish`. `/audit` si hay a11y o layout roto.

## Arquitectura

- App Router delgado en `src/app`. Páginas en `src/views/{view}/`. Chrome: `(pixis)` + `src/views/pixis`.
- Alias: `@app/*`, `@common/*`, `@features/*`, `@views/*`, `@editor/*`, `@code/*`. Prohibido `../../../`.
- `src/shared` es legado. No añadas arquitectura ahí.
- pnpm `@10.18.3`. Sin Sass. Zustand (cliente serializable) + TanStack Query (servidor). Instancias DOM/Monaco fuera del store.

## `src/common`

| Carpeta | Qué va | Qué no |
| --- | --- | --- |
| `components/` | **Todo** componente reutilizable de la app (Button, Input, Typography, UnsplashPicker, monaco, …) | Controles de un solo view |
| `core/` | Integraciones de API: service + query + types. El `index` exporta types y queries, nunca el service | UI, stores de view |
| `hooks/` | Hooks **globales** de verdad (app-wide) | Wrappers de un `useState`, adapters de un solo call site, reexports de `lib` |
| `lib/` | Utilidades de librería (ver abajo) | Componentes React de chrome |
| `utils/` | Puros (`cn`) | |
| `constants/` | p.ej. `APP_Z_INDEX` | |

No crees `src/common/ui`. Lo que estaba ahí vive en `components/`.

### `components/`

Un folder por componente (`Button/index.tsx`). Reutiliza; no clones. Lista y anatomía visual: `DESIGN.md` → Components.

Monaco (fuentes, language-meta, setup): `src/common/components/monaco`.

### `core/`

APIs actuales: `photos`, `frames`, `wallpapers`. Patrón: `{feature}.service.ts` + `{feature}.query.ts` + `{feature}.type.ts`. Views consumen el query, no el service.

### `hooks/`

Solo hooks usados en varios features y que no son un wrapper vacío. Si es de un view, va en ese view. Si es de una lib, se importa desde `lib/`.

### `lib/`

Ábrelos cuando hagan falta; no reinventes:

| Módulo | Uso |
| --- | --- |
| `arrow` | Apache Arrow: datos pesados en columnar |
| `client-worker` | API corta para workers (`useWorker`, `useSingletonWorker`, `BaseWorker`) |
| `fflate` | Compresión |
| `idle-timer` | Usuario inactivo |
| `jose` | Cifrar / firmar |
| `snapdom` | Capturas DOM → imagen (`DomCapture`) |

## Código

Rápido, sin duplicar. Extrae a `components/` o al `shared/` del dominio si se usa dos veces.

- Sin comentarios de implementación.
- JSDoc **español** solo encima de componentes o funciones **reutilizables**. No en interfaces ni métodos internos. Título, descripción, `@param` (tipo, qué hace, valores, default), `@returns`, `@example`.
- JSX: no ternarias. `{cond && <X />}` y `{!cond && <Y />}`.

## image-studio

Dominio-first. ShotEditor no importa stores de dominio. Stores en `Popups/{dominio}/store/`. Z-index: `src/common/constants/z-index.ts`. No crear `store/` / `fx/` / `hooks/` en la raíz de image-studio.
