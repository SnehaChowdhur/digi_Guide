"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Filter,
  Layers,
  MessageCircle,
  PlayCircle,
  Printer,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { Topic } from "./dashboard";

export type StudyNote = {
  id: string;
  topic: string;
  title: string;
  badgeColor: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readingTime: string;
  summary: string[];
  keyFormula?: string;
  diagramAscii?: string;
  codeSnippet: {
    language: string;
    code: string;
  };
  complexity: {
    time: string;
    space: string;
  };
  deepDive: {
    intuition: string;
    definitions: { term: string; explanation: string }[];
    pitfalls: string[];
    interviewTips: string[];
  };
};

const STUDY_NOTES: StudyNote[] = [
  {
    id: "dp-foundations",
    topic: "Dynamic Programming",
    title: "Dynamic Programming & State Transitions",
    badgeColor: "rose",
    difficulty: "Advanced",
    readingTime: "6 min read",
    summary: [
      "Breaks complex optimization problems into overlapping subproblems with optimal substructure.",
      "Top-Down with Memoization caches recursive results; Bottom-Up Tabulation builds iterative table.",
      "Always define state dimensions clearly (e.g., dp[i][w] = max value using first i items within weight w).",
    ],
    keyFormula: "dp[i] = min(dp[i - c] + 1) for c in coins",
    diagramAscii: `  [Subproblem dp(n)]
       /            \
  [dp(n-1)]      [dp(n-2)]
    /     \       (Cached!)
[dp(n-2)] [dp(n-3)]`,
    codeSnippet: {
      language: "python",
      code: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    },
    complexity: {
      time: "O(amount * len(coins))",
      space: "O(amount)",
    },
    deepDive: {
      intuition:
        "Whenever a brute-force recursive tree solves the exact same argument multiple times, you are wasting exponential operations. DP trades memory space for computational speed by writing down subproblem answers once and reusing them instantly.",
      definitions: [
        {
          term: "Overlapping Subproblems",
          explanation: "The recurrence visits identical subproblems multiple times in the recursion tree.",
        },
        {
          term: "Optimal Substructure",
          explanation: "The globally optimal solution can be constructed from optimal solutions to its subproblems.",
        },
        {
          term: "State Transition",
          explanation: "The mathematical recurrence formula relating larger subproblems to already solved smaller states.",
        },
      ],
      pitfalls: [
        "Failing to identify correct base cases (e.g. dp[0] = 0 vs dp[0] = 1).",
        "Off-by-one errors when allocating table length (always size table to target + 1).",
        "Overcomplicating the state representation when 1D suffices.",
      ],
      interviewTips: [
        "Start by verbalizing the recurrence relation before writing any loop.",
        "Check if space can be optimized from O(n) to O(1) by only tracking the previous two states.",
      ],
    },
  },
  {
    id: "tree-traversals",
    topic: "Trees",
    title: "Binary Trees & BST In-Order Traversal",
    badgeColor: "amber",
    difficulty: "Intermediate",
    readingTime: "5 min read",
    summary: [
      "Hierarchical nonlinear structure where each node has at most two children (left and right).",
      "Binary Search Tree (BST) invariant: left descendants < root < right descendants.",
      "In-Order traversal (Left -> Root -> Right) on a BST strictly yields elements in sorted order.",
    ],
    keyFormula: "BST Invariant: Left < Current < Right",
    diagramAscii: `        (10)
       /    \
     (5)    (15)
    /   \      \
  (2)   (7)    (18)
In-order: [2, 5, 7, 10, 15, 18]`,
    codeSnippet: {
      language: "python",
      code: `def isValidBST(root) -> bool:
    def validate(node, low=float('-inf'), high=float('inf')):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return (validate(node.left, low, node.val) and
                validate(node.right, node.val, high))
    return validate(root)`,
    },
    complexity: {
      time: "O(n) visit each node",
      space: "O(h) call stack height",
    },
    deepDive: {
      intuition:
        "Trees model hierarchical data, XML/DOM trees, and database indices. For searching, a balanced BST guarantees O(log n) lookups. When verifying a BST, checking immediate children is insufficient; you must pass valid bounds (low, high) down the recursive tree.",
      definitions: [
        {
          term: "Depth & Height",
          explanation: "Depth is distance from root to node; height is maximum distance from node to any leaf.",
        },
        {
          term: "Balance Factor",
          explanation: "Difference between left and right subtree heights (kept <= 1 in AVL and Red-Black trees).",
        },
      ],
      pitfalls: [
        "Only checking node.left.val < node.val instead of ensuring ALL left descendants are strictly less.",
        "Forgetting that skew trees degrade to O(n) linked lists without rebalancing.",
      ],
      interviewTips: [
        "Level-order traversal requires a Queue (BFS).",
        "Pre/In/Post order traversals can be elegantly solved using recursion or an explicit stack (DFS).",
      ],
    },
  },
  {
    id: "arrays-two-pointers",
    topic: "Arrays",
    title: "Arrays, Two-Pointers & Sliding Window",
    badgeColor: "emerald",
    difficulty: "Beginner",
    readingTime: "4 min read",
    summary: [
      "Contiguous memory blocks offering O(1) indexed lookups and spatial cache locality.",
      "Two-Pointer technique eliminates nested loops, collapsing O(n^2) brute force into O(n).",
      "Sliding Window maintains an active subarray range while dynamically expanding or contracting.",
    ],
    keyFormula: "while left < right: check condition & advance",
    diagramAscii: `Index:  0    1    2    3    4    5
Array: [1,   3,   5,   7,   11,  15]
        ^                         ^
      left                      right
Sum = 1 + 15 = 16 (Move right leftward if > target)`,
    codeSnippet: {
      language: "python",
      code: `def twoSumSorted(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        curr = numbers[left] + numbers[right]
        if curr == target:
            return [left + 1, right + 1]
        elif curr < target:
            left += 1
        else:
            right -= 1
    return []`,
    },
    complexity: {
      time: "O(n) single pass",
      space: "O(1) auxiliary pointers",
    },
    deepDive: {
      intuition:
        "Because elements in a sorted array have monotonic ordering, moving the left pointer inward strictly increases the sum, and moving the right pointer inward strictly decreases the sum. This guarantees you never need to backtrack.",
      definitions: [
        {
          term: "Contiguous Allocation",
          explanation: "Elements are stored sequentially in memory, enabling direct hardware pointer arithmetic.",
        },
        {
          term: "Amortized O(1) Append",
          explanation: "Dynamic arrays double capacity when full; copying takes O(n) infrequently, averaging O(1).",
        },
      ],
      pitfalls: [
        "Modifying array elements during iteration (causes skipped indexes or unexpected lengths).",
        "Boundary indexing errors (attempting array[len(arr)] instead of array[len(arr) - 1]).",
      ],
      interviewTips: [
        "If an array problem asks for pairs or triplets, sorting first (O(n log n)) frequently unlocks O(n) two-pointer solutions.",
      ],
    },
  },
  {
    id: "linked-lists-pointers",
    topic: "Linked Lists",
    title: "Linked Lists & Fast/Slow Pointer Traversal",
    badgeColor: "teal",
    difficulty: "Intermediate",
    readingTime: "5 min read",
    summary: [
      "Sequential nodes linked via memory pointers; O(1) insertions/deletions once pointer is positioned.",
      "Floyd's Tortoise and Hare algorithm detects loops with zero auxiliary memory.",
      "Dummy head technique simplifies edge cases when inserting or deleting from the head.",
    ],
    keyFormula: "slow = slow.next; fast = fast.next.next",
    diagramAscii: `[Head: 3] -> [Node: 2] -> [Node: 0] -> [Node: -4]
                 ^                           |
                 |---------------------------| (Cycle detected!)`,
    codeSnippet: {
      language: "python",
      code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def hasCycle(head: ListNode) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
    },
    complexity: {
      time: "O(n) traversal length",
      space: "O(1) pointer references",
    },
    deepDive: {
      intuition:
        "Without random indexed memory access, finding midpoints or cycles requires multiple pointers advancing at different speeds. If a cycle exists, the relative speed difference of 1 step per cycle iteration guarantees the fast pointer will eventually lap the slow pointer.",
      definitions: [
        {
          term: "Dummy Node",
          explanation: "A sentinel node pointing to the head, removing special-case code when altering head pointers.",
        },
        {
          term: "Floyd's Cycle Finding",
          explanation: "Two pointers advancing at 1x and 2x velocities; collision implies a closed loop.",
        },
      ],
      pitfalls: [
        "Losing the pointer to the rest of the list before reassigning node.next.",
        "Dereferencing None.next when fast or fast.next reaches the tail.",
      ],
      interviewTips: [
        "Always sketch pointer rewiring on a whiteboard or scratchpad before coding.",
        "To find the middle node, when fast reaches the end, slow is precisely at the midpoint.",
      ],
    },
  },
  {
    id: "recursion-backtracking",
    topic: "Recursion",
    title: "Recursion, Call Stacks & Backtracking",
    badgeColor: "indigo",
    difficulty: "Intermediate",
    readingTime: "5 min read",
    summary: [
      "A function calling itself to solve smaller subproblems; requires explicit base cases.",
      "Every function invocation pushes an activation record frame onto the runtime call stack.",
      "Backtracking explores decision paths, undoing choices upon hitting invalid dead ends.",
    ],
    keyFormula: "Base case: if n <= 1: return 1",
    diagramAscii: `Call Stack (LIFO):
| solve(1) -> returns 1 (Base case reached!) |
| solve(2) -> waits for solve(1)             |
| solve(3) -> waits for solve(2)             |
+--------------------------------------------+`,
    codeSnippet: {
      language: "python",
      code: `def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    def backtrack(start: int, path: list[int]):
        res.append(path.copy())
        for i in range(start, len(nums)):
            path.append(nums[i])        # Choose
            backtrack(i + 1, path)     # Explore
            path.pop()                 # Un-choose (backtrack)
    backtrack(0, [])
    return res`,
    },
    complexity: {
      time: "O(2^n) total subsets",
      space: "O(n) recursive stack depth",
    },
    deepDive: {
      intuition:
        "Recursion simplifies code by letting the operating system stack manage subproblem states. In backtracking, you make a tentative move, recurse, and then systematically undo that move (pop) so the state is restored for subsequent sibling branches.",
      definitions: [
        {
          term: "Stack Frame",
          explanation: "Local memory allocated per call containing arguments, variables, and return instruction address.",
        },
        {
          term: "Tail Recursion",
          explanation: "Recursive call is the absolute final statement, allowing compilers to reuse stack frames.",
        },
      ],
      pitfalls: [
        "Missing base case leading to 'RecursionError: maximum recursion depth exceeded'.",
        "Mutating shared lists without copying before appending to result collections (e.g. res.append(path) vs res.append(path.copy())).",
      ],
      interviewTips: [
        "Follow the three-step formula: 1) Base condition, 2) Choice & recursive explore, 3) Backtrack cleanup.",
      ],
    },
  },
  {
    id: "memoization-caching",
    topic: "Memoization",
    title: "Memoization & Top-Down Cache Architecture",
    badgeColor: "purple",
    difficulty: "Beginner",
    readingTime: "4 min read",
    summary: [
      "Optimization technique storing return values of expensive pure functions in a lookup table.",
      "Transforms exponential O(2^n) tree recursions into linear O(n) DAG traversals.",
      "Can be easily implemented with a dictionary or Python's built-in @lru_cache decorator.",
    ],
    keyFormula: "if args in memo: return memo[args]",
    diagramAscii: `fib(5) -> needs fib(4) and fib(3)
  fib(4) computes fib(3) and saves to memo!
    When fib(5) asks for fib(3) -> Instant O(1) Cache Hit!`,
    codeSnippet: {
      language: "python",
      code: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

# Manual memoization dictionary pattern:
memo = {}
def fibManual(n: int) -> int:
    if n in memo:
        return memo[n]
    if n < 2:
        return n
    memo[n] = fibManual(n - 1) + fibManual(n - 2)
    return memo[n]`,
    },
    complexity: {
      time: "O(n) subproblems solved once",
      space: "O(n) dictionary storage + stack",
    },
    deepDive: {
      intuition:
        "If a function is deterministic (given input X it always produces output Y with no side effects), recomputing it is completely redundant. Storing input-to-output mappings trades a modest chunk of RAM to eliminate millions of wasted cycles.",
      definitions: [
        {
          term: "Pure Function",
          explanation: "A function whose output depends solely on its input arguments with zero side effects.",
        },
        {
          term: "LRU Cache",
          explanation: "Least Recently Used caching eviction policy that discards the oldest accessed item when full.",
        },
      ],
      pitfalls: [
        "Attempting to memoize unhashable argument types like lists or dicts (convert to tuples first).",
        "Memoizing functions with random numbers or external network I/O that change across calls.",
      ],
      interviewTips: [
        "Explain the tradeoff between memoization (intuitive, top-down recursion stack) and tabulation (iterative, avoids stack limit).",
      ],
    },
  },
  {
    id: "python-fundamentals",
    topic: "Python",
    title: "Python Data Structures, Deques & Hash Tables",
    badgeColor: "emerald",
    difficulty: "Beginner",
    readingTime: "4 min read",
    summary: [
      "Mastery of core built-in structures: lists (dynamic arrays), dicts (hash maps), and sets.",
      "collections.deque provides O(1) append and pop from both ends, essential for BFS queues.",
      "heapq module provides a binary min-heap implementation for O(log n) priority queue tasks.",
    ],
    keyFormula: "dict[key] lookup: O(1) amortized",
    diagramAscii: `Hash Map Architecture:
Key ("user_101") -> [Hash Func] -> Index 4 -> Bucket [Val: Alex]
Lookup: O(1) Average | O(n) Worst (Collision)`,
    codeSnippet: {
      language: "python",
      code: `from collections import deque
import heapq

# 1. Double-ended queue for O(1) popleft
queue = deque([1, 2, 3])
queue.append(4)
first = queue.popleft() # 1 in O(1) time

# 2. Min-Heap for Priority Queue
heap = [10, 4, 15, 2]
heapq.heapify(heap) # O(n) linear build
smallest = heapq.heappop(heap) # 2 in O(log n)`,
    },
    complexity: {
      time: "O(1) dict/set lookup",
      space: "O(n) proportional to elements",
    },
    deepDive: {
      intuition:
        "Choosing the wrong data structure can destroy algorithm efficiency. For example, doing pop(0) on a Python list is O(n) because all remaining elements shift leftward. Using collections.deque turns that operation into O(1).",
      definitions: [
        {
          term: "Hash Collision",
          explanation: "When two distinct keys produce the same hash bucket index (resolved via open addressing in Python).",
        },
        {
          term: "Min-Heap",
          explanation: "A complete binary tree where parent nodes are always <= children; root is always the minimum.",
        },
      ],
      pitfalls: [
        "Using list.pop(0) in BFS algorithms (use collections.deque.popleft() instead).",
        "Assuming dict ordering in older Python versions (guaranteed insertion order in Python 3.7+).",
      ],
      interviewTips: [
        "Mention time complexities of Python built-ins like in for set vs list during interview discussions.",
      ],
    },
  },
];

const TOPIC_FILTERS = [
  "All",
  "Dynamic Programming",
  "Trees",
  "Arrays",
  "Linked Lists",
  "Recursion",
  "Memoization",
  "Python",
];

export default function NotesHub({
  topics,
  onOpenQuiz,
  onAskAi,
}: {
  topics: Topic[];
  onOpenQuiz: (topic: string) => void;
  onAskAi: (prompt: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activeNote, setActiveNote] = useState<StudyNote | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("digiguide-notes-bookmarks");
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {
      // Keep defaults
    }
  }, []);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = bookmarks.includes(id) ? bookmarks.filter((b) => b !== id) : [...bookmarks, id];
    setBookmarks(next);
    try {
      window.localStorage.setItem("digiguide-notes-bookmarks", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const copyCode = (code: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    void navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const printNote = (note: StudyNote, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveNote(note);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Match topic mastery percentage from twin topics
  const getTopicMastery = (topicName: string): number => {
    const match = topics.find((t) => t.topic.toLowerCase() === topicName.toLowerCase());
    return match ? Math.round(match.mastery) : 65;
  };

  // Filtered notes calculation
  const filteredNotes = useMemo(() => {
    return STUDY_NOTES.filter((note) => {
      const matchesTopic = selectedTopic === "All" || note.topic.toLowerCase() === selectedTopic.toLowerCase();
      const matchesBookmark = !bookmarkedOnly || bookmarks.includes(note.id);
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.topic.toLowerCase().includes(query) ||
        note.summary.some((s) => s.toLowerCase().includes(query)) ||
        note.codeSnippet.code.toLowerCase().includes(query) ||
        note.deepDive.definitions.some((d) => d.term.toLowerCase().includes(query));

      return matchesTopic && matchesBookmark && matchesSearch;
    });
  }, [search, selectedTopic, bookmarkedOnly, bookmarks]);

  return (
    <div className="notes-hub-container space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="kicker flex items-center gap-1.5">
            <BookOpen size={14} /> High-Yield Study Guides & Cheatsheets
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">Notes & Study Hub</h1>
          <p className="text-xs text-gray-500 mt-1">
            Curated concept breakdowns, visual code patterns, and complexity cheat sheets synced with your Learning Twin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              bookmarkedOnly
                ? "bg-[#0f7770] text-white border-[#0f7770]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Bookmark size={14} className={bookmarkedOnly ? "fill-white" : ""} />
            Bookmarked ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-gray-200/90 shadow-sm space-y-3">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes by concept, algorithm, syntax, or keyword (e.g. 'memoization', 'tree', 'two-pointer')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0f7770] focus:ring-2 focus:ring-[#0f7770]/10 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Topic Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-xs">
          {TOPIC_FILTERS.map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition text-xs ${
                  isSelected
                    ? "bg-[#172321] text-white shadow-sm"
                    : "bg-gray-100/90 text-gray-600 hover:bg-gray-200/80"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100">
          <span>
            Showing <strong>{filteredNotes.length}</strong> of {STUDY_NOTES.length} study guides
          </span>
          {bookmarkedOnly && <span className="text-[#0f7770] font-semibold">Filtering by saved bookmarks</span>}
        </div>
      </div>

      {/* Visual Note Cards Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
          <BookMarked size={36} className="mx-auto text-gray-300" />
          <h3 className="font-bold text-gray-800 text-base">No study notes found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try loosening your search query or selecting &quot;All&quot; topics to view all available notes.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedTopic("All");
              setBookmarkedOnly(false);
            }}
            className="text-xs font-bold text-[#0f7770] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredNotes.map((note) => {
            const mastery = getTopicMastery(note.topic);
            const isBookmarked = bookmarks.includes(note.id);
            const isWeak = mastery < 55;

            return (
              <div
                key={note.id}
                onClick={() => setActiveNote(note)}
                className="group bg-white rounded-2xl border border-gray-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#0f7770]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Badge Row */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0f7770]/10 text-[#0f7770]">
                        {note.topic}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isWeak
                            ? "bg-rose-100 text-rose-800"
                            : mastery >= 80
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        Twin Mastery {mastery}%
                      </span>
                    </div>

                    <button
                      type="button"
                      title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                      onClick={(e) => toggleBookmark(note.id, e)}
                      className={`p-1.5 rounded-lg border text-gray-400 hover:text-gray-800 transition ${
                        isBookmarked ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <Bookmark size={13} className={isBookmarked ? "fill-amber-500" : ""} />
                    </button>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#0f7770] transition-colors">
                    {note.title}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1 mb-3">
                    <span>{note.readingTime}</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-600">{note.difficulty}</span>
                  </div>

                  {/* Summary Bullets */}
                  <ul className="space-y-1.5 text-xs text-gray-600 mb-4">
                    {note.summary.slice(0, 2).map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#0f7770] font-bold leading-none mt-0.5">›</span>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Mini Diagram / Code Preview Box */}
                  {note.keyFormula ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-[10.5px] text-gray-800 mb-4 flex items-center justify-between">
                      <span className="truncate pr-2">{note.keyFormula}</span>
                      <Code2 size={13} className="text-gray-400 flex-shrink-0" />
                    </div>
                  ) : null}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Ask AI Tutor about this topic"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAi(`Can you explain the key concepts and common interview pitfalls of ${note.title}?`);
                      }}
                      className="p-1.5 rounded-lg bg-emerald-50 text-[#0f7770] hover:bg-emerald-100 transition flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <MessageCircle size={12} /> Ask Tutor
                    </button>
                    <button
                      type="button"
                      title="Download or Print Study Sheet"
                      onClick={(e) => printNote(note, e)}
                      className="p-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition flex items-center gap-1 text-[11px]"
                    >
                      <Download size={12} /> PDF
                    </button>
                  </div>

                  <span className="text-[11px] font-bold text-[#0f7770] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Guide →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL / STUDY DRAWER */}
      {activeNote && (
        <div
          className="fixed inset-0 z-50 bg-[#172321]/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn"
          onClick={() => setActiveNote(null)}
        >
          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-[#fbfdf9] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0f7770]/10 text-[#0f7770]">
                    {activeNote.topic}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                    {activeNote.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">{activeNote.readingTime}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900">{activeNote.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title="Bookmark"
                  onClick={() => toggleBookmark(activeNote.id)}
                  className={`p-2 rounded-xl border transition ${
                    bookmarks.includes(activeNote.id)
                      ? "bg-amber-50 border-amber-200 text-amber-600"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Bookmark size={16} className={bookmarks.includes(activeNote.id) ? "fill-amber-500" : ""} />
                </button>
                <button
                  type="button"
                  title="Print Study Guide"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                >
                  <Printer size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNote(null)}
                  className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs leading-relaxed text-gray-700">
              {/* Concept Intuition Box */}
              <div className="bg-[#f4faf2] p-4 rounded-xl border border-emerald-200/80 space-y-1.5">
                <div className="text-[11px] font-bold text-[#0f7770] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} /> Core Intuition & Theory
                </div>
                <p className="text-gray-800 leading-relaxed text-[13px]">{activeNote.deepDive.intuition}</p>
              </div>

              {/* Visual Diagram / ASCII representation */}
              {activeNote.diagramAscii && (
                <div className="space-y-1.5">
                  <span className="font-bold text-gray-900 text-xs block">Visual Schema & Traversal</span>
                  <pre className="bg-[#172321] text-[#c8f169] p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner">
                    {activeNote.diagramAscii}
                  </pre>
                </div>
              )}

              {/* Complexity Cheat Sheet */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Time Complexity</span>
                  <span className="font-mono text-sm font-bold text-gray-900">{activeNote.complexity.time}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Space Complexity</span>
                  <span className="font-mono text-sm font-bold text-gray-900">{activeNote.complexity.space}</span>
                </div>
              </div>

              {/* Key Definitions Table */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 text-xs block">Key Definitions & Terminology</span>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {activeNote.deepDive.definitions.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <strong className="text-gray-900 font-semibold sm:w-44 flex-shrink-0">{item.term}</strong>
                      <span className="text-gray-600">{item.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Implementation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-xs">Reference Implementation</span>
                  <button
                    type="button"
                    onClick={(e) => copyCode(activeNote.codeSnippet.code, activeNote.id, e)}
                    className="text-[11px] text-[#0f7770] font-bold flex items-center gap-1 hover:underline"
                  >
                    {copiedCodeId === activeNote.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Code</>}
                  </button>
                </div>
                <div className="code-block-wrapper">
                  <div className="code-block-header">
                    <span>{activeNote.codeSnippet.language}</span>
                  </div>
                  <pre className="code-snippet">
                    <code>{activeNote.codeSnippet.code}</code>
                  </pre>
                </div>
              </div>

              {/* Common Pitfalls */}
              <div className="space-y-2">
                <span className="font-bold text-rose-800 text-xs block">Common Pitfalls & Bugs to Avoid</span>
                <ul className="space-y-1.5 bg-rose-50/60 p-4 rounded-xl border border-rose-100 text-gray-700">
                  {activeNote.deepDive.pitfalls.map((pitfall, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">⚠</span>
                      <span>{pitfall}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interview Strategy Tips */}
              <div className="space-y-2">
                <span className="font-bold text-[#0f7770] text-xs block">Technical Interview Tips</span>
                <ul className="space-y-1.5 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-gray-700">
                  {activeNote.deepDive.interviewTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#0f7770] font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 md:p-5 border-t border-gray-100 bg-[#fbfdf9] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const query = `Can you quiz me on ${activeNote.topic} and explain how to apply ${activeNote.title}?`;
                  setActiveNote(null);
                  onAskAi(query);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-50 text-[#0f7770] hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <MessageCircle size={14} /> Ask AI Tutor Deep Dive
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const topic = activeNote.topic;
                    setActiveNote(null);
                    onOpenQuiz(topic);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#172321] text-white hover:bg-black font-bold text-xs flex items-center gap-1.5 transition shadow"
                >
                  <PlayCircle size={14} /> Practice {activeNote.topic} Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
