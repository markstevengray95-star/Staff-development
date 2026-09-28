"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function SetupSchoolPage() {
  const [schoolName, setSchoolName] = useState("");
  const [domain, setDomain] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSupabaseBrowserClient().auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.replace(`/auth?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      setUserId(data.user.id);
      const emailDomain = data.user.email?.split("@")[1]?.toLowerCase() || "";
      if (emailDomain) setDomain(emailDomain);
    });
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!userId) return;
    setBusy(true);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    try {
      const joinCode = crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();
      const { data: org, error: orgError } = await supabase
        .from("school_organizations")
        .insert({ owner_user_id: userId, name: schoolName.trim(), join_code: joinCode, seat_limit: 5, status: "active" })
        .select("id")
        .single();
      if (orgError) throw orgError;

      const { error: memberError } = await supabase.from("school_organization_members").insert({
        organization_id: org.id,
        user_id: userId,
        role: "owner",
      });
      if (memberError) throw memberError;

      const cleanDomain = domain.trim().toLowerCase().replace(/^@/, "");
      if (cleanDomain) {
        const { error: domainError } = await supabase.from("staff_development_school_domains").insert({
          domain: cleanDomain,
          organization_id: org.id,
          verified: false,
          created_by: userId,
        });
        if (domainError) throw domainError;
      }

      await supabase.from("staff_development_profiles").upsert({
        user_id: userId,
        preferred_organization_id: org.id,
        updated_at: new Date().toISOString(),
      });

      const requested = new URLSearchParams(window.location.search).get("plan");
      window.location.replace(requested ? `/?buy=${encodeURIComponent(requested)}` : "/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create the school workspace.");
      setBusy(false);
    }
  }

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "linear-gradient(135deg,#eef5f5,#fafbf9)", fontFamily: "system-ui", color: "#173f57" }}>
    <section style={{ width: "100%", maxWidth: 560, padding: 36, borderRadius: 24, background: "white", boxShadow: "0 24px 70px rgba(25,58,70,.14)" }}>
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: "#4b7685" }}>SCHOOL WORKSPACE</span>
      <h1 style={{ fontSize: 34, margin: "10px 0 8px" }}>Set up your school</h1>
      <p style={{ color: "#61747c", lineHeight: 1.6 }}>Paid Plus, Pro and School plans use an organisation workspace so seats, staff roles and whole-school records stay together.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 16, marginTop: 24 }}>
        <label style={{ display: "grid", gap: 7, fontWeight: 700, fontSize: 13 }}>School name<input required value={schoolName} onChange={(event) => setSchoolName(event.target.value)} placeholder="e.g. Adcote School for Girls" style={{ padding: 12, borderRadius: 10, border: "1px solid #cbd7dc", font: "inherit" }} /></label>
        <label style={{ display: "grid", gap: 7, fontWeight: 700, fontSize: 13 }}>School email domain<input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="school.org.uk" style={{ padding: 12, borderRadius: 10, border: "1px solid #cbd7dc", font: "inherit" }} /><small style={{ fontWeight: 400, color: "#6b7c84" }}>The domain is created as unverified. Staff auto-join only after it has been explicitly verified.</small></label>
        <button disabled={busy || !userId} style={{ border: 0, borderRadius: 11, padding: 13, background: "#173f57", color: "white", fontWeight: 800, cursor: "pointer" }}>{busy ? "Creating…" : "Create school workspace"}</button>
      </form>
      {message && <div role="status" style={{ marginTop: 18, padding: 12, borderRadius: 10, background: "#eef5f7", fontSize: 13 }}>{message}</div>}
      <a href="/" style={{ display: "inline-block", marginTop: 20, color: "#285f75" }}>Back to platform</a>
    </section>
  </main>;
}
