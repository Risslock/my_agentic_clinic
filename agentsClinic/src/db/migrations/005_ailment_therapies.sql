CREATE TABLE IF NOT EXISTS ailment_therapies (
  ailment_id TEXT NOT NULL REFERENCES ailments(id),
  therapy_id TEXT NOT NULL REFERENCES therapies(id),
  PRIMARY KEY (ailment_id, therapy_id)
);
