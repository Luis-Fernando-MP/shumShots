---
name: PIXIS
description: Themeable studio chrome around a composed code or image shot.
colors:
  aurora-paper: "rgb(245, 245, 250)"
  aurora-panel: "rgb(230, 235, 250)"
  aurora-muted: "rgb(210, 220, 240)"
  ink-navy: "rgb(20, 20, 40)"
  ink-slate: "rgb(60, 90, 130)"
  rose-accent: "rgb(255, 100, 150)"
  mauve-secondary: "rgb(200, 150, 180)"
  mist-border: "rgb(180, 183, 200)"
  on-accent: "rgb(255, 255, 255)"
  success: "rgb(5, 150, 105)"
  warning: "rgb(180, 100, 10)"
  error: "rgb(200, 40, 70)"
  info: "rgb(2, 120, 190)"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "normal"
  headline:
    fontFamily: "Plus Jakarta Sans, Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  title:
    fontFamily: "Plus Jakarta Sans, Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.444
  body:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.429
  label:
    fontFamily: "Plus Jakarta Sans, Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  sm: "0.625rem"
  md: "0.875rem"
  radius: "1.25rem"
  lg: "1.625rem"
spacing:
  grid-sm: "0.46875rem"
  grid-md: "0.75rem"
  grid: "0.9375rem"
  grid-lg: "1.40625rem"
  grid-xl: "1.875rem"
components:
  button-primary:
    backgroundColor: "{colors.rose-accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.radius}"
    padding: "0 1rem"
    height: "2.5rem"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "color-mix(in srgb, rgb(255, 100, 150) 90%, transparent)"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.radius}"
    height: "2.5rem"
  button-secondary:
    backgroundColor: "{colors.aurora-panel}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.radius}"
    padding: "0 1rem"
    height: "2.5rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.radius}"
    height: "2.5rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.radius}"
    height: "2.5rem"
  input-soft:
    backgroundColor: "{colors.aurora-panel}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    height: "2.25rem"
    padding: "0 0.75rem"
  chip-default:
    backgroundColor: "color-mix(in srgb, rgb(210, 220, 240) 50%, transparent)"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    height: "1.75rem"
    padding: "0 0.5rem"
---

# Design System: PIXIS

## Overview

**Creative North Star: "The Aurora Console"** [inferred from default theme **Aurora Day** and Operate-mode studio chrome]

PIXIS chrome is a quiet workbench around a loud artifact. The board — a Monaco snippet or a picture canvas — is the photograph. Header, detail bar, main bar, and popups are the console: dense, tokenized, and willing to disappear when a theme swap repaints every semantic slot.

The default look is cool pale paper with a rose accent used like a recording-studio tally light: present, rare, never a wash. Users can replace the entire palette (`THEMES` in `src/app/defaults/themes.ts`); the system is the token graph, not a single hex. SSR `:root` is a near-black fallback until the persisted theme hydrates — do not treat that dark fallback as the brand.

**Key Characteristics:**
- Semantic CSS variables (`bg-primary`, `tn-primary`, `gap-grid`, `rounded-radius`) are the only legal color/space/radius source for new UI.
- Display type (Plus Jakarta Sans) for titles; Geist Sans for body and controls.
- Soft, large radii on actions; slightly tighter radii on fields and chips.
- Tonal layering for depth; shadows reserved for floating layers.
- Studio is full-viewport; the composed shot, not the marketing shell, sets the mood.

## Colors

Default documented palette is **Aurora Day** (persisted `app-theme`). Roles remap when the user picks another theme. Values below are `rgb()` triplets — the project's canonical format.

### Primary
- **Rose Accent** (`rgb(255, 100, 150)` / `--tn-primary` → `bg-primary`, `text-primary`, `outline-primary`): tally-light for primary actions, focus rings, selection highlight, and rare emphasis. Not a page fill.

### Secondary
- **Mauve Secondary** (`rgb(200, 150, 180)` / `--tn-secondary` → `bg-secondary`): companion accent (ambient glow in the pixis layout, chip secondary). Keep quieter than rose.

### Neutral
- **Aurora Paper** (`rgb(245, 245, 250)` / `--bg-primary` → `background`): app ground.
- **Aurora Panel** (`rgb(230, 235, 250)` / `--bg-secondary` → `card`): raised chrome, popovers, secondary buttons.
- **Aurora Muted** (`rgb(210, 220, 240)` / `--bg-tertiary` → `muted`): pressed/hover wells, solid inputs.
- **Ink Navy** (`rgb(20, 20, 40)` / `--fnt-primary` → `foreground`): primary text.
- **Ink Slate** (`rgb(60, 90, 130)` / `--fnt-secondary` → `muted-foreground`): secondary copy, placeholders, captions.
- **Mist Border** (`rgb(180, 183, 200)` / `--tn-border` → `border`): hairlines; mixed from panel toward ink, not a raw gray.

### Status
- **Success** `rgb(5, 150, 105)` · **Warning** `rgb(180, 100, 10)` · **Error** `rgb(200, 40, 70)` · **Info** `rgb(2, 120, 190)` — light-theme status set. Dark themes swap to the `STATUS_DARK` set in `themes.ts`.

**The Semantic Slot Rule.** Paint with Tailwind theme utilities (`bg-primary`, `text-foreground`, `border-border`, `bg-card`) or `rgb(var(--token))`. Never introduce `rpx-*` tokens, hardcoded hex in new product UI, or a second palette that ignores `data-theme`.

**The Tally-Light Rule.** Rose (or whichever `--tn-primary` the active theme provides) occupies a small fraction of chrome. The board may be vivid; the console stays tonal.

## Typography

**Display Font:** Plus Jakarta Sans (500/600/700) with Geist Sans fallback  
**Body Font:** Geist Sans  
**Mono Font:** Monaco editor family (`--monaco-font-family`) — code-studio only; do not use as UI chrome.

**Character:** Jakarta is slightly geometric and titled; Geist is the working sans. Titles sit on display; controls and body stay on Geist so the console reads as a tool, not a poster.

### Hierarchy

Mapped from `Typography` (`src/common/ui/Typography`) and `@theme` type scale:

- **Display / Title** (`2xl` / 1.5rem / bold / display): page or popup titles (`Typography.Title`).
- **Headline / Subtitle** (`xl` / 1.25rem / semibold / display): section titles.
- **Title / Heading** (`lg` / 1.125rem / semibold / display): mid-level headings.
- **Label** (`md` / 1rem / semibold / display): block titles, often prefixed `#` in `Typography.Block`.
- **Body** (`sm` / 0.875rem / regular / sans): default copy and button text.
- **Small** (`xs` / 0.75rem / regular / muted): captions, tooltips, fine print.

Links use `text-primary` with a wavy primary underline (`mark: wavy`). Precaution notes use a dotted primary underline.

**The Type-Scale Rule.** Use `text-xs` … `text-xl` / `Typography` `size`. Do not invent fixed `px` font sizes in product UI.

## Layout

Full-viewport studio. `body` is `min-height: 100dvh`, `overflow: hidden`, `antialiased`. Shared `(pixis)` chrome: HeaderBar centered top, DetailBar top-left, MainBar as the operating strip. A large blurred primary→secondary orb sits behind the board as ambient wash (`blur-[250px]`).

Spacing rhythm is `--space-grid` (0.9375rem) exposed as `gap-grid`, `gap-grid-sm` … `gap-grid-xl`. Prefer those over ad-hoc gaps.

Popups and section stacks are compact and vertical. Image-studio targeting uses the compound Tabs API; active-layer controls live in `Tabs.Content` only.

The composed board scales with `translate3d` + `scale`. Canvas stacking order is `APP_Z_INDEX` (`src/common/constants/z-index.ts`): background 0 → slots 10 → vignette 20 → lightAbove 30 → mainBar 40.

No separate marketing breakpoint system is defined for the studio; it is a desktop operate surface. Do not silently invent a mobile marketing grid.

## Elevation & Depth

Chrome is **tonal, not skeuomorphic**. Resting surfaces are flat fills (`background` / `card` / `muted`) plus a 1px `border`. Depth comes from contrast between paper and panel, not drop shadows.

Shadows appear only on floating layers:

- **Thumb** (`shadow-sm`): switch thumb, color-picker trigger.
- **Float** (`shadow-md`): popover (`rounded-radius`, `p-3`).
- **Overlay** (`shadow-lg`): select menu.

Ambient studio glow is a large blurred orb in the layout, not a card shadow. Canvas lights, vignettes, and slot shadows belong to the **shot**, not to chrome — they may be dramatic; do not copy them onto buttons or bars.

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows are a response to floating (popover, menu), never a default on cards or bars.

## Shapes

`--radius: 1.25rem` is the canonical corner. Tailwind: `rounded-radius` (buttons, popovers), `rounded-md` (inputs, chips, ~0.875rem), `rounded-sm` (tiny hit targets). `rounded-lg` is the oversized step (1.625rem) — use sparingly.

Buttons are pill-ish (`rounded-radius` + fixed height). Fields are slightly squarer (`rounded-md`) so the console doesn't look like a bag of pills. Chips match fields.

Focus: `outline-2 outline-offset-2 outline-primary` on buttons. Inputs use `focus-within:border-primary` (or status color), not a glow.

**The No-Glow-Chrome Rule.** Glow, gradient text, and heavy shadows are for the composed shot (lights, vignette, board). Chrome uses borders and tonal fills.

## Components

Use `@common/ui` primitives. Do not restyle a one-off button when `Button` / `Input` / `Chip` / `Typography` already cover the case.

### Buttons
- **Shape:** `rounded-radius`, `text-sm font-medium`, heights `h-8` / `h-10` / `h-12`.
- **Primary:** `bg-primary text-primary-foreground`; hover `bg-primary/90`.
- **Secondary:** `bg-card text-foreground`; hover `bg-muted`.
- **Ghost:** transparent; hover `bg-muted/70`.
- **Outline:** `border-border`; hover `bg-muted/70`.
- **Focus:** 2px primary outline, 2px offset. Disabled: `opacity-50`, no pointer.

### Chips
- Default: muted wash + `border-border`, `rounded-md`, `text-xs font-medium`, `h-7`.
- Primary: `bg-primary/10 border-primary/40` — selected/filter, not a second primary button.
- Optional remove control uses a 12px icon, muted until hover.

### Cards / Containers
- Popover: `bg-card border-border rounded-radius p-3 shadow-md`.
- Select menu: `bg-card border rounded-md shadow-lg`.
- About and domain popups use the shared `Popup` shell; keep internal rhythm on `gap-grid*`.

### Inputs / Fields
- Default variant **soft**: `bg-card`, transparent border, `rounded-md`, `h-9`, `text-sm`.
- Focus: border becomes `border-border` (soft) or `border-primary` (outline).
- Status variants tint background and border with semantic success/warning/error/info.
- Suffix chips sit inside the field (`bg-muted`, `rounded-md`).

### Navigation
- HeaderBar / DetailBar / MainBar: icon-forward, ghost buttons, tooltips. Absolute overlay on the board, not a boxed app nav.
- Tooltip: `bg-card`, `border-primary/30`, `rounded-md`, `text-xs`.

### Signature: Theme + Board
- **ThemeController** rewrites every `--bg-*` / `--tn-*` / `--fnt-*` / `--semantic-*` on `<html>`. New UI must survive that rewrite.
- **Board** (code window or picture canvas) is the visual hero. Super-sampled 3D slots, vignette, and lights are shot craft — document them in domain code, not as chrome tokens.

## Do's and Don'ts

### Do:
- **Do** use `bg-primary`, `text-foreground`, `rounded-radius`, `gap-grid` (and siblings) for new chrome.
- **Do** put titles on `font-display` / `Typography.Title|Subtitle|Heading` and body on Geist / `text-sm`.
- **Do** keep Operate density: compact controls, Spanish labels, tooltips on icon-only hits.
- **Do** treat image-studio canvas effects (vignette, lights, 3D) as the artifact; keep chrome quieter than the board.
- **Do** honor `APP_Z_INDEX` instead of inventing new stacking numbers.

### Don't:
- **Don't** add Sass/SCSS or `rpx-*` tokens.
- **Don't** hardcode a palette that breaks when the user leaves Aurora Day.
- **Don't** put glow shadows, gradient text, or glassmorphism on studio chrome.
- **Don't** use arbitrary `px` type or `rounded-[var(--radius)]` / `bg-[rgb(var(--…))]` when a theme utility exists.
- **Don't** import domain stores into ShotEditor or fork a second design language for code-studio vs image-studio.
- **Don't** fabricate testimonials, customers, or brand photography.
