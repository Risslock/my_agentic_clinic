import { v4 as uuidv4 } from "uuid";
import { db } from "./database";
import type { Ailment, Visit } from "./types";

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

export function getVisitsByAgent(agentId: string): Visit[] {
  return db
    .prepare("SELECT * FROM visits WHERE agent_id = ? ORDER BY created_at DESC")
    .all(agentId) as Visit[];
}

export type VisitWithDetails = Visit & {
  diagnosed_ailments: Pick<Ailment, "id" | "name">[];
};

export function getVisitWithAilments(id: string): VisitWithDetails | undefined {
  const visit = getVisit(id);
  if (!visit) return undefined;

  let diagnosed_ailments: Pick<Ailment, "id" | "name">[] = [];

  if (visit.diagnosis_ailment_ids) {
    try {
      const ids: string[] = JSON.parse(visit.diagnosis_ailment_ids);
      if (ids.length > 0) {
        const placeholders = ids.map(() => "?").join(",");
        diagnosed_ailments = db
          .prepare(
            `SELECT id, name FROM ailments WHERE id IN (${placeholders}) ORDER BY name`
          )
          .all(...ids) as Pick<Ailment, "id" | "name">[];
      }
    } catch {
      // malformed JSON — return empty ailment list
    }
  }

  return { ...visit, diagnosed_ailments };
}

export function updateVisit(
  id: string,
  updates: Partial<
    Pick<Visit, "triage_output" | "severity" | "diagnosis_ailment_ids" | "prescription" | "status">
  >
): void {
  const fields = Object.keys(updates)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(updates);
  db.prepare(`UPDATE visits SET ${fields} WHERE id = ?`).run(...values, id);
}
