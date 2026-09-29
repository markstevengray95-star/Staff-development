"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const ADMIN_EMAIL = "msgray95@hotmail.com";
const APP_ORIGIN = "https://schoolcpd.vercel.app";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    client.auth.getUser().then(({ data }) => {
      const user = data.user;
      const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL && (user.app_metadata?.platform_admin === true || user.app_metadata?.zones_role === "admin");
      if (isAdmin) window.location.replace("/admin");
    });
  }, []);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const client = getSupabaseBrowserClient();
    const { data, error } = await client.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }
    const user = data.user;
    const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL && (user.app_metadata?.platform_admin === true || user.app_metadata?.zones_role === "admin");
    if (!isAdmin) {
      await client.auth.signOut();
      setMessage("This account is not authorised for platform administration.");
      setBusy(false);
      return;
    }
    window.location.replace("/admin");
  }

  async function resetPassword() {
    setBusy(true);
    setMessage("");
    const { error } = await getSupabaseBrowserClient().auth.resetPasswordForEmail(ADMIN_EMAIL, {
      redirectTo: `${APP_ORIGIN}/reset-password`,
    });
    setBusy(false);
    setMessage(error ? error.message : "Password reset email sent to the administrator email address.");
  }

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "linear-gradient(135deg,#eef5f4,#f8faf9 55%,#edf3f7)", fontFamily: "system-ui,-apple-system,sans-serif", color: "#173f57" }}>
    <section style={{ width: "min(100%,460px)", background: "white", border: "1px solid #d9e4e6", borderRadius: 24, padding: 32, boxShadow: "0 22px 60px rgba(24,57,69,.14)" }}>
      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: ".13em", color: "#397aa3" }}>PLATFORM ADMIN</span>
      <h1 style={{ margin: "9px 0 8px", fontSize: 32, letterSpacing: "-.03em" }}>Staff Development admin</h1>
      <p style={{ color: "#60747b", lineHeight: 1.55, marginBottom: 22 }}>Sign in with the administrator account to access all CPD, Zones, school and management tools.</p>
      <form onSubmit={signIn} style={{ display: "grid", gap: 14 }}>
        <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 750 }}>Admin email
          <input value={ADMIN_EMAIL} readOnly autoComplete="username" style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: 10, border: "1px solid #cbd7dc", background: "#f5f8f9", color: "#314d58" }} />
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 750 }}>Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} type="password" autoComplete="current-password" style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: 10, border: "1px solid #cbd7dc" }} />
        </label>
        <button disabled={busy} style={{ border: 0, borderRadius: 11, padding: "13px 16px", background: "#173f57", color: "white", fontWeight: 850, cursor: "pointer" }}>{busy ? "Signing in…" : "Sign in as platform admin"}</button>
      </form>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <button type="button" disabled={busy} onClick={resetPassword} style={{ border: 0, background: "transparent", color: "#285f75", textDecoration: "underline", cursor: "pointer", padding: 0 }}>Reset admin password</button>
        <a href="/auth?next=/admin" style={{ color: "#61747c", fontSize: 13 }}>Other sign-in options</a>
      </div>
      {message && <div role="status" style={{ marginTop: 18, padding: 12, borderRadius: 10, background: "#eef5f7", color: "#214d5f", fontSize: 13 }}>{message}</div>}
    </section>
  </main>;
}
