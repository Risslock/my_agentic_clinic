import type { FC } from "hono/jsx";
import type { Agent } from "../db/types";
import { Layout } from "../components/Layout";

export type AgentsListProps = { agents: Agent[] };

export const AgentsList: FC<AgentsListProps> = ({ agents }) => (
  <Layout>
    <h1>Agents</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Model</th>
          <th>Status</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  </Layout>
);
