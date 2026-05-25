CREATE TABLE IF NOT EXISTS agent_ailments (
  agent_id   TEXT NOT NULL REFERENCES agents(id),
  ailment_id TEXT NOT NULL REFERENCES ailments(id),
  PRIMARY KEY (agent_id, ailment_id)
);
