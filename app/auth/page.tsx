"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) window.location.replace(nextPath());
    });
    return () => { mounted = false; };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        window.location.replace(nextPath());
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(nextPath())}`,
          },
        });
        if (error) throw error;
        if (data.session) window.location.replace(nextPath());
        else setMessage("Account created. Check your email to confirm it, then return here to sign in.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to authenticate.");
    } finally {
      setBusy(false);
    }
  }

  async function oauth(provider: "google" | "azure") {
    const supabase = getSupabaseBrowserClient();
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(nextPath())}`,
        ...(provider === "azure" ? { scopes: "email" } : {}),
      },
    });
    if (error) {
      setMessage(error.message);
      setBusy(false);
    }
  }

  async function magicLink() {
    if (!email.trim()) {
      setMessage("Enter your email address first.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(nextPath())}` },
    });
    setBusy(false);
    setMessage(error ? error.message : "Sign-in link sent. Open it from your email to continue.");
  }

  async function resetPassword() {
    if (!email.trim()) {
      setMessage("Enter your email address first.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    setMessage(error ? error.message : "Password reset email sent.");
  }

  return <main style={styles.page}>
    <section style={styles.hero}>
      <span style={styles.eyebrow}>STAFF DEVELOPMENT</span>
      <h1 style={styles.heroTitle}>One account for CPD, regulation and whole-school support.</h1>
      <p style={styles.heroText}>Your CPD progress, regulation check-ins and intervention records now sync securely to the shared school platform instead of being tied to one browser.</p>
      <div style={styles.featureGrid}>
        <Feature title="Cloud progress" text="Continue CPD on another device." />
        <Feature title="School access" text="Plans and seats come from the server, not local settings." />
        <Feature title="Protected records" text="School data is scoped with row-level security." />
      </div>
    </section>

    <section style={styles.card}>
      <span style={styles.eyebrow}>{mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}</span>
      <h2 style={{ margin: "8px 0 6px", fontSize: 28 }}>{mode === "signin" ? "Welcome back" : "Create your Staff Development account"}</h2>
      <p style={styles.muted}>Use your school email where possible so your organisation can add you to a paid school plan.</p>

      <button style={styles.provider} disabled={busy} onClick={() => oauth("google")}><b>G</b><span>Continue with Google</span></button>
      <button style={styles.provider} disabled={busy} onClick={() => oauth("azure")}><b>▦</b><span>Continue with Microsoft</span></button>
      <div style={styles.divider}><span>or use email</span></div>

      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        {mode === "signup" && <label style={styles.label}>Full name<input style={styles.input} required value={name} onChange={(event) => setName(event.target.value)} /></label>}
        <label style={styles.label}>Email<input style={styles.input} required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label style={styles.label}>Password<input style={styles.input} required minLength={8} type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button style={styles.primary} disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
      </form>

      {mode === "signin" && <div style={styles.actionRow}>
        <button style={styles.linkButton} disabled={busy} onClick={magicLink}>Email me a sign-in link</button>
        <button style={styles.linkButton} disabled={busy} onClick={resetPassword}>Reset password</button>
      </div>}

      <button style={{ ...styles.linkButton, marginTop: 10 }} onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }}>
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>

      {message && <div style={styles.notice} role="status">{message}</div>}
    </section>
  </main>;
}

function Feature({ title, text }: { title: string; text: string }) {
  return <div style={styles.feature}><strong>{title}</strong><span>{text}</span></div>;
}

function nextPath() {
  if (typeof window === "undefined") return "/";
  const value = new URLSearchParams(window.location.search).get("next") || "/";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(360px,.85fr)", gap: 32, alignItems: "center", padding: "clamp(24px,5vw,72px)", fontFamily: "system-ui,-apple-system,sans-serif", background: "linear-gradient(135deg,#edf4f4,#f8faf8 55%,#eef3f7)", color: "#173f57" },
  hero: { maxWidth: 720 },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: "#4b7685" },
  heroTitle: { fontSize: "clamp(38px,5vw,66px)", lineHeight: 1.02, letterSpacing: "-.045em", margin: "12px 0 20px" },
  heroText: { fontSize: 18, lineHeight: 1.65, color: "#49636d", maxWidth: 650 },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12, marginTop: 28 },
  feature: { display: "grid", gap: 5, padding: 16, borderRadius: 16, background: "rgba(255,255,255,.74)", border: "1px solid rgba(23,63,87,.10)" },
  card: { width: "100%", maxWidth: 510, justifySelf: "end", padding: "clamp(24px,4vw,42px)", borderRadius: 26, background: "rgba(255,255,255,.94)", boxShadow: "0 24px 70px rgba(25,58,70,.15)", border: "1px solid rgba(23,63,87,.09)" },
  muted: { color: "#61747c", lineHeight: 1.55, marginBottom: 22 },
  provider: { width: "100%", display: "flex", gap: 12, alignItems: "center", justifyContent: "center", padding: "13px 16px", marginTop: 10, borderRadius: 12, border: "1px solid #cdd9de", background: "white", color: "#173f57", fontWeight: 700, cursor: "pointer" },
  divider: { textAlign: "center", color: "#819199", fontSize: 12, margin: "18px 0" },
  label: { display: "grid", gap: 7, fontSize: 13, fontWeight: 750 },
  input: { width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: 10, border: "1px solid #cbd7dc", font: "inherit", outline: "none" },
  primary: { border: 0, borderRadius: 11, padding: "13px 16px", background: "#173f57", color: "white", fontWeight: 800, cursor: "pointer" },
  actionRow: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12, flexWrap: "wrap" },
  linkButton: { border: 0, padding: 0, background: "transparent", color: "#285f75", textDecoration: "underline", cursor: "pointer", font: "inherit", fontSize: 13 },
  notice: { marginTop: 18, padding: 12, borderRadius: 10, background: "#eef5f7", color: "#214d5f", fontSize: 13, lineHeight: 1.45 },
};
