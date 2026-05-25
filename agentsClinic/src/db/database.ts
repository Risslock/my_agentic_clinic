import Database from "better-sqlite3";

// Use in-memory DB when running tests so files are never written to disk
const dbPath = process.env.NODE_ENV === "test" ? ":memory:" : "clinic.sqlite";

export const db = new Database(dbPath);
