import type { FC } from "hono/jsx";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { IconAgent, IconAppointment, IconDashboard, IconTherapy } from "../components/Icons";
import { Layout } from "../components/Layout";
import { Table } from "../components/Table";
import type { Agent, Appointment } from "../db/types";

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

const agentStatusVariant = (status: Agent["status"]) => {
  if (status === "active") return "success";
  if (status === "in-treatment") return "warning";
  return "info";
};

const appointmentStatusVariant = (status: Appointment["status"]) => {
  if (status === "completed") return "success";
  if (status === "cancelled") return "danger";
  return "info";
};

export const Dashboard: FC<DashboardProps> = ({ counts, agents, appointments }) => (
  <Layout>
    <h1>Staff Dashboard</h1>

    <div class="dashboard-grid">
      <Card title="Total Agents" icon={IconAgent}>
        <p>{counts.totalAgents}</p>
      </Card>
      <Card title="Open Appointments" icon={IconAppointment}>
        <p>{counts.openAppointments}</p>
      </Card>
      <Card title="Ailments In-Flight" icon={IconTherapy}>
        <p>{counts.ailmentsInFlight}</p>
      </Card>
    </div>

    <div class="section-grid">
      <Card title="Agents" icon={IconDashboard}>
        <Table
          columns={["Name", "Model Type", "Status", "Ailments"]}
          rows={agents.map((agent) => ({
            Name: <a href={`/agents/${agent.id}`}>{agent.name}</a>,
            "Model Type": agent.model_type,
            Status: <Badge text={agent.status} variant={agentStatusVariant(agent.status)} />,
            Ailments: agent.ailment_count,
          }))}
          emptyMessage="No agents available."
        />
      </Card>

      <Card title="Appointments" icon={IconAppointment}>
        <Table
          columns={["Agent", "Therapist", "Scheduled", "Status"]}
          rows={appointments.map((appointment) => ({
            Agent: appointment.agent_name,
            Therapist: appointment.therapist_name,
            Scheduled: new Date(appointment.scheduled_at).toLocaleString(),
            Status: <Badge text={appointment.status} variant={appointmentStatusVariant(appointment.status)} />,
          }))}
          emptyMessage="No appointments yet."
        />
      </Card>
    </div>
  </Layout>
);
