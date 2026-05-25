import type { FC } from "hono/jsx";
import type { Agent, Ailment } from "../db/types";
import { Layout } from "../components/Layout";

export type AgentDetailProps = { agent: Agent; ailments: Pick<Ailment, "name">[] };

export const AgentDetail: FC<AgentDetailProps> = ({ agent, ailments }) => (
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
          <li key={a.name}>{a.name}</li>
        ))}
      </ul>
    )}
  </Layout>
);
