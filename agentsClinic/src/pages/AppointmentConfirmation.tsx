import type { FC } from "hono/jsx";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { IconAppointment, IconArrowLeft, IconCheck } from "../components/Icons";
import { Layout } from "../components/Layout";
import type { Appointment } from "../db/types";

type AppointmentWithAgent = Appointment & { agent_name: string };

export type AppointmentConfirmationProps = { appointment: AppointmentWithAgent };

const statusVariant = (status: Appointment["status"]) => {
  if (status === "completed") return "success";
  if (status === "cancelled") return "danger";
  return "info";
};

export const AppointmentConfirmation: FC<AppointmentConfirmationProps> = ({
  appointment,
}) => (
  <Layout>
    <h1>Appointment Confirmed</h1>
    <Card title="Appointment details" icon={IconAppointment} variant="primary">
      <p>
        <strong>Agent:</strong> {appointment.agent_name}
      </p>
      <p>
        <strong>Therapist:</strong> {appointment.therapist_name}
      </p>
      <p>
        <strong>Scheduled:</strong> {new Date(appointment.scheduled_at).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> <Badge text={appointment.status} variant={statusVariant(appointment.status)} />
      </p>
      {appointment.notes ? <p>{appointment.notes}</p> : null}
      <div class="page-actions">
        <Button href="/appointments" icon={IconArrowLeft} variant="secondary">
          All appointments
        </Button>
        <Button icon={IconCheck} variant="ghost">
          Confirmed
        </Button>
      </div>
    </Card>
  </Layout>
);
