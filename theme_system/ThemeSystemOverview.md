# Open Fiesta Theme System Overview

Date: 2025-08-20  
Status: Stable, polishing tasks pending (minor)

## 1. Purpose

A unified, extensible, and performant theming layer providing:

- Consistent visual identity (accent + background + fonts)
- Accessible contrast safeguards
- Variable-driven styling for badges, model chips, chat input variants
- Low-friction extension for new accents, badge pairs, fonts, backgrounds

## 2. Core Concepts

| Concept | Description | Source of Truth |
|---------|-------------|-----------------|
| ThemeConfig | Canonical theme state (mode, accent, font, background, badgePair, chatInputStyle) | `lib/themes.ts` |
| Root Classes | Deterministic class list applied to `<html>` | `generateThemeClasses` |
| CSS Variables | Stable contract consumed by components & utilities | `updateCSSVariables` |
| Accent System | Palette + gradient per accent + derived interaction tiers | `ACCENT_COLORS` |
| Background Styles | 2 consolidated variants mapping to classes | `BACKGROUND_STYLES` |
| Badge Pair System | Dual (pro/free) color token sets -> badges & model chips | `BADGE_PAIRS`, `badgeSystem.ts` |
| Persistence | LocalStorage load/save keyed by `ai-fiesta:theme` | `loadTheme`, `saveTheme` |
| Non-blocking Fonts | Fire-and-forget Google Fonts loader | `loadGoogleFont` |
| Contrast Helpers | WCAG ratio evaluation & dev logging | `contrastRatio`, `evaluateAccentContrast` |

## 3. Data Structures (Simplified)

```ts
interface ThemeConfig {
  mode: 'light' | 'dark';
  accent: 'crimson' | 'emerald' | 'blue' | 'purple' | 'black';
  font: 'geist' | 'inter' | 'mono' | 'poppins';
  background: 'gradient' | 'minimal';
  badgePair: 'red-gold' | 'purple-blue' | 'orange-yellow' | 'gold-green' | 'white-white';
  chatInputStyle?: 'default' | 'frosty';
}
```

Validation: `validateThemeConfig` coerces/guards partial input.

## 4. Theme Resolution Flow

1. Initialization:
   - Load stored config (`loadTheme`) or merge `initialTheme` with `DEFAULT_THEME`.
   - Validate, pre-load font (non-blocking), then apply classes + variables before first paint (`applyTheme`).
2. Runtime Updates:
   - Setters (`setAccent`, `setMode`, etc.) update state only; side-effects centralized in a single `useEffect` applying `applyTheme` + `saveTheme`.
3. Class Generation:
   - `generateThemeClasses(config)` returns `[mode, accent-*, font-*, bg-*-theme, chatinput-*]`.
4. Variable Update:
   - `updateCSSVariables` sets accent, font, background gradient (mode-adaptive), and badge pair tokens; accent gradients embed radial layering.
5. Persistence:
   - Every successful state change saved to LocalStorage.
6. Accessibility Logging (dev):
   - Accent contrast evaluated; warnings printed if < 4.5:1 against light or dark baseline.

## 5. Stable Class & Variable Contract

Classes (root `<html>`):

```text
light|dark
accent-{crimson|emerald|blue|purple|black}
font-{geist|inter|mono|poppins}
bg-{gradient|minimal}-theme
chatinput-{default|frosty}
```

Variables (minimum contract):

- Accent Core: `--accent-primary|secondary|tertiary|bg-primary|bg-secondary`
- Fonts: `--font-primary`, `--font-secondary`
- Background: `--background-pattern`
- Badges: `--badge-pro-*`, `--badge-free-*` (background / text / border / optional glow if provided)

Extended (internal but currently used):

`--accent-interactive-*`, `--accent-highlight-*`, `--accent-success|warning|error|info`, `--accent-glow-*`

## 6. Component Styling Patterns

- Components consume only variables & semantic classes (no hard-coded accent values).
- Model Chips & Toggles: Use badge pair variables; semantic types via `data-type="pro|free|..."` and `data-selected`.
- Chat Input Variants: Wrapper applies `chatinput-*`; inner `.chat-input-shell` picks variant styles. Remaining inline background cleanup is an open task.
- Fonts: Body font is enforced in dev for debugging; production relies on variable cascade.

## 7. Extension Recipes

### Add an Accent

1. Add to `ACCENT_COLORS` with: `primary`, `secondary`, `tertiary`, `background.primary|secondary`, `gradient.light|dark`.
2. Run `evaluateAccentContrast(accent)` (dev) to confirm >= 4.5 ratio vs black & white.
3. No further changes; classes & variables propagate automatically.

### Add a Font

1. Extend `FONT_FAMILIES` with ids + `primary`, optional `secondary`, optional `googleFont`.
2. Ensure fallback stack provided.
3. Loader picks it up automatically.

### Add a Background Style (if ever expanded)

1. Add entry to `BACKGROUND_STYLES` with unique `className`.
2. Provide pattern/gradient logic (consider perf & paint cost).
3. Add any necessary root CSS for `.bg-newstyle-theme`.

### Add a Badge Pair

1. Edit `BADGE_PAIRS` in `themes.ts` or underlying `badgeSystem.ts` depending on structure.
2. Provide `background`, `text`, `border` for `pro` & `free`.
3. Variables auto-applied.

## 8. Troubleshooting & Diagnostics

| Symptom | Likely Cause | Check |
|---------|--------------|-------|
| Theme classes missing | Early access before init | Confirm `isInitialized` before relying on theme-dependent layout |
| Font flash or fallback | Font still loading | Confirm network tab; ensure `googleFont` entry exists |
| Accent contrast warning | New low-contrast accent | Adjust tone or darken/lighten `primary` color |
| Background not changing | Class override or stale variable | Inspect `<html>` class list + `--background-pattern` value |
| Persistent old theme | LocalStorage stale/corrupt | Clear `localStorage['ai-fiesta:theme']` |

Dev Helpers: `logThemeInfo(theme)`, `contrastRatio`, `evaluateAccentContrast`.

## 9. Performance Considerations

- Single pass application (classes + variables) inside effect minimizes layout thrash.
- Fonts load asynchronously; no blocking `await` in UI path.
- Consolidated background variants reduce CSS explosion vs combinatorial matrix.
- Accessor functions are lightweight; expensive loops avoided in render path.

## 10. Security & Safety Notes

- LocalStorage usage is scoped (fixed key) and sanitized through validation.
- No user-provided arbitrary CSS injection pathways (controlled enumerations only).

## 11. Open Polish Tasks

| Priority | Task | Rationale |
|----------|------|-----------|
| P1 | Chat input inline background cleanup | Purity & maintainability |
| P1 | Snapshot test for `generateThemeClasses` | Prevent contract drift |
| P2 | Document accent addition snippet (now integrated here) | Contributor clarity |
| P2 | Consider surface/elevation tokens (`--surface-*`) | Future semantic layering |

## 12. Future Enhancements (Optional)

- User-defined custom accent (validated & persisted)
- Elevation semantic tokens and motion preferences
- Import/export theme profile
- Theme change analytics & A/B experiments

## 13. Historical Artifacts Archived

Legacy planning docs, gap analyses, and verbose implementation logs moved to `theme_system/legacy/` for reference (see `legacy/README.md`). They include: initial failure incident log, phased plan, gap analysis details, model chip theming deep dive.

## 14. Quick Integration Reference

```tsx
// In layout.tsx
<ThemeProvider>
  <html><body>{children}</body></html>
</ThemeProvider>

// Using theme
const { theme, setAccent, toggleMode } = useTheme();
<button onClick={() => toggleMode()} />
<button onClick={() => setAccent('emerald')} />
```

## 15. Summary

The system delivers a stable, extensible theming foundation with minimal surface area, strong contrast safeguards, and clear extension hooks. Remaining work is polish-focused; core architecture is production-ready.
