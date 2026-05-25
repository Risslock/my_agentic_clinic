CREATE TABLE IF NOT EXISTS agents (
  id                   TEXT PRIMARY KEY,
  name                 TEXT NOT NULL,
  model_type           TEXT NOT NULL,
  status               TEXT NOT NULL CHECK (status IN ('active', 'in-treatment', 'discharged')),
  presenting_complaints TEXT
);
