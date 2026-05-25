import type { FC } from "hono/jsx";
import type { Agent, Appointment } from "../db/types";
import { Layout } from "../components/Layout";

type AgentWithCount = Agent & { ailment_count: number };
type AppointmentWithAgent = Appointment & { agent_name: string };

export type DashboardProps = {
  counts: {
    totalAgents: number;
    openAppointments: number;
    ailmentsInFlight: number;
  };
  agents: AgentWithCount[];
  appointments: AppointmentWithAgent[];
};

export const Dashboard: FC<DashboardProps> = ({ counts, agents, appointments }) => (
  <Layout>
    <h1>Staff Dashboard</h1>

    <div class="dashboard-counts">
      <article>
        <strong>{counts.totalAgents}</strong>
        <p>Total Agents</p>
      </article>
      <article>
        <strong>{counts.openAppointments}</strong>
        <p>Open Appointments</p>
      </article>
      <article>
        <strong>{counts.ailmentsInFlight}</strong>
        <p>Ailments In-Flight</p>
      </article>
    </div>

    <h2>Agents</h2>
    <div style="overflow-x: auto">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Model Type</th>
            <th>Status</th>
            <th>Ailments</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a.id}>
              <td>
                <a href={`/agents/${a.id}`}>{a.name}</a>
              </td>
              <td>{a.model_type}</td>
              <td>{a.status}</td>
              <td>{a.ailment_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h2>Appointments</h2>
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
              <td colspan={4}>No appointments yet.</td>
            </tr>
          ) : (
            appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.agent_name}</td>
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
