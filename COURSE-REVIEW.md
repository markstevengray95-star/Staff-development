# Staff Development course review — 30 September 2026

## Course length

The app preserves the latest upstream course-length optimisation and Phases 28–31
(personalised entry, professional toolkit, implementation and certification).
On top of that pinned catalogue, the concise Academy route removes 968 repeated
required slides across 88 courses: 7–15% fewer slides, 14% on average.
Core duration estimates now use differentiated 45–90 minute pacing budgets,
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

## Linked short courses and working practice tasks

- Added 15 focused courses linked in both directions to their key courses:
  disclosures, factual records, online safety, classroom safety, evacuation,
  near misses, medical plans, allergies, security, data handling, adaptive
  teaching, calm responses, retrieval, understanding checks and workload.
  Seven have 15-minute budgets; eight have 20-minute budgets. Each has seven
  modules in three sections: Understand, Rehearse and Apply. They retain the
  reading/check/scenario/activity/checklist/reflection format, with original
  short reading passages and practical prompts.
- The catalogue now has 103 courses. The 88 core routes have budgets of 45
  minutes (8), 60 minutes (38), 75 minutes (37) or 90 minutes (5). Weighted module
  budgets sum to each route's total. Extended practice adds time rather than
  displaying a shorter estimate than the core route. These are guided pacing
  budgets, not timed or guaranteed learner completion; optional Course Lab and
  reading extensions add time. Statutory/specialist training is not shortened
  or certified by these awareness courses.
- The length filter and parent/child links make refreshers discoverable. A
  purchased parent also unlocks its linked short courses without changing
  payments or database permissions.
- Replaced placeholder flashcard fronts with 1,101 explicit questions across
  course decks, including readable choices, recall attempts, model answers and
  session-only self-ratings. Native assessment-bank decoding prevents raw
  `[q|...]` records being displayed as answer options or flashcard text.
- Native scored assessment sets enforce answers before scoring and the source
  pass thresholds before completion. Retry rotates questions and resets answers;
  explanatory feedback and results are retained in the existing progress format.
- Interactive classroom practice now has evidence hotspots, observation versus
  interpretation checks, a reasoned decision, explanatory feedback, new
  information and a follow-up review. Fictional category/safety cases replace
  objective-only hotspots and position-based answer judgements. These are
  reusable category rehearsals, not 103 unique simulations or competence tests.
- Save operations are serialised in the Academy page to avoid simultaneous
  notes/completion writes losing each other's updates. A failed save preserves
  the response, does not mark completion, clears busy controls and can be retried.
  This does not resolve concurrent edits from different devices.

### Additional validation

The learning-task audit passes for all 103 courses and 6,269 module definitions,
including all 6,195 encoded question instances, question/answer integrity,
perfect/incorrect/incomplete scoring, populated flashcards, valid short-course
parents, exact duration totals, extended-route timing and classroom feedback.
The audit is part of `npm run audit:courses` and therefore runs in GitHub CI.

In an isolated React preview, a short course was completed through all seven
task types; incorrect/unanswered checks were blocked, the parent course link
worked, a five-question native assessment scored and saved, question flashcards
revealed readable answers, and the Observe/Decide/Review rehearsal saved notes.
Failure injection confirmed that completion and Course Lab saves report errors
and retain responses. At 390px the Course Lab has no horizontal page overflow.
This is representative UI coverage with mock persistence, not a claim that all
103 courses were individually completed in the live authenticated app.

Safety content deliberately defers to current school arrangements and relevant
pupil-specific plans. Policy context checked against [Keeping children safe in
education](https://www.gov.uk/government/publications/keeping-children-safe-in-education--2)
and HSE's [classroom risk checklist](https://www.hse.gov.uk/risk/classroom-checklist.htm).
These generic awareness activities are not medical advice, specialist competency
training, or a replacement for required statutory safeguarding training.
