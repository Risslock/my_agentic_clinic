import { v4 as uuidv4 } from "uuid";
import { db } from "./database";
import type { Visit } from "./types";

export function createVisit(agentId: string, symptoms: string): Visit {
  const id = uuidv4();
  const created_at = new Date().toISOString();
  db.prepare(
    "INSERT INTO visits (id, agent_id, symptoms, status, created_at) VALUES (?, ?, ?, 'open', ?)"
  ).run(id, agentId, symptoms, created_at);
  return getVisit(id)!;
}

export function getVisit(id: string): Visit | undefined {
  return db.prepare("SELECT * FROM visits WHERE id = ?").get(id) as Visit | undefined;
}

export function updateVisit(
  id: string,
  updates: Partial<Pick<Visit, "triage_output" | "severity" | "diagnosis_ailment_ids" | "prescription" | "status">>
): void {
  const fields = Object.keys(updates)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(updates);
  db.prepare(`UPDATE visits SET ${fields} WHERE id = ?`).run(...values, id);
}
