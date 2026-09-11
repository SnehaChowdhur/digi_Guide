"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BrainCircuit, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import StudyWatermark from "@/components/study-watermark";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("Alex Smith");
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("learning123");
  const [showPassword, setShowPassword] = useState(false);
  const [field, setField] = useState("Computer Science");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.localStorage.setItem("digiguide-auth", "true");
    window.localStorage.setItem(
      "digiguide-user",
      JSON.stringify({ name: name.trim() || "Alex Smith", email: email.trim(), field: field.trim() || "Computer Science" })
    );
    router.replace("/");
  };

  return (
    <main className="auth-shell">
      <div className="watermark-layer" aria-hidden="true">
        <div className="watermark-orbit watermark-orbit-1" />
        <div className="watermark-orbit watermark-orbit-2" />
      </div>
      <StudyWatermark />

      <section className="auth-visual">
        <div className="brand-wrap auth-brand-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/digigyan-transparent.png"
            alt="digiGUIDE Platform Logo"
            className="auth-brand-logo-img"
          />
          <div className="brand-text">
            <span className="brand-title auth-brand-title">
              digi<span className="brand-title-accent">GUIDE</span>
            </span>
            <span className="brand-sub auth-brand-sub">AI Learning Twin</span>
          </div>
        </div>
        <div>
          <div className="kicker">Your adaptive learning companion</div>
          <h1>Learn with a map that changes as you do.</h1>
          <p>digiGUIDE turns your practice patterns into a living picture of what to learn next.</p>
        </div>
        <div className="auth-orbit">
          <BrainCircuit size={30} />
          <span>
            Learning twin<br />
            <strong>ready to grow</strong>
          </span>
        </div>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "selected" : ""}
              onClick={() => setMode("login")}
            >
              <LogIn size={16} /> Log in
            </button>
            <button
              type="button"
              className={mode === "signup" ? "selected" : ""}
              onClick={() => setMode("signup")}
            >
              <UserPlus size={16} /> Sign up
            </button>
          </div>
          <div className="kicker">Welcome to digiGUIDE</div>
          <h2>{mode === "login" ? "Continue your learning journey." : "Create your learning twin."}</h2>
          <p className="auth-subtitle">
            {mode === "login"
              ? "Use the demo details or your own account to continue."
              : "Start with a few details. You can update them anytime."}
          </p>
          {mode === "signup" && (
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <div className="password-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          {mode === "signup" && (
            <label>
              Study focus
              <input value={field} onChange={(event) => setField(event.target.value)} required />
            </label>
          )}
          <button className="auth-submit" type="submit">
            {mode === "login" ? "Enter digiGUIDE" : "Create account"} <ArrowRight size={17} />
          </button>
          <small className="demo-note">Demo mode: instant local access, no external credentials needed.</small>
        </form>
      </section>
    </main>
  );
}

