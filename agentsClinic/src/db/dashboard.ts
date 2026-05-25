import { db } from "./database";
import type { Agent, Appointment } from "./types";

type DashboardCounts = {
  totalAgents: number;
  openAppointments: number;
  ailmentsInFlight: number;
};

type AgentWithAilmentCount = Agent & { ailment_count: number };
type AppointmentWithAgent = Appointment & { agent_name: string };

export function getDashboardCounts(): DashboardCounts {
  const row = db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM agents) AS totalAgents,
         (SELECT COUNT(*) FROM appointments WHERE status = 'scheduled') AS openAppointments,
         (SELECT COUNT(DISTINCT aa.agent_id)
          FROM agent_ailments aa
          WHERE (
            SELECT v.status FROM visits v
            WHERE v.agent_id = aa.agent_id
            ORDER BY v.created_at DESC LIMIT 1
          ) IN ('triaged', 'diagnosed')
         ) AS ailmentsInFlight`
    )
    .get() as { totalAgents: number; openAppointments: number; ailmentsInFlight: number };

  return {
    totalAgents: row.totalAgents,
    openAppointments: row.openAppointments,
    ailmentsInFlight: row.ailmentsInFlight,
  };
}

export function getDashboardAgents(): AgentWithAilmentCount[] {
  return db
    .prepare(
      `SELECT a.id, a.name, a.model_type, a.status, a.presenting_complaints,
              COUNT(aa.ailment_id) AS ailment_count
       FROM agents a
       LEFT JOIN agent_ailments aa ON aa.agent_id = a.id
       GROUP BY a.id
       ORDER BY a.name`
    )
    .all() as AgentWithAilmentCount[];
}

export function getDashboardAppointments(): AppointmentWithAgent[] {
  return db
    .prepare(
      `SELECT ap.*, ag.name AS agent_name
       FROM appointments ap
       JOIN agents ag ON ag.id = ap.agent_id
       ORDER BY ap.scheduled_at DESC`
    )
    .all() as AppointmentWithAgent[];
}
