# PIXIS Engineering Guide

## Product and architecture

- PIXIS has two product features: `code-studio` and `image-studio`.
- Keep `src/app` limited to App Router files: root layout, route-group layouts, thin `page.tsx` adapters, route handlers, metadata, and globals.
- Put page compositions in `src/views/{view}/`. Route pages only import and render a view.
- Shared studio chrome for `/` and `/editor` lives under the `(pixis)` route group layout (`src/app/(pixis)/layout.tsx` + `src/views/pixis`).
- Place feature-specific domain modules (hooks, Zustand stores, schemas, local services) with their view or later in `src/features/{feature}/`.
- Place cross-feature code in `src/common/`.
- Use `@app/*`, `@common/*`, `@features/*`, `@views/*`, and `@shared/*` aliases. Do not introduce `../../../` imports.
- `src/shared` is transitional legacy code. Do not add new product architecture there.

## Common

- `src/common/ui` contains reusable, black-box UI primitives.
- `src/common/components` contains reusable composed components.
- `src/common/lib` contains framework-independent infrastructure and helpers.
- `src/common/utils` contains pure utility functions.
- `src/common/styles`, `config`, and `providers` own shared tokens, configuration, and providers.
- Add concise, accurate JSDoc only to public `common` APIs. Do not add implementation comments.

### `core` → `@repo/common/core`

Feature-level **services** (API calls) and **React Query hooks**, organized per feature, reusable from any app.

---

## `core` — feature structure (target)

Every new API-backed feature gets a folder under `packages/common/src/core/`:

```
core/
  {feature}/
    {feature}.service.ts
    {feature}.query.ts
    {feature}.type.ts
    index.ts                    # exports types + queries only — never services
    types/
      {sub-resource}/
        index.ts
        {sub-resource}.input.ts
        {sub-resource}.output.ts
        {sub-resource}.mapped.ts
    mappers/
      {sub-resource}.mapper.ts
```

**`index.ts` (mandatory):** every module exports its public surface from here — re-export `{feature}.type.ts` and `{feature}.query.ts` only. **Do not** export services; views and other packages consume the query hooks, which call the service internally.

```ts
export * from './demand-events.type'
export * from './demand-events.query'
```

**Nested child modules:** when a sub-resource lives inside a parent feature (Option A), the **parent** `index.ts` re-exports the whole child module:

```ts
export * from './demand-events'
```

Export the top-level feature from `packages/common/src/core/index.ts`. Consume from views:

```ts
import { resourceRestrictionsQuery } from '@repo/common/core'
```

### View + core together

When adding a view in shell, logistics, or mgment:

1. **View UI** — `apps/{app}/src/views/{feature-name}/` (`index.tsx`, `components/`, optional `store/`, `hooks/`)
2. **Domain layer** — matching folder in `packages/common/src/core/` (see naming below)
3. **Shell route** — `apps/rpx-front-shell/src/app/(dashboard)/(rpx-front-*)/{route}/page.tsx`

**Verified view examples:** `resource-restrictions`, `availability-providers`, `purchasing-planning`, `demand-plan/demand-events`.

### Core folder naming (verified)

| View folder              | Core folder              | Notes                |
| ------------------------ | ------------------------ | -------------------- |
| `resource-restrictions`  | `resource-restrictions`  | Target kebab-case    |
| `availability-providers` | `availability-providers` | Target kebab-case    |
| `purchasing-planning`    | `purchasingPlanning`     | Legacy camelCase     |
| `notifications`          | `notification`           | Legacy singular      |
| `uploading-files`        | `data-load`              | Legacy rename        |
| `user-list`              | `auth/`                  | Legacy domain folder |

**Going forward:** kebab-case core folder matching the view folder and the URL segment. Legacy names stay until refactored.

### Nested vs flat sub-resources (target — ask before creating)

When a new endpoint hangs off an existing `core` resource (e.g. `GET /demand-events/{scenarioId}` while `core/demand-plan` already exists), **ask which convention to use** before creating files. Do not mix both styles within the same feature without explicit approval.

**Option A — Nested** (default; verified example: `demand-plan/demand-events/`):

```
core/demand-plan/
  demand-plan.service.ts
  demand-plan.query.ts
  demand-plan.type.ts
  index.ts
  demand-events/                    # mirrors URL segment
    demand-events.service.ts
    demand-events.query.ts
    demand-events.type.ts
    index.ts
    types/list/
    mappers/list.mapper.ts
```

**Option B — Flat siblings** (only when explicitly approved):

```
core/demand-plan/
core/demand-plan-events/
core/demand-plan-summary/
```

**Rules (both options):**

- Folder names must mirror **real URL segments**, never invented categories (`sub-resources/`, `root/`, etc.).
- File names do **not** repeat parent folder segments; TypeScript symbols (`DemandPlanTypes`, `DEMAND_PLAN_PREFIX`, `demandPlanQuery`) use the **full unique name** to avoid import collisions.

---

## `core` file templates (target)

### Naming convention

Keep names short, readable, and consistent across the whole feature. For every endpoint integration (`{feature}.service.ts`, `{feature}.query.ts`, `{feature}.type.ts`, files under `types/`, files under `mappers/`), avoid stacking the full parent path into every identifier and file name — the folder path already provides that context.

**Export keys** (service object, query object, `{FEATURE}_KEYS`, type map entry) stay **short** and mirror the endpoint (`list`, `providers`, `details`). Example: `demandPlanDemandEventsQuery.list`, `DEMAND_PLAN_EVENTS_KEYS.list`, `DemandPlanEventsTypes['list']`.

**Internal function names** use a descriptive `get` / `useGet` prefix plus the full module symbol to avoid collisions in nested layouts:

| Layer      | Internal name            | Exported as                          |
| ---------- | ------------------------ | ------------------------------------ |
| Service    | `getDemandPlanEvents`    | `demandPlanDemandEventsService.list` |
| Query hook | `useGetDemandPlanEvents` | `demandPlanDemandEventsQuery.list`   |

The query hook name is always the service function name with `use` prepended. The **exported key** remains the short endpoint name (`list`), not `getDemandPlanEvents`.

Within a single feature, the **same short key** must be reused across the service export, query key, query export, and type entry — never mix `list` in one file and `getList` or `eventsList` in another.

This applies to both nested and flat sub-resource layouts.

**Verified reference — `demand-plan/demand-events` (target for all new nested modules):**

| Layer             | Pattern                                                                               |
| ----------------- | ------------------------------------------------------------------------------------- |
| `index.ts`        | `export *` from `.type` + `.query` only                                               |
| Parent `index.ts` | `export * from './demand-events'`                                                     |
| Type map          | `DemandPlanEventsTypes['list']` with `OutputResponseService` on `output` and `mapped` |
| `list.output.ts`  | row interfaces + `export type ListOutput = DemandEventOutput[]`                       |
| `list.mapped.ts`  | row interfaces + `export type ListMapped = DemandEvent[]`                             |
| Mapper input      | `ListOutput` (the `data` array type, not the full response)                           |
| Service return    | `{ ...body, data: mapped }` after separate `body` cast + `listMapper(body.data)`      |

**Legacy divergence in `resource-restrictions` (verified):** the snippets below are the **target** pattern for all **new** features. The existing `resource-restrictions` core folder partially matches but has not been migrated:

| Layer              | Target (templates below)                      | Legacy `resource-restrictions` today                               |
| ------------------ | --------------------------------------------- | ------------------------------------------------------------------ |
| Service export key | `providers`                                   | `providers` (matches)                                              |
| Service function   | `providers`                                   | `getProviders`                                                     |
| Query export key   | `providers`                                   | `data` → `useGetGeneralResourceRestrictions` (`useQueries` bundle) |
| Query key          | `providers`                                   | `providers` in `RESOURCE_RESTRICTIONS_KEYS` (matches)              |
| Type entry         | `providers`                                   | `providers` (matches)                                              |
| Types folder       | `types/providers/` + `.input/.output/.mapped` | `types/provider/` with `providerModel.output.ts` only              |
| Mapper file        | `providers.mapper.ts`                         | `getProvidersMapper.ts`                                            |
| Invalidate hook    | `useInvalidateResourceRestrictionsQuery`      | not implemented                                                    |

The endpoint URL (`/providers/restrictions/list-resource-details`) and `ResourceRestrictionsTypes['providers']` types are verified against the indexed graph and filesystem.

### `{feature}.query.ts`

- Define `{FEATURE}_KEYS` (`as const`). Nested modules under a parent reuse the parent's prefix in keys (e.g. `[DEMAND_PLAN_PREFIX, 'demand-events']`).
- One hook per API method; pick `useQuery`, `useMutation`, `useInfiniteQuery`, or `useQueries` based on the endpoint.
- Name each hook `useGet{ModuleSymbol}` (e.g. `useGetDemandPlanEvents`). Export it under the **short endpoint key** in the query object (`list: useGetDemandPlanEvents`).
- Type every hook param and return against `{Feature}Types['{endpoint}']` via `DemandPlanEventsTypes['list']['input']`.
- Pull `companyId` from `useUserGlobalStore` when required.
- Export `{feature}Query` object grouping all hooks.
- **(mandatory for every new feature)** export `useInvalidate{FEATURE}Query` so components can invalidate cache without importing `queryClient` directly.

Target pattern (verified in `demand-plan/demand-events`):

```ts
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useUserGlobalStore } from '../../../store'
import { DEMAND_PLAN_PREFIX } from '../scenarios/scenarios.query'
import { demandPlanDemandEventsService } from './demand-events.service'
import type { DemandPlanEventsTypes } from './demand-events.type'

export const DEMAND_PLAN_EVENTS_KEYS = {
  list: [DEMAND_PLAN_PREFIX, 'demand-events']
} as const

const useGetDemandPlanEvents = (params: DemandPlanEventsTypes['list']['input']) => {
  const companyId = useUserGlobalStore(s => s.user?.empresaid) ?? params.companyId

  const finalParams: DemandPlanEventsTypes['list']['input'] = {
    ...params,
    companyId: String(companyId ?? params.companyId ?? '')
  }

  return useQuery({
    queryKey: [...DEMAND_PLAN_EVENTS_KEYS.list, finalParams.scenarioId, finalParams.companyId],
    queryFn: () => demandPlanDemandEventsService.list(finalParams),
    enabled: !!finalParams.scenarioId && !!finalParams.companyId
  })
}

export const useInvalidateDemandPlanEventsQuery = () => {
  const queryClient = useQueryClient()

  return {
    list: () => queryClient.invalidateQueries({ queryKey: DEMAND_PLAN_EVENTS_KEYS.list })
  }
}

export const demandPlanDemandEventsQuery = {
  list: useGetDemandPlanEvents
}
```

Legacy top-level pattern (`resource-restrictions`) — export key `providers`, internal name `providers` (not yet migrated to `useGet*` naming):

```ts
const providers = (params: ResourceRestrictionsTypes['providers']['input']) => {
  // ...
}

export const resourceRestrictionsQuery = { providers }
```

### `{feature}.type.ts`

Central map of `input` / `output` / `mapped` per endpoint. **`output` and `mapped` always wrap the payload in `OutputResponseService<T>`** from `../../common/output.service`, where `T` is the clean array or row type defined under `types/`.

```ts
import { OutputResponseService } from '../../common/output.service'
import type { DemandEvent, ListInput, ListMapped, ListOutput } from './types/list'

export type DemandPlanEventsTypes = {
  list: {
    input: ListInput
    output: OutputResponseService<ListOutput>
    mapped: OutputResponseService<ListMapped>
  }
}

export type { DemandEvent }
```

Default-export pattern (`export default {FEATURE}Types`) is acceptable when preferred; existing features use named exports.

### `types/{sub-resource}/`

Per-endpoint type files (target layout). Legacy features may use only `.output.ts` or flat `.type.ts` files — align to the three-file pattern when touching them.

```
types/list/
  index.ts
  list.input.ts
  list.output.ts
  list.mapped.ts
```

**`list.output.ts`** — API row interfaces (Spanish/snake_case field names) plus a clean collection alias:

```ts
export interface DemandEventOutput {
  eventodemandaid: number
  nombre: string
  // ...
}

export type ListOutput = DemandEventOutput[]
```

**`list.mapped.ts`** — frontend row interfaces (English/camelCase) plus a clean collection alias:

```ts
export interface DemandEvent {
  id: number
  name: string
  // ...
}

export type ListMapped = DemandEvent[]
```

### `{feature}.service.ts`

- Use the correct Axios instance for the endpoint domain (`configApi`, `logisticsApi`, etc.) with `{ use: 'v1' }` / `{ use: 'v2' }` as appropriate.
- Name each function `get{ModuleSymbol}` (e.g. `getDemandPlanEvents`). Export under the **short endpoint key** (`list: getDemandPlanEvents`).
- Cast the raw response, map `body.data` in a separate step, then return `{ ...body, data: mapped }` so envelope fields (`success`, `message`, `statusCode`) pass through unchanged.
- **Do not** export the service from the module `index.ts` — only the query layer calls it.

```ts
const getDemandPlanEvents = async (
  params: DemandPlanEventsTypes['list']['input']
): Promise<DemandPlanEventsTypes['list']['mapped']> => {
  const response = await configApi.get(`/company/${params.companyId}/demand-events/${params.scenarioId}`, { use: 'v2' })

  const body = response.data as DemandPlanEventsTypes['list']['output']
  const mapped = listMapper(body.data ?? [])

  return {
    ...body,
    data: mapped
  }
}

export const demandPlanDemandEventsService = { list: getDemandPlanEvents }
```

If the Axios instance or URL is unknown, leave a `// TODO:` comment — do not guess.

### `mappers/{sub-resource}.mapper.ts`

- Receive the **collection type** from `types/` (e.g. `ListOutput`), not the full `OutputResponseService`.
- Map `output` → `mapped` in **one pass** over the array.
- Export a default function.

```ts
import type { DemandEvent, ListOutput } from '../types/list'

const listMapper = (data: ListOutput): DemandEvent[] =>
  data.map(item => ({
    id: item.eventodemandaid,
    name: item.nombre
    // ...
  }))

export default listMapper
```

## UI and themes

- Use standard `common/ui` controls for buttons, inputs, numbers, toggles, tooltips, and typography.
- Prefer type-scale tokens (`text-xs` … `text-xl` / Typography `size`) over fixed `px` font sizes.
- New UI must use semantic PIXIS tokens and support `data-theme`; do not introduce `rpx-*` tokens.
- Application themes live only in `src/app/defaults` (e.g. `themes.ts`). Monaco syntax themes stay under `src/shared/themes/` and remain independent.
- Prefer Tailwind theme utilities (`rounded-radius`, `gap-grid`, `bg-primary`, `text-foreground`) declared in `@theme`. Do not use arbitrary `rounded-[var(--radius)]` / `bg-[rgb(var(--…))]` class forms.
- Use Radix primitives through common UI wrappers where a primitive is required.
- Sass/SCSS is forbidden and removed. Use Tailwind v4 utilities, global CSS tokens, and Shadcn/Radix primitives only.

## State and async data

- Use Zustand for client-side feature state. Persist only serializable state.
- Use TanStack Query for server state. Do not duplicate server data in Zustand.
- Keep Fabric, Monaco, DOM, and other non-serializable instances outside Zustand state.

## Tooling and verification

- Use pnpm only. The repository pins `pnpm@10.18.3`; do not use npm, yarn, or bun.
- Use `pnpm add`, `pnpm remove`, `pnpm install`, and `pnpm exec`.
- Do not run `pnpm store prune` unless explicitly requested.
- Run focused type checks, lint checks, and relevant tests after changes.
- Existing legacy errors under `src/app/v1`, broken `(pages)` imports, and `tmp` are baseline debt. Do not mask them with `any`, `@ts-ignore`, or broad TypeScript exclusions.
- Never reintroduce `sass`, SCSS files, `@sass/*`, or Stylelint SCSS configs.

## image-studio

Architecture is **domain-first** under `src/views/image-studio/`.

### Top-level layout

```
image-studio/
  index.tsx
  constants.ts
  types/                    # SectionBuilder, PresetBuilder (default export)
  components/               # chrome only: ShotEditor, MainBarOptions, PersistGate, DeviceFramePresets
  canvas/
    BackgroundCanvas/       # owns Background + CanvasBorder + Canvas/Light side-effects
    PictureCanvas/          # owns Frame, ShadowLight, Corner, ImagesCount, SlotSize side-effects
  Popups/
    common/
      components/           # SectionBlock, PresetCard, tabs, border/{radius,style,color,size,mat}, …
      presets/              # shared catalogs composed by domains (e.g. light)
      sections/             # shared SECTIONS fragments for compose (`...BORDER_SECTIONS`)
      lib/                  # small cross-preset helpers (e.g. fx-shared targeting/math)
    Canvas/                 # affects BackgroundCanvas
      Background | CanvasBorder | Light
    CanvasImages/           # affects PictureCanvas
      ShadowLight | Frame | Corner | ImagesCount | Layout | SlotSize
  utils/                    # pure cross-domain helpers only when truly shared
```

### Popup → canvas

- `Popups/Canvas/Background`, `CanvasBorder`, `Light` → `canvas/BackgroundCanvas` (+ `useBackgroundCanvasStore`).
- `Popups/CanvasImages/Frame`, `ShadowLight`, `Corner`, `ImagesCount`, `Layout`, `SlotSize` → `canvas/PictureCanvas` (+ picture hooks).
- `ShotEditor` only composes canvases / passes `parentRef`. **No domain store imports.**

### Domain folder shape

Every domain under `Popups/{Canvas|CanvasImages}/{Dominio}/`:

```
index.tsx                 # MainBar entry (Popup shell)
sections.ts               # SECTIONS satisfies SectionBuilder[]; component = Builder ref (no inline wrappers)
store/{dominio}/
  store.ts
  type.{dominio}.ts
  initialState.ts
  helpers/                # optional
  {substore}/             # optional microstores
builders/{Name}Builder/index.tsx
shared/                   # only reused inside this domain
presets/{name}/           # domain-local catalogs (shadow, positions, …)
```

TSX product files use `{Carpeta}/index.tsx` so they can grow `hooks/` / `utils/` later.

### `Popups/common` — compose, don’t duplicate

- `common/components/border/*` — prop-driven radius/style/color/size/mat UI used by CanvasBorder and Corner.
- `common/presets/light` — shared by `Canvas/Light` and `CanvasImages/ShadowLight` (`...LIGHT_PRESETS`).
- `common/sections` — optional arrays domains spread into local `SECTIONS` (`[...BORDER_SECTIONS, ...local]`).
- Positions presets live only under `CanvasImages/Layout/presets/positions` (not common).
- Frame templates / device frames stay in their domains (not common).

Prefer **TypeScript inference** + `satisfies SectionBuilder[]` / `PresetBuilder`. Avoid inventing extra type layers.

### Types

- `types/sections.types.ts` — `SectionBuilder` (`key`, `title`, `description`, `SectionIcon`, `component`).
- `types/presets.types.ts` — `PresetBuilder` (`key`, `Title`, `Description`, `Builder`, `Preview`).
- `component` / `Builder` / `Preview` are **direct references** executed in loops (not `() => <X />`).

### Tabs (multi-slot targeting)

- Compound API under `Popups/common/components/tabs/`.
- Active-layer controls live in `Tabs.Content` only.
- Scopes in `constants.ts` as `TABS_SCOPES`; store key `pixis:image-studio:tabs:{scope}`; `targetIds: []` = all slots.

### Stores

- Domain Zustand stores live **inside** `Popups/.../store/{dominio}/`, not a root `image-studio/store/`.
- Persist only serializable state. Prefer a stable `name` key; use `merge` (and optional shape-based `migrate`) for sanitizing rehydrated data — do **not** use Zustand persist `version` counters.
- Canvas hooks (not ShotEditor / MainBar parents) apply DOM/styles from those stores.
- MainBar may read a store only for chrome actions (e.g. Unsplash → setBackground).

### Fit + positions

- `constrainToParent` (default true) scales slots to ~90% of the background while keeping child aspect ratio.
- Position presets may overlap children (fan/stack); the group bbox still fits the parent.

### Do not create

- Root `store/`, `fx/`, `slotPositions/`, `hooks/`, or `*Configuration/` popups.
- Domain stores outside their Popups domain folder.
- Verbose duplicate border controllers — use `common/components/border/*` + compose sections.
- Large new type graphs when inference / `satisfies` is enough.

