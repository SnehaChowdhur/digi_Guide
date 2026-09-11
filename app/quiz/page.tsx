"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const questions = [
  { topic: "Dynamic Programming", prompt: "Which technique stores solutions to overlapping subproblems so each is solved once?", answers: ["Greedy selection", "Memoization", "Binary search", "Backtracking"], correct: 1 },
  { topic: "Dynamic Programming", prompt: "What is the key property that makes a problem suitable for dynamic programming?", answers: ["Only one valid input", "Overlapping subproblems and optimal substructure", "A sorted array", "Constant time lookup"], correct: 1 },
  { topic: "Trees", prompt: "Which traversal visits a binary search tree in sorted order?", answers: ["Pre-order", "Post-order", "In-order", "Level-order"], correct: 2 },
];

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const question = questions[step];
  const score = answers.filter(Boolean).length;

  const submitAnswer = async () => {
    if (selected === null || submitting) return;
    setSubmitting(true);
    const correct = selected === question.correct;
    try { await fetch(`${API}/api/twin/alex/activity`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic: question.topic, correct, difficulty: 0.7, time_seconds: 60 }) }); } catch { /* The result remains usable if the API is offline. */ }
    const nextAnswers = [...answers, correct];
    setAnswers(nextAnswers);
    if (step === questions.length - 1) setDone(true); else { setStep(step + 1); setSelected(null); }
    setSubmitting(false);
  };

  if (done) return <main className="quiz-shell"><div className="quiz-card result"><div className="result-icon"><CheckCircle2 size={28} /></div><div className="kicker">Session complete</div><h1>Nice work, Alex.</h1><p>Your adaptive session is recorded. Your learning twin now has fresh evidence from {questions[0].topic} and {questions[2].topic}.</p><div className="result-grid"><div><strong>{Math.round((score / questions.length) * 100)}%</strong><span>focus score</span></div><div><strong>{score}/{questions.length}</strong><span>correct answers</span></div><div><strong>+{Math.max(1, score * 3)}%</strong><span>twin signal</span></div></div><div className="result-actions"><Link href="/" className="quiz-button">Return to overview <ArrowRight size={16} /></Link><Link href="/quiz" className="secondary-button">Practice again</Link></div></div></main>;

  return <main className="quiz-shell"><div className="quiz-top"><Link href="/" className="back-link"><ArrowLeft size={16} /> Overview</Link><span><Clock3 size={15} /> Adaptive session</span></div><div className="quiz-progress"><i style={{ width: `${(step / questions.length) * 100}%` }} /></div><section className="quiz-card"><div className="kicker">Adaptive practice · {step + 1} of {questions.length}</div><span className="topic-pill">{question.topic}</span><h1>{question.prompt}</h1><div className="answers">{question.answers.map((answer, index) => <button key={answer} className={selected === index ? "selected" : ""} onClick={() => setSelected(index)}><span>{String.fromCharCode(65 + index)}</span>{answer}</button>)}</div><button className="quiz-button next" disabled={selected === null || submitting} onClick={() => void submitAnswer()}>{submitting ? "Updating twin..." : step === questions.length - 1 ? "Finish session" : "Next question"}<ArrowRight size={16} /></button></section><div className="quiz-note"><Sparkles size={15} /> Each answer updates your personal learning model.</div></main>;
}
