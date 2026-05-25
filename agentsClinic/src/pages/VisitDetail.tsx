import type { FC } from "hono/jsx";
import type { Ailment, Visit } from "../db/types";
import { Layout } from "../components/Layout";

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

export const VisitDetail: FC<VisitDetailProps> = ({ visit, diagnosedAilments }) => {
  let triage: TriageOutput | null = null;
  let prescription: Prescription | null = null;

  try {
    if (visit.triage_output) triage = JSON.parse(visit.triage_output) as TriageOutput;
  } catch { /* malformed — show pending */ }

  try {
    if (visit.prescription) {
      prescription = JSON.parse(visit.prescription) as Prescription;
      prescription.prescribed_therapies = [...prescription.prescribed_therapies].sort(
        (a, b) => a.priority - b.priority
      );
    }
  } catch { /* malformed — show pending */ }

  return (
    <Layout>
      <h1>Visit Record</h1>
      <p>
        <strong>Status:</strong> {visit.status}&ensp;
        <strong>Date:</strong> {new Date(visit.created_at).toLocaleString()}
      </p>

      <section>
        <h2>Submitted Symptoms</h2>
        <blockquote>{visit.symptoms}</blockquote>
      </section>

      <section>
        <h2>Triage</h2>
        {triage ? (
          <>
            <p>
              <strong>Severity:</strong> <mark>{triage.severity.toUpperCase()}</mark>
            </p>
            <p>{triage.rationale}</p>
          </>
        ) : (
          <p><em>Pending triage.</em></p>
        )}
      </section>

      <section>
        <h2>Diagnosis</h2>
        {diagnosedAilments.length > 0 ? (
          <ul>
            {diagnosedAilments.map((a) => (
              <li key={a.id}>
                <a href={`/ailments/${a.id}`}>{a.name}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p><em>Pending diagnosis.</em></p>
        )}
      </section>

      <section>
        <h2>Prescription</h2>
        {prescription ? (
          <>
            <ol>
              {prescription.prescribed_therapies.map((t) => (
                <li key={t.therapy_id}>
                  <strong>{t.therapy_name}</strong>
                  <p>{t.instructions}</p>
                </li>
              ))}
            </ol>
            <blockquote>{prescription.rationale}</blockquote>
          </>
        ) : (
          <p><em>Pending prescription.</em></p>
        )}
      </section>

      <p>
        <a href={`/agents/${visit.agent_id}`}>← Back to agent</a>
      </p>
    </Layout>
  );
};
