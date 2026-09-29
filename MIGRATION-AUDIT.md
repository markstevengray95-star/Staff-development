# Migration Audit — Zones + Teaching CPD → Staff Development

Audit date: 2026-09-29

Source snapshots used for the migration audit:
- `markstevengray95-star/zones` — `c1c50e9a0a7de5ae615ab2d37536769205aea074`
- `markstevengray95-star/teaching-cpd` — `dc6b6991feb273ddd236a6f5630c97cb0409e263`
- Target: `markstevengray95-star/Staff-development`

## Migration rule

The goal is **functional completeness**, not copying obsolete duplicate files. The Zones repository contains many versioned replacements of the same tool. The current active feature set referenced by its final `index.html` is migrated once into the unified app. Old password gates, owner setup flows and obsolete Supabase endpoints are intentionally replaced by the unified Staff Development authentication connected to the CPD Supabase project.

## Teaching CPD route audit

Every functional route in `teaching-cpd` is exposed in Staff Development either as a direct bridge/re-export or a unified replacement:

| Source route | Target status |
|---|---|
| `/access` | migrated |
| `/accessibility` | migrated |
| `/actions` | migrated |
| `/adaptive` | migrated |
| `/admin-login` | migrated / unified admin sign-in |
| `/admin` | migrated / unified admin centre |
| `/auth` | replaced by Staff Development unified auth |
| `/builder` | migrated |
| `/certificates` | migrated |
| `/coach` | migrated |
| `/coaching` | migrated |
| `/course-audit` | migrated · Phases 1–7 automated audit |
| `/course-packs` | migrated |
| `/course-studio` | migrated |
| `/custom/[slug]` | migrated |
| `/department-cpd` | migrated |
| `/development` | migrated |
| `/external-cpd` | migrated |
| `/facilitator` | migrated · Phase 7 printable facilitator packs and delivery routes |
| `/help` | migrated |
| `/impact` | migrated · Phase 6 7/30/90-day implementation and impact cycle |
| `/improvement` | migrated |
| `/join/[code]` | migrated |
| `/launch-readiness` | migrated |
| `/leadership` | migrated |
| `/live` | migrated |
| `/micro-cpd` | migrated |
| `/needs-audit` | migrated |
| `/offline` | migrated |
| `/organisation` | migrated |
| `/owner-login` | migrated/redirected into unified owner/admin access |
| `/owner-portal` | migrated/redirected into unified owner/admin access |
| `/pathways` | migrated |
| `/platform` | migrated |
| `/policy-training` | migrated |
| `/portfolio` | migrated |
| `/quality` | migrated |
| `/reading` | migrated |
| `/recommendations` | migrated |
| `/reminders` | migrated |
| `/reset-password` | replaced by Staff Development CPD-project reset flow |
| `/safeguarding` | migrated |
| `/safeguarding/documents` | migrated |
| `/safety` | migrated |
| `/school-access` | migrated |
| `/school-hub` | migrated |
| `/simulator` | migrated |
| `/staff-access` | migrated |
| `/staff-sync` | migrated |
| `/standards` | migrated |
| `/subject-cpd` | migrated |
| `/training` | migrated |
| `/verify` | migrated |

The complete source CPD catalogue, course expansion data, interactive course engine, presentations, reading expansions, simulations, certificates, pathways, recommendations, safeguarding depth and school-course batches remain available through the pinned `teaching-cpd` package and target bridge routes.

Phase 1 adds the catalogue-wide `2026.1` course-quality template and automated audit while retaining the earlier bespoke batch QA layers. Phase 2 adds five deeper knowledge sections to every course: connected core knowledge, misconceptions and non-examples, worked application, inclusive SEND/EAL application, and evidence/implementation follow-through. Phase 2 also enforces a minimum substantive knowledge threshold at build time.

Phase 3 adds the presentation-first delivery layer to every course: opening visual challenge, Understand/Practise/Transfer dividers, visual worked example, visual recap, automatic pacing breaks, concise presenter mode, generated presenter notes, fullscreen delivery, session timer, keyboard shortcuts and active-slide facilitator prompts.

Phase 4 adds six higher-order practice environments to every course: evidence sorting, professional-response ranking, hotspot investigation, implementation-vs-impact evidence analysis, branching professional cases and an implementation simulator. Build-time validation requires all six practice types and interaction metadata in every course.

Phase 5 adds five mastery-assessment stages to every course: diagnostic baseline, rotating retrieval mastery, scenario application, final understanding assessment and a demonstrated-application gate. Incorrect responses receive explanations and targeted reteach before rotated retries. Latest/best scores, attempts and weak topics remain attached to the same cloud CPD progress record.

Phase 6 adds post-completion follow-through. Completed courses automatically create 7-day transfer, 30-day impact and 90-day sustain checkpoints from the recorded completion date. Follow-ups include spaced retrieval from the course mastery bank, implementation status, private PDF/image evidence upload, impact notes and next-step decisions. Leadership reporting uses aggregate implementation patterns and applies a minimum three-staff privacy threshold rather than ranking individuals.

Phase 7 adds the full facilitator/presenter layer. Every course now has validated 15, 30, 60 and 90-minute live delivery routes. The global facilitator console marks route slides, unlocks route navigation for presenters without changing learner completion, shows route pacing, provides purpose/facilitator move/discussion/misconception/accessibility/extension notes, includes a two-minute discussion timer, offers larger-text/high-contrast/low-motion controls, supports keyboard route navigation and links to printable `/facilitator` packs. The printable pack works for every course and includes a route agenda, timings, prompts, inclusion guidance and the hand-off into Phase 5 mastery and Phase 6 follow-through. Build-time validation requires all four routes, exact route timing, substantive content, interaction and transfer in every route.

## Zones route / capability audit

| Original area | Target |
|---|---|
| Dashboard | `/zones` plus main dashboard |
| Student Check-in | main platform Student Support |
| Regulation Room | `/regulation-room` |
| Scenario Practice | main Zones Practice + `/zone-quest` |
| Staff Dashboard | main platform Staff Dashboard |
| Local Insights | `/zones-school` → Local Insights |
| Subjects | `/zones-school` → Subjects |
| Lesson Planner | `/zones-school` → Lesson Planner |
| Resources | `/zones-school` → Resources |
| Implementation | `/zones-school` → Implementation |
| Impact Hub | `/zones-school` → Impact Hub + `/impact` |
| CPD Academy | `/zones-cpd` |
| Intervention Plans | main platform Interventions |
| School Platform | `/zones-school` |
| School Operations | `/zones-school` → School Operations |
| About & Settings | `/zones-school` → About & Settings |

## Zones specialist modules

| Source capability | Target |
|---|---|
| `regulation-room-3d`, `regulation-room-v2`, `regulation-room-plus`, `regulation-room-v3-plus` | consolidated `/regulation-room` |
| `cpd-deck-v5` | `/zones-cpd` facilitator deck |
| `cpd-activity-lab-v6` | `/zones-cpd/studio` Activity Lab |
| `cpd-facilitator-v6` | `/zones-cpd/studio` Facilitator Console |
| `cpd-graph-lab-v7` | `/zones-cpd/studio` Graph & Evidence Lab |
| `cpd-hotspot-realistic-v8` | `/zones-cpd/studio` Classroom Hotspot |
| `cpd-extra-activities-v9` | Activity Lab / Zone Quest |
| `cpd-session-deepdive-v10` | `/zones-cpd/studio` Session Deep Dive |
| `cpd-textbook-v36` | `/zones-cpd/studio` Zones CPD Textbook |
| `cpd-live-audience-v16` | `/zones-cpd/studio` Live Audience + `/live` |
| `cpd-live-sync-manager-v37` | unified CPD Live backend |
| `cpd-qr-resilient-v16` | QR entry in Zones CPD Studio |
| `cpd-live-fun-v17` | Activity Lab / presenter widgets |
| `cpd-delivery-v25b` | Facilitator Console / presenter tools |
| `cpd-session3-inclusion-v28` | `/zones-cpd/studio` Inclusion Session |
| `cpd-platform-v19` | `/zones-cpd` + `/zones-cpd/studio` |
| `cpd-escape-room-v21/v22` | `/zones-cpd/escape-room` |
| `cpd-interactive-challenges-v20` | Zone Quest / Activity Lab |
| `cpd-collab-v21` | `/zones-cpd/studio` Team Collaboration + `/live` |
| `cpd-escape-platform-v23` | Escape Room library/builder concepts in `/zones-cpd/escape-room` |
| `cpd-escape-team-v23` | Escape Room team roles / Studio collaboration |
| `cpd-escape-extras-v23` | Escape Room case tools |
| `cpd-escape-reliability-v24` | consolidated Escape Room flow |
| `whole-school-features-v11` | `/zones-school` |
| `cpd-presenter-widgets-v28` | `/zones-cpd/studio` Presenter Widgets |
| `cpd-live-unified-v30` | `/live` + Studio facilitator layer |
| `cpd-live-focus-zone-v31b` | Studio / Zones live activities |
| `cpd-zone-tab-v33` | `/zones` navigation |
| `cpd-zone-quest-phone-v34` | `/zone-quest` responsive game |
| `cpd-zone-link-v35` | unified Zones navigation |
| `school-impact-v1` | `/zones-school` Impact Hub + `/impact` |
| `operations-data.js` / `operations.js` | `/zones-school` School Operations |
| `interventions-only.js` | main platform Interventions |
| `platform-data.js` / `platform.js` | `/zones-school` + unified accounts/backend |
| `enhancements.js` / `experience-plus.js` | folded into rebuilt Zones suite UI |

## Intentionally not copied as standalone features

- `password-gate-v42/v43/v44` → unified CPD-project authentication.
- `cpd-admin-passwords-v42/v43/v44`, `cpd-owner-setup-v40`, old admin auth helpers → unified `/admin-login` and `/admin`.
- Old Zones hard-coded Supabase URL `emjmvgginijkupwuflla` → **not migrated**. Staff Development uses the dedicated CPD Supabase project.
- Superseded duplicate Regulation Room / Escape Room versions → consolidated latest capability set.
- Standalone service-worker/cache plumbing from the static Zones app → replaced by the Next.js deployment architecture.

## Ongoing completeness check

When either source repository changes, compare its active route/script manifest with this document before declaring the combined platform complete. Any new functional source feature should either receive a target route/capability or be explicitly marked as superseded/replaced here.
