# Staff Development

A unified whole-school platform combining the Zones and Teaching CPD products into one account, school workspace and subscription model.

## Main areas

- **Dashboard** — whole-school development overview and quick actions.
- **CPD Academy** — interactive professional-learning courses with modules, activities, reflections and completion tracking.
- **Regulation Hub** — four-zone guidance, practical regulation tools, classroom check-ins and subject-specific implementation ideas.
- **Zones Practice** — scenario-based staff practice focused on judgement, context and non-labelling language.
- **Interventions** — concise student-support plans with strategies, review dates and status tracking.
- **Student Support** — regulation check-ins and pattern summaries for Pro/School access.
- **Live Activities** — facilitator prompts and meeting/INSET activities.
- **Staff Dashboard** — CPD coverage, implementation evidence and leadership review prompts.
- **Resources** — implementation planners, learning-walk prompts, intervention templates and pupil-voice prompts.
- **Plans & Access** — Free, Plus, Pro and School subscription structure.

## Production backend

The app now uses the shared Supabase school backend instead of relying on browser-only state:

- Supabase Auth for email/password, magic-link and supported school OAuth providers.
- Password reset returns to this app's `/reset-password` route.
- Existing browser progress is imported on first authenticated use when the cloud record is empty.
- CPD progress, regulation check-ins and intervention plans sync to account-scoped cloud tables.
- School workspaces use existing `school_organizations` and `school_organization_members` records.
- Access is derived from server-side subscriptions/entitlements, not a local plan selector.
- Row-level security scopes staff, leadership and student records.
- Verified school domains can support controlled staff self-join within the paid seat limit.

The database migration is committed at `supabase/migrations/20260928_staff_development_unified_platform.sql` and has also been applied to the active Supabase project.

## Pricing model

- **Free** — Regulation Room, the Zones foundations CPD and starter tools.
- **Plus — £30/month** — all CPDs, live activities, Zones practice and interventions for up to 5 accounts.
- **Pro — £100/month** — the full platform, student features and staff dashboard for up to 60 accounts.
- **School — £200/month** — large-school access for up to 300 accounts.
- **Extra accounts** — £10/month per additional 5 accounts.
- **Individual CPD** — £9.99/month for one course, or £89.99/month for all CPDs plus new courses.

## Stripe

`/api/billing/checkout` creates recurring Checkout sessions and `/api/billing/webhook` verifies Stripe signatures before updating Supabase entitlements. Configure the server-only Stripe and Supabase service-role environment variables plus the six recurring Stripe Price IDs listed in `.env.example`.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

GitHub Actions runs a full Next.js production build on every push and pull request to `main`.
