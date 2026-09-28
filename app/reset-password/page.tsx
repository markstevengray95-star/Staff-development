"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Opening your secure reset link…");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        setReady(true);
        setMessage("");
      } else {
        setMessage("This reset link is invalid or has expired. Return to sign in and request a new one.");
      }
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
        setMessage("");
      }
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setMessage("The passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }
    setBusy(true);
    const { error } = await getSupabaseBrowserClient().auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Password updated. Returning to Staff Development…");
    window.setTimeout(() => window.location.replace("/"), 900);
  }

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "linear-gradient(135deg,#edf4f4,#f8faf8)", fontFamily: "system-ui", color: "#173f57" }}>
    <section style={{ width: "100%", maxWidth: 460, background: "white", borderRadius: 24, padding: 34, boxShadow: "0 24px 70px rgba(25,58,70,.14)" }}>
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: "#4b7685" }}>STAFF DEVELOPMENT</span>
      <h1 style={{ margin: "10px 0 8px", fontSize: 32 }}>Choose a new password</h1>
      <p style={{ color: "#61747c", lineHeight: 1.55 }}>Your reset link returns to this app, so it cannot accidentally send you into one of your other projects.</p>
      {ready && <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 22 }}>
        <label style={{ display: "grid", gap: 7, fontSize: 13, fontWeight: 700 }}>New password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={{ padding: 12, borderRadius: 10, border: "1px solid #cbd7dc", font: "inherit" }} /></label>
        <label style={{ display: "grid", gap: 7, fontSize: 13, fontWeight: 700 }}>Confirm password<input required minLength={8} type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} style={{ padding: 12, borderRadius: 10, border: "1px solid #cbd7dc", font: "inherit" }} /></label>
        <button disabled={busy} style={{ border: 0, borderRadius: 11, padding: 13, background: "#173f57", color: "white", fontWeight: 800, cursor: "pointer" }}>{busy ? "Saving…" : "Save new password"}</button>
      </form>}
      {message && <div role="status" style={{ marginTop: 18, padding: 12, borderRadius: 10, background: "#eef5f7", fontSize: 13, lineHeight: 1.45 }}>{message}</div>}
      <a href="/auth" style={{ display: "inline-block", marginTop: 18, color: "#285f75" }}>Back to sign in</a>
    </section>
  </main>;
}
