# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

[inferred] People who need a shareable still of an interface or a code snippet: developers, designers, and makers documenting work or posting to social.

Confirmed: the product UI is Spanish (`html lang="es"`). Copy, labels, and chrome should stay in Spanish unless a surface is explicitly English.

## Product Purpose

PIXIS is a visual studio for professional stills of **code** and **UI**. Users compose a shot (background, frame, light, layout, export) and leave with a high-quality image.

Success is a finished export that looks intentional on first glance — not a general-purpose design tool.

## Positioning

Inspired by [Shots.so](https://shots.so), with a developer-facing difference: capture and style images **from a code source**, not only from uploaded screenshots. Open source. Built by SHUM Dev (Luis MP).

Two studios share one chrome:

- **code-studio** (`/`): Monaco editor as the subject; theme, font, and window chrome around the snippet.
- **image-studio** (`/editor`): canvas mockups — backgrounds, frames, lights, corners, multi-slot layout, device frames.

The composed board is the artifact. Studio chrome (header, detail bar, main bar, popups) exists to operate the board, not to compete with it.

## Operating Context

Desktop web app (`pnpm dev` → Next.js 15 + Turbopack). Full-viewport studio: `body` is `overflow: hidden`; the board zooms and pans.

Typical loop: pick a studio → place subject (code or images) → tune presets (background, frame, light, layout, size) → export.

Shared chrome lives under the `(pixis)` route group. Domain state for image-studio lives in popup stores; the canvases apply it. ShotEditor composes canvases and does not import domain stores.

## Capabilities and Constraints

Confirmed:

- Next.js 15 App Router, React 19, Tailwind v4, Zustand, TanStack Query, pnpm `@10.18.3`.
- Semantic PIXIS color tokens applied at runtime via `data-theme` and CSS variables (`src/app/defaults/themes.ts`). Default app theme: **Aurora Day**.
- Application themes live only in `src/app/defaults`. Monaco syntax themes stay under `src/shared/themes/` and are independent.
- New UI uses `@common/components` primitives and Tailwind theme utilities (`rounded-radius`, `gap-grid`, `bg-primary`). No Sass/SCSS. No `rpx-*` tokens. No `../../../` imports; use `@app/*`, `@common/*`, `@features/*`, `@views/*`, `@common/*`.
- `src/shared` is transitional legacy. Do not add new product architecture there.
- image-studio is domain-first under `src/views/image-studio/`. Popup domains own their Zustand stores. Canvas hooks apply DOM from those stores.
- Image slots: 1–5, position catalogs per count, optional 3D pose, Alt/Shift drag across the parent canvas.
- Export / capture via in-app capture utilities; remote images via Cloudinary.

Undecided (do not invent):

- Pricing, licensing beyond “open source”, target deploy host, analytics, accounts/auth product surface.
- Accessibility standard (WCAG target) — none recorded.
- `buildPath` for Impeccable new-work (comp-first vs code-first) — left unset.

## Brand Commitments

- **Name:** PIXIS (product). SHUM Dev (studio). Repo still carries the historical `shumShots` name.
- **Voice:** Spanish product chrome; short, operational labels. About copy is plain and factual.
- **Assets:** `/logo.webp`, `/opengraph.png`. Do not replace without an explicit rebrand.
- **Personality [inferred]:** precise studio tool, not a marketing landing. Brand shows up in token discipline and the quality of the exported shot.

## Evidence on Hand

- In-app About (`src/views/pixis/components/AboutShumShots`): purpose, Shots.so inspiration, open source, SHUM Dev.
- Metadata (`src/app/metadata.ts`): title PIXIS; description matching About.
- Logo and Open Graph image under `public/`.
- No testimonials, customer logos, benchmarks, or press quotes. Future work must not fabricate them.

## Product Principles

1. **The shot is the product.** Chrome recedes; the board (code window or picture canvas) is what the user came to make.
2. **Two studios, one language.** code-studio and image-studio share tokens, chrome, and type. Do not fork a second visual identity per studio.
3. **Presets over blank canvases.** Users compose from catalogs (positions, lights, frames, themes), then refine.
4. **Tokens survive themes.** Color, radius, and spacing go through semantic CSS variables so every `THEMES` palette works.
5. **Domain owns its state.** image-studio popup domains keep stores local; canvases apply; parents compose.

## Accessibility & Inclusion

No product-specific WCAG target was established. Confirmed: Spanish UI. Keyboard and contrast work should follow the incumbent `@common/components` controls (focus-visible rings on primary, disabled opacity) rather than inventing a new a11y system.
