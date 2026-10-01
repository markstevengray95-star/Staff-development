"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { courses } from "@/lib/catalogue";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import "./PersonalisedStaffDashboard.css";

type DashboardTask = {
  id: string;
  title: string;
  dueDate: string;
  priority: "Normal" | "High";
  done: boolean;
};

type DashboardEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  kind: "Lesson" | "Meeting" | "Deadline" | "Event";
  location?: string;
};

type DashboardNotice = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

type RecentResource = {
  href: string;
  label: string;
  usedAt: string;
};

type DashboardStore = {
  tasks: DashboardTask[];
  events: DashboardEvent[];
  notices: DashboardNotice[];
  recent: RecentResource[];
};

type CloudProgress = {
  course_id: string;
  completed_modules: string[] | null;
  completed_at: string | null;
};

const STORE_KEY = "staff-development-dashboard-phase29";

const emptyStore: DashboardStore = {
  tasks: [],
  events: [],
  notices: [],
  recent: [],
};

const navigation = [
  ["/dashboard", "Home", "⌂"],
  ["/teach", "Teach", "✦"],
  ["/students", "Students", "◉"],
  ["/develop", "Develop", "↗"],
  ["/school", "School", "▦"],
  ["/resources", "Resources", "▤"],
] as const;

const quickLinks = [
  { href: "/cpd", label: "Continue CPD", helper: "Open your professional learning", icon: "▣" },
  { href: "/regulation-room", label: "Regulation Room", helper: "Open a regulation support tool", icon: "◇" },
  { href: "/knowledge-base", label: "Knowledge Base", helper: "Find school guidance and resources", icon: "⌕" },
  { href: "/appraisal", label: "Appraisal", helper: "Review objectives and evidence", icon: "✓" },
] as const;

function safeParseStore(value: string | null): DashboardStore {
  if (!value) return emptyStore;
  try {
    const parsed = JSON.parse(value) as Partial<DashboardStore>;
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
      notices: Array.isArray(parsed.notices) ? parsed.notices : [],
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
    };
  } catch {
    return emptyStore;
  }
}

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function prettyDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function fullDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function daysUntil(value: string) {
  const target = new Date(`${value}T12:00:00`).getTime();
  const today = new Date(`${dateKey()}T12:00:00`).getTime();
  return Math.ceil((target - today) / 86_400_000);
}

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "SD";
}

function roleLabel() {
  if (typeof window === "undefined") return "Teacher";
  return window.localStorage.getItem("staff-development-role-label") || "Teacher";
}

export default function PersonalisedStaffDashboard() {
  const [ready, setReady] = useState(false);
  const [store, setStore] = useState<DashboardStore>(emptyStore);
  const [displayName, setDisplayName] = useState("Staff member");
  const [schoolName, setSchoolName] = useState("Your School");
  const [role, setRole] = useState("Teacher");
  const [cloudProgress, setCloudProgress] = useState<CloudProgress[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState(dateKey());
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(dateKey());
  const [eventTime, setEventTime] = useState("09:00");
  const [eventKind, setEventKind] = useState<DashboardEvent["kind"]>("Lesson");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeBody, setNoticeBody] = useState("");
  const [composer, setComposer] = useState<"task" | "event" | "notice" | null>(null);
  const [cloudState, setCloudState] = useState<"loading" | "connected" | "local">("loading");

  useEffect(() => {
    const saved = safeParseStore(window.localStorage.getItem(STORE_KEY));
    setStore(saved);
    setRole(roleLabel());

    try {
      const platformState = JSON.parse(window.localStorage.getItem("staff-development-platform-v1") || "{}") as { staffName?: string; schoolName?: string };
      if (platformState.staffName) setDisplayName(platformState.staffName);
      if (platformState.schoolName) setSchoolName(platformState.schoolName);
    } catch {
      // Keep dashboard defaults when an older local state cannot be parsed.
    }

    let mounted = true;
    const client = getSupabaseBrowserClient();
    (async () => {
      try {
        const { data: auth } = await client.auth.getUser();
        if (!mounted || !auth.user) {
          if (mounted) setCloudState("local");
          return;
        }

        const [{ data: profile }, { data: progress }] = await Promise.all([
          client.from("staff_development_profiles").select("display_name").eq("user_id", auth.user.id).maybeSingle(),
          client.from("staff_development_course_progress").select("course_id,completed_modules,completed_at").eq("user_id", auth.user.id),
        ]);

        if (!mounted) return;
        if (profile?.display_name) setDisplayName(profile.display_name);
        if (progress) setCloudProgress(progress as CloudProgress[]);
        setCloudState("connected");
      } catch {
        if (mounted) setCloudState("local");
      }
    })();

    setReady(true);
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }, [ready, store]);

  const today = dateKey();
  const todayEvents = useMemo(
    () => store.events.filter((event) => event.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [store.events, today],
  );

  const upcoming = useMemo(
    () => store.events.filter((event) => event.date >= today).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).slice(0, 6),
    [store.events, today],
  );

  const openTasks = useMemo(
    () => store.tasks.filter((task) => !task.done).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [store.tasks],
  );

  const attentionTasks = useMemo(
    () => openTasks.filter((task) => daysUntil(task.dueDate) <= 3 || task.priority === "High").slice(0, 5),
    [openTasks],
  );

  const completedCourses = useMemo(() => {
    if (cloudProgress.length) return cloudProgress.filter((item) => Boolean(item.completed_at)).length;
    try {
      const state = JSON.parse(typeof window === "undefined" ? "{}" : window.localStorage.getItem("staff-development-platform-v1") || "{}") as { progress?: Record<string, { completedAt?: string }> };
      return Object.values(state.progress || {}).filter((item) => Boolean(item.completedAt)).length;
    } catch {
      return 0;
    }
  }, [cloudProgress]);

  const inProgressCourses = useMemo(() => {
    if (cloudProgress.length) {
      return cloudProgress.filter((item) => !item.completed_at && (item.completed_modules?.length || 0) > 0).length;
    }
    try {
      const state = JSON.parse(typeof window === "undefined" ? "{}" : window.localStorage.getItem("staff-development-platform-v1") || "{}") as { progress?: Record<string, { completedModules?: string[]; completedAt?: string }> };
      return Object.values(state.progress || {}).filter((item) => !item.completedAt && (item.completedModules?.length || 0) > 0).length;
    } catch {
      return 0;
    }
  }, [cloudProgress]);

  const nextCourse = useMemo(() => {
    const startedIds = new Set(cloudProgress.filter((item) => !item.completed_at && (item.completed_modules?.length || 0) > 0).map((item) => item.course_id));
    return courses.find((course) => startedIds.has(course.id)) || courses.find((course) => !cloudProgress.some((item) => item.course_id === course.id && item.completed_at)) || courses[0];
  }, [cloudProgress]);

  const canPublishNotice = ["Head of Department", "Pastoral Lead", "SLT", "Administrator", "Super Admin"].includes(role);

  function updateStore(recipe: (current: DashboardStore) => DashboardStore) {
    setStore((current) => recipe(current));
  }

  function addTask(event: FormEvent) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title) return;
    updateStore((current) => ({
      ...current,
      tasks: [{ id: crypto.randomUUID(), title, dueDate: taskDue || today, priority: "Normal", done: false }, ...current.tasks],
    }));
    setTaskTitle("");
    setTaskDue(today);
    setComposer(null);
  }

  function addEvent(event: FormEvent) {
    event.preventDefault();
    const title = eventTitle.trim();
    if (!title) return;
    updateStore((current) => ({
      ...current,
      events: [...current.events, { id: crypto.randomUUID(), title, date: eventDate || today, time: eventTime || "09:00", kind: eventKind }],
    }));
    setEventTitle("");
    setEventDate(today);
    setEventTime("09:00");
    setEventKind("Lesson");
    setComposer(null);
  }

  function addNotice(event: FormEvent) {
    event.preventDefault();
    const title = noticeTitle.trim();
    const body = noticeBody.trim();
    if (!title || !body || !canPublishNotice) return;
    updateStore((current) => ({
      ...current,
      notices: [{ id: crypto.randomUUID(), title, body, createdAt: new Date().toISOString() }, ...current.notices].slice(0, 12),
    }));
    setNoticeTitle("");
    setNoticeBody("");
    setComposer(null);
  }

  function toggleTask(id: string) {
    updateStore((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task),
    }));
  }

  function markRecent(href: string, label: string) {
    updateStore((current) => ({
      ...current,
      recent: [{ href, label, usedAt: new Date().toISOString() }, ...current.recent.filter((item) => item.href !== href)].slice(0, 6),
    }));
  }

  if (!ready) return <main className="phase29Loading">Opening your staff dashboard…</main>;

  return (
    <main className="phase29Dashboard">
      <header className="phase29Topbar">
        <Link href="/dashboard" className="phase29Brand"><span>SD</span><div><strong>Staff Development</strong><small>{schoolName}</small></div></Link>
        <nav aria-label="Whole-school navigation">
          {navigation.map(([href, label, icon]) => <Link key={href} href={href} className={href === "/dashboard" ? "active" : ""}><span>{icon}</span>{label}</Link>)}
        </nav>
        <div className="phase29Identity"><span className={`phase29Cloud ${cloudState}`}>{cloudState === "connected" ? "Cloud synced" : cloudState === "loading" ? "Connecting" : "This device"}</span><span className="phase29Avatar">{initials(displayName)}</span></div>
      </header>

      <div className="phase29Canvas">
        <section className="phase29Welcome">
          <div>
            <span className="phase29Eyebrow">{fullDate()}</span>
            <h1>{greeting()}, {displayName.split(" ")[0]}.</h1>
            <p>Your personalised view of teaching, meetings, deadlines, professional development and school activity.</p>
          </div>
          <div className="phase29WelcomeActions">
            <button onClick={() => setComposer("task")}>+ Task</button>
            <button onClick={() => setComposer("event")}>+ Timetable / event</button>
            {canPublishNotice && <button onClick={() => setComposer("notice")}>+ Notice</button>}
          </div>
        </section>

        <section className="phase29SummaryGrid">
          <article><span>Today</span><strong>{todayEvents.length}</strong><small>{todayEvents.length === 1 ? "scheduled item" : "scheduled items"}</small></article>
          <article><span>Tasks</span><strong>{openTasks.length}</strong><small>{attentionTasks.length} need attention</small></article>
          <article><span>CPD</span><strong>{completedCourses}</strong><small>courses completed</small></article>
          <article><span>Role</span><strong className="phase29RoleValue">{role}</strong><small>personalised navigation</small></article>
        </section>

        <section className="phase29MainGrid">
          <div className="phase29PrimaryColumn">
            <Panel title="Today" action={<button onClick={() => setComposer("event")}>Add item</button>}>
              {todayEvents.length ? <div className="phase29Timeline">{todayEvents.map((event) => (
                <div key={event.id} className="phase29TimelineItem">
                  <time>{event.time}</time>
                  <span className={`phase29Kind kind-${event.kind.toLowerCase()}`}>{event.kind}</span>
                  <div><strong>{event.title}</strong>{event.location && <small>{event.location}</small>}</div>
                </div>
              ))}</div> : <Empty title="Nothing added for today" text="Add lessons, duties, meetings or events to build your daily view." button="Add today's first item" onClick={() => setComposer("event")} />}
            </Panel>

            <Panel title="Tasks & deadlines" action={<button onClick={() => setComposer("task")}>New task</button>}>
              {openTasks.length ? <div className="phase29TaskList">{openTasks.slice(0, 7).map((task) => {
                const remaining = daysUntil(task.dueDate);
                return <label key={task.id} className={remaining < 0 ? "overdue" : remaining <= 3 ? "soon" : ""}>
                  <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                  <span><strong>{task.title}</strong><small>{remaining < 0 ? `${Math.abs(remaining)} day${Math.abs(remaining) === 1 ? "" : "s"} overdue` : remaining === 0 ? "Due today" : `Due ${prettyDate(task.dueDate)}`}</small></span>
                </label>;
              })}</div> : <Empty title="No open tasks" text="Use this for planning, appraisal actions, deadlines and personal reminders." button="Add a task" onClick={() => setComposer("task")} />}
            </Panel>

            <Panel title="Upcoming calendar" action={<span className="phase29PanelMeta">Next 6 items</span>}>
              {upcoming.length ? <div className="phase29Upcoming">{upcoming.map((event) => <div key={event.id}><span className="phase29DateTile"><strong>{new Date(`${event.date}T12:00:00`).getDate()}</strong><small>{new Date(`${event.date}T12:00:00`).toLocaleDateString("en-GB", { month: "short" })}</small></span><div><strong>{event.title}</strong><small>{event.time} · {event.kind}</small></div></div>)}</div> : <Empty title="Calendar is clear" text="Upcoming meetings, deadlines and events will appear here when added." />}
            </Panel>
          </div>

          <aside className="phase29SideColumn">
            <section className="phase29Attention">
              <div className="phase29PanelHeading"><div><span>PRIORITY</span><h2>Needs attention</h2></div><strong>{attentionTasks.length}</strong></div>
              {attentionTasks.length ? <div className="phase29AttentionList">{attentionTasks.map((task) => <button key={task.id} onClick={() => toggleTask(task.id)}><span>!</span><div><strong>{task.title}</strong><small>{daysUntil(task.dueDate) < 0 ? "Overdue" : daysUntil(task.dueDate) === 0 ? "Due today" : `${daysUntil(task.dueDate)} day${daysUntil(task.dueDate) === 1 ? "" : "s"} remaining`}</small></div></button>)}</div> : <div className="phase29AllClear"><span>✓</span><div><strong>All clear</strong><small>No urgent dashboard tasks at the moment.</small></div></div>}
            </section>

            <Panel title="Professional development" action={<Link href="/develop">Open Develop</Link>}>
              <div className="phase29CpdBlock">
                <div className="phase29CpdStats"><span><strong>{completedCourses}</strong><small>Complete</small></span><span><strong>{inProgressCourses}</strong><small>In progress</small></span><span><strong>{courses.length}</strong><small>Available</small></span></div>
                {nextCourse && <Link href="/cpd" className="phase29NextCourse" onClick={() => markRecent("/cpd", "CPD Academy")}><span>Continue learning</span><strong>{nextCourse.title}</strong><small>Open CPD Academy →</small></Link>}
              </div>
            </Panel>

            <Panel title="School notices" action={canPublishNotice ? <button onClick={() => setComposer("notice")}>Add</button> : undefined}>
              {store.notices.length ? <div className="phase29NoticeList">{store.notices.slice(0, 4).map((notice) => <article key={notice.id}><strong>{notice.title}</strong><p>{notice.body}</p><small>{new Date(notice.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</small></article>)}</div> : <div className="phase29NoticeEmpty"><strong>No notices yet</strong><p>Leadership notices added to this dashboard will appear here.</p></div>}
            </Panel>
          </aside>
        </section>

        <section className="phase29LowerGrid">
          <Panel title="Quick access" action={<span className="phase29PanelMeta">Common tools</span>}>
            <div className="phase29QuickLinks">{quickLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => markRecent(item.href, item.label)}><span>{item.icon}</span><div><strong>{item.label}</strong><small>{item.helper}</small></div><b>→</b></Link>)}</div>
          </Panel>
          <Panel title="Recently used" action={<Link href="/resources">All resources</Link>}>
            {store.recent.length ? <div className="phase29RecentList">{store.recent.slice(0, 5).map((item) => <Link key={item.href} href={item.href} onClick={() => markRecent(item.href, item.label)}><span>↗</span><div><strong>{item.label}</strong><small>{new Date(item.usedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</small></div></Link>)}</div> : <Empty title="No recent tools yet" text="Tools opened from your dashboard will be kept here for faster access." />}
          </Panel>
        </section>
      </div>

      {composer && <div className="phase29ModalBackdrop" role="presentation" onMouseDown={() => setComposer(null)}>
        <section className="phase29Modal" role="dialog" aria-modal="true" aria-label={`Add ${composer}`} onMouseDown={(event) => event.stopPropagation()}>
          <button className="phase29ModalClose" onClick={() => setComposer(null)} aria-label="Close">×</button>
          {composer === "task" && <form onSubmit={addTask}><span className="phase29Eyebrow">PERSONAL TASK</span><h2>Add task or deadline</h2><label>Task<input autoFocus value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="e.g. Complete Year 10 reports" required /></label><label>Due date<input type="date" value={taskDue} onChange={(event) => setTaskDue(event.target.value)} required /></label><button type="submit" className="phase29Save">Add task</button></form>}
          {composer === "event" && <form onSubmit={addEvent}><span className="phase29Eyebrow">CALENDAR</span><h2>Add timetable or event item</h2><label>Title<input autoFocus value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} placeholder="e.g. Year 11 Physics" required /></label><div className="phase29FormRow"><label>Date<input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} required /></label><label>Time<input type="time" value={eventTime} onChange={(event) => setEventTime(event.target.value)} required /></label></div><label>Type<select value={eventKind} onChange={(event) => setEventKind(event.target.value as DashboardEvent["kind"])}><option>Lesson</option><option>Meeting</option><option>Deadline</option><option>Event</option></select></label><button type="submit" className="phase29Save">Add to dashboard</button></form>}
          {composer === "notice" && <form onSubmit={addNotice}><span className="phase29Eyebrow">SCHOOL NOTICE</span><h2>Add a notice</h2><label>Title<input autoFocus value={noticeTitle} onChange={(event) => setNoticeTitle(event.target.value)} placeholder="Notice title" required /></label><label>Message<textarea value={noticeBody} onChange={(event) => setNoticeBody(event.target.value)} placeholder="Short staff notice" rows={5} required /></label><button type="submit" className="phase29Save">Publish to this dashboard</button></form>}
        </section>
      </div>}
    </main>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <section className="phase29Panel"><div className="phase29PanelHeading"><h2>{title}</h2>{action && <div>{action}</div>}</div>{children}</section>;
}

function Empty({ title, text, button, onClick }: { title: string; text: string; button?: string; onClick?: () => void }) {
  return <div className="phase29Empty"><span>＋</span><div><strong>{title}</strong><p>{text}</p>{button && onClick && <button onClick={onClick}>{button}</button>}</div></div>;
}
