"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  HelpCircle,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import StudyWatermark from "@/components/study-watermark";

type QuizQuestion = {
  id: number;
  topic: string;
  prompt: string;
  answers: string[];
  correct: number;
  explanation: string;
  difficulty?: number;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: "Dynamic Programming",
    prompt: "Which technique stores solutions to overlapping subproblems so each subproblem is solved only once?",
    answers: ["Greedy selection", "Memoization", "Binary search", "Backtracking"],
    correct: 1,
    explanation: "Memoization caches return values of expensive function calls so identical subproblems are not computed repeatedly.",
    difficulty: 0.5,
  },
  {
    id: 2,
    topic: "Dynamic Programming",
    prompt: "What are the two essential characteristics of a problem that can be solved via Dynamic Programming?",
    answers: [
      "Only one valid input and constant time lookup",
      "Optimal substructure and overlapping subproblems",
      "A sorted array and divide-and-conquer strategy",
      "Non-recursive formulation and greedy choice property",
    ],
    correct: 1,
    explanation: "Dynamic Programming requires optimal substructure (optimal solution contains optimal sub-solutions) and overlapping subproblems.",
    difficulty: 0.6,
  },
  {
    id: 3,
    topic: "Recursion",
    prompt: "What occurs if a recursive function lacks a valid base case or fails to reach it?",
    answers: ["Memory leak in heap", "Stack overflow error", "Zero division error", "Deadlock"],
    correct: 1,
    explanation: "Without a reachable base case, recursive calls push activation frames indefinitely until the call stack limit is breached.",
    difficulty: 0.4,
  },
  {
    id: 4,
    topic: "Trees",
    prompt: "Which traversal visits a binary search tree (BST) in ascending sorted order?",
    answers: ["Pre-order (Root, Left, Right)", "In-order (Left, Root, Right)", "Post-order (Left, Right, Root)", "Level-order (BFS)"],
    correct: 1,
    explanation: "In-order traversal visits the left subtree, then root, then right subtree, producing naturally sorted keys in a BST.",
    difficulty: 0.5,
  },
  {
    id: 5,
    topic: "Arrays",
    prompt: "What is the average time complexity of accessing an element in an array by its index?",
    answers: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    correct: 2,
    explanation: "Because array memory is contiguous, any index can be accessed directly in O(1) via base_address + (index * size).",
    difficulty: 0.3,
  },
  {
    id: 6,
    topic: "Linked Lists",
    prompt: "Why is inserting a node at the head of a singly linked list O(1) while in a dynamic array it is usually O(n)?",
    answers: [
      "Linked lists use hash tables internally",
      "Head insertion requires only pointer reassignment without shifting subsequent elements",
      "Arrays must allocate double memory for every insert",
      "Linked lists store elements in contiguous RAM blocks",
    ],
    correct: 1,
    explanation: "Prepending to a linked list simply links the new node to the old head and updates head pointer in O(1) time.",
    difficulty: 0.5,
  },
  {
    id: 7,
    topic: "Memoization",
    prompt: "How does memoization differ from bottom-up tabulation?",
    answers: [
      "Memoization is top-down on-demand recursion with a cache, while tabulation is bottom-up iterative",
      "Memoization is always faster than tabulation",
      "Tabulation can only be used on trees",
      "Memoization does not store intermediate results",
    ],
    correct: 0,
    explanation: "Memoization solves from the top down and caches subproblems as requested; tabulation fills answers from smallest base cases upward.",
    difficulty: 0.5,
  },
];

const AVAILABLE_TOPICS = [
  "All Topics",
  "Dynamic Programming",
  "Recursion",
  "Trees",
  "Arrays",
  "Linked Lists",
  "Memoization",
];

export default function QuizPage() {
  return (
    <Suspense fallback={<main className="quiz-shell"><div className="quiz-card">Loading adaptive session...</div></main>}>
      <QuizContent />
    </Suspense>
  );
}

function QuizContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "All Topics";

  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic);
  const [questions, setQuestions] = useState<QuizQuestion[]>(FALLBACK_QUESTIONS);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [studentName, setStudentName] = useState("Alex");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("digiguide-user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setStudentName(parsed.name.split(" ")[0]);
      }
    } catch {
      // Keep default
    }
  }, []);

  // Filter or fetch questions when selected topic changes
  useEffect(() => {
    let mounted = true;
    const fetchQuestions = async () => {
      try {
        const query = selectedTopic !== "All Topics" ? `?topic=${encodeURIComponent(selectedTopic)}&count=4` : `?count=4`;
        const res = await fetch(`${API}/api/quiz/questions${query}`);
        if (res.ok) {
          const data: QuizQuestion[] = await res.json();
          if (mounted && data.length > 0) {
            setQuestions(data);
            setStep(0);
            setSelected(null);
            setIsAnswerChecked(false);
            setAnswers([]);
            setDone(false);
            setTimer(0);
            return;
          }
        }
      } catch {
        // Use fallback
      }

      if (mounted) {
        if (selectedTopic === "All Topics") {
          setQuestions(FALLBACK_QUESTIONS.slice(0, 4));
        } else {
          const filtered = FALLBACK_QUESTIONS.filter(
            (q) => q.topic.toLowerCase() === selectedTopic.toLowerCase()
          );
          setQuestions(filtered.length > 0 ? filtered : FALLBACK_QUESTIONS.slice(0, 3));
        }
        setStep(0);
        setSelected(null);
        setIsAnswerChecked(false);
        setAnswers([]);
        setDone(false);
        setTimer(0);
      }
    };

    void fetchQuestions();
    return () => {
      mounted = false;
    };
  }, [selectedTopic]);

  // Live timer tick
  useEffect(() => {
    if (done || isAnswerChecked) return;
    const interval = window.setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [done, isAnswerChecked, step]);

  const question = questions[step] || questions[0];
  const score = answers.filter(Boolean).length;

  const checkAnswer = () => {
    if (selected === null || isAnswerChecked) return;
    setIsAnswerChecked(true);
  };

  const advanceNext = async () => {
    if (selected === null || submitting) return;
    setSubmitting(true);
    const correct = selected === question.correct;
    const nextAnswers = [...answers, correct];

    // Submit activity to backend
    const studentSlug = studentName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "alex";
    try {
      await fetch(`${API}/api/twin/${studentSlug}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: question.topic,
          correct,
          difficulty: question.difficulty || 0.6,
          time_seconds: Math.max(1, timer),
        }),
      });
    } catch {
      // Offline fallback
    }

    setAnswers(nextAnswers);
    setSubmitting(false);

    if (step >= questions.length - 1) {
      setDone(true);
    } else {
      setStep((prev) => prev + 1);
      setSelected(null);
      setIsAnswerChecked(false);
      setTimer(0);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setSelected(null);
    setIsAnswerChecked(false);
    setAnswers([]);
    setDone(false);
    setTimer(0);
  };

  if (done) {
    const accuracyPercent = Math.round((score / Math.max(1, questions.length)) * 100);
    return (
      <main className="quiz-shell">
        <div className="watermark-layer" aria-hidden="true">
          <div className="watermark-orbit watermark-orbit-1" />
          <div className="watermark-orbit watermark-orbit-2" />
        </div>
        <StudyWatermark />
        <div className="quiz-card result">
          <div className="result-icon">
            <CheckCircle2 size={32} />
          </div>
          <div className="kicker">Adaptive Session Complete</div>
          <h1>Nice work, {studentName}.</h1>
          <p>
            Your practice responses have been integrated into your Learning Digital Twin. Your topic mastery and
            decay projections have been calibrated.
          </p>
          <div className="result-grid">
            <div>
              <strong>{accuracyPercent}%</strong>
              <span>Accuracy</span>
            </div>
            <div>
              <strong>
                {score} / {questions.length}
              </strong>
              <span>Correct Answers</span>
            </div>
            <div>
              <strong>+{Math.max(1, score * 3)}%</strong>
              <span>Twin Signal</span>
            </div>
          </div>
          <div className="result-actions">
            <Link href="/" className="quiz-button">
              Return to Overview <ArrowRight size={16} />
            </Link>
            <button className="secondary-button" onClick={resetQuiz}>
              <RotateCcw size={15} /> Practice Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="quiz-shell">
      <div className="watermark-layer" aria-hidden="true">
        <div className="watermark-orbit watermark-orbit-1" />
        <div className="watermark-orbit watermark-orbit-2" />
      </div>
      <StudyWatermark />
      <div className="quiz-top">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Overview
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="quiz-timer-badge">
            <Clock3 size={14} /> {timer}s
          </span>
          <span>Adaptive session</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "18px", justifyContent: "center" }}>
        {AVAILABLE_TOPICS.map((t) => (
          <button
            key={t}
            className={`topic-tag-btn ${selectedTopic === t ? "active" : ""}`}
            onClick={() => setSelectedTopic(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="quiz-progress">
        <i style={{ width: `${((step + (isAnswerChecked ? 1 : 0.5)) / Math.max(1, questions.length)) * 100}%` }} />
      </div>

      <section className="quiz-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="kicker">
            Question {step + 1} of {questions.length}
          </div>
          <span className="topic-pill">{question.topic}</span>
        </div>

        <h1>{question.prompt}</h1>

        <div className="answers">
          {question.answers.map((answer, index) => {
            let extraClass = "";
            if (isAnswerChecked) {
              if (index === question.correct) extraClass = "is-correct";
              else if (selected === index) extraClass = "is-wrong";
            } else if (selected === index) {
              extraClass = "selected";
            }

            return (
              <button
                key={answer}
                className={extraClass}
                disabled={isAnswerChecked}
                onClick={() => setSelected(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {answer}
              </button>
            );
          })}
        </div>

        {isAnswerChecked && (
          <div className={`quiz-explanation-card ${selected === question.correct ? "correct" : "incorrect"}`}>
            <div className={`quiz-explanation-title ${selected === question.correct ? "correct" : "incorrect"}`}>
              {selected === question.correct ? (
                <>
                  <CheckCircle2 size={16} /> Correct! Well reasoned.
                </>
              ) : (
                <>
                  <XCircle size={16} /> Not quite right.
                </>
              )}
            </div>
            <p className="quiz-explanation-text">{question.explanation}</p>
          </div>
        )}

        {!isAnswerChecked ? (
          <button
            className="quiz-button next"
            disabled={selected === null}
            onClick={checkAnswer}
          >
            Check Answer <HelpCircle size={16} />
          </button>
        ) : (
          <button
            className="quiz-button next"
            disabled={submitting}
            onClick={() => void advanceNext()}
          >
            {submitting
              ? "Updating Twin..."
              : step === questions.length - 1
              ? "Finish Session"
              : "Next Question"}
            <ArrowRight size={16} />
          </button>
        )}
      </section>

      <div className="quiz-note">
        <Sparkles size={15} /> Each answer calibrates your personal learning model.
      </div>
    </main>
  );
}

