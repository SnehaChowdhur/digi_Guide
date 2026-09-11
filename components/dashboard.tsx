"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowUpRight, BookOpen, BrainCircuit, Check, ChevronRight, CircleHelp, LayoutDashboard, ListChecks, MessageCircle, Settings, Sparkles, Target, TrendingUp, X } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const performance = [
  { day: "Mon", score: 58 }, { day: "Tue", score: 64 }, { day: "Wed", score: 61 }, { day: "Thu", score: 70 }, { day: "Fri", score: 68 }, { day: "Sat", score: 76 }, { day: "Sun", score: 78 }
];
const topics = [{ name: "Python", value: 91, color: "#0f7770" }, { name: "Arrays", value: 83, color: "#4d9e7c" }, { name: "Linked Lists", value: 72, color: "#83b86b" }, { name: "Trees", value: 61, color: "#e5a64e" }, { name: "Dynamic Programming", value: 38, color: "#f27e63" }];
const nav = [{ label: "Overview", icon: LayoutDashboard }, { label: "Practice", icon: ListChecks }, { label: "Knowledge map", icon: BrainCircuit }, { label: "AI tutor", icon: MessageCircle }];

function getSystemDate() {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date());
}

export default function Dashboard() {
  const router = useRouter();
  const [active, setActive] = useState("Overview");
  const [dialog, setDialog] = useState<"help" | "settings" | "profile" | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [date, setDate] = useState("");
  const [user, setUser] = useState({ name: "Alex Smith", email: "alex@example.com", field: "Computer Science" });

  useEffect(() => {
    if (window.localStorage.getItem("digiguide-auth") !== "true") router.replace("/auth");
    setDate(getSystemDate());
    const savedUser = window.localStorage.getItem("digiguide-user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, [router]);

  const startPlan = () => { setShowToast(true); window.setTimeout(() => setShowToast(false), 2800); };
  const openNav = (label: string) => { setActive(label); if (label === "Practice") router.push("/quiz"); };
  const signOut = () => { window.localStorage.removeItem("digiguide-auth"); router.replace("/auth"); };
  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  if (!date) return null;

  return <div className="shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">d</span> digiGUIDE</div><nav className="nav">{nav.map(({ label, icon: Icon }) => <button key={label} className={`nav-button ${active === label ? "active" : ""}`} onClick={() => openNav(label)}><Icon size={17} />{label}</button>)}</nav><div className="side-bottom"><div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink)", marginBottom: 8 }}><Target size={15} /> Twin health <strong style={{ marginLeft: "auto", color: "var(--teal)" }}>96%</strong></div>Your learning model is up to date.<br />Last synced 4 min ago.</div></aside>
    <main className="main"><header className="topbar"><div><div className="kicker">{date}</div><h1>Hello, {user.name.split(" ")[0]}.</h1></div><div className="top-actions"><button className="icon-button" aria-label="Open help" onClick={() => setDialog("help")}><CircleHelp size={18} /></button><button className="icon-button" aria-label="Open settings" onClick={() => setDialog("settings")}><Settings size={18} /></button><button className="profile" aria-label="Open profile details" onClick={() => setDialog("profile")}><div className="avatar">{initials}</div><div><strong style={{ fontSize: 13 }}>{user.name}</strong><small>{user.field}</small></div></button></div></header>
      {active === "Overview" && <div className="grid"><section className="panel hero"><div className="hero-copy"><div><div className="kicker">Your learning twin</div><h2>A clearer picture of how you learn.</h2><p>Your momentum is building. You are performing 12% better than your baseline this week.</p></div><div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#b5c3bb" }}><TrendingUp size={15} color="var(--mint)" /> +8.4% since last month</div></div><div className="score"><strong>78</strong><span>overall score</span></div></section>
      <section className="panel stats"><div className="section-head"><h2>Study rhythm</h2><Activity size={18} color="var(--teal)" /></div><div className="stat-value">6.4 <span style={{ fontSize: 13, color: "var(--muted)", letterSpacing: 0 }}>hrs</span></div><div className="stat-line"><span>This week</span><strong>+1.8 hrs</strong></div><div className="progress"><i style={{ width: "72%" }} /></div><div className="stat-line"><span>Weekly goal</span><span>8 hrs</span></div></section>
      <section className="panel chart-panel"><div className="section-head"><div><h2>Performance trend</h2><p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>Your accuracy over the last 7 days</p></div><span style={{ color: "var(--teal)", fontSize: 13, fontWeight: 700 }}>+20 pts</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={performance} margin={{ top: 8, right: 16, left: -25, bottom: 0 }}><CartesianGrid stroke="#edf1ed" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8b9991", fontSize: 11 }} /><YAxis domain={[40, 90]} axisLine={false} tickLine={false} tick={{ fill: "#8b9991", fontSize: 11 }} /><Tooltip contentStyle={{ border: "1px solid #e3eae5", borderRadius: 8, fontSize: 12 }} /><Line type="monotone" dataKey="score" stroke="#0f7770" strokeWidth={3} dot={{ r: 4, fill: "#c8f169", stroke: "#0f7770", strokeWidth: 2 }} /></LineChart></ResponsiveContainer></div></section>
      <section className="panel recommendation"><div className="kicker label"><Sparkles size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} /> Twin recommendation</div><h2 style={{ marginTop: 10 }}>Strengthen your DP foundations.</h2><p>Your recent mistakes point to memoization and state transitions. A focused 25-minute session could move your mastery from 38% to 47%.</p><button className="cta" onClick={startPlan}>Start recovery plan <ArrowUpRight size={15} /></button></section>
      <section className="panel mastery"><div className="section-head"><div><h2>Topic mastery</h2><p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>Based on 248 questions and 18 study sessions</p></div><button onClick={() => setActive("Knowledge map")}>View all <ChevronRight size={13} style={{ verticalAlign: "-2px" }} /></button></div>{topics.map(topic => <div className="topic" key={topic.name}><span>{topic.name}</span><div className="progress"><i style={{ width: `${topic.value}%`, background: topic.color }} /></div><strong>{topic.value}%</strong></div>)}</section>
      <section className="panel graph"><div className="section-head"><div><h2>Knowledge map</h2><p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>Prerequisites shaping your next step</p></div><BrainCircuit size={18} color="var(--teal)" /></div><div className="graph-lines"><div className="node a">Arrays</div><div className="node b">Recursion</div><div className="node c">Memoization</div><div className="node d">Trees</div><div className="node e">Dynamic<br />programming</div></div></section>
      <section className="panel activity"><div className="section-head"><h2>Recent activity</h2><button onClick={() => setActive("Practice")}>See history <ChevronRight size={13} style={{ verticalAlign: "-2px" }} /></button></div><div className="activity-row"><div className="activity-icon"><Check size={16} /></div><div><p>Completed Arrays: Sliding Window</p><small>Quiz · 8 of 10 correct</small></div><time>Today, 9:42 AM</time></div><div className="activity-row"><div className="activity-icon" style={{ background: "#fff0df", color: "#cf7a27" }}><BookOpen size={16} /></div><div><p>Reviewed “Tree Traversals”</p><small>Study session · 24 minutes</small></div><time>Yesterday</time></div></section></div>}
      {active !== "Overview" && <section className="panel workspace-view"><div className="kicker">digiGUIDE workspace</div><h2>{active}</h2><p>{active === "Knowledge map" ? "Explore the prerequisite path from arrays and recursion to dynamic programming." : active === "AI tutor" ? "Ask your tutor about a mistake, concept, or personalized study plan." : "Practice questions selected for your current mastery and weak topics."}</p><button className="cta" onClick={() => active === "Practice" ? router.push("/quiz") : setActive("Overview")}>{active === "Practice" ? "Start adaptive quiz" : "Back to overview"} <ArrowUpRight size={15} /></button></section>}
    </main>
    {showToast && <div className="toast"><Sparkles size={16} color="#c8f169" /> Recovery plan queued for your next session <button onClick={() => setShowToast(false)} aria-label="Dismiss"><X size={15} /></button></div>}
    {dialog && <div className="dialog-backdrop" role="presentation" onClick={() => setDialog(null)}><section className="dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="dialog-close" aria-label="Close dialog" onClick={() => setDialog(null)}><X size={17} /></button>{dialog === "help" && <><CircleHelp size={25} color="var(--teal)" /><h2>How digiGUIDE works</h2><p>Your digital twin learns from your quiz accuracy, time, and topic history to recommend what to study next.</p><button className="cta" onClick={() => setDialog(null)}>Got it</button></>}{dialog === "settings" && <><Settings size={25} color="var(--teal)" /><h2>Settings</h2><label className="setting-row"><span>Daily reminders</span><input type="checkbox" defaultChecked /></label><label className="setting-row"><span>Weekly progress email</span><input type="checkbox" /></label><button className="cta" onClick={() => setDialog(null)}>Save settings</button></>}{dialog === "profile" && <><div className="large-avatar">{initials}</div><h2>{user.name}</h2><p>{user.email}<br />{user.field}</p><button className="cta" onClick={signOut}>Sign out</button></>}</section></div>}
  </div>;
}
