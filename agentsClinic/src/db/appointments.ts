import { v4 as uuidv4 } from "uuid";
import { db } from "./database";
import type { Appointment } from "./types";

type AppointmentWithAgent = Appointment & { agent_name: string };

export function createAppointment(data: {
  agent_id: string;
  therapist_name: string;
  scheduled_at: string;
  notes: string | null;
}): Appointment {
  const id = uuidv4();
  const created_at = new Date().toISOString();
  db.prepare(
    "INSERT INTO appointments (id, agent_id, therapist_name, scheduled_at, status, notes, created_at) VALUES (?, ?, ?, ?, 'scheduled', ?, ?)"
  ).run(id, data.agent_id, data.therapist_name, data.scheduled_at, data.notes, created_at);
  return getAppointment(id)! as Appointment;
}

export function getAppointment(id: string): AppointmentWithAgent | undefined {
  return db
    .prepare(
      `SELECT ap.*, ag.name as agent_name
       FROM appointments ap
       JOIN agents ag ON ag.id = ap.agent_id
       WHERE ap.id = ?`
    )
    .get(id) as AppointmentWithAgent | undefined;
}

export function listAppointments(): AppointmentWithAgent[] {
  return db
    .prepare(
      `SELECT ap.*, ag.name as agent_name
       FROM appointments ap
       JOIN agents ag ON ag.id = ap.agent_id
       ORDER BY ap.scheduled_at DESC`
    )
    .all() as AppointmentWithAgent[];
}
