CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  parent_topic_id UUID REFERENCES topics(id)
);

CREATE TABLE IF NOT EXISTS learning_states (
  student_id UUID REFERENCES students(id),
  topic_id UUID REFERENCES topics(id),
  mastery NUMERIC(5,2) NOT NULL DEFAULT 0,
  confidence NUMERIC(4,3) NOT NULL DEFAULT 0,
  accuracy NUMERIC(4,3) NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  PRIMARY KEY (student_id, topic_id)
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  topic_id UUID REFERENCES topics(id),
  correct BOOLEAN NOT NULL,
  difficulty NUMERIC(4,3) NOT NULL,
  time_seconds INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
