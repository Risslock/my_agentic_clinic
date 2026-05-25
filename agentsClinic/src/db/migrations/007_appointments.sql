CREATE TABLE IF NOT EXISTS appointments (
  id              TEXT PRIMARY KEY,
  agent_id        TEXT NOT NULL REFERENCES agents(id),
  therapist_name  TEXT NOT NULL,
  scheduled_at    TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes           TEXT,
  created_at      TEXT NOT NULL
);
