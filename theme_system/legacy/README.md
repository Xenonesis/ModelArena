# Theme System Legacy Archive

This directory preserves historical planning, gap analysis, and verbose implementation logs for the Open Fiesta theme system. These files are retained for traceability and deeper context but are no longer the primary reference.

## Primary Current Doc

- Use `../ThemeSystemOverview.md` for the authoritative, concise architecture & extension guide.

## Archived Files

- `theme_system_plan.md` (original evolving plan + incident log)
- `consolidated_theme_plan.md` (snapshot superseded by overview)
- `final_theme_gap_analysis.md` (detailed gap resolution table)
- `theme_spec.md` (now condensed; core contract merged into overview but retained verbatim)
- `model_chip_theming.md` (specific theming notes for chips & toggles)

## When To Consult Legacy Docs

- Auditing historical decisions (e.g., de-scoping mesh/particles backgrounds)
- Reviewing original incident/failure reports for regression prevention
- Understanding detailed rationale behind simplifications and token choices

## De-Scoped / Deferred Features Logged

See older docs for rationale on:

- Mesh / particles backgrounds
- GlowWrapper component
- Extended shade ramps beyond current accent tiers

If reintroducing any de-scoped concept, update `ThemeSystemOverview.md` first, then optionally annotate the relevant legacy file with a cross-link.
