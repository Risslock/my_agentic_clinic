import type { FC } from "hono/jsx";
import type { Agent, Ailment, Visit } from "../db/types";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { FormField } from "../components/FormField";
import {
  IconAgent,
  IconAlertTriangle,
  IconAppointment,
  IconAilment,
  IconCalendar,
  IconCheck,
} from "../components/Icons";
import { Layout } from "../components/Layout";
import { Table } from "../components/Table";

type FormErrors = {
  therapist_name?: string;
  scheduled_at?: string;
  notes?: string;
};

type FormData = {
  therapist_name?: string;
  scheduled_at?: string;
  notes?: string;
};

export type AgentDetailProps = {
  agent: Agent;
  ailments: Pick<Ailment, "id" | "name">[];
  visits?: Visit[];
  errors?: FormErrors;
  formData?: FormData;
};

const statusVariant = (status: Agent["status"]) => {
  if (status === "active") return "success";
  if (status === "in-treatment") return "warning";
  return "info";
};

const severityVariant = (severity: Visit["severity"]) => {
  if (severity === "critical") return "danger";
  if (severity === "high") return "danger";
  if (severity === "medium") return "warning";
  return "info";
};

export const AgentDetail: FC<AgentDetailProps> = ({
  agent,
  ailments,
  visits = [],
  errors,
  formData,
}) => (
  <Layout>
    <h1>{agent.name}</h1>

    <div class="section-grid">
      <Card title="Profile" icon={IconAgent} variant="primary">
        <p>
          <strong>Model:</strong> {agent.model_type}
        </p>
        <p>
          <strong>Status:</strong> <Badge text={agent.status} variant={statusVariant(agent.status)} />
        </p>
        {agent.presenting_complaints ? (
          <p>
            <strong>Presenting complaints:</strong> {agent.presenting_complaints}
          </p>
        ) : null}
      </Card>

      <Card title="Ailments" icon={IconAilment}>
        {ailments.length === 0 ? (
          <EmptyState
            heading="No ailments yet"
            description="This agent has no ailments recorded."
            icon={IconAlertTriangle}
          />
        ) : (
          <ul>
            {ailments.map((ailment) => (
              <li key={ailment.id}>
                <a href={`/ailments/${ailment.id}`}>{ailment.name}</a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>

    <div class="section-grid">
      <Card title="Book an Appointment" icon={IconAppointment}>
        <form action="/appointments" method="post">
          <input type="hidden" name="agent_id" value={agent.id} />
          <FormField
            label="Therapist Name"
            name="therapist_name"
            value={formData?.therapist_name ?? ""}
            error={errors?.therapist_name}
            required
          />
          <FormField
            label="Date & Time"
            name="scheduled_at"
            type="datetime-local"
            value={formData?.scheduled_at ?? ""}
            error={errors?.scheduled_at}
            required
          />
          <FormField
            label="Notes (optional)"
            name="notes"
            textarea
            value={formData?.notes ?? ""}
            error={errors?.notes}
            rows={4}
          />
          <Button type="submit" icon={IconCheck}>
            Book Appointment
          </Button>
        </form>
      </Card>

      <Card title="Visit History" icon={IconCalendar}>
        {visits.length === 0 ? (
          <EmptyState
            heading="No visits yet"
            description="No visits are on record for this agent."
            icon={IconAlertTriangle}
          />
        ) : (
          <Table
            columns={["Date", "Status", "Severity", "Action"]}
            rows={visits.map((visit) => ({
              Date: new Date(visit.created_at).toLocaleString(),
              Status: <Badge text={visit.status} variant={visit.status === "open" ? "warning" : "info"} />,
              Severity: visit.severity ? (
                <Badge text={visit.severity} variant={severityVariant(visit.severity)} />
              ) : (
                "—"
              ),
              Action: <a href={`/visits/${visit.id}`}>View</a>,
            }))}
            emptyMessage="No visits are on record."
          />
        )}
      </Card>
    </div>
  </Layout>
);
