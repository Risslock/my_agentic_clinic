CREATE TABLE IF NOT EXISTS therapies (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  instructions TEXT
);
