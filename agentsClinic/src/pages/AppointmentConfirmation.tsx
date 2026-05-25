import type { FC } from "hono/jsx";
import type { Appointment } from "../db/types";
import { Layout } from "../components/Layout";

type AppointmentWithAgent = Appointment & { agent_name: string };

export type AppointmentConfirmationProps = { appointment: AppointmentWithAgent };

export const AppointmentConfirmation: FC<AppointmentConfirmationProps> = ({
  appointment,
}) => (
  <Layout>
    <h1>Appointment Confirmed</h1>
    <dl>
      <dt>Agent</dt>
      <dd>{appointment.agent_name}</dd>
      <dt>Therapist</dt>
      <dd>{appointment.therapist_name}</dd>
      <dt>Scheduled</dt>
      <dd>{new Date(appointment.scheduled_at).toLocaleString()}</dd>
      <dt>Status</dt>
      <dd>{appointment.status}</dd>
      {appointment.notes && (
        <>
          <dt>Notes</dt>
          <dd>{appointment.notes}</dd>
        </>
      )}
    </dl>
    <p>
      <a href="/appointments">← All Appointments</a>
    </p>
  </Layout>
);
