"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Filter,
  GraduationCap,
  Layers,
  MessageCircle,
  Play,
  PlayCircle,
  Printer,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
  Tag,
  Video,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import { Topic } from "./dashboard";

export type PracticeProblem = {
  name: string;
  platform: "GeeksforGeeks" | "LeetCode";
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

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
    explanation: string;
  };
  complexity: {
    time: string;
    space: string;
    timeDetails: string;
    spaceDetails: string;
  };
  openSourceRef: {
    gfgTitle: string;
    gfgUrl: string;
    bookTitle: string;
    bookAuthor: string;
    bookChapter: string;
    keyQuote: string;
  };
  videoResource: {
    title: string;
    channel: string;
    duration: string;
    youtubeUrl: string;
    youtubeEmbedId: string;
    highlight: string;
  };
  deepDive: {
    intuition: string;
    realWorldAnalogy: string;
    definitions: { term: string; explanation: string }[];
    pitfalls: string[];
    interviewTips: string[];
  };
  practiceProblems: PracticeProblem[];
  flashcard: {
    prompt: string;
    answer: string;
    keyTakeaway: string;
  };
};

const STUDY_NOTES: StudyNote[] = [
  {
    id: "dp-mastery",
    topic: "Dynamic Programming",
    title: "Dynamic Programming: Overlapping Subproblems, Memoization & Tabulation",
    badgeColor: "rose",
    difficulty: "Advanced",
    readingTime: "6 min read",
    summary: [
      "Deconstructs complex optimization problems into overlapping, recursive subproblems.",
      "Memoization (Top-Down): Caches evaluation results in a dictionary/array to eliminate re-computation.",
      "Tabulation (Bottom-Up): Evaluates dependencies iteratively starting from the elementary base cases.",
      "Space Optimization: Condenses DP arrays to O(1) memory when transitions depend only on preceding k states."
    ],
    keyFormula: "dp[i] = min(dp[i - coin] + 1) for coin in coins",
    diagramAscii: `[Recursive Redundancy Tree: fib(5)]
                fib(5)
              /        \\
          fib(4)        fib(3)  <-- fib(3) computed twice!
          /    \\        /    \\
      fib(3)  fib(2)  fib(2)  fib(1) <-- fib(2) computed three times!
      /    \\
   fib(2)  fib(1)
Naive: O(2^n) calls  --->  With Memoization Cache: O(n) calls`,
    codeSnippet: {
      language: "python",
      code: `def coin_change(coins: list[int], amount: int) -> int:
    """
    Bottom-up Tabulation DP (CLRS / GFG Canonical Pattern).
    Time Complexity: O(amount * len(coins))
    Space Complexity: O(amount)
    """
    # Initialize DP array with infinity (representing unreachable states)
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins needed to make amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

# Example verification:
# coin_change([1, 2, 5], 11) -> 3 coins (5 + 5 + 1)`,
      explanation: "Uses an array dp[0..amount] where each entry dp[i] holds the minimum coins required to make sum i."
    },
    complexity: {
      time: "O(n × W)",
      space: "O(W)",
      timeDetails: "Linear with respect to state space and number of transitions per state.",
      spaceDetails: "Linear in state space, often compressible to O(1) or O(W) using rolling arrays."
    },
    openSourceRef: {
      gfgTitle: "GeeksforGeeks: Dynamic Programming (DP) Complete Guide",
      gfgUrl: "https://www.geeksforgeeks.org/dynamic-programming/",
      bookTitle: "Introduction to Algorithms (CLRS)",
      bookAuthor: "Cormen, Leiserson, Rivest, Stein",
      bookChapter: "Chapter 14/15: Dynamic Programming",
      keyQuote: "Dynamic programming solves problems by combining the solutions to subproblems. Unlike divide-and-conquer, DP is applicable when subproblems overlap—that is, when subproblems share subsubproblems."
    },
    videoResource: {
      title: "Dynamic Programming for Beginners - Full Course",
      channel: "NeetCode",
      duration: "18:42",
      youtubeUrl: "https://www.youtube.com/watch?v=oBt53YbR9Kk",
      youtubeEmbedId: "oBt53YbR9Kk",
      highlight: "Step-by-step intuition: moving from brute-force recursion tree to memoization and bottom-up DP arrays."
    },
    deepDive: {
      intuition: "Dynamic Programming is disciplined recursion with memory. When solving a problem where subproblems repeat (like computing Fibonacci or 0/1 Knapsack), standard recursion re-evaluates identical subtrees billions of times. DP guarantees that each unique subproblem is computed exactly once.",
      realWorldAnalogy: "Writing '1 + 1 + 1 + 1 = 4' on a chalkboard. When asked 'what is + 1 more?', you don't count from the first '1' again; you instantly answer 5 because you remembered the answer to the subproblem.",
      definitions: [
        {
          term: "Optimal Substructure",
          explanation: "An optimal solution to the problem contains within it optimal solutions to related subproblems (CLRS Theorem 15.1)."
        },
        {
          term: "Overlapping Subproblems",
          explanation: "A problem space where a recursive algorithm visits the same subproblems over and over, rather than generating new subproblems."
        },
        {
          term: "State Transition Function",
          explanation: "The recurrence relation defining dp[state] mathematically based on previously resolved sub-states."
        }
      ],
      pitfalls: [
        "Passing mutable default arguments (e.g., memo={}) in Python which causes cache leaks across test cases.",
        "Missing base cases or setting them incorrectly, resulting in infinite recursion or off-by-one errors.",
        "Allocating full 2D tables when transitions only depend on the previous row (wasting space)."
      ],
      interviewTips: [
        "Always state the dimensions of your DP state explicitly (e.g. 'dp[i][w] = max value with first i items and capacity w').",
        "Start by writing the brute-force recursive relation on the whiteboard, then point out where overlapping calls occur.",
        "Offer to optimize memory from O(n²) to O(n) using rolling state arrays for bonus points."
      ]
    },
    practiceProblems: [
      { name: "Climbing Stairs", platform: "LeetCode", url: "https://leetcode.com/problems/climbing-stairs/", difficulty: "Easy" },
      { name: "Coin Change (Min Coins)", platform: "LeetCode", url: "https://leetcode.com/problems/coin-change/", difficulty: "Medium" },
      { name: "0/1 Knapsack Problem", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/", difficulty: "Medium" },
      { name: "Longest Common Subsequence", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/", difficulty: "Medium" }
    ],
    flashcard: {
      prompt: "What two fundamental properties must a problem exhibit for Dynamic Programming to apply?",
      answer: "1. Optimal Substructure (an optimal solution to the overall problem incorporates optimal solutions to subproblems).\n2. Overlapping Subproblems (the recursive tree encounters identical subproblems multiple times).",
      keyTakeaway: "If subproblems do not overlap, use Divide & Conquer (e.g. Merge Sort). If they do overlap, cache them!"
    }
  },
  {
    id: "trees-mastery",
    topic: "Trees",
    title: "Binary Trees & BSTs: Invariants, Traversals & Structural Recursion",
    badgeColor: "amber",
    difficulty: "Intermediate",
    readingTime: "5 min read",
    summary: [
      "Hierarchical branching structures with a single root and recursive subtree definitions.",
      "Binary Search Tree Invariant: Every node in left subtree is < root < every node in right subtree.",
      "In-Order Traversal (Left, Root, Right) of a valid BST guarantees strictly sorted non-decreasing order.",
      "Breadth-First Search (BFS) uses a FIFO queue; Depth-First Search (DFS) uses call-stack recursion."
    ],
    keyFormula: "h = ⌊log2(n)⌋ (balanced) vs h = n (degenerate linked list)",
    diagramAscii: `[Binary Search Tree Invariant & Traversals]
              8 (Root)
            /   \\
          3      10
         / \\       \\
        1   6       14
           / \\     /
          4   7   13

In-Order Walk (L, Root, R): [1, 3, 4, 6, 7, 8, 10, 13, 14] -> ALWAYS SORTED!
Pre-Order Walk (Root, L, R): [8, 3, 1, 6, 4, 7, 10, 14, 13] -> Tree Copy/Serialization
Post-Order Walk (L, R, Root): [1, 4, 7, 6, 3, 13, 14, 10, 8] -> Bottom-Up Deletion`,
    codeSnippet: {
      language: "python",
      code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root: TreeNode | None, low=float('-inf'), high=float('inf')) -> bool:
    """
    Validates BST using range constraints (CLRS Ch. 12 / GFG Standard).
    Time Complexity: O(n)
    Space Complexity: O(h) call-stack frames
    """
    if not root:
        return True
    
    # Current node value must be strictly within bounded range
    if not (low < root.val < high):
        return False
    
    # Left children must be < root.val; Right children must be > root.val
    return (is_valid_bst(root.left, low, root.val) and 
            is_valid_bst(root.right, root.val, high))`,
      explanation: "Propagates (low, high) bounds downward to prevent deep subtrees from violating ancestor constraints."
    },
    complexity: {
      time: "O(n)",
      space: "O(h)",
      timeDetails: "Every node is visited once. Space equals maximum tree height on the execution call stack.",
      spaceDetails: "O(log n) for balanced AVL/Red-Black trees; degrades to O(n) for degenerate skewed trees."
    },
    openSourceRef: {
      gfgTitle: "GeeksforGeeks: Binary Tree Data Structure Comprehensive",
      gfgUrl: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
      bookTitle: "Introduction to Algorithms (CLRS)",
      bookAuthor: "Cormen, Leiserson, Rivest, Stein",
      bookChapter: "Chapter 12: Binary Search Trees",
      keyQuote: "The binary-search-tree property guarantees that an in-order tree walk prints all keys in sorted order in Θ(n) time. Searching, minimum, maximum, predecessor, and successor all run in O(h) time where h is the tree height."
    },
    videoResource: {
      title: "Binary Tree Algorithms for Technical Interviews",
      channel: "freeCodeCamp.org",
      duration: "2:01:45",
      youtubeUrl: "https://www.youtube.com/watch?v=fAAZ2GDZCQY",
      youtubeEmbedId: "fAAZ2GDZCQY",
      highlight: "Comprehensive visual walk-through of BFS queue level order, DFS tree recursion, and lowest common ancestor."
    },
    deepDive: {
      intuition: "Trees are non-linear data structures that capture hierarchy and logarithmic partitioning. Because every subtree is itself a complete tree, almost all tree algorithms are naturally expressed as 3-line structural recursions on root, left, and right.",
      realWorldAnalogy: "A corporate hierarchy or an operating system directory tree: folders containing files and other sub-folders.",
      definitions: [
        {
          term: "BST Invariant",
          explanation: "For any node x: every key in left subtree ≤ x.key, and every key in right subtree ≥ x.key."
        },
        {
          term: "Tree Height (h)",
          explanation: "The number of edges on the longest path from root to a leaf node. Directly dictates search complexity."
        },
        {
          term: "Level Order Traversal",
          explanation: "Breadth-first traversal visiting nodes level-by-level using a FIFO queue."
        }
      ],
      pitfalls: [
        "Only checking node.left.val < node.val without ensuring all nodes in left subtree are smaller than all higher ancestors.",
        "Forgetting that trees can degenerate into O(n) linked lists if elements are inserted in pre-sorted order without balancing.",
        "Missing empty tree base case (root is None)."
      ],
      interviewTips: [
        "Whenever asked to find elements level-by-level, immediately reach for collections.deque for BFS.",
        "To find the Lowest Common Ancestor (LCA) in a BST, check if root.val is between p and q in O(h) time."
      ]
    },
    practiceProblems: [
      { name: "Validate Binary Search Tree", platform: "LeetCode", url: "https://leetcode.com/problems/validate-binary-search-tree/", difficulty: "Medium" },
      { name: "Lowest Common Ancestor in BST", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/lowest-common-ancestor-in-a-binary-search-tree/", difficulty: "Easy" },
      { name: "Binary Tree Level Order Traversal", platform: "LeetCode", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", difficulty: "Medium" },
      { name: "Invert / Flip Binary Tree", platform: "LeetCode", url: "https://leetcode.com/problems/invert-binary-tree/", difficulty: "Easy" }
    ],
    flashcard: {
      prompt: "Why is 'node.left.val < node.val' insufficient to validate a Binary Search Tree?",
      answer: "A BST requires EVERY node in the left subtree to be strictly smaller than the ancestor. A deep child might satisfy its immediate parent but violate a higher root constraint. You must enforce range bounds (low, high).",
      keyTakeaway: "In-order traversal of a valid BST always produces a strictly ascending sequence."
    }
  },
  {
    id: "arrays-mastery",
    topic: "Arrays",
    title: "Arrays & Two Pointers: Contiguous Memory, Cache Locality & Sliding Window",
    badgeColor: "teal",
    difficulty: "Beginner",
    readingTime: "4 min read",
    summary: [
      "Contiguous physical memory allocation providing instantaneous O(1) random arithmetic access.",
      "High CPU cache line hit ratios due to sequential spatial locality.",
      "Two-Pointer Technique: Compresses nested loops from O(n²) to linear O(n) on sorted sequences.",
      "Sliding Window: Expands and contracts a dynamic subarray window to optimize contiguous constraints."
    ],
    keyFormula: "Address = Base_Address + (Index × Element_Size_in_Bytes)",
    diagramAscii: `[Two-Pointer Convergence Pattern on Sorted Array]
Target Sum = 14
Left                                              Right
 v                                                  v
[ 2,    4,    6,    8,   10,   12,   15,   18,   20 ]
Sum = 2 + 20 = 22 (> 14) -> Decrement Right Pointer!

Left                                        Right
 v                                            v
[ 2,    4,    6,    8,   10,   12,   15,   18,   20 ]
Sum = 2 + 18 = 20 (> 14) -> Decrement Right Pointer!

       Left                           Right
        v                               v
[ 2,    4,    6,    8,   10,   12,   15,   18,   20 ]
Sum = 4 + 10 = 14 (== 14) -> MATCH FOUND in O(n) time!`,
    codeSnippet: {
      language: "python",
      code: `def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    """
    Two-Pointer Converging Search (Cracking the Coding Interview Ch. 1).
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1   # Need larger sum, advance left pointer
        else:
            right -= 1  # Need smaller sum, decrement right pointer
            
    return []`,
      explanation: "Monotonically approaches target sum by pruning impossible combinations in single pass."
    },
    complexity: {
      time: "O(n)",
      space: "O(1)",
      timeDetails: "Single linear pass; left and right pointers together traverse at most n elements.",
      spaceDetails: "In-place traversal requires zero auxiliary storage."
    },
    openSourceRef: {
      gfgTitle: "GeeksforGeeks: Array Data Structure Guide & Operations",
      gfgUrl: "https://www.geeksforgeeks.org/array-data-structure-guide/",
      bookTitle: "Cracking the Coding Interview",
      bookAuthor: "Gayle Laakmann McDowell",
      bookChapter: "Chapter 1: Arrays and Strings & Hash Tables",
      keyQuote: "Because array elements are stored in contiguous memory blocks, knowing the base address and index yields instant O(1) random access: Address = Base + (Index * Element_Size). This spatial locality maximizes CPU L1/L2 cache hits."
    },
    videoResource: {
      title: "Two Pointer Technique & Sliding Window for Coding Interviews",
      channel: "NeetCode",
      duration: "14:20",
      youtubeUrl: "https://www.youtube.com/watch?v=On03HWe2tZM",
      youtubeEmbedId: "On03HWe2tZM",
      highlight: "Explains how to collapse nested O(n²) quadratic loops into linear O(n) single passes."
    },
    deepDive: {
      intuition: "Arrays are the most fundamental building block in computer science. They map directly to hardware RAM memory buses. Because memory addresses are contiguous, CPUs prefetch entire cache lines into L1 cache, making array access vastly faster than pointer-chasing node structures.",
      realWorldAnalogy: "Numbered houses along a straight street. If you know house #0 is at coordinate 100 and houses are 10 meters apart, house #7 is guaranteed to be at coordinate 100 + (7 * 10) = 170.",
      definitions: [
        {
          term: "Spatial Locality",
          explanation: "Accessing memory address k makes it overwhelmingly likely that nearby addresses k+1 will be accessed shortly."
        },
        {
          term: "Amortized O(1) Append",
          explanation: "Dynamic arrays resize by doubling capacity when full. Doubling is expensive, but occurs so infrequently that the average append is constant time O(1)."
        },
        {
          term: "Sliding Window",
          explanation: "An algorithmic technique maintaining contiguous boundaries [left, right] to compute metrics like longest substring or minimum subarray."
        }
      ],
      pitfalls: [
        "Off-by-one errors with exclusive upper bounds (e.g. range(len(arr)) vs range(len(arr) - 1)).",
        "Modifying an array while iterating over it, causing skipped indices.",
        "Using array insertions at index 0 (which takes O(n) element shifts) instead of collections.deque."
      ],
      interviewTips: [
        "Check if the input is sorted. If it is, consider Two Pointers or Binary Search immediately.",
        "If asked for 'longest/shortest contiguous subarray', immediately frame it as a Sliding Window."
      ]
    },
    practiceProblems: [
      { name: "Two Sum II - Input Array Is Sorted", platform: "LeetCode", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", difficulty: "Medium" },
      { name: "Container With Most Water", platform: "LeetCode", url: "https://leetcode.com/problems/container-with-most-water/", difficulty: "Medium" },
      { name: "Subarray with Given Sum", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/find-subarray-with-given-sum/", difficulty: "Medium" },
      { name: "Best Time to Buy and Sell Stock", platform: "LeetCode", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", difficulty: "Easy" }
    ],
    flashcard: {
      prompt: "When can the Two-Pointer technique be used to reduce time complexity from O(n²) to O(n)?",
      answer: "When the sequence possesses a monotonic directional property—typically a sorted array. If sum is too small, advancing the left pointer is guaranteed to increase it. If too large, decrementing the right pointer is guaranteed to decrease it.",
      keyTakeaway: "Two pointers converge in O(n) without examining invalid combinations."
    }
  },
  {
    id: "linked-lists-mastery",
    topic: "Linked Lists",
    title: "Linked Lists: Pointer Manipulations, In-Place Reversals & Floyd's Algorithm",
    badgeColor: "blue",
    difficulty: "Intermediate",
    readingTime: "5 min read",
    summary: [
      "Discrete node structures allocated dynamically in heap memory and connected by pointers.",
      "Constant-time O(1) head insertions and deletions without shifting trailing elements.",
      "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) detects loops in O(n) time and O(1) space.",
      "Dummy Head Technique: Allocates a sentinel head node to eliminate special edge-case handling for the root."
    ],
    keyFormula: "dist(fast, slow) decreases by 1 on every iteration inside a cycle",
    diagramAscii: `[In-Place Linked List Reversal]
Initial:  [1] -> [2] -> [3] -> [4] -> None
Step 1:   None <- [1]    [2] -> [3] -> [4]
Step 2:   None <- [1] <- [2]    [3] -> [4]
Step 3:   None <- [1] <- [2] <- [3] <- [4] (New Head)

[Floyd's Tortoise and Hare Cycle Detection]
Head -> [1] -> [2] -> [3] -> [4] --\\
                ^                  |
                +-------- [6] <- [5]
Slow advances 1 step. Fast advances 2 steps.
Relative speed difference = 1 node/step -> Guaranteed collision inside the loop!`,
    codeSnippet: {
      language: "python",
      code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode | None) -> ListNode | None:
    """
    In-Place Iterative Linked List Reversal (CLRS Ch. 10 / GFG).
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    prev = None
    curr = head
    
    while curr:
        next_temp = curr.next  # 1. Stash next pointer
        curr.next = prev       # 2. Invert current arrow backwards
        prev = curr            # 3. Advance prev forward
        curr = next_temp       # 4. Advance curr forward
        
    return prev  # New head of the reversed list`,
      explanation: "Maintains prev and next_temp pointers to invert direction in-place without memory allocation."
    },
    complexity: {
      time: "O(n)",
      space: "O(1)",
      timeDetails: "Single traversal visiting each node exactly once.",
      spaceDetails: "Strictly in-place pointer manipulation; no new heap objects allocated."
    },
    openSourceRef: {
      gfgTitle: "GeeksforGeeks: Linked List Data Structure Tutorial",
      gfgUrl: "https://www.geeksforgeeks.org/data-structures/linked-list/",
      bookTitle: "Introduction to Algorithms (CLRS)",
      bookAuthor: "Cormen, Leiserson, Rivest, Stein",
      bookChapter: "Chapter 10: Elementary Data Structures (Linked Lists)",
      keyQuote: "A linked list represents dynamic sets without contiguous memory constraints. Inserting or deleting at a known pointer location takes O(1) time without element shifting, but accessing the k-th element requires linear O(k) traversal."
    },
    videoResource: {
      title: "Data Structures: Singly Linked List Operations",
      channel: "Abdul Bari",
      duration: "26:30",
      youtubeUrl: "https://www.youtube.com/watch?v=nobqZ_o8v-M",
      youtubeEmbedId: "nobqZ_o8v-M",
      highlight: "Masterclass on node pointer reassignment, dummy head allocation, and cyclic collision proofs."
    },
    deepDive: {
      intuition: "Unlike arrays which require contiguous pre-allocated memory slabs, linked lists grow organically one node at a time wherever RAM has free space. Pointers tie the sequence together. The trade-off is losing instant O(1) index access in exchange for instant O(1) head insertion/deletion.",
      realWorldAnalogy: "A scavenger hunt: the first clue tells you where to find the second clue, which tells you where to find the third. You cannot jump directly to clue #5 without following the chain.",
      definitions: [
        {
          term: "Floyd's Tortoise & Hare",
          explanation: "Cycle detection algorithm using two pointers at speeds 1 and 2. Fast enters the loop first; every iteration reduces gap by 1 until they collide."
        },
        {
          term: "Dummy / Sentinel Node",
          explanation: "An artificial node preceding the head (dummy = ListNode(0, head)) that standardizes insertions and deletions without edge case checks."
        },
        {
          term: "Memory Fragmentation Resilience",
          explanation: "Linked lists allocate small disjoint chunks, avoiding allocation failures when contiguous blocks are unavailable."
        }
      ],
      pitfalls: [
        "Losing the reference to the rest of the list by overwriting curr.next before saving it in next_temp.",
        "Dereferencing next on a null pointer (AttributeError: 'NoneType' object has no attribute 'next').",
        "Infinite loops caused by cyclical references during improper concatenation."
      ],
      interviewTips: [
        "Always instantiate a dummy head (dummy = ListNode(0, head)) when returning a new or filtered list.",
        "To find the middle of a linked list, use fast and slow pointers. When fast reaches the end, slow is at the middle."
      ]
    },
    practiceProblems: [
      { name: "Reverse Linked List", platform: "LeetCode", url: "https://leetcode.com/problems/reverse-linked-list/", difficulty: "Easy" },
      { name: "Linked List Cycle (Floyd's Proof)", platform: "LeetCode", url: "https://leetcode.com/problems/linked-list-cycle/", difficulty: "Easy" },
      { name: "Merge Two Sorted Lists", platform: "LeetCode", url: "https://leetcode.com/problems/merge-two-sorted-lists/", difficulty: "Easy" },
      { name: "Detect and Remove Loop in Linked List", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/detect-and-remove-loop-in-a-linked-list/", difficulty: "Hard" }
    ],
    flashcard: {
      prompt: "How does Floyd's Tortoise and Hare algorithm detect loops in O(1) auxiliary space?",
      answer: "Slow pointer moves 1 step; fast moves 2 steps. If a loop exists, fast enters first and loops. The distance between fast and slow decreases by 1 on each step, guaranteeing collision in O(n) time without any hash set storage.",
      keyTakeaway: "Always use a dummy head node to eliminate boundary checks when modifying the head."
    }
  },
  {
    id: "recursion-mastery",
    topic: "Recursion",
    title: "Recursion & Backtracking: Call Stack Frames, Base Invariants & Pruning",
    badgeColor: "purple",
    difficulty: "Beginner",
    readingTime: "4 min read",
    summary: [
      "Functions that solve problems by invoking self-similar sub-instances with smaller inputs.",
      "Activation Records (Stack Frames): Operating system stack memory allocated per function invocation.",
      "Base Case Invariant: At least one non-recursive terminating condition must be reachable.",
      "Backtracking: Systematic depth-first tree search that prunes impossible paths and undoes state changes."
    ],
    keyFormula: "T(n) = aT(n/b) + f(n) (Master Theorem Recurrence)",
    diagramAscii: `[OS Execution Call Stack & Frame Unwinding]
Call Stack (Grows Downwards in RAM):
|---------------------------------------------|
| factorial(1): Base Case -> returns 1        | <-- Top of Stack (Evaluates First)
| factorial(2): waits for 2 * factorial(1)   |
| factorial(3): waits for 3 * factorial(2)   |
| factorial(4): waits for 4 * factorial(3)   | <-- Initial Call
|---------------------------------------------|
When factorial(1) hits base case, frames pop and unwind back to root!
Missing base case -> Call Stack Memory Overflows -> RecursionError!`,
    codeSnippet: {
      language: "python",
      code: `def subsets(nums: list[int]) -> list[list[int]]:
    """
    Backtracking Power Set (Grokking Algorithms Ch. 3 / GFG).
    Time Complexity: O(n * 2^n)
    Space Complexity: O(n) recursion call stack depth
    """
    result = []
    
    def backtrack(start_index: int, current_path: list[int]):
        # Add a shallow copy of the current combination
        result.append(list(current_path))
        
        for i in range(start_index, len(nums)):
            # 1. Choose candidate
            current_path.append(nums[i])
            # 2. Explore deeper branch
            backtrack(i + 1, current_path)
            # 3. Un-choose / Backtrack (undo state)
            current_path.pop()
            
    backtrack(0, [])
    return result`,
      explanation: "Generates all 2^n combinations by exploring choose-explore-unchoose decision trees."
    },
    complexity: {
      time: "O(2^n)",
      space: "O(n)",
      timeDetails: "Exponential branching factor; every element is either included or excluded.",
      spaceDetails: "Maximum depth of the recursion tree is n call-stack frames."
    },
    openSourceRef: {
      gfgTitle: "GeeksforGeeks: Introduction to Recursion & Backtracking",
      gfgUrl: "https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/",
      bookTitle: "Grokking Algorithms",
      bookAuthor: "Aditya Bhargava",
      bookChapter: "Chapter 3: Recursion & The Call Stack",
      keyQuote: "Recursion is when a function calls itself. Every recursive function has two parts: the base case (when the function stops calling itself) and the recursive case (when it calls itself). The call stack stores variables for each pending execution."
    },
    videoResource: {
      title: "What is Recursion? - Call Stacks and Base Cases Explained",
      channel: "Computerphile",
      duration: "9:44",
      youtubeUrl: "https://www.youtube.com/watch?v=Mv9NGuOPlE4",
      youtubeEmbedId: "Mv9NGuOPlE4",
      highlight: "Professor David Brailsford visualizes the stack pointer, activation records, and stack overflow traps."
    },
    deepDive: {
      intuition: "Recursion is mathematically equivalent to Mathematical Induction: prove the base case holds for n=0 or n=1, then show that if it holds for n-1, it holds for n. Your code handles the base case and trusts the recursive call to return the correct smaller solution.",
      realWorldAnalogy: "Russian nesting dolls (Matryoshka): to open the entire set, you open one doll to reveal a smaller identical doll inside, until you hit the tiny solid doll in the center (the base case).",
      definitions: [
        {
          term: "Call Stack Frame",
          explanation: "Memory containing a function's local variables, parameters, and return address on the OS stack."
        },
        {
          term: "Backtracking Pruning",
          explanation: "Checking constraints early to abandon entire branches of search space without exploring them."
        },
        {
          term: "Tail Call Optimization",
          explanation: "When the recursive call is the very last instruction, allowing smart compilers to reuse the current stack frame."
        }
      ],
      pitfalls: [
        "Failing to advance parameters toward the base case (e.g. calling f(n) instead of f(n-1)).",
        "Forgetting to backtrack state (e.g. omitting path.pop() in Python), corrupting subsequent branches.",
        "Python default recursion depth limit is 1000; deeply nested recursion will raise RecursionError."
      ],
      interviewTips: [
        "Remember the standard 3-step backtracking template: (1) Choose, (2) Explore, (3) Un-choose.",
        "Draw out the decision tree on the whiteboard for n=3 to demonstrate systematic branch traversal."
      ]
    },
    practiceProblems: [
      { name: "Subsets (Power Set)", platform: "LeetCode", url: "https://leetcode.com/problems/subsets/", difficulty: "Medium" },
      { name: "Combination Sum", platform: "LeetCode", url: "https://leetcode.com/problems/combination-sum/", difficulty: "Medium" },
      { name: "N-Queens Backtracking", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/n-queen-problem-backtracking-3/", difficulty: "Hard" },
      { name: "Generate Parentheses", platform: "LeetCode", url: "https://leetcode.com/problems/generate-parentheses/", difficulty: "Medium" }
    ],
    flashcard: {
      prompt: "What is the key difference between pure recursion and backtracking?",
      answer: "Recursion breaks a problem into smaller sub-instances. Backtracking systematically explores a decision tree by building candidates and actively ABANDONING (backtracking) and undoing state modifications as soon as constraints fail.",
      keyTakeaway: "Always undo state modifications (e.g. path.pop()) before returning to parent frames."
    }
  },
  {
    id: "memoization-mastery",
    topic: "Memoization",
    title: "Memoization & Caching: Pure Functions, State Hashing & @lru_cache",
    badgeColor: "emerald",
    difficulty: "Intermediate",
    readingTime: "4 min read",
    summary: [
      "Transforms expensive recursive functions into lightning-fast O(1) hash table lookups.",
      "Requires Referential Transparency: Functions must always return identical outputs for identical inputs.",
      "Python functools.@lru_cache provides production-grade, C-accelerated LRU cache eviction.",
      "State representation: Arguments must be immutable and hashable (integers, strings, tuples)."
    ],
    keyFormula: "T_memoized = unique_states × cost_per_state",
    diagramAscii: `[Memoization Lookup Architecture]
Function Invocation f(args)
             |
   +---------v---------+
   | Is f(args) in     |---- YES ----> Return cached value from O(1) Table
   | lookup table?     |
   +-------------------+
             |
            NO
             |
   Compute expensive calculation
             |
   Save result in cache[args]
             |
   Return newly computed value`,
    codeSnippet: {
      language: "python",
      code: `from functools import lru_cache

# Using Python's standard library C-accelerated LRU cache decorator
@lru_cache(maxsize=None)
def climb_stairs(n: int) -> int:
    """
    Memoized recursion (Fluent Python Ch. 7 / GFG).
    Time Complexity: O(n)
    Space Complexity: O(n) call stack + hash map
    """
    if n <= 2:
        return n
    return climb_stairs(n - 1) + climb_stairs(n - 2)

# Manual Dictionary Implementation (Interview Standard):
def climb_stairs_manual(n: int, memo: dict | None = None) -> int:
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 2:
        return n
    memo[n] = climb_stairs_manual(n - 1, memo) + climb_stairs_manual(n - 2, memo)
    return memo[n]`,
      explanation: "Converts naive O(2^n) exponential tree into linear O(n) evaluation."
    },
    complexity: {
      time: "O(n)",
      space: "O(n)",
      timeDetails: "Each subproblem from 1 to n is computed once; subsequent lookups take O(1).",
      spaceDetails: "Hash table stores n entries plus O(n) call stack frames."
    },
    openSourceRef: {
      gfgTitle: "GeeksforGeeks: Memoization 1D, 2D and 3D with Examples",
      gfgUrl: "https://www.geeksforgeeks.org/memoization-1d-2d-and-3d/",
      bookTitle: "Fluent Python",
      bookAuthor: "Luciano Ramalho",
      bookChapter: "Chapter 7: Function Decorators and Closures",
      keyQuote: "Memoization is an optimization technique that speeds up programs by saving the results of expensive function calls and returning the cached result when the same inputs occur again. functools.lru_cache implements a Least Recently Used eviction strategy."
    },
    videoResource: {
      title: "Python Tutorial: Decorators & Dynamic Memoization",
      channel: "Corey Schafer",
      duration: "29:15",
      youtubeUrl: "https://www.youtube.com/watch?v=FsAPt_9Bf3U",
      youtubeEmbedId: "FsAPt_9Bf3U",
      highlight: "In-depth masterclass on Python closures, decorator wrappers, and production-grade LRU caching."
    },
    deepDive: {
      intuition: "Memoization is the 'top-down' implementation of Dynamic Programming. Instead of planning the bottom-up table order beforehand, you write natural, clean recursion and simply attach a notebook (cache) to record results as you compute them.",
      realWorldAnalogy: "Browser caching: instead of downloading the same CSS and images from across the internet every time you reload, your browser saves them to disk and fetches them in 0 milliseconds.",
      definitions: [
        {
          term: "Referential Transparency",
          explanation: "An expression that can be replaced with its corresponding value without changing program behavior."
        },
        {
          term: "LRU (Least Recently Used)",
          explanation: "A cache eviction strategy that discards the least recently accessed items first when memory bounds are reached."
        },
        {
          term: "Hashable State Key",
          explanation: "In Python, arguments must implement __hash__ and be immutable (integers, strings, tuples, frozen sets)."
        }
      ],
      pitfalls: [
        "Passing unhashable types like lists or dicts to @lru_cache (TypeError: unhashable type: 'list').",
        "Memoizing functions that rely on mutable global state or random numbers.",
        "Default parameter trap: def f(n, memo={}) shares the dictionary across all invocations."
      ],
      interviewTips: [
        "Mention that you can convert mutable arguments to tuples (e.g. tuple(path)) to allow caching.",
        "Demonstrate awareness of memory constraints by discussing maxsize limits on @lru_cache."
      ]
    },
    practiceProblems: [
      { name: "House Robber", platform: "LeetCode", url: "https://leetcode.com/problems/house-robber/", difficulty: "Medium" },
      { name: "Unique Paths", platform: "LeetCode", url: "https://leetcode.com/problems/unique-paths/", difficulty: "Medium" },
      { name: "Word Break (Memoized DFS)", platform: "LeetCode", url: "https://leetcode.com/problems/word-break/", difficulty: "Medium" },
      { name: "Target Sum", platform: "LeetCode", url: "https://leetcode.com/problems/target-sum/", difficulty: "Medium" }
    ],
    flashcard: {
      prompt: "What prerequisite must a function satisfy to be safely memoized?",
      answer: "It must be a Pure Function with Referential Transparency: for identical inputs, it must always return the exact same output and have zero side effects (no file writes, no mutable global dependencies, no non-deterministic state).",
      keyTakeaway: "In Python, arguments used as cache keys must be immutable and hashable (e.g. tuples, not lists)."
    }
  },
  {
    id: "python-mastery",
    topic: "Python",
    title: "Python for Algorithms: Collections, Deque, Heapq & Time Complexities",
    badgeColor: "indigo",
    difficulty: "Beginner",
    readingTime: "3 min read",
    summary: [
      "CPython internal structures dictate algorithmic execution speed and asymptotic guarantees.",
      "list is an array of pointers: pop(0) takes O(n) time, whereas append/pop takes amortized O(1).",
      "collections.deque provides doubly-linked 64-element blocks for true O(1) head/tail operations.",
      "heapq provides min-heap priority queues; bisect provides logarithmic binary searching."
    ],
    keyFormula: "heapq.heappush(O(log n)), deque.popleft(O(1)), list.pop(0)(O(n))",
    diagramAscii: `[Python Collections Complexity Cheat Sheet]
Data Structure        Operation             Time Complexity
---------------------------------------------------------
list                  append(), pop()       O(1) amortized
list                  pop(0), insert(0, x)  O(n) [DRASTIC SLOWDOWN!]
collections.deque     append(), popleft()   O(1) guaranteed
dict / set            key in s, s[key]      O(1) average
heapq                 heappush(), heappop() O(log n)
bisect                bisect_left()         O(log n) binary search`,
    codeSnippet: {
      language: "python",
      code: `from collections import deque
import heapq

# 1. High-Performance Queue using deque (O(1) vs list O(n))
queue = deque([1, 2, 3])
queue.append(4)         # O(1) push right
first = queue.popleft() # O(1) pop left (DO NOT USE list.pop(0)!)

# 2. Min-Heap & Max-Heap Priority Queue
min_heap = [5, 1, 9, 3]
heapq.heapify(min_heap)       # In-place O(n) heapify
smallest = heapq.heappop(min_heap) # O(log n) returns 1

# Max-heap idiom in Python: invert sign of numbers
max_heap = [-x for x in [5, 1, 9, 3]]
heapq.heapify(max_heap)
largest = -heapq.heappop(max_heap) # Returns 9`,
      explanation: "Shows idiomatic, high-performance usage of standard library collections for algorithm coding."
    },
    complexity: {
      time: "O(1) to O(log n)",
      space: "O(n)",
      timeDetails: "deque gives O(1) push/pop; heapq gives O(log n) priority updates.",
      spaceDetails: "Compact C-level memory representations."
    },
    openSourceRef: {
      gfgTitle: "GeeksforGeeks: Python Data Structures & Algorithms Tutorial",
      gfgUrl: "https://www.geeksforgeeks.org/python-data-structures/",
      bookTitle: "Fluent Python",
      bookAuthor: "Luciano Ramalho",
      bookChapter: "Chapter 2: An Array of Sequences & Memory Complexities",
      keyQuote: "Understanding internal CPython representations is crucial: list is an array of pointers (pop(0) is O(n), append is amortized O(1)). collections.deque is a doubly-linked list of 64-element blocks offering strict O(1) head and tail operations."
    },
    videoResource: {
      title: "Data Structures and Algorithms in Python - Full Course",
      channel: "freeCodeCamp.org",
      duration: "12:34:00",
      youtubeUrl: "https://www.youtube.com/watch?v=pkYVOmU3MgA",
      youtubeEmbedId: "pkYVOmU3MgA",
      highlight: "University-level algorithms course in Python covering memory addresses, hash tables, heaps, and tree structures."
    },
    deepDive: {
      intuition: "In Python, writing code that looks clean is not enough; interviewers test your awareness of CPython internals. Knowing why list.pop(0) degrades an algorithm from O(n) to O(n²) separates junior scripts from senior software engineers.",
      realWorldAnalogy: "A list is a row of contiguous lockers. If locker #0 is emptied and everyone is forced to shift one locker to the left, all 1,000 people must move. A deque is two open ends of a pipe where people enter and exit freely without disturbing others.",
      definitions: [
        {
          term: "Dynamic Array Pointer Table",
          explanation: "CPython lists store an array of 8-byte pointers to Python objects, not the raw objects themselves."
        },
        {
          term: "Min-Heap Invariant",
          explanation: "For every index i, heap[i] <= heap[2*i + 1] and heap[i] <= heap[2*i + 2]."
        },
        {
          term: "Slicing Memory Footprint",
          explanation: "arr[a:b] allocates and copies a brand-new sub-array in O(b-a) time and space."
        }
      ],
      pitfalls: [
        "Using list.pop(0) inside a BFS while-loop, silently turning an O(V+E) algorithm into O(V²).",
        "Using shallow copies (arr.copy() or arr[:]) when modifying nested structures.",
        "Assuming dict iteration order was always guaranteed (it is preserved in Python 3.7+ based on insertion order)."
      ],
      interviewTips: [
        "Always import and use collections.deque for BFS or queues.",
        "Demonstrate mastery of heapq for 'Top K Frequent' and streaming median questions."
      ]
    },
    practiceProblems: [
      { name: "Top K Frequent Elements (Heapq)", platform: "LeetCode", url: "https://leetcode.com/problems/top-k-frequent-elements/", difficulty: "Medium" },
      { name: "Implement Queue using Stacks", platform: "LeetCode", url: "https://leetcode.com/problems/implement-queue-using-stacks/", difficulty: "Easy" },
      { name: "Find Median from Data Stream", platform: "LeetCode", url: "https://leetcode.com/problems/find-median-from-data-stream/", difficulty: "Hard" },
      { name: "Binary Search (bisect)", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/binary-search/", difficulty: "Easy" }
    ],
    flashcard: {
      prompt: "Why is 'list.pop(0)' an interview anti-pattern in Python, and what should be used instead?",
      answer: "Python lists are contiguous arrays of pointers. Popping index 0 forces CPython to shift all remaining n-1 elements left in memory, taking linear O(n) time. Instead, use 'collections.deque' which supports O(1) popleft().",
      keyTakeaway: "To simulate a max-heap in Python's heapq, push negative numbers: -val."
    }
  }
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
  const [viewMode, setViewMode] = useState<"grid" | "flashcards">("grid");
  const [bookmarks, setBookmarks] = useState<string[]>(["dp-mastery", "trees-mastery"]);
  const [activeNote, setActiveNote] = useState<StudyNote | null>(null);
  const [modalTab, setModalTab] = useState<"theory" | "code" | "video" | "practice">("theory");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

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

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
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
        note.openSourceRef.bookTitle.toLowerCase().includes(query) ||
        note.openSourceRef.gfgTitle.toLowerCase().includes(query) ||
        note.videoResource.title.toLowerCase().includes(query) ||
        note.videoResource.channel.toLowerCase().includes(query) ||
        note.summary.some((s) => s.toLowerCase().includes(query)) ||
        note.codeSnippet.code.toLowerCase().includes(query) ||
        note.deepDive.definitions.some((d) => d.term.toLowerCase().includes(query));

      return matchesTopic && matchesBookmark && matchesSearch;
    });
  }, [search, selectedTopic, bookmarkedOnly, bookmarks]);

  const openStudyModal = (note: StudyNote, tab: "theory" | "code" | "video" | "practice" = "theory") => {
    setActiveNote(note);
    setModalTab(tab);
  };

  return (
    <div className="notes-hub-container space-y-6">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#172321] via-[#10302b] to-[#0d211e] rounded-3xl p-6 md:p-8 text-white shadow-xl border border-[#c8f169]/20">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f7770]/40 border border-[#c8f169]/30 text-[#c8f169] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              Open Source & Canonical Textbook Knowledge Base
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Notes &amp; Study Hub
            </h1>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Curated from <strong className="text-[#c8f169]">GeeksforGeeks</strong>,{" "}
              <strong className="text-[#c8f169]">CLRS</strong>, and{" "}
              <strong className="text-[#c8f169]">Grokking Algorithms</strong> with YouTube masterclasses and 
              real-time synchronization with your <span className="underline decoration-[#c8f169] decoration-2">Learning Digital Twin</span>.
            </p>

            {/* Micro Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-300">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#c8f169]" />
                <strong>7</strong> Comprehensive Modules
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1.5">
                <Youtube size={14} className="text-rose-400" />
                <strong>7</strong> Video Lectures
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap size={14} className="text-amber-300" />
                CLRS &amp; GFG Canonical References
              </span>
            </div>
          </div>

          {/* Action & View Mode Toggles */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 self-start lg:self-center">
            {/* View Mode Toggle */}
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl flex items-center border border-white/10 text-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  viewMode === "grid"
                    ? "bg-[#0f7770] text-white shadow-sm"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Layers size={13} /> Grid Guides
              </button>
              <button
                onClick={() => setViewMode("flashcards")}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  viewMode === "flashcards"
                    ? "bg-[#0f7770] text-white shadow-sm"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Zap size={13} /> Flashcards Mode
              </button>
            </div>

            {/* Bookmark Filter */}
            <button
              type="button"
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                bookmarkedOnly
                  ? "bg-[#c8f169] text-[#172321] border-[#c8f169]"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <Bookmark size={14} className={bookmarkedOnly ? "fill-[#172321]" : ""} />
              Bookmarked ({bookmarks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Top Filter & Search Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-gray-200/90 shadow-sm space-y-3">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by topic, concept, CLRS book chapter, GFG keywords, code, or video (e.g. 'CLRS', 'memoization', 'NeetCode')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50/90 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0f7770] focus:ring-2 focus:ring-[#0f7770]/10 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-bold"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Topic Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
            <Filter size={12} /> Topics:
          </span>
          {TOPIC_FILTERS.map((t) => {
            const isActive = selectedTopic.toLowerCase() === t.toLowerCase();
            return (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1 rounded-full text-xs transition font-medium ${
                  isActive
                    ? "bg-[#0f7770] text-white font-bold shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: GRID GUIDES */}
      {viewMode === "grid" && (
        <>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredNotes.map((note) => {
                const mastery = getTopicMastery(note.topic);
                const isBookmarked = bookmarks.includes(note.id);
                const isWeak = mastery < 55;

                return (
                  <div
                    key={note.id}
                    onClick={() => openStudyModal(note, "theory")}
                    className="group bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm hover:shadow-xl hover:border-[#0f7770]/50 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Card Top Pill Row */}
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
                            Twin {mastery}%
                          </span>
                        </div>

                        <button
                          type="button"
                          title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                          onClick={(e) => toggleBookmark(note.id, e)}
                          className={`p-1.5 rounded-lg border text-gray-400 hover:text-gray-800 transition ${
                            isBookmarked
                              ? "bg-amber-50 border-amber-200 text-amber-600"
                              : "bg-gray-50 border-gray-100"
                          }`}
                        >
                          <Bookmark size={13} className={isBookmarked ? "fill-amber-500" : ""} />
                        </button>
                      </div>

                      {/* Reference Badge Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] text-gray-500">
                        <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 font-medium">
                          <BookOpen size={10} className="text-[#0f7770]" />
                          {note.openSourceRef.bookTitle.split(" ")[0]} {note.openSourceRef.bookChapter.split(":")[0]}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-100 font-medium">
                          <Youtube size={10} />
                          {note.videoResource.channel} ({note.videoResource.duration})
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#0f7770] transition-colors mb-3">
                        {note.title}
                      </h2>

                      {/* Bullet Highlights */}
                      <ul className="space-y-1.5 mb-4">
                        {note.summary.slice(0, 3).map((bullet, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-2 leading-relaxed">
                            <CheckCircle2 size={13} className="text-[#0f7770] flex-shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Mini ASCII Diagram Preview */}
                      {note.diagramAscii && (
                        <div className="bg-[#172321] text-[#c8f169] rounded-xl p-3 font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre my-3 shadow-inner">
                          {note.diagramAscii.split("\n").slice(0, 5).join("\n")}
                          {note.diagramAscii.split("\n").length > 5 && "\n..."}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1 text-[11px]">
                          ⏱ {note.readingTime} · {note.difficulty}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-gray-700">
                          {note.complexity.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openStudyModal(note, "video");
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Play size={12} className="fill-rose-700" /> Watch Video
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openStudyModal(note, "theory");
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#0f7770] hover:bg-[#0b5c56] text-white text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          Study Guide <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW MODE 2: FLASHCARD REVISION MODE */}
      {viewMode === "flashcards" && (
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-amber-600" />
              <span>
                <strong>Quick Revision Mode:</strong> Click any card to flip between the high-yield interview prompt and core invariant!
              </span>
            </div>
            <span className="font-bold">{filteredNotes.length} flashcards ready</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              const isFlipped = flippedCards[note.id];
              return (
                <div
                  key={note.id}
                  onClick={() => toggleCardFlip(note.id)}
                  className="perspective-1000 min-h-[300px] cursor-pointer"
                >
                  <div
                    className={`flashcard-inner relative w-full h-full min-h-[300px] rounded-3xl p-6 shadow-md transition-all duration-500 border ${
                      isFlipped
                        ? "bg-[#172321] text-white border-[#c8f169]/40"
                        : "bg-white text-gray-900 border-gray-200 hover:border-[#0f7770]/50"
                    }`}
                  >
                    {!isFlipped ? (
                      /* Flashcard Front */
                      <div className="flex flex-col justify-between h-full space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0f7770]/10 text-[#0f7770]">
                              {note.topic}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              Flashcard • Front
                            </span>
                          </div>
                          <span className="text-xs font-bold text-gray-400 uppercase">Interview Challenge:</span>
                          <h3 className="text-base font-bold text-gray-900 mt-2 leading-relaxed">
                            {note.flashcard.prompt}
                          </h3>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                          <span className="text-[#0f7770] font-bold flex items-center gap-1">
                            <RotateCcw size={12} /> Click to Reveal Answer
                          </span>
                          <span className="font-mono">{note.complexity.time}</span>
                        </div>
                      </div>
                    ) : (
                      /* Flashcard Back */
                      <div className="flex flex-col justify-between h-full space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c8f169] text-[#172321]">
                              Core Takeaway
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              Flashcard • Back
                            </span>
                          </div>
                          <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line mt-2">
                            {note.flashcard.answer}
                          </p>
                          <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] text-[#c8f169]">
                            <strong>Rule of Thumb:</strong> {note.flashcard.keyTakeaway}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                            <RotateCcw size={11} /> Flip Back
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openStudyModal(note, "theory");
                            }}
                            className="text-[#c8f169] font-bold hover:underline text-xs"
                          >
                            Full Guide →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAIL STUDY MODAL / DRAWER */}
      {activeNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveNote(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 pb-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white sticky top-0 z-20 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0f7770]/10 text-[#0f7770]">
                      {activeNote.topic}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                      {activeNote.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">• {activeNote.readingTime}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Twin Mastery {getTopicMastery(activeNote.topic)}%
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                    {activeNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(activeNote.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition ${
                      bookmarks.includes(activeNote.id)
                        ? "bg-amber-50 border-amber-200 text-amber-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
                    }`}
                    title="Bookmark Note"
                  >
                    <Bookmark size={15} className={bookmarks.includes(activeNote.id) ? "fill-amber-500" : ""} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNote(null)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                    title="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs Inside Modal */}
              <div className="flex items-center gap-2 mt-5 border-b border-gray-200 overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => setModalTab("theory")}
                  className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                    modalTab === "theory"
                      ? "border-[#0f7770] text-[#0f7770]"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <BookOpen size={14} /> Theory &amp; Books
                </button>
                <button
                  onClick={() => setModalTab("code")}
                  className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                    modalTab === "code"
                      ? "border-[#0f7770] text-[#0f7770]"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Code2 size={14} /> Python Code &amp; Complexity
                </button>
                <button
                  onClick={() => setModalTab("video")}
                  className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                    modalTab === "video"
                      ? "border-rose-500 text-rose-600"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Youtube size={14} className="text-rose-500" /> Video Lecture
                </button>
                <button
                  onClick={() => setModalTab("practice")}
                  className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                    modalTab === "practice"
                      ? "border-emerald-600 text-emerald-700"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Zap size={14} className="text-amber-500" /> Practice &amp; Pitfalls
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 md:p-8 space-y-6 flex-1">
              {/* TAB 1: THEORY & BOOKS */}
              {modalTab === "theory" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Real World Analogy Callout */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                      💡 Intuitive Analogy
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed">
                      {activeNote.deepDive.realWorldAnalogy}
                    </p>
                  </div>

                  {/* Core Intuition */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Conceptual Deep Dive
                    </h4>
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                      {activeNote.deepDive.intuition}
                    </p>
                  </div>

                  {/* Canonical Textbook Quote Box (CLRS) */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-[#172321] text-white space-y-3 shadow-md border border-gray-800">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1.5 font-bold text-[#c8f169]">
                        <BookOpen size={14} /> Textbook Foundation
                      </span>
                      <span className="font-mono text-[11px] text-gray-300">
                        {activeNote.openSourceRef.bookTitle} · {activeNote.openSourceRef.bookChapter}
                      </span>
                    </div>
                    <blockquote className="italic text-xs md:text-sm text-gray-200 leading-relaxed border-l-2 border-[#c8f169] pl-3 my-2">
                      &quot;{activeNote.openSourceRef.keyQuote}&quot;
                    </blockquote>
                    <div className="text-[11px] text-gray-400">
                      — {activeNote.openSourceRef.bookAuthor}
                    </div>
                  </div>

                  {/* GeeksforGeeks Citation Card */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                        GeeksforGeeks Canonical Article
                      </span>
                      <div className="text-xs font-bold text-emerald-950">
                        {activeNote.openSourceRef.gfgTitle}
                      </div>
                    </div>
                    <a
                      href={activeNote.openSourceRef.gfgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-[#0f7770] hover:bg-[#09544f] text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      Read on GFG <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Core Definitions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Key Formal Definitions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeNote.deepDive.definitions.map((def, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                          <div className="text-xs font-bold text-gray-900">{def.term}</div>
                          <div className="text-xs text-gray-600 leading-relaxed">{def.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PYTHON CODE & COMPLEXITY */}
              {modalTab === "code" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Code Container */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Python 3 Canonical Implementation
                      </h4>
                      <button
                        onClick={(e) => copyCode(activeNote.codeSnippet.code, activeNote.id, e)}
                        className="text-xs font-bold text-[#0f7770] hover:text-[#0b5c56] flex items-center gap-1 transition"
                      >
                        {copiedCodeId === activeNote.id ? (
                          <>
                            <Check size={13} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={13} /> Copy Code
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative group bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs text-gray-400 font-mono">
                        <span>solution.py</span>
                        <span className="text-emerald-400 font-bold">Python 3</span>
                      </div>
                      <pre className="p-5 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre">
                        {activeNote.codeSnippet.code}
                      </pre>
                    </div>
                    <p className="text-xs text-gray-500 italic mt-1">
                      {activeNote.codeSnippet.explanation}
                    </p>
                  </div>

                  {/* Complexity Metric Cards */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Asymptotic Complexity Analysis
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Time Complexity
                        </div>
                        <div className="text-xl font-black font-mono text-gray-900">
                          {activeNote.complexity.time}
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {activeNote.complexity.timeDetails}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Space Complexity
                        </div>
                        <div className="text-xl font-black font-mono text-gray-900">
                          {activeNote.complexity.space}
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {activeNote.complexity.spaceDetails}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Architecture Diagram */}
                  {activeNote.diagramAscii && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Memory &amp; Pointer Architecture
                      </h4>
                      <div className="bg-[#172321] text-[#c8f169] rounded-2xl p-4 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                        {activeNote.diagramAscii}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: VIDEO LECTURE */}
              {modalTab === "video" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* YouTube Player */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                          <Youtube size={13} /> Recommended Masterclass
                        </span>
                        <h3 className="text-base font-bold text-gray-900">
                          {activeNote.videoResource.title}
                        </h3>
                      </div>
                      <a
                        href={activeNote.videoResource.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0"
                      >
                        Watch on YouTube <ExternalLink size={12} />
                      </a>
                    </div>

                    {/* Responsive Video Iframe Container */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${activeNote.videoResource.youtubeEmbedId}`}
                        title={activeNote.videoResource.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>

                    {/* Video Metadata Card */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs text-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">
                          Instructor: {activeNote.videoResource.channel}
                        </span>
                        <span>•</span>
                        <span>Duration: {activeNote.videoResource.duration}</span>
                      </div>
                      <span className="text-[#0f7770] font-bold">Curated for Digital Twin</span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      💡 <strong>What you will master:</strong> {activeNote.videoResource.highlight}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: PRACTICE & PITFALLS */}
              {modalTab === "practice" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Curated Practice Problems */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Standard GeeksforGeeks &amp; LeetCode Practice
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeNote.practiceProblems.map((prob, idx) => (
                        <a
                          key={idx}
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-[#0f7770] hover:shadow-md transition flex items-center justify-between group"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {prob.platform}
                            </span>
                            <div className="text-xs font-bold text-gray-900 group-hover:text-[#0f7770] transition">
                              {prob.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                prob.difficulty === "Easy"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : prob.difficulty === "Medium"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {prob.difficulty}
                            </span>
                            <ExternalLink size={12} className="text-gray-400 group-hover:text-[#0f7770]" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Common Pitfalls Callouts */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500">
                      Common Interview Pitfalls &amp; Gotchas
                    </h4>
                    <div className="space-y-2">
                      {activeNote.deepDive.pitfalls.map((pitfall, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs text-rose-950 flex items-start gap-2.5"
                        >
                          <span className="text-rose-500 font-bold mt-0.5">⚠️</span>
                          <span className="leading-relaxed">{pitfall}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Pro Tips */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Interview Pro Tips
                    </h4>
                    <div className="space-y-2">
                      {activeNote.deepDive.interviewTips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2.5"
                        >
                          <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                          <span className="leading-relaxed">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-6 border-t border-gray-200 bg-gray-50/80 rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onAskAi(`Explain ${activeNote.topic} from the perspective of an expert software engineer. Discuss key interview patterns, edge cases, and time/space complexity.`);
                    setActiveNote(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle size={14} className="text-[#0f7770]" />
                  Ask AI Tutor about this Note
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  title="Print / Save as PDF"
                >
                  <Printer size={14} />
                  Print / PDF
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenQuiz(activeNote.topic);
                  setActiveNote(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#172321] hover:bg-black text-[#c8f169] text-xs font-bold transition flex items-center gap-2 shadow-md"
              >
                <Zap size={14} />
                Practice {activeNote.topic} Quiz Questions →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
