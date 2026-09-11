import unittest
import sys
from pathlib import Path

# Ensure backend directory is in sys.path for test runners
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.models import ActivitySubmission, TopicMastery, Question
from app.services.twin_engine import apply_activity, overall_score
from app.services.recommendation_engine import build_recommendations


class TestTwinEngine(unittest.TestCase):
    def test_correct_activity_increases_mastery(self):
        topic = TopicMastery(topic="Dynamic Programming", mastery=38, confidence=0.4, attempts=10, accuracy=0.4)
        updated = apply_activity(topic, ActivitySubmission(topic=topic.topic, correct=True, difficulty=0.7, time_seconds=45))
        self.assertGreater(updated.mastery, topic.mastery)
        self.assertEqual(updated.attempts, 11)
        self.assertGreater(updated.accuracy, topic.accuracy)

    def test_incorrect_activity_decreases_mastery(self):
        topic = TopicMastery(topic="Dynamic Programming", mastery=60, confidence=0.5, attempts=10, accuracy=0.6)
        updated = apply_activity(topic, ActivitySubmission(topic=topic.topic, correct=False, difficulty=0.5, time_seconds=60))
        self.assertLess(updated.mastery, topic.mastery)
        self.assertEqual(updated.attempts, 11)

    def test_overall_score_is_average(self):
        topics = [
            TopicMastery(topic="A", mastery=40, confidence=0.5, attempts=1, accuracy=0.4),
            TopicMastery(topic="B", mastery=80, confidence=0.5, attempts=1, accuracy=0.8),
        ]
        self.assertEqual(overall_score(topics), 60.0)

    def test_recommendations_prioritize_lowest_mastery(self):
        topics = [
            TopicMastery(topic="Python", mastery=90, confidence=0.9, attempts=50, accuracy=0.9),
            TopicMastery(topic="DP", mastery=35, confidence=0.4, attempts=10, accuracy=0.35),
            TopicMastery(topic="Trees", mastery=60, confidence=0.6, attempts=20, accuracy=0.6),
        ]
        recs = build_recommendations(topics)
        self.assertGreaterEqual(len(recs), 1)
        self.assertEqual(recs[0].topic, "DP")
        self.assertEqual(recs[0].priority, "high")


if __name__ == "__main__":
    unittest.main()

