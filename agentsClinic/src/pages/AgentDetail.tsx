import type { FC } from "hono/jsx";
import type { Agent, Ailment, Visit } from "../db/types";
import { Layout } from "../components/Layout";

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

export const AgentDetail: FC<AgentDetailProps> = ({
  agent,
  ailments,
  visits = [],
  errors,
  formData,
}) => (
  <Layout>
    <h1>{agent.name}</h1>
    <dl>
      <dt>Model</dt>
      <dd>{agent.model_type}</dd>
      <dt>Status</dt>
      <dd>{agent.status}</dd>
      {agent.presenting_complaints && (
        <>
          <dt>Presenting Complaints</dt>
          <dd>{agent.presenting_complaints}</dd>
        </>
      )}
    </dl>

    <h2>Ailments</h2>
    {ailments.length === 0 ? (
      <p>No ailments on record.</p>
    ) : (
      <ul>
        {ailments.map((a) => (
          <li key={a.id}>
            <a href={`/ailments/${a.id}`}>{a.name}</a>
          </li>
        ))}
      </ul>
    )}

    <h2>Book an Appointment</h2>
    <form action="/appointments" method="post">
      <input type="hidden" name="agent_id" value={agent.id} />

      <label for="therapist_name">Therapist Name</label>
      <input
        type="text"
        id="therapist_name"
        name="therapist_name"
        required
        maxlength={100}
        value={formData?.therapist_name ?? ""}
        aria-describedby={errors?.therapist_name ? "err-therapist" : undefined}
      />
      {errors?.therapist_name && (
        <small id="err-therapist" class="error">
          {errors.therapist_name}
        </small>
      )}

      <label for="scheduled_at">Date &amp; Time</label>
      <input
        type="datetime-local"
        id="scheduled_at"
        name="scheduled_at"
        required
        value={formData?.scheduled_at ?? ""}
        aria-describedby={errors?.scheduled_at ? "err-scheduled" : undefined}
      />
      {errors?.scheduled_at && (
        <small id="err-scheduled" class="error">
          {errors.scheduled_at}
        </small>
      )}

      <label for="notes">Notes (optional)</label>
      <textarea
        id="notes"
        name="notes"
        maxlength={500}
        rows={3}
      >
        {formData?.notes ?? ""}
      </textarea>
      {errors?.notes && (
        <small id="err-notes" class="error">
          {errors.notes}
        </small>
      )}

      <button type="submit">Book Appointment</button>
    </form>

    <h2>Visit History</h2>
    {visits.length === 0 ? (
      <p>No visits on record.</p>
    ) : (
      <div style="overflow-x: auto">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Severity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id}>
                <td>{new Date(v.created_at).toLocaleString()}</td>
                <td>{v.status}</td>
                <td>{v.severity ?? "—"}</td>
                <td>
                  <a href={`/visits/${v.id}`}>View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Layout>
);
