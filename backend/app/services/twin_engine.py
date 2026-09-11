from datetime import datetime, timezone
from ..models import ActivitySubmission, TopicMastery


def apply_activity(topic: TopicMastery, activity: ActivitySubmission) -> TopicMastery:
    """Update mastery with a bounded, explainable weighted performance rule."""
    learning_signal = (1.0 if activity.correct else 0.0) * 100
    difficulty_bonus = (activity.difficulty - 0.5) * 12
    speed_bonus = 4 if activity.time_seconds < 60 and activity.correct else 0
    target = max(0, min(100, learning_signal + difficulty_bonus + speed_bonus))
    rate = 0.08 if activity.correct else 0.12
    mastery = max(0, min(100, topic.mastery + (target - topic.mastery) * rate))
    attempts = topic.attempts + 1
    accuracy = ((topic.accuracy * topic.attempts) + float(activity.correct)) / attempts
    confidence = min(1.0, 0.35 + attempts / 40)
    return topic.model_copy(update={
        "mastery": round(mastery, 1),
        "attempts": attempts,
        "accuracy": round(accuracy, 3),
        "confidence": round(confidence, 3),
        "last_practiced": datetime.now(timezone.utc),
    })


def overall_score(topics: list[TopicMastery]) -> float:
    if not topics:
        return 0
    return round(sum(topic.mastery for topic in topics) / len(topics), 1)
