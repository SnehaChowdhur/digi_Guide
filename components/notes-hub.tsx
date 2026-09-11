"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Filter,
  GraduationCap,
  Layers,
  MessageCircle,
  Play,
  Printer,
  RotateCcw,
  Search,
  Sparkles,
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
      "Solves complex optimization problems by decomposing into overlapping subproblems.",
      "Memoization (Top-Down): Caches evaluation results in a dictionary or array.",
      "Tabulation (Bottom-Up): Evaluates dependencies iteratively starting from base cases.",
      "Space Optimization: Condenses DP arrays to O(1) memory when transitions depend on preceding k states."
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
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins needed for amount 0

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
      spaceDetails: "Linear in state space, often compressible to O(1) using rolling variables."
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
      title: "Dynamic Programming - Learn to Solve Algorithmic Problems",
      channel: "freeCodeCamp.org",
      duration: "5:10:00",
      youtubeUrl: "https://www.youtube.com/watch?v=oBt53YbR9Kk",
      youtubeEmbedId: "oBt53YbR9Kk",
      highlight: "Universal masterclass covering memoization recipes, tabulation formulas, grid traveler, and knapsack."
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
    
    if not (low < root.val < high):
        return False
    
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
      title: "Data Structures: Trees & Binary Search Trees",
      channel: "HackerRank (Gayle McDowell)",
      duration: "10:13",
      youtubeUrl: "https://www.youtube.com/watch?v=oSWTXtMglKE",
      youtubeEmbedId: "oSWTXtMglKE",
      highlight: "Gayle Laakmann McDowell (Author of Cracking the Coding Interview) breaks down BST properties and recursive traversal."
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
      title: "Visual Introduction to Two Pointer Algorithm",
      channel: "Josh's DevBox",
      duration: "8:56",
      youtubeUrl: "https://www.youtube.com/watch?v=On03HWe2tZM",
      youtubeEmbedId: "On03HWe2tZM",
      highlight: "Visual animation of pointer movements and sliding window transitions for interview problems."
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
Slow advances 1 step. Fast advances 2 steps. Guaranteed collision in loop!`,
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
        
    return prev`,
      explanation: "Maintains prev and next_temp pointers to invert direction in-place without memory allocation."
    },
    complexity: {
      time: "O(n)",
      space: "O(1)",
      timeDetails: "Single traversal visiting each node exactly once.",
      spaceDetails: "Strictly in-place pointer manipulation; zero new heap allocations."
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
      title: "Introduction to Linked Lists & Pointers",
      channel: "CS Dojo",
      duration: "13:48",
      youtubeUrl: "https://www.youtube.com/watch?v=WwfhLC16bis",
      youtubeEmbedId: "WwfhLC16bis",
      highlight: "Clear, visual explanation of node pointers, memory differences from arrays, and traversal methods."
    },
    deepDive: {
      intuition: "Unlike arrays which require contiguous pre-allocated memory slabs, linked lists grow organically one node at a time wherever RAM has free space. Pointers tie the sequence together. The trade-off is losing instant O(1) index access in exchange for instant O(1) head insertion/deletion.",
      realWorldAnalogy: "A scavenger hunt: the first clue tells you where to find the second clue, which tells you where to find the third. You cannot jump directly to clue #5 without following the chain.",
      definitions: [
        {
          term: "Floyd's Tortoise & Hare",
          explanation: "Cycle detection algorithm using two pointers at speeds 1 and 2. Fast enters the loop first; every iteration reduces gap by 1 until collision."
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
        result.append(list(current_path))
        
        for i in range(start_index, len(nums)):
            current_path.append(nums[i])      # 1. Choose
            backtrack(i + 1, current_path)   # 2. Explore
            current_path.pop()               # 3. Un-choose
            
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
      title: "5 Simple Steps for Solving Any Recursive Problem",
      channel: "Reducible",
      duration: "15:42",
      youtubeUrl: "https://www.youtube.com/watch?v=ngCos392W4w",
      youtubeEmbedId: "ngCos392W4w",
      highlight: "Visual breakdown of building intuition, spotting subproblems, and constructing base cases cleanly."
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

# Manual Dictionary Implementation:
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
      highlight: "Comprehensive algorithms course in Python covering memory addresses, hash tables, heaps, and tree structures."
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

  const getTopicMastery = (topicName: string): number => {
    const match = topics.find((t) => t.topic.toLowerCase() === topicName.toLowerCase());
    return match ? Math.round(match.mastery) : 65;
  };

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
    <div className="notes-hub-container">
      {/* Top Hero Banner */}
      <div className="notes-hero">
        <div className="notes-hero-content">
          <div style={{ maxWidth: "620px" }}>
            <div className="notes-hero-kicker">
              <Sparkles size={13} />
              Open Source &amp; Canonical Textbook Knowledge Base
            </div>
            <h1>Notes &amp; Study Hub</h1>
            <p>
              Curated from <strong style={{ color: "var(--mint)" }}>GeeksforGeeks</strong>,{" "}
              <strong style={{ color: "var(--mint)" }}>CLRS</strong>, and{" "}
              <strong style={{ color: "var(--mint)" }}>Grokking Algorithms</strong> with YouTube masterclasses and 
              real-time synchronization with your Learning Digital Twin.
            </p>

            <div className="notes-hero-stats">
              <span className="notes-hero-stat-item">
                <BookOpen size={14} color="var(--mint)" />
                <strong>7</strong> Comprehensive Modules
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span className="notes-hero-stat-item">
                <Youtube size={14} color="#ff6b6b" />
                <strong>7</strong> Verified YouTube Lectures
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span className="notes-hero-stat-item">
                <GraduationCap size={14} color="#ffd43b" />
                CLRS &amp; GFG Citations
              </span>
            </div>
          </div>

          <div className="notes-hero-actions">
            <div className="notes-view-mode-wrap">
              <button
                onClick={() => setViewMode("grid")}
                className={`notes-mode-btn ${viewMode === "grid" ? "active" : ""}`}
              >
                <Layers size={13} /> Grid Guides
              </button>
              <button
                onClick={() => setViewMode("flashcards")}
                className={`notes-mode-btn ${viewMode === "flashcards" ? "active" : ""}`}
              >
                <Zap size={13} /> Flashcards Mode
              </button>
            </div>

            <button
              type="button"
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              className={`notes-bookmark-filter-btn ${bookmarkedOnly ? "active" : ""}`}
            >
              <Bookmark size={14} className={bookmarkedOnly ? "fill-ink" : ""} />
              Bookmarked ({bookmarks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Top Filter & Search Bar */}
      <div className="notes-filter-bar">
        <div className="notes-search-wrapper">
          <Search size={16} className="notes-search-icon" />
          <input
            type="text"
            placeholder="Search by topic, concept, CLRS book chapter, GFG keywords, code, or video (e.g. 'CLRS', 'memoization', 'NeetCode')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="notes-search-clear">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="notes-chips-wrapper">
          <span className="notes-chips-label">
            <Filter size={12} /> Topics:
          </span>
          {TOPIC_FILTERS.map((t) => {
            const isActive = selectedTopic.toLowerCase() === t.toLowerCase();
            return (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`notes-chip ${isActive ? "active" : ""}`}
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
            <div className="panel" style={{ textAlign: "center", padding: "48px 24px" }}>
              <BookOpen size={36} color="var(--muted)" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "6px" }}>No study notes found</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", maxWidth: "380px", margin: "0 auto 16px" }}>
                Try loosening your search query or selecting &quot;All&quot; topics to view all available notes.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedTopic("All");
                  setBookmarkedOnly(false);
                }}
                className="cta"
                style={{ display: "inline-flex", margin: "0 auto" }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="notes-cards-grid">
              {filteredNotes.map((note) => {
                const mastery = getTopicMastery(note.topic);
                const isBookmarked = bookmarks.includes(note.id);
                const isWeak = mastery < 55;

                return (
                  <div
                    key={note.id}
                    onClick={() => openStudyModal(note, "theory")}
                    className="note-card"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="note-card-badges">
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                          <span className="note-tag note-tag-topic">{note.topic}</span>
                          <span className={`note-tag note-tag-mastery ${isWeak ? "weak" : mastery >= 80 ? "" : "mid"}`}>
                            Twin {mastery}%
                          </span>
                        </div>

                        <button
                          type="button"
                          title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                          onClick={(e) => toggleBookmark(note.id, e)}
                          className={`note-bookmark-btn ${isBookmarked ? "saved" : ""}`}
                        >
                          <Bookmark size={13} className={isBookmarked ? "fill-amber" : ""} />
                        </button>
                      </div>

                      {/* Reference Badge Row */}
                      <div className="note-meta-badges">
                        <span className="note-ref-pill">
                          <BookOpen size={10} color="var(--teal)" />
                          {note.openSourceRef.bookTitle.split(" ")[0]} {note.openSourceRef.bookChapter.split(":")[0]}
                        </span>
                        <span className="note-video-pill">
                          <Youtube size={10} />
                          {note.videoResource.channel} ({note.videoResource.duration})
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="note-card-title">{note.title}</h3>

                      {/* Bullet Highlights */}
                      <ul className="note-bullets-list">
                        {note.summary.slice(0, 3).map((bullet, i) => (
                          <li key={i} className="note-bullet-item">
                            <CheckCircle2 size={13} className="note-bullet-icon" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Diagram Preview */}
                      {note.diagramAscii && (
                        <div className="note-diagram-preview">
                          {note.diagramAscii.split("\n").slice(0, 4).join("\n")}
                          {note.diagramAscii.split("\n").length > 4 && "\n..."}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="note-card-footer">
                      <div className="note-card-info-row">
                        <span>⏱ {note.readingTime} · {note.difficulty}</span>
                        <span className="note-complexity-badge">{note.complexity.time}</span>
                      </div>

                      <div className="note-card-actions">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openStudyModal(note, "video");
                          }}
                          className="note-action-btn secondary"
                        >
                          <Play size={12} fill="currentColor" /> Watch Video
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openStudyModal(note, "theory");
                          }}
                          className="note-action-btn primary"
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
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="notes-analogy-box" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Zap size={16} color="#d48806" />
              <span>
                <strong>Quick Revision Mode:</strong> Click any card to flip between the high-yield interview challenge and core invariant!
              </span>
            </div>
            <strong>{filteredNotes.length} flashcards ready</strong>
          </div>

          <div className="flashcard-grid">
            {filteredNotes.map((note) => {
              const isFlipped = flippedCards[note.id];
              return (
                <div
                  key={note.id}
                  onClick={() => toggleCardFlip(note.id)}
                  className="flashcard-wrap"
                >
                  <div className={`flashcard-card ${isFlipped ? "flipped" : ""}`}>
                    {!isFlipped ? (
                      /* Front */
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <span className="note-tag note-tag-topic">{note.topic}</span>
                            <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>
                              Flashcard • Front
                            </span>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
                            Interview Challenge:
                          </span>
                          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", marginTop: "8px", lineHeight: 1.45 }}>
                            {note.flashcard.prompt}
                          </h3>
                        </div>

                        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                          <span style={{ color: "var(--teal)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <RotateCcw size={12} /> Click to Reveal Answer
                          </span>
                          <span style={{ fontFamily: "monospace", color: "var(--muted)" }}>{note.complexity.time}</span>
                        </div>
                      </div>
                    ) : (
                      /* Back */
                      <div className="flashcard-flipped-inner">
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ background: "var(--mint)", color: "var(--ink)", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700 }}>
                              Core Takeaway
                            </span>
                            <span style={{ fontSize: "10px", color: "#8fa199", fontWeight: 700, textTransform: "uppercase" }}>
                              Flashcard • Back
                            </span>
                          </div>
                          <p style={{ fontSize: "12px", color: "#e4eee9", lineHeight: 1.6, whiteSpace: "pre-line", margin: 0 }}>
                            {note.flashcard.answer}
                          </p>
                          <div style={{ marginTop: "12px", padding: "10px 12px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "11px", color: "var(--mint)" }}>
                            <strong>Rule of Thumb:</strong> {note.flashcard.keyTakeaway}
                          </div>
                        </div>

                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                          <span style={{ color: "#8fa199", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                            <RotateCcw size={11} /> Flip Back
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openStudyModal(note, "theory");
                            }}
                            style={{ border: 0, background: "transparent", color: "var(--mint)", fontWeight: 700, cursor: "pointer", fontSize: "12px" }}
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
        <div className="notes-modal-backdrop" onClick={() => setActiveNote(null)}>
          <div className="notes-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="notes-modal-header">
              <div className="notes-modal-header-top">
                <div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "6px" }}>
                    <span className="note-tag note-tag-topic">{activeNote.topic}</span>
                    <span style={{ background: "#edf3ee", color: "var(--ink)", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 700 }}>
                      {activeNote.difficulty}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>• {activeNote.readingTime}</span>
                    <span className="note-tag note-tag-mastery">
                      Twin Mastery {getTopicMastery(activeNote.topic)}%
                    </span>
                  </div>
                  <h2 className="notes-modal-title">{activeNote.title}</h2>
                </div>

                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(activeNote.id)}
                    className={`note-bookmark-btn ${bookmarks.includes(activeNote.id) ? "saved" : ""}`}
                    title="Bookmark Note"
                  >
                    <Bookmark size={15} className={bookmarks.includes(activeNote.id) ? "fill-amber" : ""} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNote(null)}
                    className="note-bookmark-btn"
                    title="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="notes-modal-tabs">
                <button
                  onClick={() => setModalTab("theory")}
                  className={`notes-tab-btn ${modalTab === "theory" ? "active" : ""}`}
                >
                  <BookOpen size={14} /> Theory &amp; Books
                </button>
                <button
                  onClick={() => setModalTab("code")}
                  className={`notes-tab-btn ${modalTab === "code" ? "active" : ""}`}
                >
                  <Code2 size={14} /> Python Code &amp; Complexity
                </button>
                <button
                  onClick={() => setModalTab("video")}
                  className={`notes-tab-btn video ${modalTab === "video" ? "active" : ""}`}
                >
                  <Youtube size={14} color="#e03131" /> Video Lecture
                </button>
                <button
                  onClick={() => setModalTab("practice")}
                  className={`notes-tab-btn ${modalTab === "practice" ? "active" : ""}`}
                >
                  <Zap size={14} color="#d48806" /> Practice &amp; Pitfalls
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="notes-modal-body">
              {/* TAB 1: THEORY */}
              {modalTab === "theory" && (
                <>
                  <div className="notes-analogy-box">
                    <strong>💡 Intuitive Analogy:</strong> {activeNote.deepDive.realWorldAnalogy}
                  </div>

                  <div>
                    <div className="kicker" style={{ marginBottom: "6px" }}>Conceptual Deep Dive</div>
                    <p style={{ fontSize: "13px", color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
                      {activeNote.deepDive.intuition}
                    </p>
                  </div>

                  {/* Textbook Quote */}
                  <div className="notes-quote-box">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                      <span style={{ color: "var(--mint)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <BookOpen size={14} /> Canonical Textbook Foundation
                      </span>
                      <span style={{ color: "#a9bcb3", fontFamily: "monospace", fontSize: "11px" }}>
                        {activeNote.openSourceRef.bookTitle} · {activeNote.openSourceRef.bookChapter}
                      </span>
                    </div>
                    <blockquote>
                      &quot;{activeNote.openSourceRef.keyQuote}&quot;
                    </blockquote>
                    <div style={{ fontSize: "11px", color: "#a9bcb3" }}>
                      — {activeNote.openSourceRef.bookAuthor}
                    </div>
                  </div>

                  {/* GeeksforGeeks Citation */}
                  <div className="notes-gfg-box">
                    <div>
                      <span style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: 700, color: "#1e7e34" }}>
                        GeeksforGeeks Canonical Article
                      </span>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#145223" }}>
                        {activeNote.openSourceRef.gfgTitle}
                      </div>
                    </div>
                    <a
                      href={activeNote.openSourceRef.gfgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta"
                      style={{ padding: "7px 14px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      Read on GFG <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Definitions */}
                  <div>
                    <div className="kicker" style={{ marginBottom: "10px" }}>Key Formal Definitions</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
                      {activeNote.deepDive.definitions.map((def, idx) => (
                        <div key={idx} style={{ background: "#f8faf7", border: "1px solid var(--line)", borderRadius: "12px", padding: "12px 14px" }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>{def.term}</div>
                          <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>{def.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: CODE */}
              {modalTab === "code" && (
                <>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className="kicker">Python 3 Canonical Implementation</span>
                      <button
                        onClick={(e) => copyCode(activeNote.codeSnippet.code, activeNote.id, e)}
                        style={{ border: 0, background: "transparent", color: "var(--teal)", fontWeight: 700, fontSize: "12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
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

                    <div className="notes-code-container">
                      <div className="notes-code-header">
                        <span>solution.py</span>
                        <span style={{ color: "var(--mint)", fontWeight: 700 }}>Python 3</span>
                      </div>
                      <pre className="notes-code-pre">
                        {activeNote.codeSnippet.code}
                      </pre>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px", fontStyle: "italic" }}>
                      {activeNote.codeSnippet.explanation}
                    </p>
                  </div>

                  <div>
                    <div className="kicker" style={{ marginBottom: "10px" }}>Asymptotic Complexity Analysis</div>
                    <div className="notes-complexity-grid">
                      <div className="notes-complexity-card">
                        <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)" }}>Time Complexity</span>
                        <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "monospace", color: "var(--ink)", margin: "4px 0" }}>
                          {activeNote.complexity.time}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>{activeNote.complexity.timeDetails}</div>
                      </div>

                      <div className="notes-complexity-card">
                        <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)" }}>Space Complexity</span>
                        <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "monospace", color: "var(--ink)", margin: "4px 0" }}>
                          {activeNote.complexity.space}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>{activeNote.complexity.spaceDetails}</div>
                      </div>
                    </div>
                  </div>

                  {activeNote.diagramAscii && (
                    <div>
                      <div className="kicker" style={{ marginBottom: "8px" }}>Memory &amp; Pointer Architecture</div>
                      <div className="notes-code-pre" style={{ background: "#172321", borderRadius: "12px" }}>
                        {activeNote.diagramAscii}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TAB 3: VIDEO */}
              {modalTab === "video" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#e03131", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Youtube size={13} /> Verified YouTube Masterclass
                      </span>
                      <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--ink)", margin: "2px 0 0" }}>
                        {activeNote.videoResource.title}
                      </h3>
                    </div>

                    <a
                      href={activeNote.videoResource.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta"
                      style={{ background: "#e03131", color: "white", padding: "7px 14px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      Watch on YouTube <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Responsive Iframe Container */}
                  <div className="notes-video-wrap">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${activeNote.videoResource.youtubeEmbedId}`}
                      title={activeNote.videoResource.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div style={{ background: "#f8faf7", border: "1px solid var(--line)", borderRadius: "12px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                    <div>
                      <strong>Instructor:</strong> {activeNote.videoResource.channel} · <strong>Duration:</strong> {activeNote.videoResource.duration}
                    </div>
                    <span style={{ color: "var(--teal)", fontWeight: 700 }}>Verified &amp; Available</span>
                  </div>

                  <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
                    💡 <strong>What you will master:</strong> {activeNote.videoResource.highlight}
                  </p>
                </>
              )}

              {/* TAB 4: PRACTICE */}
              {modalTab === "practice" && (
                <>
                  <div>
                    <div className="kicker" style={{ marginBottom: "10px" }}>Standard GeeksforGeeks &amp; LeetCode Practice</div>
                    <div className="notes-problems-list">
                      {activeNote.practiceProblems.map((prob, idx) => (
                        <a
                          key={idx}
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="notes-problem-card"
                        >
                          <div>
                            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{prob.platform}</span>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink)", marginTop: "2px" }}>{prob.name}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span className={`note-tag note-tag-mastery ${prob.difficulty === "Easy" ? "" : prob.difficulty === "Medium" ? "mid" : "weak"}`}>
                              {prob.difficulty}
                            </span>
                            <ExternalLink size={12} color="var(--muted)" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="kicker" style={{ color: "#b02a37", marginBottom: "8px" }}>Common Interview Pitfalls &amp; Traps</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {activeNote.deepDive.pitfalls.map((pitfall, idx) => (
                        <div key={idx} className="notes-callout pitfall">
                          <span style={{ fontWeight: 700 }}>⚠️</span>
                          <span>{pitfall}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="kicker" style={{ color: "#09544f", marginBottom: "8px" }}>Interview Pro Tips</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {activeNote.deepDive.interviewTips.map((tip, idx) => (
                        <div key={idx} className="notes-callout tip">
                          <span style={{ fontWeight: 700 }}>✓</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="notes-modal-footer">
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => {
                    onAskAi(`Explain ${activeNote.topic} from the perspective of an expert software engineer. Discuss key interview patterns, edge cases, and time/space complexity.`);
                    setActiveNote(null);
                  }}
                  className="icon-button"
                  style={{ width: "auto", padding: "0 14px", display: "inline-flex", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--ink)" }}
                >
                  <MessageCircle size={14} color="var(--teal)" />
                  Ask AI Tutor about this Note
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="icon-button"
                  style={{ width: "auto", padding: "0 14px", display: "inline-flex", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--muted)" }}
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
                className="cta"
                style={{ padding: "9px 18px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
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
