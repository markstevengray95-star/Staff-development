# Migration Audit — Zones + Teaching CPD → Staff Development

Audit date: 2026-09-29

Source snapshots currently integrated:
- `markstevengray95-star/zones` — `c1c50e9a0a7de5ae615ab2d37536769205aea074`
- `markstevengray95-star/teaching-cpd` — `8ba4d7322c4d9a5963f0952c7d53aa646f8d9979`
- Target: `markstevengray95-star/Staff-development`

## Migration rule

The target is functional completeness, not byte-for-byte copying of superseded source files. Obsolete password gates, duplicate historic Zones versions, old static service-worker plumbing and the old hard-coded backend are deliberately replaced by the unified Next.js/Vercel app, dedicated CPD Supabase project and unified authentication.

## Core CPD route coverage

The following source capabilities are exposed in Staff Development either through a direct route bridge or a unified replacement:

- `/dashboard` — unified personal staff-development dashboard.
- `/knowledge-base` — school knowledge library with private sources and Gemini Q&A.
- `/ai-course-builder` — Gemini course generator that writes into the existing versioned Course Creator.
- `/ai-coach` — Gemini-first conversational CPD Coach with evidence-aware local fallback.
- `/learning-walks` — mobile learning-walk capture with aggregate development patterns, not staff ranking.
- `/pathways/personal` — role/goal-based personalised development pathway.
- `/improvement/programmes` — school-improvement priority → CPD programme builder.
- `/live-presenter` — Live CPD Presenter Mode 2.0.
- `/facilitator` — Phase 7 printable facilitator packs and timed routes.
- `/impact` — Phase 6 7/30/90-day implementation and impact cycle.
- `/course-audit` — automated Phases 1–8 course-quality audit.
- `/course-quality-dashboard` — Phase 8 final QA dashboard.
- `/builder` — visual versioned school Course Creator.
- `/custom/[slug]` — published school-created CPD courses.
- `/development`, `/pathways`, `/adaptive`, `/subject-cpd`, `/reading`, `/micro-cpd`, `/training`, `/recommendations` — staff learning/development tools.
- `/simulator`, `/actions`, `/coach`, `/coaching`, `/needs-audit`, `/portfolio`, `/standards`, `/external-cpd` — application and evidence tools.
- `/school-hub`, `/department-cpd`, `/leadership`, `/live`, `/policy-training`, `/quality`, `/school-access`, `/staff-access`, `/staff-sync` — school/leadership tools.
- `/safeguarding`, `/safeguarding/documents`, `/safety`, `/certificates`, `/reminders`, `/improvement` — compliance/follow-up tools.
- `/course-studio`, `/course-packs`, `/help`, `/accessibility`, `/launch-readiness`, `/admin`, `/admin-login`, `/platform`, `/owner-portal` — creation, administration and platform tools.
- `/auth` and `/reset-password` — intentionally replaced by Staff Development's dedicated CPD-project auth flow.

## Course improvement phases

**Phase 1 — standardisation.** Shared quality template and automated baseline audit.

**Phase 2 — content depth.** Connected core knowledge, misconceptions/non-examples, worked application, SEND/EAL access and evidence/implementation follow-through.

**Phase 3 — presentations.** Presentation-first delivery, visual dividers, worked examples, recap, pacing breaks, presenter notes, fullscreen and timing controls.

**Phase 4 — advanced practice.** Evidence sorting, response ranking, hotspot investigation, implementation-vs-impact analysis, branching cases and implementation simulation.

**Phase 5 — mastery.** Diagnostic baseline, rotating retrieval, scenario application, final mastery and demonstrated-application gates with targeted reteach.

**Phase 6 — implementation and impact.** 7-day transfer, 30-day impact and 90-day sustain reviews with spaced retrieval, evidence and implementation status.

**Phase 7 — facilitator delivery.** Validated 15/30/60/90-minute live routes, presenter guidance, accessibility controls and printable packs.

**Phase 8 — final QA.** Build-blocking checks for IDs, unfinished copy, presentation pacing, practice, mastery, follow-through, facilitator routes and accessible interactive/visual content.

## Five-feature Staff Development expansion

### AI CPD Coach — `/ai-coach`
- Gemini is the primary model when `GEMINI_API_KEY` is available.
- OpenAI remains an optional fallback if configured.
- The built-in Smart Coach remains usable when no external model is available.
- Uses CPD history, targets, implementation actions, assignments and needs-audit context.
- Does not rank individual staff and warns against entering identifiable pupil/personnel information.

### Learning Walks — `/learning-walks`
- Captures observable evidence, strengths, development points and improvement links.
- Recommends relevant CPD.
- Leadership sees aggregate development patterns rather than teacher league tables.

### Personal Development Pathways — `/pathways/personal`
- Uses role, professional goal and completed learning.
- Saves focused course sequences with rationales and target completion dates.

### School Improvement → CPD — `/improvement/programmes`
- Links live improvement priorities to selected courses/pathways, facilitator routes, review days and explicit success measures.

### Presenter 2.0 — `/live-presenter`
- Reuses existing secure live sessions, QR codes, participants and responses.
- Adds slide control, polls, confidence pulses, word clouds, anonymous questions and facilitator-controlled result reveal.

## Three-feature AI/platform expansion

### School Knowledge Base + Gemini — `/knowledge-base`
- Stores approved school policy/guidance text by organisation.
- Supports pasted text and private PDF/DOCX/TXT/Markdown uploads.
- Original uploaded files are stored in the private `school-knowledge` bucket.
- Gemini extracts/summarises supported documents and Q&A answers are grounded in retrieved school sources with numbered citations.
- School-specific questions never fall back to invented policy requirements; where evidence is insufficient the assistant says so.
- Read access is organisation-scoped. Upload/archive access is restricted to authorised leaders.

### Gemini AI Course Builder — `/ai-course-builder`
- CPD Lead/Admin only.
- Builds a complete Phase 1–8-style CPD draft from a topic, audience, duration, level and optional school knowledge sources.
- Produces substantive text, diagnostic/retrieval quizzes, scenarios, polls, reflection and action-planning blocks.
- Saves directly into existing `custom_courses`, `custom_course_versions` and `custom_course_blocks` tables.
- Drafts are never auto-published; leaders review/edit/version them through `/builder` before publishing.

### Unified Staff Development Dashboard — `/dashboard`
- Brings completed CPD, assigned CPD, active development targets, personalised pathway, Phase 6 follow-ups and recent evidence into one workspace.
- Computes a practical next action from due impact reviews, assignments, pathway progress and development targets.
- Links directly to AI Coach, School Knowledge, Personal Pathways, Action Plans, Training, Portfolio and Impact Review.

## Data/security added for AI/platform expansion

The dedicated CPD Supabase project contains `school_knowledge_documents` with RLS enabled. Staff can read only knowledge for their organisation; inserts/updates/deletes are restricted to organisation leadership roles. The private `school-knowledge` storage bucket applies equivalent organisation-scoped read and leader-write/delete policies. Full-text search runs through `search_school_knowledge(...)` under the caller's RLS context.

AI-generated school courses deliberately reuse the existing organisation-scoped custom course/version/block tables and their existing RLS instead of creating a parallel publishing system.

Server-side Gemini calls use `GEMINI_API_KEY` (or supported Google key aliases) and never expose the key to browser code. The current default model can be overridden with `GEMINI_COACH_MODEL` / `GEMINI_MODEL`.

## Zones coverage

| Original area | Target |
|---|---|
| Dashboard | `/zones` plus unified home |
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
| School Platform / Operations | `/zones-school` |

Specialist legacy Zones modules for facilitator tools, graph/evidence lab, classroom hotspot, session deep dives, textbook, live audience, QR joining, collaborative/escape-room tools, Presenter Widgets and School Impact are consolidated into `/zones-cpd`, `/zones-cpd/studio`, `/zones-cpd/escape-room`, `/live`, `/zone-quest`, `/zones-school` and `/impact` rather than retained as duplicate versioned scripts.

## Intentionally replaced rather than copied

- Legacy Zones password gates and owner/admin password scripts → unified Staff Development authentication/admin.
- Old hard-coded Supabase project `emjmvgginijkupwuflla` → not allowed in executable Staff Development source.
- Superseded duplicate Regulation Room / Escape Room versions → consolidated current experiences.
- Static service-worker/cache architecture → Next.js/Vercel deployment architecture.

## Continuous platform integrity check

`npm run audit:platform` runs in Staff Development CI before the production build. It fails when a critical route disappears, duplicate route outputs appear, the `teaching-cpd` dependency is not pinned to an exact commit, required AI/API bridges disappear, or the obsolete backend reappears in executable source. Unresolved literal internal links are reported as warnings.

Current required additions include `/dashboard`, `/knowledge-base`, `/ai-course-builder`, `/ai-coach`, `/learning-walks`, `/pathways/personal`, `/improvement/programmes` and `/live-presenter`.
