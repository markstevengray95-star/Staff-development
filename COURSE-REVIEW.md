# Staff Development course review — 30 September 2026

## Course length

The app preserves the latest upstream course-length optimisation and Phases 28–31
(personalised entry, professional toolkit, implementation and certification).
On top of that pinned catalogue, the concise Academy route removes 968 repeated
required slides across 88 courses: 7–15% fewer slides, 14% on average.
Duration estimates scale with retained slides and remain planning estimates,
not observed learner timings. The previous 26% comparison was against an older,
longer dependency and is superseded by this latest-source comparison.

Every source explanatory content module, quiz, scenario, objective, first
complete progressive case and four learning-cycle anchors is retained. Repeated
scaffolding remains available through Extended practice (optional), relative to
the current upstream catalogue. Course and module IDs remain stable. Progress
counts against the selected route, and existing completion dates are retained.

## Presentation improvements

- A five-section learning map: Start here, Understand, Rehearse, Decide, Apply.
- A readable, scrolling slide canvas replaces fixed-height/cropped text layouts.
- Paragraph-based reading, reading estimates, optional depth choices, key ideas
  and glossary disclosures, with all original reading text retained.
- Three optional Read & try panels per course: 264 panels across the catalogue.
  Each combines a course-specific objective/source excerpt with category-based
  fictional professional reading and an evidence sort, sequencing exercise or
  scenario decision with a rationale. These are not 264 wholly unique essays.
- Practice notes save to existing course metadata, with feedback and no added
  completion requirements. Keyboard controls and mobile section navigation
  support the same learning format.
- Native Academy presentation/reading controls replace duplicated legacy DOM
  controllers on /cpd. Specialty controllers and other routes remain in place.

The dedicated Zones CPD and custom/AI catalogues are separate and were not
rewritten by this change.

## Saving correction

The Academy now updates completion only after its Supabase upsert succeeds.
Missing sessions and save errors reject the operation; the module and optional
practice UI show failure instead of claiming success, retaining the current
response for retry. No database schema, permissions or authentication changes
were made. Live authenticated database persistence has not been exercised.

## Validation

- All 88 courses pass the integrity audit: stable IDs, unchanged core content and
  assessments, valid five-section boundaries, three complete optional panels
  per course, and lossless paragraph conversion.
- Platform audit: 78 routes, no warnings or failures.
- Standalone TypeScript checking passes against the latest pinned dependency.
- Isolated React preview verified at mobile and desktop widths: scrolling,
  reading disclosures, evidence feedback, note save success/failure, failed
  completion feedback, sequencing panel and presentation mode controls.
- A conflicting legacy mobile sidebar rule was found and corrected during
  visual checking. Browser verification used the in-app browser after the
  agent-browser helper could not create its socket directory.
- Production compilation previously succeeded, but the Next.js build worker
  cannot start in this Windows sandbox (spawn EPERM). Full production build
  and the authenticated integrated app remain unverified locally; CI runs the
  normal build and audits.

The Next.js and React skills guided native component boundaries and controls.
Supabase guidance was used for save-error handling. No production deployment,
school permissions, payments or observed learner timing were tested.
