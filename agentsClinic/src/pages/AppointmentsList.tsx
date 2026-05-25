import type { FC } from "hono/jsx";
import type { Appointment } from "../db/types";
import { Layout } from "../components/Layout";

type AppointmentRow = Appointment & { agent_name: string };

export type AppointmentsListProps = { appointments: AppointmentRow[] };

export const AppointmentsList: FC<AppointmentsListProps> = ({ appointments }) => (
  <Layout>
    <h1>Appointments</h1>
    <div style="overflow-x: auto">
      <table>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Therapist</th>
            <th>Scheduled</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colspan={4}>No appointments booked yet.</td>
            </tr>
          ) : (
            appointments.map((a) => (
              <tr key={a.id}>
                <td>
                  <a href={`/appointments/${a.id}`}>{a.agent_name}</a>
                </td>
                <td>{a.therapist_name}</td>
                <td>{new Date(a.scheduled_at).toLocaleString()}</td>
                <td>{a.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </Layout>
);
