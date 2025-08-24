# Theme System Specification (Concise)

Date: 2025-08-20
Scope: Contract for extending Open-Fiesta theme system.

## 1. Root Theme Config Keys
- mode: `light | dark`
- accent: `crimson | emerald | blue | purple | black`
- background: `gradient | minimal`
- font: `geist | inter | mono | poppins`
- badgePair: string key (defined in `badgeSystem.ts`)
- chatInputStyle: `default | frosty`

## 2. Generated Root Classes
Applied to `<html>` (or preview element):
- Mode: `light` / `dark`
- Accent: `accent-{accent}`
- Font: `font-{font}`
- Background: `bg-{background}-theme` (currently `gradient` or `minimal`)
- Chat Input Variant: `chatinput-{chatInputStyle}`

Example combined: `dark accent-crimson font-geist bg-gradient-theme chatinput-default`

## 3. CSS Custom Properties (Stable Contract)
Accent:
- `--accent-primary`
- `--accent-secondary`
- `--accent-tertiary`
- `--accent-bg-primary`
- `--accent-bg-secondary`

Font:
- `--font-primary`
- `--font-secondary`

Background:
- `--background-pattern` (gradient or minimal surface definition)

Badges (dynamic via selected pair):
- `--badge-pro-bg`
- `--badge-pro-border`
- `--badge-pro-glow`
- `--badge-free-bg`
- `--badge-free-border`
- `--badge-free-glow`

(If adding new badge variables keep prefix `--badge-{role}-`)

Chat Input (class-scoped styles, no dedicated variables yet) rely on structure classes:
- `.chat-input-shell`
- Variant wrappers: `.chatinput-default .chat-input-shell`, `.chatinput-frosty .chat-input-shell`

## 4. Extension Guidelines
Adding Accent:
1. Add entry in `ACCENT_COLORS` with keys: primary, secondary, tertiary, background.primary, background.secondary, gradient.light, gradient.dark.
2. Run contrast helper (dev console) to ensure ≥ 4.5:1 vs white & black.
3. No additional CSS needed; variables injected automatically.

Adding Font:
1. Extend `FONT_FAMILIES` with `primary`, optional `secondary`, optional `googleFont` name.
2. Font loads non-blocking if `googleFont` provided.

Adding Background Variant (if needed):
1. Add identifier to `BACKGROUND_STYLES` (keep naming `gradient | minimal` semantics consistent).
2. Provide pattern generator or static value; update switch logic if necessary.
3. Implement corresponding class (e.g., `.bg-newstyle-theme`) in global CSS.

Adding Badge Pair:
1. Define pair in `badgeSystem.ts` map returning color tokens (bg, border, glow) for pro & free.
2. Variables auto-applied (`generateBadgeVariables`).

## 5. JS Utility Functions (Public Usage)
From `themeUtils.ts`:
- `applyTheme(config)` – Apply classes + variables.
- `generateThemeClasses(config)` – Class array (pure).
- `updateCSSVariables(config)` – Variables only.
- `loadTheme()` / `saveTheme(config)` – Persistence.
- `withThemeTransition(cb, ms)` – Temporary transition wrapper.
- Accessibility helpers: `contrastRatio(a,b)`, `evaluateAccentContrast(accent)`, dev logging via `logAccentContrastIfLow`.

## 6. Do / Don’t
Do:
- Preserve existing variable names for backwards compatibility.
- Validate new accents with contrast helper.
- Keep new classes prefixed distinctly (`accent-`, `bg-`, `font-`, `chatinput-`).

Don’t:
- Overload variable meaning (never repurpose `--accent-primary`).
- Introduce per-component hard-coded accent colors; use variables instead.
- Add background variants without verifying performance (paint complexity).

## 7. Versioning & Stability
- Breaking changes (renaming/removing variables) require migration note in this file.
- New non-breaking variables allowed; document in section 3.1 (append below).

### 3.1 Additional Variables (Future Reserved)
(Empty)

## 8. Testing Suggestions
- Snapshot `generateThemeClasses(defaultTheme)` to lock class contract.
- Quick runtime check: iterate accents & log `contrastRatio` outputs.

## 9. Future Considerations
- Optional: Introduce semantic tokens for elevation (`--surface-*`).
- Optional: Chat input surfaces could adopt variables for parity.

---
Stable contract ready for contributors.
