from datetime import datetime, timezone
import os

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from .models import (
    ActivityRecord,
    ActivitySubmission,
    LearningTwin,
    Prediction,
    Preferences,
    Question,
    TopicMastery,
)
from .services.recommendation_engine import build_recommendations
from .services.twin_engine import apply_activity, overall_score

app = FastAPI(title="digiGUIDE Learning Twin API", version="0.2.0")

# CORS setup for dev and potential preview hosts
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_TOPICS = [
    {"topic": "Python", "mastery": 91.0, "confidence": 0.95, "attempts": 64, "accuracy": 0.91},
    {"topic": "Arrays", "mastery": 83.0, "confidence": 0.88, "attempts": 52, "accuracy": 0.84},
    {"topic": "Linked Lists", "mastery": 72.0, "confidence": 0.75, "attempts": 38, "accuracy": 0.74},
    {"topic": "Recursion", "mastery": 68.0, "confidence": 0.70, "attempts": 34, "accuracy": 0.69},
    {"topic": "Trees", "mastery": 61.0, "confidence": 0.61, "attempts": 29, "accuracy": 0.63},
    {"topic": "Memoization", "mastery": 52.0, "confidence": 0.55, "attempts": 25, "accuracy": 0.54},
    {"topic": "Dynamic Programming", "mastery": 38.0, "confidence": 0.47, "attempts": 21, "accuracy": 0.43},
]

# Question bank for adaptive learning
QUESTION_BANK: list[Question] = [
    # Dynamic Programming
    Question(
        id=1,
        topic="Dynamic Programming",
        prompt="Which technique stores solutions to overlapping subproblems so each subproblem is solved only once?",
        answers=["Greedy selection", "Memoization", "Binary search", "Backtracking"],
        correct=1,
        explanation="Memoization caches the results of function calls so identical subproblems are not computed repeatedly.",
        difficulty=0.5,
    ),
    Question(
        id=2,
        topic="Dynamic Programming",
        prompt="What are the two essential characteristics of a problem that can be solved via Dynamic Programming?",
        answers=[
            "Only one valid input and constant time lookup",
            "Optimal substructure and overlapping subproblems",
            "A sorted array and divide-and-conquer strategy",
            "Non-recursive formulation and greedy choice property",
        ],
        correct=1,
        explanation="Dynamic Programming requires optimal substructure (optimal solution contains optimal sub-solutions) and overlapping subproblems.",
        difficulty=0.6,
    ),
    Question(
        id=3,
        topic="Dynamic Programming",
        prompt="In bottom-up Dynamic Programming, how is state accumulated compared to top-down memoization?",
        answers=[
            "Via the recursive call stack",
            "Iteratively, from the smallest base cases up to the desired target",
            "Randomly sampling solutions until convergence",
            "Using depth-first search branch pruning",
        ],
        correct=1,
        explanation="Bottom-up (tabulation) fills a table iteratively starting from base cases, avoiding call-stack overhead.",
        difficulty=0.7,
    ),
    # Recursion
    Question(
        id=4,
        topic="Recursion",
        prompt="What occurs if a recursive function lacks a valid base case or fails to reach it?",
        answers=["Memory leak in heap", "Stack overflow error", "Zero division error", "Deadlock"],
        correct=1,
        explanation="Without a base case, recursive calls continue indefinitely until the call stack exceeds its limit (StackOverflow).",
        difficulty=0.4,
    ),
    Question(
        id=5,
        topic="Recursion",
        prompt="What is the time complexity of the naive recursive Fibonacci implementation fib(n) = fib(n-1) + fib(n-2)?",
        answers=["O(n)", "O(n log n)", "O(2^n)", "O(n^2)"],
        correct=2,
        explanation="Naive recursive Fibonacci branches into two recursive calls at each level, producing an O(2^n) exponential tree.",
        difficulty=0.6,
    ),
    # Trees
    Question(
        id=6,
        topic="Trees",
        prompt="Which tree traversal visits the nodes of a Binary Search Tree (BST) in ascending sorted order?",
        answers=["Pre-order (Root, Left, Right)", "In-order (Left, Root, Right)", "Post-order (Left, Right, Root)", "Level-order (BFS)"],
        correct=1,
        explanation="In-order traversal visits the left subtree, then the root, then the right subtree, producing sorted output for a BST.",
        difficulty=0.5,
    ),
    Question(
        id=7,
        topic="Trees",
        prompt="What is the maximum number of nodes at level L (0-indexed) of a binary tree?",
        answers=["2^L", "2^(L+1)", "L^2", "2*L"],
        correct=0,
        explanation="At level 0 there is 2^0 = 1 node (root), level 1 has 2^1 = 2 nodes, and level L has up to 2^L nodes.",
        difficulty=0.5,
    ),
    # Arrays
    Question(
        id=8,
        topic="Arrays",
        prompt="What is the average time complexity of accessing an element in an array by its index?",
        answers=["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correct=2,
        explanation="Arrays have contiguous memory layout, enabling constant time O(1) direct indexing via pointer arithmetic.",
        difficulty=0.3,
    ),
    # Linked Lists
    Question(
        id=9,
        topic="Linked Lists",
        prompt="Why is inserting a node at the head of a singly linked list O(1) while in a dynamic array it is usually O(n)?",
        answers=[
            "Linked lists use hash tables internally",
            "Linked list head insertion requires updating only one pointer without shifting elements",
            "Arrays must allocate double memory for every insert",
            "Linked lists store elements in contiguous RAM blocks",
        ],
        correct=1,
        explanation="Pretending a node to a linked list simply changes the new node's next pointer and head pointer, taking O(1) time.",
        difficulty=0.5,
    ),
    # Memoization
    Question(
        id=10,
        topic="Memoization",
        prompt="How does memoization differ from basic tabulation?",
        answers=[
            "Memoization is top-down using recursion and a cache, while tabulation is bottom-up iterative",
            "Memoization uses more CPU cycles but less memory",
            "Tabulation can only be used on graph algorithms",
            "Memoization does not work with overlapping subproblems",
        ],
        correct=0,
        explanation="Memoization solves subproblems on-demand from the top down and stores results, while tabulation builds answers from the bottom up.",
        difficulty=0.5,
    ),
    # Python
    Question(
        id=11,
        topic="Python",
        prompt="In Python, what is the amortized time complexity of appending an element to the end of a list?",
        answers=["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correct=0,
        explanation="Python lists are dynamic arrays with over-allocation, yielding O(1) amortized time for appends.",
        difficulty=0.4,
    ),
]


class StudentStore:
    def __init__(self, student_id: str):
        self.student_id = student_id
        self.topics = [TopicMastery(**t) for t in DEFAULT_TOPICS]
        self.activity: list[ActivityRecord] = [
            ActivityRecord(
                id=1,
                topic="Arrays",
                kind="Quiz",
                summary="Completed Arrays: Sliding Window",
                detail="8 of 10 correct",
                created_at=datetime.now(timezone.utc),
            ),
            ActivityRecord(
                id=2,
                topic="Trees",
                kind="Study session",
                summary="Reviewed Tree Traversals",
                detail="24 minutes",
                created_at=datetime.now(timezone.utc),
            ),
        ]
        name = student_id.replace("-", " ").replace("_", " ").title()
        if not name or name.lower() == "alex":
            name = "Alex Smith"
        self.preferences = Preferences(name=name)


_stores: dict[str, StudentStore] = {}


def get_store(student_id: str) -> StudentStore:
    clean_id = (student_id or "alex").strip().lower()
    if clean_id not in _stores:
        _stores[clean_id] = StudentStore(clean_id)
    return _stores[clean_id]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "learning-twin", "version": "0.2.0"}


@app.get("/api/twin/{student_id}", response_model=LearningTwin)
def get_twin(student_id: str) -> LearningTwin:
    store = get_store(student_id)
    return LearningTwin(
        student_id=student_id,
        overall_score=overall_score(store.topics),
        streak_days=6,
        weekly_study_hours=6.4,
        topics=store.topics,
        recommendations=build_recommendations(store.topics),
    )


@app.post("/api/twin/{student_id}/activity", response_model=LearningTwin)
def submit_activity(student_id: str, activity: ActivitySubmission) -> LearningTwin:
    store = get_store(student_id)
    updated: list[TopicMastery] = []
    matched = False
    for topic in store.topics:
        if topic.topic.lower() == activity.topic.lower():
            updated.append(apply_activity(topic, activity))
            matched = True
        else:
            updated.append(topic)

    if not matched:
        # If topic was not yet tracked, initialize and apply
        new_topic = TopicMastery(
            topic=activity.topic,
            mastery=50.0,
            confidence=0.5,
            attempts=0,
            accuracy=0.5,
        )
        updated.append(apply_activity(new_topic, activity))

    store.topics = updated
    new_id = len(store.activity) + 1
    store.activity.insert(
        0,
        ActivityRecord(
            id=new_id,
            topic=activity.topic,
            kind="Quiz",
            summary=f"Completed {activity.topic}",
            detail="Correct answer" if activity.correct else "Needs another look",
            created_at=datetime.now(timezone.utc),
        ),
    )
    return LearningTwin(
        student_id=student_id,
        overall_score=overall_score(updated),
        streak_days=6,
        weekly_study_hours=round(store.preferences.weekly_goal_hours * 0.8, 1),
        topics=updated,
        recommendations=build_recommendations(updated),
    )


@app.get("/api/activity/{student_id}", response_model=list[ActivityRecord])
def get_activity(student_id: str) -> list[ActivityRecord]:
    return get_store(student_id).activity


@app.get("/api/preferences/{student_id}", response_model=Preferences)
def get_preferences(student_id: str) -> Preferences:
    return get_store(student_id).preferences


@app.put("/api/preferences/{student_id}", response_model=Preferences)
def update_preferences(student_id: str, preferences: Preferences) -> Preferences:
    store = get_store(student_id)
    store.preferences = preferences
    return store.preferences


@app.get("/api/quiz/questions", response_model=list[Question])
def get_quiz_questions(
    topic: str | None = Query(default=None),
    count: int = Query(default=3, ge=1, le=10),
) -> list[Question]:
    """Retrieve adaptive questions tailored to a specific topic or a curated mixed set."""
    if topic and topic.strip():
        filtered = [q for q in QUESTION_BANK if q.topic.lower() == topic.strip().lower()]
        if filtered:
            return filtered[:count]
    return QUESTION_BANK[:count]


@app.get("/api/predictions/{topic}", response_model=Prediction)
def predict(topic: str) -> Prediction:
    default_store = get_store("alex")
    current = next((t.mastery for t in default_store.topics if t.topic.lower() == topic.lower()), 38.0)
    # Exponential asymptotic mastery growth model:
    # Next = Current + (100 - Current) * (1 - 0.72^session)
    predictions = [
        round(min(99.0, current + (100.0 - current) * (1.0 - (0.75 ** s))), 1)
        for s in (1, 2, 3)
    ]
    return Prediction(topic=topic, current_mastery=current, predictions=predictions, confidence=0.78)

