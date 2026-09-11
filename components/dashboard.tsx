"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, BookOpen, BrainCircuit, Check, ChevronRight, CircleHelp, LayoutDashboard, ListChecks, MessageCircle, Settings, Sparkles, Target, TrendingUp, X } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Topic = { topic: string; mastery: number; confidence: number; attempts: number; accuracy: number };
type Twin = { overall_score: number; streak_days: number; weekly_study_hours: number; topics: Topic[]; recommendations: { topic: string; reason: string; minutes: number }[] };
type ActivityRecord = { id: number; topic: string; kind: string; summary: string; detail: string; created_at: string };
type Preferences = { name: string; weekly_goal_hours: number; daily_reminders: boolean };

const performance = [{ day: "Mon", score: 58 }, { day: "Tue", score: 64 }, { day: "Wed", score: 61 }, { day: "Thu", score: 70 }, { day: "Fri", score: 68 }, { day: "Sat", score: 76 }, { day: "Sun", score: 78 }];
const colors = ["#0f7770", "#4d9e7c", "#83b86b", "#e5a64e", "#f27e63"];
const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Dashboard() {
  const [active, setActive] = useState("Overview");
  const [twin, setTwin] = useState<Twin | null>(null);
  const [history, setHistory] = useState<ActivityRecord[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({ name: "Alex Smith", weekly_goal_hours: 8, daily_reminders: true });
  const [showSettings, setShowSettings] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [twinResponse, activityResponse, preferenceResponse] = await Promise.all([fetch(`${API}/api/twin/alex`), fetch(`${API}/api/activity/alex`), fetch(`${API}/api/preferences/alex`)]);
      if (!twinResponse.ok || !activityResponse.ok || !preferenceResponse.ok) throw new Error("API unavailable");
      setTwin(await twinResponse.json()); setHistory(await activityResponse.json()); setPreferences(await preferenceResponse.json());
    } catch { setError("Live twin data is unavailable. Start the FastAPI server on port 8000."); }
  };
  useEffect(() => { void load(); }, []);

  const topics = twin?.topics || [];
  const startPlan = () => { window.location.href = "/quiz"; };
  const savePreferences = async () => {
    const response = await fetch(`${API}/api/preferences/alex`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(preferences) });
    if (response.ok) { setPreferences(await response.json()); setSaved(true); window.setTimeout(() => setSaved(false), 1800); }
  };
  const nav = [{ label: "Overview", icon: LayoutDashboard }, { label: "Practice", icon: ListChecks }, { label: "Knowledge map", icon: BrainCircuit }, { label: "AI tutor", icon: MessageCircle }];
  const date = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  return <div className="shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">N</span> NOVA</div><nav className="nav">{nav.map(({ label, icon: Icon }) => <button key={label} className={`nav-button ${active === label ? "active" : ""}`} onClick={() => label === "Practice" ? startPlan() : setActive(label)}><Icon size={17} />{label}</button>)}</nav><button className={`nav-button ${active === "History" ? "active" : ""}`} onClick={() => setActive("History")}><Activity size={17} />History</button><div className="side-bottom"><div className="health"><Target size={15} /> Twin health <strong>96%</strong></div>Your learning model is up to date.<br />Last synced just now.</div></aside>
    <main className="main"><header className="topbar"><div><div className="kicker">Tuesday, 08 October 2024</div><h1>Good morning, {preferences.name.split(" ")[0]}.</h1></div><div className="top-actions"><button className="icon-button" aria-label="Open help" onClick={() => setActive("AI tutor")}><CircleHelp size={18} /></button><button className="icon-button" aria-label="Open settings" onClick={() => setShowSettings(true)}><Settings size={18} /></button><div className="profile"><div className="avatar">AS</div><div><strong>{preferences.name}</strong><small>Computer Science</small></div></div></div></header>
      {error && <div className="error-banner">{error}</div>}
      {active === "Overview" && <Overview twin={twin} topics={topics} history={history} startPlan={startPlan} setActive={setActive} date={date} />}
      {active === "Knowledge map" && <KnowledgeMap topics={topics} />}
      {active === "History" && <History history={history} date={date} />}
      {active === "AI tutor" && <section className="wide-view panel tutor-view"><div className="kicker">NOVA coach</div><h2>Turn your next question into progress.</h2><p>Ask about a concept or start the recovery plan. Your tutor uses the mastery signals from this twin to keep practice focused.</p><button className="cta" onClick={startPlan}>Open adaptive practice <ArrowUpRight size={15} /></button></section>}
    </main>
    {showSettings && <div className="modal-backdrop" onClick={() => setShowSettings(false)}><section className="settings-modal" onClick={event => event.stopPropagation()}><div className="section-head"><div><div className="kicker">Preferences</div><h2>Personalize NOVA</h2></div><button className="icon-button" onClick={() => setShowSettings(false)} aria-label="Close settings"><X size={17} /></button></div><label>Name<input value={preferences.name} onChange={event => setPreferences({ ...preferences, name: event.target.value })} /></label><label>Weekly study goal<input type="number" min="1" max="40" value={preferences.weekly_goal_hours} onChange={event => setPreferences({ ...preferences, weekly_goal_hours: Number(event.target.value) })} /></label><label className="check-label"><input type="checkbox" checked={preferences.daily_reminders} onChange={event => setPreferences({ ...preferences, daily_reminders: event.target.checked })} /> Daily reminders</label><button className="cta" onClick={() => void savePreferences()}>{saved ? "Saved" : "Save preferences"}</button></section></div>}
  </div>;
}

function Overview({ twin, topics, history, startPlan, setActive, date }: { twin: Twin | null; topics: Topic[]; history: ActivityRecord[]; startPlan: () => void; setActive: (value: string) => void; date: Intl.DateTimeFormat }) {
  return <div className="grid"><section className="panel hero"><div className="hero-copy"><div><div className="kicker">Your learning twin</div><h2>A clearer picture of how you learn.</h2><p>Your momentum is building. You are performing 12% better than your baseline this week.</p></div><div className="trend"><TrendingUp size={15} /> +8.4% since last month</div></div><div className="score"><strong>{twin?.overall_score ?? 78}</strong><span>overall score</span></div></section><section className="panel stats"><div className="section-head"><h2>Study rhythm</h2><Activity size={18} color="var(--teal)" /></div><div className="stat-value">{twin?.weekly_study_hours ?? 6.4} <span>hrs</span></div><div className="stat-line"><span>This week</span><strong>+1.8 hrs</strong></div><div className="progress"><i style={{ width: `${Math.min(100, ((twin?.weekly_study_hours ?? 6.4) / 8) * 100)}%` }} /></div><div className="stat-line"><span>Weekly goal</span><span>8 hrs</span></div></section><section className="panel chart-panel"><div className="section-head"><div><h2>Performance trend</h2><p>Your accuracy over the last 7 days</p></div><span className="metric">+20 pts</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={performance} margin={{ top: 8, right: 16, left: -25, bottom: 0 }}><CartesianGrid stroke="#edf1ed" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8b9991", fontSize: 11 }} /><YAxis domain={[40, 90]} axisLine={false} tickLine={false} tick={{ fill: "#8b9991", fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#0f7770" strokeWidth={3} dot={{ r: 4, fill: "#c8f169", stroke: "#0f7770", strokeWidth: 2 }} /></LineChart></ResponsiveContainer></div></section><section className="panel recommendation"><div className="kicker label"><Sparkles size={14} /> Twin recommendation</div><h2>Strengthen your {twin?.recommendations[0]?.topic || "DP"} foundations.</h2><p>{twin?.recommendations[0]?.reason || "Your recent mistakes point to memoization and state transitions."}</p><button className="cta" onClick={startPlan}>Start recovery plan <ArrowUpRight size={15} /></button></section><section className="panel mastery"><div className="section-head"><div><h2>Topic mastery</h2><p>Based on your recent practice</p></div><button onClick={() => setActive("Knowledge map")}>View map <ChevronRight size={13} /></button></div>{topics.map((topic, index) => <div className="topic" key={topic.topic}><span>{topic.topic}</span><div className="progress"><i style={{ width: `${topic.mastery}%`, background: colors[index % colors.length] }} /></div><strong>{Math.round(topic.mastery)}%</strong></div>)}</section><section className="panel graph"><div className="section-head"><div><h2>Knowledge map</h2><p>Prerequisites shaping your next step</p></div><BrainCircuit size={18} color="var(--teal)" /></div><MapNodes topics={topics} /></section><section className="panel activity"><div className="section-head"><h2>Recent activity</h2><button onClick={() => setActive("History")}>See history <ChevronRight size={13} /></button></div>{history.slice(0, 3).map(item => <div className="activity-row" key={item.id}><div className="activity-icon"><Check size={16} /></div><div><p>{item.summary}</p><small>{item.kind} · {item.detail}</small></div><time>{date.format(new Date(item.created_at))}</time></div>)}</section></div>;
}

function MapNodes({ topics }: { topics: Topic[] }) { return <div className="graph-lines"><div className="node a">Arrays</div><div className="node b">Recursion</div><div className="node c">Memoization</div><div className="node d">Trees</div><div className="node e">Dynamic<br />programming</div><div className="map-caption">{topics.length ? `${topics.length} connected topics` : "Loading knowledge map..."}</div></div>; }
function KnowledgeMap({ topics }: { topics: Topic[] }) { return <section className="wide-view panel"><div className="kicker">Knowledge map</div><h2>See what unlocks the next concept.</h2><p className="view-intro">Your strongest prerequisites are connected to the areas that need another practice pass.</p><div className="large-map"><MapNodes topics={topics} /></div><div className="map-legend">{topics.map((topic, index) => <div key={topic.topic}><i style={{ background: colors[index % colors.length] }} />{topic.topic}<strong>{Math.round(topic.mastery)}%</strong></div>)}</div></section>; }
function History({ history, date }: { history: ActivityRecord[]; date: Intl.DateTimeFormat }) { return <section className="wide-view panel"><div className="kicker">Learning history</div><h2>Every small session counts.</h2><p className="view-intro">A running record of quizzes and study sessions that shape your twin.</p><div className="history-list">{history.map(item => <div className="history-item" key={item.id}><div className="activity-icon"><BookOpen size={16} /></div><div><strong>{item.summary}</strong><p>{item.kind} · {item.detail}</p></div><time>{date.format(new Date(item.created_at))}</time></div>)}</div></section>; }
