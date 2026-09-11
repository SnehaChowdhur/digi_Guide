import json
from pathlib import Path
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
_QUESTIONS_FILE = Path(__file__).resolve().parent.parent.parent / "app" / "quiz" / "questions.json"
if _QUESTIONS_FILE.exists():
    with open(_QUESTIONS_FILE, "r", encoding="utf-8") as _f:
        _data = json.load(_f)
    QUESTION_BANK: list[Question] = [
        Question(
            id=item["id"],
            topic=item["topic"],
            prompt=item["prompt"],
            answers=item["answers"],
            correct=item["correct"],
            explanation=item["explanation"],
            difficulty=item.get("difficulty", 0.5),
        )
        for item in _data
    ]
else:
    QUESTION_BANK: list[Question] = [
        Question(
            id=1,
            topic="Dynamic Programming",
            prompt="Which technique caches the results of overlapping subproblems during top-down recursion?",
            answers=["Memoization", "Tabulation", "Backtracking", "Iteration"],
            correct=0,
            explanation="Memoization stores return values of pure functions in a cache so repeated calls return in O(1).",
            difficulty=0.5,
        )
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

