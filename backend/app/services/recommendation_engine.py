from ..models import Recommendation, TopicMastery


def build_recommendations(topics: list[TopicMastery]) -> list[Recommendation]:
    recommendations = []
    for topic in sorted(topics, key=lambda item: (item.mastery, item.accuracy))[:3]:
        if topic.mastery < 50:
            reason = "Recent mistakes suggest revisiting the foundations before advancing."
            priority = "high"
        elif topic.mastery < 70:
            reason = "A short focused practice block can turn this into a stable skill."
            priority = "medium"
        else:
            reason = "Keep this strength fresh with spaced retrieval practice."
            priority = "low"
        recommendations.append(Recommendation(topic=topic.topic, reason=reason, minutes=25 if priority == "high" else 15, priority=priority))
    return recommendations
