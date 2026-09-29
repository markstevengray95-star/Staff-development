"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient, getSupabasePublicConfig } from "@/lib/supabase";

type Mode = "signin" | "signup";
type SignInMethod = "username" | "email";
type SessionPayload = { access_token: string; refresh_token: string; error?: string };

const STAFF_DEVELOPMENT_ORIGIN = "https://schoolcpd.vercel.app";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [signInMethod, setSignInMethod] = useState<SignInMethod>("username");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
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
        if (signInMethod === "username") {
          const session = await callPublicFunction("username-login", {
            username: normaliseUsername(username),
            password,
          });
          await applySession(session);
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
          if (error) throw error;
        }
        window.location.replace(nextPath());
        return;
      }

      const cleanUsername = normaliseUsername(username);
      if (!usernameIsValid(cleanUsername)) throw new Error("Username must be 3–32 characters using letters, numbers, dots, dashes or underscores.");
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim(), username: cleanUsername },
          emailRedirectTo: `${STAFF_DEVELOPMENT_ORIGIN}/auth`,
        },
      });
      if (error) throw error;
      if (data.session) window.location.replace(nextPath());
      else setMessage("Account created. Check your email to confirm it, then sign in with your username and password.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to authenticate.");
    } finally {
      setBusy(false);
    }
  }

  async function applySession(payload: SessionPayload) {
    if (!payload.access_token || !payload.refresh_token) throw new Error(payload.error || "Sign-in failed.");
    const { error } = await getSupabaseBrowserClient().auth.setSession({
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
    });
    if (error) throw error;
  }

  async function callPublicFunction(name: string, body: Record<string, unknown>): Promise<SessionPayload> {
    const { url, key } = getSupabasePublicConfig();
    const response = await fetch(`${url}/functions/v1/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({ error: "Authentication service returned an invalid response." }));
    if (!response.ok) throw new Error(payload.error || "Authentication failed.");
    return payload as SessionPayload;
  }

  async function oauth(provider: "google" | "azure") {
    const supabase = getSupabaseBrowserClient();
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${STAFF_DEVELOPMENT_ORIGIN}/auth`,
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
      setMessage("Switch to email sign-in and enter your email address first.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${STAFF_DEVELOPMENT_ORIGIN}/auth` },
    });
    setBusy(false);
    setMessage(error ? error.message : "Sign-in link sent. Open it from your email to continue in Staff Development.");
  }

  async function resetPassword() {
    if (!email.trim()) {
      setMessage("Switch to email sign-in and enter your email address first.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${STAFF_DEVELOPMENT_ORIGIN}/reset-password`,
    });
    setBusy(false);
    setMessage(error ? error.message : "Password reset email sent. The reset link will return to Staff Development, not the tutoring app.");
  }

  function chooseMode(next: Mode) {
    setMode(next);
    setMessage("");
    setPassword("");
  }

  function selectAdminLogin() {
    setMode("signin");
    setSignInMethod("username");
    setUsername("zonesadmin");
    setPassword("");
    setMessage("Platform admin selected. Sign in with your CPD account password, or use email password reset if needed.");
  }

  return <main style={styles.page}>
    <section style={styles.hero}>
      <span style={styles.eyebrow}>STAFF DEVELOPMENT</span>
      <h1 style={styles.heroTitle}>One account for CPD, regulation and whole-school support.</h1>
      <p style={styles.heroText}>Staff Development now uses its dedicated CPD Supabase project. Its accounts, password resets and saved CPD data are separate from your tutoring app.</p>
      <div style={styles.featureGrid}>
        <Feature title="Separate CPD account" text="Authentication and data stay inside the CPD Supabase project." />
        <Feature title="Username sign-in" text="Use a memorable username and password without entering an email each time." />
        <Feature title="Admin access" text="Your existing CPD administrator account has unrestricted platform access." />
      </div>
    </section>

    <section style={styles.card}>
      <span style={styles.eyebrow}>{mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}</span>
      <h2 style={{ margin: "8px 0 6px", fontSize: 28 }}>{mode === "signup" ? "Create your Staff Development account" : "Welcome back"}</h2>
      <p style={styles.muted}>This login is connected only to the Staff Development / CPD Supabase project.</p>

      <button type="button" style={styles.provider} disabled={busy} onClick={() => oauth("google")}><b>G</b><span>Continue with Google</span></button>
      <button type="button" style={styles.provider} disabled={busy} onClick={() => oauth("azure")}><b>▦</b><span>Continue with Microsoft</span></button>
      <div style={styles.divider}><span>or use a password</span></div>

      {mode === "signin" && <div style={styles.segment}>
        <button type="button" style={signInMethod === "username" ? styles.segmentActive : styles.segmentButton} onClick={() => { setSignInMethod("username"); setMessage(""); }}>Username</button>
        <button type="button" style={signInMethod === "email" ? styles.segmentActive : styles.segmentButton} onClick={() => { setSignInMethod("email"); setMessage(""); }}>Email</button>
      </div>}

      <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 16 }}>
        {mode === "signup" && <label style={styles.label}>Full name<input style={styles.input} required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>}
        {(mode === "signup" || signInMethod === "username") && <label style={styles.label}>Username<input style={styles.input} required value={username} onChange={(event) => setUsername(normaliseUsername(event.target.value))} autoCapitalize="none" autoCorrect="off" autoComplete="username" placeholder="e.g. mgray" /></label>}
        {(mode === "signup" || signInMethod === "email") && <label style={styles.label}>Email<input style={styles.input} required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
        <label style={styles.label}>Password<input style={styles.input} required minLength={8} type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button style={styles.primary} disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
      </form>

      {mode === "signin" && signInMethod === "email" && <div style={styles.actionRow}>
        <button type="button" style={styles.linkButton} disabled={busy} onClick={magicLink}>Email me a sign-in link</button>
        <button type="button" style={styles.linkButton} disabled={busy} onClick={resetPassword}>Reset password</button>
      </div>}

      <div style={styles.footerActions}>
        {mode === "signin" ? <button type="button" style={styles.linkButton} onClick={() => chooseMode("signup")}>Create a staff account</button> : <button type="button" style={styles.linkButton} onClick={() => chooseMode("signin")}>Back to sign in</button>}
        <button type="button" style={styles.adminLink} onClick={selectAdminLogin}>Platform admin sign-in</button>
      </div>

      {message && <div style={styles.notice} role="status">{message}</div>}
    </section>
  </main>;
}

function Feature({ title, text }: { title: string; text: string }) {
  return <div style={styles.feature}><strong>{title}</strong><span>{text}</span></div>;
}

function normaliseUsername(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function usernameIsValid(value: string) {
  return /^[a-z0-9][a-z0-9._-]{2,31}$/.test(value);
}

function nextPath() {
  if (typeof window === "undefined") return "/";
  const value = new URLSearchParams(window.location.search).get("next") || "/";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(340px,.85fr)", gap: 32, alignItems: "center", padding: "clamp(24px,5vw,72px)", fontFamily: "system-ui,-apple-system,sans-serif", background: "linear-gradient(135deg,#edf4f4,#f8faf8 55%,#eef3f7)", color: "#173f57" },
  hero: { maxWidth: 720 },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: "#4b7685" },
  heroTitle: { fontSize: "clamp(38px,5vw,66px)", lineHeight: 1.02, letterSpacing: "-.045em", margin: "12px 0 20px" },
  heroText: { fontSize: 18, lineHeight: 1.65, color: "#49636d", maxWidth: 650 },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginTop: 28 },
  feature: { display: "grid", gap: 5, padding: 16, borderRadius: 16, background: "rgba(255,255,255,.74)", border: "1px solid rgba(23,63,87,.10)" },
  card: { width: "100%", maxWidth: 510, justifySelf: "end", padding: "clamp(24px,4vw,42px)", borderRadius: 26, background: "rgba(255,255,255,.94)", boxShadow: "0 24px 70px rgba(25,58,70,.15)", border: "1px solid rgba(23,63,87,.09)" },
  muted: { color: "#61747c", lineHeight: 1.55, marginBottom: 22 },
  provider: { width: "100%", display: "flex", gap: 12, alignItems: "center", justifyContent: "center", padding: "13px 16px", marginTop: 10, borderRadius: 12, border: "1px solid #cdd9de", background: "white", color: "#173f57", fontWeight: 700, cursor: "pointer" },
  divider: { textAlign: "center", color: "#819199", fontSize: 12, margin: "18px 0" },
  segment: { display: "grid", gridTemplateColumns: "1fr 1fr", padding: 4, borderRadius: 12, background: "#edf2f4", gap: 4 },
  segmentButton: { border: 0, borderRadius: 9, padding: "10px 12px", background: "transparent", color: "#5c7079", fontWeight: 750, cursor: "pointer" },
  segmentActive: { border: 0, borderRadius: 9, padding: "10px 12px", background: "white", color: "#173f57", fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 8px rgba(23,63,87,.10)" },
  label: { display: "grid", gap: 7, fontSize: 13, fontWeight: 750 },
  input: { width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: 10, border: "1px solid #cbd7dc", font: "inherit", outline: "none" },
  primary: { border: 0, borderRadius: 11, padding: "13px 16px", background: "#173f57", color: "white", fontWeight: 800, cursor: "pointer" },
  actionRow: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12, flexWrap: "wrap" },
  footerActions: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 16, flexWrap: "wrap", alignItems: "center" },
  linkButton: { border: 0, padding: 0, background: "transparent", color: "#285f75", textDecoration: "underline", cursor: "pointer", font: "inherit", fontSize: 13 },
  adminLink: { border: 0, padding: 0, background: "transparent", color: "#6c5968", cursor: "pointer", font: "inherit", fontSize: 12 },
  notice: { marginTop: 18, padding: 12, borderRadius: 10, background: "#eef5f7", color: "#214d5f", fontSize: 13, lineHeight: 1.45 },
};
