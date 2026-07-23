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

## API core

- Put every API-backed domain in `src/common/core/{feature-name}/`, using kebab-case matching the view and URL segment.
- Each feature has `{feature}.service.ts`, `{feature}.query.ts`, `{feature}.type.ts`, and `index.ts`.
- `index.ts` exports only types and query hooks. Never export services.
- Queries call services internally. Views must consume public query objects and invalidate hooks, never a service or query client directly.
- Type endpoint contracts as `input`, `output`, and `mapped`. API DTOs use snake_case; UI models use camelCase; map them in one-pass mappers.
- Export query keys and `useInvalidate{Feature}Query` for each new API feature.
- For a sub-resource, ask whether to use the default nested layout or explicit flat sibling features before adding files.
- A brief `// TODO:` is allowed only when an API URL or HTTP instance is unknown. Do not invent an API contract.

## UI and themes

- Use standard `common/ui` controls for buttons, inputs, numbers, toggles, tooltips, and typography.
- Prefer type-scale tokens (`text-xs` … `text-xl` / Typography `size`) over fixed `px` font sizes.
- New UI must use semantic PIXIS tokens and support `data-theme`; do not introduce `rpx-*` tokens.
- Application themes live only in `src/app/defaults` (e.g. `themes.ts`). Monaco syntax themes stay under `src/shared/themes/` and remain independent.
- Prefer Tailwind theme utilities (`rounded-radius`, `gap-grid`, `bg-primary`, `text-foreground`) declared in `@theme`. Do not use arbitrary `rounded-[var(--radius)]` / `bg-[rgb(var(--…))]` class forms.
- Use Radix primitives through common UI wrappers where a primitive is required.
- Sass/SCSS is forbidden and removed. Use Tailwind v4 utilities, global CSS tokens, and Shadcn/Radix primitives only.

## State and async data

- Use Zustand for client-side feature state. Persist only serializable state and version persisted schemas.
- Use TanStack Query for server state. Do not duplicate server data in Zustand.
- Keep Fabric, Monaco, DOM, and other non-serializable instances outside Zustand state.

## Tooling and verification

- Use pnpm only. The repository pins `pnpm@10.18.3`; do not use npm, yarn, or bun.
- Use `pnpm add`, `pnpm remove`, `pnpm install`, and `pnpm exec`.
- Do not run `pnpm store prune` unless explicitly requested.
- Run focused type checks, lint checks, and relevant tests after changes.
- Existing legacy errors under `src/app/v1`, broken `(pages)` imports, and `tmp` are baseline debt. Do not mask them with `any`, `@ts-ignore`, or broad TypeScript exclusions.
- Never reintroduce `sass`, SCSS files, `@sass/*`, or Stylelint SCSS configs.
