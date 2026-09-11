"use client";

import { useState } from "react";
import { ArrowUpRight, Bookmark, BookOpen, Braces, Check, Download, FileText, GitBranch, Lightbulb, Search, X } from "lucide-react";

type Note = {
  topic: string;
  mastery: number;
  color: string;
  icon: typeof BookOpen;
  summary: string;
  bullets: string[];
  preview: string;
  guide: { definition: string; takeaways: string[]; code: string; practice: string[] };
};

const notes: Note[] = [
  {
    topic: "Dynamic Programming", mastery: 38, color: "coral", icon: GitBranch,
    summary: "Turn repeated work into a reusable table of smaller answers.",
    bullets: ["Overlapping subproblems", "Optimal substructure", "Memoization or tabulation"],
    preview: "answer[n] = best(answer[n - 1], answer[n - 2])",
    guide: { definition: "Dynamic programming solves a problem by combining answers to smaller subproblems and keeping each answer so it is not recomputed.", takeaways: ["Start by naming the state.", "Write the recurrence before optimizing.", "Choose top-down memoization or bottom-up tabulation."], code: "function fib(n) {\n  const dp = [0, 1];\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i - 1] + dp[i - 2];\n  }\n  return dp[n];\n}", practice: ["Climbing Stairs", "House Robber", "Coin Change"] }
  },
  {
    topic: "Trees", mastery: 61, color: "lavender", icon: GitBranch,
    summary: "Model hierarchy with nodes connected from a single root.",
    bullets: ["Root and child relationships", "Depth-first traversal", "In-order BST sorting"],
    preview: "        8\n      /   \\\n     3     10",
    guide: { definition: "A tree is a connected structure with no cycles. Each node can have zero or more children, and the root has no parent.", takeaways: ["Pre-order is useful for copying structure.", "In-order visits a binary search tree in sorted order.", "Breadth-first search explores one level at a time."], code: "function inOrder(node) {\n  if (!node) return;\n  inOrder(node.left);\n  console.log(node.value);\n  inOrder(node.right);\n}", practice: ["Maximum Depth of Binary Tree", "Validate BST", "Level Order Traversal"] }
  },
  {
    topic: "Arrays", mastery: 83, color: "mint", icon: Braces,
    summary: "Use contiguous indexed storage for fast direct access.",
    bullets: ["Index access is O(1)", "Shifting makes front inserts O(n)", "Two pointers reduce extra space"],
    preview: "index:  0    1    2\nvalue: [12] [25] [40]",
    guide: { definition: "An array stores values in ordered positions. The index acts like an address, making direct lookup fast.", takeaways: ["Track a left and right boundary for windows.", "Sort before using binary search.", "Watch for off-by-one boundaries."], code: "let left = 0;\nfor (let right = 0; right < values.length; right++) {\n  while (tooLarge(values, left, right)) left++;\n}", practice: ["Two Sum", "Sliding Window Maximum", "Merge Intervals"] }
  },
  {
    topic: "Linked Lists", mastery: 72, color: "gold", icon: GitBranch,
    summary: "Follow links between nodes when structure changes often.",
    bullets: ["Each node stores next", "No random index access", "Relink before you lose the chain"],
    preview: "[10 | next] -> [20 | next] -> null",
    guide: { definition: "A linked list is a sequence of nodes where each node points to the next node. Nodes do not need to be next to one another in memory.", takeaways: ["Save next before changing a link.", "A sentinel node simplifies edge cases.", "Fast insertion requires a node reference."], code: "const next = current.next;\ncurrent.next = newNode;\nnewNode.next = next;", practice: ["Reverse Linked List", "Merge Two Sorted Lists", "Remove Nth Node"] }
  },
  {
    topic: "Python", mastery: 91, color: "teal", icon: BookOpen,
    summary: "Keep Python code expressive with the right built-in structures.",
    bullets: ["Lists preserve order", "Sets make membership fast", "Dicts map keys to values"],
    preview: "counts = {}\ncounts[item] = counts.get(item, 0) + 1",
    guide: { definition: "Python's built-in collections let you express common algorithms clearly while the runtime handles storage details.", takeaways: ["Use a set for membership checks.", "Use a dictionary for counting and lookup.", "Prefer readable loops before clever shortcuts."], code: "counts = {}\nfor item in values:\n    counts[item] = counts.get(item, 0) + 1", practice: ["First Unique Character", "Group Anagrams", "Top K Frequent"] }
  }
];

const filters = ["All", "Dynamic Programming", "Trees", "Arrays", "Linked Lists", "Python"];

export default function NotesHub({ onAskTutor }: { onAskTutor: (topic: string) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Note | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const visible = notes.filter(note => (filter === "All" || note.topic === filter) && `${note.topic} ${note.summary} ${note.bullets.join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  const toggleBookmark = (topic: string) => setBookmarks(current => current.includes(topic) ? current.filter(item => item !== topic) : [...current, topic]);
  const downloadNote = (note: Note) => {
    const text = `${note.topic}\n\n${note.guide.definition}\n\nKey takeaways\n${note.guide.takeaways.map(item => `- ${item}`).join("\n")}\n\nCode\n${note.guide.code}\n\nPractice\n${note.guide.practice.join("\n")}`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    link.download = `${note.topic.toLowerCase().replaceAll(" ", "-")}-study-guide.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return <section className="notes-view">
    <div className="notes-heading"><div><div className="kicker">Notes & study hub</div><h2>Keep the ideas you will need next.</h2><p>Compact study guides, visual cues, and practice paths for your learning twin.</p></div><div className="notes-count"><strong>{visible.length}</strong><span>guides<br />available</span></div></div>
    <div className="notes-toolbar"><label className="notes-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search notes, concepts, or patterns..." aria-label="Search notes" /></label><div className="note-filters" role="tablist" aria-label="Filter notes">{filters.map(item => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
    <div className="notes-grid">{visible.map(note => { const Icon = note.icon; const bookmarked = bookmarks.includes(note.topic); return <article className="note-card" key={note.topic} onClick={() => setSelected(note)} tabIndex={0} onKeyDown={event => event.key === "Enter" && setSelected(note)}><div className={`note-card-top ${note.color}`}><div className="note-icon"><Icon size={19} /></div><span className="mastery-tag">{note.mastery}% mastery</span><button className={`bookmark-button ${bookmarked ? "bookmarked" : ""}`} aria-label={`${bookmarked ? "Remove" : "Add"} ${note.topic} bookmark`} onClick={event => { event.stopPropagation(); toggleBookmark(note.topic); }}><Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} /></button></div><div className="note-card-body"><div className="note-card-title"><div><span className="kicker">Study guide</span><h3>{note.topic}</h3></div><ArrowUpRight size={17} /></div><p>{note.summary}</p><ul>{note.bullets.map(item => <li key={item}><Check size={13} />{item}</li>)}</ul><pre>{note.preview}</pre></div></article>; })}</div>
    {!visible.length && <div className="notes-empty"><FileText size={24} /><h3>No matching notes</h3><p>Try another topic or clear the search.</p></div>}
    {selected && <div className="notes-modal-backdrop" onClick={() => setSelected(null)}><article className="notes-modal" onClick={event => event.stopPropagation()}><button className="notes-close" onClick={() => setSelected(null)} aria-label="Close note"><X size={18} /></button><div className={`note-modal-banner ${selected.color}`}><div className="note-icon"><selected.icon size={21} /></div><div><span className="kicker">{selected.mastery}% current mastery</span><h2>{selected.topic}</h2></div></div><div className="note-modal-content"><p className="note-definition">{selected.guide.definition}</p><div className="note-modal-columns"><div><h3><Lightbulb size={16} />Key takeaways</h3><ul className="takeaway-list">{selected.guide.takeaways.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3><Braces size={16} />Cheatsheet</h3><pre className="guide-code">{selected.guide.code}</pre></div></div><h3>Practice path</h3><div className="practice-links">{selected.guide.practice.map(item => <button key={item} onClick={() => onAskTutor(`${selected.topic}: help me practice ${item}`)}>{item}<ArrowUpRight size={14} /></button>)}</div><div className="note-actions"><button className="cta" onClick={() => downloadNote(selected)}><Download size={15} />Download PDF</button><button className="secondary-note-action" onClick={() => onAskTutor(`Explain ${selected.topic} using this note and give me one practice question.`)}><Lightbulb size={15} />Ask AI Tutor about this note</button><button className="secondary-note-action" onClick={() => toggleBookmark(selected.topic)}><Bookmark size={15} fill={bookmarks.includes(selected.topic) ? "currentColor" : "none"} />{bookmarks.includes(selected.topic) ? "Bookmarked" : "Bookmark"}</button></div></div></article></div>}
  </section>;
}
