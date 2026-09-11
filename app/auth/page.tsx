"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BrainCircuit, LogIn, UserPlus } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("Alex Smith");
  const [email, setEmail] = useState("alex@example.com");
  const [field, setField] = useState("Computer Science");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.localStorage.setItem("digiguide-auth", "true");
    window.localStorage.setItem("digiguide-user", JSON.stringify({ name, email, field }));
    router.replace("/");
  };

  return <main className="auth-shell"><section className="auth-visual"><div className="brand auth-brand"><span className="brand-mark">d</span> digiGUIDE</div><div><div className="kicker">Your adaptive learning companion</div><h1>Learn with a map that changes as you do.</h1><p>digiGUIDE turns your practice patterns into a living picture of what to learn next.</p></div><div className="auth-orbit"><BrainCircuit size={30} /><span>Learning twin<br /><strong>ready to grow</strong></span></div></section><section className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><div className="auth-tabs"><button type="button" className={mode === "login" ? "selected" : ""} onClick={() => setMode("login")}><LogIn size={16} /> Log in</button><button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => setMode("signup")}><UserPlus size={16} /> Sign up</button></div><div className="kicker">Welcome to digiGUIDE</div><h2>{mode === "login" ? "Continue your learning journey." : "Create your learning twin."}</h2><p className="auth-subtitle">{mode === "login" ? "Use the demo details or your own account to continue." : "Start with a few details. You can update them later."}</p>{mode === "signup" && <label>Name<input value={name} onChange={(event) => setName(event.target.value)} required /></label>}<label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" defaultValue="learning123" minLength={6} required /></label>{mode === "signup" && <label>Study focus<input value={field} onChange={(event) => setField(event.target.value)} required /></label>}<button className="auth-submit" type="submit">{mode === "login" ? "Enter digiGUIDE" : "Create account"} <ArrowRight size={17} /></button><small className="demo-note">Demo mode: no account or API key is required.</small></form></section></main>;
}
