import Database from "better-sqlite3";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve relative to this file so the DB lands in the same place
// regardless of where the process is started from.
const dbPath =
  process.env.NODE_ENV === "test"
    ? ":memory:"
    : join(__dirname, "../../clinic.sqlite");

export const db = new Database(dbPath);

db.pragma("foreign_keys = ON");
