import type { FC } from "hono/jsx";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import {
  IconAlertTriangle,
  IconAppointment,
  IconArrowLeft,
  IconAilment,
  IconCheck,
  IconDashboard,
  IconSeverityCritical,
  IconSeverityHigh,
  IconSeverityLow,
  IconSeverityMedium,
} from "../components/Icons";
import { Layout } from "../components/Layout";
import type { Ailment, Visit } from "../db/types";

type TriageOutput = {
  severity: string;
  candidate_ailment_ids: string[];
  rationale: string;
};

type PrescribedTherapy = {
  therapy_id: string;
  therapy_name: string;
  instructions: string;
  priority: number;
};

type Prescription = {
  prescribed_therapies: PrescribedTherapy[];
  rationale: string;
};

export type VisitDetailProps = {
  visit: Visit;
  diagnosedAilments: Pick<Ailment, "id" | "name">[];
};

const severityIcon = (severity: string) => {
  if (severity === "critical") return IconSeverityCritical;
  if (severity === "high") return IconSeverityHigh;
  if (severity === "medium") return IconSeverityMedium;
  return IconSeverityLow;
};

const severityVariant = (severity: string) => {
  if (severity === "critical") return "danger";
  if (severity === "high") return "danger";
  if (severity === "medium") return "warning";
  return "info";
};

export const VisitDetail: FC<VisitDetailProps> = ({ visit, diagnosedAilments }) => {
  let triage: TriageOutput | null = null;
  let prescription: Prescription | null = null;

  try {
    if (visit.triage_output) triage = JSON.parse(visit.triage_output) as TriageOutput;
  } catch {
    // malformed — show pending
  }

  try {
    if (visit.prescription) {
      prescription = JSON.parse(visit.prescription) as Prescription;
      prescription.prescribed_therapies = [...prescription.prescribed_therapies].sort(
        (a, b) => a.priority - b.priority
      );
    }
  } catch {
    // malformed — show pending
  }

  return (
    <Layout>
      <h1>Visit Record</h1>
      <Card title="Visit overview" icon={IconDashboard}>
        <p>
          <strong>Status:</strong> <Badge text={visit.status} variant={visit.status === "open" ? "warning" : "info"} />
        </p>
        <p>
          <strong>Date:</strong> {new Date(visit.created_at).toLocaleString()}
        </p>
        <div class="page-actions">
          <Button href={`/agents/${visit.agent_id}`} icon={IconArrowLeft} variant="secondary">
            Back to agent
          </Button>
        </div>
      </Card>

      <div class="section-grid">
        <Card title="Submitted symptoms" icon={IconAppointment}>
          <blockquote>{visit.symptoms}</blockquote>
        </Card>

        <Card title="Triage" icon={IconDashboard}>
          {triage ? (
            <>
              <p>
                <strong>Severity:</strong>{" "}
                <Badge
                  text={triage.severity.toUpperCase()}
                  variant={severityVariant(triage.severity)}
                  icon={severityIcon(triage.severity)}
                />
              </p>
              <p>{triage.rationale}</p>
            </>
          ) : (
            <>
              <div class="skeleton-line" style="width: 12rem;" />
              <p>Pending triage.</p>
            </>
          )}
        </Card>

        <Card title="Diagnosis" icon={IconAilment}>
          {diagnosedAilments.length > 0 ? (
            <ul>
              {diagnosedAilments.map((ailment) => (
                <li key={ailment.id}>
                  <a href={`/ailments/${ailment.id}`}>{ailment.name}</a>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              heading="Pending diagnosis"
              description="The diagnosis phase has not been completed yet."
              icon={IconAlertTriangle}
            />
          )}
        </Card>

        <Card title="Prescription" icon={IconCheck}>
          {prescription ? (
            <>
              <ol>
                {prescription.prescribed_therapies.map((therapy) => (
                  <li key={therapy.therapy_id}>
                    <strong>{therapy.therapy_name}</strong>
                    <p>{therapy.instructions}</p>
                  </li>
                ))}
              </ol>
              <blockquote>{prescription.rationale}</blockquote>
            </>
          ) : (
            <EmptyState
              heading="Pending prescription"
              description="The prescription step is still waiting for triage and diagnosis."
              icon={IconAlertTriangle}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
};
