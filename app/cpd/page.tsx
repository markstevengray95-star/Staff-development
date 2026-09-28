"use client";

import { useEffect, useMemo, useState } from "react";
import { categoryOrder, courses } from "teaching-cpd/lib/catalogue";
import type { Course, Module } from "teaching-cpd/lib/data";
import CourseLab from "teaching-cpd/app/components/CourseLab";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type ProgressItem = { completedModules: string[]; reflections: Record<string, string>; completedAt?: string };
type ProgressState = Record<string, ProgressItem>;
type ProductEntitlement = { product_code: "single_cpd" | "all_cpd"; course_id: string | null; status: string; expires_at: string | null };
type View = "library" | "mycpd" | "certificates";

const FREE_COURSE_ID = "effective-questioning";

export default function FullCpdLibrary() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("library");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<ProgressState>({});
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("Staff member");
  const [platformAdmin, setPlatformAdmin] = useState(false);
  const [allAccess, setAllAccess] = useState(false);
  const [singleCourseIds, setSingleCourseIds] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        window.location.replace(`/auth?next=${encodeURIComponent("/cpd")}`);
        return;
      }

      const [{ data: profile }, { data: rows }, { data: products }] = await Promise.all([
        supabase.from("staff_development_profiles").select("display_name,platform_role").eq("user_id", auth.user.id).maybeSingle(),
        supabase.from("staff_development_course_progress").select("course_id,completed_modules,reflections,completed_at").eq("user_id", auth.user.id),
        supabase.from("staff_development_product_entitlements").select("product_code,course_id,status,expires_at").eq("user_id", auth.user.id),
      ]);

      if (!active) return;
      const state: ProgressState = {};
      for (const row of rows || []) {
        state[row.course_id] = {
          completedModules: row.completed_modules || [],
          reflections: (row.reflections || {}) as Record<string, string>,
          ...(row.completed_at ? { completedAt: row.completed_at } : {}),
        };
      }

      const entitlements = (products || []) as ProductEntitlement[];
      const activeProducts = entitlements.filter(productActive);
      const hasAllCpd = activeProducts.some((item) => item.product_code === "all_cpd");
      const singles = activeProducts.filter((item) => item.product_code === "single_cpd" && item.course_id).map((item) => item.course_id as string);
      const localPlan = readLocalPlan();
      const isAdmin = profile?.platform_role === "admin";
      const planIncludesAllCpd = ["Plus", "Pro", "School"].includes(localPlan);

      setUserId(auth.user.id);
      setDisplayName(profile?.display_name?.trim() || auth.user.user_metadata?.full_name || auth.user.email?.split("@")[0] || "Staff member");
      setPlatformAdmin(isAdmin);
      setAllAccess(isAdmin || hasAllCpd || planIncludesAllCpd);
      setSingleCourseIds(singles);
      setProgress(state);
      setReady(true);
    })().catch((error) => {
      console.error(error);
      if (active) {
        setNotice("The CPD library could not load your cloud record. Return to the main platform and try again.");
        setReady(true);
      }
    });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => courses.filter((course) => {
    const matchesCategory = category === "All" || course.category === category;
    const haystack = `${course.title} ${course.summary} ${course.category} ${course.recommendedFor.join(" ")}`.toLowerCase();
    return matchesCategory && haystack.includes(search.toLowerCase());
  }), [search, category]);

  const completed = useMemo(() => courses.filter((course) => isCourseComplete(course, progress[course.id])), [progress]);
  const active = useMemo(() => courses.filter((course) => {
    const item = progress[course.id];
    return Boolean(item?.completedModules.length) && !isCourseComplete(course, item);
  }), [progress]);

  function canOpen(course: Course) {
    return allAccess || course.id === FREE_COURSE_ID || singleCourseIds.includes(course.id);
  }

  function openCourse(course: Course) {
    if (!canOpen(course)) {
      flash("This course is locked on the Free plan. Plus includes the complete CPD library, or this course can be unlocked individually.");
      return;
    }
    setSelectedCourse(course);
  }

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4500);
  }

  async function completeModule(course: Course, module: Module, reflection?: string) {
    if (!userId) return;
    const current = progress[course.id] || { completedModules: [], reflections: {} };
    const completedModules = current.completedModules.includes(module.id) ? current.completedModules : [...current.completedModules, module.id];
    const reflections = reflection === undefined ? current.reflections : { ...current.reflections, [module.id]: reflection };
    const finished = course.modules.every((item) => completedModules.includes(item.id));
    const next: ProgressItem = {
      completedModules,
      reflections,
      ...(finished ? { completedAt: current.completedAt || new Date().toISOString() } : current.completedAt ? { completedAt: current.completedAt } : {}),
    };
    setProgress((previous) => ({ ...previous, [course.id]: next }));
    const { error } = await getSupabaseBrowserClient().from("staff_development_course_progress").upsert({
      user_id: userId,
      course_id: course.id,
      completed_modules: completedModules,
      reflections,
      completed_at: next.completedAt || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,course_id" });
    flash(error ? `Could not save CPD progress: ${error.message}` : finished ? "Course complete — your CPD record has been updated." : "Progress saved to your CPD record.");
  }

  async function saveCourseMeta(course: Course, key: string, value: string) {
    if (!userId) return;
    const current = progress[course.id] || { completedModules: [], reflections: {} };
    const next = { ...current, reflections: { ...current.reflections, [key]: value } };
    setProgress((previous) => ({ ...previous, [course.id]: next }));
    const { error } = await getSupabaseBrowserClient().from("staff_development_course_progress").upsert({
      user_id: userId,
      course_id: course.id,
      completed_modules: next.completedModules,
      reflections: next.reflections,
      completed_at: next.completedAt || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,course_id" });
    if (error) flash(`Could not save Course Lab work: ${error.message}`);
  }

  if (!ready) return <main className="loading">Opening the complete CPD library…</main>;

  return <div className="appShell">
    <aside className="sidebar">
      <button className="brand" onClick={() => { window.location.href = "/"; }} style={{ border: 0, textAlign: "left", width: "100%", cursor: "pointer" }}>
        <div className="brandMark">SD</div><div><strong>Staff Development</strong><span>Complete CPD Library</span></div>
      </button>
      <nav>
        <NavButton icon="▦" label="Course library" active={view === "library"} onClick={() => setView("library")} />
        <NavButton icon="✓" label="My CPD" active={view === "mycpd"} onClick={() => setView("mycpd")} />
        <NavButton icon="◇" label="Certificates" active={view === "certificates"} onClick={() => setView("certificates")} />
        <NavButton icon="←" label="Main platform" active={false} onClick={() => { window.location.href = "/"; }} />
      </nav>
      <div className="sidebarFoot">
        <span className="modeBadge">{platformAdmin ? "PLATFORM ADMIN" : allAccess ? "FULL CPD" : "FREE ACCESS"}</span>
        <small>{platformAdmin ? "All courses and CPD tools are unlocked." : allAccess ? "Complete CPD catalogue included in your access." : "One CPD is included. Upgrade or unlock individual courses for more."}</small>
      </div>
    </aside>

    <main className="main">
      <header className="topbar"><button className="mobileBrand" onClick={() => { window.location.href = "/"; }}>SD</button><div className="topbarSpacer" /><div className="profileMini"><div className="avatar">{initials(displayName)}</div><div><strong>{displayName}</strong><span>{platformAdmin ? "Platform Admin · unrestricted" : allAccess ? "Full CPD access" : "Free CPD access"}</span></div></div></header>
      <div className="content">
        {view === "library" && <>
          <section className="pageTitle"><div><span className="eyebrow">COMPLETE CPD ACADEMY</span><h1>Professional learning built for practice.</h1><p>The full CPD app is now part of Staff Development: detailed reading, presentations, visuals, scenarios, knowledge checks, practice, Course Lab and implementation activities.</p></div></section>
          <section className="statGrid"><Stat value={String(courses.length)} label="Courses" sub="full catalogue" /><Stat value={String(completed.length)} label="Completed" sub="on your record" /><Stat value={String(active.length)} label="In progress" sub="continue learning" /><Stat value={allAccess ? "Full" : "1 + owned"} label="Access" sub={platformAdmin ? "admin unlocked" : "your current plan"} /></section>
          <div className="filters"><input className="search" placeholder="Search courses, topics or roles…" value={search} onChange={(event) => setSearch(event.target.value)} /><div className="chips"><button className={category === "All" ? "chip active" : "chip"} onClick={() => setCategory("All")}>All</button>{categoryOrder.map((item) => <button key={item} className={category === item ? "chip active" : "chip"} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
          <div className="libraryMeta"><strong>{filtered.length} courses</strong><span>Latest CPD presentation build · cloud-saved progress</span></div>
          <div className="cardGrid">{filtered.map((course) => <LibraryCard key={course.id} course={course} state={progress[course.id]} locked={!canOpen(course)} free={course.id === FREE_COURSE_ID && !allAccess} onClick={() => openCourse(course)} />)}</div>
        </>}

        {view === "mycpd" && <>
          <section className="pageTitle"><div><span className="eyebrow">MY CPD</span><h1>Your professional learning record.</h1><p>Continue courses, revisit completed learning and open Course Lab implementation work.</p></div></section>
          <section className="sectionBlock"><PanelHeading title={`In progress (${active.length})`} />{active.length ? <div className="cardGrid">{active.map((course) => <LibraryCard key={course.id} course={course} state={progress[course.id]} locked={!canOpen(course)} onClick={() => openCourse(course)} />)}</div> : <Empty title="Nothing in progress" text="Open a course from the library to begin." />}</section>
          <section className="sectionBlock"><PanelHeading title={`Completed (${completed.length})`} />{completed.length ? <div className="cardGrid">{completed.map((course) => <LibraryCard key={course.id} course={course} state={progress[course.id]} locked={false} onClick={() => openCourse(course)} />)}</div> : <Empty title="No completed CPD yet" text="Complete every module in a course to add it here." />}</section>
        </>}

        {view === "certificates" && <>
          <section className="pageTitle"><div><span className="eyebrow">CERTIFICATES</span><h1>Your CPD certificates.</h1><p>Certificates are generated from the same cloud-saved completion record used by the whole platform.</p></div></section>
          {completed.length ? <div className="certificateGrid">{completed.map((course) => <div className="certificate" key={course.id}><div className="certSeal">✓</div><span className="eyebrow">CERTIFICATE OF CPD</span><h3>{course.title}</h3><p>Awarded to <strong>{displayName}</strong></p><div className="certMeta"><span>{course.duration} minutes</span><span>{new Date(progress[course.id].completedAt || Date.now()).toLocaleDateString("en-GB")}</span></div><button className="secondary full" onClick={() => window.print()}>Print / Save PDF</button></div>)}</div> : <Empty title="No certificates yet" text="Complete a CPD course to generate your first certificate." />}
        </>}
      </div>
    </main>

    {selectedCourse && <CourseWorkspace key={selectedCourse.id} course={selectedCourse} state={progress[selectedCourse.id]} onClose={() => setSelectedCourse(null)} onComplete={completeModule} onSaveMeta={(key, value) => saveCourseMeta(selectedCourse, key, value)} onOpenCourse={openCourse} />}
    {notice && <div className="toast">{notice}</div>}
  </div>;
}

function CourseWorkspace({ course, state, onClose, onComplete, onSaveMeta, onOpenCourse }: { course: Course; state?: ProgressItem; onClose: () => void; onComplete: (course: Course, module: Module, reflection?: string) => Promise<void>; onSaveMeta: (key: string, value: string) => Promise<void>; onOpenCourse: (course: Course) => void }) {
  const completed = state?.completedModules || [];
  const firstIncomplete = course.modules.findIndex((module) => !completed.includes(module.id));
  const [index, setIndex] = useState(firstIncomplete < 0 ? 0 : firstIncomplete);
  const [showLab, setShowLab] = useState(false);
  const module = course.modules[index];
  const percent = state?.completedAt ? 100 : Math.round((completed.length / course.modules.length) * 100);

  return <div className="modalBackdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`courseModal ${showLab ? "labMode" : ""}`}>
      <header className="courseModalHead"><div><span className="eyebrow">{course.category} · {course.level} · {course.duration} MIN</span><h2>{course.title}</h2></div><div className="courseModalHeadActions"><button className={showLab ? "primary courseLabToggle" : "secondary courseLabToggle"} onClick={() => setShowLab((value) => !value)}>{showLab ? "Back to modules" : "Open Course Lab"}</button><button className="iconButton" aria-label="Close course" onClick={onClose}>×</button></div></header>
      <div className="courseProgress"><div><span>{completed.length} of {course.modules.length} modules complete</span><strong>{percent}%</strong></div><div className="progress"><span style={{ width: `${percent}%` }} /></div></div>
      {showLab ? <div className="courseLabViewport"><CourseLab course={course} allCourses={courses} savedMeta={state?.reflections || {}} completedCount={state?.completedAt ? course.modules.length : completed.length} totalModules={course.modules.length} onSaveMeta={onSaveMeta} onOpenCourse={onOpenCourse} /></div> : <div className="moduleLayout">
        <aside className="moduleNav">{course.modules.map((item, itemIndex) => <button key={item.id} className={`${itemIndex === index ? "current" : ""} ${completed.includes(item.id) ? "done" : ""}`} onClick={() => setIndex(itemIndex)}><span>{completed.includes(item.id) ? "✓" : itemIndex + 1}</span><div><strong>{item.title}</strong><small>{item.type}</small></div></button>)}</aside>
        <ModuleViewer course={course} module={module} completed={completed.includes(module.id)} savedResponse={state?.reflections[module.id] || ""} onComplete={onComplete} onPrevious={() => setIndex((value) => Math.max(0, value - 1))} onNext={() => setIndex((value) => Math.min(course.modules.length - 1, value + 1))} index={index} total={course.modules.length} />
      </div>}
    </section>
  </div>;
}

function ModuleViewer({ course, module, completed, savedResponse, onComplete, onPrevious, onNext, index, total }: { course: Course; module: Module; completed: boolean; savedResponse: string; onComplete: (course: Course, module: Module, reflection?: string) => Promise<void>; onPrevious: () => void; onNext: () => void; index: number; total: number }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [response, setResponse] = useState(savedResponse);
  const [checks, setChecks] = useState<number[]>([]);
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { setChoice(null); setResponse(savedResponse); setChecks([]); setFeedback(""); }, [module.id, savedResponse]);

  async function finish() {
    if (module.type === "quiz" && choice !== module.answer) { setFeedback("Choose the correct answer before completing this knowledge check."); return; }
    if (module.type === "scenario" && choice === null) { setFeedback("Choose a response before continuing."); return; }
    if (module.type === "checklist" && checks.length !== module.items.length) { setFeedback("Work through every checklist item before completing this module."); return; }
    if (module.type === "reflection" && response.trim().length < 10) { setFeedback("Add a little more detail so this reflection is useful when you revisit it."); return; }
    if (module.type === "activity" && response.trim().length < (module.minimumCharacters ?? 30)) { setFeedback(`Add at least ${module.minimumCharacters ?? 30} characters before completing this activity.`); return; }
    setBusy(true);
    await onComplete(course, module, module.type === "reflection" || module.type === "activity" ? response.trim() : undefined);
    setBusy(false);
    setFeedback("Saved to your CPD record.");
  }

  return <article className="moduleContent">
    <span className={`moduleType ${module.type}`}>{module.type.toUpperCase()}</span><h2>{module.title}</h2>
    {module.type === "content" && <><p className="lead">{module.body}</p>{module.keyPoints?.length ? <div className="keyPointList">{module.keyPoints.map((point) => <div key={point} className="keyPoint"><span>✓</span><p>{point}</p></div>)}</div> : null}</>}
    {module.type === "quiz" && <div className="interactiveBlock"><p className="lead">{module.question}</p><div className="optionList">{module.options.map((option, optionIndex) => <button key={option} className={choice === optionIndex ? "option selected" : "option"} onClick={() => { setChoice(optionIndex); setFeedback(optionIndex === module.answer ? module.feedback : "Not quite. Review the idea and try another response."); }}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>{feedback && <div className="feedback">{feedback}</div>}</div>}
    {module.type === "scenario" && <div className="interactiveBlock"><p className="lead">{module.prompt}</p><div className="optionList">{module.options.map((option, optionIndex) => <button key={option.label} className={choice === optionIndex ? "option selected" : "option"} onClick={() => { setChoice(optionIndex); setFeedback(option.feedback); }}><span>{optionIndex + 1}</span>{option.label}</button>)}</div>{feedback && <div className="feedback">{feedback}</div>}</div>}
    {module.type === "reflection" && <div className="interactiveBlock"><p className="lead">{module.prompt}</p><textarea className="reflectionBox" value={response} onChange={(event) => setResponse(event.target.value)} placeholder="Record your professional reflection…" />{feedback && <div className="feedback">{feedback}</div>}</div>}
    {module.type === "activity" && <div className="interactiveBlock"><p className="lead">{module.prompt}</p><ol className="activitySteps">{module.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol><textarea className="reflectionBox" value={response} onChange={(event) => setResponse(event.target.value)} placeholder={module.placeholder || "Record your response…"} />{feedback && <div className="feedback">{feedback}</div>}</div>}
    {module.type === "checklist" && <div className="interactiveBlock"><p className="lead">{module.prompt}</p><div className="checklist">{module.items.map((item, itemIndex) => <label key={item}><input type="checkbox" checked={checks.includes(itemIndex)} onChange={() => setChecks((current) => current.includes(itemIndex) ? current.filter((value) => value !== itemIndex) : [...current, itemIndex])} /><span>{item}</span></label>)}</div>{feedback && <div className="feedback">{feedback}</div>}</div>}
    {module.type === "visual" && <div className={`visualModule ${module.layout}`}><p className="lead">{module.caption}</p><div className="visualItems">{module.items.map((item, itemIndex) => <div className="visualItem" key={`${item.heading}-${itemIndex}`}><span className="visualIcon">{item.icon || itemIndex + 1}</span><h3>{item.heading}</h3><p>{item.text}</p></div>)}</div>{feedback && <div className="feedback">{feedback}</div>}</div>}
    <div className="moduleFooter"><button className="secondary" disabled={index === 0} onClick={onPrevious}>← Previous</button><button className={completed ? "secondary" : "primary"} disabled={busy} onClick={finish}>{busy ? "Saving…" : completed ? "Save / revisit" : "Complete module"}</button><button className="secondary" disabled={index === total - 1} onClick={onNext}>Next →</button></div>
  </article>;
}

function LibraryCard({ course, state, locked, free, onClick }: { course: Course; state?: ProgressItem; locked: boolean; free?: boolean; onClick: () => void }) {
  const done = state?.completedModules.length || 0;
  const percent = state?.completedAt ? 100 : Math.round((done / course.modules.length) * 100);
  return <button className="courseCard" onClick={onClick} style={{ textAlign: "left", cursor: "pointer", position: "relative" }}><div className="courseCardTop"><span className="categoryTag">{course.category}</span><span className="levelBadge">{course.level}</span></div><h3>{course.title}</h3><p>{course.summary}</p><div className="courseMeta"><span>{course.duration} min</span><span>{course.modules.length} modules</span>{free && <span>Included</span>}{locked && <span>🔒 Locked</span>}</div><div className="progress"><span style={{ width: `${percent}%` }} /></div><small>{state?.completedAt ? "Completed" : done ? `${done}/${course.modules.length} complete` : locked ? "View access options" : "Ready to start"}</small></button>;
}

function NavButton({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return <button className={active ? "active" : ""} onClick={onClick}><span>{icon}</span>{label}</button>;
}

function Stat({ value, label, sub }: { value: string; label: string; sub: string }) {
  return <div className="statCard"><strong>{value}</strong><span>{label}</span><small>{sub}</small></div>;
}

function PanelHeading({ title }: { title: string }) { return <div className="panelHeading"><h2>{title}</h2></div>; }
function Empty({ title, text }: { title: string; text: string }) { return <div className="emptyState"><strong>{title}</strong><p>{text}</p></div>; }
function initials(name: string) { return name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase(); }
function isCourseComplete(course: Course, state?: ProgressItem) { return Boolean(state?.completedAt || (state && course.modules.every((module) => state.completedModules.includes(module.id)))); }
function productActive(item: ProductEntitlement) { return ["active", "trialing"].includes(item.status) && (!item.expires_at || new Date(item.expires_at).getTime() > Date.now()); }
function readLocalPlan() {
  try {
    const raw = window.localStorage.getItem("staff-development-platform-v1");
    return raw ? String(JSON.parse(raw)?.plan || "Free") : "Free";
  } catch { return "Free"; }
}
