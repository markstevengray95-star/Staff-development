"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, courses, type Course, type CourseModule } from "@/lib/catalogue";
import { regulationTools, scenarios, subjectIdeas, zones, type ZoneId } from "@/lib/zones";

type View = "dashboard" | "cpd" | "regulation" | "practice" | "interventions" | "students" | "live" | "staff" | "resources" | "plans";
type Plan = "Free" | "Plus" | "Pro" | "School";
type Progress = Record<string, { completedModules: string[]; reflections: Record<string, string>; completedAt?: string }>;
type CheckIn = { id: string; name: string; zone: ZoneId; note: string; createdAt: string };
type Intervention = {
  id: string;
  student: string;
  focus: string;
  zone: ZoneId;
  strategy: string;
  reviewDate: string;
  status: "Active" | "Review" | "Complete";
  notes: string;
};

type SavedState = {
  plan: Plan;
  progress: Progress;
  checkIns: CheckIn[];
  interventions: Intervention[];
  staffName: string;
  schoolName: string;
};

const defaultState: SavedState = {
  plan: "Pro",
  progress: {},
  checkIns: [],
  interventions: [],
  staffName: "Staff member",
  schoolName: "Your School",
};

const nav: { id: View; label: string; icon: string; section: "main" | "support" | "admin" }[] = [
  { id: "dashboard", label: "Dashboard", icon: "⌂", section: "main" },
  { id: "cpd", label: "CPD Academy", icon: "▣", section: "main" },
  { id: "regulation", label: "Regulation Hub", icon: "◇", section: "main" },
  { id: "practice", label: "Zones Practice", icon: "◆", section: "main" },
  { id: "interventions", label: "Interventions", icon: "✓", section: "support" },
  { id: "students", label: "Student Support", icon: "◉", section: "support" },
  { id: "live", label: "Live Activities", icon: "◫", section: "support" },
  { id: "staff", label: "Staff Dashboard", icon: "▦", section: "admin" },
  { id: "resources", label: "Resources", icon: "▤", section: "admin" },
  { id: "plans", label: "Plans & Access", icon: "✦", section: "admin" },
];

const planRank: Record<Plan, number> = { Free: 0, Plus: 1, Pro: 2, School: 3 };

export default function Home() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [state, setState] = useState<SavedState>(defaultState);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseCategory, setCourseCategory] = useState("All");
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("staff-development-platform-v1");
      if (saved) setState({ ...defaultState, ...(JSON.parse(saved) as SavedState) });
    } catch {
      // Ignore invalid local data and continue with defaults.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem("staff-development-platform-v1", JSON.stringify(state));
  }, [ready, state]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const completedCourses = useMemo(
    () => courses.filter((course) => isCourseComplete(course, state.progress[course.id])).length,
    [state.progress]
  );

  const completedMinutes = useMemo(
    () => courses.filter((course) => isCourseComplete(course, state.progress[course.id])).reduce((sum, course) => sum + course.duration, 0),
    [state.progress]
  );

  function completeModule(course: Course, courseModule: CourseModule, reflection: string) {
    setState((current) => {
      const existing = current.progress[course.id] || { completedModules: [], reflections: {} };
      const completedModules = existing.completedModules.includes(courseModule.id)
        ? existing.completedModules
        : [...existing.completedModules, courseModule.id];
      const finished = course.modules.every((item) => completedModules.includes(item.id));
      return {
        ...current,
        progress: {
          ...current.progress,
          [course.id]: {
            completedModules,
            reflections: { ...existing.reflections, [courseModule.id]: reflection },
            ...(finished ? { completedAt: existing.completedAt || new Date().toISOString() } : existing.completedAt ? { completedAt: existing.completedAt } : {}),
          },
        },
      };
    });
    notify("Progress saved to your development record.");
  }

  function addCheckIn(checkIn: Omit<CheckIn, "id" | "createdAt">) {
    const entry: CheckIn = { ...checkIn, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setState((current) => ({ ...current, checkIns: [entry, ...current.checkIns].slice(0, 80) }));
    notify("Check-in saved.");
  }

  function addIntervention(intervention: Omit<Intervention, "id">) {
    setState((current) => ({ ...current, interventions: [{ ...intervention, id: crypto.randomUUID() }, ...current.interventions] }));
    notify("Intervention added.");
  }

  function updateIntervention(id: string, status: Intervention["status"]) {
    setState((current) => ({
      ...current,
      interventions: current.interventions.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
    notify("Intervention updated.");
  }

  const canUse = (needed: Plan) => planRank[state.plan] >= planRank[needed];
  const changeView = (next: View) => {
    setView(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!ready) return <main className="loadingScreen">Opening Staff Development…</main>;

  return (
    <div className="appShell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brandBlock">
          <div className="brandMark">SD</div>
          <div>
            <strong>Staff Development</strong>
            <span>Whole-school platform</span>
          </div>
        </div>

        <div className="schoolBadge">
          <span className="schoolBadgeLabel">SCHOOL</span>
          <strong>{state.schoolName}</strong>
          <small>{state.plan} plan</small>
        </div>

        <SidebarSection title="Develop" items={nav.filter((item) => item.section === "main")} view={view} onChange={changeView} />
        <SidebarSection title="Support" items={nav.filter((item) => item.section === "support")} view={view} onChange={changeView} />
        <SidebarSection title="Manage" items={nav.filter((item) => item.section === "admin")} view={view} onChange={changeView} />

        <div className="sidebarFooter">
          <div className="profileDot">{initials(state.staffName)}</div>
          <div>
            <strong>{state.staffName}</strong>
            <span>Staff account</span>
          </div>
        </div>
      </aside>

      {menuOpen && <button className="backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <main className="mainArea">
        <header className="topbar">
          <button className="menuButton" onClick={() => setMenuOpen((open) => !open)} aria-label="Open navigation">☰</button>
          <div className="topbarTitle">
            <span>{pageEyebrow(view)}</span>
            <strong>{pageTitle(view)}</strong>
          </div>
          <div className="topbarActions">
            <button className="ghostButton" onClick={() => changeView("regulation")}>Quick regulation tool</button>
            <button className="planPill" onClick={() => changeView("plans")}>{state.plan}</button>
          </div>
        </header>

        <div className="contentWrap">
          {view === "dashboard" && (
            <Dashboard
              state={state}
              completedCourses={completedCourses}
              completedMinutes={completedMinutes}
              onView={changeView}
              onOpenCourse={setSelectedCourse}
            />
          )}

          {view === "cpd" && (
            <CPDAcademy
              progress={state.progress}
              search={courseSearch}
              category={courseCategory}
              onSearch={setCourseSearch}
              onCategory={setCourseCategory}
              onOpenCourse={setSelectedCourse}
            />
          )}

          {view === "regulation" && <RegulationHub onCheckIn={addCheckIn} canUsePlus={canUse("Plus")} onUpgrade={() => changeView("plans")} />}
          {view === "practice" && <PracticeHub canUsePlus={canUse("Plus")} onUpgrade={() => changeView("plans")} />}
          {view === "interventions" && <Interventions interventions={state.interventions} onAdd={addIntervention} onUpdate={updateIntervention} canUsePlus={canUse("Plus")} onUpgrade={() => changeView("plans")} />}
          {view === "students" && <StudentSupport checkIns={state.checkIns} onCheckIn={addCheckIn} canUsePro={canUse("Pro")} onUpgrade={() => changeView("plans")} />}
          {view === "live" && <LiveActivities canUsePlus={canUse("Plus")} onUpgrade={() => changeView("plans")} />}
          {view === "staff" && <StaffDashboard state={state} completedCourses={completedCourses} canUsePro={canUse("Pro")} onUpgrade={() => changeView("plans")} />}
          {view === "resources" && <Resources />}
          {view === "plans" && <Plans current={state.plan} onSelect={(plan) => setState((current) => ({ ...current, plan }))} />}
        </div>
      </main>

      {selectedCourse && (
        <CoursePlayer
          course={selectedCourse}
          progress={state.progress[selectedCourse.id]}
          onClose={() => setSelectedCourse(null)}
          onComplete={completeModule}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function SidebarSection({ title, items, view, onChange }: { title: string; items: typeof nav; view: View; onChange: (view: View) => void }) {
  return (
    <section className="sidebarSection">
      <span className="sidebarLabel">{title}</span>
      <nav>
        {items.map((item) => (
          <button key={item.id} className={view === item.id ? "navButton active" : "navButton"} onClick={() => onChange(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
    </section>
  );
}

function Dashboard({ state, completedCourses, completedMinutes, onView, onOpenCourse }: {
  state: SavedState;
  completedCourses: number;
  completedMinutes: number;
  onView: (view: View) => void;
  onOpenCourse: (course: Course) => void;
}) {
  const started = courses.filter((course) => (state.progress[course.id]?.completedModules.length || 0) > 0 && !isCourseComplete(course, state.progress[course.id]));
  const recommended = courses.filter((course) => !isCourseComplete(course, state.progress[course.id])).slice(0, 3);
  const activeInterventions = state.interventions.filter((item) => item.status !== "Complete").length;

  return (
    <>
      <section className="heroPanel">
        <div>
          <span className="eyebrow">WHOLE-SCHOOL DEVELOPMENT</span>
          <h1>One place for staff learning, regulation and student support.</h1>
          <p>Bring professional development into daily practice: learn, apply, support pupils, review interventions and see whole-school implementation in one platform.</p>
          <div className="heroActions">
            <button className="primaryButton" onClick={() => onView("cpd")}>Open CPD Academy</button>
            <button className="secondaryButton" onClick={() => onView("regulation")}>Open Regulation Hub</button>
          </div>
        </div>
        <div className="heroGraphic" aria-hidden="true">
          <div className="orb orbOne" />
          <div className="orb orbTwo" />
          <div className="orb orbThree" />
          <div className="heroGraphicCard"><strong>Learn</strong><span>→</span><strong>Apply</strong><span>→</span><strong>Review</strong></div>
        </div>
      </section>

      <section className="statGrid">
        <StatCard value={(completedMinutes / 60).toFixed(1)} label="CPD hours" sub="recorded learning" />
        <StatCard value={String(completedCourses)} label="Courses complete" sub={`${courses.length} available`} />
        <StatCard value={String(activeInterventions)} label="Active interventions" sub="student support plans" />
        <StatCard value={String(state.checkIns.length)} label="Check-ins" sub="recent regulation records" />
      </section>

      <section className="twoColumnGrid">
        <div className="panel">
          <PanelHeader title="Continue professional learning" action="All courses" onAction={() => onView("cpd")} />
          {started.length ? (
            <div className="listStack">{started.slice(0, 4).map((course) => <CourseRow key={course.id} course={course} progress={state.progress[course.id]} onClick={() => onOpenCourse(course)} />)}</div>
          ) : (
            <EmptyState title="Ready to start" text="Choose a course from the CPD Academy. Your progress is saved automatically in this browser." button="Browse CPD" onClick={() => onView("cpd")} />
          )}
        </div>
        <div className="panel">
          <PanelHeader title="Implementation pulse" action="Staff dashboard" onAction={() => onView("staff")} />
          <div className="pulseGrid">
            <Pulse label="CPD engagement" value={Math.min(100, Math.round((completedCourses / Math.max(courses.length, 1)) * 100))} />
            <Pulse label="Intervention reviews" value={state.interventions.length ? Math.round((state.interventions.filter((item) => item.status !== "Active").length / state.interventions.length) * 100) : 0} />
            <Pulse label="Regulation use" value={Math.min(100, state.checkIns.length * 7)} />
          </div>
          <div className="insightBox"><strong>Leadership prompt</strong><p>Look for consistency of practice rather than simply course completion. Which new routines can staff describe, demonstrate and review?</p></div>
        </div>
      </section>

      <section className="sectionBlock">
        <PanelHeader title="Recommended next" action="View full library" onAction={() => onView("cpd")} />
        <div className="courseGrid">{recommended.map((course) => <CourseCard key={course.id} course={course} progress={state.progress[course.id]} onClick={() => onOpenCourse(course)} />)}</div>
      </section>

      <section className="quickGrid">
        <QuickAction title="Run a regulation check-in" text="Record a pupil or class regulation state and note what support is needed." button="Check in" onClick={() => onView("students")} />
        <QuickAction title="Plan an intervention" text="Create a focused support plan with a review date and evidence of impact." button="Open interventions" onClick={() => onView("interventions")} />
        <QuickAction title="Run live staff CPD" text="Use prompts, scenarios and reflection activities in meetings or inset sessions." button="Open live tools" onClick={() => onView("live")} />
      </section>
    </>
  );
}

function CPDAcademy({ progress, search, category, onSearch, onCategory, onOpenCourse }: {
  progress: Progress;
  search: string;
  category: string;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onOpenCourse: (course: Course) => void;
}) {
  const filtered = courses.filter((course) => {
    const matchesCategory = category === "All" || course.category === category;
    const haystack = `${course.title} ${course.summary} ${course.category} ${course.audience}`.toLowerCase();
    return matchesCategory && haystack.includes(search.toLowerCase());
  });

  return (
    <>
      <PageIntro eyebrow="CPD ACADEMY" title="Professional learning built for classroom practice." text="Every course combines concise evidence-informed learning, scenarios, application tasks and reflection so staff leave with something they can use." />
      <div className="filterBar">
        <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search courses…" aria-label="Search courses" />
        <div className="chipRow">
          <button className={category === "All" ? "chip active" : "chip"} onClick={() => onCategory("All")}>All</button>
          {categories.map((item) => <button key={item} className={category === item ? "chip active" : "chip"} onClick={() => onCategory(item)}>{item}</button>)}
        </div>
      </div>
      <div className="librarySummary"><strong>{filtered.length} courses</strong><span>Interactive modules · application tasks · reflections · completion tracking</span></div>
      <div className="courseGrid">{filtered.map((course) => <CourseCard key={course.id} course={course} progress={progress[course.id]} onClick={() => onOpenCourse(course)} />)}</div>
    </>
  );
}

function RegulationHub({ onCheckIn, canUsePlus, onUpgrade }: { onCheckIn: (entry: Omit<CheckIn, "id" | "createdAt">) => void; canUsePlus: boolean; onUpgrade: () => void }) {
  const [selectedZone, setSelectedZone] = useState<ZoneId>("green");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const zone = zones.find((item) => item.id === selectedZone)!;

  return (
    <>
      <PageIntro eyebrow="REGULATION HUB" title="A practical regulation toolkit for the whole school." text="Use shared language without labelling pupils. Identify the state, choose support that fits the context, then review whether it helped." />
      <div className="zoneGrid">
        {zones.map((item) => (
          <button key={item.id} className={`zoneCard ${item.id} ${selectedZone === item.id ? "selected" : ""}`} onClick={() => setSelectedZone(item.id)}>
            <span className="zoneDot" />
            <strong>{item.name}</strong>
            <small>{item.energy}</small>
            <p>{item.examples.slice(0, 3).join(" · ")}</p>
          </button>
        ))}
      </div>

      <section className="twoColumnGrid">
        <div className="panel">
          <PanelHeader title={`${zone.name} support`} />
          <p className="panelLead">{zone.energy}. The goal is not to force a pupil into Green; it is to help them understand their state and choose what supports the next safe, useful action.</p>
          <div className="strategyList">{zone.strategies.map((strategy) => <div key={strategy}><span>✓</span><p>{strategy}</p></div>)}</div>
        </div>
        <div className="panel">
          <PanelHeader title="Quick check-in" />
          <label className="field"><span>Name / class / initials</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Year 8 Science" /></label>
          <label className="field"><span>Context note</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What is happening? What support might be useful?" /></label>
          <button className="primaryButton full" disabled={!name.trim()} onClick={() => { onCheckIn({ name: name.trim(), zone: selectedZone, note: note.trim() }); setName(""); setNote(""); }}>Save {zone.name} check-in</button>
        </div>
      </section>

      <section className="sectionBlock">
        <PanelHeader title="Regulation room" />
        <div className="toolGrid">{regulationTools.map((tool) => <RegulationTool key={tool.id} title={tool.title} detail={tool.detail} locked={!canUsePlus && tool.id !== "box-breath"} onUpgrade={onUpgrade} />)}</div>
      </section>

      <section className="panel">
        <PanelHeader title="Subject-specific implementation" />
        <div className="subjectGrid">{subjectIdeas.map((item) => <div className="subjectCard" key={item.subject}><strong>{item.subject}</strong><ul>{item.ideas.map((idea) => <li key={idea}>{idea}</li>)}</ul></div>)}</div>
      </section>
    </>
  );
}

function RegulationTool({ title, detail, locked, onUpgrade }: { title: string; detail: string; locked: boolean; onUpgrade: () => void }) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const breath = ["Breathe in", "Hold", "Breathe out", "Pause"];

  useEffect(() => {
    if (!active || title !== "Box breathing") return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % breath.length), 4000);
    return () => window.clearInterval(timer);
  }, [active, title]);

  if (locked) return <div className="toolCard locked"><span className="lockBadge">PLUS</span><strong>{title}</strong><p>{detail}</p><button className="textButton" onClick={onUpgrade}>Unlock tool →</button></div>;

  return (
    <div className="toolCard">
      <span className="toolIcon">◎</span>
      <strong>{title}</strong>
      <p>{detail}</p>
      {title === "Box breathing" && active && <div className="breathCircle"><span>{breath[step]}</span><small>4 seconds</small></div>}
      <button className="secondaryButton" onClick={() => setActive((current) => !current)}>{active ? "Stop" : "Start"}</button>
    </div>
  );
}

function PracticeHub({ canUsePlus, onUpgrade }: { canUsePlus: boolean; onUpgrade: () => void }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<ZoneId | null>(null);
  const [score, setScore] = useState(0);
  const current = scenarios[index % scenarios.length];

  if (!canUsePlus) return <LockedFeature title="Zones Practice is part of Plus" text="Unlock interactive scenarios, the Zones game, live activities and intervention tools." onUpgrade={onUpgrade} />;

  function choose(zone: ZoneId) {
    if (answer) return;
    setAnswer(zone);
    if (zone === current.likely) setScore((value) => value + 1);
  }

  function next() {
    setIndex((value) => (value + 1) % scenarios.length);
    setAnswer(null);
  }

  return (
    <>
      <PageIntro eyebrow="ZONES PRACTICE" title="Practise judgement, not labelling." text="Use scenarios to explore likely regulation states while remembering that context and pupil voice matter more than surface behaviour." />
      <section className="scenarioArena">
        <div className="scenarioTop"><span>Scenario {index + 1} of {scenarios.length}</span><strong>Score {score}</strong></div>
        <div className="scenarioPrompt"><span className="scenarioIcon">?</span><p>{current.text}</p></div>
        <div className="answerGrid">{zones.map((zone) => <button key={zone.id} className={`answerCard ${zone.id} ${answer === zone.id ? "chosen" : ""}`} disabled={Boolean(answer)} onClick={() => choose(zone.id)}>{zone.name}</button>)}</div>
        {answer && <div className={answer === current.likely ? "feedbackBox success" : "feedbackBox"}><strong>{answer === current.likely ? "Reasonable interpretation" : `A more likely interpretation is ${zones.find((zone) => zone.id === current.likely)?.name}.`}</strong><p>{current.response}</p><button className="primaryButton" onClick={next}>Next scenario</button></div>}
      </section>
      <section className="panel"><PanelHeader title="Team discussion prompts" /><div className="promptGrid"><Prompt text="What additional information would change your interpretation of this behaviour?" /><Prompt text="How could an adult response accidentally increase the pupil's arousal?" /><Prompt text="What would a proportionate first response look like without lowering expectations?" /><Prompt text="How would you know whether the strategy actually improved regulation?" /></div></section>
    </>
  );
}

function Interventions({ interventions, onAdd, onUpdate, canUsePlus, onUpgrade }: {
  interventions: Intervention[];
  onAdd: (entry: Omit<Intervention, "id">) => void;
  onUpdate: (id: string, status: Intervention["status"]) => void;
  canUsePlus: boolean;
  onUpgrade: () => void;
}) {
  const [form, setForm] = useState<Omit<Intervention, "id">>({ student: "", focus: "", zone: "yellow", strategy: "", reviewDate: "", status: "Active", notes: "" });
  if (!canUsePlus) return <LockedFeature title="Intervention planning is part of Plus" text="Create focused plans, review impact and connect strategies with the regulation toolkit." onUpgrade={onUpgrade} />;

  return (
    <>
      <PageIntro eyebrow="INTERVENTIONS" title="Focused support with a clear review cycle." text="Keep plans concise: identify the barrier, choose a specific strategy, define what improvement looks like and review whether the approach is helping." />
      <section className="twoColumnGrid interventionLayout">
        <div className="panel stickyPanel">
          <PanelHeader title="Create intervention" />
          <label className="field"><span>Student / initials</span><input value={form.student} onChange={(event) => setForm({ ...form, student: event.target.value })} /></label>
          <label className="field"><span>Focus / barrier</span><input value={form.focus} onChange={(event) => setForm({ ...form, focus: event.target.value })} placeholder="e.g. transition into independent work" /></label>
          <label className="field"><span>Most relevant zone</span><select value={form.zone} onChange={(event) => setForm({ ...form, zone: event.target.value as ZoneId })}>{zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}</select></label>
          <label className="field"><span>Strategy to test</span><textarea value={form.strategy} onChange={(event) => setForm({ ...form, strategy: event.target.value })} placeholder="Be specific enough that another adult could use it consistently." /></label>
          <label className="field"><span>Review date</span><input type="date" value={form.reviewDate} onChange={(event) => setForm({ ...form, reviewDate: event.target.value })} /></label>
          <label className="field"><span>Success evidence / notes</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="What would improvement look like?" /></label>
          <button className="primaryButton full" disabled={!form.student || !form.focus || !form.strategy} onClick={() => { onAdd(form); setForm({ student: "", focus: "", zone: "yellow", strategy: "", reviewDate: "", status: "Active", notes: "" }); }}>Add intervention</button>
        </div>
        <div className="panel">
          <PanelHeader title={`Current plans (${interventions.length})`} />
          {interventions.length ? <div className="interventionList">{interventions.map((item) => <InterventionCard key={item.id} item={item} onUpdate={onUpdate} />)}</div> : <EmptyState title="No intervention plans yet" text="Use the form to create a focused support plan. Keep the strategy small enough to review properly." />}
        </div>
      </section>
    </>
  );
}

function InterventionCard({ item, onUpdate }: { item: Intervention; onUpdate: (id: string, status: Intervention["status"]) => void }) {
  return <article className="interventionCard"><div className="interventionHead"><div><span className={`miniZone ${item.zone}`} /> <strong>{item.student}</strong></div><span className={`statusBadge ${item.status.toLowerCase()}`}>{item.status}</span></div><h3>{item.focus}</h3><p><strong>Strategy:</strong> {item.strategy}</p>{item.notes && <p><strong>Evidence:</strong> {item.notes}</p>}<div className="interventionMeta"><span>Review {item.reviewDate || "not set"}</span><select value={item.status} onChange={(event) => onUpdate(item.id, event.target.value as Intervention["status"])}><option>Active</option><option>Review</option><option>Complete</option></select></div></article>;
}

function StudentSupport({ checkIns, onCheckIn, canUsePro, onUpgrade }: { checkIns: CheckIn[]; onCheckIn: (entry: Omit<CheckIn, "id" | "createdAt">) => void; canUsePro: boolean; onUpgrade: () => void }) {
  const [name, setName] = useState("");
  const [zone, setZone] = useState<ZoneId>("green");
  const [note, setNote] = useState("");
  if (!canUsePro) return <LockedFeature title="Student accounts and tracking are part of Pro" text="Pro unlocks student check-ins, staff dashboards and whole-school monitoring." onUpgrade={onUpgrade} />;

  const counts = zones.map((item) => ({ zone: item, count: checkIns.filter((entry) => entry.zone === item.id).length }));

  return (
    <>
      <PageIntro eyebrow="STUDENT SUPPORT" title="See patterns without turning zones into labels." text="Check-ins are snapshots of a moment, not a judgement about the pupil. Use patterns to ask better questions and plan support." />
      <section className="twoColumnGrid">
        <div className="panel">
          <PanelHeader title="New check-in" />
          <label className="field"><span>Student / class / initials</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <span className="fieldLabel">Current zone</span>
          <div className="miniZonePicker">{zones.map((item) => <button key={item.id} className={`${item.id} ${zone === item.id ? "active" : ""}`} onClick={() => setZone(item.id)}>{item.name.replace(" Zone", "")}</button>)}</div>
          <label className="field"><span>Optional note</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Context, support used, or next action" /></label>
          <button className="primaryButton full" disabled={!name.trim()} onClick={() => { onCheckIn({ name: name.trim(), zone, note: note.trim() }); setName(""); setNote(""); }}>Save check-in</button>
        </div>
        <div className="panel">
          <PanelHeader title="Recent pattern" />
          <div className="zoneCountGrid">{counts.map(({ zone: item, count }) => <div key={item.id} className={`zoneCount ${item.id}`}><span>{count}</span><strong>{item.name}</strong></div>)}</div>
          <p className="mutedText">A higher count in one zone does not automatically indicate a problem. Look at time, lesson, context, pupil voice and whether strategies change the pattern.</p>
        </div>
      </section>
      <section className="panel"><PanelHeader title="Recent check-ins" />{checkIns.length ? <div className="tableWrap"><table><thead><tr><th>Name / group</th><th>Zone</th><th>Context</th><th>Time</th></tr></thead><tbody>{checkIns.slice(0, 20).map((entry) => <tr key={entry.id}><td><strong>{entry.name}</strong></td><td><span className={`zoneTag ${entry.zone}`}>{entry.zone}</span></td><td>{entry.note || "—"}</td><td>{new Date(entry.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div> : <EmptyState title="No check-ins recorded" text="Create a check-in above to begin seeing patterns." />}</section>
    </>
  );
}

function LiveActivities({ canUsePlus, onUpgrade }: { canUsePlus: boolean; onUpgrade: () => void }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [sessionCode] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());
  const prompts = [
    "Describe one pupil behaviour that could be interpreted differently when viewed through a regulation lens.",
    "Choose one routine your team wants to make more predictable this week.",
    "Name one scaffold you could remove once pupils are more secure.",
    "What would count as evidence that today's CPD changed classroom practice?",
    "Which common staff phrase could be rewritten to reduce escalation while keeping the boundary?",
    "Share one strategy that supports both regulation and learning rather than separating the two.",
  ];
  if (!canUsePlus) return <LockedFeature title="Live activities are part of Plus" text="Use meeting prompts, team challenges and interactive CPD activities with staff." onUpgrade={onUpgrade} />;

  return (
    <>
      <PageIntro eyebrow="LIVE ACTIVITIES" title="Turn staff meetings into active professional learning." text="Use the facilitator board for discussion, retrieval and implementation planning. The session code is ready for future multi-device sync." />
      <section className="liveHero"><div><span>SESSION CODE</span><strong>{sessionCode}</strong><p>Use this board in an inset, briefing or department meeting.</p></div><button className="secondaryButton" onClick={() => navigator.clipboard?.writeText(sessionCode)}>Copy code</button></section>
      <section className="twoColumnGrid">
        <div className="panel facilitatorCard"><span className="eyebrow">FACILITATOR PROMPT</span><h2>{prompts[promptIndex]}</h2><div className="heroActions"><button className="primaryButton" onClick={() => setPromptIndex((value) => (value + 1) % prompts.length)}>Next prompt</button><button className="secondaryButton" onClick={() => setPromptIndex(Math.floor(Math.random() * prompts.length))}>Random prompt</button></div></div>
        <div className="panel"><PanelHeader title="Run a 20-minute CPD cycle" /><ol className="timeline"><li><strong>3 min</strong><span>Retrieve: what do staff already know?</span></li><li><strong>5 min</strong><span>Learn: introduce one clear idea or model.</span></li><li><strong>6 min</strong><span>Practise: apply it to a real classroom scenario.</span></li><li><strong>4 min</strong><span>Commit: choose one behaviour to test.</span></li><li><strong>2 min</strong><span>Review: decide what evidence will be collected.</span></li></ol></div>
      </section>
      <section className="panel"><PanelHeader title="Interactive activities" /><div className="activityGrid"><ActivityCard title="Scenario sort" text="Teams classify a situation, then challenge the assumptions behind the classification." /><ActivityCard title="Language repair" text="Rewrite common classroom phrases to preserve expectations while reducing escalation." /><ActivityCard title="Strategy marketplace" text="Each group contributes one classroom strategy and the evidence they would use to judge impact." /><ActivityCard title="Implementation map" text="Identify what should be consistent across school and what can remain flexible by context." /></div></section>
    </>
  );
}

function StaffDashboard({ state, completedCourses, canUsePro, onUpgrade }: { state: SavedState; completedCourses: number; canUsePro: boolean; onUpgrade: () => void }) {
  if (!canUsePro) return <LockedFeature title="The staff dashboard is part of Pro" text="Unlock leadership reporting, student accounts and whole-school implementation tracking." onUpgrade={onUpgrade} />;
  const active = state.interventions.filter((item) => item.status === "Active").length;
  const review = state.interventions.filter((item) => item.status === "Review").length;
  const complete = state.interventions.filter((item) => item.status === "Complete").length;
  return (
    <>
      <PageIntro eyebrow="STAFF DASHBOARD" title="Track implementation, not just attendance." text="Use CPD completion as one signal alongside intervention reviews, regulation use and evidence of changes in practice." />
      <section className="statGrid"><StatCard value={String(completedCourses)} label="Courses completed" sub="current account" /><StatCard value={String(state.checkIns.length)} label="Regulation check-ins" sub="recorded" /><StatCard value={String(active)} label="Active plans" sub={`${review} awaiting review`} /><StatCard value={String(complete)} label="Completed plans" sub="reviewed support" /></section>
      <section className="twoColumnGrid">
        <div className="panel"><PanelHeader title="CPD coverage" /><div className="coverageList">{courses.map((course) => { const done = isCourseComplete(course, state.progress[course.id]); const pct = Math.round(((state.progress[course.id]?.completedModules.length || 0) / course.modules.length) * 100); return <div key={course.id} className="coverageRow"><div><strong>{course.title}</strong><span>{done ? "Complete" : pct ? `${pct}% complete` : "Not started"}</span></div><div className="progressTrack"><span style={{ width: `${pct}%` }} /></div></div>; })}</div></div>
        <div className="panel"><PanelHeader title="Implementation evidence" /><div className="evidenceStack"><Evidence title="Knowledge" text="Can staff explain the key idea accurately and identify common misconceptions?" /><Evidence title="Practice" text="Can staff demonstrate the routine or strategy in a realistic scenario?" /><Evidence title="Use" text="Is the new approach visible consistently enough to become habitual?" /><Evidence title="Impact" text="Is there evidence that pupil experience, participation or learning has improved?" /></div></div>
      </section>
      <section className="panel"><PanelHeader title="Leadership review questions" /><div className="promptGrid"><Prompt text="Which CPD has produced the clearest visible change in classroom practice?" /><Prompt text="Where are staff applying the same principle in different but equally valid ways?" /><Prompt text="Which intervention strategies appear to be helping, and which should be changed or stopped?" /><Prompt text="What do pupil check-ins suggest about times, transitions or environments that need attention?" /></div></section>
    </>
  );
}

function Resources() {
  return (
    <>
      <PageIntro eyebrow="RESOURCES" title="Ready-to-use implementation tools." text="Use these structures alongside the CPD and regulation sections to turn ideas into repeatable school routines." />
      <div className="resourceGrid">
        <ResourceCard title="CPD implementation planner" tag="Leadership" items={["What will staff do differently?", "What does good practice look like?", "How will staff rehearse it?", "When will impact be reviewed?"]} />
        <ResourceCard title="Regulation strategy menu" tag="Classroom" items={["Low-energy activation", "Movement reset", "Visual first step", "Two-choice support", "Quiet reset", "Co-regulation script"]} />
        <ResourceCard title="Intervention review template" tag="Pastoral" items={["Specific barrier", "Strategy tested", "Frequency / context", "Evidence collected", "Keep, adapt or stop"]} />
        <ResourceCard title="Learning walk prompts" tag="Development" items={["Are pupils clear what to do?", "How is understanding checked?", "What scaffolds are visible?", "How do adults respond to dysregulation?"]} />
        <ResourceCard title="Department discussion card" tag="Team CPD" items={["One evidence-informed idea", "One subject-specific example", "One likely barrier", "One classroom experiment"]} />
        <ResourceCard title="Pupil voice prompts" tag="Impact" items={["What helps you get started?", "What happens when learning feels difficult?", "Which routines help you feel clear and ready?", "What should adults understand better?"]} />
      </div>
    </>
  );
}

function Plans({ current, onSelect }: { current: Plan; onSelect: (plan: Plan) => void }) {
  const plans: { name: Plan; price: string; accounts: string; features: string[]; featured?: boolean }[] = [
    { name: "Free", price: "£0", accounts: "1 account", features: ["Regulation Room", "1 CPD course", "Basic regulation check-in", "Starter resources"] },
    { name: "Plus", price: "£30/mo", accounts: "Up to 5 accounts", features: ["All CPD courses", "Live CPD features", "Escape-room / challenge activities", "Zones practice game", "Intervention planning"] },
    { name: "Pro", price: "£100/mo", accounts: "Up to 60 accounts", features: ["Everything in Plus", "Student accounts", "Staff dashboard", "Whole-school tracking", "Leadership reporting", "New platform features"], featured: true },
    { name: "School", price: "£200/mo", accounts: "Up to 300 accounts", features: ["Everything in Pro", "Large-school capacity", "Whole-school implementation reporting", "Department rollout support", "Central admin controls"] },
  ];
  return (
    <>
      <PageIntro eyebrow="PLANS & ACCESS" title="One subscription for the whole staff-development platform." text="The merged platform gives schools a clear upgrade path from a useful free regulation tool to a full staff and student implementation system." />
      <div className="planGrid">{plans.map((plan) => <article key={plan.name} className={`planCard ${plan.featured ? "featured" : ""} ${current === plan.name ? "current" : ""}`}>{plan.featured && <span className="popularBadge">FULL PLATFORM</span>}<span className="planName">{plan.name}</span><strong className="planPrice">{plan.price}</strong><span className="planAccounts">{plan.accounts}</span><ul>{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><button className={plan.featured ? "primaryButton full" : "secondaryButton full"} onClick={() => onSelect(plan.name)}>{current === plan.name ? "Current plan" : `Use ${plan.name}`}</button></article>)}</div>
      <section className="panel addOn"><div><span className="eyebrow">EXTRA ACCOUNTS</span><h2>£10/month per additional 5 accounts</h2><p>Add capacity without moving plan until the larger school tier makes more sense.</p></div><div className="individualCpd"><strong>Individual CPD access</strong><span>£9.99 for one course for one month</span><span>£89.99 for all CPDs plus new courses</span></div></section>
      <p className="smallPrint">Plan buttons in this development build change feature access locally for testing. Production billing should be connected to Stripe and school accounts through the shared backend.</p>
    </>
  );
}

function CoursePlayer({ course, progress, onClose, onComplete }: { course: Course; progress?: Progress[string]; onClose: () => void; onComplete: (course: Course, module: CourseModule, reflection: string) => void }) {
  const [index, setIndex] = useState(0);
  const module = course.modules[index];
  const [reflection, setReflection] = useState(progress?.reflections[module.id] || "");

  useEffect(() => setReflection(progress?.reflections[module.id] || ""), [module.id, progress]);

  const completed = progress?.completedModules.includes(module.id) || false;
  const pct = Math.round(((progress?.completedModules.length || 0) / course.modules.length) * 100);

  return (
    <div className="modalBackdrop" role="dialog" aria-modal="true">
      <div className="courseModal">
        <aside className="courseRail">
          <button className="closeButton" onClick={onClose}>← Back to platform</button>
          <span className="eyebrow">{course.category}</span>
          <h2>{course.title}</h2>
          <p>{course.summary}</p>
          <div className="courseProgress"><div><span>Progress</span><strong>{pct}%</strong></div><div className="progressTrack"><span style={{ width: `${pct}%` }} /></div></div>
          <nav>{course.modules.map((item, itemIndex) => <button key={item.id} className={`${index === itemIndex ? "active" : ""} ${progress?.completedModules.includes(item.id) ? "done" : ""}`} onClick={() => setIndex(itemIndex)}><span>{progress?.completedModules.includes(item.id) ? "✓" : itemIndex + 1}</span><div><strong>{item.title}</strong><small>{item.minutes} min</small></div></button>)}</nav>
        </aside>
        <section className="courseStage">
          <div className="courseStageTop"><span>Module {index + 1} of {course.modules.length}</span><strong>{module.minutes} minutes</strong></div>
          <span className="moduleBadge">LEARN</span>
          <h1>{module.title}</h1>
          <p className="moduleLead">{module.summary}</p>
          <div className="learningCard"><span className="eyebrow">KEY IDEAS</span><div className="keyPointGrid">{module.keyPoints.map((point, pointIndex) => <div key={point}><span>{pointIndex + 1}</span><p>{point}</p></div>)}</div></div>
          <div className="activityCard"><span className="moduleBadge explore">APPLY</span><h3>Practice activity</h3><p>{module.activity}</p></div>
          <div className="reflectionCard"><span className="moduleBadge reflect">REFLECT</span><h3>{module.reflection}</h3><textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Record a short reflection or classroom action…" /></div>
          <div className="courseActions"><button className="secondaryButton" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>Previous</button><div className="actionSpacer" /><button className={completed ? "completeButton done" : "completeButton"} onClick={() => onComplete(course, module, reflection)}>{completed ? "✓ Module complete" : "Complete module"}</button><button className="primaryButton" disabled={index === course.modules.length - 1} onClick={() => setIndex((value) => Math.min(course.modules.length - 1, value + 1))}>Next</button></div>
        </section>
      </div>
    </div>
  );
}

function CourseCard({ course, progress, onClick }: { course: Course; progress?: Progress[string]; onClick: () => void }) {
  const pct = Math.round(((progress?.completedModules.length || 0) / course.modules.length) * 100);
  return <button className="courseCard" onClick={onClick}><div className="courseCardTop"><span>{course.category}</span><small>{course.duration} min</small></div><h3>{course.title}</h3><p>{course.summary}</p><div className="courseMeta"><span>{course.audience}</span><span>{course.modules.length} modules</span></div><div className="progressTrack"><span style={{ width: `${pct}%` }} /></div><div className="courseCardFoot"><span>{pct ? `${pct}% complete` : "Not started"}</span><strong>Open →</strong></div></button>;
}

function CourseRow({ course, progress, onClick }: { course: Course; progress?: Progress[string]; onClick: () => void }) {
  const pct = Math.round(((progress?.completedModules.length || 0) / course.modules.length) * 100);
  return <button className="courseRow" onClick={onClick}><div className="courseRowIcon">▣</div><div className="courseRowText"><strong>{course.title}</strong><span>{course.category} · {course.duration} min</span><div className="progressTrack"><span style={{ width: `${pct}%` }} /></div></div><div className="courseRowPct">{pct}%</div></button>;
}

function StatCard({ value, label, sub }: { value: string; label: string; sub: string }) { return <div className="statCard"><strong>{value}</strong><span>{label}</span><small>{sub}</small></div>; }
function PanelHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) { return <div className="panelHeader"><h2>{title}</h2>{action && <button className="textButton" onClick={onAction}>{action} →</button>}</div>; }
function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <section className="pageIntro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></section>; }
function QuickAction({ title, text, button, onClick }: { title: string; text: string; button: string; onClick: () => void }) { return <div className="quickCard"><span className="quickIcon">✦</span><h3>{title}</h3><p>{text}</p><button className="textButton" onClick={onClick}>{button} →</button></div>; }
function EmptyState({ title, text, button, onClick }: { title: string; text: string; button?: string; onClick?: () => void }) { return <div className="emptyState"><span>○</span><strong>{title}</strong><p>{text}</p>{button && onClick && <button className="secondaryButton" onClick={onClick}>{button}</button>}</div>; }
function Pulse({ label, value }: { label: string; value: number }) { return <div className="pulseItem"><div><span>{label}</span><strong>{value}%</strong></div><div className="progressTrack"><span style={{ width: `${value}%` }} /></div></div>; }
function Prompt({ text }: { text: string }) { return <div className="promptCard"><span>?</span><p>{text}</p></div>; }
function ActivityCard({ title, text }: { title: string; text: string }) { return <div className="activityMini"><span>◎</span><strong>{title}</strong><p>{text}</p></div>; }
function Evidence({ title, text }: { title: string; text: string }) { return <div className="evidenceItem"><span>✓</span><div><strong>{title}</strong><p>{text}</p></div></div>; }
function ResourceCard({ title, tag, items }: { title: string; tag: string; items: string[] }) { return <article className="resourceCard"><span>{tag}</span><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul><button className="secondaryButton">Use template</button></article>; }
function LockedFeature({ title, text, onUpgrade }: { title: string; text: string; onUpgrade: () => void }) { return <section className="lockedFeature"><div className="lockOrb">✦</div><span className="eyebrow">UPGRADE ACCESS</span><h1>{title}</h1><p>{text}</p><button className="primaryButton" onClick={onUpgrade}>View plans</button></section>; }

function isCourseComplete(course: Course, progress?: Progress[string]) {
  return Boolean(progress && course.modules.every((module) => progress.completedModules.includes(module.id)));
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "SD";
}

function pageTitle(view: View) {
  return nav.find((item) => item.id === view)?.label || "Staff Development";
}

function pageEyebrow(view: View) {
  if (["regulation", "practice", "students", "interventions"].includes(view)) return "Pupil regulation & support";
  if (["staff", "resources", "plans"].includes(view)) return "Whole-school implementation";
  return "Professional learning";
}
