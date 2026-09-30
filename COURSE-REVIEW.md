# Staff Development course review — 30 September 2026

The 88 published courses were assembled through successive enrichment passes in
the pinned `teaching-cpd` dependency. Advertised durations were 339–585 minutes.
Repeated opening slides, automatic checkpoints, multiple transfer prompts and a
second complete case sequence made the required journey unnecessarily long.

## Change

The CPD Academy now opens a concise route by default. It has 15–28% fewer required
slides (26% average), removing 2,295 slides from required journeys across the
catalogue. Duration estimates scale with the retained slide count; these remain
planning estimates, not observed completion times.

The original slide layouts and interactions are unchanged. Every explanatory
content module, quiz, scenario, objective, first complete progressive case,
opening journey map and closing implementation commitment is retained. Four
learning-cycle anchors remain. Repeated scaffolding and the second practice
sequence are available through **Extended practice (optional)**.

Course and module IDs are unchanged, so saved responses remain attached to their
original slides. Progress is counted against the selected route rather than the
total number of IDs saved in an older record. Completing optional work does not
change the required completion criteria. Existing completion dates are retained.

The dedicated six-module Zones CPD course and custom/AI courses are separate
catalogues and have not been shortened by this change. Source presentation QA
tools continue to audit the extended catalogue; the new concise audit checks the
shorter route without applying the old minimum-length requirements.

## Validation

- All 88 courses pass the concise integrity audit, including unchanged content,
  assessments, module types, first case, stable IDs and legacy progress counts.
- The platform audit passes: 78 routes, no warnings or failures.
- Standalone TypeScript checking passes.
- The production bundle compiles locally. The subsequent Next.js worker cannot
  start in this Windows environment (`spawn EPERM`), so a full local production
  build is unverified. GitHub CI runs the normal build and both audits.

## Other review finding

`app/cpd/page.tsx` updates progress optimistically before the Supabase save and
does not roll back when it fails. `ModuleViewer.finish` then unconditionally says
“Saved to your CPD record.” An unsuccessful save can therefore look successful
until the page is reloaded. This existing issue is outside the course-shortening
change and should be addressed separately by returning the save result and
showing completion only after persistence succeeds.

The review covers the source and generated catalogue. Authenticated live usage,
school permissions, payments and actual learner timings were not exercised.
