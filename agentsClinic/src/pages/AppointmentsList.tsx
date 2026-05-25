import type { FC } from "hono/jsx";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { IconAppointment } from "../components/Icons";
import { Layout } from "../components/Layout";
import { Table } from "../components/Table";
import type { Appointment } from "../db/types";

type AppointmentRow = Appointment & { agent_name: string };

export type AppointmentsListProps = { appointments: AppointmentRow[] };

const statusVariant = (status: Appointment["status"]) => {
  if (status === "completed") return "success";
  if (status === "cancelled") return "danger";
  return "info";
};

export const AppointmentsList: FC<AppointmentsListProps> = ({ appointments }) => (
  <Layout>
    <h1>Appointments</h1>
    <Card title="Upcoming appointments" icon={IconAppointment}>
      <Table
        columns={["Agent", "Therapist", "Scheduled", "Status"]}
        rows={appointments.map((appointment) => ({
          Agent: <a href={`/appointments/${appointment.id}`}>{appointment.agent_name}</a>,
          Therapist: appointment.therapist_name,
          Scheduled: new Date(appointment.scheduled_at).toLocaleString(),
          Status: <Badge text={appointment.status} variant={statusVariant(appointment.status)} />,
        }))}
        emptyMessage="No appointments booked yet."
      />
    </Card>
  </Layout>
);
