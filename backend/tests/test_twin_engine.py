from app.models import ActivitySubmission, TopicMastery
from app.services.twin_engine import apply_activity, overall_score


def test_correct_activity_increases_mastery():
    topic = TopicMastery(topic="Dynamic Programming", mastery=38, confidence=.4, attempts=10, accuracy=.4)
    updated = apply_activity(topic, ActivitySubmission(topic=topic.topic, correct=True, difficulty=.7, time_seconds=45))
    assert updated.mastery > topic.mastery
    assert updated.attempts == 11


def test_overall_score_is_average():
    topics = [TopicMastery(topic="A", mastery=40, confidence=.5, attempts=1, accuracy=.4), TopicMastery(topic="B", mastery=80, confidence=.5, attempts=1, accuracy=.8)]
    assert overall_score(topics) == 60
