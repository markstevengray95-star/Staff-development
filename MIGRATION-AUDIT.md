# Migration Audit — Zones + Teaching CPD → Staff Development

Audit date: 2026-09-29

Source snapshots used for the migration audit:
- `markstevengray95-star/zones` — `c1c50e9a0a7de5ae615ab2d37536769205aea074`
- `markstevengray95-star/teaching-cpd` — `59ff1055ca725733451fe46fda4ab86ae7f7106d`
- Target: `markstevengray95-star/Staff-development`

## Migration rule

The goal is **functional completeness**, not copying obsolete duplicate files. The Zones repository contains many versioned replacements of the same tool. The current active feature set is migrated once into the unified app. Old password gates, owner setup flows and obsolete Supabase endpoints are intentionally replaced by the unified Staff Development authentication connected to the dedicated CPD Supabase project.

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
| `/ai-coach` | migrated · conversational AI-assisted CPD Coach with Smart Coach fallback |
| `/auth` | replaced by Staff Development unified auth |
| `/builder` | migrated |
| `/certificates` | migrated |
| `/coach` | migrated · evidence-aware recommendation plan |
| `/coaching` | migrated |
| `/course-audit` | migrated · Phases 1–8 automated course/content/presentation/practice/mastery/follow-through/facilitation audit |
| `/course-quality-dashboard` | migrated · Phase 8 final QA dashboard |
| `/course-packs` | migrated |
| `/course-studio` | migrated |
| `/custom/[slug]` | migrated |
| `/department-cpd` | migrated |
| `/development` | migrated |
| `/external-cpd` | migrated |
| `/facilitator` | migrated · Phase 7 printable facilitator packs and timed routes |
| `/help` | migrated |
| `/impact` | migrated · Phase 6 7/30/90-day implementation and impact cycle |
| `/improvement` | migrated |
| `/improvement/programmes` | migrated · school-improvement priority → CPD programme builder |
| `/join/[code]` | migrated |
| `/launch-readiness` | migrated |
| `/leadership` | migrated |
| `/learning-walks` | migrated · mobile learning walks and aggregate development patterns |
| `/live` | migrated |
| `/live-presenter` | migrated · Live CPD Presenter Mode 2.0 |
| `/micro-cpd` | migrated |
| `/needs-audit` | migrated |
| `/offline` | migrated |
| `/organisation` | migrated |
| `/owner-login` | migrated/redirected into unified owner/admin access |
| `/owner-portal` | migrated/redirected into unified owner/admin access |
| `/pathways` | migrated |
| `/pathways/personal` | migrated · role- and goal-based personalised pathway builder |
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

The complete source CPD catalogue, course expansion data, interactive course engine, presentations, reading expansions, simulations, certificates, pathways, recommendations, safeguarding depth and school-course batches remain available through the exact pinned `teaching-cpd` commit and target bridge routes.

## Course improvement phases

**Phase 1 — standardisation.** The full catalogue uses the shared course-quality template and automated baseline audit while retaining bespoke batch QA.

**Phase 2 — content depth.** Every course gains connected core knowledge, misconceptions/non-examples, worked application, SEND/EAL access and evidence/implementation follow-through, with a substantive-knowledge build threshold.

**Phase 3 — presentations.** Every course receives presentation-first delivery, visual section dividers, worked examples, recap, pacing breaks, presenter notes, fullscreen delivery, timers and keyboard controls.

**Phase 4 — advanced practice.** Every course contains six higher-order practice environments: evidence sorting, response ranking, hotspot investigation, implementation-vs-impact analysis, branching professional cases and an implementation simulator.

**Phase 5 — mastery assessment.** Every course contains diagnostic baseline, rotating retrieval, scenario application, final mastery and demonstrated-application gates, with targeted reteach and cloud-saved attempt evidence.

**Phase 6 — implementation and impact.** Completed courses create 7-day transfer, 30-day impact and 90-day sustain reviews, with spaced retrieval, implementation status, private evidence upload and privacy-protected aggregate leadership reporting.

**Phase 7 — facilitator delivery.** Every course has validated 15, 30, 60 and 90-minute live routes, facilitator notes, route pacing, discussion timer, display accessibility controls, route-aware navigation and printable `/facilitator` packs. Every route must include substantive learning, interaction and transfer and total exactly the selected session time.

**Phase 8 — final QA.** Every course passes a build-blocking quality gate covering unique IDs, presentation opening and pacing, unfinished editorial copy, Phase 4 practice, Phase 5 mastery, Phase 6 follow-through, Phase 7 route integrity and readable/meaningful visual and interactive content. Advisory checks flag weak objectives, interaction density, repeated slide titles and unclear summaries. Results are visible at `/course-quality-dashboard`.

## Five-feature Staff Development expansion

The five high-value post-Phase-8 features are now part of the unified product rather than separate demos:

### 1. AI CPD Coach — `/ai-coach`
- Uses the staff member's completed CPD, active development targets, implementation actions, assignments and needs-audit context.
- Supports a conversational coaching workspace and saved coaching conversations.
- An optional server-side model call is used when `OPENAI_API_KEY` is configured. Without it, the evidence-aware Smart Coach fallback remains fully usable.
- The interface warns staff not to enter identifiable pupil information, safeguarding disclosures or confidential personnel information.
- It supports professional judgement and implementation planning; it does not score or rank staff.

### 2. Learning Walks — `/learning-walks`
- Mobile-first capture of observable evidence, strengths, development points and school improvement links.
- Automatically recommends relevant CPD from the existing catalogue.
- Captures development signals such as checking for understanding, challenge, participation, independence, behaviour/climate, SEND access, retrieval, feedback and literacy/oracy.
- The form deliberately does not collect an observed teacher name or quality score.
- Leadership sees shared aggregate patterns rather than an individual staff leaderboard.

### 3. Personal Development Pathways — `/pathways/personal`
- Builds a focused pathway from staff role, professional-development goal and already-completed learning.
- Supports ECT, Teacher, TA, Pastoral, Middle Leader, SLT, SEND and Safeguarding role focuses.
- Produces a course sequence with rationales and stores saved plans in the staff member's account.
- Complements the existing curated `/pathways` rather than replacing them.

### 4. School Improvement → CPD — `/improvement/programmes`
- CPD Leads/Admins select a live school or department improvement priority.
- The system suggests relevant courses, while the leader retains the final selection decision.
- Programmes can include existing pathways, 15/30/60/90-minute facilitator routes and the Phase 6 7/30/90-day review cycle.
- Every programme includes a success measure so impact can be reviewed rather than inferred from attendance alone.

### 5. Live CPD Presenter Mode 2.0 — `/live-presenter`
- Uses the existing secure Live CPD sessions, QR join codes, participants, activities and responses.
- Adds course-slide control, direct slide navigation and persisted presenter state.
- Adds live poll, confidence pulse, word cloud and anonymous-question tools.
- Results remain facilitator-controlled rather than automatically displayed.
- Presenter 2.0 sits alongside `/live` and `/facilitator`; it does not create a competing live-session system.

### Data and security for the five-feature suite

The dedicated CPD Supabase project now contains:
- `cpd_coach_conversations`
- `personal_pathway_plans`
- `learning_walks`
- `improvement_cpd_programmes`
- `live_presenter_state`

RLS is enabled on all five tables. Personal coach/pathway records are owner-scoped, learning-walk leadership access is limited to shared aggregate records in the same organisation, improvement programmes are managed by authorised CPD Leads/Admins, and presenter state is writable only by the session presenter. These features reuse existing CPD progress, live-session and impact systems rather than duplicating them.

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
| CPD Studio | `/zones-cpd/studio` |
| CPD Escape Room | `/zones-cpd/escape-room` |
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

## Intentionally replaced rather than copied

- `password-gate-v42/v43/v44` → unified CPD-project authentication.
- `cpd-admin-passwords-v42/v43/v44`, `cpd-owner-setup-v40` and old admin auth helpers → unified `/admin-login` and `/admin`.
- Old Zones hard-coded Supabase URL `emjmvgginijkupwuflla` → **not migrated into executable source**. Staff Development uses the dedicated CPD Supabase project.
- Superseded duplicate Regulation Room / Escape Room versions → consolidated latest capability set.
- Standalone static service-worker/cache plumbing → replaced by the Next.js/Vercel architecture.

## Continuous platform integrity check

`npm run audit:platform` is part of Staff Development CI before the production build. It fails the pipeline if a critical migrated route disappears, if duplicate route outputs are introduced, if the `teaching-cpd` package is not pinned to an exact commit, or if the obsolete backend reappears in executable source. The five new routes are now part of the required-route list. Literal unresolved internal route references are reported as warnings for review.

When either source repository changes, compare its active route/script manifest with this document before declaring the combined platform complete. Any new functional source feature must either receive a target route/capability or be explicitly marked as superseded/replaced here.
