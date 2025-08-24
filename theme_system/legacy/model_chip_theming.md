# Model Chip & Toggle Theming Guide

This document explains how model chips, badge pair colors, and the toggle pill are unified.

## Color Source of Truth

Badge pair colors are defined via CSS variables produced by the badge pair selection (see `badgeSystem.ts` + `themeContext.tsx`). Each active pair yields:

```css
--badge-pro-bg; /* background */
--badge-pro-border; /* border */
--badge-pro-fg; /* text/icon */
--badge-free-bg;
--badge-free-border;
--badge-free-fg;
```

These map into chip + toggle styling; Pro inherits the `--badge-pro-*` trio, Free inherits the `--badge-free-*` trio. Other / uncategorized models fall back to neutral surfaces unless extended.

## Core Utility Classes (globals.css)

- `model-chip`: Baseline pill (radius, border, transitions, backdrop).
- `model-chip-pro`: Applies Pro border/background blend and subtle gradient overlay.
- `model-chip-free`: Applies Free border/background blend and subtle gradient overlay.
- `model-chip-selected`: (Reserved) If you want a distinct selected visual separate from state-based classes, extend this.
- `model-toggle-pill`: Track shell of the inline on/off control; tint transitions based on `data-active` & `data-type`.
- `model-toggle-thumb`: Circular thumb; colorized by data-type when active.

## Data Attributes

Chips & toggles expose semantic type & state for styling and future logic:

```html
<button
  class="model-chip model-chip-pro"
  data-type="pro"
  data-selected="true"
>
  ...
</button>
```

Toggle:
```html
<span class="model-toggle-pill" data-type="pro" data-active="true">
  <span class="model-toggle-thumb"></span>
</span>
```

These attributes enable variant targeting without adding more utility classes. Additional types (e.g. `unc`) can be wired by extending CSS selectors using `[data-type="unc"]`.

## Selection Logic

In `ModelsModal` and `SelectedModelsBar` the selection state drives `data-selected` plus conditional inclusion of `model-chip-pro` / `model-chip-free` classes. Neutral models keep a low-emphasis border with hover brightening.

## Extending For New Model Categories

1. Add a new logical detector (e.g. `isUnc`).
2. Add a data-type value (e.g. `data-type="unc"`).
3. In `globals.css` extend:

```css
.model-chip[data-type="unc"] { /* border/background */ }
.model-toggle-pill[data-type="unc"][data-active="true"] { /* active track */ }
.model-toggle-pill[data-type="unc"][data-active="true"] .model-toggle-thumb { /* thumb */ }
```

1. (Optional) Provide badge variables if it uses a dedicated color trio.

## Accessibility Notes

- Selection affordance combines color + position (toggle thumb shift) to avoid color-only reliance.
- `aria-disabled` is applied only when user cannot select more models (limit reached) to communicate the reason.
- Ensure focus styles (`accent-focus` or custom) are added if chips become keyboard actionable in additional contexts.

## Avoiding Inline Styles

All static aesthetics (radius, borders, colors) now live in utilities & variable-driven rules. Only dynamic layout computations (like responsive grid templates elsewhere) remain inline.

## Quick Recipe: Adding A New Model Chip Style

```tsx
// Detection in component
const isUnc = /uncensored/i.test(m.label);
...
<button
  data-type={isUnc ? 'unc' : free ? 'free' : m.good ? 'pro' : 'other'}
  className={`model-chip ${
    isUnc ? 'model-chip-unc' : free ? 'model-chip-free' : m.good ? 'model-chip-pro' : ''
  }`}
>
  ...
</button>
```
Add selectors in CSS referencing either the class (`.model-chip-unc`) or the attribute (`.model-chip[data-type="unc"]`).

## Summary
A single variable-backed system (badge pairs) feeds: badges, model chips, and toggles. Data attributes express semantic intent. Utilities encapsulate structural + transitional concerns. This minimizes duplication and keeps new model category additions low-effort.
