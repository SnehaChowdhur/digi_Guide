from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import ActivityRecord, ActivitySubmission, LearningTwin, Prediction, Preferences
from .services.recommendation_engine import build_recommendations
from .services.twin_engine import apply_activity, overall_score

app = FastAPI(title="digiGUIDE Learning Twin API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_topics = [
    {"topic": "Python", "mastery": 91, "confidence": .95, "attempts": 64, "accuracy": .91},
    {"topic": "Arrays", "mastery": 83, "confidence": .88, "attempts": 52, "accuracy": .84},
    {"topic": "Linked Lists", "mastery": 72, "confidence": .75, "attempts": 38, "accuracy": .74},
    {"topic": "Trees", "mastery": 61, "confidence": .61, "attempts": 29, "accuracy": .63},
    {"topic": "Dynamic Programming", "mastery": 38, "confidence": .47, "attempts": 21, "accuracy": .43},
]
_activity: list[ActivityRecord] = [
    ActivityRecord(id=1, topic="Arrays", kind="Quiz", summary="Completed Arrays: Sliding Window", detail="8 of 10 correct", created_at=datetime.now(timezone.utc)),
    ActivityRecord(id=2, topic="Trees", kind="Study session", summary="Reviewed Tree Traversals", detail="24 minutes", created_at=datetime.now(timezone.utc)),
]
_preferences = Preferences()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "learning-twin"}


@app.get("/api/twin/{student_id}", response_model=LearningTwin)
def get_twin(student_id: str) -> LearningTwin:
    from .models import TopicMastery
    topics = [TopicMastery(**topic) for topic in _topics]
    return LearningTwin(student_id=student_id, overall_score=overall_score(topics), streak_days=6, weekly_study_hours=6.4, topics=topics, recommendations=build_recommendations(topics))


@app.post("/api/twin/{student_id}/activity", response_model=LearningTwin)
def submit_activity(student_id: str, activity: ActivitySubmission) -> LearningTwin:
    from .models import TopicMastery
    topics = [TopicMastery(**topic) for topic in _topics]
    updated = [apply_activity(topic, activity) if topic.topic.lower() == activity.topic.lower() else topic for topic in topics]
    _topics[:] = [topic.model_dump() for topic in updated]
    _activity.insert(0, ActivityRecord(id=len(_activity) + 1, topic=activity.topic, kind="Quiz", summary=f"Completed {activity.topic}", detail="Correct answer" if activity.correct else "Needs another look", created_at=datetime.now(timezone.utc)))
    return LearningTwin(student_id=student_id, overall_score=overall_score(updated), streak_days=6, weekly_study_hours=6.4, topics=updated, recommendations=build_recommendations(updated))


@app.get("/api/activity/{student_id}", response_model=list[ActivityRecord])
def get_activity(student_id: str) -> list[ActivityRecord]:
    return _activity


@app.get("/api/preferences/{student_id}", response_model=Preferences)
def get_preferences(student_id: str) -> Preferences:
    return _preferences


@app.put("/api/preferences/{student_id}", response_model=Preferences)
def update_preferences(student_id: str, preferences: Preferences) -> Preferences:
    global _preferences
    _preferences = preferences
    return _preferences


@app.get("/api/predictions/{topic}", response_model=Prediction)
def predict(topic: str) -> Prediction:
    current = next((item["mastery"] for item in _topics if item["topic"].lower() == topic.lower()), 38)
    predictions = [round(min(98, current + increment), 1) for increment in (9, 18, 27)]
    return Prediction(topic=topic, current_mastery=current, predictions=predictions, confidence=.72)
