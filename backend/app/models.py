from datetime import datetime
from pydantic import BaseModel, Field


class TopicMastery(BaseModel):
    topic: str
    mastery: float = Field(ge=0, le=100)
    confidence: float = Field(ge=0, le=1)
    attempts: int = Field(ge=0)
    accuracy: float = Field(ge=0, le=1)
    last_practiced: datetime | None = None


class ActivitySubmission(BaseModel):
    topic: str
    correct: bool
    difficulty: float = Field(default=0.5, ge=0, le=1)
    time_seconds: int = Field(default=60, ge=1)


class Prediction(BaseModel):
    topic: str
    current_mastery: float
    predictions: list[float]
    confidence: float


class ActivityRecord(BaseModel):
    id: int
    topic: str
    kind: str
    summary: str
    detail: str
    created_at: datetime


class Preferences(BaseModel):
    name: str = "Alex Smith"
    weekly_goal_hours: float = Field(default=8, ge=1, le=40)
    daily_reminders: bool = True


class Recommendation(BaseModel):
    topic: str
    reason: str
    minutes: int
    priority: str


class LearningTwin(BaseModel):
    student_id: str
    overall_score: float
    streak_days: int
    weekly_study_hours: float
    topics: list[TopicMastery]
    recommendations: list[Recommendation]
