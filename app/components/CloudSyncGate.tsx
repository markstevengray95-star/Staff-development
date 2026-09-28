"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { courses } from "@/lib/catalogue";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const STORAGE_KEY = "staff-development-platform-v1";
const FREE_COURSE_ID = "zones-foundations";

type Plan = "Free" | "Plus" | "Pro" | "School";
type Progress = Record<string, { completedModules: string[]; reflections: Record<string, string>; completedAt?: string }>;
type CheckIn = { id: string; name: string; zone: "blue" | "green" | "yellow" | "red"; note: string; createdAt: string };
type Intervention = {
  id: string;
  student: string;
  focus: string;
  zone: "blue" | "green" | "yellow" | "red";
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

type ProductEntitlement = {
  product_code: "single_cpd" | "all_cpd";
  course_id: string | null;
  status: string;
  expires_at: string | null;
};

const planRank: Record<Plan, number> = { Free: 0, Plus: 1, Pro: 2, School: 3 };
const titleToCourseId = new Map(courses.map((course) => [course.title, course.id]));

const defaultState: SavedState = {
  plan: "Free",
  progress: {},
  checkIns: [],
  interventions: [],
  staffName: "Staff member",
  schoolName: "Personal workspace",
};

function parseState(raw: string | null): SavedState {
  if (!raw) return defaultState;
  try {
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      ...defaultState,
      ...parsed,
      progress: parsed.progress || {},
      checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [],
      interventions: Array.isArray(parsed.interventions) ? parsed.interventions : [],
    };
  } catch {
    return defaultState;
  }
}

function normalisePlan(value: unknown): Plan {
  const raw = String(value || "").toLowerCase();
  if (raw === "school") return "School";
  if (raw === "pro") return "Pro";
  if (raw === "plus") return "Plus";
  return "Free";
}

function isActive(status: string | null | undefined) {
  return status === "active" || status === "trialing";
}

function productIsActive(item: ProductEntitlement) {
  if (!isActive(item.status)) return false;
  return !item.expires_at || new Date(item.expires_at).getTime() > Date.now();
}

function serverLockedState(state: SavedState, plan: Plan, staffName: string, schoolName: string): SavedState {
  return { ...state, plan, staffName, schoolName };
}

export default function CloudSyncGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [plan, setPlan] = useState<Plan>("Free");
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [staffName, setStaffName] = useState("Staff member");
  const [schoolName, setSchoolName] = useState("Personal workspace");
  const [allCpd, setAllCpd] = useState(false);
  const [singleCourseIds, setSingleCourseIds] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const lastLocal = useRef("");
  const syncing = useRef(false);
  const userId = useRef<string | null>(null);

  const bypassGate = pathname === "/auth" || pathname === "/reset-password";

  useEffect(() => {
    if (bypassGate) {
      setReady(true);
      return;
    }

    let active = true;
    const supabase = getSupabaseBrowserClient();

    async function hydrate() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        const next = `${window.location.pathname}${window.location.search}`;
        window.location.replace(`/auth?next=${encodeURIComponent(next)}`);
        return;
      }

      const user = session.user;
      userId.current = user.id;
      const metadataName = String(user.user_metadata?.full_name || user.user_metadata?.name || "").trim();
      const fallbackName = metadataName || user.email?.split("@")[0] || "Staff member";

      const { data: profile } = await supabase
        .from("staff_development_profiles")
        .select("display_name,preferred_organization_id")
        .eq("user_id", user.id)
        .maybeSingle();

      let orgId = profile?.preferred_organization_id || null;
      let org: { id: string; name: string; seat_limit: number; owner_user_id: string } | null = null;

      if (!orgId) {
        const { data: seat } = await supabase
          .from("school_seat_entitlements")
          .select("organization_id,active")
          .eq("user_id", user.id)
          .eq("active", true)
          .limit(1)
          .maybeSingle();
        orgId = seat?.organization_id || null;
      }

      if (!orgId) {
        const { data: owned } = await supabase
          .from("school_organizations")
          .select("id,name,seat_limit,owner_user_id")
          .eq("owner_user_id", user.id)
          .limit(1)
          .maybeSingle();
        if (owned) {
          org = owned;
          orgId = owned.id;
        }
      }

      if (!orgId) {
        const { data: membership } = await supabase
          .from("school_organization_members")
          .select("organization_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();
        orgId = membership?.organization_id || null;
      }

      if (orgId && !org) {
        const { data: foundOrg } = await supabase
          .from("school_organizations")
          .select("id,name,seat_limit,owner_user_id")
          .eq("id", orgId)
          .maybeSingle();
        org = foundOrg || null;
      }

      const displayName = profile?.display_name?.trim() || fallbackName;
      const displaySchool = org?.name || "Personal workspace";

      await supabase.from("staff_development_profiles").upsert({
        user_id: user.id,
        display_name: displayName,
        preferred_organization_id: orgId,
        updated_at: new Date().toISOString(),
      });

      const [{ data: personalSubscription }, { data: orgEntitlement }, { data: productEntitlements }] = await Promise.all([
        supabase.from("subscriptions").select("tier,status").eq("user_id", user.id).maybeSingle(),
        orgId
          ? supabase.from("staff_development_org_entitlements").select("plan_tier,status,seat_limit").eq("organization_id", orgId).maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("staff_development_product_entitlements")
          .select("product_code,course_id,status,expires_at")
          .eq("user_id", user.id),
      ]);

      let resolvedPlan = isActive(personalSubscription?.status) ? normalisePlan(personalSubscription?.tier) : "Free";
      if (orgId && orgEntitlement && isActive(orgEntitlement.status)) {
        const orgPlan = normalisePlan(orgEntitlement.plan_tier);
        if (planRank[orgPlan] > planRank[resolvedPlan]) resolvedPlan = orgPlan;
      } else if (orgId && org) {
        const { data: seat } = await supabase
          .from("school_seat_entitlements")
          .select("active")
          .eq("user_id", user.id)
          .eq("organization_id", orgId)
          .maybeSingle();
        if (seat?.active) {
          const inferred: Plan = org.seat_limit > 60 ? "School" : org.seat_limit > 5 ? "Pro" : "Plus";
          if (planRank[inferred] > planRank[resolvedPlan]) resolvedPlan = inferred;
        }
      }

      const products = (productEntitlements || []) as ProductEntitlement[];
      const hasAllCpd = products.some((item) => item.product_code === "all_cpd" && productIsActive(item));
      const courseIds = products
        .filter((item) => item.product_code === "single_cpd" && item.course_id && productIsActive(item))
        .map((item) => item.course_id as string);

      const [{ data: progressRows }, { data: checkinRows }, { data: interventionRows }] = await Promise.all([
        supabase
          .from("staff_development_course_progress")
          .select("course_id,completed_modules,reflections,completed_at")
          .eq("user_id", user.id),
        supabase
          .from("staff_development_checkins")
          .select("id,subject_ref,zone,note,created_at")
          .eq("created_by", user.id)
          .order("created_at", { ascending: false })
          .limit(80),
        supabase
          .from("staff_development_interventions")
          .select("id,student_ref,focus,zone,strategy,review_date,status,notes")
          .eq("created_by", user.id)
          .order("created_at", { ascending: false }),
      ]);

      const local = parseState(window.localStorage.getItem(STORAGE_KEY));
      const cloudProgress: Progress = {};
      for (const row of progressRows || []) {
        cloudProgress[row.course_id] = {
          completedModules: row.completed_modules || [],
          reflections: row.reflections || {},
          ...(row.completed_at ? { completedAt: row.completed_at } : {}),
        };
      }

      const cloudCheckIns: CheckIn[] = (checkinRows || []).map((row) => ({
        id: row.id,
        name: row.subject_ref,
        zone: row.zone,
        note: row.note || "",
        createdAt: row.created_at,
      }));
      const cloudInterventions: Intervention[] = (interventionRows || []).map((row) => ({
        id: row.id,
        student: row.student_ref,
        focus: row.focus,
        zone: row.zone || "yellow",
        strategy: row.strategy,
        reviewDate: row.review_date || "",
        status: row.status,
        notes: row.notes || "",
      }));

      const hasCloudData = Object.keys(cloudProgress).length > 0 || cloudCheckIns.length > 0 || cloudInterventions.length > 0;
      const starting = serverLockedState(
        hasCloudData
          ? { ...local, progress: cloudProgress, checkIns: cloudCheckIns, interventions: cloudInterventions }
          : local,
        resolvedPlan,
        displayName,
        displaySchool,
      );

      const startingJson = JSON.stringify(starting);
      window.localStorage.setItem(STORAGE_KEY, startingJson);
      lastLocal.current = startingJson;

      if (!hasCloudData && (Object.keys(local.progress).length || local.checkIns.length || local.interventions.length)) {
        await syncState(local, user.id, orgId);
      }

      if (!active) return;
      setPlan(resolvedPlan);
      setOrganizationId(orgId);
      setStaffName(displayName);
      setSchoolName(displaySchool);
      setAllCpd(hasAllCpd);
      setSingleCourseIds(courseIds);
      setReady(true);
    }

    hydrate().catch((error) => {
      console.error("Staff Development cloud hydration failed", error);
      if (active) {
        setNotice("Cloud sync could not start. Your local data has not been deleted.");
        setReady(true);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !bypassGate) window.location.replace("/auth");
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [bypassGate]);

  useEffect(() => {
    if (!ready || bypassGate || !userId.current) return;

    const timer = window.setInterval(async () => {
      if (syncing.current || !userId.current) return;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw || raw === lastLocal.current) return;

      const current = parseState(raw);
      const locked = serverLockedState(current, plan, staffName, schoolName);
      const lockedJson = JSON.stringify(locked);
      if (lockedJson !== raw) window.localStorage.setItem(STORAGE_KEY, lockedJson);
      lastLocal.current = lockedJson;

      syncing.current = true;
      try {
        await syncState(locked, userId.current, organizationId);
      } catch (error) {
        console.error("Staff Development cloud sync failed", error);
        setNotice("A change is still saved on this device but has not reached the cloud yet.");
      } finally {
        syncing.current = false;
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [ready, bypassGate, plan, staffName, schoolName, organizationId]);

  useEffect(() => {
    if (!ready || bypassGate) return;

    function notify(message: string) {
      setNotice(message);
      window.setTimeout(() => setNotice(""), 4200);
    }

    async function startCheckout(kind: "plan" | "single_cpd" | "all_cpd" | "seat", product: string, courseId?: string) {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        window.location.assign("/auth");
        return;
      }
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ kind, product, courseId, organizationId }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.url) {
        notify(payload.error || "Billing is not configured on this deployment yet.");
        return;
      }
      window.location.assign(payload.url);
    }

    function clickCapture(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const planButton = target.closest(".planCard button") as HTMLButtonElement | null;
      if (planButton) {
        const card = planButton.closest(".planCard");
        const requested = card?.querySelector(".planName")?.textContent?.trim() as Plan | undefined;
        if (!requested || requested === plan) return;
        event.preventDefault();
        event.stopPropagation();
        if (requested === "Free") {
          notify("Paid plans are managed through billing. Cancel or change the subscription from the billing account rather than changing local access.");
          return;
        }
        if (!organizationId) {
          window.location.assign(`/setup-school?plan=${encodeURIComponent(requested)}`);
          return;
        }
        void startCheckout("plan", requested.toLowerCase());
        return;
      }

      const courseButton = target.closest(".courseCard,.courseRow") as HTMLElement | null;
      if (!courseButton) return;
      if (planRank[plan] >= planRank.Plus || allCpd) return;

      const title = courseButton.querySelector("h3,strong")?.textContent?.trim() || "";
      const courseId = titleToCourseId.get(title);
      if (!courseId || courseId === FREE_COURSE_ID || singleCourseIds.includes(courseId)) return;

      event.preventDefault();
      event.stopPropagation();
      notify("Free includes the Zones foundations CPD. Unlock this course for £9.99/month, all CPD for £89.99/month, or choose Plus.");
    }

    document.addEventListener("click", clickCapture, true);
    return () => document.removeEventListener("click", clickCapture, true);
  }, [ready, bypassGate, plan, organizationId, allCpd, singleCourseIds]);

  if (bypassGate) return <>{children}</>;
  if (!ready) {
    return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui", background: "#f4f7f8", color: "#173f57" }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: 32 }}><strong style={{ fontSize: 24 }}>Opening Staff Development…</strong><p>Connecting your account, school access and saved progress.</p></div>
    </main>;
  }

  return <>
    {children}
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 1000, display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 999, background: "rgba(255,255,255,.96)", boxShadow: "0 10px 30px rgba(22,45,55,.16)", border: "1px solid rgba(23,63,87,.12)", font: "12px system-ui", color: "#173f57" }}>
      <span><b>{plan}</b> · cloud synced</span>
      <button type="button" onClick={async () => { await getSupabaseBrowserClient().auth.signOut(); window.location.replace("/auth"); }} style={{ border: 0, background: "transparent", textDecoration: "underline", cursor: "pointer", color: "inherit" }}>Sign out</button>
    </div>
    {notice && <div role="status" style={{ position: "fixed", left: "50%", bottom: 72, transform: "translateX(-50%)", zIndex: 1200, maxWidth: 560, padding: "12px 16px", borderRadius: 12, background: "#173f57", color: "white", boxShadow: "0 12px 36px rgba(0,0,0,.22)", font: "14px system-ui" }}>{notice}</div>}
  </>;
}

async function syncState(state: SavedState, uid: string, organizationId: string | null) {
  const supabase = getSupabaseBrowserClient();
  const now = new Date().toISOString();
  const progressRows = Object.entries(state.progress).map(([courseId, progress]) => ({
    user_id: uid,
    organization_id: organizationId,
    course_id: courseId,
    completed_modules: progress.completedModules || [],
    reflections: progress.reflections || {},
    completed_at: progress.completedAt || null,
    updated_at: now,
  }));
  if (progressRows.length) {
    const { error } = await supabase.from("staff_development_course_progress").upsert(progressRows, { onConflict: "user_id,course_id" });
    if (error) throw error;
  }

  if (state.checkIns.length) {
    const { error } = await supabase.from("staff_development_checkins").upsert(
      state.checkIns.map((item) => ({
        id: item.id,
        organization_id: organizationId,
        created_by: uid,
        subject_ref: item.name,
        zone: item.zone,
        note: item.note || "",
        created_at: item.createdAt,
      })),
      { onConflict: "id" },
    );
    if (error) throw error;
  }

  if (state.interventions.length) {
    const { error } = await supabase.from("staff_development_interventions").upsert(
      state.interventions.map((item) => ({
        id: item.id,
        organization_id: organizationId,
        created_by: uid,
        student_ref: item.student,
        focus: item.focus,
        zone: item.zone,
        strategy: item.strategy,
        review_date: item.reviewDate || null,
        status: item.status,
        notes: item.notes || "",
        updated_at: now,
      })),
      { onConflict: "id" },
    );
    if (error) throw error;
  }
}
