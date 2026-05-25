CREATE TABLE IF NOT EXISTS visits (
  id                    TEXT PRIMARY KEY,
  agent_id              TEXT NOT NULL REFERENCES agents(id),
  symptoms              TEXT NOT NULL,
  triage_output         TEXT,
  severity              TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  diagnosis_ailment_ids TEXT,
  prescription          TEXT,
  status                TEXT NOT NULL DEFAULT 'open'
                          CHECK (status IN ('open', 'triaged', 'diagnosed', 'prescribed')),
  created_at            TEXT NOT NULL
);
