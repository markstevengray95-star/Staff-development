# Staff Development

A unified whole-school platform that combines the strongest ideas from the existing **Zones** and **Teaching CPD** apps into one product.

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
- **Plans & Access** — the current Free, Plus, Pro and large-school subscription structure.

## Pricing model represented in the app

- **Free** — Regulation Room, one CPD course and starter tools.
- **Plus — £30/month** — all CPDs, live activities, Zones practice and interventions for up to 5 accounts.
- **Pro — £100/month** — the full platform, student features and staff dashboard for up to 60 accounts.
- **School — £200/month** — large-school access for up to 300 accounts.
- **Extra accounts** — £10/month per additional 5 accounts.
- **Individual CPD** — £9.99 for one course for one month, or £89.99 for all CPDs plus new courses.

The plan selector currently switches feature access locally for product testing. Production billing should be connected to Stripe and the shared school/user backend.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

GitHub Actions runs a full Next.js production build on pushes and pull requests to `main`.

## Data

The current merged build persists course progress, regulation check-ins and intervention plans in browser local storage so the combined UI is immediately usable without backend setup. The next production step is to attach the existing school authentication/subscription backend so access, progress and student data sync per account rather than per browser.
